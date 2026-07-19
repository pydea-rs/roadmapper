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

const parent = rm.tasksById.get("d01.t1");      // a 3-part parent (12 + 18 + 15 = 45)
const [s1, s2, s3] = parent.subs.map(s => s.id);
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
t.eq(S1.invested, 12, "invested minutes = that leaf's own est (12)");
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
t.eq(e.mins, 30, "their minutes sum (12 + 18)");
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

t.done();
