// registry.js — collect hand-authored roadmap modules, normalize them into the
// canonical shape the render/stats/move engines consume, and validate them.
//
// A content module calls registerRoadmap({...}). Local ids in content (task "t1",
// soft "s1", milestone "m1") are namespaced to stable full ids (day "d03" → task
// "d03.t1") here, so authors never repeat the day prefix and milestones/moves can
// reference tasks by full id.

import { parseDate, fmtDate, isoWeekKey, monthKey, monthLabel, DOW, MONTHS } from "./util.js";

const _roadmaps = [];        // in registration order (sidebar order)
const _bySlug = new Map();
const _errors = [];

// `kind` splits roadmaps into two tracks that never sum into each other's stats:
//   "main" — the focused subject roadmaps (default)
//   "side" — the ongoing "Bedrock" self-improvement track (its own progress/effort)
// getRoadmaps() with no arg returns every roadmap (registration order); pass a
// kind to filter, or use the explicit main/side helpers.
export const getRoadmaps = kind => kind ? _roadmaps.filter(r => r.kind === kind) : _roadmaps.slice();
export const getMainRoadmaps = () => _roadmaps.filter(r => r.kind !== "side");
export const getSideRoadmaps = () => _roadmaps.filter(r => r.kind === "side");
export const getRoadmap = slug => _bySlug.get(slug) || null;
export const registryErrors = () => _errors.slice();

export function registerRoadmap(def) {
  try {
    const rm = normalize(def);
    if (_bySlug.has(rm.slug)) throw new Error(`duplicate roadmap slug "${rm.slug}"`);
    _bySlug.set(rm.slug, rm);
    _roadmaps.push(rm);
  } catch (e) {
    _errors.push(`[${def && def.slug || "?"}] ${e.message}`);
  }
}

/* ------------------------------------------------------------------ *
 *  Normalization
 * ------------------------------------------------------------------ */
