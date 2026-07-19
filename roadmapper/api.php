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
 *   POST ?action=save              -> { roadmap?, changes:[{id,kind,value|null}], full?:{...},
 *                                       stashFirst?, reason? }
 *                                     Upserts changed rows, deletes rows whose value is null
 *                                     (return-to-default), guards empty overwrites, stashes.
 *   GET  ?action=search&q=&type=   -> { ok, type, q, fetched, results:[{title,url,thumb,source}] }
 *                                     Best-effort discovery proxy (YouTube / DuckDuckGo). Auth
 *                                     required, fixed hosts, no client URL. fetched:false => the
 *                                     client falls back to a results-page link. Touches no DB.
 *
 * The DB stores ONLY deviations from default: absence of a row = "not done / on
 * origin / unset". A newly authored roadmap needs zero rows (DESIGN.md §7).
 */

header("Content-Type: application/json");
header("Cache-Control: no-cache, no-store, must-revalidate");

const DB_FILE          = __DIR__ . "/journey.sqlite";
const SESSION_NAME     = "roadmaps_sid";
const MAX_BODY_BYTES   = 8 * 1024 * 1024;
const STASH_KEEP       = 20;
const THROTTLE_WINDOW  = 5;          // wrong attempts before a lock kicks in
const THROTTLE_UNIT    = 60;         // seconds per strike (strike 1 => 60s, strike 2 => 120s, ...)
const VERIFY_DELAY_US  = 250000;     // small constant delay per verify, blunts online guessing
// Roadmap slug and item id are joined with US (unit separator) into one map key
// for transport, so the client sees a flat { "slugitem": {...} } object.
const KEY_SEP          = "\x01";

function fail(int $code, string $msg, array $extra = []): void {
    http_response_code($code);
    echo json_encode(array_merge(["ok" => false, "error" => $msg], $extra));
    exit;
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
    if (!$create && empty($_COOKIE[SESSION_NAME])) return;
    $dir = __DIR__ . "/.sessions";
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    if (is_dir($dir) && is_writable($dir)) session_save_path($dir);
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

function is_authed(): bool {
    return !empty($_SESSION["authed"])
        && isset($_SESSION["expires"])
        && (int)$_SESSION["expires"] > time();
}

function require_auth(int $lifetime): void {
    session_boot(false, $lifetime);
    if (!is_authed()) fail(401, "authentication required");
}

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO("sqlite:" . DB_FILE);
        } catch (PDOException $e) {
            error_log("roadmaps: cannot open journey.sqlite: " . $e->getMessage());
            fail(500, "database unavailable");
        }
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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
    }
    return $pdo;
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

/** @return array{locked:bool, retryAfter:int, remaining:int} */
function throttle_check(PDO $pdo, string $id): array {
    $row = $pdo->prepare("SELECT fails, strikes, locked_until FROM login_throttle WHERE id = ?");
    $row->execute([$id]);
    $r = $row->fetch(PDO::FETCH_ASSOC);
    $now = time();
    if ($r && $r["locked_until"] !== null && (int)$r["locked_until"] > $now) {
        return ["locked" => true, "retryAfter" => (int)$r["locked_until"] - $now, "remaining" => 0];
    }
    $fails = $r ? (int)$r["fails"] : 0;
    return ["locked" => false, "retryAfter" => 0, "remaining" => max(0, THROTTLE_WINDOW - $fails)];
}

