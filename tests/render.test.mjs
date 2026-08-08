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
global.getComputedStyle = (...a) => dom.window.getComputedStyle(...a);   // slideshow geom() reads gap
global.requestAnimationFrame = fn => setTimeout(fn, 0);
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const RealDate = Date;                       // freeze "now" = 2026-08-11 12:00 local
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(2026, 7, 11, 12, 0, 0); }
  static now() { return new RealDate(2026, 7, 11, 12, 0, 0).getTime(); }
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
const finder = await import(new URL("finder.js", base).href);

const view = document.getElementById("view");

t.group("roadmap view renders");
for (const rm of reg.getRoadmaps()) {
  render.renderRoadmap(rm, view);
  t.ok(view.querySelector(".timeline"), `${rm.slug}: timeline rendered`);
}

t.group("day cards show three progress rings (actual / original / on-time)");
render.renderRoadmap(reg.getRoadmap("interp-go"), view);   // has past days at the frozen now
t.ok(view.querySelector(".day-ring.actual"), "the Actual ring renders");
t.ok(view.querySelector(".day-ring.orig"), "the Original ring renders on reached days");
t.ok(view.querySelector(".day-ring.ontime"), "the On-time ring renders on reached days");
t.ok(view.querySelector(".ring-cell .ring-cap"), "each ring carries a caption");

t.group("a week straddling a month boundary renders its header/figures only once");
render.renderRoadmap(reg.getRoadmap("interp-go"), view);   // interp-go has weeks crossing Jul→Aug, Sep→Oct
const totalWeekGroups = view.querySelectorAll(".week-group").length;
const contGroups = view.querySelectorAll(".week-group.cont").length;
t.ok(contGroups > 0, "continuation slices exist (some weeks span two calendar months)");
t.eq(view.querySelectorAll(".week-dual").length, totalWeekGroups - contGroups,
  "the figures block renders exactly once per week, never duplicated on a continuation slice");
t.eq(view.querySelectorAll(".week-group.cont .week-dual, .week-group.cont .wk-milestone").length, 0,
  "continuation slices carry no percentages or milestone chip");

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

t.group("milestone 'what's needed' modal lists the gating tasks with live state");
render.renderRoadmap(rl, view);
const modalRoot = document.getElementById("modal-root");
const msInfo = view.querySelector(".ms .ms-info");
t.ok(msInfo, "every milestone card carries a 'what's needed' button");
msInfo.click();
t.ok(modalRoot.querySelector(".modal .ms-tasklist"), "clicking it opens a modal with a task checklist");
const firstMs = rl.milestones[0];                              // w5.m1 — a type:"tasks" rule
const rows = modalRoot.querySelectorAll(".ms-tasklist .ms-tk");
t.eq(rows.length, firstMs.rule.require.length, "the checklist lists exactly the milestone's required tasks");
t.ok([...rows].every(r => r.classList.contains("todo")), "with nothing done, every task row reads 'todo'");
modalRoot.querySelector(".modal-foot .btn").click();           // Close
modalRoot.innerHTML = "";                                      // drop the closing layer (its 200ms removal won't fire in-test)
// complete one required parent's sub-tasks → its row flips to done on reopen
const reqTask = rl.tasksById.get(firstMs.rule.require[0]);
reqTask.subs.forEach(s => store.setTask("raylib", s.id, true));
view.querySelector(".ms .ms-info").click();
t.eq(modalRoot.querySelectorAll(".ms-tasklist .ms-tk.done").length, 1,
  "completing a required parent's sub-tasks marks its row done in the modal");
modalRoot.querySelector(".modal-foot .btn").click();
modalRoot.innerHTML = "";
reqTask.subs.forEach(s => store.setTask("raylib", s.id, false));

t.group("milestone button survives a slideshow drag (stale drag-distance gate)");
// Regression: the slideshow's capture-phase click gate swallows clicks while its
// drag distance is > 6px, and that distance is only reset by a viewport pointerdown.
// A press on the info button must reset it too — else every click after a drag is
// eaten (the "click many times before it acts" bug).
render.renderRoadmap(rl, view);
const vp = view.querySelector(".ms-show-vp");
t.ok(vp, "slideshow viewport present (default mode)");
const dragCard = view.querySelector(".ms");
const dragInfo = dragCard.querySelector(".ms-info");
const pev = (type, x, tgt) => tgt.dispatchEvent(new dom.window.MouseEvent(type, { clientX: x, bubbles: true, cancelable: true }));
// 1) drag the slideshow a real distance, leaving the gate "armed"
pev("pointerdown", 100, vp); pev("pointermove", 170, vp); pev("pointerup", 170, vp);
// 2) now a genuine click on a card's button (press resets distance, then click)
pev("pointerdown", 170, dragInfo);
dragInfo.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
t.ok(document.getElementById("modal-root").querySelector(".ms-tasklist"),
  "the info button opens its modal on the first click even right after a drag");
