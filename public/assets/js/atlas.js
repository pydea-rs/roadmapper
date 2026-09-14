// atlas.js — the compact, see-everything layouts and the pieces they share.
//
//   placement(rm)  where every task sits NOW: task moves and re-dated day cards applied,
//                  so a compact view never disagrees with the full timeline.
//   brick()        one task drawn as a block. Its HEIGHT follows its minutes and its FILL
//                  rises as its sub-tasks are ticked, so a whole week reads at a glance:
//                  tall = long, full = done, half-full = in progress.
//   openDayLens()  the "lens": a floating panel with one day's complete task list, where
//                  everything stays tickable (and movable) without leaving the overview.
//   atlasBoard()   a roadmap's Atlas: one plate per week, the week's days side by side,
//                  each day a column of bricks.
//
// The Horizon view (horizon.js) lays the same bricks and lens out across every roadmap.

import * as store from "./store.js";
import { currentDay, carriedFrom, dayDate, taskProgress } from "./stats.js";
import { makeDraggable, installDayDrop, openMovePicker } from "./moves.js";
import { openDayMenu } from "./daymenu.js";
import { checkIcon, getSettings } from "./ui.js";
import { el, fmtMins, todayStr, fmtDateHuman, relDay, addDays, monthLabel, parseDate, DOW, MONTHS } from "./util.js";

/* ================================================================== *
 *  Model
 * ================================================================== */

/** Map dayId → { day, date, required[], bonus[] } with every task on the day it
 *  CURRENTLY lives on (a moved task leaves its origin), `date` being the card's
 *  effective date. Natives come before tasks moved in, each in authored order. */
export function placement(rm) {
  const slug = rm.slug;
  const slots = new Map(rm.days.map(d => [d.id, { day: d, date: dayDate(rm, slug, d), required: [], bonus: [] }]));
  for (const d of rm.days) for (const t of d.tasks) {
    const slot = slots.get(currentDay(rm, slug, t)) || slots.get(d.id);
    (t.optional ? slot.bonus : slot.required).push(t);
  }
  const native = (slot, t) => (t.day === slot.day.id ? 0 : 1);
  for (const slot of slots.values()) slot.required.sort((a, b) => native(slot, a) - native(slot, b));
  return slots;
}

/** Required minutes on a slot, and how many of them are already done (leaf-level). */
export function slotMinutes(slug, slot) {
  let mins = 0, done = 0;
  for (const t of slot.required) for (const leaf of (t.subs || [t])) {
    const est = leaf.est || 0;
    mins += est;
    if (store.isDone(slug, leaf.id)) done += est;
  }
  return { mins, done };
}

/** A brick's height in px: grows with the task's minutes, inside readable bounds. */
export const brickHeight = (est, parts = false) =>
  Math.round(Math.min(104, Math.max(parts ? 34 : 26, 16 + (parts ? 6 : 0) + (est || 0) * 0.46)));

// Authored labels are trusted HTML ("Mutex&lt;T&gt;", <code>, links). A brick shows
// them as plain text: parse in an inert <template> (nothing loads or runs there).
const plainCache = new Map();
export function plainText(html) {
  const key = String(html || "");
  let v = plainCache.get(key);
  if (v === undefined) {
    const tpl = document.createElement("template");
    tpl.innerHTML = key;
    v = tpl.content.textContent.replace(/\s+/g, " ").trim();
    if (plainCache.size > 5000) plainCache.clear();
    plainCache.set(key, v);
  }
  return v;
}

/** Tick or clear every leaf of a task at once (a parent has no state of its own). */
export function setTaskDone(slug, task, done) {
  for (const leaf of (task.subs || [task])) store.setTask(slug, leaf.id, done);
}

