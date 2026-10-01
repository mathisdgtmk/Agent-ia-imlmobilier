import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../lib/layout';
import {VillaLines} from './art';
import {Crosshair, Headline, HLine, Specks, useT} from './kit';
import {backOut, lerp, lin, pr, smooth} from './motion';
import {bt} from './timeline';

/** ACCROCHE — un trait, un impact, la question qui claque ; une villa se dessine derrière. (0 → 7,2 s) */
export const N1Hook: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();

  const lineP = pr(t, 0, bt(2), smooth);
  const groundY = h * (vertical ? 0.8 : 0.88);
  const slide = pr(t, bt(2), bt(1.4), smooth);
  const lineY = lerp(h * 0.5, groundY, slide);
  const lineOp = 1 - 0.55 * slide;
  const villaP = pr(t, bt(2.2), bt(6.8), smooth);
  const push = 1 + 0.12 * pr(t, 0, bt(12), lin);
  const vw = vertical ? w * 1.18 : w * 0.82;
  const vh = vw * (520 / 1600);
  const villaOut = 1 - pr(t, bt(10.4), bt(1.4), smooth) * 0.6;

  const lines: HLine[] = vertical
    ? [{text: 'Et si'}, {text: 'votre agence'}, {text: 'immobilière'}, {text: 'ne manquait plus'}, {text: 'aucune opportunité ?', kind: 'outline', fillAt: bt(7)}]
    : [{text: 'Et si votre agence immobilière'}, {text: 'ne manquait plus'}, {text: 'aucune opportunité ?', kind: 'outline', fillAt: bt(7)}];

  const m = 92 * u;
  const cp = pr(t, bt(2), 0.5, backOut);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 60%'}}>
        {/* villa dessinée au trait */}
        <div style={{position: 'absolute', left: (w - vw) / 2, top: groundY - vh * (440 / 520), opacity: villaOut * 0.42}}>
          <VillaLines p={villaP} width={vw} sw={1.7 * u} />
        </div>
        {/* trait d'horizon qui devient le sol */}
        <div style={{position: 'absolute', left: w / 2 - (w * 0.96 * lineP) / 2, top: lineY - 1, width: w * 0.96 * lineP, height: 2, background: '#fff', opacity: lineOp, boxShadow: '0 0 18px rgba(255,255,255,0.6)'}} />
        <div style={{position: 'absolute', left: w / 2 + (w * 0.48 * lineP) - 6, top: lineY - 6, width: 12, height: 12, borderRadius: '50%', background: '#fff', opacity: (1 - slide) * (lineP > 0 ? 1 : 0), boxShadow: '0 0 24px 8px rgba(255,255,255,0.7)'}} />
        <div style={{position: 'absolute', left: w / 2 - (w * 0.48 * lineP) - 6, top: lineY - 6, width: 12, height: 12, borderRadius: '50%', background: '#fff', opacity: (1 - slide) * (lineP > 0 ? 1 : 0), boxShadow: '0 0 24px 8px rgba(255,255,255,0.7)'}} />
      </AbsoluteFill>
      <Specks t={t} n={34} seed="h1" opacity={0.4} />
      {/* repères de cadre */}
      <Crosshair x={m} y={m + (vertical ? 120 * u : 30 * u)} size={22 * u} p={cp} />
      <Crosshair x={w - m} y={m + (vertical ? 120 * u : 30 * u)} size={22 * u} p={cp} />
      <Crosshair x={m} y={h - m - (vertical ? 250 * u : 30 * u)} size={22 * u} p={cp} />
      <Crosshair x={w - m} y={h - m - (vertical ? 250 * u : 30 * u)} size={22 * u} p={cp} />
      {/* question */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.17 : 0.17), display: 'flex', justifyContent: 'center'}}>
        <Headline lines={lines} t={t} a={bt(2)} step={bt(1)} size={(vertical ? 130 : 128) * u} maxWidth={w * (vertical ? 0.9 : 0.88)} out={[bt(9), 0.4]} outStep={0.14} />
      </div>
    </AbsoluteFill>
  );
};
