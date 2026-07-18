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
  const tasksById = new Map();          // full id → task
  const softById = new Map();
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
        // own material. They stay HIDDEN until the task is ticked done, turning a
        // completed task into a spaced-recall deck (reinforced on the Today view).
        cards: Array.isArray(t.cards)
          ? t.cards.map(c => ({ q: String(c && c.q || ""), a: String(c && c.a || "") }))
                   .filter(c => c.q && c.a)
          : null,
        label: t.label || t.lead || "", optional: !!t.optional,
        fallback: t.fallback ? { est: t.fallback.est || 0, label: t.fallback.label || "" } : null,
        group: t.group || null, link: t.link || null, preread: !!t.preread,
        phase: t.phase || null,       // carried so phase-scoped milestones can resolve
        order: i,
      };
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

  // weeks: explicit list wins; else derive from the days' week ids.
  const weeksById = new Map();
  (def.weeks || []).forEach((w, i) => weeksById.set(w.id, {
    id: w.id, title: w.title || `Week ${i + 1}`, start: w.start || null, order: i,
  }));
  days.forEach(d => {
    if (d.week && !weeksById.has(d.week)) {
      weeksById.set(d.week, { id: d.week, title: d.week, start: d.date, order: weeksById.size });
    }
  });
  // order weeks by their earliest day date
  const weekFirstDate = new Map();
  days.forEach(d => { if (d.week) {
    const cur = weekFirstDate.get(d.week);
    if (!cur || d.date < cur) weekFirstDate.set(d.week, d.date);
  }});
  const weeks = [...weeksById.values()].sort((a, b) =>
    (weekFirstDate.get(a.id) || a.start || "") < (weekFirstDate.get(b.id) || b.start || "") ? -1 : 1);
  weeks.forEach((w, i) => { w.index = i; w.start = w.start || weekFirstDate.get(w.id) || null; });

  // months derived
  const monthSet = new Map();
  days.forEach(d => { if (d.month && !monthSet.has(d.month)) monthSet.set(d.month, monthLabel(d.date)); });

  const milestones = (def.milestones || []).map(m => ({
    id: m.id, week: m.week || null, title: m.title || m.id,
    rule: m.rule || { type: "weekPct", min: 80 },
  }));

  return {
    slug, title: def.title || slug, icon: def.icon || "🗺️",
    kind: def.kind === "side" ? "side" : "main",
    subtitle: def.subtitle || "", accent: def.accent || null,
    schemaVersion: def.schemaVersion || 1,
    cadence: def.cadence || null, aliases: def.aliases || {},
    objectives, objById,
    days, daysById, tasksById, softById,
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
    const localIds = new Set();
    const tasksSeen = new Set();
    const softSeen = new Set();
    for (const d of rm.days) {
      if (localIds.has(d.id)) P(`duplicate day id "${d.id}"`);
      localIds.add(d.id);
      if (!d.date || !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) P(`day "${d.id}" has invalid date "${d.date}"`);
      else if (fmtDate(parseDate(d.date)) !== d.date) P(`day "${d.id}" date "${d.date}" is not a real calendar date`);
      for (const t of d.tasks) {
        if (tasksSeen.has(t.id)) P(`duplicate task id "${t.id}"`);
        tasksSeen.add(t.id);
        if (!t.obj) P(`task "${t.id}" has no objective`);
        else if (!rm.objById.has(t.obj)) P(`task "${t.id}" references unknown objective "${t.obj}"`);
      }
      for (const s of d.soft) {
        if (softSeen.has(s.id)) P(`duplicate soft id "${s.id}"`);
        softSeen.add(s.id);
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