document.getElementById("modal-root").innerHTML = "";

t.group("Today 'Watch / read next' finder");
render.renderToday(view);
t.ok(view.querySelector(".today-view.has-finder"), "Today gains the finder rail when work is due/overdue");
const fpanel = view.querySelector(".finder-panel");
t.ok(fpanel && fpanel.querySelector(".finder-go"), "the finder panel renders with a shuffle button");

// deriveQuery is pure keyword extraction — no network, no LLM, no AI.
const oneTask = [rl.tasksById.get("d01.t1")];
const dq = finder.deriveQuery(rl, oneTask, { rng: () => 0.0 });
t.ok(typeof dq.q === "string" && dq.q.length > 0, "deriveQuery builds a non-empty query from task text");
t.ok(dq.q.split(" ").length <= 6, "the query is capped to a handful of terms");
t.ok(/raylib/i.test(dq.q), "the query is anchored in the roadmap's own tech (raylib)");
t.eq(dq.type, "video", "rng < 0.7 picks a video");
t.eq(finder.deriveQuery(rl, oneTask, { rng: () => 0.9 }).type, "article", "rng >= 0.7 picks an article");

// resultCard renders a safe, clickable card (title via textContent, never HTML).
const card = finder.resultCard(
  { title: "Intro to raylib", url: "https://www.youtube.com/watch?v=abc",
    thumb: "https://i.ytimg.com/vi/abc/hqdefault.jpg", source: "YouTube" },
  { topic: "Raylib", type: "video" });
t.ok(card.matches("a.finder-result.video"), "a video result is an anchor card");
t.eq(card.getAttribute("target"), "_blank", "the card opens in a new tab");
t.eq(card.querySelector(".fr-img").getAttribute("src"), "https://i.ytimg.com/vi/abc/hqdefault.jpg",
  "the video thumbnail is shown");
t.ok(/Intro to raylib/.test(card.querySelector(".fr-title").textContent), "the video title renders");

// Clicking the shuffle button runs a real search through a mocked backend.
const realFetch = global.fetch;
global.fetch = async () => ({ ok: true, headers: { get: () => "application/json" },
  json: async () => ({ ok: true, type: "video", fetched: true, results: [
    { title: "Found video", url: "https://www.youtube.com/watch?v=zzz",
      thumb: "https://i.ytimg.com/vi/zzz/hqdefault.jpg", source: "YouTube" }] }) });
fpanel.querySelector(".finder-go").click();
await new Promise(r => setTimeout(r, 5));
t.ok(fpanel.querySelector(".finder-slot .finder-result"), "a manual shuffle surfaces a result card");
t.ok(/Found video/.test(fpanel.querySelector(".fr-title")?.textContent || ""),
  "the surfaced card shows the fetched title");

// Rebuilding the panel must re-show the last pick synchronously (survives Today
// re-renders) rather than blocking on / blindly firing a fetch. With the backend
// offline here, a throwing fetch proves no synchronous search is attempted.
global.fetch = () => { throw new Error("no blind search on panel rebuild"); };
render.renderToday(view);
const reFinder = view.querySelector(".finder-panel");
t.ok(/Found video/.test(reFinder.querySelector(".fr-title")?.textContent || ""),
  "the found card is re-shown immediately when the panel is rebuilt");
global.fetch = realFetch;
render.renderToday(view);

t.group("timeline interludes: curated resource cards between days, with a seen tick");
const ilds = await import(new URL("interludes.js", base).href);
render.renderRoadmap(rl, view);
const ilCards = view.querySelectorAll(".interlude");
t.eq(ilCards.length, ilds.getInterludes("raylib").length, "every curated raylib interlude renders as a card");
const firstIl = ilCards[0];
t.ok(firstIl.querySelector(".il-media") && firstIl.querySelector(".il-title") && firstIl.querySelector(".il-note"),
  "an interlude card has a media thumb, a title and a why-now note");
t.ok(firstIl.querySelector('.il-title[target="_blank"]'), "the title opens in a new tab");
// the card sits AFTER its afterDay in the DOM (a between-days card)
const afterId = ilds.getInterludes("raylib").find(i => i.id === firstIl.dataset.interlude).afterDay;
const dayNode = view.querySelector(`.day[data-day="${afterId}"]`);
t.ok(dayNode && (dayNode.compareDocumentPosition(firstIl) & 0x04),
  "the interlude renders after the day it builds on");
