"""Musique originale (60 s, 96 BPM, la mineur) : électronique cinématographique, piano discret,
basses douces, montée progressive vers l'appel à l'action. 100 % synthétisée : aucun échantillon tiers,
aucun droit à acquitter.

Sortie : audio/stems/music.flac (48 kHz stéréo)
Usage  : python audio/build_music.py
"""
from pathlib import Path
import numpy as np
import soundfile as sf
from dsp import *  # noqa

ROOT = Path(__file__).resolve().parent.parent
DUR = 60.0
BPM = 96
BEAT = 60.0 / BPM          # 0,625 s
BAR = BEAT * 4             # 2,5 s
S16 = BEAT / 4

# --- harmonie : (racine grave, notes de nappe, notes d'arpège)
CH = {
    "Am9":   (33 + 12, [57, 60, 64, 67, 71], [57, 60, 64, 67, 71, 76, 81]),
    "Fmaj7": (29 + 12, [53, 57, 60, 64, 67], [53, 57, 60, 64, 65, 72, 77]),
    "Cmaj9": (36 + 12, [55, 59, 62, 64, 67], [55, 60, 64, 67, 71, 74, 79]),
    "G":     (31 + 12, [55, 62, 67, 69, 71], [55, 59, 62, 67, 69, 74, 79]),
    "Em7":   (28 + 12, [52, 55, 59, 62, 67], [52, 55, 59, 62, 67, 71, 76]),
}
PROG = (["Am9", "Fmaj7", "Cmaj9", "G"] * 4          # bars 0-15
        + ["Fmaj7", "G", "Am9", "Cmaj9"]            # bars 16-19  (ancrage local, plus chaleureux)
        + ["Am9", "Fmaj7", "G", "Cmaj9"])          # bars 20-23  (montée puis résolution finale)
# bar 22 démarre à 55 s (CTA) : "G" -> tension, bar 23 (57,5 s) : Cmaj9 = résolution

master = Stereo(DUR)
pad_bus = Stereo(DUR + 4)
key_bus = Stereo(DUR + 4)
arp_bus = Stereo(DUR + 4)
drum_bus = Stereo(DUR + 4)
bass_bus = Stereo(DUR + 4)
fx_bus = Stereo(DUR + 4)

def sect(t, a, b):
    return a <= t < b

# ================================================================= NAPPES (pad)
for b, name in enumerate(PROG):
    t0 = b * BAR
    root, padn, arpn = CH[name]
    if sect(t0, 0, 7.5):
        cut, g = 900 + 200 * b, 0.42 + 0.05 * b
    elif sect(t0, 7.5, 15):
        cut, g = 1300 + 450 * (b - 3), 0.62 + 0.06 * (b - 3)
    elif sect(t0, 15, 40):
        cut, g = 2600, 0.85
    elif sect(t0, 40, 47.5):
        cut, g = 2100, 0.85
    elif sect(t0, 47.5, 55):
        cut, g = 2800 + 350 * (b - 19), 0.9 + 0.04 * (b - 19)
    else:
        cut, g = 3600, 1.0
    dur = BAR + 1.3
    if b == 5:               # coupure avant le "noir" puis impact à 15 s
        dur = BAR - 0.35
    if b == 23:
        dur = 2.5 + 1.6
    for k, m in enumerate(padn):
        n = pad_note(hz(m), dur, cutoff=cut, phase_seed=b * 10 + k)
        e = np.ones(len(n))
        a, r = int(0.9 * SR), int(min(1.4, dur * 0.4) * SR)
        e[:a] = np.linspace(0, 1, a) ** 1.5
        e[-r:] = np.linspace(1, 0, r) ** 1.5
        pan = (k - 2) * 0.18
        pad_bus.put(n * e, t0, g * 0.16, pan)
    # octave supérieure douce dans les parties émotionnelles
    if sect(t0, 40, 47.5) or sect(t0, 47.5, 60):
        for k, m in enumerate(padn[:3]):
            n = pad_note(hz(m + 12), dur, cutoff=cut * 1.3, spread=(-11, 4, 12), phase_seed=b * 10 + k + 500)
            a, r = int(1.1 * SR), int(min(1.4, dur * 0.4) * SR)
            e = np.ones(len(n)); e[:a] = np.linspace(0, 1, a) ** 1.5; e[-r:] = np.linspace(1, 0, r) ** 1.5
            pad_bus.put(n * e, t0, g * 0.09, (k - 1) * 0.5)

