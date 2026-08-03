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
// finish to 2026-09-19. Existing ids/dates unchanged; d24 re-scoped to a checkpoint.
//
// NEW-BOOK REFACTOR (2026-07-20): re-referenced from the old 20-chapter PDF to the
// live 21-chapter Book. Async is now the Book's own Ch17 (was external-only); the
// later chapters renumber 17→18 (OOP) / 18→19 (Patterns) / 19→20 (Advanced) /
// 20→21 (web server); Macros moved from Appendix D into Ch20.5. Section names +
// URLs replace every page range. Async (Ch17) is read/applied in weeks 6–7.
//
// RWP EXTENSION (2026-07-20): APPENDED a third objective — `rwp` (Rust Web
// Programming, 3rd ed., Flitton/Packt, the local EPUB). It's a hands-on
// continuation of the Book's async/web-server chapters: one to-do app grown into
// a nanoservices stack (async Hyper server → React frontend → Rust/WASM →
// PostgreSQL/SQLx → JWT auth server → inter-server comms → Redis cache → actor
// logging), the EPUB's 13 chapters. Added as weeks w8–w28 / days d33–d74 at a
// gentle ~2 sessions/week (Fri+Sun rhythm), starting 2026-09-22 and finishing
// 2027-02-14 (~5 months). The original 32 days (d01–d32) are UNCHANGED — this is a
// pure append, deliberately dated to never collide with a raylib side-track day
// (keeps the light-day scheduling invariant intact). The EPUB has no per-section
// URLs, so RWP tasks cite chapter + section NAME; official docs appear only as
// optional "go deeper" supplements.
//
// RWP PART B (2026-07-21): the 3rd-ed EPUB stops at Ch13 (observability), so the
// "left-off" chapters are stitched in from the COMPLETE 2nd edition (2023,
// Actix/Diesel — B18722). Only its UNIQUE chapters are used (Ch1–8 overlap the
// 3rd-ed spine and are skipped): Ch9 Testing, Ch10 Deploy/AWS, Ch11 HTTPS+NGINX,
// Ch13 Clean-repo/CI, Ch12 Rocket, then Part 6 low-level async/protocols
// (Ch14 Tokio, Ch15 TCP, Ch16 protocol framing, Ch17 Hyper actors, Ch18 Redis
// queue). Appended as weeks w29–w40 / days d75–d98, same gentle 2/week (Fri+Sun),
// 2027-02-19 → 2027-05-09. Ordered by lifecycle: build (3rd-ed) → test → deploy →
// secure → automate → flex (Rocket) → understand (Part 6). By Feb 2027 the main
// tracks and raylib have ended (only the bedrock side-track runs on, and a side-track
// never constrains a main roadmap's schedule), so Part B is unconstrained. The 2nd-ed stack
// (Actix/Diesel) differs from the app's (Hyper/SQLx) — tasks apply the CONCEPTS to
// the learner's app and flag the differences; Part 6 chapters are standalone.
// (The 1st-ed PDF is a strict subset of the 2nd ed — unused.)

import { registerRoadmap } from "../assets/js/registry.js";

const R = "rust", F = "fastapi", W = "rwp";

