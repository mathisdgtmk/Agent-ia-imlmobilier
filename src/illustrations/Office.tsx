import React from 'react';
import {Palm, rr} from './kit';
import {SkyContent, SeaContent, FarLandContent} from './Seascape';
import {Person, PersonBack, LOOKS, Look} from './People';

/** Rectangle (px du monde 1920×1080) où est affiché l'écran de l'ordinateur — pour aligner l'interface HTML. */
export const MONITOR = {x: 292, y: 402, w: 476, h: 286};
export const DESK_Y = 728;

type Mood = 'dusk' | 'day';

const PAL = {
  dusk: {
    wallA: '#0F1830', wallB: '#0A1122', slatA: '#20170F', slatB: '#2B1F15', floorA: '#111A31', floorB: '#05070E', deskTop: '#5C4029', deskFront: '#1A130E',
    deskEdge: 'rgba(240,214,160,0.7)', ceiling: '#070B16', chair: '#0B1020', pot: '#1B1F2C', leaf: '#0B2A2C', leafHi: 'rgba(90,170,140,0.25)', frame: '#0C111E', warm: '255,196,120',
  },
  day: {
    wallA: '#EDE8DC', wallB: '#DDD5C4', slatA: '#B48F63', slatB: '#C29D70', floorA: '#D9D0BD', floorB: '#B7AC95', deskTop: '#D2AC7C', deskFront: '#B58C5B',
    deskEdge: 'rgba(255,255,255,0.9)', ceiling: '#F5F1E6', chair: '#2A3045', pot: '#F0EBDD', leaf: '#3E7A56', leafHi: 'rgba(190,240,190,0.35)', frame: '#2B303C', warm: '255,230,180',
  },
} as const;

/**
 * Bureau d'agence contemporain : mur en lattes de bois, baie vitrée sur la mer, bureau, écran, agent et client.
 * Décors étendus au-delà de 1920×1080 (pour les recadrages verticaux).
 */
