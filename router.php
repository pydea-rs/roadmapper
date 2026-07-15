<?php
/*
 * router.php — front controller for LOCAL DEVELOPMENT ONLY.
 *
 * Launch with (note the -t document-root flag pointing at public/):
 *     php -S localhost:8199 -t public router.php
 *
 * This mirrors, for PHP's built-in server, what Apache/.htaccess does in
 * production: it serves only what's under public/ and 404s stray sensitive
 * files. On cPanel this file is NOT used — Apache serves public_html directly
 * and public/.htaccess provides the hardening. The real protection in both
 * environments is structural: secrets + DB + backend live in roadmapper/,
 * OUTSIDE the web root, so no request can reach them.
 *
 * A bare "/" is rewritten to public/index.php so the shell loads at the root URL.
 */

$path = parse_url($_SERVER["REQUEST_URI"] ?? "/", PHP_URL_PATH);
$path = urldecode($path === null ? "/" : $path);

// Belt-and-suspenders 404 for anything sensitive that shouldn't be served:
//   - any dot-file or dot-directory segment (/.env, /.git/..., /.sessions/...)
//   - a SQLite database and its WAL/SHM/journal sidecars
//   - design/plan/research markdown (not part of the served app)
//   - the private roadmapper/ app dir, should a request ever target it
if (preg_match('#(^|/)\.[^/]#', $path)
    || preg_match('#\.sqlite(-wal|-shm|-journal)?$#i', $path)
    || preg_match('#\.md$#i', $path)
    || preg_match('#(^|/)roadmapper(/|$)#', $path)) {
    // NOTE: *.js under roadmaps/ (incl. _index.js) must stay servable.
    http_response_code(404);
    header("Content-Type: text/plain");
    echo "Not found";
    return true;
}

// Serve the shell at the site root.
if ($path === "/" || $path === "") {
    require __DIR__ . "/public/index.php";
    return true;
}

// Everything else: let the built-in server handle it from the -t docroot
// (public/). false = serve the requested static file / execute the PHP script.
return false;
