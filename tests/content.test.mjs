// content.test.mjs — structural integrity of the REAL roadmaps. This is the net
// under the date-shifting / date-extending work: progress is keyed by structural
// ids (never by date), so these checks confirm the content itself stays ordered,
// unique, and internally consistent after any re-dating.
import { readFileSync } from "node:fs";
import { suite } from "./_harness.mjs";
import { registry, util, reconcile, loadRoadmap } from "./_load.mjs";

const t = suite("content");
await loadRoadmap("rust-fastapi.js");
await loadRoadmap("interp-go.js");
await loadRoadmap("bedrock.js");            // the side-track roadmap
const roadmaps = registry.getRoadmaps();

t.group("registry loads cleanly");
t.ok(roadmaps.length >= 3, `all real roadmaps registered (${roadmaps.length})`);
t.deep(registry.registryErrors(), [], "no registry errors");
t.deep(registry.validateAll(), [], "validateAll() reports no problems");

t.group("side track wiring");
const bedrock = registry.getRoadmap("bedrock");
t.eq(bedrock.kind, "side", "bedrock is registered on the side track");
t.deep(registry.getSideRoadmaps().map(r => r.slug), ["bedrock"], "getSideRoadmaps() sees bedrock only");
t.ok(registry.getMainRoadmaps().every(r => r.kind !== "side"), "main roadmaps exclude the side track");
// every task's objective is one of the domain threads (no orphan objective)
t.ok(bedrock.days.every(d => d.tasks.every(x => bedrock.objById.has(x.obj))),
  "every bedrock task maps to a domain objective");

// core + two extensions continue the SAME roadmap: Extension I (weeks 13–25)
// adds the Distributed-systems thread; Extension II (weeks 26–29) adds the
// Data-structure & runtime internals thread. Nothing here should re-date the core.
t.ok(bedrock.days.length >= 88, "bedrock has core + both extensions (>= 88 days)");
t.ok(bedrock.objById.has("dist"), "Extension I adds a Distributed-systems objective");
t.ok(bedrock.objById.has("internals"), "Extension II adds a Data-structure & runtime internals objective");
t.ok(bedrock.weeksById.has("w29"), "Extension II reaches week 29");
t.ok(bedrock.days.some(d => d.date >= "2026-10-12"), "Extension I days are dated after the core");
t.ok(bedrock.days.some(d => d.date >= "2027-01-11"), "Extension II days are dated after Extension I");
t.ok(bedrock.days.flatMap(d => d.tasks).filter(x => x.obj === "internals").length >= 6,
  "the internals thread has its full run of tasks");

// no two side-days may share a calendar date (the digest/effort views key off date)
const bDates = bedrock.days.map(d => d.date);
t.eq(new Set(bDates).size, bDates.length, "bedrock day dates are unique (no collisions)");

// threads stay INTERLEAVED: consecutive days switch topics, save the one
// deliberate security capstone pair (d37 → d38). Guards the core design rule.
let sameThread = 0;
for (let i = 1; i < bedrock.days.length; i++) {
  const a = bedrock.days[i - 1].tasks[0]?.obj, b = bedrock.days[i].tasks[0]?.obj;
  if (a && a === b) sameThread++;
}
t.ok(sameThread <= 1, `threads interleave — at most the one capstone pair repeats (found ${sameThread})`);

// recall cards: EVERY task carries >= 2 well-formed {q, a} cards (the whole point
// of the recall feature is that no completed task is left without prompts).
const allBedrockTasks = bedrock.days.flatMap(d => d.tasks);
t.ok(allBedrockTasks.every(x => x.cards && x.cards.length >= 2),
  "every bedrock task carries >= 2 recall cards");
t.ok(allBedrockTasks.every(x => x.cards.every(c => c.q && c.a)),
  "every recall card has both a question and an answer");

// milestone task references still resolve (incl. both extensions' milestones)
t.ok(bedrock.milestones.every(m => (m.rule.require || []).every(id => bedrock.tasksById.has(id))),
  "every milestone (core + both extensions) references a real task");

for (const rm of roadmaps) {
  t.group(`${rm.slug} — structure`);

  // days in chronological, non-decreasing date order
  let ordered = true;
  for (let i = 1; i < rm.days.length; i++) if (rm.days[i].date < rm.days[i - 1].date) ordered = false;
  t.ok(ordered, "days are in non-decreasing date order");

  // unique day ids and unique task ids
  const dayIds = rm.days.map(d => d.id);
  t.eq(new Set(dayIds).size, dayIds.length, "day ids are unique");
  const taskIds = rm.days.flatMap(d => d.tasks.map(x => x.id));
  t.eq(new Set(taskIds).size, taskIds.length, "task ids are unique across the roadmap");

  // every task id is namespaced under its day (dNN.xxx) and resolvable
  t.ok(rm.days.every(d => d.tasks.every(x => x.id.startsWith(d.id + "."))),
    "task ids are namespaced under their day");
  t.ok(taskIds.every(id => rm.tasksById.has(id)), "every task resolves in tasksById");

  // each day's date lies within its week's [start, start+6] window
  let dayInWeek = true, weekMissing = false;
  for (const d of rm.days) {
    const w = rm.weeksById.get(d.week);
    if (!w || !w.start) { weekMissing = true; continue; }
    if (d.date < w.start || d.date > util.addDays(w.start, 6)) dayInWeek = false;
  }
  t.ok(!weekMissing, "every day belongs to a week that has a start date");
  t.ok(dayInWeek, "every day's date falls within its week's 7-day window");

  // day.dow matches the actual weekday of day.date
  t.ok(rm.days.every(d => d.dow === util.DOW[util.parseDate(d.date).getDay()]),
    "each day's day-of-week label matches its date");

  // every est is a finite, non-negative number
  t.ok(rm.days.every(d => d.tasks.every(x => Number.isFinite(x.est) && x.est >= 0)),
    "all task estimates are finite and non-negative");

  // every task references a real objective
  t.ok(rm.days.every(d => d.tasks.every(x => rm.objById.has(x.obj))),
    "every task references an existing objective");

  // milestone task references resolve
  let msRefsOk = true;
  for (const m of rm.milestones) {
    const r = m.rule || {};
    for (const id of (r.require || [])) if (!rm.tasksById.has(id)) msRefsOk = false;
    for (const id of (r.from || [])) if (!rm.tasksById.has(id)) msRefsOk = false;
    if (m.week && !rm.weeksById.has(m.week)) msRefsOk = false;
  }
  t.ok(msRefsOk, "all milestone task/week references resolve");

  // reconcile.referentOf round-trips every real task id shape back to that task
  t.ok(taskIds.every(id => {
    const bare = reconcile.referentOf(id);
    const move = reconcile.referentOf("move:" + id);
    const stamp = reconcile.referentOf("done_at:" + id);
    return bare && bare.id === id && move && move.id === id && stamp && stamp.id === id;
  }), "referentOf round-trips bare / move / done_at ids for every task");
}

t.group("client store SEP matches server KEY_SEP (\\x01)");
const storeSrc = readFileSync(new URL("../public/assets/js/store.js", import.meta.url), "utf8");
const apiSrc = readFileSync(new URL("../roadmapper/api.php", import.meta.url), "utf8");
t.ok(/const SEP\s*=\s*"\\x01"/.test(storeSrc), "store.js SEP = \\x01");
t.ok(/KEY_SEP\s*=\s*"\\x01"/.test(apiSrc), "api.php KEY_SEP = \\x01");

t.done();
