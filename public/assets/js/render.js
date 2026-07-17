// render.js — turn a normalized roadmap + computed stats into the interactive
// view: hero, stats strip, objective meters, milestone rail, timeline
// (month → week → day cards), task rows, soft items, grouped tasks, extras.
//
// On a tick/move the whole view is rebuilt (cheap at this scale) while open day
// cards and scroll position are preserved, so it stays smooth and correct.

import * as store from "./store.js";
import { computeAll, currentDay } from "./stats.js";
import { getRoadmaps } from "./registry.js";
import { makeDraggable, installDayDrop, openMovePicker } from "./moves.js";
import { checkIcon, toast, getSettings, setSetting, inputModal } from "./ui.js";
import {
  $, $$, el, frag, escapeHtml, fmtMins, todayStr, fmtDateHuman, relDay,
  monthLabel, daysBetween, pct,
} from "./util.js";

let hooks = {};                        // { exportRoadmap, importRoadmap }
export function setRenderHooks(h) { hooks = h; }

let cur = null;                        // { rm, mount }
let lastToggled = null;
let celebrateDay = null;               // dayId whose actual just hit 100% (fire confetti)
let revealedDays = new Set();          // day ids already slid into view (this roadmap session)
let dayRevealIO = null;                // live scroll-reveal observer; disconnected each paint

/* Is animation allowed right now? (respects the in-app + OS motion prefs) */
function motionOK() {
  if (document.documentElement.getAttribute("data-motion") === "off") return false;
  return !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/* Scroll-reveal is a separate, independently-toggleable animation: it needs
 * motion on AND its own switch on AND IntersectionObserver support (progressive
 * enhancement — without it, cards just render in place). */
function dayRevealOK() {
  return motionOK() && getSettings().dayReveal !== "off" && typeof IntersectionObserver !== "undefined";
}

/* open-card state, persisted per roadmap */
const openKey = slug => `roadmaps_open_${slug}`;
function loadOpen(slug) {
  try { const a = JSON.parse(localStorage.getItem(openKey(slug)) || "null");
    if (Array.isArray(a)) return new Set(a); } catch {}
  return null;
}
function saveOpen(slug, set) { try { localStorage.setItem(openKey(slug), JSON.stringify([...set])); } catch {} }

export function renderRoadmap(rm, mount) {
  cur = { rm, mount };
  revealedDays = new Set();              // fresh entrance → cards may reveal again as you scroll
  let open = loadOpen(rm.slug);
  if (!open) { open = new Set(); const t = rm.days.find(d => d.date === todayStr());
    if (t) open.add(t.id); else { const up = rm.days.find(d => d.date >= todayStr()); if (up) open.add(up.id); } }
  paint(rm, mount, open, true);          // full open → play the entrance cascade
}

function rerender() {
  if (!cur) return;
  const open = new Set($$open());
  paint(cur.rm, cur.mount, open, false); // in-place update → no cascade (stable on ticks)
}
function $$open() {
  return [...document.querySelectorAll(".day.open")].map(d => d.dataset.day);
}

/* ---- scroll-reveal for day cards --------------------------------------
 * Day cards slide in (alternating from the left / right) as they scroll into
 * the timeline. Correct-by-construction:
 *  - Cheap: one IntersectionObserver (root = the #main scroll area), no scroll
 *    handler, no per-frame work. Cards are unobserved the moment they reveal.
 *  - Repaint-safe: a `revealedDays` set survives tick rerenders, so already-seen
 *    cards snap straight to their final state — the visible list never re-animates
 *    when you tick a task. Only not-yet-seen cards below the fold are observed.
 *  - Motion-safe: the hidden start-state is applied in JS, never in blanket CSS,
 *    so with reveal (or motion) off, cards are simply never hidden.
 *  - Leak-free: the previous observer is disconnected on every paint; `will-change`
 *    is set only while a card is actually animating, then cleared. */
function setupDayReveal(mount) {
  if (dayRevealIO) { dayRevealIO.disconnect(); dayRevealIO = null; }
  if (!dayRevealOK()) return;                       // off → cards already render in place
  const root = document.getElementById("main");
  const pending = [];
  mount.querySelectorAll(".day").forEach((card, i) => {
    if (revealedDays.has(card.dataset.day)) return; // already shown this session → leave visible
    card.style.setProperty("--rv-x", (i % 2 ? 34 : -34) + "px");   // alternate right / left
    card.classList.add("rv-init");
    pending.push(card);
  });
  if (!pending.length) return;
  dayRevealIO = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      obs.unobserve(e.target);
      revealedDays.add(e.target.dataset.day);
      revealCard(e.target);
    }
  }, { root, rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
  for (const c of pending) dayRevealIO.observe(c);
}
function revealCard(card) {
  card.style.willChange = "opacity, transform";     // promote only while animating
  requestAnimationFrame(() => {
    card.classList.add("rv-show");
    const done = e => {
      if (e && e.propertyName !== "transform") return;   // wait for the longer track
      card.classList.remove("rv-init", "rv-show");
      card.style.removeProperty("--rv-x");
      card.style.willChange = "";                   // drop the layer → no lingering cost
      card.removeEventListener("transitionend", done);
    };
    card.addEventListener("transitionend", done);
  });
}

