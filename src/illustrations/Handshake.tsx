import React from 'react';

/**
 * Gros plan sur une poignée de main (repère 1920 × 1080, centre ≈ 960,560) :
 * manche de costume bleu nuit (poignet blanc + bouton de manchette doré) et manche crème.
 * `grip` (0..1) : rapprochement des mains puis serrage.
 */
export const HandshakeSvg: React.FC<{grip: number; t: number}> = ({grip, t}) => {
  const approach = (1 - grip) * 170;
  const crease = 'rgba(96,54,30,0.38)';
  return (
    <g>
      <defs>
        <linearGradient id="hs-navy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2E4585" />
          <stop offset="1" stopColor="#0E1838" />
        </linearGradient>
        <linearGradient id="hs-cream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3E9D0" />
          <stop offset="1" stopColor="#C5B389" />
        </linearGradient>
        <linearGradient id="hs-skinA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E0AB80" />
          <stop offset="1" stopColor="#B27A4E" />
        </linearGradient>
        <linearGradient id="hs-skinB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B57A52" />
          <stop offset="1" stopColor="#7C4C2E" />
        </linearGradient>
        <radialGradient id="hs-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255,226,160,0.9)" />
          <stop offset="1" stopColor="rgba(255,226,160,0)" />
        </radialGradient>
        <filter id="hs-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>

      <ellipse cx={1000} cy={570} rx={540} ry={340} fill="url(#hs-glow)" opacity={0.3 + 0.45 * grip} />

      <g filter="url(#hs-shadow)">
        {/* ---- cliente : manche crème + main (dessous) ---- */}
        <g transform={`translate(${approach} 0)`}>
          <path d="M 2200 470 C 1800 468 1500 486 1230 520 L 1220 702 C 1500 702 1800 722 2200 738 Z" fill="url(#hs-cream)" />
          <path d="M 2200 470 C 1800 468 1500 486 1230 520" stroke="rgba(255,255,255,0.6)" strokeWidth={4} fill="none" />
          <rect x={1180} y={514} width={54} height={190} rx={10} fill="#FBF8F0" />
          {/* paume */}
          <path d="M 1182 526 C 1120 508 1040 522 984 562 C 940 594 934 650 968 676 C 1006 704 1096 708 1182 694 Z" fill="url(#hs-skinB)" />
          {/* bouts de doigts qui passent sous la main de l'agent */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${960 + i * 38} ${676 + i * 6}) rotate(${18 - i * 5})`}>
              <rect x={-17} y={-10} width={34} height={56} rx={17} fill="url(#hs-skinB)" />
              <path d="M 0 -6 L 0 30" stroke={crease} strokeWidth={2} strokeLinecap="round" />
            </g>
          ))}
        </g>

        {/* ---- agent : manche bleu nuit + main (dessus) ---- */}
        <g transform={`translate(${-approach} 0)`}>
          <path d="M -280 430 C 200 420 520 430 800 462 L 806 664 C 500 692 200 702 -280 722 Z" fill="url(#hs-navy)" />
          <path d="M -280 430 C 200 420 520 430 800 462" stroke="rgba(255,226,160,0.45)" strokeWidth={4} fill="none" />
          <rect x={790} y={456} width={54} height={214} rx={10} fill="#F4F0E6" />
          <circle cx={818} cy={520} r={9} fill="#E2C77E" />
          <circle cx={818} cy={520} r={4} fill="#FFF2C6" />
          {/* dos de la main */}
          <path d="M 842 474 C 900 452 1000 452 1072 480 C 1122 498 1140 536 1128 574 C 1112 614 1060 636 1000 644 C 930 652 876 650 842 654 Z" fill="url(#hs-skinA)" />
          {/* tendons / articulations */}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M ${930 + i * 40} ${500 + i * 6} C ${970 + i * 36} ${508 + i * 8} ${1000 + i * 30} ${520 + i * 10} ${1030 + i * 26} ${540 + i * 12}`} stroke={crease} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          ))}
          {/* doigts refermés sur la main de la cliente */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${1122 + (i % 2) * 6} ${520 + i * 34}) rotate(${72 - i * 4})`}>
              <rect x={-38} y={-15} width={82} height={30} rx={15} fill="url(#hs-skinA)" stroke={crease} strokeWidth={1.8} />
              <path d="M -6 -8 L -6 8" stroke={crease} strokeWidth={1.6} strokeLinecap="round" />
            </g>
          ))}
          {/* pouce, par-dessus */}
          <g transform="translate(1006 480) rotate(-6)">
            <rect x={-96} y={-26} width={214} height={52} rx={26} fill="#E6B489" stroke={crease} strokeWidth={2} />
            <path d="M 72 -8 C 90 -8 100 -2 102 8" stroke={crease} strokeWidth={2} fill="none" strokeLinecap="round" />
          </g>
        </g>
      </g>

      {/* éclat de lumière quand la prise se ferme */}
      <g opacity={Math.max(0, (grip - 0.8) / 0.2) * (0.6 + 0.4 * Math.sin(t * 6))}>
        <path d="M 1046 470 L 1052 414 L 1058 470 L 1114 476 L 1058 482 L 1052 538 L 1046 482 L 990 476 Z" fill="rgba(255,240,200,0.92)" />
      </g>
    </g>
  );
};
