#!/usr/bin/env python3
# edits_main.py — content decisions for the two mandatory roadmaps (2026-09-25).
# Both were already broken into small leaves by earlier passes, so almost nothing here
# needs splitting: what was wrong is the PRICE of each leaf. The multipliers are by kind
# and were sanity-checked against real material (a Rust Book section with its listings
# typed out is not 10 minutes; a Crafting Interpreters challenge is not 25).
import json, os, collections

GO = collections.OrderedDict()
GO["_rules"] = [
  {"cat": "read",      "mul": 1.35},   # CI / Let's Go sections, read with the code
  {"cat": "book",      "mul": 1.25},   # longer book chunks, already priced nearer reality
  {"cat": "code",      "mul": 1.35},   # typing a chapter's implementation in, and debugging it
  {"cat": "challenge", "mul": 1.55},   # CI challenges are open-ended design work
  {"cat": "watch",     "mul": 1.15},   # runtime-based already; this is the note-taking margin
  {"cat": "review",    "mul": 1.2},
  {"cat": "project",   "mul": 1.3},
  {"cat": "exercise",  "mul": 1.3},
  {"cat": "prep",      "mul": 1.2},
]

RS = collections.OrderedDict()
RS["_rules"] = [
  {"cat": "read",      "mul": 1.4},    # Rust Book sections, listings typed out
  {"cat": "code",      "mul": 1.3},
  {"cat": "api",       "mul": 1.3},    # FastAPI build steps
  {"cat": "project",   "mul": 1.3},
  {"cat": "challenge", "mul": 1.4},
  {"cat": "review",    "mul": 1.2},
  {"cat": "alt",       "mul": 1.3},
]

# ---- the few leaves that are still a whole sitting and a half after re-pricing ----
Q = chr(34)
def split(D, leaf, *parts): D[leaf] = {"split": [dict(p) for p in parts]}
def P(est, label, **kw): return dict(est=est, label=label, **kw)
A = lambda url, text: f'<a href="{url}" target="_blank" rel="noopener">{text}</a>'

split(RS, "d10.t1.s1",
  P(35, f'Ch20.1 {A("https://doc.rust-lang.org/stable/book/ch20-01-unsafe-rust.html", "Unsafe Rust")} — the five unsafe superpowers, and dereferencing raw pointers.'),
  P(30, 'Ch20.1 (continued) — calling <code>unsafe</code> functions, <code>extern</code> blocks, mutable statics and unsafe traits.'))

# Let's Go is read in ~75-page chunks; a chunk is two sittings, at its own chapter seam.
split(GO, "d13.t1.s1",
  P(35, f'<b>Mandatory read — <i>Let’s Go</i> pp 11–50</b>, Ch2 Foundations: project setup, routing, and the handler signature.'),
  P(35, '<b><i>Let’s Go</i> pp 50–85</b> — the rest of Ch2 Foundations: <code>http.Server</code>, URL query strings, and HTML templating.'))
split(GO, "d13.t1.s2",
  P(35, 'Ch3 config & structured logging: command-line flags, dependency injection into handlers.'),
  P(35, 'Ch3 (continued) — centralised error handling, and the runnable SnippetBox skeleton.'))
split(GO, "d31.t1.s1",
  P(35, f'<b>Mandatory read — <i>Let’s Go</i> pp 86–125</b>, Ch4 DB layer: MySQL setup, the driver, and a first query.'),
  P(35, '<b><i>Let’s Go</i> pp 125–161</b> — the rest of Ch4: single-record and multi-record queries, and transactions.'))
split(GO, "d31.t1.s2",
  P(35, 'Ch5 dynamic templates: passing data in, and the template cache.'),
  P(35, 'Ch5 (continued) — template functions, and rendering live data safely.'))
split(GO, "d22.t2",
  P(35, '<b>Review Calhoun Ch9</b> (PDF pp 261–303) alongside the videos.'),
  P(35, '<b>Review Calhoun Ch10</b> (PDF pp 304–346).'))
split(GO, "d45.t2",
  P(35, '<b>Review Calhoun Ch13</b> (PDF pp 401–465).'),
  P(35, '<b>Review Calhoun Ch14</b> (PDF pp 466–528).'))
split(GO, "d23.t2",
  P(40, 'Implement <code>scanner.c</code>: the token struct, the character cursor, and single-character tokens.'),
  P(40, 'Finish <code>scanner.c</code>: literals, identifiers/keywords, and the pull interface the compiler calls one token at a time.'))
split(GO, "d60.t2",
  P(35, f'<b>Companion (Calhoun ends at v164):</b> read <i>Let’s Go</i> Ch9 pp 225–234 — sessions: the manager, and putting data in.'),
  P(30, '<i>Let’s Go</i> Ch9 pp 234–241 — the flash-message pattern, end to end.'))
split(GO, "d67.t2",
  P(35, f'<b>Companion:</b> <i>Let’s Go</i> Ch8 pp 193–208 — parsing a form, and the POST handler.'),
  P(30, '<i>Let’s Go</i> Ch8 pp 208–224 — validation done idiomatically, and re-displaying a form with errors.'))
split(GO, "d79.t1.s1",
  P(40, f'<b>Secondary capstone:</b> pick the feature Ball leaves out (a <code>while</code> loop, a standard-library function, or postfix operators) and design it — grammar, AST node, and where it hooks in.'),
  P(40, 'Implement that feature end to end: parser, evaluator, and a couple of Monkey programs that exercise it.'))
split(GO, "d85.t1",
  P(35, 'Pick <b>one</b> — (a) structured request logging + a <code>/healthz</code>; (b) per-IP rate limiting middleware; or (c) graceful shutdown on SIGTERM with in-flight request draining — and design it against your Calhoun/SnippetBox app.'),
  P(35, 'Implement it properly: wire it into the middleware chain / server lifecycle.'),
  P(35, 'Prove it: a test or a manual run that shows the behaviour, plus the failure case.'))

if __name__ == "__main__":
    d = os.path.dirname(__file__)
    json.dump(GO, open(os.path.join(d, "edits/interp-go.json"), "w"), indent=1, ensure_ascii=False)
    json.dump(RS, open(os.path.join(d, "edits/rust-fastapi.json"), "w"), indent=1, ensure_ascii=False)
    print("interp-go + rust-fastapi by-kind rules written")
