import {useVideoConfig} from 'remotion';

export type Layout = {w: number; h: number; vertical: boolean; u: number};

/** u = unité de référence (1 = 1080 px du petit côté) : les tailles sont exprimées en u pour rester proportionnelles. */
export const useLayout = (): Layout => {
  const {width: w, height: h} = useVideoConfig();
  const vertical = h > w;
  return {w, h, vertical, u: Math.min(w, h) / 1080};
};
