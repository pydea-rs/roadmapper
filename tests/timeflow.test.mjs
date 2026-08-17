// timeflow.test.mjs — the POST-SHIFT / long-run health check.
//
// A uniform date-shift keeps the roadmaps internally consistent (content.test
// proves the structural invariants). This file proves the *other* half the owner
// worries about: that the app stays healthy as real time marches on — not just on
// day one after a restart, but months later, and past the finish line.
//
// It freezes "now" at a sweep of dates spanning each roadmap (before the start,
// across the arc, on the last day, and 1 + 5 months AFTER the end) and asserts the
// time-dependent stats engine never throws, never emits NaN/Invalid-Date, and keeps
// every percentage in [0,100] and every projected finish a real calendar date.
// Run it after every shift: if a shifted date ever pushed a computation out of
// range, a divide-by-zero, or an invalid projection, it fails here instead of in
// the user's browser five months from now.
import { suite } from "./_harness.mjs";

// ---- a re-settable frozen clock (todayStr()/new Date() read it live) ----
const RealDate = Date;
let FROZEN = [2026, 7, 19, 12, 0, 0];     // [y, m0, d, ...] — month is 0-based
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(...FROZEN); }
  static now() { return new RealDate(...FROZEN).getTime(); }
}
global.Date = FakeDate; globalThis.Date = FakeDate;
const freezeAt = iso => { const [y, m, d] = iso.split("-").map(Number); FROZEN = [y, m - 1, d, 12, 0, 0]; };

// import AFTER the clock is installed so any module-load-time date read is framed too
const { registry, store, util, stats } = await import("./_load.mjs");
const L = await import("./_load.mjs");
await L.loadRoadmap("rust-fastapi.js");
await L.loadRoadmap("interp-go.js");
await L.loadRoadmap("bedrock.js");
await L.loadRoadmap("raylib.js");

const t = suite("timeflow");

const isISO = s => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new RealDate(s + "T00:00:00Z").getTime());
const finite01 = n => Number.isFinite(n) && n >= 0 && n <= 100;

// the chronological endpoints of a roadmap (days may be authored out of order)
const span = rm => {
  const ds = rm.days.map(d => d.date).filter(Boolean).sort();
  return { first: ds[0], last: ds[ds.length - 1] };
};

/** assert the whole stats engine is healthy at the currently-frozen "now". */
function assertHealthy(rm, label) {
  let s;
  try { s = stats.computeAll(rm); }
  catch (e) { t.ok(false, `${rm.slug} @ ${label}: computeAll threw — ${e && e.message}`); return; }

  // headline percentages stay real and bounded
  t.ok(["actual", "original", "ontime"].every(k => finite01(s.overall[k].pct)),
    `${rm.slug} @ ${label}: overall pct fields are finite & within [0,100]`);
  t.ok(finite01(s.overall.bonus.pct), `${rm.slug} @ ${label}: bonus pct within [0,100]`);

  // projection: real calendar finishes, no Invalid-Date / NaN leaking from a
  // divide or an addDays over a bad offset — even when nothing (or everything) is left
  t.ok(isISO(s.projection.expectedFinish) && isISO(s.projection.optimisticFinish),
    `${rm.slug} @ ${label}: projected finish dates are valid YYYY-MM-DD`);
  t.ok(Number.isFinite(s.projection.perWeekMins) && s.projection.perWeekMins >= 1,
    `${rm.slug} @ ${label}: per-week projection stays >= 1 (no divide-by-zero)`);
  t.ok(!s.secProjection || isISO(s.secProjection.finish),
    `${rm.slug} @ ${label}: secondary projection (if any) is a valid date`);

  // streak is a real, non-negative day count
  t.ok(Number.isInteger(s.streak) && s.streak >= 0, `${rm.slug} @ ${label}: streak is a non-negative integer`);

  // currentDay resolves to a real day for a representative task (move-aware)
  const first = rm.days[0].tasks[0];
  const cd = stats.currentDay(rm, rm.slug, first);
  t.ok(rm.daysById.has(cd), `${rm.slug} @ ${label}: currentDay resolves to a real day`);

  // the sidebar summary the UI paints every route is also clean
  const sb = stats.sidebarStats(rm);
  t.ok(finite01(sb.pct), `${rm.slug} @ ${label}: sidebar pct within [0,100]`);
}

// ---- sweep every roadmap across its whole life + well past the end ----
for (const rm of registry.getRoadmaps()) {
  const { first, last } = span(rm);
  const pts = {
    "before start (-6d)": util.addDays(first, -6),
    "start day":          first,
    "quarter":            util.addDays(first, Math.round(util.daysBetween(first, last) * 0.25)),
    "midpoint":           util.addDays(first, Math.round(util.daysBetween(first, last) * 0.5)),
    "three-quarter":      util.addDays(first, Math.round(util.daysBetween(first, last) * 0.75)),
    "last day":           last,
    "1 month after end":  util.addDays(last, 30),
    "5 months after end": util.addDays(last, 150),
  };
  t.group(`${rm.slug} — time sweep (${first} → ${last}, + 5 months)`);
  for (const [label, iso] of Object.entries(pts)) { freezeAt(iso); assertHealthy(rm, label); }
}

// ---- the realest long-run case: EVERYTHING done, months after the finish ----
// (a user who completed the journey and keeps opening the app long after). Marks
// every required leaf done, then reads stats from 5 months past the last date.
t.group("fully-completed journey read from 5 months after the end");
for (const rm of registry.getRoadmaps()) {
  const { last } = span(rm);
  for (const d of rm.days) for (const task of d.tasks)
    for (const leaf of (task.subs || [task])) store.setTask(rm.slug, leaf.id, true);
  freezeAt(util.addDays(last, 150));
  const s = stats.computeAll(rm);
  t.eq(s.overall.actual.pct, 100, `${rm.slug}: a fully-ticked journey reads 100% complete`);
  t.ok(s.projection.done === true, `${rm.slug}: projection reports the journey done`);
  t.ok(isISO(s.projection.expectedFinish), `${rm.slug}: finish date still valid when nothing remains`);
}

t.done();
