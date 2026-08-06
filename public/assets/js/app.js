// app.js — bootstrap the shell: gate → load/reconcile → validate → render.
// Owns hash routing, sidebar/sync updates, and import/export/reset IO.
//
// Static import of the roadmap content registers every roadmap before boot.

import "../../roadmaps/_index.js";

import { getRoadmaps, getRoadmap, validateAll } from "./registry.js";
import * as store from "./store.js";
import * as sync from "./sync.js";
import { renderRoadmap, renderToday, setRenderHooks, rerender, initDayRest } from "./render.js";
import { renderInsights } from "./insights.js";
import { renderBookmarks } from "./bookmarks.js";
import { sidebarStats, dayDate } from "./stats.js";
import { reconcile } from "./reconcile.js";
import {
  initLock, loadSettings, initDrawer, initFab, initTutorials, renderSidebar,
  toast, confirmModal, setDrawerSync, closeDrawer,
} from "./ui.js";
import { $, debounce, downloadJSON, pickFile, readFileText, todayStr } from "./util.js";

let activeSlug = null;
let sidebarExpandedSlug = null;         // which roadmap's sidebar quick-jumps are open (togglable)
let lock = null;
let routeWired = false;                 // hashchange listener registered once (survives re-unlock)

document.addEventListener("DOMContentLoaded", boot);

async function boot() {
  loadSettings();
  initFab();
  initTutorials();
  initDayRest();
  initDrawer(drawerHooks());
  setRenderHooks({ exportRoadmap: exportRoadmapIO, importRoadmap: importRoadmapIO });

  // The DB (via sync.php) is the single source of truth for journey data — the
  // store only mirrors it in memory for the session. Wire the write-through sink.
  store.setSink((slug, change) => sync.queueChange(slug, change));
  store.onChange(debounce(() => { updateSidebar(); }, 120));

  sync.onSyncStatus(s => { updateSyncPill(s); setDrawerSync(syncLabel(s)); });
  sync.installExitFlush();

  lock = initLock({ onLogin: p => sync.login(p), onUnlock: () => startApp() });

  wireChrome();

  const st = await sync.status();
  // Auth is now known — drop the neutral boot splash before revealing lock/app,
  // so an authenticated reload goes splash → dashboard (never a login-box flash).
  const bootEl = $("#boot"); if (bootEl) bootEl.hidden = true;
  if (!st.available) { lock.show(); showBackendRequired(); return; }  // no DB → can't run
  if (!st.authed) { lock.show(); return; }
  startApp();
}

function showBackendRequired() {
  const err = $("#lock-err");
  if (err) {
    err.textContent = "Backend not reachable. Journey data lives in the database — start the PHP server and reload.";
    err.classList.add("warn");
  }
}

async function startApp() {
  $("#lock").hidden = true;
  $("#app").hidden = false;

  const loaded = await sync.loadAndReconcile();
  if (loaded && loaded.error) toast("Couldn't load your journey from the database.", { type: "bad" });

  const problems = validateAll();
  if (problems.length) showDevError(problems);

  const roadmaps = getRoadmaps();
  // Reconcile stored journey against current content (DESIGN §7.4): apply id
  // aliases, then prune rows whose referent no longer exists so counts stay
  // truthful and the DB doesn't drift. Runs before first render.
  for (const rm of roadmaps) reconcile(rm);

  if (!roadmaps.length) { $("#view").innerHTML =
    `<div class="center-note"><div class="big">🗺️</div>No roadmaps registered yet.<br>Add one in <code>roadmaps/</code>.</div>`;
    return; }

  // Register the router once — startApp() runs again after every lock→unlock, so
  // re-adding it each time would fire route() N times per navigation.
  if (!routeWired) { window.addEventListener("hashchange", route); routeWired = true; }
  setupGoTop();
  route();
  updateSidebar();
}

/* Floating "scroll to top" button, shown once #main is scrolled past the fold.
 * Wired once (survives lock→unlock). #main is the scroll container, not window.
 * Sits bottom-right; CSS stacks it above the settings FAB on mobile. */
let goTopWired = false;
function setupGoTop() {
  if (goTopWired) return;
  const main = document.getElementById("main");
  const host = document.body;
  if (!main || !host) return;
  goTopWired = true;
  const btn = document.createElement("button");
  btn.id = "gotop";
  btn.type = "button";
  btn.setAttribute("aria-label", "Scroll to top");
  btn.title = "Go to top";
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
  host.appendChild(btn);
  const refresh = () => btn.classList.toggle("show", main.scrollTop > 240);
  main.addEventListener("scroll", refresh, { passive: true });
  btn.addEventListener("click", () => {
    const noMotion = document.documentElement.getAttribute("data-motion") === "off"
      || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    main.scrollTo({ top: 0, behavior: noMotion ? "auto" : "smooth" });
  });
  refresh();
}

