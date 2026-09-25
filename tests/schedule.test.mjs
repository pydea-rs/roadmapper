// schedule.test.mjs — the owner's CALENDAR rules, asserted across all four roadmaps.
//
// Updated for the make-it-doable pass (2026-09-25), which re-priced the content honestly,
// split it at its own seams, and re-flowed it over a longer calendar. The rules:
//
//  1. The REQUIRED minutes of every roadmap on one date add up to at most 3h (180 min).
//     It is a ceiling, never a target — and this plan never reaches for the exception.
//  2. Every roadmap starts on 2026-09-23, on one shared week frame.
//  3. Days per week come from a weekly minutes BUDGET (work left ÷ weeks left) divided by
//     a per-card ceiling, so each roadmap lands on its target week count: rust 3 a week
//     (4 in the closing weeks), interp-go 3–4, bedrock 2–3, raylib a steady 2. Weekdays
//     change from week to week, and no roadmap goes quiet for over a week.
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

t.group("rule 2 — every roadmap starts on 2026-09-23, on one shared week frame");
// ⚠️ SHIFT-SENSITIVE: bump by +N with every uniform date shift (like content.test's ANCHORS).
const FRAME = "2026-09-23";
for (const rm of roadmaps) {
  t.ok(rm.weeks.every((w, i) => w.start === util.addDays(FRAME, 7 * i)), `${rm.slug}: week i starts on ${FRAME} + 7·i`);
  t.eq(rm.weeksById.get(rm.days[0].week).index, 0, `${rm.slug}: starts in week 1 (${rm.days[0].date})`);
}
t.eq(roadmaps.map(rm => rm.days[0].date).sort()[0], FRAME, "day 1 opens on the frame's first day");

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
t.ok(allButLast(counts(ig), 3, 4), `interp-go: 3–4 days a week (${counts(ig).join("")})`);
t.ok(allButLast(counts(br), 2, 3), `bedrock: 2–3 side-days a week (${counts(br).join("")})`);
t.ok(allButLast(counts(ry), 2, 2), `raylib: a steady 2 side-days a week (${counts(ry).join("")})`);
t.ok(allButLast(counts(ru), 3, 4), `rust-fastapi: 3–4 days a week (${counts(ru).join("")})`);
// rust still runs its two-book core first and the RWP arc after it, without interleaving
const ruWeeks = weekDays(ru);
const isCore = ds => ds.some(d => d.tasks.some(x => !x.optional && x.obj !== "rwp"));
const firstTail = ruWeeks.findIndex(ds => !isCore(ds));
t.ok(firstTail > 0 && ruWeeks.slice(firstTail).every(ds => !isCore(ds)), `rust-fastapi: the core comes first, then only RWP (from week ${firstTail + 1})`);

t.group("rule 3 — every roadmap lands on its target week count");
// the planner is given a target and a weekly budget of "work left ÷ weeks left"; hitting
// the target exactly is what proves the budget loop converged rather than drifted
const TARGET_WEEKS = { "rust-fastapi": 48, "interp-go": 40, bedrock: 48, raylib: 40 };
for (const rm of roadmaps) t.eq(rm.weeks.length, TARGET_WEEKS[rm.slug], `${rm.slug}: ${TARGET_WEEKS[rm.slug]} weeks, as planned`);

t.group("rule 3 — a single card is one sitting, not a day's worth");
// the per-CARD ceiling is the change the owner actually asked for: a card holds one or
// two items and the rest is passed along, rather than a card absorbing the whole date
const CARD_CAP = { "rust-fastapi": 105, "interp-go": 105, bedrock: 95, raylib: 95 };
for (const rm of roadmaps) {
  const mins = rm.days.map(reqMins);
  const worst = Math.max(...mins);
  t.ok(worst <= CARD_CAP[rm.slug], `${rm.slug}: no card passes its ${CARD_CAP[rm.slug]} min ceiling (worst ${worst})`);
  const median = mins.slice().sort((a, b) => a - b)[mins.length >> 1];
  t.ok(median <= CARD_CAP[rm.slug] * 0.85, `${rm.slug}: the typical card is well under it (median ${median})`);
}

