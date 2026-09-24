// builder.mjs — write plan.json (from engine.mjs) back into the four roadmap files and
// interludes.js. Text-level: every task/soft/theme/note is re-used from its source slice
// (acorn ranges) in pub/roadmaps/ (reprice.mjs output), so authored wording and formatting
// survive byte-for-byte; only ids, dates, weeks, the `carried` marker, split parts and
// day/week cross-references are rewritten. overrides.json carries week titles, section
// comments and the prose edits the new calendar needs; a week with no hand-written title
// gets one DERIVED from the days it actually opens, which is the only way to keep 176
// week titles honest (hand-merged titles have cited chapters their week no longer held).
// Never reads the live files, so it can be re-run safely.
import fs from "node:fs";
import * as acorn from "acorn";
import { buildStreams, SLUGS, FRAME, add, SRC } from "./engine.mjs";

const ROOT = new URL("../../public/", import.meta.url).pathname;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dowOf = iso => DOW[new Date(iso + "T12:00:00Z").getUTCDay()];
const W = buildStreams();
const weeksPlan = JSON.parse(fs.readFileSync(new URL("./plan.json", import.meta.url)));
const OVR = JSON.parse(fs.readFileSync(new URL("./overrides.json", import.meta.url)));
const report = [];
const pad = n => "d" + String(n).padStart(2, "0");
const q = t => t.includes('"') ? "`" + t + "`" : JSON.stringify(t);
const keyName = p => p.key && (p.key.name ?? p.key.value);
const prop = (o, name) => o.properties.find(p => keyName(p) === name);
const lit = (src, node) => src.slice(node.start, node.end);
const strOf = v => v.type === "Literal" ? v.value : v.quasis.map(x => x.value.cooked).join("");

function applyEdits(text, base, edits) {       // edits: {start,end,text} in file offsets
  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const e of edits) out = out.slice(0, e.start - base) + e.text + out.slice(e.end - base);
  return out;
}
function removeProp(o, p) {                    // a property and its separating comma
  const i = o.properties.indexOf(p);
  if (i > 0) return { start: o.properties[i - 1].end, end: p.end, text: "" };
  const nx = o.properties[i + 1];
  return { start: p.start, end: nx ? nx.start : p.end, text: "" };
}
const suffixValue = (src, node, suf) => {      // append " (1/2)" inside a string/template literal
  const s = lit(src, node);
  return { start: node.start, end: node.end, text: s.slice(0, -1) + suf + s.slice(-1) };
};