/* ================================================================== *
 *  Routing  (#/slug , #/slug/today , #/slug/weekId)
 * ================================================================== */
/* Is a view-crossfade wanted right now? (motion on, OS doesn't say reduce, and
 * the browser supports the View Transitions API). */
function crossfadeOK() {
  if (document.documentElement.getAttribute("data-motion") === "off") return false;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return typeof document.startViewTransition === "function";
}
/* Swap the main view with a smooth crossfade when switching roadmap/section.
 * `paint(animate)` does the actual render — inside a view transition the per-block
 * entrance cascade is suppressed (the crossfade owns the motion); as a fallback
 * (no API / motion off) the cascade plays instead so there's still an entrance. */
function swapView(paint) {
  if (crossfadeOK()) document.startViewTransition(() => paint(false));
  else paint(true);
}

// slug → renderer for the global (non-roadmap) views; their slugs are reserved.
const GLOBAL_VIEWS = { today: renderToday, insights: renderInsights, bookmarks: renderBookmarks };

function route() {
  const roadmaps = getRoadmaps();
  const hash = location.hash.replace(/^#\/?/, "");
  const [slug, sub] = hash.split("/");

  // Global cross-roadmap views: #/today digest, #/insights analytics, #/bookmarks.
  // (These slugs are reserved — validateAll forbids a roadmap from claiming one.)
  const globalView = GLOBAL_VIEWS[slug];
  if (globalView && !sub) {
    activeSlug = null;
    sidebarExpandedSlug = null;      // no roadmap quick-jumps expanded on a global view
    swapView(() => { globalView($("#view")); updateSidebar(); scrollMainTop(); });
    closeMobileSidebar();
    return;
  }

  let rm = slug && getRoadmap(slug);
  if (!rm) {
    const last = localStorage.getItem("roadmaps_last") || (roadmaps[0] && roadmaps[0].slug);
    rm = getRoadmap(last) || roadmaps[0];
    if (rm) { location.hash = `#/${rm.slug}`; return; }
  }
  activeSlug = rm.slug;
  sidebarExpandedSlug = rm.slug;     // viewing a roadmap expands its quick-jumps by default
  localStorage.setItem("roadmaps_last", rm.slug);
  swapView(animate => {
    renderRoadmap(rm, $("#view"), { animate });
    updateSidebar();
    // A fresh section switch must not inherit the previous view's scroll (paint()
    // preserves scrollTop for in-place tick updates). Reset, then land on the
    // day the user is actually on.
    scrollMainTop();
    if (sub) requestAnimationFrame(() => scrollToSub(rm, sub));
    else requestAnimationFrame(() => scrollToCurrentDay(rm));
  });
  closeMobileSidebar();
}
function scrollMainTop() { const m = document.getElementById("main"); if (m) m.scrollTop = 0; }

// Repaint whatever view is active after a settings / import / reset action. A
// roadmap updates in place via rerender() (no entrance cascade, stable scroll);
// the global Today/Insights views keep no persistent `cur` in render.js, so
// rerender() there would wrongly stamp the LAST roadmap into #view — re-run the
// router instead to repaint the correct global view.
function repaintView() {
  if (activeSlug) { rerender(); updateSidebar(); }
  else route();
}
/* Land on the day the user is currently on: today's day, else the nearest
 * upcoming day, else (roadmap already finished) its last day. Falls back to the
 * top when the card isn't found. */
function scrollToCurrentDay(rm) {
  const today = todayStr();
  const eff = d => dayDate(rm, rm.slug, d);
  const target = rm.days.find(d => eff(d) === today)
    || rm.days.find(d => eff(d) >= today)
    || rm.days[rm.days.length - 1];
  const node = target && $(`.day[data-day="${cssEsc(target.id)}"]`);
  // Center the day in the viewport (a tall card that can't fit just sits with its
  // top in view) so it lands with breathing room above, not flush at the edge.
  if (node) { openCard(node); node.scrollIntoView({ block: "center" }); }
}
function scrollToSub(rm, sub) {
  let targetDay = null;
  if (sub === "today") { const ts = todayStr(); const eff = d => dayDate(rm, rm.slug, d);
    targetDay = rm.days.find(d => eff(d) === ts) || rm.days.find(d => eff(d) >= ts); }
  else { const wk = rm.weeksById.get(sub); if (wk) targetDay = rm.days.find(d => d.week === sub); }
  if (targetDay) {
    const node = $(`.day[data-day="${cssEsc(targetDay.id)}"]`);
    if (node) { openCard(node); node.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }
}
/** Open a day card the way the user would: trigger its own toggle so aria-expanded
 *  and the persisted open-set stay in sync (adding `.open` by hand desyncs both). */
function openCard(node) {
  if (node.classList.contains("open")) return;
  const head = node.querySelector(".day-head");
  if (head) head.click(); else node.classList.add("open");
}
const cssEsc = s => (window.CSS && CSS.escape) ? CSS.escape(s) : String(s).replace(/[^\w-]/g, "\\$&");
function navigate(slug) { location.hash = `#/${slug}`; }

// Sidebar click: navigating to a different roadmap opens its quick-jumps; clicking
// the roadmap you're already viewing TOGGLES its quick-jumps (so an expanded
// section can be collapsed in place, not only replaced by expanding another).
function onSidebarNav(slug) {
  if (slug === activeSlug) {
    sidebarExpandedSlug = sidebarExpandedSlug === slug ? null : slug;
    updateSidebar();
  } else {
    sidebarExpandedSlug = slug;
    navigate(slug);
  }
}

/* ================================================================== *
 *  Sidebar + sync pill
 * ================================================================== */
function updateSidebar() {
  renderSidebar({
    roadmaps: getRoadmaps(), active: activeSlug,
    statsFor: slug => { try { return sidebarStats(getRoadmap(slug)); } catch { return { pct: 0, track: "on" }; } },
    onNavigate: onSidebarNav, expandedSlug: sidebarExpandedSlug,
  });
}
function updateSyncPill(s) {
  const pill = $("#sync-pill"); if (!pill) return;
  pill.className = "sync-pill " + s;
  $("#sync-pill-text").textContent = syncLabel(s);
}
const syncLabel = s => ({ online: "Saved", saving: "Saving…", offline: "Offline", error: "Save error" }[s] || s);

/* ================================================================== *
 *  Chrome wiring (sidebar collapse, mobile, dev banner)
 * ================================================================== */
function wireChrome() {
  const app = $("#app");
  const collapseBtn = $("#sb-collapse");
  // keep the button's tooltip + a11y label in sync with the current state
  const syncCollapseBtn = () => {
    const collapsed = app.dataset.sidebar === "collapsed";
    collapseBtn.title = collapsed ? "Expand" : "Collapse";
    collapseBtn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  };
  // restore collapse state
  if (localStorage.getItem("roadmaps_sidebar") === "collapsed") app.dataset.sidebar = "collapsed";
  syncCollapseBtn();
  collapseBtn.onclick = () => {
    const collapsed = app.dataset.sidebar === "collapsed";
    app.dataset.sidebar = collapsed ? "expanded" : "collapsed";
    localStorage.setItem("roadmaps_sidebar", app.dataset.sidebar);
    syncCollapseBtn();
  };
  const menu = $("#menu-btn"); if (menu) menu.onclick = () => app.dataset.mobile = app.dataset.mobile === "open" ? "closed" : "open";
  const scrim = $("#sb-scrim"); if (scrim) scrim.onclick = closeMobileSidebar;
  $("#dev-error-close") && ($("#dev-error-close").onclick = () => $("#dev-error").classList.remove("show"));
}
function closeMobileSidebar() { const app = $("#app"); if (app.dataset.mobile === "open") app.dataset.mobile = "closed"; }

function showDevError(problems) {
  const box = $("#dev-error");
  box.innerHTML = `<b>⚠ Roadmap validation (${problems.length})</b>\n` + problems.join("\n") +
    `\n\n<button class="btn sm" id="dev-error-close">Dismiss</button>`;
  box.classList.add("show");
  $("#dev-error-close").onclick = () => box.classList.remove("show");
}

/* ================================================================== *
 *  Import / export / reset IO
 * ================================================================== */
function drawerHooks() {
  return {
    exportAll: exportAllIO, importAll: importAllIO,
    resetAll: resetAllIO,
    resetRoadmap: resetRoadmapIO,
    activeTitle: () => { const rm = getRoadmap(activeSlug); return rm ? rm.title : null; },
    repaint: () => repaintView(),
    syncNow: async () => { await sync.flush(); await sync.loadAndReconcile(); repaintView(); toast("Synced", { type: "ok" }); },
    lock: lockNowIO,
  };
}

async function resetRoadmapIO() {
  const rm = getRoadmap(activeSlug); if (!rm) return;
  const ok = await confirmModal({ title: `Reset ${rm.title}?`, icon: "🗑️", danger: true,
    body: "Clears all ticks, moves and notes for this roadmap only. A stash is kept on the server.",
    confirmLabel: "Reset this roadmap", });
  if (!ok) return;
  const ids = Object.keys(store.rawState()[activeSlug] || {});
  store.resetRoadmap(activeSlug);
  if (ids.length) await sync.saveRoadmapFull(activeSlug, ids.map(id => ({ id, value: null })),
    { stashFirst: true, reason: "reset-roadmap" });
  closeDrawer(); repaintView(); toast("Roadmap reset", { type: "ok" });
}

function exportRoadmapIO(slug) {
  downloadJSON(`roadmap-${slug}-${todayStr()}.json`, store.exportRoadmap(slug));
  toast("Exported this roadmap", { type: "ok" });
}
function exportAllIO() {
  downloadJSON(`journey-${todayStr()}.json`, store.exportAll());
  toast("Exported whole journey", { type: "ok" });
}

async function importRoadmapIO(slug) {
  const file = await pickFile(); if (!file) return;
  let doc; try { doc = JSON.parse(await readFileText(file)); } catch { toast("Not valid JSON", { type: "bad" }); return; }
  const items = doc.scope === "roadmap" ? doc.items
    : (doc.scope === "all" && doc.state) ? doc.state[slug]
    : doc.items || (doc.state && doc.state[slug]);
  if (!items) { toast("No matching roadmap data in file", { type: "bad" }); return; }
  const ok = await confirmModal({ title: "Import into this roadmap?", icon: "⬇️", danger: true,
    subtitle: getRoadmap(slug).title,
    body: "This replaces your current progress for this roadmap. A safety copy is stashed on the server first.",
    confirmLabel: "Replace", });
  if (!ok) return;
  const before = Object.keys(store.rawState()[slug] || {});
  store.importRoadmap(slug, items);
  const after = store.rawState()[slug] || {};
  const changes = [];
  for (const id of before) if (!(id in after)) changes.push({ id, value: null });
  for (const [id, cell] of Object.entries(after)) changes.push({ id, kind: cell.kind, value: cell.value });
  await sync.saveRoadmapFull(slug, changes, { stashFirst: true, reason: "roadmap-import" });
  repaintView(); toast("Imported", { type: "ok" });
}

async function importAllIO() {
  const file = await pickFile(); if (!file) return;
  let doc; try { doc = JSON.parse(await readFileText(file)); } catch { toast("Not valid JSON", { type: "bad" }); return; }
  const full = doc.scope === "all" ? doc.state : (doc.scope === "roadmap" && doc.slug ? { [doc.slug]: doc.items } : null);
  if (!full) { toast("Unrecognized journey file", { type: "bad" }); return; }
  const ok = await confirmModal({ title: "Import whole journey?", icon: "⬇️", danger: true,
    body: "This replaces ALL progress and saved bookmarks across every roadmap. A safety copy is stashed on the server first.",
    confirmLabel: "Replace everything", });
  if (!ok) return;
  store.importAll(full);
  await sync.saveFull(store.toFlatMap(), { stashFirst: true, reason: "journey-import" });
  closeDrawer(); repaintView(); toast("Journey imported", { type: "ok" });
}

async function resetAllIO() {
  const ok = await confirmModal({ title: "Reset everything?", icon: "🗑️", danger: true,
    body: "Clears all ticks, moves, notes and saved bookmarks across every roadmap. A stash is kept on the server. This can't be undone locally.",
    confirmLabel: "Reset all", });
  if (!ok) return;
  const snapshot = store.rawState();
  const deletes = {};
  for (const [slug, bucket] of Object.entries(snapshot)) deletes[slug] = Object.keys(bucket || {});
  store.resetAll();
  for (const [slug, ids] of Object.entries(deletes))
    if (ids.length) await sync.saveRoadmapFull(slug, ids.map(id => ({ id, value: null })), { stashFirst: true, reason: "reset-all" });
  closeDrawer(); repaintView(); toast("Everything reset", { type: "ok" });
}

async function lockNowIO() {
  await sync.logout();
  closeDrawer();
  $("#app").hidden = true;
  lock.show();
}
