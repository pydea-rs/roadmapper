// consolidate.mjs — Option B re-schedule: stack all four roadmaps onto SHARED
// working days so the COMBINED daily load lands in the owner's 4–6h band (7h max),
// leaving real rest days. See RESCHEDULE-4-6H.md.
//
// What changes: `date:` on every day, `start:` on every week, and bedrock's inline
// `dow:` labels. NOTHING else — day/task ids, content, order, each day's `week:`
// assignment and every roadmap's day/week COUNT are untouched, so no re-weeking and
// no milestone re-anchoring is needed (that is the whole point of Option B).
//
// Model: all four roadmaps share ONE weekly grid anchored at the journey's existing
// start (Fri 2026-09-04). Roadmap week index i maps to grid week i for all four —
// true today, and it keeps every roadmap's week count and finish window intact.
// Per grid week we pick D working days, D = max(busiest roadmap's day count,
// ceil(total minutes / 6h)), so a week never exceeds 6h/day and never uses more
// days than it must (which is what concentrates the load).
import { readFileSync, writeFileSync } from "node:fs";
import { registry, loadRoadmap } from "../tests/_load.mjs";

const DIR = new URL("../public/roadmaps/", import.meta.url);
const FILES = ["rust-fastapi.js", "interp-go.js", "bedrock.js", "raylib.js"];
const GRID_START = "2026-09-04";          // Friday — the journey's existing first day
// D is chosen to aim at the MIDDLE of the 4–6h band, not its ceiling: dividing by
// the 6h cap produced weeks pinned at 5.7–6.9h with no headroom.
const TARGET_MINS = 330;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Weekday offsets from the Friday anchor, spread out, per number of working days.
// 0=Fri 1=Sat 2=Sun 3=Mon 4=Tue 5=Wed 6=Thu
const PREFERRED = {
  1: [0], 2: [0, 3], 3: [0, 3, 5], 4: [0, 2, 4, 6],
  5: [0, 1, 3, 4, 6], 6: [0, 1, 2, 3, 4, 6], 7: [0, 1, 2, 3, 4, 5, 6],
};

const addDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d) + n * 86400000);
  const p = x => String(x).padStart(2, "0");
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}`;
};
const dowOf = iso => DOW[new Date(iso + "T12:00:00Z").getUTCDay()];
const reqOf = day => day.tasks.reduce((s, t) => s + (t.optional ? 0 : t.est), 0);

/** All ascending k-subsets of [0..n-1] — a roadmap's possible slots within a week.
 *  Ascending order is what keeps its days chronological inside the week. */
function combos(n, k) {
  const out = [];
  (function rec(start, acc) {
    if (acc.length === k) { out.push([...acc]); return; }
    for (let i = start; i < n; i++) { acc.push(i); rec(i + 1, acc); acc.pop(); }
  })(0, []);
  return out;
}

export async function plan() {
  for (const f of FILES) await loadRoadmap(f);
  const rms = FILES.map(f => registry.getRoadmap(f.replace(".js", "")));

  // roadmap -> ordered list of { weekId, days[] } by the roadmap's own week order
  const byRoadmap = new Map();
  let gridWeeks = 0;
  for (const rm of rms) {
    const groups = rm.weeks.map(w => ({ weekId: w.id, days: rm.days.filter(d => d.week === w.id) }));
    byRoadmap.set(rm.slug, groups);
    gridWeeks = Math.max(gridWeeks, groups.length);
  }

  const dayDate = new Map();     // "slug/dayId" -> iso
  const weekStart = new Map();   // "slug/weekId" -> iso
  const weekReport = [];

  for (let w = 0; w < gridWeeks; w++) {
    const start = addDays(GRID_START, w * 7);
    const entries = [];
    for (const rm of rms) {
      const g = byRoadmap.get(rm.slug)[w];
      if (!g) continue;                                   // roadmap already finished
      weekStart.set(`${rm.slug}/${g.weekId}`, start);
      entries.push({ slug: rm.slug, days: g.days, mins: g.days.reduce((s, d) => s + reqOf(d), 0) });
    }
    if (!entries.length) continue;

    const maxDays = Math.max(...entries.map(e => e.days.length));
    const total = entries.reduce((s, e) => s + e.mins, 0);
    // A roadmap can place at most ONE card per date, so D can never drop below the
    // busiest roadmap's day count however light the week is.
    const D = Math.min(7, Math.max(maxDays, Math.ceil(total / TARGET_MINS)));
    const offsets = PREFERRED[D];

    // Assign by EXHAUSTIVE search over each roadmap's choice of slots (the search
    // space is tiny: <= C(5,k) per roadmap), minimising the week's peak day and then
    // its spread. A greedy pass here left a 415m day next to a 220m one.
    const choices = entries.map(e => combos(D, e.days.length));
    const best = { score: Infinity, pick: null };
    const walk = (i, picked) => {
      if (i === entries.length) {
        const load = new Array(D).fill(0);
        entries.forEach((e, k) => e.days.forEach((day, j) => { load[picked[k][j]] += reqOf(day); }));
        const peak = Math.max(...load);
        const spread = Math.max(...load) - Math.min(...load);
        const score = peak * 1000 + spread;
        if (score < best.score) { best.score = score; best.pick = picked.map(p => [...p]); }
        return;
      }
      for (const c of choices[i]) { picked.push(c); walk(i + 1, picked); picked.pop(); }
    };
    walk(0, []);

    const load = new Array(D).fill(0);
    entries.forEach((e, k) => e.days.forEach((day, j) => {
      const i = best.pick[k][j];                          // combos are ascending => chronological
      load[i] += reqOf(day);
      dayDate.set(`${e.slug}/${day.id}`, addDays(start, offsets[i]));
    }));
    weekReport.push({ w, start, D, total, load: [...load],
      offsets: offsets.map(o => DOW[new Date(addDays(start, o) + "T12:00:00Z").getUTCDay()]) });
  }
  return { rms, dayDate, weekStart, weekReport };
}

export function writeFiles({ rms, dayDate, weekStart }) {
  let totals = { date: 0, start: 0, dow: 0 };
  for (const rm of rms) {
    const path = new URL(rm.slug + ".js", DIR);
    let src = readFileSync(path, "utf8");
    for (const d of rm.days) {
      const iso = dayDate.get(`${rm.slug}/${d.id}`);
      if (!iso) throw new Error(`no date planned for ${rm.slug}/${d.id}`);
      const re = new RegExp(`(id: "${d.id}", date: ")\\d{4}-\\d{2}-\\d{2}(")`);
      if (!re.test(src)) throw new Error(`day header not found: ${rm.slug}/${d.id}`);
      src = src.replace(re, `$1${iso}$2`); totals.date++;
    }
    for (const w of rm.weeks) {
      const iso = weekStart.get(`${rm.slug}/${w.id}`);
      if (!iso) throw new Error(`no start planned for ${rm.slug}/${w.id}`);
      const re = new RegExp(`(\\{ id: "${w.id}",[^\\n]*?start: ")\\d{4}-\\d{2}-\\d{2}(")`);
      if (!re.test(src)) throw new Error(`week line not found: ${rm.slug}/${w.id}`);
      src = src.replace(re, `$1${iso}$2`); totals.start++;
    }
    // inline dow labels must be recomputed from the NEW date on the same line
    src = src.replace(/date:\s*"(\d{4}-\d{2}-\d{2})"(.*?)dow:\s*"(\w+)"/g, (m, iso, mid, old) => {
      const nw = dowOf(iso);
      if (nw !== old) totals.dow++;
      return m.replace(`dow: "${old}"`, `dow: "${nw}"`);
    });
    writeFileSync(path, src);
  }
  return totals;
}
