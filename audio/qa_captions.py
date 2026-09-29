"""Contrôle de la synchronisation des sous‑titres : pour chaque sous‑titre, on transcrit (Whisper) l'audio de la voix
pendant sa fenêtre d'affichage et on vérifie que les mots du sous‑titre s'y trouvent bien.
Usage : python audio/qa_captions.py <dossier_modèle_whisper>
"""
import sys, json, re, difflib
from pathlib import Path
import numpy as np, soundfile as sf
import sherpa_onnx
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parent.parent
mdir = Path(sys.argv[1])
tl = json.loads((ROOT / "src/data/timeline.json").read_text())
rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=str(mdir / "small-encoder.int8.onnx"), decoder=str(mdir / "small-decoder.int8.onnx"), tokens=str(mdir / "small-tokens.txt"),
    language="fr", task="transcribe", num_threads=4)
a, sr = sf.read(ROOT / "public/audio/voice_dry.wav", dtype="float32")
a16 = resample_poly(a if a.ndim == 1 else a.mean(axis=1), 16000, sr).astype(np.float32)


def norm(s):
    s = s.lower().replace("’", "'")
    return re.sub(r"[^a-zàâçéèêëîïôûùüÿœ' ]+", " ", s).split()


bad = 0
for c in tl["captions"]:
    seg = a16[int(max(0, c["start"] - 0.15) * 16000) : int((c["end"] + 0.15) * 16000)]
    st = rec.create_stream(); st.accept_waveform(16000, seg); rec.decode_stream(st)
    hyp = norm(st.result.text)
    ref = norm(c["text"])
    # part des mots du sous‑titre retrouvés dans la fenêtre
    hit = sum(1 for wd in ref if any(difflib.SequenceMatcher(None, wd, h).ratio() > 0.75 for h in hyp)) / max(1, len(ref))
    # part des mots entendus qui n'appartiennent pas au sous‑titre (débordement sur le voisin)
    spill = sum(1 for h in hyp if not any(difflib.SequenceMatcher(None, h, wd).ratio() > 0.75 for wd in ref)) / max(1, len(hyp))
    flag = "" if hit >= 0.8 and spill <= 0.34 else "  <-- à vérifier"
    bad += bool(flag)
    print(f"{c['start']:6.2f}-{c['end']:6.2f} recall {hit:4.2f} débord {spill:4.2f} | {c['text']}{flag}")
print("sous-titres à vérifier :", bad, "/", len(tl["captions"]))
