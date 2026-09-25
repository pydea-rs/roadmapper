// daymenu.test.mjs — the day-card right-click menu UI: the free-gap picker math
// (freeDatesFor), the link harvester (dayLinks), the context menu it builds
// (enabled vs a disabled "no free day"), and the move→apply→rerender round-trip.
// jsdom-gated like the other DOM suites; SKIPS cleanly when jsdom is absent.
import { suite } from "./_harness.mjs";
import { registry, store, loadFixture, loadRoadmap } from "./_load.mjs";

const t = suite("daymenu");

// Freeze "now" BEFORE the fixture's July-2026 days: the move picker never offers a
// date that has already gone by, so an unfrozen clock would empty every gap.
const RealDate = Date;
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(2026, 6, 10, 12, 0, 0); }
  static now() { return new RealDate(2026, 6, 10, 12, 0, 0).getTime(); }
}
global.Date = FakeDate;

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="toast-root"></div><div id="modal-root"></div>
</body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.location = dom.window.location;
global.requestAnimationFrame = fn => setTimeout(fn, 0);

const base = new URL("../public/assets/js/", import.meta.url);
const daymenu = await import(new URL("daymenu.js", base).href);
const ui = await import(new URL("ui.js", base).href);

const rm = await loadFixture();
const S = "fixture";
const day = id => rm.daysById.get(id);
const click = n => n.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
// A closed menu/modal lingers ~120–200ms on its exit animation, so several can
// coexist in the DOM at once — always scope to the CURRENT (last-appended) one.
const curMenu = () => [...document.querySelectorAll(".ctx-menu")].pop() || null;
const menuItems = () => curMenu() ? [...curMenu().querySelectorAll(".ctx-item")] : [];
const curModal = () => [...document.querySelectorAll("#modal-root .modal")].pop() || null;
const fakeEv = () => ({ preventDefault() {}, clientX: 12, clientY: 12 });

/* ---------------- freeDatesFor ---------------- */
t.group("freeDatesFor — the free calendar gap before the next card");
t.deep(daymenu.freeDatesFor(day("d01")), [], "d01→d02 are consecutive → no room");
t.deep(daymenu.freeDatesFor(day("d02")), ["2026-07-15"], "d02→d03 leaves exactly 07-15");
t.deep(daymenu.freeDatesFor(day("d03")), ["2026-07-17", "2026-07-18", "2026-07-19"], "d03→d04 leaves three days");
t.deep(daymenu.freeDatesFor(day("d05")), [], "the last card has no ceiling → no room");

t.group("freeDatesFor — never offers a date that has already gone by");
// moving a card onto a past date would re-base on-time AFTER the fact (late ticks → on time)
t.deep(daymenu.freeDatesFor(day("d03"), "2026-07-18"), ["2026-07-18", "2026-07-19"], "dates before today are dropped, today stays");
t.deep(daymenu.freeDatesFor(day("d03"), "2026-07-20"), [], "a gap entirely in the past offers nothing");
t.deep(daymenu.freeDatesFor(day("d03"), "2026-07-01"), ["2026-07-17", "2026-07-18", "2026-07-19"], "a future gap is offered in full");

/* ---------------- dayLinks ---------------- */
t.group("dayLinks — harvest & de-duplicate every outbound link on a day");
const syn = {
  title: "Links", tasks: [
    { link: "https://direct.test/x",
      label: 'See <a href="https://a.test/1">A1</a> and <a href="https://a.test/2">A2</a>.',
      model: 'takeaway <a href="https://a.test/7">A7</a>',
      subs: [{ label: 'sub <a href="https://a.test/3">A3</a>',
        note: 'note <a href="https://a.test/8">A8</a>',
        refs: ['ref <a href="https://a.test/4">A4</a>'] }] },
    { label: 'dup <a href="https://a.test/1">again</a>', info: '<a href="https://a.test/5">A5</a>' },
  ],
  soft: [{ label: 'soft <a href="https://a.test/6">A6</a>' }],
};
const links = daymenu.dayLinks(syn);
const hrefs = links.map(l => l.href);
t.deep(hrefs, ["https://direct.test/x", "https://a.test/1", "https://a.test/2", "https://a.test/7",
  "https://a.test/3", "https://a.test/8", "https://a.test/4", "https://a.test/5", "https://a.test/6"],
  "links harvested in document order across link/label/info/model/refs/subs(note)/soft, deduped");
