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
await import(new URL("store.js", base).href);       // registers the write-through sink path
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
t.eq(view.querySelectorAll(".ec-col").length, 14, "effort chart has 14 day-bars");
const prevNav = view.querySelector(".effort-navbtn.prev");
t.ok(!!prevNav, "day-stepper present");
if (prevNav) { prevNav.onclick(); t.ok(view.querySelector(".effort"), "stepping to prev day re-renders without throwing"); }
const firstBar = view.querySelector(".ec-col");
if (firstBar) { firstBar.onclick(); t.ok(view.querySelector(".today-view"), "clicking a chart bar re-renders without throwing"); }
render.renderToday(view);                     // reset selection to today

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
