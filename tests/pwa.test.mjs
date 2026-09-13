// pwa.test.mjs — the Progressive Web App wiring: manifest, service worker,
// icons, and the HTML/JS that hooks them up. No DOM needed — these read the
// shipped files as text/bytes and assert the contract a browser expects, so a
// stray edit that would silently break "Install app" or offline launch fails CI.
import { readFileSync, existsSync, statSync } from "node:fs";
import { suite } from "./_harness.mjs";

const t = suite("pwa");
const pub = (p) => new URL(`../public/${p}`, import.meta.url);
const read = (p) => readFileSync(pub(p), "utf8");

t.group("manifest — valid, installable, self-consistent");
const rawManifest = read("manifest.webmanifest");
let m = null;
t.ok((() => { try { m = JSON.parse(rawManifest); return true; } catch { return false; } })(),
  "manifest.webmanifest is valid JSON");
t.ok(m && typeof m.name === "string" && m.name.length > 0, "has a name");
t.ok(m && typeof m.short_name === "string" && m.short_name.length <= 12,
  "short_name is set and fits a home-screen label (<= 12 chars)");
t.eq(m && m.display, "standalone", "display is standalone (installs as an app, no browser chrome)");
t.ok(m && typeof m.start_url === "string" && m.start_url.length > 0, "has a start_url");
t.ok(m && typeof m.scope === "string" && m.scope.length > 0, "has a scope");
t.ok(m && /^#[0-9a-fA-F]{6}$/.test(m.theme_color || ""), "theme_color is a hex colour");
t.ok(m && /^#[0-9a-fA-F]{6}$/.test(m.background_color || ""), "background_color is a hex colour");

t.group("manifest icons — the sizes browsers require, and the files exist");
const icons = (m && m.icons) || [];
t.ok(icons.length >= 3, `at least three icon entries (got ${icons.length})`);
t.ok(icons.some((i) => i.sizes === "192x192"), "declares a 192x192 icon (Chrome install minimum)");
t.ok(icons.some((i) => i.sizes === "512x512"), "declares a 512x512 icon (splash + store)");
t.ok(icons.some((i) => (i.purpose || "").split(/\s+/).includes("maskable")),
  "declares a maskable icon (adaptive Android icon)");
t.ok(icons.every((i) => i.type === "image/png"), "every icon is typed image/png");

// PNG signature + IHDR dimensions, straight from the file bytes.
function png(p) {
  const b = readFileSync(pub(p));
  const sig = b.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
  const w = b.readUInt32BE(16), h = b.readUInt32BE(20);   // IHDR width/height
  return { sig, w, h };
}
for (const i of icons) {
  t.ok(existsSync(pub(i.src)), `icon file exists: ${i.src}`);
  const [sw, sh] = i.sizes.split("x").map(Number);
  const info = png(i.src);
  t.ok(info.sig, `${i.src} is a real PNG`);
  t.ok(info.w === sw && info.h === sh, `${i.src} is actually ${i.sizes} (got ${info.w}x${info.h})`);
}
t.ok(existsSync(pub("assets/icons/apple-touch-icon.png")), "apple-touch-icon.png exists (iOS home screen)");
t.ok(png("assets/icons/apple-touch-icon.png").sig, "apple-touch-icon.png is a real PNG");

t.group("service worker — cache, lifecycle, and safe bypass of the backend");
const sw = read("sw.js");
t.ok(/self\.addEventListener\(\s*["']install["']/.test(sw), "handles the install event");
t.ok(/self\.addEventListener\(\s*["']activate["']/.test(sw), "handles the activate event");
t.ok(/self\.addEventListener\(\s*["']fetch["']/.test(sw), "handles the fetch event");
t.ok(/caches\.open\(/.test(sw), "opens a named cache");
t.ok(/skipWaiting\(\)/.test(sw) && /clients\.claim\(\)/.test(sw),
  "takes control promptly (skipWaiting + clients.claim)");
// the crucial safety property: never cache the per-user, auth-gated backend
t.ok(/sync|api/.test(sw) && /isBypassed/.test(sw), "has a bypass path for the backend endpoints");
t.ok(/sync\|api|\(sync\|api\)/.test(sw.replace(/\s+/g, "")) || /sync.*api|api.*sync/.test(sw),
  "the bypass names sync.php and api.php");
t.ok(/method\s*!==?\s*["']GET["']/.test(sw), "non-GET requests (writes) are left to the network");
t.ok(/mode\s*===?\s*["']navigate["']/.test(sw), "page navigations get their own (network-first) path");
// every precached path should point at a file that actually ships
const preList = (sw.match(/"([^"]+\.(?:css|js|png|webmanifest))"/g) || []).map((s) => s.replace(/"/g, ""));
t.ok(preList.length >= 5, `precache references several real assets (found ${preList.length})`);
for (const p of preList) t.ok(existsSync(pub(p)), `precached asset exists: ${p}`);

t.group("service worker — fetch routing actually runs (not just string-matched)");
// Execute sw.js in a sandbox with mocked worker globals, capture its event
// listeners, and dispatch synthetic fetch events to assert real ROUTING behavior:
// which requests get intercepted (respondWith) vs left to the network. This is the
// coverage the string checks above can't give — an inverted bypass or a cache that
// stopped failing-closed would go red here.
const vm = await import("node:vm");
const listeners = {};
const cacheObj = { match: async () => undefined, put: async () => {}, add: async () => {} };
const sandbox = {
  self: {
    location: { origin: "https://host" },
    registration: { scope: "https://host/" },
    addEventListener: (type, fn) => { listeners[type] = fn; },
    skipWaiting: async () => {}, clients: { claim: async () => {} },
  },
  caches: { open: async () => cacheObj, keys: async () => [], match: async () => undefined, delete: async () => true },
  fetch: async () => ({ ok: true, type: "basic", clone() { return this; } }),
  Response: { error: () => ({ error: true }) },
  Request: function (u) { this.url = u; },
  URL, Promise, console, setTimeout,
};
vm.createContext(sandbox);
vm.runInContext(sw, sandbox, { filename: "sw.js" });
t.ok(typeof listeners.install === "function", "registers an install listener (executed, not grepped)");
t.ok(typeof listeners.activate === "function", "registers an activate listener");
t.ok(typeof listeners.fetch === "function", "registers a fetch listener");
t.ok(typeof listeners.message === "function", "registers a message listener");

// dispatch a synthetic fetch event; return whether the worker intercepted it.
function intercepts(url, { method = "GET", mode = "cors" } = {}) {
  let responded = false;
  listeners.fetch({
    request: { method, url, mode },
    respondWith(p) { responded = true; if (p && p.catch) p.catch(() => {}); },
  });
  return responded;
}
// THE safety invariant: the auth-gated backend is never intercepted → always network.
t.ok(!intercepts("https://host/sync.php?action=load"), "GET sync.php is NOT cached (network passthrough)");
t.ok(!intercepts("https://host/sync.php?action=save", { method: "POST" }), "POST sync.php is left to the network");
t.ok(!intercepts("https://host/api.php?action=status"), "GET api.php is NOT cached");
t.ok(!intercepts("https://host/roadmapper/api.php"), "the private /roadmapper path is NOT cached");
// fail-CLOSED: a hypothetical future dynamic endpoint must NOT be silently cached.
t.ok(!intercepts("https://host/export.php"), "an unknown dynamic .php GET is NOT cached (fail-closed)");
t.ok(!intercepts("https://host/data/feed"), "an extensionless dynamic GET is NOT cached (fail-closed)");
// cross-origin and non-GET are never touched.
t.ok(!intercepts("https://other-cdn.example/lib.js"), "cross-origin requests are never intercepted");
t.ok(!intercepts("https://host/assets/js/app.js", { method: "POST" }), "non-GET static requests are not intercepted");
// genuine static assets ARE served through the cache (so offline launch works)…
t.ok(intercepts("https://host/assets/js/registry.js"), "a static JS module is served via the cache");
t.ok(intercepts("https://host/assets/css/theme.css"), "a static stylesheet is served via the cache");
t.ok(intercepts("https://host/assets/icons/icon-192.png"), "a static icon is served via the cache");
t.ok(intercepts("https://host/assets/js/app.js?v=2"), "a query string doesn't defeat static caching");
// …and page navigations take the (network-first) shell path.
t.ok(intercepts("https://host/", { mode: "navigate" }), "a page navigation is handled (network-first shell)");

t.group("service worker — what a fetch actually RETURNS (network-first, shell-only caching)");
// A fresh sandbox per scenario with a controllable network and a recording cache.
async function swScenario({ net, cached = null, timeoutFires = false }) {
  const puts = [];
  const cache = {
    match: async () => cached, add: async () => {},
    put: async (key, res) => { puts.push(typeof key === "string" ? key : key.url); },
  };
  const L = {};
  const box = {
    self: { location: { origin: "https://host" }, registration: { scope: "https://host/app/" },
      addEventListener: (type, fn) => { L[type] = fn; }, skipWaiting: async () => {}, clients: { claim: async () => {} } },
    caches: { open: async () => cache, keys: async () => [], match: async () => cached, delete: async () => true },
    fetch: async (req, opts) => { box.lastFetchOpts = opts; return net(req, opts); },
    Response: { error: () => ({ error: true }) }, Request: function (u) { this.url = u; },
    URL, Promise, console,
    setTimeout: (fn, ms, arg) => { if (timeoutFires) fn(arg); return 1; }, clearTimeout: () => {},
  };
  vm.createContext(box);
  vm.runInContext(sw, box, { filename: "sw.js" });
  const fetchOf = (url, mode = "cors") => new Promise(resolve => {
    L.fetch({ request: { method: "GET", url, mode }, respondWith: p => resolve(p) });
  });
  return { puts, box, fetchOf };
}
const res = (body, type = "text/html") => ({ ok: true, type: "basic", body, headers: { get: () => type }, clone() { return this; } });

{
  const s1 = await swScenario({ net: async () => res("<html>shell</html>") });
  await (await s1.fetchOf("https://host/app/", "navigate"));
  await new Promise(r => setImmediate(r));
  t.ok(s1.puts.includes("https://host/app/"), "navigating to the app root refreshes the cached shell");
  const s2 = await swScenario({ net: async () => res("export const x = 1;", "text/javascript") });
  await (await s2.fetchOf("https://host/app/assets/js/app.js", "navigate"));
  await new Promise(r => setImmediate(r));
  t.ok(!s2.puts.includes("https://host/app/"), "opening a raw .js in a tab never overwrites the offline shell");
  const s3 = await swScenario({ net: async () => res("{}", "application/manifest+json") });
  await (await s3.fetchOf("https://host/app/manifest.webmanifest", "navigate"));
  await new Promise(r => setImmediate(r));
  t.ok(!s3.puts.includes("https://host/app/"), "…nor does opening the manifest");

  const fresh = res("NEW", "text/javascript"), stale = res("OLD", "text/javascript");
  const s4 = await swScenario({ net: async () => fresh, cached: stale });
  const r4 = await (await s4.fetchOf("https://host/app/assets/js/registry.js"));
  t.eq(r4 && r4.body, "NEW", "a static module comes from the NETWORK when it answers (a deploy shows at once)");
  t.eq(s4.box.lastFetchOpts && s4.box.lastFetchOpts.cache, "no-cache", "…revalidated past the browser's heuristic HTTP cache");
  const s5 = await swScenario({ net: () => new Promise(() => {}), cached: stale, timeoutFires: true });
  const r5 = await (await s5.fetchOf("https://host/app/assets/js/registry.js"));
  t.eq(r5 && r5.body, "OLD", "a slow network falls back to the cached copy after the timeout");
  const s6 = await swScenario({ net: async () => { throw new TypeError("offline"); }, cached: stale });
  const r6 = await (await s6.fetchOf("https://host/app/assets/css/theme.css"));
  t.eq(r6 && r6.body, "OLD", "offline: the cached copy is served");
  const s7 = await swScenario({ net: async () => { throw new TypeError("offline"); }, cached: null });
  const r7 = await (await s7.fetchOf("https://host/app/assets/css/theme.css"));
  t.ok(r7 && r7.error, "offline with nothing cached: a network error, not a hang");
}

t.group("index.php — links the manifest, theme colour, and Apple bits");
const html = read("index.php");
t.ok(/<link[^>]+rel=["']manifest["'][^>]+href=["']manifest\.webmanifest["']/.test(html),
  "links the web app manifest");
t.ok(/<meta[^>]+name=["']theme-color["']/.test(html), "sets a theme-color meta");
t.ok(/apple-mobile-web-app-capable/.test(html) || /mobile-web-app-capable/.test(html),
  "declares web-app-capable for mobile");
t.ok(/<link[^>]+rel=["']apple-touch-icon["'][^>]+apple-touch-icon\.png/.test(html),
  "links the apple-touch-icon");
// a stylesheet added to the shell but forgotten in PRECACHE would leave that view unstyled offline
const linkedCss = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g)].map(m => m[1]);
t.ok(linkedCss.length >= 6, `the shell links its stylesheets (${linkedCss.length})`);
for (const css of linkedCss) t.ok(preList.includes(css), `every linked stylesheet is precached for offline: ${css}`);

t.group("app.js — registers the service worker, robustly");
const app = read("assets/js/app.js");
t.ok(/["']serviceWorker["']\s*in\s*navigator/.test(app), "feature-detects serviceWorker before use");
t.ok(/serviceWorker\.register\(/.test(app), "registers the service worker");
t.ok(/sw\.js/.test(app), "registration points at sw.js");

t.group(".htaccess — manifest MIME + non-stale worker");
const ht = read(".htaccess");
t.ok(/AddType\s+application\/manifest\+json\s+\.webmanifest/.test(ht),
  "serves .webmanifest with the correct MIME type");
t.ok(/sw\\?\.js/.test(ht) && /Cache-Control/.test(ht), "sw.js is served with a Cache-Control rule");
t.ok(/FilesMatch\s+"[^"]*js\|mjs\|css[^"]*"[\s\S]*?Cache-Control\s+"no-cache"/.test(ht),
  "app JS/CSS are served no-cache (revalidated) so a deploy never serves stale or mixed modules");
t.ok(ht.indexOf("js|mjs|css") < ht.indexOf("^sw\\.js$"), "…declared BEFORE the sw.js rule, so sw.js keeps its stricter header");

t.group("index.php — a start-up watchdog replaces an endless splash");
const idx = readFileSync(pub("index.php"), "utf8");
t.ok(/__roadmapsBooted/.test(idx) && /location\.reload\(\)/.test(idx), "index.php offers a Reload if the app never boots");
t.ok(/window\.__roadmapsBooted\s*=\s*true/.test(app), "app.js marks itself booted first thing");

t.done();
