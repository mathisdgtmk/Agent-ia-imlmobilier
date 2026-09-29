import React from 'react';

export const DESIGN_W = 1920;
export const DESIGN_H = 1080;

/**
 * Un « monde » dessiné une seule fois en 1920 × 1080 puis recadré pour chaque format :
 *  - horizontal : le monde remplit l'image ;
 *  - vertical   : le monde est mis à l'échelle (scaleV) et le point `focus` est placé en (anchor.x·w, anchor.y·h).
 * `extend` = les décors s'étendent au-delà du cadre (murs, sol, ciel) pour remplir un écran vertical.
 */
export const worldTransform = (opts: {
  w: number;
  h: number;
  vertical: boolean;
  focus?: [number, number]; // point du monde (px 1920×1080)
  anchor?: [number, number]; // position à l'écran (fractions)
  scaleV?: number; // échelle en vertical (1 = hauteur du monde = hauteur écran / 1080·…)
  zoom?: number; // zoom caméra additionnel
}) => {
  const {w, h, vertical, focus = [960, 540], anchor = [0.5, 0.5], scaleV = 0.68, zoom = 1} = opts;
  const base = vertical ? scaleV * (w / 1080) : w / DESIGN_W;
  const s = base * zoom;
  const tx = anchor[0] * w - focus[0] * s;
  const ty = anchor[1] * h - focus[1] * s;
  return {s, tx, ty};
};

export const World: React.FC<{
  w: number;
  h: number;
  vertical: boolean;
  focus?: [number, number];
  anchor?: [number, number];
  scaleV?: number;
  zoom?: number;
  children: React.ReactNode;
  html?: React.ReactNode; // calque HTML aligné sur le monde (écrans, interfaces)
}> = ({w, h, vertical, focus, anchor, scaleV, zoom, children, html}) => {
  const {s, tx, ty} = worldTransform({w, h, vertical, focus, anchor, scaleV, zoom});
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: DESIGN_W,
        height: DESIGN_H,
        transformOrigin: '0 0',
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s})`,
        willChange: 'transform',
      }}
    >
      <svg width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {children}
      </svg>
      {html}
    </div>
  );
};
