// _fixture-side.js — a tiny SIDE-track roadmap (kind:"side") used only by the
// test suite to verify that side progress/effort stays split from the main track
// (registry accessors, activityByDate(kind), tasksDoneOn(date,kind), and the
// Today/effort UI). Not registered in _index.js, so it never reaches the app.

import { registerRoadmap } from "../assets/js/registry.js";

registerRoadmap({
  slug: "fixture-side",
  title: "Side Test Fixture",
  icon: "🧱",
  kind: "side",
  subtitle: "Side-track fixture — remove before shipping.",
  accent: "#8b5cf6",
  schemaVersion: 1,

  objectives: [
    { id: "net", title: "Networking", tier: "primary", weight: 1 },
  ],

  weeks: [
    { id: "w1", title: "Week 1", start: "2026-07-13" },
  ],

  days: [
    {
      id: "d01", date: "2026-07-13", week: "w1", title: "Sockets",
      tasks: [
        { id: "t1", obj: "net", cat: "read", est: 50, label: "Read about sockets." },
      ],
    },
    {
      id: "d02", date: "2026-07-15", week: "w1", title: "TCP",
      tasks: [
        { id: "t1", obj: "net", cat: "read", est: 30, label: "Read about TCP." },
        { id: "b1", obj: "net", cat: "challenge", est: 20, optional: true, label: "<b>Bonus:</b> packet capture." },
      ],
    },
  ],
});
