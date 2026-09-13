// atlas.test.mjs — a roadmap's compact "Atlas" layout (atlas.js + the journey bar in
// render.js): where every task is placed, the brick scale, the board's structure, ticking
// from a brick, the day lens (tick / move / open card / dismissal), the Cards ⇄ Atlas
// switch (persisted, open cards kept, the day in view kept), spotlight, drag & drop and
// the day menu. Runs on the REAL roadmaps under jsdom with a clock set from the data, so
// a whole-roadmap date shift never needs this file touched. Skips cleanly without jsdom.
import { suite } from "./_harness.mjs";

const t = suite("atlas");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="app"><main id="main"><div id="view"></div></main></div>
  <div id="toast-root"></div><div id="modal-root"></div>
</body></html>`, { url: "http://localhost/" });
const w = dom.window;
global.window = w;
global.document = w.document;
global.location = w.location;
global.localStorage = w.localStorage;
global.CSS = w.CSS;
global.getComputedStyle = (...a) => w.getComputedStyle(...a);
global.requestAnimationFrame = fn => setTimeout(fn, 0);
w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
w.HTMLElement.prototype.scrollIntoView = function () { this.dataset.scrolledTo = "1"; };

const RealDate = Date;
let NOW = new RealDate(2026, 0, 1, 12).getTime();
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(NOW); }
  static now() { return NOW; }
}
global.Date = FakeDate;
const setToday = iso => { const [y, m, d] = iso.split("-").map(Number); NOW = new RealDate(y, m - 1, d, 12).getTime(); };

const base = new URL("../public/assets/js/", import.meta.url);
const rmBase = new URL("../public/roadmaps/", import.meta.url);
const reg = await import(new URL("registry.js", base).href);
for (const f of ["rust-fastapi.js", "interp-go.js", "bedrock.js", "raylib.js"]) await import(new URL(f, rmBase).href);
const store = await import(new URL("store.js", base).href);
const util = await import(new URL("util.js", base).href);
const ui = await import(new URL("ui.js", base).href);
const render = await import(new URL("render.js", base).href);
const atlas = await import(new URL("atlas.js", base).href);

const view = document.getElementById("view");
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const wait = (ms = 10) => new Promise(r => setTimeout(r, ms));
const click = n => n.dispatchEvent(new w.MouseEvent("click", { bubbles: true, cancelable: true }));
const leaves = task => task.subs || [task];
const allDone = (slug, task) => leaves(task).every(l => store.isDone(slug, l.id));

const rm = reg.getRoadmap("rust-fastapi");
const today = rm.days[6].date;                       // a real planned day, whatever the dates are
setToday(today);

/* ------------------------------------------------------------------ */
t.group("placement — every task sits on the day it currently lives on");
{
  const slots = atlas.placement(rm);
  t.eq(slots.size, rm.days.length, "one slot per day card");
  const placed = [...slots.values()].flatMap(s => [...s.required, ...s.bonus].map(x => x.id));
  const authored = rm.days.flatMap(d => d.tasks.map(x => x.id));
  t.eq(placed.length, authored.length, "every task is placed exactly once (no loss, no duplicates)");
  t.eq(new Set(placed).size, authored.length, "…with no task placed twice");
  t.ok([...slots.values()].every(s => s.required.every(x => !x.optional) && s.bonus.every(x => x.optional)),
    "required and bonus work are kept apart");
  t.ok([...slots.values()].every(s => s.date === s.day.date), "with no re-dated cards, each slot's date is the authored date");

  const task = rm.days[1].tasks.find(x => !x.optional);
  const dest = rm.days[4];
  store.setMove(rm.slug, task.id, dest.id);
  const moved = atlas.placement(rm);
  t.ok(!moved.get(rm.days[1].id).required.includes(task), "a moved task leaves its origin day");
  const destReq = moved.get(dest.id).required;
  t.ok(destReq.includes(task), "…and appears on the destination day");
  t.eq(destReq[destReq.length - 1], task, "…after the destination's own tasks");
  store.setMove(rm.slug, task.id, null);

  // a card re-dated inside its free gap carries its tasks to the new date
  const gapDay = rm.days.find(d => d.nextDate && util.daysBetween(d.date, d.nextDate) >= 2);
  const newDate = util.addDays(gapDay.date, 1);
  store.setDayDate(rm.slug, gapDay.id, newDate);
  t.eq(atlas.placement(rm).get(gapDay.id).date, newDate, "a re-dated day card is placed on its new date");
  store.setDayDate(rm.slug, gapDay.id, null);

  const slot = atlas.placement(rm).get(rm.days[2].id);
  const planned = slot.required.reduce((n, x) => n + leaves(x).reduce((a, l) => a + (l.est || 0), 0), 0);
  t.eq(atlas.slotMinutes(rm.slug, slot).mins, planned, "slotMinutes sums the required leaves' minutes");
  const first = slot.required[0];
  const firstLeaf = leaves(first)[0];
  store.setTask(rm.slug, firstLeaf.id, true);
  t.eq(atlas.slotMinutes(rm.slug, slot).done, firstLeaf.est || 0, "…and counts only the ticked leaves as done");
  store.setTask(rm.slug, firstLeaf.id, false);
}

t.group("bricks — height follows minutes; labels are plain text");
{
  const hs = [0, 10, 30, 45, 60, 90, 120, 180, 400].map(m => atlas.brickHeight(m));
  t.ok(hs.every((h, i) => i === 0 || h >= hs[i - 1]), `a longer task is never a shorter brick (${hs.join(",")})`);
  t.ok(Math.min(...hs) >= 26 && Math.max(...hs) <= 104, "heights stay inside readable bounds (26–104px)");
  t.ok(atlas.brickHeight(20, true) >= 34 && atlas.brickHeight(20, true) > atlas.brickHeight(20),
    "a task with parts gets room for its sub-task pips");
  t.eq(atlas.plainText("Rust — <code>Mutex&lt;T&gt;</code> &amp; <a href='#'>Arc</a>"), "Rust — Mutex<T> & Arc",
    "authored HTML becomes readable text (entities decoded, tags dropped)");
}

/* ------------------------------------------------------------------ */
t.group("the Atlas board — structure");
ui.setSetting("timelineView", "atlas");
render.renderRoadmap(rm, view, { animate: false });
{
  t.ok(view.querySelector(".atlas") && !view.querySelector(".timeline"), "the Atlas replaces the day cards");
  t.ok(view.classList.contains("wide"), "the Atlas widens the view");
  const btns = $$(".jbar .jview-btn");
  t.eq(btns.length, 2, "the journey bar holds the two-way layout switch");
  t.eq(btns.find(b => b.dataset.view === "atlas").getAttribute("aria-pressed"), "true", "…with Atlas pressed");
  t.eq($$(".plate").length, rm.weeks.length, "one plate per week");
  t.eq($$("[data-atlas-day]").length, rm.days.length, "one column per day");
  const monthsOfWeeks = new Set(rm.weeks.map(wk => rm.days.filter(d => d.week === wk.id).map(d => d.date).sort()[0].slice(0, 7)));
  t.eq($$(".atlas-month").length, monthsOfWeeks.size, "a month heading wherever a week opens a new month");

  const required = rm.days.flatMap(d => d.tasks.filter(x => !x.optional));
  t.eq(view.querySelectorAll(".brick:not(.bonus)").length, required.length, "every required task is one brick");
  t.eq(view.querySelectorAll(".brick.bonus").length, rm.days.flatMap(d => d.tasks.filter(x => x.optional)).length,
    "bonus tasks are drawn as bonus bricks");
  const sample = rm.days[3].tasks.find(x => !x.optional);
  const b = view.querySelector(`[data-atlas-day="${rm.days[3].id}"] .brick[data-task="${sample.id}"]`);
  t.ok(b, "a brick sits in its own day's column");
  t.eq(b.style.getPropertyValue("--h"), `${atlas.brickHeight(sample.est, !!sample.subs)}px`, "…at the height its minutes call for");
  const withSubs = rm.days.flatMap(d => d.tasks).find(x => x.subs && !x.optional);
  t.eq(view.querySelectorAll(`.brick[data-task="${withSubs.id}"] .brick-pips i`).length, withSubs.subs.length,
    "a task with parts shows one pip per sub-task");

  const todayDay = rm.days[6];
  const col = view.querySelector(`[data-atlas-day="${todayDay.id}"]`);
  t.ok(col.classList.contains("today"), "today's column is marked");
  t.ok(col.closest(".plate").classList.contains("now"), "…inside the plate marked as this week");
  t.ok(view.querySelector(`[data-atlas-day="${rm.days[0].id}"]`).classList.contains("past"), "earlier days are marked past");
  const ms = rm.milestones[0];
  t.ok(view.querySelector(`[data-atlas-week="${ms.week}"] .plate-ms`), "a week's milestones show on its plate");
}

t.group("ticking from a brick");
{
  const task = rm.days[8].tasks.find(x => x.subs && !x.optional);
  const brickOf = () => view.querySelector(`.brick[data-task="${task.id}"]`);
  click(brickOf().querySelector(".brick-tick"));
  t.ok(allDone(rm.slug, task), "the brick's tick completes every part of the task");
  t.ok(brickOf().classList.contains("done"), "the board repaints the brick as done");
  t.ok(brickOf().classList.contains("ticked"), "…and animates its fill rising (once)");
  t.eq(brickOf().querySelector(".brick-tick").getAttribute("aria-checked"), "true", "the tick reports checked");
  render.rerender();
  t.ok(!brickOf().classList.contains("ticked"), "a later repaint doesn't replay the fill animation");
  click(brickOf().querySelector(".brick-tick"));
  t.ok(leaves(task).every(l => !store.isDone(rm.slug, l.id)), "ticking a done brick clears it");
  store.setTask(rm.slug, task.subs[0].id, true);
  render.rerender();
  t.ok(brickOf().classList.contains("partial"), "a part-done task shows as partial");
  t.eq(brickOf().querySelector(".brick-tick").getAttribute("aria-checked"), "mixed", "…with a mixed tick");
  store.setTask(rm.slug, task.subs[0].id, false);
  render.rerender();
}

t.group("the day lens — details, ticks, moves, dismissal");
{
  const day = rm.days[5];
  const task = day.tasks.find(x => x.subs && !x.optional);
  click(view.querySelector(`.brick[data-task="${task.id}"] .brick-main`));
  const lens = () => $(".lens");
  t.ok(lens(), "clicking a brick opens the lens");
  t.eq(lens().getAttribute("role"), "dialog", "the lens is a labelled dialog");
  t.ok(lens().textContent.includes(day.title), "it shows the day's title");
  t.eq(lens().querySelectorAll(".lens-task").length, day.tasks.length, "…and every task of the day");
  t.eq(lens().querySelector(".lens-task.focus")?.dataset.task, task.id, "the clicked task is highlighted");
  t.ok(view.querySelector(`[data-atlas-day="${day.id}"]`).classList.contains("lens-anchor"), "its column is marked as the anchor");

  const sub = task.subs[0];
  click(lens().querySelector(`.lens-sub[data-task="${sub.id}"] .checkbox`));
  t.ok(store.isDone(rm.slug, sub.id), "ticking a part in the lens saves it");
  t.ok(lens() && lens().querySelector(`.lens-sub[data-task="${sub.id}"]`).classList.contains("done"), "the lens stays open and shows it done");
  t.ok(view.querySelector(`.brick[data-task="${task.id}"]`).classList.contains("partial"), "…and the board behind it updates");
  t.ok(!lens().querySelector(".lens-task.focus"), "the highlight doesn't repeat on refresh");
  click(lens().querySelector(`.lens-task[data-task="${task.id}"] > .checkbox`));
  t.ok(allDone(rm.slug, task), "the task's own checkbox completes all its parts");
  setAllBack(task);

  // pointer inside the board's bricks re-targets instead of dismissing
  const other = view.querySelector(`[data-atlas-day="${rm.days[9].id}"] .brick-main`);
  other.dispatchEvent(new w.Event("pointerdown", { bubbles: true }));
  t.ok(lens(), "pressing another brick doesn't dismiss the lens…");
  click(other);
  t.ok(lens().textContent.includes(rm.days[9].title), "…it re-targets the lens to that day");
  t.eq($$(".lens").length, 1, "only one lens ever exists");

  document.body.dispatchEvent(new w.Event("pointerdown", { bubbles: true }));
  await wait(200);
  t.ok(!lens(), "pressing outside closes the lens");

  click(view.querySelector(`[data-atlas-day="${day.id}"] .aday-head`));
  t.ok(lens() && !lens().querySelector(".lens-task.focus"), "a column's head opens its lens with nothing highlighted");
  document.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await wait(200);
  t.ok(!lens(), "Escape closes the lens");

  click(view.querySelector(`[data-atlas-day="${day.id}"] .aday-head`));
  w.dispatchEvent(new w.HashChangeEvent("hashchange"));
  await wait(200);
  t.ok(!lens(), "navigating away closes the lens");

  // move a task from the lens: the picker opens over it and the lens follows the move
  const movable = day.tasks.find(x => !x.optional);
  click(view.querySelector(`[data-atlas-day="${day.id}"] .aday-head`));
  click(lens().querySelector(`.lens-task[data-task="${movable.id}"] .lens-move`));
  const opts = $$("#modal-root .move-opt");
  t.ok(opts.length > 0, "the move button opens the move picker");
  $("#modal-root").dispatchEvent(new w.Event("pointerdown", { bubbles: true }));
  t.ok(lens(), "working in the picker doesn't dismiss the lens");
  click(opts[opts.length - 1]);
  await wait(250);
  t.ok(store.getMove(rm.slug, movable.id), "picking a day moves the task");
  t.ok(!lens().querySelector(`.lens-task[data-task="${movable.id}"]`), "…and it leaves this day's lens");
  t.ok(!view.querySelector(`[data-atlas-day="${day.id}"] .brick[data-task="${movable.id}"]`), "…and this day's column");
  store.setMove(rm.slug, movable.id, null);
  render.rerender();

  // the lens's main action opens the full day card
  click(view.querySelector(`[data-atlas-day="${day.id}"] .aday-head`));
  click([...lens().querySelectorAll(".lens-foot button")].find(b => /full day card/i.test(b.textContent)));
  await wait(30);
  t.eq(ui.getSettings().timelineView, "cards", "“Open the full day card” switches to the cards");
  const card = view.querySelector(`.day[data-day="${day.id}"]`);
  t.ok(card && card.classList.contains("open"), "…with that day's card open");
  t.eq(card.dataset.scrolledTo, "1", "…and brought into view");
  await wait(200);
}
function setAllBack(task) { for (const l of leaves(task)) store.setTask(rm.slug, l.id, false); render.rerender(); }

t.group("switching layouts keeps what you had open");
{
  const open = rm.days[12].id;
  const card = view.querySelector(`.day[data-day="${open}"]`);
  if (!card.classList.contains("open")) click(card.querySelector(".day-head"));
  click(view.querySelector('.jview-btn[data-view="atlas"]'));
  t.eq(ui.getSettings().timelineView, "atlas", "the switch persists the Atlas choice");
  t.ok(view.querySelector(".atlas"), "…and draws the Atlas");
  t.ok(view.querySelector(".jview.switched"), "the switch animates its thumb when there are no view transitions");
  render.rerender();                                  // a tick-style repaint while in the Atlas
  click(view.querySelector('.jview-btn[data-view="cards"]'));
  t.ok(view.querySelector(`.day[data-day="${open}"]`).classList.contains("open"),
    "cards opened before the Atlas are still open after switching back");
  const before = view.innerHTML.length;
  render.setJourneyView("cards");
  t.eq(view.innerHTML.length, before, "switching to the layout already shown does nothing");

  t.ok(render.revealDay(rm.days[20].id), "revealDay finds a day in the cards");
  render.setJourneyView("atlas");
  view.querySelectorAll("[data-scrolled-to]").forEach(n => delete n.dataset.scrolledTo);
  t.ok(render.revealDay(rm.days[20].id), "…and in the Atlas");
  t.eq(view.querySelector(`[data-atlas-day="${rm.days[20].id}"]`).closest(".plate").dataset.scrolledTo, "1",
    "in the Atlas it scrolls the day's week plate into view");
  t.eq(render.revealDay("d999"), false, "an unknown day is reported as not found");

  t.eq(render.currentDayOf(rm).id, rm.days[6].id, "the current day is today's day");
  setToday(util.addDays(rm.days[0].date, -30));
  t.eq(render.currentDayOf(rm).id, rm.days[0].id, "before the journey starts it is the first day");
  setToday(util.addDays(rm.days[rm.days.length - 1].date, 30));
  t.eq(render.currentDayOf(rm).id, rm.days[rm.days.length - 1].id, "after it ends it is the last day");
  setToday(today);
}

t.group("the journey bar's “Now” lands on the current day");
{
  view.querySelectorAll("[data-scrolled-to]").forEach(n => delete n.dataset.scrolledTo);
  render.rerender();
  click(view.querySelector(".jbar-now"));
  t.eq(view.querySelector(`[data-atlas-day="${rm.days[6].id}"]`).closest(".plate").dataset.scrolledTo, "1",
    "Now scrolls today's week into view");
}

t.group("spotlight — one kind of work, across the whole journey");
{
  const chip = view.querySelector(".atlas-cat");
  const cat = chip.textContent.replace(/\d+$/, "").trim();
  click(chip);
  const bricks = $$(".atlas .brick");
  t.ok(view.querySelector(".atlas-cat.on"), "the chip shows as on");
  t.ok(bricks.filter(b => b.dataset.cat === cat && !b.classList.contains("bonus")).every(b => !b.classList.contains("dim")),
    "that kind of work stays lit");
  t.ok(bricks.filter(b => b.dataset.cat !== cat).every(b => b.classList.contains("dim")), "everything else dims");
  render.rerender();
  t.ok(view.querySelector(".atlas-cat.on"), "the spotlight survives a repaint");
  click(view.querySelector(".atlas-cat.on"));
  t.eq(view.querySelectorAll(".atlas .brick.dim").length, 0, "clicking it again clears the spotlight");
}

t.group("drag a brick onto another day");
{
  const task = rm.days[10].tasks.find(x => !x.optional);
  const dest = rm.days[11];
  const dt = { data: {}, setData(k, v) { this.data[k] = v; }, getData(k) { return this.data[k] || ""; } };
  const ev = type => Object.assign(new w.Event(type, { bubbles: true, cancelable: true }), { dataTransfer: dt });
  const b = view.querySelector(`.brick[data-task="${task.id}"]`);
  t.eq(b.getAttribute("draggable"), "true", "a required brick is draggable");
  t.eq(view.querySelector(".brick.bonus")?.getAttribute("draggable") ?? null, null, "a bonus brick is not");
  b.dispatchEvent(ev("dragstart"));
  const col = view.querySelector(`[data-atlas-day="${dest.id}"]`);
  const over = ev("dragover");
  col.dispatchEvent(over);
  t.ok(over.defaultPrevented && col.classList.contains("dragover"), "a day column accepts the drop");
  col.dispatchEvent(ev("drop"));
  t.eq(store.getMove(rm.slug, task.id), dest.id, "dropping moves the task to that day");
  t.ok(view.querySelector(`[data-atlas-day="${dest.id}"] .brick.moved-in[data-task="${task.id}"]`),
    "the board shows it on the new day, marked as moved in");
  store.setMove(rm.slug, task.id, null);
  render.rerender();
}

t.group("right-click a day for its menu");
{
  const head = view.querySelector(`[data-atlas-day="${rm.days[14].id}"] .aday-head`);
  head.dispatchEvent(new w.MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
  t.ok($(".ctx-menu"), "the day menu opens (details + move day)");
  document.body.dispatchEvent(new w.Event("pointerdown", { bubbles: true }));
  await wait(200);
}

t.group("leaving the roadmap");
{
  click(view.querySelector(`[data-atlas-day="${rm.days[3].id}"] .aday-head`));
  render.renderToday(view);
  await wait(200);
  t.ok(!$(".lens"), "a global view closes an open lens");
  t.ok(!view.classList.contains("wide"), "…and gives back the normal width");
  t.eq(render.revealDay(rm.days[3].id), false, "no roadmap is drawn, so nothing is revealed");
}

t.group("every roadmap draws as an Atlas");
for (const r of reg.getRoadmaps()) {
  render.renderRoadmap(r, view, { animate: false });
  const bricks = view.querySelectorAll(".brick").length;
  t.eq(bricks, r.days.reduce((n, d) => n + d.tasks.length, 0), `${r.slug}: every task is a brick`);
}
ui.setSetting("timelineView", "cards");

t.done();
