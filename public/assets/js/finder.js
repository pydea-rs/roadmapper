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
 * Distil a search query from a roadmap and a set of its due/overdue tasks.
 * Returns { q, type, topic }. `type` is randomised (≈70% video). Extraction is
 * intentionally rough — the query only needs to be *related*, not perfect.
 */
export function deriveQuery(rm, tasks, { rng = Math.random } = {}) {
  // Anchor the query in the roadmap's own tech so results stay on-subject.
  const anchor = String(rm.slug || "").split(/[-_]/).filter(w => w.length > 1).slice(0, 2);

  const html = (tasks || []).map(taskText).join(" ");

  // <code> spans are API/identifier names — the highest-signal keywords.
  const codePick = [];
  const codeRe = /<code>([\s\S]*?)<\/code>/gi;
  let m;
  while ((m = codeRe.exec(html))) {
    const id = (stripTags(m[1]).match(/[A-Za-z][A-Za-z0-9+#]{2,}/) || [])[0];
    if (id && !codePick.some(x => x.toLowerCase() === id.toLowerCase())) codePick.push(id);
  }

  // Frequency over the remaining plain words (minus stopwords / numbers).
  const freq = new Map();
  for (const raw of (stripTags(html).toLowerCase().match(/[a-z][a-z0-9+#]{2,}/g) || [])) {
    if (STOP.has(raw) || /^\d+$/.test(raw)) continue;
    freq.set(raw, (freq.get(raw) || 0) + 1);
  }
  const topPlain = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]);

  // Assemble: anchors, up to two code identifiers, then fill with frequent words.
  const q = [];
  const push = w => { if (w && !q.some(x => x.toLowerCase() === w.toLowerCase())) q.push(w); };
  anchor.forEach(push);
  codePick.slice(0, 2).forEach(push);
  for (const t of topPlain) { if (q.length >= 6) break; push(t); }

  const type = rng() < 0.7 ? "video" : "article";
  const topic = titleCase(anchor[0] || topPlain[0] || "your roadmap");
  return { q: q.slice(0, 6).join(" "), type, topic };
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

// The most recent pick, kept module-level so a Today re-render (e.g. after a
// tick) re-shows the same card WITHOUT a new search. Shape: { r, topic, type }.
let lastShown = null;

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

  const show = pick => {   // pick = { r, topic, type }
    lastShown = pick;
    slot.replaceChildren(resultCard(pick.r, pick));
    panel.classList.add("has-result");
  };
  // Re-show the last pick immediately on a re-render (no network).
  if (lastShown) show(lastShown);

  let running = false;
  async function run({ manual }) {
    if (running || !groups.length) return;
    running = true;
    if (manual) { panel.classList.add("loading"); stateNote(slot, "loading", `<span class="finder-spin"></span> Finding something good…`); }
    try {
      const g = groups[Math.floor(Math.random() * groups.length)];
      const { q, type, topic } = deriveQuery(g.rm, g.tasks);
      let pick = null;
      if (q) {
        const res = await sync.search(q, type);
        if (res.ok && res.fetched && res.results.length) pick = { r: pickResult(res.results), topic, type };
        else if (res.ok && !res.fetched)                                 // outbound blocked upstream
          pick = { r: { title: q, url: searchUrl(q, type), thumb: null,
            source: type === "article" ? "DuckDuckGo" : "YouTube" }, topic, type, isSearch: true };
      }
      if (pick) show(pick);
      else if (manual) stateNote(slot, "fail", `Couldn't find anything this time — give it another tap.`);
      // auto mode stays silent on failure, exactly as asked.
    } catch {
      if (manual) stateNote(slot, "fail", `Couldn't reach the finder — give it another tap.`);
    } finally {
      running = false;
      panel.classList.remove("loading");
    }
  }

  btn.addEventListener("click", () => run({ manual: true }));
  // Auto-fire ONCE per fresh open, silent, no retry — and only if nothing is
  // already shown and the backend is up.
  if (autoRun && !lastShown && sync.isServer()) run({ manual: false });
  return panel;
}
