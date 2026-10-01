import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {useLayout} from '../lib/layout';
import {loadFonts} from '../lib/fonts';
import {Flash, Hud, NoirGrain, NoirVignette, Shutter, SliceWipe, Win, useT, INK, PAPER} from './kit';
import {shakeAt} from './motion';
import {bt, scene} from './timeline';
import {N1Hook} from './N1Hook';
import {N2Problem} from './N2Problem';
import {N3Solution} from './N3Solution';
import {N4Features} from './N4Features';
import {N5Local} from './N5Local';
import {N6Benefit} from './N6Benefit';
import {N7Cta} from './N7Cta';

loadFonts();

/**
 * Publicité 60 s « Noir & Blanc » : montage sur le tempo (100 BPM), typographie animée, bruitages à chaque animation.
 * Un seul composant pour 16:9 et 9:16. Aucune voix, aucun sous-titre.
 */
export const AdNoir: React.FC = () => {
  const t = useT();
  const {u} = useLayout();
  const sh = shakeAt(t);
  const S = (id: Parameters<typeof scene>[0]) => scene(id);
  return (
    <AbsoluteFill style={{background: '#000', filter: 'grayscale(1)'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x * u}px, ${sh.y * u}px) rotate(${sh.r}deg) scale(1.02)`}}>
        <Win a={S('hook').start} b={S('hook').end}><N1Hook /></Win>
        <Win a={S('problem').start} b={S('problem').end}><N2Problem /></Win>
        <Win a={S('solution').start} b={S('solution').end}><N3Solution /></Win>
        <Win a={S('features').start} b={S('features').end}><N4Features /></Win>
        <Win a={S('local').start} b={S('local').end}><N5Local /></Win>
        <Win a={S('benefit').start} b={S('benefit').end}><N6Benefit /></Win>
        <Win a={S('cta').start} b={S('cta').end}><N7Cta /></Win>
      </AbsoluteFill>
      <Shutter at={bt(44)} color="#fff" />
      <Shutter at={bt(50)} color={INK} dir="up" />
      <Shutter at={bt(56)} color="#fff" />
      <Shutter at={bt(62)} color={INK} dir="up" />
      <Shutter at={bt(68)} color="#fff" dir="up" />
      <SliceWipe at={bt(80)} color={PAPER} />
      <Hud />
      <Flash times={[bt(11.4), bt(11.7), bt(32), bt(92)]} len={0.12} />
      <NoirGrain />
      <NoirVignette />
      <Audio src={staticFile('audio/noir_soundtrack.wav')} />
    </AbsoluteFill>
  );
};
