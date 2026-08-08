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

t.group("index.php — links the manifest, theme colour, and Apple bits");
const html = read("index.php");
t.ok(/<link[^>]+rel=["']manifest["'][^>]+href=["']manifest\.webmanifest["']/.test(html),
  "links the web app manifest");
t.ok(/<meta[^>]+name=["']theme-color["']/.test(html), "sets a theme-color meta");
t.ok(/apple-mobile-web-app-capable/.test(html) || /mobile-web-app-capable/.test(html),
  "declares web-app-capable for mobile");
t.ok(/<link[^>]+rel=["']apple-touch-icon["'][^>]+apple-touch-icon\.png/.test(html),
  "links the apple-touch-icon");

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

t.done();
