// insights.js — the "Insights" view: charts & statistics on how the journey is
// going over time. Like stats.js/activity.js, EVERYTHING here is derived at
// runtime from (roadmap structure + journey state + done_at stamps) — nothing is
// stored, so it is always truthful.
//
// Scope: a single roadmap by slug, or "Total" (every roadmap's required work
// unioned). The flagship is a burn-up line chart of the three progress params
// over calendar days — Planned (the schedule), Actual (done), On-time (done as
// planned) — plus a spread of behavioural stats, each with its own chart.

import { getRoadmaps, getRoadmap } from "./registry.js";
import * as store from "./store.js";
import { localDate } from "./activity.js";
import { computeAll, dayDate } from "./stats.js";
import { lineChart, barChart, donut, hbars } from "./charts.js";
import {
  el, todayStr, parseDate, addDays, daysBetween, fmtDate, fmtMins,
  fmtDateHuman, MONTHS, clamp, pct,
} from "./util.js";

const ALL = "__all__";
const SCOPE_KEY = "roadmaps_insights_scope";

/* ------------------------------------------------------------------ *
 *  Derivations
 * ------------------------------------------------------------------ */
function scopeRoadmaps(scope) {
  return scope === ALL ? getRoadmaps() : [getRoadmap(scope)].filter(Boolean);
}

/** Every leaf in scope, with journey state resolved. `optional` is carried so the
 *  progress views can use required-only while the effort views include bonus.
 *  Exported (with burnup/summarize) for the test suite. */
export function collectLeaves(scope) {
  const out = [];
  for (const rm of scopeRoadmaps(scope)) {
    // a re-dated (moved) card shifts the ORIGINAL/scheduled date of its own leaves,
    // so the burn-up + punctuality charts follow the move just like on-time does.
    const effByDay = new Map();
    for (const d of rm.days) effByDay.set(d.id, dayDate(rm, rm.slug, d));
    for (const leaf of rm.leaves) {
      const done = store.isDone(rm.slug, leaf.id);
      out.push({
        slug: rm.slug, id: leaf.id, origDate: effByDay.get(leaf.day) || leaf.date, week: leaf.week,
        est: leaf.est || 0, cat: leaf.cat || "read", optional: !!leaf.optional,
        done, doneDate: done ? localDate(store.doneAt(rm.slug, leaf.id)) : null,
      });
    }
  }
  return out;
}
const required = leaves => leaves.filter(l => !l.optional);

const CAT_COLOR = {
  read: "var(--cat-read)", watch: "var(--cat-watch)", code: "var(--cat-code)",
  drill: "var(--cat-drill)", exercise: "var(--cat-exercise)", challenge: "var(--cat-challenge)",
  project: "var(--cat-project)", review: "var(--cat-review)", api: "var(--cat-api)",
  book: "var(--cat-book)", prep: "var(--cat-prep)", alt: "var(--cat-alt)",
};
const catColor = c => CAT_COLOR[c] || "var(--cat-alt)";

/** Monday (YYYY-MM-DD) of the calendar week containing `s`. */
function mondayOf(s) { const d = parseDate(s); const off = (d.getDay() + 6) % 7; d.setDate(d.getDate() - off); return fmtDate(d); }

/** Cumulative burn-up: Planned / Actual / On-time as % of required leaves, per
 *  calendar day from the first scheduled day to max(last scheduled, today). */
