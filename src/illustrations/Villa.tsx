import React from 'react';
import {rr} from './kit';

/**
 * Villa contemporaine à toit plat, baies vitrées éclairées, piscine à débordement.
 * Dessinée dans un repère de 1000 × 560 unités ; le sol de la terrasse est à y = 400.
 */
export const VILLA_W = 1000;
export const VILLA_H = 560;
export const VILLA_GROUND = 400;

export const Villa: React.FC<{t?: number; glow?: number; id?: string; pool?: boolean; poolFar?: string; withDeck?: boolean; poolDepth?: number}> = ({
  t = 0,
  glow = 1,
  id = 'vl',
  pool = true,
  poolFar = '#E9C98F',
  withDeck = true,
  poolDepth = 1,
}) => {
  const g = (n: string) => `url(#${id}-${n})`;
  const panels = Array.from({length: 11}, (_, i) => 130 + i * 70);
  const slats = Array.from({length: 26}, (_, i) => 772 + i * 7);
  const shimmer = Array.from({length: 26}, (_, i) => {
    const y = 412 + rr(`${id}sy${i}`, 0, 1) ** 1.3 * 56;
    const w = rr(`${id}sw${i}`, 30, 150);
    const x = rr(`${id}sx${i}`, 90, 900);
    const o = (0.10 + 0.22 * (0.5 + 0.5 * Math.sin(t * rr(`${id}so${i}`, 0.8, 2.4) + i))) * rr(`${id}sq${i}`, 0.5, 1);
    return {x: x + Math.sin(t * 0.8 + i) * 6, y, w, o};
  });
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9BB" />
          <stop offset="0.55" stopColor="#FFC875" />
          <stop offset="1" stopColor="#EE9A4A" />
        </linearGradient>
        <linearGradient id={`${id}-glassUp`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFD990" />
          <stop offset="0.5" stopColor="#FFE7B4" />
          <stop offset="1" stopColor="#FFCB7C" />
        </linearGradient>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9E4D6" />
          <stop offset="0.6" stopColor="#B7BACB" />
          <stop offset="1" stopColor="#8B90AA" />
        </linearGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1C2233" />
          <stop offset="1" stopColor="#2D3549" />
        </linearGradient>
        <linearGradient id={`${id}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF4E2" />
          <stop offset="1" stopColor="#CFC8B8" />
        </linearGradient>
        <linearGradient id={`${id}-shadow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(3,6,14,0.75)" />
          <stop offset="1" stopColor="rgba(3,6,14,0)" />
        </linearGradient>
        <linearGradient id={`${id}-pool`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={poolFar} />
          <stop offset="0.25" stopColor="#5EA6B8" />
          <stop offset="0.6" stopColor="#1E6B8A" />
          <stop offset="1" stopColor="#0A3155" />
        </linearGradient>
        <linearGradient id={`${id}-refl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,205,120,0.75)" />
          <stop offset="1" stopColor="rgba(255,190,100,0)" />
        </linearGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8B6440" />
          <stop offset="1" stopColor="#5E4029" />
        </linearGradient>
        <radialGradient id={`${id}-lamp`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255,244,214,1)" />
          <stop offset="0.3" stopColor="rgba(255,214,140,0.65)" />
          <stop offset="1" stopColor="rgba(255,190,110,0)" />
        </radialGradient>
        <radialGradient id={`${id}-spill`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255,196,120,0.55)" />
          <stop offset="1" stopColor="rgba(255,190,110,0)" />
        </radialGradient>
        <filter id={`${id}-bloom`} x="-15%" y="-40%" width="130%" height="180%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* bloom : la lumière des baies déborde dans la nuit */}
      <g filter={g('bloom')} opacity={0.95 * glow}>
        <rect x={134} y={264} width={767} height={126} fill="#FFB85E" />
        <rect x={296} y={168} width={468} height={66} fill="#FFCB78" />
        <rect x={772} y={160} width={186} height={78} fill="#FFA24A" opacity={0.7} />
      </g>
      {/* halo de la maison sur la terrasse */}
      <ellipse cx={520} cy={412} rx={470} ry={70} fill={g('spill')} opacity={0.8 * glow} />

      {/* ---------- socle et terrasse ---------- */}
      <rect x={10} y={392} width={980} height={9} fill="#0D1220" />
      <rect x={10} y={392} width={980} height={1.6} fill="rgba(240,214,160,0.55)" />

      {/* ---------- aile gauche en pierre ---------- */}
      <rect x={20} y={262} width={112} height={130} fill={g('stone')} />
      {Array.from({length: 6}, (_, i) => (
        <rect key={i} x={20} y={268 + i * 21} width={112} height={1} fill="rgba(255,255,255,0.06)" />
      ))}
      <rect x={58} y={272} width={3} height={110} fill="rgba(255,205,130,0.85)" opacity={0.9 * glow} />
      <rect x={14} y={250} width={228} height={13} fill={g('roof')} />
      <rect x={14} y={250} width={228} height={1.6} fill="rgba(255,235,190,0.95)" />

      {/* ---------- rez-de-chaussée vitré ---------- */}
      <rect x={130} y={262} width={775} height={130} fill="#0B1020" />
      <rect x={134} y={264} width={767} height={126} fill={g('glass')} opacity={glow} />
      {/* intérieur : suspensions, canapé, plante, tableaux */}
      {[260, 470, 690].map((x, i) => (
        <g key={i}>
          <rect x={x - 0.8} y={264} width={1.6} height={22 + i * 3} fill="rgba(60,30,10,0.55)" />
          <circle cx={x} cy={290 + i * 3} r={20} fill={g('lamp')} />
          <circle cx={x} cy={290 + i * 3} r={4.5} fill="#FFF7E2" />
        </g>
      ))}
      <g fill="rgba(74,38,16,0.55)">
        <rect x={215} y={346} width={150} height={26} rx={10} />
        <rect x={208} y={331} width={164} height={20} rx={9} />
        <rect x={395} y={358} width={70} height={13} rx={3} />
        <rect x={560} y={344} width={110} height={28} rx={10} />
        <rect x={552} y={329} width={122} height={20} rx={9} />
        <rect x={720} y={352} width={54} height={20} rx={3} />
        <ellipse cx={850} cy={352} rx={20} ry={30} fill="rgba(20,50,30,0.65)" />
        <rect x={847} y={350} width={5} height={36} />
      </g>
      <g fill="rgba(120,60,24,0.35)">
        <rect x={300} y={290} width={70} height={38} />
        <rect x={610} y={292} width={44} height={44} />
      </g>
      {/* reflets sur la vitre */}
      <polygon points="150,264 260,264 190,390 134,390" fill="rgba(255,255,255,0.10)" />
      <polygon points="560,264 640,264 580,390 500,390" fill="rgba(255,255,255,0.07)" />
      {/* meneaux */}
      {panels.map((x) => (
        <rect key={x} x={x - 1.5} y={262} width={3} height={130} fill="#0C111E" />
      ))}
      <rect x={130} y={262} width={775} height={3} fill="#0C111E" />

      {/* ---------- ombre du porte-à-faux ---------- */}
      <rect x={130} y={246} width={790} height={30} fill={g('shadow')} />

      {/* ---------- étage cantilever ---------- */}
      <rect x={250} y={150} width={715} height={96} fill={g('wall')} />
      <rect x={250} y={236} width={715} height={10} fill="rgba(6,10,22,0.35)" />
      <rect x={296} y={168} width={468} height={66} fill={g('glassUp')} opacity={glow} />
      <g fill="rgba(90,46,18,0.32)">
        <rect x={330} y={212} width={120} height={14} rx={6} />
        <rect x={520} y={206} width={70} height={20} rx={4} />
        <rect x={640} y={170} width={3} height={60} />
        <rect x={660} y={170} width={2} height={60} />
      </g>
      {Array.from({length: 8}, (_, i) => (
        <rect key={i} x={296 + (i + 1) * 52} y={168} width={2.2} height={66} fill="#10141F" />
      ))}
      <rect x={296} y={168} width={468} height={2.6} fill="#10141F" />
      <rect x={296} y={231.5} width={468} height={2.6} fill="#10141F" />
      <polygon points="320,168 420,168 372,234 296,234" fill="rgba(255,255,255,0.12)" />
      {/* claustra en bois rétroéclairé */}
      <rect x={770} y={158} width={188} height={82} fill={g('wood')} />
      {slats.map((x) => (
        <rect key={x} x={x} y={158} width={3.4} height={82} fill="rgba(255,190,110,0.78)" opacity={0.85 * glow} />
      ))}
      <rect x={770} y={158} width={188} height={2} fill="rgba(0,0,0,0.5)" />
      {/* garde-corps verre */}
      <rect x={250} y={140} width={715} height={0} fill="none" />
      {/* dalle de toit */}
      <rect x={232} y={136} width={752} height={15} fill={g('roof')} />
      <rect x={232} y={136} width={752} height={1.8} fill="rgba(255,240,200,1)" />
      <rect x={232} y={150} width={752} height={2} fill="rgba(5,8,18,0.45)" />
      {/* poteaux */}
      <rect x={247} y={152} width={5} height={110} fill="#0C111E" />
      <rect x={896} y={246} width={6} height={146} fill="#0C111E" />

      {/* ---------- point lumineux : lanterneaux sur toit ---------- */}
      <rect x={520} y={128} width={120} height={8} fill="#E9E1CF" />
      <rect x={520} y={128} width={120} height={1.5} fill="rgba(255,245,215,0.9)" />

      {/* ---------- terrasse, piscine ---------- */}
      {pool && (
        <g transform={`translate(0 ${401 * (1 - poolDepth)}) scale(1 ${poolDepth})`}>
          <polygon points="80,401 940,401 1010,470 8,470" fill={g('pool')} />
          {/* reflets de la maison dans l'eau */}
          <g filter={g('soft')}>
            <polygon points="134,404 900,404 940,462 96,462" fill={g('refl')} opacity={0.55 * glow} />
          </g>
          {panels.slice(0, 10).map((x, i) => (
            <rect key={i} x={x + 4} y={404} width={56} height={58 + (i % 3) * 3} fill={g('refl')} opacity={0.32 * glow} transform={`translate(${(x - 500) * 0.06} 0)`} />
          ))}
          {shimmer.map((s, i) => (
            <rect key={i} x={s.x} y={s.y} width={s.w} height={1.6} rx={0.8} fill="rgba(255,238,200,1)" opacity={s.o} />
          ))}
          <rect x={80} y={399.5} width={860} height={3.4} fill="rgba(238,226,196,0.95)" />
          <polygon points="8,470 1010,470 1014,476 4,476" fill="rgba(226,214,186,0.9)" />
          <polygon points="4,476 1014,476 1016,482 2,482" fill="rgba(5,10,24,0.85)" />
        </g>
      )}
      {withDeck && (
        <g>
          {/* transats */}
          <g fill="#0A101E">
            <polygon points="60,398 118,398 126,392 66,392" />
            <polygon points="150,398 208,398 216,392 156,392" />
          </g>
          <g stroke="rgba(255,205,130,0.6)" strokeWidth={1.5}>
            <line x1={60} y1={398} x2={118} y2={398} />
            <line x1={150} y1={398} x2={208} y2={398} />
          </g>
        </g>
      )}
    </g>
  );
};
