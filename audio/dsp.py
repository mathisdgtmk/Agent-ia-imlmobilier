"""Briques de synthèse audio (numpy/scipy) partagées par la musique et les effets sonores."""
import numpy as np
from scipy.signal import butter, sosfilt, sosfiltfilt, fftconvolve

SR = 48000
rng = np.random.default_rng(2024)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR * 0.45), "low", fs=SR, output="sos"), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, min(hi, SR * 0.45)], "band", fs=SR, output="sos"), x)


def env_ad(n, a, d_tau, floor=0.0):
    t = np.arange(n) / SR
    att = 1 - np.exp(-t / max(a, 1e-4))
    return att * (np.exp(-t / d_tau) * (1 - floor) + floor)


def fade(x, fin=0.005, fout=0.02):
    n = len(x)
    a, b = int(fin * SR), int(fout * SR)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


# ------------------------------------------------------------------ instruments
def piano(freq, dur=3.2, vel=0.8, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    base = 0.55 + freq / 500.0
    for k in range(1, 14):
        f = freq * k * np.sqrt(1 + 0.00035 * k * k)
        if f > 9000:
            break
        a = vel / (k ** (1.05 + 0.25 * (1 - bright)))
        dec = np.exp(-t * base * (1 + 0.55 * (k - 1)))
        y += a * np.sin(2 * np.pi * f * t + k * 0.7) * dec
    thump = lp(rng.normal(0, 1, n), 700) * np.exp(-t / 0.012) * 0.10 * vel
    y = y * (1 - np.exp(-t / 0.0025)) + thump
    return fade(lp(y, 5200 * bright + 1200))


def pad_note(freq, dur, cutoff=2200, spread=(-8.0, 0.0, 9.0), phase_seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    r = np.random.default_rng(phase_seed)
    for cents in spread:
        f0 = freq * 2 ** (cents / 1200)
        ph0 = r.uniform(0, 2 * np.pi)
        kmax = int(min(24, cutoff * 2.2 / f0))
        k = np.arange(1, max(kmax, 2) + 1)[:, None]
        y += (np.sin(2 * np.pi * f0 * k * t[None, :] + ph0 * k) / k).sum(axis=0)
    y = lp(y, cutoff, 2)
    return y / (len(spread) * 1.6)


def pluck(freq, dur=0.5, vel=0.8, decay=7.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    kmax = int(min(22, 9000 / freq))
    for k in range(1, kmax + 1):
        y += np.sin(2 * np.pi * freq * k * t) / k * np.exp(-t * (decay + 1.5 * k))
    y *= (1 - np.exp(-t / 0.002)) * np.exp(-t / (dur * 0.55)) * vel
    return fade(y, 0.001, 0.02)


def sub(freq, dur, vel=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * freq * t) + 0.28 * np.sin(2 * np.pi * 2 * freq * t + 0.4)
    y = np.tanh(1.6 * y) * 0.62
    env = (1 - np.exp(-t / 0.012)) * np.exp(-np.maximum(t - dur * 0.55, 0) / (dur * 0.14 + 1e-3))
    return fade(y * env * vel, 0.002, 0.03)


def kick(vel=1.0, dur=0.55):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 44 + 95 * np.exp(-t / 0.028)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / 0.17) + 0.22 * lp(rng.normal(0, 1, n), 4000) * np.exp(-t / 0.004)
    return fade(np.tanh(1.3 * y) * vel, 0.0005, 0.05)


def clap(vel=0.8, dur=0.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for off, a in ((0, 0.6), (0.011, 0.8), (0.023, 1.0)):
        i = int(off * SR)
        y[i:] += a * rng.normal(0, 1, n - i) * np.exp(-t[: n - i] / 0.006)
    tail = rng.normal(0, 1, n) * np.exp(-t / 0.11) * 0.55
    y = bp(y + tail, 900, 6500)
    return fade(y * vel * 0.9, 0.0005, 0.04)


def hat(vel=0.5, open_=False):
    dur = 0.35 if open_ else 0.09
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = hp(rng.normal(0, 1, n), 7500, 3) * np.exp(-t / (0.11 if open_ else 0.022))
    return fade(y * vel * 0.5, 0.0003, 0.01)


def noise_riser(dur, f0=300, f1=11000, curve=2.2, amp=1.0):
    n = int(dur * SR)
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    blk = 1024
    zi = None
    for i in range(0, n, blk):
        p = (i / n) ** curve
        fc = f0 * (f1 / f0) ** p
        sos = butter(2, [min(fc * 0.55, SR * 0.4), min(fc * 1.1, SR * 0.45)], "band", fs=SR, output="sos")
        seg, _ = sosfilt(sos, x[i : i + blk], zi=np.zeros((sos.shape[0], 2)))
        out[i : i + blk] = seg
    env = (np.arange(n) / n) ** 2.2
    return fade(out * env * amp * 3.0, 0.01, 0.005)


def sine_sweep(dur, f0, f1, amp=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return fade(y * (t / dur) ** 1.8 * amp, 0.01, 0.005)


def boom(dur=3.0, f0=62, f1=34, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.35)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 1.15)
    burst = lp(rng.normal(0, 1, n), 1800) * np.exp(-t / 0.28) * 0.5
    return fade((y + burst) * amp, 0.001, 0.2)


# ------------------------------------------------------------------ espace
def make_ir(rt60=2.4, pre=0.018, damp=1.0, seed=1):
    r = np.random.default_rng(seed)
    n = int((rt60 * 1.15 + pre) * SR)
    t = np.arange(n) / SR
    outs = []
    for ch in range(2):
        x = r.normal(0, 1, n)
        bright = lp(x, 9000 * damp)
        dark = lp(x, 2400 * damp)
        w = np.exp(-t / 0.22)
        y = bright * w + dark * (1 - w)
        y *= np.exp(-6.91 * t / rt60)
        y[: int(pre * SR)] = 0
        y *= 1 - np.exp(-t / 0.01)
        outs.append(y)
    ir = np.stack(outs, axis=1)
    return ir / np.sqrt((ir**2).sum())


def reverb(x, rt60=2.4, pre=0.018, damp=1.0, seed=1):
    """x: (n,2) ou (n,) -> retourne la partie 100 % réverbérée, stéréo, même longueur."""
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    ir = make_ir(rt60, pre, damp, seed)
    wet = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return wet


def pingpong(x, delay=0.46875, fb=0.36, taps=6, tone=3500):
    """x mono -> stéréo avec écho ping-pong."""
    d = int(delay * SR)
    n = len(x) + d * (taps + 1)
    L, R = np.zeros(n), np.zeros(n)
    cur = x.copy()
    L[: len(x)] += x * 0.9
    R[: len(x)] += x * 0.9
    for i in range(1, taps + 1):
        cur = lp(cur, tone, 1) * fb
        tgt = R if i % 2 else L
        tgt[i * d : i * d + len(cur)] += cur
    return np.stack([L, R], axis=1)


class Stereo:
    def __init__(self, dur):
        self.n = int(dur * SR)
        self.a = np.zeros((self.n, 2), dtype=np.float64)

    def put(self, sig, t0, gain=1.0, pan=0.0):
        if sig.ndim == 1:
            sig = np.stack([sig, sig], axis=1)
        i = int(round(t0 * SR))
        if i >= self.n:
            return
        j = min(self.n, i + len(sig))
        seg = sig[: j - i]
        gl = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2) / 1.0
        gr = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2) / 1.0
        self.a[i:j, 0] += seg[:, 0] * gain * gl / np.sqrt(2)
        self.a[i:j, 1] += seg[:, 1] * gain * gr / np.sqrt(2)
