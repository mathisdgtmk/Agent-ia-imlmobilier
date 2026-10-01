import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../lib/layout';
import {measure} from '../ui/textLayout';
import {IconCalendar, IconPhone} from '../ui/Icons';
import {Caps, INK, PAPER, Ring, Specks, useT} from './kit';
import {Burst, FlapCell, Halftone, Letters, SpeedLines, bounceOut, flapSequence, hitEnvelope, rnd} from './fx';
import {backOut, clamp01, expoOut, lerp, pr, sharpIn, smooth} from './motion';
import {bt, cue, cueList} from './timeline';
import {NotifCard} from './ui';
import {NF, NF_BIG} from './type';

const big = (px: number) => `400 ${px}px "${NF_BIG}"`;
const TAU = Math.PI * 2;

type S = {t: number; w: number; h: number; vertical: boolean; u: number};

/** Coins de viseur qui se resserrent (verrouillage). */
const Brackets: React.FC<S & {a: number; color: string; inset0?: number; inset1?: number}> = ({t, w, h, u, a, color, inset0 = 0.1, inset1 = 0.055}) => {
  const k = pr(t, a, 0.5, expoOut);
  const m = lerp(inset0, inset1, k) * Math.min(w, h * 1.4);
  const L = 70 * u;
  const bw = 5 * u;
  const base: React.CSSProperties = {position: 'absolute', width: L, height: L, opacity: clamp01(k * 3)};
  const c = `${bw}px solid ${color}`;
  return (
    <>
      <div style={{...base, left: m, top: m + 40 * u, borderLeft: c, borderTop: c}} />
      <div style={{...base, right: m, top: m + 40 * u, borderRight: c, borderTop: c}} />
      <div style={{...base, left: m, bottom: m + 60 * u, borderLeft: c, borderBottom: c}} />
      <div style={{...base, right: m, bottom: m + 60 * u, borderRight: c, borderBottom: c}} />
    </>
  );
};

/** Bandeau de texte technique qui défile. */
const Ticker: React.FC<S & {y: number; text: string; dir: 1 | -1; color: string; size: number; opacity?: number}> = ({t, w, y, text, dir, color, size, opacity = 0.9}) => {
  const unit = (text + '   ').length * size * 1.18;
  const off = ((t * 220 * dir) % unit + unit) % unit;
  return (
    <div style={{position: 'absolute', left: -unit + off, top: y, whiteSpace: 'nowrap', fontFamily: NF.tech, fontSize: size, letterSpacing: '0.18em', color, opacity}}>
      {Array.from({length: Math.ceil((w * 2) / unit) + 3}, () => text + '   ').join('')}
    </div>
  );
};

