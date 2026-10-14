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
const firstTaskObj = d => (d.tasks.find(x => !x.carried) || {}).obj;   // carried-in work never sets the topic
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
// ⚠️ SHIFT-SENSITIVE: bump with every uniform date shift (like content.test's ANCHORS).
t.ok(rm.days[0].date === "2026-10-25", "the journey starts on 2026-10-25, its first day in week 1");

t.group("recall cards — every task carries >= 2 well-formed {q,a}");
// A task the planner split across cards is suffixed "(k/n)"; the recall deck quizzes
// the whole item, so it rides with the final part and the earlier parts carry none.
const nonFinalPart = x => { const m = /\((\d+)\/(\d+)\)\s*$/.exec(x.lead || x.label || ""); return !!m && +m[1] < +m[2]; };
t.ok(allTasks.filter(x => !x.optional).every(x => nonFinalPart(x) || (x.cards && x.cards.length >= 2)),
  "every non-optional task has >= 2 recall cards (a split task's deck rides with its last part)");
t.ok(allTasks.every(x => !x.cards || x.cards.every(c => c.q && c.a)),
  "every recall card has both a question and an answer");

t.group("sub-tasks — every task is broken into individually-tickable parts");
const required = allTasks.filter(x => !x.optional);
t.ok(required.every(x => x.subs && x.subs.length >= 1),
  "every required task is broken into individually-tickable leaves (no all-at-once tasks)");
// A card holding a single leaf is always a PART of a task the planner split across
// cards — a whole task is never one undivided lump.
t.ok(required.every(x => x.subs.length >= 2 || /\(\d+\/\d+\)\s*$/.test(x.label || x.lead || "")),
  "a one-leaf task is always a split part, never a whole task left undivided");
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
// Bounds are by WEEK NUMBER (of 19), not calendar dates, so a uniform date shift never
// needs to touch them; each keeps the same strictness the old date bounds had.
const NW = rm.weeks.length;
const weekNo = x => rm.weeksById.get(rm.daysById.get(x.day).week).index + 1;
const weeksOf = obj => allTasks.filter(x => x.obj === obj).map(weekNo);
// thread bounds are expressed as FRACTIONS of the calendar: the planner re-flows
// raylib on every re-plan, so a literal week number goes stale while the shape holds
t.ok(Math.max(...weeksOf("course")) <= NW * 2 / 3,
  `the course thread finishes inside the first two thirds (w${Math.max(...weeksOf("course"))} of ${NW})`);
// the Big Bang PROJECT only begins in the second half, after the course is underway
t.ok(Math.min(...weeksOf("project")) >= 8,
  "the simulation project starts no earlier than week 8 (after the course, once physics exists)");
// SHADERS (Book of Shaders) start only once Nature of Code is ~70-80% read — late
t.ok(Math.min(...weeksOf("shaders")) >= NW * 2 / 3,
  `shaders begin only in the final third (w${Math.min(...weeksOf("shaders"))} of ${NW}, after Nature of Code is ~70-80% done)`);
// physics (noc) spans the whole journey (it's the through-line)
t.ok(Math.min(...weeksOf("noc")) <= 2 && Math.max(...weeksOf("noc")) >= NW * 0.9,
  `the Nature-of-Code physics thread runs as the through-line (w${Math.min(...weeksOf("noc"))} → w${Math.max(...weeksOf("noc"))} of ${NW})`);

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
t.ok(rm.milestones.some(m => /Half the raylib basics/i.test(m.title)),
  "the 'half the raylib basics' checkpoint is still on the board");
t.ok(rm.milestones.at(-1).week === `w${NW}`,
  `the capstone milestone lands at the final week (${NW})`);

t.group("scheduling — never piles onto a heavy day");
// The old "lands on LIGHT main days" framing pinned the mains to fixed weekdays so the
// side track could dodge them. Since the 2026-09-13 re-plan no roadmap has fixed
// weekdays, so the promise is stated directly on the whole day: any date raylib
// shares stays inside the owner's 3h daily ceiling (the 3-hour cap re-plan).
const combined = new Map();
for (const r of registry.getRoadmaps())
  for (const d of r.days) {
    const est = d.tasks.reduce((s, x) => s + (x.optional ? 0 : x.est || 0), 0);
    combined.set(d.date, (combined.get(d.date) || 0) + est);
  }
const worstShared = Math.max(...rm.days.map(d => combined.get(d.date)));
t.ok(worstShared <= 180, `every raylib date stays within the 3h combined ceiling (worst ${worstShared} min)`);
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
t.ok(counts.filter(n => n === 2).length >= counts.length - 2,
  `the steady 2/week cadence holds for all but at most two weeks (${counts.filter(n => n === 2).length}/${counts.length} at 2)`);

t.done();
