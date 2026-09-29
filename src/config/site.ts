/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURATION CENTRALE DU SITE
 *  Modifiez ce fichier pour personnaliser le site sans toucher
 *  aux composants. Les valeurs entre [crochets] sont à compléter.
 * ─────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  /** Nom de la solution, affiché dans le logo, le pied de page et le SEO. */
  name: "Agent IA Immobilier",
  shortName: "Agent IA Immo",

  /** URL publique du site (sans slash final). Définie via NEXT_PUBLIC_SITE_URL en production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  locale: "fr_FR",
  region: "Martinique",

  /** Présentation courte (pied de page, JSON-LD). */
  tagline:
    "Un assistant conversationnel configuré pour les agences immobilières de Martinique : premières réponses, qualification des demandes et transmission à votre équipe.",

  /** Coordonnées — à compléter avant la mise en ligne. */
  contact: {
    email: "[contact@votre-domaine.fr]",
    phone: "[+596 6XX XX XX XX]",
    address: "[Adresse ou zone d’intervention]",
    /** Mettre à true une fois les coordonnées réelles renseignées : elles deviennent cliquables. */
    isConfigured: false,
  },

  /** Informations légales (mentions légales & politique de confidentialité). */
  legal: {
    publisherName: "[Nom et prénom ou raison sociale]",
    publisherStatus: "[Statut : entrepreneur individuel, SAS, SASU…]",
    siret: "[Numéro SIRET]",
    publisherAddress: "[Adresse du siège]",
    publicationDirector: "[Nom du directeur de la publication]",
    host: {
      name: "[Hébergeur — ex. Vercel Inc.]",
      address: "[Adresse de l’hébergeur]",
      website: "[Site de l’hébergeur]",
    },
    dataController: "[Responsable du traitement des données]",
    dpoEmail: "[adresse e-mail pour exercer vos droits]",
    /** Durée de conservation des demandes de contact. */
    retention: "3 ans à compter du dernier échange, sauf relation contractuelle ultérieure",
    lastUpdated: "29 septembre 2026",
  },

  /** Secteurs mis en avant (section Martinique + démonstration). */
  featuredSectors: [
    "Fort-de-France",
    "Le Lamentin",
    "Schœlcher",
    "Ducos",
    "Le Robert",
    "Le François",
  ],

  /** Navigation principale (ancres de la page d'accueil). */
  nav: [
    { label: "Accueil", href: "/#accueil", id: "accueil" },
    { label: "Notre agent IA", href: "/#agent", id: "agent" },
    { label: "Fonctionnalités", href: "/#fonctionnalites", id: "fonctionnalites" },
    { label: "Pour les agences", href: "/#agences", id: "agences" },
    { label: "FAQ", href: "/#faq", id: "faq" },
    { label: "Contact", href: "/#contact", id: "contact" },
  ],

  /** Réseaux sociaux (laisser vide pour masquer). */
  social: {
    linkedin: "",
    instagram: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
