"""Mixage final « Noir & Blanc » : musique + effets sonores (pas de voix) → public/audio/noir_soundtrack.wav
La musique s'efface légèrement sous les gros impacts pour qu'ils claquent ; niveau final −14 LUFS, crête ≤ −1,5 dBFS.

Entrées : audio/stems/noir_music.flac, audio/stems/noir_sfx.flac
Usage   : cd audio && python noir_mix.py
"""
from pathlib import Path
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import butter, sosfilt, sosfiltfilt
from dsp import SR

ROOT = Path(__file__).resolve().parent.parent


def load(p):
    a, sr = sf.read(p, dtype="float64", always_2d=True)
    assert sr == SR
    return a


def main():
    n = int(60 * SR)
    music = np.pad(load(ROOT / "audio/stems/noir_music.flac"), ((0, n), (0, 0)))[:n]
    sfx = np.pad(load(ROOT / "audio/stems/noir_sfx.flac"), ((0, n), (0, 0)))[:n]

    # la musique se « creuse » (surtout les médiums) quand un effet fort passe
    e = np.abs(sfx).mean(axis=1)
    e = sosfiltfilt(butter(2, 12, "low", fs=SR, output="sos"), e)
    e = e / (np.percentile(e, 99.5) + 1e-9)
    duck = np.clip((e - 0.12) / 0.5, 0, 1) * 0.30
    music_d = music * (1 - duck)[:, None]

    mix = music_d * 0.82 + sfx * 1.0

    mix = sosfilt(butter(2, 28, "high", fs=SR, output="sos"), mix, axis=0)
    mix = mix + 0.22 * sosfilt(butter(2, 6000, "high", fs=SR, output="sos"), mix, axis=0)   # un peu d'air (+1,7 dB au-dessus de 6 kHz)
    meter = pyln.Meter(SR)
    mix = mix * 10 ** ((-14.0 - meter.integrated_loudness(mix)) / 20)
    peak = np.abs(mix).max()
    if peak > 0.84:
        k = 0.84
        mix = np.tanh(mix / k * 0.9) * k / np.tanh(0.9)
    mix = mix * (10 ** (-1.5 / 20) / np.abs(mix).max())
    mix = mix * 10 ** ((-14.0 - meter.integrated_loudness(mix)) / 20) if meter.integrated_loudness(mix) > -14.0 else mix
    f = int(0.05 * SR)
    mix[-f:] *= np.linspace(1, 0, f)[:, None]
    sf.write(ROOT / "public/audio/noir_soundtrack.wav", mix.astype(np.float32), SR, subtype="PCM_16")
    print(f"loudness intégré : {meter.integrated_loudness(mix):.1f} LUFS, crête : {20*np.log10(np.abs(mix).max()):.1f} dBFS → noir_soundtrack.wav")


if __name__ == "__main__":
    main()
