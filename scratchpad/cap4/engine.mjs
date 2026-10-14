// engine.mjs — the 2026-09-25 "make it doable" re-flow planner.
//   node engine.mjs   → plan.json  (deterministic; a couple of minutes)
//
// What changed from the 3-hour-cap planner (scratchpad/cap3):
//  - It plans from pub/roadmaps/ (reprice.mjs output), not from the pre-cap files.
//  - Each roadmap is given a TARGET WEEK COUNT. Every week it gets a minutes budget of
//    "work left ÷ weeks left", so it lands on that target however the content splits.
//  - Every CARD has its own ceiling (CARD_CAP) on top of the shared per-DATE ceiling of
//    180 min. That is the actual fix the owner asked for: a session is a session, so a
//    card holds one or two items, and the rest is passed along to the next card.
//  - Continuation cards are therefore normal, not a penalty to avoid.
// Everything else is kept: merge semantics (carried work first, then at most one new
// home day per card), per-week exhaustive weekday search, and the variety rules.
import { registry } from "../../tests/_load.mjs";

export const SLUGS = ["rust-fastapi", "interp-go", "bedrock", "raylib"];
export const FRAME = "2026-10-24";   // owner moved day 1 to 09-23 on 2026-09-25 (was 09-13), then +31 on 2026-10-14
export const CAP = 180, MIN_PART = 25;
// owner's answer (2026-09-25): go past the limits he first named, by 8 weeks
export const TARGET_WEEKS = { "rust-fastapi": 48, "interp-go": 40, bedrock: 48, raylib: 40 };
// one sitting's worth of work on one card, and how many cards a week may hold
export const CARD_CAP  = { "rust-fastapi": 105, "interp-go": 105, bedrock: 95, raylib: 95 };
export const CARDS     = { "rust-fastapi": [2, 4], "interp-go": [3, 5], bedrock: [2, 4], raylib: [2, 3] };
export const add = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export const SRC = new URL("./pub/roadmaps/", import.meta.url).pathname;
for (const s of SLUGS) await import(SRC + s + ".js");

// ---------- streams ----------
// one unit per REQUIRED task; optional tasks ride along with the required task before
// them; a day with no required task becomes one 0-minute unit so it still opens a card
export function buildStreams() {
  const out = {};
  for (const s of SLUGS) {
    const rm = registry.getRoadmap(s);
    const homes = rm.days.map((d, k) => ({ k, id: d.id, week: rm.weeksById.get(d.week).index, req: 0, units: [] }));
    const units = [];
    rm.days.forEach((d, k) => {
      const h = homes[k];
      let cur = null; const pre = [];
      d.tasks.forEach((t, ti) => {
        if (t.optional) { if (cur) cur.opt.push(ti); else pre.push(ti); return; }
        cur = { s, k, ti, est: t.est || 0, subs: t.subs ? t.subs.map(x => x.est || 0) : null, opt: [], pre: pre.splice(0) };
        h.units.push(cur); units.push(cur); h.req += cur.est;
      });
      if (!h.units.length) { const u = { s, k, ti: -1, est: 0, subs: null, opt: [], pre: pre.splice(0), buffer: true }; h.units.push(u); units.push(u); }
    });
    units.forEach((u, i) => u.i = i);
    homes.forEach(h => { h.first = h.units[0].i; h.last = h.units.at(-1).i; });
    const total = units.reduce((a, u) => a + u.est, 0);
    out[s] = { rm, homes, units, total };
  }
  return out;
}

const cloneSt = st => ({ ptr: st.ptr, part: st.part, psub: st.psub, opened: st.opened, placed: st.placed });
function remaining(u, st) {
  if (!u.subs) return u.est - st.part;
  let r = 0; for (let j = st.psub; j < u.subs.length; j++) r += u.subs[j]; return r;
}

