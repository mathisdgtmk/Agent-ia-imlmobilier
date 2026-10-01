"""Musique « Noir & Blanc » (60 s, 100 BPM, la mineur) : électronique cinématographique, rythmée, très construite.
25 mesures de 2,4 s alignées sur le montage (data/noir.json). 100 % synthétisée : aucun échantillon tiers.

  mesures 0-2   accroche      nappes qui montent, battement de coeur, notes de piano clairsemées, riser
  mesures 3-5   problème      tension : ostinato en doubles-croches, kick à chaque temps, roulement de caisse claire, trou de silence
  mesures 6-8   solution      éclosion : nappes lumineuses, piano, le kick « four-on-the-floor » entre
  mesures 9-14  fonctions     groove complet qui se charge à chaque fonction (arpèges, charleys, claps, basse syncopée)
  mesures 15-17 ancrage local respiration : demi-tempo, piano mélodique, nappes chaudes, riser
  mesures 18-20 bénéfice      émotion : mélodie au piano, retour progressif du rythme
  mesures 21-24 appel action  tout est là : drop, puis résolution sur la mineur

Sortie : audio/stems/noir_music.flac (48 kHz stéréo)
Usage  : cd audio && python noir_music.py
"""
import json
from pathlib import Path
import numpy as np
import soundfile as sf
from dsp import *  # noqa

ROOT = Path(__file__).resolve().parent.parent
plan = json.loads((ROOT / "data/noir.json").read_text())
DUR = 60.0
BPM = plan["bpm"]
BEAT = 60.0 / BPM          # 0,6 s
BAR = BEAT * 4             # 2,4 s
S16 = BEAT / 4             # 0,15 s
NB = plan["bars"]

# --- harmonie : (racine grave, notes de nappe, notes d'arpège)
CH = {
    "Am9":   (33 + 12, [57, 60, 64, 67, 71], [57, 60, 64, 67, 71, 76, 81]),
    "Fmaj7": (29 + 12, [53, 57, 60, 64, 67], [53, 57, 60, 64, 65, 72, 77]),
    "Cmaj9": (36 + 12, [55, 59, 62, 64, 67], [55, 60, 64, 67, 71, 74, 79]),
    "G":     (31 + 12, [55, 62, 67, 69, 71], [55, 59, 62, 67, 69, 74, 79]),
    "E":     (28 + 12, [52, 56, 59, 64, 68], [52, 56, 59, 64, 68, 71, 76]),
}
PROG = ["Am9", "Fmaj7", "Am9",                                  # 0-2   accroche
        "Am9", "Am9", "E",                                      # 3-5   problème (E = tension)
        "Fmaj7", "G", "Am9",                                    # 6-8   solution
        "Am9", "Fmaj7", "Cmaj9", "G", "Am9", "G",               # 9-14  fonctions
        "Fmaj7", "Cmaj9", "G",                                  # 15-17 ancrage local
        "Am9", "Fmaj7", "G",                                    # 18-20 bénéfice
        "Am9", "Fmaj7", "G", "Am9"]                             # 21-24 appel à l'action
assert len(PROG) == NB


def section(b):
    return ("hook" if b < 3 else "problem" if b < 6 else "solution" if b < 9 else "features" if b < 15
            else "local" if b < 18 else "benefit" if b < 21 else "cta")


pad_bus = Stereo(DUR + 5)
key_bus = Stereo(DUR + 5)
arp_dry = Stereo(DUR + 5)
drum_bus = Stereo(DUR + 5)
bass_bus = Stereo(DUR + 5)
fx_bus = Stereo(DUR + 5)
perc_bus = Stereo(DUR + 5)
KICKS = []   # instants de kick (pour le sidechain)


def bt(b):
    """beats (de la timeline) -> secondes"""
    return b * BEAT


def kick_at(t, vel, gain=0.62):
    drum_bus.put(kick(vel), t, gain)
    KICKS.append(t)


