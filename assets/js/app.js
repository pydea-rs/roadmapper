// app.js — bootstrap the shell: gate → load/reconcile → validate → render.
// Owns hash routing, sidebar/sync updates, and import/export/reset IO.
//
// Static import of the roadmap content registers every roadmap before boot.

import "../../roadmaps/_index.js";

import { getRoadmaps, getRoadmap, validateAll } from "./registry.js";
import * as store from "./store.js";
import * as sync from "./sync.js";
import { renderRoadmap, setRenderHooks, rerender } from "./render.js";
import { sidebarStats } from "./stats.js";
import {
  initLock, loadSettings, initDrawer, initFab, renderSidebar,
  toast, confirmModal, setDrawerSync, refreshDrawer, closeDrawer,
} from "./ui.js";
import { $, debounce, downloadJSON, pickFile, readFileText, todayStr, daysBetween } from "./util.js";

let activeSlug = null;
let lock = null;

document.addEventListener("DOMContentLoaded", boot);

async function boot() {
  loadSettings();
  initFab();
  initDrawer(drawerHooks());
  setRenderHooks({ exportRoadmap: exportRoadmapIO, importRoadmap: importRoadmapIO });

  store.loadLocal();
  store.setSink((slug, change) => sync.queueChange(slug, change));
  store.onChange(debounce(() => { updateSidebar(); }, 120));

  sync.onSyncStatus(s => { updateSyncPill(s); setDrawerSync(syncLabel(s)); });
  sync.installExitFlush();

  lock = initLock({ onLogin: p => sync.login(p), onUnlock: () => startApp() });

  wireChrome();

  const st = await sync.status();
  if (st.available && !st.authed) { lock.show(); return; }
  // server says authed, OR no server (local-only) → open the app
  startApp();
}

async function startApp() {
  $("#lock").hidden = true;
  $("#app").hidden = false;

  await sync.loadAndReconcile();

  const problems = validateAll();
  if (problems.length) showDevError(problems);

  const roadmaps = getRoadmaps();
  if (!roadmaps.length) { $("#view").innerHTML =
    `<div class="center-note"><div class="big">🗺️</div>No roadmaps registered yet.<br>Add one in <code>roadmaps/</code>.</div>`;
    return; }

  window.addEventListener("hashchange", route);
  route();
  updateSidebar();
}

/* ================================================================== *
 *  Routing  (#/slug , #/slug/today , #/slug/weekId)
 * ================================================================== */
function route() {
  const roadmaps = getRoadmaps();
  const hash = location.hash.replace(/^#\/?/, "");
  const [slug, sub] = hash.split("/");
  let rm = slug && getRoadmap(slug);
  if (!rm) {
    const last = localStorage.getItem("roadmaps_last") || (roadmaps[0] && roadmaps[0].slug);
    rm = getRoadmap(last) || roadmaps[0];
    if (rm) { location.hash = `#/${rm.slug}`; return; }
  }
  activeSlug = rm.slug;
  localStorage.setItem("roadmaps_last", rm.slug);
  renderRoadmap(rm, $("#view"));
  updateSidebar();
  closeMobileSidebar();

  if (sub) requestAnimationFrame(() => scrollToSub(rm, sub));
}
function scrollToSub(rm, sub) {
  let targetDay = null;
  if (sub === "today") targetDay = rm.days.find(d => d.date === todayStr()) || rm.days.find(d => d.date >= todayStr());
  else { const wk = rm.weeksById.get(sub); if (wk) targetDay = rm.days.find(d => d.week === sub); }
  if (targetDay) {
    const node = $(`.day[data-day="${cssEsc(targetDay.id)}"]`);
    if (node) { node.classList.add("open"); node.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }
}
const cssEsc = s => (window.CSS && CSS.escape) ? CSS.escape(s) : s;
function navigate(slug) { location.hash = `#/${slug}`; }

/* ================================================================== *
 *  Sidebar + sync pill
 * ================================================================== */
function updateSidebar() {
  renderSidebar({
    roadmaps: getRoadmaps(), active: activeSlug,
    statsFor: slug => { try { return sidebarStats(getRoadmap(slug)); } catch { return { pct: 0, track: "on" }; } },
    onNavigate: navigate, expandedSlug: activeSlug,
  });
}
function updateSyncPill(s) {
  const pill = $("#sync-pill"); if (!pill) return;
  pill.className = "sync-pill " + s;
  $("#sync-pill-text").textContent = syncLabel(s);
}
const syncLabel = s => ({ online: "Synced", saving: "Saving…", offline: "Offline", error: "Sync error", local: "Local only" }[s] || s);

/* ================================================================== *
 *  Chrome wiring (sidebar collapse, mobile, dev banner)
 * ================================================================== */
function wireChrome() {
  const app = $("#app");
  // restore collapse state
  if (localStorage.getItem("roadmaps_sidebar") === "collapsed") app.dataset.sidebar = "collapsed";
  $("#sb-collapse").onclick = () => {
    const collapsed = app.dataset.sidebar === "collapsed";
    app.dataset.sidebar = collapsed ? "expanded" : "collapsed";
    localStorage.setItem("roadmaps_sidebar", app.dataset.sidebar);
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
    syncNow: async () => { await sync.flush(); await sync.loadAndReconcile(); rerender(); updateSidebar(); toast("Synced", { type: "ok" }); },
    lock: lockNowIO,
  };
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
  rerender(); updateSidebar(); toast("Imported", { type: "ok" });
}

async function importAllIO() {
  const file = await pickFile(); if (!file) return;
  let doc; try { doc = JSON.parse(await readFileText(file)); } catch { toast("Not valid JSON", { type: "bad" }); return; }
  const full = doc.scope === "all" ? doc.state : (doc.scope === "roadmap" && doc.slug ? { [doc.slug]: doc.items } : null);
  if (!full) { toast("Unrecognized journey file", { type: "bad" }); return; }
  const ok = await confirmModal({ title: "Import whole journey?", icon: "⬇️", danger: true,
    body: "This replaces ALL progress across every roadmap. A safety copy is stashed on the server first.",
    confirmLabel: "Replace everything", });
  if (!ok) return;
  store.importAll(full);
  await sync.saveFull(store.toFlatMap(), { stashFirst: true, reason: "journey-import" });
  closeDrawer(); rerender(); updateSidebar(); toast("Journey imported", { type: "ok" });
}

async function resetAllIO() {
  const ok = await confirmModal({ title: "Reset everything?", icon: "🗑️", danger: true,
    body: "Clears all ticks, moves and notes across every roadmap. A stash is kept on the server. This can't be undone locally.",
    confirmLabel: "Reset all", });
  if (!ok) return;
  const snapshot = store.rawState();
  const deletes = {};
  for (const [slug, bucket] of Object.entries(snapshot)) deletes[slug] = Object.keys(bucket || {});
  store.resetAll();
  for (const [slug, ids] of Object.entries(deletes))
    if (ids.length) await sync.saveRoadmapFull(slug, ids.map(id => ({ id, value: null })), { stashFirst: true, reason: "reset-all" });
  closeDrawer(); rerender(); updateSidebar(); toast("Everything reset", { type: "ok" });
}

async function lockNowIO() {
  await sync.logout();
  closeDrawer();
  $("#app").hidden = true;
  lock.show();
}
