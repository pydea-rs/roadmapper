// _index.js — registers every roadmap. Imported once by app.js before boot.
// Add a line per roadmap module; order here is sidebar order.

import "./rust-fastapi.js";   // Roadmap 1 — Rust + FastAPI (priority HIGH)
import "./interp-go.js";      // Roadmap 2 — Interpreters & Go (priority MEDIUM)

// Side track (kind:"side") — separate progress/effort, its own sidebar section.
import "./bedrock.js";        // Bedrock — backend/blockchain foundations & internals
import "./raylib.js";         // Big Bang — raylib (C++), graphics/sim math & a Big Bang simulation

// import "./_fixture.js";    // engine test fixture (kept for regression testing)
