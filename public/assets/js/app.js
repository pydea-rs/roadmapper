// app.js — bootstrap the shell: gate → load/reconcile → validate → render.
// Owns hash routing, sidebar/sync updates, and import/export/reset IO.
//
// Static import of the roadmap content registers every roadmap before boot.

import "../../roadmaps/_index.js";

import { getRoadmaps, getRoadmap, validateAll } from "./registry.js";
import * as store from "./store.js";
import * as sync from "./sync.js";
import { renderRoadmap, renderToday, setRenderHooks, rerender, initDayRest, releaseView, revealDay, currentDayOf } from "./render.js";
import { renderInsights } from "./insights.js";
import { renderBookmarks } from "./bookmarks.js";
import { renderHorizon } from "./horizon.js";
import { closeLens } from "./atlas.js";
import { sidebarStats, dayDate } from "./stats.js";
import { reconcile } from "./reconcile.js";
import {
  initLock, loadSettings, initDrawer, initFab, initTutorials, renderSidebar,
  toast, confirmModal, setDrawerSync, closeDrawer, closeAllModals, refreshDrawer,
} from "./ui.js";
import { $, debounce, downloadJSON, pickFile, readFileText, todayStr } from "./util.js";

let activeSlug = null;
let sidebarExpandedSlug = null;         // which roadmap's sidebar quick-jumps are open (togglable)
let lock = null;
let routeWired = false;                 // hashchange listener registered once (survives re-unlock)
let lastPaintDay = null;                // the local date the current view was drawn for (rollover check)

document.addEventListener("DOMContentLoaded", boot);

// PWA: register the service worker (installability + offline app-shell). It only
// caches the static shell — journey data still flows through the auth-gated
// backend. Resolved from this module's URL so it works under any base path, and
// deferred to window `load` so it never competes with the initial render.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("../../sw.js", import.meta.url).href).catch(() => {});
  });
}

async function boot() {
  window.__roadmapsBooted = true;        // index.php's start-up watchdog reads this
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
  // The session expired while the app was open (sessions last a fixed number of days
  // from login). Ask to sign in again; queued changes stay in memory and are written
  // by startApp's load (which flushes first) right after the unlock.
  sync.onAuthExpired(() => {
    closeAllModals(); closeLens(true); closeDrawer();
    $("#app").hidden = true;
    lock.show("Your session expired — sign in again. Unsaved changes are kept and will be saved.");
  });

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
  // aliases, then hide rows whose referent no longer exists so counts stay truthful
  // (in memory only — see reconcile.js). Runs before first render.
  reconcileAll();

  if (!roadmaps.length) { $("#view").innerHTML =
    `<div class="center-note"><div class="big">🗺️</div>No roadmaps registered yet.<br>Add one in <code>roadmaps/</code>.</div>`;
    return; }

  // Register the router once — startApp() runs again after every lock→unlock, so
  // re-adding it each time would fire route() N times per navigation.
  if (!routeWired) { window.addEventListener("hashchange", onHashChange); routeWired = true; wireLiveRefresh(); }
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

function reconcileAll() { for (const rm of getRoadmaps()) reconcile(rm); }

// A real navigation (link, Back/Forward): dialogs and menus opened for the previous
// view must not stay up acting on a view that is gone; an open settings drawer
// re-reads which roadmap is current.
function onHashChange() {
  closeAllModals();
  route();
  refreshDrawer();
}

/* ---- keeping a long-open tab current -------------------------------------
 * The app is often left open for days (an installed PWA). Two things go stale:
 *  - the DATE: "Today", overdue flags, streaks and the effort panel are computed at
 *    paint time, so crossing midnight must repaint;
 *  - the DATA: another device may have saved since this tab loaded. Re-adopting the
 *    DB copy when the tab comes back matters beyond display — a tick made on a stale
 *    copy would re-stamp done_at and flip an on-time task to late. */
const REFRESH_AFTER_MS = 5 * 60 * 1000;
let liveWired = false, hiddenAt = 0;
function wireLiveRefresh() {
  if (liveWired) return;
  liveWired = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") { hiddenAt = Date.now(); return; }
    if ($("#app").hidden) return;
    if (hiddenAt && Date.now() - hiddenAt >= REFRESH_AFTER_MS) refreshFromServer();
    else checkRollover();
  });
  setInterval(checkRollover, 60 * 1000);
}
function checkRollover() {
  if ($("#app").hidden || document.visibilityState === "hidden") return;
  if (lastPaintDay && todayStr() !== lastPaintDay) repaintView();
}
/** Re-adopt the DB copy, re-reconcile, repaint. Returns the load result. */
async function refreshFromServer() {
  const loaded = await sync.loadAndReconcile();
  if (loaded && loaded.auth) return loaded;          // the lock gate is already up
  if (!(loaded && loaded.error)) reconcileAll();
  if (!$("#app").hidden) repaintView();
  return loaded || {};
}

