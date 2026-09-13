import { registry, loadRoadmap } from "/home/paya/thcpp/PHP/Roadmaps/tests/_load.mjs";
const FILES=["rust-fastapi.js","interp-go.js","bedrock.js","raylib.js"];
for (const f of FILES) await loadRoadmap(f);
const rms=Object.fromEntries(FILES.map(f=>[f.replace(".js",""),registry.getRoadmap(f.replace(".js",""))]));
const req=d=>d.tasks.reduce((s,t)=>s+(t.optional?0:t.est),0);
const iso=dt=>dt.toISOString().slice(0,10);
const addD=(s,n)=>{const d=new Date(s+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return iso(d);};
const DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const rust=rms["rust-fastapi"];
const head=rust.days.filter(d=>+d.week.slice(1)<=7);
const tail=rust.days.filter(d=>+d.week.slice(1)>=8);
const TAIL_START="2026-10-23";   // Friday (authored w8 start)
// baseline load from everything that is NOT rust's tail
const base=new Map();
const add=(dt,m)=>base.set(dt,(base.get(dt)||0)+m);
for (const d of head) add(d.date,req(d));
for (const s of ["interp-go","bedrock","raylib"]) for (const d of rms[s].days) add(d.date,req(d));
function score(pat){
  const m=new Map(base);
  let w=0,i=0,lastDate=null;
  while(i<tail.length){ for(const off of pat){ if(i>=tail.length)break;
      const dt=addD(TAIL_START,w*7+off); m.set(dt,(m.get(dt)||0)+req(tail[i])); lastDate=dt; i++; } w++; }
  const dates=[...m.keys()].sort(); const vals=dates.map(d=>m.get(d));
  const first=dates[0], last=dates[dates.length-1];
  const span=(new Date(last+"T12:00:00Z")-new Date(first+"T12:00:00Z"))/86400000+1;
  const good=vals.filter(v=>v>=150&&v<=270).length;        // 2.5h-4.5h "in band"
  const light=vals.filter(v=>v<90).length;
  const heavy=vals.filter(v=>v>300).length;
  const sd=Math.sqrt(vals.reduce((s,v)=>s+(v-vals.reduce((a,c)=>a+c,0)/vals.length)**2,0)/vals.length);
  return {pat:pat.map(o=>DOW[(new Date(addD(TAIL_START,o)+"T12:00:00Z")).getUTCDay()]).join("/"),
    rustEnd:lastDate, active:dates.length, span, good, light, heavy, sd:Math.round(sd),
    avgAct:(vals.reduce((a,c)=>a+c,0)/dates.length/60).toFixed(2)};
}
const pats=[[0,3,5],[0,2,4],[0,1,3],[0,2,5],[1,3,5],[0,3,4],[0,1,4],[2,4,6],[0,4,5],[1,4,6],[0,1,5],[1,2,4],[0,2,3],[3,5,6],[2,5,6]];
const rows=pats.map(score).sort((a,b)=>b.good-a.good||a.sd-b.sd);
console.log("pattern(weekdays)      rustEnd     active span  inBand light heavy  sd  avg/active");
for(const r of rows) console.log(`${r.pat.padEnd(14)} ${r.rustEnd}  ${String(r.active).padStart(4)} ${String(r.span).padStart(4)}  ${String(r.good).padStart(5)} ${String(r.light).padStart(5)} ${String(r.heavy).padStart(5)} ${String(r.sd).padStart(4)}  ${r.avgAct}h`);