// ======================================================================= 1 · APPELS — la sonnerie
const Appels: React.FC<S> = ({t, w, h, vertical, u}) => {
  const a = bt(12);
  const text = 'APPELS.';
  const size0 = (vertical ? 190 : 272) * u;
  const fit = Math.min(1, (w * (vertical ? 0.9 : 0.86)) / measure(text, big(size0)));
  const size = size0 * fit;
  const total = measure(text, big(size));
  const left = w / 2 - total / 2;
  const wordY = h * (vertical ? 0.5 : 0.6);
  const land = cueList('p1_letters');
  const dur = 0.7;
  const hy = h * (vertical ? 0.28 : 0.3);
  const hs = (vertical ? 400 : 430) * u;

  const rings = [cue('p1_ring'), cue('p1_ring2')];
  const ringTimes = rings.flatMap((b) => [0, 0.14, 0.28, 0.62, 0.76, 0.9].map((o) => b + o));
  let rot = 0;
  let hit = 0;
  for (const b of rings) {
    for (const [o0, o1] of [[0, 0.42], [0.62, 1.04]]) {
      const x = (t - b - o0) / (o1 - o0);
      if (x >= 0 && x <= 1) {
        rot = Math.sin(t * 2 * Math.PI * 15) * 11 * Math.sin(Math.PI * x);
        hit = Math.sin(Math.PI * x);
      }
    }
  }
  const enter = pr(t, a, 0.45, expoOut);
  const exit = pr(t, bt(14.72), 0.28, sharpIn);
  const shake = hitEnvelope(land, 9 * u, 9);
  const prefix = (i: number) => measure(text.slice(0, i), big(size));
  const glow = pr(t, a, 0.2) * (1 - exit);

  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Halftone color="#000" opacity={0.1} size={16 * u} />
      <Ticker t={t} w={w} h={h} u={u} vertical={vertical} y={(vertical ? 128 : 84) * u} text="APPEL ENTRANT ▸" dir={-1} color={INK} size={26 * u} opacity={0.75 * (1 - exit)} />
      <Brackets t={t} w={w} h={h} u={u} vertical={vertical} a={a} color={INK} />
      {/* ondes de sonnerie */}
      {ringTimes.map((tr, i) => (
        <Ring key={i} t={t} a={tr} size={Math.max(w, h) * 1.15} d={1.0} color={INK} width={(i % 3 === 0 ? 6 : 3.5) * u} x={w / 2} y={hy} />
      ))}
      {/* combiné qui vibre */}
      <div style={{position: 'absolute', left: w / 2 - hs / 2, top: hy - hs / 2, width: hs, height: hs, transform: `scale(${lerp(3.2, 1, enter) * (1 + 0.04 * hit) * (1 + exit * 0.6)}) rotate(${rot}deg)`, opacity: enter * (1 - exit), filter: enter < 1 ? `blur(${(1 - enter) * 16}px)` : undefined}}>
        <IconPhone size={hs} color={INK} stroke={1.35} />
      </div>
      {/* le mot tombe lettre à lettre */}
      <div style={{position: 'absolute', left: left, top: wordY - size * 0.62, fontFamily: NF.big, fontSize: size, lineHeight: 1.1, color: INK, perspective: size * 6}}>
        <Letters text={text} t={t} a={land[0] - 0.36 * dur} per={land[1] - land[0]} dur={dur} mode="drop" seed="ap" size={size} out={bt(14.75)} outPer={0.02} shake={(tt) => (tt > land[6] ? shake(tt) : 0)} />
      </div>
      {land.map((lt, i) => (
        <Burst key={i} t={t} a={lt} x={left + prefix(i) + (prefix(i + 1) - prefix(i)) / 2} y={wordY + size * 0.4} n={7} speed={420 * u} life={0.45} color={INK} seed={`ap${i}`} size={5 * u} shape="dash" spread={[Math.PI * 1.08, Math.PI * 1.92]} />
      ))}
      {/* fiche d'appel */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.66 : 0.8), display: 'flex', justifyContent: 'center', opacity: 1 - exit}}>
        <NotifCard t={t} a={cue('p1_card')} w={(vertical ? 860 : 700) * u} icon="phone" title="Appel entrant" sub="Sophie M. · Fort-de-France" onLight />
      </div>
      <AbsoluteFill style={{background: INK, opacity: 0.0 * glow}} />
    </AbsoluteFill>
  );
};

