# Roadmaps

A self-hosted, single-owner web app for **designing personal roadmaps and finishing the work in
them**. One cohesive app holds many hand-authored roadmaps (each a day-by-day plan); the app tracks
your progress, weekly milestones, moveable tasks, dual *actual/original* progress, and a live
finish-date projection. Static content lives in code; only your progress is saved (to SQLite).

See [DESIGN.md](DESIGN.md) for the full design and [TASKS.md](TASKS.md) for the build plan.

---

## Running it

Requires **PHP 8+** (uses PDO SQLite, bundled with PHP). No build step, no npm.

```bash
# 1. Create your .env from the template and set the secret's bcrypt hash:
cp .env.example .env
php -r 'echo password_hash("whatevertheFx", PASSWORD_DEFAULT), "\n";'   # paste into JOURNEY_PASSWORD_HASH=

# 2. Start the server (router.php blocks .env / *.sqlite / dotfiles from being served):
php -S localhost:8000 router.php

# 3. Open http://localhost:8000 and unlock with your secret.
```

The default secret for this project is **`whatevertheFx`** (change it by regenerating the hash).
A successful unlock lasts `SESSION_EXPIRY_DAYS` (default 7). Five wrong tries → a 1-minute lockout,
five more → 2 minutes, and so on (server-side, per client).

`journey.sqlite` is created automatically on first save. It, `.env`, and `.sessions/` are all
gitignored and never served over HTTP.

---

## Adding a roadmap

Roadmaps are **code, not database rows** — there is nothing to seed (absence of a row = the default
state). To add one:

1. Create `roadmaps/<slug>.js`:
   ```js
   import { registerRoadmap } from "../assets/js/registry.js";
   registerRoadmap({
     slug: "my-roadmap",
     title: "My Roadmap",
     icon: "🚀",
     objectives: [{ id: "main", title: "Main goal", tier: "primary" }],
     weeks: [{ id: "w1", title: "Week 1", start: "2026-07-14" }],
     days: [
       { id: "d01", date: "2026-07-14", week: "w1", title: "Day one",
         tasks: [{ id: "t1", obj: "main", cat: "read", est: 30, label: "Read chapter 1." }] },
     ],
     milestones: [{ id: "w1.m1", week: "w1", title: "Finish ch.1",
                    rule: { type: "tasks", require: ["d01.t1"] } }],
   });
   ```
2. Register it in `roadmaps/_index.js`:  `import "./my-roadmap.js";`
3. Reload. The boot validator checks id uniqueness, dates, and references; problems show in a dev
   banner. Nothing else to do.

**ID rules:** task/day/soft ids are namespaced per roadmap and must be **stable once used** — editing
a label or estimate is free (id unchanged → progress preserved); renaming an id needs an `aliases`
entry. See DESIGN §7.

See DESIGN §11 for the full day-content taxonomy (required / optional-bonus / soft hints & tryouts /
grouped tasks) and §14 for the authoring model.

---

## Backup & data

- **Per-roadmap export/import**: the ⬆/⬇ buttons on each roadmap's hero (scoped to that roadmap).
- **Whole-journey export/import**: in the settings drawer (the ⚙ floating button).
- Both produce/consume plain JSON. Imports stash a safety copy on the server first, then replace.
- The server refuses an *empty* snapshot over a populated journey (accident guard), keeping the last
  ~20 displaced snapshots in a `journey_stash` table.

To back up everything at the file level, copy `journey.sqlite` (stop the server first, or copy the
`.sqlite`, `.sqlite-wal`, `.sqlite-shm` together).

---

## Project layout

```
router.php          front controller; 404s .env / *.sqlite / dotfiles / *.md
index.php           app shell (HTML)
sync.php            SQLite persistence + auth + escalating login throttle
assets/css/         theme.css (tokens/themes) · shell.css (layout) · roadmap.css (content view)
assets/js/          app.js (bootstrap/routing) · registry.js (register+validate) · render.js
                    stats.js (dual progress, milestones, projection) · moves.js (task moves)
                    store.js (journey state) · sync.js (server mirror) · ui.js (modals/drawer/lock)
                    util.js (helpers)
roadmaps/           _index.js (registers each) + one module per roadmap
```

Data model, security, scheduling, and the actual/original progress semantics are all documented in
[DESIGN.md](DESIGN.md).
