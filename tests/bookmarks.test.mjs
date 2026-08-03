// bookmarks.test.mjs — saving finder picks for later. Covers the data layer
// (stable ids, add/query/remove/toggle, newest-first, corrupt-cell tolerance)
// and the Bookmarks view (empty state, populated grid, click-to-remove, and the
// right-click context menu). Needs jsdom (the view + cards build DOM).
import { suite } from "./_harness.mjs";

const t = suite("bookmarks");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="view"></div><div id="toast-root"></div><div id="modal-root"></div>
</body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.requestAnimationFrame = fn => setTimeout(fn, 0);

const base = new URL("../public/assets/js/", import.meta.url);
const store = await import(new URL("store.js", base).href);
const bm = await import(new URL("bookmarks.js", base).href);

const R1 = { url: "https://youtube.com/watch?v=abc", title: "Rust Async", thumb: "https://i/x.jpg", source: "YouTube" };
const R2 = { url: "https://example.com/a", title: "Go GC", thumb: null, source: "example.com" };
const click = node => node.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));

t.group("data layer — ids, add/query/remove/toggle");
store.resetAll();
t.ok(!bm.isBookmarked(R1.url), "nothing bookmarked initially");
t.eq(bm.bmId(R1.url), bm.bmId(R1.url), "bmId is stable for a given url");
t.ne(bm.bmId(R1.url), bm.bmId(R2.url), "different urls ⇒ different ids");
t.ok(bm.addBookmark(R1, { type: "video", topic: "Rust" }), "add returns true");
t.ok(bm.isBookmarked(R1.url), "now bookmarked");
t.eq(bm.listBookmarks().length, 1, "one in the list");
t.eq(bm.listBookmarks()[0].title, "Rust Async", "…stored with its title");
t.eq(bm.listBookmarks()[0].type, "video", "…and its type");
bm.addBookmark(R1, { type: "video" });
t.eq(bm.listBookmarks().length, 1, "re-adding the same url doesn't duplicate (idempotent)");
t.eq(bm.toggleBookmark(R1), false, "toggling a saved url removes it (returns false)");
t.ok(!bm.isBookmarked(R1.url), "…and it's gone");
t.eq(bm.toggleBookmark(R1, { type: "video" }), true, "toggling again re-adds it (returns true)");
t.eq(bm.bookmarkCount(), 1, "count reflects state");
bm.removeBookmark(R1.url);
t.eq(bm.bookmarkCount(), 0, "removeBookmark clears it");
t.eq(bm.toggleBookmark({}, {}), false, "toggling a url-less record is a safe no-op");

t.group("listBookmarks — newest first, corrupt cells skipped");
store.resetAll();
store.setCell("bookmarks", bm.bmId("u1"), "bookmark", JSON.stringify({ url: "u1", title: "older", ts: 100 }));
store.setCell("bookmarks", bm.bmId("u2"), "bookmark", JSON.stringify({ url: "u2", title: "newer", ts: 200 }));
const ordered = bm.listBookmarks();
t.eq(ordered[0].title, "newer", "higher ts sorts first");
t.eq(ordered[1].title, "older", "older second");
store.setCell("bookmarks", "bm_broken", "bookmark", "{not valid json");
t.eq(bm.listBookmarks().length, 2, "a corrupt bookmark cell is skipped, not thrown");

t.group("renderBookmarks — empty state, then a populated grid");
store.resetAll();
const view = document.getElementById("view");
bm.renderBookmarks(view);
t.ok(view.querySelector(".bm-empty"), "empty state shows with no bookmarks");
t.ok(!view.querySelector(".bm-grid"), "…and no grid");
bm.addBookmark(R1, { type: "video", topic: "Rust" });
bm.addBookmark(R2, { type: "article", topic: "Go" });
bm.renderBookmarks(view);
t.ok(view.querySelector(".bm-grid"), "grid renders when populated");
t.eq(view.querySelectorAll(".bm-grid .finder-result").length, 2, "one card per bookmark");
t.ok(view.querySelector(".fr-bookmark.active"), "cards show the bookmark as active");
t.ok(view.querySelector(".bm-grid .finder-result.article"), "an article bookmark keeps its article styling");

t.group("card interactions — click-to-remove and the context menu");
click(view.querySelector(".bm-card .fr-bookmark"));
t.eq(bm.bookmarkCount(), 1, "clicking the active bookmark removes that card");
t.eq(view.querySelectorAll(".bm-grid .finder-result").length, 1, "the view re-rendered to the remaining card");

const card = view.querySelector(".bm-card");
card.dispatchEvent(new dom.window.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 12, clientY: 12 }));
const menu = document.querySelector(".ctx-menu");
t.ok(menu, "right-click opens a custom context menu (not the native one)");
const labels = [...menu.querySelectorAll(".ctx-item")].map(b => b.textContent);
t.ok(labels.some(l => /Open/.test(l)), "menu offers Open in new tab");
t.ok(labels.some(l => /Copy/.test(l)), "menu offers Copy link");
t.ok(labels.some(l => /Remove/.test(l)), "menu offers Remove bookmark");
const removeItem = [...menu.querySelectorAll(".ctx-item")].find(b => /Remove/.test(b.textContent));
click(removeItem);
t.eq(bm.bookmarkCount(), 0, "context-menu Remove clears the last bookmark");

t.done();