export function burnup(leaves, today) {
  const rl = required(leaves);
  const total = rl.length;
  if (!total) return null;
  let first = null, last = null;
  const plannedBy = new Map(), doneBy = new Map(), ontimeBy = new Map(), origDoneBy = new Map();
  const inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (const l of rl) {
    if (!first || l.origDate < first) first = l.origDate;
    if (!last || l.origDate > last) last = l.origDate;
    inc(plannedBy, l.origDate);                                   // scheduled by its original date
    if (l.done) inc(origDoneBy, l.origDate);                      // DONE, attributed to its original date
    if (l.doneDate) {
      inc(doneBy, l.doneDate);                                    // Actual: the day you actually ticked it
      // On-time attributed to its ORIGINAL date (matches stats.js's canonical
      // origin-scoped on-time), so On-time ⊆ Original on the same axis — working
      // ahead can never push the gold line above the grey one.
      if (l.doneDate <= l.origDate) inc(ontimeBy, l.origDate);
    }
  }
  if (today > last) last = today;
  if (today < first) first = today;
  // completions can fall OUTSIDE the scheduled span at either end and must still be
  // reached by the cumulative Actual line: late ones after `last` (done today for a
  // past-due task) and early ones before `first` (worked ahead of the first
  // scheduled day, or ticked while the whole roadmap is still in the future).
  for (const d of doneBy.keys()) { if (d > last) last = d; if (d < first) first = d; }
  const N = Math.max(0, daysBetween(first, last));
  const todayIdx = clamp(daysBetween(first, today), 0, N);

  // Four series:
  //   Planned  — the schedule ramp (everything scheduled by its original date).
  //   Original — of work scheduled by day d, how much is done (progress vs plan).
  //   Actual   — completion by the day you actually ticked it (done_at).
  //   On-time  — done on/before its original date, plotted at that ORIGINAL date.
  // Original/Actual/On-time stop at today; Planned spans the whole schedule.
  const planned = [], original = [], actual = [], ontime = [];
  let cp = 0, cod = 0, ca = 0, co = 0;
  for (let i = 0; i <= N; i++) {
    const d = addDays(first, i);
    cp += plannedBy.get(d) || 0; cod += origDoneBy.get(d) || 0;
    ca += doneBy.get(d) || 0; co += ontimeBy.get(d) || 0;
    planned.push({ x: i, y: (cp / total) * 100 });
    if (i <= todayIdx) {
      original.push({ x: i, y: (cod / total) * 100 });
      actual.push({ x: i, y: (ca / total) * 100 });
      ontime.push({ x: i, y: (co / total) * 100 });
    }
  }
  // month ticks
  const xTicks = [];
  for (let i = 0; i <= N; i++) {
    const d = addDays(first, i);
    if (i === 0 || d.slice(8, 10) === "01") {
      const dt = parseDate(d);
      xTicks.push({ x: i, label: MONTHS[dt.getMonth()].slice(0, 3) + (dt.getMonth() === 0 || i === 0 ? " '" + d.slice(2, 4) : "") });
    }
  }
  return {
    total, first, last, N, todayIdx, planned, original, actual, ontime, xTicks,
    plannedNow: planned[todayIdx] ? planned[todayIdx].y : 0,
    originalNow: original.length ? original[original.length - 1].y : 0,
    actualNow: actual.length ? actual[actual.length - 1].y : 0,
    ontimeNow: ontime.length ? ontime[ontime.length - 1].y : 0,
  };
}

/** Headline counts for the KPI strip. */
export function summarize(leaves, today) {
  const rl = required(leaves);
  const total = rl.length;
  let done = 0, ontime = 0, lateDone = 0, overdue = 0, pending = 0, invested = 0;
  for (const l of rl) {
    if (l.done) {
      done++; invested += l.est;
      if (l.doneDate && l.doneDate <= l.origDate) ontime++; else lateDone++;
    } else if (l.origDate < today) overdue++;
    else pending++;
  }
  return {
    total, done, ontime, lateDone, overdue, pending, invested,
    // Shared pct(): never rounds an incomplete scope up to 100% (199/200 → 99%),
    // keeping the KPI/donut/readout in step with the count-based rings elsewhere.
    pct: pct(done, total),
    puncRate: pct(ontime, done),
  };
}

