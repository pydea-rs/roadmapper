// replan.mjs — week-by-week VARIED scheduler (2026-09-13, owner's corrected rules).
// Replaces consolidate.mjs (the rejected "stack everything on shared working days" engine).
//   node scratchpad/replan.mjs        → rebuild the plan from the LIVE roadmap files and
//                                        report every date that differs (0 = in sync)
// It only reads; writing dates back was a one-off (per-day `date:` regex + bedrock `dow:`,
// and rust's re-weeked tail titles/milestones) — re-derive titles by hand if the tail moves.
//
// Rules (owner's words, confirmed):
//  - each roadmap keeps its authored number of days IN EACH WEEK (the "weekday rule");
//    WHICH weekdays is free and should differ week to week ("fully free" — back-to-back ok);
//  - rust's RWP tail is 2/wk, 3/wk in weeks where the other roadmaps are light (< 600 min);
//  - the combined required load of a DATE is a MAXIMUM: ~4h when 1–2 roadmaps share it,
//    up to 6h when 3+ do, 7h only rarely. Light days stay light — nothing is padded;
//  - every day re-dated from the current start; each roadmap's day 1 keeps its date.
import { registry, loadRoadmap } from "../tests/_load.mjs";
for (const f of ["rust-fastapi", "interp-go", "bedrock", "raylib"]) await loadRoadmap(f + ".js");
const C = {};
for (const s of ["rust-fastapi", "interp-go", "bedrock", "raylib"]) {
  const rm = registry.getRoadmap(s);
  C[s] = { weeks: rm.weeks.map(w => ({ id: w.id, start: w.start })),
    days: rm.days.map(d => ({ id: d.id, date: d.date, week: d.week, tasks: d.tasks.map(t => ({ est: t.est, optional: !!t.optional })) })) };
}
const SLUGS = ["rust-fastapi", "interp-go", "bedrock", "raylib"];
const FRAME = "2026-09-04";
const add = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const req = d => d.tasks.reduce((s, t) => s + (t.optional ? 0 : t.est), 0);
const weekIdx = (slug, wid) => C[slug].weeks.findIndex(w => w.id === wid);

// ---------- per-week day lists ----------
const weeksOf = {};   // slug -> array (week index 0-based) of day objects
for (const s of ["interp-go", "bedrock", "raylib"]) {
  weeksOf[s] = [];
  for (const d of C[s].days) (weeksOf[s][weekIdx(s, d.week)] ||= []).push(d);
}
const others = i => ["interp-go", "bedrock", "raylib"].reduce((a, s) => a + (weeksOf[s][i] || []).reduce((x, d) => x + req(d), 0), 0);
const rust = C["rust-fastapi"].days;
weeksOf["rust-fastapi"] = [];
for (const d of rust.slice(0, 32)) (weeksOf["rust-fastapi"][weekIdx("rust-fastapi", d.week)] ||= []).push(d);
export const LIGHT = 600;
{ let i = 7, k = 32;
  while (k < rust.length) { const n = others(i) < LIGHT ? 3 : 2; weeksOf["rust-fastapi"][i] = rust.slice(k, k + n); k += n; i++; } }
const NW = Math.max(...SLUGS.map(s => weeksOf[s].length));

