import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSceneT} from '../components/SceneShell';
import {useLayout} from '../lib/layout';
import {Vista, VistaKind} from '../illustrations/Vistas';
import {MartiniqueMap, PlaceKey} from '../illustrations/MartiniqueMap';
import {World} from '../illustrations/World';
import {StorefrontSvg, StorefrontSign} from '../illustrations/Storefront';
import {HeroText} from '../components/Type';
import {IconPin} from '../ui/Icons';
import {cue, sceneById} from '../lib/timeline';
import {easeInOut, easeOut, prog} from '../lib/anim';
import {BRAND} from '../config/brand';
import {F} from '../theme';
import {MediaBackdrop} from '../components/MediaBackdrop';

const SHOTS: {kind: VistaKind; cue: string; place: PlaceKey; label: string}[] = [
  {kind: 'fdf', cue: 'loc_1', place: 'fortDeFrance', label: 'Fort-de-France'},
  {kind: 'ti', cue: 'loc_2', place: 'troisIlets', label: 'Les Trois-Îlets'},
  {kind: 'lam', cue: 'loc_3', place: 'lamentin', label: 'Le Lamentin'},
  {kind: 'coast', cue: 'loc_4', place: 'littoral', label: 'Le littoral martiniquais'},
  {kind: 'villas', cue: 'loc_5', place: 'villas', label: 'Villas & jardins tropicaux'},
];

/** SCÈNE 5 — L'ancrage local : plans de Fort-de-France, Trois-Îlets, Lamentin, littoral, villas… puis une agence moderne. */
export const Scene5Local: React.FC = () => {
  const t = useSceneT();
  const {w, h, vertical, u} = useLayout();
  const s = sceneById('local');
  const L = (id: string) => cue(id) - s.start;
  const agencyAt = L('loc_agency');
  const starts = [...SHOTS.map((x) => L(x.cue)), agencyAt];

  // quel plan est actif ?
  let idx = 0;
  starts.forEach((st, i) => {
    if (t >= st - 0.02) idx = i;
  });
  const inAgency = idx >= SHOTS.length;

  const whip = (i: number) => {
    const a = starts[i];
    const b = i + 1 < starts.length ? starts[i + 1] : 99;
    const inn = prog(t, a - 0.02, a + 0.34, easeOut);
    const out = prog(t, b - 0.02, b + 0.26, easeInOut);
    return {inn, out, vis: t > a - 0.05 && t < b + 0.3, op: Math.min(inn, 1 - out), dx: (1 - inn) * w * 0.1 - out * w * 0.08, blur: (1 - inn) * 16 + out * 12};
  };

  // ---- titre à l'écran
  const titleStart = 2.5;
  const lines = vertical
    ? [[{t: 'Pensé pour'}, {t: 'les agences'}], [{t: 'immobilières'}], [{t: 'en Martinique.', gold: true}]]
    : [[{t: 'Pensé pour les agences immobilières'}], [{t: 'en Martinique.', gold: true}]];
  const active = SHOTS[Math.min(idx, SHOTS.length - 1)];
  const visited = SHOTS.slice(0, Math.min(idx, SHOTS.length)).map((x) => x.place);
  const mapW = (vertical ? 230 : 250) * u;
  const mapReveal = prog(t, 0.1, 1.2, easeOut);
  const chipT = t - starts[Math.min(idx, SHOTS.length - 1)];
  const chipOp = inAgency ? 1 - prog(t, agencyAt, agencyAt + 0.3, (n) => n) : prog(chipT, 0.15, 0.6, easeOut);

  const agencyP = prog(t, agencyAt, agencyAt + 0.7, easeOut);
  const walk = prog(t, agencyAt + 0.15, agencyAt + 1.75, easeInOut);
  const zoomA = 1 + 0.06 * prog(t, agencyAt, agencyAt + 2.4);

  return (
    <AbsoluteFill style={{background: '#03060F'}}>
      {SHOTS.map((sh, i) => {
        const wp = whip(i);
        if (!wp.vis) return null;
        const p = prog(t, starts[i] - 0.3, starts[i + 1] + 0.3, (n) => n);
        return (
          <AbsoluteFill key={sh.kind} style={{opacity: wp.op, transform: `translateX(${wp.dx}px)`, filter: wp.blur > 0.5 ? `blur(${wp.blur}px)` : undefined}}>
            <Vista kind={sh.kind} w={w} h={h} t={t + 5 + i * 3} p={p} vertical={vertical} />
            <MediaBackdrop slot={sh.kind} p={p} />
          </AbsoluteFill>
        );
      })}

      {/* agence moderne */}
      {inAgency && (
        <AbsoluteFill style={{opacity: agencyP, transform: `translateX(${(1 - agencyP) * w * 0.1}px)`, filter: agencyP < 1 ? `blur(${(1 - agencyP) * 14}px)` : undefined}}>
          <World
            w={w}
            h={h}
            vertical={vertical}
            focus={[850, 520]}
            anchor={vertical ? [0.5, 0.5] : [0.5, 0.52]}
            scaleV={0.72}
            zoom={zoomA}
            html={<StorefrontSign p={prog(t, agencyAt + 0.5, agencyAt + 1.2, easeOut)} brandName={BRAND.agencyName} />}
          >
            <StorefrontSvg t={t + 3} walk={walk} />
          </World>
          <MediaBackdrop slot="agency" p={prog(t, agencyAt, agencyAt + 2.4)} />
        </AbsoluteFill>
      )}

      {/* voile de lisibilité (haut) */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,6,15,0.66) 0%, rgba(3,6,15,0.25) 26%, rgba(3,6,15,0) 42%)'}} />

      {/* titre */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.075 : 0.065), display: 'flex', justifyContent: 'center'}}>
        <HeroText t={t} start={titleStart} stagger={0.08} size={(vertical ? 66 : 70) * u} lines={lines} out={[7.8, 8.3]} />
      </div>

      {/* carte de la Martinique */}
      <div style={{position: 'absolute', right: vertical ? 40 * u : 64 * u, top: vertical ? h * 0.5 : h * 0.3, opacity: mapReveal * (1 - prog(t, agencyAt, agencyAt + 0.45, (n) => n))}}>
        <MartiniqueMap w={mapW} t={t} active={inAgency ? null : active.place} reveal={mapReveal} visited={visited} />
      </div>

      {/* étiquette de lieu */}
      <div
        style={{
          position: 'absolute',
          left: vertical ? 56 * u : 72 * u,
          top: vertical ? h * 0.685 : h * 0.79,
          display: 'flex',
          alignItems: 'center',
          gap: 16 * u,
          opacity: chipOp,
          transform: `translateY(${(1 - chipOp) * 14}px)`,
        }}
      >
        <div style={{width: 58 * u, height: 58 * u, borderRadius: '50%', border: '1px solid rgba(233,214,168,0.5)', background: 'rgba(10,16,34,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconPin size={30 * u} color="#F3E6BE" />
        </div>
        <div>
          <div style={{fontFamily: F.display, fontWeight: 600, fontSize: (vertical ? 30 : 32) * u, letterSpacing: '0.16em', color: '#F8F5EE', textShadow: '0 4px 24px rgba(0,0,0,0.7)', textTransform: 'uppercase'}}>{active.label}</div>
          <div style={{width: 120 * u, height: 2, marginTop: 8 * u, background: 'linear-gradient(90deg,#E9D09A,rgba(233,208,154,0))'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
