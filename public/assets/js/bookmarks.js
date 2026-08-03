// bookmarks.js — save the finder's video/article/topic picks for later. Each
// bookmark is one synced store cell under the synthetic slug "bookmarks"
// (a valid slug the backend stores like any other KV, but no roadmap owns it, so
// it never touches progress/stats). The Bookmarks view (#/bookmarks) lists them
// as the same card the Today finder shows — minus the randomise/fallback logic.

import * as store from "./store.js";
import { el } from "./util.js";
import { resultCard } from "./finder.js";
import { openContextMenu, toast } from "./ui.js";

const SLUG = "bookmarks";

// Only ever store/open http(s) links. Every URL here originates from the finder's
// scrape pipeline (which is http-only), but guard at the boundary anyway so a
// javascript:/data: URL can never be persisted or handed to window.open.
const isHttp = u => /^https?:\/\//i.test(u || "");

/** Stable, compact store-itemId for a URL (djb2 → base36) so the same link keys
 *  to the same cell — bookmarking is idempotent and toggling removes cleanly. */
export function bmId(url) {
  const s = String(url || "");
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (((h << 5) + h) + s.charCodeAt(i)) | 0;
  return "bm_" + (h >>> 0).toString(36);
}

const nowTs = () => { try { return Date.now(); } catch { return 0; } };

export function isBookmarked(url) { return !!(url && store.getCell(SLUG, bmId(url))); }

/** All saved bookmarks, newest first. */
export function listBookmarks() {
  const bucket = store.rawState()[SLUG] || {};
  const out = [];
  for (const id in bucket) {
    try { const b = JSON.parse(bucket[id].value); if (b && b.url) out.push(b); } catch {}
  }
  out.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  return out;
}

export function addBookmark(r, { type = "video", topic = "" } = {}) {
  if (!r || !isHttp(r.url)) return false;
  const rec = { url: r.url, title: r.title || "Untitled", thumb: r.thumb || null,
    source: r.source || "web", type, topic, ts: nowTs() };
  store.setCell(SLUG, bmId(r.url), "bookmark", JSON.stringify(rec));
  return true;
}

export function removeBookmark(url) { if (url) store.setCell(SLUG, bmId(url), "bookmark", null); }

/** Toggle and return the NEW active state (true = now bookmarked). */
export function toggleBookmark(r, meta) {
  if (!r || !r.url) return false;
  if (isBookmarked(r.url)) { removeBookmark(r.url); return false; }
  return addBookmark(r, meta);
}

export function bookmarkCount() { return listBookmarks().length; }

/* ---------- copy helper (custom, no native prompt) ---------- */
function copyLink(url) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => toast("Link copied", { type: "ok" }),
        () => toast("Couldn't copy the link", { type: "bad" }));
      return;
    }
  } catch {}
  toast("Couldn't copy the link", { type: "bad" });
}

/* ---------- view ---------- */

export function renderBookmarks(mount) {
  mount.innerHTML = "";
  const view = el("div.bookmarks-view");

  const items = listBookmarks();
  const hero = el("div.hero.bm-hero");
  const top = el("div.hero-top");
  top.append(el("div.hero-ico", { text: "🔖" }));
  const tb = el("div");
  tb.append(el("h1", { text: "Bookmarks" }));
  tb.append(el("p.sub", { text: items.length
    ? `${items.length} saved ${items.length === 1 ? "link" : "links"} · click to open · right-click for more`
    : "Saved videos & articles from Today" }));
  top.append(tb);
  hero.append(top);
  view.append(hero);

  if (!items.length) {
    view.append(el("div.bm-empty", { html:
      `<div class="bm-empty-ico">🔖</div>
       <p class="bm-empty-title">No bookmarks yet</p>
       <p class="bm-empty-sub">Open <b>Today</b> and tap the bookmark on a suggested video or article to keep it here for later.</p>` }));
    mount.append(view);
    return;
  }

  const grid = el("div.bm-grid");
  for (const b of items) grid.append(bookmarkCard(b, mount));
  view.append(grid);
  mount.append(view);
}

function bookmarkCard(b, mount) {
  const card = resultCard(b, {
    topic: b.topic, type: b.type,
    bookmark: { active: true, onToggle: () => { removeBookmark(b.url); toast("Bookmark removed", { type: "ok" });
      renderBookmarks(mount); return false; } },
  });
  card.classList.add("bm-card");
  card.addEventListener("contextmenu", ev => {
    ev.preventDefault();
    const menu = [
      { label: "Open in new tab", icon: "↗", onClick: () => { if (isHttp(b.url)) { try { window.open(b.url, "_blank", "noopener"); } catch {} } } },
      { label: "Copy link", icon: "⧉", onClick: () => copyLink(b.url) },
      { separator: true },
      { label: "Remove bookmark", icon: "🗑", danger: true,
        onClick: () => { removeBookmark(b.url); toast("Bookmark removed", { type: "ok" }); renderBookmarks(mount); } },
    ];
    openContextMenu(ev.clientX, ev.clientY, menu);
  });
  return card;
}