// ---------- combos ----------
function combos(k) { const out = []; const rec = (st, acc) => { if (acc.length === k) { out.push(acc.slice()); return; } for (let o = st; o < 7; o++) { acc.push(o); rec(o + 1, acc); acc.pop(); } }; rec(0, []); return out; }
const COMBOS = {}; for (let k = 0; k <= 7; k++) COMBOS[k] = combos(k);
const key = c => c.join("");
// deterministic jitter so ties don't always favour the same offsets
function hash(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

// ---------- caps ----------
export const SOFT2 = 240, HARD2 = 270, SOFT3 = 300, HARD3 = 360;

function scoreWeek(i, choice, ctx) {
  // choice: slug -> combo; ctx: prevPat, prev2Pat, lastDate, useCount
  const load = new Array(7).fill(0), n = new Array(7).fill(0);
  for (const s of SLUGS) { const days = weeksOf[s][i] || []; const c = choice[s];
    c.forEach((o, j) => { load[o] += req(days[j]); n[o]++; }); }
  let sc = 0;
  for (let o = 0; o < 7; o++) {
    if (n[o] <= 2) { if (load[o] > HARD2) return Infinity; sc += 40 * Math.max(0, load[o] - SOFT2) ** 2; }
    else { if (load[o] > HARD3) return Infinity; sc += 40 * Math.max(0, load[o] - SOFT3) ** 2; }
    sc += load[o] * load[o] / 50;            // gentle balance: prefer not to pile up
  }
  const base = add(FRAME, 7 * i);
  for (const s of SLUGS) { const c = choice[s]; if (!c.length) continue; const p = key(c);
    if (ctx.prev2Pat[s] === p) sc += 600;                    // no A,B,A,B cycling
    sc += 150 * (ctx.useCount[s][p] || 0);                    // spread usage over many patterns
    const prevSet = new Set((ctx.prevPat[s] || "").split("").filter(Boolean).map(Number));
    sc += 120 * c.filter(o => prevSet.has(o)).length;         // feel new: fewer repeated weekdays
    if (ctx.lastDate[s]) { const gap = (Date.parse(add(base, c[0])) - Date.parse(ctx.lastDate[s])) / 864e5;
      if (gap > 6) sc += 250 * (gap - 6) ** 2; }              // don't leave a roadmap untouched > 6 days
    sc += 60 * hash(`${s}|${i}|${p}`);
  }
  return sc;
}

export function plan() {
  const ctx = { prevPat: {}, prev2Pat: {}, lastDate: {}, useCount: Object.fromEntries(SLUGS.map(s => [s, {}])) };
  const result = {};   // slug -> [{id,date,weekIndex}]
  for (const s of SLUGS) result[s] = [];
  const weekly = [];
  for (let i = 0; i < NW; i++) {
    const base = add(FRAME, 7 * i);
    const cand = {};
    for (const s of SLUGS) {
      const days = weeksOf[s][i] || [];
      cand[s] = COMBOS[days.length].filter(c => {
        if (days.length && ctx.prevPat[s] === key(c)) return false;          // never repeat last week
        if (days.length && days[0].id === "d01" && add(base, c[0]) !== C[s].days[0].date) return false; // day 1 keeps its date
        return true;
      });
      if (!cand[s].length) cand[s] = COMBOS[days.length];
    }
    let best = null, bestSc = Infinity;
    const [A, B, Cc, D] = SLUGS;
    for (const a of cand[A]) for (const b of cand[B]) for (const c of cand[Cc]) for (const d of cand[D]) {
      const ch = { [A]: a, [B]: b, [Cc]: c, [D]: d };
      const sc = scoreWeek(i, ch, ctx);
      if (sc < bestSc) { bestSc = sc; best = ch; }
    }
    if (!best) throw new Error(`week ${i + 1}: no feasible assignment under the caps`);
    weekly.push(best);
    for (const s of SLUGS) { const days = weeksOf[s][i] || []; if (!days.length) continue;
      best[s].forEach((o, j) => result[s].push({ id: days[j].id, date: add(base, o), weekIndex: i }));
      const p = key(best[s]); ctx.prev2Pat[s] = ctx.prevPat[s]; ctx.prevPat[s] = p;
      ctx.useCount[s][p] = (ctx.useCount[s][p] || 0) + 1; ctx.lastDate[s] = add(base, best[s].at(-1)); }
  }
  return { result, weeksOf, NW };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const t0 = Date.now(); const { result } = plan();
  let diff = 0;
  for (const s of SLUGS) result[s].forEach(x => { const d = C[s].days.find(y => y.id === x.id);
    if (d.date !== x.date || (s === "rust-fastapi" && d.week !== `w${x.weekIndex + 1}`)) { diff++; console.log(`  ${s}/${x.id}: file ${d.date} ${d.week} · plan ${x.date} w${x.weekIndex + 1}`); } });
  console.log(`planned in ${Date.now() - t0} ms — ${diff} day(s) differ from the files`);
}
