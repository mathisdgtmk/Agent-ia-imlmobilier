#!/usr/bin/env bash
# Installation complète du projet (Node + Python + modèle de voix). À lancer une fois.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Dépendances Node (Remotion, React, polices)…"
npm install

echo "→ Environnement Python (audio)…"
python3 -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt

echo "→ Modèle de voix Kokoro (≈ 350 Mo, téléchargé une seule fois)…"
mkdir -p models
[ -f models/kokoro-v1.0.onnx ] || curl -L -o models/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
[ -f models/voices-v1.0.bin ]  || curl -L -o models/voices-v1.0.bin  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

echo "✔ Terminé. Ensuite : « bash scripts/build-audio.sh » puis « npm run render » (ou « npm run studio » pour prévisualiser)."
