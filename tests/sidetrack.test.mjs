// sidetrack.test.mjs — the "Side track" split: a roadmap's `kind` must keep its
// progress and effort out of the main track's numbers, while still being visible
// on its own and combinable. Covers registry accessors + activity.js track
// filtering. (The DOM side of the split is covered in render.test.mjs.)
import { suite } from "./_harness.mjs";
import { registry, store, activity, loadFixture, loadFixtureSide, doneOn } from "./_load.mjs";

const t = suite("sidetrack");

const main = await loadFixture();        // slug "fixture", kind main (default)
const side = await loadFixtureSide();    // slug "fixture-side", kind "side"

t.group("registry: kind + track accessors");
t.eq(main.kind, "main", "a roadmap with no kind defaults to main");
t.eq(side.kind, "side", "kind:\"side\" is preserved");
const all = registry.getRoadmaps().map(r => r.slug);
t.ok(all.includes("fixture") && all.includes("fixture-side"), "getRoadmaps() returns both tracks");
t.deep(registry.getMainRoadmaps().map(r => r.slug).filter(s => s.startsWith("fixture")), ["fixture"],
  "getMainRoadmaps() excludes the side roadmap");
t.deep(registry.getSideRoadmaps().map(r => r.slug), ["fixture-side"],
  "getSideRoadmaps() returns only the side roadmap");
t.deep(registry.getRoadmaps("side").map(r => r.slug), ["fixture-side"], "getRoadmaps(\"side\") filters by kind");
t.eq(registry.getRoadmaps("main").every(r => r.kind === "main"), true, "getRoadmaps(\"main\") is all main");

t.group("activity: effort is split by track");
// Same calendar day, one task on each track.
doneOn("fixture", "d01.t1", 2026, 7, 13);        // main, est 30
doneOn("fixture-side", "d01.t1", 2026, 7, 13);   // side, est 50

const mainDay = activity.dayEffort("2026-07-13", activity.activityByDate("main"));
const sideDay = activity.dayEffort("2026-07-13", activity.activityByDate("side"));
const allDay  = activity.dayEffort("2026-07-13", activity.activityByDate());

t.eq(mainDay.mins, 30, "main map counts only the main task's minutes");
t.eq(mainDay.tasks, 1, "main map counts only the main task");
t.eq(sideDay.mins, 50, "side map counts only the side task's minutes");
t.eq(sideDay.tasks, 1, "side map counts only the side task");
t.eq(allDay.mins, 80, "no-kind map is the combined Main+Side total (30+50)");
t.eq(allDay.tasks, 2, "combined map counts both tasks");

t.group("activity: side bonus stays on the side track");
doneOn("fixture-side", "d02.b1", 2026, 7, 15);   // side bonus, est 20
const sideBonusDay = activity.dayEffort("2026-07-15", activity.activityByDate("side"));
t.eq(sideBonusDay.bonusTasks, 1, "side bonus counted on the side map");
t.eq(sideBonusDay.bonusMins, 20, "side bonus minutes on the side map");
t.eq(activity.dayEffort("2026-07-15", activity.activityByDate("main")).tasks, 0,
  "the side bonus never appears in the main map");

t.group("tasksDoneOn respects the track filter");
const mainRows = activity.tasksDoneOn("2026-07-13", "main");
const sideRows = activity.tasksDoneOn("2026-07-13", "side");
const bothRows = activity.tasksDoneOn("2026-07-13");
t.eq(mainRows.length, 1, "tasksDoneOn(main) returns only the main completion");
t.eq(mainRows.every(r => r.rm.kind === "main"), true, "…all from main roadmaps");
t.eq(sideRows.length, 1, "tasksDoneOn(side) returns only the side completion");
t.eq(sideRows.every(r => r.rm.kind === "side"), true, "…all from side roadmaps");
t.eq(bothRows.length, 2, "tasksDoneOn() with no kind returns both");

t.group("series/trailingAvg are track-scoped through the map");
const sMain = activity.series("2026-07-13", 14, activity.activityByDate("main"));
const sSide = activity.series("2026-07-13", 14, activity.activityByDate("side"));
t.eq(sMain.length, 14, "main series still spans 14 days");
t.eq(sMain[sMain.length - 1].mins, 30, "main series ends on the main day total");
t.eq(sSide[sSide.length - 1].mins, 50, "side series ends on the side day total");

t.done();
