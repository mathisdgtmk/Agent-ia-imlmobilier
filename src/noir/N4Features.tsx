import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../lib/layout';
import {NF} from './type';
import {Caps, Crosshair, Cursor, Headline, HLine, INK, PAPER, Ring, Specks, useT} from './kit';
import {beatPulse, clamp01, expoOut, lerp, pr, smooth} from './motion';
import {bt, cue, cueList} from './timeline';
import {Bubble, CalendarNoir, Chip, CrmNoir, CrmRowN, PhoneNoir, ProfileCardNoir, ProfileRow} from './ui';

const STEPS = ['RÉPONDRE', 'QUALIFIER', 'ORGANISER', 'GAGNER DU TEMPS'];
const TITLES: HLine[][] = [
  [{text: 'Des réponses'}, {text: 'à toute heure.'}],
  [{text: 'Des prospects'}, {text: 'mieux qualifiés.'}],
  [{text: 'Une organisation'}, {text: 'simplifiée.'}],
  [{text: 'Plus de temps'}, {text: 'pour vos clients.'}],
];
const STARTS = [44, 50, 56, 62];

/** LES FONCTIONS — quatre plans de 3,6 s : Répondre · Qualifier · Organiser · Gagner du temps. (21,6 → 36 s) */
export const N4Features: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();
  const k = Math.max(0, Math.min(3, Math.floor((t - bt(44)) / bt(6))));
  const f0 = bt(STARTS[k]);
  const loc = t - f0;
  const light = k % 2 === 1;
  const bg = light ? PAPER : INK;
  const fg = light ? INK : '#fff';
  const id = `f${k + 1}`;
  const m = 110 * u;
  const pulse = beatPulse(t);

  // ------------------------------------------------ progression 01-04
  const segW = vertical ? (w - 2 * 52 * u - 3 * 12 * u) / 4 : 120 * u;
  const segTop = (vertical ? 188 : 98) * u;
  const segLeft = vertical ? 52 * u : m;

  // ------------------------------------------------ interface (à droite en 16:9, sous le titre en 9:16)
  const ucx = vertical ? w / 2 : w * 0.725;
  const ui = pr(t, cue(`${id}_ui`), 0.9, expoOut);
  let uiNode: React.ReactNode = null;
  let uiH = 0;

  if (k === 0) {
    const pw = (vertical ? 400 : 392) * u;
    const ph = pw * 2.04;
    uiH = ph;
    const top = vertical ? h * 0.355 : (h - ph) / 2 + 6 * u;
    uiNode = (
      <>
        <div style={{position: 'absolute', left: ucx - pw / 2, top, transform: `translateX(${(1 - ui) * 220 * u}px)`, opacity: clamp01(ui * 3)}}>
          <PhoneNoir w={pw} onLight={light} time="23:47">
            <Bubble t={t} a={cue('f1_m1')} who="me" w={pw} text="Bonjour, je souhaite des informations sur votre villa à Sainte-Anne." />
            <Bubble t={t} a={cue('f1_m2')} typing={cue('f1_m2') - 0.8} who="agent" w={pw} text="Bonjour ! Avec plaisir. Souhaitez-vous visiter ce bien cette semaine ?" />
          </PhoneNoir>
        </div>
        <div style={{position: 'absolute', left: vertical ? w / 2 - 190 * u : ucx - pw / 2 - 360 * u, top: vertical ? top - 66 * u : top + 110 * u}}>
          <Chip t={t} a={cue('f1_ui') + 0.35} text="23:47 · agence fermée" fs={26 * u} icon="moon" invert={light} />
        </div>
        <div style={{position: 'absolute', left: vertical ? w / 2 - 190 * u : ucx - pw / 2 - 410 * u, top: vertical ? top + ph - 170 * u : top + ph * 0.7}}>
          <Chip t={t} a={cue('f1_ok')} text="Première réponse envoyée" fs={(vertical ? 22 : 26) * u} icon="check" invert />
        </div>
      </>
    );
  } else if (k === 1) {
    const cw = (vertical ? 860 : 640) * u;
    const rows: ProfileRow[] = [
      {icon: 'home', label: 'Type de bien', value: 'Villa avec piscine', at: cueList('f2_r')[0]},
      {icon: 'pin', label: 'Secteur recherché', value: 'Les Trois-Îlets', at: cueList('f2_r')[1]},
      {icon: 'euro', label: 'Budget', value: 'À préciser', at: cueList('f2_r')[2]},
      {icon: 'key', label: 'Projet', value: 'Résidence secondaire', at: cueList('f2_r')[3]},
    ];
    uiH = cw * 0.95;
    const top = vertical ? h * 0.37 : h * 0.5 - cw * 0.5;
    uiNode = (
      <div style={{position: 'absolute', left: ucx - cw / 2, top}}>
        <ProfileCardNoir t={t} w={cw} rows={rows} onLight={light} a={cue('f2_ui')} />
      </div>
    );
  } else if (k === 2) {
    const cw = (vertical ? 880 : 680) * u;
    const slots = [
      {col: 0, row: 1}, {col: 1, row: 0}, {col: 3, row: 1}, {col: 2, row: 2}, {col: 1, row: 4}, {col: 4, row: 3},
    ].map((s, i) => ({...s, at: cueList('f3_s')[i]}));
    const pick = slots[3];
    const cardTop = vertical ? h * 0.36 : h * 0.5 - (cw * 0.2 + cw * 0.115 * 6 + cw * 0.115) / 2;
    const cardLeft = ucx - cw / 2;
    const cwCell = cw * 0.16;
    const rh = cw * 0.115;
    const tx = cardLeft + cw * 0.14 + pick.col * cwCell + cwCell * 0.5;
    const ty = cardTop + cw * 0.2 * 0.8 + cw * 0.062 + pick.row * rh + rh * 0.5;
    const cm = pr(t, bt(59), bt(1.15), smooth);
    const curOp = pr(t, bt(58.6), 0.3);
    const cx0 = cardLeft + cw * 1.02;
    const cy0 = cardTop + cw * 0.9;
    const press = Math.max(0, 1 - Math.abs(t - cue('f3_click')) / 0.12);
    uiH = cw * 0.9;
    uiNode = (
      <>
        <div style={{position: 'absolute', left: cardLeft, top: cardTop}}>
          <CalendarNoir t={t} w={cw} slots={slots} pick={{col: pick.col, row: pick.row, at: cue('f3_click')}} onLight={light} a={cue('f3_ui')} />
        </div>
        <div style={{opacity: curOp}}>
          <Cursor x={lerp(cx0, tx, cm)} y={lerp(cy0, ty, cm)} scale={u * 0.9} press={press} color={'#fff'} edge={'#000'} />
        </div>
        <Ring t={t} a={cue('f3_click')} size={150 * u} d={0.7} color={fg} width={3 * u} x={tx} y={ty} />
        <div style={{position: 'absolute', left: cardLeft, width: cw, top: cardTop + cw * 0.2 + cw * 0.115 * 6 + cw * 0.12, textAlign: 'center', fontFamily: NF.ui, fontSize: 21 * u, color: fg, opacity: pr(t, cue('f3_ui') + 0.9, 0.5) * 0.7}}>
          Selon les outils connectés à votre agent
        </div>
      </>
    );
  } else {
    const cw = (vertical ? 900 : 840) * u;
    const names: Omit<CrmRowN, 'at'>[] = [
      {name: 'Sophie M.', kind: 'Demande de visite', status: 'Visite proposée', time: '10:42'},
      {name: 'Karim D.', kind: 'Question sur un bien', status: 'En cours', time: '10:46'},
      {name: 'Léa & Thomas', kind: 'Nouveau message', status: 'Nouveau', time: '10:51'},
      {name: 'Nadia R.', kind: 'Demande de rappel', status: 'En cours', time: '10:58'},
      {name: 'Julien P.', kind: 'Demande de visite', status: 'Visite proposée', time: '11:03'},
    ];
    const rows = names.map((r, i) => ({...r, at: cueList('f4_r')[i]}));
    uiH = cw * 0.9;
    uiNode = (
      <>
        <div style={{position: 'absolute', left: ucx - cw / 2, top: vertical ? h * 0.37 : h * 0.5 - cw * 0.43}}>
          <CrmNoir t={t} w={cw} rows={rows} onLight={light} a={cue('f4_ui')} />
        </div>
        <Ring t={t} a={cue('f4_ok')} size={cw * 1.2} d={1.0} color={fg} width={3 * u} x={ucx} y={vertical ? h * 0.37 + cw * 0.4 : h * 0.5} />
      </>
    );
  }

  const numSize = (vertical ? 600 : 640) * u;
  const numIn = pr(t, f0, 0.8, expoOut);

  return (
    <AbsoluteFill style={{background: bg}}>
      <Specks t={t} n={24} seed={`f${k}`} color={fg} opacity={0.2} />
      {/* numéro géant en contour */}
      <div
        style={{
          position: 'absolute',
          left: vertical ? w * 0.38 : -w * 0.02,
          top: vertical ? h * 0.01 : h * 0.4,
          fontFamily: NF.big,
          fontWeight: 700,
          fontStyle: 'italic',
          fontFeatureSettings: '"lnum"',
          fontSize: numSize,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: `${2.2 * u}px ${fg}`,
          opacity: 0.17 * numIn,
          transform: `translateX(${(1 - numIn) * -120 * u}px) scale(${1 + 0.012 * pulse})`,
          whiteSpace: 'nowrap',
        }}
      >
        {String(k + 1).padStart(2, '0')}
      </div>
      {/* anneau en orbite derrière l'interface */}
      {(() => {
        const R = (vertical ? 470 : 470) * u;
        const cy = vertical ? h * 0.37 + uiH * 0.5 : h * 0.5;
        const a1 = t * 1.2 + k;
        return (
          <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, opacity: pr(t, f0 + 0.2, 0.8) * 0.45}}>
            <circle cx={ucx} cy={cy} r={R} fill="none" stroke={fg} strokeOpacity={0.35} strokeWidth={1.5 * u} strokeDasharray={`${6 * u} ${12 * u}`} />
            <circle cx={ucx + Math.cos(a1) * R} cy={cy + Math.sin(a1) * R} r={7 * u} fill={fg} />
            <circle cx={ucx + Math.cos(a1 + Math.PI) * R} cy={cy + Math.sin(a1 + Math.PI) * R} r={4 * u} fill={fg} />
          </svg>
        );
      })()}
      {uiNode}
      {/* progression 01-04 */}
      {[0, 1, 2, 3].map((i) => {
        const fill = i < k ? 1 : i === k ? clamp01(loc / bt(6)) : 0;
        return (
          <div key={i} style={{position: 'absolute', left: segLeft + i * (segW + 12 * u), top: segTop, width: segW, height: 3 * u, background: light ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.2)'}}>
            <div style={{width: `${fill * 100}%`, height: '100%', background: fg}} />
          </div>
        );
      })}
      {/* légende + titre */}
      <div style={{position: 'absolute', left: vertical ? 0 : m, right: vertical ? 0 : undefined, top: h * (vertical ? 0.125 : 0.25), display: 'flex', flexDirection: vertical ? 'column' : 'column', alignItems: vertical ? 'center' : 'flex-start', color: fg}}>
        <div style={{opacity: pr(t, cue(`${id}_k`), 0.4), display: 'flex', alignItems: 'center', gap: 18 * u}}>
          <span style={{fontFamily: NF.tech, fontWeight: 400, fontSize: 26 * u, letterSpacing: '0.2em'}}>{String(k + 1).padStart(2, '0')}</span>
          <span style={{width: 70 * u * pr(t, cue(`${id}_k`), 0.6), height: 2 * u, background: fg}} />
          <Caps text={STEPS[k]} size={26 * u} spacing={0.3} weight={700} color={fg} />
        </div>
        <div style={{marginTop: 34 * u}}>
          <Headline fx="flip"
            lines={TITLES[k].map((l, i) => (i === TITLES[k].length - 1 ? {...l, kind: 'outline' as const, fillAt: f0 + bt(2.6)} : l))}
            t={t}
            a={cue(`${id}_t`)}
            step={bt(0.55)}
            size={(vertical ? 104 : 118) * u}
            maxWidth={vertical ? w * 0.88 : w * 0.44}
            align={vertical ? 'center' : 'left'}
            color={fg}
          />
        </div>
      </div>
      {/* mention discrète */}
      <div style={{position: 'absolute', left: vertical ? 0 : m, right: vertical ? 0 : undefined, top: h - (vertical ? 300 : 125) * u, textAlign: vertical ? 'center' : 'left', fontFamily: NF.ui, fontSize: 16 * u, letterSpacing: '0.12em', color: fg, opacity: 0.45}}>
        SIMULATION ILLUSTRATIVE · FONCTIONNALITÉS SELON CONFIGURATION
      </div>
      <Crosshair x={vertical ? 52 * u : m - 40 * u} y={vertical ? 262 * u : h - 160 * u} size={14 * u} color={fg} p={pr(t, f0 + 0.1, 0.4)} />
    </AbsoluteFill>
  );
};
