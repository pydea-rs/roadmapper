#!/usr/bin/env python3
# edits_bedrock.py — the "make it doable" content decisions for bedrock (2026-09-25).
# Bedrock is a pure reading roadmap, so the fix is: ONE source per leaf, honest minutes
# for the pages that source really is, and nothing over ~45 min in a single sitting.
# Anchors used throughout: dense CS book/paper ~3 min a page; a docs page or a blog
# post 20–30 min; a spec section 25–35 min; "absorb this idea" leaves (no link) are
# left alone — they were never the problem.
import json, collections
E = collections.OrderedDict()
def split(leaf, *parts): E[leaf] = {"split": [dict(p) for p in parts]}
def price(leaf, est): E[leaf] = {"est": est}
def P(est, label, **kw): return dict(est=est, label=label, **kw)
A = lambda url, text: f'<a href="{url}" target="_blank" rel="noopener">{text}</a>'

# ---------------- weeks 1–6 ----------------
price("d01.t1.s1", 35)

split("d02.t1",
  P(40, f'Watch Liz Rice, {A("https://www.youtube.com/watch?v=8fi7uSYlOdc", chr(34)+"Containers From Scratch"+chr(34)+" (GOTO 2018, ~43 min)")} up to the <code>chroot</code> step — <code>clone()</code> and the namespace flags, live-coded in Go.', refs=None),
  P(35, 'Finish the talk — <code>chroot</code>/pivot_root and cgroups — then re-run her commands yourself in a scratch VM or container.', refs=None))

split("d03.t1.s1",
  P(40, f'Read {A("https://pages.cs.wisc.edu/~remzi/OSTEP/", "OSTEP")} (free) {A("https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf", "Ch 4 " + chr(34) + "The Abstraction: The Process" + chr(34))} (~15 pp): the process API, the state machine, and the list of what a process actually <i>is</i>.'),
  P(45, f'Read OSTEP {A("https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf", "Ch 26 " + chr(34) + "Concurrency: An Introduction" + chr(34))} (~18 pp): threads share the address space, but each gets its own stack.'))

price("d05.t1.s1", 45)
split("d05.t1.s2",
  P(25, f'Read Docker {A("https://docs.docker.com/build/building/multi-stage/", "Multi-stage builds")}: <code>COPY --from</code> to ship only the built binary, leaving the toolchain behind.'),
  P(30, f'Read Docker {A("https://docs.docker.com/build/building/best-practices/", "build best practices")}: order steps by change-frequency (deps before source) so the layer cache actually hits.'))

price("d06.t1.s1", 40)

split("d07.t1.s1",
  P(35, f'Read HPBN (free) {A("https://hpbn.co/building-blocks-of-tcp/", chr(34)+"Building Blocks of TCP"+chr(34))} — the whole chapter.'),
  P(20, f'Then the short {A("https://hpbn.co/building-blocks-of-udp/", chr(34)+"Building Blocks of UDP"+chr(34))} chapter — what TCP gives you that UDP doesn’t.'))

price("d08.t1.s1", 45)
split("d08.t1.s2",
  P(30, f'Skim the workload objects: {A("https://kubernetes.io/docs/concepts/workloads/pods/", "Pod")} and {A("https://kubernetes.io/docs/concepts/workloads/controllers/deployment/", "Deployment")}→ReplicaSet→Pod.'),
  P(30, f'Then the networking & config objects: {A("https://kubernetes.io/docs/concepts/services-networking/service/", "Service")} (stable VIP + label selector), {A("https://kubernetes.io/docs/concepts/services-networking/ingress/", "Ingress")}, ConfigMap/Secret.'))

# CS:APP Ch 6 is ~60 pages — 30 min was never that chapter.
price("d09.t1.s1", 45)

split("d10.t1.s1",
  P(25, f'Read PostgreSQL docs {A("https://www.postgresql.org/docs/current/using-explain.html", "14.1 " + chr(34) + "Using EXPLAIN" + chr(34))} — the whole section, running each example.'),
  P(25, f'Then UTIL’s {A("https://use-the-index-luke.com/sql/explain-plan/postgresql", "Postgres execution plans")} — the same output read by someone hunting a slow query.'))

