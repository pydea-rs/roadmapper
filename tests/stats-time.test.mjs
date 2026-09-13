// stats-time.test.mjs — the time-dependent verdicts in stats.js, under a frozen,
// re-settable clock: milestone status (met / at-risk / missed, incl. a re-dated card),
// the on-track state judged against the plan's OWN curve, and the shared daily budget
// behind the projection. Small purpose-built roadmaps, so every number is exact.
import { suite } from "./_harness.mjs";

const RealDate = Date;
let FROZEN = [2026, 6, 13, 12, 0, 0];
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(...FROZEN); }
  static now() { return new RealDate(...FROZEN).getTime(); }
}
global.Date = FakeDate;
const freezeAt = iso => { const [y, m, d] = iso.split("-").map(Number); FROZEN = [y, m - 1, d, 12, 0, 0]; };

const { registry, store, stats } = await import("./_load.mjs");
const t = suite("stats-time");
const O = [{ id: "o", title: "O", tier: "primary" }];
const task = (id, extra = {}) => ({ id, obj: "o", est: 30, label: id, ...extra });

/* ---------------- shared daily budget (registered FIRST: it reads every roadmap) ---------------- */
t.group("projection budget — the owner's shared daily ceiling, split by concurrency");
// 8 dated days over exactly two weeks → 4 dates/week; cadence [4] → one roadmap per date
const DATES = ["2026-07-13", "2026-07-14", "2026-07-16", "2026-07-18", "2026-07-20", "2026-07-21", "2026-07-23", "2026-07-26"];
const budgetRm = (slug, cadence) => ({ slug, title: slug, objectives: O, cadence: { activeDaysPerWeek: cadence },
  days: DATES.map((date, i) => ({ id: `d${String(i + 1).padStart(2, "0")}`, date, tasks: [task("t1")], soft: [] })) });
freezeAt("2026-07-13");
registry.registerRoadmap(budgetRm("bud-a", [4]));
const perWeek = slug => stats.computeAll(registry.getRoadmap(slug)).projection.perWeekMins;
t.eq(perWeek("bud-a"), Math.round(4 * 240 * 0.92), "alone on its dates (1 roadmap/day): 4 days × 240 min × tax");
registry.registerRoadmap(budgetRm("bud-b", [4]));
t.eq(perWeek("bud-a"), Math.round(4 * (240 / 2) * 0.92), "two roadmaps on the same dates share the 4h ceiling (≤2 → 240)");
registry.registerRoadmap(budgetRm("bud-c", [4]));
t.eq(perWeek("bud-a"), Math.round(4 * (360 / 3) * 0.92), "three share the 6h ceiling (3+ → 360)");
registry.registerRoadmap(budgetRm("bud-d", [4]));
t.eq(perWeek("bud-a"), Math.round(4 * (360 / 4) * 0.92), "four still share 6h — the ceiling never grows past 360");
// a finished roadmap stops drawing a share
for (const slug of ["bud-b", "bud-c", "bud-d"]) for (const l of registry.getRoadmap(slug).leaves) store.setTask(slug, l.id, true);
t.eq(perWeek("bud-a"), Math.round(4 * 240 * 0.92), "roadmaps with no required work left release their share");
store.resetAll();
// retire the budget roadmaps from later groups' concurrency (all work done = no share)
for (const slug of ["bud-a", "bud-b", "bud-c", "bud-d"]) for (const l of registry.getRoadmap(slug).leaves) store.setTask(slug, l.id, true);
const budgetTicks = { ...store.rawState() };

/* ---------------- milestone status ---------------- */
registry.registerRoadmap({ slug: "ms", title: "ms", objectives: O,
  weeks: [{ id: "w1", title: "W1", start: "2026-07-13" }, { id: "w2", title: "W2", start: "2026-07-20" }],
  days: [
    { id: "d01", date: "2026-07-17", week: "w1", tasks: [task("t1")], soft: [] },
    { id: "d02", date: "2026-07-25", week: "w2", tasks: [task("t1")], soft: [] },
  ],
  milestones: [{ id: "w1.m1", week: "w1", title: "gate", rule: { type: "tasks", require: ["d01.t1"] } }] });
const ms = registry.getRoadmap("ms");
const status = () => stats.computeAll(ms).milestones.find(m => m.id === "w1.m1").status;
const reset = () => { store.resetAll(); for (const [slug, b] of Object.entries(budgetTicks)) for (const [id, c] of Object.entries(b)) store.setCell(slug, id, c.kind, c.value, { silent: true }); };

t.group("milestone status — at risk through the week's last day, missed after it");
reset();
freezeAt("2026-07-19"); t.eq(status(), "risk", "on the week's last day an unmet milestone is still at risk");
freezeAt("2026-07-20"); t.eq(status(), "missed", "the day after the week ends it is missed");
store.setTask("ms", "d01.t1", true);
t.eq(status(), "met", "completing the gating task meets it (even late)");

t.group("a card legitimately re-dated past the week end extends the deadline — a task move does not");
reset();
store.setDayDate("ms", "d01", "2026-07-22");             // inside d01's free gap (→ 07-25)
freezeAt("2026-07-21"); t.eq(status(), "risk", "the gating card now sits on 07-22 → not missed on 07-21");
freezeAt("2026-07-22"); t.eq(status(), "risk", "…nor on the card's new date itself");
freezeAt("2026-07-23"); t.eq(status(), "missed", "…but missed the day after the card's new date");
reset();
store.setMove("ms", "d01.t1", "d02");                     // dragging the TASK away can't postpone the milestone
freezeAt("2026-07-21"); t.eq(status(), "missed", "moving the gating task to a later day does NOT extend the deadline");

/* ---------------- on-track vs the plan's own curve ---------------- */
t.group("on-track is judged against the PLANNED curve, not a straight line");
// front-loaded: 10 tasks on day 1, one on day 21. Keeping exactly to plan must read "on".
registry.registerRoadmap({ slug: "front", title: "front", objectives: O, days: [
  { id: "d01", date: "2026-08-01", tasks: Array.from({ length: 10 }, (_, i) => task(`t${i + 1}`)), soft: [] },
  { id: "d02", date: "2026-08-21", tasks: [task("t1")], soft: [] },
] });
const front = registry.getRoadmap("front");
const track = () => stats.computeAll(front).projection.track;
reset();
freezeAt("2026-08-02");
for (let i = 1; i <= 10; i++) store.setTask("front", `d01.t${i}`, true);
t.eq(track(), "on", "exactly on plan (10/11 done, 10/11 scheduled) reads ON — a straight line would call it 'ahead'");
reset();
t.eq(track(), "behind", "nothing done when 91% was scheduled reads BEHIND — a straight line would call it 'on'");
freezeAt("2026-07-25");
for (let i = 1; i <= 3; i++) store.setTask("front", `d01.t${i}`, true);
t.eq(track(), "ahead", "work done before anything is scheduled reads AHEAD");
t.eq(stats.PACE_TOLERANCE_PTS, 5, "the shared tolerance (also used by the Insights readout) is 5 pts");

t.done();
