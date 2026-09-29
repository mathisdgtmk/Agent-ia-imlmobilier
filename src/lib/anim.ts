import {Easing, interpolate} from 'remotion';

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1); // sortie très douce, type "expo"
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeSoft = Easing.bezier(0.33, 1, 0.68, 1);

/** Progression 0→1 entre deux instants (s), avec une courbe d'accélération. */
export const prog = (t: number, from: number, to: number, ease: (n: number) => number = easeOut) =>
  ease(clamp01((t - from) / Math.max(1e-6, to - from)));

/** Apparition-disparition : 0 → 1 → 0 */
export const window01 = (t: number, inFrom: number, inTo: number, outFrom: number, outTo: number) =>
  prog(t, inFrom, inTo) * (1 - prog(t, outFrom, outTo, easeInOut));

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const map = interpolate;