split("d12.t1.s1",
  P(25, f'Read the k8s {A("https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", "scheduler")} — filter → score → bind.'),
  P(25, f'Then {A("https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", "liveness/readiness/startup probes")} — three probes, three different jobs.'))
split("d12.t1.s2",
  P(20, f'Read {A("https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "requests/limits")}.'),
  P(25, f'Then the {A("https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", "HorizontalPodAutoscaler")} — what it scales on, and why it needs requests to be set.'))

split("d13.t1.s1",
  P(30, f'Skim the {A("https://owasp.org/Top10/2025/", "OWASP Top 10 (2025 — the current edition)")}, entries #1–#5: Broken Access Control, Security Misconfiguration, Software Supply-Chain Failures, Cryptographic Failures, Injection.'),
  P(30, 'Then entries #6–#10 of the same list — one line each on what the category means and the one defense that kills most of it.'))
price("d13.t1.s2", 40)

price("d14.t1.s2", 35)

split("d15.t1.s1",
  P(25, f'Read PostgreSQL docs {A("https://www.postgresql.org/docs/current/mvcc-intro.html", "Ch 13.1 Concurrency Control (MVCC)")}.'),
  P(30, f'Then {A("https://www.postgresql.org/docs/current/transaction-iso.html", "13.2 Transaction Isolation")} — the four levels and the anomalies each one still allows.'))

split("d16.t1.s1",
  P(20, f'Read Martin Fowler {A("https://martinfowler.com/bliki/BlueGreenDeployment.html", "BlueGreenDeployment")} (rolling is the k8s default).'),
  P(20, f'Then {A("https://martinfowler.com/bliki/CanaryRelease.html", "CanaryRelease")} — the same cut-over, done to a slice of traffic.'))
split("d16.t1.s2",
  P(20, f'Read the {A("https://opengitops.dev/", "4 GitOps principles")}.'),
  P(25, f'Then {A("https://12factor.net/", "The Twelve-Factor App")} — esp. III config in env, VI stateless, IX disposability, XI logs to stdout.'))

split("d17.t1.s1",
  P(40, f'Read <i>Mastering Ethereum</i> (2nd ed, free) {A("https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_4.md", "Ch 4 " + chr(34) + "Cryptography" + chr(34))} — keys, addresses, and signing.'),
  P(30, f'Then the Merkle-tree section of <i>Mastering Bitcoin</i> (3rd ed) {A("https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch11_blockchain.adoc", "Ch 11")} — how a root commits to every transaction under it.'))

split("d18.t1.s1",
  P(25, f'Read HPBN {A("https://hpbn.co/http1x/", "HTTP/1.X")}: persistent connections, and why pipelining failed.'),
  P(35, f'Then {A("https://hpbn.co/http2/", "HTTP/2")}: multiplexing, the binary framing layer, and HPACK.'))
split("d18.t1.s2",
  P(25, f'For H3/QUIC, read the free {A("https://http3-explained.haxx.se/", "HTTP/3 explained")} through the QUIC transport chapters: reliable multiplexed streams over <b>UDP</b>, TLS 1.3 built in.'),
  P(25, 'Finish the same book: the HTTP/3 mapping itself, plus connection migration and 0-RTT.'))

split("d19.t1.s1",
  P(20, f'Read the Redis {A("https://redis.io/docs/latest/develop/get-started/faq/", "FAQ")} — the single-thread rationale, in their own words.'),
  P(20, f'Then the {A("https://redis.io/docs/latest/develop/data-types/", "data types")} overview — strings, hashes, lists, sets, sorted sets, streams, HLL.'))

