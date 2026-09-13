// subtasks.test.mjs — the sub-task ("parent task → leaves") model at the ENGINE
// level. A task with a `sub:[]` list has NO state of its own: its completion,
// progress %, counted units, minutes, milestone credit, effort log and prune
// behaviour all roll up from the leaves. A task without a sub-list is its own
// single leaf (the other three roadmaps rely on that unchanged path). These
// checks drive real store state against the real raylib content.
import { suite } from "./_harness.mjs";
import { registry, store, stats, activity, reconcile, loadRoadmap } from "./_load.mjs";

const t = suite("subtasks");
await loadRoadmap("raylib.js");
const rm = registry.getRoadmap("raylib");
const slug = "raylib";

const parent = rm.tasksById.get("d01.t1");      // a 3-part parent (watch + 2 build steps)
const [s1, s2, s3] = parent.subs.map(s => s.id);
// Minute assertions below are DERIVED from the content, not hardcoded: this suite
// proves the leaf-level effort MECHANISM, so a re-estimate of the material must
// not drag it red. (content.test holds the deliberately literal tripwires.)
const [e1, e2] = parent.subs.map(s => s.est);
const clear = (...ids) => ids.forEach(id => store.setTask(slug, id, false));

t.group("taskProgress — derived and tri-state (parents hold no state)");
let p = stats.taskProgress(slug, parent);
t.deep([p.done, p.total, p.complete, p.partial], [0, 3, false, false], "no leaves done → empty, not partial");
store.setTask(slug, s1, true);
p = stats.taskProgress(slug, parent);
t.ok(p.done === 1 && p.partial && !p.complete, "one leaf done → partial");
t.eq(p.pct, 33, "partial pct = done/total");
store.setTask(slug, s2, true); store.setTask(slug, s3, true);
p = stats.taskProgress(slug, parent);
t.ok(p.done === 3 && p.complete && !p.partial, "every leaf done → complete");
t.ok(stats.taskComplete(slug, parent), "taskComplete() true only when all leaves done");
store.setTask(slug, s3, false);
t.ok(!stats.taskComplete(slug, parent), "clearing a single leaf un-completes the parent");
clear(s1, s2, s3);

t.group("stats count LEAVES, not parents (the owner's 100·2/4 rule)");
const primaryLeaves = rm.leaves.filter(l => {
  const par = l.isSub ? rm.tasksById.get(l.parent) : l;
  if (par.optional) return false;
  const o = rm.objById.get(par.obj);
  return !o || o.tier !== "secondary";
});
const S0 = stats.computeAll(rm);
t.eq(S0.overall.actual.total, primaryLeaves.length, "denominator = number of primary required leaves");
t.eq(S0.overall.actual.done, 0, "nothing done yet");
store.setTask(slug, s1, true);
const S1 = stats.computeAll(rm);
t.eq(S1.overall.actual.done, 1, "ticking ONE sub-task advances by one leaf (not a whole task)");
t.eq(S1.invested, e1, `invested minutes = that leaf's own est (${e1})`);
t.eq(S1.days["d01"].actual.total, 3, "day d01's ring counts its 3 leaves");
t.eq(S1.days["d01"].actual.done, 1, "day d01 reads 1 of 3 done");
clear(s1);

t.group("milestones need the WHOLE parent complete, not one part");
const w5 = () => stats.computeAll(rm).milestones.find(x => x.id === "w5.m1");
store.setTask(slug, s1, true); store.setTask(slug, s2, true);   // d01.t1 partial (2/3)
t.eq(w5().progress, 0, "a partially-done required task does NOT count toward its milestone");
store.setTask(slug, s3, true);                                   // d01.t1 complete
t.eq(w5().progress, 1, "completing every sub of a required task advances the milestone by one");
clear(s1, s2, s3);

t.group("effort log records each completed leaf on the day it was ticked");
store.setTask(slug, s1, true);
store.setCell(slug, `done_at:${s1}`, "meta", new Date(2026, 6, 20, 12, 0, 0).toISOString());
store.setTask(slug, s2, true);
store.setCell(slug, `done_at:${s2}`, "meta", new Date(2026, 6, 20, 12, 0, 0).toISOString());
const e = activity.dayEffort("2026-07-20", activity.activityByDate("side"));
t.eq(e.tasks, 2, "two completed sub-tasks = two units of effort");
t.eq(e.mins, e1 + e2, `their minutes sum (${e1} + ${e2})`);
clear(s1, s2);

t.group("reconcile prunes orphan sub-task rows, keeps real ones");
store.setTask(slug, s1, true);                       // a real leaf tick
store.setCell(slug, "d01.t1.s9", "task", "true");    // an orphan (no such leaf/parent)
const r = reconcile.reconcile(rm);
t.ok(r.pruned >= 1, "the orphan sub-task row is pruned");
t.ok(store.isDone(slug, s1), "a valid sub-task tick survives reconcile");
t.ok(!store.getCell(slug, "d01.t1.s9"), "the orphan row is gone");
t.ok(reconcile.referentOf("d01.t1.s1").id === "d01.t1.s1" &&
     reconcile.referentOf("done_at:d01.t1.s1").id === "d01.t1.s1",
  "referentOf round-trips a leaf's bare + done_at ids");
clear(s1);

t.group("moving a parent relocates ALL its leaves together (move is parent-level)");
// raylib d01.t1 has 3 leaves and d01 holds only that task; d03.t1 has 2 leaves.
const before = stats.computeAll(rm);
store.setMove(slug, "d01.t1", "d03");
const after = stats.computeAll(rm);
t.eq(after.days["d03"].actual.total - before.days["d03"].actual.total, 3,
  "the moved parent's 3 leaves all land on the destination day (actual)");
