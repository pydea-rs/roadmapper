// store.test.mjs — the journey state layer: ticks + done_at stamping, moves,
// soft ticks, flags, notes, absence-as-default, the write-through sink, and the
// server round-trip (toFlatMap ↔ hydrateFromServer).
import { suite } from "./_harness.mjs";
import { store } from "./_load.mjs";

const t = suite("store");
const S = "demo";
store.resetAll();

t.group("task tick stamps done_at; untick clears it");
t.eq(store.isDone(S, "d01.t1"), false, "absent tick → not done (default)");
t.eq(store.doneAt(S, "d01.t1"), null, "absent tick → no done_at");
store.setTask(S, "d01.t1", true);
t.eq(store.isDone(S, "d01.t1"), true, "ticked → done");
const at = store.doneAt(S, "d01.t1");
t.ok(typeof at === "string" && !isNaN(new Date(at).getTime()), "done_at is a parseable ISO string");
store.setTask(S, "d01.t1", false);
t.eq(store.isDone(S, "d01.t1"), false, "unticked → not done");
t.eq(store.doneAt(S, "d01.t1"), null, "unticked → done_at cleared (no orphan stamp)");

t.group("moves: destination id, back-to-origin clears");
t.eq(store.getMove(S, "d01.t2"), null, "absent move → null (on origin)");
store.setMove(S, "d01.t2", "d05");
t.eq(store.getMove(S, "d01.t2"), "d05", "moved to d05");
store.setMove(S, "d01.t2", null);
t.eq(store.getMove(S, "d01.t2"), null, "back to origin clears the row");

t.group("soft ticks");
t.eq(store.isSoftDone(S, "d01.s2"), false, "absent soft → not done");
store.setSoft(S, "d01.s2", true);
t.eq(store.isSoftDone(S, "d01.s2"), true, "soft ticked");
store.setSoft(S, "d01.s2", false);
t.eq(store.isSoftDone(S, "d01.s2"), false, "soft unticked");

t.group("flags");
t.eq(store.hasFlag(S, "d01.t1", "missed"), false, "absent flag → false");
store.setFlag(S, "d01.t1", "missed", true);
t.eq(store.hasFlag(S, "d01.t1", "missed"), true, "flag set");
store.setFlag(S, "d01.t1", "missed", false);
t.eq(store.hasFlag(S, "d01.t1", "missed"), false, "flag cleared");

t.group("notes: trim, and empty clears");
t.eq(store.getNote(S, "d01"), "", "absent note → empty string");
store.setNote(S, "d01", "blocker: env broke");
t.eq(store.getNote(S, "d01"), "blocker: env broke", "note stored");
store.setNote(S, "d01", "   ");
t.eq(store.getNote(S, "d01"), "", "whitespace-only note clears");

t.group("write-through sink receives each delta");
const seen = [];
store.setSink((slug, change) => seen.push({ slug, ...change }));
store.setTask(S, "d02.t1", true);
const tickChange = seen.find(c => c.id === "d02.t1");
const stampChange = seen.find(c => c.id === "done_at:d02.t1");
t.ok(tickChange && tickChange.kind === "task" && tickChange.value === "true", "sink got the task tick");
t.ok(stampChange && stampChange.kind === "meta" && typeof stampChange.value === "string", "sink got the done_at meta");
seen.length = 0;
store.setTask(S, "d02.t1", false);
t.ok(seen.some(c => c.id === "d02.t1" && c.value === null), "untick pushes a null (row delete)");
t.ok(seen.some(c => c.id === "done_at:d02.t1" && c.value === null), "untick clears the stamp too");
store.setSink(null);

t.group("server round-trip: toFlatMap ↔ hydrateFromServer (SEP-keyed)");
store.resetAll();
store.setTask(S, "d03.t1", true);
store.setMove(S, "d03.t2", "d04");
store.setNote(S, "d03", "kept across reload");
const flat = store.toFlatMap();
const keys = Object.keys(flat);
t.ok(keys.some(k => k.includes("\x01")), "flat map keys use the \\x01 separator (matches server KEY_SEP)");
t.ok(keys.some(k => k === `${S}\x01d03.t1`), "task key is slug\\x01item");
store.resetAll();
t.eq(store.isDone(S, "d03.t1"), false, "reset cleared state");
store.hydrateFromServer(flat);
t.eq(store.isDone(S, "d03.t1"), true, "tick restored after hydrate");
t.eq(store.getMove(S, "d03.t2"), "d04", "move restored after hydrate");
t.eq(store.getNote(S, "d03"), "kept across reload", "note restored after hydrate");

t.group("per-roadmap isolation");
store.resetAll();
store.setTask("aaa", "d01.t1", true);
t.eq(store.isDone("bbb", "d01.t1"), false, "same item id in another roadmap is independent");

t.done();
