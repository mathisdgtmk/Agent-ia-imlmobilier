import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSceneT} from '../components/SceneShell';
import {useLayout} from '../lib/layout';
import {HeroText} from '../components/Type';
import {Dust} from '../components/Gold';
import {PhoneFrame} from '../ui/Devices';
import {Chat, Msg} from '../ui/Chat';
import {ProfileCard, ProfileRow, CalendarUI, CrmList, CrmRow} from '../ui/Cards';
import {IconHome, IconPin, IconEuro, IconKey, IconMoon, IconUsers, IconSpark, IconCalendar, IconCheck} from '../ui/Icons';
import {World} from '../illustrations/World';
import {OfficeSvg, MONITOR} from '../illustrations/Office';
import {LOOKS} from '../illustrations/People';
import {cue, sceneById} from '../lib/timeline';
import {easeInOut, easeOut, lerp, prog} from '../lib/anim';
import {BRAND} from '../config/brand';
import {F, goldDeepText} from '../theme';
import {MediaBackdrop} from '../components/MediaBackdrop';

const STEPS = ['Répondre', 'Qualifier', 'Organiser', 'Gagner du temps'];

/** Fenêtre d'une séquence : entrée (glissement + flou), sortie (fondu latéral). */
const win = (t: number, a: number, b: number) => {
  const inn = prog(t, a - 0.05, a + 0.6, easeOut);
  const out = prog(t, b - 0.32, b + 0.02, easeInOut);
  return {inn, out, vis: inn > 0 && out < 1, op: Math.min(inn, 1 - out), dx: (1 - inn) * 70 - out * 50, blur: (1 - inn) * 10 + out * 8};
};

const Kicker: React.FC<{i: number; p: number; size: number; align?: 'left' | 'center'; dark?: boolean}> = ({i, p, size, align = 'left', dark}) => (
  <div
    style={{
      fontFamily: F.display,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.26em',
      color: dark ? '#8A6A2C' : '#E9D09A',
      opacity: p,
      display: 'flex',
      alignItems: 'center',
      gap: size * 1.1,
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      textTransform: 'uppercase',
    }}
  >
    <span style={{color: dark ? '#1B2540' : '#F8F5EE'}}>{String(i + 1).padStart(2, '0')}</span>
    <span style={{width: size * 3, height: 1.5, background: dark ? 'linear-gradient(90deg,#8A6A2C,rgba(138,106,44,0))' : 'linear-gradient(90deg,#E9D09A,rgba(233,208,154,0))', display: 'inline-block', transform: `scaleX(${p})`, transformOrigin: 'left'}} />
    <span>{STEPS[i]}</span>
  </div>
);

