// app.test.mjs — the app shell itself (app.js): boot, routing, and the behaviour of a
// tab that stays open for days. It boots the REAL app inside jsdom on the REAL
// index.php markup, with a scripted backend (mocked fetch) and a re-settable clock:
//   boot → default route · unknown routes · global views release the roadmap ·
//   navigation dismisses stale dialogs · midnight rollover · refresh after the tab
//   was away · an expired session (lock + kept changes) · reset/sync never claim a
//   success the server didn't confirm.
// jsdom-gated like the other DOM suites; SKIPS cleanly when jsdom is absent.
import { readFileSync } from "node:fs";
import { suite } from "./_harness.mjs";

const t = suite("app");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

if (JSDOM) await run();
t.done();

async function run() {
  // ---- the real shell markup (minus PHP header and scripts) ----
  const html = readFileSync(new URL("../public/index.php", import.meta.url), "utf8")
    .replace(/^<\?php[\s\S]*?\?>/, "")
    .replace(/<script[\s\S]*?<\/script>/g, "");
  const dom = new JSDOM(html, { url: "http://localhost/" });
  const w = dom.window;
  global.window = w;
  global.document = w.document;
  global.location = w.location;
  global.localStorage = w.localStorage;
  global.CSS = w.CSS;
  global.getComputedStyle = (...a) => w.getComputedStyle(...a);
  global.requestAnimationFrame = fn => setTimeout(fn, 0);
  global.Node = w.Node;
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.HTMLElement.prototype.scrollTo = function () {};
  let visibility = "visible";
  Object.defineProperty(w.document, "visibilityState", { configurable: true, get: () => visibility });

  // ---- a re-settable clock ----
  const RealDate = Date;
  let NOW = new RealDate(2026, 8, 6, 12, 0, 0).getTime();
  class FakeDate extends RealDate {
    constructor(...a) { if (a.length) super(...a); else super(NOW); }
    static now() { return NOW; }
  }
  global.Date = FakeDate;
  const setNow = (y, m, d, hh = 12, mm = 0) => { NOW = new RealDate(y, m - 1, d, hh, mm, 0).getTime(); };

  // ---- scripted backend ----
  const calls = [];
  let db = {};                                   // "slug\x01item" → {kind,value}
  let saveStatus = 200, loadStatus = 200;
  const json = (status, body) => ({ status, ok: status >= 200 && status < 300,
    headers: { get: () => "application/json" }, json: async () => body });
  global.fetch = async (url, opts = {}) => {
    const action = /action=(\w+)/.exec(url)[1];
    const body = opts.body ? JSON.parse(opts.body) : null;
    calls.push({ action, body });
    if (action === "status") return json(200, { ok: true, authed: true, expiresInDays: 7 });
    if (action === "login") return json(200, { ok: true, expiresInDays: 7 });
    if (action === "logout") return json(200, { ok: true });
    if (action === "search") return json(200, { ok: true, fetched: false, results: [] });
    if (action === "load") return loadStatus === 200 ? json(200, { ok: true, data: db, savedAt: null })
      : json(loadStatus, { ok: false, error: "load failed" });
    if (action === "save") {
      if (saveStatus !== 200) return json(saveStatus, { ok: false, error: "save failed" });
      if (body.clearAll) db = {};
      if (body.roadmap && body.clear) for (const k of Object.keys(db)) if (k.startsWith(body.roadmap + "\x01")) delete db[k];
      for (const c of body.changes || []) {
        const k = `${body.roadmap}\x01${c.id}`;
        if (c.value === null) delete db[k]; else db[k] = { kind: c.kind, value: c.value };
      }
      return json(200, { ok: true, applied: (body.changes || []).length });
    }
    return json(400, { ok: false });
  };

  const wait = (ms = 30) => new Promise(r => setTimeout(r, ms));
  const settle = async () => { for (let i = 0; i < 6; i++) await wait(15); };
  const $ = s => w.document.querySelector(s);
  const click = n => n.dispatchEvent(new w.MouseEvent("click", { bubbles: true, cancelable: true }));
  const go = async hash => { w.location.hash = hash; w.dispatchEvent(new w.HashChangeEvent("hashchange")); await settle(); };
  const toastText = () => $("#toast-root").textContent;
  const buttonByText = (root, re) => [...root.querySelectorAll("button")].find(b => re.test(b.textContent));

  // ---- boot the real app ----
  const base = new URL("../public/assets/js/", import.meta.url);
  const store = await import(new URL("store.js", base).href);
  const ui = await import(new URL("ui.js", base).href);
  await import(new URL("app.js", base).href);
  w.document.dispatchEvent(new w.Event("DOMContentLoaded"));
  for (let i = 0; i < 100 && $("#app").hidden; i++) await wait(20);
  await settle();

  t.group("boot — authed → the app, on a sensible default route");
  t.eq(w.__roadmapsBooted, true, "boot() marks itself started (index.php's watchdog stays quiet)");
  t.eq($("#boot").hidden, true, "the boot splash is dismissed");
  t.eq($("#app").hidden, false, "the app is shown");
  t.ok(/^#\/[a-z0-9-]+$/.test(w.location.hash), `the empty route redirects to a roadmap (${w.location.hash})`);
  t.ok($("#view .timeline"), "…and that roadmap's timeline renders");
  t.eq(calls.filter(c => c.action === "load").length, 1, "the journey is loaded once at boot");

  t.group("routing — unknown routes, global views");
  await go("#/no-such-roadmap");
  t.ok(/^#\/(rust-fastapi|interp-go|bedrock|raylib)$/.test(w.location.hash), `an unknown slug falls back to a real roadmap (${w.location.hash})`);
  await go("#/rust-fastapi");
  t.ok($("#view").style.getPropertyValue("--accent"), "a roadmap paints its colour on the view");
  await go("#/today");
  t.ok($("#view .today-view"), "#/today renders the digest");
  t.eq($("#view").style.getPropertyValue("--accent"), "", "…without the previous roadmap's colour");
  await go("#/insights");
  t.ok($("#view").textContent.length > 0 && !$("#view .timeline"), "#/insights renders a global view");

  t.group("navigation dismisses dialogs opened for the previous view");
  let answered = null;
  ui.confirmModal({ title: "Reset this?" }).then(v => { answered = v; });
  t.eq(w.document.querySelectorAll("#modal-root .modal-layer").length, 1, "a dialog is open");
  await go("#/today");
  await wait(250);
  t.eq(w.document.querySelectorAll("#modal-root .modal-layer").length, 0, "Back/link navigation closes it");
  t.eq(answered, false, "…as a cancel (its action never runs against a view that is gone)");

  t.group("midnight rollover — a tab left open repaints for the new day");
  await go("#/today");
  t.ok($("#view .today-hero").textContent.includes("Sep 6"), "Today shows Sep 6");
  setNow(2026, 9, 7, 0, 5);
  w.document.dispatchEvent(new w.Event("visibilitychange"));
  await settle();
  t.ok($("#view .today-hero").textContent.includes("Sep 7"), "coming back after midnight shows Sep 7 without navigating");

  t.group("coming back after a while re-adopts the database (another device may have saved)");
  const loadsBefore = calls.filter(c => c.action === "load").length;
  visibility = "hidden"; w.document.dispatchEvent(new w.Event("visibilitychange"));
  setNow(2026, 9, 7, 0, 30);                     // 25 minutes away
  db["interp-go\x01d01.t1"] = { kind: "task", value: "true" };   // saved elsewhere meanwhile
  visibility = "visible"; w.document.dispatchEvent(new w.Event("visibilitychange"));
  await settle();
  t.eq(calls.filter(c => c.action === "load").length, loadsBefore + 1, "a fresh load runs on return");
  t.eq(store.isDone("interp-go", "d01.t1"), true, "the other device's tick is now in this tab");
  const loadsAfter = calls.filter(c => c.action === "load").length;
  visibility = "hidden"; w.document.dispatchEvent(new w.Event("visibilitychange"));
  visibility = "visible"; w.document.dispatchEvent(new w.Event("visibilitychange"));
  await settle();
  t.eq(calls.filter(c => c.action === "load").length, loadsAfter, "a quick tab switch does NOT reload");

  t.group("the session expires mid-use — lock, keep the work, save it after login");
  saveStatus = 401;
  store.setTask("interp-go", "d02.t1", true);
  await settle();
  t.eq($("#lock").hidden, false, "the lock gate comes up");
  t.eq($("#app").hidden, true, "…over a hidden app");
  t.ok(/session expired/i.test($("#lock-err").textContent), `…explaining why ("${$("#lock-err").textContent}")`);
  t.eq(store.isDone("interp-go", "d02.t1"), true, "the unsaved tick is still shown");
  saveStatus = 200;
  $("#lock-secret").value = "secret";
  $("#lock-form").dispatchEvent(new w.Event("submit", { cancelable: true }));
  for (let i = 0; i < 60 && $("#app").hidden; i++) await wait(20);
  await settle();
  t.eq($("#app").hidden, false, "signing in again returns to the app");
  t.eq(db["interp-go\x01d02.t1"] && db["interp-go\x01d02.t1"].value, "true", "…and the kept tick is written to the database");

  t.group("reset never claims a success the server didn't confirm");
  await go("#/interp-go");
  db = { "interp-go\x01d03.t1": { kind: "task", value: "true" } };
  await go("#/interp-go");
  const doReset = async () => {
    click($("#fab")); await settle();
    click(buttonByText($("#drawer-body"), /Reset this roadmap/)); await settle();
    const modal = [...w.document.querySelectorAll("#modal-root .modal")].pop();
    click(buttonByText(modal, /Reset this roadmap/)); await settle(); await wait(250);
  };
  // re-sync so the tab holds the seeded tick
  click($("#fab")); await settle(); click(buttonByText($("#drawer-body"), /Sync now/)); await settle(); ui.closeDrawer();
  t.eq(store.isDone("interp-go", "d03.t1"), true, "(the tab holds a tick for interp-go)");
  saveStatus = 500;
  await doReset();
  t.ok(/Reset failed/.test(toastText()), `a failed reset says so ("${toastText().slice(0, 80)}")`);
  t.eq(store.isDone("interp-go", "d03.t1"), true, "…and the screen still shows what the database holds");
  saveStatus = 200;
  await doReset();
  const resetCall = calls.filter(c => c.action === "save" && c.body.clear).pop();
  t.ok(resetCall && resetCall.body.roadmap === "interp-go" && resetCall.body.stashFirst, "a confirmed reset clears the roadmap server-side (clear:true, stashed)");
  t.eq(store.isDone("interp-go", "d03.t1"), false, "…and only then clears it on screen");

  t.group("reset everything — cleared server-side first, and only then on screen");
  await go("#/today");
  db = { "interp-go\x01d05.t1": { kind: "task", value: "true" }, "bookmarks\x01bm_x": { kind: "bookmark", value: "{}" } };
  click($("#fab")); await settle(); click(buttonByText($("#drawer-body"), /Sync now/)); await settle(); ui.closeDrawer();
  const doResetAll = async () => {
    click($("#fab")); await settle();
    click(buttonByText($("#drawer-body"), /Reset everything/)); await settle();
    const modal = [...w.document.querySelectorAll("#modal-root .modal")].pop();
    click(buttonByText(modal, /Reset all/)); await settle(); await wait(250);
  };
  saveStatus = 500;
  await doResetAll();
  t.ok(/Reset failed/.test(toastText()), "a failed reset-all says so");
  t.eq(store.isDone("interp-go", "d05.t1"), true, "…and nothing is cleared on screen");
  saveStatus = 200;
  await doResetAll();
  const clearCall = calls.filter(c => c.action === "save" && c.body.clearAll).pop();
  t.ok(clearCall, "a confirmed reset-all sends clearAll (one server-side delete, stashed) — not a list of known ids");
  t.eq(Object.keys(db).length, 0, "…which also clears rows this tab never loaded (e.g. bookmarks)");
  t.eq(store.isDone("interp-go", "d05.t1"), false, "…then the screen is cleared");

  t.group("lock now — queued work is flushed before logging out");
  saveStatus = 200;
  store.setTask("interp-go", "d06.t1", true);
  click($("#fab")); await settle();
  click(buttonByText($("#drawer-body"), /Lock now/)); await settle();
  t.eq(db["interp-go\x01d06.t1"] && db["interp-go\x01d06.t1"].value, "true", "the pending tick reached the database");
  t.ok(calls.some(c => c.action === "logout"), "…then the session is ended");
  t.eq($("#lock").hidden, false, "…and the lock gate is shown");
  $("#lock-secret").value = "secret";
  $("#lock-form").dispatchEvent(new w.Event("submit", { cancelable: true }));
  for (let i = 0; i < 60 && $("#app").hidden; i++) await wait(20);
  await settle();

  t.group("Sync now reports a failed load");
  loadStatus = 500;
  click($("#fab")); await settle();
  click(buttonByText($("#drawer-body"), /Sync now/)); await settle();
  t.ok(/Couldn't reach the database/.test(toastText()), "a failed sync shows an error, not 'Synced'");
  loadStatus = 200;
}
