// stats.js — derive all progress/milestone/projection numbers at runtime from
// (roadmap structure + journey state). Nothing here is stored; it is always
// recomputed, so it is always truthful (DESIGN §10, §12, §13).
//
// Triple progress:
//   actual(scope)   — tasks whose CURRENT day/week/month is `scope`
//   original(scope) — tasks whose ORIGIN day/week/month is `scope`
//   ontime(scope)   — tasks ORIGINALLY in `scope` that were completed ON OR BEFORE
//                     their original date (i.e. done as planned, not just eventually).
// where current = move destination if moved, else origin. On-time always measures
// against the ORIGINAL date, so moving a task never changes it — it answers
// "how much of the plan did I keep to the schedule?".

import * as store from "./store.js";
import { getRoadmaps } from "./registry.js";
import { pct, pct1, daysBetween, todayStr, addDays, clamp, fmtDate } from "./util.js";

/** Local calendar date (YYYY-MM-DD) of a done_at ISO stamp, or null. Matches
 *  todayStr()/activity.js (local components), so comparisons line up. */
function doneLocalDate(slug, leafId) {
  const iso = store.doneAt(slug, leafId);
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : fmtDate(d);
}
/** Was this (done) leaf completed on or before its original day's date? A done
 *  leaf with no timestamp can't be proven on-time, so it counts as late. */
function isOnTime(slug, leafId, originDate) {
  const at = doneLocalDate(slug, leafId);
  return !!at && at <= originDate;
}

// The daily study budget is the OWNER'S, and it is SHARED: on a day when three
// roadmaps are live they split one block of study time — they do not each get a
// full one. (This was the bug in the old `PER_DAY_MINS = 180`: four live roadmaps
// implied a 12h day, so every roadmap projected a finish far earlier than its own
// authored calendar.) A roadmap's slice of that block is proportional to how often
// it runs, and it earns its slice on each of its own active days.
//
// The block is the owner's daily CEILING, not a target, and it depends on how many
// roadmaps share the date: ~4h when one or two do, up to 6h when three or more do.
// (7h is allowed only as a rare, hand-placed exception — never assumed here.)
const BUDGET_FEW_MINS = 240;          // a date shared by 1–2 roadmaps
const BUDGET_MANY_MINS = 360;         // a date shared by 3+ roadmaps
/** The day's ceiling when `c` roadmaps typically share it. `c` is an average, so a
 *  fractional value between 2 and 3 blends linearly between the two ceilings. */
function dailyBudget(c) {
  if (c <= 2) return BUDGET_FEW_MINS;
  if (c >= 3) return BUDGET_MANY_MINS;
  return BUDGET_FEW_MINS + (c - 2) * (BUDGET_MANY_MINS - BUDGET_FEW_MINS);
}
// Residual context-switching cost only. This used to be 0.85 to stand in for "several
// roadmaps are competing for the day" — but dayConcurrency() now models exactly that,
// explicitly and from the real calendar, so keeping 0.85 taxed the same effect twice
// and made every projection drift late.
const OVERLAP_TAX = 0.92;

/** The day a task currently lives on (origin unless moved to an existing day). */
export function currentDay(rm, slug, task) {
  const moved = store.getMove(slug, task.id);
  if (moved && rm.daysById.has(moved)) return moved;
  return task.day;                    // origin (also handles pruned/removed targets)
}

/** The EFFECTIVE calendar date of a day-CARD: its user-chosen override when one is
 *  set and still valid, else the authored date. Valid = strictly after the card's
 *  own base date and strictly before the next card's base (`day.nextDate`), i.e.
 *  inside the free gap — a stale/out-of-range override (e.g. after a content shift)
 *  is ignored so the card can never leapfrog or collide with a neighbour. This is
 *  the on-time reference for the card's OWN tasks; a task VISITING via a move is
 *  judged by ITS origin card, so this is always resolved on the origin day. */
export function dayDate(rm, slug, day) {
  const raw = store.getDayDate(slug, day.id);
  if (!raw) return day.date;
  const ceil = day.nextDate;                 // null on the last card → no gap → not movable
  if (ceil && raw > day.date && raw < ceil) return raw;
  return day.date;                           // no ceiling or out of the gap → ignore override
}

/** The leaves of a task: its sub-tasks if any, else the task itself (single leaf). */
export const leavesOf = task => task.subs || [task];

/** A parent task's derived completion, rolled up from its leaves (the single
 *  source of truth). `complete` = every leaf done; `partial` = some but not all. */
