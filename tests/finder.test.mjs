// finder.test.mjs — the "Watch / read next" discovery widget. Covers the PURE
// query-derivation pipeline (buildPool / deriveQuery / pickResult) with a
// deterministic rng, and the security posture of resultCard: external scrape
// data is text/href-only and dangerous URL schemes (javascript:/data:) are
// rejected. Needs jsdom for resultCard (it builds DOM); skips cleanly without.
import { suite } from "./_harness.mjs";

const t = suite("finder");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body></body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;

const base = new URL("../public/assets/js/", import.meta.url);
const finder = await import(new URL("finder.js", base).href);

/* a small helper: an rng that always returns the same constant */
const konst = k => () => k;

t.group("buildPool — codes / unigrams / bigrams from task text");
const tasks = [
  { lead: "Smart pointers intro",
    label: "Implement the <code>Arc</code> smart pointer and share across smart threads",
    subs: [{ label: "compare with <code>Vec</code> ownership" }, { note: "smart pointers, again and again" }] },
  { label: "Review smart pointers and the 2 patterns" },
];
const pool = finder.buildPool(tasks);
t.deep(pool.codes, ["Arc", "Vec"], "<code> identifiers are extracted in order, highest-signal");
t.ok(pool.unigrams.includes("smart") && pool.unigrams.includes("pointers"),
  "content words survive into the unigram list");
t.eq(pool.unigrams[0], "smart", "the most frequent keyword sorts to the front");
t.ok(!pool.unigrams.includes("the") && !pool.unigrams.includes("and") && !pool.unigrams.includes("with"),
  "stopwords are dropped");
t.ok(!pool.unigrams.includes("2") && pool.unigrams.every(w => !/^\d+$/.test(w)),
  "bare numbers are dropped");
t.ok(pool.bigrams.includes("smart pointers"), "adjacent-word phrases become bigrams");
t.ok(finder.buildPool([]).unigrams.length === 0, "an empty task set yields an empty pool (no throw)");

t.group("deriveQuery — anchored, bounded, deterministic");
const rm = { slug: "rust-fastapi" };
const q0 = finder.deriveQuery(rm, tasks, { rng: konst(0) });
t.eq(q0.q.split(" ")[0], "rust", "the query is anchored on the roadmap's own tech (slug)");
t.ok(q0.q.split(/\s+/).length <= 6, "the query is capped at six words");
t.eq(q0.type, "video", "rng<0.65 selects a video query");
t.eq(finder.deriveQuery(rm, tasks, { rng: konst(0) }).q, q0.q,
  "same rng ⇒ identical query (deterministic)");
t.eq(finder.deriveQuery(rm, tasks, { rng: konst(0.9) }).type, "article",
  "rng≥0.65 selects an article query");
const qEmpty = finder.deriveQuery({ slug: "raylib" }, [], { rng: konst(0) });
t.eq(qEmpty.q, "raylib", "with no task text the query falls back to the roadmap anchor");
t.ok(finder.deriveQuery({}, [], { rng: konst(0) }).q, "a slug-less roadmap still yields a non-empty query");

t.group("pickResult — one of the top few, safe on empties");
const results = [{ title: "a" }, { title: "b" }, { title: "c" }, { title: "d" }];
t.eq(finder.pickResult(results, konst(0)).title, "a", "rng 0 picks the first of the top three");
t.eq(finder.pickResult(results, konst(0.99)).title, "c", "rng→1 picks the third (top three only, never the 4th)");
t.eq(finder.pickResult([], konst(0)), undefined, "an empty result set yields undefined (caller guards)");

t.group("resultCard — external scrape data is inert (no markup/scheme injection)");
const evil = finder.resultCard(
  { title: "<img src=x onerror=alert(1)>", url: "javascript:alert(1)", thumb: "javascript:void(0)", source: "evil" },
  { topic: "Rust", type: "video" });
t.eq(evil.getAttribute("href"), "#", "a javascript: url is rejected (href neutralised to #)");
const titleEl = evil.querySelector(".fr-title");
t.eq(titleEl.textContent, "<img src=x onerror=alert(1)>", "the title is set as TEXT, verbatim");
t.eq(titleEl.children.length, 0, "the title injects no child elements (no <img> smuggled in)");
t.ok(evil.querySelector(".fr-thumb.noimg"), "a javascript: thumbnail is refused (falls back to noimg)");
t.ok(!evil.querySelector("img"), "no <img> is created for a dangerous thumb src");

const dataUrl = finder.resultCard({ title: "x", url: "data:text/html,<script>1</script>" }, {});
t.eq(dataUrl.getAttribute("href"), "#", "a data: url is rejected too");

const good = finder.resultCard(
  { title: "Real Video", url: "https://youtube.com/watch?v=1", thumb: "https://img/x.jpg", source: "YouTube" },
  { topic: "Rust", type: "video" });
