<?php
/*
 * sync.php — public API endpoint (thin forwarder).
 *
 * This is the ONLY backend file exposed to the web. It contains no logic and no
 * secrets: it just locates the private roadmapper/ app directory (outside this
 * web root) and hands the request to roadmapper/api.php, which does the real
 * work (auth, throttle, SQLite persistence). Keeping the logic and the DB out
 * of the docroot means a web-server misconfiguration can leak, at most, this
 * six-line forwarder.
 */

$app = require __DIR__ . '/app-path.php';   // returns the roadmapper/ path (or 500s + exits)
require $app . '/api.php';                    // handles the request and exits
