# Roadmaps — Build Plan (TASKS.md)

Step-by-step plan to build the app described in [DESIGN.md](DESIGN.md). Ordered so each phase is
independently testable. Checkboxes are the working list; sub-bullets say *exactly* what to do, check,
research, or design.

> **Status: ✅ BUILT & VERIFIED (all 65 tasks).** The app is fully implemented and driven end-to-end
> in a headless browser (unlock → tick → move across a week boundary → milestone → export/import →
> reset → lock, on both roadmaps). See the **Build status & verification** section at the bottom for
> what was tested and the two small additions made during a post-build review.

Legend: 🔬 research · 🧠 design/decide/be-creative · 🛠️ implement · ✅ verify · ⚠️ watch-out.

Guiding constraints (from DESIGN.md): PHP + SQLite + vanilla JS, no build step; **absence of a row =
default** (no seeding); custom modals only; secret gate `whatevertheFx`; dual **actual/original**
progress; moveable tasks; primary/secondary **objectives**; soft items; live projection; beautiful,
smooth, responsive UI.

---

## Phase 0 — Scaffolding & environment
- [x] 🛠️ Create the file skeleton from DESIGN §16 (`router.php`, `index.php`, `sync.php`, `assets/`,
  `roadmaps/`, `.env.example`, `.gitignore`).
- [x] 🛠️ `.gitignore`: `.env`, `*.sqlite*`, `.sessions/`, `journey.sqlite*`, OS cruft.
- [x] 🛠️ Generate `.env` with `JOURNEY_PASSWORD_HASH` = `php -r 'echo password_hash("whatevertheFx", PASSWORD_DEFAULT);'`
  and `SESSION_EXPIRY_DAYS=7`. Write `.env.example` (empty hash + the generate command). ⚠️ Confirm
  `.env` is gitignored before any commit.
- [x] ✅ `php -S localhost:8000 router.php` serves `index.php`; `curl .../.env` and `.../journey.sqlite`
  return 404.

---

## Phase 1 — Research & content mapping (feeds the two roadmaps)
Do this before authoring content; it sets accurate pages, clusters, milestones, and supplements. Store
findings in `roadmaps/_research.md` (scratch, not shipped) so authoring is fast.

### 1A — Extract real structure from the PDFs (don't trust memory)
- [x] 🔬 For each PDF, pull the **table of contents + chapter→page ranges** (use `pdftotext -f N -l M`
  on the TOC pages, or `pdfinfo`/`mutool`). Files & resume points:
  - Rust `~/Desktop/rust.pdf` (554pp) — from **Ch.15 / p.343** → 20 + appendices.
  - FastAPI `~/Desktop/Mastering_FastAPI_with_Python.pdf` (139pp) — from **Ch.4 / p.52**.
  - Crafting Interpreters `~/Desktop/Crafting Interpreters Robert Nystrom.pdf` (611pp) — from **Ch.9 /
    p.137**; map both jlox (ch4–13) and clox (ch14–30) page ranges + **locate each chapter's Challenges**.
  - Web Dev with Go `~/Desktop/web-development-with-go-2022-update_1.pdf` (601pp) — ⚠️ early page numbers
    unreliable → map **by section title** to match video titles.
  - Let's Go `~/Desktop/Let_s_Go_...pdf` (426pp) — TOC + its build-an-app project arc (for project soft
    items + the periodic mandatory reads).
  - Writing an Interpreter in Go `~/Desktop/writing an INTERPRETER in go.pdf` (206pp) — TOC (for the
    secondary tail + see-also mentions).
- [x] 🔬 Build a **video→book section map** for Go web dev: align the 285 video titles
  (`./Web Development with Go v2 (Current Version).txt`) to Calhoun book sections/pages, so each watch
  task can cite the matching `review Calhoun §§` range. Confirm the topic clusters in DESIGN §15.2.

### 1B — Calibrate pace (rough, for the design-time estimate + initial projection)
- [x] 🔬 Sanity-check typical completion effort for these books given the **deep, all-challenges** style
  (Crafting Interpreters challenges especially are heavy). Cross-check a couple of external data points
  (reading-time / "how long did it take" reports) but weight the owner's style over averages.
- [x] 🧠 Decide per-objective **effort-per-page / per-video** constants used to fill task `est` values
  and seed the projection. Keep them explicit so they're easy to tune.

