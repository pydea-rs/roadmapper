// reprice.mjs — apply the 2026-09-25 "make it doable" content pass to the PRE-cap
// roadmap sources and write them to src/. Two kinds of edit, both keyed by a leaf's
// ORIGINAL full id ("d03.t1.s2", or "d07.t1" for a task that is its own leaf):
//   { est: N }                     re-price the leaf, nothing else changes
//   { split: [{...}, {...}] }      break it into 2–3 leaves, each with its own honest
//                                  est and label (never est/2 — see edits/*.json)
// A task whose leaves change is re-emitted with its `sub:` array regenerated and its
// sub ids renumbered s1..sn; every other byte of the file is untouched, so the authored
// wording, comments and formatting of everything else survive exactly.
//
//   node reprice.mjs            → src/*.js  (+ a per-roadmap report)
import fs from "node:fs";
import * as acorn from "acorn";

export const SLUGS = ["rust-fastapi", "interp-go", "bedrock", "raylib"];
const ORIG = new URL("../cap3/orig/public/roadmaps/", import.meta.url).pathname;
const OUT = new URL("./pub/roadmaps/", import.meta.url).pathname;
const EDITS = new URL("./edits/", import.meta.url).pathname;

const keyName = p => p.key && (p.key.name ?? p.key.value);
const prop = (o, name) => o.properties.find(p => keyName(p) === name);
const lit = (src, n) => src.slice(n.start, n.end);
const strOf = v => v.type === "Literal" ? v.value : v.quasis.map(x => x.value.cooked).join("");
const q = t => /[`\\]|\$\{/.test(t) || !t.includes('"') ? JSON.stringify(t) : "`" + t + "`";

function applyEdits(text, base, edits) {
  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const e of edits) out = out.slice(0, e.start - base) + e.text + out.slice(e.end - base);
  return out;
}
// drop a property (and its separating comma) from an object literal
function removeProp(o, p) {
  const i = o.properties.indexOf(p);
  if (i > 0) return { start: o.properties[i - 1].end, end: p.end, text: "" };
  const nx = o.properties[i + 1];
  return { start: p.start, end: nx ? nx.start : p.end, text: "" };
}
// set an existing property's value, or append the property before the closing brace
function setProp(o, name, valueText) {
  const p = prop(o, name);
  if (p) return { start: p.value.start, end: p.value.end, text: valueText };
  const last = o.properties.at(-1);
  return { start: last.end, end: last.end, text: `, ${name}: ${valueText}` };
}

export function repriceAll() {
  const reports = {};
  fs.mkdirSync(OUT, { recursive: true });
  for (const slug of SLUGS) {
    const src = fs.readFileSync(ORIG + slug + ".js", "utf8");
    const file = EDITS + slug + ".json";
    const E = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
    // "_rules": a by-kind uplift for every leaf with no decision of its own — the long
    // tail that is priced about right in shape but still reads the material's length
    // rather than a real session. First matching rule wins; nothing else is touched.
    const RULES = E._rules || []; delete E._rules;
    const round5 = n => Math.max(5, Math.round(n / 5) * 5);
    const ruleFor = (cat, est) => RULES.find(r => (!r.cat || r.cat === cat) && est >= (r.min ?? 0) && est <= (r.max ?? 1e9));
    const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
    const call = ast.body.find(n => n.type === "ExpressionStatement" && n.expression.callee?.name === "registerRoadmap").expression;
    const days = prop(call.arguments[0], "days").value.elements;
    const used = new Set(), rep = { slug, priced: 0, splitLeaves: 0, newLeaves: 0, before: 0, after: 0, unknown: [] };
    const fileEdits = [];

    for (const dn of days) {
      const did = strOf(prop(dn, "id").value);
      for (const tn of prop(dn, "tasks").value.elements) {
        const tid = `${did}.${strOf(prop(tn, "id").value)}`;
        const pSub = prop(tn, "sub");
        const leafNodes = pSub ? pSub.value.elements : [tn];
        const leafIds = pSub ? leafNodes.map(e => `${tid}.${strOf(prop(e, "id").value)}`) : [tid];
        const taskCat = strOf(prop(tn, "cat")?.value ?? { type: "Literal", value: "read" });
        const catOf = n => n === tn ? taskCat : (prop(n, "cat") ? strOf(prop(n, "cat").value) : taskCat);
        const ruled = new Map();
        for (const [li, n] of leafNodes.entries()) {
          if (E[leafIds[li]]) continue;
          const est0 = +strOf(prop(n, "est").value) || 0;
          const r = ruleFor(catOf(n), est0);
          if (r && round5(est0 * r.mul) !== est0) ruled.set(leafIds[li], round5(est0 * r.mul));
        }
        if (!leafIds.some(id => E[id]) && !ruled.size) { leafNodes.forEach(n => { const v = +strOf(prop(n, "est").value) || 0; rep.before += v; rep.after += v; }); continue; }

        // regenerate this task's whole sub list
        const indent = pSub ? src.slice(src.lastIndexOf("\n", pSub.value.elements[0].start) + 1, pSub.value.elements[0].start)
                            : "            ";
        const closeInd = pSub ? src.slice(src.lastIndexOf("\n", pSub.value.end - 1) + 1, pSub.value.end - 1).match(/^\s*/)[0] : "          ";
        // a task's own (non-leaf) keys never travel into a sub
        const TASK_ONLY = new Set(["id", "obj", "group", "link", "preread", "phase", "optional", "fallback", "sub", "carried", "info", "cards", "model"]);
        const fieldText = (k, v) => k === "est" ? String(v) : k === "cards" || k === "refs" ? JSON.stringify(v) : q(v);
        const reindent = (text, from, to) => from === to ? text : text.split("\n").map((l, i) => i && l.startsWith(from) ? to + l.slice(from.length) : l).join("\n");

        const bodies = [];
        const specsOf = new Map();
        leafNodes.forEach((ln, li) => {
          const id = leafIds[li];
          const e = E[id] || (ruled.has(id) ? { est: ruled.get(id) } : null);
          const est0 = +strOf(prop(ln, "est").value) || 0;
          rep.before += est0;
          if (E[id]) used.add(id);
          const specs = e?.split || [{ ...(e || {}), est: e?.est ?? est0 }];
          if (e?.split) { rep.splitLeaves++; rep.newLeaves += specs.length - 1; }
          else if (e && e.est != null && e.est !== est0) rep.priced++;
          const isTaskNode = ln === tn;
          specsOf.set(id, specs[0]);
          const refEls = prop(tn, "refs")?.value.elements || [];
          for (const sp of specs) if (sp.fromRef != null) {
            const r = refEls[sp.fromRef];
            if (!r) throw new Error(`${slug} ${id}: fromRef ${sp.fromRef} but the task has ${refEls.length} refs`);
            sp.labelRaw = lit(src, r); sp.refs = null; delete sp.fromRef;
          }
          const oldInd = src.slice(src.lastIndexOf("\n", ln.start) + 1, ln.start).match(/^\s*/)[0];
          specs.forEach((sp, k) => {
            rep.after += sp.est;
            const drop = new Set(isTaskNode ? TASK_ONLY : ["id"]);
            if (specs.length > 1) {
              // each part stands alone: the ⓘ explainer rides with the first, the recall
              // cards and the takeaway with the last (they quiz/summarise the whole item)
              if (k > 0) drop.add("info");
              if (k < specs.length - 1) { drop.add("cards"); drop.add("model"); }
            }
            const out = [`id: "s${bodies.length + 1}"`];
            const seen = new Set();
            for (const pp of ln.properties) {
              const key = keyName(pp);
              if (key === "id") continue;
              seen.add(key);
              if (key === "label" && sp.labelRaw != null) { out.push(`label: ${sp.labelRaw}`); continue; }
              if (key in sp) { if (sp[key] !== null) out.push(`${key}: ${fieldText(key, sp[key])}`); continue; }
              if (drop.has(key)) continue;
              out.push(reindent(`${key}: ${lit(src, pp.value)}`, oldInd, indent));
            }
            if (sp.labelRaw != null && !seen.has("label")) out.push(`label: ${sp.labelRaw}`);
            for (const key of Object.keys(sp)) if (!seen.has(key) && sp[key] !== null && !["id", "labelRaw"].includes(key)) out.push(`${key}: ${fieldText(key, sp[key])}`);
            const ORDER = ["id", "cat", "est", "label", "lead", "refs", "note", "info", "model", "cards"];
            const rank = f => { const i = ORDER.findIndex(k => f.startsWith(k + ":")); return i < 0 ? ORDER.length : i; };
            out.sort((a, b) => rank(a) - rank(b));
            if (/^model:/m.test(out.join("\n"))) throw new Error(`${slug} ${id}: a sub-task cannot carry \`model\` — render.js only shows a takeaway on the parent task`);
            bodies.push("{ " + out.join(", ") + " }");
          });
        });
        const listText = "[\n" + bodies.map(b => indent + b + ",").join("\n") + "\n" + closeInd + "]";
        const sumEst = bodies.reduce((a, b) => a + (+/\best:\s*(\d+)/.exec(b)?.[1] || 0), 0);
        if (pSub) {
          fileEdits.push({ start: pSub.value.start, end: pSub.value.end, text: listText });
          fileEdits.push(setProp(tn, "est", String(sumEst)));
        } else if (bodies.length === 1) {
          // a plain task that only changed price stays a plain task — wrapping it in a
          // one-item sub list would break the bonus track, which renders optionals flat
          for (const [k, v] of Object.entries(specsOf.get(leafIds[0]) || {})) {
            if (k === "labelRaw" || k === "id") continue;
            if (v === null) { const pp = prop(tn, k); if (pp) fileEdits.push(removeProp(tn, pp)); }
            else fileEdits.push(setProp(tn, k, fieldText(k, v)));
          }
        } else {
          if (strOf(prop(tn, "optional")?.value ?? { type: "Literal", value: false }))
            throw new Error(`${slug} ${tid}: an optional task cannot be split into sub-tasks (the bonus track renders it flat)`);
          // the task had no sub list: keep its framing (lead/obj/…), move the leaf
          // fields into the new parts, and let `est` become the derived sum
          const keep = [];
          for (const pp of tn.properties) {
            const key = keyName(pp);
            if (key === "est") { keep.push(`est: ${sumEst}`); continue; }
            if (["label", "note", "refs", "cat"].includes(key)) continue;
            keep.push(reindent(`${key}: ${lit(src, pp.value)}`, src.slice(src.lastIndexOf("\n", tn.start) + 1, tn.start).match(/^\s*/)[0], "          "));
          }
          const catP = prop(tn, "cat");
          if (catP) keep.splice(2, 0, `cat: ${lit(src, catP.value)}`);
          fileEdits.push({ start: tn.start, end: tn.end, text: "{ " + keep.join(", ") + `,\n          sub: ${listText} }` });
        }
      }
    }
    // the source library (edits/<slug>-library.json) goes in ahead of `weeks:`, which is
    // where the cap4 builder starts rewriting — so it survives every later re-plan
    const libFile = EDITS + slug + "-library.json";
    if (fs.existsSync(libFile)) {
      const lib = JSON.parse(fs.readFileSync(libFile, "utf8"));
      const pWeeks = prop(call.arguments[0], "weeks");
      const text = "library: [\n" + lib.map(x => "    " + JSON.stringify(x) + ",").join("\n") + "\n  ],\n\n  ";
      fileEdits.push({ start: pWeeks.start, end: pWeeks.start, text });
      rep.library = lib.length;
    }
    for (const id of Object.keys(E)) if (!used.has(id)) rep.unknown.push(id);
    fs.writeFileSync(OUT + slug + ".js", applyEdits(src, 0, fileEdits));
    reports[slug] = rep;
  }
  return reports;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = repriceAll();
  for (const s of SLUGS) {
    const x = r[s];
    console.log(`${s}: priced ${x.priced}, split ${x.splitLeaves} leaves → +${x.newLeaves}; est ${(x.before / 60).toFixed(1)}h → ${(x.after / 60).toFixed(1)}h` + (x.unknown.length ? `  ❗unknown ids: ${x.unknown.join(" ")}` : ""));
  }
}
