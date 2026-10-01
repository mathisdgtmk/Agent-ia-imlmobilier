import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../lib/layout';
import {NF} from './type';
import {IconSpark} from '../ui/Icons';
import {Caps, Headline, INK, PAPER, Reveal, Ring, Specks, useT} from './kit';
import {backOutSoft, beatPulse, lerp, pr, sharpIn, smooth} from './motion';
import {bt, cue} from './timeline';

const FLIPS = [88, 89, 89.5, 90, 90.25, 90.5, 90.75, 91.0, 91.15, 91.3].map(bt);

/** LE BÉNÉFICE — l'IA et l'humain : deux cercles se rejoignent. Fin de scène en stroboscope. (43,2 → 50,4 s) */
export const N6Benefit: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();
  const t0 = bt(80);
  const tMerge = cue('b_merge');
  const Rc = (vertical ? 232 : 262) * u;
  const d = Rc * 0.56;
  const cx = vertical ? w / 2 : w * 0.72;
  const cy = vertical ? h * 0.635 : h * 0.5;
  const mv = pr(t, cue('b_c'), bt(3.4), backOutSoft);
  const xl = lerp(-Rc * 1.4, cx - d, mv);
  const xr = lerp(w + Rc * 1.4, cx + d, mv);
  const merged = pr(t, tMerge, 0.5, smooth);
  const pulse = beatPulse(t) * pr(t, tMerge, 0.3);

  const flips = FLIPS.filter((f) => t >= f).length;
  const invert = flips % 2 === 1;
  const blackout = t >= bt(91.4);
  const zoom = 1 + 0.22 * pr(t, bt(88), bt(3.4), sharpIn);

  const size = (vertical ? 108 : 122) * u;
  const colX = vertical ? 0 : w * 0.06;
  const colW = vertical ? w : w * 0.5;
  const top1 = h * (vertical ? 0.085 : 0.16);
  const lineH = size * 1.08;
  const top2 = top1 + lineH * 2 + 20 * u;

  return (
    <AbsoluteFill style={{background: PAPER, filter: invert ? 'invert(1)' : undefined}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${cx}px ${cy}px`}}>
        <Specks t={t} n={26} seed="b6" color={INK} opacity={0.22} />
        {/* cercles : l'humain, l'IA, et ce qu'ils font ensemble */}
        <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <clipPath id="nb-lens">
              <circle cx={xl} cy={cy} r={Rc} />
            </clipPath>
          </defs>
          <circle cx={xr} cy={cy} r={Rc} fill={INK} clipPath="url(#nb-lens)" opacity={merged} />
          <circle cx={xl} cy={cy} r={Rc} fill="none" stroke={INK} strokeWidth={3.4 * u} />
          <circle cx={xr} cy={cy} r={Rc} fill="none" stroke={INK} strokeWidth={3.4 * u} />
          {/* petits repères sur les cercles */}
          {[0, 1].map((i) => {
            const a = t * (i ? -0.9 : 0.9);
            const x0 = i ? xr : xl;
            return <circle key={i} cx={x0 + Math.cos(a) * Rc} cy={cy + Math.sin(a) * Rc} r={7 * u} fill={INK} />;
          })}
        </svg>
        <div style={{position: 'absolute', left: xl - Rc * 0.92, top: cy - 18 * u, width: Rc * 0.9, textAlign: 'center', opacity: 1 - merged * 0.0}}>
          <Caps text="L'HUMAIN" size={26 * u} spacing={0.24} color={INK} style={{justifyContent: 'center'}} />
        </div>
        <div style={{position: 'absolute', left: xr + Rc * 0.02, top: cy - 18 * u, width: Rc * 0.9, textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
          <Caps text="L'IA" size={26 * u} spacing={0.24} color={INK} />
        </div>
        <div style={{position: 'absolute', left: cx - 40 * u, top: cy - 40 * u, width: 80 * u, height: 80 * u, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: merged, transform: `scale(${(0.6 + 0.4 * merged) * (1 + 0.1 * pulse)})`}}>
          <IconSpark size={74 * u} color="#fff" />
        </div>
        <Ring t={t} a={tMerge} size={Rc * 4.2} d={1.1} color={INK} width={3 * u} x={cx} y={cy} />
        <Ring t={t} a={tMerge + 0.15} size={Rc * 3} d={1.0} color={INK} width={2 * u} x={cx} y={cy} />
        {/* titre en deux temps */}
        <div style={{position: 'absolute', left: colX, width: colW, top: top1, display: 'flex', justifyContent: vertical ? 'center' : 'flex-start'}}>
          <Headline fx="drop" lines={[{text: "L'intelligence"}, {text: 'artificielle'}]} t={t} a={cue('b_t1')} step={bt(0.5)} size={size} maxWidth={w} align={vertical ? 'center' : 'left'} color={INK} />
        </div>
        <div style={{position: 'absolute', left: colX, width: colW, top: top2, display: 'flex', justifyContent: vertical ? 'center' : 'flex-start'}}>
          <Headline fx="drop" lines={[{text: 'au service'}, {text: "de l'humain.", kind: 'outline', fillAt: bt(85.5)}]} t={t} a={cue('b_t2')} step={bt(0.5)} size={size} maxWidth={w} align={vertical ? 'center' : 'left'} color={INK} />
        </div>
        {/* précisions */}
        <div style={{position: 'absolute', left: colX, width: colW, top: top2 + lineH * 2 + (vertical ? 40 : 44) * u, textAlign: vertical ? 'center' : 'left', color: INK}}>
          <Reveal t={t} a={cue('b_t3')} d={0.7}>
            <div style={{fontFamily: NF.big, fontWeight: 400, fontSize: (vertical ? 42 : 40) * u}}>Elle ne remplace pas votre expertise.</div>
          </Reveal>
          <div style={{marginTop: 10 * u}}>
            <Reveal t={t} a={cue('b_t4')} d={0.7}>
              <div style={{fontFamily: NF.ui, fontWeight: 500, fontSize: (vertical ? 27 : 26) * u, opacity: 0.7}}>Elle vous aide à mieux accompagner vos clients.</div>
            </Reveal>
          </div>
        </div>
      </AbsoluteFill>
      {blackout && <AbsoluteFill style={{background: '#000'}} />}
    </AbsoluteFill>
  );
};