Q = chr(34)
# ---------------- weeks 7–16 ----------------
split("d20.t1.s1",
  P(35, f'Read DDIA <b>Ch 7 {Q}Weak Isolation Levels{Q}</b> as far as <b>Snapshot Isolation</b> (Read Committed → SI, and the reads each one can still see).'),
  P(35, 'Finish DDIA Ch 7: Preventing Lost Updates, then Write Skew & Phantoms.'))

split("d21.t1.s1",
  P(30, f'Read Google SRE (free) {A("https://sre.google/sre-book/monitoring-distributed-systems/", "Ch 6 " + Q + "Monitoring Distributed Systems" + Q)} to the end of the <b>Four Golden Signals</b> (Latency, Traffic, Errors, Saturation).'),
  P(30, 'Finish SRE Ch 6: choosing a resolution, keeping alerts simple, and the long-term-vs-short-term tension.'))

split("d22.t1.s1",
  P(40, f'Read <i>Mastering Ethereum</i> {A("https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_14.md", "Ch 14 " + Q + "The EVM" + Q)} — the machine, its data locations, and gas.'),
  P(25, f'Then explore {A("https://www.evm.codes/", "evm.codes")} — per-opcode gas in a live playground; run a few opcodes by hand.'))

split("d23.t1.s1",
  P(35, f'Read DDIA <b>Ch 11</b> {Q}Messaging Systems{Q} → {Q}Partitioned Logs{Q}.'),
  P(35, f'Then Jay Kreps’ {A("https://web.archive.org/web/20260609223006/https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying", Q + "The Log" + Q)} (archived — LinkedIn removed the original) — long, and worth it.'))

split("d25.t1.s1",
  P(35, f'Read the OAuth {A("https://www.rfc-editor.org/rfc/rfc6749", "RFC 6749")} authorization-code flow (§4.1) — who redirects whom, and which secret travels on which channel.'),
  P(25, f'Then {A("https://www.rfc-editor.org/rfc/rfc7636", "PKCE (RFC 7636)")} — the code_challenge/code_verifier pair and the attack it closes.'),
  P(30, f'Then PortSwigger’s {A("https://portswigger.net/web-security/jwt", "JWT attacks")} lab pages — alg=none, key confusion, and unverified signatures.'))

split("d27.t1.s1",
  P(20, f'Read Solana docs {A("https://solana.com/docs/core/accounts", "Accounts")} — everything, including code, is an account.'),
  P(20, f'Then {A("https://solana.com/docs/core/programs", "Programs")} — executable accounts that hold no state of their own.'))

split("d30.t1.s1",
  P(30, f'Read <i>Mastering Ethereum</i> {A("https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_6.md", "Ch 6 " + Q + "Transactions" + Q)} — the fields, RLP encoding, and the signature.'),
  P(25, f'Then {A("https://eips.ethereum.org/EIPS/eip-1559", "EIP-1559")} itself — base fee, tip, and the burn.'))

split("d31.t1.s1",
  P(30, f'Read <i>Kafka: The Definitive Guide</i> (2nd ed, {A("https://www.confluent.io/resources/kafka-the-definitive-guide-v2/", "free from Confluent")}) <b>Ch 1</b> — the log, the broker, the vocabulary.'),
  P(35, 'Then <i>Kafka: The Definitive Guide</i>\u2019s <b>internals</b> chapter — the controller, replication, and how a request is handled.'),
  P(35, 'Then <i>Kafka: The Definitive Guide</i>\u2019s <b>reliable data delivery</b> chapter — acks, in-sync replicas, and what each setting costs.'))

split("d33.t1.s1",
  P(25, f'Read the AWS {A("https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html", "caching patterns")} whitepaper page — cache-aside vs write-through vs write-behind.'),
  P(30, f'Then the Redis {A("https://redis.io/docs/latest/develop/reference/eviction/", "eviction")} and {A("https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/", "persistence (RDB/AOF)")} pages — what a cache drops, and what it keeps across a restart.'))

