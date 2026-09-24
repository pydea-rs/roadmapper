// bedrock.js — SIDE-TRACK roadmap "Bedrock" (kind:"side").
//
// Purpose: close the theory/internals gaps a backend + blockchain engineer is
// expected to own — the stuff that surfaces in interviews and tech talks. It is
// deliberately NOT a single subject: each domain is an ordered THREAD
// (Networking A→B→C…, DevOps 1→2→3…, Databases…), but the threads are
// INTERLEAVED across the calendar, so consecutive side-days switch topics (TCP
// one day, containers the next, a chain the next). A thread always advances in
// order when it reappears. First 3 months (this 12-week core) front-load the
// most important backend/blockchain foundations, with Networking + DevOps from
// week 1; deeper "under the hood" material continues in a later extension.
//
// Cadence: 2–3 focused side-days per week, on weekdays that change from week to week
// — see the 2026-09-25 note — one ~40–95 min card each, alongside the main roadmaps. Progress/effort stay OFF the main track's
// totals (kind:"side") — only the Today panel's "Main + Side" line combines them.
//
// Tasks use the STRUCTURED form (lead / refs / model): a headline, a scannable
// list of reading/do items, and a takeaway — so long tasks don't read as a wall
// of text. References were link/chapter verified (2026-07-18); book citations
// give chapter/section (page numbers drift across editions and are omitted).
// Editions: Mastering Bitcoin 3rd, Mastering Ethereum 2nd, DDIA 1st, Kafka: The
// Definitive Guide 2nd (free from Confluent), OWASP Top 10 2025.

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
// For this file: 97 → 134 cards, 32 → 48 weeks, 2026-09-24 → 2027-08-24. Required work
// 132.3h → 147.2h — a smaller rise than the other roadmaps because the fix here was
// mostly SPLITTING: 203 reading leaves became 289, one source each. 2–3 cards a week;
// 49 tasks carried, 37 continuation cards, 91 split parts.
// This file also gained a `library:` — every book, paper, spec and docs set it reads
// from, with author, edition, whether it is free and where to get it. A day card's
// right-click menu has a "Reading list — sources" entry that groups that card's work by
// the source it comes from (DESIGN §7.6). Bedrock is the only roadmap that has one.

import { registerRoadmap } from "../assets/js/registry.js";

const NET = "net", SYS = "sys", DATA = "data", CACHE = "cache", MSG = "msg",
      OPS = "devops", CHAIN = "chain", SEC = "sec", REV = "review", DIST = "dist",
      CORE = "internals", COMP = "compilers";

