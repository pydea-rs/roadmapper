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
// References are hand-picked and were link/chapter verified (2026-07-18). Book
// citations give chapter/section (page numbers drift across editions and are
// omitted rather than guessed). Where no single source teaches a concept cleanly,
// the task/soft-note teaches it directly with a backing link. Edition notes:
// Mastering Bitcoin = 3rd ed, Mastering Ethereum = 2nd ed, DDIA = 1st ed,
// Kafka: The Definitive Guide = 2nd ed (free from Confluent), OWASP Top 10 = 2025.

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
          label: `<b>Networking ①.</b> Learn the layering model <i>honestly</i>. Read Cloudflare <a href="https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/" target="_blank" rel="noopener">"What is the OSI Model?"</a> for the diagram — then correct it: the internet runs the <b>TCP/IP</b> model (Link → Internet → Transport → Application); OSI layers 5–6 have no real counterpart. The point is <b>encapsulation</b>: a packet is <code>[Ethernet [IP [TCP [HTTP]]]]</code>; going down adds headers, up strips them. "L7 load balancer / L4 firewall / L3 switch" just names <i>which header the box inspects</i>.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The cargo-cult mistake is reciting all 7 OSI layers as if each is real and present in every packet. They aren't. Interview answer: "encapsulation + which header a device reads," not "Please Do Not Throw Sausage Pizza Away."` },
        { id: "s2", type: "callout", label: `🧭 This is thread <b>Networking</b>, part 1 of 7 in the core. Each time Networking reappears it picks up where it left off (subnets → TCP → DNS → TLS → HTTP → load balancers).` },
      ],
      note: "Bedrock begins. 2–3 short days a week, one topic each — separate from your main roadmaps.",
    },
    {
      id: "d02", date: "2026-07-23", week: "w1", title: "What a container actually is",
      theme: "DevOps · thread part 1 — a container is a Linux process with a restricted view, not a VM.",
      tasks: [
        { id: "t1", obj: OPS, cat: "watch", est: 45,
          label: `<b>DevOps ①.</b> Watch Liz Rice, <a href="https://www.youtube.com/watch?v=8fi7uSYlOdc" target="_blank" rel="noopener">"Containers From Scratch" (GOTO 2018, ~43 min)</a> — she live-codes a container in Go from raw <code>clone()</code> + namespaces + <code>chroot</code> + cgroups. Takeaway: there is <b>no "container" object in the kernel</b>. <b>Namespaces</b> limit what a process can <i>see</i> (PID, mount, net, UTS, IPC, user); <b>cgroups</b> limit what it can <i>use</i> (CPU, memory, IO). That's the whole trick.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 A VM virtualizes hardware and runs its own kernel; a container shares the host kernel. Lighter, but a weaker isolation boundary — why "container escape" is a real threat and a VM boundary is stronger.` },
        { id: "s2", type: "callout", label: `🔧 DevOps is a first-class, first-month thread here (Docker → Kubernetes → CI/CD → observability → load testing). "Containers" in this roadmap means the whole real stack, not just <code>docker run</code>.` },
      ],
    },
    {
      id: "d03", date: "2026-07-25", week: "w1", title: "Processes vs threads vs coroutines",
      theme: "Systems · thread part 1 — who schedules it, and what's shared.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          label: `<b>Systems ①.</b> Read OSTEP (free) <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">Ch 4 "The Abstraction: The Process"</a> + <b>Ch 26 "Concurrency: Threads"</b>. Then map it to your stack: <b>process</b> = own address space + fds (expensive switch); <b>OS thread</b> = shares address space, own stack/registers, <i>kernel</i>-scheduled preemptively; <b>coroutine/goroutine/async task</b> = <i>user-space</i> scheduled, no syscall to switch, cooperative — Go goroutines (M:N), Rust <code>async</code>/tokio & Python <code>asyncio</code> (stackless), Node (single loop + libuv pool).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The load-bearing distinction is <b>who schedules it</b> (kernel vs runtime) and <b>what's shared</b> (address space). That single sentence answers most "goroutine vs thread" interview questions.` },
        { id: "s2", type: "suggestion", label: `Tie-in for later: coroutines are cheap precisely because they skip the kernel context switch (and often the TLB flush) — we'll quantify that cost when Systems reaches CPU caches.` },
      ],
    },

    /* ==================== WEEK 2 ==================== */
    {
      id: "d04", date: "2026-07-28", week: "w2", title: "IP addressing, subnets & CIDR",
      theme: "Networking · part 2 — stop CIDR from being magic.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          label: `<b>Networking ②.</b> Read Cloudflare <a href="https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/" target="_blank" rel="noopener">"What is a subnet?"</a>, then do the binary math yourself: an IPv4 addr is 32 bits; <code>/n</code> = first <i>n</i> bits are the network prefix. <code>/24</code>=256 addrs (254 usable), <code>/16</code>=65,536; each extra bit halves the block. Mask = prefix as an address (<code>/24</code>=<code>255.255.255.0</code>). Memorize RFC 1918 private ranges: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code> — they're in every VPC/Docker/k8s setup.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 "Same subnet?" → AND both IPs with the mask; equal ⇒ they talk directly at L2, else traffic goes to the <b>default gateway</b>. That's literally how your machine decides gateway-vs-direct for every packet.` },
        { id: "s2", type: "tryout", label: `Tryout: run <code>ipcalc 10.20.30.40/22</code> (or any CIDR calculator) and predict the network/broadcast/host-count before it prints them.` },
      ],
    },
    {
      id: "d05", date: "2026-07-31", week: "w2", title: "Images, layers & the Dockerfile that actually caches",
      theme: "DevOps · part 2 — an image is a manifest + content-addressed layers.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          label: `<b>DevOps ②.</b> Read the <a href="https://github.com/opencontainers/image-spec/blob/main/spec.md" target="_blank" rel="noopener">OCI Image Spec</a> conceptually (manifest + config + layers) and Docker <a href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">Multi-stage builds</a> + <a href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">best practices</a>. Model: an image = a JSON <b>manifest</b> + <b>config</b> + ordered <b>layer</b> blobs, all <b>content-addressed by SHA-256</b> (identical layers stored/pulled once). Layers stack via <b>OverlayFS</b>. Order Dockerfile steps by change-frequency (deps before source) for cache hits; <code>COPY --from</code> to ship only the built binary into a tiny final stage.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 For your Go/Rust services: a multi-stage build with a <code>FROM scratch</code> or <a href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">distroless</a> final stage yields a few-MB image with almost no attack surface. That's the single biggest image-size/security lever.` },
        { id: "s2", type: "callout", label: `🔬 Under the hood: OverlayFS unifies a read-only <b>lowerdir</b> (image) and a writable <b>upperdir</b> (container layer); a write triggers <b>copy-up</b>. That's why containers start instantly and why the writable layer is ephemeral.` },
      ],
    },
    {
      id: "d06", date: "2026-08-02", week: "w2", title: "The B-tree index: how it works, when it hurts",
      theme: "Databases · part 1 — an index is a second, sorted copy kept balanced.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 50,
          label: `<b>Databases ①.</b> Read <i>Use The Index, Luke!</i> (free) <a href="https://use-the-index-luke.com/sql/anatomy" target="_blank" rel="noopener">"Anatomy of an SQL Index"</a> → <a href="https://use-the-index-luke.com/sql/anatomy/the-tree" target="_blank" rel="noopener">The B-Tree</a> → <a href="https://use-the-index-luke.com/sql/anatomy/slow-indexes" target="_blank" rel="noopener">Slow Indexes</a>. Model: leaf nodes are a doubly-linked list (range scans walk sideways); height ~log(N) so billions of rows are 3–5 levels deep. Helps for high-selectivity equality/range and <code>ORDER BY</code> (walk leaves, no sort). Hurts on low-cardinality columns, when a function wraps the column (<code>WHERE lower(email)=…</code> needs an expression index), and every index is <b>write amplification</b>.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <b>Leftmost-prefix rule:</b> <code>INDEX(a,b,c)</code> serves <code>a</code>, <code>a,b</code>, <code>a,b,c</code> — but NOT <code>b</code> alone. Put equality columns first, then the range/sort column. This is the #1 composite-index mistake.` },
        { id: "s2", type: "suggestion", label: `Next time Databases appears we read the query planner (EXPLAIN) — the tool that tells you whether the planner actually chose your index.` },
      ],
    },

    /* ==================== WEEK 3 (4 side-days) ==================== */
    {
      id: "d07", date: "2026-08-03", week: "w3", title: "TCP vs UDP — handshake, flow, congestion, HOL",
      theme: "Networking · part 3 — reliability is a feature you pay for.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          label: `<b>Networking ③.</b> Read HPBN (free) <a href="https://hpbn.co/building-blocks-of-tcp/" target="_blank" rel="noopener">"Building Blocks of TCP"</a> + <a href="https://hpbn.co/building-blocks-of-udp/" target="_blank" rel="noopener">UDP</a>. Own the <b>3-way handshake</b> (SYN/SYN-ACK/ACK), <b>slow-start</b> & congestion avoidance (AIMD), the receive window / flow control, and <b>head-of-line blocking</b>. UDP = no handshake, no ordering, no congestion control — you build reliability yourself (or use QUIC).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Two different HOL blockings: TCP's own byte-stream ordering, and the famous <b>HTTP/2-over-TCP</b> one (a single lost packet stalls all multiplexed streams) — the latter is what QUIC/HTTP-3 fixes, and what interviewers usually mean.` },
        { id: "s2", type: "tryout", label: `Tryout: <code>sudo tcpdump -n -i any port 443</code> while you <code>curl https://example.com</code> — watch the real SYN → SYN-ACK → ACK, then the TLS records. 5 minutes that make the handshake concrete.` },
      ],
    },
    {
      id: "d08", date: "2026-08-05", week: "w3", title: "Kubernetes: the reconciliation loop + core objects",
      theme: "DevOps · part 3 — everything in k8s is a controller driving current → desired.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          label: `<b>DevOps ③.</b> Read k8s <a href="https://kubernetes.io/docs/concepts/architecture/controller/" target="_blank" rel="noopener">"Controllers"</a> (the thermostat: observe current → compare to <code>.spec</code> → act → repeat, forever — <b>level-triggered</b>), then skim the core objects: <a href="https://kubernetes.io/docs/concepts/workloads/pods/" target="_blank" rel="noopener">Pod</a>, <a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noopener">Deployment</a>→ReplicaSet→Pod, <a href="https://kubernetes.io/docs/concepts/services-networking/service/" target="_blank" rel="noopener">Service</a> (stable VIP + label selector), <a href="https://kubernetes.io/docs/concepts/services-networking/ingress/" target="_blank" rel="noopener">Ingress</a>, ConfigMap/Secret. Controllers act only through the <b>API server</b> (+ etcd = source of truth), never nodes directly.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Interview gotcha: a k8s <b>Secret is only base64-encoded, not encrypted</b> at rest by default — you must enable encryption-at-rest / a KMS. Everyone gets this wrong.` },
        { id: "s2", type: "hint", label: `💡 "Reconciliation" is the through-line of this whole DevOps thread — you'll see the exact same loop in GitOps (Argo) and Terraform (plan/apply vs state). Learn it once here.` },
      ],
    },
    {
      id: "d09", date: "2026-08-07", week: "w3", title: "The memory hierarchy & CPU cache",
      theme: "Systems · part 2 — why cache-friendly loops are 10× faster.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 60,
          label: `<b>Systems ②.</b> Read CS:APP <b>Ch 6 "The Memory Hierarchy"</b> (registers → L1/L2/L3 → DRAM → disk; locality, cache lines, hit/miss) — or the free classic, Ulrich Drepper <a href="https://lwn.net/Articles/250967/" target="_blank" rel="noopener">"What Every Programmer Should Know About Memory"</a> (read the CPU-cache parts, ~Parts 2–3). Payoff: a cache line is ~64 bytes; row-major traversal is fast because it uses whole lines; pointer-chasing thrashes cache. This is why arrays beat linked lists in practice.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Now the callback from d03: a context switch's <i>direct</i> cost (save/restore registers, ~1–few µs) is often dwarfed by the <i>indirect</i> cost — cold caches + a TLB flush. That's the real reason user-space coroutines are cheap.` },
        { id: "s2", type: "callout", label: `🔬 "Latency numbers every programmer should know" (L1 ~1ns, main memory ~100ns, SSD ~16µs, network within a DC ~0.5ms) — memorize the <i>orders of magnitude</i>; they anchor every performance discussion.` },
      ],
    },
    {
      id: "d10", date: "2026-08-09", week: "w3", title: "EXPLAIN: reading the query planner's mind",
      theme: "Databases · part 2 — estimated vs actual rows is the #1 diagnostic.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          label: `<b>Databases ②.</b> Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/using-explain.html" target="_blank" rel="noopener">14.1 "Using EXPLAIN"</a> and UTIL's <a href="https://use-the-index-luke.com/sql/explain-plan/postgresql" target="_blank" rel="noopener">Postgres execution plans</a>. Learn to read <b>Seq Scan / Index Scan / Index-Only Scan / Bitmap Heap Scan / Nested Loop vs Hash Join</b>. Always run <code>EXPLAIN (ANALYZE, BUFFERS)</code> — a big gap between <i>estimated</i> and <i>actual</i> rows means stale stats (run <code>ANALYZE</code> or raise <code>default_statistics_target</code>).` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: on any table you have, <code>EXPLAIN (ANALYZE, BUFFERS) SELECT …</code> a query with and without a helpful index; watch the plan flip from Seq Scan to Index Scan and the cost drop.` },
        { id: "s2", type: "hint", label: `💡 The planner is cost-based, not rule-based: it will (correctly) ignore your index when a predicate matches a large fraction of rows, because a sequential scan is cheaper. An unused index isn't always a bug.` },
      ],
      note: "End of month 1's first heavy week — Networking + DevOps + Systems + DB all in motion.",
    },

    /* ==================== WEEK 4 ==================== */
    {
      id: "d11", date: "2026-08-11", week: "w4", title: "DNS resolution, end to end",
      theme: "Networking · part 4 — the recursive resolver as middleman.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 40,
          label: `<b>Networking ④.</b> Read Cloudflare <a href="https://www.cloudflare.com/learning/dns/what-is-dns/" target="_blank" rel="noopener">"What is DNS?"</a> + <a href="https://www.cloudflare.com/learning/dns/dns-server-types/" target="_blank" rel="noopener">DNS server types</a>. Trace it: stub resolver → <b>recursive resolver</b> → root (one of 13 root-server IPs) → TLD (<code>.com</code>) → authoritative → A/AAAA record, with caching (TTL) at every hop. Then run <code>dig +trace google.com</code> to watch the root→TLD→authoritative delegation live.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 DNS is why "it works on my machine" can be a caching lie: resolvers, the OS, and your app can each cache records for the TTL. A stale A record survives long after you change it.` },
        { id: "s2", type: "suggestion", label: `Interview-ready: be able to narrate "what happens when you type a URL and hit Enter" — see <a href="https://github.com/alex/what-happens-when" target="_blank" rel="noopener">alex/what-happens-when</a> for the full ARP→DNS→TCP→TLS→HTTP walk.` },
      ],
    },
    {
      id: "d12", date: "2026-08-13", week: "w4", title: "k8s scheduling, probes, requests/limits & HPA",
      theme: "DevOps · part 4 — the operational levers you get asked about.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          label: `<b>DevOps ④.</b> Read the k8s <a href="https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/" target="_blank" rel="noopener">scheduler</a> (filter→score→bind), <a href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" target="_blank" rel="noopener">liveness/readiness/startup probes</a>, <a href="https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" target="_blank" rel="noopener">requests/limits</a>, and <a href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" target="_blank" rel="noopener">HPA</a>. Nail the distinctions: <b>requests</b> = scheduling guarantee, <b>limits</b> = runtime cap (CPU throttled, memory over-limit → OOMKill); <b>liveness</b> restarts, <b>readiness</b> removes from the Service until ready, <b>startup</b> protects slow boots.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ The classic mistake: using a liveness probe that fails when a <i>dependency</i> is down — so k8s restarts your healthy Pod in a loop. A failing dependency should flip <b>readiness</b>, not liveness.` },
        { id: "s2", type: "hint", label: `💡 requests≠limits is the root of "noisy neighbour" incidents; set memory request = limit for predictable OOM behaviour, and be cautious with CPU limits (throttling adds tail latency).` },
      ],
    },
    {
      id: "d13", date: "2026-08-15", week: "w4", title: "Security foundations: OWASP 2025 + authn vs authz",
      theme: "Security · part 1 — the vocabulary you're measured against.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 50,
          label: `<b>Security ①.</b> Skim the <a href="https://owasp.org/Top10/2025/" target="_blank" rel="noopener">OWASP Top 10 (2025 — the current edition)</a>; note the top risks (Broken Access Control is #1, then Security Misconfiguration, Software Supply-Chain Failures, Cryptographic Failures, Injection…). Then read the OWASP <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener">Authentication Cheat Sheet</a> and keep the split crisp: <b>authentication</b> = who you are; <b>authorization</b> = what you may do. Most "auth" bugs are actually broken <i>authorization</i> (missing object-level checks).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 "Broken Access Control" being #1 means: the interesting bugs aren't crypto — they're forgetting to check that <i>this</i> user owns <i>this</i> record (IDOR). Every endpoint needs an ownership check, not just a login gate.` },
        { id: "s2", type: "callout", label: `🧭 Security is threaded through the core (auth → OAuth/JWT → hashing → smart-contract vulns) and lands the capstone in week 12. Today is the map.` },
      ],
      note: "🏁 Month-1 checkpoint week: Networking + DevOps foundations laid, plus Systems, DB and the security map.",
    },

    /* ==================== WEEK 5 ==================== */
    {
      id: "d14", date: "2026-08-17", week: "w5", title: "The TLS 1.3 handshake & PKI",
      theme: "Networking · part 5 — how two strangers agree a secret over a wiretap.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          label: `<b>Networking ⑤.</b> Read Cloudflare <a href="https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/" target="_blank" rel="noopener">"What happens in a TLS handshake?"</a> (TLS 1.3 is <b>1-RTT</b>, with 0-RTT resumption). Key idea: asymmetric keys are used only to <b>agree a symmetric session key</b>; bulk traffic is symmetric (fast). Certificates + a chain to a trusted root CA prove you're talking to the real server (PKI). For the byte level, skim <a href="https://tls13.xargs.org/" target="_blank" rel="noopener">The Illustrated TLS 1.3 Connection</a>.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <b>SNI</b> (Server Name Indication) is sent in the ClientHello so one IP can host many TLS sites — and historically it was plaintext (privacy leak), which ECH now addresses. <b>ALPN</b> in the same hello is how the client negotiates HTTP/2 vs HTTP/1.1.` },
        { id: "s2", type: "callout", label: `🔗 A cert chain = leaf → intermediate(s) → root. "Certificate expired / unknown authority" errors are almost always a missing intermediate or an untrusted root, not a broken key.` },
      ],
    },
    {
      id: "d15", date: "2026-08-19", week: "w5", title: "MVCC: how Postgres lets readers not block writers",
      theme: "Databases · part 3 — every row carries its own version stamps.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          label: `<b>Databases ③.</b> Read PostgreSQL docs <a href="https://www.postgresql.org/docs/current/mvcc-intro.html" target="_blank" rel="noopener">Ch 13.1 Concurrency Control (MVCC)</a> + <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">13.2 Transaction Isolation</a>. Model: each row version carries <code>xmin</code>/<code>xmax</code> (creating/deleting txn); each txn sees a <b>snapshot</b>, so readers never block writers and vice-versa. The cost: dead tuples accumulate → <b>VACUUM</b> reclaims them (and why table bloat happens). For the tuple-level detail, Egor Rogov's <a href="https://www.postgrespro.com/blog/pgsql/5967856" target="_blank" rel="noopener">MVCC series</a>.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 MVCC is why an <code>UPDATE</code> in Postgres is really <i>insert a new row version + mark the old dead</i> — so heavy-update tables bloat and need VACUUM/autovacuum. This directly explains "my table is 5× its data size."` },
        { id: "s2", type: "suggestion", label: `Preview for next DB day: isolation levels are defined by <i>which anomalies</i> they forbid. MVCC snapshots give you Postgres's "Repeatable Read" (= snapshot isolation) for free.` },
      ],
    },
    {
      id: "d16", date: "2026-08-22", week: "w5", title: "Getting it out the door: deploys, GitOps & 12-factor",
      theme: "DevOps · part 5 — rolling vs blue-green vs canary, and config in the environment.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          label: `<b>DevOps ⑤.</b> Read Martin Fowler <a href="https://martinfowler.com/bliki/BlueGreenDeployment.html" target="_blank" rel="noopener">BlueGreenDeployment</a> + <a href="https://martinfowler.com/bliki/CanaryRelease.html" target="_blank" rel="noopener">CanaryRelease</a> (rolling = k8s default), the <a href="https://opengitops.dev/" target="_blank" rel="noopener">4 GitOps principles</a>, and <a href="https://12factor.net/" target="_blank" rel="noopener">The Twelve-Factor App</a> (esp. III Config in env, VI stateless processes, IX disposability, XI logs as stdout streams). Rolling = incremental replace; blue-green = two environments, flip traffic, instant rollback; canary = small %, watch metrics, ramp.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 GitOps is just the reconciliation loop again: Git holds desired state, an agent (Argo/Flux) continuously converges the cluster to it. Same shape as k8s controllers and Terraform's plan/apply-vs-state.` },
        { id: "s2", type: "callout", label: `🔬 12-factor XI (logs to stdout, not files) is exactly why your Loki/Promtail stack works — the platform captures the stream. Apps that write their own log files fight the platform.` },
      ],
    },

    /* ==================== WEEK 6 (4 side-days) ==================== */
    {
      id: "d17", date: "2026-08-25", week: "w6", title: "Crypto primitives: hash vs sign vs encrypt, Merkle trees",
      theme: "Blockchain · part 1 — get the three-way distinction exactly right.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          label: `<b>Blockchain ①.</b> Read <i>Mastering Ethereum</i> (2nd ed, free) <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_4.md" target="_blank" rel="noopener">Ch 4 "Cryptography"</a> and <i>Mastering Bitcoin</i> (3rd ed) <a href="https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch11_blockchain.adoc" target="_blank" rel="noopener">Ch 11</a> Merkle-tree section. Nail the distinction: <b>hashing</b> = one-way integrity (SHA-256, keccak256); <b>encryption</b> = reversible secrecy; <b>signing</b> = authenticity + non-repudiation. <b>Merkle trees</b> hash pairs up to one root, so you can prove one leaf is included with ~log(N) hashes.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The two curves you already use: Ethereum/Bitcoin sign with <b>ECDSA over secp256k1</b> and hash with <b>keccak256</b> (≠ finalized NIST SHA-3); Solana signs with <b>ed25519 (EdDSA)</b>. Same idea, different curve — spec: <a href="https://datatracker.ietf.org/doc/html/rfc8032" target="_blank" rel="noopener">RFC 8032</a>.` },
        { id: "s2", type: "callout", label: `🔬 Ethereum's state is a <b>Merkle-Patricia trie</b> (four tries: state/storage/tx/receipts) — <a href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/" target="_blank" rel="noopener">ethereum.org</a>. That's how a light client proves a balance without the whole chain.` },
      ],
    },
    {
      id: "d18", date: "2026-08-27", week: "w6", title: "HTTP/1.1 → HTTP/2 → HTTP/3 & QUIC",
      theme: "Networking · part 6 — each version fixes the last one's bottleneck.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 50,
          label: `<b>Networking ⑥.</b> Read HPBN <a href="https://hpbn.co/http1x/" target="_blank" rel="noopener">HTTP/1.X</a> + <a href="https://hpbn.co/http2/" target="_blank" rel="noopener">HTTP/2</a> (persistent connections, why pipelining failed, H2 multiplexing/framing/HPACK). For H3/QUIC, read the free <a href="https://http3-explained.haxx.se/" target="_blank" rel="noopener">HTTP/3 explained</a>: QUIC = reliable multiplexed streams over <b>UDP</b>, TLS 1.3 built in, no TCP-level HOL blocking, connection migration. Focus on <i>why</i> each exists, not the feature list.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 H2 fixed HTTP-level HOL blocking (multiplexing) but sits on TCP, so one lost packet still stalls all streams at the transport layer. H3 moves multiplexing into QUIC/UDP so a loss only stalls <i>its</i> stream. That's the whole H2→H3 story.` },
        { id: "s2", type: "suggestion", label: `Pair with keep-alive/connection pooling (MDN <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x" target="_blank" rel="noopener">Connection management</a>) — and check the pooling knobs of a client you ship: Go <code>http.Transport.MaxIdleConnsPerHost</code>, Node <code>http.Agent keepAlive</code>.` },
      ],
    },
    {
      id: "d19", date: "2026-08-29", week: "w6", title: "Redis internals: why single-threaded is fast",
      theme: "Caching · part 1 — one event loop, atomic commands, no locks.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 50,
          label: `<b>Caching ①.</b> Read the Redis <a href="https://redis.io/docs/latest/get-started/faq/" target="_blank" rel="noopener">FAQ</a> (single-thread rationale) + <a href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener">data types</a>. Command execution runs on <b>one thread on an event loop</b> → every command is atomic (no client-side locks for <code>INCR</code>/<code>SETNX</code>), and Redis is memory/network-bound, not CPU-bound. Redis 6+ multithreads only network I/O, not command execution. Learn the structures by use: sorted sets → leaderboards & sliding-window rate limiting; hashes → objects; streams → event log w/ consumer groups; HLL → cardinality.` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ Because it's one loop, a single O(N) command (<code>KEYS *</code>, a huge <code>SMEMBERS</code>/<code>SORT</code>) blocks <i>every</i> client. Use <code>SCAN</code>, keep values small, and never <code>KEYS</code> in production.` },
        { id: "s2", type: "hint", label: `💡 Directly useful for your prediction game: sorted sets (<code>ZADD</code>/<code>ZRANGEBYSCORE</code>) give you leaderboards and a rate limiter in a handful of atomic ops — no locks, no races.` },
      ],
    },
    {
      id: "d20", date: "2026-08-30", week: "w6", title: "Isolation levels & the anomalies they prevent",
      theme: "Databases · part 4 — and the one everyone misses: write skew.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 60,
          label: `<b>Databases ④.</b> Read DDIA <b>Ch 7 "Weak Isolation Levels"</b> straight through (Read Committed → Snapshot Isolation → Preventing Lost Updates → Write Skew & Phantoms), cross-checked against PG's <a href="https://www.postgresql.org/docs/current/transaction-iso.html" target="_blank" rel="noopener">13.2 table</a>. Cheat-sheet: <b>dirty read</b> (uncommitted) — stopped by Read Committed; <b>non-repeatable read</b> — stopped by Repeatable Read/SI; <b>phantom</b> (range gains rows) — Serializable; <b>lost update</b> — SI does NOT stop it (use <code>SELECT … FOR UPDATE</code> or atomic <code>UPDATE x=x+1</code>); <b>write skew</b> — only Serializable (SSI).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 <b>Write skew</b> is the interview-grade one: two txns read an overlapping set, each updates a <i>different</i> row, together breaking an invariant (both on-call doctors go off-call). Snapshot isolation allows it; only true serializable stops it. Relevant to any "check-then-act" in your market settlement.` },
        { id: "s2", type: "callout", label: `🧠 Postgres names are confusing: PG "Repeatable Read" is actually <b>Snapshot Isolation</b>, and PG never shows dirty reads even at Read Committed. Know the mapping.` },
      ],
      note: "Month 2 underway — data, HTTP, caching and blockchain now interleaving with DevOps.",
    },

    /* ==================== WEEK 7 ==================== */
    {
      id: "d21", date: "2026-08-31", week: "w7", title: "Observability: golden signals, histograms & why p99",
      theme: "DevOps · part 6 — averages lie; you live at the tail.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 55,
          label: `<b>DevOps ⑥.</b> Read Google SRE (free) <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">Ch 6 "Monitoring Distributed Systems"</a> — the <b>Four Golden Signals</b> (Latency, Traffic, Errors, Saturation) — then Prometheus <a href="https://prometheus.io/docs/practices/histograms/" target="_blank" rel="noopener">"Histograms and summaries"</a>. Why <b>p99 not average</b>: the mean is dominated by the bulk; tail latency is what users and fan-out/queued requests actually feel. Histograms expose <code>_bucket{le=…}</code> so the server computes <code>histogram_quantile(0.99, …)</code> at query time and can aggregate across instances (summaries can't).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ <b>Cardinality trap:</b> a Prometheus series = metric name + every label combo. Put a user ID / request ID / full URL in a label and you get a series explosion that OOMs the server. Labels must be bounded.` },
        { id: "s2", type: "hint", label: `💡 Complementary lenses: <b>RED</b> (Rate, Errors, Duration) for request services; <b>USE</b> (Utilization, Saturation, Errors) for resources. Golden Signals ≈ RED + Saturation. We hit USE in the load-testing day.` },
      ],
    },
    {
      id: "d22", date: "2026-09-03", week: "w7", title: "Inside the EVM: stack machine, storage, gas",
      theme: "Blockchain · part 2 — what your Solidity actually compiles down to.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 60,
          label: `<b>Blockchain ②.</b> Read <i>Mastering Ethereum</i> <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_14.md" target="_blank" rel="noopener">Ch 14 "The EVM"</a> and explore <a href="https://www.evm.codes/" target="_blank" rel="noopener">evm.codes</a> (per-opcode gas + a live playground). Model: the EVM is a <b>stack machine</b> (1024-deep, 256-bit words). Three data locations — <b>storage</b> (persistent, expensive, in the state trie), <b>memory</b> (per-call, cheap, wiped), <b>calldata</b> (read-only input). Every opcode costs <b>gas</b>; <code>SSTORE</code> is the pricey one (cold vs warm, EIP-2929).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The account model: <b>EOA</b> (key-controlled) vs <b>contract account</b> (code + storage). Contracts can't act on their own — every state change starts from an EOA-signed transaction. See <a href="https://ethereum.org/en/developers/docs/accounts/" target="_blank" rel="noopener">ethereum.org accounts</a>.` },
        { id: "s2", type: "tryout", label: `Tryout: paste a few opcodes into the <a href="https://www.evm.codes/playground" target="_blank" rel="noopener">evm.codes playground</a> and single-step — watch the stack push/pop and gas tick down. Best way to make "stack machine" click.` },
      ],
    },
    {
      id: "d23", date: "2026-09-05", week: "w7", title: "Message queues vs logs — the core distinction",
      theme: "Messaging · part 1 — delete-on-ack vs retain-and-offset.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 55,
          label: `<b>Messaging ①.</b> Read DDIA <b>Ch 11</b> "Messaging Systems" → "Partitioned Logs", plus Jay Kreps' <a href="https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying" target="_blank" rel="noopener">"The Log"</a>. The distinction that unlocks everything: a <b>queue/broker</b> (RabbitMQ, SQS) deletes a message on ack, load-balances across competing consumers, weak ordering; a <b>log</b> (Kafka) is append-only and <b>retained</b>, each consumer tracks its own <b>offset</b>, so it's replayable and ordered within a partition.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 "Should I use RabbitMQ or Kafka?" → task/RPC work with per-message ack, priority, TTL → broker/queue. Event streaming, replay, multiple independent consumers, high throughput → log/Kafka. The axis is <i>delete-on-ack vs retain-with-offset</i>.` },
        { id: "s2", type: "callout", label: `🔬 A log is the primitive behind replication, CDC, and stream processing — the whole point of Kreps' essay. Postgres's WAL (which you'll meet in the locking/WAL day) is literally the same idea inside one database.` },
      ],
    },

    /* ==================== WEEK 8 ==================== */
    {
      id: "d24", date: "2026-09-08", week: "w8", title: "Load balancers (L4 vs L7), reverse proxies & CDNs",
      theme: "Networking · part 7 — what nginx and your ALB really do.",
      tasks: [
        { id: "t1", obj: NET, cat: "read", est: 45,
          label: `<b>Networking ⑦.</b> Read Cloudflare on <a href="https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/" target="_blank" rel="noopener">reverse proxies</a> + <a href="https://www.cloudflare.com/learning/cdn/what-is-a-cdn/" target="_blank" rel="noopener">CDNs</a>, and the L4-vs-L7 distinction. <b>L4 LB</b> "moves packets" (routes by IP/port, can't read URLs — NLB, IPVS, HAProxy TCP mode); <b>L7 LB</b> "reads requests" (route <code>/api</code> vs <code>/img</code>, terminate TLS, sticky sessions — nginx, Envoy, ALB). A <b>reverse proxy</b> does TLS termination, caching, compression, buffering, and hides the origin. A <b>CDN</b> is edge caches near users.` },
      ],
      soft: [
        { id: "s1", type: "tryout", label: `Tryout: write a 20-line nginx config with an <code>upstream {}</code> block and <code>proxy_pass</code> to two backends — you'll learn more about reverse proxies from that than any article.` },
        { id: "s2", type: "hint", label: `💡 "Terminate TLS at the edge" = the L7 proxy/LB decrypts and talks plain HTTP to your backends, centralizing certs and offloading crypto. Contrast with TLS passthrough (backend terminates) and re-encryption.` },
      ],
    },
    {
      id: "d25", date: "2026-09-11", week: "w8", title: "OAuth 2.0, OIDC, PKCE & JWT the right way",
      theme: "Security · part 2 — and the alg:none footgun.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 60,
          label: `<b>Security ②.</b> Read the OAuth <a href="https://www.rfc-editor.org/rfc/rfc6749" target="_blank" rel="noopener">RFC 6749</a> authorization-code flow + <a href="https://www.rfc-editor.org/rfc/rfc7636" target="_blank" rel="noopener">PKCE (RFC 7636)</a>, and PortSwigger's <a href="https://portswigger.net/web-security/jwt" target="_blank" rel="noopener">JWT attacks</a>. <b>Authorization Code + PKCE</b> is the modern default for <i>all</i> client types: the client sends <code>code_challenge=S256(code_verifier)</code> on the front channel and the raw verifier on the back channel, so a stolen code is useless. For JWT: pin the expected <code>alg</code> server-side; never trust the token's <code>alg</code> header (the <b>alg:none</b> and RS256→HS256 confusion attacks).` },
      ],
      soft: [
        { id: "s1", type: "callout", label: `⚠️ <b>alg:none</b>: an attacker sets the header's algorithm to "none" and drops the signature; a naive verifier that reads <code>alg</code> from the token trusts unsigned data. Treat accepted algorithms as a server-side allowlist, and reject <code>none</code> / case variants.` },
        { id: "s2", type: "hint", label: `💡 Access token vs ID token vs refresh token: OAuth 2.0 is <i>authorization</i> (access tokens for APIs); OIDC adds <i>authentication</i> (the ID token / who the user is). Don't use an ID token as an API access token.` },
      ],
    },
    {
      id: "d26", date: "2026-09-13", week: "w8", title: "Locking, deadlocks & the write-ahead log",
      theme: "Databases · part 5 — log the change before you touch the page.",
      tasks: [
        { id: "t1", obj: DATA, cat: "read", est: 55,
          label: `<b>Databases ⑤.</b> Read PG docs <a href="https://www.postgresql.org/docs/current/explicit-locking.html" target="_blank" rel="noopener">13.3 "Explicit Locking"</a> (row/table lock modes, the conflict matrix, <b>deadlock</b> detection via the waits-for graph + <code>deadlock_timeout</code>) and <a href="https://www.postgresql.org/docs/current/wal-intro.html" target="_blank" rel="noopener">Ch 30 "Write-Ahead Log"</a>. WAL principle: <b>append the change to the log (fsync'd) before modifying the data page</b>, so a crash can redo. WAL also doubles as the replication + point-in-time-recovery stream.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 App-level deadlock prevention is mostly <b>consistent lock ordering</b>: if every transaction locks rows/tables in the same order, cycles can't form. Postgres kills one victim and raises a deadlock error — catch and retry.` },
        { id: "s2", type: "callout", label: `🔬 <code>synchronous_commit</code>/<code>fsync</code> are the durability dial: <code>fsync=off</code> is fast and loses data on crash. This is the same page-cache/fsync tension from the OS layer — durability = "actually on disk," not "write() returned."` },
      ],
    },

    /* ==================== WEEK 9 ==================== */
    {
      id: "d27", date: "2026-09-14", week: "w9", title: "Solana's account model — everything is an account",
      theme: "Blockchain · part 3 — stateless programs + separate data accounts.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          label: `<b>Blockchain ③.</b> Read Solana docs <a href="https://solana.com/docs/core/accounts" target="_blank" rel="noopener">Accounts</a> + <a href="https://solana.com/docs/core/programs" target="_blank" rel="noopener">Programs</a>. The mental flip from EVM: <b>programs are stateless</b> (executable accounts holding sBPF bytecode); all mutable state lives in <b>separate data accounts</b> that a transaction must pass in. Accounts pay <b>rent</b> (must be rent-exempt = hold ~2 years' rent for their size). Contrast explicitly with Ethereum's "contract = code + its own storage."` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 This is <i>why</i> Solana instructions must list every account they read/write up front — the runtime needs the access set before execution. That constraint is the price of parallelism (next Solana day: Sealevel).` },
        { id: "s2", type: "callout", label: `🔬 Rent-exemption is a real footgun: an account below the minimum balance can be purged. When you allocate a PDA, fund it for its data size. See <a href="https://solana.com/developers/evm-to-svm/accounts" target="_blank" rel="noopener">EVM→SVM: Accounts</a> for the side-by-side.` },
      ],
    },
    {
      id: "d28", date: "2026-09-16", week: "w9", title: "SLIs, SLOs, error budgets & tracing",
      theme: "DevOps · part 7 — turn reliability into a number you can spend.",
      tasks: [
        { id: "t1", obj: OPS, cat: "read", est: 50,
          label: `<b>DevOps ⑦.</b> Read Google SRE <a href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">Ch 4 "Service Level Objectives"</a> + the error-budget part of <a href="https://sre.google/sre-book/embracing-risk/" target="_blank" rel="noopener">Ch 3 "Embracing Risk"</a>, then OpenTelemetry <a href="https://opentelemetry.io/docs/concepts/signals/traces/" target="_blank" rel="noopener">Traces</a>. <b>SLI</b> = a measured level (e.g. % requests < 300 ms); <b>SLO</b> = the target (99.9% / 28 days); <b>error budget</b> = 1 − SLO (99.9% ⇒ ~43 min/month of allowed unreliability). Budget remaining → ship features; budget spent → freeze risky changes.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Don't be <i>more</i> reliable than your SLO needs — excess reliability has real opportunity cost (and users can't tell). 100% is the wrong target; choose a few user-visible SLIs.` },
        { id: "s2", type: "callout", label: `🔬 Tracing under the hood: a trace = a tree of spans; a <b>W3C <code>traceparent</code></b> header carries the trace/span IDs across service boundaries so downstream spans join the same trace. That header is the whole magic of distributed tracing.` },
      ],
    },
    {
      id: "d29", date: "2026-09-19", week: "w9", title: "How a server accepts 10k connections: epoll & the event loop",
      theme: "Systems · part 3 — the pattern behind nginx, Node, tokio & Go's netpoller.",
      tasks: [
        { id: "t1", obj: SYS, cat: "read", est: 50,
          label: `<b>Systems ③.</b> Read Dan Kegel's <a href="http://www.kegel.com/c10k.html" target="_blank" rel="noopener">The C10K problem</a> for the model (thread-per-connection vs <code>select</code>/<code>poll</code> vs <b>epoll</b>, edge- vs level-triggered). The modern pattern: a few <b>event-loop</b> threads each call <code>epoll_wait()</code> for ready fds, then do <b>non-blocking</b> <code>accept</code>/<code>read</code>/<code>write</code>. That's nginx (worker per core), Node (loop + libuv pool), Netty, tokio, and Go's netpoller (hidden behind blocking-looking goroutines).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The four axes people muddle: <b>blocking</b> (park the thread) vs <b>non-blocking</b> (<code>EAGAIN</code>, retry) vs <b>sync</b> vs <b>async</b> (kernel does the work, notifies on completion — io_uring). Your async runtime = non-blocking syscalls + an event loop presenting an async API.` },
        { id: "s2", type: "tryout", label: `Tryout: <code>strace -e epoll_wait,accept4,read -f</code> against a small server and watch the loop pull ready fds. The abstraction becomes concrete in 5 minutes.` },
      ],
    },

    /* ==================== WEEK 10 ==================== */
    {
      id: "d30", date: "2026-09-22", week: "w10", title: "A transaction's life & EIP-1559 fees",
      theme: "Blockchain · part 4 — base fee burned, tip to the proposer.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          label: `<b>Blockchain ④.</b> Read <i>Mastering Ethereum</i> <a href="https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_6.md" target="_blank" rel="noopener">Ch 6 "Transactions"</a> and <a href="https://eips.ethereum.org/EIPS/eip-1559" target="_blank" rel="noopener">EIP-1559</a>. A tx carries nonce, gas fields, to/value/data, signature (RLP-encoded). <b>EIP-1559</b>: blocks target 50% fullness (elasticity 2); the <b>base fee</b> adjusts ≤12.5%/block and is <b>burned</b>; a <b>priority fee (tip)</b> goes to the proposer; a type-2 tx sets <code>max_fee_per_gas</code> + <code>max_priority_fee_per_gas</code> and is refunded the difference.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The invariants to cite are <b>elasticity 2</b> (50% target) and <b>max ±12.5%/block</b> base-fee change — NOT "15M/30M gas," which were historical mainnet values, not protocol constants.` },
        { id: "s2", type: "callout", label: `🔬 Calldata is priced per byte (cheap-ish) while <code>SSTORE</code> is expensive — which is exactly why rollups post compressed calldata/blobs to L1 instead of storage. Ties your gas intuition to why L2s are cheaper.` },
      ],
    },
    {
      id: "d31", date: "2026-09-24", week: "w10", title: "Kafka's model: partitions, offsets, consumer groups, ISR",
      theme: "Messaging · part 2 — the unit of parallelism is the partition.",
      tasks: [
        { id: "t1", obj: MSG, cat: "read", est: 55,
          label: `<b>Messaging ②.</b> Read <i>Kafka: The Definitive Guide</i> (2nd ed, <a href="https://www.confluent.io/resources/kafka-the-definitive-guide-v2/" target="_blank" rel="noopener">free from Confluent</a>) Ch 1 + the internals/reliability chapters. Model: a <b>topic</b> splits into <b>partitions</b> (unit of parallelism + ordering); each record has a monotonic <b>offset</b> in its partition; a <b>consumer group</b> assigns each partition to exactly one member (so parallelism ≤ partition count). Partitions are replicated (leader + followers); the <b>ISR</b> = replicas caught up to the leader — with <code>acks=all</code> + <code>min.insync.replicas=2</code>, a write is durable once all ISR members have it.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Ordering is only guaranteed <i>within a partition</i>. If you need per-entity order (e.g. all events for one user/market in order), key by that entity so they land in the same partition.` },
        { id: "s2", type: "callout", label: `⚠️ More consumers than partitions = idle consumers (nothing to assign). Partition count is your parallelism ceiling and is painful to change later — size it deliberately.` },
      ],
    },
    {
      id: "d32", date: "2026-09-27", week: "w10", title: "Review: Rust ownership & the borrow checker",
      theme: "Review · a deliberate re-grounding in a hard model you already use.",
      tasks: [
        { id: "t1", obj: REV, cat: "review", est: 45,
          label: `<b>Review.</b> Re-ground the model that underpins your Solana/Anchor work: re-read <i>The Rust Book</i> <a href="https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html" target="_blank" rel="noopener">Ch 4 "Understanding Ownership"</a> (move/borrow/lifetimes) and, without looking, explain out loud: why can't you have a mutable borrow alongside any other borrow? What does a lifetime annotation actually constrain? Then write three tiny snippets that <i>fail</i> to compile and predict the exact borrow-checker error before running.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The one-line model: ownership makes "who frees this and when" a <i>compile-time</i> fact; the borrow checker enforces "many readers XOR one writer" so there's no data race and no use-after-free. Everything else (lifetimes, <code>&mut</code>) serves that.` },
        { id: "s2", type: "callout", label: `🧭 Review tasks recur occasionally (Rust here; C++ threads, Go's scheduler, Python's GIL later) — short, forced re-derivations of hard concepts in languages you already ship.` },
      ],
    },

    /* ==================== WEEK 11 ==================== */
    {
      id: "d33", date: "2026-09-28", week: "w11", title: "Cache patterns, the stampede & invalidation",
      theme: "Caching · part 2 — the hard part isn't caching, it's invalidating.",
      tasks: [
        { id: "t1", obj: CACHE, cat: "read", est: 50,
          label: `<b>Caching ②.</b> Read AWS <a href="https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html" target="_blank" rel="noopener">caching patterns</a> (cache-aside vs write-through vs write-behind) and the Redis <a href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">eviction</a> + <a href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">persistence (RDB/AOF)</a> pages. <b>Cache-aside</b>: read cache → miss → read DB → populate with TTL. Handle the <b>stampede/thundering herd</b> (a hot key expires, thousands of misses hit the DB) with single-flight/request-coalescing, a per-key lock (<code>SET k v NX PX ttl</code>), stale-while-revalidate, and <b>TTL jitter</b>. Prefer <b>delete-on-write</b> over update to avoid caching a value a concurrent write races.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Eviction menu: <code>allkeys-lru</code>/<code>lfu</code> for a pure cache, <code>volatile-*</code> when you mix cache + persistent keys. Redis uses <i>approximated</i> (sampled) LRU/LFU, not exact — and that's fine.` },
        { id: "s2", type: "callout", label: `🔬 RDB (periodic fork+snapshot; can lose minutes) vs AOF (<code>appendfsync everysec</code> ≈ lose ≤1s). Run both for a good durability/restart trade-off. The fork uses copy-on-write — big instances spike memory during a save.` },
      ],
    },
    {
      id: "d34", date: "2026-09-30", week: "w11", title: "Sealevel, PDAs & CPIs — Solana's parallel runtime",
      theme: "Blockchain · part 5 — why declaring accounts up front buys parallelism.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          label: `<b>Blockchain ⑤.</b> Read Solana docs <a href="https://solana.com/docs/core/pda" target="_blank" rel="noopener">PDAs</a> + <a href="https://solana.com/docs/core/cpi" target="_blank" rel="noopener">CPIs</a> + <a href="https://solana.com/docs/core/fees/compute-budget" target="_blank" rel="noopener">Compute Budget</a>, and the <a href="https://docs.anza.xyz/validator/runtime" target="_blank" rel="noopener">Sealevel runtime</a>. Because every instruction declares the accounts it reads/writes, the runtime can execute non-overlapping transactions <b>in parallel</b> (writes serialized per account, reads parallel). <b>PDAs</b> = deterministic off-curve program-owned addresses (no private key; signed via <code>invoke_signed</code>); <b>CPIs</b> = one program calling another. Compute units: 200K default/instruction, 1.4M max/tx; priority fee = <code>cu_price × cu_limit</code>.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 The EVM↔SVM contrast in one line: Ethereum executes transactions <i>sequentially</i> (global state, implicit access); Solana executes them <i>in parallel</i> by forcing explicit account declarations. Everything odd about Solana dev flows from that trade.` },
        { id: "s2", type: "callout", label: `⚠️ Currency note: Solana's classic consensus is PoH + Tower BFT, but a new design ("Alpenglow") is landing in 2026 — know Tower BFT as the deployed model, and that it's being superseded.` },
      ],
    },
    {
      id: "d35", date: "2026-10-03", week: "w11", title: "Load & stress testing without fooling yourself",
      theme: "DevOps · part 8 — coordinated omission and the USE method.",
      tasks: [
        { id: "t1", obj: OPS, cat: "watch", est: 55,
          label: `<b>DevOps ⑧.</b> Watch Gil Tene, <a href="https://www.youtube.com/watch?v=lJ8ydIuPFeU" target="_blank" rel="noopener">"How NOT to Measure Latency" (Strange Loop, ~43 min)</a> (coordinated omission ~33:50), and read Brendan Gregg's <a href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">USE Method</a>. <b>Coordinated omission</b>: a load tool that waits for a slow response before sending the next request silently deletes the worst samples — making the tail look great when it's awful. Fix: drive a <b>constant arrival rate</b> (open-loop: <code>vegeta</code>, <code>k6</code>) and report from full distributions (HdrHistogram), not averages. <b>USE</b>: for each resource check Utilization, Saturation, Errors.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Tool axis: <code>ab</code>/<code>wrk</code> are closed-loop (throughput-driven) and prone to coordinated omission; <code>vegeta</code>/<code>k6</code> can hold a fixed request rate — which is what you want to measure real latency under load.` },
        { id: "s2", type: "tryout", label: `Tryout: run <code>k6</code> against a service with a p99 <code>threshold</code>; then add an artificial 200ms stall to 1% of responses and watch p99 (not the average) catch it.` },
      ],
    },

    /* ==================== WEEK 12 ==================== */
    {
      id: "d36", date: "2026-10-06", week: "w12", title: "Consensus: PoW, longest chain & what 'finality' means",
      theme: "Blockchain · part 6 — agreement without a coordinator.",
      tasks: [
        { id: "t1", obj: CHAIN, cat: "read", est: 55,
          label: `<b>Blockchain ⑥.</b> Read <i>Mastering Bitcoin</i> (3rd ed) <a href="https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch12_mining.adoc" target="_blank" rel="noopener">Ch 12 "Mining and Consensus"</a> (PoW, difficulty/target, best chain = most cumulative work), then ethereum.org <a href="https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/gasper/" target="_blank" rel="noopener">Gasper</a> (Casper FFG finality + LMD-GHOST fork choice) and Vitalik's <a href="https://blog.ethereum.org/2016/05/09/on-settlement-finality" target="_blank" rel="noopener">"On Settlement Finality"</a>. Key idea: PoW finality is <b>probabilistic</b> (more confirmations = exponentially safer); PoS adds <b>economic finality</b> (revert costs slashed stake). Reorgs happen; "finality" is a spectrum, not a switch.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 CAP-flavoured trade-off: a chain can't have instant finality, full availability, and permissionless decentralization all at once — different chains pick different points. That framing beats memorizing any single consensus algorithm.` },
        { id: "s2", type: "callout", label: `🔬 Solana's take (from last week): PoH gives a verifiable clock so validators don't have to agree on time before ordering — a different answer to the same "who decides order" question.` },
      ],
    },
    {
      id: "d37", date: "2026-10-08", week: "w12", title: "Password hashing, sessions vs tokens & TLS recap",
      theme: "Security · part 3 — store secrets like they'll be stolen.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 45,
          label: `<b>Security ③.</b> Read the OWASP <a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener">Password Storage Cheat Sheet</a> + <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener">Session Management</a>. Use <b>Argon2id</b> (min m=19 MiB, t=2, p=1) for new systems; <b>bcrypt</b> (cost ≥10) is legacy-only and caps input at 72 bytes. Hash+salt, never encrypt, never home-roll. Sessions vs tokens: server-side session ids in <code>Secure; HttpOnly; SameSite</code> cookies vs stateless JWTs — and <b>never store tokens in localStorage</b> (XSS reads it).` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Hashing (Argon2/bcrypt) ≠ encryption ≠ signing — passwords are <b>hashed</b> (one-way, slow, salted). "Slow" is the point: it caps an attacker's guesses per second. Fast hashes (SHA-256) are wrong for passwords.` },
        { id: "s2", type: "callout", label: `🔗 Callback to the TLS day: the same PKI trust chain protects these credentials in transit; hashing protects them at rest. Both, always.` },
      ],
    },
    {
      id: "d38", date: "2026-10-10", week: "w12", title: "🎓 Capstone: smart-contract security — reentrancy & oracle manipulation",
      theme: "Security · part 4 — the two bug classes that drain DeFi, in your domain.",
      tasks: [
        { id: "t1", obj: SEC, cat: "read", est: 60,
          label: `<b>Security ④ (capstone).</b> Read the Solidity docs <a href="https://docs.soliditylang.org/en/latest/security-considerations.html" target="_blank" rel="noopener">Security Considerations</a> (checks-effects-interactions) and samczsun's <a href="https://samczsun.com/so-you-want-to-use-a-price-oracle/" target="_blank" rel="noopener">"So you want to use a price oracle"</a>. <b>Reentrancy</b>: any external call hands control to the callee <i>before</i> your state settles — do Checks → Effects → <b>Interactions last</b>, or use a <code>nonReentrant</code> mutex; beware read-only reentrancy (a view returns wrong data mid-write — the Curve case). <b>Oracle manipulation</b>: on-chain spot prices are attacker-controllable within a tx (flash loans) — use TWAPs / robust feeds. Directly relevant to your FPMM/LMSR market.` },
      ],
      soft: [
        { id: "s1", type: "hint", label: `💡 Checks-Effects-Interactions in one line: validate, then write ALL your state, then make external calls — so a re-entrant call always sees finalized state. OZ <code>ReentrancyGuard</code> is a storage flag (NOT_ENTERED→ENTERED) that reverts on re-entry.` },
        { id: "s2", type: "callout", label: `🏁 Core complete. From here the extension goes <i>deeper under the hood</i> — Postgres vacuum/TOAST, Kafka exactly-once internals, ZK/rollups & MEV, Rust async internals, eBPF/perf — planned separately so nothing here gets re-dated.` },
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
