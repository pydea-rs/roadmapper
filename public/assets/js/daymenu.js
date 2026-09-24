// daymenu.js — the right-click menu on a day CARD. Two kinds of items:
//   • read-only info modals (completion breakdown, time on tasks, references) that
//     just present numbers already derived by stats.js / the content, and
//   • the "move day" action: re-date a card into the free calendar gap before the
//     next planned day. A move re-bases the card's ON-TIME reference for its OWN
//     tasks (see stats.dayDate) — it never touches completion counts or week/month
//     rollups, which are keyed by id, not by date; a milestone gated on the card
//     simply waits for the card's new date before it can read "missed".
//
// Everything here reads live state on open (a fresh computeAll), so it always
// reflects the current journey; nothing is cached across renders.

import * as store from "./store.js";
import { computeAll, dayDate, leavesOf } from "./stats.js";
import { openContextMenu, openModal, toast } from "./ui.js";
import { el, fmtMins, fmtDateHuman, relDay, addDays, dowOf, todayStr } from "./util.js";

/* ---------------------------------------------------------------- *
 *  Gap math
 * ---------------------------------------------------------------- */
/** The free calendar dates a card may be postponed into: strictly between its own
 *  authored date and the next card's date (exclusive), and never in the past — moving
 *  a card to a day that has already gone by would re-base the on-time reference AFTER
 *  the fact and turn late ticks into "on time". Empty for the last card, when the next
 *  card is the very next calendar day, or when the whole gap is already behind us. */
export function freeDatesFor(day, today = todayStr()) {
  const out = [];
  if (!day || !day.date || !day.nextDate) return out;   // last card → no ceiling → no move
  let d = addDays(day.date, 1);
  while (d < day.nextDate) { if (d >= today) out.push(d); d = addDays(d, 1); }
  return out;
}

/* ---------------------------------------------------------------- *
 *  Small presentational helpers (self-contained, class-hooked)
 * ---------------------------------------------------------------- */
function row(label, value, kind) {
  const r = el("div.dm-row" + (kind ? "." + kind : ""));
  r.append(el("span.dm-k", { text: label }));
  r.append(el("span.dm-v", { text: value }));
  return r;
}
function section(title) { return el("div.dm-sec", { text: title }); }

function figLine(name, fig) {
  const f = fig || { done: 0, total: 0, pct: 0 };
  return row(name, `${f.done}/${f.total} · ${f.pct || 0}%`);
}

/* ---------------------------------------------------------------- *
 *  Per-day aggregates (minutes, categories, links) from content + state
 * ---------------------------------------------------------------- */
function dayFacts(rm, day) {
  const slug = rm.slug;
  let reqEst = 0, reqDoneEst = 0, reqN = 0, reqDoneN = 0;
  let bonEst = 0, bonDoneEst = 0, bonN = 0, bonDoneN = 0;
  let secEst = 0, secDoneEst = 0, secN = 0;
  const cats = {};
  for (const t of day.tasks) {
    const tier = (rm.objById.get(t.obj) || {}).tier || "primary";
    for (const leaf of leavesOf(t)) {
      const est = leaf.est || 0;
      const done = store.isDone(slug, leaf.id);
      if (t.optional) {
        bonN++; bonEst += est; if (done) { bonDoneN++; bonDoneEst += est; }
      } else if (tier === "secondary") {
        secN++; secEst += est; if (done) secDoneEst += est;
      } else {
        reqN++; reqEst += est; if (done) { reqDoneN++; reqDoneEst += est; }
        cats[leaf.cat || "read"] = (cats[leaf.cat || "read"] || 0) + 1;
      }
    }
  }
  return { reqEst, reqDoneEst, reqN, reqDoneN, bonEst, bonDoneEst, bonN, bonDoneN,
    secEst, secDoneEst, secN, cats };
}

/** Harvest every outbound link on the day: task.link, <a href> inside any HTML
 *  label/lead/refs/info, on the task and its sub-leaves and soft items. Returns
 *  a de-duplicated [{href, text}] list in document order. */
