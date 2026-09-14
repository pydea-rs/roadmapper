// engine.mjs — the 3-hour-cap re-flow planner (2026-09-13, owner's rules).
//   node engine.mjs      → plans from the PRISTINE pre-cap files (orig/, from git 4c7e500)
//                          and writes plan.json (takes a few minutes)
// Setup after a fresh checkout (orig/ and node_modules/ are not committed):
//   ./setup.sh
//
// Model
//  - Each roadmap is an ordered STREAM of units: one unit per required task (optional
//    tasks ride along with the required task before them; a day with no required task is
//    one 0-minute unit). Order is never changed.
//  - Week i starts FRAME + 7i. A roadmap gets n slots (cards) that week — the authored
//    count of the home week of its next unopened day (phase-based); rust's RWP tail 2,
//    or 3 when the other roadmaps are light.
//  - Merge semantics (owner's choice): a card holds the tasks carried over from earlier
//    cards FIRST, then opens the next home day and takes as many of its tasks as fit.
//    What doesn't fit is carried into the roadmap's next card. At most one home day opens
//    per card, so every card has one identity (title/theme/soft).
//  - A date's required minutes across all roadmaps ≤ CAP (180). Every card gets ≥ 1 unit;
//    if the cards' first units alone exceed CAP, the largest is split — at sub-task
//    boundaries, or into halves for a plain task. Splitting a SIDE-track task is heavily
//    penalised (its recall cards and one-topic-a-day interleaving would break). Only if no
//    split works is a date allowed up to CAP4 (240), at a heavier penalty.
//  - Per week, every weekday combination of every roadmap is simulated and scored:
//    fairness (Σ lag-in-weeks²), splits, continuation cards, 4h dates, weekday variety, gaps.
import { registry } from "../../tests/_load.mjs";

export const SLUGS = ["rust-fastapi", "interp-go", "bedrock", "raylib"];
export const FRAME = "2026-09-13";
export const CAP = 180, CAP4 = 240, LIGHT = 600, MIN_PART = 30;
export const add = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export const ORIG = new URL("./orig/public/roadmaps/", import.meta.url).pathname;
for (const s of SLUGS) await import(ORIG + s + ".js");

// ---------- streams ----------
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
    const wc = rm.weeks.map(() => 0); rm.days.forEach(d => wc[rm.weeksById.get(d.week).index]++);
    const wmins = rm.weeks.map(() => 0); homes.forEach(h => wmins[h.week] += h.req);
    const plannedCum = []; wmins.reduce((a, m, i) => (plannedCum[i] = a + m), 0);
    const tailRate = wmins.slice(-9, -1).reduce((a, b) => a + b, 0) / 8;
    out[s] = { rm, homes, units, wc, plannedCum, total: plannedCum.at(-1), tailRate };
  }
  return out;
}

const cloneSt = st => ({ ptr: st.ptr, part: st.part, psub: st.psub, opened: st.opened, placed: st.placed });
function remaining(u, st) {
  if (!u.subs) return u.est - st.part;
  let r = 0; for (let j = st.psub; j < u.subs.length; j++) r += u.subs[j]; return r;
}

