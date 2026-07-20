// interludes.js — curated "between-days" resource cards for each roadmap.
//
// These are the "commercials between phases": a specific, hand-picked video or
// article that sits BETWEEN two days in the timeline (after `afterDay`),
// unrelated to task state — just a "seen" checkbox. They're placed at meaningful
// concept boundaries (after a serious idea has been learned) and summarise,
// extend, or preview the surrounding material.
//
// Each card links DIRECTLY to one specific resource (`url`) — not a search page.
// The URLs were researched and verified to resolve to on-topic content (YouTube
// videos confirmed via oembed; docs/articles are canonical). `query` is kept as
// a reference / safe fallback (interludeUrl uses it only if `url` is ever unset).
//
// Shape: { id, afterDay, kind:'video'|'article', title, source, note, url, query }.
// `id` is unique within a roadmap and is what the `seen:` tick keys off — keep it
// stable once shipped so a viewed card stays viewed.

const INTERLUDES = {
  "rust-fastapi": [
    { id: "il1", afterDay: "d05", kind: "video",
      title: "Crust of Rust: Smart Pointers & Interior Mutability",
      source: "Jon Gjengset",
      note: "You just met Box, Rc, RefCell & Weak. Jon rebuilds Cell/RefCell/Rc from scratch — the definitive mental model for interior mutability and shared ownership.",
      url: "https://www.youtube.com/watch?v=8O0Nt9qY_vo",
      query: "rust Box Rc RefCell Weak interior mutability explained" },
    { id: "il2", afterDay: "d10", kind: "video",
      title: "Crust of Rust: Dispatch & Fat Pointers",
      source: "Jon Gjengset",
      note: "After OOP-in-Rust and pattern matching: exactly how trait objects, `dyn`, and vtables work — static vs dynamic dispatch, demystified.",
      url: "https://www.youtube.com/watch?v=xcygqF5LVmM",
      query: "rust traits generics trait objects dynamic dispatch explained" },
    { id: "il3", afterDay: "d15", kind: "article",
      title: "The Rust Book: Building a Multithreaded Web Server",
      source: "doc.rust-lang.org",
      note: "You built a single-threaded server then a thread pool — this is the canonical end-to-end walkthrough of exactly that final project.",
      url: "https://doc.rust-lang.org/book/ch21-00-final-project-a-web-server.html",
      query: "the rust book final project multithreaded web server thread pool" },
    { id: "il4", afterDay: "d24", kind: "video",
      title: "The What and How of Futures & async/await in Rust",
      source: "Jon Gjengset",
      note: "Right before Async Rust week: what a Future really is, how `.await` suspends, and why it isn't a thread.",
      url: "https://www.youtube.com/watch?v=9_3krAQtD2k",
      query: "async rust tokio futures await runtime explained" },
  ],

  "interp-go": [
    { id: "il1", afterDay: "d03", kind: "article",
      title: "Crafting Interpreters: A Tree-Walk Interpreter",
      source: "craftinginterpreters.com",
      note: "jlox's control flow and functions are done. Step back and see the whole tree-walker — scanner, parser, evaluator — laid out by the book you're following.",
      url: "https://craftinginterpreters.com/a-tree-walk-interpreter.html",
      query: "tree walking interpreter how it works crafting interpreters" },
    { id: "il2", afterDay: "d08", kind: "video",
      title: "Pratt Parsing (Top-Down Operator Precedence)",
      source: "Colin James",
      note: "jlox is finished and clox's compiler is next — Pratt parsing is the trick at its heart. Get ahead of it.",
      url: "https://www.youtube.com/watch?v=2l1Si4gSb9A",
      query: "pratt parsing top down operator precedence tutorial" },
    { id: "il3", afterDay: "d13", kind: "article",
      title: "Crafting Interpreters: A Bytecode Virtual Machine",
      source: "craftinginterpreters.com",
      note: "Now that clox is a bytecode VM: how a stack machine runs compiled instructions, and why it leaves tree-walking in the dust.",
      url: "https://craftinginterpreters.com/a-virtual-machine.html",
      query: "bytecode virtual machine stack machine interpreter explained" },
    { id: "il4", afterDay: "d24", kind: "article",
      title: "Implementing CSRF Protection in Go Web Apps",
      source: "themsaid.com",
      note: "Matching your Go track: why secure cookies alone aren't enough, and how CSRF tokens + middleware actually fit together, with Go code.",
      url: "https://themsaid.com/csrf-protection-go-web-applications",
      query: "go web sessions cookies csrf security explained" },
    { id: "il5", afterDay: "d27", kind: "video",
      title: "The Tricolor Abstraction for Concurrent Garbage Collectors",
      source: "Arpit Bhayani",
      note: "You're implementing clox's GC — here's the mark-sweep / tri-colour abstraction that every tracing collector is built on.",
      url: "https://www.youtube.com/watch?v=lhrRwjVPXPo",
      query: "garbage collection mark and sweep tricolor explained" },
  ],

  "raylib": [
    { id: "il1", afterDay: "d03", kind: "video",
      title: "Perlin Noise — The Nature of Code",
      source: "The Coding Train",
      note: "You just met Perlin noise seeding a universe. Dan Shiffman shows why it looks organic, and how it differs from flat uniform random.",
      url: "https://www.youtube.com/watch?v=8ZEMLCnn8v0",
      query: "perlin noise explained visually nature of code" },
    { id: "il2", afterDay: "d06", kind: "video",
      title: "Acceleration Vectors — The Nature of Code",
      source: "The Coding Train",
      note: "After building a Mover: position, velocity and acceleration as vectors — the math that drives every moving thing on screen.",
      url: "https://www.youtube.com/watch?v=T84AWnntxZA",
      query: "nature of code vectors velocity acceleration the coding train" },
    { id: "il3", afterDay: "d13", kind: "video",
      title: "Making an N-Body Simulation",
      source: "Deadlock",
      note: "You just wrote the gravitational-attraction kernel. Here's the N-body problem built up as a simulation — the exact shape of your Big Bang.",
      url: "https://www.youtube.com/watch?v=L9N7ZbGSckk",
      query: "n-body gravity simulation algorithm explained" },
    { id: "il4", afterDay: "d22", kind: "article",
      title: "Nature of Code: Particle Systems",
      source: "natureofcode.com",
      note: "As you build particle systems: emitter design, applying forces per particle, and the additive blending that makes them glow — all in one chapter.",
      url: "https://natureofcode.com/particles/",
      query: "particle system tutorial emitter forces additive blending" },
  ],

  "bedrock": [
    { id: "il1", afterDay: "d06", kind: "video",
      title: "The Internet: Packets, Routing & Reliability",
      source: "Code.org",
      note: "You've covered OSI-vs-reality, IP/CIDR and containers. This ties the networking stack together — how a message really crosses the internet.",
      url: "https://www.youtube.com/watch?v=AYdF7b3nMto",
      query: "how the internet works tcp ip layers packets explained" },
    { id: "il2", afterDay: "d14", kind: "video",
      title: "TLS 1.2 & 1.3, Explained by Example",
      source: "Hussein Nasser",
      note: "You just did TLS 1.3 and crypto primitives — watch the handshake and certificate exchange assemble packet by packet.",
      url: "https://www.youtube.com/watch?v=AlE5X1NlHgg",
      query: "tls 1.3 handshake pki certificates explained" },
    { id: "il3", afterDay: "d20", kind: "video",
      title: "PostgreSQL Internal Architecture Explained",
      source: "Hussein Nasser",
      note: "You've hit MVCC, B-trees, EXPLAIN and isolation levels — this pulls Postgres's storage and process internals into one picture.",
      url: "https://www.youtube.com/watch?v=Q56kljmIN14",
      query: "postgres internals mvcc index query planner explained" },
    { id: "il4", afterDay: "d32", kind: "video",
      title: "What is the EVM? Explained with Animations",
      source: "Whiteboard Crypto",
      note: "After the EVM, Solana's account model and a borrow-checker review: a clean animated walkthrough of how the EVM executes a transaction.",
      url: "https://www.youtube.com/watch?v=sTOcqS4msoU",
      query: "ethereum evm stack machine storage gas explained" },
    { id: "il5", afterDay: "d45", kind: "video",
      title: "Raft: The Understandable Distributed Protocol",
      source: "Ben Johnson",
      note: "Right after Raft, Paxos and Byzantine faults: the classic talk on how a cluster agrees on a single log — leader election and replication.",
      url: "https://www.youtube.com/watch?v=ro2fU8_mr2w",
      query: "raft consensus algorithm visualized leader election" },
    { id: "il6", afterDay: "d70", kind: "video",
      title: "How Databases Store Your Data: B-Trees vs LSM-Trees",
      source: "ByteMonk",
      note: "You compared storage engines — see how LSM-trees trade read cost for write throughput, and why RocksDB & Cassandra pick them.",
      url: "https://www.youtube.com/watch?v=Q9xD4J3tezw",
      query: "lsm tree vs b-tree storage engine explained" },
  ],
};

export function getInterludes(slug) { return INTERLUDES[slug] || []; }

/** The interlude(s) that sit right after a given day id (usually 0 or 1). */
export function interludesAfter(slug, dayId) {
  return (INTERLUDES[slug] || []).filter(i => i.afterDay === dayId);
}

/** The URL a card links to: the curated direct resource (`url`) when present,
 *  else a live results page for the query as a safe fallback. */
export function interludeUrl(il) {
  if (il.url) return il.url;
  return il.kind === "article"
    ? "https://duckduckgo.com/?q=" + encodeURIComponent(il.query)
    : "https://www.youtube.com/results?search_query=" + encodeURIComponent(il.query);
}
