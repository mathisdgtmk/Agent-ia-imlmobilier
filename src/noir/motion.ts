import {Easing} from 'remotion';
import {BEAT, SHAKES} from './timeline';

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const smooth = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.out(Easing.back(1.7));
export const backOutSoft = Easing.out(Easing.back(1.15));
export const sharpIn = Easing.bezier(0.7, 0, 0.84, 0);
export const lin = (n: number) => n;

/** Progression 0→1 qui démarre à `a` et dure `d` secondes. */
export const pr = (t: number, a: number, d: number, e: (n: number) => number = expoOut) => e(clamp01((t - a) / Math.max(1e-6, d)));

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Pulsation sur le tempo : 1 pile sur le temps, retombe vite. */
export const beatPulse = (t: number, k = 5) => {
  const ph = ((t / BEAT) % 1 + 1) % 1;
  return Math.exp(-ph * k);
};

/** Secousse de caméra cumulée des impacts (x, y en px relatifs, r en degrés). */
export const shakeAt = (t: number) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const s of SHAKES) {
    const d = t - s.t;
    if (d < 0 || d > 0.7) continue;
    const k = s.amp * Math.exp(-d * 9);
    x += k * Math.sin(d * 93) * 1;
    y += k * Math.sin(d * 77 + 1.3) * 0.8;
    r += k * Math.sin(d * 61 + 0.4) * 0.05;
  }
  return {x, y, r};
};

/** Instants où l'image « claque » en blanc (en secondes) : liste fournie par les scènes. */
export const flashAt = (t: number, times: number[], len = 0.1) => {
  let m = 0;
  for (const f of times) {
    const d = t - f;
    if (d >= 0 && d < len) m = Math.max(m, 1 - d / len);
  }
  return m;
};
