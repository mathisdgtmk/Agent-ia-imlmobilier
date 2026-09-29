let ctx: CanvasRenderingContext2D | null = null;

export const measure = (text: string, font: string): number => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return text.length * 10;
  ctx.font = font;
  return ctx.measureText(text).width;
};

/** Coupe un texte en lignes (mesures réelles avec la police chargée) → mise en page déterministe des bulles de chat. */
export const wrap = (text: string, font: string, maxW: number): {lines: string[]; width: number} => {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (!cur || measure(test, font) <= maxW) cur = test;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  const width = Math.max(...lines.map((l) => measure(l, font)));
  return {lines, width};
};
