"""Mixage final : voix off (traitée) + musique (ducking sous la voix) + effets sonores → soundtrack.wav.

Entrées : public/audio/voice_dry.wav (voix seule — remplaçable par un enregistrement humain de même durée/timing),
          audio/stems/music.flac, audio/stems/sfx.flac
Sortie  : public/audio/soundtrack.wav (48 kHz, stéréo, -16 LUFS intégré, crête ≤ -1,5 dBFS)
Usage   : python audio/mix.py                 → version avec voix off
          python audio/mix.py --sans-voix     → musique + effets seuls (pas de voix, pas de ducking) → public/audio/soundtrack_sans_voix.wav
"""
import sys
from pathlib import Path
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import butter, sosfilt, sosfiltfilt, lfilter
from dsp import SR, reverb

ROOT = Path(__file__).resolve().parent.parent


def load(p):
    a, sr = sf.read(p, dtype="float64", always_2d=True)
    assert sr == SR, f"{p} doit être en {SR} Hz"
    return a


def peaking(x, f0, gain_db, q=1.0):
    """Égaliseur en cloche (biquad RBJ)."""
    A = 10 ** (gain_db / 40)
    w0 = 2 * np.pi * f0 / SR
    al = np.sin(w0) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w0), 1 - al * A]
    a = [1 + al / A, -2 * np.cos(w0), 1 - al / A]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x)


def compress(x, thr_db=-24.0, ratio=2.6, att=0.008, rel=0.14, makeup_db=0.0):
    env = np.abs(x)
    a_att = np.exp(-1 / (att * SR))
    a_rel = np.exp(-1 / (rel * SR))
    sm = np.zeros_like(env)
    prev = 0.0
    for i in range(len(env)):  # enveloppe à attaque/relâchement (boucle python : ~3 M d'échantillons)
        v = env[i]
        prev = a_att * prev + (1 - a_att) * v if v > prev else a_rel * prev + (1 - a_rel) * v
        sm[i] = prev
    db = 20 * np.log10(sm + 1e-9)
    over = np.maximum(db - thr_db, 0)
    gr = -over * (1 - 1 / ratio)
    return x * 10 ** ((gr + makeup_db) / 20)


def smooth_env(x, att=0.03, rel=0.35):
    e = np.abs(x)
    e = sosfiltfilt(butter(2, 30, "low", fs=SR, output="sos"), e)
    a_att = np.exp(-1 / (att * SR))
    a_rel = np.exp(-1 / (rel * SR))
    out = np.zeros_like(e)
    prev = 0.0
    for i in range(len(e)):
        v = e[i]
        prev = a_att * prev + (1 - a_att) * v if v > prev else a_rel * prev + (1 - a_rel) * v
        out[i] = prev
    return out


def split3(x, f1=280, f2=4200):
    lo = sosfiltfilt(butter(4, f1, "low", fs=SR, output="sos"), x, axis=0)
    hi = sosfiltfilt(butter(4, f2, "high", fs=SR, output="sos"), x, axis=0)
    return lo, x - lo - hi, hi


def main():
    sans_voix = "--sans-voix" in sys.argv
    n = int(60 * SR)
    voice = np.zeros(n) if sans_voix else load(ROOT / "public/audio/voice_dry.wav")[:, 0]
    voice = np.pad(voice, (0, max(0, n - len(voice))))[:n]
    music = load(ROOT / "audio/stems/music.flac")
    music = np.pad(music, ((0, max(0, n - len(music))), (0, 0)))[:n]
    sfx = load(ROOT / "audio/stems/sfx.flac")
    sfx = np.pad(sfx, ((0, max(0, n - len(sfx))), (0, 0)))[:n]

    if sans_voix:
        # ---- sans voix : la musique reste au niveau « libre » (pas de ducking) ; effets inchangés
        music_d = music * 10 ** (-6.0 / 20)
        mix = music_d + sfx * 10 ** (-3.0 / 20)
        out_name = "soundtrack_sans_voix.wav"
        v = voice_st = duck = None
    else:
        out_name = "soundtrack.wav"
        mix, music_d, voice_st, v, duck = build_with_voice(voice, music, sfx)
    finish(mix, music_d, voice_st, v, out_name, sans_voix, duck)


