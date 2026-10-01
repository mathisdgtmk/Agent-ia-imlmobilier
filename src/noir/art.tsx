import React from 'react';
import {MAP_H, MAP_W, MARTINIQUE_PATH, PLACES} from '../data/martinique';
import {F} from '../theme';
import {Draw} from './kit';
import {clamp01, expoOut, pr, smooth} from './motion';

export type PlaceKey = keyof typeof PLACES;

const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Villa moderne en dessin d'architecte, tracée au trait (p : 0 → 1). `sw` = épaisseur de trait apparente en px. */
export const VillaLines: React.FC<{p: number; width: number; sw?: number; opacity?: number; color?: string}> = ({p, width, sw = 1.6, opacity = 1, color = '#fff'}) => {
  const k = width / 1600;
  const W = sw / k; // épaisseur en unités du dessin
  const mull = (x0: number, n: number, dx: number, y0: number, y1: number) => Array.from({length: n}, (_, i) => `M${x0 + i * dx} ${y0} V${y1}`);
  const palm = (cx: number, dir: 1 | -1) => {
    const x = (dx: number) => cx + dir * dx;
    return {
      trunk: `M${cx} 440 C ${x(-12)} 360, ${x(0)} 280, ${x(32)} 196`,
      fronds: [
        `M${x(32)} 196 C ${x(-30)} 150, ${x(-80)} 170, ${x(-110)} 225`,
        `M${x(32)} 196 C ${x(0)} 120, ${x(-50)} 100, ${x(-92)} 122`,
        `M${x(32)} 196 C ${x(40)} 120, ${x(10)} 70, ${x(-30)} 52`,
        `M${x(32)} 196 C ${x(80)} 130, ${x(120)} 110, ${x(170)} 132`,
        `M${x(32)} 196 C ${x(100)} 172, ${x(150)} 192, ${x(180)} 244`,
        `M${x(32)} 196 C ${x(65)} 110, ${x(100)} 62, ${x(150)} 52`,
      ],
    };
  };
  const pl = palm(150, 1);
  const pr_ = palm(1500, -1);
  const waves = Array.from({length: 4}, (_, r) => `M${1050 + r * 14} ${452 + r * 6} q 22 -9 44 0 t 44 0 t 44 0 t 44 0 t 44 0 t 44 0 t 44 0 t 44 0 t 44 0 t 44 0`);
  return (
    <svg width={width} height={520 * k} viewBox="0 0 1600 520" style={{overflow: 'visible', opacity}}>
      {/* soleil / lune */}
      <Draw d="M1124 78 a56 56 0 1 0 112 0 a56 56 0 1 0 -112 0" p={seg(p, 0, 0.3)} width={W} stroke={color} />
      <Draw d="M1110 78 a70 70 0 1 0 140 0 a70 70 0 1 0 -140 0" p={seg(p, 0.05, 0.35)} width={W * 0.6} stroke={color} opacity={0.5} />
      {/* crête lointaine */}
      <Draw d="M0 420 C 70 392 120 372 190 380 S 300 336 372 364 S 470 400 520 410" p={seg(p, 0.0, 0.3)} width={W * 0.7} stroke={color} opacity={0.5} />
      <Draw d="M1010 428 C 1090 404 1160 392 1240 400 S 1380 378 1460 404" p={seg(p, 0.05, 0.35)} width={W * 0.7} stroke={color} opacity={0.5} />
      {/* sol */}
      <Draw d="M0 440 H1600" p={seg(p, 0, 0.2)} width={W} stroke={color} />
      {/* volume bas */}
      <Draw d="M250 440 V300 H1010 V440" p={seg(p, 0.1, 0.42)} width={W * 1.25} stroke={color} />
      {mull(345, 7, 95, 300, 440).map((d, i) => (
        <Draw key={'m' + i} d={d} p={seg(p, 0.35 + i * 0.012, 0.55 + i * 0.012)} width={W * 0.8} stroke={color} />
      ))}
      <Draw d="M820 440 V334 H906 V440" p={seg(p, 0.45, 0.62)} width={W} stroke={color} />
      {/* volume haut + dalle de toit */}
      <Draw d="M400 300 V176 H1370 V300" p={seg(p, 0.25, 0.58)} width={W * 1.25} stroke={color} />
      <Draw d="M378 176 H1394 M378 166 H1394 V176 M378 166 V176" p={seg(p, 0.4, 0.62)} width={W} stroke={color} />
      {mull(485, 8, 78, 176, 300).map((d, i) => (
        <Draw key={'u' + i} d={d} p={seg(p, 0.5 + i * 0.012, 0.7 + i * 0.012)} width={W * 0.8} stroke={color} />
      ))}
      {/* claustra bois */}
      {Array.from({length: 22}, (_, i) => (
        <Draw key={'s' + i} d={`M${1112 + i * 12} 176 V300`} p={seg(p, 0.6 + i * 0.006, 0.78 + i * 0.006)} width={W * 0.7} stroke={color} opacity={0.8} />
      ))}
      {/* palmiers */}
      {[pl, pr_].map((pm, j) => (
        <g key={j}>
          <Draw d={pm.trunk} p={seg(p, 0.5, 0.75)} width={W * 1.2} stroke={color} />
          {pm.fronds.map((d, i) => (
            <Draw key={i} d={d} p={seg(p, 0.65 + i * 0.03, 0.9 + i * 0.03)} width={W} stroke={color} />
          ))}
        </g>
      ))}
      {/* piscine */}
      <Draw d="M1030 440 V472 H1560 V440" p={seg(p, 0.7, 0.9)} width={W} stroke={color} />
      {waves.map((d, i) => (
        <Draw key={'w' + i} d={d} p={seg(p, 0.8 + i * 0.03, 0.98)} width={W * 0.7} stroke={color} opacity={0.7} />
      ))}
    </svg>
  );
};

