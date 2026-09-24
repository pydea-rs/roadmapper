#!/usr/bin/env bash
# setup.sh — recreate the ignored inputs of the make-it-doable pass after a fresh checkout.
#   ../cap3/orig/  = the PRE-cap roadmap files (git 4c7e500) that reprice.mjs reads
#   pub/           = those files with this pass's re-pricing and splitting applied
#   node_modules   = acorn, the parser that lets the builder reuse each task's source text
# Then, in order:
#   node reprice.mjs     → pub/roadmaps/*.js     (+ bedrock's source library)
#   node engine.mjs      → plan.json             (~2.5 min, deterministic)
#   node builder.mjs     → public/roadmaps/*.js, public/assets/js/interludes.js
#   node validate.mjs · node check.mjs · node preserve.mjs · node claims.mjs
set -e
cd "$(dirname "$0")"
../cap3/setup.sh
mkdir -p pub/roadmaps pub/assets/js
for f in ../../public/assets/js/*.js; do ln -sf "$(realpath "$f")" pub/assets/js/; done
npm install --no-audit --no-fund >/dev/null