t.eq(good.getAttribute("href"), "https://youtube.com/watch?v=1", "a valid https url is kept");
t.eq(good.getAttribute("target"), "_blank", "external links open in a new tab");
t.eq(good.getAttribute("rel"), "noopener noreferrer", "external links carry a safe rel");
t.ok(good.querySelector("img.fr-img"), "a valid https thumbnail renders an <img>");
t.ok(good.classList.contains("video"), "a video result carries the .video class");

const article = finder.resultCard({ title: "Doc", url: "https://x.dev/a" }, { type: "article", isSearch: true });
t.ok(article.classList.contains("article"), "an article result carries the .article class");
t.ok(article.querySelector(".fr-kicker").textContent.startsWith("Search"),
  "the isSearch flag labels the kicker as a Search fallback");
t.eq(finder.resultCard({ url: "https://x.dev/a" }, {}).querySelector(".fr-title").textContent, "Untitled",
  "a missing title degrades to 'Untitled', never blank/undefined");

/* ---- the multi-strategy retry engine (added to cut the finder's failure rate) ---- */

// a tiny roadmap whose task text carries distinctive terms + <code> identifiers
const mkRm = (slug, objTitles, taskLabels, dates) => ({
  slug,
  objectives: objTitles.map((ti, i) => ({ id: "o" + i, title: ti })),
  days: taskLabels.map((label, i) => ({
    date: (dates && dates[i]) || "2026-08-0" + ((i % 9) + 1),
    tasks: [{ id: "d" + i + ".t1", obj: "o0", label }],
  })),
});
const goRm = mkRm("interp-go",
  ["The Go interpreter", "Web with chi"],
  ["Build a <code>Lexer</code> for the Lox language in Go", "Wire the <code>chi</code> router; compare echo"],
  ["2026-08-04", "2026-08-11"]);

t.group("rootWords — primary tech terms mined from slug + objectives + task pool");
const roots = finder.rootWords(goRm);
t.ok(roots.some(w => w.toLowerCase() === "go"), "slug token 'go' is a root");
t.ok(roots.some(w => w.toLowerCase() === "golang"), "the slug expansion 'golang' is added");
t.ok(roots.some(w => /lexer|lox|chi/i.test(w)), "high-signal task terms (Lexer/Lox/chi) surface as roots");
t.ok(roots.length >= 3, "several roots are gathered");
t.ok(finder.rootWords({}).length === 0, "a shapeless roadmap yields no roots (no throw)");

t.group("rootQuery — one or two broad tech words, anchored, safe on empties");
const rq = finder.rootQuery(goRm, { rng: konst(0) });
t.ok(rq.q && rq.q.split(/\s+/).length <= 3, "roots query is short (1–3 words)");
t.ok(rq.type === "video" || rq.type === "article", "roots query carries a type");
t.ok(finder.rootQuery({ slug: "raylib" }, { rng: konst(0) }).q, "a bare-slug roadmap still yields a roots query");

t.group("multiQuery — a salient term from two different roadmaps");
const rustRm = mkRm("rust-fastapi", ["Rust"], ["Use <code>Tokio</code> for async runtime tasks"], ["2026-08-04"]);
const mq = finder.multiQuery(
  [{ rm: goRm, tasks: goRm.days.flatMap(d => d.tasks) }, { rm: rustRm, tasks: rustRm.days.flatMap(d => d.tasks) }],
  { rng: konst(0) });
t.ok(mq.q && mq.q.split(/\s+/).length <= 6, "multi query is bounded to six words");
t.ok(mq.q.length > 0, "multi query is non-empty");

t.group("freshQueries — reliable fresh-content fallbacks, tech-anchored");
const fresh = finder.freshQueries(goRm, { rng: konst(0), year: "2026" });
t.ok(Array.isArray(fresh) && fresh.length >= 5, "several fallback templates are offered");
t.ok(fresh.every(f => f.q && (f.type === "video" || f.type === "article")), "every fallback has a query + type");
t.ok(fresh.some(f => /news today/i.test(f.q)), "includes a 'news today' style always-fresh query");
t.ok(fresh.some(f => /interp/i.test(f.q) && /release|new/i.test(f.q)), "includes a tech-anchored release/update query");
t.ok(fresh.some(f => f.q.includes("2026")), "the year is woven into at least one fallback");
t.ok(fresh.every(f => !/\s{2,}|\s$/.test(f.q)), "no fallback query has doubled/trailing spaces when year is blank-safe");
t.ok(finder.freshQueries(goRm, { rng: konst(0), year: "" }).every(f => f.q && !/\s$/.test(f.q)),
  "a blank year never leaves a dangling space");