/** date → {req, bonus, tasks} minutes completed that calendar day. */
function effortByDate(leaves) {
  const m = new Map();
  for (const l of leaves) {
    if (!l.doneDate) continue;
    let e = m.get(l.doneDate); if (!e) { e = { req: 0, bonus: 0, tasks: 0 }; m.set(l.doneDate, e); }
    e.tasks++; if (l.optional) e.bonus += l.est; else e.req += l.est;
  }
  return m;
}
function rangeMins(map, startStr, endStr) {
  let mins = 0;
  for (let d = startStr; d <= endStr; d = addDays(d, 1)) { const e = map.get(d); if (e) mins += e.req + e.bonus; }
  return mins;
}

/** Parent tasks that were rescheduled (moves are parent-level). */
function movesStat(scope) {
  let moved = 0, fwd = 0, back = 0;
  for (const rm of scopeRoadmaps(scope)) for (const d of rm.days) for (const t of d.tasks) {
    if (t.optional) continue;
    const dest = store.getMove(rm.slug, t.id); if (!dest) continue;
    const dd = rm.daysById.get(dest); if (!dd) continue;
    moved++; if (dd.date > d.date) fwd++; else if (dd.date < d.date) back++;
  }
  return { moved, fwd, back };
}

function bestStreak(scope) {
  let best = 0;
  for (const rm of scopeRoadmaps(scope)) { try { const s = computeAll(rm); if (s.streak > best) best = s.streak; } catch {} }
  return best;
}

/* ------------------------------------------------------------------ *
 *  View
 * ------------------------------------------------------------------ */
export function renderInsights(mount) {
  mount.innerHTML = "";
  const view = el("div.insights-view");

  // hero
  const hero = el("div.hero.insights-hero");
  const top = el("div.hero-top");
  top.append(el("div.hero-ico", { text: "📊" }));
  const tb = el("div");
  tb.append(el("h1", { text: "Insights" }));
  tb.append(el("p.sub", { text: "How your journey is trending — progress over time, punctuality, effort and momentum." }));
  top.append(tb);
  hero.append(top);
  view.append(hero);

  // toolbar: roadmap selector (Total + each)
  const roadmaps = getRoadmaps();
  let scope = localStorage.getItem(SCOPE_KEY) || ALL;
  if (scope !== ALL && !getRoadmap(scope)) scope = ALL;

  const toolbar = el("div.ins-toolbar");
  toolbar.append(el("label.ins-tb-label", { for: "ins-scope", text: "Roadmap" }));
  const sel = el("select.ins-select#ins-scope", { "aria-label": "Choose roadmap" });
  const totalOpt = el("option", { value: ALL, text: "★ Total · all roadmaps" });
  sel.append(totalOpt);
  for (const rm of roadmaps) sel.append(el("option", { value: rm.slug, text: `${rm.icon} ${rm.title}` }));
  sel.value = scope;
  toolbar.append(sel);
  view.append(toolbar);

  const body = el("div.ins-body");
  view.append(body);
  mount.append(view);

  const paint = sc => {
    // A single roadmap lends its identity colour to the charts (the Actual line,
    // KPI accents, bars); Total falls back to the global accent.
    const rm = sc === ALL ? null : getRoadmap(sc);
    if (rm && rm.accent) {
      body.style.setProperty("--accent", rm.accent);
      body.style.setProperty("--accent-soft", `color-mix(in srgb, ${rm.accent} 15%, transparent)`);
    } else { body.style.removeProperty("--accent"); body.style.removeProperty("--accent-soft"); }
    body.innerHTML = ""; body.append(...buildBody(sc));
  };
  sel.addEventListener("change", () => {
    scope = sel.value; localStorage.setItem(SCOPE_KEY, scope);
    paint(scope);
  });
  paint(scope);
}

