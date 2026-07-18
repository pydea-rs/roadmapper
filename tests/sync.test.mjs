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

t.done();
