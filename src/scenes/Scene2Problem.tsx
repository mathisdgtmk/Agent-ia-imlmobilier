import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSceneT} from '../components/SceneShell';
import {useLayout} from '../lib/layout';
import {World, worldTransform, DESIGN_W, DESIGN_H} from '../illustrations/World';
import {OfficeSvg, MONITOR} from '../illustrations/Office';
import {LOOKS} from '../illustrations/People';
import {HeroText} from '../components/Type';
import {InboxScreen, NotificationCard, NotifKind} from '../ui/Cards';
import {IconBell} from '../ui/Icons';
import {cue, sceneById} from '../lib/timeline';
import {easeInOut, easeOut, prog} from '../lib/anim';
import {F} from '../theme';
import {MediaBackdrop} from '../components/MediaBackdrop';

const EVENTS: {id: string; kind: NotifKind; title: string; body: string; name: string; snippet: string; time: string}[] = [
  {id: 'n_call', kind: 'call', title: 'Appel entrant', body: 'Sophie M. · Fort-de-France', name: 'Appel entrant', snippet: 'Sophie M. — Fort-de-France', time: '10:42'},
  {id: 'n_msg', kind: 'msg', title: 'Nouveau message', body: 'La villa est-elle toujours disponible ?', name: 'Nouveau message', snippet: 'La villa est-elle toujours disponible ?', time: '10:43'},
  {id: 'n_visit', kind: 'visit', title: 'Demande de visite', body: 'Villa aux Trois-Îlets · samedi matin', name: 'Demande de visite', snippet: 'Villa aux Trois-Îlets — samedi matin', time: '10:45'},
  {id: 'n_q', kind: 'question', title: 'Question sur un bien', body: 'Le terrain est-il constructible ?', name: 'Question sur un bien', snippet: 'Le terrain est-il constructible ?', time: '10:46'},
];

