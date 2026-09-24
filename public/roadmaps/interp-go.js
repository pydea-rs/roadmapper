// interp-go.js — Roadmap 2 (priority MEDIUM, 3–4 active days/week).
// PRIMARY: `ci` (Crafting Interpreters, resume Ch9/PDF133 — front-loaded so it
// finishes sooner) and `go` (Go web-dev video course, resume video 27, paired
// with Calhoun's book which ends at v164, then Let's Go). SECONDARY: `gointerp`
// (Writing an Interpreter in Go — separate meter, never gates primary).
// Phases: A = CI + Go (+ light gointerp see-alsos); B = gointerp activates
// alongside Go; C = appended tail finishes gointerp. Pages are real (see
// _research.md). Owner does ALL Crafting Interpreters challenges.
//
// RE-PACED (2026-07-27): the roadmap was too heavy per day alongside the other
// roadmaps, so every day was capped at ~95m and the content re-flowed across
// MORE, lighter days (avg ~66m, was ~104m). Nothing was cut — each original day's
// whole tasks are redistributed intact (references verbatim); heavy chapter-days
// simply split at task boundaries into "(1/2)" read+code then "(2/2)" challenges,
// exactly like the older split pattern. Cadence is a steady 4 days/week; WHICH
// weekdays changes from week to week (see the 2026-09-13 re-plan note below).
// Now 88 days / 22 weeks, finishing 2027-02-03 (was 56d/16w, 2026-11-19). Day &
// week ids were renumbered (no DB / backward-compat needed); milestones and the
// between-day interludes were re-anchored to the equivalent new days.

// MAKE-IT-DOABLE PASS (2026-09-25) — the owner tried to follow the plan and could not:
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
// For this file: 88 → 147 cards, 22 → 40 weeks, 2026-09-23 → 2027-06-28. Required work
// 141.6h → 185.8h. 3–4 cards a week; 74 tasks carried, 59 continuation cards, 69 split
// parts.

import { registerRoadmap } from "../assets/js/registry.js";

const CI = "ci", GO = "go", GX = "gointerp";

