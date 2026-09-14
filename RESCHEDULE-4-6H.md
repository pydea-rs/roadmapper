# Re-schedule to a 4–6 h combined day — ⛔ SUPERSEDED (2026-09-13)

> **⛔ Do not follow this document.** Both options below rest on a misreading of the owner's rule:
> the 4–6 h figure is a daily **MAXIMUM** on the sum of all roadmaps' required tasks on a date
> (~4 h when 1–2 roadmaps share it, up to 6 h when 3+ do, 7 h rarely) — **not** a target to fill.
> The owner also wants **no fixed active days / rest days**: a roadmap's rule is how many days it
> gets per week, and the weekdays should *vary* week to week.
>
> The Option-B stacking described below was **reverted the same day**. The calendar was re-planned
> by `scratchpad/replan.mjs` (varied weekdays, per-date ceilings); the rules are asserted in
> `tests/schedule.test.mjs`, and each roadmap file carries a "RE-PLAN (2026-09-13)" header note.
> This file is kept only as a record of what not to do.
>
> **Later the same day the 4–6 h ceiling itself was replaced** by a **3 h** daily maximum: every roadmap
> restarted on 2026-09-13 and was re-flowed by `scratchpad/cap3/` (tasks passed along into the next card,
> marked `carried`). `tests/schedule.test.mjs` now asserts those rules; see each roadmap's
> "3-HOUR CAP RE-PLAN" header note.

---

> **(historical) STATUS: executed, then reverted.** The owner chose **Option B**. All four roadmaps were re-dated onto a shared
> working-day grid; `scratchpad/consolidate.mjs` is the layout engine that did it and can be re-run.
>
> **Result: 480 h now falls on 123 working days in a 223-day span — 3.90 h per working day, 100 free
> rest days (45% of the calendar), 0 days over 6 h, 0 over 7 h.** Weeks 1–18 sit at **4.5–5.3 h/day**,
> which is the target band. Weeks 19–32 taper as raylib (w19) then interp-go (w22) finish and only the
> bedrock side-track runs on — the thin tail Option B explicitly accepts (see §3).
>
> Finishes: rust-fastapi 2027-03-24 · interp-go 2027-02-04 · bedrock 2027-04-14 · raylib 2027-01-12.
> Day/task ids, content, order, every `week:` assignment and every day/week count are unchanged, so no
> milestone or interlude needed re-anchoring.
>
> Also fixed in the same pass: `stats.js` `OVERLAP_TAX` 0.85 → 0.92 (it was double-taxing the overlap
> that `dayConcurrency()` now models explicitly) and bedrock's declared cadence `[2,3]` → `[2,4]` (its
> real rate is 3.03/week, and the band's midpoint drives the projection).
>
> **Option A was NOT taken** — it remains the only route to 4–6 h across the *whole* journey, at the
> cost of interp-go +2.3 months and raylib +3.2 months. The analysis below is kept for that reason.

The original spec follows, unchanged.

---

**Written 2026-09-13, at the end of the re-estimate session.**

Goal: the **sum of all roadmaps' tasks on a calendar date** should land in **4–6 h**, and on rare
occasions up to **7 h**. The budget is the owner's whole study day, shared by every roadmap that runs
that day — never 4–6 h *per roadmap*.

---

## 1. What is already DONE (do not redo any of it)

All of this is complete, verified, **1565 tests green**, PHP lint clean, and **uncommitted** (the owner
commits — never commit or push).

1. **Realistic re-estimate of every `est`** — priced by KIND, not a flat factor: specs/papers ×1.85,
   book chapters with code ×1.75, docs/articles ×1.55, inline concept notes ×1.45, code/build ×1.35,
   challenges ×1.50. Required work **331.5 h → 480 h**.
2. **Two video courses re-based on real runtime** (the base was more wrong than the multiplier).
   Owner watches at **1.5× with frequent pauses** ⇒ `runtime / 1.5 × 1.30`.
   - Calhoun Go course: videos 27–285 of a ~40 h / ~285-video course ⇒ ~7.3 min per video (~30 h,
     was 15.3 h).
   - Udemy raylib: 58 lectures / 11 h ⇒ ~9.9 min per lecture (~9.5 h, was 3.9 h).
   - A video budget is spent **only on `watch` leaves**, never on the build-along `code` leaves.