/** SCÈNE 2 — Le problème : l'agent est pris par un client pendant que les demandes s'accumulent. */
export const Scene2Problem: React.FC = () => {
  const ts = useSceneT();
  const {w, h, vertical, u} = useLayout();
  const s = sceneById('problem');
  // ralentissement de l'image en fin de scène, avant le noir
  const slowStart = cue('problem_slow') - s.start;
  const t = ts < slowStart ? ts : slowStart + (ts - slowStart) * (1 - 0.7 * prog(ts, slowStart, slowStart + 1.0, easeInOut));
  const tw = t + 7; // temps "monde" (mouvement des nuages, reflets)
  const zoom = 1 + 0.07 * prog(t, -0.4, 7.4, easeInOut);

  const times = EVENTS.map((e) => cue(e.id) - s.start);
  const moreT = cue('n_more') - s.start;

  // agent : gestes lents en parlant au client
  const gest = Math.sin(t * 1.3) * 7;
  const pose = {l: [8, 72] as [number, number], r: [-56 + gest, -50 + gest * 0.8] as [number, number]};
  const ringOn = t > times[0] && t < times[0] + 3.2 ? 1 : 0;

  const inboxItems = [
    ...EVENTS.map((e, i) => ({kind: e.kind, name: e.name, snippet: e.snippet, time: e.time, at: times[i]})),
    {kind: 'msg' as NotifKind, name: 'Nouveau message', snippet: 'Bonjour, je vous relance pour…', time: '10:48', at: moreT},
    {kind: 'call' as NotifKind, name: 'Appel manqué', snippet: 'Karim D. — Le Lamentin', time: '10:49', at: moreT + 0.6},
  ];

  const anchor: [number, number] = vertical ? [0.5, 0.42] : [0.5, 0.5];
    const mon = (
    <div style={{position: 'absolute', left: MONITOR.x, top: MONITOR.y, width: MONITOR.w, height: MONITOR.h, overflow: 'hidden'}}>
      <InboxScreen items={inboxItems} t={t} w={MONITOR.w} h={MONITOR.h} fs={15} />
    </div>
  );

  // pile de notifications (verre dépoli)
  const cardW = vertical ? w * 0.88 : w * 0.3;
  const fs = (vertical ? 30 : 21.5) * u;
  const cardH = fs * 4.6;
  const peek = fs * 0.62;
  const stackLeft = vertical ? (w - cardW) / 2 : w * 0.655;
  const stackTop = vertical ? h * 0.655 : h * 0.1;
  const arrived = EVENTS.map((_, i) => prog(t, times[i], times[i] + 0.7, easeOut));
  const count = times.filter((x) => t >= x).length + (t >= moreT ? 2 : 0);

  return (
    <AbsoluteFill style={{background: '#04060B'}}>
      <World w={w} h={h} vertical={vertical} focus={[vertical ? 925 : 960, 540]} anchor={anchor} scaleV={0.78} zoom={zoom} html={mon}>
        <OfficeSvg
          t={tw}
          mood="dusk"
          id="s2"
          agentPose={pose}
          agentTilt={3 + Math.sin(t * 0.9) * 2}
          client={{look: {...LOOKS.clientM, suit: '#232A40', suitShade: '#161B2C', hair: '#2A2018', skin: '#D7A07A'}, x: 1640, opacity: 1}}
          ring={ringOn}
        />
      </World>
      <MediaBackdrop slot="problem" p={prog(t, -0.4, 7.4)} />
      {/* dégradés pour la lisibilité (texte en haut, sous-titres en bas) */}
      <AbsoluteFill style={{background: vertical ? 'linear-gradient(180deg,rgba(3,5,11,0.85) 0%,rgba(3,5,11,0.0) 26%)' : 'linear-gradient(90deg,rgba(3,5,11,0.55) 0%,rgba(3,5,11,0) 45%)'}} />

      {/* texte à l'écran */}
      <div style={{position: 'absolute', left: vertical ? 0 : w * 0.065, right: vertical ? 0 : undefined, top: vertical ? h * 0.06 : h * 0.13, display: 'flex', justifyContent: vertical ? 'center' : 'flex-start'}}>
        <HeroText
          t={t}
          start={cue('n_call') - s.start + 0.35}
          stagger={0.55}
          out={[6.55, 7.0]}
          size={(vertical ? 66 : 76) * u}
          align={vertical ? 'center' : 'left'}
          lines={
            vertical
              ? [[{t: 'Des messages. Des appels.'}], [{t: 'Des demandes.'}], [{t: 'Toute la journée.', gold: true}]]
              : [[{t: 'Des messages. Des appels.'}], [{t: 'Des demandes.'}], [{t: 'Toute la journée.', gold: true}]]
          }
        />
      </div>

      {/* compteur + pile de notifications */}
      <div style={{position: 'absolute', left: stackLeft, top: stackTop, width: cardW}}>
        <div
          style={{
            position: 'absolute',
            top: -fs * 2.5,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            gap: fs * 0.55,
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: fs * 0.82,
            color: '#F3E6BE',
            padding: `${fs * 0.3}px ${fs * 0.9}px`,
            borderRadius: fs * 2,
            border: '1px solid rgba(233,214,168,0.35)',
            background: 'rgba(12,18,38,0.6)',
            backdropFilter: 'blur(10px)',
            opacity: prog(t, times[0], times[0] + 0.4, easeOut) * (1 - prog(t, 6.6, 7.0, (n) => n)),
          }}
        >
          <IconBell size={fs * 0.95} color="#F3E6BE" />
          {count} demande{count > 1 ? 's' : ''} en attente
        </div>
        {EVENTS.map((e, i) => {
          const later = EVENTS.slice(i + 1).reduce((acc, _, j) => acc + arrived[i + 1 + j], 0);
          const p = arrived[i];
          const k = later;
          const fade = 1 - prog(t, 6.6, 7.0, (n) => n);
          return (
            <div
              key={e.id}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: cardW,
                transform: `translateY(${k * peek + (1 - p) * -fs * 2.6}px) scale(${1 - 0.04 * k})`,
                transformOrigin: 'center top',
                opacity: p * Math.max(0, 1 - 0.24 * k) * fade,
                zIndex: 10 - Math.round(k),
              }}
            >
              <NotificationCard kind={e.kind} title={e.title} body={e.body} w={cardW} fs={fs} p={1} glow={k < 0.5 ? 1 - prog(t, times[i], times[i] + 1.2) : 0} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export {DESIGN_W, DESIGN_H};
