<?php
/*
 * api.php — SQLite persistence + auth + throttle for the Roadmaps app.
 *
 * This file lives in the PRIVATE roadmapper/ directory, OUTSIDE the web root; it
 * is reached only through the thin public/sync.php forwarder. Because its
 * __DIR__ is roadmapper/, the secret (.env), the SQLite database and the session
 * files it references all resolve inside this private directory — none of them
 * sit under the docroot.
 *
 * The SQLite database is the single source of truth for all journey state
 * (ticks, moves, soft ticks, notes, flags). The client mirrors it in memory for
 * the session and writes every change straight through to here. See DESIGN.md
 * §6, §8.
 *
 * Actions (data actions require a valid session — see AUTH):
 *   GET  ?action=status            -> { ok, authed }
 *   POST ?action=login {password}  -> verify bcrypt, apply escalating throttle,
 *                                     create session on success
 *   POST ?action=logout            -> destroy session
 *   GET  ?action=load[&roadmap=s]  -> { ok, empty, savedAt, data:{ "slugitem_id": {kind,value}, ...} }
 *   POST ?action=save              -> { roadmap?, changes:[{id,kind,value|null}], clear?, full?:{...},
 *                                       clearAll?, stashFirst?, reason? }
 *                                     Upserts changed rows, deletes rows whose value is null
 *                                     (return-to-default), guards empty overwrites, stashes.
 *                                     clear:true empties that roadmap first; clearAll:true empties
 *                                     the journey (stashed). Refused cells come back in `rejected`.
 *   POST ?action=stash {roadmap?, reason?} -> snapshot rows into journey_stash (last 20 kept)
 *   GET  ?action=search&q=&type=   -> { ok, type, q, fetched, results:[{title,url,thumb,source}] }
 *                                     Best-effort discovery proxy (YouTube / DuckDuckGo). Auth
 *                                     required, fixed hosts, no client URL. fetched:false => the
 *                                     client falls back to a results-page link. Touches no DB.
 *
 * Every POST must be same-origin JSON (Content-Type: application/json); see
 * require_same_origin_json().
 *
 * The DB stores ONLY deviations from default: absence of a row = "not done / on
 * origin / unset". A newly authored roadmap needs zero rows (DESIGN.md §7).
 */

// Never render PHP notices/warnings into the response body: on a host that ships
// display_errors=On, a stray warning would leak an absolute path ahead of the JSON
// (and corrupt the payload). Log them instead. Defense-in-depth alongside the
// input validation below.
ini_set("display_errors", "0");
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Cache-Control: no-cache, no-store, must-revalidate");

const DB_FILE          = __DIR__ . "/journey.sqlite";
const SESSION_NAME     = "roadmaps_sid";
const MAX_BODY_BYTES   = 8 * 1024 * 1024;
const MAX_VALUE_BYTES  = 256 * 1024;   // per-cell cap — generous for notes/bookmarks, blocks 8MB single-value bloat
const STASH_KEEP       = 20;
const THROTTLE_WINDOW  = 5;          // wrong attempts before a lock kicks in
const THROTTLE_UNIT    = 60;         // seconds per strike (strike 1 => 60s, strike 2 => 120s, ...)
const THROTTLE_MAX_LOCK = 1800;      // a lock never exceeds 30 min, however many strikes pile up
const THROTTLE_DECAY   = 86400;      // a quiet day (no attempts, not locked) forgives all strikes
const THROTTLE_PRUNE   = 30 * 86400; // stale throttle rows are deleted after a month
const SQLITE_MIN       = "3.24.0";   // UPSERT (INSERT … ON CONFLICT DO UPDATE) needs 3.24+
// Every JSON response survives a stray invalid UTF-8 byte (e.g. a scraped search
// title) instead of json_encode() returning false and emitting an empty 200 body.
const JSON_OUT         = JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE;
const VERIFY_DELAY_US  = 250000;     // small constant delay per verify, blunts online guessing
// Roadmap slug and item id are joined with US (unit separator) into one map key
// for transport, so the client sees a flat { "slugitem": {...} } object.
const KEY_SEP          = "\x01";

function fail(int $code, string $msg, array $extra = []): void {
    http_response_code($code);
    echo json_encode(array_merge(["ok" => false, "error" => $msg], $extra), JSON_OUT);
    exit;
}

/** Cut a string to at most $max BYTES without splitting a UTF-8 character (a split
 *  character is invalid UTF-8, which would later break json_encode on load). */
function clip_bytes(string $s, int $max): string {
    if (strlen($s) <= $max) return $s;
    $s = substr($s, 0, $max);
    while ($s !== "" && preg_match('//u', $s) !== 1) $s = substr($s, 0, -1);
    return $s;
}

