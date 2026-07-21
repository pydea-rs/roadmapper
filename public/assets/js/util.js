// util.js — small dependency-free helpers used across the app.

/* ---------- DOM ---------- */
export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** el("div.card#id", {attrs}, ...children) — tiny hyperscript. */
export function el(spec, attrs = null, ...kids) {
  let tag = "div", id = null; const cls = [];
  spec.replace(/([.#]?[^.#]+)/g, (_, tok) => {
    if (tok[0] === ".") cls.push(tok.slice(1));
    else if (tok[0] === "#") id = tok.slice(1);
    else tag = tok;
  });
  const node = document.createElement(tag);
  if (id) node.id = id;
  if (cls.length) node.className = cls.join(" ");
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "html") node.innerHTML = v;
    else if (k === "text") node.textContent = v;
    else if (k === "dataset") Object.assign(node.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) node.setAttribute(k, "");
    else node.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return node;
}

export const frag = (...kids) => { const f = document.createDocumentFragment();
  for (const k of kids.flat()) if (k != null && k !== false) f.append(k.nodeType ? k : document.createTextNode(String(k))); return f; };

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- timing ---------- */
export function debounce(fn, ms) {
  let t; const d = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  d.cancel = () => clearTimeout(t);
  d.flush = (...a) => { clearTimeout(t); fn(...a); };
  return d;
}
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const raf = () => new Promise(r => requestAnimationFrame(r));

/* ---------- ids ---------- */
const ULID_CHARS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32
/** Monotonic-ish ULID: 48-bit time + 80 bits randomness. */
export function ulid(ts = Date.now()) {
  let time = "";
  for (let i = 9; i >= 0; i--) { time = ULID_CHARS[ts % 32] + time; ts = Math.floor(ts / 32); }
  let rand = "";
  const bytes = new Uint8Array(16); (crypto || window.crypto).getRandomValues(bytes);
  for (let i = 0; i < 16; i++) rand += ULID_CHARS[bytes[i] % 32];
  return time + rand;
}

/* ---------- dates ---------- */
// All roadmap dates are plain YYYY-MM-DD (no timezone drama).
export const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];

export const parseDate = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const fmtDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export const todayStr = () => fmtDate(new Date());
export const dowOf = s => DOW[parseDate(s).getDay()];
export const dayNum = s => parseDate(s).getDate();
export const monthKey = s => s.slice(0, 7);
export const monthLabel = s => { const d = parseDate(s); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };

/** ISO-ish week key anchored to Monday, e.g. "2026-W29". Used only when a day
 *  has no explicit week id in content. */
export function isoWeekKey(s) {
  const d = parseDate(s); const day = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - day + 3);
  const firstThu = new Date(d.getFullYear(), 0, 4);
  const week = 1 + Math.round(((d - firstThu) / 86400000 - 3 + ((firstThu.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export const daysBetween = (a, b) => Math.round((parseDate(b) - parseDate(a)) / 86400000);
export function addDays(s, n) { const d = parseDate(s); d.setDate(d.getDate() + n); return fmtDate(d); }

export function relDay(s) {
  const diff = daysBetween(todayStr(), s);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < 0) return `${-diff}d ago`;
  return `in ${diff}d`;
}

export function fmtDateHuman(s) {
  const d = parseDate(s);
  return `${DOW[d.getDay()]} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}`;
}

/* ---------- numbers ---------- */
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
// Never report 100% unless the scope is genuinely complete (num >= den): plain
// rounding would turn 199/200 (99.5%) into "100%", making an incomplete day/ring
// read as done and disagree with the count-based `complete`/`met` flags.
export const pct = (num, den) => den > 0 ? (num >= den ? 100 : Math.min(Math.round((num / den) * 100), 99)) : 0;
export const pct1 = (num, den) => den > 0 ? Math.round((num / den) * 1000) / 10 : 0;

export function fmtMins(m) {
  if (!m) return "0m";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
}

/* ---------- misc ---------- */
export const clone = o => (typeof structuredClone === "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o)));
export function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: filename });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function pickFile(accept = "application/json") {
  return new Promise(resolve => {
    const inp = el("input", { type: "file", accept });
    inp.onchange = () => resolve(inp.files[0] || null);
    inp.click();
  });
}
export const readFileText = file => new Promise((res, rej) => {
  const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsText(file);
});
