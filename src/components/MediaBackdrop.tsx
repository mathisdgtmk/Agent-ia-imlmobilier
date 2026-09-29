import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {MEDIA, MediaId} from '../config/media';

/**
 * Affiche un média réel (photo/vidéo) configuré dans src/config/media.ts à la place de l'illustration.
 * Ne rend rien si l'emplacement est `null` (cas par défaut).
 * `p` = progression 0..1 du plan (zoom lent).
 */
export const MediaBackdrop: React.FC<{slot: MediaId; p?: number}> = ({slot, p = 0}) => {
  const m = MEDIA[slot];
  if (!m) return null;
  const zoom = 1 + ((m.zoom ?? 1.1) - 1) * p;
  const [fx, fy] = m.focus ?? [0.5, 0.5];
  const style: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: `${fx * 100}% ${fy * 100}%`,
    transform: `scale(${zoom})`,
    transformOrigin: `${fx * 100}% ${fy * 100}%`,
  };
  const grade = m.grade ?? 0.55;
  return (
    <AbsoluteFill style={{background: '#03060F'}}>
      {m.kind === 'video' ? <OffthreadVideo src={staticFile(m.src)} muted style={style} /> : <Img src={staticFile(m.src)} style={style} />}
      {/* étalonnage de marque : ombres bleu nuit, hautes lumières champagne, vignettage */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,16,44,0.55), rgba(4,8,22,0.25) 55%, rgba(4,8,22,0.5))', mixBlendMode: 'multiply', opacity: grade}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(255,214,150,0.28), rgba(255,214,150,0) 70%)', mixBlendMode: 'soft-light', opacity: grade + 0.2}} />
    </AbsoluteFill>
  );
};