/* ================================================================== *
 *  Cross-roadmap "Today" — one digest of everything due today (and
 *  anything overdue) across every roadmap. Rendered at #/today. Ticking
 *  here writes through to the DB just like the timeline does.
 * ================================================================== */
export function renderToday(mount) {
  const today = todayStr();
  mount.innerHTML = "";
  const view = el("div.today-view");

  const heroEl = el("div.hero.today-hero");
  const top = el("div.hero-top");
  top.append(el("div.hero-ico", { text: "📅" }));
  const tb = el("div");
  tb.append(el("h1", { text: "Today" }));
  tb.append(el("p.sub", { text: `${fmtDateHuman(today)} ${today.slice(0, 4)} · across all roadmaps` }));
  top.append(tb);
  heroEl.append(top);
  view.append(heroEl);

  let due = 0, doneToday = 0, overdueN = 0;
  const cards = [];
  for (const rm of getRoadmaps()) {
    const todayList = [], overdueList = [];
    for (const d of rm.days) for (const t of d.tasks) {
      if (t.optional) continue;
      const cur = rm.daysById.get(currentDay(rm, rm.slug, t));
      if (!cur) continue;
      const isDone = store.isDone(rm.slug, t.id);
      if (cur.date === today) { todayList.push({ t, cur }); due++; if (isDone) doneToday++; }
      else if (cur.date < today && !isDone) { overdueList.push({ t, cur }); overdueN++; }
    }
    if (todayList.length || overdueList.length) cards.push(todayCard(rm, todayList, overdueList, mount));
  }

  const strip = el("div.today-summary");
  strip.append(el("span", { html: `<b>${doneToday}/${due}</b> due today` }));
  if (overdueN) strip.append(el("span.od", { html: `<b>${overdueN}</b> overdue` }));
  view.append(strip);

  if (!cards.length) {
    const empty = el("div.center-note", { style: "padding:var(--s8)" });
    empty.append(el("div.big", { text: "✅" }));
    empty.append(document.createTextNode("Nothing scheduled today. Enjoy the breather — or open a roadmap and pull something forward."));
    view.append(empty);
  } else cards.forEach(c => view.append(c));

  mount.append(view);
}

function todayCard(rm, todayList, overdueList, mount) {
  const card = el("div.today-card");
  if ((getSettings().roadmapAccent !== "off") && rm.accent) {
    card.style.setProperty("--accent", rm.accent);
    card.style.setProperty("--accent-soft", `color-mix(in srgb, ${rm.accent} 15%, transparent)`);
  }
  const head = el("a.today-card-head", { href: `#/${rm.slug}/today` });
  head.append(el("span.today-card-ico", { text: rm.icon }));
  head.append(el("span.today-card-title", { text: rm.title }));
  card.append(head);
  if (overdueList.length) {
    card.append(el("div.today-sub.od", { text: `Overdue · ${overdueList.length}` }));
    for (const { t, cur } of overdueList) card.append(todayRow(rm, t, mount, cur, true));
  }
  if (todayList.length) {
    if (overdueList.length) card.append(el("div.today-sub", { text: "Today" }));
    for (const { t, cur } of todayList) card.append(todayRow(rm, t, mount, cur, false));
  }
  return card;
}

function todayRow(rm, task, mount, curDay, overdue) {
  const done = store.isDone(rm.slug, task.id);
  const row = el("div.task" + (done ? ".done" : ""), { dataset: { task: task.id } });
  const cb = el("button.checkbox", { role: "checkbox", "aria-checked": done ? "true" : "false",
    "aria-label": "Toggle task", html: checkIcon() });
  cb.onclick = () => { store.setTask(rm.slug, task.id, !store.isDone(rm.slug, task.id)); renderToday(mount); };
  row.append(cb);
  const bodyEl = el("div.t-body");
  bodyEl.append(el("div.t-label", { html: task.label }));
  const meta = el("div.t-meta");
  meta.append(catChip(task.cat, rm));
  if (task.est) meta.append(el("span.t-est", { html: `${clockIcon()} ${fmtMins(task.est)}` }));
  if (overdue) meta.append(el("span.t-moved", { text: `from ${relDay(curDay.date)}` }));
  bodyEl.append(meta);
  row.append(bodyEl);
  return row;
}

/** Apply per-view accent. A roadmap's identity colour wins unless the owner
 *  turned "roadmap colours" off in settings, in which case the global accent
 *  (the hue slider / swatch) shows through everywhere. */
function applyAccent(rm, mount) {
  const useOwn = (getSettings().roadmapAccent !== "off") && rm.accent;
  if (useOwn) {
    mount.style.setProperty("--accent", rm.accent);
    mount.style.setProperty("--accent-soft", `color-mix(in srgb, ${rm.accent} 15%, transparent)`);
    mount.style.setProperty("--accent-ink", `color-mix(in srgb, ${rm.accent}, white 20%)`);
  } else {
    mount.style.removeProperty("--accent");
    mount.style.removeProperty("--accent-soft");
    mount.style.removeProperty("--accent-ink");
  }
}