/** Record a wrong attempt; escalate to a lock when the window fills. @return array */
function throttle_fail(PDO $pdo, string $id): array {
    $now = time();
    $sel = $pdo->prepare("SELECT fails, strikes FROM login_throttle WHERE id = ?");
    $sel->execute([$id]);
    $r = $sel->fetch(PDO::FETCH_ASSOC);
    $fails   = ($r ? (int)$r["fails"] : 0) + 1;
    $strikes = $r ? (int)$r["strikes"] : 0;
    $lockedUntil = null;
    $retryAfter = 0;
    if ($fails >= THROTTLE_WINDOW) {
        $strikes += 1;
        $retryAfter  = $strikes * THROTTLE_UNIT;      // strike 1 => 60s, 2 => 120s, ...
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
    $pdo->prepare("INSERT INTO journey_stash (created_at, reason, data_json) VALUES (?, ?, ?)")
        ->execute([now_iso(), $reason, json_encode($snapshot, JSON_UNESCAPED_SLASHES)]);
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

$action = $_GET["action"] ?? "";
$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

$ENV = load_env(__DIR__ . "/.env");
$PW_HASH = (string)($ENV["JOURNEY_PASSWORD_HASH"] ?? "");
$EXPIRY_DAYS = (isset($ENV["SESSION_EXPIRY_DAYS"]) && (int)$ENV["SESSION_EXPIRY_DAYS"] > 0)
    ? (int)$ENV["SESSION_EXPIRY_DAYS"] : 7;
$SESSION_LIFETIME = $EXPIRY_DAYS * 86400;

switch ($action) {
    case "status":
        session_boot(false, $SESSION_LIFETIME);
        echo json_encode(["ok" => true, "authed" => is_authed(), "expiresInDays" => $EXPIRY_DAYS]);
        break;

    case "login": {
        if ($method !== "POST") fail(405, "login is POST-only");
        if ($PW_HASH === "") fail(500, "server has no secret configured");
        $pdo = db();
        $tid = throttle_id();

        $state = throttle_check($pdo, $tid);
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
            $after = throttle_fail($pdo, $tid);
            fail(401, "incorrect secret", [
                "remaining"  => $after["remaining"],
                "locked"     => $after["locked"],
                "retryAfter" => $after["retryAfter"],
            ]);
        }

        throttle_clear($pdo, $tid);
        session_boot(true, $SESSION_LIFETIME);
        session_regenerate_id(true);
        $_SESSION["authed"]  = true;
        $_SESSION["expires"] = time() + $SESSION_LIFETIME;
        echo json_encode(["ok" => true, "expiresInDays" => $EXPIRY_DAYS]);
        break;
    }

    case "logout":
        session_boot(false, $SESSION_LIFETIME);
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION = [];
            $p = session_get_cookie_params();
            setcookie(session_name(), "", [
                "expires"  => time() - 42000,
                "path"     => $p["path"] ?: "/",
                "secure"   => req_is_https(),
                "httponly" => true,
                "samesite" => "Lax",
            ]);
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
        ], JSON_UNESCAPED_SLASHES);
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

        $pdo = db();
        $now = now_iso();
        $pdo->exec("BEGIN IMMEDIATE");
        try {
            if (isset($body["full"]) && is_array($body["full"])) {
                // Full-journey replacement (import / whole-journey restore).
                $incoming = normalize_full($body["full"]);
                $existingCount = count_state($pdo, null);

                // HARD GUARD: an empty snapshot must never wipe a populated journey.
                if (count($incoming) === 0 && $existingCount > 0) {
                    insert_stash($pdo, load_state($pdo, null), "empty-overwrite-blocked");
                    $pdo->exec("COMMIT");
                    echo json_encode(["ok" => true, "skipped" => "empty-overwrite-protected",
                                      "keys" => $existingCount]);
                    break;
                }
                if ($existingCount > 0 && !empty($body["stashFirst"])) {
                    insert_stash($pdo, load_state($pdo, null),
                                 (string)($body["reason"] ?? "replaced-by-full-save"));
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
            if ($scope === null) fail(400, "save needs either roadmap+changes or full");
            $changes = isset($body["changes"]) && is_array($body["changes"]) ? $body["changes"] : [];

            // Optional per-roadmap import: stash the roadmap's current rows first.
            if (!empty($body["stashFirst"])) {
                $cur = load_state($pdo, $scope);
                if ($cur) insert_stash($pdo, $cur, (string)($body["reason"] ?? "replaced-by-save"));
            }

            $del = $pdo->prepare("DELETE FROM journey_state WHERE roadmap = ? AND item_id = ?");
            $up  = $pdo->prepare(
                "INSERT INTO journey_state (roadmap, item_id, kind, value, updated_at)
                 VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(roadmap, item_id) DO UPDATE SET
                    kind=excluded.kind, value=excluded.value, updated_at=excluded.updated_at"
            );
            $applied = 0;
            foreach ($changes as $ch) {
                if (!is_array($ch) || !isset($ch["id"]) || !is_string($ch["id"])) continue;
                $item = $ch["id"];
                if ($item === "" || strlen($item) > 256) continue;
                // value === null  =>  return to default: delete the row.
                if (!array_key_exists("value", $ch) || $ch["value"] === null) {
                    $del->execute([$scope, $item]);
                } else {
                    $kind  = isset($ch["kind"]) && is_string($ch["kind"]) ? $ch["kind"] : "task";
                    $value = is_string($ch["value"]) ? $ch["value"]
                           : json_encode($ch["value"], JSON_UNESCAPED_SLASHES);
                    $up->execute([$scope, $item, $kind, $value, $now]);
                }
                $applied++;
            }
            touch_registry($pdo, $scope);
            write_saved_at($pdo, $now);
            $pdo->exec("COMMIT");
            echo json_encode(["ok" => true, "savedAt" => $now, "applied" => $applied,
                              "keys" => count_state($pdo, $scope)]);
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
        insert_stash($pdo, load_state($pdo, $roadmap), (string)($body["reason"] ?? "manual"));
        echo json_encode(["ok" => true]);
        break;
    }

    case "search": {
        // Discovery proxy: fetch a few candidate videos/articles for a query so
        // the client can surface a "watch/read next" card. The browser cannot do
        // this itself (CORS + no API key). Locked down: auth required, GET only,
        // fixed upstream hosts, short timeout, query URL-encoded — the client
        // NEVER supplies a URL, only a text query and a type. On any outbound
        // failure this returns fetched:false with an empty list, and the client
        // falls back to a deep-link-to-results card, so it degrades gracefully.
        if ($method !== "GET") fail(405, "search is GET-only");
        require_auth($SESSION_LIFETIME);
        $q = isset($_GET["q"]) ? (string)$_GET["q"] : "";
        $q = preg_replace('/[\x00-\x1f\x7f]+/u', " ", $q);   // strip control chars
        $q = trim(preg_replace('/\s+/u', " ", $q));
        $q = function_exists("mb_substr") ? mb_substr($q, 0, 160) : substr($q, 0, 160);
        if ($q === "") fail(400, "empty query");
        $type = (($_GET["type"] ?? "") === "article") ? "article" : "video";
        $results = ($type === "article") ? search_articles($q) : search_youtube($q);
        echo json_encode([
            "ok"      => true,
            "type"    => $type,
            "q"       => $q,
            "fetched" => count($results) > 0,   // false => client shows its deep-link fallback
            "results" => array_slice($results, 0, 6),
        ], JSON_UNESCAPED_SLASHES);
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

/** GET a URL over HTTPS only, with a short timeout. Returns body or null. */
function http_fetch(string $url, int $timeout = 8): ?string {
    if (!function_exists("curl_init")) return null;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_TIMEOUT         => $timeout,
        CURLOPT_CONNECTTIMEOUT  => 5,
        CURLOPT_FOLLOWLOCATION  => true,
        CURLOPT_MAXREDIRS       => 3,
        CURLOPT_USERAGENT       => "Mozilla/5.0 (compatible; RoadmapsBot/1.0)",
        CURLOPT_HTTPHEADER      => ["Accept-Language: en-US,en;q=0.9"],
    ]);
    // Pin to HTTP(S) so neither the URL nor a redirect can reach file://, gopher://, etc.
    if (defined("CURLPROTO_HTTP") && defined("CURLPROTO_HTTPS")) {
        $web = CURLPROTO_HTTP | CURLPROTO_HTTPS;
        curl_setopt($ch, CURLOPT_PROTOCOLS, $web);
        curl_setopt($ch, CURLOPT_REDIR_PROTOCOLS, $web);
    }
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if (!is_string($body) || $code < 200 || $code >= 400) return null;
    return $body;
}

/** Parse YouTube's results page for a handful of {title,url,thumb} videos. */
function search_youtube(string $q): array {
    $html = http_fetch("https://www.youtube.com/results?search_query="
        . urlencode($q) . "&sp=EgIQAQ%253D%253D");   // sp=... filters to type:Video
    return $html === null ? [] : parse_youtube($html);
}

function parse_youtube(string $html): array {
    // Bound the regex to the ytInitialData blob so PCRE never scans megabytes.
    $at = strpos($html, "ytInitialData");
    if ($at !== false) $html = substr($html, $at, 2000000);
    $out = []; $seen = [];
    // Each result is a videoRenderer carrying a videoId and a title runs[0].text.
    if (preg_match_all('/"videoRenderer":\{"videoId":"([\w-]{11})".*?"title":\{"runs":\[\{"text":"((?:\\\\.|[^"\\\\])*)"/s',
            $html, $mm, PREG_SET_ORDER)) {
        foreach ($mm as $r) {
            $id = $r[1];
            if (isset($seen[$id])) continue;
            $seen[$id] = true;
            $title = json_decode('"' . $r[2] . '"');
            if (!is_string($title) || $title === "") $title = "YouTube video";
            $out[] = [
                "title"  => $title,
                "url"    => "https://www.youtube.com/watch?v=" . $id,
                "thumb"  => "https://i.ytimg.com/vi/" . $id . "/hqdefault.jpg",
                "source" => "YouTube",
            ];
            if (count($out) >= 6) break;
        }
    }
    return $out;
}

/** Parse DuckDuckGo's HTML endpoint for a handful of {title,url} articles. */
function search_articles(string $q): array {
    $html = http_fetch("https://html.duckduckgo.com/html/?q=" . urlencode($q));
    return $html === null ? [] : parse_articles($html);
}

function parse_articles(string $html): array {
    $out = [];
    if (preg_match_all('/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/s',
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
        $kind  = isset($cell["kind"]) && is_string($cell["kind"]) ? $cell["kind"] : "task";
        if (!array_key_exists("value", $cell) || $cell["value"] === null) continue;
        $value = is_string($cell["value"]) ? $cell["value"]
               : json_encode($cell["value"], JSON_UNESCAPED_SLASHES);
        $out[$slug . KEY_SEP . $item] = ["kind" => $kind, "value" => $value];
    }
    return $out;
}

function write_saved_at(PDO $pdo, string $now): void {
    $pdo->prepare("INSERT INTO journey_meta (key, value) VALUES ('saved_at', ?)
                   ON CONFLICT(key) DO UPDATE SET value = excluded.value")
        ->execute([$now]);
}
