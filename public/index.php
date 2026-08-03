<?php
/* index.php — the app shell. All dynamic behaviour is client-side; this file
 * only ships the markup + asset links. Data lives behind sync.php (auth-gated).
 * Served at "/" as the docroot's DirectoryIndex (public/ is the web root). */
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="noindex, nofollow">
  <title>Roadmaps</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🗺️</text></svg>">
  <link rel="stylesheet" href="assets/css/theme.css">
  <link rel="stylesheet" href="assets/css/shell.css">
  <link rel="stylesheet" href="assets/css/roadmap.css">
  <link rel="stylesheet" href="assets/css/insights.css">
  <style>
    /* inline critical: paint the right ground before theme.css resolves, and keep
       agreeing with an explicit theme toggle (data-theme on <html>) afterwards.
       Mirrors theme.css precedence — light default, dark only under OS-dark when
       not forced light, and honoring an explicit data-theme in both directions.
       (Without the data-theme cases this later-in-cascade rule would pin body to
       the OS colour and ignore the in-app Light/Dark toggle.) */
    html,body{margin:0;height:100%;background:#f4f5f8}
    @media (prefers-color-scheme: dark){
      :root:not([data-theme="light"]),:root:not([data-theme="light"]) body{background:#0e1017}
    }
    :root[data-theme="dark"],:root[data-theme="dark"] body{background:#0e1017}
    :root[data-theme="light"],:root[data-theme="light"] body{background:#f4f5f8}
    #app[hidden],#lock[hidden],#boot[hidden]{display:none!important}
    /* Neutral boot splash — shown until auth is known, so an already-authed
       reload never flashes the login box before the dashboard. */
    #boot{position:fixed;inset:0;display:grid;place-items:center;z-index:50}
    #boot .boot-spin{width:34px;height:34px;border-radius:50%;
      border:3px solid rgba(128,128,140,.25);border-top-color:rgba(128,128,140,.85);
      animation:boot-spin .7s linear infinite}
    @media (prefers-reduced-motion:reduce){#boot .boot-spin{animation-duration:1.4s}}
    @keyframes boot-spin{to{transform:rotate(360deg)}}
  </style>
</head>
<body>

<!-- Dev validation banner (hidden unless a roadmap fails validation) -->
<pre id="dev-error"></pre>

<!-- Boot splash: shown until auth status is known (avoids a login-box flash on
     an authenticated reload). boot() hides it once it decides lock vs app. -->
<div id="boot"><span class="boot-spin" aria-hidden="true"></span></div>

<!-- ============ Lock gate ============ -->
<div id="lock" hidden>
  <div class="lock-card">
    <div class="lock-badge">🔒</div>
    <h1>Roadmaps</h1>
    <p>Enter the secret to continue.</p>
    <form id="lock-form" class="lock-form" autocomplete="off">
      <div class="lock-input">
        <input id="lock-secret" type="password" placeholder="Secret" autocomplete="current-password"
               spellcheck="false" aria-label="Secret">
        <button type="button" id="lock-peek" class="peek" aria-label="Show secret">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <div id="lock-err" class="lock-err" role="alert"></div>
      <button type="submit" id="lock-submit" class="btn primary block">Unlock</button>
    </form>
  </div>
</div>

<!-- ============ App ============ -->
<div id="app" hidden data-sidebar="expanded" data-mobile="closed">
  <div id="sb-scrim" class="sb-scrim"></div>

  <!-- Sidebar -->
  <aside id="sidebar">
    <div class="sb-head">
      <div class="sb-logo">🗺️</div>
      <div class="sb-title">Roadmaps<small>your journeys</small></div>
      <button id="sb-collapse" class="sb-collapse" aria-label="Collapse sidebar" title="Collapse">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
    </div>
    <nav id="sb-list" class="sb-list" aria-label="Roadmaps"></nav>
    <div class="sb-foot">
      <span id="sync-pill" class="sync-pill local"><i></i><span id="sync-pill-text">Local only</span></span>
      <button id="tut-launch" class="sb-tut" aria-label="Companion tutorials" aria-haspopup="true"
              aria-expanded="false" title="Companion tutorials">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/></svg>
      </button>
    </div>
  </aside>

  <!-- Main -->
  <main id="main">
    <div id="topbar">
      <button id="menu-btn" class="menu-btn" aria-label="Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <span class="tb-title">Roadmaps</span>
    </div>
    <div id="view"></div>
  </main>
</div>

<!-- Settings FAB -->
<button id="fab" aria-label="Settings" title="Settings">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
</button>

<!-- Settings drawer -->
<div id="drawer-root">
  <div class="drawer-scrim"></div>
  <aside class="drawer" role="dialog" aria-label="Settings">
    <div class="drawer-head">
      <h2>Settings</h2>
      <button id="drawer-close" class="icon-btn x" aria-label="Close settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div id="drawer-body" class="drawer-body"></div>
  </aside>
</div>

<!-- Modal + toast roots -->
<div id="modal-root"></div>
<div id="toast-root"></div>

<script type="module" src="assets/js/app.js"></script>
</body>
</html>
