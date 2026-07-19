// reconcile.test.mjs — load-time reconciliation (reconcile.js): map each stored
// row to the content element it depends on, prune orphans whose task/soft no
// longer exists, migrate renamed ids via aliases, and never touch user notes.
import { suite } from "./_harness.mjs";
import { store, reconcile, registry } from "./_load.mjs";

const t = suite("reconcile");
const { referentOf } = reconcile;

t.group("referentOf — every stored id shape maps to the right referent");
t.eq(referentOf("note:d03"), null, "notes are never pruned (null referent)");
t.deep(referentOf("soft:d03.s1"), { kind: "soft", id: "d03.s1" }, "soft → its soft item");
t.deep(referentOf("move:d03.t2"), { kind: "task", id: "d03.t2" }, "move → its task");
t.deep(referentOf("done_at:d03.t2"), { kind: "task", id: "d03.t2" }, "done_at stamp → its task");
t.deep(referentOf("flag:missed:d03.t2"), { kind: "task", id: "d03.t2" }, "flag → its task (flag name stripped)");
t.deep(referentOf("d03.t2"), { kind: "task", id: "d03.t2" }, "bare tick → its task");
t.eq(referentOf("view:settings"), null, "unknown/settings keys are kept (null)");
t.eq(referentOf("seen:il3"), null, "interlude 'seen' ticks are kept (null referent — no content to prune against)");

// build a small registered roadmap to reconcile against
registry.registerRoadmap({
  slug: "rc", title: "Reconcile RM",
  objectives: [{ id: "o", title: "O" }],
  aliases: { "d01.told": "d01.tnew" },
  days: [{ id: "d01", date: "2026-07-13", tasks: [
    { id: "tnew", obj: "o", est: 20, label: "renamed target" },
    { id: "t2", obj: "o", est: 30, label: "still here" },
  ], soft: [{ id: "s1", type: "tryout", label: "soft" }] }],
});
const rm = registry.getRoadmap("rc");
const S = "rc";

t.group("aliases migrate a renamed task's rows onto the new id");
store.resetAll();
store.setCell(S, "d01.told", "task", "true");           // old id tick
store.setCell(S, "done_at:d01.told", "meta", new Date(2026, 6, 13, 12).toISOString());
const r1 = reconcile.reconcile(rm);
t.ok(r1.aliased >= 1, "at least one row aliased");
t.eq(store.isDone(S, "d01.tnew"), true, "tick moved to the new id");
t.eq(store.isDone(S, "d01.told"), false, "old id row removed");
t.ok(store.doneAt(S, "d01.tnew") !== null, "done_at moved to the new id too");

t.group("orphan rows (referent gone) are pruned; live rows and notes are kept");
store.resetAll();
store.setCell(S, "d01.t2", "task", "true");             // live task → keep
store.setCell(S, "d99.tX", "task", "true");             // no such task → prune
store.setCell(S, "done_at:d99.tX", "meta", "2026-07-13T12:00:00Z");  // orphan stamp → prune
store.setCell(S, "soft:d01.sZ", "soft", "true");        // no such soft → prune
store.setNote(S, "d01", "keep my note");                // note → never pruned
store.setSeen(S, "il9", true);                          // interlude seen → never pruned
const r2 = reconcile.reconcile(rm);
t.ok(r2.pruned >= 3, `pruned the orphan rows (got ${r2.pruned})`);
t.eq(store.isDone(S, "d01.t2"), true, "live tick kept");
t.eq(store.isDone(S, "d99.tX"), false, "orphan tick pruned");
t.eq(store.getCell(S, "done_at:d99.tX"), null, "orphan done_at pruned");
t.eq(store.getCell(S, "soft:d01.sZ"), null, "orphan soft pruned");
t.eq(store.getNote(S, "d01"), "keep my note", "user note survives reconciliation");
t.eq(store.isSeen(S, "il9"), true, "an interlude 'seen' tick survives reconciliation (never pruned)");

t.group("reconcile is idempotent — a second pass changes nothing");
const r3 = reconcile.reconcile(rm);
t.eq(r3.pruned, 0, "no further prunes");
t.eq(r3.aliased, 0, "no further aliases");

t.done();
