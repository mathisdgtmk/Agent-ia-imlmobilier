import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {DURATION_F, FPS} from './lib/timeline';
import {Gallery} from './dev/Gallery';

export const Root: React.FC = () => (
  <>
    {/* Version horizontale 16:9 — YouTube, site web, présentation commerciale */}
    <Composition id="Ad-16x9" component={Ad} durationInFrames={DURATION_F} fps={FPS} width={1920} height={1080} />
    {/* Version verticale 9:16 — TikTok, Instagram Reels, stories */}
    <Composition id="Ad-9x16" component={Ad} durationInFrames={DURATION_F} fps={FPS} width={1080} height={1920} />
    {/* Outil de mise au point (non utilisé dans le rendu final) */}
    <Composition id="Dev-Gallery" component={Gallery} durationInFrames={30} fps={FPS} width={1920} height={1080} />
  </>
);
