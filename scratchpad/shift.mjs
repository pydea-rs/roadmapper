// shift.mjs — uniform whole-roadmap +N day shift of ALL roadmaps.
// Shifts every `date:` (day) and `start:` (week) string by N days, and for
// bedrock recomputes each inline `dow:` weekday label from its NEW date.
// Pure date arithmetic on YYYY-MM-DD (UTC parse) — relative structure invariant.
import { readFileSync, writeFileSync } from "node:fs";

const N = 4;
const DIR = new URL("../public/roadmaps/", import.meta.url);
const FILES = ["rust-fastapi.js", "interp-go.js", "bedrock.js", "raylib.js"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const addDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + n * 86400000;
  const dt = new Date(t);
  const p = x => String(x).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${p(dt.getUTCMonth() + 1)}-${p(dt.getUTCDate())}`;
};
const dowOf = iso => {
  const [y, m, d] = iso.split("-").map(Number);
  return DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
};

let grand = { date: 0, start: 0, dow: 0 };
for (const f of FILES) {
  const path = new URL(f, DIR);
  let src = readFileSync(path, "utf8");
  let c = { date: 0, start: 0, dow: 0 };

  // day dates and week starts
  src = src.replace(/(date:\s*")(\d{4}-\d{2}-\d{2})(")/g, (_, a, iso, z) => { c.date++; return a + addDays(iso, N) + z; });
  src = src.replace(/(start:\s*")(\d{4}-\d{2}-\d{2})(")/g, (_, a, iso, z) => { c.start++; return a + addDays(iso, N) + z; });

  // bedrock inline dow labels: recompute from the (already-shifted) date on the SAME line
  src = src.replace(/date:\s*"(\d{4}-\d{2}-\d{2})"(.*?)dow:\s*"(\w+)"/g, (m, iso, mid, old) => {
    const nw = dowOf(iso);            // iso is already the shifted date (replace ran above)
    if (nw !== old) c.dow++;
    return m.replace(`dow: "${old}"`, `dow: "${nw}"`);
  });

  writeFileSync(path, src);
  console.log(`${f.padEnd(16)} date:${c.date} start:${c.start} dow:${c.dow}`);
  grand.date += c.date; grand.start += c.start; grand.dow += c.dow;
}
console.log(`TOTAL date:${grand.date} start:${grand.start} dow:${grand.dow}  (shift +${N})`);