// slug → renderer for the global (non-roadmap) views; their slugs are reserved.
const GLOBAL_VIEWS = { today: renderToday, insights: renderInsights, horizon: renderHorizon, bookmarks: renderBookmarks };

function route() {
  const roadmaps = getRoadmaps();
  const hash = location.hash.replace(/^#\/?/, "");
  const [slug, sub] = hash.split("/");

  // Global cross-roadmap views: #/today digest, #/insights analytics, #/horizon (every
  // day ahead), #/bookmarks.
  // (These slugs are reserved — validateAll forbids a roadmap from claiming one.)
  const globalView = GLOBAL_VIEWS[slug];
  if (globalView && !sub) {
    activeSlug = null;
    sidebarExpandedSlug = null;      // no roadmap quick-jumps expanded on a global view
    lastPaintDay = todayStr();
    swapView(() => { releaseView($("#view")); globalView($("#view")); updateSidebar(); scrollMainTop(); });
    closeMobileSidebar();
    return;
  }

  let rm = slug && getRoadmap(slug);
  if (!rm) {
    let saved = null; try { saved = localStorage.getItem("roadmaps_last"); } catch {}
    const last = saved || (roadmaps[0] && roadmaps[0].slug);
    rm = getRoadmap(last) || roadmaps[0];
    if (rm) { location.hash = `#/${rm.slug}`; return; }
  }
  activeSlug = rm.slug;
  sidebarExpandedSlug = rm.slug;     // viewing a roadmap expands its quick-jumps by default
  lastPaintDay = todayStr();
  try { localStorage.setItem("roadmaps_last", rm.slug); } catch {}
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
  lastPaintDay = todayStr();
  if (activeSlug) { rerender(); updateSidebar(); return; }
  // A global view: redraw it in place, keeping the scroll position (re-running the
  // router would jump back to the top).
  const slug = location.hash.replace(/^#\/?/, "").split("/")[0];
  const globalView = GLOBAL_VIEWS[slug];
  if (!globalView) { route(); return; }
  const main = document.getElementById("main");
  const top = main ? main.scrollTop : 0;
  releaseView($("#view")); globalView($("#view")); updateSidebar();
  if (main) main.scrollTop = top;
}
/* Land on the day the user is currently on: today's day, else the nearest
 * upcoming day, else (roadmap already finished) its last day — in whichever journey
 * layout is drawn (render.revealDay opens the card, or finds the Atlas column). It
 * sits centred in the viewport so it lands with breathing room above. */
function scrollToCurrentDay(rm) {
  const target = currentDayOf(rm);
  if (target) revealDay(target.id, { block: "center" });
}
/* #/slug/today, #/slug/<weekId> or #/slug/<dayId> */
function scrollToSub(rm, sub) {
  let targetDay = null;
  if (sub === "today") { const ts = todayStr(); const eff = d => dayDate(rm, rm.slug, d);
    targetDay = rm.days.find(d => eff(d) === ts) || rm.days.find(d => eff(d) >= ts); }
  else if (rm.daysById.has(sub)) targetDay = rm.daysById.get(sub);
  else { const wk = rm.weeksById.get(sub); if (wk) targetDay = rm.days.find(d => d.week === sub); }
  if (targetDay) {
    const block = rm.daysById.has(sub) ? "center" : "start";
    revealDay(targetDay.id, { behavior: "smooth", block });
  } else if (sub === "today") {
    scrollToCurrentDay(rm);            // a finished roadmap has no day today or later: land on its last day
  }
}
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
    syncNow: async () => {
      const r = await refreshFromServer();          // flushes queued writes first
      if (r.auth) return;                           // the lock gate explains it
      if (r.error) toast("Couldn't reach the database — your changes are kept and will retry.", { type: "bad" });
      else if (sync.hasPending()) toast("Some changes are still waiting to be saved.", { type: "bad" });
      else toast("Synced", { type: "ok" });
    },
    lock: lockNowIO,
  };
}

/** A bulk save failed: say so, and re-adopt the DB so the screen shows what is
 *  really stored (never a local-only "success" that a reload would undo). */
async function bulkFailed(what) {
  toast(`${what} failed — nothing was changed on the server.`, { type: "bad" });
  await refreshFromServer();
}

