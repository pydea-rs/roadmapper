#!/usr/bin/env python3
# make_overrides.py — writes overrides.json for builder.mjs: the header note each roadmap
# file needs after this pass, the cadence/day-count claims that the re-flow made false,
# and the interlude comment whose day range moved. Week titles are DERIVED by the builder
# (see derivedTitle) — hand-merged week titles have twice ended up citing chapters their
# week no longer held, so they are not written here.
import json, os
H = os.path.dirname(os.path.abspath(__file__))
pub = lambda s: open(f'{H}/pub/roadmaps/{s}.js').read()

def stale_block(s):
    """Everything from the first 2026-09-13 note to the import — all superseded."""
    t = pub(s)
    return t[t.index('// REALISTIC RE-ESTIMATE'):t.index('\n\nimport { registerRoadmap }')]

COMMON = '''// MAKE-IT-DOABLE PASS (2026-09-25) — the owner tried to follow the plan and could not:
// the volume per day was beyond a normal day's work, and the estimates hid it. This pass
// supersedes the 2026-09-13 re-estimate and the 3-hour-cap re-plan that followed it.
//  1. RE-PRICED, again and honestly. The 2026-09-13 pass multiplied the old numbers by
//     kind; the numbers it multiplied were still the length of the MATERIAL. A 43-page
//     chapter priced at 50 minutes stays wrong however it is scaled. Required work
//     across all four roadmaps: 480h → 600h. Nothing was added; the hours were always
//     there, unwritten.
//  2. SPLIT, at the material's own seams. No leaf bundles two documents any more, and
//     a long chapter is read across two sittings at a named section boundary — never by
//     halving a number, always re-estimated as its own session.
//  3. RE-FLOWED under two ceilings, not one: the shared 180 min/date across all
//     roadmaps (unchanged), AND a new per-CARD ceiling, so one session holds one or two
//     items and the rest is passed along (`carried: "dNN"`) to the roadmap's next card.
//     Cards that hold only passed-along work are titled "… (cont.)"; a task split across
//     cards is suffixed "(1/2)".
//  4. EXTENDED. The owner first allowed up to +5/+8/+8/+13 weeks, then — shown that an
//     honest re-price outgrows that — chose eight weeks beyond those limits. Result: the
//     busiest stretch averages ~2h/day against the 3h ceiling, where the plan it replaces
//     really wanted ~3h every day while claiming 2.
//  5. RE-DATED. Day 1 is **2026-09-23**, moved there by the owner on 2026-09-25 so that
//     a fresh start (old database deleted) opens with nothing already overdue. All four
//     roadmaps share one week frame: week i starts 2026-09-23 + 7i.
// Day ids were renumbered and milestones/interludes re-anchored (no DB backward
// compatibility needed); day/week references inside the content point at the new ids.
// Ids quoted in the dated notes ABOVE use their own day's numbering.
// The re-pricer, planner and file builder live in scratchpad/cap4/.
'''

TAIL = {
 'rust-fastapi': '''// For this file: 98 → 147 cards, 34 → 48 weeks, 2026-09-23 → 2027-08-24. Required work
// 106.7h → 185.3h. 3 cards a week, 4 in the closing weeks; 91 tasks carried, 49
// continuation cards, 66 split parts.''',
 'interp-go': '''// For this file: 88 → 147 cards, 22 → 40 weeks, 2026-09-23 → 2027-06-28. Required work
// 141.6h → 185.8h. 3–4 cards a week; 74 tasks carried, 59 continuation cards, 69 split
// parts.''',
 'bedrock': '''// For this file: 97 → 134 cards, 32 → 48 weeks, 2026-09-24 → 2027-08-24. Required work
// 132.3h → 147.2h — a smaller rise than the other roadmaps because the fix here was
// mostly SPLITTING: 203 reading leaves became 289, one source each. 2–3 cards a week;
// 49 tasks carried, 37 continuation cards, 91 split parts.
// This file also gained a `library:` — every book, paper, spec and docs set it reads
// from, with author, edition, whether it is free and where to get it. A day card's
// right-click menu has a "Reading list — sources" entry that groups that card's work by
// the source it comes from (DESIGN §7.6). Bedrock is the only roadmap that has one.''',
 'raylib': '''// For this file: 54 → 80 cards, 19 → 40 weeks, 2026-09-24 → 2027-06-29. Required work
// 69.8h → 82.3h. 2 cards a week; 33 tasks carried, 26 continuation cards, 64 split
// parts. The owner's own example drove this one: a Nature of Code chapter was read AND
// practised AND ported in a single task on a single day. Each chapter is now split at
// its section boundaries, and the p5.js exercises and the raylib port are separate
// sittings that the planner is free to place on separate cards.''',
}

