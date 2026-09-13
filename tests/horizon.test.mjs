// horizon.test.mjs — the global Horizon view (#/horizon, horizon.js): the pure date model
// (every task counted once, on the date it currently lives on; per-date minutes and the
// owner's daily ceiling; free-day gaps; look-ahead totals) and the view (starts at today,
// earlier days on demand, lanes that can be hidden, density, the skyline navigator,
// ticking in place, the lens opening the roadmap day). Real roadmaps under jsdom with a
// clock set from the data, so date shifts never touch this file. Skips without jsdom.
import { suite } from "./_harness.mjs";

const t = suite("horizon");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="app"><nav id="sb-list"></nav><main id="main"><div id="view"></div></main></div>
  <div id="toast-root"></div><div id="modal-root"></div>
</body></html>`, { url: "http://localhost/#/horizon" });
const w = dom.window;
global.window = w;
global.document = w.document;
global.location = w.location;
global.localStorage = w.localStorage;
global.CSS = w.CSS;
global.getComputedStyle = (...a) => w.getComputedStyle(...a);
global.requestAnimationFrame = fn => setTimeout(fn, 0);
w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
w.HTMLElement.prototype.scrollIntoView = function () {};
let scrolledTo = null;
w.HTMLElement.prototype.scrollTo = function (o) { scrolledTo = o; };

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
const hz = await import(new URL("horizon.js", base).href);

const view = document.getElementById("view");
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const wait = (ms = 10) => new Promise(r => setTimeout(r, ms));
const click = n => n.dispatchEvent(new w.MouseEvent("click", { bubbles: true, cancelable: true }));
const leaves = task => task.subs || [task];
const R = reg.getRoadmaps();
const laneChip = title => $$(".hz-lane").find(b => b.title === title);   // (titles hold "+", which jsdom's selector engine mis-parses)
const reqMins = task => leaves(task).reduce((n, l) => n + (l.est || 0), 0);

/* ------------------------------------------------------------------ */
t.group("buildHorizon — every date with work, every task counted once");
{
  const dates = hz.buildHorizon(R);
  const ds = dates.map(d => d.date);
  t.ok(ds.every((d, i) => i === 0 || d > ds[i - 1]), "dates are in order and unique");
  const expectDates = new Set(R.flatMap(r => r.days.map(d => d.date)));
  t.eq(dates.length, expectDates.size, "one entry per date any roadmap works on");

  const reqTotal = R.reduce((n, r) => n + r.days.reduce((a, d) => a + d.tasks.filter(x => !x.optional).length, 0), 0);
  t.eq(dates.reduce((n, d) => n + d.tasks, 0), reqTotal, "every required task of every roadmap is counted exactly once");

  const byDate = new Map();
  for (const r of R) for (const d of r.days) for (const x of d.tasks) if (!x.optional)
    byDate.set(d.date, (byDate.get(d.date) || 0) + reqMins(x));
  t.ok(dates.every(d => d.mins === (byDate.get(d.date) || 0)), "each date's minutes are its planned required minutes (bonus never loads a day)");
  t.ok(dates.every(d => d.cap === 180), "every day's ceiling is the owner's 3h, however many roadmaps share it");
  t.ok(dates.every(d => d.entries.every((e, i) => i === 0 || R.indexOf(e.rm) > R.indexOf(d.entries[i - 1].rm))),
    "a date's roadmaps keep the sidebar order");
  t.ok(dates.some(d => d.roadmaps >= 3), "the real plan has days shared by three or more roadmaps");
}

t.group("buildHorizon — follows moves, re-dated cards and ticks");
{
  const rm = reg.getRoadmap("interp-go");
  const working = rm.days.filter(d => d.tasks.some(x => !x.optional));
  const origin = working[3], dest = working[7];
  const task = origin.tasks.find(x => !x.optional);
  const at = (date, slug) => hz.buildHorizon(R).find(d => d.date === date).entries.find(e => e.rm.slug === slug);
  const before = at(dest.date, rm.slug).mins;
  store.setMove(rm.slug, task.id, dest.id);
  t.eq(at(dest.date, rm.slug).mins, before + reqMins(task), "a moved task's minutes land on the destination date");
  t.ok(!(at(origin.date, rm.slug)?.slot.required || []).includes(task), "…and leave the origin date");
  store.setMove(rm.slug, task.id, null);

  const gapDay = rm.days.find(d => d.nextDate && util.daysBetween(d.date, d.nextDate) >= 2);
  const newDate = util.addDays(gapDay.date, 1);
  store.setDayDate(rm.slug, gapDay.id, newDate);
  t.ok(at(newDate, rm.slug) && at(newDate, rm.slug).slot.day === gapDay, "a re-dated card moves its whole day to the new date");
  store.setDayDate(rm.slug, gapDay.id, null);

  const e0 = at(origin.date, rm.slug);
  for (const l of leaves(task)) store.setTask(rm.slug, l.id, true);
  const e1 = at(origin.date, rm.slug);
  t.eq(e1.tasksDone, e0.tasksDone + 1, "completing a task counts it done on its date");
  t.eq(e1.doneMins, e0.doneMins + reqMins(task), "…with its minutes");
  for (const l of leaves(task)) store.setTask(rm.slug, l.id, false);
}

t.group("withFreeDays + rangeLoad");
{
  const mk = (date, mins, doneMins = 0, tasks = 1, tasksDone = 0) => ({ date, mins, doneMins, tasks, tasksDone });
  const ds = [mk("2026-10-01", 60), mk("2026-10-02", 30, 30, 1, 1), mk("2026-10-05", 90), mk("2026-10-06", 45)];
  const rows = hz.withFreeDays(ds);
  t.eq(rows.length, 5, "one free row fills the gap");
  t.deep(rows.map(r => r.free ? `free:${r.from}..${r.to}:${r.n}` : r.date),
    ["2026-10-01", "2026-10-02", "free:2026-10-03..2026-10-04:2", "2026-10-05", "2026-10-06"],
    "the free row spans exactly the empty dates");
  t.eq(hz.withFreeDays([]).length, 0, "no dates, no rows");
  t.deep(hz.rangeLoad(ds, "2026-10-02", "2026-10-05"), { mins: 120, left: 90, tasks: 1, days: 2 },
    "rangeLoad totals planned, still-left minutes, tasks left and working days in the range");
}

/* ------------------------------------------------------------------ */
const all = hz.buildHorizon(R);
const today = all[20].date;                       // a busy mid-plan day, from the data itself
setToday(today);
localStorage.clear();

t.group("the view — starts at today");
hz.renderHorizon(view);
{
  t.ok($(".hz"), "Horizon renders");
  t.ok(view.classList.contains("wide"), "it uses the wide layout");
  t.eq($$(".sky-col").length, all.length, "the skyline has a column for every date with work");
  t.eq($$(".hz-lanes-head .hz-lh").length, R.length, "one lane per roadmap");
  const rows = $$(".hz-list [data-from]");
  t.eq(rows[0].dataset.from, today, "the list opens on today");
  t.ok(rows.every(r => r.dataset.to >= today), "earlier days are tucked away");
  const pastDates = all.filter(d => d.date < today).length;
  const toggle = $(".hz-past-toggle");
  t.ok(toggle && /Show \d+ earlier day/.test(toggle.textContent), "a button offers the earlier days");
  t.eq($$(".hz-day[data-from]").length, all.length - pastDates, "every date from today on has its row");
  t.ok($(".hz-day.today"), "today's row is marked");
  const todayRow = $(`.hz-day[data-from="${today}"]`);
  const d = all.find(x => x.date === today);
  t.eq(todayRow.querySelectorAll(".hz-ticket").length, d.entries.length, "today's row holds one ticket per roadmap working today");
  t.eq(todayRow.querySelectorAll(".hz-cell").length, R.length, "…inside a cell for every lane");
  t.eq(todayRow.querySelectorAll(".hz-cell.empty").length, R.length - new Set(d.entries.map(e => e.rm.slug)).size, "…empty lanes are drawn as empty");
  t.eq(todayRow.querySelectorAll(".brick").length, d.entries.reduce((n, e) => n + e.slot.required.length + e.slot.bonus.length, 0),
    "every task of the day is a brick");
  t.ok(todayRow.querySelector(".hz-gauge-t").textContent.includes(util.fmtMins(d.cap)), "the gauge measures the day against its ceiling");
  t.ok($$(".hz-week").length >= 2, "weeks are ruled off with their totals");
  t.eq($$(".hz-stat").length, 4, "a look-ahead strip sums the days ahead");
  const next7 = hz.rangeLoad(all, today, util.addDays(today, 6));
  t.eq($(".hz-stat .hz-stat-v").textContent, util.fmtMins(next7.left), "“Next 7 days” shows the minutes still left");
}

t.group("earlier days on demand");
{
  click($(".hz-past-toggle"));
  t.ok($$(".hz-list [data-from]").some(r => r.dataset.to < today), "the earlier days appear");
  t.ok(/Hide earlier days/.test($(".hz-past-toggle").textContent), "…and the button offers to hide them again");
  hz.renderHorizon(view);
  t.ok($$(".hz-list [data-from]").some(r => r.dataset.to < today), "a repaint of the open view keeps them shown");
  click($(".hz-past-toggle"));
  t.ok($$(".hz-list [data-from]").every(r => r.dataset.to >= today), "hiding them again works");
  view.innerHTML = "";
  hz.renderHorizon(view);
  t.ok($$(".hz-list [data-from]").every(r => r.dataset.to >= today), "a fresh visit starts at today again");
}

t.group("lanes and density are remembered per viewer");
{
  const slug = R[2].slug;
  click(laneChip(`Hide ${R[2].title}`));
  t.ok(!$(`.hz-cell[data-lane="${slug}"]`), "hiding a roadmap removes its lane");
  t.deep(JSON.parse(localStorage.getItem("roadmaps_horizon_hidden")), [slug], "…and remembers it");
  t.eq($$(".hz-lanes-head .hz-lh").length, R.length - 1, "the lane titles follow");
  for (const r of R.filter(r => r.slug !== slug).slice(0, -1)) click(laneChip(`Hide ${r.title}`));
  const last = R.filter(r => r.slug !== slug).slice(-1)[0];
  click(laneChip(`Hide ${last.title}`));
  t.ok($(`.hz-cell[data-lane="${last.slug}"]`), "the last visible lane can't be hidden");
  t.eq($$(".hz-lanes-head .hz-lh").length, 1, "…the click is refused, leaving just that lane (not a reset to all lanes)");
  t.eq(JSON.parse(localStorage.getItem("roadmaps_horizon_hidden")).length, R.length - 1, "…and the stored choice keeps the others hidden");
  localStorage.setItem("roadmaps_horizon_hidden", JSON.stringify(R.map(r => r.slug).concat("gone")));
  hz.renderHorizon(view);
  t.eq($$(".hz-lanes-head .hz-lh").length, R.length, "a stored state hiding everything (or unknown roadmaps) falls back to all lanes");
  localStorage.setItem("roadmaps_horizon_hidden", "{not json");
  hz.renderHorizon(view);
  t.eq($$(".hz-lanes-head .hz-lh").length, R.length, "…as does a corrupt stored value");
  localStorage.removeItem("roadmaps_horizon_hidden");

  click([...$$(".hz-density button")].find(b => b.textContent === "Compact"));
  t.ok($(".hz.compact"), "Compact switches the rows to proportional strips");
  t.eq(localStorage.getItem("roadmaps_horizon_density"), "compact", "…and is remembered");
  click([...$$(".hz-density button")].find(b => b.textContent === "Detailed"));
  t.ok(!$(".hz.compact"), "Detailed switches back");
}

t.group("ticking from Horizon");
{
  const row = $(`.hz-day[data-from="${today}"]`);
  const brick = row.querySelector(".hz-ticket .brick:not(.bonus)");
  const [slug] = brick.closest(".hz-ticket").dataset.ticket.split("/");
  const task = reg.getRoadmap(slug).tasksById.get(brick.dataset.task);
  click(brick.querySelector(".brick-tick"));
  t.ok(leaves(task).every(l => store.isDone(slug, l.id)), "a brick's tick saves the task as done");
  const again = $(`.hz-day[data-from="${today}"] .brick[data-task="${task.id}"]`);
  t.ok(again && again.classList.contains("done"), "the timetable repaints it done");
  t.ok(/\d+\/\d+/.test(again.closest(".hz-ticket").querySelector(".hz-tcount").textContent), "the ticket's count updates");
  click(again.querySelector(".brick-tick"));
  t.ok(leaves(task).every(l => !store.isDone(slug, l.id)), "ticking again clears it");
}

t.group("the lens from a ticket");
{
  const ticket = $(`.hz-day[data-from="${today}"] .hz-ticket`);
  const [slug, dayId] = ticket.dataset.ticket.split("/");
  const rm = reg.getRoadmap(slug);
  click(ticket.querySelector(".hz-thead"));
  const lens = $(".lens");
  t.ok(lens && lens.textContent.includes(rm.daysById.get(dayId).title), "a ticket opens its day in the lens");
  t.eq(lens.style.getPropertyValue("--accent"), rm.accent, "the lens wears the roadmap's colour");
  const leaf = rm.daysById.get(dayId).tasks.flatMap(x => x.subs || [x])[0];
  click(lens.querySelector(`[data-task="${leaf.id}"] > .checkbox`));
  t.ok(store.isDone(slug, leaf.id), "ticking in the lens saves");
  t.ok($(".lens") && $(`.hz-day[data-from="${today}"] .hz-ticket[data-ticket="${slug}/${dayId}"]`), "the lens stays with the repainted ticket");
  store.setTask(slug, leaf.id, false);
  click([...$(".lens").querySelectorAll(".lens-foot button")].find(b => b.textContent.includes(rm.title)));
  t.eq(location.hash, `#/${slug}/${dayId}`, "“Open in …” goes to that day in its roadmap");
  await wait(200);
  t.ok(!$(".lens"), "…and the lens closes");
  ui.setSetting("roadmapAccent", "off");
  hz.renderHorizon(view);
  click($(`.hz-day[data-from="${today}"] .hz-ticket .hz-thead`));
  t.eq($(".lens").style.getPropertyValue("--accent"), "", "with roadmap colours off, the lens keeps the app accent");
  document.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape" }));
  ui.setSetting("roadmapAccent", "on");
  await wait(200);
}