/** Minimal .env reader: KEY=VALUE lines, `#` comments, optional surrounding quotes. */
function load_env(string $file): array {
    $out = [];
    if (!is_file($file) || !is_readable($file)) return $out;
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = ltrim($line);
        if ($line === "" || $line[0] === "#") continue;
        $eq = strpos($line, "=");
        if ($eq === false) continue;
        $k = trim(substr($line, 0, $eq));
        $v = trim(substr($line, $eq + 1));
        if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && substr($v, -1) === $v[0]) {
            $v = substr($v, 1, -1);
        }
        if ($k !== "") $out[$k] = $v;
    }
    return $out;
}

/**
 * Start (or resume) the session. With $create=false we never mint a session for
 * an anonymous visitor: no cookie in the request means no session, so casual
 * traffic leaves no server-side litter and stays unauthed.
 */
function session_boot(bool $create, int $lifetime): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $sid = (string)($_COOKIE[SESSION_NAME] ?? "");
    if (!$create && $sid === "") return;
    $dir = __DIR__ . "/.sessions";
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    $ownDir = is_dir($dir) && is_writable($dir);
    if ($ownDir) session_save_path($dir);
    else error_log("roadmaps: $dir is not writable — sessions fall back to the system save path");
    // A cookie naming a session that doesn't exist must NOT start one: with strict
    // mode PHP would mint a fresh session (a new file) per request, so any client
    // replaying a junk cookie could fill the disk without ever logging in. Treat
    // it as logged-out and expire the dead cookie instead.
    if (!$create) {
        $known = preg_match('/^[A-Za-z0-9,-]{16,128}$/', $sid) === 1
            && (!$ownDir || is_file("$dir/sess_$sid"));
        if (!$known) { clear_session_cookie(); return; }
    }
    ini_set("session.gc_maxlifetime", (string)$lifetime);
    ini_set("session.use_strict_mode", "1");
    session_name(SESSION_NAME);
    session_set_cookie_params([
        "lifetime" => $lifetime,
        "path"     => "/",
        "secure"   => req_is_https(),   // don't leak the session cookie over plain HTTP
        "httponly" => true,
        "samesite" => "Lax",
    ]);
    session_start();
}

function clear_session_cookie(): void {
    if (headers_sent()) return;
    setcookie(SESSION_NAME, "", [
        "expires"  => time() - 42000,
        "path"     => "/",
        "secure"   => req_is_https(),
        "httponly" => true,
        "samesite" => "Lax",
    ]);
}

function is_authed(): bool {
    return !empty($_SESSION["authed"])
        && isset($_SESSION["expires"])
        && (int)$_SESSION["expires"] > time();
}

function require_auth(int $lifetime): void {
    session_boot(false, $lifetime);
    if (!is_authed()) fail(401, "authentication required");
    // Data actions only READ the session. Release its file lock now, so a slow
    // request (a search proxy can take seconds) never stalls a save from the same
    // browser queued behind it on the session lock.
    session_write_close();
}