function paint(rm, mount, open, animateIn = false) {
  const main = document.getElementById("main");
  const scrollTop = main ? main.scrollTop : 0;
  const S = computeAll(rm);

  applyAccent(rm, mount);

  mount.innerHTML = "";
  const blocks = [];
  blocks.push(hero(rm, S));
  blocks.push(statsStrip(rm, S));
  blocks.push(meters(rm, S));
  if (rm.milestones.length) blocks.push(milestoneRail(rm, S));
  blocks.push(timeline(rm, S, open));
  if (rm.features && rm.features.length) blocks.push(extras(rm));
  for (const b of blocks) mount.append(b);

  // entrance cascade — only when opening a roadmap, and only if motion is on
  if (animateIn && motionOK()) {
    blocks.forEach((b, i) => { b.classList.add("reveal"); b.style.setProperty("--rd", i * 55 + "ms"); });
  }

  saveOpen(rm.slug, open);
  if (main) main.scrollTop = scrollTop;
  setupDayReveal(mount);                 // wire scroll-in reveals (after scroll is restored)

  // just-ticked checkbox: pop it (and a tiny sparkle when it became done)
  if (lastToggled) {
    const row = mount.querySelector(`[data-task="${cssEsc(lastToggled)}"]`);
    const cb = row && row.querySelector(".checkbox");
    if (cb) { cb.classList.add("pop"); cb.addEventListener("animationend", () => cb.classList.remove("pop"), { once: true });
      if (row.classList.contains("done") && motionOK()) sparkle(cb); }
    lastToggled = null;
  }

  // a day just reached 100% → pulse its ring + confetti + toast
  if (celebrateDay) {
    const card = mount.querySelector(`.day[data-day="${cssEsc(celebrateDay)}"]`);
    const ring = card && card.querySelector(".day-ring");
    if (ring && motionOK()) {
      ring.classList.add("pulse");
      ring.addEventListener("animationend", () => ring.classList.remove("pulse"), { once: true });
      const r = ring.getBoundingClientRect();
      celebrateBurst(r.left + r.width / 2, r.top + r.height / 2);
    }
    const day = rm.daysById.get(celebrateDay);
    toast(`Day complete${day ? " · " + day.title : ""} 🎉`, { type: "ok" });
    celebrateDay = null;
  }
}

/* All non-optional tasks whose CURRENT day is `hostId` are done. */
function isDayComplete(rm, hostId) {
  let any = false;
  for (const d of rm.days) for (const t of d.tasks) {
    if (t.optional) continue;
    if (currentDay(rm, rm.slug, t) !== hostId) continue;
    any = true;
    if (!store.isDone(rm.slug, t.id)) return false;
  }
  return any;
}

/* A few confetti dots flung from (x,y); auto-removed. */
function celebrateBurst(x, y) {
  const N = 14;
  const cols = ["var(--accent)", "var(--ok)", "var(--cat-watch)", "var(--cat-project)", "var(--warn)"];
  const burst = el("div.burst", { style: `left:${x}px;top:${y}px` });
  for (let i = 0; i < N; i++) {
    const ang = (Math.PI * 2 * i) / N + (i % 2 ? .4 : 0);
    const dist = 46 + (i % 5) * 12;
    const p = el("span.confetti", { style:
      `--dx:${Math.cos(ang) * dist}px; --dy:${Math.sin(ang) * dist - 10}px;` +
      `--c:${cols[i % cols.length]}; --cr:${(i % 2 ? 1 : -1) * 300}deg; --cdur:${820 + (i % 4) * 90}ms` });
    burst.append(p);
  }
  document.body.append(burst);
  setTimeout(() => burst.remove(), 1300);
}

/* Small sparkle ring around a just-completed checkbox. */
function sparkle(cb) {
  const r = cb.getBoundingClientRect();
  celebrateBurstSmall(r.left + r.width / 2, r.top + r.height / 2);
}
function celebrateBurstSmall(x, y) {
  const N = 7;
  const burst = el("div.burst", { style: `left:${x}px;top:${y}px` });
  for (let i = 0; i < N; i++) {
    const ang = (Math.PI * 2 * i) / N;
    const dist = 16 + (i % 3) * 6;
    const p = el("span.confetti", { style:
      `--dx:${Math.cos(ang) * dist}px; --dy:${Math.sin(ang) * dist}px;` +
      `--c:var(--accent); --cdur:520ms; width:5px; height:5px` });
    burst.append(p);
  }
  document.body.append(burst);
  setTimeout(() => burst.remove(), 700);
}
const cssEsc = s => (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/[^\w-]/g, "\\$&");

/* ================================================================== *
 *  Hero
 * ================================================================== */
function hero(rm, S) {
  const wrap = el("div.hero");
  const top = el("div.hero-top");
  top.append(el("div.hero-ico", { text: rm.icon }));
  const titleBox = el("div");
  titleBox.append(el("h1", { text: rm.title }));
  if (rm.subtitle) titleBox.append(el("p.sub", { text: rm.subtitle }));
  top.append(titleBox);
  const actions = el("div.hero-actions");
  actions.append(iconBtn("Export this roadmap", exportIcon(), () => hooks.exportRoadmap && hooks.exportRoadmap(rm.slug)));
  actions.append(iconBtn("Import into this roadmap", importIcon(), () => hooks.importRoadmap && hooks.importRoadmap(rm.slug)));
  top.append(actions);
  wrap.append(top);

  const prog = el("div.hero-progress");
  prog.append(dualBlock("Actual progress", S.overall.actual, S.overall.bonus, false));
  prog.append(dualBlock("Original progress", S.overall.original, null, true));
  wrap.append(prog);

  wrap.append(projectionLine(rm, S));
  return wrap;
}