const shortDate = s => { const d = parseDate(s); return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`; };

/* ================================================================== *
 *  Brick
 * ================================================================== */
let justTicked = null;                 // { slug, id, from } — the brick whose fill animates on the next paint

/**
 * One task as a block.
 * opts: { hostId, overdue, dim, onOpen(task), onChange(), draggable }
 */
export function brick(rm, task, opts = {}) {
  const slug = rm.slug;
  const p = taskProgress(slug, task);
  const cat = task.cat || "alt";
  const label = plainText(task.lead || task.label);
  const h = task.optional ? 24 : brickHeight(task.est, !!task.subs);
  const lines = Math.max(1, Math.floor((h - 10 - (task.subs ? 7 : 0)) / 13));
  const movedIn = !!opts.hostId && task.day !== opts.hostId;
  const state = p.complete ? "done" : p.partial ? `${p.done} of ${p.total} parts done` : "not started";

  const ticked = justTicked && justTicked.slug === slug && justTicked.id === task.id ? justTicked : null;
  if (ticked) justTicked = null;
  const b = el("div.brick" + (ticked ? ".ticked" : "") + (p.complete ? ".done" : p.partial ? ".partial" : "") +
    (task.optional ? ".bonus" : "") + (movedIn ? ".moved-in" : "") +
    (opts.overdue && !p.complete ? ".overdue" : "") + (opts.dim ? ".dim" : ""), {
    dataset: { task: task.id, cat },
    style: `--h:${h}px;--fill:${p.complete ? 100 : p.pct}%;--est:${Math.max(10, task.est || 0)};` +
      (ticked ? `--from:${ticked.from}%;` : "") +
      `--lines:${lines};--chip:var(--cat-${cat}, var(--cat-alt))`,
  });

  const carried = carriedFrom(rm, task);
  const main = el("button.brick-main", { type: "button",
    title: `${label}${task.est ? " · " + fmtMins(task.est) : ""}${movedIn ? " · moved in" : ""}${carried ? ` · carried over from “${carried.title}”` : ""}`,
    "aria-label": `${label}. ${task.est ? fmtMins(task.est) + ", " : ""}${state}. Show the day` });
  main.append(el("span.brick-label", { text: (movedIn ? "↩ " : "") + (task.optional ? "★ " : "") + label }));
  if (task.subs) {
    const pips = el("span.brick-pips", { "aria-hidden": "true" });
    for (const s of task.subs) pips.append(el("i" + (store.isDone(slug, s.id) ? ".on" : "")));
    main.append(pips);
  }
  main.addEventListener("click", () => opts.onOpen && opts.onOpen(task));
  b.append(main);

  const tick = el("button.brick-tick", { type: "button", role: "checkbox",
    "aria-checked": p.complete ? "true" : p.partial ? "mixed" : "false",
    "aria-label": p.complete ? `Mark “${label}” not done` : `Mark “${label}” done`, html: checkIcon() });
  tick.addEventListener("click", e => {
    e.stopPropagation();
    justTicked = { slug, id: task.id, from: p.complete ? 100 : p.pct };   // the repaint animates the fill from here
    setTaskDone(slug, task, !p.complete);
    opts.onChange && opts.onChange();
  });
  b.append(tick);

  if (opts.draggable && !task.optional) makeDraggable(b, b, task);
  return b;
}

/* ================================================================== *
 *  Lens — a floating day panel anchored to a column / ticket
 * ================================================================== */
let lens = null;     // { node, anchorSel, build, prevFocus }

export const isLensOpen = () => !!lens;

/**
 * Open (or re-target) the lens.
 *  anchorSel — a selector that finds the anchor again after the view repaints
 *  build(panel, api) — fills the panel; api.close()
 *  accent — the roadmap colour the panel wears
 */
export function openLens({ anchorSel, build, accent = null, label = "Day details" }) {
  const reuse = lens && lens.node.isConnected;
  if (!reuse) closeLens(true);
  const node = reuse ? lens.node : el("div.lens", { role: "dialog", "aria-label": label, tabindex: "-1" });
  if (!reuse) {
    lens = { node, prevFocus: document.activeElement };
    document.body.append(node);
    document.addEventListener("pointerdown", onLensDocDown, true);
    document.addEventListener("keydown", onLensKey);
    window.addEventListener("hashchange", onLensHash);
    window.addEventListener("resize", placeLensSoon);
    const main = document.getElementById("main");
    if (main) main.addEventListener("scroll", placeLensSoon, { passive: true });
  }
  node.setAttribute("aria-label", label);
  lens.anchorSel = anchorSel;
  lens.build = build;
  if (accent) {
    node.style.setProperty("--accent", accent);
    node.style.setProperty("--accent-soft", `color-mix(in srgb, ${accent} 15%, transparent)`);
    node.style.setProperty("--accent-ink", `color-mix(in srgb, ${accent}, white 20%)`);
  } else for (const p of ["--accent", "--accent-soft", "--accent-ink"]) node.style.removeProperty(p);
  drawLens(false);
  if (!reuse) requestAnimationFrame(() => { if (lens && lens.node === node) node.classList.add("in"); });
  try { node.focus({ preventScroll: true }); } catch { node.focus(); }
  return { close: closeLens };
}

function drawLens(keepScroll) {
  if (!lens) return;
  const { node } = lens;
  const top = keepScroll ? node.scrollTop : 0;
  node.innerHTML = "";
  lens.build(node, { close: closeLens });
  markAnchor();
  placeLens();
  node.scrollTop = top;
}

/** The view under the lens repainted: rebuild its content against the new state and
 *  re-anchor it; close it when its anchor no longer exists (e.g. filtered away). */
export function refreshLens() {
  if (!lens) return;
  if (!document.querySelector(lens.anchorSel)) { closeLens(true); return; }
  drawLens(true);
}

export function closeLens(silent = false) {
  if (!lens) return;
  const { node, anchorSel } = lens;
  // hand focus back to what opened the lens — or, when a repaint replaced that
  // element, to the same place in the new view
  let prevFocus = lens.prevFocus;
  if (!(prevFocus && prevFocus.isConnected)) {
    const a = anchorSel && document.querySelector(anchorSel);
    prevFocus = a && (a.matches("button") ? a : a.querySelector("button"));
  }
  lens = null;
  document.removeEventListener("pointerdown", onLensDocDown, true);
  document.removeEventListener("keydown", onLensKey);
  window.removeEventListener("hashchange", onLensHash);
  window.removeEventListener("resize", placeLensSoon);
  const main = document.getElementById("main");
  if (main) main.removeEventListener("scroll", placeLensSoon);
  document.querySelectorAll(".lens-anchor").forEach(n => n.classList.remove("lens-anchor"));
  node.classList.remove("in");
  node.classList.add("out");
  setTimeout(() => node.remove(), 160);
  if (!silent && prevFocus && prevFocus.isConnected && prevFocus.focus) {
    try { prevFocus.focus({ preventScroll: true }); } catch {}
  }
}

function markAnchor() {
  document.querySelectorAll(".lens-anchor").forEach(n => n.classList.remove("lens-anchor"));
  const a = lens && document.querySelector(lens.anchorSel);
  if (a) a.classList.add("lens-anchor");
}

let placeQueued = false;
function placeLensSoon() {
  if (placeQueued) return;
  placeQueued = true;
  requestAnimationFrame(() => { placeQueued = false; placeLens(); });
}
function placeLens() {
  if (!lens) return;
  const { node } = lens;
  const anchor = document.querySelector(lens.anchorSel);
  if (!anchor) { closeLens(true); return; }
  const vw = window.innerWidth || 1024, vh = window.innerHeight || 768;
  if (vw <= 620) {                                  // phone: a bottom sheet
    node.classList.add("sheet");
    node.style.left = node.style.top = "";
    return;
  }
  node.classList.remove("sheet");
  const r = anchor.getBoundingClientRect();
  const w = node.offsetWidth || 380, h = node.offsetHeight || 300;
  const gap = 12, m = 12;
  let left, top, origin;
  if (r.right + gap + w <= vw - m) { left = r.right + gap; top = r.top; origin = "left top"; }
  else if (r.left - gap - w >= m) { left = r.left - gap - w; top = r.top; origin = "right top"; }
  else { left = Math.min(Math.max(m, r.left + r.width / 2 - w / 2), vw - w - m);
    top = r.bottom + gap; origin = "center top"; }
  top = Math.min(Math.max(m, top), Math.max(m, vh - h - m));
  node.style.left = Math.round(left) + "px";
  node.style.top = Math.round(top) + "px";
  node.style.transformOrigin = origin;
}

function onLensDocDown(e) {
  if (!lens) return;
  const t = e.target;
  if (!t || !t.closest) return;
  if (lens.node.contains(t)) return;
  // layers opened FROM the lens (move picker, toasts, menus) and the things that
  // re-target it must not dismiss it
  if (t.closest("#modal-root, .ctx-menu, #toast-root, [data-lens-open]")) return;
  closeLens(true);
}
function onLensKey(e) {
  if (e.key !== "Escape" || !lens) return;
  const modals = document.getElementById("modal-root");
  if (modals && modals.children.length) return;       // a dialog on top owns Escape
  if (document.querySelector(".ctx-menu")) return;
  e.preventDefault();
  closeLens();
}
function onLensHash() { closeLens(true); }

/* ---- the day lens (shared by Atlas and Horizon) ---- */

/**
 * opts: { anchorSel, focusTaskId, onChange(), openLabel, onOpenDay() }
 * `slot` comes from placement(rm).
 */
export function openDayLens(rm, slot, opts) {
  const accent = getSettings().roadmapAccent !== "off" && rm.accent ? rm.accent : null;
  const changed = () => { opts.onChange && opts.onChange(); refreshLens(); };
  let focusTaskId = opts.focusTaskId || null;          // highlighted once, not on every refresh
  return openLens({
    anchorSel: opts.anchorSel, accent, label: `${slot.day.title} — details`,
    build(panel, api) {
      // re-resolve against the CURRENT state so a repaint shows fresh ticks / moves
      const fresh = placement(rm).get(slot.day.id) || slot;
      drawDayLens(panel, rm, fresh, { ...opts, focusTaskId, close: api.close, changed });
      focusTaskId = null;
    },
  });
}

function drawDayLens(panel, rm, slot, o) {
  const slug = rm.slug, today = todayStr();
  const { day, date } = slot;
  const { mins, done } = slotMinutes(slug, slot);
  const doneTasks = slot.required.filter(t => taskProgress(slug, t).complete).length;

  const head = el("div.lens-head");
  const kicker = el("div.lens-kicker");
  kicker.append(el("span.lens-ico", { text: rm.icon }), el("span", { text: rm.title }));
  head.append(kicker);
  const x = el("button.lens-x", { type: "button", "aria-label": "Close",
    html: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>` });
  x.addEventListener("click", () => o.close());
  head.append(x);
  const when = el("div.lens-when" + (date === today ? ".today" : date < today ? ".past" : ""));
  when.append(el("b", { text: fmtDateHuman(date) }), el("span", { text: relDay(date) }));
  if (date !== day.date) when.append(el("span.lens-moved", { text: `moved from ${shortDate(day.date)}` }));
  head.append(when);
  head.append(el("h3.lens-title", { text: day.title }));
  if (day.theme) head.append(el("p.lens-theme", { text: day.theme }));
  panel.append(head);

  const sum = el("div.lens-sum");
  const bar = el("div.lens-bar"); bar.append(el("i", { style: `width:${mins ? Math.round(done / mins * 100) : 0}%` }));
  sum.append(bar);
  sum.append(el("span", { text: `${doneTasks}/${slot.required.length} tasks · ${fmtMins(Math.max(0, mins - done))} left of ${fmtMins(mins)}` }));
  panel.append(sum);

  if (day.note) panel.append(el("p.lens-note", { text: day.note }));

  const list = el("div.lens-list");
  if (!slot.required.length && !slot.bonus.length)
    list.append(el("p.lens-empty", { text: "Every task of this day was moved to another day." }));
  for (const t of slot.required) list.append(lensTask(rm, t, slot, o));
  if (slot.bonus.length) {
    list.append(el("div.lens-sec", { text: "Bonus · counts past 100%" }));
    for (const t of slot.bonus) list.append(lensTask(rm, t, slot, o));
  }
  panel.append(list);

  const foot = el("div.lens-foot");
  if (o.onOpenDay) {
    const open = el("button.btn.sm.primary", { type: "button", text: o.openLabel || "Open day" });
    open.addEventListener("click", () => { o.close(); o.onOpenDay(); });
    foot.append(open);
  }
  panel.append(foot);

  if (o.focusTaskId) {
    const f = panel.querySelector(`.lens-task[data-task="${o.focusTaskId}"]`);
    if (f) { f.classList.add("focus"); requestAnimationFrame(() => f.scrollIntoView && f.scrollIntoView({ block: "nearest" })); }
  }
}