// day ids and week numbers inside content text → the new calendar (never inside URLs)
function remapText(text, dayMap, weekMap, log) {
  return text.split(/(https?:\/\/[^\s"'`<>]+)/).map((seg, i) => {
    if (i % 2) return seg;
    let s = seg.replace(/\bd\d{2,3}\b/g, m => {
      if (!dayMap.has(m)) return m;
      const n = dayMap.get(m); if (n !== m) log.push(`${m}→${n}`); return n;
    });
    s = s.replace(/\b([Ww]eeks?)(\s+)(\d{1,2})(?:(\s*[–-]\s*)(\d{1,2}))?\b/g, (m, w, sp, a, dash, b) => {
      const A = weekMap.first.get(+a), B = b ? weekMap.last.get(+b) : null;
      if (A == null || (b && B == null)) return m;
      const out = !b ? `${w}${sp}${A}` : A === B ? `${w.replace(/s$/, "")}${sp}${A}` : `${w}${sp}${A}${dash}${B}`;
      if (out !== m) log.push(`"${m}"→"${out}"`);
      return out;
    });
    return s;
  }).join("");
}


// A week's title, derived from the home days it OPENS: their titles, minus the "(1/2)" /
// "(cont.)" bookkeeping, joined. Only when that runs long does it shorten — first by
// cutting each title at its colon, then by naming fewer days. Deriving beats merging
// authored titles by hand, which has twice produced weeks citing chapters they no
// longer held.
// "Ch9 — Control Flow (jlox) (1/2)" + a continuation card must not read "(1/2) (cont.)" —
// two competing part counters. Merge them: "Ch9 — Control Flow (jlox) (1/2, cont.)".
function contTitle(title) {
  const m = /^(.*)\((\d+\/\d+)\)\s*$/.exec(String(title));
  return m ? `${m[1].trimEnd()} (${m[2]}, cont.)` : `${title} (cont.)`;
}

function derivedTitle(rm, inWeek, homes, units) {
  const opened = inWeek.filter(c => c.opened >= 0).map(c => rm.days[homes[c.opened].k].title);
  const src = opened.length ? opened
    : [...new Set(inWeek.flatMap(c => c.items.map(x => rm.days[homes[units[x.i].k].k].title)))];
  const heads = [];
  for (const raw of src) {
    const t = String(raw).replace(/\s*\((?:\d+\/\d+, )?cont\.\)\s*$/, "").replace(/\s*\(\d+\/\d+\)\s*$/, "").replace(/\s*[—–-]\s*$/, "").trim();
    if (t && !heads.includes(t)) heads.push(t);
  }
  if (!heads.length) return "Continuing the week before";
  const LIMIT = 84;
  const join = xs => xs.join("; ");
  if (join(heads).length <= LIMIT) return join(heads);
  const short = heads.map(t => { const c = t.indexOf(":"); return c >= 14 ? t.slice(0, c).trim() : t; });
  if (join(short).length <= LIMIT) return join(short);
  for (let n = short.length - 1; n >= 1; n--) {
    const kept = join(short.slice(0, n)) + "; …";
    if (kept.length <= LIMIT || n === 1) return kept;
  }
  return short[0];
}

for (const s of SLUGS) {
  const file = ROOT + "roadmaps/" + s + ".js";
  const src = fs.readFileSync(SRC + s + ".js", "utf8");
  const comments = [];
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module", onComment: comments });
  const call = ast.body.find(n => n.type === "ExpressionStatement" && n.expression.callee?.name === "registerRoadmap").expression;
  const obj = call.arguments[0];
  const pWeeks = prop(obj, "weeks"), pDays = prop(obj, "days"), pMs = prop(obj, "milestones");
  const dayNodes = pDays.value.elements;
  // section comments between days (not the plain "WEEK N" separators, which are regenerated)
  // travel with the day that follows them; comments between milestones with that milestone
  const plainSep = c => /^[-=* \n]*(WEEK|Week) \d+[^\n]*[-=* \n]*$/.test(c.value) && c.value.length < 120;
  const dayComments = dayNodes.map((n, k) => comments.filter(c => c.start > (k ? dayNodes[k - 1].end : pDays.value.start) && c.end < n.start && !plainSep(c)));
  const msNodes = pMs.value.elements;
  const msComments = msNodes.map((n, j) => comments.filter(c => c.start > (j ? msNodes[j - 1].end : pMs.value.start) && c.end < n.start));
  const bigHomes = dayComments.map((cs, k) => cs.length ? k : -1).filter(k => k >= 0);   // homes that open a section
  const { rm, homes, units } = W[s];
  const O = OVR[s] || {};

  const cards = [];
  weeksPlan.forEach(w => (w.cards[s] || []).forEach(c => cards.push({ ...c, date: add(w.base, c.o), wi: w.i })));
  cards.forEach((c, ci) => { c.id = pad(ci + 1); c.week = `w${c.wi + 1}`; });
  const nWeeks = Math.max(...cards.map(c => c.wi)) + 1;

  const openerOf = new Map(), lastCardOf = new Map();
  cards.forEach(c => { if (c.opened >= 0) openerOf.set(c.opened, c); c.items.forEach(x => lastCardOf.set(units[x.i].k, c)); });
  const dayMap = new Map(homes.map(h => [h.id, openerOf.get(h.k).id]));
  const weekMap = { first: new Map(), last: new Map() };     // old week number → new
  homes.forEach(h => {
    const ow = h.week + 1;
    if (!weekMap.first.has(ow)) weekMap.first.set(ow, openerOf.get(h.k).wi + 1);
    weekMap.last.set(ow, lastCardOf.get(h.k).wi + 1);
  });
  const xlog = [];
  const remap = t => remapText(t, dayMap, weekMap, xlog);
  const partsOf = new Map();
  cards.forEach(c => c.items.forEach(x => { if (!partsOf.has(x.i)) partsOf.set(x.i, []); partsOf.get(x.i).push(x); }));
  const taskMap = new Map();                                   // old full task id → new parts

  // ---- days ----
  const dayTexts = [];
  let prevWi = -1;
  for (const c of cards) {
    const opened = c.opened >= 0 ? homes[c.opened] : null;
    const firstHome = homes[units[c.items[0].i].k];
    const dn = dayNodes[(opened || firstHome).k];
    const tasksOut = [];
    let tn = 0;
    const emitTask = (homeK, ti, edits0, carried) => {
      const tnode = prop(dayNodes[homeK], "tasks").value.elements[ti];
      const id = `t${++tn}`;
      const edits = [...edits0];
      const pid = prop(tnode, "id");
      edits.push({ start: pid.value.start, end: pid.value.end, text: `"${id}"` });
      // new day ids go in as placeholders so the old→new xref rewrite can't touch them
      const nid = openerOf.get(homeK).id.replace(/^d(\d+)$/, "⟦$1⟧");
      if (carried) edits.push({ start: pid.end, end: pid.end, text: `, carried: "${nid}"` });
      const pg = prop(tnode, "group");
      if (pg && carried) edits.push({ start: pg.value.start, end: pg.value.end, text: `"${pg.value.value}-${nid}"` });
      const text = remap(applyEdits(lit(src, tnode), tnode.start, edits)).replace(/⟦(\d+)⟧/g, "d$1");
      tasksOut.push("        " + text);
      const oldFull = `${homes[homeK].id}.${rm.days[homeK].tasks[ti].localId}`;
      if (!taskMap.has(oldFull)) taskMap.set(oldFull, []);
      taskMap.get(oldFull).push({ full: `${c.id}.${id}`, card: c });
    };
    for (const x of c.items) {
      const u = units[x.i];
      const parts = partsOf.get(x.i), pk = parts.indexOf(x), pn = parts.length;
      if (pk === 0) for (const ti of u.pre) emitTask(u.k, ti, [], x.carried);
      if (u.ti >= 0) {
        const tnode = prop(dayNodes[u.k], "tasks").value.elements[u.ti];
        const edits = [];
        if (pn > 1) {
          const suf = ` (${pk + 1}/${pn})`;
          for (const k of ["label", "lead"]) { const p = prop(tnode, k); if (p) edits.push(suffixValue(src, p.value, suf)); }
          const pe = prop(tnode, "est");
          edits.push({ start: pe.value.start, end: pe.value.end, text: String(x.mins) });
          const psub = prop(tnode, "sub");
          if (psub) {
            const els = psub.value.elements;
            const subTxt = els.slice(x.from, x.to).map((e, j) => {
              const pidS = prop(e, "id");
              return applyEdits(lit(src, e), e.start, [{ start: pidS.value.start, end: pidS.value.end, text: `"s${j + 1}"` }]);
            });
            const ind = src.slice(src.lastIndexOf("\n", els[0].start) + 1, els[0].start);
            const closeInd = src.slice(src.lastIndexOf("\n", psub.value.end - 1) + 1, psub.value.end - 1).match(/^\s*/)[0];
            edits.push({ start: psub.value.start, end: psub.value.end, text: "[\n" + subTxt.map(t => ind + t + ",").join("\n") + "\n" + closeInd + "]" });
          }
          if (pk < pn - 1) for (const k of ["model", "cards"]) { const p = prop(tnode, k); if (p) edits.push(removeProp(tnode, p)); }
          if (pk > 0) { const p = prop(tnode, "info"); if (p) edits.push(removeProp(tnode, p)); }
          report.push(`${s}: split ${homes[u.k].id} "${rm.days[u.k].title}" part ${pk + 1}/${pn} (${x.mins}m) → ${c.id} ${c.date}`);
        }
        emitTask(u.k, u.ti, edits, x.carried || pk > 0);
      }
      if (pk === pn - 1) for (const ti of u.opt) emitTask(u.k, ti, [], x.carried || pk > 0);
    }

    const P = k => prop(dn, k);
    const lines = [];
    const titleSrc = O.titles?.[c.id] ? q(O.titles[c.id])
      : opened ? remap(lit(src, P("title").value))
      : q(contTitle(rm.days[firstHome.k].title));
    const dowTxt = P("dow") ? `, dow: "${dowOf(c.date)}"` : "";
    lines.push(`      id: "${c.id}", date: "${c.date}", week: "${c.week}"${dowTxt}, title: ${titleSrc},`);
    if (opened) { if (P("theme")) lines.push("      " + remap(lit(src, P("theme"))) + ","); }
    else lines.push(`      theme: ${q(`Finish “${rm.days[firstHome.k].title}” — the part that didn't fit its first session.`)},`);
    lines.push("      tasks: [", tasksOut.join(",\n") + ",", "      ],");
    if (opened && P("soft")) lines.push("      " + remap(lit(src, P("soft"))) + ",");
    // the note of the home day this card opens (a note describes its own day)
    if (O.notes && c.id in O.notes) { if (O.notes[c.id]) lines.push(`      note: ${q(O.notes[c.id])},`); }
    else if (opened && P("note")) lines.push("      " + remap(lit(src, P("note"))) + ",");
    let sep = "";
    if (c.wi !== prevWi) { sep = `\n    /* ---------------- Week ${c.wi + 1} ---------------- */\n`; prevWi = c.wi; }
    if (opened) for (const cm of dayComments[opened.k]) {
      let txt = remap(lit(src, cm)).replace(/⟦(\d+)⟧/g, "d$1");
      const range = txt.match(/Dates (\d{4}-\d{2}-\d{2}) → (\d{4}-\d{2}-\d{2})/);
      if (range) {
        const nextBig = bigHomes.find(k => k > opened.k);
        const blockCards = cards.filter(x => x.date >= c.date && (nextBig == null || x.date < openerOf.get(nextBig).date));
        txt = txt.replace(range[0], `Dates ${c.date} → ${blockCards.at(-1).date}`);
      }
      sep += (sep.endsWith("\n") || !sep ? "" : "\n") + "    " + txt + "\n";
    }
    dayTexts.push(sep + "    {\n" + lines.join("\n") + "\n    },");
  }

  // ---- weeks (titles are hand-written in overrides.json; a missing one is reported) ----
  const weekTxt = [];
  for (let wi = 0; wi < nWeeks; wi++) {
    const id = `w${wi + 1}`;
    let title = O.weeks?.[id];
    // a week that holds exactly the days of the same original week keeps its authored title
    const inWeek = cards.filter(c => c.wi === wi);
    const homeWeeks = new Set(inWeek.flatMap(c => c.items.map(x => homes[units[x.i].k].week)));
    const origWeekDays = homes.filter(h => h.week === wi).map(h => h.k).join();
    const sameDays = homeWeeks.size === 1 && homeWeeks.has(wi) && inWeek.filter(c => c.opened >= 0).map(c => c.opened).join() === origWeekDays;
    if (!title && sameDays && wi < pWeeks.value.elements.length) title = strOf(prop(pWeeks.value.elements[wi], "title").value);
    if (!title) title = `Week ${wi + 1} — ${derivedTitle(rm, inWeek, homes, units)}`;
    if (O.weekComments?.[id]) weekTxt.push(`    ${O.weekComments[id]}`);
    weekTxt.push(`    { id: "${id}", title: ${q(title)}, start: "${add(FRAME, 7 * wi)}" },`);
  }

  // ---- milestones: re-anchor, re-week, re-id ----
  const msTxt = [], msCount = {}, msIdMap = [];
  for (const mn of pMs.value.elements) {
    const rule = prop(mn, "rule").value;
    const edits = [];
    let wk;
    if (prop(rule, "type").value.value === "tasks") {
      const req = prop(rule, "require").value;
      const ids = []; let lastCard = null;
      for (const e of req.elements) {
        const parts = taskMap.get(e.value);
        if (!parts) throw new Error(`${s}: milestone requirement ${e.value} unmapped`);
        for (const n of parts) { ids.push(n.full); if (!lastCard || n.card.date > lastCard.date) lastCard = n.card; }
      }
      edits.push({ start: req.start, end: req.end, text: "[" + ids.map(x => `"${x}"`).join(", ") + "]" });
      wk = lastCard.week;
    } else {
      const ow = +prop(mn, "week").value.value.slice(1);
      // a week-share goal follows its week; overrides.json may pin it to the week its topic now lands in
      wk = O.milestoneWeek?.[prop(mn, "id").value.value] || `w${weekMap.first.get(ow)}`;
      const pt = prop(mn, "title");
      edits.push({ start: pt.value.start, end: pt.value.end, text: q(strOf(pt.value).replace(/week \d+/i, m => m.replace(/\d+/, weekMap.first.get(ow)))) });
    }
    const pw = prop(mn, "week");
    edits.push({ start: pw.value.start, end: pw.value.end, text: `"${wk}"` });
    msCount[wk] = (msCount[wk] || 0) + 1;
    const pidM = prop(mn, "id"), newMid = `${wk}.m${msCount[wk]}`;
    msIdMap.push(`${pidM.value.value}→${newMid}`);
    edits.push({ start: pidM.value.start, end: pidM.value.end, text: `"${newMid}"` });
    for (const cm of msComments[pMs.value.elements.indexOf(mn)]) msTxt.push("    " + remap(lit(src, cm)));
    msTxt.push("    " + applyEdits(lit(src, mn), mn.start, edits) + ",");
  }

  const region = "weeks: [\n" + weekTxt.join("\n") + "\n  ],\n\n  days: [" + dayTexts.join("\n") + "\n  ],\n\n  milestones: [\n" + msTxt.join("\n") + "\n  ]";
  let out = src.slice(0, pWeeks.start) + region + src.slice(pMs.end);
  for (const [a, b] of O.replace || []) {
    const n = out.split(a).length - 1;
    if (n !== 1) throw new Error(`${s}: replace target found ${n}× — ${a.slice(0, 90)}`);
    out = out.replace(a, () => b);
  }
  fs.writeFileSync(file, out);
  report.push(`${s}: milestones ${msIdMap.join(" ")}`);
  report.push(`${s}: ${cards.length} cards / ${nWeeks} weeks, ${cards[0].date} → ${cards.at(-1).date}; xrefs rewritten: ${xlog.length}`);
  report.push(`${s}: dayMap ${[...dayMap].filter(([o, n]) => o !== n).map(([o, n]) => o + "→" + n).join(" ")}`);
  fs.writeFileSync(new URL(`./xref-${s}.txt`, import.meta.url), xlog.join("\n") + "\n");
  W[s].lastCardOf = lastCardOf;
}

// ---- interludes: after the card holding the last part of their original day ----
{
  const file = ROOT + "assets/js/interludes.js";
  const src = fs.readFileSync(new URL("../cap3/orig/interludes.js", import.meta.url), "utf8");
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  const decl = ast.body.find(n => n.type === "VariableDeclaration" && n.declarations[0].id.name === "INTERLUDES").declarations[0].init;
  const edits = [];
  for (const p of decl.properties) {
    const slug = keyName(p);
    if (!W[slug]) continue;
    for (const e of p.value.elements) {
      const pa = prop(e, "afterDay");
      const h = W[slug].homes.find(h => h.id === pa.value.value);
      const pinned = OVR[slug]?.interludeAfter?.[prop(e, "id").value.value];   // hand-placed (overrides.json)
      edits.push({ start: pa.value.start, end: pa.value.end, text: `"${pinned || W[slug].lastCardOf.get(h.k).id}"` });
    }
  }
  let out = applyEdits(src, 0, edits);
  for (const [a, b] of OVR.interludesReplace || []) {
    if (out.split(a).length !== 2) throw new Error(`interludes: replace target not found exactly once — ${a.slice(0, 90)}`);
    out = out.replace(a, () => b);
  }
  fs.writeFileSync(file, out);
}
console.log(report.join("\n"));
