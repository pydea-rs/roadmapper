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
// Cadence: 2–3 focused side-days per week (varied weekdays), one ~45–90 min task
// each, alongside the main roadmaps. Progress/effort stay OFF the main track's
// totals (kind:"side") — only the Today panel's "Main + Side" line combines them.
//
// Tasks use the STRUCTURED form (lead / refs / model): a headline, a scannable
// list of reading/do items, and a takeaway — so long tasks don't read as a wall
// of text. References were link/chapter verified (2026-07-18); book citations
// give chapter/section (page numbers drift across editions and are omitted).
// Editions: Mastering Bitcoin 3rd, Mastering Ethereum 2nd, DDIA 1st, Kafka: The
// Definitive Guide 2nd (free from Confluent), OWASP Top 10 2025.

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

  weeks: [
    { id: "w1",  title: "Week 1 — The wire, the container, the process", start: "2026-07-22" },
    { id: "w2",  title: "Week 2 — Addresses, images & the B-tree",       start: "2026-07-29" },
    { id: "w3",  title: "Week 3 — TCP, Kubernetes, cache & the planner",  start: "2026-08-05" },
    { id: "w4",  title: "Week 4 — DNS, scheduling & first security",      start: "2026-08-12" },
    { id: "w5",  title: "Week 5 — TLS, MVCC & shipping",                  start: "2026-08-19" },
    { id: "w6",  title: "Week 6 — Crypto, HTTP, Redis & isolation",       start: "2026-08-26" },
    { id: "w7",  title: "Week 7 — Metrics, the EVM & the log",            start: "2026-09-02" },
    { id: "w8",  title: "Week 8 — Proxies, OAuth & locks",               start: "2026-09-09" },
    { id: "w9",  title: "Week 9 — Solana, SLOs & the event loop",         start: "2026-09-16" },
    { id: "w10", title: "Week 10 — Transactions, Kafka & a Rust review",  start: "2026-09-23" },
    { id: "w11", title: "Week 11 — Stampedes, Sealevel & load tests",     start: "2026-09-30" },
    { id: "w12", title: "Week 12 — Consensus & the security capstone",    start: "2026-10-07" },
    // ---- Extension: "deepen your knowledge" — under-the-hood internals ----
    { id: "w13", title: "Week 13 — Raft, VACUUM & virtual memory",            start: "2026-10-14" },
    { id: "w14", title: "Week 14 — Rollups, BGP & exactly-once",             start: "2026-10-21" },
    { id: "w15", title: "Week 15 — Byzantine faults, TOAST & the mesh",      start: "2026-10-28" },
    { id: "w16", title: "Week 16 — Blobs, Go's scheduler & Redis Cluster",   start: "2026-11-04" },
    { id: "w17", title: "Week 17 — CAP, joins & the page cache",             start: "2026-11-11" },
    { id: "w18", title: "Week 18 — MEV, rebalances & proxy security",        start: "2026-11-18" },
    { id: "w19", title: "Week 19 — Logical clocks, sharding & QUIC",         start: "2026-11-25" },
    { id: "w20", title: "Week 20 — Account abstraction, the GIL & supply chain", start: "2026-12-02" },
    { id: "w21", title: "Week 21 — 2PC/Sagas, replication & the outbox",     start: "2026-12-09" },
    { id: "w22", title: "Week 22 — ZK proofs, Redlock & io_uring",           start: "2026-12-16" },
    { id: "w23", title: "Week 23 — Quorums, LSM-trees & XDP",                start: "2026-12-23" },
    { id: "w24", title: "Week 24 — Firedancer, the C++ memory model & streams", start: "2026-12-30" },
    { id: "w25", title: "Week 25 — Flame graphs, signatures & async internals", start: "2027-01-06" },
    // ---- Extension II: "the cool internals" — data structures & runtime under the hood ----
    { id: "w26", title: "Week 26 — Amortized O(1), false sharing & hash maps",      start: "2027-01-13" },
    { id: "w27", title: "Week 27 — The JS heap, garbage collection & the allocator", start: "2027-01-20" },
    { id: "w28", title: "Week 28 — Floats, the JIT & Unicode",                       start: "2027-01-27" },
    { id: "w29", title: "Week 29 — Branch prediction & Bloom filters",               start: "2027-02-03" },
    // ---- Extension III: "how the languages are built" — compilers & interpreters ----
    { id: "w30", title: "Week 30 — The territory, CPython & parsing",                 start: "2027-02-10" },
    { id: "w31", title: "Week 31 — The Go compiler, tree-walkers & the JVM",          start: "2027-02-17" },
    { id: "w32", title: "Week 32 — Bytecode VMs, LLVM & code generation",             start: "2027-02-24" },
  ],

  days: [
    /* ==================== WEEK 1 ==================== */
    {
      id: "d01", date: "2026-07-22", week: "w1", title: "The OSI myth vs how the internet really layers",
      theme: "Networking · thread part 1 — encapsulation is the load-bearing idea, not the number 7.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          lead: `<b>Networking ①</b> — learn the layering model <i>honestly</i>.`,
          sub: [
            { id: "s1", est: 20, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/" target="_blank" rel="noopener">"What is the OSI Model?"</a> for the diagram — then apply the corrections below.` },
            { id: "s2", est: 13, label: `The internet runs the <b>TCP/IP</b> model (Link → Internet → Transport → Application); OSI layers 5–6 (session/presentation) have <i>no</i> real counterpart.` },
            { id: "s3", est: 12, label: `"L7 load balancer / L4 firewall / L3 switch" is just shorthand for <b>which header a device inspects</b> (L3=IP, L4=port, L7=HTTP).` },
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
      id: "d02", date: "2026-07-25", week: "w1", title: "What a container actually is",
      theme: "DevOps · thread part 1 — a container is a Linux process with a restricted view, not a VM.",
      tasks: [
        { id: "t1", obj: OPS, cat: "watch", est: 45,
          lead: `<b>DevOps ①</b> — see a container built from raw kernel primitives.`,
          refs: [
            `Watch Liz Rice, <a href="https://www.youtube.com/watch?v=8fi7uSYlOdc" target="_blank" rel="noopener">"Containers From Scratch" (GOTO 2018, ~43 min)</a> — she live-codes one in Go from <code>clone()</code> + namespaces + <code>chroot</code> + cgroups.`,
          ],
          model: `There is <b>no "container" object in the kernel</b>. <b>Namespaces</b> limit what a process can <i>see</i> (PID, mount, net, UTS, IPC, user); <b>cgroups</b> limit what it can <i>use</i> (CPU, memory, IO). That's the whole trick.`,
          cards: [
            { q: `Is there a "container" object in the Linux kernel?`, a: `No. A container is a process with <b>namespaces</b> (what it can <i>see</i>) + <b>cgroups</b> (what it can <i>use</i>).` },
            { q: `Container vs VM isolation?`, a: `A VM runs its own kernel (hardware virtualized); a container shares the host kernel — lighter, but a weaker boundary (hence "container escape").` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A VM virtualizes hardware and runs its own kernel; a container shares the host kernel — lighter, but a weaker isolation boundary (why "container escape" is a real threat).` },
        { id: "s2", type: "callout", label: `🔧 DevOps is a first-class, first-month thread here (Docker → Kubernetes → CI/CD → observability → load testing). "Containers" means the whole real stack, not just <code>docker run</code>.` },
      ],
    },
    {
      id: "d03", date: "2026-07-27", week: "w1", title: "Processes vs threads vs coroutines",
      theme: "Systems · thread part 1 — who schedules it, and what's shared.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ①</b> — the three units of execution, and the one distinction that matters.`,
          sub: [
            { id: "s1", est: 28, label: `Read OSTEP (free) <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">Ch 4 "The Abstraction: The Process"</a> + <b>Ch 26 "Concurrency: Threads"</b>.` },
            { id: "s2", est: 22, label: `Map it to your stack: Go goroutines (M:N green threads), Rust <code>async</code>/tokio & Python <code>asyncio</code> (stackless coroutines on an event loop), Node (single loop + libuv pool).`,
              note: `Locate each on the one axis: who schedules it (kernel vs runtime) and what's shared (address space).` },
          ],
          model: `<b>Process</b> = own address space + fds (expensive switch). <b>OS thread</b> = shares the address space, kernel-scheduled preemptively. <b>Coroutine</b> = user-space scheduled, no syscall to switch → millions of them, cooperative. The distinction is <i>who schedules it</i> and <i>what's shared</i>.`,
          cards: [
            { q: `The one distinction between process, thread, and coroutine?`, a: `<b>Who schedules it</b> (kernel vs runtime) and <b>what's shared</b> (address space). Coroutines are user-scheduled and cooperative.` },
            { q: `Why are coroutines so cheap?`, a: `They switch in user space — no syscall, often no TLB flush — so you can run millions of them.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 That one sentence — who schedules it (kernel vs runtime) and what's shared (address space) — answers most "goroutine vs thread" interview questions.` },
        { id: "s2", type: "suggestion", label: `Tie-in: coroutines are cheap precisely because they skip the kernel context switch (and often the TLB flush) — we'll quantify that when Systems reaches CPU caches.` },
      ],
    },

    /* ==================== WEEK 2 ==================== */
    {
      id: "d04", date: "2026-07-30", week: "w2", title: "IP addressing, subnets & CIDR",
      theme: "Networking · part 2 — stop CIDR from being magic.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          lead: `<b>Networking ②</b> — subnet math you can do in your head.`,
          sub: [
            { id: "s1", est: 18, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/" target="_blank" rel="noopener">"What is a subnet?"</a>, then do the binary yourself.` },
            { id: "s2", est: 15, label: `<code>/n</code> = first <i>n</i> bits are the network prefix. <code>/24</code>=256 addrs (254 usable), <code>/16</code>=65,536; each extra bit halves the block. Mask <code>/24</code>=<code>255.255.255.0</code>.` },
            { id: "s3", est: 12, label: `Memorize the RFC 1918 private ranges: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code> — they're in every VPC/Docker/k8s.` },
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
      id: "d05", date: "2026-08-02", week: "w2", title: "Images, layers & the Dockerfile that actually caches",
      theme: "DevOps · part 2 — an image is a manifest + content-addressed layers.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ②</b> — what a container image really is, and how to build a tiny one.`,
          sub: [
            { id: "s1", est: 27, label: `Read the <a href="https://github.com/opencontainers/image-spec/blob/main/spec.md" target="_blank" rel="noopener">OCI Image Spec</a> conceptually: an image = a JSON <b>manifest</b> + <b>config</b> + ordered <b>layer</b> blobs, all <b>content-addressed by SHA-256</b> (identical layers stored/pulled once).` },
            { id: "s2", est: 23, label: `Read Docker <a href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">Multi-stage builds</a> + <a href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">best practices</a>: order steps by change-frequency (deps before source) for cache hits; <code>COPY --from</code> to ship only the built binary.` },
          ],
          model: `Layers stack via <b>OverlayFS</b> (read-only image lowerdir + writable upperdir; a write triggers <b>copy-up</b>). For your Go/Rust binaries, a multi-stage build into <a href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">distroless</a>/<code>scratch</code> = a few-MB image with almost no attack surface.`,
          cards: [
            { q: `What is a container image, concretely?`, a: `A JSON <b>manifest</b> + config + ordered <b>layer</b> blobs, all content-addressed by SHA-256 (identical layers stored/pulled once).` },
            { q: `Why order Dockerfile steps by change-frequency?`, a: `Layers cache by content — put rarely-changing deps before source, so a code edit doesn't bust the dependency layers.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 That copy-up mechanic is why containers start instantly and why the writable layer is ephemeral — anything you need to keep goes in a volume, not the container fs.` },
        { id: "s2", type: "callout", label: `🔬 An image <i>index</i> (manifest list) maps platforms (amd64/arm64) to manifests — that's multi-arch. Content-addressing is what makes layer caching and dedup work.` },
      ],
    },
    {
      id: "d06", date: "2026-08-04", week: "w2", title: "The B-tree index: how it works, when it hurts",
      theme: "Databases · part 1 — an index is a second, sorted copy kept balanced.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ①</b> — the mental model of a B-tree index.`,
          sub: [
            { id: "s1", est: 22, label: `Read <i>Use The Index, Luke!</i> (free): <a href="https://use-the-index-luke.com/sql/anatomy" target="_blank" rel="noopener">Anatomy of an SQL Index</a> → <a href="https://use-the-index-luke.com/sql/anatomy/the-tree" target="_blank" rel="noopener">The B-Tree</a> → <a href="https://use-the-index-luke.com/sql/anatomy/slow-indexes" target="_blank" rel="noopener">Slow Indexes</a>.` },
            { id: "s2", est: 15, label: `Leaf nodes are a doubly-linked list (range scans walk sideways); height ~log(N), so billions of rows are 3–5 levels deep.` },
            { id: "s3", est: 13, label: `Hurts on low-cardinality columns, when a function wraps the column (<code>WHERE lower(email)=…</code> needs an expression index), and every index is <b>write amplification</b>.` },
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

    /* ==================== WEEK 3 (4 side-days) ==================== */
    {
      id: "d07", date: "2026-08-05", week: "w3", title: "TCP vs UDP — handshake, flow, congestion, HOL",
      theme: "Networking · part 3 — reliability is a feature you pay for.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          lead: `<b>Networking ③</b> — what TCP does for you, and what UDP leaves to you.`,
          sub: [
            { id: "s1", est: 22, label: `Read HPBN (free) <a href="https://hpbn.co/building-blocks-of-tcp/" target="_blank" rel="noopener">"Building Blocks of TCP"</a> + <a href="https://hpbn.co/building-blocks-of-udp/" target="_blank" rel="noopener">UDP</a>.` },
            { id: "s2", est: 16, label: `Own the <b>3-way handshake</b> (SYN/SYN-ACK/ACK), <b>slow-start</b> & congestion avoidance (AIMD), the receive window (flow control), and <b>head-of-line blocking</b>.` },
            { id: "s3", est: 12, label: `UDP = no handshake/ordering/congestion control — you build reliability yourself (or use QUIC).` },
          ],
          model: `Two different HOL blockings: TCP's byte-stream ordering, and the famous <b>HTTP/2-over-TCP</b> one (a single lost packet stalls all multiplexed streams). The latter is what QUIC/HTTP-3 fixes — and what interviewers usually mean.`,
          cards: [
            { q: `TCP's 3-way handshake?`, a: `SYN → SYN-ACK → ACK.` },
            { q: `The two different "head-of-line blocking"?`, a: `TCP's byte-stream ordering; and HTTP/2-over-TCP (one lost packet stalls <i>all</i> multiplexed streams) — the latter is what QUIC/H3 fixes.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: <code>sudo tcpdump -n -i any port 443</code> while you <code>curl https://example.com</code> — watch the real SYN → SYN-ACK → ACK, then the TLS records.` },
        { id: "s2", type: "hint", label: `💡 "Why is a new connection slow?" → handshake RTT + TLS RTT + TCP slow-start ramping the window. Keep-alive and HTTP/2 exist largely to avoid paying that repeatedly.` },
      ],
    },
    {
      id: "d08", date: "2026-08-07", week: "w3", title: "Kubernetes: the reconciliation loop + core objects",
      theme: "DevOps · part 3 — everything in k8s is a controller driving current → desired.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          lead: `<b>DevOps ③</b> — the one mental model that makes all of Kubernetes click.`,
          sub: [
            { id: "s1", est: 30, label: `Read k8s <a href="https://kubernetes.io/docs/concepts/architecture/controller/" target="_blank" rel="noopener">"Controllers"</a>: a thermostat loop — observe current → compare to <code>.spec</code> → act → repeat, forever (<b>level-triggered</b>, not edge-triggered).` },
            { id: "s2", est: 25, label: `Skim the core objects: <a href="https://kubernetes.io/docs/concepts/workloads/pods/" target="_blank" rel="noopener">Pod</a>, <a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noopener">Deployment</a>→ReplicaSet→Pod, <a href="https://kubernetes.io/docs/concepts/services-networking/service/" target="_blank" rel="noopener">Service</a> (stable VIP + label selector), <a href="https://kubernetes.io/docs/concepts/services-networking/ingress/" target="_blank" rel="noopener">Ingress</a>, ConfigMap/Secret.` },
          ],
          model: `Controllers act only through the <b>API server</b> (+ etcd = single source of truth), never nodes directly. Desired state is never "done" — a node dies, Pods get rescheduled. Reconciliation is the through-line for GitOps and Terraform too.`,
          cards: [
            { q: `The one mental model for all of Kubernetes?`, a: `A reconciliation loop: observe current → compare to <code>.spec</code> → act → repeat forever (<b>level-triggered</b>, via the API server + etcd).` },
            { q: `Is a k8s Secret encrypted at rest by default?`, a: `No — only base64-encoded. You must enable encryption-at-rest / a KMS.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Interview gotcha: a k8s <b>Secret is only base64-encoded, not encrypted</b> at rest by default — you must enable encryption-at-rest / a KMS. Almost everyone gets this wrong.` },
        { id: "s2", type: "hint", label: `💡 Deployment→ReplicaSet→Pod is an ownership chain: you edit the Deployment, it creates a new ReplicaSet and scales the old one down (that's a rolling update / rollback).` },
      ],
    },
    {
      id: "d09", date: "2026-08-09", week: "w3", title: "Memory hierarchy: CPU cache, virtual memory & the page cache",
      theme: "Systems · part 2 — cache lines, page tables, and why a warm read never hits disk.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 60,
          lead: `<b>Systems ②</b> — locality and cache lines, then the two OS memory tricks every DB relies on.`,
          sub: [
            { id: "s1", est: 18, label: `Read CS:APP <b>Ch 6 "The Memory Hierarchy"</b> (registers → L1/L2/L3 → DRAM → disk; locality, cache lines, hit/miss).` },
            { id: "s2", est: 15, label: `Free alternative: Ulrich Drepper, <a href="https://lwn.net/Articles/250967/" target="_blank" rel="noopener">"What Every Programmer Should Know About Memory"</a> — the CPU-cache parts (≈ Parts 2–3).` },
            { id: "s3", est: 15, label: `<b>Virtual memory</b> (skim): OSTEP (free) <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf" target="_blank" rel="noopener">Ch 19 "Paging: Faster Translations (TLBs)"</a> — each process gets its own address space via page tables; the <b>TLB</b> caches translations so a hit makes it nearly free.` },
            { id: "s4", est: 12, label: `<b>The page cache</b> (know it exists): the OS keeps recently-used file pages in RAM. A <code>write()</code> only marks pages dirty and returns — durability needs <code>fsync</code> (LWN <a href="https://lwn.net/Articles/752063/" target="_blank" rel="noopener">"PostgreSQL's fsync() surprise"</a>). The <i>internals</i> come back in the extension.` },
          ],
          model: `A cache line is ~64 bytes; row-major traversal is fast because it uses whole lines, pointer-chasing thrashes cache. Orders of magnitude: L1 ~1ns, main memory ~100ns, SSD ~16µs, network within a DC ~0.5ms. And two levels up: the OS pages memory (TLB-cached) and caches file data in RAM — so "durable" means <code>fsync</code>'d, not "write() returned".`,
          cards: [
            { q: `Why do arrays beat linked lists for traversal?`, a: `A cache line is ~64 bytes; array/row-major traversal uses whole lines, pointer-chasing thrashes the cache.` },
            { q: `Order-of-magnitude latencies: L1, RAM, SSD, DC network?`, a: `L1 ~1ns, main memory ~100ns, SSD ~16µs, network within a datacenter ~0.5ms.` },
            { q: `What does the TLB do?`, a: `Caches virtual-page → physical-frame translations; a <b>hit</b> makes address translation nearly free, only a <b>miss</b> pays the page-table walk.` },
            { q: `Does a returning <code>write()</code> mean the data is durable?`, a: `No — it only marks page-cache pages dirty. Durability needs <code>fsync</code>/<code>fdatasync</code> (flush dirty pages + the disk's write cache).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback from d03: a context switch's <i>direct</i> cost (~1–few µs) is often dwarfed by the <i>indirect</i> cost — cold caches + a TLB flush. That's the real reason user-space coroutines are cheap.` },
        { id: "s2", type: "callout", label: `🔬 This is why "data-oriented design" and columnar storage win: pack the bytes you touch together so each cache-line fetch does useful work. The <b>page cache</b> is also why your DB's second read of a row is fast — and why <code>fsync</code> vs. "write returned" is the durability line you'll meet again at the WAL (d26).` },
      ],
    },
    {
      id: "d10", date: "2026-08-11", week: "w3", title: "EXPLAIN: reading the query planner's mind",
      theme: "Databases · part 2 — estimated vs actual rows is the #1 diagnostic.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          lead: `<b>Databases ②</b> — read a plan and diagnose a slow query.`,
          sub: [
            { id: "s1", est: 22, label: `Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/using-explain.html" target="_blank" rel="noopener">14.1 "Using EXPLAIN"</a> and UTIL's <a href="https://use-the-index-luke.com/sql/explain-plan/postgresql" target="_blank" rel="noopener">Postgres execution plans</a>.` },
            { id: "s2", est: 17, label: `Learn to read <b>Seq Scan / Index Scan / Index-Only Scan / Bitmap Heap Scan / Nested Loop vs Hash Join</b>.` },
            { id: "s3", est: 16, label: `Always use <code>EXPLAIN (ANALYZE, BUFFERS)</code>: a big gap between <i>estimated</i> and <i>actual</i> rows means stale stats (run <code>ANALYZE</code> / raise <code>default_statistics_target</code>).` },
          ],
          model: `The planner is <b>cost-based</b>, not rule-based: it will (correctly) ignore your index when a predicate matches a large fraction of rows, because a sequential scan is cheaper. An unused index isn't always a bug.`,
          cards: [
            { q: `<code>EXPLAIN ANALYZE</code> shows estimated ≫ actual rows — what does it mean?`, a: `Stale statistics — run <code>ANALYZE</code> / raise <code>default_statistics_target</code>.` },
            { q: `Why might the planner ignore your index?`, a: `It's cost-based: when a predicate matches a large fraction of rows, a sequential scan is cheaper. Not always a bug.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: <code>EXPLAIN (ANALYZE, BUFFERS) SELECT …</code> a query with and without a helpful index; watch the plan flip from Seq Scan to Index Scan and the cost drop.` },
        { id: "s2", type: "hint", label: `💡 <b>N+1</b> = 1 query for a list + N queries for each item's relation. Fix by eager-loading / JOIN / <code>IN (…)</code> batch — the most common ORM performance bug.` },
      ],
      note: "End of month 1's first heavy week — Networking + DevOps + Systems + DB all in motion.",
    },

    /* ==================== WEEK 4 ==================== */
    {
      id: "d11", date: "2026-08-13", week: "w4", title: "DNS resolution, end to end",
      theme: "Networking · part 4 — the recursive resolver as middleman.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 40,
          lead: `<b>Networking ④</b> — trace a name to an address, hop by hop.`,
          sub: [
            { id: "s1", est: 16, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/dns/what-is-dns/" target="_blank" rel="noopener">"What is DNS?"</a> + <a href="https://www.cloudflare.com/learning/dns/dns-server-types/" target="_blank" rel="noopener">DNS server types</a>.` },
            { id: "s2", est: 14, label: `The path: stub resolver → <b>recursive resolver</b> → root (13 root-server IPs) → TLD (<code>.com</code>) → authoritative → A/AAAA, with caching (TTL) at every hop.` },
            { id: "s3", cat: "lab", est: 10, label: `Run <code>dig +trace google.com</code> to watch the root→TLD→authoritative delegation live.` },
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
      id: "d12", date: "2026-08-15", week: "w4", title: "k8s scheduling, probes, requests/limits & HPA",
      theme: "DevOps · part 4 — the operational levers you get asked about.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          lead: `<b>DevOps ④</b> — how Pods get placed, kept healthy, and scaled.`,
          sub: [
            { id: "s1", est: 22, label: `Read the k8s <a href="https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/" target="_blank" rel="noopener">scheduler</a> (filter→score→bind) and <a href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" target="_blank" rel="noopener">liveness/readiness/startup probes</a>.` },
            { id: "s2", est: 19, label: `Read <a href="https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" target="_blank" rel="noopener">requests/limits</a> and <a href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" target="_blank" rel="noopener">HPA</a>.` },
            { id: "s3", est: 14, label: `<b>requests</b> = scheduling guarantee; <b>limits</b> = runtime cap (CPU throttled, memory over-limit → OOMKill).` },
          ],
          model: `<b>liveness</b> restarts an unhealthy Pod; <b>readiness</b> removes it from the Service until ready; <b>startup</b> protects slow boots. A failing <i>dependency</i> should flip readiness, not liveness — or you restart-loop a healthy Pod.`,
          cards: [
            { q: `requests vs limits?`, a: `<b>requests</b> = scheduling guarantee; <b>limits</b> = runtime cap (CPU throttled, memory over-limit → OOMKill).` },
            { q: `liveness vs readiness probe?`, a: `liveness restarts an unhealthy Pod; readiness removes it from the Service until ready. A failing <i>dependency</i> flips readiness, not liveness.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ requests≠limits is the root of "noisy neighbour" incidents. Set memory request = limit for predictable OOM behaviour; be careful with CPU limits (throttling adds tail latency).` },
        { id: "s2", type: "hint", label: `💡 HPA scales replica count toward a target metric (CPU/custom). It can't scale below readiness — an unready Pod serves no traffic, so probes and autoscaling are coupled.` },
      ],
    },
    {
      id: "d13", date: "2026-08-17", week: "w4", title: "Security foundations: OWASP 2025 + authn vs authz",
      theme: "Security · part 1 — the vocabulary you're measured against.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 50,
          lead: `<b>Security ①</b> — the risk landscape, and the authn/authz split.`,
          sub: [
            { id: "s1", est: 28, label: `Skim the <a href="https://owasp.org/Top10/2025/" target="_blank" rel="noopener">OWASP Top 10 (2025 — the current edition)</a>: #1 Broken Access Control, then Security Misconfiguration, Software Supply-Chain Failures, Cryptographic Failures, Injection…` },
            { id: "s2", est: 22, label: `Read the OWASP <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener">Authentication Cheat Sheet</a>.` },
          ],
          model: `<b>Authentication</b> = who you are; <b>authorization</b> = what you may do. "Broken Access Control" being #1 means most auth bugs are missing <i>authorization</i> checks — forgetting that <i>this</i> user owns <i>this</i> record (IDOR). Every endpoint needs an ownership check, not just a login gate.`,
          cards: [
            { q: `Authentication vs authorization?`, a: `authn = <b>who you are</b>; authz = <b>what you may do</b>. OWASP #1 (Broken Access Control) is mostly missing <i>authz</i> checks — IDOR.` },
            { q: `What does every endpoint need beyond a login gate?`, a: `An <b>ownership check</b> — that <i>this</i> user owns <i>this</i> record.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Security is threaded through the core (auth → OAuth/JWT → hashing → smart-contract vulns) and lands the capstone in week 12. Today is the map.` },
        { id: "s2", type: "hint", label: `💡 "Security misconfiguration" climbing to #2 is a DevOps overlap: default creds, open S3 buckets, verbose errors, missing headers. Config <i>is</i> attack surface.` },
      ],
      note: "🏁 Month-1 checkpoint week: Networking + DevOps foundations laid, plus Systems, DB and the security map.",
    },

    /* ==================== WEEK 5 ==================== */
    {
      id: "d14", date: "2026-08-19", week: "w5", title: "The TLS 1.3 handshake & PKI",
      theme: "Networking · part 5 — how two strangers agree a secret over a wiretap.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          lead: `<b>Networking ⑤</b> — what actually happens when the padlock appears.`,
          sub: [
            { id: "s1", est: 25, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/" target="_blank" rel="noopener">"What happens in a TLS handshake?"</a> (TLS 1.3 is <b>1-RTT</b>, with 0-RTT resumption).` },
            { id: "s2", est: 20, label: `For the byte level, skim <a href="https://tls13.xargs.org/" target="_blank" rel="noopener">The Illustrated TLS 1.3 Connection</a> (every byte annotated).` },
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
    {
      id: "d15", date: "2026-08-21", week: "w5", title: "MVCC: how Postgres lets readers not block writers",
      theme: "Databases · part 3 — every row carries its own version stamps.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          lead: `<b>Databases ③</b> — multi-version concurrency control, and why tables bloat.`,
          sub: [
            { id: "s1", est: 24, label: `Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/mvcc-intro.html" target="_blank" rel="noopener">Ch 13.1 Concurrency Control (MVCC)</a> + <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">13.2 Transaction Isolation</a>.` },
            { id: "s2", est: 18, label: `Each row version carries <code>xmin</code>/<code>xmax</code>; each txn sees a <b>snapshot</b>, so readers never block writers and vice-versa.` },
            { id: "s3", est: 13, label: `Deeper tuple-level detail: Egor Rogov's <a href="https://www.postgrespro.com/blog/pgsql/5967856" target="_blank" rel="noopener">MVCC series</a>.` },
          ],
          model: `An <code>UPDATE</code> is really <i>insert a new row version + mark the old dead</i> — so heavy-update tables bloat and need <b>VACUUM</b>/autovacuum. That single fact explains "my table is 5× its data size."`,
          cards: [
            { q: `What is an <code>UPDATE</code>, really, under MVCC?`, a: `Insert a <i>new</i> row version + mark the old dead (<code>xmin</code>/<code>xmax</code>) — so heavy-update tables bloat and need <b>VACUUM</b>.` },
            { q: `Why are long-running transactions dangerous in Postgres?`, a: `They hold back the <b>xmin horizon</b>, so VACUUM can't reclaim dead tuples cluster-wide → bloat.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "suggestion", label: `Preview: isolation levels are defined by which anomalies they forbid. MVCC snapshots give you Postgres's "Repeatable Read" (= snapshot isolation) for free.` },
        { id: "s2", type: "callout", label: `🔬 MVCC is why long-running transactions are dangerous in Postgres: they hold back the "xmin horizon" so VACUUM can't reclaim dead tuples cluster-wide → bloat.` },
      ],
    },
    {
      id: "d16", date: "2026-08-24", week: "w5", title: "Getting it out the door: deploys, GitOps & 12-factor",
      theme: "DevOps · part 5 — rolling vs blue-green vs canary, and config in the environment.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ⑤</b> — how changes reach production safely.`,
          sub: [
            { id: "s1", est: 27, label: `Read Martin Fowler <a href="https://martinfowler.com/bliki/BlueGreenDeployment.html" target="_blank" rel="noopener">BlueGreenDeployment</a> + <a href="https://martinfowler.com/bliki/CanaryRelease.html" target="_blank" rel="noopener">CanaryRelease</a> (rolling = k8s default).` },
            { id: "s2", est: 23, label: `Read the <a href="https://opengitops.dev/" target="_blank" rel="noopener">4 GitOps principles</a> and <a href="https://12factor.net/" target="_blank" rel="noopener">The Twelve-Factor App</a> (esp. III config in env, VI stateless, IX disposability, XI logs to stdout).` },
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

    /* ==================== WEEK 6 (4 side-days) ==================== */
    {
      id: "d17", date: "2026-08-27", week: "w6", title: "Crypto primitives: hash vs sign vs encrypt, Merkle trees",
      theme: "Blockchain · part 1 — get the three-way distinction exactly right.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ①</b> — the primitives every chain is built from.`,
          sub: [
            { id: "s1", est: 32, label: `Read <i>Mastering Ethereum</i> (2nd ed, free) <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_4.md" target="_blank" rel="noopener">Ch 4 "Cryptography"</a> and <i>Mastering Bitcoin</i> (3rd ed) <a href="https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch11_blockchain.adoc" target="_blank" rel="noopener">Ch 11</a> (Merkle-tree section).` },
            { id: "s2", est: 23, label: `The two curves you use: Ethereum/Bitcoin = <b>ECDSA/secp256k1</b> + <b>keccak256</b>; Solana = <b>ed25519 (EdDSA)</b> (<a href="https://datatracker.ietf.org/doc/html/rfc8032" target="_blank" rel="noopener">RFC 8032</a>).` },
          ],
          model: `<b>Hashing</b> = one-way integrity (SHA-256/keccak256); <b>encryption</b> = reversible secrecy; <b>signing</b> = authenticity + non-repudiation. A <b>Merkle tree</b> hashes pairs up to one root, so you can prove one leaf is included with ~log(N) hashes.`,
          cards: [
            { q: `Hash vs encrypt vs sign?`, a: `Hash = one-way integrity; encryption = reversible secrecy; signing = authenticity + non-repudiation.` },
            { q: `What does a Merkle tree let you prove?`, a: `That one leaf is included, with ~log(N) hashes (hash pairs up to a single root).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Ethereum's state is a <b>Merkle-Patricia trie</b> (four tries: state/storage/tx/receipts) — <a href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/" target="_blank" rel="noopener">ethereum.org</a>. That's how a light client proves a balance without the whole chain.` },
        { id: "s2", type: "hint", label: `💡 keccak256 (Ethereum) ≠ the finalized NIST SHA-3 — a common trick question. Same sponge construction, different padding.` },
      ],
    },
    {
      id: "d18", date: "2026-08-29", week: "w6", title: "HTTP/1.1 → HTTP/2 → HTTP/3 & QUIC",
      theme: "Networking · part 6 — each version fixes the last one's bottleneck.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          lead: `<b>Networking ⑥</b> — why HTTP kept getting rewritten.`,
          sub: [
            { id: "s1", est: 27, label: `Read HPBN <a href="https://hpbn.co/http1x/" target="_blank" rel="noopener">HTTP/1.X</a> + <a href="https://hpbn.co/http2/" target="_blank" rel="noopener">HTTP/2</a> (persistent connections, why pipelining failed, H2 multiplexing/framing/HPACK).` },
            { id: "s2", est: 23, label: `For H3/QUIC, read the free <a href="https://http3-explained.haxx.se/" target="_blank" rel="noopener">HTTP/3 explained</a>: reliable multiplexed streams over <b>UDP</b>, TLS 1.3 built in, connection migration.` },
          ],
          model: `H2 fixed HTTP-level HOL blocking (multiplexing) but sits on TCP, so one lost packet still stalls all streams at the transport layer. H3 moves multiplexing into QUIC/UDP so a loss stalls only <i>its</i> stream. That's the whole H2→H3 story.`,
          cards: [
            { q: `H2 fixed HOL blocking, so why does one lost packet still stall all streams?`, a: `H2 multiplexes over <b>TCP</b> — the stall is at the transport layer. H3 moves multiplexing into QUIC/UDP, so a loss stalls only its own stream.` },
            { q: `What transport does HTTP/3 run on?`, a: `<b>QUIC over UDP</b>, with TLS 1.3 built in and connection migration.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "suggestion", label: `Pair with keep-alive/pooling (MDN <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x" target="_blank" rel="noopener">Connection management</a>) — check a client you ship: Go <code>http.Transport.MaxIdleConnsPerHost</code>, Node <code>http.Agent keepAlive</code>.` },
        { id: "s2", type: "hint", label: `💡 HPACK/QPACK header compression is why H2/H3 are efficient for many small requests — H1's repeated plaintext headers were a real cost at scale.` },
      ],
    },
    {
      id: "d19", date: "2026-08-31", week: "w6", title: "Redis internals: why single-threaded is fast",
      theme: "Caching · part 1 — one event loop, atomic commands, no locks.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 50,
          lead: `<b>Caching ①</b> — how one thread does millions of ops/sec.`,
          sub: [
            { id: "s1", est: 20, label: `Read the Redis <a href="https://redis.io/docs/latest/develop/get-started/faq/" target="_blank" rel="noopener">FAQ</a> (single-thread rationale) + <a href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener">data types</a>.` },
            { id: "s2", est: 16, label: `Command execution runs on <b>one thread on an event loop</b> → every command is atomic (no client-side locks for <code>INCR</code>/<code>SETNX</code>). Redis 6+ multithreads only network I/O, not command execution.` },
            { id: "s3", est: 14, label: `Structures by use: sorted sets → leaderboards & sliding-window rate limiting; hashes → objects; streams → event log; HLL → cardinality.` },
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
      id: "d20", date: "2026-09-01", week: "w6", title: "Isolation levels & the anomalies they prevent",
      theme: "Databases · part 4 — and the one everyone misses: write skew.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 60,
          lead: `<b>Databases ④</b> — map each anomaly to the level that stops it.`,
          sub: [
            { id: "s1", est: 32, label: `Read DDIA <b>Ch 7 "Weak Isolation Levels"</b> straight through (Read Committed → Snapshot Isolation → Preventing Lost Updates → Write Skew & Phantoms).` },
            { id: "s2", est: 28, label: `Cross-check PG's <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">13.2 table</a>. Cheat-sheet: dirty read → Read Committed; non-repeatable → Repeatable Read/SI; phantom → Serializable; lost update → SI does NOT stop it (use <code>FOR UPDATE</code>).` },
          ],
          model: `<b>Write skew</b> is the interview-grade one: two txns read an overlapping set, each updates a <i>different</i> row, together breaking an invariant (both on-call doctors go off-call). Snapshot isolation allows it; only Serializable (SSI) stops it. Relevant to any check-then-act in your market settlement.`,
          cards: [
            { q: `What is write skew?`, a: `Two txns read an overlapping set, each updates a <i>different</i> row, together breaking an invariant. Snapshot isolation allows it; only Serializable stops it.` },
            { q: `Postgres "Repeatable Read" actually is…?`, a: `<b>Snapshot Isolation</b>. And PG never shows dirty reads, even at Read Committed.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧠 Postgres names are confusing: PG "Repeatable Read" is actually <b>Snapshot Isolation</b>, and PG never shows dirty reads even at Read Committed.` },
        { id: "s2", type: "hint", label: `💡 Cheapest correctness fix for lost updates: an atomic <code>UPDATE … SET x = x + 1</code> or <code>SELECT … FOR UPDATE</code>, not a read-then-write in app code.` },
      ],
      note: "Month 2 underway — data, HTTP, caching and blockchain now interleaving with DevOps.",
    },

    /* ==================== WEEK 7 ==================== */
    {
      id: "d21", date: "2026-09-02", week: "w7", title: "Observability: golden signals, histograms & why p99",
      theme: "DevOps · part 6 — averages lie; you live at the tail.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          lead: `<b>DevOps ⑥</b> — what to measure, and why percentiles beat averages.`,
          sub: [
            { id: "s1", est: 30, label: `Read Google SRE (free) <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">Ch 6 "Monitoring Distributed Systems"</a> — the <b>Four Golden Signals</b> (Latency, Traffic, Errors, Saturation).` },
            { id: "s2", est: 25, label: `Read Prometheus <a href="https://prometheus.io/docs/practices/histograms/" target="_blank" rel="noopener">"Histograms and summaries"</a>: histograms expose <code>_bucket{le=…}</code> so the server computes <code>histogram_quantile(0.99, …)</code> and can aggregate across instances (summaries can't).` },
          ],
          model: `Why p99 not average: the mean is dominated by the bulk; tail latency is what users and fan-out/queued requests feel. One slow dependency in a fan-out makes the tail the effective latency.`,
          cards: [
            { q: `The Four Golden Signals?`, a: `Latency, Traffic, Errors, Saturation.` },
            { q: `Why report p99, not average latency?`, a: `The mean is dominated by the bulk; the <b>tail</b> is what users and fan-out/queued requests actually feel.` },
            { q: `The Prometheus cardinality trap?`, a: `A series = metric + every label combo. A user/request ID or full URL in a label → series explosion that OOMs the server. Labels must be bounded.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ <b>Cardinality trap:</b> a Prometheus series = metric name + every label combo. Put a user/request ID or full URL in a label and you get a series explosion that OOMs the server. Labels must be bounded.` },
        { id: "s2", type: "hint", label: `💡 Three lenses: <b>Golden Signals</b> (services) ≈ <b>RED</b> (Rate/Errors/Duration) + Saturation; <b>USE</b> (Utilization/Saturation/Errors) for resources (the load-testing day).` },
      ],
    },
    {
      id: "d22", date: "2026-09-05", week: "w7", title: "Inside the EVM: stack machine, storage, gas",
      theme: "Blockchain · part 2 — what your Solidity actually compiles down to.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 60,
          lead: `<b>Blockchain ②</b> — the machine your contracts run on.`,
          sub: [
            { id: "s1", est: 32, label: `Read <i>Mastering Ethereum</i> <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_14.md" target="_blank" rel="noopener">Ch 14 "The EVM"</a> and explore <a href="https://www.evm.codes/" target="_blank" rel="noopener">evm.codes</a> (per-opcode gas + live playground).` },
            { id: "s2", est: 28, label: `The EVM is a <b>stack machine</b> (1024-deep, 256-bit words). Three data locations: <b>storage</b> (persistent, expensive, in the state trie), <b>memory</b> (per-call, cheap, wiped), <b>calldata</b> (read-only input).` },
          ],
          model: `Every opcode costs <b>gas</b>; <code>SSTORE</code> is the pricey one (cold vs warm, EIP-2929). The account model: <b>EOA</b> (key-controlled) vs <b>contract account</b> (code + storage) — every state change starts from an EOA-signed tx.`,
          cards: [
            { q: `The EVM's three data locations?`, a: `<b>storage</b> (persistent, expensive, in the state trie), <b>memory</b> (per-call, cheap, wiped), <b>calldata</b> (read-only input).` },
            { q: `What is gas, and why does it exist?`, a: `Per-opcode metering + anti-DoS (<code>SSTORE</code> is the pricey one). Running out reverts state but still costs the gas burned — the EVM's answer to the halting problem.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: paste a few opcodes into the <a href="https://www.evm.codes/playground" target="_blank" rel="noopener">evm.codes playground</a> and single-step — watch the stack push/pop and gas tick down. Best way to make "stack machine" click.` },
        { id: "s2", type: "hint", label: `💡 Gas is a metering + anti-DoS mechanism: you pre-pay a gas limit; unused gas is refunded, running out reverts state but still costs the gas burned. It's the EVM's answer to the halting problem.` },
      ],
    },
    {
      id: "d23", date: "2026-09-07", week: "w7", title: "Message queues vs logs — the core distinction",
      theme: "Messaging · part 1 — delete-on-ack vs retain-and-offset.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 55,
          lead: `<b>Messaging ①</b> — the distinction that unlocks all of streaming.`,
          sub: [
            { id: "s1", est: 30, label: `Read DDIA <b>Ch 11</b> "Messaging Systems" → "Partitioned Logs", plus Jay Kreps' <a href="https://web.archive.org/web/20260609223006/https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying" target="_blank" rel="noopener">"The Log"</a> (archived — LinkedIn removed the original).` },
            { id: "s2", est: 25, label: `<b>Queue/broker</b> (RabbitMQ, SQS): message deleted on ack, load-balanced across competing consumers, weak ordering. <b>Log</b> (Kafka): append-only, retained, each consumer tracks its own <b>offset</b> — replayable, ordered within a partition.` },
          ],
          model: `"RabbitMQ or Kafka?" → task/RPC work with per-message ack/priority/TTL → broker/queue; event streaming, replay, multiple independent consumers, high throughput → log/Kafka. The axis is delete-on-ack vs retain-with-offset.`,
          cards: [
            { q: `Message queue vs log — the core axis?`, a: `<b>delete-on-ack</b> (RabbitMQ/SQS: load-balanced, weak order) vs <b>retain-with-offset</b> (Kafka: append-only, replayable, ordered per partition).` },
            { q: `RabbitMQ or Kafka?`, a: `Task/RPC work with per-message ack/priority/TTL → queue; event streaming, replay, many independent consumers, high throughput → log/Kafka.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 A log is the primitive behind replication, CDC, and stream processing — the point of Kreps' essay. Postgres's WAL (next DB day) is literally the same idea inside one database.` },
        { id: "s2", type: "hint", label: `💡 SQS Standard = at-least-once + best-effort order; SQS FIFO = ordered + dedup, lower throughput. "Exactly-once" almost always means at-least-once + idempotency (later this thread).` },
      ],
    },

    /* ==================== WEEK 8 ==================== */
    {
      id: "d24", date: "2026-09-10", week: "w8", title: "Load balancers (L4 vs L7), reverse proxies & CDNs",
      theme: "Networking · part 7 — what nginx and your ALB really do.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          lead: `<b>Networking ⑦</b> — the boxes between the client and your app.`,
          sub: [
            { id: "s1", est: 16, label: `Read Cloudflare on <a href="https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/" target="_blank" rel="noopener">reverse proxies</a> + <a href="https://www.cloudflare.com/learning/cdn/what-is-a-cdn/" target="_blank" rel="noopener">CDNs</a>.` },
            { id: "s2", est: 16, label: `<b>L4 LB</b> "moves packets" (routes by IP/port, can't read URLs — NLB, IPVS, HAProxy TCP). <b>L7 LB</b> "reads requests" (route <code>/api</code> vs <code>/img</code>, terminate TLS, sticky sessions — nginx, Envoy, ALB).` },
            { id: "s3", est: 13, label: `A <b>reverse proxy</b> does TLS termination, caching, compression, buffering, hides the origin; a <b>CDN</b> is edge caches near users.` },
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
      id: "d25", date: "2026-09-13", week: "w8", title: "OAuth 2.0, OIDC, PKCE & JWT the right way",
      theme: "Security · part 2 — and the alg:none footgun.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 60,
          lead: `<b>Security ②</b> — the modern auth flow, and how tokens get forged.`,
          sub: [
            { id: "s1", est: 32, label: `Read the OAuth <a href="https://www.rfc-editor.org/rfc/rfc6749" target="_blank" rel="noopener">RFC 6749</a> authorization-code flow + <a href="https://www.rfc-editor.org/rfc/rfc7636" target="_blank" rel="noopener">PKCE (RFC 7636)</a>, and PortSwigger's <a href="https://portswigger.net/web-security/jwt" target="_blank" rel="noopener">JWT attacks</a>.` },
            { id: "s2", est: 28, label: `<b>Authorization Code + PKCE</b> is the modern default for all client types: send <code>code_challenge=S256(code_verifier)</code> up front, the raw verifier on the back channel, so a stolen code is useless.` },
          ],
          model: `For JWT: pin the expected <code>alg</code> <b>server-side</b>; never trust the token's <code>alg</code> header. The <b>alg:none</b> attack drops the signature; the RS256→HS256 confusion attack signs with the public key as an HMAC secret. Treat accepted algorithms as an allowlist.`,
          cards: [
            { q: `The modern default OAuth flow for all client types?`, a: `<b>Authorization Code + PKCE</b>: send <code>code_challenge = S256(verifier)</code> up front, the raw verifier on the back channel — so a stolen code is useless.` },
            { q: `How do you harden JWT verification?`, a: `Pin the expected <code>alg</code> <b>server-side</b> (allowlist); never trust the token's <code>alg</code> header. Blocks alg:none and RS256→HS256 confusion.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ <b>alg:none</b>: an attacker sets the header algorithm to "none" and drops the signature; a naive verifier that reads <code>alg</code> from the token trusts unsigned data. Reject <code>none</code> and its case variants.` },
        { id: "s2", type: "hint", label: `💡 Access token vs ID token: OAuth 2.0 is <i>authorization</i> (access tokens for APIs); OIDC adds <i>authentication</i> (the ID token = who the user is). Don't use an ID token as an API access token.` },
      ],
    },
    {
      id: "d26", date: "2026-09-15", week: "w8", title: "Locking, deadlocks & the write-ahead log",
      theme: "Databases · part 5 — log the change before you touch the page.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          lead: `<b>Databases ⑤</b> — how the DB stays correct under contention and crashes.`,
          sub: [
            { id: "s1", est: 30, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/explicit-locking.html" target="_blank" rel="noopener">13.3 "Explicit Locking"</a> (row/table modes, the conflict matrix, <b>deadlock</b> detection via the waits-for graph + <code>deadlock_timeout</code>).` },
            { id: "s2", est: 25, label: `Read <a href="https://www.postgresql.org/docs/current/wal-intro.html" target="_blank" rel="noopener">Ch 30 "Write-Ahead Log"</a>: append the change to the log (fsync'd) <i>before</i> modifying the data page, so a crash can redo.` },
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

    /* ==================== WEEK 9 ==================== */
    {
      id: "d27", date: "2026-09-16", week: "w9", title: "Solana's account model — everything is an account",
      theme: "Blockchain · part 3 — stateless programs + separate data accounts.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ③</b> — the mental flip from the EVM.`,
          sub: [
            { id: "s1", est: 20, label: `Read Solana docs <a href="https://solana.com/docs/core/accounts" target="_blank" rel="noopener">Accounts</a> + <a href="https://solana.com/docs/core/programs" target="_blank" rel="noopener">Programs</a>.` },
            { id: "s2", est: 20, label: `<b>Programs are stateless</b> (executable accounts holding sBPF bytecode); all mutable state lives in <b>separate data accounts</b> a transaction must pass in. Accounts pay <b>rent</b> (must be rent-exempt).` },
            { id: "s3", est: 15, label: `Side-by-side: <a href="https://solana.com/developers/evm-to-svm/accounts" target="_blank" rel="noopener">EVM→SVM: Accounts</a>.` },
          ],
          model: `Contrast with Ethereum's "contract = code + its own storage." Because state is external, Solana instructions must list every account they read/write up front — the constraint that later buys parallelism (Sealevel).`,
          cards: [
            { q: `Where does Solana program state live?`, a: `Programs are <b>stateless</b> (executable accounts); all mutable state is in <i>separate</i> data accounts a tx must pass in explicitly.` },
            { q: `Why must Solana instructions declare all accounts up front?`, a: `It's the constraint that later buys <b>parallelism</b> — Sealevel executes non-overlapping txs at the same time.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Rent-exemption is a real footgun: an account below the minimum balance can be purged. When you allocate a PDA, fund it for its data size.` },
        { id: "s2", type: "hint", label: `💡 "Everything is an account" includes programs, token mints, and your data — a uniform model that makes the runtime simple but forces explicit account passing everywhere.` },
      ],
    },
    {
      id: "d28", date: "2026-09-18", week: "w9", title: "SLIs, SLOs, error budgets & tracing",
      theme: "DevOps · part 7 — turn reliability into a number you can spend.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ⑦</b> — reliability as an engineering budget, plus how traces stitch together.`,
          sub: [
            { id: "s1", est: 22, label: `Read Google SRE <a href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">Ch 4 "Service Level Objectives"</a> + the error-budget part of <a href="https://sre.google/sre-book/embracing-risk/" target="_blank" rel="noopener">Ch 3 "Embracing Risk"</a>.` },
            { id: "s2", est: 14, label: `Read OpenTelemetry <a href="https://opentelemetry.io/docs/concepts/signals/traces/" target="_blank" rel="noopener">Traces</a>.` },
            { id: "s3", est: 14, label: `<b>SLI</b> = measured level (e.g. % requests < 300 ms); <b>SLO</b> = target (99.9%/28d); <b>error budget</b> = 1 − SLO (99.9% ⇒ ~43 min/month).` },
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
      id: "d29", date: "2026-09-21", week: "w9", title: "How a server accepts 10k connections: epoll & the event loop",
      theme: "Systems · part 3 — the pattern behind nginx, Node, tokio & Go's netpoller.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ③</b> — the I/O model that scales past thread-per-connection.`,
          sub: [
            { id: "s1", est: 27, label: `Read Dan Kegel's <a href="http://www.kegel.com/c10k.html" target="_blank" rel="noopener">The C10K problem</a> for the model (thread-per-connection vs <code>select</code>/<code>poll</code> vs <b>epoll</b>, edge- vs level-triggered).` },
            { id: "s2", est: 23, label: `The modern pattern: a few event-loop threads each call <code>epoll_wait()</code> for ready fds, then do <b>non-blocking</b> <code>accept</code>/<code>read</code>/<code>write</code>.` },
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

    /* ==================== WEEK 10 ==================== */
    {
      id: "d30", date: "2026-09-24", week: "w10", title: "A transaction's life & EIP-1559 fees",
      theme: "Blockchain · part 4 — base fee burned, tip to the proposer.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ④</b> — from signed bytes to state change, and how fees are set.`,
          sub: [
            { id: "s1", est: 24, label: `Read <i>Mastering Ethereum</i> <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_6.md" target="_blank" rel="noopener">Ch 6 "Transactions"</a> and <a href="https://eips.ethereum.org/EIPS/eip-1559" target="_blank" rel="noopener">EIP-1559</a>.` },
            { id: "s2", est: 15, label: `A tx carries nonce, gas fields, to/value/data, signature (RLP-encoded).` },
            { id: "s3", est: 16, label: `<b>EIP-1559</b>: blocks target 50% fullness (elasticity 2); the <b>base fee</b> adjusts ≤12.5%/block and is <b>burned</b>; a <b>tip</b> goes to the proposer.` },
          ],
          model: `Cite the invariants — <b>elasticity 2</b> (50% target) and <b>max ±12.5%/block</b> base-fee change — NOT "15M/30M gas" (historical mainnet values, not protocol constants). A type-2 tx sets <code>max_fee</code> + <code>max_priority_fee</code> and is refunded the difference.`,
          cards: [
            { q: `EIP-1559 base fee — the protocol invariants (not 15M/30M)?`, a: `Elasticity 2 (blocks target 50% full); base fee changes ≤ ±12.5%/block and is <b>burned</b>; a <b>tip</b> goes to the proposer.` },
            { q: `What does the account nonce do?`, a: `Per-account, strictly sequential — prevents replay and orders your txs. A stuck low-nonce tx blocks all higher ones ("nonce gap").` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Calldata is priced per byte (cheap-ish) while <code>SSTORE</code> is expensive — exactly why rollups post compressed calldata/blobs to L1 instead of storage. Ties your gas intuition to why L2s are cheaper.` },
        { id: "s2", type: "hint", label: `💡 The nonce is per-account and strictly sequential — it's what prevents replay and enforces ordering of your own txs. A stuck low-nonce tx blocks all higher ones ("nonce gap").` },
      ],
    },
    {
      id: "d31", date: "2026-09-26", week: "w10", title: "Kafka's model: partitions, offsets, consumer groups, ISR",
      theme: "Messaging · part 2 — the unit of parallelism is the partition.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 55,
          lead: `<b>Messaging ②</b> — Kafka's core model and durability knobs.`,
          sub: [
            { id: "s1", est: 20, label: `Read <i>Kafka: The Definitive Guide</i> (2nd ed, <a href="https://www.confluent.io/resources/kafka-the-definitive-guide-v2/" target="_blank" rel="noopener">free from Confluent</a>) Ch 1 + the internals/reliability chapters.` },
            { id: "s2", est: 18, label: `A <b>topic</b> splits into <b>partitions</b> (parallelism + ordering); each record has a monotonic <b>offset</b>; a <b>consumer group</b> assigns each partition to exactly one member (parallelism ≤ partition count).` },
            { id: "s3", est: 17, label: `Durability: replicas (leader + followers); <b>ISR</b> = replicas caught up to the leader. <code>acks=all</code> + <code>min.insync.replicas=2</code> ⇒ durable once all ISR have it.` },
          ],
          model: `Ordering is guaranteed only <i>within a partition</i>. For per-entity order (all events for one user/market in order), key by that entity so they land in the same partition.`,
          cards: [
            { q: `Kafka's unit of parallelism and ordering?`, a: `The <b>partition</b>. Ordering holds only <i>within</i> a partition; a consumer group assigns each partition to exactly one member.` },
            { q: `<code>acks=all</code> + <code>min.insync.replicas=2</code> gives you what?`, a: `A write is durable once all <b>in-sync replicas (ISR)</b> have it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ More consumers than partitions = idle consumers (nothing to assign). Partition count is your parallelism ceiling and is painful to change later — size it deliberately.` },
        { id: "s2", type: "hint", label: `💡 "Kafka is a database you tail": consumers store their own offset, so two independent services read the same topic at their own pace and can replay from offset 0.` },
      ],
    },
    {
      id: "d32", date: "2026-09-29", week: "w10", title: "Review: Rust ownership & the borrow checker",
      theme: "Review · a deliberate re-grounding in a hard model you already use.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          lead: `<b>Review</b> — re-derive the model under your Solana/Anchor work.`,
          sub: [
            { id: "s1", est: 19, label: `Re-read <i>The Rust Book</i> <a href="https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html" target="_blank" rel="noopener">Ch 4 "Understanding Ownership"</a> (move/borrow/lifetimes).` },
            { id: "s2", cat: "exercise", est: 13, label: `Without looking, explain aloud: why can't a <code>&mut</code> coexist with any other borrow? What does a lifetime annotation actually constrain?` },
            { id: "s3", cat: "exercise", est: 13, label: `Write three snippets that <i>fail</i> to compile and predict the exact borrow-checker error before running.` },
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

    /* ==================== WEEK 11 ==================== */
    {
      id: "d33", date: "2026-09-30", week: "w11", title: "Cache patterns, the stampede & invalidation",
      theme: "Caching · part 2 — the hard part isn't caching, it's invalidating.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 50,
          lead: `<b>Caching ②</b> — patterns, persistence, and surviving a hot-key expiry.`,
          sub: [
            { id: "s1", est: 27, label: `Read AWS <a href="https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html" target="_blank" rel="noopener">caching patterns</a> (cache-aside vs write-through vs write-behind) and the Redis <a href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">eviction</a> + <a href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">persistence (RDB/AOF)</a> pages.` },
            { id: "s2", est: 23, label: `Handle the <b>stampede/thundering herd</b> (hot key expires → thousands of misses hit the DB) with single-flight/request-coalescing, a per-key lock (<code>SET k v NX PX ttl</code>), stale-while-revalidate, and <b>TTL jitter</b>.` },
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
    {
      id: "d34", date: "2026-10-02", week: "w11", title: "Sealevel, PDAs & CPIs — Solana's parallel runtime",
      theme: "Blockchain · part 5 — why declaring accounts up front buys parallelism.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ⑤</b> — the runtime, program addresses, and cross-program calls.`,
          sub: [
            { id: "s1", est: 22, label: `Read Solana docs <a href="https://solana.com/docs/core/pda" target="_blank" rel="noopener">PDAs</a> + <a href="https://solana.com/docs/core/cpi" target="_blank" rel="noopener">CPIs</a> + <a href="https://solana.com/docs/core/fees/compute-budget" target="_blank" rel="noopener">Compute Budget</a>, and the <a href="https://docs.anza.xyz/validator/runtime" target="_blank" rel="noopener">Sealevel runtime</a>.` },
            { id: "s2", est: 18, label: `Because every instruction declares the accounts it reads/writes, the runtime executes non-overlapping txs <b>in parallel</b> (writes serialized per account, reads parallel).` },
            { id: "s3", est: 15, label: `<b>PDAs</b> = deterministic off-curve program-owned addresses (signed via <code>invoke_signed</code>); <b>CPIs</b> = one program calling another; CU: 200K default/instr, 1.4M max/tx.` },
          ],
          model: `EVM↔SVM in one line: Ethereum executes txs <i>sequentially</i> (global state, implicit access); Solana executes them <i>in parallel</i> by forcing explicit account declarations. Everything odd about Solana dev flows from that trade.`,
          cards: [
            { q: `EVM vs SVM execution, in one line?`, a: `Ethereum executes txs <b>sequentially</b> (implicit access); Solana executes them <b>in parallel</b> by forcing explicit account declarations.` },
            { q: `What is a PDA?`, a: `A deterministic <b>off-curve</b>, program-owned address, signed via <code>invoke_signed</code> — no private key.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Currency note: Solana's classic consensus is PoH + Tower BFT, but a new design ("Alpenglow") is landing in 2026 — know Tower BFT as the deployed model, and that it's being superseded.` },
        { id: "s2", type: "hint", label: `💡 Priority fee = <code>compute_unit_price × compute_unit_limit</code>. Set a tight CU limit and a price to land in a congested block — the Solana analogue of an EIP-1559 tip.` },
      ],
    },
    {
      id: "d35", date: "2026-10-05", week: "w11", title: "Load & stress testing without fooling yourself",
      theme: "DevOps · part 8 — coordinated omission and the USE method.",
      tasks: [
        { id: "t1", obj: OPS, cat: "watch", est: 55,
          lead: `<b>DevOps ⑧</b> — why most load tests lie, and how to measure honestly.`,
          sub: [
            { id: "s1", cat: "watch", est: 20, label: `Watch Gil Tene, <a href="https://www.youtube.com/watch?v=lJ8ydIuPFeU" target="_blank" rel="noopener">"How NOT to Measure Latency" (Strange Loop, ~43 min)</a> (coordinated omission ~33:50).` },
            { id: "s2", est: 18, label: `Read Brendan Gregg's <a href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">USE Method</a>: for each resource check Utilization, Saturation, Errors.` },
            { id: "s3", est: 17, label: `Tool axis: <code>ab</code>/<code>wrk</code> are closed-loop (throughput-driven, prone to CO); <code>vegeta</code>/<code>k6</code> can hold a fixed arrival rate (open-loop).` },
          ],
          model: `<b>Coordinated omission</b>: a load tool that waits for a slow response before sending the next request silently deletes the worst samples — making the tail look great when it's awful. Drive a <b>constant arrival rate</b> and report from full distributions (HdrHistogram), not averages.`,
          cards: [
            { q: `What is coordinated omission?`, a: `A load tool that waits for a slow response before sending the next request silently deletes the worst samples — making the tail look great when it's awful.` },
            { q: `How do you load-test honestly?`, a: `Drive a <b>constant arrival rate</b> (open-loop: vegeta/k6) and report from full distributions (HdrHistogram), not averages.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: run <code>k6</code> against a service with a p99 <code>threshold</code>; then add a 200ms stall to 1% of responses and watch p99 (not the average) catch it.` },
        { id: "s2", type: "hint", label: `💡 Capacity is about headroom, not a single number: high utilization with <i>no</i> saturation can be fine; <i>any</i> saturation (a growing queue/run-queue) usually means a real problem.` },
      ],
    },

    /* ==================== WEEK 12 ==================== */
    {
      id: "d36", date: "2026-10-08", week: "w12", title: "Consensus: PoW, longest chain & what 'finality' means",
      theme: "Blockchain · part 6 — agreement without a coordinator.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ⑥</b> — how a decentralized network agrees on one history.`,
          sub: [
            { id: "s1", est: 30, label: `Read <i>Mastering Bitcoin</i> (3rd ed) <a href="https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch12_mining.adoc" target="_blank" rel="noopener">Ch 12 "Mining and Consensus"</a> (PoW, difficulty, best chain = most cumulative work).` },
            { id: "s2", est: 25, label: `Read ethereum.org <a href="https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/gasper/" target="_blank" rel="noopener">Gasper</a> (Casper FFG finality + LMD-GHOST fork choice) and Vitalik's <a href="https://blog.ethereum.org/2016/05/09/on-settlement-finality" target="_blank" rel="noopener">"On Settlement Finality"</a>.` },
          ],
          model: `PoW finality is <b>probabilistic</b> (more confirmations = exponentially safer); PoS adds <b>economic finality</b> (revert costs slashed stake). Reorgs happen — "finality" is a spectrum, not a switch.`,
          cards: [
            { q: `PoW finality vs PoS finality?`, a: `PoW is <b>probabilistic</b> (more confirmations = exponentially safer); PoS adds <b>economic finality</b> (reverting costs slashed stake). Finality is a spectrum.` },
            { q: `What does Solana's PoH provide?`, a: `A <b>verifiable clock</b>, so validators needn't agree on time before ordering — a different answer to "who decides order".` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 CAP-flavoured trade-off: a chain can't have instant finality, full availability, and permissionless decentralization at once — different chains pick different points. Beats memorizing any single algorithm.` },
        { id: "s2", type: "callout", label: `🔬 Solana's PoH gives a verifiable clock so validators needn't agree on time before ordering — a different answer to the same "who decides order" question.` },
      ],
    },
    {
      id: "d37", date: "2026-10-10", week: "w12", title: "Password hashing, sessions vs tokens & TLS recap",
      theme: "Security · part 3 — store secrets like they'll be stolen.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 45,
          lead: `<b>Security ③</b> — credential storage and session design, done right.`,
          sub: [
            { id: "s1", est: 17, label: `Read the OWASP <a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener">Password Storage</a> + <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener">Session Management</a> cheat sheets.` },
            { id: "s2", est: 15, label: `Use <b>Argon2id</b> (min m=19 MiB, t=2, p=1) for new systems; <b>bcrypt</b> (cost ≥10) is legacy-only and caps input at 72 bytes.` },
            { id: "s3", est: 13, label: `Sessions vs tokens: server-side session ids in <code>Secure; HttpOnly; SameSite</code> cookies vs stateless JWTs — and never store tokens in <code>localStorage</code> (XSS reads it).` },
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
    {
      id: "d38", date: "2026-10-12", week: "w12", title: "🎓 Capstone: smart-contract security — reentrancy & oracle manipulation",
      theme: "Security · part 4 — the two bug classes that drain DeFi, in your domain.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 60,
          lead: `<b>Security ④ (capstone)</b> — the vulnerabilities most relevant to your FPMM/LMSR market.`,
          sub: [
            { id: "s1", est: 22, label: `Read the Solidity docs <a href="https://docs.soliditylang.org/en/latest/security-considerations.html" target="_blank" rel="noopener">Security Considerations</a> (checks-effects-interactions) and samczsun's <a href="https://samczsun.com/so-you-want-to-use-a-price-oracle/" target="_blank" rel="noopener">"So you want to use a price oracle"</a>.` },
            { id: "s2", est: 20, label: `<b>Reentrancy</b>: any external call hands control to the callee <i>before</i> your state settles → do Checks → Effects → <b>Interactions last</b>, or use a <code>nonReentrant</code> mutex; beware read-only reentrancy (a view returns wrong data mid-write — the Curve case).` },
            { id: "s3", est: 18, label: `<b>Oracle manipulation</b>: on-chain spot prices are attacker-controllable within a tx (flash loans) → use TWAPs / robust feeds.` },
          ],
          model: `Checks-Effects-Interactions in one line: validate, then write ALL state, then make external calls — so a re-entrant call always sees finalized state. OZ <code>ReentrancyGuard</code> is a storage flag that reverts on re-entry.`,
          cards: [
            { q: `Checks-Effects-Interactions in one line?`, a: `Validate, then write ALL state, then make external calls <b>last</b> — so a re-entrant call always sees finalized state.` },
            { q: `Why are on-chain spot prices dangerous as an oracle?`, a: `They're attacker-controllable within a tx via <b>flash loans</b> → use TWAPs / robust feeds.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🏁 Core complete — and the <b>extension</b> continues right below (weeks 13–25): every thread picks up in order and goes <i>deeper under the hood</i> — Raft/CAP/quorums, VACUUM/TOAST/joins/LSM, rollups/blobs/MEV/ZK, io_uring/page cache, and Go/Python/C++/Rust runtime reviews.` },
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
     *  Python free-threading). Dates 2026-10-14 → 2027-01-10.
     * ================================================================== */

    /* ==================== WEEK 13 ==================== */
    {
      id: "d39", date: "2026-10-14", week: "w13", title: "Consensus I: Raft — leader election & log replication",
      theme: "Distributed systems · part 1 — one strong leader makes agreement tractable.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 55,
          lead: `<b>Distributed systems ①</b> — how a cluster agrees on one log despite crashes.`,
          sub: [
            { id: "s1", est: 33, label: `Read the Raft paper (Extended Version) <a href="https://raft.github.io/raft.pdf" target="_blank" rel="noopener">"In Search of an Understandable Consensus Algorithm"</a> (Ongaro & Ousterhout) — §5 leader election + log replication.` },
            { id: "s2", cat: "watch", est: 22, label: `Watch it happen: <a href="http://thesecretlivesofdata.com/raft/" target="_blank" rel="noopener">The Secret Lives of Data</a> animates election + replication step by step.` },
          ],
          model: `A single elected <b>leader</b> forces all entries to flow leader→followers, so there are never conflicting logs to reconcile. Raft tolerates <b>crash</b> (fail-stop) faults only and needs <b>2f+1</b> nodes to survive f failures.`,
          cards: [
            { q: `Why is Raft easier to reason about than Paxos?`, a: `One strong <b>leader</b> forces all log entries to flow leader→followers — there are never conflicting flows to reconcile.` },
            { q: `How many nodes to tolerate f failures, and which fault type?`, a: `<b>2f+1</b>, and only <b>crash</b> (fail-stop) faults — nodes stop, they never lie.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 New thread: <b>Distributed systems</b> — the theory (consensus, clocks, CAP, transactions) beneath every database, queue and chain you studied. It starts here and advances in order.` },
        { id: "s2", type: "hint", label: `💡 etcd (hence Kubernetes), Consul and CockroachDB run Raft. The k8s "single source of truth" from d08 is a Raft log under the hood.` },
      ],
      note: "Extension begins — the same 2–3 days/week rhythm, now going under the hood. Threads resume where the core left them.",
    },
    {
      id: "d40", date: "2026-10-16", week: "w13", title: "VACUUM, autovacuum & the xmin horizon",
      theme: "Databases · part 6 — why one idle transaction can bloat the whole cluster.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ⑥</b> — the machinery that cleans up MVCC's dead tuples (callback to d15).`,
          sub: [
            { id: "s1", est: 28, label: `Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/routine-vacuuming.html" target="_blank" rel="noopener">"Routine Vacuuming"</a> (dead tuples, the autovacuum daemon, transaction-ID wraparound).` },
            { id: "s2", est: 22, label: `Deeper: Egor Rogov, <a href="https://postgrespro.com/blog/pgsql/5967918" target="_blank" rel="noopener">"MVCC in PostgreSQL — 6. Vacuum"</a>.` },
          ],
          model: `A dead tuple is removable only once it's older than the <b>xmin horizon</b> — the oldest xmin any live snapshot could still see. One long-running/idle-in-transaction txn, an abandoned replication slot, or an orphaned prepared txn pins that horizon back and blocks VACUUM from cleaning <i>any</i> newer dead tuples.`,
          cards: [
            { q: `What blocks VACUUM from reclaiming dead tuples cluster-wide?`, a: `Anything pinning the <b>xmin horizon</b> back: a long-running/idle-in-transaction txn, an abandoned replication slot, or an orphaned prepared transaction.` },
            { q: `Besides space, what disaster does autovacuum prevent?`, a: `<b>Transaction-ID wraparound</b> — it freezes old tuples before the 32-bit XID counter wraps.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d15: <code>UPDATE</code> = new version + dead old one. VACUUM is the janitor; the xmin horizon is why "just one idle txn" bloats everything.` },
        { id: "s2", type: "callout", label: `⚠️ <b>Idle in transaction</b> is the silent killer — a connection that <code>BEGIN</code>s and forgets to commit holds the horizon. Set <code>idle_in_transaction_session_timeout</code>.` },
      ],
    },
    {
      id: "d41", date: "2026-10-18", week: "w13", title: "Virtual memory: page tables & the TLB",
      theme: "Systems · part 4 — every memory access is secretly two accesses.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 55,
          lead: `<b>Systems ④</b> — how each process gets its own private address space, and why it's fast.`,
          sub: [
            { id: "s1", est: 33, label: `Read OSTEP (free) <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf" target="_blank" rel="noopener">Ch 18 "Paging: Introduction"</a> then <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf" target="_blank" rel="noopener">Ch 19 "Paging: Faster Translations (TLBs)"</a>.` },
            { id: "s2", est: 22, label: `The abstraction: <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf" target="_blank" rel="noopener">Ch 13 "The Abstraction: Address Spaces"</a>.` },
          ],
          model: `Paging turns every virtual reference into an extra memory lookup — the <b>page-table walk</b>. The <b>TLB</b> is a small MMU cache of recent virtual-page→physical-frame translations, so a hit makes translation nearly free and only a miss pays the walk. TLB hit rate, not the table shape, governs paging performance.`,
          cards: [
            { q: `What does the page-table walk cost, and what hides it?`, a: `Every virtual access needs a translation (an extra memory lookup); the <b>TLB</b> caches recent translations so a hit makes it nearly free.` },
            { q: `After a context switch, why can memory feel slow?`, a: `The TLB (and caches) are cold/flushed — the indirect cost of a switch, met back at d09.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Huge pages (2 MB/1 GB) exist to cut TLB misses — fewer, larger entries cover more memory. Databases and JVMs enable them for exactly this.` },
        { id: "s2", type: "callout", label: `🔬 This is the "virtual memory" you skimmed at d09 — now the internals. Next Systems day: the page cache, where files live in that memory.` },
      ],
    },

    /* ==================== WEEK 14 ==================== */
    {
      id: "d42", date: "2026-10-22", week: "w14", title: "Rollups: optimistic vs ZK — when do you pay for trust?",
      theme: "Blockchain · part 7 — both post to L1; they differ in how they prove correctness.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ⑦</b> — how L2s inherit L1 security, and the core trade-off.`,
          sub: [
            { id: "s1", est: 30, label: `Read ethereum.org <a href="https://ethereum.org/en/developers/docs/scaling/" target="_blank" rel="noopener">Scaling</a> (rollups) — optimistic (fraud proofs) vs ZK (validity proofs).` },
            { id: "s2", est: 25, label: `Check real maturity on <a href="https://l2beat.com/scaling/summary" target="_blank" rel="noopener">L2BEAT</a> (Stage 0–2) — many "optimistic" rollups still run permissioned fraud proofs / council overrides.` },
          ],
          model: `The trade is <i>when</i> you pay for trust. <b>Optimistic</b> assumes validity, allows a <b>fraud proof</b> in a challenge window (~7-day withdrawals, needs one honest watcher). <b>ZK</b> submits a <b>validity proof</b> every batch — finality in minutes, no honest-watcher assumption, heavier proving.`,
          cards: [
            { q: `Optimistic vs ZK rollup — the core difference?`, a: `Optimistic <i>assumes</i> validity + a fraud-proof challenge window (~7 days); ZK <i>proves</i> validity every batch (fast finality, no honest-watcher assumption).` },
            { q: `Is "optimistic" enough to call a rollup trustless?`, a: `No — check L2BEAT: many still run permissioned fraud proofs or council overrides (not yet Stage 2).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d30: rollups post compressed data to L1 — exactly what the next day (blobs / EIP-4844) made cheap.` },
        { id: "s2", type: "hint", label: `💡 "Validity" (proven up front) vs "fraud" (disproven later) proofs — that one word is the whole distinction interviewers probe.` },
      ],
    },
    {
      id: "d43", date: "2026-10-24", week: "w14", title: "BGP & Anycast: how the internet actually routes",
      theme: "Networking · part 8 — routing is policy and assertion, not shortest path.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          lead: `<b>Networking ⑧</b> — how ~100k networks find each other, and how one IP lives in many places.`,
          sub: [
            { id: "s1", est: 27, label: `Read Cloudflare <a href="https://www.cloudflare.com/learning/security/glossary/what-is-bgp/" target="_blank" rel="noopener">"What is BGP?"</a> (normative source: <a href="https://www.rfc-editor.org/info/rfc4271" target="_blank" rel="noopener">RFC 4271</a>).` },
            { id: "s2", est: 23, label: `Then <a href="https://www.cloudflare.com/learning/cdn/glossary/anycast-network/" target="_blank" rel="noopener">"What is Anycast?"</a> — anycast is just BGP announcing one prefix from many sites.` },
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
      id: "d44", date: "2026-10-26", week: "w14", title: "Kafka exactly-once: idempotent producer + transactions",
      theme: "Messaging · part 3 — 'exactly-once' is at-least-once + dedupe, done right.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 55,
          lead: `<b>Messaging ③</b> — what actually makes Kafka exactly-once, and its limits.`,
          sub: [
            { id: "s1", est: 30, label: `Read Confluent <a href="https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/" target="_blank" rel="noopener">"Exactly-Once Semantics… Here's How Kafka Does It"</a> (spec: <a href="https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging" target="_blank" rel="noopener">KIP-98</a>).` },
            { id: "s2", est: 25, label: `Note the scope: idempotence dedupes <i>within one partition + producer session</i>; cross-partition atomicity needs the transactions API + consumers at <code>isolation.level=read_committed</code>.` },
          ],
          model: `The <b>idempotent producer</b> stamps each batch with a producer ID + monotonic per-partition sequence; the broker rejects a batch whose sequence isn't exactly +1 — killing retry duplicates. <b>Transactions</b> (<code>transactional.id</code>) add multi-partition atomic read-process-write.`,
          cards: [
            { q: `What does Kafka's idempotent producer guarantee?`, a: `No duplicates from retries — but only <i>within one partition and one producer session</i> (PID + monotonic sequence; broker rejects non-+1).` },
            { q: `How do you get exactly-once across partitions?`, a: `The transactions API (<code>transactional.id</code>) + consumers at <code>isolation.level=read_committed</code>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 Idempotence is <b>on by default</b> since Kafka 3.0. In Kafka Streams use <code>processing.guarantee=exactly_once_v2</code> — the old <code>exactly_once</code> was removed.` },
        { id: "s2", type: "hint", label: `💡 Callback to d23: "exactly-once" delivery over a network is impossible; what you get is at-least-once + idempotent dedupe. Same lesson, protocol-enforced.` },
      ],
    },

    /* ==================== WEEK 15 ==================== */
    {
      id: "d45", date: "2026-10-28", week: "w15", title: "Consensus II: Paxos vs Raft, and Byzantine faults (PBFT)",
      theme: "Distributed systems · part 2 — from 'nodes crash' to 'nodes lie'.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 55,
          lead: `<b>Distributed systems ②</b> — the classic Paxos, and what changes when nodes are malicious.`,
          sub: [
            { id: "s1", est: 30, label: `Skim Lamport, <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf" target="_blank" rel="noopener">"Paxos Made Simple"</a> (prepare/promise → accept, majority quorums), then the Raft paper's "What's wrong with Paxos?".` },
            { id: "s2", est: 25, label: `For Byzantine faults: Castro & Liskov, <a href="http://pmg.csail.mit.edu/papers/osdi99.pdf" target="_blank" rel="noopener">"Practical Byzantine Fault Tolerance"</a> (OSDI '99).` },
          ],
          model: `Paxos decides <i>what</i> is safe but gives no operational leader/log — the gap Raft fills. <b>PBFT</b> tolerates <b>Byzantine</b> (lying) faults with <b>3f+1</b> replicas and a 3-phase exchange (pre-prepare → prepare → commit) — the ancestor of blockchain BFT.`,
          cards: [
            { q: `Crash-fault vs Byzantine-fault: node counts?`, a: `Crash (Raft/Paxos): <b>2f+1</b>. Byzantine/lying (PBFT): <b>3f+1</b> + a 3-phase exchange.` },
            { q: `What does Paxos leave unspecified that Raft nails down?`, a: `An operational <b>leader + log structure</b> — Paxos says what's safe to decide, not how to run it.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Callback to d36: a blockchain is BFT consensus among untrusting parties — PBFT is where that lineage starts (Tendermint, HotStuff descend from it).` },
        { id: "s2", type: "hint", label: `💡 "Understandable" is a design goal, not fluff — Raft was literally user-tested against Paxos. Simplicity that ships correct systems is a feature.` },
      ],
    },
    {
      id: "d46", date: "2026-10-31", week: "w15", title: "TOAST & HOT updates: storage internals that bite",
      theme: "Databases · part 7 — 8 KB pages, big values, and cheap updates.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ⑦</b> — where oversized values go, and how to keep updates cheap.`,
          sub: [
            { id: "s1", est: 27, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/storage-toast.html" target="_blank" rel="noopener">"TOAST"</a> and <a href="https://www.postgresql.org/docs/current/storage-hot.html" target="_blank" rel="noopener">"Heap-Only Tuples (HOT)"</a>.` },
            { id: "s2", est: 23, label: `Companion: Egor Rogov, <a href="https://postgrespro.com/blog/pgsql/5967910" target="_blank" rel="noopener">"MVCC — 5. In-page vacuum and HOT updates"</a>.` },
          ],
          model: `Pages are 8 KB and tuples can't span pages, so values over ~2 KB are compressed/stored out-of-line in a <b>TOAST</b> table. A <b>HOT</b> update (no indexed column changed + free space on the same page) skips new index entries — a lower <code>fillfactor</code> reserves that space, avoiding index write-amplification and bloat.`,
          cards: [
            { q: `When does a Postgres UPDATE stay HOT (no index writes)?`, a: `When no indexed column changes <b>and</b> the new tuple fits on the same page — a lower <code>fillfactor</code> reserves that room.` },
            { q: `What is TOAST for?`, a: `Storing column values too big for the 8 KB page — compressed and/or split out-of-line (EXTENDED is the default; LZ4 selectable since PG 14).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Frequent-update table? Lower <code>fillfactor</code> (e.g. 80) so updates stay HOT — a one-line fix for chronic bloat + index churn.` },
        { id: "s2", type: "callout", label: `🔬 BRIN (summarizing) indexes are the exception: an update can be HOT even if it touches a BRIN-indexed column.` },
      ],
    },
    {
      id: "d47", date: "2026-11-02", week: "w15", title: "Service mesh, mTLS & workload identity (SPIFFE)",
      theme: "DevOps · part 9 — who a service IS, proved cryptographically, auto-rotated.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ⑨</b> — how zero-trust replaces shared secrets with attested identities.`,
          sub: [
            { id: "s1", est: 27, label: `Read <a href="https://spiffe.io/docs/latest/spiffe-about/overview/" target="_blank" rel="noopener">SPIFFE overview</a> + <a href="https://spiffe.io/docs/latest/deploying/svids/" target="_blank" rel="noopener">SVIDs</a> — a workload identity (<code>spiffe://…</code>) in a short-lived, auto-rotated cert.` },
            { id: "s2", est: 23, label: `Context: <a href="https://www.redhat.com/en/topics/security/spiffe-and-spire" target="_blank" rel="noopener">SPIFFE/SPIRE intro</a>; a mesh (Istio/Envoy, Cilium) issues these to sidecars for automatic mTLS.` },
          ],
          model: `Zero-trust identity replaces long-lived API keys with <b>short-lived, auto-rotated, attested</b> SVIDs. An X.509-SVID carries the SPIFFE ID in its SAN and plugs straight into <b>mTLS</b>, so service-to-service auth proves <i>what a workload is</i> (verified at runtime), not where it sits.`,
          cards: [
            { q: `What does zero-trust service identity replace, and with what?`, a: `Long-lived shared secrets/API keys → short-lived, auto-rotated, <b>attested</b> cryptographic identities (SVIDs).` },
            { q: `What is mTLS?`, a: `Mutual TLS — <i>both</i> sides present certs, so client and server authenticate each other (not just the server).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ The whole model rests on the <b>attestation policy</b> being strict — weak attestation means any pod can claim any identity.` },
        { id: "s2", type: "hint", label: `💡 Callback to d14/d24: the same TLS/PKI machinery, now pointed <i>inward</i> — every hop authenticated, certs rotated by the platform.` },
      ],
    },

    /* ==================== WEEK 16 ==================== */
    {
      id: "d48", date: "2026-11-05", week: "w16", title: "Data availability & EIP-4844 blobs",
      theme: "Blockchain · part 8 — why L2 fees fell 10–100× in 2024.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 50,
          lead: `<b>Blockchain ⑧</b> — the cheap, temporary data lane that made rollups affordable.`,
          sub: [
            { id: "s1", est: 30, label: `Read <a href="https://eips.ethereum.org/EIPS/eip-4844" target="_blank" rel="noopener">EIP-4844</a> + the explainer <a href="https://www.eip4844.com/" target="_blank" rel="noopener">eip4844.com</a> — blob-carrying txs with a separate blob-gas market.` },
            { id: "s2", est: 20, label: `Concept: ethereum.org <a href="https://ethereum.org/en/developers/docs/data-availability/" target="_blank" rel="noopener">Data availability</a>.` },
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
    {
      id: "d49", date: "2026-11-06", week: "w16", title: "Review: Go's scheduler (G-M-P) & async preemption",
      theme: "Review · re-derive the runtime under every goroutine you spawn.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          lead: `<b>Review</b> — how Go runs millions of goroutines on a handful of threads.`,
          sub: [
            { id: "s1", est: 25, label: `Re-read the shipped behaviour: <a href="https://go.dev/doc/go1.14" target="_blank" rel="noopener">Go 1.14 release notes</a> (async preemption) + the <a href="https://github.com/golang/proposal/blob/master/design/24543-non-cooperative-preemption.md" target="_blank" rel="noopener">preemption proposal</a> for the why.` },
            { id: "s2", cat: "exercise", est: 20, label: `Without looking, explain aloud: what are G, M and P? What happens to other goroutines when one makes a blocking syscall?` },
          ],
          model: `<b>G</b> = goroutine, <b>M</b> = OS thread, <b>P</b> = logical processor (scheduling context, GOMAXPROCS of them). Since Go 1.14, goroutines are <b>asynchronously preemptible</b> (via SIGURG) — a tight loop with no function calls can still be preempted, so it no longer stalls the scheduler or GC.`,
          cards: [
            { q: `What are G, M and P in Go's scheduler?`, a: `G = goroutine, M = OS thread, P = logical processor / scheduling context (GOMAXPROCS of them). A G needs an M+P to run.` },
            { q: `What did async preemption (Go 1.14) fix?`, a: `A tight loop with no function calls could hog a thread forever; now the runtime signals (SIGURG) and preempts it, unblocking the scheduler and GC.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Review tasks re-derive hard models you already use (Rust at d32; Python's GIL, C++ memory, Rust async ahead).` },
        { id: "s2", type: "hint", label: `💡 Callback to d03/d29: the P is why "blocking" goroutines don't block the program — the netpoller parks the G and frees the M.` },
      ],
    },
    {
      id: "d50", date: "2026-11-08", week: "w16", title: "Redis Cluster & consistent hashing",
      theme: "Caching · part 3 — 16384 slots, and moving keys without moving all of them.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 50,
          lead: `<b>Caching ③</b> — how Redis shards keys, and the general technique behind it.`,
          sub: [
            { id: "s1", est: 27, label: `Read the Redis <a href="https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/" target="_blank" rel="noopener">Cluster spec</a> — hash slots, gossip, MOVED vs ASK.` },
            { id: "s2", est: 23, label: `The underlying idea: <a href="https://en.wikipedia.org/wiki/Consistent_hashing" target="_blank" rel="noopener">consistent hashing</a> (Karger et al., 1997) — resizing remaps only ~1/N of keys, not all of them.` },
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

    /* ==================== WEEK 17 ==================== */
    {
      id: "d51", date: "2026-11-11", week: "w17", title: "CAP done right — and PACELC",
      theme: "Distributed systems · part 3 — you don't 'choose' partition tolerance.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 50,
          lead: `<b>Distributed systems ③</b> — the theorem, minus the 'pick 2 of 3' myth.`,
          sub: [
            { id: "s1", est: 27, label: `Read Gilbert & Lynch, <a href="https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf" target="_blank" rel="noopener">"Perspectives on the CAP Theorem"</a> (2012) — CAP as a safety-vs-liveness trade, with the proof sketch.` },
            { id: "s2", est: 23, label: `Then Abadi, <a href="http://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf" target="_blank" rel="noopener">"Consistency Tradeoffs… (PACELC)"</a> — the everyday latency dimension CAP omits.` },
          ],
          model: `CAP constrains behaviour <i>only during a partition</i>, and partition tolerance isn't optional on a real network — so the honest statement is C-vs-A <b>when partitioned</b>. <b>PACELC</b>: if <b>P</b>artition → <b>A</b> or <b>C</b>; <b>E</b>lse (normal ops) → <b>L</b>atency or <b>C</b>onsistency.`,
          cards: [
            { q: `Why is "pick 2 of 3" the wrong way to read CAP?`, a: `Partition tolerance isn't a choice on a real network — CAP is really C-vs-A <i>during a partition</i>. The rest of the time it's silent.` },
            { q: `What does PACELC add to CAP?`, a: `The normal-operation trade CAP ignores: <b>E</b>lse (no partition) you still choose <b>L</b>atency vs <b>C</b>onsistency.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Reframe: CAP is one case of the general <b>safety vs liveness</b> impossibility under unreliable networks — the rigorous reading.` },
        { id: "s2", type: "callout", label: `🔬 Postgres sync replication picks C over L (slower commits); Dynamo-style stores pick L/A (stale reads). PACELC names the dial you meet at d64/d69.` },
      ],
    },
    {
      id: "d52", date: "2026-11-13", week: "w17", title: "Join algorithms & how the planner picks",
      theme: "Databases · part 8 — nested loop, hash, merge — and why it chose that.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ⑧</b> — the three physical joins, and the cost model behind EXPLAIN (callback d10).`,
          sub: [
            { id: "s1", est: 27, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/planner-optimizer.html" target="_blank" rel="noopener">"Planner/Optimizer"</a> — the three joins and cost-based join-order search.` },
            { id: "s2", cat: "lab", est: 23, label: `Re-run <code>EXPLAIN (ANALYZE, BUFFERS)</code> on a 2–3 table join and name the join node it chose.` },
          ],
          model: `<b>Nested loop</b>: scan the right side once per left row (great with an index on the right, tiny left). <b>Hash join</b>: build a hash table on one side, probe with the other (big unsorted equijoins). <b>Merge join</b>: sort both on the key, scan in lockstep (or reuse an ordered index). The cost-based planner prices every pair and picks the cheapest.`,
          cards: [
            { q: `When does the planner pick a hash join vs a nested loop?`, a: `Hash join for big unsorted equijoins (build + probe); nested loop when one side is tiny or the right side has a usable index.` },
            { q: `What makes a merge join cheap?`, a: `Both inputs already sorted on the join key (e.g. via an ordered index) — then it's a single lockstep scan of each.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ A nested loop over a large right table with no index is the classic "why is my join O(n·m)?" — avoided only if the planner's row estimates are good (stats!).` },
        { id: "s2", type: "hint", label: `💡 Callback to d10: a plan flipping to a bad join under load is usually stale statistics or a row-estimate blow-up, not a "wrong" planner.` },
      ],
    },
    {
      id: "d53", date: "2026-11-15", week: "w17", title: "The page cache & why fsync is the durability line",
      theme: "Systems · part 5 — 'write() returned' is not 'on disk'.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ⑤</b> — where files live in RAM, and the fsync trap that ate data (callback d09/d26).`,
          sub: [
            { id: "s1", est: 30, label: `Read LWN, <a href="https://lwn.net/Articles/752063/" target="_blank" rel="noopener">"PostgreSQL's fsync() surprise"</a> — dirty pages, writeback, and how an fsync error can be reported once and lost.` },
            { id: "s2", est: 20, label: `Reference: <a href="https://man7.org/linux/man-pages/man2/fsync.2.html" target="_blank" rel="noopener">fsync(2)</a> (and <code>fdatasync</code>, which skips non-essential metadata).` },
          ],
          model: `<code>write()</code> and <code>mmap</code> stores mark page-cache pages <b>dirty</b> and return; data is durable only after <code>fsync</code>/<code>fdatasync</code> flushes dirty pages <i>and</i> the disk's write cache. The "fsyncgate" twist: on async writeback failure the kernel may drop the pages and report <code>EIO</code> to <i>whoever fsyncs next</i>, once — so a program that missed it thinks data is safe.`,
          cards: [
            { q: `Does a returning <code>write()</code> mean durable?`, a: `No — it only dirties page-cache pages. Durability needs <code>fsync</code>/<code>fdatasync</code> (flush dirty pages + the drive's write cache).` },
            { q: `What was the "fsyncgate" surprise?`, a: `On writeback failure the kernel could drop the pages and report the error only <i>once</i>, to the next fsyncer — so a naive app believed data was safe. Postgres 12+ now PANICs on fsync failure.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 This is the OS half of d26's WAL: the DB fsyncs the log before the page precisely because "write returned" ≠ durable. Same tension, one layer down.` },
        { id: "s2", type: "hint", label: `💡 Error-reporting behaviour is kernel-version-dependent (pre-4.13 could lose it entirely). "Durable" is a property you must fsync for, per open fd.` },
      ],
    },

    /* ==================== WEEK 18 ==================== */
    {
      id: "d54", date: "2026-11-19", week: "w18", title: "MEV & Proposer-Builder Separation",
      theme: "Blockchain · part 9 — who orders your transaction, and what they extract.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ⑨</b> — the hidden auction beneath every block.`,
          sub: [
            { id: "s1", est: 35, label: `Read ethereum.org <a href="https://ethereum.org/en/developers/docs/mev/" target="_blank" rel="noopener">MEV</a> + Flashbots <a href="https://docs.flashbots.net/flashbots-mev-boost/introduction" target="_blank" rel="noopener">MEV-Boost</a> (builders bid, proposers sign the best, a relay mediates).` },
            { id: "s2", est: 20, label: `The protocol direction: enshrined PBS (ePBS, EIP-7732).` },
          ],
          model: `Block production splits into a <b>builder</b> (orders txs, extracts MEV, bids) and a <b>proposer</b> (validator, signs the highest bid), with a trusted <b>relay</b> between them today. MEV = value from ordering/including/excluding txs (arbitrage, liquidations, sandwiches).`,
          cards: [
            { q: `What is MEV?`, a: `Maximal Extractable Value — profit from <b>ordering</b>, including, or excluding txs in a block (arbitrage, liquidations, sandwich attacks).` },
            { q: `What does Proposer-Builder Separation split?`, a: `The <b>builder</b> (orders txs + bids) from the <b>proposer</b> (validator who just signs the top bid) — via a trusted relay today.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 MEV-Boost is LIVE (out-of-protocol, relay-based). <b>Enshrined PBS</b> (EIP-7732) is PROPOSED — a headliner for the Glamsterdam upgrade, targeted ~H2 2026, not on mainnet as of 2026.` },
        { id: "s2", type: "hint", label: `💡 Callback to d38: a sandwich attack is on-chain front/back-running — the same "spot price is manipulable within a tx" you hardened against with TWAPs.` },
      ],
    },
    {
      id: "d55", date: "2026-11-21", week: "w18", title: "Kafka consumer rebalances & log compaction",
      theme: "Messaging · part 4 — don't stop the world to add one consumer.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 50,
          lead: `<b>Messaging ④</b> — how partitions get reassigned, and per-key retention.`,
          sub: [
            { id: "s1", est: 27, label: `Read Confluent <a href="https://www.confluent.io/blog/cooperative-rebalancing-in-kafka-streams-consumer-ksqldb/" target="_blank" rel="noopener">"From Eager to Smarter… Rebalances"</a> (eager vs cooperative; <a href="https://cwiki.apache.org/confluence/display/KAFKA/KIP-429:+Kafka+Consumer+Incremental+Rebalance+Protocol" target="_blank" rel="noopener">KIP-429</a>).` },
            { id: "s2", est: 23, label: `Then <a href="https://kafka.apache.org/43/design/design/#log-compaction" target="_blank" rel="noopener">Log Compaction</a> — keep the latest value per key forever; a null value is a tombstone.` },
          ],
          model: `<b>Eager</b> rebalancing makes every consumer surrender <i>all</i> partitions on any group change (whole group stops). <b>Cooperative</b> revokes only the partitions actually moving, so others keep processing. <b>Log compaction</b> gives per-key retention — a replayable changelog; a null-value record is a <b>tombstone</b> that deletes the key.`,
          cards: [
            { q: `Eager vs cooperative rebalancing?`, a: `Eager: everyone drops all partitions on any change (group stops). Cooperative: only the moving partitions are revoked, others keep consuming.` },
            { q: `What does Kafka log compaction guarantee?`, a: `It retains at least the <b>latest value per key</b> forever (a replayable changelog); a null value is a <b>tombstone</b> that deletes the key.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 Kafka 4.x makes the broker-side next-gen rebalance protocol (KIP-848) the default — it largely supersedes the client-side eager/cooperative split. Know the concepts, check your version.` },
        { id: "s2", type: "hint", label: `💡 Compacted topics power CDC and stateful stream apps — the "table" view of a "stream" (callback to d23's log).` },
      ],
    },
    {
      id: "d56", date: "2026-11-23", week: "w18", title: "Upgradeable contracts: proxies & delegatecall collisions",
      theme: "Security · part 5 — storage is addressed by slot, not by name.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 55,
          lead: `<b>Security ⑤</b> — how upgradeable contracts work, and how they silently corrupt state.`,
          sub: [
            { id: "s1", est: 32, label: `Read OpenZeppelin <a href="https://docs.openzeppelin.com/upgrades-plugins/proxies" target="_blank" rel="noopener">"Proxy Upgrade Pattern"</a> + <a href="https://eips.ethereum.org/EIPS/eip-1967" target="_blank" rel="noopener">ERC-1967</a> (standard storage slots).` },
            { id: "s2", est: 23, label: `Note the two live patterns: <b>Transparent</b> (upgrade logic in the proxy) vs <b>UUPS</b> (upgrade logic in the implementation).` },
          ],
          model: `A proxy <code>delegatecall</code>s into an implementation, so logic runs against the <b>proxy's</b> storage. Under delegatecall, storage is keyed by <b>slot number, not variable name</b> — so proxy and logic must agree on layout (or use ERC-1967's keccak-derived slots), and reordering/inserting variables across upgrades is a classic footgun.`,
          cards: [
            { q: `Under <code>delegatecall</code>, how is storage addressed?`, a: `By <b>slot number, not variable name</b> — so proxy and implementation must share a layout, or state silently corrupts (ERC-1967 uses pseudo-random slots to avoid it).` },
            { q: `Transparent vs UUPS proxy — where's the upgrade logic?`, a: `Transparent: in the proxy. UUPS: in the implementation — so a UUPS impl left uninitialized or missing <code>upgradeTo</code> can be bricked or hijacked.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Upgrades that <i>insert or reorder</i> state variables shift every later slot — the #1 upgrade bug. Append-only, or use storage gaps.` },
        { id: "s2", type: "hint", label: `💡 Callback to d22: <code>delegatecall</code> runs someone else's code in <i>your</i> storage/context — powerful, and exactly why proxy bugs are so dangerous.` },
      ],
    },

    /* ==================== WEEK 19 ==================== */
    {
      id: "d57", date: "2026-11-25", week: "w19", title: "Logical clocks: Lamport timestamps & vector clocks",
      theme: "Distributed systems · part 4 — ordering events with no shared clock.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 50,
          lead: `<b>Distributed systems ④</b> — causality without synchronized time.`,
          sub: [
            { id: "s1", est: 27, label: `Read Lamport, <a href="https://lamport.azurewebsites.net/pubs/time-clocks.pdf" target="_blank" rel="noopener">"Time, Clocks, and the Ordering of Events"</a> (1978) — happened-before + the clock rule.` },
            { id: "s2", est: 23, label: `Then vector clocks (Fidge/Mattern) via <a href="https://crdt.tech/" target="_blank" rel="noopener">crdt.tech</a>'s references — they detect concurrency, which Lamport clocks can't.` },
          ],
          model: `Lamport's rule (increment per event; on receive set <code>max(local, sender)+1</code>) gives a total order consistent with causality — but only one way: a→b ⇒ C(a)&lt;C(b), <b>not</b> the converse. <b>Vector clocks</b> close that gap: they detect whether two events are causally ordered or <b>concurrent</b>.`,
          cards: [
            { q: `What can a Lamport timestamp NOT tell you?`, a: `Whether two events are concurrent — a→b ⇒ C(a)&lt;C(b), but C(a)&lt;C(b) does <i>not</i> imply a→b. Vector clocks detect concurrency.` },
            { q: `The Lamport clock update rule on receiving a message?`, a: `Set the local clock to <code>max(local, sender)+1</code> (and increment on every local event).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d31/d20: "happened-before" is the same causality Kafka partitions and MVCC snapshots impose locally — here it's made explicit across machines.` },
        { id: "s2", type: "callout", label: `🔬 Vector clocks are how Dynamo (d69) detects conflicting concurrent writes for the client to reconcile.` },
      ],
    },
    {
      id: "d58", date: "2026-11-28", week: "w19", title: "Partitioning & sharding",
      theme: "Databases · part 9 — the win is pruning, and it needs the partition key.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ⑨</b> — splitting one big table, in-DB and across machines.`,
          sub: [
            { id: "s1", est: 27, label: `Read PG docs <a href="https://www.postgresql.org/docs/current/ddl-partitioning.html" target="_blank" rel="noopener">"Table Partitioning"</a> (declarative range/list/hash; partition pruning).` },
            { id: "s2", est: 23, label: `Scale-out trade-offs: DDIA Ch 6 "Partitioning" (routing, rebalancing, hot shards).` },
          ],
          model: `The real win is <b>partition pruning</b> — the planner skips partitions that can't match, but <i>only</i> when the query filters on the partition key. Partition on a rarely-filtered column and you get the maintenance cost with none of the benefit. Sharding is the same idea across machines, adding routing + rebalancing.`,
          cards: [
            { q: `What's the payoff of partitioning, and its precondition?`, a: `<b>Partition pruning</b> — skipping irrelevant partitions — but only when the query filters on the <b>partition key</b>.` },
            { q: `Partitioning vs sharding?`, a: `Same split; partitioning is within one DB (planner prunes), sharding spreads across machines and adds routing + rebalancing (and hot-shard risk).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Choose the partition key by how you <i>query</i>, not how data arrives — sharded by the wrong key means every query hits every shard.` },
        { id: "s2", type: "hint", label: `💡 Callback to d31: Kafka partitions and DB shards share the lesson — pick the key so related rows/events co-locate, and ordering/pruning follows.` },
      ],
    },
    {
      id: "d59", date: "2026-11-30", week: "w19", title: "QUIC internals beyond HTTP/3",
      theme: "Networking · part 9 — connection IDs, streams, per-space loss recovery.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          lead: `<b>Networking ⑨</b> — the transport under HTTP/3, in its own right (callback d18).`,
          sub: [
            { id: "s1", est: 32, label: `Read <a href="https://www.rfc-editor.org/info/rfc9000" target="_blank" rel="noopener">RFC 9000</a> (QUIC transport: connection IDs, streams, migration) and skim <a href="https://www.rfc-editor.org/info/rfc9002" target="_blank" rel="noopener">RFC 9002</a> (loss detection & congestion control).` },
            { id: "s2", est: 18, label: `Keep the layer split straight: 9000 transport, 9001 TLS, 9002 loss/CC, <b>HTTP/3 = RFC 9114</b>.` },
          ],
          model: `Three pillars: (1) <b>connection IDs</b> identify a connection <i>inside</i> packets — so a Wi-Fi→cellular IP change survives without re-handshaking (migration). (2) independent <b>streams</b> — a lost packet stalls only its stream, not all (TCP's flaw). (3) <b>per-packet-number-space</b> loss recovery — monotonic, never-reused packet numbers remove TCP's retransmission ambiguity.`,
          cards: [
            { q: `How does a QUIC connection survive a network change?`, a: `<b>Connection IDs</b> live inside packets, not in the 4-tuple — so the connection continues without a new handshake (migration).` },
            { q: `Why don't QUIC packet numbers reuse like TCP's?`, a: `They're monotonic and per-number-space (Initial/Handshake/App), removing TCP's retransmission ambiguity.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Don't conflate QUIC (transport) with HTTP/3 (one app mapping, RFC 9114). QUIC can carry other protocols too.` },
        { id: "s2", type: "callout", label: `🔬 Callback to d18: H2's HOL blocking was at TCP; QUIC's independent streams are the fix, at the transport layer.` },
      ],
    },

    /* ==================== WEEK 20 ==================== */
    {
      id: "d60", date: "2026-12-03", week: "w20", title: "Account abstraction: EIP-4337 & EIP-7702",
      theme: "Blockchain · part 10 — smart-account superpowers, two ways.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ⑩</b> — batching, gas sponsorship and session keys for wallets.`,
          sub: [
            { id: "s1", est: 38, label: `Read <a href="https://eips.ethereum.org/EIPS/eip-4337" target="_blank" rel="noopener">ERC-4337</a> (UserOperations, bundlers, EntryPoint, paymasters) and <a href="https://eips.ethereum.org/EIPS/eip-7702" target="_blank" rel="noopener">EIP-7702</a> (an EOA delegates to contract code).` },
            { id: "s2", est: 17, label: `Docs: <a href="https://docs.erc4337.io/" target="_blank" rel="noopener">erc4337.io</a>.` },
          ],
          model: `<b>4337</b> delivers AA <i>without</i> protocol changes: an alt-mempool of <code>UserOperation</code>s, off-chain <b>bundlers</b>, a singleton <b>EntryPoint</b>, optional <b>paymasters</b> (gas sponsorship). <b>7702</b> is a protocol-level tx type letting an existing EOA temporarily run contract code — keeping its address while gaining batching/sponsorship/session keys.`,
          cards: [
            { q: `EIP-4337 vs EIP-7702 in one line?`, a: `4337 = smart-contract wallets simulated <i>above</i> the protocol (bundlers + EntryPoint); 7702 = give an ordinary <b>EOA</b> smart-account powers <i>in</i>-protocol (delegate to code).` },
            { q: `What is a paymaster (4337)?`, a: `A contract that sponsors gas — letting users transact without holding ETH (or pay gas in an ERC-20).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 EIP-7702 is <b>live</b> — shipped in the Pectra upgrade (mainnet 7 May 2025); ERC-4337 EntryPoint is live (pin a version, e.g. v0.7/0.8, when it matters).` },
        { id: "s2", type: "callout", label: `⚠️ 7702 introduces a new drainer vector: "sign to upgrade your wallet" delegation prompts are high-risk (an EOA can delegate to arbitrary code). Callback to d38's "verify, then act".` },
      ],
    },
    {
      id: "d61", date: "2026-12-04", week: "w20", title: "Review: the Python GIL & free-threading (3.14)",
      theme: "Review · what the lock protects, and the no-GIL build that's now supported.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          lead: `<b>Review</b> — why CPython threads don't parallelize CPU work — and how that's changing.`,
          sub: [
            { id: "s1", est: 25, label: `Read the official <a href="https://docs.python.org/3/howto/free-threading-python.html" target="_blank" rel="noopener">Python free-threading howto</a> + <a href="https://peps.python.org/pep-0779/" target="_blank" rel="noopener">PEP 779</a>.` },
            { id: "s2", cat: "exercise", est: 20, label: `Without looking, explain: why do CPU-bound Python threads not speed up, but I/O-bound ones do?` },
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
    {
      id: "d62", date: "2026-12-06", week: "w20", title: "Supply-chain security: Sigstore, SLSA & SBOM",
      theme: "DevOps · part 10 — prove what's in the artifact and how it was built.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ⑩</b> — the OWASP #3 (supply-chain) defenses, concretely.`,
          sub: [
            { id: "s1", est: 33, label: `Read <a href="https://slsa.dev/spec/" target="_blank" rel="noopener">SLSA</a> (build/source provenance levels) + <a href="https://docs.sigstore.dev/about/overview/" target="_blank" rel="noopener">Sigstore</a> (keyless signing: Cosign + Fulcio + Rekor).` },
            { id: "s2", est: 17, label: `SBOM formats: <a href="https://cyclonedx.org/" target="_blank" rel="noopener">CycloneDX</a> / <a href="https://spdx.dev/" target="_blank" rel="noopener">SPDX</a>.` },
          ],
          model: `They compose: an <b>SBOM</b> says <i>what's in</i> an artifact, <b>SLSA provenance</b> attests <i>how it was built</i> (and at what level), and <b>Sigstore/Cosign</b> signs those attestations — verified by <i>identity</i> (Fulcio's short-lived OIDC certs + Rekor transparency log), not long-lived keys.`,
          cards: [
            { q: `SBOM vs SLSA vs Sigstore — how do they fit?`, a: `SBOM = <i>what's in</i> it; SLSA provenance = <i>how it was built</i>; Sigstore/Cosign = cryptographically <b>signs</b> those, verified by identity not keys.` },
            { q: `What makes Sigstore "keyless"?`, a: `Fulcio issues short-lived certs bound to an OIDC identity and Rekor logs the signature — verify by identity + transparency log, no long-lived private key.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 SLSA is at <b>v1.2</b> with two tracks — a <b>Build</b> track (L0–3) and a newer <b>Source</b> track (L1–4). Don't cite "SLSA 1.0 / one 4-level ladder" — say the track + level (e.g. "Build L3").` },
        { id: "s2", type: "hint", label: `💡 Callback to d13: "Software Supply-Chain Failures" is high on OWASP 2025 — these three are the concrete answer to "how do you trust a dependency?".` },
      ],
    },

    /* ==================== WEEK 21 ==================== */
    {
      id: "d63", date: "2026-12-09", week: "w21", title: "Distributed transactions: 2PC & the Saga pattern",
      theme: "Distributed systems · part 5 — atomicity across services, and its price.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 50,
          lead: `<b>Distributed systems ⑤</b> — how (and whether) to commit across nodes.`,
          sub: [
            { id: "s1", est: 25, label: `Read the free MIT 6.824 notes on <a href="https://timilearning.com/posts/mit-6.824/lecture-12-distributed-transactions/" target="_blank" rel="noopener">distributed transactions</a> (2PC: PREPARE → vote → COMMIT/ABORT, and blocking).` },
            { id: "s2", est: 25, label: `Then the Saga original: Garcia-Molina & Salem, <a href="http://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf" target="_blank" rel="noopener">"Sagas"</a> (1987), + <a href="https://microservices.io/patterns/data/saga.html" target="_blank" rel="noopener">microservices.io Saga</a>.` },
          ],
          model: `<b>2PC</b> gives atomic commit but is <b>blocking</b> — a prepared participant can't decide alone, so a coordinator crash at the wrong moment holds locks until recovery. <b>Saga</b> splits a long transaction into local steps each with a <b>compensating</b> action — trading ACID isolation for availability ("all committed or all compensated"; intermediate states are visible).`,
          cards: [
            { q: `Why is 2PC called a blocking protocol?`, a: `A participant that voted "prepared" can't unilaterally commit or abort — a coordinator crash leaves it holding locks until recovery.` },
            { q: `What does a Saga trade away, and how does it undo work?`, a: `It gives up atomic isolation (intermediate states are visible) for availability; failures are undone by <b>compensating</b> transactions (which must be idempotent).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Callback to d23/d55: the transactional <b>outbox</b> (next Messaging day) is how a Saga step reliably emits its event — same local txn as the state change.` },
        { id: "s2", type: "hint", label: `💡 Choreography (events) vs orchestration (a coordinator) is the Saga design axis — orchestration is easier to reason about, choreography more decoupled.` },
      ],
    },
    {
      id: "d64", date: "2026-12-11", week: "w21", title: "Replication: physical vs logical, sync vs async",
      theme: "Databases · part 10 — replication lag is your failover data-loss window.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ⑩</b> — how a standby stays current, and what you lose on failover.`,
          refs: [
            `Read PG docs <a href="https://www.postgresql.org/docs/current/high-availability.html" target="_blank" rel="noopener">"High Availability… and Replication"</a> (streaming + synchronous) and <a href="https://www.postgresql.org/docs/current/logical-replication.html" target="_blank" rel="noopener">"Logical Replication"</a>.`,
          ],
          model: `<b>Physical</b> replication ships the WAL byte-for-byte (whole cluster, same version). <b>Logical</b> replicates changes by <b>replication identity</b> (usually PK) — selective, cross-version, upgrade-friendly. With <b>async</b> commit, a commit is acked before the standby has it, so <b>replication lag = the failover data-loss window</b>; <b>synchronous</b> closes it at the cost of commit latency (PACELC's C-over-L).`,
          cards: [
            { q: `Physical vs logical replication?`, a: `Physical = byte-for-byte WAL (whole cluster, same version); logical = changes by replication identity/PK (selective, cross-version, upgrade-friendly).` },
            { q: `What is async replication lag, operationally?`, a: `The <b>failover data-loss window</b> — commits acked but not yet on the standby. Synchronous replication removes it, at commit-latency cost.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d26/d51: it's the WAL again — the same log that gives crash recovery streams to replicas. Sync-vs-async is PACELC's L-vs-C made concrete.` },
        { id: "s2", type: "hint", label: `💡 A read replica gives read scaling but <i>stale</i> reads under lag — "read-your-writes" needs routing the just-written user to the primary.` },
      ],
    },
    {
      id: "d65", date: "2026-12-13", week: "w21", title: "CDC & the transactional outbox",
      theme: "Messaging · part 5 — kill the dual-write with one local transaction.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 50,
          lead: `<b>Messaging ⑤</b> — reliably publish an event AND update your DB, atomically.`,
          refs: [
            `Read Debezium, <a href="https://debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/" target="_blank" rel="noopener">"Reliable Microservices Data Exchange With the Outbox Pattern"</a> (+ the <a href="https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html" target="_blank" rel="noopener">Outbox Event Router</a> SMT).`,
          ],
          model: `The <b>dual-write problem</b>: writing to the DB and to Kafka separately can partially fail. Fix: write the business change <i>and</i> an event row into an <b>outbox</b> table in the <b>same local ACID transaction</b>; <b>CDC</b> (Debezium tailing the WAL) captures the outbox insert and forwards it to Kafka. The row is just a vehicle — capture is from the log, so it can be deleted immediately.`,
          cards: [
            { q: `What is the dual-write problem, and the outbox fix?`, a: `Writing DB + Kafka separately can half-fail. Fix: write the change + an <b>outbox</b> row in one local txn; <b>CDC</b> streams the outbox from the WAL to Kafka.` },
            { q: `Why is CDC reliable where an app-level publish isn't?`, a: `It reads the DB's own <b>transaction log</b> — so it only ever emits committed changes, even if the app crashed right after commit.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 This is d63's Saga step made durable, and d23/d26's "log" reused: the WAL is the source of truth, Kafka a projection of it.` },
        { id: "s2", type: "hint", label: `💡 Debezium tails Postgres logical replication — which is why you enabled <code>wal_level=logical</code> (callback d64).` },
      ],
    },

    /* ==================== WEEK 22 ==================== */
    {
      id: "d66", date: "2026-12-17", week: "w22", title: "ZK proofs: SNARKs vs STARKs (intuition)",
      theme: "Blockchain · part 11 — prove you ran the computation, reveal nothing.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ⑪</b> — the cryptography under ZK-rollups, at the intuition level.`,
          sub: [
            { id: "s1", est: 32, label: `Read Vitalik, <a href="https://vitalik.eth.limo/general/2017/02/01/zk_snarks.html" target="_blank" rel="noopener">"zk-SNARKs: Under the Hood"</a> for the pipeline (computation → circuit → QAP → pairing check).` },
            { id: "s2", est: 23, label: `Compare families: <a href="https://www.cyfrin.io/blog/a-full-comparison-what-are-zk-snarks-and-zk-starks" target="_blank" rel="noopener">SNARKs vs STARKs</a>.` },
          ],
          model: `<b>SNARKs</b>: tiny proofs (hundreds of bytes), cheap constant-time verification — but need a per-circuit <b>trusted setup</b> and rest on elliptic-curve/pairing assumptions (not quantum-safe). <b>STARKs</b>: <b>no trusted setup</b>, post-quantum (hash-based) — but much larger proofs. Both let a verifier check a computation without redoing it.`,
          cards: [
            { q: `SNARK vs STARK — the headline trade?`, a: `SNARK: tiny proofs + cheap verify, but a <b>trusted setup</b> and not quantum-safe. STARK: no trusted setup + post-quantum, but much larger proofs.` },
            { q: `What does a validity (ZK) proof let a verifier avoid?`, a: `Re-executing the computation — it checks a succinct proof instead (the basis of ZK-rollups, d42).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Vitalik's 2017 piece is Groth16-era intuition — modern systems (PLONK, Halo2, STARK zkVMs) use <b>universal or transparent</b> setups that reduce/remove the per-circuit ceremony. Read it for the model, not current production.` },
        { id: "s2", type: "hint", label: `💡 "Zero-knowledge" and "succinct" are separable: rollups mostly want <i>succinctness</i> (a small proof of a big computation); privacy is a bonus some use.` },
      ],
    },
    {
      id: "d67", date: "2026-12-19", week: "w22", title: "Distributed locks & the Redlock debate",
      theme: "Caching · part 4 — a lock without a fencing token isn't safe.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 50,
          lead: `<b>Caching ④</b> — why a Redis lock can fail, and the fix both sides accept.`,
          refs: [
            `Read antirez's <a href="https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/" target="_blank" rel="noopener">Redlock</a> spec, then Kleppmann's critique <a href="https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html" target="_blank" rel="noopener">"How to do distributed locking"</a> (and antirez's <a href="https://antirez.com/news/101" target="_blank" rel="noopener">rebuttal</a>).`,
          ],
          model: `A lock alone isn't enough: a stalled client (GC pause, network delay) can act <i>after</i> its lease expired while another holds the lock. The fix is a monotonically increasing <b>fencing token</b> the protected resource checks — rejecting any write with a stale (lower) token. Redlock doesn't issue fencing tokens — Kleppmann's central objection.`,
          cards: [
            { q: `Why isn't holding a distributed lock sufficient for correctness?`, a: `A stalled client (GC/network pause) can act after its lease expired while another holds the lock — two "holders" at once.` },
            { q: `What's the fix both sides of the Redlock debate accept?`, a: `A monotonically increasing <b>fencing token</b> the resource checks, rejecting any write carrying a stale (lower) token.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d26/d20: for correctness-critical mutual exclusion, a DB row lock (<code>SELECT … FOR UPDATE</code>) or a consensus system beats a cache lock. Redlock trades safety for availability.` },
        { id: "s2", type: "hint", label: `💡 The fencing token is d57's logical clock applied to a lock — a monotonic order that rejects the stale actor.` },
      ],
    },
    {
      id: "d68", date: "2026-12-21", week: "w22", title: "io_uring vs epoll: completion beats readiness",
      theme: "Systems · part 6 — batch I/O with (almost) no syscalls.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ⑥</b> — the modern async I/O interface, and why it's different (callback d29).`,
          refs: [
            `Read <a href="https://unixism.net/loti/" target="_blank" rel="noopener">"Lord of the io_uring"</a> (the SQE/CQE ring model) + LWN <a href="https://lwn.net/Articles/810414/" target="_blank" rel="noopener">"The rapid growth of io_uring"</a>.`,
          ],
          model: `<b>epoll</b> is <b>readiness-based</b> — it says a fd is ready, you still issue a separate <code>read</code>/<code>write</code> per event (and it's useless for regular files, always "ready"). <b>io_uring</b> is <b>completion-based</b> — place SQEs in a ring shared with the kernel, submit a batch with one (or zero) syscalls, reap CQEs saying the op already <i>finished</i>. It collapses per-op syscall overhead and works for files.`,
          cards: [
            { q: `Readiness (epoll) vs completion (io_uring)?`, a: `epoll says a fd is <i>ready</i> (you still do the read); io_uring says the op already <i>finished</i> (CQE), batching submissions with few/zero syscalls.` },
            { q: `Why is io_uring useful where epoll isn't?`, a: `Regular files are always "ready", so epoll can't async them; io_uring's completion model does real async file I/O.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ io_uring is heavily kernel-gated (5.1+; features vary by version) — use <b>liburing</b>, not raw syscalls. A stream of CVEs led some hardened environments to disable it; it's not a universal epoll drop-in.` },
        { id: "s2", type: "hint", label: `💡 The dead <code>kernel.dk/io_uring.pdf</code> link floats around — use Lord of the io_uring / LWN instead.` },
      ],
    },

    /* ==================== WEEK 23 ==================== */
    {
      id: "d69", date: "2026-12-23", week: "w23", title: "Quorums (R + W > N) & tunable consistency",
      theme: "Distributed systems · part 6 — dial consistency vs latency per read/write.",
      tasks: [
        { id: "t1", obj: DIST, cat: "read", est: 50,
          lead: `<b>Distributed systems ⑥</b> — the Dynamo model of replicated reads/writes.`,
          refs: [
            `Read the Dynamo paper, <a href="https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" target="_blank" rel="noopener">"Dynamo: Amazon's Highly Available Key-value Store"</a> (SOSP 2007) — consistent hashing, quorums, vector clocks.`,
          ],
          model: `With N replicas and tunable read/write quorums, <b>R + W &gt; N</b> forces every read quorum to overlap every write quorum — so a read sees the latest write. Operators dial latency vs consistency vs durability. But Dynamo uses <b>sloppy</b> quorums + hinted handoff, so R+W&gt;N is <i>not</i> linearizable under partitions — reads can return concurrent versions the client reconciles (vector clocks, d57).`,
          cards: [
            { q: `What does R + W > N give you?`, a: `Every read quorum overlaps every write quorum, so a read sees the latest write — with tunable R/W to trade latency vs consistency.` },
            { q: `Does R + W > N mean strong consistency?`, a: `Not under Dynamo's sloppy quorums + partitions — you can still read concurrent versions and must reconcile. It's the 2007 research Dynamo, not the DynamoDB product.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 R=1,W=N → fast reads, slow durable writes; R=N,W=1 → the reverse. R=W=⌈(N+1)/2⌉ is the balanced quorum.` },
        { id: "s2", type: "callout", label: `🔬 Ties the thread together: consistent hashing (d50), vector clocks (d57), PACELC (d51) all appear in this one paper.` },
      ],
    },
    {
      id: "d70", date: "2026-12-26", week: "w23", title: "B-tree vs LSM-tree storage engines",
      theme: "Databases · part 11 — write-optimized vs read-optimized, and amplification.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ⑪</b> — the two families under Postgres, RocksDB, Cassandra & friends.`,
          sub: [
            { id: "s1", est: 30, label: `Read DDIA Ch 3 "Storage and Retrieval" (SSTables & LSM-Trees / B-Trees / comparison).` },
            { id: "s2", est: 20, label: `Free supplement: the <a href="https://github.com/facebook/rocksdb/wiki/RocksDB-Tuning-Guide" target="_blank" rel="noopener">RocksDB Tuning Guide</a> (defines write/read/space amplification).` },
          ],
          model: `<b>B-tree</b> (Postgres/MySQL): update pages in place — predictable reads, but write-amplifies via in-place writes + WAL. <b>LSM-tree</b> (RocksDB/Cassandra): buffer writes in memory, flush/compact sequential SSTables — high write throughput, but pays read + space amplification (compaction, checking multiple levels). Pick by read-heavy vs write-heavy.`,
          cards: [
            { q: `B-tree vs LSM-tree — the core trade?`, a: `B-tree: in-place updates, predictable reads, write-amplifies. LSM: buffered sequential writes (high throughput), pays read + space amplification via compaction.` },
            { q: `What is write amplification?`, a: `Bytes actually written to storage ÷ bytes written to the database — high in LSMs from compaction rewriting data across levels.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d06: Postgres indexes are B-trees. Reach for LSM engines (RocksDB, Cassandra, ScyllaDB) when writes dominate reads.` },
        { id: "s2", type: "callout", label: `🔬 "LSM = faster writes" is only true when tuned — bad compaction settings erase the advantage and spike read latency.` },
      ],
    },
    {
      id: "d71", date: "2026-12-28", week: "w23", title: "eBPF & XDP: programmable packets in the kernel",
      theme: "Networking · part 10 — run verified code before the packet even becomes an skb.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          lead: `<b>Networking ⑩</b> — the technology under Cilium, modern LBs and DDoS filters.`,
          refs: [
            `Read the Cilium <a href="https://docs.cilium.io/en/stable/reference-guides/bpf/" target="_blank" rel="noopener">"BPF and XDP Reference Guide"</a> + eBPF docs <a href="https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_XDP/" target="_blank" rel="noopener">XDP program type</a>.`,
          ],
          model: `<b>XDP</b> runs a verified BPF program at the earliest point — in the NIC driver's RX path, <b>before</b> the kernel allocates an <code>skb</code> — so it can drop/redirect/rewrite at line rate. Verdicts: <code>XDP_DROP</code>, <code>XDP_PASS</code> (up the stack), <code>XDP_TX</code> (bounce out), <code>XDP_REDIRECT</code>. tc/BPF hooks run later (after skb alloc) but see more context.`,
          cards: [
            { q: `Why is XDP so fast?`, a: `It runs in the NIC driver's RX path <b>before</b> the kernel allocates an skb (and before the full stack) — dropping/redirecting at line rate.` },
            { q: `The XDP verdicts?`, a: `<code>XDP_DROP</code>, <code>XDP_PASS</code> (to the stack), <code>XDP_TX</code> (bounce out the same NIC), <code>XDP_REDIRECT</code>.` },
          ] },
        { id: "t2", obj: COMP, cat: "read", est: 35,
          lead: `<b>Compiler lens</b> — before that BPF program runs, a verifier <i>proves</i> it safe and a JIT compiles it. A compiler pipeline living in ring 0.`,
          refs: [
            `Skim the kernel's <a href="https://docs.kernel.org/bpf/verifier.html" target="_blank" rel="noopener">eBPF verifier</a> doc, then the verify-then-JIT half of <a href="https://ebpf.io/what-is-ebpf/" target="_blank" rel="noopener">"What is eBPF?"</a>.`,
          ],
          model: `Loading eBPF is a two-stage <b>compiler back-end</b> inside the kernel. First the <b>verifier</b> does a static, path-sensitive analysis — it symbolically walks every path (a DAG, with <b>state pruning</b> so it doesn't explode), proving bounded loops, in-bounds memory, and correct register types; anything it can't prove safe is rejected, not loaded. Only then does a per-architecture <b>JIT</b> lower the accepted bytecode to native instructions, so it runs at near-C speed. It's the same <i>front-end checks → back-end codegen</i> shape you'll meet in the JVM and V8 — the difference is the kernel <b>can't trust</b> the input, so the "type checker" is a safety proof.`,
          cards: [
            { q: `What does the eBPF verifier guarantee before a program can load?`, a: `Termination + memory safety: it statically explores all paths (with state pruning) proving bounded loops, in-bounds access and correct register/pointer types. Can't prove it ⇒ rejected. It's a static analyzer, i.e. a compiler front-end.` },
            { q: `Why is loaded eBPF still fast if it was "interpreted" bytecode?`, a: `After verification a per-architecture <b>JIT</b> compiles the BPF bytecode to native machine code, so it executes at near-native speed rather than being interpreted.` },
            { q: `How is this like/unlike a language compiler?`, a: `Same shape — front-end checks then back-end codegen — but the verifier proves <b>safety</b> on untrusted input (reject on doubt), where a normal type checker assumes a cooperating programmer.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Only <b>native/driver</b> XDP is fast — <b>generic</b> mode runs after skb alloc (no perf win). "XDP always bypasses skb" is wrong for generic mode.` },
        { id: "s2", type: "hint", label: `💡 eBPF is a verified in-kernel VM — the same tech powers Cilium networking, Brendan Gregg's tracing (next DevOps day) and modern observability.` },
      ],
    },

    /* ==================== WEEK 24 ==================== */
    {
      id: "d72", date: "2026-12-31", week: "w24", title: "Solana under the hood: Firedancer & Alpenglow",
      theme: "Blockchain · part 12 — client diversity and a faster consensus.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 50,
          lead: `<b>Blockchain ⑫</b> — where Solana's performance and resilience are heading.`,
          refs: [
            `Read the <a href="https://github.com/firedancer-io/firedancer" target="_blank" rel="noopener">Firedancer</a> repo/README + <a href="https://docs.anza.xyz/" target="_blank" rel="noopener">Anza docs</a>; follow Anza's Alpenglow announcement for the consensus change.`,
          ],
          model: `<b>Firedancer</b> = Jump's independent, high-performance C/C++ validator client — throughput + <b>client diversity</b> (vs the Agave/Anza client). <b>Alpenglow</b> = a proposed replacement for TowerBFT+PoH-style consensus (Votor/Rotor) targeting ~150 ms-class finality. Two different layers — a <i>client</i> vs a <i>consensus protocol</i> — often conflated.`,
          cards: [
            { q: `Firedancer vs Alpenglow — different layers?`, a: `Firedancer = a from-scratch <b>validator client</b> (throughput + client diversity); Alpenglow = a new <b>consensus protocol</b> for far faster finality.` },
            { q: `Why does client diversity matter?`, a: `If one client has a bug, an independent implementation keeps the chain live — no single-client monoculture (Ethereum learned this too).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🆕 As of 2026: Firedancer is <b>live on mainnet</b> (full client since ~Dec 2025, minority stake). Alpenglow is <b>proposed</b> — validator-approved and on a test cluster, mainnet targeted ~H2 2026, not shipped. Know Tower BFT + PoH as the deployed model.` },
        { id: "s2", type: "hint", label: `💡 Callback to d34/d36: PoH gives the verifiable clock; Alpenglow rethinks how votes finalize on top of it.` },
      ],
    },
    {
      id: "d73", date: "2027-01-01", week: "w24", title: "Review: C++ memory model & std::atomic ordering",
      theme: "Review · the same acquire/release you met in Rust, at the metal.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          lead: `<b>Review</b> — what <code>memory_order</code> actually constrains (contrast d32's Rust).`,
          sub: [
            { id: "s1", est: 25, label: `Read cppreference <a href="https://en.cppreference.com/w/cpp/atomic/memory_order" target="_blank" rel="noopener">std::memory_order</a> (the 6 orderings) + Preshing, <a href="https://preshing.com/20120913/acquire-and-release-semantics/" target="_blank" rel="noopener">"Acquire and Release Semantics"</a>.` },
            { id: "s2", cat: "exercise", est: 20, label: `Without looking, explain: why does a release-store paired with an acquire-load safely publish data between threads?` },
          ],
          model: `<b>Release</b> (store) pairs with <b>acquire</b> (load) to establish <b>happens-before</b>: everything the writer did before the release becomes visible to a reader after the acquire. <b>seq_cst</b> adds one global total order; <b>relaxed</b> is atomicity only, no ordering. Lock-free is hard precisely because without these paired fences, threads observe writes in different orders.`,
          cards: [
            { q: `What does a release-store / acquire-load pair guarantee?`, a: `<b>Happens-before</b>: all writes before the release are visible to a thread that acquire-loads that value. That's how you publish data lock-free.` },
            { q: `relaxed vs seq_cst?`, a: `<code>relaxed</code> = atomicity only, no ordering; <code>seq_cst</code> = a single global total order across all seq_cst ops (the safe default).` },
          ] },
        { id: "t2", obj: COMP, cat: "read", est: 35,
          lead: `<b>Compiler lens</b> — half of "memory ordering" is the <i>compiler</i> reordering your code. Meet the <b>as-if rule</b> and why <code>-O2</code> is allowed to move things.`,
          refs: [
            `Read the <a href="https://en.wikipedia.org/wiki/As-if_rule" target="_blank" rel="noopener">as-if rule</a> (C/C++ "observable behavior"), then <a href="https://en.wikipedia.org/wiki/Register_allocation" target="_blank" rel="noopener">register allocation</a> — one concrete optimization the compiler runs on your IR.`,
          ],
          model: `A compiler may perform <b>any</b> transformation as long as the program's <b>observable behavior</b> is unchanged — that's the <b>as-if rule</b>. On a single thread "observable" means I/O + volatile access + final state, so the optimizer freely reorders, folds, inlines, and keeps values in registers (<b>register allocation</b> — graph-coloring / linear-scan, spilling to the stack when it runs out). The catch: "as-if" reasons about <i>one</i> thread, so it will happily reorder ordinary loads/stores that another thread is watching. <code>std::atomic</code> with an ordering is how you tell the compiler (and CPU) "this access <b>is</b> observable — don't reorder across it." So <code>volatile</code> ≠ a fence: it blocks the compiler for that one variable but orders nothing else and emits no barrier.`,
          cards: [
            { q: `What is the "as-if" rule?`, a: `A compiler may apply any optimization provided the program's <b>observable behavior</b> (I/O, volatile access, final state) is preserved — it reasons about a <i>single</i> thread.` },
            { q: `Why does that make lock-free code dangerous?`, a: `"As-if" only preserves single-thread observable behavior, so the optimizer reorders ordinary memory ops another thread can see. <code>std::atomic</code> orderings (d73) re-declare those accesses observable so they aren't reordered.` },
            { q: `Is <code>volatile</code> a thread-safety tool in C++?`, a: `No — it stops the compiler from optimizing away/reordering that one variable's accesses but emits <b>no CPU fence</b> and orders nothing else. Use <code>std::atomic</code> for inter-thread ordering.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Same enum, same semantics as Rust's <code>Ordering</code> (d32) — Rust just checks aliasing at compile time; C++ leaves it to you.` },
        { id: "s2", type: "hint", label: `💡 <code>memory_order_consume</code> is effectively discouraged — no mainstream compiler implements it as specified; most promote it to acquire.` },
      ],
    },
    {
      id: "d74", date: "2027-01-03", week: "w24", title: "Stream processing: event time & watermarks",
      theme: "Messaging · part 6 — the clock that matters is in the data, not the wall.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 50,
          lead: `<b>Messaging ⑥</b> — windowing unbounded, out-of-order streams correctly.`,
          refs: [
            `Read Flink <a href="https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/" target="_blank" rel="noopener">"Timely Stream Processing"</a> (watermarks) + the Google <a href="https://www.vldb.org/pvldb/vol8/p1792-Akidau.pdf" target="_blank" rel="noopener">Dataflow model paper</a> (Akidau et al., 2015).`,
          ],
          model: `<b>Processing time</b> = wall clock (low latency, non-deterministic); <b>event time</b> = timestamps in the records (deterministic, reproducible). A <b>watermark</b>(t) declares "event time has reached t — expect no more elements ≤ t", firing event-time windows; later records are "late". Dataflow frames it as <i>what</i> / <i>where</i> / <i>when</i> / <i>how</i>.`,
          cards: [
            { q: `Event time vs processing time?`, a: `Event time = the timestamp in the record (deterministic, reproducible); processing time = the wall clock when it's handled (low latency, non-deterministic).` },
            { q: `What does a watermark do?`, a: `<b>Watermark(t)</b> asserts event time has reached t (no more elements ≤ t expected) — firing the windows ending at/before t; later records are "late".` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d31: ordering is only per-partition, and events arrive late/out-of-order — watermarks are how a stream processor copes without a global clock.` },
        { id: "s2", type: "callout", label: `🔬 The four questions — what / where / when / how — are the Dataflow model's lasting contribution; every stream engine (Flink, Beam, Kafka Streams) implements them.` },
      ],
    },

    /* ==================== WEEK 25 ==================== */
    {
      id: "d75", date: "2027-01-06", week: "w25", title: "Performance analysis: perf, flame graphs & eBPF",
      theme: "DevOps · part 11 — find where time actually goes, not where you guess.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ⑪</b> — the observability that shows you the hot path.`,
          refs: [
            `Read Brendan Gregg: <a href="https://www.brendangregg.com/flamegraphs.html" target="_blank" rel="noopener">Flame Graphs</a>, <a href="https://www.brendangregg.com/perf.html" target="_blank" rel="noopener">perf examples</a>, <a href="https://www.brendangregg.com/ebpf.html" target="_blank" rel="noopener">eBPF tracing tools</a>.`,
          ],
          model: `Sample CPU stacks with <code>perf</code>, visualize as a <b>flame graph</b>: the x-axis is <b>not time</b> — frames are alphabetical and box width ∝ how often that stack was sampled (time on-CPU); read it by the widest plateaus near the top. eBPF (bpftrace/BCC) adds programmable low-overhead kernel+user tracing.`,
          cards: [
            { q: `How do you read a flame graph?`, a: `x-axis is <b>not time</b> — width ∝ sample count (time on-CPU), frames sorted alphabetically. Scan for the <b>widest plateaus near the top</b> = the hot paths.` },
            { q: `flame graph vs flame chart?`, a: `Flame <i>graph</i>: alphabetical x-axis (aggregated samples). Flame <i>chart</i>: time on the x-axis. Don't conflate them.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Accurate flame graphs need real stacks — compile with frame pointers or use <code>--call-graph dwarf</code>; missing frame pointers silently produce broken graphs.` },
        { id: "s2", type: "hint", label: `💡 Callback to d21/d35: golden signals tell you <i>that</i> it's slow; a flame graph tells you <i>where</i>. Measure, don't guess.` },
      ],
    },
    {
      id: "d76", date: "2027-01-08", week: "w25", title: "Signature replay & EIP-712 typed signing",
      theme: "Security · part 6 — a signature must be bound to one chain, one contract, once.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 50,
          lead: `<b>Security ⑥</b> — how off-chain signatures get replayed, and how to stop it.`,
          refs: [
            `Read <a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank" rel="noopener">EIP-712</a> (typed structured signing + domain separator) and <a href="https://eips.ethereum.org/EIPS/eip-2612" target="_blank" rel="noopener">EIP-2612 permit</a>.`,
          ],
          model: `Replay protection = <b>domain separator</b> (name, version, <b>chainId</b>, verifying contract) + a <b>nonce</b>. EIP-712 hashes structured data with that domain, so a signature is bound to one contract on one chain and shown human-readably. Omit or reuse either and it replays cross-chain, cross-contract, or twice — the nonce must be consumed on use, chainId read dynamically (to survive forks).`,
          cards: [
            { q: `What binds an EIP-712 signature to one place, one use?`, a: `The <b>domain separator</b> (chainId + verifying contract, …) plus a <b>nonce</b> consumed on use. Miss either → cross-chain/contract/replay.` },
            { q: `What is <code>permit</code> (EIP-2612)?`, a: `An EIP-712-signed ERC-20 approval — approve an allowance by signature instead of a separate <code>approve</code> tx. Blind-signing a max permit is a top drainer vector.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Caching the domain separator at deploy breaks after a fork changes chainId — recompute on chainId change (OZ's <code>EIP712</code> does). Callback to d25/d38: never trust input you didn't bind + verify.` },
        { id: "s2", type: "hint", label: `💡 <code>permit</code> phishing pairs with 7702 delegation (d60) as the modern wallet-signature attack surface — treat every signature prompt as a transaction.` },
      ],
    },
    {
      id: "d77", date: "2027-01-10", week: "w25", title: "🎓 Review: Rust async — Future, Pin & the state machine",
      theme: "Review · why async fn desugars to a self-referential state machine.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 50,
          lead: `<b>Review (capstone)</b> — what your <code>.await</code> compiles into (builds on d32's ownership).`,
          sub: [
            { id: "s1", est: 30, label: `Read the std docs <a href="https://doc.rust-lang.org/std/future/trait.Future.html" target="_blank" rel="noopener">Future</a> (<code>poll(self: Pin&lt;&mut Self&gt;, cx)</code>) and <a href="https://doc.rust-lang.org/std/pin/index.html" target="_blank" rel="noopener">Pin</a>; the <a href="https://rust-lang.github.io/async-book/" target="_blank" rel="noopener">async book</a> for narrative (note: mid-rewrite).` },
            { id: "s2", cat: "exercise", est: 20, label: `Without looking, explain: why does <code>Future::poll</code> take <code>Pin&lt;&mut Self&gt;</code>?` },
          ],
          model: `An <code>async fn</code> desugars into a compiler-generated <b>state machine</b> (one variant per await point) whose variants can hold references into its own locals → <b>self-referential</b>. <b>Pin</b> guarantees the future won't move once polled (keeping those references valid) — which is exactly why <code>poll</code> takes <code>Pin&lt;&mut Self&gt;</code>. The <b>Waker</b> in the <code>Context</code> lets a pending future ask the executor to re-poll.`,
          cards: [
            { q: `What does an <code>async fn</code> compile to?`, a: `A state machine — one state per <code>.await</code> — driven by <code>poll</code>. It can hold references into its own locals, making it self-referential.` },
            { q: `Why does <code>Future::poll</code> take <code>Pin&lt;&mut Self&gt;</code>?`, a: `The state machine is self-referential after the first poll — <code>Pin</code> guarantees it won't move, keeping those references valid. The <b>Waker</b> re-schedules a pending future.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🏁 Extension I complete — the threads ran from the wire up to distributed consensus, storage engines, chains and language runtimes. <b>Extension II</b> continues right below (weeks 26–29): the "cool internals" — amortized O(1), hash maps, garbage collection, the JS heap, floats, Unicode & Bloom filters.` },
        { id: "s2", type: "hint", label: `💡 Callback to d29/d03: the executor is the event loop; the Future is the non-blocking unit; the Waker is "the fd is ready". Async, all the way down.` },
      ],
      note: "🎓 Core + Extension I done — from the OSI myth to Rust's async state machine. Extension II (data-structure & runtime internals) runs weeks 26–29.",
    },

    /* ================================================================== *
     *  EXTENSION II — "the cool internals": the data structures and runtime
     *  machinery under the code you write every day. A NEW thread —
     *  Data-structure & runtime internals — is interleaved with more Systems
     *  and language Review days (same rule: consecutive days switch topics).
     *  References verified 2026-07-18, status-flagged for fast-moving items
     *  (Go maps→Swiss tables in 1.24, Go's GC, V8's pipeline, Unicode 17).
     *  Dates 2027-01-13 → 2027-02-05.
     * ================================================================== */

    /* ==================== WEEK 26 ==================== */
    {
      id: "d78", date: "2027-01-13", week: "w26", title: "Amortized O(1): dynamic arrays & the doubling trick",
      theme: "Data-structure internals · part 1 — a rare O(n) resize, amortized to nothing.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 50,
          lead: `<b>Internals ①</b> — why "append is O(1)" is honest, and the analysis that proves it.`,
          sub: [
            { id: "s1", est: 18, label: `Read the Rust <a href="https://doc.rust-lang.org/std/vec/struct.Vec.html#method.push" target="_blank" rel="noopener">Vec::push</a> docs: append "takes <b>amortized O(1)</b> time. If the length would exceed capacity, O(capacity) to copy to a larger allocation — offset by the capacity O(1) insertions it allows."` },
            { id: "s2", est: 17, label: `The trick: a dynamic array (Vec / ArrayList / Go slice / Python list) <b>doubles</b> capacity when full and copies everything (an O(n) event). Because doublings are exponentially spaced, total copy work over n appends is ≤ 2n → O(1) each on average.` },
            { id: "s3", est: 15, label: `The growth factor is a real design choice: read folly's <a href="https://github.com/facebook/folly/blob/main/folly/docs/FBVector.md" target="_blank" rel="noopener">FBVector</a> on why <b>1.5×</b> beats 2× — with 2× a new block always exceeds the sum of all freed ones, so the allocator can never reuse them.` },
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
        { id: "s2", type: "callout", label: `🔬 Callback to d09: a resize isn't just algorithmic cost — copying a big array blows the cache and faults fresh pages. Preallocate (<code>Vec::with_capacity</code> / <code>make([]T, 0, n)</code>) when you know the size to skip both.` },
      ],
      note: "Extension II begins — the 'cool internals': the data structures and runtime machinery under the code you write daily.",
    },
    {
      id: "d79", date: "2027-01-15", week: "w26", title: "NUMA, cache coherence (MESI) & false sharing",
      theme: "Systems · part 7 — you never own a variable, you own its 64-byte cache line.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 55,
          lead: `<b>Systems ⑦</b> — why two threads touching <i>different</i> variables can still cripple each other.`,
          sub: [
            { id: "s1", est: 20, label: `Read Ulrich Drepper, <a href="https://www.akkadia.org/drepper/cpumemory.pdf" target="_blank" rel="noopener">"What Every Programmer Should Know About Memory"</a> — the cache-coherence & NUMA parts (builds on the cache line from d09).` },
            { id: "s2", est: 18, label: `Then Martin Thompson, <a href="https://mechanical-sympathy.blogspot.com/2011/07/false-sharing.html" target="_blank" rel="noopener">"False Sharing"</a> — a benchmark + the padding fix.` },
            { id: "s3", est: 17, label: `Coherence runs at <b>cache-line</b> (~64 B) granularity via <b>MESI</b> (Modified / Exclusive / Shared / Invalid): to write a line a core must own it Exclusive, so writing a Shared line invalidates every other core's copy.` },
          ],
          model: `<b>False sharing</b>: two cores repeatedly write different variables that happen to share one cache line — no logical dependency, but each write invalidates the other's copy, so the line <b>ping-pongs</b> across the interconnect and throughput collapses. Fix by <i>layout</i>: pad/align to separate lines (<code>alignas(64)</code>, C++17 <code>hardware_destructive_interference_size</code>, per-thread structs). <b>NUMA</b>: remote memory is ~1.5–2× slower, and Linux places a page on the node that <b>first writes</b> it (first-touch) — not where you malloc'd it.`,
          cards: [
            { q: `What is false sharing?`, a: `Two cores writing <i>different</i> variables on the <b>same cache line</b> — each write invalidates the other's copy, so the line ping-pongs across cores. A pure layout/perf bug, not a correctness one.` },
            { q: `On which NUMA node does a freshly-malloc'd page live?`, a: `The node of the thread that <b>first writes</b> it (first-touch) — not where <code>malloc</code> ran. So initialize memory on the worker thread that will use it.` },
            { q: `Why isn't 64 bytes always safe for padding?`, a: `Apple M-series use 128 B lines and x86 adjacent-line prefetch couples pairs — so <code>hardware_destructive_interference_size</code> is often <b>128</b>. Pad to 128 to be safe.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d09/d73: this is the cache line again — and the acquire/release fences from the C++ memory model (d73) are what make one core's writes <i>visible</i> to another. Coherence + ordering are two halves of shared-memory truth.` },
        { id: "s2", type: "hint", label: `💡 The classic tell: an array of per-thread counters that gets <i>slower</i> with more threads. They're colliding on cache lines — pad each to its own line and it scales.` },
      ],
    },
    {
      id: "d80", date: "2027-01-17", week: "w26", title: "Hash maps: why O(1), collisions & Swiss tables",
      theme: "Data-structure internals · part 2 — expected O(1), and how it degrades to O(n).",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 55,
          lead: `<b>Internals ②</b> — the structure you reach for daily, and why its O(1) has fine print.`,
          sub: [
            { id: "s1", est: 20, label: `The model: a good hash spreads keys so expected bucket occupancy is the <b>load factor</b> α = n/m; lookup is O(1+α). Cross the threshold (Java 0.75) → <b>double + rehash</b> (O(n), amortized O(1) — the same trick as d78).` },
            { id: "s2", est: 18, label: `Collisions resolve two ways: <b>separate chaining</b> (bucket holds a list/tree; Java 8+ treeifies long chains to O(log n)) vs <b>open addressing</b> (probe in-array — better cache locality, needs α < 1).` },
            { id: "s3", est: 17, label: `Modern layout: read Abseil's <a href="https://abseil.io/about/design/swisstables" target="_blank" rel="noopener">Swiss Tables</a> — open addressing + a parallel array of 1-byte control words, SIMD-scanned a group at a time (Go's built-in map adopted this in <a href="https://go.dev/blog/swisstable" target="_blank" rel="noopener">Go 1.24</a>).` },
          ],
          model: `"O(1)" is <b>expected / amortized</b>, not worst-case: adversarial or unlucky keys can pile into one bucket → O(n). That's exploitable — <b>hash-flooding DoS</b> feeds colliding keys to force O(n²); the fix is a keyed PRF hash, <b>SipHash</b>, seeded per-process so collisions are unpredictable (Python, Rust, Ruby default to it). Swiss/flat maps store entries inline (no per-node alloc) for cache locality; a SIMD compare on control bytes checks ~16 slots at once.`,
          cards: [
            { q: `Is a hash-map lookup O(1)?`, a: `<b>Expected</b> O(1+α) with a good hash and bounded load factor — but worst case is O(n) (O(log n) if buckets treeify) when keys collide.` },
            { q: `What is hash-flooding, and the fix?`, a: `An attacker submits keys that all collide → O(n) per op, O(n²) overall. Fix: a <b>keyed hash (SipHash)</b> seeded with a per-process secret so collisions are unpredictable.` },
            { q: `Chaining vs open addressing?`, a: `Chaining: buckets hold lists (tolerates α>1, more pointer-chasing). Open addressing (Swiss tables): probe in-array, inline storage, great cache locality, needs α<1.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d78: the O(n) rehash on a doubling amortizes to O(1) per insert — hash maps and dynamic arrays share the exact same trick.` },
        { id: "s2", type: "callout", label: `🔬 "Go maps are chained buckets" is now outdated — Go 1.24 (2025) switched the built-in map to Swiss Tables. And your <code>HashMap</code> iteration order changing across runs is SipHash's per-process seed, not a bug.` },
      ],
    },

    /* ==================== WEEK 27 ==================== */
    {
      id: "d81", date: "2027-01-20", week: "w27", title: "Review: V8 & the JS heap — shapes, inline caches & Orinoco GC",
      theme: "Review · the engine under every line of JavaScript you ship.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 50,
          lead: `<b>Review</b> — why "just an object" is secretly a typed shape, and how V8 collects it.`,
          sub: [
            { id: "s1", est: 20, label: `Read Mathias Bynens, <a href="https://mathiasbynens.be/notes/shapes-ics" target="_blank" rel="noopener">"Shapes and Inline Caches"</a> + V8's <a href="https://v8.dev/docs/hidden-classes" target="_blank" rel="noopener">hidden classes</a> doc.` },
            { id: "s2", est: 16, label: `Then V8's <a href="https://v8.dev/blog/trash-talk" target="_blank" rel="noopener">"Trash Talk"</a> on the <b>Orinoco</b> GC (generational: a Scavenger young-gen + concurrent mark-sweep-compact old-gen).` },
            { id: "s3", cat: "exercise", est: 14, label: `Without looking, explain aloud: why does assigning object properties in a <i>different order</i> make code slower?` },
          ],
          model: `Every object has a <b>hidden class</b> (V8 calls it a <b>Map</b>, unrelated to the <code>Map</code> builtin) mapping property→offset; objects given the same properties <i>in the same order</i> share one. <b>Inline caches</b> memoize Map→offset at each access site: monomorphic (1 shape — fast, inlinable) → polymorphic → megamorphic (falls back to a dictionary lookup). GC is generational: the <b>Scavenger</b> copies survivors in a semispace young gen (minor GC), promoting to an old gen collected by concurrent mark-sweep-compact. <code>delete</code> or out-of-order init drops an object to slow dictionary mode.`,
          cards: [
            { q: `What is a V8 "hidden class" (Map / Shape)?`, a: `A runtime-built descriptor mapping property → offset; objects given the same properties <b>in the same order</b> share one, so a single pointer compare identifies the shape.` },
            { q: `Monomorphic vs megamorphic call site?`, a: `An inline cache sees 1 shape (monomorphic — fast, inlinable) vs many (megamorphic — falls back to a generic dictionary lookup). Keep hot sites monomorphic.` },
            { q: `V8's young-generation collector?`, a: `The <b>Scavenger</b> — a semispace copying collector (minor GC); survivors are promoted to the old generation (concurrent mark-sweep-compact). Part of the Orinoco project.` },
          ] },
        { id: "t2", obj: COMP, cat: "read", est: 40,
          lead: `<b>Compiler lens</b> — the shapes above only pay off because V8 <i>compiles</i> hot JS. Walk the Ignition → TurboFan tiering.`,
          refs: [
            `Read V8's <a href="https://v8.dev/blog/launching-ignition-and-turbofan" target="_blank" rel="noopener">"Launching Ignition and TurboFan"</a>, then skim <a href="https://v8.dev/blog/maglev" target="_blank" rel="noopener">Maglev</a> (the mid-tier added between Sparkplug and TurboFan).`,
          ],
          model: `V8 is a <b>tiered JIT</b>, not "an interpreter". Source is parsed to an AST, then <b>Ignition</b> compiles it to compact <b>bytecode</b> and interprets it while collecting <b>type feedback</b> (which shapes actually flow through each site). Hot functions are handed to optimizing compilers — <b>Sparkplug</b> (fast baseline), <b>Maglev</b> (mid-tier), <b>TurboFan</b> (top-tier, speculative) — which <b>speculate</b> on that feedback (e.g. "this is always a small int") and emit specialized machine code. If a speculation later breaks (a different shape appears), it <b>deoptimizes</b> — bails back to Ignition bytecode. This is exactly why monomorphic, stable-shape code is fast: it keeps the inline caches and the JIT's speculation valid.`,
          cards: [
            { q: `What are Ignition and TurboFan?`, a: `<b>Ignition</b> = V8's bytecode compiler + interpreter that also gathers type feedback; <b>TurboFan</b> = the top-tier optimizing JIT that speculatively compiles hot functions to machine code using that feedback (Sparkplug/Maglev sit between).` },
            { q: `What is deoptimization and what triggers it?`, a: `When an optimizing tier's speculation is invalidated at runtime (e.g. a new object shape / unexpected type), V8 discards the optimized code and falls back to Ignition bytecode — then may re-optimize later.` },
            { q: `Why does keeping call sites monomorphic help the JIT (not just the ICs)?`, a: `Stable shapes keep the type feedback that TurboFan speculates on valid, so hot code stays optimized instead of repeatedly deoptimizing back to bytecode.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Review tasks re-derive runtime models you already use (Rust d32, Go d49, Python d61, C++ d73, Rust async d77). This is the JS engine's turn.` },
        { id: "s2", type: "hint", label: `💡 Don't conflate <b>Oilpan</b> (V8's GC for C++/DOM objects) with <b>Orinoco</b> (the JS-heap collector) — different heaps, different collectors. "Shape" is the ecosystem word; V8's source says "Map".` },
      ],
    },
    {
      id: "d82", date: "2027-01-23", week: "w27", title: "Garbage collection: tracing, generational & tri-color",
      theme: "Data-structure internals · part 3 — reclaim the unreachable without stopping the world.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 55,
          lead: `<b>Internals ③</b> — the collectors under every managed runtime (contrast d81's V8, d49's Go).`,
          sub: [
            { id: "s1", est: 20, label: `The two families: <b>tracing</b> (mark from roots, reclaim the unreachable) vs <b>reference counting</b> (free at count 0 — prompt, but can't collect <i>cycles</i>, so CPython adds a backup tracer).` },
            { id: "s2", est: 18, label: `Read the <a href="https://go.dev/doc/gc-guide" target="_blank" rel="noopener">Go GC guide</a> + Rick Hudson's <a href="https://go.dev/blog/ismmkeynote" target="_blank" rel="noopener">"Getting to Go"</a> for a real low-latency concurrent design.` },
            { id: "s3", est: 17, label: `The <b>generational hypothesis</b> ("most objects die young") + a <b>write barrier</b>/remembered set let you collect a small young gen often and the old gen rarely.` },
          ],
          model: `<b>Tri-color marking</b>: white (unreached) / grey (reached, children unscanned) / black (done); the invariant is "no black→white pointer without a grey between", and a <b>write barrier</b> on pointer writes preserves it while the mutator runs concurrently. Reclamation styles: mark-<b>sweep</b> (fast, fragments), mark-<b>compact</b> (defrags, costlier), <b>copying</b> (bump-allocate, wastes half the heap). Modern concurrent GCs (Go, ZGC, Shenandoah) hold pauses sub-millisecond.`,
          cards: [
            { q: `Why can't reference counting reclaim everything?`, a: `<b>Cycles</b> — a self-referential island keeps counts > 0 forever. Refcounting needs a backup tracer (CPython) or weak refs.` },
            { q: `Tri-color marking — the colors and the barrier?`, a: `White (unreached) / grey (reached, unscanned) / black (scanned). A <b>write barrier</b> on pointer writes keeps "no black→white", so marking can run concurrently with the program.` },
            { q: `Is Go's GC generational?`, a: `No — it's deliberately <b>non-generational and non-moving</b> concurrent tri-color mark-sweep (escape analysis stack-allocates most short-lived objects instead). A common interview trap.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Callback to d81: V8 <i>is</i> generational + moving (the copying Scavenger); Go is neither. Two valid, opposite answers to the same problem — know why each chose as it did.` },
        { id: "s2", type: "hint", label: `💡 As of 2026 Go's GC is still concurrent non-generational mark-sweep; an experimental page-scanning "Green Tea" collector (<code>GOEXPERIMENT=greenteagc</code>, Go 1.25) is being trialed for better locality.` },
      ],
    },
    {
      id: "d83", date: "2027-01-25", week: "w27", title: "The heap allocator: malloc, size classes & fragmentation",
      theme: "Systems · part 8 — what actually happens on malloc(), and why free() doesn't shrink RSS.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ⑧</b> — the allocator sitting between your code and the kernel's pages.`,
          sub: [
            { id: "s1", est: 27, label: `Read Doug Lea's <a href="https://gee.cs.oswego.edu/dl/html/malloc.html" target="_blank" rel="noopener">"A Memory Allocator"</a> (dlmalloc — the design behind glibc) + Google's <a href="https://google.github.io/tcmalloc/design.html" target="_blank" rel="noopener">tcmalloc design</a>.` },
            { id: "s2", est: 23, label: `Small requests grow the heap via <b>brk</b>/sbrk; large ones (glibc ≥ 128 KB) go straight to <b>mmap</b> (and are unmapped on free). Otherwise <code>free</code> returns blocks to internal <b>bins</b>, not the OS.` },
          ],
          model: `Allocators bin free blocks by <b>size class</b> so alloc/free is an O(1) list pop/push with no search — the cost is <b>internal fragmentation</b> (a 12-byte request rounds up to a 16-byte class). <b>Boundary tags</b> let adjacent free chunks <b>coalesce</b>, fighting <b>external fragmentation</b> (free memory scattered too finely to satisfy a big request). Per-thread caches (glibc tcache, tcmalloc per-CPU) make the common path lock-free; multiple <b>arenas</b> avoid one global lock.`,
          cards: [
            { q: `Does <code>free()</code> return memory to the OS?`, a: `Usually no — it returns the block to allocator <b>free lists/bins</b> (RSS stays high). Only large <code>mmap</code>'d blocks are actually unmapped.` },
            { q: `Why do allocators use size classes?`, a: `Rounding to fixed classes makes alloc/free an O(1) bin pop/push (every block in a bin is interchangeable) — trading a little <b>internal</b> fragmentation for speed + less external fragmentation.` },
            { q: `Internal vs external fragmentation?`, a: `Internal = wasted space <i>inside</i> a block (rounding/metadata); external = free memory scattered in pieces too small to place a large request contiguously.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d41/d83: brk/mmap hand you virtual pages; the allocator sub-divides them. "Out of memory" from fragmentation isn't a leak — the bytes are free, just not contiguous.` },
        { id: "s2", type: "callout", label: `🔬 This is why long-running services swap in jemalloc/tcmalloc: better fragmentation behavior and per-CPU caching under many-thread load than default glibc ptmalloc.` },
      ],
    },

    /* ==================== WEEK 28 ==================== */
    {
      id: "d84", date: "2027-01-28", week: "w28", title: "IEEE 754: why 0.1 + 0.2 ≠ 0.3",
      theme: "Data-structure internals · part 4 — floats are exact binary fractions, just not the ones you typed.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 45,
          lead: `<b>Internals ④</b> — the number format that surprises everyone, made unsurprising.`,
          sub: [
            { id: "s1", est: 30, label: `Read <a href="https://floating-point-gui.de/" target="_blank" rel="noopener">floating-point-gui.de</a> for intuition, then skim Goldberg's canonical <a href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html" target="_blank" rel="noopener">"What Every Computer Scientist Should Know About Floating-Point Arithmetic"</a>.` },
            { id: "s2", est: 15, label: `See it: every language prints <code>0.1 + 0.2 = 0.30000000000000004</code> (<a href="https://0.30000000000000004.com/" target="_blank" rel="noopener">0.30000000000000004.com</a>).` },
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
      id: "d85", date: "2027-01-30", week: "w28", title: "Review: the JVM — tiered JIT, warmup & deoptimization",
      theme: "Review · why the JVM starts slow, gets fast, and can briefly re-slow.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 50,
          lead: `<b>Review</b> — how HotSpot turns bytecode into specialized native code at runtime (contrast d49's Go, d61's Python).`,
          sub: [
            { id: "s1", est: 30, label: `Read the <a href="https://docs.oracle.com/en/java/javase/21/vm/" target="_blank" rel="noopener">Java Virtual Machine Guide</a> (HotSpot compilation) + OpenJDK's <a href="https://wiki.openjdk.org/display/HotSpot/" target="_blank" rel="noopener">HotSpot wiki</a> (tiered compilation, deopt).` },
            { id: "s2", cat: "exercise", est: 20, label: `Without looking, explain aloud: why is a Java microbenchmark meaningless until it's "warmed up"?` },
          ],
          model: `HotSpot runs bytecode in an <b>interpreter</b>, then JIT-compiles <i>hot</i> methods with two compilers — <b>C1</b> (fast, light) and <b>C2</b> (slow, aggressive). <b>Tiered compilation</b> (levels 0–4) interprets + profiles, compiles at C1 with profiling, then recompiles the hottest at C2 using that profile (inlining, devirtualization, escape analysis). <b>On-stack replacement</b> swaps a long-running loop to compiled code mid-execution. <b>Deoptimization</b>: when a speculative assumption breaks (a call site thought monomorphic sees a new type), it bails back to the interpreter — why perf can briefly regress.`,
          cards: [
            { q: `Why is the JVM slow at first, then fast?`, a: `It <b>interprets + profiles</b> cold code, then JIT-compiles hot methods (C1 → C2) using the profile for aggressive speculative optimization. Cold code stays interpreted.` },
            { q: `What is deoptimization?`, a: `When a speculative assumption breaks (e.g. a call site thought monomorphic sees a new type), HotSpot <b>bails compiled code back to the interpreter</b> and may recompile — a brief slowdown.` },
            { q: `C1 vs C2 in tiered compilation?`, a: `C1 ("client") compiles fast with light optimization + profiling; C2 ("server") compiles the hottest methods slowly with aggressive optimization. Tiered mode uses <b>both</b>.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d81: HotSpot's monomorphic-call-site specialization + deopt is the same idea as V8's inline caches — profile the common case, guard it, fall back when the guard fails.` },
        { id: "s2", type: "callout", label: `🧭 As of 2026 the built-in Graal JIT was removed from OpenJDK (JDK 17); GraalVM is a separate distribution (Graal compiler + native-image AOT). Warmup work continues in Project Leyden.` },
      ],
    },
    {
      id: "d86", date: "2027-02-01", week: "w28", title: "Unicode, UTF-8 & grapheme clusters",
      theme: "Data-structure internals · part 5 — 'length' has four different answers.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 50,
          lead: `<b>Internals ⑤</b> — why string handling breaks on emoji, and the model that fixes it.`,
          sub: [
            { id: "s1", est: 30, label: `Read Joel Spolsky's <a href="https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/" target="_blank" rel="noopener">"The Absolute Minimum… about Unicode"</a>, then the <a href="https://utf8everywhere.org/" target="_blank" rel="noopener">UTF-8 Everywhere</a> manifesto.` },
            { id: "s2", est: 20, label: `Keep four layers distinct: <b>code point</b> (U+…) → <b>code unit</b> (8/16/32-bit per encoding) → <b>byte</b> → <b>grapheme cluster</b> (one user-perceived character).` },
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
        { id: "s2", type: "hint", label: `💡 Callback to d17: hashes/signatures operate on <b>bytes</b>, so always hash a defined encoding (UTF-8, usually NFC-normalized) — the same text in NFC vs NFD hashes differently. Unicode 17.0 is current (2025).` },
      ],
    },

    /* ==================== WEEK 29 ==================== */
    {
      id: "d87", date: "2027-02-03", week: "w29", title: "Branch prediction & speculative execution (Spectre)",
      theme: "Systems · part 9 — the CPU guesses your branches, and Spectre is the bill.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ⑨</b> — why a sorted array runs faster, and why speculation broke CPU security.`,
          sub: [
            { id: "s1", est: 30, label: `Read the famous <a href="https://stackoverflow.com/questions/11227809/" target="_blank" rel="noopener">"Why is processing a sorted array faster?"</a> answer, then Dan Luu's <a href="https://danluu.com/branch-prediction/" target="_blank" rel="noopener">branch-prediction</a> walkthrough.` },
            { id: "s2", est: 20, label: `For the security fallout, skim <a href="https://spectreattack.com/" target="_blank" rel="noopener">Spectre</a> + <a href="https://meltdownattack.com/" target="_blank" rel="noopener">Meltdown</a> (2018).` },
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
        { id: "s2", type: "callout", label: `🔬 Callback to d09: this is the memory hierarchy weaponized — the cache side-channel that makes speculation observable. Speculation is fundamental to all fast CPUs (Intel/AMD/ARM), so the class keeps spawning variants.` },
      ],
    },
    {
      id: "d88", date: "2027-02-05", week: "w29", title: "🎓 Bloom filters & probabilistic data structures",
      theme: "Data-structure internals · part 6 — trade a little accuracy for enormous space savings.",
      tasks: [
        { id: "t1", obj: CORE, cat: "read", est: 50,
          lead: `<b>Internals ⑥ (capstone)</b> — the sketches that answer set/count questions in kilobytes.`,
          sub: [
            { id: "s1", est: 30, label: `Read the <a href="https://en.wikipedia.org/wiki/Bloom_filter" target="_blank" rel="noopener">Bloom filter</a> overview (the math + use cases), then play with the <a href="https://llimllib.github.io/bloomfilter-tutorial/" target="_blank" rel="noopener">interactive visual tutorial</a>.` },
            { id: "s2", est: 20, label: `Place its siblings: <b>HyperLogLog</b> (cardinality — d19's Redis <code>PFCOUNT</code>) and <b>Count-Min Sketch</b> (frequency). All hash-based, sublinear-space, one-sided error.` },
          ],
          model: `A <b>Bloom filter</b> is an m-bit array + k hashes: insert sets k bits; query checks them — any 0 ⇒ <b>definitely absent</b>, all 1 ⇒ <i>possibly</i> present. So it has <b>no false negatives</b>, only tunable false positives (~9.6 bits/element for 1%), at O(k) per op independent of item size. You can't delete from a plain one (shared bits) — use a counting variant. The classic use: skip a disk read in an <b>LSM-tree</b> (d70) when the filter says a key isn't in an SSTable.`,
          cards: [
            { q: `What can a Bloom filter never do?`, a: `Give a <b>false negative</b> — "absent" is always true. It only has tunable <b>false positives</b> ("possibly present"), in O(k) time and ~9.6 bits/element at 1%.` },
            { q: `Bloom vs HyperLogLog vs Count-Min Sketch?`, a: `Bloom = set <b>membership</b>; HLL = <b>cardinality</b> (count-distinct, d19); Count-Min = per-item <b>frequency</b>. All hash-based & sublinear, but not interchangeable.` },
            { q: `Where do LSM-tree engines use Bloom filters?`, a: `One per SSTable — a point lookup skips reading that file from disk when the filter says the key is <b>definitely not</b> there (callback d70).` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🎓 Extension II complete — wire → runtime → data structure. From the OSI myth to why a hash map is O(1). One thread left: how the languages themselves are built.` },
        { id: "s2", type: "hint", label: `💡 Callback to d19/d70: you met HyperLogLog (Redis) and Bloom filters (LSM-trees) in passing — now you own the machinery. Reach for a sketch when exact answers cost too much memory.` },
      ],
      note: "🎓 Extension II complete — data-structure & runtime internals owned. Extension III (weeks 30–32) closes the loop: how compilers & interpreters actually turn your code into behavior.",
    },

    /* ==================================================================== *
     *  EXTENSION III — "how the languages are built" (authored 2026-07-21)
     *  A new COMPILERS & INTERPRETERS thread (COMP), interleaved day-by-day
     *  with language-implementation REVIEWs so consecutive days still switch
     *  lens. Complements (does NOT duplicate) the interp-go roadmap: that one
     *  BUILDS a toy interpreter in Go; this one dissects how REAL production
     *  implementations (CPython, gc, the JVM, V8, LLVM) do it. Also seeded
     *  earlier by "Compiler lens" tasks woven into d71 (eBPF verifier/JIT),
     *  d73 (the as-if rule) and d81 (Ignition/TurboFan).
     * ==================================================================== */
    {
      id: "d89", date: "2027-02-11", week: "w30", dow: "Thu", title: "A map of the territory: interpreters, compilers & JITs",
      theme: "Compilers · part 1 — the whole pipeline, and the words for each stage.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 50,
          lead: `<b>Compilers ①</b> — the vocabulary and the shape of every language implementation, before we build one.`,
          refs: [
            `Read Crafting Interpreters, <a href="https://craftinginterpreters.com/a-map-of-the-territory.html" target="_blank" rel="noopener">"A Map of the Territory"</a> (the mountain diagram: scanning → parsing → analysis → codegen).`,
            `Then Wikipedia's <a href="https://en.wikipedia.org/wiki/Just-in-time_compilation" target="_blank" rel="noopener">Just-in-time compilation</a> to place JIT against AOT and pure interpretation.`,
          ],
          model: `Every implementation climbs the same mountain: <b>scanning</b> (text → tokens) → <b>parsing</b> (tokens → AST) → <b>static analysis</b> (binding/typing) → an <b>intermediate representation</b> → down the far side to <b>code generation</b>. Where you stop and how you run it names the tool: a <b>tree-walking interpreter</b> executes the AST directly; a <b>bytecode VM</b> lowers to its own instruction set and interprets that; an <b>AOT compiler</b> emits native code ahead of time; a <b>JIT</b> compiles hot code to native <i>at runtime</i> using profiling. "Compiler vs interpreter" is a false binary — CPython compiles <i>to bytecode</i> then interprets; V8 interprets <i>then</i> JITs. It's a spectrum of when you translate.`,
          cards: [
            { q: `Name the stages of the classic compiler "mountain".`, a: `Scanning (→ tokens) → parsing (→ AST) → static analysis (binding/typing) → intermediate representation → optimization → code generation. Front end goes up, back end comes down.` },
            { q: `Tree-walk vs bytecode-VM vs AOT vs JIT?`, a: `Tree-walk runs the AST directly (simple, slow); bytecode-VM lowers to its own ISA and interprets that; AOT emits native code before running; JIT compiles hot code to native at runtime using profiles.` },
            { q: `Why is "compiler vs interpreter" a false dichotomy?`, a: `Most real systems are both — CPython compiles source to bytecode then interprets it; V8 interprets JS then JIT-compiles hot functions. It's a spectrum of <i>when</i> translation happens, not either/or.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This thread dissects how <b>real</b> engines work; the interp-go roadmap has you <b>build</b> a toy one. Two halves of the same skill — theory here, hands-on there.` },
        { id: "s2", type: "callout", label: `🧭 Keep the mountain diagram in your head — every later day (lexing, parsing, VMs, SSA, JITs) is one stretch of that same climb.` },
      ],
    },
    {
      id: "d90", date: "2027-02-13", week: "w30", dow: "Sat", title: "Review: how CPython runs your code — bytecode & the eval loop",
      theme: "Review · the interpreter you use daily, opened up.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          lead: `<b>Review</b> — Python isn't "interpreted line by line": it's compiled to bytecode and run by a loop. See it.`,
          refs: [
            `Play with the <a href="https://docs.python.org/3/library/dis.html" target="_blank" rel="noopener">dis</a> module — <code>dis.dis(fn)</code> on a couple of your own functions and read the opcodes.`,
            `Then CPython's own <a href="https://github.com/python/cpython/blob/main/InternalDocs/interpreter.md" target="_blank" rel="noopener">"The bytecode interpreter"</a> internal doc (frames + dispatch); optional: the <a href="https://devguide.python.org/internals/compiler/" target="_blank" rel="noopener">compiler design</a> devguide.`,
          ],
          model: `CPython <b>compiles</b> each function to a <code>code</code> object of stack-based <b>bytecode</b> (see it with <code>dis</code>), then the eval loop (<code>_PyEval_EvalFrameDefault</code>, historically "ceval") executes it: a big dispatch over opcodes operating on a per-call <b>frame</b> (its own value stack + locals). It's a <b>stack machine</b> — <code>LOAD_FAST</code> pushes, <code>BINARY_OP</code> pops two and pushes the result. 3.11+ made it much faster via a faster frame layout and <b>adaptive specializing</b> (PEP 659): hot opcodes rewrite themselves in place to type-specialized variants (<code>BINARY_OP</code> → <code>BINARY_OP_ADD_INT</code>) — a small in-interpreter JIT-of-sorts, and 3.13+ ships an experimental real JIT.`,
          cards: [
            { q: `What does CPython actually execute?`, a: `Not source text — it compiles each function to a <code>code</code> object of <b>stack-based bytecode</b> (inspect via <code>dis</code>), which the eval loop dispatches opcode by opcode over a per-call <b>frame</b>.` },
            { q: `Is CPython a stack or register machine?`, a: `A <b>stack machine</b>: <code>LOAD_FAST</code> pushes a local, <code>BINARY_OP</code> pops two operands and pushes the result. (Contrast register-based bytecode like Lua/Dalvik.)` },
            { q: `What did PEP 659 (3.11+) add?`, a: `<b>Adaptive specialization</b>: hot generic opcodes rewrite themselves in place into type-specialized forms (e.g. <code>BINARY_OP_ADD_INT</code>) using observed types — a quickening step short of a full JIT.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Callback to d89: CPython is the "compile to bytecode, then interpret" point on the spectrum — and callback to d61 (the GIL) which is a property of this same eval loop.` },
        { id: "s2", type: "hint", label: `💡 "Python is slow because it's interpreted" is half the story — it's the per-opcode dispatch + boxing, which is exactly what specialization (3.11+) and the 3.13 JIT attack.` },
      ],
    },
    {
      id: "d91", date: "2027-02-15", week: "w30", dow: "Mon", title: "Lexing & parsing: tokens, grammars, recursive descent & Pratt",
      theme: "Compilers · part 2 — turning flat text into a tree.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 55,
          lead: `<b>Compilers ②</b> — the front end: scan characters into tokens, then tokens into an AST that encodes precedence.`,
          refs: [
            `Read Crafting Interpreters <a href="https://craftinginterpreters.com/scanning.html" target="_blank" rel="noopener">"Scanning"</a> (regular tokens) + <a href="https://craftinginterpreters.com/parsing-expressions.html" target="_blank" rel="noopener">"Parsing Expressions"</a> (recursive descent).`,
            `Then Bob Nystrom's <a href="https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank" rel="noopener">"Pratt Parsers: Expression Parsing Made Easy"</a> for operator precedence done cleanly.`,
          ],
          model: `The <b>lexer/scanner</b> turns a character stream into <b>tokens</b> (<code>IDENT("x")</code>, <code>NUMBER(12)</code>, <code>PLUS</code>) — token shapes are a <b>regular</b> language, so a lexer is essentially a DFA (d92-adjacent: regexes compile to DFAs). The <b>parser</b> turns tokens into an <b>AST</b> per a <b>context-free grammar</b>. <b>Recursive descent</b> writes one function per grammar rule (top-down, LL) — readable, and what gcc/Clang/V8 actually use. Precedence is the hard part: pure recursive descent needs one level of function per precedence tier, while <b>Pratt parsing</b> (top-down operator precedence) attaches a <i>binding power</i> to each operator token and folds precedence into one compact loop — the trick most handwritten parsers reach for.`,
          cards: [
            { q: `Why is a lexer basically a state machine / DFA?`, a: `Token shapes (identifiers, numbers, operators) form a <b>regular</b> language, so recognizing them is exactly what a finite automaton does — the same reason regexes compile to DFAs.` },
            { q: `What is recursive-descent parsing?`, a: `A top-down (LL) parser with <b>one function per grammar rule</b> that calls itself to match nested structure, producing an AST. Readable and widely used in production (Clang, V8).` },
            { q: `What problem does Pratt parsing solve, and how?`, a: `Operator <b>precedence/associativity</b> without a ladder of one-rule-per-level functions: each operator token carries a <b>binding power</b> and a single loop consumes higher-binding operators first.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d89's mountain: scanning + parsing = the entire "front end". Everything after operates on the AST, never the raw text again.` },
        { id: "s2", type: "callout", label: `🔬 "Parser generators" (yacc/ANTLR) build bottom-up LR tables from a grammar; most beloved handwritten parsers are top-down recursive-descent + Pratt because errors and edge cases are easier to control.` },
      ],
    },
    {
      id: "d92", date: "2027-02-17", week: "w31", dow: "Wed", title: "Review: the Go compiler — parse → type-check → SSA → machine code",
      theme: "Review · the toolchain that builds everything you ship in Go.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          lead: `<b>Review</b> — you compile Go every day; walk the four phases the <code>gc</code> compiler runs.`,
          refs: [
            `Read the <a href="https://github.com/golang/go/blob/master/src/cmd/compile/README.md" target="_blank" rel="noopener">"Introduction to the Go compiler"</a> (cmd/compile README) — the phase list (also on <a href="https://go.dev/src/cmd/compile/README" target="_blank" rel="noopener">go.dev</a>).`,
          ],
          model: `Go's <code>gc</code> compiler runs, roughly: (1) <b>parse</b> — source → tokens → AST, with syntactic sugar noted; (2) <b>type-check & AST transform</b> — resolve names/types, desugar, decide escape analysis and inlining; (3) <b>SSA generation & lowering</b> — convert to a machine-independent <b>SSA</b> IR, run ~dozens of optimization passes (dead-code, constant folding, nil-check elimination), then <b>lower</b> to a machine-specific SSA; (4) <b>codegen</b> — register allocation, instruction layout, emit machine code + the object file. <b>Escape analysis</b> here is why a Go value lands on the stack (freed cheaply) vs the heap (GC'd) — a compile-time decision, not a keyword. It's a fast, non-JIT AOT compiler with its own backend (not LLVM).`,
          cards: [
            { q: `The four phases of the Go (gc) compiler?`, a: `(1) parse → AST; (2) type-check + AST transforms (desugar, inline, escape analysis); (3) SSA generation, optimization passes, then machine-specific lowering; (4) codegen — register allocation + emit machine code.` },
            { q: `What does escape analysis decide, and when?`, a: `At <b>compile time</b>, whether a value can stay on the stack (freed on return) or must go on the heap (GC-managed) because it "escapes" its function. It's inferred, not annotated.` },
            { q: `Does Go use LLVM?`, a: `The default <code>gc</code> toolchain has its own SSA-based backend (not LLVM); <code>gccgo</code> and TinyGo are separate frontends onto GCC/LLVM.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Callback to d49 (Go's scheduler) and d89: this is the AOT-with-its-own-backend point on the spectrum — no JIT, but a full SSA optimizer.` },
        { id: "s2", type: "hint", label: `💡 SSA (next-day-adjacent, d94/d97) is what makes those optimization passes tractable — each value is assigned once, so "where did this come from?" has a single answer.` },
      ],
    },
    {
      id: "d93", date: "2027-02-19", week: "w31", dow: "Fri", title: "Tree-walking interpreters: evaluating an AST, scope & closures",
      theme: "Compilers · part 3 — the simplest way to actually run the tree.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 55,
          lead: `<b>Compilers ③</b> — walk the AST and execute it: environments, lexical scope, and how closures capture.`,
          refs: [
            `Read Crafting Interpreters <a href="https://craftinginterpreters.com/evaluating-expressions.html" target="_blank" rel="noopener">"Evaluating Expressions"</a> + <a href="https://craftinginterpreters.com/statements-and-state.html" target="_blank" rel="noopener">"Statements and State"</a> (environments).`,
            `Then <a href="https://craftinginterpreters.com/closures.html" target="_blank" rel="noopener">"Closures"</a> — how a function captures its defining environment.`,
          ],
          model: `A <b>tree-walking interpreter</b> recursively visits AST nodes (the Visitor pattern) and returns values: a <code>+</code> node evaluates its two children and adds them. State lives in an <b>environment</b> — a map of name → value, <b>chained</b> to its enclosing scope, so a lookup walks outward (lexical scoping). A <b>closure</b> is a function value that holds a reference to the environment where it was <i>defined</i> (not called) — that's how an inner function still sees an outer variable after the outer call returns. The upside: tiny and direct. The downside: you re-walk the tree and re-resolve names on every execution — pointer-chasing, no locality — which is exactly why the next tier compiles to bytecode.`,
          cards: [
            { q: `How does a tree-walking interpreter run a program?`, a: `It recursively evaluates AST nodes (Visitor pattern), each node computing from its children's values — e.g. a binary <code>+</code> node evaluates both operands then adds. Simple, but re-walks the tree every time.` },
            { q: `What is an "environment" and how does lexical scope work?`, a: `A name→value map <b>chained</b> to its enclosing scope; a variable lookup walks the chain outward. Inner scopes shadow outer ones — that chain <i>is</i> lexical scoping.` },
            { q: `What exactly does a closure capture?`, a: `A reference to the <b>environment where the function was defined</b> (not where it's called), so it keeps seeing those variables even after the defining call has returned.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d61/d90: CPython does NOT tree-walk — it compiles to bytecode first. Tree-walking is the teaching baseline; almost every fast language moves to a VM.` },
        { id: "s2", type: "callout", label: `🔬 Closures force a real decision: capture by reference (shared, JS/Python) vs by value (copied). Loop-variable capture bugs come straight from this choice.` },
      ],
    },
    {
      id: "d94", date: "2027-02-21", week: "w31", dow: "Sun", title: "Review: the JVM — javac, tiered JIT (C1/C2), warmup & deopt",
      theme: "Review · the other great managed runtime, next to V8.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          lead: `<b>Review</b> — how HotSpot turns bytecode into some of the fastest managed code on earth — eventually.`,
          refs: [
            `Read Ben Evans, <a href="https://www.oracle.com/technical-resources/articles/java/architect-evans-pt1.html" target="_blank" rel="noopener">"Understanding Java JIT Compilation with JITWatch"</a> (profiling + tiers).`,
            `Then the <a href="https://en.wikipedia.org/wiki/HotSpot_(virtual_machine)" target="_blank" rel="noopener">HotSpot</a> overview (C1/C2, tiered compilation); optional deep cuts: <a href="https://shipilev.net/jvm/anatomy-quarks/" target="_blank" rel="noopener">JVM Anatomy Quarks</a>.`,
          ],
          model: `<code>javac</code> is only a <b>front end</b>: it compiles <code>.java</code> to portable <b>bytecode</b> (<code>.class</code>) with almost no optimization. The real compiler is inside the <b>JVM</b>: HotSpot starts by <b>interpreting</b> bytecode while profiling, then uses <b>tiered compilation</b> — <b>C1</b> (fast, lightly optimized) for methods that warm up, <b>C2</b> (slow, aggressive: inlining, escape analysis, loop opts) for the hottest. Because it optimizes on <i>observed</i> behavior it <b>speculates</b> (e.g. a call site is effectively monomorphic) and installs a guard; if the guard fails it <b>deoptimizes</b> back to the interpreter. Hence <b>warmup</b>: the same code is slow for the first thousands of calls, then fast — which is why JVM benchmarks must warm up first.`,
          cards: [
            { q: `What does <code>javac</code> actually do — and not do?`, a: `It compiles Java source to portable <b>bytecode</b> (<code>.class</code>) with little optimization. The heavy optimization happens later, at runtime, inside the JVM's JIT.` },
            { q: `C1 vs C2 in HotSpot's tiered compilation?`, a: `<b>C1</b> compiles quickly with light optimization (for merely-warm code); <b>C2</b> compiles slowly with aggressive optimization (inlining, escape analysis) for the hottest methods.` },
            { q: `Why do JVM programs need "warmup"?`, a: `Code starts <b>interpreted</b> while HotSpot profiles it, and only gets JIT-compiled (C1→C2) once hot — so early runs are slow, and a bad speculation can <b>deoptimize</b> back to the interpreter.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Callback to d81/d89: same idea as V8 (interpret + profile → speculatively JIT → deopt on guard failure). Managed runtimes converge on this design.` },
        { id: "s2", type: "hint", label: `💡 "The JVM is slow to start" and "Java is fast" are both true — that's warmup. AOT options (GraalVM native-image) trade peak throughput for instant start.` },
      ],
    },
    {
      id: "d95", date: "2027-02-24", week: "w32", dow: "Wed", title: "Bytecode compilers & a stack VM (the clox model)",
      theme: "Compilers · part 4 — why every fast interpreter compiles to its own instruction set.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 55,
          lead: `<b>Compilers ④</b> — trade the AST for a flat bytecode array and a stack machine: locality, speed, portability.`,
          refs: [
            `Read Crafting Interpreters Part III openers — <a href="https://craftinginterpreters.com/a-bytecode-virtual-machine.html" target="_blank" rel="noopener">"Chunks of Bytecode"</a> + <a href="https://craftinginterpreters.com/a-virtual-machine.html" target="_blank" rel="noopener">"A Virtual Machine"</a> (the stack + dispatch loop).`,
            `Then <a href="https://craftinginterpreters.com/compiling-expressions.html" target="_blank" rel="noopener">"Compiling Expressions"</a> — a single-pass, Pratt-driven bytecode compiler.`,
          ],
          model: `Instead of re-walking a tree of scattered pointers, compile the AST (or even parse straight) into a flat array of <b>bytecode</b> — one-byte opcodes + operands — and run a <b>virtual machine</b>: a loop that fetches an opcode, dispatches (a <code>switch</code>, or a computed-goto "threaded" dispatch for speed), and mutates a <b>value stack</b>. Most VMs are <b>stack machines</b> (<code>OP_CONSTANT</code> pushes, <code>OP_ADD</code> pops two and pushes) because they're simple to compile to; some (Lua, Dalvik) are <b>register machines</b> (fewer instructions, more per-instruction work). The win is <b>locality</b> — sequential bytes, no pointer chasing — plus a portable artifact you can ship and, later, JIT. This is the leap CPython, the JVM, and Lua all make; the tree-walker (d93) was the on-ramp.`,
          cards: [
            { q: `Why compile to bytecode instead of walking the AST?`, a: `A flat bytecode array gives <b>cache locality</b> and cheap sequential dispatch (no pointer-chasing through tree nodes), plus a portable artifact you can ship and later JIT — far faster than re-walking the tree each run.` },
            { q: `What is a stack-based VM, concretely?`, a: `A fetch-decode-dispatch loop over opcodes that operate on a <b>value stack</b>: <code>OP_CONSTANT</code> pushes, <code>OP_ADD</code> pops two and pushes their sum. Simple to compile to; contrast register VMs (Lua/Dalvik).` },
            { q: `What is "threaded" / computed-goto dispatch?`, a: `Replacing the big <code>switch</code> with a jump directly from the end of one opcode's handler to the next's (via a label-address table), which the CPU's branch predictor handles far better — a common VM speedup.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback to d90/d94: this IS what CPython and the JVM do — you're now seeing the machinery behind "compiles to bytecode, then interprets". clox even folds parsing + codegen into one pass.` },
        { id: "s2", type: "callout", label: `🔬 Callback to d87 (branch prediction): the interpreter's central dispatch is one hyper-hot indirect branch — which is exactly why computed-goto/threaded dispatch measurably wins.` },
      ],
    },
    {
      id: "d96", date: "2027-02-26", week: "w32", dow: "Fri", title: "Review: LLVM — IR, SSA & the shared backend behind Clang & rustc",
      theme: "Review · the compiler infrastructure under half the languages you use.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 50,
          lead: `<b>Review</b> — how one optimizer + backend serves C, C++, Rust, Swift and more: a shared IR.`,
          refs: [
            `Skim the <a href="https://llvm.org/docs/LangRef.html" target="_blank" rel="noopener">LLVM Language Reference</a> intro (what LLVM IR looks like: typed, SSA, <code>phi</code> nodes).`,
            `Then walk chapters of the <a href="https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/index.html" target="_blank" rel="noopener">"My First Language Frontend" (Kaleidoscope)</a> tutorial — lexer → parser → LLVM IR → JIT.`,
          ],
          model: `LLVM's idea: define one well-specified, typed, <b>SSA</b> <b>intermediate representation</b>, and split every compiler into a language <b>front end</b> (Clang for C/C++, <code>rustc</code>, <code>swiftc</code> → LLVM IR) and a shared <b>middle/back end</b> (target-independent optimization passes, then per-target codegen). Write your optimizer and register allocator <b>once</b> against the IR; every language and every CPU benefits. <b>SSA</b> — static single assignment, each virtual register assigned exactly once, with <code>phi</code> nodes merging values at control-flow joins — is what makes those passes clean: data-flow questions have a single definition to follow. That's why a new language can get a serious optimizing compiler by just emitting LLVM IR.`,
          cards: [
            { q: `What is LLVM IR and why does it matter?`, a: `A typed, <b>SSA-form</b> intermediate representation that decouples language front ends (Clang, rustc, swiftc) from a shared optimizer + per-target backend — so optimization/codegen is written once and reused across languages and CPUs.` },
            { q: `What is SSA form and its signature feature?`, a: `<b>Static single assignment</b>: every value is assigned exactly once; <b>phi</b> nodes select which incoming value applies at a control-flow merge. Single definitions make data-flow optimization tractable.` },
            { q: `How does Rust/Swift get a good optimizing compiler "for free"?`, a: `Its front end lowers to LLVM IR; LLVM's existing target-independent passes and backends then optimize and generate machine code — no need to re-implement register allocation, inlining, etc.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Callback to d92: Go's <code>gc</code> deliberately does NOT use LLVM (its own SSA backend, for fast builds) — a real engineering trade-off vs Rust's LLVM dependency (slower builds, heavier optimization).` },
        { id: "s2", type: "hint", label: `💡 SSA appears in three places you've now seen: Go's compiler (d92), LLVM here, and modern JITs. Learn it once; recognize it everywhere.` },
      ],
    },
    {
      id: "d97", date: "2027-02-28", week: "w32", dow: "Sun", title: "🎓 Optimization & codegen: SSA, register allocation & the as-if rule",
      theme: "Compilers · part 5 (capstone) — the back end that makes it fast, and the rule that lets it.",
      tasks: [
        { id: "t1", obj: COMP, cat: "read", est: 55,
          lead: `<b>Compilers ⑤ (capstone)</b> — how an optimizer is <i>allowed</i> to rewrite your code, and the last mile to machine instructions.`,
          refs: [
            `Read <a href="https://en.wikipedia.org/wiki/Static_single-assignment_form" target="_blank" rel="noopener">Static single-assignment form</a> (why optimizers use it) + <a href="https://en.wikipedia.org/wiki/Register_allocation" target="_blank" rel="noopener">register allocation</a> (graph-coloring / linear scan).`,
            `Then <a href="https://en.wikipedia.org/wiki/Instruction_selection" target="_blank" rel="noopener">instruction selection</a>, and revisit the <a href="https://en.wikipedia.org/wiki/As-if_rule" target="_blank" rel="noopener">as-if rule</a> (d73) that authorizes it all.`,
          ],
          model: `The back end earns the speed. On an <b>SSA</b> IR, classic passes fall out cheaply: constant folding/propagation, dead-code elimination, common-subexpression elimination, loop-invariant code motion — each easy because every value has one definition. Then the machine-specific mile: <b>instruction selection</b> (map IR ops to real opcodes — often tree/DAG tiling), <b>instruction scheduling</b> (reorder to hide latency), and <b>register allocation</b> (fit unbounded virtual registers into a handful of physical ones — modeled as <b>graph coloring</b>, or <b>linear scan</b> in JITs; when it can't, it <b>spills</b> to the stack). All of this is licensed by one rule: the <b>as-if rule</b> — transform however you like as long as <b>observable behavior</b> is preserved. That single principle is why <code>-O2</code> can delete, reorder, and vectorize your code, and why (d73) it needs <code>atomic</code>/<code>volatile</code> to know what it must NOT touch.`,
          cards: [
            { q: `Why do optimizers convert to SSA before optimizing?`, a: `With every value assigned once, data-flow facts (reaching definitions, liveness) have a single source — so constant folding, dead-code elimination, CSE and LICM become simple, local rewrites.` },
            { q: `What problem is register allocation, and how is it modeled?`, a: `Mapping unbounded virtual registers onto a few physical ones. Modeled as <b>graph coloring</b> (interference graph) or <b>linear scan</b> (fast, JIT-friendly); values that don't fit are <b>spilled</b> to the stack.` },
            { q: `What licenses every compiler optimization — and its limit?`, a: `The <b>as-if rule</b>: any transformation is legal if the program's <b>observable behavior</b> is unchanged. Its limit is that "observable" is defined per single thread — hence atomics/volatile (d73) to mark what must not be reordered.` },
          ] },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🏁 Bedrock complete — 32 weeks, 12 threads, from the OSI myth to how a compiler is allowed to rewrite your code. The wire, the runtime, the data structure, and now the language itself: the theory a backend/blockchain engineer is expected to own, end to end.` },
        { id: "s2", type: "hint", label: `💡 Callbacks close the loop: the as-if rule (d73), branch prediction in the dispatch loop (d87), V8's JIT (d81), the eBPF verifier (d71). You've now seen compilation from the kernel to the cloud.` },
      ],
      note: "🏁 Bedrock complete — 32 weeks across 12 threads. From \"there is no OSI layer 5 on the wire\" to \"the as-if rule is why -O2 is allowed\": your interview-and-tech-talk bedrock, wire to compiler.",
    },
  ],

  milestones: [
    { id: "w4.m1", week: "w4", title: "Month 1 — Networking + DevOps foundations",
      rule: { type: "tasks", require: ["d01.t1", "d02.t1", "d07.t1", "d08.t1", "d11.t1", "d12.t1"] } },
    { id: "w8.m1", week: "w8", title: "Month 2 — data layer, HTTP, blockchain & security basics",
      rule: { type: "tasks", require: ["d15.t1", "d17.t1", "d20.t1", "d22.t1", "d24.t1", "d25.t1"] } },
    { id: "w12.m1", week: "w12", title: "🎓 Core complete — the essentials owned",
      rule: { type: "tasks", require: ["d34.t1", "d36.t1", "d37.t1", "d38.t1"] } },
    // ---- Extension milestones ----
    { id: "w17.m2", week: "w17", title: "Extension I — distributed systems & storage internals underway",
      rule: { type: "tasks", require: ["d39.t1", "d40.t1", "d42.t1", "d45.t1", "d51.t1"] } },
    { id: "w21.m2", week: "w21", title: "Extension II — chains deep, replication & sagas",
      rule: { type: "tasks", require: ["d54.t1", "d57.t1", "d60.t1", "d63.t1", "d64.t1"] } },
    { id: "w25.m2", week: "w25", title: "🎓 Extension I complete — distributed systems & internals",
      rule: { type: "tasks", require: ["d69.t1", "d72.t1", "d74.t1", "d77.t1"] } },
    // ---- Extension II (internals) milestone ----
    { id: "w29.m3", week: "w29", title: "🎓 Extension II complete — data-structure & runtime internals",
      rule: { type: "tasks", require: ["d78.t1", "d80.t1", "d82.t1", "d84.t1", "d88.t1"] } },
    // ---- Extension III (compilers & interpreters) milestones ----
    // Anchored to w31 because its last required task (the tree-walker, d93) lives
    // in w31 — the deadline/at-risk math keys off the milestone's week end.
    { id: "w31.m4", week: "w31", title: "Extension III — the front end: maps, lexing, parsing & real interpreters",
      rule: { type: "tasks", require: ["d89.t1", "d90.t1", "d91.t1", "d93.t1"] } },
    { id: "w32.m4", week: "w32", title: "🎓 Extension III complete — how compilers & interpreters really work",
      rule: { type: "tasks", require: ["d95.t1", "d97.t1"] } },
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
