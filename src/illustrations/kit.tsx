import React from 'react';
import {random} from 'remotion';

/** Petits utilitaires pour dessiner des paysages vectoriels déterministes (aucun Math.random). */
export const rr = (seed: string, a: number, b: number) => a + (b - a) * random(seed);

export const smoothNoise = (seed: string, n = 5) => {
  const ph = Array.from({length: n}, (_, i) => rr(`${seed}p${i}`, 0, Math.PI * 2));
  const fr = Array.from({length: n}, (_, i) => (i === 0 ? 1 : 1.75 ** i) * rr(`${seed}f${i}`, 0.85, 1.2));
  const am = Array.from({length: n}, (_, i) => 1 / 1.8 ** i);
  const norm = am.reduce((a, b) => a + b, 0);
  return (x: number) => am.reduce((s, a, i) => s + a * Math.sin(x * fr[i] + ph[i]), 0) / norm; // -1..1
};

/** Ligne de crête (montagne, colline, côte). env(x01) module la hauteur (0..1). */
export const ridgePath = (
  w: number,
  baseY: number,
  amp: number,
  seed: string,
  opts: {freq?: number; step?: number; env?: (x: number) => number; bottom?: number; roughness?: number} = {},
) => {
  const {freq = 3, step = 10, env = () => 1, bottom = baseY + 4000, roughness = 5} = opts;
  const n = smoothNoise(seed, roughness);
  let d = `M ${-40} ${bottom}`;
  for (let x = -40; x <= w + 40; x += step) {
    const x01 = x / w;
    const hgt = amp * (0.5 + 0.5 * n(x01 * freq * Math.PI * 2)) * env(x01);
    d += ` L ${x.toFixed(1)} ${(baseY - hgt).toFixed(1)}`;
  }
  d += ` L ${w + 40} ${bottom} Z`;
  return d;
};

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Un calque animé (parallaxe) contenant un <svg> aux dimensions de l'image. */
export const Layer: React.FC<{
  w: number;
  h: number;
  scale?: number;
  tx?: number;
  ty?: number;
  origin?: [number, number];
  blur?: number;
  opacity?: number;
  blend?: React.CSSProperties['mixBlendMode'];
  children: React.ReactNode;
}> = ({w, h, scale = 1, tx = 0, ty = 0, origin, blur, opacity, blend, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: w,
      height: h,
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
      transformOrigin: origin ? `${origin[0]}px ${origin[1]}px` : '50% 50%',
      willChange: 'transform',
      filter: blur ? `blur(${blur}px)` : undefined,
      opacity,
      mixBlendMode: blend,
    }}
  >
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>
      {children}
    </svg>
  </div>
);

