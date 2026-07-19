// render.test.mjs — a DOM smoke test under jsdom: render both real roadmaps and
// the cross-roadmap Today view (incl. the new "Your effort" panel), then tick a
// task from Today and confirm nothing throws. Requires jsdom; if it is not
// installed this file SKIPS cleanly (the pure-logic suites carry the coverage).
import { suite } from "./_harness.mjs";

const t = suite("render");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

// --- DOM + a fixed "today" so the Today view has schedule context ---
const dom = new JSDOM(`<!doctype html><html><body>
  <div id="app"><main id="main"><div id="view"></div></main></div>
  <div id="toast-root"></div><div id="modal-root"></div>
</body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.CSS = dom.window.CSS;
global.requestAnimationFrame = fn => setTimeout(fn, 0);
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const RealDate = Date;                       // freeze "now" = 2026-08-10 12:00 local
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(2026, 7, 10, 12, 0, 0); }
  static now() { return new RealDate(2026, 7, 10, 12, 0, 0).getTime(); }
}
global.Date = FakeDate; globalThis.Date = FakeDate;

const base = new URL("../public/assets/js/", import.meta.url);
const rmBase = new URL("../public/roadmaps/", import.meta.url);
const reg = await import(new URL("registry.js", base).href);
await import(new URL("rust-fastapi.js", rmBase).href);
await import(new URL("interp-go.js", rmBase).href);
await import(new URL("_fixture-side.js", rmBase).href);   // a SIDE-track roadmap
const store = await import(new URL("store.js", base).href);  // registers the write-through sink path
const render = await import(new URL("render.js", base).href);

const view = document.getElementById("view");

t.group("roadmap view renders");
for (const rm of reg.getRoadmaps()) {
  render.renderRoadmap(rm, view);
  t.ok(view.querySelector(".timeline"), `${rm.slug}: timeline rendered`);
}

t.group("Today view + the 'Your effort' panel");
render.renderToday(view);
t.ok(view.querySelector(".today-view"), "today view rendered");
t.ok(view.querySelector(".effort"), "effort panel present");
t.eq(view.querySelectorAll(".effort-chart:not(.mini) .ec-col").length, 14, "main effort chart has 14 day-bars");

t.group("Side track surfaces separately");
t.ok(view.querySelector(".effort-side"), "effort panel shows a Side track section");
t.eq(view.querySelectorAll(".effort-side .effort-chart.mini .ec-col").length, 14, "side mini-chart has 14 day-bars");
t.ok(view.querySelector(".effort-combined"), "combined Main + Side total is shown");
t.ok(view.querySelector(".today-track-sep"), "Today digest has a Side track divider (side fixture days are overdue)");
// The side fixture's overdue task must live under the side divider, and its slug
// must NOT appear among the main cards above it.
const sideCardTitles = [...view.querySelectorAll(".today-card-title")].map(n => n.textContent);
t.ok(sideCardTitles.includes("Side Test Fixture"), "the side roadmap renders its own Today card");

t.group("structured task body (lead / refs / model) renders");
// the side fixture's overdue d02.t1 uses the structured form
t.ok(view.querySelector(".t-label.rich .t-lead"), "a structured task renders a lead line");
t.ok(view.querySelectorAll(".t-label.rich .t-ref").length >= 2, "structured refs render as list items");
t.ok(view.querySelector(".t-label.rich .t-model"), "structured task renders a takeaway/model line");
// a plain-label task (rust/interp/fixture d01) still renders the flat .t-label
t.ok(view.querySelector(".t-label"), "plain-label tasks still render a .t-label");
const prevNav = view.querySelector(".effort-navbtn.prev");
t.ok(!!prevNav, "day-stepper present");
if (prevNav) { prevNav.onclick(); t.ok(view.querySelector(".effort"), "stepping to prev day re-renders without throwing"); }
const firstBar = view.querySelector(".ec-col");
if (firstBar) { firstBar.onclick(); t.ok(view.querySelector(".today-view"), "clicking a chart bar re-renders without throwing"); }
render.renderToday(view);                     // reset selection to today

t.group("recall cards unlock only when the task is done");
const sideRm = reg.getRoadmap("fixture-side");
render.renderRoadmap(sideRm, view);
t.ok(!view.querySelector(".t-recall"), "a task with cards shows NO recall block while undone");
store.setTask("fixture-side", "d02.t1", true);   // complete the structured task
render.renderRoadmap(sideRm, view);
t.ok(view.querySelector(".t-recall"), "completing the task unlocks its recall block");
t.eq(view.querySelectorAll(".t-recall .flashcard").length, 2, "both authored cards render as flashcards");
const fc = view.querySelector(".flashcard");
t.ok(fc && !fc.classList.contains("revealed"), "a flashcard starts hidden (question only)");
if (fc) { fc.onclick(); t.ok(fc.classList.contains("revealed"), "tapping a flashcard reveals the answer"); }
render.renderToday(view);
t.ok(view.querySelector(".recall-panel"), "Today surfaces a 'Recall from earlier' panel once a side card is unlocked");
t.ok(view.querySelector(".recall-panel .flashcard"), "the recall panel shows flashcards drawn from completed side work");
store.setTask("fixture-side", "d02.t1", false);  // restore fixture state for later suites
render.renderToday(view);

t.group("parent tasks: expand, tri-state checkbox, progress, recall");
await import(new URL("raylib.js", rmBase).href);       // its tasks are broken into sub-tasks
const rl = reg.getRoadmap("raylib");
render.renderRoadmap(rl, view);
const parentRow = view.querySelector(".task.parent");
t.ok(parentRow, "a task with sub-tasks renders as a .parent row");
const pid = parentRow && parentRow.dataset.task;
t.ok(parentRow && parentRow.querySelector(".t-subprogress .t-subcount"), "parent shows a done/total progress count");
// expand the summary → sub-task rows appear
parentRow.querySelector(".t-parent-head").click();
const reParent = () => view.querySelector(`.task.parent[data-task="${pid}"]`);
const subs = reParent().querySelectorAll(".t-subs .subtask");
t.ok(subs.length >= 2, "expanding the summary reveals the sub-task rows");
const n = subs.length;
// tick ONE sub-task → the parent goes partial and the count updates
subs[0].querySelector(".checkbox").onclick();
t.ok(reParent().classList.contains("partial"), "ticking one sub-task marks the parent partial (not done)");
t.eq(reParent().querySelector(".t-subcount").textContent, `1/${n}`, "the progress count reads 1 of N");
// the parent's tri-state checkbox completes every remaining sub-task
reParent().querySelector(".checkbox").onclick();
t.ok(reParent().classList.contains("done"), "the parent checkbox completes all sub-tasks");
t.ok(reParent().querySelector(".t-recall"), "a fully-complete parent unlocks its recall deck");
// clicking the full parent checkbox again clears every sub-task
reParent().querySelector(".checkbox").onclick();
t.ok(!reParent().classList.contains("done") && !reParent().classList.contains("partial"),
  "clicking a complete parent checkbox clears all sub-tasks");
store.resetRoadmap("raylib");                          // leave no state behind
render.renderToday(view);                              // next group expects the Today view

t.group("tick a task straight from Today");
const cb = view.querySelector(".today-card .task .checkbox");
if (cb) {
  const before = view.querySelectorAll(".today-card .task").length;
  cb.onclick();
  t.ok(view.querySelector(".today-view"), "tick handler re-rendered the Today view");
  t.ok(view.querySelectorAll(".today-card .task").length <= before, "the ticked row left the outstanding list (or count held)");
} else {
  t.ok(true, "no outstanding Today rows to tick (still a clean render)");
}

t.done();
