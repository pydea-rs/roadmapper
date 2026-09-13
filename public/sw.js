// sw.js — Roadmaps service worker.
//
// Goal: make the app installable and fast/available offline WITHOUT changing the
// data model. Journey data still lives only in the auth-gated backend (sync.php)
// and is never cached here — the worker caches the *app shell* (HTML/CSS/JS/icons)
// so the UI launches offline; when there's no network the app boots and simply
// reports the backend is unreachable (its existing offline state).
//
// Served from the web root, so its scope is "/" and it controls the whole app.
// Plain JS (no build step, no external deps) — matches the rest of the codebase.

const VERSION = "v3";   // bump to force every client onto a fresh cache
const CACHE = `roadmaps-${VERSION}`;
const SCOPE = self.registration.scope;              // e.g. https://host/  (or /sub/)
const SHELL = new URL(".", SCOPE).href;             // the app shell (index.php at scope root)

// Precached on install: the shell + stylesheets + icons + the JS entry point.
// The rest of the ES-module graph and the roadmap data files are picked up by
// the stale-while-revalidate handler on the first online load, so a later
// offline visit finds them already cached.
const PRECACHE = [
  ".",
  "manifest.webmanifest",
  "assets/css/theme.css",
  "assets/css/shell.css",
  "assets/css/roadmap.css",
  "assets/css/insights.css",
  "assets/css/atlas.css",
  "assets/css/horizon.css",
  "assets/js/app.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/apple-touch-icon.png",
].map(p => new URL(p, SCOPE).href);

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Best-effort: one unavailable asset must not abort the whole install.
    await Promise.allSettled(PRECACHE.map((u) => cache.add(new Request(u, { cache: "reload" }))));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith("roadmaps-") && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Allow the page to activate a freshly-installed worker immediately.
self.addEventListener("message", (e) => { if (e.data === "skip-waiting") self.skipWaiting(); });

// The auth-gated backend and the private app dir must ALWAYS hit the network and
// are never cached (responses are per-user + must not go stale).
function isBypassed(url) {
  return /(?:^|\/)(?:sync|api)\.php$/.test(url.pathname) || url.pathname.includes("/roadmapper");
}

// Fail CLOSED: only genuinely-static asset types are ever stored. Anything else —
// crucially, any dynamic endpoint added later (e.g. a future export.php reached by
// GET) — falls through to the network untouched, so a per-user response can never
// be served stale from cache. Extension is read from the pathname, so a query
// string (?v=2) never changes the verdict.
const STATIC_RE = /\.(?:js|mjs|css|png|svg|webp|gif|ico|json|webmanifest|woff2?|ttf|otf|html?)$/i;
function isCacheable(url) { return STATIC_RE.test(url.pathname); }

// The app shell entry: the scope root itself or its index.php. Only a navigation to
// one of THESE may overwrite the cached shell — opening, say, a raw .js or the
// manifest in a tab is also a "navigation", and must never replace the offline app.
function isShellUrl(url) {
  const root = new URL(SCOPE).pathname;
  return url.pathname === root || url.pathname === root + "index.php";
}

// How long a static request waits on the network before the cached copy answers
// (a slow/lossy connection must not hang the launch; offline falls back at once).
const NET_TIMEOUT_MS = 4000;

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                       // writes go straight to the network
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // never touch cross-origin
  if (isBypassed(url)) return;                            // sync.php / api.php → network only

  // Page loads: network-first, falling back to the cached shell when offline.
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const html = ((net && net.headers && net.headers.get && net.headers.get("content-type")) || "").includes("text/html");
        if (net && net.ok && html && isShellUrl(url)) (await caches.open(CACHE)).put(SHELL, net.clone());
        return net;
      } catch {
        return (await caches.match(SHELL)) || (await caches.match(req)) || Response.error();
      }
    })());
    return;
  }

  // Static assets (css / js modules / icons / roadmap content): NETWORK-FIRST with a
  // short timeout, falling back to the cache. Stale-while-revalidate was wrong here:
  // right after a deploy it served last version's modules (the new code only showed
  // on the launch AFTER next), and could mix old and new ES modules in one page.
  // `cache: "no-cache"` makes the browser revalidate with the server (a cheap 304)
  // instead of trusting its own heuristic HTTP cache for days.
  // Unknown/dynamic GETs are not cached — pass them straight to the network.
  if (!isCacheable(url)) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const network = fetch(req, { cache: "no-cache" }).then((res) => {
      if (res && res.ok && res.type === "basic") cache.put(req, res.clone());
      return res;
    });
    network.catch(() => {});                                 // may lose the race; never an unhandled rejection
    let timer;
    const timeout = new Promise((resolve) => { timer = setTimeout(resolve, NET_TIMEOUT_MS, null); });
    try {
      const first = await Promise.race([network, timeout]);
      if (first) return first;                               // network answered in time
      const hit = await cache.match(req);                    // slow network: cached copy if any…
      return hit || (await network);                         // …else keep waiting on the network
    } catch {
      return (await cache.match(req)) || Response.error();   // offline
    } finally {
      clearTimeout(timer);
    }
  })());
});