/** Build every section for a scope. Returns an array of nodes. */
function buildBody(scope) {
  const today = todayStr();
  const leaves = collectLeaves(scope);
  const rl = required(leaves);
  const out = [];

  if (!rl.length) {
    const empty = el("div.center-note", { style: "padding:var(--s8)" });
    empty.append(el("div.big", { text: "📭" }));
    empty.append(document.createTextNode("No required tasks in this scope yet."));
    return [empty];
  }

  const sum = summarize(leaves, today);
  const effort = effortByDate(leaves);
  const bu = burnup(leaves, today);
  const moves = movesStat(scope);
  const streak = bestStreak(scope);

  // ---- pace readout (are you ahead of / behind the plan today?) ----
  const paceDelta = Math.round(bu.actualNow - bu.plannedNow);
  const paceCls = paceDelta > 2 ? "ahead" : paceDelta < -2 ? "behind" : "on";
  const paceWord = paceCls === "ahead" ? "ahead of" : paceCls === "behind" ? "behind" : "on";
  const readout = el("div.ins-readout." + paceCls);
  readout.append(el("span.ir-dot"));
  readout.append(el("span", { html:
    `<b>${sum.pct}%</b> complete — you're <b>${paceWord} schedule</b>`
    + (paceCls !== "on" ? ` by ${Math.abs(paceDelta)} pt${Math.abs(paceDelta) === 1 ? "" : "s"}` : "")
    + `. <b>${sum.puncRate}%</b> of completed work was done on time`
    + (sum.overdue ? `, and <b class="warn-ink">${sum.overdue}</b> ${sum.overdue === 1 ? "task is" : "tasks are"} overdue.` : ".") }));
  out.push(readout);

  // ---- KPI strip ----
  const strip = el("div.stats-strip.ins-kpis");
  const thisW = rangeMins(effort, addDays(today, -6), today);
  const lastW = rangeMins(effort, addDays(today, -13), addDays(today, -7));
  const delta = thisW - lastW;
  strip.append(
    kpi("Complete", `${sum.pct}%`, `${sum.done}/${sum.total} tasks`),
    kpi("On-time rate", `${sum.puncRate}%`, `${sum.ontime} of ${sum.done} done`, sum.puncRate >= 70 ? "good" : sum.puncRate >= 40 ? "warn" : "bad"),
    kpi("Streak", `${streak}`, streak === 1 ? "day" : "days", streak > 0 ? "good" : null),
    kpi("Overdue", `${sum.overdue}`, "tasks", sum.overdue ? "bad" : "good"),
    kpi("Invested", fmtMins(sum.invested), "of effort"),
    kpi("This week", fmtMins(thisW), momentumSub(delta), delta > 0 ? "good" : delta < 0 ? "warn" : null),
  );
  out.push(strip);

  // ---- highlights pills ----
  const hi = highlights(effort);
  if (hi.activeDays) {
    const row = el("div.ins-highlights");
    row.append(pill("📅", `${hi.activeDays}`, hi.activeDays === 1 ? "active day" : "active days"));
    if (hi.best.date) row.append(pill("⚡", fmtMins(hi.best.mins), `best day · ${fmtDateHuman(hi.best.date)}`));
    row.append(pill("📈", fmtMins(hi.avgActive), "avg / active day"));
    const topCat = topCategory(rl);
    if (topCat) row.append(pill("🏷️", capital(topCat.cat), `top category · ${topCat.n} done`));
    out.push(row);
  }

  // ---- burn-up (flagship) ----
  out.push(card("Progress over time",
    "Cumulative % of required tasks by day. Actual = when you finished · Original = progress vs. the original schedule · On-time = done as planned · Planned = the target pace.",
    burnupChart(bu, scope), "wide"));

  // ---- grid of smaller charts ----
  const grid = el("div.ins-grid");

  // completion breakdown donut
  grid.append(card("Completion breakdown", "Where every required task stands right now.",
    donut({
      thickness: 24, size: 200,
      centerTop: `${sum.pct}%`, centerBottom: "done",
      slices: [
        { label: "On time", value: sum.ontime, color: "var(--ontime)" },
        { label: "Late", value: sum.lateDone, color: "var(--warn)" },
        { label: "Overdue", value: sum.overdue, color: "var(--bad)" },
        { label: "Upcoming", value: sum.pending, color: "var(--track-ink)" },
      ],
    })));

  // daily effort bars (last N days) — with a range toggle
  grid.append(effortCard(effort, today));

  // punctuality trend
  grid.append(card("Punctuality trend", "Of the tasks due each week, how many you finished on time.",
    punctualityChart(rl, today)));

  // productivity by weekday
  grid.append(card("Productivity by weekday", "When you actually get work done.",
    weekdayChart(leaves)));

  // category split
  grid.append(card("Effort by category", "How your completed work splits across activity types.",
    categoryChart(rl)));

  // objectives / per-roadmap progress
  grid.append(card(scope === ALL ? "Progress by roadmap" : "Progress by objective",
    scope === ALL ? "Actual completion of each roadmap." : "Actual completion of each objective in this roadmap.",
    scope === ALL ? roadmapBars() : objectiveBars(scope)));

  out.push(grid);

  // moves footnote
  if (moves.moved) {
    const mv = el("div.ins-moves");
    mv.append(el("span.im-ico", { text: "🔀" }));
    mv.append(el("span", { html: `<b>${moves.moved}</b> ${moves.moved === 1 ? "task" : "tasks"} rescheduled — `
      + `<b>${moves.fwd}</b> pushed later, <b>${moves.back}</b> pulled earlier.` }));
    out.push(mv);
  }

  return out;
}