# ================================================================= NAPPES
for b, name in enumerate(PROG):
    t0 = b * BAR
    root, padn, arpn = CH[name]
    s = section(b)
    if s == "hook":
        cut, g = 650 + 450 * b, 0.34 + 0.12 * b
    elif s == "problem":
        cut, g = 800 + 150 * (b - 3), 0.38
    elif s == "solution":
        cut, g = 1400 + 600 * (b - 6), 0.62 + 0.10 * (b - 6)
    elif s == "features":
        cut, g = 2400, 0.58
    elif s == "local":
        cut, g = 2300, 0.9
    elif s == "benefit":
        cut, g = 2100 + 450 * (b - 18), 0.85 + 0.05 * (b - 18)
    else:
        cut, g = 3500, 1.0
    dur = BAR + 1.2
    if b == 5:
        dur = BAR - 0.55          # coupure avant le trou de silence (13,9 s)
    if b == 24:
        dur = 5.0
    for k, m in enumerate(padn):
        n = pad_note(hz(m), dur, cutoff=cut, phase_seed=b * 10 + k)
        e = np.ones(len(n))
        a, r = int(0.7 * SR), int(min(1.2, dur * 0.4) * SR)
        e[:a] = np.linspace(0, 1, a) ** 1.5
        e[-r:] = np.linspace(1, 0, r) ** 1.5
        pad_bus.put(n * e, t0, g * 0.16, (k - 2) * 0.18)
    if s in ("benefit", "cta", "local"):
        for k, m in enumerate(padn[:3]):
            n = pad_note(hz(m + 12), dur, cutoff=cut * 1.3, spread=(-11, 4, 12), phase_seed=b * 10 + k + 500)
            a, r = int(0.9 * SR), int(min(1.2, dur * 0.4) * SR)
            e = np.ones(len(n)); e[:a] = np.linspace(0, 1, a) ** 1.5; e[-r:] = np.linspace(1, 0, r) ** 1.5
            pad_bus.put(n * e, t0, g * 0.08, (k - 1) * 0.5)

# ================================================================= BASSE
for b, name in enumerate(PROG):
    t0 = b * BAR
    f = hz(CH[name][0] - 12)
    s = section(b)
    if s == "hook" and b >= 1:
        bass_bus.put(sub(f, BAR * 0.9, 0.55 + 0.1 * b), t0)
    elif s == "problem":
        for i in range(8):                                       # pulsation en croches, de plus en plus appuyée
            bass_bus.put(sub(f, BEAT * 0.4, 0.5 + 0.04 * (b - 3) + (0.12 if i % 2 == 0 else 0)), t0 + i * BEAT / 2)
    elif s == "solution" and b >= 7:
        bass_bus.put(sub(f, BAR * 0.42, 0.8), t0)
        bass_bus.put(sub(f, BEAT * 1.1, 0.65), t0 + BEAT * 2.5)
    elif s == "solution":
        bass_bus.put(sub(f, BAR * 0.9, 0.6), t0)
    elif s in ("features", "cta") and b != 24:
        for idx, ln, v in ((0, 0.95, 0.9), (6, 0.5, 0.6), (8, 0.95, 0.85), (11, 0.4, 0.55), (14, 0.4, 0.5)):
            fo = f * (2 if idx == 14 else 1)
            bass_bus.put(sub(fo, BEAT * ln, v), t0 + idx * S16)
    elif s == "local":
        bass_bus.put(sub(f, BAR * 0.95, 0.7), t0)
    elif s == "benefit":
        if b < 20:
            bass_bus.put(sub(f, BAR * 0.95, 0.65), t0)
        else:
            bass_bus.put(sub(f, BEAT * 1.3, 0.85), t0)
            bass_bus.put(sub(f, BEAT * 1.3, 0.8), t0 + BEAT * 2)
    elif b == 24:
        bass_bus.put(sub(f, 3.0, 0.85), t0)

# ================================================================= PIANO
def pn(m, t, vel=0.7, bright=1.0, dur=3.2, pan=0.0, g=0.5):
    key_bus.put(piano(hz(m), dur, vel, bright), t, g, pan)


