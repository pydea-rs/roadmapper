// raylib.test.mjs — invariants specific to the second side-track roadmap,
// "Big Bang" (slug "raylib"): the interleaved-thread design, the course→physics→
// project→shaders SEQUENCING the owner specified, milestone placement, recall
// cards and its weekly side-day count. Structural basics (id/date ordering, week
// windows, referentOf) are covered for every roadmap by content.test.mjs; the
// cross-roadmap daily caps and week-to-week weekday variety by schedule.test.mjs.
import { suite } from "./_harness.mjs";
import { registry, loadRoadmap } from "./_load.mjs";

const t = suite("raylib");
// the two mains are loaded so the collision checks have something to compare to
await loadRoadmap("rust-fastapi.js");
await loadRoadmap("interp-go.js");
await loadRoadmap("bedrock.js");
await loadRoadmap("raylib.js");

const rm = registry.getRoadmap("raylib");
const firstTaskObj = d => d.tasks[0] && d.tasks[0].obj;
const allTasks = rm.days.flatMap(d => d.tasks);

t.group("registration & shape");
t.ok(!!rm, "raylib roadmap is registered");
t.eq(rm.kind, "side", "raylib is on the side track (its stats never sum into the main track)");
t.ok(registry.getSideRoadmaps().some(r => r.slug === "raylib"), "getSideRoadmaps() includes raylib");
t.ok(registry.getMainRoadmaps().every(r => r.slug !== "raylib"), "raylib is NOT a main roadmap");
t.deep(rm.objectives.map(o => o.id).sort(),
  ["course", "examples", "noc", "project", "shaders"],
  "the five interleaved threads are present");
t.ok(rm.days.length >= 50, `the whole arc is authored (${rm.days.length} days)`);
t.ok(rm.days[0].date === "2026-09-05", "the journey starts on 2026-09-05, its first day in week 1");

t.group("recall cards — every task carries >= 2 well-formed {q,a}");
t.ok(allTasks.filter(x => !x.optional).every(x => x.cards && x.cards.length >= 2),
  "every non-optional task has >= 2 recall cards");
t.ok(allTasks.every(x => !x.cards || x.cards.every(c => c.q && c.a)),
  "every recall card has both a question and an answer");

t.group("sub-tasks — every task is broken into individually-tickable parts");
const required = allTasks.filter(x => !x.optional);
t.ok(required.every(x => x.subs && x.subs.length >= 2),
  "every required task splits into >= 2 sub-tasks (no more all-at-once tasks)");
t.ok(allTasks.every(x => !x.subs || x.est === x.subs.reduce((s, l) => s + l.est, 0)),
  "parent est is the sum of its sub-tasks, so per-day load is unchanged");
t.ok(allTasks.every(x => !x.subs || x.subs.every(l => Number.isFinite(l.est) && l.est > 0)),
  "every sub-task carries a positive minute estimate");
t.ok(allTasks.every(x => !x.subs || x.subs.every(l => l.label || l.lead)),
  "every sub-task has a label");
t.ok(allTasks.every(x => !x.subs || x.subs.every(l => l.obj === x.obj && l.optional === x.optional)),
  "sub-tasks inherit their parent's objective and optional flag");

t.group("thread SEQUENCING — the owner's ordering");
// course (Udemy) drives early and TAPERS once section 6 ("Projects") is reached;
// its last task is the audio/GUI capstone. (Denser 3/week re-pace → ends ~mid-Nov.)
const courseDates = allTasks.filter(x => x.obj === "course").map(x => x.date);
// NOTE: this mid-November bound tracks the schedule — bump it with each uniform
// date-shift pass (like STEADY below), since the whole arc slides later each time.
t.ok(Math.max(...courseDates.map(Date.parse)) <= Date.parse("2026-11-15"),
  "the course thread finishes by mid-November (then it's physics + project + shaders)");
// the Big Bang PROJECT only begins in the second half, after the course is underway
const projectDates = allTasks.filter(x => x.obj === "project").map(x => x.date);
t.ok(Math.min(...projectDates.map(Date.parse)) >= Date.parse("2026-10-23"),
  "the simulation project starts only in the second half (after the course, once physics exists)");
