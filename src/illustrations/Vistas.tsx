import React from 'react';
import {Layer, Palm, Bush, ridgePath, rr, smoothstep} from './kit';
import {SkyContent, SeaContent, FarLandContent, MOODS, Mood} from './Seascape';
import {Villa, VILLA_W, VILLA_GROUND} from './Villa';

export type VistaKind = 'fdf' | 'ti' | 'lam' | 'coast' | 'villas';

/* ------------------------------------------------------------------ éléments réutilisables */
const Sailboat: React.FC<{x: number; y: number; s: number; sail?: string; hull?: string; id: string; lean?: number}> = ({x, y, s, sail = 'rgba(255,232,190,0.92)', hull = '#0B1020', id, lean = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${s})`}>
    <path d="M -34 0 L 34 0 L 24 11 L -24 11 Z" fill={hull} />
    <rect x={-1.2} y={-92} width={2.4} height={94} fill={hull} />
    <path d="M 3 -86 L 3 -8 L 36 -8 Z" fill={sail} />
    <path d="M 3 -86 L 3 -8 L 36 -8 Z" fill="rgba(255,190,120,0.22)" />
    <path d="M -3 -78 L -3 -8 L -30 -8 Z" fill="rgba(255,244,222,0.78)" />
    <rect x={-40} y={0} width={80} height={1.6} fill="rgba(255,214,150,0.5)" />
    <circle cx={0} cy={-93} r={2.2} fill="#FFE7B0" />
    <title>{id}</title>
  </g>
);

const Skyline: React.FC<{w: number; x0: number; x1: number; y: number; maxH: number; seed: string; color: string; t: number; tall?: number[]}> = ({w, x0, x1, y, maxH, seed, color, t, tall = []}) => {
  const els: React.ReactNode[] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const bw = rr(`${seed}w${i}`, 12, 40);
    const bh = rr(`${seed}h${i}`, maxH * 0.22, maxH) * (0.55 + 0.45 * Math.sin(((x - x0) / (x1 - x0)) * Math.PI));
    els.push(<rect key={`b${i}`} x={x} y={y - bh} width={bw} height={bh} fill={color} />);
    const nw = Math.floor(bw / 8);
    const nh = Math.floor(bh / 9);
    for (let a = 0; a < nw; a++) {
      for (let b = 0; b < nh; b++) {
        if (rr(`${seed}wn${i}_${a}_${b}`, 0, 1) > 0.62) {
          els.push(
            <rect key={`w${i}_${a}_${b}`} x={x + 3 + a * 8} y={y - bh + 4 + b * 9} width={3.4} height={4.4} fill="#FFD68A" opacity={0.5 + 0.4 * Math.sin(t * 0.8 + i + a + b)} />,
          );
        }
      }
    }
    x += bw + rr(`${seed}g${i}`, 0, 5);
    i++;
  }
  // clocher / cathédrale : flèche fine
  tall.forEach((tx, k) => {
    els.push(<rect key={`t${k}`} x={tx - 6} y={y - maxH * 1.5} width={12} height={maxH * 1.5} fill={color} />);
    els.push(<polygon key={`tp${k}`} points={`${tx - 9},${y - maxH * 1.5} ${tx + 9},${y - maxH * 1.5} ${tx},${y - maxH * 2.3}`} fill={color} />);
  });
  return <g>{els}</g>;
};

const Reflections: React.FC<{x0: number; x1: number; y: number; len: number; seed: string; t: number; color?: string; n?: number}> = ({x0, x1, y, len, seed, t, color = '255,206,130', n = 70}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const x = rr(`${seed}rx${i}`, x0, x1);
      const l = rr(`${seed}rl${i}`, len * 0.3, len);
      const o = (0.12 + 0.22 * (0.5 + 0.5 * Math.sin(t * rr(`${seed}rt${i}`, 1, 3) + i))) * rr(`${seed}ro${i}`, 0.5, 1);
      return <rect key={i} x={x} y={y + 2} width={rr(`${seed}rw${i}`, 1.4, 3.2)} height={l} fill={`rgba(${color},${o})`} />;
    })}
  </g>
);

const Fort: React.FC<{x: number; y: number; s: number; color: string}> = ({x, y, s, color}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <path d="M -160 0 L -160 -34 L 140 -34 L 140 0 Z" />
    {Array.from({length: 16}, (_, i) => (
      <rect key={i} x={-158 + i * 19} y={-44} width={11} height={10} />
    ))}
    <rect x={-20} y={-96} width={54} height={62} />
    {Array.from({length: 4}, (_, i) => (
      <rect key={i} x={-20 + i * 15} y={-106} width={9} height={10} />
    ))}
    <rect x={7} y={-140} width={2.4} height={44} />
    <path d="M 9.4 -140 L 34 -132 L 9.4 -124 Z" />
    <path d="M -180 0 L 170 0 L 200 10 L -210 10 Z" />
  </g>
);

const Plane: React.FC<{x: number; y: number; s: number; rot: number; t: number}> = ({x, y, s, rot, t}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -70 0 Q -30 -9 40 -5 L 76 0 L 40 5 Q -30 9 -70 0 Z" fill="#070B16" />
    <path d="M -8 -2 L 22 -34 L 32 -34 L 12 -2 Z" fill="#070B16" />
    <path d="M -8 2 L 22 20 L 32 20 L 12 2 Z" fill="#0A0F1C" />
    <path d="M -62 -3 L -74 -28 L -58 -28 L -42 -3 Z" fill="#070B16" />
    <circle cx={22} cy={-34} r={2.4} fill="#FF5A4E" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 7))} />
    <circle cx={-72} cy={-27} r={2} fill="#FFFFFF" opacity={0.3 + 0.7 * Math.max(0, Math.sin(t * 7 + 2))} />
    <path d="M 80 0 L 400 0" stroke="rgba(255,236,200,0.16)" strokeWidth={3} strokeLinecap="round" transform="scale(-1 1) translate(-30 0)" />
  </g>
);

const Rock: React.FC<{x: number; y: number; hgt: number; color: string}> = ({x, y, hgt, color}) => {
  const k = hgt / 130;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M -84 0 L -70 -18 L -62 -40 L -54 -56 L -46 -64 L -40 -92 L -28 -102 L -24 -120 L -9 -130 L 3 -118 L 7 -96 L 19 -84 L 24 -60 L 42 -50 L 58 -28 L 92 0 Z" fill={color} />
      <path d="M -9 -130 L 3 -118 L 7 -96 L 19 -84 L 24 -60 L 42 -50 L 58 -28 L 92 0 L 30 0 L 14 -40 L -6 -80 Z" fill="rgba(0,0,0,0.24)" />
      <path d="M -84 0 L 92 0 L 100 6 L -92 6 Z" fill="rgba(255,236,200,0.18)" />
    </g>
  );
};

const Birds: React.FC<{w: number; h: number; t: number; seed: string}> = ({w, h, t, seed}) => (
  <g stroke="#0A0F1C" strokeWidth={3} strokeLinecap="round" fill="none">
    {Array.from({length: 7}, (_, i) => {
      const x = ((rr(`${seed}x${i}`, 0.15, 0.7) * w + t * (14 + i * 3)) % (w * 0.9)) + w * 0.05;
      const y = h * (0.16 + 0.12 * rr(`${seed}y${i}`, 0, 1)) + Math.sin(t * 0.8 + i) * 8;
      const f = Math.sin(t * 6 + i * 1.7);
      const sz = 12 + 8 * rr(`${seed}s${i}`, 0, 1);
      return <path key={i} d={`M ${x - sz} ${y - f * 3} Q ${x - sz * 0.4} ${y - sz * 0.5 - f * 5} ${x} ${y} Q ${x + sz * 0.4} ${y - sz * 0.5 - f * 5} ${x + sz} ${y - f * 3}`} />;
    })}
  </g>
);

const Reeds: React.FC<{w: number; y: number; h: number; seed: string; t: number; color: string}> = ({w, y, h, seed, t, color}) => (
  <g stroke={color} strokeWidth={3} strokeLinecap="round" fill="none">
    {Array.from({length: 90}, (_, i) => {
      const x = rr(`${seed}x${i}`, -20, w + 20);
      const hh = rr(`${seed}h${i}`, 0.35, 1) * h;
      const sw = Math.sin(t * 1.1 + i * 0.7) * 8;
      return <path key={i} d={`M ${x} ${y} Q ${x + sw * 0.4} ${y - hh * 0.6} ${x + sw + rr(`${seed}c${i}`, -14, 14)} ${y - hh}`} />;
    })}
  </g>
);

/* ------------------------------------------------------------------ vues */
export const Vista: React.FC<{kind: VistaKind; w: number; h: number; t: number; p: number; vertical: boolean}> = ({kind, w, h, t, p, vertical}) => {
  const mood: Mood = kind === 'fdf' || kind === 'lam' || kind === 'coast' ? 'golden' : 'dusk';
  const M = MOODS[mood];
  const hz = h * ({fdf: 0.46, ti: 0.5, lam: 0.55, coast: 0.44, villas: 0.42}[kind] - (vertical ? 0.06 : 0));
  const sunX = w * ({fdf: 0.3, ti: 0.7, lam: 0.62, coast: 0.28, villas: 0.25}[kind]);
  const cam = (k: number) => 1 + k * p;
  const pan = (k: number) => (p - 0.5) * -w * 0.05 * k;
  const org: [number, number] = [w / 2, hz];
  const id = `v-${kind}`;

  return (
    <div style={{position: 'absolute', inset: 0, background: '#03060F', overflow: 'hidden'}}>
      <Layer w={w} h={h} scale={cam(0.03)} origin={[sunX, hz]}>
        <SkyContent w={w} h={h} horizon={hz} sunX={sunX} t={t} id={`${id}sk`} mood={mood} clouds={7} />
      </Layer>

      {/* ------- Fort-de-France ------- */}
      {kind === 'fdf' && (
        <>
          <Layer w={w} h={h} scale={cam(0.06)} origin={org} tx={pan(0.4)}>
            <path d={ridgePath(w, hz + 4, h * 0.3, 'fdfM1', {freq: 3.4, roughness: 7, step: 6, env: (x) => 0.35 + 0.65 * smoothstep(0.0, 0.5, x) * (1 - 0.3 * smoothstep(0.7, 1, x))})} fill={M.far[0]} opacity={0.9} />
            <path d={ridgePath(w, hz + 4, h * 0.17, 'fdfM2', {freq: 4.6, roughness: 6, step: 6, env: () => 1})} fill={M.far[1]} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.1)} origin={org} tx={pan(0.8)}>
            <SeaContent w={w} h={h} horizon={hz} sunX={sunX} t={t} id={`${id}sea`} mood={mood} shimmer={0.8} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.16)} origin={org} tx={pan(1.2)}>
            {/* presqu'île + fort */}
            <path d={ridgePath(w, hz + h * 0.075, h * 0.05, 'fdfP', {freq: 1.5, bottom: hz + h * 0.075, env: (x) => smoothstep(0.42, 0.05, x) * 1.0})} fill="#151B2E" />
            <Fort x={w * 0.2} y={hz + h * 0.05} s={h * 0.0012} color="#0E1424" />
            <rect x={w * 0.34} y={hz + h * 0.073} width={w * 0.62} height={h * 0.02} fill="#141A2C" />
            <Skyline w={w} x0={w * 0.36} x1={w * 0.98} y={hz + h * 0.076} maxH={h * 0.055} seed="fdfS" color="#1B1E36" t={t} tall={[w * 0.6]} />
            <Reflections x0={w * 0.36} x1={w * 0.98} y={hz + h * 0.078} len={h * 0.13} seed="fdfR" t={t} />
            {[0.16, 0.44, 0.62].map((bx, i) => (
              <Sailboat key={i} x={w * bx} y={hz + h * (0.16 + 0.05 * i)} s={h * (0.0009 + 0.0004 * i)} id={`b${i}`} lean={Math.sin(t * 0.6 + i) * 1.2} />
            ))}
          </Layer>
          <Layer w={w} h={h} scale={cam(0.55)} origin={[w / 2, h]} tx={pan(2)} blur={2.4}>
            <Palm x={w * 1.02} y={h * 1.1} h={h * 0.9} lean={-0.3} seed="fdfP1" t={t} color="#02050A" rim="rgba(255,214,150,0.5)" fronds={11} frondScale={0.5} />
            <Bush x={w * 0.04} y={h * 1.02} w={w * 0.3} h={h * 0.14} seed="fdfB" color="#02060B" />
          </Layer>
        </>
      )}

      {/* ------- Les Trois-Îlets ------- */}
      {kind === 'ti' && (
        <>
          <Layer w={w} h={h} scale={cam(0.06)} origin={org} tx={pan(0.4)}>
            <FarLandContent w={w} h={h} horizon={hz} id={`${id}far`} mood={mood} islandSide="both" volcanoX={0.9} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.1)} origin={org} tx={pan(0.8)}>
            <SeaContent w={w} h={h} horizon={hz} sunX={sunX} t={t} id={`${id}sea`} mood={mood} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.16)} origin={org} tx={pan(1.1)}>
            <defs>
              <linearGradient id="tiHill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#123138" />
                <stop offset="1" stopColor="#060E16" />
              </linearGradient>
            </defs>
            <path d={ridgePath(w, hz + h * 0.17, h * 0.2, 'tiH', {freq: 1.6, bottom: hz + h * 0.17, env: (x) => smoothstep(0.5, 0.0, x)})} fill="url(#tiHill)" />
            {Array.from({length: 22}, (_, i) => (
              <circle key={i} cx={rr(`tiL${i}`, 0.02, 0.36) * w} cy={hz + h * rr(`tiLy${i}`, 0.06, 0.15)} r={rr(`tiLr${i}`, 1.3, 2.6)} fill="#FFD68A" opacity={0.5 + 0.4 * Math.sin(t + i)} />
            ))}
          </Layer>
          <Layer w={w} h={h} scale={cam(0.3)} origin={[w / 2, h * 0.8]} tx={pan(1.6)}>
            {/* ponton et voiliers */}
            <rect x={-20} y={h * 0.76} width={w + 40} height={h * 0.012} fill="#0A0F1C" />
            {Array.from({length: 14}, (_, i) => (
              <circle key={i} cx={w * (0.03 + i * 0.07)} cy={h * 0.752} r={2.6} fill="#FFE3A8" />
            ))}
            {Array.from({length: 9}, (_, i) => {
              const bx = w * (0.06 + i * 0.115) + rr(`tib${i}`, -14, 14);
              const by = h * (0.74 + (i % 3) * 0.01);
              const ss = h * (0.0013 + (i % 3) * 0.00025);
              return <Sailboat key={i} x={bx} y={by} s={ss} id={`m${i}`} sail="rgba(255,236,204,0.16)" lean={Math.sin(t * 0.7 + i) * 1.5} />;
            })}
            <Reflections x0={0} x1={w} y={h * 0.77} len={h * 0.12} seed="tiR" t={t} n={90} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.6)} origin={[w / 2, h]} tx={pan(2)} blur={2.4}>
            <Palm x={w * -0.05} y={h * 1.1} h={h * 0.95} lean={0.3} seed="tiP1" t={t} color="#02050A" rim="rgba(255,214,150,0.5)" fronds={11} frondScale={0.5} />
            <Bush x={w * 0.98} y={h * 1.02} w={w * 0.3} h={h * 0.14} seed="tiB" color="#02060B" />
          </Layer>
        </>
      )}

      {/* ------- Le Lamentin ------- */}
      {kind === 'lam' && (
        <>
          <Layer w={w} h={h} scale={cam(0.05)} origin={org} tx={pan(0.4)}>
            <path d={ridgePath(w, hz + 3, h * 0.2, 'lamM', {freq: 2.6, roughness: 6, step: 8, env: (x) => 0.5 + 0.5 * smoothstep(0.7, 0.0, x)})} fill={M.far[0]} opacity={0.85} />
            <path d={ridgePath(w, hz + 3, h * 0.1, 'lamM2', {freq: 3.6, step: 8})} fill={M.far[1]} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.1)} origin={org} tx={pan(0.8)}>
            <SeaContent w={w} h={h} horizon={hz} sunX={sunX} t={t} id={`${id}sea`} mood={mood} shimmer={0.9} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.16)} origin={org} tx={pan(1.1)}>
            {/* îlots de mangrove */}
            {[0.1, 0.3, 0.52, 0.78, 0.92].map((bx, i) => (
              <g key={i}>
                <Bush x={w * bx} y={hz + h * (0.085 + 0.03 * (i % 3))} w={w * (0.14 + 0.05 * (i % 2))} h={h * 0.05} seed={`lamB${i}`} color="#061218" hi="rgba(90,170,120,0.16)" />
                <rect x={w * (bx - 0.05)} y={hz + h * (0.09 + 0.03 * (i % 3))} width={w * 0.1} height={h * 0.03} fill="rgba(255,206,130,0.10)" />
              </g>
            ))}
          </Layer>
          <Layer w={w} h={h} scale={cam(0.08)} origin={org}>
            <Plane x={w * (-0.1 + 1.25 * p)} y={h * ((vertical ? 0.34 : 0.36) - 0.03 * p)} s={h * (vertical ? 0.0012 : 0.0015)} rot={-4} t={t} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.5)} origin={[w / 2, h]} tx={pan(2)} blur={2.2}>
            <Reeds w={w} y={h * 1.02} h={h * 0.34} seed="lamR" t={t} color="#02060B" />
          </Layer>
        </>
      )}

      {/* ------- Le littoral ------- */}
      {kind === 'coast' && (
        <>
          <Layer w={w} h={h} scale={cam(0.05)} origin={org} tx={pan(0.4)}>
            <FarLandContent w={w} h={h} horizon={hz} id={`${id}far`} mood={mood} islandSide="left" volcanoX={2} />
            <Rock x={w * 0.72} y={hz + 2} hgt={h * 0.17} color={M.far[1]} />
            <Birds w={w} h={h} t={t} seed="coB" />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.1)} origin={org} tx={pan(0.8)}>
            <SeaContent w={w} h={h} horizon={hz} sunX={sunX} t={t} id={`${id}sea`} mood={mood} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.3)} origin={[w / 2, h]} tx={pan(1.4)}>
            <defs>
              <linearGradient id="coSand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#5B4A3A" />
                <stop offset="0.3" stopColor="#2E2620" />
                <stop offset="1" stopColor="#100D0C" />
              </linearGradient>
            </defs>
            {[0, 1, 2].map((k) => {
              const off = Math.sin(t * 0.9 + k * 1.7) * h * 0.008;
              return (
                <path
                  key={k}
                  d={`M -20 ${h * (0.79 + 0.028 * k) + off} Q ${w * 0.3} ${h * (0.74 + 0.028 * k) + off} ${w * 0.62} ${h * (0.78 + 0.028 * k) + off} T ${w + 20} ${h * (0.73 + 0.028 * k) + off}`}
                  stroke={`rgba(255,244,222,${0.55 - k * 0.12})`}
                  strokeWidth={4 - k}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
            <path d={`M -20 ${h * 0.86} Q ${w * 0.3} ${h * 0.8} ${w * 0.62} ${h * 0.85} T ${w + 20} ${h * 0.79} L ${w + 20} ${h + 20} L -20 ${h + 20} Z`} fill="url(#coSand)" />
            <path d={`M -20 ${h * 0.86} Q ${w * 0.3} ${h * 0.8} ${w * 0.62} ${h * 0.85} T ${w + 20} ${h * 0.79}`} stroke="rgba(255,214,150,0.35)" strokeWidth={2} fill="none" />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.55)} origin={[w / 2, h]} tx={pan(2)} blur={2}>
            <Palm x={w * 0.9} y={h * 1.08} h={h * 0.85} lean={-0.26} seed="coP1" t={t} color="#02050A" rim="rgba(255,214,150,0.55)" fronds={11} frondScale={0.55} />
            <Palm x={w * 0.05} y={h * 1.1} h={h * 0.6} lean={0.22} seed="coP2" t={t + 1} color="#02050A" rim="rgba(255,214,150,0.55)" fronds={10} frondScale={0.5} />
          </Layer>
        </>
      )}

      {/* ------- Villas ------- */}
      {kind === 'villas' && (
        <>
          <Layer w={w} h={h} scale={cam(0.05)} origin={org} tx={pan(0.4)}>
            <FarLandContent w={w} h={h} horizon={hz} id={`${id}far`} mood={mood} islandSide="right" volcanoX={2} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.1)} origin={org} tx={pan(0.8)}>
            <SeaContent w={w} h={h} horizon={hz} sunX={sunX} t={t} id={`${id}sea`} mood={mood} />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.22)} origin={[w * 0.6, h * 0.72]} tx={pan(1.2)}>
            <defs>
              <linearGradient id="viHillA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#15403F" />
                <stop offset="1" stopColor="#061A1E" />
              </linearGradient>
              <linearGradient id="viTer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0B2A2C" />
                <stop offset="1" stopColor="#040D14" />
              </linearGradient>
            </defs>
            <path d={ridgePath(w, hz + h * 0.27, h * 0.24, 'viH1', {freq: 1.4, bottom: h + 60, env: (x) => 0.3 + 0.7 * smoothstep(0.15, 0.95, x)})} fill="url(#viHillA)" />
            <path d={ridgePath(w, hz + h * 0.4, h * 0.2, 'viH2', {freq: 1.9, bottom: h + 60, env: (x) => 0.25 + 0.75 * smoothstep(0.3, 1, x)})} fill="#08222A" />
            {/* villa principale sur sa terrasse */}
            {(() => {
              const sv = (w * 0.34) / VILLA_W;
              const gx = w * 0.47;
              const gy = h * 0.69;
              return (
                <g>
                  <path d={`M ${gx - 90} ${gy + 2} L ${gx + VILLA_W * sv + 90} ${gy + 2} L ${gx + VILLA_W * sv + 160} ${h + 40} L ${gx - 160} ${h + 40} Z`} fill="url(#viTer)" />
                  <rect x={gx - 90} y={gy} width={VILLA_W * sv + 180} height={3} fill="rgba(255,214,150,0.55)" />
                  <g transform={`translate(${gx} ${gy - VILLA_GROUND * sv}) scale(${sv})`}>
                    <Villa t={t} id="viV" pool={false} withDeck={false} />
                  </g>
                  <Palm x={gx - 40} y={gy + 6} h={h * 0.2} lean={0.05} seed="viP1" t={t} color="#040A12" rim="rgba(255,215,150,0.5)" />
                  <Palm x={gx + VILLA_W * sv + 60} y={gy + 6} h={h * 0.25} lean={-0.05} seed="viP2" t={t + 1} color="#040A12" rim="rgba(255,215,150,0.5)" />
                </g>
              );
            })()}
            {/* seconde villa, plus bas sur la colline */}
            {(() => {
              const sv = (w * 0.2) / VILLA_W;
              const gx = w * 0.09;
              const gy = h * 0.81;
              return (
                <g>
                  <path d={`M ${gx - 60} ${gy + 2} L ${gx + VILLA_W * sv + 60} ${gy + 2} L ${gx + VILLA_W * sv + 120} ${h + 40} L ${gx - 120} ${h + 40} Z`} fill="url(#viTer)" />
                  <rect x={gx - 60} y={gy} width={VILLA_W * sv + 120} height={2.5} fill="rgba(255,214,150,0.5)" />
                  <g transform={`translate(${gx} ${gy - VILLA_GROUND * sv}) scale(${sv})`}>
                    <Villa t={t + 2} id="viV2" pool={false} withDeck={false} glow={0.9} />
                  </g>
                  <Palm x={gx + VILLA_W * sv + 30} y={gy + 6} h={h * 0.16} lean={-0.04} seed="viP3" t={t + 2} color="#040A12" rim="rgba(255,215,150,0.5)" />
                </g>
              );
            })()}
            <Bush x={w * 0.36} y={h * 0.86} w={w * 0.16} h={h * 0.07} seed="viB1" color="#06131A" />
          </Layer>
          <Layer w={w} h={h} scale={cam(0.6)} origin={[w / 2, h]} tx={pan(2)} blur={2.4}>
            <Palm x={w * 1.05} y={h * 1.1} h={h * 0.9} lean={-0.3} seed="viFg" t={t} color="#02050A" rim="rgba(255,214,150,0.5)" fronds={11} frondScale={0.5} />
          </Layer>
        </>
      )}
    </div>
  );
};