split("d34.t1.s1",
  P(30, f'Read Solana docs {A("https://solana.com/docs/core/pda", "PDAs")} + {A("https://solana.com/docs/core/cpi", "CPIs")} — program-owned addresses, and one program calling another.'),
  P(30, f'Then {A("https://solana.com/docs/core/fees/compute-budget", "Compute Budget")} and the {A("https://docs.anza.xyz/validator/runtime", "Sealevel runtime")} — the budget an instruction gets, and how the runtime parallelizes.'))

split("d36.t1.s1",
  P(35, f'Read <i>Mastering Bitcoin</i> (3rd ed) {A("https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch12_mining.adoc", "Ch 12 " + Q + "Mining and Consensus" + Q)} as far as difficulty retargeting — PoW and the puzzle itself.'),
  P(30, 'Finish Ch 12: assembling and validating a block, and why the best chain is the one with the most cumulative work.'))
split("d36.t1.s2",
  P(25, f'Read ethereum.org {A("https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/gasper/", "Gasper")} — Casper FFG finality + the LMD-GHOST fork choice.'),
  P(25, f'Then Vitalik’s {A("https://blog.ethereum.org/2016/05/09/on-settlement-finality", Q + "On Settlement Finality" + Q)} — what {Q}final{Q} can and cannot mean.'))

split("d38.t1.s1",
  P(25, f'Read the Solidity docs {A("https://docs.soliditylang.org/en/latest/security-considerations.html", "Security Considerations")} — checks-effects-interactions, and the rest of the list.'),
  P(25, f'Then samczsun’s {A("https://samczsun.com/so-you-want-to-use-a-price-oracle/", Q + "So you want to use a price oracle" + Q)} — a tour of how each naive price source gets drained.'))

split("d39.t1.s1",
  P(40, f'Read the Raft paper (Extended Version) {A("https://raft.github.io/raft.pdf", Q + "In Search of an Understandable Consensus Algorithm" + Q)} (Ongaro & Ousterhout) §5.1–§5.3 — leader election and log replication.'),
  P(35, 'Finish §5 of the Raft paper: safety (the election restriction), follower/candidate crashes, and timing.'))

split("d41.t1.s1",
  P(40, f'Read OSTEP (free) {A("https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf", "Ch 18 " + Q + "Paging: Introduction" + Q)} — page tables, and why the naive version is too slow.'),
  P(35, f'Then {A("https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf", "Ch 19 " + Q + "Paging: Faster Translations (TLBs)" + Q)} — the cache that makes paging affordable.'))

split("d42.t1.s1",
  P(30, f'Read ethereum.org {A("https://ethereum.org/en/developers/docs/scaling/", "Scaling")} — the rollup model: execute off-chain, settle on L1.'),
  P(30, 'Then the same page’s optimistic-vs-ZK sections — fraud proofs (and their challenge window) vs validity proofs.'))

split("d44.t1.s1",
  P(35, f'Read Confluent {A("https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/", Q + "Exactly-Once Semantics… Here" + chr(39) + "s How Kafka Does It" + Q)} — the idempotent producer half.'),
  P(30, f'Finish it (the transactions half), checking the spec where it matters: {A("https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging", "KIP-98")}.'))

split("d45.t1.s1",
  P(40, f'Skim Lamport, {A("https://lamport.azurewebsites.net/pubs/paxos-simple.pdf", Q + "Paxos Made Simple" + Q)} — prepare/promise → accept, and majority quorums.'),
  P(25, f'Then the Raft paper’s {Q}What’s wrong with Paxos?{Q} section — the same problem, argued from the other side.'))

split("d46.t1.s1",
  P(25, f'Read PG docs {A("https://www.postgresql.org/docs/current/storage-toast.html", Q + "TOAST" + Q)} — where an oversized value actually goes.'),
  P(25, f'Then {A("https://www.postgresql.org/docs/current/storage-hot.html", Q + "Heap-Only Tuples (HOT)" + Q)} — the update that skips the indexes.'))

