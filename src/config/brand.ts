/**
 * MARQUE, LOGO, COORDONNÉES — éléments PROVISOIRES faciles à remplacer.
 * Voir docs/PERSONNALISATION.md
 */
export const BRAND = {
  // Nom de la solution (scène 3 et scène 7)
  productName: ['VOTRE AGENT IA', 'IMMOBILIER'],
  // Nom affiché sur l'enseigne de l'agence (scène 5) — remplacez par le nom de l'agence cliente ou laissez générique
  agencyName: 'VOTRE AGENCE',
  // Ligne sous le bouton (scène 7)
  tagline: 'Agent IA immobilier | Martinique',
  // Bouton d'appel à l'action
  ctaLabel: 'DEMANDEZ VOTRE DÉMONSTRATION',
  ctaPrompt: "Et si vous découvriez ce que l'IA peut apporter à votre agence ?",

  // Logo : laissez `null` pour le logo typographique provisoire (monogramme + nom),
  // ou indiquez un fichier placé dans public/, ex. 'brand/logo.png' (fond transparent recommandé).
  logoImage: null as string | null,
  monogram: 'IA',

  // Coordonnées affichées en scène 7 (mettre show à false pour les masquer).
  contact: {
    show: true,
    website: 'www.votre-site.fr',
    phone: '+596 6XX XX XX XX',
  },

  // Mention légale discrète (scènes 3 et 4)
  disclaimer: 'Simulation illustrative. Fonctionnalités selon configuration.',
} as const;
