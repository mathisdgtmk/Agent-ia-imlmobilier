"""Effets sonores discrets (notifications, transitions, sons numériques) synthétisés, calés sur data/cues.json.

Entrée  : src/data/timeline.json (généré par build_voice.py, contient les repères "cues")
Sortie  : audio/stems/sfx.flac (48 kHz stéréo, 60 s)
Usage   : python audio/build_sfx.py
"""
import json
from pathlib import Path
import numpy as np
import soundfile as sf
from dsp import *  # noqa

ROOT = Path(__file__).resolve().parent.parent
DUR = 60.0
r = np.random.default_rng(99)


def tone(f, dur, decay=0.25, amp=1.0, partials=((1, 1.0), (2.76, 0.28), (5.4, 0.08)), attack=0.002):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for ratio, a in partials:
        y += a * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / (decay / (1 + 0.5 * (ratio - 1))))
    y *= 1 - np.exp(-t / attack)
    return fade(y * amp, 0.001, 0.02)


def stereo_from_mono(x, width=0.0, delay_ms=11):
    d = int(delay_ms / 1000 * SR)
    L = np.concatenate([x, np.zeros(d)])
    R = np.concatenate([np.zeros(d), x]) if width else np.concatenate([x, np.zeros(d)])
    return np.stack([L, R], axis=1)


def sfx_shimmer():
    dur = 2.2
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for i, f in enumerate([2093, 2637, 3136, 3951, 4699]):
        st = int(i * 0.06 * SR)
        seg = tone(f, dur - i * 0.06, decay=0.9, amp=0.22)[: n - st]
        y[st : st + len(seg)] += seg
    sp = hp(r.normal(0, 1, n), 6500) * (np.sin(2 * np.pi * 9 * t) * 0.5 + 0.5) * np.exp(-t / 0.7) * 0.08
    y += sp
    return stereo_from_mono(y, 1, 17)


def sfx_whoosh(amp=1.0, dur=0.85, f0=350, f1=5200):
    n = int(dur * SR)
    x = r.normal(0, 1, n)
    out = np.zeros(n)
    blk = 512
    for i in range(0, n, blk):
        p = i / n
        fc = f0 * (f1 / f0) ** p
        sos = butter(2, [min(fc * 0.5, SR * 0.4), min(fc * 1.25, SR * 0.45)], "band", fs=SR, output="sos")
        seg, _ = sosfilt(sos, x[i : i + blk], zi=np.zeros((sos.shape[0], 2)))
        out[i : i + blk] = seg
    e = np.sin(np.pi * np.arange(n) / n) ** 2.2
    y = out * e * amp * 2.4
    pan = np.linspace(-0.6, 0.6, n)
    L = y * np.sqrt((1 - pan) / 2) * 1.2
    R = y * np.sqrt((1 + pan) / 2) * 1.2
    return np.stack([L, R], axis=1)


def sfx_ring():
    n = int(1.7 * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for start in (0.0, 0.62):
        m = (t > start) & (t < start + 0.42)
        tt = t - start
        car = np.sin(2 * np.pi * 480 * tt) + np.sin(2 * np.pi * 620 * tt)
        y += m * car * (0.5 + 0.5 * np.sin(2 * np.pi * 22 * tt)) * np.sin(np.pi * np.clip(tt / 0.42, 0, 1)) ** 0.6
    y = lp(y, 2600) * 0.16
    return stereo_from_mono(y, 1, 9)


def seq(notes, gap=0.09, decay=0.4, amp=0.5, dur=0.9):
    n = int(dur * SR)
    y = np.zeros(n)
    for i, f in enumerate(notes):
        tn = tone(f, dur - i * gap, decay=decay, amp=amp)
        st = int(i * gap * SR)
        seg = tn[: n - st]
        y[st : st + len(seg)] += seg
    return stereo_from_mono(y, 1, 13)


def sfx_notif_a():
    return seq([1318.5, 1975.5], 0.11, 0.35, 0.5)


def sfx_notif_b():
    return seq([1046.5, 1318.5, 1568], 0.085, 0.4, 0.45)


def sfx_notif_c():
    return seq([1568, 1174.7], 0.12, 0.4, 0.5)


def sfx_notif_soft():
    return stereo_from_mono(lp(tone(880, 0.5, 0.18, 0.5, partials=((1, 1.0), (2, 0.2))), 3500), 0)


def sfx_send():
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    f = 650 * (1350 / 650) ** (t / 0.12)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.07) * (1 - np.exp(-t / 0.003)) * 0.32
    y += hp(r.normal(0, 1, n), 4500) * np.exp(-t / 0.01) * 0.05
    return stereo_from_mono(y, 0)


def sfx_recv():
    return seq([880, 1174.7], 0.085, 0.22, 0.4, 0.6)


