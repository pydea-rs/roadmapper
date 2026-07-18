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
      OPS = "devops", CHAIN = "chain", SEC = "sec", REV = "review";

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
    { id: REV,   title: "Language & framework review", tier: "primary", color: "#94a3b8" },
  ],

  weeks: [
    { id: "w1",  title: "Week 1 — The wire, the container, the process", start: "2026-07-20" },
    { id: "w2",  title: "Week 2 — Addresses, images & the B-tree",       start: "2026-07-27" },
    { id: "w3",  title: "Week 3 — TCP, Kubernetes, cache & the planner",  start: "2026-08-03" },
    { id: "w4",  title: "Week 4 — DNS, scheduling & first security",      start: "2026-08-10" },
    { id: "w5",  title: "Week 5 — TLS, MVCC & shipping",                  start: "2026-08-17" },
    { id: "w6",  title: "Week 6 — Crypto, HTTP, Redis & isolation",       start: "2026-08-24" },
    { id: "w7",  title: "Week 7 — Metrics, the EVM & the log",            start: "2026-08-31" },
    { id: "w8",  title: "Week 8 — Proxies, OAuth & locks",               start: "2026-09-07" },
    { id: "w9",  title: "Week 9 — Solana, SLOs & the event loop",         start: "2026-09-14" },
    { id: "w10", title: "Week 10 — Transactions, Kafka & a Rust review",  start: "2026-09-21" },
    { id: "w11", title: "Week 11 — Stampedes, Sealevel & load tests",     start: "2026-09-28" },
    { id: "w12", title: "Week 12 — Consensus & the security capstone",    start: "2026-10-05" },
  ],

  days: [
    /* ==================== WEEK 1 ==================== */
    {
      id: "d01", date: "2026-07-20", week: "w1", title: "The OSI myth vs how the internet really layers",
      theme: "Networking · thread part 1 — encapsulation is the load-bearing idea, not the number 7.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          lead: `<b>Networking ①</b> — learn the layering model <i>honestly</i>.`,
          refs: [
            `Read Cloudflare <a href="https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/" target="_blank" rel="noopener">"What is the OSI Model?"</a> for the diagram — then apply the corrections below.`,
            `The internet runs the <b>TCP/IP</b> model (Link → Internet → Transport → Application); OSI layers 5–6 (session/presentation) have <i>no</i> real counterpart.`,
            `"L7 load balancer / L4 firewall / L3 switch" is just shorthand for <b>which header a device inspects</b> (L3=IP, L4=port, L7=HTTP).`,
          ],
          model: `The load-bearing idea is <b>encapsulation</b>: a packet is <code>[Ethernet [IP [TCP [HTTP]]]]</code> — going down the stack adds headers, up strips them. Not "recite 7 layers".` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The cargo-cult mistake is reciting all 7 OSI layers as if each is real and present in every packet. Interview answer: encapsulation + which header a device reads.` },
        { id: "s2", type: "callout", label: `🧭 This is thread <b>Networking</b>, part 1 of 7 in the core. Each time it reappears it continues in order (subnets → TCP → DNS → TLS → HTTP → load balancers).` },
      ],
      note: "Bedrock begins. 2–3 short days a week, one topic each — separate from your main roadmaps.",
    },
    {
      id: "d02", date: "2026-07-23", week: "w1", title: "What a container actually is",
      theme: "DevOps · thread part 1 — a container is a Linux process with a restricted view, not a VM.",
      tasks: [
        { id: "t1", obj: OPS, cat: "watch", est: 45,
          lead: `<b>DevOps ①</b> — see a container built from raw kernel primitives.`,
          refs: [
            `Watch Liz Rice, <a href="https://www.youtube.com/watch?v=8fi7uSYlOdc" target="_blank" rel="noopener">"Containers From Scratch" (GOTO 2018, ~43 min)</a> — she live-codes one in Go from <code>clone()</code> + namespaces + <code>chroot</code> + cgroups.`,
          ],
          model: `There is <b>no "container" object in the kernel</b>. <b>Namespaces</b> limit what a process can <i>see</i> (PID, mount, net, UTS, IPC, user); <b>cgroups</b> limit what it can <i>use</i> (CPU, memory, IO). That's the whole trick.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A VM virtualizes hardware and runs its own kernel; a container shares the host kernel — lighter, but a weaker isolation boundary (why "container escape" is a real threat).` },
        { id: "s2", type: "callout", label: `🔧 DevOps is a first-class, first-month thread here (Docker → Kubernetes → CI/CD → observability → load testing). "Containers" means the whole real stack, not just <code>docker run</code>.` },
      ],
    },
    {
      id: "d03", date: "2026-07-25", week: "w1", title: "Processes vs threads vs coroutines",
      theme: "Systems · thread part 1 — who schedules it, and what's shared.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ①</b> — the three units of execution, and the one distinction that matters.`,
          refs: [
            `Read OSTEP (free) <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">Ch 4 "The Abstraction: The Process"</a> + <b>Ch 26 "Concurrency: Threads"</b>.`,
            `Map it to your stack: Go goroutines (M:N green threads), Rust <code>async</code>/tokio & Python <code>asyncio</code> (stackless coroutines on an event loop), Node (single loop + libuv pool).`,
          ],
          model: `<b>Process</b> = own address space + fds (expensive switch). <b>OS thread</b> = shares the address space, kernel-scheduled preemptively. <b>Coroutine</b> = user-space scheduled, no syscall to switch → millions of them, cooperative. The distinction is <i>who schedules it</i> and <i>what's shared</i>.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 That one sentence — who schedules it (kernel vs runtime) and what's shared (address space) — answers most "goroutine vs thread" interview questions.` },
        { id: "s2", type: "suggestion", label: `Tie-in: coroutines are cheap precisely because they skip the kernel context switch (and often the TLB flush) — we'll quantify that when Systems reaches CPU caches.` },
      ],
    },

    /* ==================== WEEK 2 ==================== */
    {
      id: "d04", date: "2026-07-28", week: "w2", title: "IP addressing, subnets & CIDR",
      theme: "Networking · part 2 — stop CIDR from being magic.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          lead: `<b>Networking ②</b> — subnet math you can do in your head.`,
          refs: [
            `Read Cloudflare <a href="https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/" target="_blank" rel="noopener">"What is a subnet?"</a>, then do the binary yourself.`,
            `<code>/n</code> = first <i>n</i> bits are the network prefix. <code>/24</code>=256 addrs (254 usable), <code>/16</code>=65,536; each extra bit halves the block. Mask <code>/24</code>=<code>255.255.255.0</code>.`,
            `Memorize the RFC 1918 private ranges: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code> — they're in every VPC/Docker/k8s.`,
          ],
          model: `"Same subnet?" → AND both IPs with the mask; equal ⇒ they talk directly at L2, else traffic goes to the <b>default gateway</b>. That's how your machine decides gateway-vs-direct for every packet.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: run <code>ipcalc 10.20.30.40/22</code> and predict network/broadcast/host-count before it prints them.` },
        { id: "s2", type: "hint", label: `💡 A <code>/32</code> is a single host; a <code>/0</code> is "everything" (the default route). Cloud security groups and route tables are all just CIDR matching.` },
      ],
    },
    {
      id: "d05", date: "2026-07-31", week: "w2", title: "Images, layers & the Dockerfile that actually caches",
      theme: "DevOps · part 2 — an image is a manifest + content-addressed layers.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ②</b> — what a container image really is, and how to build a tiny one.`,
          refs: [
            `Read the <a href="https://github.com/opencontainers/image-spec/blob/main/spec.md" target="_blank" rel="noopener">OCI Image Spec</a> conceptually: an image = a JSON <b>manifest</b> + <b>config</b> + ordered <b>layer</b> blobs, all <b>content-addressed by SHA-256</b> (identical layers stored/pulled once).`,
            `Read Docker <a href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">Multi-stage builds</a> + <a href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">best practices</a>: order steps by change-frequency (deps before source) for cache hits; <code>COPY --from</code> to ship only the built binary.`,
          ],
          model: `Layers stack via <b>OverlayFS</b> (read-only image lowerdir + writable upperdir; a write triggers <b>copy-up</b>). For your Go/Rust binaries, a multi-stage build into <a href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">distroless</a>/<code>scratch</code> = a few-MB image with almost no attack surface.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 That copy-up mechanic is why containers start instantly and why the writable layer is ephemeral — anything you need to keep goes in a volume, not the container fs.` },
        { id: "s2", type: "callout", label: `🔬 An image <i>index</i> (manifest list) maps platforms (amd64/arm64) to manifests — that's multi-arch. Content-addressing is what makes layer caching and dedup work.` },
      ],
    },
    {
      id: "d06", date: "2026-08-02", week: "w2", title: "The B-tree index: how it works, when it hurts",
      theme: "Databases · part 1 — an index is a second, sorted copy kept balanced.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          lead: `<b>Databases ①</b> — the mental model of a B-tree index.`,
          refs: [
            `Read <i>Use The Index, Luke!</i> (free): <a href="https://use-the-index-luke.com/sql/anatomy" target="_blank" rel="noopener">Anatomy of an SQL Index</a> → <a href="https://use-the-index-luke.com/sql/anatomy/the-tree" target="_blank" rel="noopener">The B-Tree</a> → <a href="https://use-the-index-luke.com/sql/anatomy/slow-indexes" target="_blank" rel="noopener">Slow Indexes</a>.`,
            `Leaf nodes are a doubly-linked list (range scans walk sideways); height ~log(N), so billions of rows are 3–5 levels deep.`,
            `Hurts on low-cardinality columns, when a function wraps the column (<code>WHERE lower(email)=…</code> needs an expression index), and every index is <b>write amplification</b>.`,
          ],
          model: `<b>Leftmost-prefix rule:</b> <code>INDEX(a,b,c)</code> serves <code>a</code>, <code>a,b</code>, <code>a,b,c</code> — but NOT <code>b</code> alone. Put equality columns first, then the range/sort column. The #1 composite-index mistake.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 An index is just a second, <i>sorted</i> copy of some columns — great for high-selectivity lookups and <code>ORDER BY</code> (walk leaves, no sort), useless when a predicate matches most rows.` },
        { id: "s2", type: "suggestion", label: `Next Databases day: the query planner (EXPLAIN) — the tool that tells you whether the planner actually chose your index.` },
      ],
    },

    /* ==================== WEEK 3 (4 side-days) ==================== */
    {
      id: "d07", date: "2026-08-03", week: "w3", title: "TCP vs UDP — handshake, flow, congestion, HOL",
      theme: "Networking · part 3 — reliability is a feature you pay for.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          lead: `<b>Networking ③</b> — what TCP does for you, and what UDP leaves to you.`,
          refs: [
            `Read HPBN (free) <a href="https://hpbn.co/building-blocks-of-tcp/" target="_blank" rel="noopener">"Building Blocks of TCP"</a> + <a href="https://hpbn.co/building-blocks-of-udp/" target="_blank" rel="noopener">UDP</a>.`,
            `Own the <b>3-way handshake</b> (SYN/SYN-ACK/ACK), <b>slow-start</b> & congestion avoidance (AIMD), the receive window (flow control), and <b>head-of-line blocking</b>.`,
            `UDP = no handshake/ordering/congestion control — you build reliability yourself (or use QUIC).`,
          ],
          model: `Two different HOL blockings: TCP's byte-stream ordering, and the famous <b>HTTP/2-over-TCP</b> one (a single lost packet stalls all multiplexed streams). The latter is what QUIC/HTTP-3 fixes — and what interviewers usually mean.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: <code>sudo tcpdump -n -i any port 443</code> while you <code>curl https://example.com</code> — watch the real SYN → SYN-ACK → ACK, then the TLS records.` },
        { id: "s2", type: "hint", label: `💡 "Why is a new connection slow?" → handshake RTT + TLS RTT + TCP slow-start ramping the window. Keep-alive and HTTP/2 exist largely to avoid paying that repeatedly.` },
      ],
    },
    {
      id: "d08", date: "2026-08-05", week: "w3", title: "Kubernetes: the reconciliation loop + core objects",
      theme: "DevOps · part 3 — everything in k8s is a controller driving current → desired.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          lead: `<b>DevOps ③</b> — the one mental model that makes all of Kubernetes click.`,
          refs: [
            `Read k8s <a href="https://kubernetes.io/docs/concepts/architecture/controller/" target="_blank" rel="noopener">"Controllers"</a>: a thermostat loop — observe current → compare to <code>.spec</code> → act → repeat, forever (<b>level-triggered</b>, not edge-triggered).`,
            `Skim the core objects: <a href="https://kubernetes.io/docs/concepts/workloads/pods/" target="_blank" rel="noopener">Pod</a>, <a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noopener">Deployment</a>→ReplicaSet→Pod, <a href="https://kubernetes.io/docs/concepts/services-networking/service/" target="_blank" rel="noopener">Service</a> (stable VIP + label selector), <a href="https://kubernetes.io/docs/concepts/services-networking/ingress/" target="_blank" rel="noopener">Ingress</a>, ConfigMap/Secret.`,
          ],
          model: `Controllers act only through the <b>API server</b> (+ etcd = single source of truth), never nodes directly. Desired state is never "done" — a node dies, Pods get rescheduled. Reconciliation is the through-line for GitOps and Terraform too.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Interview gotcha: a k8s <b>Secret is only base64-encoded, not encrypted</b> at rest by default — you must enable encryption-at-rest / a KMS. Almost everyone gets this wrong.` },
        { id: "s2", type: "hint", label: `💡 Deployment→ReplicaSet→Pod is an ownership chain: you edit the Deployment, it creates a new ReplicaSet and scales the old one down (that's a rolling update / rollback).` },
      ],
    },
    {
      id: "d09", date: "2026-08-07", week: "w3", title: "The memory hierarchy & CPU cache",
      theme: "Systems · part 2 — why cache-friendly loops are 10× faster.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 60,
          lead: `<b>Systems ②</b> — locality, cache lines, and why arrays beat linked lists.`,
          refs: [
            `Read CS:APP <b>Ch 6 "The Memory Hierarchy"</b> (registers → L1/L2/L3 → DRAM → disk; locality, cache lines, hit/miss).`,
            `Free alternative: Ulrich Drepper, <a href="https://lwn.net/Articles/250967/" target="_blank" rel="noopener">"What Every Programmer Should Know About Memory"</a> — read the CPU-cache parts (≈ Parts 2–3).`,
          ],
          model: `A cache line is ~64 bytes; row-major traversal is fast because it uses whole lines, pointer-chasing thrashes cache. Memorize the orders of magnitude: L1 ~1ns, main memory ~100ns, SSD ~16µs, network within a DC ~0.5ms.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Callback from d03: a context switch's <i>direct</i> cost (~1–few µs) is often dwarfed by the <i>indirect</i> cost — cold caches + a TLB flush. That's the real reason user-space coroutines are cheap.` },
        { id: "s2", type: "callout", label: `🔬 This is why "data-oriented design" and columnar storage win: pack the bytes you touch together so each cache-line fetch does useful work.` },
      ],
    },
    {
      id: "d10", date: "2026-08-09", week: "w3", title: "EXPLAIN: reading the query planner's mind",
      theme: "Databases · part 2 — estimated vs actual rows is the #1 diagnostic.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          lead: `<b>Databases ②</b> — read a plan and diagnose a slow query.`,
          refs: [
            `Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/using-explain.html" target="_blank" rel="noopener">14.1 "Using EXPLAIN"</a> and UTIL's <a href="https://use-the-index-luke.com/sql/explain-plan/postgresql" target="_blank" rel="noopener">Postgres execution plans</a>.`,
            `Learn to read <b>Seq Scan / Index Scan / Index-Only Scan / Bitmap Heap Scan / Nested Loop vs Hash Join</b>.`,
            `Always use <code>EXPLAIN (ANALYZE, BUFFERS)</code>: a big gap between <i>estimated</i> and <i>actual</i> rows means stale stats (run <code>ANALYZE</code> / raise <code>default_statistics_target</code>).`,
          ],
          model: `The planner is <b>cost-based</b>, not rule-based: it will (correctly) ignore your index when a predicate matches a large fraction of rows, because a sequential scan is cheaper. An unused index isn't always a bug.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: <code>EXPLAIN (ANALYZE, BUFFERS) SELECT …</code> a query with and without a helpful index; watch the plan flip from Seq Scan to Index Scan and the cost drop.` },
        { id: "s2", type: "hint", label: `💡 <b>N+1</b> = 1 query for a list + N queries for each item's relation. Fix by eager-loading / JOIN / <code>IN (…)</code> batch — the most common ORM performance bug.` },
      ],
      note: "End of month 1's first heavy week — Networking + DevOps + Systems + DB all in motion.",
    },

    /* ==================== WEEK 4 ==================== */
    {
      id: "d11", date: "2026-08-11", week: "w4", title: "DNS resolution, end to end",
      theme: "Networking · part 4 — the recursive resolver as middleman.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 40,
          lead: `<b>Networking ④</b> — trace a name to an address, hop by hop.`,
          refs: [
            `Read Cloudflare <a href="https://www.cloudflare.com/learning/dns/what-is-dns/" target="_blank" rel="noopener">"What is DNS?"</a> + <a href="https://www.cloudflare.com/learning/dns/dns-server-types/" target="_blank" rel="noopener">DNS server types</a>.`,
            `The path: stub resolver → <b>recursive resolver</b> → root (13 root-server IPs) → TLD (<code>.com</code>) → authoritative → A/AAAA, with caching (TTL) at every hop.`,
            `Run <code>dig +trace google.com</code> to watch the root→TLD→authoritative delegation live.`,
          ],
          model: `DNS is why "it works on my machine" can be a caching lie: resolvers, the OS, and your app each cache records for the TTL, so a stale A record survives long after you change it.` },
      ],
      soft: [
        { id: "s1", type: "suggestion", label: `Interview-ready: narrate "what happens when you type a URL and hit Enter" — see <a href="https://github.com/alex/what-happens-when" target="_blank" rel="noopener">alex/what-happens-when</a> for the full ARP→DNS→TCP→TLS→HTTP walk.` },
        { id: "s2", type: "hint", label: `💡 Lower TTLs = faster propagation but more resolver traffic; you drop TTLs <i>before</i> a planned migration, then raise them after.` },
      ],
    },
    {
      id: "d12", date: "2026-08-13", week: "w4", title: "k8s scheduling, probes, requests/limits & HPA",
      theme: "DevOps · part 4 — the operational levers you get asked about.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          lead: `<b>DevOps ④</b> — how Pods get placed, kept healthy, and scaled.`,
          refs: [
            `Read the k8s <a href="https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/" target="_blank" rel="noopener">scheduler</a> (filter→score→bind) and <a href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" target="_blank" rel="noopener">liveness/readiness/startup probes</a>.`,
            `Read <a href="https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" target="_blank" rel="noopener">requests/limits</a> and <a href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" target="_blank" rel="noopener">HPA</a>.`,
            `<b>requests</b> = scheduling guarantee; <b>limits</b> = runtime cap (CPU throttled, memory over-limit → OOMKill).`,
          ],
          model: `<b>liveness</b> restarts an unhealthy Pod; <b>readiness</b> removes it from the Service until ready; <b>startup</b> protects slow boots. A failing <i>dependency</i> should flip readiness, not liveness — or you restart-loop a healthy Pod.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ requests≠limits is the root of "noisy neighbour" incidents. Set memory request = limit for predictable OOM behaviour; be careful with CPU limits (throttling adds tail latency).` },
        { id: "s2", type: "hint", label: `💡 HPA scales replica count toward a target metric (CPU/custom). It can't scale below readiness — an unready Pod serves no traffic, so probes and autoscaling are coupled.` },
      ],
    },
    {
      id: "d13", date: "2026-08-15", week: "w4", title: "Security foundations: OWASP 2025 + authn vs authz",
      theme: "Security · part 1 — the vocabulary you're measured against.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 50,
          lead: `<b>Security ①</b> — the risk landscape, and the authn/authz split.`,
          refs: [
            `Skim the <a href="https://owasp.org/Top10/2025/" target="_blank" rel="noopener">OWASP Top 10 (2025 — the current edition)</a>: #1 Broken Access Control, then Security Misconfiguration, Software Supply-Chain Failures, Cryptographic Failures, Injection…`,
            `Read the OWASP <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener">Authentication Cheat Sheet</a>.`,
          ],
          model: `<b>Authentication</b> = who you are; <b>authorization</b> = what you may do. "Broken Access Control" being #1 means most auth bugs are missing <i>authorization</i> checks — forgetting that <i>this</i> user owns <i>this</i> record (IDOR). Every endpoint needs an ownership check, not just a login gate.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Security is threaded through the core (auth → OAuth/JWT → hashing → smart-contract vulns) and lands the capstone in week 12. Today is the map.` },
        { id: "s2", type: "hint", label: `💡 "Security misconfiguration" climbing to #2 is a DevOps overlap: default creds, open S3 buckets, verbose errors, missing headers. Config <i>is</i> attack surface.` },
      ],
      note: "🏁 Month-1 checkpoint week: Networking + DevOps foundations laid, plus Systems, DB and the security map.",
    },

    /* ==================== WEEK 5 ==================== */
    {
      id: "d14", date: "2026-08-17", week: "w5", title: "The TLS 1.3 handshake & PKI",
      theme: "Networking · part 5 — how two strangers agree a secret over a wiretap.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          lead: `<b>Networking ⑤</b> — what actually happens when the padlock appears.`,
          refs: [
            `Read Cloudflare <a href="https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/" target="_blank" rel="noopener">"What happens in a TLS handshake?"</a> (TLS 1.3 is <b>1-RTT</b>, with 0-RTT resumption).`,
            `For the byte level, skim <a href="https://tls13.xargs.org/" target="_blank" rel="noopener">The Illustrated TLS 1.3 Connection</a> (every byte annotated).`,
          ],
          model: `Asymmetric keys are used only to <b>agree a symmetric session key</b>; bulk traffic is symmetric (fast). A cert chain (leaf → intermediate → root CA) proves you're talking to the real server. "Cert expired/unknown authority" is usually a missing intermediate, not a broken key.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <b>SNI</b> in the ClientHello lets one IP host many TLS sites (historically plaintext — a privacy leak ECH addresses). <b>ALPN</b> in the same hello negotiates HTTP/2 vs HTTP/1.1.` },
        { id: "s2", type: "callout", label: `🔗 This is the same crypto you'll meet in the blockchain thread: signatures prove identity, hashes prove integrity. TLS just wires them into a handshake.` },
      ],
    },
    {
      id: "d15", date: "2026-08-19", week: "w5", title: "MVCC: how Postgres lets readers not block writers",
      theme: "Databases · part 3 — every row carries its own version stamps.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          lead: `<b>Databases ③</b> — multi-version concurrency control, and why tables bloat.`,
          refs: [
            `Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/mvcc-intro.html" target="_blank" rel="noopener">Ch 13.1 Concurrency Control (MVCC)</a> + <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">13.2 Transaction Isolation</a>.`,
            `Each row version carries <code>xmin</code>/<code>xmax</code>; each txn sees a <b>snapshot</b>, so readers never block writers and vice-versa.`,
            `Deeper tuple-level detail: Egor Rogov's <a href="https://www.postgrespro.com/blog/pgsql/5967856" target="_blank" rel="noopener">MVCC series</a>.`,
          ],
          model: `An <code>UPDATE</code> is really <i>insert a new row version + mark the old dead</i> — so heavy-update tables bloat and need <b>VACUUM</b>/autovacuum. That single fact explains "my table is 5× its data size."` },
      ],
      soft: [
        { id: "s1", type: "suggestion", label: `Preview: isolation levels are defined by which anomalies they forbid. MVCC snapshots give you Postgres's "Repeatable Read" (= snapshot isolation) for free.` },
        { id: "s2", type: "callout", label: `🔬 MVCC is why long-running transactions are dangerous in Postgres: they hold back the "xmin horizon" so VACUUM can't reclaim dead tuples cluster-wide → bloat.` },
      ],
    },
    {
      id: "d16", date: "2026-08-22", week: "w5", title: "Getting it out the door: deploys, GitOps & 12-factor",
      theme: "DevOps · part 5 — rolling vs blue-green vs canary, and config in the environment.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ⑤</b> — how changes reach production safely.`,
          refs: [
            `Read Martin Fowler <a href="https://martinfowler.com/bliki/BlueGreenDeployment.html" target="_blank" rel="noopener">BlueGreenDeployment</a> + <a href="https://martinfowler.com/bliki/CanaryRelease.html" target="_blank" rel="noopener">CanaryRelease</a> (rolling = k8s default).`,
            `Read the <a href="https://opengitops.dev/" target="_blank" rel="noopener">4 GitOps principles</a> and <a href="https://12factor.net/" target="_blank" rel="noopener">The Twelve-Factor App</a> (esp. III config in env, VI stateless, IX disposability, XI logs to stdout).`,
          ],
          model: `Rolling = incremental replace; blue-green = two environments, flip traffic, instant rollback; canary = small %, watch metrics, ramp. <b>GitOps is the reconciliation loop again</b>: Git holds desired state, an agent (Argo/Flux) converges the cluster to it.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 12-factor XI (logs to stdout, not files) is exactly why your Loki/Promtail stack works — the platform captures the stream. Apps that write their own log files fight the platform.` },
        { id: "s2", type: "hint", label: `💡 Same shape three times now: k8s controllers, GitOps agents, and Terraform's plan/apply-vs-state all reconcile desired → actual. Learn it once, recognize it everywhere.` },
      ],
    },

    /* ==================== WEEK 6 (4 side-days) ==================== */
    {
      id: "d17", date: "2026-08-25", week: "w6", title: "Crypto primitives: hash vs sign vs encrypt, Merkle trees",
      theme: "Blockchain · part 1 — get the three-way distinction exactly right.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ①</b> — the primitives every chain is built from.`,
          refs: [
            `Read <i>Mastering Ethereum</i> (2nd ed, free) <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_4.md" target="_blank" rel="noopener">Ch 4 "Cryptography"</a> and <i>Mastering Bitcoin</i> (3rd ed) <a href="https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch11_blockchain.adoc" target="_blank" rel="noopener">Ch 11</a> (Merkle-tree section).`,
            `The two curves you use: Ethereum/Bitcoin = <b>ECDSA/secp256k1</b> + <b>keccak256</b>; Solana = <b>ed25519 (EdDSA)</b> (<a href="https://datatracker.ietf.org/doc/html/rfc8032" target="_blank" rel="noopener">RFC 8032</a>).`,
          ],
          model: `<b>Hashing</b> = one-way integrity (SHA-256/keccak256); <b>encryption</b> = reversible secrecy; <b>signing</b> = authenticity + non-repudiation. A <b>Merkle tree</b> hashes pairs up to one root, so you can prove one leaf is included with ~log(N) hashes.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Ethereum's state is a <b>Merkle-Patricia trie</b> (four tries: state/storage/tx/receipts) — <a href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/" target="_blank" rel="noopener">ethereum.org</a>. That's how a light client proves a balance without the whole chain.` },
        { id: "s2", type: "hint", label: `💡 keccak256 (Ethereum) ≠ the finalized NIST SHA-3 — a common trick question. Same sponge construction, different padding.` },
      ],
    },
    {
      id: "d18", date: "2026-08-27", week: "w6", title: "HTTP/1.1 → HTTP/2 → HTTP/3 & QUIC",
      theme: "Networking · part 6 — each version fixes the last one's bottleneck.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          lead: `<b>Networking ⑥</b> — why HTTP kept getting rewritten.`,
          refs: [
            `Read HPBN <a href="https://hpbn.co/http1x/" target="_blank" rel="noopener">HTTP/1.X</a> + <a href="https://hpbn.co/http2/" target="_blank" rel="noopener">HTTP/2</a> (persistent connections, why pipelining failed, H2 multiplexing/framing/HPACK).`,
            `For H3/QUIC, read the free <a href="https://http3-explained.haxx.se/" target="_blank" rel="noopener">HTTP/3 explained</a>: reliable multiplexed streams over <b>UDP</b>, TLS 1.3 built in, connection migration.`,
          ],
          model: `H2 fixed HTTP-level HOL blocking (multiplexing) but sits on TCP, so one lost packet still stalls all streams at the transport layer. H3 moves multiplexing into QUIC/UDP so a loss stalls only <i>its</i> stream. That's the whole H2→H3 story.` },
      ],
      soft: [
        { id: "s1", type: "suggestion", label: `Pair with keep-alive/pooling (MDN <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x" target="_blank" rel="noopener">Connection management</a>) — check a client you ship: Go <code>http.Transport.MaxIdleConnsPerHost</code>, Node <code>http.Agent keepAlive</code>.` },
        { id: "s2", type: "hint", label: `💡 HPACK/QPACK header compression is why H2/H3 are efficient for many small requests — H1's repeated plaintext headers were a real cost at scale.` },
      ],
    },
    {
      id: "d19", date: "2026-08-29", week: "w6", title: "Redis internals: why single-threaded is fast",
      theme: "Caching · part 1 — one event loop, atomic commands, no locks.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 50,
          lead: `<b>Caching ①</b> — how one thread does millions of ops/sec.`,
          refs: [
            `Read the Redis <a href="https://redis.io/docs/latest/get-started/faq/" target="_blank" rel="noopener">FAQ</a> (single-thread rationale) + <a href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener">data types</a>.`,
            `Command execution runs on <b>one thread on an event loop</b> → every command is atomic (no client-side locks for <code>INCR</code>/<code>SETNX</code>). Redis 6+ multithreads only network I/O, not command execution.`,
            `Structures by use: sorted sets → leaderboards & sliding-window rate limiting; hashes → objects; streams → event log; HLL → cardinality.`,
          ],
          model: `Redis is memory/network-bound, not CPU-bound. Because it's one loop, a single O(N) command (<code>KEYS *</code>, a huge <code>SMEMBERS</code>/<code>SORT</code>) blocks <i>every</i> client — use <code>SCAN</code>, keep values small, never <code>KEYS</code> in prod.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Directly useful for your prediction game: sorted sets (<code>ZADD</code>/<code>ZRANGEBYSCORE</code>) give you leaderboards and a rate limiter in a handful of atomic ops — no locks, no races.` },
        { id: "s2", type: "callout", label: `🔬 Scale <i>out</i> (Cluster/replicas) or use <b>pipelining</b> to amortize RTT, rather than expecting one instance to use many cores.` },
      ],
    },
    {
      id: "d20", date: "2026-08-30", week: "w6", title: "Isolation levels & the anomalies they prevent",
      theme: "Databases · part 4 — and the one everyone misses: write skew.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 60,
          lead: `<b>Databases ④</b> — map each anomaly to the level that stops it.`,
          refs: [
            `Read DDIA <b>Ch 7 "Weak Isolation Levels"</b> straight through (Read Committed → Snapshot Isolation → Preventing Lost Updates → Write Skew & Phantoms).`,
            `Cross-check PG's <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">13.2 table</a>. Cheat-sheet: dirty read → Read Committed; non-repeatable → Repeatable Read/SI; phantom → Serializable; lost update → SI does NOT stop it (use <code>FOR UPDATE</code>).`,
          ],
          model: `<b>Write skew</b> is the interview-grade one: two txns read an overlapping set, each updates a <i>different</i> row, together breaking an invariant (both on-call doctors go off-call). Snapshot isolation allows it; only Serializable (SSI) stops it. Relevant to any check-then-act in your market settlement.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧠 Postgres names are confusing: PG "Repeatable Read" is actually <b>Snapshot Isolation</b>, and PG never shows dirty reads even at Read Committed.` },
        { id: "s2", type: "hint", label: `💡 Cheapest correctness fix for lost updates: an atomic <code>UPDATE … SET x = x + 1</code> or <code>SELECT … FOR UPDATE</code>, not a read-then-write in app code.` },
      ],
      note: "Month 2 underway — data, HTTP, caching and blockchain now interleaving with DevOps.",
    },

    /* ==================== WEEK 7 ==================== */
    {
      id: "d21", date: "2026-08-31", week: "w7", title: "Observability: golden signals, histograms & why p99",
      theme: "DevOps · part 6 — averages lie; you live at the tail.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          lead: `<b>DevOps ⑥</b> — what to measure, and why percentiles beat averages.`,
          refs: [
            `Read Google SRE (free) <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">Ch 6 "Monitoring Distributed Systems"</a> — the <b>Four Golden Signals</b> (Latency, Traffic, Errors, Saturation).`,
            `Read Prometheus <a href="https://prometheus.io/docs/practices/histograms/" target="_blank" rel="noopener">"Histograms and summaries"</a>: histograms expose <code>_bucket{le=…}</code> so the server computes <code>histogram_quantile(0.99, …)</code> and can aggregate across instances (summaries can't).`,
          ],
          model: `Why p99 not average: the mean is dominated by the bulk; tail latency is what users and fan-out/queued requests feel. One slow dependency in a fan-out makes the tail the effective latency.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ <b>Cardinality trap:</b> a Prometheus series = metric name + every label combo. Put a user/request ID or full URL in a label and you get a series explosion that OOMs the server. Labels must be bounded.` },
        { id: "s2", type: "hint", label: `💡 Three lenses: <b>Golden Signals</b> (services) ≈ <b>RED</b> (Rate/Errors/Duration) + Saturation; <b>USE</b> (Utilization/Saturation/Errors) for resources (the load-testing day).` },
      ],
    },
    {
      id: "d22", date: "2026-09-03", week: "w7", title: "Inside the EVM: stack machine, storage, gas",
      theme: "Blockchain · part 2 — what your Solidity actually compiles down to.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 60,
          lead: `<b>Blockchain ②</b> — the machine your contracts run on.`,
          refs: [
            `Read <i>Mastering Ethereum</i> <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_14.md" target="_blank" rel="noopener">Ch 14 "The EVM"</a> and explore <a href="https://www.evm.codes/" target="_blank" rel="noopener">evm.codes</a> (per-opcode gas + live playground).`,
            `The EVM is a <b>stack machine</b> (1024-deep, 256-bit words). Three data locations: <b>storage</b> (persistent, expensive, in the state trie), <b>memory</b> (per-call, cheap, wiped), <b>calldata</b> (read-only input).`,
          ],
          model: `Every opcode costs <b>gas</b>; <code>SSTORE</code> is the pricey one (cold vs warm, EIP-2929). The account model: <b>EOA</b> (key-controlled) vs <b>contract account</b> (code + storage) — every state change starts from an EOA-signed tx.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: paste a few opcodes into the <a href="https://www.evm.codes/playground" target="_blank" rel="noopener">evm.codes playground</a> and single-step — watch the stack push/pop and gas tick down. Best way to make "stack machine" click.` },
        { id: "s2", type: "hint", label: `💡 Gas is a metering + anti-DoS mechanism: you pre-pay a gas limit; unused gas is refunded, running out reverts state but still costs the gas burned. It's the EVM's answer to the halting problem.` },
      ],
    },
    {
      id: "d23", date: "2026-09-05", week: "w7", title: "Message queues vs logs — the core distinction",
      theme: "Messaging · part 1 — delete-on-ack vs retain-and-offset.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 55,
          lead: `<b>Messaging ①</b> — the distinction that unlocks all of streaming.`,
          refs: [
            `Read DDIA <b>Ch 11</b> "Messaging Systems" → "Partitioned Logs", plus Jay Kreps' <a href="https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying" target="_blank" rel="noopener">"The Log"</a>.`,
            `<b>Queue/broker</b> (RabbitMQ, SQS): message deleted on ack, load-balanced across competing consumers, weak ordering. <b>Log</b> (Kafka): append-only, retained, each consumer tracks its own <b>offset</b> — replayable, ordered within a partition.`,
          ],
          model: `"RabbitMQ or Kafka?" → task/RPC work with per-message ack/priority/TTL → broker/queue; event streaming, replay, multiple independent consumers, high throughput → log/Kafka. The axis is delete-on-ack vs retain-with-offset.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 A log is the primitive behind replication, CDC, and stream processing — the point of Kreps' essay. Postgres's WAL (next DB day) is literally the same idea inside one database.` },
        { id: "s2", type: "hint", label: `💡 SQS Standard = at-least-once + best-effort order; SQS FIFO = ordered + dedup, lower throughput. "Exactly-once" almost always means at-least-once + idempotency (later this thread).` },
      ],
    },

    /* ==================== WEEK 8 ==================== */
    {
      id: "d24", date: "2026-09-08", week: "w8", title: "Load balancers (L4 vs L7), reverse proxies & CDNs",
      theme: "Networking · part 7 — what nginx and your ALB really do.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          lead: `<b>Networking ⑦</b> — the boxes between the client and your app.`,
          refs: [
            `Read Cloudflare on <a href="https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/" target="_blank" rel="noopener">reverse proxies</a> + <a href="https://www.cloudflare.com/learning/cdn/what-is-a-cdn/" target="_blank" rel="noopener">CDNs</a>.`,
            `<b>L4 LB</b> "moves packets" (routes by IP/port, can't read URLs — NLB, IPVS, HAProxy TCP). <b>L7 LB</b> "reads requests" (route <code>/api</code> vs <code>/img</code>, terminate TLS, sticky sessions — nginx, Envoy, ALB).`,
            `A <b>reverse proxy</b> does TLS termination, caching, compression, buffering, hides the origin; a <b>CDN</b> is edge caches near users.`,
          ],
          model: `"Terminate TLS at the edge" = the L7 proxy/LB decrypts and talks plain HTTP to backends, centralizing certs and offloading crypto. Contrast with TLS passthrough (backend terminates) and re-encryption.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: write a 20-line nginx config with an <code>upstream {}</code> block and <code>proxy_pass</code> to two backends — you'll learn more from that than any article.` },
        { id: "s2", type: "hint", label: `💡 Rule of thumb: L4 for raw throughput / non-HTTP; L7 when routing decisions need application data (path, headers, cookies).` },
      ],
    },
    {
      id: "d25", date: "2026-09-11", week: "w8", title: "OAuth 2.0, OIDC, PKCE & JWT the right way",
      theme: "Security · part 2 — and the alg:none footgun.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 60,
          lead: `<b>Security ②</b> — the modern auth flow, and how tokens get forged.`,
          refs: [
            `Read the OAuth <a href="https://www.rfc-editor.org/rfc/rfc6749" target="_blank" rel="noopener">RFC 6749</a> authorization-code flow + <a href="https://www.rfc-editor.org/rfc/rfc7636" target="_blank" rel="noopener">PKCE (RFC 7636)</a>, and PortSwigger's <a href="https://portswigger.net/web-security/jwt" target="_blank" rel="noopener">JWT attacks</a>.`,
            `<b>Authorization Code + PKCE</b> is the modern default for all client types: send <code>code_challenge=S256(code_verifier)</code> up front, the raw verifier on the back channel, so a stolen code is useless.`,
          ],
          model: `For JWT: pin the expected <code>alg</code> <b>server-side</b>; never trust the token's <code>alg</code> header. The <b>alg:none</b> attack drops the signature; the RS256→HS256 confusion attack signs with the public key as an HMAC secret. Treat accepted algorithms as an allowlist.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ <b>alg:none</b>: an attacker sets the header algorithm to "none" and drops the signature; a naive verifier that reads <code>alg</code> from the token trusts unsigned data. Reject <code>none</code> and its case variants.` },
        { id: "s2", type: "hint", label: `💡 Access token vs ID token: OAuth 2.0 is <i>authorization</i> (access tokens for APIs); OIDC adds <i>authentication</i> (the ID token = who the user is). Don't use an ID token as an API access token.` },
      ],
    },
    {
      id: "d26", date: "2026-09-13", week: "w8", title: "Locking, deadlocks & the write-ahead log",
      theme: "Databases · part 5 — log the change before you touch the page.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          lead: `<b>Databases ⑤</b> — how the DB stays correct under contention and crashes.`,
          refs: [
            `Read PG docs <a href="https://www.postgresql.org/docs/current/explicit-locking.html" target="_blank" rel="noopener">13.3 "Explicit Locking"</a> (row/table modes, the conflict matrix, <b>deadlock</b> detection via the waits-for graph + <code>deadlock_timeout</code>).`,
            `Read <a href="https://www.postgresql.org/docs/current/wal-intro.html" target="_blank" rel="noopener">Ch 30 "Write-Ahead Log"</a>: append the change to the log (fsync'd) <i>before</i> modifying the data page, so a crash can redo.`,
          ],
          model: `App-level deadlock prevention is mostly <b>consistent lock ordering</b> — if every txn locks in the same order, cycles can't form. WAL also doubles as the replication + point-in-time-recovery stream (same "log" idea as Kafka).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 <code>synchronous_commit</code>/<code>fsync</code> are the durability dial: <code>fsync=off</code> is fast and loses data on crash — the same page-cache/fsync tension from the OS layer. Durability = "actually on disk," not "write() returned."` },
        { id: "s2", type: "hint", label: `💡 Postgres kills one victim on deadlock and raises an error — so wrap contended transactions in a retry. Deadlocks are expected under load, not a bug to eliminate entirely.` },
      ],
    },

    /* ==================== WEEK 9 ==================== */
    {
      id: "d27", date: "2026-09-14", week: "w9", title: "Solana's account model — everything is an account",
      theme: "Blockchain · part 3 — stateless programs + separate data accounts.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ③</b> — the mental flip from the EVM.`,
          refs: [
            `Read Solana docs <a href="https://solana.com/docs/core/accounts" target="_blank" rel="noopener">Accounts</a> + <a href="https://solana.com/docs/core/programs" target="_blank" rel="noopener">Programs</a>.`,
            `<b>Programs are stateless</b> (executable accounts holding sBPF bytecode); all mutable state lives in <b>separate data accounts</b> a transaction must pass in. Accounts pay <b>rent</b> (must be rent-exempt).`,
            `Side-by-side: <a href="https://solana.com/developers/evm-to-svm/accounts" target="_blank" rel="noopener">EVM→SVM: Accounts</a>.`,
          ],
          model: `Contrast with Ethereum's "contract = code + its own storage." Because state is external, Solana instructions must list every account they read/write up front — the constraint that later buys parallelism (Sealevel).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Rent-exemption is a real footgun: an account below the minimum balance can be purged. When you allocate a PDA, fund it for its data size.` },
        { id: "s2", type: "hint", label: `💡 "Everything is an account" includes programs, token mints, and your data — a uniform model that makes the runtime simple but forces explicit account passing everywhere.` },
      ],
    },
    {
      id: "d28", date: "2026-09-16", week: "w9", title: "SLIs, SLOs, error budgets & tracing",
      theme: "DevOps · part 7 — turn reliability into a number you can spend.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          lead: `<b>DevOps ⑦</b> — reliability as an engineering budget, plus how traces stitch together.`,
          refs: [
            `Read Google SRE <a href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">Ch 4 "Service Level Objectives"</a> + the error-budget part of <a href="https://sre.google/sre-book/embracing-risk/" target="_blank" rel="noopener">Ch 3 "Embracing Risk"</a>.`,
            `Read OpenTelemetry <a href="https://opentelemetry.io/docs/concepts/signals/traces/" target="_blank" rel="noopener">Traces</a>.`,
            `<b>SLI</b> = measured level (e.g. % requests < 300 ms); <b>SLO</b> = target (99.9%/28d); <b>error budget</b> = 1 − SLO (99.9% ⇒ ~43 min/month).`,
          ],
          model: `Budget remaining → ship features; budget spent → freeze risky changes. Don't be <i>more</i> reliable than the SLO needs — excess reliability has real opportunity cost, and users can't tell. 100% is the wrong target.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Tracing under the hood: a trace = a tree of spans; a <b>W3C <code>traceparent</code></b> header carries the trace/span IDs across service boundaries so downstream spans join the same trace. That header is the whole magic.` },
        { id: "s2", type: "hint", label: `💡 SLA vs SLO: an SLA is a <i>contract</i> with consequences; your internal SLO should be tighter, so you notice and fix before you breach the SLA.` },
      ],
    },
    {
      id: "d29", date: "2026-09-19", week: "w9", title: "How a server accepts 10k connections: epoll & the event loop",
      theme: "Systems · part 3 — the pattern behind nginx, Node, tokio & Go's netpoller.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          lead: `<b>Systems ③</b> — the I/O model that scales past thread-per-connection.`,
          refs: [
            `Read Dan Kegel's <a href="http://www.kegel.com/c10k.html" target="_blank" rel="noopener">The C10K problem</a> for the model (thread-per-connection vs <code>select</code>/<code>poll</code> vs <b>epoll</b>, edge- vs level-triggered).`,
            `The modern pattern: a few event-loop threads each call <code>epoll_wait()</code> for ready fds, then do <b>non-blocking</b> <code>accept</code>/<code>read</code>/<code>write</code>.`,
          ],
          model: `That's nginx (worker per core), Node (loop + libuv pool), Netty, tokio, and Go's netpoller (hidden behind blocking-looking goroutines). Four axes people muddle: blocking vs non-blocking vs sync vs async (kernel does the work, notifies on completion — io_uring).` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: <code>strace -e epoll_wait,accept4,read -f</code> against a small server and watch the loop pull ready fds. The abstraction becomes concrete in 5 minutes.` },
        { id: "s2", type: "hint", label: `💡 Your async runtime = non-blocking syscalls + an event loop presenting an async API. That's why "async" and "threads" aren't opposites — async is <i>how</i> a few threads serve many connections.` },
      ],
    },

    /* ==================== WEEK 10 ==================== */
    {
      id: "d30", date: "2026-09-22", week: "w10", title: "A transaction's life & EIP-1559 fees",
      theme: "Blockchain · part 4 — base fee burned, tip to the proposer.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ④</b> — from signed bytes to state change, and how fees are set.`,
          refs: [
            `Read <i>Mastering Ethereum</i> <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_6.md" target="_blank" rel="noopener">Ch 6 "Transactions"</a> and <a href="https://eips.ethereum.org/EIPS/eip-1559" target="_blank" rel="noopener">EIP-1559</a>.`,
            `A tx carries nonce, gas fields, to/value/data, signature (RLP-encoded).`,
            `<b>EIP-1559</b>: blocks target 50% fullness (elasticity 2); the <b>base fee</b> adjusts ≤12.5%/block and is <b>burned</b>; a <b>tip</b> goes to the proposer.`,
          ],
          model: `Cite the invariants — <b>elasticity 2</b> (50% target) and <b>max ±12.5%/block</b> base-fee change — NOT "15M/30M gas" (historical mainnet values, not protocol constants). A type-2 tx sets <code>max_fee</code> + <code>max_priority_fee</code> and is refunded the difference.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 Calldata is priced per byte (cheap-ish) while <code>SSTORE</code> is expensive — exactly why rollups post compressed calldata/blobs to L1 instead of storage. Ties your gas intuition to why L2s are cheaper.` },
        { id: "s2", type: "hint", label: `💡 The nonce is per-account and strictly sequential — it's what prevents replay and enforces ordering of your own txs. A stuck low-nonce tx blocks all higher ones ("nonce gap").` },
      ],
    },
    {
      id: "d31", date: "2026-09-24", week: "w10", title: "Kafka's model: partitions, offsets, consumer groups, ISR",
      theme: "Messaging · part 2 — the unit of parallelism is the partition.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 55,
          lead: `<b>Messaging ②</b> — Kafka's core model and durability knobs.`,
          refs: [
            `Read <i>Kafka: The Definitive Guide</i> (2nd ed, <a href="https://www.confluent.io/resources/kafka-the-definitive-guide-v2/" target="_blank" rel="noopener">free from Confluent</a>) Ch 1 + the internals/reliability chapters.`,
            `A <b>topic</b> splits into <b>partitions</b> (parallelism + ordering); each record has a monotonic <b>offset</b>; a <b>consumer group</b> assigns each partition to exactly one member (parallelism ≤ partition count).`,
            `Durability: replicas (leader + followers); <b>ISR</b> = replicas caught up to the leader. <code>acks=all</code> + <code>min.insync.replicas=2</code> ⇒ durable once all ISR have it.`,
          ],
          model: `Ordering is guaranteed only <i>within a partition</i>. For per-entity order (all events for one user/market in order), key by that entity so they land in the same partition.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ More consumers than partitions = idle consumers (nothing to assign). Partition count is your parallelism ceiling and is painful to change later — size it deliberately.` },
        { id: "s2", type: "hint", label: `💡 "Kafka is a database you tail": consumers store their own offset, so two independent services read the same topic at their own pace and can replay from offset 0.` },
      ],
    },
    {
      id: "d32", date: "2026-09-27", week: "w10", title: "Review: Rust ownership & the borrow checker",
      theme: "Review · a deliberate re-grounding in a hard model you already use.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          lead: `<b>Review</b> — re-derive the model under your Solana/Anchor work.`,
          refs: [
            `Re-read <i>The Rust Book</i> <a href="https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html" target="_blank" rel="noopener">Ch 4 "Understanding Ownership"</a> (move/borrow/lifetimes).`,
            `Without looking, explain aloud: why can't a <code>&mut</code> coexist with any other borrow? What does a lifetime annotation actually constrain?`,
            `Write three snippets that <i>fail</i> to compile and predict the exact borrow-checker error before running.`,
          ],
          model: `Ownership makes "who frees this and when" a <b>compile-time</b> fact; the borrow checker enforces "many readers XOR one writer" → no data race, no use-after-free. Everything else (lifetimes, <code>&mut</code>) serves that.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🧭 Review tasks recur occasionally (Rust here; C++ threads, Go's scheduler, Python's GIL later) — short, forced re-derivations of hard concepts in languages you already ship.` },
        { id: "s2", type: "hint", label: `💡 The "many readers XOR one writer" rule is the same invariant a RwLock enforces at runtime — Rust just checks it at compile time for references. Same idea, zero cost.` },
      ],
    },

    /* ==================== WEEK 11 ==================== */
    {
      id: "d33", date: "2026-09-28", week: "w11", title: "Cache patterns, the stampede & invalidation",
      theme: "Caching · part 2 — the hard part isn't caching, it's invalidating.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 50,
          lead: `<b>Caching ②</b> — patterns, persistence, and surviving a hot-key expiry.`,
          refs: [
            `Read AWS <a href="https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html" target="_blank" rel="noopener">caching patterns</a> (cache-aside vs write-through vs write-behind) and the Redis <a href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">eviction</a> + <a href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">persistence (RDB/AOF)</a> pages.`,
            `Handle the <b>stampede/thundering herd</b> (hot key expires → thousands of misses hit the DB) with single-flight/request-coalescing, a per-key lock (<code>SET k v NX PX ttl</code>), stale-while-revalidate, and <b>TTL jitter</b>.`,
          ],
          model: `Prefer <b>delete-on-write</b> over update to avoid caching a value a concurrent write races. Eviction: <code>allkeys-lru/lfu</code> for a pure cache, <code>volatile-*</code> when you mix cache + persistent keys (Redis uses <i>sampled</i>, not exact, LRU/LFU).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔬 RDB (periodic fork+snapshot; can lose minutes) vs AOF (<code>appendfsync everysec</code> ≈ lose ≤1s). Run both. The fork uses copy-on-write — big instances spike memory during a save.` },
        { id: "s2", type: "hint", label: `💡 "Only two hard things… cache invalidation" — design keys so invalidation is a single <code>DEL</code> or a version-bump, never a scan.` },
      ],
    },
    {
      id: "d34", date: "2026-09-30", week: "w11", title: "Sealevel, PDAs & CPIs — Solana's parallel runtime",
      theme: "Blockchain · part 5 — why declaring accounts up front buys parallelism.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ⑤</b> — the runtime, program addresses, and cross-program calls.`,
          refs: [
            `Read Solana docs <a href="https://solana.com/docs/core/pda" target="_blank" rel="noopener">PDAs</a> + <a href="https://solana.com/docs/core/cpi" target="_blank" rel="noopener">CPIs</a> + <a href="https://solana.com/docs/core/fees/compute-budget" target="_blank" rel="noopener">Compute Budget</a>, and the <a href="https://docs.anza.xyz/validator/runtime" target="_blank" rel="noopener">Sealevel runtime</a>.`,
            `Because every instruction declares the accounts it reads/writes, the runtime executes non-overlapping txs <b>in parallel</b> (writes serialized per account, reads parallel).`,
            `<b>PDAs</b> = deterministic off-curve program-owned addresses (signed via <code>invoke_signed</code>); <b>CPIs</b> = one program calling another; CU: 200K default/instr, 1.4M max/tx.`,
          ],
          model: `EVM↔SVM in one line: Ethereum executes txs <i>sequentially</i> (global state, implicit access); Solana executes them <i>in parallel</i> by forcing explicit account declarations. Everything odd about Solana dev flows from that trade.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Currency note: Solana's classic consensus is PoH + Tower BFT, but a new design ("Alpenglow") is landing in 2026 — know Tower BFT as the deployed model, and that it's being superseded.` },
        { id: "s2", type: "hint", label: `💡 Priority fee = <code>compute_unit_price × compute_unit_limit</code>. Set a tight CU limit and a price to land in a congested block — the Solana analogue of an EIP-1559 tip.` },
      ],
    },
    {
      id: "d35", date: "2026-10-03", week: "w11", title: "Load & stress testing without fooling yourself",
      theme: "DevOps · part 8 — coordinated omission and the USE method.",
      tasks: [
        { id: "t1", obj: OPS, cat: "watch", est: 55,
          lead: `<b>DevOps ⑧</b> — why most load tests lie, and how to measure honestly.`,
          refs: [
            `Watch Gil Tene, <a href="https://www.youtube.com/watch?v=lJ8ydIuPFeU" target="_blank" rel="noopener">"How NOT to Measure Latency" (Strange Loop, ~43 min)</a> (coordinated omission ~33:50).`,
            `Read Brendan Gregg's <a href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">USE Method</a>: for each resource check Utilization, Saturation, Errors.`,
            `Tool axis: <code>ab</code>/<code>wrk</code> are closed-loop (throughput-driven, prone to CO); <code>vegeta</code>/<code>k6</code> can hold a fixed arrival rate (open-loop).`,
          ],
          model: `<b>Coordinated omission</b>: a load tool that waits for a slow response before sending the next request silently deletes the worst samples — making the tail look great when it's awful. Drive a <b>constant arrival rate</b> and report from full distributions (HdrHistogram), not averages.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: run <code>k6</code> against a service with a p99 <code>threshold</code>; then add a 200ms stall to 1% of responses and watch p99 (not the average) catch it.` },
        { id: "s2", type: "hint", label: `💡 Capacity is about headroom, not a single number: high utilization with <i>no</i> saturation can be fine; <i>any</i> saturation (a growing queue/run-queue) usually means a real problem.` },
      ],
    },

    /* ==================== WEEK 12 ==================== */
    {
      id: "d36", date: "2026-10-06", week: "w12", title: "Consensus: PoW, longest chain & what 'finality' means",
      theme: "Blockchain · part 6 — agreement without a coordinator.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          lead: `<b>Blockchain ⑥</b> — how a decentralized network agrees on one history.`,
          refs: [
            `Read <i>Mastering Bitcoin</i> (3rd ed) <a href="https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch12_mining.adoc" target="_blank" rel="noopener">Ch 12 "Mining and Consensus"</a> (PoW, difficulty, best chain = most cumulative work).`,
            `Read ethereum.org <a href="https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/gasper/" target="_blank" rel="noopener">Gasper</a> (Casper FFG finality + LMD-GHOST fork choice) and Vitalik's <a href="https://blog.ethereum.org/2016/05/09/on-settlement-finality" target="_blank" rel="noopener">"On Settlement Finality"</a>.`,
          ],
          model: `PoW finality is <b>probabilistic</b> (more confirmations = exponentially safer); PoS adds <b>economic finality</b> (revert costs slashed stake). Reorgs happen — "finality" is a spectrum, not a switch.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 CAP-flavoured trade-off: a chain can't have instant finality, full availability, and permissionless decentralization at once — different chains pick different points. Beats memorizing any single algorithm.` },
        { id: "s2", type: "callout", label: `🔬 Solana's PoH gives a verifiable clock so validators needn't agree on time before ordering — a different answer to the same "who decides order" question.` },
      ],
    },
    {
      id: "d37", date: "2026-10-08", week: "w12", title: "Password hashing, sessions vs tokens & TLS recap",
      theme: "Security · part 3 — store secrets like they'll be stolen.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 45,
          lead: `<b>Security ③</b> — credential storage and session design, done right.`,
          refs: [
            `Read the OWASP <a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener">Password Storage</a> + <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener">Session Management</a> cheat sheets.`,
            `Use <b>Argon2id</b> (min m=19 MiB, t=2, p=1) for new systems; <b>bcrypt</b> (cost ≥10) is legacy-only and caps input at 72 bytes.`,
            `Sessions vs tokens: server-side session ids in <code>Secure; HttpOnly; SameSite</code> cookies vs stateless JWTs — and never store tokens in <code>localStorage</code> (XSS reads it).`,
          ],
          model: `Passwords are <b>hashed</b> (one-way, slow, salted) — not encrypted, never home-rolled. "Slow" is the point: it caps an attacker's guesses/sec. Fast hashes (SHA-256) are wrong for passwords.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🔗 Callback to the TLS day: the same PKI trust chain protects these credentials in transit; hashing protects them at rest. Both, always.` },
        { id: "s2", type: "hint", label: `💡 <code>SameSite=Lax/Strict</code> cookies are your cheapest CSRF defense; <code>HttpOnly</code> keeps JS (and XSS) from reading the session — which is exactly why JWTs in localStorage are worse, not better.` },
      ],
    },
    {
      id: "d38", date: "2026-10-10", week: "w12", title: "🎓 Capstone: smart-contract security — reentrancy & oracle manipulation",
      theme: "Security · part 4 — the two bug classes that drain DeFi, in your domain.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 60,
          lead: `<b>Security ④ (capstone)</b> — the vulnerabilities most relevant to your FPMM/LMSR market.`,
          refs: [
            `Read the Solidity docs <a href="https://docs.soliditylang.org/en/latest/security-considerations.html" target="_blank" rel="noopener">Security Considerations</a> (checks-effects-interactions) and samczsun's <a href="https://samczsun.com/so-you-want-to-use-a-price-oracle/" target="_blank" rel="noopener">"So you want to use a price oracle"</a>.`,
            `<b>Reentrancy</b>: any external call hands control to the callee <i>before</i> your state settles → do Checks → Effects → <b>Interactions last</b>, or use a <code>nonReentrant</code> mutex; beware read-only reentrancy (a view returns wrong data mid-write — the Curve case).`,
            `<b>Oracle manipulation</b>: on-chain spot prices are attacker-controllable within a tx (flash loans) → use TWAPs / robust feeds.`,
          ],
          model: `Checks-Effects-Interactions in one line: validate, then write ALL state, then make external calls — so a re-entrant call always sees finalized state. OZ <code>ReentrancyGuard</code> is a storage flag that reverts on re-entry.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `🏁 Core complete. From here the extension goes <i>deeper under the hood</i> — Postgres vacuum/TOAST, Kafka exactly-once internals, ZK/rollups & MEV, Rust async internals, eBPF/perf — planned separately so nothing here gets re-dated.` },
        { id: "s2", type: "hint", label: `💡 The through-line of the whole security thread: never trust input you didn't verify — an <code>alg</code> header, a spot price, or the timing of an external call are all "input". Verify, then act.` },
      ],
      note: "🎓 12-week core finished — the essentials a backend/blockchain engineer is expected to own.",
    },
  ],

  milestones: [
    { id: "w4.m1", week: "w4", title: "Month 1 — Networking + DevOps foundations",
      rule: { type: "tasks", require: ["d01.t1", "d02.t1", "d07.t1", "d08.t1", "d11.t1", "d12.t1"] } },
    { id: "w8.m1", week: "w8", title: "Month 2 — data layer, HTTP, blockchain & security basics",
      rule: { type: "tasks", require: ["d15.t1", "d17.t1", "d20.t1", "d22.t1", "d24.t1", "d25.t1"] } },
    { id: "w12.m1", week: "w12", title: "🎓 Core complete — the essentials owned",
      rule: { type: "tasks", require: ["d34.t1", "d36.t1", "d37.t1", "d38.t1"] } },
  ],

  features: [
    { title: "How this track works", items: [
      `Each domain is an ordered <b>thread</b>; threads are <b>interleaved</b> across days, so consecutive side-days switch topics but each thread advances in order.`,
      `Progress, streak and effort are <b>separate from your main roadmaps</b> — only the Today panel's "Main + Side" line combines them.`,
      `After this 12-week core, an <b>extension</b> continues deeper "under the hood" (finalized separately) — the threads pick up exactly where they left off.`,
    ] },
  ],
});
