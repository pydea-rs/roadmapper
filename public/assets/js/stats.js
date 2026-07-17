// stats.js — derive all progress/milestone/projection numbers at runtime from
// (roadmap structure + journey state). Nothing here is stored; it is always
// recomputed, so it is always truthful (DESIGN §10, §12, §13).
//
// Dual progress:
//   actual(scope)   — tasks whose CURRENT day/week/month is `scope`
//   original(scope) — tasks whose ORIGIN day/week/month is `scope`
// where current = move destination if moved, else origin.

import * as store from "./store.js";
import { pct, pct1, daysBetween, todayStr, addDays, clamp } from "./util.js";

const PER_DAY_MINS = 180;             // flexible ~3h/day budget (DESIGN §13)
const OVERLAP_TAX = 0.85;             // capacity factor when roadmaps overlap

/** The day a task currently lives on (origin unless moved to an existing day). */
export function currentDay(rm, slug, task) {
  const moved = store.getMove(slug, task.id);
  if (moved && rm.daysById.has(moved)) return moved;
  return task.day;                    // origin (also handles pruned/removed targets)
}

function blank() { return { done: 0, total: 0, estDone: 0, estTotal: 0 }; }
function withPct(b) { return { ...b, pct: pct(b.done, b.total), pct1: pct1(b.done, b.total) }; }

