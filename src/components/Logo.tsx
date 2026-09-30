import React from 'react';
import {Img, staticFile} from 'remotion';
import {BRAND} from '../config/brand';
import {F, goldText} from '../theme';

/** Monogramme provisoire : toit de maison + étincelle « IA ». Remplaçable via BRAND.logoImage. */
export const LogoMark: React.FC<{size: number; p?: number; glow?: boolean}> = ({size, p = 1, glow = true}) => {
  if (BRAND.logoImage) {
    return <Img src={staticFile(BRAND.logoImage)} style={{width: size, height: size, objectFit: 'contain', opacity: p}} />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{display: 'block', overflow: 'visible', opacity: p, filter: glow ? 'drop-shadow(0 0 10px rgba(233,205,140,0.55))' : undefined}}>
      <defs>
        <linearGradient id="lm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8EBC8" />
          <stop offset="0.5" stopColor="#D9BC78" />
          <stop offset="1" stopColor="#AD8B47" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29.5" fill="rgba(8,12,26,0.55)" stroke="url(#lm-gold)" strokeWidth="1.6" strokeDasharray={`${185 * p} 185`} strokeLinecap="round" transform="rotate(-90 32 32)" />
      <path d="M15 35 L32 19 L49 35" fill="none" stroke="url(#lm-gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 29.500c.7 4.600 2.400 7 7.500 7.500-5.100.5-6.800 2.900-7.500 7.500-.7-4.600-2.400-7-7.500-7.500 5.100-.5 6.800-2.900 7.500-7.500z" fill="url(#lm-gold)" />
    </svg>
  );
};

/** Logo typographique : monogramme + nom de la solution (deux lignes). */
export const Logo: React.FC<{k?: number; p?: number; align?: 'center' | 'left'; withMark?: boolean; markSize?: number}> = ({k = 1, p = 1, align = 'center', withMark = true, markSize = 92}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 26 * k}}>
    {withMark && <LogoMark size={markSize * k} p={Math.min(1, p * 1.4)} />}
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 14 * k}}>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 700,
          fontSize: 66 * k,
          letterSpacing: `${0.3 * (0.4 + 0.6 * p)}em`,
          marginRight: `-${0.3 * (0.4 + 0.6 * p)}em`,
          color: '#F8F5EE',
          whiteSpace: 'nowrap',
          opacity: p,
          filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
        }}
      >
        {BRAND.productName[0]}
      </div>
      <div
        style={{
          fontFamily: F.serif,
          fontWeight: 600,
          fontSize: 112 * k,
          lineHeight: 1,
          letterSpacing: `${0.14 * (0.4 + 0.6 * p)}em`,
          marginRight: `-${0.14 * (0.4 + 0.6 * p)}em`,
          whiteSpace: 'nowrap',
          opacity: p,
          filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
          ...goldText,
        }}
      >
        {BRAND.productName[1]}
      </div>
    </div>
  </div>
);
