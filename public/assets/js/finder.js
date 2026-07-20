// finder.js — "Watch / read next": a small, dependency-free discovery widget
// for the Today view. It reads the text of today's (and overdue) tasks, distils
// a search query from the concepts in them — with NO LLM, just weighted keyword
// extraction — and asks the backend proxy (sync.search) for a related video or
// article to surface. Each run picks ONE roadmap at random so the query stays
// coherent (one topic, not a blend), and leans toward video over article.
//
// State is deliberately not persisted: it's a serendipity card, re-rolled on
// every click and fired once (silently) when the Today view opens.

import { el } from "./util.js";
import * as sync from "./sync.js";

/* ---------- query derivation (pure) ---------- */

// Very small stopword set — enough to keep queries on-topic without a big list.
const STOP = new Set((
  "the a an and or of to in on for with your you it its as at by from into over " +
  "under is are be this that these those we our will can may not but if then so " +
  "do does done make made get got use used using via than while when where which " +
  "each one two three first second third §"
).split(/\s+/));

const stripTags = s => String(s).replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/gi, " ");

// Gather the visible text a task contributes: its lead, own label, and — for a
// parent — every sub-task label and note. That's where the concepts live.
function taskText(task) {
  const parts = [];
  if (task.lead) parts.push(task.lead);
  if (task.label) parts.push(task.label);
  if (task.subs) for (const s of task.subs) { if (s.label) parts.push(s.label); if (s.note) parts.push(s.note); }
  return parts.join(" ");
}

const titleCase = s => String(s).replace(/\b[a-z]/g, c => c.toUpperCase());

/**
 * Build a rich, salience-ordered vocabulary from a set of tasks:
 *   codes    — <code> API/identifier names (highest signal),
 *   unigrams — single keywords by frequency,
 *   bigrams  — adjacent-word PHRASES ("smart pointers", "thread pool"), by freq.
 * This is the "wide list of words and phrases" the query sampler draws from.
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

/**
 * Distil a search query from a roadmap and a set of its due/overdue tasks.
 * Returns { q, type, topic }. Rather than always emitting the same top keywords,
 * it samples the pool (codes / keywords / phrases) through a randomly chosen
 * "recipe", so every shuffle yields a different — but still on-topic — query.
 * Always anchored in the roadmap's own tech. `type` is randomised (≈70% video).
 */
export function deriveQuery(rm, tasks, { rng = Math.random } = {}) {
  const anchor = String(rm.slug || "").split(/[-_]/).filter(w => w.length > 1).slice(0, 2);
  const { codes, unigrams, bigrams } = buildPool(tasks);
  const anchorWord = anchor[0] || unigrams[0] || "";

  // Sample one item from the top `window` of a list (variety without drifting
  // off-topic — the salient terms sit at the front).
  const pick = (list, window = 4) => list.length
    ? list[Math.floor(rng() * Math.min(window, list.length))] : null;

  const parts = [];
  const push = w => { if (w && !parts.some(x => x.toLowerCase() === w.toLowerCase())) parts.push(w); };

  // Six recipes of different shape/length; all keep the roadmap anchor in play.
  switch (Math.floor(rng() * 6)) {
    case 0: push(anchorWord); push(pick(bigrams)); break;
    case 1: push(anchorWord); push(pick(codes)); push(pick(unigrams)); break;
    case 2: push(anchorWord); push(pick(unigrams)); push(pick(unigrams, 8)); break;
    case 3: push(pick(codes)); push(pick(bigrams)); push(anchorWord); break;
    case 4: push(anchorWord); push(pick(bigrams)); push(pick(unigrams, 6)); break;
    default: push(anchorWord); push(pick(codes) || pick(bigrams)); push(pick(unigrams));
  }
  // Guarantee at least two meaningful terms, filling from the frequency list.
  for (const u of [anchorWord, ...unigrams]) { if (parts.filter(Boolean).length >= 2) break; push(u); }

  const q = parts.filter(Boolean).join(" ").split(/\s+/).slice(0, 6).join(" ").trim();
  const type = rng() < 0.7 ? "video" : "article";
  const topic = titleCase(anchor[0] || bigrams[0] || unigrams[0] || "your roadmap");
  return { q: q || anchorWord || String(rm.slug || "roadmap"), type, topic };
}

/* ---------- result rendering (pure) ---------- */

const playIcon = () => `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
const docIcon = () => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>`;
const shuffleIcon = () => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>`;

// Pick one of the top few results (uniform among the top 3 — variety without
// caring about rank precision, which the scrape can't guarantee anyway).
export function pickResult(results, rng = Math.random) {
  const top = results.slice(0, 3);
  return top[Math.floor(rng() * top.length)] || results[0];
}

/** Build the clickable result card. Titles/urls come from the scrape → set via
 *  text/href only (never innerHTML), so a hostile title can't inject markup. */
export function resultCard(r, { topic, type = "video", isSearch = false } = {}) {
  const a = el("a.finder-result" + (type === "article" ? ".article" : ".video"),
    { href: r.url, target: "_blank", rel: "noopener noreferrer" });

  const thumb = el("div.fr-thumb");
  if (r.thumb) {
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
  return a;
}

// A live results page to browse when outbound scraping is blocked upstream.
const searchUrl = (q, type) => type === "article"
  ? "https://duckduckgo.com/?q=" + encodeURIComponent(q)
  : "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);

function stateNote(slot, cls, html) {
  slot.replaceChildren(el("div.finder-note." + cls, { html }));
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

function showPick(pick) {
  lastShown = pick;
  if (!liveSlot) return;
  liveSlot.replaceChildren(resultCard(pick.r, pick));
  if (livePanel) livePanel.classList.add("has-result");
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
 */
export function finderPanel({ groups = [], autoRun = false } = {}) {
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
    // Both auto (on open) and manual (shuffle) show a progress state while
    // querying, so opening Today gives feedback that it's finding something.
    livePanel.classList.add("loading");
    stateNote(liveSlot, "loading", `<span class="finder-spin"></span> Finding something good…`);
    try {
      // Weight the anchor pick by how much work each roadmap has due today, so
      // successive shuffles draw across ALL of today's tasks (not one fixed
      // roadmap) while each query stays coherent to its anchor roadmap.
      const total = groups.reduce((s, x) => s + x.tasks.length, 0) || 1;
      let r = Math.random() * total, g = groups[groups.length - 1];
      for (const cand of groups) { r -= cand.tasks.length; if (r <= 0) { g = cand; break; } }
      const { q, type, topic } = deriveQuery(g.rm, g.tasks);
      let pick = null;
      if (q) {
        const res = await sync.search(q, type);
        if (res.ok && res.fetched && res.results.length) pick = { r: pickResult(res.results), topic, type };
        else if (res.ok && !res.fetched)                                 // outbound blocked upstream
          pick = { r: { title: q, url: searchUrl(q, type), thumb: null,
            source: type === "article" ? "DuckDuckGo" : "YouTube" }, topic, type, isSearch: true };
      }
      if (pick) showPick(pick);
      else if (manual) stateNote(liveSlot, "fail", `Couldn't find anything this time — give it another tap.`);
      else restorePick();                                                // auto stays silent on failure
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
