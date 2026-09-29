/**
 * MÉDIAS RÉELS (facultatif) — remplacer une illustration par une photo ou une vidéo.
 *
 * Par défaut tout est `null` : la vidéo utilise ses illustrations vectorielles originales.
 * Pour utiliser une vraie image, placez le fichier dans `public/media/` puis indiquez‑le ici, par exemple :
 *
 *   hook: {kind: 'video', src: 'media/villa-aerienne.mp4'},
 *   fdf:  {kind: 'image', src: 'media/fort-de-france.jpg', zoom: 1.18},
 *
 * Le média couvre l'illustration de la scène ; les textes, interfaces et sous‑titres restent au‑dessus.
 * Les vidéos doivent durer au moins autant que le plan (quelques secondes). Un léger étalonnage (bleu nuit + reflets dorés) harmonise les images avec le reste de la vidéo.
 * Utilisez uniquement des médias dont la licence autorise l'usage commercial.
 */
export type MediaSlot = {
  kind: 'image' | 'video';
  /** chemin relatif au dossier public/, ex. 'media/villa.jpg' */
  src: string;
  /** zoom lent de type « Ken Burns » à la fin du plan (1 = aucun) */
  zoom?: number;
  /** point de cadrage (0–1, 0–1) pour recadrer l'image */
  focus?: [number, number];
  /** intensité de l'étalonnage de marque (0 à 1) */
  grade?: number;
} | null;

export type MediaId =
  | 'hook' // scène 1 : vue aérienne de la villa
  | 'problem' // scène 2 : agent au bureau
  | 'timesaving' // scène 4 (séquence 4) : agent serein en agence
  | 'fdf' | 'ti' | 'lam' | 'coast' | 'villas' // scène 5 : Fort-de-France, Trois-Îlets, Lamentin, littoral, villas
  | 'agency' // scène 5 : façade de l'agence
  | 'welcome' // scène 6 : accueil des clients dans la villa
  | 'handshake'; // scène 6 : poignée de main

export const MEDIA: Record<MediaId, MediaSlot> = {
  hook: null,
  problem: null,
  timesaving: null,
  fdf: null,
  ti: null,
  lam: null,
  coast: null,
  villas: null,
  agency: null,
  welcome: null,
  handshake: null,
};
