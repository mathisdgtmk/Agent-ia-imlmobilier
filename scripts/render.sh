#!/usr/bin/env bash
# Rend les deux versions MP4 (H.264 + AAC, 30 i/s) dans out/.
#   CONCURRENCY=4 bash scripts/render.sh          → les deux formats
#   bash scripts/render.sh 16x9                   → seulement l'horizontal
#   bash scripts/render.sh 9x16                   → seulement le vertical
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
C="${CONCURRENCY:-4}"
WHICH="${1:-all}"

if [ "$WHICH" = "all" ] || [ "$WHICH" = "16x9" ]; then
  npx remotion render src/index.ts Ad-16x9 out/agent-ia-immobilier-16x9.mp4 --concurrency="$C"
fi
if [ "$WHICH" = "all" ] || [ "$WHICH" = "9x16" ]; then
  npx remotion render src/index.ts Ad-9x16 out/agent-ia-immobilier-9x16.mp4 --concurrency="$C"
fi
ls -lh out/*.mp4
