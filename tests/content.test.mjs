// content.test.mjs — structural integrity of the REAL roadmaps. This is the net
// under the date-shifting / date-extending work: progress is keyed by structural
// ids (never by date), so these checks confirm the content itself stays ordered,
// unique, and internally consistent after any re-dating.
import { readFileSync } from "node:fs";
import { suite } from "./_harness.mjs";
import { registry, util, reconcile, loadRoadmap } from "./_load.mjs";
import { getInterludes, interludeUrl, interludesAfter } from "../public/assets/js/interludes.js";

const t = suite("content");
await loadRoadmap("rust-fastapi.js");
await loadRoadmap("interp-go.js");
await loadRoadmap("bedrock.js");            // the side-track roadmap
await loadRoadmap("raylib.js");             // the second side-track roadmap ("Big Bang")
const roadmaps = registry.getRoadmaps();

t.group("registry loads cleanly");
t.ok(roadmaps.length >= 4, `all real roadmaps registered (${roadmaps.length})`);
t.deep(registry.registryErrors(), [], "no registry errors");
t.deep(registry.validateAll(), [], "validateAll() reports no problems");

// Start/finish date ANCHORS — the tripwire for date shifts. content.test's other
// date checks are loose (>=) boundaries that a *uniform* whole-roadmap shift always
// still satisfies, so an ASYMMETRIC shift (one roadmap missed, wrong direction, or
// a truncated/extended arc that didn't move its start) would stay green. These
// equality anchors go red on any such mistake. THEY ARE INTENTIONALLY SHIFT-
// SENSITIVE: bump each pair by the same +N as the roadmaps on every uniform date
// shift (exactly like the frozen-now anchors in render.test / insights.test).
t.group("roadmap date anchors (a bad or asymmetric shift must fail here)");
const ANCHORS = {
  "rust-fastapi": { first: "2026-09-13", last: "2027-05-12" },
  "interp-go":    { first: "2026-09-14", last: "2027-02-27" },
  "bedrock":      { first: "2026-09-14", last: "2027-04-24" },
  "raylib":       { first: "2026-09-13", last: "2027-01-18" },
};
for (const [slug, a] of Object.entries(ANCHORS)) {
  const rm = registry.getRoadmap(slug);
  t.ok(!!rm, `${slug} is registered`);
  t.eq(rm.days[0].date, a.first, `${slug} starts on its anchor date ${a.first}`);
  t.eq(rm.days[rm.days.length - 1].date, a.last, `${slug} ends on its anchor date ${a.last}`);
}

t.group("milestones sit where their work is");
for (const rm of roadmaps) {
  const wIdx = id => rm.weeksById.get(id).index;
  for (const m of rm.milestones) {
    const r = m.rule || {};
    if (r.type === "tasks") {
      const latest = Math.max(...(r.require || []).map(id => wIdx(rm.daysById.get(id.split(".")[0]).week)));
      t.ok(latest <= wIdx(m.week), `${rm.slug}/${m.id}: its last required task is in or before its week (a re-week must re-anchor it)`);
    } else if (r.type === "weekPct") {
      const primary = rm.days.filter(d => d.week === m.week).flatMap(d => d.tasks)
        .filter(x => !x.optional && (rm.objById.get(x.obj) || {}).tier !== "secondary");
      t.ok(primary.length > 0, `${rm.slug}/${m.id}: a weekPct milestone's week has primary work to measure`);
    }
  }
}