export function dayLinks(day) {
  const seen = new Set(), out = [];
  const push = (href, text) => {
    if (!href || seen.has(href)) return;
    seen.add(href); out.push({ href, text: (text || href).trim() || href });
  };
  const scanHtml = html => {
    if (!html || typeof html !== "string" || html.indexOf("<a") < 0) return;
    const box = el("div"); box.innerHTML = html;
    for (const a of box.querySelectorAll("a[href]")) push(a.getAttribute("href"), a.textContent);
  };
  const scanItem = it => {
    if (!it) return;
    if (it.link) push(it.link, it.label || it.lead || it.link);
    // every HTML-rendered field that can carry an <a>: label/lead/info, the refs
    // list, plus a sub-task note and a model takeaway (both rendered as HTML).
    scanHtml(it.label); scanHtml(it.lead); scanHtml(it.info);
    scanHtml(it.note); scanHtml(it.model);
    if (Array.isArray(it.refs)) it.refs.forEach(scanHtml);
  };
  for (const t of day.tasks) { scanItem(t); (t.subs || []).forEach(scanItem); }
  for (const s of (day.soft || [])) scanHtml(s.label);
  return out;
}

/** Group this day's work by the SOURCE it reads from, using the roadmap's `library`
 *  (DESIGN §7.6). A leaf belongs to a source when one of that source's `match` strings
 *  occurs in its own text, so the grouping follows the tasks onto whatever card the
 *  planner put them on. Returns [{ src, items: [{ id, label, est, done }] }] with the
 *  sources in the order they first appear on the card. */
export function daySources(rm, day) {
  const lib = rm.library || [];
  if (!lib.length) return [];
  const byId = new Map();
  const order = [];
  const textOf = it => [it.label, it.lead, it.note, it.info, ...(it.refs || [])]
    .filter(x => typeof x === "string").join(" ");
  const add = (src, it) => {
    if (!byId.has(src.id)) { byId.set(src.id, { src, items: [] }); order.push(src.id); }
    byId.get(src.id).items.push({ id: it.id, label: it.label || it.lead || "",
      est: it.est || 0, done: store.isDone(rm.slug, it.id) });
  };
  // A leaf that names no source of its own is the continuation of the one before it
  // inside the same task ("Finish DDIA Ch 7", "Then entries #6–#10") — the planner
  // splits long readings that way, so it inherits that item's sources.
  const visit = (it, carry) => {
    if (!it) return carry;
    const text = textOf(it);
    const hits = text ? lib.filter(src => src.match.some(m => text.includes(m))) : [];
    const use = hits.length ? hits : carry;
    for (const src of use) add(src, it);
    return hits.length ? hits : carry;
  };
  for (const t of day.tasks) {
    const leaves = t.subs && t.subs.length ? t.subs : [t];
    let carry = [];
    // the parent's own lead/refs can name the source its first sub continues from
    if (t.subs && t.subs.length) {
      const ptext = [t.lead, ...(t.refs || [])].filter(x => typeof x === "string").join(" ");
      carry = lib.filter(src => src.match.some(m => ptext.includes(m)));
    }
    for (const leaf of leaves) carry = visit(leaf, carry);
  }
  return order.map(id => byId.get(id));
}

/* ---------------------------------------------------------------- *
 *  Modal builders
 * ---------------------------------------------------------------- */
function movedSubtitle(rm, day) {
  const eff = dayDate(rm, rm.slug, day);
  if (eff === day.date) return fmtDateHuman(day.date);
  return `${fmtDateHuman(eff)}  ·  moved from ${fmtDateHuman(day.date)}`;
}

function completionModal(rm, day) {
  const S = computeAll(rm);
  const df = S.days[day.id] || {};
  const f = dayFacts(rm, day);
  const body = el("div.day-modal");

  body.append(section("Progress"));
  body.append(figLine("Actual", df.actual));
  body.append(figLine("Original", df.original));
  body.append(figLine("On-time", df.ontime, "ontime"));

  // (Progress above follows tasks CURRENTLY on this card, moved-in ones included; the
  // rows below describe the card's own planned tasks — labelled so the two never read
  // as contradicting each other.)
  body.append(section("Required time · planned on this card"));
  body.append(row("Own tasks done", `${f.reqDoneN}/${f.reqN}`));
  body.append(row("Invested", fmtMins(f.reqDoneEst)));
  body.append(row("Remaining", fmtMins(Math.max(0, f.reqEst - f.reqDoneEst))));

  if (f.bonN) {
    body.append(section("Bonus"));
    body.append(row("Done", `${f.bonDoneN}/${f.bonN} · ${fmtMins(f.bonDoneEst)}/${fmtMins(f.bonEst)}`));
  }
  if (f.secN) {
    body.append(section("Secondary"));
    body.append(row("Time", `${fmtMins(f.secDoneEst)}/${fmtMins(f.secEst)}`));
  }

  const cats = Object.entries(f.cats).sort((a, b) => b[1] - a[1]);
  if (cats.length) {
    body.append(section("By category"));
    const chips = el("div.dm-chips");
    for (const [c, n] of cats) chips.append(el("span.dm-chip", { text: `${c} · ${n}` }));
    body.append(chips);
  }

  openModal({ title: `Completion — ${day.title || relDay(day.date)}`, subtitle: movedSubtitle(rm, day),
    icon: "📊", body, actions: [{ label: "Close", variant: "primary", onClick: () => true }] });
}

