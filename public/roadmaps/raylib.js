// raylib.js — SIDE-TRACK roadmap "Big Bang" (kind:"side").
//
// Purpose: learn raylib (C++) and the graphics/simulation math behind it, with a
// single capstone — a gravitational N-body "Big Bang" simulation that starts as a
// black void, bursts, and self-organizes into cosmic structure. Like Bedrock this
// is NOT one linear source: each resource is an ordered THREAD, and the threads
// are INTERLEAVED across the calendar so consecutive side-days switch focus (a
// course video one day, the physics math the next, a build the next). A thread
// always advances in order when it reappears.
//
// The five threads (objectives):
//   course   — Udemy "Learn Raylib: C++" (Muhammad Khalid), 7 sections. Drives the
//              raylib API early, then TAPERS once section 6 ("Projects") is reached
//              — exactly as the owner asked.
//   noc      — "The Nature of Code" (Shiffman). The CPU-side physics: vectors,
//              forces, gravitational attraction, particle systems, integration. It
//              RAMPS UP to become the main focus after the course tapers.
//   examples — raylib practice: the official examples gallery + porting the Clear
//              Code ~4.5h Python raylib video to C++ + Programming-With-Nick C++ builds.
//   shaders  — "The Book of Shaders" (GLSL). The GPU-side look: glowing particles,
//              fBm nebulae, bloom. Begins only once Nature of Code is ~70–80% read.
//   project  — the Big Bang simulation itself, built version by version (v0 → capstone).
//
// Cadence: 2 side-days/week, on weekdays that change from week to week and are chosen
// so the combined day across all roadmaps stays light — see the 2026-09-25 note.
// One ~40–95 min card each.
// Progress/effort stay OFF the main track (kind:"side"); they combine only with the
// other side track (Bedrock) and in the Today panel's "Main + Side" line.
//
// References were researched & link-verified 2026-07-18. Book citations give
// chapter/section (page numbers drift across editions). Editions: Nature of Code
// v1 (2012, the owner's local PDF); The Book of Shaders (offline PDF snapshot).
// Note: the Udemy per-lecture titles are behind a bot wall — section titles/counts
// are confirmed, so course tasks are grouped by SECTION, which is what matters.

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
// For this file: 54 → 80 cards, 19 → 40 weeks, 2026-09-24 → 2027-06-29. Required work
// 69.8h → 82.3h. 2 cards a week; 33 tasks carried, 26 continuation cards, 64 split
// parts. The owner's own example drove this one: a Nature of Code chapter was read AND
// practised AND ported in a single task on a single day. Each chapter is now split at
// its section boundaries, and the p5.js exercises and the raylib port are separate
// sittings that the planner is free to place on separate cards.

import { registerRoadmap } from "../assets/js/registry.js";

const COURSE = "course", NOC = "noc", EX = "examples", SH = "shaders", PROJ = "project";

