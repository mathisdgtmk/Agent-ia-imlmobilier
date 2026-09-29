import React from 'react';
import {random} from 'remotion';
import {ridgePath, rr, smoothstep} from './kit';

export type Mood = 'dusk' | 'golden' | 'blue' | 'day';

type Stops = [number, string][];
export const MOODS: Record<Mood, {sky: Stops; sea: Stops; glow: string; stars: number; far: string[]; haze: string}> = {
  // blue hour : bleu nuit profond, halo champagne à l'horizon (palette de la marque)
  dusk: {
    sky: [[0, '#03060F'], [0.28, '#08133A'], [0.55, '#1D3170'], [0.74, '#5A6AA6'], [0.86, '#B48FA0'], [0.94, '#EDBE8C'], [1, '#F9DFA8']],
    sea: [[0, '#C9B48A'], [0.04, '#5C7AA6'], [0.22, '#193768'], [0.6, '#0A1B3C'], [1, '#040B1E']],
    glow: '255,222,156',
    stars: 0.9,
    far: ['#3A4D7E', '#2A3A68', '#1B2850'],
    haze: '255,214,150',
  },
  // heure dorée : plus chaude, pour varier les plans locaux
  golden: {
    sky: [[0, '#12244F'], [0.32, '#2C4784'], [0.6, '#8E7F9E'], [0.82, '#E2A97E'], [0.94, '#F7D69B'], [1, '#FFE8B8']],
    sea: [[0, '#F2D49C'], [0.04, '#9C8AA0'], [0.2, '#2A4B84'], [0.6, '#10264F'], [1, '#07132E']],
    glow: '255,226,160',
    stars: 0.0,
    far: ['#5B6A9C', '#3F4E80', '#28365F'],
    haze: '255,208,150',
  },
  // plein jour : lumineux, pour les scènes de bureau « sereines »
  day: {
    sky: [[0, '#5D9FDA'], [0.45, '#8EC3EA'], [0.8, '#CBE6F4'], [1, '#F4EAD3']],
    sea: [[0, '#BFE3EE'], [0.05, '#6BB6D0'], [0.3, '#2A83AB'], [1, '#0F5B86']],
    glow: '255,244,214',
    stars: 0,
    far: ['#7FA9B8', '#5F8FA0', '#3F7488'],
    haze: '255,244,220',
  },
  blue: {
    sky: [[0, '#020510'], [0.35, '#061030'], [0.65, '#10265A'], [0.88, '#2E4A86'], [1, '#6E86B6']],
    sea: [[0, '#5B78A8'], [0.06, '#1C3C72'], [0.4, '#0A1C40'], [1, '#030A1A']],
    glow: '150,180,235',
    stars: 1.0,
    far: ['#22345F', '#172549', '#0F1A36'],
    haze: '120,150,210',
  },
};

const Grad: React.FC<{id: string; stops: Stops; x2?: number; y2?: number}> = ({id, stops, x2 = 0, y2 = 1}) => (
  <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
    {stops.map(([o, c], i) => (
      <stop key={i} offset={o} stopColor={c} />
    ))}
  </linearGradient>
);

