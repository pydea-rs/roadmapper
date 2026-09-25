// registry.test.mjs — normalization + boot validator guards. Registers throwaway
// roadmaps (unique slugs) and inspects validateAll()/registryErrors(); no DOM.
import { suite } from "./_harness.mjs";
import { registry, loadRoadmap } from "./_load.mjs";

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
// today/insights/horizon/bookmarks address the global views in the router — a roadmap
// claiming one would be permanently unreachable.
for (const slug of ["today", "insights", "horizon", "bookmarks"]) {
  registerRoadmap(base({ slug }));
  t.ok(validateAll().some(p => new RegExp(`\\[${slug}\\].*reserved route`).test(p)), `a roadmap on the reserved route "${slug}" is flagged`);
}

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

t.group("carried-over tasks (the daily-cap re-plan) must come from a real, EARLIER day");
registerRoadmap({ slug: "carry", title: "T", objectives: OBJ, days: [
  { id: "d01", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "a" }], soft: [] },
  { id: "d02", date: "2026-09-02", tasks: [{ id: "t1", obj: "o1", label: "b", carried: "d01" },
    { id: "t2", obj: "o1", label: "c", carried: "d03" }, { id: "t3", obj: "o1", label: "d", carried: "d09" },
    { id: "t4", obj: "o1", label: "e", carried: "d02" }], soft: [] },
  { id: "d03", date: "2026-09-04", tasks: [{ id: "t1", obj: "o1", label: "f" }], soft: [] },
]});
const cr = registry.getRoadmap("carry");
t.eq(cr.tasksById.get("d02.t1").carried, "d01", "the registry keeps a task's `carried` origin");
t.eq(cr.tasksById.get("d01.t1").carried, null, "a task that wasn't carried reads null");
const p3 = validateAll().filter(x => x.startsWith("[carry]"));
t.ok(!p3.some(x => /"d02\.t1"/.test(x)), "carried from an earlier day is valid");
t.ok(p3.some(x => /"d02\.t2" is carried from "d03", which is not an earlier day/.test(x)), "carried from a LATER day is flagged");
t.ok(p3.some(x => /"d02\.t3" is carried from unknown day "d09"/.test(x)), "carried from a day that doesn't exist is flagged");
t.ok(p3.some(x => /"d02\.t4" is carried from "d02"/.test(x)), "carried from its own day is flagged");


t.group("source library — normalised, and validated for id/match/url");
registerRoadmap({ slug: "lib-ok", title: "T", objectives: OBJ,
  library: [
    { id: "ostep", title: "Operating Systems: Three Easy Pieces", by: "Arpaci-Dusseau",
      edition: "v1.10", kind: "book", free: true, url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
      get: "Free PDFs", match: ["OSTEP", "remzi"] },
    { id: "bare", match: "example.com" },
  ],
  days: [{ id: "d01", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "a" }], soft: [] }]});
const lb = registry.getRoadmap("lib-ok");
t.eq(lb.library.length, 2, "the library is carried onto the roadmap");
t.eq(lb.libraryById.get("ostep").edition, "v1.10", "an entry keeps its edition");
t.eq(lb.libraryById.get("ostep").free, true, "…and whether it is free");
t.deep(lb.libraryById.get("bare").match, ["example.com"], "a single match string is normalised to a list");
t.eq(lb.libraryById.get("bare").title, "bare", "a title-less entry falls back to its id");
t.eq(lb.libraryById.get("bare").kind, "book", "kind defaults to book");
t.eq(lb.libraryById.get("bare").free, false, "and free defaults to false (assume paid)");
t.deep(validateAll().filter(x => x.startsWith("[lib-ok]")), [], "a well-formed library raises nothing");

// an entry with NO match must end up matchable-by-nothing, not matchable-by-"undefined"
registerRoadmap({ slug: "lib-nomatch", title: "T", objectives: OBJ,
  library: [{ id: "x", title: "X" }],
  days: [{ id: "d01", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "undefined behaviour is fun" }], soft: [] }]});