t.group("buildPlan — 2 on-topic tries then reliable fallbacks");
const groups = [
  { rm: goRm, tasks: goRm.days.flatMap(d => d.tasks) },
  { rm: rustRm, tasks: rustRm.days.flatMap(d => d.tasks) },
];
const plan = finder.buildPlan(groups, { today: "2026-08-10", year: "2026", rng: konst(0) });
t.ok(plan.attempts.length === 4, "the plan is exactly four tries (2 on-topic + 2 fallback)");
t.ok(plan.attempts.every(a => typeof a === "function"), "each attempt is a lazy thunk");
const specs = plan.attempts.map(a => a());
t.ok(specs.every(s => s && s.q && (s.type === "video" || s.type === "article")), "every attempt resolves to a valid {q,type}");
t.ok(specs.slice(2).some(s => /news|release|tips|ideas|new in/i.test(s.q)), "the tail tries are fresh-content fallbacks");
t.ok(!!plan.primary && !!plan.primary.rm, "the plan names a primary roadmap");
const solo = finder.buildPlan([groups[0]], { today: "2026-08-10", rng: konst(0) });
t.ok(solo.attempts.length === 4, "a single-roadmap plan still yields four tries (no multi-roadmap strategy needed)");

t.group("runPlan — retry policy: real result wins, search page is the last resort");
// helper: turn a list of canned responses into a searchFn that records calls
const scripted = (...responses) => {
  const calls = [];
  const fn = (q, type) => { calls.push({ q, type }); return Promise.resolve(responses[calls.length - 1]); };
  fn.calls = calls;
  return fn;
};
const spec = (q, type = "video") => () => ({ q, type, topic: "T" });
const FETCHED = { ok: true, fetched: true, results: [{ title: "hit", url: "https://x/1" }] };
const MISSED = { ok: true, fetched: false, results: [] };
const DOWN = { ok: false };

// 1) first try already returns a real result → stop immediately, one call only
{
  const fn = scripted(FETCHED, FETCHED);
  const out = await finder.runPlan([spec("a"), spec("b"), spec("c"), spec("d")], fn);
  t.eq(out.kind, "result", "a real result is returned");
  t.eq(out.pick.r.title, "hit", "…carrying the scraped item");
  t.eq(fn.calls.length, 1, "no further tries once a real result lands");
}
// 2) two on-topic misses, then a fallback hits → real result, backup NOT used
{
  const fn = scripted(MISSED, MISSED, FETCHED, FETCHED);
  const out = await finder.runPlan([spec("m1"), spec("m2"), spec("fb1"), spec("fb2")], fn);
  t.eq(out.kind, "result", "a later fallback still yields a real result");
  t.eq(fn.calls.length, 3, "it kept trying past the misses until the hit");
  t.eq(out.pick.isSearch, undefined, "a real result is not a search-page card");
}
// 3) every try misses (scrape failed) → search-page card built from the FIRST query
{
  const fn = scripted(MISSED, MISSED, MISSED, MISSED);
  const out = await finder.runPlan([spec("first"), spec("second"), spec("third"), spec("fourth")], fn);
  t.eq(out.kind, "search", "all-miss falls back to a deep-link card");
  t.ok(out.pick.isSearch, "…flagged as a search card");
  t.ok(/first/.test(out.pick.r.url), "the backup is the FIRST (most on-topic) query, not a later one");
}
// 4) proxy down (hard !ok) → bail after two consecutive failures, nothing shown
{
  const fn = scripted(DOWN, DOWN, FETCHED, FETCHED);
  const out = await finder.runPlan([spec("a"), spec("b"), spec("c"), spec("d")], fn);
  t.eq(out.kind, "none", "two hard failures ⇒ give up (proxy is down)");
  t.eq(fn.calls.length, 2, "it stops after two hard failures — no needless hammering");
}
// 5) a transient hard failure between soft misses does NOT abort the run
{
  const fn = scripted(MISSED, DOWN, FETCHED);
  const out = await finder.runPlan([spec("a"), spec("b"), spec("c"), spec("d")], fn);
  t.eq(out.kind, "result", "an isolated error is shrugged off; the run continues to a hit");
  t.eq(fn.calls.length, 3, "all three tries ran (the single !ok didn't trip the 2-in-a-row bail)");
}
// 6) a searchFn that throws is treated as a hard failure, never propagates
{
  const fn = () => Promise.reject(new Error("network"));
  const out = await finder.runPlan([spec("a"), spec("b")], fn);
  t.eq(out.kind, "none", "a thrown searchFn is absorbed (no unhandled rejection)");
}
// 7) maxTries caps the number of network calls
{
  const fn = scripted(MISSED, MISSED, MISSED, MISSED, MISSED);
  await finder.runPlan([spec("a"), spec("b"), spec("c"), spec("d"), spec("e")], fn, { maxTries: 3 });
  t.eq(fn.calls.length, 3, "maxTries bounds the attempts");
}

t.done();