/** Palmier vu de côté : palmes arquées en silhouette pleine à bord dentelé + liseré de lumière. */
export const Palm: React.FC<{
  x: number;
  y: number;
  h: number;
  lean?: number;
  seed: string;
  color?: string;
  rim?: string | null;
  t?: number;
  fronds?: number;
  sway?: number;
  frondScale?: number;
}> = ({x, y, h, lean = 0.08, seed, color = '#050B14', rim = 'rgba(240,205,140,0.35)', t = 0, fronds = 11, sway = 0.03, frondScale = 1}) => {
  const cx = x + lean * h;
  const cy = y - h;
  // tronc : courbe quadratique, largeur décroissante
  const pts: [number, number][] = [];
  const cpx = x + lean * h * 0.15 + rr(seed + 'b', -0.04, 0.04) * h;
  const cpy = y - h * 0.55;
  for (let i = 0; i <= 16; i++) {
    const s = i / 16;
    pts.push([(1 - s) ** 2 * x + 2 * (1 - s) * s * cpx + s * s * cx, (1 - s) ** 2 * y + 2 * (1 - s) * s * cpy + s * s * cy]);
  }
  const wid = (s: number) => h * 0.02 * (1 - 0.5 * s) + 1.6;
  let left = '';
  let right = '';
  pts.forEach(([px, py], i) => {
    const [nx, ny] = i < pts.length - 1 ? [pts[i + 1][0] - px, pts[i + 1][1] - py] : [px - pts[i - 1][0], py - pts[i - 1][1]];
    const l = Math.hypot(nx, ny) || 1;
    const ox = (-ny / l) * wid(i / 16);
    const oy = (nx / l) * wid(i / 16);
    left += `${i ? 'L' : 'M'} ${(px + ox).toFixed(1)} ${(py + oy).toFixed(1)} `;
    right = `L ${(px - ox).toFixed(1)} ${(py - oy).toFixed(1)} ` + right;
  });
  const trunk = left + right + 'Z';

  let blades = '';
  let rims = '';
  const M = 18;
  for (let i = 0; i < fronds; i++) {
    const k = i / (fronds - 1);
    let a = -Math.PI * (0.03 + 0.94 * k) + rr(`${seed}a${i}`, -0.1, 0.1);
    a += Math.sin(t * 0.55 + i * 1.3 + rr(seed, 0, 6)) * sway;
    const vert = Math.abs(Math.sin(a)); // 1 = vers le haut
    const L = h * frondScale * rr(`${seed}L${i}`, 0.34, 0.46) * (1.18 - 0.5 * vert);
    const droop = L * (0.55 * (1 - vert) + 0.12);
    const P = (s: number): [number, number] => [cx + L * s * Math.cos(a), cy + L * s * Math.sin(a) + droop * s * s];
    const Wmax = L * 0.17;
    const up: string[] = [];
    const dn: string[] = [];
    for (let j = 0; j <= M * 2; j++) {
      const s = 0.06 + (0.94 * j) / (M * 2);
      const [px, py] = P(s);
      const [qx, qy] = P(Math.min(1, s + 0.02));
      let tx = qx - px;
      let ty = qy - py;
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const wv = Wmax * Math.sin(Math.PI * Math.min(1, 0.08 + 0.92 * s)) ** 0.75;
      const tooth = j % 2 === 0 ? 1 : 0.5;
      // les folioles retombent : direction tip-ward + vers le bas
      let dx = tx * 0.5;
      let dy = ty * 0.5 + 1;
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl;
      dy /= dl;
      dn.push(`${(px + dx * wv * tooth).toFixed(1)} ${(py + dy * wv * tooth).toFixed(1)}`);
      let ux = tx * 0.3;
      let uy = ty * 0.3 - 1;
      const ul = Math.hypot(ux, uy) || 1;
      ux /= ul;
      uy /= ul;
      up.push(`${(px + ux * wv * 0.42 * tooth).toFixed(1)} ${(py + uy * wv * 0.42 * tooth).toFixed(1)}`);
    }
    blades += `M ${up[0]} L ${up.join(' L ')} L ${dn.slice().reverse().join(' L ')} Z `;
    rims += `M ${up[0]} L ${up.filter((_, j) => j % 2 === 0).join(' L ')} `;
  }
  return (
    <g>
      <path d={trunk} fill={color} />
      <path d={blades} fill={color} stroke={color} strokeWidth={1} strokeLinejoin="round" />
      {rim && <path d={rims} stroke={rim} strokeWidth={Math.max(1, h * 0.004)} strokeLinejoin="round" fill="none" opacity={0.7} />}
      <circle cx={cx} cy={cy + h * 0.012} r={h * 0.022} fill={color} />
    </g>
  );
};

/** Buisson / masse de feuillage (silhouette). */
export const Bush: React.FC<{x: number; y: number; w: number; h: number; seed: string; color?: string; hi?: string}> = ({
  x,
  y,
  w,
  h,
  seed,
  color = '#06111A',
  hi = 'rgba(70,140,110,0.18)',
}) => {
  const blobs = Array.from({length: 9}, (_, i) => {
    const bx = x + rr(`${seed}x${i}`, -0.45, 0.45) * w;
    const by = y - rr(`${seed}y${i}`, 0.15, 0.6) * h;
    const r = rr(`${seed}r${i}`, 0.3, 0.55) * Math.min(w, h * 1.4);
    return {bx, by, r};
  });
  return (
    <g>
      {blobs.map((b, i) => (
        <ellipse key={i} cx={b.bx} cy={b.by} rx={b.r} ry={b.r * 0.78} fill={color} />
      ))}
      {blobs.slice(0, 4).map((b, i) => (
        <ellipse key={'h' + i} cx={b.bx - b.r * 0.15} cy={b.by - b.r * 0.35} rx={b.r * 0.55} ry={b.r * 0.28} fill={hi} />
      ))}
    </g>
  );
};