def build_with_voice(voice, music, sfx):
    # ---- voix : nettoyage, présence, compression, petite réverbération de pièce
    v = sosfilt(butter(2, 85, "high", fs=SR, output="sos"), voice)
    v = peaking(v, 120, 2.2, 0.7)       # chaleur de la voix grave (effet « proximité »)
    v = peaking(v, 250, -1.6, 0.9)      # dégage le bas-médium
    v = peaking(v, 3200, 2.6, 0.9)      # présence / intelligibilité
    v = peaking(v, 7500, 1.2, 0.8)      # un peu d'air
    v = compress(v, -24, 2.6, 0.008, 0.14, 3.0)
    v = v / (np.percentile(np.abs(v[np.abs(v) > 0.02]), 98) + 1e-9) * 0.42
    room = reverb(v, 0.55, 0.008, 1.0, 5) * 0.07
    plate = reverb(v, 1.7, 0.02, 0.8, 6) * 0.045
    voice_st = np.stack([v, v], axis=1) + room + plate

    # ---- musique : ducking par bandes sous la voix (la basse et les aigus restent presents, les médiums s'effacent)
    env = smooth_env(v)
    env = env / (np.percentile(env, 97) + 1e-9)
    duck = np.clip((env - 0.10) / 0.35, 0, 1)
    lo, mid, hi = split3(music)
    d = duck[:, None]
    lo = lo * 10 ** (-2.5 * d / 20)
    mid = mid * 10 ** (-9.5 * d / 20)
    hi = hi * 10 ** (-5.0 * d / 20)
    # la musique respire plus fort quand la voix se tait (intro, respirations, finale)
    free = np.clip(1 - duck, 0, 1)[:, None]
    music_d = (lo + mid + hi) * 10 ** (-9.5 / 20) * 10 ** (3.5 * free / 20)

    mix = voice_st * 1.0 + music_d + sfx * 10 ** (-3.0 / 20)
    return mix, music_d, voice_st, v, duck


def finish(mix, music_d, voice_st, v, out_name, sans_voix, duck):
    # ---- master
    mix = sosfilt(butter(2, 28, "high", fs=SR, output="sos"), mix, axis=0)
    meter = pyln.Meter(SR)
    loud = meter.integrated_loudness(mix)
    mix = mix * 10 ** ((-16.0 - loud) / 20)
    # limiteur doux
    peak = np.abs(mix).max()
    if peak > 0.84:
        k = 0.84
        mix = np.tanh(mix / k * 0.9) * k / np.tanh(0.9)
    peak = np.abs(mix).max()
    mix = mix * (10 ** (-1.5 / 20) / peak)
    if sans_voix:
        # le limiteur relève légèrement le niveau moyen : on revient à −16 LUFS (comme la version avec voix) ; le gain est négatif, la crête reste ≤ −1,5 dBFS
        mix = mix * 10 ** ((-16.0 - meter.integrated_loudness(mix)) / 20)

    # fondu final très court pour éviter tout clic
    f = int(0.05 * SR)
    mix[-f:] *= np.linspace(1, 0, f)[:, None]
    sf.write(ROOT / "public/audio" / out_name, mix.astype(np.float32), SR, subtype="PCM_16")

    # ---- rapport
    lu = meter.integrated_loudness(mix)
    def rms_db(x):
        return 20 * np.log10(np.sqrt(np.mean(x**2)) + 1e-12)
    print(f"loudness intégré : {lu:.1f} LUFS, crête : {20*np.log10(np.abs(mix).max()):.1f} dBFS  → {out_name}")
    if sans_voix:
        return
    speech = duck > 0.5
    print(f"pendant la voix  : voix {rms_db(voice_st[speech]):.1f} dB | musique {rms_db(music_d[speech]):.1f} dB | écart {rms_db(voice_st[speech]) - rms_db(music_d[speech]):.1f} dB")
    print(f"hors voix        : musique {rms_db(music_d[~speech]):.1f} dB")


if __name__ == "__main__":
    main()
