import React from 'react';

/**
 * Personnages vectoriels stylisés (sans visage, silhouettes élégantes) — repère : hauteur ≈ 250 unités, axe x = 0.
 * Les bras sont articulés (épaule + coude) pour varier les poses.
 */
export type Look = {
  skin: string;
  skinShade: string;
  hair: string;
  hairStyle: 'short' | 'side' | 'long' | 'bun';
  suit: string; // veste
  suitShade: string;
  shirt: string;
  tie?: string | null;
  pocket?: string | null;
  trouser: string;
  shoe: string;
  dress?: boolean; // silhouette féminine
};

export const LOOKS = {
  agent: {
    skin: '#C89468', skinShade: '#9C6A45', hair: '#15110F', hairStyle: 'side', suit: '#16264C', suitShade: '#0B1530', shirt: '#F2EFE8', tie: '#C9A55C', pocket: '#F2E2B4',
    trouser: '#101B38', shoe: '#0A0C12',
  } as Look,
  agentDay: {
    skin: '#C89468', skinShade: '#9C6A45', hair: '#15110F', hairStyle: 'side', suit: '#22386B', suitShade: '#142450', shirt: '#F7F4EC', tie: '#C9A55C', pocket: '#F2E2B4',
    trouser: '#1A2C58', shoe: '#0A0C12',
  } as Look,
  clientM: {
    skin: '#E2B48C', skinShade: '#B98560', hair: '#4A3A2C', hairStyle: 'short', suit: '#9A8F80', suitShade: '#6E655A', shirt: '#EFEAE0', tie: null, pocket: null,
    trouser: '#3B3F4A', shoe: '#1A1410',
  } as Look,
  clientF: {
    skin: '#B47A55', skinShade: '#86553A', hair: '#1B120E', hairStyle: 'long', suit: '#E3D6BC', suitShade: '#B9A886', shirt: '#F3EEE3', tie: null, pocket: null,
    trouser: '#D9C9A6', shoe: '#2A1E14', dress: true,
  } as Look,
  agentF: {
    skin: '#E6BC9A', skinShade: '#BC8D6C', hair: '#3A2418', hairStyle: 'bun', suit: '#1A2B55', suitShade: '#0D1733', shirt: '#F5F1E8', tie: null, pocket: null,
    trouser: '#111C3A', shoe: '#0A0C12', dress: true,
  } as Look,
};