/* ---------- section + kpi helpers ---------- */
function card(titleText, hint, chartNode, extraCls = "") {
  const c = el("div.ins-card" + (extraCls ? "." + extraCls : ""));
  const head = el("div.ins-card-head");
  head.append(el("h3", { text: titleText }));
  if (hint) head.append(el("p.ins-hint", { text: hint }));
  c.append(head, chartNode);
  // label the SVG for assistive tech (the visible heading names it)
  const svg = chartNode.querySelector && chartNode.querySelector("svg");
  if (svg && !svg.getAttribute("aria-label")) svg.setAttribute("aria-label", titleText + (hint ? ". " + hint : ""));
  return c;
}
function kpi(k, v, sub, tone) {
  const box = el("div.kpi" + (tone ? ".t-" + tone : ""));
  box.append(el("div.k", { text: k }));
  const val = el("div.v", { text: v });
  if (sub) val.append(el("small", { text: " " + sub }));
  box.append(val);
  return box;
}
function momentumSub(delta) {
  if (!delta) return "same as last week";
  return `${delta > 0 ? "▲" : "▼"} ${fmtMins(Math.abs(delta))} vs last week`;
}
function pill(ico, strong, label) {
  const p = el("div.ins-pill");
  p.append(el("span.ip-ico", { text: ico }), el("b", { text: strong }), el("span.ip-lbl", { text: label }));
  return p;
}

/** Best-day / active-day highlights from the completion effort map. */
function highlights(effort) {
  let activeDays = 0, totalMins = 0, best = { date: null, mins: 0 };
  for (const [date, e] of effort) {
    if (e.tasks <= 0) continue;
    const m = e.req + e.bonus;
    activeDays++; totalMins += m;
    if (m > best.mins) best = { date, mins: m };
  }
  return { activeDays, avgActive: activeDays ? Math.round(totalMins / activeDays) : 0, best };
}
/** The category with the most completed required leaves. */
function topCategory(rl) {
  const by = new Map();
  for (const l of rl) if (l.done) by.set(l.cat, (by.get(l.cat) || 0) + 1);
  let top = null;
  for (const [cat, n] of by) if (!top || n > top.n) top = { cat, n };
  return top;
}