t.group("authored prose stays true to the data (titles, cross-references, links, markup)");
// Everything a reader sees, gathered per roadmap. These checks caught real rot after
// re-dating passes: truncated week titles, "part 2 is on d24" pointing at the wrong
// day, "tomorrow" on days that are no longer consecutive, http links, unbalanced tags.
const HTTP_OK = ["pmg.csail.mit.edu"];          // hosts verified to have no https endpoint
for (const rm of roadmaps) {
  const texts = [];
  for (const w of rm.weeks) texts.push([`${w.id} title`, w.title, "week"]);
  for (const m of rm.milestones) texts.push([`${m.id} title`, m.title]);
  for (const d of rm.days) {
    for (const k of ["title", "theme", "note"]) if (d[k]) texts.push([`${d.id}.${k}`, d[k]]);
    for (const x of d.tasks) {
      for (const k of ["label", "lead", "model", "info"]) if (x[k]) texts.push([`${x.id}.${k}`, x[k]]);
      for (const ref of x.refs || []) texts.push([`${x.id}.ref`, ref]);
      for (const sb of x.subs || []) for (const k of ["label", "lead", "model", "info", "note"]) if (sb[k]) texts.push([`${sb.id}.${k}`, sb[k]]);
    }
    for (const so of d.soft) texts.push([`${so.id}`, so.label]);
  }
  for (const il of getInterludes(rm.slug)) for (const k of ["title", "note"]) if (il[k]) texts.push([`${il.id}.${k}`, il[k]]);
  const bad = { dayref: [], relday: [], http: [], noopener: [], tags: [], title: [] };
  for (const [where, s, kind] of texts) {
    for (const m of String(s).matchAll(/\bd(\d{2})\b/g)) if (!rm.daysById.has("d" + m[1])) bad.dayref.push(`${where}→d${m[1]}`);
    const rel = /\b(yesterday|tomorrow|tonight|this weekend|next weekend)\b/i.exec(s);
    if (rel) bad.relday.push(`${where}: "${rel[0]}"`);
    for (const m of String(s).matchAll(/href="http:\/\/([^/"]+)[^"]*"/g)) if (!HTTP_OK.includes(m[1])) bad.http.push(`${where}: ${m[1]}`);
    for (const m of String(s).matchAll(/<a\s[^>]*>/g)) if (/target="_blank"/.test(m[0]) && !/rel="[^"]*noopener/.test(m[0])) bad.noopener.push(where);
    for (const tag of ["b", "i", "code", "a", "p", "li", "ul", "ol", "em", "strong"]) {
      const open = (String(s).match(new RegExp(`<${tag}(\\s[^>]*)?>`, "g")) || []).length;
      const close = (String(s).match(new RegExp(`</${tag}>`, "g")) || []).length;
      if (open !== close) bad.tags.push(`${where}: <${tag}> ${open} open / ${close} closed`);
    }
    if (kind === "week" && ((s.match(/\(/g) || []).length !== (s.match(/\)/g) || []).length || /\d–(?!\d)/.test(s) || /\s$/.test(s)))
      bad.title.push(`${where}: "${s}"`);
  }
  t.deep(bad.dayref, [], `${rm.slug}: every "dNN" mentioned in prose is a real day of this roadmap`);
  t.deep(bad.relday, [], `${rm.slug}: no "yesterday/tomorrow/this weekend" — weekdays vary, so name the day (e.g. "next session (d50)")`);
  t.deep(bad.title, [], `${rm.slug}: week titles are complete (balanced brackets, no dangling "90–", no trailing space)`);
  t.deep(bad.http, [], `${rm.slug}: links use https`);
  t.deep(bad.noopener, [], `${rm.slug}: every target=_blank link carries rel="noopener"`);
  t.deep(bad.tags, [], `${rm.slug}: inline HTML tags are balanced`);
  t.ok(rm.leaves.filter(l => !l.optional).every(l => Number.isFinite(l.est) && l.est > 0),
    `${rm.slug}: every required leaf carries a positive estimate (a 0 would vanish from every daily load)`);
}

