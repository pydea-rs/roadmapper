# Tests

Fast, dependency-light tests for the app's calculations and state operations.
Every suite recomputes results from the same modules the browser runs, so a green
run means the numbers the UI shows are the numbers the engine actually produces.

## Run

```bash
./tests/run.sh            # all suites, with a per-file + aggregate summary
./tests/run.sh stats      # only suites whose filename matches "stats"
```

Exit status is non-zero if any assertion fails. Skips (see render) do not fail the run.

## What's covered

| Suite | File | Verifies |
|-------|------|----------|
| **util**      | `util.test.mjs`      | date math (`addDays`, `daysBetween`, month/year/leap boundaries), `fmtMins`, `pct`/`pct1` rounding & zero-denominator safety, `clamp` |
| **store**     | `store.test.mjs`     | task tick ↔ `done_at` stamping (and clearing on untick), moves, soft ticks, flags, notes, absence-as-default, the write-through sink deltas, and the `toFlatMap` ↔ `hydrateFromServer` round-trip over the `\x01` key separator |
| **stats**     | `stats.test.mjs`     | dual progress (actual-by-current vs original-by-origin), **bonus fully separated** (count + time, excluded from `invested`/`remaining`/ETA), the secondary meter, objective/day/week rollups under a move, milestones, projection `done`, streak, soft stats — all against the hand-computed fixture |
| **activity**  | `activity.test.mjs`  | the cross-roadmap effort log: bucketing by local `done_at` day, required/bonus split, `trailingAvg`, `rangeTotals`, `weekDelta`, the 14-day chart `series`, `tasksDoneOn`, and that stampless completions are never placed |
| **sidetrack** | `sidetrack.test.mjs` | the **Side track split**: a roadmap's `kind` (`main`/`side`), the `getMainRoadmaps`/`getSideRoadmaps`/`getRoadmaps(kind)` accessors, and that `activityByDate(kind)` / `tasksDoneOn(date,kind)` keep side effort out of the main numbers while `activityByDate()` still combines them |
| **reconcile** | `reconcile.test.mjs` | `referentOf` for every stored id shape, orphan pruning, alias migration, note preservation, idempotency |
| **content**   | `content.test.mjs`   | integrity of the **real** roadmaps: `validateAll`, chronological/unique ids, each day inside its week window, dow correctness, milestone refs resolve, and client `SEP` == server `KEY_SEP` |
| **render**    | `render.test.mjs`    | a jsdom DOM smoke test: both roadmaps + the Today "Your effort" panel render, the chart has 14 bars, day-step / bar-click / tick don't throw |

The fixture used by `stats`/`activity` is `public/roadmaps/_fixture.js` — a tiny roadmap
with fully known numbers (9 primary tasks / 375m, 2 secondary / 65m, 2 bonus / 100m).

## The render suite needs jsdom

The pure-logic suites (everything except `render`) need **nothing** but Node.
`render` needs jsdom; without it, that one suite **skips cleanly**. To enable it:

```bash
npm --prefix tests install     # installs jsdom into tests/node_modules (gitignored)
```
