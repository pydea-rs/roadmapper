// finder.js — "Watch / read next": a small, dependency-free discovery widget for
// the Today view. It reads the text of today's (and recent) tasks, distils a
// search query from the concepts in them — NO LLM, just weighted keyword
// extraction — and asks the backend proxy (sync.search) for a related video or
// article to surface.
//
// The backend scrape (YouTube / DuckDuckGo HTML) is best-effort and fails a fair
// share of the time — a consent wall, changed markup, or an unparseable page all
// come back as `fetched:false`. A single query therefore misses often, so this
// module does NOT rely on one shot: each open runs a small PLAN of attempts —
// two on-topic queries drawn (at random) from several strategies, then a couple
// of high-reliability "fresh content" fallbacks (release notes / news / tips)
// that almost always parse. The first attempt to return a real single result
// wins immediately; only if the whole plan misses do we fall back to a
// deep-link-to-results card (and we keep the FIRST, most on-topic one for that).
// A few seconds across up to four tries is fine — the loading state covers it.

import { el } from "./util.js";
import * as sync from "./sync.js";
import { toast } from "./ui.js";
import { dayDate } from "./stats.js";
import { isBookmarked, toggleBookmark } from "./bookmarks.js";

/* ---------- text → keyword pool (pure) ---------- */

// Very small stopword set — enough to keep queries on-topic without a big list.
const STOP = new Set((
  "the a an and or of to in on for with your you it its as at by from into over " +
  "under is are be this that these those we our will can may not but if then so " +
  "do does done make made get got use used using via than while when where which " +
  "each one two three first second third §"
).split(/\s+/));

const stripTags = s => String(s).replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/gi, " ");
const titleCase = s => String(s).replace(/\b[a-z]/g, c => c.toUpperCase());

