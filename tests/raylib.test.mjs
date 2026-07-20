// raylib.test.mjs — invariants specific to the second side-track roadmap,
// "Big Bang" (slug "raylib"): the interleaved-thread design, the course→physics→
// project→shaders SEQUENCING the owner specified, milestone placement, recall
// cards, and the scheduling promise that it lands on LIGHT days and never piles
// onto the main roadmaps (especially Rust). Structural basics (id/date ordering,
// week windows, referentOf) are covered for every roadmap by content.test.mjs.
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
t.ok(rm.days[0].date === "2026-07-20", "the journey starts today (2026-07-20), not a week later");

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
// its last task is the audio/GUI capstone — nothing after late October.
const courseDates = allTasks.filter(x => x.obj === "course").map(x => x.date);
t.ok(Math.max(...courseDates.map(Date.parse)) <= Date.parse("2026-10-31"),
  "the course thread finishes by end of October (then it's physics + project + shaders)");
// the Big Bang PROJECT only begins in the second half, after the course is underway
const projectDates = allTasks.filter(x => x.obj === "project").map(x => x.date);
t.ok(Math.min(...projectDates.map(Date.parse)) >= Date.parse("2026-10-01"),
  "the simulation project starts only in the second half (after the course, once physics exists)");
// SHADERS (Book of Shaders) start only once Nature of Code is ~70-80% read — late
const shaderDates = allTasks.filter(x => x.obj === "shaders").map(x => x.date);
t.ok(Math.min(...shaderDates.map(Date.parse)) >= Date.parse("2026-11-15"),
  "shaders begin only in the final third (after Nature of Code is ~70-80% done)");
// physics (noc) spans the whole journey (it's the through-line)
const nocDates = allTasks.filter(x => x.obj === "noc").map(x => x.date);
t.ok(Math.min(...nocDates.map(Date.parse)) <= Date.parse("2026-08-01") &&
     Math.max(...nocDates.map(Date.parse)) >= Date.parse("2026-12-01"),
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
t.ok(rm.milestones.some(m => m.week === "w9"),
  "the 'half the raylib basics' milestone lands at week 9 (end of Collision & Tilemaps)");
t.ok(rm.milestones.some(m => m.week === "w23"),
  "the capstone milestone lands at the final week (23)");

t.group("scheduling — lands on LIGHT days, low collision with the mains");
// combined main-roadmap minutes per calendar date
const mainLoad = new Map();
for (const r of registry.getMainRoadmaps())
  for (const d of r.days) {
    const est = d.tasks.reduce((s, x) => s + (x.est || 0), 0);
    mainLoad.set(d.date, (mainLoad.get(d.date) || 0) + est);
  }
// The light-day invariant is measured on raylib's STEADY STATE (from 2026-08-02).
// The launch fortnight (Jul 20–Aug 1) deliberately overlaps: the owner asked all
// three roadmaps to KICK OFF together on Mon Jul 20, and during that window
// interp-go runs a +1 (vs the mains' +2) date offset so its heavy opening days
// coincide with raylib's. That overlap is accepted and transient — raylib's
// Group-2 cadence re-plan (2–3 days/week) re-tunes placement across the full range.
const STEADY = "2026-08-02";
let maxMainOnRaylibDay = 0, maxCombined = 0;
for (const d of rm.days) {
  if (d.date < STEADY) continue;                 // skip the blessed shared-launch window
  const main = mainLoad.get(d.date) || 0;
  const self = d.tasks.reduce((s, x) => s + (x.est || 0), 0);
  maxMainOnRaylibDay = Math.max(maxMainOnRaylibDay, main);
  maxCombined = Math.max(maxCombined, main + self);
}
t.ok(maxMainOnRaylibDay <= 120,
  `no steady-state raylib day lands on a heavy main-roadmap day (worst main load ${maxMainOnRaylibDay} min)`);
t.ok(maxCombined <= 165,
  `combined main+raylib load stays medium on every steady-state day (worst ${maxCombined} min)`);
// unique dates (the effort/digest views key off date)
const dates = rm.days.map(d => d.date);
t.eq(new Set(dates).size, dates.length, "raylib day dates are unique (no self-collisions)");
// cadence: 2-3 side-days per week, never more
const perWeek = {};
for (const d of rm.days) perWeek[d.week] = (perWeek[d.week] || 0) + 1;
t.ok(Object.values(perWeek).every(n => n >= 1 && n <= 3),
  "every week holds 1–3 side-days (the 2–3/week cadence, gentle first week)");

t.done();