t.eq(links.find(l => l.href === "https://a.test/1").text, "A1", "anchor text is captured");
t.deep(daymenu.dayLinks({ tasks: [{ label: "no links here" }], soft: [] }), [], "a day with no anchors → empty");

/* ---------------- the context menu it builds ---------------- */
t.group("openDayMenu — builds info items always, Move enabled only with room");
store.resetAll();
daymenu.openDayMenu(rm, day("d02"), fakeEv(), () => {});
let items = menuItems();
t.ok(items.some(b => /Completion details/.test(b.textContent)), "a Completion item is present");
t.ok(items.some(b => /Time on tasks/.test(b.textContent)), "a Time item is present");
t.ok(items.some(b => /References/.test(b.textContent)), "a References item is present");
const moveItem = items.find(b => /Move day/.test(b.textContent));
t.ok(moveItem && !moveItem.disabled, "with a gap, Move day is enabled");
t.ok(!items.some(b => /Reset to original/.test(b.textContent)), "no Reset item when the card is unmoved");
ui.closeContextMenu();

daymenu.openDayMenu(rm, day("d01"), fakeEv(), () => {});
const noRoom = menuItems().find(b => /Move day/.test(b.textContent));
t.ok(noRoom && noRoom.disabled, "with no gap (consecutive days), Move day is disabled");
t.ok(/no free day/.test(noRoom.textContent), "…and says why");
ui.closeContextMenu();

t.group("openDayMenu — a moved card offers a Reset item");
store.resetAll();
store.setDayDate(S, "d02", "2026-07-15");
daymenu.openDayMenu(rm, day("d02"), fakeEv(), () => {});
t.ok(menuItems().some(b => /Reset to original/.test(b.textContent)), "Reset appears once the card is moved");
ui.closeContextMenu();
store.resetAll();

/* ---------------- move → apply → rerender round-trip ---------------- */
t.group("a STALE override (out of gap) shows no phantom Reset and self-heals");
store.resetAll();
store.setDayDate(S, "d02", "2026-07-19");                // beyond d02's gap (next card is 07-16)
daymenu.openDayMenu(rm, day("d02"), fakeEv(), () => {});
t.ok(!menuItems().some(b => /Reset to original/.test(b.textContent)),
  "the resolver ignores the stale override → no Reset item");
t.ok(menuItems().some(b => /Move day…/.test(b.textContent)),
  "…and the Move item reads as unmoved, not 'change date…'");
t.eq(store.getDayDate(S, "d02"), null, "opening the menu self-healed (cleared) the dead override cell");
ui.closeContextMenu();
store.resetAll();

t.group("moving through the menu writes the override and repaints");
let repainted = 0;
daymenu.openDayMenu(rm, day("d02"), fakeEv(), () => { repainted++; });
click(menuItems().find(b => /Move day/.test(b.textContent)));   // opens the move modal
const opt = [...curModal().querySelectorAll(".dm-dateopt")].find(b => /Jul 15/.test(b.textContent));
t.ok(opt, "the move modal lists the free date 07-15 as an option");
click(opt);
t.eq(store.getDayDate(S, "d02"), "2026-07-15", "picking a date writes the daydate override");
t.ok(repainted > 0, "…and triggers a rerender so the card re-lands on its new date");

t.group("the Reset option clears the override");
store.setDayDate(S, "d02", "2026-07-15");
repainted = 0;
daymenu.openDayMenu(rm, day("d02"), fakeEv(), () => { repainted++; });
click(menuItems().find(b => /Reset to original/.test(b.textContent)));
t.eq(store.getDayDate(S, "d02"), null, "Reset clears the override cell");
t.ok(repainted > 0, "…and repaints");
store.resetAll();

