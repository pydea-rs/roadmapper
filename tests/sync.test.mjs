// sync.test.mjs — the write-through save queue (sync.js). Focus: a per-slug
// save failure must NOT drop the changes of slugs that hadn't been tried yet.
// This exercises the retry buffer via a mocked fetch, no internals touched.
import { suite } from "./_harness.mjs";

const t = suite("sync");

// --- mock fetch: log every request, reply from a swappable responder ---------
let fetchLog = [];
let responder = () => mockRes(200, { ok: true });
const mockRes = (status, body) => ({
  status, ok: status >= 200 && status < 300,
  headers: { get: () => "application/json" },
  json: async () => body,
});
global.fetch = async (url, opts) => {
  const body = opts && opts.body ? JSON.parse(opts.body) : null;
  fetchLog.push({ url, body });
  return responder(url, body);
};

const base = new URL("../public/assets/js/", import.meta.url);
const sync = await import(new URL("sync.js", base).href);

// let every scheduled + chained flush fully settle
const settle = async () => { await sync.flush(); await new Promise(r => setTimeout(r, 0)); await sync.flush(); };
const slugsSaved = () => new Set(fetchLog.map(c => c.body && c.body.roadmap).filter(Boolean));

t.group("a per-slug failure keeps every other slug's pending changes");
// Phase 1: the backend rejects everything (session expired). Two roadmaps have
// pending ticks — a naive flush would clear the queue and requeue only the first.
responder = () => mockRes(401, { ok: false });
sync.queueChange("alpha", { id: "d01.t1", kind: "task", value: "true" });
sync.queueChange("bravo", { id: "d01.t1", kind: "task", value: "true" });
await settle();

// Phase 2: backend recovers. BOTH roadmaps must still get saved — if bravo's
// change had been dropped in phase 1, only alpha would be sent here.
fetchLog = [];
responder = () => mockRes(200, { ok: true });
await settle();

const saved = slugsSaved();
t.ok(saved.has("alpha"), "alpha's pending change is retried after recovery");
t.ok(saved.has("bravo"), "bravo's change survived alpha's failure (no silent drop)");

t.group("a clean queue settles to online");
fetchLog = [];
sync.queueChange("alpha", { id: "d01.t2", kind: "task", value: "true" });
await settle();
t.ok(slugsSaved().has("alpha"), "a subsequent change flushes normally");

/* ------------------------------------------------------------------ *
 *  Robustness: the app is left open for days, networks drop, sessions
 *  expire. Everything below drives the real module through a mocked fetch.
 * ------------------------------------------------------------------ */
const store = await import(new URL("store.js", base).href);
let status = null;
sync.onSyncStatus(s => { status = s; });
const calls = action => fetchLog.filter(c => c.url.includes(`action=${action}`));

t.group("login never rejects — an unreachable backend resolves { ok:false }");
responder = () => { throw new TypeError("Failed to fetch"); };
const lr = await sync.login("secret");
t.eq(lr.ok, false, "a network error resolves (the login form can re-enable itself)");
t.eq(lr.error, "unreachable", "…and says why");
responder = () => ({ status: 502, ok: false, headers: { get: () => "text/html" }, json: async () => ({}) });
t.eq((await sync.login("secret")).ok, false, "an HTML proxy error page resolves too");

t.group("a load never visually reverts changes the server hasn't accepted yet");
store.resetAll();
fetchLog = [];
responder = (url) => url.includes("action=save") ? mockRes(500, { ok: false, error: "boom" })
  : mockRes(200, { ok: true, data: {}, savedAt: null });
store.setSink((slug, change) => sync.queueChange(slug, change));
store.setTask("rm", "d01.t1", true);                 // queued; its save will fail
await settle();
t.ok(sync.hasPending(), "the failed save stays queued");
const loaded = await sync.loadAndReconcile();         // DB copy has nothing
t.ok(!loaded.error, "the load itself succeeded");
t.eq(store.isDone("rm", "d01.t1"), true, "the still-queued tick is re-applied over the DB copy (not silently reverted)");
t.ok(status !== "online", `the status does not claim "Saved" while work is pending (got ${status})`);

t.group("overlapping loads share one request");
fetchLog = [];
responder = (url) => url.includes("action=save") ? mockRes(200, { ok: true }) : mockRes(200, { ok: true, data: {} });
const p1 = sync.loadAndReconcile(), p2 = sync.loadAndReconcile();
t.ok(p1 === p2, "a second call while a load is in flight returns the same promise");
await p1;
t.eq(calls("load").length, 1, "…so only one load request is sent");
t.ok(!sync.hasPending(), "and the queue drained first");

