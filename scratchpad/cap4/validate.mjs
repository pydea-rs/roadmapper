// validate.mjs — registry/validateAll on the LIVE files + per-date load, order and week windows
import { registry, loadRoadmap } from "../../tests/_load.mjs";
for (const s of ["rust-fastapi", "interp-go", "bedrock", "raylib"]) await loadRoadmap(s + ".js");
console.log("errors", registry.registryErrors(), "validate", registry.validateAll());
const req = d => d.tasks.reduce((a, t) => a + (t.optional ? 0 : t.est || 0), 0);
const m = new Map();
for (const rm of registry.getRoadmaps()) {
  let prev = "";
  for (const d of rm.days) {
    if (d.date <= prev) console.log("NON-MONOTONIC", rm.slug, d.id); prev = d.date;
    const w = rm.weeksById.get(d.week), off = (Date.parse(d.date) - Date.parse(w.start)) / 864e5;
    if (off < 0 || off > 6) console.log("OUTSIDE ITS WEEK", rm.slug, d.id);
    m.set(d.date, (m.get(d.date) || 0) + req(d));
  }
  const c = rm.weeks.map(w => rm.days.filter(d => d.week === w.id).length).join("");
  console.log(rm.slug, rm.days.length, "days", rm.weeks.length, "weeks", rm.days[0].date, "→", rm.days.at(-1).date,
    "req", rm.days.reduce((a, d) => a + req(d), 0), "| per week", c,
    "| carried", rm.days.reduce((a, d) => a + d.tasks.filter(t => t.carried).length, 0),
    "| cont", rm.days.filter(d => /cont\.\)$/.test(d.title)).length, "| max card", Math.max(...rm.days.map(req)));
}
console.log("busiest date", Math.max(...m.values()), "| over 180:", [...m].filter(([, v]) => v > 180));
