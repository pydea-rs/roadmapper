# make_overrides.py — writes overrides.json for builder.mjs: hand-written week titles, week
# section comments, the new header notes and the few prose edits the new calendar needs.
# Titles were written from `node list.mjs <slug>` against the current plan.json — if the
# plan is ever re-run and a week's days change, re-read that listing and fix the titles.
import json, os
H = os.path.dirname(os.path.abspath(__file__))
orig = lambda s: open(f'{H}/orig/public/roadmaps/{s}.js').read()
def replan_block(s):
    t = orig(s); return t[t.index('// RE-PLAN (2026-09-13)'):t.index('\n\nimport { registerRoadmap }')]

COMMON = '''// 3-HOUR CAP RE-PLAN (2026-09-13) — the calendar of ALL FOUR roadmaps, rebuilt again
// the same day after the owner read the Horizon view's daily totals. It replaces the
// earlier 4–6h re-plan (which had itself replaced two passes that misread 4–6h as a
// target to fill).
//  - Every roadmap RESTARTED on 2026-09-13, on one shared week frame (week i starts
//    2026-09-13 + 7i).
//  - The REQUIRED minutes of all roadmaps on one date add up to at most 3h (180 min) —
//    a ceiling, never a target. The owner allowed a few 4h days and up to ~1 month of
//    extension per roadmap (2 in special cases); the plan needed no 4h day at all.
//  - When a date would pass the cap, tasks are PASSED ALONG, in order, into the
//    roadmap's next card, ahead of that card's own tasks, and marked `carried: "dNN"`
//    so the card shows where each one came from. A card whose own tasks all moved on
//    is titled "… (cont.)". A task too big to share its date is split at a sub-task
//    boundary into "(1/2)" / "(2/2)" — main roadmaps only; the side tracks were planned
//    around it so every task keeps its recall cards. Nothing was cut or reworded.
//  - Days per week follow the authored phase of the content, weekdays change from
//    week to week, and no roadmap goes more than a week without a session.
// Day ids were renumbered where cards were added, and milestones/interludes re-anchored
// (no DB backward compatibility needed); day and week references inside the content
// point at the new ids. Ids quoted in the dated notes ABOVE use their own day's
// numbering. The planner and file builder live in scratchpad/cap3/.
'''
TAIL = {
 'rust-fastapi': '''// For this file: 98 → 103 days, 34 → 35 weeks, 2026-09-13 → 2027-05-12 (was 2026-09-04 →
// 2027-04-24). The two-book core runs 5 cards a week in w1–w5 and 4 in w6–w8; the RWP arc
// 2 a week from w9, taking a 3rd in the light weeks from late January (w21) on. 24 tasks
// carried, 5 continuation cards, 2 tasks split.''',
 'interp-go': '''// For this file: 88 → 96 days, 22 → 24 weeks, 2026-09-14 → 2027-02-27 (was 2026-09-04
// → 2027-02-03). 4 days in every week; 25 tasks carried, 8 continuation cards, 5 tasks
// split.''',
 'bedrock': '''// For this file: still 97 days / 32 weeks, each week holding the same side-days it was
// authored with; 2026-09-14 → 2027-04-24 (was 2026-09-07 → 2027-04-12). One task is
// carried (d71's "Compiler lens" into d72), none split. The 9 inline `dow:` labels and
// the two extension "Dates X → Y" ranges were recomputed.''',
 'raylib': '''// For this file: still 54 days / 19 weeks, each week holding the same side-days it was
// authored with; 2026-09-13 → 2027-01-18 (was 2026-09-05 → 2027-01-08). Nothing needed
// carrying or splitting.''',
}

O = {s: {'replace': [[replan_block(s), COMMON + TAIL[s]]]} for s in TAIL}