t.group("401 — the session expired while the app was open");
store.setSink(null);
responder = () => mockRes(200, { ok: true });
await sync.login("secret");            // the first group's 401 left the module "expired" until a login — reset
let expired = 0;
sync.onAuthExpired(() => { expired++; });
const realSetTimeout = global.setTimeout;
let timers = [];
global.setTimeout = (fn, ms) => { if (ms >= 1000) { timers.push(fn); return timers.length; } return realSetTimeout(fn, ms); };
responder = () => mockRes(401, { ok: false, error: "authentication required" });
sync.queueChange("rm", { id: "d02.t1", kind: "task", value: "true" });
await settle();
sync.queueChange("rm", { id: "d02.t2", kind: "task", value: "true" });
await settle();
t.eq(expired, 1, "onAuthExpired fires once per expiry, not per failed request");
t.ok(sync.hasPending(), "the changes stay queued for after the next login");
t.eq(timers.length, 0, "no retry loop hammers the server while logged out");
responder = () => mockRes(200, { ok: true });
t.eq((await sync.login("secret")).ok, true, "logging in again…");
await settle();
t.ok(!sync.hasPending(), "…and the next flush writes the kept changes");

t.group("automatic retry with backoff after a network failure");
timers = [];
responder = () => { throw new TypeError("offline"); };
sync.queueChange("rm", { id: "d03.t1", kind: "task", value: "true" });
await settle();
t.eq(status, "offline", "status reads offline");
t.ok(timers.length >= 1, "a retry is scheduled (no need to wait for the next tick or tab hide)");
responder = () => mockRes(200, { ok: true });
fetchLog = [];
timers.shift()();                                     // fire the retry
await settle();
t.ok(calls("save").length >= 1 && !sync.hasPending(), "the retry saves the queued change");
t.eq(status, "online", "…and the status recovers");
global.setTimeout = realSetTimeout;

t.group("the server refusing a cell is surfaced, not reported as saved");
responder = () => mockRes(200, { ok: true, applied: 0, rejected: ["x"] });
sync.queueChange("rm", { id: "x", kind: "note", value: "…" });
await settle();
t.eq(status, "error", "a rejected cell turns the pill to an error");

t.group("dropQueued — a reset/import discards stale queued writes");
responder = () => { throw new TypeError("offline"); };
global.setTimeout = (fn, ms) => (ms >= 1000 ? 0 : realSetTimeout(fn, ms));
sync.queueChange("alpha", { id: "d01.t1", kind: "task", value: "true" });
sync.queueChange("bravo", { id: "d01.t1", kind: "task", value: "true" });
await settle();
sync.dropQueued("alpha");
responder = () => mockRes(200, { ok: true });
fetchLog = [];
await settle();
t.ok(!slugsSaved().has("alpha") && slugsSaved().has("bravo"), "only the dropped roadmap's queue is discarded");
global.setTimeout = realSetTimeout;

t.group("keepalive + bulk request shapes");
let lastOpts = null;
const prevFetch = global.fetch;
global.fetch = async (url, opts) => { lastOpts = opts; return mockRes(200, { ok: true }); };
sync.queueChange("rm", { id: "d04.t1", kind: "task", value: "true" });
await settle();
t.eq(lastOpts.keepalive, true, "a small save uses keepalive (survives the tab closing)");
await sync.saveFull({ big: { kind: "note", value: "z".repeat(70000) } });
t.eq(lastOpts.keepalive, false, "a large bulk save does not (browsers cap keepalive bodies)");
await sync.saveRoadmapFull("rm", [], { clear: true, reason: "reset-roadmap" });
t.eq(JSON.parse(lastOpts.body).clear, true, "saveRoadmapFull forwards clear:true");
await sync.clearAll();
t.eq(JSON.parse(lastOpts.body).clearAll, true, "clearAll sends clearAll:true");
global.fetch = async () => mockRes(500, { ok: false, error: "nope" });
t.eq((await sync.clearAll()).ok, false, "a failed bulk save resolves { ok:false } (the caller must not claim success)");
global.fetch = prevFetch;

t.group("unload hand-off — a queue is only forgotten once its beacon is accepted");
global.document = Object.assign(new EventTarget(), { visibilityState: "visible" });
global.window = new EventTarget();
let beaconOk = false, beacons = 0;
Object.defineProperty(globalThis, "navigator", { configurable: true, value: { sendBeacon: () => { beacons++; return beaconOk; } } });
sync.installExitFlush();
responder = () => { throw new TypeError("offline"); };
global.setTimeout = (fn, ms) => (ms >= 1000 ? 0 : realSetTimeout(fn, ms));
sync.queueChange("rm", { id: "d05.t1", kind: "task", value: "true" });
await settle();
window.dispatchEvent(new Event("pagehide"));
t.ok(beacons >= 1, "pagehide sends a beacon for the pending queue");
t.ok(sync.hasPending(), "a refused beacon keeps the queue (a bfcache restore still has it)");
beaconOk = true;
window.dispatchEvent(new Event("pagehide"));
t.ok(!sync.hasPending(), "an accepted beacon hands the queue off");
global.setTimeout = realSetTimeout;
responder = () => mockRes(200, { ok: true });
fetchLog = [];
sync.queueChange("rm", { id: "d06.t1", kind: "task", value: "true" });
responder = () => { throw new TypeError("offline"); };
await settle();
responder = () => mockRes(200, { ok: true });
window.dispatchEvent(new Event("online"));
await settle();
t.ok(!sync.hasPending(), "the browser's 'online' event flushes immediately");

t.done();