export function taskProgress(slug, task) {
  const ls = leavesOf(task);
  let done = 0;
  for (const l of ls) if (store.isDone(slug, l.id)) done++;
  const total = ls.length;
  return { done, total, complete: total > 0 && done === total,
    partial: done > 0 && done < total, pct: pct(done, total) };
}
export const taskComplete = (slug, task) => taskProgress(slug, task).complete;

function blank() { return { done: 0, total: 0, estDone: 0, estTotal: 0 }; }
function withPct(b) { return { ...b, pct: pct(b.done, b.total), pct1: pct1(b.done, b.total) }; }

export function computeAll(rm) {
  const slug = rm.slug;

  // Per-scope accumulators for actual (by current), original (by origin), and
  // on-time (by origin, only leaves finished on/before their original date).
  const dayA = new Map(), dayO = new Map();
  const weekA = new Map(), weekO = new Map();
  const monthA = new Map(), monthO = new Map();
  const dayT = new Map(), weekT = new Map(), monthT = new Map();   // on-time done counts
  const objAcc = new Map();            // objId -> {req:{a,o}, bonus:{done,total,est}}
  const catDist = {};
  let overallReqDone = 0, overallReqTotal = 0, overallReqTimely = 0;
  let bonusDone = 0, bonusTotal = 0, bonusEstDone = 0, bonusEstRemaining = 0;
  let remainingReqMins = 0, investedMins = 0;
  let remainingSecMins = 0;

  const get = (m, k) => { let v = m.get(k); if (!v) { v = blank(); m.set(k, v); } return v; };
  const incT = (m, k) => m.set(k, (m.get(k) || 0) + 1);   // on-time done tally
  const objOf = id => { let v = objAcc.get(id); if (!v) { v = { req: { aDone:0,aTot:0,oDone:0,oTot:0,tDone:0,estDone:0,estTot:0 },
    bonus: { done:0, total:0, estDone:0, estTot:0 } }; objAcc.set(id, v); } return v; };

  for (const day of rm.days) {
    // on-time reference for THIS card's own tasks is its effective (possibly
    // re-dated) calendar date; a day-card move re-bases it for native tasks only.
    const originDate = dayDate(rm, slug, day);
    for (const task of day.tasks) {
      const obj = rm.objById.get(task.obj) || { tier: "primary", weight: 1 };
      const cur = currentDay(rm, slug, task);       // move state is parent-level
      const curDay = rm.daysById.get(cur) || day;
      const oa = objOf(task.obj);

      // Every count / minute rolls up from LEAVES (a task's sub-tasks, or the task
      // itself when it has none). Objective, current-day, optional and tier are
      // parent-level; done-state and est are per-leaf.
      for (const leaf of leavesOf(task)) {
        const done = store.isDone(slug, leaf.id);
        // on-time is measured against this card's EFFECTIVE date (`originDate`),
        // so re-dating the card re-bases on-time for its own tasks; a task moved in
        // from elsewhere is iterated under its own origin card, so it keeps that date.
        const onTime = done && isOnTime(slug, leaf.id, originDate);
        const est = leaf.est || 0;

        if (task.optional) {
          // bonus / optional: tracked entirely on its OWN meter — both count and time.
          // It counts "past 100%", never in the required denominator, and — crucially —
          // undone bonus work does NOT inflate the required Remaining / finish ETA.
          // Completed bonus time is reported as bonusInvested, kept out of `invested`.
          bonusTotal++; oa.bonus.total++; oa.bonus.estTot += est;
          if (done) { bonusDone++; oa.bonus.done++; bonusEstDone += est; oa.bonus.estDone += est; }
          else bonusEstRemaining += est;
          continue;
        }

        // required leaf
        catDist[leaf.cat] = (catDist[leaf.cat] || 0) + 1;

        if (obj.tier === "secondary") {
          // secondary required work lives on the secondary meter, never in primary rollups
          oa.req.oTot++; if (done) oa.req.oDone++;
          oa.req.aTot++; if (done) oa.req.aDone++;
          if (onTime) oa.req.tDone++;
          oa.req.estTot += est; if (done) { oa.req.estDone += est; investedMins += est; }
          else remainingSecMins += est;
          continue;
        }

        // primary required leaf — drives the headline numbers
        overallReqTotal++; if (done) overallReqDone++;
        if (onTime) overallReqTimely++;
        if (done) investedMins += est; else remainingReqMins += est;

        // actual (current)
        const A = get(dayA, cur); A.total++; A.estTotal += est;
        if (done) { A.done++; A.estDone += est; }
        const wA = get(weekA, curDay.week); wA.total++; wA.estTotal += est; if (done) { wA.done++; wA.estDone += est; }
        const mA = get(monthA, curDay.month); mA.total++; if (done) mA.done++;

        // original (origin)
        const O = get(dayO, day.id); O.total++; O.estTotal += est;
        if (done) { O.done++; O.estDone += est; }
        const wO = get(weekO, day.week); wO.total++; if (done) wO.done++;
        const mO = get(monthO, day.month); mO.total++; if (done) mO.done++;

        // on-time (origin scope, done on/before original date)
        if (onTime) { incT(dayT, day.id); incT(weekT, day.week); incT(monthT, day.month); }

        oa.req.aTot++; if (done) oa.req.aDone++;
        oa.req.oTot++; if (done) oa.req.oDone++;
        if (onTime) oa.req.tDone++;
        oa.req.estTot += est; if (done) oa.req.estDone += est;
      }
    }
  }

  // ---- objective summaries ----
  const objectives = rm.objectives.map(o => {
    const a = objAcc.get(o.id) || { req:{aDone:0,aTot:0,oDone:0,oTot:0,tDone:0,estTot:0,estDone:0}, bonus:{done:0,total:0,estDone:0,estTot:0} };
    return {
      id: o.id, title: o.title, tier: o.tier, weight: o.weight,
      actual: withPct({ done: a.req.aDone, total: a.req.aTot }),
      original: withPct({ done: a.req.oDone, total: a.req.oTot }),
      ontime: withPct({ done: a.req.tDone || 0, total: a.req.oTot }),
      bonus: { done: a.bonus.done, total: a.bonus.total, pct: pct(a.bonus.done, a.bonus.total),
        estDone: a.bonus.estDone, estTotal: a.bonus.estTot },
      estTotal: a.req.estTot, estDone: a.req.estDone,
    };
  });

  const primary = { actual: withPct({ done: overallReqDone, total: overallReqTotal }),
    original: withPct(sumOrig(dayO)),
    ontime: withPct({ done: overallReqTimely, total: overallReqTotal }) };
  const secObjs = objectives.filter(o => o.tier === "secondary");
  const secondary = withPct(secObjs.reduce((acc, o) => ({ done: acc.done + o.actual.done, total: acc.total + o.actual.total }),
    { done: 0, total: 0 }));

  // ---- day/week/month maps as plain objects with dual figures ----
  const days = {};
  for (const day of rm.days) {
    const a = dayA.get(day.id) || blank();
    const o = dayO.get(day.id) || blank();
    days[day.id] = { actual: withPct(a), original: withPct(o),
      ontime: withPct({ done: dayT.get(day.id) || 0, total: o.total }), off: day.off,
      hasCurrent: a.total > 0, hasOrigin: o.total > 0 };
  }
  const weeks = {};
  for (const w of rm.weeks) {
    const o = weekO.get(w.id) || blank();
    weeks[w.id] = { actual: withPct(weekA.get(w.id) || blank()), original: withPct(o),
      ontime: withPct({ done: weekT.get(w.id) || 0, total: o.total }) };
  }
  const months = {};
  for (const m of rm.months) {
    const o = monthO.get(m.key) || blank();
    months[m.key] = { actual: withPct(monthA.get(m.key) || blank()), original: withPct(o),
      ontime: withPct({ done: monthT.get(m.key) || 0, total: o.total }) };
  }

  // ---- milestones ----
  const milestones = rm.milestones.map(m => evalMilestone(rm, slug, m, weeks));

  // ---- projection (primary) ----
  const projection = project(rm, remainingReqMins, overallReqDone, overallReqTotal);
  const secProjection = projectSecondary(rm, remainingSecMins);

  // ---- extra stats ----
  const softStats = computeSoft(rm, slug);
  const streak = computeStreak(rm, slug, dayO);

  return {
    slug,
    overall: {
      actual: primary.actual, original: primary.original, ontime: primary.ontime,
      bonus: { done: bonusDone, total: bonusTotal, pct: pct(bonusDone, bonusTotal),
        estDone: bonusEstDone, estRemaining: bonusEstRemaining },
    },
    objectives, primary, secondary,
    days, weeks, months, milestones,
    projection, secProjection,
    invested: investedMins, remaining: remainingReqMins, remainingSecondary: remainingSecMins,
    bonusInvested: bonusEstDone, bonusRemaining: bonusEstRemaining,
    softStats, streak, catDist,
  };
}

