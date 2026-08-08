// insights.test.mjs — the Insights analytics view: derivation correctness
// (burn-up cumulative series, on-time vs late summary, Total aggregation) plus a
// jsdom smoke test that the page + charts render and the roadmap selector
// re-paints. Skips cleanly when jsdom is absent (pure-logic asserts still run via
// the DOM they need, so the whole file needs jsdom — mirror render.test.mjs).
import { suite } from "./_harness.mjs";

const t = suite("insights");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="app"><main id="main"><div id="view"></div></main></div>
</body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.requestAnimationFrame = fn => setTimeout(fn, 0);
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const RealDate = Date;                       // freeze "now" = 2026-08-11 12:00 local
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(2026, 7, 11, 12, 0, 0); }
  static now() { return new RealDate(2026, 7, 11, 12, 0, 0).getTime(); }
}
global.Date = FakeDate; globalThis.Date = FakeDate;
const TODAY = "2026-08-11";

const base = new URL("../public/assets/js/", import.meta.url);
const rmBase = new URL("../public/roadmaps/", import.meta.url);
const reg = await import(new URL("registry.js", base).href);
await import(new URL("interp-go.js", rmBase).href);
await import(new URL("rust-fastapi.js", rmBase).href);
const store = await import(new URL("store.js", base).href);
const util = await import(new URL("util.js", base).href);
const insights = await import(new URL("insights.js", base).href);

const view = document.getElementById("view");
const rm = reg.getRoadmap("interp-go");
const reqLeaves = rm.leaves.filter(l => !l.optional);

function doneOnDate(slug, id, dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  store.setTask(slug, id, true);
  store.setCell(slug, `done_at:${id}`, "meta", new RealDate(y, m - 1, d, 12, 0, 0).toISOString());
}

// 4 finished on their scheduled day (on-time), 2 finished late. The late pair is
// stamped as completed TODAY — after their scheduled day (so still "late") but on
// or before the frozen now, so they count as done-by-today. (Using a fixed +N-day
// offset would drift PAST the frozen now as the roadmap start slides later with
// each date-shift; anchoring to TODAY keeps the fixture valid across shifts.)
store.resetAll();
reqLeaves.slice(0, 4).forEach(l => doneOnDate(rm.slug, l.id, l.date));
reqLeaves.slice(4, 6).forEach(l => doneOnDate(rm.slug, l.id, TODAY));

t.group("summarize: on-time vs late vs overdue");
const leaves = insights.collectLeaves(rm.slug);
const sum = insights.summarize(leaves, TODAY);
t.eq(sum.total, reqLeaves.length, "denominator = required leaves");
t.eq(sum.done, 6, "6 required leaves done");
t.eq(sum.ontime, 4, "4 done on time");
t.eq(sum.lateDone, 2, "2 done late");
t.ok(sum.done === sum.ontime + sum.lateDone, "done splits into on-time + late");
t.ok(sum.pending + sum.overdue === sum.total - sum.done, "undone splits into pending + overdue");
t.eq(sum.puncRate, Math.round((4 / 6) * 100), "punctuality rate = on-time / done");

t.group("burnup: cumulative, monotonic, bounded, four params");
const bu = insights.burnup(leaves, TODAY);
t.eq(bu.total, reqLeaves.length, "burn-up total = required leaves");
const mono = arr => arr.every((p, i) => i === 0 || p.y >= arr[i - 1].y - 1e-9);
t.ok(mono(bu.planned), "planned is non-decreasing");
t.ok(mono(bu.original), "original is non-decreasing");
t.ok(mono(bu.actual), "actual is non-decreasing");
t.ok(mono(bu.ontime), "on-time is non-decreasing");
t.ok(bu.planned[bu.planned.length - 1].y <= 100 + 1e-9, "planned tops out at ≤100%");
t.ok(bu.actual.every((p, i) => p.y >= bu.ontime[i].y - 1e-9), "actual ≥ on-time at every day");
t.ok(bu.original.every((p, i) => p.y >= bu.ontime[i].y - 1e-9), "original ≥ on-time at every day");
const lastActual = bu.actual[bu.actual.length - 1].y;
t.ok(Math.abs(lastActual - (6 / bu.total) * 100) < 1e-6, "final actual = done/total%");
t.eq(bu.original.length, bu.actual.length, "original & actual share the same truncated span");
t.ok(bu.actual.length <= bu.planned.length, "completion lines stop at today; planned spans full schedule");

