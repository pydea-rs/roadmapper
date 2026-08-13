// sync.js — the data layer. The SQLite database (via sync.php) is the single
// source of truth for all journey data. Reads hydrate the in-memory copy on
// load; writes are pushed to the DB immediately (coalesced only within a single
// user action, not time-debounced). If the backend is unreachable, pending
// changes are kept in an in-memory retry buffer and the status pill shows it —
// nothing is written to localStorage, and nothing is silently dropped.

import * as store from "./store.js";

const ENDPOINT = "sync.php";
let available = false;                // is the backend reachable & speaking JSON?
const queues = new Map();             // slug -> Map(itemId -> change)  (retry buffer)
const statusListeners = new Set();

let syncState = "offline";            // "online" | "saving" | "offline" | "error"
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
  if (!ct.includes("application/json")) throw Object.assign(new Error("backend-not-json"), { unreachable: true });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export const isServer = () => available;

/* ---------- auth ---------- */
export async function status() {
  try {
    const { data } = await api("status");
    available = true;
    return { available: true, authed: !!data.authed, expiresInDays: data.expiresInDays };
  } catch (e) {
    available = false;
    return { available: false, authed: false };
  }
}

export async function login(password) {
  const { res, data } = await api("login", { method: "POST", body: { password } });
  if (res.ok && data.ok) { available = true; return { ok: true, expiresInDays: data.expiresInDays }; }
  return { ok: false, status: res.status, error: data.error,
    remaining: data.remaining, locked: data.locked, retryAfter: data.retryAfter };
}

export async function logout() {
  try { await api("logout", { method: "POST", body: {} }); } catch {}
}

/* ---------- discovery search ----------
 * Best-effort "watch/read next" lookup through the backend proxy. Never throws:
 * on any failure it resolves { ok:false } so the caller can stay silent (auto
 * mode) or show a gentle failure state (manual). `fetched:false` from the server
 * means outbound was blocked — the caller then offers a results-page deep link. */
export async function search(q, type = "video") {
  try {
    const query = `&q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`;
    const { res, data } = await api("search", { query });
    if (!res.ok || !data.ok) return { ok: false };
    return { ok: true, type: data.type || type, fetched: !!data.fetched,
      results: Array.isArray(data.results) ? data.results : [] };
  } catch { return { ok: false }; }
}

/* ---------- load ---------- */
export async function loadAndReconcile() {
  // Capture any local changes made while this load is in flight, so a tick the user
  // makes mid-load isn't visually reverted when we adopt the DB copy (it's replayed
  // on top after hydrate — the change is still queued for the DB independently).
  store.beginLoadCapture();
  try {
    // Adopt the DB wholesale — so first drain any queued/in-flight writes through the
    // flush chain, otherwise hydrateFromServer could replace `state` before those
    // saves land and the DB we read back would be stale. (Empty queue → resolves at
    // once, so boot pays nothing.)
    try { await flush(); } catch {}
    const { data } = await api("load");
    if (!data.ok) { setStatus("error"); return { error: data.error }; }
    available = true;
    store.hydrateFromServer(data.data || {});   // DB is authoritative → adopt it wholesale
    setStatus("online");
    return { savedAt: data.savedAt };
  } catch (e) {
    available = false;
    setStatus("offline");
    return { error: String(e) };
  } finally {
    store.replayAndEndCapture();                 // re-apply anything ticked during the load
  }
}

/* ---------- save (immediate, coalesced within one action) ---------- */
export function queueChange(slug, change) {
  if (!queues.has(slug)) queues.set(slug, new Map());
  queues.get(slug).set(change.id, change);
  setStatus("saving");
  scheduleFlush();
}

let flushScheduled = false;
function scheduleFlush() {
  if (flushScheduled) return;
  flushScheduled = true;
  // microtask: lets one user action's several setCell writes batch into one
  // request, then hits the DB right away — no perceptible delay.
  queueMicrotask(() => { flushScheduled = false; flush(); });
}

// Serialize all flushes on a promise chain so an awaited flush() also waits for
// any in-flight microtask write — a later load can never race ahead of a save.
let chain = Promise.resolve();
export function flush() {
  const next = chain.then(doFlush, doFlush);
  chain = next;
  return next;
}

async function doFlush() {
  if (queues.size === 0) { if (syncState === "saving") setStatus("online"); return; }
  const batches = [...queues.entries()].map(([slug, m]) => [slug, [...m.values()]]);
  queues.clear();
  try {
    for (let i = 0; i < batches.length; i++) {
      const [slug, changes] = batches[i];
      const { data, res } = await api("save", { method: "POST", body: { roadmap: slug, changes } });
      if (res.status === 401 || !data.ok) {
        setStatus(res.status === 401 ? "offline" : "error");
        // Requeue the failed slug AND every slug we haven't tried yet — they were
        // pulled out of `queues` by clear(), so returning without re-adding them
        // would silently drop those pending changes (data loss on reload).
        for (let j = i; j < batches.length; j++) requeue(batches[j][0], batches[j][1]);
        return;
      }
    }
    available = true;
    setStatus("online");
  } catch (e) {
    available = false;
    setStatus("offline");
    for (const [slug, changes] of batches) requeue(slug, changes);
  }
}
function requeue(slug, changes) {
  if (!queues.has(slug)) queues.set(slug, new Map());
  const m = queues.get(slug);
  for (const c of changes) if (!m.has(c.id)) m.set(c.id, c);
}

/* ---------- whole-journey / per-roadmap full replace (import / reset) ---------- */
export async function saveFull(flatMap, { stashFirst = true, reason = "import" } = {}) {
  try {
    const { data } = await api("save", { method: "POST", body: { full: flatMap, stashFirst, reason } });
    if (data.ok) { available = true; setStatus("online"); } else setStatus("error");
    return data;
  } catch (e) { available = false; setStatus("offline"); return { ok: false, error: String(e) }; }
}
export async function saveRoadmapFull(slug, changes, { stashFirst = true, reason = "import" } = {}) {
  try {
    const { data } = await api("save", { method: "POST", body: { roadmap: slug, changes, stashFirst, reason } });
    if (data.ok) { available = true; setStatus("online"); } else setStatus("error");
    return data;
  } catch (e) { available = false; setStatus("offline"); return { ok: false, error: String(e) }; }
}

/* Flush pending writes when the tab hides / unloads. */
export function installExitFlush() {
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", () => flush());
  window.addEventListener("beforeunload", () => { if (queues.size) navigatorBeacon(); });
}
function navigatorBeacon() {
  // Best-effort last-ditch write on unload: batch each roadmap's queue via sendBeacon.
  for (const [slug, m] of queues.entries()) {
    const body = JSON.stringify({ roadmap: slug, changes: [...m.values()] });
    try { navigator.sendBeacon(`${ENDPOINT}?action=save`, new Blob([body], { type: "application/json" })); } catch {}
  }
  queues.clear();
}