t.group("the skyline navigates");
{
  hz.renderHorizon(view);
  const sky = $(".sky");
  t.eq(sky.getAttribute("role"), "slider", "the skyline is an accessible slider");
  scrolledTo = null;
  sky.dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  t.ok(scrolledTo && typeof scrolledTo.top === "number", "an arrow key scrolls the timetable");
  const past = all[2].date;
  hz.jumpTo(view, past, false);
  t.ok($$(".hz-list [data-from]").some(r => r.dataset.to < today), "jumping to an earlier date reveals the earlier days");
  scrolledTo = null;
  $(".sky").dispatchEvent(new w.KeyboardEvent("keydown", { key: "Home", bubbles: true }));
  t.ok(scrolledTo, "Home scrolls back to today");
  $("#main").dispatchEvent(new w.Event("scroll"));
  await wait(30);
  t.ok($(".sky-win"), "scrolling keeps the window in step");
  render.renderToday(view);
  let threw = false;
  try { $("#main").dispatchEvent(new w.Event("scroll")); await wait(30); } catch { threw = true; }
  t.ok(!threw && !$(".hz"), "after leaving Horizon, a scroll does nothing (the listener detached)");
}

t.group("edges of the plan");
{
  setToday(util.addDays(all[all.length - 1].date, 10));
  view.innerHTML = "";
  hz.renderHorizon(view);
  t.ok(!$(".hz-past-toggle") && $$(".hz-list .hz-day").length === all.length, "after the plan ends, every day is shown");
  t.ok(/behind you/.test($(".hz-ahead").textContent), "…and the look-ahead says so");
  setToday(util.addDays(all[0].date, -5));
  view.innerHTML = "";
  hz.renderHorizon(view);
  t.ok(!$(".hz-past-toggle") && $$(".hz-list .hz-day").length === all.length, "before it starts, every day is ahead");
  t.ok(!$(".sky-now"), "no today needle outside the plan");
}

t.group("wiring — sidebar and reserved route");
{
  ui.renderSidebar({ roadmaps: R, active: null, expandedSlug: null, statsFor: () => ({ pct: 0, track: "on" }), onNavigate() {} });
  const link = $(".sb-horizon");
  t.ok(link && link.getAttribute("href") === "#/horizon", "the sidebar links to Horizon");
  const labels = $$("#sb-list > .sb-today").map(a => a.getAttribute("href"));
  t.eq(labels.indexOf("#/horizon"), labels.indexOf("#/insights") + 1, "…right below Insights");
  location.hash = "#/horizon";
  ui.renderSidebar({ roadmaps: R, active: null, expandedSlug: null, statsFor: () => ({ pct: 0, track: "on" }), onNavigate() {} });
  t.ok($(".sb-horizon.active"), "…and shows as active on #/horizon");
  reg.registerRoadmap({ slug: "horizon", title: "x", objectives: [{ id: "o" }], days: [] });
  t.ok(reg.validateAll().some(p => /\[horizon\].*reserved route/.test(p)), "no roadmap may take the horizon slug");
}

t.done();
