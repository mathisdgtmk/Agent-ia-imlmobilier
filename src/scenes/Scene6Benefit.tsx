import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {useSceneT} from '../components/SceneShell';
import {useLayout} from '../lib/layout';
import {World} from '../illustrations/World';
import {VillaInteriorSvg} from '../illustrations/VillaInterior';
import {HandshakeSvg} from '../illustrations/Handshake';
import {LOOKS} from '../illustrations/People';
import {HeroText} from '../components/Type';
import {Dust} from '../components/Gold';
import {LaptopFrame} from '../ui/Devices';
import {CrmList, CrmRow} from '../ui/Cards';
import {cue, sceneById} from '../lib/timeline';
import {easeInOut, easeOut, lerp, prog} from '../lib/anim';
import {MediaBackdrop} from '../components/MediaBackdrop';

/** SCÈNE 6 — Le bénéfice : l'IA au service de l'humain (accueil d'un couple, poignée de main, suivi des demandes). */
export const Scene6Benefit: React.FC = () => {
  const t = useSceneT();
  const {w, h, vertical, u} = useLayout();
  const s = sceneById('benefit');
  const L = (id: string) => cue(id) - s.start;
  const tB = L('ben_shake'); // poignée de main
  const tC = L('ben_crm'); // tableau de suivi
  const shotA = t < tB + 0.15;
  const shotB = t >= tB - 0.05 && t < tC + 0.2;
  const shotC = t >= tC - 0.05;

  const flashB = Math.max(0, 1 - Math.abs(t - tB) / 0.22) * 0.75;
  const opA = 1 - prog(t, tB - 0.05, tB + 0.12, (n) => n);
  const opB = prog(t, tB - 0.05, tB + 0.12, (n) => n) * (1 - prog(t, tC - 0.05, tC + 0.25, easeInOut));
  const opC = prog(t, tC - 0.05, tC + 0.25, easeInOut);

  // ----- plan A : accueil dans la villa
  const walkA = prog(t, 0.0, 1.5, easeOut);
  const walkC = prog(t, 0.1, 1.9, easeOut);
  const gestA = Math.sin(t * 2.2) * 5;
  const camA = 1 + 0.07 * prog(t, -0.4, tB, easeInOut);
  const actors = [
    {look: LOOKS.agentDay, x: lerp(430, 745, walkA), pose: {l: [8, 10] as [number, number], r: [-42 + gestA, -30 + gestA] as [number, number]}, tilt: 3},
    {look: {...LOOKS.clientM, suit: '#B7AE9C', suitShade: '#8A8272', trouser: '#3B4256'}, x: lerp(2150, 1265, walkC), pose: {l: [6, 6] as [number, number], r: [-10, -10] as [number, number]}, tilt: -2},
    {look: {...LOOKS.clientF, suit: '#E9DCC0', suitShade: '#BDAA84'}, x: lerp(2350, 1440, walkC), pose: {l: [6, 8] as [number, number], r: [-8, -14] as [number, number]}, tilt: -2},
  ];

  // ----- plan B : poignée de main
  const grip = prog(t, tB + 0.05, tB + 0.95, easeInOut);
  const camB = 1 + 0.12 * prog(t, tB, tC, easeInOut);

  // ----- plan C : suivi des demandes
  const rows: CrmRow[] = [
    {name: 'Sophie M.', kind: 'Demande de visite', status: 'Visite proposée', time: '10:42', at: tC + 0.25},
    {name: 'Karim D.', kind: 'Question sur un bien', status: 'En cours', time: '10:46', at: tC + 0.6},
    {name: 'Léa & Thomas', kind: 'Nouveau message', status: 'Nouveau', time: '10:51', at: tC + 0.95},
    {name: 'Nadia R.', kind: 'Demande de rappel', status: 'En cours', time: '10:58', at: tC + 1.3},
    {name: 'Julien P.', kind: 'Demande de visite', status: 'Visite proposée', time: '11:03', at: tC + 1.65},
    {name: 'Amélie T.', kind: 'Question sur un bien', status: 'Nouveau', time: '11:07', at: tC + 2.0},
  ];
  const lw = (vertical ? 980 : 1040) * u;
  const scrW = lw * 0.968;
  const scrH = lw * 0.625 - lw * 0.032;
  const lz = 1 + 0.05 * prog(t, tC, s.end - s.start, easeInOut);

  return (
    <AbsoluteFill style={{background: '#06080F'}}>
      {/* ---------- plan A ---------- */}
      {shotA && (
        <AbsoluteFill style={{opacity: opA}}>
          <World w={w} h={h} vertical={vertical} focus={[vertical ? 1090 : 960, 540]} anchor={[0.5, vertical ? 0.5 : 0.5]} scaleV={1.22} zoom={camA} html={null}>
            <VillaInteriorSvg t={t + 3} id="s6" actors={actors} />
          </World>
          <MediaBackdrop slot="welcome" p={prog(t, -0.4, tB)} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,12,26,0.5) 0%, rgba(8,12,26,0.12) 45%, rgba(8,12,26,0.12) 100%)'}} />
        </AbsoluteFill>
      )}

      {/* ---------- plan B : poignée de main ---------- */}
      {shotB && (
        <AbsoluteFill style={{opacity: opB}}>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 52% 52%, #4A3520 0%, #1B1712 45%, #07090F 100%)'}} />
          {/* bokeh d'une villa en arrière-plan */}
          {Array.from({length: 26}, (_, i) => {
            const x = random(`bk${i}`) * w;
            const y = random(`bky${i}`) * h;
            const r = 26 + random(`bkr${i}`) * 80;
            return <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,214,140,${0.10 + random(`bko${i}`) * 0.2}) 0%, rgba(255,214,140,0) 70%)`, transform: `translate(${Math.sin(t * 0.4 + i) * 10}px, ${Math.cos(t * 0.3 + i) * 8}px)`}} />;
          })}
          <World w={w} h={h} vertical={vertical} focus={[1000, 560]} anchor={[0.5, 0.52]} scaleV={0.58} zoom={camB}>
            <HandshakeSvg grip={grip} t={t} />
          </World>
          <MediaBackdrop slot="handshake" p={prog(t, tB, tC)} />
          <Dust t={t} w={w} h={h} n={36} opacity={0.6} seed="hs" />
        </AbsoluteFill>
      )}

      {/* ---------- plan C : suivi des demandes ---------- */}
      {shotC && (
        <AbsoluteFill style={{opacity: opC, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, #0F1D45 0%, #06080F 70%)'}}>
          <Dust t={t} w={w} h={h} n={30} opacity={0.5} seed="crm" />
          <div style={{position: 'absolute', left: (w - lw) / 2, top: h * (vertical ? 0.3 : 0.235), transform: `scale(${lz}) perspective(2400px) rotateY(-3deg)`, transformOrigin: '50% 40%'}}>
            <LaptopFrame w={lw}>
              <CrmList rows={rows} t={t} w={scrW} h={scrH} fs={(vertical ? 21 : 21) * u} />
            </LaptopFrame>
          </div>
        </AbsoluteFill>
      )}

      {/* flash doré à la poignée de main */}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 52%, rgba(255,236,190,1), rgba(255,200,110,0.4) 50%, rgba(255,200,110,0) 75%)', opacity: flashB, mixBlendMode: 'screen'}} />

      {/* voile haut pour le titre */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,6,14,0.62) 0%, rgba(4,6,14,0.2) 26%, rgba(4,6,14,0) 40%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.07 : 0.07), display: 'flex', justifyContent: 'center'}}>
        <HeroText
          t={t}
          start={1.05}
          stagger={0.09}
          size={(vertical ? 70 : 74) * u}
          out={[7.1, 7.5]}
          lines={
            vertical
              ? [[{t: "L'intelligence"}, {t: 'artificielle'}], [{t: 'au service de'}], [{t: "l'humain.", gold: true}]]
              : [[{t: "L'intelligence artificielle"}], [{t: 'au service de'}, {t: "l'humain.", gold: true}]]
          }
        />
      </div>
    </AbsoluteFill>
  );
};
