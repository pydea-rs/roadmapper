// horizon.js — "Horizon" (#/horizon): every day ahead, across every roadmap, as one
// timetable. Rows are dates (a slim "free" row stands in for days with nothing planned),
// columns are roadmaps, and each cell holds that roadmap's day as a ticket of bricks
// (atlas.js) — tickable in place, with the day lens for detail.
//
// Above the list, a sticky SKYLINE draws the whole journey as one waveform: a column
// per date, stacked by roadmap and as tall as the day's planned minutes. A window on it
// tracks what the list is showing; press or drag anywhere on it to travel there.
//
// Minutes are REQUIRED work only (bonus never loads a day), measured against the owner's
// daily ceiling for that date: ~4h when one or two roadmaps share it, 6h for three or more.

import { getRoadmaps } from "./registry.js";
import { dailyBudget, taskProgress } from "./stats.js";
import { placement, slotMinutes, brick, openDayLens, refreshLens } from "./atlas.js";
import { openDayMenu } from "./daymenu.js";
import { getSettings } from "./ui.js";
import { el, fmtMins, todayStr, fmtDateHuman, relDay, addDays, daysBetween, parseDate, DOW, MONTHS } from "./util.js";

/* ================================================================== *
 *  Model (pure: roadmaps + journey state → dates)
 * ================================================================== */

/**
 * Every date with work on it, in order:
 *   { date, entries:[{ rm, slot, mins, doneMins, tasks, tasksDone }], mins, doneMins,
 *     tasks, tasksDone, roadmaps, cap }
 * A task counts on the day it currently lives on and at its card's effective date.
 */
export function buildHorizon(roadmaps = getRoadmaps()) {
  const order = new Map(roadmaps.map((r, i) => [r.slug, i]));
  const byDate = new Map();
  for (const rm of roadmaps) for (const slot of placement(rm).values()) {
    if (!slot.required.length && !slot.bonus.length) continue;
    const m = slotMinutes(rm.slug, slot);
    const entry = { rm, slot, mins: m.mins, doneMins: m.done, tasks: slot.required.length,
      tasksDone: slot.required.filter(t => taskProgress(rm.slug, t).complete).length };
    if (!byDate.has(slot.date)) byDate.set(slot.date, []);
    byDate.get(slot.date).push(entry);
  }
  return [...byDate.keys()].sort().map(date => {
    const entries = byDate.get(date).sort((a, b) => order.get(a.rm.slug) - order.get(b.rm.slug));
    const sum = k => entries.reduce((n, e) => n + e[k], 0);
    const roadmapsBusy = new Set(entries.filter(e => e.tasks > 0).map(e => e.rm.slug)).size;
    return { date, entries, mins: sum("mins"), doneMins: sum("doneMins"), tasks: sum("tasks"),
      tasksDone: sum("tasksDone"), roadmaps: roadmapsBusy, cap: dailyBudget(Math.max(1, roadmapsBusy)) };
  });
}

/** Interleave slim "free" rows for the calendar gaps between dates with work. */
export function withFreeDays(dates) {
  const rows = [];
  dates.forEach((d, i) => {
    if (i > 0) {
      const gap = daysBetween(dates[i - 1].date, d.date) - 1;
      if (gap > 0) rows.push({ free: true, from: addDays(dates[i - 1].date, 1), to: addDays(d.date, -1), n: gap });
    }
    rows.push(d);
  });
  return rows;
}

/** Totals for the dates in [from, to]. */
export function rangeLoad(dates, from, to) {
  let mins = 0, left = 0, tasks = 0, days = 0;
  for (const d of dates) if (d.date >= from && d.date <= to) {
    days++; mins += d.mins; left += d.mins - d.doneMins; tasks += d.tasks - d.tasksDone;
  }
  return { mins, left, tasks, days };
}

/* ================================================================== *
 *  View
 * ================================================================== */
const HIDDEN_KEY = "roadmaps_horizon_hidden";
const DENSITY_KEY = "roadmaps_horizon_density";
let showPast = false;
let scrollOff = null;                 // detaches the live #main scroll listener of the last draw