O['rust-fastapi']['weekComments'] = {
  'w9': '/* ---- RWP extension (Rust Web Programming, 3rd ed.) — weeks 9–27 ---- */',
  'w27': '/* ---- RWP Part B (2nd-ed Ch9–18) — weeks 27–35 (w27 opens with the 3rd-ed retro & buffer) ---- */',
}
O['rust-fastapi']['weeks'] = {f'w{i+1}': f'Week {i+1} — {t}' for i, t in enumerate([
  'Smart pointers, concurrency & DB foundations',
  'Project structure, OOP, security & patterns',
  'Dependencies & advanced Rust',
  'Testing & the web-server arc',
  'Finish the server; deploy FastAPI; the capstone begins',
  'Capstone & checkpoint',
  'Async Rust (Ch17), shipping the capstone & a buffer',
  'Integration capstone & retro',
  'RWP: setup & the Ch1 Rust review (Ch1)',
  'RWP: finishing the Ch1 review, then traits & macros (Ch1–2)',
  'RWP: app design & Cargo (Ch2–3)',
  'RWP: nanoservices & the DAL (Ch3)',
  'RWP: foundations checkpoint + Async (Ch4)',
  'RWP: tokio/Hyper & serving HTTP (Ch4–5)',
  'RWP: processing requests (Ch5–6)',
  'RWP: full CRUD + backend checkpoint (Ch6)',
  'RWP: a browser frontend (Ch7)',
  'RWP: styling & Rust-in-WASM (Ch7–8)',
  'RWP: WASM kernel & client (Ch8)',
  'RWP: full-stack checkpoint & PostgreSQL (Ch9)',
  'RWP: SQLx, migrations & the persistence checkpoint (Ch9)',
  'RWP: the auth server, users & JWT (Ch10)',
  'RWP: login, then server-to-server comms (Ch10–11)',
  'RWP: caching with Redis (Ch12)',
  'RWP: the cache kernel & logging (Ch12–13)',
  'RWP: the stack checkpoint & capstone — run & harden',
  'RWP: retro & buffer, then Part B — unit tests (2nd-ed Ch9)',
  'RWP Part B — a test pipeline & Docker images (Ch9–10)',
  'RWP Part B — Terraform, AWS & local HTTPS (Ch10–11)',
  'RWP Part B — HTTPS on AWS, the deploy checkpoint & a clean repo (Ch11, Ch13)',
  'RWP Part B — CI, then Rocket (Ch13, Ch12)',
  'RWP Part B — Tokio, actors & TCP (Ch14–15)',
  'RWP Part B — actors over TCP & protocol framing (Ch15–16)',
  'RWP Part B — Hyper actors & a Redis task queue (Ch17–18)',
  'RWP Part B — the task queue & the two-book capstone (Ch18)',
])}
O['interp-go']['weeks'] = {f'w{i+1}': f'Week {i+1} — {t}' for i, t in enumerate([
  'CI Ch9; Go: Templates (videos 27–36)',
  'Go: Templates (videos 27–36); CI Ch10',
  'CI Ch11; Go: Code Org & MVC (videos 37–54)',
  'Go: Code Org & MVC (videos 37–54); CI Ch12',
  "CI Ch12; Let's Go: read chunk 1 + starter; CI Ch13 (jlox done!)",
  'Go: Signup & REST (videos 55–62); CI Ch14',
  'CI Ch15; Go: Databases (videos 63–89)',
  'Go: Databases (videos 63–89); CI Ch16',
  'CI Ch17; CI Ch18',
  "CI Ch19; Let's Go: read chunk 2 + Go forms tryout",
  'Go: Passwords & bcrypt (videos 90–106); CI Ch20; CI Ch21 begins',
  'CI Ch21; Go: SQL relations & migrations (videos 138–155); CI Ch22 begins',
  'CI Ch22; CI Ch23; Go: Cookies, Sessions & CSRF (videos 107–137)',
  'Go: Cookies, Sessions & CSRF (videos 107–137); CI Ch24',
  'CI Ch25; CI Ch26 begins (garbage collection)',
  'CI Ch26; CI Ch27',
  'CI Ch28; Go: Password reset & email (videos 165–194)',
  'CI Ch29; CI Ch30 → 🎉 CI done',
  'Monkey Ch1 — Lexing (secondary); Go: Galleries CRUD (videos 195–217); Monkey Ch2 begins',
  "Monkey Ch2 — Parsing (secondary); Let's Go: read chunk 4 (auth + testing); Go: Images & config (videos 218–248)",
  'Monkey Ch3 — Evaluation (secondary); Go: Deployment (videos 249–263)',
  "Go: OAuth & finish → 🎉 course DONE; Monkey Ch4 + extend it (secondary); Let's Go exercises",
  'Checkpoint & catch-up; Writing a Compiler in Go — the bridge (secondary)',
  'Go: production hardening; Capstone — a Monkey web playground; grand retro',
])}
# bedrock: w24 holds its authored days (d71's Compiler lens is merely carried within reach)
O['bedrock']['weeks'] = {'w24': 'Week 24 — Firedancer, the C++ memory model & streams'}
O['bedrock']['weekComments'] = {
  'w13': '// ---- Extension: "deepen your knowledge" — under-the-hood internals ----',
  'w26': '// ---- Extension II: "the cool internals" — data structures & runtime under the hood ----',
  'w30': '// ---- Extension III: "how the languages are built" — compilers & interpreters ----',
}
O['raylib']['replace'].append(["finishes ~4 weeks sooner (Jan 8).", "finishes ~4 weeks sooner (Jan 8 then; Jan 18\n  // since the 3-hour cap re-plan)."])
O['bedrock']['replace'].append(["// Cadence: 2–3 focused side-days per week (a few weeks take 4), on weekdays that\n// change from week to week — see the 2026-09-13 re-plan note —",
                                "// Cadence: 2–3 focused side-days per week (a few weeks take 4), on weekdays that\n// change from week to week — see the 3-hour cap re-plan note —"])