/** Ciel : dégradé, halo, nuages allongés à liseré doré, étoiles. */
export const SkyContent: React.FC<{w: number; h: number; horizon: number; sunX: number; t: number; mood?: Mood; id?: string; clouds?: number}> = ({
  w,
  h,
  horizon,
  sunX,
  t,
  mood = 'dusk',
  id = 'sk',
  clouds = 8,
}) => {
  const M = MOODS[mood];
  const stars = Array.from({length: 90}, (_, i) => {
    const x = rr(`st${id}x${i}`, 0, w);
    const y = rr(`st${id}y${i}`, 0, horizon * 0.62);
    const r = rr(`st${id}r${i}`, 0.5, 1.5);
    const tw = 0.5 + 0.5 * Math.sin(t * rr(`st${id}t${i}`, 0.6, 2.2) + i);
    const fade = 1 - smoothstep(0.1, 0.62, y / horizon);
    return {x, y, r, o: M.stars * fade * (0.25 + 0.6 * tw) * rr(`st${id}o${i}`, 0.5, 1)};
  });
  const cl = Array.from({length: clouds}, (_, i) => {
    const yy = horizon * rr(`cl${id}y${i}`, 0.3, 0.92);
    const near = smoothstep(0.3, 0.95, yy / horizon);
    const len = rr(`cl${id}l${i}`, 0.22, 0.55) * w * (0.7 + 0.5 * near);
    const x = (rr(`cl${id}x${i}`, -0.2, 1.1) * w + t * (3 + 6 * near) * (i % 2 ? 1 : -0.6)) % (w * 1.5);
    return {x: x - 0.15 * w, y: yy, len, th: rr(`cl${id}t${i}`, 10, 26) * (0.7 + near), near};
  });
  return (
    <>
      <defs>
        <Grad id={`${id}-sky`} stops={M.sky} />
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={`rgba(${M.glow},0.95)`} />
          <stop offset="0.25" stopColor={`rgba(${M.glow},0.5)`} />
          <stop offset="0.6" stopColor={`rgba(${M.glow},0.14)`} />
          <stop offset="1" stopColor={`rgba(${M.glow},0)`} />
        </radialGradient>
        <linearGradient id={`${id}-cloud`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(30,44,96,0.55)" />
          <stop offset="0.6" stopColor="rgba(120,110,160,0.5)" />
          <stop offset="1" stopColor={`rgba(${M.glow},0.8)`} />
        </linearGradient>
        <filter id={`${id}-blur`} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect x={-50} y={-50} width={w + 100} height={horizon + 60} fill={`url(#${id}-sky)`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFF6DD" opacity={s.o} />
      ))}
      <ellipse cx={sunX} cy={horizon} rx={w * 0.62} ry={horizon * 0.7} fill={`url(#${id}-glow)`} />
      <ellipse cx={sunX} cy={horizon} rx={w * 0.2} ry={horizon * 0.16} fill={`url(#${id}-glow)`} opacity={0.9} />
      <g filter={`url(#${id}-blur)`}>
        {cl.map((c, i) => (
          <g key={i} opacity={0.55 + 0.4 * c.near}>
            <ellipse cx={c.x} cy={c.y} rx={c.len / 2} ry={c.th} fill={`url(#${id}-cloud)`} />
            <ellipse cx={c.x + c.len * 0.18} cy={c.y - c.th * 0.5} rx={c.len * 0.3} ry={c.th * 0.8} fill={`url(#${id}-cloud)`} />
          </g>
        ))}
      </g>
    </>
  );
};