3. **Nature-of-Code p5.js exercise tasks** added to 7 raylib reading days (d02, d04, d09, d11, d16,
   d18, d21).
4. **Six oversized interp-go video days rebalanced** into the light "(2/2)" partner day each already
   had (d21→d22, d44→d45, d59→d60, d66→d67, d71→d72, and d33's Calhoun review → d32). Peak interp-go
   day 225 → 160 min. No new days, no renumbering.
5. **rust-fastapi's RWP tail re-paced** from 2 days/week over 33 weeks to **3/week (Fri/Sun/Tue)**:
   w8–w40 → **w8–w29**, finish 2027-06-09 → **2027-03-23**. 12 milestones re-anchored.
6. **`stats.js` projection budget fixed** — `PER_DAY_MINS = 180` (per roadmap!) became
   `DAILY_BUDGET_MINS = 300` divided by `dayConcurrency(rm)`, the average number of roadmaps competing
   for one study day, derived from the **real dates**. This self-corrects as the calendar consolidates:
   stack the calendar and concurrency rises on its own. **Nothing below needs to change it again.**

### Current state (measured, 2026-09-13)

| roadmap | days | weeks | days/wk | required | first | last | cadence declared |
|---|---|---|---|---|---|---|---|
| rust-fastapi | 98 | 29 | 3.38 | 136.1 h | 2026-09-04 | 2027-03-23 | `[3,5]` |
| interp-go | 88 | 22 | 4.00 | 141.6 h | 2026-09-05 | 2027-02-04 | `[4]` |
| bedrock | 97 | 32 | 3.03 | 132.3 h | 2026-09-06 | 2027-04-15 | `[2,3]` |
| raylib | 54 | 19 | 2.84 | 69.8 h | 2026-09-04 | 2027-01-08 | `[2,3]` |

**Combined: 480 h over 192 active dates in a 224-day span. 2.50 h per active day. 0 days over 6 h.**

---

## 2. Why it is still 2.5 h/day, and the one lever left

480 h is fixed. The span is bounded below by bedrock (97 days at its declared max 3/week = 32 weeks).
480 h over a 224-day span is **2.14 h per calendar day however it is arranged**. Re-estimating cannot
change that; only two things can:

- **Fewer working days** (stack roadmaps onto shared dates, leaving real rest days), and/or
- **A shorter span** (raise cadence), which the declared bands limit.

**The hard constraint: a roadmap can contribute at most ONE day-card per date.** So the minimum number
of working days in a week is `max(days-per-week over live roadmaps)`. Today interp-go's 4/week forces
at least 4 working days while it runs.

---

## 3. THE DECISION THE OWNER MUST MAKE FIRST

Ask before executing. The two options differ in *where* the 4–6 h holds.

### Option A — everything finishes together; flat 5 h on 3 days/week  ← recommended

Stretch every roadmap to bedrock's 32 weeks, then stack all four onto **3 shared working days/week**.

- 480 h ÷ 32 weeks = **900 min/week** ÷ 3 working days = **300 min = 5.0 h per working day.**
- Roadmap-days/week: rust 3.06 + interp-go 2.75 + bedrock 3.03 + raylib 1.69 = 10.5, over 3 dates =
  3.5 roadmaps per working day (max possible is 4) — feasible.
- **4 full rest days every week.** Every roadmap ends ~2027-04-15.
- Cadence changes required: interp-go `[4]` → `[3]`, raylib `[2,3]` → `[2]`, rust `[3,5]` → `[3,4]`.
- **Cost — this is the part to flag to the owner:** interp-go **+2.3 months** (2027-02-04 → ~04-15) and
  raylib **+3.2 months** (2027-01-08 → ~04-15). The owner's stated expansion cap was "1 month, up to
  ~2 at most", so raylib in particular exceeds it. Confirm before proceeding.

### Option B — keep today's finish dates; 4.7 h/day now, thin tail later

Keep every roadmap's length; only stack them onto **4 shared working days/week**.

- Weeks 1–19 (all four live): 1136 min/week ÷ 4 = **284 min = 4.7 h** ✓, 3 rest days.
- Weeks 20–22 (raylib done): 916 ÷ 4 = 229 min = 3.8 h (interp-go's 4/week forbids going to 3 dates).
- Weeks 23–29 (interp-go done): 530 ÷ 3 = 177 min = 2.9 h.
- Weeks 30–32 (bedrock alone): 248 ÷ 3 = 83 min = **1.4 h**.
- No roadmap moves; no cadence band changes. But the 4–6 h rule only holds for the first ~19 weeks.

**Recommend A** — it is the only one that satisfies "4–6 h a day" as a consistent rule for the whole
journey, and it gives 4 real rest days a week. But A's cost is a genuinely later interp-go/raylib, so
it is the owner's call, not ours.

---

## 4. Execution plan (written for Option A; B is the same machinery with different targets)

### 4.1 Shape of the change

For each roadmap: **re-date every day and every week start onto a shared weekly grid.** Nothing else.

- **Day ids, task ids, sub ids, all content, and day ORDER stay exactly as they are.** Progress is keyed
  by structural id, never by date, so stored progress can never orphan.
- **Keep each day's `week:` assignment** wherever a roadmap's week count does not change. If a roadmap's
  week count *does* change (interp-go 22 → ~30, raylib 19 → ~27), it needs the same re-week treatment
  rust just had: re-assign `week:` per day, rewrite the `weeks:` array, and **re-anchor every milestone
  to the new week containing its LAST required task** (see §4.4).

### 4.2 Choose the grid

Pick 3 weekdays (Option A) or 4 (Option B) as the owner's working days, then assign each roadmap to a
subset matching its days/week. Balance so no date exceeds ~6 h (7 h only rarely).

A worked Option-A assignment (verify against real per-day minutes before committing to it):

| working day | roadmaps that run |
|---|---|
| day 1 | rust · interp-go · bedrock |
| day 2 | rust · bedrock · raylib |
| day 3 | rust · interp-go · bedrock · raylib |

Counts per week: rust 3, interp-go 2, bedrock 3, raylib 2 — then vary week to week to hit each
roadmap's exact fractional rate (rust 3.06, interp-go 2.75, bedrock 3.03, raylib 1.69).

**Do not hand-place 337 days.** Write a layout script (pattern: `scratchpad/repace.mjs` from this
session) that walks each roadmap's days in order and assigns `date` from
`weekStart + 7*weekIndex + offset`, then verify with the sweep below.

### 4.3 Sweep, don't guess

This session's `sweep.mjs` pattern paid off: enumerate candidate weekday patterns, score each on
(a) count of dates inside the 4–6 h band, (b) count over 7 h (must be ~0), (c) standard deviation, and
pick the winner. Do the same here rather than reasoning about one layout in your head.

### 4.4 Re-weeking rules (only for roadmaps whose week count changes)

Learned the hard way this session — **all three of these bit me**:

1. **Week titles cannot be concatenated.** Merging two 2-day weeks into one 3-day week moves the
   boundary, so a merged title will cite chapters the week no longer holds. I shipped 9 wrong titles and
   caught them only on review. **Re-derive every title from the days the week actually contains**, then
   print week→day-titles and read it.
2. **Milestones re-anchor to the new week holding their LAST required task.** Two old milestones can
   collapse into one new week — give them distinct ids (`w12.m1`, `w12.m2`). Milestone ids are *not*
   persisted (verified: no references in `store.js`, `reconcile.js`, `api.php`), so renaming is safe.
3. **Every week must keep ≥1 day and week starts must strictly increase.** Covered by the verifier.

### 4.5 Files to touch

- `public/roadmaps/{rust-fastapi,interp-go,bedrock,raylib}.js` — `date:`, week `start:`, and for
  bedrock its **9 inline `dow:` labels** (d89–d97) which must be recomputed from the new dates. If the
  shift is not a multiple of 7, **every** `dow:` changes.
- **Prose inside those files** — each carries dated header notes with live schedule claims. Grep for:
  `sessions/week`, `days/week`, `side-days/week`, `Fri/Sun/Tue`, `Mon/Wed/Thu/Sat`, `min task`,
  and any `2026-`/`2027-` date in a comment. Distinguish **frozen authorship stamps**
  (`2026-07-17/18/20/21/27`, `2026-09-05`, `2026-09-13` — leave alone) from **live schedule references**
  (must move). ⚠️ bedrock has **two `/* */` block-comment "Dates X → Y" ranges** (~L1043 Ext I, ~L1912
  Ext II) that a `//`-only grep MISSES — recompute from each block's real min/max day date.
- Add a dated header note to each file recording this re-schedule, matching the existing style.

### 4.6 Tests to update

| test | what to change |
|---|---|
| `tests/content.test.mjs` | the `ANCHORS` map — **all 8 dates** (first+last per roadmap). Deliberately shift-sensitive; it is the tripwire. Also the loose bedrock boundaries (`2026-11-07`, `2027-02-06`, `2027-03-09`). |
| `tests/raylib.test.mjs` | start date; the thread thresholds (course ≤, project ≥, shaders ≥, noc ≤/≥); `STEADY`; the "Sep 4–Sep 15" / "Fri Sep 4" strings. **And see the warning below.** |
| `tests/render.test.mjs`, `tests/insights.test.mjs` | frozen clock `super(2026, 8, 6, …)` + `now()` + `TODAY`. Only if the span's start moves. ⚠️ set the constructor **and** `static now()` — a past pass left `now()` 11 days stale. |
| `tests/timeflow.test.mjs` | nothing — it self-derives from the real span. Run it; it is the long-run health check. |

⚠️ **`raylib.test.mjs`'s light-day invariant is the one test this work deliberately invalidates.**
It currently asserts raylib lands only on LIGHT main-roadmap days (`maxMainOnRaylibDay <= 160`,
`maxCombined <= 240`). Consolidation stacks roadmaps on purpose, so those caps will fail *correctly*.
Do not just raise the numbers to whatever passes — **decide what the invariant should now be** (likely:
"no combined date exceeds 7 h", asserted across all four roadmaps rather than raylib-vs-mains) and
rewrite it to say that, with a comment explaining why the old framing was retired.

### 4.7 Verification (run all of it, every time)

```bash
./tests/run.sh                 # must be ALL GREEN (1565 at time of writing)
node scratchpad-verify.mjs     # see below — 0 structural faults
```

Keep a verifier that checks, beyond the suite: `validateAll()` and `registryErrors()` both `[]`; no
duplicate or out-of-order dates per roadmap; every day inside its week's `[start, start+6]` window;
`dow` matches the real weekday; no empty weeks; week starts strictly increasing; unique milestone ids;
every milestone's required tasks land **on or before** its week's end; `parent.est === sum(subs)`.
(The exact script used this session is in the session scratchpad as `verify.mjs` — recreate it, it is
~30 lines and it caught things the suite does not.)

Then re-measure the combined profile and confirm the goal: a histogram concentrated in **4–6 h**, with
**zero** dates over 7 h.

### 4.8 Finally

- Report per-roadmap: days, weeks, days/week, required hours, first/last date, and the shift vs the
  table in §1.
- Update memory: `realistic-estimates-2026-09-13.md` (its anchors become stale) and
  `date-shift-2026-07-21.md` (**its anchor list drives every future uniform shift** — all four
  first/last dates and each roadmap's week count must be corrected there, or the next shift pass will
  work from wrong numbers).
- **Leave everything uncommitted.**

---

## 5. Traps worth knowing (all hit during this session)

- **The i-th `est:` in a roadmap file is provably the i-th leaf** in registry traversal order (task,
  then its subs, then its fallback). Verify old values positionally *before* rewriting — that made a
  1500-value re-price a single safe pass.
- **Task ids repeat across roadmaps** (every roadmap has a `d01.t1`). Never `find()` by id across a
  combined list — capture the index. This produced a real bug mid-session.
- `round5()` with a `Math.max(5, …)` floor would silently turn `est: 0` into `5`. No `est: 0` exists
  today, but re-check if you add one.
- A singleton `group:` renders flat (`render.js` boxes only `grp.length > 1`), so splitting a grouped
  pair needs no cleanup.
- Moving a task between days means re-reading the destination day's **title, theme and note** — d32's
  title still described the old content until review caught it.
- **No watch leaf may be priced under a runtime stated in its own text.** Scan for `(\d+)\s*min` and
  compare against `est`; skip "min/month" (an SLO error budget reads as a runtime).
- `DESIGN.md` §9.2/§15 still cite the original 2026-07-16/18 anchors — stale since long before this
  work. Out of scope unless the owner asks.