/* ---------- individual charts ---------- */
function burnupChart(bu, scope) {
  const xLabelFor = ix => {
    const d = addDays(bu.first, clamp(ix, 0, bu.N));
    return `${fmtDateHuman(d)}, ${d.slice(0, 4)}`;
  };
  return lineChart({
    xMax: bu.N, yMax: 100, todayX: bu.todayIdx, xTicks: bu.xTicks,
    xLabelFor, height: 330, axisFont: 12,
    series: [
      { name: "Actual", color: "var(--accent)", points: bu.actual, fill: true, w: 3.2 },
      { name: "Original", color: "var(--text-2)", points: bu.original, w: 2.4 },
      { name: "On-time", color: "var(--ontime)", points: bu.ontime, w: 2.4 },
      { name: "Planned", color: "var(--info)", points: bu.planned, dashed: true, faint: true, w: 2 },
    ],
  });
}

/** Daily-effort card with a 30/45/90-day range toggle that repaints just its chart. */
function effortCard(effort, today) {
  const c = el("div.ins-card");
  const head = el("div.ins-card-head.with-ctrl");
  const tw = el("div");
  tw.append(el("h3", { text: "Daily effort" }));
  tw.append(el("p.ins-hint", { text: "Minutes of work completed each day (required + bonus)." }));
  const seg = el("div.seg", { role: "group", "aria-label": "Range" });
  const holder = el("div.chart-hold");
  const draw = n => {
    holder.innerHTML = "";
    const ch = dailyEffortChart(effort, today, n);
    const svg = ch.querySelector("svg"); if (svg) svg.setAttribute("aria-label", `Daily effort, last ${n} days`);
    holder.append(ch);
  };
  [30, 45, 90].forEach((n, i) => {
    const b = el("button.seg-btn" + (i === 1 ? ".on" : ""), { type: "button", text: n + "d" });
    b.onclick = () => { [...seg.children].forEach(x => x.classList.toggle("on", x === b)); draw(n); };
    seg.append(b);
  });
  head.append(tw, seg);
  c.append(head, holder);
  draw(45);
  return c;
}

function dailyEffortChart(effort, today, days = 45) {
  const bars = [];
  let sum = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    const e = effort.get(d) || { req: 0, bonus: 0 };
    const total = e.req + e.bonus; sum += total;
    const dt = parseDate(d);
    bars.push({
      label: dt.getDate() === 1 || i === days - 1 ? MONTHS[dt.getMonth()].slice(0, 3) : (dt.getDay() === 1 ? String(dt.getDate()) : ""),
      title: `${fmtDateHuman(d)}: ${fmtMins(total)}${e.bonus ? ` (${fmtMins(e.bonus)} bonus)` : ""}`,
      segments: [
        { value: e.req, color: "var(--accent)", title: `${fmtDateHuman(d)}: ${fmtMins(e.req)} required` },
        { value: e.bonus, color: "var(--ok)", title: `${fmtDateHuman(d)}: ${fmtMins(e.bonus)} bonus` },
      ],
    });
  }
  const avg = sum / days;
  const c = barChart({ bars, avg, height: 240, barLabelEvery: 1, yFmt: v => v >= 60 ? Math.round(v / 60) + "h" : v + "m" });
  c.append(miniLegend([{ name: "Required", color: "var(--accent)" }, { name: "Bonus", color: "var(--ok)" }]));
  return c;
}

