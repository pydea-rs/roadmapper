// schedule.test.mjs — the owner's CALENDAR rules, asserted across all four roadmaps.
//
// Written for the 2026-09-13 re-plan, which replaced two passes that misread the rules
// (one padded days toward a 4–6h target; the next stacked every roadmap onto a few
// fixed "working days" with rest days between). The rules as the owner clarified them:
//
//  1. The sum of every roadmap's REQUIRED tasks on one date is capped — a MAXIMUM,
//     never a target: ~4h when 1–2 roadmaps have a card that day, up to 6h when 3+ do,
//     7h only rarely. Light days are fine and are never padded.
//  2. A roadmap's rule is how many days it gets IN EACH WEEK, never which weekdays.
//     Weekdays should vary from week to week so no two weeks feel the same.
//  3. rust-fastapi's RWP tail is 2 days/week, taking a 3rd only when the other
//     roadmaps are light that week.
//
// If a future re-plan changes a rule ON PURPOSE, change the matching assertion here
// with it — don't just loosen a number until it passes.
import { suite } from "./_harness.mjs";
import { registry, util, loadRoadmap } from "./_load.mjs";

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

t.group("rule 1 — the day's combined load is a ceiling, scaled by how many roadmaps share it");
const FEW = 270, MANY = 360, HARD = 420;   // ~4h (give or take) · 6h · 7h
const fewOver = entries.filter(([, e]) => e.slugs.size <= 2 && e.mins > FEW);
const manyOver = entries.filter(([, e]) => e.slugs.size >= 3 && e.mins > MANY);
t.deep(fewOver.map(([d, e]) => `${d}=${e.mins}`), [],
  `a date shared by 1–2 roadmaps stays within ~4h (${FEW} min)`);
t.deep(manyOver.map(([d, e]) => `${d}=${e.mins}`), [],
  `a date shared by 3+ roadmaps stays within 6h (${MANY} min)`);
const peak = Math.max(...entries.map(([, e]) => e.mins));
t.ok(peak <= HARD, `no date ever passes the 7h hard ceiling (busiest ${peak} min)`);
t.ok(entries.filter(([, e]) => e.mins > MANY).length <= 3, "only rarely may any date pass 6h");

t.group("rule 2 — every roadmap shares one Friday-anchored week frame");
// "the same week" across roadmaps must mean the same 7 dates, or rule 3 is meaningless
// ⚠️ SHIFT-SENSITIVE: bump by +N with every uniform date shift (like content.test's ANCHORS).
const FRAME = "2026-09-04";
for (const rm of roadmaps)
  t.ok(rm.weeks.every((w, i) => w.start === util.addDays(FRAME, 7 * i)),
    `${rm.slug}: week i starts on ${FRAME} + 7·i`);

t.group("rule 2 — how many days each roadmap gets per week");
const weekDays = rm => {                       // week index -> its days, in order
  const out = rm.weeks.map(() => []);
  for (const d of rm.days) out[rm.weeksById.get(d.week).index].push(d);
  return out;
};
const counts = rm => weekDays(rm).map(ds => ds.length);
const ig = registry.getRoadmap("interp-go"), br = registry.getRoadmap("bedrock"),
      ry = registry.getRoadmap("raylib"), ru = registry.getRoadmap("rust-fastapi");
t.ok(counts(ig).every(n => n === 4), `interp-go: 4 days in every week (${counts(ig).join("")})`);
t.ok(counts(br).every(n => n >= 2 && n <= 4), `bedrock: 2–4 side-days in every week (${counts(br).join("")})`);
t.ok(counts(ry).every(n => n >= 1 && n <= 3), `raylib: 1–3 side-days in every week (${counts(ry).join("")})`);
const rc = counts(ru);
t.deep(rc.slice(0, 7), [5, 5, 5, 5, 4, 4, 4], "rust-fastapi: the two-book core keeps 5,5,5,5 then 4,4,4");
t.ok(rc.slice(7, -1).every(n => n === 2 || n === 3) && rc.at(-1) >= 1 && rc.at(-1) <= 3,
  `rust-fastapi: the RWP tail runs 2 or 3 days a week (${rc.slice(7).join("")})`);

t.group("rule 3 — rust takes a 3rd RWP day only in a light week");
const LIGHT = 600;   // combined required minutes of the OTHER roadmaps that week
const otherLoad = i => [ig, br, ry].reduce((s, rm) => s + (weekDays(rm)[i] || []).reduce((a, d) => a + reqMins(d), 0), 0);
const threeDayWeeks = rc.map((n, i) => ({ n, i })).filter(x => x.i >= 7 && x.n === 3);
t.ok(threeDayWeeks.length > 0, `the tail does use 3-day weeks (${threeDayWeeks.length})`);
t.deep(threeDayWeeks.filter(x => otherLoad(x.i) >= LIGHT).map(x => `w${x.i + 1}:${otherLoad(x.i)}`), [],
  `every 3-day RWP week falls where the other roadmaps total < ${LIGHT} min`);
t.deep(rc.map((n, i) => ({ n, i })).filter(x => x.i >= 7 && x.i < rc.length - 1 && x.n === 2 && otherLoad(x.i) < LIGHT)
  .map(x => `w${x.i + 1}`), [], "and no light week is left at 2 (the tail never idles when there's room)");

t.group("rule 2 — weekdays vary week to week (no fixed active days)");
const pattern = (rm, ds, i) => ds.map(d => gapDays(rm.weeks[i].start, d.date)).join(",");
for (const rm of roadmaps) {
  const pats = weekDays(rm).map((ds, i) => pattern(rm, ds, i));
  const repeats = pats.filter((p, i) => i > 0 && p === pats[i - 1]).length;
  t.eq(repeats, 0, `${rm.slug}: no week reuses the previous week's exact weekdays`);
  t.ok(new Set(pats).size >= Math.ceil(pats.length * 0.75),
    `${rm.slug}: most weeks have their own weekday pattern (${new Set(pats).size} distinct of ${pats.length})`);
  const used = new Set(rm.days.map(d => util.parseDate(d.date).getDay()));
  t.eq(used.size, 7, `${rm.slug}: over its arc it lands on all seven weekdays (none pinned, none excluded)`);
}

t.group("continuity — no roadmap goes quiet for more than a week");
for (const rm of roadmaps) {
  let worst = 0;
  for (let i = 1; i < rm.days.length; i++) worst = Math.max(worst, gapDays(rm.days[i - 1].date, rm.days[i].date));
  t.ok(worst <= 7, `${rm.slug}: consecutive sessions are at most 7 days apart (worst ${worst})`);
}

t.done();
