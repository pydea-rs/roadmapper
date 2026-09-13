import { registry, loadRoadmap, util } from "/home/paya/thcpp/PHP/Roadmaps/tests/_load.mjs";
const FILES=["rust-fastapi.js","interp-go.js","bedrock.js","raylib.js"];
for (const f of FILES) await loadRoadmap(f);
let faults=0; const bad=(m)=>{faults++; console.log("  ✗ "+m);};
console.log("validateAll:", JSON.stringify(registry.validateAll()));
console.log("registryErrors:", JSON.stringify(registry.registryErrors()));
for (const f of FILES){ const rm=registry.getRoadmap(f.replace(".js",""));
  const dates=rm.days.map(d=>d.date);
  if(new Set(dates).size!==dates.length) bad(`${rm.slug}: duplicate day dates`);
  for(let i=1;i<dates.length;i++) if(dates[i]<dates[i-1]) bad(`${rm.slug}: out of order at ${rm.days[i].id}`);
  for(const d of rm.days){ const w=rm.weeksById.get(d.week);
    if(!w) { bad(`${rm.slug}/${d.id}: missing week`); continue; }
    if(d.date<w.start||d.date>util.addDays(w.start,6)) bad(`${rm.slug}/${d.id} ${d.date} outside ${d.week} [${w.start}]`);
    if(d.dow!==util.DOW[util.parseDate(d.date).getDay()]) bad(`${rm.slug}/${d.id}: dow mismatch`); }
  // weeks strictly increasing + every week non-empty
  const used=new Set(rm.days.map(d=>d.week));
  for(const w of rm.weeks) if(!used.has(w.id)) bad(`${rm.slug}: week ${w.id} has NO days`);
  for(let i=1;i<rm.weeks.length;i++) if(rm.weeks[i].start<=rm.weeks[i-1].start) bad(`${rm.slug}: week starts not increasing at ${rm.weeks[i].id}`);
  // milestones resolve + unique ids
  const mids=rm.milestones.map(m=>m.id);
  if(new Set(mids).size!==mids.length) bad(`${rm.slug}: duplicate milestone ids`);
  for(const m of rm.milestones){ if(m.week&&!rm.weeksById.has(m.week)) bad(`${rm.slug}/${m.id}: bad week`);
    for(const id of (m.rule.require||[])) if(!rm.tasksById.has(id)) bad(`${rm.slug}/${m.id}: missing task ${id}`);
    // a milestone must be reachable: every required task's day must be <= its week end
    const w=rm.weeksById.get(m.week); if(!w) continue;
    for(const id of (m.rule.require||[])){ const d=rm.daysById.get(id.split(".")[0]);
      if(d && d.date>util.addDays(w.start,6)) bad(`${rm.slug}/${m.id}: requires ${id} on ${d.date}, AFTER week ${m.week} ends ${util.addDays(w.start,6)}`); } }
  // parent est == sum(subs)
  for(const d of rm.days) for(const t of d.tasks) if(t.subs && t.est!==t.subs.reduce((s,l)=>s+l.est,0)) bad(`${rm.slug}/${t.id}: est != sum(subs)`);
}
// cross-roadmap: no side-track date collisions within the same roadmap already checked
console.log(faults? `\n${faults} FAULTS` : "\n0 structural faults");