const ilId = firstIl.dataset.interlude;
const ilSeen = firstIl.querySelector(".il-seen");
t.ok(!store.isSeen("raylib", ilId), "a fresh interlude is not yet marked seen");
ilSeen.onclick();
t.ok(store.isSeen("raylib", ilId) && firstIl.classList.contains("seen"), "ticking it persists + reflects 'seen'");
// an ALREADY-seen interlude must render seen from the start (initial-render path)
render.renderRoadmap(rl, view);
const reIl = view.querySelector(`.interlude[data-interlude="${ilId}"]`);
t.ok(reIl.classList.contains("seen"), "a persisted-seen interlude renders with .seen on reload");
t.ok(reIl.querySelector(".il-seen.on"), "its tick renders in the 'on' state on reload");
reIl.querySelector(".il-seen").onclick();
t.ok(!store.isSeen("raylib", ilId), "ticking again clears 'seen'");
store.resetRoadmap("raylib");

t.group("bonus disclosure survives a tick rerender (persisted open state)");
render.renderRoadmap(reg.getRoadmap("rust-fastapi"), view);   // rust-fastapi has optional/bonus tasks
const bTrack = view.querySelector(".bonus-track");
t.ok(bTrack, "a day with optional work renders a bonus track");
const bBox = bTrack.querySelector(".bonus-head").nextElementSibling;
t.eq(bBox.style.display, "none", "the bonus list starts collapsed");
bTrack.querySelector(".bonus-head").onclick();
t.eq(bBox.style.display, "flex", "clicking the header expands the bonus list");
render.rerender();                                            // a tick rerender rebuilds the DOM
t.eq(view.querySelector(".bonus-track .bonus-head").nextElementSibling.style.display, "flex",
  "the bonus list is STILL expanded after a rerender (open state persisted, like day/task disclosures)");
view.querySelector(".bonus-track .bonus-head").onclick();     // collapse again
render.rerender();
t.eq(view.querySelector(".bonus-track .bonus-head").nextElementSibling.style.display, "none",
  "collapsing it and rerendering keeps it collapsed too");
render.renderToday(view);                                     // restore the Today view for the next group

t.group("Today digest: a completed parent drops off the outstanding list");
// "now" is frozen at 2026-08-11, so raylib d01.t1 (2026-08-09) is OVERDUE. A
// parent holds no done-state of its own — completing every sub must make the
// digest treat it as done (guards the collectDue parent-completeness fix). Scope
// to the RAYLIB card: data-task ids are per-roadmap, so several roadmaps share id
// "d01.t1" in the cross-roadmap digest.
const railCard = () => view.querySelector('.today-card a[href="#/raylib/today"]')?.closest(".today-card");
render.renderToday(view);
t.ok(railCard() && railCard().querySelector('[data-task="d01.t1"]'),
  "an incomplete overdue parent shows up in Today");
const od = rl.tasksById.get("d01.t1");
od.subs.forEach(s => store.setTask("raylib", s.id, true));   // complete every sub
render.renderToday(view);
t.ok(railCard() && !railCard().querySelector('[data-task="d01.t1"]'),
  "once all its subs are done, the overdue parent leaves the raylib outstanding list");
od.subs.forEach(s => store.setTask("raylib", s.id, false));

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

t.group("a re-dated (moved) day card renders on its new date");
const daymenu = await import(new URL("daymenu.js", base).href);
const igo = reg.getRoadmap("interp-go");
const movable = igo.days.find(d => daymenu.freeDatesFor(d).length > 0);
t.ok(movable, "interp-go has a day with a free gap to move into");
const newDate = daymenu.freeDatesFor(movable)[0];
store.setDayDate(igo.slug, movable.id, newDate);
render.renderRoadmap(igo, view);
const movedCard = view.querySelector(`.day[data-day="${movable.id}"]`);
t.ok(movedCard, "the moved day card still renders");
t.ok(movedCard.classList.contains("moved"), "…and is flagged .moved");
t.ok(movedCard.querySelector(".day-title .t-moved"), "…with a 'moved · was …' chip in its title");
t.eq(movedCard.querySelector(".day-date .dnum").textContent, String(Number(newDate.slice(8, 10))),
  "…and its date number is the NEW date, not the authored one");
store.setDayDate(igo.slug, movable.id, null);          // reset so state stays clean
render.renderRoadmap(igo, view);
t.ok(!view.querySelector(`.day[data-day="${movable.id}"]`).classList.contains("moved"),
  "resetting the override drops the .moved flag");

t.done();
