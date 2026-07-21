// stats.test.mjs — the progress/statistics engine (stats.js), verified against
// the hand-written fixture whose numbers are fully known:
//
//   PRIMARY required (9 tasks, 375m): d01.t1=30 d01.t2=45 d01.t3=15
//     d02.t1=40 d02.t2=50 · d03.t1=90 · d04.t1=45 d04.t2=30 · d05.t1=30
//   SECONDARY required (2 tasks, 65m): d03.t2=25 · d04.t3=40
//   BONUS/optional  (2 tasks, 100m):   d02.b1=40 · d05.b1=60
//
// The critical invariant under test: bonus and secondary work are tracked on
// their OWN meters — bonus never enters `invested`/`remaining`/the primary
// denominator, and undone bonus never inflates the required remaining/ETA.
import { suite } from "./_harness.mjs";
import { store, stats, util, loadFixture, doneOn } from "./_load.mjs";

const t = suite("stats");
const rm = await loadFixture();
const S = "fixture";
const reset = () => store.resetAll();
const compute = () => stats.computeAll(rm);

const PRIMARY_N = 9, PRIMARY_MINS = 375;
const SEC_N = 2, SEC_MINS = 65;
const BONUS_N = 2, BONUS_MINS = 100;

t.group("empty state — nothing done");
reset();
let s = compute();
t.eq(s.overall.actual.done, 0, "primary done = 0");
t.eq(s.overall.actual.total, PRIMARY_N, "primary total = 9");
t.eq(s.overall.actual.pct, 0, "primary pct = 0");
t.eq(s.secondary.done, 0, "secondary done = 0");
t.eq(s.secondary.total, SEC_N, "secondary total = 2");
t.eq(s.overall.bonus.done, 0, "bonus done = 0");
t.eq(s.overall.bonus.total, BONUS_N, "bonus total = 2");
t.eq(s.overall.bonus.estDone, 0, "bonus estDone = 0");
t.eq(s.overall.bonus.estRemaining, BONUS_MINS, "bonus estRemaining = 100");
t.eq(s.invested, 0, "invested = 0");
t.eq(s.remaining, PRIMARY_MINS, "required remaining = 375");
t.eq(s.remainingSecondary, SEC_MINS, "secondary remaining = 65");
t.eq(s.bonusInvested, 0, "bonusInvested = 0");
t.eq(s.bonusRemaining, BONUS_MINS, "bonusRemaining = 100");

t.group("a primary tick moves invested & required-remaining together");
reset();
store.setTask(S, "d01.t1", true);            // primary, 30m
s = compute();
t.eq(s.overall.actual.done, 1, "primary done = 1");
t.eq(s.overall.actual.pct, util.pct(1, 9), "primary pct = 11");
t.eq(s.invested, 30, "invested = 30");
t.eq(s.remaining, PRIMARY_MINS - 30, "remaining = 345");

t.group("★ bonus is fully separated (the key invariant)");
reset();
store.setTask(S, "d02.b1", true);            // bonus, 40m
s = compute();
t.eq(s.overall.bonus.done, 1, "bonus done = 1");
t.eq(s.overall.bonus.estDone, 40, "bonus estDone = 40");
t.eq(s.overall.bonus.estRemaining, 60, "bonus estRemaining = 60");
t.eq(s.bonusInvested, 40, "bonusInvested = 40");
t.eq(s.bonusRemaining, 60, "bonusRemaining = 60");
t.eq(s.overall.actual.done, 0, "bonus does NOT count toward primary progress");
t.eq(s.overall.actual.total, PRIMARY_N, "bonus is NOT in the primary denominator");
t.eq(s.invested, 0, "bonus time is EXCLUDED from invested");
t.eq(s.remaining, PRIMARY_MINS, "undone-or-done bonus does NOT change required remaining/ETA");

t.group("secondary work lives on its own meter (but is 'required' time)");
reset();
store.setTask(S, "d03.t2", true);            // secondary, 25m
s = compute();
t.eq(s.secondary.done, 1, "secondary done = 1");
t.eq(s.overall.actual.done, 0, "secondary does NOT touch primary progress");
t.eq(s.invested, 25, "secondary done counts into invested (it is real required time)");
t.eq(s.remaining, PRIMARY_MINS, "primary remaining unchanged by secondary");
t.eq(s.remainingSecondary, SEC_MINS - 25, "secondary remaining = 40");

t.group("objective breakdown");
reset();
s = compute();
const core = s.objectives.find(o => o.id === "core");
const side = s.objectives.find(o => o.id === "side");
t.eq(core.tier, "primary", "core is primary");
t.eq(core.actual.total, PRIMARY_N, "core primary-required total = 9");
t.eq(core.bonus.total, BONUS_N, "core owns both bonus tasks");
t.eq(core.bonus.estTotal, BONUS_MINS, "core bonus est total = 100");
t.eq(side.tier, "secondary", "side is secondary");
t.eq(side.actual.total, SEC_N, "side secondary total = 2");
t.eq(side.bonus.total, 0, "side has no bonus");

t.group("dual progress under a move (actual-by-current vs original-by-origin)");
reset();
t.eq(stats.currentDay(rm, S, rm.tasksById.get("d01.t1")), "d01", "task starts on its origin day");
store.setMove(S, "d01.t1", "d05");           // move first task of d01 → d05
s = compute();
t.eq(stats.currentDay(rm, S, rm.tasksById.get("d01.t1")), "d05", "currentDay follows the move");
t.eq(s.days["d01"].original.total, 3, "d01 ORIGINAL still owns its 3 primary tasks");
t.eq(s.days["d01"].actual.total, 2, "d01 ACTUAL lost the moved task (2 remain)");
t.eq(s.days["d05"].original.total, 1, "d05 ORIGINAL still just its own 1 primary task");
t.eq(s.days["d05"].actual.total, 2, "d05 ACTUAL gained the moved task (2 now)");
t.eq(s.overall.actual.total, PRIMARY_N, "moving never changes the overall total");

