#!/usr/bin/env bash
# setup.sh — recreate the ignored inputs of the 3-hour-cap planner after a fresh checkout.
#   orig/  = the PRE-cap roadmap files (git 4c7e500) that engine.mjs/builder.mjs read
#   acorn  = the parser builder.mjs uses to reuse each task's source text verbatim
# Then: node engine.mjs (→ plan.json) · node builder.mjs (→ public/roadmaps/*.js, interludes.js)
#       node validate.mjs · node check.mjs
set -e
cd "$(dirname "$0")"; ROOT=../..
mkdir -p orig/public/roadmaps orig/public/assets/js
for f in rust-fastapi interp-go bedrock raylib; do git -C $ROOT show 4c7e500:public/roadmaps/$f.js > orig/public/roadmaps/$f.js; done
git -C $ROOT show 4c7e500:public/assets/js/interludes.js > orig/interludes.js
for f in $ROOT/public/assets/js/*.js; do ln -sf "$(realpath $f)" orig/public/assets/js/; done
npm install --no-audit --no-fund >/dev/null
