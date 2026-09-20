#!/bin/bash
# Full verification path for hose1021.github.io.
# Fails at the first problem: stale generated output, stale committed CSS, broken asset path.
set -e
cd "$(dirname "$0")"

IN_GIT=0
git rev-parse --git-dir >/dev/null 2>&1 && IN_GIT=1

echo "=== Harness Initialization: hose1021.github.io ==="

echo "=== 1/5 Installing dependencies ==="
bun install --frozen-lockfile

echo "=== 2/5 Checking generator syntax ==="
node --check scripts/generate.js

SOURCES_CHANGED=0
if [ "$IN_GIT" = "1" ] && ! git diff --quiet -- data/resume.json tailwind.css scripts/generate.js; then
  SOURCES_CHANGED=1
  echo "note: sources have uncommitted changes — regenerated output belongs in that same commit."
fi

echo "=== 3/5 Regenerating docs/index.html from data/resume.json ==="
bun run generate
if [ "$IN_GIT" = "1" ] && [ "$SOURCES_CHANGED" = "0" ] && ! git diff --quiet -- docs/index.html; then
  echo "FAIL: docs/index.html differs from data/resume.json."
  echo "      The generator output is the source of truth. Run: git diff -- docs/index.html"
  exit 1
fi

echo "=== 4/5 Rebuilding docs/build.css ==="
bun run build
if [ "$IN_GIT" = "1" ] && [ "$SOURCES_CHANGED" = "0" ] && ! git diff --quiet -- docs/build.css; then
  echo "FAIL: committed docs/build.css is stale."
  echo "      Commit the rebuilt file. Run: git diff --stat -- docs/build.css"
  exit 1
fi

echo "=== 5/5 Checking local asset references resolve ==="
node -e '
const fs = require("fs");
const path = require("path");
const files = ["docs/build.css", "docs/index.html"];
const missing = [];
for (const file of files) {
  if (!fs.existsSync(file)) { missing.push(file + " (file itself missing)"); continue; }
  const text = fs.readFileSync(file, "utf8");
  const refs = [...text.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/["\x27]/g, "").trim());
  if (file.endsWith(".html")) {
    refs.push(...[...text.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]));
  }
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) continue;
    const target = ref.startsWith("/")
      ? path.join("docs", ref)
      : path.join(path.dirname(file), ref.split(/[?#]/)[0]);
    if (!fs.existsSync(target)) missing.push(file + " -> " + ref);
  }
}
if (missing.length) {
  console.error("FAIL: unresolved local references (Pages serves from docs/):");
  for (const item of missing) console.error("  " + item);
  process.exit(1);
}
console.log("All local asset references resolve");
'

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to see current feature state"
echo "2. Pick ONE unfinished feature to work on"
echo "3. Edit data/resume.json or tailwind.css, never docs/index.html"
echo "4. Re-run ./init.sh before claiming done; leave the tree clean and restartable"
