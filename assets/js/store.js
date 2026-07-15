// store.js — the journey state: ticks, moves, soft ticks, flags, notes.
//
// SINGLE SOURCE OF TRUTH = the SQLite database (via sync.php). This module holds
// only an in-memory working copy of that data for the running session, because
// the render/stats engine reads it synchronously many times per repaint and JS
// can't read SQLite synchronously. It is NOT persisted to localStorage — every
// change is handed to the sink (sync.js) and written straight to the DB.
//
// Absence of an entry = the default (not done / on origin / unset), mirroring
// the DB's "absence of a row = default" rule (DESIGN §7). Nothing is ever seeded.
//
// Shape:  state[slug][itemId] = { kind, value }   (value is always a string)
// Item ids:  "d03.t2" (task) · "move:d03.t2" (move) · "soft:d03.s1" · "flag:..." · "note:<ulid>"
// Absence is expressed by value:null in a change, which the server turns into a row delete.

const SEP = "\x01";                   // must match sync.php KEY_SEP ("\x01")
const listeners = new Set();          // (slug, itemId) => void  — for re-render
let sink = null;                      // (slug, change) => void  — for DB write

let state = {};

export function setSink(fn) { sink = fn; }
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit(slug, itemId) { for (const fn of listeners) fn(slug, itemId); }

/* ---------- low-level get/set ---------- */
export function getCell(slug, itemId) {
  const r = state[slug]; return (r && r[itemId]) || null;
}
export function rawState() { return state; }

/** Set (value=string) or clear (value=null → back to default) one item.
 *  Updates the in-memory copy and pushes the delta to the DB via the sink. */
export function setCell(slug, itemId, kind, value, { silent = false } = {}) {
  if (!state[slug]) state[slug] = {};
  const bucket = state[slug];
  const before = bucket[itemId];
  if (value === null) {
    if (!before) return;                       // already default
    delete bucket[itemId];
  } else {
    const v = typeof value === "string" ? value : JSON.stringify(value);
    if (before && before.value === v && before.kind === kind) return;
    bucket[itemId] = { kind, value: v };
  }
  if (sink && !silent) sink(slug, { id: itemId, kind, value: value === null ? null : bucket[itemId].value });
  emit(slug, itemId);
}

/* ---------- typed accessors ---------- */
export const isDone = (slug, taskId) => {
  const c = getCell(slug, taskId); return !!c && c.value === "true";
};
export const doneAt = (slug, taskId) => {
  const c = getCell(slug, `done_at:${taskId}`); return c ? c.value : null;
};
export function setTask(slug, taskId, done) {
  setCell(slug, taskId, "task", done ? "true" : null);
  setCell(slug, `done_at:${taskId}`, "meta", done ? new Date().toISOString() : null, { silent: false });
}

/** Move: value is the destination day id; null = back to origin (row deleted). */
export const getMove = (slug, taskId) => {
  const c = getCell(slug, `move:${taskId}`); return c ? c.value : null;
};
export function setMove(slug, taskId, dayId) {
  setCell(slug, `move:${taskId}`, "move", dayId || null);
}

/* soft ticks — stored, but never counted in real progress */
export const isSoftDone = (slug, softId) => {
  const c = getCell(slug, `soft:${softId}`); return !!c && c.value === "true";
};
export function setSoft(slug, softId, done) {
  setCell(slug, `soft:${softId}`, "soft", done ? "true" : null);
}

/* flags: missed / starred */
export const hasFlag = (slug, taskId, flag) => {
  const c = getCell(slug, `flag:${flag}:${taskId}`); return !!c && c.value === "true";
};
export function setFlag(slug, taskId, flag, on) {
  setCell(slug, `flag:${flag}:${taskId}`, "flag", on ? "true" : null);
}

/* notes (per day or per task), keyed by author-chosen id */
export const getNote = (slug, refId) => {
  const c = getCell(slug, `note:${refId}`); return c ? c.value : "";
};
export function setNote(slug, refId, text) {
  setCell(slug, `note:${refId}`, "note", text && text.trim() ? text : null);
}

/* ---------- bulk (from server / import) ---------- */
/** Replace the whole in-memory journey from a server "load" map keyed slug<SEP>item. */
export function hydrateFromServer(flatMap) {
  const next = {};
  for (const [key, cell] of Object.entries(flatMap || {})) {
    const sep = key.indexOf(SEP);
    if (sep < 0) continue;
    const slug = key.slice(0, sep), item = key.slice(sep + 1);
    (next[slug] ||= {})[item] = { kind: cell.kind, value: cell.value };
  }
  state = next;
  emit(null, null);
}

export function isEmpty() {
  return Object.values(state).every(b => !b || Object.keys(b).length === 0);
}

/* Flat map for whole-journey export/full-save: { "slug<SEP>item": {kind,value} } */
export function toFlatMap(onlySlug = null) {
  const out = {};
  for (const [slug, bucket] of Object.entries(state)) {
    if (onlySlug && slug !== onlySlug) continue;
    for (const [item, cell] of Object.entries(bucket || {}))
      out[`${slug}${SEP}${item}`] = { kind: cell.kind, value: cell.value };
  }
  return out;
}

/** Per-roadmap export payload (portable JSON). */
export function exportRoadmap(slug) {
  return { format: "roadmaps.journey", version: 1, scope: "roadmap", slug,
    exportedAt: new Date().toISOString(), items: state[slug] || {} };
}
export function exportAll() {
  return { format: "roadmaps.journey", version: 1, scope: "all",
    exportedAt: new Date().toISOString(), state };
}

/** Replace one roadmap's in-memory state (import). Persistence is done by the
 *  caller via sync.saveRoadmapFull(). */
export function importRoadmap(slug, items) {
  state[slug] = {};
  for (const [item, cell] of Object.entries(items || {}))
    state[slug][item] = { kind: cell.kind || "task", value: String(cell.value) };
  emit(slug, null);
}
export function importAll(fullState) {
  state = {};
  for (const [slug, bucket] of Object.entries(fullState || {})) {
    state[slug] = {};
    for (const [item, cell] of Object.entries(bucket || {}))
      state[slug][item] = { kind: cell.kind || "task", value: String(cell.value) };
  }
  emit(null, null);
}

export function resetRoadmap(slug) { delete state[slug]; emit(slug, null); }
export function resetAll() { state = {}; emit(null, null); }