function dualBlock(cap, figure, bonus, isOrig) {
  const b = el("div.dual" + (isOrig ? ".orig" : ""));
  b.append(el("div.cap", { text: cap }));
  const lead = el("div.lead");
  lead.append(el("b", { text: figure.pct + "%" }));
  lead.append(el("span", { text: `${figure.done}/${figure.total} tasks` }));
  b.append(lead);
  const bar = el("div.pbar" + (bonus && bonus.total ? ".bonus" : "") + (isOrig ? ".orig" : ""));
  bar.append(el("i", { style: `width:${Math.min(100, figure.pct)}%` }));
  b.append(bar);
  if (bonus && bonus.total) {
    b.append(el("div.day-mini-orig", { style: "margin-top:6px",
      text: `+ ${bonus.done}/${bonus.total} bonus done` }));
  }
  return b;
}

function projectionLine(rm, S) {
  const p = S.projection;
  const line = el("div.projection");
  if (p.done) {
    line.append(el("span", { html: "🎉 <b class='chip'>Primary goals complete</b>" }));
  } else {
    line.append(el("span", { html: `At ~${Math.round(p.perWeekMins/60)}h/week you'll finish around ` }));
    line.append(el("span.chip", { text: fmtDateHuman(p.expectedFinish) + " " + p.expectedFinish.slice(0, 4) }));
    line.append(el("span", { text: `(optimistic ${fmtDateHuman(p.optimisticFinish)})`, style: "color:var(--text-3)" }));
    const delta = el("span.proj-delta." + p.track, { text: trackText(p.track) });
    line.append(delta);
  }
  if (S.secProjection) {
    line.append(el("span", { style: "flex-basis:100%;height:0" }));
    line.append(el("span", { style: "color:var(--text-3);font-size:var(--t-xs)",
      html: `Secondary tail (~${fmtMins(S.remainingSecondary)}) projected around <b>${fmtDateHuman(S.secProjection.finish)}</b>` }));
  }
  return line;
}
const trackText = t => ({ ahead: "Ahead", on: "On track", behind: "Behind" }[t] || "On track");

/* ================================================================== *
 *  Stats strip + meters
 * ================================================================== */
function statsStrip(rm, S) {
  const strip = el("div.stats-strip");
  const kpi = (k, v, sub) => { const c = el("div.kpi"); c.append(el("div.k", { text: k }));
    const val = el("div.v", { text: v }); if (sub) val.append(el("small", { text: " " + sub })); c.append(val); return c; };
  strip.append(kpi("Actual", S.overall.actual.pct + "%"));
  strip.append(kpi("Original", S.overall.original.pct + "%"));
  const wk = currentWeekFigure(rm, S);
  strip.append(kpi("This week", wk));
  strip.append(kpi("Streak", S.streak, S.streak === 1 ? "day" : "days"));
  strip.append(kpi("Invested", fmtMins(S.invested)));
  strip.append(kpi("Remaining", fmtMins(S.remaining)));
  if (S.softStats.total) strip.append(kpi("Tryouts", `${S.softStats.done}/${S.softStats.total}`));
  return strip;
}
function currentWeekFigure(rm, S) {
  const today = todayStr();
  const wk = rm.weeks.find(w => w.start && daysBetween(w.start, today) >= 0 && daysBetween(w.start, today) <= 6);
  if (!wk) return "—";
  const f = S.weeks[wk.id]; return f ? `${f.actual.pct}%` : "—";
}

function meters(rm, S) {
  const wrap = el("div.meters");
  for (const o of S.objectives) {
    const m = el("div.meter" + (o.tier === "secondary" ? ".secondary" : ""), { dataset: { obj: o.id } });
    const name = el("div.mname", { text: o.title });
    if (o.tier === "secondary") name.append(el("span.tier", { text: "secondary" }));
    m.append(name);
    const bar = el("div.mbar"); bar.append(el("i", { style: `width:${Math.min(100, o.actual.pct)}%` }));
    m.append(bar);
    m.append(el("div.mval", { text: o.actual.pct + "%" }));
    wrap.append(m);
  }
  return wrap;
}

/* ================================================================== *
 *  Milestone rail
 * ================================================================== */
function milestoneRail(rm, S) {
  const wrap = el("div.milestones");
  const mode = getSettings().milestoneView === "cards" ? "cards" : "slideshow";
  const head = el("div.ms-sec-head");
  head.append(el("div.sec-title", { text: "Milestones" }));
  head.append(msModeToggle(rm, mode));
  wrap.append(head);
  wrap.append(mode === "cards" ? msCardsRail(rm, S) : msSlideshow(rm, S));
  return wrap;
}

/* Inline view switch — mirrors the Settings option, right on the section. */
function msModeToggle(rm, mode) {
  const seg = el("div.ms-mode");
  const mk = (val, label, icon) => {
    const b = el("button.ms-mode-btn" + (mode === val ? ".on" : ""),
      { "aria-pressed": mode === val ? "true" : "false", title: label + " view", html: icon });
    b.onclick = () => {
      if (getSettings().milestoneView === val) return;
      setSetting("milestoneView", val);
      rerender();
    };
    return b;
  };
  seg.append(mk("slideshow", "Slideshow", slideIcon()));
  seg.append(mk("cards", "Cards", gridIcon()));
  return seg;
}

