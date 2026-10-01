import React from 'react';
import {AbsoluteFill, Easing, random} from 'remotion';
import {useLayout} from '../lib/layout';
import {clamp01, expoOut, lerp, pr, sharpIn, smooth} from './motion';

/** Effets « waouh » partagés : lettres 3D, éclats, lignes de vitesse, panneau à lamelles… (tout est déterministe : même image à chaque rendu). */

export const bounceOut = Easing.bounce;
export const elasticOut = Easing.out(Easing.elastic(1.1));
export const rnd = (seed: string, i: number) => random(`${seed}-${i}`);

// ------------------------------------------------------------------ lettres animées une à une
export type LettersMode = 'drop' | 'fly' | 'zoom' | 'flip' | 'type' | 'slam';

/**
 * Texte dont chaque lettre arrive à son tour (stagger `per` s), avec un mouvement 3D propre au mode :
 *  drop = tombe du haut et rebondit · fly = arrive de partout en tournant · zoom = vient de la caméra ·
 *  flip = se redresse en bascule · type = apparaît comme une frappe · slam = écrasée depuis très gros.
 * `out` = instant où les lettres explosent vers l'extérieur.
 */
export const Letters: React.FC<{
  text: string;
  t: number;
  a: number;
  per?: number;
  dur?: number;
  mode?: LettersMode;
  seed?: string;
  size: number;
  out?: number;
  outPer?: number;
  style?: React.CSSProperties;
  outline?: {width: number; color: string};
  /** vibration continue (en px) appliquée à chaque lettre, avec enveloppe `shakeEnv(t)` */
  shake?: (t: number) => number;
}> = ({text, t, a, per = 0.05, dur = 0.7, mode = 'fly', seed = 'L', size, out, outPer = 0.02, style, outline, shake}) => {
  const chars = Array.from(text);
  return (
    <span style={{display: 'inline-block', whiteSpace: 'pre', transformStyle: 'preserve-3d', ...style}}>
      {chars.map((ch, i) => {
        if (ch === ' ') return <span key={i} style={{display: 'inline-block', width: '0.28em'}} />;
        const la = a + i * per;
        const k = pr(t, la, dur, mode === 'drop' ? bounceOut : mode === 'slam' ? expoOut : expoOut);
        const r = (j: number) => rnd(seed + ch, i * 11 + j);
        let x = 0;
        let y = 0;
        let z = 0;
        let rx = 0;
        let ry = 0;
        let rz = 0;
        let s = 1;
        let o = 1;
        let blur = 0;
        const inv = 1 - k;
        if (mode === 'drop') {
          y = -inv * size * 6;
          o = clamp01((t - la) / 0.05);
          const land = clamp01((t - la - dur * 0.34) / 0.12);
          s = 1; // l'écrasement se fait sur Y seulement
          y += 0;
          rz = (r(1) - 0.5) * 24 * inv;
          // petit écrasement à l'impact
          const sq = Math.exp(-Math.max(0, t - la - dur * 0.34) * 18) * 0.22 * (t > la + dur * 0.34 ? 1 : 0) * (land > 0 ? 1 : 0);
          s = 1 - sq * 0.5;
        } else if (mode === 'fly') {
          x = (r(1) - 0.5) * size * 16 * inv;
          y = (r(2) - 0.5) * size * 9 * inv;
          z = -size * (3 + r(3) * 9) * inv;
          rx = (r(4) - 0.5) * 720 * inv;
          ry = (r(5) - 0.5) * 720 * inv;
          rz = (r(6) - 0.5) * 400 * inv;
          blur = inv * 14;
          o = clamp01((t - la) / 0.08);
        } else if (mode === 'zoom') {
          s = 1 + inv * 5;
          z = inv * size * 4;
          blur = inv * 18;
          o = clamp01((t - la) / 0.06);
        } else if (mode === 'flip') {
          rx = -inv * 115;
          y = inv * size * 0.6;
          blur = inv * 8;
          o = clamp01((t - la) / 0.06);
        } else if (mode === 'slam') {
          s = 1 + inv * 2.4;
          y = -inv * size * 0.7;
          blur = inv * 10;
          o = clamp01((t - la) / 0.04);
        } else {
          o = t >= la ? 1 : 0;
        }
        if (out !== undefined) {
          const e = pr(t, out + i * outPer, 0.5, sharpIn);
          x += (r(7) - 0.5) * size * 26 * e;
          y += (r(8) - 0.8) * size * 16 * e;
          z += (r(9) - 0.2) * size * 14 * e;
          rz += (r(10) - 0.5) * 900 * e;
          rx += (r(4) - 0.5) * 360 * e;
          blur += e * 10;
          o *= 1 - clamp01((e - 0.55) / 0.45);
        }
        if (shake) {
          const amp = shake(t);
          x += Math.sin(t * 210 + i * 2.1) * amp;
          y += Math.cos(t * 187 + i * 1.3) * amp * 0.8;
          rz += Math.sin(t * 150 + i) * amp * 0.12;
        }
        const st: React.CSSProperties = {
          display: 'inline-block',
          transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`,
          opacity: o,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
          transformOrigin: mode === 'flip' ? '50% 100%' : '50% 60%',
          willChange: 'transform',
        };
        if (outline) {
          st.color = 'transparent';
          (st as any).WebkitTextStroke = `${outline.width}px ${outline.color}`;
        }
        return (
          <span key={i} style={st}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

// ------------------------------------------------------------------ éclats
/** Gerbe de particules (points ou traits) à partir d'un point. `a` = instant du départ. */
export const Burst: React.FC<{
  t: number;
  a: number;
  x: number;
  y: number;
  n?: number;
  speed?: number;
  life?: number;
  color?: string;
  seed?: string;
  size?: number;
  gravity?: number;
  shape?: 'dot' | 'dash';
  spread?: [number, number]; // angles (rad) min / max
}> = ({t, a, x, y, n = 18, speed = 700, life = 0.8, color = '#fff', seed = 'b', size = 6, gravity = 0, shape = 'dot', spread = [0, Math.PI * 2]}) => {
  const k = (t - a) / life;
  if (k < 0 || k > 1) return null;
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const th = lerp(spread[0], spread[1], rnd(seed, i * 3));
        const v = speed * (0.35 + 0.65 * rnd(seed, i * 3 + 1));
        const e = 1 - Math.pow(1 - k, 2.2);
        const px = x + Math.cos(th) * v * e * (life * 0.75);
        const py = y + Math.sin(th) * v * e * (life * 0.75) + gravity * k * k * 600;
        const sz = size * (0.5 + rnd(seed, i * 3 + 2));
        const op = 1 - Math.pow(k, 1.6);
        if (shape === 'dash') {
          const len = sz * 4 * (1 - k * 0.6);
          return <div key={i} style={{position: 'absolute', left: px - len / 2, top: py - sz / 4, width: len, height: sz / 2, borderRadius: sz, background: color, opacity: op, transform: `rotate(${(th * 180) / Math.PI}deg)`}} />;
        }
        return <div key={i} style={{position: 'absolute', left: px - sz / 2, top: py - sz / 2, width: sz, height: sz, borderRadius: '50%', background: color, opacity: op}} />;
      })}
    </>
  );
};

/** Lignes de vitesse rayonnantes (plein écran). `power` 0..1. */
export const SpeedLines: React.FC<{t: number; power: number; color?: string; n?: number; seed?: string; inner?: number}> = ({t, power, color = '#fff', n = 70, seed = 'sl', inner = 0.18}) => {
  const {w, h} = useLayout();
  if (power <= 0.01) return null;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.hypot(w, h) / 2;
  const f = Math.floor(t * 24);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const th = (i / n) * Math.PI * 2 + rnd(seed + f, i) * 0.08;
        const r0 = R * (inner + rnd(seed + f, i + 100) * 0.35);
        const r1 = R * (0.75 + rnd(seed + f, i + 200) * 0.3);
        const on = rnd(seed + f, i + 300) < 0.35 + 0.55 * power;
        if (!on) return null;
        return <line key={i} x1={cx + Math.cos(th) * r0} y1={cy + Math.sin(th) * r0} x2={cx + Math.cos(th) * r1} y2={cy + Math.sin(th) * r1} stroke={color} strokeWidth={1 + rnd(seed + f, i + 400) * 3.5} opacity={0.18 + 0.55 * power * rnd(seed + f, i + 500)} />;
      })}
    </svg>
  );
};

/** Trame de points (demi-teinte) — texture graphique noire/blanche. */
export const Halftone: React.FC<{color?: string; opacity?: number; size?: number; fade?: 'radial' | 'bottom' | 'top'}> = ({color = '#000', opacity = 0.12, size = 14, fade = 'radial'}) => {
  const mask = fade === 'radial' ? 'radial-gradient(circle at 50% 50%, transparent 25%, #000 90%)' : fade === 'bottom' ? 'linear-gradient(to bottom, transparent 30%, #000)' : 'linear-gradient(to top, transparent 30%, #000)';
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${color} 22%, transparent 24%)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
        WebkitMaskImage: mask,
        maskImage: mask,
        pointerEvents: 'none',
      }}
    />
  );
};

// ------------------------------------------------------------------ panneau à lamelles (split-flap)
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:';

/** Séquence de caractères que traverse une cellule avant d'atterrir sur `final`. */
export const flapSequence = (final: string, n: number, seed: string, i: number): string[] => {
  const seq: string[] = [' '];
  for (let k = 0; k < n; k++) seq.push(ALPHABET[Math.floor(rnd(seed + 's' + k, i) * ALPHABET.length)]);
  seq.push(final);
  return seq;
};

/**
 * Une cellule de panneau d'affichage à lamelles : les caractères défilent (chaque changement = un basculement 3D des deux demi-lamelles),
 * puis la cellule se fige sur `seq[seq.length-1]` à l'instant `land`.
 */
export const FlapCell: React.FC<{
  t: number;
  seq: string[];
  land: number;
  flip?: number; // durée d'un basculement (s)
  w: number;
  h: number;
  fs: number;
  bg?: string;
  fg?: string;
  font: string;
}> = ({t, seq, land, flip = 0.075, w, h, fs, bg = '#0b0b0b', fg = '#fff', font}) => {
  const n = seq.length - 1;
  const start = land - n * flip;
  let idx = Math.floor((t - start) / flip);
  let f = ((t - start) / flip) % 1;
  if (t < start) {
    idx = 0;
    f = 0;
  }
  if (idx >= n) {
    idx = n;
    f = 0;
  }
  const cur = seq[Math.max(0, idx)];
  const prev = seq[Math.max(0, idx - 1)];
  const flipping = idx > 0 && idx <= n && f > 0;
  const half = h / 2;
  const glyph = (c: string, shift: number): React.ReactNode => (
    <div style={{position: 'absolute', left: 0, top: shift, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, fontSize: fs, color: fg, lineHeight: 1}}>{c}</div>
  );
  const halfBox = (child: React.ReactNode, top: boolean, extra?: React.CSSProperties): React.ReactNode => (
    <div style={{position: 'absolute', left: 0, top: top ? 0 : half, width: w, height: half, overflow: 'hidden', background: bg, borderRadius: top ? `${w * 0.06}px ${w * 0.06}px 0 0` : `0 0 ${w * 0.06}px ${w * 0.06}px`, backfaceVisibility: 'hidden', ...extra}}>{child}</div>
  );
  // angle : première moitié = lamelle haute (ancienne) qui tombe, seconde = lamelle basse (nouvelle) qui se déplie
  const a1 = f < 0.5 ? -f * 2 * 90 : -90;
  const a2 = f >= 0.5 ? 90 - (f - 0.5) * 2 * 90 : 90;
  return (
    <div style={{position: 'relative', width: w, height: h, perspective: h * 3.2}}>
      {halfBox(glyph(cur, 0), true)}
      {halfBox(glyph(flipping ? prev : cur, -half), false)}
      {flipping && f < 0.5 && halfBox(glyph(prev, 0), true, {transform: `rotateX(${a1}deg)`, transformOrigin: '50% 100%', zIndex: 3})}
      {flipping && f >= 0.5 && halfBox(glyph(cur, -half), false, {transform: `rotateX(${a2}deg)`, transformOrigin: '50% 0%', top: half, zIndex: 3})}
      <div style={{position: 'absolute', left: 0, top: half - 1.5, width: w, height: 3, background: 'rgba(255,255,255,0.14)', zIndex: 4}} />
      <div style={{position: 'absolute', left: -1, top: -1, width: w + 2, height: h + 2, borderRadius: w * 0.07, boxShadow: `0 ${h * 0.05}px ${h * 0.12}px rgba(0,0,0,0.35)`, pointerEvents: 'none'}} />
    </div>
  );
};

/** Vibration (px) qui retombe après chaque instant de `hits` (sonnerie, impacts). */
export const hitEnvelope = (hits: number[], amp = 8, decay = 7) => (t: number) => {
  let m = 0;
  for (const h of hits) {
    const d = t - h;
    if (d >= 0 && d < 0.6) m = Math.max(m, amp * Math.exp(-d * decay));
  }
  return m;
};

export {lerp, pr, smooth, expoOut};
