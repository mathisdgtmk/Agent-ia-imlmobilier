"""Planche‑contact d'un MP4 : une image toutes les N secondes, pour vérifier d'un coup d'œil l'enchaînement.
Usage : python scripts/contact_sheet.py out/agent-ia-immobilier-16x9.mp4 planche.png [pas_en_secondes=2] [colonnes=5] [largeur_vignette=480]
"""
import subprocess, sys, tempfile, math
from pathlib import Path
import imageio_ffmpeg
from PIL import Image, ImageDraw

src, dst = sys.argv[1], sys.argv[2]
step = float(sys.argv[3]) if len(sys.argv) > 3 else 2.0
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 5
thumb = int(sys.argv[5]) if len(sys.argv) > 5 else 480
ff = imageio_ffmpeg.get_ffmpeg_exe()

info = subprocess.run([ff, "-hide_banner", "-i", src], capture_output=True, text=True).stderr
dur = 60.0
for line in info.splitlines():
    if "Duration" in line:
        h, m, s = line.split("Duration:")[1].split(",")[0].strip().split(":")
        dur = int(h) * 3600 + int(m) * 60 + float(s)

times = [i * step for i in range(int(dur // step) + 1)]
tmp = Path(tempfile.mkdtemp())
frames = []
for t in times:
    out = tmp / f"f{t:06.2f}.png"
    subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-ss", str(t), "-i", src, "-frames:v", "1", "-vf", f"scale={thumb}:-1", str(out)], check=True)
    if out.exists():
        frames.append((t, Image.open(out)))
w, h = frames[0][1].size
rows = math.ceil(len(frames) / cols)
sheet = Image.new("RGB", (cols * w, rows * h), (0, 0, 0))
d = ImageDraw.Draw(sheet)
for i, (t, im) in enumerate(frames):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im, (x, y))
    d.rectangle([x, y, x + 64, y + 20], fill=(0, 0, 0))
    d.text((x + 4, y + 4), f"{t:5.1f}s", fill=(255, 226, 160))
sheet.save(dst)
print("planche :", dst, sheet.size)
