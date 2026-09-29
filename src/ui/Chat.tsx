import React from 'react';
import {easeOut, prog} from '../lib/anim';
import {F} from '../theme';
import {IconSpark, IconSend} from './Icons';
import {wrap} from './textLayout';

export type Msg = {from: 'client' | 'ai'; text: string; at: number; typingFrom?: number};

/**
 * Interface de conversation (smartphone ou ordinateur). Mise en page calculée : défilement fluide,
 * indicateur de saisie ("…") avant les réponses de l'agent IA.
 * t = temps en secondes, dans la même origine que `at` / `typingFrom` de chaque message.
 */
export const Chat: React.FC<{
  msgs: Msg[];
  t: number;
  w: number;
  h: number;
  fs: number;
  name?: string;
  sub?: string;
  topInset?: number; // espace réservé (îlot dynamique du téléphone)
  showInput?: boolean;
  clock?: string;
}> = ({msgs, t, w, h, fs, name = 'Agent IA', sub = 'En ligne', topInset = 0, showInput = true, clock}) => {
  const font = `500 ${fs}px Inter`;
  const lineH = fs * 1.36;
  const padX = fs * 0.95;
  const padY = fs * 0.72;
  const gap = fs * 0.7;
  const pad = fs * 0.9;
  const headerH = fs * 3.3 + topInset;
  const inputH = showInput ? fs * 3.1 : 0;
  const maxB = (w - pad * 2) * 0.78;
  const typingH = fs * 2.3;
  const view = h - headerH - inputH - pad * 2;

  let y = 0;
  const items = msgs.map((m) => {
    const {lines, width} = wrap(m.text, font, maxB - padX * 2);
    const bw = width + padX * 2;
    const bh = lines.length * lineH + padY * 2;
    const it = {m, lines, bw, bh, y};
    y += bh + gap;
    return it;
  });

  // hauteur "courante" de chaque élément (apparition douce) → décalage de défilement
  let bottom = 0;
  const geo = items.map((it) => {
    const started = t >= (it.m.typingFrom ?? it.m.at);
    const typing = it.m.typingFrom !== undefined && t >= it.m.typingFrom && t < it.m.at;
    const pIn = prog(t, it.m.at, it.m.at + 0.4, easeOut);
    const pTyp = prog(t, it.m.typingFrom ?? 1e9, (it.m.typingFrom ?? 1e9) + 0.3, easeOut);
    let curH = 0;
    if (typing) curH = typingH * pTyp;
    else if (t >= it.m.at) curH = typingH * (it.m.typingFrom !== undefined ? 1 : 0) + (it.bh - typingH * (it.m.typingFrom !== undefined ? 1 : 0)) * pIn;
    if (started) bottom = Math.max(bottom, it.y + curH);
    return {started, typing, pIn, pTyp, curH};
  });
  const offset = Math.max(0, bottom - view);

  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        background: 'linear-gradient(180deg,#0C1224 0%,#080C1A 100%)',
        fontFamily: F.sans,
        overflow: 'hidden',
      }}
    >
      {/* corps de la conversation */}
      <div style={{position: 'absolute', left: 0, right: 0, top: headerH, bottom: inputH, overflow: 'hidden'}}>
        {items.map((it, i) => {
          const g = geo[i];
          if (!g.started) return null;
          const top = pad + it.y - offset;
          const isAi = it.m.from === 'ai';
          if (g.typing) {
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top,
                  left: pad,
                  width: fs * 3.4,
                  height: typingH,
                  borderRadius: fs * 1.1,
                  background: 'linear-gradient(135deg,#F1E3B8,#D8BC7A)',
                  opacity: g.pTyp,
                  transform: `translateY(${(1 - g.pTyp) * fs * 0.5}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: fs * 0.42,
                }}
              >
                {[0, 1, 2].map((k) => (
                  <div key={k} style={{width: fs * 0.5, height: fs * 0.5, borderRadius: '50%', background: '#3A2C10', opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - k * 0.9))}} />
                ))}
              </div>
            );
          }
          const p = g.pIn;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top,
                [isAi ? 'left' : 'right']: pad,
                width: it.bw,
                height: it.bh,
                borderRadius: fs * 1.1,
                borderBottomLeftRadius: isAi ? fs * 0.3 : fs * 1.1,
                borderBottomRightRadius: isAi ? fs * 1.1 : fs * 0.3,
                background: isAi ? 'linear-gradient(135deg,#F3E6BE,#D6B970)' : 'linear-gradient(135deg,#2A417F,#1C2C58)',
                color: isAi ? '#1B1509' : '#F2F5FF',
                boxShadow: isAi ? `0 ${fs * 0.3}px ${fs * 1.2}px rgba(224,190,110,0.22)` : `0 ${fs * 0.3}px ${fs * 1.2}px rgba(20,40,110,0.35)`,
                opacity: p,
                transform: `translateY(${(1 - p) * fs * 0.7}px) scale(${0.95 + 0.05 * p})`,
                transformOrigin: isAi ? 'left bottom' : 'right bottom',
                padding: `${padY}px ${padX}px`,
                fontSize: fs,
                fontWeight: 500,
                lineHeight: `${lineH}px`,
                whiteSpace: 'nowrap',
              }}
            >
              {it.lines.map((l, k) => (
                <div key={k}>{l}</div>
              ))}
            </div>
          );
        })}
      </div>

      {/* en-tête */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: headerH,
          paddingTop: topInset,
          background: 'linear-gradient(180deg,rgba(20,30,58,0.98),rgba(14,22,44,0.94))',
          borderBottom: '1px solid rgba(233,214,168,0.16)',
          display: 'flex',
          alignItems: 'center',
          gap: fs * 0.8,
          paddingLeft: pad,
          paddingRight: pad,
          boxSizing: 'border-box',
          zIndex: 3,
        }}
      >
        <div
          style={{
            width: fs * 2.2,
            height: fs * 2.2,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#F3E6BE,#C9A55C)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#241A08',
            boxShadow: `0 0 ${fs * 1.2}px rgba(233,205,140,0.55)`,
          }}
        >
          <IconSpark size={fs * 1.1} color="#241A08" />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: fs * 0.12}}>
          <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 1.02}}>{name}</div>
          <div style={{color: 'rgba(200,214,240,0.75)', fontSize: fs * 0.74, display: 'flex', alignItems: 'center', gap: fs * 0.35}}>
            <span style={{width: fs * 0.5, height: fs * 0.5, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80'}} />
            {sub}
          </div>
        </div>
        {clock && <div style={{marginLeft: 'auto', color: 'rgba(233,214,168,0.9)', fontWeight: 600, fontSize: fs * 0.95, letterSpacing: 0.5}}>{clock}</div>}
      </div>

      {/* zone de saisie */}
      {showInput && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: inputH,
            background: 'linear-gradient(0deg,rgba(10,15,32,1),rgba(10,15,32,0.92))',
            display: 'flex',
            alignItems: 'center',
            gap: fs * 0.6,
            padding: `0 ${pad}px`,
            boxSizing: 'border-box',
            zIndex: 3,
          }}
        >
          <div style={{flex: 1, height: fs * 2.0, borderRadius: fs, background: 'rgba(255,255,255,0.07)', color: 'rgba(210,220,245,0.45)', fontSize: fs * 0.86, display: 'flex', alignItems: 'center', paddingLeft: fs}}>
            Écrire un message…
          </div>
          <div style={{width: fs * 2.0, height: fs * 2.0, borderRadius: '50%', background: 'linear-gradient(135deg,#F3E6BE,#C9A55C)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IconSend size={fs * 0.95} color="#241A08" />
          </div>
        </div>
      )}
    </div>
  );
};
