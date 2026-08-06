// daymove.test.mjs — the "move a day CARD" feature at the engine level: the
// dayDate() resolver (validity gate against the free gap), the static day.nextDate
// ceiling, and the on-time RE-BASING scenarios the feature is built around. These
// lock the exact semantics agreed with the owner:
//   • a card move re-dates on-time for the card's OWN native tasks, and
//   • a task VISITING via a task-move keeps ITS origin card's date, unaffected.
// Fixture day layout (dates / next-card gap):
//   d01 07-13  →d02 (no gap, consecutive)      d02 07-14 →d03  free: 07-15
//   d03 07-16  →d04  free: 17,18,19            d04 07-20 →d05  free: 07-21
//   d05 07-22  (last, no ceiling → not movable)
import { suite } from "./_harness.mjs";
import { store, stats, reconcile, loadFixture, doneOn } from "./_load.mjs";

const t = suite("daymove");
const rm = await loadFixture();
const S = "fixture";
const reset = () => store.resetAll();
const compute = () => stats.computeAll(rm);
const day = id => rm.daysById.get(id);

/* ---------------- static ceiling ---------------- */
t.group("day.nextDate — the chronological ceiling for a move");
t.eq(day("d02").nextDate, "2026-07-16", "d02's next card is d03 (07-16)");
t.eq(day("d03").nextDate, "2026-07-20", "d03's next card is d04 (07-20)");
t.eq(day("d05").nextDate, null, "the last card has no nextDate");

/* ---------------- resolver validity gate ---------------- */
t.group("dayDate() — honours a valid override, ignores anything outside the gap");
reset();
t.eq(stats.dayDate(rm, S, day("d02")), "2026-07-14", "no override → the authored date");
store.setDayDate(S, "d02", "2026-07-15");
t.eq(stats.dayDate(rm, S, day("d02")), "2026-07-15", "a date inside the gap is honoured");
store.setDayDate(S, "d02", "2026-07-16");
t.eq(stats.dayDate(rm, S, day("d02")), "2026-07-14", "== next card's date → rejected (must be strictly before)");
store.setDayDate(S, "d02", "2026-07-20");
t.eq(stats.dayDate(rm, S, day("d02")), "2026-07-14", "beyond the gap → rejected");
store.setDayDate(S, "d02", "2026-07-14");
t.eq(stats.dayDate(rm, S, day("d02")), "2026-07-14", "== base date → rejected (must be strictly after)");
store.setDayDate(S, "d02", "2026-07-13");
t.eq(stats.dayDate(rm, S, day("d02")), "2026-07-14", "before the base date → rejected");
reset();
store.setDayDate(S, "d05", "2026-07-25");
t.eq(stats.dayDate(rm, S, day("d05")), "2026-07-22", "last card (no ceiling) → override ignored, not movable");

/* ---------------- Scenario A: native re-date makes a late tick on-time ---------------- */
t.group("Scenario A — moving a card re-bases on-time for its OWN tasks");
reset();
doneOn(S, "d02.t1", 2026, 7, 15);                       // done on the 15th
let s = compute();
t.eq(s.days["d02"].ontime.done, 0, "done 07-15 is LATE against d02's authored 07-14");
store.setDayDate(S, "d02", "2026-07-15");                // postpone the card into its gap
s = compute();
t.eq(s.days["d02"].ontime.done, 1, "after moving d02→07-15, the 07-15 tick is ON-TIME");
t.eq(s.overall.ontime.done, 1, "…and it shows up in the overall on-time tally");
t.eq(s.days["d02"].actual.done, 1, "completion count is unchanged by the move (still 1 done)");
t.eq(s.days["d02"].original.total, 2, "the day still owns its 2 primary tasks (structure untouched)");

/* ---------------- Scenario 1/S1: a VISITING task keeps its own origin date ---------------- */
t.group("Scenario S1 — a task moved IN from another card is NOT re-based by this card's move");
reset();
store.setMove(S, "d01.t1", "d02");                       // d01's task now lives on d02
store.setDayDate(S, "d02", "2026-07-15");                // move the d02 card
doneOn(S, "d01.t1", 2026, 7, 15);                        // visiting task, done 07-15
doneOn(S, "d02.t1", 2026, 7, 15);                        // native task, done 07-15
s = compute();
t.eq(s.days["d02"].ontime.done, 1, "only the NATIVE task earns on-time under d02's move");
t.eq(s.days["d01"].ontime.done, 0, "the visiting task is judged by its ORIGIN card d01 (07-13) → late");
t.eq(s.overall.ontime.done, 1, "exactly one on-time overall (native yes, visitor no)");
t.eq(stats.currentDay(rm, S, rm.tasksById.get("d01.t1")), "d02", "the visitor still LIVES on d02 (task-move intact)");

/* ---------------- Scenario 5: task-move and day-move compose ---------------- */
t.group("Scenario 5 — a card move + a task-move of the same native task compose cleanly");
reset();
store.setDayDate(S, "d03", "2026-07-18");                // move card d03 into its gap
store.setMove(S, "d03.t1", "d05");                       // and task-move its native t1 out to d05
doneOn(S, "d03.t1", 2026, 7, 18);                        // finished on the card's new date
s = compute();
t.eq(s.days["d03"].ontime.done, 1, "native t1 judged by d03's NEW date (07-18) → on-time");
t.eq(stats.currentDay(rm, S, rm.tasksById.get("d03.t1")), "d05", "…while it currently lives on d05 via the task-move");
t.eq(s.days["d05"].actual.done, 1, "d05 ACTUAL gained the task; on-time credit stayed on origin d03");
t.eq(s.days["d05"].ontime.done, 0, "the task-move destination earns no on-time credit");

/* ---------------- Scenario 6: reset restores the authored reference ---------------- */
t.group("Scenario 6 — resetting a moved card restores its authored on-time date");
reset();
store.setDayDate(S, "d02", "2026-07-15");
doneOn(S, "d02.t1", 2026, 7, 15);
s = compute();
t.eq(s.days["d02"].ontime.done, 1, "on-time while moved to 07-15");
store.setDayDate(S, "d02", null);                        // reset to original
s = compute();
t.eq(s.days["d02"].ontime.done, 0, "reset → base 07-14 → the 07-15 tick is late again");
t.eq(store.getDayDate(S, "d02"), null, "the override cell is cleared");

/* ---------------- earlier-than-real-tick safety (monotonic direction) ---------------- */
t.group("a tick already on-time cannot be broken by a FORWARD move");
reset();
doneOn(S, "d02.t1", 2026, 7, 14);                        // on time at the base date
store.setDayDate(S, "d02", "2026-07-15");                // push the card later
s = compute();
t.eq(s.days["d02"].ontime.done, 1, "07-14 ≤ 07-15 → still on-time after moving the card later");

/* ---------------- reconcile: orphan override pruned, real one kept ---------------- */
t.group("reconcile — a daydate override for a missing day is pruned");
reset();
store.setDayDate(S, "d02", "2026-07-15");                // valid referent (day exists)
store.setDayDate(S, "zz9", "2026-07-15");                // orphan (no such day)
const res = reconcile.reconcile(rm);
t.ok(res.pruned >= 1, "at least the orphan override is pruned");
t.eq(store.getDayDate(S, "d02"), "2026-07-15", "the real day's override survives");
t.eq(store.getDayDate(S, "zz9"), null, "the orphan override is removed");

t.done();
