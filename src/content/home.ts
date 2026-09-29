import {
  BellRing,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  Clock,
  FileStack,
  Hourglass,
  Moon,
  Repeat,
  SlidersHorizontal,
  Timer,
  TrendingUp,
  UserCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { images, type SiteImage } from "@/config/images";

/* ───────────── Section 1 — Accueil ───────────── */

export const hero = {
  title: "L’intelligence artificielle au service de votre agence immobilière en Martinique.",
  subtitle:
    "Ne laissez plus aucune demande client sans réponse. Automatisez vos échanges, qualifiez vos prospects et libérez du temps pour développer votre activité immobilière.",
  primaryCta: { label: "Demander une démonstration", href: "#contact" },
  secondaryCta: { label: "Découvrir notre agent IA", href: "#agent" },
  note: "Une solution intelligente pensée pour les professionnels de l’immobilier en Martinique.",
};

/* ───────────── Section 2 — Problèmes ───────────── */

export type IconItem = { icon: LucideIcon; title: string; text?: string };

export const problems = {
  title: "Et si votre agence pouvait travailler plus intelligemment ?",
  items: [
    {
      icon: Clock,
      title: "Des demandes clients qui arrivent à toute heure.",
      text: "Le soir, le week-end, pendant une visite : les messages n’attendent pas l’ouverture de l’agence.",
    },
    {
      icon: Hourglass,
      title: "Des prospects qui attendent trop longtemps une réponse.",
      text: "Un acheteur sans réponse continue ses recherches ailleurs.",
    },
    {
      icon: Repeat,
      title: "Des appels et messages répétitifs.",
      text: "Disponibilité d’un bien, secteurs couverts, documents à fournir : les mêmes questions reviennent chaque jour.",
    },
    {
      icon: CalendarClock,
      title: "Des rendez-vous difficiles à organiser.",
      text: "Trouver un créneau qui convient à chacun demande souvent plusieurs échanges.",
    },
    {
      icon: FileStack,
      title: "Du temps perdu sur des tâches administratives.",
      text: "Saisie des demandes, relances, transmission des informations à l’équipe.",
    },
    {
      icon: BellRing,
      title: "Des opportunités commerciales qui peuvent passer inaperçues.",
      text: "Une demande noyée dans une boîte de réception, c’est parfois un mandat qui s’éloigne.",
    },
  ] satisfies IconItem[],
  closing: "Votre temps est précieux. Votre agent IA vous aide à mieux le consacrer à vos clients.",
};

/* ───────────── Section 4 — Avantages ───────────── */

export const benefits = {
  title: "Une agence plus réactive. Une organisation plus fluide.",
  intro:
    "Chaque fonctionnalité se règle avec vous : ce que l’agent prend en charge, ce qu’il transmet et à quel moment votre équipe reprend la main.",
  items: [
    {
      icon: Moon,
      title: "Disponibilité 24 h/24",
      text: "L’agent IA peut répondre aux demandes des prospects à toute heure, selon les paramètres configurés.",
    },
    {
      icon: Zap,
      title: "Réponses instantanées",
      text: "Offrez aux prospects une première réponse rapide, même lorsque votre équipe est occupée.",
    },
    {
      icon: UserCheck,
      title: "Qualification des prospects",
      text: "Recueillez les informations essentielles pour mieux comprendre les attentes des futurs acheteurs ou locataires.",
    },
    {
      icon: CalendarCheck,
      title: "Gestion des rendez-vous",
      text: "Facilitez la prise de rendez-vous et l’organisation des visites, si votre agent est connecté à un agenda compatible.",
    },
    {
      icon: Timer,
      title: "Gain de temps",
      text: "Automatisez certaines tâches répétitives pour permettre à vos collaborateurs de se concentrer sur leur cœur de métier.",
    },
    {
      icon: TrendingUp,
      title: "Développement commercial",
      text: "Améliorez le suivi des demandes et réduisez les risques de laisser des prospects sans réponse.",
    },
  ] satisfies Required<IconItem>[],
};

/* ───────────── Section 5 — Martinique ───────────── */

export const martinique = {
  title: "Une solution pensée pour les réalités de l’immobilier martiniquais.",
  paragraphs: [
    "Le marché immobilier martiniquais possède ses propres spécificités. Chaque agence doit pouvoir répondre rapidement à des profils variés, qu’il s’agisse de résidents, d’investisseurs ou de personnes qui souhaitent s’installer sur l’île.",
    "Notre agent IA est conçu pour être personnalisable selon les besoins de votre agence, vos biens, vos secteurs géographiques et votre manière de travailler.",
  ],
  sectorsLabel: "Des réponses personnalisables par secteur",
  sectorsHint: "Sélectionnez une commune pour voir ce que l’agent peut préciser une fois configuré.",
  /** {sector} est remplacé par la commune sélectionnée, précédée de « à » ou « au » (« au Lamentin »). */
  sectorExample: [
    "Les biens de votre agence disponibles {sector}, à partir de vos annonces.",
    "Les quartiers couverts par votre équipe et le conseiller référent du secteur.",
    "Les questions à poser en priorité aux acheteurs, locataires ou investisseurs intéressés.",
  ],
  disclaimer:
    "L’agent ne connaît ni vos biens ni les spécificités locales par défaut : il s’appuie uniquement sur les informations que vous lui fournissez lors de la configuration.",
};

/* ───────────── Section 6 — Étapes ───────────── */

export const steps = {
  title: "Votre agent IA en trois étapes.",
  items: [
    {
      icon: SlidersHorizontal,
      title: "Nous configurons votre agent",
      text: "Nous adaptons l’agent IA aux informations, aux biens, aux services et aux besoins de votre agence.",
    },
    {
      icon: ClipboardList,
      title: "Votre agent accompagne vos prospects",
      text: "Une fois déployé sur les canaux compatibles, il répond aux demandes, recueille les informations et réalise les actions prévues dans sa configuration.",
    },
    {
      icon: UserCheck,
      title: "Vous gardez le contrôle",
      text: "Votre agence conserve la maîtrise des échanges et peut reprendre la main sur les demandes qui nécessitent une intervention humaine.",
    },
  ] satisfies Required<IconItem>[],
};

/* ───────────── Section 8 — Profils d'agences ───────────── */

export type Audience = {
  title: string;
  text: string;
  examples: string[];
  image: SiteImage;
};

export const audiences = {
  title: "Une solution adaptée à votre agence.",
  intro:
    "La configuration s’adapte à la taille de votre structure, à vos types de biens et à votre organisation interne.",
  items: [
    {
      title: "Agences immobilières indépendantes",
      text: "Une petite équipe qui ne peut pas être au téléphone et en visite en même temps.",
      examples: ["Premières réponses hors horaires", "Transmission des demandes au bon conseiller"],
      image: images.audiences.independent,
    },
    {
      title: "Réseaux d’agences immobilières",
      text: "Plusieurs agences, plusieurs secteurs, un même niveau de réponse.",
      examples: ["Orientation vers l’agence du secteur", "Ton et messages harmonisés"],
      image: images.audiences.network,
    },
    {
      title: "Agences spécialisées dans la location",
      text: "Un grand volume de demandes, souvent sur les mêmes points.",
      examples: ["Questions fréquentes sur les dossiers", "Recueil des critères des locataires"],
      image: images.audiences.rental,
    },
    {
      title: "Vente et biens de prestige",
      text: "Une clientèle exigeante qui attend une réponse soignée, y compris depuis l’étranger.",
      examples: ["Échanges discrets et personnalisés", "Qualification avant mise en relation"],
      image: images.audiences.prestige,
    },
  ] satisfies Audience[],
};

/* ───────────── Section 9 — FAQ ───────────── */

export const faq = {
  title: "Questions fréquentes",
  items: [
    {
      q: "Qu’est-ce qu’un agent IA immobilier ?",
      a: "C’est un assistant conversationnel configuré pour votre agence. Il répond aux questions fréquentes, recueille le projet des prospects (achat ou location, secteur, budget, calendrier) et transmet les demandes à votre équipe. Il s’appuie sur les informations que vous lui fournissez et se présente comme un assistant virtuel.",
    },
    {
      q: "Mon agent IA peut-il répondre la nuit ?",
      a: "Oui, lorsqu’il est déployé sur un canal en ligne comme votre site web, il peut répondre à toute heure selon les paramètres configurés. Vous décidez de ce qu’il traite seul et de ce qu’il transmet à votre équipe à la réouverture de l’agence.",
    },
    {
      q: "L’agent peut-il présenter les biens de mon agence ?",
      a: "Oui, à condition de lui fournir vos annonces ou de le relier à une source de données compatible. Sans ces informations, il ne présente aucun bien. Les modalités de connexion avec vos outils actuels sont étudiées lors de la démonstration.",
    },
    {
      q: "Peut-il organiser des visites ?",
      a: "S’il est connecté à un agenda compatible, il peut proposer des créneaux de rendez-vous. Sans connexion à un agenda, il recueille les disponibilités du prospect et transmet la demande à un conseiller, qui confirme la visite.",
    },
    {
      q: "Est-il possible de le personnaliser ?",
      a: "Oui. Le ton, le message d’accueil, les secteurs couverts, les types de biens, les questions de qualification et les règles de transmission à votre équipe sont définis avec vous.",
    },
    {
      q: "L’agent IA remplace-t-il un conseiller immobilier ?",
      a: "Non. Il prend en charge le premier contact et une partie des tâches répétitives. Le conseil, les visites, la négociation et l’accompagnement de vos clients restent assurés par votre équipe, qui peut reprendre la main sur une conversation à tout moment.",
    },
    {
      q: "Comment intégrer l’agent à mon agence ?",
      a: "Le point de départ est généralement votre site web, via un module de discussion. D’autres canaux peuvent être envisagés selon leur compatibilité : ils sont étudiés au cas par cas lors de la démonstration. Nous configurons ensuite l’agent avec vous et validons ses réponses avant sa mise en service.",
    },
    {
      q: "Combien coûte la mise en place ?",
      a: "Le tarif dépend de la configuration, des canaux utilisés et du volume de demandes de votre agence. Il vous est communiqué sur devis, après un premier échange. Demandez une démonstration pour recevoir une proposition adaptée.",
    },
    {
      q: "Puis-je demander une démonstration avant de m’engager ?",
      a: "Oui. Remplissez le formulaire de contact : nous vous présentons l’agent et ce qu’il pourrait faire pour votre agence, sans engagement de votre part.",
    },
  ],
};

/* ───────────── Section 10 — Contact ───────────── */

export const contact = {
  title: "Et si votre agence immobilière passait à l’ère de l’intelligence artificielle ?",
  text: "Découvrez comment un agent IA personnalisé peut vous aider à mieux gérer vos demandes clients, à gagner du temps et à structurer votre développement commercial.",
  submitLabel: "Demander ma démonstration personnalisée",
  reassurance: [
    "Démonstration sans engagement",
    "Configuration adaptée à votre agence",
    "Vos données ne servent qu’à vous recontacter",
  ],
};
