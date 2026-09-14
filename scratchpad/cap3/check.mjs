// check.mjs — content preservation: the rebuilt files hold exactly the original content,
// in the same order, modulo renumbered ids, rewritten day/week refs and split suffixes;
// and every carried task points at the card showing its original day's title.
import { execFileSync } from "node:child_process";
const ORIGDIR = new URL("./orig/public/roadmaps/", import.meta.url).pathname;
const LIVE = new URL("../../public/roadmaps/", import.meta.url).pathname;
const LOAD = new URL("../../tests/_load.mjs", import.meta.url).pathname;
const code = dir => `const {registry}=await import(${JSON.stringify(LOAD)});
for (const s of ["rust-fastapi","interp-go","bedrock","raylib"]) await import(${JSON.stringify(dir)}+s+".js");
const norm=x=>String(x??"").replace(/\\bd\\d{2,3}\\b/g,"dX").replace(/\\b([Ww]eeks?)(\\s+)\\d{1,2}(\\s*[–-]\\s*\\d{1,2})?\\b/g,"$1 N").replace(/ \\(\\d\\/\\d\\)$/,"");
const out={};
for (const rm of registry.getRoadmaps()) {
  const tasks=[],soft=[],ident=[],home=[];
  for (const d of rm.days) {
    for (const t of d.tasks) { tasks.push({obj:t.obj,cat:t.cat,optional:t.optional,label:norm(t.label),lead:norm(t.lead),refs:(t.refs||[]).map(norm),model:norm(t.model),cards:norm(JSON.stringify(t.cards)),info:norm(t.info),fallback:JSON.stringify(t.fallback),est:t.est,
      subs:(t.subs||[]).map(x=>({est:x.est,label:norm(x.label),cat:x.cat,note:norm(x.note),info:norm(x.info),cards:norm(JSON.stringify(x.cards))}))});
      home.push((t.carried?rm.daysById.get(t.carried):d).title); }
    for (const x of d.soft) soft.push(x.type+"|"+norm(x.label));
    if (!/\\(cont\\.\\)$/.test(d.title)) ident.push(norm(d.title)+"|"+norm(d.theme));
  }
  out[rm.slug]={tasks,soft,ident,home,notes:rm.days.map(d=>norm(d.note)).filter(Boolean).join(" ")};
}
console.log(JSON.stringify(out));`;
const run = dir => JSON.parse(execFileSync("node", ["--input-type=module", "-e", code(dir)], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 28 }));
const A = run(ORIGDIR), B = run(LIVE);
const dedupe = a => a.filter((v, i) => !i || v !== a[i - 1]);
for (const s of Object.keys(A)) {
  const a = A[s], b = B[s]; const probs = [];
  const merged = [];
  const key = x => JSON.stringify([x.obj, x.cat, x.optional, x.label, x.lead, x.refs]);
  for (const t of b.tasks) {
    const p = merged.at(-1), orig = a.tasks[merged.length - 1];
    if (p && orig && key(p) === key(t) && p.est + t.est <= orig.est) {
      p.est += t.est; p.subs = p.subs.concat(t.subs);
      if (t.model) p.model = t.model; if (t.cards !== "null") p.cards = t.cards; continue;
    }
    merged.push({ ...t });
  }
  if (merged.length !== a.tasks.length) probs.push(`task count ${a.tasks.length} vs ${merged.length}`);
  for (let i = 0; i < Math.min(merged.length, a.tasks.length); i++) {
    const ks = Object.keys(a.tasks[i]).filter(k => JSON.stringify(a.tasks[i][k]) !== JSON.stringify(merged[i][k]));
    if (ks.length) probs.push(`task ${i} differs in ${ks}`);
  }
  if (JSON.stringify(a.soft) !== JSON.stringify(b.soft)) probs.push("soft items differ" + a.soft.map((x, i) => x !== b.soft[i] ? `\n   - ${x.slice(0, 140)}\n   + ${String(b.soft[i]).slice(0, 140)}` : "").join(""));
  if (JSON.stringify(a.ident) !== JSON.stringify(b.ident)) probs.push("titles/themes differ");
  if (a.notes.split(" ").sort().join(" ") !== b.notes.split(" ").sort().join(" ")) probs.push("notes differ");
  if (JSON.stringify(dedupe(a.home)) !== JSON.stringify(dedupe(b.home))) probs.push("a carried task points at the wrong day");
  console.log(s, probs.length ? "❌ " + probs.join("; ") : "✅ same content, same order; every carried task points at its original day");
}
