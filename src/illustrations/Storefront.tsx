import React from 'react';
import {Palm, rr} from './kit';
import {SkyContent, FarLandContent, SeaContent} from './Seascape';
import {Person, LOOKS} from './People';
import {LogoMark} from '../components/Logo';
import {F} from '../theme';

/**
 * Façade d'une agence immobilière contemporaine au crépuscule (monde 1920 × 1080) :
 * enseigne lumineuse, vitrine avec fiches de biens, intérieur chaleureux, parvis en pierre.
 */
export const StorefrontSvg: React.FC<{t: number; id?: string; walk?: number}> = ({t, id = 'sf', walk = 0}) => {
  const g = (n: string) => `url(#${id}-${n})`;
  const winX = 280;
  const winY = 520;
  const winW = 1130;
  const winH = 360;
  const posters = [0, 1, 2, 3];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#151C2F" />
          <stop offset="1" stopColor="#0B101E" />
        </linearGradient>
        <linearGradient id={`${id}-in`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE3A8" />
          <stop offset="0.6" stopColor="#FFC875" />
          <stop offset="1" stopColor="#E99447" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2338" />
          <stop offset="1" stopColor="#070A14" />
        </linearGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3A281A" />
          <stop offset="1" stopColor="#2A1D13" />
        </linearGradient>
        <filter id={`${id}-bloom`} x="-20%" y="-30%" width="140%" height="170%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
        <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ciel + mer au loin */}
      <rect x={-1300} y={-1300} width={4600} height={2600} fill="#03060F" />
      <svg x={-500} y={-40} width={2920} height={900} viewBox="0 0 2920 900">
        <SkyContent w={2920} h={900} horizon={640} sunX={2100} t={t} id={`${id}sk`} clouds={9} />
        <FarLandContent w={2920} h={900} horizon={640} id={`${id}far`} islandSide="both" volcanoX={0.14} />
        <SeaContent w={2920} h={900} horizon={640} sunX={2100} t={t} id={`${id}sea`} shimmer={0.6} />
      </svg>

      {/* bâtiment */}
      <rect x={130} y={230} width={1440} height={700} fill={g('wall')} />
      <rect x={130} y={230} width={1440} height={4} fill="rgba(240,214,160,0.7)" />
      {/* lames de bois latérales */}
      <rect x={1410} y={234} width={160} height={700} fill={g('wood')} />
      {Array.from({length: 20}, (_, i) => (
        <rect key={i} x={1412 + i * 8} y={234} width={3.4} height={700} fill="rgba(255,190,110,0.26)" />
      ))}
      {/* enseigne */}
      <g>
        <rect x={280} y={300} width={1130} height={150} rx={6} fill="#0A0F1C" stroke="rgba(233,214,168,0.35)" strokeWidth={2} />
        <rect x={286} y={306} width={1118} height={138} rx={4} fill="rgba(233,205,140,0.06)" />
      </g>
      {/* vitrine (halo + verre) */}
      <g filter={g('bloom')} opacity={0.9}>
        <rect x={winX} y={winY} width={winW} height={winH} fill="#FFB85E" />
      </g>
      <rect x={winX - 8} y={winY - 8} width={winW + 16} height={winH + 16} fill="#080B14" />
      <rect x={winX} y={winY} width={winW} height={winH} fill={g('in')} />
      {/* intérieur : suspensions, bureaux, plantes */}
      {[420, 700, 980, 1240].map((x, i) => (
        <g key={i}>
          <rect x={x - 1} y={winY} width={2} height={50 + (i % 2) * 14} fill="rgba(60,30,10,0.5)" />
          <ellipse cx={x} cy={winY + 56 + (i % 2) * 14} rx={22} ry={8} fill="#FFF6DC" />
          <circle cx={x} cy={winY + 64 + (i % 2) * 14} r={34} fill="rgba(255,240,200,0.5)" filter={g('soft')} />
        </g>
      ))}
      <g fill="rgba(74,38,16,0.55)">
        <rect x={340} y={winY + 250} width={220} height={16} />
        <rect x={350} y={winY + 266} width={8} height={94} />
        <rect x={542} y={winY + 266} width={8} height={94} />
        <rect x={720} y={winY + 250} width={220} height={16} />
        <rect x={730} y={winY + 266} width={8} height={94} />
        <rect x={922} y={winY + 266} width={8} height={94} />
        <ellipse cx={1290} cy={winY + 290} rx={30} ry={64} fill="rgba(20,50,30,0.7)" />
      </g>
      {/* fiches de biens sur la vitre */}
      {posters.map((i) => {
        const x = winX + 40 + i * 258;
        return (
          <g key={i} transform={`translate(${x} ${winY + 40})`}>
            <rect width={220} height={170} rx={6} fill="rgba(8,12,26,0.78)" stroke="rgba(233,214,168,0.5)" strokeWidth={1.5} />
            <rect x={8} y={8} width={204} height={102} rx={3} fill="#233A6E" />
            <rect x={8} y={62} width={204} height={48} fill="#0F2A4A" />
            <rect x={8} y={60} width={204} height={2} fill="#E2C98E" />
            <g transform={`translate(${74 + (i % 2) * 20} ${72}) scale(0.34)`}>
              <rect x={0} y={0} width={220} height={70} fill="#F1E4C0" />
              <rect x={20} y={14} width={150} height={38} fill="#FFC875" />
              <rect x={-10} y={-6} width={240} height={10} fill="#FBF4E2" />
            </g>
            <rect x={14} y={122} width={110} height={8} rx={4} fill="rgba(233,214,168,0.85)" />
            <rect x={14} y={140} width={72} height={7} rx={3.5} fill="rgba(200,214,240,0.5)" />
          </g>
        );
      })}
      {/* montants de vitrine */}
      {[winX + winW * 0.25, winX + winW * 0.5, winX + winW * 0.75].map((x, i) => (
        <rect key={i} x={x - 3} y={winY} width={6} height={winH} fill="#080B14" />
      ))}
      <polygon points={`${winX + 40},${winY} ${winX + 300},${winY} ${winX + 120},${winY + winH} ${winX - 100},${winY + winH}`} fill="rgba(255,255,255,0.07)" />

      {/* porte vitrée */}
      <rect x={1440} y={winY - 8} width={120} height={winH + 8 + 60} fill="#080B14" />
      <rect x={1448} y={winY} width={104} height={winH + 60} fill={g('in')} opacity={0.95} />
      <rect x={1494} y={winY + 20} width={4} height={winH + 40} fill="#080B14" />
      <rect x={1476} y={winY + 200} width={4} height={90} rx={2} fill="#E9D09A" />

      {/* parvis en pierre + reflets */}
      <rect x={-1300} y={900} width={4600} height={1200} fill={g('floor')} />
      <rect x={-1300} y={898} width={4600} height={4} fill="rgba(240,214,160,0.45)" />
      <g filter={g('soft')} opacity={0.7}>
        <polygon points={`${winX},900 ${winX + winW},900 ${winX + winW + 60},1080 ${winX - 60},1080`} fill="rgba(255,190,110,0.32)" />
      </g>
      {Array.from({length: 26}, (_, i) => {
        const x = rr(`${id}rf${i}`, winX, winX + winW);
        const y = 905 + rr(`${id}ry${i}`, 0, 1) ** 1.4 * 170;
        return <rect key={i} x={x} y={y} width={rr(`${id}rw${i}`, 20, 110)} height={2} fill="rgba(255,226,170,0.55)" opacity={0.12 + 0.2 * (0.5 + 0.5 * Math.sin(t * 1.4 + i))} />;
      })}

      {/* palmiers en bacs */}
      <g>
        <rect x={40} y={860} width={80} height={60} rx={6} fill="#0A0F1C" />
        <Palm x={80} y={866} h={520} lean={0.08} seed={`${id}pa`} t={t} color="#040A12" rim="rgba(255,215,150,0.5)" fronds={10} frondScale={0.55} />
        <rect x={1610} y={860} width={80} height={60} rx={6} fill="#0A0F1C" />
        <Palm x={1650} y={866} h={470} lean={-0.08} seed={`${id}pb`} t={t + 1} color="#040A12" rim="rgba(255,215,150,0.5)" fronds={10} frondScale={0.55} />
      </g>

      {/* passants qui se dirigent vers l'agence */}
      <g transform={`translate(${960 + 520 * walk} 1010) scale(0.9)`} opacity={walk > 0 ? 1 : 0}>
        <g transform="translate(-60 -252)"><Person look={LOOKS.clientM} id={`${id}w1`} flip pose={{l: [-10 + Math.sin(t * 6) * 12, 4], r: [10 - Math.sin(t * 6) * 12, 4]}} rim="rgba(255,214,150,0.5)" /></g>
        <g transform="translate(20 -252)"><Person look={LOOKS.clientF} id={`${id}w2`} flip pose={{l: [-10 - Math.sin(t * 6) * 12, 4], r: [10 + Math.sin(t * 6) * 12, 4]}} rim="rgba(255,214,150,0.5)" /></g>
      </g>
    </g>
  );
};

export const SIGN = {x: 280, y: 300, w: 1130, h: 150};

/** Contenu de l'enseigne (HTML aligné sur le monde 1920×1080). */
export const StorefrontSign: React.FC<{p: number; brandName: string}> = ({p, brandName}) => (
  <div
    style={{
      position: 'absolute',
      left: SIGN.x,
      top: SIGN.y,
      width: SIGN.w,
      height: SIGN.h,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 34,
      opacity: p,
    }}
  >
    <LogoMark size={92} p={1} />
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 52, letterSpacing: '0.3em', color: '#F8F5EE', textShadow: '0 0 24px rgba(255,226,160,0.7)'}}>{brandName}</div>
      <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 32, letterSpacing: '0.12em', color: '#E9D09A'}}>Agence immobilière · Martinique</div>
    </div>
  </div>
);