function db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    // The whole setup is guarded, not just the open: an unwritable directory makes
    // the WAL pragma / CREATE TABLE throw, and that must be a clean JSON 500 with a
    // log line rather than an empty response.
    try {
        $pdo = new PDO("sqlite:" . DB_FILE);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $ver = (string)$pdo->query("SELECT sqlite_version()")->fetchColumn();
        if (version_compare($ver, SQLITE_MIN, "<")) {
            error_log("roadmaps: SQLite $ver is too old; " . SQLITE_MIN . "+ is required");
            $pdo = null;
            fail(500, "database unavailable");
        }
        $pdo->exec("PRAGMA journal_mode = WAL");
        $pdo->exec("PRAGMA busy_timeout = 5000");
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS journey_state (
                roadmap    TEXT NOT NULL,
                item_id    TEXT NOT NULL,
                kind       TEXT NOT NULL,
                value      TEXT,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (roadmap, item_id)
            );
            CREATE INDEX IF NOT EXISTS idx_journey_roadmap ON journey_state(roadmap);

            CREATE TABLE IF NOT EXISTS app_kv (
                key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS roadmap_registry (
                roadmap TEXT PRIMARY KEY,
                schema_version INTEGER NOT NULL DEFAULT 1,
                first_seen TEXT NOT NULL, updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS journey_stash (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL, reason TEXT, data_json TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS journey_meta (
                key TEXT PRIMARY KEY, value TEXT
            );

            CREATE TABLE IF NOT EXISTS login_throttle (
                id TEXT PRIMARY KEY,
                fails INTEGER NOT NULL DEFAULT 0,
                strikes INTEGER NOT NULL DEFAULT 0,
                locked_until INTEGER,
                updated_at TEXT NOT NULL
            );
        ");
    } catch (Throwable $e) {
        error_log("roadmaps: cannot open/initialise journey.sqlite: " . $e->getMessage());
        $pdo = null;
        fail(500, "database unavailable");
    }
    return $pdo;
}

/** POST bodies must be same-origin JSON. A plain HTML form cannot send
 *  Content-Type: application/json, and a cross-origin fetch that does must pass a
 *  CORS preflight this API never grants — so this closes form-based CSRF even from
 *  a sibling subdomain, where SameSite=Lax cookies are still sent. */
function require_same_origin_json(): void {
    $site = strtolower((string)($_SERVER["HTTP_SEC_FETCH_SITE"] ?? ""));
    if ($site !== "" && $site !== "same-origin" && $site !== "none") fail(403, "cross-site request refused");
    $ct = strtolower(trim((string)($_SERVER["CONTENT_TYPE"] ?? $_SERVER["HTTP_CONTENT_TYPE"] ?? "")));
    if (strpos($ct, "application/json") !== 0) fail(415, "expected application/json");
}

function now_iso(): string { return gmdate("c"); }

/** True when the current request arrived over HTTPS (directly or via a proxy). */
function req_is_https(): bool {
    if (!empty($_SERVER["HTTPS"]) && strtolower((string)$_SERVER["HTTPS"]) !== "off") return true;
    if (strtolower((string)($_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "")) === "https") return true;
    return ((int)($_SERVER["SERVER_PORT"] ?? 0)) === 443;
}

function read_body(): array {
    $raw = file_get_contents("php://input", false, null, 0, MAX_BODY_BYTES + 1);
    if ($raw === false || $raw === "") fail(400, "empty request body");
    if (strlen($raw) > MAX_BODY_BYTES) fail(413, "payload too large");
    $body = json_decode($raw, true);
    if (!is_array($body)) fail(400, "body is not valid JSON");
    return $body;
}

/* ------------------------------------------------------------------ *
 *  Escalating login throttle (DESIGN.md §8.3), keyed by hashed IP.
 *  5 wrong -> lock 1 min; 5 more -> 2 min; and so on.
 * ------------------------------------------------------------------ */

function throttle_id(): string {
    $ip = $_SERVER["REMOTE_ADDR"] ?? "cli";
    // Hash so raw IPs never touch the DB; salted with the server path so the
    // table isn't a rainbow of well-known addresses.
    return substr(hash("sha256", $ip . "|" . __DIR__), 0, 32);
}

/** The throttle row for an id, with strike DECAY applied: once an id has been quiet
 *  (not locked, no attempt) for THROTTLE_DECAY seconds, its history is forgiven. The
 *  statement cursor is closed before returning — an open SELECT keeps a read lock
 *  that makes a following write on the same connection fail with "database is locked". */
function throttle_row(PDO $pdo, string $id): array {
    $st = $pdo->prepare("SELECT fails, strikes, locked_until, updated_at FROM login_throttle WHERE id = ?");
    $st->execute([$id]);
    $r = $st->fetch(PDO::FETCH_ASSOC);
    $st->closeCursor();
    $clean = ["fails" => 0, "strikes" => 0, "locked_until" => null];
    if (!$r) return $clean;
    $now = time();
    $locked = $r["locked_until"] !== null && (int)$r["locked_until"] > $now;
    $last = strtotime((string)$r["updated_at"]) ?: 0;
    if (!$locked && $last < $now - THROTTLE_DECAY) return $clean;
    return ["fails" => (int)$r["fails"], "strikes" => (int)$r["strikes"],
            "locked_until" => $r["locked_until"] === null ? null : (int)$r["locked_until"]];
}

/** @return array{locked:bool, retryAfter:int, remaining:int} */
function throttle_check(PDO $pdo, string $id): array {
    $r = throttle_row($pdo, $id);
    $now = time();
    if ($r["locked_until"] !== null && $r["locked_until"] > $now) {
        return ["locked" => true, "retryAfter" => $r["locked_until"] - $now, "remaining" => 0];
    }
    return ["locked" => false, "retryAfter" => 0, "remaining" => max(0, THROTTLE_WINDOW - $r["fails"])];
}

/** Record a wrong attempt; escalate to a lock when the window fills. @return array */
function throttle_fail(PDO $pdo, string $id): array {
    $now = time();
    $r = throttle_row($pdo, $id);
    $fails   = $r["fails"] + 1;
    $strikes = $r["strikes"];
    $lockedUntil = null;
    $retryAfter = 0;
    if ($fails >= THROTTLE_WINDOW) {
        $strikes += 1;
        // strike 1 => 60s, 2 => 120s, ... capped, so a shared IP can't be locked for hours
        $retryAfter  = min($strikes * THROTTLE_UNIT, THROTTLE_MAX_LOCK);
        $lockedUntil = $now + $retryAfter;
        $fails = 0;                                    // reset the window; strike count persists
    }
    $pdo->prepare(
        "INSERT INTO login_throttle (id, fails, strikes, locked_until, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
            fails=excluded.fails, strikes=excluded.strikes,
            locked_until=excluded.locked_until, updated_at=excluded.updated_at"
    )->execute([$id, $fails, $strikes, $lockedUntil, now_iso()]);
    return [
        "locked"     => $lockedUntil !== null,
        "retryAfter" => $retryAfter,
        "remaining"  => $lockedUntil !== null ? 0 : max(0, THROTTLE_WINDOW - $fails),
    ];
}

function throttle_clear(PDO $pdo, string $id): void {
    $pdo->prepare("DELETE FROM login_throttle WHERE id = ?")->execute([$id]);
}

/** Drop throttle rows nobody has touched for a month (and that aren't locked), so
 *  the table can't grow forever from one-off addresses. */
function throttle_prune(PDO $pdo): void {
    $pdo->prepare("DELETE FROM login_throttle WHERE updated_at < ? AND (locked_until IS NULL OR locked_until < ?)")
        ->execute([gmdate("c", time() - THROTTLE_PRUNE), time()]);
}

/**
 * Reserve one login attempt ATOMICALLY, before the password is checked. The lock
 * check and the fail counter run inside one write transaction, so N parallel
 * requests are counted as exactly N attempts (serialised by SQLite) instead of all
 * slipping through a check-then-count gap. The attempt is counted up front; a
 * correct password then clears the row.
 * @return array{locked:bool, retryAfter:int, remaining:int} locked => refuse now
 */
function throttle_reserve(PDO $pdo, string $id): array {
    $pdo->exec("BEGIN IMMEDIATE");
    try {
        $state = throttle_check($pdo, $id);
        if (!$state["locked"]) {
            $after = throttle_fail($pdo, $id);
            // This attempt was reserved inside the window, so it is still evaluated
            // even when it is the one that fills the window and sets the lock.
            $state = ["locked" => false, "retryAfter" => $after["retryAfter"],
                      "remaining" => $after["remaining"], "lockedAfter" => $after["locked"]];
        }
        $pdo->exec("COMMIT");
        return $state;
    } catch (Throwable $e) {
        try { $pdo->exec("ROLLBACK"); } catch (Throwable $_) {}
        throw $e;
    }
}

/* ------------------------------------------------------------------ *
 *  Journey state helpers
 * ------------------------------------------------------------------ */

/** Load the whole journey (or one roadmap) as a flat map "slug\x01item" => {kind,value}. */
function load_state(PDO $pdo, ?string $roadmap): array {
    if ($roadmap !== null) {
        $st = $pdo->prepare("SELECT roadmap, item_id, kind, value FROM journey_state WHERE roadmap = ?");
        $st->execute([$roadmap]);
    } else {
        $st = $pdo->query("SELECT roadmap, item_id, kind, value FROM journey_state");
    }
    $out = [];
    foreach ($st as $row) {
        $out[$row["roadmap"] . KEY_SEP . $row["item_id"]] = [
            "kind"  => $row["kind"],
            "value" => $row["value"],
        ];
    }
    return $out;
}

function count_state(PDO $pdo, ?string $roadmap): int {
    if ($roadmap !== null) {
        $st = $pdo->prepare("SELECT COUNT(*) FROM journey_state WHERE roadmap = ?");
        $st->execute([$roadmap]);
        return (int)$st->fetchColumn();
    }
    return (int)$pdo->query("SELECT COUNT(*) FROM journey_state")->fetchColumn();
}

function insert_stash(PDO $pdo, array $snapshot, string $reason): void {
    if (!$snapshot) return;
    $json = json_encode($snapshot, JSON_OUT);
    // An identical snapshot to the newest stash adds nothing — and inserting it
    // anyway would push a genuinely different older backup out of the keep-window.
    $st = $pdo->query("SELECT data_json FROM journey_stash ORDER BY id DESC LIMIT 1");
    $latest = $st->fetchColumn();
    $st->closeCursor();
    if ($latest === $json) return;
    $pdo->prepare("INSERT INTO journey_stash (created_at, reason, data_json) VALUES (?, ?, ?)")
        ->execute([now_iso(), clip_bytes($reason, 64), $json]);
    $pdo->exec("DELETE FROM journey_stash WHERE id NOT IN
                (SELECT id FROM journey_stash ORDER BY id DESC LIMIT " . STASH_KEEP . ")");
}

function touch_registry(PDO $pdo, string $roadmap): void {
    if ($roadmap === "") return;
    $pdo->prepare(
        "INSERT INTO roadmap_registry (roadmap, schema_version, first_seen, updated_at)
         VALUES (?, 1, ?, ?)
         ON CONFLICT(roadmap) DO UPDATE SET updated_at = excluded.updated_at"
    )->execute([$roadmap, now_iso(), now_iso()]);
}

/** Validate a slug: lowercase letters/digits/hyphen. Keeps item ids namespaced cleanly. */
function valid_slug(string $s): bool {
    return $s !== "" && preg_match('/^[a-z0-9][a-z0-9-]{0,63}$/', $s) === 1;
}

/* ------------------------------------------------------------------ *
 *  Dispatch
 * ------------------------------------------------------------------ */

// A test harness may `require` this file purely for its pure helpers (valid_slug,
// normalize_full, throttle_*) without ever running a request or opening the real
// database — it defines this constant first, and we stop here. Never defined in
// production, so the dispatch below always runs normally when served.
if (defined("ROADMAPS_TEST_HARNESS")) return;

$action = $_GET["action"] ?? "";
$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

$ENV = load_env(__DIR__ . "/.env");
$PW_HASH = (string)($ENV["JOURNEY_PASSWORD_HASH"] ?? "");
$EXPIRY_DAYS = (isset($ENV["SESSION_EXPIRY_DAYS"]) && (int)$ENV["SESSION_EXPIRY_DAYS"] > 0)
    ? (int)$ENV["SESSION_EXPIRY_DAYS"] : 7;
$SESSION_LIFETIME = $EXPIRY_DAYS * 86400;

if ($method === "POST") require_same_origin_json();

switch ($action) {
    case "status":
        if ($method !== "GET") fail(405, "status is GET-only");
        session_boot(false, $SESSION_LIFETIME);
        $authed = is_authed();
        if (session_status() === PHP_SESSION_ACTIVE) session_write_close();   // read-only
        echo json_encode(["ok" => true, "authed" => $authed, "expiresInDays" => $EXPIRY_DAYS]);
        break;

    case "login": {
        if ($method !== "POST") fail(405, "login is POST-only");
        if ($PW_HASH === "") fail(500, "server has no secret configured");
        $pdo = db();
        $tid = throttle_id();

        // Count this attempt first (atomically), THEN verify — see throttle_reserve.
        try { $state = throttle_reserve($pdo, $tid); }
        catch (Throwable $e) {
            error_log("roadmaps: throttle failed: " . $e->getMessage());
            fail(503, "busy, try again");
        }
        if ($state["locked"]) {
            fail(429, "locked", ["retryAfter" => $state["retryAfter"], "remaining" => 0]);
        }

        $body = read_body();
        $pw = isset($body["password"]) && is_string($body["password"]) ? $body["password"] : "";
        usleep(VERIFY_DELAY_US);

        // Verify BEFORE creating any session: a failed attempt must never mint a
        // server-side session file (anti disk-fill), and only a correct secret
        // clears the throttle.
        if ($pw === "" || !password_verify($pw, $PW_HASH)) {
            fail(401, "incorrect secret", [
                "remaining"  => $state["remaining"],
                "locked"     => $state["lockedAfter"],
                "retryAfter" => $state["retryAfter"],
            ]);
        }

        throttle_clear($pdo, $tid);
        throttle_prune($pdo);
        session_boot(true, $SESSION_LIFETIME);
        session_regenerate_id(true);
        $_SESSION["authed"]  = true;
        $_SESSION["expires"] = time() + $SESSION_LIFETIME;
        // Expired session files are otherwise only collected by PHP's probabilistic GC,
        // which many hosts disable for a custom save path.
        if (function_exists("session_gc")) @session_gc();
        echo json_encode(["ok" => true, "expiresInDays" => $EXPIRY_DAYS]);
        break;
    }

    case "logout":
        // POST-only like every other state-changing action, so a cross-site
        // top-level GET (SameSite=Lax still sends the cookie) can't force a logout.
        if ($method !== "POST") fail(405, "logout is POST-only");
        session_boot(false, $SESSION_LIFETIME);
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION = [];
            clear_session_cookie();
            session_destroy();
        }
        echo json_encode(["ok" => true]);
        break;

    case "load": {
        if ($method !== "GET") fail(405, "load is GET-only");
        require_auth($SESSION_LIFETIME);
        $pdo = db();
        $roadmap = isset($_GET["roadmap"]) ? (string)$_GET["roadmap"] : null;
        if ($roadmap !== null && !valid_slug($roadmap)) fail(400, "bad roadmap slug");
        $data = load_state($pdo, $roadmap);
        $savedAt = $pdo->query("SELECT value FROM journey_meta WHERE key = 'saved_at'")->fetchColumn();
        echo json_encode([
            "ok"      => true,
            "empty"   => count($data) === 0,
            "savedAt" => $savedAt === false ? null : $savedAt,
            "data"    => (object)$data,
        ], JSON_OUT);
        break;
    }

    case "save": {
        if ($method !== "POST") fail(405, "save is POST-only");
        require_auth($SESSION_LIFETIME);
        $body = read_body();

        // A save is scoped either to one roadmap (roadmap + changes[]) or is a
        // full replacement of the whole journey (full:{ "slug\x01item": {kind,value} }).
        $scope = isset($body["roadmap"]) ? (string)$body["roadmap"] : null;
        if ($scope !== null && !valid_slug($scope)) fail(400, "bad roadmap slug");
        $isFull = isset($body["full"]) && is_array($body["full"]);
        $clearAll = ($body["clearAll"] ?? false) === true;
        // Validate the request shape BEFORE taking the write lock.
        if (!$isFull && !$clearAll && $scope === null) fail(400, "save needs roadmap+changes, full, or clearAll");
        $reason = clip_bytes((string)($body["reason"] ?? ""), 64);

        $pdo = db();
        $now = now_iso();
        $pdo->exec("BEGIN IMMEDIATE");
        try {
            if ($clearAll) {
                // "Reset everything": an explicit, separately-flagged request (an empty
                // `full` is still refused by the guard below). Always stashed first.
                insert_stash($pdo, load_state($pdo, null), $reason !== "" ? $reason : "reset-all");
                $pdo->exec("DELETE FROM journey_state");
                write_saved_at($pdo, $now);
                $pdo->exec("COMMIT");
                echo json_encode(["ok" => true, "savedAt" => $now, "keys" => 0]);
                break;
            }
            if ($isFull) {
                // Full-journey replacement (import / whole-journey restore).
                $incoming = normalize_full($body["full"]);
                $existingCount = count_state($pdo, null);

                // HARD GUARD: an empty snapshot must never wipe a populated journey.
                // Nothing is changed, so nothing is stashed either (a stash here would
                // only push a real backup out of the keep-window).
                if (count($incoming) === 0 && $existingCount > 0) {
                    $pdo->exec("COMMIT");
                    echo json_encode(["ok" => true, "skipped" => "empty-overwrite-protected",
                                      "keys" => $existingCount]);
                    break;
                }
                if ($existingCount > 0 && !empty($body["stashFirst"])) {
                    insert_stash($pdo, load_state($pdo, null), $reason !== "" ? $reason : "replaced-by-full-save");
                }
                $pdo->exec("DELETE FROM journey_state");
                $ins = $pdo->prepare(
                    "INSERT INTO journey_state (roadmap, item_id, kind, value, updated_at)
                     VALUES (?, ?, ?, ?, ?)"
                );
                $slugs = [];
                foreach ($incoming as $rowKey => $cell) {
                    [$slug, $item] = explode(KEY_SEP, $rowKey, 2);
                    $ins->execute([$slug, $item, $cell["kind"], $cell["value"], $now]);
                    $slugs[$slug] = true;
                }
                foreach (array_keys($slugs) as $slug) touch_registry($pdo, $slug);
                write_saved_at($pdo, $now);
                $pdo->exec("COMMIT");
                echo json_encode(["ok" => true, "savedAt" => $now, "keys" => count($incoming)]);
                break;
            }

            // Incremental change set for one roadmap.
            $changes = isset($body["changes"]) && is_array($body["changes"]) ? $body["changes"] : [];

            // Optional per-roadmap import: stash the roadmap's current rows first.
            if (!empty($body["stashFirst"])) {
                $cur = load_state($pdo, $scope);
                if ($cur) insert_stash($pdo, $cur, $reason !== "" ? $reason : "replaced-by-save");
            }
            // Reset / import of one roadmap: drop EVERY stored row of it first — including
            // rows the client never had in memory (e.g. progress on content it doesn't know).
            if (($body["clear"] ?? false) === true) {
                $pdo->prepare("DELETE FROM journey_state WHERE roadmap = ?")->execute([$scope]);
            }

            $del = $pdo->prepare("DELETE FROM journey_state WHERE roadmap = ? AND item_id = ?");
            $up  = $pdo->prepare(
                "INSERT INTO journey_state (roadmap, item_id, kind, value, updated_at)
                 VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(roadmap, item_id) DO UPDATE SET
                    kind=excluded.kind, value=excluded.value, updated_at=excluded.updated_at"
            );
            $applied = 0;
            $rejected = [];     // ids the server refused — reported, never silently "saved"
            foreach ($changes as $ch) {
                if (!is_array($ch) || !isset($ch["id"]) || !is_string($ch["id"])) { $rejected[] = null; continue; }
                $item = $ch["id"];
                if ($item === "" || strlen($item) > 256) { $rejected[] = clip_bytes($item, 64); continue; }
                // value === null  =>  return to default: delete the row.
                if (!array_key_exists("value", $ch) || $ch["value"] === null) {
                    $del->execute([$scope, $item]);
                } else {
                    $kind  = isset($ch["kind"]) && is_string($ch["kind"]) ? clip_bytes($ch["kind"], 64) : "task";
                    $value = is_string($ch["value"]) ? $ch["value"]
                           : json_encode($ch["value"], JSON_UNESCAPED_SLASHES);
                    if (!is_string($value) || strlen($value) > MAX_VALUE_BYTES) { $rejected[] = $item; continue; }
                    $up->execute([$scope, $item, $kind, $value, $now]);
                }
                $applied++;
            }
            touch_registry($pdo, $scope);
            write_saved_at($pdo, $now);
            $keys = count_state($pdo, $scope);
            $pdo->exec("COMMIT");
            $resp = ["ok" => true, "savedAt" => $now, "applied" => $applied, "keys" => $keys];
            if ($rejected) $resp["rejected"] = $rejected;
            echo json_encode($resp, JSON_OUT);
        } catch (Throwable $e) {
            try { $pdo->exec("ROLLBACK"); } catch (Throwable $_) {}
            error_log("roadmaps: save failed: " . $e->getMessage());
            fail(500, "save failed");
        }
        break;
    }

    case "stash": {
        if ($method !== "POST") fail(405, "stash is POST-only");
        require_auth($SESSION_LIFETIME);
        $body = read_body();
        $pdo = db();
        $roadmap = isset($body["roadmap"]) ? (string)$body["roadmap"] : null;
        if ($roadmap !== null && !valid_slug($roadmap)) fail(400, "bad roadmap slug");
        insert_stash($pdo, load_state($pdo, $roadmap), clip_bytes((string)($body["reason"] ?? "manual"), 64));
        echo json_encode(["ok" => true]);
        break;
    }

    case "search": {
        // Discovery proxy: fetch a few candidate videos/articles for a query so
        // the client can surface a "watch/read next" card. The browser can't do
        // this itself (CORS + no API key). Locked down: auth required, GET only,
        // fixed upstream hosts, query URL-encoded — the client NEVER supplies a
        // URL, only a text query and a type. On any outbound failure this returns
        // fetched:false with an empty list, and the client falls back to a
        // deep-link-to-results card, so it degrades gracefully.
        if ($method !== "GET") fail(405, "search is GET-only");
        require_auth($SESSION_LIFETIME);
        $q = isset($_GET["q"]) ? (string)$_GET["q"] : "";
        $q = preg_replace('/[\x00-\x1f\x7f]+/u', " ", $q);   // strip control chars
        $q = trim(preg_replace('/\s+/u', " ", $q));
        $q = function_exists("mb_substr") ? mb_substr($q, 0, 160) : substr($q, 0, 160);
        if ($q === "") fail(400, "empty query");
        $type = (($_GET["type"] ?? "") === "article") ? "article" : "video";
        $diag = null;
        $results = ($type === "article") ? search_articles($q, $diag) : search_youtube($q, $diag);
        $resp = [
            "ok"      => true,
            "type"    => $type,
            "q"       => $q,
            "fetched" => count($results) > 0,   // false => client shows its deep-link fallback
            "results" => array_slice($results, 0, 6),
        ];
        // ?debug=1 adds non-sensitive scrape diagnostics (http code, byte count,
        // curl error, parsed count) so a "nothing found" can be pinpointed. Safe
        // to leave in: auth-gated, opt-in, exposes no secrets.
        if (($_GET["debug"] ?? "") === "1") $resp["debug"] = ["fetch" => $diag, "parsed" => count($results)];
        echo json_encode($resp, JSON_OUT);
        break;
    }

    default:
        fail(400, "unknown action; use status, login, logout, load, save, search, or stash");
}

/* ---------- discovery search (server-side proxy) ---------------------------
 * Small, best-effort scrapers with no third-party dependency and no API key.
 * They are intentionally forgiving: the query is derived from task text, so a
 * rough match is fine (the user asked for "interesting", not "perfect"). Any
 * failure returns [] and the client renders its own results-page link instead.
 */

/**
 * GET a URL over HTTP(S) with a short timeout. Returns the (decoded) body or
 * null. Reports diagnostics into $diag: { url, http, bytes, err } — so a caller
 * can tell "network failed" from "fetched fine but parsed nothing".
 *   - CURLOPT_ENCODING "" makes curl advertise gzip/deflate/br AND auto-decode,
 *     otherwise YouTube's compressed HTML arrives as bytes the regex can't read.
 *   - A real browser UA + consent cookie avoid the stripped/interstitial pages
 *     these sites serve to bots.
 */
function http_fetch(string $url, ?array &$diag = null, array $headers = [], int $timeout = 8): ?string {
    $diag = ["url" => $url, "http" => 0, "bytes" => 0, "err" => "curl-missing"];
    if (!function_exists("curl_init")) return null;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_TIMEOUT         => $timeout,
        CURLOPT_CONNECTTIMEOUT  => 5,
        CURLOPT_FOLLOWLOCATION  => true,
        CURLOPT_MAXREDIRS       => 4,
        CURLOPT_ENCODING        => "",     // accept + auto-decode gzip/deflate/br
        CURLOPT_USERAGENT       => "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                                 . "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        CURLOPT_HTTPHEADER      => array_merge([
            "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language: en-US,en;q=0.9",
        ], $headers),
    ]);
    // Pin to HTTP(S) so neither the URL nor a redirect can reach file://, gopher://, etc.
    // Unconditional: fall back to the well-known numeric flags (HTTP=1, HTTPS=2) on
    // the rare build where the constants aren't defined, so the pin is never skipped.
    $web = (defined("CURLPROTO_HTTP") ? CURLPROTO_HTTP : 1) | (defined("CURLPROTO_HTTPS") ? CURLPROTO_HTTPS : 2);
    curl_setopt($ch, CURLOPT_PROTOCOLS, $web);
    curl_setopt($ch, CURLOPT_REDIR_PROTOCOLS, $web);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    if (PHP_VERSION_ID < 80000) curl_close($ch);   // a no-op since PHP 8.0, deprecated in 8.5
    $diag = ["url" => $url, "http" => $code, "bytes" => is_string($body) ? strlen($body) : 0, "err" => $err];
    if (!is_string($body) || $code < 200 || $code >= 400) return null;
    return $body;
}

