import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFonts} from '../lib/fonts';
import {Person, PersonBack, LOOKS} from '../illustrations/People';

loadFonts();

/** Outil de mise au point : affiche les composants d'illustration côte à côte. */
export const Gallery: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(#1a2748,#0b1226)'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <g transform="translate(200 120) scale(3.6)"><Person look={LOOKS.agent} id="g1" pose={{l: [6, 8], r: [-6, -8]}} /></g>
      <g transform="translate(520 120) scale(3.6)"><Person look={LOOKS.clientF} id="g2" pose={{l: [4, 6], r: [-10, -30]}} /></g>
      <g transform="translate(840 120) scale(3.6)"><Person look={LOOKS.clientM} id="g3" pose={{l: [6, 6], r: [-40, -60]}} /></g>
      <g transform="translate(1160 120) scale(3.6)"><Person look={LOOKS.agentF} id="g4" pose={{l: [6, 6], r: [-8, -8]}} /></g>
      <g transform="translate(1500 200) scale(3.6)"><PersonBack look={LOOKS.clientM} id="g5" /></g>
    </svg>
  </AbsoluteFill>
);
