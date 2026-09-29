"""Contrôle qualité : transcrit la voix synthétisée avec Whisper (sherpa-onnx) et la compare au script.
Usage : python audio/qa_asr.py <dossier_modèle_whisper> [voice.wav]
"""
import sys, json, re, difflib
from pathlib import Path
import numpy as np, soundfile as sf
import sherpa_onnx
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parent.parent
mdir = Path(sys.argv[1])
wav = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "public/audio/voice_dry.wav"
tl = json.loads((ROOT / "src/data/timeline.json").read_text())

rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=str(next(mdir.glob("*encoder*.onnx"))) if not (mdir/"small-encoder.int8.onnx").exists() else str(mdir/"small-encoder.int8.onnx"),
    decoder=str(next(mdir.glob("*decoder*.onnx"))) if not (mdir/"small-decoder.int8.onnx").exists() else str(mdir/"small-decoder.int8.onnx"),
    tokens=str(next(mdir.glob("*tokens.txt"))),
    language="fr", task="transcribe", num_threads=4,
)
a, sr = sf.read(wav, dtype="float32")
if a.ndim > 1: a = a.mean(axis=1)
a16 = resample_poly(a, 16000, sr).astype(np.float32)

def norm(s):
    s = s.lower().replace("’", "'")
    return re.sub(r"[^a-zàâçéèêëîïôûùüÿœ' ]+", " ", s).split()

worst = 1.0
for ln in tl["lines"]:
    s, e = int((ln["start"] - 0.1) * 16000), int((ln["end"] + 0.15) * 16000)
    seg = a16[max(0, s): e]
    st = rec.create_stream(); st.accept_waveform(16000, seg); rec.decode_stream(st)
    hyp = st.result.text.strip()
    ratio = difflib.SequenceMatcher(None, norm(ln["text"]), norm(hyp)).ratio()
    worst = min(worst, ratio)
    print(f"[{ln['id']:4s}] {ratio:4.2f}  ATTENDU : {ln['text']}\n              LU      : {hyp}")
print("pire similarité :", round(worst, 2))