const readJSON = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); } catch {} };
const density = () => { try { return localStorage.getItem(DENSITY_KEY) === "compact" ? "compact" : "detailed"; } catch { return "detailed"; } };
const shortDate = s => { const d = parseDate(s); return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`; };
const motionOK = () => document.documentElement.getAttribute("data-motion") !== "off"
  && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

export function renderHorizon(mount) {
  // a fresh visit starts at today; a repaint of the open view keeps "earlier days" open
  if (!mount.querySelector(".hz")) showPast = false;
  draw(mount);
}

function draw(mount) {
  const today = todayStr();
  const all = getRoadmaps();
  let hidden = readJSON(HIDDEN_KEY, []);
  if (!Array.isArray(hidden)) hidden = [];
  hidden = hidden.filter(s => all.some(r => r.slug === s));
  if (hidden.length >= all.length) hidden = [];         // never hide every lane
  const lanes = all.filter(r => !hidden.includes(r.slug));

  const dates = buildHorizon(lanes);
  const rows = withFreeDays(dates);
  const future = rows.some(r => (r.free ? r.to : r.date) >= today);
  if (!future) showPast = true;                          // the plan is all behind: show it
  const pastRows = rows.filter(r => (r.free ? r.to : r.date) < today);
  const overdue = dates.filter(d => d.date < today).reduce((n, d) => n + d.tasks - d.tasksDone, 0);

  if (scrollOff) { scrollOff(); scrollOff = null; }
  mount.classList.add("wide");
  mount.innerHTML = "";
  const view = el("div.hz" + (density() === "compact" ? ".compact" : ""), { style: `--lanes:${lanes.length}` });

  /* hero + look-ahead */
  const hero = el("div.hero.hz-hero");
  const top = el("div.hero-top");
  top.append(el("div.hero-ico", { text: "🔭" }));
  const tb = el("div");
  tb.append(el("h1", { text: "Horizon" }));
  tb.append(el("p.sub", { text: "Every day ahead, across all your roadmaps — see what's coming, plan around the busy days, tick things off right here." }));
  top.append(tb);
  hero.append(top);
  view.append(hero);

  if (!dates.length) {
    view.append(el("div.center-note", {}, el("div.big", { text: "🔭" }), "Nothing is planned yet."));
    mount.append(view);
    return;
  }

  view.append(lookAhead(mount, dates, today));
  view.append(controls(mount, all, hidden, today));

  /* sticky head: the skyline + lane titles stay in view while the days scroll */
  const head = el("div.hz-head");
  const sky = skyline(mount, dates, today);
  head.append(sky.node);
  const lh = el("div.hz-lanes-head", { "aria-hidden": "true" });
  lh.append(el("span.hz-lh-gutter"));
  for (const rm of lanes) {
    const c = el("span.hz-lh", { style: accentVars(rm) });
    c.append(el("i"), el("span.hz-lh-ico", { text: rm.icon }), el("span.hz-lh-t", { text: rm.title }));
    lh.append(c);
  }
  head.append(lh);
  view.append(head);

  /* the list */
  const list = el("div.hz-list");
  if (pastRows.length && future) {
    const t = el("button.hz-past-toggle" + (showPast ? ".on" : ""), { type: "button" });
    const days = pastRows.reduce((n, r) => n + (r.free ? r.n : 1), 0);
    t.append(el("span", { text: showPast ? "Hide earlier days" : `Show ${days} earlier day${days === 1 ? "" : "s"}` }));
    if (overdue) t.append(el("span.hz-od", { text: `${overdue} unfinished` }));
    t.addEventListener("click", () => togglePast(mount));
    list.append(t);
  }
  const frame = dates[0].date;                          // week i = frame + 7i (the plan's shared frame)
  let lastWeek = null;
  for (const r of rows) {
    const end = r.free ? r.to : r.date;
    if (!showPast && end < today) continue;
    const start = r.free ? r.from : r.date;
    const wk = Math.floor(daysBetween(frame, start < today && !showPast ? today : start) / 7);
    if (wk !== lastWeek) { list.append(weekRule(dates, frame, wk, lanes)); lastWeek = wk; }
    list.append(r.free ? freeRow(r, today) : dayRow(mount, r, lanes, today));
  }
  view.append(list);
  mount.append(view);

  sky.wire(view, list, head);
  refreshLens();
}

function redraw(mount) {
  const main = document.getElementById("main");
  const topPx = main ? main.scrollTop : 0;
  draw(mount);                                          // (draw re-anchors an open lens)
  if (main) main.scrollTop = topPx;
}

/* Show/hide the days already behind, keeping today's row where it was on screen. */
function togglePast(mount) {
  const main = document.getElementById("main");
  const probe = () => { const n = mount.querySelector(".hz-day.today, .hz-day.ahead, .hz-free.ahead"); return n ? n.getBoundingClientRect().top : null; };
  const before = probe();
  showPast = !showPast;
  const topPx = main ? main.scrollTop : 0;
  draw(mount);
  if (!main) return;
  main.scrollTop = topPx;
  const after = probe();
  if (before != null && after != null) main.scrollTop += after - before;
}

/* ---- the "what's coming" strip ---- */
function lookAhead(mount, dates, today) {
  const strip = el("div.hz-ahead");
  const stat = (k, v, sub, onClick) => {
    const node = el(onClick ? "button.hz-stat.link" : "div.hz-stat", onClick ? { type: "button" } : null);
    node.append(el("span.hz-stat-k", { text: k }), el("span.hz-stat-v", { text: v }), el("span.hz-stat-s", { text: sub }));
    if (onClick) node.addEventListener("click", onClick);
    return node;
  };
  const w = rangeLoad(dates, today, addDays(today, 6));
  const m = rangeLoad(dates, today, addDays(today, 29));
  strip.append(stat("Next 7 days", fmtMins(w.left), `${w.tasks} task${w.tasks === 1 ? "" : "s"} left · ${w.days} day${w.days === 1 ? "" : "s"} of work`));
  strip.append(stat("Next 30 days", fmtMins(m.left), `${m.tasks} task${m.tasks === 1 ? "" : "s"} left · ${m.days} day${m.days === 1 ? "" : "s"} of work`));
  const ahead = dates.filter(d => d.date >= today);
  if (ahead.length) {
    const busiest = ahead.reduce((a, b) => (b.mins > a.mins ? b : a));
    strip.append(stat("Busiest day ahead", fmtMins(busiest.mins), `${fmtDateHuman(busiest.date)} · ${busiest.roadmaps} roadmap${busiest.roadmaps === 1 ? "" : "s"}`,
      () => jumpTo(mount, busiest.date, true)));
    const lastWork = ahead[ahead.length - 1].date;
    const span = Math.min(30, daysBetween(today, lastWork) + 1);
    const worked = new Set(ahead.map(d => d.date));
    let free = 0;
    for (let i = 0; i < span; i++) if (!worked.has(addDays(today, i))) free++;
    strip.append(stat("Free days", String(free), `in the next ${span} day${span === 1 ? "" : "s"}`));
  } else {
    strip.append(stat("Ahead", "—", "every planned day is behind you"));
  }
  return strip;
}

/* ---- skyline: the whole journey as one navigable waveform ---- */
function skyline(mount, dates, today) {
  const first = dates[0].date, last = dates[dates.length - 1].date;
  const span = daysBetween(first, last) + 1;
  const idx = s => daysBetween(first, s);
  const pctOf = i => `${(Math.max(0, Math.min(span, i)) / span) * 100}%`;
  const peak = Math.max(60, ...dates.map(d => d.mins));

  const node = el("div.sky", { tabindex: "0", role: "slider", "aria-label": "Journey timeline — press or drag to jump to a date; arrow keys step a week",
    "aria-valuemin": "0", "aria-valuemax": String(span - 1), "aria-valuenow": String(Math.max(0, Math.min(span - 1, idx(today)))) });
  const cols = el("div.sky-cols", { style: `--span:${span}` });
  for (const d of dates) {
    const col = el("span.sky-col" + (d.date < today ? ".past" : d.date === today ? ".today" : ""),
      { style: `grid-column:${idx(d.date) + 1};--h:${Math.round((d.mins / peak) * 100)}%` });
    for (const e of d.entries) if (e.mins) col.append(el("i", { style: `flex:${e.mins} 1 0;${accentVars(e.rm)}` }));
    cols.append(col);
  }
  node.append(cols);
  // month ticks
  const ticks = el("div.sky-ticks", { "aria-hidden": "true" });
  const f = parseDate(first);
  let m = new Date(f.getFullYear(), f.getMonth() + 1, 1);
  const mk = s => ticks.append(el("span.sky-tick", { style: `left:${pctOf(idx(s))}`, text: MONTHS[parseDate(s).getMonth()].slice(0, 3) }));
  mk(first);
  for (;;) {
    const s = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}-01`;
    if (s > last) break;
    if (idx(s) / span > 0.04) mk(s);
    m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
  }
  node.append(ticks);
  if (today >= first && today <= last) node.append(el("span.sky-now", { style: `left:${pctOf(idx(today) + 0.5)}`, title: "Today" }));
  const win = el("span.sky-win", { "aria-hidden": "true" });
  node.append(win);
  const tip = el("span.sky-tip", { "aria-hidden": "true" });
  node.append(tip);

  const byDate = new Map(dates.map(d => [d.date, d]));
  const dateAt = clientX => {
    const r = node.getBoundingClientRect();
    const i = r.width ? Math.floor(((clientX - r.left) / r.width) * span) : 0;
    return addDays(first, Math.max(0, Math.min(span - 1, i)));
  };
  const showTip = clientX => {
    const s = dateAt(clientX);
    const d = byDate.get(s);
    const r = node.getBoundingClientRect();
    tip.textContent = `${fmtDateHuman(s)} · ${d ? fmtMins(d.mins) + " · " + d.entries.map(e => e.rm.icon).join(" ") : "free"}`;
    tip.style.left = `${Math.max(0, Math.min(r.width, clientX - r.left))}px`;
    node.classList.add("tipping");
  };

  let dragging = false;
  node.addEventListener("pointerdown", e => {
    dragging = true;
    node.classList.add("dragging");
    try { node.setPointerCapture(e.pointerId); } catch {}
    showTip(e.clientX);
    jumpTo(mount, dateAt(e.clientX), false);
  });
  node.addEventListener("pointermove", e => {
    showTip(e.clientX);
    if (dragging) jumpTo(mount, dateAt(e.clientX), false);
  });
  const end = () => { dragging = false; node.classList.remove("dragging"); };
  node.addEventListener("pointerup", end);
  node.addEventListener("pointercancel", end);
  node.addEventListener("pointerleave", () => { if (!dragging) node.classList.remove("tipping"); });
  node.addEventListener("keydown", e => {
    const step = { ArrowRight: 7, ArrowLeft: -7, PageDown: 30, PageUp: -30 }[e.key];
    if (e.key === "Home") { e.preventDefault(); jumpTo(mount, today >= first && today <= last ? today : first, true); return; }
    if (!step) return;
    e.preventDefault();
    const cur = node.dataset.at || today;
    const next = addDays(cur < first ? first : cur > last ? last : cur, step);
    jumpTo(mount, next < first ? first : next > last ? last : next, true);
  });

  /* keep the window in step with the list */
  const wire = (view, list, head) => {
    const main = document.getElementById("main");
    if (!main) return;
    let queued = false;
    const sync = () => {
      queued = false;
      if (!view.isConnected) { detach(); return; }
      const rowsEls = list.querySelectorAll("[data-from]");
      if (!rowsEls.length) return;
      const mr = main.getBoundingClientRect();
      const stuck = mr.top + stickyTop(head) + head.offsetHeight;
      const a = firstBelow(rowsEls, stuck), b = firstBelow(rowsEls, mr.bottom);
      const from = rowsEls[a].dataset.from;
      const to = rowsEls[Math.max(a, b - 1)].dataset.to;
      node.dataset.at = from;
      node.setAttribute("aria-valuenow", String(Math.max(0, Math.min(span - 1, idx(from)))));
      node.setAttribute("aria-valuetext", `${fmtDateHuman(from)} to ${fmtDateHuman(to)}`);
      win.style.left = pctOf(idx(from));
      win.style.width = `${(Math.max(1, idx(to) - idx(from) + 1) / span) * 100}%`;
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(sync); } };
    const detach = () => { main.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
    main.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    scrollOff = detach;
    sync();
  };
  return { node, wire };
}