### 1C — Supplement research (the roadmap's added value)
- [x] 🔬 **FastAPI gaps** (brief book → supplement heavily): confirm the official-doc pages to slot in
  (Bigger Applications/`APIRouter`, `response_model`, `Depends`, `TestClient`, background tasks,
  OAuth2+JWT, async SQLAlchemy 2.0) and the **v1→v2 / lifespan / SQLAlchemy 2.0** "new/deprecated"
  callouts. Gather stable links.
- [x] 🔬 **Rust** see-alsos: async (Async Book + tokio, since the book uses threads), `anyhow`/`thiserror`,
  interior-mutability pitfalls, and an "after the book" list (Rustlings, Rust by Example, the Nomicon,
  Command-Line Rust). Gather links + pick tryout-project ideas per chapter.
- [x] 🔬 **Crafting Interpreters** see-alsos: Pratt parsing, AST/visitor, stack-vs-register VMs, GC
  notes; and the **bridge** to *Writing an Interpreter in Go* (which chapters map across).
- [x] 🔬 **Go web dev** extras from *Let's Go*: which of its chapters/projects to cite as hints/project
  ideas, and which ~biweekly **mandatory read** ranges to schedule.
- [x] 🧠 Collect 💡 **hints** (interesting notes/gotchas) to sprinkle per chapter/topic across both
  roadmaps — this is a creativity surface; make them genuinely useful, not filler.

---

## Phase 2 — Backend (PHP + SQLite)
- [x] 🛠️ `router.php` — port the reference front-controller: 404 dot-files / `*.sqlite*` / `.sessions/`;
  return false otherwise. (See reference `/home/paya/p4ya.gcc/odoo/assessment/router.php`.)
- [x] 🛠️ `sync.php` — adapt the reference `sync.php`:
  - `.env` loader; bcrypt `password_verify`; PHP session (`httponly`, `SameSite=Lax`, lifetime = expiry
    days); `session_regenerate_id` on login; `status`/`login`/`logout`.
  - Schema from DESIGN §6.3 via `CREATE TABLE IF NOT EXISTS` (WAL, busy_timeout).
  - `load` (all or `?roadmap=`), `save` (upsert changed + delete dropped rows), **empty-overwrite guard**
    + `journey_stash`. Only roadmap-namespaced keys accepted; payload cap.
  - Lazy `roadmap_registry` row on first save for a slug.
- [x] 🛠️ **Escalating throttle** in `sync.php` (`login_throttle`): hashed-IP key; `fails++`; at 5 →
  `locked_until = now + (strikes+1)·60`, `strikes++`, reset fails; block while locked; clear on success;
  small constant `usleep`. Return remaining-attempts / seconds-left to the client.
- [x] ✅ Verify: wrong password 5× → locked ~60s; 5 more → ~120s; correct password clears it; sessions
  persist across reloads; `load`/`save` 401 without a session; empty snapshot never wipes data.

---

## Phase 3 — Frontend shell (bootstrap, gate, sidebar, routing, theme)
- [x] 🛠️ `index.php` shell: minimal CSS reset, theme variables (light/dark/auto), font, layout grid
  (sidebar + main + FAB). Inline-critical CSS, rest in `assets/css/`.
- [x] 🛠️ `app.js` bootstrap: on load call `?action=status`; if unauthed render the **lock modal**
  (custom, focus-trapped) and block the app; on success reveal with a smooth transition. Handle
  local-only fallback when the endpoint isn't JSON (static host).
- [x] 🛠️ **Lock modal**: secret input, show/hide, submit → `login`; render errors, remaining attempts,
  and a **live lockout countdown** driven by the server response. "Lock now" (from settings) returns here.
- [x] 🛠️ **Sidebar**: list registered roadmaps (icon, title, mini progress bar, on-track dot);
  expandable entries (phase/week/Today jumps); collapsible rail; mobile slide-over; persist collapse
  state. Keyboard nav.
- [x] 🛠️ **Routing**: hash-based (`#/<slug>` and optionally `#/<slug>/w2` / `/today`), back/forward
  support, deep links, default to last-active roadmap.
- [x] 🛠️ **Theme engine**: auto via `prefers-color-scheme` + manual override persisted; accent; density;
  reduce-motion toggle.
