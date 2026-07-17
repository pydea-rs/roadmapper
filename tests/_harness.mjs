// _harness.mjs — a tiny zero-dependency test harness for the pure-logic tests.
//
// Each *.test.mjs file is run as its OWN node process by run.sh, so the store's
// in-memory singleton starts clean per file (no cross-file bleed). A file builds
// one suite, records assertions, and calls .done() which prints a single
// machine-readable summary line that run.sh aggregates:
//
//     ##RESULT file=<name> pass=<P> fail=<F> skip=<S>
//
// Failing assertions print a "✗ …" line above the summary so the runner can show
// them. Keep assertions independent and hand-verifiable.

const fmt = v => {
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "number" || typeof v === "boolean" || v == null) return String(v);
  try { return JSON.stringify(v); } catch { return String(v); }
};

export function suite(name) {
  let pass = 0, fail = 0;
  const fails = [];
  const rec = (cond, msg) => { if (cond) pass++; else { fail++; fails.push(msg); } };

  return {
    name,
    /** truthy assertion */
    ok(cond, msg) { rec(!!cond, msg || "expected truthy"); },
    /** strict equality (===) */
    eq(actual, expected, msg) {
      rec(actual === expected, `${msg || "eq"} — expected ${fmt(expected)}, got ${fmt(actual)}`);
    },
    /** inequality */
    ne(actual, notExpected, msg) {
      rec(actual !== notExpected, `${msg || "ne"} — got the disallowed value ${fmt(actual)}`);
    },
    /** floating-point closeness */
    near(actual, expected, msg, eps = 1e-6) {
      rec(Math.abs(actual - expected) < eps, `${msg || "near"} — expected ≈${fmt(expected)}, got ${fmt(actual)}`);
    },
    /** deep-equal for plain arrays/objects of primitives */
    deep(actual, expected, msg) {
      const a = JSON.stringify(actual), b = JSON.stringify(expected);
      rec(a === b, `${msg || "deep"} — expected ${b}, got ${a}`);
    },
    /** asserts fn throws */
    throws(fn, msg) {
      let threw = false;
      try { fn(); } catch { threw = true; }
      rec(threw, `${msg || "throws"} — expected a throw, none happened`);
    },
    /** a section header in the human output (purely cosmetic) */
    group(title) { console.log(`\n  ▸ ${title}`); },
    counts() { return { pass, fail }; },
    /** print failures + machine summary, exit non-zero on any failure */
    done() {
      if (fails.length) { console.log(""); for (const f of fails) console.log("  ✗ " + f); }
      console.log(`##RESULT file=${name} pass=${pass} fail=${fail} skip=0`);
      process.exit(fail ? 1 : 0);
    },
    /** bail out cleanly (e.g. an optional dependency is missing) */
    skip(reason) {
      console.log(`  ⚠ skipped: ${reason}`);
      console.log(`##RESULT file=${name} pass=${pass} fail=${fail} skip=1`);
      process.exit(0);
    },
  };
}