split("d47.t1.s1",
  P(25, f'Read the {A("https://spiffe.io/docs/latest/spiffe-about/overview/", "SPIFFE overview")} — a workload identity (<code>spiffe://…</code>) instead of a shared secret.'),
  P(25, f'Then {A("https://spiffe.io/docs/latest/deploying/svids/", "SVIDs")} — that identity as a short-lived, auto-rotated cert.'))

split("d48.t1.s1",
  P(30, f'Read {A("https://eips.ethereum.org/EIPS/eip-4844", "EIP-4844")} — blob-carrying transactions and the separate blob-gas market.'),
  P(25, f'Then the explainer {A("https://www.eip4844.com/", "eip4844.com")} — the same design with the diagrams.'))

# ---------------- weeks 17–24 ----------------
split("d50.t1.s1",
  P(30, f'Read the Redis {A("https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/", "Cluster spec")} — the 16384 hash slots and how keys map onto them.'),
  P(30, 'Finish the Cluster spec: gossip between nodes, and MOVED vs ASK redirects.'))

split("d51.t1.s1",
  P(30, f'Read Gilbert & Lynch, {A("https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf", Q + "Perspectives on the CAP Theorem" + Q)} (2012) — CAP stated as a safety-vs-liveness trade.'),
  P(30, 'Finish the paper: the proof sketch, and why {0} is the part everyone forgets.'.format(Q + "pick 2 of 3" + Q)))

split("d54.t1.s1",
  P(30, f'Read ethereum.org {A("https://ethereum.org/en/developers/docs/mev/", "MEV")} — where the value comes from, and who extracts it.'),
  P(30, f'Then Flashbots {A("https://docs.flashbots.net/flashbots-mev-boost/introduction", "MEV-Boost")} — builders bid, proposers sign the best, a relay mediates.'))

split("d56.t1.s1",
  P(30, f'Read OpenZeppelin {A("https://docs.openzeppelin.com/upgrades-plugins/proxies", Q + "Proxy Upgrade Pattern" + Q)} — <code>delegatecall</code>, and how storage layouts collide.'),
  P(25, f'Then {A("https://eips.ethereum.org/EIPS/eip-1967", "ERC-1967")} — the standard slots that stop the collision.'))

split("d58.t1.s2",
  P(25, f'Scale-out trade-offs: DDIA <b>Ch 6 {Q}Partitioning{Q}</b> as far as partitioning secondary indexes (key-range vs hash, and skew).'),
  P(25, 'Finish DDIA Ch 6: rebalancing strategies and request routing.'))

split("d59.t1.s1",
  P(40, f'Read {A("https://www.rfc-editor.org/info/rfc9000", "RFC 9000")} (QUIC transport) for the model — connection IDs, streams, and migration.'),
  P(30, f'Then skim {A("https://www.rfc-editor.org/info/rfc9002", "RFC 9002")} — loss detection & congestion control, QUIC’s version of the TCP machinery.'))

split("d60.t1.s1",
  P(40, f'Read {A("https://eips.ethereum.org/EIPS/eip-4337", "ERC-4337")} — UserOperations, bundlers, the EntryPoint, and paymasters.'),
  P(25, f'Then {A("https://eips.ethereum.org/EIPS/eip-7702", "EIP-7702")} — an EOA delegating to contract code, the protocol-level shortcut.'))

split("d62.t1.s1",
  P(25, f'Read {A("https://slsa.dev/spec/", "SLSA")} — the build/source provenance levels, and what each one actually requires.'),
  P(30, f'Then {A("https://docs.sigstore.dev/about/overview/", "Sigstore")} — keyless signing with Cosign + Fulcio + Rekor.'))

split("d63.t1.s2",
  P(30, f'Then the Saga original: Garcia-Molina & Salem, {A("https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf", Q + "Sagas" + Q)} (1987).'),
  P(20, f'Then {A("https://microservices.io/patterns/data/saga.html", "microservices.io Saga")} — the same idea as people actually deploy it.'))

