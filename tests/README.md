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
| **reconcile** | `reconcile.test.mjs` | `referentOf` for every stored id shape, orphan hiding (**in memory only — never a DB delete**), dangling moves, alias migration, note preservation, idempotency |
| **content**   | `content.test.mjs`   | integrity of the **real** roadmaps: `validateAll`, chronological/unique ids, each day inside its week window, dow correctness, milestone refs resolve **and sit in/after their work's week**, prose that stays true to the data (real `dNN` references, no "tomorrow", complete week titles, https links, balanced tags), and client `SEP` == server `KEY_SEP` |
| **schedule**  | `schedule.test.mjs`  | the owner's calendar rules across all roadmaps: per-date load ceilings by concurrency, days-per-week counts, rust's light-week 3rd day, week-to-week weekday variety, continuity |
| **stats-time**| `stats-time.test.mjs`| time-dependent verdicts under a frozen clock: milestone at-risk/missed (incl. a re-dated card), on-track vs the plan's own curve, the shared daily budget |
| **sync**      | `sync.test.mjs`      | the save queue: per-slug failure keeps others, unreachable login, a load never reverts unsaved work, one in-flight load, 401 → session-expired signal, retry with backoff, rejected cells, `dropQueued`, keepalive, beacon hand-off, `online` flush |
| **backend**   | `backend.test.mjs`   | api.php pure helpers via `php`: slug allowlist, `normalize_full`, throttle (escalation, 30-min cap, strike decay, atomic reservation, pruning), `clip_bytes`, stash dedupe, the empty-overwrite guard |
| **backend-live** | `backend-live.test.mjs` | api.php over **real HTTP** from a **fresh deploy** (temp dir, `php -S` with workers): junk cookies leave no session files, same-origin JSON only, save/load round-trip with rejected cells and UTF-8 safety, clear / clearAll / guard / stash dedupe, logout, **parallel logins counted exactly** |
| **app**       | `app.test.mjs`       | the real app shell booted in jsdom on the real `index.php`: default & unknown routes, global views release the roadmap, navigation closes stale dialogs, midnight rollover, refresh after being away, session expiry (lock + kept changes), reset / reset-all / sync / lock never claim an unconfirmed success |
| **atlas**     | `atlas.test.mjs`     | the Atlas layout on the real roadmaps: task placement (moves, re-dated cards), brick scale and plain-text labels, plates/columns/bricks/months, ticking from a brick, the day lens (tick, move, re-target, outside press, Escape, navigation, open the full card), Cards ⇄ Atlas switch (persisted, open cards kept, `revealDay`, `currentDayOf`, Now), spotlight, drag & drop, the day menu |
| **horizon**   | `horizon.test.mjs`   | the Horizon view: `buildHorizon` counts every task once on its current date with its minutes and the daily ceiling, follows moves / re-dated cards / ticks; free-day rows and look-ahead totals; the view opens on today, earlier days on demand, lanes (never all hidden, corrupt storage safe), density, ticking in place, the lens and “Open in …”, the skyline slider, plan edges, sidebar link and reserved route |
| **render**    | `render.test.mjs`    | a jsdom DOM smoke test: both roadmaps + the Today "Your effort" panel render, the chart has 14 bars, day-step / bar-click / tick don't throw, a global view releases the roadmap, the finder rail's grid span |

The fixture used by `stats`/`activity` is `public/roadmaps/_fixture.js` — a tiny roadmap
with fully known numbers (9 primary tasks / 375m, 2 secondary / 65m, 2 bonus / 100m).

## The render suite needs jsdom

The pure-logic suites (everything except `render`) need **nothing** but Node.
`render` needs jsdom; without it, that one suite **skips cleanly**. To enable it:

```bash
npm --prefix tests install     # installs jsdom into tests/node_modules (gitignored)
```
