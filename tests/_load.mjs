// _load.mjs — resolve and import the app's ES modules from the tests folder,
// using paths relative to THIS file (so the suite is portable, no absolute
// paths). Content modules self-register on import.

const JS = new URL("../public/assets/js/", import.meta.url);
const RM = new URL("../public/roadmaps/", import.meta.url);
const j = name => new URL(name, JS).href;
const r = name => new URL(name, RM).href;

export const registry   = await import(j("registry.js"));
export const store      = await import(j("store.js"));
export const util       = await import(j("util.js"));
export const stats      = await import(j("stats.js"));
export const activity   = await import(j("activity.js"));
export const reconcile  = await import(j("reconcile.js"));

/** Import a roadmap content module by filename (it registers itself). */
export async function loadRoadmap(file) { await import(r(file)); }

/** The deterministic hand-written test fixture (slug "fixture"). */
export async function loadFixture() { await import(r("_fixture.js")); return registry.getRoadmap("fixture"); }

/** The tiny SIDE-track fixture (slug "fixture-side", kind:"side"). */
export async function loadFixtureSide() { await import(r("_fixture-side.js")); return registry.getRoadmap("fixture-side"); }

/** Mark a task done and stamp its done_at to a controlled LOCAL-noon date.
 *  Local-noon round-trips through toISOString()/new Date() in any timezone. */
export function doneOn(slug, taskId, y, m, d) {
  store.setTask(slug, taskId, true);
  store.setCell(slug, `done_at:${taskId}`, "meta", new Date(y, m - 1, d, 12, 0, 0).toISOString());
}

/** Sum est of tasks in a roadmap matching a predicate. */
export function sumEst(rm, pred) {
  let s = 0;
  for (const day of rm.days) for (const t of day.tasks) if (pred(t, day)) s += (t.est || 0);
  return s;
}