// ======================================================================= 2 · MESSAGES — tunnel de bulles
const Messages: React.FC<S> = ({t, w, h, vertical, u}) => {
  const a = bt(15);
  const text = 'MESSAGES.';
  const size0 = (vertical ? 148 : 214) * u;
  const fit = Math.min(1, (w * (vertical ? 0.88 : 0.84)) / measure(text, big(size0)));
  const size = size0 * fit;
  const total = measure(text, big(size));
  const left = w / 2 - total / 2;
  const wordY = h * (vertical ? 0.47 : 0.5);
  const typeAt = cueList('p2_type');
  const per = typeAt[1] - typeAt[0];
  const nTyped = Math.max(0, Math.min(text.length, Math.floor((t - typeAt[0]) / per) + 1));
  const caretX = left + measure(text.slice(0, nTyped), big(size));
  const caretOn = Math.floor(t * 4) % 2 === 0 || t - typeAt[0] - nTyped * per < 0.15;
  const exit = pr(t, bt(17.72), 0.28, sharpIn);

  const P = 900 * u;
  const N = 36;
  const D = 1.3;
  const heroes = cueList('p2_bub');
  const push = lerp(1, 1.1, pr(t, a, bt(3), smooth));

  const bubbles = Array.from({length: N}, (_, i) => {
    const hero = i % 4 === 0 && i / 4 < heroes.length;
    const spawn = hero ? heroes[i / 4] - D * 0.74 : a + rnd('mb', i * 7) * 1.85 - 0.25;
    const tau = (t - spawn) / D;
    if (tau < 0 || tau > 1) return null;
    const R = (360 + rnd('mb', i * 7 + 1) * 620) * u;
    const th = rnd('mb', i * 7 + 2) * TAU;
    const bw = (360 + rnd('mb', i * 7 + 3) * 360) * u;
    const bh = (118 + rnd('mb', i * 7 + 4) * 60) * u;
    const filled = rnd('mb', i * 7 + 5) > 0.42;
    const z = lerp(-2600, 650, Math.pow(tau, 1.7)) * u;
    const X = Math.cos(th) * R * (vertical ? 0.62 : 1);
    const Y = Math.sin(th) * R * (vertical ? 1.5 : 0.62);
    const op = Math.min(1, tau * 7) * (1 - clamp01((tau - 0.88) * 9));
    return (
      <div key={i} style={{position: 'absolute', left: w / 2 - bw / 2, top: h / 2 - bh / 2, width: bw, height: bh, transform: `translate3d(${X}px, ${Y}px, ${z}px) rotateZ(${(rnd('mb', i * 7 + 6) - 0.5) * 18}deg)`, opacity: op}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: bh * 0.34, borderBottomLeftRadius: i % 2 ? bh * 0.34 : bh * 0.06, borderBottomRightRadius: i % 2 ? bh * 0.06 : bh * 0.34, background: filled ? '#fff' : 'transparent', border: filled ? 'none' : `${6 * u}px solid #fff`}}>
          {filled && (
            <div style={{position: 'absolute', left: bh * 0.24, top: bh * 0.28, right: bh * 0.24}}>
              <div style={{height: bh * 0.14, width: '86%', borderRadius: bh, background: '#000'}} />
              <div style={{height: bh * 0.14, width: '58%', marginTop: bh * 0.14, borderRadius: bh, background: 'rgba(0,0,0,0.45)'}} />
            </div>
          )}
        </div>
      </div>
    );
  });

  // pastille de notifications
  const n = Math.min(9, Math.max(0, Math.floor((t - a - 0.25) / 0.2)));
  const badgePop = n > 0 ? pr(t, a + 0.25 + (n - 1) * 0.2, 0.25, backOut) : 0;
  const bs = (vertical ? 78 : 104) * u;

  return (
    <AbsoluteFill style={{background: INK}}>
      <Halftone color="#fff" opacity={0.07} size={16 * u} />
      <AbsoluteFill style={{transform: `scale(${push}) rotate(${Math.sin((t - a) * 1.4) * 0.8}deg)`}}>
        <div style={{position: 'absolute', inset: 0, perspective: P, perspectiveOrigin: '50% 50%'}}>{bubbles}</div>
        <SpeedLines t={t} power={0.35 * (1 - exit)} seed="mg" inner={0.3} />
        <div style={{position: 'absolute', inset: 0, mixBlendMode: 'difference'}}>
          <div style={{position: 'absolute', left, top: wordY - size * 0.62, fontFamily: NF.big, fontSize: size, lineHeight: 1.1, color: '#fff', whiteSpace: 'pre'}}>
            <Letters text={text} t={t} a={typeAt[0]} per={per} mode="type" size={size} out={bt(17.75)} outPer={0.015} />
          </div>
          {nTyped < text.length && caretOn && t > typeAt[0] - 0.05 && <div style={{position: 'absolute', left: caretX + size * 0.04, top: wordY - size * 0.48, width: size * 0.16, height: size * 0.92, background: '#fff', opacity: 1 - exit}} />}
        </div>
        {n > 0 && (
          <div style={{position: 'absolute', left: Math.min(left + total - bs * 0.45, w - bs - 24 * u), top: wordY - size * 0.9, width: bs, height: bs, borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NF.big, fontSize: bs * 0.52, transform: `scale(${(0.6 + 0.4 * badgePop) * (1 - exit)})`}}>
            {n >= 9 ? '9+' : n}
          </div>
        )}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.74 : 0.86), display: 'flex', justifyContent: 'center', opacity: pr(t, a + 0.2, 0.4) * (1 - exit)}}>
        <Caps text="NOUVEAUX MESSAGES · NON LUS" size={(vertical ? 26 : 24) * u} maxWidth={w * 0.86} spacing={0.28} color="#fff" />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================================= 3 · VISITES — panneau à lamelles