/* ---------------- the three read-only info modals ---------------- */
t.group("info modals — Completion / Time / References open with consistent numbers");
store.resetAll();
store.setTask(S, "d02.t1", true);                         // one of d02's two required tasks
store.setMove(S, "d01.t1", "d02");                         // a task moved IN from d01
const openItem = re => { daymenu.openDayMenu(rm, day("d02"), fakeEv(), () => {}); click(menuItems().find(b => re.test(b.textContent))); return curModal(); };
const comp = openItem(/Completion details/);
t.ok(comp && /Completion/.test(comp.textContent), "the Completion modal opens");
const compRows = [...comp.querySelectorAll(".dm-row")].map(r => r.textContent);
t.ok(compRows.some(r => /^Actual/.test(r)) && compRows.some(r => /^On-time/.test(r)), "it lists the Actual / Original / On-time rings");
t.ok(compRows.some(r => /^Own tasks done1\/2$/.test(r)), `own planned tasks are labelled as such (${compRows.find(r => /tasks done/.test(r))})`);
t.ok(/planned on this card/.test(comp.textContent), "…under a heading that says which set it counts (no contradiction with Actual)");
const time = openItem(/Time on tasks/);
t.ok(time && /Required/.test(time.textContent) && /Invested so far/.test(time.textContent), "the Time modal shows required time and invested so far");
const refs = openItem(/References/);
t.ok(refs && /No links or references on this day|dm-link/.test(refs.innerHTML), "the References modal opens (links or an empty note)");
ui.closeAllModals();
store.resetAll();

/* ---------------- the reading list (roadmap source library) ---------------- */
t.group("Reading list — offered only by a roadmap that catalogues its sources");
store.resetAll();
// the fixture declares no `library:`, so the item must not appear at all
daymenu.openDayMenu(rm, day("d02"), fakeEv(), () => {});
t.ok(!menuItems().some(b => /Reading list/.test(b.textContent)),
  "a roadmap with no source library gets no Reading list item");
ui.closeContextMenu();

await loadRoadmap("bedrock.js");
const bd = registry.getRoadmap("bedrock");
t.ok(bd.library.length >= 20, `bedrock catalogues its sources (${bd.library.length} entries)`);
t.ok(bd.library.every(x => x.id && x.title && x.match.length),
  "every entry has an id, a title and at least one match string");
t.eq(new Set(bd.library.map(x => x.id)).size, bd.library.length, "library ids are unique");
t.ok(bd.library.some(x => x.free) && bd.library.some(x => !x.free),
  "the catalogue distinguishes free sources from paid ones");

t.group("daySources — groups a card's work by the source it reads from");
// The point of the feature: nothing you are asked to READ is left uncatalogued — and
// that includes the card you are meant to FINISH a reading on. A later "(k/n)" part
// often holds only the takeaway and names no source in its own text; it borrows the
// sources of the task's other parts, so no card comes up empty.
const hasLink = d => d.tasks.some(x => [x.label, x.lead, ...(x.refs || [])]
  .concat((x.subs || []).flatMap(sb => [sb.label, sb.note]))
  .some(v => typeof v === "string" && v.includes("href=")));
const uncatalogued = bd.days.filter(d => !daymenu.daySources(bd, d).length);
t.deep(uncatalogued.filter(hasLink).map(d => d.id), [],
  "every bedrock card that links to something names the source it comes from");
t.deep(uncatalogued.map(d => d.id), [],
  `every bedrock card names at least one source (${bd.days.length} cards)`);

// a split part that names no source of its own inherits the family's — and only the
// family's: an UNSPLIT task must never donate its sources to a same-named neighbour
const splitPart = bd.days.flatMap(d => d.tasks.map(x => ({ d, x })))
  .find(({ x }) => /\(\s*[2-9]\s*\/\s*\d+\s*\)\s*$/.test(String(x.lead || x.label || ""))
    && !(x.subs || [x]).some(l => /href=/.test(String(l.label || l.lead || ""))));