/** Parse YouTube's results page for a handful of {title,url,thumb} videos. */
function search_youtube(string $q, ?array &$diag = null): array {
    // hl/gl + a consent cookie steer past the EU consent interstitial and pin
    // English results; sp=EgIQAQ== filters to type:Video.
    $url = "https://www.youtube.com/results?search_query=" . urlencode($q) . "&hl=en&gl=US&sp=EgIQAQ%3D%3D";
    $html = http_fetch($url, $diag, ["Cookie: CONSENT=YES+cb; SOCS=CAI"]);
    return $html === null ? [] : parse_youtube($html);
}

function parse_youtube(string $html): array {
    // Work within the ytInitialData blob when present, else the whole page.
    $at = strpos($html, "ytInitialData");
    $scan = $at !== false ? substr($html, $at, 3000000) : $html;
    $out = []; $seen = [];
    // Find every videoId, then in the span up to the NEXT videoId look for the
    if (preg_match_all('/"videoId":"([\w-]{11})"/', $scan, $ids, PREG_OFFSET_CAPTURE)) {
        $pos = $ids[1];
        $n = count($pos);
        for ($i = 0; $i < $n; $i++) {
            $id = $pos[$i][0];
            if (isset($seen[$id])) continue;
            $start = $pos[$i][1];
            $end = ($i + 1 < $n) ? $pos[$i + 1][1] : min(strlen($scan), $start + 700);
            $window = substr($scan, $start, $end - $start);
            if (preg_match('/"title":\{(?:"runs":\[\{"text":"|[^{}]*?"simpleText":")((?:\\\\.|[^"\\\\])*)"/',
                    $window, $mt)) {
                $title = json_decode('"' . $mt[1] . '"');
                if (!is_string($title) || $title === "") continue;
                $seen[$id] = true;
                $out[] = [
                    "title"  => $title,
                    "url"    => "https://www.youtube.com/watch?v=" . $id,
                    "thumb"  => "https://i.ytimg.com/vi/" . $id . "/hqdefault.jpg",
                    "source" => "YouTube",
                ];
                if (count($out) >= 6) break;
            }
        }
    }
    return $out;
}