registerRoadmap({
  slug: "interp-go",
  title: "Interpreters & Go",
  icon: "🧩",
  subtitle: "Finish Crafting Interpreters (all challenges) + the Go web-dev course; then Writing an Interpreter in Go.",
  accent: "#00add8",
  schemaVersion: 1,
  cadence: { activeDaysPerWeek: [3, 4] },

  objectives: [
    { id: CI, title: "Crafting Interpreters", tier: "primary", weight: 1.2 },
    { id: GO, title: "Go Web Dev", tier: "primary", weight: 1 },
    { id: GX, title: "Writing an Interpreter in Go", tier: "secondary" },
  ],

  weeks: [
    { id: "w1", title: "Week 1 — CI Ch9 — Control Flow (jlox)", start: "2026-09-23" },
    { id: "w2", title: "Week 2 — Go — Templates (videos 27–36)", start: "2026-09-30" },
    { id: "w3", title: "Week 3 — Go — Templates (videos 27–36); CI Ch10 — Functions (jlox)", start: "2026-10-07" },
    { id: "w4", title: "Week 4 — CI Ch11 — Resolving & Binding (jlox)", start: "2026-10-14" },
    { id: "w5", title: "Week 5 — Go — Code Org & MVC (videos 37–54)", start: "2026-10-21" },
    { id: "w6", title: "Week 6 — CI Ch12 — Classes I (jlox); CI Ch12 — Classes II + challenges (jlox)", start: "2026-10-28" },
    { id: "w7", title: "Week 7 — Let's Go — read chunk 1 + starter; CI Ch13 — Inheritance (jlox done!)", start: "2026-11-04" },
    { id: "w8", title: "Week 8 — CI Ch13 — Inheritance (jlox done!); Go — Signup & REST (videos 55–62); …", start: "2026-11-11" },
    { id: "w9", title: "Week 9 — CI Ch14 — Chunks of Bytecode (clox); CI Ch15 — A Virtual Machine (clox)", start: "2026-11-18" },
    { id: "w10", title: "Week 10 — CI Ch15 — A Virtual Machine (clox); Go — Databases (videos 63–89)", start: "2026-11-25" },
    { id: "w11", title: "Week 11 — Go — Databases (videos 63–89)", start: "2026-12-02" },
    { id: "w12", title: "Week 12 — CI Ch16 — Scanning on Demand (clox); CI Ch17 — Compiling Expressions I (clox, Pratt)", start: "2026-12-09" },
    { id: "w13", title: "Week 13 — CI Ch17 — Pratt parser II + challenges (clox); CI Ch18 — Types of Values (clox)", start: "2026-12-16" },
    { id: "w14", title: "Week 14 — CI Ch18 — Types of Values (clox); CI Ch19 — Strings (clox)", start: "2026-12-23" },
    { id: "w15", title: "Week 15 — CI Ch19 — Strings (clox); Let's Go — read chunk 2 + Go forms tryout", start: "2026-12-30" },
    { id: "w16", title: "Week 16 — Calhoun Ch11–12 review + Go forms tryout; Go — Passwords & bcrypt (videos 90–106); …", start: "2027-01-06" },
    { id: "w17", title: "Week 17 — CI Ch20 — Hash Tables (clox); CI Ch21 — Global Variables (clox)", start: "2027-01-13" },
    { id: "w18", title: "Week 18 — CI Ch21 — Global Variables (clox); Go — SQL relations & migrations (videos 138–155)", start: "2027-01-20" },
    { id: "w19", title: "Week 19 — CI Ch22 — Local Variables (clox)", start: "2027-01-27" },
    { id: "w20", title: "Week 20 — CI Ch23 — Jumping Back and Forth (clox)", start: "2027-02-03" },
    { id: "w21", title: "Week 21 — Go — Cookies, Sessions & CSRF (videos 107–137)", start: "2027-02-10" },
    { id: "w22", title: "Week 22 — CI Ch24 — Calls and Functions I (clox); CI Ch24 — Calls II", start: "2027-02-17" },
    { id: "w23", title: "Week 23 — CI Ch24 — Calls II: natives + challenges (clox); CI Ch25 — Closures I (clox)", start: "2027-02-24" },
    { id: "w24", title: "Week 24 — CI Ch25 — Closures II; CI Ch26 — Garbage Collection I (clox)", start: "2027-03-03" },
    { id: "w25", title: "Week 25 — CI Ch26 — GC II: sweep + challenges (clox)", start: "2027-03-10" },
    { id: "w26", title: "Week 26 — CI Ch27 — Classes and Instances (clox); CI Ch28 — Methods & Initializers I (clox)", start: "2027-03-17" },
    { id: "w27", title: "Week 27 — CI Ch28 — Initializers + invoke opt + challenges", start: "2027-03-24" },
    { id: "w28", title: "Week 28 — Go — Password reset & email (videos 165–194)", start: "2027-03-31" },
    { id: "w29", title: "Week 29 — CI Ch29 — Superclasses (clox)", start: "2027-04-07" },
    { id: "w30", title: "Week 30 — CI Ch30 — Optimization → 🎉 CI DONE", start: "2027-04-14" },
    { id: "w31", title: "Week 31 — Monkey Ch1 — Lexing (secondary); Go — Galleries CRUD (videos 195–217)", start: "2027-04-21" },
    { id: "w32", title: "Week 32 — Go — Galleries CRUD (videos 195–217); Monkey Ch2 — Parsing (secondary, Pratt)", start: "2027-04-28" },
    { id: "w33", title: "Week 33 — Let's Go — read chunk 4 (auth + testing); Go — Images & config (videos 218–248)", start: "2027-05-05" },
    { id: "w34", title: "Week 34 — Go — Images & config (videos 218–248); Monkey Ch3 — Evaluation (secondary)", start: "2027-05-12" },
    { id: "w35", title: "Week 35 — Monkey Ch3 — Evaluation (secondary); Go — Deployment (videos 249–263)", start: "2027-05-19" },
    { id: "w36", title: "Week 36 — Go — Deployment (videos 249–263); Go — OAuth & finish → 🎉 course DONE; …", start: "2027-05-26" },
    { id: "w37", title: "Week 37 — Monkey — extend it (secondary); Let's Go — guided exercises (project)", start: "2027-06-02" },
    { id: "w38", title: "Week 38 — Checkpoint — everything shipped; clox challenge catch-up + review; …", start: "2027-06-09" },
    { id: "w39", title: "Week 39 — Writing a Compiler in Go — the bridge (secondary); …", start: "2027-06-16" },
    { id: "w40", title: "Week 40 — Capstone II — ship the playground; …", start: "2027-06-23" },
  ],

  days: [
    /* ---------------- Week 1 ---------------- */
    {
      id: "d01", date: "2026-09-23", week: "w1", title: `CI Ch9 — Control Flow (jlox) (1/2)`,
      theme: `Resume Crafting Interpreters in the Java tree-walker.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 80, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/control-flow.html" target="_blank" rel="noopener">Ch9 Control Flow</a></b> (jlox): <code>if</code>, logical ops, <code>while</code>, <code>for</code> desugaring (pp 133–146).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch9 Control Flow</b> (jlox): <code>if</code> statements.` },
            { id: "s2", est: 20, label: `Logical operators.` },
            { id: "s3", est: 20, label: `<code>while</code> loops.` },
            { id: "s4", est: 20, label: `<code>for</code> desugaring (pp 133–146).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Lox's <code>for</code> is pure syntactic sugar — the parser rewrites it into a <code>while</code>. No new interpreter code needed, which is the whole point of desugaring.` },
        { id: "s2", type: "callout", label: `🔗 Bridge: <i>Writing an Interpreter in Go</i> (the secondary book) builds the same tree-walk eval in Go — we'll start it after CI. Note how differently it handles control flow.` },
      ],
    },
    {
      id: "d02", date: "2026-09-26", week: "w1", title: "CI Ch9 — Control Flow (jlox) (1/2, cont.)",
      theme: "Finish “CI Ch9 — Control Flow (jlox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d01", obj: CI, cat: "code", est: 90, group: "g1-d01", label: `Implement it in jlox; get <code>for</code>-as-sugar working end to end.`,
          sub: [
            { id: "s1", est: 45, label: `Implement it in jlox.` },
            { id: "s2", est: 45, label: `Get <code>for</code>-as-sugar working end to end.` },
          ] },
      ],
    },
    {
      id: "d03", date: "2026-09-28", week: "w1", title: `CI Ch9 — Control Flow (jlox) (2/2)`,
      theme: `Resume Crafting Interpreters in the Java tree-walker.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 80, label: `<b>Ch9 Challenges (all 3)</b> — incl. adding <code>break</code> (needs parser + interpreter changes) (p 144). (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `<b>Ch9 Challenge 1</b> of 3.` },
            { id: "s2", est: 40, label: `<b>Ch9 Challenge 2</b> of 3.` },
          ] },
      ],
    },

    /* ---------------- Week 2 ---------------- */
    {
      id: "d04", date: "2026-10-02", week: "w2", title: "CI Ch9 — Control Flow (jlox) (2/2, cont.)",
      theme: "Finish “CI Ch9 — Control Flow (jlox) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d03", obj: CI, cat: "challenge", est: 40, label: `<b>Ch9 Challenges (all 3)</b> — incl. adding <code>break</code> (needs parser + interpreter changes) (p 144). (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `<b>Ch9 Challenge 3</b> of 3 — incl. adding <code>break</code> (needs parser + interpreter changes) (p 144).` },
          ] },
      ],
    },
    {
      id: "d05", date: "2026-10-04", week: "w2", title: `Go — Templates (videos 27–36) (1/2)`,
      theme: `Server-side rendering, XSS, contextual encoding.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 90, group: "g1", label: `Watch <b>videos 27–36</b> — “What Are Templates?” → “Template Exercises”: SSR, XSS, contextual encoding, home/contact/FAQ via templates.`,
          sub: [
            { id: "s1", est: 25, label: `Watch <b>videos 27–36</b> — “What Are Templates?” → “Template Exercises”: SSR.` },
            { id: "s2", est: 25, label: `XSS.` },
            { id: "s3", est: 25, label: `Contextual encoding.` },
            { id: "s4", est: 15, label: `Home/contact/FAQ via templates.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Go's <code>html/template</code> does <b>contextual</b> auto-escaping — it escapes differently inside an attribute, a URL, or a &lt;script&gt;. That's why you use it over <code>text/template</code> for HTML.` },
      ],
    },
    {
      id: "d06", date: "2026-10-06", week: "w2", title: "Go — Templates (videos 27–36) (1/2, cont.)",
      theme: "Finish “Go — Templates (videos 27–36) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d05", obj: GO, cat: "review", est: 50, group: "g1-d05", label: `Review <b><a href="https://www.usegolang.com/" target="_blank" rel="noopener">Calhoun</a> Ch4 Templates</b> (PDF pp 93–132) alongside the videos.` },
      ],
    },

    /* ---------------- Week 3 ---------------- */
    {
      id: "d07", date: "2026-10-07", week: "w3", title: `Go — Templates (videos 27–36) (2/2)`,
      theme: `Server-side rendering, XSS, contextual encoding.`,
      tasks: [
        { id: "t1", obj: GO, cat: "exercise", est: 60, optional: true, label: `<b>Bonus:</b> do the video's Template Exercises (v36).` },
      ],
    },
    {
      id: "d08", date: "2026-10-08", week: "w3", title: `CI Ch10 — Functions (jlox) (1/2)`,
      theme: `First-class functions, closures, return values.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 100, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/functions.html" target="_blank" rel="noopener">Ch10 Functions</a></b> (jlox): function objects, call semantics, native functions, <code>return</code>, closures (pp 147–167).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch10 Functions</b> (jlox): function objects.` },
            { id: "s2", est: 20, label: `Call semantics.` },
            { id: "s3", est: 20, label: `Native functions.` },
            { id: "s4", est: 20, label: `<code>return</code>.` },
            { id: "s5", est: 20, label: `Closures (pp 147–167).` },
          ] },
      ],
    },
    {
      id: "d09", date: "2026-10-12", week: "w3", title: `CI Ch10 — Functions (jlox) (2/2)`,
      theme: `First-class functions, closures, return values.`,
      tasks: [
        { id: "t1", obj: CI, cat: "code", est: 95, group: "g1", label: `Implement <code>LoxFunction</code>, environments-as-closures, and <code>clock()</code> native.`,
          sub: [
            { id: "s1", est: 35, label: `Implement <code>LoxFunction</code> (the callable function object).` },
            { id: "s2", est: 35, label: `Environments-as-closures (capture the defining scope).` },
            { id: "s3", est: 25, label: `The <code>clock()</code> native function.` },
          ] },
      ],
    },

    /* ---------------- Week 4 ---------------- */
    {
      id: "d10", date: "2026-10-16", week: "w4", title: "CI Ch10 — Functions (jlox) (2/2, cont.)",
      theme: "Finish “CI Ch10 — Functions (jlox) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d09", obj: CI, cat: "challenge", est: 90, label: `<b>Ch10 Challenges (all 3)</b> — incl. anonymous function expressions (p 166).`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch10 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch10 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch10 Challenge 3</b> of 3 — incl. anonymous function expressions (p 166).` },
          ] },
      ],
    },
    {
      id: "d11", date: "2026-10-17", week: "w4", title: `CI Ch11 — Resolving & Binding (jlox) (1/2)`,
      theme: `The static resolution pass — the subtle one.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/resolving-and-binding.html" target="_blank" rel="noopener">Ch11 Resolving and Binding</a></b> (jlox): the resolver pass, scope depths, closing the closure bug (pp 168–189).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch11 Resolving and Binding</b> (jlox): the resolver pass.` },
            { id: "s2", est: 25, label: `Scope depths.` },
            { id: "s3", est: 25, label: `Closing the closure bug (pp 168–189).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This chapter fixes a real bug: without a resolution pass, a closure can see a variable declared <i>after</i> it was captured. Static resolution pins each name to a scope depth once.` },
      ],
    },
    {
      id: "d12", date: "2026-10-18", week: "w4", title: "CI Ch11 — Resolving & Binding (jlox) (1/2, cont.)",
      theme: "Finish “CI Ch11 — Resolving & Binding (jlox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d11", obj: CI, cat: "code", est: 45, group: "g1-d11", label: `Implement the <code>Resolver</code> and wire it before interpretation. (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `Implement the <code>Resolver</code>.` },
          ] },
      ],
    },
    {
      id: "d13", date: "2026-10-20", week: "w4", title: `CI Ch11 — Resolving & Binding (jlox) (2/2)`,
      theme: `The static resolution pass — the subtle one.`,
      tasks: [
        { id: "t1", carried: "d11", obj: CI, cat: "code", est: 45, group: "g1-d11", label: `Implement the <code>Resolver</code> and wire it before interpretation. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Wire it before interpretation.` },
          ] },
        { id: "t2", obj: CI, cat: "challenge", est: 25, label: `<b>Ch11 Challenges (all 4)</b> — incl. reporting unused locals (p 188). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch11 Challenge 1</b> of 4.` },
          ] },
      ],
    },

    /* ---------------- Week 5 ---------------- */
    {
      id: "d14", date: "2026-10-21", week: "w5", title: "CI Ch11 — Resolving & Binding (jlox) (2/2, cont.)",
      theme: "Finish “CI Ch11 — Resolving & Binding (jlox) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d13", obj: CI, cat: "challenge", est: 80, label: `<b>Ch11 Challenges (all 4)</b> — incl. reporting unused locals (p 188). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch11 Challenge 2</b> of 4.` },
            { id: "s2", est: 25, label: `<b>Ch11 Challenge 3</b> of 4.` },
            { id: "s3", est: 30, label: `<b>Ch11 Challenge 4</b> of 4 — incl. reporting unused locals (p 188).` },
          ] },
      ],
    },
    {
      id: "d15", date: "2026-10-22", week: "w5", title: `Go — Code Org & MVC (videos 37–54) (1/2)`,
      theme: `Package structure, MVC, views, layouts, Tailwind.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 105, group: "g1", label: `Watch <b>videos 37–54</b> — “Code Organization” → “Exercises”: MVC, the views package, template validation at startup, embedding, named templates, reusable layouts, Tailwind, nav bar. (1/2)`,
          sub: [
            { id: "s1", est: 15, label: `Watch <b>videos 37–54</b> — “Code Organization” → “Exercises”: MVC.` },
            { id: "s2", est: 15, label: `The views package.` },
            { id: "s3", est: 15, label: `Template validation at startup.` },
            { id: "s4", est: 15, label: `Embedding.` },
            { id: "s5", est: 15, label: `Named templates.` },
            { id: "s6", est: 15, label: `Reusable layouts.` },
            { id: "s7", est: 15, label: `Tailwind.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — <i>Let's Go</i> Ch2–3 (skeleton + config/DI/errors) covers the same structural ideas with a different app; we start reading it in week 7.` },
      ],
    },
    {
      id: "d16", date: "2026-10-23", week: "w5", title: "Go — Code Org & MVC (videos 37–54) (1/2, cont.)",
      theme: "Finish “Go — Code Org & MVC (videos 37–54) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d15", obj: GO, cat: "watch", est: 30, group: "g1-d15", label: `Watch <b>videos 37–54</b> — “Code Organization” → “Exercises”: MVC, the views package, template validation at startup, embedding, named templates, reusable layouts, Tailwind, nav bar. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Nav bar.` },
          ] },
      ],
    },
    {
      id: "d17", date: "2026-10-26", week: "w5", title: `Go — Code Org & MVC (videos 37–54) (2/2)`,
      theme: `Package structure, MVC, views, layouts, Tailwind.`,
      tasks: [
        { id: "t1", obj: GO, cat: "review", est: 55, group: "g1", label: `Review <b>Calhoun Ch5–7</b> (PDF pp 133–224) alongside.` },
      ],
    },

    /* ---------------- Week 6 ---------------- */
    {
      id: "d18", date: "2026-10-31", week: "w6", title: `CI Ch12 — Classes I (jlox)`,
      theme: `The 27-page chapter, split across two days. Today: declarations → methods.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 80, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/classes.html" target="_blank" rel="noopener">Ch12 Classes, part 1</a></b> (jlox): class declarations, instances, properties, methods (pp 190–205).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch12 Classes, part 1</b> (jlox): class declarations.` },
            { id: "s2", est: 20, label: `Instances.` },
            { id: "s3", est: 20, label: `Properties.` },
            { id: "s4", est: 20, label: `Methods (pp 190–205).` },
          ] },
      ],
    },
    {
      id: "d19", date: "2026-11-01", week: "w6", title: "CI Ch12 — Classes I (jlox) (cont.)",
      theme: "Finish “CI Ch12 — Classes I (jlox)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d18", obj: CI, cat: "code", est: 75, group: "g1-d18", label: `Implement <code>LoxClass</code>/<code>LoxInstance</code>, property get/set, and method binding.`,
          sub: [
            { id: "s1", est: 25, label: `Implement <code>LoxClass</code>/<code>LoxInstance</code>.` },
            { id: "s2", est: 25, label: `Property get/set.` },
            { id: "s3", est: 25, label: `Method binding.` },
          ] },
      ],
    },
    {
      id: "d20", date: "2026-11-02", week: "w6", title: `CI Ch12 — Classes II + challenges (jlox)`,
      theme: `Finish Classes: \`this\`, initializers, and all three challenges.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/classes.html" target="_blank" rel="noopener">Ch12 Classes, part 2</a></b> (jlox): <code>this</code> and constructors/initializers (pp 206–216).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch12 Classes, part 2</b> (jlox): <code>this</code>.` },
            { id: "s2", est: 25, label: `Constructors/initializers (pp 206–216).` },
          ] },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1", label: `Implement <code>this</code> binding and <code>init()</code> initializers; a class now constructs and self-references correctly.`,
          sub: [
            { id: "s1", est: 25, label: `Implement <code>this</code> binding.` },
            { id: "s2", est: 25, label: `Implement <code>init()</code> initializers; a class now constructs and self-references correctly.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Splitting a heavy chapter over two short days beats one marathon: you code the mechanics on day 1 and let <code>this</code>/initializers (the subtle part) land fresh on day 2.` },
      ],
      note: `Continuation of Ch12 on the next calendar day — lighter than one 27-page sprint.`,
    },
    {
      id: "d21", date: "2026-11-03", week: "w6", title: "CI Ch12 — Classes II + challenges (jlox) (cont.)",
      theme: "Finish “CI Ch12 — Classes II + challenges (jlox)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d20", obj: CI, cat: "challenge", est: 90, label: `<b>Ch12 Challenges (all 3)</b> — incl. static methods & getters (p 214).`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch12 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch12 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch12 Challenge 3</b> of 3 — incl. static methods & getters (p 214).` },
          ] },
      ],
    },

    /* ---------------- Week 7 ---------------- */
    {
      id: "d22", date: "2026-11-05", week: "w7", title: `Let's Go — read chunk 1 + starter`,
      theme: `Mandatory read; SnippetBox skeleton.`,
      tasks: [
        { id: "t1", obj: GO, cat: "book", est: 105, label: `<b>Mandatory read — <a href="https://lets-go.alexedwards.net/" target="_blank" rel="noopener"><i>Let's Go</i></a> pp 11–85</b> (Ch2 Foundations + Ch3 config/logging/DI/error handling): build the runnable SnippetBox skeleton. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: "<b>Mandatory read — <i>Let’s Go</i> pp 11–50</b>, Ch2 Foundations: project setup, routing, and the handler signature." },
            { id: "s2", est: 35, label: "<b><i>Let’s Go</i> pp 50–85</b> — the rest of Ch2 Foundations: <code>http.Server</code>, URL query strings, and HTML templating." },
            { id: "s3", est: 35, label: "Ch3 config & structured logging: command-line flags, dependency injection into handlers." },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: type out the SnippetBox skeleton yourself rather than copy-paste — the muscle memory for <code>http.Handler</code> + routing is worth it.` },
        { id: "s2", type: "callout", label: `🔗 Secondary preview: skim the intro/Monkey tour of <i>Writing an Interpreter in Go</i> (pp 1–10) — no work yet, just meet the language you'll build after CI.` },
      ],
      note: "A full reading session — the SnippetBox skeleton is the week's anchor.",
    },
    {
      id: "d23", date: "2026-11-06", week: "w7", title: "Let's Go — read chunk 1 + starter (cont.)",
      theme: "Finish “Let's Go — read chunk 1 + starter” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d22", obj: GO, cat: "book", est: 35, label: `<b>Mandatory read — <a href="https://lets-go.alexedwards.net/" target="_blank" rel="noopener"><i>Let's Go</i></a> pp 11–85</b> (Ch2 Foundations + Ch3 config/logging/DI/error handling): build the runnable SnippetBox skeleton. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: "Ch3 (continued) — centralised error handling, and the runnable SnippetBox skeleton." },
          ] },
      ],
    },
    {
      id: "d24", date: "2026-11-07", week: "w7", title: `CI Ch13 — Inheritance (jlox done!) (1/2)`,
      theme: `Superclasses, super calls — finishes the tree-walker.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/inheritance.html" target="_blank" rel="noopener">Ch13 Inheritance</a></b> (jlox): superclasses, method inheritance, <code>super</code> (pp 217–232).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch13 Inheritance</b> (jlox): superclasses.` },
            { id: "s2", est: 25, label: `Method inheritance.` },
            { id: "s3", est: 25, label: `<code>super</code> (pp 217–232).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Half the book is now behind you and you have a working interpreter. Part III (clox) rebuilds all of it in C as a <b>bytecode VM</b> — faster, lower-level, and where the real systems learning is.` },
      ],
    },
    {
      id: "d25", date: "2026-11-08", week: "w7", title: "CI Ch13 — Inheritance (jlox done!) (1/2, cont.)",
      theme: "Finish “CI Ch13 — Inheritance (jlox done!) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d24", obj: CI, cat: "code", est: 80, group: "g1-d24", label: `Implement inheritance + <code>super</code>. 🎉 <b>jlox is complete</b> — a full tree-walk Lox.`,
          sub: [
            { id: "s1", est: 40, label: `Implement inheritance.` },
            { id: "s2", est: 40, label: `Implement <code>super</code>. 🎉 <b>jlox is complete</b> — a full tree-walk Lox.` },
          ] },
      ],
    },

    /* ---------------- Week 8 ---------------- */
    {
      id: "d26", date: "2026-11-11", week: "w8", title: `CI Ch13 — Inheritance (jlox done!) (2/2)`,
      theme: `Superclasses, super calls — finishes the tree-walker.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 90, label: `<b>Ch13 Challenges (all 3)</b> — incl. the class-method-resolution puzzle (p 230).`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch13 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch13 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch13 Challenge 3</b> of 3 — incl. the class-method-resolution puzzle (p 230).` },
          ] },
      ],
    },
    {
      id: "d27", date: "2026-11-15", week: "w8", title: `Go — Signup & REST (videos 55–62)`,
      theme: `Signup page, REST intro, controllers, form parsing.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 60, group: "g1", label: `Watch <b>videos 55–62</b> — “Creating the Signup Page” → “Exercises”: styling, REST intro, users controller, decoupling with interfaces, form parsing, query params.`,
          sub: [
            { id: "s1", est: 10, label: `Watch <b>videos 55–62</b> — “Creating the Signup Page” → “Exercises”: styling.` },
            { id: "s2", est: 10, label: `REST intro.` },
            { id: "s3", est: 10, label: `Users controller.` },
            { id: "s4", est: 10, label: `Decoupling with interfaces.` },
            { id: "s5", est: 10, label: `Form parsing.` },
            { id: "s6", est: 10, label: `Query params.` },
          ] },
      ],
    },
    {
      id: "d28", date: "2026-11-16", week: "w8", title: "Go — Signup & REST (videos 55–62) (cont.)",
      theme: "Finish “Go — Signup & REST (videos 55–62)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d27", obj: GO, cat: "review", est: 50, group: "g1-d27", label: `Review <b>Calhoun Ch8 The Signup Page</b> (PDF pp 225–260).` },
      ],
    },
    {
      id: "d29", date: "2026-11-17", week: "w8", title: `CI Ch14 — Chunks of Bytecode (clox) (1/2)`,
      theme: `clox begins — the C bytecode VM.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 100, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/chunks-of-bytecode.html" target="_blank" rel="noopener">Ch14 Chunks of Bytecode</a></b> (clox): dynamic arrays, op codes, constants, line info, disassembler (pp 233–256).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch14 Chunks of Bytecode</b> (clox): dynamic arrays.` },
            { id: "s2", est: 20, label: `Op codes.` },
            { id: "s3", est: 20, label: `Constants.` },
            { id: "s4", est: 20, label: `Line info.` },
            { id: "s5", est: 20, label: `Disassembler (pp 233–256).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — clox is a <b>stack-based</b> VM; Lua is register-based. Worth a skim: <a href="https://arxiv.org/abs/1611.00467" target="_blank" rel="noopener">stack vs register VMs</a>.` },
      ],
    },

    /* ---------------- Week 9 ---------------- */
    {
      id: "d30", date: "2026-11-19", week: "w9", title: `CI Ch14 — Chunks of Bytecode (clox) (2/2)`,
      theme: `clox begins — the C bytecode VM.`,
      tasks: [
        { id: "t1", obj: CI, cat: "code", est: 100, group: "g1", label: `Build <code>chunk.c</code>, the <code>OpCode</code> set, constant pool, and disassembler in C.`,
          sub: [
            { id: "s1", est: 25, label: `Build <code>chunk.c</code>.` },
            { id: "s2", est: 25, label: `The <code>OpCode</code> set.` },
            { id: "s3", est: 25, label: `Constant pool.` },
            { id: "s4", est: 25, label: `Disassembler in C.` },
          ] },
      ],
    },
    {
      id: "d31", date: "2026-11-20", week: "w9", title: "CI Ch14 — Chunks of Bytecode (clox) (2/2, cont.)",
      theme: "Finish “CI Ch14 — Chunks of Bytecode (clox) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d30", obj: CI, cat: "challenge", est: 90, label: `<b>Ch14 Challenges (all 3)</b> — incl. run-length encoding line numbers & <code>OP_CONSTANT_LONG</code> (p 254).`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch14 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch14 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch14 Challenge 3</b> of 3 — incl. run-length encoding line numbers & <code>OP_CONSTANT_LONG</code> (p 254).` },
          ] },
      ],
    },
    {
      id: "d32", date: "2026-11-21", week: "w9", title: `CI Ch15 — A Virtual Machine (clox) (1/2)`,
      theme: `The interpreter loop, the value stack.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/a-virtual-machine.html" target="_blank" rel="noopener">Ch15 A Virtual Machine</a></b> (clox): the <code>run()</code> loop, the value stack, arithmetic (pp 257–276).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch15 A Virtual Machine</b> (clox): the <code>run()</code> loop.` },
            { id: "s2", est: 25, label: `The value stack.` },
            { id: "s3", est: 25, label: `Arithmetic (pp 257–276).` },
          ] },
      ],
    },

    /* ---------------- Week 10 ---------------- */
    {
      id: "d33", date: "2026-11-25", week: "w10", title: "CI Ch15 — A Virtual Machine (clox) (1/2, cont.)",
      theme: "Finish “CI Ch15 — A Virtual Machine (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d32", obj: CI, cat: "code", est: 90, group: "g1-d32", label: `Implement the VM dispatch loop and stack; get arithmetic executing.`,
          sub: [
            { id: "s1", est: 55, label: `Implement the VM dispatch loop and stack.` },
            { id: "s2", est: 35, label: `Get arithmetic executing.` },
          ] },
      ],
    },
    {
      id: "d34", date: "2026-11-27", week: "w10", title: `CI Ch15 — A Virtual Machine (clox) (2/2)`,
      theme: `The interpreter loop, the value stack.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 105, label: `<b>Ch15 Challenges (all 4)</b> — incl. the stack-manipulation & negation-in-place questions (p 274).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch15 Challenge 1</b> of 4.` },
            { id: "s2", est: 25, label: `<b>Ch15 Challenge 2</b> of 4.` },
            { id: "s3", est: 25, label: `<b>Ch15 Challenge 3</b> of 4.` },
            { id: "s4", est: 30, label: `<b>Ch15 Challenge 4</b> of 4 — incl. the stack-manipulation & negation-in-place questions (p 274).` },
          ] },
      ],
    },
    {
      id: "d35", date: "2026-11-30", week: "w10", title: `Go — Databases (videos 63–89) (1/2)`,
      theme: `Postgres, SQL, querying with Go — a big cluster.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 70, group: "g1", label: `Watch <b>videos 63–89</b>, <b>part 1</b> — from “Intro to Databases”: Postgres, tables/types/constraints, CRUD, connecting from Go. (1/3)`,
          sub: [
            { id: "s1", est: 35, label: `Watch <b>videos 63–89</b> — from “Intro to Databases”: Postgres.` },
            { id: "s2", est: 35, label: `Tables/types/constraints.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Calhoun hand-writes SQL with <code>database/sql</code> rather than an ORM — deliberately. You'll feel the boilerplate, which is exactly why you'll appreciate (and critique) ORMs later.` },
      ],
      note: `Video day — no CI block. The cluster runs across both halves; part 2 is on d38.`,
    },
    {
      id: "d36", date: "2026-12-01", week: "w10", title: "Go — Databases (videos 63–89) (1/2, cont.)",
      theme: "Finish “Go — Databases (videos 63–89) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d35", obj: GO, cat: "watch", est: 35, group: "g1-d35", label: `Watch <b>videos 63–89</b>, <b>part 1</b> — from “Intro to Databases”: Postgres, tables/types/constraints, CRUD, connecting from Go. (2/3)`,
          sub: [
            { id: "s1", est: 35, label: `CRUD.` },
          ] },
      ],
    },

    /* ---------------- Week 11 ---------------- */
    {
      id: "d37", date: "2026-12-03", week: "w11", title: "Go — Databases (videos 63–89) (1/2, cont.)",
      theme: "Finish “Go — Databases (videos 63–89) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d35", obj: GO, cat: "watch", est: 35, group: "g1-d35", label: `Watch <b>videos 63–89</b>, <b>part 1</b> — from “Intro to Databases”: Postgres, tables/types/constraints, CRUD, connecting from Go. (3/3)`,
          sub: [
            { id: "s1", est: 35, label: `Connecting from Go.` },
          ] },
      ],
    },
    {
      id: "d38", date: "2026-12-05", week: "w11", title: `Go — Databases (videos 63–89) (2/2)`,
      theme: `Postgres, SQL, querying with Go — a big cluster.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 85, group: "g1", label: `Watch <b>videos 63–89</b>, <b>part 2</b> — through to “Syncing the Book and Screencasts Source Code”: SQL injection, querying single/multiple records, ORMs vs SQL.`,
          sub: [
            { id: "s1", est: 35, label: `SQL injection.` },
            { id: "s2", est: 35, label: `Querying single/multiple records.` },
            { id: "s3", est: 15, label: `ORMs vs SQL.` },
          ] },
      ],
    },
    {
      id: "d39", date: "2026-12-06", week: "w11", title: "Go — Databases (videos 63–89) (2/2, cont.)",
      theme: "Finish “Go — Databases (videos 63–89) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d38", obj: GO, cat: "review", est: 70, group: "g1-d38",
          sub: [
            { id: "s1", cat: "review", est: 35, label: "<b>Review Calhoun Ch9</b> (PDF pp 261–303) alongside the videos." },
            { id: "s2", cat: "review", est: 35, label: "<b>Review Calhoun Ch10</b> (PDF pp 304–346)." },
          ] },
      ],
    },

    /* ---------------- Week 12 ---------------- */
    {
      id: "d40", date: "2026-12-10", week: "w12", title: `CI Ch16 — Scanning on Demand (clox) (1/2)`,
      theme: `The clox scanner — no separate token list.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 85, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/scanning-on-demand.html" target="_blank" rel="noopener">Ch16 Scanning on Demand</a></b> (clox): the pull-based scanner, tokens without heap allocation (pp 277–296).`,
          sub: [
            { id: "s1", est: 40, label: `CI — <b>Ch16 Scanning on Demand</b> (clox): the pull-based scanner.` },
            { id: "s2", est: 45, label: `Tokens without heap allocation (pp 277–296).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — this is the same job as <i>Writing an Interpreter in Go</i> Ch1 “Lexing”. clox scans on demand; Monkey builds a lexer struct. Same idea, different lifetime.` },
      ],
    },
    {
      id: "d41", date: "2026-12-11", week: "w12", title: "CI Ch16 — Scanning on Demand (clox) (1/2, cont.)",
      theme: "Finish “CI Ch16 — Scanning on Demand (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d40", obj: CI, cat: "code", est: 80, group: "g1-d40",
          sub: [
            { id: "s1", cat: "code", est: 40, label: "Implement <code>scanner.c</code>: the token struct, the character cursor, and single-character tokens." },
            { id: "s2", cat: "code", est: 40, label: "Finish <code>scanner.c</code>: literals, identifiers/keywords, and the pull interface the compiler calls one token at a time." },
          ] },
      ],
    },
    {
      id: "d42", date: "2026-12-14", week: "w12", title: `CI Ch16 — Scanning on Demand (clox) (2/2)`,
      theme: `The clox scanner — no separate token list.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 85, label: `<b>Ch16 Challenges (all 3)</b> (p 295).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch16 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch16 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch16 Challenge 3</b> of 3 (p 295).` },
          ] },
      ],
    },
    {
      id: "d43", date: "2026-12-15", week: "w12", title: `CI Ch17 — Compiling Expressions I (clox, Pratt)`,
      theme: `The dense idea — the Pratt parser — split over two days. Today: the core.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 85, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/compiling-expressions.html" target="_blank" rel="noopener">Ch17 Compiling Expressions, part 1</a></b> (clox): single-pass compilation, the <b>Pratt parser</b> — the precedence table and how prefix/infix rules dispatch (pp 297–310).`,
          sub: [
            { id: "s1", est: 40, label: `CI — <b>Ch17 Compiling Expressions, part 1</b> (clox): single-pass compilation.` },
            { id: "s2", est: 45, label: `The <b>Pratt parser</b> — the precedence table and how prefix/infix rules dispatch (pp 297–310).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Read alongside — Nystrom's own <a href="https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank" rel="noopener">“Pratt Parsers: Expression Parsing Made Easy”</a>. When the precedence table feels magical, this un-magics it.` },
        { id: "s2", type: "hint", label: `💡 This is <b>the</b> chapter that maps to <i>Writing an Interpreter in Go</i> §2.6 — Monkey's parser is Pratt too, while jlox used recursive descent. You'll recognize this technique when you start Monkey.` },
      ],
    },

    /* ---------------- Week 13 ---------------- */
    {
      id: "d44", date: "2026-12-16", week: "w13", title: "CI Ch17 — Compiling Expressions I (clox, Pratt) (cont.)",
      theme: "Finish “CI Ch17 — Compiling Expressions I (clox, Pratt)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d43", obj: CI, cat: "code", est: 90, group: "g1-d43", label: `Implement the core of the Pratt <code>compiler.c</code> — the precedence-climbing loop and the parse-rule table.`,
          sub: [
            { id: "s1", est: 45, label: `Implement the core of the Pratt <code>compiler.c</code> — the precedence-climbing loop.` },
            { id: "s2", est: 45, label: `The parse-rule table.` },
          ] },
      ],
    },
    {
      id: "d45", date: "2026-12-19", week: "w13", title: `CI Ch17 — Pratt parser II + challenges (clox)`,
      theme: `Finish the compiler: the remaining rules, then all three challenges.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 40, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/compiling-expressions.html" target="_blank" rel="noopener">Ch17, part 2</a></b> (clox): unary/grouping/number/literal parse fns and how the table wires them (pp 311–317).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch17, part 2</b> (clox): unary/grouping/number/literal parse fns.` },
            { id: "s2", est: 20, label: `How the table wires them (pp 311–317).` },
          ] },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1", label: `Finish the prefix/infix rule set and emit bytecode for full expressions; run them through the VM.`,
          sub: [
            { id: "s1", est: 25, label: `Finish the prefix/infix rule set and emit bytecode for full expressions.` },
            { id: "s2", est: 20, label: `Run them through the VM.` },
          ] },
      ],
      note: `Continuation of the Pratt chapter — the challenges get a fresh head instead of a tired one.`,
    },
    {
      id: "d46", date: "2026-12-20", week: "w13", title: "CI Ch17 — Pratt parser II + challenges (clox) (cont.)",
      theme: "Finish “CI Ch17 — Pratt parser II + challenges (clox)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d45", obj: CI, cat: "challenge", est: 90, label: `<b>Ch17 Challenges (all 3)</b> (p 316).`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch17 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch17 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch17 Challenge 3</b> of 3 (p 316).` },
          ] },
      ],
    },
    {
      id: "d47", date: "2026-12-21", week: "w13", title: `CI Ch18 — Types of Values (clox) (1/2)`,
      theme: `A tagged union for Lox values.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 35, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/types-of-values.html" target="_blank" rel="noopener">Ch18 Types of Values</a></b> (clox): the tagged-union <code>Value</code>, booleans, nil, comparisons (pp 318–331). (1/2)`,
          sub: [
            { id: "s1", est: 15, label: `CI — <b>Ch18 Types of Values</b> (clox): the tagged-union <code>Value</code>.` },
            { id: "s2", est: 20, label: `Booleans.` },
          ] },
      ],
    },

    /* ---------------- Week 14 ---------------- */
    {
      id: "d48", date: "2026-12-23", week: "w14", title: "CI Ch18 — Types of Values (clox) (1/2, cont.)",
      theme: "Finish “CI Ch18 — Types of Values (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d47", obj: CI, cat: "read", est: 40, group: "g1-d47", label: `CI — <b><a href="https://craftinginterpreters.com/types-of-values.html" target="_blank" rel="noopener">Ch18 Types of Values</a></b> (clox): the tagged-union <code>Value</code>, booleans, nil, comparisons (pp 318–331). (2/2)`,
          sub: [
            { id: "s1", est: 20, label: `Nil.` },
            { id: "s2", est: 20, label: `Comparisons (pp 318–331).` },
          ] },
      ],
    },
    {
      id: "d49", date: "2026-12-24", week: "w14", title: "CI Ch18 — Types of Values (clox) (1/2, cont.)",
      theme: "Finish “CI Ch18 — Types of Values (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d47", obj: CI, cat: "code", est: 70, group: "g1-d47", label: `Implement the <code>Value</code> union and equality/comparison ops.`,
          sub: [
            { id: "s1", est: 35, label: `Implement the <code>Value</code> union.` },
            { id: "s2", est: 35, label: `Equality/comparison ops.` },
          ] },
      ],
    },
    {
      id: "d50", date: "2026-12-25", week: "w14", title: `CI Ch18 — Types of Values (clox) (2/2)`,
      theme: `A tagged union for Lox values.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 80, label: `<b>Ch18 Challenges (both)</b> (p 331).`,
          sub: [
            { id: "s1", est: 40, label: `<b>Ch18 Challenge 1</b> of 2.` },
            { id: "s2", est: 40, label: `<b>Ch18 Challenge 2</b> of 2 (p 331).` },
          ] },
      ],
    },
    {
      id: "d51", date: "2026-12-29", week: "w14", title: `CI Ch19 — Strings (clox) (1/2)`,
      theme: `Heap-allocated objects enter the VM.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 80, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/strings.html" target="_blank" rel="noopener">Ch19 Strings</a></b> (clox): the <code>Obj</code> heap type, string objects, concatenation, the object linked-list (pp 332–348).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch19 Strings</b> (clox): the <code>Obj</code> heap type.` },
            { id: "s2", est: 20, label: `String objects.` },
            { id: "s3", est: 20, label: `Concatenation.` },
            { id: "s4", est: 20, label: `The object linked-list (pp 332–348).` },
          ] },
      ],
    },

    /* ---------------- Week 15 ---------------- */
    {
      id: "d52", date: "2027-01-01", week: "w15", title: "CI Ch19 — Strings (clox) (1/2, cont.)",
      theme: "Finish “CI Ch19 — Strings (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d51", obj: CI, cat: "code", est: 80, group: "g1-d51", label: `Implement <code>ObjString</code> and string concatenation; track objects for later GC.`,
          sub: [
            { id: "s1", est: 40, label: `Implement <code>ObjString</code> and string concatenation.` },
            { id: "s2", est: 40, label: `Track objects for later GC.` },
          ] },
      ],
    },
    {
      id: "d53", date: "2027-01-02", week: "w15", title: `CI Ch19 — Strings (clox) (2/2)`,
      theme: `Heap-allocated objects enter the VM.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 85, label: `<b>Ch19 Challenges (all 3)</b> (p 346).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch19 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch19 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch19 Challenge 3</b> of 3 (p 346).` },
          ] },
      ],
    },
    {
      id: "d54", date: "2027-01-03", week: "w15", title: `Let's Go — read chunk 2 + Go forms tryout (1/2)`,
      theme: `Mandatory read; DB + dynamic templates.`,
      tasks: [
        { id: "t1", obj: GO, cat: "book", est: 105, label: `<b>Mandatory read — <i>Let's Go</i> pp 86–161</b> (Ch4 DB layer + Ch5 dynamic templates): SnippetBox now reads/writes MySQL and renders live data safely. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: "<b>Mandatory read — <i>Let’s Go</i> pp 86–125</b>, Ch4 DB layer: MySQL setup, the driver, and a first query." },
            { id: "s2", est: 35, label: "<b><i>Let’s Go</i> pp 125–161</b> — the rest of Ch4: single-record and multi-record queries, and transactions." },
            { id: "s3", est: 35, label: "Ch5 dynamic templates: passing data in, and the template cache." },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Two Go stacks side by side: Calhoun rolls more by hand; <i>Let's Go</i> is more idiomatic/production-shaped. Noticing where they differ (routing, DI, templates) teaches you the design space.` },
      ],
    },
    {
      id: "d55", date: "2027-01-04", week: "w15", title: "Let's Go — read chunk 2 + Go forms tryout (1/2, cont.)",
      theme: "Finish “Let's Go — read chunk 2 + Go forms tryout (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d54", obj: GO, cat: "book", est: 35, label: `<b>Mandatory read — <i>Let's Go</i> pp 86–161</b> (Ch4 DB layer + Ch5 dynamic templates): SnippetBox now reads/writes MySQL and renders live data safely. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: "Ch5 (continued) — template functions, and rendering live data safely." },
          ] },
      ],
    },

    /* ---------------- Week 16 ---------------- */
    {
      id: "d56", date: "2027-01-06", week: "w16", title: `Calhoun Ch11–12 review + Go forms tryout (2/2)`,
      theme: `Consolidate the book behind the videos, then try a Let's Go pattern in your own app.`,
      tasks: [
        { id: "t1", obj: GO, cat: "review", est: 50, label: `Review <b>Calhoun Ch11–12</b> (PDF pp 347–400).` },
        { id: "t2", obj: GO, cat: "project", est: 80, optional: true, label: `<b>Try this:</b> adapt one <i>Let's Go</i> pattern (e.g. the template cache) into your Calhoun app.` },
      ],
    },
    {
      id: "d57", date: "2027-01-07", week: "w16", title: `Go — Passwords & bcrypt (videos 90–106)`,
      theme: `Hashing, salting, bcrypt, sign-in.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 90, group: "g1", label: `Watch <b>videos 90–106</b> — “Steps for Securing Passwords” → “Process Sign In Attempts”: hash functions, salting, bcrypt CLI + in Go, UserService, sign-in flow. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Watch <b>videos 90–106</b> — “Steps for Securing Passwords” → “Process Sign In Attempts”: hash functions.` },
            { id: "s2", est: 30, label: `Salting.` },
            { id: "s3", est: 30, label: `bcrypt CLI + in Go.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Cross-roadmap echo — this is the same bcrypt you used in the Roadmaps app's own login. Note how identical the hash/verify shape is across Go and PHP.` },
      ],
    },
    {
      id: "d58", date: "2027-01-09", week: "w16", title: "Go — Passwords & bcrypt (videos 90–106) (cont.)",
      theme: "Finish “Go — Passwords & bcrypt (videos 90–106)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d57", obj: GO, cat: "watch", est: 60, group: "g1-d57", label: `Watch <b>videos 90–106</b> — “Steps for Securing Passwords” → “Process Sign In Attempts”: hash functions, salting, bcrypt CLI + in Go, UserService, sign-in flow. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `UserService.` },
            { id: "s2", est: 30, label: `Sign-in flow.` },
          ] },
      ],
    },
    {
      id: "d59", date: "2027-01-12", week: "w16", title: `CI Ch20 — Hash Tables (clox) (1/2)`,
      theme: `Build a hash table from scratch in C.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 80, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/hash-tables.html" target="_blank" rel="noopener">Ch20 Hash Tables</a></b> (clox): open addressing, FNV-1a hashing, tombstones, string interning setup (pp 349–372).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch20 Hash Tables</b> (clox): open addressing.` },
            { id: "s2", est: 20, label: `FNV-1a hashing.` },
            { id: "s3", est: 20, label: `Tombstones.` },
            { id: "s4", est: 20, label: `String interning setup (pp 349–372).` },
          ] },
      ],
    },

    /* ---------------- Week 17 ---------------- */
    {
      id: "d60", date: "2027-01-13", week: "w17", title: "CI Ch20 — Hash Tables (clox) (1/2, cont.)",
      theme: "Finish “CI Ch20 — Hash Tables (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d59", obj: CI, cat: "code", est: 90, group: "g1-d59", label: `Implement <code>table.c</code> with linear probing and tombstones.`,
          sub: [
            { id: "s1", est: 45, label: `Implement <code>table.c</code> with linear probing.` },
            { id: "s2", est: 45, label: `Add tombstones.` },
          ] },
      ],
    },
    {
      id: "d61", date: "2027-01-15", week: "w17", title: `CI Ch20 — Hash Tables (clox) (2/2)`,
      theme: `Build a hash table from scratch in C.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 85, label: `<b>Ch20 Challenges (all 3)</b> (p 371).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch20 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch20 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch20 Challenge 3</b> of 3 (p 371).` },
          ] },
      ],
    },
    {
      id: "d62", date: "2027-01-17", week: "w17", title: `CI Ch21 — Global Variables (clox) (1/2)`,
      theme: `Global variable statements and the string-intern table.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/global-variables.html" target="_blank" rel="noopener">Ch21 Global Variables</a></b> (clox): global declarations, the globals table, string interning (pp 373–390).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch21 Global Variables</b> (clox): global declarations.` },
            { id: "s2", est: 25, label: `The globals table.` },
            { id: "s3", est: 25, label: `String interning (pp 373–390).` },
          ] },
      ],
    },
    {
      id: "d63", date: "2027-01-18", week: "w17", title: "CI Ch21 — Global Variables (clox) (1/2, cont.)",
      theme: "Finish “CI Ch21 — Global Variables (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d62", obj: CI, cat: "code", est: 80, group: "g1-d62", label: `Implement globals + interning; wire the compiler to emit define/get/set.`,
          sub: [
            { id: "s1", est: 40, label: `Implement globals + interning.` },
            { id: "s2", est: 40, label: `Wire the compiler to emit define/get/set.` },
          ] },
      ],
    },

    /* ---------------- Week 18 ---------------- */
    {
      id: "d64", date: "2027-01-20", week: "w18", title: `CI Ch21 — Global Variables (clox) (2/2)`,
      theme: `Global variable statements and the string-intern table.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 75, label: `<b>Ch21 Challenges (all 3)</b> (p 389).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch21 Challenge 1</b> of 3.` },
            { id: "s2", est: 25, label: `<b>Ch21 Challenge 2</b> of 3.` },
            { id: "s3", est: 25, label: `<b>Ch21 Challenge 3</b> of 3 (p 389).` },
          ] },
      ],
    },
    {
      id: "d65", date: "2027-01-21", week: "w18", title: `Go — SQL relations & migrations (videos 138–155) (1/2)`,
      theme: `Foreign keys, joins, indexes, schema migrations (goose).`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 100, group: "g1", label: `Watch <b>videos 138–155</b> — “SQL Relationships” → “Removing Old SQL Files”: FKs, ON DELETE CASCADE, joins, indexes, ON CONFLICT, schema migrations with <code>goose</code>, embedding migrations. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Watch <b>videos 138–155</b> — “SQL Relationships” → “Removing Old SQL Files”: FKs.` },
            { id: "s2", est: 25, label: `ON DELETE CASCADE.` },
            { id: "s3", est: 25, label: `Joins.` },
            { id: "s4", est: 25, label: `Indexes.` },
          ] },
      ],
      note: `Note: videos 107–137 (Cookies/Sessions/CSRF) are covered on d73–d75 (weeks 19–23); this week jumps to the SQL cluster to balance load — reorder freely.`,
    },
    {
      id: "d66", date: "2027-01-23", week: "w18", title: `Go — SQL relations & migrations (videos 138–155) (2/2)`,
      theme: `Foreign keys, joins, indexes, schema migrations (goose).`,
      tasks: [
        { id: "t1", carried: "d65", obj: GO, cat: "watch", est: 60, group: "g1-d65", label: `Watch <b>videos 138–155</b> — “SQL Relationships” → “Removing Old SQL Files”: FKs, ON DELETE CASCADE, joins, indexes, ON CONFLICT, schema migrations with <code>goose</code>, embedding migrations. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `ON CONFLICT.` },
            { id: "s2", est: 25, label: `Schema migrations with <code>goose</code>.` },
            { id: "s3", est: 10, label: `Embedding migrations.` },
          ] },
        { id: "t2", obj: GO, cat: "review", est: 25, group: "g1", label: `Review <b>Calhoun Ch15–16</b> (PDF pp 529–574). (1/2)` },
      ],
    },

    /* ---------------- Week 19 ---------------- */
    {
      id: "d67", date: "2027-01-27", week: "w19", title: `CI Ch22 — Local Variables (clox) (1/2)`,
      theme: `Locals on the stack, scope resolution at compile time.`,
      tasks: [
        { id: "t1", carried: "d66", obj: GO, cat: "review", est: 25, group: "g1-d66", label: `Review <b>Calhoun Ch15–16</b> (PDF pp 529–574). (2/2)` },
        { id: "t2", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/local-variables.html" target="_blank" rel="noopener">Ch22 Local Variables</a></b> (clox): compile-time scope tracking, stack slots, no runtime lookup (pp 391–404).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch22 Local Variables</b> (clox): compile-time scope tracking.` },
            { id: "s2", est: 25, label: `Stack slots.` },
            { id: "s3", est: 25, label: `No runtime lookup (pp 391–404).` },
          ] },
      ],
    },
    {
      id: "d68", date: "2027-01-29", week: "w19", title: `CI Ch22 — Local Variables (clox) (2/2)`,
      theme: `Locals on the stack, scope resolution at compile time.`,
      tasks: [
        { id: "t1", carried: "d67", obj: CI, cat: "code", est: 80, group: "g1-d67", label: `Implement local slots and scope depth in the compiler.`,
          sub: [
            { id: "s1", est: 40, label: `Implement local slots.` },
            { id: "s2", est: 40, label: `Scope depth in the compiler.` },
          ] },
        { id: "t2", obj: CI, cat: "challenge", est: 25, label: `<b>Ch22 Challenges (all 4)</b> (p 404). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch22 Challenge 1</b> of 4.` },
          ] },
      ],
    },
    {
      id: "d69", date: "2027-02-02", week: "w19", title: "CI Ch22 — Local Variables (clox) (2/2, cont.)",
      theme: "Finish “CI Ch22 — Local Variables (clox) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d68", obj: CI, cat: "challenge", est: 75, label: `<b>Ch22 Challenges (all 4)</b> (p 404). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch22 Challenge 2</b> of 4.` },
            { id: "s2", est: 25, label: `<b>Ch22 Challenge 3</b> of 4.` },
            { id: "s3", est: 25, label: `<b>Ch22 Challenge 4</b> of 4 (p 404).` },
          ] },
      ],
    },

    /* ---------------- Week 20 ---------------- */
    {
      id: "d70", date: "2027-02-06", week: "w20", title: `CI Ch23 — Jumping Back and Forth (clox) (1/2)`,
      theme: `Control flow via jump bytecodes + backpatching.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/jumping-back-and-forth.html" target="_blank" rel="noopener">Ch23 Jumping Back and Forth</a></b> (clox): <code>if</code>/<code>while</code>/<code>for</code> via jumps, backpatching, logical operators (pp 405–424).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch23 Jumping Back and Forth</b> (clox): <code>if</code>/<code>while</code>/<code>for</code> via jumps.` },
            { id: "s2", est: 25, label: `Backpatching.` },
            { id: "s3", est: 25, label: `Logical operators (pp 405–424).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 The Go interpreter book (secondary) is now close — this pre-read primes the switch. It stays on its own meter and won't touch your primary progress.` },
      ],
    },
    {
      id: "d71", date: "2027-02-07", week: "w20", title: "CI Ch23 — Jumping Back and Forth (clox) (1/2, cont.)",
      theme: "Finish “CI Ch23 — Jumping Back and Forth (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d70", obj: CI, cat: "code", est: 90, group: "g1-d70", label: `Implement jump emission + backpatching; get loops running on the VM.`,
          sub: [
            { id: "s1", est: 45, label: `Implement jump emission + backpatching.` },
            { id: "s2", est: 45, label: `Get loops running on the VM.` },
          ] },
      ],
    },
    {
      id: "d72", date: "2027-02-08", week: "w20", title: `CI Ch23 — Jumping Back and Forth (clox) (2/2)`,
      theme: `Control flow via jump bytecodes + backpatching.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 85, label: `<b>Ch23 Challenges (all 3)</b> — incl. adding <code>switch</code>/<code>continue</code> (p 420).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch23 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch23 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch23 Challenge 3</b> of 3 — incl. adding <code>switch</code>/<code>continue</code> (p 420).` },
          ] },
        { id: "t2", obj: GX, cat: "prep", est: 30, optional: true, label: `<b>Secondary starter (pre-read):</b> skim <i>Writing an Interpreter in Go</i> §1.1–1.3 (pp 11–21) — how Monkey tokenizes. It activates for real after CI.` },
      ],
    },

    /* ---------------- Week 21 ---------------- */
    {
      id: "d73", date: "2027-02-11", week: "w21", title: `Go — Cookies, Sessions & CSRF (videos 107–137) (1/2)`,
      theme: `The big auth-state cluster.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 85, group: "g1", label: `Watch <b>videos 107–137</b>, <b>part 1</b> — from “Stateless Servers”: cookies, XSS/theft, CSRF middleware, secure tokens (<code>crypto/rand</code>). (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Watch <b>videos 107–137</b> — from “Stateless Servers”: cookies.` },
            { id: "s2", est: 45, label: `XSS/theft.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 “Why 32 bytes for session tokens?” (v124) is a great security aside — enough entropy that guessing is infeasible. Same reasoning behind the Roadmaps app's own session id.` },
      ],
      note: `A heavy video day — no CI block. Part 2 continues on d75.`,
    },
    {
      id: "d74", date: "2027-02-13", week: "w21", title: "Go — Cookies, Sessions & CSRF (videos 107–137) (1/2, cont.)",
      theme: "Finish “Go — Cookies, Sessions & CSRF (videos 107–137) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d73", obj: GO, cat: "watch", est: 90, group: "g1-d73", label: `Watch <b>videos 107–137</b>, <b>part 1</b> — from “Stateless Servers”: cookies, XSS/theft, CSRF middleware, secure tokens (<code>crypto/rand</code>). (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `CSRF middleware.` },
            { id: "s2", est: 45, label: `Secure tokens (<code>crypto/rand</code>).` },
          ] },
      ],
    },
    {
      id: "d75", date: "2027-02-15", week: "w21", title: `Go — Cookies, Sessions & CSRF (videos 107–137) (2/2)`,
      theme: `The big auth-state cluster.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 80, group: "g1", label: `Watch <b>videos 107–137</b>, <b>part 2</b> — through to “Sign Out Link”: the sessions table & service, sign-out.`,
          sub: [
            { id: "s1", est: 45, label: `The sessions table & service.` },
            { id: "s2", est: 35, label: `Sign-out.` },
          ] },
      ],
    },
    {
      id: "d76", date: "2027-02-16", week: "w21", title: "Go — Cookies, Sessions & CSRF (videos 107–137) (2/2, cont.)",
      theme: "Finish “Go — Cookies, Sessions & CSRF (videos 107–137) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d75", obj: GO, cat: "review", est: 35, group: "g1-d75",
          sub: [
            { id: "s1", cat: "review", est: 35, label: "<b>Review Calhoun Ch13</b> (PDF pp 401–465)." },
          ] },
      ],
    },

    /* ---------------- Week 22 ---------------- */
    {
      id: "d77", date: "2027-02-17", week: "w22", title: `CI Ch24 — Calls and Functions I (clox)`,
      theme: `The 32-page chapter, split over two days. Today: function objects + call frames.`,
      tasks: [
        { id: "t1", carried: "d75", obj: GO, cat: "review", est: 35, group: "g1-d75",
          sub: [
            { id: "s1", cat: "review", est: 35, label: "<b>Review Calhoun Ch14</b> (PDF pp 466–528)." },
          ] },
        { id: "t2", obj: CI, cat: "read", est: 50, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/calls-and-functions.html" target="_blank" rel="noopener">Ch24 Calls and Functions, part 1</a></b> (clox): function objects, compiling a function body, and the <code>CallFrame</code> model (pp 425–445). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch24 Calls and Functions, part 1</b> (clox): function objects.` },
            { id: "s2", est: 25, label: `Compiling a function body.` },
          ] },
      ],
    },
    {
      id: "d78", date: "2027-02-18", week: "w22", title: "CI Ch24 — Calls and Functions I (clox) (cont.)",
      theme: "Finish “CI Ch24 — Calls and Functions I (clox)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d77", obj: CI, cat: "read", est: 25, group: "g1-d77", label: `CI — <b><a href="https://craftinginterpreters.com/calls-and-functions.html" target="_blank" rel="noopener">Ch24 Calls and Functions, part 1</a></b> (clox): function objects, compiling a function body, and the <code>CallFrame</code> model (pp 425–445). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `The <code>CallFrame</code> model (pp 425–445).` },
          ] },
      ],
    },
    {
      id: "d79", date: "2027-02-19", week: "w22", title: "CI Ch24 — Calls and Functions I (clox) (cont.)",
      theme: "Finish “CI Ch24 — Calls and Functions I (clox)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d77", obj: CI, cat: "code", est: 95, group: "g1-d77", label: `Implement <code>ObjFunction</code>, the compiler's function scaffolding, and the <code>CallFrame</code> array on the VM.`,
          sub: [
            { id: "s1", est: 35, label: `Implement <code>ObjFunction</code>.` },
            { id: "s2", est: 35, label: `The compiler's function scaffolding.` },
            { id: "s3", est: 25, label: `The <code>CallFrame</code> array on the VM.` },
          ] },
      ],
    },
    {
      id: "d80", date: "2027-02-21", week: "w22", title: `CI Ch24 — Calls II: natives + challenges (clox) (1/2)`,
      theme: `Finish calls: arguments, native functions, stack overflow, then all four challenges.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 60, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/calls-and-functions.html" target="_blank" rel="noopener">Ch24, part 2</a></b> (clox): calling functions, argument passing, native functions, and stack-overflow detection (pp 446–456).`,
          sub: [
            { id: "s1", est: 15, label: `CI — <b>Ch24, part 2</b> (clox): calling functions.` },
            { id: "s2", est: 15, label: `Argument passing.` },
            { id: "s3", est: 15, label: `Native functions.` },
            { id: "s4", est: 15, label: `Stack-overflow detection (pp 446–456).` },
          ] },
      ],
      note: `Continuation of the heavy Ch24 — call frames last session (d77), the tricky call/return glue today.`,
    },

    /* ---------------- Week 23 ---------------- */
    {
      id: "d81", date: "2027-02-26", week: "w23", title: "CI Ch24 — Calls II: natives + challenges (clox) (1/2, cont.)",
      theme: "Finish “CI Ch24 — Calls II: natives + challenges (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d80", obj: CI, cat: "code", est: 60, group: "g1-d80", label: `Wire up <code>OP_CALL</code>, argument checking, a native (<code>clock()</code>), and the call-depth guard.`,
          sub: [
            { id: "s1", est: 15, label: `Wire up <code>OP_CALL</code>.` },
            { id: "s2", est: 15, label: `Argument checking.` },
            { id: "s3", est: 15, label: `A native (<code>clock()</code>).` },
            { id: "s4", est: 15, label: `The call-depth guard.` },
          ] },
      ],
    },
    {
      id: "d82", date: "2027-02-27", week: "w23", title: `CI Ch24 — Calls II: natives + challenges (clox) (2/2)`,
      theme: `Finish calls: arguments, native functions, stack overflow, then all four challenges.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 100, label: `<b>Ch24 Challenges (all 4)</b> (p 455).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch24 Challenge 1</b> of 4.` },
            { id: "s2", est: 25, label: `<b>Ch24 Challenge 2</b> of 4.` },
            { id: "s3", est: 25, label: `<b>Ch24 Challenge 3</b> of 4.` },
            { id: "s4", est: 25, label: `<b>Ch24 Challenge 4</b> of 4 (p 455).` },
          ] },
      ],
    },
    {
      id: "d83", date: "2027-03-01", week: "w23", title: `CI Ch25 — Closures I (clox)`,
      theme: `The longest clox chapter (35pp), split over two days. Today: upvalues + capture.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/closures.html" target="_blank" rel="noopener">Ch25 Closures, part 1</a></b> (clox): <code>ObjClosure</code>, upvalues, and capturing local variables (pp 457–478).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch25 Closures, part 1</b> (clox): <code>ObjClosure</code>.` },
            { id: "s2", est: 25, label: `Upvalues.` },
            { id: "s3", est: 25, label: `Capturing local variables (pp 457–478).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Upvalues are the clox answer to the closure problem jlox solved with the resolver (Ch11). Same problem — a captured variable outliving its scope — two very different machines.` },
      ],
      note: "Split day 1 of the longest chapter — capture today, closing-over-the-stack on d85.",
    },
    {
      id: "d84", date: "2027-03-02", week: "w23", title: "CI Ch25 — Closures I (clox) (cont.)",
      theme: "Finish “CI Ch25 — Closures I (clox)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d83", obj: CI, cat: "code", est: 90, group: "g1-d83", label: `Implement <code>ObjClosure</code> and open upvalues; get a closure that reads a captured local while it's still on the stack.`,
          sub: [
            { id: "s1", est: 45, label: `Implement <code>ObjClosure</code> and open upvalues.` },
            { id: "s2", est: 45, label: `Get a closure that reads a captured local while it's still on the stack.` },
          ] },
      ],
    },

    /* ---------------- Week 24 ---------------- */
    {
      id: "d85", date: "2027-03-03", week: "w24", title: `CI Ch25 — Closures II: closing upvalues + challenges (1/2)`,
      theme: `The subtle half: closing upvalues when a local leaves the stack.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 50, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/closures.html" target="_blank" rel="noopener">Ch25 Closures, part 2</a></b> (clox): closing upvalues when the variable pops off the stack, the open-upvalue list (pp 479–491).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch25 Closures, part 2</b> (clox): closing upvalues when the variable pops off the stack.` },
            { id: "s2", est: 25, label: `The open-upvalue list (pp 479–491).` },
          ] },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1", label: `Implement <code>OP_CLOSE_UPVALUE</code> and the open-upvalue linked list; a returned closure now outlives its frame correctly.`,
          sub: [
            { id: "s1", est: 25, label: `Implement <code>OP_CLOSE_UPVALUE</code> and the open-upvalue linked list.` },
            { id: "s2", est: 25, label: `A returned closure now outlives its frame correctly.` },
          ] },
      ],
      note: `Continuation of the longest CI chapter — the part where closures actually get hard.`,
    },
    {
      id: "d86", date: "2027-03-04", week: "w24", title: `CI Ch25 — Closures II: closing upvalues + challenges (2/2)`,
      theme: `The subtle half: closing upvalues when a local leaves the stack.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 90, label: `<b>Ch25 Challenges (all 3)</b> (p 487).`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch25 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch25 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch25 Challenge 3</b> of 3 (p 487).` },
          ] },
      ],
    },
    {
      id: "d87", date: "2027-03-07", week: "w24", title: `CI Ch26 — Garbage Collection I (clox)`,
      theme: `The toughest chapter, split in two. Today: the mark phase and roots.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/garbage-collection.html" target="_blank" rel="noopener">Ch26 GC, part 1</a></b> (clox): reachability, the tricolor abstraction, marking roots and tracing references (pp 492–508).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch26 GC, part 1</b> (clox): reachability.` },
            { id: "s2", est: 25, label: `The tricolor abstraction.` },
            { id: "s3", est: 25, label: `Marking roots and tracing references (pp 492–508).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Background — <a href="https://en.wikipedia.org/wiki/Tracing_garbage_collection" target="_blank" rel="noopener">tracing GC</a> (tricolor, generational) situates clox's collector in the wider family.` },
      ],
      note: `Split day 1 of the hardest chapter — mark today, sweep + 'collect during allocation' bugs next session (d89).`,
    },

    /* ---------------- Week 25 ---------------- */
    {
      id: "d88", date: "2027-03-12", week: "w25", title: "CI Ch26 — Garbage Collection I (clox) (cont.)",
      theme: "Finish “CI Ch26 — Garbage Collection I (clox)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d87", obj: CI, cat: "code", est: 80, group: "g1-d87", label: `Implement <code>markRoots</code> + the mark/tracing phase and the gray stack; verify live objects go black.`,
          sub: [
            { id: "s1", est: 45, label: `Implement <code>markRoots</code> + the mark/tracing phase and the gray stack.` },
            { id: "s2", est: 35, label: `Verify live objects go black.` },
          ] },
      ],
    },
    {
      id: "d89", date: "2027-03-14", week: "w25", title: `CI Ch26 — GC II: sweep + challenges (clox) (1/2)`,
      theme: `The dangerous half: sweep, when to collect, and the allocation-time bugs.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 60, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/garbage-collection.html" target="_blank" rel="noopener">Ch26 GC, part 2</a></b> (clox): the sweep phase, weak references (the string table), and the collection-frequency heuristic (pp 509–518).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch26 GC, part 2</b> (clox): the sweep phase.` },
            { id: "s2", est: 20, label: `Weak references (the string table).` },
            { id: "s3", est: 20, label: `The collection-frequency heuristic (pp 509–518).` },
          ] },
      ],
      note: `Continuation of GC — the part where a wrong root eats a live object. Fresh head recommended.`,
    },
    {
      id: "d90", date: "2027-03-15", week: "w25", title: `CI Ch26 — GC II: sweep + challenges (clox) (2/2)`,
      theme: `The dangerous half: sweep, when to collect, and the allocation-time bugs.`,
      tasks: [
        { id: "t1", carried: "d89", obj: CI, cat: "code", est: 70, group: "g1-d89", label: `Implement sweep + the grow-heap heuristic; chase down the "collect during allocation" bugs that make GC infamous.`,
          sub: [
            { id: "s1", est: 35, label: `Implement sweep + the grow-heap heuristic.` },
            { id: "s2", est: 35, label: `Chase down the "collect during allocation" bugs that make GC infamous.` },
          ] },
        { id: "t2", obj: CI, cat: "challenge", est: 25, label: `<b>Ch26 Challenges (all 3)</b> (p 517). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch26 Challenge 1</b> of 3.` },
          ] },
      ],
    },
    {
      id: "d91", date: "2027-03-16", week: "w25", title: "CI Ch26 — GC II: sweep + challenges (clox) (2/2, cont.)",
      theme: "Finish “CI Ch26 — GC II: sweep + challenges (clox) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d90", obj: CI, cat: "challenge", est: 60, label: `<b>Ch26 Challenges (all 3)</b> (p 517). (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch26 Challenge 2</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch26 Challenge 3</b> of 3 (p 517).` },
          ] },
      ],
    },

    /* ---------------- Week 26 ---------------- */
    {
      id: "d92", date: "2027-03-17", week: "w26", title: `CI Ch27 — Classes and Instances (clox) (1/2)`,
      theme: `Lightest clox chapter — classes and fields.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 60, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/classes-and-instances.html" target="_blank" rel="noopener">Ch27 Classes and Instances</a></b> (clox): class objects, instances, fields (pp 519–531).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch27 Classes and Instances</b> (clox): class objects.` },
            { id: "s2", est: 20, label: `Instances.` },
            { id: "s3", est: 20, label: `Fields (pp 519–531).` },
          ] },
        { id: "t2", obj: CI, cat: "code", est: 35, group: "g1", label: `Implement <code>ObjClass</code>/<code>ObjInstance</code> and property get/set. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Implement <code>ObjClass</code>/<code>ObjInstance</code>.` },
          ] },
      ],
    },
    {
      id: "d93", date: "2027-03-20", week: "w26", title: `CI Ch27 — Classes and Instances (clox) (2/2)`,
      theme: `Lightest clox chapter — classes and fields.`,
      tasks: [
        { id: "t1", carried: "d92", obj: CI, cat: "code", est: 35, group: "g1-d92", label: `Implement <code>ObjClass</code>/<code>ObjInstance</code> and property get/set. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `Property get/set.` },
          ] },
        { id: "t2", obj: CI, cat: "challenge", est: 50, label: `<b>Ch27 Challenges (all 4)</b> (p 531). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch27 Challenge 1</b> of 4.` },
            { id: "s2", est: 25, label: `<b>Ch27 Challenge 2</b> of 4.` },
          ] },
      ],
    },
    {
      id: "d94", date: "2027-03-21", week: "w26", title: `CI Ch28 — Methods & Initializers I (clox)`,
      theme: `26-page chapter, split in two. Today: methods and bound methods.`,
      tasks: [
        { id: "t1", carried: "d93", obj: CI, cat: "challenge", est: 50, label: `<b>Ch27 Challenges (all 4)</b> (p 531). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch27 Challenge 3</b> of 4.` },
            { id: "s2", est: 25, label: `<b>Ch27 Challenge 4</b> of 4 (p 531).` },
          ] },
        { id: "t2", obj: CI, cat: "read", est: 50, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/methods-and-initializers.html" target="_blank" rel="noopener">Ch28 Methods, part 1</a></b> (clox): method declarations, <code>ObjBoundMethod</code>, and <code>this</code> on the VM (pp 532–547). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch28 Methods, part 1</b> (clox): method declarations.` },
            { id: "s2", est: 25, label: `<code>ObjBoundMethod</code>.` },
          ] },
      ],
    },

    /* ---------------- Week 27 ---------------- */
    {
      id: "d95", date: "2027-03-26", week: "w27", title: "CI Ch28 — Methods & Initializers I (clox) (cont.)",
      theme: "Finish “CI Ch28 — Methods & Initializers I (clox)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d94", obj: CI, cat: "read", est: 25, group: "g1-d94", label: `CI — <b><a href="https://craftinginterpreters.com/methods-and-initializers.html" target="_blank" rel="noopener">Ch28 Methods, part 1</a></b> (clox): method declarations, <code>ObjBoundMethod</code>, and <code>this</code> on the VM (pp 532–547). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `<code>this</code> on the VM (pp 532–547).` },
          ] },
        { id: "t2", carried: "d94", obj: CI, cat: "code", est: 45, group: "g1-d94", label: `Implement methods and bound methods; calling <code>instance.method()</code> now binds <code>this</code> correctly. (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `Implement methods and bound methods.` },
          ] },
      ],
    },
    {
      id: "d96", date: "2027-03-29", week: "w27", title: `CI Ch28 — Initializers + invoke opt + challenges`,
      theme: `Finish: initializers and the OP_INVOKE fast path, then all three challenges.`,
      tasks: [
        { id: "t1", carried: "d94", obj: CI, cat: "code", est: 45, group: "g1-d94", label: `Implement methods and bound methods; calling <code>instance.method()</code> now binds <code>this</code> correctly. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Calling <code>instance.method()</code> now binds <code>this</code> correctly.` },
          ] },
        { id: "t2", obj: CI, cat: "read", est: 45, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/methods-and-initializers.html" target="_blank" rel="noopener">Ch28, part 2</a></b> (clox): initializers, and the <code>OP_INVOKE</code>/<code>OP_SUPER_INVOKE</code> fast path that skips the bound-method allocation (pp 548–557).`,
          sub: [
            { id: "s1", est: 20, label: `CI — <b>Ch28, part 2</b> (clox): initializers.` },
            { id: "s2", est: 25, label: `The <code>OP_INVOKE</code>/<code>OP_SUPER_INVOKE</code> fast path that skips the bound-method allocation (pp 548–557).` },
          ] },
      ],
      note: `Continuation of Ch28 — the optimization half lands better on a fresh day.`,
    },
    {
      id: "d97", date: "2027-03-30", week: "w27", title: "CI Ch28 — Initializers + invoke opt + challenges (cont.)",
      theme: "Finish “CI Ch28 — Initializers + invoke opt + challenges” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d96", obj: CI, cat: "code", est: 50, group: "g1-d96", label: `Implement <code>init()</code> and the invoke optimization; benchmark a method-heavy loop before/after.`,
          sub: [
            { id: "s1", est: 25, label: `Implement <code>init()</code> and the invoke optimization.` },
            { id: "s2", est: 25, label: `Benchmark a method-heavy loop before/after.` },
          ] },
      ],
    },

    /* ---------------- Week 28 ---------------- */
    {
      id: "d98", date: "2027-03-31", week: "w28", title: "CI Ch28 — Initializers + invoke opt + challenges (cont.)",
      theme: "Finish “CI Ch28 — Initializers + invoke opt + challenges” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d96", obj: CI, cat: "challenge", est: 85, label: `<b>Ch28 Challenges (all 3)</b> (p 555).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch28 Challenge 1</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch28 Challenge 2</b> of 3.` },
            { id: "s3", est: 30, label: `<b>Ch28 Challenge 3</b> of 3 (p 555).` },
          ] },
      ],
    },
    {
      id: "d99", date: "2027-04-01", week: "w28", title: `Go — Password reset & email (videos 165–194) (1/2)`,
      theme: `Video-only cluster (Calhoun ended) — pair with Let's Go.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 80, group: "g1", label: `Watch <b>videos 165–194</b>, <b>part 1</b> — from “Password Reset Overview”: SMTP, email service, reset tokens & flow, async email. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Watch <b>videos 165–194</b> — from “Password Reset Overview”: SMTP.` },
            { id: "s2", est: 40, label: `Email service.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ From here the video course goes beyond the Calhoun book (which ends at Ch17 / video 164). <i>Let's Go</i> becomes the book companion for the remaining clusters.` },
      ],
    },
    {
      id: "d100", date: "2027-04-02", week: "w28", title: "Go — Password reset & email (videos 165–194) (1/2, cont.)",
      theme: "Finish “Go — Password reset & email (videos 165–194) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d99", obj: GO, cat: "watch", est: 80, group: "g1-d99", label: `Watch <b>videos 165–194</b>, <b>part 1</b> — from “Password Reset Overview”: SMTP, email service, reset tokens & flow, async email. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Reset tokens & flow.` },
            { id: "s2", est: 40, label: `Async email.` },
          ] },
      ],
    },
    {
      id: "d101", date: "2027-04-03", week: "w28", title: `Go — Password reset & email (videos 165–194) (2/2)`,
      theme: `Video-only cluster (Calhoun ended) — pair with Let's Go.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 40, group: "g1", label: `Watch <b>videos 165–194</b>, <b>part 2</b> — through to “Using Public Errors”: public vs internal errors, alerts. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Public vs internal errors.` },
          ] },
      ],
    },

    /* ---------------- Week 29 ---------------- */
    {
      id: "d102", date: "2027-04-08", week: "w29", title: "Go — Password reset & email (videos 165–194) (2/2, cont.)",
      theme: "Finish “Go — Password reset & email (videos 165–194) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d101", obj: GO, cat: "watch", est: 50, group: "g1-d101", label: `Watch <b>videos 165–194</b>, <b>part 2</b> — through to “Using Public Errors”: public vs internal errors, alerts. (2/2)`,
          sub: [
            { id: "s1", est: 50, label: `Alerts.` },
          ] },
      ],
    },
    {
      id: "d103", date: "2027-04-11", week: "w29", title: `CI Ch29 — Superclasses (clox) (1/2)`,
      theme: `Inheritance and super calls in the VM.`,
      tasks: [
        { id: "t1", carried: "d101", obj: GO, cat: "book", est: 65, group: "g1-d101",
          sub: [
            { id: "s1", cat: "book", est: 35, label: "<b>Companion (Calhoun ends at v164):</b> read <i>Let’s Go</i> Ch9 pp 225–234 — sessions: the manager, and putting data in." },
            { id: "s2", cat: "book", est: 30, label: "<i>Let’s Go</i> Ch9 pp 234–241 — the flash-message pattern, end to end." },
          ] },
        { id: "t2", obj: CI, cat: "read", est: 25, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/superclasses.html" target="_blank" rel="noopener">Ch29 Superclasses</a></b> (clox): inheritance, method copy-down, <code>super</code> invocation (pp 558–573). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch29 Superclasses</b> (clox): inheritance.` },
          ] },
      ],
    },
    {
      id: "d104", date: "2027-04-12", week: "w29", title: "CI Ch29 — Superclasses (clox) (1/2, cont.)",
      theme: "Finish “CI Ch29 — Superclasses (clox) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d103", obj: CI, cat: "read", est: 50, group: "g1-d103", label: `CI — <b><a href="https://craftinginterpreters.com/superclasses.html" target="_blank" rel="noopener">Ch29 Superclasses</a></b> (clox): inheritance, method copy-down, <code>super</code> invocation (pp 558–573). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Method copy-down.` },
            { id: "s2", est: 25, label: `<code>super</code> invocation (pp 558–573).` },
          ] },
        { id: "t2", carried: "d103", obj: CI, cat: "code", est: 40, group: "g1-d103", label: `Implement inheritance + <code>super</code> on the VM. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Implement inheritance on the VM.` },
          ] },
      ],
    },
    {
      id: "d105", date: "2027-04-13", week: "w29", title: `CI Ch29 — Superclasses (clox) (2/2)`,
      theme: `Inheritance and super calls in the VM.`,
      tasks: [
        { id: "t1", carried: "d103", obj: CI, cat: "code", est: 40, group: "g1-d103", label: `Implement inheritance + <code>super</code> on the VM. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Implement <code>super</code> on the VM.` },
          ] },
        { id: "t2", obj: CI, cat: "challenge", est: 25, label: `<b>Ch29 Challenges (all 3)</b> (p 571). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch29 Challenge 1</b> of 3.` },
          ] },
      ],
    },

    /* ---------------- Week 30 ---------------- */
    {
      id: "d106", date: "2027-04-14", week: "w30", title: "CI Ch29 — Superclasses (clox) (2/2, cont.)",
      theme: "Finish “CI Ch29 — Superclasses (clox) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d105", obj: CI, cat: "challenge", est: 60, label: `<b>Ch29 Challenges (all 3)</b> (p 571). (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch29 Challenge 2</b> of 3.` },
            { id: "s2", est: 30, label: `<b>Ch29 Challenge 3</b> of 3 (p 571).` },
          ] },
      ],
    },
    {
      id: "d107", date: "2027-04-16", week: "w30", title: `CI Ch30 — Optimization → 🎉 CI DONE (1/2)`,
      theme: `Final chapter — hashing & NaN boxing. Crafting Interpreters complete.`,
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 75, group: "g1", label: `CI — <b><a href="https://craftinginterpreters.com/optimization.html" target="_blank" rel="noopener">Ch30 Optimization</a></b> (clox): faster hashing, NaN boxing, benchmarking (pp 574–597).`,
          sub: [
            { id: "s1", est: 25, label: `CI — <b>Ch30 Optimization</b> (clox): faster hashing.` },
            { id: "s2", est: 25, label: `NaN boxing.` },
            { id: "s3", est: 25, label: `Benchmarking (pp 574–597).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: read the Lox grammar appendix (pp 599–601) and add one small language feature of your own to clox.` },
        { id: "s2", type: "callout", label: `🔗 Next up (secondary): <i>Writing an Interpreter in Go</i> now activates — build Monkey and compare every decision to Lox.` },
      ],
    },
    {
      id: "d108", date: "2027-04-17", week: "w30", title: "CI Ch30 — Optimization → 🎉 CI DONE (1/2, cont.)",
      theme: "Finish “CI Ch30 — Optimization → 🎉 CI DONE (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d107", obj: CI, cat: "code", est: 90, group: "g1-d107", label: `Implement NaN boxing (guarded by a flag) and benchmark before/after. 🎉 <b>Crafting Interpreters finished — both interpreters, all 71 challenges.</b>`,
          sub: [
            { id: "s1", est: 45, label: `Implement NaN boxing (guarded by a flag).` },
            { id: "s2", est: 45, label: `Benchmark before/after. 🎉 <b>Crafting Interpreters finished — both interpreters, all 71 challenges.</b>` },
          ] },
      ],
    },
    {
      id: "d109", date: "2027-04-19", week: "w30", title: `CI Ch30 — Optimization → 🎉 CI DONE (2/2)`,
      theme: `Final chapter — hashing & NaN boxing. Crafting Interpreters complete.`,
      tasks: [
        { id: "t1", obj: CI, cat: "challenge", est: 75, label: `<b>Ch30 Challenges (all 3)</b> (p 597).`,
          sub: [
            { id: "s1", est: 25, label: `<b>Ch30 Challenge 1</b> of 3.` },
            { id: "s2", est: 25, label: `<b>Ch30 Challenge 2</b> of 3.` },
            { id: "s3", est: 25, label: `<b>Ch30 Challenge 3</b> of 3 (p 597).` },
          ] },
      ],
    },

    /* ---------------- Week 31 ---------------- */
    {
      id: "d110", date: "2027-04-22", week: "w31", title: `Monkey Ch1 — Lexing (secondary)`,
      theme: `Phase B: the Go interpreter book activates.`,
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 80, group: "g1", label: `<a href="https://interpreterbook.com/" target="_blank" rel="noopener"><i>Writing an Interpreter in Go</i></a> — <b>Ch1 Lexing</b>: tokens, the lexer, extending the token set, REPL start (pp 11–29).`,
          sub: [
            { id: "s1", est: 20, label: `<i>Writing an Interpreter in Go</i> — <b>Ch1 Lexing</b>: tokens.` },
            { id: "s2", est: 20, label: `The lexer.` },
            { id: "s3", est: 20, label: `Extending the token set.` },
            { id: "s4", est: 20, label: `REPL start (pp 11–29).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 You just wrote two scanners in CI (jlox's and clox's). Monkey's lexer will feel easy — notice how Go's slices + structs change the ergonomics vs C.` },
      ],
      note: `Secondary work — shows on the muted meter, excluded from primary %.`,
    },
    {
      id: "d111", date: "2027-04-24", week: "w31", title: "Monkey Ch1 — Lexing (secondary) (cont.)",
      theme: "Finish “Monkey Ch1 — Lexing (secondary)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d110", obj: GX, cat: "code", est: 80, group: "g1-d110", label: `Build Monkey's lexer + a REPL in Go.`,
          sub: [
            { id: "s1", est: 40, label: `Build Monkey's lexer in Go.` },
            { id: "s2", est: 40, label: `Build a REPL in Go.` },
          ] },
      ],
    },
    {
      id: "d112", date: "2027-04-25", week: "w31", title: `Go — Galleries CRUD (videos 195–217) (1/2)`,
      theme: `Video-only — the galleries feature.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 90, group: "g1", label: `Watch <b>videos 195–217</b>, <b>part 1</b> — from “Galleries Overview”: gallery model & migrations, CRUD handlers, routing/CSRF fixes. (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `Watch <b>videos 195–217</b> — from “Galleries Overview”: gallery model & migrations.` },
            { id: "s2", est: 45, label: `CRUD handlers.` },
          ] },
      ],
    },
    {
      id: "d113", date: "2027-04-27", week: "w31", title: "Go — Galleries CRUD (videos 195–217) (1/2, cont.)",
      theme: "Finish “Go — Galleries CRUD (videos 195–217) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d112", obj: GO, cat: "watch", est: 45, group: "g1-d112", label: `Watch <b>videos 195–217</b>, <b>part 1</b> — from “Galleries Overview”: gallery model & migrations, CRUD handlers, routing/CSRF fixes. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Routing/CSRF fixes.` },
          ] },
      ],
    },

    /* ---------------- Week 32 ---------------- */
    {
      id: "d114", date: "2027-04-28", week: "w32", title: `Go — Galleries CRUD (videos 195–217) (2/2)`,
      theme: `Video-only — the galleries feature.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 60, group: "g1", label: `Watch <b>videos 195–217</b>, <b>part 2</b> — through to “Delete Gallery Handler”: functional options.`,
          sub: [
            { id: "s1", est: 30, label: `Functional options — the variadic <code>opt ...func(*T)</code> pattern.` },
            { id: "s2", est: 30, label: `Wire it through the gallery service; finish the delete handler.` },
          ] },
      ],
    },
    {
      id: "d115", date: "2027-04-29", week: "w32", title: `Monkey Ch2 — Parsing (secondary, Pratt) (1/2)`,
      theme: `Ball's Pratt parser — you just built one in CI Ch17.`,
      tasks: [
        { id: "t1", carried: "d114", obj: GO, cat: "book", est: 65, group: "g1-d114",
          sub: [
            { id: "s1", cat: "book", est: 35, label: "<b>Companion:</b> <i>Let’s Go</i> Ch8 pp 193–208 — parsing a form, and the POST handler." },
            { id: "s2", cat: "book", est: 30, label: "<i>Let’s Go</i> Ch8 pp 208–224 — validation done idiomatically, and re-displaying a form with errors." },
          ] },
        { id: "t2", obj: GX, cat: "read", est: 25, group: "g1", label: `<i>Writing an Interpreter in Go</i> — <b>Ch2 Parsing</b>: AST, <code>let</code>/<code>return</code>, Pratt expression parsing, extending to bool/if/fn/call (pp 30–104). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `<i>Writing an Interpreter in Go</i> — <b>Ch2 Parsing</b>: AST.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — jlox used <b>recursive descent</b>; Monkey (like clox Ch17) uses <b>Pratt</b>. Having done both, this is where the two books rhyme most. Compare Ball §2.7 to Nystrom's Ch17 directly.` },
      ],
    },
    {
      id: "d116", date: "2027-05-01", week: "w32", title: "Monkey Ch2 — Parsing (secondary, Pratt) (1/2, cont.)",
      theme: "Finish “Monkey Ch2 — Parsing (secondary, Pratt) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d115", obj: GX, cat: "read", est: 75, group: "g1-d115", label: `<i>Writing an Interpreter in Go</i> — <b>Ch2 Parsing</b>: AST, <code>let</code>/<code>return</code>, Pratt expression parsing, extending to bool/if/fn/call (pp 30–104). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `<code>let</code>/<code>return</code>.` },
            { id: "s2", est: 25, label: `Pratt expression parsing.` },
            { id: "s3", est: 25, label: `Extending to bool/if/fn/call (pp 30–104).` },
          ] },
      ],
    },
    {
      id: "d117", date: "2027-05-03", week: "w32", title: `Monkey Ch2 — Parsing (secondary, Pratt) (2/2)`,
      theme: `Ball's Pratt parser — you just built one in CI Ch17.`,
      tasks: [
        { id: "t1", obj: GX, cat: "code", est: 55, group: "g1", label: `Build Monkey's Pratt parser and AST. (1/2)`,
          sub: [
            { id: "s1", est: 55, label: `Build Monkey's AST.` },
          ] },
      ],
    },

    /* ---------------- Week 33 ---------------- */
    {
      id: "d118", date: "2027-05-06", week: "w33", title: "Monkey Ch2 — Parsing (secondary, Pratt) (2/2, cont.)",
      theme: "Finish “Monkey Ch2 — Parsing (secondary, Pratt) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d117", obj: GX, cat: "code", est: 55, group: "g1-d117", label: `Build Monkey's Pratt parser and AST. (2/2)`,
          sub: [
            { id: "s1", est: 55, label: `Build Monkey's Pratt parser.` },
          ] },
      ],
    },
    {
      id: "d119", date: "2027-05-07", week: "w33", title: `Let's Go — read chunk 4 (auth + testing)`,
      theme: `Mandatory read; user accounts + full test suite.`,
      tasks: [
        { id: "t1", obj: GO, cat: "book", est: 80, label: `<b>Mandatory read — <i>Let's Go</i> pp 260–388</b> (Ch11 Auth+CSRF, Ch12 request context, Ch13 embed/generics, Ch14 Testing): SnippetBox gets accounts and a real test suite. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `<b>Mandatory read — <i>Let's Go</i> pp 260–388</b>, Ch11 Auth+CSRF.` },
            { id: "s2", est: 40, label: `Ch12 request context.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: write one end-to-end test (Ch14 style) against your Calhoun app's sign-in flow.` },
      ],
    },
    {
      id: "d120", date: "2027-05-09", week: "w33", title: "Let's Go — read chunk 4 (auth + testing) (cont.)",
      theme: "Finish “Let's Go — read chunk 4 (auth + testing)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d119", obj: GO, cat: "book", est: 80, label: `<b>Mandatory read — <i>Let's Go</i> pp 260–388</b> (Ch11 Auth+CSRF, Ch12 request context, Ch13 embed/generics, Ch14 Testing): SnippetBox gets accounts and a real test suite. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Ch13 embed/generics.` },
            { id: "s2", est: 40, label: `Ch14 Testing: SnippetBox gets accounts and a real test suite.` },
          ] },
      ],
    },
    {
      id: "d121", date: "2027-05-11", week: "w33", title: `Go — Images & config (videos 218–248) (1/2)`,
      theme: `Image uploads + config/Docker/Tailwind.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 75, group: "g1", label: `Watch <b>videos 218–248</b>, <b>part 1</b> — from “Images Overview”: file uploads, content-type detection, filename vulns, ENV config. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Watch <b>videos 218–248</b> — from “Images Overview”: file uploads.` },
            { id: "s2", est: 40, label: `Content-type detection.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 “Checking for Filename Vulnerabilities” (v231) is the security highlight — path traversal via upload filenames. Same class of bug as the Roadmaps router blocking dot-files.` },
      ],
      note: `Video day — part 2 continues on d123.`,
    },

    /* ---------------- Week 34 ---------------- */
    {
      id: "d122", date: "2027-05-12", week: "w34", title: "Go — Images & config (videos 218–248) (1/2, cont.)",
      theme: "Finish “Go — Images & config (videos 218–248) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d121", obj: GO, cat: "watch", est: 80, group: "g1-d121", label: `Watch <b>videos 218–248</b>, <b>part 1</b> — from “Images Overview”: file uploads, content-type detection, filename vulns, ENV config. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Filename vulns.` },
            { id: "s2", est: 40, label: `ENV config.` },
          ] },
      ],
    },
    {
      id: "d123", date: "2027-05-15", week: "w34", title: `Go — Images & config (videos 218–248) (2/2)`,
      theme: `Image uploads + config/Docker/Tailwind.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 105, group: "g1", label: `Watch <b>videos 218–248</b>, <b>part 2</b> — through to “Caddy Server via Docker”: Docker Compose, Tailwind build, static assets.`,
          sub: [
            { id: "s1", est: 40, label: `Docker Compose.` },
            { id: "s2", est: 40, label: `Tailwind build.` },
            { id: "s3", est: 25, label: `Static assets.` },
          ] },
      ],
    },
    {
      id: "d124", date: "2027-05-17", week: "w34", title: "Go — Images & config (videos 218–248) (2/2, cont.)",
      theme: "Finish “Go — Images & config (videos 218–248) (2/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d123", obj: GO, cat: "book", est: 50, group: "g1-d123", label: `<b>Companion:</b> <i>Let's Go</i> Ch10 Security improvements / TLS (pp 242–259).` },
      ],
    },
    {
      id: "d125", date: "2027-05-18", week: "w34", title: `Monkey Ch3 — Evaluation (secondary) (1/2)`,
      theme: `Tree-walking eval, environments, closures in Go.`,
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 75, group: "g1", label: `<i>Writing an Interpreter in Go</i> — <b>Ch3 Evaluation</b>: object system, evaluating expressions, conditionals, <code>return</code>, errors, environments, functions & closures (pp 105–153). (1/2)`,
          sub: [
            { id: "s1", est: 15, label: `<i>Writing an Interpreter in Go</i> — <b>Ch3 Evaluation</b>: object system.` },
            { id: "s2", est: 15, label: `Evaluating expressions.` },
            { id: "s3", est: 15, label: `Conditionals.` },
            { id: "s4", est: 15, label: `<code>return</code>.` },
            { id: "s5", est: 15, label: `Errors.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — Ball §3.9 Environment ↔ CI jlox Ch8; §3.10 closures ↔ jlox Ch10 + Ch11 resolver. You solved this exact problem three ways now (jlox env, clox upvalues, Monkey env).` },
      ],
    },

    /* ---------------- Week 35 ---------------- */
    {
      id: "d126", date: "2027-05-21", week: "w35", title: "Monkey Ch3 — Evaluation (secondary) (1/2, cont.)",
      theme: "Finish “Monkey Ch3 — Evaluation (secondary) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d125", obj: GX, cat: "read", est: 30, group: "g1-d125", label: `<i>Writing an Interpreter in Go</i> — <b>Ch3 Evaluation</b>: object system, evaluating expressions, conditionals, <code>return</code>, errors, environments, functions & closures (pp 105–153). (2/2)`,
          sub: [
            { id: "s1", est: 15, label: `Environments.` },
            { id: "s2", est: 15, label: `Functions & closures (pp 105–153).` },
          ] },
      ],
    },
    {
      id: "d127", date: "2027-05-23", week: "w35", title: `Monkey Ch3 — Evaluation (secondary) (2/2)`,
      theme: `Tree-walking eval, environments, closures in Go.`,
      tasks: [
        { id: "t1", obj: GX, cat: "code", est: 100, group: "g1", label: `Build Monkey's evaluator; get closures & environments working.`,
          sub: [
            { id: "s1", est: 55, label: `Build Monkey's evaluator.` },
            { id: "s2", est: 45, label: `Get closures & environments working.` },
          ] },
      ],
    },
    {
      id: "d128", date: "2027-05-24", week: "w35", title: `Go — Deployment (videos 249–263) (1/2)`,
      theme: `Ship it: droplet, DNS, prod env, deploy via git.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 100, group: "g1", label: `Watch <b>videos 249–263</b> — “Creating a Digital Ocean Droplet” → “Logging Services”: server setup, DNS, bare git repo deploy, prod <code>.env</code>/Caddyfile, post-receive deploy hooks. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Watch <b>videos 249–263</b> — “Creating a Digital Ocean Droplet” → “Logging Services”: server setup.` },
            { id: "s2", est: 25, label: `DNS.` },
            { id: "s3", est: 25, label: `Bare git repo deploy.` },
            { id: "s4", est: 25, label: `Prod <code>.env</code>/Caddyfile.` },
          ] },
      ],
    },

    /* ---------------- Week 36 ---------------- */
    {
      id: "d129", date: "2027-05-27", week: "w36", title: `Go — Deployment (videos 249–263) (2/2)`,
      theme: `Ship it: droplet, DNS, prod env, deploy via git.`,
      tasks: [
        { id: "t1", carried: "d128", obj: GO, cat: "watch", est: 35, group: "g1-d128", label: `Watch <b>videos 249–263</b> — “Creating a Digital Ocean Droplet” → “Logging Services”: server setup, DNS, bare git repo deploy, prod <code>.env</code>/Caddyfile, post-receive deploy hooks. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `Post-receive deploy hooks.` },
          ] },
        { id: "t2", obj: GO, cat: "project", est: 50, optional: true, label: `<b>Try this:</b> deploy your app (or SnippetBox) to a real host following the video steps.` },
      ],
    },
    {
      id: "d130", date: "2027-05-28", week: "w36", title: `Go — OAuth & finish → 🎉 course DONE`,
      theme: `OAuth/Dropbox + the final videos. 285/285.`,
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 90, group: "g1", label: `Watch <b>videos 264–285</b> — “Intro to OAuth” → “Page Specific JS”: OAuth flow, Dropbox app + chooser, images via URL, concurrent downloads with <code>errgroup</code>. 🎉 <b>All 285 videos done.</b> (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `Watch <b>videos 264–285</b> — “Intro to OAuth” → “Page Specific JS”: OAuth flow.` },
            { id: "s2", est: 45, label: `Dropbox app + chooser.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Both primary courses are done. Next: the <b>secondary</b> Monkey tail (Phase C, on its own meter), then the checkpoint, catch-up and capstone weeks that use everything.` },
      ],
    },
    {
      id: "d131", date: "2027-05-29", week: "w36", title: "Go — OAuth & finish → 🎉 course DONE (cont.)",
      theme: "Finish “Go — OAuth & finish → 🎉 course DONE” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d130", obj: GO, cat: "watch", est: 90, group: "g1-d130", label: `Watch <b>videos 264–285</b> — “Intro to OAuth” → “Page Specific JS”: OAuth flow, Dropbox app + chooser, images via URL, concurrent downloads with <code>errgroup</code>. 🎉 <b>All 285 videos done.</b> (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Images via URL.` },
            { id: "s2", est: 45, label: `Concurrent downloads with <code>errgroup</code>. 🎉 <b>All 285 videos done.</b>` },
          ] },
      ],
    },
    {
      id: "d132", date: "2027-06-01", week: "w36", title: `Monkey Ch4 — Extending (secondary)`,
      theme: `Phase C: strings, built-ins, arrays, hashes — finishes Ball's book.`,
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 100, group: "g1", label: `<i>Writing an Interpreter in Go</i> — <b>Ch4 Extending the Interpreter</b>: strings, built-in functions (<code>len</code>), arrays + index expressions, hashes, the grand finale (pp 154–199).`,
          sub: [
            { id: "s1", est: 20, label: `<i>Writing an Interpreter in Go</i> — <b>Ch4 Extending the Interpreter</b>: strings.` },
            { id: "s2", est: 20, label: `Built-in functions (<code>len</code>).` },
            { id: "s3", est: 20, label: `Arrays + index expressions.` },
            { id: "s4", est: 20, label: `Hashes.` },
            { id: "s5", est: 20, label: `The grand finale (pp 154–199).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Divergence — Monkey spends its finale on data structures + native functions; Lox spent its late chapters on classes/inheritance. Two languages, two philosophies — you now know both intimately.` },
      ],
    },

    /* ---------------- Week 37 ---------------- */
    {
      id: "d133", date: "2027-06-02", week: "w37", title: "Monkey Ch4 — Extending (secondary) (cont.)",
      theme: "Finish “Monkey Ch4 — Extending (secondary)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d132", obj: GX, cat: "code", est: 90, group: "g1-d132", label: `Implement strings, built-ins, arrays, and hashes. 🎉 <b>Monkey is complete.</b>`,
          sub: [
            { id: "s1", est: 20, label: `Implement strings.` },
            { id: "s2", est: 20, label: `Built-ins.` },
            { id: "s3", est: 25, label: `Arrays.` },
            { id: "s4", est: 25, label: `Hashes. 🎉 <b>Monkey is complete.</b>` },
          ] },
      ],
    },
    {
      id: "d134", date: "2027-06-03", week: "w37", title: `Monkey — extend it (secondary)`,
      theme: `Make Monkey yours.`,
      tasks: [
        { id: "t1", obj: GX, cat: "project", est: 80, group: "g1", label: `<b>Secondary capstone:</b> add a feature Ball leaves out — e.g. a <code>while</code> loop, a standard-library function, or postfix operators. Compare the effort to doing the same in Lox. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: "<b>Secondary capstone:</b> pick the feature Ball leaves out (a <code>while</code> loop, a standard-library function, or postfix operators) and design it — grammar, AST node, and where it hooks in." },
            { id: "s2", est: 40, label: "Implement that feature end to end: parser, evaluator, and a couple of Monkey programs that exercise it." },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — Ball's follow-up "Writing a Compiler in Go" turns Monkey into a bytecode VM (like clox). Natural next step if the itch remains.` },
      ],
    },
    {
      id: "d135", date: "2027-06-07", week: "w37", title: "Monkey — extend it (secondary) (cont.)",
      theme: "Finish “Monkey — extend it (secondary)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d134", obj: GX, cat: "project", est: 45, group: "g1-d134", label: `<b>Secondary capstone:</b> add a feature Ball leaves out — e.g. a <code>while</code> loop, a standard-library function, or postfix operators. Compare the effort to doing the same in Lox. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Compare the effort to doing the same in Lox.` },
          ] },
      ],
    },
    {
      id: "d136", date: "2027-06-08", week: "w37", title: `Let's Go — guided exercises (project)`,
      theme: `Turn the side-book's exercises into real practice.`,
      tasks: [
        { id: "t1", obj: GO, cat: "project", est: 100, group: "g1", label: `<b><i>Let's Go</i> guided exercises (pp 392–426):</b> pick two — e.g. an About page + a "Change Password" flow — and implement them in SnippetBox.`,
          sub: [
            { id: "s1", est: 50, label: `<b><i>Let's Go</i> guided exercises (pp 392–426):</b> an About page, implemented in SnippetBox.` },
            { id: "s2", est: 50, label: `A "Change Password" flow, implemented in SnippetBox.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: add the post-login redirect exercise; it's a small but real UX + security detail.` },
      ],
    },

    /* ---------------- Week 38 ---------------- */
    {
      id: "d137", date: "2027-06-11", week: "w38", title: `Checkpoint — everything shipped`,
      theme: `Both primaries + Monkey are done. Consolidate before the capstone weeks.`,
      tasks: [
        { id: "t1", obj: CI, cat: "review", est: 40, group: "g1", label: `Write a one-page comparison: <b>jlox vs clox vs Monkey</b> — scanning, parsing (recursive-descent vs Pratt), eval (tree-walk vs bytecode), memory (GC vs Go's runtime).`,
          sub: [
            { id: "s1", est: 10, label: `Write a one-page comparison: <b>jlox vs clox vs Monkey</b> — scanning.` },
            { id: "s2", est: 10, label: `Parsing (recursive-descent vs Pratt).` },
            { id: "s3", est: 10, label: `Eval (tree-walk vs bytecode).` },
            { id: "s4", est: 10, label: `Memory (GC vs Go's runtime).` },
          ] },
        { id: "t2", obj: GO, cat: "review", est: 50, group: "g1", label: `List the Go web-dev patterns you'll reuse (MVC, sessions, migrations, middleware) and one project to build with them.`,
          sub: [
            { id: "s1", est: 25, label: `List the Go web-dev patterns you'll reuse (MVC, sessions, migrations, middleware).` },
            { id: "s2", est: 25, label: `One project to build with them.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 You finished two interpreters and a production-shaped Go web app — with two weeks still on the plan. Weeks 38–40 spend that runway on the natural sequel (a compiler) and a capstone that fuses the interpreter with the web stack.` },
      ],
    },
    {
      id: "d138", date: "2027-06-12", week: "w38", title: `clox challenge catch-up + review`,
      theme: `Buffer + mastery: revisit the clox challenges that fought back.`,
      tasks: [
        { id: "t1", obj: CI, cat: "review", est: 50, group: "g1", label: `Re-read your notes on the three hardest clox chapters (Ch24 Calls, Ch25 Closures, Ch26 GC) and re-run their challenges in your head — can you explain each without the book?`,
          sub: [
            { id: "s1", est: 25, label: `Re-read your notes on the three hardest clox chapters (Ch24 Calls, Ch25 Closures, Ch26 GC).` },
            { id: "s2", est: 25, label: `Re-run their challenges in your head — can you explain each without the book?` },
          ] },
        { id: "t2", obj: CI, cat: "challenge", est: 95, optional: true, label: `<b>If any challenge slipped:</b> finish it now — this is the deliberate catch-up slot for the whole clox challenge set (71 total across the book).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Nothing new to learn today by design — this is a shock-absorber day. If clox's 17 chapters all landed, use it to skim the Lox grammar appendix (pp 599–601) and dream up a language feature.` },
      ],
      note: `Buffer / consolidation — required load is light on purpose.`,
    },
    {
      id: "d139", date: "2027-06-13", week: "w38", title: `Writing a Compiler in Go — the bridge (secondary) (1/2)`,
      theme: `Ball's sequel turns Monkey into a bytecode VM — clox, reborn in Go.`,
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 75, group: "g1", label: `<a href="https://compilerbook.com/" target="_blank" rel="noopener"><i>Writing a Compiler in Go</i></a> — read the intro + compiler/VM basics: how Monkey's AST becomes bytecode, the stack machine, and how it mirrors what you built in clox. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `<i>Writing a Compiler in Go</i> — read the intro + compiler/VM basics: how Monkey's AST becomes bytecode.` },
            { id: "s2", est: 35, label: `The stack machine.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This is the single best consolidation of the whole roadmap: clox taught you a bytecode VM in C; here you rebuild the same machine in Go for the language you already wrote a tree-walker for. Three angles on one idea.` },
      ],
      note: `Secondary — on the muted meter, excluded from primary %.`,
    },

    /* ---------------- Week 39 ---------------- */
    {
      id: "d140", date: "2027-06-16", week: "w39", title: "Writing a Compiler in Go — the bridge (secondary) (1/2, cont.)",
      theme: "Finish “Writing a Compiler in Go — the bridge (secondary) (1/2)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d139", obj: GX, cat: "read", est: 35, group: "g1-d139", label: `<a href="https://compilerbook.com/" target="_blank" rel="noopener"><i>Writing a Compiler in Go</i></a> — read the intro + compiler/VM basics: how Monkey's AST becomes bytecode, the stack machine, and how it mirrors what you built in clox. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `How it mirrors what you built in clox.` },
          ] },
      ],
    },
    {
      id: "d141", date: "2027-06-18", week: "w39", title: `Writing a Compiler in Go — the bridge (secondary) (2/2)`,
      theme: `Ball's sequel turns Monkey into a bytecode VM — clox, reborn in Go.`,
      tasks: [
        { id: "t1", obj: GX, cat: "code", est: 100, group: "g1", label: `Build the first slice: compile integer + arithmetic expressions to bytecode and execute them on a tiny Monkey VM. You now have <b>two</b> bytecode VMs — one in C (clox), one in Go.`,
          sub: [
            { id: "s1", est: 55, label: `Build the first slice: compile integer + arithmetic expressions to bytecode.` },
            { id: "s2", est: 45, label: `Execute them on a tiny Monkey VM. You now have <b>two</b> bytecode VMs — one in C (clox), one in Go.` },
          ] },
      ],
    },
    {
      id: "d142", date: "2027-06-19", week: "w39", title: `Go — production hardening (pick one)`,
      theme: `Turn the course knowledge into one production-grade improvement.`,
      tasks: [
        { id: "t1", obj: GO, cat: "project", est: 105, group: "g1",
          sub: [
            { id: "s1", cat: "project", est: 35, label: "Pick <b>one</b> — (a) structured request logging + a <code>/healthz</code>; (b) per-IP rate limiting middleware; or (c) graceful shutdown on SIGTERM with in-flight request draining — and design it against your Calhoun/SnippetBox app." },
            { id: "s2", cat: "project", est: 35, label: "Implement it properly: wire it into the middleware chain / server lifecycle." },
            { id: "s3", cat: "project", est: 35, label: "Prove it: a test or a manual run that shows the behaviour, plus the failure case." },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <i>Let's Go</i> covers middleware (Ch6) and the server lifecycle; the video course covered deploy. This day fuses them into the kind of hardening real services need before launch.` },
      ],
    },
    {
      id: "d143", date: "2027-06-22", week: "w39", title: `Capstone I — a Monkey web playground`,
      theme: `One project that uses both primaries: a Go web app that runs Monkey.`,
      tasks: [
        { id: "t1", obj: GO, cat: "project", est: 80, group: "g1", label: `<b>Build (web side):</b> a small Go web app (MVC + templates from the course) with a code box that POSTs a Monkey snippet and renders the result.`,
          sub: [
            { id: "s1", est: 40, label: `<b>Build (web side):</b> a small Go web app (MVC + templates from the course).` },
            { id: "s2", est: 40, label: `A code box that POSTs a Monkey snippet and renders the result.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: sandbox it — cap execution steps/time so an infinite Monkey loop can't hang the server. You built the evaluator, so you know exactly where to put the guard.` },
      ],
    },

    /* ---------------- Week 40 ---------------- */
    {
      id: "d144", date: "2027-06-24", week: "w40", title: "Capstone I — a Monkey web playground (cont.)",
      theme: "Finish “Capstone I — a Monkey web playground” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d143", obj: GX, cat: "code", est: 80, group: "g1-d143", label: `<b>Wire the interpreter:</b> feed the submitted source through your Monkey lexer → parser → evaluator and return the output (or a parse/eval error) safely.`,
          sub: [
            { id: "s1", est: 40, label: `<b>Wire the interpreter:</b> feed the submitted source through your Monkey lexer → parser → evaluator.` },
            { id: "s2", est: 40, label: `Return the output (or a parse/eval error) safely.` },
          ] },
      ],
    },
    {
      id: "d145", date: "2027-06-26", week: "w40", title: `Capstone II — ship the playground`,
      theme: `Deploy it with the course's deployment skills.`,
      tasks: [
        { id: "t1", obj: GO, cat: "project", est: 105, group: "g1", label: `Deploy the playground: build it, put it behind Caddy/HTTPS on a droplet (or a container host), and load it from a real URL — reuse the bare-git / post-receive deploy from d128.`,
          sub: [
            { id: "s1", est: 35, label: `Deploy the playground: build it.` },
            { id: "s2", est: 35, label: `Put it behind Caddy/HTTPS on a droplet (or a container host).` },
            { id: "s3", est: 35, label: `Load it from a real URL — reuse the bare-git / post-receive deploy from d128.` },
          ] },
        { id: "t2", obj: GO, cat: "project", est: 50, optional: true, label: `<b>Bonus:</b> add a couple of Monkey example snippets as one-click buttons and a short "how it works" page linking the interpreter internals.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A running URL where anyone can type Monkey and see it evaluate is the most tangible possible proof you built a language. That's the whole journey in one link.` },
      ],
    },
    {
      id: "d146", date: "2027-06-27", week: "w40", title: `Grand retro — three languages, two interpreters, one web stack`,
      theme: `Close it out; capture the whole arc and choose what's next.`,
      tasks: [
        { id: "t1", obj: CI, cat: "review", est: 60, group: "g1", label: `Write the finale note: tree-walk (jlox, Monkey) vs bytecode (clox, Monkey-compiler) — when each wins; and the Go web patterns you'll carry into real work.`,
          sub: [
            { id: "s1", est: 30, label: `Write the finale note: tree-walk (jlox, Monkey) vs bytecode (clox, Monkey-compiler) — when each wins.` },
            { id: "s2", est: 30, label: `The Go web patterns you'll carry into real work.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Where the threads go next: finish <i>Writing a Compiler in Go</i> (closures + a real VM), or take a Go service to production with a queue and observability. You have the fundamentals cold now — build something you'll keep.` },
      ],
    },
    {
      id: "d147", date: "2027-06-28", week: "w40", title: "Grand retro — three languages, two interpreters, one web stack (cont.)",
      theme: "Finish “Grand retro — three languages, two interpreters, one web stack” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d146", obj: GO, cat: "review", est: 45, group: "g1-d146", label: `Pick the <b>one</b> next real project and write its first three tasks. 🎉 Roadmap complete — three languages, two interpreters, a compiler, and a shipped web app.`,
          sub: [
            { id: "s1", est: 25, label: `Pick the <b>one</b> next real project.` },
            { id: "s2", est: 20, label: `Write its first three tasks. 🎉 Roadmap complete — three languages, two interpreters, a compiler, and a shipped web app.` },
          ] },
      ],
    },
  ],

  milestones: [
    { id: "w3.m1", week: "w3", title: `jlox control flow + functions`,
      rule: { type: "tasks", require: ["d02.t1", "d09.t1"] } },
    { id: "w6.m1", week: "w6", title: `jlox classes done`,
      rule: { type: "tasks", require: ["d12.t1", "d13.t1", "d19.t1"] } },
    { id: "w9.m1", week: "w9", title: `🏁 jlox complete; clox started`,
      rule: { type: "tasks", require: ["d25.t1", "d30.t1"] } },
    { id: "w8.m1", week: "w8", title: "clox VM running",
      rule: { type: "weekPct", min: 70 } },
    { id: "w14.m1", week: "w14", title: `Pratt compiler + values`,
      rule: { type: "tasks", require: ["d44.t1", "d49.t1"] } },
    { id: "w18.m1", week: "w18", title: "Globals done; SQL relations + locals started",
      rule: { type: "weekPct", min: 70 } },
    { id: "w22.m1", week: "w22", title: `clox calls & functions`,
      rule: { type: "tasks", require: ["d79.t1"] } },
    { id: "w25.m1", week: "w25", title: `Closures + GC survived`,
      rule: { type: "tasks", require: ["d84.t1", "d88.t1"] } },
    { id: "w30.m1", week: "w30", title: `🎓 Crafting Interpreters finished`,
      rule: { type: "tasks", require: ["d108.t1"] } },
    { id: "w32.m1", week: "w32", title: "Go course ≥ video 248",
      rule: { type: "weekPct", min: 60 } },
    { id: "w36.m1", week: "w36", title: `🏁 Go web-dev course complete`,
      rule: { type: "tasks", require: ["d130.t1", "d131.t1"] } },
    { id: "w37.m1", week: "w37", title: `🎓 Monkey (secondary) finished`,
      rule: { type: "tasks", require: ["d133.t1"] } },
    { id: "w39.m1", week: "w39", title: `Compiler bridge: Monkey → bytecode`,
      rule: { type: "tasks", require: ["d141.t1"] } },
    { id: "w40.m1", week: "w40", title: `🏁 Monkey web playground shipped`,
      rule: { type: "tasks", require: ["d144.t1", "d145.t1"] } },
  ],

  features: [
    { title: "The three implementations at a glance", items: [
      `<b>jlox</b> (CI Ch4–13) — Java, tree-walking, recursive-descent parser, resolver pass.`,
      `<b>clox</b> (CI Ch14–30) — C, bytecode VM, Pratt compiler, mark-sweep GC.`,
      `<b>Monkey</b> (<a href="https://interpreterbook.com/" target="_blank" rel="noopener">Writing an Interpreter in Go</a>) — Go, tree-walking, Pratt parser; secondary.`,
    ] },
    { title: "Companions & see-also", items: [
      `<a href="https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank" rel="noopener">Pratt Parsers</a> (read at CI Ch17 / Monkey Ch2).`,
      `<a href="https://arxiv.org/abs/1611.00467" target="_blank" rel="noopener">Stack vs register VMs</a> · <a href="https://en.wikipedia.org/wiki/Tracing_garbage_collection" target="_blank" rel="noopener">Tracing GC</a>.`,
      `<a href="https://lets-go.alexedwards.net/" target="_blank" rel="noopener"><i>Let's Go</i></a> (Edwards) — the idiomatic Go web companion; SnippetBox arc + guided exercises.`,
      `Next: Ball's <a href="https://compilerbook.com/" target="_blank" rel="noopener"><i>Writing a Compiler in Go</i></a> — turn Monkey into a bytecode VM.`,
    ] },
  ],
});