// ---------- simulate one week for a given weekday choice ----------
function simulate(W, st0, i, choice, budget, weights, record) {
  const st = {}; for (const s of SLUGS) st[s] = cloneSt(st0[s]);
  const load = [0, 0, 0, 0, 0, 0, 0];
  let splits = 0, spill = 0;
  const cards = record ? {} : null;
  if (record) for (const s of SLUGS) cards[s] = [];
  const weekStart = {}; for (const s of SLUGS) weekStart[s] = st[s].placed;

  for (let o = 0; o < 7; o++) {
    const act = [];
    for (const s of SLUGS) if (choice[s].includes(o) && st[s].ptr < W[s].units.length) act.push(s);
    if (!act.length) continue;
    const card = {}, cardRoom = {};
    for (const s of act) { card[s] = { opened: -1, items: [] }; cardRoom[s] = CARD_CAP[s]; }
    let room = CAP;
    const next = s => {                       // null when blocked by one-home-per-card
      const S = st[s], U = W[s].units;
      if (S.ptr >= U.length) return null;
      const u = U[S.ptr];
      if (S.opened > u.k) return u;
      if (card[s].opened !== -1) return null;
      return u;
    };
    const place = (s, u, mins, subTo) => {
      const S = st[s];
      if (S.opened <= u.k) { S.opened = u.k + 1; card[s].opened = u.k; }
      if (record) card[s].items.push({ i: u.i, from: u.subs ? S.psub : S.part, to: u.subs ? subTo : S.part + mins, mins, carried: card[s].opened !== u.k });
      S.placed += mins; room -= mins; cardRoom[s] -= mins; load[o] += mins;
      if (u.subs) { S.psub = subTo; if (S.psub >= u.subs.length) { S.ptr++; S.psub = 0; } }
      else { S.part += mins; if (S.part >= u.est) { S.ptr++; S.part = 0; } }
    };
    // take as much of `u` as fits in `avail`, splitting at a sub boundary when it can
    const takeUpTo = (s, u, avail) => {
      const S = st[s], r = remaining(u, S);
      if (r <= avail) { place(s, u, r, u.subs ? u.subs.length : undefined); return true; }
      if (avail < MIN_PART) return false;
      if (u.subs) {
        let acc = 0, j = S.psub;
        while (j < u.subs.length - 1 && acc + u.subs[j] <= avail) acc += u.subs[j++];
        while (j > S.psub && r - acc < MIN_PART) acc -= u.subs[--j];
        if (acc < MIN_PART) return false;
        place(s, u, acc, j); splits++; return true;
      }
      const take = Math.floor(Math.min(avail, u.est - S.part - MIN_PART) / 5) * 5;
      if (take < MIN_PART) return false;
      place(s, u, take); splits++; return true;
    };
    // every active roadmap places something on its card; the date ceiling is shared, so
    // roadmaps furthest behind their weekly budget get first call on it
    const order = act.slice().sort((a, b) =>
      (budget[b] - (st[b].placed - weekStart[b])) - (budget[a] - (st[a].placed - weekStart[a])));
    for (const s of order) {
      const u = next(s);
      if (!u) continue;
      if (!takeUpTo(s, u, Math.min(room, cardRoom[s])) && room < CAP) return null;
    }
    // then fill each card toward its own ceiling, while the week's budget lasts
    for (let guard = 0; guard < 40; guard++) {
      let moved = false;
      for (const s of order) {
        if (st[s].placed - weekStart[s] >= budget[s]) continue;
        const u = next(s);
        if (!u) continue;
        const avail = Math.min(room, cardRoom[s], budget[s] - (st[s].placed - weekStart[s]));
        if (avail < MIN_PART) continue;
        if (takeUpTo(s, u, avail)) moved = true;
      }
      if (!moved) break;
    }
    if (record) for (const s of act) if (card[s].items.length) cards[s].push({ o, ...card[s] });
  }
  for (const s of SLUGS) spill += Math.abs((st[s].placed - weekStart[s]) - budget[s]);
  let cost = weights.spill * spill + weights.split * splits;
  for (let o = 0; o < 7; o++) cost += load[o] * load[o] / 400;
  return { cost, st, load, splits, cards };
}

