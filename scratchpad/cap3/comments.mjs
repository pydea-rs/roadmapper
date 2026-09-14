import fs from "node:fs"; import * as acorn from "acorn";
for (const s of ["rust-fastapi","interp-go","bedrock","raylib"]) {
  const src = fs.readFileSync(`orig/public/roadmaps/${s}.js`, "utf8"); const cs = [];
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module", onComment: cs });
  const call = ast.body.find(n => n.expression?.callee?.name === "registerRoadmap").expression.arguments[0];
  const days = call.properties.find(p => p.key.name === "days").value, ms = call.properties.find(p => p.key.name === "milestones").value;
  const weeks = call.properties.find(p => p.key.name === "weeks");
  const inDays = cs.filter(c => c.start > days.start && c.end < days.end && !days.elements.some(e => c.start > e.start && c.end < e.end));
  const inside = cs.filter(c => days.elements.some(e => c.start > e.start && c.end < e.end));
  const inMs = cs.filter(c => c.start > ms.start && c.end < ms.end);
  const inWeeks = cs.filter(c => c.start > weeks.start && c.end < weeks.value.end);
  console.log(`\n## ${s}: between-day comments ${inDays.length}, inside-day comments ${inside.length}, milestone comments ${inMs.length}, week comments ${inWeeks.length}`);
  for (const c of inDays) { const t = c.value.replace(/\s+/g, " ").trim(); if (!/^[-=* ]*(WEEK|Week) \d+[-=* ]*$/.test(t)) console.log("  •", t.slice(0, 230)); }
  for (const c of inside) console.log("  (inside)", c.value.replace(/\s+/g, " ").trim().slice(0, 150));
  for (const c of inMs) console.log("  (ms)", c.value.replace(/\s+/g, " ").trim().slice(0, 150));
  for (const c of inWeeks) console.log("  (weeks)", c.value.replace(/\s+/g, " ").trim().slice(0, 150));
}
console.log("\n\n=== FULL BLOCKS ===");
for (const s of ["rust-fastapi","bedrock"]) {
  const src = fs.readFileSync(`orig/public/roadmaps/${s}.js`, "utf8"); const cs = [];
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module", onComment: cs });
  for (const c of cs) if (c.type === "Block" && c.value.includes("====") && c.value.length > 120 && src.indexOf("days: [") < c.start) console.log(src.slice(c.start, c.end), "\n");
}