function lensTask(rm, task, slot, o) {
  const slug = rm.slug;
  const p = taskProgress(slug, task);
  const row = el("div.lens-task" + (p.complete ? ".done" : p.partial ? ".partial" : "") + (task.optional ? ".bonus" : ""),
    { dataset: { task: task.id } });
  const cb = el("button.checkbox", { type: "button", role: "checkbox",
    "aria-checked": p.complete ? "true" : p.partial ? "mixed" : "false",
    "aria-label": task.subs ? (p.complete ? "Clear all sub-tasks" : "Complete all sub-tasks") : "Toggle task",
    html: checkIcon() });
  cb.addEventListener("click", () => { setTaskDone(slug, task, !p.complete); o.changed(); });
  row.append(cb);

  const body = el("div.lens-tbody");
  body.append(el("div.lens-tlabel", { html: task.lead || task.label || "" }));
  const meta = el("div.lens-meta");
  meta.append(el("span.chip", { text: task.cat || "alt", style: `--chip:var(--cat-${task.cat || "alt"}, var(--cat-alt))` }));
  if (task.est) meta.append(el("span.lens-est", { text: fmtMins(task.est) }));
  if (task.subs) meta.append(el("span.lens-est", { text: `${p.done}/${p.total} parts` }));
  if (task.day !== slot.day.id) {
    const od = rm.daysById.get(task.day);
    meta.append(el("span.t-moved", { text: `↩ from ${od ? shortDate(dayDate(rm, slug, od)) : task.day}` }));
  }
  const from = carriedFrom(rm, task);
  if (from) meta.append(el("span.t-carried", { text: `↩ carried over from “${from.title}”` }));
  body.append(meta);
  if (task.subs) {
    const subs = el("div.lens-subs");
    for (const s of task.subs) {
      const sd = store.isDone(slug, s.id);
      const sr = el("div.lens-sub" + (sd ? ".done" : ""), { dataset: { task: s.id } });
      const scb = el("button.checkbox", { type: "button", role: "checkbox", "aria-checked": sd ? "true" : "false",
        "aria-label": "Toggle sub-task", html: checkIcon() });
      scb.addEventListener("click", () => { store.setTask(slug, s.id, !store.isDone(slug, s.id)); o.changed(); });
      sr.append(scb);
      sr.append(el("span.lens-slabel", { html: s.label || s.lead || "" }));
      if (s.est) sr.append(el("span.lens-est", { text: fmtMins(s.est) }));
      subs.append(sr);
    }
    body.append(subs);
  }
  row.append(body);

  if (!task.optional) {
    const mv = el("button.lens-move", { type: "button", title: "Move task", "aria-label": "Move task",
      html: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8l-4 4 4 4M17 8l4 4-4 4M3 12h18"/></svg>` });
    mv.addEventListener("click", () => openMovePicker(rm, slug, task, o.changed));
    row.append(mv);
  }
  return row;
}

/* ================================================================== *
 *  Atlas board (per roadmap)
 * ================================================================== */
const spotBySlug = new Map();         // slug → spotlighted category (survives repaints)

/**
 * hooks: { onChange(), openCard(dayId), openMilestone(m), enter }
 * `S` is computeAll(rm) from the caller's paint.
 */
export function atlasBoard(rm, S, hooks = {}) {
  const slug = rm.slug, today = todayStr();
  const slots = placement(rm);
  const spot = spotBySlug.get(slug) || null;

  const board = el("div.atlas" + (hooks.enter ? ".enter" : ""), { dataset: { slug } });

  // legend: spotlight one kind of work across the whole journey
  const cats = new Map();
  for (const slot of slots.values()) for (const t of slot.required) {
    const c = cats.get(t.cat || "alt") || { n: 0, mins: 0 };
    c.n++; c.mins += t.est || 0; cats.set(t.cat || "alt", c);
  }
  const legend = el("div.atlas-legend");
  legend.append(el("span.atlas-legend-cap", { text: "Spotlight" }));
  for (const [cat, c] of [...cats.entries()].sort((a, b) => b[1].mins - a[1].mins)) {
    const on = spot === cat;
    const chip = el("button.atlas-cat" + (on ? ".on" : ""), { type: "button", "aria-pressed": on ? "true" : "false",
      style: `--chip:var(--cat-${cat}, var(--cat-alt))`, title: `${c.n} tasks · ${fmtMins(c.mins)}` });
    chip.append(el("i"), el("span", { text: cat }), el("small", { text: String(c.n) }));
    chip.addEventListener("click", () => {
      spotBySlug.set(slug, spot === cat ? null : cat);
      hooks.onChange && hooks.onChange();
    });
    legend.append(chip);
  }
  board.append(legend);

  const byWeek = new Map();
  for (const slot of slots.values()) {
    if (!byWeek.has(slot.day.week)) byWeek.set(slot.day.week, []);
    byWeek.get(slot.day.week).push(slot);
  }
  let lastMonth = null, i = 0;
  for (const w of rm.weeks) {
    const ws = (byWeek.get(w.id) || []).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    if (!ws.length) continue;
    const month = ws[0].date.slice(0, 7);
    if (month !== lastMonth) {
      board.append(el("div.atlas-month", {}, el("span", { text: monthLabel(ws[0].date) })));
      lastMonth = month;
    }
    board.append(plate(rm, S, w, ws, { today, spot, hooks, i: i++ }));
  }
  return board;
}

function plate(rm, S, week, slots, ctx) {
  const { today, hooks } = ctx;
  const start = week.start || slots[0].date;
  const end = addDays(start, 6);
  const wf = S.weeks[week.id] || { actual: { pct: 0 }, original: { pct: 0 }, ontime: { pct: 0 } };
  const isNow = start <= today && today <= end;
  const isPast = end < today;
  const title = String(week.title || week.id).replace(/^Week\s+\d+\s*[—–:-]\s*/i, "");

  const node = el("section.plate" + (isNow ? ".now" : "") + (isPast ? ".past" : "") +
    (wf.actual.total && wf.actual.pct >= 100 ? ".complete" : ""),
  { dataset: { atlasWeek: week.id }, style: `--i:${ctx.i};--n:${slots.length}`, "aria-label": week.title || week.id });

  const head = el("div.plate-head");
  head.append(el("span.plate-no", { text: `W${(week.index ?? ctx.i) + 1}` }));
  head.append(el("span.plate-range", { text: `${shortDate(start)} – ${shortDate(end)}` }));
  if (isNow) head.append(el("span.plate-now", { text: "This week" }));
  head.append(el("span.plate-pct", { text: `${wf.actual.pct}%`, title: `actual ${wf.actual.pct}% · original ${wf.original.pct}% · on-time ${(wf.ontime || {}).pct || 0}%` }));
  node.append(head);
  node.append(el("div.plate-title", { text: title, title: week.title || "" }));

  const meter = el("div.plate-meter", { "aria-hidden": "true" });
  meter.append(el("i.a", { style: `width:${Math.min(100, wf.actual.pct)}%` }));
  meter.append(el("i.t", { style: `width:${Math.min(100, (wf.ontime || {}).pct || 0)}%` }));
  node.append(meter);

  const days = el("div.plate-days", { style: `--n:${slots.length}` });
  for (const slot of slots) days.append(dayColumn(rm, S, slot, ctx));
  node.append(days);

  const ms = S.milestones.filter(m => m.week === week.id);
  const msBox = el("div.plate-mss");
  for (const m of ms) {
    const b = el("button.plate-ms." + m.status, { type: "button",
      title: m.met ? "Milestone met" : m.status === "missed" ? "Milestone missed" : "Milestone in progress" });
    b.append(el("span.plate-ms-flag", { text: m.met ? "🏆" : "🏁" }), el("span.plate-ms-t", { text: m.title }),
      el("span.plate-ms-n", { text: m.met ? "met" : `${m.progress}/${m.target}` }));
    b.addEventListener("click", () => hooks.openMilestone && hooks.openMilestone(m));
    msBox.append(b);
  }
  if (ms.length) node.append(msBox);
  return node;
}

function dayColumn(rm, S, slot, ctx) {
  const { today, spot, hooks } = ctx;
  const slug = rm.slug;
  const { day, date } = slot;
  const df = S.days[day.id] || { actual: { pct: 0, total: 0 } };
  const isToday = date === today, isPast = date < today;
  const { mins } = slotMinutes(slug, slot);
  const complete = df.actual.total > 0 && df.actual.pct >= 100;
  const d = parseDate(date);

  const col = el("div.aday" + (isToday ? ".today" : "") + (isPast ? ".past" : "") + (complete ? ".complete" : "") +
    (date !== day.date ? ".moved" : ""), { dataset: { atlasDay: day.id } });

  const anchorSel = `.atlas [data-atlas-day="${day.id}"]`;
  const open = focusTaskId => openDayLens(rm, slot, {
    anchorSel, focusTaskId, onChange: hooks.onChange,
    openLabel: "Open the full day card", onOpenDay: () => hooks.openCard && hooks.openCard(day.id),
  });

  const head = el("button.aday-head", { type: "button", dataset: { lensOpen: "" },
    title: `${day.title} — ${fmtDateHuman(date)}`, "aria-label": `${fmtDateHuman(date)}: ${day.title}. Show the day` });
  const top = el("span.aday-top");
  top.append(el("span.aday-dow", { text: isToday ? "Today" : DOW[d.getDay()] }), el("span.aday-num", { text: String(d.getDate()) }));
  top.append(el("span.aday-load", { text: fmtMins(mins) }));
  top.append(el("span.aday-ring", { style: `--p:${df.actual.pct || 0}`, title: `${df.actual.pct || 0}% done` }));
  head.append(top);
  head.append(el("span.aday-title", { text: day.title }));
  head.addEventListener("click", () => open(null));
  head.addEventListener("contextmenu", ev => openDayMenu(rm, day, ev, hooks.onChange));
  col.append(head);

  const stack = el("div.aday-bricks", { dataset: { lensOpen: "" } });
  for (const t of slot.required) stack.append(brick(rm, t, { hostId: day.id, overdue: isPast, dim: !!spot && (t.cat || "alt") !== spot,
    draggable: true, onOpen: task => open(task.id), onChange: hooks.onChange }));
  for (const t of slot.bonus) stack.append(brick(rm, t, { hostId: day.id, dim: !!spot && (t.cat || "alt") !== spot,
    onOpen: task => open(task.id), onChange: hooks.onChange }));
  if (!slot.required.length && !slot.bonus.length) stack.append(el("span.aday-empty", { text: "moved away" }));
  col.append(stack);

  installDayDrop(col, day.id, rm, slug, hooks.onChange);
  return col;
}