split("d64.t1",
  P(40, f'Read PG docs {A("https://www.postgresql.org/docs/current/high-availability.html", Q + "High Availability… and Replication" + Q)} — streaming replication, and what synchronous really costs.', refs=None),
  P(35, f'Then {A("https://www.postgresql.org/docs/current/logical-replication.html", Q + "Logical Replication" + Q)} — row-level changes over a publication/subscription, and what it can’t carry.', refs=None))

split("d65.t1",
  P(40, f'Read Debezium, {A("https://debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/", Q + "Reliable Microservices Data Exchange With the Outbox Pattern" + Q)} — one local transaction, then the log does the rest.', refs=None),
  P(35, f'Then the {A("https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html", "Outbox Event Router")} SMT docs — the pattern as a running piece of configuration.', refs=None))

split("d66.t1.s1",
  P(35, f'Read Vitalik, {A("https://vitalik.eth.limo/general/2017/02/01/zk_snarks.html", Q + "zk-SNARKs: Under the Hood" + Q)} as far as the QAP — computation → circuit → R1CS → QAP.'),
  P(30, 'Finish the post: the pairing check, and where the trusted setup enters.'))

split("d67.t1",
  P(30, f'Read antirez’s {A("https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/", "Redlock")} spec — the algorithm as proposed.', refs=None),
  P(30, f'Then Kleppmann’s critique {A("https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html", Q + "How to do distributed locking" + Q)} — fencing tokens, and clocks you can’t trust.', refs=None),
  P(25, f'Then antirez’s {A("https://antirez.com/news/101", "rebuttal")} — and decide for yourself which assumption you’re willing to make.', refs=None))

split("d68.t1",
  P(45, f'Read {A("https://unixism.net/loti/", Q + "Lord of the io_uring" + Q)} — the SQE/CQE ring model, submission, and completion.', refs=None),
  P(35, f'Then LWN {A("https://lwn.net/Articles/810414/", Q + "The rapid growth of io_uring" + Q)} — what it grew to cover, and the security surface that came with it.', refs=None))

split("d69.t1",
  P(40, f'Read the Dynamo paper, {A("https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf", Q + "Dynamo: Amazon" + chr(39) + "s Highly Available Key-value Store" + Q)} (SOSP 2007) §4.1–§4.5 — consistent hashing, replication, and versioning with vector clocks.', refs=None),
  P(40, 'Finish the Dynamo paper: quorums (R + W > N), hinted handoff, anti-entropy with Merkle trees, and the production lessons in §6.', refs=None))

split("d70.t1.s1",
  P(35, f'Read DDIA <b>Ch 3 {Q}Storage and Retrieval{Q}</b> through SSTables & LSM-Trees.'),
  P(30, 'Finish DDIA Ch 3: B-Trees, and the comparison (write/read/space amplification).'))

split("d71.t1",
  P(40, f'Read the Cilium {A("https://docs.cilium.io/en/stable/reference-guides/bpf/", Q + "BPF and XDP Reference Guide" + Q)} — maps, program types, and the hook points.', refs=None),
  P(35, f'Then the eBPF docs {A("https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_XDP/", "XDP program type")} — packets handled before the kernel builds an skb.', refs=None))
split("d71.t2",
  P(30, f'Skim the kernel’s {A("https://docs.kernel.org/bpf/verifier.html", "eBPF verifier")} doc — a static analysis that must prove termination and memory safety before your program loads.', refs=None),
  P(25, f'Then the verify-then-JIT half of {A("https://ebpf.io/what-is-ebpf/", Q + "What is eBPF?" + Q)} — the same pipeline, end to end.', refs=None))

split("d72.t1",
  P(40, f'Read the {A("https://github.com/firedancer-io/firedancer", "Firedancer")} repo/README — a second validator implementation, and why that matters for client diversity.', refs=None),
  P(35, f'Then the {A("https://docs.anza.xyz/", "Anza docs")}, and follow Anza’s Alpenglow announcement for the consensus change.', refs=None))

