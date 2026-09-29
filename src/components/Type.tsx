import React from 'react';
import {F, goldText} from '../theme';
import {easeOut, prog} from '../lib/anim';

export type Word = {t: string; gold?: boolean; italic?: boolean};

/** Titre "cinéma" : les mots apparaissent un à un (flou → net, léger glissement vertical). */
export const HeroText: React.FC<{
  lines: Word[][];
  t: number; // temps de la scène (s)
  start: number;
  out?: [number, number]; // début/fin du fondu de sortie
  size: number; // px
  weight?: number;
  italic?: boolean;
  align?: 'center' | 'left';
  stagger?: number;
  color?: string;
  lineHeight?: number;
  family?: string;
  letterSpacing?: number;
  shadow?: boolean;
  goldStyle?: React.CSSProperties;
}> = ({lines, t, start, out, size, weight = 400, italic = true, align = 'center', stagger = 0.11, color = '#F8F5EE', lineHeight = 1.14, family = F.serif, letterSpacing = 0, shadow = true, goldStyle = goldText}) => {
  let idx = 0;
  const outP = out ? prog(t, out[0], out[1], (n) => n) : 0;
  return (
    <div
      style={{
        fontFamily: family,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing,
        color,
        textAlign: align,
        opacity: 1 - outP,
        transform: `translateY(${-outP * size * 0.25}px)`,
        filter: outP > 0 ? `blur(${outP * 6}px)` : undefined,
        textShadow: shadow ? `0 ${size * 0.03}px ${size * 0.35}px rgba(0,0,0,0.55)` : undefined,
      }}
    >
      {lines.map((ln, li) => (
        <div key={li} style={{whiteSpace: 'nowrap'}}>
          {ln.map((w, wi) => {
            const p = prog(t, start + idx * stagger, start + idx * stagger + 0.95, easeOut);
            idx++;
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  opacity: p,
                  transform: `translateY(${(1 - p) * size * 0.32}px)`,
                  filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
                  fontStyle: w.italic === false ? 'normal' : italic ? 'italic' : 'normal',
                  marginRight: wi < ln.length - 1 ? '0.26em' : 0,
                  ...(w.gold ? goldStyle : {}),
                }}
              >
                {w.t}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Lettres espacées (marques, libellés) avec apparition progressive de l'espacement. */
export const SpacedCaps: React.FC<{
  text: string;
  size: number;
  spacing: number; // em final
  p: number; // 0..1
  color?: string;
  weight?: number;
  family?: string;
  gold?: boolean;
}> = ({text, size, spacing, p, color = '#F8F5EE', weight = 500, family = F.display, gold}) => (
  <div
    style={{
      fontFamily: family,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: `${spacing * (0.35 + 0.65 * p)}em`,
      marginRight: `-${spacing * (0.35 + 0.65 * p)}em`,
      color,
      opacity: p,
      whiteSpace: 'nowrap',
      filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
      ...(gold ? goldText : {}),
    }}
  >
    {text}
  </div>
);