// Deterministic-shuffle in place (Fisher–Yates) using an injectable rng.
function shuffle(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Gather the visible text a task contributes: its lead, own label, and — for a
// parent — every sub-task label and note. That's where the concepts live.
function taskText(task) {
  const parts = [];
  if (task.lead) parts.push(task.lead);
  if (task.label) parts.push(task.label);
  if (task.subs) for (const s of task.subs) { if (s.label) parts.push(s.label); if (s.note) parts.push(s.note); }
  return parts.join(" ");
}

// Non-optional tasks up to and including `today` (the cumulative concept pool);
// falls back to the whole roadmap when no `today` is given or nothing has landed.
function tasksUpTo(rm, today) {
  const all = [], upto = [];
  for (const d of rm.days || []) for (const t of d.tasks || []) {
    if (t.optional) continue;
    all.push(t);
    if (today && dayDate(rm, rm.slug, d) <= today) upto.push(t);
  }
  return upto.length ? upto : all;
}

/**
 * Build a rich, salience-ordered vocabulary from a set of tasks:
 *   codes    — <code> API/identifier names (highest signal),
 *   unigrams — single keywords by frequency,
 *   bigrams  — adjacent-word PHRASES ("smart pointers", "thread pool"), by freq.
 */
export function buildPool(tasks) {
  const html = (tasks || []).map(taskText).join(" ");

  // <code> spans are API/identifier names — the highest-signal keywords.
  const codes = [];
  const codeRe = /<code>([\s\S]*?)<\/code>/gi;
  let m;
  while ((m = codeRe.exec(html))) {
    const id = (stripTags(m[1]).match(/[A-Za-z][A-Za-z0-9+#]{2,}/) || [])[0];
    if (id && !codes.some(x => x.toLowerCase() === id.toLowerCase())) codes.push(id);
  }

  // Ordered token stream (stopwords / numbers dropped) → unigram + bigram freqs.
  const toks = (stripTags(html).toLowerCase().match(/[a-z][a-z0-9+#]{2,}/g) || [])
    .filter(w => !STOP.has(w) && !/^\d+$/.test(w));
  const uf = new Map(), bf = new Map();
  for (let i = 0; i < toks.length; i++) {
    uf.set(toks[i], (uf.get(toks[i]) || 0) + 1);
    if (i > 0) { const p = toks[i - 1] + " " + toks[i]; bf.set(p, (bf.get(p) || 0) + 1); }
  }
  const unigrams = [...uf.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]);
  const bigrams = [...bf.entries()].filter(e => e[0].length <= 34)
    .sort((a, b) => b[1] - a[1]).map(e => e[0]);
  return { codes, unigrams, bigrams };
}

/* ---------- query strategies (pure) ---------- */

// The first meaningful slug token, the query's stable anchor ("rust", "raylib").
const anchorOf = rm => (String(rm && rm.slug || "").split(/[-_]/).filter(w => w.length > 1))[0] || "";

// A few slug tokens expand to the term people actually search for.
const SLUG_EXPAND = {
  go: "golang", interp: "interpreters", cpp: "c++", js: "javascript",
  ts: "typescript", db: "databases", os: "operating systems",
};

/**
 * ROOT words for a roadmap: the primary, general tech terms — slug tokens (with a
 * couple of expansions), objective titles, and the highest-signal codes/keywords
 * mined across the WHOLE roadmap (this is what surfaces "Lox", "chi", "echo",
 * "shaders", …). Used by the roots strategy and to anchor the fresh-content
 * fallbacks. General on purpose: broad-but-related beats a dead search page.
 */
export function rootWords(rm) {
  const roots = [];
  const add = w => {
    w = String(w == null ? "" : w).trim();
    if (w.length > 1 && !roots.some(x => x.toLowerCase() === w.toLowerCase())) roots.push(w);
  };
  for (const tok of String(rm && rm.slug || "").split(/[-_]/)) {
    if (tok.length > 1) { add(tok); if (SLUG_EXPAND[tok]) add(SLUG_EXPAND[tok]); }
  }
  for (const o of rm && rm.objectives || [])
    for (const w of stripTags(o.title || "").split(/\s+/))
      if (w.length > 2 && !STOP.has(w.toLowerCase())) add(w);
  const pool = buildPool(tasksUpTo(rm, null));
  pool.codes.slice(0, 6).forEach(add);
  pool.unigrams.slice(0, 10).forEach(add);
  return roots;
}

/**
 * Distil a search query from a roadmap and a set of its tasks. Returns
 * { q, type, topic }. Rather than always emitting the same top keywords, it
 * samples the pool (codes / keywords / phrases) through a randomly chosen recipe,
 * so every shuffle yields a different — but still on-topic — query. Always
 * anchored in the roadmap's own tech. `type` is randomised (≈65% video).
 */
export function deriveQuery(rm, tasks, { rng = Math.random } = {}) {
  const { codes, unigrams, bigrams } = buildPool(tasks);
  const anchorWord = anchorOf(rm) || unigrams[0] || "";

  const pick = (list, window = 4) => list.length
    ? list[Math.floor(rng() * Math.min(window, list.length))] : null;

  const parts = [];
  const push = w => { if (w && !parts.some(x => x.toLowerCase() === w.toLowerCase())) parts.push(w); };

  switch (Math.floor(rng() * 6)) {
    case 0: push(anchorWord); push(pick(bigrams)); break;
    case 1: push(anchorWord); push(pick(codes)); push(pick(unigrams)); break;
    case 2: push(anchorWord); push(pick(unigrams)); push(pick(unigrams, 8)); break;
    case 3: push(pick(codes)); push(pick(bigrams)); push(anchorWord); break;
    case 4: push(anchorWord); push(pick(bigrams)); push(pick(unigrams, 6)); break;
    default: push(anchorWord); push(pick(codes) || pick(bigrams)); push(pick(unigrams));
  }
  for (const u of [anchorWord, ...unigrams]) { if (parts.length >= 2) break; push(u); }

  const q = parts.join(" ").split(/\s+/).slice(0, 6).join(" ").trim();
  const type = rng() < 0.65 ? "video" : "article";
  const topic = titleCase(anchorOf(rm) || bigrams[0] || unigrams[0] || "your roadmap");
  return { q: q || anchorWord || String(rm && rm.slug || "roadmap"), type, topic };
}

/** Roots strategy: one or two primary tech words. Broad but reliably related. */
export function rootQuery(rm, { rng = Math.random } = {}) {
  const roots = rootWords(rm);
  if (!roots.length) return deriveQuery(rm, [], { rng });
  const pick = () => roots[Math.floor(rng() * Math.min(roots.length, 8))];
  const a = pick(), b = pick();
  const parts = [a];
  if (b && b.toLowerCase() !== a.toLowerCase()) parts.push(b);
  return { q: parts.join(" ").trim(), type: rng() < 0.5 ? "video" : "article", topic: titleCase(roots[0]) };
}

/** Multi-roadmap strategy: one salient term from each of two different roadmaps. */
export function multiQuery(groups, { rng = Math.random } = {}) {
  const gs = shuffle(groups.slice(), rng).slice(0, 2);
  const terms = [];
  for (const g of gs) {
    const p = buildPool(g.tasks);
    const cand = p.codes[0] || p.bigrams[0] || p.unigrams[0] || anchorOf(g.rm);
    if (cand && !terms.some(x => x.toLowerCase() === cand.toLowerCase())) terms.push(cand);
  }
  const q = terms.join(" ").split(/\s+/).slice(0, 6).join(" ").trim();
  const anchor = anchorOf((gs[0] || {}).rm || {});
  return { q: q || anchor, type: rng() < 0.6 ? "video" : "article", topic: titleCase(anchor || terms[0] || "your roadmaps") };
}

/**
 * Fresh-content FALLBACKS: common phrases that almost always return a parseable
 * page (release notes, news, tips), anchored on the roadmap's primary tech where
 * it helps. Less related to today's exact tasks, so they're used only after the
 * on-topic strategies miss — but they beat a dead search-results link. Returned
 * shuffled; `year` is passed in so the function stays pure/testable.
 */
export function freshQueries(rm, { rng = Math.random, year = "" } = {}) {
  const tech = titleCase(anchorOf(rm) || "programming");
  const y = String(year || "").trim();
  const specs = [
    { q: `latest ${tech} release features`, type: "article", topic: `${tech} releases` },
    { q: `what's new in ${tech} ${y}`.trim(), type: "video", topic: `${tech} updates` },
    { q: "programming news today", type: "article", topic: "Programming news" },
    { q: "tech news today", type: "article", topic: "Tech news" },
    { q: "software security news today", type: "article", topic: "Security news" },
    { q: `${tech} tips and tricks`, type: "video", topic: `${tech} tips` },
    { q: `${tech} project ideas ${y}`.trim(), type: "video", topic: `${tech} projects` },
  ];
  return shuffle(specs, rng);
}

/**
 * Build the ordered attempt plan for one run: pick the primary roadmap (weighted
 * by how much work it has due), then TWO on-topic queries drawn at random from
 * the strategy set (today / cumulative / multi-roadmap / roots), followed by the
 * fresh-content fallbacks. The caller tries them in order and stops at the first
 * real result. Every element is a thunk so the rng is only spent when reached.
 */
export function buildPlan(groups, { today = null, year = "", rng = Math.random } = {}) {
  // weight the primary pick by task load so shuffles draw across all of today.
  const total = groups.reduce((s, x) => s + x.tasks.length, 0) || 1;
  let r = rng() * total, primary = groups[groups.length - 1];
  for (const g of groups) { r -= g.tasks.length; if (r <= 0) { primary = g; break; } }

  const mains = [
    () => deriveQuery(primary.rm, primary.tasks, { rng }),                 // today (most specific)
    () => deriveQuery(primary.rm, tasksUpTo(primary.rm, today), { rng }),  // cumulative
    () => rootQuery(primary.rm, { rng }),                                  // roots (broad)
  ];
  if (groups.length > 1) mains.push(() => multiQuery(groups, { rng }));    // cross-roadmap
  shuffle(mains, rng);

  const fallbacks = freshQueries(primary.rm, { rng, year }).map(spec => () => spec);
  // two on-topic tries first (the second doubles as the search-page backup), then
  // two high-reliability fallbacks — four tries total keeps it under a few seconds.
  return { primary, attempts: [...mains.slice(0, 2), ...fallbacks.slice(0, 2)] };
}

/* ---------- result rendering (pure) ---------- */

const playIcon = () => `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
const docIcon = () => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>`;
const shuffleIcon = () => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>`;
const bookmarkIcon = on => on
  ? `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>`
  : `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>`;

// Pick one of the top few results (uniform among the top 3 — variety without
// caring about rank precision, which the scrape can't guarantee anyway).
export function pickResult(results, rng = Math.random) {
  const top = results.slice(0, 3);
  return top[Math.floor(rng() * top.length)] || results[0];
}

/** Build the clickable result card. Titles/urls come from the scrape → set via
 *  text/href only (never innerHTML), so a hostile title can't inject markup.
 *  Pass `bookmark:{active,onToggle}` to show a bookmark toggle; onToggle() runs
 *  the side effect and returns the new active state (the icon flips to match). */
export function resultCard(r, { topic, type = "video", isSearch = false, bookmark = null } = {}) {
  const isHttp = u => /^https?:\/\//i.test(u || "");
  const href = isHttp(r.url) ? r.url : null;
  const a = el("a.finder-result" + (type === "article" ? ".article" : ".video"),
    { href: href || "#", target: "_blank", rel: "noopener noreferrer" });

  const thumb = el("div.fr-thumb");
  if (r.thumb && isHttp(r.thumb)) {
    const img = el("img.fr-img", { src: r.thumb, alt: "", loading: "lazy" });
    img.addEventListener("error", () => { thumb.classList.add("noimg"); img.remove(); });
    thumb.append(img);
  } else thumb.classList.add("noimg");
  thumb.append(el("span.fr-badge", { html: type === "article" ? docIcon() : playIcon() }));
  a.append(thumb);

  const body = el("div.fr-body");
  const kind = isSearch ? "Search" : (type === "article" ? "Article" : "Video");
  body.append(el("span.fr-kicker", { text: `${kind} · ${r.source || "web"}` }));
  body.append(el("span.fr-title", { text: r.title || "Untitled" }));
  if (topic) body.append(el("span.fr-topic", { text: `related to ${topic}` }));
  a.append(body);

  // Bookmark toggle — a span[role=button] (valid inside <a>), stops the click from
  // following the link. onToggle returns the new state; the icon flips to match.
  if (bookmark) {
    const on0 = !!bookmark.active;
    const bm = el("span.fr-bookmark" + (on0 ? ".active" : ""), {
      role: "button", tabindex: "0", "aria-pressed": on0 ? "true" : "false",
      "aria-label": on0 ? "Remove bookmark" : "Bookmark this",
      title: on0 ? "Remove bookmark" : "Bookmark this", html: bookmarkIcon(on0),
    });
    const fire = ev => {
      ev.preventDefault(); ev.stopPropagation();
      let next = !on0;
      try { next = !!bookmark.onToggle(); } catch {}
      bm.classList.toggle("active", next);
      bm.innerHTML = bookmarkIcon(next);
      bm.setAttribute("aria-pressed", next ? "true" : "false");
      const lbl = next ? "Remove bookmark" : "Bookmark this";
      bm.setAttribute("aria-label", lbl); bm.setAttribute("title", lbl);
    };
    bm.addEventListener("click", fire);
    bm.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") fire(ev); });
    a.append(bm);
  }
  return a;
}

// A live results page to browse when outbound scraping is blocked upstream.
const searchUrl = (q, type) => type === "article"
  ? "https://duckduckgo.com/?q=" + encodeURIComponent(q)
  : "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);

function stateNote(slot, cls, html) {
  slot.replaceChildren(el("div.finder-note." + cls, { html }));
}

const MAX_TRIES = 4;   // two on-topic + two fallbacks — a few seconds worst case

/**
 * Drive an attempt plan against a search function until one returns a real result.
 * Pure & injectable (searchFn matches sync.search's contract) so the retry policy
 * is testable without a network. Returns one of:
 *   { kind:"result", pick }  — a real single video/article (preferred)
 *   { kind:"search", pick }  — the FIRST on-topic deep-link, if every try missed
 *   { kind:"none" }          — nothing at all (e.g. the proxy is down)
 * Stops early after two consecutive hard failures (!ok) — that's the proxy being
 * unreachable, and hammering it further just burns seconds.
 */
export async function runPlan(attempts, searchFn, { maxTries = MAX_TRIES } = {}) {
  let backup = null, hardFails = 0;
  for (let i = 0; i < Math.min(maxTries, attempts.length); i++) {
    let spec;
    try { spec = attempts[i](); } catch { continue; }
    if (!spec || !spec.q) continue;
    const { q, type, topic } = spec;

    let res;
    try { res = await searchFn(q, type); } catch { res = { ok: false }; }

    if (res && res.ok && res.fetched && res.results && res.results.length)
      return { kind: "result", pick: { r: pickResult(res.results), topic, type } };
    if (!res || !res.ok) { if (++hardFails >= 2) break; continue; }
    hardFails = 0;
    if (!backup) backup = {
      r: { title: q, url: searchUrl(q, type), thumb: null,
        source: type === "article" ? "DuckDuckGo" : "YouTube" },
      topic, type, isSearch: true,
    };
  }
  return backup ? { kind: "search", pick: backup } : { kind: "none" };
}

// Module-level state so a search that started before a Today re-render still
// resolves into the panel the user is actually looking at:
//   lastShown — the most recent pick, re-shown on a re-render WITHOUT a new
//               search (e.g. after ticking a task). Shape: { r, topic, type }.
//   liveSlot / livePanel — the newest-mounted panel's slot + root. An in-flight
//               run() writes here, so if Today re-rendered mid-search the result
//               lands in the current panel, never the old detached one.
//   running — module-level: at most one search in flight across panels.
let lastShown = null, liveSlot = null, livePanel = null, running = false;

// `animate` plays the entrance only for a genuinely NEW pick (a fresh search or
// first open) — NOT for the re-show that happens on every Today tick-rerender, so
// ticking a task doesn't make the card flicker/replay its animation each time.
function showPick(pick, { animate = false } = {}) {
  lastShown = pick;
  if (!liveSlot) return;
  // A search-results-page fallback is not a concrete video/article, so it isn't
  // bookmarkable (persisting a results URL would re-list mislabeled as a real pick).
  const card = resultCard(pick.r, pick.isSearch ? pick : withBookmark(pick));
  if (animate) card.classList.add("enter");
  liveSlot.replaceChildren(card);
  if (livePanel) livePanel.classList.add("has-result");
}
// Attach a live bookmark toggle to a shown pick (Today's card is bookmarkable).
function withBookmark(pick) {
  const url = pick.r && pick.r.url;
  return { ...pick, bookmark: {
    active: isBookmarked(url),
    onToggle: () => {
      const on = toggleBookmark(pick.r, { type: pick.type, topic: pick.topic });
      toast(on ? "Bookmarked" : "Bookmark removed", { type: "ok" });
      return on;
    },
  } };
}
function restorePick() {                       // back to the last good pick (or empty) after a failed search
  if (lastShown) showPick(lastShown);
  else if (liveSlot) { liveSlot.replaceChildren(); if (livePanel) livePanel.classList.remove("has-result"); }
}

/* ---------- panel + orchestration ---------- */

/**
 * Build the Today "Watch / read next" panel.
 *   groups  : [{ rm, tasks:[task,…] }] — roadmaps with due/overdue work today.
 *   autoRun : fire one silent search on open (only when the backend is online).
 *   today   : today's ISO date (scopes the cumulative-keyword strategy).
 */
export function finderPanel({ groups = [], autoRun = false, today = null } = {}) {
  const panel = el("section.finder-panel", { "aria-label": "Something to watch or read next" });

  const head = el("div.finder-head");
  head.append(el("span.finder-ico", { text: "🎬" }));
  head.append(el("span.finder-title", { text: "Watch / read next" }));
  const btn = el("button.finder-go", { type: "button", title: "Find something related",
    "aria-label": "Find something related", html: shuffleIcon() });
  head.append(btn);
  panel.append(head);
  panel.append(el("p.finder-sub", { text: "A short video or article about what you're on today — tap to shuffle." }));

  const slot = el("div.finder-slot");
  panel.append(slot);
  // This freshly-built panel becomes the live search target.
  liveSlot = slot; livePanel = panel;

  async function run({ manual }) {
    if (running || !groups.length) return;
    running = true;
    livePanel.classList.add("loading");
    stateNote(liveSlot, "loading", `<span class="finder-spin"></span> Finding something good…`);

    const year = String(new Date().getFullYear());

    try {
      const { attempts } = buildPlan(groups, { today, year, rng: Math.random });
      const outcome = await runPlan(attempts, sync.search);
      if (outcome.kind !== "none") showPick(outcome.pick, { animate: true });   // fresh pick → play entrance
      else if (manual) stateNote(liveSlot, "fail", `Couldn't find anything this time — give it another tap.`);
      else restorePick();
    } catch {
      if (manual) stateNote(liveSlot, "fail", `Couldn't reach the finder — give it another tap.`);
      else restorePick();
    } finally {
      running = false;
      if (livePanel) livePanel.classList.remove("loading");
    }
  }

  btn.addEventListener("click", () => run({ manual: true }));
  // Auto-fire once per fresh Today open (renderToday sets autoRun; a tick-driven
  // re-render does not). It shows the progress state while searching; a tick
  // re-render instead just re-shows the last pick with no network.
  if (autoRun && sync.isServer()) run({ manual: false });
  else if (lastShown) showPick(lastShown);
  return panel;
}
