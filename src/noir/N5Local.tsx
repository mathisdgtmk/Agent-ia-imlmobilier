import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MAP_H, MAP_W} from '../data/martinique';
import {useLayout} from '../lib/layout';
import {NF} from './type';
import {MapNoir, PlaceKey} from './art';
import {Caps, Headline, HLine, Specks, useT} from './kit';
import {lerp, lin, pr, smooth} from './motion';
import {bt, cue} from './timeline';

const PINS: {key: PlaceKey; cue: string; name: string}[] = [
  {key: 'fortDeFrance', cue: 'l_p1', name: 'FORT-DE-FRANCE'},
  {key: 'troisIlets', cue: 'l_p2', name: 'LES TROIS-ÎLETS'},
  {key: 'lamentin', cue: 'l_p3', name: 'LE LAMENTIN'},
  {key: 'littoral', cue: 'l_p4', name: 'LE LITTORAL'},
];

/** ANCRAGE LOCAL — la Martinique se dessine, quatre repères sonnent comme des sonars. (36 → 43,2 s) */
export const N5Local: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();
  const t0 = bt(68);
  const k = (vertical ? 1.34 : 1.38) * u;
  const mw = MAP_W * k;
  const mh = MAP_H * k;
  const mcx = vertical ? w / 2 : w * 0.72;
  const mcy = vertical ? h * 0.5 : h * 0.5;
  const push = lerp(1, 1.06, pr(t, t0, bt(12), lin));
  const inn = pr(t, t0, 0.6);

  const lines: HLine[] = [{text: vertical ? 'Pensé pour les agences' : 'Pensé pour les'}, {text: vertical ? 'immobilières' : 'agences immobilières'}, {text: 'en Martinique.', kind: 'outline', fillAt: bt(74)}];
  const marquee = 'FORT-DE-FRANCE  ·  LES TROIS-ÎLETS  ·  LE LAMENTIN  ·  LE LITTORAL  ·  ';
  const ms = (vertical ? 250 : 300) * u;
  const mx = -((t - t0) * 140 * u) % (ms * 14.5);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Specks t={t} n={28} seed="l5" opacity={0.3} />
      {/* bandeau défilant en contour (derrière tout) */}
      <div style={{position: 'absolute', left: mx, top: h * 0.5 - ms * 0.6, whiteSpace: 'nowrap', fontFamily: NF.tech, fontWeight: 400, fontSize: ms, lineHeight: 1.2, color: 'transparent', WebkitTextStroke: `${1.4 * u}px rgba(255,255,255,0.12)`, opacity: inn}}>
        {marquee + marquee + marquee}
      </div>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: `${mcx}px ${mcy}px`}}>
        {/* anneaux cartographiques */}
        <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, opacity: inn * 0.5}}>
          <circle cx={mcx} cy={mcy} r={mh * 0.56} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={1.3 * u} strokeDasharray={`${4 * u} ${14 * u}`} transform={`rotate(${(t - t0) * 6} ${mcx} ${mcy})`} />
          <circle cx={mcx} cy={mcy} r={mh * 0.64} fill="none" stroke="#fff" strokeOpacity={0.2} strokeWidth={1.3 * u} strokeDasharray={`${40 * u} ${22 * u}`} transform={`rotate(${-(t - t0) * 4} ${mcx} ${mcy})`} />
        </svg>
        <div style={{position: 'absolute', left: mcx - mw / 2, top: mcy - mh / 2}}>
          <MapNoir k={k} t={t} a={t0 + 0.2} pins={PINS.map((p, i) => ({key: p.key, at: cue(p.cue), n: i + 1}))} stroke={2.6 * u} />
        </div>
        {/* flèche du nord + coordonnées */}
        <div style={{position: 'absolute', left: mcx + mw / 2 - 20 * u, top: mcy - mh / 2 + 10 * u, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 * u, opacity: pr(t, t0 + 1.2, 0.6), color: '#fff', fontFamily: NF.tech, fontWeight: 400, fontSize: 22 * u}}>
          N<div style={{width: 2 * u, height: 54 * u, background: '#fff'}} />
        </div>
        <div style={{position: 'absolute', left: mcx - mw / 2 - 6 * u, top: mcy + mh / 2 + 14 * u, fontFamily: NF.ui, fontSize: 17 * u, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.7)', opacity: pr(t, t0 + 1.6, 0.6)}}>14°36′N · 61°04′O · MARTINIQUE</div>
      </AbsoluteFill>
      {/* titre */}
      <div style={{position: 'absolute', left: vertical ? 0 : w * 0.06, width: vertical ? w : w * 0.46, top: h * (vertical ? 0.1 : 0.2), display: 'flex', justifyContent: vertical ? 'center' : 'flex-start'}}>
        <Headline fx="zoom" lines={lines} t={t} a={cue('l_t1')} step={bt(0.6)} size={(vertical ? 104 : 118) * u} maxWidth={vertical ? w * 0.9 : w * 0.46} align={vertical ? 'center' : 'left'} />
      </div>
      {/* légende des repères */}
      <div style={{position: 'absolute', left: vertical ? w * 0.08 : w * 0.06, top: vertical ? h * 0.74 : h * 0.62, width: vertical ? w * 0.84 : w * 0.4, display: vertical ? 'grid' : 'block', gridTemplateColumns: '1fr 1fr', rowGap: 18 * u, columnGap: 16 * u}}>
        {PINS.map((p, i) => {
          const a = cue(p.cue);
          const e = pr(t, a, 0.5);
          return (
            <div key={p.key} style={{display: 'flex', alignItems: 'center', gap: 16 * u, marginBottom: vertical ? 0 : 20 * u, opacity: e, transform: `translateX(${(1 - e) * -40 * u}px)`}}>
              <div style={{width: 46 * u, height: 46 * u, borderRadius: '50%', border: `1.5px solid #fff`, background: e > 0.5 && t - a < 0.25 ? '#fff' : 'transparent', color: e > 0.5 && t - a < 0.25 ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NF.tech, fontWeight: 400, fontSize: 19 * u, flexShrink: 0}}>{String(i + 1).padStart(2, '0')}</div>
              <Caps text={p.name} size={(vertical ? 23 : 27) * u} maxWidth={vertical ? w * 0.34 : w * 0.3} spacing={0.2} color="#fff" />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