- [x] ✅ Gate blocks until unlocked; sidebar navigates; theme toggles; reload keeps you in.

---

## Phase 4 — Rendering engine (`registry.js`, `render.js`)
- [x] 🛠️ `registerRoadmap()` + registry; auto-import `roadmaps/_index.js`.
- [x] 🛠️ **Boot validator** (DESIGN §7.5): unique ids/slugs; milestone/move targets exist; valid dates;
  weeks/months derive; optional+fallback well-formed; every task has a known objective; objective tiers
  set. On failure show a clear **dev error banner** (don't persist).
- [x] 🛠️ Render **hero** (title, subtitle, dual overall progress bars, projection, export/import
  buttons), **stats strip**, **objective meters** (primary headline vs muted secondary), **milestone
  rail**.
- [x] 🛠️ Render **timeline**: month → week group headers (with dual week progress + milestone) → **day
  cards** (expand/collapse animation; today highlighted + auto-open; past dimmed; future closed).
- [x] 🛠️ Render **task rows**: checkbox, category chip, rich HTML label, estimate, **move handle**;
  optional/bonus **track** (collapsible, fallback logic, past-100%).
- [x] 🛠️ Render **soft items** (DESIGN §11) with distinct visuals: **hint** callout (💡, non-tickable),
  **tryout/suggestion** (dashed, differently-shaped tick, "extra" tag — visibly *not* real progress),
  **callout** ("new/deprecated/see also"). ⚠️ Soft ticks must never enter real-progress math.
- [x] 🛠️ Render **grouped/linked tasks** with a connector/arrow (⇄) while counting separately.
- [x] ✅ A hand-written fixture roadmap renders all element kinds correctly in light/dark, desktop/mobile.

---

## Phase 5 — Engines: stats, moves, milestones, projection (`stats.js`, `moves.js`)
- [x] 🛠️ **Dual progress** (DESIGN §10): compute **actual** (by `current` day) and **original** (by
  `origin` day) for day/week/month/objective/roadmap. ✅ Reproduce the DESIGN §10.2 worked-example table
  exactly with a unit check.
- [x] 🛠️ **Move engine**: drag-and-drop between day cards + a custom **move picker** fallback
  (same-roadmap days + "back to origin"); write/delete `move:` rows; animate; show moved-from/to tags;
  recompute both figures + week/month if the move crosses a boundary. ⚠️ Restrict targets to the same
  roadmap; guard removed-day targets.
- [x] 🛠️ **Objectives/weighting** (DESIGN §12): primary → headline & milestones; secondary → separate
  muted meter, excluded from primary rollups, stacks past 100%.
- [x] 🛠️ **Milestones**: rule types `tasks`/`weekPct`(by **original**)/`count`/`category`/`phase`;
  met/at-risk/missed; highlight current week.
- [x] 🛠️ **Projection** (DESIGN §13.3): remaining primary effort ÷ weekly capacity (active days × ~3h −
  overlap tax), refined by rolling actual pace; output a **range** + ahead/on/behind delta + sidebar
  dot; separate secondary sub-projection.
- [x] 🛠️ **Extra stats**: streak (by original), time invested/remaining, category/objective
  distribution, soft-item counts (shown apart).
- [x] ✅ Move a task across a week boundary and confirm both weeks' actual/original + the weekly
  milestone update correctly; return-to-origin re-agrees the figures.

---

## Phase 6 — Settings, import/export, modals/toasts (`ui.js`)
- [x] 🛠️ Reusable **modal** system (focus trap, ESC/overlay, animated) and **toast** system. Replace any
  temptation to use `window.*`.
- [x] 🛠️ **Settings FAB → right drawer**: theme/accent/density/reduce-motion; sync status + "sync now";
  **Lock now**; version. (Draggable FAB optional; static fallback fine.)
- [x] 🛠️ **Per-roadmap export/import** (hero) and **whole-journey export/import** (settings). JSON
  wrapper format compatible in spirit with the reference; import runs a **custom overwrite-confirm
  modal**, stashes first, validates, then replaces + reloads. Per-roadmap import scopes to that slug.
- [x] 🛠️ **Reset**: per-roadmap and reset-all, each behind an explicit confirm modal (stash first).
- [x] ✅ Export → clear → import round-trips exactly (ticks, moves, soft ticks, notes); per-roadmap
  export contains only that slug.

---

## Phase 7 — Roadmap 1 content: **Rust + FastAPI** (`roadmaps/rust-fastapi.js`)
Uses Phase-1 research. Priority HIGH → **5–6 active days/week**.
- [x] 🧠 Define objectives (`rust`, `fastapi` — both primary), weeks, and the **per-week off-day pattern**
  (vary which days are off; keep near the ~3h baseline; leave room for Roadmap-2 overlap days to be
  lighter there).
- [x] 🛠️ Author **Rust** days from Ch.15 → 20 + appendices: read/implement tasks with real page ranges;
  **tryout projects** where examples are thin; **combine-topics** mini-exercises; harden-easy variants;
  a multi-day **Ch.20 web-server** arc. Add 💡 hints + see-also callouts (async, error handling) + an
  "after the book" panel.
- [x] 🛠️ Author **FastAPI** days from Ch.4 →: book tasks **plus** the supplement doc-page tasks and
  **v2/lifespan/SQLAlchemy-2.0** callouts; a **build-a-real-API** capstone tryout. Group each
  book-section task with its matching doc task where it helps.
- [x] 🛠️ Weekly **milestones** (by original %) per week; assign stable ids throughout.
- [x] ✅ Validator passes; dual progress, moves, milestones, projection all behave on real content;
  overlap days are visibly lighter.

---

## Phase 8 — Roadmap 2 content: **Interpreters & Go** (`roadmaps/interp-go.js`)
Priority MEDIUM → **3–4 active days/week**. Phases A/B/C from DESIGN §15.2.
- [x] 🧠 Define objectives (`crafting-interpreters` primary ×1.2, `go-webdev` primary, `go-interpreter`
  secondary), weeks, phases, and the varying off-day pattern. Ensure **CI finishes a little sooner** by
  weighting its weekly days.
- [x] 🛠️ Author **Crafting Interpreters** days: finish jlox (Ch.9–13) then clox (Ch.14–30); **each
  chapter → read/implement task + a `challenge` task (all challenges)**; heavy chapters get their own
  day; project/tryout soft items; 💡 hints; see-also bridges to *Writing an Interpreter in Go*, incl. a
  **late starter pre-read**.
- [x] 🛠️ Author **Go web dev** days: **watch task (videos X–Y by index+title)** ⇄ **grouped review
  Calhoun §§** task; sprinkle **occasional prior-day pre-reads**; cite videos precisely from the txt
  list. Weave **Let's Go** as hints/project ideas/extra tasks + a **~biweekly mandatory read** the extras
  build toward.
- [x] 🛠️ **Secondary `go-interpreter`**: light see-also/pre-read tasks during; then **Phase B**
  activation after CI; then **Phase C** appended sub-section at the bottom that solely finishes the book.
  Ensure it stays on the **secondary meter** and out of primary rollups.
- [x] 🛠️ Weekly milestones; stable ids; overlap-lighter days coordinated with Roadmap 1.
- [x] ✅ Validator passes; secondary progress is separated everywhere (total/weekly/monthly); phase
  ordering reads correctly; grouped watch↔review render with connectors.

---

## Phase 9 — Polish (visual, motion, responsive, a11y)
- [x] 🧠🛠️ Elevate the visual system: spacing/type scale, category color system (follow **dataviz** skill
  for any charts/meters), light/dark parity, per-roadmap accent tint.
- [x] 🛠️ Motion pass: card expand, bar fills, drawer slide, toast rise, checkbox pop, **move animation**
  — all gated by `prefers-reduced-motion` + the settings toggle.
- [x] 🛠️ Responsive pass: mobile sidebar slide-over; hero/tiles reflow; move gesture → picker on touch;
  **no horizontal page scroll** anywhere; wide tables/code scroll inside their own container.
- [x] 🛠️ A11y: focus states, ARIA on modals/drawer/checkboxes, keyboard for nav + move picker, contrast.
- [x] ✅ Manual sweep at 360px / 768px / 1280px in both themes.

---

## Phase 10 — Verification & handoff
- [x] ✅ Drive the real app (per the **verify**/**run** skills): unlock → tick → move across days & a
  week boundary → check both figures → milestone flips → export → reset → import → confirm restore →
  lock. Do it for **both** roadmaps.
- [x] ✅ Reconciler test: remove/rename a task id in content, reload, confirm orphaned rows are pruned /
  aliased and totals stay truthful.
- [x] ✅ Confirm `.env`/`journey.sqlite` unreachable over HTTP; throttle escalation works end-to-end.
- [x] 🛠️ Write a short `README.md` (run command, add-a-roadmap steps, backup/export notes).
- [x] 🧠 Update DESIGN.md if any design detail changed during build; note follow-ups.

---

## Cross-cutting reminders
- ⚠️ **No `window.alert/confirm/prompt`** — every dialog/input is a custom modal.
- ⚠️ **Never seed the DB** — absence = default; the first tick/move creates the row.
- ⚠️ **Soft items and secondary objectives must not pollute primary progress** — keep the math paths
  separate and tested.
- ⚠️ **Stable ids forever** — reordering/relabeling is free; renaming an id needs an `aliases` entry.
- 🧠 **Be creative per roadmap** (hints, tryouts, see-alsos, "new/deprecated", project ideas) — but each
  addition must be correct, useful, and isolated so it can't affect other sections.
- 🔬 When authoring, cite **real page ranges / video indices+titles** (from Phase 1), not guesses.

---

## Suggested build order (dependency-aware)
`Phase 0 → 2 (backend) → 3 (shell/gate) → 4 (render) → 5 (engines) → 6 (settings/io)` gives a working
container with a fixture roadmap. Run **Phase 1 research in parallel** from the start; then `7` and `8`
author real content; finish with `9` polish and `10` verify.

---

## Build status & verification

**Shipped files:** `router.php`, `sync.php`, `index.php`, `assets/css/{theme,shell,roadmap}.css`,
`assets/js/{app,registry,reconcile,render,stats,moves,sync,store,ui,util}.js`,
`roadmaps/{_index,rust-fastapi,interp-go}.js` (+ `_fixture.js` kept for regression, not registered),
`.env`/`.env.example`/`.gitignore`, `README.md`, `roadmaps/_research.md` (gitignored).

**Automated checks that passed (all green):**
- **Backend (curl):** server serves `index.php` at `/`; `/.env`, `/journey.sqlite`, `/*.md` → 404;
  `status` unauthed; `load`/`save` 401 without a session; login wrong→right; **escalating throttle**
  (5 wrong → 60s lock, correct secret refused while locked); **empty-overwrite guard** keeps data;
  incremental save + `value:null` row-delete; per-roadmap `load`.
- **Content validation (node):** `validateAll()` → **0 problems** for both roadmaps
  (rust-fastapi: 24 days / 8 milestones / 43 primary tasks; interp-go: 44 days / 12 milestones /
  94 primary + 9 secondary, secondary excluded from primary rollups).
- **Dual progress (node):** the **DESIGN §10.2 worked-example table reproduced exactly** (all rows,
  incl. Wed *original* rising to 4/5 when W4 is finished on Thursday).
- **Reconciler (node):** orphaned task/`done_at`/`move`/`soft` rows pruned; notes & valid rows kept;
  `aliases` renames migrated.
- **Browser E2E (headless Chrome, 29 assertions):** unlock; two roadmaps in sidebar; dual bars;
  day cards; tick; secondary muted meter; category chips; hint/tryout/callout soft items;
  **move across a week boundary**; **return-to-origin re-agrees** both figures; reset; **export→import
  round-trips exactly** (ticks + soft); **tick persisted to SQLite** via `sync.php`; settings drawer
  (theme/accent/**per-roadmap reset**/reset-all/lock-now).
- **Responsive/theme (headless Chrome):** no horizontal page scroll at 360 / 768 / 1280; light/dark
  parity; mobile slide-over sidebar + topbar; screenshots captured.

**Two additions made during the post-build review (to fully satisfy the plan):**
1. **Load-time reconciler** (`assets/js/reconcile.js`, DESIGN §7.4) — applies id `aliases` and prunes
   orphaned rows on boot so counts stay truthful and the DB doesn't drift. (Was specified in §7.4 /
   Phase 10 but not yet wired.)
2. **Per-roadmap reset** — the store supported it; added the settings-drawer control + confirm modal +
   server stash (DESIGN §5.6 / Phase 6).

**Manual run:** `php -S localhost:8000 router.php`, open `http://localhost:8000`, unlock with the
project secret `whatevertheFx`.
