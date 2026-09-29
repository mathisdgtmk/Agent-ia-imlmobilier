import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, cue} from '../lib/timeline';
import {clamp01} from '../lib/anim';
import {useLayout} from '../lib/layout';

/** Balayage de lumière diagonal (transition « cinéma »), centré sur l'instant `at` (s). */
const Sweep: React.FC<{at: number; dur?: number; strength?: number; angle?: number}> = ({at, dur = 0.6, strength = 0.6, angle = -18}) => {
  const f = useCurrentFrame();
  const {w, h} = useLayout();
  const t = f / FPS;
  const p = (t - (at - dur / 2)) / dur;
  if (p <= 0 || p >= 1) return null;
  const e = p * p * (3 - 2 * p);
  const wid = w * 0.34;
  const x = -wid + e * (w + wid * 2);
  const op = Math.sin(Math.PI * clamp01(p)) * strength;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: op}}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: -h * 0.2,
          width: wid,
          height: h * 1.4,
          transform: `skewX(${angle}deg)`,
          background: 'linear-gradient(90deg, rgba(255,226,160,0) 0%, rgba(255,232,180,0.85) 45%, rgba(255,246,222,1) 50%, rgba(255,232,180,0.85) 55%, rgba(255,226,160,0) 100%)',
          filter: 'blur(18px)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Transitions lumineuses entre les scènes et les séquences. */
export const Transitions: React.FC = () => (
  <>
    <Sweep at={cue('hook_out') + 0.4} dur={0.8} strength={0.75} />
    <Sweep at={cue('f2_in')} dur={0.5} strength={0.5} />
    <Sweep at={cue('f3_in')} dur={0.5} strength={0.5} />
    <Sweep at={cue('f4_in')} dur={0.55} strength={0.6} />
    <Sweep at={cue('loc_in')} dur={0.6} strength={0.55} />
    <Sweep at={cue('ben_in')} dur={0.6} strength={0.55} />
  </>
);
