// interludes.js — curated "between-days" resource cards for each roadmap.
//
// These are the "commercials between phases": short videos / good articles that
// sit BETWEEN two days in the timeline (after `afterDay`), unrelated to task
// state — just a "seen" checkbox. They're placed at meaningful concept
// boundaries (after a serious idea has been learned) and summarise, extend, or
// preview the surrounding material.
//
// Deliberately CONSTANT (no per-render network): each card links to a LIVE
// results page for a precise, curated query, so the link is always relevant and
// can never rot to a 404 — the reliability the timeline needs. The Today finder
// is where live scraping lives; here we trade a scraped thumbnail for a
// guaranteed-good, instant, curated card. `query` is also future-proofing: the
// same finder mechanism could later enrich these with a real thumbnail.
//
// Shape: { id, afterDay, kind:'video'|'article', title, note, query, source }.
// `id` is unique within a roadmap and is what the `seen:` tick keys off — keep
// it stable once shipped so a viewed card stays viewed.

const INTERLUDES = {
  "rust-fastapi": [
    { id: "il1", afterDay: "d05", kind: "video",
      title: "Rust smart pointers: Box, Rc, RefCell — when to reach for which",
      note: "You just met Box, Rc, RefCell & Weak. This ties them together — ownership, shared ownership, and interior mutability in one mental model.",
      query: "rust Box Rc RefCell Weak interior mutability explained", source: "YouTube" },
    { id: "il2", afterDay: "d10", kind: "video",
      title: "Traits, generics & trait objects — Rust's answer to polymorphism",
      note: "After OOP-in-Rust and pattern matching: how traits replace inheritance, and when static generics vs dynamic `dyn` dispatch is the right call.",
      query: "rust traits generics trait objects dynamic dispatch explained", source: "YouTube" },
    { id: "il3", afterDay: "d15", kind: "article",
      title: "Building a multithreaded web server (The Rust Book, final project)",
      note: "You built a single-threaded server then a thread pool — this is the canonical end-to-end walkthrough of exactly that project.",
      query: "the rust book final project multithreaded web server thread pool", source: "the web" },
    { id: "il4", afterDay: "d24", kind: "video",
      title: "Async Rust & Tokio — futures, .await and the runtime, visually",
      note: "Right before Async Rust week: the intuition for futures, the executor, and why `.await` is not a thread.",
      query: "async rust tokio futures await runtime explained", source: "YouTube" },
  ],

  "interp-go": [
    { id: "il1", afterDay: "d03", kind: "video",
      title: "How a tree-walking interpreter works — tokens to evaluation",
      note: "jlox's control flow and functions are done. Step back and see the whole tree-walker pipeline — scanner, parser, evaluator — in one view.",
      query: "tree walking interpreter how it works crafting interpreters", source: "YouTube" },
    { id: "il2", afterDay: "d08", kind: "article",
      title: "Pratt parsing (top-down operator precedence), explained clearly",
      note: "jlox is finished and clox's compiler is next — Pratt parsing is the trick at its heart. Get ahead of it.",
      query: "pratt parsing top down operator precedence tutorial", source: "the web" },
    { id: "il3", afterDay: "d13", kind: "video",
      title: "Bytecode & stack-based virtual machines — how clox executes",
      note: "Now that clox is a bytecode VM: how a stack machine runs compiled instructions, and why it leaves tree-walking in the dust.",
      query: "bytecode virtual machine stack machine interpreter explained", source: "YouTube" },
    { id: "il4", afterDay: "d24", kind: "video",
      title: "Sessions, cookies & CSRF in Go web apps — the security model",
      note: "Matching your Go track: how server sessions, secure cookies, and CSRF protection actually fit together.",
      query: "go web sessions cookies csrf security explained", source: "YouTube" },
    { id: "il5", afterDay: "d27", kind: "video",
      title: "Garbage collection: mark-and-sweep, from scratch",
      note: "You're implementing clox's GC — here's the mark-sweep algorithm and the tri-colour abstraction, visualised.",
      query: "garbage collection mark and sweep tricolor explained", source: "YouTube" },
  ],

  "raylib": [
    { id: "il1", afterDay: "d03", kind: "video",
      title: "Perlin noise, visually — the smooth randomness behind natural motion",
      note: "You just met Perlin noise seeding a universe. See why it looks organic, and how it differs from flat uniform random.",
      query: "perlin noise explained visually how it works", source: "YouTube" },
    { id: "il2", afterDay: "d06", kind: "video",
      title: "Vectors for motion — position, velocity & acceleration (Nature of Code)",
      note: "After building a Mover: the vector math that drives every moving thing, straight from the Nature of Code series.",
      query: "nature of code vectors velocity acceleration the coding train", source: "YouTube" },
    { id: "il3", afterDay: "d13", kind: "video",
      title: "The N-body problem — the algorithm behind your Big Bang",
      note: "You just wrote the gravitational-attraction kernel. Here's the N-body problem and how simulations scale it past brute force.",
      query: "n-body gravity simulation algorithm explained", source: "YouTube" },
    { id: "il4", afterDay: "d22", kind: "video",
      title: "Particle systems from scratch — emitters, forces & additive glow",
      note: "As you build particle systems: emitter design, applying forces per particle, and the additive blending that makes them glow.",
      query: "particle system tutorial emitter forces additive blending", source: "YouTube" },
  ],

  "bedrock": [
    { id: "il1", afterDay: "d06", kind: "video",
      title: "How the internet really works — packets, layers & routing",
      note: "You've covered OSI-vs-reality, IP/CIDR and containers. This ties the networking stack together, end to end.",
      query: "how the internet works tcp ip layers packets explained", source: "YouTube" },
    { id: "il2", afterDay: "d14", kind: "video",
      title: "The TLS 1.3 handshake & PKI, step by step",
      note: "You just did TLS 1.3 and crypto primitives — watch the handshake and certificate chain assemble in real time.",
      query: "tls 1.3 handshake pki certificates explained", source: "YouTube" },
    { id: "il3", afterDay: "d20", kind: "video",
      title: "Inside Postgres: MVCC, indexes & the query planner",
      note: "You've hit MVCC, B-trees, EXPLAIN and isolation levels — this pulls Postgres's storage and planning internals into one picture.",
      query: "postgres internals mvcc index query planner explained", source: "YouTube" },
    { id: "il4", afterDay: "d32", kind: "video",
      title: "Inside the EVM — a stack machine, storage & gas",
      note: "After the EVM, Solana's account model and a borrow-checker review: the classic walkthrough of how the EVM actually executes a transaction.",
      query: "ethereum evm stack machine storage gas explained", source: "YouTube" },
    { id: "il5", afterDay: "d45", kind: "video",
      title: "Raft consensus, visualised — leader election & log replication",
      note: "Right after Raft, Paxos and Byzantine faults: the classic visual explainer of how a cluster agrees on a single log.",
      query: "raft consensus algorithm visualized leader election", source: "YouTube" },
    { id: "il6", afterDay: "d70", kind: "video",
      title: "LSM-trees vs B-trees — how modern databases store data",
      note: "You compared storage engines — see how LSM-trees trade read cost for write throughput, and why RocksDB & Cassandra pick them.",
      query: "lsm tree vs b-tree storage engine explained", source: "YouTube" },
  ],
};

export function getInterludes(slug) { return INTERLUDES[slug] || []; }

/** The interlude(s) that sit right after a given day id (usually 0 or 1). */
export function interludesAfter(slug, dayId) {
  return (INTERLUDES[slug] || []).filter(i => i.afterDay === dayId);
}

/** The live results-page URL a card links to (kept here so render + tests agree). */
export function interludeUrl(il) {
  return il.kind === "article"
    ? "https://duckduckgo.com/?q=" + encodeURIComponent(il.query)
    : "https://www.youtube.com/results?search_query=" + encodeURIComponent(il.query);
}