function sumOrig(dayO) {
  let done = 0, total = 0;
  for (const b of dayO.values()) { done += b.done; total += b.total; }
  return { done, total };
}

/* ---------- milestones ---------- */
function evalMilestone(rm, slug, m, weeks) {
  const r = m.rule || {};
  let met = false, progress = 0, target = 0;
  // A referenced task counts toward a milestone only when it is FULLY complete
  // (every sub-task done) — parents have no state of their own.
  const taskById = id => rm.tasksById.get(id);
  const idDone = id => { const t = taskById(id); return !!t && taskComplete(slug, t); };
  if (r.type === "tasks") {
    const req = r.require || [];
    const done = req.filter(idDone).length;
    met = done === req.length && req.length > 0; progress = done; target = req.length;
  } else if (r.type === "weekPct") {
    const w = weeks[m.week];                                     // by ORIGINAL so moves don't cheese it
    const min = r.min || 80;
    // Compare the EXACT ratio, not w.original.pct — that value is rounded (pct()
    // does Math.round), so 79.6% would round to 80 and flip the milestone "met"
    // up to ~half a task early. Display still uses the rounded percent.
    const exact = w && w.original.total > 0 ? (w.original.done / w.original.total) * 100 : 0;
    met = exact >= min; progress = w ? w.original.pct : 0; target = min;
  } else if (r.type === "count") {
    const from = r.from || []; const done = from.filter(idDone).length;
    met = done >= (r.min || 1); progress = done; target = r.min || 1;
  } else if (r.type === "category") {
    const wdays = rm.days.filter(d => d.week === m.week);
    const tasks = wdays.flatMap(d => d.tasks).filter(t => t.cat === r.cat && !t.optional);
    const done = tasks.filter(t => taskComplete(slug, t)).length;
    met = tasks.length > 0 && done === tasks.length; progress = done; target = tasks.length;
  } else if (r.type === "phase") {
    const tasks = rm.days.flatMap(d => d.tasks).filter(t => !t.optional && (t.phase === r.phase));
    const done = tasks.filter(t => taskComplete(slug, t)).length;
    met = tasks.length > 0 && done === tasks.length; progress = done; target = tasks.length;
  }

  // status: met / at-risk / missed, using the week end date
  const week = rm.weeksById.get(m.week);
  let status = met ? "met" : "risk";
  if (!met && week && week.start) {
    const weekEnd = addDays(week.start, 6);
    if (todayStr() > weekEnd) status = "missed";
    else status = "risk";
  }
  return { id: m.id, week: m.week, title: m.title, met, status, progress, target,
    ratio: target ? clamp(progress / target, 0, 1) : (met ? 1 : 0) };
}