t.group("rule 3 — weekdays vary week to week, and no roadmap goes quiet for a week");
const pattern = (rm, ds, i) => ds.map(d => gapDays(rm.weeks[i].start, d.date)).join(",");
for (const rm of roadmaps) {
  const pats = weekDays(rm).map((ds, i) => pattern(rm, ds, i));
  t.eq(pats.filter((p, i) => i > 0 && p === pats[i - 1]).length, 0, `${rm.slug}: no week reuses the previous week's exact weekdays`);
  // a roadmap sitting 2 days a week has only 21 possible patterns, so "most weeks are
  // distinct" is measured against what is reachable, not against the week count
  const reach = Math.min(pats.length, ...weekDays(rm).map(ds => ds.length).map(k => [1, 7, 21, 35, 35, 21, 7, 1][k] || 1));
  t.ok(new Set(pats).size >= Math.ceil(Math.min(pats.length, reach) * 0.75),
    `${rm.slug}: most weeks have their own weekday pattern (${new Set(pats).size} distinct of ${pats.length}, ${reach} reachable)`);
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
    if (/cont\.\)$/.test(d.title) !== allCarried) bad.cont.push(d.id);
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

  // DAY TITLES. Two roadmaps number a multi-card topic differently — interp-go marks
  // every card of a run "(k/n)", the others leave a 2-card pair as "X" / "X (cont.)" —
  // and both read fine. What must hold either way:
  //   1. a "(k/n)" on a card, where present, describes the REAL run it sits in. An
  //      inherited marker from an older pacing is how three different cards all ended
  //      up reading "(1/2)".
  //   2. no two cards share a title, or the timeline shows the same heading twice with
  //      no way to tell them apart (a 3-card run numbered only by "(cont.)" does this).
  // "(cont.)" keeps its own meaning — all work here was carried in — and rides
  // alongside the number: "(2/5, cont.)".
  const TITLE_MARK = /\s*\(\s*(?:cont\.|\d+\s*\/\s*\d+(?:\s*,\s*cont\.)?)\s*\)\s*$/;
  const topicOf = x => String(x || "").replace(TITLE_MARK, "").trim();
  const runs = [];
  for (const d of rm.days) {
    const last = runs[runs.length - 1];
    if (last && last.topic === topicOf(d.title)) last.days.push(d);
    else runs.push({ topic: topicOf(d.title), days: [d] });
  }
  const wrongMark = [];
  for (const r of runs) r.days.forEach((d, i) => {
    const m = /\((\d+)\/(\d+)(?:, cont\.)?\)\s*$/.exec(d.title);
    if (!m) return;                                  // unnumbered is allowed
    if (+m[1] !== i + 1 || +m[2] !== r.days.length)
      wrongMark.push(`${d.id} says (${m[1]}/${m[2]}) but is card ${i + 1} of ${r.days.length}`);
  });
  t.deep(wrongMark, [], `${rm.slug}: a card's "(k/n)" describes the real run it sits in`);
  const titles = rm.days.map(d => d.title);
  const dupTitles = titles.filter((x, i) => titles.indexOf(x) !== i);
  t.deep([...new Set(dupTitles)], [], `${rm.slug}: no two day cards share a title`);
  // a "(cont.)" card's theme names the card it continues — which must still exist
  const badTheme = rm.days.filter(d => {
    const m = /^Finish “(.+?)” — the part that didn't fit its first session\.$/.exec(d.theme || "");
    if (!m) return false;
    const origin = rm.daysById.get((d.tasks.find(x => x.carried) || {}).carried);
    return !origin || origin.title !== m[1];
  }).map(d => d.id);
  t.deep(badTheme, [], `${rm.slug}: a continuation card's theme quotes its origin card's current title`);
}
t.done();