function timeModal(rm, day) {
  const f = dayFacts(rm, day);
  const totalEst = f.reqEst + f.bonEst + f.secEst;
  const avg = f.reqN ? Math.round(f.reqEst / f.reqN) : 0;
  const body = el("div.day-modal");

  body.append(section("Estimated time"));
  body.append(row("Required", fmtMins(f.reqEst)));
  if (f.secEst) body.append(row("Secondary", fmtMins(f.secEst)));
  if (f.bonEst) body.append(row("Bonus (optional)", fmtMins(f.bonEst)));
  body.append(row("Total", fmtMins(totalEst)));

  body.append(section("Pace"));
  body.append(row("Required tasks", String(f.reqN)));
  body.append(row("Avg per task", fmtMins(avg)));
  body.append(row("Invested so far", fmtMins(f.reqDoneEst + f.bonDoneEst + f.secDoneEst)));

  openModal({ title: `Time on tasks — ${day.title || relDay(day.date)}`, subtitle: movedSubtitle(rm, day),
    icon: "⏱️", body, actions: [{ label: "Close", variant: "primary", onClick: () => true }] });
}

function refsModal(rm, day) {
  const links = dayLinks(day);
  const body = el("div.day-modal");
  if (!links.length) {
    body.append(el("div.dm-empty", { text: "No links or references on this day." }));
  } else {
    const list = el("div.dm-links");
    for (const { href, text } of links) {
      const a = el("a.dm-link", { href, target: "_blank", rel: "noopener noreferrer" });
      a.append(el("span.dm-link-ico", { text: "🔗" }));
      a.append(el("span.dm-link-text", { text }));
      list.append(a);
    }
    body.append(list);
  }
  openModal({ title: `References — ${day.title || relDay(day.date)}`, subtitle: `${links.length} link${links.length === 1 ? "" : "s"}`,
    icon: "🔗", body, actions: [{ label: "Close", variant: "primary", onClick: () => true }] });
}

function sourcesModal(rm, day) {
  const groups = daySources(rm, day);
  const body = el("div.day-modal");
  if (!groups.length) {
    body.append(el("div.dm-empty", { text: "No catalogued sources on this day." }));
  } else {
    const KIND = { book: "📕", paper: "📄", docs: "📘", spec: "📐", article: "📰", video: "🎬", course: "🎓", site: "🌐" };
    for (const { src, items } of groups) {
      const card = el("div.dm-src");
      const head = el("div.dm-src-head");
      head.append(el("span.dm-src-ico", { text: KIND[src.kind] || "📘" }));
      head.append(el("span.dm-src-title", { text: src.title }));
      head.append(el("span.dm-src-tag" + (src.free ? ".is-free" : ""), { text: src.free ? "free" : "paid" }));
      card.append(head);
      const meta = [src.by, src.edition].filter(Boolean).join(" · ");
      if (meta) card.append(el("div.dm-src-by", { text: meta }));
      if (src.get) card.append(el("div.dm-src-get", { text: src.get }));
      if (src.url) {
        const a = el("a.dm-link", { href: src.url, target: "_blank", rel: "noopener noreferrer" });
        a.append(el("span.dm-link-ico", { text: "🔗" }));
        a.append(el("span.dm-link-text", { text: src.url.replace(/^https?:\/\/(www\.)?/, "") }));
        card.append(a);
      }
      if (items.length) {
        card.append(el("div.dm-src-what", { text: items.length === 1 ? "Read on this day" : `Read on this day (${items.length})` }));
        const ul = el("div.dm-src-items");
        for (const it of items) {
          const row = el("div.dm-src-item" + (it.done ? ".is-done" : ""));
          row.append(el("span.dm-src-check", { text: it.done ? "✓" : "○" }));
          const txt = el("span.dm-src-label");
          txt.innerHTML = it.label;
          row.append(txt);
          if (it.est) row.append(el("span.dm-src-est", { text: `${it.est}m` }));
          ul.append(row);
        }
        card.append(ul);
      }
      body.append(card);
    }
  }
  openModal({ title: `Reading list — ${day.title || relDay(day.date)}`, subtitle: movedSubtitle(rm, day),
    icon: "📚", body, actions: [{ label: "Close", variant: "primary", onClick: () => true }] });
}

