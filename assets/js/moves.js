// moves.js — relocate a task from its origin day to another day of the SAME
// roadmap (or back to origin). Drag-and-drop is the primary gesture; a custom
// picker modal is the accessible / touch fallback. State is a single move row
// (store.setMove); absence = on origin (DESIGN §10).

import * as store from "./store.js";
import { openModal, toast } from "./ui.js";
import { el, fmtDateHuman, relDay } from "./util.js";
import { currentDay } from "./stats.js";

let dragTaskId = null;                 // full task id being dragged

/* ---------- drag source ---------- */
export function makeDraggable(handleEl, rowEl, task) {
  handleEl.setAttribute("draggable", "true");
  handleEl.addEventListener("dragstart", e => {
    dragTaskId = task.id;
    rowEl.classList.add("moving");
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", task.id); } catch {}
  });
  handleEl.addEventListener("dragend", () => { dragTaskId = null; rowEl.classList.remove("moving"); });
}

/* ---------- drop target ---------- */
export function installDayDrop(dayEl, dayId, rm, slug, onMoved) {
  dayEl.addEventListener("dragover", e => {
    if (!dragTaskId) return;
    e.preventDefault(); e.dataTransfer.dropEffect = "move";
    dayEl.classList.add("dragover");
  });
  dayEl.addEventListener("dragleave", e => {
    if (!dayEl.contains(e.relatedTarget)) dayEl.classList.remove("dragover");
  });
  dayEl.addEventListener("drop", e => {
    dayEl.classList.remove("dragover");
    const taskId = dragTaskId || (e.dataTransfer && e.dataTransfer.getData("text/plain"));
    if (!taskId) return;
    e.preventDefault();
    doMove(rm, slug, taskId, dayId, onMoved);
  });
}

/* ---------- the actual state change ---------- */
export function doMove(rm, slug, taskId, destDayId, onMoved) {
  const task = rm.tasksById.get(taskId);
  if (!task) return;
  const cur = currentDay(rm, slug, task);
  if (cur === destDayId) return;                      // no-op

  const backToOrigin = destDayId === task.day;
  const prevCur = cur;
  store.setMove(slug, taskId, backToOrigin ? null : destDayId);

  const destDay = rm.daysById.get(destDayId);
  const label = backToOrigin ? "back to its origin day"
    : `to ${destDay ? fmtDateHuman(destDay.date) : destDayId}`;
  toast(`Moved ${label}`, {
    type: "ok",
    undo: { label: "Undo", action: () => {
      store.setMove(slug, taskId, prevCur === task.day ? null : prevCur);
      onMoved && onMoved();
    } },
  });
  onMoved && onMoved();
}

/* ---------- custom picker (fallback / touch / keyboard) ---------- */
export function openMovePicker(rm, slug, task, onMoved) {
  const cur = currentDay(rm, slug, task);
  const list = el("div.move-list");

  // "back to origin" first, if currently moved
  if (cur !== task.day) {
    const od = rm.daysById.get(task.day);
    list.append(moveOpt(od, "origin", true, () => close(task.day)));
  }
  // candidate days: same roadmap, ordered by date, excluding current
  const days = rm.days.filter(d => !d.off && d.id !== cur)
    .sort((a, b) => a.date < b.date ? -1 : 1);
  for (const d of days) list.append(moveOpt(d, relDay(d.date), false, () => close(d.id)));

  const ctrl = openModal({
    title: "Move task", icon: "⇄",
    subtitle: task.label.replace(/<[^>]+>/g, "").slice(0, 80),
    body: list, wide: false,
    actions: [{ label: "Cancel", variant: "ghost" }],
  });

  function close(destDayId) { ctrl.close(); doMove(rm, slug, task.id, destDayId, onMoved); }

  function moveOpt(day, badge, isOrigin, onClick) {
    const opt = el("button.move-opt" + (isOrigin ? ".origin" : ""));
    opt.append(el("span.mo-date", { text: day ? fmtDateHuman(day.date).replace(/^\w+ /, "") : "?" }));
    opt.append(el("span.mo-title", { text: (isOrigin ? "↩ Origin — " : "") + (day ? day.title : "") }));
    opt.append(el("span.mo-load", { text: day ? `${day.tasks.length} tasks · ${badge}` : badge }));
    opt.onclick = onClick;
    return opt;
  }
}
