// interp-go.js — Roadmap 2 (priority MEDIUM, 3–4 active days/week).
// PRIMARY: `ci` (Crafting Interpreters, resume Ch9/PDF133 — front-loaded so it
// finishes sooner) and `go` (Go web-dev video course, resume video 27, paired
// with Calhoun's book which ends at v164, then Let's Go). SECONDARY: `gointerp`
// (Writing an Interpreter in Go — separate meter, never gates primary).
// Phases: A = CI + Go (+ light gointerp see-alsos); B = gointerp activates
// alongside Go; C = appended tail finishes gointerp. Pages are real (see
// _research.md). Owner does ALL Crafting Interpreters challenges.
//
// EXTENDED (2026-07-17): the six heaviest CI chapters (Ch12/17/24/25/26/28,
// 150–175m) are each split across two adjacent calendar days — the parent day
// (dNN) keeps read+code part 1; a continuation day (d45–d50, on the previously
// empty next date) carries part 2 + that chapter's challenges. No existing id
// changes; every day is now ~90–105m. Weeks 15–16 (d51–d56) append a
// consolidation/compiler-bridge/capstone tail, moving the finish to 2026-11-05.

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
    { id: "w1",  title: "Week 1 — jlox: Control Flow → Functions", start: "2026-07-19" },
    { id: "w2",  title: "Week 2 — jlox: Resolving, Classes", start: "2026-07-26" },
    { id: "w3",  title: "Week 3 — Finish jlox; clox begins", start: "2026-08-02" },
    { id: "w4",  title: "Week 4 — clox: VM & scanning", start: "2026-08-09" },
    { id: "w5",  title: "Week 5 — clox: compiling & values", start: "2026-08-16" },
    { id: "w6",  title: "Week 6 — clox: hash tables & variables", start: "2026-08-23" },
    { id: "w7",  title: "Week 7 — clox: control flow & calls", start: "2026-08-30" },
    { id: "w8",  title: "Week 8 — clox: closures & GC", start: "2026-09-06" },
    { id: "w9",  title: "Week 9 — clox: classes; finish CI", start: "2026-09-13" },
    { id: "w10", title: "Week 10 — Phase B: Monkey begins", start: "2026-09-20" },
    { id: "w11", title: "Week 11 — Monkey parsing/eval; Go deploy", start: "2026-09-27" },
    { id: "w12", title: "Week 12 — Finish Go course", start: "2026-10-04" },
    { id: "w13", title: "Week 13 — Phase C: finish Monkey", start: "2026-10-11" },
    { id: "w14", title: "Week 14 — Extend & consolidate", start: "2026-10-18" },
    { id: "w15", title: "Week 15 — Consolidation & the compiler bridge", start: "2026-10-25" },
    { id: "w16", title: "Week 16 — Capstone & grand retro", start: "2026-11-01" },
  ],

  days: [
    /* ============ Phase A — CI (front-loaded) + Go course ============ */

    /* -- Week 1 -- */
    {
      id: "d01", date: "2026-07-19", week: "w1", title: "CI Ch9 — Control Flow (jlox)",
      theme: "Resume Crafting Interpreters in the Java tree-walker.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch9 Control Flow</b> (jlox): <code>if</code>, logical ops, <code>while</code>, <code>for</code> desugaring (pp 133–146).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement it in jlox; get <code>for</code>-as-sugar working end to end.` },
        { id: "t3", obj: CI, cat: "challenge", est: 45,
          label: `<b>Ch9 Challenges (all 3)</b> — incl. adding <code>break</code> (needs parser + interpreter changes) (p 144).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Lox's <code>for</code> is pure syntactic sugar — the parser rewrites it into a <code>while</code>. No new interpreter code needed, which is the whole point of desugaring.` },
        { id: "s2", type: "callout", label: `🔗 Bridge: <i>Writing an Interpreter in Go</i> (the secondary book) builds the same tree-walk eval in Go — we'll start it after CI. Note how differently it handles control flow.` },
      ],
    },
    {
      id: "d02", date: "2026-07-21", week: "w1", title: "Go — Templates (videos 27–36)",
      theme: "Server-side rendering, XSS, contextual encoding.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 60, group: "g1",
          label: `Watch <b>videos 27–36</b> — “What Are Templates?” → “Template Exercises”: SSR, XSS, contextual encoding, home/contact/FAQ via templates.` },
        { id: "t2", obj: GO, cat: "review", est: 30, group: "g1",
          label: `Review <b>Calhoun Ch4 Templates</b> (PDF pp 93–132) alongside the videos.` },
        { id: "t3", obj: GO, cat: "exercise", est: 30, optional: true,
          label: `<b>Bonus:</b> do the video's Template Exercises (v36).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Go's <code>html/template</code> does <b>contextual</b> auto-escaping — it escapes differently inside an attribute, a URL, or a &lt;script&gt;. That's why you use it over <code>text/template</code> for HTML.` },
      ],
    },
    {
      id: "d03", date: "2026-07-23", week: "w1", title: "CI Ch10 — Functions (jlox)",
      theme: "First-class functions, closures, return values.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 50, group: "g1",
          label: `CI — <b>Ch10 Functions</b> (jlox): function objects, call semantics, native functions, <code>return</code>, closures (pp 147–167).` },
        { id: "t2", obj: CI, cat: "code", est: 55, group: "g1",
          label: `Implement <code>LoxFunction</code>, environments-as-closures, and <code>clock()</code> native.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch10 Challenges (all 3)</b> — incl. anonymous function expressions (p 166).` },
      ],
    },

    /* -- Week 2 -- */
    {
      id: "d04", date: "2026-07-26", week: "w2", title: "CI Ch11 — Resolving & Binding (jlox)",
      theme: "The static resolution pass — the subtle one.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch11 Resolving and Binding</b> (jlox): the resolver pass, scope depths, closing the closure bug (pp 168–189).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement the <code>Resolver</code> and wire it before interpretation.` },
        { id: "t3", obj: CI, cat: "challenge", est: 45,
          label: `<b>Ch11 Challenges (all 4)</b> — incl. reporting unused locals (p 188).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This chapter fixes a real bug: without a resolution pass, a closure can see a variable declared <i>after</i> it was captured. Static resolution pins each name to a scope depth once.` },
      ],
    },
    {
      id: "d05", date: "2026-07-28", week: "w2", title: "Go — Code Org & MVC (videos 37–54)",
      theme: "Package structure, MVC, views, layouts, Tailwind.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 75, group: "g1",
          label: `Watch <b>videos 37–54</b> — “Code Organization” → “Exercises”: MVC, the views package, template validation at startup, embedding, named templates, reusable layouts, Tailwind, nav bar.` },
        { id: "t2", obj: GO, cat: "review", est: 35, group: "g1",
          label: `Review <b>Calhoun Ch5–7</b> (PDF pp 133–224) alongside.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — <i>Let's Go</i> Ch2–3 (skeleton + config/DI/errors) covers the same structural ideas with a different app; we start reading it this weekend.` },
      ],
    },
    {
      id: "d06", date: "2026-07-30", week: "w2", title: "CI Ch12 — Classes I (jlox)",
      theme: "The 27-page chapter, split across two days. Today: declarations → methods.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch12 Classes, part 1</b> (jlox): class declarations, instances, properties, methods (pp 190–205).` },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1",
          label: `Implement <code>LoxClass</code>/<code>LoxInstance</code>, property get/set, and method binding.` },
      ],
    },
    {
      id: "d45", date: "2026-07-31", week: "w2", title: "CI Ch12 — Classes II + challenges (jlox)",
      theme: "Finish Classes: `this`, initializers, and all three challenges.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 25, group: "g1",
          label: `CI — <b>Ch12 Classes, part 2</b> (jlox): <code>this</code> and constructors/initializers (pp 206–216).` },
        { id: "t2", obj: CI, cat: "code", est: 30, group: "g1",
          label: `Implement <code>this</code> binding and <code>init()</code> initializers; a class now constructs and self-references correctly.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch12 Challenges (all 3)</b> — incl. static methods & getters (p 214).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Splitting a heavy chapter over two short days beats one marathon: you code the mechanics on day 1 and let <code>this</code>/initializers (the subtle part) land fresh on day 2.` },
      ],
      note: "Continuation of Ch12 on the next calendar day — lighter than one 27-page sprint.",
    },
    {
      id: "d07", date: "2026-08-01", week: "w2", title: "Let's Go — read chunk 1 + starter",
      theme: "Biweekly mandatory read; SnippetBox skeleton.",
      tasks: [
        { id: "t1", obj: GO, cat: "book", est: 60,
          label: `<b>Mandatory read — <i>Let's Go</i> pp 11–85</b> (Ch2 Foundations + Ch3 config/logging/DI/error handling): build the runnable SnippetBox skeleton.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: type out the SnippetBox skeleton yourself rather than copy-paste — the muscle memory for <code>http.Handler</code> + routing is worth it.` },
        { id: "s2", type: "callout", label: `🔗 Secondary preview: skim the intro/Monkey tour of <i>Writing an Interpreter in Go</i> (pp 1–10) — no work yet, just meet the language you'll build after CI.` },
      ],
      note: "Lighter Go/reading day — likely Roadmap-1 overlap.",
    },

    /* -- Week 3 -- */
    {
      id: "d08", date: "2026-08-02", week: "w3", title: "CI Ch13 — Inheritance (jlox done!)",
      theme: "Superclasses, super calls — finishes the tree-walker.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 40, group: "g1",
          label: `CI — <b>Ch13 Inheritance</b> (jlox): superclasses, method inheritance, <code>super</code> (pp 217–232).` },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1",
          label: `Implement inheritance + <code>super</code>. 🎉 <b>jlox is complete</b> — a full tree-walk Lox.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch13 Challenges (all 3)</b> — incl. the class-method-resolution puzzle (p 230).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Half the book is now behind you and you have a working interpreter. Part III (clox) rebuilds all of it in C as a <b>bytecode VM</b> — faster, lower-level, and where the real systems learning is.` },
      ],
    },
    {
      id: "d09", date: "2026-08-04", week: "w3", title: "Go — Signup & REST (videos 55–62)",
      theme: "Signup page, REST intro, controllers, form parsing.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 55, group: "g1",
          label: `Watch <b>videos 55–62</b> — “Creating the Signup Page” → “Exercises”: styling, REST intro, users controller, decoupling with interfaces, form parsing, query params.` },
        { id: "t2", obj: GO, cat: "review", est: 30, group: "g1",
          label: `Review <b>Calhoun Ch8 The Signup Page</b> (PDF pp 225–260).` },
      ],
    },
    {
      id: "d10", date: "2026-08-06", week: "w3", title: "CI Ch14 — Chunks of Bytecode (clox)",
      theme: "clox begins — the C bytecode VM.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 50, group: "g1",
          label: `CI — <b>Ch14 Chunks of Bytecode</b> (clox): dynamic arrays, op codes, constants, line info, disassembler (pp 233–256).` },
        { id: "t2", obj: CI, cat: "code", est: 55, group: "g1",
          label: `Build <code>chunk.c</code>, the <code>OpCode</code> set, constant pool, and disassembler in C.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch14 Challenges (all 3)</b> — incl. run-length encoding line numbers & <code>OP_CONSTANT_LONG</code> (p 254).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — clox is a <b>stack-based</b> VM; Lua is register-based. Worth a skim: <a href="https://arxiv.org/abs/1611.00467" target="_blank" rel="noopener">stack vs register VMs</a>.` },
      ],
    },

    /* -- Week 4 -- */
    {
      id: "d11", date: "2026-08-09", week: "w4", title: "CI Ch15 — A Virtual Machine (clox)",
      theme: "The interpreter loop, the value stack.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch15 A Virtual Machine</b> (clox): the <code>run()</code> loop, the value stack, arithmetic (pp 257–276).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement the VM dispatch loop and stack; get arithmetic executing.` },
        { id: "t3", obj: CI, cat: "challenge", est: 45,
          label: `<b>Ch15 Challenges (all 4)</b> — incl. the stack-manipulation & negation-in-place questions (p 274).` },
      ],
    },
    {
      id: "d12", date: "2026-08-11", week: "w4", title: "Go — Databases (videos 63–89)",
      theme: "Postgres, SQL, querying with Go — a big cluster.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 90, group: "g1",
          label: `Watch <b>videos 63–89</b> — “Intro to Databases” → “Syncing the Book and Screencasts Source Code”: Postgres, tables/types/constraints, CRUD, connecting from Go, SQL injection, querying single/multiple records, ORMs vs SQL.` },
        { id: "t2", obj: GO, cat: "review", est: 40, group: "g1",
          label: `Review <b>Calhoun Ch9–10</b> (PDF pp 261–346).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Calhoun hand-writes SQL with <code>database/sql</code> rather than an ORM — deliberately. You'll feel the boilerplate, which is exactly why you'll appreciate (and critique) ORMs later.` },
      ],
      note: "Heavy watch day — no CI block.",
    },
    {
      id: "d13", date: "2026-08-13", week: "w4", title: "CI Ch16 — Scanning on Demand (clox)",
      theme: "The clox scanner — no separate token list.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch16 Scanning on Demand</b> (clox): the pull-based scanner, tokens without heap allocation (pp 277–296).` },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1",
          label: `Implement <code>scanner.c</code>; the compiler will pull tokens one at a time.` },
        { id: "t3", obj: CI, cat: "challenge", est: 35,
          label: `<b>Ch16 Challenges (all 3)</b> (p 295).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — this is the same job as <i>Writing an Interpreter in Go</i> Ch1 “Lexing”. clox scans on demand; Monkey builds a lexer struct. Same idea, different lifetime.` },
      ],
    },

    /* -- Week 5 -- */
    {
      id: "d14", date: "2026-08-16", week: "w5", title: "CI Ch17 — Compiling Expressions I (clox, Pratt)",
      theme: "The dense idea — the Pratt parser — split over two days. Today: the core.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch17 Compiling Expressions, part 1</b> (clox): single-pass compilation, the <b>Pratt parser</b> — the precedence table and how prefix/infix rules dispatch (pp 297–310).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement the core of the Pratt <code>compiler.c</code> — the precedence-climbing loop and the parse-rule table.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Read alongside — Nystrom's own <a href="https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank" rel="noopener">“Pratt Parsers: Expression Parsing Made Easy”</a>. When the precedence table feels magical, this un-magics it.` },
        { id: "s2", type: "hint", label: `💡 This is <b>the</b> chapter that maps to <i>Writing an Interpreter in Go</i> §2.6 — Monkey's parser is Pratt too, while jlox used recursive descent. You'll recognize this technique when you start Monkey.` },
      ],
    },
    {
      id: "d46", date: "2026-08-17", week: "w5", title: "CI Ch17 — Pratt parser II + challenges (clox)",
      theme: "Finish the compiler: the remaining rules, then all three challenges.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 20, group: "g1",
          label: `CI — <b>Ch17, part 2</b> (clox): unary/grouping/number/literal parse fns and how the table wires them (pp 311–317).` },
        { id: "t2", obj: CI, cat: "code", est: 25, group: "g1",
          label: `Finish the prefix/infix rule set and emit bytecode for full expressions; run them through the VM.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch17 Challenges (all 3)</b> (p 316).` },
      ],
      note: "Continuation of the Pratt chapter — the challenges get a fresh head instead of a tired one.",
    },
    {
      id: "d15", date: "2026-08-18", week: "w5", title: "CI Ch18 — Types of Values (clox)",
      theme: "A tagged union for Lox values.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 35, group: "g1",
          label: `CI — <b>Ch18 Types of Values</b> (clox): the tagged-union <code>Value</code>, booleans, nil, comparisons (pp 318–331).` },
        { id: "t2", obj: CI, cat: "code", est: 40, group: "g1",
          label: `Implement the <code>Value</code> union and equality/comparison ops.` },
        { id: "t3", obj: CI, cat: "challenge", est: 30,
          label: `<b>Ch18 Challenges (both)</b> (p 331).` },
      ],
    },
    {
      id: "d16", date: "2026-08-20", week: "w5", title: "CI Ch19 — Strings (clox)",
      theme: "Heap-allocated objects enter the VM.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 40, group: "g1",
          label: `CI — <b>Ch19 Strings</b> (clox): the <code>Obj</code> heap type, string objects, concatenation, the object linked-list (pp 332–348).` },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1",
          label: `Implement <code>ObjString</code> and string concatenation; track objects for later GC.` },
        { id: "t3", obj: CI, cat: "challenge", est: 35,
          label: `<b>Ch19 Challenges (all 3)</b> (p 346).` },
      ],
    },

    /* -- Week 6 -- */
    {
      id: "d17", date: "2026-08-23", week: "w6", title: "Let's Go — read chunk 2 + Go forms tryout",
      theme: "Biweekly mandatory read; DB + dynamic templates.",
      tasks: [
        { id: "t1", obj: GO, cat: "book", est: 65,
          label: `<b>Mandatory read — <i>Let's Go</i> pp 86–161</b> (Ch4 DB layer + Ch5 dynamic templates): SnippetBox now reads/writes MySQL and renders live data safely.` },
        { id: "t2", obj: GO, cat: "project", est: 45, optional: true,
          label: `<b>Try this:</b> adapt one <i>Let's Go</i> pattern (e.g. the template cache) into your Calhoun app.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Two Go stacks side by side: Calhoun rolls more by hand; <i>Let's Go</i> is more idiomatic/production-shaped. Noticing where they differ (routing, DI, templates) teaches you the design space.` },
      ],
    },
    {
      id: "d18", date: "2026-08-25", week: "w6", title: "Go — Passwords & bcrypt (videos 90–106)",
      theme: "Hashing, salting, bcrypt, sign-in.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 65, group: "g1",
          label: `Watch <b>videos 90–106</b> — “Steps for Securing Passwords” → “Process Sign In Attempts”: hash functions, salting, bcrypt CLI + in Go, UserService, sign-in flow.` },
        { id: "t2", obj: GO, cat: "review", est: 30, group: "g1",
          label: `Review <b>Calhoun Ch11–12</b> (PDF pp 347–400).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Cross-roadmap echo — this is the same bcrypt you used in the Roadmaps app's own login. Note how identical the hash/verify shape is across Go and PHP.` },
      ],
    },
    {
      id: "d19", date: "2026-08-27", week: "w6", title: "CI Ch20 — Hash Tables (clox)",
      theme: "Build a hash table from scratch in C.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch20 Hash Tables</b> (clox): open addressing, FNV-1a hashing, tombstones, string interning setup (pp 349–372).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement <code>table.c</code> with linear probing and tombstones.` },
        { id: "t3", obj: CI, cat: "challenge", est: 35,
          label: `<b>Ch20 Challenges (all 3)</b> (p 371).` },
      ],
    },

    /* -- Week 7 -- */
    {
      id: "d20", date: "2026-08-30", week: "w7", title: "CI Ch21 — Global Variables (clox)",
      theme: "Global variable statements and the string-intern table.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 40, group: "g1",
          label: `CI — <b>Ch21 Global Variables</b> (clox): global declarations, the globals table, string interning (pp 373–390).` },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1",
          label: `Implement globals + interning; wire the compiler to emit define/get/set.` },
        { id: "t3", obj: CI, cat: "challenge", est: 30,
          label: `<b>Ch21 Challenges (all 3)</b> (p 389).` },
      ],
    },
    {
      id: "d21", date: "2026-09-01", week: "w7", title: "Go — SQL relations & migrations (videos 138–155)",
      theme: "Foreign keys, joins, indexes, schema migrations (goose).",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 70, group: "g1",
          label: `Watch <b>videos 138–155</b> — “SQL Relationships” → “Removing Old SQL Files”: FKs, ON DELETE CASCADE, joins, indexes, ON CONFLICT, schema migrations with <code>goose</code>, embedding migrations.` },
        { id: "t2", obj: GO, cat: "review", est: 30, group: "g1",
          label: `Review <b>Calhoun Ch15–16</b> (PDF pp 529–574).` },
      ],
      note: "Note: videos 107–137 (Cookies/Sessions/CSRF) are covered on d24; this week jumps to the SQL cluster to balance load — reorder freely.",
    },
    {
      id: "d22", date: "2026-09-03", week: "w7", title: "CI Ch22 — Local Variables (clox)",
      theme: "Locals on the stack, scope resolution at compile time.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 40, group: "g1",
          label: `CI — <b>Ch22 Local Variables</b> (clox): compile-time scope tracking, stack slots, no runtime lookup (pp 391–404).` },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1",
          label: `Implement local slots and scope depth in the compiler.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch22 Challenges (all 4)</b> (p 404).` },
      ],
    },

    /* -- Week 8 -- */
    {
      id: "d23", date: "2026-09-06", week: "w8", title: "CI Ch23 — Jumping Back and Forth (clox)",
      theme: "Control flow via jump bytecodes + backpatching.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch23 Jumping Back and Forth</b> (clox): <code>if</code>/<code>while</code>/<code>for</code> via jumps, backpatching, logical operators (pp 405–424).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement jump emission + backpatching; get loops running on the VM.` },
        { id: "t3", obj: CI, cat: "challenge", est: 35,
          label: `<b>Ch23 Challenges (all 3)</b> — incl. adding <code>switch</code>/<code>continue</code> (p 420).` },
        { id: "t4", obj: GX, cat: "prep", est: 20, preread: true, optional: true,
          label: `<b>Secondary starter (pre-read):</b> skim <i>Writing an Interpreter in Go</i> §1.1–1.3 (pp 11–21) — how Monkey tokenizes. It activates for real after CI.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 The Go interpreter book (secondary) is now close — this pre-read primes the switch. It stays on its own meter and won't touch your primary progress.` },
      ],
    },
    {
      id: "d24", date: "2026-09-08", week: "w8", title: "Go — Cookies, Sessions & CSRF (videos 107–137)",
      theme: "The big auth-state cluster.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 95, group: "g1",
          label: `Watch <b>videos 107–137</b> — “Stateless Servers” → “Sign Out Link”: cookies, XSS/theft, CSRF middleware, secure tokens (<code>crypto/rand</code>), the sessions table & service, sign-out.` },
        { id: "t2", obj: GO, cat: "review", est: 40, group: "g1",
          label: `Review <b>Calhoun Ch13–14</b> (PDF pp 401–528).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 “Why 32 bytes for session tokens?” (v124) is a great security aside — enough entropy that guessing is infeasible. Same reasoning behind the Roadmaps app's own session id.` },
      ],
      note: "Heavy watch day — no CI block.",
    },
    {
      id: "d25", date: "2026-09-10", week: "w8", title: "CI Ch24 — Calls and Functions I (clox)",
      theme: "The 32-page chapter, split over two days. Today: function objects + call frames.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch24 Calls and Functions, part 1</b> (clox): function objects, compiling a function body, and the <code>CallFrame</code> model (pp 425–445).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement <code>ObjFunction</code>, the compiler's function scaffolding, and the <code>CallFrame</code> array on the VM.` },
      ],
    },
    {
      id: "d47", date: "2026-09-11", week: "w8", title: "CI Ch24 — Calls II: natives + challenges (clox)",
      theme: "Finish calls: arguments, native functions, stack overflow, then all four challenges.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 30, group: "g1",
          label: `CI — <b>Ch24, part 2</b> (clox): calling functions, argument passing, native functions, and stack-overflow detection (pp 446–456).` },
        { id: "t2", obj: CI, cat: "code", est: 35, group: "g1",
          label: `Wire up <code>OP_CALL</code>, argument checking, a native (<code>clock()</code>), and the call-depth guard.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch24 Challenges (all 4)</b> (p 455).` },
      ],
      note: "Continuation of the heavy Ch24 — call frames yesterday, the tricky call/return glue today.",
    },

    /* -- Week 9 -- */
    {
      id: "d26", date: "2026-09-13", week: "w9", title: "CI Ch25 — Closures I (clox)",
      theme: "The longest clox chapter (35pp), split over two days. Today: upvalues + capture.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch25 Closures, part 1</b> (clox): <code>ObjClosure</code>, upvalues, and capturing local variables (pp 457–478).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement <code>ObjClosure</code> and open upvalues; get a closure that reads a captured local while it's still on the stack.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Upvalues are the clox answer to the closure problem jlox solved with the resolver (Ch11). Same problem — a captured variable outliving its scope — two very different machines.` },
      ],
      note: "Split day 1 of the longest chapter — capture today, closing-over-the-stack tomorrow.",
    },
    {
      id: "d48", date: "2026-09-14", week: "w9", title: "CI Ch25 — Closures II: closing upvalues + challenges",
      theme: "The subtle half: closing upvalues when a local leaves the stack.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 30, group: "g1",
          label: `CI — <b>Ch25 Closures, part 2</b> (clox): closing upvalues when the variable pops off the stack, the open-upvalue list (pp 479–491).` },
        { id: "t2", obj: CI, cat: "code", est: 30, group: "g1",
          label: `Implement <code>OP_CLOSE_UPVALUE</code> and the open-upvalue linked list; a returned closure now outlives its frame correctly.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch25 Challenges (all 3)</b> (p 487).` },
      ],
      note: "Continuation of the longest CI chapter — the part where closures actually get hard.",
    },
    {
      id: "d27", date: "2026-09-15", week: "w9", title: "CI Ch26 — Garbage Collection I (clox)",
      theme: "The toughest chapter, split in two. Today: the mark phase and roots.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch26 GC, part 1</b> (clox): reachability, the tricolor abstraction, marking roots and tracing references (pp 492–508).` },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1",
          label: `Implement <code>markRoots</code> + the mark/tracing phase and the gray stack; verify live objects go black.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Background — <a href="https://en.wikipedia.org/wiki/Tracing_garbage_collection" target="_blank" rel="noopener">tracing GC</a> (tricolor, generational) situates clox's collector in the wider family.` },
      ],
      note: "Split day 1 of the hardest chapter — mark today, sweep + 'collect during allocation' bugs tomorrow.",
    },
    {
      id: "d49", date: "2026-09-16", week: "w9", title: "CI Ch26 — GC II: sweep + challenges (clox)",
      theme: "The dangerous half: sweep, when to collect, and the allocation-time bugs.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 30, group: "g1",
          label: `CI — <b>Ch26 GC, part 2</b> (clox): the sweep phase, weak references (the string table), and the collection-frequency heuristic (pp 509–518).` },
        { id: "t2", obj: CI, cat: "code", est: 35, group: "g1",
          label: `Implement sweep + the grow-heap heuristic; chase down the "collect during allocation" bugs that make GC infamous.` },
        { id: "t3", obj: CI, cat: "challenge", est: 35,
          label: `<b>Ch26 Challenges (all 3)</b> (p 517).` },
      ],
      note: "Continuation of GC — the part where a wrong root eats a live object. Fresh head recommended.",
    },
    {
      id: "d28", date: "2026-09-17", week: "w9", title: "CI Ch27 — Classes and Instances (clox)",
      theme: "Lightest clox chapter — classes and fields.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 35, group: "g1",
          label: `CI — <b>Ch27 Classes and Instances</b> (clox): class objects, instances, fields (pp 519–531).` },
        { id: "t2", obj: CI, cat: "code", est: 40, group: "g1",
          label: `Implement <code>ObjClass</code>/<code>ObjInstance</code> and property get/set.` },
        { id: "t3", obj: CI, cat: "challenge", est: 40,
          label: `<b>Ch27 Challenges (all 4)</b> (p 531).` },
      ],
    },

    /* -- Week 10 (finish CI; Phase B begins) -- */
    {
      id: "d29", date: "2026-09-20", week: "w10", title: "CI Ch28 — Methods & Initializers I (clox)",
      theme: "26-page chapter, split in two. Today: methods and bound methods.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 40, group: "g1",
          label: `CI — <b>Ch28 Methods, part 1</b> (clox): method declarations, <code>ObjBoundMethod</code>, and <code>this</code> on the VM (pp 532–547).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement methods and bound methods; calling <code>instance.method()</code> now binds <code>this</code> correctly.` },
      ],
    },
    {
      id: "d50", date: "2026-09-21", week: "w10", title: "CI Ch28 — Initializers + invoke opt + challenges",
      theme: "Finish: initializers and the OP_INVOKE fast path, then all three challenges.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 25, group: "g1",
          label: `CI — <b>Ch28, part 2</b> (clox): initializers, and the <code>OP_INVOKE</code>/<code>OP_SUPER_INVOKE</code> fast path that skips the bound-method allocation (pp 548–557).` },
        { id: "t2", obj: CI, cat: "code", est: 30, group: "g1",
          label: `Implement <code>init()</code> and the invoke optimization; benchmark a method-heavy loop before/after.` },
        { id: "t3", obj: CI, cat: "challenge", est: 35,
          label: `<b>Ch28 Challenges (all 3)</b> (p 555).` },
      ],
      note: "Continuation of Ch28 — the optimization half lands better on a fresh day.",
    },
    {
      id: "d30", date: "2026-09-22", week: "w10", title: "Go — Password reset & email (videos 165–194)",
      theme: "Video-only cluster (Calhoun ended) — pair with Let's Go.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 90, group: "g1",
          label: `Watch <b>videos 165–194</b> — “Password Reset Overview” → “Using Public Errors”: SMTP, email service, reset tokens & flow, async email, public vs internal errors, alerts.` },
        { id: "t2", obj: GO, cat: "book", est: 30, group: "g1",
          label: `<b>Companion (Calhoun ends at v164):</b> read <i>Let's Go</i> Ch9 Stateful HTTP & flash messages (pp 225–241) for the sessions/flash pattern.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ From here the video course goes beyond the Calhoun book (which ends at Ch17 / video 164). <i>Let's Go</i> becomes the book companion for the remaining clusters.` },
      ],
    },
    {
      id: "d31", date: "2026-09-24", week: "w10", title: "CI Ch29 — Superclasses (clox)",
      theme: "Inheritance and super calls in the VM.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 40, group: "g1",
          label: `CI — <b>Ch29 Superclasses</b> (clox): inheritance, method copy-down, <code>super</code> invocation (pp 558–573).` },
        { id: "t2", obj: CI, cat: "code", est: 45, group: "g1",
          label: `Implement inheritance + <code>super</code> on the VM.` },
        { id: "t3", obj: CI, cat: "challenge", est: 35,
          label: `<b>Ch29 Challenges (all 3)</b> (p 571).` },
      ],
    },
    {
      id: "d32", date: "2026-09-26", week: "w10", title: "CI Ch30 — Optimization → 🎉 CI DONE",
      theme: "Final chapter — hashing & NaN boxing. Crafting Interpreters complete.",
      tasks: [
        { id: "t1", obj: CI, cat: "read", est: 45, group: "g1",
          label: `CI — <b>Ch30 Optimization</b> (clox): faster hashing, NaN boxing, benchmarking (pp 574–597).` },
        { id: "t2", obj: CI, cat: "code", est: 50, group: "g1",
          label: `Implement NaN boxing (guarded by a flag) and benchmark before/after. 🎉 <b>Crafting Interpreters finished — both interpreters, all 71 challenges.</b>` },
        { id: "t3", obj: CI, cat: "challenge", est: 30,
          label: `<b>Ch30 Challenges (all 3)</b> (p 597).` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: read the Lox grammar appendix (pp 599–601) and add one small language feature of your own to clox.` },
        { id: "s2", type: "callout", label: `🔗 Next up (secondary): <i>Writing an Interpreter in Go</i> now activates — build Monkey and compare every decision to Lox.` },
      ],
    },

    /* -- Week 11: Phase B — Monkey (secondary) + Go continues -- */
    {
      id: "d33", date: "2026-09-27", week: "w11", title: "Monkey Ch1 — Lexing (secondary)",
      theme: "Phase B: the Go interpreter book activates.",
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 40, group: "g1",
          label: `<i>Writing an Interpreter in Go</i> — <b>Ch1 Lexing</b>: tokens, the lexer, extending the token set, REPL start (pp 11–29).` },
        { id: "t2", obj: GX, cat: "code", est: 45, group: "g1",
          label: `Build Monkey's lexer + a REPL in Go.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 You just wrote two scanners in CI (jlox's and clox's). Monkey's lexer will feel easy — notice how Go's slices + structs change the ergonomics vs C.` },
      ],
      note: "Secondary work — shows on the muted meter, excluded from primary %.",
    },
    {
      id: "d34", date: "2026-09-29", week: "w11", title: "Go — Galleries CRUD (videos 195–217)",
      theme: "Video-only — the galleries feature.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 80, group: "g1",
          label: `Watch <b>videos 195–217</b> — “Galleries Overview” → “Delete Gallery Handler”: gallery model & migrations, CRUD handlers, routing/CSRF fixes, functional options.` },
        { id: "t2", obj: GO, cat: "book", est: 30, group: "g1",
          label: `<b>Companion:</b> <i>Let's Go</i> Ch8 Processing Forms (pp 193–224) — form parsing/validation done idiomatically.` },
      ],
    },
    {
      id: "d35", date: "2026-10-01", week: "w11", title: "Monkey Ch2 — Parsing (secondary, Pratt)",
      theme: "Ball's Pratt parser — you just built one in CI Ch17.",
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 55, group: "g1",
          label: `<i>Writing an Interpreter in Go</i> — <b>Ch2 Parsing</b>: AST, <code>let</code>/<code>return</code>, Pratt expression parsing, extending to bool/if/fn/call (pp 30–104).` },
        { id: "t2", obj: GX, cat: "code", est: 60, group: "g1",
          label: `Build Monkey's Pratt parser and AST.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — jlox used <b>recursive descent</b>; Monkey (like clox Ch17) uses <b>Pratt</b>. Having done both, this is where the two books rhyme most. Compare Ball §2.7 to Nystrom's Ch17 directly.` },
      ],
    },

    /* -- Week 12: finish Go course; Monkey eval -- */
    {
      id: "d36", date: "2026-10-04", week: "w12", title: "Let's Go — read chunk 4 (auth + testing)",
      theme: "Biweekly mandatory read; user accounts + full test suite.",
      tasks: [
        { id: "t1", obj: GO, cat: "book", est: 70,
          label: `<b>Mandatory read — <i>Let's Go</i> pp 260–388</b> (Ch11 Auth+CSRF, Ch12 request context, Ch13 embed/generics, Ch14 Testing): SnippetBox gets accounts and a real test suite.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: write one end-to-end test (Ch14 style) against your Calhoun app's sign-in flow.` },
      ],
    },
    {
      id: "d37", date: "2026-10-06", week: "w12", title: "Go — Images & config (videos 218–248)",
      theme: "Image uploads + config/Docker/Tailwind.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 90, group: "g1",
          label: `Watch <b>videos 218–248</b> — “Images Overview” → “Caddy Server via Docker”: file uploads, content-type detection, filename vulns, ENV config, Docker Compose, Tailwind build, static assets.` },
        { id: "t2", obj: GO, cat: "book", est: 25, group: "g1",
          label: `<b>Companion:</b> <i>Let's Go</i> Ch10 Security improvements / TLS (pp 242–259).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 “Checking for Filename Vulnerabilities” (v231) is the security highlight — path traversal via upload filenames. Same class of bug as the Roadmaps router blocking dot-files.` },
      ],
      note: "Heavy watch day.",
    },
    {
      id: "d38", date: "2026-10-08", week: "w12", title: "Monkey Ch3 — Evaluation (secondary)",
      theme: "Tree-walking eval, environments, closures in Go.",
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 50, group: "g1",
          label: `<i>Writing an Interpreter in Go</i> — <b>Ch3 Evaluation</b>: object system, evaluating expressions, conditionals, <code>return</code>, errors, environments, functions & closures (pp 105–153).` },
        { id: "t2", obj: GX, cat: "code", est: 55, group: "g1",
          label: `Build Monkey's evaluator; get closures & environments working.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — Ball §3.9 Environment ↔ CI jlox Ch8; §3.10 closures ↔ jlox Ch10 + Ch11 resolver. You solved this exact problem three ways now (jlox env, clox upvalues, Monkey env).` },
      ],
    },

    /* -- Week 13: Phase C — finish Go course, then finish Monkey -- */
    {
      id: "d39", date: "2026-10-11", week: "w13", title: "Go — Deployment (videos 249–263)",
      theme: "Ship it: droplet, DNS, prod env, deploy via git.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 70, group: "g1",
          label: `Watch <b>videos 249–263</b> — “Creating a Digital Ocean Droplet” → “Logging Services”: server setup, DNS, bare git repo deploy, prod <code>.env</code>/Caddyfile, post-receive deploy hooks.` },
        { id: "t2", obj: GO, cat: "project", est: 30, optional: true,
          label: `<b>Try this:</b> deploy your app (or SnippetBox) to a real host following the video steps.` },
      ],
    },
    {
      id: "d40", date: "2026-10-13", week: "w13", title: "Go — OAuth & finish → 🎉 course DONE",
      theme: "OAuth/Dropbox + the final videos. 285/285.",
      tasks: [
        { id: "t1", obj: GO, cat: "watch", est: 80, group: "g1",
          label: `Watch <b>videos 264–285</b> — “Intro to OAuth” → “Page Specific JS”: OAuth flow, Dropbox app + chooser, images via URL, concurrent downloads with <code>errgroup</code>. 🎉 <b>All 285 videos done.</b>` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Both primaries are now finished. What remains is the <b>secondary</b> Monkey tail (Phase C) — on its own meter, at your own pace.` },
      ],
    },
    {
      id: "d41", date: "2026-10-15", week: "w13", title: "Monkey Ch4 — Extending (secondary)",
      theme: "Phase C: strings, built-ins, arrays, hashes — finishes Ball's book.",
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 45, group: "g1",
          label: `<i>Writing an Interpreter in Go</i> — <b>Ch4 Extending the Interpreter</b>: strings, built-in functions (<code>len</code>), arrays + index expressions, hashes, the grand finale (pp 154–199).` },
        { id: "t2", obj: GX, cat: "code", est: 50, group: "g1",
          label: `Implement strings, built-ins, arrays, and hashes. 🎉 <b>Monkey is complete.</b>` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Divergence — Monkey spends its finale on data structures + native functions; Lox spent its late chapters on classes/inheritance. Two languages, two philosophies — you now know both intimately.` },
      ],
    },

    /* -- Week 14: extend & retro -- */
    {
      id: "d42", date: "2026-10-18", week: "w14", title: "Monkey — extend it (secondary)",
      theme: "Make Monkey yours.",
      tasks: [
        { id: "t1", obj: GX, cat: "project", est: 70, group: "g1",
          label: `<b>Secondary capstone:</b> add a feature Ball leaves out — e.g. a <code>while</code> loop, a standard-library function, or postfix operators. Compare the effort to doing the same in Lox.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — Ball's follow-up "Writing a Compiler in Go" turns Monkey into a bytecode VM (like clox). Natural next step if the itch remains.` },
      ],
    },
    {
      id: "d43", date: "2026-10-20", week: "w14", title: "Let's Go — guided exercises (project)",
      theme: "Turn the side-book's exercises into real practice.",
      tasks: [
        { id: "t1", obj: GO, cat: "project", est: 60, group: "g1",
          label: `<b><i>Let's Go</i> guided exercises (pp 392–426):</b> pick two — e.g. an About page + a "Change Password" flow — and implement them in SnippetBox.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: add the post-login redirect exercise; it's a small but real UX + security detail.` },
      ],
    },
    {
      id: "d44", date: "2026-10-22", week: "w14", title: "Checkpoint — everything shipped",
      theme: "Both primaries + Monkey are done. Consolidate before the capstone weeks.",
      tasks: [
        { id: "t1", obj: CI, cat: "review", est: 35, group: "g1",
          label: `Write a one-page comparison: <b>jlox vs clox vs Monkey</b> — scanning, parsing (recursive-descent vs Pratt), eval (tree-walk vs bytecode), memory (GC vs Go's runtime).` },
        { id: "t2", obj: GO, cat: "review", est: 30, group: "g1",
          label: `List the Go web-dev patterns you'll reuse (MVC, sessions, migrations, middleware) and one project to build with them.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 You finished two interpreters and a production-shaped Go web app — with two weeks still on the plan. Weeks 15–16 spend that runway on the natural sequel (a compiler) and a capstone that fuses the interpreter with the web stack.` },
      ],
    },

    /* ================================================================ *
     *  Week 15 — Consolidation & the compiler bridge  (extension: absorb
     *  any CI challenge backlog, then the natural sequel — turning Monkey
     *  into a bytecode VM, the clox idea reborn in Go.)
     * ================================================================ */
    {
      id: "d51", date: "2026-10-25", week: "w15", title: "clox challenge catch-up + review",
      theme: "Buffer + mastery: revisit the clox challenges that fought back.",
      tasks: [
        { id: "t1", obj: CI, cat: "review", est: 30, group: "g1",
          label: `Re-read your notes on the three hardest clox chapters (Ch24 Calls, Ch25 Closures, Ch26 GC) and re-run their challenges in your head — can you explain each without the book?` },
        { id: "t2", obj: CI, cat: "challenge", est: 40, optional: true,
          label: `<b>If any challenge slipped:</b> finish it now — this is the deliberate catch-up slot for the whole clox challenge set (71 total across the book).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Nothing new to learn today by design — this is a shock-absorber day. If clox's 17 chapters all landed, use it to skim the Lox grammar appendix (pp 599–601) and dream up a language feature.` },
      ],
      note: "Buffer / consolidation — required load is light on purpose.",
    },
    {
      id: "d52", date: "2026-10-27", week: "w15", title: "Writing a Compiler in Go — the bridge (secondary)",
      theme: "Ball's sequel turns Monkey into a bytecode VM — clox, reborn in Go.",
      tasks: [
        { id: "t1", obj: GX, cat: "read", est: 50, group: "g1",
          label: `<i>Writing a Compiler in Go</i> — read the intro + compiler/VM basics: how Monkey's AST becomes bytecode, the stack machine, and how it mirrors what you built in clox.` },
        { id: "t2", obj: GX, cat: "code", est: 55, group: "g1",
          label: `Build the first slice: compile integer + arithmetic expressions to bytecode and execute them on a tiny Monkey VM. You now have <b>two</b> bytecode VMs — one in C (clox), one in Go.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This is the single best consolidation of the whole roadmap: clox taught you a bytecode VM in C; here you rebuild the same machine in Go for the language you already wrote a tree-walker for. Three angles on one idea.` },
      ],
      note: "Secondary — on the muted meter, excluded from primary %.",
    },
    {
      id: "d53", date: "2026-10-29", week: "w15", title: "Go — production hardening (pick one)",
      theme: "Turn the course knowledge into one production-grade improvement.",
      tasks: [
        { id: "t1", obj: GO, cat: "project", est: 60, group: "g1",
          label: `Pick <b>one</b> and add it properly to your Calhoun/SnippetBox app: (a) structured request logging + a <code>/healthz</code>; (b) per-IP rate limiting middleware; or (c) graceful shutdown on SIGTERM with in-flight request draining.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <i>Let's Go</i> covers middleware (Ch6) and the server lifecycle; the video course covered deploy. This day fuses them into the kind of hardening real services need before launch.` },
      ],
    },

    /* ================================================================ *
     *  Week 16 — Capstone & grand retro  (fuse the interpreter with the
     *  web stack, ship it, then the real close-out.)
     * ================================================================ */
    {
      id: "d54", date: "2026-11-01", week: "w16", title: "Capstone I — a Monkey web playground",
      theme: "One project that uses both primaries: a Go web app that runs Monkey.",
      tasks: [
        { id: "t1", obj: GO, cat: "project", est: 45, group: "g1",
          label: `<b>Build (web side):</b> a small Go web app (MVC + templates from the course) with a code box that POSTs a Monkey snippet and renders the result.` },
        { id: "t2", obj: GX, cat: "code", est: 45, group: "g1",
          label: `<b>Wire the interpreter:</b> feed the submitted source through your Monkey lexer → parser → evaluator and return the output (or a parse/eval error) safely.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: sandbox it — cap execution steps/time so an infinite Monkey loop can't hang the server. You built the evaluator, so you know exactly where to put the guard.` },
      ],
    },
    {
      id: "d55", date: "2026-11-03", week: "w16", title: "Capstone II — ship the playground",
      theme: "Deploy it with the course's deployment skills.",
      tasks: [
        { id: "t1", obj: GO, cat: "project", est: 55, group: "g1",
          label: `Deploy the playground: build it, put it behind Caddy/HTTPS on a droplet (or a container host), and load it from a real URL — reuse the bare-git / post-receive deploy from d39.` },
        { id: "t2", obj: GO, cat: "project", est: 30, optional: true,
          label: `<b>Bonus:</b> add a couple of Monkey example snippets as one-click buttons and a short "how it works" page linking the interpreter internals.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A running URL where anyone can type Monkey and see it evaluate is the most tangible possible proof you built a language. That's the whole journey in one link.` },
      ],
    },
    {
      id: "d56", date: "2026-11-05", week: "w16", title: "Grand retro — three languages, two interpreters, one web stack",
      theme: "Close it out; capture the whole arc and choose what's next.",
      tasks: [
        { id: "t1", obj: CI, cat: "review", est: 35, group: "g1",
          label: `Write the finale note: tree-walk (jlox, Monkey) vs bytecode (clox, Monkey-compiler) — when each wins; and the Go web patterns you'll carry into real work.` },
        { id: "t2", obj: GO, cat: "review", est: 25, group: "g1",
          label: `Pick the <b>one</b> next real project and write its first three tasks. 🎉 Roadmap complete — three languages, two interpreters, a compiler, and a shipped web app.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Where the threads go next: finish <i>Writing a Compiler in Go</i> (closures + a real VM), or take a Go service to production with a queue and observability. You have the fundamentals cold now — build something you'll keep.` },
      ],
    },
  ],

  milestones: [
    { id: "w1.m1", week: "w1", title: "jlox control flow + functions",
      rule: { type: "tasks", require: ["d01.t2", "d03.t2"] } },
    { id: "w2.m1", week: "w2", title: "jlox classes done",
      rule: { type: "tasks", require: ["d04.t2", "d06.t2"] } },
    { id: "w3.m1", week: "w3", title: "🏁 jlox complete; clox started",
      rule: { type: "tasks", require: ["d08.t2", "d10.t2"] } },
    { id: "w4.m1", week: "w4", title: "clox VM running", rule: { type: "weekPct", min: 70 } },
    { id: "w5.m1", week: "w5", title: "Pratt compiler + values",
      rule: { type: "tasks", require: ["d14.t2", "d15.t2"] } },
    { id: "w7.m1", week: "w7", title: "clox local variables", rule: { type: "weekPct", min: 70 } },
    { id: "w8.m1", week: "w8", title: "clox calls & functions",
      rule: { type: "tasks", require: ["d25.t2"] } },
    { id: "w9.m1", week: "w9", title: "Closures + GC survived",
      rule: { type: "tasks", require: ["d26.t2", "d27.t2"] } },
    { id: "w10.m1", week: "w10", title: "🎓 Crafting Interpreters finished",
      rule: { type: "tasks", require: ["d32.t2"] } },
    { id: "w12.m1", week: "w12", title: "Go course ≥ video 248", rule: { type: "weekPct", min: 60 } },
    { id: "w13.m1", week: "w13", title: "🏁 Go web-dev course complete",
      rule: { type: "tasks", require: ["d40.t1"] } },
    { id: "w14.m1", week: "w14", title: "🎓 Monkey (secondary) finished",
      rule: { type: "tasks", require: ["d41.t2"] } },
    { id: "w15.m1", week: "w15", title: "Compiler bridge: Monkey → bytecode",
      rule: { type: "tasks", require: ["d52.t2"] } },
    { id: "w16.m1", week: "w16", title: "🏁 Monkey web playground shipped",
      rule: { type: "tasks", require: ["d54.t2", "d55.t1"] } },
  ],

  features: [
    { title: "The three implementations at a glance", items: [
      `<b>jlox</b> (CI Ch4–13) — Java, tree-walking, recursive-descent parser, resolver pass.`,
      `<b>clox</b> (CI Ch14–30) — C, bytecode VM, Pratt compiler, mark-sweep GC.`,
      `<b>Monkey</b> (Writing an Interpreter in Go) — Go, tree-walking, Pratt parser; secondary.`,
    ] },
    { title: "Companions & see-also", items: [
      `<a href="https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank" rel="noopener">Pratt Parsers</a> (read at CI Ch17 / Monkey Ch2).`,
      `<a href="https://arxiv.org/abs/1611.00467" target="_blank" rel="noopener">Stack vs register VMs</a> · <a href="https://en.wikipedia.org/wiki/Tracing_garbage_collection" target="_blank" rel="noopener">Tracing GC</a>.`,
      `<i>Let's Go</i> (Edwards) — the idiomatic Go web companion; SnippetBox arc + guided exercises.`,
      `Next: Ball's <i>Writing a Compiler in Go</i> — turn Monkey into a bytecode VM.`,
    ] },
  ],
});