function moveModal(rm, day, free, rerender) {
  const slug = rm.slug;
  const eff = dayDate(rm, slug, day);                   // resolver-gated effective date
  const current = eff !== day.date ? eff : null;        // highlight only a live override
  const body = el("div.day-modal");
  body.append(el("div.dm-note", { text:
    "Postpone this card to a free day before the next planned day. This only re-bases " +
    "its on-time date for the card's own tasks — completion and weeks are unchanged, and a " +
    "milestone waiting on this card gives it until the new date." }));

  const apply = (date, label) => {
    store.setDayDate(slug, day.id, date);              // date=null resets to original
    toast(label, { type: "ok" });
    rerender && rerender();
  };

  const opts = el("div.dm-dateopts", { role: "radiogroup", "aria-label": "Move day to" });
  const mkOpt = (date, isOriginal) => {
    const active = isOriginal ? !current : current === date;
    const b = el("button.dm-dateopt" + (active ? ".active" : ""), { type: "button", role: "radio",
      "aria-checked": active ? "true" : "false" });
    b.append(el("span.dm-dow", { text: dowOf(date) }));
    b.append(el("span.dm-date", { text: fmtDateHuman(date) }));
    if (isOriginal) b.append(el("span.dm-tag", { text: "original" }));
    b.onclick = () => { ctrl.close(); apply(isOriginal ? null : date,
      isOriginal ? "Day reset to its original date" : `Day moved to ${fmtDateHuman(date)}`); };
    return b;
  };
  opts.append(mkOpt(day.date, true));                  // reset row
  for (const d of free) opts.append(mkOpt(d, false));
  body.append(opts);

  const ctrl = openModal({ title: `Move day — ${day.title || relDay(day.date)}`,
    subtitle: `Free until ${fmtDateHuman(day.nextDate)}`, icon: "📆", body,
    actions: [{ label: "Done", variant: "ghost", onClick: () => true }] });
}

/* ---------------------------------------------------------------- *
 *  Entry point
 * ---------------------------------------------------------------- */
/** Open the day-card context menu at the pointer. `rerender` repaints the view
 *  after a move so the card re-lands on its new date. */
export function openDayMenu(rm, day, ev, rerender) {
  if (ev && ev.preventDefault) ev.preventDefault();
  const items = [
    { label: "Completion details", icon: "📊", onClick: () => completionModal(rm, day) },
    { label: "Time on tasks", icon: "⏱️", onClick: () => timeModal(rm, day) },
    { label: "References & links", icon: "🔗", onClick: () => refsModal(rm, day) },
  ];
  // only roadmaps that catalogue their sources (bedrock) get the reading list
  if ((rm.library || []).length) {
    items.push({ label: "Reading list — sources", icon: "📚", onClick: () => sourcesModal(rm, day) });
  }
  items.push({ separator: true });
  // "moved?" is judged by the RESOLVER, not the raw cell, so the menu always agrees
  // with the card. A stale override (e.g. left dangling by a whole-roadmap date
  // shift — nextDate is recomputed but the stored date isn't) is ignored by the
  // resolver, so self-heal it here rather than surface a phantom Reset.
  const isMoved = dayDate(rm, rm.slug, day) !== day.date;
  if (!isMoved && store.getDayDate(rm.slug, day.id)) store.setDayDate(rm.slug, day.id, null);
  const free = freeDatesFor(day);
  if (free.length) {
    items.push({ label: isMoved ? "Move day — change date…" : "Move day…", icon: "📆",
      onClick: () => moveModal(rm, day, free, rerender) });
  } else {
    items.push({ label: "Move day — no free day", icon: "📆", disabled: true,
      hint: !day.nextDate ? "This is the last day — nothing after it to move before."
          : addDays(day.date, 1) >= day.nextDate ? "The next planned day is the very next date — no room to move."
          : "The free days before the next planned day are already in the past." });
  }
  if (isMoved) items.push({ label: `Reset to original (${relDay(day.date)})`, icon: "↩️", danger: true,
    onClick: () => { store.setDayDate(rm.slug, day.id, null); toast("Day reset to its original date", { type: "ok" }); rerender && rerender(); } });

  openContextMenu(ev.clientX, ev.clientY, items);
}
