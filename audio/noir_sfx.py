"""Effets sonores « Noir & Blanc » : un bruit d'animation à chaque apparition de texte, d'interface, de coupe.
Tout est synthétisé (aucun échantillon tiers). Les instants viennent de data/noir.json (même fichier que l'image).

Sortie : audio/stems/noir_sfx.flac (48 kHz stéréo, 60 s)
Usage  : cd audio && python noir_sfx.py
"""
import json
from pathlib import Path
import numpy as np
import soundfile as sf
from dsp import *  # noqa
import build_sfx as base  # effets déjà éprouvés : shimmer, whoosh, ring, notif_*, send, recv, tick, confirm, sweep, bloom, button…

ROOT = Path(__file__).resolve().parent.parent
DUR = 60.0
r = np.random.default_rng(404)
st = base.stereo_from_mono


def sfx_hit(vel=1.0):
    """Impact sec : grave qui plonge + claque haute."""
    n = int(1.1 * SR)
    t = np.arange(n) / SR
    f = 38 + 85 * np.exp(-t / 0.045)
    low = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.32)
    crack = bp(r.normal(0, 1, n), 1800, 9000) * np.exp(-t / 0.018) * 0.55
    body = lp(r.normal(0, 1, n), 700) * np.exp(-t / 0.09) * 0.35
    y = np.tanh(1.4 * (low + crack + body)) * 0.8 * vel
    return st(fade(y, 0.0005, 0.08), 1, 6)


def sfx_slam():
    """Coupe franche sur la mesure : boum + claque + souffle qui retombe."""
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    f = 34 + 110 * np.exp(-t / 0.05)
    low = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.55)
    crack = bp(r.normal(0, 1, n), 1200, 10000) * np.exp(-t / 0.03) * 0.7
    air = hp(r.normal(0, 1, n), 2500) * np.exp(-t / 0.35) * 0.12
    mid = bp(r.normal(0, 1, n), 120, 600) * np.exp(-t / 0.18) * 0.5
    y = np.tanh(1.7 * (low + crack + mid)) * 0.8 + air
    return st(fade(y, 0.0005, 0.25), 1, 9)


def sfx_thud():
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    f = 52 + 70 * np.exp(-t / 0.03)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.13)
    y += bp(r.normal(0, 1, n), 1500, 6000) * np.exp(-t / 0.012) * 0.3
    return st(fade(np.tanh(1.3 * y) * 0.8, 0.0005, 0.05), 0)


def sfx_swish():
    """Révélation d'une ligne de texte : petit souffle rapide qui monte."""
    dur = 0.3
    n = int(dur * SR)
    x = r.normal(0, 1, n)
    out = np.zeros(n)
    blk = 256
    for i in range(0, n, blk):
        p = i / n
        fc = 1400 * (7500 / 1400) ** (p ** 0.8)
        sos = butter(2, [fc * 0.6, min(fc * 1.35, SR * 0.45)], "band", fs=SR, output="sos")
        seg, _ = sosfilt(sos, x[i : i + blk], zi=np.zeros((sos.shape[0], 2)))
        out[i : i + blk] = seg
    e = np.sin(np.pi * np.arange(n) / n) ** 1.6
    y = out * e * 1.8
    pan = np.linspace(-0.35, 0.35, n)
    return np.stack([y * np.sqrt((1 - pan) / 2) * 1.2, y * np.sqrt((1 + pan) / 2) * 1.2], axis=1)


def sfx_pop():
    n = int(0.26 * SR)
    t = np.arange(n) / SR
    f = 420 * (980 / 420) ** np.minimum(t / 0.05, 1.0)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.045) * (1 - np.exp(-t / 0.002)) * 0.5
    y += hp(r.normal(0, 1, n), 5000) * np.exp(-t / 0.005) * 0.05
    return st(fade(y, 0.0005, 0.02), 0)


def sfx_click():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    y = bp(r.normal(0, 1, n), 2200, 7000) * np.exp(-t / 0.006) * 0.5
    y += np.sin(2 * np.pi * 1850 * t) * np.exp(-t / 0.018) * 0.25
    tock = np.sin(2 * np.pi * 240 * t) * np.exp(-t / 0.03) * 0.5
    d = int(0.052 * SR)
    y[d:] += (bp(r.normal(0, 1, n - d), 1800, 6000) * np.exp(-t[: n - d] / 0.004) * 0.3 + np.sin(2 * np.pi * 1500 * t[: n - d]) * np.exp(-t[: n - d] / 0.012) * 0.15)
    y += tock
    return st(fade(y, 0.0003, 0.02), 0)


def sfx_chime():
    return base.seq([1568, 2093.0], 0.12, 0.9, 0.38, 1.6)


def sfx_ping():
    """Sonar : ping pur + écho lointain."""
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 1318.5 * t) * np.exp(-t / 0.42) * (1 - np.exp(-t / 0.003)) * 0.55
    y += np.sin(2 * np.pi * 2637 * t) * np.exp(-t / 0.18) * 0.12
    y += np.sin(2 * np.pi * 659.3 * t) * np.exp(-t / 0.6) * 0.12
    y = lp(y, 6000)
    echo = pingpong(y[: int(1.0 * SR)], delay=0.36, fb=0.34, taps=3, tone=2500)
    out = np.zeros((n, 2))
    out[:, 0] += y * 0.8
    out[:, 1] += y * 0.8
    m = min(n, len(echo))
    out[:m] += echo[:m] * 0.5
    return out


