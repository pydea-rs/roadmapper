// rust-fastapi.js — Roadmap 1 (priority HIGH, 4–5 active days/week).
// Two PRIMARY objectives: `rust` (The Rust Programming Language, resume Ch15/PDF335)
// and `fastapi` (Mastering FastAPI, resume Ch4/PDF52 — brief book, supplemented
// heavily with official docs). Page ranges are real PDF pages (see _research.md).
// Style: do every listing; invent tryout projects where the book is thin; a
// multi-day Ch20 web-server arc. Off-days vary per week; some days are lighter
// (marked) to leave room for Roadmap 2 overlap.
//
// EXTENDED (2026-07-17): the books (Rust Ch15–20, FastAPI Ch4–7) still finish at
// d24, but weeks 6–7 (d25–d32) append the two things worth adding — async Rust
// (tokio, the Book's biggest gap) and a Rust-service-behind-a-FastAPI-gateway
// integration capstone — plus a real buffer day (d28). Moves the finish to
// 2026-08-31. Existing ids/dates unchanged; d24 re-scoped to a checkpoint.

import { registerRoadmap } from "../assets/js/registry.js";

const R = "rust", F = "fastapi";

registerRoadmap({
  slug: "rust-fastapi",
  title: "Rust + FastAPI",
  icon: "🦀",
  subtitle: "Finish The Rust Programming Language (Ch15→20) and Mastering FastAPI (Ch4→), doc-supplemented.",
  accent: "#f0803c",
  schemaVersion: 1,
  cadence: { activeDaysPerWeek: [4, 5] },

  objectives: [
    { id: R, title: "Rust — The Book", tier: "primary", weight: 1 },
    { id: F, title: "FastAPI", tier: "primary", weight: 1 },
  ],

  weeks: [
    { id: "w1", title: "Week 1 — Smart pointers & DB foundations", start: "2026-07-16" },
    { id: "w2", title: "Week 2 — OOP, patterns, security", start: "2026-07-23" },
    { id: "w3", title: "Week 3 — Advanced Rust & the web-server arc", start: "2026-07-30" },
    { id: "w4", title: "Week 4 — Finish the server; deploy FastAPI", start: "2026-08-06" },
    { id: "w5", title: "Week 5 — Capstone & checkpoint", start: "2026-08-13" },
    { id: "w6", title: "Week 6 — Async Rust & real deployment", start: "2026-08-20" },
    { id: "w7", title: "Week 7 — Integration capstone & retro", start: "2026-08-27" },
  ],

  days: [
    /* ---------------- Week 1 ---------------- */
    {
      id: "d01", date: "2026-07-16", week: "w1", title: "Resume: Box & Deref",
      theme: "Back into Rust at Ch15 — smart pointers on the heap.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 35, group: "g1",
          label: `Rust — <b>Ch15.1–15.2</b>: <code>Box&lt;T&gt;</code> on the heap & recursive cons-list; the <b>Deref</b> trait (pp 335–346).` },
        { id: "t2", obj: R, cat: "code", est: 40, group: "g1",
          label: `Build the <code>MyBox&lt;T&gt;</code> example and prove <b>deref coercion</b> yourself; run every listing.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Deref coercion is what lets <code>&String</code> pass where <code>&str</code> is wanted — the compiler chains <code>Deref</code> calls at compile time, zero cost.` },
        { id: "s2", type: "tryout", label: `Tryout: implement <code>DerefMut</code> for <code>MyBox</code> and observe when the compiler picks it over <code>Deref</code>.` },
      ],
    },
    {
      id: "d02", date: "2026-07-17", week: "w1", title: "Rc, RefCell & Weak",
      theme: "Interior mutability and reference cycles — the tricky half of Ch15.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 40, group: "g1",
          label: `Rust — <b>Ch15.3–15.6</b>: <b>Drop</b>, <code>Rc&lt;T&gt;</code>, <code>RefCell&lt;T&gt;</code> & interior mutability, reference cycles & <code>Weak&lt;T&gt;</code> (pp 347–369).` },
        { id: "t2", obj: R, cat: "code", est: 35, group: "g1",
          label: `Work the mock-messenger (<code>RefCell</code>) and the leaf/branch tree (<code>Rc</code>+<code>Weak</code>) listings.` },
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
      id: "d03", date: "2026-07-18", week: "w1", title: "FastAPI databases",
      theme: "Switch objective — SQLAlchemy models, CRUD, sessions.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 30, group: "g1",
          label: `FastAPI — <b>Ch4 Working with Databases</b>: SQLAlchemy setup, models, CRUD, sessions & transactions (pp 52–67).` },
        { id: "t2", obj: F, cat: "api", est: 45, group: "g1",
          label: `Build a small CRUD API from the chapter; wire a session dependency with <code>Depends</code>.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 The official FastAPI SQL tutorial now uses <b>SQLModel</b> (Pydantic+SQLAlchemy). The book is raw SQLAlchemy — fine to learn, but know the modern default. <a href="https://fastapi.tiangolo.com/tutorial/sql-databases/" target="_blank" rel="noopener">docs</a>` },
        { id: "s2", type: "hint", label: `💡 The book is SQLAlchemy-<b>sync</b> only. We'll add an async 2.0-style router later (see Week 5).` },
      ],
    },
    {
      id: "d04", date: "2026-07-20", week: "w1", title: "Fearless concurrency",
      theme: "Threads, channels, Mutex/Arc — Ch16 (book is snippet-y, so we build).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 30, group: "g1",
          label: `Rust — <b>Ch16</b>: threads (<code>spawn</code>/<code>join</code>/<code>move</code>), channels, <code>Mutex&lt;T&gt;</code>+<code>Arc&lt;T&gt;</code>, <code>Send</code>/<code>Sync</code> (pp 371–394).` },
        { id: "t2", obj: R, cat: "project", est: 55, group: "g1",
          label: `<b>Combine-topics tryout:</b> a worker pool of N threads pulling jobs off an <code>mpsc</code> channel, accumulating results behind an <code>Arc&lt;Mutex&lt;_&gt;&gt;</code>. (Warm-up for Ch20's thread pool.)` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — the Book uses OS threads only. Async Rust (<a href="https://rust-lang.github.io/async-book/" target="_blank" rel="noopener">async book</a>, <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">tokio</a>) is the big topic it skips; note it for "after the book".` },
        { id: "s2", type: "hint", label: `💡 <code>Send</code> = safe to move to another thread; <code>Sync</code> = safe to share by reference. They're auto-derived — you rarely implement them, but reading the errors teaches you the model.` },
      ],
    },
    {
      id: "d05", date: "2026-07-21", week: "w1", title: "FastAPI project structure",
      theme: "Split the app with APIRouter — book §5.1 + official docs.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `FastAPI — <b>Ch5.1</b> project structure / clean code (pp 68–75).` },
        { id: "t2", obj: F, cat: "api", est: 45, group: "g1",
          label: `<b>Supplement — Bigger Applications:</b> refactor the CRUD app into <code>routers/</code> with <code>APIRouter</code> (prefix, tags, per-router deps). <a href="https://fastapi.tiangolo.com/tutorial/bigger-applications/" target="_blank" rel="noopener">docs</a>` },
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
      id: "d06", date: "2026-07-23", week: "w2", title: "OOP in Rust",
      theme: "Trait objects & the State pattern — Ch17 (example-rich).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 35, group: "g1",
          label: `Rust — <b>Ch17</b>: OO characteristics, <b>trait objects</b> (<code>dyn</code>, object safety) via the <code>Draw</code>/<code>Screen</code> GUI, and the full <b>State pattern</b> blog example (pp 395–418).` },
        { id: "t2", obj: R, cat: "code", est: 50, group: "g1",
          label: `Implement the whole <code>Post</code> State-pattern example; then <b>harden it</b> — add a <code>Rejected</code> state and a word-count guard on publish.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Rust's "OOP" is trait objects + enums, not inheritance. The State pattern here trades compile-time checks for runtime flexibility — compare it mentally to the <code>enum</code> version.` },
      ],
    },
    {
      id: "d07", date: "2026-07-24", week: "w2", title: "FastAPI security (JWT)",
      theme: "The book's §5.2 is thin (9pp) — supplement heavily with official auth docs.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 20, group: "g1",
          label: `FastAPI — <b>Ch5.2 Security</b> (pp 76–84) — read, but treat as an intro only.` },
        { id: "t2", obj: F, cat: "api", est: 60, group: "g1",
          label: `<b>Supplement — OAuth2 + JWT:</b> implement password flow, hashing, and Bearer/JWT from the official tutorial. <a href="https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" target="_blank" rel="noopener">docs</a>` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 Current docs use <b>pwdlib (Argon2)</b> and <b>PyJWT</b> — older tutorials (and this book) show <code>passlib</code>/<code>python-jose</code>. Use the new stack.` },
        { id: "s2", type: "tryout", label: `Tryout: protect one CRUD route with the JWT dependency and prove a missing/expired token returns 401.` },
      ],
    },
    {
      id: "d08", date: "2026-07-25", week: "w2", title: "Patterns & matching",
      theme: "Ch18 is reference-y — so we build one thing that uses it all.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 30, group: "g1",
          label: `Rust — <b>Ch18</b>: all pattern places, refutability, and the full syntax (destructuring, ranges, guards, <code>@</code>, <code>ref</code>) (pp 419–442).` },
        { id: "t2", obj: R, cat: "project", est: 50, group: "g1",
          label: `<b>Tryout:</b> a tiny command parser — <code>match</code> on an enum of commands using destructuring, ranges, match guards, and <code>@</code> bindings in one cohesive example.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Match guards let you add arbitrary boolean conditions to an arm, but they defeat exhaustiveness checking — the compiler can't prove the guard covers the case, so you still need a catch-all.` },
      ],
    },
    {
      id: "d09", date: "2026-07-27", week: "w2", title: "FastAPI dependencies",
      theme: "Depends done properly — DI, sub-dependencies, yield teardown.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 30, group: "g1",
          label: `<b>Supplement — Dependencies:</b> <code>Depends</code>, sub-dependencies, and <code>yield</code> for setup/teardown. <a href="https://fastapi.tiangolo.com/tutorial/dependencies/" target="_blank" rel="noopener">docs</a>` },
        { id: "t2", obj: F, cat: "api", est: 40, group: "g1",
          label: `Refactor DB-session and current-user into reusable <code>Depends</code>; add a role-check sub-dependency.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A <code>yield</code> dependency is FastAPI's answer to context managers — code before <code>yield</code> runs on entry, code after runs on exit even if the route raised.` },
      ],
      note: "Lighter FastAPI day — a likely Roadmap-2 overlap date.",
    },
    {
      id: "d10", date: "2026-07-28", week: "w2", title: "Advanced Rust I",
      theme: "Unsafe & advanced lifetimes — Ch19 part 1.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 45, group: "g1",
          label: `Rust — <b>Ch19.1–19.2</b>: <b>Unsafe Rust</b> (raw pointers, unsafe fns, statics) and <b>advanced lifetimes</b> (pp 443–459).` },
        { id: "t2", obj: R, cat: "code", est: 30, group: "g1",
          label: `Write a small <code>unsafe</code> block that dereferences a raw pointer and a <code>split_at_mut</code>-style function; document <i>why</i> each unsafe use is sound.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 See also — <a href="https://doc.rust-lang.org/nomicon/" target="_blank" rel="noopener">The Rustonomicon</a> is the deep dive on everything <code>unsafe</code>; bookmark for after the book.` },
      ],
    },

    /* ---------------- Week 3 ---------------- */
    {
      id: "d11", date: "2026-07-30", week: "w3", title: "Advanced Rust II",
      theme: "Advanced traits/types/closures — the Book's most reference-like pages.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 45, group: "g1",
          label: `Rust — <b>Ch19.3–19.5</b>: advanced traits (associated types, operator overloading, supertraits, newtype), advanced types (<code>!</code>, DSTs, <code>Sized</code>), function pointers & returning closures (pp 460–478).` },
        { id: "t2", obj: R, cat: "project", est: 55, group: "g1",
          label: `<b>Integrative tryout:</b> a mini units library — a <code>Meters(f64)</code> newtype implementing <code>Add</code> (operator overloading) with an associated <code>Output</code> type, plus a supertrait for <code>Display</code>. Ties four Ch19 topics together.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The newtype pattern (<code>struct Wrapper(Vec&lt;String&gt;)</code>) is how you implement a foreign trait on a foreign type — the orphan rule's escape hatch.` },
        { id: "s2", type: "callout", label: `🔗 See also — ergonomic errors with <a href="https://docs.rs/anyhow" target="_blank" rel="noopener">anyhow</a> (apps) and <a href="https://docs.rs/thiserror" target="_blank" rel="noopener">thiserror</a> (libs); the Book only covers <code>Box&lt;dyn Error&gt;</code>.` },
      ],
    },
    {
      id: "d12", date: "2026-07-31", week: "w3", title: "FastAPI testing",
      theme: "TestClient + background tasks — the book barely covers testing.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `<b>Supplement — Testing:</b> <code>TestClient</code> patterns. <a href="https://fastapi.tiangolo.com/tutorial/testing/" target="_blank" rel="noopener">docs</a> · <b>Background Tasks.</b> <a href="https://fastapi.tiangolo.com/tutorial/background-tasks/" target="_blank" rel="noopener">docs</a>` },
        { id: "t2", obj: F, cat: "code", est: 45, group: "g1",
          label: `Add a <code>pytest</code> suite covering each router (happy + auth-failure paths); add one <code>BackgroundTasks</code> endpoint (e.g. "send email" stub).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>TestClient</code> wraps httpx/Starlette and runs the app in-process — no server, no ports. Override dependencies with <code>app.dependency_overrides</code> to swap the DB for a test one.` },
      ],
    },
    {
      id: "d13", date: "2026-08-01", week: "w3", title: "Web server I — single-threaded",
      theme: "Ch20 begins. It IS the tryout — one continuous project.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 20, group: "g1",
          label: `Rust — <b>Ch20.1</b>: listen on TCP, read the request, anatomy of an HTTP request, write a response, return real HTML, validate & route (pp 480–489).` },
        { id: "t2", obj: R, cat: "project", est: 60, group: "g1",
          label: `<b>Build:</b> the single-threaded web server end to end — serve <code>hello.html</code> and a 404 page, selectively by request line.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This is raw <code>std::net::TcpListener</code> — no framework. Seeing HTTP as bytes on a socket makes every web framework afterward feel less magical.` },
      ],
    },
    {
      id: "d14", date: "2026-08-03", week: "w3", title: "Web server II — the thread pool",
      theme: "The heavy section: design a ThreadPool API from scratch (pp 490–508).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 30, group: "g1",
          label: `Rust — <b>Ch20.2</b>: simulate a slow request, then design & build the <b>thread pool</b> — <code>ThreadPool</code>, <code>Worker</code>, channels/<code>Job</code>, <code>Send</code> closures (pp 490–508).` },
        { id: "t2", obj: R, cat: "project", est: 75, group: "g1",
          label: `<b>Build:</b> implement the full thread pool and serve concurrent requests; verify a slow route no longer blocks others.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Everything from your Ch16 worker-pool tryout pays off here — same <code>mpsc</code> + <code>Arc&lt;Mutex&gt;</code> shape, now behind a clean API with <code>FnOnce</code> boxed jobs.` },
      ],
      note: "Heaviest Rust day of the roadmap — no FastAPI block.",
    },
    {
      id: "d15", date: "2026-08-04", week: "w3", title: "FastAPI microservices (light)",
      theme: "Ch6 is prose-heavy/thin — read for concepts, keep it light (overlap day).",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 30,
          label: `FastAPI — <b>Ch6 Microservices</b>: principles, scaling, Redis/RabbitMQ, API gateway (pp 85–100). Conceptual — note ideas, don't rabbit-hole.` },
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
      id: "d16", date: "2026-08-06", week: "w4", title: "Web server III — graceful shutdown",
      theme: "Finish Ch20: Drop for the pool, signal workers to stop (pp 509–515).",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 20, group: "g1",
          label: `Rust — <b>Ch20.3</b>: implement <code>Drop</code> for <code>ThreadPool</code>, signal threads to stop, graceful shutdown & cleanup (pp 509–515).` },
        { id: "t2", obj: R, cat: "project", est: 45, group: "g1",
          label: `<b>Finish the project:</b> graceful shutdown after N requests; ensure every worker joins cleanly. 🎉 The Book's final project is done.` },
        { id: "t3", obj: R, cat: "challenge", est: 40, optional: true,
          label: `<b>Extend:</b> add a real router (a couple of routes) and a small static-file handler to your server.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>Drop</code> order matters: you must drop the sender first so the workers' <code>recv()</code> returns <code>Err</code> and their loops exit — otherwise <code>join()</code> hangs forever.` },
      ],
    },
    {
      id: "d17", date: "2026-08-07", week: "w4", title: "FastAPI deploy",
      theme: "Ch7 is thin on code — supplement with a real Docker deploy.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `FastAPI — <b>Ch7 Deploying in Production</b>: Uvicorn vs Gunicorn, env security, Docker, AWS/GCP overviews (pp 101–116).` },
        { id: "t2", obj: F, cat: "project", est: 45, group: "g1",
          label: `<b>Supplement:</b> write a real multi-stage <code>Dockerfile</code> for the CRUD app (uvicorn workers), a <code>.env</code>, and run it locally in a container.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ The book's AWS/GCP sections are 2–3 pages each — overviews, not runbooks. For a real deploy, follow the official Uvicorn/Gunicorn deployment docs + your container platform's guide.` },
      ],
    },
    {
      id: "d18", date: "2026-08-08", week: "w4", title: "Lifespan & Pydantic v2",
      theme: "Modernize the app — kill deprecated patterns.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `<b>Supplement — Lifespan events</b> <a href="https://fastapi.tiangolo.com/advanced/events/" target="_blank" rel="noopener">docs</a> and the <b>Pydantic v1→v2 migration</b> <a href="https://docs.pydantic.dev/latest/migration/" target="_blank" rel="noopener">guide</a>.` },
        { id: "t2", obj: F, cat: "code", est: 40, group: "g1",
          label: `Refactor: replace any <code>@app.on_event</code> with a <code>lifespan=</code> context manager; move to Pydantic-v2 APIs (<code>model_dump</code>, <code>field_validator</code>, <code>model_config</code>).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Deprecated: <code>@app.on_event("startup"/"shutdown")</code> → use <code>lifespan=</code>. It's all-lifespan or all-events, never both.` },
        { id: "s2", type: "callout", label: `🆕 Pydantic v2 renames: <code>.dict()</code>→<code>.model_dump()</code>, <code>@validator</code>→<code>@field_validator</code>, <code>class Config</code>→<code>model_config</code>. The <code>bump-pydantic</code> codemod automates most of it.` },
      ],
    },
    {
      id: "d19", date: "2026-08-10", week: "w4", title: "Rust appendices & macros",
      theme: "Reference appendices (light) + the one with a real example: macros.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 25,
          label: `Rust — <b>Appendix D Macros</b>: <code>macro_rules!</code> vs functions, then the worked <b>procedural derive macro</b> (<code>hello_macro</code>) (pp 531–540).` },
        { id: "t2", obj: R, cat: "code", est: 35, optional: true,
          label: `<b>Bonus:</b> build the <code>hello_macro</code> derive crate yourself and derive it on a struct.`,
          fallback: { est: 15, label: `Just read & run the provided <code>hello_macro</code> code.` } },
        { id: "t3", obj: R, cat: "alt", est: 15, optional: true,
          label: `<b>Skim (reference):</b> Appendices A Keywords, B Operators, C Derivable Traits (pp 517–530) — bookmark, don't memorize.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <code>macro_rules!</code> is pattern-matching on token trees; procedural macros are Rust programs that run at compile time over a <code>TokenStream</code>. The book only samples both — a whole world (<code>syn</code>/<code>quote</code>) lies beyond.` },
      ],
    },
    {
      id: "d20", date: "2026-08-11", week: "w4", title: "Capstone I — real API",
      theme: "Pull FastAPI together: a CRUD+auth+tests service from scratch.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 80, group: "g1",
          label: `<b>Capstone (part 1):</b> design a fresh API (e.g. a bookmarks service) — models, <code>APIRouter</code> modules, DB layer, and CRUD routes with <code>response_model</code>. No book — you drive it.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: add pagination + filtering query params and a <code>response_model</code> for the list endpoint.` },
      ],
    },

    /* ---------------- Week 5 ---------------- */
    {
      id: "d21", date: "2026-08-13", week: "w5", title: "Capstone II — auth & tests",
      theme: "Finish the capstone with JWT auth and a real test suite.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 70, group: "g1",
          label: `<b>Capstone (part 2):</b> add JWT auth (pwdlib+PyJWT), protect the write routes, and cover it all with <code>pytest</code> + <code>TestClient</code> (incl. 401 paths). 🎉 Capstone done.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 If you can override the DB dependency in tests and assert on 401s, you've internalized the two hardest FastAPI ideas: DI and security. That's the whole point of the supplement track.` },
      ],
    },
    {
      id: "d22", date: "2026-08-14", week: "w5", title: "Async SQLAlchemy 2.0",
      theme: "The async DB pattern the book skipped.",
      tasks: [
        { id: "t1", obj: F, cat: "read", est: 25, group: "g1",
          label: `<b>Supplement — async SQLAlchemy 2.0:</b> <code>AsyncSession</code>, <code>async_sessionmaker</code>, <code>select()</code>. <a href="https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html" target="_blank" rel="noopener">docs</a>` },
        { id: "t2", obj: F, cat: "api", est: 45, group: "g1",
          label: `Add one fully-async CRUD router to the capstone using an async engine; benchmark it against the sync one informally.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 SQLAlchemy 2.0 unifies ORM+Core behind <code>select()</code> and drops implicit autocommit / legacy <code>Query</code>. <a href="https://docs.sqlalchemy.org/en/20/changelog/migration_20.html" target="_blank" rel="noopener">migration guide</a>` },
      ],
    },
    {
      id: "d23", date: "2026-08-15", week: "w5", title: "Rust consolidation",
      theme: "Cement the advanced material with one integrative exercise.",
      tasks: [
        { id: "t1", obj: R, cat: "project", est: 60, group: "g1",
          label: `<b>Combine-topics tryout:</b> extend your Ch20 web server with a <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> in-memory store and a couple of JSON routes — exercises smart pointers + concurrency + traits together.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 After the Book: <a href="https://github.com/rust-lang/rustlings" target="_blank" rel="noopener">Rustlings</a>, <a href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noopener">Rust by Example</a>, <a href="https://github.com/kyclark/command-line-rust" target="_blank" rel="noopener">Command-Line Rust</a>, then async (tokio) for real network services.` },
      ],
    },
    {
      id: "d24", date: "2026-08-17", week: "w5", title: "Checkpoint — books closed",
      theme: "The Book (Ch15–20) and Mastering FastAPI (Ch4–7) are done. Take stock before the extension weeks.",
      tasks: [
        { id: "t1", obj: R, cat: "review", est: 30, group: "g1",
          label: `Rust — skim your notes across Ch15–20; list the 3 ideas you'd most want to re-read (likely lifetimes, unsafe, or the thread pool).` },
        { id: "t2", obj: F, cat: "review", est: 30, group: "g1",
          label: `FastAPI — write a one-page "cheat sheet" of the DI + security + async patterns you built; note gaps for a future project.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Both books are finished a full two weeks before the plan ends — that slack is intentional. Weeks 6–7 turn it into the two things the Book skips and the capstone that fuses both stacks. If you slipped anywhere, this is where you catch up guilt-free.` },
      ],
      note: "Milestone checkpoint — the core is done; weeks 6–7 are deepening + buffer.",
    },

    /* ================================================================ *
     *  Week 6 — Async Rust & real deployment  (extension: the Book's
     *  biggest gap is async; here we fill it and ship the FastAPI capstone
     *  for real. Deliberately lighter/flexible — this is your buffer.)
     * ================================================================ */
    {
      id: "d25", date: "2026-08-20", week: "w6", title: "Async Rust I — futures & tokio",
      theme: "The Book is threads-only. Meet the other half of Rust concurrency.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 35, group: "g1",
          label: `Rust — read the <a href="https://rust-lang.github.io/async-book/" target="_blank" rel="noopener">Async Book</a> §1–3 (futures, <code>async</code>/<code>.await</code>, the executor model) + the <a href="https://tokio.rs/tokio/tutorial" target="_blank" rel="noopener">Tokio</a> "Hello Tokio" + "Spawning" chapters.` },
        { id: "t2", obj: R, cat: "code", est: 45, group: "g1",
          label: `Build a small tokio program: spawn several async tasks that sleep and race, and <code>join!</code> them. Feel how <code>.await</code> yields vs a blocking thread.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Bridge — your Ch16 worker-pool and Ch20 thread pool used OS threads + <code>mpsc</code>. Async is the same idea (concurrent work, message passing) but cooperatively scheduled on a runtime. <code>tokio::sync::mpsc</code> is the async twin of <code>std::sync::mpsc</code>.` },
        { id: "s2", type: "hint", label: `💡 A <code>Future</code> is a state machine the compiler builds from your <code>async fn</code>; it does nothing until polled by an executor. That "lazy until awaited" model is the single biggest difference from threads.` },
      ],
    },
    {
      id: "d26", date: "2026-08-21", week: "w6", title: "FastAPI — ship the capstone",
      theme: "Take the Week-4/5 capstone from 'runs locally' to 'deployed'.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 50, group: "g1",
          label: `Deploy your capstone's Docker image to a real host (Fly.io / Railway / a VPS): env-based secrets, a managed Postgres, and a public URL with HTTPS.` },
        { id: "t2", obj: F, cat: "read", est: 20, group: "g1",
          label: `Add <b>structured logging</b> + a <code>/health</code> endpoint; skim the <a href="https://fastapi.tiangolo.com/deployment/concepts/" target="_blank" rel="noopener">deployment concepts</a> doc (workers, proxies, restarts).` },
        { id: "t3", obj: F, cat: "project", est: 30, optional: true,
          label: `<b>Bonus:</b> wire a GitHub Actions job that runs your pytest suite and builds the image on push.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ First real deploy checklist: no secrets in the image, <code>--workers</code> tuned to CPUs, DB migrations run on release (not on every boot), and logs going to stdout so the platform captures them.` },
      ],
    },
    {
      id: "d27", date: "2026-08-22", week: "w6", title: "Async Rust II — an async web server",
      theme: "Rebuild the Ch20 server the async way — the payoff of d25.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 25, group: "g1",
          label: `Rust — read the Tokio tutorial "I/O" + "Select" chapters; skim <a href="https://docs.rs/axum" target="_blank" rel="noopener">axum</a>'s hello-world to see a real async framework.` },
        { id: "t2", obj: R, cat: "project", est: 55, group: "g1",
          label: `<b>Build:</b> re-implement your Ch20 web server on <code>tokio</code> (async <code>TcpListener</code>, a task per connection). Compare it to the thread-pool version — no pool needed, the runtime multiplexes.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Notice what disappeared: no manual <code>ThreadPool</code>, no <code>Arc&lt;Mutex&gt;</code> around the job queue. The runtime <i>is</i> the pool. That's why async won for network I/O.` },
      ],
    },
    {
      id: "d28", date: "2026-08-24", week: "w6", title: "Buffer / catch-up",
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
      id: "d29", date: "2026-08-27", week: "w7", title: "Integration capstone I — design",
      theme: "One system that uses both languages: a Rust service behind a FastAPI gateway.",
      tasks: [
        { id: "t1", obj: R, cat: "read", est: 20, group: "g1",
          label: `Sketch the architecture: a small <b>Rust</b> service (your async server from d27, exposing a JSON endpoint or two) fronted by a <b>FastAPI</b> gateway that auth-gates and proxies to it.` },
        { id: "t2", obj: R, cat: "project", est: 60, group: "g1",
          label: `<b>Build (Rust side):</b> give the async server a couple of real JSON routes backed by an <code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> (or sqlite) store — exercises smart pointers + concurrency + traits together.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is the project d24 used to only hint at. Doing it proves you can pick the right tool per layer: Rust for the hot path, FastAPI for the ergonomic edge.` },
      ],
    },
    {
      id: "d30", date: "2026-08-28", week: "w7", title: "Integration capstone II — wire it up",
      theme: "One end-to-end request path across both services.",
      tasks: [
        { id: "t1", obj: F, cat: "project", est: 70, group: "g1",
          label: `<b>Build (FastAPI side):</b> a gateway that validates a JWT, forwards the request to the Rust service (httpx), and shapes the response with a <code>response_model</code>. Get one request flowing user → FastAPI → Rust → back.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: add a timeout + graceful error when the Rust service is down, so the gateway degrades instead of hanging. Real systems fail at the seams — practice the seam.` },
      ],
    },
    {
      id: "d31", date: "2026-08-29", week: "w7", title: "Polish & tests",
      theme: "Make the capstone something you'd show.",
      tasks: [
        { id: "t1", obj: F, cat: "code", est: 40, group: "g1",
          label: `Add a <code>pytest</code> happy-path + one failure test for the gateway; write a short README with a run command and an architecture line.` },
        { id: "t2", obj: R, cat: "project", est: 30, optional: true,
          label: `<b>Bonus:</b> dockerize both services with a <code>docker-compose.yml</code> so the whole thing comes up with one command.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A capstone you can run with one command and explain in one sentence is worth more than three half-finished ones. Depth over breadth for the finale.` },
      ],
    },
    {
      id: "d32", date: "2026-08-31", week: "w7", title: "Grand retro & next-project plan",
      theme: "Close the journey; capture what you learned and where you go next.",
      tasks: [
        { id: "t1", obj: R, cat: "review", est: 35, group: "g1",
          label: `Write the one-page map: the Rust ideas you'll reuse (ownership, traits, concurrency, async) and the FastAPI ideas (DI, security, async DB). Note the 2–3 you'd re-read first.` },
        { id: "t2", obj: F, cat: "review", est: 25, group: "g1",
          label: `Pick the <b>one</b> next real project (a service you actually want) and write its first three tasks while the momentum is hot. Momentum beats a clean stop. 🎉 Roadmap complete.` },
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
