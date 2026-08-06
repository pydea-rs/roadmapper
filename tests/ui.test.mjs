// ui.test.mjs — behaviour tests for the ui.js primitives the other suites don't
// touch directly: toasts, the modal family (openModal / confirmModal /
// inputModal), the sidebar renderer, and the focus-trap handle. These are pure
// DOM builders, so a jsdom document is enough; the file SKIPS cleanly when jsdom
// isn't installed (same contract as render/tutorials). Modal close is animated on
// a 200ms timer, so tests await ~230ms before asserting a modal is gone.
import { suite } from "./_harness.mjs";

const t = suite("ui");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="app"><nav id="sb-list"></nav></div>
  <button id="fab"></button>
  <div id="drawer-root">
    <div class="drawer-scrim"></div>
    <div class="drawer-panel"><button id="drawer-close"></button><div id="drawer-body"></div></div>
  </div>
  <div id="toast-root"></div><div id="modal-root"></div>
</body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.location = dom.window.location;
global.localStorage = dom.window.localStorage;
global.requestAnimationFrame = fn => setTimeout(fn, 0);

const base = new URL("../public/assets/js/", import.meta.url);
const ui = await import(new URL("ui.js", base).href);

const wait = ms => new Promise(r => setTimeout(r, ms));
const click = n => n.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
const key = (target, k, opts = {}) =>
  target.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...opts }));

/* ---------------- toasts ---------------- */
t.group("toast — structure, type class, html, undo, dismiss");
const troot = document.getElementById("toast-root");
const dismiss = ui.toast("Saved", { type: "ok" });
const okToast = troot.querySelector(".toast");
t.ok(okToast, "a toast node is appended to #toast-root");
t.ok(okToast.classList.contains("ok"), "the type becomes a class");
t.ok(okToast.querySelector(".dot"), "it has a status dot");
t.eq(okToast.querySelector("span").textContent, "Saved", "message is set as text");
t.eq(typeof dismiss, "function", "toast returns a dismiss function");
dismiss();
t.ok(okToast.classList.contains("leaving"), "calling the returned fn starts the leave animation");

ui.toast("<b>bold</b>", { html: true });
const htmlToast = [...troot.querySelectorAll(".toast")].pop();
t.ok(htmlToast.querySelector("b"), "html:true renders markup instead of escaping it");

let undone = false;
ui.toast("Deleted", { undo: { label: "Undo", action: () => { undone = true; } } });
const undoToast = [...troot.querySelectorAll(".toast")].pop();
const undoBtn = undoToast.querySelector("button.undo");
t.ok(undoBtn, "an undo toast shows an Undo button");
t.eq(undoBtn.textContent, "Undo", "…with the given label");
click(undoBtn);
t.ok(undone, "clicking Undo runs the action");
t.ok(undoToast.classList.contains("leaving"), "…and dismisses the toast");

/* ---------------- openModal ---------------- */
t.group("openModal — structure, action variants, Escape closes, onClose");
const mroot = document.getElementById("modal-root");
let modalClosed = false;
ui.openModal({
  title: "Title", subtitle: "Sub", icon: "★",
  body: "<p id='mbody'>hi</p>",
  actions: [{ label: "OK", variant: "primary", id: "act-ok", onClick: () => true }],
  onClose: () => { modalClosed = true; },
});
t.ok(mroot.classList.contains("open"), "#modal-root gets .open while a modal is up");
const modal = mroot.querySelector(".modal");
t.ok(modal, "a .modal is rendered");
t.eq(modal.getAttribute("role"), "dialog", "the modal is a role=dialog");
t.eq(modal.querySelector("h2").textContent, "Title", "title text is set");
t.eq(modal.querySelector(".modal-head p").textContent, "Sub", "subtitle text is set");
t.ok(modal.querySelector(".m-ico"), "an icon is shown when given");
t.ok(modal.querySelector("#mbody"), "a string body is injected as innerHTML");
const okBtn = modal.querySelector("#act-ok");
t.ok(okBtn && okBtn.classList.contains("primary"), "an action button carries its variant class");
t.ok(modal.querySelector(".modal-foot"), "a footer is present when there are actions");
t.ok(modal.querySelector(".icon-btn.x"), "a dismissable modal has a close (x) button");
key(document, "Escape");
await wait(230);
t.ok(!mroot.querySelector(".modal"), "Escape removes the modal");
t.ok(modalClosed, "onClose fired on close");
t.ok(!mroot.classList.contains("open"), "#modal-root loses .open once empty");

/* ---------------- confirmModal ---------------- */
t.group("confirmModal — confirm→true, cancel→false");
const pYes = ui.confirmModal({ title: "Sure?", confirmLabel: "Yes", cancelLabel: "No", danger: true });
const yesModal = mroot.querySelector(".modal");
const yesBtn = [...yesModal.querySelectorAll(".modal-foot .btn")].find(b => b.textContent === "Yes");
t.ok(yesBtn.classList.contains("danger"), "a danger confirm uses the danger variant");
click(yesBtn);
t.eq(await pYes, true, "clicking confirm resolves the promise true");
await wait(230);

const pNo = ui.confirmModal({ title: "Sure?" });
const noBtn = [...mroot.querySelectorAll(".modal-foot .btn")].find(b => /Cancel/.test(b.textContent));
click(noBtn);
t.eq(await pNo, false, "clicking cancel resolves the promise false");
await wait(230);

