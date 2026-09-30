import React from 'react';
import {F, goldText} from '../theme';
import {easeOut, prog} from '../lib/anim';
import {measure} from '../ui/textLayout';

export type Word = {t: string; gold?: boolean; italic?: boolean};

/** Largeur (px) de la ligne la plus longue d'un titre, mots espacés de 0,26 em. */
const widest = (lines: Word[][], size: number, weight: number, goldWeight: number, italic: boolean, family: string) => {
  const fam = family.split(',')[0].replace(/"/g, '');
  return Math.max(
    ...lines.map((ln) => {
      const words = ln.reduce((acc, w) => {
        const st = w.italic === false ? 'normal' : italic ? 'italic' : 'normal';
        return acc + measure(w.t, `${st} ${w.gold ? goldWeight : weight} ${size}px "${fam}"`);
      }, 0);
      return words + Math.max(0, ln.length - 1) * 0.26 * size;
    }),
  );
};

/**
 * Titre « cinéma » : les mots apparaissent un à un (flou → net, léger glissement vertical).
 * `maxWidth` : la taille est réduite automatiquement pour que la ligne la plus longue reste dans la zone de sécurité.
 */
export const HeroText: React.FC<{
  lines: Word[][];
  t: number; // temps de la scène (s)
  start: number;
  out?: [number, number]; // début/fin du fondu de sortie
  size: number; // px (taille souhaitée)
  maxWidth?: number; // px — zone de sécurité
  weight?: number;
  goldWeight?: number;
  italic?: boolean;
  align?: 'center' | 'left';
  stagger?: number;
  color?: string;
  lineHeight?: number;
  family?: string;
  letterSpacing?: number;
  shadow?: boolean;
  goldStyle?: React.CSSProperties;
}> = ({
  lines,
  t,
  start,
  out,
  size,
  maxWidth,
  weight = 500,
  goldWeight = 600,
  italic = true,
  align = 'center',
  stagger = 0.11,
  color = '#F8F5EE',
  lineHeight = 1.16,
  family = F.serif,
  letterSpacing = 0,
  shadow = true,
  goldStyle = goldText,
}) => {
  let fs = size;
  if (maxWidth) {
    const wdt = widest(lines, size, weight, goldWeight, italic, family);
    if (wdt > maxWidth) fs = size * (maxWidth / wdt);
  }
  let idx = 0;
  const outP = out ? prog(t, out[0], out[1], (n) => n) : 0;
  return (
    <div
      style={{
        fontFamily: family,
        fontWeight: weight,
        fontSize: fs,
        lineHeight,
        letterSpacing,
        color,
        textAlign: align,
        opacity: 1 - outP,
        transform: `translateY(${-outP * fs * 0.25}px)`,
        filter: outP > 0 ? `blur(${outP * 6}px)` : undefined,
        textShadow: shadow ? `0 ${fs * 0.03}px ${fs * 0.3}px rgba(0,0,0,0.6), 0 0 ${fs * 0.08}px rgba(0,0,0,0.35)` : undefined,
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
                  transform: `translateY(${(1 - p) * fs * 0.32}px)`,
                  filter: [p < 1 ? `blur(${(1 - p) * 14}px)` : '', w.gold && shadow ? `drop-shadow(0 ${fs * 0.03}px ${fs * 0.12}px rgba(0,0,0,0.6))` : ''].filter(Boolean).join(' ') || undefined,
                  fontStyle: w.italic === false ? 'normal' : italic ? 'italic' : 'normal',
                  fontWeight: w.gold ? goldWeight : weight,
                  marginRight: wi < ln.length - 1 ? '0.26em' : 0,
                  ...(w.gold ? {...goldStyle, textShadow: 'none'} : {}),
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

/** Libellé sur une seule ligne (capitales espacées, etc.) qui se réduit pour tenir dans `maxWidth`. */
export const FitText: React.FC<{
  text: string;
  size: number;
  maxWidth: number;
  family?: string;
  weight?: number;
  spacingEm?: number; // espacement des lettres en em
  style?: React.CSSProperties;
}> = ({text, size, maxWidth, family = F.display, weight = 600, spacingEm = 0.2, style}) => {
  const fam = family.split(',')[0].replace(/"/g, '');
  const wdt = measure(text, `${weight} ${size}px "${fam}"`) + text.length * spacingEm * size;
  const fs = wdt > maxWidth ? size * (maxWidth / wdt) : size;
  return (
    <div style={{fontFamily: family, fontWeight: weight, fontSize: fs, letterSpacing: `${spacingEm}em`, whiteSpace: 'nowrap', ...style}}>{text}</div>
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
}> = ({text, size, spacing, p, color = '#F8F5EE', weight = 600, family = F.display, gold}) => (
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