const Arm: React.FC<{sx: number; sy: number; a: number; b: number; look: Look; side: 1 | -1; hand?: boolean; U?: number; Fh?: number; id: string; w?: number}> = ({
  sx,
  sy,
  a,
  b,
  look,
  side,
  hand = true,
  U = 46,
  Fh = 40,
  id,
  w = 1,
}) => (
  <g transform={`translate(${sx} ${sy}) rotate(${a})`}>
    <path d={`M ${-6.5 * w} 0 C ${-7 * w} 12 ${-6.4 * w} ${U - 8} ${-5.4 * w} ${U} L ${5.4 * w} ${U} C ${6.4 * w} ${U - 8} ${7 * w} 12 ${6.5 * w} 0 Z`} fill={`url(#${id}-suitX)`} />
    <g transform={`translate(0 ${U}) rotate(${b})`}>
      <path d={`M ${-5.4 * w} -1 L ${5.4 * w} -1 C ${5.2 * w} ${Fh * 0.6} ${4.6 * w} ${Fh * 0.9} ${4.4 * w} ${Fh} L ${-4.4 * w} ${Fh} C ${-4.6 * w} ${Fh * 0.9} ${-5.2 * w} ${Fh * 0.6} ${-5.4 * w} -1 Z`} fill={`url(#${id}-suitX)`} />
      <rect x={-4.6 * w} y={Fh - 3.5} width={9.2 * w} height={3.6} fill={look.shirt} />
      {hand && (
        <g transform={`translate(0 ${Fh})`}>
          <path d={`M ${-4 * w} 0 C ${-5.4 * w} 7 ${-5 * w} 13 ${-2 * w} 15 C 1 16.5 ${4.6 * w} 12 ${4.8 * w} 6 C ${5 * w} 3 ${4 * w} 0 ${4 * w} 0 Z`} fill={look.skin} />
          <path d={`M ${side * 3.5 * w} 4 C ${side * 8 * w} 6 ${side * 9 * w} 11 ${side * 6 * w} 14`} stroke={look.skin} strokeWidth={3.2 * w} strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  </g>
);

/** Vue de face (léger trois-quarts). `pose` règle bras gauche/droit [épaule°, coude°] (0 = le long du corps). */
export const Person: React.FC<{
  look: Look;
  id: string;
  pose?: {l?: [number, number]; r?: [number, number]};
  flip?: boolean;
  bust?: boolean; // ne dessine que le haut du corps (assis derrière un bureau)
  rim?: string;
  tilt?: number; // inclinaison de la tête (°)
  lean?: number; // inclinaison du buste (°)
}> = ({look, id, pose = {}, flip, bust, rim = 'rgba(255,214,150,0.55)', tilt = 0, lean = 0}) => {
  const {l = [4, 4], r = [-4, -4]} = pose;
  const fem = !!look.dress;
  const sw = fem ? 0.82 : 1; // largeur d'épaules
  const hairBack =
    look.hairStyle === 'long' ? (
      <path d="M -13.5 12 C -17 26 -16 46 -14 60 C -8 64 8 64 14 60 C 16 46 17 26 13.5 12 Z" fill={look.hair} />
    ) : look.hairStyle === 'bun' ? (
      <circle cx={0} cy={-1} r={7.5} fill={look.hair} />
    ) : null;
  return (
    <g transform={flip ? 'scale(-1 1)' : undefined} style={{filter: `drop-shadow(1.2px -1px 0.8px ${rim})`}}>
      <defs>
        <linearGradient id={`${id}-suitX`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={look.suit} />
          <stop offset="1" stopColor={look.suitShade} />
        </linearGradient>
        <linearGradient id={`${id}-suitY`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.suit} />
          <stop offset="1" stopColor={look.suitShade} />
        </linearGradient>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={look.skin} />
          <stop offset="1" stopColor={look.skinShade} />
        </linearGradient>
        <linearGradient id={`${id}-trs`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={look.trouser} />
          <stop offset="1" stopColor={look.suitShade} />
        </linearGradient>
      </defs>
      {/* jambes */}
      {!bust && (
        <g>
          {fem ? (
            <>
              <path d="M -22 122 L 22 122 L 24 182 L -24 182 Z" fill={`url(#${id}-trs)`} />
              <path d="M -15 182 L -4 182 L -6 238 L -15 238 Z" fill={`url(#${id}-skin)`} />
              <path d="M 4 182 L 15 182 L 15 238 L 6 238 Z" fill={`url(#${id}-skin)`} />
              <path d="M -17 237 L -4 237 L -3 247 L -19 247 Z" fill={look.shoe} />
              <path d="M 4 237 L 17 237 L 19 247 L 3 247 Z" fill={look.shoe} />
            </>
          ) : (
            <>
              <path d="M -27 116 L -1 116 L -3 150 L -6 238 L -22 238 L -24 150 Z" fill={`url(#${id}-trs)`} />
              <path d="M 1 116 L 27 116 L 24 150 L 22 238 L 6 238 L 3 150 Z" fill={`url(#${id}-trs)`} />
              <path d="M -25 242 L -5 242 L -3 249 Q -3 252 -8 252 L -27 252 Q -31 249 -25 242 Z" fill={look.shoe} />
              <path d="M 5 242 L 25 242 L 27 249 Q 27 252 22 252 L 4 252 Q 1 250 5 242 Z" fill={look.shoe} />
            </>
          )}
        </g>
      )}
      <g transform={`rotate(${lean} 0 120)`}>
        {/* bras arrière (côté gauche) */}
        <Arm sx={-29 * sw} sy={49} a={l[0]} b={l[1]} look={look} side={-1} id={id} w={fem ? 0.86 : 1} />
        {/* torse */}
        {fem ? (
          <>
            <path d="M -25 52 C -25 44 -20 41 -14 39 L -6 37 L 0 45 L 6 37 L 14 39 C 20 41 25 44 25 52 L 21 96 C 22 108 26 118 27 126 L -27 126 C -26 118 -22 108 -21 96 Z" fill={`url(#${id}-suitY)`} />
            <path d="M -6 37 L 0 62 L 6 37 L 0 45 Z" fill={look.shirt} />
            <path d="M -21 96 C -12 99 12 99 21 96" stroke="rgba(0,0,0,0.22)" strokeWidth={1.4} fill="none" />
            <path d="M -27 126 L 27 126 L 30 186 L -30 186 Z" fill={look.trouser} />
            <path d="M -27 126 L 27 126 L 27 132 L -27 132 Z" fill="rgba(0,0,0,0.18)" />
          </>
        ) : (
          <>
            <path d="M -31 52 C -31 44 -26 41 -18 39 L -7 37 L 0 46 L 7 37 L 18 39 C 26 41 31 44 31 52 L 27 96 C 26 108 26 116 27 122 C 20 126 -20 126 -27 122 C -26 116 -26 108 -27 96 Z" fill={`url(#${id}-suitY)`} />
            <path d="M -7 37 L 0 78 L 7 37 L 0 46 Z" fill={look.shirt} />
            {look.tie && <path d="M -2.3 47 L 2.3 47 L 3.6 84 L 0 91 L -3.6 84 Z" fill={look.tie} />}
            <path d="M -7 37 L -15 48 L -11 80 L 0 78 Z" fill="rgba(255,255,255,0.05)" />
            <path d="M 7 37 L 15 48 L 11 80 L 0 78 Z" fill="rgba(0,0,0,0.16)" />
            <path d="M -7 37 L -14.5 47.5 L -10.5 79" stroke="rgba(0,0,0,0.35)" strokeWidth={1.2} fill="none" />
            <path d="M 7 37 L 14.5 47.5 L 10.5 79" stroke="rgba(0,0,0,0.35)" strokeWidth={1.2} fill="none" />
            {look.pocket && <path d="M -22 62 L -14 61 L -14.5 66 L -21.5 66.5 Z" fill={look.pocket} />}
            <circle cx={0} cy={100} r={1.6} fill="rgba(0,0,0,0.4)" />
            <circle cx={0} cy={112} r={1.6} fill="rgba(0,0,0,0.4)" />
          </>
        )}
        {/* cou + tête */}
        <g transform={`rotate(${tilt} 0 34)`}>
          {hairBack}
          <path d="M -5.2 26 L 5.2 26 L 6 42 L -6 42 Z" fill={`url(#${id}-skin)`} />
          <path d="M -6 40 Q 0 46 6 40 L 6 42 L -6 42 Z" fill="rgba(0,0,0,0.18)" />
          <ellipse cx={0} cy={17} rx={11} ry={13.6} fill={`url(#${id}-skin)`} />
          <ellipse cx={-11} cy={18} rx={2.1} ry={3.4} fill={look.skinShade} opacity={0.7} />
          <ellipse cx={11} cy={18} rx={2.1} ry={3.4} fill={look.skinShade} opacity={0.7} />
          {look.hairStyle === 'short' && <path d="M -11.6 15 C -13 0 13 0 11.6 15 C 8 8 -6 7.5 -11.6 15 Z" fill={look.hair} />}
          {look.hairStyle === 'side' && <path d="M -11.8 15 C -14 -1 12 -3 11.8 14 C 10 8 3 5 -2 5 C -6 6 -10 9 -11.8 15 Z" fill={look.hair} />}
          {look.hairStyle === 'long' && <path d="M -12 17 C -14 -1 14 -2 12 17 C 10 9 3 5 -2 4 C -7 7 -10 11 -12 17 Z" fill={look.hair} />}
          {look.hairStyle === 'bun' && <path d="M -11.6 15 C -13 0 13 0 11.6 15 C 8 7 -6 7 -11.6 15 Z" fill={look.hair} />}
          {/* léger reflet sur la joue/nez : donne du volume sans dessiner de visage */}
          <ellipse cx={4} cy={19} rx={3.4} ry={7} fill="rgba(255,255,255,0.05)" />
        </g>
        {/* bras avant (côté droit) */}
        <Arm sx={29 * sw} sy={49} a={r[0]} b={r[1]} look={look} side={1} id={id} w={fem ? 0.86 : 1} />
      </g>
    </g>
  );
};

/** Personne vue de dos (plan "par-dessus l'épaule"), fauteuil compris. */
export const PersonBack: React.FC<{look: Look; id: string; rim?: string; chair?: string}> = ({look, id, rim = 'rgba(255,214,150,0.45)', chair = '#0D1220'}) => (
  <g style={{filter: `drop-shadow(1.6px -1.4px 0 ${rim})`}}>
    <defs>
      <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={look.suit} />
        <stop offset="1" stopColor={look.suitShade} />
      </linearGradient>
    </defs>
    {/* dossier du fauteuil */}
    <path d="M -46 40 C -50 30 -40 14 0 14 C 40 14 50 30 46 40 L 44 190 L -44 190 Z" fill={chair} />
    <path d="M -46 40 C -50 30 -40 14 0 14 C 40 14 50 30 46 40" stroke="rgba(255,214,150,0.35)" strokeWidth={1.6} fill="none" />
    {/* épaules et dos */}
    <path d="M -34 64 C -34 50 -26 44 -16 42 L 16 42 C 26 44 34 50 34 64 L 30 190 L -30 190 Z" fill={`url(#${id}-b)`} />
    <rect x={-5} y={30} width={10} height={16} fill={look.skin} />
    <ellipse cx={0} cy={22} rx={12.5} ry={15} fill={look.hair} />
    {look.hairStyle === 'long' && <path d="M -13 20 C -16 44 -14 58 -10 62 L 10 62 C 14 58 16 44 13 20 Z" fill={look.hair} />}
    <ellipse cx={-12.6} cy={24} rx={2.2} ry={3.4} fill={look.skin} />
    <ellipse cx={12.6} cy={24} rx={2.2} ry={3.4} fill={look.skin} />
  </g>
);
