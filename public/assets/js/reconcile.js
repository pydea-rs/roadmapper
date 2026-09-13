// reconcile.js — reconcile stored journey state against current roadmap content
// at load time (DESIGN §7.4): apply id aliases (deliberate renames), then prune
// rows whose referent task/soft/day no longer exists so counts stay truthful.
// Notes and settings are never pruned. No DOM deps.
//
// ⚠️ Pruning is IN-MEMORY ONLY — the database rows are never deleted by it. The
// content a client runs can be OLDER than the data (a phone whose service worker
// still holds last week's roadmap files, a tab left open across a content deploy,
// or a typo'd id in a fresh edit). Deleting "unknown" rows server-side would then
// permanently destroy progress the newer content created. Orphans cost nothing in
// the DB, every view looks cells up by content id, and the rows come back into
// play as soon as the client runs content that knows them again. (A reset or a
// whole-journey import clears them server-side explicitly.)

import * as store from "./store.js";

/** Map a stored item id to the content element it depends on, or null to keep. */
export function referentOf(item) {
  if (item.startsWith("note:")) return null;            // user content — never auto-prune
  if (item.startsWith("soft:")) return { kind: "soft", id: item.slice(5) };
  if (item.startsWith("move:")) return { kind: "task", id: item.slice(5) };
  if (item.startsWith("done_at:")) return { kind: "task", id: item.slice(8) };
  if (item.startsWith("flag:")) { const p = item.split(":"); return { kind: "task", id: p.slice(2).join(":") }; }
  if (item.startsWith("daydate:")) return { kind: "day", id: item.slice(8) };   // a re-dated day card
  if (/^d\d+\..+/.test(item)) return { kind: "task", id: item };   // a bare task tick "d03.t2"
  return null;                                          // view/settings/other → keep
}

/** @return {{aliased:number, pruned:number}} */
export function reconcile(rm) {
  const slug = rm.slug;
  const bucket = store.rawState()[slug];
  let aliased = 0, pruned = 0;
  if (!bucket) return { aliased, pruned };

  // 1. aliases: migrate an old task id's rows to a new id (rename), non-destructively.
  const aliases = rm.aliases || {};
  const keys = Object.keys(bucket);                     // snapshot before we mutate
  for (const [oldId, newId] of Object.entries(aliases)) {
    for (const prefix of ["", "done_at:", "move:", "soft:", "note:", "flag:missed:", "flag:starred:"]) {
      const base = prefix + oldId;
      // migrate the id itself AND any sub-leaf descendant (oldId.s1 → newId.s1) —
      // else renaming a task WITH sub-tasks would lose its leaf ticks to the prune.
      for (const from of keys) {
        if (from !== base && !from.startsWith(base + ".")) continue;
        const to = prefix + newId + from.slice(base.length);
        const cell = store.getCell(slug, from);
        if (cell && !store.getCell(slug, to)) {
          store.setCell(slug, to, cell.kind, cell.value);
          store.setCell(slug, from, cell.kind, null);
          aliased++;
        }
      }
    }
  }

  // 2. prune orphans: rows whose referent task/soft no longer exists in content.
  // Task-kind rows may key off a LEAF (a sub-task tick / done_at stamp) or a PARENT
  // (a move / flag), so a row survives if either map still holds its id.
  const tasks = rm.tasksById, softs = rm.softById, leaves = rm.leavesById || new Map();
  const daysById = rm.daysById || new Map();
  for (const item of Object.keys(store.rawState()[slug] || {})) {
    const ref = referentOf(item);
    if (!ref) continue;                                 // notes/settings/unknown → keep
    let exists = ref.kind === "soft" ? softs.has(ref.id)
      : ref.kind === "day" ? daysById.has(ref.id)
      : (tasks.has(ref.id) || leaves.has(ref.id));
    // A move is only meaningful while its DESTINATION day exists too; otherwise the
    // task already shows on its origin, and a stale row would (a) block moving it
    // "back" (it looks like a no-op) and (b) snap it onto a future day re-using that id.
    if (exists && item.startsWith("move:")) {
      const cell = store.getCell(slug, item);
      exists = !!cell && daysById.has(cell.value);
    }
    if (!exists) {
      const cell = store.getCell(slug, item);
      store.setCell(slug, item, cell ? cell.kind : "task", null, { silent: true });   // memory only — see header
      pruned++;
    }
  }
  return { aliased, pruned };
}
