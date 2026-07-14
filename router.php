<?php
/*
 * router.php — front controller for the Roadmaps app.
 *
 * Launch with:
 *     php -S localhost:8000 router.php
 *
 * The built-in PHP server would otherwise serve EVERY file in this folder as a
 * plain static download — including `.env` (the secret's bcrypt hash) and
 * `journey.sqlite` (the whole journey). This router 404s those before they can
 * leak, and hands everything else back to the built-in server unchanged
 * (static files served as-is, *.php executed). Returning `false` is the
 * documented way to tell the built-in server "serve this normally".
 *
 * A bare "/" is rewritten to index.php so the shell loads at the root URL.
 */

$path = parse_url($_SERVER["REQUEST_URI"] ?? "/", PHP_URL_PATH);
$path = urldecode($path === null ? "/" : $path);

// Block, with a 404:
//   - any dot-file or dot-directory segment (/.env, /.git/..., /.sessions/...)
//   - the SQLite database and its WAL/SHM/journal sidecars
//   - the design/plan/research markdown (not part of the served app)
if (preg_match('#(^|/)\.[^/]#', $path)
    || preg_match('#\.sqlite(-wal|-shm|-journal)?$#i', $path)
    || preg_match('#\.md$#i', $path)) {                 // DESIGN.md, TASKS.md, roadmaps/_research.md
    // NOTE: *.js under roadmaps/ (incl. _index.js) must stay servable.
    http_response_code(404);
    header("Content-Type: text/plain");
    echo "Not found";
    return true;
}

// Serve the shell at the site root.
if ($path === "/" || $path === "") {
    require __DIR__ . "/index.php";
    return true;
}

// Everything else: let the built-in server handle it (false = serve the
// requested file / execute the requested PHP script as usual).
return false;
