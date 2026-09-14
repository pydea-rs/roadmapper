// schedule.test.mjs — the owner's CALENDAR rules, asserted across all four roadmaps.
//
// Written for the 3-hour cap re-plan (2026-09-13), which replaced the 4–6h re-plan of the
// same day after the owner read the Horizon view's daily totals. The rules:
//
//  1. The REQUIRED minutes of every roadmap on one date add up to at most 3h (180 min).
//     It is a ceiling, never a target. A few 4h dates are allowed when a roadmap would
//     otherwise run far past its extension allowance; nothing ever goes beyond 4h.
//  2. Every roadmap restarted on 2026-09-13, on one shared week frame.
//  3. Days per week follow the phase of the content: rust's two-book core 4–5, its RWP arc
//     2 (a 3rd only when the other roadmaps are light), interp-go 4, bedrock 2–4, raylib
//     2–3. Weekdays change from week to week, and no roadmap goes quiet for over a week.
//  4. When a date would overflow, tasks are passed along IN ORDER into the roadmap's next
//     card, ahead of that card's own tasks (`carried`); a card left with only carried work
//     is "(cont.)"; a task too big to share a date is split into "(k/n)" parts.
//
// If a future re-plan changes a rule ON PURPOSE, change the matching assertion here with
// it — don't just loosen a number until it passes.
import { suite } from "./_harness.mjs";
import { registry, util, stats, loadRoadmap } from "./_load.mjs";

const t = suite("schedule");
await loadRoadmap("rust-fastapi.js");
await loadRoadmap("interp-go.js");
await loadRoadmap("bedrock.js");
await loadRoadmap("raylib.js");
const roadmaps = registry.getRoadmaps();

const reqMins = d => d.tasks.reduce((s, x) => s + (x.optional ? 0 : x.est || 0), 0);
const gapDays = (a, b) => util.daysBetween(a, b);

// ---- combined load per calendar date ----
const byDate = new Map();   // date -> { mins, slugs:Set }
for (const rm of roadmaps)
  for (const d of rm.days) {
    const e = byDate.get(d.date) || { mins: 0, slugs: new Set() };
    e.mins += reqMins(d); e.slugs.add(rm.slug);
    byDate.set(d.date, e);
  }
const entries = [...byDate.entries()];

t.group("rule 1 — a date's combined required load is at most 3h");
const CAP = 180, RARE = 240, RARE_MAX = 5;   // 3h · the rare 4h exception · how rare
const over = entries.filter(([, e]) => e.mins > CAP);
t.ok(over.length <= RARE_MAX, `at most ${RARE_MAX} dates may pass 3h (found ${over.length}: ${over.map(([d, e]) => `${d}=${e.mins}`).join(" ")})`);
t.deep(entries.filter(([, e]) => e.mins > RARE).map(([d, e]) => `${d}=${e.mins}`), [], `no date ever passes 4h (${RARE} min)`);
const peak = Math.max(...entries.map(([, e]) => e.mins));
t.ok(peak <= RARE, `busiest date ${peak} min`);
t.eq(stats.dailyBudget(), CAP,
  "the app's daily ceiling (Horizon gauge, projections) is the same 3h");

t.group("rule 2 — every roadmap restarted on 2026-09-13, on one shared week frame");
// ⚠️ SHIFT-SENSITIVE: bump by +N with every uniform date shift (like content.test's ANCHORS).
const FRAME = "2026-09-13";
for (const rm of roadmaps) {
  t.ok(rm.weeks.every((w, i) => w.start === util.addDays(FRAME, 7 * i)), `${rm.slug}: week i starts on ${FRAME} + 7·i`);
  t.eq(rm.weeksById.get(rm.days[0].week).index, 0, `${rm.slug}: starts in week 1 (${rm.days[0].date})`);
}
t.eq(roadmaps.map(rm => rm.days[0].date).sort()[0], FRAME, "the restart opens on the frame's first day");

t.group("rule 3 — how many days each roadmap gets per week");
const weekDays = rm => {                       // week index -> its days, in order
  const out = rm.weeks.map(() => []);
  for (const d of rm.days) out[rm.weeksById.get(d.week).index].push(d);
  return out;
};
const counts = rm => weekDays(rm).map(ds => ds.length);
const ig = registry.getRoadmap("interp-go"), br = registry.getRoadmap("bedrock"),
      ry = registry.getRoadmap("raylib"), ru = registry.getRoadmap("rust-fastapi");
const allButLast = (c, lo, hi) => c.slice(0, -1).every(n => n >= lo && n <= hi) && c.at(-1) >= 1 && c.at(-1) <= hi;
t.ok(allButLast(counts(ig), 4, 4), `interp-go: 4 days in every week but a shorter last one (${counts(ig).join("")})`);
t.ok(allButLast(counts(br), 2, 4), `bedrock: 2–4 side-days a week (${counts(br).join("")})`);
t.ok(allButLast(counts(ry), 2, 3), `raylib: 2–3 side-days a week (${counts(ry).join("")})`);
// rust: a week holding any two-book-core work is a core week (4–5 days); after that the RWP arc runs 2–3
const ruWeeks = weekDays(ru);
const isCore = ds => ds.some(d => d.tasks.some(x => !x.optional && x.obj !== "rwp"));
const firstTail = ruWeeks.findIndex(ds => !isCore(ds));
t.ok(firstTail > 0 && ruWeeks.slice(firstTail).every(ds => !isCore(ds)), `rust-fastapi: the core comes first, then only RWP (from week ${firstTail + 1})`);
t.ok(ruWeeks.slice(0, firstTail).every(ds => ds.length >= 4 && ds.length <= 5), `rust-fastapi: core weeks hold 4–5 days (${counts(ru).slice(0, firstTail).join("")})`);
t.ok(allButLast(counts(ru).slice(firstTail), 2, 3), `rust-fastapi: the RWP arc runs 2 or 3 days a week (${counts(ru).slice(firstTail).join("")})`);

