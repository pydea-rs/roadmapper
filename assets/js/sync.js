// sync.js — mirror the local journey to the server (sync.php) when available.
//
// Talks to sync.php. When the endpoint isn't JSON (served statically / no PHP),
// sync goes dormant and the app runs local-only — the store already persists to
// localStorage, so nothing breaks. Change deltas from the store are queued per
// roadmap and flushed debounced + on page hide.

import { debounce } from "./util.js";
import * as store from "./store.js";

const ENDPOINT = "sync.php";
let mode = "unknown";                 // "server" | "local" | "unknown"
const queues = new Map();             // slug -> Map(itemId -> change)
const statusListeners = new Set();

let syncState = "local";              // "online" | "saving" | "offline" | "error" | "local"
export function onSyncStatus(fn) { statusListeners.add(fn); fn(syncState); return () => statusListeners.delete(fn); }
function setStatus(s) { syncState = s; for (const fn of statusListeners) fn(s); }

async function api(action, { method = "GET", body = null, query = "" } = {}) {
  const res = await fetch(`${ENDPOINT}?action=${action}${query}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) { mode = "local"; throw Object.assign(new Error("not-json"), { local: true }); }
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

/* ---------- auth ---------- */
export async function status() {
  try {
    const { data } = await api("status");
    mode = "server";
    return { available: true, authed: !!data.authed, expiresInDays: data.expiresInDays };
  } catch (e) {
    mode = "local";
    return { available: false, authed: false };
  }
}

export async function login(password) {
  const { res, data } = await api("login", { method: "POST", body: { password } });
  if (res.ok && data.ok) return { ok: true, expiresInDays: data.expiresInDays };
  // 401 (wrong) or 429 (locked) carry throttle info
  return { ok: false, status: res.status, error: data.error,
    remaining: data.remaining, locked: data.locked, retryAfter: data.retryAfter };
}

export async function logout() {
  try { await api("logout", { method: "POST", body: {} }); } catch {}
}

/* ---------- load / reconcile ---------- */
export async function loadAndReconcile() {
  if (mode === "local") { setStatus("local"); return { mode: "local" }; }
  try {
    const { data } = await api("load");
    if (!data.ok) { setStatus("error"); return { mode: "server", error: data.error }; }
    const serverMap = data.data || {};
    const serverEmpty = data.empty;
    if (store.isEmpty() && !serverEmpty) {
      store.hydrateFromServer(serverMap);      // fresh browser adopts the server copy
    } else if (!serverEmpty) {
      store.mergeServer(serverMap);            // fill any gaps; local wins on conflict
    }
    setStatus("online");
    return { mode: "server", savedAt: data.savedAt };
  } catch (e) {
    if (e.local) { mode = "local"; setStatus("local"); return { mode: "local" }; }
    setStatus("offline");
    return { mode: "server", error: String(e) };
  }
}

/* ---------- save (queued deltas) ---------- */
export function queueChange(slug, change) {
  if (mode === "local") return;
  if (!queues.has(slug)) queues.set(slug, new Map());
  queues.get(slug).set(change.id, change);
  setStatus("saving");
  flushSoon();
}

const flushSoon = debounce(() => { flush(); }, 900);

export async function flush() {
  if (mode === "local" || queues.size === 0) { if (mode !== "local") setStatus("online"); return; }
  const batches = [...queues.entries()].map(([slug, m]) => [slug, [...m.values()]]);
  queues.clear();
  try {
    for (const [slug, changes] of batches) {
      const { data, res } = await api("save", { method: "POST", body: { roadmap: slug, changes } });
      if (res.status === 401) { setStatus("offline"); requeue(slug, changes); return; }
      if (!data.ok) { setStatus("error"); requeue(slug, changes); return; }
    }
    setStatus("online");
  } catch (e) {
    if (e.local) { mode = "local"; setStatus("local"); return; }
    setStatus("offline");
    for (const [slug, changes] of batches) requeue(slug, changes);
  }
}
function requeue(slug, changes) {
  if (!queues.has(slug)) queues.set(slug, new Map());
  const m = queues.get(slug);
  for (const c of changes) if (!m.has(c.id)) m.set(c.id, c);
}

/* ---------- whole-journey / per-roadmap full replace (import) ---------- */
export async function saveFull(flatMap, { stashFirst = true, reason = "import" } = {}) {
  if (mode === "local") return { ok: true, local: true };
  try {
    const { data } = await api("save", { method: "POST", body: { full: flatMap, stashFirst, reason } });
    return data;
  } catch (e) { return { ok: false, error: String(e) }; }
}
export async function saveRoadmapFull(slug, changes, { stashFirst = true, reason = "import" } = {}) {
  if (mode === "local") return { ok: true, local: true };
  try {
    const { data } = await api("save", { method: "POST", body: { roadmap: slug, changes, stashFirst, reason } });
    return data;
  } catch (e) { return { ok: false, error: String(e) }; }
}

export const isServer = () => mode === "server";
export const getMode = () => mode;

/* Flush pending writes when the tab hides / unloads. */
export function installExitFlush() {
  const onHide = () => { flushSoon.flush ? flushSoon.flush() : flush(); };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", () => flush());
  window.addEventListener("beforeunload", () => { if (queues.size) navigatorBeacon(); });
}
function navigatorBeacon() {
  // Best-effort: batch each roadmap's queue via sendBeacon.
  for (const [slug, m] of queues.entries()) {
    const body = JSON.stringify({ roadmap: slug, changes: [...m.values()] });
    try { navigator.sendBeacon(`${ENDPOINT}?action=save`, new Blob([body], { type: "application/json" })); } catch {}
  }
  queues.clear();
}