/* Index of the first row whose bottom edge is below y (rows are in screen order). */
function firstBelow(rows, y) {
  let lo = 0, hi = rows.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (rows[mid].getBoundingClientRect().bottom > y) hi = mid; else lo = mid + 1;
  }
  return Math.min(lo, rows.length - 1);
}
const stickyTop = n => { try { return parseFloat(getComputedStyle(n).top) || 0; } catch { return 0; } };

/** Scroll the list so the row holding `date` (or the next one) sits under the head. */
export function jumpTo(mount, date, smooth) {
  const main = document.getElementById("main");
  if (!main) return;
  const today = todayStr();
  if (date < today && !showPast && mount.querySelector(".hz-past-toggle")) { togglePast(mount); }
  const rowsEls = [...mount.querySelectorAll(".hz-list [data-from]")];
  if (!rowsEls.length) return;
  const row = rowsEls.find(r => r.dataset.to >= date) || rowsEls[rowsEls.length - 1];
  const head = mount.querySelector(".hz-head");
  const mr = main.getBoundingClientRect();
  const stuck = mr.top + (head ? stickyTop(head) + head.offsetHeight : 0);
  // a week rule right above the row travels with it, so the row keeps its context
  const prev = row.previousElementSibling;
  const target = prev && prev.classList.contains("hz-week") ? prev : row;
  const top = main.scrollTop + target.getBoundingClientRect().top - stuck - 6;
  main.scrollTo({ top: Math.max(0, top), behavior: smooth && motionOK() ? "smooth" : "auto" });
}