MEL = {
    15: [(0, 72, 1.5), (2.5, 69, 1.0), (3.5, 67, 2.0)],
    16: [(0, 71, 2.0), (2.5, 74, 1.0), (3.5, 72, 2.0)],
    17: [(0, 74, 1.0), (1, 71, 1.5), (2.5, 67, 1.0), (3.5, 71, 2.0)],
    18: [(0, 76, 1.5), (2, 72, 1.0), (3, 69, 1.5)],
    19: [(0, 77, 1.5), (2, 76, 1.0), (3, 72, 1.5)],
    20: [(0, 74, 1.0), (1, 79, 1.5), (2.5, 76, 1.0)],
}
for b, name in enumerate(PROG):
    t0 = b * BAR
    root, padn, arpn = CH[name]
    s = section(b)
    if s == "hook":
        if b == 1:
            pn(76, t0 + BEAT * 2, 0.45, 0.8, 3.5, -0.2)
            pn(81, t0 + BEAT * 3.5, 0.40, 0.8, 3.5, 0.2)
        if b == 2:
            pn(84, t0, 0.42, 0.9, 3.0, 0.25)
            pn(76, t0 + BEAT * 2, 0.45, 0.8, 3.0, -0.2)
            pn(arpn[0] - 12, t0, 0.5, 0.7, 3.0, -0.3)
    elif s == "problem":                                    # ostinato tendu aux croches, notes hautes
        for i in range(8):
            m = arpn[[3, 4, 3, 5, 4, 3, 5, 6][i]]
            pn(m, t0 + i * BEAT / 2, 0.26 + 0.015 * i + 0.03 * (b - 3), 0.75, 1.2, 0.3 * (-1) ** i, 0.5)
    elif s == "solution":
        if b >= 6:                                           # arpège ascendant qui s'ouvre
            for i in range(8):
                m = arpn[[0, 2, 3, 4, 5, 4, 6, 5][i]] + (12 if i == 6 else 0)
                pn(m, t0 + i * BEAT / 2, 0.40 + 0.02 * i, 1.0, 2.0, -0.3 + 0.09 * i)
        pn(arpn[0] - 12, t0, 0.55, 0.7, 3.2, -0.3)
    elif s == "features":
        for i, sx in enumerate([0, 3, 6, 10, 12]):
            m = arpn[[2, 4, 3, 4, 5][i]]
            pn(m, t0 + sx * S16, 0.45, 0.9, 1.8, 0.25 * (-1) ** i, 0.42)
        pn(arpn[0] - 12, t0, 0.5, 0.8, 3.0, -0.3)
    elif s in ("local", "benefit"):
        for (bt_, m, d) in MEL.get(b, []):
            pn(m, t0 + bt_ * BEAT, 0.62, 1.0, 3.6, 0.1)
        pn(arpn[0] - 12, t0, 0.5, 0.7, 3.5, -0.3)
        pn(arpn[2], t0 + 2 * BEAT, 0.33, 0.7, 2.5, 0.2)
    elif s == "cta":
        if b < 24:
            for i, sx in enumerate([0, 3, 6, 8, 10, 12, 14]):
                pn(arpn[[2, 4, 3, 5, 4, 5, 6][i]], t0 + sx * S16, 0.55, 1.0, 1.6, 0.25 * (-1) ** i, 0.46)
            pn(arpn[0] - 12, t0, 0.6, 0.9, 3.0, -0.3)
        else:
            for i, m in enumerate([arpn[0] - 12, arpn[1], arpn[2], arpn[3], arpn[5], arpn[6]]):
                pn(m, t0 + i * 0.07, 0.55 - 0.04 * i, 1.0, 5.5, -0.3 + 0.12 * i)

# ================================================================= ARPÈGES (pluck + écho ping-pong)
ARP = [0, 2, 4, 2, 1, 3, 5, 3, 0, 2, 4, 2, 1, 3, 5, 6]
for b, name in enumerate(PROG):
    t0 = b * BAR
    arpn = CH[name][2]
    s = section(b)
    if s == "features":
        fi = (b - 9) / 5.0
        g, step = 0.20 + 0.12 * fi, 1
    elif s == "cta" and b < 24:
        g, step = 0.34 + 0.03 * (b - 21), 1
    elif s == "local":
        g, step = 0.10, 2
    elif s == "solution" and b == 8:
        g, step = 0.15, 2
    else:
        continue
    for i in range(0, 16, step):
        m = arpn[ARP[i]] + (12 if (b % 2 and i % 8 == 7) else 0)
        vel = 0.75 if i % 4 == 0 else 0.55
        arp_dry.put(pluck(hz(m), 0.42, vel), t0 + i * S16, g, 0.35 * np.sin(i * 0.9))
arp_mono = arp_dry.a.mean(axis=1)
arp_echo = pingpong(arp_mono, delay=S16 * 3, fb=0.38, taps=5)
arp_bus = Stereo(DUR + 5)
arp_bus.a[: min(len(arp_echo), arp_bus.n)] += arp_echo[: arp_bus.n]

# ================================================================= PERCUSSIONS
def every(t0, t1, step):
    t = t0
    while t < t1 - 1e-6:
        yield t
        t += step


