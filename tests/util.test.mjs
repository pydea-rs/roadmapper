// util.test.mjs — the date & number primitives every other calculation builds on.
import { suite } from "./_harness.mjs";
import { util } from "./_load.mjs";

const t = suite("util");
const { addDays, daysBetween, fmtDate, parseDate, todayStr, fmtMins, pct, pct1, clamp, monthKey } = util;

t.group("date arithmetic");
t.eq(addDays("2026-07-18", 1), "2026-07-19", "addDays +1");
t.eq(addDays("2026-07-18", -1), "2026-07-17", "addDays -1");
t.eq(addDays("2026-07-31", 1), "2026-08-01", "addDays across month end");
t.eq(addDays("2026-12-31", 1), "2027-01-01", "addDays across year end");
t.eq(addDays("2026-03-01", -1), "2026-02-28", "addDays into Feb (non-leap)");
t.eq(addDays("2024-03-01", -1), "2024-02-29", "addDays into Feb (leap year)");
t.eq(addDays("2026-07-18", 0), "2026-07-18", "addDays 0 is identity");

t.group("daysBetween");
t.eq(daysBetween("2026-07-18", "2026-07-25"), 7, "one week forward");
t.eq(daysBetween("2026-07-25", "2026-07-18"), -7, "negative when reversed");
t.eq(daysBetween("2026-07-18", "2026-07-18"), 0, "same day = 0");
t.eq(daysBetween("2026-07-31", "2026-08-01"), 1, "across month boundary");

t.group("fmtDate / parseDate round-trip");
t.eq(fmtDate(parseDate("2026-07-18")), "2026-07-18", "round-trips a date");
t.eq(fmtDate(parseDate("2026-01-05")), "2026-01-05", "zero-pads month & day");
t.eq(parseDate("2026-07-18").getFullYear(), 2026, "parses year");
t.eq(parseDate("2026-07-18").getMonth(), 6, "parses month (0-based July=6)");
t.eq(parseDate("2026-07-18").getDate(), 18, "parses day");
t.ok(/^\d{4}-\d{2}-\d{2}$/.test(todayStr()), "todayStr is YYYY-MM-DD");
t.eq(monthKey("2026-07-18"), "2026-07", "monthKey slices YYYY-MM");

t.group("fmtMins");
t.eq(fmtMins(0), "0m", "zero");
t.eq(fmtMins(45), "45m", "under an hour");
t.eq(fmtMins(59), "59m", "just under an hour");
t.eq(fmtMins(60), "1h", "exactly one hour");
t.eq(fmtMins(90), "1h 30m", "hour and minutes");
t.eq(fmtMins(125), "2h 5m", "two hours five");
t.eq(fmtMins(120), "2h", "whole hours drop the minutes");

t.group("pct / pct1 (rounding + zero-denominator safety)");
t.eq(pct(0, 0), 0, "0/0 → 0 (no NaN)");
t.eq(pct(1, 0), 0, "n/0 → 0 (no Infinity)");
t.eq(pct(1, 2), 50, "1/2 = 50");
t.eq(pct(1, 3), 33, "1/3 rounds to 33");
t.eq(pct(2, 3), 67, "2/3 rounds to 67");
t.eq(pct(1, 9), 11, "1/9 rounds to 11");
t.eq(pct(9, 9), 100, "full");
t.eq(pct1(1, 3), 33.3, "pct1 keeps one decimal");
t.eq(pct1(2, 3), 66.7, "pct1 rounds one decimal");

t.group("clamp");
t.eq(clamp(5, 0, 10), 5, "inside range");
t.eq(clamp(-1, 0, 10), 0, "below floor");
t.eq(clamp(11, 0, 10), 10, "above ceiling");
t.eq(clamp(0.5, 0, 1), 0.5, "fractional inside");

t.done();
