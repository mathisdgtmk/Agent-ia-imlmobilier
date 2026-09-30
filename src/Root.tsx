import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {DURATION_F, FPS} from './lib/timeline';
import {Gallery} from './dev/Gallery';

export const Root: React.FC = () => (
  <>
    {/* Version horizontale 16:9 — YouTube, site web, présentation commerciale */}
    <Composition id="Ad-16x9" component={Ad} durationInFrames={DURATION_F} fps={FPS} width={1920} height={1080} defaultProps={{voix: true}} />
    {/* Version verticale 9:16 — TikTok, Instagram Reels, stories */}
    <Composition id="Ad-9x16" component={Ad} durationInFrames={DURATION_F} fps={FPS} width={1080} height={1920} defaultProps={{voix: true}} />
    {/* Mêmes vidéos SANS voix off ni sous-titres (musique et effets sonores seulement) */}
    <Composition id="Ad-16x9-sans-voix" component={Ad} durationInFrames={DURATION_F} fps={FPS} width={1920} height={1080} defaultProps={{voix: false}} />
    <Composition id="Ad-9x16-sans-voix" component={Ad} durationInFrames={DURATION_F} fps={FPS} width={1080} height={1920} defaultProps={{voix: false}} />
    {/* Outil de mise au point (non utilisé dans le rendu final) */}
    <Composition id="Dev-Gallery" component={Gallery} durationInFrames={30} fps={FPS} width={1920} height={1080} />
  </>
);
