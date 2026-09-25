// rust-fastapi.js — Roadmap 1 (priority HIGH, 3 active days/week, 4 in the closing
// weeks).
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
// finish to 2026-10-20. Existing ids/dates unchanged; d24 re-scoped to a checkpoint.
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
// logging), the EPUB's 13 chapters. Added as weeks w8–w26 / days d33–d74 at a
// gentle 2 sessions/week (3 in the lighter weeks — see the 2026-09-13 re-plan note
// below), starting 2026-10-26 and finishing 2027-02-26 (~4 months). The original
// 32 days (d01–d32) are UNCHANGED — this is a pure append. The EPUB has no per-section
// URLs, so RWP tasks cite chapter + section NAME; official docs appear only as
// optional "go deeper" supplements.
//
// RWP PART B (2026-07-21): the 3rd-ed EPUB stops at Ch13 (observability), so the
// "left-off" chapters are stitched in from the COMPLETE 2nd edition (2023,
// Actix/Diesel — B18722). Only its UNIQUE chapters are used (Ch1–8 overlap the
// 3rd-ed spine and are skipped): Ch9 Testing, Ch10 Deploy/AWS, Ch11 HTTPS+NGINX,
// Ch13 Clean-repo/CI, Ch12 Rocket, then Part 6 low-level async/protocols
// (Ch14 Tokio, Ch15 TCP, Ch16 protocol framing, Ch17 Hyper actors, Ch18 Redis
// queue). Appended as weeks w26–w34 / days d75–d98 at 3/week,
// 2027-02-28 → 2027-04-24. Ordered by lifecycle: build (3rd-ed) → test → deploy →
// secure → automate → flex (Rocket) → understand (Part 6). By the time Part B starts,
// interp-go (ends 2027-02-03) and raylib (2027-01-08) are done and only the bedrock
// side-track runs alongside it — that lighter calendar is exactly why the tail takes
// a 3rd session each week. The 2nd-ed stack
// (Actix/Diesel) differs from the app's (Hyper/SQLx) — tasks apply the CONCEPTS to
// the learner's app and flag the differences; Part 6 chapters are standalone.
// (The 1st-ed PDF is a strict subset of the 2nd ed — unused.)

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
// For this file: 98 → 147 cards, 34 → 48 weeks, 2026-09-23 → 2027-08-24. Required work
// 106.7h → 185.3h. 3 cards a week, 4 in the closing weeks; 91 tasks carried, 49
// continuation cards, 66 split parts.

// REVIEW PASS (2026-09-25, after the make-it-doable re-plan) — content-only corrections:
//  • Two 3-card topics ("Patterns & matching" d15–d17, "Async Rust II" d48–d50) had cards 2
//    and 3 BOTH titled "(cont.)", so the timeline showed the same heading twice with nothing
//    to tell them apart. They now number the real run — (1/3) / (2/3, cont.) / (3/3, cont.).
//  • Five interludes sat one card past the topic they comment on (il10, il12, il14, il16,
//    il18 in interludes.js) — re-anchored to the card whose work they follow up.
//  • Stale prose: d05 pointed at "Week 13" for async SQLAlchemy (it is d41, week 14); d09's
//    note read "End of week 1" (it closes week 3); d44 said the books finish "two weeks"
//    before the core closes at d56 (it is four).

import { registerRoadmap } from "../assets/js/registry.js";

const R = "rust", F = "fastapi", W = "rwp";

