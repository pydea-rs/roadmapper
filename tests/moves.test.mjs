// moves.test.mjs — relocating a task to another day of the same roadmap
// (moves.js). The state model is a single move row (absence = origin), so the
// invariants worth pinning are: a move writes the destination, a no-op writes
// nothing, back-to-origin CLEARS the row, an unknown id is inert, the toast's
// Undo restores the prior position, and the picker modal lists candidate days.
// Needs jsdom (doMove renders a toast; the picker opens a modal); skips without.
import { suite } from "./_harness.mjs";

const t = suite("moves");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="toast-root"></div><div id="modal-root"></div>
</body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.requestAnimationFrame = fn => setTimeout(fn, 0);

const base = new URL("../public/assets/js/", import.meta.url);
const rmBase = new URL("../public/roadmaps/", import.meta.url);
const registry = await import(new URL("registry.js", base).href);
const store = await import(new URL("store.js", base).href);
const stats = await import(new URL("stats.js", base).href);
const moves = await import(new URL("moves.js", base).href);
await import(new URL("_fixture.js", rmBase).href);

const rm = registry.getRoadmap("fixture");
const task = rm.days[0].tasks[0];        // full id e.g. "d01.t1"
const origin = task.day;                 // "d01"
const dest = rm.days[1].id;              // "d02"

t.group("doMove — relocate / no-op / back-to-origin / unknown");
t.eq(stats.currentDay(rm, "fixture", task), origin, "a fresh task sits on its origin day");
t.eq(store.getMove("fixture", task.id), null, "…with no move row stored");

let moved = 0;
moves.doMove(rm, "fixture", task.id, dest, () => moved++);
t.eq(store.getMove("fixture", task.id), dest, "moving writes the destination day id");
t.eq(stats.currentDay(rm, "fixture", task), dest, "currentDay now reports the destination");
t.eq(moved, 1, "the onMoved callback fires once for a real move");

moves.doMove(rm, "fixture", task.id, dest, () => moved++);
t.eq(moved, 1, "moving to the day it's already on is a no-op (callback not fired)");
t.eq(store.getMove("fixture", task.id), dest, "…and the stored move is untouched");

moves.doMove(rm, "fixture", task.id, origin, () => moved++);
t.eq(store.getMove("fixture", task.id), null, "moving back to the origin CLEARS the move row (absence = origin)");
t.eq(stats.currentDay(rm, "fixture", task), origin, "currentDay reports the origin again");
t.eq(moved, 2, "the back-to-origin move fires the callback");

let ok = true;
try { moves.doMove(rm, "fixture", "does.not.exist", dest, () => { ok = false; }); } catch { ok = false; }
t.ok(ok, "an unknown task id is ignored — no throw, no callback");
t.eq(store.getMove("fixture", "does.not.exist"), null, "…and writes nothing");

t.group("doMove — the toast Undo restores the previous position");
const toastRoot = document.getElementById("toast-root");
moves.doMove(rm, "fixture", task.id, dest, () => {});
t.eq(store.getMove("fixture", task.id), dest, "moved to the destination");
const undoBtn = [...toastRoot.querySelectorAll(".toast .undo")].pop();
t.ok(undoBtn, "the move toast offers an Undo button");
undoBtn.click();
t.eq(store.getMove("fixture", task.id), null, "clicking Undo restores the prior position (origin)");

t.group("openMovePicker — a modal listing candidate days");
const modalRoot = document.getElementById("modal-root");
moves.openMovePicker(rm, "fixture", task, () => {});
let list = modalRoot.querySelector(".move-list");
t.ok(list, "the picker renders a move list inside a modal");
t.ok(list.querySelectorAll(".move-opt").length >= 1, "it offers at least one candidate day");
t.ok(!list.querySelector(".move-opt.origin"), "no 'back to origin' option while the task IS on its origin");

// now move it, reopen: the picker should surface the origin shortcut
moves.doMove(rm, "fixture", task.id, dest, () => {});
moves.openMovePicker(rm, "fixture", task, () => {});
const lists = modalRoot.querySelectorAll(".move-list");
const latest = lists[lists.length - 1];
t.ok(latest.querySelector(".move-opt.origin"), "once moved, the picker offers a 'back to origin' shortcut");
const optDays = [...latest.querySelectorAll(".move-opt")].map(o => o.querySelector(".mo-title").textContent);
t.ok(optDays.length >= 1, "candidate days are listed with their titles");
// origin is pinned once as the "↩ Origin" shortcut and must NOT also reappear in the
// dated candidate list (it's excluded alongside the current day).
const expectedOpts = 1 + rm.days.filter(d => !d.off && d.id !== dest && d.id !== origin).length;
t.eq(latest.querySelectorAll(".move-opt").length, expectedOpts, "origin appears once (pinned), not duplicated among dated candidates");

t.group("drag and drop — a dragged task lands on the drop target; foreign drops are inert");
store.resetAll();
{
  const handle = document.createElement("span"), row = document.createElement("div"), target = document.createElement("div");
  document.body.append(row, target);
  let landed = 0;
  moves.makeDraggable(handle, row, task);
  moves.installDayDrop(target, dest, rm, "fixture", () => landed++);
  const dt = { data: {}, setData(k, v) { this.data[k] = v; }, getData(k) { return this.data[k] || ""; } };
  const ev = (type, extra = {}) => Object.assign(new dom.window.Event(type, { bubbles: true, cancelable: true }), { dataTransfer: dt }, extra);
  t.eq(handle.getAttribute("draggable"), "true", "the handle is draggable");
  handle.dispatchEvent(ev("dragstart"));
  t.ok(row.classList.contains("moving"), "dragstart marks the row as moving");
  const over = ev("dragover");
  target.dispatchEvent(over);
  t.ok(over.defaultPrevented && target.classList.contains("dragover"), "dragging over a day accepts the drop and highlights it");
  target.dispatchEvent(ev("drop"));
  t.eq(store.getMove("fixture", task.id), dest, "dropping moves the task onto that day");
  t.ok(landed > 0 && !target.classList.contains("dragover"), "…repaints and clears the highlight");
  handle.dispatchEvent(ev("dragend"));
  t.ok(!row.classList.contains("moving"), "dragend clears the moving state");
  // a drop from OUTSIDE the app (e.g. text dragged from another window)
  store.resetAll();
  const foreign = { getData: () => "definitely-not-a-task" };
  target.dispatchEvent(Object.assign(new dom.window.Event("drop", { bubbles: true, cancelable: true }), { dataTransfer: foreign }));
  t.eq(Object.keys(store.rawState().fixture || {}).length, 0, "an unknown dropped id writes nothing");
  const idle = ev("dragover");
  target.dispatchEvent(idle);
  t.ok(!idle.defaultPrevented, "with no task being dragged, dragover does not accept");
  row.remove(); target.remove();
}

t.done();
