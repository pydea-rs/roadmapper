# Roadmaps — Design Document (v2)

> A single, self-hosted web app for **designing personal roadmaps and finishing the work in them**.
> One owner. Many roadmaps. Static, hand-authored content; dynamic, saved progress.

> **v2 adds:** the two concrete roadmaps, per-week off-day scheduling, moveable tasks with dual
> (*actual* vs *original*) progress, a day-content taxonomy (tasks / optional / soft items / hints /
> pre-reads / grouped tasks), primary-vs-secondary **objectives** with weighted rollups, and a live
> time **projection**. It supersedes v1; where v1 stands unchanged (auth, no-seed IDs) it is kept.

---

## 1. What this project is

**Roadmaps** is a personal productivity web app. Its job is to hold a growing collection of
hand-crafted **roadmaps** — each a concrete, day-by-day plan for finishing *one or more related
undertakings* (reading a book, learning a language, building a project, watching a video course) — and
to help the owner (me) actually keep up: tick tasks off, watch progress rise, hit weekly milestones,
move work between days when life happens, and see honest statistics about pace and completion.

It generalises the reference app
`/home/paya/p4ya.gcc/odoo/assessment/tutorials/roadmap/index.html` (one beautiful, data-driven study
plan) into a **container** that holds *many* such plans, each on its own sidebar section, inside **one**
cohesive web app (no iframes, no per-roadmap pages).

### The two halves of the project

1. **The container (the shell).** Generic, reusable machinery, written once: the lock screen, the left
   sidebar of roadmaps, routing, the rendering engine that turns a roadmap *definition* into an
   interactive page, the stats / milestone / projection engine, the task-move engine, the settings
   drawer, the sync/persistence layer, import/export, modals, toasts, theming. It never changes when a
   roadmap is added.

2. **The roadmaps (the content).** Each roadmap is authored **by hand, in code**, as a self-contained
   data module describing its objectives, schedule, days, tasks, weeks, milestones, soft items, and
   bespoke helper features. Adding a roadmap = write one content module + register it. No CMS, no admin
   UI. A roadmap is a *considered plan* — tuned to my personality, the difficulty of the work, the time
   I have, and what I want out of it. That judgement lives in code and research, not in a database form.

### Static vs. dynamic

| Concern | Where it lives | Kind |
|---|---|---|
| Roadmap structure: objectives, schedule, days, tasks, labels, links, estimates, weeks, milestones, soft items, hints | Hand-authored content modules (code) | **Static** |
| Which tasks are done + when; which tasks were **moved** and to where | **SQLite only** (single source of truth) | **Dynamic** |
| Notes, missed/re-do flags, stars, custom links, soft-item ticks | **SQLite only** | **Dynamic** |
| Computed stats (actual/original %, streaks, pace, milestone status, projection) | Recomputed at runtime from structure + journey | **Derived** (never stored) |
| UI settings (theme, accent, hue, density, motion, card-reveal, milestones view) + view state (open cards, last roadmap, sidebar, FAB) | **localStorage only** | **Dynamic** |
| Auth session, login throttle | SQLite + PHP session files | **Dynamic** |

**Key principle:** the database stores *only the journey* (mutable state) — ticks, moves, notes,
flags. It never stores roadmap structure. Structure is code. This keeps the DB tiny, keeps roadmaps
versionable in git, and — per §7 — removes any need to "seed" the database when a roadmap is added.

---

## 2. Goals & non-goals

### Goals
- One cohesive app holding many roadmaps, each a rich day-by-day plan.
- **Beautiful, exclusive, modern UI**: smooth animations, polished micro-interactions, fully responsive
  (desktop → mobile), light/dark aware, tasteful motion (with a reduce-motion setting).