def sfx_tick():
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 2093 * t) * np.exp(-t / 0.03) * 0.35
    y += tone(3136, 0.16, 0.05, 0.12)[:n]
    y += hp(r.normal(0, 1, n), 6000) * np.exp(-t / 0.004) * 0.06
    return stereo_from_mono(fade(y, 0.0005, 0.01), 0)


def sfx_confirm():
    return seq([1046.5, 1318.5, 1568, 2093], 0.075, 0.55, 0.42, 1.3)


def sfx_shot():
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    y = bp(r.normal(0, 1, n), 1800, 5200) * np.exp(-t / 0.05) * 0.16
    kk = lp(kick(0.5, 0.25), 120) * 0.18
    y[: len(kk)] += kk
    return stereo_from_mono(y, 1, 7)


def sfx_thump():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    y = lp(kick(1.0, 0.6), 160)
    y = np.pad(y, (0, n - len(y)))[:n] * 0.9
    sh = tone(1568, 1.2, 0.5, 0.14)[:n] + tone(2093, 1.2, 0.5, 0.10)[:n]
    return stereo_from_mono(y + sh, 1, 11)


def sfx_downshift():
    dur = 1.3
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 700 * (55 / 700) ** (t / dur)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 - t / dur) ** 1.4 * 0.26
    nz = lp(r.normal(0, 1, n), 400) * np.exp(-t / 0.6) * 0.20
    return stereo_from_mono(y + nz, 1, 9)


def sfx_sweep():
    dur = 1.1
    up = noise_riser(dur, 500, 9000, 1.6, 0.55)
    sw = sine_sweep(dur, 300, 3200, 0.16)
    y = up + sw
    sh = tone(3136, 1.4, 0.7, 0.16)
    out = np.zeros(int(1.9 * SR))
    out[: len(y)] += y
    st = int(0.95 * SR)
    out[st : st + len(sh)] += sh[: len(out) - st]
    return stereo_from_mono(out, 1, 13)


def sfx_button():
    a = seq([1318.5, 1975.5, 2637], 0.07, 0.45, 0.4, 1.0)
    w = sfx_whoosh(0.25, 0.4, 900, 4200)
    out = np.zeros((int(1.0 * SR), 2))
    out[: len(a)] += a[: len(out)]
    out[: len(w)] += w[: len(out)]
    return out


def sfx_bloom():
    dur = 2.4
    n = int(dur * SR)
    sh = sfx_shimmer()
    y = np.zeros((n, 2))
    y[: len(sh)] += sh[:n] * 1.3
    burst = lp(r.normal(0, 1, int(0.3 * SR)), 5000) * np.exp(-np.arange(int(0.3 * SR)) / SR / 0.06) * 0.25
    y[: len(burst), 0] += burst
    y[: len(burst), 1] += burst
    return y


TYPES = {
    "shimmer": sfx_shimmer, "whoosh": lambda: sfx_whoosh(1.0), "whoosh_soft": lambda: sfx_whoosh(0.5, 0.6, 500, 3200),
    "ring": sfx_ring, "notif_a": sfx_notif_a, "notif_b": sfx_notif_b, "notif_c": sfx_notif_c, "notif_soft": sfx_notif_soft,
    "downshift": sfx_downshift, "bloom": sfx_bloom, "send": sfx_send, "recv": sfx_recv, "tick": sfx_tick,
    "confirm": sfx_confirm, "shot": sfx_shot, "thump": sfx_thump, "sweep": sfx_sweep, "button": sfx_button,
}


def main():
    tl = json.loads((ROOT / "src/data/timeline.json").read_text())
    bus = Stereo(DUR + 3)
    used = set()
    for c in tl["cues"]:
        typ = c.get("sfx")
        if not typ:
            continue
        if typ not in TYPES:
            raise SystemExit(f"Type d'effet inconnu : {typ} (repère {c['id']})")
        sig = TYPES[typ]()
        # démarrer un peu avant le repère pour les effets "montants" (le pic tombe sur l'image)
        lead = {"whoosh": 0.42, "whoosh_soft": 0.3, "sweep": 0.85, "downshift": 0.0, "shimmer": 0.0}.get(typ, 0.0)
        bus.put(sig, max(0, c["t"] - lead), c.get("gain", 0.5))
        used.add(typ)
    wet = reverb(bus.a, 1.4, 0.012, 1.0, 21) * 0.32
    out = bus.a + wet
    out = out[: int(DUR * SR)]
    out = hp(out, 90, 2)
    peak = np.abs(out).max()
    if peak > 0.9:
        out = out / peak * 0.9
    (ROOT / "audio/stems").mkdir(exist_ok=True, parents=True)
    sf.write(ROOT / "audio/stems/sfx.flac", out.astype(np.float32), SR, subtype="PCM_24")
    print(f"{len(tl['cues'])} repères, {len(used)} types d'effets, crête {20*np.log10(np.abs(out).max()+1e-9):.1f} dBFS")


if __name__ == "__main__":
    main()