/* ---------------- inputModal ---------------- */
t.group("inputModal — seeded value, Save, Enter, Cancel");
const pSave = ui.inputModal({ title: "Name", value: "start", confirmLabel: "Save" });
const iModal = mroot.querySelector(".modal");
const field = iModal.querySelector("input");
t.eq(field.value, "start", "the input is seeded with the initial value");
field.value = "edited";
const saveBtn = [...iModal.querySelectorAll(".modal-foot .btn")].find(b => b.textContent === "Save");
click(saveBtn);
t.eq(await pSave, "edited", "Save resolves the edited field value");
await wait(230);

const pEnter = ui.inputModal({ title: "Name", value: "x" });
const field2 = mroot.querySelector(".modal input");
field2.value = "typed";
key(field2, "Enter");
t.eq(await pEnter, "typed", "pressing Enter submits the field value");
await wait(230);

const pCancel = ui.inputModal({ title: "Name" });
const cancelBtn = [...mroot.querySelectorAll(".modal-foot .btn")].find(b => /Cancel/.test(b.textContent));
click(cancelBtn);
t.eq(await pCancel, null, "Cancel resolves null");
await wait(230);

/* ---------------- renderSidebar ---------------- */
t.group("renderSidebar — nav links, per-roadmap items, side split, expansion");
const roadmaps = [
  { slug: "rust", title: "Rust", icon: "🦀", kind: "main",
    weeks: [{ id: "w1", title: "Week 1" }, { id: "w2", title: "Week 2" }] },
  { slug: "go", title: "Go", icon: "🐹", kind: "main", weeks: [{ id: "w1", title: "Wk" }] },
  { slug: "bed", title: "Bedrock", icon: "🪨", kind: "side", weeks: [{ id: "w1", title: "Wk" }] },
];
const stats = { rust: { pct: 42, track: "ahead" }, go: { pct: 0, track: "on" }, bed: { pct: 7, track: "behind" } };
let navigated = null;
ui.renderSidebar({ roadmaps, active: "rust", expandedSlug: "rust",
  statsFor: s => stats[s], onNavigate: s => { navigated = s; } });
const list = document.getElementById("sb-list");
t.ok(list.querySelector(".sb-today"), "a global Today link is present");
t.ok(list.querySelector(".sb-insights"), "an Insights link is present");
t.ok(list.querySelector(".sb-bookmarks"), "a Bookmarks link is present");
t.eq(list.querySelectorAll(".sb-item").length, 3, "one item per roadmap");
t.ok(list.querySelector(".sb-sep"), "a separator divides main from side track");
t.ok(list.querySelector(".sb-section-label.side"), "the side track gets its own labelled section");
const rustItem = list.querySelector('.sb-item[data-slug="rust"]');
t.eq(rustItem.getAttribute("aria-current"), "true", "the active roadmap is marked aria-current");
t.eq(rustItem.querySelector(".pct").textContent, "42%", "its progress percent is shown");
t.eq(rustItem.querySelector(".bar i").style.width, "42%", "…and drives the mini-bar width");
const sub = list.querySelector(".sb-sub");
t.ok(sub, "the expanded roadmap shows its quick-jump sublist");
t.eq(sub.querySelectorAll("a").length, 3, "→ Today plus one link per week (2 weeks)");
t.ok(/Today/.test(sub.querySelector("a").textContent), "the first quick-jump is Today");
t.eq(list.querySelectorAll(".sb-sub").length, 1, "only the expanded roadmap is expanded");
click(rustItem);
t.eq(navigated, "rust", "clicking a roadmap item calls onNavigate with its slug");

location.hash = "#/today";
ui.renderSidebar({ roadmaps, active: null, expandedSlug: null,
  statsFor: s => stats[s], onNavigate: () => {} });
t.ok(document.querySelector(".sb-today.active"), "on #/today the Today link renders active");
t.eq(document.querySelectorAll(".sb-sub").length, 0, "no roadmap is expanded on the global Today view");
location.hash = "";

/* ---------------- focusTrap ---------------- */
/* ---------------- drawer Escape yields to an open modal ---------------- */
t.group("drawer Escape does not double-close a modal stacked over it");
ui.initDrawer({});                       // hooks unused here; buildDrawerBody tolerates {}
ui.openDrawer();
const drawerRoot = document.getElementById("drawer-root");
t.ok(drawerRoot.classList.contains("open"), "the drawer opens");
ui.openModal({ title: "Confirm?", actions: [{ label: "OK", onClick: () => true }] });
t.ok(mroot.querySelector(".modal"), "a modal is opened over the drawer");
key(document, "Escape");                 // one Escape: modal owns it, drawer must stay
t.ok(drawerRoot.classList.contains("open"), "one Escape leaves the drawer open (the modal owns Escape)");
await wait(230);
t.ok(!mroot.querySelector(".modal"), "…that Escape did close the modal itself");
t.ok(drawerRoot.classList.contains("open"), "…and the drawer is still open after the modal is gone");
key(document, "Escape");                 // second Escape: no modal → drawer closes
t.ok(!drawerRoot.classList.contains("open"), "a second Escape (no modal) now closes the drawer");

t.group("focusTrap — returns a release handle, safe to fire & release");
const boxEl = document.createElement("div");
boxEl.innerHTML = "<button>a</button><button>b</button>";
document.body.append(boxEl);
const release = ui.focusTrap(boxEl);
t.eq(typeof release, "function", "focusTrap returns a release function");
key(boxEl, "Tab");                 // no layout under jsdom → no visible items → safe no-op
release();
t.ok(true, "releasing the trap detaches its listener without error");
boxEl.remove();

t.done();