/* ---- controls: lanes, density, today ---- */
function controls(mount, all, hidden, today) {
  const bar = el("div.hz-controls");
  const chips = el("div.hz-lanes", { role: "group", "aria-label": "Roadmaps shown" });
  for (const rm of all) {
    const on = !hidden.includes(rm.slug);
    const b = el("button.hz-lane" + (on ? ".on" : ""), { type: "button", "aria-pressed": on ? "true" : "false",
      title: on ? `Hide ${rm.title}` : `Show ${rm.title}`, style: accentVars(rm) });
    b.append(el("i"), el("span.hz-lane-ico", { text: rm.icon }), el("span.hz-lane-t", { text: rm.title }));
    b.addEventListener("click", () => {
      const next = on ? [...hidden, rm.slug] : hidden.filter(s => s !== rm.slug);
      if (next.length >= all.length) return;                    // keep at least one lane
      write(HIDDEN_KEY, next);
      redraw(mount);
    });
    chips.append(b);
  }
  bar.append(chips);

  const right = el("div.hz-ctl-right");
  const seg = el("div.seg.hz-density", { role: "group", "aria-label": "Row density" });
  for (const [val, label] of [["detailed", "Detailed"], ["compact", "Compact"]]) {
    const b = el("button", { type: "button", "aria-pressed": density() === val ? "true" : "false", text: label });
    b.addEventListener("click", () => { if (density() !== val) { write(DENSITY_KEY, val); redraw(mount); } });
    seg.append(b);
  }
  right.append(seg);
  const t = el("button.btn.sm.hz-today", { type: "button", text: "Today" });
  t.addEventListener("click", () => jumpTo(mount, today, true));
  right.append(t);
  bar.append(right);
  return bar;
}