t.group("rule 3 — rust takes a 3rd RWP day only in a light week");
const LIGHT = 600;   // combined required minutes of the OTHER roadmaps that week
const otherLoad = i => [ig, br, ry].reduce((s, rm) => s + (weekDays(rm)[i] || []).reduce((a, d) => a + reqMins(d), 0), 0);
const rc = counts(ru);
const threeDayWeeks = rc.map((n, i) => ({ n, i })).filter(x => x.i >= firstTail && x.n === 3);
t.ok(threeDayWeeks.length > 0, `the arc does use 3-day weeks (${threeDayWeeks.length})`);
t.deep(threeDayWeeks.filter(x => otherLoad(x.i) >= LIGHT).map(x => `w${x.i + 1}:${otherLoad(x.i)}`), [],
  `every 3-day RWP week falls where the other roadmaps total < ${LIGHT} min`);
t.deep(rc.map((n, i) => ({ n, i })).filter(x => x.i >= firstTail && x.i < rc.length - 1 && x.n === 2 && otherLoad(x.i) < LIGHT)
  .map(x => `w${x.i + 1}`), [], "and no light week is left at 2 (the arc never idles when there's room)");

t.group("rule 3 — weekdays vary week to week, and no roadmap goes quiet for a week");
const pattern = (rm, ds, i) => ds.map(d => gapDays(rm.weeks[i].start, d.date)).join(",");
for (const rm of roadmaps) {
  const pats = weekDays(rm).map((ds, i) => pattern(rm, ds, i));
  t.eq(pats.filter((p, i) => i > 0 && p === pats[i - 1]).length, 0, `${rm.slug}: no week reuses the previous week's exact weekdays`);
  t.ok(new Set(pats).size >= Math.ceil(pats.length * 0.75),
    `${rm.slug}: most weeks have their own weekday pattern (${new Set(pats).size} distinct of ${pats.length})`);
  t.eq(new Set(rm.days.map(d => util.parseDate(d.date).getDay())).size, 7, `${rm.slug}: over its arc it lands on all seven weekdays`);
  let worst = 0;
  for (let i = 1; i < rm.days.length; i++) worst = Math.max(worst, gapDays(rm.days[i - 1].date, rm.days[i].date));
  t.ok(worst <= 7, `${rm.slug}: consecutive sessions are at most 7 days apart (worst ${worst})`);
}

t.group("rule 4 — carried-over work keeps its order and its origin");
for (const rm of roadmaps) {
  const idx = new Map(rm.days.map((d, i) => [d.id, i]));
  const bad = { order: [], origin: [], cont: [], chain: [] };
  let lastOrigin = -1;
  rm.days.forEach((d, i) => {
    const carried = d.tasks.map(x => !!x.carried);
    if (carried.some((c, k) => c && carried.slice(0, k).includes(false))) bad.order.push(d.id);
    for (const x of d.tasks) {
      const from = x.carried ? idx.get(x.carried) : i;
      if (x.carried && !(from < i)) bad.origin.push(x.id);
      if (!x.optional) { if (from < lastOrigin) bad.chain.push(x.id); lastOrigin = Math.max(lastOrigin, from); }
    }
    const allCarried = d.tasks.length > 0 && carried.every(Boolean);
    if (/\(cont\.\)$/.test(d.title) !== allCarried) bad.cont.push(d.id);
  });
  t.deep(bad.order, [], `${rm.slug}: carried tasks come before a card's own tasks`);
  t.deep(bad.origin, [], `${rm.slug}: a task is only ever carried FROM an earlier card`);
  t.deep(bad.chain, [], `${rm.slug}: required work never jumps back to an older origin (order kept)`);
  t.deep(bad.cont, [], `${rm.slug}: a card is "(cont.)" exactly when all of its tasks were carried in`);
  // split parts "(k/n)": part k>1 is carried from the card holding part 1 and follows part k-1
  // of the same task, on a later date
  const partRe = /^(.*) \((\d)\/(\d)\)$/s;
  const parts = rm.days.flatMap(d => d.tasks.map(x => ({ x, d, m: partRe.exec(x.lead || x.label || "") }))).filter(e => e.m);
  let okParts = parts.length === 0 || parts[0].m[2] === "1";
  for (let k = 1; k < parts.length; k++) {
    const { x, d, m } = parts[k], prev = parts[k - 1];
    if (m[2] === "1") continue;
    if (!x.carried || prev.m[1] !== m[1] || +prev.m[2] !== +m[2] - 1 || prev.m[3] !== m[3] || !(prev.d.date < d.date)) okParts = false;
  }
  t.ok(okParts, `${rm.slug}: split task parts run (1/n) → (n/n) across consecutive sessions`);
}

t.done();
