#!/usr/bin/env bash
# Régénère toute la bande‑son : voix off + sous‑titres, musique, effets, mixage final.
set -euo pipefail
cd "$(dirname "$0")/.."
# shellcheck disable=SC1091
source .venv/bin/activate

python audio/build_voice.py     # voix (Kokoro) → public/audio/voice_dry.wav + src/data/timeline.json (sous‑titres, repères)
(cd audio && python build_music.py)   # musique originale → audio/stems/music.flac
(cd audio && python build_sfx.py)     # effets sonores calés sur data/cues.json → audio/stems/sfx.flac
(cd audio && python mix.py)           # mixage + ducking + normalisation → public/audio/soundtrack.wav
