import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../lib/layout';
import {F} from '../theme';
import {Caps, Headline, HLine, NoirMark, NoirWordmark, Ring, Specks, useT} from './kit';
import {backOutSoft, beatPulse, clamp01, expoOut, lerp, pr, smooth} from './motion';
import {bt, cue} from './timeline';
import {Bubble, PhoneNoir} from './ui';

/** LA SOLUTION — l'éclosion : onde de choc, logo tracé, téléphone et conversation, cadran 24 h. (14,4 → 21,6 s) */
export const N3Solution: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();
  const t0 = bt(24);
  const up = cue('s_up');
  const tDial = cue('s_24');
  const tHead = cue('s_24t');

  // ------------------------------------------------ logo : centre → colonne / haut
  const mv = pr(t, up, 0.9, smooth);
  const kLogo = lerp(vertical ? 0.78 : 1.12, vertical ? 0.5 : 0.62, mv) * u;
  const lx = lerp(w / 2, vertical ? w / 2 : w * 0.27, mv);
  const ly = lerp(h * (vertical ? 0.42 : 0.46), vertical ? h * 0.115 : h * 0.3, mv);
  const logoOut = pr(t, tHead - 0.45, 0.4, smooth);
  const markP = pr(t, t0 + 0.1, 1.5, smooth);

  // ------------------------------------------------ téléphone
  const pw = (vertical ? 440 : 420) * u;
  const ph = pw * 2.04;
  const pcx = vertical ? w / 2 : w * 0.7;
  const pcy = vertical ? 600 * u + ph / 2 : h * 0.52;
  const pin = pr(t, cue('s_phone'), 1.0, backOutSoft);
  const phoneY = (1 - pin) * (h * 0.7);

  // ------------------------------------------------ cadran 24 h
  const R = vertical ? 410 * u : Math.min(h * 0.47, 500 * u);
  const dialShow = pr(t, cue('s_phone') + 0.3, 0.8);
  const sweep = pr(t, tDial, bt(4), smooth); // 0 → 1 : une journée complète en 2,4 s
  const pulse = beatPulse(t);

  const headLines: HLine[] = vertical
    ? [{text: 'Votre agence,'}, {text: 'disponible'}, {text: '24 h/24.', kind: 'outline', fillAt: tHead + bt(2.2)}]
    : [{text: 'Votre agence,'}, {text: 'disponible'}, {text: '24 h/24.', kind: 'outline', fillAt: tHead + bt(2.2)}];

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Specks t={t} n={30} seed="s3" opacity={0.35} />
      {/* onde de choc d'éclosion */}
      {[0, 0.18].map((d, i) => (
        <Ring key={i} t={t} a={t0 + d} size={Math.max(w, h) * 1.7} d={1.3} width={(3 - i) * u} x={vertical ? w / 2 : w / 2} y={vertical ? h * 0.42 : h * 0.46} />
      ))}
      {/* cadran 24 h */}
      <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, opacity: dialShow}}>
        {Array.from({length: 24}, (_, i) => {
          const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
          const major = i % 6 === 0;
          const len = (major ? 34 : 18) * u;
          const lit = sweep * 24 > i;
          const x1 = pcx + Math.cos(a) * R;
          const y1 = pcy + Math.sin(a) * R;
          const x2 = pcx + Math.cos(a) * (R + len);
          const y2 = pcy + Math.sin(a) * (R + len);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={(major ? 3.2 : 2) * u} strokeLinecap="round" opacity={lit ? 1 : 0.22} />;
        })}
        <circle cx={pcx} cy={pcy} r={R - 8 * u} fill="none" stroke="#fff" strokeOpacity={0.16 + 0.1 * pulse * 0} strokeWidth={1.5 * u} />
        {sweep > 0 && sweep < 1 && (() => {
          const a = sweep * Math.PI * 2 - Math.PI / 2;
          return <line x1={pcx} y1={pcy} x2={pcx + Math.cos(a) * (R - 8 * u)} y2={pcy + Math.sin(a) * (R - 8 * u)} stroke="#fff" strokeWidth={2.2 * u} opacity={0.75} />;
        })()}
      </svg>
      {/* logo */}
      <div style={{position: 'absolute', left: lx, top: ly, transform: `translate(-50%, -50%) scale(${kLogo / u})`, opacity: 1 - logoOut, filter: logoOut > 0.05 ? `blur(${logoOut * 8}px)` : undefined}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 * u}}>
          <NoirMark size={96 * u} p={markP} />
          <NoirWordmark t={t} a={cue('s_l1')} k={u} />
        </div>
      </div>
      {/* téléphone + conversation */}
      <div style={{position: 'absolute', left: pcx - pw / 2, top: pcy - ph / 2 + phoneY, opacity: clamp01(pin * 4)}}>
        <PhoneNoir w={pw} time="23:47">
          <Bubble t={t} a={cue('s_c1')} who="me" w={pw} text="Bonjour, je recherche une villa avec piscine en Martinique." />
          <Bubble t={t} a={cue('s_c2')} typing={cue('s_c2') - 0.75} who="agent" w={pw} text="Bonjour ! Avec plaisir. Dans quel secteur recherchez-vous votre villa ?" />
          <Bubble t={t} a={cue('s_c3')} who="me" w={pw} text="Plutôt aux Trois-Îlets." />
          <Bubble t={t} a={cue('s_c4')} typing={cue('s_c4') - 0.7} who="agent" w={pw} text="Parfait. Quel budget avez-vous en tête ?" />
        </PhoneNoir>
      </div>
      {/* titre « 24 h/24 » */}
      <div style={{position: 'absolute', left: vertical ? 0 : w * 0.06, width: vertical ? w : w * 0.5, top: vertical ? h * 0.07 : h * 0.34, display: 'flex', justifyContent: vertical ? 'center' : 'flex-start'}}>
        <Headline lines={headLines} t={t} a={tHead} step={bt(0.7)} size={(vertical ? 112 : 128) * u} maxWidth={vertical ? w * 0.86 : w * 0.46} align={vertical ? 'center' : 'left'} />
      </div>
      {/* mention légale discrète */}
      <div style={{position: 'absolute', left: vertical ? 0 : w * 0.06, right: vertical ? 0 : undefined, top: h - (vertical ? 300 : 120) * u, textAlign: vertical ? 'center' : 'left', fontFamily: F.sans, fontSize: 16 * u, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', opacity: pr(t, cue('s_c1'), 0.6)}}>
        SIMULATION ILLUSTRATIVE · FONCTIONNALITÉS SELON CONFIGURATION
      </div>
    </AbsoluteFill>
  );
};