/** Parse DuckDuckGo's HTML endpoint for a handful of {title,url} articles. */
function search_articles(string $q, ?array &$diag = null): array {
    $html = http_fetch("https://html.duckduckgo.com/html/?q=" . urlencode($q), $diag, ["Cookie: kl=us-en"]);
    return $html === null ? [] : parse_articles($html);
}

function parse_articles(string $html): array {
    $out = [];
    // result__a (html endpoint) or result-link (lite endpoint) — accept either.
    if (preg_match_all('/<a[^>]+class="[^"]*result(?:__a|-link)[^"]*"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/s',
            $html, $mm, PREG_SET_ORDER)) {
        foreach ($mm as $r) {
            $href = html_entity_decode($r[1], ENT_QUOTES);
            // DDG wraps external links as //duckduckgo.com/l/?uddg=<encoded>&...
            if (preg_match('/[?&]uddg=([^&]+)/', $href, $u)) $href = urldecode($u[1]);
            if (strncmp($href, "http", 4) !== 0) continue;
            $title = trim(html_entity_decode(strip_tags($r[2]), ENT_QUOTES));
            if ($title === "") continue;
            $out[] = [
                "title"  => $title,
                "url"    => $href,
                "thumb"  => null,   // articles have no reliable thumbnail; client draws one
                "source" => parse_url($href, PHP_URL_HOST) ?: "web",
            ];
            if (count($out) >= 6) break;
        }
    }
    return $out;
}

