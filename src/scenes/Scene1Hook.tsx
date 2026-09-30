import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSceneT} from '../components/SceneShell';
import {useLayout} from '../lib/layout';
import {TwilightVilla} from '../illustrations/TwilightVilla';
import {HeroText} from '../components/Type';
import {prog, easeInOut} from '../lib/anim';
import {MediaBackdrop} from '../components/MediaBackdrop';

/** SCÈNE 1 — L'accroche : vue aérienne d'une villa en Martinique, la caméra avance lentement. */
export const Scene1Hook: React.FC = () => {
  const t = useSceneT();
  const {w, h, vertical, u} = useLayout();
  const p = prog(t, -0.4, 7.4, easeInOut);
  const fs = (vertical ? 92 : 108) * u;
  const lines = vertical
    ? [
        [{t: 'Et si votre agence'}],
        [{t: 'immobilière ne'}],
        [{t: 'manquait plus'}],
        [{t: 'aucune', gold: true}, {t: 'opportunité ?', gold: true}],
      ]
    : [
        [{t: 'Et si votre agence'}],
        [{t: 'immobilière ne manquait'}],
        [{t: 'plus'}, {t: 'aucune opportunité ?', gold: true}],
      ];
  return (
    <AbsoluteFill>
      <TwilightVilla w={w} h={h} t={t + 0.4} p={p} vertical={vertical} />
      <MediaBackdrop slot="hook" p={p} />
      {/* voile pour la lisibilité du titre */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 78% 46% at 50% 24%, rgba(3,6,15,0.62), rgba(3,6,15,0) 72%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.1 : 0.075), display: 'flex', justifyContent: 'center'}}>
        <HeroText lines={lines} t={t} start={2.6} out={[6.45, 6.95]} size={fs} maxWidth={w * (vertical ? 0.86 : 0.78)} />
      </div>
    </AbsoluteFill>
  );
};
