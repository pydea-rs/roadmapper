// sync.js — the data layer. The SQLite database (via sync.php) is the single
// source of truth for all journey data. Reads hydrate the in-memory copy on
// load; writes are pushed to the DB immediately (coalesced only within a single
// user action, not time-debounced). If the backend is unreachable, pending
// changes are kept in an in-memory retry buffer, retried with backoff (and as soon
// as the browser reports it is back online), and the status pill shows it —
// nothing is written to localStorage, and nothing is silently dropped.

import * as store from "./store.js";

const ENDPOINT = "sync.php";
let available = false;                // is the backend reachable & speaking JSON?
const queues = new Map();             // slug -> Map(itemId -> change)  (retry buffer)
const statusListeners = new Set();
const authListeners = new Set();

let syncState = "offline";            // "online" | "saving" | "offline" | "error"
export function onSyncStatus(fn) { statusListeners.add(fn); fn(syncState); return () => statusListeners.delete(fn); }
function setStatus(s) { syncState = s; for (const fn of statusListeners) fn(s); }

/** Fired when the server answers 401 to a data request — the session expired while
 *  the app was open. Pending changes stay queued; they flush after the next login. */
export function onAuthExpired(fn) { authListeners.add(fn); return () => authListeners.delete(fn); }
let authExpired = false;
function signalAuthExpired() {
  if (authExpired) return;               // once per expiry, not once per failed request
  authExpired = true;
  for (const fn of authListeners) { try { fn(); } catch {} }
}

// A keepalive request survives the page being closed, but browsers cap its body
// (~64 KB across in-flight keepalive requests), so only small saves use it.
const KEEPALIVE_MAX = 60000;

