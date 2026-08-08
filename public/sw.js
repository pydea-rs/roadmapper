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

const VERSION = "v1";
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
        if (net && net.ok) (await caches.open(CACHE)).put(SHELL, net.clone());
        return net;
      } catch {
        return (await caches.match(SHELL)) || (await caches.match(req)) || Response.error();
      }
    })());
    return;
  }

  // Static assets (css / js modules / icons / roadmap data): stale-while-revalidate.
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    const net = fetch(req).then((res) => {
      if (res && res.ok && res.type === "basic") cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