/** SCÈNE 4 — Les fonctionnalités : quatre séquences courtes (Répondre · Qualifier · Organiser · Gagner du temps). */
export const Scene4Features: React.FC = () => {
  const t = useSceneT();
  const {w, h, vertical, u} = useLayout();
  const s = sceneById('features');
  const L = (id: string) => cue(id) - s.start;

  const b = [0, L('f2_in'), L('f3_in'), L('f4_in'), s.end - s.start];
  const W = [win(t, b[0], b[1]), win(t, b[1], b[2]), win(t, b[2], b[3]), win(t, b[3], b[4] + 0.6)];
  const active = t < b[1] ? 0 : t < b[2] ? 1 : t < b[3] ? 2 : 3;

  const titleSize = (vertical ? 92 : 108) * u;
  const textLeft = vertical ? 0 : w * 0.07;
  const titleTop = vertical ? h * 0.118 : h * 0.33;
  const kickTop = vertical ? h * 0.085 : h * 0.26;
  const seqStart = (i: number) => b[i];

  const Title: React.FC<{i: number; lines: {t: string; gold?: boolean}[][]}> = ({i, lines}) => {
    const wv = W[i];
    return (
      <>
        <div style={{position: 'absolute', left: textLeft, right: vertical ? 0 : undefined, top: kickTop, display: 'flex', justifyContent: vertical ? 'center' : 'flex-start', opacity: wv.op}}>
          <Kicker i={i} p={prog(t, seqStart(i), seqStart(i) + 0.7, easeOut)} size={(vertical ? 28 : 26) * u} align={vertical ? 'center' : 'left'} />
        </div>
        <div style={{position: 'absolute', left: textLeft, right: vertical ? 0 : undefined, top: titleTop, display: 'flex', justifyContent: vertical ? 'center' : 'flex-start', opacity: wv.op}}>
          <HeroText t={t} start={seqStart(i) + 0.12} stagger={0.09} size={titleSize} maxWidth={vertical ? w * 0.86 : w * 0.43} align={vertical ? 'center' : 'left'} lines={lines} />
        </div>
      </>
    );
  };

  /* ---------- séquence 1 : Répondre ---------- */
  const w1 = W[0];
  const msgs1: Msg[] = [
    {from: 'client', text: 'Bonjour, je souhaite des informations sur votre villa à Sainte-Anne.', at: L('f1_msg')},
    {from: 'ai', text: 'Bonjour ! Avec plaisir. Souhaitez-vous visiter ce bien cette semaine ?', at: L('f1_reply'), typingFrom: L('f1_reply') - 0.9},
  ];
  const p1w = (vertical ? 400 : 378) * u;
  const p1x = vertical ? w * 0.5 : w * 0.72;
  const p1top = vertical ? h * 0.285 : h * 0.095;

  /* ---------- séquence 2 : Qualifier ---------- */
  const w2 = W[1];
  const fs2 = (vertical ? 30 : 25) * u;
  const c2w = vertical ? w * 0.88 : 660 * u;
  const rows2: ProfileRow[] = [
    {icon: <IconHome size={fs2 * 1.2} />, label: 'Type de bien', value: 'Villa avec piscine', at: L('f2_r1')},
    {icon: <IconPin size={fs2 * 1.2} />, label: 'Secteur recherché', value: 'Les Trois-Îlets', at: L('f2_r2')},
    {icon: <IconEuro size={fs2 * 1.2} />, label: 'Budget', value: '500 – 700 k€', at: L('f2_r3'), bar: true},
    {icon: <IconKey size={fs2 * 1.2} />, label: 'Projet immobilier', value: 'Achat · résidence principale', at: L('f2_r4')},
  ];
  const buyerOn = prog(t, L('f2_r1') - 0.4, L('f2_r1') + 0.2);
  const renterOn = prog(t, L('f2_r3') - 0.2, L('f2_r3') + 0.4);

  /* ---------- séquence 3 : Organiser ---------- */
  const w3 = W[2];
  const fs3 = (vertical ? 27 : 23.5) * u;
  const c3w = vertical ? w * 0.9 : 780 * u;

  /* ---------- séquence 4 : Gagner du temps ---------- */
  const w4 = W[3];
  const t4 = t - b[3];
  const clientIn = prog(t, L('f4_in') + 0.9, L('f4_in') + 2.1, easeOut);
  const gest = Math.sin(t * 1.2) * 6 * clientIn;
  const crmRows: CrmRow[] = [
    {name: 'Sophie M.', kind: 'Demande de visite', status: 'Visite proposée', time: '10:42', at: b[3] + 0.5},
    {name: 'Karim D.', kind: 'Question sur un bien', status: 'En cours', time: '10:46', at: b[3] + 0.9},
    {name: 'Léa & Thomas', kind: 'Nouveau message', status: 'Nouveau', time: '10:51', at: b[3] + 1.3},
  ];
  const mon4 = (
    <div style={{position: 'absolute', left: MONITOR.x, top: MONITOR.y, width: MONITOR.w, height: MONITOR.h, overflow: 'hidden'}}>
      <CrmList rows={crmRows} t={t} w={MONITOR.w} h={MONITOR.h} fs={14.5} />
    </div>
  );

  // fond
  const glowX = lerp(0.75, 0.68, prog(t, 0, 12));
  return (
    <AbsoluteFill style={{background: '#04060B'}}>
      {/* fond sombre commun aux séquences 1 à 3 */}
      <AbsoluteFill style={{opacity: 1 - w4.inn, background: `radial-gradient(ellipse 70% 60% at ${glowX * 100}% 46%, #0F1D45 0%, #070C1D 55%, #04060B 100%)`}} />
      <div style={{opacity: 1 - w4.inn}}>
        <Dust t={t} w={w} h={h} n={30} opacity={0.5} seed="f" />
      </div>

      {/* barre de progression (4 segments) */}
      <div style={{position: 'absolute', left: vertical ? w * 0.08 : w * 0.07, right: vertical ? w * 0.08 : w * 0.07, top: (vertical ? 0.052 : 0.06) * h, display: 'flex', gap: 10 * u, opacity: 1 - 0.0 * w4.inn}}>
        {STEPS.map((_, i) => {
          const fill = i < active ? 1 : i === active ? prog(t, b[i], b[i + 1], (n) => n) : 0;
          return (
            <div key={i} style={{flex: 1, height: 3 * u, borderRadius: 3, background: 'rgba(255,255,255,0.14)', overflow: 'hidden'}}>
              <div style={{width: `${fill * 100}%`, height: '100%', background: 'linear-gradient(90deg,#F3E6BE,#C9A55C)', boxShadow: '0 0 12px rgba(233,205,140,0.8)'}} />
            </div>
          );
        })}
      </div>

      {/* --------- 1 : Répondre --------- */}
      {w1.vis && (
        <AbsoluteFill style={{opacity: w1.op, transform: `translateX(${w1.dx}px)`, filter: w1.blur > 0.5 ? `blur(${w1.blur}px)` : undefined}}>
          {/* lune + halo nocturne */}
          <div style={{position: 'absolute', left: p1x - 420 * u, top: p1top - 60 * u, width: 840 * u, height: 840 * u, borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,150,255,0.30) 0%, rgba(60,90,200,0.10) 45%, rgba(60,90,200,0) 70%)'}} />
          <div style={{position: 'absolute', left: p1x - p1w / 2, top: p1top + Math.sin(t * 0.9) * 5 * u, transform: 'perspective(2400px) rotateY(-8deg) rotateX(2deg)'}}>
            <PhoneFrame w={p1w}>
              <Chat msgs={msgs1} t={t} w={p1w * 0.94} h={p1w * 2.06 - p1w * 0.06} fs={18.5 * u} name="Agent IA" sub="En ligne" topInset={p1w * 0.11} clock="23:47" />
            </PhoneFrame>
          </div>
          {/* pastille « agence fermée » */}
          <div
            style={{
              position: 'absolute',
              left: vertical ? w * 0.5 - 250 * u : p1x - p1w / 2 - 330 * u,
              top: vertical ? p1top - 96 * u : p1top + 130 * u,
              display: 'flex',
              alignItems: 'center',
              gap: 14 * u,
              padding: `${12 * u}px ${24 * u}px`,
              borderRadius: 40 * u,
              border: '1px solid rgba(233,214,168,0.32)',
              background: 'rgba(12,18,38,0.66)',
              backdropFilter: 'blur(10px)',
              color: '#F3E6BE',
              fontFamily: F.sans,
              fontWeight: 600,
              fontSize: 27 * u,
              opacity: prog(t, 0.5, 1.1, easeOut),
              transform: `translateY(${(1 - prog(t, 0.5, 1.1, easeOut)) * 20}px)`,
            }}
          >
            <IconMoon size={26 * u} color="#F3E6BE" />
            23:47 · agence fermée
          </div>
          {!vertical && (
            <div
              style={{
                position: 'absolute',
                left: p1x - p1w / 2 - 400 * u,
                top: p1top + 560 * u,
                display: 'flex',
                alignItems: 'center',
                gap: 14 * u,
                padding: `${14 * u}px ${26 * u}px`,
                borderRadius: 18 * u,
                border: '1px solid rgba(233,214,168,0.3)',
                background: 'linear-gradient(135deg, rgba(26,38,74,0.86), rgba(11,17,36,0.82))',
                backdropFilter: 'blur(12px)',
                color: '#F8F5EE',
                fontFamily: F.sans,
                fontWeight: 600,
                fontSize: 27 * u,
                opacity: prog(t, L('f1_reply') + 0.3, L('f1_reply') + 0.9, easeOut),
                transform: `translateY(${(1 - prog(t, L('f1_reply') + 0.3, L('f1_reply') + 0.9, easeOut)) * 20}px)`,
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              <span style={{width: 34 * u, height: 34 * u, borderRadius: '50%', background: 'linear-gradient(135deg,#F3E6BE,#C9A55C)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
                <IconCheck size={20 * u} color="#241A08" stroke={2.8} />
              </span>
              Première réponse envoyée
            </div>
          )}
          <Title i={0} lines={vertical ? [[{t: 'Des réponses'}], [{t: 'à'}, {t: 'toute heure.', gold: true}]] : [[{t: 'Des réponses'}], [{t: 'à'}, {t: 'toute heure.', gold: true}]]} />
        </AbsoluteFill>
      )}

      {/* --------- 2 : Qualifier --------- */}
      {w2.vis && (
        <AbsoluteFill style={{opacity: w2.op, transform: `translateX(${w2.dx}px)`, filter: w2.blur > 0.5 ? `blur(${w2.blur}px)` : undefined}}>
          <div style={{position: 'absolute', left: vertical ? (w - c2w) / 2 : w * 0.72 - c2w / 2, top: vertical ? h * 0.3 : h * 0.17}}>
            <div style={{display: 'flex', gap: 14 * u, marginBottom: 20 * u, justifyContent: 'center'}}>
              {[
                {label: 'Acheteur', on: buyerOn},
                {label: 'Locataire', on: renterOn},
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10 * u,
                    padding: `${10 * u}px ${22 * u}px`,
                    borderRadius: 40 * u,
                    border: `1px solid rgba(233,214,168,${0.25 + 0.5 * c.on})`,
                    background: `rgba(233,205,140,${0.06 + 0.16 * c.on})`,
                    color: c.on > 0.5 ? '#F3E6BE' : 'rgba(200,214,240,0.6)',
                    fontFamily: F.sans,
                    fontWeight: 600,
                    fontSize: 26 * u,
                    boxShadow: c.on > 0.5 ? '0 0 26px rgba(233,205,140,0.25)' : undefined,
                  }}
                >
                  <IconUsers size={22 * u} />
                  {c.label}
                </div>
              ))}
            </div>
            <ProfileCard rows={rows2} t={t} w={c2w} fs={fs2} title="Profil du prospect" chip="Analyse en cours" chipDone="Besoins identifiés" doneAt={L('f2_r4') + 0.7} />
          </div>
          <Title i={1} lines={vertical ? [[{t: 'Des prospects'}], [{t: 'mieux'}, {t: 'qualifiés.', gold: true}]] : [[{t: 'Des prospects'}], [{t: 'mieux'}, {t: 'qualifiés.', gold: true}]]} />
        </AbsoluteFill>
      )}

      {/* --------- 3 : Organiser --------- */}
      {w3.vis && (
        <AbsoluteFill style={{opacity: w3.op, transform: `translateX(${w3.dx}px)`, filter: w3.blur > 0.5 ? `blur(${w3.blur}px)` : undefined}}>
          <div style={{position: 'absolute', left: vertical ? (w - c3w) / 2 : w * 0.72 - c3w / 2, top: vertical ? h * 0.3 : h * 0.16}}>
            <CalendarUI w={c3w} fs={fs3} t={t} start={b[2] + 0.35} pickAt={L('f3_pick')} />
            <div
              style={{
                marginTop: 22 * u,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12 * u,
                fontFamily: F.sans,
                fontWeight: 500,
                fontSize: (vertical ? 28 : 24) * u,
                color: 'rgba(233,214,168,0.92)',
                opacity: prog(t, b[2] + 1.0, b[2] + 1.6, easeOut),
              }}
            >
              <IconCalendar size={22 * u} color="#E9D09A" />
              Selon les outils connectés à votre agent
            </div>
          </div>
          <Title i={2} lines={vertical ? [[{t: 'Une organisation'}], [{t: 'simplifiée.', gold: true}]] : [[{t: 'Une organisation'}], [{t: 'simplifiée.', gold: true}]]} />
        </AbsoluteFill>
      )}

      {/* --------- 4 : Gagner du temps --------- */}
      {w4.vis && (
        <AbsoluteFill style={{opacity: w4.inn}}>
          <World w={w} h={h} vertical={vertical} focus={[vertical ? 925 : 960, 540]} anchor={vertical ? [0.5, 0.5] : [0.5, 0.5]} scaleV={0.78} zoom={1 + 0.05 * prog(t4, 0, 3.4)} html={mon4}>
            <OfficeSvg
              t={t + 3}
              mood="day"
              id="s4"
              agentPose={{l: [10 + gest * 0.4, 72], r: clientIn > 0.6 ? [-52 + gest, -46 + gest] : [-10, -72]}}
              agentTilt={clientIn > 0.6 ? 4 : -3}
              client={{look: {...LOOKS.clientF, suit: '#3A4468', suitShade: '#252C48', hair: '#1B120E', skin: '#B47A55'}, x: lerp(2200, 1640, clientIn), opacity: clientIn}}
              agentLook={LOOKS.agentDay}
            />
          </World>
          <MediaBackdrop slot="timesaving" p={prog(t4, 0, 3.4)} />
          <AbsoluteFill style={{background: vertical ? 'linear-gradient(180deg,rgba(255,250,240,0.0) 0%)' : 'radial-gradient(ellipse 46% 19% at 21% 17%, rgba(240,233,219,0.93) 0%, rgba(240,233,219,0.86) 60%, rgba(240,233,219,0) 100%)'}} />
          <div style={{position: 'absolute', left: textLeft, right: vertical ? 0 : undefined, top: vertical ? h * 0.085 : h * 0.05, display: 'flex', justifyContent: vertical ? 'center' : 'flex-start'}}>
            <Kicker i={3} p={prog(t, b[3], b[3] + 0.7, easeOut)} size={(vertical ? 28 : 26) * u} align={vertical ? 'center' : 'left'} dark />
          </div>
          <div style={{position: 'absolute', left: textLeft, right: vertical ? 0 : undefined, top: vertical ? h * 0.115 : h * 0.09, display: 'flex', justifyContent: vertical ? 'center' : 'flex-start'}}>
            <HeroText
              t={t}
              start={b[3] + 0.12}
              stagger={0.09}
              size={titleSize * (vertical ? 1 : 0.74)}
              maxWidth={vertical ? w * 0.86 : w * 0.42}
              align={vertical ? 'center' : 'left'}
              color="#1B2540"
              shadow={false}
              goldStyle={goldDeepText}
              lines={[[{t: 'Plus de temps'}], [{t: 'pour'}, {t: 'vos clients.', gold: true}]]}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* mention discrète (séquences 1 à 3) */}
      <div
        style={{
          position: 'absolute',
          left: vertical ? 0 : undefined,
          right: vertical ? 0 : 56 * u,
          bottom: vertical ? h * 0.115 : 38 * u,
          textAlign: 'center',
          fontFamily: F.sans,
          fontSize: (vertical ? 27 : 21) * u,
          color: 'rgba(230,236,255,0.7)',
          opacity: (1 - w4.inn) * prog(t, 0.6, 1.2),
        }}
      >
        {BRAND.disclaimer}
      </div>
    </AbsoluteFill>
  );
};

export {IconSpark};
