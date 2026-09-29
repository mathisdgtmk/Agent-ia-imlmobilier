import React from 'react';
import {MAP_H, MAP_W, MARTINIQUE_PATH, PLACES} from '../data/martinique';
import {F} from '../theme';

export type PlaceKey = keyof typeof PLACES;

/** Carte de la Martinique (contour Natural Earth) avec repères animés. `w` = largeur en px. */
export const MartiniqueMap: React.FC<{w: number; t: number; active: PlaceKey | null; reveal?: number; visited?: PlaceKey[]}> = ({w, t, active, reveal = 1, visited = []}) => {
  const k = w / MAP_W;
  const keys = Object.keys(PLACES) as PlaceKey[];
  return (
    <div
      style={{
        width: w,
        height: MAP_H * k,
        position: 'relative',
        borderRadius: 26 * k,
        background: 'linear-gradient(160deg, rgba(20,32,66,0.82), rgba(8,12,28,0.78))',
        border: '1px solid rgba(233,214,168,0.3)',
        boxShadow: `0 ${30 * k}px ${80 * k}px rgba(0,0,0,0.55), 0 0 ${60 * k}px rgba(233,205,140,0.10)`,
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
      }}
    >
      <svg width={w} height={MAP_H * k} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="mq-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(60,90,170,0.55)" />
            <stop offset="1" stopColor="rgba(20,32,70,0.35)" />
          </linearGradient>
          <radialGradient id="mq-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(255,226,160,0.95)" />
            <stop offset="1" stopColor="rgba(255,226,160,0)" />
          </radialGradient>
        </defs>
        {/* grille discrète */}
        {Array.from({length: 9}, (_, i) => (
          <line key={'h' + i} x1={0} y1={i * 75} x2={MAP_W} y2={i * 75} stroke="rgba(233,214,168,0.06)" strokeWidth={1} />
        ))}
        {Array.from({length: 7}, (_, i) => (
          <line key={'v' + i} x1={i * 70} y1={0} x2={i * 70} y2={MAP_H} stroke="rgba(233,214,168,0.06)" strokeWidth={1} />
        ))}
        <path d={MARTINIQUE_PATH} fill="url(#mq-fill)" opacity={reveal} />
        <path d={MARTINIQUE_PATH} fill="none" stroke="#E9D09A" strokeWidth={2.2} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} style={{filter: 'drop-shadow(0 0 6px rgba(233,205,140,0.7))'}} />
        {keys.map((key) => {
          const p = PLACES[key];
          const on = key === active;
          const seen = visited.includes(key);
          const pulse = (t * 1.1) % 1;
          return (
            <g key={key} opacity={reveal}>
              {on && <circle cx={p.x} cy={p.y} r={18 + pulse * 30} fill="none" stroke={`rgba(255,226,160,${(1 - pulse) * 0.8})`} strokeWidth={2} />}
              {on && <circle cx={p.x} cy={p.y} r={28} fill="url(#mq-glow)" opacity={0.7} />}
              <circle cx={p.x} cy={p.y} r={on ? 7 : 4.4} fill={on ? '#FFF1CC' : seen ? '#E9D09A' : 'rgba(233,208,154,0.55)'} stroke={on ? '#E9D09A' : 'none'} strokeWidth={2} />
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 22 * k,
          textAlign: 'center',
          fontFamily: F.display,
          fontWeight: 600,
          fontSize: 22 * k,
          letterSpacing: '0.42em',
          marginRight: '-0.42em',
          color: '#E9D09A',
          opacity: reveal,
        }}
      >
        MARTINIQUE
      </div>
    </div>
  );
};
