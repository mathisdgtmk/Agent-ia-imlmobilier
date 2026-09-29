// Identité visuelle : noir profond, blanc élégant, doré champagne, touches de bleu nuit.
export const C = {
  black: '#04060B',
  ink: '#090D18',
  night: '#0B1733',
  navy: '#12295C',
  blue: '#3D7BFF',
  blueSoft: '#7FA8FF',
  gold: '#DCC182',
  goldLight: '#F6E9C4',
  goldDeep: '#AD8B47',
  goldGlow: 'rgba(233, 205, 140, 0.55)',
  white: '#F8F5EE',
  whiteDim: 'rgba(248,245,238,0.72)',
  glass: 'rgba(14, 22, 44, 0.62)',
  glassLine: 'rgba(233, 214, 168, 0.28)',
} as const;

export const F = {
  serif: '"Cormorant Garamond", "Times New Roman", serif',
  sans: 'Inter, "Helvetica Neue", Arial, sans-serif',
  display: 'Montserrat, Inter, Arial, sans-serif',
} as const;

export const goldGradient =
  'linear-gradient(120deg, #F8EBC8 0%, #E5CB8F 30%, #C4A05A 62%, #F2DFB0 100%)';

export const goldText: React.CSSProperties = {
  backgroundImage: goldGradient,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
};

export const goldDeepText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(120deg, #5A4016 0%, #7D5E22 45%, #94702A 70%, #5A4016 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
};

import type React from 'react';
