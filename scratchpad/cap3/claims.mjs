// claims.mjs — notes/themes/soft that describe a day's SIZE, next to that card's real load
import { registry } from "../../tests/_load.mjs";
for (const s of ["rust-fastapi", "interp-go", "bedrock", "raylib"]) {
  await import(new URL(`../../public/roadmaps/${s}.js`, import.meta.url).pathname);
  const rm = registry.getRoadmap(s);
  for (const d of rm.days) {
    const req = d.tasks.reduce((a, t) => a + (t.optional ? 0 : t.est), 0);
    const texts = [d.title, d.theme, d.note, ...d.soft.map(x => x.label)].filter(Boolean).join(" ¦ ");
    const m = texts.match(/[^.¦]*\b(light\w*|heav\w*|short\w*|long\w*|big\w*|buffer|slack|room for|nothing (due|new|is required)|quick\w*|easy|marathon|sprint|full day|whole day|breather|rest)\b[^.¦]*/gi);
    if (m) console.log(`${s} ${d.id} ${req}m${d.tasks.some(t => t.carried) ? " (+carried)" : ""}: ${m.map(x => x.trim().slice(0, 110)).join(" | ")}`);
  }
}