function punctualityChart(rl, today, maxWeeks = 20) {
  const byWeek = new Map();      // monday → {due, ontime}
  for (const l of rl) {
    if (l.origDate > today) continue;   // not due yet — can't count for/against on-time,
                                        // so it must not deflate the current week's rate
    const wk = mondayOf(l.origDate);
    let e = byWeek.get(wk); if (!e) { e = { due: 0, ontime: 0 }; byWeek.set(wk, e); }
    e.due++; if (l.done && l.doneDate && l.doneDate <= l.origDate) e.ontime++;
  }
  let weeks = [...byWeek.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1);
  if (weeks.length > maxWeeks) weeks = weeks.slice(weeks.length - maxWeeks);
  if (!weeks.length) return emptyChart("No due weeks yet.");
  const bars = weeks.map(([wk, e], i) => {
    const rate = pct(e.ontime, e.due);
    const dt = parseDate(wk);
    return {
      label: (i === 0 || dt.getDate() <= 7) ? `${MONTHS[dt.getMonth()].slice(0, 3)} ${dt.getDate()}` : "",
      value: rate, color: rate >= 80 ? "var(--ontime)" : rate >= 50 ? "var(--warn)" : "var(--bad)",
      title: `Week of ${fmtDateHuman(wk)}: ${e.ontime}/${e.due} on time (${rate}%)`,
    };
  });
  return barChart({ bars, yMax: 100, height: 240, barLabelEvery: 1, yFmt: v => v + "%", gridTicks: 4 });
}

function weekdayChart(leaves) {
  const mins = [0, 0, 0, 0, 0, 0, 0], cnt = [0, 0, 0, 0, 0, 0, 0];   // Mon..Sun
  for (const l of leaves) {
    if (!l.doneDate) continue;
    const wd = (parseDate(l.doneDate).getDay() + 6) % 7;             // Mon=0
    mins[wd] += l.est; cnt[wd]++;
  }
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bars = labels.map((lb, i) => ({
    label: lb, value: mins[i], color: "var(--accent)",
    title: `${lb}: ${fmtMins(mins[i])} across ${cnt[i]} task${cnt[i] === 1 ? "" : "s"}`,
  }));
  if (!mins.some(m => m > 0)) return emptyChart("No completed work yet.");
  return barChart({ bars, height: 240, barLabelEvery: 1, yFmt: v => v >= 60 ? Math.round(v / 60) + "h" : v + "m" });
}

function categoryChart(rl) {
  const by = new Map();
  for (const l of rl) if (l.done) by.set(l.cat, (by.get(l.cat) || 0) + 1);
  const slices = [...by.entries()].sort((a, b) => b[1] - a[1])
    .map(([cat, n]) => ({ label: capital(cat), value: n, color: catColor(cat) }));
  const total = slices.reduce((a, s) => a + s.value, 0);
  if (!total) return emptyChart("No completed tasks yet.");
  return donut({ slices, thickness: 24, size: 200, centerTop: String(total), centerBottom: "done" });
}

function objectiveBars(scope) {
  const rm = getRoadmap(scope); if (!rm) return emptyChart("—");
  const s = computeAll(rm);
  const rows = s.objectives
    .filter(o => o.actual.total > 0)
    .map(o => ({
      label: o.title, value: o.actual.pct,
      color: (rm.objById.get(o.id) && rm.objById.get(o.id).color) || (o.tier === "secondary" ? "var(--text-3)" : "var(--accent)"),
      sub: `${o.actual.done}/${o.actual.total} · ${o.ontime.pct}% on time`,
    }));
  return rows.length ? hbars(rows) : emptyChart("No objectives with tasks.");
}

function roadmapBars() {
  const rows = [];
  for (const rm of getRoadmaps()) {
    let s; try { s = computeAll(rm); } catch { continue; }
    rows.push({
      label: `${rm.icon} ${rm.title}`, value: s.overall.actual.pct,
      color: rm.accent || "var(--accent)",
      sub: `${s.overall.actual.done}/${s.overall.actual.total} · ${s.overall.ontime.pct}% on time`,
    });
  }
  return rows.length ? hbars(rows) : emptyChart("No roadmaps.");
}

function miniLegend(items) {
  const box = el("div.chart-legend");
  for (const it of items) {
    const key = el("span.lg-key");
    const sw = el("i"); sw.style.background = it.color;
    key.append(sw, el("span", { text: it.name }));
    box.append(key);
  }
  return box;
}
function emptyChart(msg) { return el("div.chart-empty", { text: msg }); }
const capital = s => s ? s[0].toUpperCase() + s.slice(1) : s;