export const OfficeSvg: React.FC<{
  t: number;
  mood?: Mood;
  id?: string;
  agentPose?: {l?: [number, number]; r?: [number, number]};
  agentTilt?: number;
  agentLean?: number;
  client?: {look: Look; x: number; opacity: number; dy?: number} | null;
  ring?: number; // 0..1 : intensité de la sonnerie du téléphone
  monitorGlow?: number;
  agentLook?: Look;
  agentX?: number;
}> = ({t, mood = 'dusk', id = 'of', agentPose, agentTilt = 0, agentLean = 0, client, ring = 0, monitorGlow = 1, agentLook, agentX = 1010}) => {
  const P = PAL[mood];
  const dusk = mood === 'dusk';
  const slats = Array.from({length: 60}, (_, i) => -1200 + i * 42);
  const winX = 880;
  const winY = 40;
  const winW = 1020;
  const winH = 700;
  const horizon = winH * 0.6;
  const sunX = winW * 0.34;
  const g = (n: string) => `url(#${id}-${n})`;
  const agent = agentLook ?? (dusk ? LOOKS.agent : LOOKS.agentDay);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.wallA} />
          <stop offset="1" stopColor={P.wallB} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.floorA} />
          <stop offset="1" stopColor={P.floorB} />
        </linearGradient>
        <linearGradient id={`${id}-desk`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={P.deskTop} />
          <stop offset="0.5" stopColor={dusk ? '#6B4B31' : '#DDB98A'} />
          <stop offset="1" stopColor={P.deskTop} />
        </linearGradient>
        <radialGradient id={`${id}-blue`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(96,150,255,0.55)" />
          <stop offset="1" stopColor="rgba(96,150,255,0)" />
        </radialGradient>
        <radialGradient id={`${id}-gold`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={`rgba(${P.warm},0.55)`} />
          <stop offset="1" stopColor={`rgba(${P.warm},0)`} />
        </radialGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgba(${P.warm},0.42)`} />
          <stop offset="1" stopColor={`rgba(${P.warm},0)`} />
        </linearGradient>
        <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgba(${P.warm},0.30)`} />
          <stop offset="1" stopColor={`rgba(${P.warm},0)`} />
        </linearGradient>
        <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <clipPath id={`${id}-win`}>
          <rect x={winX} y={winY} width={winW} height={winH} />
        </clipPath>
      </defs>

      {/* mur + plafond + sol (étendus) */}
      <rect x={-1300} y={-1300} width={4600} height={2100} fill={g('wall')} />
      <rect x={-1300} y={-1300} width={4600} height={1340} fill={P.ceiling} />
      <rect x={-1300} y={760} width={4600} height={1700} fill={g('floor')} />
      <rect x={-1300} y={758} width={4600} height={3} fill="rgba(0,0,0,0.35)" />

      {/* mur de lattes de bois (à gauche) */}
      <g>
        <rect x={-1260} y={40} width={2120} height={720} fill={P.slatA} />
        {slats.map((x, i) => (
          <rect key={i} x={x} y={40} width={30} height={720} fill={i % 2 ? P.slatB : P.slatA} opacity={0.95} />
        ))}
        {slats.map((x, i) => (
          <rect key={'h' + i} x={x + 30} y={40} width={12} height={720} fill="rgba(0,0,0,0.35)" />
        ))}
        <rect x={-1260} y={40} width={2120} height={720} fill={dusk ? 'rgba(4,8,20,0.32)' : 'rgba(255,255,255,0.05)'} />
        <rect x={-1260} y={40} width={2120} height={44} fill={dusk ? 'rgba(255,196,120,0.15)' : 'rgba(255,255,255,0.15)'} />
      </g>
      {/* étagère */}
      <g>
        <rect x={560} y={330} width={250} height={8} fill={dusk ? '#3A2A1C' : '#8B6A45'} />
        <rect x={588} y={288} width={16} height={42} fill="#C9A55C" />
        <rect x={608} y={296} width={12} height={34} fill={dusk ? '#22386B' : '#5C7DB8'} />
        <rect x={624} y={282} width={14} height={48} fill="#EDE5D3" />
        <ellipse cx={730} cy={309} rx={22} ry={22} fill="#E8D8B0" opacity={0.95} />
        <rect x={718} y={326} width={24} height={4} fill="#C9A55C" />
      </g>

      {/* baie vitrée : la mer et le ciel du crépuscule (ou du jour) */}
      <g clipPath={g('win')}>
        <svg x={winX} y={winY} width={winW} height={winH} viewBox={`0 0 ${winW} ${winH}`}>
          <SkyContent w={winW} h={winH} horizon={horizon} sunX={sunX} t={t} id={`${id}ws`} mood={dusk ? 'dusk' : 'day'} clouds={5} />
          <FarLandContent w={winW} h={winH} horizon={horizon} id={`${id}wf`} mood={dusk ? 'dusk' : 'day'} volcanoX={0.86} />
          <SeaContent w={winW} h={winH} horizon={horizon} sunX={sunX} t={t} id={`${id}wsea`} mood={dusk ? 'dusk' : 'day'} shimmer={dusk ? 1 : 0.5} />
          <Palm x={winW * 0.9} y={winH + 20} h={winH * 0.62} lean={-0.12} seed={`${id}wp1`} t={t} color={dusk ? '#050A14' : '#1E4A34'} rim={dusk ? 'rgba(255,215,150,0.45)' : 'rgba(255,255,255,0.35)'} fronds={10} />
        </svg>
        <polygon points={`${winX + 80},${winY} ${winX + 260},${winY} ${winX + 60},${winY + winH} ${winX - 120},${winY + winH}`} fill="rgba(255,255,255,0.05)" />
        <polygon points={`${winX + 520},${winY} ${winX + 600},${winY} ${winX + 400},${winY + winH} ${winX + 320},${winY + winH}`} fill="rgba(255,255,255,0.04)" />
      </g>
      {[winX, winX + 340, winX + 680, winX + winW].map((x, i) => (
        <rect key={i} x={x - 7} y={winY - 8} width={14} height={winH + 16} fill={P.frame} />
      ))}
      <rect x={winX - 7} y={winY - 10} width={winW + 14} height={14} fill={P.frame} />
      <rect x={winX - 7} y={winY + winH - 4} width={winW + 14} height={16} fill={P.frame} />

      {/* faisceaux de lumière de la baie sur le sol */}
      <g filter={g('blur')} opacity={dusk ? 0.9 : 0.55}>
        <polygon points={`${winX + 40},760 ${winX + 300},760 ${winX - 200},1060 ${winX - 620},1060`} fill={g('shaft')} />
        <polygon points={`${winX + 420},760 ${winX + 640},760 ${winX + 300},1060 ${winX - 40},1060`} fill={g('shaft')} opacity={0.7} />
      </g>

      {/* plafond : bandeau LED + suspensions */}
      <rect x={-1300} y={30} width={4600} height={9} fill={dusk ? 'rgba(255,214,150,0.85)' : 'rgba(255,255,255,0.9)'} />
      <rect x={-1300} y={20} width={4600} height={32} fill={g('gold')} opacity={0.0} />
      {[560, 1010].filter((x) => dusk || x !== 560).map((x, i0) => {
        const i = x === 560 ? 0 : 1;
        return (
        <g key={i0}>
          <rect x={x - 1.5} y={38} width={3} height={i ? 150 : 190} fill="#0B0E16" />
          <path d={`M ${x - 46} ${i ? 232 : 250} Q ${x} ${i ? 168 : 188} ${x + 46} ${i ? 232 : 250} Z`} fill={dusk ? '#141924' : '#2B303C'} />
          <ellipse cx={x} cy={i ? 232 : 250} rx={46} ry={5} fill="#FFE7B0" />
          <polygon points={`${x - 44},${i ? 234 : 252} ${x + 44},${i ? 234 : 252} ${x + 230},${DESK_Y} ${x - 230},${DESK_Y}`} fill={g('cone')} opacity={dusk ? 0.7 : 0.35} />
        </g>
        );
      })}

      {/* lueur froide de l'écran et lueur dorée de la baie */}
      {dusk && <ellipse cx={530} cy={560} rx={520} ry={330} fill={g('blue')} opacity={0.42 * monitorGlow} />}
      <ellipse cx={1500} cy={420} rx={640} ry={420} fill={g('gold')} opacity={dusk ? 0.22 : 0.16} />

      {/* plante d'angle */}
      <g>
        <path d="M 96 760 L 134 760 L 128 838 L 102 838 Z" fill={P.pot} />
        <rect x={113} y={560} width={5} height={205} fill={dusk ? '#0A0F18' : '#5C4630'} />
        {[
          [70, 610, 60, 28, -30], [160, 600, 62, 28, 25], [80, 540, 58, 26, -40], [150, 530, 60, 27, 35], [116, 500, 58, 26, 5], [60, 680, 54, 24, -20], [170, 690, 54, 24, 22],
        ].map(([x, y, rx, ry, rot], i) => (
          <g key={i} transform={`rotate(${(rot as number) + Math.sin(t * 0.6 + i) * 1.2} ${x} ${y})`}>
            <ellipse cx={x as number} cy={y as number} rx={rx as number} ry={ry as number} fill={P.leaf} />
            <ellipse cx={(x as number) - 8} cy={(y as number) - 8} rx={(rx as number) * 0.55} ry={(ry as number) * 0.3} fill={P.leafHi} />
          </g>
        ))}
      </g>

      {/* ombre du bureau sur le sol */}
      <ellipse cx={840} cy={1010} rx={760} ry={46} fill="rgba(0,0,0,0.45)" filter={g('blur')} />

      {/* fauteuil de l'agent */}
      <g>
        <path d={`M ${agentX - 138} 790 L ${agentX - 124} 470 Q ${agentX} 380 ${agentX + 124} 470 L ${agentX + 138} 790 Z`} fill={P.chair} />
        <path d={`M ${agentX - 124} 470 Q ${agentX} 380 ${agentX + 124} 470`} stroke={dusk ? 'rgba(255,214,150,0.4)' : 'rgba(255,255,255,0.4)'} strokeWidth={2} fill="none" />
      </g>
      {/* l'agent (assis derrière le bureau) */}
      <g transform={`translate(${agentX} ${DESK_Y - 105 * 3.7 + 6}) scale(3.7)`}>
        <Person look={agent} id={`${id}ag`} bust pose={agentPose ?? {l: [10, 70], r: [-12, -68]}} tilt={agentTilt} lean={agentLean} rim={dusk ? 'rgba(255,214,150,0.55)' : 'rgba(255,255,255,0.5)'} />
      </g>

      {/* bureau */}
      <g>
        <rect x={250} y={DESK_Y} width={1180} height={20} fill={g('desk')} />
        <rect x={250} y={DESK_Y} width={1180} height={2} fill={P.deskEdge} />
        <rect x={262} y={DESK_Y + 20} width={1156} height={52} fill={P.deskFront} />
        <rect x={262} y={DESK_Y + 20} width={1156} height={10} fill="rgba(0,0,0,0.3)" />
        <rect x={262} y={DESK_Y + 72} width={14} height={230} fill={dusk ? '#0A0D15' : '#2B303C'} />
        <rect x={1404} y={DESK_Y + 72} width={14} height={230} fill={dusk ? '#0A0D15' : '#2B303C'} />
      </g>

      {/* écran d'ordinateur (l'interface HTML est superposée par la scène) */}
      <g>
        <ellipse cx={MONITOR.x + MONITOR.w / 2} cy={DESK_Y} rx={92} ry={7} fill={dusk ? '#141924' : '#2B303C'} />
        <rect x={MONITOR.x + MONITOR.w / 2 - 12} y={MONITOR.y + MONITOR.h + 8} width={24} height={DESK_Y - (MONITOR.y + MONITOR.h) - 8} fill={dusk ? '#1B202B' : '#3A4050'} />
        <rect x={MONITOR.x - 12} y={MONITOR.y - 12} width={MONITOR.w + 24} height={MONITOR.h + 24} rx={12} fill="#07090F" stroke={dusk ? '#2B3245' : '#4A5165'} strokeWidth={2} />
        <rect x={MONITOR.x} y={MONITOR.y} width={MONITOR.w} height={MONITOR.h} fill="#060A16" />
      </g>
      {/* clavier, souris */}
      <rect x={390} y={DESK_Y - 8} width={280} height={9} rx={3} fill={dusk ? '#141925' : '#3A4050'} />
      <rect x={398} y={DESK_Y - 8} width={264} height={2} fill="rgba(255,255,255,0.10)" />
      <ellipse cx={720} cy={DESK_Y - 3} rx={22} ry={4} fill={dusk ? '#141925' : '#3A4050'} />

      {/* smartphone posé sur son support : sonnerie */}
      <g transform="translate(1236 0)">
        {ring > 0 &&
          [0, 1, 2].map((k) => {
            const ph = ((t * 1.6 + k / 3) % 1);
            return <circle key={k} cx={0} cy={DESK_Y - 70} r={40 + ph * 120} fill="none" stroke={`rgba(${P.warm},${(1 - ph) * 0.55 * ring})`} strokeWidth={3} />;
          })}
        <rect x={-30} y={DESK_Y - 128} width={60} height={120} rx={10} fill="#07090F" stroke="#3A4152" strokeWidth={2} />
        <rect x={-26} y={DESK_Y - 123} width={52} height={110} rx={7} fill={ring > 0 ? '#1B3A8A' : '#0B1226'} />
        {ring > 0 && (
          <>
            <circle cx={0} cy={DESK_Y - 80} r={13} fill="#E9D09A" opacity={0.95} />
            <rect x={-16} y={DESK_Y - 52} width={32} height={6} rx={3} fill="rgba(255,255,255,0.6)" />
            <rect x={-14} y={DESK_Y - 36} width={12} height={12} rx={6} fill="#4ADE80" />
            <rect x={2} y={DESK_Y - 36} width={12} height={12} rx={6} fill="#F87171" />
          </>
        )}
        <rect x={-36} y={DESK_Y - 8} width={72} height={8} rx={2} fill="#0B0E16" />
      </g>
      {/* petite plante + tasse */}
      <g>
        <rect x={1338} y={DESK_Y - 42} width={34} height={42} rx={4} fill={dusk ? '#E9DDC0' : '#F5EFE0'} />
        {[[-8, -60, 12, 30, -25], [8, -64, 12, 32, 20], [0, -74, 11, 28, 0]].map(([dx, dy, rx, ry, rot], i) => (
          <ellipse key={i} cx={1355 + (dx as number)} cy={DESK_Y + (dy as number)} rx={rx as number} ry={ry as number} fill={P.leaf} transform={`rotate(${rot} ${1355 + (dx as number)} ${DESK_Y + (dy as number)})`} />
        ))}
        <rect x={840} y={DESK_Y - 26} width={22} height={26} rx={3} fill="#E9DDC0" />
        <rect x={860} y={DESK_Y - 20} width={7} height={13} rx={3} fill="none" stroke="#E9DDC0" strokeWidth={2.4} />
      </g>

      {/* client (vu de dos, au premier plan) */}
      {client && (
        <g opacity={client.opacity} transform={`translate(${client.x} ${470 - 14 * 3.4 + (client.dy ?? 0)}) scale(3.4)`}>
          <PersonBack look={client.look} id={`${id}cl`} chair={dusk ? '#0B1020' : '#2B3045'} rim={dusk ? 'rgba(255,214,150,0.5)' : 'rgba(255,255,255,0.5)'} />
        </g>
      )}

      {/* poussières lumineuses dans la lumière de la baie */}
      {dusk &&
        Array.from({length: 22}, (_, i) => {
          const x = 900 + ((rr(`${id}px${i}`, 0, 1) * 1000 + t * rr(`${id}pv${i}`, 4, 12)) % 1000);
          const y = 120 + ((rr(`${id}py${i}`, 0, 1) * 600 - t * rr(`${id}pu${i}`, 3, 9) + 6000) % 600);
          return <circle key={i} cx={x} cy={y} r={rr(`${id}pr${i}`, 1.2, 3)} fill="rgba(255,226,170,0.7)" opacity={0.15 + 0.45 * Math.abs(Math.sin(t * 0.6 + i))} />;
        })}
    </g>
  );
};
