// activity.js — cross-roadmap "what did I actually get done, and when".
//
// Everything here is derived at runtime from the `done_at:<taskId>` timestamps
// the store writes when a task is ticked (store.setTask). It is therefore an
// ACTIVITY log keyed by the calendar day you did the work on — independent of the
// day a task was scheduled for. Nothing is stored; it's always recomputed, so it
// stays truthful (same principle as stats.js). Soft/tryout ticks are not
// timestamped, so only real tasks (required + bonus) appear here.

import * as store from "./store.js";
import { getRoadmaps } from "./registry.js";
import { fmtDate, addDays, stampDate } from "./util.js";

/** Calendar date (YYYY-MM-DD) of a completion stamp, or null if unparseable — the day
 *  it was ticked on, as seen by the ticking device (see util.stampDate). */
export const localDate = stampDate;

function blankDay() {
  return { tasks: 0, mins: 0, reqTasks: 0, reqMins: 0, bonusTasks: 0, bonusMins: 0, roadmaps: new Set() };
}

/** Map: date(YYYY-MM-DD) -> aggregated effort from every completed, timestamped task.
 *  `kind` optionally restricts the log to one track ("main" | "side"); omitted =
 *  every roadmap (the combined Main+Side view). Because the derived helpers below
 *  all take the map as an argument, one call to this decides the whole track. */
export function activityByDate(kind) {
  const map = new Map();
  for (const rm of getRoadmaps(kind)) {
    // Effort is logged per LEAF (a task's sub-tasks, or the task itself when it has
    // none): each completed, timestamped leaf is one unit of work placed on the day
    // it was actually ticked. optional is inherited from the parent onto its leaves.
    for (const leaf of rm.leaves) {
      if (!store.isDone(rm.slug, leaf.id)) continue;
      const date = localDate(store.doneAt(rm.slug, leaf.id));
      if (!date) continue;                      // done but not timestamped → can't place it
      let e = map.get(date); if (!e) { e = blankDay(); map.set(date, e); }
      const est = leaf.est || 0;
      e.tasks++; e.mins += est; e.roadmaps.add(rm.slug);
      if (leaf.optional) { e.bonusTasks++; e.bonusMins += est; }
      else { e.reqTasks++; e.reqMins += est; }
    }
  }
  return map;
}

/** One day's effort (a blank record if there was none). */
export function dayEffort(dateStr, map = activityByDate()) {
  return map.get(dateStr) || blankDay();
}

/** Trailing daily-average minutes over the `days` calendar days ENDING THE DAY
 *  BEFORE `dateStr` (exclusive) — i.e. the recent norm to judge a day against.
 *  Rest days count as zero, so this is average effort per calendar day. */
export function trailingAvg(dateStr, days, map = activityByDate()) {
  if (days <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= days; i++) sum += (map.get(addDays(dateStr, -i))?.mins || 0);
  return sum / days;
}

/** Totals over an inclusive [startStr, endStr] calendar range. */
export function rangeTotals(startStr, endStr, map = activityByDate()) {
  let mins = 0, tasks = 0;
  for (let d = startStr; d <= endStr; d = addDays(d, 1)) {
    const e = map.get(d); if (e) { mins += e.mins; tasks += e.tasks; }
  }
  return { mins, tasks };
}

/** This-week vs last-week minutes, each a 7-day window ending on/at `dateStr`. */
export function weekDelta(dateStr, map = activityByDate()) {
  const thisW = rangeTotals(addDays(dateStr, -6), dateStr, map);
  const lastW = rangeTotals(addDays(dateStr, -13), addDays(dateStr, -7), map);
  return { thisMins: thisW.mins, lastMins: lastW.mins, delta: thisW.mins - lastW.mins };
}

/** Ordered series of the last `n` days (inclusive of `endStr`) for the bar chart. */
export function series(endStr, n, map = activityByDate()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = addDays(endStr, -i);
    const e = map.get(date) || blankDay();
    out.push({ date, mins: e.mins, tasks: e.tasks, reqMins: e.reqMins, bonusMins: e.bonusMins });
  }
  return out;
}

/** The actual tasks completed on `dateStr`, ordered by completion time, with
 *  their roadmap — for the day's "what got done" breakdown. `kind` optionally
 *  restricts to one track ("main" | "side"); omitted = every roadmap. */
export function tasksDoneOn(dateStr, kind) {
  const out = [];
  for (const rm of getRoadmaps(kind)) {
    for (const leaf of rm.leaves) {
      if (!store.isDone(rm.slug, leaf.id)) continue;
      const at = store.doneAt(rm.slug, leaf.id);
      if (localDate(at) !== dateStr) continue;
      out.push({ rm, task: leaf, at });
    }
  }
  out.sort((a, b) => { const x = a.at || "", y = b.at || ""; return x < y ? -1 : x > y ? 1 : 0; });
  return out;
}