registerRoadmap({
  slug: "rust-fastapi",
  title: "Rust + FastAPI",
  icon: "🦀",
  subtitle: "The Rust Programming Language (Ch15→21) + Mastering FastAPI (Ch4→), then a complete Rust Web Programming reference (3rd + 2nd eds) — build, deploy & go low-level.",
  accent: "#f0803c",
  schemaVersion: 1,
  cadence: { activeDaysPerWeek: [4, 5] },

  objectives: [
    { id: R, title: "Rust — The Book", tier: "primary", weight: 1 },
    { id: F, title: "FastAPI", tier: "primary", weight: 1 },
    { id: W, title: "Rust Web Programming", tier: "primary", weight: 1 },
  ],

  weeks: [
    { id: "w1", title: "Week 1 — Smart pointers & DB foundations", start: "2026-08-04" },
    { id: "w2", title: "Week 2 — OOP, patterns, security", start: "2026-08-11" },
    { id: "w3", title: "Week 3 — Advanced Rust & the web-server arc", start: "2026-08-18" },
    { id: "w4", title: "Week 4 — Finish the server; deploy FastAPI", start: "2026-08-25" },
    { id: "w5", title: "Week 5 — Capstone & checkpoint", start: "2026-09-01" },
    { id: "w6", title: "Week 6 — Async Rust (Ch17) & real deployment", start: "2026-09-08" },
    { id: "w7", title: "Week 7 — Integration capstone & retro", start: "2026-09-15" },
    /* ---- RWP extension (Rust Web Programming, 3rd ed.) — weeks 8–28 ---- */
    { id: "w8", title: "Week 8 — RWP: setup & Rust review (Ch1)", start: "2026-09-22" },
    { id: "w9", title: "Week 9 — RWP: patterns & app design (Ch2)", start: "2026-09-29" },
    { id: "w10", title: "Week 10 — RWP: Cargo & nanoservices (Ch3)", start: "2026-10-06" },
    { id: "w11", title: "Week 11 — RWP: nanoservices & the DAL (Ch3)", start: "2026-10-13" },
    { id: "w12", title: "Week 12 — RWP: foundations checkpoint + Async (Ch4)", start: "2026-10-20" },
    { id: "w13", title: "Week 13 — RWP: tokio/Hyper & serving HTTP (Ch4–5)", start: "2026-10-27" },
    { id: "w14", title: "Week 14 — RWP: processing requests (Ch5–6)", start: "2026-11-03" },
    { id: "w15", title: "Week 15 — RWP: full CRUD + backend checkpoint (Ch6)", start: "2026-11-10" },
    { id: "w16", title: "Week 16 — RWP: a browser frontend (Ch7)", start: "2026-11-17" },
    { id: "w17", title: "Week 17 — RWP: styling & Rust-in-WASM (Ch7–8)", start: "2026-11-24" },
    { id: "w18", title: "Week 18 — RWP: WASM kernel & client (Ch8)", start: "2026-12-01" },
    { id: "w19", title: "Week 19 — RWP: full-stack checkpoint + PostgreSQL (Ch9)", start: "2026-12-08" },
    { id: "w20", title: "Week 20 — RWP: SQLx & migrations (Ch9)", start: "2026-12-15" },
    { id: "w21", title: "Week 21 — RWP: persistence checkpoint + auth (Ch10)", start: "2026-12-22" },
    { id: "w22", title: "Week 22 — RWP: users, JWT & login (Ch10)", start: "2026-12-29" },
    { id: "w23", title: "Week 23 — RWP: server-to-server comms (Ch11)", start: "2027-01-05" },
    { id: "w24", title: "Week 24 — RWP: caching with Redis (Ch12)", start: "2027-01-12" },
    { id: "w25", title: "Week 25 — RWP: cache kernel & logging (Ch12–13)", start: "2027-01-19" },
    { id: "w26", title: "Week 26 — RWP: logging actor + stack checkpoint (Ch13)", start: "2027-01-26" },
    { id: "w27", title: "Week 27 — RWP: capstone — run & harden", start: "2027-02-02" },
    { id: "w28", title: "Week 28 — RWP: retro & buffer", start: "2027-02-09" },
    /* ---- RWP Part B (2nd-ed Ch9–18) — weeks 29–40 ---- */
    { id: "w29", title: "Week 29 — RWP Part B — Testing (2nd-ed Ch9)", start: "2027-02-16" },
    { id: "w30", title: "Week 30 — RWP Part B — Testing → Deploy (Ch9–10)", start: "2027-02-23" },
    { id: "w31", title: "Week 31 — RWP Part B — Deploy on AWS (Ch10)", start: "2027-03-02" },
    { id: "w32", title: "Week 32 — RWP Part B — HTTPS & NGINX (Ch11)", start: "2027-03-09" },
    { id: "w33", title: "Week 33 — RWP Part B — deploy checkpoint + clean repo (Ch13)", start: "2027-03-16" },
    { id: "w34", title: "Week 34 — RWP Part B — CI + Rocket (Ch13, Ch12)", start: "2027-03-23" },
    { id: "w35", title: "Week 35 — RWP Part B — Rocket + Tokio (Ch12, Ch14)", start: "2027-03-30" },
    { id: "w36", title: "Week 36 — RWP Part B — actors & TCP (Ch14–15)", start: "2027-04-06" },
    { id: "w37", title: "Week 37 — RWP Part B — TCP & protocols (Ch15–16)", start: "2027-04-13" },
    { id: "w38", title: "Week 38 — RWP Part B — framing & Hyper actors (Ch16–17)", start: "2027-04-20" },
    { id: "w39", title: "Week 39 — RWP Part B — Hyper server & Redis queue (Ch17–18)", start: "2027-04-27" },
    { id: "w40", title: "Week 40 — RWP Part B — Redis queue & capstone (Ch18)", start: "2027-05-04" },
  ],

  days: [
    /* ---------------- Week 1 ---------------- */
    {
      id: "d01", date: "2026-08-04", week: "w1", title: "Resume: Box & Deref",
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
      id: "d02", date: "2026-08-05", week: "w1", title: "Rc, RefCell & Weak",
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
      id: "d03", date: "2026-08-06", week: "w1", title: "FastAPI databases",
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
      id: "d04", date: "2026-08-08", week: "w1", title: "Fearless concurrency",
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
      id: "d05", date: "2026-08-09", week: "w1", title: "FastAPI project structure",
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
      id: "d06", date: "2026-08-11", week: "w2", title: "OOP in Rust",
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
      id: "d07", date: "2026-08-12", week: "w2", title: "FastAPI security (JWT)",
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
      id: "d08", date: "2026-08-13", week: "w2", title: "Patterns & matching",
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
      id: "d09", date: "2026-08-15", week: "w2", title: "FastAPI dependencies",
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
      id: "d10", date: "2026-08-16", week: "w2", title: "Advanced Rust I",
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
      id: "d11", date: "2026-08-18", week: "w3", title: "Advanced Rust II",
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
      id: "d12", date: "2026-08-19", week: "w3", title: "FastAPI testing",
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
      id: "d13", date: "2026-08-20", week: "w3", title: "Web server I — single-threaded",
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
      id: "d14", date: "2026-08-22", week: "w3", title: "Web server II — the thread pool",
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
      id: "d15", date: "2026-08-23", week: "w3", title: "FastAPI microservices (light)",
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
      id: "d16", date: "2026-08-25", week: "w4", title: "Web server III — graceful shutdown",
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
      id: "d17", date: "2026-08-26", week: "w4", title: "FastAPI deploy",
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
      id: "d18", date: "2026-08-27", week: "w4", title: "Lifespan & Pydantic v2",
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
      id: "d19", date: "2026-08-29", week: "w4", title: "Rust macros & reference appendices",
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
      id: "d20", date: "2026-08-30", week: "w4", title: "Capstone I — real API",
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
      id: "d21", date: "2026-09-01", week: "w5", title: "Capstone II — auth & tests",
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
      id: "d22", date: "2026-09-02", week: "w5", title: "Async SQLAlchemy 2.0",
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
      id: "d23", date: "2026-09-03", week: "w5", title: "Rust consolidation",
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
      id: "d24", date: "2026-09-05", week: "w5", title: "Checkpoint — books closed",
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
      id: "d25", date: "2026-09-08", week: "w6", title: "Async Rust I — the Book's Ch17 (futures & async)",
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
      id: "d26", date: "2026-09-09", week: "w6", title: "FastAPI — ship the capstone",
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
      id: "d27", date: "2026-09-10", week: "w6", title: "Async Rust II — an async web server",
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
      id: "d28", date: "2026-09-12", week: "w6", title: "Buffer / catch-up",
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
      id: "d29", date: "2026-09-15", week: "w7", title: "Integration capstone I — design",
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
      id: "d30", date: "2026-09-16", week: "w7", title: "Integration capstone II — wire it up",
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
      id: "d31", date: "2026-09-17", week: "w7", title: "Polish & tests",
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
      id: "d32", date: "2026-09-19", week: "w7", title: "Grand retro & next-project plan",
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
    {
      id: "d33", date: "2026-09-25", week: "w8", title: "New book: Rust Web Programming (3rd ed.)",
      theme: "A new arc begins — the Rust Book's web/async ideas, applied end-to-end. Set up, then meet the book's plan.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 30,
          label: `<b>Orientation:</b> read the Preface & the intro to <b>Ch1 A Quick Introduction to Rust</b> — how the book grows one to-do app into <b>nanoservices</b> (async server → frontend → WASM → Postgres → auth → Redis → logging). Skim the whole table of contents so the destination is clear.`,
          sub: [
            { id: "s1", est: 15, label: `Read the Preface + Ch1 opener; note the nanoservices end-state.` },
            { id: "s2", est: 15, label: `Skim the 13-chapter map so you know where each piece lands.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 30,
          label: `<b>Set up the workspace:</b> confirm your toolchain (<code>rustc</code>/<code>cargo</code> current, <code>rustup update</code>), install <code>rust-analyzer</code>, and create a fresh <code>rust-web-programming/</code> repo you'll grow chapter by chapter.`,
          sub: [
            { id: "s1", est: 15, label: `Verify <code>rustc --version</code> &amp; <code>cargo --version</code>; <code>rustup update stable</code>.` },
            { id: "s2", est: 15, label: `Init the repo + a <code>.gitignore</code> (<code>/target</code>, <code>.env</code>); first commit.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `📖 This book is a local EPUB — tasks reference it by <b>chapter &amp; section name</b>, not URL. Official-doc links are added only as optional "go deeper" supplements.` },
        { id: "s2", type: "hint", label: `💡 You already finished The Rust Book — Ch1 here is a fast review. Don't grind it; confirm what's rusty and move on.` },
      ],
      note: "Very light kickoff — the pace stays gentle (2 sessions/week) through February.",
    },
    {
      id: "d34", date: "2026-09-27", week: "w8", title: "Ch1 review — types, collections, errors",
      theme: "Fast confirm-only pass over the fundamentals, framed for web code.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch1</b>: skim <i>data types &amp; variables</i>, <i>strings</i>, <i>integers/floats</i>, <i>arrays</i>, <i>enums</i>, <i>vectors</i>, <i>HashMaps</i>, and <i>handling results &amp; errors</i>. You know these — read for the book's web-flavoured examples.`,
          sub: [
            { id: "s1", est: 12, label: `Types, strings, ints/floats, arrays.` },
            { id: "s2", est: 13, label: `Enums, vectors, HashMaps, <code>Result</code>/error handling.` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 20,
          label: `Do the chapter's <b>Questions</b> section and check your answers; jot the 1–2 idioms the book uses that you'd not have reached for.`,
          sub: [
            { id: "s1", est: 12, label: `Work the Ch1 Questions.` },
            { id: "s2", est: 8, label: `Note book-specific idioms to reuse.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Treat Ch1/Ch2 as a warm-up ramp — the real work starts at Ch3 when the project is scaffolded.` },
      ],
    },
    {
      id: "d35", date: "2026-10-02", week: "w9", title: "Ch1 review — ownership, lifetimes, structs",
      theme: "The borrow-checker half of the review — the part that matters most for the server.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch1</b>: <i>controlling variable ownership</i> — copying vs moving, immutable/mutable borrowing, <i>scopes</i>, <i>lifetimes</i>, and <i>building structs</i>. Confirm the mental model before the app leans on it hard.`,
          sub: [
            { id: "s1", est: 15, label: `Copy/move, immutable &amp; mutable borrows, scopes.` },
            { id: "s2", est: 15, label: `Lifetimes &amp; building structs.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 20,
          label: `Quick drill: write a <code>struct</code> with a borrowed field and a method returning a reference, and make the lifetime annotations compile — the shape you'll see all over the DAL.`,
          sub: [
            { id: "s1", est: 10, label: `Struct with a <code>&amp;str</code> field + a lifetime.` },
            { id: "s2", est: 10, label: `A method returning a borrowed field; make it compile.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Rustier lifetimes refresher (optional): <a href="https://doc.rust-lang.org/nomicon/lifetimes.html" target="_blank" rel="noopener">Nomicon — Lifetimes</a>.` },
      ],
    },
    {
      id: "d36", date: "2026-10-04", week: "w9", title: "Ch2 — traits & macros for the web",
      theme: "Patterns the whole book leans on: trait-based verification and macro metaprogramming.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch2 Useful Rust Patterns</b>: <i>verifying with traits</i> and <i>metaprogramming with macros</i> — how the book uses traits as a compile-time contract and <code>macro_rules!</code> to cut boilerplate.`,
          sub: [
            { id: "s1", est: 15, label: `Verifying with traits (trait-as-contract).` },
            { id: "s2", est: 15, label: `Metaprogramming with macros — <code>macro_rules!</code> basics.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Build the chapter's trait-verification example; then write a tiny declarative macro of your own and expand it with <code>cargo expand</code> to see what it generates.`,
          sub: [
            { id: "s1", est: 20, label: `Implement the trait-verification pattern.` },
            { id: "s2", est: 15, label: `Write a small <code>macro_rules!</code>; inspect with <code>cargo expand</code>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This chapter is the "why" behind a lot of later code — when a struct "just knows" it's valid, it's this trait pattern doing the work.` },
      ],
    },
    {
      id: "d37", date: "2026-10-09", week: "w10", title: "Ch2 — messages, config traits, typed state",
      theme: "Finish the patterns: macro-mapped messages and compiler-enforced struct state.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch2</b>: <i>mapping messages with macros</i>, <i>configuring our functions with traits</i>, and <i>checking struct state with the compiler</i> (the typestate pattern).`,
          sub: [
            { id: "s1", est: 12, label: `Mapping messages with macros.` },
            { id: "s2", est: 13, label: `Trait-configured functions + compiler-checked struct state.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 30,
          label: `Implement the <b>typestate</b> example so an invalid transition won't compile; prove it by trying a bad call and reading the error.`,
          sub: [
            { id: "s1", est: 20, label: `Build the typestate struct (state as a type parameter).` },
            { id: "s2", est: 10, label: `Attempt an illegal transition; confirm it fails to compile.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Typestate = "make illegal states unrepresentable." You'll recognise it later when the auth flow refuses to serialise an unverified user.` },
      ],
    },
    {
      id: "d38", date: "2026-10-11", week: "w10", title: "Ch3 — Cargo, deeper",
      theme: "Managing a real multi-crate project with Cargo — the toolbox for everything ahead.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch3 Designing Your Web Application in Rust</b>: <i>managing a software project with Cargo</i> — basic compilation, building with Cargo, shipping crates, documenting, and interacting with Cargo.`,
          sub: [
            { id: "s1", est: 15, label: `Compilation model + building/shipping crates.` },
            { id: "s2", est: 12, label: `Documenting (<code>cargo doc</code>) &amp; interacting with Cargo.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 28,
          label: `Set up a Cargo <b>workspace</b> with a couple of member crates (the seed of the nanoservices layout); generate and open the docs.`,
          sub: [
            { id: "s1", est: 18, label: `Create a workspace + 2 member crates.` },
            { id: "s2", est: 10, label: `<code>cargo doc --open</code>; skim the generated site.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Reference: <a href="https://doc.rust-lang.org/cargo/reference/workspaces.html" target="_blank" rel="noopener">Cargo — Workspaces</a>.` },
      ],
    },
    {
      id: "d39", date: "2026-10-15", week: "w11", title: "Ch3 — nanoservices structure",
      theme: "The book's architecture: splitting the app into small, sharply-scoped services.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch3</b>: <i>structuring code through nanoservices</i>, <i>building to-do structs</i>, and <i>managing structs with an API</i> — the layered core/networking split the rest of the book builds on.`,
          sub: [
            { id: "s1", est: 15, label: `The nanoservices structure &amp; layering.` },
            { id: "s2", est: 12, label: `To-do structs + managing them with an API.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Scaffold the <b>to-do core</b> crate: the <code>Base</code>/<code>Pending</code>/<code>Done</code> item structs and the create/get/edit/delete API surface (in-memory for now).`,
          sub: [
            { id: "s1", est: 20, label: `Define the to-do item structs + enum states.` },
            { id: "s2", est: 15, label: `Sketch the core API functions (no storage yet).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 "Nanoservice" here = a crate with one job and a clean boundary. Keep the <b>core</b> (logic) ignorant of the <b>networking</b> and <b>storage</b> layers — that separation is the whole design.` },
      ],
    },
    {
      id: "d40", date: "2026-10-18", week: "w11", title: "Ch3 — the Data Access Layer",
      theme: "A storage boundary the rest of the app talks to — swappable later for SQLx.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 22,
          label: `<b>Ch3</b>: <i>storing tasks with our Data Access Layer</i> and <i>creating a task using our DAL</i> — the trait-shaped seam between logic and persistence.`,
          sub: [
            { id: "s1", est: 12, label: `The DAL concept &amp; its trait boundary.` },
            { id: "s2", est: 10, label: `Creating a task through the DAL.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 38,
          label: `Build a file/JSON-backed DAL behind a trait, and wire "create task" end-to-end through core → DAL. This trait is what Ch9 swaps for Postgres.`,
          sub: [
            { id: "s1", est: 20, label: `Define the DAL trait + a JSON-file implementation.` },
            { id: "s2", est: 18, label: `Wire create/read task through core → DAL; test by hand.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Because the DAL is a trait, Ch9's PostgreSQL swap is a new <code>impl</code>, not a rewrite. Design for that seam now.` },
      ],
    },
    {
      id: "d41", date: "2026-10-23", week: "w12", title: "Checkpoint — foundations solid",
      theme: "Catch up and make sure the scaffolding is real before the async server lands.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 30,
          label: `<b>Consolidation:</b> re-run everything from Ch2–Ch3; make sure the workspace builds, the to-do core + DAL create/read a task, and your notes capture the traits/macros patterns.`,
          sub: [
            { id: "s1", est: 15, label: `<code>cargo build</code> clean across the workspace; DAL create/read works.` },
            { id: "s2", est: 15, label: `One-page notes: nanoservices layout + the DAL trait seam.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 20, optional: true,
          label: `<b>If caught up:</b> add a couple of unit tests around the core API (create then get returns it). Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Nothing new today by design — a light week keeps the 5-month pace sustainable.` },
      ],
      note: "Light checkpoint day.",
    },
    {
      id: "d42", date: "2026-10-25", week: "w12", title: "Ch4 — Async Rust, the book's way",
      theme: "You met async in The Book; here it's applied to build a task queue and a server.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch4 Async Rust</b>: <i>understanding asynchronous programming</i> and <i>understanding async and await</i> — the futures/poll model, refreshed with the book's framing.`,
          sub: [
            { id: "s1", est: 15, label: `Async programming model; why it beats a thread-per-conn.` },
            { id: "s2", est: 12, label: `<code>async</code>/<code>.await</code> &amp; the <code>Future</code> state machine.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 33,
          label: `Implement the chapter's <b>own async task queue</b> — spawn futures, await results — to feel the runtime before <code>tokio</code> hides it.`,
          sub: [
            { id: "s1", est: 20, label: `Build the hand-rolled async task queue.` },
            { id: "s2", est: 13, label: `Drive it: enqueue N tasks, await all, print results.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Runtime it wraps: <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio tutorial</a>. You built a tokio server in the async-Rust weeks — this reuses that muscle.` },
      ],
    },
    {
      id: "d43", date: "2026-10-29", week: "w13", title: "Ch4 — tokio & a Hyper server",
      theme: "From hand-rolled futures to a real async runtime and a raw HTTP server.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch4</b>: <i>exploring high-level concepts of tokio</i> and <i>implementing a HTTP server in Hyper</i> — the async stack the app's networking layer sits on.`,
          sub: [
            { id: "s1", est: 13, label: `tokio high-level concepts (tasks, runtime, <code>spawn</code>).` },
            { id: "s2", est: 12, label: `A minimal <code>hyper</code> HTTP server.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Stand up the <b>Hyper server</b> from the chapter: bind a port, answer a hello route async. This is the networking-layer seed for Ch5–6.`,
          sub: [
            { id: "s1", est: 22, label: `Build &amp; run the hyper server; curl the route.` },
            { id: "s2", est: 13, label: `Confirm concurrent requests don't block each other.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://hyper.rs/guides/1/" target="_blank" rel="noopener">Hyper 1.0 guides</a>. Hyper is the low-level HTTP the ergonomic frameworks are built on — the book uses it directly on purpose.` },
      ],
    },
    {
      id: "d44", date: "2026-11-02", week: "w13", title: "Ch5 — serving the to-do core",
      theme: "Wire the async server to the to-do core: a real API surface starts to form.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 24,
          label: `<b>Ch5 Handling HTTP Requests</b>: <i>launching a basic web server</i> and <i>connecting the core to the server</i> — routing requests into the core API from Ch3.`,
          sub: [
            { id: "s1", est: 12, label: `Launch the basic web server (routing skeleton).` },
            { id: "s2", est: 12, label: `Connect the to-do core to the server.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Route <code>GET</code> requests through the server into the core and return the to-do list as JSON.`,
          sub: [
            { id: "s1", est: 20, label: `Wire a route → core → response.` },
            { id: "s2", est: 13, label: `Serialise the item list to JSON (<code>serde</code>).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://serde.rs/" target="_blank" rel="noopener">Serde</a> — the (de)serialisation crate every JSON route here uses.` },
      ],
    },
    {
      id: "d45", date: "2026-11-06", week: "w14", title: "Ch5 — serving items & error handling",
      theme: "Refactor to-do items into the response and give endpoints real error handling.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch5</b>: <i>refactoring our to-do items</i>, <i>serving our to-do items</i>, and <i>handling errors in API endpoints</i> — turning ad-hoc handlers into a clean, fallible API.`,
          sub: [
            { id: "s1", est: 13, label: `Refactor + serve to-do items.` },
            { id: "s2", est: 12, label: `Error handling in API endpoints.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Give the API a typed error → HTTP-status mapping (a custom error enum → <code>4xx/5xx</code>), so a bad request returns a clean status, not a panic.`,
          sub: [
            { id: "s1", est: 20, label: `Define an API error enum + <code>into_response</code> mapping.` },
            { id: "s2", est: 13, label: `Prove a bad path returns the right status.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Modelling errors as a type (then mapping to status) is the same instinct as FastAPI's <code>HTTPException</code> — one place decides how failure looks to clients.` },
      ],
    },
    {
      id: "d46", date: "2026-11-08", week: "w14", title: "Ch6 — params & POST bodies",
      theme: "Read data out of requests: URL params and JSON bodies.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 24,
          label: `<b>Ch6 Processing HTTP Requests</b>: <i>passing parameters via the URL</i> and <i>passing data via a POST body</i> — extracting and validating input.`,
          sub: [
            { id: "s1", est: 12, label: `URL parameters (path + query).` },
            { id: "s2", est: 12, label: `POST body → deserialised, validated struct.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Add <b>create</b> (POST a new to-do from a JSON body) and a filtered <b>list</b> (query param) to the API; validate the body with the trait pattern from Ch2.`,
          sub: [
            { id: "s1", est: 22, label: `POST create from a JSON body.` },
            { id: "s2", est: 13, label: `Query-param filtered list.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Reuse your Ch2 trait-verification here so an invalid body can't reach the core — validation at the edge.` },
      ],
    },
    {
      id: "d47", date: "2026-11-13", week: "w15", title: "Ch6 — PUT, DELETE & headers",
      theme: "Round out the verbs and read request headers (the seam auth uses later).",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 24,
          label: `<b>Ch6</b>: <i>deleting resources using the DELETE method</i>, <i>updating resources using the PUT method</i>, and <i>extracting data from HTTP request headers</i>.`,
          sub: [
            { id: "s1", est: 12, label: `DELETE + PUT handlers.` },
            { id: "s2", est: 12, label: `Reading request headers.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Complete the CRUD verbs (edit + delete a to-do) and read a custom header in a handler — the hook Ch10's JWT will plug into.`,
          sub: [
            { id: "s1", est: 20, label: `PUT edit + DELETE remove, end-to-end.` },
            { id: "s2", est: 13, label: `Read a header (e.g. a fake token) in a handler.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Full CRUD now works over HTTP against the core + DAL — the backend is functionally complete before any frontend or database.` },
      ],
    },
    {
      id: "d48", date: "2026-11-15", week: "w15", title: "Checkpoint — the backend API",
      theme: "Prove the whole backend with curl before turning to the browser.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 30,
          label: `<b>Consolidation:</b> exercise every endpoint with curl — create, list, filter, edit, delete — and confirm error paths return clean statuses. Write the API down as a short reference.`,
          sub: [
            { id: "s1", est: 18, label: `curl each verb; confirm happy + error responses.` },
            { id: "s2", est: 12, label: `One-page API reference (routes, bodies, statuses).` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 20, optional: true,
          label: `<b>If caught up:</b> add a couple of integration tests hitting the running server. Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Half the book done. The backend nanoservice is real; Ch7 gives it a face.` },
      ],
      note: "Light checkpoint day.",
    },
    {
      id: "d49", date: "2026-11-20", week: "w16", title: "Ch7 — serving a frontend from Rust",
      theme: "The app grows a browser face: dev setup and serving static assets from Rust.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch7 Displaying Content in the Browser</b>: <i>building out the development setup</i> and <i>serving frontend from Rust</i> — how the Rust server ships HTML/JS to the browser.`,
          sub: [
            { id: "s1", est: 13, label: `Frontend dev setup (build tooling).` },
            { id: "s2", est: 12, label: `Serving the frontend from the Rust server.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 32,
          label: `Serve an <code>index.html</code> + bundle from the Hyper server and load it in the browser; confirm the static route and the API route coexist.`,
          sub: [
            { id: "s1", est: 20, label: `Static-file route from Rust; load the page.` },
            { id: "s2", est: 12, label: `Confirm API + static routes both respond.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 One Rust process serving both the API and the static frontend is the book's deployment simplicity — no separate web server yet.` },
      ],
    },
    {
      id: "d50", date: "2026-11-22", week: "w16", title: "Ch7 — React components on the API",
      theme: "A real component UI talking to the Rust backend.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch7</b>: <i>connecting backend API endpoints to the frontend</i> and <i>creating React components</i> — fetching from the API and rendering the to-do list.`,
          sub: [
            { id: "s1", est: 13, label: `Wiring fetch calls to the API endpoints.` },
            { id: "s2", est: 14, label: `Creating the React components.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 37,
          label: `Build the to-do list + add-item components against your live API; create, toggle and delete from the browser.`,
          sub: [
            { id: "s1", est: 22, label: `List + add-item components calling the API.` },
            { id: "s2", est: 15, label: `Toggle/delete wired to PUT/DELETE.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 If React is new-ish, don't rabbit-hole — the book keeps the JS minimal on purpose; the interesting part is the Rust it talks to.` },
      ],
    },
    {
      id: "d51", date: "2026-11-27", week: "w17", title: "Ch7 — styling the app",
      theme: "Make it presentable, then close out the frontend chapter.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 20,
          label: `<b>Ch7</b>: <i>inserting styles with CSS</i> — structuring the stylesheet and wiring it into the served frontend.`,
          sub: [
            { id: "s1", est: 10, label: `CSS structure + serving it from Rust.` },
            { id: "s2", est: 10, label: `Apply styles to the components.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 32,
          label: `Style the to-do UI into something you'd screenshot; verify the full create→render→edit→delete loop looks and works right.`,
          sub: [
            { id: "s1", est: 20, label: `Style the list, form, and item states.` },
            { id: "s2", est: 12, label: `Full-loop smoke test in the browser.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Milestone in sight: after Ch8 you'll have a styled, Rust-served, WASM-accelerated frontend on a real async backend.` },
      ],
    },
    {
      id: "d52", date: "2026-11-29", week: "w17", title: "Ch8 — Rust in the browser (WASM) I",
      theme: "The hard, fun chapter: compile Rust to WebAssembly and run it in the page.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch8 Injecting Rust in the Frontend with WASM</b>: <i>setting up our WASM build</i> and <i>loading WASM in the front-end</i> / <i>on the local machine</i>.`,
          sub: [
            { id: "s1", est: 15, label: `WASM build setup (<code>wasm-pack</code>/<code>wasm-bindgen</code>).` },
            { id: "s2", est: 12, label: `Loading the WASM module in the front-end.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Get a trivial Rust function compiled to WASM and called from the page's JS — the toolchain working end-to-end before the real kernel.`,
          sub: [
            { id: "s1", est: 20, label: `Build a hello-WASM crate; call it from JS.` },
            { id: "s2", est: 13, label: `Confirm it loads locally + in the served page.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://rustwasm.github.io/docs/book/" target="_blank" rel="noopener">The rustwasm Book</a> &amp; <a href="https://rustwasm.github.io/wasm-pack/" target="_blank" rel="noopener">wasm-pack</a> — reach for these if the build fights you.` },
      ],
    },
    {
      id: "d53", date: "2026-12-04", week: "w18", title: "Ch8 — WASM kernel & library",
      theme: "Grow the WASM from toy to a real, reusable module.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch8</b>: <i>building a WASM kernel</i> and <i>building a WASM library</i> — structuring the Rust-in-browser code as something the frontend can lean on.`,
          sub: [
            { id: "s1", est: 14, label: `Building the WASM kernel.` },
            { id: "s2", est: 13, label: `Building the WASM library.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Move a piece of real logic (e.g. client-side validation or filtering) into the WASM library and call it from the components.`,
          sub: [
            { id: "s1", est: 20, label: `Implement the WASM library function.` },
            { id: "s2", est: 15, label: `Call it from React; verify in the browser.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The payoff: shared Rust logic on both sides of the wire — the same validation the server trusts can run in the browser.` },
      ],
    },
    {
      id: "d54", date: "2026-12-06", week: "w18", title: "Ch8 — the WASM client",
      theme: "Tie the WASM into a proper client layer the app uses.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 24,
          label: `<b>Ch8</b>: <i>building a WASM client</i> — wrapping the WASM library into the frontend's data/client layer.`,
          sub: [
            { id: "s1", est: 12, label: `Designing the WASM client wrapper.` },
            { id: "s2", est: 12, label: `Integrating it into the frontend flow.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Wire the WASM client into the to-do UI so a user action flows through Rust-in-the-browser; confirm the full frontend still works.`,
          sub: [
            { id: "s1", est: 20, label: `Route a UI action through the WASM client.` },
            { id: "s2", est: 13, label: `Regression-check the whole frontend loop.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Frontend chapters done: a styled React UI, served from Rust, with Rust/WASM in the browser. Next it gets a real database.` },
      ],
    },
    {
      id: "d55", date: "2026-12-11", week: "w19", title: "Checkpoint — the full-stack app",
      theme: "Step back: the whole app runs, browser to backend. Catch up before Postgres.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 30,
          label: `<b>Consolidation:</b> run the entire stack — React UI → Rust server → core → JSON DAL — and confirm every feature. Capture the architecture as a one-page diagram.`,
          sub: [
            { id: "s1", est: 15, label: `Full end-to-end run of every feature.` },
            { id: "s2", est: 15, label: `Draw the current architecture (layers + data flow).` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 20, optional: true,
          label: `<b>If caught up:</b> tidy the workspace — clippy pass, remove dead code, commit a clean checkpoint. Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 The JSON DAL was always temporary scaffolding — Ch9 replaces it with real PostgreSQL, and the trait seam makes that a swap, not a rewrite.` },
      ],
      note: "Light checkpoint day.",
    },
    {
      id: "d56", date: "2026-12-13", week: "w19", title: "Ch9 — PostgreSQL in Docker",
      theme: "Real persistence begins: a database, containerised, wired to routing.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch9 Data Persistence with PostgreSQL</b>: <i>why a proper database</i>, <i>why Docker</i>, <i>running a database in Docker</i>, <i>routing &amp; ports</i>, and <i>running it in the background with bash scripts</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Why a DB + why Docker; docker networking/ports.` },
            { id: "s2", est: 12, label: `Bash scripts to run Postgres in the background.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 30,
          label: `Stand up PostgreSQL in Docker with a start/stop script and connect to it from <code>psql</code>; confirm the container + port routing.`,
          sub: [
            { id: "s1", est: 18, label: `Docker Postgres up via a script; connect with <code>psql</code>.` },
            { id: "s2", est: 12, label: `Confirm host↔container port routing.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">Docker get-started</a> if the container basics are rusty.` },
      ],
    },
    {
      id: "d57", date: "2026-12-18", week: "w20", title: "Ch9 — SQLx & database transactions",
      theme: "Swap the JSON DAL for real SQL behind the same trait.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch9</b>: <i>adding SQLX to our Data Access Layer</i>, <i>defining our database transactions</i>, and <i>connecting our transactions to the core</i>.`,
          sub: [
            { id: "s1", est: 14, label: `Adding SQLx to the DAL.` },
            { id: "s2", est: 13, label: `Defining DB transactions + connecting to core.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 37,
          label: `Implement the DAL trait against Postgres with <code>sqlx</code> (compile-time-checked queries) and route create/read/update/delete through it.`,
          sub: [
            { id: "s1", est: 22, label: `SQLx <code>impl</code> of the DAL trait (real queries).` },
            { id: "s2", est: 15, label: `CRUD flows through core → SQLx DAL.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://docs.rs/sqlx" target="_blank" rel="noopener">SQLx</a> — note the compile-time query checking; it catches SQL typos at <code>cargo build</code>.` },
      ],
    },
    {
      id: "d58", date: "2026-12-20", week: "w20", title: "Ch9 — migrations & frontend refactor",
      theme: "Version the schema and reconnect the browser to the persistent backend.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch9</b>: <i>connecting our transactions to the server</i>, <i>creating our database migrations</i>, and <i>refactoring our frontend</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Transactions → server; creating migrations.` },
            { id: "s2", est: 12, label: `Refactoring the frontend for the DB-backed API.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Add SQLx migrations (schema as versioned files), run them on startup, and confirm the React app now reads/writes real Postgres rows that survive a restart.`,
          sub: [
            { id: "s1", est: 20, label: `Write + run migrations; schema created on boot.` },
            { id: "s2", est: 15, label: `Browser create → restart container → data persists.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Migrations are the honest way to evolve a schema — never hand-edit prod tables. Same discipline as Alembic in the FastAPI world.` },
      ],
    },
    {
      id: "d59", date: "2026-12-25", week: "w21", title: "Checkpoint — it persists",
      theme: "Confirm the persistence layer is solid before authentication complicates things.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 27,
          label: `<b>Consolidation:</b> verify the DB-backed app fully — migrations reproducible from scratch, CRUD survives restarts, and the JSON DAL is gone. Note anything flaky.`,
          sub: [
            { id: "s1", est: 15, label: `Drop &amp; recreate via migrations; full CRUD works.` },
            { id: "s2", est: 12, label: `Confirm restart-persistence; list open questions.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 20, optional: true,
          label: `<b>If caught up:</b> add a DB integration test (insert → query) using a throwaway test database. Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 The app is a real persistent full-stack service now. Ch10–13 make it multi-user, multi-server, cached, and observable.` },
      ],
      note: "Light checkpoint day.",
    },
    {
      id: "d60", date: "2026-12-27", week: "w21", title: "Ch10 — the auth server & passwords",
      theme: "A second nanoservice appears: authentication, starting with safe password storage.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch10 Managing User Sessions</b>: <i>building our auth server</i> (data-access / core / networking layers), <i>defining our user data model</i>, and <i>storing &amp; verifying passwords</i>.`,
          sub: [
            { id: "s1", est: 14, label: `Auth server's three layers + user data model.` },
            { id: "s2", est: 13, label: `Storing &amp; verifying passwords (hashing).` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Scaffold the <b>auth</b> nanoservice with its own DAL/core/networking, a user table, and password hashing + verification.`,
          sub: [
            { id: "s1", est: 20, label: `Auth crate skeleton (three layers) + user model.` },
            { id: "s2", est: 15, label: `Hash on store, verify on check; never store plaintext.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 The auth server mirrors the to-do server's layering — same nanoservice shape, different job. That symmetry is the point.` },
      ],
    },
    {
      id: "d61", date: "2027-01-01", week: "w22", title: "Ch10 — users & JWT",
      theme: "Create users, then build the JWT machinery that proves who they are.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 28,
          label: `<b>Ch10</b>: <i>creating users</i> (DB transaction, core endpoint, networking endpoint) and <i>refactoring/restructuring our JWT</i> — <i>get-key</i>, <i>encoding</i>, and <i>decoding the token</i>.`,
          sub: [
            { id: "s1", est: 14, label: `Create-user across DB tx → core → networking.` },
            { id: "s2", est: 14, label: `JWT: get-key, encode, decode.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Implement create-user end-to-end and a JWT module that encodes a signed token and decodes/validates it; unit-test round-tripping a token.`,
          sub: [
            { id: "s1", est: 20, label: `Create-user endpoint working against Postgres.` },
            { id: "s2", est: 15, label: `JWT encode/decode module + a round-trip test.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://docs.rs/jsonwebtoken" target="_blank" rel="noopener">jsonwebtoken</a> — the crate behind the encode/decode; mind the expiry (<code>exp</code>) claim.` },
      ],
    },
    {
      id: "d62", date: "2027-01-03", week: "w22", title: "Ch10 — login & frontend auth",
      theme: "Close the loop: a login API and a browser flow that carries the token.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>Ch10</b>: <i>building our login API</i> (get user by email, core login, mount to server) and <i>adding authentication to our frontend</i> — login call, tokens on API calls, a login form wired into the app.`,
          sub: [
            { id: "s1", est: 13, label: `Login API: by-email lookup → core login → server.` },
            { id: "s2", est: 13, label: `Frontend: login call, attach token, login form.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 37,
          label: `Wire login end-to-end: submit the form → get a JWT → attach it to subsequent API calls → a protected route accepts it and rejects a missing/expired one.`,
          sub: [
            { id: "s1", est: 22, label: `Login form → token → authenticated API calls.` },
            { id: "s2", est: 15, label: `Protected route: 200 with token, 401 without.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Same three ideas as your FastAPI JWT work — hash, sign, verify — now in Rust across a dedicated auth service. The concepts transfer; the plumbing differs.` },
      ],
    },
    {
      id: "d63", date: "2027-01-08", week: "w23", title: "Ch11 — servers talking to servers",
      theme: "The to-do service asks the auth service who a user is — real inter-service calls.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>Ch11 Communicating Between Servers</b>: <i>getting users from auth with a unique ID</i> (adding get-by-unique-id to dal / core / networking) and <i>making auth accessible to other servers</i>.`,
          sub: [
            { id: "s1", est: 14, label: `get-by-unique-id through dal → core → networking.` },
            { id: "s2", est: 12, label: `Exposing auth so other servers can call it.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Add a get-user-by-id path to the auth service and expose it; have the to-do service call auth over HTTP to resolve a token's user.`,
          sub: [
            { id: "s1", est: 20, label: `Auth exposes get-by-id; to-do calls it.` },
            { id: "s2", est: 13, label: `Resolve the JWT's user via a real inter-service request.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 This is the "micro/nano-service tax" made concrete: a boundary you now cross over HTTP. Ch12 caches it so you don't pay every request.` },
      ],
    },
    {
      id: "d64", date: "2027-01-10", week: "w23", title: "Ch11 — tethering users to items",
      theme: "Ownership: to-do items belong to users, threaded through every layer.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>Ch11</b>: <i>tethering users to to-do items</i> — linking items to users in the database and adding user IDs to data-access, core, and networking functions; plus <i>testing server-to-server communication with bash</i>.`,
          sub: [
            { id: "s1", est: 14, label: `Link items→users in the DB; user IDs through the layers.` },
            { id: "s2", est: 12, label: `Bash test of the two servers cooperating.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Add a <code>user_id</code> to the to-do schema (migration) and scope every query to the authenticated user; verify with a two-server bash test that users only see their own items.`,
          sub: [
            { id: "s1", est: 20, label: `Migration + user-scoped queries end-to-end.` },
            { id: "s2", est: 15, label: `Bash test: user A can't see user B's items.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Multi-user + multi-server now works. Two milestones from the finish: caching (Ch12) and observability (Ch13).` },
      ],
    },
    {
      id: "d65", date: "2027-01-15", week: "w24", title: "Ch12 — caching with Redis",
      theme: "Stop hitting the auth server every request: cache sessions in Redis.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch12 Caching Auth Sessions</b>: <i>what is caching</i>, <i>setting up Redis</i>, <i>building our Redis module</i>, and <i>defining the user session</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Caching concepts; Redis set-up (Docker).` },
            { id: "s2", est: 12, label: `The Redis module + user-session shape.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 31,
          label: `Run Redis in Docker alongside Postgres and build the Redis module + a typed user-session value you can store and fetch.`,
          sub: [
            { id: "s1", est: 18, label: `Redis container + connection module.` },
            { id: "s2", est: 13, label: `Store/fetch a typed user session.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://docs.rs/redis" target="_blank" rel="noopener">redis crate</a>. Cache invalidation is the hard part — watch how the book handles logout/update next.` },
      ],
    },
    {
      id: "d66", date: "2027-01-17", week: "w24", title: "Ch12 — session lifecycle & client",
      theme: "Login/logout/update flows through the cache, behind a clean client.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch12</b>: <i>building the login / logout / update processes</i> and <i>building our Redis client</i> (login-logout client, update client).`,
          sub: [
            { id: "s1", est: 14, label: `Login/logout/update cache processes.` },
            { id: "s2", est: 13, label: `The Redis client wrapping them.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Implement login (write session), logout (evict), and update (refresh) against Redis behind a client; confirm a logged-out token stops working immediately.`,
          sub: [
            { id: "s1", est: 20, label: `Login/logout/update via the Redis client.` },
            { id: "s2", est: 15, label: `Verify eviction: logout invalidates the session now.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The cache is the source of truth for "is this session live?" — get eviction right and logout is instant; get it wrong and it's a security bug.` },
      ],
    },
    {
      id: "d67", date: "2027-01-22", week: "w25", title: "Ch12 — the cache kernel",
      theme: "A shared cache boundary both servers call — the caching capstone.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch12</b>: <i>connecting our cache</i>, <i>building our cache kernel</i>, and <i>calling the kernel from the to-do server</i> and <i>from the auth server</i>.`,
          sub: [
            { id: "s1", est: 13, label: `The cache kernel abstraction.` },
            { id: "s2", est: 12, label: `Calling it from both servers.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Build the cache kernel and route both servers' session checks through it; confirm the auth service is no longer hit on a cache hit.`,
          sub: [
            { id: "s1", est: 20, label: `Cache kernel + both servers wired to it.` },
            { id: "s2", est: 13, label: `Measure: cache hit skips the auth round-trip.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 The kernel pattern (a shared, swappable boundary) is the same instinct as the DAL trait — one seam, many callers.` },
      ],
    },
    {
      id: "d68", date: "2027-01-24", week: "w25", title: "Ch13 — logging & middleware",
      theme: "The last chapter: see what the system is doing, via structured logging.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 28,
          label: `<b>Ch13 Observability through Logging</b>: <i>what are RESTful services</i>, <i>building frontend code on command</i>, <i>what is logging</i>, <i>logging via the terminal</i>, <i>defining a logger</i>, <i>creating a logging middleware</i>, and <i>integrating it into our servers</i>.`,
          sub: [
            { id: "s1", est: 15, label: `Logging basics; define a logger + terminal logging.` },
            { id: "s2", est: 13, label: `Logging middleware; integrate into both servers.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Add a logging middleware that records each request (method, path, status, latency) and wire it into the to-do and auth servers.`,
          sub: [
            { id: "s1", est: 20, label: `Request-logging middleware (method/path/status/latency).` },
            { id: "s2", est: 13, label: `Integrated across both servers; watch the logs.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Ecosystem standard worth knowing: <a href="https://docs.rs/tracing" target="_blank" rel="noopener">tracing</a> (structured, async-aware spans) — compare it to the book's logger.` },
      ],
    },
    {
      id: "d69", date: "2027-01-29", week: "w26", title: "Ch13 — the logging actor & DB",
      theme: "Logging to a database via an actor — concurrency you now understand.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch13</b>: <i>logging via a database</i>, <i>what is an actor</i>, <i>building our logging actor</i>, <i>updating logging functions</i>, and <i>configuring our logging database</i>.`,
          sub: [
            { id: "s1", est: 14, label: `The actor model; the logging actor.` },
            { id: "s2", est: 13, label: `Logging to a DB + configuring it.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Build the logging actor (a task owning the log channel) and persist logs to a database; confirm requests across both servers land as rows. 🎉 The book's content is complete.`,
          sub: [
            { id: "s1", est: 20, label: `Logging actor over a channel; DB-backed logs.` },
            { id: "s2", est: 15, label: `Requests → log rows from both servers.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 An actor is just a task that owns some state and takes messages — your Ch4 async + Ch16 channels, combined. The whole book converges here.` },
      ],
    },
    {
      id: "d70", date: "2027-01-31", week: "w26", title: "Checkpoint — the whole nanoservices stack",
      theme: "Everything running together: to-do, auth, cache, logs, browser.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 33,
          label: `<b>Consolidation:</b> boot the full stack — Postgres, Redis, the to-do &amp; auth servers, the React/WASM frontend, logging — and walk a user journey (register → login → CRUD → logout) watching the logs and cache behave.`,
          sub: [
            { id: "s1", est: 18, label: `Full stack up; complete a real user journey.` },
            { id: "s2", est: 15, label: `Confirm cache hits + log rows along the way.` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 15,
          label: `Draw the final architecture: every nanoservice, the DB/cache, and the request/response + logging flows.`,
          sub: [
            { id: "s1", est: 15, label: `Final architecture diagram (services + data stores + flows).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is the system the book set out to build. The last few days harden it and plan what's beyond the EPUB.` },
      ],
      note: "Light checkpoint day.",
    },
    {
      id: "d71", date: "2027-02-05", week: "w27", title: "Capstone I — run it like it's real",
      theme: "Treat the stack as a product: one-command boot, a clean demo path.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "project", est: 40,
          label: `Make the whole system start with one command (a <code>docker-compose</code> or a top-level script bringing up Postgres, Redis, both servers, and the frontend) and document the demo path.`,
          sub: [
            { id: "s1", est: 25, label: `One-command bring-up of the entire stack.` },
            { id: "s2", est: 15, label: `Write the demo script (register → CRUD → logout).` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 15,
          label: `List the rough edges you'd fix for "real" (secrets handling, error surfaces, missing tests) — the honest to-do for a portfolio version.`,
          sub: [
            { id: "s1", est: 15, label: `Rough-edges / hardening backlog.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 "Runs with one command and I can explain it in one sentence" is the bar for a project worth showing.` },
      ],
    },
    {
      id: "d72", date: "2027-02-07", week: "w27", title: "Capstone II — harden & document",
      theme: "Tests where they matter and a README that lets someone else run it.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "project", est: 40,
          label: `Add the highest-value tests (an auth round-trip, a user-scoped CRUD, a cache-eviction check) and write a <b>README</b>: architecture in a paragraph, run command, and the nanoservice map.`,
          sub: [
            { id: "s1", est: 22, label: `Three high-value integration tests.` },
            { id: "s2", est: 18, label: `README: architecture, run command, service map.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Pick tests that would catch a real regression (auth, ownership, eviction) over exhaustive coverage — depth over breadth for a finale.` },
      ],
    },
    {
      id: "d73", date: "2027-02-12", week: "w28", title: "Retro & what's beyond this EPUB",
      theme: "Close the arc; map the ground the print edition covers next.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 27,
          label: `Write the one-page map of what you built and the ideas you'll reuse (nanoservice layering, the DAL/kernel seams, async Hyper, WASM-on-both-sides, JWT+Redis sessions, actor logging). Note the 2–3 you'd revisit first.`,
          sub: [
            { id: "s1", est: 15, label: `What you built + the transferable patterns.` },
            { id: "s2", est: 12, label: `The 2–3 ideas to revisit first.` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 23,
          label: `Scope what's <b>beyond</b> this EPUB (the print 3rd edition continues into <i>testing</i>, <i>deployment on AWS</i>, and <i>Docker/Kubernetes in production</i>) and pick your next concrete step.`,
          sub: [
            { id: "s1", est: 13, label: `List the next-chapter topics (testing, AWS, K8s).` },
            { id: "s2", est: 10, label: `Choose one next step and write its first 3 tasks.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Natural continuations: containerise for prod, add CI, and deploy the stack — the same instincts as the FastAPI deploy track, now for Rust.` },
      ],
    },
    {
      id: "d74", date: "2027-02-14", week: "w28", title: "Buffer / overflow",
      theme: "Deliberate slack — the shock absorber for the 5-month run.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 20, optional: true,
          label: `<b>Pure buffer:</b> if any chapter's build slipped — a listing that didn't compile, a feature you stubbed, notes you meant to write — this is the day to close it, guilt-free.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 A plan with zero slack breaks on the first bad week. Nothing is required today by design. 🎉 Rust Web Programming complete.` },
      ],
      note: "Pure buffer day — required load is near zero on purpose.",
    },
    {
      id: "d75", date: "2027-02-19", week: "w29", title: "2nd-ed Ch9 — unit & JWT tests",
      theme: "Part B begins: the 2nd edition (2023) covers everything the 3rd-ed EPUB stopped short of. First — testing what you built.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 28,
          label: `<b>2nd-ed Ch9 Testing</b>: <i>building our unit tests</i> and <i>building JWT unit tests</i> — test config, JWT test requirements, basic JWT function tests. (Book is Actix/Diesel; the testing ideas map straight onto your Hyper/SQLx app.)`,
          sub: [
            { id: "s1", est: 15, label: `Unit-test structure + a test config.` },
            { id: "s2", est: 13, label: `JWT tests: requirements + basic function tests.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Write real unit tests for your app's core logic and a JWT encode/decode test; run them green.`,
          sub: [
            { id: "s1", est: 20, label: `Unit tests over the to-do core + DAL.` },
            { id: "s2", est: 15, label: `JWT round-trip + expiry test.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `📖 PART B (2026-07-20 plan): these chapters come from the <b>2nd edition</b> EPUB — the 3rd-ed EPUB ends at Ch13 (observability). Where its Actix/Diesel stack differs from your Hyper/SQLx app, it's flagged; Part 6 (Ch14–18) are standalone.` },
        { id: "s2", type: "hint", label: `💡 Test the <b>core</b> nanoservice in isolation (no HTTP) first — pure functions are the easiest, highest-value tests.` },
      ],
    },
    {
      id: "d76", date: "2027-02-21", week: "w29", title: "2nd-ed Ch9 — web-request tests & Postman",
      theme: "Test the HTTP surface, then drive it from Postman.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch9</b>: <i>building tests for web requests</i> and <i>writing tests in Postman</i> — ordered requests and creating a test for an HTTP request.`,
          sub: [
            { id: "s1", est: 13, label: `Integration tests for web requests.` },
            { id: "s2", est: 12, label: `Postman: ordered requests + an HTTP-request test.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Add integration tests that hit your running server (create→list→auth paths), and build a Postman collection that walks a full user journey.`,
          sub: [
            { id: "s1", est: 20, label: `Server integration tests (happy + 401).` },
            { id: "s2", est: 15, label: `Postman collection: register → login → CRUD.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Postman collections double as living API docs and as the seed for the Newman CI step next.` },
      ],
    },
    {
      id: "d77", date: "2027-02-26", week: "w30", title: "2nd-ed Ch9 — Newman & a test pipeline",
      theme: "Automate the whole test run — the first taste of CI.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch9</b>: <i>automating Postman tests with Newman</i> and <i>building an entire automated testing pipeline</i>.`,
          sub: [
            { id: "s1", est: 12, label: `Newman: run the Postman collection headless.` },
            { id: "s2", est: 13, label: `Wiring cargo test + Newman into one pipeline.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 32,
          label: `Script a single command that spins up the app, runs <code>cargo test</code> + Newman against it, and reports pass/fail — your local CI in miniature.`,
          sub: [
            { id: "s1", est: 20, label: `One-command test pipeline (unit + integration + Newman).` },
            { id: "s2", est: 12, label: `Make it fail loudly on a broken endpoint.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 This pipeline is what Ch13's GitHub Actions will run on every push — build it locally first.` },
      ],
    },
    {
      id: "d78", date: "2027-02-28", week: "w30", title: "2nd-ed Ch10 — Docker images",
      theme: "Package the app into containers — the unit of deployment.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>2nd-ed Ch10 Deploying on AWS</b>: <i>setting up the build environment</i> (AWS SSH key + EC2, AWS client) and <i>managing our software with Docker</i> — writing & building Docker image files.`,
          sub: [
            { id: "s1", est: 13, label: `Build env: AWS account, SSH key, EC2, AWS CLI.` },
            { id: "s2", est: 13, label: `Writing + building the server Docker image.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Write a Dockerfile for each of your services (to-do server, auth server) and build the images locally; confirm the containers run and talk to Postgres/Redis.`,
          sub: [
            { id: "s1", est: 22, label: `Dockerfiles for the server(s); build locally.` },
            { id: "s2", est: 13, label: `Compose them with Postgres/Redis; smoke-test.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Your app is multi-service (nanoservices) — you'll containerise each server, unlike the book's single Actix binary. Same Docker skills, one more image or two.` },
      ],
    },
    {
      id: "d79", date: "2027-03-05", week: "w31", title: "2nd-ed Ch10 — Terraform & build scripts",
      theme: "Infrastructure-as-code and repeatable build orchestration.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch10</b>: <i>setting up our Terraform build</i>, the <i>Python build script</i>, the <i>Bash deployment script</i>, an <i>EC2 build server via Terraform</i>, and <i>orchestrating builds with Bash</i>.`,
          sub: [
            { id: "s1", est: 14, label: `Terraform for an EC2 build server.` },
            { id: "s2", est: 13, label: `Python/Bash build + deploy orchestration.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Write a Terraform config that stands up an EC2 instance and a script that builds your images on it; apply it and tear it down cleanly.`,
          sub: [
            { id: "s1", est: 22, label: `Terraform EC2 + a build/deploy script.` },
            { id: "s2", est: 13, label: `<code>apply</code> then <code>destroy</code> — confirm reproducible.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Infra-as-code means the server is a file you can recreate, not a pet you configured by hand. Same discipline as DB migrations.` },
      ],
    },
    {
      id: "d80", date: "2027-03-07", week: "w31", title: "2nd-ed Ch10 — deploy to AWS",
      theme: "Push the images and run the app on real infrastructure.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>Ch10</b>: a <i>Docker image for the React frontend</i>, <i>deploying images onto Docker Hub</i>, and <i>deploying the application on AWS</i> (running locally, then on AWS) via the build script.`,
          sub: [
            { id: "s1", est: 13, label: `Frontend image + push all images to a registry.` },
            { id: "s2", est: 13, label: `Deploy + run the stack on AWS.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 37,
          label: `Push your images to a registry and bring the app up on the EC2 instance; hit the public IP and complete a real request against the deployed app.`,
          sub: [
            { id: "s1", est: 22, label: `Registry push + AWS bring-up of the full stack.` },
            { id: "s2", est: 15, label: `Live request against the deployed app.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Your app now runs somewhere other than your laptop. Next: put a real domain + HTTPS in front of it.` },
      ],
    },
    {
      id: "d81", date: "2027-03-12", week: "w32", title: "2nd-ed Ch11 — HTTPS, locally",
      theme: "Understand TLS/HTTP-2, then terminate HTTPS in front of the app.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>2nd-ed Ch11 HTTPS with NGINX</b>: <i>what is HTTPS?</i> (binary protocol, compressed headers, persistent connections, multiplex streaming) and <i>implementing HTTPS locally with docker-compose</i>.`,
          sub: [
            { id: "s1", est: 14, label: `HTTPS/HTTP-2 mechanics.` },
            { id: "s2", est: 12, label: `NGINX + docker-compose terminating TLS locally.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Put an NGINX reverse proxy in front of your app via docker-compose and serve it over HTTPS locally with a self-signed cert.`,
          sub: [
            { id: "s1", est: 20, label: `NGINX reverse-proxy in compose.` },
            { id: "s2", est: 13, label: `Local HTTPS with a self-signed cert.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 NGINX terminates TLS and proxies to your Rust server — the same edge pattern regardless of Actix vs Hyper.` },
      ],
    },
    {
      id: "d82", date: "2027-03-14", week: "w32", title: "2nd-ed Ch11 — HTTPS on AWS",
      theme: "A real domain, real certificates, and a load balancer.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 27,
          label: `<b>Ch11</b>: <i>attaching a URL</i> (elastic IP, domain registration), <i>enforcing HTTPS</i> (certificates), and scaling out — <i>multiple EC2 instances</i>, a <i>load balancer</i>, and <i>security groups</i>.`,
          sub: [
            { id: "s1", est: 14, label: `Elastic IP + domain + TLS certificates.` },
            { id: "s2", est: 13, label: `Load balancer + security groups across instances.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 37,
          label: `Attach a domain to your deployment, get a real certificate, and force HTTPS; put a load balancer in front and lock traffic down with security groups.`,
          sub: [
            { id: "s1", est: 22, label: `Domain + real cert + forced HTTPS.` },
            { id: "s2", est: 15, label: `Load balancer + locked-down security groups.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Security groups are your firewall — open only 443 (and 22 to yourself). Everything else stays shut.` },
      ],
    },
    {
      id: "d83", date: "2027-03-19", week: "w33", title: "Checkpoint — tested, deployed, secured",
      theme: "The app is real, public, and safe. Catch up before professionalising the repo.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 27,
          label: `<b>Consolidation:</b> confirm the full lifecycle — tests green, images built, deployed on AWS, reachable over HTTPS on a real domain behind a load balancer. Note anything fragile.`,
          sub: [
            { id: "s1", est: 15, label: `End-to-end: test → deploy → HTTPS all working.` },
            { id: "s2", est: 12, label: `Write the deploy runbook (commands + gotchas).` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 20, optional: true,
          label: `<b>If caught up:</b> tighten one rough edge from deployment (secrets, health checks, restart policy). Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 A tested app running on secured AWS infra is a real milestone. Ch13 makes the repo itself production-grade.` },
      ],
      note: "Light checkpoint day.",
    },
    {
      id: "d84", date: "2027-03-21", week: "w33", title: "2nd-ed Ch13 — a clean repository",
      theme: "Structure the repo and its config the way a professional project is laid out.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>2nd-ed Ch13 Best Practices for a Clean Web App Repository</b>: <i>the general layout of a clean repository</i>, <i>configuration from environment variables</i>, a <i>local development database</i>, and <i>managing variables in Postman tests</i>.`,
          sub: [
            { id: "s1", est: 14, label: `Clean repo layout + env-var configuration.` },
            { id: "s2", est: 12, label: `Local dev DB + parameterised Postman vars.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Refactor your repo to the clean layout: all config via env vars (no hardcoded secrets), a one-command local dev database, and Postman variables per environment.`,
          sub: [
            { id: "s1", est: 20, label: `Env-var config + clean layout across services.` },
            { id: "s2", est: 13, label: `One-command dev DB + env-scoped Postman vars.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 "Config in the environment, not the code" is the 12-factor rule — it's what makes the same image run in dev, CI and prod unchanged.` },
      ],
    },
    {
      id: "d85", date: "2027-03-26", week: "w34", title: "2nd-ed Ch13 — distroless images & GitHub Actions CI",
      theme: "Tiny secure images and a pipeline that runs on every push.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>Ch13</b>: <i>building distroless tiny-server Docker images</i>, <i>a clean test pipeline</i>, and <i>continuous integration with GitHub Actions</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Distroless multi-stage image builds.` },
            { id: "s2", est: 13, label: `GitHub Actions CI running the test pipeline.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 37,
          label: `Convert your images to distroless multi-stage builds (tiny, no shell) and add a GitHub Actions workflow that builds, tests (unit + Newman), and reports on every push.`,
          sub: [
            { id: "s1", est: 22, label: `Distroless multi-stage Dockerfiles.` },
            { id: "s2", est: 15, label: `GitHub Actions: build + test on push.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Distroless = no shell, no package manager in the final image — smaller attack surface and faster pulls. Your Ch9/local pipeline slots straight into the Actions runner.` },
      ],
    },
    {
      id: "d86", date: "2027-03-28", week: "w34", title: "2nd-ed Ch12 — Rocket: setup & modules",
      theme: "Framework flexibility: stand the app up on a different web framework.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>2nd-ed Ch12 Recreating Our Application in Rocket</b>: <i>what is Rocket?</i>, <i>setting up the server</i>, <i>plugging in existing modules</i>, and <i>implementing Rocket traits</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Rocket vs your current stack; server setup.` },
            { id: "s2", est: 13, label: `Reusing your core/DAL modules under Rocket.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Spin up a Rocket server and wire your existing core + DAL into it — proving your logic is framework-independent (the whole point of the nanoservice split).`,
          sub: [
            { id: "s1", est: 20, label: `Rocket server booting.` },
            { id: "s2", est: 15, label: `Core/DAL plugged in behind Rocket routes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Because your logic lives in the core (not the framework), swapping Hyper→Rocket is a networking-layer rewrite, not an app rewrite. This chapter proves that seam works.` },
      ],
    },
    {
      id: "d87", date: "2027-04-02", week: "w35", title: "2nd-ed Ch12 — Rocket: views, JSON & tests",
      theme: "Port the routes and confirm the same tests still pass.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch12</b>: <i>plugging in existing views</i>, <i>accepting/returning JSON</i>, <i>returning raw HTML</i>, <i>returning status</i> (single & multiple), <i>registering views</i>, and <i>plugging in existing tests</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Rocket views + JSON/HTML/status responses.` },
            { id: "s2", est: 12, label: `Running your existing test suite against Rocket.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 33,
          label: `Port your routes to Rocket (JSON in/out, proper statuses) and run your Ch9 test suite against the Rocket version — same behaviour, different framework.`,
          sub: [
            { id: "s1", est: 20, label: `Routes ported; JSON + statuses correct.` },
            { id: "s2", est: 13, label: `Existing tests green against Rocket.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 If the same tests pass against both Hyper and Rocket, your API contract is genuinely decoupled from its framework. That's a strong design signal.` },
      ],
    },
    {
      id: "d88", date: "2027-04-04", week: "w35", title: "2nd-ed Ch14 — the Tokio framework",
      theme: "Part 6 (standalone async/systems track): go under the hood of async Rust.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>2nd-ed Ch14 Exploring the Tokio Framework</b>: <i>Tokio for async programming</i> and <i>working with workers</i> — the runtime beneath everything you've built.`,
          sub: [
            { id: "s1", est: 14, label: `Tokio runtime, tasks, and workers.` },
            { id: "s2", est: 12, label: `How the executor schedules async work.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 33,
          label: `Build the chapter's worker examples: spawn tasks across the runtime and observe how work is distributed.`,
          sub: [
            { id: "s1", est: 20, label: `Spawn + coordinate Tokio workers.` },
            { id: "s2", est: 13, label: `Observe scheduling across the runtime.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `📖 Part 6 (Ch14–18) are self-contained mini-projects on low-level async & networking — not tied to the web-app stack. Pure Rust systems programming.` },
      ],
    },
    {
      id: "d89", date: "2027-04-09", week: "w36", title: "2nd-ed Ch14 — the actor model",
      theme: "Actors and channels — the concurrency pattern the 3rd-ed logging used.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>Ch14</b>: <i>the actor model for async programming</i>, <i>working with channels</i>, and <i>working with actors in Tokio</i>.`,
          sub: [
            { id: "s1", est: 14, label: `Actor model + channels in Tokio.` },
            { id: "s2", est: 12, label: `Building actors that own state.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 33,
          label: `Build an actor (a task owning state, driven by a channel of messages) and drive it from several producers — the pattern behind async state management.`,
          sub: [
            { id: "s1", est: 20, label: `A channel-driven Tokio actor.` },
            { id: "s2", est: 13, label: `Multiple producers → one actor; no shared locks.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 You met actors in the 3rd-ed logging chapter — here's the full model. An actor replaces <code>Arc&lt;Mutex&gt;</code> with message passing.` },
      ],
    },
    {
      id: "d90", date: "2027-04-11", week: "w36", title: "2nd-ed Ch15 — accepting TCP with Tokio",
      theme: "Below HTTP: raw TCP sockets and byte processing.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>2nd-ed Ch15 Accepting TCP Traffic with Tokio</b>: <i>exploring TCP</i>, <i>accepting TCP</i>, <i>processing bytes</i>, and <i>passing TCP to an actor</i>.`,
          sub: [
            { id: "s1", est: 13, label: `TCP basics; accepting connections in Tokio.` },
            { id: "s2", est: 12, label: `Reading/processing raw bytes off a socket.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 33,
          label: `Build a Tokio TCP server that accepts connections, reads bytes, and hands each connection to an actor.`,
          sub: [
            { id: "s1", est: 20, label: `Tokio TCP listener + byte processing.` },
            { id: "s2", est: 13, label: `Route each connection to an actor.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is the layer under Hyper — seeing HTTP as bytes on a TCP socket demystifies every framework you've used.` },
      ],
    },
    {
      id: "d91", date: "2027-04-16", week: "w37", title: "2nd-ed Ch15 — actors over TCP",
      theme: "Coordinate state across a TCP server using chained actors.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch15</b>: <i>keeping track of orders with actors</i>, <i>chaining communication between actors</i>, <i>responding with TCP</i>, and <i>sending different commands via the client</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Stateful actors + chaining messages.` },
            { id: "s2", est: 12, label: `Responding over TCP; a command client.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 33,
          label: `Extend your TCP server so a client sends commands, actors maintain shared order state, and the server responds — a tiny stateful protocol.`,
          sub: [
            { id: "s1", est: 20, label: `Command client + actor-held state.` },
            { id: "s2", est: 13, label: `Server responses over TCP.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 You're building a stateful networked service from sockets up — no framework doing the plumbing.` },
      ],
    },
    {
      id: "d92", date: "2027-04-18", week: "w37", title: "2nd-ed Ch16 — protocols on TCP",
      theme: "Structured messages over a byte stream — the framing problem.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>2nd-ed Ch16 Building Protocols on Top of TCP</b>: <i>setting up the TCP client and server</i>, <i>processing bytes using structs</i>, and <i>creating a message-sender client</i> / <i>processing messages in the server</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Struct-based message (de)serialisation over TCP.` },
            { id: "s2", est: 12, label: `Message-sender client + server processing.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 33,
          label: `Define a message struct, serialise it over TCP, and parse it on the server — a typed protocol instead of ad-hoc bytes.`,
          sub: [
            { id: "s1", est: 20, label: `Typed message over TCP (encode/decode).` },
            { id: "s2", est: 13, label: `Client sends, server parses struct messages.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 "Where does one message end?" is the core problem of any byte-stream protocol — framing (next) is the answer.` },
      ],
    },
    {
      id: "d93", date: "2027-04-23", week: "w38", title: "2nd-ed Ch16 — framing & an HTTP frame",
      theme: "Length-framing messages, then rebuild HTTP from scratch.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch16</b>: <i>utilizing framing</i> (rewriting client & server to support it) and <i>building an HTTP frame on top of TCP</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Framing: delimit messages on the stream.` },
            { id: "s2", est: 12, label: `Constructing an HTTP frame over raw TCP.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Add length-based framing to your protocol, then hand-build a minimal HTTP request/response frame over your TCP layer — HTTP, from first principles.`,
          sub: [
            { id: "s1", est: 20, label: `Framed client + server.` },
            { id: "s2", est: 15, label: `A hand-rolled HTTP frame over TCP.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Once you've built HTTP on top of TCP by hand, Hyper stops being magic — it's this, hardened and optimised.` },
      ],
    },
    {
      id: "d94", date: "2027-04-25", week: "w38", title: "2nd-ed Ch17 — actors with Hyper",
      theme: "Bring actors and Hyper together into one async service.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 26,
          label: `<b>2nd-ed Ch17 Actors and Async with Hyper</b>: <i>breaking down the project</i>, <i>defining channel messages</i>, and building the <i>runner</i> and <i>state</i> actors.`,
          sub: [
            { id: "s1", est: 14, label: `Project shape; channel message types.` },
            { id: "s2", est: 12, label: `Runner actor + state actor.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 33,
          label: `Build the runner + state actors and the channels between them — the async backbone the Hyper server will sit on.`,
          sub: [
            { id: "s1", est: 20, label: `Runner + state actors over channels.` },
            { id: "s2", est: 13, label: `Drive them with test messages.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This ties Part 6 together: the actor model (Ch14) + TCP/framing (Ch15–16) + Hyper (3rd-ed Ch4) in one design.` },
      ],
    },
    {
      id: "d95", date: "2027-04-30", week: "w39", title: "2nd-ed Ch17 — the Hyper server",
      theme: "Serve HTTP over the actor system you just built.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch17</b>: <i>handling HTTP requests using Hyper</i>, <i>building an HTTP server using Hyper</i>, and <i>running the Hyper HTTP server</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Hyper request handling wired to the actors.` },
            { id: "s2", est: 12, label: `Assembling + running the server.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 33,
          label: `Put Hyper in front of your actor system so HTTP requests drive the runner/state actors; run it and hit it with curl.`,
          sub: [
            { id: "s1", est: 20, label: `Hyper server → actors → response.` },
            { id: "s2", est: 13, label: `Run + curl the actor-backed server.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Compare this hand-built actor+Hyper service to the 3rd-ed's framework-assisted one — same shape, now fully understood end to end.` },
      ],
    },
    {
      id: "d96", date: "2027-05-02", week: "w39", title: "2nd-ed Ch18 — a Redis task queue",
      theme: "The finale project: offload work to background workers via Redis.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>2nd-ed Ch18 Queuing Tasks with Redis</b>: <i>breaking down the project</i>, <i>building the HTTP server</i>, <i>building the polling worker</i>, and <i>getting it running with Redis</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Queue architecture: server + polling worker + Redis.` },
            { id: "s2", est: 12, label: `Standing up the server and worker.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Build an HTTP server that enqueues tasks to Redis and a worker that polls and runs them — the producer/consumer pattern for slow work.`,
          sub: [
            { id: "s1", est: 22, label: `Server enqueues → Redis → worker polls & runs.` },
            { id: "s2", est: 13, label: `Confirm a slow task runs off the request path.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 A task queue is how real apps handle slow work (email, image processing) without blocking requests — the pattern behind Celery/Sidekiq, in Rust.` },
      ],
    },
    {
      id: "d97", date: "2027-05-07", week: "w40", title: "2nd-ed Ch18 — tasks, messages & Docker",
      theme: "Finish the queue: typed tasks/messages, routing, and containerised.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 25,
          label: `<b>Ch18</b>: <i>defining tasks for workers</i>, <i>defining messages for the Redis queue</i>, <i>integrating routing in the HTTP server</i>, and <i>running it all in Docker</i>.`,
          sub: [
            { id: "s1", est: 13, label: `Typed tasks + queue messages.` },
            { id: "s2", est: 12, label: `Routing + running the whole thing in Docker.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Add typed tasks/messages and routing, then bring the whole queue system up in Docker — a self-contained, containerised async service. 🎉 Both books complete.`,
          sub: [
            { id: "s1", est: 20, label: `Typed tasks/messages + routes.` },
            { id: "s2", est: 15, label: `Full system up in Docker.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Everything in Part 6 has been Docker-first — the same deployment discipline you learned in Ch10/13 carries the systems track too.` },
      ],
    },
    {
      id: "d98", date: "2027-05-09", week: "w40", title: "Two-book capstone & retro",
      theme: "Close the complete Rust-web reference — both editions, one map.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 27,
          label: `Write the master map: the full journey across <b>both books</b> — build (3rd-ed: nanoservices, Hyper, SQLx, WASM, auth, Redis cache, logging) → operate (2nd-ed: testing, AWS deploy, HTTPS, CI) → flex (Rocket) → understand (Part 6: Tokio, TCP, protocols, Hyper actors, task queue). Note the 3–4 ideas you'd revisit first.`,
          sub: [
            { id: "s1", est: 15, label: `The complete two-book map: build → operate → flex → understand.` },
            { id: "s2", est: 12, label: `The 3–4 ideas most worth revisiting.` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 23,
          label: `Pick the next real thing to build with all of it, and write its first few tasks while the momentum's hot. 🎉 Rust web programming — complete.`,
          sub: [
            { id: "s1", est: 13, label: `Choose the next real project.` },
            { id: "s2", est: 10, label: `Write its first 3 tasks.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 You now hold a complete, current Rust web reference stitched from two editions — from a single heap allocation to a load-balanced, HTTPS, CI-deployed, queue-backed nanoservices stack. Build something you'll keep.` },
      ],
      note: "🎓 Final day of the Rust + FastAPI + Rust Web Programming roadmap.",
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
    /* ---- RWP extension milestones (Ch2 → capstone) ---- */
    { id: "w11.m1", week: "w11", title: "RWP — Rust patterns & app design (Ch2–3)",
      rule: { type: "tasks", require: ["d37.t2","d40.t2"] } },
    { id: "w14.m1", week: "w14", title: "RWP — async backend serving HTTP (Ch4–5)",
      rule: { type: "tasks", require: ["d43.t2","d45.t2"] } },
    { id: "w15.m1", week: "w15", title: "🏁 RWP backend API — full CRUD (Ch6)",
      rule: { type: "tasks", require: ["d47.t2"] } },
    { id: "w18.m1", week: "w18", title: "RWP — React + WASM frontend (Ch7–8)",
      rule: { type: "tasks", require: ["d51.t2","d54.t2"] } },
    { id: "w20.m1", week: "w20", title: "RWP — persistence on PostgreSQL (Ch9)",
      rule: { type: "tasks", require: ["d58.t2"] } },
    { id: "w23.m1", week: "w23", title: "RWP — auth & multi-server (Ch10–11)",
      rule: { type: "tasks", require: ["d62.t2","d64.t2"] } },
    { id: "w25.m1", week: "w25", title: "RWP — Redis-cached sessions (Ch12)",
      rule: { type: "tasks", require: ["d67.t2"] } },
    { id: "w28.m1", week: "w28", title: "🎓 RWP complete — the nanoservices stack",
      rule: { type: "tasks", require: ["d69.t2","d72.t1"] } },
    /* ---- RWP Part B milestones (Ch9 → capstone) ---- */
    { id: "w30.m1", week: "w30", title: "RWP — application tested (2nd-ed Ch9)",
      rule: { type: "tasks", require: ["d77.t2"] } },
    { id: "w32.m1", week: "w32", title: "🏁 RWP — deployed on AWS over HTTPS (Ch10–11)",
      rule: { type: "tasks", require: ["d80.t2","d82.t2"] } },
    { id: "w35.m1", week: "w35", title: "RWP — production repo, CI & Rocket (Ch12–13)",
      rule: { type: "tasks", require: ["d85.t2","d87.t2"] } },
    { id: "w40.m1", week: "w40", title: "🎓 RWP — complete two-book reference (Part 6)",
      rule: { type: "tasks", require: ["d96.t2","d98.t1"] } },
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
    { title: "Rust Web Programming — the stack it builds on", items: [
      `Async HTTP: <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio</a> · <a href="https://hyper.rs/guides/1/" target="_blank" rel="noopener">Hyper</a> · JSON: <a href="https://serde.rs/" target="_blank" rel="noopener">Serde</a>.`,
      `Frontend-in-Rust: <a href="https://rustwasm.github.io/docs/book/" target="_blank" rel="noopener">rustwasm Book</a> · <a href="https://rustwasm.github.io/wasm-pack/" target="_blank" rel="noopener">wasm-pack</a>.`,
      `Data & auth: <a href="https://docs.rs/sqlx" target="_blank" rel="noopener">SQLx</a> · <a href="https://docs.rs/redis" target="_blank" rel="noopener">redis</a> · <a href="https://docs.rs/jsonwebtoken" target="_blank" rel="noopener">jsonwebtoken</a> · <a href="https://docs.rs/tracing" target="_blank" rel="noopener">tracing</a>.`,
    ] },
    { title: "Part B — operate & go low-level (from the 2nd ed.)", items: [
      `Test & ship: unit/integration tests · <a href="https://www.postman.com/" target="_blank" rel="noopener">Postman</a>/Newman · <a href="https://docs.docker.com/" target="_blank" rel="noopener">Docker</a> · <a href="https://www.terraform.io/" target="_blank" rel="noopener">Terraform</a> · AWS EC2.`,
      `Secure & automate: <a href="https://nginx.org/en/docs/" target="_blank" rel="noopener">NGINX</a> + HTTPS/TLS · distroless images · <a href="https://docs.github.com/actions" target="_blank" rel="noopener">GitHub Actions</a> CI · <a href="https://rocket.rs/" target="_blank" rel="noopener">Rocket</a> (alt framework).`,
      `Low-level (Part 6): raw <a href="https://docs.rs/tokio" target="_blank" rel="noopener">Tokio</a> · TCP sockets · protocol framing · actor model · a Redis task queue.`,
    ] },
  ],
});
