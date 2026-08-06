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

t.done();