async function api(action, { method = "GET", body = null, query = "" } = {}) {
  const json = body ? JSON.stringify(body) : undefined;
  const res = await fetch(`${ENDPOINT}?action=${action}${query}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: json,
    credentials: "same-origin",
    keepalive: !!json && method === "POST" && json.length < KEEPALIVE_MAX,
  });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw Object.assign(new Error("backend-not-json"), { unreachable: true });
  const data = await res.json().catch(() => ({}));
  return { res, data: data && typeof data === "object" ? data : {} };
}

export const isServer = () => available;
export const hasPending = () => queues.size > 0;

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
  try {
    const { res, data } = await api("login", { method: "POST", body: { password } });
    if (res.ok && data.ok) { available = true; authExpired = false; return { ok: true, expiresInDays: data.expiresInDays }; }
    return { ok: false, status: res.status, error: data.error,
      remaining: data.remaining, locked: data.locked, retryAfter: data.retryAfter };
  } catch (e) {
    // Network down / proxy error page: resolve (never reject) so the login form can
    // re-enable itself and say what happened instead of spinning forever.
    available = false;
    return { ok: false, status: 0, error: "unreachable" };
  }
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
// One load at a time: a second caller (e.g. "Sync now" pressed during the boot load)
// shares the in-flight promise instead of resetting the store's load journal under it.
let loading = null;
export function loadAndReconcile() {
  if (!loading) loading = doLoad().finally(() => { loading = null; });
  return loading;
}

async function doLoad() {
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
    const { res, data } = await api("load");
    if (res.status === 401) { setStatus("offline"); signalAuthExpired(); return { error: "auth", auth: true }; }
    if (!data.ok) { setStatus("error"); return { error: data.error || "load failed" }; }
    available = true;
    store.hydrateFromServer(data.data || {});   // DB is authoritative → adopt it wholesale
    // …except for changes the DB hasn't accepted yet (a save that failed before this
    // load): keep showing them, or the UI would silently revert work that is still
    // queued and will be written on the next successful flush.
    for (const [slug, m] of queues) for (const c of m.values())
      store.setCell(slug, c.id, c.kind, c.value, { silent: true });
    if (queues.size === 0) setStatus("online");
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

/** Forget queued (unsaved) changes — for a roadmap, or all of them. Used right
 *  before a reset/import replaces that data wholesale, so an old queued tick can't
 *  flush afterwards and resurrect what the user just cleared. */
export function dropQueued(slug = null) {
  if (slug === null) queues.clear(); else queues.delete(slug);
  if (queues.size === 0) cancelRetry();
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

/* ---------- automatic retry ---------- */
const RETRY_MIN = 2000, RETRY_MAX = 60000;
let retryDelay = RETRY_MIN, retryTimer = null;
function scheduleRetry() {
  if (retryTimer || authExpired || queues.size === 0) return;
  retryTimer = setTimeout(() => { retryTimer = null; flush(); }, retryDelay);
  retryDelay = Math.min(retryDelay * 2, RETRY_MAX);
}
function cancelRetry() {
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
  retryDelay = RETRY_MIN;
}

async function doFlush() {
  if (queues.size === 0) { if (syncState === "saving") setStatus("online"); return; }
  const batches = [...queues.entries()].map(([slug, m]) => [slug, [...m.values()]]);
  queues.clear();
  let rejected = 0;
  try {
    for (let i = 0; i < batches.length; i++) {
      const [slug, changes] = batches[i];
      const { data, res } = await api("save", { method: "POST", body: { roadmap: slug, changes } });
      if (res.status === 401 || !data.ok) {
        // Requeue the failed slug AND every slug we haven't tried yet — they were
        // pulled out of `queues` by clear(), so returning without re-adding them
        // would silently drop those pending changes (data loss on reload).
        for (let j = i; j < batches.length; j++) requeue(batches[j][0], batches[j][1]);
        if (res.status === 401) { setStatus("offline"); signalAuthExpired(); }
        else { setStatus("error"); scheduleRetry(); }
        return;
      }
      // The server refuses a malformed/oversized cell rather than storing it; retrying
      // can never succeed, so report it instead of pretending it was saved.
      if (Array.isArray(data.rejected)) rejected += data.rejected.length;
    }
    available = true;
    if (queues.size) return;               // newer changes arrived mid-flush; their flush follows
    cancelRetry();
    setStatus(rejected ? "error" : "online");
  } catch (e) {
    available = false;
    setStatus("offline");
    for (const [slug, changes] of batches) requeue(slug, changes);
    scheduleRetry();
  }
}
function requeue(slug, changes) {
  if (!queues.has(slug)) queues.set(slug, new Map());
  const m = queues.get(slug);
  for (const c of changes) if (!m.has(c.id)) m.set(c.id, c);   // a newer queued change wins
}

/* ---------- whole-journey / per-roadmap full replace (import / reset) ---------- */
async function bulkSave(body) {
  try {
    const { res, data } = await api("save", { method: "POST", body });
    if (res.status === 401) { setStatus("offline"); signalAuthExpired(); return { ok: false, error: "auth" }; }
    if (data.ok) { available = true; setStatus(queues.size ? "saving" : "online"); } else setStatus("error");
    return data.ok ? data : { ok: false, error: data.error || "save failed" };
  } catch (e) { available = false; setStatus("offline"); return { ok: false, error: String(e) }; }
}
export function saveFull(flatMap, { stashFirst = true, reason = "import" } = {}) {
  return bulkSave({ full: flatMap, stashFirst, reason });
}
/** Replace one roadmap's rows: `clear:true` deletes EVERY stored row of that roadmap
 *  server-side first (including rows this client never loaded), then applies changes. */
export function saveRoadmapFull(slug, changes, { stashFirst = true, reason = "import", clear = false } = {}) {
  return bulkSave({ roadmap: slug, changes, stashFirst, reason, clear });
}
/** Delete the whole journey server-side (a stash of it is kept first). */
export function clearAll({ reason = "reset-all" } = {}) {
  return bulkSave({ clearAll: true, reason });
}

/* Flush pending writes when the tab hides / unloads, and retry the moment the
 * network comes back. Save requests use `keepalive`, so a flush started as the page
 * is torn down still reaches the server. */
let exitWired = false;
export function installExitFlush() {
  if (exitWired) return;
  exitWired = true;
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", () => { if (queues.size) navigatorBeacon(); });
  window.addEventListener("online", () => { cancelRetry(); flush(); });
}
function navigatorBeacon() {
  // Last-ditch write on unload: each roadmap's queue via sendBeacon. A queue is only
  // forgotten once the browser has actually accepted its beacon — if the page is then
  // restored from the back/forward cache, anything not handed off is still pending.
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return;
  for (const [slug, m] of [...queues.entries()]) {
    const body = JSON.stringify({ roadmap: slug, changes: [...m.values()] });
    let sent = false;
    try { sent = navigator.sendBeacon(`${ENDPOINT}?action=save`, new Blob([body], { type: "application/json" })); } catch {}
    if (sent) queues.delete(slug);
  }
}