const Visites: React.FC<S> = ({t, w, h, vertical, u}) => {
  const a = bt(18);
  const word = 'VISITES.';
  const land = cueList('p3_flap');
  const flip = 0.1;
  const gap = (vertical ? 12 : 14) * u;
  const perRow = vertical ? 4 : 8;
  const cw = Math.min((vertical ? 232 : 196) * u, (w * 0.92 - gap * (perRow - 1)) / perRow);
  const ch = cw * (vertical ? 1.3 : 1.5);
  const bw = cw * perRow + gap * (perRow - 1);
  const bx = (w - bw) / 2;
  const rows = vertical ? 2 : 1;
  const boardH = ch * rows + gap * (rows - 1);
  const by = h * (vertical ? 0.3 : 0.34);
  const exit = pr(t, bt(20.82), 0.3, sharpIn);
  const thump = land.reduce((m, lt) => Math.max(m, Math.exp(-Math.max(0, t - lt) * 14) * (t >= lt ? 1 : 0)), 0);
  const chips = ['SAM. 10 H', 'LUN. 14 H 30', 'MER. 09 H'];
  const slotAt = cueList('p3_slots');

  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Halftone color="#000" opacity={0.09} size={16 * u} fade="bottom" />
      <Ticker t={t} w={w} h={h} u={u} vertical={vertical} y={(vertical ? 128 : 84) * u} text="DEMANDE DE VISITE ▸" dir={1} color={INK} size={26 * u} opacity={0.75 * (1 - exit)} />
      <div style={{position: 'absolute', left: bx, top: by - 84 * u, display: 'flex', alignItems: 'center', gap: 16 * u, color: INK, opacity: 1 - exit}}>
        <div style={{width: 18 * u, height: 18 * u, background: Math.floor(t * 3) % 2 ? INK : 'transparent', border: `3px solid ${INK}`}} />
        <Caps text="PROCHAINES VISITES" size={26 * u} spacing={0.24} color={INK} />
      </div>
      <div style={{position: 'absolute', left: bx, top: by, width: bw, height: boardH, display: 'flex', flexWrap: 'wrap', gap, transform: `perspective(${ch * 5}px) rotateX(${exit * -80}deg) translateY(${exit * -ch * 0.4}px) scale(${1 + thump * 0.014})`, transformOrigin: '50% 100%', opacity: 1 - exit}}>
        {Array.from(word).map((ch_, i) => {
          const n = Math.max(3, Math.round((land[i] - a) / flip));
          return <FlapCell key={i} t={t} seq={flapSequence(ch_, n, 'vf', i)} land={land[i]} flip={flip} w={cw} h={ch} fs={ch * 0.7} font={NF.big} />;
        })}
      </div>
      {land.map((lt, i) => (
        <React.Fragment key={i}>
          <Burst t={t} a={lt} x={bx + (i % perRow) * (cw + gap) + cw / 2} y={by + Math.floor(i / perRow) * (ch + gap) + ch + 6 * u} n={6} speed={380 * u} life={0.45} color={INK} seed={`vf${i}`} size={5 * u} shape="dash" spread={[Math.PI * 0.12, Math.PI * 0.88]} />
          <div style={{position: 'absolute', left: bx + (i % perRow) * (cw + gap), top: by + Math.floor(i / perRow) * (ch + gap), width: cw, height: ch, borderRadius: cw * 0.07, background: '#fff', opacity: Math.max(0, 0.55 - (t - lt) * 5) * (t >= lt ? 1 : 0), mixBlendMode: 'overlay', pointerEvents: 'none'}} />
        </React.Fragment>
      ))}
      {/* créneaux proposés */}
      <div style={{position: 'absolute', left: 0, right: 0, top: by + boardH + (vertical ? 70 : 62) * u, display: 'flex', justifyContent: 'center', gap: 18 * u, flexWrap: 'wrap', opacity: 1 - exit}}>
        {chips.map((c, i) => {
          const k = pr(t, slotAt[i], 0.45, backOut);
          return (
            <div key={c} style={{display: 'flex', alignItems: 'center', gap: 12 * u, padding: `${12 * u}px ${24 * u}px`, borderRadius: 60 * u, background: INK, color: '#fff', fontFamily: NF.tech, fontSize: (vertical ? 24 : 26) * u, letterSpacing: '0.12em', opacity: clamp01(k * 3), transform: `translateY(${(1 - k) * 40 * u}px) scale(${lerp(0.6, 1, k)})`}}>
              <IconCalendar size={30 * u} color="#fff" />
              {c}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ======================================================================= 4 · QUESTIONS — tunnel de mots
const Questions: React.FC<S> = ({t, w, h, vertical, u}) => {
  const a = bt(21);
  const lock = cue('p4_lock');
  const word = 'QUESTIONS.';
  const size0 = (vertical ? 128 : 206) * u;
  const fit = Math.min(1, (w * (vertical ? 0.9 : 0.8)) / measure(word, big(size0)));
  const size = size0 * fit;
  const P = 900 * u;
  const dz = 380 * u;
  const Dtot = 3300 * u;
  const e = pr(t, a, lock - a, (n) => 1 - Math.pow(1 - n, 3.2)); // décélération jusqu'à l'arrêt
  const after = clamp01((t - lock) / 0.6);
  const shock = Math.exp(-Math.max(0, t - lock) * 8) * (t >= lock ? 1 : 0);
  const solid = pr(t, lock - 0.12, 0.16, smooth);
  const layers = Array.from({length: 21}, (_, j) => j - 6); // k = -6 … 14
  const qs = Array.from({length: 9}, (_, i) => i);
  const qk = pr(t, lock + 0.05, 0.55, expoOut);

  return (
    <AbsoluteFill style={{background: INK}}>
      <Halftone color="#fff" opacity={0.06} size={16 * u} />
      <SpeedLines t={t} power={(1 - e) * 1.0 + 0.1} seed="qs" inner={0.12} />
      <div style={{position: 'absolute', inset: 0, perspective: P, perspectiveOrigin: '50% 50%', transform: `translate(${Math.sin(t * 190) * shock * 14 * u}px, ${Math.cos(t * 170) * shock * 10 * u}px)`}}>
        {/* points d'interrogation qui défilent autour */}
        {qs.map((i) => {
          const th = (i / qs.length) * TAU + 0.4;
          const R = (vertical ? 330 : 720) * u * (0.8 + rnd('q', i) * 0.6);
          const k0 = -dz * (i * 1.6) - 600 * u;
          const z = k0 - Dtot * (1 - e) + (i % 3) * 200 * u;
          if (z > P * 0.95) return null;
          const op = clamp01(1 + z / (2600 * u)) * 0.9;
          return (
            <div key={i} style={{position: 'absolute', left: w / 2, top: h / 2, transform: `translate3d(${Math.cos(th) * R}px, ${Math.sin(th) * R * (vertical ? 1.5 : 0.75)}px, ${z}px) rotateZ(${(i - 4) * 14 + t * 20}deg)`, fontFamily: NF.big, fontSize: 380 * u, lineHeight: 1, color: 'transparent', WebkitTextStroke: `${4 * u}px #fff`, opacity: op, marginLeft: -120 * u, marginTop: -190 * u}}>
              ?
            </div>
          );
        })}
        {/* le tunnel : la même phrase, des dizaines de fois */}
        {layers.map((k) => {
          const z = (-k * dz - Dtot * (1 - e)) * 1 + 0;
          if (z > P * 0.92 || z < -P * 6.5) return null;
          const front = k === 0;
          const op = clamp01(1 + z / (3600 * u)) * (k < 0 ? clamp01((P * 0.9 - z) / (P * 0.5)) : 1);
          const spin = (1 - e) * k * 3.2;
          return (
            <div key={k} style={{position: 'absolute', left: 0, right: 0, top: h / 2 - size * 0.62, textAlign: 'center', fontFamily: NF.big, fontSize: size, lineHeight: 1.1, whiteSpace: 'nowrap', transform: `translateZ(${z}px) rotateZ(${spin}deg)`, color: front ? `rgba(255,255,255,${solid})` : 'transparent', WebkitTextStroke: front ? `${size * 0.012}px #fff` : `${Math.max(2, size * 0.014)}px #fff`, opacity: front ? 1 : op * 0.9}}>
              {word}
            </div>
          );
        })}
      </div>
      {/* verrouillage */}
      <Ring t={t} a={lock} size={Math.max(w, h) * 1.3} d={0.9} color="#fff" width={5 * u} x={w / 2} y={h / 2} />
      <Ring t={t} a={lock + 0.1} size={Math.max(w, h) * 0.8} d={0.8} color="#fff" width={3 * u} x={w / 2} y={h / 2} />
      <Burst t={t} a={lock} x={w / 2} y={h / 2} n={44} speed={1300 * u} life={0.85} color="#fff" seed="qb" size={7 * u} shape="dash" />
      {/* point d'interrogation géant en contour derrière le mot */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.28 : 0.1), textAlign: 'center', fontFamily: NF.big, fontSize: (vertical ? 760 : 900) * u, lineHeight: 1, color: 'transparent', WebkitTextStroke: `${3 * u}px rgba(255,255,255,0.18)`, opacity: qk * after, transform: `scale(${lerp(1.5, 1, qk)}) rotate(${(1 - qk) * -12}deg)`, pointerEvents: 'none'}}>
        ?
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: Math.max(0, 0.9 - (t - lock) * 14) * (t >= lock ? 1 : 0)}} />
    </AbsoluteFill>
  );
};

// ======================================================================= compteur + pluie de notifications
const Counter: React.FC<S> = ({t, w, h, vertical, u}) => {
  const a = bt(24);
  const ticks = cueList('p_count');
  const n = ticks.filter((x) => t >= x).length;
  const last = n > 0 ? ticks[n - 1] : a;
  const k = pr(t, last, 0.16, smooth);
  const R = (vertical ? 250 : 255) * u;
  const cx = w / 2;
  const cy = h * (vertical ? 0.4 : 0.46);
  const circ = 2 * Math.PI * R;
  const freeze = cue('p_freeze');
  const frozen = t >= freeze;
  const fz = pr(t, freeze, 0.5, backOut);
  const numSize = (vertical ? 300 : 330) * u;
  const cwid = (vertical ? 250 : 270) * u;
  const chh = cwid * 0.3;
  const baseY = h - (vertical ? 420 : 175) * u;

  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Halftone color="#000" opacity={0.08} size={16 * u} fade="top" />
      <SpeedLines t={t} power={frozen ? 0 : clamp01((n - 3) / 9) * 0.5} color="#000" seed="ct" inner={0.34} />
      {ticks.map((tk, i) => {
        const ang = ((i + 1) / 12) * TAU - Math.PI / 2;
        const s = pr(t, tk, 0.3, backOut);
        return <div key={i} style={{position: 'absolute', left: cx + Math.cos(ang) * (R + 46 * u) - 9 * u, top: cy + Math.sin(ang) * (R + 46 * u) - 9 * u, width: 18 * u, height: 18 * u, borderRadius: '50%', background: INK, transform: `scale(${s})`}} />;
      })}
      {ticks.map((tk, i) => <Ring key={'r' + i} t={t} a={tk} size={R * 2.6} d={0.7} color={INK} width={2 * u} x={cx} y={cy} />)}
      <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeOpacity={0.18} strokeWidth={3 * u} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeWidth={(frozen ? 14 - 7 * fz : 8) * u} strokeDasharray={`${circ * (n / 12 + (n < 12 ? k / 12 : 0))} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      <div style={{position: 'absolute', left: cx - numSize, width: numSize * 2, top: cy - numSize * 0.56, height: numSize * 1.12, overflow: 'hidden', display: 'flex', justifyContent: 'center', fontFamily: NF.big, fontSize: numSize, lineHeight: 1.12, color: INK, transform: `scale(${frozen ? lerp(1.14, 1, fz) : 1})`}}>
        <div style={{position: 'absolute', top: 0, transform: `translateY(${-k * 100}%)`}}>{n - 1 > 0 ? n - 1 : ''}</div>
        <div style={{position: 'absolute', top: 0, transform: `translateY(${(1 - k) * 100}%)`}}>{n}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy - R - 96 * u, display: 'flex', justifyContent: 'center', opacity: pr(t, a + 0.2, 0.4)}}>
        <Caps text="DEMANDES EN ATTENTE" size={(vertical ? 30 : 28) * u} maxWidth={w * 0.86} spacing={0.26} color={INK} />
      </div>
      {frozen && <div style={{position: 'absolute', left: 0, right: 0, top: cy + R + 40 * u, textAlign: 'center', fontFamily: NF.ui, fontSize: 18 * u, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.5)'}}>SIMULATION ILLUSTRATIVE</div>}
      {/* pluie de notifications qui s'empilent en bas de l'écran */}
      {ticks.map((tk, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const fx = (vertical ? w * 0.11 : w * 0.16) + col * (vertical ? cwid * 0.88 : cwid * 1.4) + (row % 2) * 24 * u;
        const finalY = baseY - row * chh * 1.15;
        const fall = (t - tk) / 0.5;
        if (fall < 0) return null;
        const y = finalY - (1 - bounceOut(clamp01(fall))) * (finalY + 220 * u);
        return (
          <div key={'c' + i} style={{position: 'absolute', left: fx, top: y, width: cwid, height: chh, borderRadius: chh * 0.28, background: INK, boxShadow: '0 12px 30px rgba(0,0,0,0.25)', transform: `rotate(${(rnd('ch', i) - 0.5) * 7}deg) translateX(${frozen ? Math.sin(t * 160 + i) * Math.exp(-(t - freeze) * 7) * 8 * u : 0}px)`}}>
            <div style={{position: 'absolute', left: chh * 0.3, top: chh * 0.24, width: chh * 0.42, height: chh * 0.42, borderRadius: '50%', border: '2px solid #fff'}} />
            <div style={{position: 'absolute', left: chh * 0.95, top: chh * 0.26, width: cwid * 0.5, height: chh * 0.14, borderRadius: chh, background: '#fff'}} />
            <div style={{position: 'absolute', left: chh * 0.95, top: chh * 0.52, width: cwid * 0.32, height: chh * 0.12, borderRadius: chh, background: 'rgba(255,255,255,0.5)'}} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================================= texte + effondrement
const TextPhase: React.FC<S> = ({t, w, h, vertical, u}) => {
  const a = bt(28);
  const tCollapse = cue('p_collapse');
  const collapse = pr(t, tCollapse, bt(1.0), sharpIn);
  const shrink = pr(t, a, bt(0.9), smooth);
  const lines = vertical ? ['RÉPONDRE', 'À CHACUN PEUT', 'VITE DEVENIR', 'UN DÉFI.'] : ['RÉPONDRE À CHACUN', 'PEUT VITE DEVENIR', 'UN DÉFI.'];
  const size0 = (vertical ? 108 : 116) * u;
  const maxW = w * (vertical ? 0.9 : 0.86);
  const widest = Math.max(...lines.map((l) => measure(l, big(size0))));
  const size = Math.min(size0, size0 * (maxW / widest));
  const starts = [cue('p_text'), cue('p_text2'), cue('p_text3'), cue('p_text3') + 0.3];
  return (
    <AbsoluteFill style={{background: INK}}>
      <Halftone color="#fff" opacity={0.06} size={16 * u} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${1 - collapse}) rotate(${collapse * 8}deg)`, opacity: 1 - collapse * 0.6, filter: collapse > 0.05 ? `blur(${collapse * 6}px)` : undefined}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: lerp(h * 0.4 - 190 * u, h * (vertical ? 0.15 : 0.13), shrink), textAlign: 'center', fontFamily: NF.big, fontSize: lerp(330, 112, shrink) * u, lineHeight: 1, color: '#fff', opacity: 1 - 0.5 * shrink}}>12</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.15 : 0.13) + 132 * u, display: 'flex', justifyContent: 'center', opacity: shrink}}>
          <Caps text="DEMANDES EN ATTENTE" size={22 * u} spacing={0.26} color="#fff" />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.32 : 0.34), textAlign: 'center', fontFamily: NF.big, fontSize: size, lineHeight: 1.04, color: '#fff', perspective: size * 8}}>
          {lines.map((l, i) => (
            <div key={i} style={{height: size * 1.04}}>
              <Letters text={l} t={t} a={starts[i]} per={0.022} dur={0.55} mode="flip" seed={`tx${i}`} size={size} outline={i === lines.length - 1 ? {width: Math.max(2, size * 0.017), color: '#fff'} : undefined} />
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: w / 2 - 7 * u, top: h / 2 - 7 * u, width: 14 * u, height: 14 * u, borderRadius: '50%', background: '#fff', opacity: t >= tCollapse + bt(0.95) ? 1 - pr(t, bt(31.55), bt(0.4), smooth) : 0, boxShadow: '0 0 30px 10px rgba(255,255,255,0.6)'}} />
    </AbsoluteFill>
  );
};

