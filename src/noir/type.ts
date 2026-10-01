/**
 * Polices de la version « Noir & Blanc » — UN SEUL ENDROIT pour les changer.
 *
 *  big  : titres, mots-chocs, chiffres, bouton   → « Arial Black »
 *  tech : étiquettes, HUD, légendes, code temps  → « MACHINE »
 *  ui   : textes des interfaces simulées         → Arial
 *
 * Arial Black (Microsoft) et MACHINE (ITC Machine) sont des polices commerciales : elles ne peuvent pas être embarquées dans ce dépôt.
 * Par défaut le rendu utilise leurs équivalents libres les plus proches (Archivo Black, Krona One, Arimo — licence SIL OFL, fichiers dans public/fonts/).
 * Pour utiliser les VRAIES polices (si vous en possédez la licence) : déposez les fichiers dans public/fonts/ (ex. ArialBlack.ttf, Machine.ttf),
 * déclarez-les dans src/lib/fonts.ts (famille « Arial Black » / « Machine ») puis mettez leur nom en tête des piles ci-dessous.
 */
export const NF = {
  big: '"Archivo Black", "Arial Black", Arial, sans-serif',
  tech: '"Krona One", "Machine", "Arial Black", sans-serif',
  ui: 'Arimo, Arial, "Helvetica Neue", sans-serif',
} as const;

/** Familles « nues » (pour les mesures de texte sur canvas) */
export const NF_BIG = 'Archivo Black';
export const NF_TECH = 'Krona One';