/* ---- Mode 2: the classic compact horizontal rail ---- */
function msCardsRail(rm, S) {
  const rail = el("div.ms-rail");
  for (const m of S.milestones) rail.append(msCard(rm, m, false));
  return rail;
}

/* ---- Mode 1 (default): a draggable, looping slideshow of larger cards ----
 * Starts on the first not-yet-met milestone, but you can drag/step back to
 * the very start and wrap around (circular). 2–3 cards are visible; the
 * active one is lifted while its neighbours sit dimmed on either side. */
function msSlideshow(rm, S) {
  const box = el("div.ms-show");
  const vp = el("div.ms-show-vp");
  const track = el("div.ms-show-track");
  const cards = S.milestones.map(m => msCard(rm, m, true));
  for (const c of cards) track.append(c);
  vp.append(track);
  box.append(vp);

  const n = cards.length;
  let idx = S.milestones.findIndex(m => !m.met);
  if (idx < 0) idx = Math.max(0, n - 1);          // all met → rest on the last
  let animate = false;

  const geom = () => {
    const cw = cards[0] ? cards[0].offsetWidth : 0;       // layout width (scale-proof)
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return { step: cw + gap, center: (vp.clientWidth - cw) / 2 };
  };
  const applyTx = (tx, withAnim) => {
    track.style.transition = (withAnim && motionOK()) ? "transform .38s cubic-bezier(.22,.61,.36,1)" : "none";
    track.style.transform = `translateX(${tx}px)`;
  };
  const update = () => {
    const { step, center } = geom();
    if (step > 0) applyTx(center - idx * step, animate);
    cards.forEach((c, i) => c.classList.toggle("is-active", i === idx));
    $$(".ms-dot", dots).forEach((d, i) => d.setAttribute("aria-current", i === idx ? "true" : "false"));
    animate = true;                                 // first paint snaps, later moves glide
  };
  const go = i => { idx = (i % n + n) % n; update(); };   // wrap-around = "infinite"

  // controls
  const nav = el("div.ms-show-nav");
  const prev = el("button.ms-nav-btn", { "aria-label": "Previous milestone", html: caretIcon() });
  const next = el("button.ms-nav-btn", { "aria-label": "Next milestone", html: caretIcon() });
  prev.classList.add("prev");
  prev.onclick = () => go(idx - 1);
  next.onclick = () => go(idx + 1);
  const dots = el("div.ms-dots");
  for (let i = 0; i < n; i++) {
    const d = el("button.ms-dot", { "aria-label": `Milestone ${i + 1}` });
    d.onclick = () => go(i);
    dots.append(d);
  }
  nav.append(prev, dots, next);
  box.append(nav);
  if (n <= 1) nav.style.display = "none";

  // pointer drag (mouse + touch), with a snap on release
  let down = false, startX = 0, baseTx = 0, moved = 0, step0 = 0;
  vp.addEventListener("pointerdown", e => {
    down = true; moved = 0; startX = e.clientX;
    const { step, center } = geom(); step0 = step;
    baseTx = center - idx * step;
    track.style.transition = "none";
    vp.classList.add("dragging");
    vp.setPointerCapture && vp.setPointerCapture(e.pointerId);
  });
  vp.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - startX; moved = dx;
    track.style.transform = `translateX(${baseTx + dx}px)`;
  });
  const endDrag = () => {
    if (!down) return;
    down = false; vp.classList.remove("dragging");
    if (step0 > 0 && Math.abs(moved) > 4) go(idx - Math.round(moved / step0));
    else update();
  };
  vp.addEventListener("pointerup", endDrag);
  vp.addEventListener("pointercancel", endDrag);
  // don't let a real drag also fire link/hover intents
  vp.addEventListener("click", e => { if (Math.abs(moved) > 6) { e.preventDefault(); e.stopPropagation(); } }, true);

  // position once laid out, and keep centred on resize (self-cleans after repaint)
  requestAnimationFrame(update);
  const onResize = () => { if (!track.isConnected) { window.removeEventListener("resize", onResize); return; } update(); };
  window.addEventListener("resize", onResize);

  return box;
}

/* One milestone card. `large` = the padded slideshow variant with a progress bar. */
function msCard(rm, m, large) {
  const today = todayStr();
  const week = rm.weeksById.get(m.week);
  const isCurrent = week && week.start && daysBetween(week.start, today) >= 0 && daysBetween(week.start, today) <= 6;
  const card = el("div.ms." + m.status + (isCurrent ? ".current" : "") + (large ? ".lg" : ""));
  card.append(el("div.ms-week", { text: (week && week.title) || m.week || "" }));
  card.append(el("div.ms-title", { text: m.title }));
  card.append(el("div.ms-status", { text: statusText(m) }));
  if (large) {
    const bar = el("div.ms-prog" + (m.met ? ".met" : ""));
    bar.append(el("i", { style: `width:${Math.round((m.ratio || 0) * 100)}%` }));
    card.append(bar);
  }
  return card;
}
function statusText(m) {
  if (m.met) return "Met";
  if (m.status === "missed") return `Missed (${m.progress}/${m.target})`;
  return `${m.progress}/${m.target}`;
}
const slideIcon = () => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="6" width="10" height="12" rx="1.5"/><path d="M4 9v6M20 9v6"/></svg>`;
const gridIcon = () => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="7" height="14" rx="1.5"/><rect x="14" y="5" width="7" height="14" rx="1.5"/></svg>`;