- Tick tasks; progress and statistics update instantly and persist.
- **Daily / weekly / monthly / total** progress, each shown as **two figures — *actual* and *original*
  (§10)** — plus **weekly milestones** (minimum bars to clear by week's end).
- **Moveable tasks** (§10): drag/move an unfinished task to another day; stats on both days update per
  the actual/original model.
- **Primary vs secondary objectives** (§12): a roadmap can carry secondary goals that count on a
  separate meter and never gate the primary 100%.
- **Soft day-content** (§11): hints, suggestions, tryout-project ideas — some non-tickable, some
  tickable with a *distinct* style that never touches real progress (tracked as separate "extra stats").
- **Task grouping / linking** (§11): related tasks (e.g. *watch videos* ↔ *review book §*) shown
  visually connected though counted separately.
- **Live projection** (§13): a running "at your pace, you'll finish ≈ <date>" estimate, aware of
  active-days-per-week and cross-roadmap overlap.
- Per-roadmap **Import/Export** (hero, top-right) and whole-journey **Import/Export** (settings).
- Custom, well-styled **modals** for every confirmation/input — never `window.alert/confirm/prompt`.
- A **secret gate** on startup (single owner); correct secret → access for an expiry window; wrong
  secret → escalating lockout.
- Per-roadmap bespoke helper features, improvised per roadmap.
- Adding a roadmap is *pure content*: drop a module, register it — no migrations, no DB seeding, no ID
  collisions.

### Non-goals
- No multi-user / accounts / roles. One owner, one secret.
- No dynamic roadmap-authoring UI. Roadmaps are code.
- No framework, no build step, no npm. Plain PHP + SQLite + vanilla HTML/CSS/JS.
- Not bank-grade auth. A reasonable personal lock, not fort-knox (per brief).
- No cloud/external services. Runs locally / on a small PHP host.

---

## 3. Technology & runtime

- **Server:** PHP 8+. **Docroot split** for host-agnostic safety: only `public/` is web-exposed;
  all secrets, the DB and the backend live in `roadmapper/`, *outside* the served root, so no URL can
  reach them by construction. There is **no front-controller/router script** — the folder boundary is
  the protection. In dev, `php -S localhost:8000 -t public` serves `public/` (the built-in server
  auto-serves `index.php` and can't see the sibling `roadmapper/`); in production (cPanel/Apache)
  `public/`'s contents go into `public_html/` with `roadmapper/` as its sibling. Two `.htaccess` files
  add defense in depth: `public/.htaccess` (no directory listing + deny `.env`/`*.sqlite*`/dot-files)
  and `roadmapper/.htaccess` (deny-all, in case that dir is ever misplaced inside the docroot).
- **Database:** **SQLite** via PDO (single file, WAL mode, busy-timeout). Zero-config, single-owner,
  file-portable. More than enough.
- **Frontend:** one HTML shell + modular vanilla JS + modern CSS. Journey state is an in-memory JS object
  hydrated from — and written straight back to — SQLite via the sync endpoint (the DB is the single source
  of truth); localStorage holds UI/view preferences only. No build tooling.
- **Auth:** PHP sessions + bcrypt hash in `.env`, expiry in days, plus a small server-side escalating
  throttle table.

This mirrors the reference stack (proven for "single owner, static content, synced progress") and
improves it where it matters: structured progress store, stable IDs, escalating server-side throttle,
custom modals, multi-roadmap shell, moves, objectives, projection.

---

## 4. Terminology (precise, used in code and UI)

- **Roadmap** *(a.k.a. Section)*: one hand-authored plan. One sidebar entry. Identified by a stable
  **`slug`**. Unit of authoring, routing, and per-section export/import.
- **Objective**: a distinct goal *within* a roadmap (e.g. `rust`, `fastapi`). Tagged **primary** or
  **secondary** (§12). Every task belongs to exactly one objective. Progress is computed per objective
  and rolled up with primary as the headline number and secondary on its own meter.
- **Undertaking / Job**: the real-world thing an objective gets you to finish (read *X*, watch course
  *Y*, build *Z*).
- **Phase** *(optional)*: a named span of a roadmap (e.g. "jlox", "clox", "Go interpreter tail"). Purely
  presentational grouping; also a milestone anchor.
- **Week / Month**: calendar groupings derived from each day's assigned date. Weeks are first-class
  (weekly milestones hang off them). Months appear when a roadmap spans > 1 month.
- **Day**: one **dated** entry in a roadmap's timeline. Has a title, theme, an ordered list of **tasks**,
  and optional **soft items** / hints / notes. Rendered as an expandable card. A day belongs to one
  roadmap and lands on a real calendar date chosen by the schedule (§9).
- **Active day / Off day**: on a given calendar date a roadmap is either **active** (has a day card) or
  **off** (no work). Off-day count per week is fixed by priority; *which* days are off varies weekly and
  is chosen by the author (§9).
- **Task**: one tickable unit inside a day. Has an **objective**, **category**, time **estimate**, rich
  HTML **label**, a stable **id**, an **origin day** (static), a **current day** (origin unless moved),
  and a **weight class**: `required` | `optional` (bonus, past 100%) | it may also carry a **fallback**
  (shorter variant, counts once). Ticking it drives progress.
- **Soft item**: non-progress day content — a **hint** (informational, not tickable), a **suggestion /
  tryout** (tickable with a *distinct* style, tracked as "extra stats," never touching journey
  progress), or a **callout** ("new in latest version", "deprecated"). See §11.
- **Pre-read**: a real task placed on a *prior* day that primes an upcoming task (e.g. "read Calhoun
  §§ before tomorrow's videos"). Placed occasionally, not every time.
- **Grouped/linked tasks**: two or more tasks shown visually connected (arrow/bracket) because they
  belong together, though each counts separately.
- **Milestone**: a named target with a completion **rule** (usually weekly): "by end of week N, at
  least these tasks / this % / this category is done." Shows met / at-risk / missed.
- **Move**: relocating an unfinished (or finished) task from its origin day to another day. Produces the
  *actual* vs *original* split (§10).
- **Journey**: the complete set of the owner's dynamic state across all roadmaps.
- **Progress**: derived completion state (per day/week/month/objective/roadmap/overall), computed live —
  never stored — so it is always truthful. Reported as **actual** and **original** figures.
- **Projection**: derived "expected finish date" from remaining effort ÷ realistic pace (§13).

---

## 5. UI / UX design

The bar is high: "exclusive and proper and beautiful styles, UI, animations, smoothness,
responsiveness." Direction:

### 5.1 Shell layout
```
┌──────────────────────────────────────────────────────────────┐
│  [Lock screen overlay — until unlocked]                       │
├───────────┬──────────────────────────────────────────────────┤
│  SIDEBAR  │  MAIN                                     ⚙ (FAB)  │
│ (left,    │  ┌────────────────────────────────────────────┐   │
│ expand-   │  │ Roadmap hero: title · projection · overall  │   │
│ able,     │  │ progress (actual + original) · [exp][imp]   │   │
│ collaps-  │  ├────────────────────────────────────────────┤   │
│ ible)     │  │ Stats strip · Objective meters · Milestones │   │
│           │  ├────────────────────────────────────────────┤   │
│ • Rmap A  │  │ Month → Week group → Day cards (expandable) │   │
│   ▓▓▓░ ●  │  │   Task rows (tick · cat · est · move ⇄)     │   │
│ • Rmap B  │  │   Soft items (hints, tryouts) — distinct    │   │
│   ▓░░░ ●  │  │ Weekly milestone banner                     │   │
│ • …       │  │ Extras / references / notes                 │   │
└───────────┴──┴────────────────────────────────────────────┴───┘
```

### 5.2 Left sidebar (sections)
- Global views on top: **Today** (`#/today`), **Insights** (`#/insights`), **Horizon** (`#/horizon`,
  §5.8) and **Bookmarks** (`#/bookmarks`). Their slugs are reserved — no roadmap may use one.
- Every registered roadmap: icon/emoji, title, a slim **progress mini-bar**, an **on-track dot**
  (ahead/on/behind from the projection).
- **Expandable** entry: reveals quick-jumps (phases/weeks, "Today").
- **Collapsible sidebar**: collapses to an icon rail; on mobile becomes a slide-over. State persisted.
- Active roadmap highlighted. Keyboard navigable.

### 5.3 Roadmap view (main)
- **Hero**: title + subtitle; **overall progress** shown as **two bars/figures — actual and original**
  (§10); **live projection** ("≈ finish 2026-xx-xx at your pace"); per-roadmap **Export/Import** icon
  buttons (top-right).
- **Stats strip**: KPI tiles — actual %, original %, this-week (both), streak, time invested
  (**required-only**, with **bonus time** shown beside it as `+Xh`), remaining, projection, on-track
  delta. The overall actual/original figures also surface completed bonus **count** inline as `+N`
  (e.g. `4/5 tasks [+1]`). Any charts follow the **dataviz** skill.
- **Objective meters**: one compact meter per objective; **primary** objectives feed the headline,
  **secondary** objectives shown on a clearly separate, muted meter (§12).
- **Milestones**: two selectable presentations (default set in Settings, plus an inline toggle on the
  section head). **Slideshow** (default) — larger cards, 2–3 visible, opening on the first not-yet-met
  milestone; step with prev/next, dots, or drag, and it loops (wrap-around) so you can reach the start.
  **Cards** — the classic compact horizontal rail. Each milestone shows its week, target and met/at-risk/
  missed status; slideshow cards add a progress bar.
- **Journey bar** (sticky above the journey): its size (days · weeks · tasks), a **Now** button that
  lands on the current day, and the **Cards ⇄ Atlas** layout switch. The choice is a remembered
  setting (also in the drawer), and switching keeps the same stretch of the journey in view: with
  view transitions the days on screen travel from card to column (or back) one after another; without
  them the Atlas assembles, plates rising in sequence. Open cards stay open across switches.
- **Timeline — Cards** (default): months (if long) → week group headers (with the week's dual progress
  + milestone) → **day cards**. Today's card highlighted and auto-opened; past days dim; future closed
  by default. Each card header shows its **actual** and **original** figures, done/total, est-time.
  A task the plan passed on from an earlier day to keep a date within the 3h ceiling (authored
  `carried: "dNN"`, listed before the card's own tasks) shows *↩ carried over from “that day”* — in the
  card, the bonus list, the Atlas lens and the brick's tooltip. A card holding only such work is titled
  "… (cont.)". Unlike a user move, `carried` changes no date and no on-time judgement. While the task
  is moved back onto the very day it was carried from, the chip is hidden (`stats.carriedFrom`).
- **Timeline — Atlas**: the whole roadmap on one board, for seeing every day and task in a few looks.
  One **plate per week** (week number, dates, title, actual bar with on-time underline, milestones);
  inside it the week's days sit **side by side as columns**, each a stack of **bricks**. A brick is one
  task: its **height follows its minutes**, its **fill rises with progress** (pips for sub-tasks), its
  left edge is its category colour; moved-in tasks are dashed, overdue ones hatched. Plates flow like a
  justified gallery — each as wide as its days need, every row filled edge to edge — with a heading per
  month. A brick's round tick completes (or clears) the task; dragging a brick onto another day moves
  it; right-clicking a day opens the day menu; a **Spotlight** legend dims every other kind of work.
  Clicking a brick or a day opens the **day lens** — a floating panel (a bottom sheet on phones) with
  the day's full task list, sub-tasks, ticks and move buttons, plus "Open the full day card". It
  follows repaints, and closes on Escape, an outside press or navigation.
- **Day menu** (right-click a day card, or a day column in the Atlas): *Completion details*,
  *Time on tasks*, *References & links*, *Move day…* / *Reset to original*, and — only for a roadmap
  that publishes a source library (§7.6) — *Reading list — sources*.
- **Task rows**: checkbox (accent), category chip, rich label, estimate, and a **move handle (⇄)**.
  Ticking animates bars and updates both figures optimistically, then syncs.
- **Grouped/linked tasks** rendered with a connector (e.g. *watch videos 34–36* ⇄ *review Calhoun
  pp 61–74*).
- **Soft items** rendered with a *distinct* visual language (see §11): hints as inset callouts;
  tryouts/suggestions as dashed, differently-shaped "extra" checkboxes that clearly read as
  *not counting* toward real progress.
- **Optional/bonus track**: collapsible, "counts past 100%," full-or-fallback = 1. Bonus is tracked on
  its **own meter — both count and time** — surfaced inline as `+N` next to required counts and `+time`
  beside Invested. Undone bonus work is **excluded** from Remaining and the finish projection, so
  optional reading never delays your ETA.
- **Extras**: references, "what's new / deprecated" callouts, project ideas — placed inline or in a
  panel per the roadmap.

### 5.4 Moving a task (interaction)
- Each task row has a **move control** (drag handle + a "Move to…" affordance). Moving opens a small
  **custom picker** (nearby days of the same roadmap, or "back to origin"). Drag-and-drop between day
  cards is the primary gesture; the picker is the accessible fallback.
- On move: the task animates to the target card; both cards' **actual** figures recompute; **original**
  figures stay pinned to origin membership; a toast confirms; a subtle **"moved from Day N"/"moved to
  Day M"** tag appears on the task. **Return-to-origin** is one click.
- Weekly/monthly figures update if the move crosses a week/month boundary (§10).

### 5.5 Interactions, modals, motion
- **All confirmations/inputs are custom modals** — focus-trapped, animated, ESC/overlay dismiss where
  safe. Used for: reset confirms, import overwrite warnings, secret entry, move picker, note/link
  entry. **No `window.*` dialogs.**
- **Toasts** for lightweight feedback.
- **Motion**: card expand, bar fill, drawer slide, toast rise, checkbox pop, move animation — all
  respecting `prefers-reduced-motion` and a settings toggle.
- **Scroll-reveal**: day cards slide in (alternating left / right) as they scroll into the timeline,
  driven by an `IntersectionObserver` on the `#main` scroll area (no scroll handler; cards are
  unobserved once shown). Repaint-safe — a per-session "revealed" set means ticking a task never
  re-animates already-seen cards; only compositor properties (transform/opacity) animate. It has its
  **own** on/off switch, independent of Motion: turning Motion off disables it too, but turning only the
  reveal off leaves every other animation intact.
- **Responsive**: single-column on mobile; sidebar slide-over; hero/tiles reflow; big touch targets; no
  horizontal page scroll ever; the move gesture degrades to the picker on touch.
- **Theme**: light/dark/auto via `prefers-color-scheme` + manual override; a primary accent, optionally
  tinted per roadmap.

### 5.6 Settings (floating button → right drawer)
- A **floating action button** pinned right (draggable vertically if feasible; static fallback ok).
  Opens a **right drawer**:
  - Theme (auto/light/dark), accent, density, reduce-motion, card-reveal-on-scroll, milestones view (slideshow/cards),
    journey layout (cards/atlas).
  - **Whole-journey Export / Import** (all roadmaps), with a custom overwrite-confirm modal.
  - **Reset**: per-roadmap and reset-everything, each behind an explicit confirm modal.
  - **Sync status**: last saved, online/offline, "sync now."
  - **Lock now** (ends the session).
  - App/version info.

### 5.7 Lock screen
- Full-screen centered card: single **secret** input, show/hide toggle, unlock button.
- Wrong secret → inline error + remaining-attempts; lockout → countdown to next try.
- Success → smooth reveal; session remembered for the expiry window. "Lock now" returns here.

### 5.8 Horizon — every day ahead, across all roadmaps (`#/horizon`)
- A **timetable**: one row per date, one **lane (column) per roadmap** in sidebar order. Each cell holds
  that roadmap's day as a **ticket** of the same bricks as the Atlas (tickable in place; the ticket or a
  brick opens the day lens, whose main action opens the day in its roadmap: `#/slug/<dayId>`). Tasks
  appear on the date they currently live on (moves and re-dated cards applied). Slim rows mark free
  days; rules mark each week of the plan's shared frame with its planned total and roadmap mix.
- Each date's **gauge** measures its required minutes (bonus never loads a day) against the owner's
  daily ceiling — 3h of required work on a date, however many roadmaps share it — turning amber near it
  and red past it.
- The list **opens on today**; earlier days (with their unfinished count) are one click away. A
  look-ahead strip sums the next 7 and 30 days (time and tasks still left), the busiest day ahead
  (click to jump) and free days coming up.
- A sticky **skyline** draws the whole plan as one waveform — a column per calendar day, stacked by
  roadmap, as tall as its minutes, past days dimmed, a needle on today — with a window tracking what the
  list shows. Press or drag anywhere on it to travel there (arrow keys step a week, Home returns).
- Lanes can be hidden and rows switched between **Detailed** and **Compact** (each day's tasks as one
  proportional strip); both are per-viewer conveniences kept in localStorage, never journey data.

---

## 6. Data model & persistence

### 6.1 Storage strategy (SQLite as the single source of truth)
The **SQLite database (via `sync.php`) is the single source of truth** for all journey data. There is no
localStorage copy of the journey — this is a personal roadmap tracker, so the write rate is trivially low
and a direct-to-DB model is simpler and safer than a dual store.
1. The client holds an **in-memory** journey object (namespaced per roadmap) purely as a session working
   copy — the render/stats engine reads it synchronously many times per repaint, and JS can't read SQLite
   synchronously. It is **never** written to localStorage.
2. On load, the in-memory copy is **hydrated wholesale from the DB** (`action=load`), then reconciled
   (aliases applied, orphaned rows pruned — §7.4).
3. Every change is written **straight to the DB** (`action=save`), issued immediately and coalesced only
   within a single user action (so `setTask`'s tick + timestamp go in one request). Full replaces
   (import/reset) take a safety **stash** first; the **empty-overwrite guard** is kept.
4. If the backend is unreachable, pending writes sit in an in-memory retry buffer and the status pill shows
   **Offline/Save error** — nothing is silently dropped, and nothing falls back to localStorage.

**localStorage holds UI concerns only:** theme, accent, custom hue, density, motion, and view state
(open day-cards, last-viewed roadmap, sidebar collapse, FAB position). These are per-device preferences,
not journey data, so they intentionally stay client-side.

### 6.2 What gets stored (the journey), keyed by stable IDs (§7)
- **Task completion**: `done` + `done_at` per task id (required, optional, fallback).
- **Task moves**: `moved_to` = a day id, per moved task id (absent = on origin day).
- **Soft-item ticks**: kept separate; excluded from real progress.
- **Flags**: `missed`/re-do, `starred`.
- **User content**: notes, custom link entries, per-roadmap custom fields.
- **View state** (optional to persist): open cards, expanded tracks.
- Global: settings, small meta (schema versions, last active roadmap).

### 6.3 SQLite schema
The DB is a **namespaced journey store** — structured enough to query and to export per-section
cleanly, dumb enough that **absence of a row = the default (not started / not moved)**, which removes
the seeding problem (§7).

```sql
-- One row per mutable item of journey state. Namespaced by roadmap.
CREATE TABLE journey_state (
    roadmap    TEXT NOT NULL,       -- roadmap slug, e.g. 'rust-fastapi'
    item_id    TEXT NOT NULL,       -- stable id, e.g. 'd12.t2' | 'move:d12.t2' | 'soft:d12.s1' | 'note:<ulid>'
    kind       TEXT NOT NULL,       -- 'task' | 'move' | 'soft' | 'flag' | 'note' | 'link' | 'view' | 'custom'
    value      TEXT,                -- JSON: bool (done) | string (day id / note) | object (link)
    updated_at TEXT NOT NULL,       -- ISO 8601
    PRIMARY KEY (roadmap, item_id)
);
CREATE INDEX idx_journey_roadmap ON journey_state(roadmap);

CREATE TABLE app_kv (              -- settings + app meta
    key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL
);

CREATE TABLE roadmap_registry (    -- lazy per-roadmap row, created on first touch; enables migrations
    roadmap TEXT PRIMARY KEY, schema_version INTEGER NOT NULL DEFAULT 1,
    first_seen TEXT NOT NULL, updated_at TEXT NOT NULL
);

CREATE TABLE journey_stash (       -- safety copies of displaced snapshots (keep last N)
    id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, reason TEXT, data_json TEXT NOT NULL
);

CREATE TABLE login_throttle (      -- server-side escalating lockout, keyed by hashed IP
    id TEXT PRIMARY KEY, fails INTEGER NOT NULL DEFAULT 0, strikes INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER, updated_at TEXT NOT NULL
);
```

- `value` is JSON so one table holds booleans, strings and small objects without schema churn.
- **Moves** are just `kind='move'` rows whose value is the target day id → *absence = on origin*, so
  nothing is pre-seeded and a never-moved task needs no row.
- **Soft ticks** (`kind='soft'`) are stored (so they persist/export) but the stats engine excludes them
  from real progress and reports them only as "extra stats."
- **Per-section export** = `WHERE roadmap = ?`. **Whole-journey** = all `journey_state` + relevant
  `app_kv`. Symmetric, clean.
- Schema created on first connect via `CREATE TABLE IF NOT EXISTS`.

### 6.4 Sync protocol (`sync.php`)
Data actions require a valid session (§8):
- `GET ?action=status` → `{ ok, authed }`.
- `POST ?action=login` `{ password }` → verify bcrypt, apply throttle, create session.
- `POST ?action=logout` → destroy session.
- `GET ?action=load[&roadmap=slug]` → journey (all or one) + `savedAt`.
- `POST ?action=save` `{ roadmap?, changes:[…] | full:{…} }` → upsert changed rows, delete dropped rows,
  stash on displacing writes; **empty-overwrite guard** never wipes a populated journey.
- Import/export handled client-side over `load`/`save` with a stash-first on import.
Client (`sync.js`): immediate write-through to the DB (coalesced per user action, serialized on a promise
chain), exit beacon, optimistic UI, offline detection with an in-memory retry buffer, reconcile on load.

---

## 7. Identification, initial state & "no-seed" design

Answers the brief's central worry: *since roadmaps are hand-added and progress lives in a DB, how do
we insert initial state without conflicts/bugs?*

### 7.1 Core decision: **absence = default → nothing to seed**
The DB stores **only deviations from default**: every task defaults to "not done," every task to "on
its origin day," every flag "unset." Those defaults are represented by **the absence of a row**.
Therefore a newly authored roadmap needs **zero** rows. It works immediately (all tasks read
"not done, on origin"); the first tick/move creates that one row. **No bulk seeding, no
pre-population, no migration.** "Missing seed rows" is impossible because missing rows *are* the
initial state.

### 7.2 Stable, author-assigned IDs (not array indices)
Every stateful element gets an explicit, **stable, human-authored id**, namespaced by roadmap slug at
the storage layer (so two roadmaps can reuse local ids freely):
- Roadmap: unique **slug** — `rust-fastapi`, `interp-go`.
- Objective: `rust`, `fastapi`, `crafting-interpreters`, `go-webdev`, `go-interpreter`.
- Day: `d01`, `d02`, … (stable ordinal, **never renumbered**).
- Task: `d03.t2`; optional/bonus `d03.b1`; a fallback shares the base id with `:alt`
  (`d03.b1:alt`). A **move** row uses `move:d03.t2` → value = destination day id.
- Soft item: `d03.s1` (stored as `soft:d03.s1`).
- Milestone: `w2.m1`. Week: `w1`.
- Runtime user records (notes, custom links): **generated** id `note:<ulid>` / `link:<ulid>`.

**Why semantic ids over array indices:** the reference keyed by array position (`di-ti`) and needed a
pruner to survive reordering. Author-assigned stable ids remove that fragility — reorder days, edit
labels, insert tasks without orphaning unrelated progress (given the rules below).

**Why not random CUID/UUID for content:** authored content *has* a natural identity, and a readable id
(`d03.t2`) is far easier to reason about in code and DB. So **semantic ids for authored content;
generated ULIDs only for runtime records** (ULID for lexicographic sortability; UUIDv4 also fine).

### 7.3 The id contract (author rules)
1. **Unique within a roadmap** (enforced by the boot validator, §7.5).
2. **Stable forever** once it may have been ticked/moved: never reuse, never renumber. Editing a task's
   label/estimate/links/category is free (id unchanged → progress preserved).
3. **Deleting** a task is allowed; orphaned rows are harmless and hidden (§7.4).
4. **Adding** uses a fresh id; reads as not-done until ticked.
5. Milestones/moves reference tasks/days by id, so they stay correct across edits.

### 7.4 Content changes after use (lightweight reconcile)
At load, a **reconciler** (generalising the reference pruner):
- Hides **orphaned rows** (item_id no longer in the current definition) so counts stay truthful. This also
  ignores a `move:` row whose destination day was removed (task falls back to origin).
- ⚠️ The hiding is **in memory only — reconcile never deletes a row from the DB.** The content a client runs
  can be *older* than the data (a service worker's cached roadmap files, a tab left open across a deploy, a
  typo'd id), and deleting "unknown" rows server-side would then destroy progress newer content created.
  Orphans cost nothing and come back into play as soon as the client runs content that knows them. A reset
  (`clear` / `clearAll`) or a whole-journey import removes them server-side explicitly (stashed first).
- Applies an optional per-roadmap **`aliases` map** (`{ oldId: newId }`) for the rare deliberate id
  rename, migrating the row on next load; the alias can then be removed.
Each roadmap declares `schemaVersion`; `roadmap_registry.schema_version` records what stored data was
last reconciled against (hook for future structured migrations).

### 7.5 Startup validation (fail fast)
On boot the container **validates every roadmap**: ids unique within roadmap; slug unique across
roadmaps; every milestone/move-target references existing ids; every day has a valid date; weeks/months
derive cleanly; optional-with-fallback well-formed; every task has a known objective; objective
primary/secondary set; `library` ids unique, every entry matchable and any `url` http(s). On failure it
surfaces a clear **developer error** instead of persisting bad state. This is what makes hand-authoring
safe.

### 7.6 Source library & the reading list (optional, per roadmap)
A roadmap may publish a **`library`**: the books, papers, specs, documentation sets and long-form
sites its days read from, described **once** — `title`, `by`, `edition`, `kind`, `free`, `url`, and a
`get` line saying where to obtain it. Bedrock has one; the other roadmaps don't, because their sources
are a single named book or an obvious link.

A task is tied to a source by **`match`**: any of the source's match strings occurring in that leaf's
own text — a URL fragment (`pages.cs.wisc.edu/~remzi/OSTEP`) or, for a book that is only named in
prose, its distinctive title (`DDIA`, `CS:APP`). Matching on the **text** rather than a per-task
`src:` field is deliberate:
- the planner re-flows tasks onto different cards on every re-plan, and text travels with the task;
- there is no second place to keep in step, so the tie can't rot.

`daymenu.daySources(rm, day)` groups a card's leaves by source, in the order they appear. Inheritance
runs at two levels, because a split reading loses its citation twice over:
- **within a task** — a leaf that names no source takes the previous leaf's ("Finish DDIA Ch 7",
  "Then entries #6–#10");
- **across a task's `(k/n)` parts** — when *nothing* in a part names a source, it borrows what the
  task's other parts read from. This is the card that holds only the takeaway ("the planner is
  cost-based, not rule-based"), and it is exactly the card you are meant to *finish* a reading on,
  so it must still say which book to pick back up. Keyed on the part's base text with the marker
  stripped; a task with no `(k/n)` marker never donates, so a same-named neighbour can't leak in.

The result, asserted in `daymenu.test`: **every bedrock card names at least one source**, and no
card lists a source with nothing to read from it.

---

## 8. Security & the secret gate

Scope: a *reasonable* personal lock, single owner, not fort-knox. Model from the reference
(`/home/paya/p4ya.gcc/odoo/assessment`), improved with a server-side escalating throttle.

### 8.1 Secret & storage
- One **secret** unlocks the app. Its **bcrypt hash** lives in `.env` as `JOURNEY_PASSWORD_HASH`. The
  plaintext for this project is **`whatevertheFx`**.
- `.env` lives in `roadmapper/`, **outside the web root**, so it is unreachable by any URL by
  construction (not merely blocked by a rules file); it is also **gitignored**, and `public/.htaccess`
  denies it as defense in depth. It also holds `SESSION_EXPIRY_DAYS` (default 7).

### 8.2 Flow
1. Boot → client calls `?action=status`. Authed within expiry → app loads directly.
2. Else the **secret modal** shows (blocking overlay); the app isn't served until unlocked.
3. Submit → `POST ?action=login` → `password_verify` against the hash.
   - **Correct** → create session (`session_regenerate_id`, `httponly`, `SameSite=Lax`, lifetime =
     expiry), clear that client's throttle → reveal app.
   - **Wrong** → increment throttle, 401 with remaining attempts / lockout info.
4. Valid session → no re-prompt. **Lock now** destroys it and returns to the gate.

### 8.3 Escalating lockout (server-side)
Per brief: *5 wrong → 1 min; 5 more → 2 min; and so on.* In `login_throttle` keyed by hashed IP:
- Each wrong password `fails++`.
- At `fails == 5`: set `locked_until = now + (strikes+1) minutes`, `strikes++`, reset `fails`.
- While `locked_until > now`, `login` returns "locked, try again in Xs" without checking the password.
- Successful login clears `fails`, `strikes`, `locked_until`.
- A small constant `usleep` on each verify blunts online guessing.
Deliberately a **primary, reasonable** implementation (not un-bypassable — changing IP resets the
attacker's own counter). Real protection = strong secret + bcrypt + `.env` never exposed.

### 8.4 Data-endpoint protection
`load`/`save` require a valid session (401 otherwise). Empty-overwrite guard + stash prevent accidental
loss. Payload size capped; only roadmap-namespaced keys accepted server-side.

---

## 9. Scheduling model — active days, off-days, dates, overlaps

Each roadmap runs on a subset of weekdays; off-day **count** is fixed by priority, but **which** days
are off varies per week and is chosen by the author.

### 9.1 Weekly cadence — a budget, not a fixed count
Each roadmap has a **target week count**. Every week it is given a minutes budget of *work left ÷
weeks left*, and that budget divided by a **per-card ceiling** decides how many cards it gets that
week. So the cadence falls out of the content instead of being declared, and a roadmap lands on its
target however the material splits. Current shape (2026-09-25):

| roadmap | cards/week | per-card ceiling | weeks | required work |
|---|---|---|---|---|
| Rust + FastAPI | 3 (4 in the closing weeks) | 105 min | 48 | 185.3 h |
| Go + interpreters | 3–4 | 105 min | 40 | 185.8 h |
| Bedrock (side) | 2–3 | 95 min | 48 | 147.2 h |
| Big Bang (side) | 2 | 95 min | 40 | 82.3 h |

Two ceilings apply at once:
- **per date**, across every roadmap: `stats.DAILY_CAP_MINS` = **180 min of required work**. A
  ceiling, never a target.
- **per card**: one card is one sitting. This is what stops a card absorbing a whole date's budget,
  and it is why continuation cards are normal rather than exceptional.

When a card is full, the remaining tasks are **passed along** to that roadmap's next card, ahead of
its own work, marked `carried: "dNN"`; a card left holding only passed-along work is titled
"… (cont.)". A task too big for one card is split into "(k/n)" parts at a sub-task boundary — and
each part is re-estimated as its own session, never by halving a number.

Weekdays are re-chosen every week (never repeating the week before, no A/B/A/B cycling, never more
than ~a week between sessions). There is **no weekday exclusion** — the owner is fine working any day.

### 9.2 Dates & "how a day gets a date"
The roadmap is an **ordered list of day objects**, each carrying an explicit **`date`**. Week/month
grouping is derived from `date`. Explicit dates make weekday variation, overlaps and
milestone-by-calendar-week unambiguous. Day **ids** (`d01…`) stay stable regardless of date, so moves
and progress never depend on dates.

All four roadmaps share **one week frame**: week *i* starts `2026-09-23 + 7i`. Current anchors —
Rust + FastAPI **2026-09-23 → 2027-08-24**, Go + interpreters **2026-09-23 → 2027-06-28**, Bedrock
**2026-09-24 → 2027-08-24**, Big Bang **2026-09-24 → 2027-06-29**. The calendar is produced by
`scratchpad/cap4/` (reprice → engine → builder) and asserted by `tests/schedule.test.mjs` and the
date anchors in `tests/content.test.mjs`.

### 9.3 Overlaps (both roadmaps active on the same date)
Overlap is allowed and expected. On an overlap date, the day is split across two roadmaps → **less time
each** → the author allocates a **lighter load** on those days: either fewer tasks or the same count but
**lower-effort** tasks (shorter reads, review instead of new material, a soft tryout instead of a full
exercise). The projection (§13) accounts for overlap when estimating pace.

### 9.4 No deadlines, but a live projection
Neither roadmap has a deadline. Instead the app derives a **projected finish** (§13) from remaining
effort ÷ realistic weekly capacity (active days × per-day budget, minus overlap tax), and surfaces
ahead/on/behind. Rough design-time estimates are in §15; the live projection refines them from actual
pace.

---

## 10. Moveable tasks & dual progress (*actual* vs *original*)

The headline scheduling feature. Every day/week/month reports **two** completion figures.

### 10.1 The two denominators
Each task has a static **origin day** (`origin`, from code) and a **current day** (`current` = its
`moved_to` value, or `origin` if unmoved).

- **Actual(D)** = *what's on my plate for D right now, and how much of it is done.*
  `numerator = tasks with current==D AND done`; `denominator = tasks with current==D`.
- **Original(D)** = *of the work originally planned for D, how much is done — wherever those tasks now
  live.* `numerator = tasks with origin==D AND done`; `denominator = tasks with origin==D`.

(The same two definitions apply to a **week** or **month**, using week/month membership by `current`
vs `origin`. "Original" thus follows a task by its authored home even after it's moved into another
week.) I use **"original"** (per your lean) over "raw" in code and UI.

### 10.2 Worked example (the one from the brief, formalised)
Tue has 5 tasks (T1–T5), Wed has 5 (W1–W5), Thu has 4 (H1–H4).

| Event | Tuesday | Wednesday | Thursday |
|---|---|---|---|
| Start: Tue T1–T4 done | actual 4/5, original 4/5 | — | — |
| Move T5 (undone) Tue→Wed | **actual 4/4 (100%)**, original 4/5 (80%) | actual 0/6, original 0/5 | — |
| On Wed, do W1–W3 | 4/4, 4/5 | **actual 3/6 (~50%)**, **original 3/5 (60%)** | — |
| Do the moved-in T5 on Wed | 4/4, 4/5 | **actual 4/6 (~67%)**, original 3/5 (60%) | — |
| Move W4 (undone) Wed→Thu; Thu had H1–H2 done | 4/4, 4/5 | **actual 4/5 (80%)**, **original 3/5 (60%)** | **actual 2/5 (40%)**, **original 2/4 (50%)** |

Reading the last row: Wed *actual* counts its 5 current tasks (W1,W2,W3,W5,T5) with 4 done; Wed
*original* counts its 5 authored tasks (W1–W5) with 3 done — and **if W4 is later finished while
sitting on Thursday, Wed *original* rises to 4/5**, because original follows the task's authored home.
Returning a task to its origin simply makes `current==origin` again and both figures re-agree.

### 10.3 Which figure is "the" progress?
- **Actual** is the day-to-day driver (your live plate) and the default big number on a day card.
- **Original** is the honesty check (did the authored plan for that day actually get done) and anchors
  **weekly milestones** and the plan's integrity.
- **Overall roadmap progress** is computed over *all* tasks by completion (moves don't change the global
  total), shown as actual/original too for consistency; bonus stacks past 100% (§12).

### 10.4 Database representation
- Origin day: **static**, from the day object in code (`day.id`), never stored.
- Move: a single `journey_state` row `kind='move'`, `item_id='move:<taskId>'`, `value='<dayId>'`.
  **Absence = on origin.** Return-to-origin **deletes** the row.
- Guard: a `move:` whose destination day no longer exists is ignored by the reconciler (in memory) → task
  falls back to origin (§7.4). Moves are restricted to days **within the same roadmap** (validator/UX enforced).
This is the "two owner-days" idea from the brief, minimized: one static origin (code) + one optional
`moved_to` (DB). Using stable **day ids** (not dates) avoids any date-collision ambiguity.

---

## 11. Day-content taxonomy

A day card can contain more than tasks. Four kinds, with distinct visuals and progress semantics:

1. **Required task** — counts toward its objective's progress and the day's **actual/original**
   figures. Standard checkbox + category chip + estimate + move handle.
2. **Optional / bonus task** — does **not** count in the required denominator; completing it pushes
   progress **past 100%** (reference "book track"). May carry a **fallback** (shorter variant; full *or*
   fallback = 1). Collapsible track. **Secondary-objective** tasks live here or on the secondary meter
   (§12).
3. **Soft item** — never touches journey progress:
   - **Hint** — an inset callout (💡): an interesting note about the material (a subtlety, a gotcha, a
     "why"), from research or knowledge. **Not tickable.**
   - **Suggestion / Tryout** — a *tickable* item with a **distinct** style (dashed border, different
     shape/color checkbox, an "extra" tag) that clearly reads as **not counting**. E.g. "Tryout: build a
     tiny `Rc<RefCell>` graph and force a leak, then fix it with `Weak`." Ticks are stored separately and
     surfaced only as **extra stats** ("12 tryouts done"). Given the owner's deep, exercise-heavy style,
     these are frequent and valuable.
   - **Callout** — "🆕 New in latest version" / "⚠️ Deprecated" / "see also" boxes (for older-edition
     books). Not tickable.
4. **Pre-read task** — a *real* (usually optional) task on a **prior** day that primes an upcoming one
   (e.g. "Read Calhoun §§ pp 61–74 before tomorrow's Templates videos"). Placed **occasionally and
   randomly**, not every time; when present, the next day's watch task need not repeat the review.

**Grouping / linking:** related tasks are shown **visually connected** (a bracket or an arrow ⇄), e.g.
*watch videos 34–36 (titles)* ⇄ *review Calhoun pp X–Y*. They **count separately** in progress but read
as one unit. Grouping is declared in the content (`group: "g1"` or a `link` from one task to another).

Soft items and grouping are rendered by shared shell components, so any roadmap opts in without new
plumbing.

---

## 12. Objectives & progress weighting (primary vs secondary)

A roadmap can pursue several objectives with different weights.

- Each **objective** is tagged `primary` or `secondary` and owns a set of tasks.
- **Primary objectives** form the **headline denominator**: the roadmap's main actual/original % and
  its weekly milestones are computed over primary required tasks.
- **Secondary objectives** are computed on a **separate, clearly-muted meter** and behave like the
  bonus track: they **never gate** the primary 100%, and they are **excluded from** (or shown distinctly
  beside) the primary total/weekly/monthly figures. The UI shows e.g. `Primary 63% · 71% · Secondary
  18%`.
- The **projection** (§13) primarily tracks primary objectives; secondary has its own sub-projection.

**Applied to the two roadmaps:**
- **Roadmap 1:** `rust` and `fastapi` are both **primary** (co-equal main goals).
- **Roadmap 2:** `crafting-interpreters` and `go-webdev` are **primary** (the two main goals);
  `go-interpreter` (*Writing An Interpreter in Go*) is **secondary** — it must not dominate total /
  weekly / monthly progress, exactly as requested. Within the primary pair, `crafting-interpreters` is
  weighted **slightly heavier** and scheduled to **finish a little sooner** (§15.2).

---

## 13. Stats, milestones, pace & projection

All derived at runtime from `structure + journey`; never stored; always truthful.

### 13.1 Progress rollups
- **Task** → done/not (+ timestamp).
- **Day / Week / Month** → **actual** and **original** figures (§10); est-time done vs total.
- **Objective** → actual/original for that objective.
- **Roadmap overall** → primary headline (actual/original) with **bonus/secondary stacking past 100%**;
  secondary on its own meter.
- **Journey-wide** (optional settings dashboard) → across roadmaps.

### 13.2 Milestones
- Rule types: `tasks` (specific ids), `weekPct` (≥ X% of the week — by **original**, so moves don't
  cheese it), `count` (≥ N of a set), `category` (all `code` of a week), `phase` (phase complete).
  Extensible.
- Each shows **met / at-risk / missed** and, for time-bound ones, whether the week end has passed. The
  rail highlights the **current** week's target.

### 13.3 Pace / "on track" & projection
- **Remaining effort** = Σ est of undone **required** tasks (primary; secondary tracked separately).
  Optional/bonus tasks are **not** included, so they never inflate the remaining figure or the ETA;
  their done/undone time is reported separately as bonus-invested / bonus-remaining.
- **Weekly capacity** = active-days/week × per-day budget − overlap tax.
- **Projection** = today + ceil(remaining ÷ capacity). Because the budget is *flexible ~3h*, it is a
  **range** (optimistic/expected).
- **The plan's own end date leads the readout.** `stats.planEndDate()` is the last card's *effective*
  date — the roadmap's own answer to "when am I done" — and the hero prints it first: *"Plan ends
  24 Aug 2027 · at ~6h/week you'd finish around 17 May 2027"*. The two disagree by design: capacity
  assumes the whole daily ceiling is spent on every active day, while the plan deliberately averages
  well under it (§9.1), so the projection lands months early. Shown first it reads as contradicting
  the calendar; shown second, as what a harder week would buy. The estimate carries a hover note
  saying it is a what-if, and the optimistic end of the range lives there too.
- **Ahead / on track / behind** is a *separate* judgement and never uses the projected date: it
  compares completion against the share of required work the plan itself schedules by today
  (`plannedByToday`), so keeping exactly to a front-loaded plan reads "On track". This is also what
  the sidebar **on-track dot** shows, and Insights derives its own pace readout the same way.

### 13.4 Extra stats (dataviz skill for any charts)
- **Streak** (consecutive active days with the day's **original** required tasks done).
- **Time invested** (Σ est of done **required** work) and remaining; **bonus time** (Σ est of done
  optional) tracked and shown separately, never merged into the required figures.
- **Category / objective distribution** of work done.
- **Soft-item extra stats** (tryouts/suggestions completed) — shown apart from real progress.
- Per-week completion sparkline.

### 13.5 Activity log & the cross-roadmap "Today" effort panel
- Derived purely from the `done_at:<taskId>` timestamps the store writes on tick (`activity.js`) — no
  new storage. It is an **activity** view keyed by the calendar day the work was *done* (independent of
  the day a task was *scheduled* for), and it naturally spans **every roadmap**.
- The **Today** tab (`#/today`) shows an **effort panel** above the due/overdue digest:
  - Headline numbers for the selected day: **time on tasks**, **tasks done**, **roadmaps touched**, and
    a **bonus** `+N · time` when any optional work was done that day.
  - **Comparisons**: vs the previous day, vs a **trailing 7-day daily average** (rest days count as
    zero), and **this 7 days vs the previous 7** — each a green-up / red-down delta pill.
  - A **14-day bar chart** of daily minutes (selected day highlighted; bars are clickable to select).
  - A **breakdown** of exactly which tasks were completed that day, grouped by roadmap.
  - A **day stepper** (and clickable bars) let you move to any past day back to the journey start; the
    due/overdue digest below always stays anchored to the real *today*.

---

## 14. Roadmap authoring model (how a section is added)

### 14.1 Shape of a roadmap content module (illustrative)
```js
registerRoadmap({
  slug: "interp-go",
  title: "Interpreters & Go",
  icon: "🧩",
  subtitle: "Finish Crafting Interpreters + Go web dev; then the Go interpreter",
  accent: "#00add8",
  schemaVersion: 1,
  cadence: { activeDaysPerWeek: [3, 4] },     // priority band (docs/projection)
  aliases: {},

  objectives: [
    { id: "crafting-interpreters", title: "Crafting Interpreters", tier: "primary", weight: 1.2 },
    { id: "go-webdev",            title: "Go Web Dev",            tier: "primary", weight: 1.0 },
    { id: "go-interpreter",       title: "Writing an Interpreter in Go", tier: "secondary" },
  ],

  weeks: [ { id: "w1", title: "jlox: Control Flow → Functions", start: "2026-07-16" }, /* … */ ],

  days: [
    {
      id: "d01", date: "2026-07-16", dow: "Thu", week: "w1",
      title: "jlox — finish Control Flow",
      theme: "Close chapter 9 and do every challenge.",
      tasks: [
        { id: "t1", obj: "crafting-interpreters", cat: "read",  est: 40,
          label: `Crafting Interpreters — finish <b>Ch. 9 Control Flow</b> (pp …).` },
        { id: "t2", obj: "crafting-interpreters", cat: "code",  est: 60,
          label: `Implement the remaining <code>while</code>/<code>for</code> desugaring.`, group: "g1" },
        { id: "b1", obj: "crafting-interpreters", cat: "drill", est: 45, optional: true,
          label: `<b>Ch. 9 Challenges</b> — all of them.`,
          fallback: { est: 20, label: `Challenges 1–2 only.` }, group: "g1" },
      ],
      soft: [
        { id: "s1", type: "hint",    label: `💡 Lox's <code>for</code> is pure syntactic sugar…` },
        { id: "s2", type: "tryout",  label: `Tryout: add a <code>break</code> statement (a later challenge — try now).` },
        { id: "s3", type: "callout", label: `See also: Pratt parsing — Nystrom's blog post.` },
      ],
      note: "…",
    },
    // …
  ],

  milestones: [
    { id: "w1.m1", week: "w1", title: "jlox control flow + challenges done",
      rule: { type: "tasks", require: ["d01.t2", "d01.b1"] } },
    { id: "w1.m2", week: "w1", title: "≥ 80% of week 1 (original)", rule: { type: "weekPct", min: 80 } },
  ],

  features: [ /* reference panels, deprecation callouts, project ideas, notes, link box */ ],
});
```
The shell's render + stats + milestone + move + projection engines consume this object; the author
writes only **data + prose**.

### 14.2 Categories
Base set (colored chips), extensible per roadmap: `read`, `watch`, `code`, `drill`, `exercise`,
`challenge`, `project`, `review`, `api`, `book`, `prep`, `alt`. (Adds `watch`/`exercise`/`challenge`/
`project`/`review` to the reference set for these roadmaps.)

### 14.3 Bespoke helper features ("cool extras")
Improvised per roadmap: external **references** (material beyond the primary source), **"new /
deprecated / see also"** callouts (older-edition books), **project & tryout ideas** unlocked at points,
**cheat-sheets**, **re-do/missed list**, **link box**, **personal notes**. Declared in
`features`/`soft`/`extras`; rendered by shared components.

### 14.4 Add-a-roadmap checklist (operational)
1. **Research** the source material, realistic pace, milestones, and gaps worth a helper feature.
2. **Author** the content module (stable ids; objectives; schedule/dates; days; tasks; soft items;
   weeks; milestones; extras).
3. **Register** it (one line / auto-discovered import).
4. **Nothing else** — no DB step (absence = default); the validator confirms integrity on boot; it
   appears in the sidebar.

---

## 15. The two concrete roadmaps — content plan

> **This section is the ORIGINAL authoring brief, kept as the record of what each roadmap was
> researched to contain — the books, the chapters, the gaps worth supplementing, the style.**
> Its *scheduling* figures (start anchor, active days/week, "≈ 6–10 weeks") are design-time
> guesses that later re-plans superseded; two side roadmaps were added after it was written.
> **§9.1 and §9.2 are authoritative for the calendar** — cadence, per-card ceiling, week counts
> and the current start/finish anchors. Read this section for *what* is studied, §9 for *when*.

Source files verified on disk; page counts from `pdfinfo`. Start anchor at the time of writing:
**2026-07-16 (Thu)** — see §9.2 for the live one.

### 15.1 Roadmap 1 — **Rust + FastAPI** (slug `rust-fastapi`) · priority HIGH · 4–5 active days/week
Two **primary** objectives.

**Objective `rust` — *The Rust Programming Language*** (Klabnik & Nichols) · `~/Desktop/rust.pdf` · 554 pp
· resume **p. 343 / Ch. 15 (defining smart pointers)**.
- **Remaining:** Ch. 15 Smart Pointers · 16 Fearless Concurrency · 17 OOP Features · 18 Patterns &
  Matching · 19 Advanced Features (unsafe, traits deep, macros) · **20 Final Project — a multithreaded
  web server** (multi-day) · Appendices. ≈ 211 pp.
- **Style:** deep — do every listing; **tryout projects** where the book is light on examples
  (e.g. build a small `Rc<RefCell>`/`Weak` graph; a mini thread-pool before Ch. 20; a tiny CLI). Invent
  minimal exercises that **combine** consecutive topics; harden easy ones. Ch. 20 gets its own mini-arc.
- **Supplements / see-also:** async isn't covered by the book → point to *the Async Book* + `tokio`
  as a "see also"; error-handling ergonomics (`anyhow`/`thiserror`); `Deref`/`Drop` subtleties;
  interior mutability pitfalls. **After the book:** Rustlings, Rust by Example, *Command-Line Rust*,
  the Nomicon (advanced), a real project idea.

**Objective `fastapi` — *Mastering FastAPI with Python*** (Ayman Alheraki) · `~/Desktop/Mastering_FastAPI_with_Python.pdf`
· 139 pp · resume **p. 52 / Ch. 4 (databases)**.
- **Remaining:** Ch. 4 Databases → auth/security → microservices/deploy. ≈ 87 pp; **brief** book →
  **heavy supplementation** (this is where the roadmap adds most value).
- **Supplements (from official docs & known gaps, mirroring the reference roadmap):** Bigger
  Applications / `APIRouter`, `response_model`, `Depends` (dependency injection), `TestClient` testing,
  background tasks, OAuth2 + JWT security, async SQLAlchemy 2.0 patterns. **"New/deprecated" callouts:**
  Pydantic **v1 → v2** migration, `lifespan` vs `on_event`, SQLAlchemy 1.x → 2.0. A small **build-a-real-
  API tryout** (CRUD + auth + tests) as the capstone.

**Shape & rough estimate:** most active days carry a Rust block + (on some days) a FastAPI block; on
Roadmap-2 **overlap** dates, lighter loads. Deep exercise work dominates. **Rough design-time estimate:
≈ 6–10 weeks** for both; the app's live projection refines it.

### 15.2 Roadmap 2 — **Interpreters & Go** (slug `interp-go`) · priority MEDIUM · 3–4 active days/week
Two **primary** objectives + one **secondary**, with a deliberate ordering.

**Objective `crafting-interpreters` (PRIMARY, weighted ×1.2, finishes slightly sooner) — *Crafting
Interpreters*** (Nystrom) · `~/Desktop/Crafting Interpreters Robert Nystrom.pdf` · 611 pp · resume
**p. 137 / Ch. 9 (Control Flow), in jlox (Java)**.
- **Remaining Part II (jlox/Java):** finish Ch. 9 · 10 Functions · 11 Resolving & Binding · 12 Classes ·
  13 Inheritance.
- **Part III (clox / C bytecode VM):** Ch. 14–30 (Chunks, VM, Scanning-on-Demand, Compiling
  Expressions, Values, Strings, Hash Tables, Global/Local Variables, Jumping, Calls & Functions,
  Closures, **GC**, Classes & Instances, Methods & Initializers, Superclasses, Optimization). ≈ 470 pp,
  denser.
- **Style (as stated):** build the projects; do **all end-of-chapter challenges** (each chapter →
  a read/implement task **plus** a `challenge` task; heavy chapters get their own day). This is the
  most time-intensive objective in either roadmap.
- **See-also bridge:** occasional pointers to *Writing an Interpreter in Go* (the secondary objective)
  as "how the same idea looks in Go," plus a **late pre-read/starter** task so the transition is smooth.

**Objective `go-webdev` (PRIMARY) — Go video course + book(s).**
- **Video course:** 285 videos (titles in `./Web Development with Go v2 (Current Version).txt`) · resume
  **video 27 "What Are Templates?"** → 258 remaining. Natural topic clusters (from the list):
  Templates (27–36) · Code-Org/MVC (37–54) · Signup/REST (55–62) · Databases (63–89) ·
  Passwords/bcrypt (90–106) · Cookies/Sessions/CSRF (107–137) · SQL relations/indexes/migrations
  (138–155) · Context/middleware (156–164) · Password-reset/email (165–194) · Galleries CRUD (195–217) ·
  Images/uploads (218–238) · Config/Docker/Tailwind (239–248) · Deployment (249–263) · OAuth/Dropbox
  (264–285).
- **Reference book:** *Web Development with Go* (Calhoun) · `~/Desktop/web-development-with-go-2022-update_1.pdf`
  · 601 pp · resume **p. 93 (What Are Templates?)** *(early page numbers unreliable — map by section
  title, not page)*. **Linking model:** each Go session = a **watch task** ("watch videos X–Y
  (titles)") ⇄ **grouped** "review Calhoun §§" task; **occasionally** a prior-day **pre-read** ("read
  Calhoun §§ before tomorrow's videos") so that day's watch task needn't repeat the review. Videos are
  cited **by index + title**.
- **Side book:** *Let's Go* (Alex Edwards, 2nd ed) · `~/Desktop/Let_s_Go_Learn_to_build_professional_web_applications_with_Go_9zCGhUer.pdf`
  · 426 pp · **not started**. Used for **hints/extras**, **sample-project ideas** (its build-an-app
  arc feeds "project" soft items), occasional **extra tasks** ("read *Let's Go* pp x–y", "note the app
  in §z"), and **≈ once every ~2 weeks a mandatory task** (e.g. *end of week 2: read first 20 pp of
  Let's Go*) that the preceding extra tasks build toward. Mostly **soft/optional** except the periodic
  mandatory reads.

**Objective `go-interpreter` (SECONDARY) — *Writing An Interpreter In Go*** (Thorsten Ball) ·
`~/Desktop/writing an INTERPRETER in go.pdf` · 206 pp · **not started**.
- **During the main run:** light **see-also** mentions + a couple of late **pre-read/starter** extra
  tasks near the end of Crafting Interpreters.
- **After CI finishes:** the interpreter-side days flow into this book (its tasks activate) **alongside**
  the remaining Go web dev days.
- **After Go web dev finishes:** an **appended sub-section at the bottom of the same roadmap** solely
  finishes this book.
- **Weighting:** **secondary** everywhere — separate meter, never gates primary 100%, excluded from the
  primary total/weekly/monthly figures (§12).

**Ordering (phases):**
- **Phase A** — CI (~2 of the 3–4 weekly days, weighted) + Go web dev (~1–2 days); light Go-interp
  see-alsos; a late CI→Go-interp starter pre-read.
- **Phase B** — CI done (a little sooner) → interpreter days move to *Writing an Interpreter in Go*
  (secondary) while Go web dev continues.
- **Phase C** — Go web dev done → appended secondary sub-section finishes the Go interpreter.

**Rough design-time estimate:** primary CI + Go web dev, done deeply, ≈ **5–8 months** at 3–4 days/week;
the secondary Go-interpreter tail follows. Live projection refines this and tracks primary/secondary
separately.

### 15.3 Cross-roadmap interaction
On dates where **both** roadmaps are active, Roadmap 1 keeps priority; Roadmap 2's day is **lighter**
(fewer or lower-effort tasks — e.g. a review/challenge instead of a new clox chapter). The scheduler
(author) picks each week's off-days to keep total daily load near the flexible ~3h baseline, and the
projection accounts for the overlap tax.

---

## 16. Project structure (proposed)

```
Roadmaps/
├── public/               # THE WEB ROOT — its contents go into public_html/ on cPanel
│   ├── .htaccess         # Options -Indexes + deny .env/*.sqlite*/dot-files (defense in depth)
│   ├── index.php         # app shell
│   ├── sync.php          # thin public endpoint → forwards to roadmapper/api.php
│   ├── app-path.php      # locates roadmapper/ (sibling of the web root, then in-root fallback)
│   ├── assets/
│   │   ├── css/          # shell.css, components, themes
│   │       ├── app.js        # bootstrap, routing, lock gate
│   │       ├── registry.js   # registerRoadmap(), boot validation
│   │       ├── render.js     # roadmap → DOM (days, tasks, soft items, groups)
│   │       ├── stats.js      # actual/original, objectives, milestones, projection
│   │       ├── moves.js      # task-move engine
│   │       ├── sync.js       # DB read/write layer (single source of truth)
│   │       ├── ui.js         # modals, toasts, drawer, sidebar, move picker
│   │       └── util.js       # ids (ULID), dates, formatting
│   └── roadmaps/
│       ├── _index.js         # imports/registers each roadmap
│       ├── rust-fastapi.js   # Roadmap 1 content
│       └── interp-go.js      # Roadmap 2 content
├── roadmapper/               # PRIVATE app dir — placed OUTSIDE the web root; never served
│   ├── .htaccess             # deny-all (defense in depth if ever inside the docroot)
│   ├── api.php               # SQLite persistence + auth + throttle (was sync.php)
│   ├── .env                  # JOURNEY_PASSWORD_HASH (bcrypt of `whatevertheFx`), SESSION_EXPIRY_DAYS  (gitignored)
│   ├── .env.example          # template + instructions
│   ├── journey.sqlite        # created on first save                              (gitignored)
│   └── .sessions/            # PHP session files                                  (gitignored)
├── .gitignore               # roadmapper/.env, *.sqlite*, .sessions/, etc.
├── DESIGN.md                # this document
└── TASKS.md                 # build plan
```
The **shell vs content** separation is the invariant; the exact file split may adjust in
implementation.

---

## 17. Design decisions & rationale (summary)

| Decision | Choice | Why |
|---|---|---|
| Stack | PHP + SQLite + vanilla JS, no build | Proven by reference; zero-config; single-owner; portable |
| Container | One SPA-ish shell, roadmaps as data modules, **no iframes** | Brief requires one cohesive app; data-driven → free stats/moves |
| Authoring | Static, hand-coded module + one registration | Roadmaps are considered plans, not DB rows |
| DB role | Store **only** journey state; structure stays in code | Tiny DB, git-versioned content, **no seeding** |
| Initial state | **Absence of row = default** (not done / on origin) | Eliminates seed/conflict problem entirely |
| IDs | Semantic ids for content (roadmap-namespaced) + ULID for runtime records | Stable across edits; readable; collision-free |
| Integrity | Boot **validator** + load **reconciler** (+ alias map) | Safe hand-authoring; DB never drifts from truth |
| Scheduling | Explicit per-day **dates**; off-days chosen per week | Simple, unambiguous overlaps/weeks/milestones (reference model) |
| Moves | Static `origin` (code) + optional `moved_to` (DB, by **day id**) | Minimal state; the brief's two-owner-days, simplified |
| Dual progress | **actual** (by current day) + **original** (by origin day) | Exactly the brief's semantics; moves stay honest |
| Objectives | primary (headline) vs secondary (separate meter, past 100%) | Go-interpreter must not dominate; matches request |
| Soft items | hints (non-tickable) + tryouts (distinct tick, extra stats only) | Rich guidance without polluting real progress |
| Auth | bcrypt in `.env`, PHP session, expiry days | Reference-proven, simple, adequate |
| Lockout | Server-side **escalating** throttle (5→1m→2m…) | Meets brief; reasonable, not fort-knox |
| Dialogs | Custom modal/toast system | Brief forbids `window.*`; better UX |
| Persistence | **SQLite = single source of truth**; immediate write-through; empty-overwrite guard + stash; localStorage for UI prefs only | Simple, durable, accident-proof; no dual-store drift |
| Projection | Derived range from remaining effort ÷ capacity, self-correcting | No deadlines, but keep-up guidance |

---

## 18. Resolved clarifications & remaining open questions

**Resolved (this session):**
- **Time budget:** flexible → plan a **~3h/day baseline**; tasks flex up/down.
- **Style:** deep/hands-on → solve nearly all examples/exercises, **all CI challenges**, invent tryout
  projects, harden easy exercises → reflected in `challenge`/`project`/`tryout` content and pacing.
- **Writing an Interpreter in Go:** **secondary** objective in Roadmap 2; light mentions + late starter
  during, then continues after CI, then an appended sub-section finishes it; weighted separately.
- **CI vs Go web dev:** CI weighted slightly heavier and finishes a little sooner.
- **Off-days:** author chooses freely each week within the priority band.

**Still open (non-blocking; sensible defaults chosen):**
1. **Sidebar grouping** once more roadmaps exist — *default: flat + mini-bar*.
2. **Cross-roadmap global dashboard** — *default: per-roadmap now; light global summary in settings*.
3. **View-state sync** (which cards open) across devices — *default: local-only; ticks/moves/notes sync*.
4. **Session expiry days** — *default: 7*.
5. **Draggable settings FAB** — *nice-to-have; ship static-position first if drag is fiddly*.
6. **Exact per-week off-day pattern & concrete dates** for each roadmap — decided during content
   authoring (TASKS.md), tuned so weekly load stays near the ~3h baseline with overlaps accounted for.

---

*Next: **TASKS.md** — the step-by-step build plan (research → shell → engines → the two roadmaps'
content → polish), derived from this design.*
