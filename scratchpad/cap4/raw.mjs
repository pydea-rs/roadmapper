// raw.mjs <slug> <id...>  — print the exact source text of a leaf (or a task's refs)
import fs from "node:fs"; import * as acorn from "acorn";
const ORIG = new URL("../cap3/orig/public/roadmaps/", import.meta.url).pathname;
const src = fs.readFileSync(ORIG + process.argv[2] + ".js", "utf8");
const keyName = p => p.key && (p.key.name ?? p.key.value);
const prop = (o, n) => o.properties.find(p => keyName(p) === n);
const strOf = v => v.type === "Literal" ? v.value : v.quasis.map(x => x.value.cooked).join("");
const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
const obj = ast.body.find(n => n.type === "ExpressionStatement" && n.expression.callee?.name === "registerRoadmap").expression.arguments[0];
const want = new Set(process.argv.slice(3));
for (const dn of prop(obj, "days").value.elements) {
  const did = strOf(prop(dn, "id").value);
  for (const tn of prop(dn, "tasks").value.elements) {
    const tid = `${did}.${strOf(prop(tn, "id").value)}`;
    const pSub = prop(tn, "sub");
    if (want.has(tid) && !pSub) {
      console.log(`### ${tid}  est=${strOf(prop(tn,"est").value)}`);
      const r = prop(tn, "refs"); if (r) r.value.elements.forEach((e,i)=>console.log(`  ref[${i}] ${src.slice(e.start,e.end)}`));
      const l = prop(tn, "label"); if (l) console.log(`  label ${src.slice(l.value.start,l.value.end)}`);
    }
    if (!pSub) continue;
    for (const sn of pSub.value.elements) {
      const sid = `${tid}.${strOf(prop(sn, "id").value)}`;
      if (!want.has(sid)) continue;
      console.log(`### ${sid}  est=${strOf(prop(sn,"est").value)}`);
      const l = prop(sn, "label"); if (l) console.log(`  label ${src.slice(l.value.start,l.value.end)}`);
      const r = prop(sn, "refs"); if (r) r.value.elements.forEach((e,i)=>console.log(`  ref[${i}] ${src.slice(e.start,e.end)}`));
    }
  }
}