# ---------------- weeks 24–32 ----------------
# R(i) = take this part's label verbatim from the task's own i-th reference line.
def R(est, i, **kw): return dict(est=est, fromRef=i, **kw)

split("d73.t1.s1",
  P(25, f'Read cppreference {A("https://en.cppreference.com/w/cpp/atomic/memory_order", "std::memory_order")} — the six orderings, as specified.'),
  P(25, f'Then Preshing, {A("https://preshing.com/20120913/acquire-and-release-semantics/", Q + "Acquire and Release Semantics" + Q)} — the same thing explained so it sticks.'))
split("d73.t2",
  P(30, f'Read the {A("https://en.wikipedia.org/wiki/As-if_rule", "as-if rule")} — C/C++ {Q}observable behavior{Q}, and everything a compiler may do around it.', refs=None),
  P(25, f'Then {A("https://en.wikipedia.org/wiki/Register_allocation", "register allocation")} — one concrete optimization the compiler runs on your IR.', refs=None))

split("d74.t1",
  P(35, f'Read Flink {A("https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/", Q + "Timely Stream Processing" + Q)} — event time vs processing time, and watermarks.', refs=None),
  P(45, f'Then the Google {A("https://www.vldb.org/pvldb/vol8/p1792-Akidau.pdf", "Dataflow model paper")} (Akidau et al., 2015) — what/where/when/how, the framework behind all of it.', refs=None))

split("d75.t1",
  P(25, f'Read Brendan Gregg: {A("https://www.brendangregg.com/flamegraphs.html", "Flame Graphs")} — how to read one, and how to generate one.', refs=None),
  P(25, f'Then {A("https://www.brendangregg.com/perf.html", "perf examples")} — the commands you would actually run on a hot box.', refs=None),
  P(25, f'Then {A("https://www.brendangregg.com/ebpf.html", "eBPF tracing tools")} — the same questions answered with far less overhead.', refs=None))

split("d76.t1",
  P(45, f'Read {A("https://eips.ethereum.org/EIPS/eip-712", "EIP-712")} — typed structured signing and the domain separator that binds a signature to one contract and chain.', refs=None),
  P(35, f'Then {A("https://eips.ethereum.org/EIPS/eip-2612", "EIP-2612 permit")} — the same machinery used to replace an approve transaction.', refs=None))

price("d79.t1.s1", 40)

split("d81.t2",
  P(35, f'Read V8\u2019s {A("https://v8.dev/blog/launching-ignition-and-turbofan", Q + "Launching Ignition and TurboFan" + Q)} — the interpreter/optimizer pair, and why both exist.', refs=None),
  P(30, f'Then skim {A("https://v8.dev/blog/maglev", "Maglev")} — the mid-tier added between Sparkplug and TurboFan, and what it is for.', refs=None))

split("d82.t1.s2",
  P(25, f'Read the {A("https://go.dev/doc/gc-guide", "Go GC guide")} — the knobs, and the cost model behind them.'),
  P(25, f'Then Rick Hudson’s {A("https://go.dev/blog/ismmkeynote", Q + "Getting to Go" + Q)} — a real low-latency concurrent collector, and what it took.'))

split("d83.t1.s1",
  P(25, f'Read Doug Lea’s {A("https://gee.cs.oswego.edu/dl/html/malloc.html", Q + "A Memory Allocator" + Q)} — dlmalloc, the design behind glibc.'),
  P(25, f'Then Google’s {A("https://google.github.io/tcmalloc/design.html", "tcmalloc design")} — per-thread caches and size classes, for the multithreaded case.'))

split("d84.t1.s1",
  P(25, f'Read {A("https://floating-point-gui.de/", "floating-point-gui.de")} for the intuition — why the format can’t hold 0.1.'),
  P(35, f'Then skim Goldberg’s canonical {A("https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html", Q + "What Every Computer Scientist Should Know About Floating-Point Arithmetic" + Q)} — rounding, guard digits, and cancellation.'))

