# scratchpad/cap4 — the "make it doable" pass (2026-09-25)

The owner tried to follow the plan and couldn't: too much material per day, and estimates
that hid how much. This directory re-prices the content honestly, splits it at its own
seams, and re-flows all four roadmaps over a longer calendar.

**Running any of this is optional.** The app only ever reads `public/roadmaps/*.js`, which
are committed. This is the tooling that produced them, kept in the repo so the next
re-plan starts from something real instead of being redone by hand.

## The pipeline

    cap3/orig/*.js          the PRE-cap roadmap files (git 4c7e500) — never edited
        │  reprice.mjs  ← edits/*.json (written by edits_*.py)
        ▼
    pub/roadmaps/*.js       same content, honest minutes, split leaves, + bedrock's library
        │  engine.mjs
        ▼
    plan.json               which card lands on which date, and what it holds
        │  builder.mjs  ← overrides.json (written by make_overrides.py)
        ▼
    public/roadmaps/*.js    the live files

## The decisions, and where they live

| file | what it holds |
|---|---|
| `edits_bedrock.py` | one source per leaf, honest minutes for the pages it really is |
| `edits_raylib.py` | Nature of Code / Book of Shaders split at their section boundaries |
| `edits_main.py` | by-kind re-pricing for the two mandatory roadmaps, plus a few splits |
| `edits_library.py` | bedrock's source library: title, author, edition, free?, where to get it |
| `make_overrides.py` | the header note each file needs, and the prose the re-flow made false |

Week titles are **derived** by the builder from the days each week opens. Hand-merged week
titles have twice ended up citing chapters their week no longer held.

## Checks

| command | proves |
|---|---|
| `node preserve.mjs` | the re-pricing lost nothing: structure, links, recall cards, explainers; minutes only rose |
| `node check.mjs` | the build lost nothing: same content, same order, every carried task points at its origin |
| `node validate.mjs` | the live files load, validate, and no date passes the 180-min ceiling |
| `node claims.mjs` | prose that describes a card's SIZE, printed next to that card's real load |

`tests/schedule.test.mjs` and the date anchors in `tests/content.test.mjs` hold the same
invariants as a real test, so a future re-plan that breaks one goes red in the suite.
