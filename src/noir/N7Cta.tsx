import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND} from '../config/brand';
import {useLayout} from '../lib/layout';
import {F} from '../theme';
import {IconSpark} from '../ui/Icons';
import {Caps, Cursor, Headline, HLine, NoirMark, NoirWordmark, Ring, Specks, useT} from './kit';
import {backOut, backOutSoft, beatPulse, lerp, pr, smooth} from './motion';
import {bt, cue} from './timeline';

/** APPEL À L'ACTION — le logo, la question, le bouton cliqué, les coordonnées. (50,4 → 60 s) */
export const N7Cta: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();
  const t0 = bt(84);
  const pulse = beatPulse(t);

  // ------------------------------------------------ logo : centre → haut
  const mv = pr(t, bt(86.4), 0.9, smooth);
  const lk = lerp(vertical ? 0.74 : 1.05, vertical ? 0.5 : 0.52, mv);
  const lx = w / 2;
  const ly = lerp(h * (vertical ? 0.42 : 0.46), h * (vertical ? 0.125 : 0.17), mv);
  const markP = pr(t, t0 + 0.1, 1.4, smooth);

  // ------------------------------------------------ question
  const lines: HLine[] = [{text: 'Et si vous découvriez'}, {text: "ce que l'IA peut apporter"}, {text: 'à votre agence ?', kind: 'outline', fillAt: bt(91.4)}];

  // ------------------------------------------------ bouton
  const bw = (vertical ? 940 : 1080) * u;
  const bh = (vertical ? 200 : 124) * u;
  const bcy = h * (vertical ? 0.585 : 0.71);
  const bin = pr(t, cue('c_btn'), 0.9, backOutSoft);
  const tClick = cue('c_click');
  const press = Math.max(0, 1 - Math.abs(t - tClick) / 0.14);
  const flip = t >= tClick && t < tClick + 0.28;
  const cut = BRAND.ctaLabel.lastIndexOf(' ');
  const labelLines = vertical && cut > 0 ? [BRAND.ctaLabel.slice(0, cut), BRAND.ctaLabel.slice(cut + 1)] : [BRAND.ctaLabel];

  // ------------------------------------------------ curseur
  const cm = pr(t, cue('c_cur'), bt(1.3), smooth);
  const curOp = pr(t, cue('c_cur') - 0.1, 0.25);
  const tx = w / 2 + bw * 0.12;
  const ty = bcy - 4 * u;
  const cx0 = w * (vertical ? 0.92 : 0.84);
  const cy0 = h * (vertical ? 0.78 : 0.9);

  // ------------------------------------------------ cadre + sortie
  const frame = pr(t, bt(97.5), 1.0, smooth);
  const fade = 1 - pr(t, bt(99), bt(1), smooth);
  const fm = 30 * u;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Specks t={t} n={34} seed="c7" opacity={0.4} />
      <div style={{position: 'absolute', inset: 0, opacity: fade}}>
        {[0, 0.2].map((d, i) => (
          <Ring key={i} t={t} a={t0 + d} size={Math.max(w, h) * 1.8} d={1.4} width={(3 - i) * u} x={w / 2} y={h * (vertical ? 0.42 : 0.46)} />
        ))}
        {/* logo */}
        <div style={{position: 'absolute', left: lx, top: ly, transform: `translate(-50%, -50%) scale(${lk})`}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 * u}}>
            <NoirMark size={92 * u} p={markP} />
            <NoirWordmark t={t} a={cue('c_logo')} k={u} />
          </div>
        </div>
        {/* question */}
        <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.235 : 0.265), display: 'flex', justifyContent: 'center'}}>
          <Headline lines={lines} t={t} a={cue('c_l1')} step={bt(0.8)} size={(vertical ? 100 : 96) * u} maxWidth={w * (vertical ? 0.9 : 0.86)} />
        </div>
        {/* bouton */}
        <div style={{position: 'absolute', left: (w - bw) / 2, top: bcy - bh / 2, width: bw, height: bh, opacity: Math.min(1, bin * 3), transform: `translateY(${(1 - bin) * 160 * u}px) scale(${1 - 0.04 * press})`}}>
          {[0, 0.5].map((k) => {
            const ph = pr(((t * 0.8 + k) % 1) , 0, 1, (n) => n);
            return <div key={k} style={{position: 'absolute', inset: -ph * 46 * u, borderRadius: bh, border: `2px solid rgba(255,255,255,${(1 - ph) * 0.5})`, opacity: pr(t, cue('c_btn') + 0.6, 0.4)}} />;
          })}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: bh,
              background: flip ? '#000' : '#fff',
              border: flip ? `3px solid #fff` : '3px solid transparent',
              color: flip ? '#fff' : '#000',
              boxShadow: `0 ${24 * u}px ${70 * u}px rgba(255,255,255,${0.12 + 0.1 * pulse})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 26 * u,
              boxSizing: 'border-box',
            }}
          >
            <IconSpark size={(vertical ? 52 : 42) * u} color={flip ? '#fff' : '#000'} />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 * u}}>
              {labelLines.map((ln) => (
                <Caps key={ln} text={ln} size={(vertical ? 58 : 42) * u} maxWidth={bw - (vertical ? 280 : 260) * u} family={F.display} weight={700} spacing={0.1} />
              ))}
            </div>
          </div>
        </div>
        {/* signature + coordonnées provisoires */}
        <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.69 : 0.845), display: 'flex', justifyContent: 'center', opacity: pr(t, cue('c_tag'), 0.5), transform: `translateY(${(1 - pr(t, cue('c_tag'), 0.5)) * 14}px)`}}>
          <Caps text={BRAND.tagline.toUpperCase()} size={(vertical ? 34 : 30) * u} maxWidth={w * 0.9} spacing={0.2} weight={600} color="#fff" />
        </div>
        {BRAND.contact.show && (
          <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.73 : 0.9), textAlign: 'center', fontFamily: F.sans, fontWeight: 400, fontSize: (vertical ? 32 : 28) * u, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.78)', opacity: pr(t, cue('c_contact'), 0.5)}}>
            {BRAND.contact.website}
            <span style={{margin: `0 ${18 * u}px`}}>·</span>
            {BRAND.contact.phone}
          </div>
        )}
        {/* clic */}
        <div style={{opacity: curOp}}>
          <Cursor x={lerp(cx0, tx, cm)} y={lerp(cy0, ty, cm)} scale={u} press={press} color="#000" edge="#fff" />
        </div>
        <Ring t={t} a={tClick} size={bw * 0.9} d={0.9} color="#fff" width={3 * u} x={tx} y={ty} />
        <Ring t={t} a={tClick + 0.12} size={bw * 0.55} d={0.8} color="#fff" width={2 * u} x={tx} y={ty} />
        {/* cadre fin qui se dessine */}
        <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={fm} y={fm} width={w - 2 * fm} height={h - 2 * fm} fill="none" stroke="#fff" strokeWidth={1.6 * u} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - frame} opacity={0.7} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