# accroche : battement de coeur
kick_at(bt(4.0), 0.5, 0.4)
kick_at(bt(5.0), 0.4, 0.3)
for b_ in (6, 7, 8):
    kick_at(bt(b_), 0.5 + 0.05 * (b_ - 6), 0.45)
for b_ in (10, 11):
    kick_at(bt(b_), 0.7, 0.55)

# problème : kick à chaque temps, claps, doubles-croches, roulement
for t in every(bt(12), bt(23), BEAT):
    kick_at(t, 0.95, 0.7)
for t in every(bt(14), bt(22), BEAT * 2):
    drum_bus.put(clap(0.85), t + BEAT, 0.5)
for t in every(bt(16), bt(20), S16 * 2):
    drum_bus.put(hat(0.4 + 0.3 * (int(round(t / S16)) % 4 == 0)), t, 0.22)
for t in every(bt(20), bt(23), S16):
    drum_bus.put(hat(0.5), t, 0.24)
for i, t in enumerate(every(bt(20.0), bt(23.2), S16 * 2)):     # roulement de caisse claire qui s'accélère
    drum_bus.put(hp(clap(0.55), 700), t, 0.10 + 0.012 * i)

# solution : le kick entre au bar 7
for t in every(bt(28), bt(36), BEAT):
    kick_at(t, 0.88, 0.62)
for t in every(bt(30), bt(36), BEAT):
    drum_bus.put(hat(0.45, open_=True), t + BEAT / 2, 0.26)

# fonctions : groove complet, qui se charge à chaque fonction
for t in every(bt(36), bt(60), BEAT):
    kick_at(t, 0.92, 0.68)
for t in every(bt(36), bt(60), BEAT):
    drum_bus.put(hat(0.55, open_=True), t + BEAT / 2, 0.28)
for t in every(bt(38), bt(60), S16 * 2):
    drum_bus.put(hat(0.3 + 0.2 * rng.random()), t, 0.20)
for t in every(bt(38), bt(60), BEAT * 2):
    drum_bus.put(clap(0.85), t + BEAT, 0.52)
for t in every(bt(48), bt(60), S16):                              # fonction 3 et 4 : shaker en doubles-croches
    perc_bus.put(hat(0.28 + 0.22 * (int(round(t / S16)) % 2 == 1)), t, 0.16)
for k_ in (1, 2, 3):                                              # petits fills avant chaque nouvelle fonction (b = 42, 48, 54)
    bk = 36 + 6 * k_
    for i, t in enumerate(every(bt(bk - 0.75), bt(bk), S16)):
        drum_bus.put(hp(clap(0.55), 800), t, 0.12 + 0.05 * i)
    fx_bus.put(noise_riser(BEAT * 1.5, 500, 9000, 2.0, 0.35), bt(bk - 1.5), 0.55)

# ancrage local : demi-tempo, très aéré
for t in every(bt(60), bt(68), BEAT * 2):
    kick_at(t, 0.7, 0.5)
for t in every(bt(64), bt(69.5), BEAT):
    drum_bus.put(hat(0.3), t + BEAT / 2, 0.16)
for i, t in enumerate(every(bt(68.5), bt(72), S16 * 2)):          # montée vers le bénéfice
    drum_bus.put(hp(clap(0.55), 800), t, 0.10 + 0.01 * i)
for t in every(bt(70), bt(72), BEAT):
    kick_at(t, 0.85, 0.6)

# bénéfice : respiration puis retour du rythme
for t in every(bt(72), bt(80), BEAT * 2):
    kick_at(t, 0.5, 0.36)
for t in every(bt(80), bt(84), BEAT):
    kick_at(t, 0.9, 0.66)
for t in every(bt(80), bt(83.4), S16 * 2):
    drum_bus.put(hat(0.45), t, 0.22)
for i, t in enumerate(every(bt(82.0), bt(84), S16)):
    drum_bus.put(hp(clap(0.55), 800), t, 0.10 + 0.012 * i)

# appel à l'action : tout y est
for t in every(bt(84), bt(96), BEAT):
    kick_at(t, 1.0, 0.72)
for t in every(bt(84), bt(96), BEAT):
    drum_bus.put(hat(0.6, open_=True), t + BEAT / 2, 0.30)
for t in every(bt(84), bt(96), S16):
    drum_bus.put(hat(0.35 + 0.35 * (int(round(t / S16)) % 4 == 0)), t, 0.22 + 0.04 * (t > bt(90)))
