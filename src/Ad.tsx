import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from './lib/fonts';
import {Subtitles} from './components/Subtitles';
import {Grain, Vignette} from './components/Film';
import {SceneShell} from './components/SceneShell';
import {Transitions} from './components/Transitions';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Problem} from './scenes/Scene2Problem';
import {Scene3Solution} from './scenes/Scene3Solution';
import {Scene4Features} from './scenes/Scene4Features';
import {Scene5Local} from './scenes/Scene5Local';
import {Scene6Benefit} from './scenes/Scene6Benefit';
import {Scene7Cta} from './scenes/Scene7Cta';
import {DURATION_F, FPS} from './lib/timeline';
import {clamp01} from './lib/anim';

loadFonts();

/**
 * Publicité 60 s — « Votre agent IA immobilier » (Martinique).
 * Un seul composant pour les deux formats : les scènes s'adaptent à la taille de l'image (16:9 ou 9:16).
 */
export type AdProps = {
  /** true : voix off + sous-titres (version complète) ; false : musique et effets seuls, sans sous-titres. */
  voix: boolean;
};

export const Ad: React.FC<AdProps> = ({voix}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fadeIn = 1 - clamp01(1 - t / 0.5);
  return (
    <AbsoluteFill style={{background: '#020409'}}>
      <SceneShell id="hook" pre={0} post={0.4}><Scene1Hook /></SceneShell>
      <SceneShell id="problem" pre={0.4} post={0.45}><Scene2Problem /></SceneShell>
      <SceneShell id="solution" pre={0.4} post={0.3}><Scene3Solution /></SceneShell>
      <SceneShell id="features" pre={0.2} post={0.3}><Scene4Features /></SceneShell>
      <SceneShell id="local" pre={0.2} post={0.3}><Scene5Local /></SceneShell>
      <SceneShell id="benefit" pre={0.2} post={0.3}><Scene6Benefit /></SceneShell>
      <SceneShell id="cta" pre={0.3} post={0}><Scene7Cta /></SceneShell>
      <Transitions />
      {voix && <Subtitles />}
      <Vignette />
      <Grain />
      {/* fondu d'ouverture depuis le noir */}
      <AbsoluteFill style={{background: '#000', opacity: 1 - fadeIn, pointerEvents: 'none'}} />
      <Audio src={staticFile(voix ? 'audio/soundtrack.wav' : 'audio/soundtrack_sans_voix.wav')} />
    </AbsoluteFill>
  );
};

export {DURATION_F};
