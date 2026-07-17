// ui.js — reusable UI primitives: modals, toasts, focus trap, the lock gate,
// the sidebar, the theme engine, the settings drawer shell, and the draggable
// FAB. Roadmap content rendering lives in render.js; import/export wiring is
// attached to the drawer by app.js (Phase 6).

import { $, $$, el, frag, sleep } from "./util.js";

/* ================================================================== *
 *  Focus trap
 * ================================================================== */
export function focusTrap(container) {
  const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  function onKey(e) {
    if (e.key !== "Tab") return;
    const items = $$(sel, container).filter(n => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  container.addEventListener("keydown", onKey);
  return () => container.removeEventListener("keydown", onKey);
}

/* ================================================================== *
 *  Toasts
 * ================================================================== */
export function toast(message, { type = "", duration = 3200, undo = null, html = false } = {}) {
  const root = $("#toast-root");
  const node = el("div.toast" + (type ? "." + type : ""));
  node.append(el("i.dot"));
  const msg = el("span"); if (html) msg.innerHTML = message; else msg.textContent = message;
  node.append(msg);
  let timer;
  const dismiss = () => { clearTimeout(timer); node.classList.add("leaving");
    node.addEventListener("animationend", () => node.remove(), { once: true }); };
  if (undo) {
    const btn = el("button.undo", { text: undo.label || "Undo" });
    btn.onclick = () => { undo.action(); dismiss(); };
    node.append(btn);
  }
  root.append(node);
  timer = setTimeout(dismiss, duration);
  return dismiss;
}

/* ================================================================== *
 *  Modals
 * ================================================================== */
const modalStack = [];

export function openModal({ title = "", subtitle = "", icon = "", body = null, actions = [],
                            wide = false, dismissable = true, onClose = null } = {}) {
  const root = $("#modal-root");
  const prevFocus = document.activeElement;

  const modal = el("div.modal" + (wide ? ".wide" : ""), { role: "dialog", "aria-modal": "true" });
  const head = el("div.modal-head");
  if (icon) head.append(el("div.m-ico", { text: icon }));
  const titleWrap = el("div");
  if (title) titleWrap.append(el("h2", { text: title }));
  if (subtitle) titleWrap.append(el("p", { text: subtitle }));
  head.append(titleWrap);
  if (dismissable) {
    const x = el("button.icon-btn.x", { "aria-label": "Close", html: closeIcon() });
    x.onclick = () => close();
    head.append(x);
  }
  modal.append(head);

  const bodyWrap = el("div.modal-body");
  if (typeof body === "string") bodyWrap.innerHTML = body;
  else if (body) bodyWrap.append(body);
  if (bodyWrap.childNodes.length) modal.append(bodyWrap);

  const foot = el("div.modal-foot");
  const controller = { close, modal, bodyEl: bodyWrap };
  for (const a of actions) {
    const btn = el("button.btn" + (a.variant ? "." + a.variant : ""), { text: a.label });
    if (a.id) btn.id = a.id;
    btn.onclick = () => { const r = a.onClick ? a.onClick(controller) : true; if (r !== false) close(); };
    foot.append(btn);
  }
  if (actions.length) modal.append(foot);

  const wrap = el("div.modal-wrap");
  wrap.append(modal);
  const scrim = el("div.modal-scrim");
  if (dismissable) scrim.onclick = () => close();

  const layer = el("div.modal-layer");
  layer.append(scrim, wrap);
  root.append(layer);
  root.classList.add("open");

  const releaseTrap = focusTrap(modal);
  function onKey(e) { if (e.key === "Escape" && dismissable) { e.preventDefault(); close(); } }
  document.addEventListener("keydown", onKey);
  modalStack.push(controller);

  // autofocus first field or primary button
  requestAnimationFrame(() => {
    const target = $("input,textarea,select,.btn.primary", modal) || $(".btn", modal);
    target && target.focus();
  });

  let closed = false;
  function close() {
    if (closed) return; closed = true;
    releaseTrap(); document.removeEventListener("keydown", onKey);
    const i = modalStack.indexOf(controller); if (i >= 0) modalStack.splice(i, 1);
    modal.style.opacity = "0"; modal.style.transform = "translateY(10px) scale(.98)";
    scrim.style.opacity = "0";
    setTimeout(() => {
      layer.remove();
      if (!root.children.length) root.classList.remove("open");
      onClose && onClose();
      prevFocus && prevFocus.focus && prevFocus.focus();
    }, 200);
  }
  return controller;
}

export function confirmModal({ title, subtitle = "", icon = "❓", body = "", confirmLabel = "Confirm",
                               cancelLabel = "Cancel", danger = false } = {}) {
  return new Promise(resolve => {
    openModal({
      title, subtitle, icon, body,
      dismissable: true, onClose: () => resolve(false),
      actions: [
        { label: cancelLabel, variant: "ghost", onClick: () => { resolve(false); return true; } },
        { label: confirmLabel, variant: danger ? "danger" : "primary",
          onClick: () => { resolve(true); return true; } },
      ],
    });
  });
}

export function inputModal({ title, subtitle = "", icon = "✏️", label = "", value = "",
                             placeholder = "", multiline = false, confirmLabel = "Save" } = {}) {
  return new Promise(resolve => {
    const field = multiline
      ? el("textarea", { rows: 4, placeholder })
      : el("input", { type: "text", placeholder, value });
    if (!multiline) field.value = value;
    const bodyEl = el("div");
    if (label) bodyEl.append(el("label", { text: label, style: "font-weight:600;color:var(--text)" }));
    bodyEl.append(field);
    let done = false;
    const ctrl = openModal({
      title, subtitle, icon, body: bodyEl, dismissable: true,
      onClose: () => { if (!done) resolve(null); },
      actions: [
        { label: "Cancel", variant: "ghost", onClick: () => { resolve(null); done = true; return true; } },
        { label: confirmLabel, variant: "primary",
          onClick: () => { done = true; resolve(field.value); return true; } },
      ],
    });
    if (!multiline) field.addEventListener("keydown", e => {
      if (e.key === "Enter") { done = true; resolve(field.value); ctrl.close(); }
    });
  });
}

/* ================================================================== *
 *  Lock gate
 * ================================================================== */
export function initLock({ onLogin, onUnlock }) {
  const lock = $("#lock");
  const form = $("#lock-form", lock);
  const input = $("#lock-secret", lock);
  const errEl = $("#lock-err", lock);
  const card = $(".lock-card", lock);
  const submit = $("#lock-submit", lock);
  const peek = $("#lock-peek", lock);
  let countdownTimer = null;

  peek.onclick = () => {
    input.type = input.type === "password" ? "text" : "password";
    peek.innerHTML = input.type === "password" ? eyeIcon() : eyeOffIcon();
    input.focus();
  };

  function setError(msg, warn = false) {
    errEl.textContent = msg || "";
    errEl.classList.toggle("warn", warn);
  }
  function shake() { card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake"); }

  function startCountdown(seconds) {
    clearInterval(countdownTimer);
    input.disabled = submit.disabled = true;
    let left = seconds;
    const tick = () => {
      if (left <= 0) {
        clearInterval(countdownTimer);
        input.disabled = submit.disabled = false;
        setError("");
        input.focus();
        return;
      }
      const m = Math.floor(left / 60), s = left % 60;
      setError(`Locked. Try again in ${m ? m + "m " : ""}${s}s`, true);
      left--;
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const pw = input.value;
    if (!pw) { shake(); setError("Enter the secret"); return; }
    submit.disabled = true; submit.innerHTML = '<span class="spinner"></span>';
    const r = await onLogin(pw);
    submit.innerHTML = "Unlock";
    if (r.ok) {
      lock.classList.add("leaving");
      await sleep(360);
      lock.hidden = true;
      input.value = "";
      onUnlock(r);
      return;
    }
    submit.disabled = false;
    shake(); input.select();
    if (r.status === 429 || r.locked) {
      startCountdown(r.retryAfter || 60);
    } else if (typeof r.remaining === "number") {
      setError(r.remaining > 0
        ? `Incorrect. ${r.remaining} ${r.remaining === 1 ? "try" : "tries"} left before lockout.`
        : "Incorrect.");
    } else {
      setError(r.error || "Incorrect secret");
    }
  };

  return {
    show() { lock.hidden = false; lock.classList.remove("leaving"); requestAnimationFrame(() => input.focus()); },
    hide() { lock.hidden = true; },
  };
}

/* ================================================================== *
 *  Theme engine
 * ================================================================== */
const SETTINGS_KEY = "roadmaps_settings_v1";
const ACCENTS = { violet: 265, indigo: 245, blue: 215, cyan: 190, teal: 172, green: 145,
  amber: 35, orange: 22, rose: 340 };
let settings = { theme: "auto", accent: "violet", accentHue: 265, roadmapAccent: "on",
  density: "cozy", motion: "on", sidebar: "expanded" };

export function loadSettings() {
  try { Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")); } catch {}
  applySettings();
  return settings;
}
export function getSettings() { return { ...settings }; }
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {} }

export function applySettings() {
  const root = document.documentElement;
  if (settings.theme === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", settings.theme);
  root.setAttribute("data-density", settings.density === "compact" ? "compact" : "cozy");
  root.setAttribute("data-motion", settings.motion === "off" ? "off" : "on");
  const h = (settings.accent === "custom" && Number.isFinite(settings.accentHue))
    ? settings.accentHue : (ACCENTS[settings.accent] ?? ACCENTS.violet);
  root.style.setProperty("--accent-h", h);
}
export function setSetting(key, value) { settings[key] = value; saveSettings(); applySettings(); }
export { ACCENTS };

/* ================================================================== *
 *  Sidebar
 * ================================================================== */
export function renderSidebar({ roadmaps, active, statsFor, onNavigate, expandedSlug }) {
  const list = $("#sb-list");
  list.innerHTML = "";

  // Global cross-roadmap "Today" digest.
  const onToday = location.hash.replace(/^#\/?/, "") === "today";
  const todayLink = el("a.sb-today" + (onToday ? ".active" : ""), { href: "#/today",
    "aria-current": onToday ? "true" : "false" });
  todayLink.append(el("span.sb-ico", { text: "📅" }));
  todayLink.append(el("span.sb-today-label", { text: "Today · all roadmaps" }));
  list.append(todayLink);

  list.append(el("div.sb-section-label", { text: "Roadmaps" }));

  for (const rm of roadmaps) {
    const st = statsFor ? statsFor(rm.slug) : { pct: 0, track: "on" };
    const item = el("button.sb-item", {
      "aria-current": rm.slug === active ? "true" : "false",
      title: rm.title, dataset: { slug: rm.slug },
    });
    item.append(el("span.sb-ico", { text: rm.icon }));
    const bodyEl = el("div.sb-item-body");
    bodyEl.append(el("div.sb-item-title", { text: rm.title }));
    const mini = el("div.sb-mini");
    const bar = el("div.bar"); bar.append(el("i", { style: `width:${st.pct}%` }));
    mini.append(bar, el("span.pct", { text: st.pct + "%" }));
    bodyEl.append(mini);
    item.append(bodyEl);
    item.append(el("span.track-dot." + (st.track || "on"), { title: trackLabel(st.track) }));
    item.onclick = () => onNavigate(rm.slug);
    list.append(item);

    // quick-jumps under the active/expanded roadmap
    if (rm.slug === (expandedSlug || active) && rm.weeks && rm.weeks.length) {
      const sub = el("div.sb-sub");
      sub.append(el("a", { href: `#/${rm.slug}/today`, text: "→ Today" }));
      for (const w of rm.weeks.slice(0, 8))
        sub.append(el("a", { href: `#/${rm.slug}/${w.id}`, text: w.title || w.id }));
      list.append(sub);
    }
  }
}
const trackLabel = t => ({ ahead: "Ahead of pace", on: "On track", behind: "Behind pace" }[t] || "On track");

/* ================================================================== *
 *  Settings drawer  (theme controls now; import/export wired in Phase 6)
 * ================================================================== */
let drawerHooks = {};
export function initDrawer(hooks = {}) {
  drawerHooks = hooks;
  const root = $("#drawer-root");
  $("#fab").addEventListener("click", openDrawer);
  $("#drawer-close").onclick = closeDrawer;
  $(".drawer-scrim", root).onclick = closeDrawer;
  document.addEventListener("keydown", e => { if (e.key === "Escape" && root.classList.contains("open")) closeDrawer(); });
  buildDrawerBody();
}
export function openDrawer() { buildDrawerBody(); $("#drawer-root").classList.add("open"); }
export function closeDrawer() { $("#drawer-root").classList.remove("open"); }

function buildDrawerBody() {
  const body = $("#drawer-body");
  body.innerHTML = "";

  // Appearance
  const appear = el("div.set-group");
  appear.append(el("h3", { text: "Appearance" }));
  appear.append(settingRow("Theme", null, segmented(["auto", "light", "dark"], settings.theme,
    v => setSetting("theme", v))));
  appear.append(settingRow("Accent", null, accentSwatches()));
  appear.append(settingRow("Custom hue", "Dial in any accent", hueSlider()));
  appear.append(settingRow("Roadmap colours", "Each roadmap keeps its own colour", toggle(settings.roadmapAccent !== "off",
    on => { setSetting("roadmapAccent", on ? "on" : "off"); drawerHooks.repaint && drawerHooks.repaint(); })));
  appear.append(settingRow("Density", null, segmented(["cozy", "compact"], settings.density,
    v => setSetting("density", v))));
  appear.append(settingRow("Motion", "Animations & transitions", toggle(settings.motion === "on",
    on => setSetting("motion", on ? "on" : "off"))));
  body.append(appear);

  body.append(el("hr.hr"));

  // Current roadmap — per-roadmap reset (per-roadmap export/import live on the hero)
  const activeTitle = drawerHooks.activeTitle && drawerHooks.activeTitle();
  if (activeTitle) {
    const one = el("div.set-group");
    one.append(el("h3", { text: "Current roadmap" }));
    one.append(el("p", { style: "color:var(--text-3);font-size:var(--t-xs);margin-bottom:var(--s2)", text: activeTitle }));
    one.append(rowButtons([
      { label: "Reset this roadmap", variant: "danger",
        onClick: () => drawerHooks.resetRoadmap && drawerHooks.resetRoadmap() },
    ]));
    body.append(one);
    body.append(el("hr.hr"));
  }

  // Journey (import/export/reset) — hooks provided by app.js
  const journey = el("div.set-group");
  journey.append(el("h3", { text: "Whole journey" }));
  journey.append(rowButtons([
    { label: "Export all", variant: "", onClick: () => drawerHooks.exportAll && drawerHooks.exportAll() },
    { label: "Import all", variant: "", onClick: () => drawerHooks.importAll && drawerHooks.importAll() },
  ]));
  journey.append(rowButtons([
    { label: "Reset everything", variant: "danger", onClick: () => drawerHooks.resetAll && drawerHooks.resetAll() },
  ]));
  body.append(journey);

  body.append(el("hr.hr"));

  // Session
  const session = el("div.set-group");
  session.append(el("h3", { text: "Session" }));
  const syncRow = settingRow("Sync", "—", el("span"));
  syncRow.id = "drawer-sync-row";
  session.append(syncRow);
  session.append(rowButtons([
    { label: "Sync now", variant: "", onClick: () => drawerHooks.syncNow && drawerHooks.syncNow() },
    { label: "Lock now", variant: "danger", onClick: () => drawerHooks.lock && drawerHooks.lock() },
  ]));
  body.append(session);

  const meta = el("div.set-group");
  meta.append(el("p", { style: "color:var(--text-3);font-size:var(--t-xs)",
    html: "Roadmaps · v1 · self-hosted, single-owner" }));
  body.append(meta);
}
export function refreshDrawer() { buildDrawerBody(); }

function settingRow(label, sub, control) {
  const row = el("div.set-row");
  const l = el("div.lbl", { text: label });
  if (sub) l.append(el("small", { text: sub }));
  row.append(l, control);
  return row;
}
function segmented(opts, current, onPick) {
  const seg = el("div.seg");
  for (const o of opts) {
    const b = el("button", { text: o, "aria-pressed": o === current ? "true" : "false" });
    b.onclick = () => { $$("button", seg).forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true"); onPick(o); };
    seg.append(b);
  }
  return seg;
}
function toggle(on, onChange) {
  const t = el("button.switch", { "aria-pressed": on ? "true" : "false", role: "switch" });
  t.onclick = () => { const now = t.getAttribute("aria-pressed") !== "true";
    t.setAttribute("aria-pressed", now ? "true" : "false"); onChange(now); };
  return t;
}
function accentSwatches() {
  const wrap = el("div.swatches");
  for (const [name, h] of Object.entries(ACCENTS)) {
    const s = el("button.swatch", { "aria-pressed": settings.accent === name ? "true" : "false",
      title: name, style: `background:hsl(${h} 85% 62%)` });
    s.onclick = () => { $$(".swatch", wrap).forEach(x => x.setAttribute("aria-pressed", "false"));
      s.setAttribute("aria-pressed", "true");
      settings.accentHue = h; setSetting("accent", name);
      const sl = $(".hue-slider"); if (sl) sl.value = String(h);
      drawerHooks.repaint && drawerHooks.repaint(); };
    wrap.append(s);
  }
  return wrap;
}
function hueSlider() {
  const start = settings.accent === "custom" && Number.isFinite(settings.accentHue)
    ? settings.accentHue : (ACCENTS[settings.accent] ?? ACCENTS.violet);
  const input = el("input.hue-slider", { type: "range", min: "0", max: "360", step: "1",
    value: String(start), "aria-label": "Custom accent hue" });
  input.oninput = () => {
    settings.accent = "custom"; settings.accentHue = Number(input.value);
    saveSettings(); applySettings();
    $$(".swatch").forEach(x => x.setAttribute("aria-pressed", "false"));
    drawerHooks.repaint && drawerHooks.repaint();
  };
  return input;
}
function rowButtons(btns) {
  const row = el("div", { style: "display:flex;gap:var(--s2);margin-top:var(--s2)" });
  for (const b of btns) {
    const btn = el("button.btn.block" + (b.variant ? "." + b.variant : ""), { text: b.label });
    btn.onclick = b.onClick; row.append(btn);
  }
  return row;
}
export function setDrawerSync(text, cls) {
  const row = $("#drawer-sync-row"); if (!row) return;
  const small = $(".lbl small", row); if (small) { small.textContent = text; }
}

/* ================================================================== *
 *  Draggable FAB (vertical); falls back to static on touch/small screens.
 * ================================================================== */
export function initFab() {
  const fab = $("#fab");
  const KEY = "roadmaps_fab_top";
  const saved = localStorage.getItem(KEY);
  if (saved && window.innerWidth > 860) { fab.style.top = saved; fab.style.transform = "none"; }
  let dragging = false, moved = false, startY = 0, startTop = 0;
  fab.addEventListener("pointerdown", e => {
    if (window.innerWidth <= 860) return;
    dragging = true; moved = false; startY = e.clientY;
    startTop = fab.getBoundingClientRect().top;
    fab.setPointerCapture(e.pointerId); fab.classList.add("dragging");
  });
  fab.addEventListener("pointermove", e => {
    if (!dragging) return;
    if (Math.abs(e.clientY - startY) > 3) moved = true;
    let top = startTop + (e.clientY - startY);
    top = Math.max(12, Math.min(window.innerHeight - 64, top));
    fab.style.top = top + "px"; fab.style.transform = "none";
  });
  fab.addEventListener("pointerup", e => {
    if (!dragging) return;
    dragging = false; fab.classList.remove("dragging");
    if (moved) { localStorage.setItem(KEY, fab.style.top); const stop = ev => ev.stopPropagation();
      fab.addEventListener("click", stop, { capture: true, once: true }); }
  });
}

/* ================================================================== *
 *  Inline icons
 * ================================================================== */
export const checkIcon = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>`;
const closeIcon = () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const eyeIcon = () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeOffIcon = () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 4.2A10.9 10.9 0 0112 4c6.5 0 10 7 10 7a17.8 17.8 0 01-3.2 4.2M6.6 6.6A17.8 17.8 0 002 11s3.5 7 10 7a10.9 10.9 0 003.1-.4"/></svg>`;
export { closeIcon, eyeIcon, eyeOffIcon };