# ================================================================= BASSE
for b, name in enumerate(PROG):
    t0 = b * BAR
    root = CH[name][0] - 12
    f = hz(root)
    if sect(t0, 7.5, 14.4) or sect(t0, 15, 40):
        soft = 0.7 if sect(t0, 7.5, 14.4) else 1.0
        bass_bus.put(sub(f, BAR * 0.42, 0.85 * soft), t0)
        bass_bus.put(sub(f, BEAT * 1.1, 0.7 * soft), t0 + BEAT * 2.5)
        if sect(t0, 25, 40):
            bass_bus.put(sub(f * 2, BEAT * 0.4, 0.4), t0 + BEAT * 3.5)
    elif sect(t0, 40, 47.5):
        bass_bus.put(sub(f, BAR * 0.95, 0.75), t0)
    elif sect(t0, 47.5, 57.5):
        bass_bus.put(sub(f, BEAT * 1.4, 0.95), t0)
        bass_bus.put(sub(f, BEAT * 0.6, 0.7), t0 + BEAT * 1.5)
        bass_bus.put(sub(f, BEAT * 1.4, 0.9), t0 + BEAT * 2.0)
        bass_bus.put(sub(f * 1.5, BEAT * 0.5, 0.5), t0 + BEAT * 3.5)
    elif b == 23:
        bass_bus.put(sub(f, 2.2, 0.85), t0)

# ================================================================= PIANO
def pn(m, t, vel=0.7, bright=1.0, dur=3.2, pan=0.0):
    key_bus.put(piano(hz(m), dur, vel, bright), t, 0.5, pan)

for b, name in enumerate(PROG):
    t0 = b * BAR
    root, padn, arpn = CH[name]
    if sect(t0, 0, 7.5):        # introduction : arpège lent et clairsemé
        for i, idx in enumerate([0, 2, 3, 4]):
            if i == 0 and b == 0:
                continue
            pn(arpn[idx] if idx else arpn[0] - 12, t0 + i * BEAT + (0.0 if i else 0), 0.42 + 0.06 * b, 0.7, 3.2, -0.2 + 0.13 * i)
    elif sect(t0, 7.5, 14.4):   # tension : ostinato en croches sur les notes hautes
        for i in range(8):
            m = arpn[[3, 4, 3, 5, 4, 3, 5, 4][i]]
            pn(m, t0 + i * BEAT / 2, 0.30 + 0.02 * i, 0.8, 1.6, 0.3 * (-1) ** i)
    elif sect(t0, 15, 40):      # groove : rythme syncopé
        for i, s in enumerate([0, 3, 6, 10, 12]):
            m = arpn[[2, 4, 3, 4, 5][i]]
            pn(m, t0 + s * S16, 0.5, 0.9, 2.2, 0.25 * (-1) ** i)
        pn(arpn[0] - 12, t0, 0.5, 0.8, 3.0, -0.3)
    elif sect(t0, 40, 47.5):    # mélodie émotionnelle
        mel = {
            16: [(0, 72, 1.5), (2.5, 69, 1.0), (3.5, 67, 2.0)],
            17: [(0, 71, 2.0), (2.5, 74, 1.0), (3.5, 69, 2.0)],
            18: [(0, 72, 1.0), (1, 76, 1.5), (2.5, 74, 1.0), (3.5, 72, 2.0)],
        }.get(b, [])
        for (bt, m, d) in mel:
            pn(m, t0 + bt * BEAT, 0.62, 1.0, 3.6, 0.1)
        pn(arpn[0] - 12, t0, 0.5, 0.7, 3.5, -0.3)
        pn(arpn[2], t0 + 2 * BEAT, 0.35, 0.7, 2.5, 0.2)
    elif sect(t0, 47.5, 57.5):  # accords en octaves, puissants mais nets
        for s in (0, 3, 6, 8, 10, 12, 14):
            pn(arpn[[2, 4, 3, 5, 4, 5, 6][ [0,3,6,8,10,12,14].index(s) ]], t0 + s * S16, 0.55, 1.0, 1.8, 0.25 * (-1) ** s)
        pn(arpn[0] - 12, t0, 0.6, 0.9, 3.0, -0.3)
    elif b == 23:               # accord final, laissé résonner
        for i, m in enumerate([arpn[0] - 12, arpn[1], arpn[2], arpn[3], arpn[5], arpn[6]]):
            pn(m, t0 + i * 0.07, 0.55 - 0.04 * i, 1.0, 5.0, -0.3 + 0.12 * i)