// ======================================================================= scène
/** LE CONSTAT — quatre « choses » qui arrivent (une par 3 temps) avec une mise en scène chacune, puis le compteur et l'effondrement. */
export const N2Problem: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();
  const p = {t, w, h, vertical, u};
  const cuts = [bt(12), bt(15), bt(18), bt(21), bt(24), bt(28)];
  const idx = cuts.filter((c) => t >= c).length - 1;
  const light = [true, false, true, false, true, false][Math.max(0, idx)];
  // flash inversé de 2 images à chaque coupe : l'écran « claque »
  const sinceCut = t - cuts[Math.max(0, idx)];
  const strobe = idx >= 0 && sinceCut < 0.07 ? 0.85 * (1 - sinceCut / 0.07) : 0;
  return (
    <AbsoluteFill>
      {t < cuts[1] ? <Appels {...p} /> : t < cuts[2] ? <Messages {...p} /> : t < cuts[3] ? <Visites {...p} /> : t < cuts[4] ? <Questions {...p} /> : t < cuts[5] ? <Counter {...p} /> : <TextPhase {...p} />}
      {idx >= 1 && strobe > 0 && <AbsoluteFill style={{background: light ? INK : PAPER, opacity: strobe, pointerEvents: 'none'}} />}
    </AbsoluteFill>
  );
};
