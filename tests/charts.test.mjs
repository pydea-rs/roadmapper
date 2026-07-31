// charts.test.mjs — the hand-built, dependency-free SVG chart primitives used by
// the Insights view (charts.js). No external chart lib means the geometry and the
// edge cases (empty data, a full-circle donut, clamped bars) are ours to get
// right — this covers those. Needs jsdom (charts build real SVG nodes); skips
// cleanly without it.
import { suite } from "./_harness.mjs";

const t = suite("charts");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body></body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;

const base = new URL("../public/assets/js/", import.meta.url);
const C = await import(new URL("charts.js", base).href);

t.group("donut — segments, empty state, full circle, legend");
const empty = C.donut({ slices: [] });
t.ok(empty.querySelector(".donut-empty"), "an all-zero donut draws the empty placeholder ring");
t.eq(empty.querySelectorAll(".donut-seg").length, 0, "…and no segments");

const two = C.donut({ slices: [
  { label: "Done", value: 3, color: "green" },
  { label: "Left", value: 1, color: "grey" },
], centerTop: "75%", centerBottom: "done" });
t.eq(two.querySelectorAll(".donut-seg").length, 2, "two positive slices ⇒ two segment paths");
t.eq(two.querySelectorAll(".dl-row").length, 2, "the legend lists both slices");
t.ok(two.querySelector(".donut-c-top") && two.querySelector(".donut-c-bot"),
  "centre labels render when provided");
t.ok(/·\s*75%/.test(two.querySelector(".dl-val").textContent),
  "legend values show their share of the total");

const full = C.donut({ slices: [{ label: "All", value: 5, color: "green" }] });
t.eq(full.querySelectorAll(".donut-seg").length, 1, "a single 100% slice is one segment");
const d = full.querySelector(".donut-seg").getAttribute("d");
t.ok((d.match(/A 100 100/g) || []).length >= 2,
  "the full-circle slice uses two arcs (a lone 360° arc won't render)");

const zeroHidden = C.donut({ slices: [
  { label: "Has", value: 2, color: "green" },
  { label: "None", value: 0, color: "grey", hideZero: true },
] });
t.eq(zeroHidden.querySelectorAll(".dl-row").length, 1, "hideZero drops empty slices from the legend");
t.eq(zeroHidden.querySelectorAll(".donut-seg").length, 1, "a zero-value slice draws no segment");

t.group("barChart — bars, stacked segments, avg line, empties");
const bars = C.barChart({ bars: [
  { label: "Mon", value: 5 }, { label: "Tue", value: 0 }, { label: "Wed", value: 8 },
] });
t.eq(bars.querySelectorAll("rect.bar").length, 2, "zero-height bars are skipped (Tue has no rect)");
const stacked = C.barChart({ bars: [
  { label: "x", segments: [{ value: 2, color: "a" }, { value: 3, color: "b" }, { value: 0, color: "c" }] },
] });
t.eq(stacked.querySelectorAll("rect.bar").length, 2, "a stacked bar draws one rect per positive segment");
t.ok(C.barChart({ bars: [{ label: "x", value: 4 }], avg: 2 }).querySelector(".avg-line"),
  "an in-range avg draws the average line");
t.ok(!C.barChart({ bars: [{ label: "x", value: 4 }], avg: 0 }).querySelector(".avg-line"),
  "avg 0 draws no average line");
t.ok(C.barChart({ bars: [] }).querySelector("svg"), "an empty bar set renders without throwing");

t.group("hbars — percentage clamping and label overrides");
const clamp = C.hbars([
  { label: "over", value: 150, max: 100 },
  { label: "under", value: -5, max: 100 },
  { label: "raw", value: 42 },                     // no max ⇒ value used as the percentage
  { label: "explicit", value: 1, max: 2, valText: "1 / 2" },
]);
const rows = clamp.querySelectorAll(".hbar-row");
t.eq(rows[0].querySelector(".hbar-fill").style.width, "100%", "a value above max clamps the fill to 100%");
t.eq(rows[1].querySelector(".hbar-fill").style.width, "0%", "a negative value clamps the fill to 0%");
t.eq(rows[2].querySelector(".hbar-fill").style.width, "42%", "with no max the raw value is the percentage");
t.eq(rows[3].querySelector(".hbar-fill").style.width, "50%", "a value/max pair sets the fill proportionally");
t.eq(rows[3].querySelector(".hbar-val").textContent, "1 / 2", "valText overrides the default percentage label");
t.eq(rows[2].querySelector(".hbar-val").textContent, "42%", "without valText the label is the rounded percentage");

t.group("lineChart — structure, today marker, legend, endpoints");
const ser = { name: "Planned", color: "var(--accent)", points: [{ x: 0, y: 0 }, { x: 1, y: 50 }, { x: 2, y: 100 }] };
const faint = { name: "Base", color: "grey", points: [{ x: 0, y: 0 }, { x: 2, y: 60 }], faint: true };
const line = C.lineChart({ series: [ser, faint], xMax: 2, todayX: 1, legend: true });
t.ok(line.classList.contains("chart-line"), "returns the .chart-line wrapper");
t.ok(line.querySelector("svg.linechart"), "…containing the line-chart svg");
t.eq(line.querySelectorAll("path.line").length, 2, "one line path per series");
t.eq(line.querySelectorAll("circle.endpt").length, 1, "only non-faint series get an endpoint dot");
t.ok(line.querySelector(".today-mark"), "an in-range todayX draws the Today marker");
t.eq(line.querySelectorAll(".chart-legend .lg-key").length, 2, "the legend has one key per series");
t.ok(!C.lineChart({ series: [ser], xMax: 2, todayX: 9 }).querySelector(".today-mark"),
  "a todayX beyond xMax draws no Today marker");
t.ok(C.lineChart({ series: [{ ...ser, fill: true }], xMax: 2 }).querySelector("path.area"),
  "a fill series adds an area path");
t.ok(C.lineChart({ series: [], xMax: 1 }).querySelector("svg"), "an empty series set renders without throwing");

t.group("chartLegend — keys and dashed variant");
const lg = C.chartLegend([{ name: "A", color: "red" }, { name: "B", color: "blue", dashed: true }]);
t.eq(lg.querySelectorAll(".lg-key").length, 2, "one key per legend item");
t.ok(lg.querySelectorAll(".lg-key")[1].classList.contains("dashed"), "the dashed flag marks its key");

t.done();