t.group("between-days interludes are well-formed and anchored to real days");
let interludeTotal = 0;
for (const rm of roadmaps) {
  const list = getInterludes(rm.slug);
  const ids = new Set();
  for (const il of list) {
    interludeTotal++;
    t.ok(!ids.has(il.id), `${rm.slug}/${il.id}: interlude id is unique within the roadmap`);
    ids.add(il.id);
    t.ok(rm.daysById.has(il.afterDay), `${rm.slug}/${il.id}: afterDay "${il.afterDay}" is a real day`);
    t.ok(il.kind === "video" || il.kind === "article", `${rm.slug}/${il.id}: kind is video|article`);
    t.ok(typeof il.title === "string" && il.title.length > 0, `${rm.slug}/${il.id}: has a title`);
    t.ok(typeof il.source === "string" && il.source.length > 0, `${rm.slug}/${il.id}: has a source label`);
    // must link DIRECTLY to a specific resource, not a search-results page
    t.ok(typeof il.url === "string" && /^https:\/\//.test(il.url), `${rm.slug}/${il.id}: has a direct https url`);
    t.ok(!/[?&](q|search_query)=/.test(il.url), `${rm.slug}/${il.id}: url is a specific resource, not a search page`);
    t.eq(interludeUrl(il), il.url, `${rm.slug}/${il.id}: interludeUrl uses the direct url`);
  }
}
t.ok(interludeTotal >= 15, `all four roadmaps carry a spread of interludes (${interludeTotal})`);
// fixtures / any other roadmap without curated interludes must simply yield none
t.deep(getInterludes("does-not-exist"), [], "an unknown slug yields no interludes");

t.group("interludeUrl fallback (no direct url) + interludesAfter lookup");
// Every REAL interlude carries a direct url (asserted above), so the search-page
// fallback only fires for a hypothetical url-less card — but it must still be safe
// and correctly typed: DuckDuckGo for articles, YouTube results for videos.
t.eq(interludeUrl({ kind: "article", query: "b-tree vs lsm tree" }),
  "https://duckduckgo.com/?q=" + encodeURIComponent("b-tree vs lsm tree"),
  "a url-less article falls back to a DuckDuckGo results page");
t.eq(interludeUrl({ kind: "video", query: "raylib shaders intro" }),
  "https://www.youtube.com/results?search_query=" + encodeURIComponent("raylib shaders intro"),
  "a url-less video falls back to a YouTube results page");
t.ok(interludeUrl({ kind: "article", query: "a b/c&d" }).includes(encodeURIComponent("a b/c&d")),
  "the fallback query is URL-encoded (no raw spaces/&/ leaking into the href)");
t.eq(interludeUrl({ query: "no kind here" }),
  "https://www.youtube.com/results?search_query=" + encodeURIComponent("no kind here"),
  "a non-article kind defaults to the YouTube results fallback");
// interludesAfter returns exactly the interludes anchored to one day id.
for (const rm of roadmaps) {
  const list = getInterludes(rm.slug);
  if (!list.length) continue;
  const sample = list[0];
  const after = interludesAfter(rm.slug, sample.afterDay);
  t.ok(after.some(i => i.id === sample.id),
    `${rm.slug}: interludesAfter("${sample.afterDay}") includes the interlude anchored there`);
  t.ok(after.every(i => i.afterDay === sample.afterDay),
    `${rm.slug}: interludesAfter returns only that day's interludes`);
}
t.deep(interludesAfter("rust-fastapi", "d-does-not-exist"), [],
  "interludesAfter yields none for a day with no interlude");
t.deep(interludesAfter("does-not-exist", "d01"), [],
  "interludesAfter yields none for an unknown slug");

t.group("side track wiring");
const bedrock = registry.getRoadmap("bedrock");
t.eq(bedrock.kind, "side", "bedrock is registered on the side track");
t.deep(registry.getSideRoadmaps().map(r => r.slug), ["bedrock", "raylib"], "getSideRoadmaps() sees both side tracks (bedrock, raylib)");
t.ok(registry.getMainRoadmaps().every(r => r.kind !== "side"), "main roadmaps exclude the side track");
// every task's objective is one of the domain threads (no orphan objective)
t.ok(bedrock.days.every(d => d.tasks.every(x => bedrock.objById.has(x.obj))),
  "every bedrock task maps to a domain objective");

// core + two extensions continue the SAME roadmap: Extension I (weeks 13–25)
// adds the Distributed-systems thread; Extension II (weeks 26–29) adds the
// Data-structure & runtime internals thread. Nothing here should re-date the core.
t.ok(bedrock.days.length >= 88, "bedrock has core + both extensions (>= 88 days)");
t.ok(bedrock.objById.has("dist"), "Extension I adds a Distributed-systems objective");
t.ok(bedrock.objById.has("internals"), "Extension II adds a Data-structure & runtime internals objective");
t.ok(bedrock.weeksById.has("w29"), "Extension II reaches week 29");
// Block order by WEEK, not date literals, so a uniform date shift never touches these:
// every day of a later block is dated after every day of the block before it.
const bWeek = d => bedrock.weeksById.get(d.week).index + 1;
const bSpan = (lo, hi) => { const ds = bedrock.days.filter(d => bWeek(d) >= lo && bWeek(d) <= hi).map(d => d.date).sort();
  return { first: ds[0], last: ds[ds.length - 1], n: ds.length }; };
const CORE = bSpan(1, 12), EXT1 = bSpan(13, 25), EXT2 = bSpan(26, 29), EXT3 = bSpan(30, 32);
t.ok(CORE.n && EXT1.n && EXT2.n && EXT3.n, "core (w1–12), Ext I (w13–25), Ext II (w26–29) and Ext III (w30–32) all hold days");
t.ok(EXT1.first > CORE.last, `Extension I starts after the core ends (${EXT1.first} > ${CORE.last})`);
t.ok(EXT2.first > EXT1.last, `Extension II starts after Extension I ends (${EXT2.first} > ${EXT1.last})`);
t.ok(bedrock.days.filter(d => d.tasks.some(x => x.obj === "dist")).every(d => bWeek(d) >= 13), "the Distributed-systems thread only appears from Extension I on");
t.ok(bedrock.days.filter(d => d.tasks.some(x => x.obj === "internals")).every(d => bWeek(d) >= 26), "the internals thread only appears from Extension II on");
t.ok(bedrock.days.flatMap(d => d.tasks).filter(x => x.obj === "internals").length >= 6,
  "the internals thread has its full run of tasks");

// Extension III (weeks 30–32) adds a Compilers & interpreters thread, interleaved
// with language-implementation reviews, plus "Compiler lens" tasks woven into a
// few earlier second-half days.
t.ok(bedrock.days.length >= 97, "Extension III lands (>= 97 days)");
t.ok(bedrock.objById.has("compilers"), "Extension III adds a Compilers & interpreters objective");
t.ok(bedrock.weeksById.has("w32"), "Extension III reaches week 32");
t.ok(EXT3.first > EXT2.last, `Extension III starts after Extension II ends (${EXT3.first} > ${EXT2.last})`);
const compTasks = bedrock.days.flatMap(d => d.tasks).filter(x => x.obj === "compilers");
t.ok(compTasks.length >= 8, "the compilers thread has its full run of tasks (appended + woven)");
// A day's ANCHOR is its first task of its own: work carried over from an earlier day
// (`carried`, placed first so the day stays under the daily cap) never defines the topic.
const anchorOf = d => d.tasks.find(x => !x.carried);
// the woven "Compiler lens" seeds live on EARLIER days as a 2nd task, so they must
// never be a day's anchor (that would perturb the interleaving invariant).
const wovenComp = bedrock.days.filter(d => bWeek(d) < 30 && d.tasks.some(x => x.obj === "compilers"));
t.ok(wovenComp.length >= 2, "compiler concepts are woven into >= 2 earlier second-half days");
t.ok(wovenComp.every(d => anchorOf(d).obj !== "compilers"),
  "woven compiler tasks are additive (never the day's first/anchor task)");

// no two side-days may share a calendar date (the digest/effort views key off date)
const bDates = bedrock.days.map(d => d.date);
t.eq(new Set(bDates).size, bDates.length, "bedrock day dates are unique (no collisions)");

// threads stay INTERLEAVED: consecutive days switch topics, save the one
// deliberate security capstone pair (d37 → d38). Guards the core design rule.
let sameThread = 0;
for (let i = 1; i < bedrock.days.length; i++) {
  const a = anchorOf(bedrock.days[i - 1])?.obj, b = anchorOf(bedrock.days[i])?.obj;
  if (a && a === b) sameThread++;
}
t.ok(sameThread <= 1, `threads interleave — at most the one capstone pair repeats (found ${sameThread})`);

// recall cards: EVERY task carries >= 2 well-formed {q, a} cards (the whole point
// of the recall feature is that no completed task is left without prompts).
const allBedrockTasks = bedrock.days.flatMap(d => d.tasks);
t.ok(allBedrockTasks.every(x => x.cards && x.cards.length >= 2),
  "every bedrock task carries >= 2 recall cards");
t.ok(allBedrockTasks.every(x => x.cards.every(c => c.q && c.a)),
  "every recall card has both a question and an answer");

// milestone task references still resolve (incl. both extensions' milestones)
t.ok(bedrock.milestones.every(m => (m.rule.require || []).every(id => bedrock.tasksById.has(id))),
  "every milestone (core + both extensions) references a real task");

for (const rm of roadmaps) {
  t.group(`${rm.slug} — structure`);

  // days in chronological, non-decreasing date order
  let ordered = true;
  for (let i = 1; i < rm.days.length; i++) if (rm.days[i].date < rm.days[i - 1].date) ordered = false;
  t.ok(ordered, "days are in non-decreasing date order");

  // unique day ids and unique task ids
  const dayIds = rm.days.map(d => d.id);
  t.eq(new Set(dayIds).size, dayIds.length, "day ids are unique");
  const taskIds = rm.days.flatMap(d => d.tasks.map(x => x.id));
  t.eq(new Set(taskIds).size, taskIds.length, "task ids are unique across the roadmap");

  // every task id is namespaced under its day (dNN.xxx) and resolvable
  t.ok(rm.days.every(d => d.tasks.every(x => x.id.startsWith(d.id + "."))),
    "task ids are namespaced under their day");
  t.ok(taskIds.every(id => rm.tasksById.has(id)), "every task resolves in tasksById");

  // each day's date lies within its week's [start, start+6] window
  let dayInWeek = true, weekMissing = false;
  for (const d of rm.days) {
    const w = rm.weeksById.get(d.week);
    if (!w || !w.start) { weekMissing = true; continue; }
    if (d.date < w.start || d.date > util.addDays(w.start, 6)) dayInWeek = false;
  }
  t.ok(!weekMissing, "every day belongs to a week that has a start date");
  t.ok(dayInWeek, "every day's date falls within its week's 7-day window");

  // day.dow matches the actual weekday of day.date
  t.ok(rm.days.every(d => d.dow === util.DOW[util.parseDate(d.date).getDay()]),
    "each day's day-of-week label matches its date");

  // every est is a finite, non-negative number
  t.ok(rm.days.every(d => d.tasks.every(x => Number.isFinite(x.est) && x.est >= 0)),
    "all task estimates are finite and non-negative");

  // every task references a real objective
  t.ok(rm.days.every(d => d.tasks.every(x => rm.objById.has(x.obj))),
    "every task references an existing objective");

  // milestone task references resolve
  let msRefsOk = true;
  for (const m of rm.milestones) {
    const r = m.rule || {};
    for (const id of (r.require || [])) if (!rm.tasksById.has(id)) msRefsOk = false;
    for (const id of (r.from || [])) if (!rm.tasksById.has(id)) msRefsOk = false;
    if (m.week && !rm.weeksById.has(m.week)) msRefsOk = false;
  }
  t.ok(msRefsOk, "all milestone task/week references resolve");

  // reconcile.referentOf round-trips every real task id shape back to that task
  t.ok(taskIds.every(id => {
    const bare = reconcile.referentOf(id);
    const move = reconcile.referentOf("move:" + id);
    const stamp = reconcile.referentOf("done_at:" + id);
    return bare && bare.id === id && move && move.id === id && stamp && stamp.id === id;
  }), "referentOf round-trips bare / move / done_at ids for every task");

  // sub-tasks (leaves): namespaced under their parent, unique, resolvable, and
  // — since done-state lives on leaves — their tick/done_at rows must round-trip
  // through referentOf so reconcile never prunes a live sub-task.
  const subIds = rm.days.flatMap(d => d.tasks.flatMap(x => x.subs ? x.subs.map(s => s.id) : []));
  t.eq(new Set(subIds).size, subIds.length, "sub-task ids are unique across the roadmap");
  t.ok(rm.days.every(d => d.tasks.every(x => !x.subs || x.subs.every(s => s.id.startsWith(x.id + ".")))),
    "sub-task ids are namespaced under their parent");
  t.ok(subIds.every(id => rm.leavesById.has(id)), "every sub-task resolves in leavesById");
  t.ok(rm.days.every(d => d.tasks.every(x => !x.subs || x.est === x.subs.reduce((s, l) => s + l.est, 0))),
    "each parent task's est equals the sum of its sub-tasks (single source of truth)");
  t.ok(rm.days.every(d => d.tasks.every(x => !x.subs || x.subs.every(s =>
      Number.isFinite(s.est) && s.est > 0 && s.label && s.obj === x.obj && s.optional === x.optional))),
    "every sub-task has a positive est + label and inherits its parent's objective/optional flag");
  t.ok(rm.days.every(d => d.tasks.every(x => !(x.optional && x.subs))),
    "no optional task carries sub-tasks (the bonus track can't expand them)");
  t.ok(subIds.every(id => {
    const bare = reconcile.referentOf(id), stamp = reconcile.referentOf("done_at:" + id);
    return bare && bare.id === id && stamp && stamp.id === id;
  }), "referentOf round-trips sub-task tick / done_at ids");
}

t.group("client store SEP matches server KEY_SEP (\\x01)");
const storeSrc = readFileSync(new URL("../public/assets/js/store.js", import.meta.url), "utf8");
const apiSrc = readFileSync(new URL("../roadmapper/api.php", import.meta.url), "utf8");
t.ok(/const SEP\s*=\s*"\\x01"/.test(storeSrc), "store.js SEP = \\x01");
t.ok(/KEY_SEP\s*=\s*"\\x01"/.test(apiSrc), "api.php KEY_SEP = \\x01");

t.group("parent-state checkbox CSS is scoped to the row's OWN box (no sub-task leak)");
// Regression guard: the partial/done checkbox styling MUST use `> .checkbox`.
// A plain descendant selector leaks the tri-state dash / fill onto the sub-task
// checkboxes nested inside a parent (the bug where ticking one sub dashed them all).
const cssSrc = readFileSync(new URL("../public/assets/css/roadmap.css", import.meta.url), "utf8");
t.ok(/\.task\.parent\.partial\s*>\s*\.checkbox/.test(cssSrc),
  "the partial-parent checkbox rule is scoped with `> .checkbox`");
t.ok(!/\.task\.parent\.partial\s+\.checkbox(?![-\w])/.test(cssSrc),
  "no unscoped `.task.parent.partial .checkbox` descendant selector remains");
t.ok(/\.task\.done\s*>\s*\.checkbox/.test(cssSrc),
  "the done checkbox fill/animation is scoped with `> .checkbox`");

t.done();
