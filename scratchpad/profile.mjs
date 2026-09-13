import { registry, loadRoadmap } from "/home/paya/thcpp/PHP/Roadmaps/tests/_load.mjs";
const FILES=["rust-fastapi.js","interp-go.js","bedrock.js","raylib.js"];
for (const f of FILES) await loadRoadmap(f);
const rms=FILES.map(f=>registry.getRoadmap(f.replace(".js","")));
const OLD={ "rust-fastapi":{req:5850,end:"2027-06-09",w:40}, "interp-go":{req:5605,end:"2027-02-04",w:22},
            "bedrock":{req:5080,end:"2027-04-15",w:32}, "raylib":{req:2765,end:"2027-01-08",w:19} };
const req=d=>d.tasks.reduce((s,t)=>s+(t.optional?0:t.est),0);
const opt=d=>d.tasks.reduce((s,t)=>s+(t.optional?t.est:0),0);
console.log("roadmap        days  weeks  required      optional  first        last        (was)");
for(const rm of rms){
  const R=rm.days.reduce((s,d)=>s+req(d),0), O=rm.days.reduce((s,d)=>s+opt(d),0);
  const o=OLD[rm.slug];
  console.log(`${rm.slug.padEnd(14)} ${String(rm.days.length).padStart(4)} ${String(rm.weeks.length).padStart(6)}  ${(R/60).toFixed(1).padStart(6)}h        ${(O/60).toFixed(1).padStart(4)}h  ${rm.days[0].date}  ${rm.days.slice(-1)[0].date}  (${o.end}, ${o.w}w)`);
}
const m=new Map();
for(const rm of rms) for(const d of rm.days) m.set(d.date,(m.get(d.date)||0)+req(d));
const dates=[...m.keys()].sort(), vals=dates.map(d=>m.get(d));
const tot=vals.reduce((a,c)=>a+c,0);
const span=(new Date(dates.at(-1)+"T12:00:00Z")-new Date(dates[0]+"T12:00:00Z"))/86400000+1;
console.log(`\nCOMBINED: ${(tot/60).toFixed(0)}h over ${dates.length} active dates in a ${span}-day span (${dates[0]} .. ${dates.at(-1)})`);
console.log(`  avg/active-day ${(tot/dates.length/60).toFixed(2)}h   avg/calendar-day ${(tot/span/60).toFixed(2)}h   empty dates ${span-dates.length}`);
const b={}; for(const v of vals){const k=Math.floor(v/60); b[k]=(b[k]||0)+1;}
console.log("  histogram: "+Object.keys(b).sort((x,y)=>x-y).map(k=>`${k}-${+k+1}h:${b[k]}`).join("  "));
console.log(`  days >6h: ${vals.filter(v=>v>360).length}   >7h: ${vals.filter(v=>v>420).length}`);
