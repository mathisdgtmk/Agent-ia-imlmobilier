import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {easeOut, prog, clamp01} from '../lib/anim';

/** Explosion de lumière dorée (orbe incandescent + onde + strie anamorphique + éclats), t = secondes depuis le déclenchement. */
export const GoldBloom: React.FC<{t: number; w: number; h: number; cx?: number; cy?: number; scale?: number}> = ({t, w, h, cx = 0.5, cy = 0.5, scale = 1}) => {
  const X = w * cx;
  const Y = h * cy;
  const R = Math.max(w, h) * 0.75 * scale;
  const orb = prog(t, 0, 1.1, easeOut);
  const rise = clamp01(t / 0.12);
  const orbOp = rise * (0.2 + 0.8 * clamp01(1 - (t - 0.12) / 1.5));
  const ring = prog(t, 0.05, 1.8, easeOut);
  const streak = prog(t, 0, 0.9, easeOut);
  const streakOp = rise * clamp01(1 - (t - 0.2) / 1.8);
  if (t < -0.05 || t > 3.2) return null;
  const size = R * (0.25 + 0.75 * orb);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      {/* orbe */}
      <div
        style={{
          position: 'absolute',
          left: X - size / 2,
          top: Y - size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,248,222,1) 0%, rgba(255,226,150,0.92) 10%, rgba(240,184,84,0.5) 30%, rgba(200,130,40,0.16) 54%, rgba(200,130,40,0) 72%)',
          opacity: orbOp,
        }}
      />
      {/* strie anamorphique */}
      <div
        style={{
          position: 'absolute',
          left: X - (w * 0.9 * streak) / 2,
          top: Y - 3,
          width: w * 0.9 * streak,
          height: 6,
          background: 'linear-gradient(90deg, rgba(255,226,150,0) 0%, rgba(255,246,214,1) 50%, rgba(255,226,150,0) 100%)',
          filter: 'blur(1px)',
          opacity: streakOp,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: X - (w * 1.1 * streak) / 2,
          top: Y - 40,
          width: w * 1.1 * streak,
          height: 80,
          background: 'linear-gradient(90deg, rgba(240,190,90,0) 0%, rgba(240,190,90,0.5) 50%, rgba(240,190,90,0) 100%)',
          filter: 'blur(22px)',
          opacity: streakOp * 0.9,
        }}
      />
      {/* onde de choc */}
      <div
        style={{
          position: 'absolute',
          left: X - (R * 1.5 * ring) / 2,
          top: Y - (R * 1.5 * ring) / 2,
          width: R * 1.5 * ring,
          height: R * 1.5 * ring,
          borderRadius: '50%',
          border: `${2 + 4 * (1 - ring)}px solid rgba(255,236,190,${0.85 * (1 - ring)})`,
          boxShadow: `0 0 ${50 * (1 - ring)}px rgba(240,190,90,${0.7 * (1 - ring)}), inset 0 0 ${50 * (1 - ring)}px rgba(240,190,90,${0.45 * (1 - ring)})`,
        }}
      />
      {/* éclats */}
      {Array.from({length: 52}, (_, i) => {
        const a = random(`gb-a${i}`) * Math.PI * 2;
        const sp = 0.2 + random(`gb-s${i}`) * 0.8;
        const k = prog(t, 0.02, 2.0, easeOut);
        const d = R * 0.7 * sp * k;
        const life = clamp01(1 - (t - 0.15) / (1.3 + random(`gb-l${i}`)));
        const r = 1.4 + random(`gb-r${i}`) * 3.2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: X + Math.cos(a) * d - r,
              top: Y + Math.sin(a) * d * 0.72 - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: 'rgba(255,236,180,1)',
              boxShadow: '0 0 12px rgba(255,214,120,0.95)',
              opacity: life,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Ligne dorée lumineuse qui traverse l'écran. p = progression 0..1 ; y en fraction de la hauteur. */
export const GoldLine: React.FC<{p: number; w: number; h: number; y?: number; thickness?: number; fade?: number; angle?: number}> = ({p, w, h, y = 0.5, thickness = 3, fade = 1, angle = 0}) => {
  const head = -0.2 + 1.4 * p; // position de la tête (fraction de la largeur)
  const len = 0.55;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: fade}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: h * y - thickness / 2,
          width: w,
          height: thickness,
          transform: `rotate(${angle}deg)`,
          background: `linear-gradient(90deg, rgba(240,205,130,0) ${(head - len) * 100}%, rgba(255,236,190,0.95) ${head * 100}%, rgba(240,205,130,0) ${(head + 0.06) * 100}%)`,
          filter: `drop-shadow(0 0 ${thickness * 3}px rgba(240,205,130,0.95))`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: h * y - thickness * 6,
          width: w,
          height: thickness * 12,
          background: `linear-gradient(90deg, rgba(240,205,130,0) ${(head - len * 0.6) * 100}%, rgba(240,205,130,0.22) ${head * 100}%, rgba(240,205,130,0) ${(head + 0.1) * 100}%)`,
          filter: 'blur(14px)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Poussière dorée flottante, très discrète. */
export const Dust: React.FC<{t: number; w: number; h: number; n?: number; opacity?: number; seed?: string}> = ({t, w, h, n = 40, opacity = 0.5, seed = 'dust'}) => (
  <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity}}>
    {Array.from({length: n}, (_, i) => {
      const x = (random(`${seed}x${i}`) * w + t * (4 + random(`${seed}v${i}`) * 12) + Math.sin(t * 0.5 + i) * 14) % w;
      const y = (((random(`${seed}y${i}`) * h - t * (2 + random(`${seed}u${i}`) * 9)) % h) + h) % h;
      const r = 1 + random(`${seed}r${i}`) * 3.4;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: '50%', background: 'rgba(255,228,170,0.75)', boxShadow: '0 0 10px rgba(255,220,140,0.7)', opacity: 0.2 + 0.55 * Math.abs(Math.sin(t * 0.7 + i))}} />;
    })}
  </AbsoluteFill>
);