t.group("original diverges from actual for work done off-schedule");
// finish a FUTURE-scheduled task today (ahead of its plan): Actual counts it now,
// Original (attributed to its later original date) does not → actualNow > originalNow.
const future = reqLeaves.filter(l => l.date > TODAY).pop();
t.ok(!!future, "roadmap has a future-scheduled task to pull forward");
doneOnDate(rm.slug, future.id, TODAY);
const bu2 = insights.burnup(insights.collectLeaves(rm.slug), TODAY);
t.ok(bu2.actualNow > bu2.originalNow + 1e-9, "early completion lifts Actual above Original at today");
// On-time is attributed to the ORIGINAL date (like stats.js), so finishing a
// future task early must NOT push On-time above Original — they share one axis.
t.ok(bu2.ontimeNow <= bu2.originalNow + 1e-9, "On-time never exceeds Original at today");
t.ok(bu2.ontime.every((p, i) => p.y <= bu2.original[i].y + 1e-9), "On-time ⊆ Original at every day");
store.setTask(rm.slug, future.id, false);   // undo so later assertions see the original 6 done

t.group("burnup: a completion dated before the first scheduled day is still counted");
// Working ahead on day one (or ticking while the whole roadmap is still in the
// future) yields a doneDate earlier than min(origDate); the cumulative Actual line
// must extend its low end to reach it, not silently drop it.
const early = [
  { optional: false, origDate: "2026-09-01", done: true, doneDate: "2026-08-30", est: 0 },
  { optional: false, origDate: "2026-09-01", done: false, doneDate: null, est: 0 },
];
const be = insights.burnup(early, "2026-09-05");
t.ok(be.first <= "2026-08-30", "window start extends back to the early completion date");
t.ok(Math.abs(be.actualNow - 50) < 1e-6, "the pre-schedule completion is included (1/2 = 50%)");

t.group("Total scope aggregates every roadmap's required work");
const allLeaves = insights.collectLeaves("__all__");
let expected = 0;
for (const r of reg.getRoadmaps()) expected += r.leaves.length;
t.eq(allLeaves.length, expected, "Total collects leaves from all roadmaps");
t.ok(insights.summarize(allLeaves, TODAY).total >= sum.total, "Total required ≥ single roadmap");

t.group("renders: hero, selector, KPIs, charts");
localStorage.setItem("roadmaps_insights_scope", rm.slug);
insights.renderInsights(view);
t.ok(view.querySelector(".insights-view"), "insights view mounts");
const sel = view.querySelector("select.ins-select");
t.ok(sel, "roadmap selector renders");
t.eq(sel.querySelectorAll("option").length, reg.getRoadmaps().length + 1, "one option per roadmap + Total");
t.eq(sel.querySelector("option").value, "__all__", "first option is Total");
t.ok(view.querySelector(".ins-readout"), "pace readout renders");
t.ok(view.querySelectorAll(".ins-kpis .kpi").length >= 5, "KPI strip renders");
t.eq(view.querySelectorAll("svg.linechart .line").length, 4, "burn-up renders 4 lines (Actual/Original/On-time/Planned)");
t.eq(view.querySelector("svg.linechart").style.fontSize, "12px", "wide burn-up uses a small axis font");
t.eq(view.querySelector("svg.barchart").style.fontSize, "26px", "grid bar chart uses a larger axis font");
t.ok(view.querySelector(".ins-highlights .ins-pill"), "highlights pills render");
t.eq(view.querySelectorAll(".seg .seg-btn").length, 3, "daily-effort range toggle has 3 options");
t.ok(view.querySelector(".chart-donut .donut-seg"), "completion donut renders segments");
t.ok(view.querySelector(".barchart .bar"), "a bar chart renders bars");
t.ok(view.querySelector(".hbars .hbar-row"), "objective bars render for a single roadmap");

t.group("selector re-paints; Total shows per-roadmap bars");
sel.value = "__all__";
sel.dispatchEvent(new dom.window.Event("change"));
t.eq(localStorage.getItem("roadmaps_insights_scope"), "__all__", "scope choice persisted");
t.ok(view.querySelector(".hbars .hbar-row"), "Total shows per-roadmap progress bars");
t.ok(view.querySelector(".linechart .line"), "burn-up still renders under Total");

t.done();
