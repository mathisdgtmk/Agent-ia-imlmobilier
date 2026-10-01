import React from 'react';
import {AbsoluteFill, random, staticFile, useCurrentFrame} from 'remotion';
import {BRAND} from '../config/brand';
import {useLayout} from '../lib/layout';
import {NF, NF_BIG, NF_TECH} from './type';
import {Letters, LettersMode} from './fx';
import {measure} from '../ui/textLayout';
import {clamp01, expoOut, flashAt, lerp, pr, smooth} from './motion';
import {DURATION_F, FPS, SCENE_IDS, SceneId, scene} from './timeline';

export const INK = '#050505';
export const PAPER = '#F5F5F3';

export const useT = () => useCurrentFrame() / FPS;

/** Affiche ses enfants seulement dans la fenêtre [a, b[ (secondes). */
export const Win: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const t = useT();
  return t >= a - 1e-6 && t < b ? <>{children}</> : null;
};

// ------------------------------------------------------------------ révélation « rideau » (masque)
/** Le contenu monte (ou descend / glisse) depuis un masque ; `out` = [début, durée] de la sortie. */
export const Reveal: React.FC<{
  t: number;
  a: number;
  d?: number;
  dir?: 'up' | 'down' | 'left' | 'right';
  out?: [number, number];
  children: React.ReactNode;
  style?: React.CSSProperties;
  ease?: (n: number) => number;
}> = ({t, a, d = 0.75, dir = 'up', out, children, style, ease = expoOut}) => {
  const p = pr(t, a, d, ease);
  const o = out ? pr(t, out[0], out[1], smooth) : 0;
  const k = (1 - p) * 122 - o * 122; // % : +108 (caché dessous) → 0 → -108 (caché dessus)
  const tr =
    dir === 'up' ? `translateY(${k}%)` : dir === 'down' ? `translateY(${-k}%)` : dir === 'left' ? `translateX(${k}%)` : `translateX(${-k}%)`;
  return (
    <div style={{display: 'block', overflow: 'hidden', padding: '0.14em 0.24em', margin: '-0.14em -0.24em', ...style}}>
      <div style={{transform: tr, willChange: 'transform'}}>{children}</div>
    </div>
  );
};

// ------------------------------------------------------------------ titres
export type HLine = {
  text: string;
  kind?: 'solid' | 'outline' | 'roman';
  /** instant (s) auquel une ligne « outline » se remplit de blanc (balayage) */
  fillAt?: number;
};

const FONT = {
  italic: (px: number) => `400 ${px}px "${NF_BIG}"`,
  roman: (px: number) => `400 ${px}px "${NF_BIG}"`,
};

/**
 * Titre en lignes qui montent une à une depuis un masque. La taille est réduite automatiquement pour que la
 * ligne la plus longue reste dans `maxWidth`. `kind: 'outline'` = lettres en contour ; `fillAt` les remplit en balayage.
 */
