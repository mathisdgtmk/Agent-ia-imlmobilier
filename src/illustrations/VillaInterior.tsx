import React from 'react';
import {Palm, rr} from './kit';
import {SkyContent, SeaContent, FarLandContent} from './Seascape';
import {Person, LOOKS, Look} from './People';

export type Actor = {look: Look; x: number; y?: number; scale?: number; pose?: {l?: [number, number]; r?: [number, number]}; tilt?: number; lean?: number; flip?: boolean; opacity?: number};

/**
 * Séjour d'une villa contemporaine (monde 1920 × 1080) : grande baie sur la piscine et la mer, parquet clair, canapé,
 * lumière dorée de fin de journée. Les personnages sont passés en paramètre.
 */
export const VillaInteriorSvg: React.FC<{t: number; id?: string; actors: Actor[]}> = ({t, id = 'vi', actors}) => {
  const g = (n: string) => `url(#${id}-${n})`;
  const gx = 250;
  const gy = 70;
  const gw = 1420;
  const gh = 720;
  const horizon = gh * 0.47;
  const planks = Array.from({length: 16}, (_, i) => i);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3EEE2" />
          <stop offset="1" stopColor="#E2DACA" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D2AE80" />
          <stop offset="1" stopColor="#8D6A44" />
        </linearGradient>
        <linearGradient id={`${id}-pool`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFE7EE" />
          <stop offset="0.4" stopColor="#4FB0C8" />
          <stop offset="1" stopColor="#1C7DA3" />
        </linearGradient>
        <linearGradient id={`${id}-deck`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B8926A" />
          <stop offset="1" stopColor="#7A5A3A" />
        </linearGradient>
        <linearGradient id={`${id}-sofa`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4ECDC" />
          <stop offset="1" stopColor="#D4C6AC" />
        </linearGradient>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,226,160,0.55)" />
          <stop offset="1" stopColor="rgba(255,226,160,0)" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <clipPath id={`${id}-glass`}>
          <rect x={gx} y={gy} width={gw} height={gh} />
        </clipPath>
      </defs>

      {/* murs, plafond, sol */}
      <rect x={-1300} y={-1300} width={4600} height={2400} fill={g('wall')} />
      <rect x={-1300} y={-1300} width={4600} height={1372} fill="#F7F3EA" />
      <rect x={-1300} y={790} width={4600} height={1600} fill={g('floor')} />
      <rect x={-1300} y={786} width={4600} height={8} fill="rgba(60,36,16,0.45)" />
      {planks.map((i) => (
        <rect key={i} x={-1300} y={800 + i * i * 0.9 + i * 8} width={4600} height={1.5 + i * 0.12} fill="rgba(70,44,20,0.22)" />
      ))}
      {/* plafond : bandeau lumineux */}
      <rect x={-1300} y={60} width={4600} height={10} fill="rgba(255,236,190,0.9)" />

      {/* baie vitrée sur la piscine et la mer */}
      <g clipPath={g('glass')}>
        <svg x={gx} y={gy} width={gw} height={gh} viewBox={`0 0 ${gw} ${gh}`}>
          <SkyContent w={gw} h={gh} horizon={horizon} sunX={gw * 0.72} t={t} id={`${id}sk`} mood="golden" clouds={5} />
          <FarLandContent w={gw} h={gh} horizon={horizon} id={`${id}fl`} mood="golden" islandSide="left" volcanoX={2} />
          <SeaContent w={gw} h={gh} horizon={horizon} sunX={gw * 0.72} t={t} id={`${id}sea`} mood="golden" shimmer={0.7} />
          {/* terrasse + piscine à débordement */}
          <rect x={0} y={horizon + 60} width={gw} height={gh} fill={g('deck')} />
          <rect x={90} y={horizon + 70} width={gw - 180} height={190} fill={g('pool')} />
          <rect x={90} y={horizon + 66} width={gw - 180} height={5} fill="rgba(255,255,255,0.85)" />
          {Array.from({length: 22}, (_, i) => (
            <rect key={i} x={rr(`${id}pw${i}`, 130, gw - 330)} y={horizon + 90 + rr(`${id}py${i}`, 0, 1) * 150} width={rr(`${id}pl${i}`, 40, 180)} height={2} fill="rgba(255,255,255,0.75)" opacity={0.25 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.6 + i))} />
          ))}
          <rect x={0} y={horizon + 262} width={gw} height={gh} fill={g('deck')} />
          <Palm x={gw * 0.12} y={horizon + 300} h={gh * 0.66} lean={0.05} seed={`${id}pa`} t={t} color="#1E4A34" rim="rgba(255,240,190,0.5)" fronds={11} />
          <Palm x={gw * 0.9} y={horizon + 280} h={gh * 0.55} lean={-0.06} seed={`${id}pb`} t={t + 1} color="#1E4A34" rim="rgba(255,240,190,0.5)" fronds={10} />
        </svg>
        <polygon points={`${gx + 200},${gy} ${gx + 420},${gy} ${gx + 160},${gy + gh} ${gx - 60},${gy + gh}`} fill="rgba(255,255,255,0.10)" />
        <polygon points={`${gx + 860},${gy} ${gx + 960},${gy} ${gx + 700},${gy + gh} ${gx + 600},${gy + gh}`} fill="rgba(255,255,255,0.07)" />
      </g>
      {[gx, gx + gw / 4, gx + gw / 2, gx + (3 * gw) / 4, gx + gw].map((x, i) => (
        <rect key={i} x={x - 6} y={gy - 6} width={12} height={gh + 12} fill="#20242E" />
      ))}
      <rect x={gx - 6} y={gy - 8} width={gw + 12} height={14} fill="#20242E" />
      <rect x={gx - 6} y={gy + gh - 4} width={gw + 12} height={14} fill="#20242E" />

      {/* lumière du soleil sur le parquet */}
      <g filter={g('blur')} opacity={0.85}>
        <polygon points={`${gx + 200},796 ${gx + 720},796 ${gx + 300},1060 ${gx - 340},1060`} fill={g('sun')} />
        <polygon points={`${gx + 900},796 ${gx + 1240},796 ${gx + 960},1060 ${gx + 560},1060`} fill={g('sun')} opacity={0.7} />
      </g>

      {/* tapis, canapé, table basse */}
      <ellipse cx={520} cy={930} rx={470} ry={70} fill="rgba(236,222,196,0.85)" />
      <g>
        <rect x={110} y={650} width={430} height={110} rx={26} fill={g('sofa')} />
        <rect x={100} y={700} width={450} height={92} rx={22} fill="#EADFC8" />
        <rect x={130} y={706} width={190} height={76} rx={18} fill="#F6EEDD" />
        <rect x={330} y={706} width={190} height={76} rx={18} fill="#F6EEDD" />
        <rect x={140} y={655} width={70} height={62} rx={14} fill="#C9A55C" transform="rotate(-6 175 686)" />
        <rect x={110} y={790} width={14} height={16} fill="#3A2A1C" />
        <rect x={526} y={790} width={14} height={16} fill="#3A2A1C" />
      </g>
      <g>
        <ellipse cx={700} cy={852} rx={110} ry={24} fill="#2A2018" />
        <ellipse cx={700} cy={842} rx={110} ry={22} fill="#7A5A3A" />
        <rect x={670} y={818} width={20} height={22} rx={4} fill="#F4ECDC" />
      </g>
      {/* plante */}
      <g>
        <path d="M 1740 760 L 1800 760 L 1792 850 L 1748 850 Z" fill="#F0EBDD" />
        <rect x={1768} y={560} width={6} height={205} fill="#5C4630" />
        {[[1730, 610, 60, 28, -30], [1810, 596, 62, 28, 25], [1738, 540, 58, 26, -40], [1806, 528, 60, 27, 35], [1770, 490, 58, 26, 5]].map(([x, y, rx, ry, rot], i) => (
          <g key={i} transform={`rotate(${(rot as number) + Math.sin(t * 0.6 + i) * 1.2} ${x} ${y})`}>
            <ellipse cx={x as number} cy={y as number} rx={rx as number} ry={ry as number} fill="#3E7A56" />
            <ellipse cx={(x as number) - 8} cy={(y as number) - 8} rx={(rx as number) * 0.55} ry={(ry as number) * 0.3} fill="rgba(190,240,190,0.35)" />
          </g>
        ))}
      </g>
      {/* suspensions */}
      {[560, 960, 1360].map((x, i) => (
        <g key={i}>
          <rect x={x - 1} y={70} width={2} height={120 + (i % 2) * 24} fill="#23262E" />
          <circle cx={x} cy={210 + (i % 2) * 24} r={30} fill="#FFF3D0" />
          <circle cx={x} cy={210 + (i % 2) * 24} r={70} fill="rgba(255,236,190,0.35)" filter={g('blur')} />
        </g>
      ))}
      {/* ombre au sol sous les personnages */}
      {actors.map((a, i) => (
        <ellipse key={'s' + i} cx={a.x} cy={(a.y ?? 962) + 4} rx={82 * (a.scale ?? 2.9) * 0.34} ry={12} fill="rgba(40,24,10,0.35)" opacity={a.opacity ?? 1} />
      ))}
      {/* personnages */}
      {actors.map((a, i) => {
        const sc = a.scale ?? 2.9;
        const fy = (a.y ?? 962) + Math.sin(t * 1.6 + i * 1.9) * 2.2;
        return (
          <g key={i} opacity={a.opacity ?? 1} transform={`translate(${a.x} ${fy - 252 * sc}) scale(${sc})`}>
            <Person look={a.look} id={`${id}a${i}`} pose={a.pose} tilt={a.tilt} lean={a.lean} flip={a.flip} rim="rgba(255,226,160,0.6)" />
          </g>
        );
      })}
    </g>
  );
};
