// backend.test.mjs — the PHP backend (roadmapper/api.php). The rest of the suite is
// JS; this one shells to `php` running backend_harness.php, which requires api.php
// (dispatch skipped via the ROADMAPS_TEST_HARNESS guard — the real journey.sqlite is
// never opened) and exercises the helpers that guard LOGIN LOCKOUT and, above all,
// the FULL-JOURNEY WIPE. Those paths no JS test can reach. Skips cleanly if php is
// absent, matching how the jsdom suites degrade.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { suite } from "./_harness.mjs";

const t = suite("backend");

const harness = fileURLToPath(new URL("./backend_harness.php", import.meta.url));
const apiPath = fileURLToPath(new URL("../roadmapper/api.php", import.meta.url));

let php = true;
try { execFileSync("php", ["-v"], { stdio: "ignore" }); }
catch { php = false; t.skip("php CLI not installed (backend contract unverified)"); }

if (php) {
  let data = null, err = null;
  try {
    const out = execFileSync("php", [harness, apiPath], { encoding: "utf8" });
    data = JSON.parse(out);
  } catch (e) { err = e; }
  t.ok(!err, `harness ran and returned JSON${err ? " — " + (err.message || err) : ""}`);

  if (data) {
    t.group("valid_slug — the allowlist that gates every roadmap/id write");
    const s = data.slug;
    t.eq(s["rust-fastapi"], true, "accepts a normal lowercase-hyphen slug");
    t.eq(s["a"], true, "accepts a single character");
    t.eq(s["len64"], true, "accepts the 64-char maximum");
    t.eq(s["empty"], false, "rejects empty");
    t.eq(s["uppercase"], false, "rejects uppercase (case-strict)");
    t.eq(s["leading_hyphen"], false, "rejects a leading hyphen");
    t.eq(s["slash"], false, "rejects a slash (no path traversal into item ids)");
    t.eq(s["space"], false, "rejects whitespace");
    t.eq(s["len65"], false, "rejects 65 chars (length bound holds)");

    t.group("normalize_full — sanitises an imported full-journey snapshot");
    const n = data.norm;
    t.eq(n.count, 4, "keeps only the 4 well-formed rows, drops the 7 malformed ones");
    t.eq(n.kind_default, "task", "a missing kind defaults to 'task'");
    t.eq(n.kind_len, 64, "an over-long kind is truncated to 64 chars");
    t.eq(n.arr_value, '["move","d1"]', "a non-string value is JSON-encoded, not dropped");
    t.eq(n.empty_count, 0, "an empty snapshot normalises to zero rows");
    t.eq(n.nonarray_count, 0, "a non-array payload normalises to zero rows (no crash)");

    t.group("throttle — escalating login lockout");
    const th = data.throttle;
    t.eq(th.fresh_locked, false, "a fresh id is not locked");
    t.eq(th.fresh_remaining, 5, "a fresh id has the full 5-attempt window");
    t.deep(th.remaining_after_1_4, [4, 3, 2, 1], "each wrong attempt decrements the remaining window");
    t.eq(th.fifth_locked, true, "the 5th wrong attempt locks the id");
    t.eq(th.fifth_retry, 60, "strike 1 locks for 60s");
    t.eq(th.fifth_remaining, 0, "a locked id reports 0 remaining");
    t.eq(th.check_locked, true, "a follow-up check still sees the lock");
    t.eq(th.after_clear_remaining, 5, "a correct login (throttle_clear) resets the window");
    t.eq(th.escalate_retry, 120, "strike 2 escalates the lock to 120s");

    t.group("empty-overwrite guard — a blank import can NEVER wipe a populated journey");
    const g = data.guard;
    t.eq(g.populated_count, 2, "the journey has rows to protect");
    t.eq(g.empty_blocks_wipe, true, "an empty full-save is blocked while data exists (the wipe guard)");
    t.eq(g.nonempty_proceeds, true, "a real full-save payload is still allowed through");
  }
}

t.done();
