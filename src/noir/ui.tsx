import React from 'react';
import {F} from '../theme';
import {wrap, measure} from '../ui/textLayout';
import {IconCalendar, IconCheck, IconEuro, IconHome, IconKey, IconMoon, IconPin, IconSend, IconSpark, IconUser, IconPhone, IconChat, IconQuestion} from '../ui/Icons';
import {backOut, clamp01, expoOut, lerp, pr, smooth} from './motion';

/** Interfaces monochromes : toujours un « écran d'appli » noir, avec liseré blanc sur fond noir et ombre sur fond blanc. */

const shadow = (onLight: boolean | undefined, k = 1) => (onLight ? `0 ${30 * k}px ${80 * k}px rgba(0,0,0,0.38), 0 ${6 * k}px ${18 * k}px rgba(0,0,0,0.25)` : `0 ${30 * k}px ${90 * k}px rgba(255,255,255,0.06)`);

// ------------------------------------------------------------------ téléphone
export const PhoneNoir: React.FC<{w: number; onLight?: boolean; children: React.ReactNode; title?: string; time?: string}> = ({w, onLight = false, children, title = 'Agent IA', time}) => {
  const h = w * 2.04;
  const rad = w * 0.15;
  return (
    <div style={{width: w, height: h, borderRadius: rad, background: '#070707', border: `${Math.max(2, w * 0.012)}px solid ${onLight ? '#161616' : 'rgba(255,255,255,0.78)'}`, boxShadow: shadow(onLight), position: 'relative', overflow: 'hidden', fontFamily: F.sans}}>
      {/* encoche */}
      <div style={{position: 'absolute', left: '50%', top: w * 0.035, width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, borderRadius: w, background: '#000', border: '1px solid rgba(255,255,255,0.12)'}} />
      {/* en-tête */}
      <div style={{position: 'absolute', left: 0, right: 0, top: w * 0.15, height: w * 0.17, borderBottom: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', padding: `0 ${w * 0.06}px`, gap: w * 0.04}}>
        <div style={{width: w * 0.1, height: w * 0.1, borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconSpark size={w * 0.05} color="#fff" />
        </div>
        <div style={{flex: 1}}>
          <div style={{color: '#fff', fontSize: w * 0.05, fontWeight: 600, lineHeight: 1.1}}>{title}</div>
          <div style={{color: 'rgba(255,255,255,0.6)', fontSize: w * 0.034, display: 'flex', alignItems: 'center', gap: w * 0.015}}>
            <span style={{width: w * 0.02, height: w * 0.02, borderRadius: '50%', background: '#fff', display: 'inline-block'}} /> En ligne
          </div>
        </div>
        {time && <div style={{color: 'rgba(255,255,255,0.75)', fontSize: w * 0.04, fontWeight: 500}}>{time}</div>}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: w * 0.34, bottom: w * 0.2, padding: `${w * 0.03}px ${w * 0.05}px`, display: 'flex', flexDirection: 'column', gap: w * 0.035, overflow: 'hidden'}}>{children}</div>
      {/* zone de saisie */}
      <div style={{position: 'absolute', left: w * 0.05, right: w * 0.05, bottom: w * 0.05, height: w * 0.1, borderRadius: w, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${w * 0.035}px 0 ${w * 0.05}px`}}>
        <span style={{color: 'rgba(255,255,255,0.4)', fontSize: w * 0.04}}>Écrire un message…</span>
        <span style={{width: w * 0.07, height: w * 0.07, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconSend size={w * 0.04} color="#000" stroke={2} />
        </span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ bulles
export const Bubble: React.FC<{t: number; a: number; who: 'me' | 'agent'; text: string; w: number; maxW?: number; typing?: number}> = ({t, a, who, text, w, maxW, typing}) => {
  const fs = w * 0.047;
  if (typing !== undefined && t < a) {
    if (t < typing) return null;
    return (
      <div style={{alignSelf: 'flex-start', width: fs * 3.6, height: fs * 2.1, borderRadius: fs * 1.05, border: '1px solid rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: fs * 0.32, opacity: pr(t, typing, 0.2)}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: fs * 0.42, height: fs * 0.42, borderRadius: '50%', background: '#fff', opacity: 0.3 + 0.7 * Math.max(0, Math.sin((t - typing) * 10 - i * 0.9))}} />
        ))}
      </div>
    );
  }
  const font = `500 ${fs}px Inter`;
  const mw = maxW ?? w * 0.62;
  const {lines, width} = wrap(text, font, mw);
  const bw = width + fs * 1.5 + 4;
  const bh = lines.length * fs * 1.32 + fs * 1.1;
  const p = pr(t, a, 0.5, backOut);
  const me = who === 'me';
  return (
    <div
      style={{
        alignSelf: me ? 'flex-end' : 'flex-start',
        width: bw,
        height: bh,
        padding: `${fs * 0.55}px ${fs * 0.75}px`,
        boxSizing: 'border-box',
        borderRadius: fs * 1.05,
        borderBottomRightRadius: me ? fs * 0.25 : fs * 1.05,
        borderBottomLeftRadius: me ? fs * 1.05 : fs * 0.25,
        background: me ? '#fff' : '#161616',
        color: me ? '#000' : '#fff',
        border: me ? 'none' : '1px solid rgba(255,255,255,0.55)',
        fontFamily: F.sans,
        fontWeight: 500,
        fontSize: fs,
        lineHeight: 1.32,
        opacity: clamp01(p * 3),
        transform: `translateY(${(1 - p) * 26}px) scale(${lerp(0.75, 1, p)})`,
        transformOrigin: me ? '100% 100%' : '0% 100%',
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{whiteSpace: 'nowrap'}}>{l}</div>
      ))}
    </div>
  );
};

/** Indicateur de saisie (trois points) visible entre `a` et `b`. */
export const Typing: React.FC<{t: number; a: number; b: number; w: number}> = ({t, a, b, w}) => {
  const on = t >= a && t < b;
  const fs = w * 0.047;
  return (
    <div style={{alignSelf: 'flex-start', width: fs * 3.6, height: fs * 2.1, borderRadius: fs * 1.05, border: '1px solid rgba(255,255,255,0.4)', display: on ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', gap: fs * 0.32, marginBottom: -fs * 2.1 - w * 0.035}}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{width: fs * 0.42, height: fs * 0.42, borderRadius: '50%', background: '#fff', opacity: 0.35 + 0.65 * Math.max(0, Math.sin((t - a) * 9 - i * 0.9)) }} />
      ))}
    </div>
  );
};

// ------------------------------------------------------------------ pastille (chip)
export const Chip: React.FC<{t: number; a: number; text: string; fs: number; icon?: 'moon' | 'check' | 'pin'; invert?: boolean}> = ({t, a, text, fs, icon, invert}) => {
  const p = pr(t, a, 0.6, backOut);
  const col = invert ? '#000' : '#fff';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: fs * 0.55,
        padding: `${fs * 0.6}px ${fs * 1.1}px`,
        borderRadius: fs * 2,
        background: invert ? '#fff' : '#0a0a0a',
        color: col,
        border: invert ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.6)',
        fontFamily: F.sans,
        fontWeight: 500,
        fontSize: fs,
        opacity: clamp01(p * 3),
        transform: `translateY(${(1 - p) * 20}px) scale(${lerp(0.85, 1, p)})`,
        whiteSpace: 'nowrap',
      }}
    >
      {icon === 'moon' && <IconMoon size={fs * 1.1} color={col} />}
      {icon === 'check' && <IconCheck size={fs * 1.1} color={col} stroke={2.4} />}
      {icon === 'pin' && <IconPin size={fs * 1.1} color={col} />}
      {text}
    </div>
  );
};

// ------------------------------------------------------------------ carte « profil du prospect »
export type ProfileRow = {icon: 'home' | 'pin' | 'euro' | 'key'; label: string; value: string; at: number};
const ICONS = {home: IconHome, pin: IconPin, euro: IconEuro, key: IconKey};

export const ProfileCardNoir: React.FC<{t: number; w: number; rows: ProfileRow[]; onLight?: boolean; a: number}> = ({t, w, rows, onLight, a}) => {
  const fs = w * 0.044;
  const p = pr(t, a, 0.7);
  return (
    <div style={{width: w, borderRadius: w * 0.05, background: '#070707', border: `1px solid ${onLight ? '#222' : 'rgba(255,255,255,0.7)'}`, boxShadow: shadow(onLight), padding: w * 0.05, boxSizing: 'border-box', fontFamily: F.sans, color: '#fff', opacity: clamp01(p * 2.5), transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.8, marginBottom: fs * 1.1}}>
        <div style={{width: fs * 2.5, height: fs * 2.5, borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconUser size={fs * 1.3} color="#fff" />
        </div>
        <div>
          <div style={{fontSize: fs * 1.15, fontWeight: 600}}>Profil du prospect</div>
          <div style={{fontSize: fs * 0.8, color: 'rgba(255,255,255,0.55)'}}>Analyse en cours · exemple illustratif</div>
        </div>
      </div>
      {rows.map((r, i) => {
        const Ic = ICONS[r.icon];
        const k = pr(t, r.at, 0.45, backOut);
        const slide = pr(t, a + 0.25 + i * 0.12, 0.6);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: fs * 0.9, padding: `${fs * 0.75}px ${fs * 0.9}px`, marginTop: fs * 0.55, borderRadius: fs * 0.9, border: `1px solid rgba(255,255,255,${0.16 + 0.55 * (1 - Math.abs(k - 0.5) * 2 > 0 ? 0 : 0)})`, background: k > 0.02 ? `rgba(255,255,255,${0.05 + 0.1 * Math.max(0, 1 - (t - r.at) * 2.2)})` : 'transparent', opacity: clamp01(slide * 2.5), transform: `translateX(${(1 - slide) * 50}px)`}}>
            <Ic size={fs * 1.3} color="#fff" />
            <div style={{flex: 1}}>
              <div style={{fontSize: fs * 0.72, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase'}}>{r.label}</div>
              <div style={{fontSize: fs * 1.05, fontWeight: 600, opacity: lerp(0.25, 1, k)}}>{k > 0.02 ? r.value : '—'}</div>
            </div>
            <div style={{width: fs * 1.8, height: fs * 1.8, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.5)', background: `rgba(255,255,255,${k})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lerp(1, 1.12, Math.sin(Math.PI * clamp01(k)))})`}}>
              <div style={{opacity: k}}>
                <IconCheck size={fs * 1.1} color="#000" stroke={2.8} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ calendrier de la semaine
export const CalendarNoir: React.FC<{t: number; w: number; a: number; slots: {col: number; row: number; at: number}[]; pick: {col: number; row: number; at: number}; onLight?: boolean}> = ({t, w, a, slots, pick, onLight}) => {
  const fs = w * 0.036;
  const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN'];
  const hours = ['9 h', '10 h', '11 h', '14 h', '15 h', '16 h'];
  const p = pr(t, a, 0.7);
  const gx = w * 0.14;
  const cw = (w * 0.86 - w * 0.06) / 5;
  const rh = w * 0.115;
  const hdr = w * 0.2;
  const picked = pr(t, pick.at, 0.35, backOut);
  return (
    <div style={{width: w, borderRadius: w * 0.05, background: '#070707', border: `1px solid ${onLight ? '#222' : 'rgba(255,255,255,0.7)'}`, boxShadow: shadow(onLight), boxSizing: 'border-box', fontFamily: F.sans, color: '#fff', padding: w * 0.045, position: 'relative', height: hdr + rh * 6 + w * 0.115, opacity: clamp01(p * 2.5), transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.9, height: hdr * 0.55}}>
        <IconCalendar size={fs * 1.6} color="#fff" />
        <div>
          <div style={{fontSize: fs * 1.25, fontWeight: 600}}>Visites de la semaine</div>
          <div style={{fontSize: fs * 0.82, color: 'rgba(255,255,255,0.55)'}}>Créneaux disponibles</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: w * 0.045, top: hdr * 0.8, right: w * 0.045}}>
        <div style={{display: 'flex', marginLeft: gx - w * 0.045}}>
          {days.map((d) => (
            <div key={d} style={{width: cw, textAlign: 'center', fontSize: fs * 0.78, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.6)'}}>{d}</div>
          ))}
        </div>
        <div style={{position: 'relative', marginTop: fs * 0.7, height: rh * 6}}>
          {hours.map((hh, i) => (
            <div key={hh} style={{position: 'absolute', left: 0, top: i * rh, height: rh, display: 'flex', alignItems: 'center', fontSize: fs * 0.78, color: 'rgba(255,255,255,0.5)'}}>{hh}</div>
          ))}
          {hours.map((_, i) => (
            <div key={i} style={{position: 'absolute', left: gx - w * 0.045, right: 0, top: i * rh, height: 1, background: 'rgba(255,255,255,0.1)'}} />
          ))}
          {slots.map((s, i) => {
            const k = pr(t, s.at, 0.4, backOut);
            const isPick = s.col === pick.col && s.row === pick.row;
            const inv = isPick ? picked : 0;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: gx - w * 0.045 + s.col * cw + cw * 0.08,
                  top: s.row * rh + rh * 0.12,
                  width: cw * 0.84,
                  height: rh * 0.76,
                  borderRadius: fs * 0.55,
                  border: '1.5px solid #fff',
                  background: `rgba(255,255,255,${inv})`,
                  color: inv > 0.5 ? '#000' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: fs * 0.8,
                  fontWeight: 600,
                  opacity: clamp01(k * 3),
                  transform: `scale(${lerp(0.4, 1, k) * (1 + 0.08 * Math.sin(Math.PI * inv))})`,
                }}
              >
                {inv > 0.5 ? <IconCheck size={fs * 1.2} color="#000" stroke={2.8} /> : 'Libre'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ suivi des demandes
export type CrmRowN = {name: string; kind: string; status: 'Visite proposée' | 'En cours' | 'Nouveau'; time: string; at: number};
export const CrmNoir: React.FC<{t: number; w: number; rows: CrmRowN[]; a: number; onLight?: boolean}> = ({t, w, rows, a, onLight}) => {
  const fs = w * 0.04;
  const p = pr(t, a, 0.7);
  return (
    <div style={{width: w, borderRadius: w * 0.05, background: '#070707', border: `1px solid ${onLight ? '#222' : 'rgba(255,255,255,0.7)'}`, boxShadow: shadow(onLight), padding: w * 0.045, boxSizing: 'border-box', fontFamily: F.sans, color: '#fff', opacity: clamp01(p * 2.5), transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: fs * 0.9}}>
        <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.8, fontSize: fs * 1.2, fontWeight: 600}}>
          <IconChat size={fs * 1.5} color="#fff" /> Suivi des demandes
        </div>
        <div style={{fontSize: fs * 0.8, color: 'rgba(255,255,255,0.55)'}}>Aujourd'hui</div>
      </div>
      {rows.map((r, i) => {
        const k = pr(t, r.at, 0.55);
        const pill = r.status === 'Visite proposée' ? {bg: '#fff', fg: '#000', bd: '#fff'} : r.status === 'En cours' ? {bg: 'transparent', fg: '#fff', bd: 'rgba(255,255,255,0.7)'} : {bg: 'rgba(255,255,255,0.14)', fg: '#fff', bd: 'rgba(255,255,255,0.14)'};
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: fs * 0.9, padding: `${fs * 0.7}px ${fs * 0.9}px`, marginTop: fs * 0.5, borderRadius: fs * 0.9, border: '1px solid rgba(255,255,255,0.16)', opacity: clamp01(k * 2.5), transform: `translateX(${(1 - k) * 120}px)`}}>
            <div style={{width: fs * 2.1, height: fs * 2.1, borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: fs}}>{r.name[0]}</div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontSize: fs * 1.05, fontWeight: 600, whiteSpace: 'nowrap'}}>{r.name}</div>
              <div style={{fontSize: fs * 0.78, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap'}}>{r.kind}</div>
            </div>
            <div style={{padding: `${fs * 0.28}px ${fs * 0.8}px`, borderRadius: fs, background: pill.bg, color: pill.fg, border: `1px solid ${pill.bd}`, fontSize: fs * 0.78, fontWeight: 600, whiteSpace: 'nowrap', transform: `scale(${lerp(0.7, 1, pr(t, r.at + 0.25, 0.4, backOut))})`}}>{r.status}</div>
            <div style={{fontSize: fs * 0.8, color: 'rgba(255,255,255,0.55)', width: fs * 3, textAlign: 'right'}}>{r.time}</div>
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ carte de notification
export const NotifCard: React.FC<{t: number; a: number; w: number; icon: 'phone' | 'chat' | 'calendar' | 'question'; title: string; sub: string; onLight: boolean; style?: React.CSSProperties}> = ({t, a, w, icon, title, sub, onLight, style}) => {
  const fs = w * 0.045;
  const p = pr(t, a, 0.55, backOut);
  const Ic = icon === 'phone' ? IconPhone : icon === 'chat' ? IconChat : icon === 'calendar' ? IconCalendar : IconQuestion;
  return (
    <div
      style={{
        width: w,
        display: 'flex',
        alignItems: 'center',
        gap: fs * 0.95,
        padding: `${fs * 0.95}px ${fs * 1.1}px`,
        borderRadius: fs * 1.3,
        background: onLight ? '#050505' : '#fff',
        color: onLight ? '#fff' : '#000',
        boxShadow: onLight ? '0 22px 60px rgba(0,0,0,0.35)' : '0 22px 60px rgba(255,255,255,0.08)',
        fontFamily: F.sans,
        opacity: clamp01(p * 3),
        transform: `translateY(${(1 - p) * 70}px) scale(${lerp(0.85, 1, p)})`,
        ...style,
      }}
    >
      <div style={{width: fs * 2.5, height: fs * 2.5, borderRadius: '50%', border: `1.6px solid ${onLight ? '#fff' : '#000'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Ic size={fs * 1.35} color={onLight ? '#fff' : '#000'} />
      </div>
      <div style={{minWidth: 0}}>
        <div style={{fontSize: fs * 1.12, fontWeight: 700, whiteSpace: 'nowrap'}}>{title}</div>
        <div style={{fontSize: fs * 0.88, opacity: 0.62, whiteSpace: 'nowrap'}}>{sub}</div>
      </div>
    </div>
  );
};

export {expoOut, smooth, measure};