/* ---- rows ---- */
function weekRule(dates, frame, wk, lanes) {
  const start = addDays(frame, wk * 7), end = addDays(start, 6);
  const inWeek = dates.filter(d => d.date >= start && d.date <= end);
  const mins = inWeek.reduce((n, d) => n + d.mins, 0);
  const rule = el("div.hz-week");
  rule.append(el("span.hz-week-no", { text: `Week ${wk + 1}` }));
  rule.append(el("span.hz-week-range", { text: `${shortDate(start)} – ${shortDate(end)}` }));
  const mix = el("span.hz-week-mix", { "aria-hidden": "true" });
  for (const rm of lanes) {
    const m = inWeek.reduce((n, d) => n + d.entries.filter(e => e.rm === rm).reduce((a, e) => a + e.mins, 0), 0);
    if (m) mix.append(el("i", { style: `flex:${m} 1 0;${accentVars(rm)}`, title: `${rm.title} · ${fmtMins(m)}` }));
  }
  rule.append(mix);
  rule.append(el("span.hz-week-sum", { text: `${fmtMins(mins)} planned · ${inWeek.length} day${inWeek.length === 1 ? "" : "s"} of work` }));
  return rule;
}

function freeRow(r, today) {
  const ahead = r.to >= today;
  const label = r.n === 1 ? `${fmtDateHuman(r.from)}` : `${fmtDateHuman(r.from)} – ${fmtDateHuman(r.to)}`;
  const row = el("div.hz-free" + (ahead ? ".ahead" : ".past") + (r.from <= today && today <= r.to ? ".today" : ""),
    { dataset: { from: r.from, to: r.to } });
  row.append(el("span.hz-free-dot", { "aria-hidden": "true" }));
  row.append(el("span.hz-free-t", { text: r.n === 1 ? "Free day" : `${r.n} free days` }));
  row.append(el("span.hz-free-d", { text: label }));
  if (r.from <= today && today <= r.to) row.append(el("span.hz-free-now", { text: "Today" }));
  return row;
}

