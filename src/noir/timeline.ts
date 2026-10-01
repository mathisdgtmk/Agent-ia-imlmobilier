import plan from '../../data/noir.json';

/**
 * Plan de montage « Noir & Blanc » : lu dans data/noir.json (le même fichier que la bande-son).
 * Tout est exprimé en TEMPS DE MUSIQUE : 100 BPM → 1 beat = 0,6 s, 1 mesure = 2,4 s.
 */
export const FPS: number = plan.fps;
export const BPM: number = plan.bpm;
export const BEAT = 60 / BPM;
export const BAR = BEAT * 4;
export const DURATION_F = Math.round(plan.bars * BAR * FPS);

/** beats → secondes */
export const bt = (b: number) => b * BEAT;

type Cue = {id: string; b?: number; bs?: number[]; sfx?: string; gain?: number; shake?: number; dur?: number};
const CUES = plan.cues as Cue[];

/** Instant (s) d'un repère nommé (le premier s'il y en a plusieurs). */
export const cue = (id: string): number => {
  const c = CUES.find((x) => x.id === id);
  if (!c) throw new Error(`Repère inconnu : ${id}`);
  return bt(c.bs ? c.bs[0] : (c.b as number));
};
/** Tous les instants (s) d'un repère à répétition (ex. les tics du compteur). */
export const cueList = (id: string): number[] => {
  const c = CUES.find((x) => x.id === id);
  if (!c) throw new Error(`Repère inconnu : ${id}`);
  return (c.bs ?? [c.b as number]).map(bt);
};

export type SceneId = 'hook' | 'problem' | 'solution' | 'features' | 'local' | 'benefit' | 'cta';
export const scene = (id: SceneId) => {
  const s = plan.scenes.find((x) => x.id === id)!;
  return {start: bt(s.b), end: bt(s.b + s.len), len: bt(s.len)};
};
export const SCENE_IDS = plan.scenes.map((s) => s.id) as SceneId[];

/** Secousses de caméra : un impact = une secousse qui s'amortit. */
export const SHAKES = CUES.filter((c) => c.shake).map((c) => ({t: bt(c.b as number), amp: c.shake as number}));
