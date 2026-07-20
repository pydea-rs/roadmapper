// rust-fastapi.js — Roadmap 1 (priority HIGH, 4–5 active days/week).
// Two PRIMARY objectives: `rust` (The Rust Programming Language, resume at Ch15
// Smart Pointers) and `fastapi` (Mastering FastAPI, resume Ch4 — brief book,
// supplemented heavily with official docs). Rust references point at the live
// online Book (doc.rust-lang.org/stable/book) by SECTION NAME + URL — no page
// numbers — so the plan tracks the current 21-chapter edition. Style: do every
// listing; invent tryout projects where the book is thin; a multi-day Ch21
// web-server arc. Off-days vary per week; some days are lighter (marked) to leave
// room for Roadmap 2 overlap.
//
// EXTENDED (2026-07-17): the books (Rust Ch15–21, FastAPI Ch4–7) still finish at
// d24, but weeks 6–7 (d25–d32) append the two things worth adding — the Book's
// async chapter (Ch17) applied for real with tokio, and a Rust-service-behind-a-
// FastAPI-gateway integration capstone — plus a real buffer day (d28). Moves the
// finish to 2026-09-04. Existing ids/dates unchanged; d24 re-scoped to a checkpoint.
//
// NEW-BOOK REFACTOR (2026-07-20): re-referenced from the old 20-chapter PDF to the
// live 21-chapter Book. Async is now the Book's own Ch17 (was external-only); the
// later chapters renumber 17→18 (OOP) / 18→19 (Patterns) / 19→20 (Advanced) /
// 20→21 (web server); Macros moved from Appendix D into Ch20.5. Section names +
// URLs replace every page range. Async (Ch17) is read/applied in weeks 6–7.

import { registerRoadmap } from "../assets/js/registry.js";

const R = "rust", F = "fastapi";