async function resetRoadmapIO() {
  const rm = getRoadmap(activeSlug); if (!rm) return;
  const slug = rm.slug;
  const ok = await confirmModal({ title: `Reset ${rm.title}?`, icon: "🗑️", danger: true,
    body: "Clears all ticks, moves and notes for this roadmap only. A stash is kept on the server.",
    confirmLabel: "Reset this roadmap", });
  if (!ok) return;
  // Unsaved queued changes for this roadmap would otherwise flush AFTER the reset and
  // resurrect part of it. The server clears every row of the roadmap — including rows
  // this tab never loaded — after stashing them.
  sync.dropQueued(slug);
  const r = await sync.saveRoadmapFull(slug, [], { stashFirst: true, reason: "reset-roadmap", clear: true });
  if (!r.ok) { if (r.error !== "auth") await bulkFailed("Reset"); return; }
  store.resetRoadmap(slug);
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
  if (!doc || typeof doc !== "object") { toast("Unrecognized roadmap file", { type: "bad" }); return; }
  const items = doc.scope === "roadmap" ? doc.items
    : (doc.scope === "all" && doc.state) ? doc.state[slug]
    : doc.items || (doc.state && doc.state[slug]);
  if (!items || typeof items !== "object") { toast("No matching roadmap data in file", { type: "bad" }); return; }
  const ok = await confirmModal({ title: "Import into this roadmap?", icon: "⬇️", danger: true,
    subtitle: getRoadmap(slug).title,
    body: "This replaces your current progress for this roadmap. A safety copy is stashed on the server first.",
    confirmLabel: "Replace", });
  if (!ok) return;
  sync.dropQueued(slug);
  store.importRoadmap(slug, items);
  const changes = Object.entries(store.rawState()[slug] || {})
    .map(([id, cell]) => ({ id, kind: cell.kind, value: cell.value }));
  // clear:true — the imported rows REPLACE the roadmap server-side, not merge into it
  const r = await sync.saveRoadmapFull(slug, changes, { stashFirst: true, reason: "roadmap-import", clear: true });
  if (!r.ok) { if (r.error !== "auth") await bulkFailed("Import"); return; }
  reconcileAll();
  repaintView();
  toast(r.rejected && r.rejected.length ? `Imported — ${r.rejected.length} invalid entr${r.rejected.length === 1 ? "y was" : "ies were"} skipped` : "Imported",
    { type: r.rejected && r.rejected.length ? "bad" : "ok" });
}

async function importAllIO() {
  const file = await pickFile(); if (!file) return;
  let doc; try { doc = JSON.parse(await readFileText(file)); } catch { toast("Not valid JSON", { type: "bad" }); return; }
  const full = !doc || typeof doc !== "object" ? null
    : doc.scope === "all" ? doc.state : (doc.scope === "roadmap" && doc.slug ? { [doc.slug]: doc.items } : null);
  if (!full || typeof full !== "object") { toast("Unrecognized journey file", { type: "bad" }); return; }
  const ok = await confirmModal({ title: "Import whole journey?", icon: "⬇️", danger: true,
    body: "This replaces ALL progress and saved bookmarks across every roadmap. A safety copy is stashed on the server first.",
    confirmLabel: "Replace everything", });
  if (!ok) return;
  sync.dropQueued();
  store.importAll(full);
  const r = await sync.saveFull(store.toFlatMap(), { stashFirst: true, reason: "journey-import" });
  if (!r.ok) { if (r.error !== "auth") await bulkFailed("Import"); return; }
  if (r.skipped) {
    // the server refuses to replace a populated journey with an empty file
    toast("That file has no progress in it — your journey was left unchanged.", { type: "bad" });
    await refreshFromServer();
    return;
  }
  reconcileAll();
  closeDrawer(); repaintView(); toast("Journey imported", { type: "ok" });
}

async function resetAllIO() {
  const ok = await confirmModal({ title: "Reset everything?", icon: "🗑️", danger: true,
    body: "Clears all ticks, moves, notes and saved bookmarks across every roadmap. A stash is kept on the server. This can't be undone locally.",
    confirmLabel: "Reset all", });
  if (!ok) return;
  sync.dropQueued();
  const r = await sync.clearAll({ reason: "reset-all" });
  if (!r.ok) { if (r.error !== "auth") await bulkFailed("Reset"); return; }
  store.resetAll();
  closeDrawer(); repaintView(); toast("Everything reset", { type: "ok" });
}

async function lockNowIO() {
  await sync.flush();                    // don't strand queued changes behind the lock
  await sync.logout();
  closeAllModals(); closeLens(true); closeDrawer();
  $("#app").hidden = true;
  lock.show();
}