/** Normalize a full-journey payload into a clean "slug\x01item" => {kind,value} map. */
function normalize_full($full): array {
    $out = [];
    if (!is_array($full)) return $out;
    foreach ($full as $rowKey => $cell) {
        if (!is_string($rowKey) || strpos($rowKey, KEY_SEP) === false) continue;
        [$slug, $item] = explode(KEY_SEP, $rowKey, 2);
        if (!valid_slug($slug) || $item === "" || strlen($item) > 256) continue;
        if (!is_array($cell)) continue;
        $kind  = isset($cell["kind"]) && is_string($cell["kind"]) ? clip_bytes($cell["kind"], 64) : "task";
        if (!array_key_exists("value", $cell) || $cell["value"] === null) continue;
        $value = is_string($cell["value"]) ? $cell["value"]
               : json_encode($cell["value"], JSON_UNESCAPED_SLASHES);
        if (!is_string($value) || strlen($value) > MAX_VALUE_BYTES) continue;   // skip oversized (only reachable by abuse)
        $out[$slug . KEY_SEP . $item] = ["kind" => $kind, "value" => $value];
    }
    return $out;
}

function write_saved_at(PDO $pdo, string $now): void {
    $pdo->prepare("INSERT INTO journey_meta (key, value) VALUES ('saved_at', ?)
                   ON CONFLICT(key) DO UPDATE SET value = excluded.value")
        ->execute([$now]);
}