registerRoadmap({
  slug: "rust-fastapi",
  title: "Rust + FastAPI",
  icon: "🦀",
  subtitle: "Finish The Rust Programming Language (Ch15→21, incl. async) and Mastering FastAPI (Ch4→), doc-supplemented.",
  accent: "#f0803c",
  schemaVersion: 1,
  cadence: { activeDaysPerWeek: [4, 5] },

  objectives: [
    { id: R, title: "Rust — The Book", tier: "primary", weight: 1 },
    { id: F, title: "FastAPI", tier: "primary", weight: 1 },
  ],

  weeks: [
    { id: "w1", title: "Week 1 — Smart pointers & DB foundations", start: "2026-07-20" },
    { id: "w2", title: "Week 2 — OOP, patterns, security", start: "2026-07-27" },
    { id: "w3", title: "Week 3 — Advanced Rust & the web-server arc", start: "2026-08-03" },
    { id: "w4", title: "Week 4 — Finish the server; deploy FastAPI", start: "2026-08-10" },
    { id: "w5", title: "Week 5 — Capstone & checkpoint", start: "2026-08-17" },
    { id: "w6", title: "Week 6 — Async Rust (Ch17) & real deployment", start: "2026-08-24" },
    { id: "w7", title: "Week 7 — Integration capstone & retro", start: "2026-08-31" },
  ],

  days: [
    /* ---------------- Week 1 ---------------- */
    {
      id: "d01", date: "2026-07-20", week: "w1", title: "Resume: Box & Deref",
      theme: "Back into Rust at Ch15 — smart pointers on the heap.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 35, group: "g1",
          label: `Rust — <b>Ch15.1–15.2</b>: <code>Box&lt;T&gt;</code> on the heap & recursive cons-list; the <b>Deref</b> trait. <a href="https://doc.rust-lang.org/stable/book/ch15-01-box.html" target="_blank" rel="noopener">Book §15.1</a>`,
          sub: [
            { id: "s1", est: 18, label: `Ch15.1 <a href="https://doc.rust-lang.org/stable/book/ch15-01-box.html" target="_blank" rel="noopener">Using <code>Box&lt;T&gt;</code> to Point to Data on the Heap</a> & the recursive cons-list.` },
            { id: "s2", est: 17, label: `Ch15.2 <a href="https://doc.rust-lang.org/stable/book/ch15-02-deref.html" target="_blank" rel="noopener">Treating Smart Pointers Like Regular References</a> (the <b>Deref</b> trait).` },
          ] },
        { id: "t2", obj: R, cat: "code", est: 40, group: "g1",
          label: `Build the <code>MyBox&lt;T&gt;</code> example and prove <b>deref coercion</b> yourself; run every listing.`,
          sub: [
            { id: "s1", est: 15, label: `Build the <code>MyBox&lt;T&gt;</code> example.` },
            { id: "s2", est: 15, label: `Prove <b>deref coercion</b> yourself.` },
            { id: "s3", est: 10, label: `Run every listing.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Deref coercion is what lets <code>&String</code> pass where <code>&str</code> is wanted — the compiler chains <code>Deref</code> calls at compile time, zero cost.` },
        { id: "s2", type: "tryout", label: `Tryout: implement <code>DerefMut</code> for <code>MyBox</code> and observe when the compiler picks it over <code>Deref</code>.` },
      ],
    },
    {
      id: "d02", date: "2026-07-21", week: "w1", title: "Rc, RefCell & Weak",
      theme: "Interior mutability and reference cycles — the tricky half of Ch15.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 40, group: "g1",
          label: `Rust — <b>Ch15.3–15.6</b>: <b>Drop</b>, <code>Rc&lt;T&gt;</code>, <code>RefCell&lt;T&gt;</code> & interior mutability, reference cycles & <code>Weak&lt;T&gt;</code>. <a href="https://doc.rust-lang.org/stable/book/ch15-03-drop.html" target="_blank" rel="noopener">Book §15.3</a>`,
          sub: [
            { id: "s1", est: 10, label: `Ch15.3 <a href="https://doc.rust-lang.org/stable/book/ch15-03-drop.html" target="_blank" rel="noopener">Running Code on Cleanup with the <code>Drop</code> Trait</a>.` },
            { id: "s2", est: 10, label: `Ch15.4 <a href="https://doc.rust-lang.org/stable/book/ch15-04-rc.html" target="_blank" rel="noopener"><code>Rc&lt;T&gt;</code>, the Reference Counted Smart Pointer</a>.` },
            { id: "s3", est: 10, label: `Ch15.5 <a href="https://doc.rust-lang.org/stable/book/ch15-05-interior-mutability.html" target="_blank" rel="noopener"><code>RefCell&lt;T&gt;</code> and the Interior Mutability Pattern</a>.` },
            { id: "s4", est: 10, label: `Ch15.6 <a href="https://doc.rust-lang.org/stable/book/ch15-06-reference-cycles.html" target="_blank" rel="noopener">Reference Cycles Can Leak Memory</a> (<code>Weak&lt;T&gt;</code>).` },
          ] },
        { id: "t2", obj: R, cat: "code", est: 35, group: "g1",
          label: `Work the mock-messenger (<code>RefCell</code>) and the leaf/branch tree (<code>Rc</code>+<code>Weak</code>) listings.`,
          sub: [
            { id: "s1", est: 18, label: `Work the mock-messenger (<code>RefCell</code>) listing.` },
            { id: "s2", est: 17, label: `Work the leaf/branch tree (<code>Rc</code>+<code>Weak</code>) listing.` },
          ] },
        { id: "t3", obj: R, cat: "challenge", est: 45, optional: true,
          label: `<b>Tryout project:</b> build a tiny <code>Rc&lt;RefCell&lt;Node&gt;&gt;</code> graph, <b>force a leak</b>, then fix it with <code>Weak</code> and confirm with strong/weak counts.`,
          fallback: { est: 20, label: `Just build the cycle and print <code>Rc::strong_count</code> before/after dropping.` } },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>RefCell</code> moves borrow-checking to <b>runtime</b> — a double mutable borrow panics instead of failing to compile. Interior mutability is a deliberate escape hatch, not the default.` },
        { id: "s2", type: "callout", label: `See also: interior-mutability pitfalls & the <code>Cell</code> vs <code>RefCell</code> distinction — keep this in mind when the web server needs shared state.` },
      ],
    },
    {
      id: "d03", date: "2026-07-22", week: "w1", title: "FastAPI databases",
      theme: "Switch objective — SQLAlchemy models, CRUD, sessions.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 30, group: "g1",
          label: `FastAPI — <b>Ch4 Working with Databases</b>: SQLAlchemy setup, models, CRUD, sessions & transactions (pp 52–67).`,
          sub: [
            { id: "s1", est: 15, label: `<b>Ch4</b> — SQLAlchemy setup & models.` },
            { id: "s2", est: 15, label: `CRUD, sessions & transactions (pp 52–67).` },
          ] },
        { id: "t2", obj: F, cat: "api", est: 45, group: "g1",
          label: `Build a small CRUD API from the chapter; wire a session dependency with <code>Depends</code>.`,
          sub: [
            { id: "s1", est: 25, label: `Build a small CRUD API from the chapter.` },
            { id: "s2", est: 20, label: `Wire a session dependency with <code>Depends</code>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 The official FastAPI SQL tutorial now uses <b>SQLModel</b> (Pydantic+SQLAlchemy). The book is raw SQLAlchemy — fine to learn, but know the modern default. <a href="https://fastapi.tiangolo.com/tutorial/sql-databases/" target="_blank" rel="noopener">docs</a>` },
        { id: "s2", type: "hint", label: `💡 The book is SQLAlchemy-<b>sync</b> only. We'll add an async 2.0-style router later (see Week 5).` },
      ],
    },
    {
      id: "d04", date: "2026-07-24", week: "w1", title: "Fearless concurrency",
      theme: "Threads, channels, Mutex/Arc — Ch16 (book is snippet-y, so we build).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 30, group: "g1",
          label: `Rust — <b>Ch16</b>: threads (<code>spawn</code>/<code>join</code>/<code>move</code>), channels, <code>Mutex&lt;T&gt;</code>+<code>Arc&lt;T&gt;</code>, <code>Send</code>/<code>Sync</code>. <a href="https://doc.rust-lang.org/stable/book/ch16-01-threads.html" target="_blank" rel="noopener">Book §16.1</a>`,
          sub: [
            { id: "s1", est: 8, label: `Ch16.1 <a href="https://doc.rust-lang.org/stable/book/ch16-01-threads.html" target="_blank" rel="noopener">Using Threads to Run Code Simultaneously</a> (<code>spawn</code>/<code>join</code>/<code>move</code>).` },
            { id: "s2", est: 7, label: `Ch16.2 <a href="https://doc.rust-lang.org/stable/book/ch16-02-message-passing.html" target="_blank" rel="noopener">Message Passing between Threads</a> (channels).` },
            { id: "s3", est: 8, label: `Ch16.3 <a href="https://doc.rust-lang.org/stable/book/ch16-03-shared-state.html" target="_blank" rel="noopener">Shared-State Concurrency</a> (<code>Mutex&lt;T&gt;</code>+<code>Arc&lt;T&gt;</code>).` },
            { id: "s4", est: 7, label: `Ch16.4 <a href="https://doc.rust-lang.org/stable/book/ch16-04-extensible-concurrency-sync-and-send.html" target="_blank" rel="noopener">Extensible Concurrency with <code>Send</code> and <code>Sync</code></a>.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 55, group: "g1",
          label: `<b>Combine-topics tryout:</b> a worker pool of N threads pulling jobs off an <code>mpsc</code> channel, accumulating results behind an <code>Arc&lt;Mutex&lt;_&gt;&gt;</code>. (Warm-up for Ch21's thread pool.)`,
          sub: [
            { id: "s1", est: 30, label: `<b>Combine-topics tryout:</b> a worker pool of N threads pulling jobs off an <code>mpsc</code> channel.` },
            { id: "s2", est: 25, label: `Accumulate results behind an <code>Arc&lt;Mutex&lt;_&gt;&gt;</code>. (Warm-up for Ch21's thread pool.)` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — this is OS-thread concurrency (Ch16). The very next chapter, <a href="https://doc.rust-lang.org/stable/book/ch17-00-async-await.html" target="_blank" rel="noopener">Ch17 Async & Await</a>, is the cooperative other half — you'll read and apply it in weeks 6–7 (with <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">tokio</a>).` },
        { id: "s2", type: "hint", label: `💡 <code>Send</code> = safe to move to another thread; <code>Sync</code> = safe to share by reference. They're auto-derived — you rarely implement them, but reading the errors teaches you the model.` },
      ],
    },
    {
      id: "d05", date: "2026-07-25", week: "w1", title: "FastAPI project structure",
      theme: "Split the app with APIRouter — book §5.1 + official docs.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `FastAPI — <b>Ch5.1</b> project structure / clean code (pp 68–75).` },
        { id: "t2", obj: F, cat: "api", est: 45, group: "g1",
          label: `<b>Supplement — Bigger Applications:</b> refactor the CRUD app into <code>routers/</code> with <code>APIRouter</code> (prefix, tags, per-router deps). <a href="https://fastapi.tiangolo.com/tutorial/bigger-applications/" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 25, label: `<b>Supplement — Bigger Applications:</b> refactor the CRUD app into <code>routers/</code> with <code>APIRouter</code>.` },
            { id: "s2", est: 20, label: `Set prefix, tags & per-router deps. <a href="https://fastapi.tiangolo.com/tutorial/bigger-applications/" target="_blank" rel="noopener">docs</a>` },
          ] },
        { id: "t3", obj: F, cat: "api", est: 25, optional: true,
          label: `<b>Bonus:</b> add <code>response_model</code> to every route; use the "never return the password field" split-model pattern. <a href="https://fastapi.tiangolo.com/tutorial/response-model/" target="_blank" rel="noopener">docs</a>` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>response_model_exclude</code> and separate input/output Pydantic models are how you keep secrets out of responses without hand-filtering dicts.` },
      ],
      note: "End of week 1 — smart pointers done, FastAPI DB layer + structure in place.",
    },

    /* ---------------- Week 2 ---------------- */
    {
      id: "d06", date: "2026-07-27", week: "w2", title: "OOP in Rust",
      theme: "Trait objects & the State pattern — Ch18 (example-rich).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 35, group: "g1",
          label: `Rust — <b>Ch18</b>: OO characteristics, <b>trait objects</b> (<code>dyn</code>, object safety) via the <code>Draw</code>/<code>Screen</code> GUI, and the full <b>State pattern</b> blog example. <a href="https://doc.rust-lang.org/stable/book/ch18-00-oop.html" target="_blank" rel="noopener">Book §18</a>`,
          sub: [
            { id: "s1", est: 10, label: `Ch18.1 <a href="https://doc.rust-lang.org/stable/book/ch18-01-what-is-oo.html" target="_blank" rel="noopener">Characteristics of Object-Oriented Languages</a>.` },
            { id: "s2", est: 12, label: `Ch18.2 <a href="https://doc.rust-lang.org/stable/book/ch18-02-trait-objects.html" target="_blank" rel="noopener">Using Trait Objects to Abstract over Shared Behavior</a> (<code>dyn</code>, object safety) via the <code>Draw</code>/<code>Screen</code> GUI.` },
            { id: "s3", est: 13, label: `Ch18.3 <a href="https://doc.rust-lang.org/stable/book/ch18-03-oo-design-patterns.html" target="_blank" rel="noopener">Implementing an Object-Oriented Design Pattern</a> (the <b>State pattern</b> blog example).` },
          ] },
        { id: "t2", obj: R, cat: "code", est: 50, group: "g1",
          label: `Implement the whole <code>Post</code> State-pattern example; then <b>harden it</b> — add a <code>Rejected</code> state and a word-count guard on publish.`,
          sub: [
            { id: "s1", est: 25, label: `Implement the whole <code>Post</code> State-pattern example.` },
            { id: "s2", est: 13, label: `<b>Harden it</b> — add a <code>Rejected</code> state.` },
            { id: "s3", est: 12, label: `Add a word-count guard on publish.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Rust's "OOP" is trait objects + enums, not inheritance. The State pattern here trades compile-time checks for runtime flexibility — compare it mentally to the <code>enum</code> version.` },
      ],
    },
    {
      id: "d07", date: "2026-07-28", week: "w2", title: "FastAPI security (JWT)",
      theme: "The book's §5.2 is thin (9pp) — supplement heavily with official auth docs.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 20, group: "g1",
          label: `FastAPI — <b>Ch5.2 Security</b> (pp 76–84) — read, but treat as an intro only.` },
        { id: "t2", obj: F, cat: "api", est: 60, group: "g1",
          label: `<b>Supplement — OAuth2 + JWT:</b> implement password flow, hashing, and Bearer/JWT from the official tutorial. <a href="https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 20, label: `<b>Supplement — OAuth2 + JWT:</b> implement the password flow.` },
            { id: "s2", est: 20, label: `Implement hashing.` },
            { id: "s3", est: 20, label: `Implement Bearer/JWT from the official tutorial. <a href="https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" target="_blank" rel="noopener">docs</a>` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 Current docs use <b>pwdlib (Argon2)</b> and <b>PyJWT</b> — older tutorials (and this book) show <code>passlib</code>/<code>python-jose</code>. Use the new stack.` },
        { id: "s2", type: "tryout", label: `Tryout: protect one CRUD route with the JWT dependency and prove a missing/expired token returns 401.` },
      ],
    },
    {
      id: "d08", date: "2026-07-29", week: "w2", title: "Patterns & matching",
      theme: "Ch19 is reference-y — so we build one thing that uses it all.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 30, group: "g1",
          label: `Rust — <b>Ch19</b>: all pattern places, refutability, and the full syntax (destructuring, ranges, guards, <code>@</code>, <code>ref</code>). <a href="https://doc.rust-lang.org/stable/book/ch19-00-patterns.html" target="_blank" rel="noopener">Book §19</a>`,
          sub: [
            { id: "s1", est: 10, label: `Ch19.1 <a href="https://doc.rust-lang.org/stable/book/ch19-01-all-the-places-for-patterns.html" target="_blank" rel="noopener">All the Places Patterns Can Be Used</a>.` },
            { id: "s2", est: 10, label: `Ch19.2 <a href="https://doc.rust-lang.org/stable/book/ch19-02-refutability.html" target="_blank" rel="noopener">Refutability: Whether a Pattern Might Fail to Match</a>.` },
            { id: "s3", est: 10, label: `Ch19.3 <a href="https://doc.rust-lang.org/stable/book/ch19-03-pattern-syntax.html" target="_blank" rel="noopener">Pattern Syntax</a> (destructuring, ranges, guards, <code>@</code>, <code>ref</code>).` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 50, group: "g1",
          label: `<b>Tryout:</b> a tiny command parser — <code>match</code> on an enum of commands using destructuring, ranges, match guards, and <code>@</code> bindings in one cohesive example.`,
          sub: [
            { id: "s1", est: 25, label: `<b>Tryout:</b> a tiny command parser — <code>match</code> on an enum of commands.` },
            { id: "s2", est: 25, label: `Use destructuring, ranges, match guards, and <code>@</code> bindings in one cohesive example.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Match guards let you add arbitrary boolean conditions to an arm, but they defeat exhaustiveness checking — the compiler can't prove the guard covers the case, so you still need a catch-all.` },
      ],
    },
    {
      id: "d09", date: "2026-07-31", week: "w2", title: "FastAPI dependencies",
      theme: "Depends done properly — DI, sub-dependencies, yield teardown.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 30, group: "g1",
          label: `<b>Supplement — Dependencies:</b> <code>Depends</code>, sub-dependencies, and <code>yield</code> for setup/teardown. <a href="https://fastapi.tiangolo.com/tutorial/dependencies/" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 10, label: `<b>Supplement — Dependencies:</b> <code>Depends</code>.` },
            { id: "s2", est: 10, label: `Sub-dependencies.` },
            { id: "s3", est: 10, label: `<code>yield</code> for setup/teardown. <a href="https://fastapi.tiangolo.com/tutorial/dependencies/" target="_blank" rel="noopener">docs</a>` },
          ] },
        { id: "t2", obj: F, cat: "api", est: 40, group: "g1",
          label: `Refactor DB-session and current-user into reusable <code>Depends</code>; add a role-check sub-dependency.`,
          sub: [
            { id: "s1", est: 20, label: `Refactor DB-session and current-user into reusable <code>Depends</code>.` },
            { id: "s2", est: 20, label: `Add a role-check sub-dependency.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A <code>yield</code> dependency is FastAPI's answer to context managers — code before <code>yield</code> runs on entry, code after runs on exit even if the route raised.` },
      ],
      note: "Lighter FastAPI day — a likely Roadmap-2 overlap date.",
    },
    {
      id: "d10", date: "2026-08-01", week: "w2", title: "Advanced Rust I",
      theme: "Unsafe Rust — Ch20 part 1 (the unsafe superpowers).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 45, group: "g1",
          label: `Rust — <b>Ch20.1 Unsafe Rust</b>: the superpowers — deref raw pointers, call <code>unsafe</code> fns, access/modify mutable statics, impl unsafe traits, union fields (+ <code>extern</code>/FFI). <a href="https://doc.rust-lang.org/stable/book/ch20-01-unsafe-rust.html" target="_blank" rel="noopener">Book §20.1</a>`,
          sub: [
            { id: "s1", est: 25, label: `Ch20.1 <a href="https://doc.rust-lang.org/stable/book/ch20-01-unsafe-rust.html" target="_blank" rel="noopener">Unsafe Rust</a> — dereferencing raw pointers & calling <code>unsafe</code> functions.` },
            { id: "s2", est: 20, label: `The rest of §20.1 — mutable statics, <code>unsafe</code> traits, union fields & <code>extern</code>/FFI.` },
          ] },
        { id: "t2", obj: R, cat: "code", est: 30, group: "g1",
          label: `Write a small <code>unsafe</code> block that dereferences a raw pointer and a <code>split_at_mut</code>-style function; document <i>why</i> each unsafe use is sound.`,
          sub: [
            { id: "s1", est: 20, label: `Write a small <code>unsafe</code> block that dereferences a raw pointer and a <code>split_at_mut</code>-style function.` },
            { id: "s2", est: 10, label: `Document <i>why</i> each unsafe use is sound.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — <a href="https://doc.rust-lang.org/nomicon/" target="_blank" rel="noopener">The Rustonomicon</a> is the deep dive on everything <code>unsafe</code>; bookmark for after the book.` },
      ],
    },

    /* ---------------- Week 3 ---------------- */
    {
      id: "d11", date: "2026-08-03", week: "w3", title: "Advanced Rust II",
      theme: "Advanced traits/types/closures — the Book's most reference-like sections.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 45, group: "g1",
          label: `Rust — <b>Ch20.2–20.4</b>: advanced traits (associated types, operator overloading, supertraits, newtype), advanced types (<code>!</code>, DSTs, <code>Sized</code>), function pointers & returning closures. <a href="https://doc.rust-lang.org/stable/book/ch20-02-advanced-traits.html" target="_blank" rel="noopener">Book §20.2</a>`,
          sub: [
            { id: "s1", est: 15, label: `Ch20.2 <a href="https://doc.rust-lang.org/stable/book/ch20-02-advanced-traits.html" target="_blank" rel="noopener">Advanced Traits</a> (associated types, operator overloading, supertraits, newtype).` },
            { id: "s2", est: 15, label: `Ch20.3 <a href="https://doc.rust-lang.org/stable/book/ch20-03-advanced-types.html" target="_blank" rel="noopener">Advanced Types</a> (<code>!</code>, DSTs, <code>Sized</code>).` },
            { id: "s3", est: 15, label: `Ch20.4 <a href="https://doc.rust-lang.org/stable/book/ch20-04-advanced-functions-and-closures.html" target="_blank" rel="noopener">Advanced Functions and Closures</a> (fn pointers & returning closures).` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 55, group: "g1",
          label: `<b>Integrative tryout:</b> a mini units library — a <code>Meters(f64)</code> newtype implementing <code>Add</code> (operator overloading) with an associated <code>Output</code> type, plus a supertrait for <code>Display</code>. Ties four Ch20 topics together.`,
          sub: [
            { id: "s1", est: 30, label: `<b>Integrative tryout:</b> a mini units library — a <code>Meters(f64)</code> newtype implementing <code>Add</code> (operator overloading) with an associated <code>Output</code> type.` },
            { id: "s2", est: 25, label: `Add a supertrait for <code>Display</code>. Ties four Ch20 topics together.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The newtype pattern (<code>struct Wrapper(Vec&lt;String&gt;)</code>) is how you implement a foreign trait on a foreign type — the orphan rule's escape hatch.` },
        { id: "s2", type: "callout", label: `🔗 See also — ergonomic errors with <a href="https://docs.rs/anyhow" target="_blank" rel="noopener">anyhow</a> (apps) and <a href="https://docs.rs/thiserror" target="_blank" rel="noopener">thiserror</a> (libs); the Book only covers <code>Box&lt;dyn Error&gt;</code>.` },
      ],
    },
    {
      id: "d12", date: "2026-08-04", week: "w3", title: "FastAPI testing",
      theme: "TestClient + background tasks — the book barely covers testing.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `<b>Supplement — Testing:</b> <code>TestClient</code> patterns. <a href="https://fastapi.tiangolo.com/tutorial/testing/" target="_blank" rel="noopener">docs</a> · <b>Background Tasks.</b> <a href="https://fastapi.tiangolo.com/tutorial/background-tasks/" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 13, label: `<b>Supplement — Testing:</b> <code>TestClient</code> patterns. <a href="https://fastapi.tiangolo.com/tutorial/testing/" target="_blank" rel="noopener">docs</a>` },
            { id: "s2", est: 12, label: `<b>Background Tasks.</b> <a href="https://fastapi.tiangolo.com/tutorial/background-tasks/" target="_blank" rel="noopener">docs</a>` },
          ] },
        { id: "t2", obj: F, cat: "code", est: 45, group: "g1",
          label: `Add a <code>pytest</code> suite covering each router (happy + auth-failure paths); add one <code>BackgroundTasks</code> endpoint (e.g. "send email" stub).`,
          sub: [
            { id: "s1", est: 25, label: `Add a <code>pytest</code> suite covering each router (happy + auth-failure paths).` },
            { id: "s2", est: 20, label: `Add one <code>BackgroundTasks</code> endpoint (e.g. "send email" stub).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>TestClient</code> wraps httpx/Starlette and runs the app in-process — no server, no ports. Override dependencies with <code>app.dependency_overrides</code> to swap the DB for a test one.` },
      ],
    },
    {
      id: "d13", date: "2026-08-05", week: "w3", title: "Web server I — single-threaded",
      theme: "Ch21 begins. It IS the tryout — one continuous project.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 20, group: "g1",
          label: `Rust — <b>Ch21.1 Building a Single-Threaded Web Server</b>: listen on TCP, read the request, anatomy of an HTTP request, write a response, return real HTML, validate & route. <a href="https://doc.rust-lang.org/stable/book/ch21-01-single-threaded.html" target="_blank" rel="noopener">Book §21.1</a>`,
          sub: [
            { id: "s1", est: 7, label: `listen on TCP, read the request.` },
            { id: "s2", est: 7, label: `anatomy of an HTTP request, write a response.` },
            { id: "s3", est: 6, label: `return real HTML, validate & route.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 60, group: "g1",
          label: `<b>Build:</b> the single-threaded web server end to end — serve <code>hello.html</code> and a 404 page, selectively by request line.`,
          sub: [
            { id: "s1", est: 30, label: `<b>Build:</b> the single-threaded web server end to end — serve <code>hello.html</code>.` },
            { id: "s2", est: 30, label: `Serve a 404 page, selectively by request line.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This is raw <code>std::net::TcpListener</code> — no framework. Seeing HTTP as bytes on a socket makes every web framework afterward feel less magical.` },
      ],
    },
    {
      id: "d14", date: "2026-08-07", week: "w3", title: "Web server II — the thread pool",
      theme: "The heavy section: design a ThreadPool API from scratch — Ch21.2.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 30, group: "g1",
          label: `Rust — <b>Ch21.2 From Single-Threaded to Multithreaded</b>: simulate a slow request, then design & build the <b>thread pool</b> — <code>ThreadPool</code>, <code>Worker</code>, channels/<code>Job</code>, <code>Send</code> closures. <a href="https://doc.rust-lang.org/stable/book/ch21-02-multithreaded.html" target="_blank" rel="noopener">Book §21.2</a>`,
          sub: [
            { id: "s1", est: 12, label: `simulate a slow request.` },
            { id: "s2", est: 18, label: `design & build the <b>thread pool</b> — <code>ThreadPool</code>, <code>Worker</code>, channels/<code>Job</code>, <code>Send</code> closures.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 75, group: "g1",
          label: `<b>Build:</b> implement the full thread pool and serve concurrent requests; verify a slow route no longer blocks others.`,
          sub: [
            { id: "s1", est: 30, label: `<b>Build:</b> implement the full thread pool.` },
            { id: "s2", est: 25, label: `Serve concurrent requests.` },
            { id: "s3", est: 20, label: `Verify a slow route no longer blocks others.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Everything from your Ch16 worker-pool tryout pays off here — same <code>mpsc</code> + <code>Arc&lt;Mutex&gt;</code> shape, now behind a clean API with <code>FnOnce</code> boxed jobs.` },
      ],
      note: "Heaviest Rust day of the roadmap — no FastAPI block.",
    },
    {
      id: "d15", date: "2026-08-08", week: "w3", title: "FastAPI microservices (light)",
      theme: "Ch6 is prose-heavy/thin — read for concepts, keep it light (overlap day).",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 30,
          label: `FastAPI — <b>Ch6 Microservices</b>: principles, scaling, Redis/RabbitMQ, API gateway (pp 85–100). Conceptual — note ideas, don't rabbit-hole.`,
          sub: [
            { id: "s1", est: 10, label: `principles, scaling.` },
            { id: "s2", est: 10, label: `Redis/RabbitMQ.` },
            { id: "s3", est: 10, label: `API gateway (pp 85–100). Conceptual — note ideas, don't rabbit-hole.` },
          ] },
        { id: "t2", obj: F, cat: "review", est: 20, optional: true,
          label: `<b>Bonus:</b> sketch how you'd split the CRUD app into two services + a gateway (diagram only).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ The book's microservices chapter is light on real code. Treat it as a map, not a tutorial — real implementation would lean on message queues + the deploy docs next week.` },
      ],
      note: "Deliberately light — Roadmap-2 overlap day.",
    },

    /* ---------------- Week 4 ---------------- */
    {
      id: "d16", date: "2026-08-10", week: "w4", title: "Web server III — graceful shutdown",
      theme: "Finish Ch21: Drop for the pool, signal workers to stop.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 20, group: "g1",
          label: `Rust — <b>Ch21.3 Graceful Shutdown and Cleanup</b>: implement <code>Drop</code> for <code>ThreadPool</code>, signal threads to stop, graceful shutdown & cleanup. <a href="https://doc.rust-lang.org/stable/book/ch21-03-graceful-shutdown-and-cleanup.html" target="_blank" rel="noopener">Book §21.3</a>`,
          sub: [
            { id: "s1", est: 7, label: `implement <code>Drop</code> for <code>ThreadPool</code>.` },
            { id: "s2", est: 7, label: `signal threads to stop.` },
            { id: "s3", est: 6, label: `graceful shutdown & cleanup.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 45, group: "g1",
          label: `<b>Finish the project:</b> graceful shutdown after N requests; ensure every worker joins cleanly. 🎉 The Book's final project is done.`,
          sub: [
            { id: "s1", est: 23, label: `<b>Finish the project:</b> graceful shutdown after N requests.` },
            { id: "s2", est: 22, label: `Ensure every worker joins cleanly. 🎉 The Book's final project is done.` },
          ] },
        { id: "t3", obj: R, cat: "challenge", est: 40, optional: true,
          label: `<b>Extend:</b> add a real router (a couple of routes) and a small static-file handler to your server.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>Drop</code> order matters: you must drop the sender first so the workers' <code>recv()</code> returns <code>Err</code> and their loops exit — otherwise <code>join()</code> hangs forever.` },
      ],
    },
    {
      id: "d17", date: "2026-08-11", week: "w4", title: "FastAPI deploy",
      theme: "Ch7 is thin on code — supplement with a real Docker deploy.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `FastAPI — <b>Ch7 Deploying in Production</b>: Uvicorn vs Gunicorn, env security, Docker, AWS/GCP overviews (pp 101–116).`,
          sub: [
            { id: "s1", est: 9, label: `Uvicorn vs Gunicorn, env security.` },
            { id: "s2", est: 8, label: `Docker.` },
            { id: "s3", est: 8, label: `AWS/GCP overviews (pp 101–116).` },
          ] },
        { id: "t2", obj: F, cat: "project", est: 45, group: "g1",
          label: `<b>Supplement:</b> write a real multi-stage <code>Dockerfile</code> for the CRUD app (uvicorn workers), a <code>.env</code>, and run it locally in a container.`,
          sub: [
            { id: "s1", est: 25, label: `<b>Supplement:</b> write a real multi-stage <code>Dockerfile</code> for the CRUD app (uvicorn workers), a <code>.env</code>.` },
            { id: "s2", est: 20, label: `Run it locally in a container.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ The book's AWS/GCP sections are 2–3 pages each — overviews, not runbooks. For a real deploy, follow the official Uvicorn/Gunicorn deployment docs + your container platform's guide.` },
      ],
    },
    {
      id: "d18", date: "2026-08-12", week: "w4", title: "Lifespan & Pydantic v2",
      theme: "Modernize the app — kill deprecated patterns.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `<b>Supplement — Lifespan events</b> <a href="https://fastapi.tiangolo.com/advanced/events/" target="_blank" rel="noopener">docs</a> and the <b>Pydantic v1→v2 migration</b> <a href="https://docs.pydantic.dev/latest/migration/" target="_blank" rel="noopener">guide</a>.`,
          sub: [
            { id: "s1", est: 13, label: `<b>Supplement — Lifespan events</b> <a href="https://fastapi.tiangolo.com/advanced/events/" target="_blank" rel="noopener">docs</a>.` },
            { id: "s2", est: 12, label: `the <b>Pydantic v1→v2 migration</b> <a href="https://docs.pydantic.dev/latest/migration/" target="_blank" rel="noopener">guide</a>.` },
          ] },
        { id: "t2", obj: F, cat: "code", est: 40, group: "g1",
          label: `Refactor: replace any <code>@app.on_event</code> with a <code>lifespan=</code> context manager; move to Pydantic-v2 APIs (<code>model_dump</code>, <code>field_validator</code>, <code>model_config</code>).`,
          sub: [
            { id: "s1", est: 20, label: `Refactor: replace any <code>@app.on_event</code> with a <code>lifespan=</code> context manager.` },
            { id: "s2", est: 20, label: `Move to Pydantic-v2 APIs (<code>model_dump</code>, <code>field_validator</code>, <code>model_config</code>).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Deprecated: <code>@app.on_event("startup"/"shutdown")</code> → use <code>lifespan=</code>. It's all-lifespan or all-events, never both.` },
        { id: "s2", type: "callout", label: `🆕 Pydantic v2 renames: <code>.dict()</code>→<code>.model_dump()</code>, <code>@validator</code>→<code>@field_validator</code>, <code>class Config</code>→<code>model_config</code>. The <code>bump-pydantic</code> codemod automates most of it.` },
      ],
    },
    {
      id: "d19", date: "2026-08-14", week: "w4", title: "Rust macros & reference appendices",
      theme: "The last Advanced-Features section, macros — plus the reference appendices (light).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 25,
          label: `Rust — <b>Ch20.5 Macros</b>: <code>macro_rules!</code> vs functions, then the worked <b>procedural derive macro</b> (<code>hello_macro</code>). <a href="https://doc.rust-lang.org/stable/book/ch20-05-macros.html" target="_blank" rel="noopener">Book §20.5</a>`,
          sub: [
            { id: "s1", est: 12, label: `<code>macro_rules!</code> (declarative macros) vs functions.` },
            { id: "s2", est: 13, label: `the worked <b>procedural derive macro</b> (<code>hello_macro</code>).` },
          ] },
        { id: "t2", obj: R, cat: "code", est: 35, optional: true,
          label: `<b>Bonus:</b> build the <code>hello_macro</code> derive crate yourself and derive it on a struct.`,
          fallback: { est: 15, label: `Just read & run the provided <code>hello_macro</code> code.` } },
        { id: "t3", obj: R, cat: "alt", est: 15, optional: true,
          label: `<b>Skim (reference):</b> Appendices <a href="https://doc.rust-lang.org/stable/book/appendix-01-keywords.html" target="_blank" rel="noopener">A Keywords</a>, B Operators, C Derivable Traits, and the new <a href="https://doc.rust-lang.org/stable/book/appendix-04-useful-development-tools.html" target="_blank" rel="noopener">D Useful Development Tools</a> (rustfmt, clippy, rust-analyzer) — bookmark, don't memorize.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>macro_rules!</code> is pattern-matching on token trees; procedural macros are Rust programs that run at compile time over a <code>TokenStream</code>. The book only samples both — a whole world (<code>syn</code>/<code>quote</code>) lies beyond.` },
      ],
    },
    {
      id: "d20", date: "2026-08-15", week: "w4", title: "Capstone I — real API",
      theme: "Pull FastAPI together: a CRUD+auth+tests service from scratch.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 80, group: "g1",
          label: `<b>Capstone (part 1):</b> design a fresh API (e.g. a bookmarks service) — models, <code>APIRouter</code> modules, DB layer, and CRUD routes with <code>response_model</code>. No book — you drive it.`,
          sub: [
            { id: "s1", est: 20, label: `<b>Capstone (part 1):</b> design a fresh API (e.g. a bookmarks service) — models.` },
            { id: "s2", est: 20, label: `<code>APIRouter</code> modules.` },
            { id: "s3", est: 20, label: `DB layer.` },
            { id: "s4", est: 20, label: `CRUD routes with <code>response_model</code>. No book — you drive it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: add pagination + filtering query params and a <code>response_model</code> for the list endpoint.` },
      ],
    },

    /* ---------------- Week 5 ---------------- */
    {
      id: "d21", date: "2026-08-17", week: "w5", title: "Capstone II — auth & tests",
      theme: "Finish the capstone with JWT auth and a real test suite.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 70, group: "g1",
          label: `<b>Capstone (part 2):</b> add JWT auth (pwdlib+PyJWT), protect the write routes, and cover it all with <code>pytest</code> + <code>TestClient</code> (incl. 401 paths). 🎉 Capstone done.`,
          sub: [
            { id: "s1", est: 25, label: `<b>Capstone (part 2):</b> add JWT auth (pwdlib+PyJWT).` },
            { id: "s2", est: 20, label: `Protect the write routes.` },
            { id: "s3", est: 25, label: `Cover it all with <code>pytest</code> + <code>TestClient</code> (incl. 401 paths). 🎉 Capstone done.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 If you can override the DB dependency in tests and assert on 401s, you've internalized the two hardest FastAPI ideas: DI and security. That's the whole point of the supplement track.` },
      ],
    },
    {
      id: "d22", date: "2026-08-18", week: "w5", title: "Async SQLAlchemy 2.0",
      theme: "The async DB pattern the book skipped.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `<b>Supplement — async SQLAlchemy 2.0:</b> <code>AsyncSession</code>, <code>async_sessionmaker</code>, <code>select()</code>. <a href="https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 9, label: `<b>Supplement — async SQLAlchemy 2.0:</b> <code>AsyncSession</code>.` },
            { id: "s2", est: 8, label: `<code>async_sessionmaker</code>.` },
            { id: "s3", est: 8, label: `<code>select()</code>. <a href="https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html" target="_blank" rel="noopener">docs</a>` },
          ] },
        { id: "t2", obj: F, cat: "api", est: 45, group: "g1",
          label: `Add one fully-async CRUD router to the capstone using an async engine; benchmark it against the sync one informally.`,
          sub: [
            { id: "s1", est: 25, label: `Add one fully-async CRUD router to the capstone using an async engine.` },
            { id: "s2", est: 20, label: `Benchmark it against the sync one informally.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 SQLAlchemy 2.0 unifies ORM+Core behind <code>select()</code> and drops implicit autocommit / legacy <code>Query</code>. <a href="https://docs.sqlalchemy.org/en/20/changelog/migration_20.html" target="_blank" rel="noopener">migration guide</a>` },
      ],
    },
    {
      id: "d23", date: "2026-08-19", week: "w5", title: "Rust consolidation",
      theme: "Cement the advanced material with one integrative exercise.",
      tasks: [
        { id: "t1", obj: R, cat: "project", est: 60, group: "g1",
          label: `<b>Combine-topics tryout:</b> extend your Ch21 web server with a <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> in-memory store and a couple of JSON routes — exercises smart pointers + concurrency + traits together.`,
          sub: [
            { id: "s1", est: 30, label: `<b>Combine-topics tryout:</b> extend your Ch21 web server with a <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> in-memory store.` },
            { id: "s2", est: 30, label: `Add a couple of JSON routes — exercises smart pointers + concurrency + traits together.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 After the Book: <a href="https://github.com/rust-lang/rustlings" target="_blank" rel="noopener">Rustlings</a>, <a href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noopener">Rust by Example</a>, <a href="https://github.com/kyclark/command-line-rust" target="_blank" rel="noopener">Command-Line Rust</a>, then async (tokio) for real network services.` },
      ],
    },
    {
      id: "d24", date: "2026-08-21", week: "w5", title: "Checkpoint — books closed",
      theme: "The Book's core (Ch15–16, 18–21) and Mastering FastAPI (Ch4–7) are done. Async (Ch17) + integration are next.",
      tasks: [
        { id: "t1", obj: R, cat: "review", est: 30, group: "g1",
          label: `Rust — skim your notes across Ch15–16 & 18–21; list the 3 ideas you'd most want to re-read (likely unsafe, advanced traits, or the thread pool). Async (Ch17) is the weeks-6–7 focus.`,
          sub: [
            { id: "s1", est: 15, label: `Rust — skim your notes across Ch15–16 & 18–21.` },
            { id: "s2", est: 15, label: `list the 3 ideas you'd most want to re-read (likely unsafe, advanced traits, or the thread pool).` },
          ] },
        { id: "t2", obj: F, cat: "review", est: 30, group: "g1",
          label: `FastAPI — write a one-page "cheat sheet" of the DI + security + async patterns you built; note gaps for a future project.`,
          sub: [
            { id: "s1", est: 15, label: `FastAPI — write a one-page "cheat sheet" of the DI + security + async patterns you built.` },
            { id: "s2", est: 15, label: `note gaps for a future project.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The core is finished a full two weeks before the plan ends — that slack is intentional. Weeks 6–7 read the Book's async chapter (Ch17) for real and build the capstone that fuses both stacks. If you slipped anywhere, this is where you catch up guilt-free.` },
      ],
      note: "Milestone checkpoint — the core is done; weeks 6–7 are deepening + buffer.",
    },

    /* ================================================================ *
     *  Week 6 — Async Rust (Ch17) & real deployment  (the Book's newest
     *  chapter, async/await, read here and applied for real with tokio;
     *  plus we ship the FastAPI capstone. Deliberately lighter/flexible —
     *  this is your buffer.)
     * ================================================================ */
    {
      id: "d25", date: "2026-08-24", week: "w6", title: "Async Rust I — the Book's Ch17 (futures & async)",
      theme: "The Book's newest chapter: async, await & futures — the other half of Rust concurrency.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 35, group: "g1",
          label: `Rust — <b>Ch17.1–17.3</b>: futures & the async syntax, applying concurrency with async, and working with any number of futures (<code>join!</code>/<code>race</code>). <a href="https://doc.rust-lang.org/stable/book/ch17-01-futures-and-syntax.html" target="_blank" rel="noopener">Book §17.1</a>`,
          sub: [
            { id: "s1", est: 20, label: `Ch17.1 <a href="https://doc.rust-lang.org/stable/book/ch17-01-futures-and-syntax.html" target="_blank" rel="noopener">Futures and the Async Syntax</a> + Ch17.2 <a href="https://doc.rust-lang.org/stable/book/ch17-02-concurrency-with-async.html" target="_blank" rel="noopener">Applying Concurrency with Async</a>.` },
            { id: "s2", est: 15, label: `Ch17.3 <a href="https://doc.rust-lang.org/stable/book/ch17-03-more-futures.html" target="_blank" rel="noopener">Working With Any Number of Futures</a>. The Book uses the <code>trpl</code> crate; <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio</a> is the real runtime it wraps.` },
          ] },
        { id: "t2", obj: R, cat: "code", est: 45, group: "g1",
          label: `Build a small tokio program: spawn several async tasks that sleep and race, and <code>join!</code> them. Feel how <code>.await</code> yields vs a blocking thread.`,
          sub: [
            { id: "s1", est: 25, label: `Build a small tokio program: spawn several async tasks that sleep and race, and <code>join!</code> them.` },
            { id: "s2", est: 20, label: `Feel how <code>.await</code> yields vs a blocking thread.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — your Ch16 worker-pool and Ch21 thread pool used OS threads + <code>mpsc</code>. Async is the same idea (concurrent work, message passing) but cooperatively scheduled on a runtime. <code>tokio::sync::mpsc</code> is the async twin of <code>std::sync::mpsc</code>.` },
        { id: "s2", type: "hint", label: `💡 A <code>Future</code> is a state machine the compiler builds from your <code>async fn</code>; it does nothing until polled by an executor. That "lazy until awaited" model is the single biggest difference from threads.` },
      ],
    },
    {
      id: "d26", date: "2026-08-25", week: "w6", title: "FastAPI — ship the capstone",
      theme: "Take the Week-4/5 capstone from 'runs locally' to 'deployed'.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 50, group: "g1",
          label: `Deploy your capstone's Docker image to a real host (Fly.io / Railway / a VPS): env-based secrets, a managed Postgres, and a public URL with HTTPS.`,
          sub: [
            { id: "s1", est: 20, label: `Deploy your capstone's Docker image to a real host (Fly.io / Railway / a VPS): env-based secrets.` },
            { id: "s2", est: 15, label: `a managed Postgres.` },
            { id: "s3", est: 15, label: `a public URL with HTTPS.` },
          ] },
        { id: "t2", obj: F, cat: "read", est: 20, group: "g1",
          label: `Add <b>structured logging</b> + a <code>/health</code> endpoint; skim the <a href="https://fastapi.tiangolo.com/deployment/concepts/" target="_blank" rel="noopener">deployment concepts</a> doc (workers, proxies, restarts).`,
          sub: [
            { id: "s1", est: 10, label: `Add <b>structured logging</b> + a <code>/health</code> endpoint.` },
            { id: "s2", est: 10, label: `skim the <a href="https://fastapi.tiangolo.com/deployment/concepts/" target="_blank" rel="noopener">deployment concepts</a> doc (workers, proxies, restarts).` },
          ] },
        { id: "t3", obj: F, cat: "project", est: 30, optional: true,
          label: `<b>Bonus:</b> wire a GitHub Actions job that runs your pytest suite and builds the image on push.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ First real deploy checklist: no secrets in the image, <code>--workers</code> tuned to CPUs, DB migrations run on release (not on every boot), and logs going to stdout so the platform captures them.` },
      ],
    },
    {
      id: "d27", date: "2026-08-26", week: "w6", title: "Async Rust II — an async web server",
      theme: "Rebuild the Ch21 server the async way — the payoff of d25.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 25, group: "g1",
          label: `Rust — <b>Ch17.4–17.6</b>: streams, a closer look at the async traits, and futures-vs-tasks-vs-threads; then skim <a href="https://docs.rs/axum" target="_blank" rel="noopener">axum</a>'s hello-world for a real async framework. <a href="https://doc.rust-lang.org/stable/book/ch17-04-streams.html" target="_blank" rel="noopener">Book §17.4</a>`,
          sub: [
            { id: "s1", est: 13, label: `Ch17.4 <a href="https://doc.rust-lang.org/stable/book/ch17-04-streams.html" target="_blank" rel="noopener">Streams: Futures in Sequence</a> + Ch17.5 <a href="https://doc.rust-lang.org/stable/book/ch17-05-traits-for-async.html" target="_blank" rel="noopener">A Closer Look at the Traits for Async</a> + Ch17.6 <a href="https://doc.rust-lang.org/stable/book/ch17-06-futures-tasks-threads.html" target="_blank" rel="noopener">Futures, Tasks, and Threads</a>.` },
            { id: "s2", est: 12, label: `Skim <a href="https://docs.rs/axum" target="_blank" rel="noopener">axum</a>'s hello-world (a real async web framework) and the Tokio "I/O"/"Select" tutorial chapters.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 55, group: "g1",
          label: `<b>Build:</b> re-implement your Ch21 web server on <code>tokio</code> (async <code>TcpListener</code>, a task per connection). Compare it to the thread-pool version — no pool needed, the runtime multiplexes.`,
          sub: [
            { id: "s1", est: 30, label: `<b>Build:</b> re-implement your Ch21 web server on <code>tokio</code> (async <code>TcpListener</code>, a task per connection).` },
            { id: "s2", est: 25, label: `Compare it to the thread-pool version — no pool needed, the runtime multiplexes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Notice what disappeared: no manual <code>ThreadPool</code>, no <code>Arc&lt;Mutex&gt;</code> around the job queue. The runtime <i>is</i> the pool. That's why async won for network I/O.` },
      ],
    },
    {
      id: "d28", date: "2026-08-28", week: "w6", title: "Buffer / catch-up",
      theme: "Deliberate slack. Use it — don't invent work.",
      tasks: [
        { id: "t1", obj: R, cat: "review", est: 20, optional: true,
          label: `<b>If caught up:</b> a set of <a href="https://github.com/rust-lang/rustlings" target="_blank" rel="noopener">Rustlings</a> drills on the topics that felt shakiest (lifetimes, traits, error handling).` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: if you fell behind anywhere in weeks 1–5, this is the day to close it — a chapter's challenges you skipped, a listing that didn't compile, notes you meant to write.` },
        { id: "s2", type: "callout", label: `🔗 Nothing due today by design. A plan with zero slack is a plan that breaks on the first bad week; this day is the shock absorber.` },
      ],
      note: "Pure buffer day — required load is near zero on purpose.",
    },

    /* ================================================================ *
     *  Week 7 — Integration capstone & retro  (fuse both stacks, then a
     *  real close-out. The finishing move d24 used to only hint at.)
     * ================================================================ */
    {
      id: "d29", date: "2026-08-31", week: "w7", title: "Integration capstone I — design",
      theme: "One system that uses both languages: a Rust service behind a FastAPI gateway.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 20, group: "g1",
          label: `Sketch the architecture: a small <b>Rust</b> service (your async server from d27, exposing a JSON endpoint or two) fronted by a <b>FastAPI</b> gateway that auth-gates and proxies to it.`,
          sub: [
            { id: "s1", est: 10, label: `Sketch the architecture: a small <b>Rust</b> service (your async server from d27, exposing a JSON endpoint or two).` },
            { id: "s2", est: 10, label: `fronted by a <b>FastAPI</b> gateway that auth-gates and proxies to it.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 60, group: "g1",
          label: `<b>Build (Rust side):</b> give the async server a couple of real JSON routes backed by an <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> (or sqlite) store — exercises smart pointers + concurrency + traits together.`,
          sub: [
            { id: "s1", est: 30, label: `<b>Build (Rust side):</b> give the async server a couple of real JSON routes.` },
            { id: "s2", est: 30, label: `back them with an <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> (or sqlite) store — exercises smart pointers + concurrency + traits together.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is the project d24 used to only hint at. Doing it proves you can pick the right tool per layer: Rust for the hot path, FastAPI for the ergonomic edge.` },
      ],
    },
    {
      id: "d30", date: "2026-09-01", week: "w7", title: "Integration capstone II — wire it up",
      theme: "One end-to-end request path across both services.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 70, group: "g1",
          label: `<b>Build (FastAPI side):</b> a gateway that validates a JWT, forwards the request to the Rust service (httpx), and shapes the response with a <code>response_model</code>. Get one request flowing user → FastAPI → Rust → back.`,
          sub: [
            { id: "s1", est: 20, label: `<b>Build (FastAPI side):</b> a gateway that validates a JWT.` },
            { id: "s2", est: 20, label: `forwards the request to the Rust service (httpx).` },
            { id: "s3", est: 30, label: `shapes the response with a <code>response_model</code>. Get one request flowing user → FastAPI → Rust → back.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: add a timeout + graceful error when the Rust service is down, so the gateway degrades instead of hanging. Real systems fail at the seams — practice the seam.` },
      ],
    },
    {
      id: "d31", date: "2026-09-02", week: "w7", title: "Polish & tests",
      theme: "Make the capstone something you'd show.",
      tasks: [
        { id: "t1", obj: F, cat: "code", est: 40, group: "g1",
          label: `Add a <code>pytest</code> happy-path + one failure test for the gateway; write a short README with a run command and an architecture line.`,
          sub: [
            { id: "s1", est: 20, label: `Add a <code>pytest</code> happy-path + one failure test for the gateway.` },
            { id: "s2", est: 20, label: `write a short README with a run command and an architecture line.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 30, optional: true,
          label: `<b>Bonus:</b> dockerize both services with a <code>docker-compose.yml</code> so the whole thing comes up with one command.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A capstone you can run with one command and explain in one sentence is worth more than three half-finished ones. Depth over breadth for the finale.` },
      ],
    },
    {
      id: "d32", date: "2026-09-04", week: "w7", title: "Grand retro & next-project plan",
      theme: "Close the journey; capture what you learned and where you go next.",
      tasks: [
        { id: "t1", obj: R, cat: "review", est: 35, group: "g1",
          label: `Write the one-page map: the Rust ideas you'll reuse (ownership, traits, concurrency, async) and the FastAPI ideas (DI, security, async DB). Note the 2–3 you'd re-read first.`,
          sub: [
            { id: "s1", est: 13, label: `Write the one-page map: the Rust ideas you'll reuse (ownership, traits, concurrency, async).` },
            { id: "s2", est: 12, label: `the FastAPI ideas (DI, security, async DB).` },
            { id: "s3", est: 10, label: `Note the 2–3 you'd re-read first.` },
          ] },
        { id: "t2", obj: F, cat: "review", est: 25, group: "g1",
          label: `Pick the <b>one</b> next real project (a service you actually want) and write its first three tasks while the momentum is hot. Momentum beats a clean stop. 🎉 Roadmap complete.`,
          sub: [
            { id: "s1", est: 13, label: `Pick the <b>one</b> next real project (a service you actually want).` },
            { id: "s2", est: 12, label: `write its first three tasks while the momentum is hot. Momentum beats a clean stop. 🎉 Roadmap complete.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 After here: async depth (<a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio</a> + the <a href="https://rust-lang.github.io/async-book/" target="_blank" rel="noopener">Async Book</a>), the <a href="https://doc.rust-lang.org/nomicon/" target="_blank" rel="noopener">Nomicon</a> for unsafe, and a real FastAPI service with a queue. You have the fundamentals; now build something you'll keep.` },
      ],
    },
  ],

  milestones: [
    { id: "w1.m1", week: "w1", title: "Smart pointers finished (Ch15)",
      rule: { type: "tasks", require: ["d01.t1", "d02.t1", "d02.t2"] } },
    { id: "w1.m2", week: "w1", title: "≥ 80% of week 1 (original)", rule: { type: "weekPct", min: 80 } },
    { id: "w2.m1", week: "w2", title: "OOP + patterns + JWT auth done",
      rule: { type: "tasks", require: ["d06.t2", "d07.t2", "d08.t2"] } },
    { id: "w2.m2", week: "w2", title: "≥ 75% of week 2 (original)", rule: { type: "weekPct", min: 75 } },
    { id: "w3.m1", week: "w3", title: "Advanced Rust done; server started",
      rule: { type: "tasks", require: ["d11.t1", "d13.t2", "d14.t2"] } },
    { id: "w4.m1", week: "w4", title: "🏁 Rust web server complete",
      rule: { type: "tasks", require: ["d16.t1", "d16.t2"] } },
    { id: "w4.m2", week: "w4", title: "FastAPI modernized (lifespan + v2)",
      rule: { type: "tasks", require: ["d17.t2", "d18.t2"] } },
    { id: "w5.m1", week: "w5", title: "🎓 FastAPI capstone shipped",
      rule: { type: "tasks", require: ["d20.t1", "d21.t1"] } },
    { id: "w6.m1", week: "w6", title: "Async Rust: tokio server running",
      rule: { type: "tasks", require: ["d25.t2", "d27.t2"] } },
    { id: "w6.m2", week: "w6", title: "FastAPI capstone deployed",
      rule: { type: "tasks", require: ["d26.t1"] } },
    { id: "w7.m1", week: "w7", title: "🏁 Integration capstone (Rust + FastAPI)",
      rule: { type: "tasks", require: ["d29.t2", "d30.t1"] } },
  ],

  features: [
    { title: "Rust — after the Book", items: [
      `<a href="https://github.com/rust-lang/rustlings" target="_blank" rel="noopener">Rustlings</a> — fix-the-compiler drills.`,
      `<a href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noopener">Rust by Example</a> · <a href="https://github.com/kyclark/command-line-rust" target="_blank" rel="noopener">Command-Line Rust</a> (build real CLIs).`,
      `Async: <a href="https://rust-lang.github.io/async-book/" target="_blank" rel="noopener">Async Book</a> + <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio</a> · Advanced: <a href="https://doc.rust-lang.org/nomicon/" target="_blank" rel="noopener">Nomicon</a>.`,
      `Errors: <a href="https://docs.rs/anyhow" target="_blank" rel="noopener">anyhow</a> (apps) + <a href="https://docs.rs/thiserror" target="_blank" rel="noopener">thiserror</a> (libs).`,
    ] },
    { title: "FastAPI — the supplement backbone", items: [
      `<a href="https://fastapi.tiangolo.com/tutorial/bigger-applications/" target="_blank" rel="noopener">Bigger Applications</a> · <a href="https://fastapi.tiangolo.com/tutorial/dependencies/" target="_blank" rel="noopener">Dependencies</a> · <a href="https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" target="_blank" rel="noopener">OAuth2 + JWT</a>.`,
      `<a href="https://fastapi.tiangolo.com/tutorial/testing/" target="_blank" rel="noopener">Testing</a> · <a href="https://fastapi.tiangolo.com/advanced/events/" target="_blank" rel="noopener">Lifespan</a> · <a href="https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html" target="_blank" rel="noopener">async SQLAlchemy 2.0</a>.`,
      `Migrations: <a href="https://docs.pydantic.dev/latest/migration/" target="_blank" rel="noopener">Pydantic v1→v2</a> · <a href="https://docs.sqlalchemy.org/en/20/changelog/migration_20.html" target="_blank" rel="noopener">SQLAlchemy 1.x→2.0</a>.`,
    ] },
  ],
});
