// registry.test.mjs — normalization + boot validator guards. Registers throwaway
// roadmaps (unique slugs) and inspects validateAll()/registryErrors(); no DOM.
import { suite } from "./_harness.mjs";
import { registry } from "./_load.mjs";

const t = suite("registry");
const { registerRoadmap, validateAll } = registry;

// A minimal well-formed roadmap, then mutations that should trip a specific guard.
const OBJ = [{ id: "o1", title: "Obj" }];
const base = (over = {}) => ({
  slug: over.slug, title: "T", objectives: OBJ,
  days: over.days || [{ id: "d01", date: "2026-09-01",
    tasks: [{ id: "t1", obj: "o1", label: "x" }], soft: [] }],
});

t.group("reserved state-key prefixes are rejected on ids");
// bare task ticks share a flat KV namespace with prefixed families
// (move:/soft:/seen:/flag:/note:/done_at:/daydate:); an authored id starting with
// one would collide with that family's cell and confuse reconcile — forbid it.
registerRoadmap(base({ slug: "rsv-day",
  days: [{ id: "daydate:x", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "x" }], soft: [] }] }));
registerRoadmap(base({ slug: "rsv-task",
  days: [{ id: "d01", date: "2026-09-01", tasks: [{ id: "note:y", obj: "o1", label: "x" }], soft: [] }] }));
registerRoadmap(base({ slug: "rsv-soft",
  days: [{ id: "d01", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "x" }],
    soft: [{ id: "move:z", type: "tryout", label: "s" }] }] }));

const problems = validateAll();
const has = re => problems.some(p => re.test(p));
t.ok(has(/\[rsv-day\].*day id "daydate:x" uses a reserved state-key prefix/), "reserved day id flagged");
t.ok(has(/\[rsv-task\].*task id "d01\.note:y" uses a reserved state-key prefix/), "reserved task id flagged");
t.ok(has(/\[rsv-soft\].*soft id "d01\.move:z" uses a reserved state-key prefix/), "reserved soft id flagged");

t.group("a clean roadmap trips none of these guards");
registerRoadmap(base({ slug: "rsv-clean" }));
t.ok(!validateAll().some(p => /\[rsv-clean\]/.test(p)), "well-formed roadmap yields no problems");

t.group("reserved global-route slugs are rejected");
// today/insights/bookmarks address the global views in the router — a roadmap
// claiming one would be permanently unreachable.
registerRoadmap(base({ slug: "today" }));
t.ok(validateAll().some(p => /\[today\].*reserved route/.test(p)), "a roadmap on a reserved route slug is flagged");

t.group("a derived week starts from its EARLIEST day, not the first-authored one");
registerRoadmap({ slug: "wk-order", title: "T", objectives: OBJ, days: [
  { id: "d01", date: "2026-09-03", week: "w1", tasks: [{ id: "t1", obj: "o1", label: "x" }], soft: [] },
  { id: "d02", date: "2026-09-01", week: "w1", tasks: [{ id: "t1", obj: "o1", label: "y" }], soft: [] },
]});
const wk = registry.getRoadmap("wk-order").weeks.find(w => w.id === "w1");
t.eq(wk.start, "2026-09-01", "week.start = earliest day's date despite out-of-order authoring");

t.group("id SHAPES the state layer depends on are enforced");
// reconcile recognises a bare tick by "d<digits>.<task>"; a dot/colon inside a local
// id breaks the day.task.sub namespacing; a missing id would register as "d01.undefined"
registerRoadmap(base({ slug: "shape-day", days: [{ id: "rev1", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "x" }], soft: [] }] }));
registerRoadmap(base({ slug: "shape-task", days: [{ id: "d01", date: "2026-09-01", tasks: [{ obj: "o1", label: "no id" }, { id: "a.b", obj: "o1", label: "dot" }], soft: [] }] }));
registerRoadmap(base({ slug: "shape-sub", days: [{ id: "d01", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "x",
  sub: [{ id: "s:1", est: 5, label: "colon" }, { id: "s2", est: 5, label: "fine" }] }], soft: [] }] }));
const p2 = validateAll();
t.ok(p2.some(x => /\[shape-day\].*day id "rev1" must look like "d01"/.test(x)), "a day id that isn't d<digits> is flagged");
t.ok(p2.some(x => /\[shape-task\].*task id "d01\.undefined"/.test(x)), "a task with no id is flagged");
t.ok(p2.some(x => /\[shape-task\].*task id "d01\.a\.b"/.test(x)), "a dotted task id is flagged");
t.ok(p2.some(x => /\[shape-sub\].*sub-task id "d01\.t1\.s:1"/.test(x)), "a sub-task id with a colon is flagged");
t.ok(!p2.some(x => /\[shape-sub\].*s2/.test(x)), "a well-formed sibling is not");

t.group("cards sharing a date keep their authored order (a real, stable comparator)");
registerRoadmap({ slug: "same-date", title: "T", objectives: OBJ, days: [
  { id: "d01", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "a" }], soft: [] },
  { id: "d02", date: "2026-09-03", tasks: [{ id: "t1", obj: "o1", label: "b" }], soft: [] },
  { id: "d03", date: "2026-09-03", tasks: [{ id: "t1", obj: "o1", label: "c" }], soft: [] },
  { id: "d04", date: "2026-09-06", tasks: [{ id: "t1", obj: "o1", label: "d" }], soft: [] },
]});
const sd = registry.getRoadmap("same-date");
t.eq(sd.daysById.get("d01").nextDate, "2026-09-03", "d01's ceiling is the next date");
t.eq(sd.daysById.get("d02").nextDate, "2026-09-03", "d02 (first of the tie) sees its twin → no gap, deterministically");
t.eq(sd.daysById.get("d03").nextDate, "2026-09-06", "d03 (second of the tie) sees the real next date");
t.eq(sd.daysById.get("d04").nextDate, null, "the last card has no ceiling");

t.done();
