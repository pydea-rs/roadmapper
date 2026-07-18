// tutorials.test.mjs — the sidebar "companion tutorials" launcher. A DOM smoke
// test under jsdom: the button opens a popup with exactly the three sibling
// links, they open safely in a new tab, and the payaina↔github setting swaps
// every URL. Skips cleanly if jsdom isn't installed (same as render.test).
import { suite } from "./_harness.mjs";

const t = suite("tutorials");

let JSDOM;
try { ({ JSDOM } = await import("jsdom")); }
catch { t.skip("jsdom not installed (run: npm --prefix tests install)"); }

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="app" data-sidebar="expanded" data-mobile="closed">
    <aside id="sidebar"><nav id="sb-list"></nav>
      <div class="sb-foot">
        <span id="sync-pill" class="sync-pill local"><i></i><span id="sync-pill-text">Local only</span></span>
        <button id="tut-launch" class="sb-tut" aria-haspopup="true" aria-expanded="false"></button>
      </div>
    </aside>
  </div>
</body></html>`, { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.requestAnimationFrame = fn => setTimeout(fn, 0);

const base = new URL("../public/assets/js/", import.meta.url);
const ui = await import(new URL("ui.js", base).href);

ui.loadSettings();                      // defaults: tutorials = "payaina"
ui.initTutorials();
const btn = document.getElementById("tut-launch");

// Always yield a FRESH popup, driving the launcher only through its button so its
// internal open/closed state never desyncs. close() removes the old node async
// (a timer that never fires in a sync test), so read the newest .tut-pop.
const openFresh = () => {
  if (btn.getAttribute("aria-expanded") === "true") btn.click();   // close first
  btn.click();                                                     // open fresh
  return [...document.querySelectorAll(".tut-pop")].at(-1);
};

t.group("payaina (default) links");
let pop = openFresh();
t.ok(pop, "clicking the launcher opens a popup");
t.eq(btn.getAttribute("aria-expanded"), "true", "button reports expanded");
let items = [...pop.querySelectorAll("a.tut-item")];
t.eq(items.length, 3, "exactly three companion links");
t.ok(items.every(a => a.target === "_blank"), "every link opens in a new tab");
t.ok(items.every(a => (a.rel || "").includes("noopener")), "every link is rel=noopener (safe target=_blank)");
const payaina = items.map(a => a.getAttribute("href"));
t.deep(payaina,
  ["https://b4am.payaina.top", "https://frog.payaina.top", "https://ddai.payaina.top"],
  "payaina URLs, in order (backend, front, ai)");

t.group("toggle closes");
btn.click();                            // second click toggles closed
t.eq(btn.getAttribute("aria-expanded"), "false", "second click collapses the launcher");

t.group("github setting swaps every URL");
ui.setSetting("tutorials", "github");
const github = [...openFresh().querySelectorAll("a.tut-item")].map(a => a.getAttribute("href"));
t.deep(github,
  ["https://pa-ya.github.io/framework-review",
   "https://pa-ya.github.io/frontframes-gui/",
   "https://pa-ya.github.io/deep-dive-ai/"],
  "github URLs, in order (backend, front, ai)");
t.ok(github.every((u, i) => u !== payaina[i]), "every link actually changed host");

t.group("labels are present for narrow layouts");
ui.setSetting("tutorials", "payaina");
pop = openFresh();
t.ok(pop.querySelector(".tut-label") && pop.querySelector(".tut-short"),
  "each item carries both a full label and a short fallback label");

t.done();