/** Horizon lointain : île (mornes) et volcan à contre-jour, brume atmosphérique. */
export const FarLandContent: React.FC<{w: number; h: number; horizon: number; mood?: Mood; id?: string; volcanoX?: number; islandSide?: 'left' | 'right' | 'both'}> = ({
  w,
  h,
  horizon,
  mood = 'dusk',
  id = 'fl',
  volcanoX = 0.83,
  islandSide = 'left',
}) => {
  const M = MOODS[mood];
  const left = (x: number) => (islandSide === 'right' ? 0 : 1) * (1 - smoothstep(0.02, 0.5, x)) * (0.35 + 0.65 * smoothstep(-0.05, 0.05, x));
  const right = (x: number) => smoothstep(0.62, 1.0, x) * (islandSide === 'left' ? 0 : 1);
  const env = (x: number) => Math.max(left(x), right(x) * 0.8);
  const volcano = (() => {
    // cône tronqué type Montagne Pelée, panache léger
    const cx = w * volcanoX;
    const bw = w * 0.16;
    const top = horizon - h * 0.085;
    return `M ${cx - bw} ${horizon + 2} C ${cx - bw * 0.55} ${horizon - h * 0.012} ${cx - bw * 0.3} ${top + h * 0.02} ${cx - bw * 0.09} ${top} L ${cx + bw * 0.05} ${top + 3} C ${cx + bw * 0.28} ${top + h * 0.02} ${cx + bw * 0.6} ${horizon - h * 0.012} ${cx + bw} ${horizon + 2} Z`;
  })();
  return (
    <>
      <defs>
        <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgba(${M.haze},0)`} />
          <stop offset="1" stopColor={`rgba(${M.haze},0.45)`} />
        </linearGradient>
      </defs>
      {islandSide !== 'right' || true ? (
        <>
          <path d={ridgePath(w, horizon + 1, h * 0.1, `${id}r1`, {freq: 2.2, step: 12, env: (x) => env(x) * 0.9})} fill={M.far[0]} opacity={0.85} />
          <path d={ridgePath(w, horizon + 1, h * 0.07, `${id}r2`, {freq: 3.4, step: 10, env: (x) => env(x) * 0.8})} fill={M.far[1]} opacity={0.9} />
          <path d={ridgePath(w, horizon + 2, h * 0.036, `${id}r3`, {freq: 5, step: 8, env: (x) => env(x) * 0.7})} fill={M.far[2]} />
        </>
      ) : null}
      <path d={volcano} fill={M.far[1]} opacity={0.92} />
      <rect x={-20} y={horizon - h * 0.11} width={w + 40} height={h * 0.115} fill={`url(#${id}-haze)`} />
    </>
  );
};

/** Mer : dégradé, colonne de reflets dorés scintillants, vaguelettes. */
export const SeaContent: React.FC<{w: number; h: number; horizon: number; sunX: number; t: number; mood?: Mood; id?: string; shimmer?: number}> = ({
  w,
  h,
  horizon,
  sunX,
  t,
  mood = 'dusk',
  id = 'sea',
  shimmer = 1,
}) => {
  const M = MOODS[mood];
  const N = 120;
  const H = h - horizon;
  const lines = Array.from({length: N}, (_, i) => {
    const f = ((i + 0.5) / N) ** 1.85;
    const y = horizon + H * f;
    const wid = w * (0.02 + 0.5 * f) * rr(`${id}w${i}`, 0.4, 1);
    const jitter = Math.sin(t * rr(`${id}s${i}`, 0.4, 1.3) + i * 2.1) * w * 0.01 * (0.3 + f);
    const cx = sunX + jitter + rr(`${id}c${i}`, -0.5, 0.5) * w * 0.06 * f;
    const twinkle = 0.5 + 0.5 * Math.sin(t * rr(`${id}o${i}`, 1.1, 3.4) + i * 1.7);
    const op = Math.min(0.9, (0.1 + 0.55 * twinkle) * (1 - 0.45 * f) * rr(`${id}op${i}`, 0.5, 1) * shimmer);
    return {y, wid, cx, th: 1 + 5.5 * f, op};
  });
  const waves = Array.from({length: 16}, (_, i) => {
    const f = ((i + 1) / 17) ** 1.7;
    const y = horizon + H * f;
    const amp = 1 + 5 * f;
    const ph = t * (0.35 + 0.5 * f) + i;
    let d = '';
    for (let x = -20; x <= w + 20; x += 24) d += `${d ? 'L' : 'M'} ${x} ${(y + Math.sin(x * (0.012 / (0.4 + f)) + ph) * amp).toFixed(1)} `;
    return {d, f};
  });
  return (
    <>
      <defs>
        <Grad id={`${id}-water`} stops={M.sea} />
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={`rgba(${M.glow},0)`} />
          <stop offset="0.5" stopColor={`rgba(${M.glow},1)`} />
          <stop offset="1" stopColor={`rgba(${M.glow},0)`} />
        </linearGradient>
        <linearGradient id={`${id}-hz`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgba(${M.glow},0.65)`} />
          <stop offset="1" stopColor={`rgba(${M.glow},0)`} />
        </linearGradient>
      </defs>
      <rect x={-50} y={horizon} width={w + 100} height={H + 60} fill={`url(#${id}-water)`} />
      <rect x={-50} y={horizon} width={w + 100} height={h * 0.05} fill={`url(#${id}-hz)`} opacity={0.75} />
      {waves.map((wv, i) => (
        <path key={i} d={wv.d} stroke="rgba(190,215,255,0.08)" strokeWidth={1 + wv.f * 1.6} fill="none" />
      ))}
      {lines.map((l, i) => (
        <rect key={i} x={l.cx - l.wid / 2} y={l.y} width={l.wid} height={l.th} rx={l.th / 2} fill={`url(#${id}-line)`} opacity={l.op} />
      ))}
    </>
  );
};

export const seedNoise = (s: string) => random(s);
