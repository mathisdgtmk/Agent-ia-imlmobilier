/**
 * Conversation fictive de la section « Découvrez votre nouvel assistant ».
 * Elle se joue automatiquement quand la section devient visible.
 * `lead` : informations ajoutées à la fiche prospect après ce message.
 */

export type ShowcaseMessage = {
  from: "client" | "agent";
  text: string;
  /** Créneaux affichés sous le message (prise de rendez-vous configurée). */
  slots?: string[];
  lead?: Partial<Record<LeadField, string>>;
};

export type LeadField = "projet" | "bien" | "secteur" | "budget" | "echeance" | "suite";

export const leadFields: { key: LeadField; label: string }[] = [
  { key: "projet", label: "Projet" },
  { key: "bien", label: "Type de bien" },
  { key: "secteur", label: "Secteur" },
  { key: "budget", label: "Budget" },
  { key: "echeance", label: "Échéance" },
  { key: "suite", label: "Suite donnée" },
];

export const showcase = {
  title: "Découvrez votre nouvel assistant immobilier intelligent.",
  intro:
    "Voici comment l’agent accueille un prospect, précise sa recherche et prépare le travail de votre équipe. La conversation ci-contre est une simulation.",
  cta: "Je souhaite voir une démonstration.",
  points: [
    "Il pose les bonnes questions, dans l’ordre que vous avez défini.",
    "Il résume la demande dans une fiche claire pour votre équipe.",
    "Il propose un rendez-vous si un agenda compatible est connecté.",
  ],
  messages: [
    {
      from: "client",
      text: "Bonjour, je recherche une maison avec trois chambres en Martinique.",
      lead: { projet: "Achat", bien: "Maison, 3 chambres" },
    },
    {
      from: "agent",
      text: "Bonjour et bienvenue ! Je peux vous aider à préciser votre recherche. Dans quel secteur de la Martinique souhaitez-vous acheter ?",
    },
    {
      from: "client",
      text: "De préférence au Lamentin.",
      lead: { secteur: "Le Lamentin" },
    },
    { from: "agent", text: "Très bien ! Quel est votre budget approximatif ?" },
    {
      from: "client",
      text: "Autour de 350 000 €, et nous aimerions emménager début 2027.",
      lead: { budget: "≈ 350 000 €", echeance: "Début 2027" },
    },
    {
      from: "agent",
      text: "C’est noté. Un conseiller de l’agence peut vous présenter les biens correspondants. Souhaitez-vous convenir d’un rendez-vous ?",
      slots: ["Mardi à 10 h", "Mercredi à 15 h 30", "Être rappelé"],
    },
    {
      from: "client",
      text: "Mercredi à 15 h 30, parfait.",
      lead: { suite: "RDV mercredi 15 h 30" },
    },
    {
      from: "agent",
      text: "Parfait, votre demande de rendez-vous est transmise à l’agence, qui vous enverra une confirmation. Bonne journée !",
    },
  ] satisfies ShowcaseMessage[],
};
