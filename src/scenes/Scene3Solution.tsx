import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSceneT} from '../components/SceneShell';
import {useLayout} from '../lib/layout';
import {Logo} from '../components/Logo';
import {GoldBloom, Dust} from '../components/Gold';
import {HeroText} from '../components/Type';
import {LaptopFrame, PhoneFrame} from '../ui/Devices';
import {Chat, Msg} from '../ui/Chat';
import {ProfileCard, ProfileRow} from '../ui/Cards';
import {IconHome, IconPin, IconEuro, IconKey} from '../ui/Icons';
import {cue, sceneById} from '../lib/timeline';
import {easeInOut, easeOut, lerp, prog} from '../lib/anim';
import {BRAND} from '../config/brand';
import {F} from '../theme';

/** Cadran « 24 h » : 24 graduations et une aiguille lumineuse. */
export const ClockDial: React.FC<{size: number; t: number; p?: number}> = ({size, t, p = 1}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity: p, filter: 'drop-shadow(0 0 10px rgba(233,205,140,0.55))'}}>
    <circle cx="50" cy="50" r="44" fill="rgba(10,16,34,0.6)" stroke="rgba(233,214,168,0.55)" strokeWidth="1.4" />
    {Array.from({length: 24}, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      const r1 = i % 6 === 0 ? 33 : 37;
      return <line key={i} x1={50 + Math.sin(a) * r1} y1={50 - Math.cos(a) * r1} x2={50 + Math.sin(a) * 41} y2={50 - Math.cos(a) * 41} stroke={i % 6 === 0 ? '#F3E6BE' : 'rgba(233,214,168,0.6)'} strokeWidth={i % 6 === 0 ? 2.4 : 1.4} strokeLinecap="round" />;
    })}
    <g transform={`rotate(${t * 60} 50 50)`}>
      <line x1="50" y1="50" x2="50" y2="20" stroke="#F3E6BE" strokeWidth="2.6" strokeLinecap="round" />
    </g>
    <circle cx="50" cy="50" r="4" fill="#E9D09A" />
    <text x="50" y="72" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="12" fill="#F3E6BE">24 h</text>
  </svg>
);

