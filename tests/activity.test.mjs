// activity.test.mjs — the cross-roadmap effort log (activity.js): bucket completed
// tasks by the LOCAL day they were done (done_at), split required vs bonus minutes,
// and derive the comparisons/series that feed the Today "Your effort" panel.
//
// Fixture ticks (est known): d01.t1=30 req · d01.t2=45 req · d02.b1=40 BONUS · d03.t1=90 req.
import { suite } from "./_harness.mjs";
import { store, activity, util, registry, loadFixture, loadRoadmap, doneOn } from "./_load.mjs";

const t = suite("activity");
await loadFixture();
await loadRoadmap("rust-fastapi.js");         // second roadmap → prove cross-roadmap aggregation
const F = "fixture", R = "rust-fastapi";
store.resetAll();

// --- lay down a controlled activity history ---
doneOn(F, "d01.t1", 2026, 7, 13);   // req 30
doneOn(F, "d01.t2", 2026, 7, 13);   // req 45
doneOn(F, "d02.b1", 2026, 7, 13);   // bonus 40
doneOn(F, "d03.t1", 2026, 7, 12);   // req 90 (previous day)
// cross-roadmap day: one fixture + one rust task on 2026-07-15
const rustTask = (() => { const rm = registry.getRoadmap(R);
  for (const d of rm.days) for (const x of d.tasks) if (!x.optional) return x; })();
doneOn(F, "d04.t1", 2026, 7, 15);   // req 45
doneOn(R, rustTask.id, 2026, 7, 15);

const map = activity.activityByDate();

t.group("localDate — safe parsing");
t.eq(activity.localDate(null), null, "null → null");
t.eq(activity.localDate("not-a-date"), null, "garbage → null");
t.eq(activity.localDate(new Date(2026, 6, 13, 12).toISOString()), "2026-07-13", "local-noon ISO → local day");

t.group("per-day bucketing + required/bonus split");
const d13 = activity.dayEffort("2026-07-13", map);
t.eq(d13.tasks, 3, "Jul13 tasks = 3");
t.eq(d13.mins, 115, "Jul13 mins = 30+45+40 = 115");
t.eq(d13.reqTasks, 2, "Jul13 required tasks = 2");
t.eq(d13.reqMins, 75, "Jul13 required mins = 75");
t.eq(d13.bonusTasks, 1, "Jul13 bonus tasks = 1");
t.eq(d13.bonusMins, 40, "Jul13 bonus mins = 40");
t.eq(d13.roadmaps.size, 1, "Jul13 touched 1 roadmap");

const d12 = activity.dayEffort("2026-07-12", map);
t.eq(d12.tasks, 1, "Jul12 tasks = 1");
t.eq(d12.mins, 90, "Jul12 mins = 90");

t.group("empty day → blank record");
const d14 = activity.dayEffort("2026-07-14", map);
t.eq(d14.tasks, 0, "Jul14 tasks = 0");
t.eq(d14.mins, 0, "Jul14 mins = 0");
t.eq(d14.roadmaps.size, 0, "Jul14 touched no roadmaps");

t.group("cross-roadmap aggregation on a shared day");
const d15 = activity.dayEffort("2026-07-15", map);
t.eq(d15.roadmaps.size, 2, "Jul15 touched BOTH roadmaps");
t.eq(d15.tasks, 2, "Jul15 tasks = 2");
t.eq(d15.mins, 45 + (rustTask.est || 0), "Jul15 mins = fixture 45 + rust task est");

t.group("trailingAvg — recent daily norm, excluding the day itself");
// 7 days ending the day BEFORE Jul13 = Jul06..Jul12; only Jul12 (90) has effort.
t.near(activity.trailingAvg("2026-07-13", 7, map), 90 / 7, "7-day avg before Jul13 = 90/7");
t.eq(activity.trailingAvg("2026-07-13", 0, map), 0, "0-day window → 0 (no divide-by-zero)");

t.group("rangeTotals — inclusive span");
const rt = activity.rangeTotals("2026-07-12", "2026-07-13", map);
t.eq(rt.mins, 205, "Jul12..Jul13 mins = 90+115 = 205");
t.eq(rt.tasks, 4, "Jul12..Jul13 tasks = 1+3 = 4");

t.group("weekDelta — this 7 days vs the prior 7, non-overlapping");
const wk = activity.weekDelta("2026-07-13", map);
t.eq(wk.thisMins, 205, "this week (Jul07..Jul13) = 205");
t.eq(wk.lastMins, 0, "last week (Jun30..Jul06) = 0");
t.eq(wk.delta, 205, "delta = 205");

t.group("series — ordered window for the bar chart");
const sr = activity.series("2026-07-13", 14, map);
t.eq(sr.length, 14, "series length = 14");
t.eq(sr[13].date, "2026-07-13", "ends on the selected day");
t.eq(sr[13].mins, 115, "…with its minutes");
t.eq(sr[12].date, "2026-07-12", "penultimate = previous day");
t.eq(sr[12].mins, 90, "…with its minutes");
t.eq(sr[0].date, util.addDays("2026-07-13", -13), "starts 13 days back");
t.eq(sr[13].reqMins, 75, "series carries required-mins split");
t.eq(sr[13].bonusMins, 40, "series carries bonus-mins split");

t.group("tasksDoneOn — the day's completed items, with their roadmap");
const rows = activity.tasksDoneOn("2026-07-13");
t.eq(rows.length, 3, "3 tasks completed on Jul13");
t.ok(rows.every(r => r.rm.slug === F), "each row carries its roadmap");
t.ok(rows.some(r => r.task.optional), "the bonus task is included in the day's log");
t.eq(activity.tasksDoneOn("2026-07-14").length, 0, "empty day → no rows");

t.group("a done task WITHOUT a done_at stamp is not placed (stays truthful)");
const before = [...activity.activityByDate().values()].reduce((n, e) => n + e.mins, 0);
store.setCell(F, "d05.t1", "task", "true");   // done, but no done_at written
t.eq(store.isDone(F, "d05.t1"), true, "task is marked done");
const after = [...activity.activityByDate().values()].reduce((n, e) => n + e.mins, 0);
t.eq(after, before, "stampless completion adds nothing to the activity log");

t.done();
