// list.mjs <slug> — each week's cards (for writing/reviewing week titles)
import { registry } from "../../tests/_load.mjs";
const s = process.argv[2];
await import(new URL(`../../public/roadmaps/${s}.js`, import.meta.url).pathname);
const rm = registry.getRoadmap(s);
for (const w of rm.weeks) {
  console.log(`${w.id} ${w.title}`);
  for (const d of rm.days.filter(d => d.week === w.id)) {
    const car = [...new Set(d.tasks.filter(t => t.carried).map(t => t.carried))];
    const req = d.tasks.reduce((a, t) => a + (t.optional ? 0 : t.est), 0);
    console.log(`   ${d.id} ${d.date} ${d.dow} ${req}m  ${d.title}${car.length ? "  ⟵ " + car.map(id => `${id} «${rm.daysById.get(id).title}»`).join(", ") : ""}`);
  }
}
