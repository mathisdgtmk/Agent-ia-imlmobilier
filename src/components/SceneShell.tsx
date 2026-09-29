import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {FPS, SceneId, sceneById, sec} from '../lib/timeline';
import {prog, easeInOut} from '../lib/anim';

type Ctx = {absFrom: number; start: number; end: number};
const SceneCtx = createContext<Ctx>({absFrom: 0, start: 0, end: 60});

/** Temps (s) depuis le début NOMINAL de la scène (négatif pendant le préchauffage). */
export const useSceneT = () => {
  const {absFrom, start} = useContext(SceneCtx);
  const f = useCurrentFrame();
  return (f + absFrom) / FPS - start;
};
/** Temps absolu (s) depuis le début de la vidéo. */
export const useAbsT = () => {
  const {absFrom} = useContext(SceneCtx);
  const f = useCurrentFrame();
  return (f + absFrom) / FPS;
};
export const useSceneInfo = () => useContext(SceneCtx);

type Props = {
  id: SceneId;
  /** secondes de préchauffage avant le début nominal (fondu entrant) */
  pre?: number;
  /** secondes de prolongation après la fin nominale (fondu sortant) */
  post?: number;
  children: React.ReactNode;
};

export const SceneShell: React.FC<Props> = ({id, pre = 0.4, post = 0.4, children}) => {
  const s = sceneById(id);
  const from = sec(s.start - pre);
  const dur = sec(s.end + post) - from;
  return (
    <Sequence from={from} durationInFrames={dur} layout="none" name={`Scène ${id}`}>
      <SceneCtx.Provider value={{absFrom: from, start: s.start, end: s.end}}>
        <Fader pre={pre} post={post} dur={s.end - s.start}>
          {children}
        </Fader>
      </SceneCtx.Provider>
    </Sequence>
  );
};

/** Fondu d'entrée/sortie de la scène (les transitions "premium" se superposent dans Transitions.tsx). */
const Fader: React.FC<{pre: number; post: number; dur: number; children: React.ReactNode}> = ({
  pre,
  post,
  dur,
  children,
}) => {
  const t = useSceneT();
  const fin = prog(t, -pre, 0.05, easeInOut);
  const fout = 1 - prog(t, dur - 0.05, dur + post, easeInOut);
  return <AbsoluteFill style={{opacity: Math.min(fin, fout)}}>{children}</AbsoluteFill>;
};