function dayRow(mount, d, lanes, today) {
  const isToday = d.date === today, isPast = d.date < today;
  const dt = parseDate(d.date);
  const row = el("div.hz-day" + (isToday ? ".today" : isPast ? ".past" : ".ahead") +
    (d.tasks && d.tasksDone === d.tasks ? ".complete" : ""), { dataset: { from: d.date, to: d.date } });

  const when = el("div.hz-when");
  const date = el("div.hz-date");
  date.append(el("b.hz-dnum", { text: String(dt.getDate()) }));
  const dm = el("span.hz-dm");
  dm.append(el("span.hz-dow", { text: DOW[dt.getDay()] }), el("span.hz-mon", { text: MONTHS[dt.getMonth()].slice(0, 3) }));
  date.append(dm);
  when.append(date);
  when.append(el("span.hz-rel", { text: relDay(d.date) }));
  const ratio = d.cap ? d.mins / d.cap : 0;
  const gauge = el("div.hz-gauge" + (ratio > 1 ? ".over" : ratio >= 0.95 ? ".full" : ""),
    { title: `${fmtMins(d.mins)} planned of a ~${fmtMins(d.cap)} day · ${fmtMins(d.doneMins)} done` });
  const track = el("span.hz-gauge-track");
  track.append(el("i.plan", { style: `width:${Math.min(100, Math.round(ratio * 100))}%` }));
  track.append(el("i.done", { style: `width:${d.cap ? Math.min(100, Math.round((d.doneMins / d.cap) * 100)) : 0}%` }));
  gauge.append(track);
  gauge.append(el("span.hz-gauge-t", { text: `${fmtMins(d.mins)} / ${fmtMins(d.cap)}` }));
  when.append(gauge);
  row.append(when);

  for (const rm of lanes) {
    const here = d.entries.filter(e => e.rm === rm);
    const cell = el("div.hz-cell" + (here.length ? "" : ".empty"), { dataset: { lane: rm.slug } });
    for (const e of here) cell.append(ticket(mount, e, isPast));
    row.append(cell);
  }
  return row;
}

function ticket(mount, e, isPast) {
  const { rm, slot } = e;
  const day = slot.day;
  const key = `${rm.slug}/${day.id}`;
  const complete = e.tasks > 0 && e.tasksDone === e.tasks;
  const node = el("div.hz-ticket" + (complete ? ".complete" : ""), { dataset: { ticket: key, lensOpen: "" }, style: accentVars(rm) });
  const open = focusTaskId => openDayLens(rm, slot, {
    anchorSel: `.hz [data-ticket="${key}"]`, focusTaskId, onChange: () => redraw(mount),
    openLabel: `Open in ${rm.title}`, onOpenDay: () => { location.hash = `#/${rm.slug}/${day.id}`; },
  });
  const head = el("button.hz-thead", { type: "button", title: `${rm.title} — ${day.title}`,
    "aria-label": `${rm.title}: ${day.title}. ${e.tasksDone} of ${e.tasks} tasks done. Show the day` });
  head.append(el("span.hz-tico", { text: rm.icon }), el("span.hz-ttitle", { text: day.title }),
    el("span.hz-tcount", { text: e.tasks ? `${e.tasksDone}/${e.tasks}` : "bonus" }));
  head.addEventListener("click", () => open(null));
  head.addEventListener("contextmenu", ev => openDayMenu(rm, day, ev, () => redraw(mount)));
  node.append(head);
  const stack = el("div.hz-bricks");
  for (const t of slot.required) stack.append(brick(rm, t, { hostId: day.id, overdue: isPast,
    onOpen: task => open(task.id), onChange: () => redraw(mount) }));
  for (const t of slot.bonus) stack.append(brick(rm, t, { hostId: day.id,
    onOpen: task => open(task.id), onChange: () => redraw(mount) }));
  node.append(stack);
  return node;
}

/* A roadmap's identity colour, unless the owner turned roadmap colours off. */
function accentVars(rm) {
  if (getSettings().roadmapAccent === "off" || !rm.accent) return "";
  return `--accent:${rm.accent};--accent-soft:color-mix(in srgb, ${rm.accent} 15%, transparent);--accent-ink:color-mix(in srgb, ${rm.accent}, white 20%)`;
}
