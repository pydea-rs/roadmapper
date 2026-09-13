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

t.group("aliases cascade to sub-task leaves — a renamed SUBBED task keeps its ticks");
// a task WITH sub-tasks stores its progress on the LEAVES (tp.s1, done_at:tp.s1),
// so the alias must carry those descendants too — else the prune step would wipe
// them as orphans of the now-gone old parent id.
registry.registerRoadmap({
  slug: "rc2", title: "Reconcile subs",
  objectives: [{ id: "o", title: "O" }],
  aliases: { "d01.tp": "d01.tpnew" },
  days: [{ id: "d01", date: "2026-07-13", tasks: [
    { id: "tpnew", obj: "o", label: "renamed parent", sub: [
      { id: "s1", est: 10, label: "leaf one" },
      { id: "s2", est: 15, label: "leaf two" },
    ] },
  ], soft: [] }],
});
const rm2 = registry.getRoadmap("rc2");
store.resetAll();
store.setCell("rc2", "d01.tp.s1", "task", "true");        // old leaf ticks + stamp
store.setCell("rc2", "done_at:d01.tp.s1", "meta", new Date(2026, 6, 13, 12).toISOString());
store.setCell("rc2", "d01.tp.s2", "task", "true");
const ra = reconcile.reconcile(rm2);
t.ok(ra.aliased >= 3, `sub-leaf ticks + stamp all aliased (got ${ra.aliased})`);
t.eq(ra.pruned, 0, "nothing pruned — the ticks migrated instead of orphaning");
t.eq(store.isDone("rc2", "d01.tpnew.s1"), true, "leaf s1 tick moved to the new parent id");
t.eq(store.isDone("rc2", "d01.tpnew.s2"), true, "leaf s2 tick moved to the new parent id");
t.ok(store.doneAt("rc2", "d01.tpnew.s1") !== null, "leaf s1 done_at moved too");
t.eq(store.isDone("rc2", "d01.tp.s1"), false, "old leaf id cleared");

t.group("pruning is IN-MEMORY ONLY — the database is never told to delete an orphan");
// A client can run content OLDER than the data (a cached service worker, a tab left
// open across a deploy): rows it doesn't recognise may belong to newer content, so
// deleting them server-side would destroy real progress.
{
  const sent = [];
  store.setSink((slug, change) => sent.push({ slug, ...change }));
  store.resetAll();
  store.setCell(S, "d01.t2", "task", "true", { silent: true });
  store.setCell(S, "d77.t1", "task", "true", { silent: true });          // "newer content" row
  store.setCell(S, "done_at:d77.t1", "meta", "2026-07-13T12:00:00Z", { silent: true });
  const r = reconcile.reconcile(rm);
  t.eq(r.pruned, 2, "the unknown rows are hidden from this session's counts");
  t.eq(store.isDone(S, "d77.t1"), false, "…so stats never see them");
  t.deep(sent, [], "…but NOTHING is sent to the database (no delete for rows this client doesn't know)");
  // aliases are deliberate renames, authored with the content — they DO persist
  store.resetAll();
  sent.length = 0;
  store.setCell(S, "d01.told", "task", "true", { silent: true });
  reconcile.reconcile(rm);
  t.ok(sent.some(c => c.id === "d01.tnew" && c.value === "true") && sent.some(c => c.id === "d01.told" && c.value === null),
    "an alias migration is written through (it is authored intent, not a guess)");
  store.setSink(null);
}

t.group("a move whose destination day no longer exists is ignored");
store.resetAll();
store.setCell(S, "move:d01.t2", "move", "d42", { silent: true });        // d42 isn't in this content
store.setCell(S, "d01.t2", "task", "true", { silent: true });
const rmv = reconcile.reconcile(rm);
t.ok(rmv.pruned >= 1, "the dangling move row is pruned (in memory)");
t.eq(store.getMove(S, "d01.t2"), null, "…so the task sits on its origin and can be moved normally again");
t.eq(store.isDone(S, "d01.t2"), true, "the task's own tick is untouched");
store.setCell(S, "move:d01.t2", "move", "d01", { silent: true });        // a destination that exists
t.eq(reconcile.reconcile(rm).pruned, 0, "a move to an existing day is kept");

t.done();