/* ================================================================== *
 *  Timeline
 * ================================================================== */
function timeline(rm, S, open) {
  const wrap = el("div.timeline");
  const showMonths = rm.months.length > 1;

  // group days by month → week
  const byMonth = new Map();
  for (const d of rm.days) {
    if (!byMonth.has(d.month)) byMonth.set(d.month, new Map());
    const wm = byMonth.get(d.month);
    if (!wm.has(d.week)) wm.set(d.week, []);
    wm.get(d.week).push(d);
  }

  for (const [monthKey, weeksMap] of byMonth) {
    const mg = el("div.month-group");
    if (showMonths) mg.append(el("div.month-head", { text: monthLabel(rm.days.find(d => d.month === monthKey).date) }));
    for (const [weekId, days] of weeksMap) {
      mg.append(weekGroup(rm, S, weekId, days, open));
    }
    wrap.append(mg);
  }
  return wrap;
}

function weekGroup(rm, S, weekId, days, open) {
  const wg = el("div.week-group");
  const week = rm.weeksById.get(weekId);
  const f = S.weeks[weekId] || { actual: { pct: 0, done: 0, total: 0 }, original: { pct: 0, done: 0, total: 0 } };
  const head = el("div.week-head");
  head.append(el("span.wk", { html: `${escapeHtml((week && week.title) || weekId)}` }));
  const dual = el("div.week-dual");
  dual.append(el("span", { html: `actual <b>${f.actual.pct}%</b>` }));
  dual.append(el("span", { html: `original <b>${f.original.pct}%</b>` }));
  head.append(dual);
  // week milestone chip
  const ms = S.milestones.find(m => m.week === weekId && (m.rule || {}));
  const wm = S.milestones.filter(m => m.week === weekId);
  if (wm.length) {
    const worst = wm.some(m => m.status === "missed") ? "missed"
      : wm.every(m => m.met) ? "met" : "risk";
    const chip = el("span.wk-milestone", {
      text: worst === "met" ? "✓ milestone" : worst === "missed" ? "✗ missed" : "◔ in progress",
      style: `color:${worst === "met" ? "var(--ok)" : worst === "missed" ? "var(--bad)" : "var(--warn)"};` +
             `background:color-mix(in srgb, ${worst === "met" ? "var(--ok)" : worst === "missed" ? "var(--bad)" : "var(--warn)"} 14%, transparent)`,
    });
    head.append(chip);
  }
  wg.append(head);
  for (const d of days) wg.append(dayCard(rm, S, d, open));
  return wg;
}

function dayCard(rm, S, day, open) {
  const today = todayStr();
  const isToday = day.date === today;
  const isPast = day.date < today;
  const isOpen = open.has(day.id);
  const df = S.days[day.id] || { actual: { pct: 0, done: 0, total: 0 }, original: { pct: 0, done: 0, total: 0 } };

  const isComplete = df.actual.total > 0 && df.actual.pct >= 100;
  const card = el("div.day" + (isToday ? ".today" : "") + (isPast ? ".past" : "") + (isOpen ? ".open" : "") +
    (isComplete ? ".complete" : ""), { dataset: { day: day.id } });

  // header
  const head = el("div.day-head", { role: "button", tabindex: "0", "aria-expanded": isOpen ? "true" : "false" });
  head.append(el("span.day-caret", { html: caretIcon() }));
  const dateBox = el("div.day-date");
  dateBox.append(el("div.dow", { text: day.dow }));
  dateBox.append(el("div.dnum", { text: String(new Date(day.date.replace(/-/g, "/")).getDate()) }));
  head.append(dateBox);
  const info = el("div.day-info");
  const titleRow = el("div.day-title");
  titleRow.append(document.createTextNode(day.title));
  if (isToday) titleRow.append(el("span.today-badge", { text: "Today" }));
  info.append(titleRow);
  if (day.theme) info.append(el("div.day-theme", { text: day.theme }));
  head.append(info);

  const figs = el("div.day-figs");
  const ring = el("div.day-ring" + (isComplete ? ".full" : ""),
    { style: `--p:${df.actual.pct}`, title: `Actual ${df.actual.pct}%` });
  ring.append(el("i", { text: df.actual.pct + "%" }));
  figs.append(ring);
  if (df.original.total && (df.original.done !== df.actual.done || df.original.total !== df.actual.total))
    figs.append(el("span.day-mini-orig", { title: "Original", text: `orig ${df.original.pct}%` }));
  head.append(figs);

  const toggle = () => {
    const nowOpen = !card.classList.contains("open");
    card.classList.toggle("open", nowOpen);
    head.setAttribute("aria-expanded", nowOpen ? "true" : "false");
    if (nowOpen) open.add(day.id); else open.delete(day.id);
    saveOpen(rm.slug, open);
  };
  head.addEventListener("click", toggle);
  head.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  card.append(head);

  // body
  const body = el("div.day-body");
  const inner = el("div.inner");
  const pad = el("div.pad");

  // planner's note — authored context for the day (why it's light/heavy, a
  // continuation, an overlap warning, "reorder freely", etc). Plain text.
  if (day.note) {
    const n = el("div.day-note");
    n.append(el("span.ico", { text: "🗒️" }));
    n.append(el("span", { text: day.note }));
    pad.append(n);
  }

  // tasks (required first, grouped, then bonus track, then soft)
  const required = day.tasks.filter(t => !t.optional);
  const bonus = day.tasks.filter(t => t.optional);
  const movedIn = movedInTasks(rm, day.id);

  renderTaskList(pad, rm, S, required, false, day.id);
  if (movedIn.length) {
    pad.append(el("div.sec-title", { style: "margin-top:var(--s2)", text: "Moved in" }));
    renderTaskList(pad, rm, S, movedIn, true, day.id);
  }
  if (bonus.length) pad.append(bonusTrack(rm, S, bonus));
  for (const s of day.soft) pad.append(softItem(rm, s));

  if (!required.length && !bonus.length && !day.soft.length)
    pad.append(el("div.center-note", { style: "padding:var(--s4)", text: "Rest / off day" }));

  pad.append(userNote(rm, day));

  inner.append(pad); body.append(inner); card.append(body);

  installDayDrop(card, day.id, rm, rm.slug, rerender);
  return card;
}