/* ---------- projection ---------- */
function activeDaysPerWeek(rm) {
  const band = rm.cadence && rm.cadence.activeDaysPerWeek;
  // average the band, however many entries it has ([4] → 4, [3,4] → 3.5)
  if (Array.isArray(band) && band.length) return band.reduce((a, b) => a + b, 0) / band.length;
  // else infer from the schedule: avg active days across weeks. A rest day (d.off)
  // is not an active day, so it must not inflate the average (that would shrink the
  // projected per-week load and over-optimistically pull the finish date in).
  const perWeek = {};
  for (const d of rm.days) { if (d.off) continue; perWeek[d.week] = (perWeek[d.week] || 0) + 1; }
  const vals = Object.values(perWeek);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 5;
}

/** Does this roadmap still carry unfinished REQUIRED work? A finished roadmap must
 *  stop drawing a slice of the shared budget, otherwise every roadmap still running
 *  would be projected as though it were competing with a ghost forever. */
function hasRequiredWorkLeft(rm) {
  for (const leaf of (rm.leaves || [])) {
    if (leaf.optional) continue;
    if (!store.isDone(rm.slug, leaf.id)) return true;
  }
  return false;
}

/** How many roadmaps typically compete for one study day.
 *
 *  = (total active-days-per-week across live roadmaps) / (distinct dates the
 *    calendar actually uses in a week)
 *
 *  Both halves matter. Four roadmaps running 3 days/week each is 12 roadmap-days;
 *  spread over 6 dates that is 2 roadmaps per day, but stacked onto 3 dates it is
 *  4 — same work, a very different day. Deriving the divisor from the REAL dates
 *  (rather than assuming one roadmap per day, or assuming perfect stacking) keeps
 *  the projection honest through a re-plan: however the days get re-arranged, this
 *  follows on its own. Never returns < 1, so a lone roadmap gets the whole budget. */