// SHADERS (Book of Shaders) start only once Nature of Code is ~70-80% read — late
const shaderDates = allTasks.filter(x => x.obj === "shaders").map(x => x.date);
t.ok(Math.min(...shaderDates.map(Date.parse)) >= Date.parse("2026-12-04"),
  "shaders begin only in the final third (after Nature of Code is ~70-80% done)");
// physics (noc) spans the whole journey (it's the through-line)
const nocDates = allTasks.filter(x => x.obj === "noc").map(x => x.date);
t.ok(Math.min(...nocDates.map(Date.parse)) <= Date.parse("2026-09-09") &&
     Math.max(...nocDates.map(Date.parse)) >= Date.parse("2026-12-24"),
  "the Nature-of-Code physics thread runs as the through-line, start to late");

t.group("threads stay interleaved");
// consecutive side-days should mostly switch focus; the late shader/project phase
// naturally pairs, so allow a small number of same-thread runs (no long stretches).
let sameThread = 0, run = 1, longest = 1;
for (let i = 1; i < rm.days.length; i++) {
  const a = firstTaskObj(rm.days[i - 1]), b = firstTaskObj(rm.days[i]);
  if (a && a === b) { sameThread++; run++; longest = Math.max(longest, run); } else run = 1;
}
t.ok(sameThread <= 8, `threads interleave — few consecutive-same-thread pairs (found ${sameThread})`);
t.ok(longest <= 3, `no thread runs more than 3 days in a row (longest ${longest})`);

t.group("milestones — the journey's checkpoints");
t.eq(rm.milestones.length, 6, "six milestones mark the arc");
t.ok(rm.milestones.every(m => rm.weeksById.has(m.week)), "every milestone points at a real week");
t.ok(rm.milestones.every(m => (m.rule.require || []).every(id => rm.tasksById.has(id))),
  "every milestone requires only real tasks");
// the two headline checkpoints exist where they should
t.ok(rm.milestones.some(m => m.week === "w6"),
  "the 'half the raylib basics' milestone lands at week 6 (end of Collision & Tilemaps)");
t.ok(rm.milestones.some(m => m.week === "w19"),
  "the capstone milestone lands at the final week (19)");

t.group("scheduling — never piles onto a heavy day");
// The old "lands on LIGHT main days" framing pinned the mains to fixed weekdays so the
// side track could dodge them. Since the 2026-09-13 re-plan no roadmap has fixed
// weekdays, so the promise is stated directly on the whole day: any date raylib
// shares stays inside the owner's ~4h ceiling for a lightly-shared day.
const combined = new Map();
for (const r of registry.getRoadmaps())
  for (const d of r.days) {
    const est = d.tasks.reduce((s, x) => s + (x.optional ? 0 : x.est || 0), 0);
    combined.set(d.date, (combined.get(d.date) || 0) + est);
  }
const worstShared = Math.max(...rm.days.map(d => combined.get(d.date)));
t.ok(worstShared <= 270, `every raylib date stays a light combined day (worst ${worstShared} min, ceiling ~4h)`);
// A side-track day is a single focused block on its own.
const selfMax = Math.max(...rm.days.map(d => d.tasks.reduce((s, x) => s + (x.optional ? 0 : x.est || 0), 0)));
t.ok(selfMax <= 130, `a raylib day stays one focused block (worst ${selfMax} min)`);
// unique dates (the effort/digest views key off date)
const dates = rm.days.map(d => d.date);
t.eq(new Set(dates).size, dates.length, "raylib day dates are unique (no self-collisions)");
// cadence: the re-paced 3/week rule — every week 1–3 side-days, never more, and
// the vast majority sit at the full 3 (a couple ease off: one load-balanced week
// and the single capstone day).
const perWeek = {};
for (const d of rm.days) perWeek[d.week] = (perWeek[d.week] || 0) + 1;
const counts = Object.values(perWeek);
t.ok(counts.every(n => n >= 1 && n <= 3),
  "every week holds 1–3 side-days (never more than the 3/week cap)");
t.ok(counts.filter(n => n === 3).length >= counts.length - 2,
  `the denser 3/week cadence holds for all but at most two weeks (${counts.filter(n => n === 3).length}/${counts.length} at 3)`);

t.done();