split("d85.t1.s1",
  P(25, f'Read the {A("https://docs.oracle.com/en/java/javase/21/vm/", "Java Virtual Machine Guide")} — HotSpot compilation, as the vendor documents it.'),
  P(25, f'Then OpenJDK’s {A("https://wiki.openjdk.org/display/HotSpot/", "HotSpot wiki")} — tiered compilation and deoptimization.'))

split("d86.t1.s1",
  P(25, f'Read Joel Spolsky’s {A("https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/", Q + "The Absolute Minimum… about Unicode" + Q)}.'),
  P(25, f'Then the {A("https://utf8everywhere.org/", "UTF-8 Everywhere")} manifesto — one encoding, and the bugs that picking another one buys you.'))

split("d87.t1.s1",
  P(20, f'Read the famous {A("https://stackoverflow.com/questions/11227809/", Q + "Why is processing a sorted array faster?" + Q)} answer.'),
  P(30, f'Then Dan Luu’s {A("https://danluu.com/branch-prediction/", "branch-prediction")} walkthrough — how predictors actually got good.'))

split("d88.t1.s1",
  P(30, f'Read the {A("https://en.wikipedia.org/wiki/Bloom_filter", "Bloom filter")} overview — the math, the false-positive rate, and where it is used.'),
  P(20, f'Then play with the {A("https://llimllib.github.io/bloomfilter-tutorial/", "interactive visual tutorial")} until the bit pattern is obvious.'))

split("d89.t1", R(45, 0), R(30, 1))
split("d90.t1", R(30, 0), R(35, 1))
split("d91.t1",
  P(35, f'Read Crafting Interpreters {A("https://craftinginterpreters.com/scanning.html", Q + "Scanning" + Q)} — characters to tokens, and why tokens are regular.', refs=None),
  P(35, f'Then {A("https://craftinginterpreters.com/parsing-expressions.html", Q + "Parsing Expressions" + Q)} — recursive descent, and precedence as grammar shape.', refs=None),
  R(30, 1))
split("d92.t1",
  P(30, f'Read the {A("https://github.com/golang/go/blob/master/src/cmd/compile/README.md", Q + "Introduction to the Go compiler" + Q)} (cmd/compile README) through type-checking (also on {A("https://go.dev/src/cmd/compile/README", "go.dev")}).', refs=None),
  P(30, 'Finish the README: the SSA phases and machine-code generation.', refs=None))
split("d93.t1",
  P(35, f'Read Crafting Interpreters {A("https://craftinginterpreters.com/evaluating-expressions.html", Q + "Evaluating Expressions" + Q)} — walk the tree, produce a value.', refs=None),
  P(35, f'Then {A("https://craftinginterpreters.com/statements-and-state.html", Q + "Statements and State" + Q)} — environments and lexical scope.', refs=None),
  R(30, 1))
split("d94.t1", R(35, 0), R(30, 1))
split("d95.t1",
  P(35, f'Read Crafting Interpreters {A("https://craftinginterpreters.com/a-bytecode-virtual-machine.html", Q + "Chunks of Bytecode" + Q)} — a flat instruction array instead of a tree.', refs=None),
  P(35, f'Then {A("https://craftinginterpreters.com/a-virtual-machine.html", Q + "A Virtual Machine" + Q)} — the stack and the dispatch loop.', refs=None),
  R(30, 1))
split("d96.t1", R(30, 0), R(45, 1))
split("d97.t1",
  P(30, f'Read {A("https://en.wikipedia.org/wiki/Static_single-assignment_form", "Static single-assignment form")} — why every serious optimizer converts to it.', refs=None),
  P(30, f'Then {A("https://en.wikipedia.org/wiki/Register_allocation", "register allocation")} — graph-colouring and linear scan.', refs=None),
  R(30, 1))

if __name__ == "__main__":
    import sys, os
    json.dump(E, open(os.path.join(os.path.dirname(__file__), "edits/bedrock.json"), "w"), indent=1, ensure_ascii=False)
    print(f"{len(E)} bedrock leaf decisions")