function dayConcurrency(rm) {
  let roadmapDays = 0;
  const dates = new Set();
  let seen = 0;
  for (const other of getRoadmaps()) {
    const isSelf = other.slug === rm.slug;
    if (!isSelf && !hasRequiredWorkLeft(other)) continue;
    seen++;
    roadmapDays += Math.max(0.5, activeDaysPerWeek(other));
    for (const d of other.days) if (d.date && !d.off) dates.add(d.date);
  }
  if (!seen || dates.size === 0) return 1;                 // rm not registered / no dated days
  const all = [...dates].sort();
  const spanDays = daysBetween(all[0], all[all.length - 1]) + 1;
  const weeks = Math.max(1, spanDays / 7);
  const datesPerWeek = dates.size / weeks;                 // the owner's real working days/week
  if (!(datesPerWeek > 0)) return 1;
  return Math.max(1, roadmapDays / datesPerWeek);
}

function project(rm, remainingMins, done, total) {
  const active = activeDaysPerWeek(rm);
  // On a day the owner works, the budget splits between whichever roadmaps run that
  // day; this roadmap earns its slice on each of its own active days.
  const c = dayConcurrency(rm);
  const perDayMins = dailyBudget(c) / c;
  const perWeekMins = Math.max(1, active * perDayMins * OVERLAP_TAX);
  const weeksNeeded = remainingMins / perWeekMins;
  const expectedFinish = addDays(todayStr(), Math.ceil(weeksNeeded * 7));
  const optimisticFinish = addDays(todayStr(), Math.ceil((remainingMins / (perWeekMins * 1.25)) * 7));

  // on-track: completion ratio vs elapsed schedule ratio. Use the true
  // chronological endpoints — days may be authored out of order (registry sorts a
  // chrono copy for the same reason), so days[0]/days[-1] aren't reliably first/last.
  const dated = rm.days.map(d => d.date).filter(Boolean);
  const firstDate = dated.length ? dated.reduce((a, b) => (a < b ? a : b)) : todayStr();
  const lastDate = dated.length ? dated.reduce((a, b) => (a > b ? a : b)) : todayStr();
  const span = Math.max(1, daysBetween(firstDate, lastDate));
  const elapsed = clamp(daysBetween(firstDate, todayStr()) / span, 0, 1);
  const compRatio = total ? done / total : 0;
  let track = "on";
  if (compRatio > elapsed + 0.08) track = "ahead";
  else if (compRatio < elapsed - 0.08) track = "behind";

  return {
    pctDone: pct(done, total),
    remainingMins, perWeekMins: Math.round(perWeekMins),
    expectedFinish, optimisticFinish,
    track,
    // Completion is a count fact, not a time fact: a leaf may legitimately carry
    // est:0, so "no minutes left" does not mean "all tasks done". Gate on counts.
    done: total > 0 && done === total,
  };
}
function projectSecondary(rm, remainingMins) {
  if (remainingMins <= 0) return null;
  const active = 1.2;                  // secondary gets little time
  const c = dayConcurrency(rm);
  const perWeekMins = Math.max(1, active * (dailyBudget(c) / c) * OVERLAP_TAX);
  const finish = addDays(todayStr(), Math.ceil((remainingMins / perWeekMins) * 7));
  return { remainingMins, finish };
}

/* ---------- soft + streak ---------- */
function computeSoft(rm, slug) {
  let done = 0, total = 0;
  for (const d of rm.days) for (const s of d.soft) if (s.tickable) {
    total++; if (store.isSoftDone(slug, s.id)) done++;
  }
  return { done, total };
}
function computeStreak(rm, slug, dayO) {
  // consecutive past/today active days (by EFFECTIVE date desc) whose ORIGINAL
  // required tasks are all done. A re-dated card counts as past/today by its new
  // date, so postponing a card also postpones when it can extend the streak.
  const today = todayStr();
  const eff = d => dayDate(rm, slug, d);
  const past = rm.days.filter(d => !d.off && eff(d) <= today && (dayO.get(d.id)?.total || 0) > 0)
    .sort((a, b) => eff(a) < eff(b) ? 1 : eff(a) > eff(b) ? -1 : 0);   // total order (0 on equal dates)
  let streak = 0;
  for (const d of past) {
    const o = dayO.get(d.id);
    if (o && o.done === o.total && o.total > 0) streak++;
    // Today is usually still in progress; an unfinished *today* shouldn't wipe a
    // real run of completed past days — skip it and keep counting backwards.
    else if (eff(d) === today) continue;
    else break;
  }
  return streak;
}

/** Lightweight sidebar summary. */
export function sidebarStats(rm) {
  const s = computeAll(rm);
  return { pct: s.overall.actual.pct, track: s.projection.track };
}