registerRoadmap({
  slug: "rust-fastapi",
  title: "Rust + FastAPI",
  icon: "🦀",
  subtitle: "The Rust Programming Language (Ch15→21) + Mastering FastAPI (Ch4→), then a complete Rust Web Programming reference (3rd + 2nd eds) — build, deploy & go low-level.",
  accent: "#f0803c",
  schemaVersion: 1,
  // The literal range is 2–5 (5 in w1–w4, 4 in w5–w7, then 2–3 for the long RWP arc),
  // but the band's MIDPOINT drives the projection, and that long arc dominates: the
  // real rate is ~2.9 days/week, so [2,4] (midpoint 3) keeps the projection honest.
  cadence: { activeDaysPerWeek: [3, 4] },

  objectives: [
    { id: R, title: "Rust — The Book", tier: "primary", weight: 1 },
    { id: F, title: "FastAPI", tier: "primary", weight: 1 },
    { id: W, title: "Rust Web Programming", tier: "primary", weight: 1 },
  ],

  weeks: [
    { id: "w1", title: "Week 1 — Resume: Box & Deref; Rc, RefCell & Weak", start: "2026-09-23" },
    { id: "w2", title: "Week 2 — FastAPI databases", start: "2026-09-30" },
    { id: "w3", title: "Week 3 — Fearless concurrency; FastAPI project structure", start: "2026-10-07" },
    { id: "w4", title: "Week 4 — OOP in Rust", start: "2026-10-14" },
    { id: "w5", title: "Week 5 — FastAPI security (JWT); Patterns & matching", start: "2026-10-21" },
    { id: "w6", title: "Week 6 — FastAPI dependencies", start: "2026-10-28" },
    { id: "w7", title: "Week 7 — Advanced Rust I", start: "2026-11-04" },
    { id: "w8", title: "Week 8 — Advanced Rust II; FastAPI testing", start: "2026-11-11" },
    { id: "w9", title: "Week 9 — Web server I — single-threaded", start: "2026-11-18" },
    { id: "w10", title: "Week 10 — Web server II — the thread pool; FastAPI microservices (light)", start: "2026-11-25" },
    { id: "w11", title: "Week 11 — Web server III — graceful shutdown; FastAPI deploy", start: "2026-12-02" },
    { id: "w12", title: "Week 12 — Lifespan & Pydantic v2; Rust macros & reference appendices", start: "2026-12-09" },
    { id: "w13", title: "Week 13 — Capstone I — real API; Capstone II — auth & tests", start: "2026-12-16" },
    { id: "w14", title: "Week 14 — Async SQLAlchemy 2.0", start: "2026-12-23" },
    { id: "w15", title: "Week 15 — Rust consolidation; Checkpoint — books closed; …", start: "2026-12-30" },
    { id: "w16", title: "Week 16 — FastAPI — ship the capstone; Async Rust II — an async web server", start: "2027-01-06" },
    { id: "w17", title: "Week 17 — Buffer / catch-up", start: "2027-01-13" },
    { id: "w18", title: "Week 18 — Integration capstone I — design; Integration capstone II — wire it up", start: "2027-01-20" },
    { id: "w19", title: "Week 19 — Polish & tests; Grand retro & next-project plan", start: "2027-01-27" },
    { id: "w20", title: "Week 20 — New book: Rust Web Programming (3rd ed.); Ch1 review — types, collections, errors; …", start: "2027-02-03" },
    { id: "w21", title: "Week 21 — Ch2 — traits & macros for the web; Ch2 — messages, config traits, typed state", start: "2027-02-10" },
    { id: "w22", title: "Week 22 — Ch3 — Cargo, deeper; Ch3 — nanoservices structure", start: "2027-02-17" },
    { id: "w23", title: "Week 23 — Ch3 — the Data Access Layer; Checkpoint — foundations solid", start: "2027-02-24" },
    { id: "w24", title: "Week 24 — Ch4 — Async Rust, the book's way; Ch4 — tokio & a Hyper server", start: "2027-03-03" },
    { id: "w25", title: "Week 25 — Ch5 — serving the to-do core; Ch5 — serving items & error handling", start: "2027-03-10" },
    { id: "w26", title: "Week 26 — Ch6 — params & POST bodies; Ch6 — PUT, DELETE & headers; …", start: "2027-03-17" },
    { id: "w27", title: "Week 27 — Ch7 — serving a frontend from Rust; Ch7 — React components on the API", start: "2027-03-24" },
    { id: "w28", title: "Week 28 — Ch7 — styling the app; Ch8 — Rust in the browser (WASM) I; …", start: "2027-03-31" },
    { id: "w29", title: "Week 29 — Ch8 — the WASM client; Checkpoint — the full-stack app", start: "2027-04-07" },
    { id: "w30", title: "Week 30 — Ch9 — PostgreSQL in Docker; Ch9 — SQLx & database transactions", start: "2027-04-14" },
    { id: "w31", title: "Week 31 — Ch9 — migrations & frontend refactor; Checkpoint — it persists; …", start: "2027-04-21" },
    { id: "w32", title: "Week 32 — Ch10 — users & JWT; Ch10 — login & frontend auth", start: "2027-04-28" },
    { id: "w33", title: "Week 33 — Ch11 — servers talking to servers", start: "2027-05-05" },
    { id: "w34", title: "Week 34 — Ch11 — tethering users to items; Ch12 — caching with Redis", start: "2027-05-12" },
    { id: "w35", title: "Week 35 — Ch12 — session lifecycle & client; Ch12 — the cache kernel", start: "2027-05-19" },
    { id: "w36", title: "Week 36 — Ch13 — logging & middleware; Ch13 — the logging actor & DB", start: "2027-05-26" },
    { id: "w37", title: "Week 37 — Checkpoint — the whole nanoservices stack; Capstone I — run it like it's real; …", start: "2027-06-02" },
    { id: "w38", title: "Week 38 — Retro & what's beyond this EPUB; Buffer / overflow; 2nd-ed Ch9 — unit & JWT tests", start: "2027-06-09" },
    { id: "w39", title: "Week 39 — 2nd-ed Ch9 — web-request tests & Postman; 2nd-ed Ch9 — Newman & a test pipeline", start: "2027-06-16" },
    { id: "w40", title: "Week 40 — 2nd-ed Ch10 — Docker images; 2nd-ed Ch10 — Terraform & build scripts", start: "2027-06-23" },
    { id: "w41", title: "Week 41 — 2nd-ed Ch10 — deploy to AWS; 2nd-ed Ch11 — HTTPS, locally; …", start: "2027-06-30" },
    { id: "w42", title: "Week 42 — Checkpoint — tested, deployed, secured; 2nd-ed Ch13 — a clean repository", start: "2027-07-07" },
    { id: "w43", title: "Week 43 — 2nd-ed Ch13 — distroless images & GitHub Actions CI; 2nd-ed Ch12 — Rocket", start: "2027-07-14" },
    { id: "w44", title: "Week 44 — 2nd-ed Ch12 — Rocket: views, JSON & tests; 2nd-ed Ch14 — the Tokio framework", start: "2027-07-21" },
    { id: "w45", title: "Week 45 — 2nd-ed Ch14 — the actor model; 2nd-ed Ch15 — accepting TCP with Tokio", start: "2027-07-28" },
    { id: "w46", title: "Week 46 — 2nd-ed Ch15 — actors over TCP; 2nd-ed Ch16 — protocols on TCP; …", start: "2027-08-04" },
    { id: "w47", title: "Week 47 — 2nd-ed Ch17 — actors with Hyper; 2nd-ed Ch17 — the Hyper server", start: "2027-08-11" },
    { id: "w48", title: "Week 48 — 2nd-ed Ch18 — a Redis task queue; 2nd-ed Ch18 — tasks, messages & Docker; …", start: "2027-08-18" },
  ],

  days: [
    /* ---------------- Week 1 ---------------- */
    {
      id: "d01", date: "2026-09-23", week: "w1", title: "Resume: Box & Deref",
      theme: "Back into Rust at Ch15 — smart pointers on the heap.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 80, group: "g1",
          label: `Rust — <b>Ch15.1–15.2</b>: <code>Box&lt;T&gt;</code> on the heap & recursive cons-list; the <b>Deref</b> trait. <a href="https://doc.rust-lang.org/stable/book/ch15-01-box.html" target="_blank" rel="noopener">Book §15.1</a>`,
          sub: [
            { id: "s1", est: 40, label: `Ch15.1 <a href="https://doc.rust-lang.org/stable/book/ch15-01-box.html" target="_blank" rel="noopener">Using <code>Box&lt;T&gt;</code> to Point to Data on the Heap</a> & the recursive cons-list.` },
            { id: "s2", est: 40, label: `Ch15.2 <a href="https://doc.rust-lang.org/stable/book/ch15-02-deref.html" target="_blank" rel="noopener">Treating Smart Pointers Like Regular References</a> (the <b>Deref</b> trait).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Deref coercion is what lets <code>&String</code> pass where <code>&str</code> is wanted — the compiler chains <code>Deref</code> calls at compile time, zero cost.` },
        { id: "s2", type: "tryout", label: `Tryout: implement <code>DerefMut</code> for <code>MyBox</code> and observe when the compiler picks it over <code>Deref</code>.` },
      ],
    },
    {
      id: "d02", date: "2026-09-27", week: "w1", title: "Resume: Box & Deref (cont.)",
      theme: "Finish “Resume: Box & Deref” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d01", obj: R, cat: "code", est: 70, group: "g1-d01",
          label: `Build the <code>MyBox&lt;T&gt;</code> example and prove <b>deref coercion</b> yourself; run every listing.`,
          sub: [
            { id: "s1", est: 25, label: `Build the <code>MyBox&lt;T&gt;</code> example.` },
            { id: "s2", est: 25, label: `Prove <b>deref coercion</b> yourself.` },
            { id: "s3", est: 20, label: `Run every listing.` },
          ] },
      ],
    },
    {
      id: "d03", date: "2026-09-29", week: "w1", title: "Rc, RefCell & Weak",
      theme: "Interior mutability and reference cycles — the tricky half of Ch15.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 90, group: "g1",
          label: `Rust — <b>Ch15.3–15.6</b>: <b>Drop</b>, <code>Rc&lt;T&gt;</code>, <code>RefCell&lt;T&gt;</code> & interior mutability, reference cycles & <code>Weak&lt;T&gt;</code>. <a href="https://doc.rust-lang.org/stable/book/ch15-03-drop.html" target="_blank" rel="noopener">Book §15.3</a> (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Ch15.3 <a href="https://doc.rust-lang.org/stable/book/ch15-03-drop.html" target="_blank" rel="noopener">Running Code on Cleanup with the <code>Drop</code> Trait</a>.` },
            { id: "s2", est: 30, label: `Ch15.4 <a href="https://doc.rust-lang.org/stable/book/ch15-04-rc.html" target="_blank" rel="noopener"><code>Rc&lt;T&gt;</code>, the Reference Counted Smart Pointer</a>.` },
            { id: "s3", est: 30, label: `Ch15.5 <a href="https://doc.rust-lang.org/stable/book/ch15-05-interior-mutability.html" target="_blank" rel="noopener"><code>RefCell&lt;T&gt;</code> and the Interior Mutability Pattern</a>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>RefCell</code> moves borrow-checking to <b>runtime</b> — a double mutable borrow panics instead of failing to compile. Interior mutability is a deliberate escape hatch, not the default.` },
        { id: "s2", type: "callout", label: `See also: interior-mutability pitfalls & the <code>Cell</code> vs <code>RefCell</code> distinction — keep this in mind when the web server needs shared state.` },
      ],
    },

    /* ---------------- Week 2 ---------------- */
    {
      id: "d04", date: "2026-10-01", week: "w2", title: "Rc, RefCell & Weak (cont.)",
      theme: "Finish “Rc, RefCell & Weak” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d03", obj: R, cat: "read", est: 30, group: "g1-d03",
          label: `Rust — <b>Ch15.3–15.6</b>: <b>Drop</b>, <code>Rc&lt;T&gt;</code>, <code>RefCell&lt;T&gt;</code> & interior mutability, reference cycles & <code>Weak&lt;T&gt;</code>. <a href="https://doc.rust-lang.org/stable/book/ch15-03-drop.html" target="_blank" rel="noopener">Book §15.3</a> (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Ch15.6 <a href="https://doc.rust-lang.org/stable/book/ch15-06-reference-cycles.html" target="_blank" rel="noopener">Reference Cycles Can Leak Memory</a> (<code>Weak&lt;T&gt;</code>).` },
          ] },
        { id: "t2", carried: "d03", obj: R, cat: "code", est: 70, group: "g1-d03",
          label: `Work the mock-messenger (<code>RefCell</code>) and the leaf/branch tree (<code>Rc</code>+<code>Weak</code>) listings.`,
          sub: [
            { id: "s1", est: 35, label: `Work the mock-messenger (<code>RefCell</code>) listing.` },
            { id: "s2", est: 35, label: `Work the leaf/branch tree (<code>Rc</code>+<code>Weak</code>) listing.` },
          ] },
        { id: "t3", carried: "d03", obj: R, cat: "challenge", est: 100, optional: true,
          label: `<b>Tryout project:</b> build a tiny <code>Rc&lt;RefCell&lt;Node&gt;&gt;</code> graph, <b>force a leak</b>, then fix it with <code>Weak</code> and confirm with strong/weak counts.`,
          fallback: { est: 30, label: `Just build the cycle and print <code>Rc::strong_count</code> before/after dropping.` } },
      ],
    },
    {
      id: "d05", date: "2026-10-02", week: "w2", title: "FastAPI databases",
      theme: "Switch objective — SQLAlchemy models, CRUD, sessions.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 60, group: "g1",
          label: `FastAPI — <b>Ch4 Working with Databases</b>: SQLAlchemy setup, models, CRUD, sessions & transactions (pp 52–67).`,
          sub: [
            { id: "s1", est: 30, label: `<b>Ch4</b> — SQLAlchemy setup & models.` },
            { id: "s2", est: 30, label: `CRUD, sessions & transactions (pp 52–67).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 The official FastAPI SQL tutorial now uses <b>SQLModel</b> (Pydantic+SQLAlchemy). The book is raw SQLAlchemy — fine to learn, but know the modern default. <a href="https://fastapi.tiangolo.com/tutorial/sql-databases/" target="_blank" rel="noopener">docs</a>` },
        { id: "s2", type: "hint", label: `💡 The book is SQLAlchemy-<b>sync</b> only. We'll add an async 2.0-style router later (see Week 14).` },
      ],
    },
    {
      id: "d06", date: "2026-10-05", week: "w2", title: "FastAPI databases (cont.)",
      theme: "Finish “FastAPI databases” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d05", obj: F, cat: "api", est: 85, group: "g1-d05",
          label: `Build a small CRUD API from the chapter; wire a session dependency with <code>Depends</code>.`,
          sub: [
            { id: "s1", est: 45, label: `Build a small CRUD API from the chapter.` },
            { id: "s2", est: 40, label: `Wire a session dependency with <code>Depends</code>.` },
          ] },
      ],
    },

    /* ---------------- Week 3 ---------------- */
    {
      id: "d07", date: "2026-10-07", week: "w3", title: "Fearless concurrency",
      theme: "Threads, channels, Mutex/Arc — Ch16 (book is snippet-y, so we build).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 70, group: "g1",
          label: `Rust — <b>Ch16</b>: threads (<code>spawn</code>/<code>join</code>/<code>move</code>), channels, <code>Mutex&lt;T&gt;</code>+<code>Arc&lt;T&gt;</code>, <code>Send</code>/<code>Sync</code>. <a href="https://doc.rust-lang.org/stable/book/ch16-01-threads.html" target="_blank" rel="noopener">Book §16.1</a>`,
          sub: [
            { id: "s1", est: 20, label: `Ch16.1 <a href="https://doc.rust-lang.org/stable/book/ch16-01-threads.html" target="_blank" rel="noopener">Using Threads to Run Code Simultaneously</a> (<code>spawn</code>/<code>join</code>/<code>move</code>).` },
            { id: "s2", est: 15, label: `Ch16.2 <a href="https://doc.rust-lang.org/stable/book/ch16-02-message-passing.html" target="_blank" rel="noopener">Message Passing between Threads</a> (channels).` },
            { id: "s3", est: 20, label: `Ch16.3 <a href="https://doc.rust-lang.org/stable/book/ch16-03-shared-state.html" target="_blank" rel="noopener">Shared-State Concurrency</a> (<code>Mutex&lt;T&gt;</code>+<code>Arc&lt;T&gt;</code>).` },
            { id: "s4", est: 15, label: `Ch16.4 <a href="https://doc.rust-lang.org/stable/book/ch16-04-extensible-concurrency-sync-and-send.html" target="_blank" rel="noopener">Extensible Concurrency with <code>Send</code> and <code>Sync</code></a>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — this is OS-thread concurrency (Ch16). The very next chapter, <a href="https://doc.rust-lang.org/stable/book/ch17-00-async-await.html" target="_blank" rel="noopener">Ch17 Async & Await</a>, is the cooperative other half — you'll read and apply it in weeks 15–19 (with <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">tokio</a>).` },
        { id: "s2", type: "hint", label: `💡 <code>Send</code> = safe to move to another thread; <code>Sync</code> = safe to share by reference. They're auto-derived — you rarely implement them, but reading the errors teaches you the model.` },
      ],
    },
    {
      id: "d08", date: "2026-10-10", week: "w3", title: "Fearless concurrency (cont.)",
      theme: "Finish “Fearless concurrency” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d07", obj: R, cat: "project", est: 95, group: "g1-d07",
          label: `<b>Combine-topics tryout:</b> a worker pool of N threads pulling jobs off an <code>mpsc</code> channel, accumulating results behind an <code>Arc&lt;Mutex&lt;_&gt;&gt;</code>. (Warm-up for Ch21's thread pool.)`,
          sub: [
            { id: "s1", est: 50, label: `<b>Combine-topics tryout:</b> a worker pool of N threads pulling jobs off an <code>mpsc</code> channel.` },
            { id: "s2", est: 45, label: `Accumulate results behind an <code>Arc&lt;Mutex&lt;_&gt;&gt;</code>. (Warm-up for Ch21's thread pool.)` },
          ] },
      ],
    },
    {
      id: "d09", date: "2026-10-13", week: "w3", title: "FastAPI project structure",
      theme: "Split the app with APIRouter — book §5.1 + official docs.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 50, group: "g1",
          label: `FastAPI — <b>Ch5.1</b> project structure / clean code (pp 68–75).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>response_model_exclude</code> and separate input/output Pydantic models are how you keep secrets out of responses without hand-filtering dicts.` },
      ],
      note: "End of week 3 — smart pointers done, FastAPI DB layer + structure in place.",
    },

    /* ---------------- Week 4 ---------------- */
    {
      id: "d10", date: "2026-10-15", week: "w4", title: "FastAPI project structure (cont.)",
      theme: "Finish “FastAPI project structure” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d09", obj: F, cat: "api", est: 85, group: "g1-d09",
          label: `<b>Supplement — Bigger Applications:</b> refactor the CRUD app into <code>routers/</code> with <code>APIRouter</code> (prefix, tags, per-router deps). <a href="https://fastapi.tiangolo.com/tutorial/bigger-applications/" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 45, label: `<b>Supplement — Bigger Applications:</b> refactor the CRUD app into <code>routers/</code> with <code>APIRouter</code>.` },
            { id: "s2", est: 40, label: `Set prefix, tags & per-router deps. <a href="https://fastapi.tiangolo.com/tutorial/bigger-applications/" target="_blank" rel="noopener">docs</a>` },
          ] },
        { id: "t2", carried: "d09", obj: F, cat: "api", est: 45, optional: true,
          label: `<b>Bonus:</b> add <code>response_model</code> to every route; use the "never return the password field" split-model pattern. <a href="https://fastapi.tiangolo.com/tutorial/response-model/" target="_blank" rel="noopener">docs</a>` },
      ],
    },
    {
      id: "d11", date: "2026-10-18", week: "w4", title: "OOP in Rust",
      theme: "Trait objects & the State pattern — Ch18 (example-rich).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 95, group: "g1",
          label: `Rust — <b>Ch18</b>: OO characteristics, <b>trait objects</b> (<code>dyn</code>, object safety) via the <code>Draw</code>/<code>Screen</code> GUI, and the full <b>State pattern</b> blog example. <a href="https://doc.rust-lang.org/stable/book/ch18-00-oop.html" target="_blank" rel="noopener">Book §18</a>`,
          sub: [
            { id: "s1", est: 30, label: `Ch18.1 <a href="https://doc.rust-lang.org/stable/book/ch18-01-what-is-oo.html" target="_blank" rel="noopener">Characteristics of Object-Oriented Languages</a>.` },
            { id: "s2", est: 30, label: `Ch18.2 <a href="https://doc.rust-lang.org/stable/book/ch18-02-trait-objects.html" target="_blank" rel="noopener">Using Trait Objects to Abstract over Shared Behavior</a> (<code>dyn</code>, object safety) via the <code>Draw</code>/<code>Screen</code> GUI.` },
            { id: "s3", est: 35, label: `Ch18.3 <a href="https://doc.rust-lang.org/stable/book/ch18-03-oo-design-patterns.html" target="_blank" rel="noopener">Implementing an Object-Oriented Design Pattern</a> (the <b>State pattern</b> blog example).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Rust's "OOP" is trait objects + enums, not inheritance. The State pattern here trades compile-time checks for runtime flexibility — compare it mentally to the <code>enum</code> version.` },
      ],
    },
    {
      id: "d12", date: "2026-10-19", week: "w4", title: "OOP in Rust (cont.)",
      theme: "Finish “OOP in Rust” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d11", obj: R, cat: "code", est: 90, group: "g1-d11",
          label: `Implement the whole <code>Post</code> State-pattern example; then <b>harden it</b> — add a <code>Rejected</code> state and a word-count guard on publish.`,
          sub: [
            { id: "s1", est: 45, label: `Implement the whole <code>Post</code> State-pattern example.` },
            { id: "s2", est: 25, label: `<b>Harden it</b> — add a <code>Rejected</code> state.` },
            { id: "s3", est: 20, label: `Add a word-count guard on publish.` },
          ] },
      ],
    },

    /* ---------------- Week 5 ---------------- */
    {
      id: "d13", date: "2026-10-21", week: "w5", title: "FastAPI security (JWT)",
      theme: "The book's §5.2 is thin (9pp) — supplement heavily with official auth docs.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 50, group: "g1",
          label: `FastAPI — <b>Ch5.2 Security</b> (pp 76–84) — read, but treat as an intro only.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 Current docs use <b>pwdlib (Argon2)</b> and <b>PyJWT</b> — older tutorials (and this book) show <code>passlib</code>/<code>python-jose</code>. Use the new stack.` },
        { id: "s2", type: "tryout", label: `Tryout: protect one CRUD route with the JWT dependency and prove a missing/expired token returns 401.` },
      ],
    },
    {
      id: "d14", date: "2026-10-23", week: "w5", title: "FastAPI security (JWT) (cont.)",
      theme: "Finish “FastAPI security (JWT)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d13", obj: F, cat: "api", est: 80, group: "g1-d13",
          label: `<b>Supplement — OAuth2 + JWT:</b> implement password flow, hashing, and Bearer/JWT from the official tutorial. <a href="https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" target="_blank" rel="noopener">docs</a> (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `<b>Supplement — OAuth2 + JWT:</b> implement the password flow.` },
            { id: "s2", est: 40, label: `Implement hashing.` },
          ] },
      ],
    },
    {
      id: "d15", date: "2026-10-27", week: "w5", title: "Patterns & matching (1/3)",
      theme: "Ch19 is reference-y — so we build one thing that uses it all.",
      tasks: [
        { id: "t1", carried: "d13", obj: F, cat: "api", est: 40, group: "g1-d13",
          label: `<b>Supplement — OAuth2 + JWT:</b> implement password flow, hashing, and Bearer/JWT from the official tutorial. <a href="https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" target="_blank" rel="noopener">docs</a> (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Implement Bearer/JWT from the official tutorial. <a href="https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" target="_blank" rel="noopener">docs</a>` },
          ] },
        { id: "t2", obj: R, cat: "read", est: 60, group: "g1",
          label: `Rust — <b>Ch19</b>: all pattern places, refutability, and the full syntax (destructuring, ranges, guards, <code>@</code>, <code>ref</code>). <a href="https://doc.rust-lang.org/stable/book/ch19-00-patterns.html" target="_blank" rel="noopener">Book §19</a> (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Ch19.1 <a href="https://doc.rust-lang.org/stable/book/ch19-01-all-the-places-for-patterns.html" target="_blank" rel="noopener">All the Places Patterns Can Be Used</a>.` },
            { id: "s2", est: 30, label: `Ch19.2 <a href="https://doc.rust-lang.org/stable/book/ch19-02-refutability.html" target="_blank" rel="noopener">Refutability: Whether a Pattern Might Fail to Match</a>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Match guards let you add arbitrary boolean conditions to an arm, but they defeat exhaustiveness checking — the compiler can't prove the guard covers the case, so you still need a catch-all.` },
      ],
    },

    /* ---------------- Week 6 ---------------- */
    {
      id: "d16", date: "2026-10-29", week: "w6", title: "Patterns & matching (2/3, cont.)",
      theme: "Finish “Patterns & matching (1/3)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d15", obj: R, cat: "read", est: 30, group: "g1-d15",
          label: `Rust — <b>Ch19</b>: all pattern places, refutability, and the full syntax (destructuring, ranges, guards, <code>@</code>, <code>ref</code>). <a href="https://doc.rust-lang.org/stable/book/ch19-00-patterns.html" target="_blank" rel="noopener">Book §19</a> (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Ch19.3 <a href="https://doc.rust-lang.org/stable/book/ch19-03-pattern-syntax.html" target="_blank" rel="noopener">Pattern Syntax</a> (destructuring, ranges, guards, <code>@</code>, <code>ref</code>).` },
          ] },
      ],
    },
    {
      id: "d17", date: "2026-10-31", week: "w6", title: "Patterns & matching (3/3, cont.)",
      theme: "Finish “Patterns & matching (1/3)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d15", obj: R, cat: "project", est: 90, group: "g1-d15",
          label: `<b>Tryout:</b> a tiny command parser — <code>match</code> on an enum of commands using destructuring, ranges, match guards, and <code>@</code> bindings in one cohesive example.`,
          sub: [
            { id: "s1", est: 45, label: `<b>Tryout:</b> a tiny command parser — <code>match</code> on an enum of commands.` },
            { id: "s2", est: 45, label: `Use destructuring, ranges, match guards, and <code>@</code> bindings in one cohesive example.` },
          ] },
      ],
    },
    {
      id: "d18", date: "2026-11-02", week: "w6", title: "FastAPI dependencies",
      theme: "Depends done properly — DI, sub-dependencies, yield teardown.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 60, group: "g1",
          label: `<b>Supplement — Dependencies:</b> <code>Depends</code>, sub-dependencies, and <code>yield</code> for setup/teardown. <a href="https://fastapi.tiangolo.com/tutorial/dependencies/" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 20, label: `<b>Supplement — Dependencies:</b> <code>Depends</code>.` },
            { id: "s2", est: 20, label: `Sub-dependencies.` },
            { id: "s3", est: 20, label: `<code>yield</code> for setup/teardown. <a href="https://fastapi.tiangolo.com/tutorial/dependencies/" target="_blank" rel="noopener">docs</a>` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A <code>yield</code> dependency is FastAPI's answer to context managers — code before <code>yield</code> runs on entry, code after runs on exit even if the route raised.` },
      ],
      note: "Lighter FastAPI day — room for whatever else is on today.",
    },

    /* ---------------- Week 7 ---------------- */
    {
      id: "d19", date: "2026-11-06", week: "w7", title: "FastAPI dependencies (cont.)",
      theme: "Finish “FastAPI dependencies” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d18", obj: F, cat: "api", est: 80, group: "g1-d18",
          label: `Refactor DB-session and current-user into reusable <code>Depends</code>; add a role-check sub-dependency.`,
          sub: [
            { id: "s1", est: 40, label: `Refactor DB-session and current-user into reusable <code>Depends</code>.` },
            { id: "s2", est: 40, label: `Add a role-check sub-dependency.` },
          ] },
      ],
    },
    {
      id: "d20", date: "2026-11-09", week: "w7", title: "Advanced Rust I",
      theme: "Unsafe Rust — Ch20 part 1 (the unsafe superpowers).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 105, group: "g1",
          label: `Rust — <b>Ch20.1 Unsafe Rust</b>: the superpowers — deref raw pointers, call <code>unsafe</code> fns, access/modify mutable statics, impl unsafe traits, union fields (+ <code>extern</code>/FFI). <a href="https://doc.rust-lang.org/stable/book/ch20-01-unsafe-rust.html" target="_blank" rel="noopener">Book §20.1</a>`,
          sub: [
            { id: "s1", est: 35, label: `Ch20.1 <a href="https://doc.rust-lang.org/stable/book/ch20-01-unsafe-rust.html" target="_blank" rel="noopener">Unsafe Rust</a> — the five unsafe superpowers, and dereferencing raw pointers.` },
            { id: "s2", est: 30, label: "Ch20.1 (continued) — calling <code>unsafe</code> functions, <code>extern</code> blocks, mutable statics and unsafe traits." },
            { id: "s3", est: 40, label: `The rest of §20.1 — mutable statics, <code>unsafe</code> traits, union fields & <code>extern</code>/FFI.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — <a href="https://doc.rust-lang.org/nomicon/" target="_blank" rel="noopener">The Rustonomicon</a> is the deep dive on everything <code>unsafe</code>; bookmark for after the book.` },
      ],
    },
    {
      id: "d21", date: "2026-11-10", week: "w7", title: "Advanced Rust I (cont.)",
      theme: "Finish “Advanced Rust I” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d20", obj: R, cat: "code", est: 55, group: "g1-d20",
          label: `Write a small <code>unsafe</code> block that dereferences a raw pointer and a <code>split_at_mut</code>-style function; document <i>why</i> each unsafe use is sound.`,
          sub: [
            { id: "s1", est: 35, label: `Write a small <code>unsafe</code> block that dereferences a raw pointer and a <code>split_at_mut</code>-style function.` },
            { id: "s2", est: 20, label: `Document <i>why</i> each unsafe use is sound.` },
          ] },
      ],
    },

    /* ---------------- Week 8 ---------------- */
    {
      id: "d22", date: "2026-11-12", week: "w8", title: "Advanced Rust II",
      theme: "Advanced traits/types/closures — the Book's most reference-like sections.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 105, group: "g1",
          label: `Rust — <b>Ch20.2–20.4</b>: advanced traits (associated types, operator overloading, supertraits, newtype), advanced types (<code>!</code>, DSTs, <code>Sized</code>), function pointers & returning closures. <a href="https://doc.rust-lang.org/stable/book/ch20-02-advanced-traits.html" target="_blank" rel="noopener">Book §20.2</a>`,
          sub: [
            { id: "s1", est: 35, label: `Ch20.2 <a href="https://doc.rust-lang.org/stable/book/ch20-02-advanced-traits.html" target="_blank" rel="noopener">Advanced Traits</a> (associated types, operator overloading, supertraits, newtype).` },
            { id: "s2", est: 35, label: `Ch20.3 <a href="https://doc.rust-lang.org/stable/book/ch20-03-advanced-types.html" target="_blank" rel="noopener">Advanced Types</a> (<code>!</code>, DSTs, <code>Sized</code>).` },
            { id: "s3", est: 35, label: `Ch20.4 <a href="https://doc.rust-lang.org/stable/book/ch20-04-advanced-functions-and-closures.html" target="_blank" rel="noopener">Advanced Functions and Closures</a> (fn pointers & returning closures).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The newtype pattern (<code>struct Wrapper(Vec&lt;String&gt;)</code>) is how you implement a foreign trait on a foreign type — the orphan rule's escape hatch.` },
        { id: "s2", type: "callout", label: `🔗 See also — ergonomic errors with <a href="https://docs.rs/anyhow" target="_blank" rel="noopener">anyhow</a> (apps) and <a href="https://docs.rs/thiserror" target="_blank" rel="noopener">thiserror</a> (libs); the Book only covers <code>Box&lt;dyn Error&gt;</code>.` },
      ],
    },
    {
      id: "d23", date: "2026-11-14", week: "w8", title: "Advanced Rust II (cont.)",
      theme: "Finish “Advanced Rust II” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d22", obj: R, cat: "project", est: 95, group: "g1-d22",
          label: `<b>Integrative tryout:</b> a mini units library — a <code>Meters(f64)</code> newtype implementing <code>Add</code> (operator overloading) with an associated <code>Output</code> type, plus a supertrait for <code>Display</code>. Ties four Ch20 topics together.`,
          sub: [
            { id: "s1", est: 50, label: `<b>Integrative tryout:</b> a mini units library — a <code>Meters(f64)</code> newtype implementing <code>Add</code> (operator overloading) with an associated <code>Output</code> type.` },
            { id: "s2", est: 45, label: `Add a supertrait for <code>Display</code>. Ties four Ch20 topics together.` },
          ] },
      ],
    },
    {
      id: "d24", date: "2026-11-15", week: "w8", title: "FastAPI testing",
      theme: "TestClient + background tasks — the book barely covers testing.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 60, group: "g1",
          label: `<b>Supplement — Testing:</b> <code>TestClient</code> patterns. <a href="https://fastapi.tiangolo.com/tutorial/testing/" target="_blank" rel="noopener">docs</a> · <b>Background Tasks.</b> <a href="https://fastapi.tiangolo.com/tutorial/background-tasks/" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 30, label: `<b>Supplement — Testing:</b> <code>TestClient</code> patterns. <a href="https://fastapi.tiangolo.com/tutorial/testing/" target="_blank" rel="noopener">docs</a>` },
            { id: "s2", est: 30, label: `<b>Background Tasks.</b> <a href="https://fastapi.tiangolo.com/tutorial/background-tasks/" target="_blank" rel="noopener">docs</a>` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>TestClient</code> wraps httpx/Starlette and runs the app in-process — no server, no ports. Override dependencies with <code>app.dependency_overrides</code> to swap the DB for a test one.` },
      ],
    },

    /* ---------------- Week 9 ---------------- */
    {
      id: "d25", date: "2026-11-18", week: "w9", title: "FastAPI testing (cont.)",
      theme: "Finish “FastAPI testing” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d24", obj: F, cat: "code", est: 80, group: "g1-d24",
          label: `Add a <code>pytest</code> suite covering each router (happy + auth-failure paths); add one <code>BackgroundTasks</code> endpoint (e.g. "send email" stub).`,
          sub: [
            { id: "s1", est: 45, label: `Add a <code>pytest</code> suite covering each router (happy + auth-failure paths).` },
            { id: "s2", est: 35, label: `Add one <code>BackgroundTasks</code> endpoint (e.g. "send email" stub).` },
          ] },
      ],
    },
    {
      id: "d26", date: "2026-11-20", week: "w9", title: "Web server I — single-threaded",
      theme: "Ch21 begins. It IS the tryout — one continuous project.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 45, group: "g1",
          label: `Rust — <b>Ch21.1 Building a Single-Threaded Web Server</b>: listen on TCP, read the request, anatomy of an HTTP request, write a response, return real HTML, validate & route. <a href="https://doc.rust-lang.org/stable/book/ch21-01-single-threaded.html" target="_blank" rel="noopener">Book §21.1</a>`,
          sub: [
            { id: "s1", est: 15, label: `listen on TCP, read the request.` },
            { id: "s2", est: 15, label: `anatomy of an HTTP request, write a response.` },
            { id: "s3", est: 15, label: `return real HTML, validate & route.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This is raw <code>std::net::TcpListener</code> — no framework. Seeing HTTP as bytes on a socket makes every web framework afterward feel less magical.` },
      ],
    },
    {
      id: "d27", date: "2026-11-23", week: "w9", title: "Web server I — single-threaded (cont.)",
      theme: "Finish “Web server I — single-threaded” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d26", obj: R, cat: "project", est: 100, group: "g1-d26",
          label: `<b>Build:</b> the single-threaded web server end to end — serve <code>hello.html</code> and a 404 page, selectively by request line.`,
          sub: [
            { id: "s1", est: 50, label: `<b>Build:</b> the single-threaded web server end to end — serve <code>hello.html</code>.` },
            { id: "s2", est: 50, label: `Serve a 404 page, selectively by request line.` },
          ] },
      ],
    },

    /* ---------------- Week 10 ---------------- */
    {
      id: "d28", date: "2026-11-26", week: "w10", title: "Web server II — the thread pool",
      theme: "The heavy section: design a ThreadPool API from scratch — Ch21.2.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 55, group: "g1",
          label: `Rust — <b>Ch21.2 From Single-Threaded to Multithreaded</b>: simulate a slow request, then design & build the <b>thread pool</b> — <code>ThreadPool</code>, <code>Worker</code>, channels/<code>Job</code>, <code>Send</code> closures. <a href="https://doc.rust-lang.org/stable/book/ch21-02-multithreaded.html" target="_blank" rel="noopener">Book §21.2</a>`,
          sub: [
            { id: "s1", est: 20, label: `simulate a slow request.` },
            { id: "s2", est: 35, label: `design & build the <b>thread pool</b> — <code>ThreadPool</code>, <code>Worker</code>, channels/<code>Job</code>, <code>Send</code> closures.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 50, group: "g1",
          label: `<b>Build:</b> implement the full thread pool and serve concurrent requests; verify a slow route no longer blocks others. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `<b>Build:</b> implement the full thread pool.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Everything from your Ch16 worker-pool tryout pays off here — same <code>mpsc</code> + <code>Arc&lt;Mutex&gt;</code> shape, now behind a clean API with <code>FnOnce</code> boxed jobs.` },
      ],
      note: "One of the heaviest Rust days — no FastAPI block.",
    },
    {
      id: "d29", date: "2026-11-28", week: "w10", title: "Web server II — the thread pool (cont.)",
      theme: "Finish “Web server II — the thread pool” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d28", obj: R, cat: "project", est: 80, group: "g1-d28",
          label: `<b>Build:</b> implement the full thread pool and serve concurrent requests; verify a slow route no longer blocks others. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Serve concurrent requests.` },
            { id: "s2", est: 35, label: `Verify a slow route no longer blocks others.` },
          ] },
      ],
    },
    {
      id: "d30", date: "2026-12-01", week: "w10", title: "FastAPI microservices (light)",
      theme: "Ch6 is prose-heavy/thin — read for concepts, keep it light (overlap day).",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 60,
          label: `FastAPI — <b>Ch6 Microservices</b>: principles, scaling, Redis/RabbitMQ, API gateway (pp 85–100). Conceptual — note ideas, don't rabbit-hole.`,
          sub: [
            { id: "s1", est: 20, label: `principles, scaling.` },
            { id: "s2", est: 20, label: `Redis/RabbitMQ.` },
            { id: "s3", est: 20, label: `API gateway (pp 85–100). Conceptual — note ideas, don't rabbit-hole.` },
          ] },
        { id: "t2", obj: F, cat: "review", est: 30, optional: true,
          label: `<b>Bonus:</b> sketch how you'd split the CRUD app into two services + a gateway (diagram only).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ The book's microservices chapter is light on real code. Treat it as a map, not a tutorial — real implementation would lean on message queues + the deploy docs next week.` },
      ],
      note: "Deliberately light — room for whatever else is on today.",
    },

    /* ---------------- Week 11 ---------------- */
    {
      id: "d31", date: "2026-12-02", week: "w11", title: "Web server III — graceful shutdown",
      theme: "Finish Ch21: Drop for the pool, signal workers to stop.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 45, group: "g1",
          label: `Rust — <b>Ch21.3 Graceful Shutdown and Cleanup</b>: implement <code>Drop</code> for <code>ThreadPool</code>, signal threads to stop, graceful shutdown & cleanup. <a href="https://doc.rust-lang.org/stable/book/ch21-03-graceful-shutdown-and-cleanup.html" target="_blank" rel="noopener">Book §21.3</a>`,
          sub: [
            { id: "s1", est: 15, label: `implement <code>Drop</code> for <code>ThreadPool</code>.` },
            { id: "s2", est: 15, label: `signal threads to stop.` },
            { id: "s3", est: 15, label: `graceful shutdown & cleanup.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>Drop</code> order matters: you must drop the sender first so the workers' <code>recv()</code> returns <code>Err</code> and their loops exit — otherwise <code>join()</code> hangs forever.` },
      ],
    },
    {
      id: "d32", date: "2026-12-03", week: "w11", title: "Web server III — graceful shutdown (cont.)",
      theme: "Finish “Web server III — graceful shutdown” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d31", obj: R, cat: "project", est: 80, group: "g1-d31",
          label: `<b>Finish the project:</b> graceful shutdown after N requests; ensure every worker joins cleanly. 🎉 The Book's final project is done.`,
          sub: [
            { id: "s1", est: 40, label: `<b>Finish the project:</b> graceful shutdown after N requests.` },
            { id: "s2", est: 40, label: `Ensure every worker joins cleanly. 🎉 The Book's final project is done.` },
          ] },
        { id: "t2", carried: "d31", obj: R, cat: "challenge", est: 85, optional: true,
          label: `<b>Extend:</b> add a real router (a couple of routes) and a small static-file handler to your server.` },
      ],
    },
    {
      id: "d33", date: "2026-12-07", week: "w11", title: "FastAPI deploy",
      theme: "Ch7 is thin on code — supplement with a real Docker deploy.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 50, group: "g1",
          label: `FastAPI — <b>Ch7 Deploying in Production</b>: Uvicorn vs Gunicorn, env security, Docker, AWS/GCP overviews (pp 101–116).`,
          sub: [
            { id: "s1", est: 20, label: `Uvicorn vs Gunicorn, env security.` },
            { id: "s2", est: 15, label: `Docker.` },
            { id: "s3", est: 15, label: `AWS/GCP overviews (pp 101–116).` },
          ] },
        { id: "t2", obj: F, cat: "project", est: 45, group: "g1",
          label: `<b>Supplement:</b> write a real multi-stage <code>Dockerfile</code> for the CRUD app (uvicorn workers), a <code>.env</code>, and run it locally in a container. (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `<b>Supplement:</b> write a real multi-stage <code>Dockerfile</code> for the CRUD app (uvicorn workers), a <code>.env</code>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ The book's AWS/GCP sections are 2–3 pages each — overviews, not runbooks. For a real deploy, follow the official Uvicorn/Gunicorn deployment docs + your container platform's guide.` },
      ],
    },

    /* ---------------- Week 12 ---------------- */
    {
      id: "d34", date: "2026-12-11", week: "w12", title: "Lifespan & Pydantic v2",
      theme: "Modernize the app — kill deprecated patterns.",
      tasks: [
        { id: "t1", carried: "d33", obj: F, cat: "project", est: 35, group: "g1-d33",
          label: `<b>Supplement:</b> write a real multi-stage <code>Dockerfile</code> for the CRUD app (uvicorn workers), a <code>.env</code>, and run it locally in a container. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `Run it locally in a container.` },
          ] },
        { id: "t2", obj: F, cat: "read", est: 60, group: "g1",
          label: `<b>Supplement — Lifespan events</b> <a href="https://fastapi.tiangolo.com/advanced/events/" target="_blank" rel="noopener">docs</a> and the <b>Pydantic v1→v2 migration</b> <a href="https://docs.pydantic.dev/latest/migration/" target="_blank" rel="noopener">guide</a>.`,
          sub: [
            { id: "s1", est: 30, label: `<b>Supplement — Lifespan events</b> <a href="https://fastapi.tiangolo.com/advanced/events/" target="_blank" rel="noopener">docs</a>.` },
            { id: "s2", est: 30, label: `the <b>Pydantic v1→v2 migration</b> <a href="https://docs.pydantic.dev/latest/migration/" target="_blank" rel="noopener">guide</a>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Deprecated: <code>@app.on_event("startup"/"shutdown")</code> → use <code>lifespan=</code>. It's all-lifespan or all-events, never both.` },
        { id: "s2", type: "callout", label: `🆕 Pydantic v2 renames: <code>.dict()</code>→<code>.model_dump()</code>, <code>@validator</code>→<code>@field_validator</code>, <code>class Config</code>→<code>model_config</code>. The <code>bump-pydantic</code> codemod automates most of it.` },
      ],
    },
    {
      id: "d35", date: "2026-12-13", week: "w12", title: "Lifespan & Pydantic v2 (cont.)",
      theme: "Finish “Lifespan & Pydantic v2” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d34", obj: F, cat: "code", est: 70, group: "g1-d34",
          label: `Refactor: replace any <code>@app.on_event</code> with a <code>lifespan=</code> context manager; move to Pydantic-v2 APIs (<code>model_dump</code>, <code>field_validator</code>, <code>model_config</code>).`,
          sub: [
            { id: "s1", est: 35, label: `Refactor: replace any <code>@app.on_event</code> with a <code>lifespan=</code> context manager.` },
            { id: "s2", est: 35, label: `Move to Pydantic-v2 APIs (<code>model_dump</code>, <code>field_validator</code>, <code>model_config</code>).` },
          ] },
      ],
    },
    {
      id: "d36", date: "2026-12-15", week: "w12", title: "Rust macros & reference appendices",
      theme: "The last Advanced-Features section, macros — plus the reference appendices (light).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 50,
          label: `Rust — <b>Ch20.5 Macros</b>: <code>macro_rules!</code> vs functions, then the worked <b>procedural derive macro</b> (<code>hello_macro</code>). <a href="https://doc.rust-lang.org/stable/book/ch20-05-macros.html" target="_blank" rel="noopener">Book §20.5</a>`,
          sub: [
            { id: "s1", est: 20, label: `<code>macro_rules!</code> (declarative macros) vs functions.` },
            { id: "s2", est: 30, label: `the worked <b>procedural derive macro</b> (<code>hello_macro</code>).` },
          ] },
        { id: "t2", obj: R, cat: "code", est: 60, optional: true,
          label: `<b>Bonus:</b> build the <code>hello_macro</code> derive crate yourself and derive it on a struct.`,
          fallback: { est: 20, label: `Just read & run the provided <code>hello_macro</code> code.` } },
        { id: "t3", obj: R, cat: "alt", est: 25, optional: true,
          label: `<b>Skim (reference):</b> Appendices <a href="https://doc.rust-lang.org/stable/book/appendix-01-keywords.html" target="_blank" rel="noopener">A Keywords</a>, B Operators, C Derivable Traits, and the new <a href="https://doc.rust-lang.org/stable/book/appendix-04-useful-development-tools.html" target="_blank" rel="noopener">D Useful Development Tools</a> (rustfmt, clippy, rust-analyzer) — bookmark, don't memorize.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>macro_rules!</code> is pattern-matching on token trees; procedural macros are Rust programs that run at compile time over a <code>TokenStream</code>. The book only samples both — a whole world (<code>syn</code>/<code>quote</code>) lies beyond.` },
      ],
    },

    /* ---------------- Week 13 ---------------- */
    {
      id: "d37", date: "2026-12-16", week: "w13", title: "Capstone I — real API",
      theme: "Pull FastAPI together: a CRUD+auth+tests service from scratch.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 70, group: "g1",
          label: `<b>Capstone (part 1):</b> design a fresh API (e.g. a bookmarks service) — models, <code>APIRouter</code> modules, DB layer, and CRUD routes with <code>response_model</code>. No book — you drive it. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `<b>Capstone (part 1):</b> design a fresh API (e.g. a bookmarks service) — models.` },
            { id: "s2", est: 35, label: `<code>APIRouter</code> modules.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: add pagination + filtering query params and a <code>response_model</code> for the list endpoint.` },
      ],
    },
    {
      id: "d38", date: "2026-12-19", week: "w13", title: "Capstone I — real API (cont.)",
      theme: "Finish “Capstone I — real API” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d37", obj: F, cat: "project", est: 70, group: "g1-d37",
          label: `<b>Capstone (part 1):</b> design a fresh API (e.g. a bookmarks service) — models, <code>APIRouter</code> modules, DB layer, and CRUD routes with <code>response_model</code>. No book — you drive it. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `DB layer.` },
            { id: "s2", est: 35, label: `CRUD routes with <code>response_model</code>. No book — you drive it.` },
          ] },
      ],
    },
    {
      id: "d39", date: "2026-12-21", week: "w13", title: "Capstone II — auth & tests",
      theme: "Finish the capstone with JWT auth and a real test suite.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 80, group: "g1",
          label: `<b>Capstone (part 2):</b> add JWT auth (pwdlib+PyJWT), protect the write routes, and cover it all with <code>pytest</code> + <code>TestClient</code> (incl. 401 paths). 🎉 Capstone done. (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `<b>Capstone (part 2):</b> add JWT auth (pwdlib+PyJWT).` },
            { id: "s2", est: 35, label: `Protect the write routes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 If you can override the DB dependency in tests and assert on 401s, you've internalized the two hardest FastAPI ideas: DI and security. That's the whole point of the supplement track.` },
      ],
    },

    /* ---------------- Week 14 ---------------- */
    {
      id: "d40", date: "2026-12-24", week: "w14", title: "Capstone II — auth & tests (cont.)",
      theme: "Finish “Capstone II — auth & tests” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d39", obj: F, cat: "project", est: 45, group: "g1-d39",
          label: `<b>Capstone (part 2):</b> add JWT auth (pwdlib+PyJWT), protect the write routes, and cover it all with <code>pytest</code> + <code>TestClient</code> (incl. 401 paths). 🎉 Capstone done. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Cover it all with <code>pytest</code> + <code>TestClient</code> (incl. 401 paths). 🎉 Capstone done.` },
          ] },
      ],
    },
    {
      id: "d41", date: "2026-12-25", week: "w14", title: "Async SQLAlchemy 2.0",
      theme: "The async DB pattern the book skipped.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 50, group: "g1",
          label: `<b>Supplement — async SQLAlchemy 2.0:</b> <code>AsyncSession</code>, <code>async_sessionmaker</code>, <code>select()</code>. <a href="https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html" target="_blank" rel="noopener">docs</a>`,
          sub: [
            { id: "s1", est: 20, label: `<b>Supplement — async SQLAlchemy 2.0:</b> <code>AsyncSession</code>.` },
            { id: "s2", est: 15, label: `<code>async_sessionmaker</code>.` },
            { id: "s3", est: 15, label: `<code>select()</code>. <a href="https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html" target="_blank" rel="noopener">docs</a>` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 SQLAlchemy 2.0 unifies ORM+Core behind <code>select()</code> and drops implicit autocommit / legacy <code>Query</code>. <a href="https://docs.sqlalchemy.org/en/20/changelog/migration_20.html" target="_blank" rel="noopener">migration guide</a>` },
      ],
    },
    {
      id: "d42", date: "2026-12-27", week: "w14", title: "Async SQLAlchemy 2.0 (cont.)",
      theme: "Finish “Async SQLAlchemy 2.0” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d41", obj: F, cat: "api", est: 85, group: "g1-d41",
          label: `Add one fully-async CRUD router to the capstone using an async engine; benchmark it against the sync one informally.`,
          sub: [
            { id: "s1", est: 45, label: `Add one fully-async CRUD router to the capstone using an async engine.` },
            { id: "s2", est: 40, label: `Benchmark it against the sync one informally.` },
          ] },
      ],
    },

    /* ---------------- Week 15 ---------------- */
    {
      id: "d43", date: "2026-12-31", week: "w15", title: "Rust consolidation",
      theme: "Cement the advanced material with one integrative exercise.",
      tasks: [
        { id: "t1", obj: R, cat: "project", est: 100, group: "g1",
          label: `<b>Combine-topics tryout:</b> extend your Ch21 web server with a <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> in-memory store and a couple of JSON routes — exercises smart pointers + concurrency + traits together.`,
          sub: [
            { id: "s1", est: 50, label: `<b>Combine-topics tryout:</b> extend your Ch21 web server with a <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> in-memory store.` },
            { id: "s2", est: 50, label: `Add a couple of JSON routes — exercises smart pointers + concurrency + traits together.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 After the Book: <a href="https://github.com/rust-lang/rustlings" target="_blank" rel="noopener">Rustlings</a>, <a href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noopener">Rust by Example</a>, <a href="https://github.com/kyclark/command-line-rust" target="_blank" rel="noopener">Command-Line Rust</a>, then async (tokio) for real network services.` },
      ],
    },
    {
      id: "d44", date: "2027-01-04", week: "w15", title: "Checkpoint — books closed",
      theme: "The Book's core (Ch15–16, 18–21) and Mastering FastAPI (Ch4–7) are done. Async (Ch17) + integration are next.",
      tasks: [
        { id: "t1", obj: R, cat: "review", est: 50, group: "g1",
          label: `Rust — skim your notes across Ch15–16 & 18–21; list the 3 ideas you'd most want to re-read (likely unsafe, advanced traits, or the thread pool). Async (Ch17) is the weeks-6–7 focus.`,
          sub: [
            { id: "s1", est: 25, label: `Rust — skim your notes across Ch15–16 & 18–21.` },
            { id: "s2", est: 25, label: `list the 3 ideas you'd most want to re-read (likely unsafe, advanced traits, or the thread pool).` },
          ] },
        { id: "t2", obj: F, cat: "review", est: 50, group: "g1",
          label: `FastAPI — write a one-page "cheat sheet" of the DI + security + async patterns you built; note gaps for a future project.`,
          sub: [
            { id: "s1", est: 25, label: `FastAPI — write a one-page "cheat sheet" of the DI + security + async patterns you built.` },
            { id: "s2", est: 25, label: `note gaps for a future project.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The books are finished a full four weeks before the two-book core closes (d56) — that slack is intentional. Weeks 15–19 read the Book's async chapter (Ch17) for real and build the capstone that fuses both stacks. If you slipped anywhere, this is where you catch up guilt-free.` },
      ],
      note: "Milestone checkpoint — the core is done; weeks 15–19 are deepening + buffer.",
    },
    /* ================================================================ *
     *  Week 15 — Async Rust (Ch17) & real deployment  (the Book's newest
     *  chapter, async/await, read here and applied for real with tokio;
     *  plus we ship the FastAPI capstone. Deliberately lighter/flexible —
     *  this is your buffer.)
     * ================================================================ */
    {
      id: "d45", date: "2027-01-05", week: "w15", title: "Async Rust I — the Book's Ch17 (futures & async)",
      theme: "The Book's newest chapter: async, await & futures — the other half of Rust concurrency.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 85, group: "g1",
          label: `Rust — <b>Ch17.1–17.3</b>: futures & the async syntax, applying concurrency with async, and working with any number of futures (<code>join!</code>/<code>race</code>). <a href="https://doc.rust-lang.org/stable/book/ch17-01-futures-and-syntax.html" target="_blank" rel="noopener">Book §17.1</a>`,
          sub: [
            { id: "s1", est: 50, label: `Ch17.1 <a href="https://doc.rust-lang.org/stable/book/ch17-01-futures-and-syntax.html" target="_blank" rel="noopener">Futures and the Async Syntax</a> + Ch17.2 <a href="https://doc.rust-lang.org/stable/book/ch17-02-concurrency-with-async.html" target="_blank" rel="noopener">Applying Concurrency with Async</a>.` },
            { id: "s2", est: 35, label: `Ch17.3 <a href="https://doc.rust-lang.org/stable/book/ch17-03-more-futures.html" target="_blank" rel="noopener">Working With Any Number of Futures</a>. The Book uses the <code>trpl</code> crate; <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio</a> is the real runtime it wraps.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — your Ch16 worker-pool and Ch21 thread pool used OS threads + <code>mpsc</code>. Async is the same idea (concurrent work, message passing) but cooperatively scheduled on a runtime. <code>tokio::sync::mpsc</code> is the async twin of <code>std::sync::mpsc</code>.` },
        { id: "s2", type: "hint", label: `💡 A <code>Future</code> is a state machine the compiler builds from your <code>async fn</code>; it does nothing until polled by an executor. That "lazy until awaited" model is the single biggest difference from threads.` },
      ],
    },

    /* ---------------- Week 16 ---------------- */
    {
      id: "d46", date: "2027-01-08", week: "w16", title: "Async Rust I — the Book's Ch17 (futures & async) (cont.)",
      theme: "Finish “Async Rust I — the Book's Ch17 (futures & async)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d45", obj: R, cat: "code", est: 80, group: "g1-d45",
          label: `Build a small tokio program: spawn several async tasks that sleep and race, and <code>join!</code> them. Feel how <code>.await</code> yields vs a blocking thread.`,
          sub: [
            { id: "s1", est: 45, label: `Build a small tokio program: spawn several async tasks that sleep and race, and <code>join!</code> them.` },
            { id: "s2", est: 35, label: `Feel how <code>.await</code> yields vs a blocking thread.` },
          ] },
      ],
    },
    {
      id: "d47", date: "2027-01-09", week: "w16", title: "FastAPI — ship the capstone",
      theme: "Take the Week-4/5 capstone from 'runs locally' to 'deployed'.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 85, group: "g1",
          label: `Deploy your capstone's Docker image to a real host (Fly.io / Railway / a VPS): env-based secrets, a managed Postgres, and a public URL with HTTPS.`,
          sub: [
            { id: "s1", est: 35, label: `Deploy your capstone's Docker image to a real host (Fly.io / Railway / a VPS): env-based secrets.` },
            { id: "s2", est: 25, label: `a managed Postgres.` },
            { id: "s3", est: 25, label: `a public URL with HTTPS.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ First real deploy checklist: no secrets in the image, <code>--workers</code> tuned to CPUs, DB migrations run on release (not on every boot), and logs going to stdout so the platform captures them.` },
      ],
    },
    {
      id: "d48", date: "2027-01-10", week: "w16", title: "Async Rust II — an async web server (1/3)",
      theme: "Rebuild the Ch21 server the async way — the payoff of d45.",
      tasks: [
        { id: "t1", carried: "d47", obj: F, cat: "read", est: 40, group: "g1-d47",
          label: `Add <b>structured logging</b> + a <code>/health</code> endpoint; skim the <a href="https://fastapi.tiangolo.com/deployment/concepts/" target="_blank" rel="noopener">deployment concepts</a> doc (workers, proxies, restarts).`,
          sub: [
            { id: "s1", est: 20, label: `Add <b>structured logging</b> + a <code>/health</code> endpoint.` },
            { id: "s2", est: 20, label: `skim the <a href="https://fastapi.tiangolo.com/deployment/concepts/" target="_blank" rel="noopener">deployment concepts</a> doc (workers, proxies, restarts).` },
          ] },
        { id: "t2", carried: "d47", obj: F, cat: "project", est: 50, optional: true,
          label: `<b>Bonus:</b> wire a GitHub Actions job that runs your pytest suite and builds the image on push.` },
        { id: "t3", obj: R, cat: "read", est: 35, group: "g1",
          label: `Rust — <b>Ch17.4–17.6</b>: streams, a closer look at the async traits, and futures-vs-tasks-vs-threads; then skim <a href="https://docs.rs/axum" target="_blank" rel="noopener">axum</a>'s hello-world for a real async framework. <a href="https://doc.rust-lang.org/stable/book/ch17-04-streams.html" target="_blank" rel="noopener">Book §17.4</a> (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Ch17.4 <a href="https://doc.rust-lang.org/stable/book/ch17-04-streams.html" target="_blank" rel="noopener">Streams: Futures in Sequence</a> + Ch17.5 <a href="https://doc.rust-lang.org/stable/book/ch17-05-traits-for-async.html" target="_blank" rel="noopener">A Closer Look at the Traits for Async</a> + Ch17.6 <a href="https://doc.rust-lang.org/stable/book/ch17-06-futures-tasks-threads.html" target="_blank" rel="noopener">Futures, Tasks, and Threads</a>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Notice what disappeared: no manual <code>ThreadPool</code>, no <code>Arc&lt;Mutex&gt;</code> around the job queue. The runtime <i>is</i> the pool. That's why async won for network I/O.` },
      ],
    },

    /* ---------------- Week 17 ---------------- */
    {
      id: "d49", date: "2027-01-13", week: "w17", title: "Async Rust II — an async web server (2/3, cont.)",
      theme: "Finish “Async Rust II — an async web server (1/3)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d48", obj: R, cat: "read", est: 30, group: "g1-d48",
          label: `Rust — <b>Ch17.4–17.6</b>: streams, a closer look at the async traits, and futures-vs-tasks-vs-threads; then skim <a href="https://docs.rs/axum" target="_blank" rel="noopener">axum</a>'s hello-world for a real async framework. <a href="https://doc.rust-lang.org/stable/book/ch17-04-streams.html" target="_blank" rel="noopener">Book §17.4</a> (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Skim <a href="https://docs.rs/axum" target="_blank" rel="noopener">axum</a>'s hello-world (a real async web framework) and the Tokio "I/O"/"Select" tutorial chapters.` },
          ] },
      ],
    },
    {
      id: "d50", date: "2027-01-14", week: "w17", title: "Async Rust II — an async web server (3/3, cont.)",
      theme: "Finish “Async Rust II — an async web server (1/3)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d48", obj: R, cat: "project", est: 95, group: "g1-d48",
          label: `<b>Build:</b> re-implement your Ch21 web server on <code>tokio</code> (async <code>TcpListener</code>, a task per connection). Compare it to the thread-pool version — no pool needed, the runtime multiplexes.`,
          sub: [
            { id: "s1", est: 50, label: `<b>Build:</b> re-implement your Ch21 web server on <code>tokio</code> (async <code>TcpListener</code>, a task per connection).` },
            { id: "s2", est: 45, label: `Compare it to the thread-pool version — no pool needed, the runtime multiplexes.` },
          ] },
      ],
    },
    {
      id: "d51", date: "2027-01-19", week: "w17", title: "Buffer / catch-up",
      theme: "Deliberate slack. Use it — don't invent work.",
      tasks: [
        { id: "t1", obj: R, cat: "review", est: 30, optional: true,
          label: `<b>If caught up:</b> a set of <a href="https://github.com/rust-lang/rustlings" target="_blank" rel="noopener">Rustlings</a> drills on the topics that felt shakiest (lifetimes, traits, error handling).` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: if you fell behind anywhere in weeks 1–15, this is the day to close it — a chapter's challenges you skipped, a listing that didn't compile, notes you meant to write.` },
        { id: "s2", type: "callout", label: `🔗 Nothing due today by design. A plan with zero slack is a plan that breaks on the first bad week; this day is the shock absorber.` },
      ],
      note: "Pure buffer day — required load is near zero on purpose.",
    },

    /* ---------------- Week 18 ---------------- */
    /* ================================================================ *
     *  Week 18 — Integration capstone & retro  (fuse both stacks, then a
     *  real close-out. The finishing move d44 used to only hint at.)
     * ================================================================ */
    {
      id: "d52", date: "2027-01-22", week: "w18", title: "Integration capstone I — design",
      theme: "One system that uses both languages: a Rust service behind a FastAPI gateway.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 40, group: "g1",
          label: `Sketch the architecture: a small <b>Rust</b> service (your async server from d48, exposing a JSON endpoint or two) fronted by a <b>FastAPI</b> gateway that auth-gates and proxies to it.`,
          sub: [
            { id: "s1", est: 20, label: `Sketch the architecture: a small <b>Rust</b> service (your async server from d48, exposing a JSON endpoint or two).` },
            { id: "s2", est: 20, label: `fronted by a <b>FastAPI</b> gateway that auth-gates and proxies to it.` },
          ] },
        { id: "t2", obj: R, cat: "project", est: 50, group: "g1",
          label: `<b>Build (Rust side):</b> give the async server a couple of real JSON routes backed by an <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> (or sqlite) store — exercises smart pointers + concurrency + traits together. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `<b>Build (Rust side):</b> give the async server a couple of real JSON routes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is the project d44 used to only hint at. Doing it proves you can pick the right tool per layer: Rust for the hot path, FastAPI for the ergonomic edge.` },
      ],
    },
    {
      id: "d53", date: "2027-01-23", week: "w18", title: "Integration capstone I — design (cont.)",
      theme: "Finish “Integration capstone I — design” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d52", obj: R, cat: "project", est: 50, group: "g1-d52",
          label: `<b>Build (Rust side):</b> give the async server a couple of real JSON routes backed by an <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> (or sqlite) store — exercises smart pointers + concurrency + traits together. (2/2)`,
          sub: [
            { id: "s1", est: 50, label: `back them with an <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> (or sqlite) store — exercises smart pointers + concurrency + traits together.` },
          ] },
      ],
    },
    {
      id: "d54", date: "2027-01-25", week: "w18", title: "Integration capstone II — wire it up",
      theme: "One end-to-end request path across both services.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 70, group: "g1",
          label: `<b>Build (FastAPI side):</b> a gateway that validates a JWT, forwards the request to the Rust service (httpx), and shapes the response with a <code>response_model</code>. Get one request flowing user → FastAPI → Rust → back. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `<b>Build (FastAPI side):</b> a gateway that validates a JWT.` },
            { id: "s2", est: 35, label: `forwards the request to the Rust service (httpx).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: add a timeout + graceful error when the Rust service is down, so the gateway degrades instead of hanging. Real systems fail at the seams — practice the seam.` },
      ],
    },

    /* ---------------- Week 19 ---------------- */
    {
      id: "d55", date: "2027-01-28", week: "w19", title: "Polish & tests",
      theme: "Make the capstone something you'd show.",
      tasks: [
        { id: "t1", carried: "d54", obj: F, cat: "project", est: 50, group: "g1-d54",
          label: `<b>Build (FastAPI side):</b> a gateway that validates a JWT, forwards the request to the Rust service (httpx), and shapes the response with a <code>response_model</code>. Get one request flowing user → FastAPI → Rust → back. (2/2)`,
          sub: [
            { id: "s1", est: 50, label: `shapes the response with a <code>response_model</code>. Get one request flowing user → FastAPI → Rust → back.` },
          ] },
        { id: "t2", obj: F, cat: "code", est: 35, group: "g1",
          label: `Add a <code>pytest</code> happy-path + one failure test for the gateway; write a short README with a run command and an architecture line. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Add a <code>pytest</code> happy-path + one failure test for the gateway.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A capstone you can run with one command and explain in one sentence is worth more than three half-finished ones. Depth over breadth for the finale.` },
      ],
    },
    {
      id: "d56", date: "2027-01-31", week: "w19", title: "Grand retro & next-project plan",
      theme: "Close the journey; capture what you learned and where you go next.",
      tasks: [
        { id: "t1", carried: "d55", obj: F, cat: "code", est: 35, group: "g1-d55",
          label: `Add a <code>pytest</code> happy-path + one failure test for the gateway; write a short README with a run command and an architecture line. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `write a short README with a run command and an architecture line.` },
          ] },
        { id: "t2", carried: "d55", obj: R, cat: "project", est: 50, optional: true,
          label: `<b>Bonus:</b> dockerize both services with a <code>docker-compose.yml</code> so the whole thing comes up with one command.` },
        { id: "t3", obj: R, cat: "review", est: 65, group: "g1",
          label: `Write the one-page map: the Rust ideas you'll reuse (ownership, traits, concurrency, async) and the FastAPI ideas (DI, security, async DB). Note the 2–3 you'd re-read first.`,
          sub: [
            { id: "s1", est: 25, label: `Write the one-page map: the Rust ideas you'll reuse (ownership, traits, concurrency, async).` },
            { id: "s2", est: 20, label: `the FastAPI ideas (DI, security, async DB).` },
            { id: "s3", est: 20, label: `Note the 2–3 you'd re-read first.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 After here: async depth (<a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio</a> + the <a href="https://rust-lang.github.io/async-book/" target="_blank" rel="noopener">Async Book</a>), the <a href="https://doc.rust-lang.org/nomicon/" target="_blank" rel="noopener">Nomicon</a> for unsafe, and a real FastAPI service with a queue. You have the fundamentals; now build something you'll keep.` },
      ],
    },
    {
      id: "d57", date: "2027-02-02", week: "w19", title: "Grand retro & next-project plan (cont.)",
      theme: "Finish “Grand retro & next-project plan” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d56", obj: F, cat: "review", est: 45, group: "g1-d56",
          label: `Pick the <b>one</b> next real project (a service you actually want) and write its first three tasks while the momentum is hot. Momentum beats a clean stop. 🎉 The two-book core is complete.`,
          sub: [
            { id: "s1", est: 25, label: `Pick the <b>one</b> next real project (a service you actually want).` },
            { id: "s2", est: 20, label: `write its first three tasks while the momentum is hot. Momentum beats a clean stop. 🎉 The two-book core is complete.` },
          ] },
      ],
    },

    /* ---------------- Week 20 ---------------- */
    {
      id: "d58", date: "2027-02-03", week: "w20", title: "New book: Rust Web Programming (3rd ed.)",
      theme: "A new arc begins — the Rust Book's web/async ideas, applied end-to-end. Set up, then meet the book's plan.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 80,
          label: `<b>Orientation:</b> read the Preface & the intro to <b>Ch1 A Quick Introduction to Rust</b> — how the book grows one to-do app into <b>nanoservices</b> (async server → frontend → WASM → Postgres → auth → Redis → logging). Skim the whole table of contents so the destination is clear.`,
          sub: [
            { id: "s1", est: 40, label: `Read the Preface + Ch1 opener; note the nanoservices end-state.` },
            { id: "s2", est: 40, label: `Skim the 13-chapter map so you know where each piece lands.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 25,
          label: `<b>Set up the workspace:</b> confirm your toolchain (<code>rustc</code>/<code>cargo</code> current, <code>rustup update</code>), install <code>rust-analyzer</code>, and create a fresh <code>rust-web-programming/</code> repo you'll grow chapter by chapter. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Verify <code>rustc --version</code> &amp; <code>cargo --version</code>; <code>rustup update stable</code>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `📖 This book is a local EPUB — tasks reference it by <b>chapter &amp; section name</b>, not URL. Official-doc links are added only as optional "go deeper" supplements.` },
        { id: "s2", type: "hint", label: `💡 You already finished The Rust Book — Ch1 here is a fast review. Don't grind it; confirm what's rusty and move on.` },
      ],
      note: "Kickoff — three sessions a week from here to the end of the 3rd edition, each one card long.",
    },
    {
      id: "d59", date: "2027-02-05", week: "w20", title: "Ch1 review — types, collections, errors",
      theme: "Fast confirm-only pass over the fundamentals, framed for web code.",
      tasks: [
        { id: "t1", carried: "d58", obj: "rwp", cat: "code", est: 25,
          label: `<b>Set up the workspace:</b> confirm your toolchain (<code>rustc</code>/<code>cargo</code> current, <code>rustup update</code>), install <code>rust-analyzer</code>, and create a fresh <code>rust-web-programming/</code> repo you'll grow chapter by chapter. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Init the repo + a <code>.gitignore</code> (<code>/target</code>, <code>.env</code>); first commit.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch1</b>: skim <i>data types &amp; variables</i>, <i>strings</i>, <i>integers/floats</i>, <i>arrays</i>, <i>enums</i>, <i>vectors</i>, <i>HashMaps</i>, and <i>handling results &amp; errors</i>. You know these — read for the book's web-flavoured examples.`,
          sub: [
            { id: "s1", est: 20, label: `Types, strings, ints/floats, arrays.` },
            { id: "s2", est: 30, label: `Enums, vectors, HashMaps, <code>Result</code>/error handling.` },
          ] },
        { id: "t3", obj: "rwp", cat: "review", est: 30,
          label: `Do the chapter's <b>Questions</b> section and check your answers; jot the 1–2 idioms the book uses that you'd not have reached for.`,
          sub: [
            { id: "s1", est: 20, label: `Work the Ch1 Questions.` },
            { id: "s2", est: 10, label: `Note book-specific idioms to reuse.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Treat Ch1/Ch2 as a warm-up ramp — the real work starts at Ch3 when the project is scaffolded.` },
      ],
    },
    {
      id: "d60", date: "2027-02-06", week: "w20", title: "Ch1 review — ownership, lifetimes, structs",
      theme: "The borrow-checker half of the review — the part that matters most for the server.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch1</b>: <i>controlling variable ownership</i> — copying vs moving, immutable/mutable borrowing, <i>scopes</i>, <i>lifetimes</i>, and <i>building structs</i>. Confirm the mental model before the app leans on it hard.`,
          sub: [
            { id: "s1", est: 30, label: `Copy/move, immutable &amp; mutable borrows, scopes.` },
            { id: "s2", est: 30, label: `Lifetimes &amp; building structs.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Rustier lifetimes refresher (optional): <a href="https://doc.rust-lang.org/nomicon/lifetimes.html" target="_blank" rel="noopener">Nomicon — Lifetimes</a>.` },
      ],
    },

    /* ---------------- Week 21 ---------------- */
    {
      id: "d61", date: "2027-02-10", week: "w21", title: "Ch2 — traits & macros for the web",
      theme: "Patterns the whole book leans on: trait-based verification and macro metaprogramming.",
      tasks: [
        { id: "t1", carried: "d60", obj: "rwp", cat: "code", est: 40,
          label: `Quick drill: write a <code>struct</code> with a borrowed field and a method returning a reference, and make the lifetime annotations compile — the shape you'll see all over the DAL.`,
          sub: [
            { id: "s1", est: 20, label: `Struct with a <code>&amp;str</code> field + a lifetime.` },
            { id: "s2", est: 20, label: `A method returning a borrowed field; make it compile.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch2 Useful Rust Patterns</b>: <i>verifying with traits</i> and <i>metaprogramming with macros</i> — how the book uses traits as a compile-time contract and <code>macro_rules!</code> to cut boilerplate.`,
          sub: [
            { id: "s1", est: 30, label: `Verifying with traits (trait-as-contract).` },
            { id: "s2", est: 30, label: `Metaprogramming with macros — <code>macro_rules!</code> basics.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This chapter is the "why" behind a lot of later code — when a struct "just knows" it's valid, it's this trait pattern doing the work.` },
      ],
    },
    {
      id: "d62", date: "2027-02-15", week: "w21", title: "Ch2 — traits & macros for the web (cont.)",
      theme: "Finish “Ch2 — traits & macros for the web” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d61", obj: "rwp", cat: "code", est: 60,
          label: `Build the chapter's trait-verification example; then write a tiny declarative macro of your own and expand it with <code>cargo expand</code> to see what it generates.`,
          sub: [
            { id: "s1", est: 35, label: `Implement the trait-verification pattern.` },
            { id: "s2", est: 25, label: `Write a small <code>macro_rules!</code>; inspect with <code>cargo expand</code>.` },
          ] },
      ],
    },
    {
      id: "d63", date: "2027-02-16", week: "w21", title: "Ch2 — messages, config traits, typed state",
      theme: "Finish the patterns: macro-mapped messages and compiler-enforced struct state.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch2</b>: <i>mapping messages with macros</i>, <i>configuring our functions with traits</i>, and <i>checking struct state with the compiler</i> (the typestate pattern).`,
          sub: [
            { id: "s1", est: 20, label: `Mapping messages with macros.` },
            { id: "s2", est: 30, label: `Trait-configured functions + compiler-checked struct state.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Typestate = "make illegal states unrepresentable." You'll recognise it later when the auth flow refuses to serialise an unverified user.` },
      ],
    },

    /* ---------------- Week 22 ---------------- */
    {
      id: "d64", date: "2027-02-18", week: "w22", title: "Ch2 — messages, config traits, typed state (cont.)",
      theme: "Finish “Ch2 — messages, config traits, typed state” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d63", obj: "rwp", cat: "code", est: 55,
          label: `Implement the <b>typestate</b> example so an invalid transition won't compile; prove it by trying a bad call and reading the error.`,
          sub: [
            { id: "s1", est: 35, label: `Build the typestate struct (state as a type parameter).` },
            { id: "s2", est: 20, label: `Attempt an illegal transition; confirm it fails to compile.` },
          ] },
      ],
    },
    {
      id: "d65", date: "2027-02-19", week: "w22", title: "Ch3 — Cargo, deeper",
      theme: "Managing a real multi-crate project with Cargo — the toolbox for everything ahead.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch3 Designing Your Web Application in Rust</b>: <i>managing a software project with Cargo</i> — basic compilation, building with Cargo, shipping crates, documenting, and interacting with Cargo.`,
          sub: [
            { id: "s1", est: 30, label: `Compilation model + building/shipping crates.` },
            { id: "s2", est: 20, label: `Documenting (<code>cargo doc</code>) &amp; interacting with Cargo.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Reference: <a href="https://doc.rust-lang.org/cargo/reference/workspaces.html" target="_blank" rel="noopener">Cargo — Workspaces</a>.` },
      ],
    },
    {
      id: "d66", date: "2027-02-20", week: "w22", title: "Ch3 — nanoservices structure",
      theme: "The book's architecture: splitting the app into small, sharply-scoped services.",
      tasks: [
        { id: "t1", carried: "d65", obj: "rwp", cat: "code", est: 55,
          label: `Set up a Cargo <b>workspace</b> with a couple of member crates (the seed of the nanoservices layout); generate and open the docs.`,
          sub: [
            { id: "s1", est: 35, label: `Create a workspace + 2 member crates.` },
            { id: "s2", est: 20, label: `<code>cargo doc --open</code>; skim the generated site.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch3</b>: <i>structuring code through nanoservices</i>, <i>building to-do structs</i>, and <i>managing structs with an API</i> — the layered core/networking split the rest of the book builds on.`,
          sub: [
            { id: "s1", est: 30, label: `The nanoservices structure &amp; layering.` },
            { id: "s2", est: 20, label: `To-do structs + managing them with an API.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 "Nanoservice" here = a crate with one job and a clean boundary. Keep the <b>core</b> (logic) ignorant of the <b>networking</b> and <b>storage</b> layers — that separation is the whole design.` },
      ],
    },

    /* ---------------- Week 23 ---------------- */
    {
      id: "d67", date: "2027-02-24", week: "w23", title: "Ch3 — the Data Access Layer",
      theme: "A storage boundary the rest of the app talks to — swappable later for SQLx.",
      tasks: [
        { id: "t1", carried: "d66", obj: "rwp", cat: "project", est: 60,
          label: `Scaffold the <b>to-do core</b> crate: the <code>Base</code>/<code>Pending</code>/<code>Done</code> item structs and the create/get/edit/delete API surface (in-memory for now).`,
          sub: [
            { id: "s1", est: 35, label: `Define the to-do item structs + enum states.` },
            { id: "s2", est: 25, label: `Sketch the core API functions (no storage yet).` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 40,
          label: `<b>Ch3</b>: <i>storing tasks with our Data Access Layer</i> and <i>creating a task using our DAL</i> — the trait-shaped seam between logic and persistence.`,
          sub: [
            { id: "s1", est: 20, label: `The DAL concept &amp; its trait boundary.` },
            { id: "s2", est: 20, label: `Creating a task through the DAL.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Because the DAL is a trait, Ch9's PostgreSQL swap is a new <code>impl</code>, not a rewrite. Design for that seam now.` },
      ],
    },
    {
      id: "d68", date: "2027-02-26", week: "w23", title: "Ch3 — the Data Access Layer (cont.)",
      theme: "Finish “Ch3 — the Data Access Layer” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d67", obj: "rwp", cat: "project", est: 70,
          label: `Build a file/JSON-backed DAL behind a trait, and wire "create task" end-to-end through core → DAL. This trait is what Ch9 swaps for Postgres.`,
          sub: [
            { id: "s1", est: 35, label: `Define the DAL trait + a JSON-file implementation.` },
            { id: "s2", est: 35, label: `Wire create/read task through core → DAL; test by hand.` },
          ] },
      ],
    },
    {
      id: "d69", date: "2027-02-28", week: "w23", title: "Checkpoint — foundations solid",
      theme: "Catch up and make sure the scaffolding is real before the async server lands.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 50,
          label: `<b>Consolidation:</b> re-run everything from Ch2–Ch3; make sure the workspace builds, the to-do core + DAL create/read a task, and your notes capture the traits/macros patterns.`,
          sub: [
            { id: "s1", est: 25, label: `<code>cargo build</code> clean across the workspace; DAL create/read works.` },
            { id: "s2", est: 25, label: `One-page notes: nanoservices layout + the DAL trait seam.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35, optional: true,
          label: `<b>If caught up:</b> add a couple of unit tests around the core API (create then get returns it). Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Nothing new today by design — a light week keeps the four-and-a-half-month RWP run sustainable.` },
      ],
      note: "Light checkpoint day.",
    },

    /* ---------------- Week 24 ---------------- */
    {
      id: "d70", date: "2027-03-05", week: "w24", title: "Ch4 — Async Rust, the book's way",
      theme: "You met async in The Book; here it's applied to build a task queue and a server.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch4 Async Rust</b>: <i>understanding asynchronous programming</i> and <i>understanding async and await</i> — the futures/poll model, refreshed with the book's framing.`,
          sub: [
            { id: "s1", est: 30, label: `Async programming model; why it beats a thread-per-conn.` },
            { id: "s2", est: 20, label: `<code>async</code>/<code>.await</code> &amp; the <code>Future</code> state machine.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Implement the chapter's <b>own async task queue</b> — spawn futures, await results — to feel the runtime before <code>tokio</code> hides it. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Build the hand-rolled async task queue.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Runtime it wraps: <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio tutorial</a>. You built a tokio server in the async-Rust weeks — this reuses that muscle.` },
      ],
    },
    {
      id: "d71", date: "2027-03-06", week: "w24", title: "Ch4 — tokio & a Hyper server",
      theme: "From hand-rolled futures to a real async runtime and a raw HTTP server.",
      tasks: [
        { id: "t1", carried: "d70", obj: "rwp", cat: "code", est: 25,
          label: `Implement the chapter's <b>own async task queue</b> — spawn futures, await results — to feel the runtime before <code>tokio</code> hides it. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Drive it: enqueue N tasks, await all, print results.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch4</b>: <i>exploring high-level concepts of tokio</i> and <i>implementing a HTTP server in Hyper</i> — the async stack the app's networking layer sits on.`,
          sub: [
            { id: "s1", est: 30, label: `tokio high-level concepts (tasks, runtime, <code>spawn</code>).` },
            { id: "s2", est: 20, label: `A minimal <code>hyper</code> HTTP server.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://hyper.rs/guides/1/" target="_blank" rel="noopener">Hyper 1.0 guides</a>. Hyper is the low-level HTTP the ergonomic frameworks are built on — the book uses it directly on purpose.` },
      ],
    },
    {
      id: "d72", date: "2027-03-09", week: "w24", title: "Ch4 — tokio & a Hyper server (cont.)",
      theme: "Finish “Ch4 — tokio & a Hyper server” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d71", obj: "rwp", cat: "project", est: 65,
          label: `Stand up the <b>Hyper server</b> from the chapter: bind a port, answer a hello route async. This is the networking-layer seed for Ch5–6.`,
          sub: [
            { id: "s1", est: 40, label: `Build &amp; run the hyper server; curl the route.` },
            { id: "s2", est: 25, label: `Confirm concurrent requests don't block each other.` },
          ] },
      ],
    },

    /* ---------------- Week 25 ---------------- */
    {
      id: "d73", date: "2027-03-10", week: "w25", title: "Ch5 — serving the to-do core",
      theme: "Wire the async server to the to-do core: a real API surface starts to form.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 40,
          label: `<b>Ch5 Handling HTTP Requests</b>: <i>launching a basic web server</i> and <i>connecting the core to the server</i> — routing requests into the core API from Ch3.`,
          sub: [
            { id: "s1", est: 20, label: `Launch the basic web server (routing skeleton).` },
            { id: "s2", est: 20, label: `Connect the to-do core to the server.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Route <code>GET</code> requests through the server into the core and return the to-do list as JSON. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Wire a route → core → response.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://serde.rs/" target="_blank" rel="noopener">Serde</a> — the (de)serialisation crate every JSON route here uses.` },
      ],
    },
    {
      id: "d74", date: "2027-03-11", week: "w25", title: "Ch5 — serving items & error handling",
      theme: "Refactor to-do items into the response and give endpoints real error handling.",
      tasks: [
        { id: "t1", carried: "d73", obj: "rwp", cat: "project", est: 25,
          label: `Route <code>GET</code> requests through the server into the core and return the to-do list as JSON. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Serialise the item list to JSON (<code>serde</code>).` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch5</b>: <i>refactoring our to-do items</i>, <i>serving our to-do items</i>, and <i>handling errors in API endpoints</i> — turning ad-hoc handlers into a clean, fallible API.`,
          sub: [
            { id: "s1", est: 30, label: `Refactor + serve to-do items.` },
            { id: "s2", est: 20, label: `Error handling in API endpoints.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Modelling errors as a type (then mapping to status) is the same instinct as FastAPI's <code>HTTPException</code> — one place decides how failure looks to clients.` },
      ],
    },
    {
      id: "d75", date: "2027-03-14", week: "w25", title: "Ch5 — serving items & error handling (cont.)",
      theme: "Finish “Ch5 — serving items & error handling” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d74", obj: "rwp", cat: "project", est: 60,
          label: `Give the API a typed error → HTTP-status mapping (a custom error enum → <code>4xx/5xx</code>), so a bad request returns a clean status, not a panic.`,
          sub: [
            { id: "s1", est: 35, label: `Define an API error enum + <code>into_response</code> mapping.` },
            { id: "s2", est: 25, label: `Prove a bad path returns the right status.` },
          ] },
      ],
    },

    /* ---------------- Week 26 ---------------- */
    {
      id: "d76", date: "2027-03-18", week: "w26", title: "Ch6 — params & POST bodies",
      theme: "Read data out of requests: URL params and JSON bodies.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 40,
          label: `<b>Ch6 Processing HTTP Requests</b>: <i>passing parameters via the URL</i> and <i>passing data via a POST body</i> — extracting and validating input.`,
          sub: [
            { id: "s1", est: 20, label: `URL parameters (path + query).` },
            { id: "s2", est: 20, label: `POST body → deserialised, validated struct.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 65,
          label: `Add <b>create</b> (POST a new to-do from a JSON body) and a filtered <b>list</b> (query param) to the API; validate the body with the trait pattern from Ch2.`,
          sub: [
            { id: "s1", est: 40, label: `POST create from a JSON body.` },
            { id: "s2", est: 25, label: `Query-param filtered list.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Reuse your Ch2 trait-verification here so an invalid body can't reach the core — validation at the edge.` },
      ],
    },
    {
      id: "d77", date: "2027-03-19", week: "w26", title: "Ch6 — PUT, DELETE & headers",
      theme: "Round out the verbs and read request headers (the seam auth uses later).",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 40,
          label: `<b>Ch6</b>: <i>deleting resources using the DELETE method</i>, <i>updating resources using the PUT method</i>, and <i>extracting data from HTTP request headers</i>.`,
          sub: [
            { id: "s1", est: 20, label: `DELETE + PUT handlers.` },
            { id: "s2", est: 20, label: `Reading request headers.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 60,
          label: `Complete the CRUD verbs (edit + delete a to-do) and read a custom header in a handler — the hook Ch10's JWT will plug into.`,
          sub: [
            { id: "s1", est: 35, label: `PUT edit + DELETE remove, end-to-end.` },
            { id: "s2", est: 25, label: `Read a header (e.g. a fake token) in a handler.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Full CRUD now works over HTTP against the core + DAL — the backend is functionally complete before any frontend or database.` },
      ],
    },
    {
      id: "d78", date: "2027-03-23", week: "w26", title: "Checkpoint — the backend API",
      theme: "Prove the whole backend with curl before turning to the browser.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 50,
          label: `<b>Consolidation:</b> exercise every endpoint with curl — create, list, filter, edit, delete — and confirm error paths return clean statuses. Write the API down as a short reference.`,
          sub: [
            { id: "s1", est: 30, label: `curl each verb; confirm happy + error responses.` },
            { id: "s2", est: 20, label: `One-page API reference (routes, bodies, statuses).` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35, optional: true,
          label: `<b>If caught up:</b> add a couple of integration tests hitting the running server. Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Half the book done. The backend nanoservice is real; Ch7 gives it a face.` },
      ],
      note: "Light checkpoint day.",
    },

    /* ---------------- Week 27 ---------------- */
    {
      id: "d79", date: "2027-03-27", week: "w27", title: "Ch7 — serving a frontend from Rust",
      theme: "The app grows a browser face: dev setup and serving static assets from Rust.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch7 Displaying Content in the Browser</b>: <i>building out the development setup</i> and <i>serving frontend from Rust</i> — how the Rust server ships HTML/JS to the browser.`,
          sub: [
            { id: "s1", est: 30, label: `Frontend dev setup (build tooling).` },
            { id: "s2", est: 20, label: `Serving the frontend from the Rust server.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 55,
          label: `Serve an <code>index.html</code> + bundle from the Hyper server and load it in the browser; confirm the static route and the API route coexist.`,
          sub: [
            { id: "s1", est: 35, label: `Static-file route from Rust; load the page.` },
            { id: "s2", est: 20, label: `Confirm API + static routes both respond.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 One Rust process serving both the API and the static frontend is the book's deployment simplicity — no separate web server yet.` },
      ],
    },
    {
      id: "d80", date: "2027-03-28", week: "w27", title: "Ch7 — React components on the API",
      theme: "A real component UI talking to the Rust backend.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch7</b>: <i>connecting backend API endpoints to the frontend</i> and <i>creating React components</i> — fetching from the API and rendering the to-do list.`,
          sub: [
            { id: "s1", est: 30, label: `Wiring fetch calls to the API endpoints.` },
            { id: "s2", est: 30, label: `Creating the React components.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 If React is new-ish, don't rabbit-hole — the book keeps the JS minimal on purpose; the interesting part is the Rust it talks to.` },
      ],
    },
    {
      id: "d81", date: "2027-03-29", week: "w27", title: "Ch7 — React components on the API (cont.)",
      theme: "Finish “Ch7 — React components on the API” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d80", obj: "rwp", cat: "project", est: 65,
          label: `Build the to-do list + add-item components against your live API; create, toggle and delete from the browser.`,
          sub: [
            { id: "s1", est: 40, label: `List + add-item components calling the API.` },
            { id: "s2", est: 25, label: `Toggle/delete wired to PUT/DELETE.` },
          ] },
      ],
    },

    /* ---------------- Week 28 ---------------- */
    {
      id: "d82", date: "2027-03-31", week: "w28", title: "Ch7 — styling the app",
      theme: "Make it presentable, then close out the frontend chapter.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 40,
          label: `<b>Ch7</b>: <i>inserting styles with CSS</i> — structuring the stylesheet and wiring it into the served frontend.`,
          sub: [
            { id: "s1", est: 20, label: `CSS structure + serving it from Rust.` },
            { id: "s2", est: 20, label: `Apply styles to the components.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 55,
          label: `Style the to-do UI into something you'd screenshot; verify the full create→render→edit→delete loop looks and works right.`,
          sub: [
            { id: "s1", est: 35, label: `Style the list, form, and item states.` },
            { id: "s2", est: 20, label: `Full-loop smoke test in the browser.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Milestone in sight: after Ch8 you'll have a styled, Rust-served, WASM-accelerated frontend on a real async backend.` },
      ],
    },
    {
      id: "d83", date: "2027-04-01", week: "w28", title: "Ch8 — Rust in the browser (WASM) I",
      theme: "The hard, fun chapter: compile Rust to WebAssembly and run it in the page.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch8 Injecting Rust in the Frontend with WASM</b>: <i>setting up our WASM build</i> and <i>loading WASM in the front-end</i> / <i>on the local machine</i>.`,
          sub: [
            { id: "s1", est: 30, label: `WASM build setup (<code>wasm-pack</code>/<code>wasm-bindgen</code>).` },
            { id: "s2", est: 20, label: `Loading the WASM module in the front-end.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Get a trivial Rust function compiled to WASM and called from the page's JS — the toolchain working end-to-end before the real kernel. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Build a hello-WASM crate; call it from JS.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://rustwasm.github.io/docs/book/" target="_blank" rel="noopener">The rustwasm Book</a> &amp; <a href="https://rustwasm.github.io/wasm-pack/" target="_blank" rel="noopener">wasm-pack</a> — reach for these if the build fights you.` },
      ],
    },
    {
      id: "d84", date: "2027-04-02", week: "w28", title: "Ch8 — WASM kernel & library",
      theme: "Grow the WASM from toy to a real, reusable module.",
      tasks: [
        { id: "t1", carried: "d83", obj: "rwp", cat: "project", est: 25,
          label: `Get a trivial Rust function compiled to WASM and called from the page's JS — the toolchain working end-to-end before the real kernel. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Confirm it loads locally + in the served page.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch8</b>: <i>building a WASM kernel</i> and <i>building a WASM library</i> — structuring the Rust-in-browser code as something the frontend can lean on. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Building the WASM kernel.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The payoff: shared Rust logic on both sides of the wire — the same validation the server trusts can run in the browser.` },
      ],
    },

    /* ---------------- Week 29 ---------------- */
    {
      id: "d85", date: "2027-04-07", week: "w29", title: "Ch8 — WASM kernel & library (cont.)",
      theme: "Finish “Ch8 — WASM kernel & library” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d84", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch8</b>: <i>building a WASM kernel</i> and <i>building a WASM library</i> — structuring the Rust-in-browser code as something the frontend can lean on. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Building the WASM library.` },
          ] },
        { id: "t2", carried: "d84", obj: "rwp", cat: "project", est: 60,
          label: `Move a piece of real logic (e.g. client-side validation or filtering) into the WASM library and call it from the components.`,
          sub: [
            { id: "s1", est: 35, label: `Implement the WASM library function.` },
            { id: "s2", est: 25, label: `Call it from React; verify in the browser.` },
          ] },
      ],
    },
    {
      id: "d86", date: "2027-04-10", week: "w29", title: "Ch8 — the WASM client",
      theme: "Tie the WASM into a proper client layer the app uses.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 40,
          label: `<b>Ch8</b>: <i>building a WASM client</i> — wrapping the WASM library into the frontend's data/client layer.`,
          sub: [
            { id: "s1", est: 20, label: `Designing the WASM client wrapper.` },
            { id: "s2", est: 20, label: `Integrating it into the frontend flow.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 60,
          label: `Wire the WASM client into the to-do UI so a user action flows through Rust-in-the-browser; confirm the full frontend still works.`,
          sub: [
            { id: "s1", est: 35, label: `Route a UI action through the WASM client.` },
            { id: "s2", est: 25, label: `Regression-check the whole frontend loop.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Frontend chapters done: a styled React UI, served from Rust, with Rust/WASM in the browser. Next it gets a real database.` },
      ],
    },
    {
      id: "d87", date: "2027-04-11", week: "w29", title: "Checkpoint — the full-stack app",
      theme: "Step back: the whole app runs, browser to backend. Catch up before Postgres.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 50,
          label: `<b>Consolidation:</b> run the entire stack — React UI → Rust server → core → JSON DAL — and confirm every feature. Capture the architecture as a one-page diagram.`,
          sub: [
            { id: "s1", est: 25, label: `Full end-to-end run of every feature.` },
            { id: "s2", est: 25, label: `Draw the current architecture (layers + data flow).` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35, optional: true,
          label: `<b>If caught up:</b> tidy the workspace — clippy pass, remove dead code, commit a clean checkpoint. Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 The JSON DAL was always temporary scaffolding — Ch9 replaces it with real PostgreSQL, and the trait seam makes that a swap, not a rewrite.` },
      ],
      note: "Light checkpoint day.",
    },

    /* ---------------- Week 30 ---------------- */
    {
      id: "d88", date: "2027-04-15", week: "w30", title: "Ch9 — PostgreSQL in Docker",
      theme: "Real persistence begins: a database, containerised, wired to routing.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch9 Data Persistence with PostgreSQL</b>: <i>why a proper database</i>, <i>why Docker</i>, <i>running a database in Docker</i>, <i>routing &amp; ports</i>, and <i>running it in the background with bash scripts</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Why a DB + why Docker; docker networking/ports.` },
            { id: "s2", est: 20, label: `Bash scripts to run Postgres in the background.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 55,
          label: `Stand up PostgreSQL in Docker with a start/stop script and connect to it from <code>psql</code>; confirm the container + port routing.`,
          sub: [
            { id: "s1", est: 35, label: `Docker Postgres up via a script; connect with <code>psql</code>.` },
            { id: "s2", est: 20, label: `Confirm host↔container port routing.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">Docker get-started</a> if the container basics are rusty.` },
      ],
    },
    {
      id: "d89", date: "2027-04-19", week: "w30", title: "Ch9 — SQLx & database transactions",
      theme: "Swap the JSON DAL for real SQL behind the same trait.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch9</b>: <i>adding SQLX to our Data Access Layer</i>, <i>defining our database transactions</i>, and <i>connecting our transactions to the core</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Adding SQLx to the DAL.` },
            { id: "s2", est: 30, label: `Defining DB transactions + connecting to core.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://docs.rs/sqlx" target="_blank" rel="noopener">SQLx</a> — note the compile-time query checking; it catches SQL typos at <code>cargo build</code>.` },
      ],
    },
    {
      id: "d90", date: "2027-04-20", week: "w30", title: "Ch9 — SQLx & database transactions (cont.)",
      theme: "Finish “Ch9 — SQLx & database transactions” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d89", obj: "rwp", cat: "project", est: 65,
          label: `Implement the DAL trait against Postgres with <code>sqlx</code> (compile-time-checked queries) and route create/read/update/delete through it.`,
          sub: [
            { id: "s1", est: 40, label: `SQLx <code>impl</code> of the DAL trait (real queries).` },
            { id: "s2", est: 25, label: `CRUD flows through core → SQLx DAL.` },
          ] },
      ],
    },

    /* ---------------- Week 31 ---------------- */
    {
      id: "d91", date: "2027-04-21", week: "w31", title: "Ch9 — migrations & frontend refactor",
      theme: "Version the schema and reconnect the browser to the persistent backend.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch9</b>: <i>connecting our transactions to the server</i>, <i>creating our database migrations</i>, and <i>refactoring our frontend</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Transactions → server; creating migrations.` },
            { id: "s2", est: 20, label: `Refactoring the frontend for the DB-backed API.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Add SQLx migrations (schema as versioned files), run them on startup, and confirm the React app now reads/writes real Postgres rows that survive a restart. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Write + run migrations; schema created on boot.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Migrations are the honest way to evolve a schema — never hand-edit prod tables. Same discipline as Alembic in the FastAPI world.` },
      ],
    },
    {
      id: "d92", date: "2027-04-25", week: "w31", title: "Checkpoint — it persists",
      theme: "Confirm the persistence layer is solid before authentication complicates things.",
      tasks: [
        { id: "t1", carried: "d91", obj: "rwp", cat: "project", est: 25,
          label: `Add SQLx migrations (schema as versioned files), run them on startup, and confirm the React app now reads/writes real Postgres rows that survive a restart. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Browser create → restart container → data persists.` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 45,
          label: `<b>Consolidation:</b> verify the DB-backed app fully — migrations reproducible from scratch, CRUD survives restarts, and the JSON DAL is gone. Note anything flaky.`,
          sub: [
            { id: "s1", est: 25, label: `Drop &amp; recreate via migrations; full CRUD works.` },
            { id: "s2", est: 20, label: `Confirm restart-persistence; list open questions.` },
          ] },
        { id: "t3", obj: "rwp", cat: "code", est: 35, optional: true,
          label: `<b>If caught up:</b> add a DB integration test (insert → query) using a throwaway test database. Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 The app is a real persistent full-stack service now. Ch10–13 make it multi-user, multi-server, cached, and observable.` },
      ],
      note: "Light checkpoint day.",
    },
    {
      id: "d93", date: "2027-04-26", week: "w31", title: "Ch10 — the auth server & passwords",
      theme: "A second nanoservice appears: authentication, starting with safe password storage.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch10 Managing User Sessions</b>: <i>building our auth server</i> (data-access / core / networking layers), <i>defining our user data model</i>, and <i>storing &amp; verifying passwords</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Auth server's three layers + user data model.` },
            { id: "s2", est: 30, label: `Storing &amp; verifying passwords (hashing).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 The auth server mirrors the to-do server's layering — same nanoservice shape, different job. That symmetry is the point.` },
      ],
    },

    /* ---------------- Week 32 ---------------- */
    {
      id: "d94", date: "2027-05-01", week: "w32", title: "Ch10 — the auth server & passwords (cont.)",
      theme: "Finish “Ch10 — the auth server & passwords” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d93", obj: "rwp", cat: "project", est: 60,
          label: `Scaffold the <b>auth</b> nanoservice with its own DAL/core/networking, a user table, and password hashing + verification.`,
          sub: [
            { id: "s1", est: 35, label: `Auth crate skeleton (three layers) + user model.` },
            { id: "s2", est: 25, label: `Hash on store, verify on check; never store plaintext.` },
          ] },
      ],
    },
    {
      id: "d95", date: "2027-05-03", week: "w32", title: "Ch10 — users & JWT",
      theme: "Create users, then build the JWT machinery that proves who they are.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch10</b>: <i>creating users</i> (DB transaction, core endpoint, networking endpoint) and <i>refactoring/restructuring our JWT</i> — <i>get-key</i>, <i>encoding</i>, and <i>decoding the token</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Create-user across DB tx → core → networking.` },
            { id: "s2", est: 30, label: `JWT: get-key, encode, decode.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://docs.rs/jsonwebtoken" target="_blank" rel="noopener">jsonwebtoken</a> — the crate behind the encode/decode; mind the expiry (<code>exp</code>) claim.` },
      ],
    },
    {
      id: "d96", date: "2027-05-04", week: "w32", title: "Ch10 — login & frontend auth",
      theme: "Close the loop: a login API and a browser flow that carries the token.",
      tasks: [
        { id: "t1", carried: "d95", obj: "rwp", cat: "project", est: 60,
          label: `Implement create-user end-to-end and a JWT module that encodes a signed token and decodes/validates it; unit-test round-tripping a token.`,
          sub: [
            { id: "s1", est: 35, label: `Create-user endpoint working against Postgres.` },
            { id: "s2", est: 25, label: `JWT encode/decode module + a round-trip test.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch10</b>: <i>building our login API</i> (get user by email, core login, mount to server) and <i>adding authentication to our frontend</i> — login call, tokens on API calls, a login form wired into the app. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Login API: by-email lookup → core login → server.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Same three ideas as your FastAPI JWT work — hash, sign, verify — now in Rust across a dedicated auth service. The concepts transfer; the plumbing differs.` },
      ],
    },

    /* ---------------- Week 33 ---------------- */
    {
      id: "d97", date: "2027-05-05", week: "w33", title: "Ch10 — login & frontend auth (cont.)",
      theme: "Finish “Ch10 — login & frontend auth” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d96", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch10</b>: <i>building our login API</i> (get user by email, core login, mount to server) and <i>adding authentication to our frontend</i> — login call, tokens on API calls, a login form wired into the app. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Frontend: login call, attach token, login form.` },
          ] },
        { id: "t2", carried: "d96", obj: "rwp", cat: "project", est: 65,
          label: `Wire login end-to-end: submit the form → get a JWT → attach it to subsequent API calls → a protected route accepts it and rejects a missing/expired one.`,
          sub: [
            { id: "s1", est: 40, label: `Login form → token → authenticated API calls.` },
            { id: "s2", est: 25, label: `Protected route: 200 with token, 401 without.` },
          ] },
      ],
    },
    {
      id: "d98", date: "2027-05-06", week: "w33", title: "Ch11 — servers talking to servers",
      theme: "The to-do service asks the auth service who a user is — real inter-service calls.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch11 Communicating Between Servers</b>: <i>getting users from auth with a unique ID</i> (adding get-by-unique-id to dal / core / networking) and <i>making auth accessible to other servers</i>.`,
          sub: [
            { id: "s1", est: 30, label: `get-by-unique-id through dal → core → networking.` },
            { id: "s2", est: 20, label: `Exposing auth so other servers can call it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 This is the "micro/nano-service tax" made concrete: a boundary you now cross over HTTP. Ch12 caches it so you don't pay every request.` },
      ],
    },
    {
      id: "d99", date: "2027-05-08", week: "w33", title: "Ch11 — servers talking to servers (cont.)",
      theme: "Finish “Ch11 — servers talking to servers” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d98", obj: "rwp", cat: "project", est: 60,
          label: `Add a get-user-by-id path to the auth service and expose it; have the to-do service call auth over HTTP to resolve a token's user.`,
          sub: [
            { id: "s1", est: 35, label: `Auth exposes get-by-id; to-do calls it.` },
            { id: "s2", est: 25, label: `Resolve the JWT's user via a real inter-service request.` },
          ] },
      ],
    },

    /* ---------------- Week 34 ---------------- */
    {
      id: "d100", date: "2027-05-13", week: "w34", title: "Ch11 — tethering users to items",
      theme: "Ownership: to-do items belong to users, threaded through every layer.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch11</b>: <i>tethering users to to-do items</i> — linking items to users in the database and adding user IDs to data-access, core, and networking functions; plus <i>testing server-to-server communication with bash</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Link items→users in the DB; user IDs through the layers.` },
            { id: "s2", est: 20, label: `Bash test of the two servers cooperating.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Add a <code>user_id</code> to the to-do schema (migration) and scope every query to the authenticated user; verify with a two-server bash test that users only see their own items. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Migration + user-scoped queries end-to-end.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Multi-user + multi-server now works. Two chapters left in the 3rd-ed EPUB: caching (Ch12) and observability (Ch13).` },
      ],
    },
    {
      id: "d101", date: "2027-05-16", week: "w34", title: "Ch12 — caching with Redis",
      theme: "Stop hitting the auth server every request: cache sessions in Redis.",
      tasks: [
        { id: "t1", carried: "d100", obj: "rwp", cat: "project", est: 25,
          label: `Add a <code>user_id</code> to the to-do schema (migration) and scope every query to the authenticated user; verify with a two-server bash test that users only see their own items. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Bash test: user A can't see user B's items.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch12 Caching Auth Sessions</b>: <i>what is caching</i>, <i>setting up Redis</i>, <i>building our Redis module</i>, and <i>defining the user session</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Caching concepts; Redis set-up (Docker).` },
            { id: "s2", est: 20, label: `The Redis module + user-session shape.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 <a href="https://docs.rs/redis" target="_blank" rel="noopener">redis crate</a>. Cache invalidation is the hard part — watch how the book handles logout/update next.` },
      ],
    },
    {
      id: "d102", date: "2027-05-17", week: "w34", title: "Ch12 — caching with Redis (cont.)",
      theme: "Finish “Ch12 — caching with Redis” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d101", obj: "rwp", cat: "project", est: 60,
          label: `Run Redis in Docker alongside Postgres and build the Redis module + a typed user-session value you can store and fetch.`,
          sub: [
            { id: "s1", est: 35, label: `Redis container + connection module.` },
            { id: "s2", est: 25, label: `Store/fetch a typed user session.` },
          ] },
      ],
    },

    /* ---------------- Week 35 ---------------- */
    {
      id: "d103", date: "2027-05-21", week: "w35", title: "Ch12 — session lifecycle & client",
      theme: "Login/logout/update flows through the cache, behind a clean client.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch12</b>: <i>building the login / logout / update processes</i> and <i>building our Redis client</i> (login-logout client, update client).`,
          sub: [
            { id: "s1", est: 30, label: `Login/logout/update cache processes.` },
            { id: "s2", est: 30, label: `The Redis client wrapping them.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The cache is the source of truth for "is this session live?" — get eviction right and logout is instant; get it wrong and it's a security bug.` },
      ],
    },
    {
      id: "d104", date: "2027-05-22", week: "w35", title: "Ch12 — session lifecycle & client (cont.)",
      theme: "Finish “Ch12 — session lifecycle & client” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d103", obj: "rwp", cat: "project", est: 60,
          label: `Implement login (write session), logout (evict), and update (refresh) against Redis behind a client; confirm a logged-out token stops working immediately.`,
          sub: [
            { id: "s1", est: 35, label: `Login/logout/update via the Redis client.` },
            { id: "s2", est: 25, label: `Verify eviction: logout invalidates the session now.` },
          ] },
      ],
    },
    {
      id: "d105", date: "2027-05-25", week: "w35", title: "Ch12 — the cache kernel",
      theme: "A shared cache boundary both servers call — the caching capstone.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch12</b>: <i>connecting our cache</i>, <i>building our cache kernel</i>, and <i>calling the kernel from the to-do server</i> and <i>from the auth server</i>.`,
          sub: [
            { id: "s1", est: 30, label: `The cache kernel abstraction.` },
            { id: "s2", est: 20, label: `Calling it from both servers.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Build the cache kernel and route both servers' session checks through it; confirm the auth service is no longer hit on a cache hit. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Cache kernel + both servers wired to it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 The kernel pattern (a shared, swappable boundary) is the same instinct as the DAL trait — one seam, many callers.` },
      ],
    },

    /* ---------------- Week 36 ---------------- */
    {
      id: "d106", date: "2027-05-26", week: "w36", title: "Ch13 — logging & middleware",
      theme: "The last chapter: see what the system is doing, via structured logging.",
      tasks: [
        { id: "t1", carried: "d105", obj: "rwp", cat: "project", est: 25,
          label: `Build the cache kernel and route both servers' session checks through it; confirm the auth service is no longer hit on a cache hit. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Measure: cache hit skips the auth round-trip.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch13 Observability through Logging</b>: <i>what are RESTful services</i>, <i>building frontend code on command</i>, <i>what is logging</i>, <i>logging via the terminal</i>, <i>defining a logger</i>, <i>creating a logging middleware</i>, and <i>integrating it into our servers</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Logging basics; define a logger + terminal logging.` },
            { id: "s2", est: 30, label: `Logging middleware; integrate into both servers.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Ecosystem standard worth knowing: <a href="https://docs.rs/tracing" target="_blank" rel="noopener">tracing</a> (structured, async-aware spans) — compare it to the book's logger.` },
      ],
    },
    {
      id: "d107", date: "2027-05-27", week: "w36", title: "Ch13 — the logging actor & DB",
      theme: "Logging to a database via an actor — concurrency you now understand.",
      tasks: [
        { id: "t1", carried: "d106", obj: "rwp", cat: "project", est: 60,
          label: `Add a logging middleware that records each request (method, path, status, latency) and wire it into the to-do and auth servers.`,
          sub: [
            { id: "s1", est: 35, label: `Request-logging middleware (method/path/status/latency).` },
            { id: "s2", est: 25, label: `Integrated across both servers; watch the logs.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch13</b>: <i>logging via a database</i>, <i>what is an actor</i>, <i>building our logging actor</i>, <i>updating logging functions</i>, and <i>configuring our logging database</i>. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `The actor model; the logging actor.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 An actor is just a task that owns some state and takes messages — your Ch4 async + Ch16 channels, combined. The whole book converges here.` },
      ],
    },
    {
      id: "d108", date: "2027-05-30", week: "w36", title: "Ch13 — the logging actor & DB (cont.)",
      theme: "Finish “Ch13 — the logging actor & DB” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d107", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch13</b>: <i>logging via a database</i>, <i>what is an actor</i>, <i>building our logging actor</i>, <i>updating logging functions</i>, and <i>configuring our logging database</i>. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Logging to a DB + configuring it.` },
          ] },
        { id: "t2", carried: "d107", obj: "rwp", cat: "project", est: 35,
          label: `Build the logging actor (a task owning the log channel) and persist logs to a database; confirm requests across both servers land as rows. 🎉 The book's content is complete. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Logging actor over a channel; DB-backed logs.` },
          ] },
      ],
    },

    /* ---------------- Week 37 ---------------- */
    {
      id: "d109", date: "2027-06-04", week: "w37", title: "Checkpoint — the whole nanoservices stack",
      theme: "Everything running together: to-do, auth, cache, logs, browser.",
      tasks: [
        { id: "t1", carried: "d107", obj: "rwp", cat: "project", est: 25,
          label: `Build the logging actor (a task owning the log channel) and persist logs to a database; confirm requests across both servers land as rows. 🎉 The book's content is complete. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Requests → log rows from both servers.` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 55,
          label: `<b>Consolidation:</b> boot the full stack — Postgres, Redis, the to-do &amp; auth servers, the React/WASM frontend, logging — and walk a user journey (register → login → CRUD → logout) watching the logs and cache behave.`,
          sub: [
            { id: "s1", est: 30, label: `Full stack up; complete a real user journey.` },
            { id: "s2", est: 25, label: `Confirm cache hits + log rows along the way.` },
          ] },
        { id: "t3", obj: "rwp", cat: "review", est: 25,
          label: `Draw the final architecture: every nanoservice, the DB/cache, and the request/response + logging flows.`,
          sub: [
            { id: "s1", est: 25, label: `Final architecture diagram (services + data stores + flows).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is the system the book set out to build. The last few days harden it and plan what's beyond the EPUB.` },
      ],
      note: "Checkpoint day — no new material, but the card is a full session of consolidation.",
    },
    {
      id: "d110", date: "2027-06-06", week: "w37", title: "Capstone I — run it like it's real",
      theme: "Treat the stack as a product: one-command boot, a clean demo path.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "project", est: 70,
          label: `Make the whole system start with one command (a <code>docker-compose</code> or a top-level script bringing up Postgres, Redis, both servers, and the frontend) and document the demo path.`,
          sub: [
            { id: "s1", est: 45, label: `One-command bring-up of the entire stack.` },
            { id: "s2", est: 25, label: `Write the demo script (register → CRUD → logout).` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 25,
          label: `List the rough edges you'd fix for "real" (secrets handling, error surfaces, missing tests) — the honest to-do for a portfolio version.`,
          sub: [
            { id: "s1", est: 25, label: `Rough-edges / hardening backlog.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 "Runs with one command and I can explain it in one sentence" is the bar for a project worth showing.` },
      ],
    },
    {
      id: "d111", date: "2027-06-07", week: "w37", title: "Capstone II — harden & document",
      theme: "Tests where they matter and a README that lets someone else run it.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "project", est: 75,
          label: `Add the highest-value tests (an auth round-trip, a user-scoped CRUD, a cache-eviction check) and write a <b>README</b>: architecture in a paragraph, run command, and the nanoservice map.`,
          sub: [
            { id: "s1", est: 40, label: `Three high-value integration tests.` },
            { id: "s2", est: 35, label: `README: architecture, run command, service map.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Pick tests that would catch a real regression (auth, ownership, eviction) over exhaustive coverage — depth over breadth for a finale.` },
      ],
    },

    /* ---------------- Week 38 ---------------- */
    {
      id: "d112", date: "2027-06-12", week: "w38", title: "Retro & what's beyond this EPUB",
      theme: "Close the arc; map the ground the print edition covers next.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 45,
          label: `Write the one-page map of what you built and the ideas you'll reuse (nanoservice layering, the DAL/kernel seams, async Hyper, WASM-on-both-sides, JWT+Redis sessions, actor logging). Note the 2–3 you'd revisit first.`,
          sub: [
            { id: "s1", est: 25, label: `What you built + the transferable patterns.` },
            { id: "s2", est: 20, label: `The 2–3 ideas to revisit first.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Natural continuations: containerise for prod, add CI, and deploy the stack — the same instincts as the FastAPI deploy track, now for Rust.` },
      ],
    },
    {
      id: "d113", date: "2027-06-13", week: "w38", title: "Buffer / overflow",
      theme: "Deliberate slack — the shock absorber for the four-and-a-half-month run.",
      tasks: [
        { id: "t1", carried: "d112", obj: "rwp", cat: "review", est: 45,
          label: `Scope what's <b>beyond</b> this EPUB (the print 3rd edition continues into <i>testing</i>, <i>deployment on AWS</i>, and <i>Docker/Kubernetes in production</i>) and pick your next concrete step.`,
          sub: [
            { id: "s1", est: 25, label: `List the next-chapter topics (testing, AWS, K8s).` },
            { id: "s2", est: 20, label: `Choose one next step and write its first 3 tasks.` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 30, optional: true,
          label: `<b>Pure buffer:</b> if any chapter's build slipped — a listing that didn't compile, a feature you stubbed, notes you meant to write — this is the day to close it, guilt-free.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 A plan with zero slack breaks on the first bad week. Nothing is required today by design. 🎉 The 3rd-edition EPUB is complete.` },
      ],
      note: "Buffer day — deliberately the lightest card of the arc.",
    },
    {
      id: "d114", date: "2027-06-15", week: "w38", title: "2nd-ed Ch9 — unit & JWT tests",
      theme: "Part B begins: the 2nd edition (2023) covers everything the 3rd-ed EPUB stopped short of. First — testing what you built.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>2nd-ed Ch9 Testing</b>: <i>building our unit tests</i> and <i>building JWT unit tests</i> — test config, JWT test requirements, basic JWT function tests. (Book is Actix/Diesel; the testing ideas map straight onto your Hyper/SQLx app.)`,
          sub: [
            { id: "s1", est: 30, label: `Unit-test structure + a test config.` },
            { id: "s2", est: 30, label: `JWT tests: requirements + basic function tests.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Write real unit tests for your app's core logic and a JWT encode/decode test; run them green. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Unit tests over the to-do core + DAL.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `📖 PART B (2026-07-21 plan): these chapters come from the <b>2nd edition</b> EPUB — the 3rd-ed EPUB ends at Ch13 (observability). Where its Actix/Diesel stack differs from your Hyper/SQLx app, it's flagged; Part 6 (Ch14–18) are standalone.` },
        { id: "s2", type: "hint", label: `💡 Test the <b>core</b> nanoservice in isolation (no HTTP) first — pure functions are the easiest, highest-value tests.` },
      ],
    },

    /* ---------------- Week 39 ---------------- */
    {
      id: "d115", date: "2027-06-16", week: "w39", title: "2nd-ed Ch9 — web-request tests & Postman",
      theme: "Test the HTTP surface, then drive it from Postman.",
      tasks: [
        { id: "t1", carried: "d114", obj: "rwp", cat: "code", est: 25,
          label: `Write real unit tests for your app's core logic and a JWT encode/decode test; run them green. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `JWT round-trip + expiry test.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch9</b>: <i>building tests for web requests</i> and <i>writing tests in Postman</i> — ordered requests and creating a test for an HTTP request.`,
          sub: [
            { id: "s1", est: 30, label: `Integration tests for web requests.` },
            { id: "s2", est: 20, label: `Postman: ordered requests + an HTTP-request test.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Postman collections double as living API docs and as the seed for the Newman CI step next.` },
      ],
    },
    {
      id: "d116", date: "2027-06-17", week: "w39", title: "2nd-ed Ch9 — web-request tests & Postman (cont.)",
      theme: "Finish “2nd-ed Ch9 — web-request tests & Postman” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d115", obj: "rwp", cat: "code", est: 60,
          label: `Add integration tests that hit your running server (create→list→auth paths), and build a Postman collection that walks a full user journey.`,
          sub: [
            { id: "s1", est: 35, label: `Server integration tests (happy + 401).` },
            { id: "s2", est: 25, label: `Postman collection: register → login → CRUD.` },
          ] },
      ],
    },
    {
      id: "d117", date: "2027-06-21", week: "w39", title: "2nd-ed Ch9 — Newman & a test pipeline",
      theme: "Automate the whole test run — the first taste of CI.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch9</b>: <i>automating Postman tests with Newman</i> and <i>building an entire automated testing pipeline</i>.`,
          sub: [
            { id: "s1", est: 20, label: `Newman: run the Postman collection headless.` },
            { id: "s2", est: 30, label: `Wiring cargo test + Newman into one pipeline.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 55,
          label: `Script a single command that spins up the app, runs <code>cargo test</code> + Newman against it, and reports pass/fail — your local CI in miniature.`,
          sub: [
            { id: "s1", est: 35, label: `One-command test pipeline (unit + integration + Newman).` },
            { id: "s2", est: 20, label: `Make it fail loudly on a broken endpoint.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 This pipeline is what Ch13's GitHub Actions will run on every push — build it locally first.` },
      ],
    },

    /* ---------------- Week 40 ---------------- */
    {
      id: "d118", date: "2027-06-25", week: "w40", title: "2nd-ed Ch10 — Docker images",
      theme: "Package the app into containers — the unit of deployment.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>2nd-ed Ch10 Deploying on AWS</b>: <i>setting up the build environment</i> (AWS SSH key + EC2, AWS client) and <i>managing our software with Docker</i> — writing & building Docker image files.`,
          sub: [
            { id: "s1", est: 30, label: `Build env: AWS account, SSH key, EC2, AWS CLI.` },
            { id: "s2", est: 30, label: `Writing + building the server Docker image.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 40,
          label: `Write a Dockerfile for each of your services (to-do server, auth server) and build the images locally; confirm the containers run and talk to Postgres/Redis. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Dockerfiles for the server(s); build locally.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Your app is multi-service (nanoservices) — you'll containerise each server, unlike the book's single Actix binary. Same Docker skills, one more image or two.` },
      ],
    },
    {
      id: "d119", date: "2027-06-27", week: "w40", title: "2nd-ed Ch10 — Terraform & build scripts",
      theme: "Infrastructure-as-code and repeatable build orchestration.",
      tasks: [
        { id: "t1", carried: "d118", obj: "rwp", cat: "project", est: 25,
          label: `Write a Dockerfile for each of your services (to-do server, auth server) and build the images locally; confirm the containers run and talk to Postgres/Redis. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Compose them with Postgres/Redis; smoke-test.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch10</b>: <i>setting up our Terraform build</i>, the <i>Python build script</i>, the <i>Bash deployment script</i>, an <i>EC2 build server via Terraform</i>, and <i>orchestrating builds with Bash</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Terraform for an EC2 build server.` },
            { id: "s2", est: 30, label: `Python/Bash build + deploy orchestration.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Infra-as-code means the server is a file you can recreate, not a pet you configured by hand. Same discipline as DB migrations.` },
      ],
    },
    {
      id: "d120", date: "2027-06-29", week: "w40", title: "2nd-ed Ch10 — Terraform & build scripts (cont.)",
      theme: "Finish “2nd-ed Ch10 — Terraform & build scripts” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d119", obj: "rwp", cat: "project", est: 65,
          label: `Write a Terraform config that stands up an EC2 instance and a script that builds your images on it; apply it and tear it down cleanly.`,
          sub: [
            { id: "s1", est: 40, label: `Terraform EC2 + a build/deploy script.` },
            { id: "s2", est: 25, label: `<code>apply</code> then <code>destroy</code> — confirm reproducible.` },
          ] },
      ],
    },

    /* ---------------- Week 41 ---------------- */
    {
      id: "d121", date: "2027-07-01", week: "w41", title: "2nd-ed Ch10 — deploy to AWS",
      theme: "Push the images and run the app on real infrastructure.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch10</b>: a <i>Docker image for the React frontend</i>, <i>deploying images onto Docker Hub</i>, and <i>deploying the application on AWS</i> (running locally, then on AWS) via the build script.`,
          sub: [
            { id: "s1", est: 30, label: `Frontend image + push all images to a registry.` },
            { id: "s2", est: 30, label: `Deploy + run the stack on AWS.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 40,
          label: `Push your images to a registry and bring the app up on the EC2 instance; hit the public IP and complete a real request against the deployed app. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Registry push + AWS bring-up of the full stack.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Your app now runs somewhere other than your laptop. Next: put a real domain + HTTPS in front of it.` },
      ],
    },
    {
      id: "d122", date: "2027-07-03", week: "w41", title: "2nd-ed Ch11 — HTTPS, locally",
      theme: "Understand TLS/HTTP-2, then terminate HTTPS in front of the app.",
      tasks: [
        { id: "t1", carried: "d121", obj: "rwp", cat: "project", est: 25,
          label: `Push your images to a registry and bring the app up on the EC2 instance; hit the public IP and complete a real request against the deployed app. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Live request against the deployed app.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>2nd-ed Ch11 HTTPS with NGINX</b>: <i>what is HTTPS?</i> (binary protocol, compressed headers, persistent connections, multiplex streaming) and <i>implementing HTTPS locally with docker-compose</i>.`,
          sub: [
            { id: "s1", est: 30, label: `HTTPS/HTTP-2 mechanics.` },
            { id: "s2", est: 20, label: `NGINX + docker-compose terminating TLS locally.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 NGINX terminates TLS and proxies to your Rust server — the same edge pattern regardless of Actix vs Hyper.` },
      ],
    },
    {
      id: "d123", date: "2027-07-05", week: "w41", title: "2nd-ed Ch11 — HTTPS on AWS",
      theme: "A real domain, real certificates, and a load balancer.",
      tasks: [
        { id: "t1", carried: "d122", obj: "rwp", cat: "project", est: 60,
          label: `Put an NGINX reverse proxy in front of your app via docker-compose and serve it over HTTPS locally with a self-signed cert.`,
          sub: [
            { id: "s1", est: 35, label: `NGINX reverse-proxy in compose.` },
            { id: "s2", est: 25, label: `Local HTTPS with a self-signed cert.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch11</b>: <i>attaching a URL</i> (elastic IP, domain registration), <i>enforcing HTTPS</i> (certificates), and scaling out — <i>multiple EC2 instances</i>, a <i>load balancer</i>, and <i>security groups</i>. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Elastic IP + domain + TLS certificates.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Security groups are your firewall — open only 443 (and 22 to yourself). Everything else stays shut.` },
      ],
    },

    /* ---------------- Week 42 ---------------- */
    {
      id: "d124", date: "2027-07-07", week: "w42", title: "2nd-ed Ch11 — HTTPS on AWS (cont.)",
      theme: "Finish “2nd-ed Ch11 — HTTPS on AWS” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d123", obj: "rwp", cat: "read", est: 30,
          label: `<b>Ch11</b>: <i>attaching a URL</i> (elastic IP, domain registration), <i>enforcing HTTPS</i> (certificates), and scaling out — <i>multiple EC2 instances</i>, a <i>load balancer</i>, and <i>security groups</i>. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Load balancer + security groups across instances.` },
          ] },
        { id: "t2", carried: "d123", obj: "rwp", cat: "project", est: 65,
          label: `Attach a domain to your deployment, get a real certificate, and force HTTPS; put a load balancer in front and lock traffic down with security groups.`,
          sub: [
            { id: "s1", est: 40, label: `Domain + real cert + forced HTTPS.` },
            { id: "s2", est: 25, label: `Load balancer + locked-down security groups.` },
          ] },
      ],
    },
    {
      id: "d125", date: "2027-07-09", week: "w42", title: "Checkpoint — tested, deployed, secured",
      theme: "The app is real, public, and safe. Catch up before professionalising the repo.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "review", est: 45,
          label: `<b>Consolidation:</b> confirm the full lifecycle — tests green, images built, deployed on AWS, reachable over HTTPS on a real domain behind a load balancer. Note anything fragile.`,
          sub: [
            { id: "s1", est: 25, label: `End-to-end: test → deploy → HTTPS all working.` },
            { id: "s2", est: 20, label: `Write the deploy runbook (commands + gotchas).` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35, optional: true,
          label: `<b>If caught up:</b> tighten one rough edge from deployment (secrets, health checks, restart policy). Optional.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 A tested app running on secured AWS infra is a real milestone. Ch13 makes the repo itself production-grade.` },
      ],
      note: "Light checkpoint day.",
    },
    {
      id: "d126", date: "2027-07-11", week: "w42", title: "2nd-ed Ch13 — a clean repository",
      theme: "Structure the repo and its config the way a professional project is laid out.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>2nd-ed Ch13 Best Practices for a Clean Web App Repository</b>: <i>the general layout of a clean repository</i>, <i>configuration from environment variables</i>, a <i>local development database</i>, and <i>managing variables in Postman tests</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Clean repo layout + env-var configuration.` },
            { id: "s2", est: 20, label: `Local dev DB + parameterised Postman vars.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Refactor your repo to the clean layout: all config via env vars (no hardcoded secrets), a one-command local dev database, and Postman variables per environment. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Env-var config + clean layout across services.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 "Config in the environment, not the code" is the 12-factor rule — it's what makes the same image run in dev, CI and prod unchanged.` },
      ],
    },

    /* ---------------- Week 43 ---------------- */
    {
      id: "d127", date: "2027-07-15", week: "w43", title: "2nd-ed Ch13 — distroless images & GitHub Actions CI",
      theme: "Tiny secure images and a pipeline that runs on every push.",
      tasks: [
        { id: "t1", carried: "d126", obj: "rwp", cat: "project", est: 25,
          label: `Refactor your repo to the clean layout: all config via env vars (no hardcoded secrets), a one-command local dev database, and Postman variables per environment. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `One-command dev DB + env-scoped Postman vars.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 60,
          label: `<b>Ch13</b>: <i>building distroless tiny-server Docker images</i>, <i>a clean test pipeline</i>, and <i>continuous integration with GitHub Actions</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Distroless multi-stage image builds.` },
            { id: "s2", est: 30, label: `GitHub Actions CI running the test pipeline.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Distroless = no shell, no package manager in the final image — smaller attack surface and faster pulls. Your Ch9/local pipeline slots straight into the Actions runner.` },
      ],
    },
    {
      id: "d128", date: "2027-07-16", week: "w43", title: "2nd-ed Ch12 — Rocket: setup & modules",
      theme: "Framework flexibility: stand the app up on a different web framework.",
      tasks: [
        { id: "t1", carried: "d127", obj: "rwp", cat: "project", est: 65,
          label: `Convert your images to distroless multi-stage builds (tiny, no shell) and add a GitHub Actions workflow that builds, tests (unit + Newman), and reports on every push.`,
          sub: [
            { id: "s1", est: 40, label: `Distroless multi-stage Dockerfiles.` },
            { id: "s2", est: 25, label: `GitHub Actions: build + test on push.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 30,
          label: `<b>2nd-ed Ch12 Recreating Our Application in Rocket</b>: <i>what is Rocket?</i>, <i>setting up the server</i>, <i>plugging in existing modules</i>, and <i>implementing Rocket traits</i>. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Rocket vs your current stack; server setup.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 Because your logic lives in the core (not the framework), swapping Hyper→Rocket is a networking-layer rewrite, not an app rewrite. This chapter proves that seam works.` },
      ],
    },
    {
      id: "d129", date: "2027-07-19", week: "w43", title: "2nd-ed Ch12 — Rocket: setup & modules (cont.)",
      theme: "Finish “2nd-ed Ch12 — Rocket: setup & modules” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d128", obj: "rwp", cat: "read", est: 30,
          label: `<b>2nd-ed Ch12 Recreating Our Application in Rocket</b>: <i>what is Rocket?</i>, <i>setting up the server</i>, <i>plugging in existing modules</i>, and <i>implementing Rocket traits</i>. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Reusing your core/DAL modules under Rocket.` },
          ] },
        { id: "t2", carried: "d128", obj: "rwp", cat: "project", est: 60,
          label: `Spin up a Rocket server and wire your existing core + DAL into it — proving your logic is framework-independent (the whole point of the nanoservice split).`,
          sub: [
            { id: "s1", est: 35, label: `Rocket server booting.` },
            { id: "s2", est: 25, label: `Core/DAL plugged in behind Rocket routes.` },
          ] },
      ],
    },

    /* ---------------- Week 44 ---------------- */
    {
      id: "d130", date: "2027-07-24", week: "w44", title: "2nd-ed Ch12 — Rocket: views, JSON & tests",
      theme: "Port the routes and confirm the same tests still pass.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch12</b>: <i>plugging in existing views</i>, <i>accepting/returning JSON</i>, <i>returning raw HTML</i>, <i>returning status</i> (single & multiple), <i>registering views</i>, and <i>plugging in existing tests</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Rocket views + JSON/HTML/status responses.` },
            { id: "s2", est: 20, label: `Running your existing test suite against Rocket.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 35,
          label: `Port your routes to Rocket (JSON in/out, proper statuses) and run your Ch9 test suite against the Rocket version — same behaviour, different framework. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Routes ported; JSON + statuses correct.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 If the same tests pass against both Hyper and Rocket, your API contract is genuinely decoupled from its framework. That's a strong design signal.` },
      ],
    },
    {
      id: "d131", date: "2027-07-25", week: "w44", title: "2nd-ed Ch14 — the Tokio framework",
      theme: "Part 6 (standalone async/systems track): go under the hood of async Rust.",
      tasks: [
        { id: "t1", carried: "d130", obj: "rwp", cat: "project", est: 25,
          label: `Port your routes to Rocket (JSON in/out, proper statuses) and run your Ch9 test suite against the Rocket version — same behaviour, different framework. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Existing tests green against Rocket.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>2nd-ed Ch14 Exploring the Tokio Framework</b>: <i>Tokio for async programming</i> and <i>working with workers</i> — the runtime beneath everything you've built.`,
          sub: [
            { id: "s1", est: 30, label: `Tokio runtime, tasks, and workers.` },
            { id: "s2", est: 20, label: `How the executor schedules async work.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `📖 Part 6 (Ch14–18) are self-contained mini-projects on low-level async & networking — not tied to the web-app stack. Pure Rust systems programming.` },
      ],
    },
    {
      id: "d132", date: "2027-07-27", week: "w44", title: "2nd-ed Ch14 — the Tokio framework (cont.)",
      theme: "Finish “2nd-ed Ch14 — the Tokio framework” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d131", obj: "rwp", cat: "code", est: 60,
          label: `Build the chapter's worker examples: spawn tasks across the runtime and observe how work is distributed.`,
          sub: [
            { id: "s1", est: 35, label: `Spawn + coordinate Tokio workers.` },
            { id: "s2", est: 25, label: `Observe scheduling across the runtime.` },
          ] },
      ],
    },

    /* ---------------- Week 45 ---------------- */
    {
      id: "d133", date: "2027-07-28", week: "w45", title: "2nd-ed Ch14 — the actor model",
      theme: "Actors and channels — the concurrency pattern the 3rd-ed logging used.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch14</b>: <i>the actor model for async programming</i>, <i>working with channels</i>, and <i>working with actors in Tokio</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Actor model + channels in Tokio.` },
            { id: "s2", est: 20, label: `Building actors that own state.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Build an actor (a task owning state, driven by a channel of messages) and drive it from several producers — the pattern behind async state management. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `A channel-driven Tokio actor.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 You met actors in the 3rd-ed logging chapter — here's the full model. An actor replaces <code>Arc&lt;Mutex&gt;</code> with message passing.` },
      ],
    },
    {
      id: "d134", date: "2027-07-30", week: "w45", title: "2nd-ed Ch15 — accepting TCP with Tokio",
      theme: "Below HTTP: raw TCP sockets and byte processing.",
      tasks: [
        { id: "t1", carried: "d133", obj: "rwp", cat: "code", est: 25,
          label: `Build an actor (a task owning state, driven by a channel of messages) and drive it from several producers — the pattern behind async state management. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Multiple producers → one actor; no shared locks.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>2nd-ed Ch15 Accepting TCP Traffic with Tokio</b>: <i>exploring TCP</i>, <i>accepting TCP</i>, <i>processing bytes</i>, and <i>passing TCP to an actor</i>.`,
          sub: [
            { id: "s1", est: 30, label: `TCP basics; accepting connections in Tokio.` },
            { id: "s2", est: 20, label: `Reading/processing raw bytes off a socket.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is the layer under Hyper — seeing HTTP as bytes on a TCP socket demystifies every framework you've used.` },
      ],
    },
    {
      id: "d135", date: "2027-08-02", week: "w45", title: "2nd-ed Ch15 — accepting TCP with Tokio (cont.)",
      theme: "Finish “2nd-ed Ch15 — accepting TCP with Tokio” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d134", obj: "rwp", cat: "code", est: 60,
          label: `Build a Tokio TCP server that accepts connections, reads bytes, and hands each connection to an actor.`,
          sub: [
            { id: "s1", est: 35, label: `Tokio TCP listener + byte processing.` },
            { id: "s2", est: 25, label: `Route each connection to an actor.` },
          ] },
      ],
    },

    /* ---------------- Week 46 ---------------- */
    {
      id: "d136", date: "2027-08-05", week: "w46", title: "2nd-ed Ch15 — actors over TCP",
      theme: "Coordinate state across a TCP server using chained actors.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch15</b>: <i>keeping track of orders with actors</i>, <i>chaining communication between actors</i>, <i>responding with TCP</i>, and <i>sending different commands via the client</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Stateful actors + chaining messages.` },
            { id: "s2", est: 20, label: `Responding over TCP; a command client.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Extend your TCP server so a client sends commands, actors maintain shared order state, and the server responds — a tiny stateful protocol. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Command client + actor-held state.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 You're building a stateful networked service from sockets up — no framework doing the plumbing.` },
      ],
    },
    {
      id: "d137", date: "2027-08-07", week: "w46", title: "2nd-ed Ch16 — protocols on TCP",
      theme: "Structured messages over a byte stream — the framing problem.",
      tasks: [
        { id: "t1", carried: "d136", obj: "rwp", cat: "code", est: 25,
          label: `Extend your TCP server so a client sends commands, actors maintain shared order state, and the server responds — a tiny stateful protocol. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Server responses over TCP.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>2nd-ed Ch16 Building Protocols on Top of TCP</b>: <i>setting up the TCP client and server</i>, <i>processing bytes using structs</i>, and <i>creating a message-sender client</i> / <i>processing messages in the server</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Struct-based message (de)serialisation over TCP.` },
            { id: "s2", est: 20, label: `Message-sender client + server processing.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `💡 "Where does one message end?" is the core problem of any byte-stream protocol — framing (next) is the answer.` },
      ],
    },
    {
      id: "d138", date: "2027-08-08", week: "w46", title: "2nd-ed Ch16 — protocols on TCP (cont.)",
      theme: "Finish “2nd-ed Ch16 — protocols on TCP” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d137", obj: "rwp", cat: "code", est: 60,
          label: `Define a message struct, serialise it over TCP, and parse it on the server — a typed protocol instead of ad-hoc bytes.`,
          sub: [
            { id: "s1", est: 35, label: `Typed message over TCP (encode/decode).` },
            { id: "s2", est: 25, label: `Client sends, server parses struct messages.` },
          ] },
      ],
    },
    {
      id: "d139", date: "2027-08-10", week: "w46", title: "2nd-ed Ch16 — framing & an HTTP frame",
      theme: "Length-framing messages, then rebuild HTTP from scratch.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch16</b>: <i>utilizing framing</i> (rewriting client & server to support it) and <i>building an HTTP frame on top of TCP</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Framing: delimit messages on the stream.` },
            { id: "s2", est: 20, label: `Constructing an HTTP frame over raw TCP.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Once you've built HTTP on top of TCP by hand, Hyper stops being magic — it's this, hardened and optimised.` },
      ],
    },

    /* ---------------- Week 47 ---------------- */
    {
      id: "d140", date: "2027-08-11", week: "w47", title: "2nd-ed Ch16 — framing & an HTTP frame (cont.)",
      theme: "Finish “2nd-ed Ch16 — framing & an HTTP frame” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d139", obj: "rwp", cat: "code", est: 60,
          label: `Add length-based framing to your protocol, then hand-build a minimal HTTP request/response frame over your TCP layer — HTTP, from first principles.`,
          sub: [
            { id: "s1", est: 35, label: `Framed client + server.` },
            { id: "s2", est: 25, label: `A hand-rolled HTTP frame over TCP.` },
          ] },
      ],
    },
    {
      id: "d141", date: "2027-08-13", week: "w47", title: "2nd-ed Ch17 — actors with Hyper",
      theme: "Bring actors and Hyper together into one async service.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>2nd-ed Ch17 Actors and Async with Hyper</b>: <i>breaking down the project</i>, <i>defining channel messages</i>, and building the <i>runner</i> and <i>state</i> actors.`,
          sub: [
            { id: "s1", est: 30, label: `Project shape; channel message types.` },
            { id: "s2", est: 20, label: `Runner actor + state actor.` },
          ] },
        { id: "t2", obj: "rwp", cat: "code", est: 35,
          label: `Build the runner + state actors and the channels between them — the async backbone the Hyper server will sit on. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Runner + state actors over channels.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This ties Part 6 together: the actor model (Ch14) + TCP/framing (Ch15–16) + Hyper (3rd-ed Ch4) in one design.` },
      ],
    },
    {
      id: "d142", date: "2027-08-14", week: "w47", title: "2nd-ed Ch17 — the Hyper server",
      theme: "Serve HTTP over the actor system you just built.",
      tasks: [
        { id: "t1", carried: "d141", obj: "rwp", cat: "code", est: 25,
          label: `Build the runner + state actors and the channels between them — the async backbone the Hyper server will sit on. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Drive them with test messages.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch17</b>: <i>handling HTTP requests using Hyper</i>, <i>building an HTTP server using Hyper</i>, and <i>running the Hyper HTTP server</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Hyper request handling wired to the actors.` },
            { id: "s2", est: 20, label: `Assembling + running the server.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Compare this hand-built actor+Hyper service to the 3rd-ed's framework-assisted one — same shape, now fully understood end to end.` },
      ],
    },
    {
      id: "d143", date: "2027-08-16", week: "w47", title: "2nd-ed Ch17 — the Hyper server (cont.)",
      theme: "Finish “2nd-ed Ch17 — the Hyper server” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d142", obj: "rwp", cat: "code", est: 60,
          label: `Put Hyper in front of your actor system so HTTP requests drive the runner/state actors; run it and hit it with curl.`,
          sub: [
            { id: "s1", est: 35, label: `Hyper server → actors → response.` },
            { id: "s2", est: 25, label: `Run + curl the actor-backed server.` },
          ] },
      ],
    },

    /* ---------------- Week 48 ---------------- */
    {
      id: "d144", date: "2027-08-19", week: "w48", title: "2nd-ed Ch18 — a Redis task queue",
      theme: "The finale project: offload work to background workers via Redis.",
      tasks: [
        { id: "t1", obj: "rwp", cat: "read", est: 50,
          label: `<b>2nd-ed Ch18 Queuing Tasks with Redis</b>: <i>breaking down the project</i>, <i>building the HTTP server</i>, <i>building the polling worker</i>, and <i>getting it running with Redis</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Queue architecture: server + polling worker + Redis.` },
            { id: "s2", est: 20, label: `Standing up the server and worker.` },
          ] },
        { id: "t2", obj: "rwp", cat: "project", est: 40,
          label: `Build an HTTP server that enqueues tasks to Redis and a worker that polls and runs them — the producer/consumer pattern for slow work. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Server enqueues → Redis → worker polls & runs.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 A task queue is how real apps handle slow work (email, image processing) without blocking requests — the pattern behind Celery/Sidekiq, in Rust.` },
      ],
    },
    {
      id: "d145", date: "2027-08-22", week: "w48", title: "2nd-ed Ch18 — tasks, messages & Docker",
      theme: "Finish the queue: typed tasks/messages, routing, and containerised.",
      tasks: [
        { id: "t1", carried: "d144", obj: "rwp", cat: "project", est: 25,
          label: `Build an HTTP server that enqueues tasks to Redis and a worker that polls and runs them — the producer/consumer pattern for slow work. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Confirm a slow task runs off the request path.` },
          ] },
        { id: "t2", obj: "rwp", cat: "read", est: 50,
          label: `<b>Ch18</b>: <i>defining tasks for workers</i>, <i>defining messages for the Redis queue</i>, <i>integrating routing in the HTTP server</i>, and <i>running it all in Docker</i>.`,
          sub: [
            { id: "s1", est: 30, label: `Typed tasks + queue messages.` },
            { id: "s2", est: 20, label: `Routing + running the whole thing in Docker.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Everything in Part 6 has been Docker-first — the same deployment discipline you learned in Ch10/13 carries the systems track too.` },
      ],
    },
    {
      id: "d146", date: "2027-08-23", week: "w48", title: "Two-book capstone & retro",
      theme: "Close the complete Rust-web reference — both editions, one map.",
      tasks: [
        { id: "t1", carried: "d145", obj: "rwp", cat: "project", est: 60,
          label: `Add typed tasks/messages and routing, then bring the whole queue system up in Docker — a self-contained, containerised async service. 🎉 Both books complete.`,
          sub: [
            { id: "s1", est: 35, label: `Typed tasks/messages + routes.` },
            { id: "s2", est: 25, label: `Full system up in Docker.` },
          ] },
        { id: "t2", obj: "rwp", cat: "review", est: 45,
          label: `Write the master map: the full journey across <b>both books</b> — build (3rd-ed: nanoservices, Hyper, SQLx, WASM, auth, Redis cache, logging) → operate (2nd-ed: testing, AWS deploy, HTTPS, CI) → flex (Rocket) → understand (Part 6: Tokio, TCP, protocols, Hyper actors, task queue). Note the 3–4 ideas you'd revisit first.`,
          sub: [
            { id: "s1", est: 25, label: `The complete two-book map: build → operate → flex → understand.` },
            { id: "s2", est: 20, label: `The 3–4 ideas most worth revisiting.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 You now hold a complete, current Rust web reference stitched from two editions — from a single heap allocation to a load-balanced, HTTPS, CI-deployed, queue-backed nanoservices stack. Build something you'll keep.` },
      ],
      note: "🎓 Final day of the Rust + FastAPI + Rust Web Programming roadmap.",
    },
    {
      id: "d147", date: "2027-08-24", week: "w48", title: "Two-book capstone & retro (cont.)",
      theme: "Finish “Two-book capstone & retro” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d146", obj: "rwp", cat: "review", est: 45,
          label: `Pick the next real thing to build with all of it, and write its first few tasks while the momentum's hot. 🎉 Rust web programming — complete.`,
          sub: [
            { id: "s1", est: 25, label: `Choose the next real project.` },
            { id: "s2", est: 20, label: `Write its first 3 tasks.` },
          ] },
      ],
    },
  ],

  milestones: [
    { id: "w2.m1", week: "w2", title: "Smart pointers finished (Ch15)",
      rule: { type: "tasks", require: ["d01.t1", "d03.t1", "d04.t1", "d04.t2"] } },
    { id: "w1.m1", week: "w1", title: "≥ 80% of week 1 (original)", rule: { type: "weekPct", min: 80 } },
    { id: "w6.m1", week: "w6", title: "OOP + patterns + JWT auth done",
      rule: { type: "tasks", require: ["d12.t1", "d14.t1", "d15.t1", "d17.t1"] } },
    { id: "w4.m1", week: "w4", title: "≥ 75% of week 4 (original)", rule: { type: "weekPct", min: 75 } },
    { id: "w10.m1", week: "w10", title: "Advanced Rust done; server started",
      rule: { type: "tasks", require: ["d22.t1", "d27.t1", "d28.t2", "d29.t1"] } },
    { id: "w11.m1", week: "w11", title: "🏁 Rust web server complete",
      rule: { type: "tasks", require: ["d31.t1", "d32.t1"] } },
    { id: "w12.m1", week: "w12", title: "FastAPI modernized (lifespan + v2)",
      rule: { type: "tasks", require: ["d33.t2", "d34.t1", "d35.t1"] } },
    { id: "w14.m1", week: "w14", title: "🎓 FastAPI capstone shipped",
      rule: { type: "tasks", require: ["d37.t1", "d38.t1", "d39.t1", "d40.t1"] } },
    { id: "w17.m1", week: "w17", title: "Async Rust: tokio server running",
      rule: { type: "tasks", require: ["d46.t1", "d50.t1"] } },
    { id: "w16.m1", week: "w16", title: "FastAPI capstone deployed",
      rule: { type: "tasks", require: ["d47.t1"] } },
    { id: "w19.m1", week: "w19", title: "🏁 Integration capstone (Rust + FastAPI)",
      rule: { type: "tasks", require: ["d52.t2", "d53.t1", "d54.t1", "d55.t1"] } },
    /* ---- RWP extension milestones (Ch2 → capstone) ---- */
    { id: "w23.m1", week: "w23", title: "RWP — Rust patterns & app design (Ch2–3)",
      rule: { type: "tasks", require: ["d64.t1", "d68.t1"] } },
    { id: "w25.m1", week: "w25", title: "RWP — async backend serving HTTP (Ch4–5)",
      rule: { type: "tasks", require: ["d72.t1", "d75.t1"] } },
    { id: "w26.m1", week: "w26", title: "🏁 RWP backend API — full CRUD (Ch6)",
      rule: { type: "tasks", require: ["d77.t2"] } },
    { id: "w29.m1", week: "w29", title: "RWP — React + WASM frontend (Ch7–8)",
      rule: { type: "tasks", require: ["d82.t2", "d86.t2"] } },
    { id: "w31.m1", week: "w31", title: "RWP — persistence on PostgreSQL (Ch9)",
      rule: { type: "tasks", require: ["d91.t2", "d92.t1"] } },
    { id: "w34.m1", week: "w34", title: "RWP — auth & multi-server (Ch10–11)",
      rule: { type: "tasks", require: ["d97.t2", "d100.t2", "d101.t1"] } },
    { id: "w36.m1", week: "w36", title: "RWP — Redis-cached sessions (Ch12)",
      rule: { type: "tasks", require: ["d105.t2", "d106.t1"] } },
    { id: "w37.m1", week: "w37", title: "🎓 RWP complete — the nanoservices stack",
      rule: { type: "tasks", require: ["d108.t2", "d109.t1", "d111.t1"] } },
    /* ---- RWP Part B milestones (Ch9 → capstone) ---- */
    { id: "w39.m1", week: "w39", title: "RWP — application tested (2nd-ed Ch9)",
      rule: { type: "tasks", require: ["d117.t2"] } },
    { id: "w42.m1", week: "w42", title: "🏁 RWP — deployed on AWS over HTTPS (Ch10–11)",
      rule: { type: "tasks", require: ["d121.t2", "d122.t1", "d124.t2"] } },
    { id: "w44.m1", week: "w44", title: "RWP — production repo, CI & Rocket (Ch12–13)",
      rule: { type: "tasks", require: ["d128.t1", "d130.t2", "d131.t1"] } },
    { id: "w48.m1", week: "w48", title: "🎓 RWP — complete two-book reference (Part 6)",
      rule: { type: "tasks", require: ["d144.t2", "d145.t1", "d146.t2"] } },
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