/** SCÈNE 3 — La solution : révélation dorée, nom de la solution, conversation sur ordinateur et smartphone. */
export const Scene3Solution: React.FC = () => {
  const t = useSceneT();
  const {w, h, vertical, u} = useLayout();
  const s = sceneById('solution');
  const L = (id: string) => cue(id) - s.start;

  const msgs: Msg[] = [
    {from: 'client', text: 'Bonjour, je recherche une villa avec piscine en Martinique.', at: L('chat_1')},
    {from: 'ai', text: 'Bonjour ! Avec plaisir. Dans quel secteur recherchez-vous votre villa ?', at: L('chat_2'), typingFrom: L('chat_2') - 0.95},
    {from: 'client', text: 'Aux Trois-Îlets, si possible.', at: L('chat_3')},
    {from: 'ai', text: 'Très bien. Quel est votre budget approximatif ?', at: L('chat_4'), typingFrom: L('chat_4') - 0.9},
  ];
  const fsP = 18.5 * u;
  const rows: ProfileRow[] = [
    {icon: <IconHome size={fsP * 1.2} />, label: 'Type de bien', value: 'Villa avec piscine', at: L('profile_1')},
    {icon: <IconPin size={fsP * 1.2} />, label: 'Secteur', value: 'Les Trois-Îlets', at: L('profile_2')},
    {icon: <IconEuro size={fsP * 1.2} />, label: 'Budget', value: '', at: 99, pendingFrom: L('chat_4') + 0.3},
    {icon: <IconKey size={fsP * 1.2} />, label: 'Projet', value: '', at: 99},
  ];

  // --- révélation dorée + nom de la solution
  const pTitle = prog(t, 1.0, 2.4, easeOut);
  const move = prog(t, 1.9, 2.8, easeInOut);
  const k = vertical ? 0.86 : 1.05;
  const finalScale = vertical ? 0.5 : 0.42;
  const cy = lerp(h * 0.5, h * (vertical ? 0.075 : 0.095), move);
  const brandOp = 1 - prog(t, 6.75, 7.15, (n) => n);
  const lineW = prog(t, 1.9, 3.0, easeOut);

  // --- appareils
  const dIn = prog(t, L('sol_devices'), L('sol_devices') + 1.2, easeOut);
  const bob = Math.sin(t * 0.9) * 5 * u;
  const lw = (vertical ? 940 : 1060) * u;
  const lh = lw * 0.625;
  const pw = (vertical ? 345 : 350) * u;
  const lTop = h * (vertical ? 0.178 : 0.19);
  const lLeft = vertical ? (w - lw) / 2 : w * 0.36 - lw / 2;
  const pTop = h * (vertical ? 0.362 : 0.175);
  const pLeft = vertical ? w * 0.5 - pw / 2 : w * 0.755 - pw / 2;
  const zoom = 1 + 0.04 * prog(t, 3.0, 9.4, easeInOut);

  const scrW = lw - lw * 0.032;
  const scrH = lh - lw * 0.032;
  const profW = scrW * 0.42;
  const chatW = scrW - profW;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, #0B1633 0%, #04060B 70%)'}}>
      <Dust t={t} w={w} h={h} n={34} opacity={0.5} />
      <GoldBloom t={t} w={w} h={h} />

      {/* nom de la solution */}
      <div style={{position: 'absolute', left: 0, right: 0, top: cy, display: 'flex', justifyContent: 'center', transform: `translateY(-50%) scale(${lerp(1, finalScale, move)})`, opacity: brandOp}}>
        <Logo k={k * u} p={pTitle} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: h * 0.5 + (vertical ? 190 : 230) * u * (1 - move),
          width: (vertical ? 520 : 700) * u * lineW,
          height: 2,
          marginLeft: -((vertical ? 520 : 700) * u * lineW) / 2,
          background: 'linear-gradient(90deg,rgba(233,205,140,0),rgba(243,230,190,0.95),rgba(233,205,140,0))',
          boxShadow: '0 0 18px rgba(233,205,140,0.8)',
          opacity: (1 - move) * lineW,
        }}
      />

      {/* ordinateur + smartphone */}
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 45%', opacity: dIn}}>
        <div style={{position: 'absolute', left: lLeft, top: lTop + bob + (1 - dIn) * 120, transform: 'perspective(2400px) rotateY(-5deg) rotateX(1.5deg)', transformOrigin: 'center'}}>
          <LaptopFrame w={lw}>
            <div style={{display: 'flex', width: scrW, height: scrH, background: '#080B15'}}>
              <div style={{width: profW, padding: fsP * 0.9, boxSizing: 'border-box', background: 'linear-gradient(180deg,#0D1428,#070B18)', borderRight: '1px solid rgba(255,255,255,0.05)'}}>
                <ProfileCard rows={rows} t={t} w={profW - fsP * 1.8} fs={fsP} bare />
              </div>
              <Chat msgs={msgs} t={t} w={chatW} h={scrH} fs={19 * u} name="Conversation en direct" sub="Agent IA actif" showInput={false} />
            </div>
          </LaptopFrame>
        </div>
        <div style={{position: 'absolute', left: pLeft, top: pTop + bob * 1.4 + (1 - dIn) * 170, transform: 'perspective(2400px) rotateY(-9deg) rotateX(3deg)', transformOrigin: 'center'}}>
          <PhoneFrame w={pw}>
            <Chat msgs={msgs} t={t} w={pw * 0.94} h={pw * 2.06 - pw * 0.06} fs={17.4 * u} name="Agent IA" sub="En ligne" topInset={pw * 0.11} />
          </PhoneFrame>
        </div>
      </AbsoluteFill>

      {/* Votre agence, disponible 24 h/24 */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.02 : 0.045), display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: (vertical ? 14 : 26) * u}}>
        <ClockDial size={(vertical ? 84 : 100) * u} t={t} p={prog(t, L('sol_247') - 0.1, L('sol_247') + 0.6)} />
        <HeroText
          t={t}
          start={L('sol_247')}
          stagger={0.1}
          size={(vertical ? 68 : 84) * u}
          maxWidth={vertical ? w * 0.86 : w * 0.66}
          align={vertical ? 'center' : 'left'}
          lines={vertical ? [[{t: 'Votre agence,'}], [{t: 'disponible'}, {t: '24 h/24.', gold: true}]] : [[{t: 'Votre agence,'}, {t: 'disponible'}, {t: '24 h/24.', gold: true}]]}
        />
      </div>

      {/* mention discrète */}
      <div
        style={{
          position: 'absolute',
          left: vertical ? 0 : undefined,
          right: vertical ? 0 : 56 * u,
          bottom: vertical ? h * 0.1 : 30 * u,
          textAlign: 'center',
          fontFamily: F.sans,
          fontWeight: 400,
          fontSize: (vertical ? 27 : 21) * u,
          color: 'rgba(230,236,255,0.7)',
          letterSpacing: 0.3 * u,
          opacity: prog(t, L('sol_devices') + 0.6, L('sol_devices') + 1.4) * (1 - prog(t, 8.9, 9.3, (n) => n)),
        }}
      >
        {BRAND.disclaimer}
      </div>
    </AbsoluteFill>
  );
};