t.deep(registry.getRoadmap("lib-nomatch").library[0].match, [],
  "a missing `match` stays empty — never the string \"undefined\"");
t.ok(validateAll().some(x => /\[lib-nomatch\].*has no match strings/.test(x)),
  "…and the validator catches it instead of letting it match everything");

registerRoadmap({ slug: "lib-bad", title: "T", objectives: OBJ,
  library: [
    { id: "dup", match: ["a"] },
    { id: "dup", match: ["b"] },
    { id: "nomatch", match: [] },
    { id: "badurl", match: ["c"], url: "ftp://nope/x" },
  ],
  days: [{ id: "d01", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "a" }], soft: [] }]});
const pl = validateAll().filter(x => x.startsWith("[lib-bad]"));
t.ok(pl.some(x => /duplicate library id "dup"/.test(x)), "a duplicate library id is flagged");
t.ok(pl.some(x => /library entry "nomatch" has no match strings/.test(x)), "an entry nothing can match is flagged");
t.ok(pl.some(x => /library entry "badurl" has a non-http url/.test(x)), "a non-http url is flagged");

// a roadmap that declares none keeps an empty library, and the reading list stays off
registerRoadmap({ slug: "lib-none", title: "T", objectives: OBJ,
  days: [{ id: "d01", date: "2026-09-01", tasks: [{ id: "t1", obj: "o1", label: "a" }], soft: [] }]});
t.deep(registry.getRoadmap("lib-none").library, [], "a roadmap with no library declares an empty one");

t.group("milestones come back in CALENDAR order, whatever order they were authored in");
// The milestone rail renders the array as-is and the slideshow opens on the first
// not-yet-met entry, so authored order is user-visible. A re-plan re-anchors
// milestones onto new weeks without reordering the array — that is how a "Week 9"
// milestone ends up displayed before "Week 8". Normalization sorts them.
registerRoadmap({ slug: "ms-order", title: "T", objectives: OBJ,
  days: [
    { id: "d01", date: "2026-09-01", week: "wA", tasks: [{ id: "t1", obj: "o1", label: "a" }], soft: [] },
    { id: "d02", date: "2026-09-08", week: "wB", tasks: [{ id: "t1", obj: "o1", label: "b" }], soft: [] },
    { id: "d03", date: "2026-09-15", week: "wC", tasks: [{ id: "t1", obj: "o1", label: "c" }], soft: [] },
  ],
  milestones: [
    { id: "mC", week: "wC", title: "third" },
    { id: "mA", week: "wA", title: "first" },
    { id: "mNo", title: "no week at all" },
    { id: "mB", week: "wB", title: "second" },
    { id: "mA2", week: "wA", title: "first, authored later" },
  ]});
const mo = registry.getRoadmap("ms-order");
t.deep(mo.milestones.map(m => m.id), ["mA", "mA2", "mB", "mC", "mNo"],
  "sorted by the week's chronological index; a week-less milestone sorts last");
t.deep(validateAll().filter(x => x.startsWith("[ms-order]")), [], "reordering raises no validation problem");
// stability: two milestones on the SAME week keep the order their author gave them
t.ok(mo.milestones.findIndex(m => m.id === "mA") < mo.milestones.findIndex(m => m.id === "mA2"),
  "same-week milestones keep their authored order (stable sort)");

t.group("the shipped roadmaps' milestones are in calendar order");
for (const file of ["rust-fastapi.js", "interp-go.js", "bedrock.js", "raylib.js"]) {
  await loadRoadmap(file);
  const rm = registry.getRoadmap(file.replace(".js", ""));
  const idx = m => (rm.weeksById.get(m.week) || {}).index ?? Infinity;
  const ms = rm.milestones;
  let ok = true;
  for (let i = 1; i < ms.length; i++) if (idx(ms[i]) < idx(ms[i - 1])) ok = false;
  t.ok(ok, `${rm.slug}: ${ms.length} milestones render in week order`);
}

t.done();
