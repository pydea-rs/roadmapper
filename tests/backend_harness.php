<?php
/*
 * backend_harness.php — exercises the PURE / injectable helpers of roadmapper/api.php
 * against an in-memory SQLite DB and prints the results as JSON on stdout. Driven by
 * backend.test.mjs. It NEVER touches the real journey.sqlite: it defines
 * ROADMAPS_TEST_HARNESS so api.php returns before its request dispatch (and before
 * db() is ever called), then builds its own :memory: PDO for the throttle/guard tests.
 *
 * Usage:  php backend_harness.php /abs/path/to/roadmapper/api.php
 */
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set("display_errors", "0");

$apiPath = $argv[1] ?? "";
if ($apiPath === "" || !is_file($apiPath)) {
    fwrite(STDERR, "api.php path not given/found\n");
    exit(2);
}
define("ROADMAPS_TEST_HARNESS", true);
require $apiPath;               // defines the helpers; dispatch is skipped by the guard

$SEP = KEY_SEP;                 // "\x01"
$out = [];

/* ---- valid_slug ---------------------------------------------------------- */
$out["slug"] = [
    "rust-fastapi"                 => valid_slug("rust-fastapi"),
    "a"                            => valid_slug("a"),
    "empty"                        => valid_slug(""),
    "uppercase"                    => valid_slug("Rust"),
    "leading_hyphen"               => valid_slug("-rust"),
    "slash"                        => valid_slug("a/b"),
    "space"                        => valid_slug("a b"),
    "len64"                        => valid_slug(str_repeat("a", 64)),
    "len65"                        => valid_slug(str_repeat("a", 65)),
];

/* ---- normalize_full ------------------------------------------------------ */
$full = [
    "slug{$SEP}item1"                    => ["kind" => "task", "value" => "true"],   // kept
    "slug{$SEP}item2"                    => ["value" => "x"],                         // kind defaults to "task"
    "slug{$SEP}k"                        => ["kind" => str_repeat("K", 100), "value" => "x"], // kind truncated to 64
    "slug{$SEP}arr"                      => ["kind" => "move", "value" => ["move", "d1"]],     // non-string -> json
    "noseparatorkey"                     => ["kind" => "task", "value" => "true"],   // dropped: no KEY_SEP
    "BAD{$SEP}item"                      => ["kind" => "task", "value" => "true"],   // dropped: bad slug
    "slug{$SEP}"                         => ["kind" => "task", "value" => "true"],   // dropped: empty item
    "slug{$SEP}" . str_repeat("x", 300)  => ["kind" => "task", "value" => "true"],   // dropped: item > 256
    "slug{$SEP}nullval"                  => ["kind" => "task", "value" => null],     // dropped: null value
    "slug{$SEP}noval"                    => ["kind" => "task"],                       // dropped: no value key
    "slug{$SEP}notarr"                   => "scalar",                                 // dropped: cell not array
];
$norm = normalize_full($full);
$out["norm"] = [
    "count"        => count($norm),
    "kind_default" => $norm["slug{$SEP}item2"]["kind"] ?? null,
    "kind_len"     => isset($norm["slug{$SEP}k"]) ? strlen($norm["slug{$SEP}k"]["kind"]) : null,
    "arr_value"    => $norm["slug{$SEP}arr"]["value"] ?? null,
    "empty_count"  => count(normalize_full([])),
    "nonarray_count" => count(normalize_full("nope")),
];

/* ---- throttle_* (against an in-memory DB) -------------------------------- */
$pdo = new PDO("sqlite::memory:");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec("CREATE TABLE login_throttle (
    id TEXT PRIMARY KEY, fails INTEGER NOT NULL DEFAULT 0, strikes INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER, updated_at TEXT NOT NULL);");
$pdo->exec("CREATE TABLE journey_state (
    roadmap TEXT NOT NULL, item_id TEXT NOT NULL, kind TEXT NOT NULL, value TEXT,
    updated_at TEXT NOT NULL, PRIMARY KEY (roadmap, item_id));");

$id = "tester";
$fresh = throttle_check($pdo, $id);
$remAfter = [];
for ($i = 0; $i < 4; $i++) { $r = throttle_fail($pdo, $id); $remAfter[] = $r["remaining"]; }
$fifth = throttle_fail($pdo, $id);                 // 5th wrong attempt -> lock, strike 1
$checkLocked = throttle_check($pdo, $id);
throttle_clear($pdo, $id);
$afterClear = throttle_check($pdo, $id);

