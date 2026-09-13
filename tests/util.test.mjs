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
// 100% must mean genuinely complete — near-full ratios never round UP to 100.
t.eq(pct(199, 200), 99, "199/200 (99.5%) caps at 99, not rounded to 100");
t.eq(pct(999, 1000), 99, "999/1000 caps at 99");
t.eq(pct(200, 200), 100, "exactly full is 100");
t.eq(pct(5, 5), 100, "small exactly-full is 100");
t.eq(pct1(1, 3), 33.3, "pct1 keeps one decimal");
t.eq(pct1(2, 3), 66.7, "pct1 rounds one decimal");

t.group("clamp");
t.eq(clamp(5, 0, 10), 5, "inside range");
t.eq(clamp(-1, 0, 10), 0, "below floor");
t.eq(clamp(11, 0, 10), 10, "above ceiling");
t.eq(clamp(0.5, 0, 1), 0.5, "fractional inside");

t.group("isoWeekKey — ISO-8601 weeks across year boundaries");
t.eq(util.isoWeekKey("2026-12-31"), "2026-W53", "2026-12-31 is in 2026-W53");
t.eq(util.isoWeekKey("2027-01-04"), "2027-W01", "2027-01-04 starts 2027-W01");
t.eq(util.isoWeekKey("2021-01-03"), "2020-W53", "2021-01-03 still belongs to 2020-W53");
t.eq(util.isoWeekKey("2026-09-07"), "2026-W37", "a mid-year Monday");

t.group("completion stamps keep the calendar day they were ticked on");
const stamp = util.localStamp(new Date(2026, 8, 13, 23, 30, 5, 7));
t.ok(/^2026-09-13T23:30:05\.007[+-]\d{2}:\d{2}$/.test(stamp), `localStamp writes local wall time + offset (${stamp})`);
t.ok(!isNaN(new Date(stamp).getTime()), "…and is a valid ISO timestamp for any Date parser");
t.eq(new Date(stamp).getTime(), new Date(2026, 8, 13, 23, 30, 5, 7).getTime(), "…naming the exact same instant");
t.eq(util.stampDate(stamp), "2026-09-13", "stampDate reads back the ticking device's day");
t.eq(util.stampDate("2026-09-13T23:30:00-04:00"), "2026-09-13", "an offset stamp keeps its own date whatever this device's timezone");
t.eq(util.stampDate("2026-09-14T03:30:00+14:00"), "2026-09-14", "…including far-east offsets");
t.eq(util.stampDate(new Date(2026, 6, 13, 12).toISOString()), "2026-07-13", "an older UTC 'Z' stamp falls back to this device's local date");
t.eq(util.stampDate(null), null, "null → null");
t.eq(util.stampDate("garbage"), null, "garbage → null");

t.group("…verified in other timezones (a separate process per TZ)");
{
  const { execFileSync } = await import("node:child_process");
  const utilUrl = new URL("../public/assets/js/util.js", import.meta.url).href;
  const script = `const u = await import(${JSON.stringify(utilUrl)});
    const s = u.localStamp(new Date(2026, 8, 13, 23, 30));
    const noon = u.localStamp(new Date(2026, 2, 8, 0, 30));
    console.log(JSON.stringify({ s, sd: u.stampDate(s), noon, nd: u.stampDate(noon),
      add: u.addDays("2026-03-07", 2), wk: u.isoWeekKey("2026-10-25"), between: u.daysBetween("2026-03-01", "2026-04-01") }));`;
  const written = {};
  for (const tz of ["America/Santiago", "Asia/Tehran", "Pacific/Kiritimati", "America/New_York", "UTC"]) {
    let r = null;
    try { r = JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { env: { ...process.env, TZ: tz }, encoding: "utf8" })); } catch {}
    t.ok(r && r.sd === "2026-09-13" && r.nd === "2026-03-08", `${tz}: a late-evening / just-after-midnight stamp reads back its own local day`);
    t.ok(r && r.add === "2026-03-09" && r.between === 31 && r.wk === "2026-W43", `${tz}: date arithmetic is DST-safe`);
    if (r) written[tz] = r.s;
  }
  // a stamp written in one zone, read in this process (whatever its TZ): same calendar day
  t.ok(Object.values(written).every(s => util.stampDate(s) === "2026-09-13"), "a stamp from ANY zone reads back as the day it was ticked on, here");
}

t.done();