registerRoadmap({
  slug: "raylib",
  title: "Big Bang",
  icon: "🌌",
  kind: "side",
  subtitle: "Learn raylib (C++) and the math of motion by building a gravitational N-body Big Bang simulation — from an empty window to a shader-lit universe.",
  accent: "#a855f7",
  schemaVersion: 1,
  cadence: { activeDaysPerWeek: [2] },

  objectives: [
    { id: COURSE, title: "raylib course (Udemy)",          tier: "primary", color: "#38bdf8" },
    { id: NOC,    title: "Nature of Code (physics)",       tier: "primary", color: "#34d399" },
    { id: EX,     title: "Examples & practice",            tier: "primary", color: "#f59e0b" },
    { id: SH,     title: "Shaders (Book of Shaders)",      tier: "primary", color: "#ec4899" },
    { id: PROJ,   title: "Big Bang simulation",            tier: "primary", color: "#c084fc" },
  ],

  // Re-paced 2026-07-20 to a denser 3 days/week (from the old ~2/week front) so the
  // simple early material moves faster; the arc now finishes ~4 weeks sooner (Jan 8).
  weeks: [
    { id: "w1", title: "Week 1 — First pixels: install raylib & open a window", start: "2026-09-23" },
    { id: "w2", title: "Week 2 — Randomness & Perlin noise — how to seed a universe", start: "2026-09-30" },
    { id: "w3", title: "Week 3 — Shapes I: the coordinate system, rectangles & colour", start: "2026-10-07" },
    { id: "w4", title: "Week 4 — Vectors I: the substrate of everything that moves", start: "2026-10-14" },
    { id: "w5", title: "Week 5 — Shapes II: motion with sin & cos; Vectors II: velocity, acceleration & a mover", start: "2026-10-21" },
    { id: "w6", title: "Week 6 — Orientation: the examples gallery & a 20-minute setup", start: "2026-10-28" },
    { id: "w7", title: "Week 7 — Shapes III: triangles, bezier curves & wrapping up drawing; …", start: "2026-11-04" },
    { id: "w8", title: "Week 8 — Input: keyboard & mouse", start: "2026-11-11" },
    { id: "w9", title: "Week 9 — Forces II: gravity, friction & drag", start: "2026-11-18" },
    { id: "w10", title: "Week 10 — The update loop & delta-time, done right", start: "2026-11-25" },
    { id: "w11", title: "Week 11 — Forces III: gravitational attraction — the N-body kernel ⚛️; Collision detection", start: "2026-12-02" },
    { id: "w12", title: "Week 12 — Port-along #1: Basics → Movement → Input (Clear Code)", start: "2026-12-09" },
    { id: "w13", title: "Week 13 — Oscillation I: angles, trig & polar coordinates", start: "2026-12-16" },
    { id: "w14", title: "Week 14 — Tilemaps & the 2D camera 🎮", start: "2026-12-23" },
    { id: "w15", title: "Week 15 — Oscillation II: waves, pendulums & springs", start: "2026-12-30" },
    { id: "w16", title: "Week 16 — An OOP build: Conway's Game of Life (Nick, C++); …", start: "2027-01-06" },
    { id: "w17", title: "Week 17 — Particle systems I: one particle → a system", start: "2027-01-13" },
    { id: "w18", title: "Week 18 — Particle systems II: forces & repellers", start: "2027-01-20" },
    { id: "w19", title: "Week 19 — Projects II: a second build + consolidation; 🌌 The simulation begins", start: "2027-01-27" },
    { id: "w20", title: "Week 20 — Particle systems III: textures & additive blending ✨", start: "2027-02-03" },
    { id: "w21", title: "Week 21 — Big Bang v1: the burst 💥; Music & GUI I: buttons, sliders & a control panel", start: "2027-02-10" },
    { id: "w22", title: "Week 22 — Port-along #2: Cameras → Classes → Timers → Animations", start: "2027-02-17" },
    { id: "w23", title: "Week 23 — Big Bang v2: gravity switches on — real N-body; Music & GUI II", start: "2027-02-24" },
    { id: "w24", title: "Week 24 — Integration methods: Euler vs Verlet (stability) 🩹", start: "2027-03-03" },
    { id: "w25", title: "Week 25 — Big Bang v3: thousands of particles; Draw-count & blending study", start: "2027-03-10" },
    { id: "w26", title: "Week 26 — Big Bang v4: the glow look in 2D ✨", start: "2027-03-17" },
    { id: "w27", title: "Week 27 — Big Bang v5: camera, trails & time controls; …", start: "2027-03-24" },
    { id: "w28", title: "Week 28 — Big Bang v6: Barnes–Hut & softening tuning; …", start: "2027-03-31" },
    { id: "w29", title: "Week 29 — Big Bang v7: the third dimension; …", start: "2027-04-07" },
    { id: "w30", title: "Week 30 — Big Bang v8: 3D N-body & orbit cinematics", start: "2027-04-14" },
    { id: "w31", title: "Week 31 — Consolidate the physics (Nature of Code ~70–80%)", start: "2027-04-21" },
    { id: "w32", title: "Week 32 — Book of Shaders I; Book of Shaders II", start: "2027-04-28" },
    { id: "w33", title: "Week 33 — Book of Shaders III: distance fields → a glowing particle", start: "2027-05-05" },
    { id: "w34", title: "Week 34 — Big Bang v9: GPU glow on every particle", start: "2027-05-12" },
    { id: "w35", title: "Week 35 — Book of Shaders IV: noise", start: "2027-05-19" },
    { id: "w36", title: "Week 36 — Book of Shaders V: fBm → a nebula", start: "2027-05-26" },
    { id: "w37", title: "Week 37 — Big Bang v10: the cosmos gets a nebula; Book of Shaders VI: blur & blend → bloom", start: "2027-06-02" },
    { id: "w38", title: "Week 38 — Big Bang v11: bloom post-process", start: "2027-06-09" },
    { id: "w39", title: "Week 39 — Finish the physics tail & consider GPU N-body; …", start: "2027-06-16" },
    { id: "w40", title: "Week 40 — 🎓 Capstone: the Big Bang, from void to cosmos", start: "2027-06-23" },
  ],

  days: [
    /* ---------------- Week 1 ---------------- */
    {
      id: "d01", date: "2026-09-24", week: "w1", title: "First pixels: install raylib & open a window",
      theme: "raylib course · thread part 1 — the whole library is one draw loop.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 50,
          lead: `<b>raylib course ①</b> — get a window on screen in C++. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `Watch Udemy <a href="https://www.udemy.com/course/learn-raylib-c-fast-and-easy-graphics-library/" target="_blank" rel="noopener">"Learn Raylib: C++"</a> §1 Introduction + §2 Setup & Installation.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🌌 The "Big Bang" side track begins. Two short days a week, one focus each — separate from your main roadmaps. Goal: learn raylib + graphics/simulation math by building a gravitational Big Bang sim.` },
        { id: "s2", type: "hint", label: `💡 Two side-days a week, on different weekdays each week — placed so your whole day, across every roadmap, stays light. It never piles onto a heavy day.` },
      ],
      note: "The journey starts with an empty black window — which is, fittingly, exactly how the universe starts here.",
    },
    {
      id: "d02", date: "2026-09-27", week: "w1", title: "First pixels: install raylib & open a window (cont.)",
      theme: "Finish “First pixels: install raylib & open a window” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d01", obj: COURSE, cat: "watch", est: 50,
          lead: `<b>raylib course ①</b> — get a window on screen in C++. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 30, label: `Install raylib + a C++ toolchain (VS Code + mingw-gcc on Windows, package on Linux).`, note: `Shortcut past toolchain pain: the educ8s <a href="https://github.com/educ8s/Raylib-CPP-Starter-Template-for-VSCODE" target="_blank" rel="noopener">Raylib C++ Starter Template for VS Code</a>.` },
            { id: "s2", cat: "code", est: 20, label: `Write the skeleton: <code>InitWindow()</code> → <code>while(!WindowShouldClose()){ BeginDrawing(); ClearBackground(BLACK); EndDrawing(); }</code> → <code>CloseWindow()</code>.`, note: `Keep the <a href="https://www.raylib.com/cheatsheet/cheatsheet.html" target="_blank" rel="noopener">cheatsheet</a> open — the whole API on one page.` },
          ],
          model: `All of raylib is one loop: <code>InitWindow</code> → (each frame) <code>BeginDrawing … EndDrawing</code> → <code>CloseWindow</code>. Everything else is just <i>what you draw</i> between Begin/EndDrawing.`,
          cards: [
            { q: `The four calls that bracket every raylib program?`, a: `<code>InitWindow()</code>, then each frame <code>BeginDrawing()…EndDrawing()</code>, then <code>CloseWindow()</code>.` },
            { q: `What does <code>WindowShouldClose()</code> return?`, a: `<code>true</code> when ESC or the window's close button fires — the game-loop exit condition.` },
          ] },
      ],
    },

    /* ---------------- Week 2 ---------------- */
    {
      id: "d03", date: "2026-10-02", week: "w2", title: "Randomness & Perlin noise — how to seed a universe",
      theme: "Nature of Code · thread part 1 — believable randomness isn't flat.",
      tasks: [
        { id: "t1", obj: NOC, cat: "read", est: 60,
          lead: `<b>Nature of Code ①</b> — the Introduction: random walks & smoother randomness. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read NoC <a href="https://natureofcode.com/random/" target="_blank" rel="noopener">Introduction</a> I.1–I.3: the random walker, and why a uniform distribution looks wrong. (Local PDF pp.1–26.)` },
            { id: "s2", est: 30, label: "Then the Introduction I.4–I.6: non-uniform & Gaussian distributions, then Perlin noise." },
          ] },
      ],
    },
    {
      id: "d04", date: "2026-10-06", week: "w2", title: "Randomness & Perlin noise — how to seed a universe (cont.)",
      theme: "Finish “Randomness & Perlin noise — how to seed a universe” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d03", obj: NOC, cat: "read", est: 65,
          lead: `<b>Nature of Code ①</b> — the Introduction: random walks & smoother randomness. (2/2)`,
          sub: [
            { id: "s1", cat: "exercise", est: 35, label: `Work the Introduction's own <b>exercises in p5.js</b> as you read (the <a href="https://editor.p5js.org/" target="_blank" rel="noopener">p5 web editor</a> — no setup): a walker biased toward the mouse, a Gaussian paint-splatter, and a Perlin-noise walker.`, info: `<p>The book teaches through its exercises — reading them without running them is where understanding quietly goes missing.</p>
<p>p5.js is the book's native environment, so an exercise is a 5-line change rather than a C++ rebuild. Do them <b>here</b>, in the browser; the raylib port in the next step is what makes it stick in the language you're actually shipping.</p>` },
            { id: "s2", cat: "code", est: 30, label: `Port the Random Walker to raylib (<code>GetRandomValue</code> or your own RNG); then compare a uniform spread vs a Gaussian one on screen.`, note: `Watch the Gaussian one bunch toward the center while the uniform one fills evenly — that difference is the whole point.` },
          ],
          model: `Uniform random = evenly scattered; <b>Gaussian</b> clusters around a mean; <b>Perlin noise</b> = smooth, correlated randomness. A believable Big Bang seeds positions/velocities with Gaussian spread + a little noise — never flat uniform.`,
          cards: [
            { q: `Uniform vs Gaussian random for particle spread?`, a: `Uniform = evenly scattered; Gaussian = clustered around a center — more natural for a dense core with fewer outliers.` },
            { q: `What makes Perlin noise different from <code>random()</code>?`, a: `Consecutive values are correlated → smooth, organic variation instead of per-sample jitter.` },
          ] },
      ],
    },

    /* ---------------- Week 3 ---------------- */
    {
      id: "d05", date: "2026-10-07", week: "w3", title: "Shapes I: the coordinate system, rectangles & colour",
      theme: "raylib course · thread part 2 — and the y-axis trap that will bite every ported formula.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 60,
          lead: `<b>raylib course ②</b> — begin §3 Shapes: draw the primitives. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: "Udemy §3 Shapes (first part): the screen coordinate system and <code>DrawRectangle</code>/<code>DrawCircle</code>/<code>DrawLine</code>." },
            { id: "s2", est: 30, label: "Udemy §3 (continued): <code>Color</code> structs & constants, and the y-axis convention that will bite every ported formula." },
          ] },
      ],
    },
    {
      id: "d06", date: "2026-10-11", week: "w3", title: "Shapes I: the coordinate system, rectangles & colour (cont.)",
      theme: "Finish “Shapes I: the coordinate system, rectangles & colour” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d05", obj: COURSE, cat: "watch", est: 40,
          lead: `<b>raylib course ②</b> — begin §3 Shapes: draw the primitives. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: `Sketch a few compositions; note where the origin is and which way y grows.`, note: `Confirm it yourself: draw a dot at <code>(0,0)</code> — it lands top-left, and increasing y moves it <b>down</b>. That's the trap the model warns about.` },
          ],
          model: `raylib's origin is <b>top-left</b> and <b>+y points DOWN</b> (screen space) — the opposite of math's +y up. Every physics formula you port from Nature of Code must flip y (or draw through a flipped camera).`,
          cards: [
            { q: `Where is raylib's origin and which way is +y?`, a: `Top-left corner; <b>+y points down</b>.` },
            { q: `Why does that matter when porting Nature of Code?`, a: `NoC assumes +y up (math convention); you must flip y or use a camera, or gravity/forces point the wrong way.` },
          ] },
      ],
    },

    /* ---------------- Week 4 ---------------- */
    {
      id: "d07", date: "2026-10-16", week: "w4", title: "Vectors I: the substrate of everything that moves",
      theme: "Nature of Code · thread part 2 — position, velocity, acceleration are all one type.",
      tasks: [
        { id: "t1", obj: NOC, cat: "read", est: 90,
          lead: `<b>Nature of Code ②</b> — Ch.1 Vectors (the foundation of the whole sim). (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read NoC <a href="https://natureofcode.com/vectors/" target="_blank" rel="noopener">Ch.1</a> 1.1–1.3: what a vector is, adding and subtracting them.` },
            { id: "s2", est: 30, label: "Then NoC Ch.1 1.4–1.6: scaling, magnitude, and normalization." },
            { id: "s3", cat: "exercise", est: 30, label: `Do Ch.1's <b>exercises in p5.js</b> as you read: a bouncing ball rewritten with <code>PVector</code>, then a mover that accelerates toward the mouse (normalize → scale).` },
          ] },
      ],
    },
    {
      id: "d08", date: "2026-10-17", week: "w4", title: "Vectors I: the substrate of everything that moves (cont.)",
      theme: "Finish “Vectors I: the substrate of everything that moves” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d07", obj: NOC, cat: "read", est: 30,
          lead: `<b>Nature of Code ②</b> — Ch.1 Vectors (the foundation of the whole sim). (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 30, label: `Map <code>PVector</code> → raylib <code>Vector2</code> + <a href="https://www.raylib.com/cheatsheet/raymath_cheatsheet.html" target="_blank" rel="noopener">raymath</a> (<code>Vector2Add</code>/<code>Vector2Scale</code>/<code>Vector2Length</code>/<code>Vector2Normalize</code>).` },
          ],
          model: `A vector is just <code>(x,y)</code> plus operations. Position, velocity, and acceleration are <i>all</i> vectors. Normalize (length→1) then scale = "point me this way with that strength" — the move behind every force you'll write.`,
          cards: [
            { q: `What does normalizing a vector do, and why?`, a: `Scales it to length 1 (direction only); you then multiply by a magnitude to set strength.` },
            { q: `Which raymath calls replace PVector add / mult / mag?`, a: `<code>Vector2Add</code> / <code>Vector2Scale</code> / <code>Vector2Length</code> (and <code>Vector2Normalize</code>).` },
          ] },
      ],
    },

    /* ---------------- Week 5 ---------------- */
    {
      id: "d09", date: "2026-10-21", week: "w5", title: "Shapes II: motion with sin & cos",
      theme: "raylib course · thread part 3 — turning time into smooth movement.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 50,
          lead: `<b>raylib course ③</b> — §3 Shapes (middle): animate over time. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `Udemy §3: animating shapes with <code>GetTime()</code> / a frame counter and <code>sinf</code>/<code>cosf</code> — a pulsing radius, a circling dot.` },
          ] },
      ],
    },
    {
      id: "d10", date: "2026-10-26", week: "w5", title: "Vectors II: velocity, acceleration & a mover",
      theme: "Nature of Code · thread part 3 — the integration step that never changes.",
      tasks: [
        { id: "t1", carried: "d09", obj: COURSE, cat: "watch", est: 35,
          lead: `<b>raylib course ③</b> — §3 Shapes (middle): animate over time. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Make one shape orbit a point and one pulse; feel how amplitude & speed read on screen.` },
          ],
          model: `sin/cos turn a steadily rising time into smooth oscillation (−1…1). <code>radius = base + amp·sin(t)</code> pulses; <code>(cos t, sin t)</code> traces a circle. This is the seed of every orbit and wave you'll draw.`,
          cards: [
            { q: `How do you make a value oscillate smoothly over time?`, a: `<code>base + amplitude·sin(time)</code>.` },
            { q: `What does <code>(cos t, sin t)</code> trace as t increases?`, a: `A unit circle — the basis of angular/orbital motion.` },
          ] },
        { id: "t2", obj: NOC, cat: "code", est: 35,
          lead: `<b>Nature of Code ③</b> — Ch.1 (1.7–1.10): motion from vectors. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read NoC Ch.1 (1.7–1.10): velocity, acceleration, interactivity.` },
          ] },
      ],
    },

    /* ---------------- Week 6 ---------------- */
    {
      id: "d11", date: "2026-10-29", week: "w6", title: "Vectors II: velocity, acceleration & a mover (cont.)",
      theme: "Finish “Vectors II: velocity, acceleration & a mover” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d10", obj: NOC, cat: "code", est: 50,
          lead: `<b>Nature of Code ③</b> — Ch.1 (1.7–1.10): motion from vectors. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 50, label: `Build a <code>Mover</code> in raylib (<code>Vector2 pos,vel,acc</code>): each frame <code>vel += acc</code>, <code>pos += vel</code>, wrap at edges; then aim <code>acc</code> toward the mouse.`, note: `This is the integration step you'll never stop using — get the two lines and the edge-wrap right now, while there's only one body to watch.` },
          ],
          model: `The integration step never changes: set <code>acc</code> from forces → <code>vel += acc·dt</code> → <code>pos += vel·dt</code>. Everything in the whole simulation is just variations on <i>which forces feed <code>acc</code></i>.`,
          cards: [
            { q: `The three-line update every moving body runs?`, a: `<code>acc</code> from forces; <code>vel += acc·dt</code>; <code>pos += vel·dt</code>.` },
            { q: `Why multiply by dt (delta-time)?`, a: `Makes motion frame-rate independent — same speed at 30 or 144 fps.` },
          ] },
      ],
    },
    {
      id: "d12", date: "2026-10-30", week: "w6", title: "Orientation: the examples gallery & a 20-minute setup",
      theme: "Examples · thread part 1 — your API dictionary is 140 runnable programs.",
      tasks: [
        { id: "t1", obj: EX, cat: "watch", est: 80,
          lead: `<b>Examples ①</b> — meet the two resources you'll lean on all journey.`,
          sub: [
            { id: "s1", est: 40, label: `Watch Programming With Nick's <a href="https://www.youtube.com/watch?v=wVYKG_ch4yM&list=PLwR6ZGPvjVOSRywn9VCQ3yrRVruxzzuo9" target="_blank" rel="noopener">raylib tutorials playlist</a> — "Get Started in raylib in 20 minutes" + a VS Code / Raylib-6 setup video — to lock in a clean C++ workflow.` },
            { id: "s2", cat: "code", est: 40, label: `Browse <a href="https://www.raylib.com/examples.html" target="_blank" rel="noopener">raylib.com/examples.html</a>; run <code>core_basic_window</code>, <code>shapes_basic_shapes</code>, and <b><code>shapes_simple_particles</code></b>.`, note: `Bookmark <code>shapes_simple_particles</code> — it's the closest stock example to your capstone's emitter.` },
          ],
          model: `The examples gallery is your API dictionary — every feature has a runnable ~40-line example. Stuck? Find the example, read its <code>.c</code>, adapt. <code>shapes_simple_particles</code> is literally the seed of your capstone.`,
          cards: [
            { q: `Best first place to look when you don't know a raylib API?`, a: `The official examples gallery — a runnable minimal example per feature.` },
            { q: `Which stock example is closest to a particle emitter?`, a: `<code>shapes_simple_particles</code>.` },
          ] },
        { id: "t2", obj: EX, cat: "challenge", est: 30, optional: true,
          label: `<b>Bonus:</b> adapt <code>shapes_starfield_effect</code> into a slow-drifting starfield — a first taste of "many moving points".` },
      ],
    },

    /* ---------------- Week 7 ---------------- */
    {
      id: "d13", date: "2026-11-04", week: "w7", title: "Shapes III: triangles, bezier curves & wrapping up drawing",
      theme: "raylib course · thread part 4 — you now have every 2D primitive.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 85,
          lead: `<b>raylib course ④</b> — finish §3 Shapes.`,
          sub: [
            { id: "s1", est: 50, label: `Udemy §3 (final third): triangles, polygons, bezier curves, line thickness. Complete the Shapes section.` },
            { id: "s2", cat: "code", est: 35, label: `Draw a "glow" test: stack many translucent circles at one point and watch the center brighten.`, note: `This stacked-circle glow is your baseline — you'll replace it with a GPU shader later and compare.` },
          ],
          model: `With shapes + colour + time you can already draw anything 2D. A "glowing particle" is just many translucent circles drawn additively — you'll upgrade that to a GPU shader later, but the underlying shape math is the same.`,
          cards: [
            { q: `Before shaders, what makes a particle "glow"?`, a: `Stack translucent circles with additive blending — bright where they overlap.` },
            { q: `What's a bezier curve useful for in this project?`, a: `Smooth trails/paths — particle tails and camera moves.` },
          ] },
      ],
    },
    {
      id: "d14", date: "2026-11-10", week: "w7", title: "Forces I: Newton's laws & force accumulation",
      theme: "Nature of Code · thread part 4 — sum the forces, get one acceleration.",
      tasks: [
        { id: "t1", obj: NOC, cat: "read", est: 30,
          lead: `<b>Nature of Code ④</b> — Ch.2 Forces (2.1–2.5). (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read NoC <a href="https://natureofcode.com/forces/" target="_blank" rel="noopener">Ch.2</a> 2.1–2.3: Newton’s laws, and <code>a = F/m</code> as code.` },
          ] },
      ],
    },

    /* ---------------- Week 8 ---------------- */
    {
      id: "d15", date: "2026-11-13", week: "w8", title: "Forces I: Newton's laws & force accumulation (cont.)",
      theme: "Finish “Forces I: Newton's laws & force accumulation” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d14", obj: NOC, cat: "read", est: 90,
          lead: `<b>Nature of Code ④</b> — Ch.2 Forces (2.1–2.5). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: "Then NoC Ch.2 2.4–2.5: force accumulation, and what mass changes." },
            { id: "s2", cat: "exercise", est: 30, label: `Do Ch.2's <b>exercises in p5.js</b> as you read: wind + gravity on a mover, then give bodies different masses and watch the same force move them differently.` },
            { id: "s3", cat: "code", est: 35, label: `Add <code>applyForce(Vector2 f){ acc += f/mass; }</code> to your Mover; push it with a couple of forces at once.`, note: `Zero <code>acc</code> at the end of every frame — forces are re-summed fresh each step, not carried over.` },
          ],
          model: `<code>a = F/m</code>, and forces <b>add</b>: each frame sum every force into one net acceleration, integrate, then zero <code>acc</code>. "Accumulate forces → one acceleration" is the heart of the N-body loop.`,
          cards: [
            { q: `How do multiple forces combine on a body?`, a: `They sum (vector addition) into one net force → one acceleration <code>a = ΣF/m</code>.` },
            { q: `Why divide force by mass when accumulating?`, a: `Newton's 2nd law: heavier bodies accelerate less under the same force.` },
          ] },
      ],
    },
    {
      id: "d16", date: "2026-11-16", week: "w8", title: "Input: keyboard & mouse",
      theme: "raylib course · thread part 5 — held vs pressed, the #1 input bug.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 40,
          lead: `<b>raylib course ⑤</b> — §4 User Input (first half). (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Udemy §4: <code>IsKeyDown</code>/<code>IsKeyPressed</code>, <code>GetMousePosition</code>, mouse buttons.` },
          ] },
      ],
    },

    /* ---------------- Week 9 ---------------- */
    {
      id: "d17", date: "2026-11-21", week: "w9", title: "Input: keyboard & mouse (cont.)",
      theme: "Finish “Input: keyboard & mouse” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d16", obj: COURSE, cat: "watch", est: 35,
          lead: `<b>raylib course ⑤</b> — §4 User Input (first half). (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Move a shape with WASD/arrows (held → <code>IsKeyDown</code>); drag one with the mouse.`, note: `If a toggle fires twice per press, you used <code>IsKeyDown</code> where <code>IsKeyPressed</code> was meant — the #1 input bug.` },
          ],
          model: `<code>IsKeyDown</code> = held (continuous — movement); <code>IsKeyPressed</code> = the single frame it went down (toggles/actions). Confusing the two is the most common input bug.`,
          cards: [
            { q: `<code>IsKeyDown</code> vs <code>IsKeyPressed</code>?`, a: `Down = true every frame it's held (movement); Pressed = true only the frame it went down (toggles/fire).` },
            { q: `How do you read the cursor position?`, a: `<code>GetMousePosition()</code> → <code>Vector2</code>.` },
          ] },
      ],
    },
    {
      id: "d18", date: "2026-11-24", week: "w9", title: "Forces II: gravity, friction & drag",
      theme: "Nature of Code · thread part 5 — a constant field is NOT attraction.",
      tasks: [
        { id: "t1", obj: NOC, cat: "read", est: 85,
          lead: `<b>Nature of Code ⑤</b> — Ch.2 (2.6–2.8): environmental forces. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: "Read NoC Ch.2 2.6: modeling gravity as weight (<code>m·g</code>) — not as attraction." },
            { id: "s2", est: 30, label: "Then NoC Ch.2 2.7–2.8: friction, and air/fluid resistance." },
            { id: "s3", cat: "exercise", est: 30, label: `Do the 2.6–2.8 <b>exercises in p5.js</b>: add friction to a bouncing ball, then drop a body through a "liquid" region and feel the drag switch on.` },
          ] },
      ],
    },

    /* ---------------- Week 10 ---------------- */
    {
      id: "d19", date: "2026-11-27", week: "w10", title: "Forces II: gravity, friction & drag (cont.)",
      theme: "Finish “Forces II: gravity, friction & drag” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d18", obj: NOC, cat: "read", est: 40,
          lead: `<b>Nature of Code ⑤</b> — Ch.2 (2.6–2.8): environmental forces. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: `Add a global downward force + a drag force to your movers; watch motion settle.`, note: `Note this constant <code>m·g</code> field is NOT gravitational attraction between bodies — that's the next forces day.` },
          ],
          model: `Constant "gravity" (<code>m·g</code> down) is the <b>Earth</b> model — a fixed field. That's different from gravitational <b>attraction</b> between bodies (next forces day). Drag opposes velocity and scales with speed² — it's what makes motion damp.`,
          cards: [
            { q: `Constant "gravity" (m·g down) vs gravitational attraction?`, a: `m·g is a fixed field (falling on Earth); attraction is a pairwise inverse-square force between masses (orbits, N-body).` },
            { q: `Which way does drag point and how does it scale?`, a: `Opposite to velocity, roughly with speed².` },
          ] },
      ],
    },
    {
      id: "d20", date: "2026-11-29", week: "w10", title: "The update loop & delta-time, done right",
      theme: "raylib course · thread part 6 — split update from draw, scale by dt.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "code", est: 75,
          lead: `<b>raylib course ⑥</b> — §4 Update (second half).`,
          sub: [
            { id: "s1", est: 40, label: `Udemy §4: logic/update vs draw. Use <code>GetFrameTime()</code>; study example <code>core_delta_time</code>.` },
            { id: "s2", cat: "code", est: 35, label: `Refactor your mover so every motion is multiplied by <code>GetFrameTime()</code>.`, note: `Test it: cap the framerate to 30 then 144 — the mover should cross the screen in the same wall-clock time.` },
          ],
          model: `Split each frame into <b>UPDATE</b> (advance state by dt) and <b>DRAW</b> (render state). Multiply all motion by <code>GetFrameTime()</code> so physics runs identically on any machine — non-negotiable once the sim has thousands of bodies.`,
          cards: [
            { q: `What does <code>GetFrameTime()</code> return, and why use it?`, a: `Seconds since the last frame (dt); multiply motion by it for frame-rate-independent physics.` },
            { q: `Why separate update from draw?`, a: `State advances once per dt regardless of render cost; keeps logic deterministic and draw a pure function of state.` },
          ] },
      ],
    },

    /* ---------------- Week 11 ---------------- */
    {
      id: "d21", date: "2026-12-02", week: "w11", title: "Forces III: gravitational attraction — the N-body kernel ⚛️",
      theme: "Nature of Code · thread part 6 — this one formula IS the simulation engine.",
      tasks: [
        { id: "t1", obj: NOC, cat: "code", est: 80,
          lead: `<b>Nature of Code ⑥</b> — Ch.2 (2.9–2.10): everything attracts everything.`,
          sub: [
            { id: "s1", est: 30, label: `Read NoC Ch.2 <b>2.9 Gravitational Attraction</b> + <b>2.10 Everything Attracts Everything</b>: <code>F = G·m₁·m₂/r²</code> along the unit vector between bodies.` },
            { id: "s2", cat: "code", est: 30, label: `Code an <code>Attractor</code> pulling a few movers; then let two movers attract each other.` },
            { id: "s3", cat: "code", est: 20, label: `<b>Add softening</b> — divide by <code>(r² + ε²)</code> so near-overlapping pairs don't explode.`, note: `See Philip Mocz's <a href="https://medium.com/swlh/create-your-own-n-body-simulation-with-python-f417234885e9" target="_blank" rel="noopener">N-body write-up</a> for sane constants & the softening length ε. Without ε, a close pair slingshots to infinity.` },
          ],
          model: `For each pair: <code>dir = normalize(b − a)</code>, <code>r = dist(a,b)</code>, <code>F = G·mₐ·m_b/(r² + ε²) · dir</code>. Summed over all pairs = N-body gravity. The <b>ε (softening length)</b> is what keeps the sim finite when <code>r→0</code>.`,
          cards: [
            { q: `The gravitational force between two bodies?`, a: `<code>F = G·m₁·m₂/r²</code>, directed along the line between them (inverse-square).` },
            { q: `What is softening <code>(r²+ε²)</code> and why essential?`, a: `A small ε added to r² so forces stay finite when particles nearly overlap — without it, close pairs slingshot to infinity.` },
            { q: `Cost of naive all-pairs N-body?`, a: `<code>O(n²)</code> per step (every pair). Fine for hundreds; slow for many thousands → Barnes–Hut later.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚛️ This single formula, summed over every particle, IS the simulation engine. Everything after today is scale, stability, and how it looks.` },
      ],
    },
    {
      id: "d22", date: "2026-12-03", week: "w11", title: "Collision detection",
      theme: "raylib course · thread part 7 — cheap test first, precise test only if it passes.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 50,
          lead: `<b>raylib course ⑦</b> — begin §5 Collision & Tilemaps. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `Udemy §5 (first half): <code>CheckCollisionRecs</code>/<code>CheckCollisionCircles</code>/<code>CheckCollisionPointRec</code>.` },
          ] },
      ],
    },

    /* ---------------- Week 12 ---------------- */
    {
      id: "d23", date: "2026-12-09", week: "w12", title: "Port-along #1: Basics → Movement → Input (Clear Code)",
      theme: "Examples · thread part 2 — the API is the same in Python and C++.",
      tasks: [
        { id: "t1", carried: "d22", obj: COURSE, cat: "watch", est: 35,
          lead: `<b>raylib course ⑦</b> — begin §5 Collision & Tilemaps. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Bounce a ball off the walls (invert the velocity component on contact).` },
          ],
          model: `raylib ships the common 2D checks (rect/rect, circle/circle, point/rect). The broad idea — cheap bounding test first, precise test only if it passes — is the seed of the spatial optimization you'll need later.`,
          cards: [
            { q: `Which collision checks does raylib give you for free?`, a: `<code>CheckCollisionRecs</code>, <code>CheckCollisionCircles</code>, <code>CheckCollisionPointRec</code> (+ circle/rec).` },
            { q: `The "cheap-then-precise" collision idea?`, a: `Test cheap bounding volumes first; run the exact test only on pairs that pass — the foundation of spatial partitioning.` },
          ] },
        { id: "t2", obj: EX, cat: "code", est: 40,
          lead: `<b>Examples ②</b> — start porting the big raylib video to C++. (1/2)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: `Clear Code <a href="https://www.youtube.com/watch?v=UoAsDlUwjy0" target="_blank" rel="noopener">"The ultimate introduction to Raylib"</a> — <b>Basics</b> (~0:00–0:25): port to C++ into a <code>portalong/</code> project.`, note: `It's Python/pyray, but the API names are identical — translate as you watch instead of copying.` },
          ] },
      ],
    },
    {
      id: "d24", date: "2026-12-12", week: "w12", title: "Port-along #1: Basics → Movement → Input (Clear Code) (cont.)",
      theme: "Finish “Port-along #1: Basics → Movement → Input (Clear Code)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d23", obj: EX, cat: "code", est: 80,
          lead: `<b>Examples ②</b> — start porting the big raylib video to C++. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: `<b>Movement</b> (~0:25–0:50): port to C++.` },
            { id: "s2", cat: "code", est: 40, label: `<b>Input</b> (~0:50–1:09): port to C++.` },
          ],
          model: `The raylib API is identical across bindings — <code>DrawCircle</code> is <code>DrawCircle</code> in Python or C++. Watching Python and typing C++ forces you to understand each call instead of copying it.`,
          cards: [
            { q: `Why is porting a Python raylib video to C++ useful, not wasteful?`, a: `The API is the same across bindings; translating forces understanding and builds C++ fluency.` },
            { q: `pyray <code>InitWindow(...)</code> → C++?`, a: `Identical: <code>InitWindow(w,h,"title");</code> — only the surrounding syntax differs.` },
          ] },
      ],
    },

    /* ---------------- Week 13 ---------------- */
    {
      id: "d25", date: "2026-12-17", week: "w13", title: "Oscillation I: angles, trig & polar coordinates",
      theme: "Nature of Code · thread part 7 — the natural language of an explosion.",
      tasks: [
        { id: "t1", obj: NOC, cat: "read", est: 85,
          lead: `<b>Nature of Code ⑦</b> — Ch.3 Oscillation (3.1–3.5). (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read NoC <a href="https://natureofcode.com/oscillation/" target="_blank" rel="noopener">Ch.3</a> 3.1–3.3: angles, angular motion, and trig on screen.` },
            { id: "s2", est: 25, label: "Then NoC Ch.3 3.4–3.5: <b>polar ↔ Cartesian</b>, the conversion the whole burst depends on." },
            { id: "s3", cat: "exercise", est: 30, label: `Do Ch.3's <b>exercises in p5.js</b> as you read: rotate a rectangle by its own angular velocity, then place points on a circle with <code>(r·cosθ, r·sinθ)</code>.` },
          ] },
      ],
    },
    {
      id: "d26", date: "2026-12-21", week: "w13", title: "Oscillation I: angles, trig & polar coordinates (cont.)",
      theme: "Finish “Oscillation I: angles, trig & polar coordinates” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d25", obj: NOC, cat: "read", est: 35,
          lead: `<b>Nature of Code ⑦</b> — Ch.3 Oscillation (3.1–3.5). (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Convert <code>(angle, radius)</code> → <code>(r·cosθ, r·sinθ)</code>; use it to fire test particles radially outward.`, note: `Random angle + outward speed = a radial burst — you'll reuse this exact seeding for the Big Bang.` },
          ],
          model: `Polar coordinates (angle + radius) are the natural language of a Big Bang: give each particle a random angle and an outward speed, then convert to a Cartesian velocity. A uniform explosion = uniform angles + similar speeds.`,
          cards: [
            { q: `Polar → Cartesian conversion?`, a: `<code>x = r·cosθ</code>, <code>y = r·sinθ</code>.` },
            { q: `How do you emit particles in a radial burst?`, a: `Random angle θ, outward speed s → velocity <code>(s·cosθ, s·sinθ)</code>.` },
          ] },
      ],
    },

    /* ---------------- Week 14 ---------------- */
    {
      id: "d27", date: "2026-12-23", week: "w14", title: "Tilemaps & the 2D camera 🎮",
      theme: "raylib course · thread part 8 — Camera2D is a lens; ~half the basics owned.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "code", est: 40,
          lead: `<b>raylib course ⑧</b> — finish §5 Collision & Tilemaps. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Udemy §5 (second half): draw a tilemap from a 2D grid; <code>Camera2D</code> (target/offset/zoom/rotation); example <code>core_2d_camera</code>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🎮 Milestone: Collision & Tilemaps done ≈ half of raylib's 2D basics. From here the course TAPERS and Nature of Code becomes the main driver.` },
      ],
      note: "Half the raylib basics owned. Course load now drops; the physics (Nature of Code) and the port-alongs step up.",
    },
    {
      id: "d28", date: "2026-12-25", week: "w14", title: "Tilemaps & the 2D camera 🎮 (cont.)",
      theme: "Finish “Tilemaps & the 2D camera 🎮” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d27", obj: COURSE, cat: "code", est: 35,
          lead: `<b>raylib course ⑧</b> — finish §5 Collision & Tilemaps. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Add a pan/zoom camera to a scene and roam it (<code>BeginMode2D(cam)…EndMode2D</code>).`, note: `This is the camera you'll later fly around the particle cloud.` },
          ],
          model: `<code>Camera2D</code> is a lens: set <b>target</b> (world point to center), <b>offset</b> (where it lands on screen), and <b>zoom</b>. <code>BeginMode2D(cam)…EndMode2D</code> draws the world through it — you'll fly this camera around your particle cloud.`,
          cards: [
            { q: `The four fields of <code>Camera2D</code>?`, a: `target (world focus), offset (screen anchor), rotation, zoom.` },
            { q: `What do <code>BeginMode2D</code>/<code>EndMode2D</code> do?`, a: `Draw everything between them through the camera transform (world→screen).` },
          ] },
      ],
    },

    /* ---------------- Week 15 ---------------- */
    {
      id: "d29", date: "2026-12-30", week: "w15", title: "Oscillation II: waves, pendulums & springs",
      theme: "Nature of Code · thread part 8 — restoring forces for soft structure.",
      tasks: [
        { id: "t1", obj: NOC, cat: "read", est: 90,
          lead: `<b>Nature of Code ⑧</b> — Ch.3 (3.6–3.10). (1/2)`,
          sub: [
            { id: "s1", est: 30, label: "Read NoC Ch.3 3.6–3.8: amplitude, period, and waves." },
            { id: "s2", est: 30, label: "Then NoC Ch.3 3.9–3.10: the pendulum, and <b>spring forces</b> (Hooke’s law <code>F = −k·x</code>)." },
            { id: "s3", cat: "exercise", est: 30, label: `Do the 3.6–3.10 <b>exercises in p5.js</b>: drive motion with a sine wave, build the simple pendulum, then hang a body off a spring and damp it.` },
          ] },
      ],
    },
    {
      id: "d30", date: "2027-01-03", week: "w15", title: "Oscillation II: waves, pendulums & springs (cont.)",
      theme: "Finish “Oscillation II: waves, pendulums & springs” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d29", obj: NOC, cat: "read", est: 35,
          lead: `<b>Nature of Code ⑧</b> — Ch.3 (3.6–3.10). (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Connect two particles with a spring and watch them settle.`, note: `Springs + attraction + damping are the toolkit if you later want soft structures that hold together instead of flying apart.` },
          ],
          model: `A spring force pulls proportional to how far it's stretched (<code>F = −k·x</code>). Springs + attraction + damping are the whole toolkit for "soft" clustering if you later want structures to hold together instead of fly apart.`,
          cards: [
            { q: `Hooke's law for a spring?`, a: `<code>F = −k·x</code> — a restoring force proportional to displacement, opposite in direction.` },
            { q: `Amplitude vs period of an oscillation?`, a: `Amplitude = peak magnitude; period = time for one full cycle.` },
          ] },
      ],
    },

    /* ---------------- Week 16 ---------------- */
    {
      id: "d31", date: "2027-01-07", week: "w16", title: "An OOP build: Conway's Game of Life (Nick, C++)",
      theme: "Examples · thread part 3 — stepping a whole field from state N to N+1.",
      tasks: [
        { id: "t1", obj: EX, cat: "code", est: 70,
          lead: `<b>Examples ③</b> — build a full C++ raylib program end-to-end.`,
          sub: [
            { id: "s1", est: 40, label: `Follow Programming With Nick's <a href="https://github.com/educ8s/CPP-Game-Of-Life-with-raylib" target="_blank" rel="noopener">Conway's Game of Life in C++ & raylib (OOP)</a> (repo linked).` },
            { id: "s2", cat: "code", est: 30, label: `Note the update/draw split and how the grid steps from state N to N+1.`, note: `Compute the next state into a <b>separate buffer</b>, then swap — mid-update reads must see the consistent old state, exactly like stepping a particle field.` },
          ],
          model: `Game of Life steps a whole grid from state N to N+1 each frame — structurally identical to stepping your particle field: read all current state, compute the next, then swap. Great C++/OOP scaffolding practice.`,
          cards: [
            { q: `What does Game of Life share with a particle simulation?`, a: `A fixed update step advancing all cells/particles from state N→N+1 (read-all-then-write).` },
            { q: `Why compute the next state into a separate buffer?`, a: `So mid-update reads see the consistent old state — no order-dependent bugs.` },
          ] },
      ],
    },
    {
      id: "d32", date: "2027-01-09", week: "w16", title: "Projects I: a guided build (course tapering)",
      theme: "raylib course · thread part 9 — the shape every finished program shares.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 35,
          lead: `<b>raylib course ⑨</b> — §6 Projects (first project). Course load is now light. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: "Udemy §6 Projects: follow the first guided game as far as its core loop." },
          ] },
      ],
    },

    /* ---------------- Week 17 ---------------- */
    {
      id: "d33", date: "2027-01-13", week: "w17", title: "Projects I: a guided build (course tapering) (cont.)",
      theme: "Finish “Projects I: a guided build (course tapering)” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d32", obj: COURSE, cat: "watch", est: 55,
          lead: `<b>raylib course ⑨</b> — §6 Projects (first project). Course load is now light. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: "Finish that project — scoring, reset, and the polish pass." },
            { id: "s2", cat: "review", est: 25, label: `Extract the shape he uses: a state struct, <code>update(state, dt)</code>, <code>draw(state)</code>, and a reset.`, note: `Your simulation will have exactly this shape — internalize it now.` },
          ],
          model: `A finished raylib program is just your loop plus: a state struct, <code>update(state, dt)</code>, <code>draw(state)</code>, and a <code>reset</code>. Your simulation will have exactly this shape.`,
          cards: [
            { q: `The four structural parts of any finished raylib program?`, a: `State, <code>update(state,dt)</code>, <code>draw(state)</code>, reset/init.` },
            { q: `Why keep <code>draw()</code> free of state changes?`, a: `So rendering is a pure view of state — easier to pause, reason about, and record.` },
          ] },
      ],
    },
    {
      id: "d34", date: "2027-01-19", week: "w17", title: "Particle systems I: one particle → a system",
      theme: "Nature of Code · thread part 9 — std::vector is the ArrayList, erase the dead.",
      tasks: [
        { id: "t1", obj: NOC, cat: "code", est: 80,
          lead: `<b>Nature of Code ⑨</b> — Ch.4 Particle Systems (4.1–4.5). (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read NoC <a href="https://natureofcode.com/particles/" target="_blank" rel="noopener">Ch.4</a> 4.1–4.3: a Particle (pos/vel/acc/lifespan), and an array of them.` },
            { id: "s2", est: 25, label: "Then NoC Ch.4 4.4–4.5: the ParticleSystem class, and a system of systems." },
            { id: "s3", cat: "exercise", est: 30, label: `Do Ch.4's <b>exercises in p5.js</b> as you read: a particle that fades over its lifespan, then an emitter that follows the mouse and a system-of-systems.` },
          ] },
      ],
    },

    /* ---------------- Week 18 ---------------- */
    {
      id: "d35", date: "2027-01-23", week: "w18", title: "Particle systems I: one particle → a system (cont.)",
      theme: "Finish “Particle systems I: one particle → a system” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d34", obj: NOC, cat: "code", est: 40,
          lead: `<b>Nature of Code ⑨</b> — Ch.4 Particle Systems (4.1–4.5). (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: `Build an emitter in raylib backed by <code>std::vector&lt;Particle&gt;</code>; spawn a few each frame, remove the dead.`, note: `Use erase–remove_if to cull particles whose lifespan hit zero — the same vector you'll scale to thousands.` },
          ],
          model: `A particle system owns a vector of particles: each frame — spawn a few, update all, draw all, erase the dead (lifespan ≤ 0). Use <code>std::vector</code> where NoC uses ArrayList; erase–remove for the dead.`,
          cards: [
            { q: `What does a ParticleSystem do each frame?`, a: `Spawn new particles, update all, draw all, remove the dead (lifespan ≤ 0).` },
            { q: `ArrayList → C++?`, a: `<code>std::vector&lt;Particle&gt;</code> (push_back to spawn; erase–remove_if to cull).` },
          ] },
      ],
    },
    {
      id: "d36", date: "2027-01-24", week: "w18", title: "Particle systems II: forces & repellers",
      theme: "Nature of Code · thread part 10 — one step from N-body already.",
      tasks: [
        { id: "t1", obj: NOC, cat: "code", est: 80,
          lead: `<b>Nature of Code ⑩</b> — Ch.4 (4.11–4.12).`,
          sub: [
            { id: "s1", est: 40, label: `Read NoC Ch.4 (4.11 systems with forces, 4.12 repellers).` },
            { id: "s2", cat: "code", est: 40, label: `Apply a global force to every particle; add a mouse-controlled attractor and a repeller.`, note: `An attractor is the N-body gravity force with one heavy fixed body; a repeller is the same, sign-flipped. You're one step from full N-body.` },
          ],
          model: `Applying a force to the whole system = loop <code>applyForce</code> over each particle. An attractor is just the gravity force from the N-body day with one heavy fixed body — you're now one step from full N-body.`,
          cards: [
            { q: `How do you apply a force to an entire particle system?`, a: `Loop and <code>applyForce()</code> on each particle (forces still sum per particle).` },
            { q: `A mouse "repeller" is which formula, sign-flipped?`, a: `Inverse-square attraction with the direction reversed (push instead of pull).` },
          ] },
      ],
    },

    /* ---------------- Week 19 ---------------- */
    {
      id: "d37", date: "2027-01-28", week: "w19", title: "Projects II: a second build + consolidation",
      theme: "raylib course · thread part 10 — the moment the patterns start repeating.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 75,
          lead: `<b>raylib course ⑩</b> — §6 Projects (second project) + take stock.`,
          sub: [
            { id: "s1", est: 50, label: `Udemy §6: a second guided project, a different genre. Note the reused patterns (collision, camera, state).` },
            { id: "s2", cat: "review", est: 25, label: `Consolidate: list every raylib API you now know cold — that list is your working vocabulary.`,
              note: `When the second project throws no new API surprises, you've "got" raylib — time to shift weight onto the sim + Nature of Code.` },
          ],
          model: `By the second project the patterns repeat — you're no longer learning raylib, you're <i>using</i> it. That's the signal to shift weight fully onto the simulation and Nature of Code.`,
          cards: [
            { q: `Sign that you've "got" raylib's basics?`, a: `The second project reuses patterns from the first (loop/state/collision/camera) with no new API surprises.` },
            { q: `What shifts after the course's Projects section?`, a: `Course tasks taper; the Big Bang sim + Nature of Code become the main work.` },
          ] },
      ],
    },
    {
      id: "d38", date: "2027-02-02", week: "w19", title: "🌌 The simulation begins: one particle in the void",
      theme: "Big Bang · v0 — nail the loop before scale can hide bugs.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 50,
          lead: `<b>Big Bang v0</b> — a black window, one glowing point, correct integration. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `New <code>bigbang/</code> project (educ8s C++ starter template). Black background; one <code>struct Particle{ Vector2 pos, vel, acc; }</code> at center; give it a velocity.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Commit this as v0. From here you only ADD: more particles, real forces, better integration, then the look.` },
      ],
      note: "The Udemy course is winding down to its final GUI/audio section — the simulation is now the spine of the journey.",
    },

    /* ---------------- Week 20 ---------------- */
    {
      id: "d39", date: "2027-02-06", week: "w20", title: "🌌 The simulation begins: one particle in the void (cont.)",
      theme: "Finish “🌌 The simulation begins: one particle in the void” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d38", obj: PROJ, cat: "project", est: 40,
          lead: `<b>Big Bang v0</b> — a black window, one glowing point, correct integration. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: `Integrate with <code>GetFrameTime()</code>; draw with <code>DrawCircleV</code>. Clean <b>update / draw</b> split.`, note: `Commit this as <b>v0</b>. Every later feature — thousands of bodies, gravity, shaders — hangs off this skeleton, so get the loop right before scale can hide bugs.` },
          ],
          model: `Start impossibly small: one particle, correct delta-time integration, a clean update/draw split. Every later feature (thousands of bodies, gravity, shaders) hangs off this skeleton. Get the loop right first.`,
          cards: [
            { q: `The smallest correct first version of the sim?`, a: `One particle with pos/vel/acc, integrated by dt, drawn on a black-cleared background.` },
            { q: `Why start with ONE particle?`, a: `To nail integration + the update/draw structure before scale hides bugs.` },
          ] },
      ],
    },
    {
      id: "d40", date: "2027-02-08", week: "w20", title: "Particle systems III: textures & additive blending ✨",
      theme: "Nature of Code · thread part 11 — the bridge from physics to look.",
      tasks: [
        { id: "t1", obj: NOC, cat: "read", est: 80,
          lead: `<b>Nature of Code ⑪</b> — Ch.4 (4.13): the physics→look junction.`,
          sub: [
            { id: "s1", est: 40, label: `Read NoC Ch.4 (4.13 image textures + additive blending).` },
            { id: "s2", cat: "code", est: 40, label: `In raylib: <code>BeginBlendMode(BLEND_ADDITIVE)</code>, draw a soft radial texture per particle; study example <code>textures_particles_blending</code>.`, note: `Additive blending sums colours where particles overlap — dense regions glow, sparse ones stay dark. The whole luminous look, before any shader.` },
          ],
          model: `Additive blending <i>adds</i> colours where particles overlap, so dense regions glow white-hot and sparse ones stay dim — the whole "luminous cosmos" look for free, before any shader. This is the junction between Nature of Code and the Book of Shaders.`,
          cards: [
            { q: `What does additive blending do visually?`, a: `Overlapping particles' colours sum → bright where dense, dark where sparse (the glow/nebula look).` },
            { q: `raylib call to enable it?`, a: `<code>BeginBlendMode(BLEND_ADDITIVE)</code> … <code>EndBlendMode()</code>.` },
          ] },
      ],
    },

    /* ---------------- Week 21 ---------------- */
    {
      id: "d41", date: "2027-02-12", week: "w21", title: "Big Bang v1: the burst 💥",
      theme: "Big Bang · v1 — seed the universe with polar velocities.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 90,
          lead: `<b>Big Bang v1</b> — emit the universe (no forces yet).`,
          sub: [
            { id: "s1", est: 50, label: `Extend <code>bigbang</code>: spawn N particles at the origin with <b>polar</b> velocities (random angle, Gaussian speed) — combining NoC 3.5 + the Introduction's Gaussian.` },
            { id: "s2", cat: "code", est: 40, label: `Back it with <code>std::vector&lt;Particle&gt;</code>; apply the additive glow from the last NoC day. No forces yet — just watch it expand.`, note: `Tune μ/σ of the speed until the spread feels right: a dense core with a few fast outliers.` },
          ],
          model: `The "bang" is one line of seeding: for each particle <code>θ = random(0, 2π)</code>, <code>s = gaussian(μ, σ)</code>, <code>vel = (s·cosθ, s·sinθ)</code>. No forces yet — just watch it expand. Tune μ/σ until the spread feels right.`,
          cards: [
            { q: `How do you seed a radial explosion of N particles?`, a: `Each gets a random angle θ and outward speed s → <code>vel = (s·cosθ, s·sinθ)</code>.` },
            { q: `Why Gaussian (not uniform) speeds for the burst?`, a: `A natural spread — a dense core with fewer fast outliers, like a real explosion.` },
          ] },
      ],
    },
    {
      id: "d42", date: "2027-02-16", week: "w21", title: "Music & GUI I: buttons, sliders & a control panel",
      theme: "raylib course · thread part 11 — immediate-mode widgets for the sim.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 80,
          lead: `<b>raylib course ⑪</b> — §7 Music & GUI (first half).`,
          sub: [
            { id: "s1", est: 50, label: `Udemy §7 (first half): immediate-mode GUI — buttons, sliders, hover states. Compare with the "Raylib Buttons Tutorial (OOP)" video in Nick's <a href="https://www.youtube.com/watch?v=wVYKG_ch4yM&list=PLwR6ZGPvjVOSRywn9VCQ3yrRVruxzzuo9" target="_blank" rel="noopener">raylib playlist</a>.` },
            { id: "s2", cat: "prep", est: 30, label: `Plan a control panel for the sim: pause, time-scale, particle count, gravity strength.`,
              note: `Immediate-mode means a slider draws AND reports its value in the same call — wire it straight into your simulation parameters.` },
          ],
          model: `raylib GUI is <b>immediate-mode</b>: each frame you draw a button AND test if it was clicked in the same call. Perfect for a sim panel — a slider that writes straight into your simulation parameters.`,
          cards: [
            { q: `What does "immediate-mode GUI" mean?`, a: `You draw and test the widget every frame in one call — no retained widget objects.` },
            { q: `Good first controls for the sim?`, a: `Pause/play, time-scale (fast-forward), particle count, gravity strength.` },
          ] },
      ],
    },

    /* ---------------- Week 22 ---------------- */
    {
      id: "d43", date: "2027-02-21", week: "w22", title: "Port-along #2: Cameras → Classes → Timers → Animations",
      theme: "Examples · thread part 4 — steal the Timer pattern for spawning.",
      tasks: [
        { id: "t1", obj: EX, cat: "code", est: 75,
          lead: `<b>Examples ④</b> — continue the Clear Code port (to C++). (1/2)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: "Clear Code 1:17–1:40 (Cameras, Using classes) — port to C++." },
            { id: "s2", cat: "code", est: 35, label: "Clear Code 1:40–2:00 (Collision resolution) — port to C++." },
          ] },
      ],
    },
    {
      id: "d44", date: "2027-02-22", week: "w22", title: "Port-along #2: Cameras → Classes → Timers → Animations (cont.)",
      theme: "Finish “Port-along #2: Cameras → Classes → Timers → Animations” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d43", obj: EX, cat: "code", est: 80,
          lead: `<b>Examples ④</b> — continue the Clear Code port (to C++). (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: "Clear Code 2:00–2:18 (Timers, Animations) — port to C++." },
            { id: "s2", cat: "code", est: 40, label: `Lift the <b>Timer</b> pattern (duration, elapsed, done) for timed/rate-based particle spawning.`, note: `A reusable Timer is the cleanest way to spawn at a rate, stage the burst, or trigger fast-forward — small utility, used everywhere.` },
          ],
          model: `A reusable Timer (duration, elapsed, done) is the cleanest way to spawn particles at a rate, stage the Big Bang, or trigger fast-forward. Small utility, used everywhere.`,
          cards: [
            { q: `Simplest way to do things "every X seconds" in raylib?`, a: `A Timer struct — accumulate dt, fire & reset when it exceeds the interval.` },
            { q: `Why port the "Using classes" segment carefully?`, a: `It's the OOP structure your growing sim needs — Particle, Emitter, Camera, UI as classes.` },
          ] },
      ],
    },

    /* ---------------- Week 23 ---------------- */
    {
      id: "d45", date: "2027-02-25", week: "w23", title: "Big Bang v2: gravity switches on — real N-body",
      theme: "Big Bang · v2 — structure emerges from one formula.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 90,
          lead: `<b>Big Bang v2</b> — every particle pulls every other.`,
          sub: [
            { id: "s1", est: 50, label: `Apply the N-body kernel (NoC 2.9–2.10) across the system: nested loop summing <code>F = G·m·m/(r²+ε²)</code> for every pair; integrate; <b>watch clumping emerge</b>.`, info: `<p>The <b>ε²</b> ("softening length") in <code>F = G·m·m/(r²+ε²)</code> is the one term that stops the whole simulation from blowing up.</p>
<p>Pure Newtonian gravity goes as <code>1/r²</code>: as two particles approach, <code>r → 0</code> and the force → <b>infinity</b>. With a discrete timestep that hands a particle a near-infinite kick and flings it off-screen — the classic "my N-body sim exploded" bug.</p>
<p>Adding a small constant ε² caps the force at close range (when <code>r ≪ ε</code> the denominator ≈ ε², finite) while leaving distant pairs essentially unchanged — it models particles as soft blobs instead of point singularities. Tune ε to your scale: too small and it still explodes, too large and the structure turns mushy.</p>` },
            { id: "s2", est: 40, label: `Use <a href="https://github.com/pmocz/nbody-python" target="_blank" rel="noopener">Philip Mocz's N-body</a> for sane constants & softening. Keep N small (≤ ~1000) for now.`, note: `All-pairs is O(n²), so it bogs down before optimization — Barnes–Hut comes later. Structure (clumps, filaments) emerging from one formula is the whole point.` },
          ],
          model: `Add the pairwise gravity loop and structure appears on its own — particles clump, orbits form, filaments stretch. This emergence, from one formula, is the entire point of the project.`,
          cards: [
            { q: `What turns a drifting particle cloud into cosmic structure?`, a: `Summing pairwise gravitational attraction each step — clumps/filaments emerge with no extra rules.` },
            { q: `Why cap N (~hundreds–1000) at this stage?`, a: `All-pairs gravity is O(n²); it bogs down before optimization (Barnes–Hut comes later).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `📈 Nature of Code's physics core (vectors → forces → particle systems, Intro–Ch.4) is done and the Udemy course is nearly complete. Milestone: the physics engine is real and running.` },
      ],
    },
    {
      id: "d46", date: "2027-02-26", week: "w23", title: "Music & GUI II: audio — the course capstone 🎓",
      theme: "raylib course · thread part 12 — the whole library, end to end.",
      tasks: [
        { id: "t1", obj: COURSE, cat: "watch", est: 40,
          lead: `<b>raylib course ⑫</b> — §7 (second half): audio + finish the course. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Udemy §7 (second half): <code>LoadSound</code>/<code>PlaySound</code>, <code>LoadMusicStream</code> + <code>UpdateMusicStream</code> each frame, volume.` },
          ] },
      ],
      note: "The raylib course is finished. The rest of the journey is Nature of Code's tail, the Book of Shaders, and building the simulation.",
    },

    /* ---------------- Week 24 ---------------- */
    {
      id: "d47", date: "2027-03-03", week: "w24", title: "Integration methods: Euler vs Verlet (stability) 🩹",
      theme: "Nature of Code · thread part 12 — a one-line change that keeps orbits bound.",
      tasks: [
        { id: "t1", carried: "d46", obj: COURSE, cat: "watch", est: 30,
          lead: `<b>raylib course ⑫</b> — §7 (second half): audio + finish the course. (2/2)`,
          sub: [
            { id: "s1", cat: "project", est: 30, label: `Complete the course's Qur'an-player capstone — that finishes all 7 sections, the Udemy course is <b>done</b>.`, note: `You've now covered the whole library end to end: drawing, input, collision, tilemaps, camera, projects, GUI & audio.` },
          ],
          model: `Audio in raylib: <b>Sound</b> = short one-shots (<code>LoadSound</code>/<code>PlaySound</code>); <b>Music</b> = streamed (<code>LoadMusicStream</code> + <code>UpdateMusicStream</code> each frame). Optional for the sim, but you've now covered the whole library end to end.`,
          cards: [
            { q: `Sound vs Music in raylib?`, a: `Sound = short clip loaded fully (PlaySound); Music = streamed from disk, needs <code>UpdateMusicStream()</code> each frame.` },
            { q: `What have you completed at this point?`, a: `The entire Udemy raylib course — 2D drawing, input, collision, tilemaps, camera, projects, GUI & audio.` },
          ] },
        { id: "t2", obj: NOC, cat: "read", est: 45,
          lead: `<b>Nature of Code ⑫</b> — Physics Libraries: §5.14 Integration Methods (skim Verlet). (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `Read NoC <b>"Physics Libraries"</b> — §5.14 (Euler vs Verlet); skim 5.15. Ignore the Box2D-specific API. (Ch.5 in your v1 PDF; the <a href="https://natureofcode.com/physics-libraries/" target="_blank" rel="noopener">online 2nd edition</a> renumbers this chapter as 6.)` },
          ] },
      ],
    },
    {
      id: "d48", date: "2027-03-08", week: "w24", title: "Integration methods: Euler vs Verlet (stability) 🩹 (cont.)",
      theme: "Finish “Integration methods: Euler vs Verlet (stability) 🩹” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d47", obj: NOC, cat: "read", est: 35,
          lead: `<b>Nature of Code ⑫</b> — Physics Libraries: §5.14 Integration Methods (skim Verlet). (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Switch the sim to <b>Verlet/leapfrog</b> for stable orbits (Mocz uses leapfrog).`, note: `Explicit Euler injects energy each step (orbits spiral out); Verlet is symmetric and conserves energy — a one-line change, huge stability win.` },
          ],
          model: `Explicit Euler (<code>vel += a·dt; pos += vel·dt</code>) silently injects energy — orbits spiral out. Verlet/leapfrog integrates symmetrically and conserves energy far better, so bound structures stay bound. One-line change, huge stability win.`,
          cards: [
            { q: `Why do Euler-integrated orbits drift/explode over time?`, a: `Explicit Euler isn't energy-conserving — it adds a little energy each step.` },
            { q: `The cheap fix for stable N-body orbits?`, a: `Leapfrog/Verlet integration (symmetric, conserves energy well) instead of plain Euler.` },
          ] },
      ],
    },

    /* ---------------- Week 25 ---------------- */
    {
      id: "d49", date: "2027-03-13", week: "w25", title: "Big Bang v3: thousands of particles",
      theme: "Big Bang · v3 — scale is a data-layout problem.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 90,
          lead: `<b>Big Bang v3</b> — push N up without dropping frames.`,
          sub: [
            { id: "s1", est: 50, label: `Refactor storage to be cache-friendly (parallel arrays / struct-of-arrays), preallocate, and avoid per-frame allocation.` },
            { id: "s2", est: 40, label: `Raise N; measure FPS. Study <code>textures_bunnymark</code> for draw-count intuition.`, note: `As N grows the first wall you hit is the O(n²) force loop, not drawing — which motivates Barnes–Hut next.` },
          ],
          model: `Scale is a data-layout problem: contiguous arrays (SoA) + no per-frame allocation + minimal per-particle draw calls. Measure FPS as you raise N — you'll hit the O(n²) wall, which motivates the next optimization day.`,
          cards: [
            { q: `Why does struct-of-arrays beat array-of-structs at scale?`, a: `Contiguous same-type data is cache-friendly — faster to iterate and vectorize.` },
            { q: `First bottleneck as N grows in N-body?`, a: `The O(n²) force loop (not drawing) — the reason for Barnes–Hut/spatial grids.` },
          ] },
      ],
    },
    {
      id: "d50", date: "2027-03-14", week: "w25", title: "Draw-count & blending study",
      theme: "Examples · thread part 5 — why particles become textured/instanced.",
      tasks: [
        { id: "t1", obj: EX, cat: "read", est: 40,
          lead: `<b>Examples ⑤</b> — learn where drawing gets expensive. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Study examples <code>textures_bunnymark</code> (how many sprites before FPS drops), <code>textures_blend_modes</code>, <code>shapes_starfield_effect</code>.` },
          ] },
      ],
    },

    /* ---------------- Week 26 ---------------- */
    {
      id: "d51", date: "2027-03-18", week: "w26", title: "Draw-count & blending study (cont.)",
      theme: "Finish “Draw-count & blending study” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d50", obj: EX, cat: "read", est: 30,
          lead: `<b>Examples ⑤</b> — learn where drawing gets expensive. (2/2)`,
          sub: [
            { id: "s1", cat: "review", est: 30, label: `Note batching: many <code>DrawCircleV</code> calls vs one textured/instanced draw.`,
              note: `Per-draw-call overhead is why particles become textured/instanced/shader-drawn as N grows.` },
          ],
          model: `Every draw call has overhead; thousands of individual <code>DrawCircle</code> calls cost more than drawing thousands of instances of one texture. This is why particles become textured/instanced/shader-drawn as N grows.`,
          cards: [
            { q: `Why can 10k individual DrawCircle calls be slow?`, a: `Per-draw-call overhead adds up; batching/instancing one texture is far cheaper.` },
            { q: `What does bunnymark teach for a particle sim?`, a: `A felt sense of how many draws your machine sustains at 60 fps.` },
          ] },
      ],
    },
    {
      id: "d52", date: "2027-03-23", week: "w26", title: "Big Bang v4: the glow look in 2D ✨",
      theme: "Big Bang · v4 — additive blending sells the cosmos.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 90,
          lead: `<b>Big Bang v4</b> — make it beautiful (still CPU-drawn).`,
          sub: [
            { id: "s1", est: 50, label: `Apply additive blending (<code>BLEND_ADDITIVE</code>) + a soft radial particle texture to the whole field.` },
            { id: "s2", est: 40, label: `Colour particles by speed or mass (fast/hot vs slow/cool). Compare against your stacked-circle glow from earlier.`, note: `Colour-by-speed makes the physics legible — you can see where the energy is.` },
          ],
          model: `Additive-blended soft sprites give the luminous look with zero shader code: dense cores glow, sparse space stays dark. Colour-by-speed makes the physics legible — you can <i>see</i> where energy is.`,
          cards: [
            { q: `Cheapest way to make the 2D sim look "cosmic"?`, a: `Soft radial particle sprites + additive blending — dense regions glow, sparse regions dark.` },
            { q: `Why colour particles by speed/mass?`, a: `It encodes the physics visually — you read energy/structure at a glance.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🌌 The simulation lives: a 2D gravitational Big Bang that bursts, self-organizes, and glows. Next: scale, optimization, and the third dimension.` },
      ],
    },

    /* ---------------- Week 27 ---------------- */
    {
      id: "d53", date: "2027-03-28", week: "w27", title: "Big Bang v5: camera, trails & time controls",
      theme: "Big Bang · v5 — from demo to something you can explore.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 90,
          lead: `<b>Big Bang v5</b> — roam it, and control time.`,
          sub: [
            { id: "s1", est: 50, label: `Add a <code>Camera2D</code> pan/zoom to fly the cloud; fading particle trails (short position history, or a slowly-fading render texture).` },
            { id: "s2", est: 40, label: `Wire the control panel: pause + a <b>time-scale</b> (fast-forward) that multiplies dt. Use <code>core_world_screen</code> for HUD labels.`, note: `Fast-forward is just scaling dt before integration — these turn a physics demo into something you can explore.` },
          ],
          model: `Fast-forward is just multiplying dt by a time-scale before integration; trails are last-N positions or a slowly-fading render texture. These turn a physics demo into something you can <i>explore</i>.`,
          cards: [
            { q: `How do you implement fast-forward / slow-motion?`, a: `Scale dt by a time factor before the integration step.` },
            { q: `Two ways to draw particle trails?`, a: `Keep a short position history per particle, or draw onto a render texture that fades slightly each frame.` },
          ] },
      ],
    },
    {
      id: "d54", date: "2027-03-30", week: "w27", title: "Optimization: why O(n²) hurts & spatial ideas",
      theme: "Nature of Code · thread part 13 — the last physics chapter that matters here.",
      tasks: [
        { id: "t1", obj: NOC, cat: "read", est: 75,
          lead: `<b>Nature of Code ⑬</b> — Autonomous Agents: §6.14–6.15 (efficiency).`,
          sub: [
            { id: "s1", est: 45, label: `Read NoC <b>"Autonomous Agents"</b> — §6.14 (algorithmic efficiency) + §6.15 (optimization tricks). (Ch.6 in your v1 PDF; the <a href="https://natureofcode.com/autonomous-agents/" target="_blank" rel="noopener">online 2nd edition</a> renumbers this chapter as 5.)` },
            { id: "s2", cat: "prep", est: 30, label: `Sketch a spatial grid / quadtree so each particle only checks nearby ones.`,
              note: `Bucketing by region drops all-pairs O(n²) toward O(n log n) — the difference between 1k and 100k particles.` },
          ],
          model: `All-pairs is O(n²): 10k particles = 100M pair checks per step. A spatial grid or quadtree limits each particle to nearby neighbours, dropping cost toward O(n log n) — the difference between 1k and 100k particles.`,
          cards: [
            { q: `Why does doubling N roughly quadruple all-pairs cost?`, a: `O(n²): the number of pairs grows with n².` },
            { q: `Core idea of spatial partitioning?`, a: `Bucket particles by region (grid/quadtree) so each interacts only with nearby ones, not all N.` },
          ] },
      ],
    },

    /* ---------------- Week 28 ---------------- */
    {
      id: "d55", date: "2027-04-03", week: "w28", title: "Big Bang v6: Barnes–Hut & softening tuning",
      theme: "Big Bang · v6 — O(n²) → O(n log n) via center-of-mass.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 85,
          lead: `<b>Big Bang v6</b> — make N-body cheap enough to grow.`,
          sub: [
            { id: "s1", est: 55, label: `Build a quadtree; approximate distant clusters by their center-of-mass (the θ criterion). See the <a href="https://barneshutalgorithm.com/" target="_blank" rel="noopener">Barnes–Hut visualizer</a>.`, note: `A far cluster becomes one center-of-mass node when <code>size/distance &lt; θ</code> — that's what turns O(n²) into O(n log n).` },
            { id: "s2", est: 30, label: `Tune softening ε. Read <a href="https://developer.nvidia.com/gpugems/gpugems3/part-v-physics-simulation/chapter-31-fast-n-body-simulation-cuda" target="_blank" rel="noopener">GPU Gems 3 Ch.31</a> as the "all-pairs on the GPU" alternative for later.` },
          ],
          model: `Barnes–Hut groups distant particles into one center-of-mass node (used when <code>size/distance &lt; θ</code>), turning O(n²) into O(n log n). θ trades accuracy for speed; ε (softening) trades close-range realism for stability.`,
          cards: [
            { q: `Barnes–Hut's core approximation?`, a: `Treat a far-away cluster as a single center-of-mass point (when size/distance &lt; θ) → O(n log n).` },
            { q: `What do θ and ε each control?`, a: `θ = accuracy/speed of the tree approximation; ε = softening length that keeps close-range forces finite.` },
          ] },
      ],
    },
    {
      id: "d56", date: "2027-04-05", week: "w28", title: "Into 3D: cameras, point clouds & billboards",
      theme: "Examples · thread part 6 — same loop, one more axis.",
      tasks: [
        { id: "t1", obj: EX, cat: "watch", est: 65,
          lead: `<b>Examples ⑥</b> — study raylib's 3D building blocks.`,
          sub: [
            { id: "s1", est: 40, label: `Run the 3D examples: <code>core_3d_camera_free</code>, <code>core_3d_camera_mode</code>, <code>models_point_rendering</code> (point cloud), <code>models_billboard_rendering</code>, <code>models_directional_billboard</code>.` },
            { id: "s2", cat: "review", est: 25, label: `Note the <code>BeginMode3D</code>/<code>EndMode3D</code> wrapper and <code>Camera3D</code>.`,
              note: `Billboards (a textured quad that always faces the camera) are how you'll draw round glowing particles in 3D.` },
          ],
          model: `3D is the same loop with a <code>Camera3D</code> and <code>BeginMode3D</code>. Two ways to draw many points in 3D: a real point cloud, or camera-facing <b>billboards</b> (a textured quad that always faces you — how you'll draw glowing 3D particles).`,
          cards: [
            { q: `What wraps 3D drawing in raylib?`, a: `<code>BeginMode3D(camera3d)</code> … <code>EndMode3D</code> (Camera3D = position, target, up, fovy).` },
            { q: `What's a billboard, and why use it for particles?`, a: `A textured quad that always faces the camera — a cheap way to render round glowing particles in 3D.` },
          ] },
      ],
    },

    /* ---------------- Week 29 ---------------- */
    {
      id: "d57", date: "2027-04-08", week: "w29", title: "Big Bang v7: the third dimension",
      theme: "Big Bang · v7 — the physics is dimension-agnostic.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 90,
          lead: `<b>Big Bang v7</b> — lift the cloud into 3D.`,
          sub: [
            { id: "s1", est: 50, label: `Extend particles to <code>Vector3</code>; add an orbiting <code>Camera3D</code>; draw as a point cloud or billboards; keep additive blending.` },
            { id: "s2", est: 40, label: `Port the burst seeding to 3D (spherical, not just circular).`, note: `Going 3D is mostly a type change — the force/integration math is dimension-agnostic, the same code with a z component.` },
          ],
          model: `Going 3D is mostly a type change: <code>Vector2 → Vector3</code>, <code>DrawCircle → billboard/point</code>, <code>Camera2D → Camera3D</code>. The physics (force accumulation, integration, softening) is dimension-agnostic — the same code with a z component.`,
          cards: [
            { q: `What actually changes moving the sim from 2D to 3D?`, a: `Vectors gain z; draw becomes point-cloud/billboards; Camera2D→Camera3D. The force/integration math is unchanged.` },
            { q: `Why is the N-body math "dimension-agnostic"?`, a: `It's vector operations (distance, normalize, sum) that work identically in 2D or 3D.` },
          ] },
      ],
    },
    {
      id: "d58", date: "2027-04-11", week: "w29", title: "Port-along #3: 3D basics, imports & a peek at shaders",
      theme: "Examples · thread part 7 — first sight of the shader pipeline.",
      tasks: [
        { id: "t1", obj: EX, cat: "code", est: 40,
          lead: `<b>Examples ⑦</b> — finish the Clear Code port (3D + shaders). (1/3)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: "Clear Code 3:21–3:50 (3D basics, 3D imports) — port to C++." },
          ] },
      ],
    },

    /* ---------------- Week 30 ---------------- */
    {
      id: "d59", date: "2027-04-14", week: "w30", title: "Port-along #3: 3D basics, imports & a peek at shaders (cont.)",
      theme: "Finish “Port-along #3: 3D basics, imports & a peek at shaders” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d58", obj: EX, cat: "code", est: 40,
          lead: `<b>Examples ⑦</b> — finish the Clear Code port (3D + shaders). (2/3)`,
          sub: [
            { id: "s1", cat: "code", est: 40, label: "Clear Code 3:50–end (3D collisions, Shaders, the 3D game) — port to C++." },
          ] },
      ],
    },
    {
      id: "d60", date: "2027-04-16", week: "w30", title: "Big Bang v8: 3D N-body & orbit cinematics",
      theme: "Big Bang · v8 — filaments in space you can fly through.",
      tasks: [
        { id: "t1", carried: "d58", obj: EX, cat: "code", est: 30,
          lead: `<b>Examples ⑦</b> — finish the Clear Code port (3D + shaders). (3/3)`,
          sub: [
            { id: "s1", cat: "code", est: 30, label: `Pay attention to the shader chapter — it previews <code>LoadShader</code>/<code>BeginShaderMode</code>.`, note: `Porting it now means the Book of Shaders chapters land on plumbing you already recognize.` },
          ],
          model: `The video's shader chapter is your first sight of <code>LoadShader</code>/<code>BeginShaderMode</code> in action — port it now so the Book of Shaders chapters land on familiar plumbing.`,
          cards: [
            { q: `What does this port-along preview that's coming next?`, a: `raylib's shader pipeline (LoadShader/BeginShaderMode) — the plumbing the Book of Shaders will fill with real GLSL.` },
            { q: `How do you load a 3D model in raylib?`, a: `<code>LoadModel(path)</code> → <code>DrawModel(...)</code> (formats like .obj/.gltf).` },
          ] },
        { id: "t2", obj: PROJ, cat: "project", est: 50,
          lead: `<b>Big Bang v8</b> — the "wow" build. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `Full pairwise gravity in <code>Vector3</code> (+ softening, Verlet); keep Barnes–Hut (now an octree).` },
          ] },
      ],
    },

    /* ---------------- Week 31 ---------------- */
    {
      id: "d61", date: "2027-04-21", week: "w31", title: "Big Bang v8: 3D N-body & orbit cinematics (cont.)",
      theme: "Finish “Big Bang v8: 3D N-body & orbit cinematics” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d60", obj: PROJ, cat: "project", est: 40,
          lead: `<b>Big Bang v8</b> — the "wow" build. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Orbiting <code>Camera3D</code>; additive billboards. Measure FPS; keep it interactive.`, note: `Additive particles need no depth sort — addition is order-independent — which keeps 3D blending simple.` },
          ],
          model: `3D N-body with a roaming camera is the payoff — clusters and filaments in space you can fly through. Additive particles need no depth sort (addition is order-independent), which keeps 3D blending simple.`,
          cards: [
            { q: `Why don't additive-blended particles need depth sorting?`, a: `Addition is commutative — the summed colour is the same in any draw order.` },
            { q: `The v8 state of the sim?`, a: `3D N-body gravity (softened, Verlet), Barnes–Hut/octree acceleration, an orbiting camera, additive glow.` },
          ] },
      ],
    },
    {
      id: "d62", date: "2027-04-22", week: "w31", title: "Consolidate the physics (Nature of Code ~70–80%)",
      theme: "Nature of Code · thread part 14 — correctness is invariants, not vibes.",
      tasks: [
        { id: "t1", obj: NOC, cat: "review", est: 65,
          lead: `<b>Nature of Code ⑭</b> — re-read the physics against YOUR code.`,
          sub: [
            { id: "s1", est: 40, label: `Re-read NoC Ch.2 + Ch.4 alongside your C++; check symmetry & units. Skim any remaining Ch.5/Ch.6.` },
            { id: "s2", cat: "review", est: 25, label: `Verify invariants numerically: total momentum ≈ constant (no external force); energy bounded under Verlet.`,
              note: `Testing invariants catches sign errors and bad softening far better than eyeballing. You're now ~70–80% through the book's relevant material.` },
          ],
          model: `A simulation is "correct" when invariants hold: total momentum stays ~constant with no external force; energy stays bounded with Verlet. Testing these catches sign errors and bad softening far better than eyeballing.`,
          cards: [
            { q: `One quantitative check that your N-body is correct?`, a: `Total momentum ≈ constant (no net external force); energy bounded (not exploding) under Verlet.` },
            { q: `What have you covered of Nature of Code by now?`, a: `All physics-relevant chapters (Intro–Ch.4) plus integration/optimization from Ch.5–6 — ~70–80% of the useful material.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🎨 The physics is owned. Time to make it beautiful: the Book of Shaders begins next.` },
      ],
    },

    /* ---------------- Week 32 ---------------- */
    {
      id: "d63", date: "2027-04-28", week: "w32", title: "Book of Shaders I: the fragment shader & uniforms",
      theme: "Shaders · thread part 1 — one program per pixel, on the GPU.",
      tasks: [
        { id: "t1", obj: SH, cat: "read", est: 95,
          lead: `<b>Shaders ①</b> — what runs on the GPU, and how raylib feeds it.`,
          sub: [
            { id: "s1", est: 25, label: `Read <a href="https://thebookofshaders.com/" target="_blank" rel="noopener">The Book of Shaders</a> Ch.1: what a fragment shader is — one program, run per pixel.` },
            { id: "s2", est: 30, label: "Then BoS Ch.2: GLSL, Hello World, uniforms and <code>gl_FragCoord</code>." },
            { id: "s3", cat: "code", est: 40, label: `In raylib: <code>LoadShader(0, "glow.fs")</code> (passing <code>0</code>/NULL for the vertex shader uses raylib's default), <code>GetShaderLocation</code>, <code>SetShaderValue</code> for time/resolution; wrap in <code>BeginShaderMode/EndShaderMode</code>. See the <a href="https://deepwiki.com/raysan5/raylib/6.4-shader-examples" target="_blank" rel="noopener">DeepWiki shader notes</a>.`, note: `A fragment shader runs once per pixel, in parallel, on the GPU — colour as a function of coordinate + uniforms.` },
          ],
          model: `A fragment shader runs once <b>per pixel, in parallel, on the GPU</b> — you write a pixel's colour as a function of its coordinate + uniforms (time, resolution, your params). raylib bridges CPU→GPU via <code>SetShaderValue</code> on a uniform location.`,
          cards: [
            { q: `What is a fragment shader?`, a: `A tiny program run per-pixel in parallel on the GPU, outputting that pixel's colour.` },
            { q: `How do you pass CPU values (time, params) into a raylib shader?`, a: `<code>GetShaderLocation(shader,"name")</code> once, then <code>SetShaderValue(...)</code> each frame; draw inside <code>BeginShaderMode/EndShaderMode</code>.` },
          ] },
      ],
      note: "Nature of Code is ~70–80% done; the simulation is 3D. Everything from here is the GPU-side look — glow, nebula, bloom — folded straight into the sim.",
    },
    {
      id: "d64", date: "2027-05-01", week: "w32", title: "Book of Shaders II: shaping functions & colour",
      theme: "Shaders · thread part 2 — smoothstep + mix are 80% of pretty.",
      tasks: [
        { id: "t1", obj: SH, cat: "read", est: 25,
          lead: `<b>Shaders ②</b> — the two functions behind most effects. (1/3)`,
          sub: [
            { id: "s1", est: 25, label: "Read BoS Ch.3.1: step, smoothstep, and sin/cos shaping functions." },
          ] },
      ],
    },

    /* ---------------- Week 33 ---------------- */
    {
      id: "d65", date: "2027-05-06", week: "w33", title: "Book of Shaders II: shaping functions & colour (cont.)",
      theme: "Finish “Book of Shaders II: shaping functions & colour” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d64", obj: SH, cat: "read", est: 25,
          lead: `<b>Shaders ②</b> — the two functions behind most effects. (2/3)`,
          sub: [
            { id: "s1", est: 25, label: "Then BoS Ch.3.2: mix, gradients, and HSB colour." },
          ] },
      ],
    },
    {
      id: "d66", date: "2027-05-10", week: "w33", title: "Book of Shaders III: distance fields → a glowing particle",
      theme: "Shaders · thread part 3 — one shader draws a perfect glowing dot.",
      tasks: [
        { id: "t1", carried: "d64", obj: SH, cat: "read", est: 35,
          lead: `<b>Shaders ②</b> — the two functions behind most effects. (3/3)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Write a shader that fades a colour smoothly across the screen; try an HSB cosmic palette.`, note: `<code>smoothstep</code> (soft 0→1 ramp) + <code>mix</code> (blend) are ~80% of pretty shader effects.` },
          ],
          model: `<code>smoothstep(a,b,x)</code> is the workhorse — a smooth 0→1 ramp between two edges, giving soft falloffs and anti-aliased edges. <code>mix(c1,c2,t)</code> blends colours. Together they're ~80% of pretty shader effects.`,
          cards: [
            { q: `What does <code>smoothstep(a,b,x)</code> give you?`, a: `A smooth 0→1 transition as x goes a→b (soft edges/falloff).` },
            { q: `<code>mix(a,b,t)</code> does what?`, a: `Linear blend: <code>a·(1−t) + b·t</code> (interpolate colours/values).` },
          ] },
        { id: "t2", obj: SH, cat: "code", est: 40,
          lead: `<b>Shaders ③</b> — draw a soft glow on the GPU. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read BoS Ch.3.3 (circles, distance fields, their properties).` },
          ] },
      ],
    },

    /* ---------------- Week 34 ---------------- */
    {
      id: "d67", date: "2027-05-15", week: "w34", title: "Book of Shaders III: distance fields → a glowing particle (cont.)",
      theme: "Finish “Book of Shaders III: distance fields → a glowing particle” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d66", obj: SH, cat: "code", est: 50,
          lead: `<b>Shaders ③</b> — draw a soft glow on the GPU. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 50, label: `Write a fragment shader: <code>glow = 1.0 - smoothstep(0.0, radius, length(uv - center)); color * glow;</code> — replacing stacked translucent circles.`, note: `Keep <code>edge0 &lt; edge1</code> in smoothstep — the reversed form is undefined in GLSL. One shader draws a perfect glowing dot at any size.` },
          ],
          model: `A soft particle is a <b>distance field</b>: brightness = a smoothstep falloff of the distance from the pixel to the particle center. One shader draws a perfect glowing dot at any size — sharper, cheaper, and prettier than layering circles.`,
          cards: [
            { q: `How do you draw a soft glowing dot in a fragment shader?`, a: `<code>brightness = 1.0 - smoothstep(0.0, r, distance-to-center)</code>; multiply the colour by it (bright center → dark edge).` },
            { q: `Why is a distance-field glow better than stacked circles?`, a: `One GPU pass, scales to any size without banding, and is cheaper at high particle counts.` },
          ] },
      ],
    },
    {
      id: "d68", date: "2027-05-18", week: "w34", title: "Big Bang v9: GPU glow on every particle",
      theme: "Big Bang · v9 — move the look onto the GPU.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 90,
          lead: `<b>Big Bang v9</b> — shader-lit particles.`,
          sub: [
            { id: "s1", est: 50, label: `Apply the distance-field glow shader to the sim's particles (as billboards/point sprites).` },
            { id: "s2", est: 40, label: `Pass per-particle colour (by speed/age) via a uniform or vertex attribute; study <code>shaders_custom_uniform</code>.`, note: `Young = blue-hot, old = red (a redshift-like cue) — reads the physics at a glance.` },
          ],
          model: `Move the look to the GPU: each particle is a quad, the fragment shader paints the soft glow, additive blending stacks them. Colour by speed or age (young = blue-hot, old = red) to read the physics at a glance.`,
          cards: [
            { q: `How does the glow shader attach to sim particles?`, a: `Draw each particle as a billboard/quad and run the glow fragment shader in <code>BeginShaderMode</code> with additive blending.` },
            { q: `A good physical mapping for particle colour?`, a: `By speed or age — fast/young = blue-white, slow/old = red (a redshift-like cue).` },
          ] },
      ],
    },

    /* ---------------- Week 35 ---------------- */
    {
      id: "d69", date: "2027-05-21", week: "w35", title: "Book of Shaders IV: noise",
      theme: "Shaders · thread part 4 — GPU 'random' is a deterministic hash.",
      tasks: [
        { id: "t1", obj: SH, cat: "read", est: 60,
          lead: `<b>Shaders ④</b> — controllable randomness on the GPU. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: "Read BoS Ch.4.1–4.4: <code>random</code> on the GPU, and controlling chaos." },
            { id: "s2", est: 30, label: "Then BoS Ch.4.5–4.8: 2D value & gradient noise, and using noise." },
          ] },
      ],
    },
    {
      id: "d70", date: "2027-05-23", week: "w35", title: "Book of Shaders IV: noise (cont.)",
      theme: "Finish “Book of Shaders IV: noise” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d69", obj: SH, cat: "read", est: 35,
          lead: `<b>Shaders ④</b> — controllable randomness on the GPU. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 35, label: `Build a scrolling 2D noise field; compare it with a CPU RNG.`, note: `GPU "random" is a deterministic hash (same input → same output) — stable per pixel, no flicker, the raw material for clouds.` },
          ],
          model: `GPU "random" is <b>deterministic hashing</b>, not RNG: same input → same output, so it's stable per pixel and cheap. 2D noise gives smooth, controllable randomness across the screen — the raw material for clouds and dust.`,
          cards: [
            { q: `Why is shader "random" a hash, and why does that matter?`, a: `It's a deterministic function of coordinates (same input→same output) — stable, no per-frame flicker, no state.` },
            { q: `What does 2D noise provide toward a nebula?`, a: `Smooth spatial randomness — a density/gas field you can colour and layer.` },
          ] },
      ],
    },

    /* ---------------- Week 36 ---------------- */
    {
      id: "d71", date: "2027-05-27", week: "w36", title: "Book of Shaders V: fBm → a nebula",
      theme: "Shaders · thread part 5 — octaves of noise = clouds.",
      tasks: [
        { id: "t1", obj: SH, cat: "code", est: 40,
          lead: `<b>Shaders ⑤</b> — clouds from layered noise. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read BoS Ch.4.9–4.12 (Fractal Brownian Motion, fractals).` },
          ] },
      ],
    },
    {
      id: "d72", date: "2027-05-29", week: "w36", title: "Book of Shaders V: fBm → a nebula (cont.)",
      theme: "Finish “Book of Shaders V: fBm → a nebula” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d71", obj: SH, cat: "code", est: 50,
          lead: `<b>Shaders ⑤</b> — clouds from layered noise. (2/2)`,
          sub: [
            { id: "s1", cat: "code", est: 50, label: `Layer several octaves of noise (fBm) into a wispy density field; tint with an HSB palette.`, note: `fBm = sum noise at doubling frequencies / halving amplitudes — self-similar detail is exactly what makes cloud/nebula textures.` },
          ],
          model: `<b>Fractal Brownian Motion</b> sums noise at doubling frequencies and halving amplitudes (octaves). That self-similar layering is exactly what makes cloud, smoke, and nebula textures — the canonical GPU recipe for volumetric-looking gas.`,
          cards: [
            { q: `What is fBm (fractal Brownian motion)?`, a: `A sum of noise octaves — each double the frequency and half the amplitude — giving natural cloud/nebula detail.` },
            { q: `Why does fBm look like gas/clouds?`, a: `Self-similar detail at many scales matches how real turbulent media look.` },
          ] },
      ],
    },

    /* ---------------- Week 37 ---------------- */
    {
      id: "d73", date: "2027-06-02", week: "w37", title: "Big Bang v10: the cosmos gets a nebula",
      theme: "Big Bang · v10 — couple the art to the physics.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 90,
          lead: `<b>Big Bang v10</b> — gas that glows where matter clusters.`,
          sub: [
            { id: "s1", est: 50, label: `Render an fBm nebula (background or volumetric layer) modulated by particle density; use an HSB cosmic palette.` },
            { id: "s2", est: 40, label: `Blend it under/over the glowing particles (a low-res density buffer works well).`, note: `Modulating the nebula by particle density makes gas glow where matter clusters — now the physics and the art are the same thing.` },
          ],
          model: `Feed the simulation into the look: use local particle density (or a low-res density texture) to modulate the fBm nebula so gas glows where matter clusters. Now the physics and the art are the same thing.`,
          cards: [
            { q: `How do you couple the nebula to the actual simulation?`, a: `Modulate the fBm/colour by particle density (e.g. a low-res density buffer) so gas brightens where mass clusters.` },
            { q: `Where does the nebula sit in the draw order?`, a: `As a layer blended with the particle field (often additive/screen) — behind or interwoven with the glowing points.` },
          ] },
      ],
    },
    {
      id: "d74", date: "2027-06-07", week: "w37", title: "Book of Shaders VI: blur & blend → bloom",
      theme: "Shaders · thread part 6 — the recipe for light bleed.",
      tasks: [
        { id: "t1", obj: SH, cat: "read", est: 55,
          lead: `<b>Shaders ⑥</b> — the post-process behind every glowing render. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: "Read BoS Ch.5 up to kernel convolution: textures and blend modes." },
            { id: "s2", est: 30, label: "Then the rest of BoS Ch.5: kernel convolution and the Gaussian blur." },
          ] },
      ],
    },

    /* ---------------- Week 38 ---------------- */
    {
      id: "d75", date: "2027-06-11", week: "w38", title: "Big Bang v11: bloom post-process",
      theme: "Big Bang · v11 — bright cores bleed light.",
      tasks: [
        { id: "t1", carried: "d74", obj: SH, cat: "read", est: 40,
          lead: `<b>Shaders ⑥</b> — the post-process behind every glowing render. (2/2)`,
          sub: [
            { id: "s1", cat: "review", est: 40, label: `The bloom recipe: bright-pass → blur → additively composite. Study <code>shaders_postprocessing</code> + <code>core_render_texture</code>.`, note: `Do the blur <b>separable</b> (H then V) — a 2-D Gaussian factorizes into two 1-D passes, O(2n) samples instead of O(n²).` },
          ],
          model: `Bloom = extract the bright pixels, blur them (a Gaussian kernel convolution, usually two 1-D passes), then add the blurred glow back over the scene. A <b>separable</b> blur (horizontal then vertical) is far cheaper than a 2-D kernel.`,
          cards: [
            { q: `The three steps of a bloom post-process?`, a: `Threshold bright areas → Gaussian blur them → additively composite back over the original.` },
            { q: `Why do a separable (H then V) blur?`, a: `A 2-D Gaussian factorizes into two 1-D passes — O(2n) samples instead of O(n²).` },
          ] },
        { id: "t2", obj: PROJ, cat: "project", est: 50,
          lead: `<b>Big Bang v11</b> — real light bloom. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `Render the sim to a <code>RenderTexture2D</code>; run bright-pass + separable blur shaders; composite additively to the screen.` },
          ] },
      ],
    },
    {
      id: "d76", date: "2027-06-12", week: "w38", title: "Big Bang v11: bloom post-process (cont.)",
      theme: "Finish “Big Bang v11: bloom post-process” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d75", obj: PROJ, cat: "project", est: 40,
          lead: `<b>Big Bang v11</b> — real light bloom. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Follow <code>shaders_postprocessing</code> + the <a href="https://buscalaexcusa.com/posts/2025/raylib-how-to-setup-custom-shaders/" target="_blank" rel="noopener">custom-shader setup guide</a>.`, note: `Bloom makes dense cores bleed light like overexposed astrophotography — sells the "cosmic" scale more than any physics tweak.` },
          ],
          model: `Post-processing pipeline: draw world → <code>RenderTexture</code>, then draw that texture full-screen through shader passes. Bloom makes dense cores bleed light and sells the "cosmic" scale more than any physics tweak.`,
          cards: [
            { q: `What raylib object lets you post-process the whole frame?`, a: `<code>RenderTexture2D</code> — render the scene into it, then draw it full-screen through shader passes.` },
            { q: `Why does bloom read as "cosmic scale"?`, a: `Bright cores bleed light like overexposed astrophotography — the eye reads intense luminosity.` },
          ] },
      ],
    },

    /* ---------------- Week 39 ---------------- */
    {
      id: "d77", date: "2027-06-16", week: "w39", title: "Finish the physics tail & consider GPU N-body",
      theme: "Nature of Code · thread part 15 — the path to 100k+ particles.",
      tasks: [
        { id: "t1", obj: NOC, cat: "review", est: 70,
          lead: `<b>Nature of Code ⑮</b> — close it out; know the scale-up path.`,
          sub: [
            { id: "s1", est: 30, label: `Close out any remaining relevant NoC sections.` },
            { id: "s2", est: 40, label: `Read the GPU N-body approach: <a href="https://developer.nvidia.com/gpugems/gpugems3/part-v-physics-simulation/chapter-31-fast-n-body-simulation-cuda" target="_blank" rel="noopener">GPU Gems 3 Ch.31</a> (all-pairs on the GPU) + raylib's <a href="https://github.com/raysan5/raylib/blob/master/examples/shaders/shaders_rlgl_compute.c" target="_blank" rel="noopener">compute-shader example</a> (<code>shaders_rlgl_compute</code>).`,
              note: `Move forces onto the GPU when CPU Barnes–Hut caps out (~tens of thousands) and you want 100k+. Know the option; implement only if you want the scale.` },
          ],
          model: `The CPU (Barnes–Hut) path handles ~tens of thousands; to go massive, move force computation onto the GPU (compute/fragment shader), where all-pairs O(n²) is embarrassingly parallel. Know the option; implement only if you want the scale.`,
          cards: [
            { q: `When do you move N-body forces onto the GPU?`, a: `When CPU Barnes–Hut caps out (~tens of thousands) and you want 100k+ — GPU all-pairs is massively parallel.` },
            { q: `What raylib feature enables GPU force computation?`, a: `Compute shaders via rlgl (see <code>shaders_rlgl_compute</code>) — or encode positions in a texture and compute forces in a fragment shader.` },
          ] },
      ],
    },
    {
      id: "d78", date: "2027-06-17", week: "w39", title: "Big Bang v12: time, colour & cinematics",
      theme: "Big Bang · v12 — the last 10% that makes it an instrument.",
      tasks: [
        { id: "t1", obj: PROJ, cat: "project", est: 50,
          lead: `<b>Big Bang v12</b> — polish into something you can drive. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `Time controls: pause / fast-forward / reverse (scale dt, incl. negative where stable). Colour by age/redshift.` },
          ] },
      ],
    },

    /* ---------------- Week 40 ---------------- */
    {
      id: "d79", date: "2027-06-23", week: "w40", title: "🎓 Capstone: the Big Bang, from void to cosmos",
      theme: "Big Bang · capstone — the whole pipeline, and what you actually built.",
      tasks: [
        { id: "t1", carried: "d78", obj: PROJ, cat: "project", est: 40,
          lead: `<b>Big Bang v12</b> — polish into something you can drive. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Camera keyframes or auto-orbit; screenshot/GIF capture (<code>TakeScreenshot</code>).`, note: `Reverse works cleanly with symmetric/Verlet integration for a while — being able to race through billions of years and orbit turns the sim into an instrument.` },
          ],
          model: `The last 10% is controls and framing: being able to pause, race through billions of years, reverse, and orbit turns the sim from a demo into an instrument for <i>seeing</i> the physics. Redshift-by-age makes time legible in colour.`,
          cards: [
            { q: `How do you let the user run time backward?`, a: `Integrate with a negative dt scale (works cleanly with symmetric/Verlet integration for a while).` },
            { q: `What turns the sim from demo into instrument?`, a: `Time controls (pause/fast-forward/reverse) + a controllable/keyframed camera + capture.` },
          ] },
        { id: "t2", obj: PROJ, cat: "project", est: 50,
          lead: `<b>Capstone</b> — assemble every layer into the finished simulation. (1/2)`,
          sub: [
            { id: "s1", est: 50, label: `Integrate the full pipeline: seeded burst → 3D softened Verlet N-body (Barnes–Hut) → additive GPU glow → fBm nebula → bloom → time & camera controls.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🎉 Side track "Big Bang" complete. From an empty window to a shader-lit gravitational universe — and raylib, simulation physics, and GPU shaders learned along the way.` },
      ],
      note: "The journey's end — and a foundation for whatever you simulate next.",
    },
    {
      id: "d80", date: "2027-06-29", week: "w40", title: "🎓 Capstone: the Big Bang, from void to cosmos (cont.)",
      theme: "Finish “🎓 Capstone: the Big Bang, from void to cosmos” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d79", obj: PROJ, cat: "project", est: 35,
          lead: `<b>Capstone</b> — assemble every layer into the finished simulation. (2/2)`,
          sub: [
            { id: "s1", cat: "review", est: 35, label: `Write a short README: the physics (inverse-square + softening + integration), the render pipeline, and what you learned. Optionally push to GitHub.`, note: `The real deliverable is the graphics-engine + simulation fluency to build the next idea. That was the point.` },
          ],
          model: `You set out to "set the formulas and physics and see how it comes out." You now have a real gravitational N-body engine, stable integration, spatial acceleration, and a full render pipeline — and, more importantly, the graphics-engine fluency to build the next idea. <b>That was the point.</b>`,
          cards: [
            { q: `The full pipeline of your finished simulation, in order?`, a: `Seed burst → accumulate softened pairwise gravity (Barnes–Hut) → Verlet integrate → draw additive GPU-glow particles → fBm nebula → bloom → present, with time/camera controls.` },
            { q: `What was the real deliverable beyond the sim?`, a: `Graphics-engine + simulation fluency: vectors/forces/integration, particle-system architecture, 2D→3D rendering, and GLSL shaders (glow/nebula/bloom).` },
          ] },
      ],
    },
  ],

  milestones: [
    { id: "w8.m1", week: "w8", title: "Foundations — shapes, vectors & Newton's laws",
      rule: { type: "tasks", require: ["d01.t1", "d02.t1", "d05.t1", "d06.t1", "d07.t1", "d08.t1", "d10.t2", "d11.t1", "d14.t1", "d15.t1"] } },
    { id: "w14.m1", week: "w14", title: "🎮 Half the raylib basics — Collision & Tilemaps done",
      rule: { type: "tasks", require: ["d16.t1", "d17.t1", "d20.t1", "d21.t1", "d22.t1", "d23.t1", "d27.t1", "d28.t1"] } },
    { id: "w24.m1", week: "w24", title: "Nature of Code physics core done (Intro–Ch.4) + Udemy course complete",
      rule: { type: "tasks", require: ["d34.t1", "d35.t1", "d36.t1", "d40.t1", "d45.t1", "d46.t1", "d47.t1"] } },
    { id: "w26.m1", week: "w26", title: "🌌 The simulation lives — a 2D gravitational Big Bang",
      rule: { type: "tasks", require: ["d38.t1", "d39.t1", "d41.t1", "d49.t1", "d52.t1"] } },
    { id: "w32.m1", week: "w32", title: "Into 3D & shaders begin — Nature of Code ~70–80%",
      rule: { type: "tasks", require: ["d57.t1", "d60.t2", "d61.t1", "d62.t1", "d63.t1"] } },
    { id: "w40.m1", week: "w40", title: "🎓 Capstone — 3D Big Bang: N-body, glow, nebula & bloom",
      rule: { type: "tasks", require: ["d71.t1", "d72.t1", "d73.t1", "d75.t2", "d76.t1", "d78.t1", "d79.t1", "d79.t2", "d80.t1"] } },
  ],
});