if (splitPart) {
  const base = String(splitPart.x.lead || splitPart.x.label).replace(/\s*\(\s*\d+\s*\/\s*\d+\s*\)\s*$/, "").trim();
  const sibling = bd.days.flatMap(d => d.tasks)
    .find(x => x !== splitPart.x && String(x.lead || x.label || "").startsWith(base));
  const mine = daymenu.daySources(bd, splitPart.d).map(g => g.src.id);
  t.ok(mine.length > 0, `a later split part still names its source (${splitPart.x.id})`);
  t.ok(!!sibling, "…because an earlier part of the same task named it");
}
const sample = bd.days.find(d => daymenu.daySources(bd, d).length >= 2) || bd.days[0];
const groups = daymenu.daySources(bd, sample);
t.ok(groups.every(g => g.src && Array.isArray(g.items)), "each group carries its source and its items");
t.ok(groups.some(g => g.items.length), "at least one group lists the items read from it");
t.ok(groups.every(g => g.items.every(i => i.id && typeof i.est === "number")),
  "every listed item keeps its leaf id and its minutes");
// a source is only listed when something on the card actually reads from it
t.deep(bd.days.flatMap(d => daymenu.daySources(bd, d).filter(g => !g.items.length).map(g => `${d.id}:${g.src.id}`)),
  [], "no card lists a source with nothing to read from it");
// a leaf that names no source of its own continues the one before it in the same task
const contTask = bd.days.flatMap(d => d.tasks).find(x => (x.subs || []).length >= 2
  && !/href=|DDIA|CS:APP|OSTEP/.test(x.subs[1].label || ""));
if (contTask) {
  const owner = bd.days.find(d => d.tasks.includes(contTask));
  const ids = daymenu.daySources(bd, owner).flatMap(g => g.items.map(i => i.id));
  t.ok(ids.includes(contTask.subs[1].id),
    "a continuation leaf inherits the source of the leaf it follows");
}
// ticking a leaf shows through to the reading list
const tickable = groups.flatMap(g => g.items)[0];
t.ok(tickable, "the sample card lists at least one readable item");
if (tickable) {
  store.setTask("bedrock", tickable.id, true);
  const after = daymenu.daySources(bd, sample).flatMap(g => g.items).filter(i => i.id === tickable.id);
  t.ok(after.length && after.every(i => i.done), "a ticked leaf reads as done in the reading list");
  store.setTask("bedrock", tickable.id, false);
}

t.group("the Reading list modal renders one card per source");
daymenu.openDayMenu(bd, sample, fakeEv(), () => {});
const readItem = menuItems().find(b => /Reading list/.test(b.textContent));
t.ok(readItem, "bedrock's menu offers the Reading list item");
click(readItem);
const rl = curModal();
t.ok(rl && /Reading list/.test(rl.textContent), "it opens a Reading list modal");
t.eq(rl.querySelectorAll(".dm-src").length, groups.length, "one source card per group");
t.ok(rl.querySelector(".dm-src-title").textContent.length > 2, "each card names its source");
t.ok(rl.querySelectorAll(".dm-src-tag").length === groups.length, "each card says whether the source is free");
t.ok(rl.querySelectorAll(".dm-src-item").length >= 1, "the items read from it are listed");
ui.closeAllModals();
store.resetAll();

/* ---------------- ui.openContextMenu disabled support ---------------- */
t.group("openContextMenu — a disabled item is inert");
let fired = false;
ui.openContextMenu(5, 5, [{ label: "Nope", disabled: true, hint: "why not", onClick: () => { fired = true; } }]);
const inert = curMenu().querySelector(".ctx-item");
t.ok(inert.disabled && inert.classList.contains("disabled"), "the item renders disabled");
t.eq(inert.title, "why not", "its hint becomes the tooltip");
click(inert);
t.ok(!fired, "clicking a disabled item does nothing");
ui.closeContextMenu();

t.done();