# ================================================================= ARPÈGES (pluck + écho)
ARP = [0, 2, 4, 2, 1, 3, 5, 3, 0, 2, 4, 2, 1, 3, 5, 6]
arp_dry = Stereo(DUR + 4)
for b, name in enumerate(PROG):
    t0 = b * BAR
    arpn = CH[name][2]
    if sect(t0, 15, 40):
        g = 0.24 + 0.10 * min(1.0, (t0 - 15) / 12)
        step = 1
    elif sect(t0, 40, 47.5):
        g, step = 0.12, 2
    elif sect(t0, 47.5, 57.5):
        g, step = 0.34 + 0.03 * (b - 19), 1
    else:
        continue
    for i in range(0, 16, step):
        m = arpn[ARP[i]] + (12 if (b % 2 and i % 8 == 7) else 0)
        vel = 0.75 if i % 4 == 0 else 0.55
        arp_dry.put(pluck(hz(m), 0.42, vel), t0 + i * S16, g, 0.35 * np.sin(i * 0.9))
arp_mono = arp_dry.a.mean(axis=1)
arp_echo = pingpong(arp_mono, delay=S16 * 3, fb=0.38, taps=5)
arp_bus.a[: len(arp_echo)] += arp_echo[: arp_bus.n] if len(arp_echo) >= arp_bus.n else np.pad(arp_echo, ((0, arp_bus.n - len(arp_echo)), (0, 0)))

# ================================================================= PERCUSSIONS
def beats(t0, t1, step=BEAT):
    t = t0
    while t < t1 - 1e-6:
        yield t
        t += step

for t in beats(7.5, 14.4, BEAT * 2):                     # battement de coeur discret
    drum_bus.put(lp(kick(0.5), 140), t, 0.55)
    drum_bus.put(lp(kick(0.4), 140), t + BEAT * 0.75, 0.35)
for t in beats(15.0, 40.0):                              # kick doux "four on the floor"
    drum_bus.put(kick(0.85), t, 0.62)
for t in beats(40.0, 47.5, BEAT * 2):                    # respiration
    drum_bus.put(kick(0.6), t, 0.4)
for t in beats(47.5, 57.5):
    drum_bus.put(kick(0.95), t, 0.7)
for t in beats(17.5, 40.0):                              # contretemps de charley
    drum_bus.put(hat(0.55, open_=True), t + BEAT / 2, 0.30)
for t in beats(17.5, 40.0, S16 * 2):
    drum_bus.put(hat(0.3 + 0.2 * rng.random()), t, 0.22)
for t in beats(47.5, 57.5, S16):
    drum_bus.put(hat(0.35 + 0.35 * (int(round(t / S16)) % 4 == 0)), t, 0.22 + 0.05 * (t > 52))
for t in beats(25.0, 40.0, BEAT * 2):
    drum_bus.put(clap(0.8), t + BEAT, 0.5)
for t in beats(50.0, 57.5, BEAT * 2):
    drum_bus.put(clap(0.9), t + BEAT, 0.55)