O = {s: {'replace': [[stale_block(s), COMMON + TAIL[s]]]} for s in TAIL}

# --- cadence and day-count claims the re-flow made false ---
FIX = {
 'rust-fastapi': [
   ('// rust-fastapi.js — Roadmap 1 (priority HIGH, 2–5 active days/week: 4–5 through the\n'
    '// two-book core in w1–w7, then 2 across the RWP arc — 3 in the lighter weeks).',
    '// rust-fastapi.js — Roadmap 1 (priority HIGH, 3 active days/week, 4 in the closing\n'
    '// weeks).'),
   ('cadence: { activeDaysPerWeek: [2, 4] },', 'cadence: { activeDaysPerWeek: [3, 4] },'),
 ],
 'interp-go': [
   ('// interp-go.js — Roadmap 2 (priority MEDIUM, 4 active days/week).',
    '// interp-go.js — Roadmap 2 (priority MEDIUM, 3–4 active days/week).'),
   ('cadence: { activeDaysPerWeek: [4] },', 'cadence: { activeDaysPerWeek: [3, 4] },'),
 ],
 'bedrock': [
   ('// Cadence: 2–3 focused side-days per week (a few weeks take 4), on weekdays that\n'
    '// change from week to week — see the 2026-09-13 re-plan note — one ~60–125 min task\n'
    '// each, alongside the main roadmaps.',
    '// Cadence: 2–3 focused side-days per week, on weekdays that change from week to week\n'
    '// — see the 2026-09-25 note — one ~40–95 min card each, alongside the main roadmaps.'),
   ('cadence: { activeDaysPerWeek: [2, 4] },', 'cadence: { activeDaysPerWeek: [2, 3] },'),
 ],
 'raylib': [
   ('// Cadence: 3 side-days/week (w5 takes 2, the capstone week 1), on weekdays that change\n'
    '// from week to week and are chosen so the combined day across all roadmaps stays\n'
    '// light — see the 2026-09-13 re-plan note. One ~60–110 min task each.',
    '// Cadence: 2 side-days/week, on weekdays that change from week to week and are chosen\n'
    '// so the combined day across all roadmaps stays light — see the 2026-09-25 note.\n'
    '// One ~40–95 min card each.'),
   ('cadence: { activeDaysPerWeek: [2, 3] },', 'cadence: { activeDaysPerWeek: [2] },'),
 ],
}
for s, pairs in FIX.items():
    O[s]['replace'].extend([list(p) for p in pairs])

# --- prose that the re-flow made false ---
# `notes` are keyed by the NEW card id, so they must be re-read after any re-plan
# (`node claims.mjs` lists every size claim next to its card's real load).
O['rust-fastapi']['notes'] = {
  'd58': 'Kickoff — three sessions a week from here to the end of the 3rd edition, each one card long.',
  'd109': 'Checkpoint day — no new material, but the card is a full session of consolidation.',
  'd113': 'Buffer day — deliberately the lightest card of the arc.',
}
O['interp-go']['notes'] = {
  'd22': 'A full reading session — the SnippetBox skeleton is the week\'s anchor.',
  'd83': 'Split day 1 of the longest chapter — capture today, closing-over-the-stack on d85.',
}
O['bedrock']['notes'] = {
  'd14': 'The first week where all four threads are in motion at once — Networking + DevOps + Systems + DB.',
}
O['rust-fastapi']['replace'].extend([
  ['🔗 Nothing new today by design — a light week keeps the 4-month pace sustainable.',
   '🔗 Nothing new today by design — a light week keeps the four-and-a-half-month RWP run sustainable.'],
  ['Deliberate slack — the shock absorber for the 4-month run.',
   'Deliberate slack — the shock absorber for the four-and-a-half-month run.'],
])
O['raylib']['replace'].extend([
  ['🌌 The "Big Bang" side track begins. 2–3 short days a week, one focus each',
   '🌌 The "Big Bang" side track begins. Two short days a week, one focus each'],
  ['💡 Three side-days a week, on different weekdays each week',
   '💡 Two side-days a week, on different weekdays each week'],
])

# --- interludes: the RWP extension block moved with the renumbering ---
O['interludesReplace'] = [[
  '/* ---- Rust Web Programming extension (d33–d98): go-beyond cards at concept',
  '/* ---- Rust Web Programming extension (d58–d147): go-beyond cards at concept',
]]

if __name__ == '__main__':
    json.dump(O, open(f'{H}/overrides.json', 'w'), indent=1, ensure_ascii=False)
    print("overrides.json:", ", ".join(f"{k} {len(v.get('replace', []))} replace" for k, v in O.items() if isinstance(v, dict)))