// ------------------------------------------------------------------ carte
export const MapNoir: React.FC<{k: number; t: number; a: number; pins: {key: PlaceKey; at: number; n: number}[]; stroke?: number; color?: string}> = ({k, t, a, pins, stroke = 2.4, color = '#fff'}) => {
  const W = MAP_W * k;
  const H = MAP_H * k;
  const outline = pr(t, a, 2.2, smooth);
  const fill = pr(t, a + 1.4, 1.4, smooth);
  const grid = pr(t, a - 0.2, 1.2);
  const sw = stroke / k;
  const pad = 30;
  return (
    <div style={{position: 'relative', width: W, height: H}}>
      <svg width={W} height={H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <pattern id="nm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="1.1" />
          </pattern>
        </defs>
        {/* trame de points + repères de coordonnées */}
        {Array.from({length: 15}, (_, i) =>
          Array.from({length: 21}, (_, j) => (
            <circle key={`${i}-${j}`} cx={-pad + i * 32} cy={-pad + j * 32} r={1.1} fill={color} opacity={0.28 * grid} />
          )),
        )}
        <path d={MARTINIQUE_PATH} fill="url(#nm-hatch)" opacity={0.38 * fill} />
        <path d={MARTINIQUE_PATH} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - outline} />
        {pins.map((pn) => {
          const pt = PLACES[pn.key];
          const on = pr(t, pn.at, 0.4, expoOut);
          const since = t - pn.at;
          const ring = (off: number) => {
            const ph = (((since - off) % 1.6) + 1.6) % 1.6 / 1.6;
            return since > off ? ph : 1;
          };
          return (
            <g key={pn.key} opacity={on}>
              {[0, 0.55].map((off, i) => {
                const ph = ring(off);
                return <circle key={i} cx={pt.x} cy={pt.y} r={9 + ph * 40} fill="none" stroke={color} strokeWidth={1.4 / k} opacity={(1 - ph) * 0.8} />;
              })}
              <circle cx={pt.x} cy={pt.y} r={14} fill="#000" stroke={color} strokeWidth={1.6 / k} />
              <circle cx={pt.x} cy={pt.y} r={5.5 * (1 + 0.25 * Math.max(0, 1 - since * 3))} fill={color} />
              <text x={pt.x + 20} y={pt.y - 14} fill={color} fontFamily={F.display} fontWeight={700} fontSize={19} letterSpacing="1">
                {String(pn.n).padStart(2, '0')}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
