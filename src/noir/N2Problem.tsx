import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../lib/layout';
import {F} from '../theme';
import {measure} from '../ui/textLayout';
import {Caps, Headline, HLine, INK, PAPER, Reveal, Ring, Specks, useT} from './kit';
import {backOut, clamp01, expoOut, lerp, pr, sharpIn, smooth} from './motion';
import {bt, cue, cueList} from './timeline';
import {NotifCard} from './ui';

const WORDS = [
  {word: 'APPELS.', icon: 'phone' as const, title: 'Appel entrant', sub: 'Sophie M. · Fort-de-France', card: 'p_w1c'},
  {word: 'MESSAGES.', icon: 'chat' as const, title: 'Nouveau message', sub: 'La villa est-elle toujours disponible ?', card: 'p_w2c'},
  {word: 'VISITES.', icon: 'calendar' as const, title: 'Demande de visite', sub: 'Karim D. · samedi matin', card: 'p_w3c'},
  {word: 'QUESTIONS.', icon: 'question' as const, title: 'Question sur un bien', sub: 'Le terrain est-il constructible ?', card: 'p_w4c'},
];

/** LE CONSTAT — la pression monte : mots qui claquent à chaque temps, compteur qui s'emballe, puis tout s'effondre. (7,2 → 14,4 s) */
export const N2Problem: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();
  const t0 = bt(12);
  const tCount = bt(16);
  const tText = bt(20);
  const tCollapse = bt(22.3);

  // ------------------------------------------------ phase A : mots (b12 → b16)
  const wi = Math.min(3, Math.floor((t - t0) / bt(1)));
  const inWords = t < tCount;
  // ------------------------------------------------ phase B : compteur (b16 → b20)
  const inCount = t >= tCount && t < tText;
  // ------------------------------------------------ phase C : texte (b20 → b23.2)
  const inText = t >= tText;

  const collapse = pr(t, tCollapse, bt(0.95), sharpIn);
  const dotOp = t >= tCollapse + bt(0.9) ? 1 - pr(t, bt(23.55), bt(0.4), smooth) : 0;

  const bg = inWords ? (wi % 2 === 0 ? PAPER : INK) : inCount ? PAPER : INK;
  const fg = bg === PAPER ? INK : '#fff';
  const onLight = bg === PAPER;

  let content: React.ReactNode = null;

  if (inWords) {
    const w0 = t0 + wi * bt(1);
    const loc = t - w0;
    const W = WORDS[wi];
    const sc = lerp(1.38, 1, pr(t, w0, 0.24, expoOut));
    const blur = (1 - pr(t, w0, 0.2, expoOut)) * 10;
    const size = (vertical ? 128 : 224) * u;
    const fit = Math.min(1, (w * (vertical ? 0.92 : 0.9)) / measure('QUESTIONS.', `700 ${size}px "Playfair Display"`));
    const fs = size * fit;
    content = (
      <>
        <Ring t={t} a={w0} size={Math.max(w, h) * 1.1} d={0.9} color={fg} width={3 * u} x={w / 2} y={h * 0.44} />
        <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.33 : 0.3), display: 'flex', flexDirection: 'column', alignItems: 'center', color: fg}}>
          <div style={{transform: `scale(${sc})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, fontFamily: F.serif, fontWeight: 700, fontSize: fs, lineHeight: 1, letterSpacing: '0.01em', whiteSpace: 'nowrap', fontFeatureSettings: '"lnum"'}}>{W.word}</div>
          <div style={{marginTop: 26 * u, height: 3 * u, width: w * (vertical ? 0.7 : 0.5) * pr(t, w0 + 0.05, 0.4), background: fg}} />
          <div style={{marginTop: 22 * u, fontFamily: F.display, fontWeight: 600, fontSize: 22 * u, letterSpacing: '0.4em', marginRight: '-0.4em', opacity: pr(t, w0 + 0.1, 0.3)}}>
            {String(wi + 1).padStart(2, '0')} / 04
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.6 : 0.69), display: 'flex', justifyContent: 'center'}}>
          <NotifCard t={t} a={cue(W.card)} w={(vertical ? 860 : 700) * u} icon={W.icon} title={W.title} sub={W.sub} onLight={onLight} />
        </div>
      </>
    );
  }

  if (inCount) {
    const ticks = cueList('p_count');
    const n = ticks.filter((x) => t >= x).length;
    const last = n > 0 ? ticks[n - 1] : tCount;
    const k = pr(t, last, 0.16, smooth);
    const R = (vertical ? 290 : 300) * u;
    const cx = w / 2;
    const cy = h * (vertical ? 0.4 : 0.47);
    const circ = 2 * Math.PI * R;
    const frozen = t >= cue('p_freeze');
    const fz = pr(t, cue('p_freeze'), 0.5, backOut);
    const numSize = (vertical ? 330 : 380) * u;
    content = (
      <>
        {ticks.map((tk, i) => {
          const a = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
          const s = pr(t, tk, 0.3, backOut);
          return <div key={i} style={{position: 'absolute', left: cx + Math.cos(a) * (R + 46 * u) - 9 * u, top: cy + Math.sin(a) * (R + 46 * u) - 9 * u, width: 18 * u, height: 18 * u, borderRadius: '50%', background: INK, transform: `scale(${s})`}} />;
        })}
        {ticks.map((tk, i) => <Ring key={'r' + i} t={t} a={tk} size={R * 2.6} d={0.7} color={INK} width={2 * u} x={cx} y={cy} />)}
        <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeOpacity={0.18} strokeWidth={3 * u} />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeWidth={(frozen ? 12 - 6 * fz : 7) * u} strokeDasharray={`${circ * (n / 12 + (n < 12 ? k / 12 : 0))} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`} />
        </svg>
        <div style={{position: 'absolute', left: cx - numSize, width: numSize * 2, top: cy - numSize * 0.56, height: numSize * 1.12, overflow: 'hidden', display: 'flex', justifyContent: 'center', fontFamily: F.serif, fontWeight: 700, fontFeatureSettings: '"lnum"', fontSize: numSize, lineHeight: 1.12, color: INK, transform: `scale(${frozen ? lerp(1.12, 1, fz) : 1})`}}>
          <div style={{position: 'absolute', top: 0, transform: `translateY(${-k * 100}%)`}}>{n - 1 > 0 ? n - 1 : ''}</div>
          <div style={{position: 'absolute', top: 0, transform: `translateY(${(1 - k) * 100}%)`}}>{n}</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: cy + R + 96 * u, display: 'flex', justifyContent: 'center', opacity: pr(t, tCount + 0.2, 0.4)}}>
          <Caps text="DEMANDES EN ATTENTE" size={(vertical ? 32 : 30) * u} maxWidth={w * 0.86} spacing={0.32} color={INK} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: cy + R + 150 * u, textAlign: 'center', fontFamily: F.sans, fontSize: 17 * u, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.5)', opacity: frozen ? 1 : 0}}>SIMULATION ILLUSTRATIVE</div>
      </>
    );
  }

  if (inText) {
    const lines: HLine[] = vertical
      ? [{text: 'Répondre'}, {text: 'à chacun peut'}, {text: 'vite devenir'}, {text: 'un défi.', kind: 'outline', fillAt: bt(22)}]
      : [{text: 'Répondre à chacun'}, {text: 'peut vite devenir'}, {text: 'un défi.', kind: 'outline', fillAt: bt(22)}];
    const shrink = pr(t, tText, bt(0.9), smooth);
    content = (
      <div style={{position: 'absolute', inset: 0, transform: `scale(${1 - collapse}) rotate(${collapse * 7}deg)`, opacity: 1 - collapse * 0.6, filter: collapse > 0.05 ? `blur(${collapse * 6}px)` : undefined}}>
        {/* le « 12 » rétrécit en haut */}
        <div style={{position: 'absolute', left: 0, right: 0, top: lerp(h * 0.4 - 190 * u, h * (vertical ? 0.17 : 0.15), shrink), textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontFeatureSettings: '"lnum"', fontSize: lerp(380, 120, shrink) * u, lineHeight: 1, color: '#fff', opacity: 1 - 0.45 * shrink}}>12</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.17 : 0.15) + 158 * u, display: 'flex', justifyContent: 'center', opacity: shrink}}>
          <Caps text="DEMANDES EN ATTENTE" size={22 * u} spacing={0.34} color="#fff" />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.36 : 0.36), display: 'flex', justifyContent: 'center'}}>
          <Headline lines={lines} t={t} a={tText + bt(0.5)} step={bt(0.8)} size={(vertical ? 120 : 132) * u} maxWidth={w * (vertical ? 0.9 : 0.84)} />
        </div>
      </div>
    );
  }

  return (
    <AbsoluteFill style={{background: bg}}>
      <Specks t={t} n={26} seed="p2" color={fg} opacity={0.22} />
      {inText ? content : <div style={{position: 'absolute', inset: 0, transform: `scale(${1 - collapse})`}}>{content}</div>}
      {dotOp > 0 && <div style={{position: 'absolute', left: w / 2 - 7 * u, top: h / 2 - 7 * u, width: 14 * u, height: 14 * u, borderRadius: '50%', background: '#fff', opacity: dotOp, boxShadow: '0 0 30px 10px rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};
