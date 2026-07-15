<?php
/*
 * app-path.php — locate the private "roadmapper/" application directory.
 *
 * All backend logic, the secret (.env), the SQLite database and the session
 * files live in roadmapper/, which is meant to sit OUTSIDE this web root so no
 * URL can ever reach it. This tiny locator is the only bridge: it finds that
 * directory and returns its path. It holds no secrets itself.
 *
 * Search order (first match wins):
 *   1. $ROADMAPPER_DIR  — explicit override (env var / SetEnv in .htaccess)
 *   2. a sibling of the web root  — e.g. ~/roadmapper next to ~/public_html
 *      (the recommended, truly-outside-the-docroot placement)
 *   3. roadmapper/ inside the web root — fallback for hosts that can't place a
 *      folder above the docroot; .htaccess hard-blocks it from being served.
 *
 * Usage:  $app = require __DIR__ . '/app-path.php';  require $app . '/api.php';
 */

$candidates = [];
$override = getenv('ROADMAPPER_DIR');
if ($override !== false && $override !== '') $candidates[] = rtrim($override, '/');
$candidates[] = dirname(__DIR__) . '/roadmapper';   // sibling of the web root  (recommended)
$candidates[] = __DIR__ . '/roadmapper';            // inside the web root       (fallback)

foreach ($candidates as $dir) {
    if (is_file($dir . '/api.php')) return $dir;
}

http_response_code(500);
header('Content-Type: application/json');
echo json_encode(['ok' => false, 'error' => 'backend app directory (roadmapper/) not found']);
exit;