export function computeAll(rm) {
  const slug = rm.slug;

  // Per-scope accumulators for actual (by current) and original (by origin).
  const dayA = new Map(), dayO = new Map();
  const weekA = new Map(), weekO = new Map();
  const monthA = new Map(), monthO = new Map();
  const objAcc = new Map();            // objId -> {req:{a,o}, bonus:{done,total,est}}
  const catDist = {};
  let overallReqDone = 0, overallReqTotal = 0;
  let bonusDone = 0, bonusTotal = 0, bonusEstDone = 0, bonusEstRemaining = 0;
  let remainingReqMins = 0, investedMins = 0;
  let remainingSecMins = 0;

  const get = (m, k) => { let v = m.get(k); if (!v) { v = blank(); m.set(k, v); } return v; };
  const objOf = id => { let v = objAcc.get(id); if (!v) { v = { req: { aDone:0,aTot:0,oDone:0,oTot:0,estDone:0,estTot:0 },
    bonus: { done:0, total:0, estDone:0, estTot:0 } }; objAcc.set(id, v); } return v; };

  for (const day of rm.days) {
    for (const task of day.tasks) {
      const done = store.isDone(slug, task.id);
      const obj = rm.objById.get(task.obj) || { tier: "primary", weight: 1 };
      const cur = currentDay(rm, slug, task);
      const curDay = rm.daysById.get(cur) || day;
      const oa = objOf(task.obj);

      if (task.optional) {
        // bonus / optional: tracked entirely on its OWN meter — both count and time.
        // It counts "past 100%", never in the required denominator, and — crucially —
        // undone bonus work does NOT inflate the required Remaining / finish ETA.
        // Completed bonus time is reported as bonusInvested, kept out of `invested`.
        bonusTotal++; oa.bonus.total++; oa.bonus.estTot += task.est;
        if (done) { bonusDone++; oa.bonus.done++; bonusEstDone += task.est; oa.bonus.estDone += task.est; }
        else bonusEstRemaining += task.est;
        continue;
      }

      // required task
      catDist[task.cat] = (catDist[task.cat] || 0) + 1;

      if (obj.tier === "secondary") {
        // secondary required tasks live on the secondary meter, never in primary rollups
        oa.req.oTot++; if (done) oa.req.oDone++;
        oa.req.aTot++; if (done) oa.req.aDone++;
        oa.req.estTot += task.est; if (done) { oa.req.estDone += task.est; investedMins += task.est; }
        else remainingSecMins += task.est;
        continue;
      }

      // primary required task — drives the headline numbers
      overallReqTotal++; if (done) overallReqDone++;
      if (done) investedMins += task.est; else remainingReqMins += task.est;

      // actual (current)
      const A = get(dayA, cur); A.total++; A.estTotal += task.est;
      if (done) { A.done++; A.estDone += task.est; }
      const wA = get(weekA, curDay.week); wA.total++; wA.estTotal += task.est; if (done) { wA.done++; wA.estDone += task.est; }
      const mA = get(monthA, curDay.month); mA.total++; if (done) mA.done++;

      // original (origin)
      const O = get(dayO, day.id); O.total++; O.estTotal += task.est;
      if (done) { O.done++; O.estDone += task.est; }
      const wO = get(weekO, day.week); wO.total++; if (done) wO.done++;
      const mO = get(monthO, day.month); mO.total++; if (done) mO.done++;

      oa.req.aTot++; if (done) oa.req.aDone++;
      oa.req.oTot++; if (done) oa.req.oDone++;
      oa.req.estTot += task.est; if (done) oa.req.estDone += task.est;
    }
  }

  // ---- objective summaries ----
  const objectives = rm.objectives.map(o => {
    const a = objAcc.get(o.id) || { req:{aDone:0,aTot:0,oDone:0,oTot:0,estTot:0,estDone:0}, bonus:{done:0,total:0,estDone:0,estTot:0} };
    return {
      id: o.id, title: o.title, tier: o.tier, weight: o.weight,
      actual: withPct({ done: a.req.aDone, total: a.req.aTot }),
      original: withPct({ done: a.req.oDone, total: a.req.oTot }),
      bonus: { done: a.bonus.done, total: a.bonus.total, pct: pct(a.bonus.done, a.bonus.total),
        estDone: a.bonus.estDone, estTotal: a.bonus.estTot },
      estTotal: a.req.estTot, estDone: a.req.estDone,
    };
  });

  const primary = { actual: withPct({ done: overallReqDone, total: overallReqTotal }),
    original: withPct(sumOrig(dayO)) };
  const secObjs = objectives.filter(o => o.tier === "secondary");
  const secondary = withPct(secObjs.reduce((acc, o) => ({ done: acc.done + o.actual.done, total: acc.total + o.actual.total }),
    { done: 0, total: 0 }));

  // ---- day/week/month maps as plain objects with dual figures ----
  const days = {};
  for (const day of rm.days) {
    const a = dayA.get(day.id) || blank();
    const o = dayO.get(day.id) || blank();
    days[day.id] = { actual: withPct(a), original: withPct(o), off: day.off,
      hasCurrent: a.total > 0, hasOrigin: o.total > 0 };
  }
  const weeks = {};
  for (const w of rm.weeks) {
    weeks[w.id] = { actual: withPct(weekA.get(w.id) || blank()), original: withPct(weekO.get(w.id) || blank()) };
  }
  const months = {};
  for (const m of rm.months) {
    months[m.key] = { actual: withPct(monthA.get(m.key) || blank()), original: withPct(monthO.get(m.key) || blank()) };
  }

  // ---- milestones ----
  const milestones = rm.milestones.map(m => evalMilestone(rm, slug, m, weeks));

  // ---- projection (primary) ----
  const projection = project(rm, slug, remainingReqMins, overallReqDone, overallReqTotal, investedMins);
  const secProjection = projectSecondary(rm, remainingSecMins);

  // ---- extra stats ----
  const softStats = computeSoft(rm, slug);
  const streak = computeStreak(rm, slug, dayO);

  return {
    slug,
    overall: {
      actual: primary.actual, original: primary.original,
      bonus: { done: bonusDone, total: bonusTotal, pct: pct(bonusDone, bonusTotal),
        estDone: bonusEstDone, estRemaining: bonusEstRemaining },
    },
    objectives, primary, secondary,
    days, weeks, months, milestones,
    projection, secProjection,
    invested: investedMins, remaining: remainingReqMins, remainingSecondary: remainingSecMins,
    bonusInvested: bonusEstDone, bonusRemaining: bonusEstRemaining,
    softStats, streak, catDist,
    hasSecondary: secObjs.length > 0,
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
  if (r.type === "tasks") {
    const req = r.require || [];
    const done = req.filter(id => store.isDone(slug, id)).length;
    met = done === req.length && req.length > 0; progress = done; target = req.length;
  } else if (r.type === "weekPct") {
    const w = weeks[m.week]; const p = w ? w.original.pct : 0;   // by ORIGINAL so moves don't cheese it
    met = p >= (r.min || 80); progress = p; target = r.min || 80;
  } else if (r.type === "count") {
    const from = r.from || []; const done = from.filter(id => store.isDone(slug, id)).length;
    met = done >= (r.min || 1); progress = done; target = r.min || 1;
  } else if (r.type === "category") {
    const wdays = rm.days.filter(d => d.week === m.week);
    const tasks = wdays.flatMap(d => d.tasks).filter(t => t.cat === r.cat && !t.optional);
    const done = tasks.filter(t => store.isDone(slug, t.id)).length;
    met = tasks.length > 0 && done === tasks.length; progress = done; target = tasks.length;
  } else if (r.type === "phase") {
    const tasks = rm.days.flatMap(d => d.tasks).filter(t => !t.optional && (t.phase === r.phase));
    const done = tasks.filter(t => store.isDone(slug, t.id)).length;
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
  if (Array.isArray(band)) return (band[0] + band[1]) / 2;
  // else infer from the schedule: avg active days across weeks
  const perWeek = {};
  for (const d of rm.days) perWeek[d.week] = (perWeek[d.week] || 0) + 1;
  const vals = Object.values(perWeek);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 5;
}

function project(rm, slug, remainingMins, done, total, investedMins) {
  const active = activeDaysPerWeek(rm);
  const perWeekMins = Math.max(1, active * PER_DAY_MINS * OVERLAP_TAX);
  // rolling actual pace: mins completed over elapsed active days, if any signal
  const weeksNeeded = remainingMins / perWeekMins;
  const expectedFinish = addDays(todayStr(), Math.ceil(weeksNeeded * 7));
  const optimisticFinish = addDays(todayStr(), Math.ceil((remainingMins / (perWeekMins * 1.25)) * 7));

  // on-track: compare completion ratio vs elapsed schedule ratio
  const firstDate = rm.days[0] ? rm.days[0].date : todayStr();
  const lastDate = rm.days[rm.days.length - 1] ? rm.days[rm.days.length - 1].date : todayStr();
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
    done: remainingMins === 0 && total > 0,
  };
}
function projectSecondary(rm, remainingMins) {
  if (remainingMins <= 0) return null;
  const active = 1.2;                  // secondary gets little time
  const perWeekMins = active * PER_DAY_MINS * OVERLAP_TAX;
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
  // consecutive past/today active days (by date desc) whose ORIGINAL required tasks are all done
  const past = rm.days.filter(d => !d.off && d.date <= todayStr() && (dayO.get(d.id)?.total || 0) > 0)
    .sort((a, b) => a.date < b.date ? 1 : -1);
  let streak = 0;
  for (const d of past) {
    const o = dayO.get(d.id);
    if (o && o.done === o.total && o.total > 0) streak++;
    else break;
  }
  return streak;
}

/** Lightweight sidebar summary. */
export function sidebarStats(rm) {
  const s = computeAll(rm);
  return { pct: s.overall.actual.pct, track: s.projection.track };
}