/* tasks that were moved INTO this day from another origin day */
function movedInTasks(rm, dayId) {
  const out = [];
  for (const d of rm.days) if (d.id !== dayId) for (const t of d.tasks) {
    if (t.optional) continue;
    if (currentDay(rm, rm.slug, t) === dayId) out.push(t);
  }
  return out;
}

function renderTaskList(container, rm, S, tasks, isMovedIn = false, hostId = null) {
  // handle grouping: consecutive tasks with same group get wrapped
  let i = 0;
  while (i < tasks.length) {
    const t = tasks[i];
    if (t.group) {
      const grp = [t]; let j = i + 1;
      while (j < tasks.length && tasks[j].group === t.group) { grp.push(tasks[j]); j++; }
      if (grp.length > 1) {
        const box = el("div.tgroup");
        for (const gt of grp) box.append(taskRow(rm, S, gt, isMovedIn, hostId));
        container.append(box); i = j; continue;
      }
    }
    container.append(taskRow(rm, S, t, isMovedIn, hostId));
    i++;
  }
}

function taskRow(rm, S, task, isMovedIn = false, hostId = null) {
  const slug = rm.slug;
  const done = store.isDone(slug, task.id);
  const row = el("div.task" + (done ? ".done" : ""), { dataset: { task: task.id } });

  const cb = el("button.checkbox", { role: "checkbox", "aria-checked": done ? "true" : "false",
    "aria-label": "Toggle task", html: checkIcon() });
  cb.onclick = () => {
    lastToggled = task.id;
    const willDo = !store.isDone(slug, task.id);
    store.setTask(slug, task.id, willDo);
    if (willDo && hostId && isDayComplete(rm, hostId)) celebrateDay = hostId;
    rerender();
  };
  row.append(cb);

  const bodyEl = el("div.t-body");
  bodyEl.append(el("div.t-label", { html: task.label }));
  const meta = el("div.t-meta");
  meta.append(catChip(task.cat, rm));
  if (task.est) meta.append(el("span.t-est", { html: `${clockIcon()} ${fmtMins(task.est)}` }));
  const movedTo = store.getMove(slug, task.id);
  if (movedTo && movedTo !== task.day && !isMovedIn) {
    const dd = rm.daysById.get(movedTo);
    meta.append(el("span.t-moved", { text: `→ moved to ${dd ? relDay(dd.date) : movedTo}` }));
  }
  if (isMovedIn) {
    const od = rm.daysById.get(task.day);
    meta.append(el("span.t-moved", { text: `↩ from ${od ? relDay(od.date) : task.day}` }));
  }
  bodyEl.append(meta);
  row.append(bodyEl);

  const mv = el("button.t-move", { title: "Move task", "aria-label": "Move task", html: moveIcon() });
  mv.onclick = e => { e.stopPropagation(); openMovePicker(rm, slug, task, rerender); };
  makeDraggable(mv, row, task);
  row.append(mv);

  return row;
}

function bonusTrack(rm, S, bonus) {
  const wrap = el("div.bonus-track");
  const head = el("div.bonus-head", { html: `${starIcon()} Bonus · counts past 100%` });
  const box = el("div", { style: "display:none;flex-direction:column;gap:2px" });
  head.onclick = () => { const shown = box.style.display !== "none"; box.style.display = shown ? "none" : "flex"; };
  for (const t of bonus) {
    const row = bonusRow(rm, t);
    box.append(row);
  }
  wrap.append(head, box);
  return wrap;
}
function bonusRow(rm, task) {
  const slug = rm.slug;
  const done = store.isDone(slug, task.id);
  const useFallback = false;
  const row = el("div.task.bonus" + (done ? ".done" : ""), { dataset: { task: task.id } });
  const cb = el("button.checkbox", { role: "checkbox", "aria-checked": done ? "true" : "false", html: checkIcon() });
  cb.onclick = () => { lastToggled = task.id; store.setTask(slug, task.id, !store.isDone(slug, task.id)); rerender(); };
  row.append(cb);
  const bodyEl = el("div.t-body");
  bodyEl.append(el("div.t-label", { html: task.label }));
  const meta = el("div.t-meta");
  meta.append(catChip(task.cat, rm));
  if (task.est) meta.append(el("span.t-est", { html: `${clockIcon()} ${fmtMins(task.est)}` }));
  if (task.fallback) meta.append(el("span.t-est", { text: `· or short: ${task.fallback.label.replace(/<[^>]+>/g,"")}` }));
  bodyEl.append(meta);
  row.append(bodyEl);
  return row;
}