for t in every(bt(84), bt(96), BEAT * 2):
    drum_bus.put(clap(0.95), t + BEAT, 0.56)
drum_bus.put(hat(0.8, open_=True), bt(96), 0.3)

# ================================================================= RISERS
fx_bus.put(noise_riser(BEAT * 4, 250, 9500, 2.0, 0.55), bt(8), 0.60)
fx_bus.put(sine_sweep(BEAT * 4, 180, 1500, 0.22), bt(8), 0.50)
fx_bus.put(noise_riser(BEAT * 3.2, 300, 10000, 2.0, 0.5), bt(20), 0.55)
fx_bus.put(noise_riser(BEAT * 4, 250, 9500, 2.0, 0.55), bt(68), 0.55)
fx_bus.put(sine_sweep(BEAT * 4, 180, 1700, 0.2), bt(68), 0.50)
fx_bus.put(noise_riser(BEAT * 4, 250, 10500, 2.0, 0.60), bt(80), 0.60)
fx_bus.put(sine_sweep(BEAT * 4, 200, 1900, 0.22), bt(80), 0.50)

# ================================================================= RÉVERB + MIX
def wet(bus, rt, mix, damp=1.0, seed=1):
    return reverb(bus.a, rt, 0.02, damp, seed) * mix


pad_rev = wet(pad_bus, 3.4, 0.55, 0.9, 11)
key_rev = wet(key_bus, 2.6, 0.55, 1.0, 12)
arp_rev = wet(arp_bus, 2.0, 0.30, 1.0, 13)
fx_rev = wet(fx_bus, 3.0, 0.45, 0.9, 14)
drum_rev = wet(drum_bus, 0.9, 0.12, 1.0, 15)

N = int(DUR * SR)
cut = lambda a: a[:N]
# sidechain : nappes, piano, arpèges et basse « respirent » avec chaque kick
kick_env = np.ones(N)
for t in KICKS:
    i = int(t * SR); n = int(0.30 * SR)
    if i + n < N:
        kick_env[i:i + n] = np.minimum(kick_env[i:i + n], 0.68 + 0.32 * (1 - np.exp(-np.arange(n) / SR / 0.10)))
side = kick_env[:, None]
mix = (cut(pad_bus.a) + cut(pad_rev) + cut(arp_bus.a) + cut(arp_rev) + cut(key_bus.a) + cut(key_rev)) * (0.55 + 0.45 * side) \
    + cut(bass_bus.a) * side + cut(drum_bus.a) + cut(drum_rev) + cut(perc_bus.a) + cut(fx_bus.a) + cut(fx_rev)

# enveloppe générale : entrée progressive, trou de silence avant l'éclosion, extinction finale
t = np.arange(N) / SR
g = np.clip(t / 1.4, 0, 1) ** 1.6
g *= np.clip((DUR - t) / 2.2, 0, 1) ** 1.3
gap0, gap1 = bt(23.25), bt(24.0)                                   # 13,95 s → 14,4 s : presque rien, puis éclosion
g *= 1 - 0.93 * np.clip((t - gap0) / 0.06, 0, 1) * (t < gap1)
# relief dynamique par section (en dB) : l'ancrage local et le bénéfice respirent, l'appel à l'action est le plus plein
pts = [(0, 0), (12, 0.5), (36, 0.5), (36.5, 0), (59.5, 0), (60.5, -3.2), (71, -3.2), (72.5, -2.6), (79, -2.6), (82, 0), (84, 1.2), (98, 1.2), (100, 0)]
sec_db = np.interp(t, [bt(p_[0]) for p_ in pts], [p_[1] for p_ in pts])
g *= 10 ** (sec_db / 20)
mix = mix * g[:, None]

mix = hp(mix, 28, 2)
mix = np.tanh(mix * 0.9) / 0.9
mix = mix / np.abs(mix).max() * 0.85
(ROOT / "audio/stems").mkdir(exist_ok=True)
sf.write(ROOT / "audio/stems/noir_music.flac", mix.astype(np.float32), SR, subtype="PCM_24")

r = np.sqrt(np.mean(mix.reshape(-1, 2)[: (len(mix) // SR) * SR].reshape(-1, SR, 2) ** 2, axis=(1, 2)))
print("RMS (dBFS) par seconde :")
print(" ".join(f"{20*np.log10(v+1e-9):.0f}" for v in r))
print("crête", round(20 * np.log10(np.abs(mix).max()), 2), "dBFS")
