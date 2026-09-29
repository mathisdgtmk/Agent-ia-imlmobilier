import React from 'react';
import {Layer, Palm, Bush, ridgePath, smoothstep, rr} from './kit';
import {SkyContent, SeaContent, FarLandContent} from './Seascape';
import {Villa, VILLA_GROUND, VILLA_W} from './Villa';

/**
 * Plan large « aérien » : villa contemporaine au crépuscule, mer des Caraïbes, mornes à l'horizon.
 * p ∈ [0,1] = avancée de la caméra vers la villa (parallaxe par calques).
 */
export const TwilightVilla: React.FC<{w: number; h: number; t: number; p: number; vertical: boolean}> = ({w, h, t, p, vertical}) => {
  const horizon = h * (vertical ? 0.37 : 0.415);
  const groundY = h * (vertical ? 0.655 : 0.795);
  const sv = (w * (vertical ? 0.99 : 0.6)) / VILLA_W;
  const vx = w * 0.5 - (VILLA_W * sv) / 2;
  const vy = groundY - VILLA_GROUND * sv;
  const sunX = w * (vertical ? 0.3 : 0.3);
  const drift = Math.sin(t * 0.45) * 3;
  const driftY = Math.sin(t * 0.33 + 1) * 2;
  const cam = (k: number) => 1 + k * p;
  const org: [number, number] = [w * 0.5, groundY];

  const slopeEnv = (x: number) => 0.22 + 0.78 * (smoothstep(0.52, 0.02, x) + smoothstep(0.55, 1.0, x));
  const slope = ridgePath(w, groundY - 4, h * (vertical ? 0.22 : 0.3), 'slopeA', {freq: 1.6, env: slopeEnv, step: 10});
  const slope2 = ridgePath(w, groundY + 2, h * 0.12, 'slopeB', {freq: 2.4, env: (x) => 0.2 + 0.8 * (smoothstep(0.42, 0.0, x) + smoothstep(0.6, 1.0, x)), step: 10});

  const palmSpecs = vertical
    ? [
        {x: 0.05, h: 0.2, lean: 0.05, seed: 'pA'},
        {x: 0.13, h: 0.15, lean: -0.04, seed: 'pB'},
        {x: 0.95, h: 0.19, lean: -0.05, seed: 'pC'},
        {x: 0.87, h: 0.14, lean: 0.04, seed: 'pD'},
      ]
    : [
        {x: 0.13, h: 0.36, lean: 0.05, seed: 'pA'},
        {x: 0.2, h: 0.27, lean: -0.04, seed: 'pB'},
        {x: 0.87, h: 0.33, lean: -0.05, seed: 'pC'},
        {x: 0.79, h: 0.24, lean: 0.04, seed: 'pD'},
      ];
  // palmes de premier plan : on vise la position du "bouquet" (couronne) plutôt que celle du pied
  const crown = vertical
    ? {l: [w * -0.02, h * 0.56], r: [w * 1.02, h * 0.5]}
    : {l: [w * 0.2, h * 0.42], r: [w * 0.8, h * 0.42]};
  const fgH = (cy: number) => h * 1.25 - cy;

  return (
    <div style={{position: 'absolute', inset: 0, background: '#03060F', overflow: 'hidden'}}>
      {/* ciel */}
      <Layer w={w} h={h} scale={cam(0.04)} origin={[sunX, horizon]} ty={driftY}>
        <SkyContent w={w} h={h} horizon={horizon} sunX={sunX} t={t} id="s1sky" />
      </Layer>
      {/* horizon lointain */}
      <Layer w={w} h={h} scale={cam(0.07)} origin={[w * 0.5, horizon]} tx={drift * 0.3}>
        <FarLandContent w={w} h={h} horizon={horizon} id="s1far" volcanoX={vertical ? 0.86 : 0.82} />
      </Layer>
      {/* mer */}
      <Layer w={w} h={h} scale={cam(0.1)} origin={[w * 0.5, horizon]} tx={drift * 0.5}>
        <SeaContent w={w} h={h} horizon={horizon} sunX={sunX} t={t} id="s1sea" />
      </Layer>
      {/* coteaux paysagers */}
      <Layer w={w} h={h} scale={cam(0.16)} origin={org} tx={drift}>
        <defs>
          <linearGradient id="s1slope" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#123138" />
            <stop offset="0.25" stopColor="#0A1D26" />
            <stop offset="1" stopColor="#050C14" />
          </linearGradient>
        </defs>
        <path d={slope} fill="url(#s1slope)" />
        <path d={slope} fill="none" stroke="rgba(245,215,150,0.22)" strokeWidth={2} transform="translate(0 -1.5)" />
        {Array.from({length: 26}, (_, i) => (
          <circle
            key={i}
            cx={rr(`lg${i}`, 0.02, 0.98) * w}
            cy={groundY - rr(`lgy${i}`, 0.004, 0.09) * h}
            r={rr(`lgr${i}`, 1.2, 2.6)}
            fill="#FFD996"
            opacity={0.35 + 0.35 * Math.sin(t * 1.2 + i)}
          />
        ))}
      </Layer>
      {/* villa */}
      <Layer w={w} h={h} scale={cam(0.3)} origin={org} tx={drift * 1.4}>
        <g transform={`translate(${vx} ${vy}) scale(${sv})`}>
          <Villa t={t} id="s1v" poolDepth={vertical ? 2.7 : 1} />
        </g>
        {/* palmiers d'ambiance de part et d'autre de la villa, éclairés par le bas */}
        {palmSpecs.map((s, i) => (
          <g key={i}>
            <ellipse cx={w * s.x} cy={groundY + 6} rx={h * 0.06} ry={h * 0.012} fill="rgba(255,200,120,0.32)" />
            <Palm x={w * s.x} y={groundY + 4} h={h * s.h} lean={s.lean} seed={s.seed} t={t} rim="rgba(255,215,150,0.5)" color="#040A12" />
          </g>
        ))}
        <Bush x={w * 0.07} y={groundY + h * 0.02} w={w * 0.16} h={h * 0.07} seed="bA" />
        <Bush x={w * 0.93} y={groundY + h * 0.02} w={w * 0.16} h={h * 0.07} seed="bB" />
        <Bush x={w * 0.31} y={groundY + h * 0.012} w={w * 0.08} h={h * 0.045} seed="bC" color="#07141A" />
        <Bush x={w * 0.72} y={groundY + h * 0.012} w={w * 0.08} h={h * 0.045} seed="bD" color="#07141A" />
      </Layer>
      {/* premier plan : palmes sombres, hors focus, qui encadrent l'image */}
      <Layer w={w} h={h} scale={cam(vertical ? 0.5 : 0.9)} origin={[w * 0.5, h * 0.9]} tx={drift * 2} blur={vertical ? 4 : 3.2}>
        <Palm x={crown.l[0] - 0.25 * fgH(crown.l[1])} y={h * 1.25} h={fgH(crown.l[1])} lean={0.25} seed="fgL" t={t} color="#02050A" rim="rgba(255,214,150,0.45)" fronds={11} frondScale={vertical ? 0.26 : 0.6} />
        <Palm x={crown.r[0] + 0.25 * fgH(crown.r[1])} y={h * 1.25} h={fgH(crown.r[1])} lean={-0.25} seed="fgR" t={t + 2} color="#02050A" rim="rgba(255,214,150,0.45)" fronds={11} frondScale={vertical ? 0.24 : 0.55} />
      </Layer>
      {/* particules dorées */}
      <Layer w={w} h={h} blend="screen">
        {Array.from({length: 36}, (_, i) => {
          const x = (rr(`dx${i}`, 0, 1) * w + t * rr(`dv${i}`, 4, 14) + Math.sin(t * 0.5 + i) * 12) % w;
          const y = h * rr(`dy${i}`, 0.15, 0.95) - t * rr(`du${i}`, 2, 8);
          const yy = ((y % h) + h) % h;
          const r = rr(`dr${i}`, 1.2, 4.2);
          return <circle key={i} cx={x} cy={yy} r={r} fill="rgba(255,226,170,0.55)" opacity={0.25 + 0.5 * Math.abs(Math.sin(t * 0.7 + i))} />;
        })}
      </Layer>
    </div>
  );
};
