// backend-live.test.mjs — the PHP backend over REAL HTTP, from a FRESH deploy.
//
// backend.test.mjs covers api.php's pure helpers; this one covers what only a running
// server can show: dispatch, sessions, headers, SQLite concurrency. It copies
// roadmapper/api.php into a throw-away temp directory (new .env, no database, no
// sessions — exactly a first deploy), serves it with PHP's built-in server using
// several worker processes (so parallel requests really run in parallel), and never
// touches the real journey.sqlite. Skips cleanly when php is unavailable.
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, copyFileSync, writeFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { suite } from "./_harness.mjs";

const t = suite("backend-live");
const SEP = "\x01";

let php = true;
try { execFileSync("php", ["-v"], { stdio: "ignore" }); }
catch { php = false; t.skip("php CLI not installed (live backend unverified)"); }

if (php) await run();
t.done();

async function run() {
  const dir = mkdtempSync(join(tmpdir(), "roadmaps-live-"));
  // ROADMAPS_API_UNDER_TEST lets a reviewer point this suite at another api.php (e.g. an older one)
  const apiSrc = process.env.ROADMAPS_API_UNDER_TEST || fileURLToPath(new URL("../roadmapper/api.php", import.meta.url));
  copyFileSync(apiSrc, join(dir, "api.php"));
  writeFileSync(join(dir, "sync.php"), `<?php require __DIR__ . "/api.php";\n`);
  const PASSWORD = "correct horse battery staple";
  const hash = execFileSync("php", ["-r", `echo password_hash(${JSON.stringify(PASSWORD)}, PASSWORD_BCRYPT, ["cost" => 4]);`], { encoding: "utf8" });
  writeFileSync(join(dir, ".env"), `JOURNEY_PASSWORD_HASH='${hash}'\nSESSION_EXPIRY_DAYS=7\n`);

  const port = 20000 + Math.floor(Math.random() * 20000);
  const server = spawn("php", ["-S", `127.0.0.1:${port}`, "-t", dir], {
    env: { ...process.env, PHP_CLI_SERVER_WORKERS: "6" }, stdio: "ignore",
  });
  const cleanup = () => { try { server.kill("SIGKILL"); } catch {} try { rmSync(dir, { recursive: true, force: true }); } catch {} };

  function req(action, { method = "GET", body, cookie, headers = {}, query = "", rawBody } = {}) {
    return new Promise((resolve, reject) => {
      const payload = rawBody !== undefined ? rawBody : body !== undefined ? JSON.stringify(body) : undefined;
      const h = { ...headers };
      if (payload !== undefined && !("Content-Type" in h)) h["Content-Type"] = "application/json";
      if (cookie) h.Cookie = cookie;
      const r = http.request({ host: "127.0.0.1", port, path: `/sync.php?action=${action}${query}`, method, headers: h }, res => {
        let buf = "";
        res.setEncoding("utf8");
        res.on("data", c => (buf += c));
        res.on("end", () => {
          let json = null; try { json = JSON.parse(buf); } catch {}
          resolve({ status: res.statusCode, json: json || {}, parsed: json !== null, raw: buf, setCookie: res.headers["set-cookie"] || [] });
        });
      });
      r.on("error", reject);
      if (payload !== undefined) r.write(payload);
      r.end();
    });
  }
  const sqlite = sql => execFileSync("php", ["-r",
    `$p=new PDO("sqlite:" . ${JSON.stringify(join(dir, "journey.sqlite"))}); echo json_encode($p->query(${JSON.stringify(sql)})->fetchAll(PDO::FETCH_NUM));`],
    { encoding: "utf8" });
  const count = sql => { try { return JSON.parse(sqlite(sql))[0][0]; } catch { return -1; } };
  const sessionFiles = () => existsSync(join(dir, ".sessions")) ? readdirSync(join(dir, ".sessions")).length : 0;

  try {
    // wait for the server
    let up = false;
    for (let i = 0; i < 60 && !up; i++) {
      try { const r = await req("status"); up = r.status === 200; } catch { await new Promise(r => setTimeout(r, 100)); }
    }
    t.ok(up, "the PHP built-in server came up on a fresh copy of api.php");
    if (!up) return;

    t.group("fresh deploy — nothing exists yet");
    const st = await req("status");
    t.eq(st.json.authed, false, "status: not authed");
    t.ok(!existsSync(join(dir, "journey.sqlite")), "status never creates the database");
    t.eq((await req("load")).status, 401, "load without a session → 401");

    t.group("a junk session cookie never creates server-side session files");
    const beforeFiles = sessionFiles();
    const junk = "roadmaps_sid=abcdefghijklmnopqrstuvwxyz012345";
    const junkStatus = await req("status", { cookie: junk });
    await req("load", { cookie: junk });
    await req("status", { cookie: "roadmaps_sid=../../etc/passwd" });
    t.eq(sessionFiles(), beforeFiles, "no session file per junk request (no disk-fill without logging in)");
    t.ok(junkStatus.setCookie.some(c => /roadmaps_sid=;|roadmaps_sid=deleted/.test(c)), "the dead cookie is expired");

    t.group("POSTs must be same-origin JSON (CSRF from a form or sibling site is refused)");
    t.eq((await req("login", { method: "POST", rawBody: JSON.stringify({ password: "x" }), headers: { "Content-Type": "text/plain" } })).status,
      415, "a text/plain body (what an HTML form can send) → 415");
    t.eq((await req("login", { method: "POST", body: { password: "x" }, headers: { "Sec-Fetch-Site": "cross-site" } })).status,
      403, "Sec-Fetch-Site: cross-site → 403");
    t.eq((await req("login", { method: "POST", body: { password: "x" }, headers: { "Sec-Fetch-Site": "same-site" } })).status,
      403, "Sec-Fetch-Site: same-site (a sibling subdomain) → 403");
    t.eq((await req("status", { method: "POST", body: {} })).status, 405, "wrong method → 405");

    t.group("login — wrong, then right");
    const wrong = await req("login", { method: "POST", body: { password: "nope" } });
    t.eq(wrong.status, 401, "a wrong secret → 401");
    t.eq(wrong.json.remaining, 4, "…with 4 attempts left");
    t.ok(existsSync(join(dir, "journey.sqlite")), "the first real request created the database from scratch");
    const ok = await req("login", { method: "POST", body: { password: PASSWORD } });
    t.eq(ok.status, 200, "the right secret → 200");
    const cookie = (ok.setCookie.map(c => c.split(";")[0]).filter(c => /^roadmaps_sid=.+/.test(c)).pop()) || "";
    t.ok(cookie.length > 20, "a session cookie is issued");
    t.eq(count("SELECT COUNT(*) FROM login_throttle"), 0, "a correct login clears the throttle");
    t.eq((await req("status", { cookie })).json.authed, true, "status: authed with that cookie");

    t.group("save / load round-trip — refusals are reported, UTF-8 stays valid");
    const save = await req("save", { method: "POST", cookie, body: { roadmap: "alpha", changes: [
      { id: "d01.t1", kind: "task", value: "true" },
      { id: "x".repeat(300), kind: "task", value: "true" },
      { id: "note:huge", kind: "note", value: "a".repeat(300 * 1024) },
      { id: "k1", kind: "a" + "é".repeat(40), value: "v" },
    ] } });
    t.eq(save.status, 200, "save → 200");
    t.eq(save.json.applied, 2, "the two valid changes are applied");
    t.eq((save.json.rejected || []).length, 2, "the over-long id and the oversized value come back as rejected (never a silent 'saved')");
    const load = await req("load", { cookie });
    const data = load.json.data || {};
    t.ok(load.status === 200 && load.parsed && load.json.ok, "load still returns valid JSON after a multi-byte kind was clipped");
    t.eq(data[`alpha${SEP}d01.t1`] && data[`alpha${SEP}d01.t1`].value, "true", "the tick round-trips");
    t.ok(data[`alpha${SEP}k1`] && Buffer.byteLength(data[`alpha${SEP}k1`].kind) <= 64, "the clipped kind is ≤ 64 bytes");
    await req("save", { method: "POST", cookie, body: { roadmap: "alpha", changes: [{ id: "d01.t1", value: null }] } });
    t.ok(!((await req("load", { cookie })).json.data || {})[`alpha${SEP}d01.t1`], "a null value deletes the row");
    t.eq((await req("load", { cookie, query: "&roadmap=BAD" })).status, 400, "a bad roadmap slug → 400");
    t.eq((await req("save", { method: "POST", cookie, body: { changes: [] } })).status, 400, "a save with no roadmap/full/clearAll → 400");
    const empty = await req("load", { cookie, query: "&roadmap=nobody" });
    t.ok(empty.json.data && !Array.isArray(empty.json.data), "an empty load returns data as an object {}, not []");

    t.group("bulk operations — guard, per-roadmap clear, clear all, stash dedupe");
    await req("save", { method: "POST", cookie, body: { roadmap: "alpha", changes: [{ id: "d02.t1", kind: "task", value: "true" }] } });
    await req("save", { method: "POST", cookie, body: { roadmap: "beta", changes: [{ id: "d01.t1", kind: "task", value: "true" }] } });
    const stashes0 = count("SELECT COUNT(*) FROM journey_stash");
    const guard = await req("save", { method: "POST", cookie, body: { full: {}, stashFirst: true } });
    t.eq(guard.json.skipped, "empty-overwrite-protected", "an empty full import is refused while data exists");
    t.eq(count("SELECT COUNT(*) FROM journey_stash"), stashes0, "…and the refusal stores no stash (backups aren't pushed out)");
    t.ok(count("SELECT COUNT(*) FROM journey_state") >= 3, "…and nothing was deleted");
    const cleared = await req("save", { method: "POST", cookie, body: { roadmap: "alpha", changes: [], clear: true, stashFirst: true, reason: "reset-roadmap" } });
    t.eq(cleared.status, 200, "clear:true → 200");
    t.eq(count("SELECT COUNT(*) FROM journey_state WHERE roadmap='alpha'"), 0, "every alpha row is gone (including ones a client never loaded)");
    t.eq(count("SELECT COUNT(*) FROM journey_state WHERE roadmap='beta'"), 1, "beta is untouched");
    t.eq(count("SELECT COUNT(*) FROM journey_stash"), stashes0 + 1, "the cleared rows were stashed first");
    const all = await req("save", { method: "POST", cookie, body: { clearAll: true, reason: "reset-all" } });
    t.eq(all.status, 200, "clearAll → 200");
    t.eq(count("SELECT COUNT(*) FROM journey_state"), 0, "the whole journey is cleared");
    t.eq(count("SELECT COUNT(*) FROM journey_stash"), stashes0 + 2, "…after a stash of it");
    await req("save", { method: "POST", cookie, body: { roadmap: "beta", changes: [{ id: "d09.t1", kind: "task", value: "true" }] } });
    const s1 = count("SELECT COUNT(*) FROM journey_stash");
    await req("stash", { method: "POST", cookie, body: { reason: "manual" } });
    await req("stash", { method: "POST", cookie, body: { reason: "manual again" } });
    t.eq(count("SELECT COUNT(*) FROM journey_stash"), s1 + 1, "two identical manual stashes store one snapshot");

    t.group("logout ends the session");
    t.eq((await req("logout", { method: "POST", cookie, body: {} })).status, 200, "logout → 200");
    t.eq((await req("load", { cookie })).status, 401, "the old cookie no longer loads data");

    t.group("parallel wrong logins are counted exactly (no throttle bypass, no 500s)");
    const burst = await Promise.all(Array.from({ length: 12 }, () => req("login", { method: "POST", body: { password: "guess" } })));
    const codes = burst.map(r => r.status);
    t.eq(codes.filter(c => c >= 500).length, 0, `no request errors out (${codes.join(",")})`);
    t.eq(codes.filter(c => c === 401).length, 5, "exactly 5 guesses are evaluated…");
    t.eq(codes.filter(c => c === 429).length, 7, "…and the other 7 are refused by the lock");
    t.eq((await req("login", { method: "POST", body: { password: PASSWORD } })).status, 429, "while locked even the right secret waits");
  } finally {
    cleanup();
  }
}