registerRoadmap({
  slug: "bedrock",
  title: "Bedrock",
  icon: "🧱",
  kind: "side",
  subtitle: "The theory & internals a backend/blockchain dev must own — networking, systems, data, DevOps, chains & security, taught from the wire up.",
  accent: "#6366f1",
  schemaVersion: 1,
  // [2,4] is the literal range the schedule uses (most weeks 3, a couple 2 and 4).
  // The band's midpoint is what drives the projection, so declaring [2,3] understated
  // the real 3.03 days/week and pushed the projected finish months late.
  cadence: { activeDaysPerWeek: [2, 3] },

  objectives: [
    { id: NET,   title: "Networking",              tier: "primary", color: "#4a9eff" },
    { id: OPS,   title: "DevOps & Infra",          tier: "primary", color: "#14b8a6" },
    { id: SYS,   title: "Systems & OS",            tier: "primary", color: "#a78bfa" },
    { id: DATA,  title: "Databases",               tier: "primary", color: "#34d399" },
    { id: CACHE, title: "Caching & Redis",         tier: "primary", color: "#ef4444" },
    { id: MSG,   title: "Messaging & Streaming",   tier: "primary", color: "#f59e0b" },
    { id: CHAIN, title: "Blockchain internals",    tier: "primary", color: "#c084fc" },
    { id: SEC,   title: "Security",                tier: "primary", color: "#f43f5e" },
    { id: DIST,  title: "Distributed systems",     tier: "primary", color: "#22d3ee" },
    { id: CORE,  title: "Data-structure & runtime internals", tier: "primary", color: "#f472b6" },
    { id: COMP,  title: "Compilers & interpreters",    tier: "primary", color: "#a3e635" },
    { id: REV,   title: "Language & framework review", tier: "primary", color: "#94a3b8" },
  ],

  library: [
    {"id":"ostep","title":"Operating Systems: Three Easy Pieces","kind":"book","by":"Remzi & Andrea Arpaci-Dusseau","edition":"v1.10","free":true,"url":"https://pages.cs.wisc.edu/~remzi/OSTEP/","get":"Every chapter is a free PDF on the book's own page — no account, no paywall.","match":["pages.cs.wisc.edu/~remzi/OSTEP","OSTEP"]},
    {"id":"ddia","title":"Designing Data-Intensive Applications","kind":"book","by":"Martin Kleppmann","edition":"1st ed. (O'Reilly, 2017)","free":false,"url":"https://dataintensive.net/","get":"Paid. The 2nd edition is in early release; chapter numbers below follow the 1st edition.","match":["DDIA"]},
    {"id":"csapp","title":"Computer Systems: A Programmer's Perspective","kind":"book","by":"Randal Bryant & David O'Hallaron","edition":"3rd ed.","free":false,"url":null,"get":"Paid. Ch 6 is the memory-hierarchy chapter; the free Drepper paper below covers the same ground.","match":["CS:APP"]},
    {"id":"mastering-ethereum","title":"Mastering Ethereum","kind":"book","by":"Andreas M. Antonopoulos & Gavin Wood","edition":"2nd ed.","free":true,"url":"https://github.com/ethereumbook/ethereumbook","get":"The full text is in the book's GitHub repo, chapter by chapter, under CC-BY-SA.","match":["ethereumbook","Mastering Ethereum"]},
    {"id":"mastering-bitcoin","title":"Mastering Bitcoin","kind":"book","by":"Andreas M. Antonopoulos & David A. Harding","edition":"3rd ed.","free":true,"url":"https://github.com/bitcoinbook/bitcoinbook","get":"Free in the book's GitHub repo (AsciiDoc, one file per chapter).","match":["bitcoinbook","Mastering Bitcoin"]},
    {"id":"kafka-dg","title":"Kafka: The Definitive Guide","kind":"book","by":"Gwen Shapira, Todd Palino, Rajini Sivaram & Krit Petty","edition":"2nd ed.","free":true,"url":"https://www.confluent.io/resources/kafka-the-definitive-guide-v2/","get":"Confluent gives the whole book away as a PDF behind a short form.","match":["Kafka: The Definitive Guide","kafka-the-definitive-guide"]},
    {"id":"hpbn","title":"High Performance Browser Networking","kind":"book","by":"Ilya Grigorik","edition":"O'Reilly, 2013","free":true,"url":"https://hpbn.co/","get":"The complete book is online at hpbn.co. Pre-dates HTTP/3, which is why QUIC comes from elsewhere.","match":["hpbn.co"]},
    {"id":"sre-book","title":"Site Reliability Engineering","kind":"book","by":"Betsy Beyer, Chris Jones, Jennifer Petoff & Niall Murphy (Google)","edition":"","free":true,"url":"https://sre.google/sre-book/table-of-contents/","get":"Google publishes the full text online for free.","match":["sre.google/sre-book"]},
    {"id":"utl","title":"Use The Index, Luke!","kind":"book","by":"Markus Winand","edition":"","free":true,"url":"https://use-the-index-luke.com/","get":"Free web edition of SQL Performance Explained — the indexing half.","match":["use-the-index-luke.com"]},
    {"id":"crafting-interpreters","title":"Crafting Interpreters","kind":"book","by":"Robert Nystrom","edition":"","free":true,"url":"https://craftinginterpreters.com/","get":"Free online in full. This is the same book the Go + interpreters roadmap builds through.","match":["craftinginterpreters.com"]},
    {"id":"http3-explained","title":"HTTP/3 explained","kind":"book","by":"Daniel Stenberg (curl)","edition":"","free":true,"url":"https://http3-explained.haxx.se/","get":"Free online book; the readable companion to RFC 9000/9114.","match":["http3-explained.haxx.se"]},
    {"id":"loti","title":"Lord of the io_uring","kind":"book","by":"Shuveb Hussain","edition":"","free":true,"url":"https://unixism.net/loti/","get":"Free online guide + tutorial code for io_uring.","match":["unixism.net/loti"]},
    {"id":"raft-paper","title":"In Search of an Understandable Consensus Algorithm (Raft)","kind":"paper","by":"Diego Ongaro & John Ousterhout","edition":"Extended version","free":true,"url":"https://raft.github.io/raft.pdf","get":"Read the EXTENDED version (the conference version cuts the parts you want).","match":["raft.github.io/raft.pdf","Raft paper"]},
    {"id":"lamport","title":"Lamport's papers","kind":"paper","by":"Leslie Lamport","edition":"","free":true,"url":"https://lamport.azurewebsites.net/pubs/pubs.html","get":"Paxos Made Simple and Time, Clocks & the Ordering of Events are both free PDFs here.","match":["lamport.azurewebsites.net"]},
    {"id":"pbft","title":"Practical Byzantine Fault Tolerance","kind":"paper","by":"Miguel Castro & Barbara Liskov","edition":"OSDI '99","free":true,"url":"https://pmg.csail.mit.edu/papers/osdi99.pdf","get":"","match":["pmg.csail.mit.edu/papers/osdi99.pdf"]},
    {"id":"dynamo","title":"Dynamo: Amazon's Highly Available Key-value Store","kind":"paper","by":"Giuseppe DeCandia et al. (Amazon)","edition":"SOSP 2007","free":true,"url":"https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf","get":"","match":["amazon-dynamo-sosp2007"]},
    {"id":"cap-paper","title":"Perspectives on the CAP Theorem","kind":"paper","by":"Seth Gilbert & Nancy Lynch","edition":"2012","free":true,"url":"https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf","get":"","match":["groups.csail.mit.edu/tds/papers/Gilbert"]},
    {"id":"pacelc","title":"Consistency Tradeoffs in Modern Distributed Database Design (PACELC)","kind":"paper","by":"Daniel Abadi","edition":"","free":true,"url":"https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf","get":"","match":["cs.umd.edu/~abadi"]},
    {"id":"sagas","title":"Sagas","kind":"paper","by":"Hector Garcia-Molina & Kenneth Salem","edition":"1987","free":true,"url":"https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf","get":"","match":["cs.cornell.edu/andru"]},
    {"id":"dataflow","title":"The Dataflow Model","kind":"paper","by":"Tyler Akidau et al. (Google)","edition":"VLDB 2015","free":true,"url":"https://www.vldb.org/pvldb/vol8/p1792-Akidau.pdf","get":"","match":["vldb.org/pvldb"]},
    {"id":"drepper","title":"What Every Programmer Should Know About Memory","kind":"paper","by":"Ulrich Drepper","edition":"2007","free":true,"url":"https://www.akkadia.org/drepper/cpumemory.pdf","get":"Long (~114 pp) and still the best free substitute for CS:APP Ch 6. Read the parts a day asks for, not the whole thing.","match":["akkadia.org/drepper","lwn.net/Articles/250967"]},
    {"id":"goldberg","title":"What Every Computer Scientist Should Know About Floating-Point Arithmetic","kind":"paper","by":"David Goldberg","edition":"1991","free":true,"url":"https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html","get":"","match":["docs.oracle.com/cd/E19957-01"]},
    {"id":"gpugems","title":"GPU Gems 3, Ch 31: Fast N-Body Simulation with CUDA","kind":"paper","by":"Lars Nyland, Mark Harris & Jan Prins (NVIDIA)","edition":"","free":true,"url":"https://developer.nvidia.com/gpugems/gpugems3/part-v-physics-simulation/chapter-31-fast-n-body-simulation-cuda","get":"","match":["developer.nvidia.com/gpugems"]},
    {"id":"rfc","title":"IETF RFCs","kind":"spec","by":"","edition":"","free":true,"url":"https://www.rfc-editor.org/","get":"Normative and dry. Read the section a day names, not the whole document.","match":["rfc-editor.org","datatracker.ietf.org"]},
    {"id":"eips","title":"Ethereum EIPs / ERCs","kind":"spec","by":"","edition":"","free":true,"url":"https://eips.ethereum.org/","get":"The Specification section is normative; Rationale and Security Considerations are usually the readable part.","match":["eips.ethereum.org"]},
    {"id":"oci-image-spec","title":"OCI Image Format Specification","kind":"spec","by":"Open Container Initiative","edition":"","free":true,"url":"https://github.com/opencontainers/image-spec/blob/main/spec.md","get":"Read it for the shape (manifest + config + layers), not to memorise field names.","match":["opencontainers/image-spec"]},
    {"id":"owasp-top10","title":"OWASP Top 10","kind":"spec","by":"OWASP","edition":"2025","free":true,"url":"https://owasp.org/Top10/2025/","get":"","match":["owasp.org/Top10"]},
    {"id":"owasp-cheatsheets","title":"OWASP Cheat Sheet Series","kind":"docs","by":"OWASP","edition":"","free":true,"url":"https://cheatsheetseries.owasp.org/","get":"The practical counterpart to the Top 10: what to actually do.","match":["cheatsheetseries.owasp.org"]},
    {"id":"kip","title":"Kafka Improvement Proposals (KIPs)","kind":"spec","by":"Apache Kafka","edition":"","free":true,"url":"https://cwiki.apache.org/confluence/display/KAFKA/Kafka+Improvement+Proposals","get":"","match":["cwiki.apache.org/confluence/display/KAFKA"]},
    {"id":"pep","title":"Python Enhancement Proposals","kind":"spec","by":"","edition":"","free":true,"url":"https://peps.python.org/","get":"","match":["peps.python.org"]},
    {"id":"slsa","title":"SLSA — Supply-chain Levels for Software Artifacts","kind":"spec","by":"","edition":"","free":true,"url":"https://slsa.dev/spec/","get":"","match":["slsa.dev"]},
    {"id":"sbom-formats","title":"SBOM formats — CycloneDX & SPDX","kind":"spec","by":"","edition":"","free":true,"url":"https://cyclonedx.org/","get":"","match":["cyclonedx.org","spdx.dev"]},
    {"id":"pg-docs","title":"PostgreSQL documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://www.postgresql.org/docs/current/","get":"Chapter numbers below are for the CURRENT release; they shift between majors.","match":["postgresql.org/docs"]},
    {"id":"k8s-docs","title":"Kubernetes documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://kubernetes.io/docs/concepts/","get":"","match":["kubernetes.io/docs"]},
    {"id":"docker-docs","title":"Docker documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.docker.com/build/","get":"","match":["docs.docker.com"]},
    {"id":"redis-docs","title":"Redis documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://redis.io/docs/latest/","get":"","match":["redis.io/docs"]},
    {"id":"solana-docs","title":"Solana documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://solana.com/docs/core/accounts","get":"","match":["solana.com/docs","solana.com/developers"]},
    {"id":"anza-docs","title":"Anza validator docs (Agave)","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.anza.xyz/","get":"","match":["docs.anza.xyz"]},
    {"id":"go-docs","title":"Go documentation & blog","kind":"docs","by":"","edition":"","free":true,"url":"https://go.dev/doc/","get":"","match":["go.dev/doc","go.dev/blog","go.dev/src"]},
    {"id":"python-docs","title":"Python documentation & devguide","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.python.org/3/","get":"","match":["docs.python.org","devguide.python.org","github.com/python/cpython"]},
    {"id":"rust-docs","title":"The Rust Book & std docs","kind":"docs","by":"","edition":"","free":true,"url":"https://doc.rust-lang.org/book/","get":"Same book the Rust + FastAPI roadmap works through — these are revisits, not first reads.","match":["doc.rust-lang.org"]},
    {"id":"cppreference","title":"cppreference.com","kind":"docs","by":"","edition":"","free":true,"url":"https://en.cppreference.com/","get":"Community-maintained and closer to the standard than any tutorial.","match":["en.cppreference.com"]},
    {"id":"kernel-docs","title":"Linux kernel documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.kernel.org/","get":"man7.org carries the man pages; docs.kernel.org the subsystem docs.","match":["docs.kernel.org","man7.org"]},
    {"id":"ebpf-docs","title":"eBPF & Cilium documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://ebpf.io/what-is-ebpf/","get":"","match":["docs.ebpf.io","ebpf.io","docs.cilium.io"]},
    {"id":"llvm-docs","title":"LLVM documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://llvm.org/docs/","get":"","match":["llvm.org/docs"]},
    {"id":"v8-blog","title":"V8 developer blog & docs","kind":"docs","by":"the V8 team","edition":"","free":true,"url":"https://v8.dev/blog","get":"","match":["v8.dev"]},
    {"id":"jvm-docs","title":"Java / HotSpot documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.oracle.com/en/java/javase/21/vm/","get":"","match":["docs.oracle.com/en/java","wiki.openjdk.org","oracle.com/technical-resources"]},
    {"id":"prometheus-docs","title":"Prometheus documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://prometheus.io/docs/practices/histograms/","get":"","match":["prometheus.io/docs"]},
    {"id":"otel-docs","title":"OpenTelemetry documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://opentelemetry.io/docs/concepts/signals/traces/","get":"","match":["opentelemetry.io/docs"]},
    {"id":"spiffe-docs","title":"SPIFFE documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://spiffe.io/docs/latest/spiffe-about/overview/","get":"","match":["spiffe.io"]},
    {"id":"sigstore-docs","title":"Sigstore documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.sigstore.dev/about/overview/","get":"","match":["docs.sigstore.dev"]},
    {"id":"oz-docs","title":"OpenZeppelin documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.openzeppelin.com/contracts/","get":"","match":["docs.openzeppelin.com"]},
    {"id":"solidity-docs","title":"Solidity documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.soliditylang.org/","get":"","match":["docs.soliditylang.org"]},
    {"id":"flink-docs","title":"Apache Flink documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://nightlies.apache.org/flink/flink-docs-stable/","get":"","match":["nightlies.apache.org/flink","kafka.apache.org"]},
    {"id":"aws-whitepapers","title":"AWS whitepapers","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/welcome.html","get":"","match":["docs.aws.amazon.com/whitepapers"]},
    {"id":"confluent-blog","title":"Confluent blog","kind":"article","by":"","edition":"","free":true,"url":"https://www.confluent.io/blog/","get":"","match":["confluent.io/blog"]},
    {"id":"debezium","title":"Debezium blog & docs","kind":"docs","by":"","edition":"","free":true,"url":"https://debezium.io/","get":"","match":["debezium.io"]},
    {"id":"flashbots-docs","title":"Flashbots documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.flashbots.net/","get":"","match":["docs.flashbots.net"]},
    {"id":"erc4337-docs","title":"ERC-4337 documentation","kind":"docs","by":"","edition":"","free":true,"url":"https://docs.erc4337.io/","get":"","match":["docs.erc4337.io","eip4844.com"]},
    {"id":"ethereum-org","title":"ethereum.org developer docs","kind":"docs","by":"","edition":"","free":true,"url":"https://ethereum.org/en/developers/docs/","get":"","match":["ethereum.org/en/developers","blog.ethereum.org"]},
    {"id":"abseil","title":"Abseil & tcmalloc design docs","kind":"docs","by":"Google","edition":"","free":true,"url":"https://abseil.io/about/design/swisstables","get":"","match":["abseil.io","google.github.io/tcmalloc"]},
    {"id":"meta-oss","title":"RocksDB & folly docs","kind":"docs","by":"Meta","edition":"","free":true,"url":"https://github.com/facebook/rocksdb/wiki","get":"","match":["github.com/facebook/rocksdb","github.com/facebook/folly"]},
    {"id":"conference-talks","title":"Conference talks","kind":"video","by":"","edition":"","free":true,"url":"https://www.youtube.com/","get":"Free on YouTube. Each day names the talk, the speaker and its runtime — the estimate assumes you pause and try things, so it is longer than the runtime.","match":["youtube.com/watch"]},
    {"id":"cloudflare-learning","title":"Cloudflare Learning Center","kind":"article","by":"","edition":"","free":true,"url":"https://www.cloudflare.com/learning/","get":"Short, accurate explainers. Used here as the on-ramp; the RFC is the authority.","match":["cloudflare.com/learning"]},
    {"id":"lwn","title":"LWN.net","kind":"article","by":"","edition":"","free":true,"url":"https://lwn.net/","get":"Kernel journalism. Older articles are free; recent ones may be subscriber-only for a week.","match":["lwn.net"]},
    {"id":"brendangregg","title":"Brendan Gregg's site","kind":"article","by":"Brendan Gregg","edition":"","free":true,"url":"https://www.brendangregg.com/","get":"Flame graphs, the USE method and the perf/eBPF tooling, from the person who built much of it.","match":["brendangregg.com"]},
    {"id":"martinfowler","title":"martinfowler.com","kind":"article","by":"Martin Fowler","edition":"","free":true,"url":"https://martinfowler.com/","get":"","match":["martinfowler.com"]},
    {"id":"kleppmann-blog","title":"Martin Kleppmann's blog","kind":"article","by":"Martin Kleppmann","edition":"","free":true,"url":"https://martin.kleppmann.com/","get":"","match":["martin.kleppmann.com"]},
    {"id":"antirez","title":"antirez / Redis patterns","kind":"article","by":"Salvatore Sanfilippo","edition":"","free":true,"url":"https://antirez.com/","get":"","match":["antirez.com","redis.io/docs/latest/develop/clients/patterns"]},
    {"id":"preshing","title":"Preshing on Programming","kind":"article","by":"Jeff Preshing","edition":"","free":true,"url":"https://preshing.com/","get":"","match":["preshing.com"]},
    {"id":"danluu","title":"danluu.com","kind":"article","by":"Dan Luu","edition":"","free":true,"url":"https://danluu.com/","get":"","match":["danluu.com"]},
    {"id":"samczsun","title":"samczsun.com","kind":"article","by":"samczsun","edition":"","free":true,"url":"https://samczsun.com/","get":"","match":["samczsun.com"]},
    {"id":"vitalik","title":"Vitalik Buterin's writing","kind":"article","by":"Vitalik Buterin","edition":"","free":true,"url":"https://vitalik.eth.limo/","get":"","match":["vitalik.eth.limo"]},
    {"id":"rogov-mvcc","title":"MVCC in PostgreSQL (series)","kind":"article","by":"Egor Rogov","edition":"","free":true,"url":"https://postgrespro.com/blog/pgsql/5967856","get":"The best free walk through Postgres tuple internals; pairs with the official docs.","match":["postgrespro.com/blog"]},
    {"id":"portswigger","title":"PortSwigger Web Security Academy","kind":"course","by":"","edition":"","free":true,"url":"https://portswigger.net/web-security","get":"Free labs. The JWT and access-control sections are the ones this roadmap uses.","match":["portswigger.net"]},
    {"id":"evm-codes","title":"evm.codes","kind":"site","by":"","edition":"","free":true,"url":"https://www.evm.codes/","get":"Per-opcode gas costs plus a live playground — keep it open while reading the EVM chapter.","match":["evm.codes"]},
    {"id":"l2beat","title":"L2BEAT","kind":"site","by":"","edition":"","free":true,"url":"https://l2beat.com/scaling/summary","get":"Independent risk/maturity data on rollups — the reality check on marketing claims.","match":["l2beat.com"]},
    {"id":"wikipedia","title":"Wikipedia","kind":"site","by":"","edition":"","free":true,"url":"https://en.wikipedia.org/","get":"Used here for settled CS definitions (SSA, register allocation, Bloom filters), not for anything contested.","match":["en.wikipedia.org"]},
    {"id":"12factor","title":"The Twelve-Factor App & OpenGitOps","kind":"site","by":"","edition":"","free":true,"url":"https://12factor.net/","get":"","match":["12factor.net","opengitops.dev"]},
    {"id":"misc-classics","title":"Classic one-off essays","kind":"article","by":"","edition":"","free":true,"url":null,"get":"Single-page references that don't belong to a bigger work — each day links the exact one it wants.","match":["kegel.com/c10k","joelonsoftware.com","utf8everywhere.org","floating-point-gui.de","gee.cs.oswego.edu","mechanical-sympathy.blogspot.com","tls13.xargs.org","llimllib.github.io","0.30000000000000004.com","crdt.tech","shipilev.net","mathiasbynens.be","timilearning.com","microservices.io","stackoverflow.com","spectreattack.com","meltdownattack.com","cyfrin.io","redhat.com/en/topics","barneshutalgorithm.com","github.com/firedancer-io","github.com/golang/proposal"]},
  ],

  weeks: [
    { id: "w1", title: "Week 1 — The wire, the container, the process", start: "2026-09-23" },
    { id: "w2", title: "Week 2 — IP addressing, subnets & CIDR; Images, layers & the Dockerfile that actually caches", start: "2026-09-30" },
    { id: "w3", title: "Week 3 — The B-tree index; TCP vs UDP — handshake, flow, congestion, HOL", start: "2026-10-07" },
    { id: "w4", title: "Week 4 — Kubernetes: the reconciliation loop + core objects; Memory hierarchy", start: "2026-10-14" },
    { id: "w5", title: "Week 5 — EXPLAIN: reading the query planner's mind", start: "2026-10-21" },
    { id: "w6", title: "Week 6 — DNS resolution, end to end; k8s scheduling, probes, requests/limits & HPA", start: "2026-10-28" },
    { id: "w7", title: "Week 7 — Security foundations: OWASP 2025 + authn vs authz; The TLS 1.3 handshake & PKI", start: "2026-11-04" },
    { id: "w8", title: "Week 8 — MVCC: how Postgres lets readers not block writers; Getting it out the door", start: "2026-11-11" },
    { id: "w9", title: "Week 9 — Crypto primitives; HTTP/1.1 → HTTP/2 → HTTP/3 & QUIC", start: "2026-11-18" },
    { id: "w10", title: "Week 10 — Redis internals; Isolation levels & the anomalies they prevent", start: "2026-11-25" },
    { id: "w11", title: "Week 11 — Observability: golden signals, histograms & why p99; Inside the EVM", start: "2026-12-02" },
    { id: "w12", title: "Week 12 — Message queues vs logs — the core distinction", start: "2026-12-09" },
    { id: "w13", title: "Week 13 — Load balancers (L4 vs L7), reverse proxies & CDNs; …", start: "2026-12-16" },
    { id: "w14", title: "Week 14 — Locking, deadlocks & the write-ahead log; …", start: "2026-12-23" },
    { id: "w15", title: "Week 15 — SLIs, SLOs, error budgets & tracing; How a server accepts 10k connections; …", start: "2026-12-30" },
    { id: "w16", title: "Week 16 — Kafka's model: partitions, offsets, consumer groups, ISR", start: "2027-01-06" },
    { id: "w17", title: "Week 17 — Review: Rust ownership & the borrow checker; …", start: "2027-01-13" },
    { id: "w18", title: "Week 18 — Sealevel, PDAs & CPIs — Solana's parallel runtime; …", start: "2027-01-20" },
    { id: "w19", title: "Week 19 — Consensus: PoW, longest chain & what 'finality' means; …", start: "2027-01-27" },
    { id: "w20", title: "Week 20 — 🎓 Capstone: smart-contract security — reentrancy & oracle manipulation; …", start: "2027-02-03" },
    { id: "w21", title: "Week 21 — VACUUM, autovacuum & the xmin horizon; Virtual memory: page tables & the TLB", start: "2027-02-10" },
    { id: "w22", title: "Week 22 — Rollups: optimistic vs ZK — when do you pay for trust?", start: "2027-02-17" },
    { id: "w23", title: "Week 23 — BGP & Anycast: how the internet actually routes; Kafka exactly-once", start: "2027-02-24" },
    { id: "w24", title: "Week 24 — Consensus II: Paxos vs Raft, and Byzantine faults (PBFT); TOAST & HOT updates", start: "2027-03-03" },
    { id: "w25", title: "Week 25 — Service mesh, mTLS & workload identity (SPIFFE); Data availability & EIP-4844 blobs", start: "2027-03-10" },
    { id: "w26", title: "Week 26 — Review: Go's scheduler (G-M-P) & async preemption; …", start: "2027-03-17" },
    { id: "w27", title: "Week 27 — CAP done right — and PACELC; Join algorithms & how the planner picks; …", start: "2027-03-24" },
    { id: "w28", title: "Week 28 — MEV & Proposer-Builder Separation", start: "2027-03-31" },
    { id: "w29", title: "Week 29 — Kafka consumer rebalances & log compaction; Upgradeable contracts", start: "2027-04-07" },
    { id: "w30", title: "Week 30 — Logical clocks; Partitioning & sharding; QUIC internals beyond HTTP/3", start: "2027-04-14" },
    { id: "w31", title: "Week 31 — Account abstraction; Review: the Python GIL & free-threading (3.14)", start: "2027-04-21" },
    { id: "w32", title: "Week 32 — Supply-chain security; Distributed transactions; …", start: "2027-04-28" },
    { id: "w33", title: "Week 33 — CDC & the transactional outbox", start: "2027-05-05" },
    { id: "w34", title: "Week 34 — ZK proofs: SNARKs vs STARKs (intuition); Distributed locks & the Redlock debate", start: "2027-05-12" },
    { id: "w35", title: "Week 35 — io_uring vs epoll; Quorums (R + W > N) & tunable consistency; …", start: "2027-05-19" },
    { id: "w36", title: "Week 36 — eBPF & XDP: programmable packets in the kernel", start: "2027-05-26" },
    { id: "w37", title: "Week 37 — Solana under the hood; Review: C++ memory model & std::atomic ordering", start: "2027-06-02" },
    { id: "w38", title: "Week 38 — Stream processing; Performance analysis; Signature replay & EIP-712 typed signing", start: "2027-06-09" },
    { id: "w39", title: "Week 39 — 🎓 Review: Rust async — Future, Pin & the state machine", start: "2027-06-16" },
    { id: "w40", title: "Week 40 — Amortized O(1); NUMA, cache coherence (MESI) & false sharing", start: "2027-06-23" },
    { id: "w41", title: "Week 41 — Hash maps: why O(1), collisions & Swiss tables; …", start: "2027-06-30" },
    { id: "w42", title: "Week 42 — Garbage collection; The heap allocator", start: "2027-07-07" },
    { id: "w43", title: "Week 43 — IEEE 754: why 0.1 + 0.2 ≠ 0.3; …", start: "2027-07-14" },
    { id: "w44", title: "Week 44 — Branch prediction & speculative execution (Spectre); …", start: "2027-07-21" },
    { id: "w45", title: "Week 45 — A map of the territory; …", start: "2027-07-28" },
    { id: "w46", title: "Week 46 — Lexing & parsing; …", start: "2027-08-04" },
    { id: "w47", title: "Week 47 — Review: the JVM — javac, tiered JIT (C1/C2), warmup & deopt; …", start: "2027-08-11" },
    { id: "w48", title: "Week 48 — Review: LLVM — IR, SSA & the shared backend behind Clang & rustc; …", start: "2027-08-18" },
  ],

  days: [
    /* ---------------- Week 1 ---------------- */
    {
      id: "d01", date: "2026-09-24", week: "w1", title: "The OSI myth vs how the internet really layers",
      theme: "Networking · thread part 1 — encapsulation is the load-bearing idea, not the number 7.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 70,
          lead: `<b>Networking ①</b> — learn the layering model <i>honestly</i>.`,
          sub: [
            { id: "s1", est: 35, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/" target="_blank" rel="noopener">"What is the OSI Model?"</a> for the diagram — then apply the corrections below.` },
            { id: "s2", est: 20, label: `The internet runs the <b>TCP/IP</b> model (Link → Internet → Transport → Application); OSI layers 5–6 (session/presentation) have <i>no</i> real counterpart.`, info: `<p><b>Why keep two models?</b> OSI is the 7-layer <i>teaching</i> map; the wire actually runs the 4-layer <b>TCP/IP</b> stack.</p>
<p>Rough mapping: <b>Link</b> ≈ OSI 1–2 (Ethernet/Wi-Fi) · <b>Internet</b> ≈ OSI 3 (IP) · <b>Transport</b> ≈ OSI 4 (TCP/UDP) · <b>Application</b> ≈ OSI 5–7 fused (HTTP, TLS, gzip are all just "things the app does").</p>
<p>So when someone says "layer 5/6", there's no real box for it on the wire — don't hunt for one.</p>` },
            { id: "s3", est: 15, label: `"L7 load balancer / L4 firewall / L3 switch" is just shorthand for <b>which header a device inspects</b> (L3=IP, L4=port, L7=HTTP).`, info: `<p>Each label names <b>the deepest header a device is allowed to read</b> to make its decision:</p>
<ul>
<li><b>L3 (IP)</b> — a router/switch forwards by IP address; it can't see ports or URLs.</li>
<li><b>L4 (TCP/UDP)</b> — a firewall or network load-balancer decides by IP<b>+port</b> (e.g. "allow 443"), still blind to the URL path.</li>
<li><b>L7 (HTTP)</b> — a reverse proxy / application LB reads the <code>Host</code> and path, so it can route <code>/api</code> vs <code>/img</code>, add headers, or terminate TLS.</li>
</ul>
<p>Higher layer = more context to act on, but more work per packet.</p>` },
          ],
          model: `The load-bearing idea is <b>encapsulation</b>: a packet is <code>[Ethernet [IP [TCP [HTTP]]]]</code> — going down the stack adds headers, up strips them. Not "recite 7 layers".`,
          cards: [
            { q: `The load-bearing idea behind network layering?`, a: `<b>Encapsulation</b> — a packet is <code>[Ethernet [IP [TCP [HTTP]]]]</code>; down the stack adds headers, up strips them. Not "recite 7 layers".` },
            { q: `What do "L7 / L4 / L3" actually refer to?`, a: `Which header a device inspects: <b>L3</b> = IP, <b>L4</b> = port, <b>L7</b> = HTTP.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The cargo-cult mistake is reciting all 7 OSI layers as if each is real and present in every packet. Interview answer: encapsulation + which header a device reads.` },
        { id: "s2", type: "callout", label: `🧭 This is thread <b>Networking</b>, part 1 of 7 in the core. Each time it reappears it continues in order (subnets → TCP → DNS → TLS → HTTP → load balancers).` },
      ],
      note: "Bedrock begins. 2–3 short days a week, one topic each — separate from your main roadmaps.",
    },
    {
      id: "d02", date: "2026-09-25", week: "w1", title: "What a container actually is",
      theme: "DevOps · thread part 1 — a container is a Linux process with a restricted view, not a VM.",
      tasks: [
        { id: "t1", obj: OPS, cat: "watch", est: 75, lead: `<b>DevOps ①</b> — see a container built from raw kernel primitives.`, model: `There is <b>no "container" object in the kernel</b>. <b>Namespaces</b> limit what a process can <i>see</i> (PID, mount, net, UTS, IPC, user); <b>cgroups</b> limit what it can <i>use</i> (CPU, memory, IO). That's the whole trick.`, cards: [
              { q: `Is there a "container" object in the Linux kernel?`, a: `No. A container is a process with <b>namespaces</b> (what it can <i>see</i>) + <b>cgroups</b> (what it can <i>use</i>).` },
              { q: `Container vs VM isolation?`, a: `A VM runs its own kernel (hardware virtualized); a container shares the host kernel — lighter, but a weaker boundary (hence "container escape").` },
            ],
          sub: [
            { id: "s1", cat: "watch", est: 40, label: `Watch Liz Rice, <a href="https://www.youtube.com/watch?v=8fi7uSYlOdc" target="_blank" rel="noopener">"Containers From Scratch" (GOTO 2018, ~43 min)</a> up to the <code>chroot</code> step — <code>clone()</code> and the namespace flags, live-coded in Go.`, lead: `<b>DevOps ①</b> — see a container built from raw kernel primitives.` },
            { id: "s2", cat: "watch", est: 35, label: "Finish the talk — <code>chroot</code>/pivot_root and cgroups — then re-run her commands yourself in a scratch VM or container.", lead: `<b>DevOps ①</b> — see a container built from raw kernel primitives.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A VM virtualizes hardware and runs its own kernel; a container shares the host kernel — lighter, but a weaker isolation boundary (why "container escape" is a real threat).` },
        { id: "s2", type: "callout", label: `🔧 DevOps is a first-class, first-month thread here (Docker → Kubernetes → CI/CD → observability → load testing). "Containers" means the whole real stack, not just <code>docker run</code>.` },
      ],
    },
    {
      id: "d03", date: "2026-09-27", week: "w1", title: "Processes vs threads vs coroutines",
      theme: "Systems · thread part 1 — who schedules it, and what's shared.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 40,
          lead: `<b>Systems ①</b> — the three units of execution, and the one distinction that matters. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">OSTEP</a> (free) <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf" target="_blank" rel="noopener">Ch 4 "The Abstraction: The Process"</a> (~15 pp): the process API, the state machine, and the list of what a process actually <i>is</i>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 That one sentence — who schedules it (kernel vs runtime) and what's shared (address space) — answers most "goroutine vs thread" interview questions.` },
        { id: "s2", type: "suggestion", label: `Tie-in: coroutines are cheap precisely because they skip the kernel context switch (and often the TLB flush) — we'll quantify that when Systems reaches CPU caches.` },
      ],
    },

    /* ---------------- Week 2 ---------------- */
    {
      id: "d04", date: "2026-09-30", week: "w2", title: "Processes vs threads vs coroutines (cont.)",
      theme: "Finish “Processes vs threads vs coroutines” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d03", obj: SYS, cat: "read", est: 75,
          lead: `<b>Systems ①</b> — the three units of execution, and the one distinction that matters. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Read OSTEP <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf" target="_blank" rel="noopener">Ch 26 "Concurrency: An Introduction"</a> (~18 pp): threads share the address space, but each gets its own stack.` },
            { id: "s2", est: 30, label: `Map it to your stack: Go goroutines (M:N green threads), Rust <code>async</code>/tokio & Python <code>asyncio</code> (stackless coroutines on an event loop), Node (single loop + libuv pool).`, note: `Locate each on the one axis: who schedules it (kernel vs runtime) and what's shared (address space).` },
          ],
          model: `<b>Process</b> = own address space + fds (expensive switch). <b>OS thread</b> = shares the address space, kernel-scheduled preemptively. <b>Coroutine</b> = user-space scheduled, no syscall to switch → millions of them, cooperative. The distinction is <i>who schedules it</i> and <i>what's shared</i>.`,
          cards: [
            { q: `The one distinction between process, thread, and coroutine?`, a: `<b>Who schedules it</b> (kernel vs runtime) and <b>what's shared</b> (address space). Coroutines are user-scheduled and cooperative.` },
            { q: `Why are coroutines so cheap?`, a: `They switch in user space — no syscall, often no TLB flush — so you can run millions of them.` },
          ] },
      ],
    },
    {
      id: "d05", date: "2026-10-03", week: "w2", title: "IP addressing, subnets & CIDR",
      theme: "Networking · part 2 — stop CIDR from being magic.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 65,
          lead: `<b>Networking ②</b> — subnet math you can do in your head.`,
          sub: [
            { id: "s1", est: 30, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/" target="_blank" rel="noopener">"What is a subnet?"</a>, then do the binary yourself.` },
            { id: "s2", est: 20, label: `<code>/n</code> = first <i>n</i> bits are the network prefix. <code>/24</code>=256 addrs (254 usable), <code>/16</code>=65,536; each extra bit halves the block. Mask <code>/24</code>=<code>255.255.255.0</code>.`,
              info: `<p>CIDR <code>a.b.c.d/n</code> just says "the first <i>n</i> bits are the fixed network; the rest address hosts."</p>
<ul>
<li>Hosts in a block = 2^(32−n) − 2 (network + broadcast). <code>/24</code> → 2^8 = 256 → 254 usable.</li>
<li>Each bit added to the prefix <b>halves</b> the block, each bit removed doubles it: <code>/25</code> = 128, <code>/23</code> = 512.</li>
<li>The mask is those n bits set: <code>/20</code> = <code>255.255.240.0</code>.</li>
</ul>
<p><b>Subnetting</b> = borrowing host bits to split one block into smaller ones (a <code>/24</code> into four <code>/26</code>s). This is the math behind every VPC subnet, k8s pod CIDR, and firewall rule.</p>` },
            { id: "s3", est: 15, label: `Memorize the RFC 1918 private ranges: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code> — they're in every VPC/Docker/k8s.` },
          ],
          model: `"Same subnet?" → AND both IPs with the mask; equal ⇒ they talk directly at L2, else traffic goes to the <b>default gateway</b>. That's how your machine decides gateway-vs-direct for every packet.`,
          cards: [
            { q: `What does <code>/24</code> mean, and how many addresses?`, a: `First 24 bits are the network prefix; 256 addresses (254 usable). Each extra prefix bit halves the block.` },
            { q: `How does a host decide gateway-vs-direct for a packet?`, a: `AND both IPs with the mask; equal ⇒ same subnet (talk directly at L2), else send to the <b>default gateway</b>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: run <code>ipcalc 10.20.30.40/22</code> and predict network/broadcast/host-count before it prints them.` },
        { id: "s2", type: "hint", label: `💡 A <code>/32</code> is a single host; a <code>/0</code> is "everything" (the default route). Cloud security groups and route tables are all just CIDR matching.` },
      ],
    },
    {
      id: "d06", date: "2026-10-06", week: "w2", title: "Images, layers & the Dockerfile that actually caches",
      theme: "DevOps · part 2 — an image is a manifest + content-addressed layers.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 45,
          lead: `<b>DevOps ②</b> — what a container image really is, and how to build a tiny one. (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `Read the <a href="https://github.com/opencontainers/image-spec/blob/main/spec.md" target="_blank" rel="noopener">OCI Image Spec</a> conceptually: an image = a JSON <b>manifest</b> + <b>config</b> + ordered <b>layer</b> blobs, all <b>content-addressed by SHA-256</b> (identical layers stored/pulled once).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 That copy-up mechanic is why containers start instantly and why the writable layer is ephemeral — anything you need to keep goes in a volume, not the container fs.` },
        { id: "s2", type: "callout", label: `🔬 An image <i>index</i> (manifest list) maps platforms (amd64/arm64) to manifests — that's multi-arch. Content-addressing is what makes layer caching and dedup work.` },
      ],
    },

    /* ---------------- Week 3 ---------------- */
    {
      id: "d07", date: "2026-10-08", week: "w3", title: "Images, layers & the Dockerfile that actually caches (cont.)",
      theme: "Finish “Images, layers & the Dockerfile that actually caches” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d06", obj: OPS, cat: "read", est: 55,
          lead: `<b>DevOps ②</b> — what a container image really is, and how to build a tiny one. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read Docker <a href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">Multi-stage builds</a>: <code>COPY --from</code> to ship only the built binary, leaving the toolchain behind.` },
            { id: "s2", est: 30, label: `Read Docker <a href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">build best practices</a>: order steps by change-frequency (deps before source) so the layer cache actually hits.` },
          ],
          model: `Layers stack via <b>OverlayFS</b> (read-only image lowerdir + writable upperdir; a write triggers <b>copy-up</b>). For your Go/Rust binaries, a multi-stage build into <a href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">distroless</a>/<code>scratch</code> = a few-MB image with almost no attack surface.`,
          cards: [
            { q: `What is a container image, concretely?`, a: `A JSON <b>manifest</b> + config + ordered <b>layer</b> blobs, all content-addressed by SHA-256 (identical layers stored/pulled once).` },
            { q: `Why order Dockerfile steps by change-frequency?`, a: `Layers cache by content — put rarely-changing deps before source, so a code edit doesn't bust the dependency layers.` },
          ] },
      ],
    },
    {
      id: "d08", date: "2026-10-09", week: "w3", title: "The B-tree index: how it works, when it hurts",
      theme: "Databases · part 1 — an index is a second, sorted copy kept balanced.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 80,
          lead: `<b>Databases ①</b> — the mental model of a B-tree index.`,
          sub: [
            { id: "s1", est: 40, label: `Read <i>Use The Index, Luke!</i> (free): <a href="https://use-the-index-luke.com/sql/anatomy" target="_blank" rel="noopener">Anatomy of an SQL Index</a> → <a href="https://use-the-index-luke.com/sql/anatomy/the-tree" target="_blank" rel="noopener">The B-Tree</a> → <a href="https://use-the-index-luke.com/sql/anatomy/slow-indexes" target="_blank" rel="noopener">Slow Indexes</a>.` },
            { id: "s2", est: 20, label: `Leaf nodes are a doubly-linked list (range scans walk sideways); height ~log(N), so billions of rows are 3–5 levels deep.`, info: `<p>A B-tree keeps data <b>sorted</b> and <b>shallow</b>. Internal nodes hold only separator keys + child pointers; the actual rows (or pointers to them) live in the <b>leaves</b>.</p>
<ul>
<li>Each node fills a disk page (hundreds of keys), so the tree stays <b>3–5 levels</b> deep even for billions of rows — a lookup is a handful of page reads, i.e. <code>O(log N)</code> with a huge base.</li>
<li>Leaves are chained in a <b>doubly-linked list</b>, so a range scan (<code>BETWEEN</code>, <code>ORDER BY</code>) finds the start then walks sideways — no re-descending the tree.</li>
</ul>
<p>That's why an index accelerates <code>=</code>, range, prefix and sort queries but can't help an unanchored <code>LIKE '%foo'</code> or a function-wrapped column.</p>` },
            { id: "s3", est: 20, label: `Hurts on low-cardinality columns, when a function wraps the column (<code>WHERE lower(email)=…</code> needs an expression index), and every index is <b>write amplification</b>.` },
          ],
          model: `<b>Leftmost-prefix rule:</b> <code>INDEX(a,b,c)</code> serves <code>a</code>, <code>a,b</code>, <code>a,b,c</code> — but NOT <code>b</code> alone. Put equality columns first, then the range/sort column. The #1 composite-index mistake.`,
          cards: [
            { q: `The leftmost-prefix rule for <code>INDEX(a,b,c)</code>?`, a: `Serves <code>a</code> / <code>a,b</code> / <code>a,b,c</code> — but NOT <code>b</code> alone. Put equality columns first, then the range/sort column.` },
            { q: `What is a B-tree index, in one line?`, a: `A second, <i>sorted</i> copy of some columns kept balanced; height ~log(N), so billions of rows are 3–5 levels deep.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 An index is just a second, <i>sorted</i> copy of some columns — great for high-selectivity lookups and <code>ORDER BY</code> (walk leaves, no sort), useless when a predicate matches most rows.` },
        { id: "s2", type: "suggestion", label: `Next Databases day: the query planner (EXPLAIN) — the tool that tells you whether the planner actually chose your index.` },
      ],
    },
    {
      id: "d09", date: "2026-10-12", week: "w3", title: "TCP vs UDP — handshake, flow, congestion, HOL",
      theme: "Networking · part 3 — reliability is a feature you pay for.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 55,
          lead: `<b>Networking ③</b> — what TCP does for you, and what UDP leaves to you. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read HPBN (free) <a href="https://hpbn.co/building-blocks-of-tcp/" target="_blank" rel="noopener">"Building Blocks of TCP"</a> — the whole chapter.` },
            { id: "s2", est: 20, label: `Then the short <a href="https://hpbn.co/building-blocks-of-udp/" target="_blank" rel="noopener">"Building Blocks of UDP"</a> chapter — what TCP gives you that UDP doesn’t.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: <code>sudo tcpdump -n -i any port 443</code> while you <code>curl https://example.com</code> — watch the real SYN → SYN-ACK → ACK, then the TLS records.` },
        { id: "s2", type: "hint", label: `💡 "Why is a new connection slow?" → handshake RTT + TLS RTT + TCP slow-start ramping the window. Keep-alive and HTTP/2 exist largely to avoid paying that repeatedly.` },
      ],
    },

    /* ---------------- Week 4 ---------------- */
    {
      id: "d10", date: "2026-10-14", week: "w4", title: "Kubernetes: the reconciliation loop + core objects",
      theme: "DevOps · part 3 — everything in k8s is a controller driving current → desired.",
      tasks: [
        { id: "t1", carried: "d09", obj: NET, cat: "read", est: 40,
          lead: `<b>Networking ③</b> — what TCP does for you, and what UDP leaves to you. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Own the <b>3-way handshake</b> (SYN/SYN-ACK/ACK), <b>slow-start</b> & congestion avoidance (AIMD), the receive window (flow control), and <b>head-of-line blocking</b>.`, info: `<p>The four things that make TCP reliable, ordered and congestion-aware:</p>
<ul>
<li><b>3-way handshake</b> (SYN → SYN-ACK → ACK) agrees on starting sequence numbers before any data — one round-trip of latency before byte one.</li>
<li><b>Slow-start + AIMD</b>: the sender ramps its congestion window up exponentially, then on loss backs off (additive-increase / multiplicative-decrease) — TCP <i>discovers</i> the path's capacity rather than being told it.</li>
<li><b>Receive window</b> = flow control: the receiver advertises free buffer so a fast sender can't overrun a slow reader (distinct from congestion control, which protects the <i>network</i>).</li>
<li><b>Head-of-line blocking</b>: one lost segment stalls everything behind it because bytes must arrive in order — the exact problem HTTP/3-over-QUIC was built to escape.</li>
</ul>` },
            { id: "s2", est: 15, label: `UDP = no handshake/ordering/congestion control — you build reliability yourself (or use QUIC).` },
          ],
          model: `Two different HOL blockings: TCP's byte-stream ordering, and the famous <b>HTTP/2-over-TCP</b> one (a single lost packet stalls all multiplexed streams). The latter is what QUIC/HTTP-3 fixes — and what interviewers usually mean.`,
          cards: [
            { q: `TCP's 3-way handshake?`, a: `SYN → SYN-ACK → ACK.` },
            { q: `The two different "head-of-line blocking"?`, a: `TCP's byte-stream ordering; and HTTP/2-over-TCP (one lost packet stalls <i>all</i> multiplexed streams) — the latter is what QUIC/H3 fixes.` },
          ] },
        { id: "t2", obj: OPS, cat: "read", est: 45,
          lead: `<b>DevOps ③</b> — the one mental model that makes all of Kubernetes click. (1/3)`,
          sub: [
            { id: "s1", est: 45, label: `Read k8s <a href="https://kubernetes.io/docs/concepts/architecture/controller/" target="_blank" rel="noopener">"Controllers"</a>: a thermostat loop — observe current → compare to <code>.spec</code> → act → repeat, forever (<b>level-triggered</b>, not edge-triggered).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Interview gotcha: a k8s <b>Secret is only base64-encoded, not encrypted</b> at rest by default — you must enable encryption-at-rest / a KMS. Almost everyone gets this wrong.` },
        { id: "s2", type: "hint", label: `💡 Deployment→ReplicaSet→Pod is an ownership chain: you edit the Deployment, it creates a new ReplicaSet and scales the old one down (that's a rolling update / rollback).` },
      ],
    },
    {
      id: "d11", date: "2026-10-18", week: "w4", title: "Kubernetes: the reconciliation loop + core objects (cont.)",
      theme: "Finish “Kubernetes: the reconciliation loop + core objects” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d10", obj: OPS, cat: "read", est: 30,
          lead: `<b>DevOps ③</b> — the one mental model that makes all of Kubernetes click. (2/3)`,
          sub: [
            { id: "s1", est: 30, label: `Skim the workload objects: <a href="https://kubernetes.io/docs/concepts/workloads/pods/" target="_blank" rel="noopener">Pod</a> and <a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noopener">Deployment</a>→ReplicaSet→Pod.` },
          ] },
      ],
    },
    {
      id: "d12", date: "2026-10-20", week: "w4", title: "Memory hierarchy: CPU cache, virtual memory & the page cache",
      theme: "Systems · part 2 — cache lines, page tables, and why a warm read never hits disk.",
      tasks: [
        { id: "t1", carried: "d10", obj: OPS, cat: "read", est: 30,
          lead: `<b>DevOps ③</b> — the one mental model that makes all of Kubernetes click. (3/3)`,
          sub: [
            { id: "s1", est: 30, label: `Then the networking & config objects: <a href="https://kubernetes.io/docs/concepts/services-networking/service/" target="_blank" rel="noopener">Service</a> (stable VIP + label selector), <a href="https://kubernetes.io/docs/concepts/services-networking/ingress/" target="_blank" rel="noopener">Ingress</a>, ConfigMap/Secret.` },
          ],
          model: `Controllers act only through the <b>API server</b> (+ etcd = single source of truth), never nodes directly. Desired state is never "done" — a node dies, Pods get rescheduled. Reconciliation is the through-line for GitOps and Terraform too.`,
          cards: [
            { q: `The one mental model for all of Kubernetes?`, a: `A reconciliation loop: observe current → compare to <code>.spec</code> → act → repeat forever (<b>level-triggered</b>, via the API server + etcd).` },
            { q: `Is a k8s Secret encrypted at rest by default?`, a: `No — only base64-encoded. You must enable encryption-at-rest / a KMS.` },
          ] },
        { id: "t2", obj: SYS, cat: "read", est: 45,
          lead: `<b>Systems ②</b> — locality and cache lines, then the two OS memory tricks every DB relies on. (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `Read CS:APP <b>Ch 6 "The Memory Hierarchy"</b> (registers → L1/L2/L3 → DRAM → disk; locality, cache lines, hit/miss).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback from d03: a context switch's <i>direct</i> cost (~1–few µs) is often dwarfed by the <i>indirect</i> cost — cold caches + a TLB flush. That's the real reason user-space coroutines are cheap.` },
        { id: "s2", type: "callout", label: `🔬 This is why "data-oriented design" and columnar storage win: pack the bytes you touch together so each cache-line fetch does useful work. The <b>page cache</b> is also why your DB's second read of a row is fast — and why <code>fsync</code> vs. "write returned" is the durability line you'll meet again at the WAL (d40).` },
      ],
    },

    /* ---------------- Week 5 ---------------- */
    {
      id: "d13", date: "2026-10-23", week: "w5", title: "Memory hierarchy: CPU cache, virtual memory & the page cache (cont.)",
      theme: "Finish “Memory hierarchy: CPU cache, virtual memory & the page cache” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d12", obj: SYS, cat: "read", est: 70,
          lead: `<b>Systems ②</b> — locality and cache lines, then the two OS memory tricks every DB relies on. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Free alternative: Ulrich Drepper, <a href="https://lwn.net/Articles/250967/" target="_blank" rel="noopener">"What Every Programmer Should Know About Memory"</a> — the CPU-cache parts (≈ Parts 2–3).` },
            { id: "s2", est: 25, label: `<b>Virtual memory</b> (skim): OSTEP (free) <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf" target="_blank" rel="noopener">Ch 19 "Paging: Faster Translations (TLBs)"</a> — each process gets its own address space via page tables; the <b>TLB</b> caches translations so a hit makes it nearly free.` },
            { id: "s3", est: 20, label: `<b>The page cache</b> (know it exists): the OS keeps recently-used file pages in RAM. A <code>write()</code> only marks pages dirty and returns — durability needs <code>fsync</code> (LWN <a href="https://lwn.net/Articles/752063/" target="_blank" rel="noopener">"PostgreSQL's fsync() surprise"</a>). The <i>internals</i> come back in the extension.` },
          ],
          model: `A cache line is ~64 bytes; row-major traversal is fast because it uses whole lines, pointer-chasing thrashes cache. Orders of magnitude: L1 ~1ns, main memory ~100ns, SSD ~16µs, network within a DC ~0.5ms. And two levels up: the OS pages memory (TLB-cached) and caches file data in RAM — so "durable" means <code>fsync</code>'d, not "write() returned".`,
          cards: [
            { q: `Why do arrays beat linked lists for traversal?`, a: `A cache line is ~64 bytes; array/row-major traversal uses whole lines, pointer-chasing thrashes the cache.` },
            { q: `Order-of-magnitude latencies: L1, RAM, SSD, DC network?`, a: `L1 ~1ns, main memory ~100ns, SSD ~16µs, network within a datacenter ~0.5ms.` },
            { q: `What does the TLB do?`, a: `Caches virtual-page → physical-frame translations; a <b>hit</b> makes address translation nearly free, only a <b>miss</b> pays the page-table walk.` },
            { q: `Does a returning <code>write()</code> mean the data is durable?`, a: `No — it only marks page-cache pages dirty. Durability needs <code>fsync</code>/<code>fdatasync</code> (flush dirty pages + the disk's write cache).` },
          ] },
      ],
    },
    {
      id: "d14", date: "2026-10-24", week: "w5", title: "EXPLAIN: reading the query planner's mind",
      theme: "Databases · part 2 — estimated vs actual rows is the #1 diagnostic.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 75,
          lead: `<b>Databases ②</b> — read a plan and diagnose a slow query. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/using-explain.html" target="_blank" rel="noopener">14.1 "Using EXPLAIN"</a> — the whole section, running each example.` },
            { id: "s2", est: 25, label: `Then UTIL’s <a href="https://use-the-index-luke.com/sql/explain-plan/postgresql" target="_blank" rel="noopener">Postgres execution plans</a> — the same output read by someone hunting a slow query.` },
            { id: "s3", est: 25, label: `Learn to read <b>Seq Scan / Index Scan / Index-Only Scan / Bitmap Heap Scan / Nested Loop vs Hash Join</b>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: <code>EXPLAIN (ANALYZE, BUFFERS) SELECT …</code> a query with and without a helpful index; watch the plan flip from Seq Scan to Index Scan and the cost drop.` },
        { id: "s2", type: "hint", label: `💡 <b>N+1</b> = 1 query for a list + N queries for each item's relation. Fix by eager-loading / JOIN / <code>IN (…)</code> batch — the most common ORM performance bug.` },
      ],
      note: "The first week where all four threads are in motion at once — Networking + DevOps + Systems + DB.",
    },
    {
      id: "d15", date: "2026-10-26", week: "w5", title: "EXPLAIN: reading the query planner's mind (cont.)",
      theme: "Finish “EXPLAIN: reading the query planner's mind” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d14", obj: DATA, cat: "read", est: 25,
          lead: `<b>Databases ②</b> — read a plan and diagnose a slow query. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Always use <code>EXPLAIN (ANALYZE, BUFFERS)</code>: a big gap between <i>estimated</i> and <i>actual</i> rows means stale stats (run <code>ANALYZE</code> / raise <code>default_statistics_target</code>).` },
          ],
          model: `The planner is <b>cost-based</b>, not rule-based: it will (correctly) ignore your index when a predicate matches a large fraction of rows, because a sequential scan is cheaper. An unused index isn't always a bug.`,
          cards: [
            { q: `<code>EXPLAIN ANALYZE</code> shows estimated ≫ actual rows — what does it mean?`, a: `Stale statistics — run <code>ANALYZE</code> / raise <code>default_statistics_target</code>.` },
            { q: `Why might the planner ignore your index?`, a: `It's cost-based: when a predicate matches a large fraction of rows, a sequential scan is cheaper. Not always a bug.` },
          ] },
      ],
    },

    /* ---------------- Week 6 ---------------- */
    {
      id: "d16", date: "2026-10-28", week: "w6", title: "DNS resolution, end to end",
      theme: "Networking · part 4 — the recursive resolver as middleman.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 60,
          lead: `<b>Networking ④</b> — trace a name to an address, hop by hop.`,
          sub: [
            { id: "s1", est: 25, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/dns/what-is-dns/" target="_blank" rel="noopener">"What is DNS?"</a> + <a href="https://www.cloudflare.com/learning/dns/dns-server-types/" target="_blank" rel="noopener">DNS server types</a>.` },
            { id: "s2", est: 20, label: `The path: stub resolver → <b>recursive resolver</b> → root (13 root-server IPs) → TLD (<code>.com</code>) → authoritative → A/AAAA, with caching (TTL) at every hop.`,
              info: `<p>Resolving <code>www.example.com</code> walks a delegation chain, cached at every hop:</p>
<ol>
<li>Your <b>stub resolver</b> (the OS) asks a <b>recursive resolver</b> (your ISP / 1.1.1.1 / 8.8.8.8).</li>
<li>The recursor asks a <b>root</b> server (13 well-known anycast IPs) → "ask the <code>.com</code> TLD servers."</li>
<li>The <b>TLD</b> servers → "ask example.com's <b>authoritative</b> servers."</li>
<li>The authoritative server returns the <b>A/AAAA</b> record.</li>
</ol>
<p>Each answer carries a <b>TTL</b>, so the recursor caches it and later queries skip most of the walk — which is also why DNS changes take time to propagate.</p>` },
            { id: "s3", cat: "lab", est: 15, label: `Run <code>dig +trace google.com</code> to watch the root→TLD→authoritative delegation live.` },
          ],
          model: `DNS is why "it works on my machine" can be a caching lie: resolvers, the OS, and your app each cache records for the TTL, so a stale A record survives long after you change it.`,
          cards: [
            { q: `The DNS resolution path, hop by hop?`, a: `stub resolver → <b>recursive resolver</b> → root → TLD (<code>.com</code>) → authoritative → A/AAAA, cached by TTL at each hop.` },
            { q: `Why can a DNS change take time to take effect?`, a: `Resolvers, the OS and your app each cache the record for its <b>TTL</b> — a stale A record survives until it expires.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "suggestion", label: `Interview-ready: narrate "what happens when you type a URL and hit Enter" — see <a href="https://github.com/alex/what-happens-when" target="_blank" rel="noopener">alex/what-happens-when</a> for the full ARP→DNS→TCP→TLS→HTTP walk.` },
        { id: "s2", type: "hint", label: `💡 Lower TTLs = faster propagation but more resolver traffic; you drop TTLs <i>before</i> a planned migration, then raise them after.` },
      ],
    },
    {
      id: "d17", date: "2026-10-29", week: "w6", title: "k8s scheduling, probes, requests/limits & HPA",
      theme: "DevOps · part 4 — the operational levers you get asked about.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 70,
          lead: `<b>DevOps ④</b> — how Pods get placed, kept healthy, and scaled. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read the k8s <a href="https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/" target="_blank" rel="noopener">scheduler</a> — filter → score → bind.` },
            { id: "s2", est: 25, label: `Then <a href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" target="_blank" rel="noopener">liveness/readiness/startup probes</a> — three probes, three different jobs.` },
            { id: "s3", est: 20, label: `Read <a href="https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" target="_blank" rel="noopener">requests/limits</a>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ requests≠limits is the root of "noisy neighbour" incidents. Set memory request = limit for predictable OOM behaviour; be careful with CPU limits (throttling adds tail latency).` },
        { id: "s2", type: "hint", label: `💡 HPA scales replica count toward a target metric (CPU/custom). It can't scale below readiness — an unready Pod serves no traffic, so probes and autoscaling are coupled.` },
      ],
    },
    {
      id: "d18", date: "2026-11-01", week: "w6", title: "k8s scheduling, probes, requests/limits & HPA (cont.)",
      theme: "Finish “k8s scheduling, probes, requests/limits & HPA” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d17", obj: OPS, cat: "read", est: 45,
          lead: `<b>DevOps ④</b> — how Pods get placed, kept healthy, and scaled. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Then the <a href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" target="_blank" rel="noopener">HorizontalPodAutoscaler</a> — what it scales on, and why it needs requests to be set.` },
            { id: "s2", est: 20, label: `<b>requests</b> = scheduling guarantee; <b>limits</b> = runtime cap (CPU throttled, memory over-limit → OOMKill).` },
          ],
          model: `<b>liveness</b> restarts an unhealthy Pod; <b>readiness</b> removes it from the Service until ready; <b>startup</b> protects slow boots. A failing <i>dependency</i> should flip readiness, not liveness — or you restart-loop a healthy Pod.`,
          cards: [
            { q: `requests vs limits?`, a: `<b>requests</b> = scheduling guarantee; <b>limits</b> = runtime cap (CPU throttled, memory over-limit → OOMKill).` },
            { q: `liveness vs readiness probe?`, a: `liveness restarts an unhealthy Pod; readiness removes it from the Service until ready. A failing <i>dependency</i> flips readiness, not liveness.` },
          ] },
      ],
    },

    /* ---------------- Week 7 ---------------- */
    {
      id: "d19", date: "2026-11-06", week: "w7", title: "Security foundations: OWASP 2025 + authn vs authz",
      theme: "Security · part 1 — the vocabulary you're measured against.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 60,
          lead: `<b>Security ①</b> — the risk landscape, and the authn/authz split. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Skim the <a href="https://owasp.org/Top10/2025/" target="_blank" rel="noopener">OWASP Top 10 (2025 — the current edition)</a>, entries #1–#5: Broken Access Control, Security Misconfiguration, Software Supply-Chain Failures, Cryptographic Failures, Injection.` },
            { id: "s2", est: 30, label: "Then entries #6–#10 of the same list — one line each on what the category means and the one defense that kills most of it." },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Security is threaded through the core (auth → OAuth/JWT → hashing → smart-contract vulns) and lands the capstone in week 19. Today is the map.` },
        { id: "s2", type: "hint", label: `💡 "Security misconfiguration" climbing to #2 is a DevOps overlap: default creds, open S3 buckets, verbose errors, missing headers. Config <i>is</i> attack surface.` },
      ],
      note: "🏁 Month-1 checkpoint week: Networking + DevOps foundations laid, plus Systems, DB and the security map.",
    },
    {
      id: "d20", date: "2026-11-09", week: "w7", title: "Security foundations: OWASP 2025 + authn vs authz (cont.)",
      theme: "Finish “Security foundations: OWASP 2025 + authn vs authz” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d19", obj: SEC, cat: "read", est: 40,
          lead: `<b>Security ①</b> — the risk landscape, and the authn/authz split. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read the OWASP <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener">Authentication Cheat Sheet</a>.` },
          ],
          model: `<b>Authentication</b> = who you are; <b>authorization</b> = what you may do. "Broken Access Control" being #1 means most auth bugs are missing <i>authorization</i> checks — forgetting that <i>this</i> user owns <i>this</i> record (IDOR). Every endpoint needs an ownership check, not just a login gate.`,
          cards: [
            { q: `Authentication vs authorization?`, a: `authn = <b>who you are</b>; authz = <b>what you may do</b>. OWASP #1 (Broken Access Control) is mostly missing <i>authz</i> checks — IDOR.` },
            { q: `What does every endpoint need beyond a login gate?`, a: `An <b>ownership check</b> — that <i>this</i> user owns <i>this</i> record.` },
          ] },
      ],
    },
    {
      id: "d21", date: "2026-11-10", week: "w7", title: "The TLS 1.3 handshake & PKI",
      theme: "Networking · part 5 — how two strangers agree a secret over a wiretap.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 75,
          lead: `<b>Networking ⑤</b> — what actually happens when the padlock appears.`,
          sub: [
            { id: "s1", est: 40, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/" target="_blank" rel="noopener">"What happens in a TLS handshake?"</a> (TLS 1.3 is <b>1-RTT</b>, with 0-RTT resumption).` },
            { id: "s2", est: 35, label: `For the byte level, skim <a href="https://tls13.xargs.org/" target="_blank" rel="noopener">The Illustrated TLS 1.3 Connection</a> (every byte annotated).` },
          ],
          model: `Asymmetric keys are used only to <b>agree a symmetric session key</b>; bulk traffic is symmetric (fast). A cert chain (leaf → intermediate → root CA) proves you're talking to the real server. "Cert expired/unknown authority" is usually a missing intermediate, not a broken key.`,
          cards: [
            { q: `What are asymmetric keys used for in TLS?`, a: `Only to <b>agree a symmetric session key</b>; bulk traffic is then symmetric (fast).` },
            { q: `"Certificate unknown authority" — the usual real cause?`, a: `A missing <b>intermediate</b> cert in the chain (leaf → intermediate → root), not a broken key.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <b>SNI</b> in the ClientHello lets one IP host many TLS sites (historically plaintext — a privacy leak ECH addresses). <b>ALPN</b> in the same hello negotiates HTTP/2 vs HTTP/1.1.` },
        { id: "s2", type: "callout", label: `🔗 This is the same crypto you'll meet in the blockchain thread: signatures prove identity, hashes prove integrity. TLS just wires them into a handshake.` },
      ],
    },

    /* ---------------- Week 8 ---------------- */
    {
      id: "d22", date: "2026-11-12", week: "w8", title: "MVCC: how Postgres lets readers not block writers",
      theme: "Databases · part 3 — every row carries its own version stamps.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          lead: `<b>Databases ③</b> — multi-version concurrency control, and why tables bloat. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/mvcc-intro.html" target="_blank" rel="noopener">Ch 13.1 Concurrency Control (MVCC)</a>.` },
            { id: "s2", est: 30, label: `Then <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">13.2 Transaction Isolation</a> — the four levels and the anomalies each one still allows.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "suggestion", label: `Preview: isolation levels are defined by which anomalies they forbid. MVCC snapshots give you Postgres's "Repeatable Read" (= snapshot isolation) for free.` },
        { id: "s2", type: "callout", label: `🔬 MVCC is why long-running transactions are dangerous in Postgres: they hold back the "xmin horizon" so VACUUM can't reclaim dead tuples cluster-wide → bloat.` },
      ],
    },
    {
      id: "d23", date: "2026-11-15", week: "w8", title: "MVCC: how Postgres lets readers not block writers (cont.)",
      theme: "Finish “MVCC: how Postgres lets readers not block writers” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d22", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ③</b> — multi-version concurrency control, and why tables bloat. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Each row version carries <code>xmin</code>/<code>xmax</code>; each txn sees a <b>snapshot</b>, so readers never block writers and vice-versa.`, info: `<p><b>MVCC</b> = Multi-Version Concurrency Control: instead of locking a row for a reader, Postgres keeps <i>multiple versions</i> of it.</p>
<ul>
<li>Every row version is stamped with <code>xmin</code> (the txid that created it) and <code>xmax</code> (the txid that deleted/superseded it).</li>
<li>Each transaction gets a <b>snapshot</b> — the set of txids visible to it — and sees only versions whose <code>xmin</code> is visible and whose <code>xmax</code> is not.</li>
</ul>
<p>So <b>readers never block writers and writers never block readers</b>: an <code>UPDATE</code> writes a new version while existing readers keep seeing the old one. The cost is dead tuples that <b>VACUUM</b> later reclaims (d60).</p>` },
            { id: "s2", est: 25, label: `Deeper tuple-level detail: Egor Rogov's <a href="https://www.postgrespro.com/blog/pgsql/5967856" target="_blank" rel="noopener">MVCC series</a>.` },
          ],
          model: `An <code>UPDATE</code> is really <i>insert a new row version + mark the old dead</i> — so heavy-update tables bloat and need <b>VACUUM</b>/autovacuum. That single fact explains "my table is 5× its data size."`,
          cards: [
            { q: `What is an <code>UPDATE</code>, really, under MVCC?`, a: `Insert a <i>new</i> row version + mark the old dead (<code>xmin</code>/<code>xmax</code>) — so heavy-update tables bloat and need <b>VACUUM</b>.` },
            { q: `Why are long-running transactions dangerous in Postgres?`, a: `They hold back the <b>xmin horizon</b>, so VACUUM can't reclaim dead tuples cluster-wide → bloat.` },
          ] },
      ],
    },
    {
      id: "d24", date: "2026-11-16", week: "w8", title: "Getting it out the door: deploys, GitOps & 12-factor",
      theme: "DevOps · part 5 — rolling vs blue-green vs canary, and config in the environment.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 85,
          lead: `<b>DevOps ⑤</b> — how changes reach production safely.`,
          sub: [
            { id: "s1", est: 20, label: `Read Martin Fowler <a href="https://martinfowler.com/bliki/BlueGreenDeployment.html" target="_blank" rel="noopener">BlueGreenDeployment</a> (rolling is the k8s default).` },
            { id: "s2", est: 20, label: `Then <a href="https://martinfowler.com/bliki/CanaryRelease.html" target="_blank" rel="noopener">CanaryRelease</a> — the same cut-over, done to a slice of traffic.` },
            { id: "s3", est: 20, label: `Read the <a href="https://opengitops.dev/" target="_blank" rel="noopener">4 GitOps principles</a>.` },
            { id: "s4", est: 25, label: `Then <a href="https://12factor.net/" target="_blank" rel="noopener">The Twelve-Factor App</a> — esp. III config in env, VI stateless, IX disposability, XI logs to stdout.` },
          ],
          model: `Rolling = incremental replace; blue-green = two environments, flip traffic, instant rollback; canary = small %, watch metrics, ramp. <b>GitOps is the reconciliation loop again</b>: Git holds desired state, an agent (Argo/Flux) converges the cluster to it.`,
          cards: [
            { q: `Rolling vs blue-green vs canary?`, a: `Rolling = incremental replace; blue-green = two envs, flip traffic (instant rollback); canary = small %, watch metrics, ramp.` },
            { q: `What is GitOps, in terms you already know?`, a: `The reconciliation loop again: Git holds desired state, an agent (Argo/Flux) converges the cluster to it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 12-factor XI (logs to stdout, not files) is exactly why your Loki/Promtail stack works — the platform captures the stream. Apps that write their own log files fight the platform.` },
        { id: "s2", type: "hint", label: `💡 Same shape three times now: k8s controllers, GitOps agents, and Terraform's plan/apply-vs-state all reconcile desired → actual. Learn it once, recognize it everywhere.` },
      ],
    },

    /* ---------------- Week 9 ---------------- */
    {
      id: "d25", date: "2026-11-18", week: "w9", title: "Crypto primitives: hash vs sign vs encrypt, Merkle trees",
      theme: "Blockchain · part 1 — get the three-way distinction exactly right.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 70,
          lead: `<b>Blockchain ①</b> — the primitives every chain is built from. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read <i>Mastering Ethereum</i> (2nd ed, free) <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_4.md" target="_blank" rel="noopener">Ch 4 "Cryptography"</a> — keys, addresses, and signing.` },
            { id: "s2", est: 30, label: `Then the Merkle-tree section of <i>Mastering Bitcoin</i> (3rd ed) <a href="https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch11_blockchain.adoc" target="_blank" rel="noopener">Ch 11</a> — how a root commits to every transaction under it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Ethereum's state is a <b>Merkle-Patricia trie</b> (four tries: state/storage/tx/receipts) — <a href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/" target="_blank" rel="noopener">ethereum.org</a>. That's how a light client proves a balance without the whole chain.` },
        { id: "s2", type: "hint", label: `💡 keccak256 (Ethereum) ≠ the finalized NIST SHA-3 — a common trick question. Same sponge construction, different padding.` },
      ],
    },
    {
      id: "d26", date: "2026-11-20", week: "w9", title: "Crypto primitives: hash vs sign vs encrypt, Merkle trees (cont.)",
      theme: "Finish “Crypto primitives: hash vs sign vs encrypt, Merkle trees” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d25", obj: CHAIN, cat: "read", est: 45,
          lead: `<b>Blockchain ①</b> — the primitives every chain is built from. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `The two curves you use: Ethereum/Bitcoin = <b>ECDSA/secp256k1</b> + <b>keccak256</b>; Solana = <b>ed25519 (EdDSA)</b> (<a href="https://datatracker.ietf.org/doc/html/rfc8032" target="_blank" rel="noopener">RFC 8032</a>).` },
          ],
          model: `<b>Hashing</b> = one-way integrity (SHA-256/keccak256); <b>encryption</b> = reversible secrecy; <b>signing</b> = authenticity + non-repudiation. A <b>Merkle tree</b> hashes pairs up to one root, so you can prove one leaf is included with ~log(N) hashes.`,
          cards: [
            { q: `Hash vs encrypt vs sign?`, a: `Hash = one-way integrity; encryption = reversible secrecy; signing = authenticity + non-repudiation.` },
            { q: `What does a Merkle tree let you prove?`, a: `That one leaf is included, with ~log(N) hashes (hash pairs up to a single root).` },
          ] },
      ],
    },
    {
      id: "d27", date: "2026-11-21", week: "w9", title: "HTTP/1.1 → HTTP/2 → HTTP/3 & QUIC",
      theme: "Networking · part 6 — each version fixes the last one's bottleneck.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 60,
          lead: `<b>Networking ⑥</b> — why HTTP kept getting rewritten. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read HPBN <a href="https://hpbn.co/http1x/" target="_blank" rel="noopener">HTTP/1.X</a>: persistent connections, and why pipelining failed.` },
            { id: "s2", est: 35, label: `Then <a href="https://hpbn.co/http2/" target="_blank" rel="noopener">HTTP/2</a>: multiplexing, the binary framing layer, and HPACK.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "suggestion", label: `Pair with keep-alive/pooling (MDN <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x" target="_blank" rel="noopener">Connection management</a>) — check a client you ship: Go <code>http.Transport.MaxIdleConnsPerHost</code>, Node <code>http.Agent keepAlive</code>.` },
        { id: "s2", type: "hint", label: `💡 HPACK/QPACK header compression is why H2/H3 are efficient for many small requests — H1's repeated plaintext headers were a real cost at scale.` },
      ],
    },

    /* ---------------- Week 10 ---------------- */
    {
      id: "d28", date: "2026-11-26", week: "w10", title: "HTTP/1.1 → HTTP/2 → HTTP/3 & QUIC (cont.)",
      theme: "Finish “HTTP/1.1 → HTTP/2 → HTTP/3 & QUIC” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d27", obj: NET, cat: "read", est: 50,
          lead: `<b>Networking ⑥</b> — why HTTP kept getting rewritten. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `For H3/QUIC, read the free <a href="https://http3-explained.haxx.se/" target="_blank" rel="noopener">HTTP/3 explained</a> through the QUIC transport chapters: reliable multiplexed streams over <b>UDP</b>, TLS 1.3 built in.` },
            { id: "s2", est: 25, label: "Finish the same book: the HTTP/3 mapping itself, plus connection migration and 0-RTT." },
          ],
          model: `H2 fixed HTTP-level HOL blocking (multiplexing) but sits on TCP, so one lost packet still stalls all streams at the transport layer. H3 moves multiplexing into QUIC/UDP so a loss stalls only <i>its</i> stream. That's the whole H2→H3 story.`,
          cards: [
            { q: `H2 fixed HOL blocking, so why does one lost packet still stall all streams?`, a: `H2 multiplexes over <b>TCP</b> — the stall is at the transport layer. H3 moves multiplexing into QUIC/UDP, so a loss stalls only its own stream.` },
            { q: `What transport does HTTP/3 run on?`, a: `<b>QUIC over UDP</b>, with TLS 1.3 built in and connection migration.` },
          ] },
      ],
    },
    {
      id: "d29", date: "2026-11-30", week: "w10", title: "Redis internals: why single-threaded is fast",
      theme: "Caching · part 1 — one event loop, atomic commands, no locks.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 85,
          lead: `<b>Caching ①</b> — how one thread does millions of ops/sec.`,
          sub: [
            { id: "s1", est: 20, label: `Read the Redis <a href="https://redis.io/docs/latest/develop/get-started/faq/" target="_blank" rel="noopener">FAQ</a> — the single-thread rationale, in their own words.` },
            { id: "s2", est: 20, label: `Then the <a href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener">data types</a> overview — strings, hashes, lists, sets, sorted sets, streams, HLL.` },
            { id: "s3", est: 25, label: `Command execution runs on <b>one thread on an event loop</b> → every command is atomic (no client-side locks for <code>INCR</code>/<code>SETNX</code>). Redis 6+ multithreads only network I/O, not command execution.`, info: `<p>Redis runs your commands on a <b>single thread</b> pulling from one event loop, so each command runs start-to-finish with nothing interleaved — it's <b>atomic by construction</b>. That's why <code>INCR</code>, <code>SETNX</code>, <code>LPUSH</code> need no client-side locks.</p>
<p>The flip side: one <b>O(N)</b> command (<code>KEYS *</code>, a huge <code>LRANGE</code>, a big <code>SORT</code>) blocks <i>every other client</i> for its whole duration — use <code>SCAN</code> and bounded ranges in production.</p>
<p>"Redis is multi-threaded now" (6+) only means it parallelizes <b>network I/O</b>; command execution stays one thread — which is exactly what preserves the atomicity guarantee.</p>` },
            { id: "s4", est: 20, label: `Structures by use: sorted sets → leaderboards & sliding-window rate limiting; hashes → objects; streams → event log; HLL → cardinality.` },
          ],
          model: `Redis is memory/network-bound, not CPU-bound. Because it's one loop, a single O(N) command (<code>KEYS *</code>, a huge <code>SMEMBERS</code>/<code>SORT</code>) blocks <i>every</i> client — use <code>SCAN</code>, keep values small, never <code>KEYS</code> in prod.`,
          cards: [
            { q: `Why is single-threaded Redis fast — and what's the risk?`, a: `One event loop → every command is atomic (no locks). But one O(N) command (<code>KEYS *</code>) blocks <i>every</i> client — use <code>SCAN</code>.` },
            { q: `Redis is bound by which resource?`, a: `Memory/network, not CPU — so scale <i>out</i> (Cluster/replicas) or pipeline; don't expect one instance to use many cores.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Directly useful for your prediction game: sorted sets (<code>ZADD</code>/<code>ZRANGEBYSCORE</code>) give you leaderboards and a rate limiter in a handful of atomic ops — no locks, no races.` },
        { id: "s2", type: "callout", label: `🔬 Scale <i>out</i> (Cluster/replicas) or use <b>pipelining</b> to amortize RTT, rather than expecting one instance to use many cores.` },
      ],
    },
    {
      id: "d30", date: "2026-12-01", week: "w10", title: "Isolation levels & the anomalies they prevent",
      theme: "Databases · part 4 — and the one everyone misses: write skew.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 70,
          lead: `<b>Databases ④</b> — map each anomaly to the level that stops it. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read DDIA <b>Ch 7 "Weak Isolation Levels"</b> as far as <b>Snapshot Isolation</b> (Read Committed → SI, and the reads each one can still see).` },
            { id: "s2", est: 35, label: "Finish DDIA Ch 7: Preventing Lost Updates, then Write Skew & Phantoms." },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧠 Postgres names are confusing: PG "Repeatable Read" is actually <b>Snapshot Isolation</b>, and PG never shows dirty reads even at Read Committed.` },
        { id: "s2", type: "hint", label: `💡 Cheapest correctness fix for lost updates: an atomic <code>UPDATE … SET x = x + 1</code> or <code>SELECT … FOR UPDATE</code>, not a read-then-write in app code.` },
      ],
      note: "Month 2 underway — data, HTTP, caching and blockchain now interleaving with DevOps.",
    },

    /* ---------------- Week 11 ---------------- */
    {
      id: "d31", date: "2026-12-02", week: "w11", title: "Isolation levels & the anomalies they prevent (cont.)",
      theme: "Finish “Isolation levels & the anomalies they prevent” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d30", obj: DATA, cat: "read", est: 45,
          lead: `<b>Databases ④</b> — map each anomaly to the level that stops it. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Cross-check PG's <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">13.2 table</a>. Cheat-sheet: dirty read → Read Committed; non-repeatable → Repeatable Read/SI; phantom → Serializable; lost update → SI does NOT stop it (use <code>FOR UPDATE</code>).` },
          ],
          model: `<b>Write skew</b> is the interview-grade one: two txns read an overlapping set, each updates a <i>different</i> row, together breaking an invariant (both on-call doctors go off-call). Snapshot isolation allows it; only Serializable (SSI) stops it. Relevant to any check-then-act in your market settlement.`,
          cards: [
            { q: `What is write skew?`, a: `Two txns read an overlapping set, each updates a <i>different</i> row, together breaking an invariant. Snapshot isolation allows it; only Serializable stops it.` },
            { q: `Postgres "Repeatable Read" actually is…?`, a: `<b>Snapshot Isolation</b>. And PG never shows dirty reads, even at Read Committed.` },
          ] },
      ],
    },
    {
      id: "d32", date: "2026-12-04", week: "w11", title: "Observability: golden signals, histograms & why p99",
      theme: "DevOps · part 6 — averages lie; you live at the tail.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 60,
          lead: `<b>DevOps ⑥</b> — what to measure, and why percentiles beat averages. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read Google SRE (free) <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">Ch 6 "Monitoring Distributed Systems"</a> to the end of the <b>Four Golden Signals</b> (Latency, Traffic, Errors, Saturation).` },
            { id: "s2", est: 30, label: "Finish SRE Ch 6: choosing a resolution, keeping alerts simple, and the long-term-vs-short-term tension." },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ <b>Cardinality trap:</b> a Prometheus series = metric name + every label combo. Put a user/request ID or full URL in a label and you get a series explosion that OOMs the server. Labels must be bounded.` },
        { id: "s2", type: "hint", label: `💡 Three lenses: <b>Golden Signals</b> (services) ≈ <b>RED</b> (Rate/Errors/Duration) + Saturation; <b>USE</b> (Utilization/Saturation/Errors) for resources (the load-testing day).` },
      ],
    },
    {
      id: "d33", date: "2026-12-06", week: "w11", title: "Inside the EVM: stack machine, storage, gas",
      theme: "Blockchain · part 2 — what your Solidity actually compiles down to.",
      tasks: [
        { id: "t1", carried: "d32", obj: OPS, cat: "read", est: 40,
          lead: `<b>DevOps ⑥</b> — what to measure, and why percentiles beat averages. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read Prometheus <a href="https://prometheus.io/docs/practices/histograms/" target="_blank" rel="noopener">"Histograms and summaries"</a>: histograms expose <code>_bucket{le=…}</code> so the server computes <code>histogram_quantile(0.99, …)</code> and can aggregate across instances (summaries can't).` },
          ],
          model: `Why p99 not average: the mean is dominated by the bulk; tail latency is what users and fan-out/queued requests feel. One slow dependency in a fan-out makes the tail the effective latency.`,
          cards: [
            { q: `The Four Golden Signals?`, a: `Latency, Traffic, Errors, Saturation.` },
            { q: `Why report p99, not average latency?`, a: `The mean is dominated by the bulk; the <b>tail</b> is what users and fan-out/queued requests actually feel.` },
            { q: `The Prometheus cardinality trap?`, a: `A series = metric + every label combo. A user/request ID or full URL in a label → series explosion that OOMs the server. Labels must be bounded.` },
          ] },
        { id: "t2", obj: CHAIN, cat: "read", est: 40,
          lead: `<b>Blockchain ②</b> — the machine your contracts run on. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read <i>Mastering Ethereum</i> <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_14.md" target="_blank" rel="noopener">Ch 14 "The EVM"</a> — the machine, its data locations, and gas.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: paste a few opcodes into the <a href="https://www.evm.codes/playground" target="_blank" rel="noopener">evm.codes playground</a> and single-step — watch the stack push/pop and gas tick down. Best way to make "stack machine" click.` },
        { id: "s2", type: "hint", label: `💡 Gas is a metering + anti-DoS mechanism: you pre-pay a gas limit; unused gas is refunded, running out reverts state but still costs the gas burned. It's the EVM's answer to the halting problem.` },
      ],
    },

    /* ---------------- Week 12 ---------------- */
    {
      id: "d34", date: "2026-12-10", week: "w12", title: "Inside the EVM: stack machine, storage, gas (cont.)",
      theme: "Finish “Inside the EVM: stack machine, storage, gas” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d33", obj: CHAIN, cat: "read", est: 70,
          lead: `<b>Blockchain ②</b> — the machine your contracts run on. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Then explore <a href="https://www.evm.codes/" target="_blank" rel="noopener">evm.codes</a> — per-opcode gas in a live playground; run a few opcodes by hand.` },
            { id: "s2", est: 45, label: `The EVM is a <b>stack machine</b> (1024-deep, 256-bit words). Three data locations: <b>storage</b> (persistent, expensive, in the state trie), <b>memory</b> (per-call, cheap, wiped), <b>calldata</b> (read-only input).`, info: `<p><b>Stack machine</b> = no registers. Opcodes pop their operands off a stack and push the result: <code>ADD</code> pops two words, pushes one. Solidity locals live on that stack, and only the top 16 are reachable — that's the origin of the "stack too deep" compile error.</p>
<p>The three data locations, by cost &amp; lifetime:</p>
<ul>
<li><b>storage</b> — the contract's permanent state (the state trie). A fresh slot costs ~20k gas and lives forever; every state variable and mapping lives here.</li>
<li><b>memory</b> — a scratchpad for the <i>current call only</i>, a few gas per word, wiped on return. Temp arrays/structs.</li>
<li><b>calldata</b> — the read-only, immutable input bytes of the call; cheapest to read, can't be mutated.</li>
</ul>
<p>Choosing the wrong location (needlessly copying calldata → memory, or writing to storage in a loop) is one of the biggest gas leaks in Solidity.</p>` },
          ],
          model: `Every opcode costs <b>gas</b>; <code>SSTORE</code> is the pricey one (cold vs warm, EIP-2929). The account model: <b>EOA</b> (key-controlled) vs <b>contract account</b> (code + storage) — every state change starts from an EOA-signed tx.`,
          cards: [
            { q: `The EVM's three data locations?`, a: `<b>storage</b> (persistent, expensive, in the state trie), <b>memory</b> (per-call, cheap, wiped), <b>calldata</b> (read-only input).` },
            { q: `What is gas, and why does it exist?`, a: `Per-opcode metering + anti-DoS (<code>SSTORE</code> is the pricey one). Running out reverts state but still costs the gas burned — the EVM's answer to the halting problem.` },
          ] },
      ],
    },
    {
      id: "d35", date: "2026-12-12", week: "w12", title: "Message queues vs logs — the core distinction",
      theme: "Messaging · part 1 — delete-on-ack vs retain-and-offset.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 70,
          lead: `<b>Messaging ①</b> — the distinction that unlocks all of streaming. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read DDIA <b>Ch 11</b> "Messaging Systems" → "Partitioned Logs".` },
            { id: "s2", est: 35, label: `Then Jay Kreps’ <a href="https://web.archive.org/web/20260609223006/https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying" target="_blank" rel="noopener">"The Log"</a> (archived — LinkedIn removed the original) — long, and worth it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 A log is the primitive behind replication, CDC, and stream processing — the point of Kreps' essay. Postgres's WAL (next DB day) is literally the same idea inside one database.` },
        { id: "s2", type: "hint", label: `💡 SQS Standard = at-least-once + best-effort order; SQS FIFO = ordered + dedup, lower throughput. "Exactly-once" almost always means at-least-once + idempotency (later this thread).` },
      ],
    },
    {
      id: "d36", date: "2026-12-14", week: "w12", title: "Message queues vs logs — the core distinction (cont.)",
      theme: "Finish “Message queues vs logs — the core distinction” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d35", obj: MSG, cat: "read", est: 35,
          lead: `<b>Messaging ①</b> — the distinction that unlocks all of streaming. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `<b>Queue/broker</b> (RabbitMQ, SQS): message deleted on ack, load-balanced across competing consumers, weak ordering. <b>Log</b> (Kafka): append-only, retained, each consumer tracks its own <b>offset</b> — replayable, ordered within a partition.` },
          ],
          model: `"RabbitMQ or Kafka?" → task/RPC work with per-message ack/priority/TTL → broker/queue; event streaming, replay, multiple independent consumers, high throughput → log/Kafka. The axis is delete-on-ack vs retain-with-offset.`,
          cards: [
            { q: `Message queue vs log — the core axis?`, a: `<b>delete-on-ack</b> (RabbitMQ/SQS: load-balanced, weak order) vs <b>retain-with-offset</b> (Kafka: append-only, replayable, ordered per partition).` },
            { q: `RabbitMQ or Kafka?`, a: `Task/RPC work with per-message ack/priority/TTL → queue; event streaming, replay, many independent consumers, high throughput → log/Kafka.` },
          ] },
      ],
    },

    /* ---------------- Week 13 ---------------- */
    {
      id: "d37", date: "2026-12-18", week: "w13", title: "Load balancers (L4 vs L7), reverse proxies & CDNs",
      theme: "Networking · part 7 — what nginx and your ALB really do.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 70,
          lead: `<b>Networking ⑦</b> — the boxes between the client and your app.`,
          sub: [
            { id: "s1", est: 25, label: `Read Cloudflare on <a href="https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/" target="_blank" rel="noopener">reverse proxies</a> + <a href="https://www.cloudflare.com/learning/cdn/what-is-a-cdn/" target="_blank" rel="noopener">CDNs</a>.` },
            { id: "s2", est: 25, label: `<b>L4 LB</b> "moves packets" (routes by IP/port, can't read URLs — NLB, IPVS, HAProxy TCP). <b>L7 LB</b> "reads requests" (route <code>/api</code> vs <code>/img</code>, terminate TLS, sticky sessions — nginx, Envoy, ALB).` },
            { id: "s3", est: 20, label: `A <b>reverse proxy</b> does TLS termination, caching, compression, buffering, hides the origin; a <b>CDN</b> is edge caches near users.` },
          ],
          model: `"Terminate TLS at the edge" = the L7 proxy/LB decrypts and talks plain HTTP to backends, centralizing certs and offloading crypto. Contrast with TLS passthrough (backend terminates) and re-encryption.`,
          cards: [
            { q: `L4 vs L7 load balancer?`, a: `<b>L4</b> moves packets (routes by IP/port, can't read URLs); <b>L7</b> reads requests (route <code>/api</code>, terminate TLS, sticky sessions).` },
            { q: `What does "terminate TLS at the edge" mean?`, a: `The L7 proxy decrypts and talks plain HTTP to backends — centralizes certs, offloads crypto (vs passthrough / re-encryption).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: write a 20-line nginx config with an <code>upstream {}</code> block and <code>proxy_pass</code> to two backends — you'll learn more from that than any article.` },
        { id: "s2", type: "hint", label: `💡 Rule of thumb: L4 for raw throughput / non-HTTP; L7 when routing decisions need application data (path, headers, cookies).` },
      ],
    },
    {
      id: "d38", date: "2026-12-20", week: "w13", title: "OAuth 2.0, OIDC, PKCE & JWT the right way",
      theme: "Security · part 2 — and the alg:none footgun.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 90,
          lead: `<b>Security ②</b> — the modern auth flow, and how tokens get forged. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read the OAuth <a href="https://www.rfc-editor.org/rfc/rfc6749" target="_blank" rel="noopener">RFC 6749</a> authorization-code flow (§4.1) — who redirects whom, and which secret travels on which channel.` },
            { id: "s2", est: 25, label: `Then <a href="https://www.rfc-editor.org/rfc/rfc7636" target="_blank" rel="noopener">PKCE (RFC 7636)</a> — the code_challenge/code_verifier pair and the attack it closes.` },
            { id: "s3", est: 30, label: `Then PortSwigger’s <a href="https://portswigger.net/web-security/jwt" target="_blank" rel="noopener">JWT attacks</a> lab pages — alg=none, key confusion, and unverified signatures.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ <b>alg:none</b>: an attacker sets the header algorithm to "none" and drops the signature; a naive verifier that reads <code>alg</code> from the token trusts unsigned data. Reject <code>none</code> and its case variants.` },
        { id: "s2", type: "hint", label: `💡 Access token vs ID token: OAuth 2.0 is <i>authorization</i> (access tokens for APIs); OIDC adds <i>authentication</i> (the ID token = who the user is). Don't use an ID token as an API access token.` },
      ],
    },
    {
      id: "d39", date: "2026-12-22", week: "w13", title: "OAuth 2.0, OIDC, PKCE & JWT the right way (cont.)",
      theme: "Finish “OAuth 2.0, OIDC, PKCE & JWT the right way” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d38", obj: SEC, cat: "read", est: 40,
          lead: `<b>Security ②</b> — the modern auth flow, and how tokens get forged. (2/2)`,
          sub: [
            { id: "s1", est: 40, label: `<b>Authorization Code + PKCE</b> is the modern default for all client types: send <code>code_challenge=S256(code_verifier)</code> up front, the raw verifier on the back channel, so a stolen code is useless.`, info: `<p><b>PKCE</b> (Proof Key for Code Exchange) closes the "stolen authorization code" hole in the OAuth Authorization-Code flow, especially for mobile/SPA clients that can't hold a secret.</p>
<ol>
<li>The client invents a random <b>code_verifier</b> and sends only its hash, <code>code_challenge = S256(verifier)</code>, when starting the flow.</li>
<li>The auth server returns a code bound to that challenge.</li>
<li>To redeem the code the client must present the <b>raw verifier</b> — which never travelled over the redirect, so an attacker who intercepts the code can't use it.</li>
</ol>
<p>It's now recommended for <i>all</i> client types (public and confidential), replacing the old implicit flow.</p>` },
          ],
          model: `For JWT: pin the expected <code>alg</code> <b>server-side</b>; never trust the token's <code>alg</code> header. The <b>alg:none</b> attack drops the signature; the RS256→HS256 confusion attack signs with the public key as an HMAC secret. Treat accepted algorithms as an allowlist.`,
          cards: [
            { q: `The modern default OAuth flow for all client types?`, a: `<b>Authorization Code + PKCE</b>: send <code>code_challenge = S256(verifier)</code> up front, the raw verifier on the back channel — so a stolen code is useless.` },
            { q: `How do you harden JWT verification?`, a: `Pin the expected <code>alg</code> <b>server-side</b> (allowlist); never trust the token's <code>alg</code> header. Blocks alg:none and RS256→HS256 confusion.` },
          ] },
      ],
    },

    /* ---------------- Week 14 ---------------- */
    {
      id: "d40", date: "2026-12-23", week: "w14", title: "Locking, deadlocks & the write-ahead log",
      theme: "Databases · part 5 — log the change before you touch the page.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 90,
          lead: `<b>Databases ⑤</b> — how the DB stays correct under contention and crashes.`,
          sub: [
            { id: "s1", est: 45, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/explicit-locking.html" target="_blank" rel="noopener">13.3 "Explicit Locking"</a> (row/table modes, the conflict matrix, <b>deadlock</b> detection via the waits-for graph + <code>deadlock_timeout</code>).` },
            { id: "s2", est: 45, label: `Read <a href="https://www.postgresql.org/docs/current/wal-intro.html" target="_blank" rel="noopener">Ch 30 "Write-Ahead Log"</a>: append the change to the log (fsync'd) <i>before</i> modifying the data page, so a crash can redo.` },
          ],
          model: `App-level deadlock prevention is mostly <b>consistent lock ordering</b> — if every txn locks in the same order, cycles can't form. WAL also doubles as the replication + point-in-time-recovery stream (same "log" idea as Kafka).`,
          cards: [
            { q: `How do you prevent app-level deadlocks?`, a: `<b>Consistent lock ordering</b> — if every txn locks in the same order, cycles can't form. Also wrap contended txns in a retry.` },
            { q: `What is write-ahead logging (WAL)?`, a: `Append the change to the fsync'd log <i>before</i> modifying the data page, so a crash can redo. The same log doubles as replication / PITR.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 <code>synchronous_commit</code>/<code>fsync</code> are the durability dial: <code>fsync=off</code> is fast and loses data on crash — the same page-cache/fsync tension from the OS layer. Durability = "actually on disk," not "write() returned."` },
        { id: "s2", type: "hint", label: `💡 Postgres kills one victim on deadlock and raises an error — so wrap contended transactions in a retry. Deadlocks are expected under load, not a bug to eliminate entirely.` },
      ],
    },
    {
      id: "d41", date: "2026-12-24", week: "w14", title: "Solana's account model — everything is an account",
      theme: "Blockchain · part 3 — stateless programs + separate data accounts.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 40,
          lead: `<b>Blockchain ③</b> — the mental flip from the EVM. (1/2)`,
          sub: [
            { id: "s1", est: 20, label: `Read Solana docs <a href="https://solana.com/docs/core/accounts" target="_blank" rel="noopener">Accounts</a> — everything, including code, is an account.` },
            { id: "s2", est: 20, label: `Then <a href="https://solana.com/docs/core/programs" target="_blank" rel="noopener">Programs</a> — executable accounts that hold no state of their own.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Rent-exemption is a real footgun: an account below the minimum balance can be purged. When you allocate a PDA, fund it for its data size.` },
        { id: "s2", type: "hint", label: `💡 "Everything is an account" includes programs, token mints, and your data — a uniform model that makes the runtime simple but forces explicit account passing everywhere.` },
      ],
    },
    {
      id: "d42", date: "2026-12-28", week: "w14", title: "Solana's account model — everything is an account (cont.)",
      theme: "Finish “Solana's account model — everything is an account” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d41", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ③</b> — the mental flip from the EVM. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `<b>Programs are stateless</b> (executable accounts holding sBPF bytecode); all mutable state lives in <b>separate data accounts</b> a transaction must pass in. Accounts pay <b>rent</b> (must be rent-exempt).` },
            { id: "s2", est: 25, label: `Side-by-side: <a href="https://solana.com/developers/evm-to-svm/accounts" target="_blank" rel="noopener">EVM→SVM: Accounts</a>.` },
          ],
          model: `Contrast with Ethereum's "contract = code + its own storage." Because state is external, Solana instructions must list every account they read/write up front — the constraint that later buys parallelism (Sealevel).`,
          cards: [
            { q: `Where does Solana program state live?`, a: `Programs are <b>stateless</b> (executable accounts); all mutable state is in <i>separate</i> data accounts a tx must pass in explicitly.` },
            { q: `Why must Solana instructions declare all accounts up front?`, a: `It's the constraint that later buys <b>parallelism</b> — Sealevel executes non-overlapping txs at the same time.` },
          ] },
      ],
    },

    /* ---------------- Week 15 ---------------- */
    {
      id: "d43", date: "2027-01-01", week: "w15", title: "SLIs, SLOs, error budgets & tracing",
      theme: "DevOps · part 7 — turn reliability into a number you can spend.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 80,
          lead: `<b>DevOps ⑦</b> — reliability as an engineering budget, plus how traces stitch together.`,
          sub: [
            { id: "s1", est: 40, label: `Read Google SRE <a href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">Ch 4 "Service Level Objectives"</a> + the error-budget part of <a href="https://sre.google/sre-book/embracing-risk/" target="_blank" rel="noopener">Ch 3 "Embracing Risk"</a>.` },
            { id: "s2", est: 20, label: `Read OpenTelemetry <a href="https://opentelemetry.io/docs/concepts/signals/traces/" target="_blank" rel="noopener">Traces</a>.` },
            { id: "s3", est: 20, label: `<b>SLI</b> = measured level (e.g. % requests < 300 ms); <b>SLO</b> = target (99.9%/28d); <b>error budget</b> = 1 − SLO (99.9% ⇒ ~43 min/month).` },
          ],
          model: `Budget remaining → ship features; budget spent → freeze risky changes. Don't be <i>more</i> reliable than the SLO needs — excess reliability has real opportunity cost, and users can't tell. 100% is the wrong target.`,
          cards: [
            { q: `SLI vs SLO vs error budget?`, a: `<b>SLI</b> = measured level; <b>SLO</b> = target (e.g. 99.9%/28d); <b>error budget</b> = 1 − SLO (99.9% ≈ 43 min/month).` },
            { q: `Why is 100% reliability the wrong target?`, a: `Excess reliability has real opportunity cost and users can't tell. Budget remaining → ship; budget spent → freeze risky changes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Tracing under the hood: a trace = a tree of spans; a <b>W3C <code>traceparent</code></b> header carries the trace/span IDs across service boundaries so downstream spans join the same trace. That header is the whole magic.` },
        { id: "s2", type: "hint", label: `💡 SLA vs SLO: an SLA is a <i>contract</i> with consequences; your internal SLO should be tighter, so you notice and fix before you breach the SLA.` },
      ],
    },
    {
      id: "d44", date: "2027-01-02", week: "w15", title: "How a server accepts 10k connections: epoll & the event loop",
      theme: "Systems · part 3 — the pattern behind nginx, Node, tokio & Go's netpoller.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 75,
          lead: `<b>Systems ③</b> — the I/O model that scales past thread-per-connection.`,
          sub: [
            { id: "s1", est: 40, label: `Read Dan Kegel's <a href="https://www.kegel.com/c10k.html" target="_blank" rel="noopener">The C10K problem</a> for the model (thread-per-connection vs <code>select</code>/<code>poll</code> vs <b>epoll</b>, edge- vs level-triggered).` },
            { id: "s2", est: 35, label: `The modern pattern: a few event-loop threads each call <code>epoll_wait()</code> for ready fds, then do <b>non-blocking</b> <code>accept</code>/<code>read</code>/<code>write</code>.`,
              info: `<p>One OS thread per connection costs ~1–8&nbsp;MB of stack each and drowns the scheduler around 10k clients. The event loop flips control around:</p>
<ul>
<li>Put every socket in <b>non-blocking</b> mode — a <code>read</code> with no data returns <code>EAGAIN</code> instead of sleeping.</li>
<li>Register them all with the kernel via <code>epoll</code> (Linux), <code>kqueue</code> (BSD/macOS) or IOCP (Windows).</li>
<li>One thread loops on <code>epoll_wait()</code>, which returns <i>only</i> the fds that are ready, and services each without ever blocking.</li>
</ul>
<p><b>Edge- vs level-triggered:</b> level re-notifies while data remains (simpler); edge notifies once per readiness change, so you must drain the fd fully or it hangs — the classic epoll bug. This single loop is what nginx, Node's libuv, Netty, tokio and Go's netpoller all are underneath.</p>` },
          ],
          model: `That's nginx (worker per core), Node (loop + libuv pool), Netty, tokio, and Go's netpoller (hidden behind blocking-looking goroutines). Four axes people muddle: blocking vs non-blocking vs sync vs async (kernel does the work, notifies on completion — io_uring).`,
          cards: [
            { q: `How does one server handle 10k connections without a thread each?`, a: `A few event-loop threads call <code>epoll_wait()</code> for ready fds, then do <b>non-blocking</b> accept/read/write (nginx, Node, tokio, Go's netpoller).` },
            { q: `Are "async" and "threads" opposites?`, a: `No — async is <i>how</i> a few threads serve many connections (non-blocking syscalls + an event loop).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: <code>strace -e epoll_wait,accept4,read -f</code> against a small server and watch the loop pull ready fds. The abstraction becomes concrete in 5 minutes.` },
        { id: "s2", type: "hint", label: `💡 Your async runtime = non-blocking syscalls + an event loop presenting an async API. That's why "async" and "threads" aren't opposites — async is <i>how</i> a few threads serve many connections.` },
      ],
    },
    {
      id: "d45", date: "2027-01-03", week: "w15", title: "A transaction's life & EIP-1559 fees",
      theme: "Blockchain · part 4 — base fee burned, tip to the proposer.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 30,
          lead: `<b>Blockchain ④</b> — from signed bytes to state change, and how fees are set. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read <i>Mastering Ethereum</i> <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_6.md" target="_blank" rel="noopener">Ch 6 "Transactions"</a> — the fields, RLP encoding, and the signature.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Calldata is priced per byte (cheap-ish) while <code>SSTORE</code> is expensive — exactly why rollups post compressed calldata/blobs to L1 instead of storage. Ties your gas intuition to why L2s are cheaper.` },
        { id: "s2", type: "hint", label: `💡 The nonce is per-account and strictly sequential — it's what prevents replay and enforces ordering of your own txs. A stuck low-nonce tx blocks all higher ones ("nonce gap").` },
      ],
    },

    /* ---------------- Week 16 ---------------- */
    {
      id: "d46", date: "2027-01-06", week: "w16", title: "A transaction's life & EIP-1559 fees (cont.)",
      theme: "Finish “A transaction's life & EIP-1559 fees” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d45", obj: CHAIN, cat: "read", est: 70,
          lead: `<b>Blockchain ④</b> — from signed bytes to state change, and how fees are set. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Then <a href="https://eips.ethereum.org/EIPS/eip-1559" target="_blank" rel="noopener">EIP-1559</a> itself — base fee, tip, and the burn.` },
            { id: "s2", est: 20, label: `A tx carries nonce, gas fields, to/value/data, signature (RLP-encoded).` },
            { id: "s3", est: 25, label: `<b>EIP-1559</b>: blocks target 50% fullness (elasticity 2); the <b>base fee</b> adjusts ≤12.5%/block and is <b>burned</b>; a <b>tip</b> goes to the proposer.` },
          ],
          model: `Cite the invariants — <b>elasticity 2</b> (50% target) and <b>max ±12.5%/block</b> base-fee change — NOT "15M/30M gas" (historical mainnet values, not protocol constants). A type-2 tx sets <code>max_fee</code> + <code>max_priority_fee</code> and is refunded the difference.`,
          cards: [
            { q: `EIP-1559 base fee — the protocol invariants (not 15M/30M)?`, a: `Elasticity 2 (blocks target 50% full); base fee changes ≤ ±12.5%/block and is <b>burned</b>; a <b>tip</b> goes to the proposer.` },
            { q: `What does the account nonce do?`, a: `Per-account, strictly sequential — prevents replay and orders your txs. A stuck low-nonce tx blocks all higher ones ("nonce gap").` },
          ] },
      ],
    },
    {
      id: "d47", date: "2027-01-11", week: "w16", title: "Kafka's model: partitions, offsets, consumer groups, ISR",
      theme: "Messaging · part 2 — the unit of parallelism is the partition.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 65,
          lead: `<b>Messaging ②</b> — Kafka's core model and durability knobs. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read <i>Kafka: The Definitive Guide</i> (2nd ed, <a href="https://www.confluent.io/resources/kafka-the-definitive-guide-v2/" target="_blank" rel="noopener">free from Confluent</a>) <b>Ch 1</b> — the log, the broker, the vocabulary.` },
            { id: "s2", est: 35, label: "Then <i>Kafka: The Definitive Guide</i>’s <b>internals</b> chapter — the controller, replication, and how a request is handled." },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ More consumers than partitions = idle consumers (nothing to assign). Partition count is your parallelism ceiling and is painful to change later — size it deliberately.` },
        { id: "s2", type: "hint", label: `💡 "Kafka is a database you tail": consumers store their own offset, so two independent services read the same topic at their own pace and can replay from offset 0.` },
      ],
    },
    {
      id: "d48", date: "2027-01-12", week: "w16", title: "Kafka's model: partitions, offsets, consumer groups, ISR (cont.)",
      theme: "Finish “Kafka's model: partitions, offsets, consumer groups, ISR” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d47", obj: MSG, cat: "read", est: 85,
          lead: `<b>Messaging ②</b> — Kafka's core model and durability knobs. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: "Then <i>Kafka: The Definitive Guide</i>’s <b>reliable data delivery</b> chapter — acks, in-sync replicas, and what each setting costs." },
            { id: "s2", est: 25, label: `A <b>topic</b> splits into <b>partitions</b> (parallelism + ordering); each record has a monotonic <b>offset</b>; a <b>consumer group</b> assigns each partition to exactly one member (parallelism ≤ partition count).` },
            { id: "s3", est: 25, label: `Durability: replicas (leader + followers); <b>ISR</b> = replicas caught up to the leader. <code>acks=all</code> + <code>min.insync.replicas=2</code> ⇒ durable once all ISR have it.` },
          ],
          model: `Ordering is guaranteed only <i>within a partition</i>. For per-entity order (all events for one user/market in order), key by that entity so they land in the same partition.`,
          cards: [
            { q: `Kafka's unit of parallelism and ordering?`, a: `The <b>partition</b>. Ordering holds only <i>within</i> a partition; a consumer group assigns each partition to exactly one member.` },
            { q: `<code>acks=all</code> + <code>min.insync.replicas=2</code> gives you what?`, a: `A write is durable once all <b>in-sync replicas (ISR)</b> have it.` },
          ] },
      ],
    },

    /* ---------------- Week 17 ---------------- */
    {
      id: "d49", date: "2027-01-15", week: "w17", title: "Review: Rust ownership & the borrow checker",
      theme: "Review · a deliberate re-grounding in a hard model you already use.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 65,
          lead: `<b>Review</b> — re-derive the model under your Solana/Anchor work.`,
          sub: [
            { id: "s1", est: 25, label: `Re-read <i>The Rust Book</i> <a href="https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html" target="_blank" rel="noopener">Ch 4 "Understanding Ownership"</a> (move/borrow/lifetimes).` },
            { id: "s2", cat: "exercise", est: 20, label: `Without looking, explain aloud: why can't a <code>&mut</code> coexist with any other borrow? What does a lifetime annotation actually constrain?` },
            { id: "s3", cat: "exercise", est: 20, label: `Write three snippets that <i>fail</i> to compile and predict the exact borrow-checker error before running.` },
          ],
          model: `Ownership makes "who frees this and when" a <b>compile-time</b> fact; the borrow checker enforces "many readers XOR one writer" → no data race, no use-after-free. Everything else (lifetimes, <code>&mut</code>) serves that.`,
          cards: [
            { q: `What does ownership make a compile-time fact?`, a: `Who frees this and when. The borrow checker enforces "many readers XOR one writer" → no data race, no use-after-free.` },
            { q: `Rust's borrow rule vs a <code>RwLock</code>?`, a: `Same invariant (many readers XOR one writer); Rust checks it at <i>compile</i> time for references, a RwLock at <i>runtime</i>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Review tasks recur occasionally (Rust here; C++ threads, Go's scheduler, Python's GIL later) — short, forced re-derivations of hard concepts in languages you already ship.` },
        { id: "s2", type: "hint", label: `💡 The "many readers XOR one writer" rule is the same invariant a RwLock enforces at runtime — Rust just checks it at compile time for references. Same idea, zero cost.` },
      ],
    },
    {
      id: "d50", date: "2027-01-16", week: "w17", title: "Cache patterns, the stampede & invalidation",
      theme: "Caching · part 2 — the hard part isn't caching, it's invalidating.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 90,
          lead: `<b>Caching ②</b> — patterns, persistence, and surviving a hot-key expiry.`,
          sub: [
            { id: "s1", est: 25, label: `Read the AWS <a href="https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html" target="_blank" rel="noopener">caching patterns</a> whitepaper page — cache-aside vs write-through vs write-behind.` },
            { id: "s2", est: 30, label: `Then the Redis <a href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">eviction</a> and <a href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">persistence (RDB/AOF)</a> pages — what a cache drops, and what it keeps across a restart.` },
            { id: "s3", est: 35, label: `Handle the <b>stampede/thundering herd</b> (hot key expires → thousands of misses hit the DB) with single-flight/request-coalescing, a per-key lock (<code>SET k v NX PX ttl</code>), stale-while-revalidate, and <b>TTL jitter</b>.`, info: `<p>A <b>cache stampede</b> (thundering herd / dogpile) happens when a hot key expires and, in the gap before it's repopulated, thousands of concurrent requests all miss and hammer the database at once — often knocking it over.</p>
<p>The defenses, roughly in order:</p>
<ul>
<li><b>Single-flight / request coalescing</b> — only the first miss recomputes; the rest await its result.</li>
<li><b>Per-key lock</b> (<code>SET key val NX PX ttl</code>) — one worker wins the right to rebuild.</li>
<li><b>Stale-while-revalidate</b> — serve the slightly-stale value while one request refreshes in the background.</li>
<li><b>TTL jitter</b> — randomize expiries so keys written together don't all expire on the same second.</li>
</ul>` },
          ],
          model: `Prefer <b>delete-on-write</b> over update to avoid caching a value a concurrent write races. Eviction: <code>allkeys-lru/lfu</code> for a pure cache, <code>volatile-*</code> when you mix cache + persistent keys (Redis uses <i>sampled</i>, not exact, LRU/LFU).`,
          cards: [
            { q: `How do you survive a cache stampede (hot key expiry)?`, a: `single-flight / request-coalescing, a per-key lock (<code>SET k v NX PX ttl</code>), stale-while-revalidate, and <b>TTL jitter</b>.` },
            { q: `delete-on-write vs update-the-cache?`, a: `Prefer <b>delete-on-write</b> — updating risks caching a value a concurrent write races.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 RDB (periodic fork+snapshot; can lose minutes) vs AOF (<code>appendfsync everysec</code> ≈ lose ≤1s). Run both. The fork uses copy-on-write — big instances spike memory during a save.` },
        { id: "s2", type: "hint", label: `💡 "Only two hard things… cache invalidation" — design keys so invalidation is a single <code>DEL</code> or a version-bump, never a scan.` },
      ],
    },

    /* ---------------- Week 18 ---------------- */
    {
      id: "d51", date: "2027-01-21", week: "w18", title: "Sealevel, PDAs & CPIs — Solana's parallel runtime",
      theme: "Blockchain · part 5 — why declaring accounts up front buys parallelism.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 60,
          lead: `<b>Blockchain ⑤</b> — the runtime, program addresses, and cross-program calls. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read Solana docs <a href="https://solana.com/docs/core/pda" target="_blank" rel="noopener">PDAs</a> + <a href="https://solana.com/docs/core/cpi" target="_blank" rel="noopener">CPIs</a> — program-owned addresses, and one program calling another.` },
            { id: "s2", est: 30, label: `Then <a href="https://solana.com/docs/core/fees/compute-budget" target="_blank" rel="noopener">Compute Budget</a> and the <a href="https://docs.anza.xyz/validator/runtime" target="_blank" rel="noopener">Sealevel runtime</a> — the budget an instruction gets, and how the runtime parallelizes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Currency note: Solana's classic consensus is PoH + Tower BFT, but a new design ("Alpenglow") is landing in 2026 — know Tower BFT as the deployed model, and that it's being superseded.` },
        { id: "s2", type: "hint", label: `💡 Priority fee = <code>compute_unit_price × compute_unit_limit</code>. Set a tight CU limit and a price to land in a congested block — the Solana analogue of an EIP-1559 tip.` },
      ],
    },
    {
      id: "d52", date: "2027-01-24", week: "w18", title: "Sealevel, PDAs & CPIs — Solana's parallel runtime (cont.)",
      theme: "Finish “Sealevel, PDAs & CPIs — Solana's parallel runtime” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d51", obj: CHAIN, cat: "read", est: 45,
          lead: `<b>Blockchain ⑤</b> — the runtime, program addresses, and cross-program calls. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Because every instruction declares the accounts it reads/writes, the runtime executes non-overlapping txs <b>in parallel</b> (writes serialized per account, reads parallel).` },
            { id: "s2", est: 20, label: `<b>PDAs</b> = deterministic off-curve program-owned addresses (signed via <code>invoke_signed</code>); <b>CPIs</b> = one program calling another; CU: 200K default/instr, 1.4M max/tx.` },
          ],
          model: `EVM↔SVM in one line: Ethereum executes txs <i>sequentially</i> (global state, implicit access); Solana executes them <i>in parallel</i> by forcing explicit account declarations. Everything odd about Solana dev flows from that trade.`,
          cards: [
            { q: `EVM vs SVM execution, in one line?`, a: `Ethereum executes txs <b>sequentially</b> (implicit access); Solana executes them <b>in parallel</b> by forcing explicit account declarations.` },
            { q: `What is a PDA?`, a: `A deterministic <b>off-curve</b>, program-owned address, signed via <code>invoke_signed</code> — no private key.` },
          ] },
      ],
    },
    {
      id: "d53", date: "2027-01-26", week: "w18", title: "Load & stress testing without fooling yourself",
      theme: "DevOps · part 8 — coordinated omission and the USE method.",
      tasks: [
        { id: "t1", obj: OPS, cat: "watch", est: 85,
          lead: `<b>DevOps ⑧</b> — why most load tests lie, and how to measure honestly. (1/2)`,
          sub: [
            { id: "s1", cat: "watch", est: 60, label: `Watch Gil Tene, <a href="https://www.youtube.com/watch?v=lJ8ydIuPFeU" target="_blank" rel="noopener">"How NOT to Measure Latency" (Strange Loop, ~43 min)</a> (coordinated omission ~33:50).` },
            { id: "s2", est: 25, label: `Read Brendan Gregg's <a href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">USE Method</a>: for each resource check Utilization, Saturation, Errors.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: run <code>k6</code> against a service with a p99 <code>threshold</code>; then add a 200ms stall to 1% of responses and watch p99 (not the average) catch it.` },
        { id: "s2", type: "hint", label: `💡 Capacity is about headroom, not a single number: high utilization with <i>no</i> saturation can be fine; <i>any</i> saturation (a growing queue/run-queue) usually means a real problem.` },
      ],
    },

    /* ---------------- Week 19 ---------------- */
    {
      id: "d54", date: "2027-01-27", week: "w19", title: "Consensus: PoW, longest chain & what 'finality' means",
      theme: "Blockchain · part 6 — agreement without a coordinator.",
      tasks: [
        { id: "t1", carried: "d53", obj: OPS, cat: "watch", est: 25,
          lead: `<b>DevOps ⑧</b> — why most load tests lie, and how to measure honestly. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Tool axis: <code>ab</code>/<code>wrk</code> are closed-loop (throughput-driven, prone to CO); <code>vegeta</code>/<code>k6</code> can hold a fixed arrival rate (open-loop).` },
          ],
          model: `<b>Coordinated omission</b>: a load tool that waits for a slow response before sending the next request silently deletes the worst samples — making the tail look great when it's awful. Drive a <b>constant arrival rate</b> and report from full distributions (HdrHistogram), not averages.`,
          cards: [
            { q: `What is coordinated omission?`, a: `A load tool that waits for a slow response before sending the next request silently deletes the worst samples — making the tail look great when it's awful.` },
            { q: `How do you load-test honestly?`, a: `Drive a <b>constant arrival rate</b> (open-loop: vegeta/k6) and report from full distributions (HdrHistogram), not averages.` },
          ] },
        { id: "t2", obj: CHAIN, cat: "read", est: 35,
          lead: `<b>Blockchain ⑥</b> — how a decentralized network agrees on one history. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read <i>Mastering Bitcoin</i> (3rd ed) <a href="https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch12_mining.adoc" target="_blank" rel="noopener">Ch 12 "Mining and Consensus"</a> as far as difficulty retargeting — PoW and the puzzle itself.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 CAP-flavoured trade-off: a chain can't have instant finality, full availability, and permissionless decentralization at once — different chains pick different points. Beats memorizing any single algorithm.` },
        { id: "s2", type: "callout", label: `🔬 Solana's PoH gives a verifiable clock so validators needn't agree on time before ordering — a different answer to the same "who decides order" question.` },
      ],
    },
    {
      id: "d55", date: "2027-01-30", week: "w19", title: "Consensus: PoW, longest chain & what 'finality' means (cont.)",
      theme: "Finish “Consensus: PoW, longest chain & what 'finality' means” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d54", obj: CHAIN, cat: "read", est: 80,
          lead: `<b>Blockchain ⑥</b> — how a decentralized network agrees on one history. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: "Finish Ch 12: assembling and validating a block, and why the best chain is the one with the most cumulative work." },
            { id: "s2", est: 25, label: `Read ethereum.org <a href="https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/gasper/" target="_blank" rel="noopener">Gasper</a> — Casper FFG finality + the LMD-GHOST fork choice.` },
            { id: "s3", est: 25, label: `Then Vitalik’s <a href="https://blog.ethereum.org/2016/05/09/on-settlement-finality" target="_blank" rel="noopener">"On Settlement Finality"</a> — what "final" can and cannot mean.` },
          ],
          model: `PoW finality is <b>probabilistic</b> (more confirmations = exponentially safer); PoS adds <b>economic finality</b> (revert costs slashed stake). Reorgs happen — "finality" is a spectrum, not a switch.`,
          cards: [
            { q: `PoW finality vs PoS finality?`, a: `PoW is <b>probabilistic</b> (more confirmations = exponentially safer); PoS adds <b>economic finality</b> (reverting costs slashed stake). Finality is a spectrum.` },
            { q: `What does Solana's PoH provide?`, a: `A <b>verifiable clock</b>, so validators needn't agree on time before ordering — a different answer to "who decides order".` },
          ] },
      ],
    },
    {
      id: "d56", date: "2027-02-01", week: "w19", title: "Password hashing, sessions vs tokens & TLS recap",
      theme: "Security · part 3 — store secrets like they'll be stolen.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 65,
          lead: `<b>Security ③</b> — credential storage and session design, done right.`,
          sub: [
            { id: "s1", est: 25, label: `Read the OWASP <a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener">Password Storage</a> + <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener">Session Management</a> cheat sheets.` },
            { id: "s2", est: 20, label: `Use <b>Argon2id</b> (min m=19 MiB, t=2, p=1) for new systems; <b>bcrypt</b> (cost ≥10) is legacy-only and caps input at 72 bytes.` },
            { id: "s3", est: 20, label: `Sessions vs tokens: server-side session ids in <code>Secure; HttpOnly; SameSite</code> cookies vs stateless JWTs — and never store tokens in <code>localStorage</code> (XSS reads it).`,
              info: `<p>Two ways to remember a logged-in user:</p>
<ul>
<li><b>Server-side sessions</b> — the server stores the state and hands the browser an opaque <b>session id</b> in a cookie. Easy to revoke (delete the record); needs session storage shared across your servers.</li>
<li><b>Stateless JWTs</b> — the token carries signed claims, so any server verifies it with no lookup. Scales trivially, but is <b>hard to revoke</b> before expiry (you need a denylist) → keep them short-lived and pair with refresh tokens.</li>
</ul>
<p>Either way, put it in a <code>Secure; HttpOnly; SameSite</code> cookie. <b>Never</b> store a token in <code>localStorage</code>: any XSS on the page can read it and walk off with the session.</p>` },
          ],
          model: `Passwords are <b>hashed</b> (one-way, slow, salted) — not encrypted, never home-rolled. "Slow" is the point: it caps an attacker's guesses/sec. Fast hashes (SHA-256) are wrong for passwords.`,
          cards: [
            { q: `Why hash passwords with a <i>slow</i> function (Argon2id/bcrypt)?`, a: `"Slow" caps an attacker's guesses/sec. Hashed = one-way, salted, never encrypted. Fast hashes (SHA-256) are wrong for passwords.` },
            { q: `Why are JWTs in <code>localStorage</code> worse than a cookie session?`, a: `XSS can read <code>localStorage</code>; an <code>HttpOnly</code> cookie can't be read by JS. Use <code>Secure; HttpOnly; SameSite</code>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Callback to the TLS day: the same PKI trust chain protects these credentials in transit; hashing protects them at rest. Both, always.` },
        { id: "s2", type: "hint", label: `💡 <code>SameSite=Lax/Strict</code> cookies are your cheapest CSRF defense; <code>HttpOnly</code> keeps JS (and XSS) from reading the session — which is exactly why JWTs in localStorage are worse, not better.` },
      ],
    },

    /* ---------------- Week 20 ---------------- */
    {
      id: "d57", date: "2027-02-04", week: "w20", title: "🎓 Capstone: smart-contract security — reentrancy & oracle manipulation",
      theme: "Security · part 4 — the two bug classes that drain DeFi, in your domain.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 80,
          lead: `<b>Security ④ (capstone)</b> — the vulnerabilities most relevant to your FPMM/LMSR market. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read the Solidity docs <a href="https://docs.soliditylang.org/en/latest/security-considerations.html" target="_blank" rel="noopener">Security Considerations</a> — checks-effects-interactions, and the rest of the list.` },
            { id: "s2", est: 25, label: `Then samczsun’s <a href="https://samczsun.com/so-you-want-to-use-a-price-oracle/" target="_blank" rel="noopener">"So you want to use a price oracle"</a> — a tour of how each naive price source gets drained.` },
            { id: "s3", est: 30, label: `<b>Reentrancy</b>: any external call hands control to the callee <i>before</i> your state settles → do Checks → Effects → <b>Interactions last</b>, or use a <code>nonReentrant</code> mutex; beware read-only reentrancy (a view returns wrong data mid-write — the Curve case).`, info: `<p><b>The mechanism:</b> when your contract calls out (sends ETH, calls another contract), that callee runs <i>immediately</i> — and it can call back into you before your first function finished. If you send funds <i>before</i> zeroing the balance, the attacker re-enters while the stale balance is still on the books and drains you in a loop. This is exactly the 2016 <b>DAO hack</b> (~$60M), the reason Ethereum forked.</p>
<p><b>The fix — Checks-Effects-Interactions:</b></p>
<ol>
<li><b>Checks</b> — validate inputs and <code>require()</code>s.</li>
<li><b>Effects</b> — write <i>all</i> your state now (zero the balance).</li>
<li><b>Interactions</b> — only then make the external call.</li>
</ol>
<p>A re-entrant call then sees finalized state, so the loop can't profit. OZ's <code>ReentrancyGuard</code> (<code>nonReentrant</code>) is a belt-and-braces storage flag that reverts on re-entry. <b>Read-only reentrancy</b> is the subtle cousin: a <code>view</code> reads half-updated state and hands a wrong value to a second protocol that trusts it — the Curve/Vyper incident.</p>` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🏁 Core complete — and the <b>extension</b> continues right below (weeks 20–39): every thread picks up in order and goes <i>deeper under the hood</i> — Raft/CAP/quorums, VACUUM/TOAST/joins/LSM, rollups/blobs/MEV/ZK, io_uring/page cache, and Go/Python/C++/Rust runtime reviews.` },
        { id: "s2", type: "hint", label: `💡 The through-line of the whole security thread: never trust input you didn't verify — an <code>alg</code> header, a spot price, or the timing of an external call are all "input". Verify, then act.` },
      ],
      note: "🎓 12-week core finished — the essentials a backend/blockchain engineer is expected to own.",
    },
    /* ================================================================== *
     *  EXTENSION — "deepen your knowledge": the under-the-hood internals.
     *  Every core thread continues in order (Networking ⑧→, Databases ⑥→,
     *  Blockchain ⑦→, Systems ④→, …) and a NEW thread — Distributed systems —
     *  starts here. Same interleaving rule: consecutive side-days switch
     *  topics; a thread advances when it reappears. References verified
     *  2026-07-18 with status flags for fast-moving items (chains, Kafka,
     *  Python free-threading). Dates 2027-02-09 → 2027-06-20.
     * ================================================================== */
    {
      id: "d58", date: "2027-02-09", week: "w20", title: "Consensus I: Raft — leader election & log replication",
      theme: "Distributed systems · part 1 — one strong leader makes agreement tractable.",
      tasks: [
        { id: "t1", carried: "d57", obj: SEC, cat: "read", est: 25,
          lead: `<b>Security ④ (capstone)</b> — the vulnerabilities most relevant to your FPMM/LMSR market. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `<b>Oracle manipulation</b>: on-chain spot prices are attacker-controllable within a tx (flash loans) → use TWAPs / robust feeds.` },
          ],
          model: `Checks-Effects-Interactions in one line: validate, then write ALL state, then make external calls — so a re-entrant call always sees finalized state. OZ <code>ReentrancyGuard</code> is a storage flag that reverts on re-entry.`,
          cards: [
            { q: `Checks-Effects-Interactions in one line?`, a: `Validate, then write ALL state, then make external calls <b>last</b> — so a re-entrant call always sees finalized state.` },
            { q: `Why are on-chain spot prices dangerous as an oracle?`, a: `They're attacker-controllable within a tx via <b>flash loans</b> → use TWAPs / robust feeds.` },
          ] },
        { id: "t2", obj: DIST, cat: "read", est: 40,
          lead: `<b>Distributed systems ①</b> — how a cluster agrees on one log despite crashes. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read the Raft paper (Extended Version) <a href="https://raft.github.io/raft.pdf" target="_blank" rel="noopener">"In Search of an Understandable Consensus Algorithm"</a> (Ongaro & Ousterhout) §5.1–§5.3 — leader election and log replication.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 New thread: <b>Distributed systems</b> — the theory (consensus, clocks, CAP, transactions) beneath every database, queue and chain you studied. It starts here and advances in order.` },
        { id: "s2", type: "hint", label: `💡 etcd (hence Kubernetes), Consul and CockroachDB run Raft. The k8s "single source of truth" from d10 is a Raft log under the hood.` },
      ],
      note: "Extension begins — the same 2–3 days/week rhythm, now going under the hood. Threads resume where the core left them.",
    },

    /* ---------------- Week 21 ---------------- */
    {
      id: "d59", date: "2027-02-13", week: "w21", title: "Consensus I: Raft — leader election & log replication (cont.)",
      theme: "Finish “Consensus I: Raft — leader election & log replication” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d58", obj: DIST, cat: "read", est: 65,
          lead: `<b>Distributed systems ①</b> — how a cluster agrees on one log despite crashes. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: "Finish §5 of the Raft paper: safety (the election restriction), follower/candidate crashes, and timing." },
            { id: "s2", cat: "watch", est: 30, label: `Watch it happen: <a href="https://thesecretlivesofdata.com/raft/" target="_blank" rel="noopener">The Secret Lives of Data</a> animates election + replication step by step.` },
          ],
          model: `A single elected <b>leader</b> forces all entries to flow leader→followers, so there are never conflicting logs to reconcile. Raft tolerates <b>crash</b> (fail-stop) faults only and needs <b>2f+1</b> nodes to survive f failures.`,
          cards: [
            { q: `Why is Raft easier to reason about than Paxos?`, a: `One strong <b>leader</b> forces all log entries to flow leader→followers — there are never conflicting flows to reconcile.` },
            { q: `How many nodes to tolerate f failures, and which fault type?`, a: `<b>2f+1</b>, and only <b>crash</b> (fail-stop) faults — nodes stop, they never lie.` },
          ] },
      ],
    },
    {
      id: "d60", date: "2027-02-14", week: "w21", title: "VACUUM, autovacuum & the xmin horizon",
      theme: "Databases · part 6 — why one idle transaction can bloat the whole cluster.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 90,
          lead: `<b>Databases ⑥</b> — the machinery that cleans up MVCC's dead tuples (callback to d22).`,
          sub: [
            { id: "s1", est: 50, label: `Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/routine-vacuuming.html" target="_blank" rel="noopener">"Routine Vacuuming"</a> (dead tuples, the autovacuum daemon, transaction-ID wraparound).` },
            { id: "s2", est: 40, label: `Deeper: Egor Rogov, <a href="https://postgrespro.com/blog/pgsql/5967918" target="_blank" rel="noopener">"MVCC in PostgreSQL — 6. Vacuum"</a>.` },
          ],
          model: `A dead tuple is removable only once it's older than the <b>xmin horizon</b> — the oldest xmin any live snapshot could still see. One long-running/idle-in-transaction txn, an abandoned replication slot, or an orphaned prepared txn pins that horizon back and blocks VACUUM from cleaning <i>any</i> newer dead tuples.`,
          cards: [
            { q: `What blocks VACUUM from reclaiming dead tuples cluster-wide?`, a: `Anything pinning the <b>xmin horizon</b> back: a long-running/idle-in-transaction txn, an abandoned replication slot, or an orphaned prepared transaction.` },
            { q: `Besides space, what disaster does autovacuum prevent?`, a: `<b>Transaction-ID wraparound</b> — it freezes old tuples before the 32-bit XID counter wraps.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d22: <code>UPDATE</code> = new version + dead old one. VACUUM is the janitor; the xmin horizon is why "just one idle txn" bloats everything.` },
        { id: "s2", type: "callout", label: `⚠️ <b>Idle in transaction</b> is the silent killer — a connection that <code>BEGIN</code>s and forgets to commit holds the horizon. Set <code>idle_in_transaction_session_timeout</code>.` },
      ],
    },
    {
      id: "d61", date: "2027-02-15", week: "w21", title: "Virtual memory: page tables & the TLB",
      theme: "Systems · part 4 — every memory access is secretly two accesses.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 40,
          lead: `<b>Systems ④</b> — how each process gets its own private address space, and why it's fast. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read OSTEP (free) <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf" target="_blank" rel="noopener">Ch 18 "Paging: Introduction"</a> — page tables, and why the naive version is too slow.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Huge pages (2 MB/1 GB) exist to cut TLB misses — fewer, larger entries cover more memory. Databases and JVMs enable them for exactly this.` },
        { id: "s2", type: "callout", label: `🔬 This is the "virtual memory" you skimmed at d12 — now the internals. Next Systems day: the page cache, where files live in that memory.` },
      ],
    },

    /* ---------------- Week 22 ---------------- */
    {
      id: "d62", date: "2027-02-18", week: "w22", title: "Virtual memory: page tables & the TLB (cont.)",
      theme: "Finish “Virtual memory: page tables & the TLB” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d61", obj: SYS, cat: "read", est: 75,
          lead: `<b>Systems ④</b> — how each process gets its own private address space, and why it's fast. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `Then <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf" target="_blank" rel="noopener">Ch 19 "Paging: Faster Translations (TLBs)"</a> — the cache that makes paging affordable.` },
            { id: "s2", est: 40, label: `The abstraction: <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf" target="_blank" rel="noopener">Ch 13 "The Abstraction: Address Spaces"</a>.` },
          ],
          model: `Paging turns every virtual reference into an extra memory lookup — the <b>page-table walk</b>. The <b>TLB</b> is a small MMU cache of recent virtual-page→physical-frame translations, so a hit makes translation nearly free and only a miss pays the walk. TLB hit rate, not the table shape, governs paging performance.`,
          cards: [
            { q: `What does the page-table walk cost, and what hides it?`, a: `Every virtual access needs a translation (an extra memory lookup); the <b>TLB</b> caches recent translations so a hit makes it nearly free.` },
            { q: `After a context switch, why can memory feel slow?`, a: `The TLB (and caches) are cold/flushed — the indirect cost of a switch, met back at d12.` },
          ] },
      ],
    },
    {
      id: "d63", date: "2027-02-19", week: "w22", title: "Rollups: optimistic vs ZK — when do you pay for trust?",
      theme: "Blockchain · part 7 — both post to L1; they differ in how they prove correctness.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 30,
          lead: `<b>Blockchain ⑦</b> — how L2s inherit L1 security, and the core trade-off. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read ethereum.org <a href="https://ethereum.org/en/developers/docs/scaling/" target="_blank" rel="noopener">Scaling</a> — the rollup model: execute off-chain, settle on L1.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d45: rollups post compressed data to L1 — exactly what the next Blockchain day (d72, blobs / EIP-4844) made cheap.` },
        { id: "s2", type: "hint", label: `💡 "Validity" (proven up front) vs "fraud" (disproven later) proofs — that one word is the whole distinction interviewers probe.` },
      ],
    },
    {
      id: "d64", date: "2027-02-23", week: "w22", title: "Rollups: optimistic vs ZK — when do you pay for trust? (cont.)",
      theme: "Finish “Rollups: optimistic vs ZK — when do you pay for trust?” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d63", obj: CHAIN, cat: "read", est: 75,
          lead: `<b>Blockchain ⑦</b> — how L2s inherit L1 security, and the core trade-off. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: "Then the same page’s optimistic-vs-ZK sections — fraud proofs (and their challenge window) vs validity proofs." },
            { id: "s2", est: 45, label: `Check real maturity on <a href="https://l2beat.com/scaling/summary" target="_blank" rel="noopener">L2BEAT</a> (Stage 0–2) — many "optimistic" rollups still run permissioned fraud proofs / council overrides.` },
          ],
          model: `The trade is <i>when</i> you pay for trust. <b>Optimistic</b> assumes validity, allows a <b>fraud proof</b> in a challenge window (~7-day withdrawals, needs one honest watcher). <b>ZK</b> submits a <b>validity proof</b> every batch — finality in minutes, no honest-watcher assumption, heavier proving.`,
          cards: [
            { q: `Optimistic vs ZK rollup — the core difference?`, a: `Optimistic <i>assumes</i> validity + a fraud-proof challenge window (~7 days); ZK <i>proves</i> validity every batch (fast finality, no honest-watcher assumption).` },
            { q: `Is "optimistic" enough to call a rollup trustless?`, a: `No — check L2BEAT: many still run permissioned fraud proofs or council overrides (not yet Stage 2).` },
          ] },
      ],
    },

    /* ---------------- Week 23 ---------------- */
    {
      id: "d65", date: "2027-02-28", week: "w23", title: "BGP & Anycast: how the internet actually routes",
      theme: "Networking · part 8 — routing is policy and assertion, not shortest path.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 95,
          lead: `<b>Networking ⑧</b> — how ~100k networks find each other, and how one IP lives in many places.`,
          sub: [
            { id: "s1", est: 50, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/security/glossary/what-is-bgp/" target="_blank" rel="noopener">"What is BGP?"</a> (normative source: <a href="https://www.rfc-editor.org/info/rfc4271" target="_blank" rel="noopener">RFC 4271</a>).` },
            { id: "s2", est: 45, label: `Then <a href="https://www.cloudflare.com/learning/cdn/glossary/anycast-network/" target="_blank" rel="noopener">"What is Anycast?"</a> — anycast is just BGP announcing one prefix from many sites.` },
          ],
          model: `BGP is a <b>path-vector</b> protocol: each Autonomous System advertises prefixes with the full <b>AS-path</b>, and routers pick largely by <i>policy</i> (business relationships), not physical distance. A route's legitimacy is <b>asserted, not proven</b> — hence hijacks, mitigated by RPKI/ROV.`,
          cards: [
            { q: `How does BGP choose a route?`, a: `Path-vector: mostly by <b>policy</b> (local pref, business relationships) then shorter AS-path — <i>not</i> shortest physical distance.` },
            { q: `What is Anycast, mechanically?`, a: `BGP doing its job — the <i>same</i> IP prefix announced from many sites, so each client reaches the topologically nearest instance (CDNs, the 13 DNS roots).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ BGP has no built-in auth — a false advertisement propagates as a hijack. <b>RPKI / Route Origin Validation</b> is the standard 2026 mitigation.` },
        { id: "s2", type: "hint", label: `💡 "13 root servers" = 13 IPs/letters, each served by hundreds of anycast nodes — not 13 machines.` },
      ],
    },
    {
      id: "d66", date: "2027-03-01", week: "w23", title: "Kafka exactly-once: idempotent producer + transactions",
      theme: "Messaging · part 3 — 'exactly-once' is at-least-once + dedupe, done right.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 65,
          lead: `<b>Messaging ③</b> — what actually makes Kafka exactly-once, and its limits. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read Confluent <a href="https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/" target="_blank" rel="noopener">"Exactly-Once Semantics… Here's How Kafka Does It"</a> — the idempotent producer half.` },
            { id: "s2", est: 30, label: `Finish it (the transactions half), checking the spec where it matters: <a href="https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging" target="_blank" rel="noopener">KIP-98</a>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 Idempotence is <b>on by default</b> since Kafka 3.0. In Kafka Streams use <code>processing.guarantee=exactly_once_v2</code> — the old <code>exactly_once</code> was removed.` },
        { id: "s2", type: "hint", label: `💡 Callback to d35: "exactly-once" delivery over a network is impossible; what you get is at-least-once + idempotent dedupe. Same lesson, protocol-enforced.` },
      ],
    },
    {
      id: "d67", date: "2027-03-02", week: "w23", title: "Kafka exactly-once: idempotent producer + transactions (cont.)",
      theme: "Finish “Kafka exactly-once: idempotent producer + transactions” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d66", obj: MSG, cat: "read", est: 35,
          lead: `<b>Messaging ③</b> — what actually makes Kafka exactly-once, and its limits. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `Note the scope: idempotence dedupes <i>within one partition + producer session</i>; cross-partition atomicity needs the transactions API + consumers at <code>isolation.level=read_committed</code>.` },
          ],
          model: `The <b>idempotent producer</b> stamps each batch with a producer ID + monotonic per-partition sequence; the broker rejects a batch whose sequence isn't exactly +1 — killing retry duplicates. <b>Transactions</b> (<code>transactional.id</code>) add multi-partition atomic read-process-write.`,
          cards: [
            { q: `What does Kafka's idempotent producer guarantee?`, a: `No duplicates from retries — but only <i>within one partition and one producer session</i> (PID + monotonic sequence; broker rejects non-+1).` },
            { q: `How do you get exactly-once across partitions?`, a: `The transactions API (<code>transactional.id</code>) + consumers at <code>isolation.level=read_committed</code>.` },
          ] },
      ],
    },

    /* ---------------- Week 24 ---------------- */
    {
      id: "d68", date: "2027-03-04", week: "w24", title: "Consensus II: Paxos vs Raft, and Byzantine faults (PBFT)",
      theme: "Distributed systems · part 2 — from 'nodes crash' to 'nodes lie'.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 65,
          lead: `<b>Distributed systems ②</b> — the classic Paxos, and what changes when nodes are malicious. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Skim Lamport, <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf" target="_blank" rel="noopener">"Paxos Made Simple"</a> — prepare/promise → accept, and majority quorums.` },
            { id: "s2", est: 25, label: `Then the Raft paper’s "What’s wrong with Paxos?" section — the same problem, argued from the other side.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Callback to d54: a blockchain is BFT consensus among untrusting parties — PBFT is where that lineage starts (Tendermint, HotStuff descend from it).` },
        { id: "s2", type: "hint", label: `💡 "Understandable" is a design goal, not fluff — Raft was literally user-tested against Paxos. Simplicity that ships correct systems is a feature.` },
      ],
    },
    {
      id: "d69", date: "2027-03-05", week: "w24", title: "TOAST & HOT updates: storage internals that bite",
      theme: "Databases · part 7 — 8 KB pages, big values, and cheap updates.",
      tasks: [
        { id: "t1", carried: "d68", obj: DIST, cat: "read", est: 45,
          lead: `<b>Distributed systems ②</b> — the classic Paxos, and what changes when nodes are malicious. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `For Byzantine faults: Castro & Liskov, <a href="http://pmg.csail.mit.edu/papers/osdi99.pdf" target="_blank" rel="noopener">"Practical Byzantine Fault Tolerance"</a> (OSDI '99).` },
          ],
          model: `Paxos decides <i>what</i> is safe but gives no operational leader/log — the gap Raft fills. <b>PBFT</b> tolerates <b>Byzantine</b> (lying) faults with <b>3f+1</b> replicas and a 3-phase exchange (pre-prepare → prepare → commit) — the ancestor of blockchain BFT.`,
          cards: [
            { q: `Crash-fault vs Byzantine-fault: node counts?`, a: `Crash (Raft/Paxos): <b>2f+1</b>. Byzantine/lying (PBFT): <b>3f+1</b> + a 3-phase exchange.` },
            { q: `What does Paxos leave unspecified that Raft nails down?`, a: `An operational <b>leader + log structure</b> — Paxos says what's safe to decide, not how to run it.` },
          ] },
        { id: "t2", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ⑦</b> — where oversized values go, and how to keep updates cheap. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/storage-toast.html" target="_blank" rel="noopener">"TOAST"</a> — where an oversized value actually goes.` },
            { id: "s2", est: 25, label: `Then <a href="https://www.postgresql.org/docs/current/storage-hot.html" target="_blank" rel="noopener">"Heap-Only Tuples (HOT)"</a> — the update that skips the indexes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Frequent-update table? Lower <code>fillfactor</code> (e.g. 80) so updates stay HOT — a one-line fix for chronic bloat + index churn.` },
        { id: "s2", type: "callout", label: `🔬 BRIN (summarizing) indexes are the exception: an update can be HOT even if it touches a BRIN-indexed column.` },
      ],
    },
    {
      id: "d70", date: "2027-03-06", week: "w24", title: "TOAST & HOT updates: storage internals that bite (cont.)",
      theme: "Finish “TOAST & HOT updates: storage internals that bite” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d69", obj: DATA, cat: "read", est: 45,
          lead: `<b>Databases ⑦</b> — where oversized values go, and how to keep updates cheap. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Companion: Egor Rogov, <a href="https://postgrespro.com/blog/pgsql/5967910" target="_blank" rel="noopener">"MVCC — 5. In-page vacuum and HOT updates"</a>.` },
          ],
          model: `Pages are 8 KB and tuples can't span pages, so values over ~2 KB are compressed/stored out-of-line in a <b>TOAST</b> table. A <b>HOT</b> update (no indexed column changed + free space on the same page) skips new index entries — a lower <code>fillfactor</code> reserves that space, avoiding index write-amplification and bloat.`,
          cards: [
            { q: `When does a Postgres UPDATE stay HOT (no index writes)?`, a: `When no indexed column changes <b>and</b> the new tuple fits on the same page — a lower <code>fillfactor</code> reserves that room.` },
            { q: `What is TOAST for?`, a: `Storing column values too big for the 8 KB page — compressed and/or split out-of-line (EXTENDED is the default; LZ4 selectable since PG 14).` },
          ] },
      ],
    },

    /* ---------------- Week 25 ---------------- */
    {
      id: "d71", date: "2027-03-10", week: "w25", title: "Service mesh, mTLS & workload identity (SPIFFE)",
      theme: "DevOps · part 9 — who a service IS, proved cryptographically, auto-rotated.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 85,
          lead: `<b>DevOps ⑨</b> — how zero-trust replaces shared secrets with attested identities.`,
          sub: [
            { id: "s1", est: 25, label: `Read the <a href="https://spiffe.io/docs/latest/spiffe-about/overview/" target="_blank" rel="noopener">SPIFFE overview</a> — a workload identity (<code>spiffe://…</code>) instead of a shared secret.` },
            { id: "s2", est: 25, label: `Then <a href="https://spiffe.io/docs/latest/deploying/svids/" target="_blank" rel="noopener">SVIDs</a> — that identity as a short-lived, auto-rotated cert.` },
            { id: "s3", est: 35, label: `Context: <a href="https://www.redhat.com/en/topics/security/spiffe-and-spire" target="_blank" rel="noopener">SPIFFE/SPIRE intro</a>; a mesh (Istio/Envoy, Cilium) issues these to sidecars for automatic mTLS.` },
          ],
          model: `Zero-trust identity replaces long-lived API keys with <b>short-lived, auto-rotated, attested</b> SVIDs. An X.509-SVID carries the SPIFFE ID in its SAN and plugs straight into <b>mTLS</b>, so service-to-service auth proves <i>what a workload is</i> (verified at runtime), not where it sits.`,
          cards: [
            { q: `What does zero-trust service identity replace, and with what?`, a: `Long-lived shared secrets/API keys → short-lived, auto-rotated, <b>attested</b> cryptographic identities (SVIDs).` },
            { q: `What is mTLS?`, a: `Mutual TLS — <i>both</i> sides present certs, so client and server authenticate each other (not just the server).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ The whole model rests on the <b>attestation policy</b> being strict — weak attestation means any pod can claim any identity.` },
        { id: "s2", type: "hint", label: `💡 Callback to d21/d37: the same TLS/PKI machinery, now pointed <i>inward</i> — every hop authenticated, certs rotated by the platform.` },
      ],
    },
    {
      id: "d72", date: "2027-03-16", week: "w25", title: "Data availability & EIP-4844 blobs",
      theme: "Blockchain · part 8 — why L2 fees fell 10–100× in 2024.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 85,
          lead: `<b>Blockchain ⑧</b> — the cheap, temporary data lane that made rollups affordable.`,
          sub: [
            { id: "s1", est: 30, label: `Read <a href="https://eips.ethereum.org/EIPS/eip-4844" target="_blank" rel="noopener">EIP-4844</a> — blob-carrying transactions and the separate blob-gas market.` },
            { id: "s2", est: 25, label: `Then the explainer <a href="https://www.eip4844.com/" target="_blank" rel="noopener">eip4844.com</a> — the same design with the diagrams.` },
            { id: "s3", est: 30, label: `Concept: ethereum.org <a href="https://ethereum.org/en/developers/docs/data-availability/" target="_blank" rel="noopener">Data availability</a>.` },
          ],
          model: `Blobs (~128 KB) attach to a tx, are priced in a <b>separate blob-gas market</b>, and are pruned after ~18 days — L2s only need data available long enough to reconstruct/challenge, not forever. This decouples L2 data-posting cost from L1 execution congestion.`,
          cards: [
            { q: `What did EIP-4844 blobs change for L2s?`, a: `A separate cheap blob-gas market + ~18-day pruning decoupled L2 data cost from L1 execution gas — cutting fees ~10–100×.` },
            { q: `Why can blobs be deleted after ~18 days?`, a: `Data only needs to be <i>available</i> long enough for anyone to reconstruct/challenge it — not stored forever (unlike calldata).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 LIVE since the Dencun fork (13 Mar 2024). It's <b>proto</b>-danksharding — full danksharding (DAS, more blobs) arrives incrementally; per-block blob targets have been raised since, so don't memorize a fixed count.` },
        { id: "s2", type: "hint", label: `💡 "Data availability" = can everyone GET the data to verify?, distinct from "storage". A rollup's security rests on DA — which is why blobs matter.` },
      ],
    },

    /* ---------------- Week 26 ---------------- */
    {
      id: "d73", date: "2027-03-20", week: "w26", title: "Review: Go's scheduler (G-M-P) & async preemption",
      theme: "Review · re-derive the runtime under every goroutine you spawn.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 65,
          lead: `<b>Review</b> — how Go runs millions of goroutines on a handful of threads.`,
          sub: [
            { id: "s1", est: 35, label: `Re-read the shipped behaviour: <a href="https://go.dev/doc/go1.14" target="_blank" rel="noopener">Go 1.14 release notes</a> (async preemption) + the <a href="https://github.com/golang/proposal/blob/master/design/24543-non-cooperative-preemption.md" target="_blank" rel="noopener">preemption proposal</a> for the why.` },
            { id: "s2", cat: "exercise", est: 30, label: `Without looking, explain aloud: what are G, M and P? What happens to other goroutines when one makes a blocking syscall?` },
          ],
          model: `<b>G</b> = goroutine, <b>M</b> = OS thread, <b>P</b> = logical processor (scheduling context, GOMAXPROCS of them). Since Go 1.14, goroutines are <b>asynchronously preemptible</b> (via SIGURG) — a tight loop with no function calls can still be preempted, so it no longer stalls the scheduler or GC.`,
          cards: [
            { q: `What are G, M and P in Go's scheduler?`, a: `G = goroutine, M = OS thread, P = logical processor / scheduling context (GOMAXPROCS of them). A G needs an M+P to run.` },
            { q: `What did async preemption (Go 1.14) fix?`, a: `A tight loop with no function calls could hog a thread forever; now the runtime signals (SIGURG) and preempts it, unblocking the scheduler and GC.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Review tasks re-derive hard models you already use (Rust at d49; Python's GIL, C++ memory, Rust async ahead).` },
        { id: "s2", type: "hint", label: `💡 Callback to d03/d44: the P is why "blocking" goroutines don't block the program — the netpoller parks the G and frees the M.` },
      ],
    },
    {
      id: "d74", date: "2027-03-22", week: "w26", title: "Redis Cluster & consistent hashing",
      theme: "Caching · part 3 — 16384 slots, and moving keys without moving all of them.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 95,
          lead: `<b>Caching ③</b> — how Redis shards keys, and the general technique behind it.`,
          sub: [
            { id: "s1", est: 30, label: `Read the Redis <a href="https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/" target="_blank" rel="noopener">Cluster spec</a> — the 16384 hash slots and how keys map onto them.` },
            { id: "s2", est: 30, label: "Finish the Cluster spec: gossip between nodes, and MOVED vs ASK redirects." },
            { id: "s3", est: 35, label: `The underlying idea: <a href="https://en.wikipedia.org/wiki/Consistent_hashing" target="_blank" rel="noopener">consistent hashing</a> (Karger et al., 1997) — resizing remaps only ~1/N of keys, not all of them.` },
          ],
          model: `A key's slot is <code>CRC16(key) mod 16384</code>; slots are spread across masters and clients are steered by <b>MOVED</b> (slot moved permanently) vs <b>ASK</b> (one-shot, mid-migration). Consistent hashing is why adding a node reshuffles ~1/N of keys, not everything (<code>mod N</code> would remap almost all).`,
          cards: [
            { q: `How does Redis Cluster place a key?`, a: `<code>CRC16(key) mod 16384</code> → a hash slot; slots are owned by masters, and clients follow <b>MOVED</b>/<b>ASK</b> redirects.` },
            { q: `Why consistent hashing over <code>hash(key) mod N</code>?`, a: `Changing N in modulo hashing remaps almost every key; consistent hashing moves only ~1/N (virtual nodes smooth the load).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <b>MOVED</b> = update your slot map (permanent); <b>ASK</b> = just this one key, this once (migration in flight). Smart clients cache the slot map.` },
        { id: "s2", type: "callout", label: `🔬 The same consistent-hashing trick sits under Cassandra, DynamoDB and CDN request routing — learn it once.` },
      ],
    },

    /* ---------------- Week 27 ---------------- */
    {
      id: "d75", date: "2027-03-24", week: "w27", title: "CAP done right — and PACELC",
      theme: "Distributed systems · part 3 — you don't 'choose' partition tolerance.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 95,
          lead: `<b>Distributed systems ③</b> — the theorem, minus the 'pick 2 of 3' myth.`,
          sub: [
            { id: "s1", est: 30, label: `Read Gilbert & Lynch, <a href="https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf" target="_blank" rel="noopener">"Perspectives on the CAP Theorem"</a> (2012) — CAP stated as a safety-vs-liveness trade.` },
            { id: "s2", est: 30, label: `Finish the paper: the proof sketch, and why "pick 2 of 3" is the part everyone forgets.` },
            { id: "s3", est: 35, label: `Then Abadi, <a href="https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf" target="_blank" rel="noopener">"Consistency Tradeoffs… (PACELC)"</a> — the everyday latency dimension CAP omits.` },
          ],
          model: `CAP constrains behaviour <i>only during a partition</i>, and partition tolerance isn't optional on a real network — so the honest statement is C-vs-A <b>when partitioned</b>. <b>PACELC</b>: if <b>P</b>artition → <b>A</b> or <b>C</b>; <b>E</b>lse (normal ops) → <b>L</b>atency or <b>C</b>onsistency.`,
          cards: [
            { q: `Why is "pick 2 of 3" the wrong way to read CAP?`, a: `Partition tolerance isn't a choice on a real network — CAP is really C-vs-A <i>during a partition</i>. The rest of the time it's silent.` },
            { q: `What does PACELC add to CAP?`, a: `The normal-operation trade CAP ignores: <b>E</b>lse (no partition) you still choose <b>L</b>atency vs <b>C</b>onsistency.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Reframe: CAP is one case of the general <b>safety vs liveness</b> impossibility under unreliable networks — the rigorous reading.` },
        { id: "s2", type: "callout", label: `🔬 Postgres sync replication picks C over L (slower commits); Dynamo-style stores pick L/A (stale reads). PACELC names the dial you meet at d91/d98.` },
      ],
    },
    {
      id: "d76", date: "2027-03-25", week: "w27", title: "Join algorithms & how the planner picks",
      theme: "Databases · part 8 — nested loop, hash, merge — and why it chose that.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 75,
          lead: `<b>Databases ⑧</b> — the three physical joins, and the cost model behind EXPLAIN (callback d14).`,
          sub: [
            { id: "s1", est: 40, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/planner-optimizer.html" target="_blank" rel="noopener">"Planner/Optimizer"</a> — the three joins and cost-based join-order search.` },
            { id: "s2", cat: "lab", est: 35, label: `Re-run <code>EXPLAIN (ANALYZE, BUFFERS)</code> on a 2–3 table join and name the join node it chose.` },
          ],
          model: `<b>Nested loop</b>: scan the right side once per left row (great with an index on the right, tiny left). <b>Hash join</b>: build a hash table on one side, probe with the other (big unsorted equijoins). <b>Merge join</b>: sort both on the key, scan in lockstep (or reuse an ordered index). The cost-based planner prices every pair and picks the cheapest.`,
          cards: [
            { q: `When does the planner pick a hash join vs a nested loop?`, a: `Hash join for big unsorted equijoins (build + probe); nested loop when one side is tiny or the right side has a usable index.` },
            { q: `What makes a merge join cheap?`, a: `Both inputs already sorted on the join key (e.g. via an ordered index) — then it's a single lockstep scan of each.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ A nested loop over a large right table with no index is the classic "why is my join O(n·m)?" — avoided only if the planner's row estimates are good (stats!).` },
        { id: "s2", type: "hint", label: `💡 Callback to d14: a plan flipping to a bad join under load is usually stale statistics or a row-estimate blow-up, not a "wrong" planner.` },
      ],
    },
    {
      id: "d77", date: "2027-03-30", week: "w27", title: "The page cache & why fsync is the durability line",
      theme: "Systems · part 5 — 'write() returned' is not 'on disk'.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 45,
          lead: `<b>Systems ⑤</b> — where files live in RAM, and the fsync trap that ate data (callback d12/d40). (1/2)`,
          sub: [
            { id: "s1", est: 45, label: `Read LWN, <a href="https://lwn.net/Articles/752063/" target="_blank" rel="noopener">"PostgreSQL's fsync() surprise"</a> — dirty pages, writeback, and how an fsync error can be reported once and lost.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 This is the OS half of d40's WAL: the DB fsyncs the log before the page precisely because "write returned" ≠ durable. Same tension, one layer down.` },
        { id: "s2", type: "hint", label: `💡 Error-reporting behaviour is kernel-version-dependent (pre-4.13 could lose it entirely). "Durable" is a property you must fsync for, per open fd.` },
      ],
    },

    /* ---------------- Week 28 ---------------- */
    {
      id: "d78", date: "2027-04-03", week: "w28", title: "The page cache & why fsync is the durability line (cont.)",
      theme: "Finish “The page cache & why fsync is the durability line” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d77", obj: SYS, cat: "read", est: 30,
          lead: `<b>Systems ⑤</b> — where files live in RAM, and the fsync trap that ate data (callback d12/d40). (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Reference: <a href="https://man7.org/linux/man-pages/man2/fsync.2.html" target="_blank" rel="noopener">fsync(2)</a> (and <code>fdatasync</code>, which skips non-essential metadata).` },
          ],
          model: `<code>write()</code> and <code>mmap</code> stores mark page-cache pages <b>dirty</b> and return; data is durable only after <code>fsync</code>/<code>fdatasync</code> flushes dirty pages <i>and</i> the disk's write cache. The "fsyncgate" twist: on async writeback failure the kernel may drop the pages and report <code>EIO</code> to <i>whoever fsyncs next</i>, once — so a program that missed it thinks data is safe.`,
          cards: [
            { q: `Does a returning <code>write()</code> mean durable?`, a: `No — it only dirties page-cache pages. Durability needs <code>fsync</code>/<code>fdatasync</code> (flush dirty pages + the drive's write cache).` },
            { q: `What was the "fsyncgate" surprise?`, a: `On writeback failure the kernel could drop the pages and report the error only <i>once</i>, to the next fsyncer — so a naive app believed data was safe. Postgres 12+ now PANICs on fsync failure.` },
          ] },
      ],
    },
    {
      id: "d79", date: "2027-04-04", week: "w28", title: "MEV & Proposer-Builder Separation",
      theme: "Blockchain · part 9 — who orders your transaction, and what they extract.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 90,
          lead: `<b>Blockchain ⑨</b> — the hidden auction beneath every block.`,
          sub: [
            { id: "s1", est: 30, label: `Read ethereum.org <a href="https://ethereum.org/en/developers/docs/mev/" target="_blank" rel="noopener">MEV</a> — where the value comes from, and who extracts it.` },
            { id: "s2", est: 30, label: `Then Flashbots <a href="https://docs.flashbots.net/flashbots-mev-boost/introduction" target="_blank" rel="noopener">MEV-Boost</a> — builders bid, proposers sign the best, a relay mediates.` },
            { id: "s3", est: 30, label: `The protocol direction: enshrined PBS (ePBS, EIP-7732).` },
          ],
          model: `Block production splits into a <b>builder</b> (orders txs, extracts MEV, bids) and a <b>proposer</b> (validator, signs the highest bid), with a trusted <b>relay</b> between them today. MEV = value from ordering/including/excluding txs (arbitrage, liquidations, sandwiches).`,
          cards: [
            { q: `What is MEV?`, a: `Maximal Extractable Value — profit from <b>ordering</b>, including, or excluding txs in a block (arbitrage, liquidations, sandwich attacks).` },
            { q: `What does Proposer-Builder Separation split?`, a: `The <b>builder</b> (orders txs + bids) from the <b>proposer</b> (validator who just signs the top bid) — via a trusted relay today.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 MEV-Boost is LIVE (out-of-protocol, relay-based). <b>Enshrined PBS</b> (EIP-7732) is PROPOSED — a headliner for the Glamsterdam upgrade, targeted ~H2 2026, not on mainnet as of 2026.` },
        { id: "s2", type: "hint", label: `💡 Callback to d57: a sandwich attack is on-chain front/back-running — the same "spot price is manipulable within a tx" you hardened against with TWAPs.` },
      ],
    },

    /* ---------------- Week 29 ---------------- */
    {
      id: "d80", date: "2027-04-07", week: "w29", title: "Kafka consumer rebalances & log compaction",
      theme: "Messaging · part 4 — don't stop the world to add one consumer.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 75,
          lead: `<b>Messaging ④</b> — how partitions get reassigned, and per-key retention.`,
          sub: [
            { id: "s1", est: 40, label: `Read Confluent <a href="https://www.confluent.io/blog/cooperative-rebalancing-in-kafka-streams-consumer-ksqldb/" target="_blank" rel="noopener">"From Eager to Smarter… Rebalances"</a> (eager vs cooperative; <a href="https://cwiki.apache.org/confluence/display/KAFKA/KIP-429:+Kafka+Consumer+Incremental+Rebalance+Protocol" target="_blank" rel="noopener">KIP-429</a>).` },
            { id: "s2", est: 35, label: `Then <a href="https://kafka.apache.org/43/design/design/#log-compaction" target="_blank" rel="noopener">Log Compaction</a> — keep the latest value per key forever; a null value is a tombstone.` },
          ],
          model: `<b>Eager</b> rebalancing makes every consumer surrender <i>all</i> partitions on any group change (whole group stops). <b>Cooperative</b> revokes only the partitions actually moving, so others keep processing. <b>Log compaction</b> gives per-key retention — a replayable changelog; a null-value record is a <b>tombstone</b> that deletes the key.`,
          cards: [
            { q: `Eager vs cooperative rebalancing?`, a: `Eager: everyone drops all partitions on any change (group stops). Cooperative: only the moving partitions are revoked, others keep consuming.` },
            { q: `What does Kafka log compaction guarantee?`, a: `It retains at least the <b>latest value per key</b> forever (a replayable changelog); a null value is a <b>tombstone</b> that deletes the key.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 Kafka 4.x makes the broker-side next-gen rebalance protocol (KIP-848) the default — it largely supersedes the client-side eager/cooperative split. Know the concepts, check your version.` },
        { id: "s2", type: "hint", label: `💡 Compacted topics power CDC and stateful stream apps — the "table" view of a "stream" (callback to d35's log).` },
      ],
    },
    {
      id: "d81", date: "2027-04-08", week: "w29", title: "Upgradeable contracts: proxies & delegatecall collisions",
      theme: "Security · part 5 — storage is addressed by slot, not by name.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 30,
          lead: `<b>Security ⑤</b> — how upgradeable contracts work, and how they silently corrupt state. (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `Read OpenZeppelin <a href="https://docs.openzeppelin.com/upgrades-plugins/proxies" target="_blank" rel="noopener">"Proxy Upgrade Pattern"</a> — <code>delegatecall</code>, and how storage layouts collide.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Upgrades that <i>insert or reorder</i> state variables shift every later slot — the #1 upgrade bug. Append-only, or use storage gaps.` },
        { id: "s2", type: "hint", label: `💡 Callback to d33: <code>delegatecall</code> runs someone else's code in <i>your</i> storage/context — powerful, and exactly why proxy bugs are so dangerous.` },
      ],
    },
    {
      id: "d82", date: "2027-04-09", week: "w29", title: "Upgradeable contracts: proxies & delegatecall collisions (cont.)",
      theme: "Finish “Upgradeable contracts: proxies & delegatecall collisions” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d81", obj: SEC, cat: "read", est: 60,
          lead: `<b>Security ⑤</b> — how upgradeable contracts work, and how they silently corrupt state. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Then <a href="https://eips.ethereum.org/EIPS/eip-1967" target="_blank" rel="noopener">ERC-1967</a> — the standard slots that stop the collision.` },
            { id: "s2", est: 35, label: `Note the two live patterns: <b>Transparent</b> (upgrade logic in the proxy) vs <b>UUPS</b> (upgrade logic in the implementation).` },
          ],
          model: `A proxy <code>delegatecall</code>s into an implementation, so logic runs against the <b>proxy's</b> storage. Under delegatecall, storage is keyed by <b>slot number, not variable name</b> — so proxy and logic must agree on layout (or use ERC-1967's keccak-derived slots), and reordering/inserting variables across upgrades is a classic footgun.`,
          cards: [
            { q: `Under <code>delegatecall</code>, how is storage addressed?`, a: `By <b>slot number, not variable name</b> — so proxy and implementation must share a layout, or state silently corrupts (ERC-1967 uses pseudo-random slots to avoid it).` },
            { q: `Transparent vs UUPS proxy — where's the upgrade logic?`, a: `Transparent: in the proxy. UUPS: in the implementation — so a UUPS impl left uninitialized or missing <code>upgradeTo</code> can be bricked or hijacked.` },
          ] },
      ],
    },

    /* ---------------- Week 30 ---------------- */
    {
      id: "d83", date: "2027-04-14", week: "w30", title: "Logical clocks: Lamport timestamps & vector clocks",
      theme: "Distributed systems · part 4 — ordering events with no shared clock.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 75,
          lead: `<b>Distributed systems ④</b> — causality without synchronized time.`,
          sub: [
            { id: "s1", est: 40, label: `Read Lamport, <a href="https://lamport.azurewebsites.net/pubs/time-clocks.pdf" target="_blank" rel="noopener">"Time, Clocks, and the Ordering of Events"</a> (1978) — happened-before + the clock rule.` },
            { id: "s2", est: 35, label: `Then vector clocks (Fidge/Mattern) via <a href="https://crdt.tech/" target="_blank" rel="noopener">crdt.tech</a>'s references — they detect concurrency, which Lamport clocks can't.` },
          ],
          model: `Lamport's rule (increment per event; on receive set <code>max(local, sender)+1</code>) gives a total order consistent with causality — but only one way: a→b ⇒ C(a)&lt;C(b), <b>not</b> the converse. <b>Vector clocks</b> close that gap: they detect whether two events are causally ordered or <b>concurrent</b>.`,
          cards: [
            { q: `What can a Lamport timestamp NOT tell you?`, a: `Whether two events are concurrent — a→b ⇒ C(a)&lt;C(b), but C(a)&lt;C(b) does <i>not</i> imply a→b. Vector clocks detect concurrency.` },
            { q: `The Lamport clock update rule on receiving a message?`, a: `Set the local clock to <code>max(local, sender)+1</code> (and increment on every local event).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d47/d30: "happened-before" is the same causality Kafka partitions and MVCC snapshots impose locally — here it's made explicit across machines.` },
        { id: "s2", type: "callout", label: `🔬 Vector clocks are how Dynamo (d98) detects conflicting concurrent writes for the client to reconcile.` },
      ],
    },
    {
      id: "d84", date: "2027-04-18", week: "w30", title: "Partitioning & sharding",
      theme: "Databases · part 9 — the win is pruning, and it needs the partition key.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 90,
          lead: `<b>Databases ⑨</b> — splitting one big table, in-DB and across machines.`,
          sub: [
            { id: "s1", est: 40, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/ddl-partitioning.html" target="_blank" rel="noopener">"Table Partitioning"</a> (declarative range/list/hash; partition pruning).` },
            { id: "s2", est: 25, label: `Scale-out trade-offs: DDIA <b>Ch 6 "Partitioning"</b> as far as partitioning secondary indexes (key-range vs hash, and skew).` },
            { id: "s3", est: 25, label: "Finish DDIA Ch 6: rebalancing strategies and request routing." },
          ],
          model: `The real win is <b>partition pruning</b> — the planner skips partitions that can't match, but <i>only</i> when the query filters on the partition key. Partition on a rarely-filtered column and you get the maintenance cost with none of the benefit. Sharding is the same idea across machines, adding routing + rebalancing.`,
          cards: [
            { q: `What's the payoff of partitioning, and its precondition?`, a: `<b>Partition pruning</b> — skipping irrelevant partitions — but only when the query filters on the <b>partition key</b>.` },
            { q: `Partitioning vs sharding?`, a: `Same split; partitioning is within one DB (planner prunes), sharding spreads across machines and adds routing + rebalancing (and hot-shard risk).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Choose the partition key by how you <i>query</i>, not how data arrives — sharded by the wrong key means every query hits every shard.` },
        { id: "s2", type: "hint", label: `💡 Callback to d47: Kafka partitions and DB shards share the lesson — pick the key so related rows/events co-locate, and ordering/pruning follows.` },
      ],
    },
    {
      id: "d85", date: "2027-04-19", week: "w30", title: "QUIC internals beyond HTTP/3",
      theme: "Networking · part 9 — connection IDs, streams, per-space loss recovery.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 40,
          lead: `<b>Networking ⑨</b> — the transport under HTTP/3, in its own right (callback d27). (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read <a href="https://www.rfc-editor.org/info/rfc9000" target="_blank" rel="noopener">RFC 9000</a> (QUIC transport) for the model — connection IDs, streams, and migration.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Don't conflate QUIC (transport) with HTTP/3 (one app mapping, RFC 9114). QUIC can carry other protocols too.` },
        { id: "s2", type: "callout", label: `🔬 Callback to d27: H2's HOL blocking was at TCP; QUIC's independent streams are the fix, at the transport layer.` },
      ],
    },

    /* ---------------- Week 31 ---------------- */
    {
      id: "d86", date: "2027-04-21", week: "w31", title: "QUIC internals beyond HTTP/3 (cont.)",
      theme: "Finish “QUIC internals beyond HTTP/3” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d85", obj: NET, cat: "read", est: 55,
          lead: `<b>Networking ⑨</b> — the transport under HTTP/3, in its own right (callback d27). (2/2)`,
          sub: [
            { id: "s1", est: 30, label: `Then skim <a href="https://www.rfc-editor.org/info/rfc9002" target="_blank" rel="noopener">RFC 9002</a> — loss detection & congestion control, QUIC’s version of the TCP machinery.` },
            { id: "s2", est: 25, label: `Keep the layer split straight: 9000 transport, 9001 TLS, 9002 loss/CC, <b>HTTP/3 = RFC 9114</b>.` },
          ],
          model: `Three pillars: (1) <b>connection IDs</b> identify a connection <i>inside</i> packets — so a Wi-Fi→cellular IP change survives without re-handshaking (migration). (2) independent <b>streams</b> — a lost packet stalls only its stream, not all (TCP's flaw). (3) <b>per-packet-number-space</b> loss recovery — monotonic, never-reused packet numbers remove TCP's retransmission ambiguity.`,
          cards: [
            { q: `How does a QUIC connection survive a network change?`, a: `<b>Connection IDs</b> live inside packets, not in the 4-tuple — so the connection continues without a new handshake (migration).` },
            { q: `Why don't QUIC packet numbers reuse like TCP's?`, a: `They're monotonic and per-number-space (Initial/Handshake/App), removing TCP's retransmission ambiguity.` },
          ] },
      ],
    },
    {
      id: "d87", date: "2027-04-23", week: "w31", title: "Account abstraction: EIP-4337 & EIP-7702",
      theme: "Blockchain · part 10 — smart-account superpowers, two ways.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 90,
          lead: `<b>Blockchain ⑩</b> — batching, gas sponsorship and session keys for wallets.`,
          sub: [
            { id: "s1", est: 40, label: `Read <a href="https://eips.ethereum.org/EIPS/eip-4337" target="_blank" rel="noopener">ERC-4337</a> — UserOperations, bundlers, the EntryPoint, and paymasters.` },
            { id: "s2", est: 25, label: `Then <a href="https://eips.ethereum.org/EIPS/eip-7702" target="_blank" rel="noopener">EIP-7702</a> — an EOA delegating to contract code, the protocol-level shortcut.` },
            { id: "s3", est: 25, label: `Docs: <a href="https://docs.erc4337.io/" target="_blank" rel="noopener">erc4337.io</a>.` },
          ],
          model: `<b>4337</b> delivers AA <i>without</i> protocol changes: an alt-mempool of <code>UserOperation</code>s, off-chain <b>bundlers</b>, a singleton <b>EntryPoint</b>, optional <b>paymasters</b> (gas sponsorship). <b>7702</b> is a protocol-level tx type letting an existing EOA temporarily run contract code — keeping its address while gaining batching/sponsorship/session keys.`,
          cards: [
            { q: `EIP-4337 vs EIP-7702 in one line?`, a: `4337 = smart-contract wallets simulated <i>above</i> the protocol (bundlers + EntryPoint); 7702 = give an ordinary <b>EOA</b> smart-account powers <i>in</i>-protocol (delegate to code).` },
            { q: `What is a paymaster (4337)?`, a: `A contract that sponsors gas — letting users transact without holding ETH (or pay gas in an ERC-20).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 EIP-7702 is <b>live</b> — shipped in the Pectra upgrade (mainnet 7 May 2025); ERC-4337 EntryPoint is live (pin a version, e.g. v0.7/0.8, when it matters).` },
        { id: "s2", type: "callout", label: `⚠️ 7702 introduces a new drainer vector: "sign to upgrade your wallet" delegation prompts are high-risk (an EOA can delegate to arbitrary code). Callback to d57's "verify, then act".` },
      ],
    },
    {
      id: "d88", date: "2027-04-27", week: "w31", title: "Review: the Python GIL & free-threading (3.14)",
      theme: "Review · what the lock protects, and the no-GIL build that's now supported.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 65,
          lead: `<b>Review</b> — why CPython threads don't parallelize CPU work — and how that's changing.`,
          sub: [
            { id: "s1", est: 35, label: `Read the official <a href="https://docs.python.org/3/howto/free-threading-python.html" target="_blank" rel="noopener">Python free-threading howto</a> + <a href="https://peps.python.org/pep-0779/" target="_blank" rel="noopener">PEP 779</a>.` },
            { id: "s2", cat: "exercise", est: 30, label: `Without looking, explain: why do CPU-bound Python threads not speed up, but I/O-bound ones do?` },
          ],
          model: `The <b>GIL</b> serializes the CPython interpreter (and refcounts) so only one thread runs bytecode at a time — great for C-extension safety, fatal for CPU-bound threading (use multiprocessing). I/O-bound threads still win because the GIL is released during blocking I/O.`,
          cards: [
            { q: `Why don't CPU-bound Python threads run in parallel?`, a: `The <b>GIL</b> lets only one thread execute bytecode at a time. I/O-bound threads still help — the GIL is released during blocking I/O.` },
            { q: `Status of no-GIL Python in 2026?`, a: `Free-threading is <b>officially supported</b> as of 3.14 (PEP 779), but as a <i>separate opt-in build</i> (<code>python3.14t</code>), not the default; ~5–10% single-thread penalty.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 Python 3.14 (Oct 2025) moved free-threading from experimental (3.13) to officially supported (PEP 779). "No-GIL by default" has no committed version yet — don't assume 3.15.` },
        { id: "s2", type: "hint", label: `💡 Contrast d03: Go/Rust get true parallel threads; CPython historically doesn't — the GIL is why "just use threads" fails for CPU work in Python.` },
      ],
    },

    /* ---------------- Week 32 ---------------- */
    {
      id: "d89", date: "2027-04-30", week: "w32", title: "Supply-chain security: Sigstore, SLSA & SBOM",
      theme: "DevOps · part 10 — prove what's in the artifact and how it was built.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 80,
          lead: `<b>DevOps ⑩</b> — the OWASP #3 (supply-chain) defenses, concretely.`,
          sub: [
            { id: "s1", est: 25, label: `Read <a href="https://slsa.dev/spec/" target="_blank" rel="noopener">SLSA</a> — the build/source provenance levels, and what each one actually requires.` },
            { id: "s2", est: 30, label: `Then <a href="https://docs.sigstore.dev/about/overview/" target="_blank" rel="noopener">Sigstore</a> — keyless signing with Cosign + Fulcio + Rekor.` },
            { id: "s3", est: 25, label: `SBOM formats: <a href="https://cyclonedx.org/" target="_blank" rel="noopener">CycloneDX</a> / <a href="https://spdx.dev/" target="_blank" rel="noopener">SPDX</a>.` },
          ],
          model: `They compose: an <b>SBOM</b> says <i>what's in</i> an artifact, <b>SLSA provenance</b> attests <i>how it was built</i> (and at what level), and <b>Sigstore/Cosign</b> signs those attestations — verified by <i>identity</i> (Fulcio's short-lived OIDC certs + Rekor transparency log), not long-lived keys.`,
          cards: [
            { q: `SBOM vs SLSA vs Sigstore — how do they fit?`, a: `SBOM = <i>what's in</i> it; SLSA provenance = <i>how it was built</i>; Sigstore/Cosign = cryptographically <b>signs</b> those, verified by identity not keys.` },
            { q: `What makes Sigstore "keyless"?`, a: `Fulcio issues short-lived certs bound to an OIDC identity and Rekor logs the signature — verify by identity + transparency log, no long-lived private key.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 SLSA is at <b>v1.2</b> with two tracks — a <b>Build</b> track (L0–3) and a newer <b>Source</b> track (L1–4). Don't cite "SLSA 1.0 / one 4-level ladder" — say the track + level (e.g. "Build L3").` },
        { id: "s2", type: "hint", label: `💡 Callback to d19: "Software Supply-Chain Failures" is high on OWASP 2025 — these three are the concrete answer to "how do you trust a dependency?".` },
      ],
    },
    {
      id: "d90", date: "2027-05-02", week: "w32", title: "Distributed transactions: 2PC & the Saga pattern",
      theme: "Distributed systems · part 5 — atomicity across services, and its price.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 90,
          lead: `<b>Distributed systems ⑤</b> — how (and whether) to commit across nodes.`,
          sub: [
            { id: "s1", est: 40, label: `Read the free MIT 6.824 notes on <a href="https://timilearning.com/posts/mit-6.824/lecture-12-distributed-transactions/" target="_blank" rel="noopener">distributed transactions</a> (2PC: PREPARE → vote → COMMIT/ABORT, and blocking).` },
            { id: "s2", est: 30, label: `Then the Saga original: Garcia-Molina & Salem, <a href="https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf" target="_blank" rel="noopener">"Sagas"</a> (1987).` },
            { id: "s3", est: 20, label: `Then <a href="https://microservices.io/patterns/data/saga.html" target="_blank" rel="noopener">microservices.io Saga</a> — the same idea as people actually deploy it.` },
          ],
          model: `<b>2PC</b> gives atomic commit but is <b>blocking</b> — a prepared participant can't decide alone, so a coordinator crash at the wrong moment holds locks until recovery. <b>Saga</b> splits a long transaction into local steps each with a <b>compensating</b> action — trading ACID isolation for availability ("all committed or all compensated"; intermediate states are visible).`,
          cards: [
            { q: `Why is 2PC called a blocking protocol?`, a: `A participant that voted "prepared" can't unilaterally commit or abort — a coordinator crash leaves it holding locks until recovery.` },
            { q: `What does a Saga trade away, and how does it undo work?`, a: `It gives up atomic isolation (intermediate states are visible) for availability; failures are undone by <b>compensating</b> transactions (which must be idempotent).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Callback to d35/d80: the transactional <b>outbox</b> (next Messaging day) is how a Saga step reliably emits its event — same local txn as the state change.` },
        { id: "s2", type: "hint", label: `💡 Choreography (events) vs orchestration (a coordinator) is the Saga design axis — orchestration is easier to reason about, choreography more decoupled.` },
      ],
    },
    {
      id: "d91", date: "2027-05-03", week: "w32", title: "Replication: physical vs logical, sync vs async",
      theme: "Databases · part 10 — replication lag is your failover data-loss window.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 40, lead: `<b>Databases ⑩</b> — how a standby stays current, and what you lose on failover. (1/2)`,
          sub: [
            { id: "s1", cat: "read", est: 40, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/high-availability.html" target="_blank" rel="noopener">"High Availability… and Replication"</a> — streaming replication, and what synchronous really costs.`, lead: `<b>Databases ⑩</b> — how a standby stays current, and what you lose on failover.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d40/d75: it's the WAL again — the same log that gives crash recovery streams to replicas. Sync-vs-async is PACELC's L-vs-C made concrete.` },
        { id: "s2", type: "hint", label: `💡 A read replica gives read scaling but <i>stale</i> reads under lag — "read-your-writes" needs routing the just-written user to the primary.` },
      ],
    },

    /* ---------------- Week 33 ---------------- */
    {
      id: "d92", date: "2027-05-06", week: "w33", title: "Replication: physical vs logical, sync vs async (cont.)",
      theme: "Finish “Replication: physical vs logical, sync vs async” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d91", obj: DATA, cat: "read", est: 35, lead: `<b>Databases ⑩</b> — how a standby stays current, and what you lose on failover. (2/2)`, model: `<b>Physical</b> replication ships the WAL byte-for-byte (whole cluster, same version). <b>Logical</b> replicates changes by <b>replication identity</b> (usually PK) — selective, cross-version, upgrade-friendly. With <b>async</b> commit, a commit is acked before the standby has it, so <b>replication lag = the failover data-loss window</b>; <b>synchronous</b> closes it at the cost of commit latency (PACELC's C-over-L).`, cards: [
              { q: `Physical vs logical replication?`, a: `Physical = byte-for-byte WAL (whole cluster, same version); logical = changes by replication identity/PK (selective, cross-version, upgrade-friendly).` },
              { q: `What is async replication lag, operationally?`, a: `The <b>failover data-loss window</b> — commits acked but not yet on the standby. Synchronous replication removes it, at commit-latency cost.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 35, label: `Then <a href="https://www.postgresql.org/docs/current/logical-replication.html" target="_blank" rel="noopener">"Logical Replication"</a> — row-level changes over a publication/subscription, and what it can’t carry.`, lead: `<b>Databases ⑩</b> — how a standby stays current, and what you lose on failover.` },
          ] },
      ],
    },
    {
      id: "d93", date: "2027-05-08", week: "w33", title: "CDC & the transactional outbox",
      theme: "Messaging · part 5 — kill the dual-write with one local transaction.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 75, lead: `<b>Messaging ⑤</b> — reliably publish an event AND update your DB, atomically.`, model: `The <b>dual-write problem</b>: writing to the DB and to Kafka separately can partially fail. Fix: write the business change <i>and</i> an event row into an <b>outbox</b> table in the <b>same local ACID transaction</b>; <b>CDC</b> (Debezium tailing the WAL) captures the outbox insert and forwards it to Kafka. The row is just a vehicle — capture is from the log, so it can be deleted immediately.`, cards: [
              { q: `What is the dual-write problem, and the outbox fix?`, a: `Writing DB + Kafka separately can half-fail. Fix: write the change + an <b>outbox</b> row in one local txn; <b>CDC</b> streams the outbox from the WAL to Kafka.` },
              { q: `Why is CDC reliable where an app-level publish isn't?`, a: `It reads the DB's own <b>transaction log</b> — so it only ever emits committed changes, even if the app crashed right after commit.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 40, label: `Read Debezium, <a href="https://debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/" target="_blank" rel="noopener">"Reliable Microservices Data Exchange With the Outbox Pattern"</a> — one local transaction, then the log does the rest.`, lead: `<b>Messaging ⑤</b> — reliably publish an event AND update your DB, atomically.` },
            { id: "s2", cat: "read", est: 35, label: `Then the <a href="https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html" target="_blank" rel="noopener">Outbox Event Router</a> SMT docs — the pattern as a running piece of configuration.`, lead: `<b>Messaging ⑤</b> — reliably publish an event AND update your DB, atomically.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is d90's Saga step made durable, and d35/d40's "log" reused: the WAL is the source of truth, Kafka a projection of it.` },
        { id: "s2", type: "hint", label: `💡 Debezium tails Postgres logical replication — which is why you enabled <code>wal_level=logical</code> (callback d91).` },
      ],
    },

    /* ---------------- Week 34 ---------------- */
    {
      id: "d94", date: "2027-05-12", week: "w34", title: "ZK proofs: SNARKs vs STARKs (intuition)",
      theme: "Blockchain · part 11 — prove you ran the computation, reveal nothing.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 65,
          lead: `<b>Blockchain ⑪</b> — the cryptography under ZK-rollups, at the intuition level. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read Vitalik, <a href="https://vitalik.eth.limo/general/2017/02/01/zk_snarks.html" target="_blank" rel="noopener">"zk-SNARKs: Under the Hood"</a> as far as the QAP — computation → circuit → R1CS → QAP.` },
            { id: "s2", est: 30, label: "Finish the post: the pairing check, and where the trusted setup enters." },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Vitalik's 2017 piece is Groth16-era intuition — modern systems (PLONK, Halo2, STARK zkVMs) use <b>universal or transparent</b> setups that reduce/remove the per-circuit ceremony. Read it for the model, not current production.` },
        { id: "s2", type: "hint", label: `💡 "Zero-knowledge" and "succinct" are separable: rollups mostly want <i>succinctness</i> (a small proof of a big computation); privacy is a bonus some use.` },
      ],
    },
    {
      id: "d95", date: "2027-05-14", week: "w34", title: "Distributed locks & the Redlock debate",
      theme: "Caching · part 4 — a lock without a fencing token isn't safe.",
      tasks: [
        { id: "t1", carried: "d94", obj: CHAIN, cat: "read", est: 45,
          lead: `<b>Blockchain ⑪</b> — the cryptography under ZK-rollups, at the intuition level. (2/2)`,
          sub: [
            { id: "s1", est: 45, label: `Compare families: <a href="https://www.cyfrin.io/blog/a-full-comparison-what-are-zk-snarks-and-zk-starks" target="_blank" rel="noopener">SNARKs vs STARKs</a>.` },
          ],
          model: `<b>SNARKs</b>: tiny proofs (hundreds of bytes), cheap constant-time verification — but need a per-circuit <b>trusted setup</b> and rest on elliptic-curve/pairing assumptions (not quantum-safe). <b>STARKs</b>: <b>no trusted setup</b>, post-quantum (hash-based) — but much larger proofs. Both let a verifier check a computation without redoing it.`,
          cards: [
            { q: `SNARK vs STARK — the headline trade?`, a: `SNARK: tiny proofs + cheap verify, but a <b>trusted setup</b> and not quantum-safe. STARK: no trusted setup + post-quantum, but much larger proofs.` },
            { q: `What does a validity (ZK) proof let a verifier avoid?`, a: `Re-executing the computation — it checks a succinct proof instead (the basis of ZK-rollups, d63).` },
          ] },
        { id: "t2", obj: CACHE, cat: "read", est: 30, lead: `<b>Caching ④</b> — why a Redis lock can fail, and the fix both sides accept. (1/2)`,
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Read antirez’s <a href="https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/" target="_blank" rel="noopener">Redlock</a> spec — the algorithm as proposed.`, lead: `<b>Caching ④</b> — why a Redis lock can fail, and the fix both sides accept.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d40/d30: for correctness-critical mutual exclusion, a DB row lock (<code>SELECT … FOR UPDATE</code>) or a consensus system beats a cache lock. Redlock trades safety for availability.` },
        { id: "s2", type: "hint", label: `💡 The fencing token is d83's logical clock applied to a lock — a monotonic order that rejects the stale actor.` },
      ],
    },
    {
      id: "d96", date: "2027-05-17", week: "w34", title: "Distributed locks & the Redlock debate (cont.)",
      theme: "Finish “Distributed locks & the Redlock debate” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d95", obj: CACHE, cat: "read", est: 55, lead: `<b>Caching ④</b> — why a Redis lock can fail, and the fix both sides accept. (2/2)`, model: `A lock alone isn't enough: a stalled client (GC pause, network delay) can act <i>after</i> its lease expired while another holds the lock. The fix is a monotonically increasing <b>fencing token</b> the protected resource checks — rejecting any write with a stale (lower) token. Redlock doesn't issue fencing tokens — Kleppmann's central objection.`, cards: [
              { q: `Why isn't holding a distributed lock sufficient for correctness?`, a: `A stalled client (GC/network pause) can act after its lease expired while another holds the lock — two "holders" at once.` },
              { q: `What's the fix both sides of the Redlock debate accept?`, a: `A monotonically increasing <b>fencing token</b> the resource checks, rejecting any write carrying a stale (lower) token.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Then Kleppmann’s critique <a href="https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html" target="_blank" rel="noopener">"How to do distributed locking"</a> — fencing tokens, and clocks you can’t trust.`, lead: `<b>Caching ④</b> — why a Redis lock can fail, and the fix both sides accept.` },
            { id: "s2", cat: "read", est: 25, label: `Then antirez’s <a href="https://antirez.com/news/101" target="_blank" rel="noopener">rebuttal</a> — and decide for yourself which assumption you’re willing to make.`, lead: `<b>Caching ④</b> — why a Redis lock can fail, and the fix both sides accept.` },
          ] },
      ],
    },

    /* ---------------- Week 35 ---------------- */
    {
      id: "d97", date: "2027-05-20", week: "w35", title: "io_uring vs epoll: completion beats readiness",
      theme: "Systems · part 6 — batch I/O with (almost) no syscalls.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 80, lead: `<b>Systems ⑥</b> — the modern async I/O interface, and why it's different (callback d44).`, model: `<b>epoll</b> is <b>readiness-based</b> — it says a fd is ready, you still issue a separate <code>read</code>/<code>write</code> per event (and it's useless for regular files, always "ready"). <b>io_uring</b> is <b>completion-based</b> — place SQEs in a ring shared with the kernel, submit a batch with one (or zero) syscalls, reap CQEs saying the op already <i>finished</i>. It collapses per-op syscall overhead and works for files.`, cards: [
              { q: `Readiness (epoll) vs completion (io_uring)?`, a: `epoll says a fd is <i>ready</i> (you still do the read); io_uring says the op already <i>finished</i> (CQE), batching submissions with few/zero syscalls.` },
              { q: `Why is io_uring useful where epoll isn't?`, a: `Regular files are always "ready", so epoll can't async them; io_uring's completion model does real async file I/O.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 45, label: `Read <a href="https://unixism.net/loti/" target="_blank" rel="noopener">"Lord of the io_uring"</a> — the SQE/CQE ring model, submission, and completion.`, lead: `<b>Systems ⑥</b> — the modern async I/O interface, and why it's different (callback d44).` },
            { id: "s2", cat: "read", est: 35, label: `Then LWN <a href="https://lwn.net/Articles/810414/" target="_blank" rel="noopener">"The rapid growth of io_uring"</a> — what it grew to cover, and the security surface that came with it.`, lead: `<b>Systems ⑥</b> — the modern async I/O interface, and why it's different (callback d44).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ io_uring is heavily kernel-gated (5.1+; features vary by version) — use <b>liburing</b>, not raw syscalls. A stream of CVEs led some hardened environments to disable it; it's not a universal epoll drop-in.` },
        { id: "s2", type: "hint", label: `💡 The dead <code>kernel.dk/io_uring.pdf</code> link floats around — use Lord of the io_uring / LWN instead.` },
      ],
    },
    {
      id: "d98", date: "2027-05-22", week: "w35", title: "Quorums (R + W > N) & tunable consistency",
      theme: "Distributed systems · part 6 — dial consistency vs latency per read/write.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 80, lead: `<b>Distributed systems ⑥</b> — the Dynamo model of replicated reads/writes.`, model: `With N replicas and tunable read/write quorums, <b>R + W &gt; N</b> forces every read quorum to overlap every write quorum — so a read sees the latest write. Operators dial latency vs consistency vs durability. But Dynamo uses <b>sloppy</b> quorums + hinted handoff, so R+W&gt;N is <i>not</i> linearizable under partitions — reads can return concurrent versions the client reconciles (vector clocks, d83).`, cards: [
              { q: `What does R + W > N give you?`, a: `Every read quorum overlaps every write quorum, so a read sees the latest write — with tunable R/W to trade latency vs consistency.` },
              { q: `Does R + W > N mean strong consistency?`, a: `Not under Dynamo's sloppy quorums + partitions — you can still read concurrent versions and must reconcile. It's the 2007 research Dynamo, not the DynamoDB product.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 40, label: `Read the Dynamo paper, <a href="https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" target="_blank" rel="noopener">"Dynamo: Amazon's Highly Available Key-value Store"</a> (SOSP 2007) §4.1–§4.5 — consistent hashing, replication, and versioning with vector clocks.`, lead: `<b>Distributed systems ⑥</b> — the Dynamo model of replicated reads/writes.` },
            { id: "s2", cat: "read", est: 40, label: "Finish the Dynamo paper: quorums (R + W > N), hinted handoff, anti-entropy with Merkle trees, and the production lessons in §6.", lead: `<b>Distributed systems ⑥</b> — the Dynamo model of replicated reads/writes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 R=1,W=N → fast reads, slow durable writes; R=N,W=1 → the reverse. R=W=⌈(N+1)/2⌉ is the balanced quorum.` },
        { id: "s2", type: "callout", label: `🔬 Ties the thread together: consistent hashing (d74), vector clocks (d83), PACELC (d75) all appear in this one paper.` },
      ],
    },
    {
      id: "d99", date: "2027-05-23", week: "w35", title: "B-tree vs LSM-tree storage engines",
      theme: "Databases · part 11 — write-optimized vs read-optimized, and amplification.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 35,
          lead: `<b>Databases ⑪</b> — the two families under Postgres, RocksDB, Cassandra & friends. (1/2)`,
          sub: [
            { id: "s1", est: 35, label: `Read DDIA <b>Ch 3 "Storage and Retrieval"</b> through SSTables & LSM-Trees.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d08: Postgres indexes are B-trees. Reach for LSM engines (RocksDB, Cassandra, ScyllaDB) when writes dominate reads.` },
        { id: "s2", type: "callout", label: `🔬 "LSM = faster writes" is only true when tuned — bad compaction settings erase the advantage and spike read latency.` },
      ],
    },

    /* ---------------- Week 36 ---------------- */
    {
      id: "d100", date: "2027-05-26", week: "w36", title: "B-tree vs LSM-tree storage engines (cont.)",
      theme: "Finish “B-tree vs LSM-tree storage engines” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d99", obj: DATA, cat: "read", est: 60,
          lead: `<b>Databases ⑪</b> — the two families under Postgres, RocksDB, Cassandra & friends. (2/2)`,
          sub: [
            { id: "s1", est: 30, label: "Finish DDIA Ch 3: B-Trees, and the comparison (write/read/space amplification)." },
            { id: "s2", est: 30, label: `Free supplement: the <a href="https://github.com/facebook/rocksdb/wiki/RocksDB-Tuning-Guide" target="_blank" rel="noopener">RocksDB Tuning Guide</a> (defines write/read/space amplification).` },
          ],
          model: `<b>B-tree</b> (Postgres/MySQL): update pages in place — predictable reads, but write-amplifies via in-place writes + WAL. <b>LSM-tree</b> (RocksDB/Cassandra): buffer writes in memory, flush/compact sequential SSTables — high write throughput, but pays read + space amplification (compaction, checking multiple levels). Pick by read-heavy vs write-heavy.`,
          cards: [
            { q: `B-tree vs LSM-tree — the core trade?`, a: `B-tree: in-place updates, predictable reads, write-amplifies. LSM: buffered sequential writes (high throughput), pays read + space amplification via compaction.` },
            { q: `What is write amplification?`, a: `Bytes actually written to storage ÷ bytes written to the database — high in LSMs from compaction rewriting data across levels.` },
          ] },
      ],
    },
    {
      id: "d101", date: "2027-05-31", week: "w36", title: "eBPF & XDP: programmable packets in the kernel",
      theme: "Networking · part 10 — run verified code before the packet even becomes an skb.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 75, lead: `<b>Networking ⑩</b> — the technology under Cilium, modern LBs and DDoS filters.`, model: `<b>XDP</b> runs a verified BPF program at the earliest point — in the NIC driver's RX path, <b>before</b> the kernel allocates an <code>skb</code> — so it can drop/redirect/rewrite at line rate. Verdicts: <code>XDP_DROP</code>, <code>XDP_PASS</code> (up the stack), <code>XDP_TX</code> (bounce out), <code>XDP_REDIRECT</code>. tc/BPF hooks run later (after skb alloc) but see more context.`, cards: [
              { q: `Why is XDP so fast?`, a: `It runs in the NIC driver's RX path <b>before</b> the kernel allocates an skb (and before the full stack) — dropping/redirecting at line rate.` },
              { q: `The XDP verdicts?`, a: `<code>XDP_DROP</code>, <code>XDP_PASS</code> (to the stack), <code>XDP_TX</code> (bounce out the same NIC), <code>XDP_REDIRECT</code>.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 40, label: `Read the Cilium <a href="https://docs.cilium.io/en/stable/reference-guides/bpf/" target="_blank" rel="noopener">"BPF and XDP Reference Guide"</a> — maps, program types, and the hook points.`, lead: `<b>Networking ⑩</b> — the technology under Cilium, modern LBs and DDoS filters.` },
            { id: "s2", cat: "read", est: 35, label: `Then the eBPF docs <a href="https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_XDP/" target="_blank" rel="noopener">XDP program type</a> — packets handled before the kernel builds an skb.`, lead: `<b>Networking ⑩</b> — the technology under Cilium, modern LBs and DDoS filters.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Only <b>native/driver</b> XDP is fast — <b>generic</b> mode runs after skb alloc (no perf win). "XDP always bypasses skb" is wrong for generic mode.` },
        { id: "s2", type: "hint", label: `💡 eBPF is a verified in-kernel VM — the same tech powers Cilium networking, Brendan Gregg's tracing (next DevOps day) and modern observability.` },
      ],
    },
    {
      id: "d102", date: "2027-06-01", week: "w36", title: "eBPF & XDP: programmable packets in the kernel (cont.)",
      theme: "Finish “eBPF & XDP: programmable packets in the kernel” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d101", obj: COMP, cat: "read", est: 55, lead: `<b>Compiler lens</b> — before that BPF program runs, a verifier <i>proves</i> it safe and a JIT compiles it. A compiler pipeline living in ring 0.`, model: `Loading eBPF is a two-stage <b>compiler back-end</b> inside the kernel. First the <b>verifier</b> does a static, path-sensitive analysis — it symbolically walks every path (a DAG, with <b>state pruning</b> so it doesn't explode), proving bounded loops, in-bounds memory, and correct register types; anything it can't prove safe is rejected, not loaded. Only then does a per-architecture <b>JIT</b> lower the accepted bytecode to native instructions, so it runs at near-C speed. It's the same <i>front-end checks → back-end codegen</i> shape you'll meet in the JVM and V8 — the difference is the kernel <b>can't trust</b> the input, so the "type checker" is a safety proof.`, cards: [
              { q: `What does the eBPF verifier guarantee before a program can load?`, a: `Termination + memory safety: it statically explores all paths (with state pruning) proving bounded loops, in-bounds access and correct register/pointer types. Can't prove it ⇒ rejected. It's a static analyzer, i.e. a compiler front-end.` },
              { q: `Why is loaded eBPF still fast if it was "interpreted" bytecode?`, a: `After verification a per-architecture <b>JIT</b> compiles the BPF bytecode to native machine code, so it executes at near-native speed rather than being interpreted.` },
              { q: `How is this like/unlike a language compiler?`, a: `Same shape — front-end checks then back-end codegen — but the verifier proves <b>safety</b> on untrusted input (reject on doubt), where a normal type checker assumes a cooperating programmer.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Skim the kernel’s <a href="https://docs.kernel.org/bpf/verifier.html" target="_blank" rel="noopener">eBPF verifier</a> doc — a static analysis that must prove termination and memory safety before your program loads.`, lead: `<b>Compiler lens</b> — before that BPF program runs, a verifier <i>proves</i> it safe and a JIT compiles it. A compiler pipeline living in ring 0.` },
            { id: "s2", cat: "read", est: 25, label: `Then the verify-then-JIT half of <a href="https://ebpf.io/what-is-ebpf/" target="_blank" rel="noopener">"What is eBPF?"</a> — the same pipeline, end to end.`, lead: `<b>Compiler lens</b> — before that BPF program runs, a verifier <i>proves</i> it safe and a JIT compiles it. A compiler pipeline living in ring 0.` },
          ] },
      ],
    },

    /* ---------------- Week 37 ---------------- */
    {
      id: "d103", date: "2027-06-03", week: "w37", title: "Solana under the hood: Firedancer & Alpenglow",
      theme: "Blockchain · part 12 — client diversity and a faster consensus.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 75, lead: `<b>Blockchain ⑫</b> — where Solana's performance and resilience are heading.`, model: `<b>Firedancer</b> = Jump's independent, high-performance C/C++ validator client — throughput + <b>client diversity</b> (vs the Agave/Anza client). <b>Alpenglow</b> = a proposed replacement for TowerBFT+PoH-style consensus (Votor/Rotor) targeting ~150 ms-class finality. Two different layers — a <i>client</i> vs a <i>consensus protocol</i> — often conflated.`, cards: [
              { q: `Firedancer vs Alpenglow — different layers?`, a: `Firedancer = a from-scratch <b>validator client</b> (throughput + client diversity); Alpenglow = a new <b>consensus protocol</b> for far faster finality.` },
              { q: `Why does client diversity matter?`, a: `If one client has a bug, an independent implementation keeps the chain live — no single-client monoculture (Ethereum learned this too).` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 40, label: `Read the <a href="https://github.com/firedancer-io/firedancer" target="_blank" rel="noopener">Firedancer</a> repo/README — a second validator implementation, and why that matters for client diversity.`, lead: `<b>Blockchain ⑫</b> — where Solana's performance and resilience are heading.` },
            { id: "s2", cat: "read", est: 35, label: `Then the <a href="https://docs.anza.xyz/" target="_blank" rel="noopener">Anza docs</a>, and follow Anza’s Alpenglow announcement for the consensus change.`, lead: `<b>Blockchain ⑫</b> — where Solana's performance and resilience are heading.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 As of 2026: Firedancer is <b>live on mainnet</b> (full client since ~Dec 2025, minority stake). Alpenglow is <b>proposed</b> — validator-approved and on a test cluster, mainnet targeted ~H2 2026, not shipped. Know Tower BFT + PoH as the deployed model.` },
        { id: "s2", type: "hint", label: `💡 Callback to d51/d54: PoH gives the verifiable clock; Alpenglow rethinks how votes finalize on top of it.` },
      ],
    },
    {
      id: "d104", date: "2027-06-05", week: "w37", title: "Review: C++ memory model & std::atomic ordering",
      theme: "Review · the same acquire/release you met in Rust, at the metal.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 80,
          lead: `<b>Review</b> — what <code>memory_order</code> actually constrains (contrast d49's Rust).`,
          sub: [
            { id: "s1", est: 25, label: `Read cppreference <a href="https://en.cppreference.com/w/cpp/atomic/memory_order" target="_blank" rel="noopener">std::memory_order</a> — the six orderings, as specified.` },
            { id: "s2", est: 25, label: `Then Preshing, <a href="https://preshing.com/20120913/acquire-and-release-semantics/" target="_blank" rel="noopener">"Acquire and Release Semantics"</a> — the same thing explained so it sticks.` },
            { id: "s3", cat: "exercise", est: 30, label: `Without looking, explain: why does a release-store paired with an acquire-load safely publish data between threads?` },
          ],
          model: `<b>Release</b> (store) pairs with <b>acquire</b> (load) to establish <b>happens-before</b>: everything the writer did before the release becomes visible to a reader after the acquire. <b>seq_cst</b> adds one global total order; <b>relaxed</b> is atomicity only, no ordering. Lock-free is hard precisely because without these paired fences, threads observe writes in different orders.`,
          cards: [
            { q: `What does a release-store / acquire-load pair guarantee?`, a: `<b>Happens-before</b>: all writes before the release are visible to a thread that acquire-loads that value. That's how you publish data lock-free.` },
            { q: `relaxed vs seq_cst?`, a: `<code>relaxed</code> = atomicity only, no ordering; <code>seq_cst</code> = a single global total order across all seq_cst ops (the safe default).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Same enum, same semantics as Rust's <code>Ordering</code> (d49) — Rust just checks aliasing at compile time; C++ leaves it to you.` },
        { id: "s2", type: "hint", label: `💡 <code>memory_order_consume</code> is effectively discouraged — no mainstream compiler implements it as specified; most promote it to acquire.` },
      ],
    },
    {
      id: "d105", date: "2027-06-08", week: "w37", title: "Review: C++ memory model & std::atomic ordering (cont.)",
      theme: "Finish “Review: C++ memory model & std::atomic ordering” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d104", obj: COMP, cat: "read", est: 55, lead: `<b>Compiler lens</b> — half of "memory ordering" is the <i>compiler</i> reordering your code. Meet the <b>as-if rule</b> and why <code>-O2</code> is allowed to move things.`, model: `A compiler may perform <b>any</b> transformation as long as the program's <b>observable behavior</b> is unchanged — that's the <b>as-if rule</b>. On a single thread "observable" means I/O + volatile access + final state, so the optimizer freely reorders, folds, inlines, and keeps values in registers (<b>register allocation</b> — graph-coloring / linear-scan, spilling to the stack when it runs out). The catch: "as-if" reasons about <i>one</i> thread, so it will happily reorder ordinary loads/stores that another thread is watching. <code>std::atomic</code> with an ordering is how you tell the compiler (and CPU) "this access <b>is</b> observable — don't reorder across it." So <code>volatile</code> ≠ a fence: it blocks the compiler for that one variable but orders nothing else and emits no barrier.`, cards: [
              { q: `What is the "as-if" rule?`, a: `A compiler may apply any optimization provided the program's <b>observable behavior</b> (I/O, volatile access, final state) is preserved — it reasons about a <i>single</i> thread.` },
              { q: `Why does that make lock-free code dangerous?`, a: `"As-if" only preserves single-thread observable behavior, so the optimizer reorders ordinary memory ops another thread can see. <code>std::atomic</code> orderings (d104) re-declare those accesses observable so they aren't reordered.` },
              { q: `Is <code>volatile</code> a thread-safety tool in C++?`, a: `No — it stops the compiler from optimizing away/reordering that one variable's accesses but emits <b>no CPU fence</b> and orders nothing else. Use <code>std::atomic</code> for inter-thread ordering.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Read the <a href="https://en.wikipedia.org/wiki/As-if_rule" target="_blank" rel="noopener">as-if rule</a> — C/C++ "observable behavior", and everything a compiler may do around it.`, lead: `<b>Compiler lens</b> — half of "memory ordering" is the <i>compiler</i> reordering your code. Meet the <b>as-if rule</b> and why <code>-O2</code> is allowed to move things.` },
            { id: "s2", cat: "read", est: 25, label: `Then <a href="https://en.wikipedia.org/wiki/Register_allocation" target="_blank" rel="noopener">register allocation</a> — one concrete optimization the compiler runs on your IR.`, lead: `<b>Compiler lens</b> — half of "memory ordering" is the <i>compiler</i> reordering your code. Meet the <b>as-if rule</b> and why <code>-O2</code> is allowed to move things.` },
          ] },
      ],
    },

    /* ---------------- Week 38 ---------------- */
    {
      id: "d106", date: "2027-06-09", week: "w38", title: "Stream processing: event time & watermarks",
      theme: "Messaging · part 6 — the clock that matters is in the data, not the wall.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 80, lead: `<b>Messaging ⑥</b> — windowing unbounded, out-of-order streams correctly.`, model: `<b>Processing time</b> = wall clock (low latency, non-deterministic); <b>event time</b> = timestamps in the records (deterministic, reproducible). A <b>watermark</b>(t) declares "event time has reached t — expect no more elements ≤ t", firing event-time windows; later records are "late". Dataflow frames it as <i>what</i> / <i>where</i> / <i>when</i> / <i>how</i>.`, cards: [
              { q: `Event time vs processing time?`, a: `Event time = the timestamp in the record (deterministic, reproducible); processing time = the wall clock when it's handled (low latency, non-deterministic).` },
              { q: `What does a watermark do?`, a: `<b>Watermark(t)</b> asserts event time has reached t (no more elements ≤ t expected) — firing the windows ending at/before t; later records are "late".` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 35, label: `Read Flink <a href="https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/" target="_blank" rel="noopener">"Timely Stream Processing"</a> — event time vs processing time, and watermarks.`, lead: `<b>Messaging ⑥</b> — windowing unbounded, out-of-order streams correctly.` },
            { id: "s2", cat: "read", est: 45, label: `Then the Google <a href="https://www.vldb.org/pvldb/vol8/p1792-Akidau.pdf" target="_blank" rel="noopener">Dataflow model paper</a> (Akidau et al., 2015) — what/where/when/how, the framework behind all of it.`, lead: `<b>Messaging ⑥</b> — windowing unbounded, out-of-order streams correctly.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d47: ordering is only per-partition, and events arrive late/out-of-order — watermarks are how a stream processor copes without a global clock.` },
        { id: "s2", type: "callout", label: `🔬 The four questions — what / where / when / how — are the Dataflow model's lasting contribution; every stream engine (Flink, Beam, Kafka Streams) implements them.` },
      ],
    },
    {
      id: "d107", date: "2027-06-10", week: "w38", title: "Performance analysis: perf, flame graphs & eBPF",
      theme: "DevOps · part 11 — find where time actually goes, not where you guess.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 75, lead: `<b>DevOps ⑪</b> — the observability that shows you the hot path.`, model: `Sample CPU stacks with <code>perf</code>, visualize as a <b>flame graph</b>: the x-axis is <b>not time</b> — frames are alphabetical and box width ∝ how often that stack was sampled (time on-CPU); read it by the widest plateaus near the top. eBPF (bpftrace/BCC) adds programmable low-overhead kernel+user tracing.`, cards: [
              { q: `How do you read a flame graph?`, a: `x-axis is <b>not time</b> — width ∝ sample count (time on-CPU), frames sorted alphabetically. Scan for the <b>widest plateaus near the top</b> = the hot paths.` },
              { q: `flame graph vs flame chart?`, a: `Flame <i>graph</i>: alphabetical x-axis (aggregated samples). Flame <i>chart</i>: time on the x-axis. Don't conflate them.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 25, label: `Read Brendan Gregg: <a href="https://www.brendangregg.com/flamegraphs.html" target="_blank" rel="noopener">Flame Graphs</a> — how to read one, and how to generate one.`, lead: `<b>DevOps ⑪</b> — the observability that shows you the hot path.` },
            { id: "s2", cat: "read", est: 25, label: `Then <a href="https://www.brendangregg.com/perf.html" target="_blank" rel="noopener">perf examples</a> — the commands you would actually run on a hot box.`, lead: `<b>DevOps ⑪</b> — the observability that shows you the hot path.` },
            { id: "s3", cat: "read", est: 25, label: `Then <a href="https://www.brendangregg.com/ebpf.html" target="_blank" rel="noopener">eBPF tracing tools</a> — the same questions answered with far less overhead.`, lead: `<b>DevOps ⑪</b> — the observability that shows you the hot path.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Accurate flame graphs need real stacks — compile with frame pointers or use <code>--call-graph dwarf</code>; missing frame pointers silently produce broken graphs.` },
        { id: "s2", type: "hint", label: `💡 Callback to d32/d53: golden signals tell you <i>that</i> it's slow; a flame graph tells you <i>where</i>. Measure, don't guess.` },
      ],
    },
    {
      id: "d108", date: "2027-06-12", week: "w38", title: "Signature replay & EIP-712 typed signing",
      theme: "Security · part 6 — a signature must be bound to one chain, one contract, once.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 45, lead: `<b>Security ⑥</b> — how off-chain signatures get replayed, and how to stop it. (1/2)`,
          sub: [
            { id: "s1", cat: "read", est: 45, label: `Read <a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank" rel="noopener">EIP-712</a> — typed structured signing and the domain separator that binds a signature to one contract and chain.`, lead: `<b>Security ⑥</b> — how off-chain signatures get replayed, and how to stop it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Caching the domain separator at deploy breaks after a fork changes chainId — recompute on chainId change (OZ's <code>EIP712</code> does). Callback to d38/d57: never trust input you didn't bind + verify.` },
        { id: "s2", type: "hint", label: `💡 <code>permit</code> phishing pairs with 7702 delegation (d87) as the modern wallet-signature attack surface — treat every signature prompt as a transaction.` },
      ],
    },

    /* ---------------- Week 39 ---------------- */
    {
      id: "d109", date: "2027-06-17", week: "w39", title: "Signature replay & EIP-712 typed signing (cont.)",
      theme: "Finish “Signature replay & EIP-712 typed signing” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d108", obj: SEC, cat: "read", est: 35, lead: `<b>Security ⑥</b> — how off-chain signatures get replayed, and how to stop it. (2/2)`, model: `Replay protection = <b>domain separator</b> (name, version, <b>chainId</b>, verifying contract) + a <b>nonce</b>. EIP-712 hashes structured data with that domain, so a signature is bound to one contract on one chain and shown human-readably. Omit or reuse either and it replays cross-chain, cross-contract, or twice — the nonce must be consumed on use, chainId read dynamically (to survive forks).`, cards: [
              { q: `What binds an EIP-712 signature to one place, one use?`, a: `The <b>domain separator</b> (chainId + verifying contract, …) plus a <b>nonce</b> consumed on use. Miss either → cross-chain/contract/replay.` },
              { q: `What is <code>permit</code> (EIP-2612)?`, a: `An EIP-712-signed ERC-20 approval — approve an allowance by signature instead of a separate <code>approve</code> tx. Blind-signing a max permit is a top drainer vector.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 35, label: `Then <a href="https://eips.ethereum.org/EIPS/eip-2612" target="_blank" rel="noopener">EIP-2612 permit</a> — the same machinery used to replace an approve transaction.`, lead: `<b>Security ⑥</b> — how off-chain signatures get replayed, and how to stop it.` },
          ] },
      ],
    },
    {
      id: "d110", date: "2027-06-20", week: "w39", title: "🎓 Review: Rust async — Future, Pin & the state machine",
      theme: "Review · why async fn desugars to a self-referential state machine.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 70,
          lead: `<b>Review (capstone)</b> — what your <code>.await</code> compiles into (builds on d49's ownership).`,
          sub: [
            { id: "s1", est: 40, label: `Read the std docs <a href="https://doc.rust-lang.org/std/future/trait.Future.html" target="_blank" rel="noopener">Future</a> (<code>poll(self: Pin&lt;&mut Self&gt;, cx)</code>) and <a href="https://doc.rust-lang.org/std/pin/index.html" target="_blank" rel="noopener">Pin</a>; the <a href="https://rust-lang.github.io/async-book/" target="_blank" rel="noopener">async book</a> for narrative (note: mid-rewrite).` },
            { id: "s2", cat: "exercise", est: 30, label: `Without looking, explain: why does <code>Future::poll</code> take <code>Pin&lt;&mut Self&gt;</code>?` },
          ],
          model: `An <code>async fn</code> desugars into a compiler-generated <b>state machine</b> (one variant per await point) whose variants can hold references into its own locals → <b>self-referential</b>. <b>Pin</b> guarantees the future won't move once polled (keeping those references valid) — which is exactly why <code>poll</code> takes <code>Pin&lt;&mut Self&gt;</code>. The <b>Waker</b> in the <code>Context</code> lets a pending future ask the executor to re-poll.`,
          cards: [
            { q: `What does an <code>async fn</code> compile to?`, a: `A state machine — one state per <code>.await</code> — driven by <code>poll</code>. It can hold references into its own locals, making it self-referential.` },
            { q: `Why does <code>Future::poll</code> take <code>Pin&lt;&mut Self&gt;</code>?`, a: `The state machine is self-referential after the first poll — <code>Pin</code> guarantees it won't move, keeping those references valid. The <b>Waker</b> re-schedules a pending future.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🏁 Extension I complete — the threads ran from the wire up to distributed consensus, storage engines, chains and language runtimes. <b>Extension II</b> continues right below (weeks 40–44): the "cool internals" — amortized O(1), hash maps, garbage collection, the JS heap, floats, Unicode & Bloom filters.` },
        { id: "s2", type: "hint", label: `💡 Callback to d44/d03: the executor is the event loop; the Future is the non-blocking unit; the Waker is "the fd is ready". Async, all the way down.` },
      ],
      note: "🎓 Core + Extension I done — from the OSI myth to Rust's async state machine. Extension II (data-structure & runtime internals) runs weeks 40–44.",
    },

    /* ---------------- Week 40 ---------------- */
    /* ================================================================== *
     *  EXTENSION II — "the cool internals": the data structures and runtime
     *  machinery under the code you write every day. A NEW thread —
     *  Data-structure & runtime internals — is interleaved with more Systems
     *  and language Review days (same rule: consecutive days switch topics).
     *  References verified 2026-07-18, status-flagged for fast-moving items
     *  (Go maps→Swiss tables in 1.24, Go's GC, V8's pipeline, Unicode 17).
     *  Dates 2027-06-25 → 2027-07-26.
     * ================================================================== */
    {
      id: "d111", date: "2027-06-25", week: "w40", title: "Amortized O(1): dynamic arrays & the doubling trick",
      theme: "Data-structure internals · part 1 — a rare O(n) resize, amortized to nothing.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 80,
          lead: `<b>Internals ①</b> — why "append is O(1)" is honest, and the analysis that proves it.`,
          sub: [
            { id: "s1", est: 30, label: `Read the Rust <a href="https://doc.rust-lang.org/std/vec/struct.Vec.html#method.push" target="_blank" rel="noopener">Vec::push</a> docs: append "takes <b>amortized O(1)</b> time. If the length would exceed capacity, O(capacity) to copy to a larger allocation — offset by the capacity O(1) insertions it allows."` },
            { id: "s2", est: 25, label: `The trick: a dynamic array (Vec / ArrayList / Go slice / Python list) <b>doubles</b> capacity when full and copies everything (an O(n) event). Because doublings are exponentially spaced, total copy work over n appends is ≤ 2n → O(1) each on average.` },
            { id: "s3", est: 25, label: `The growth factor is a real design choice: read folly's <a href="https://github.com/facebook/folly/blob/main/folly/docs/FBVector.md" target="_blank" rel="noopener">FBVector</a> on why <b>1.5×</b> beats 2× — with 2× a new block always exceeds the sum of all freed ones, so the allocator can never reuse them.` },
          ],
          model: `<b>Amortized</b> ≠ "average-case hope": it's a worst-case bound spread over a sequence. n appends cost ≤ 2n total work no matter when resizes hit → O(1) each — but any <i>single</i> append can still stall O(n) at a doubling (a real p99 spike when a 1 GB slice reallocates). Growth factor k trades speed vs memory reuse: k < φ≈1.618 lets freed blocks be recycled (Python ≈1.125×, folly 1.5×); k = 2 never can.`,
          cards: [
            { q: `Why is dynamic-array append O(1) if a resize copies everything?`, a: `Resizes double capacity and are exponentially spaced, so total copy work over n appends is ≤ 2n → <b>O(1) amortized</b>. A single append can still spike to O(n) at a doubling.` },
            { q: `Why grow by 1.5× instead of 2×?`, a: `With 2× a new allocation always exceeds the sum of all freed ones, so they can't be reused; a factor < φ≈1.618 (e.g. 1.5×) lets the allocator recycle freed blocks.` },
            { q: `What does "amortized O(1)" actually promise?`, a: `A worst-case bound on a <i>sequence</i> (n ops cost O(n) total) — <b>not</b> that every op is O(1). The occasional resize is real latency.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This is the same doubling trick a hash map uses when its load factor crosses the threshold (next internals day) — one O(n) rehash, amortized to O(1) per insert.` },
        { id: "s2", type: "callout", label: `🔬 Callback to d12: a resize isn't just algorithmic cost — copying a big array blows the cache and faults fresh pages. Preallocate (<code>Vec::with_capacity</code> / <code>make([]T, 0, n)</code>) when you know the size to skip both.` },
      ],
      note: "Extension II begins — the 'cool internals': the data structures and runtime machinery under the code you write daily.",
    },
    {
      id: "d112", date: "2027-06-26", week: "w40", title: "NUMA, cache coherence (MESI) & false sharing",
      theme: "Systems · part 7 — you never own a variable, you own its 64-byte cache line.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 70,
          lead: `<b>Systems ⑦</b> — why two threads touching <i>different</i> variables can still cripple each other. (1/2)`,
          sub: [
            { id: "s1", est: 40, label: `Read Ulrich Drepper, <a href="https://www.akkadia.org/drepper/cpumemory.pdf" target="_blank" rel="noopener">"What Every Programmer Should Know About Memory"</a> — the cache-coherence & NUMA parts (builds on the cache line from d12).` },
            { id: "s2", est: 30, label: `Then Martin Thompson, <a href="https://mechanical-sympathy.blogspot.com/2011/07/false-sharing.html" target="_blank" rel="noopener">"False Sharing"</a> — a benchmark + the padding fix.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d12/d104: this is the cache line again — and the acquire/release fences from the C++ memory model (d104) are what make one core's writes <i>visible</i> to another. Coherence + ordering are two halves of shared-memory truth.` },
        { id: "s2", type: "hint", label: `💡 The classic tell: an array of per-thread counters that gets <i>slower</i> with more threads. They're colliding on cache lines — pad each to its own line and it scales.` },
      ],
    },
    {
      id: "d113", date: "2027-06-29", week: "w40", title: "NUMA, cache coherence (MESI) & false sharing (cont.)",
      theme: "Finish “NUMA, cache coherence (MESI) & false sharing” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d112", obj: SYS, cat: "read", est: 25,
          lead: `<b>Systems ⑦</b> — why two threads touching <i>different</i> variables can still cripple each other. (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `Coherence runs at <b>cache-line</b> (~64 B) granularity via <b>MESI</b> (Modified / Exclusive / Shared / Invalid): to write a line a core must own it Exclusive, so writing a Shared line invalidates every other core's copy.`, info: `<p>Each core has its own L1/L2 cache, so hardware needs a protocol to stop two cores disagreeing about a memory location. <b>MESI</b> tags every cache line with one of four states:</p>
<ul>
<li><b>Modified</b> — this core has the only copy, and it's dirty.</li>
<li><b>Exclusive</b> — only copy, clean.</li>
<li><b>Shared</b> — clean; other cores may also hold it.</li>
<li><b>Invalid</b> — stale, must re-fetch.</li>
</ul>
<p>To <i>write</i>, a core must first own the line <b>Exclusive</b>, which <b>invalidates every other core's copy</b>. This is why <b>false sharing</b> is slow: two threads writing different variables that happen to share one 64-byte line keep stealing it from each other, even though they never touch the same data.</p>` },
          ],
          model: `<b>False sharing</b>: two cores repeatedly write different variables that happen to share one cache line — no logical dependency, but each write invalidates the other's copy, so the line <b>ping-pongs</b> across the interconnect and throughput collapses. Fix by <i>layout</i>: pad/align to separate lines (<code>alignas(64)</code>, C++17 <code>hardware_destructive_interference_size</code>, per-thread structs). <b>NUMA</b>: remote memory is ~1.5–2× slower, and Linux places a page on the node that <b>first writes</b> it (first-touch) — not where you malloc'd it.`,
          cards: [
            { q: `What is false sharing?`, a: `Two cores writing <i>different</i> variables on the <b>same cache line</b> — each write invalidates the other's copy, so the line ping-pongs across cores. A pure layout/perf bug, not a correctness one.` },
            { q: `On which NUMA node does a freshly-malloc'd page live?`, a: `The node of the thread that <b>first writes</b> it (first-touch) — not where <code>malloc</code> ran. So initialize memory on the worker thread that will use it.` },
            { q: `Why isn't 64 bytes always safe for padding?`, a: `Apple M-series use 128 B lines and x86 adjacent-line prefetch couples pairs — so <code>hardware_destructive_interference_size</code> is often <b>128</b>. Pad to 128 to be safe.` },
          ] },
      ],
    },

    /* ---------------- Week 41 ---------------- */
    {
      id: "d114", date: "2027-06-30", week: "w41", title: "Hash maps: why O(1), collisions & Swiss tables",
      theme: "Data-structure internals · part 2 — expected O(1), and how it degrades to O(n).",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 80,
          lead: `<b>Internals ②</b> — the structure you reach for daily, and why its O(1) has fine print.`,
          sub: [
            { id: "s1", est: 30, label: `The model: a good hash spreads keys so expected bucket occupancy is the <b>load factor</b> α = n/m; lookup is O(1+α). Cross the threshold (Java 0.75) → <b>double + rehash</b> (O(n), amortized O(1) — the same trick as d111).` },
            { id: "s2", est: 25, label: `Collisions resolve two ways: <b>separate chaining</b> (bucket holds a list/tree; Java 8+ treeifies long chains to O(log n)) vs <b>open addressing</b> (probe in-array — better cache locality, needs α < 1).`,
              info: `<p>Two keys can hash to the same bucket; the two classic resolutions:</p>
<ul>
<li><b>Separate chaining</b> — each bucket holds a list (Java 8+ upgrades a long list to a balanced tree, so a degenerate bucket is <code>O(log n)</code> not <code>O(n)</code>). Simple, tolerates load factor &gt; 1.</li>
<li><b>Open addressing</b> — on collision, probe for the next free slot in the array itself (linear / quadratic / double hashing). Better cache locality (no pointer chasing) but needs load factor <b>α &lt; 1</b> and tombstones on delete.</li>
</ul>
<p>Both keep average lookup near <code>O(1)</code> while α stays bounded — cross the threshold and the map doubles + rehashes (the same amortized trick as the dynamic array in d111).</p>` },
            { id: "s3", est: 25, label: `Modern layout: read Abseil's <a href="https://abseil.io/about/design/swisstables" target="_blank" rel="noopener">Swiss Tables</a> — open addressing + a parallel array of 1-byte control words, SIMD-scanned a group at a time (Go's built-in map adopted this in <a href="https://go.dev/blog/swisstable" target="_blank" rel="noopener">Go 1.24</a>).` },
          ],
          model: `"O(1)" is <b>expected / amortized</b>, not worst-case: adversarial or unlucky keys can pile into one bucket → O(n). That's exploitable — <b>hash-flooding DoS</b> feeds colliding keys to force O(n²); the fix is a keyed PRF hash, <b>SipHash</b>, seeded per-process so collisions are unpredictable (Python, Rust, Ruby default to it). Swiss/flat maps store entries inline (no per-node alloc) for cache locality; a SIMD compare on control bytes checks ~16 slots at once.`,
          cards: [
            { q: `Is a hash-map lookup O(1)?`, a: `<b>Expected</b> O(1+α) with a good hash and bounded load factor — but worst case is O(n) (O(log n) if buckets treeify) when keys collide.` },
            { q: `What is hash-flooding, and the fix?`, a: `An attacker submits keys that all collide → O(n) per op, O(n²) overall. Fix: a <b>keyed hash (SipHash)</b> seeded with a per-process secret so collisions are unpredictable.` },
            { q: `Chaining vs open addressing?`, a: `Chaining: buckets hold lists (tolerates α>1, more pointer-chasing). Open addressing (Swiss tables): probe in-array, inline storage, great cache locality, needs α<1.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d111: the O(n) rehash on a doubling amortizes to O(1) per insert — hash maps and dynamic arrays share the exact same trick.` },
        { id: "s2", type: "callout", label: `🔬 "Go maps are chained buckets" is now outdated — Go 1.24 (2025) switched the built-in map to Swiss Tables. And your <code>HashMap</code> iteration order changing across runs is SipHash's per-process seed, not a bug.` },
      ],
    },
    {
      id: "d115", date: "2027-07-03", week: "w41", title: "Review: V8 & the JS heap — shapes, inline caches & Orinoco GC",
      theme: "Review · the engine under every line of JavaScript you ship.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 65,
          lead: `<b>Review</b> — why "just an object" is secretly a typed shape, and how V8 collects it.`,
          sub: [
            { id: "s1", est: 25, label: `Read Mathias Bynens, <a href="https://mathiasbynens.be/notes/shapes-ics" target="_blank" rel="noopener">"Shapes and Inline Caches"</a> + V8's <a href="https://v8.dev/docs/hidden-classes" target="_blank" rel="noopener">hidden classes</a> doc.` },
            { id: "s2", est: 20, label: `Then V8's <a href="https://v8.dev/blog/trash-talk" target="_blank" rel="noopener">"Trash Talk"</a> on the <b>Orinoco</b> GC (generational: a Scavenger young-gen + concurrent mark-sweep-compact old-gen).` },
            { id: "s3", cat: "exercise", est: 20, label: `Without looking, explain aloud: why does assigning object properties in a <i>different order</i> make code slower?` },
          ],
          model: `Every object has a <b>hidden class</b> (V8 calls it a <b>Map</b>, unrelated to the <code>Map</code> builtin) mapping property→offset; objects given the same properties <i>in the same order</i> share one. <b>Inline caches</b> memoize Map→offset at each access site: monomorphic (1 shape — fast, inlinable) → polymorphic → megamorphic (falls back to a dictionary lookup). GC is generational: the <b>Scavenger</b> copies survivors in a semispace young gen (minor GC), promoting to an old gen collected by concurrent mark-sweep-compact. <code>delete</code> or out-of-order init drops an object to slow dictionary mode.`,
          cards: [
            { q: `What is a V8 "hidden class" (Map / Shape)?`, a: `A runtime-built descriptor mapping property → offset; objects given the same properties <b>in the same order</b> share one, so a single pointer compare identifies the shape.` },
            { q: `Monomorphic vs megamorphic call site?`, a: `An inline cache sees 1 shape (monomorphic — fast, inlinable) vs many (megamorphic — falls back to a generic dictionary lookup). Keep hot sites monomorphic.` },
            { q: `V8's young-generation collector?`, a: `The <b>Scavenger</b> — a semispace copying collector (minor GC); survivors are promoted to the old generation (concurrent mark-sweep-compact). Part of the Orinoco project.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Review tasks re-derive runtime models you already use (Rust d49, Go d73, Python d88, C++ d104, Rust async d110). This is the JS engine's turn.` },
        { id: "s2", type: "hint", label: `💡 Don't conflate <b>Oilpan</b> (V8's GC for C++/DOM objects) with <b>Orinoco</b> (the JS-heap collector) — different heaps, different collectors. "Shape" is the ecosystem word; V8's source says "Map".` },
      ],
    },
    {
      id: "d116", date: "2027-07-04", week: "w41", title: "Review: V8 & the JS heap — shapes, inline caches & Orinoco GC (cont.)",
      theme: "Finish “Review: V8 & the JS heap — shapes, inline caches & Orinoco GC” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d115", obj: COMP, cat: "read", est: 65, lead: `<b>Compiler lens</b> — the shapes above only pay off because V8 <i>compiles</i> hot JS. Walk the Ignition → TurboFan tiering.`, model: `V8 is a <b>tiered JIT</b>, not "an interpreter". Source is parsed to an AST, then <b>Ignition</b> compiles it to compact <b>bytecode</b> and interprets it while collecting <b>type feedback</b> (which shapes actually flow through each site). Hot functions are handed to optimizing compilers — <b>Sparkplug</b> (fast baseline), <b>Maglev</b> (mid-tier), <b>TurboFan</b> (top-tier, speculative) — which <b>speculate</b> on that feedback (e.g. "this is always a small int") and emit specialized machine code. If a speculation later breaks (a different shape appears), it <b>deoptimizes</b> — bails back to Ignition bytecode. This is exactly why monomorphic, stable-shape code is fast: it keeps the inline caches and the JIT's speculation valid.`, cards: [
              { q: `What are Ignition and TurboFan?`, a: `<b>Ignition</b> = V8's bytecode compiler + interpreter that also gathers type feedback; <b>TurboFan</b> = the top-tier optimizing JIT that speculatively compiles hot functions to machine code using that feedback (Sparkplug/Maglev sit between).` },
              { q: `What is deoptimization and what triggers it?`, a: `When an optimizing tier's speculation is invalidated at runtime (e.g. a new object shape / unexpected type), V8 discards the optimized code and falls back to Ignition bytecode — then may re-optimize later.` },
              { q: `Why does keeping call sites monomorphic help the JIT (not just the ICs)?`, a: `Stable shapes keep the type feedback that TurboFan speculates on valid, so hot code stays optimized instead of repeatedly deoptimizing back to bytecode.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 35, label: `Read V8’s <a href="https://v8.dev/blog/launching-ignition-and-turbofan" target="_blank" rel="noopener">"Launching Ignition and TurboFan"</a> — the interpreter/optimizer pair, and why both exist.`, lead: `<b>Compiler lens</b> — the shapes above only pay off because V8 <i>compiles</i> hot JS. Walk the Ignition → TurboFan tiering.` },
            { id: "s2", cat: "read", est: 30, label: `Then skim <a href="https://v8.dev/blog/maglev" target="_blank" rel="noopener">Maglev</a> — the mid-tier added between Sparkplug and TurboFan, and what it is for.`, lead: `<b>Compiler lens</b> — the shapes above only pay off because V8 <i>compiles</i> hot JS. Walk the Ignition → TurboFan tiering.` },
          ] },
      ],
    },

    /* ---------------- Week 42 ---------------- */
    {
      id: "d117", date: "2027-07-08", week: "w42", title: "Garbage collection: tracing, generational & tri-color",
      theme: "Data-structure internals · part 3 — reclaim the unreachable without stopping the world.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 80,
          lead: `<b>Internals ③</b> — the collectors under every managed runtime (contrast d115's V8, d73's Go). (1/2)`,
          sub: [
            { id: "s1", est: 30, label: `The two families: <b>tracing</b> (mark from roots, reclaim the unreachable) vs <b>reference counting</b> (free at count 0 — prompt, but can't collect <i>cycles</i>, so CPython adds a backup tracer).`, info: `<p>Two fundamental ways a runtime reclaims memory:</p>
<ul>
<li><b>Tracing GC</b> (JVM, Go, C#, V8) — periodically start from the <b>roots</b> (stack, globals), mark everything reachable, reclaim the rest. Handles cycles naturally; the cost is pause time + tracing work.</li>
<li><b>Reference counting</b> (CPython, Swift, <code>shared_ptr</code>) — each object counts its references and frees the instant the count hits 0. Prompt and incremental, but <b>can't reclaim cycles</b> (A→B→A never reach 0) — which is why CPython bolts on a backup <i>tracing</i> collector just for cycles.</li>
</ul>
<p>Neither is "the" GC — real runtimes mix them, and tracing collectors add generations (d117.s3) on top.</p>` },
            { id: "s2", est: 25, label: `Read the <a href="https://go.dev/doc/gc-guide" target="_blank" rel="noopener">Go GC guide</a> — the knobs, and the cost model behind them.` },
            { id: "s3", est: 25, label: `Then Rick Hudson’s <a href="https://go.dev/blog/ismmkeynote" target="_blank" rel="noopener">"Getting to Go"</a> — a real low-latency concurrent collector, and what it took.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d115: V8 <i>is</i> generational + moving (the copying Scavenger); Go is neither. Two valid, opposite answers to the same problem — know why each chose as it did.` },
        { id: "s2", type: "hint", label: `💡 As of 2026 Go's GC is still concurrent non-generational mark-sweep; an experimental page-scanning "Green Tea" collector (<code>GOEXPERIMENT=greenteagc</code>, Go 1.25) is being trialed for better locality.` },
      ],
    },
    {
      id: "d118", date: "2027-07-12", week: "w42", title: "The heap allocator: malloc, size classes & fragmentation",
      theme: "Systems · part 8 — what actually happens on malloc(), and why free() doesn't shrink RSS.",
      tasks: [
        { id: "t1", carried: "d117", obj: CORE, cat: "read", est: 25,
          lead: `<b>Internals ③</b> — the collectors under every managed runtime (contrast d115's V8, d73's Go). (2/2)`,
          sub: [
            { id: "s1", est: 25, label: `The <b>generational hypothesis</b> ("most objects die young") + a <b>write barrier</b>/remembered set let you collect a small young gen often and the old gen rarely.` },
          ],
          model: `<b>Tri-color marking</b>: white (unreached) / grey (reached, children unscanned) / black (done); the invariant is "no black→white pointer without a grey between", and a <b>write barrier</b> on pointer writes preserves it while the mutator runs concurrently. Reclamation styles: mark-<b>sweep</b> (fast, fragments), mark-<b>compact</b> (defrags, costlier), <b>copying</b> (bump-allocate, wastes half the heap). Modern concurrent GCs (Go, ZGC, Shenandoah) hold pauses sub-millisecond.`,
          cards: [
            { q: `Why can't reference counting reclaim everything?`, a: `<b>Cycles</b> — a self-referential island keeps counts > 0 forever. Refcounting needs a backup tracer (CPython) or weak refs.` },
            { q: `Tri-color marking — the colors and the barrier?`, a: `White (unreached) / grey (reached, unscanned) / black (scanned). A <b>write barrier</b> on pointer writes keeps "no black→white", so marking can run concurrently with the program.` },
            { q: `Is Go's GC generational?`, a: `No — it's deliberately <b>non-generational and non-moving</b> concurrent tri-color mark-sweep (escape analysis stack-allocates most short-lived objects instead). A common interview trap.` },
          ] },
        { id: "t2", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ⑧</b> — the allocator sitting between your code and the kernel's pages. (1/2)`,
          sub: [
            { id: "s1", est: 25, label: `Read Doug Lea’s <a href="https://gee.cs.oswego.edu/dl/html/malloc.html" target="_blank" rel="noopener">"A Memory Allocator"</a> — dlmalloc, the design behind glibc.` },
            { id: "s2", est: 25, label: `Then Google’s <a href="https://google.github.io/tcmalloc/design.html" target="_blank" rel="noopener">tcmalloc design</a> — per-thread caches and size classes, for the multithreaded case.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d61/d77: brk/mmap hand you virtual pages; the allocator sub-divides them. "Out of memory" from fragmentation isn't a leak — the bytes are free, just not contiguous.` },
        { id: "s2", type: "callout", label: `🔬 This is why long-running services swap in jemalloc/tcmalloc: better fragmentation behavior and per-CPU caching under many-thread load than default glibc ptmalloc.` },
      ],
    },
    {
      id: "d119", date: "2027-07-13", week: "w42", title: "The heap allocator: malloc, size classes & fragmentation (cont.)",
      theme: "Finish “The heap allocator: malloc, size classes & fragmentation” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d118", obj: SYS, cat: "read", est: 35,
          lead: `<b>Systems ⑧</b> — the allocator sitting between your code and the kernel's pages. (2/2)`,
          sub: [
            { id: "s1", est: 35, label: `Small requests grow the heap via <b>brk</b>/sbrk; large ones (glibc ≥ 128 KB) go straight to <b>mmap</b> (and are unmapped on free). Otherwise <code>free</code> returns blocks to internal <b>bins</b>, not the OS.` },
          ],
          model: `Allocators bin free blocks by <b>size class</b> so alloc/free is an O(1) list pop/push with no search — the cost is <b>internal fragmentation</b> (a 12-byte request rounds up to a 16-byte class). <b>Boundary tags</b> let adjacent free chunks <b>coalesce</b>, fighting <b>external fragmentation</b> (free memory scattered too finely to satisfy a big request). Per-thread caches (glibc tcache, tcmalloc per-CPU) make the common path lock-free; multiple <b>arenas</b> avoid one global lock.`,
          cards: [
            { q: `Does <code>free()</code> return memory to the OS?`, a: `Usually no — it returns the block to allocator <b>free lists/bins</b> (RSS stays high). Only large <code>mmap</code>'d blocks are actually unmapped.` },
            { q: `Why do allocators use size classes?`, a: `Rounding to fixed classes makes alloc/free an O(1) bin pop/push (every block in a bin is interchangeable) — trading a little <b>internal</b> fragmentation for speed + less external fragmentation.` },
            { q: `Internal vs external fragmentation?`, a: `Internal = wasted space <i>inside</i> a block (rounding/metadata); external = free memory scattered in pieces too small to place a large request contiguously.` },
          ] },
      ],
    },

    /* ---------------- Week 43 ---------------- */
    {
      id: "d120", date: "2027-07-17", week: "w43", title: "IEEE 754: why 0.1 + 0.2 ≠ 0.3",
      theme: "Data-structure internals · part 4 — floats are exact binary fractions, just not the ones you typed.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 85,
          lead: `<b>Internals ④</b> — the number format that surprises everyone, made unsurprising.`,
          sub: [
            { id: "s1", est: 25, label: `Read <a href="https://floating-point-gui.de/" target="_blank" rel="noopener">floating-point-gui.de</a> for the intuition — why the format can’t hold 0.1.` },
            { id: "s2", est: 35, label: `Then skim Goldberg’s canonical <a href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html" target="_blank" rel="noopener">"What Every Computer Scientist Should Know About Floating-Point Arithmetic"</a> — rounding, guard digits, and cancellation.` },
            { id: "s3", est: 25, label: `See it: every language prints <code>0.1 + 0.2 = 0.30000000000000004</code> (<a href="https://0.30000000000000004.com/" target="_blank" rel="noopener">0.30000000000000004.com</a>).` },
          ],
          model: `A <code>double</code> is 64 bits: 1 sign + 11 exponent (bias 1023) + 52 fraction, with an implicit leading 1 → 53 bits ≈ 15–17 significant decimals. 0.1 and 0.2 have <b>no finite binary expansion</b> (like 1/3 in decimal), so each is stored as the nearest double and their sum rounds to a value ≠ the nearest double to 0.3. Default rounding is <b>round-to-nearest, ties-to-even</b>. Specials: ±Inf, NaN (and <b>NaN ≠ NaN</b>), signed zeros. <b>Money uses integer minor units or a decimal type</b>, never binary floats.`,
          cards: [
            { q: `Why is <code>0.1 + 0.2 ≠ 0.3</code>?`, a: `0.1 and 0.2 have no finite <b>binary</b> expansion, so each is rounded to the nearest double; their sum rounds to 0.30000000000000004 ≠ the nearest double to 0.3. Correct rounding, not a bug.` },
            { q: `Layout of a 64-bit double?`, a: `1 sign + 11 exponent (bias 1023) + 52 fraction, implicit leading 1 → <b>53 bits</b> of precision ≈ 15–17 significant decimal digits.` },
            { q: `How should you represent money?`, a: `Integer <b>minor units</b> (cents) or an exact <b>decimal</b> type — never binary floating point, which can't represent 0.10 and accumulates error.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Never compare floats with <code>==</code> (compare within an epsilon), and remember <code>NaN != NaN</code> — the only value not equal to itself (use <code>isNaN</code>). <b>Catastrophic cancellation</b>: subtracting near-equal values annihilates significant digits.` },
        { id: "s2", type: "hint", label: `💡 Floats are fully <b>deterministic</b>, not random — same ops, same bits, per IEEE 754 (current edition 754-2019). The "error" is representation, not chance.` },
      ],
    },
    {
      id: "d121", date: "2027-07-18", week: "w43", title: "Review: the JVM — tiered JIT, warmup & deoptimization",
      theme: "Review · why the JVM starts slow, gets fast, and can briefly re-slow.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 80,
          lead: `<b>Review</b> — how HotSpot turns bytecode into specialized native code at runtime (contrast d73's Go, d88's Python).`,
          sub: [
            { id: "s1", est: 25, label: `Read the <a href="https://docs.oracle.com/en/java/javase/21/vm/" target="_blank" rel="noopener">Java Virtual Machine Guide</a> — HotSpot compilation, as the vendor documents it.` },
            { id: "s2", est: 25, label: `Then OpenJDK’s <a href="https://wiki.openjdk.org/display/HotSpot/" target="_blank" rel="noopener">HotSpot wiki</a> — tiered compilation and deoptimization.` },
            { id: "s3", cat: "exercise", est: 30, label: `Without looking, explain aloud: why is a Java microbenchmark meaningless until it's "warmed up"?` },
          ],
          model: `HotSpot runs bytecode in an <b>interpreter</b>, then JIT-compiles <i>hot</i> methods with two compilers — <b>C1</b> (fast, light) and <b>C2</b> (slow, aggressive). <b>Tiered compilation</b> (levels 0–4) interprets + profiles, compiles at C1 with profiling, then recompiles the hottest at C2 using that profile (inlining, devirtualization, escape analysis). <b>On-stack replacement</b> swaps a long-running loop to compiled code mid-execution. <b>Deoptimization</b>: when a speculative assumption breaks (a call site thought monomorphic sees a new type), it bails back to the interpreter — why perf can briefly regress.`,
          cards: [
            { q: `Why is the JVM slow at first, then fast?`, a: `It <b>interprets + profiles</b> cold code, then JIT-compiles hot methods (C1 → C2) using the profile for aggressive speculative optimization. Cold code stays interpreted.` },
            { q: `What is deoptimization?`, a: `When a speculative assumption breaks (e.g. a call site thought monomorphic sees a new type), HotSpot <b>bails compiled code back to the interpreter</b> and may recompile — a brief slowdown.` },
            { q: `C1 vs C2 in tiered compilation?`, a: `C1 ("client") compiles fast with light optimization + profiling; C2 ("server") compiles the hottest methods slowly with aggressive optimization. Tiered mode uses <b>both</b>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d115: HotSpot's monomorphic-call-site specialization + deopt is the same idea as V8's inline caches — profile the common case, guard it, fall back when the guard fails.` },
        { id: "s2", type: "callout", label: `🧭 As of 2026 the built-in Graal JIT was removed from OpenJDK (JDK 17); GraalVM is a separate distribution (Graal compiler + native-image AOT). Warmup work continues in Project Leyden.` },
      ],
    },
    {
      id: "d122", date: "2027-07-20", week: "w43", title: "Unicode, UTF-8 & grapheme clusters",
      theme: "Data-structure internals · part 5 — 'length' has four different answers.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 80,
          lead: `<b>Internals ⑤</b> — why string handling breaks on emoji, and the model that fixes it.`,
          sub: [
            { id: "s1", est: 25, label: `Read Joel Spolsky’s <a href="https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/" target="_blank" rel="noopener">"The Absolute Minimum… about Unicode"</a>.` },
            { id: "s2", est: 25, label: `Then the <a href="https://utf8everywhere.org/" target="_blank" rel="noopener">UTF-8 Everywhere</a> manifesto — one encoding, and the bugs that picking another one buys you.` },
            { id: "s3", est: 30, label: `Keep four layers distinct: <b>code point</b> (U+…) → <b>code unit</b> (8/16/32-bit per encoding) → <b>byte</b> → <b>grapheme cluster</b> (one user-perceived character).` },
          ],
          model: `<b>Unicode</b> is the character set; <b>UTF-8/16/32</b> are encodings of it. UTF-8 is variable 1–4 bytes, ASCII-compatible and <b>self-synchronizing</b>. UTF-16 (JS/Java/C# in memory) is <i>also</i> variable — non-BMP chars need a <b>surrogate pair</b>, so JS <code>"😀".length === 2</code>. "One character" is a <b>grapheme cluster</b> that can be many code points (é = e + combining accent; a family emoji is ~7 ZWJ-joined code points, one glyph). Compare after <b>normalizing</b> (NFC for storage).`,
          cards: [
            { q: `Why is <code>"😀".length === 2</code> in JavaScript?`, a: `JS strings are <b>UTF-16</b>; a non-BMP char needs a <b>surrogate pair</b> (two 16-bit code units), and <code>.length</code> counts code units, not characters.` },
            { q: `Code point vs grapheme cluster?`, a: `A code point is one U+ integer; a <b>grapheme cluster</b> is one user-perceived character — which may be many code points (combining marks, ZWJ emoji). Neither equals a byte or a UTF-16 unit.` },
            { q: `What makes UTF-8 self-synchronizing?`, a: `Lead bytes (<code>0/110/1110/11110…</code>) and continuation bytes (<code>10…</code>) are disjoint, so a character boundary is findable from any byte — plus it's 1–4 bytes and ASCII-compatible.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Truncating/reversing a string by code unit splits emoji and mangles accents. For a user-visible count use a grapheme segmenter (<code>Intl.Segmenter</code>, ICU) — <code>.length</code>/<code>len()</code>/<code>strlen</code> give units, code points, or bytes respectively.` },
        { id: "s2", type: "hint", label: `💡 Callback to d25: hashes/signatures operate on <b>bytes</b>, so always hash a defined encoding (UTF-8, usually NFC-normalized) — the same text in NFC vs NFD hashes differently. Unicode 17.0 is current (2025).` },
      ],
    },

    /* ---------------- Week 44 ---------------- */
    {
      id: "d123", date: "2027-07-22", week: "w44", title: "Branch prediction & speculative execution (Spectre)",
      theme: "Systems · part 9 — the CPU guesses your branches, and Spectre is the bill.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 80,
          lead: `<b>Systems ⑨</b> — why a sorted array runs faster, and why speculation broke CPU security.`,
          sub: [
            { id: "s1", est: 20, label: `Read the famous <a href="https://stackoverflow.com/questions/11227809/" target="_blank" rel="noopener">"Why is processing a sorted array faster?"</a> answer.` },
            { id: "s2", est: 30, label: `Then Dan Luu’s <a href="https://danluu.com/branch-prediction/" target="_blank" rel="noopener">branch-prediction</a> walkthrough — how predictors actually got good.` },
            { id: "s3", est: 30, label: `For the security fallout, skim <a href="https://spectreattack.com/" target="_blank" rel="noopener">Spectre</a> + <a href="https://meltdownattack.com/" target="_blank" rel="noopener">Meltdown</a> (2018).` },
          ],
          model: `A deep pipelined out-of-order CPU must <b>predict</b> each branch and execute <b>speculatively</b> down the guess; a misprediction flushes the pipeline (~10–20 cycles). A <b>sorted</b> array makes <code>if (x >= 128)</code> a long predictable run (~100% accuracy); unsorted is ~50/50 → constant flushes. Rollback restores <b>architectural</b> state but <i>not</i> microarchitectural state — the cache keeps the residue, and <b>Spectre</b> reads a secret out of it via cache timing. <b>Meltdown</b> ≠ Spectre: it transiently reads kernel memory across the user/kernel boundary (fixed by page-table isolation).`,
          cards: [
            { q: `Why does a sorted array process faster than an unsorted one?`, a: `The data-dependent branch becomes highly <b>predictable</b> (long runs of one outcome, ~100% accuracy); unsorted is ~50/50, so the CPU pays a pipeline-flush penalty on ~half the iterations.` },
            { q: `Why doesn't rollback of speculation prevent Spectre?`, a: `Architectural state (registers/memory) is rolled back, but <b>cache/TLB state is not</b> — the secret's footprint remains and is read via a cache-timing side channel.` },
            { q: `Spectre vs Meltdown?`, a: `Meltdown reads kernel memory across the user/kernel boundary (fixed by KPTI page-table isolation, mainly Intel). Spectre mistrains the predictor to make a victim leak its <i>own</i> memory — a whole class, hard to fully fix.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Branchless code (masks / <code>cmov</code> / SIMD) only wins when the branch is <i>unpredictable</i> — a well-predicted branch is nearly free. Measure before de-branching.` },
        { id: "s2", type: "callout", label: `🔬 Callback to d12: this is the memory hierarchy weaponized — the cache side-channel that makes speculation observable. Speculation is fundamental to all fast CPUs (Intel/AMD/ARM), so the class keeps spawning variants.` },
      ],
    },
    {
      id: "d124", date: "2027-07-26", week: "w44", title: "🎓 Bloom filters & probabilistic data structures",
      theme: "Data-structure internals · part 6 — trade a little accuracy for enormous space savings.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 80,
          lead: `<b>Internals ⑥ (capstone)</b> — the sketches that answer set/count questions in kilobytes.`,
          sub: [
            { id: "s1", est: 30, label: `Read the <a href="https://en.wikipedia.org/wiki/Bloom_filter" target="_blank" rel="noopener">Bloom filter</a> overview — the math, the false-positive rate, and where it is used.` },
            { id: "s2", est: 20, label: `Then play with the <a href="https://llimllib.github.io/bloomfilter-tutorial/" target="_blank" rel="noopener">interactive visual tutorial</a> until the bit pattern is obvious.` },
            { id: "s3", est: 30, label: `Place its siblings: <b>HyperLogLog</b> (cardinality — d29's Redis <code>PFCOUNT</code>) and <b>Count-Min Sketch</b> (frequency). All hash-based, sublinear-space, one-sided error.` },
          ],
          model: `A <b>Bloom filter</b> is an m-bit array + k hashes: insert sets k bits; query checks them — any 0 ⇒ <b>definitely absent</b>, all 1 ⇒ <i>possibly</i> present. So it has <b>no false negatives</b>, only tunable false positives (~9.6 bits/element for 1%), at O(k) per op independent of item size. You can't delete from a plain one (shared bits) — use a counting variant. The classic use: skip a disk read in an <b>LSM-tree</b> (d99) when the filter says a key isn't in an SSTable.`,
          cards: [
            { q: `What can a Bloom filter never do?`, a: `Give a <b>false negative</b> — "absent" is always true. It only has tunable <b>false positives</b> ("possibly present"), in O(k) time and ~9.6 bits/element at 1%.` },
            { q: `Bloom vs HyperLogLog vs Count-Min Sketch?`, a: `Bloom = set <b>membership</b>; HLL = <b>cardinality</b> (count-distinct, d29); Count-Min = per-item <b>frequency</b>. All hash-based & sublinear, but not interchangeable.` },
            { q: `Where do LSM-tree engines use Bloom filters?`, a: `One per SSTable — a point lookup skips reading that file from disk when the filter says the key is <b>definitely not</b> there (callback d99).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🎓 Extension II complete — wire → runtime → data structure. From the OSI myth to why a hash map is O(1). One thread left: how the languages themselves are built.` },
        { id: "s2", type: "hint", label: `💡 Callback to d29/d99: you met HyperLogLog (Redis) and Bloom filters (LSM-trees) in passing — now you own the machinery. Reach for a sketch when exact answers cost too much memory.` },
      ],
      note: "🎓 Extension II complete — data-structure & runtime internals owned. Extension III (weeks 45–48) closes the loop: how compilers & interpreters actually turn your code into behavior.",
    },

    /* ---------------- Week 45 ---------------- */
    /* ==================================================================== *
     *  EXTENSION III — "how the languages are built" (authored 2026-07-21)
     *  A new COMPILERS & INTERPRETERS thread (COMP), interleaved day-by-day
     *  with language-implementation REVIEWs so consecutive days still switch
     *  lens. Complements (does NOT duplicate) the interp-go roadmap: that one
     *  BUILDS a toy interpreter in Go; this one dissects how REAL production
     *  implementations (CPython, gc, the JVM, V8, LLVM) do it. Also seeded
     *  earlier by "Compiler lens" tasks woven into d101 (eBPF verifier/JIT),
     *  d104 (the as-if rule) and d115 (Ignition/TurboFan).
     * ==================================================================== */
    {
      id: "d125", date: "2027-07-31", week: "w45", dow: "Sat", title: "A map of the territory: interpreters, compilers & JITs",
      theme: "Compilers · part 1 — the whole pipeline, and the words for each stage.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 75, lead: `<b>Compilers ①</b> — the vocabulary and the shape of every language implementation, before we build one.`, model: `Every implementation climbs the same mountain: <b>scanning</b> (text → tokens) → <b>parsing</b> (tokens → AST) → <b>static analysis</b> (binding/typing) → an <b>intermediate representation</b> → down the far side to <b>code generation</b>. Where you stop and how you run it names the tool: a <b>tree-walking interpreter</b> executes the AST directly; a <b>bytecode VM</b> lowers to its own instruction set and interprets that; an <b>AOT compiler</b> emits native code ahead of time; a <b>JIT</b> compiles hot code to native <i>at runtime</i> using profiling. "Compiler vs interpreter" is a false binary — CPython compiles <i>to bytecode</i> then interprets; V8 interprets <i>then</i> JITs. It's a spectrum of when you translate.`, cards: [
              { q: `Name the stages of the classic compiler "mountain".`, a: `Scanning (→ tokens) → parsing (→ AST) → static analysis (binding/typing) → intermediate representation → optimization → code generation. Front end goes up, back end comes down.` },
              { q: `Tree-walk vs bytecode-VM vs AOT vs JIT?`, a: `Tree-walk runs the AST directly (simple, slow); bytecode-VM lowers to its own ISA and interprets that; AOT emits native code before running; JIT compiles hot code to native at runtime using profiles.` },
              { q: `Why is "compiler vs interpreter" a false dichotomy?`, a: `Most real systems are both — CPython compiles source to bytecode then interprets it; V8 interprets JS then JIT-compiles hot functions. It's a spectrum of <i>when</i> translation happens, not either/or.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 45, label: `Read Crafting Interpreters, <a href="https://craftinginterpreters.com/a-map-of-the-territory.html" target="_blank" rel="noopener">"A Map of the Territory"</a> (the mountain diagram: scanning → parsing → analysis → codegen).`, lead: `<b>Compilers ①</b> — the vocabulary and the shape of every language implementation, before we build one.` },
            { id: "s2", cat: "read", est: 30, label: `Then Wikipedia's <a href="https://en.wikipedia.org/wiki/Just-in-time_compilation" target="_blank" rel="noopener">Just-in-time compilation</a> to place JIT against AOT and pure interpretation.`, lead: `<b>Compilers ①</b> — the vocabulary and the shape of every language implementation, before we build one.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This thread dissects how <b>real</b> engines work; the interp-go roadmap has you <b>build</b> a toy one. Two halves of the same skill — theory here, hands-on there.` },
        { id: "s2", type: "callout", label: `🧭 Keep the mountain diagram in your head — every later day (lexing, parsing, VMs, SSA, JITs) is one stretch of that same climb.` },
      ],
    },
    {
      id: "d126", date: "2027-08-03", week: "w45", dow: "Tue", title: "Review: how CPython runs your code — bytecode & the eval loop",
      theme: "Review · the interpreter you use daily, opened up.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 65, lead: `<b>Review</b> — Python isn't "interpreted line by line": it's compiled to bytecode and run by a loop. See it.`, model: `CPython <b>compiles</b> each function to a <code>code</code> object of stack-based <b>bytecode</b> (see it with <code>dis</code>), then the eval loop (<code>_PyEval_EvalFrameDefault</code>, historically "ceval") executes it: a big dispatch over opcodes operating on a per-call <b>frame</b> (its own value stack + locals). It's a <b>stack machine</b> — <code>LOAD_FAST</code> pushes, <code>BINARY_OP</code> pops two and pushes the result. 3.11+ made it much faster via a faster frame layout and <b>adaptive specializing</b> (PEP 659): hot opcodes rewrite themselves in place to type-specialized variants (<code>BINARY_OP</code> → <code>BINARY_OP_ADD_INT</code>) — a small in-interpreter JIT-of-sorts, and 3.13+ ships an experimental real JIT.`, cards: [
              { q: `What does CPython actually execute?`, a: `Not source text — it compiles each function to a <code>code</code> object of <b>stack-based bytecode</b> (inspect via <code>dis</code>), which the eval loop dispatches opcode by opcode over a per-call <b>frame</b>.` },
              { q: `Is CPython a stack or register machine?`, a: `A <b>stack machine</b>: <code>LOAD_FAST</code> pushes a local, <code>BINARY_OP</code> pops two operands and pushes the result. (Contrast register-based bytecode like Lua/Dalvik.)` },
              { q: `What did PEP 659 (3.11+) add?`, a: `<b>Adaptive specialization</b>: hot generic opcodes rewrite themselves in place into type-specialized forms (e.g. <code>BINARY_OP_ADD_INT</code>) using observed types — a quickening step short of a full JIT.` },
            ],
          sub: [
            { id: "s1", cat: "review", est: 30, label: `Play with the <a href="https://docs.python.org/3/library/dis.html" target="_blank" rel="noopener">dis</a> module — <code>dis.dis(fn)</code> on a couple of your own functions and read the opcodes.`, lead: `<b>Review</b> — Python isn't "interpreted line by line": it's compiled to bytecode and run by a loop. See it.` },
            { id: "s2", cat: "review", est: 35, label: `Then CPython's own <a href="https://github.com/python/cpython/blob/main/InternalDocs/interpreter.md" target="_blank" rel="noopener">"The bytecode interpreter"</a> internal doc (frames + dispatch); optional: the <a href="https://devguide.python.org/internals/compiler/" target="_blank" rel="noopener">compiler design</a> devguide.`, lead: `<b>Review</b> — Python isn't "interpreted line by line": it's compiled to bytecode and run by a loop. See it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Callback to d125: CPython is the "compile to bytecode, then interpret" point on the spectrum — and callback to d88 (the GIL) which is a property of this same eval loop.` },
        { id: "s2", type: "hint", label: `💡 "Python is slow because it's interpreted" is half the story — it's the per-opcode dispatch + boxing, which is exactly what specialization (3.11+) and the 3.13 JIT attack.` },
      ],
    },

    /* ---------------- Week 46 ---------------- */
    {
      id: "d127", date: "2027-08-04", week: "w46", dow: "Wed", title: "Lexing & parsing: tokens, grammars, recursive descent & Pratt",
      theme: "Compilers · part 2 — turning flat text into a tree.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 70, lead: `<b>Compilers ②</b> — the front end: scan characters into tokens, then tokens into an AST that encodes precedence. (1/2)`,
          sub: [
            { id: "s1", cat: "read", est: 35, label: `Read Crafting Interpreters <a href="https://craftinginterpreters.com/scanning.html" target="_blank" rel="noopener">"Scanning"</a> — characters to tokens, and why tokens are regular.`, lead: `<b>Compilers ②</b> — the front end: scan characters into tokens, then tokens into an AST that encodes precedence.` },
            { id: "s2", cat: "read", est: 35, label: `Then <a href="https://craftinginterpreters.com/parsing-expressions.html" target="_blank" rel="noopener">"Parsing Expressions"</a> — recursive descent, and precedence as grammar shape.`, lead: `<b>Compilers ②</b> — the front end: scan characters into tokens, then tokens into an AST that encodes precedence.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d125's mountain: scanning + parsing = the entire "front end". Everything after operates on the AST, never the raw text again.` },
        { id: "s2", type: "callout", label: `🔬 "Parser generators" (yacc/ANTLR) build bottom-up LR tables from a grammar; most beloved handwritten parsers are top-down recursive-descent + Pratt because errors and edge cases are easier to control.` },
      ],
    },
    {
      id: "d128", date: "2027-08-06", week: "w46", dow: "Fri", title: "Review: the Go compiler — parse → type-check → SSA → machine code",
      theme: "Review · the toolchain that builds everything you ship in Go.",
      tasks: [
        { id: "t1", carried: "d127", obj: COMP, cat: "read", est: 30, lead: `<b>Compilers ②</b> — the front end: scan characters into tokens, then tokens into an AST that encodes precedence. (2/2)`, model: `The <b>lexer/scanner</b> turns a character stream into <b>tokens</b> (<code>IDENT("x")</code>, <code>NUMBER(12)</code>, <code>PLUS</code>) — token shapes are a <b>regular</b> language, so a lexer is essentially a DFA (regexes compile to DFAs too). The <b>parser</b> turns tokens into an <b>AST</b> per a <b>context-free grammar</b>. <b>Recursive descent</b> writes one function per grammar rule (top-down, LL) — readable, and what gcc/Clang/V8 actually use. Precedence is the hard part: pure recursive descent needs one level of function per precedence tier, while <b>Pratt parsing</b> (top-down operator precedence) attaches a <i>binding power</i> to each operator token and folds precedence into one compact loop — the trick most handwritten parsers reach for.`, cards: [
              { q: `Why is a lexer basically a state machine / DFA?`, a: `Token shapes (identifiers, numbers, operators) form a <b>regular</b> language, so recognizing them is exactly what a finite automaton does — the same reason regexes compile to DFAs.` },
              { q: `What is recursive-descent parsing?`, a: `A top-down (LL) parser with <b>one function per grammar rule</b> that calls itself to match nested structure, producing an AST. Readable and widely used in production (Clang, V8).` },
              { q: `What problem does Pratt parsing solve, and how?`, a: `Operator <b>precedence/associativity</b> without a ladder of one-rule-per-level functions: each operator token carries a <b>binding power</b> and a single loop consumes higher-binding operators first.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Then Bob Nystrom's <a href="https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank" rel="noopener">"Pratt Parsers: Expression Parsing Made Easy"</a> for operator precedence done cleanly.`, lead: `<b>Compilers ②</b> — the front end: scan characters into tokens, then tokens into an AST that encodes precedence.` },
          ] },
        { id: "t2", obj: REV, cat: "review", est: 60, lead: `<b>Review</b> — you compile Go every day; walk the four phases the <code>gc</code> compiler runs.`, model: `Go's <code>gc</code> compiler runs, roughly: (1) <b>parse</b> — source → tokens → AST, with syntactic sugar noted; (2) <b>type-check & AST transform</b> — resolve names/types, desugar, decide escape analysis and inlining; (3) <b>SSA generation & lowering</b> — convert to a machine-independent <b>SSA</b> IR, run ~dozens of optimization passes (dead-code, constant folding, nil-check elimination), then <b>lower</b> to a machine-specific SSA; (4) <b>codegen</b> — register allocation, instruction layout, emit machine code + the object file. <b>Escape analysis</b> here is why a Go value lands on the stack (freed cheaply) vs the heap (GC'd) — a compile-time decision, not a keyword. It's a fast, non-JIT AOT compiler with its own backend (not LLVM).`, cards: [
              { q: `The four phases of the Go (gc) compiler?`, a: `(1) parse → AST; (2) type-check + AST transforms (desugar, inline, escape analysis); (3) SSA generation, optimization passes, then machine-specific lowering; (4) codegen — register allocation + emit machine code.` },
              { q: `What does escape analysis decide, and when?`, a: `At <b>compile time</b>, whether a value can stay on the stack (freed on return) or must go on the heap (GC-managed) because it "escapes" its function. It's inferred, not annotated.` },
              { q: `Does Go use LLVM?`, a: `The default <code>gc</code> toolchain has its own SSA-based backend (not LLVM); <code>gccgo</code> and TinyGo are separate frontends onto GCC/LLVM.` },
            ],
          sub: [
            { id: "s1", cat: "review", est: 30, label: `Read the <a href="https://github.com/golang/go/blob/master/src/cmd/compile/README.md" target="_blank" rel="noopener">"Introduction to the Go compiler"</a> (cmd/compile README) through type-checking (also on <a href="https://go.dev/src/cmd/compile/README" target="_blank" rel="noopener">go.dev</a>).`, lead: `<b>Review</b> — you compile Go every day; walk the four phases the <code>gc</code> compiler runs.` },
            { id: "s2", cat: "review", est: 30, label: "Finish the README: the SSA phases and machine-code generation.", lead: `<b>Review</b> — you compile Go every day; walk the four phases the <code>gc</code> compiler runs.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Callback to d73 (Go's scheduler) and d125: this is the AOT-with-its-own-backend point on the spectrum — no JIT, but a full SSA optimizer.` },
        { id: "s2", type: "hint", label: `💡 SSA (ahead at d132/d133) is what makes those optimization passes tractable — each value is assigned once, so "where did this come from?" has a single answer.` },
      ],
    },
    {
      id: "d129", date: "2027-08-09", week: "w46", dow: "Mon", title: "Tree-walking interpreters: evaluating an AST, scope & closures",
      theme: "Compilers · part 3 — the simplest way to actually run the tree.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 70, lead: `<b>Compilers ③</b> — walk the AST and execute it: environments, lexical scope, and how closures capture. (1/2)`,
          sub: [
            { id: "s1", cat: "read", est: 35, label: `Read Crafting Interpreters <a href="https://craftinginterpreters.com/evaluating-expressions.html" target="_blank" rel="noopener">"Evaluating Expressions"</a> — walk the tree, produce a value.`, lead: `<b>Compilers ③</b> — walk the AST and execute it: environments, lexical scope, and how closures capture.` },
            { id: "s2", cat: "read", est: 35, label: `Then <a href="https://craftinginterpreters.com/statements-and-state.html" target="_blank" rel="noopener">"Statements and State"</a> — environments and lexical scope.`, lead: `<b>Compilers ③</b> — walk the AST and execute it: environments, lexical scope, and how closures capture.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d88/d126: CPython does NOT tree-walk — it compiles to bytecode first. Tree-walking is the teaching baseline; almost every fast language moves to a VM.` },
        { id: "s2", type: "callout", label: `🔬 Closures force a real decision: capture by reference (shared, JS/Python) vs by value (copied). Loop-variable capture bugs come straight from this choice.` },
      ],
    },

    /* ---------------- Week 47 ---------------- */
    {
      id: "d130", date: "2027-08-11", week: "w47", dow: "Wed", title: "Review: the JVM — javac, tiered JIT (C1/C2), warmup & deopt",
      theme: "Review · the other great managed runtime, next to V8.",
      tasks: [
        { id: "t1", carried: "d129", obj: COMP, cat: "read", est: 30, lead: `<b>Compilers ③</b> — walk the AST and execute it: environments, lexical scope, and how closures capture. (2/2)`, model: `A <b>tree-walking interpreter</b> recursively visits AST nodes (the Visitor pattern) and returns values: a <code>+</code> node evaluates its two children and adds them. State lives in an <b>environment</b> — a map of name → value, <b>chained</b> to its enclosing scope, so a lookup walks outward (lexical scoping). A <b>closure</b> is a function value that holds a reference to the environment where it was <i>defined</i> (not called) — that's how an inner function still sees an outer variable after the outer call returns. The upside: tiny and direct. The downside: you re-walk the tree and re-resolve names on every execution — pointer-chasing, no locality — which is exactly why the next tier compiles to bytecode.`, cards: [
              { q: `How does a tree-walking interpreter run a program?`, a: `It recursively evaluates AST nodes (Visitor pattern), each node computing from its children's values — e.g. a binary <code>+</code> node evaluates both operands then adds. Simple, but re-walks the tree every time.` },
              { q: `What is an "environment" and how does lexical scope work?`, a: `A name→value map <b>chained</b> to its enclosing scope; a variable lookup walks the chain outward. Inner scopes shadow outer ones — that chain <i>is</i> lexical scoping.` },
              { q: `What exactly does a closure capture?`, a: `A reference to the <b>environment where the function was defined</b> (not where it's called), so it keeps seeing those variables even after the defining call has returned.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Then <a href="https://craftinginterpreters.com/closures.html" target="_blank" rel="noopener">"Closures"</a> — how a function captures its defining environment.`, lead: `<b>Compilers ③</b> — walk the AST and execute it: environments, lexical scope, and how closures capture.` },
          ] },
        { id: "t2", obj: REV, cat: "review", est: 65, lead: `<b>Review</b> — how HotSpot turns bytecode into some of the fastest managed code on earth — eventually.`, model: `<code>javac</code> is only a <b>front end</b>: it compiles <code>.java</code> to portable <b>bytecode</b> (<code>.class</code>) with almost no optimization. The real compiler is inside the <b>JVM</b>: HotSpot starts by <b>interpreting</b> bytecode while profiling, then uses <b>tiered compilation</b> — <b>C1</b> (fast, lightly optimized) for methods that warm up, <b>C2</b> (slow, aggressive: inlining, escape analysis, loop opts) for the hottest. Because it optimizes on <i>observed</i> behavior it <b>speculates</b> (e.g. a call site is effectively monomorphic) and installs a guard; if the guard fails it <b>deoptimizes</b> back to the interpreter. Hence <b>warmup</b>: the same code is slow for the first thousands of calls, then fast — which is why JVM benchmarks must warm up first.`, cards: [
              { q: `What does <code>javac</code> actually do — and not do?`, a: `It compiles Java source to portable <b>bytecode</b> (<code>.class</code>) with little optimization. The heavy optimization happens later, at runtime, inside the JVM's JIT.` },
              { q: `C1 vs C2 in HotSpot's tiered compilation?`, a: `<b>C1</b> compiles quickly with light optimization (for merely-warm code); <b>C2</b> compiles slowly with aggressive optimization (inlining, escape analysis) for the hottest methods.` },
              { q: `Why do JVM programs need "warmup"?`, a: `Code starts <b>interpreted</b> while HotSpot profiles it, and only gets JIT-compiled (C1→C2) once hot — so early runs are slow, and a bad speculation can <b>deoptimize</b> back to the interpreter.` },
            ],
          sub: [
            { id: "s1", cat: "review", est: 35, label: `Read Ben Evans, <a href="https://www.oracle.com/technical-resources/articles/java/architect-evans-pt1.html" target="_blank" rel="noopener">"Understanding Java JIT Compilation with JITWatch"</a> (profiling + tiers).`, lead: `<b>Review</b> — how HotSpot turns bytecode into some of the fastest managed code on earth — eventually.` },
            { id: "s2", cat: "review", est: 30, label: `Then the <a href="https://en.wikipedia.org/wiki/HotSpot_(virtual_machine)" target="_blank" rel="noopener">HotSpot</a> overview (C1/C2, tiered compilation); optional deep cuts: <a href="https://shipilev.net/jvm/anatomy-quarks/" target="_blank" rel="noopener">JVM Anatomy Quarks</a>.`, lead: `<b>Review</b> — how HotSpot turns bytecode into some of the fastest managed code on earth — eventually.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Callback to d115/d125: same idea as V8 (interpret + profile → speculatively JIT → deopt on guard failure). Managed runtimes converge on this design.` },
        { id: "s2", type: "hint", label: `💡 "The JVM is slow to start" and "Java is fast" are both true — that's warmup. AOT options (GraalVM native-image) trade peak throughput for instant start.` },
      ],
    },
    {
      id: "d131", date: "2027-08-12", week: "w47", dow: "Thu", title: "Bytecode compilers & a stack VM (the clox model)",
      theme: "Compilers · part 4 — why every fast interpreter compiles to its own instruction set.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 70, lead: `<b>Compilers ④</b> — trade the AST for a flat bytecode array and a stack machine: locality, speed, portability. (1/2)`,
          sub: [
            { id: "s1", cat: "read", est: 35, label: `Read Crafting Interpreters <a href="https://craftinginterpreters.com/a-bytecode-virtual-machine.html" target="_blank" rel="noopener">"Chunks of Bytecode"</a> — a flat instruction array instead of a tree.`, lead: `<b>Compilers ④</b> — trade the AST for a flat bytecode array and a stack machine: locality, speed, portability.` },
            { id: "s2", cat: "read", est: 35, label: `Then <a href="https://craftinginterpreters.com/a-virtual-machine.html" target="_blank" rel="noopener">"A Virtual Machine"</a> — the stack and the dispatch loop.`, lead: `<b>Compilers ④</b> — trade the AST for a flat bytecode array and a stack machine: locality, speed, portability.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d126/d130: this IS what CPython and the JVM do — you're now seeing the machinery behind "compiles to bytecode, then interprets". clox even folds parsing + codegen into one pass.` },
        { id: "s2", type: "callout", label: `🔬 Callback to d123 (branch prediction): the interpreter's central dispatch is one hyper-hot indirect branch — which is exactly why computed-goto/threaded dispatch measurably wins.` },
      ],
    },

    /* ---------------- Week 48 ---------------- */
    {
      id: "d132", date: "2027-08-18", week: "w48", dow: "Wed", title: "Review: LLVM — IR, SSA & the shared backend behind Clang & rustc",
      theme: "Review · the compiler infrastructure under half the languages you use.",
      tasks: [
        { id: "t1", carried: "d131", obj: COMP, cat: "read", est: 30, lead: `<b>Compilers ④</b> — trade the AST for a flat bytecode array and a stack machine: locality, speed, portability. (2/2)`, model: `Instead of re-walking a tree of scattered pointers, compile the AST (or even parse straight) into a flat array of <b>bytecode</b> — one-byte opcodes + operands — and run a <b>virtual machine</b>: a loop that fetches an opcode, dispatches (a <code>switch</code>, or a computed-goto "threaded" dispatch for speed), and mutates a <b>value stack</b>. Most VMs are <b>stack machines</b> (<code>OP_CONSTANT</code> pushes, <code>OP_ADD</code> pops two and pushes) because they're simple to compile to; some (Lua, Dalvik) are <b>register machines</b> (fewer instructions, more per-instruction work). The win is <b>locality</b> — sequential bytes, no pointer chasing — plus a portable artifact you can ship and, later, JIT. This is the leap CPython, the JVM, and Lua all make; the tree-walker (d129) was the on-ramp.`, cards: [
              { q: `Why compile to bytecode instead of walking the AST?`, a: `A flat bytecode array gives <b>cache locality</b> and cheap sequential dispatch (no pointer-chasing through tree nodes), plus a portable artifact you can ship and later JIT — far faster than re-walking the tree each run.` },
              { q: `What is a stack-based VM, concretely?`, a: `A fetch-decode-dispatch loop over opcodes that operate on a <b>value stack</b>: <code>OP_CONSTANT</code> pushes, <code>OP_ADD</code> pops two and pushes their sum. Simple to compile to; contrast register VMs (Lua/Dalvik).` },
              { q: `What is "threaded" / computed-goto dispatch?`, a: `Replacing the big <code>switch</code> with a jump directly from the end of one opcode's handler to the next's (via a label-address table), which the CPU's branch predictor handles far better — a common VM speedup.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Then <a href="https://craftinginterpreters.com/compiling-expressions.html" target="_blank" rel="noopener">"Compiling Expressions"</a> — a single-pass, Pratt-driven bytecode compiler.`, lead: `<b>Compilers ④</b> — trade the AST for a flat bytecode array and a stack machine: locality, speed, portability.` },
          ] },
        { id: "t2", obj: REV, cat: "review", est: 30, lead: `<b>Review</b> — how one optimizer + backend serves C, C++, Rust, Swift and more: a shared IR. (1/2)`,
          sub: [
            { id: "s1", cat: "review", est: 30, label: `Skim the <a href="https://llvm.org/docs/LangRef.html" target="_blank" rel="noopener">LLVM Language Reference</a> intro (what LLVM IR looks like: typed, SSA, <code>phi</code> nodes).`, lead: `<b>Review</b> — how one optimizer + backend serves C, C++, Rust, Swift and more: a shared IR.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Callback to d128: Go's <code>gc</code> deliberately does NOT use LLVM (its own SSA backend, for fast builds) — a real engineering trade-off vs Rust's LLVM dependency (slower builds, heavier optimization).` },
        { id: "s2", type: "hint", label: `💡 SSA appears in three places you've now seen: Go's compiler (d128), LLVM here, and modern JITs. Learn it once; recognize it everywhere.` },
      ],
    },
    {
      id: "d133", date: "2027-08-21", week: "w48", dow: "Sat", title: "🎓 Optimization & codegen: SSA, register allocation & the as-if rule",
      theme: "Compilers · part 5 (capstone) — the back end that makes it fast, and the rule that lets it.",
      tasks: [
        { id: "t1", carried: "d132", obj: REV, cat: "review", est: 45, lead: `<b>Review</b> — how one optimizer + backend serves C, C++, Rust, Swift and more: a shared IR. (2/2)`, model: `LLVM's idea: define one well-specified, typed, <b>SSA</b> <b>intermediate representation</b>, and split every compiler into a language <b>front end</b> (Clang for C/C++, <code>rustc</code>, <code>swiftc</code> → LLVM IR) and a shared <b>middle/back end</b> (target-independent optimization passes, then per-target codegen). Write your optimizer and register allocator <b>once</b> against the IR; every language and every CPU benefits. <b>SSA</b> — static single assignment, each virtual register assigned exactly once, with <code>phi</code> nodes merging values at control-flow joins — is what makes those passes clean: data-flow questions have a single definition to follow. That's why a new language can get a serious optimizing compiler by just emitting LLVM IR.`, cards: [
              { q: `What is LLVM IR and why does it matter?`, a: `A typed, <b>SSA-form</b> intermediate representation that decouples language front ends (Clang, rustc, swiftc) from a shared optimizer + per-target backend — so optimization/codegen is written once and reused across languages and CPUs.` },
              { q: `What is SSA form and its signature feature?`, a: `<b>Static single assignment</b>: every value is assigned exactly once; <b>phi</b> nodes select which incoming value applies at a control-flow merge. Single definitions make data-flow optimization tractable.` },
              { q: `How does Rust/Swift get a good optimizing compiler "for free"?`, a: `Its front end lowers to LLVM IR; LLVM's existing target-independent passes and backends then optimize and generate machine code — no need to re-implement register allocation, inlining, etc.` },
            ],
          sub: [
            { id: "s1", cat: "review", est: 45, label: `Then walk chapters of the <a href="https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/index.html" target="_blank" rel="noopener">"My First Language Frontend" (Kaleidoscope)</a> tutorial — lexer → parser → LLVM IR → JIT.`, lead: `<b>Review</b> — how one optimizer + backend serves C, C++, Rust, Swift and more: a shared IR.` },
          ] },
        { id: "t2", obj: COMP, cat: "read", est: 30, lead: `<b>Compilers ⑤ (capstone)</b> — how an optimizer is <i>allowed</i> to rewrite your code, and the last mile to machine instructions. (1/2)`,
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Read <a href="https://en.wikipedia.org/wiki/Static_single-assignment_form" target="_blank" rel="noopener">Static single-assignment form</a> — why every serious optimizer converts to it.`, lead: `<b>Compilers ⑤ (capstone)</b> — how an optimizer is <i>allowed</i> to rewrite your code, and the last mile to machine instructions.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🏁 Bedrock complete — 32 weeks, 12 threads, from the OSI myth to how a compiler is allowed to rewrite your code. The wire, the runtime, the data structure, and now the language itself: the theory a backend/blockchain engineer is expected to own, end to end.` },
        { id: "s2", type: "hint", label: `💡 Callbacks close the loop: the as-if rule (d104), branch prediction in the dispatch loop (d123), V8's JIT (d115), the eBPF verifier (d101). You've now seen compilation from the kernel to the cloud.` },
      ],
      note: "🏁 Bedrock complete — 32 weeks across 12 threads. From \"there is no OSI layer 5 on the wire\" to \"the as-if rule is why -O2 is allowed\": your interview-and-tech-talk bedrock, wire to compiler.",
    },
    {
      id: "d134", date: "2027-08-24", week: "w48", dow: "Tue", title: "🎓 Optimization & codegen: SSA, register allocation & the as-if rule (cont.)",
      theme: "Finish “🎓 Optimization & codegen: SSA, register allocation & the as-if rule” — the part that didn't fit its first session.",
      tasks: [
        { id: "t1", carried: "d133", obj: COMP, cat: "read", est: 60, lead: `<b>Compilers ⑤ (capstone)</b> — how an optimizer is <i>allowed</i> to rewrite your code, and the last mile to machine instructions. (2/2)`, model: `The back end earns the speed. On an <b>SSA</b> IR, classic passes fall out cheaply: constant folding/propagation, dead-code elimination, common-subexpression elimination, loop-invariant code motion — each easy because every value has one definition. Then the machine-specific mile: <b>instruction selection</b> (map IR ops to real opcodes — often tree/DAG tiling), <b>instruction scheduling</b> (reorder to hide latency), and <b>register allocation</b> (fit unbounded virtual registers into a handful of physical ones — modeled as <b>graph coloring</b>, or <b>linear scan</b> in JITs; when it can't, it <b>spills</b> to the stack). All of this is licensed by one rule: the <b>as-if rule</b> — transform however you like as long as <b>observable behavior</b> is preserved. That single principle is why <code>-O2</code> can delete, reorder, and vectorize your code, and why (d104) it needs <code>atomic</code>/<code>volatile</code> to know what it must NOT touch.`, cards: [
              { q: `Why do optimizers convert to SSA before optimizing?`, a: `With every value assigned once, data-flow facts (reaching definitions, liveness) have a single source — so constant folding, dead-code elimination, CSE and LICM become simple, local rewrites.` },
              { q: `What problem is register allocation, and how is it modeled?`, a: `Mapping unbounded virtual registers onto a few physical ones. Modeled as <b>graph coloring</b> (interference graph) or <b>linear scan</b> (fast, JIT-friendly); values that don't fit are <b>spilled</b> to the stack.` },
              { q: `What licenses every compiler optimization — and its limit?`, a: `The <b>as-if rule</b>: any transformation is legal if the program's <b>observable behavior</b> is unchanged. Its limit is that "observable" is defined per single thread — hence atomics/volatile (d104) to mark what must not be reordered.` },
            ],
          sub: [
            { id: "s1", cat: "read", est: 30, label: `Then <a href="https://en.wikipedia.org/wiki/Register_allocation" target="_blank" rel="noopener">register allocation</a> — graph-colouring and linear scan.`, lead: `<b>Compilers ⑤ (capstone)</b> — how an optimizer is <i>allowed</i> to rewrite your code, and the last mile to machine instructions.` },
            { id: "s2", cat: "read", est: 30, label: `Then <a href="https://en.wikipedia.org/wiki/Instruction_selection" target="_blank" rel="noopener">instruction selection</a>, and revisit the <a href="https://en.wikipedia.org/wiki/As-if_rule" target="_blank" rel="noopener">as-if rule</a> (d104) that authorizes it all.`, lead: `<b>Compilers ⑤ (capstone)</b> — how an optimizer is <i>allowed</i> to rewrite your code, and the last mile to machine instructions.` },
          ] },
      ],
    },
  ],

  milestones: [
    { id: "w6.m1", week: "w6", title: "Month 1 — Networking + DevOps foundations",
      rule: { type: "tasks", require: ["d01.t1", "d02.t1", "d09.t1", "d10.t1", "d10.t2", "d11.t1", "d12.t1", "d16.t1", "d17.t1", "d18.t1"] } },
    { id: "w13.m1", week: "w13", title: "Month 2 — data layer, HTTP, blockchain & security basics",
      rule: { type: "tasks", require: ["d22.t1", "d23.t1", "d25.t1", "d26.t1", "d30.t1", "d31.t1", "d33.t2", "d34.t1", "d37.t1", "d38.t1", "d39.t1"] } },
    { id: "w20.m1", week: "w20", title: "🎓 Core complete — the essentials owned",
      rule: { type: "tasks", require: ["d51.t1", "d52.t1", "d54.t2", "d55.t1", "d56.t1", "d57.t1", "d58.t1"] } },
    // ---- Extension milestones ----
    { id: "w27.m1", week: "w27", title: "Extension I — distributed systems & storage internals underway",
      rule: { type: "tasks", require: ["d58.t2", "d59.t1", "d60.t1", "d63.t1", "d64.t1", "d68.t1", "d69.t1", "d75.t1"] } },
    { id: "w33.m1", week: "w33", title: "Extension I (halfway) — chains deep, replication & sagas",
      rule: { type: "tasks", require: ["d79.t1", "d83.t1", "d87.t1", "d90.t1", "d91.t1", "d92.t1"] } },
    { id: "w39.m1", week: "w39", title: "🎓 Extension I complete — distributed systems & internals",
      rule: { type: "tasks", require: ["d98.t1", "d103.t1", "d106.t1", "d110.t1"] } },
    // ---- Extension II (internals) milestone ----
    { id: "w44.m1", week: "w44", title: "🎓 Extension II complete — data-structure & runtime internals",
      rule: { type: "tasks", require: ["d111.t1", "d114.t1", "d117.t1", "d118.t1", "d120.t1", "d124.t1"] } },
    // ---- Extension III (compilers & interpreters) milestones ----
    // Anchored to w31 because its last required task (the tree-walker, d129) lives
    // in w31 — the deadline/at-risk math keys off the milestone's week end.
    { id: "w47.m1", week: "w47", title: "Extension III — the front end: maps, lexing, parsing & real interpreters",
      rule: { type: "tasks", require: ["d125.t1", "d126.t1", "d127.t1", "d128.t1", "d129.t1", "d130.t1"] } },
    { id: "w48.m1", week: "w48", title: "🎓 Extension III complete — how compilers & interpreters really work",
      rule: { type: "tasks", require: ["d131.t1", "d132.t1", "d133.t2", "d134.t1"] } },
  ],

  features: [
    { title: "How this track works", items: [
      `Each domain is an ordered <b>thread</b>; threads are <b>interleaved</b> across days, so consecutive side-days switch topics but each thread advances in order.`,
      `Progress, streak and effort are <b>separate from your main roadmaps</b> — only the Today panel's "Main + Side" line combines them.`,
      `<b>Core</b> (weeks 1–12) lays the foundations; <b>Extension I</b> (weeks 13–25) goes deeper under the hood — every thread continues in order, plus a <b>Distributed systems</b> thread (Raft, CAP, quorums…); <b>Extension II</b> (weeks 26–29) is the "cool internals" — a <b>Data-structure & runtime internals</b> thread (why hash maps are O(1), garbage collection, the JS heap, floats, Unicode, Bloom filters); <b>Extension III</b> (weeks 30–32) closes with a <b>Compilers & interpreters</b> thread — how real implementations (CPython, the Go compiler, the JVM, V8, LLVM) turn your code into behavior, interleaved with language-implementation reviews.`,
      `Complete a task to <b>unlock its recall cards</b> 🎴 — short Q/A prompts you can re-test yourself on; the Today view resurfaces a few from earlier days so knowledge sticks.`,
    ] },
  ],
});
