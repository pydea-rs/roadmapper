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
t.eq(q0.type, "video", "rng<0.7 selects a video query");
t.eq(finder.deriveQuery(rm, tasks, { rng: konst(0) }).q, q0.q,
  "same rng ⇒ identical query (deterministic)");
t.eq(finder.deriveQuery(rm, tasks, { rng: konst(0.9) }).type, "article",
  "rng≥0.7 selects an article query");
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

t.done();