function normalize(def) {
  if (!def || typeof def !== "object") throw new Error("roadmap definition must be an object");
  const slug = def.slug;
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(slug || "")) throw new Error(`invalid slug "${slug}"`);

  const objectives = (def.objectives || []).map(o => ({
    id: o.id, title: o.title || o.id,
    tier: o.tier === "secondary" ? "secondary" : "primary",
    weight: Number.isFinite(o.weight) ? o.weight : 1,
    color: o.color || null,
  }));
  const objById = new Map(objectives.map(o => [o.id, o]));

  const daysById = new Map();
  const tasksById = new Map();          // full id → PARENT task (whether it has subs or not)
  const softById = new Map();
  // LEAVES are the atomic unit of progress/effort. A task with a `sub:[]` list
  // contributes one leaf per sub-task; a task WITHOUT one is its own single leaf.
  // Done-state, done_at stamps, est and every count roll up from leaves, never
  // from parents (a parent's state is DERIVED — all/some/none of its subs done).
  const leavesById = new Map();         // full leaf id → leaf (sub OR self-leaf task)
  const leaves = [];
  const cardsOf = c => Array.isArray(c)
    ? c.map(x => ({ q: String(x && x.q || ""), a: String(x && x.a || "") })).filter(x => x.q && x.a)
    : null;
  const days = (def.days || []).map(d => {
    const day = {
      id: d.id, date: d.date,
      dow: d.dow || (d.date ? DOW[parseDate(d.date).getDay()] : ""),
      week: d.week || (d.date ? isoWeekKey(d.date) : null),
      month: d.date ? monthKey(d.date) : null,
      title: d.title || "", theme: d.theme || "", note: d.note || "",
      tasks: [], soft: [], off: !!d.off,
    };
    (d.tasks || []).forEach((t, i) => {
      const fid = `${day.id}.${t.id}`;
      const task = {
        id: fid, localId: t.id, day: day.id, week: day.week, month: day.month, date: day.date,
        obj: t.obj, cat: t.cat || "read", est: Number.isFinite(t.est) ? t.est : 0,
        // Rich, scannable task body (optional): a `lead` headline, a `refs` list of
        // reading/do items, and a `model` takeaway. When present the renderer lays
        // them out as distinct blocks; `label` (plain fallback = lead) is what the
        // move picker / effort log show as text, so legacy consumers keep working.
        lead: t.lead || null,
        refs: Array.isArray(t.refs) ? t.refs.map(String).filter(Boolean) : null,
        model: t.model || null,
        // Recall cards: short question/answer prompts distilled from this task's
        // own material. They stay HIDDEN until the task is fully done, turning a
        // completed task into a spaced-recall deck (reinforced on the Today view).
        cards: cardsOf(t.cards),
        // Optional deeper explanation (HTML): surfaced behind a small ⓘ affordance
        // next to the label, opened in a modal. For concepts/jargon a one-liner
        // can't carry — never required, never counts toward progress.
        info: t.info || null,
        label: t.label || t.lead || "", optional: !!t.optional,
        fallback: t.fallback ? { est: t.fallback.est || 0, label: t.fallback.label || "" } : null,
        group: t.group || null, link: t.link || null, preread: !!t.preread,
        phase: t.phase || null,       // carried so phase-scoped milestones can resolve
        // Authored carry-over: the id of the EARLIER day this task belongs with. The
        // plan passes a task on to the roadmap's next day when a date would pass the
        // daily cap, and the card shows where it came from. Content-only — unlike a
        // user move (store `move:` cell) it changes no dates and no on-time judgement.
        carried: typeof t.carried === "string" ? t.carried : null,
        order: i,
        subs: null,                   // filled below when the task is broken into sub-tasks
      };
      // Sub-tasks: the parent's work split into individually-tickable parts. Each
      // sub is a LEAF (own id `d03.t2.s1`, own est/label/cat, optional own note &
      // cards); it inherits the parent's objective and optional flag. The parent's
      // est is DERIVED as the sum of its subs so per-day load stays truthful.
      const rawSubs = Array.isArray(t.sub) ? t.sub.filter(Boolean) : null;
      if (rawSubs && rawSubs.length) {
        task.subs = rawSubs.map((s, k) => {
          const sid = `${fid}.${s.id}`;
          const sub = {
            id: sid, localId: s.id, parent: fid, isSub: true,
            day: day.id, week: day.week, month: day.month, date: day.date,
            obj: t.obj, cat: s.cat || task.cat,
            est: Number.isFinite(s.est) ? s.est : 0,
            lead: s.lead || null,
            refs: Array.isArray(s.refs) ? s.refs.map(String).filter(Boolean) : null,
            note: s.note || null, model: s.model || null,
            info: s.info || null,
            cards: cardsOf(s.cards),
            label: s.label || s.lead || "", optional: !!t.optional,
            order: k,
          };
          leavesById.set(sid, sub); leaves.push(sub);
          return sub;
        });
        task.est = task.subs.reduce((sum, s) => sum + s.est, 0);
      } else {
        // No explicit breakdown → the task is its own single leaf (unchanged shape).
        leavesById.set(fid, task); leaves.push(task);
      }
      day.tasks.push(task); tasksById.set(fid, task);
    });
    (d.soft || []).forEach(s => {
      const fid = `${day.id}.${s.id}`;
      const soft = { id: fid, localId: s.id, day: day.id, week: day.week,
        type: s.type || "hint", label: s.label || "", cat: s.cat || null,
        tickable: s.type === "tryout" || s.type === "suggestion" };
      day.soft.push(soft); softById.set(fid, soft);
    });
    daysById.set(day.id, day);
    return day;
  });

  // nextDate: each day's chronologically-next card date (null for the last one).
  // It's the exclusive ceiling for a day-card MOVE — the free calendar gap a card
  // may be postponed into is (date, nextDate). Static (content-derived), so the
  // move validity gate never depends on another card's own override.
  // A real comparator (0 on ties): sort is stable, so two cards sharing a date keep
  // their authored order instead of an engine-dependent one.
  const byStr = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
  const chrono = [...days].sort((a, b) => byStr(a.date || "", b.date || ""));
  chrono.forEach((d, i) => { d.nextDate = chrono[i + 1] ? chrono[i + 1].date : null; });

  // weeks: explicit list wins; else derive from the days' week ids.
  const weeksById = new Map();
  (def.weeks || []).forEach((w, i) => weeksById.set(w.id, {
    id: w.id, title: w.title || `Week ${i + 1}`, start: w.start || null, order: i,
  }));
  days.forEach(d => {
    if (d.week && !weeksById.has(d.week)) {
      // start is filled below from the week's EARLIEST day (weekFirstDate), not this
      // first-seen one, so out-of-order authoring can't skew the week's start/end.
      weeksById.set(d.week, { id: d.week, title: d.week, start: null, order: weeksById.size });
    }
  });
  // order weeks by their earliest day date
  const weekFirstDate = new Map();
  days.forEach(d => { if (d.week) {
    const cur = weekFirstDate.get(d.week);
    if (!cur || d.date < cur) weekFirstDate.set(d.week, d.date);
  }});
  const weeks = [...weeksById.values()].sort((a, b) =>
    byStr(weekFirstDate.get(a.id) || a.start || "", weekFirstDate.get(b.id) || b.start || ""));
  weeks.forEach((w, i) => { w.index = i; w.start = w.start || weekFirstDate.get(w.id) || null; });

  // months derived
  const monthSet = new Map();
  days.forEach(d => { if (d.month && !monthSet.has(d.month)) monthSet.set(d.month, monthLabel(d.date)); });

  // Source library (optional, DESIGN §7.6): the books, papers and docs a roadmap reads
  // from, described ONCE — full title, author, edition, whether it is free, and where to
  // get it. A leaf is tied to a source by `match`: any of these strings appearing in the
  // leaf's own text (a URL fragment, or a distinctive title for an offline book). That
  // keeps the tie correct when the planner re-flows tasks onto different cards, and
  // means no per-task bookkeeping to drift out of date.
  const library = (def.library || []).map(x => ({
    id: x.id, title: x.title || x.id, by: x.by || "", edition: x.edition || "",
    kind: x.kind || "book", free: !!x.free, url: x.url || null, get: x.get || "",
    // filter BEFORE String(): a missing `match` would otherwise stringify to the literal
    // "undefined" and then match any task whose text mentions undefined behaviour
    match: (Array.isArray(x.match) ? x.match : [x.match]).filter(m => typeof m === "string" && m),
  }));
  const libraryById = new Map(library.map(x => [x.id, x]));

  // Milestones are rendered as a rail/slideshow in ARRAY order, and the slideshow
  // opens on the first not-yet-met one — so the order has to be the calendar's, not
  // the author's. A re-plan re-anchors milestones onto new weeks without reordering
  // the array, which is exactly how "Week 9" ends up sitting before "Week 8". Sort by
  // the week's own chronological index (weeks are already ordered by earliest day);
  // the sort is stable, so same-week milestones keep their authored order, and a
  // milestone with no week sorts last rather than jumping to the front.
  const milestones = (def.milestones || []).map(m => ({
    id: m.id, week: m.week || null, title: m.title || m.id,
    rule: m.rule || { type: "weekPct", min: 80 },
  })).sort((a, b) => {
    const ai = a.week && weeksById.has(a.week) ? weeksById.get(a.week).index : Infinity;
    const bi = b.week && weeksById.has(b.week) ? weeksById.get(b.week).index : Infinity;
    return ai - bi;
  });

  return {
    slug, title: def.title || slug, icon: def.icon || "🗺️",
    kind: def.kind === "side" ? "side" : "main",
    subtitle: def.subtitle || "", accent: def.accent || null,
    schemaVersion: def.schemaVersion || 1,
    cadence: def.cadence || null, aliases: def.aliases || {},
    objectives, objById,
    library, libraryById,
    days, daysById, tasksById, softById,
    leaves, leavesById,
    weeks, weeksById,
    months: [...monthSet.entries()].map(([k, label]) => ({ key: k, label })),
    milestones,
    features: def.features || [],
    categories: def.categories || null,
  };
}

