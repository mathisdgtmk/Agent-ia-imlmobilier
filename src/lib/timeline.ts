import raw from '../data/timeline.json';

export const FPS: number = raw.fps;
export const DURATION_S: number = raw.duration;
export const DURATION_F = Math.round(FPS * DURATION_S);

export type SceneId = 'hook' | 'problem' | 'solution' | 'features' | 'local' | 'benefit' | 'cta';
export type Scene = {id: SceneId; start: number; end: number};
export type Caption = {line: string; text: string; start: number; end: number};
export type Cue = {id: string; t: number; sfx?: string; gain?: number};

export const scenes = raw.scenes as Scene[];
export const captions = raw.captions as Caption[];
export const cues = (raw as any).cues as Cue[];

export const sec = (s: number) => Math.round(s * FPS);

export const sceneById = (id: SceneId): Scene => {
  const s = scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Scène inconnue: ${id}`);
  return s;
};

/** Temps absolu (secondes) d'un repère défini dans data/cues.json. */
export const cue = (id: string): number => {
  const c = cues.find((x) => x.id === id);
  if (!c) throw new Error(`Repère inconnu: ${id} (voir data/cues.json)`);
  return c.t;
};
