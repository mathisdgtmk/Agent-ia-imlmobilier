"""Synthétise la voix off (Kokoro, voix française ff_siwis) et écrit la timeline.

Entrée  : data/timeline.source.json
Sorties : public/audio/voice_dry.wav  (48 kHz mono, 60 s, voix seule, non traitée)
          src/data/timeline.json      (timeline complète: lignes + sous-titres synchronisés)

Utilisation : python audio/build_voice.py [--speed 0.97]
"""
import json, sys, argparse, re
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parent.parent
SR = 48000


def trim(a, sr, thr=0.008, pad=0.02):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx):
        return a
    s = max(0, idx[0] - int(pad * sr))
    e = min(len(a), idx[-1] + int(pad * sr))
    return a[s:e]


def find_pauses(a, sr, min_len=0.09, thr_db=-38):
    """Retourne les pauses internes [(centre, durée)] en secondes."""
    hop = int(0.005 * sr)
    n = len(a) // hop
    rms = np.sqrt(np.mean(a[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms + 1e-9)
    ref = np.percentile(db, 95)
    quiet = db < (ref + thr_db + 20)  # ~ -18 dB sous le niveau parlé
    pauses, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            dur = (j - i) * 0.005
            if dur >= min_len and i * 0.005 > 0.15 and j * 0.005 < len(a) / sr - 0.15:
                pauses.append(((i + j) / 2 * 0.005, dur))
            i = j
        else:
            i += 1
    return pauses


def syllables(text):
    """Estimation du nombre de syllabes (groupes de voyelles) : meilleure clé de répartition que le nombre de lettres."""
    return max(1, len(re.findall(r"[aeiouyàâäéèêëîïôöùûüœ]+", text.lower())))


def align_captions(chunks, dur, pauses, measured=None):
    """Répartit les sous-titres sur la durée de la ligne (poids = syllabes), puis recale chaque frontière
    sur une vraie pause de la voix : plus la pause est longue, plus l'écart toléré est grand
    (fin de phrase = silence net ; virgule = respiration courte)."""
    # une virgule / un point / deux-points = une petite pause, soit ≈ 1,3 syllabe de durée
    if measured is not None:
        # durées réelles de chaque segment (synthétisé isolément) + petite pause si le segment finit par une ponctuation
        w = np.array([d + 0.12 * sum(c.count(x) for x in ',.:;') for d, c in zip(measured, chunks)], dtype=float)
    else:
        w = np.array([syllables(c) + 0.4 + 1.3 * sum(c.count(x) for x in ',.:;') for c in chunks], dtype=float)
    cum = np.cumsum(w) / w.sum() * dur
    bounds = [0.0]
    for k in range(len(chunks) - 1):
        target = cum[k]
        best, best_score = target, 1e9
        for c, pd in pauses:
            if c <= bounds[-1] + 0.35 or c >= dur - 0.35:
                continue
            gap = abs(c - target)
            tol = 0.22 + 0.9 * pd if pd < 0.3 else min(0.9, 0.3 + 1.8 * pd)  # seules les vraies pauses (fins de phrase) attirent loin
            if gap <= tol:
                score = gap - 1.5 * pd
                if score < best_score:
                    best, best_score = c, score
        bounds.append(best)
    bounds.append(dur)
    return [(bounds[i], bounds[i + 1]) for i in range(len(chunks))]


def measure_chunks(kokoro, voice, speed, lang, chunks):
    """Durée (s) de chaque segment de sous-titre synthétisé isolément (sert uniquement de clé de répartition)."""
    out = []
    for c in chunks:
        a, sr = kokoro.create(re.sub(r"\bIA\b", "I A", c), voice=voice, speed=speed, lang=lang)
        out.append(len(trim(a.astype(np.float32), sr)) / sr)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--speed", type=float, default=None)
    args = ap.parse_args()

    from kokoro_onnx import Kokoro

    src = json.loads((ROOT / "data/timeline.source.json").read_text())
    v = src["voice"]
    speed = args.speed or v["speed"]
    kokoro = Kokoro(str(ROOT / "models/kokoro-v1.0.onnx"), str(ROOT / "models/voices-v1.0.bin"))
    # Voix : soit un nom ("name"), soit un mélange pondéré de plusieurs voix ("blend"), par interpolation des vecteurs de style.
    if "blend" in v:
        voice = sum(w * kokoro.get_voice_style(n) for n, w in v["blend"])
    else:
        voice = v["name"]

    total = int(src["duration"] * SR)
    track = np.zeros(total, dtype=np.float32)
    lines_out, caps_out = [], []
    prev_end = 0.0
    for ln in src["lines"]:
        a, sr = kokoro.create(ln.get("speak", ln["text"]), voice=voice, speed=speed, lang=v["lang"])
        a = trim(a.astype(np.float32), sr)
        a = resample_poly(a, SR, sr).astype(np.float32)
        dur = len(a) / SR
        pauses = find_pauses(a, SR)
        start = ln["at"]
        i0 = int(start * SR)
        if i0 + len(a) > total:
            print(f"!! {ln['id']} dépasse la fin de la vidéo")
            a = a[: total - i0]
        # fondu très court pour éviter les clics
        f = int(0.006 * SR)
        a[:f] *= np.linspace(0, 1, f)
        a[-f:] *= np.linspace(1, 0, f)
        track[i0 : i0 + len(a)] += a
        measured = measure_chunks(kokoro, voice, speed, v["lang"], ln["captions"]) if len(ln["captions"]) > 1 else None
        caps = align_captions(ln["captions"], dur, pauses, measured)
        for text, (cs, ce) in zip(ln["captions"], caps):
            caps_out.append({"line": ln["id"], "text": text, "start": round(start + cs, 3), "end": round(start + ce, 3)})
        lines_out.append({"id": ln["id"], "text": ln["text"], "start": round(start, 3), "end": round(start + dur, 3),
                          "duration": round(dur, 3), "gap_before": round(start - prev_end, 2)})
        prev_end = start + dur

    peak = np.max(np.abs(track))
    track *= 0.89 / max(peak, 1e-6)
    sf.write(ROOT / "public/audio/voice_dry.wav", track, SR, subtype="PCM_24")

    out = dict(src)
    out["lines"] = lines_out
    out["captions"] = caps_out
    cues_path = ROOT / "data/cues.json"
    out["cues"] = json.loads(cues_path.read_text()) if cues_path.exists() else []
    out["speed"] = speed
    (ROOT / "src/data").mkdir(exist_ok=True, parents=True)
    (ROOT / "src/data/timeline.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))

    print(f"vitesse {speed}")
    print(f"{'id':5s} {'début':>6s} {'fin':>6s} {'durée':>6s} {'écart':>6s}")
    for l in lines_out:
        print(f"{l['id']:5s} {l['start']:6.2f} {l['end']:6.2f} {l['duration']:6.2f} {l['gap_before']:6.2f}")
    print(f"fin de la dernière ligne : {lines_out[-1]['end']:.2f} s / {src['duration']} s")
    for s in src["scenes"]:
        ls = [l for l in lines_out if s["start"] <= l["start"] < s["end"]]
        over = [l["id"] for l in ls if l["end"] > s["end"] + 0.05]
        if over:
            print(f"   scène {s['id']} : débordement de {over}")


if __name__ == "__main__":
    main()
