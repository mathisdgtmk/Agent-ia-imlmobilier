import {continueRender, delayRender, staticFile} from 'remotion';

const FACES: {family: string; weight: number; style: string; file: string}[] = [
  {family: 'Playfair Display', weight: 400, style: 'normal', file: 'playfair-display-latin-400-normal.woff2'},
  {family: 'Playfair Display', weight: 500, style: 'normal', file: 'playfair-display-latin-500-normal.woff2'},
  {family: 'Playfair Display', weight: 600, style: 'normal', file: 'playfair-display-latin-600-normal.woff2'},
  {family: 'Playfair Display', weight: 700, style: 'normal', file: 'playfair-display-latin-700-normal.woff2'},
  {family: 'Playfair Display', weight: 400, style: 'italic', file: 'playfair-display-latin-400-italic.woff2'},
  {family: 'Playfair Display', weight: 500, style: 'italic', file: 'playfair-display-latin-500-italic.woff2'},
  {family: 'Playfair Display', weight: 600, style: 'italic', file: 'playfair-display-latin-600-italic.woff2'},
  {family: 'Playfair Display', weight: 700, style: 'italic', file: 'playfair-display-latin-700-italic.woff2'},
  {family: 'Cinzel', weight: 400, style: 'normal', file: 'cinzel-latin-400-normal.woff2'},
  {family: 'Cinzel', weight: 500, style: 'normal', file: 'cinzel-latin-500-normal.woff2'},
  {family: 'Cinzel', weight: 600, style: 'normal', file: 'cinzel-latin-600-normal.woff2'},
  {family: 'Cinzel', weight: 700, style: 'normal', file: 'cinzel-latin-700-normal.woff2'},
  {family: 'Cormorant Garamond', weight: 300, style: 'normal', file: 'cormorant-garamond-latin-300-normal.woff2'},
  {family: 'Cormorant Garamond', weight: 400, style: 'normal', file: 'cormorant-garamond-latin-400-normal.woff2'},
  {family: 'Cormorant Garamond', weight: 500, style: 'normal', file: 'cormorant-garamond-latin-500-normal.woff2'},
  {family: 'Cormorant Garamond', weight: 600, style: 'normal', file: 'cormorant-garamond-latin-600-normal.woff2'},
  {family: 'Cormorant Garamond', weight: 400, style: 'italic', file: 'cormorant-garamond-latin-400-italic.woff2'},
  {family: 'Cormorant Garamond', weight: 500, style: 'italic', file: 'cormorant-garamond-latin-500-italic.woff2'},
  {family: 'Inter', weight: 400, style: 'normal', file: 'inter-latin-400-normal.woff2'},
  {family: 'Inter', weight: 500, style: 'normal', file: 'inter-latin-500-normal.woff2'},
  {family: 'Inter', weight: 600, style: 'normal', file: 'inter-latin-600-normal.woff2'},
  {family: 'Inter', weight: 700, style: 'normal', file: 'inter-latin-700-normal.woff2'},
  {family: 'Montserrat', weight: 500, style: 'normal', file: 'montserrat-latin-500-normal.woff2'},
  {family: 'Montserrat', weight: 600, style: 'normal', file: 'montserrat-latin-600-normal.woff2'},
  {family: 'Montserrat', weight: 700, style: 'normal', file: 'montserrat-latin-700-normal.woff2'},
  // Version « Noir & Blanc » : Arial Black → Archivo Black (équivalent libre), MACHINE → Krona One (équivalent libre), interfaces → Arimo (= Arial)
  {family: 'Archivo Black', weight: 400, style: 'normal', file: 'archivo-black-latin-400-normal.woff2'},
  {family: 'Krona One', weight: 400, style: 'normal', file: 'krona-one-latin-400-normal.woff2'},
  {family: 'Arimo', weight: 400, style: 'normal', file: 'arimo-latin-400-normal.woff2'},
  {family: 'Arimo', weight: 700, style: 'normal', file: 'arimo-latin-700-normal.woff2'},
];

let started = false;

/** Charge les polices locales (public/fonts) avant tout rendu d'image. */
export const loadFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender('Chargement des polices');
  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile('fonts/' + f.file)}) format('woff2')`, {
        weight: String(f.weight),
        style: f.style,
      });
      await face.load();
      (document.fonts as any).add(face);
    }),
  )
    .catch((e) => console.error('Police non chargée', e))
    .finally(() => continueRender(handle));
};