function combos(k) { const out = []; const rec = (st, acc) => { if (acc.length === k) { out.push(acc.slice()); return; } for (let o = st; o < 7; o++) { acc.push(o); rec(o + 1, acc); acc.pop(); } }; rec(0, []); return out; }
const COMBOS = {}; for (let k = 0; k <= 7; k++) COMBOS[k] = combos(k);
const key = c => c.join("");
function hash(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

export const WEIGHTS = { spill: 1.2, split: 25 };

export function plan(weights = WEIGHTS) {
  const W = buildStreams();
  let st = {}; for (const s of SLUGS) st[s] = { ptr: 0, part: 0, psub: 0, opened: 0, placed: 0 };
  const ctx = { prevPat: {}, prev2Pat: {}, lastDate: {}, useCount: Object.fromEntries(SLUGS.map(s => [s, {}])) };
  const weeks = [];
  for (let i = 0; i < TARGET_WEEKS["rust-fastapi"] + 12 && SLUGS.some(s => st[s].ptr < W[s].units.length); i++) {
    const base = add(FRAME, 7 * i);
    // this week's minutes for each roadmap: what is left, spread over the weeks left
    const budget = {}, slots = {};
    for (const s of SLUGS) {
      const left = W[s].total - st[s].placed;
      if (left <= 0) { budget[s] = 0; slots[s] = 0; continue; }
      const weeksLeft = Math.max(1, TARGET_WEEKS[s] - i);
      budget[s] = left / weeksLeft * 1.04;   // a little headroom so rounding can't push the finish a week out
      const [lo, hi] = CARDS[s];
      slots[s] = Math.min(hi, Math.max(lo, Math.round(budget[s] / (CARD_CAP[s] * 0.8))));
    }
    const cand = {};
    for (const s of SLUGS) {
      cand[s] = COMBOS[slots[s]].filter(c => {
        if (!c.length) return true;
        if (ctx.prevPat[s] === key(c)) return false;                       // never repeat last week
        if (i === 0 && s === "rust-fastapi" && c[0] !== 0) return false;   // the restart opens on day 1
        if (ctx.lastDate[s] && (Date.parse(add(base, c[0])) - Date.parse(ctx.lastDate[s])) / 864e5 > 7) return false;
        return true;
      });
      if (!cand[s].length) cand[s] = COMBOS[slots[s]];
    }
    let best = null, bestSc = Infinity;
    const [A, B, C, D] = SLUGS, choice = {};
    for (const a of cand[A]) { choice[A] = a;
      for (const b of cand[B]) { choice[B] = b;
        for (const c of cand[C]) { choice[C] = c;
          for (const d of cand[D]) { choice[D] = d;
            const r = simulate(W, st, i, choice, budget, weights, false);
            if (!r) continue;
            let sc = r.cost;
            for (const s of SLUGS) { const cc = choice[s]; if (!cc.length) continue; const p = key(cc);
              if (ctx.prev2Pat[s] === p) sc += 300;                        // no A,B,A,B cycling
              sc += 80 * (ctx.useCount[s][p] || 0);                        // spread patterns
              const prev = ctx.prevPat[s] || "";
              for (const x of cc) if (prev.includes(String(x))) sc += 40;   // feel new each week
              if (ctx.lastDate[s]) { const gap = (Date.parse(add(base, cc[0])) - Date.parse(ctx.lastDate[s])) / 864e5; if (gap > 5) sc += 150 * (gap - 5) ** 2; }
              sc += 30 * hash(`${s}|${i}|${p}`);
            }
            if (sc < bestSc) { bestSc = sc; best = { ...choice }; }
          } } } }
    if (!best) throw new Error(`week ${i + 1}: infeasible`);
    const rec = simulate(W, st, i, best, budget, weights, true);
    weeks.push({ i, base, choice: best, cards: rec.cards, load: rec.load, splits: rec.splits });
    for (const s of SLUGS) { if (!rec.cards[s].length) continue;
      const p = key(best[s]); ctx.prev2Pat[s] = ctx.prevPat[s]; ctx.prevPat[s] = p;
      ctx.useCount[s][p] = (ctx.useCount[s][p] || 0) + 1; ctx.lastDate[s] = add(base, rec.cards[s].at(-1).o); }
    st = rec.st;
    process.stderr.write(`w${i + 1} `);
  }
  return { W, weeks };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import("node:fs");
  const t0 = Date.now();
  const { W, weeks } = plan();
  fs.writeFileSync(new URL("./plan.json", import.meta.url), JSON.stringify(weeks.map(w => ({ i: w.i, base: w.base, choice: w.choice, cards: w.cards, load: w.load }))));
  let splits = 0, over = 0;
  const dates = {};
  for (const w of weeks) { splits += w.splits; over += w.load.filter(x => x > CAP).length; w.load.forEach((m, o) => { if (m) dates[add(w.base, o)] = m; }); }
  console.log();
  for (const s of SLUGS) {
    const cards = []; weeks.forEach(w => w.cards[s].forEach(c => cards.push({ date: add(w.base, c.o), wi: w.i, mins: c.items.reduce((a, x) => a + x.mins, 0) })));
    const placed = cards.reduce((a, c) => a + c.mins, 0);
    const mins = cards.map(c => c.mins).sort((a, b) => a - b);
    console.log(`${s}: ${cards.length} cards / ${cards.at(-1).wi + 1} weeks (target ${TARGET_WEEKS[s]}), ${cards[0].date} → ${cards.at(-1).date}; req ${W[s].total} placed ${placed}; card median ${mins[mins.length >> 1]}m max ${mins.at(-1)}m`);
  }
  const dv = Object.values(dates).sort((a, b) => a - b);
  console.log(`dates used ${dv.length}; per-date median ${dv[dv.length >> 1]}m, max ${dv.at(-1)}m, over cap ${over}; splits ${splits}; ${Math.round((Date.now() - t0) / 1000)}s`);
}