def sfx_bell():
    n = int(4.0 * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for ratio, a, dec in ((1, 1.0, 1.7), (2.0, 0.5, 1.2), (2.76, 0.32, 0.9), (4.07, 0.18, 0.55), (5.4, 0.14, 0.4), (8.93, 0.06, 0.2)):
        y += a * np.sin(2 * np.pi * 523.25 * ratio * t + 0.3 * ratio) * np.exp(-t / dec)
    y *= (1 - np.exp(-t / 0.003)) * 0.38
    swell = np.sin(2 * np.pi * 110 * t) * np.exp(-t / 1.1) * 0.25 * (1 - np.exp(-t / 0.04))
    return st(fade(y + swell, 0.001, 0.4), 1, 15)


def sfx_glitch():
    """Bégaiement numérique : tranches de bruit / sinus hachées, échantillonnées-bloquées."""
    dur = 0.55
    n = int(dur * SR)
    y = np.zeros(n)
    i = 0
    while i < n:
        seg = int(r.uniform(0.012, 0.05) * SR)
        kind = r.integers(0, 3)
        tt_ = np.arange(min(seg, n - i)) / SR
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * r.uniform(300, 2400) * tt_)) * 0.35
        elif kind == 1:
            s = hp(r.normal(0, 1, len(tt_)), 3000) * 0.4 if len(tt_) > 16 else 0
        else:
            s = np.zeros(len(tt_))
        y[i : i + len(tt_)] += s
        i += seg + int(r.uniform(0.0, 0.02) * SR)
    hold = 6
    y = np.repeat(y[::hold], hold)[:n]
    y *= np.linspace(1, 0.2, n)
    return st(fade(y * 0.7, 0.001, 0.03), 1, 5)


def sfx_boom():
    return st(boom(3.2, 58, 32, 0.9), 1, 13)


def sfx_riser_dur(dur):
    n = int(dur * SR)
    a = noise_riser(dur, 250, 11000, 2.0, 0.8)
    b = sine_sweep(dur, 160, 2200, 0.25)
    y = a[:n] + b[:n]
    pan = np.linspace(-0.4, 0.4, n)
    return np.stack([y * np.sqrt((1 - pan) / 2), y * np.sqrt((1 + pan) / 2)], axis=1)


TYPES = {
    "shimmer": base.sfx_shimmer, "whoosh": lambda: base.sfx_whoosh(1.0), "whoosh_soft": lambda: base.sfx_whoosh(0.5, 0.6, 500, 3200),
    "ring": base.sfx_ring, "notif_a": base.sfx_notif_a, "notif_b": base.sfx_notif_b, "notif_c": base.sfx_notif_c,
    "downshift": base.sfx_downshift, "bloom": base.sfx_bloom, "send": base.sfx_send, "recv": base.sfx_recv, "tick": base.sfx_tick,
    "confirm": base.sfx_confirm, "sweep": base.sfx_sweep, "button": base.sfx_button,
    "hit": sfx_hit, "slam": sfx_slam, "thud": sfx_thud, "swish": sfx_swish, "pop": sfx_pop, "click": sfx_click, "chime": sfx_chime,
    "ping": sfx_ping, "bell": sfx_bell, "glitch": sfx_glitch, "boom": sfx_boom,
}


def main():
    plan = json.loads((ROOT / "data/noir.json").read_text())
    beat = 60.0 / plan["bpm"]
    bus = Stereo(DUR + 4)
    used, count = set(), 0
    for c in plan["cues"]:
        typ = c.get("sfx")
        if typ == "riser":
            sig = sfx_riser_dur(c.get("dur", 1.5))
        elif typ in TYPES:
            sig = TYPES[typ]()
        else:
            raise SystemExit(f"Type d'effet inconnu : {typ} (repère {c['id']})")
        times = [b * beat for b in c["bs"]] if "bs" in c else [c["b"] * beat]
        # les effets « montants » démarrent avant le repère pour que leur pic tombe sur l'image
        lead = {"whoosh": 0.42, "whoosh_soft": 0.3, "sweep": 0.85, "button": 0.0}.get(typ, 0.0)
        for i, t0 in enumerate(times):
            pan = 0.0 if len(times) == 1 else 0.25 * np.sin(i * 1.7)
            bus.put(sig, max(0.0, t0 - lead), c.get("gain", 0.5), pan)
            count += 1
        used.add(typ)
    wet = reverb(bus.a, 1.3, 0.012, 1.0, 31) * 0.26
    out = (bus.a + wet)[: int(DUR * SR)]
    out = hp(out, 70, 2)
    peak = np.abs(out).max()
    if peak > 0.9:
        out = out / peak * 0.9
    (ROOT / "audio/stems").mkdir(exist_ok=True, parents=True)
    sf.write(ROOT / "audio/stems/noir_sfx.flac", out.astype(np.float32), SR, subtype="PCM_24")
    print(f"{count} effets posés ({len(used)} types), crête {20*np.log10(np.abs(out).max()+1e-9):.1f} dBFS")


if __name__ == "__main__":
    main()