// ---------- simulate one week for a given weekday choice ----------
function simulate(W, st0, i, choice, weights, record) {
  const st = {}; for (const s of SLUGS) st[s] = cloneSt(st0[s]);
  const load = [0, 0, 0, 0, 0, 0, 0];
  let splits = 0, exc = 0, cont = 0, sideSplits = 0;
  const cards = record ? {} : null;
  if (record) for (const s of SLUGS) cards[s] = [];
  const lagW = s => (W[s].plannedCum[Math.min(i, W[s].plannedCum.length - 1)] - st[s].placed) / W[s].tailRate * weights[s];

  for (let o = 0; o < 7; o++) {
    const act = [];
    for (const s of SLUGS) if (choice[s].includes(o) && st[s].ptr < W[s].units.length) act.push(s);
    if (!act.length) continue;
    const card = {}; for (const s of act) card[s] = { opened: -1, items: [] };
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
      S.placed += mins; room -= mins; load[o] += mins;
      if (u.subs) { S.psub = subTo; if (S.psub >= u.subs.length) { S.ptr++; S.psub = 0; } }
      else { S.part += mins; if (S.part >= u.est) { S.ptr++; S.part = 0; } }
    };
    const whole = m => place(m.s, m.u, m.r, m.u.subs ? m.u.subs.length : undefined);
    const musts = act.map(s => { const u = next(s); return { s, u, r: remaining(u, st[s]) }; });
    const sum = musts.reduce((a, m) => a + m.r, 0);
    if (sum > CAP) {
      musts.sort((a, b) => b.r - a.r);
      const big = musts[0], avail = CAP - (sum - big.r);
      let ok = false;
      if (avail >= MIN_PART) {
        const u = big.u, S = st[big.s];
        const side = W[big.s].rm.kind === "side";
        if (u.subs) {
          let acc = 0, j = S.psub;
          while (j < u.subs.length - 1 && acc + u.subs[j] <= avail) acc += u.subs[j++];
          while (j > S.psub && big.r - acc < MIN_PART) acc -= u.subs[--j];   // no remainder < MIN_PART
          if (acc >= MIN_PART) { place(big.s, u, acc, j); splits++; if (side) sideSplits++; ok = true; }
        } else {
          const take = Math.floor(Math.min(avail, u.est - S.part - MIN_PART) / 5) * 5;
          if (take >= MIN_PART) { place(big.s, u, take); splits++; if (side) sideSplits++; ok = true; }
        }
      }
      if (ok) musts.slice(1).forEach(whole);
      else if (sum <= CAP4) { exc++; musts.forEach(whole); room = Math.max(room, 0); }
      else return null;
    } else musts.forEach(whole);
    // fill by priority (most behind first); a roadmap whose next unit doesn't fit stops
    const stopped = new Set();
    for (;;) {
      let best = null, bp = -Infinity;
      for (const s of act) {
        if (stopped.has(s)) continue;
        const u = next(s);
        if (!u || remaining(u, st[s]) > room) { stopped.add(s); continue; }
        const p = lagW(s);
        if (p > bp) { bp = p; best = s; }
      }
      if (!best) break;
      const u = next(best); place(best, u, remaining(u, st[best]), u.subs ? u.subs.length : undefined);
    }
    for (const s of act) if (card[s].opened === -1) cont++;
    if (record) for (const s of act) cards[s].push({ o, ...card[s] });
  }
  let cost = 0;
  for (const s of SLUGS) { const l = Math.max(0, lagW(s)); cost += weights.K * l * l; }
  cost += weights.split * splits + weights.exc * exc + weights.cont * cont + weights.sideSplit * sideSplits;
  for (let o = 0; o < 7; o++) cost += load[o] * load[o] / 400;
  return { cost, st, load, splits, exc, cards };
}

