#!/usr/bin/env bash
# run.sh — run every *.test.mjs in this folder and print a per-file + aggregate
# summary. Each test prints a machine line "##RESULT file=.. pass=.. fail=.. skip=..".
# Exit status is non-zero if any assertion failed (skips do not fail the run).
#
#   ./tests/run.sh            # run all suites
#   ./tests/run.sh stats      # run only suites whose filename matches "stats"
#
# The DOM suite (render) needs jsdom; without it that suite SKIPs cleanly:
#   npm --prefix tests install     # installs jsdom locally for the render suite

cd "$(dirname "$0")" || exit 2

if command -v tput >/dev/null 2>&1 && [ -t 1 ]; then
  B=$(tput bold); G=$(tput setaf 2); R=$(tput setaf 1); Y=$(tput setaf 3); D=$(tput dim); Z=$(tput sgr0)
else B=""; G=""; R=""; Y=""; D=""; Z=""; fi

# Preferred order (foundations first); any other *.test.mjs is appended.
order=(util store stats activity reconcile content render)
files=()
for name in "${order[@]}"; do [ -f "$name.test.mjs" ] && files+=("$name.test.mjs"); done
for f in *.test.mjs; do
  [[ " ${files[*]} " == *" $f "* ]] || files+=("$f")
done

# Optional filter argument.
if [ -n "${1:-}" ]; then
  filtered=(); for f in "${files[@]}"; do [[ "$f" == *"$1"* ]] && filtered+=("$f"); done
  files=("${filtered[@]}")
fi
[ ${#files[@]} -eq 0 ] && { echo "no matching test files"; exit 2; }

echo "${B}Roadmaps test suite${Z}  ${D}($(node -v), ${#files[@]} files)${Z}"
echo "─────────────────────────────────────────────"

tot_pass=0; tot_fail=0; tot_skip=0; files_failed=0; files_skipped=0

for f in "${files[@]}"; do
  out="$(node "$f" 2>&1)"; code=$?
  line="$(printf '%s\n' "$out" | grep -E '^##RESULT ' | tail -n1)"
  p=$(sed -n 's/.*pass=\([0-9]*\).*/\1/p' <<<"$line"); p=${p:-0}
  fl=$(sed -n 's/.*fail=\([0-9]*\).*/\1/p' <<<"$line"); fl=${fl:-0}
  sk=$(sed -n 's/.*skip=\([0-9]*\).*/\1/p' <<<"$line"); sk=${sk:-0}
  name="${f%.test.mjs}"

  tot_pass=$((tot_pass + p)); tot_fail=$((tot_fail + fl)); tot_skip=$((tot_skip + sk))

  if [ "$sk" -gt 0 ] && [ "$fl" -eq 0 ]; then
    files_skipped=$((files_skipped + 1))
    printf "  %s○ SKIP%s  %-10s %s(%s)%s\n" "$Y" "$Z" "$name" "$D" "$(printf '%s' "$out" | grep -oE 'skipped: .*' | head -n1)" "$Z"
    continue
  fi
  if [ "$code" -ne 0 ] || [ "$fl" -gt 0 ] || [ -z "$line" ]; then
    files_failed=$((files_failed + 1))
    printf "  %s✗ FAIL%s  %-10s %spass %s · fail %s%s\n" "$R" "$Z" "$name" "$D" "$p" "$fl" "$Z"
    # show the failing assertion lines (and any crash output) indented
    printf '%s\n' "$out" | grep -E '✗|Error|Trace|throw' | sed 's/^/        /'
    [ -z "$line" ] && printf '        %s(no ##RESULT — the suite crashed before finishing)%s\n' "$D" "$Z"
  else
    printf "  %s✓ PASS%s  %-10s %s%s checks%s\n" "$G" "$Z" "$name" "$D" "$p" "$Z"
  fi
done

echo "─────────────────────────────────────────────"
status="${G}${B}ALL GREEN${Z}"
[ "$files_skipped" -gt 0 ] && status="$status ${Y}($files_skipped skipped)${Z}"
if [ "$files_failed" -gt 0 ]; then status="${R}${B}$files_failed FILE(S) FAILED${Z}"; fi
printf "%s   %schecks: %s passed" "$status" "$D" "$tot_pass"
[ "$tot_fail" -gt 0 ] && printf ", %s failed" "$tot_fail"
[ "$tot_skip" -gt 0 ] && printf ", %s skipped" "$tot_skip"
printf "%s\n" "$Z"

[ "$files_failed" -gt 0 ] && exit 1 || exit 0
