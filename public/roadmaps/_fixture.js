// _fixture.js — a tiny hand-written roadmap that exercises every element kind
// (required / bonus+fallback / soft hint / tryout / callout / grouped tasks /
// two objectives incl. a secondary / weekly milestones). Used to verify the
// render + stats + move engines before the real roadmaps exist. Safe to keep;
// remove its import from _index.js once the real roadmaps are in.

import { registerRoadmap } from "../assets/js/registry.js";

registerRoadmap({
  slug: "fixture",
  title: "Engine Test Fixture",
  icon: "🧪",
  subtitle: "Exercises every renderable element — remove before shipping.",
  accent: "#22d3ee",
  schemaVersion: 1,
  cadence: { activeDaysPerWeek: [5, 6] },

  objectives: [
    { id: "core", title: "Core objective", tier: "primary", weight: 1 },
    { id: "side", title: "Secondary goal", tier: "secondary" },
  ],

  weeks: [
    { id: "w1", title: "Week 1 — Basics", start: "2026-07-13" },
    { id: "w2", title: "Week 2 — Depth", start: "2026-07-20" },
  ],

  days: [
    {
      id: "d01", date: "2026-07-13", week: "w1", title: "Kickoff",
      theme: "Warm up and set the baseline.",
      tasks: [
        { id: "t1", obj: "core", cat: "read", est: 30, label: "Read the <b>intro chapter</b> (pp 1–20)." },
        { id: "t2", obj: "core", cat: "code", est: 45, label: "Implement the <code>hello</code> sample.", group: "g1" },
        { id: "t3", obj: "core", cat: "review", est: 15, label: "Review notes from the sample.", group: "g1" },
      ],
      soft: [
        { id: "s1", type: "hint", label: "💡 The intro glosses over ownership — we'll hit it hard next week." },
        { id: "s2", type: "tryout", label: "Tryout: rewrite the sample without looking." },
      ],
    },
    {
      id: "d02", date: "2026-07-14", week: "w1", title: "Today — Core concepts",
      theme: "The day highlighted as today.",
      tasks: [
        { id: "t1", obj: "core", cat: "read", est: 40, label: "Read <b>chapter 2</b> (pp 21–48)." },
        { id: "t2", obj: "core", cat: "exercise", est: 50, label: "Do exercises 2.1–2.6." },
        { id: "b1", obj: "core", cat: "challenge", est: 40, optional: true,
          label: "<b>Bonus:</b> the hard end-of-chapter challenge.",
          fallback: { est: 15, label: "just the first part" } },
      ],
      soft: [
        { id: "s1", type: "callout", label: "🆕 New in the latest edition: a rewritten error-handling section." },
        { id: "s2", type: "suggestion", label: "Suggestion: skim the appendix on tooling." },
      ],
    },
    {
      id: "d03", date: "2026-07-16", week: "w1", title: "Practice day",
      theme: "Consolidate.",
      tasks: [
        { id: "t1", obj: "core", cat: "project", est: 90, label: "Build a mini project combining ch.1–2." },
        { id: "t2", obj: "side", cat: "read", est: 25, label: "Secondary: read side-book pp 1–15." },
      ],
      soft: [{ id: "s1", type: "callout", label: "⚠️ Deprecated API shown in the video — use the new call." }],
    },
    {
      id: "d04", date: "2026-07-20", week: "w2", title: "Depth: internals",
      theme: "Go deeper.",
      tasks: [
        { id: "t1", obj: "core", cat: "read", est: 45, label: "Read <b>chapter 3</b> (pp 49–80)." },
        { id: "t2", obj: "core", cat: "drill", est: 30, label: "Drill the new syntax 10×." },
        { id: "t3", obj: "side", cat: "code", est: 40, label: "Secondary: implement the side exercise." },
      ],
      soft: [{ id: "s1", type: "hint", label: "💡 Watch for the borrow-checker gotcha here." }],
    },
    {
      id: "d05", date: "2026-07-22", week: "w2", title: "Wrap week",
      theme: "Tie it together.",
      tasks: [
        { id: "t1", obj: "core", cat: "review", est: 30, label: "Review the whole week." },
        { id: "b1", obj: "core", cat: "project", est: 60, optional: true, label: "<b>Bonus:</b> extend the mini project." },
      ],
    },
  ],

  milestones: [
    { id: "w1.m1", week: "w1", title: "Ship the mini project", rule: { type: "tasks", require: ["d03.t1"] } },
    { id: "w1.m2", week: "w1", title: "≥ 70% of week 1 (original)", rule: { type: "weekPct", min: 70 } },
    // Rounding-boundary probe: with 6 primary tasks in w1, 4/6 = 66.67% which pct()
    // ROUNDS to 67 — a weekPct milestone at min 67 must judge the EXACT ratio and
    // stay unmet at 4/6, only meeting at 5/6 (83%). Guards the milestone off-by-round.
    { id: "w1.m3", week: "w1", title: "≥ 67% of week 1 (exact, not rounded)", rule: { type: "weekPct", min: 67 } },
    { id: "w2.m1", week: "w2", title: "Finish chapter 3", rule: { type: "tasks", require: ["d04.t1", "d04.t2"] } },
  ],

  features: [
    { title: "After this fixture", items: [
      `Replace it with the real roadmaps in <code>roadmaps/_index.js</code>.`,
      `See <a href="#">DESIGN.md §15</a> for the content plan.`,
    ] },
  ],
});