// escalation: seed a row as if the window reopened after strike 1 expired, then
// one more fail should escalate to strike 2 (retryAfter = 2 * THROTTLE_UNIT).
$pdo->prepare("INSERT INTO login_throttle (id, fails, strikes, locked_until, updated_at)
               VALUES (?, 4, 1, NULL, ?)")->execute([$id, now_iso()]);
$escalate = throttle_fail($pdo, $id);

$out["throttle"] = [
    "fresh_locked"        => $fresh["locked"],
    "fresh_remaining"     => $fresh["remaining"],
    "remaining_after_1_4" => $remAfter,           // expect [4,3,2,1]
    "fifth_locked"        => $fifth["locked"],
    "fifth_retry"         => $fifth["retryAfter"], // expect 60 (strike 1 * 60)
    "fifth_remaining"     => $fifth["remaining"],  // expect 0
    "check_locked"        => $checkLocked["locked"],
    "after_clear_remaining" => $afterClear["remaining"], // expect 5
    "escalate_retry"      => $escalate["retryAfter"],    // expect 120 (strike 2 * 60)
];

/* ---- throttle: lock cap, strike decay, atomic reservation --------------- */
$pdo->prepare("INSERT INTO login_throttle (id, fails, strikes, locked_until, updated_at)
               VALUES ('capped', 4, 99, NULL, ?)")->execute([now_iso()]);
$capped = throttle_fail($pdo, "capped");                  // strike 100 would be 6000s
$pdo->prepare("INSERT INTO login_throttle (id, fails, strikes, locked_until, updated_at)
               VALUES ('quiet', 3, 4, NULL, ?)")->execute([gmdate("c", time() - 2 * 86400)]);
$quietCheck = throttle_check($pdo, "quiet");              // 2 quiet days → history forgiven
$quietFail  = throttle_fail($pdo, "quiet");
$quietRow   = $pdo->query("SELECT fails, strikes FROM login_throttle WHERE id='quiet'")->fetch(PDO::FETCH_ASSOC);
$pdo->prepare("INSERT INTO login_throttle (id, fails, strikes, locked_until, updated_at)
               VALUES ('stillLocked', 0, 4, ?, ?)")->execute([time() + 600, gmdate("c", time() - 2 * 86400)]);
$lockedOld = throttle_check($pdo, "stillLocked");         // an ACTIVE lock is never forgiven early
$reserveLog = [];
for ($i = 0; $i < 7; $i++) { $r = throttle_reserve($pdo, "res"); $reserveLog[] = $r["locked"] ? "L" : (($r["lockedAfter"] ?? false) ? "5" : "ok"); }
$pdo->prepare("INSERT INTO login_throttle (id, fails, strikes, locked_until, updated_at)
               VALUES ('ancient', 1, 0, NULL, ?)")->execute([gmdate("c", time() - 40 * 86400)]);
throttle_prune($pdo);
$ancientGone = (int)$pdo->query("SELECT COUNT(*) FROM login_throttle WHERE id='ancient'")->fetchColumn() === 0;
$lockedKept  = (int)$pdo->query("SELECT COUNT(*) FROM login_throttle WHERE id='stillLocked'")->fetchColumn() === 1;
$out["throttle2"] = [
    "cap_retry"         => $capped["retryAfter"],          // expect THROTTLE_MAX_LOCK (1800)
    "quiet_remaining"   => $quietCheck["remaining"],       // expect 5
    "quiet_after_fail"  => $quietRow,                      // expect fails 1, strikes 0
    "old_lock_locked"   => $lockedOld["locked"],           // expect true
    "reserve_log"       => $reserveLog,                    // expect ok,ok,ok,ok,5,L,L
    "prune_ancient"     => $ancientGone,
    "prune_keeps_locked"=> $lockedKept,
];

/* ---- clip_bytes: never splits a UTF-8 character ------------------------- */
$clipped = clip_bytes("a" . str_repeat("é", 40), 64);     // "é" is 2 bytes; 64 would split one
$out["clip"] = [
    "len_ok"     => strlen($clipped) <= 64,
    "valid_utf8" => preg_match('//u', $clipped) === 1,
    "kept_chars" => mb_strlen($clipped, "UTF-8"),          // "a" + 31 × "é" = 32
    "short_same" => clip_bytes("task", 64) === "task",
    "json_ok"    => json_encode(["k" => $clipped]) !== false,
];

/* ---- insert_stash: identical snapshots are not duplicated --------------- */
$pdo->exec("CREATE TABLE journey_stash (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, reason TEXT, data_json TEXT NOT NULL);");
$snapA = ["rust-fastapi{$SEP}d01.t1" => ["kind" => "task", "value" => "true"]];
insert_stash($pdo, $snapA, "one");
insert_stash($pdo, $snapA, "same again");
insert_stash($pdo, ["x{$SEP}y" => ["kind" => "task", "value" => "true"]], "different");
insert_stash($pdo, [], "empty");
$out["stash"] = [
    "rows" => (int)$pdo->query("SELECT COUNT(*) FROM journey_stash")->fetchColumn(),   // expect 2
    "long_reason_clipped" => (function () use ($pdo) {
        insert_stash($pdo, ["z{$SEP}q" => ["kind" => "task", "value" => "1"]], str_repeat("r", 200));
        return strlen((string)$pdo->query("SELECT reason FROM journey_stash ORDER BY id DESC LIMIT 1")->fetchColumn());
    })(),                                                                             // expect 64
];

/* ---- empty-overwrite guard (reconstruct the dispatch condition) ---------- */
// The dispatch guards a full-journey replacement with:
//   count(normalize_full(full)) === 0 && count_state(pdo, null) > 0  ->  BLOCK
$pdo->prepare("INSERT INTO journey_state VALUES ('rust-fastapi','d01.t1','task','true',?)")->execute([now_iso()]);
$pdo->prepare("INSERT INTO journey_state VALUES ('bedrock','d02.t1','task','true',?)")->execute([now_iso()]);
$populated = count_state($pdo, null);
$emptyBlocks    = (count(normalize_full([])) === 0 && $populated > 0);
$nonEmptyProceeds = (count(normalize_full(["s{$SEP}i" => ["kind" => "task", "value" => "true"]])) === 0 && $populated > 0);
$out["guard"] = [
    "populated_count"     => $populated,          // expect 2
    "empty_blocks_wipe"   => $emptyBlocks,        // expect true (data protected)
    "nonempty_proceeds"   => !$nonEmptyProceeds,  // expect true (a real payload is allowed through)
];

echo json_encode($out);
