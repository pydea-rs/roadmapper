// preserve.mjs — content preservation across the REPRICE step (cap3/orig → pub/).
// Re-pricing and splitting deliberately rewrite leaf labels and ests, so this cannot
// compare text leaf-for-leaf. What it CAN prove, and does:
//   · the day / task / soft structure is untouched (counts, ids, order, titles, themes,
//     notes, objectives, milestones)
//   · every outbound link in the original still exists
//   · no task lost its recall cards, its ⓘ explainer or its takeaway
//   · every task's minutes only ever went UP
import { execFileSync } from "node:child_process";
const A_DIR = new URL("../cap3/orig/public/roadmaps/", import.meta.url).pathname;
const B_DIR = new URL("./pub/roadmaps/", import.meta.url).pathname;
const LOAD = new URL("../../tests/_load.mjs", import.meta.url).pathname;
const code = dir => `const {registry}=await import(${JSON.stringify(LOAD)});
for (const s of ["rust-fastapi","interp-go","bedrock","raylib"]) await import(${JSON.stringify(dir)}+s+".js");
const urls=t=>[...String(t??"").matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
const out={};
for (const rm of registry.getRoadmaps()) {
  const days=[],tasks=[],soft=[],links=new Set(),ms=[];
  for (const d of rm.days) {
    days.push([d.id,d.title,d.theme,d.note,d.week].join("|"));
    for (const t of d.tasks) {
      tasks.push({id:t.id,obj:t.obj,optional:t.optional,est:t.est,cards:(t.cards||[]).length,
        hasInfo:!!t.info,hasModel:!!t.model,nSubs:(t.subs||[]).length});
      for (const f of [t.label,t.lead,t.info,t.model,...(t.refs||[])]) urls(f).forEach(u=>links.add(u));
      for (const s of (t.subs||[])) for (const f of [s.label,s.note,s.info,s.model,...(s.refs||[])]) urls(f).forEach(u=>links.add(u));
    }
    for (const x of d.soft) soft.push(x.id+"|"+x.type+"|"+x.label);
  }
  for (const m of rm.milestones) ms.push(m.id+"|"+m.title+"|"+JSON.stringify(m.rule));
  out[rm.slug]={days,tasks,soft,ms,links:[...links].sort(),objs:rm.objectives.map(o=>o.id+"|"+o.title)};
}
console.log(JSON.stringify(out));`;
const run = dir => JSON.parse(execFileSync("node", ["--input-type=module", "-e", code(dir)],
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 28 }));
const A = run(A_DIR), B = run(B_DIR);
let bad = 0;
for (const s of Object.keys(A)) {
  const a = A[s], b = B[s], probs = [];
  const same = (name, x, y) => { if (JSON.stringify(x) !== JSON.stringify(y)) probs.push(name); };
  same("days (ids/titles/themes/notes/weeks)", a.days, b.days);
  same("soft items", a.soft, b.soft);
  same("milestones", a.ms, b.ms);
  same("objectives", a.objs, b.objs);
  const lost = a.links.filter(u => !b.links.includes(u));
  if (lost.length) probs.push(`${lost.length} link(s) lost: ${lost.slice(0, 3).join(" ")}`);
  if (a.tasks.length !== b.tasks.length) probs.push(`task count ${a.tasks.length} vs ${b.tasks.length}`);
  else for (let i = 0; i < a.tasks.length; i++) {
    const x = a.tasks[i], y = b.tasks[i];
    if (x.id !== y.id || x.obj !== y.obj || x.optional !== y.optional) probs.push(`task ${x.id} identity changed`);
    if (x.cards !== y.cards) probs.push(`task ${x.id} lost recall cards (${x.cards}→${y.cards})`);
    if (x.hasInfo && !y.hasInfo) probs.push(`task ${x.id} lost its ⓘ explainer`);
    if (x.hasModel && !y.hasModel) probs.push(`task ${x.id} lost its takeaway`);
    if (y.est < x.est) probs.push(`task ${x.id} got CHEAPER (${x.est}→${y.est})`);
  }
  const est = k => B[s].tasks.reduce((t, x) => t + x.est, 0);
  console.log(s, probs.length ? "❌ " + [...new Set(probs)].slice(0, 6).join("; ") : "✅ structure, links, cards and explainers all intact; minutes only rose");
  bad += probs.length;
}
process.exit(bad ? 1 : 0);