export const Headline: React.FC<{
  lines: HLine[];
  t: number;
  a: number;
  step?: number;
  size: number;
  maxWidth: number;
  align?: 'center' | 'left';
  color?: string;
  lineHeight?: number;
  /** [début, durée] de la sortie (toutes les lignes, en cascade) */
  out?: [number, number];
  outStep?: number;
  /** animation lettre par lettre en 3D (au lieu du rideau) : drop · fly · zoom · flip · slam */
  fx?: LettersMode;
  per?: number;
}> = ({lines, t, a, step = 0.6, size, maxWidth, align = 'center', color = '#fff', lineHeight = 1.02, out, outStep = 0.1, fx, per = 0.03}) => {
  const up = lines.map((l) => ({...l, text: l.text.toUpperCase()}));
  const widest = Math.max(...up.map((l) => measure(l.text, FONT.roman(size)) - l.text.length * 0.015 * size));
  const fs = widest > maxWidth ? size * (maxWidth / widest) : size;
  const sw = Math.max(1.6, fs * 0.017);
  return (
    <div style={{textAlign: align, color, fontFamily: NF.big, fontSize: fs, lineHeight, letterSpacing: '-0.015em'}}>
      {up.map((l, i) => {
        const kind = l.kind ?? 'solid';
        const font: React.CSSProperties = {fontWeight: 400};
        const outline: React.CSSProperties = {color: 'transparent', WebkitTextStroke: `${sw}px ${color}`};
        const fill = l.fillAt !== undefined ? pr(t, l.fillAt, 0.55, smooth) : kind === 'outline' ? 0 : 1;
        if (fx) {
          const la = a + i * step;
          const lo = out ? out[0] + i * outStep : undefined;
          const L = (o?: boolean) => <Letters text={l.text} t={t} a={la} per={per} dur={0.7} mode={fx} seed={`h${i}`} size={fs} out={lo} outPer={0.012} outline={o ? {width: sw, color} : undefined} />;
          return (
            <div key={i} style={{perspective: fs * 7, height: fs * lineHeight, whiteSpace: 'nowrap'}}>
              <div style={{position: 'relative', display: 'inline-block', ...font}}>
                {kind === 'outline' ? (
                  <>
                    {L(true)}
                    {fill > 0 && <span style={{position: 'absolute', left: 0, top: 0, clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)`}}>{L(false)}</span>}
                  </>
                ) : (
                  L(false)
                )}
              </div>
            </div>
          );
        }
        return (
          <Reveal key={i} t={t} a={a + i * step} d={0.8} out={out ? [out[0] + i * outStep, 0.45] : undefined}>
            <div style={{position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', ...font}}>
              {kind === 'outline' ? (
                <>
                  <span style={outline}>{l.text}</span>
                  {fill > 0 && (
                    <span style={{position: 'absolute', left: 0, top: 0, clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)`}}>{l.text}</span>
                  )}
                </>
              ) : (
                l.text
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
};

/** Ligne en capitales espacées qui se réduit pour tenir dans `maxWidth`. */
export const Caps: React.FC<{
  text: string;
  size: number;
  maxWidth?: number;
  spacing?: number; // em
  weight?: number;
  family?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({text, size, maxWidth, spacing = 0.24, weight = 400, family = NF.tech, color, style}) => {
  const fam = family.split(',')[0].replace(/"/g, '');
  let fs = size;
  if (maxWidth) {
    const wdt = measure(text, `${weight} ${size}px "${fam}"`) + text.length * spacing * size;
    if (wdt > maxWidth) fs = size * (maxWidth / wdt);
  }
  return (
    <div style={{fontFamily: family, fontWeight: weight, fontSize: fs, letterSpacing: `${spacing}em`, whiteSpace: 'nowrap', marginRight: `-${spacing}em`, color, ...style}}>
      {text}
    </div>
  );
};

// ------------------------------------------------------------------ dessin au trait
export const Draw: React.FC<{d: string; p: number; stroke?: string; width?: number; fill?: string; opacity?: number; cap?: 'round' | 'butt'}> = ({
  d,
  p,
  stroke = '#fff',
  width = 2,
  fill = 'none',
  opacity = 1,
  cap = 'round',
}) => (
  <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(p)} fill={fill} stroke={stroke} strokeWidth={width} strokeLinecap={cap} strokeLinejoin="round" opacity={opacity} />
);

// ------------------------------------------------------------------ logo
/** Monogramme : cercle, toit, étincelle « IA » — tracé au trait. */
export const NoirMark: React.FC<{size: number; p: number; color?: string}> = ({size, p, color = '#fff'}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{display: 'block', overflow: 'visible'}}>
    <circle cx="32" cy="32" r="29.5" fill="none" stroke={color} strokeWidth="1.6" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(p * 1.15)} strokeLinecap="round" transform="rotate(-90 32 32)" />
    <path d="M15 35 L32 19 L49 35" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((p - 0.15) * 1.4)} />
    <path
      d="M32 29.500c.7 4.600 2.400 7 7.500 7.500-5.100.5-6.800 2.900-7.500 7.500-.7-4.600-2.400-7-7.500-7.500 5.100-.5 6.800-2.900 7.500-7.500z"
      fill={color}
      opacity={clamp01((p - 0.55) * 3)}
      transform={`translate(32 36.500) scale(${0.4 + 0.6 * clamp01((p - 0.55) * 2.2)}) translate(-32 -36.500)`}
    />
  </svg>
);

/** Nom de la solution en deux lignes : espacement qui s'ouvre + balayage de lumière. `k` = échelle. */
export const NoirWordmark: React.FC<{t: number; a: number; k?: number; color?: string}> = ({t, a, k = 1, color = '#fff'}) => {
  const p1 = pr(t, a, 0.9);
  const p2 = pr(t, a + 0.35, 1.0);
  const sweep = pr(t, a + 0.5, 1.3, smooth);
  const x = lerp(-30, 130, sweep);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 * k}}>
      <div
        style={{
          fontFamily: NF.tech,
          fontWeight: 400,
          fontSize: 34 * k,
          letterSpacing: `${lerp(0.8, 0.26, p1)}em`,
          marginRight: `-${lerp(0.8, 0.26, p1)}em`,
          color,
          opacity: p1,
          filter: p1 < 1 ? `blur(${(1 - p1) * 12}px)` : undefined,
          whiteSpace: 'nowrap',
        }}
      >
        {BRAND.productName[0]}
      </div>
      <div
        style={{
          fontFamily: NF.big,
          fontWeight: 400,
          fontSize: 96 * k,
          lineHeight: 1,
          letterSpacing: `${lerp(0.3, 0.02, p2)}em`,
          marginRight: `-${lerp(0.3, 0.02, p2)}em`,
          whiteSpace: 'nowrap',
          opacity: p2,
          filter: p2 < 1 ? `blur(${(1 - p2) * 14}px)` : undefined,
          backgroundImage: `linear-gradient(100deg, #fff 0%, #fff ${x - 8}%, rgba(255,255,255,0.3) ${x + 8}%, rgba(255,255,255,0.3) 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {BRAND.productName[1]}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ éclairs & transitions
/** Éclair blanc (ou noir) très bref sur les instants donnés. */
export const Flash: React.FC<{times: number[]; len?: number; color?: string; max?: number}> = ({times, len = 0.1, color = '#fff', max = 1}) => {
  const t = useT();
  const o = flashAt(t, times, len) * max;
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};

/** Volets verticaux qui recouvrent l'écran avant le temps `at` (la coupe a lieu sur le temps) puis le dévoilent. */
export const Shutter: React.FC<{at: number; color: string; n?: number; dir?: 'down' | 'up'; before?: number; after?: number}> = ({at, color, n = 6, dir = 'down', before = 0.26, after = 0.3}) => {
  const t = useT();
  const {w, h} = useLayout();
  if (t < at - before - 0.05 || t > at + after + 0.2) return null;
  const bw = w / n;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const j = dir === 'down' ? i : n - 1 - i;
        const c = pr(t, at - before + j * 0.02, before - 0.04, smooth); // couvre
        const u = pr(t, at + j * 0.012, after - 0.04, expoOut); // dévoile : démarre net sur le temps (le gros du changement tombe pile avec l'impact)
        const top = u * h;
        const height = (c - u) * h;
        if (height <= 0) return null;
        return <div key={i} style={{position: 'absolute', left: i * bw - 0.5, width: bw + 1, top: dir === 'down' ? top : h - top - height, height, background: color}} />;
      })}
    </AbsoluteFill>
  );
};

/** Bandes horizontales qui balaient l'écran d'un côté à l'autre (changement de plan). */
export const SliceWipe: React.FC<{at: number; color: string; n?: number; dur?: number}> = ({at, color, n = 7, dur = 0.5}) => {
  const t = useT();
  const {w, h} = useLayout();
  if (t < at - dur * 0.55 || t > at + dur * 0.55 + 0.1) return null;
  const bh = h / n;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const k = pr(t, at - dur * 0.55 + i * 0.03, dur * 0.5, smooth); // entrée (pairs : depuis la gauche, impairs : depuis la droite)
        const o = pr(t, at + i * 0.03, dur * 0.5, smooth); // sortie par le côté opposé
        const x = (i % 2 ? w : -w) * (1 - k) + (i % 2 ? -w : w) * o;
        return <div key={i} style={{position: 'absolute', top: i * bh - 0.5, height: bh + 1, left: 0, width: w, background: color, transform: `translateX(${x}px)`}} />;
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ éléments de décor
/** Anneau qui s'étend et s'estompe (onde de choc / sonar). */
export const Ring: React.FC<{t: number; a: number; size: number; d?: number; color?: string; width?: number; x?: number; y?: number}> = ({t, a, size, d = 1.2, color = '#fff', width = 2, x = 0, y = 0}) => {
  const p = pr(t, a, d, expoOut);
  if (t < a || p >= 1) return null;
  const s = size * (0.08 + 0.92 * p);
  return <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', border: `${width}px solid ${color}`, opacity: (1 - p) * 0.9, pointerEvents: 'none'}} />;
};

/** Poussière / paillettes monochromes qui montent doucement. */
export const Specks: React.FC<{t: number; n?: number; color?: string; seed?: string; opacity?: number}> = ({t, n = 40, color = '#fff', seed = 'sp', opacity = 0.5}) => {
  const {w, h, u} = useLayout();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const x = random(`${seed}x${i}`) * w;
        const sp = 8 + random(`${seed}s${i}`) * 26;
        const y0 = random(`${seed}y${i}`) * h;
        const y = (((y0 - t * sp * u) % h) + h) % h;
        const r = (0.8 + random(`${seed}r${i}`) * 1.8) * u;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.6 + random(`${seed}t${i}`) * 1.4) + i));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: '50%', background: color, opacity: opacity * tw * (0.3 + 0.7 * random(`${seed}o${i}`))}} />;
      })}
    </AbsoluteFill>
  );
};

/** Repères de cadre (croix aux angles) : détail éditorial. */
export const Crosshair: React.FC<{x: number; y: number; size: number; color?: string; p?: number; width?: number}> = ({x, y, size, color = '#fff', p = 1, width = 1.5}) => (
  <svg width={size * 2} height={size * 2} style={{position: 'absolute', left: x - size, top: y - size, overflow: 'visible', opacity: p}}>
    <line x1={size - size * p} y1={size} x2={size + size * p} y2={size} stroke={color} strokeWidth={width} />
    <line x1={size} y1={size - size * p} x2={size} y2={size + size * p} stroke={color} strokeWidth={width} />
  </svg>
);

// ------------------------------------------------------------------ curseur
export const Cursor: React.FC<{x: number; y: number; scale?: number; press?: number; color?: string; edge?: string}> = ({x, y, scale = 1, press = 0, color = '#fff', edge = '#000'}) => (
  <svg width={60 * scale} height={72 * scale} viewBox="0 0 30 36" style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `scale(${1 - 0.1 * press})`, transformOrigin: '4px 3px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))'}}>
    <path d="M4 3 L4 27 L10 21.500 L14.500 32 L19 30 L14.500 19.500 L23 19.500 Z" fill={color} stroke={edge} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

// ------------------------------------------------------------------ HUD éditorial (adapté automatiquement au fond clair/sombre)
const CHAPTERS: Record<SceneId, string> = {
  hook: 'ACCROCHE',
  problem: 'LE CONSTAT',
  solution: 'LA SOLUTION',
  features: 'LES FONCTIONS',
  local: 'ANCRAGE LOCAL',
  benefit: 'LE BÉNÉFICE',
  cta: 'PASSER À L\'ACTION',
};

export const Hud: React.FC = () => {
  const t = useT();
  const {w, h, vertical, u} = useLayout();
  const m = (vertical ? 52 : 58) * u;
  const topY = (vertical ? 120 : 46) * u;
  const botY = h - (vertical ? 250 : 46) * u;
  const total = DURATION_F / FPS;
  const fade = pr(t, 0.4, 1.0) * (1 - pr(t, total - 1.2, 0.9, smooth));
  const idx = SCENE_IDS.findIndex((id) => t >= scene(id).start && t < scene(id).end);
  const cur = SCENE_IDS[Math.max(0, idx)];
  const tcs = Math.floor(Math.min(t, total - 0.01));
  const style: React.CSSProperties = {position: 'absolute', color: '#fff', fontFamily: NF.tech, fontWeight: 400, fontSize: 12.5 * u, letterSpacing: '0.2em', whiteSpace: 'nowrap'};
  const lineW = w - 2 * m;
  return (
    <AbsoluteFill style={{mixBlendMode: 'difference', opacity: fade * 0.85, pointerEvents: 'none'}}>
      <div style={{...style, left: m, top: topY}}>{BRAND.productName.join(' ')}</div>
      <div style={{...style, right: m - 0.2 * 12.5 * u, top: topY, textAlign: 'right'}}>
        {String(Math.max(0, idx) + 1).padStart(2, '0')} / 07 · {CHAPTERS[cur]}
      </div>
      <div style={{position: 'absolute', left: m, top: botY, width: lineW, height: 1, background: 'rgba(255,255,255,0.32)'}} />
      <div style={{position: 'absolute', left: m, top: botY - 0.5, width: lineW * clamp01(t / total), height: 2, background: '#fff'}} />
      {SCENE_IDS.map((id) => (
        <div key={id} style={{position: 'absolute', left: m + lineW * (scene(id).start / total) - 0.5, top: botY - 5, width: 1, height: 10, background: '#fff', opacity: 0.8}} />
      ))}
      <div style={{...style, left: m, top: botY + 16 * u, fontFamily: NF.ui, letterSpacing: '0.14em', fontSize: 14 * u}}>
        {`${String(Math.floor(tcs / 60)).padStart(2, '0')}:${String(tcs % 60).padStart(2, '0')}`}
      </div>
      <div style={{...style, right: m, top: botY + 16 * u, fontFamily: NF.ui, letterSpacing: '0.14em', fontSize: 14 * u}}>14°36′N · 61°04′O</div>
    </AbsoluteFill>
  );
};

/** Grain de pellicule (texture fournie) en superposition. */
export const NoirGrain: React.FC<{opacity?: number}> = ({opacity = 0.16}) => {
  const f = useCurrentFrame();
  const step = Math.floor(f / 2);
  const k = step % 3;
  const ox = Math.floor(random(`ng${step}`) * 512);
  const oy = Math.floor(random(`nh${step}`) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(`textures/grain${k}.png`)})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: 'overlay',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export const NoirVignette: React.FC<{strength?: number}> = ({strength = 0.22}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 76% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none', mixBlendMode: 'multiply'}} />
);