/* ================================================================== *
 *  Soft items
 * ================================================================== */
function softItem(rm, s) {
  const slug = rm.slug;
  if (s.type === "hint") {
    return el("div.soft.hint", {}, el("span.ico", { text: "💡" }), el("div.t-label", { html: stripLead(s.label) }));
  }
  if (s.type === "callout") {
    const kind = /new|🆕/i.test(s.label) ? "nw" : /deprecat|⚠️/i.test(s.label) ? "dep" : "";
    return el("div.soft.callout" + (kind ? "." + kind : ""), {},
      el("span.ico", { text: kind === "nw" ? "🆕" : kind === "dep" ? "⚠️" : "🔗" }),
      el("div.t-label", { html: stripLead(s.label) }));
  }
  // tryout / suggestion — tickable, distinct, never in real progress
  const done = store.isSoftDone(slug, s.id);
  const row = el("div.soft.tryout" + (done ? ".done" : ""), { dataset: { soft: s.id } });
  const cb = el("button.checkbox", { role: "checkbox", "aria-checked": done ? "true" : "false", html: checkIcon() });
  cb.onclick = () => { store.setSoft(slug, s.id, !store.isSoftDone(slug, s.id)); rerender(); };
  row.append(cb);
  const bodyEl = el("div.t-body");
  bodyEl.append(el("div.t-label", { html: s.label }));
  bodyEl.append(el("div.t-meta", {}, el("span.extra-tag", { text: s.type === "suggestion" ? "suggestion" : "tryout · extra" })));
  row.append(bodyEl);
  return row;
}
const stripLead = s => s.replace(/^\s*(💡|🆕|⚠️|🔗)\s*/, "");

/* ================================================================== *
 *  Personal note (per day) — your own journal line, saved to the DB
 *  (key `note:<dayId>`). Distinct from the authored `day.note`.
 * ================================================================== */
function userNote(rm, day) {
  const wrap = el("div.usernote");
  const draw = () => {
    wrap.innerHTML = "";
    const text = store.getNote(rm.slug, day.id);
    if (text) {
      const head = el("div.usernote-head");
      head.append(el("span.usernote-cap", { html: `${penIcon()} Your note` }));
      const edit = el("button.usernote-edit", { text: "Edit" });
      edit.onclick = () => editNote(rm, day, draw);
      head.append(edit);
      wrap.append(head);
      wrap.append(el("div.usernote-body", { text }));   // white-space:pre-wrap keeps line breaks
    } else {
      const add = el("button.usernote-add", { html: `${penIcon()} Add a note` });
      add.onclick = () => editNote(rm, day, draw);
      wrap.append(add);
    }
  };
  draw();
  return wrap;
}
async function editNote(rm, day, refresh) {
  const current = store.getNote(rm.slug, day.id);
  const text = await inputModal({
    title: "Note for this day", subtitle: `${day.title} · ${fmtDateHuman(day.date)}`, icon: "🗒️",
    label: "Private to you — blockers, wins, where you stopped. Clear it to delete.",
    value: current, multiline: true, confirmLabel: "Save",
  });
  if (text === null) return;                            // cancelled
  store.setNote(rm.slug, day.id, text);                 // empty/whitespace → clears the row
  refresh();
  toast(text.trim() ? "Note saved" : "Note cleared", { type: "ok" });
}
const penIcon = () => `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>`;

/* ================================================================== *
 *  Extras / features panel
 * ================================================================== */
function extras(rm) {
  const wrap = el("div.extras");
  wrap.append(el("div.sec-title", { text: "References & extras" }));
  for (const f of rm.features) {
    const card = el("div.extra-card");
    if (f.title) card.append(el("h4", { text: f.title }));
    if (f.html) card.append(el("div", { html: f.html }));
    if (f.items) { const ul = el("ul"); for (const it of f.items) ul.append(el("li", { html: it })); card.append(ul); }
    wrap.append(card);
  }
  return wrap;
}

/* ================================================================== *
 *  Small pieces
 * ================================================================== */
function catChip(cat, rm) {
  const colorVar = `var(--cat-${cat}, var(--cat-alt))`;
  return el("span.chip", { text: cat, style: `--chip:${colorVar}` });
}
function iconBtn(title, svg, onClick) {
  const b = el("button.icon-btn", { title, "aria-label": title, html: svg }); b.onclick = onClick; return b;
}

/* icons */
const caretIcon = () => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`;
const clockIcon = () => `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
const moveIcon = () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8l-4 4 4 4M17 8l4 4-4 4M3 12h18"/></svg>`;
const starIcon = () => `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7L12 17.8 5.2 21l1.5-7L1.5 9.3l7-.8z"/></svg>`;
const exportIcon = () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>`;
const importIcon = () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 11l4 4 4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>`;

export { rerender };
