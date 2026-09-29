import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, captions} from '../lib/timeline';
import {useLayout} from '../lib/layout';
import {F} from '../theme';
import {clamp01} from '../lib/anim';

/** Sous-titres français synchronisés sur la voix off (timings calculés par audio/build_voice.py). */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, u, w} = useLayout();
  const t = frame / FPS;
  const c = captions.find((x) => t >= x.start - 0.04 && t < x.end + 0.12);
  if (!c) return null;
  const fin = clamp01((t - (c.start - 0.04)) / 0.16);
  const fout = clamp01((c.end + 0.12 - t) / 0.12);
  const o = Math.min(fin, fout);
  const size = (vertical ? 50 : 42) * u;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: vertical ? 620 * u : 300 * u,
          background: 'linear-gradient(to top, rgba(2,4,9,0.62) 0%, rgba(2,4,9,0.28) 45%, rgba(2,4,9,0) 100%)',
          opacity: o,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: (vertical ? 300 : 78) * u,
          width: vertical ? w * 0.88 : w * 0.72,
          transform: `translateX(-50%) translateY(${(1 - fin) * 10 * u}px)`,
          textAlign: 'center',
          fontFamily: F.sans,
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.28,
          letterSpacing: 0.2 * u,
          color: '#fff',
          opacity: o,
          textShadow: `0 ${2 * u}px ${18 * u}px rgba(0,0,0,0.75), 0 0 ${3 * u}px rgba(0,0,0,0.6)`,
          textWrap: 'balance' as any,
        }}
      >
        {c.text}
      </div>
    </AbsoluteFill>
  );
};