t.eq(before.days["d01"].actual.total - after.days["d01"].actual.total, 3,
  "and all leave the origin day (actual)");
t.eq(after.days["d01"].original.total, before.days["d01"].original.total,
  "ORIGINAL still counts the leaves on their origin day (a move doesn't rewrite history)");
store.setMove(slug, "d01.t1", null);   // restore

t.group("subless tasks stay their own single leaf (the unchanged path)");
// register a throwaway roadmap with a plain task and an empty sub-list
registry.registerRoadmap({ slug: "edge-solo", title: "x", objectives: [{ id: "o" }],
  weeks: [{ id: "w1", start: "2026-01-01" }],
  days: [{ id: "d01", date: "2026-01-01", week: "w1", tasks: [
    { id: "t1", obj: "o", est: 10, label: "plain task" },
    { id: "t2", obj: "o", est: 10, label: "empty sub-list", sub: [] },
  ] }] });
const eg = registry.getRoadmap("edge-solo");
const plain = eg.tasksById.get("d01.t1"), emptied = eg.tasksById.get("d01.t2");
t.ok(!plain.subs, "a plain task has no subs");
t.ok(!emptied.subs, "a task with an empty sub:[] is treated as subless (not an error)");
t.ok(eg.leavesById.has("d01.t1") && eg.leavesById.has("d01.t2"), "each subless task is its own leaf");
t.deep(registry.validateAll().filter(p => p.includes("edge-solo")), [], "subless / empty-sub tasks raise no validation error");
let sp = stats.taskProgress("edge-solo", plain);
t.deep([sp.done, sp.total, sp.complete], [0, 1, false], "subless taskProgress starts 0/1, not complete");
store.setTask("edge-solo", "d01.t1", true);
sp = stats.taskProgress("edge-solo", plain);
t.ok(sp.complete && sp.done === 1, "ticking a subless task completes it via its own state");
store.setTask("edge-solo", "d01.t1", false);

t.group("bad paths — the registry rejects malformed sub-tasks");
// an OPTIONAL task must not carry subs (the bonus track can't expand them)
registry.registerRoadmap({ slug: "bad-optsub", title: "x", objectives: [{ id: "o" }],
  weeks: [{ id: "w1", start: "2026-01-01" }],
  days: [{ id: "d01", date: "2026-01-01", week: "w1", tasks: [
    { id: "t1", obj: "o", est: 10, optional: true, label: "bonus",
      sub: [{ id: "s1", est: 5, label: "a" }, { id: "s2", est: 5, label: "b" }] },
  ] }] });
t.ok(registry.validateAll().some(p => p.includes("bad-optsub") && /must not have sub-tasks/.test(p)),
  "an optional task carrying sub-tasks is flagged by validateAll");
// duplicate sub-task ids are caught
registry.registerRoadmap({ slug: "bad-dupsub", title: "x", objectives: [{ id: "o" }],
  weeks: [{ id: "w1", start: "2026-01-01" }],
  days: [{ id: "d01", date: "2026-01-01", week: "w1", tasks: [
    { id: "t1", obj: "o", est: 10, label: "p",
      sub: [{ id: "s1", est: 5, label: "a" }, { id: "s1", est: 5, label: "dup" }] },
  ] }] });
t.ok(registry.validateAll().some(p => p.includes("bad-dupsub") && /duplicate sub-task/.test(p)),
  "duplicate sub-task ids are flagged by validateAll");

t.group("Extra-Info — the optional deeper-explanation field on tasks & leaves");
// A sub carrying `info` is normalized onto the leaf as an HTML string; one without
// it stays null. The renderer keys the ⓘ affordance off exactly this field.
registry.registerRoadmap({ slug: "info-fix", title: "x", objectives: [{ id: "o" }],
  weeks: [{ id: "w1", start: "2026-01-01" }],
  days: [{ id: "d01", date: "2026-01-01", week: "w1", tasks: [
    { id: "t1", obj: "o", est: 10, label: "parent", info: "<p>parent-level explainer</p>",
      sub: [{ id: "s1", est: 5, label: "with", info: "<p>deeper <b>why</b></p>" },
            { id: "s2", est: 5, label: "without" }] },
  ] }] });
const irm = registry.getRoadmap("info-fix");
t.eq(irm.tasksById.get("d01.t1").info, "<p>parent-level explainer</p>", "task-level info is carried through");
t.eq(irm.leavesById.get("d01.t1.s1").info, "<p>deeper <b>why</b></p>", "sub with info keeps it as an HTML string");
t.eq(irm.leavesById.get("d01.t1.s2").info, null, "sub without info stays null (no ⓘ rendered)");
t.ok(registry.validateAll().every(p => !p.includes("info-fix")), "an info field never trips validation");
// hygiene across the real roadmaps: any info present is a non-empty string
let infoCount = 0, infoBad = 0;
for (const r of registry.getRoadmaps())
  for (const d of r.days) for (const t2 of d.tasks)
    for (const leaf of [t2, ...(t2.subs || [])]) {
      if (leaf.info == null) continue;
      infoCount++;
      if (typeof leaf.info !== "string" || !leaf.info.trim()) infoBad++;
    }
t.eq(infoBad, 0, `every authored info field is a non-empty string (${infoCount} present)`);

t.done();