/* ------------------------------------------------------------------ *
 *  Boot validator (DESIGN §7.5) — returns array of human-readable problems.
 * ------------------------------------------------------------------ */
export function validateAll() {
  const problems = [..._errors];
  const slugs = new Set();
  for (const rm of _roadmaps) {
    const P = msg => problems.push(`[${rm.slug}] ${msg}`);
    if (slugs.has(rm.slug)) P(`duplicate slug`);
    slugs.add(rm.slug);

    if (!rm.objectives.length) P(`has no objectives`);
    // source library: ids unique, every entry actually matchable
    const libIds = new Set();
    for (const x of rm.library) {
      if (!x.id || typeof x.id !== "string") P(`library entry has no id`);
      else if (libIds.has(x.id)) P(`duplicate library id "${x.id}"`);
      libIds.add(x.id);
      if (!x.match.length) P(`library entry "${x.id}" has no match strings`);
      if (x.url && !/^https?:\/\//.test(x.url)) P(`library entry "${x.id}" has a non-http url`);
    }
    // these slugs address the global (non-roadmap) views in the router; a roadmap
    // claiming one would be unreachable (the hash always renders the global view).
    if (["today", "insights", "horizon", "bookmarks"].includes(rm.slug)) P(`slug "${rm.slug}" is a reserved route`);
    const localIds = new Set();
    const tasksSeen = new Set();
    const softSeen = new Set();
    // Journey state is a flat KV where bare task ticks share the id namespace with
    // prefixed families (move:/soft:/seen:/flag:/note:/done_at:/daydate:). An
    // authored id beginning with one of these would collide with that family's cell
    // and be misclassified by reconcile.referentOf → a false-positive prune or a
    // missed orphan. Forbid the overlap up front.
    const RESERVED = ["move:", "soft:", "seen:", "flag:", "note:", "done_at:", "daydate:"];
    const reserved = id => RESERVED.some(p => String(id).startsWith(p));
    // Id SHAPES the state layer depends on: reconcile recognises a bare task tick by
    // "d<digits>.<task>", and a dot/colon inside a local id would break the
    // day.task.sub namespacing. A missing id would register as "d01.undefined".
    const LOCAL_ID = /^[A-Za-z0-9_-]+$/;
    const badLocal = id => typeof id !== "string" || !LOCAL_ID.test(id);
    for (const d of rm.days) {
      if (localIds.has(d.id)) P(`duplicate day id "${d.id}"`);
      localIds.add(d.id);
      if (reserved(d.id)) P(`day id "${d.id}" uses a reserved state-key prefix`);
      if (typeof d.id !== "string" || !/^d\d+$/.test(d.id)) P(`day id "${d.id}" must look like "d01"`);
      if (!d.date || !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) P(`day "${d.id}" has invalid date "${d.date}"`);
      else if (fmtDate(parseDate(d.date)) !== d.date) P(`day "${d.id}" date "${d.date}" is not a real calendar date`);
      for (const t of d.tasks) {
        if (tasksSeen.has(t.id)) P(`duplicate task id "${t.id}"`);
        tasksSeen.add(t.id);
        if (reserved(t.localId)) P(`task id "${t.id}" uses a reserved state-key prefix`);
        if (badLocal(t.localId)) P(`task id "${t.id}" must be letters, digits, "_" or "-"`);
        if (t.carried !== null) {
          const from = rm.daysById.get(t.carried);
          if (!from) P(`task "${t.id}" is carried from unknown day "${t.carried}"`);
          else if (!(from.date < d.date)) P(`task "${t.id}" is carried from "${t.carried}", which is not an earlier day`);
        }
        if (!t.obj) P(`task "${t.id}" has no objective`);
        else if (!rm.objById.has(t.obj)) P(`task "${t.id}" references unknown objective "${t.obj}"`);
        // sub-tasks (leaves) must be namespaced under their parent and unique
        if (t.subs) {
          // the bonus track renders optional tasks flat (no sub expansion), so an
          // optional task with sub-tasks could never be completed from the UI.
          if (t.optional) P(`optional task "${t.id}" must not have sub-tasks (the bonus track does not render them)`);
          for (const s of t.subs) {
            if (tasksSeen.has(s.id)) P(`duplicate sub-task id "${s.id}"`);
            tasksSeen.add(s.id);
            if (!s.id.startsWith(t.id + ".")) P(`sub-task "${s.id}" is not namespaced under its parent "${t.id}"`);
            if (badLocal(s.localId)) P(`sub-task id "${s.id}" must be letters, digits, "_" or "-"`);
            if (!s.label && !s.lead) P(`sub-task "${s.id}" has no label`);
          }
        }
      }
      for (const s of d.soft) {
        if (softSeen.has(s.id)) P(`duplicate soft id "${s.id}"`);
        softSeen.add(s.id);
        if (reserved(s.localId)) P(`soft id "${s.id}" uses a reserved state-key prefix`);
        if (badLocal(s.localId)) P(`soft id "${s.id}" must be letters, digits, "_" or "-"`);
      }
    }
    for (const m of rm.milestones) {
      if (m.week && !rm.weeksById.has(m.week)) P(`milestone "${m.id}" references unknown week "${m.week}"`);
      const r = m.rule || {};
      if (r.type === "tasks") for (const id of (r.require || []))
        if (!rm.tasksById.has(id)) P(`milestone "${m.id}" requires unknown task "${id}"`);
      if (r.type === "count") for (const id of (r.from || []))
        if (!rm.tasksById.has(id)) P(`milestone "${m.id}" count set has unknown task "${id}"`);
    }
    for (const o of rm.objectives)
      if (o.tier !== "primary" && o.tier !== "secondary") P(`objective "${o.id}" has invalid tier`);
  }
  return problems;
}