t.group("milestones");
reset();
s = compute();
const m1 = s.milestones.find(m => m.id === "w1.m1");   // require d03.t1
t.eq(m1.target, 1, "w1.m1 target = 1 task");
t.eq(m1.met, false, "w1.m1 not met while d03.t1 undone");
store.setTask(S, "d03.t1", true);
s = compute();
t.eq(s.milestones.find(m => m.id === "w1.m1").met, true, "w1.m1 met once d03.t1 done");

// weekPct milestone judged by ORIGINAL week-1 progress (6 primary tasks → need 5 for 70%)
reset();
for (const id of ["d01.t1", "d01.t2", "d01.t3", "d02.t1"]) store.setTask(S, id, true);  // 4/6 = 67%
s = compute();
t.eq(s.milestones.find(m => m.id === "w1.m2").met, false, "w1.m2 not met at 67% (4/6)");
store.setTask(S, "d02.t2", true);                                                        // 5/6 = 83%
s = compute();
t.eq(s.milestones.find(m => m.id === "w1.m2").met, true, "w1.m2 met at 83% (5/6)");

t.group("projection: done flips true only when all required primary is complete");
reset();
s = compute();
t.eq(s.projection.done, false, "not done at the start");
t.ok(s.projection.remainingMins === PRIMARY_MINS, "projection.remainingMins = required remaining");
t.ok(s.projection.perWeekMins > 0, "a positive weekly capacity is projected");
t.ok(/^\d{4}-\d{2}-\d{2}$/.test(s.projection.expectedFinish), "expectedFinish is a real date");
for (const day of rm.days) for (const task of day.tasks)
  if (!task.optional && (rm.objById.get(task.obj) || {}).tier !== "secondary") store.setTask(S, task.id, true);
s = compute();
t.eq(s.overall.actual.pct, 100, "primary at 100%");
t.eq(s.remaining, 0, "required remaining = 0");
t.eq(s.projection.done, true, "projection.done = true when required work is complete");

t.group("soft (tryout/suggestion) stats — tracked, never in real progress");
reset();
s = compute();
t.eq(s.softStats.total, 2, "2 tickable soft items in the fixture");
t.eq(s.softStats.done, 0, "none ticked");
store.setSoft(S, "d01.s2", true);            // the tryout
s = compute();
t.eq(s.softStats.done, 1, "one soft ticked");
t.eq(s.overall.actual.done, 0, "soft ticks never count as real progress");

t.group("streak — consecutive fully-done past active days");
reset();
for (const day of rm.days) for (const task of day.tasks) if (!task.optional) store.setTask(S, task.id, true);
s = compute();
const today = util.todayStr();
const pastActive = rm.days.filter(d => !d.off && d.date <= today &&
  d.tasks.some(x => !x.optional && (rm.objById.get(x.obj) || {}).tier !== "secondary"));
t.eq(s.streak, pastActive.length, `streak = ${pastActive.length} past active days, all complete`);

t.group("on-time — done on/before the ORIGINAL date counts; later ticks don't");
// d01 (2026-07-13) primary: t1=30, t2=45, t3=15
reset();
doneOn(S, "d01.t1", 2026, 7, 13);            // on the day → on-time
doneOn(S, "d01.t3", 2026, 7, 12);            // a day early → on-time
doneOn(S, "d01.t2", 2026, 7, 20);            // a week late → NOT on-time
s = compute();
t.eq(s.days["d01"].original.done, 3, "d01 original counts all three done");
t.eq(s.days["d01"].ontime.done, 2, "d01 on-time counts only the two finished by its date");
t.eq(s.days["d01"].ontime.total, 3, "on-time denominator = the day's original tasks (3)");
t.eq(s.days["d01"].ontime.pct, util.pct(2, 3), "d01 on-time pct = 67");
t.eq(s.overall.ontime.done, 2, "overall on-time = 2");
t.eq(s.overall.actual.done, 3, "actual still counts all three");
t.eq(s.weeks["w1"].ontime.done, 2, "week-1 on-time rolls the two up");
t.eq(s.objectives.find(o => o.id === "core").ontime.done, 2, "core objective on-time = 2");

t.group("a done task with no done_at stamp cannot be proven on-time");
reset();
store.setCell(S, "d01.t1", "task", "true");  // ticked, but no timestamp written
s = compute();
t.eq(s.days["d01"].actual.done, 1, "it still counts as done");
t.eq(s.days["d01"].ontime.done, 0, "but not as on-time (no timestamp = can't prove it)");

t.group("on-time is judged by the ORIGINAL date — a move can't change it");
reset();
store.setMove(S, "d01.t1", "d05");           // push it to a later day…
doneOn(S, "d01.t1", 2026, 7, 13);            // …but finish it on d01's original date
s = compute();
t.eq(s.days["d01"].ontime.done, 1, "on-time credit stays on the ORIGIN day (d01)");
t.eq(s.days["d05"].ontime.done, 0, "the move destination earns no on-time credit");
t.eq(s.overall.ontime.done, 1, "still exactly one on-time overall");

t.group("sidebarStats summary");
reset();
const sb = stats.sidebarStats(rm);
t.eq(sb.pct, 0, "sidebar pct = 0 when empty");
t.ok(["on", "ahead", "behind"].includes(sb.track), "sidebar track is a known state");

t.done();