function combos(k) { const out = []; const rec = (st, acc) => { if (acc.length === k) { out.push(acc.slice()); return; } for (let o = st; o < 7; o++) { acc.push(o); rec(o + 1, acc); acc.pop(); } }; rec(0, []); return out; }
const COMBOS = {}; for (let k = 0; k <= 7; k++) COMBOS[k] = combos(k);
const key = c => c.join("");
function hash(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

function slotCount(W, s, st) {
  const w = W[s];
  if (st.ptr >= w.units.length) return 0;
  const homesLeft = st.opened < w.homes.length;
  const phaseWeek = homesLeft ? w.homes[st.opened].week : w.wc.length - 1;
  let n;
  if (s === "rust-fastapi") n = phaseWeek < 7 ? w.wc[phaseWeek] : 2;
  else if (s === "raylib") n = homesLeft ? Math.max(2, w.wc[phaseWeek]) : 3;
  else if (s === "bedrock") n = homesLeft ? w.wc[phaseWeek] : 3;
  else n = 4;
  return Math.min(n, w.units.length - st.ptr);
}

export const WEIGHTS = { "rust-fastapi": 1, "interp-go": 1, bedrock: 1, raylib: 1, K: 400, split: 60, exc: 5000, cont: 120, sideSplit: 3000 };

export function plan(weights = WEIGHTS) {
  const W = buildStreams();
  let st = {}; for (const s of SLUGS) st[s] = { ptr: 0, part: 0, psub: 0, opened: 0, placed: 0 };
  const ctx = { prevPat: {}, prev2Pat: {}, lastDate: {}, useCount: Object.fromEntries(SLUGS.map(s => [s, {}])) };
  const weeks = [];
  for (let i = 0; i < 80 && SLUGS.some(s => st[s].ptr < W[s].units.length); i++) {
    const base = add(FRAME, 7 * i);
    const tryWeek = rustN => {
      const slots = {};
      for (const s of SLUGS) slots[s] = slotCount(W, s, st[s]);
      if (rustN != null) slots["rust-fastapi"] = rustN;
      const cand = {};
      for (const s of SLUGS) {
        cand[s] = COMBOS[slots[s]].filter(c => {
          if (!c.length) return true;
          if (ctx.prevPat[s] === key(c)) return false;                        // never repeat last week
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
              const r = simulate(W, st, i, choice, weights, false);
              if (!r) continue;
              let sc = r.cost;
              for (const s of SLUGS) { const cc = choice[s]; if (!cc.length) continue; const p = key(cc);
                if (ctx.prev2Pat[s] === p) sc += 300;                         // no A,B,A,B cycling
                sc += 80 * (ctx.useCount[s][p] || 0);                         // spread patterns
                const prev = ctx.prevPat[s] || "";
                for (const x of cc) if (prev.includes(String(x))) sc += 40;   // feel new each week
                if (ctx.lastDate[s]) { const gap = (Date.parse(add(base, cc[0])) - Date.parse(ctx.lastDate[s])) / 864e5; if (gap > 5) sc += 150 * (gap - 5) ** 2; }
                sc += 30 * hash(`${s}|${i}|${p}`);
              }
              if (sc < bestSc) { bestSc = sc; best = { ...choice }; }
            } } } }
      if (!best) return null;
      return { best, rec: simulate(W, st, i, best, weights, true) };
    };
    const R = W["rust-fastapi"], rs = st["rust-fastapi"];
    const inTail = rs.ptr < R.units.length && (rs.opened >= R.homes.length || R.homes[rs.opened].week >= 7);
    let res;
    if (inTail && R.units.length - rs.ptr >= 3) {
      const r3 = tryWeek(3);
      const others = r3 ? SLUGS.filter(s => s !== "rust-fastapi").reduce((a, s) => a + (r3.rec.st[s].placed - st[s].placed), 0) : Infinity;
      res = r3 && others < LIGHT ? r3 : tryWeek(2);
    } else res = tryWeek(null);
    if (!res) throw new Error(`week ${i + 1}: infeasible`);
    const { best, rec } = res;
    weeks.push({ i, base, choice: best, cards: rec.cards, load: rec.load, splits: rec.splits, exc: rec.exc });
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
  let exc = 0, splits = 0, over = 0;
  for (const w of weeks) { exc += w.exc; splits += w.splits; over += w.load.filter(x => x > CAP).length; }
  console.log();
  for (const s of SLUGS) {
    const cards = []; weeks.forEach(w => w.cards[s].forEach(c => cards.push(add(w.base, c.o))));
    const req = W[s].units.reduce((a, u) => a + u.est, 0);
    const placed = weeks.reduce((a, w) => a + w.cards[s].reduce((b, c) => b + c.items.reduce((x, y) => x + y.mins, 0), 0), 0);
    console.log(s, cards.length, "cards", cards[0], "→", cards.at(-1), "req", req, "placed", placed);
  }
  console.log("splits", splits, "4h dates", exc, "over-cap dates", over, `${Math.round((Date.now() - t0) / 1000)}s`);
}