# ================================================================= RISERS / IMPACTS
fx_bus.put(noise_riser(2.0, 250, 9500, 2.0, 0.55), 12.4, 0.55)
fx_bus.put(sine_sweep(2.0, 180, 1400, 0.22), 12.4, 0.5)
fx_bus.put(boom(4.0, 64, 34, 0.95), 15.0, 0.9)                                 # départ de la solution
fx_bus.put(noise_riser(3.2, 300, 10500, 2.0, 0.7), 51.2, 0.6)                  # montée vers le CTA
fx_bus.put(sine_sweep(3.2, 200, 1800, 0.22), 51.2, 0.5)
fx_bus.put(boom(4.5, 58, 33, 0.9), 54.4, 0.85)                                 # CTA
for t in (39.0, 47.0):                                                         # respirations de scène
    fx_bus.put(boom(2.6, 50, 32, 0.6), t, 0.4)
for i in range(8):                                                             # roulement de caisse claire avant le CTA
    t = 50.0 + 2.5 + i * S16 * (4 if i < 2 else 2 if i < 5 else 1) * 0.5
for t in np.arange(52.5, 54.4, S16 / 1.0):
    fx_bus.put(hp(clap(0.6), 800), t, 0.10 + 0.20 * (t - 52.5) / 1.9)

# ================================================================= RÉVERBÉRATION + MIX
def wet(bus, rt, mix, damp=1.0, seed=1):
    return reverb(bus.a, rt, 0.02, damp, seed) * mix

pad_rev = wet(pad_bus, 3.6, 0.55, 0.9, 11)
key_rev = wet(key_bus, 2.6, 0.55, 1.0, 12)
arp_rev = wet(arp_bus, 2.0, 0.30, 1.0, 13)
fx_rev = wet(fx_bus, 3.2, 0.45, 0.9, 14)
drum_rev = wet(drum_bus, 0.9, 0.12, 1.0, 15)

mix = (pad_bus.a * 1.0 + pad_rev
       + key_bus.a * 1.0 + key_rev
       + arp_bus.a * 1.0 + arp_rev
       + drum_bus.a * 1.0 + drum_rev
       + bass_bus.a * 1.0
       + fx_bus.a * 1.0 + fx_rev)
mix = mix[: int(DUR * SR)]

# sidechain doux : la basse et les nappes "respirent" avec le kick
kick_env = np.ones(len(mix))
for t in list(beats(15.0, 40.0)) + list(beats(47.5, 57.5)):
    i = int(t * SR); n = int(0.28 * SR)
    if i + n < len(kick_env):
        kick_env[i:i + n] = np.minimum(kick_env[i:i + n], 0.70 + 0.30 * (1 - np.exp(-np.arange(n) / SR / 0.09)))
side = kick_env[:, None]
mix = (pad_bus.a[: len(mix)] + pad_rev[: len(mix)] + arp_bus.a[: len(mix)] + arp_rev[: len(mix)]
       + key_bus.a[: len(mix)] + key_rev[: len(mix)]) * (0.55 + 0.45 * side) \
      + (bass_bus.a[: len(mix)]) * side + drum_bus.a[: len(mix)] + drum_rev[: len(mix)] \
      + fx_bus.a[: len(mix)] + fx_rev[: len(mix)]

# ouverture et fermeture : entrée progressive, fin qui s'éteint
t = np.arange(len(mix)) / SR
g = np.clip(t / 2.2, 0, 1) ** 1.6
g *= np.clip((DUR - t) / 2.6, 0, 1) ** 1.3
# silence quasi-total juste avant l'impact de 15 s (respiration)
g *= 1 - 0.85 * np.exp(-((t - 14.75) / 0.16) ** 2) * (t < 15.0)
mix = mix * g[:, None]

mix = hp(mix, 28, 2)
mix = np.tanh(mix * 0.9) / 0.9
peak = np.abs(mix).max()
mix = mix / peak * 0.85
(ROOT / "audio/stems").mkdir(exist_ok=True)
sf.write(ROOT / "audio/stems/music.flac", mix.astype(np.float32), SR, subtype="PCM_24")

# petit rapport : niveau RMS par seconde
r = np.sqrt(np.mean(mix.reshape(-1, 2)[: (len(mix) // SR) * SR].reshape(-1, SR, 2) ** 2, axis=(1, 2)))
print("RMS (dBFS) par seconde :")
print(" ".join(f"{20*np.log10(v+1e-9):.0f}" for v in r))
print("crête", round(20 * np.log10(np.abs(mix).max()), 2), "dBFS")