O['raylib']['replace'].append(["light — see the 2026-09-13 re-plan note.", "light — see the 3-hour cap re-plan note."])
O['rust-fastapi']['replace'] += [
 ["// rust-fastapi.js — Roadmap 1 (priority HIGH, 2–5 active days/week: 4–5 through the\n// two-book core in w1–w7, then 2 across the RWP arc — 3 in the lighter weeks).",
  "// rust-fastapi.js — Roadmap 1 (priority HIGH, 2–5 active days/week: 4–5 through the\n// two-book core in w1–w8, then 2 across the RWP arc — 3 in the lighter weeks)."],
 ["Added as weeks w8–w26 / days d33–d74 at a\n// gentle 2 sessions/week (3 in the lighter weeks — see the 2026-09-13 re-plan note\n// below), starting 2026-10-26 and finishing 2027-02-26 (~4 months). The original\n// 32 days (d01–d32) are UNCHANGED — this is a pure append.",
  "Appended after the two-book core at a\n// gentle 2 sessions/week (3 in the lighter weeks), ~4 months — a pure append that\n// left the core untouched (now days d38–d79, weeks 9–27; see the 3-hour cap re-plan\n// note below)."],
 ["Appended as weeks w26–w34 / days d75–d98 at 3/week,\n// 2027-02-28 → 2027-04-24.",
  "Appended after it (now days d80–d103, weeks\n// 27–35, 2027-03-20 → 2027-05-12)."],
 ["interp-go (ends 2027-02-03) and raylib (2027-01-08) are done", "interp-go (ends 2027-02-27) and raylib (2027-01-18) are done"],
]
O['interp-go']['replace'] += [
 ["Now 88 days / 22 weeks, finishing 2027-02-03 (was 56d/16w, 2026-11-19).", "That pass made it 88 days / 22 weeks (was 56d/16w, finishing 2026-11-19)."],
]
# notes whose claim about the day stopped being true once carried-over work landed on it
# (keyed by the NEW card id — these depend on plan.json)
O['rust-fastapi']['notes'] = {
  'd06': "Wraps up the opening block — smart pointers done, the FastAPI DB layer + structure in place.",
  'd11': "The FastAPI part is short — the rest of the day finishes Patterns & matching, carried over from d10.",
  'd19': "One of the heaviest Rust sections — its reading today; the ThreadPool build is carried into the next session (d20).",
  'd20': "The FastAPI part is deliberately light — the thread-pool build carried over from d19 fills the rest of the day.",
  'd33': "Buffer day — nothing of its own is required; the async-server work carried over from d32 comes first, then close any gaps.",
  'd38': "Kickoff — the pace stays gentle (2 sessions/week), taking a 3rd session in lighter weeks: a few in February, then every week once interp-go ends at the end of February.",
}
O['rust-fastapi']['replace'].append([
  "🔗 Nothing due today by design. A plan with zero slack",
  "🔗 Nothing new is due today by design — here it absorbs the async-server work carried over from d32. A plan with zero slack"])
json.dump(O, open(f'{H}/overrides.json', 'w'), ensure_ascii=False, indent=1)
print('overrides.json written')
