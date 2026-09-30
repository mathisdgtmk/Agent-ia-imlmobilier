import React from 'react';
import {easeOut, easeInOut, prog, clamp01} from '../lib/anim';
import {F, C} from '../theme';
import {IconCheck, IconChat, IconPhone, IconCalendar, IconHome, IconSpark, IconUser, IconClock, IconBell, IconUsers} from './Icons';

const glassBg = 'linear-gradient(135deg, rgba(26,38,74,0.96), rgba(11,17,36,0.95))';
const line = 'rgba(233,214,168,0.26)';

/* ------------------------------------------------------------------ notification (verre dépoli) */
export type NotifKind = 'msg' | 'visit' | 'question' | 'call';
const NOTIF = {
  msg: {icon: IconChat, grad: 'linear-gradient(135deg,#5B8CFF,#2A56D6)'},
  visit: {icon: IconCalendar, grad: 'linear-gradient(135deg,#F3E6BE,#C9A55C)'},
  question: {icon: IconHome, grad: 'linear-gradient(135deg,#7FA8FF,#3A66D8)'},
  call: {icon: IconPhone, grad: 'linear-gradient(135deg,#5EE0A0,#1FA36A)'},
};

export const NotificationCard: React.FC<{
  kind: NotifKind;
  title: string;
  body: string;
  time?: string;
  w: number;
  fs: number;
  p: number; // apparition 0..1
  glow?: number; // pulsation 0..1
}> = ({kind, title, body, time = 'à l’instant', w, fs, p, glow = 0}) => {
  const {icon: Icon, grad} = NOTIF[kind];
  return (
    <div
      style={{
        width: w,
        borderRadius: fs * 1.15,
        background: 'linear-gradient(135deg,#1C2A4B,#0E1630)',
        border: `1px solid ${line}`,
        boxShadow: `0 ${fs * 0.9}px ${fs * 2.6}px rgba(0,0,0,0.5), 0 0 ${fs * 2.2 * (0.4 + glow)}px rgba(233,205,140,${0.10 + 0.22 * glow})`,
        padding: `${fs * 0.9}px ${fs * 1.05}px`,
        display: 'flex',
        alignItems: 'center',
        gap: fs * 0.95,
        fontFamily: F.sans,
        opacity: p,
        boxSizing: 'border-box',
      }}
    >
      <div style={{width: fs * 2.7, height: fs * 2.7, borderRadius: fs * 0.8, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kind === 'visit' ? '#241A08' : '#fff', flexShrink: 0}}>
        <Icon size={fs * 1.45} />
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 1.08, lineHeight: 1.25}}>{title}</div>
        <div style={{color: 'rgba(210,222,248,0.78)', fontWeight: 400, fontSize: fs * 0.9, lineHeight: 1.3, marginTop: fs * 0.12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{body}</div>
      </div>
      <div style={{color: 'rgba(233,214,168,0.85)', fontSize: fs * 0.72, fontWeight: 500, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: fs * 0.35}}>
        <span style={{width: fs * 0.5, height: fs * 0.5, borderRadius: '50%', background: '#F3E6BE', boxShadow: '0 0 10px rgba(243,230,190,0.9)'}} />
        {time}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ boîte de réception (écran d'ordinateur) */
export type InboxItem = {kind: NotifKind; name: string; snippet: string; time: string; at: number};
export const InboxScreen: React.FC<{items: InboxItem[]; t: number; w: number; h: number; fs: number}> = ({items, t, w, h, fs}) => {
  const rowH = fs * 3.6;
  const pad = fs * 0.8;
  const shown = items.filter((i) => t >= i.at);
  return (
    <div style={{position: 'relative', width: w, height: h, background: 'linear-gradient(180deg,#0D1428,#070B18)', fontFamily: F.sans, overflow: 'hidden', display: 'flex'}}>
      <div style={{width: fs * 3.4, background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: fs * 1.3, paddingTop: fs * 1.2}}>
        <div style={{width: fs * 1.9, height: fs * 1.9, borderRadius: fs * 0.55, background: 'linear-gradient(135deg,#F3E6BE,#C9A55C)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconHome size={fs * 1.1} color="#241A08" />
        </div>
        {[IconChat, IconCalendar, IconUsers].map((I, i) => (
          <div key={i} style={{color: 'rgba(190,205,240,0.55)'}}>
            <I size={fs * 1.25} />
          </div>
        ))}
      </div>
      <div style={{flex: 1, padding: pad, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: fs * 0.7}}>
          <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 1.15}}>Demandes entrantes</div>
          <div style={{background: 'rgba(233,205,140,0.16)', border: `1px solid ${line}`, color: '#F3E6BE', fontSize: fs * 0.8, fontWeight: 600, padding: `${fs * 0.15}px ${fs * 0.7}px`, borderRadius: fs}}>
            {shown.length} nouvelle{shown.length > 1 ? 's' : ''}
          </div>
        </div>
        <div style={{position: 'relative'}}>
          {shown
            .slice()
            .reverse()
            .map((it, i) => {
              const p = prog(t, it.at, it.at + 0.5, easeOut);
              const Ic = NOTIF[it.kind].icon;
              return (
                <div
                  key={it.at}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: i * (rowH + fs * 0.35),
                    height: rowH,
                    borderRadius: fs * 0.7,
                    background: 'rgba(255,255,255,0.045)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: fs * 0.8,
                    paddingLeft: fs * 0.8,
                    paddingRight: fs * 0.8,
                    opacity: p,
                    transform: `translateY(${(1 - p) * -fs * 1.2}px)`,
                  }}
                >
                  <div style={{width: fs * 2.2, height: fs * 2.2, borderRadius: '50%', background: NOTIF[it.kind].grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: it.kind === 'visit' ? '#241A08' : '#fff'}}>
                    <Ic size={fs * 1.15} />
                  </div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 0.95}}>{it.name}</div>
                    <div style={{color: 'rgba(200,214,240,0.7)', fontSize: fs * 0.78, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{it.snippet}</div>
                  </div>
                  <div style={{color: 'rgba(233,214,168,0.85)', fontSize: fs * 0.7}}>{it.time}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ fiche prospect (critères recueillis) */
export type ProfileRow = {icon: React.ReactNode; label: string; value?: string; at: number; pendingFrom?: number; bar?: boolean};

export const ProfileCard: React.FC<{
  rows: ProfileRow[];
  t: number;
  w: number;
  fs: number;
  title?: string;
  chip?: string;
  chipDone?: string;
  doneAt?: number;
  bare?: boolean;
}> = ({rows, t, w, fs, title = 'Nouveau prospect', chip = 'Qualification en cours', chipDone = 'Profil enrichi', doneAt = 1e9, bare}) => {
  const done = t >= doneAt;
  return (
    <div
      style={{
        width: w,
        borderRadius: fs * 1.3,
        background: bare ? 'transparent' : glassBg,
        border: bare ? 'none' : `1px solid ${line}`,
        boxShadow: bare ? 'none' : `0 ${fs}px ${fs * 3}px rgba(0,0,0,0.5)`,
        backdropFilter: bare ? undefined : 'blur(14px)',
        padding: bare ? 0 : fs * 1.2,
        boxSizing: 'border-box',
        fontFamily: F.sans,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.8, marginBottom: fs * 1.0}}>
        <div style={{width: fs * 2.4, height: fs * 2.4, borderRadius: '50%', background: 'linear-gradient(135deg,#3B5BB8,#1B2A58)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8EEFF'}}>
          <IconUser size={fs * 1.3} />
        </div>
        <div style={{flex: 1}}>
          <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 1.05}}>{title}</div>
          <div style={{color: done ? '#F3E6BE' : 'rgba(150,185,255,0.95)', fontSize: fs * 0.72, fontWeight: 500, display: 'flex', alignItems: 'center', gap: fs * 0.35}}>
            {done ? <IconCheck size={fs * 0.85} color="#F3E6BE" /> : <IconSpark size={fs * 0.8} color="#7FA8FF" />}
            {done ? chipDone : chip}
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: fs * 0.62}}>
        {rows.map((r, i) => {
          const p = prog(t, r.at, r.at + 0.55, easeOut);
          const sweep = prog(t, r.at, r.at + 0.9, easeInOut);
          const filled = t >= r.at;
          return (
            <div key={i} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: fs * 0.85, padding: `${fs * 0.7}px ${fs * 0.85}px`, borderRadius: fs * 0.8, background: filled ? 'rgba(233,205,140,0.09)' : 'rgba(255,255,255,0.035)', border: `1px solid ${filled ? line : 'rgba(255,255,255,0.06)'}`, overflow: 'hidden'}}>
              {filled && sweep < 1 && (
                <div style={{position: 'absolute', top: 0, bottom: 0, left: `${-30 + sweep * 130}%`, width: '30%', background: 'linear-gradient(90deg,rgba(255,236,190,0),rgba(255,236,190,0.35),rgba(255,236,190,0))'}} />
              )}
              <div style={{width: fs * 2.2, height: fs * 2.2, borderRadius: fs * 0.6, border: `1px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E9D09A', flexShrink: 0}}>{r.icon}</div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{color: 'rgba(200,214,240,0.65)', fontSize: fs * 0.7, fontWeight: 500, textTransform: 'uppercase', letterSpacing: fs * 0.06}}>{r.label}</div>
                {filled ? (
                  r.bar ? (
                    <div style={{marginTop: fs * 0.35, opacity: p}}>
                      <div style={{height: fs * 0.42, borderRadius: fs, background: 'rgba(255,255,255,0.08)', position: 'relative'}}>
                        <div style={{position: 'absolute', left: '28%', width: `${44 * p}%`, top: 0, bottom: 0, borderRadius: fs, background: 'linear-gradient(90deg,#F3E6BE,#C9A55C)', boxShadow: '0 0 12px rgba(233,205,140,0.6)'}} />
                      </div>
                      <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 0.92, marginTop: fs * 0.3}}>{r.value}</div>
                    </div>
                  ) : (
                    <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 0.98, opacity: p, transform: `translateY(${(1 - p) * fs * 0.4}px)`, filter: p < 1 ? `blur(${(1 - p) * 4}px)` : undefined}}>{r.value}</div>
                  )
                ) : r.pendingFrom !== undefined && t >= r.pendingFrom ? (
                  <div style={{color: 'rgba(233,214,168,0.7)', fontSize: fs * 0.82, display: 'flex', gap: fs * 0.3, alignItems: 'center', marginTop: fs * 0.1}}>
                    En attente
                    {[0, 1, 2].map((k) => (
                      <span key={k} style={{width: fs * 0.3, height: fs * 0.3, borderRadius: '50%', background: '#E9D09A', opacity: 0.3 + 0.7 * Math.max(0, Math.sin(t * 6 - k))}} />
                    ))}
                  </div>
                ) : (
                  <div style={{height: fs * 0.7, width: '55%', borderRadius: fs, background: 'rgba(255,255,255,0.07)', marginTop: fs * 0.2}} />
                )}
              </div>
              <div style={{width: fs * 1.5, height: fs * 1.5, borderRadius: '50%', background: filled ? 'linear-gradient(135deg,#F3E6BE,#C9A55C)' : 'transparent', border: filled ? 'none' : '1px dashed rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${filled ? 0.6 + 0.4 * prog(t, r.at + 0.15, r.at + 0.55, easeOut) : 1})`, opacity: filled ? clamp01((t - r.at) / 0.3) : 1}}>
                {filled && <IconCheck size={fs * 0.95} color="#241A08" stroke={2.6} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ calendrier de visites */
export type Slot = {day: number; row: number; state: 'busy' | 'free'};
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
const HOURS = ['9h', '10h', '11h', '14h', '15h', '16h'];
const SLOTS: Slot[] = [
  {day: 0, row: 0, state: 'busy'}, {day: 0, row: 2, state: 'free'}, {day: 0, row: 4, state: 'busy'},
  {day: 1, row: 1, state: 'free'}, {day: 1, row: 3, state: 'busy'}, {day: 1, row: 5, state: 'free'},
  {day: 2, row: 0, state: 'free'}, {day: 2, row: 2, state: 'busy'}, {day: 2, row: 4, state: 'free'},
  {day: 3, row: 1, state: 'free'}, {day: 3, row: 3, state: 'free'}, {day: 3, row: 5, state: 'busy'},
  {day: 4, row: 0, state: 'busy'}, {day: 4, row: 2, state: 'free'}, {day: 4, row: 4, state: 'free'},
];

export const CalendarUI: React.FC<{w: number; fs: number; t: number; start: number; pickAt: number; selected?: {day: number; row: number}}> = ({
  w,
  fs,
  t,
  start,
  pickAt,
  selected = {day: 3, row: 1},
}) => {
  const colW = (w - fs * 4.2) / 5;
  const rowH = fs * 2.6;
  const picked = t >= pickAt;
  return (
    <div style={{width: w, borderRadius: fs * 1.3, background: glassBg, border: `1px solid ${line}`, boxShadow: `0 ${fs}px ${fs * 3}px rgba(0,0,0,0.5)`, backdropFilter: 'blur(14px)', padding: fs * 1.2, boxSizing: 'border-box', fontFamily: F.sans}}>
      <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.8, marginBottom: fs * 0.9}}>
        <div style={{width: fs * 2.3, height: fs * 2.3, borderRadius: fs * 0.7, background: 'linear-gradient(135deg,#F3E6BE,#C9A55C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#241A08'}}>
          <IconCalendar size={fs * 1.3} />
        </div>
        <div>
          <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 1.05}}>Visites de la semaine</div>
          <div style={{color: 'rgba(200,214,240,0.7)', fontSize: fs * 0.72}}>Créneaux disponibles</div>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: `${fs * 2.2}px repeat(5, 1fr)`, columnGap: fs * 0.35, rowGap: fs * 0.35}}>
        <div />
        {DAYS.map((d) => (
          <div key={d} style={{textAlign: 'center', color: 'rgba(233,214,168,0.85)', fontSize: fs * 0.72, fontWeight: 600, letterSpacing: fs * 0.06, textTransform: 'uppercase'}}>
            {d}
          </div>
        ))}
        {HOURS.map((hr, r) => (
          <React.Fragment key={hr}>
            <div style={{color: 'rgba(200,214,240,0.55)', fontSize: fs * 0.72, display: 'flex', alignItems: 'center'}}>{hr}</div>
            {DAYS.map((_, d) => {
              const s = SLOTS.find((x) => x.day === d && x.row === r);
              const idx = d * 6 + r;
              const p = prog(t, start + idx * 0.035, start + idx * 0.035 + 0.4, easeOut);
              const isSel = picked && selected.day === d && selected.row === r;
              const bg = isSel ? 'linear-gradient(135deg,#F3E6BE,#C9A55C)' : s?.state === 'busy' ? 'rgba(255,255,255,0.045)' : s?.state === 'free' ? 'rgba(233,205,140,0.20)' : 'rgba(255,255,255,0.02)';
              return (
                <div key={d} style={{height: rowH, borderRadius: fs * 0.5, background: bg, border: s?.state === 'free' || isSel ? `1.5px solid ${isSel ? 'transparent' : 'rgba(243,214,140,0.85)'}` : '1px solid rgba(255,255,255,0.03)', opacity: p, transform: `scale(${0.85 + 0.15 * p})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#241A08', boxShadow: isSel ? '0 0 22px rgba(233,205,140,0.7)' : undefined}}>
                  {isSel && <IconCheck size={fs * 1.1} stroke={2.6} />}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          marginTop: fs * 0.9,
          height: fs * 3.1,
          borderRadius: fs * 0.8,
          background: 'rgba(233,205,140,0.12)',
          border: `1px solid ${line}`,
          display: 'flex',
          alignItems: 'center',
          gap: fs * 0.7,
          padding: `0 ${fs * 0.9}px`,
          opacity: prog(t, pickAt + 0.1, pickAt + 0.6, easeOut),
          transform: `translateY(${(1 - prog(t, pickAt + 0.1, pickAt + 0.6, easeOut)) * fs}px)`,
        }}
      >
        <IconClock size={fs * 1.2} color="#F3E6BE" />
        <div style={{color: '#F8F5EE', fontSize: fs * 0.86, fontWeight: 600}}>Créneau proposé · Jeudi 10h</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ suivi des demandes (tableau de bord) */
export type CrmRow = {name: string; kind: string; status: 'Nouveau' | 'En cours' | 'Visite proposée'; time: string; at: number};
const STATUS = {
  Nouveau: {bg: 'rgba(91,140,255,0.18)', fg: '#9DBBFF'},
  'En cours': {bg: 'rgba(233,205,140,0.16)', fg: '#F3E6BE'},
  'Visite proposée': {bg: 'rgba(94,224,160,0.16)', fg: '#7BE8B3'},
};
export const CrmList: React.FC<{rows: CrmRow[]; t: number; w: number; h: number; fs: number}> = ({rows, t, w, h, fs}) => {
  const rowH = fs * 3.3;
  return (
    <div style={{width: w, height: h, background: 'linear-gradient(180deg,#0D1428,#070B18)', padding: fs * 1.0, boxSizing: 'border-box', fontFamily: F.sans, overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: fs * 0.8}}>
        <div style={{display: 'flex', alignItems: 'center', gap: fs * 0.6}}>
          <div style={{width: fs * 1.9, height: fs * 1.9, borderRadius: fs * 0.55, background: 'linear-gradient(135deg,#F3E6BE,#C9A55C)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IconBell size={fs * 1.05} color="#241A08" />
          </div>
          <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 1.1}}>Suivi des demandes</div>
        </div>
        <div style={{color: 'rgba(233,214,168,0.8)', fontSize: fs * 0.72}}>Aujourd’hui</div>
      </div>
      {rows.map((r, i) => {
        const p = prog(t, r.at, r.at + 0.5, easeOut);
        const st = STATUS[r.status];
        return (
          <div key={i} style={{height: rowH, marginBottom: fs * 0.35, borderRadius: fs * 0.7, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: fs * 0.8, padding: `0 ${fs * 0.8}px`, opacity: p, transform: `translateX(${(1 - p) * fs * 1.5}px)`}}>
            <div style={{width: fs * 2.1, height: fs * 2.1, borderRadius: '50%', background: 'linear-gradient(135deg,#3B5BB8,#1B2A58)', color: '#E8EEFF', fontWeight: 600, fontSize: fs * 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{r.name[0]}</div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{color: '#F8F5EE', fontWeight: 600, fontSize: fs * 0.95}}>{r.name}</div>
              <div style={{color: 'rgba(200,214,240,0.68)', fontSize: fs * 0.76}}>{r.kind}</div>
            </div>
            <div style={{background: st.bg, color: st.fg, fontSize: fs * 0.72, fontWeight: 600, padding: `${fs * 0.22}px ${fs * 0.7}px`, borderRadius: fs}}>{r.status}</div>
            <div style={{color: 'rgba(233,214,168,0.75)', fontSize: fs * 0.7, width: fs * 3, textAlign: 'right'}}>{r.time}</div>
          </div>
        );
      })}
    </div>
  );
};

export {C};
