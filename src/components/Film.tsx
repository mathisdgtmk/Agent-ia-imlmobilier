import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, random} from 'remotion';

/** Grain de pellicule + vignette : donne l'aspect "image de cinéma". */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.11}) => {
  const f = useCurrentFrame();
  const step = Math.floor(f / 3); // 10 images de grain / s : aspect pellicule sans alourdir la vidéo
  const k = step % 3;
  const ox = Math.floor(random(`gx${step}`) * 512);
  const oy = Math.floor(random(`gy${step}`) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(`textures/grain${k}.png`)})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: 'overlay',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 78% 74% at 50% 50%, rgba(0,0,0,0) 45%, rgba(1,3,8,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);
