/**
 * Scénario de démonstration prédéfini (aucune IA n'est appelée).
 *
 * Le moteur reconnaît quelques intentions (achat, location, visite,
 * propriétaire, secteurs…), extrait les informations utiles du message
 * (commune, type de bien, budget, délai) et pose la question suivante.
 * Tous les textes sont modifiables dans ce fichier.
 */

import { siteConfig } from "@/config/site";
import { normalize } from "@/lib/utils";
import { DEFAULT_SUGGESTIONS } from "./demo-copy";
import { withPreposition } from "./sector-utils";
import type {
  ChatProvider,
  ChatRequest,
  ChatResponse,
  DemoState,
  FlowId,
  Lead,
  LeadKey,
} from "./types";

/* ─────────────────────────── Textes ─────────────────────────── */

const PRIVACY_NOTE =
  "Pour cette démonstration, inutile de partager vos coordonnées : elles ne seraient ni utilisées ni conservées.";


const sectorsList = (() => {
  const s = siteConfig.featuredSectors.map(withPreposition);
  return s.length > 1 ? `${s.slice(0, -1).join(", ")} et ${s.at(-1)}` : s.join("");
})();

type Slot = "secteur" | "bien" | "budget" | "echeance" | "dispo";
type SlotPrompt = { question: string; suggestions: string[] };

const FLOW_SLOTS: Record<FlowId, Slot[]> = {
  achat: ["secteur", "bien", "budget", "echeance"],
  location: ["secteur", "bien", "budget", "echeance"],
  proprietaire: ["bien", "secteur", "echeance"],
  visite: ["bien", "dispo"],
};

const PROMPTS: Record<FlowId, Partial<Record<Slot, SlotPrompt>>> = {
  achat: {
    secteur: {
      question: "Dans quel secteur de la Martinique souhaitez-vous acheter ?",
      suggestions: [...siteConfig.featuredSectors],
    },
    bien: {
      question: "Quel type de bien recherchez-vous, et avec combien de chambres ?",
      suggestions: ["Maison 3 chambres", "Appartement T2", "Villa avec piscine", "Terrain"],
    },
    budget: {
      question: "Quel est votre budget approximatif ?",
      suggestions: ["Moins de 250 000 €", "250 000 à 400 000 €", "Plus de 400 000 €"],
    },
    echeance: {
      question: "Dans quel délai envisagez-vous votre achat ?",
      suggestions: ["Dès que possible", "D’ici 6 mois", "Pas de date précise"],
    },
  },
  location: {
    secteur: {
      question: "Dans quel secteur souhaitez-vous louer ?",
      suggestions: [...siteConfig.featuredSectors],
    },
    bien: {
      question: "Quel type de logement recherchez-vous ?",
      suggestions: ["Studio", "Appartement T2", "Appartement T3", "Maison"],
    },
    budget: {
      question: "Quel loyer mensuel maximum envisagez-vous, charges comprises ?",
      suggestions: ["Moins de 800 € par mois", "800 à 1 200 € par mois", "Plus de 1 200 € par mois"],
    },
    echeance: {
      question: "À partir de quand souhaitez-vous emménager ?",
      suggestions: ["Dès que possible", "Dans 1 à 3 mois", "Date flexible"],
    },
  },
  proprietaire: {
    bien: {
      question: "Quel type de bien possédez-vous ?",
      suggestions: ["Maison", "Appartement", "Villa", "Terrain"],
    },
    secteur: {
      question: "Dans quelle commune se situe-t-il ?",
      suggestions: [...siteConfig.featuredSectors],
    },
    echeance: {
      question: "Quel est votre calendrier ?",
      suggestions: ["Dès que possible", "D’ici 6 mois", "Je me renseigne"],
    },
  },
  visite: {
    bien: {
      question: "Quel bien souhaitez-vous visiter ? Indiquez sa référence ou une courte description.",
      suggestions: ["Une annonce vue sur votre site", "Je n’ai pas encore choisi"],
    },
    dispo: {
      question: "Quelles sont vos disponibilités pour un rendez-vous ?",
      suggestions: ["En semaine, le matin", "En semaine, après 17 h", "Le samedi"],
    },
  },
};

const ACKS = ["Très bien.", "C’est noté.", "Parfait.", "Merci."];

/* ─────────────────────── Extraction d'informations ─────────────────────── */

/** Les 34 communes de Martinique. */
const COMMUNES = [
  "L’Ajoupa-Bouillon", "Les Anses-d’Arlet", "Basse-Pointe", "Bellefontaine", "Le Carbet",
  "Case-Pilote", "Le Diamant", "Ducos", "Fonds-Saint-Denis", "Fort-de-France",
  "Le François", "Grand’Rivière", "Gros-Morne", "Le Lamentin", "Le Lorrain", "Macouba",
  "Le Marigot", "Le Marin", "Le Morne-Rouge", "Le Morne-Vert", "Le Prêcheur",
  "Rivière-Pilote", "Rivière-Salée", "Le Robert", "Saint-Esprit", "Saint-Joseph",
  "Saint-Pierre", "Sainte-Anne", "Sainte-Luce", "Sainte-Marie", "Schœlcher",
  "La Trinité", "Les Trois-Îlets", "Le Vauclin",
];

const COMMUNE_KEYS = COMMUNES.map((name) => ({
  name,
  key: normalize(name).replace(/^(l|le|la|les) /, ""),
})).sort((a, b) => b.key.length - a.key.length);

export function findCommune(text: string): string | null {
  const t = ` ${normalize(text)} `;
  for (const c of COMMUNE_KEYS) if (t.includes(` ${c.key} `)) return c.name;
  if (t.includes(" fdf ")) return "Fort-de-France";
  return null;
}

const NUMBER_WORDS: Record<string, number> = {
  un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6,
};

export function parseProperty(text: string): string | null {
  const t = normalize(text);
  let type: string | null = null;
  if (/\bvillas?\b/.test(t)) type = "Villa";
  else if (/\bmaisons?\b/.test(t)) type = "Maison";
  else if (/\bappart|\bappt/.test(t)) type = "Appartement";
  else if (/\bstudios?\b/.test(t)) type = "Studio";
  else if (/\bterrains?\b/.test(t)) type = "Terrain";
  else if (/\blocal\b|\blocaux\b|\bbureaux?\b|\bcommerce/.test(t)) type = "Local professionnel";

  const tMatch = t.match(/\b[tf] ?([1-7])\b/);
  const chMatch = t.match(/\b(\d|un|une|deux|trois|quatre|cinq|six)\s*chambres?\b/);
  const bedrooms = chMatch ? (NUMBER_WORDS[chMatch[1]!] ?? Number(chMatch[1])) : null;

  const parts: string[] = [];
  if (type) parts.push(type);
  else if (tMatch) parts.push("Appartement");
  if (tMatch) parts.push(`T${tMatch[1]}`);
  if (bedrooms) parts.push(`${bedrooms} chambre${bedrooms > 1 ? "s" : ""}`);
  if (/piscine/.test(t)) parts.push("avec piscine");
  if (/vue mer/.test(t)) parts.push("vue mer");

  if (!parts.length) return null;
  if (parts[1]?.startsWith("T")) return [`${parts[0]} ${parts[1]}`, ...parts.slice(2)].join(", ");
  return parts.join(", ");
}

const fmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export function parseBudget(text: string, monthly: boolean): string | null {
  const t = text.toLowerCase().replace(/\s/g, " ");
  const amounts: number[] = [];
  const re = /(\d{1,3}(?:[ .]\d{3})+|\d+(?:[.,]\d+)?)\s*(k€|k\b|m€|m\b|millions?|mille)?\s*(€|euros?)?/g;
  for (const m of t.matchAll(re)) {
    let value = Number(m[1]!.replace(/[ .](?=\d{3}\b)/g, "").replace(",", "."));
    const unit = m[2] ?? "";
    const currency = m[3] ?? "";
    if (unit.startsWith("k") || unit === "mille") value *= 1_000;
    else if (unit.startsWith("m")) value *= 1_000_000;
    if (!Number.isFinite(value) || value < 100) continue;
    // Une année (« début 2027 ») n'est pas un budget.
    if (!unit && !currency && value >= 1990 && value <= 2100) continue;
    amounts.push(Math.round(value));
  }
  if (!amounts.length) return null;

  const suffix = monthly || /mois|mensuel/.test(t) ? " € par mois" : " €";
  if (amounts.length >= 2) return `${fmt.format(amounts[0]!)} à ${fmt.format(amounts[1]!)}${suffix}`;
  const v = fmt.format(amounts[0]!);
  if (/moins|max|jusqu|pas plus|au plus/.test(t)) return `Jusqu’à ${v}${suffix}`;
  if (/plus de|minimum|au moins|partir/.test(t)) return `À partir de ${v}${suffix}`;
  return `≈ ${v}${suffix}`;
}

const MONTHS = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre",
];
const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export function parseTimeline(text: string, awaited = false): string | null {
  const t = normalize(text);
  if (/des que possible|asap|rapidement|urgent|au plus vite|tout de suite|immediat/.test(t))
    return "Dès que possible";
  // Formulations vagues : uniquement en réponse à la question sur le délai.
  if (awaited && /pas de date|pas presse|pas encore|je ne sais pas|aucune idee|flexible|me renseigne/.test(t))
    return "Pas de date précise";

  const rel = t.match(/\b(d ici|dans|sous) (\d+|un|une|deux|trois|six|quelques)( a \d+)? (mois|ans?|semaines?)\b/);
  if (rel) {
    const start = rel[1] === "d ici" ? "D’ici" : "Dans";
    return `${start} ${rel[2]}${rel[3] ? rel[3].replace(" a ", " à ") : ""} ${rel[4]}`;
  }

  const year = t.match(/\b(20[2-4]\d)\b/)?.[1];
  const monthIndex = MONTHS.findIndex((m) => new RegExp(`\\b${m}\\b`).test(t));
  if (monthIndex >= 0) return `${MONTH_LABELS[monthIndex]}${year ? ` ${year}` : ""}`;
  if (year) {
    if (/\bdebut\b/.test(t)) return `Début ${year}`;
    if (/\bfin\b/.test(t)) return `Fin ${year}`;
    return `En ${year}`;
  }
  return null;
}

/* ─────────────────────────── Intentions ─────────────────────────── */

type Intent =
  | FlowId
  | "recherche"
  | "secteurs"
  | "honoraires"
  | "documents"
  | "humain"
  | "identite"
  | "merci"
  | "salut"
  | "rappel";

function detectIntent(text: string): Intent | null {
  const t = normalize(text);
  if (/\bvisit|\brendez vous\b|\brdv\b|\bcreneau/.test(t)) return "visite";
  if (/\brappel|\brecontact|\bappelez moi\b/.test(t)) return "rappel";
  if (/\bachet|\bachat\b|\bacqu|\binvesti/.test(t)) return "achat";
  if (
    /\bvendre\b|\bestimation\b|\bestimer\b|\bgestion locative\b|\bproprietaire\b/.test(t) ||
    /\b(mettre|confier)\b.*\b(location|gestion|vente)\b/.test(t)
  )
    return "proprietaire";
  if (/\blou(er|e|ons|ez)\b|\blocation\b|\blocataire|\bbail\b/.test(t)) return "location";
  if (/\bsecteurs?\b|\bcommunes?\b|\bzones?\b|\bintervenez\b|\bintervention\b/.test(t)) return "secteurs";
  if (/\bhonoraires?\b|\bfrais d agence\b|\bcommission\b|\btarifs?\b|\bcombien (ca )?coute\b/.test(t))
    return "honoraires";
  if (/\bdossier\b|\bdocuments?\b|\bpieces?\b|\bjustificatifs?\b|\bgarant/.test(t)) return "documents";
  if (/\bconseiller\b|\bhumain\b|\bpersonne reelle\b|\bparler a\b|\bquelqu un\b/.test(t)) return "humain";
  if (/\b(es tu|etes vous|tu es|vous etes) (une? )?(ia|robot|bot|humain|intelligence)|\bqui (es tu|etes vous)\b/.test(t))
    return "identite";
  if (/\brecherch|\bcherch|\btrouver\b/.test(t)) return "recherche";
  if (/\bmerci\b|\bau revoir\b|\bbonne (journee|soiree)\b/.test(t)) return "merci";
  if (/^(bonjour|bonsoir|salut|hello|coucou|hey)\b/.test(t) && t.split(" ").length <= 3) return "salut";
  return null;
}

const FLOW_INTENTS: readonly Intent[] = ["achat", "location", "proprietaire", "visite"];

/* ─────────────────────────── Moteur ─────────────────────────── */

function containsContactDetails(text: string) {
  return /[\w.+-]+@[\w-]+\.[\w.]+/.test(text) || /(?:\+?\d[\s.-]?){9,}/.test(text);
}

function clean(text: string, max = 60) {
  const s = text.trim().replace(/[.!?]+$/, "").slice(0, max);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function projectLabel(flow: Exclude<FlowId, "visite">, text: string) {
  const t = normalize(text);
  switch (flow) {
    case "achat":
      return /investi/.test(t) ? "Achat (investissement)" : "Achat";
    case "location":
      return "Location";
    case "proprietaire":
      return /location|gestion/.test(t) ? "Mise en location" : "Vente ou estimation";
  }
}

function extractInto(lead: Lead, text: string, flow: FlowId | null, awaiting: string | null) {
  const allowed = new Set<string>(flow ? FLOW_SLOTS[flow] : ["secteur", "bien", "budget", "echeance"]);
  const set = (key: LeadKey, value: string | null) => {
    if (!value || !allowed.has(key)) return;
    const current = lead[key];
    // Le type de bien peut être précisé (« Maison » → « Maison, 3 chambres »).
    const moreDetailed = key === "bien" && current !== undefined && value.length > current.length;
    if (!current || awaiting === key || moreDetailed) lead[key] = value;
  };
  set("secteur", findCommune(text));
  set("bien", parseProperty(text));
  const moneyHint = /€|euro|budget|loyer|\d\s*k\b/i.test(text);
  if (awaiting === "budget" || moneyHint) set("budget", parseBudget(text, flow === "location"));
  set("echeance", parseTimeline(text, awaiting === "echeance"));
}

function nextSlot(flow: FlowId, lead: Lead): Slot | null {
  for (const slot of FLOW_SLOTS[flow]) {
    if (slot === "dispo") {
      if (!lead.suite) return slot;
    } else if (!lead[slot]) return slot;
  }
  return null;
}

function reply(text: string, state: DemoState, suggestions: string[] = DEFAULT_SUGGESTIONS): ChatResponse {
  return { reply: text, state, suggestions, mode: "scripted" };
}

const idle = (lead: Lead): DemoState => ({ flow: null, awaiting: null, lead });

function ask(flow: FlowId, slot: Slot, lead: Lead, prefix: string): ChatResponse {
  const prompt = PROMPTS[flow][slot]!;
  return reply(`${prefix} ${prompt.question}`.trim(), { flow, awaiting: slot, lead }, prompt.suggestions);
}

const HANDOFF: Record<FlowId, { text: string; suggestions: string[] }> = {
  achat: {
    text: "Merci ! J’ai l’essentiel pour qu’un conseiller vous présente les biens correspondant à votre recherche. Souhaitez-vous planifier une visite ou être rappelé ?",
    suggestions: ["Planifier une visite", "Être rappelé"],
  },
  location: {
    text: "Merci ! J’ai l’essentiel pour qu’un conseiller vous présente les logements correspondant à votre recherche. Souhaitez-vous planifier une visite ou être rappelé ?",
    suggestions: ["Planifier une visite", "Être rappelé"],
  },
  proprietaire: {
    text: "Merci. Un conseiller de l’agence pourra vous proposer un rendez-vous pour évaluer votre bien. Souhaitez-vous être rappelé ?",
    suggestions: ["Être rappelé", "Planifier un rendez-vous"],
  },
  visite: {
    text: "Merci ! Lorsque l’agenda de l’agence est connecté, je propose directement des créneaux libres, par exemple :",
    suggestions: ["Mardi à 10 h", "Jeudi à 17 h 30", "Être rappelé"],
  },
};

function complete(flow: FlowId, lead: Lead): ChatResponse {
  const h = HANDOFF[flow];
  return reply(h.text, { flow, awaiting: flow === "visite" ? "slot" : "handoff", lead }, h.suggestions);
}

function callback(lead: Lead): ChatResponse {
  lead.suite = "Rappel par un conseiller";
  return reply(
    `C’est noté : un conseiller de l’agence vous recontactera. Dans une configuration réelle, je vous demanderais ici vos coordonnées. ${PRIVACY_NOTE}`,
    idle(lead),
  );
}

function startFlow(flow: FlowId, text: string, previous: Lead): ChatResponse {
  let lead: Lead;
  if (flow === "visite") {
    // On conserve la recherche en cours pour la transmettre avec la demande de visite.
    lead = { ...previous, projet: previous.projet ?? "Visite" };
    delete lead.suite;
  } else {
    lead = { projet: projectLabel(flow, text) };
  }
  extractInto(lead, text, flow, null);

  const slot = nextSlot(flow, lead);
  const prefix = {
    visite: "Avec plaisir, organisons ce rendez-vous.",
    proprietaire: "Bien sûr, je peux transmettre votre projet à un conseiller.",
    achat: "Très bien ! Je peux vous aider à préciser votre recherche.",
    location: "Très bien ! Je peux vous aider à préciser votre recherche.",
  }[flow];
  return slot ? ask(flow, slot, lead, prefix) : complete(flow, lead);
}

function handle(text: string, intent: Intent | null, state: DemoState): ChatResponse {
  const { flow, awaiting, lead } = state;

  // 1. Choix proposés en fin de parcours.
  if (intent === "rappel") return callback(lead);
  if (awaiting === "slot") {
    const t = normalize(text);
    if (/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi)\b|\b\d{1,2} ?h\b/.test(t)) {
      const slot = clean(text).toLowerCase();
      lead.suite = `Rendez-vous demandé : ${slot}`;
      return reply(
        `Parfait, la demande de rendez-vous (${slot}) est transmise à l’agence, qui vous enverra une confirmation. ${PRIVACY_NOTE}`,
        idle(lead),
      );
    }
  }

  // 2. Nouveau parcours, ou changement de parcours.
  const flowIntent: Intent | null = intent === "recherche" ? (flow ? null : "achat") : intent;
  if (flowIntent && FLOW_INTENTS.includes(flowIntent) && (flowIntent !== flow || awaiting === "handoff")) {
    return startFlow(flowIntent as FlowId, text, lead);
  }

  // 3. Questions ponctuelles, puis reprise de la question en cours.
  const resume = (answer: string): ChatResponse => {
    const prompt = flow && awaiting ? PROMPTS[flow][awaiting as Slot] : undefined;
    if (prompt) {
      const q = prompt.question.charAt(0).toLowerCase() + prompt.question.slice(1);
      return reply(`${answer}\n\nPour reprendre : ${q}`, state, prompt.suggestions);
    }
    return reply(answer, state);
  };

  switch (intent) {
    case "secteurs":
      return resume(
        `Dans cette démonstration, l’agence intervient ${sectorsList}. Pour votre agence, cette liste reprend vos propres secteurs, et l’agent peut orienter chaque demande vers le conseiller concerné.`,
      );
    case "honoraires":
      return resume(
        "L’agent communique les honoraires et conditions de l’agence tels qu’elle les lui a fournis. Dans cette démonstration, aucun barème n’est configuré : un conseiller vous répondrait précisément.",
      );
    case "documents":
      return resume(
        "L’agent peut communiquer la liste des pièces demandées par l’agence et répondre aux questions sur la constitution d’un dossier. Cette liste est définie lors de la configuration.",
      );
    case "humain":
      lead.suite = "Demande de contact avec un conseiller";
      return reply(
        "Bien sûr. Je transmets votre demande à un conseiller de l’agence, qui reprendra l’échange. C’est l’agence qui définit quand et comment cette transmission a lieu.",
        idle(lead),
      );
    case "identite":
      return resume(
        "Je suis un assistant virtuel, et cette conversation est une démonstration fondée sur un scénario prédéfini. Configuré pour une agence, l’agent répond à partir des informations qu’elle lui fournit et transmet les demandes à son équipe.",
      );
    case "merci":
      return reply("Avec plaisir ! Puis-je vous aider sur autre chose ?", idle(lead));
    case "salut":
      return resume(
        "Bonjour et bienvenue ! Vous souhaitez acheter, louer, organiser une visite ou en savoir plus sur nos secteurs ?",
      );
  }

  // 4. Réponse à la question en cours.
  if (flow && awaiting && PROMPTS[flow][awaiting as Slot]) {
    const slot = awaiting as Slot;
    // Aucune coordonnée n'est enregistrée dans la fiche de démonstration.
    if (containsContactDetails(text)) return ask(flow, slot, lead, "");
    const before = JSON.stringify(lead);
    extractInto(lead, text, flow, slot);
    const learnedSomethingElse = JSON.stringify(lead) !== before;
    if (slot === "dispo") {
      lead.suite = `Disponibilités : ${clean(text).toLowerCase()}`;
    } else if (!lead[slot]) {
      // Le message apporte une autre information : on la garde et on repose la question.
      if (learnedSomethingElse) return ask(flow, slot, lead, "C’est noté.");
      if (text.length > 80) return ask(flow, slot, lead, "Pouvez-vous préciser en quelques mots ?");
      lead[slot] = /je ne sais pas|aucune idee|pas encore|pas defini|sais pas/.test(normalize(text))
        ? "Non précisé"
        : clean(text);
    }
    const following = nextSlot(flow, lead);
    const ack = ACKS[Object.keys(lead).length % ACKS.length]!;
    return following ? ask(flow, following, lead, ack) : complete(flow, lead);
  }

  // 5. Choix de fin de parcours non reconnu : on repropose les options.
  if (flow && (awaiting === "handoff" || awaiting === "slot")) {
    const h = HANDOFF[flow];
    return reply(
      awaiting === "slot"
        ? "Choisissez l’un des créneaux proposés, ou demandez à être rappelé."
        : "Je n’ai pas bien compris. Que préférez-vous ?",
      state,
      h.suggestions,
    );
  }

  // 6. Critères donnés sans contexte (ex. « un T3 à Schœlcher »).
  const probe: Lead = {};
  extractInto(probe, text, null, null);
  if (Object.keys(probe).length) return startFlow("achat", text, {});

  // 7. Hors scénario.
  return reply(
    "Dans cette démonstration, je suis un scénario prédéfini : je traite surtout les recherches d’achat ou de location, les demandes de visite et les questions sur les secteurs. Une fois configuré pour votre agence, l’agent répond aussi à vos propres questions fréquentes.",
    state,
  );
}

export function runScript(request: ChatRequest): ChatResponse {
  const last = [...request.messages].reverse().find((m) => m.role === "user");
  const text = last?.content ?? "";
  const state: DemoState = request.state
    ? { ...request.state, lead: { ...request.state.lead } }
    : idle({});

  const response = handle(text, detectIntent(text), state);
  if (containsContactDetails(text)) {
    return { ...response, reply: `${PRIVACY_NOTE}\n\n${response.reply}` };
  }
  return response;
}

export const scriptedProvider: ChatProvider = {
  mode: "scripted",
  async respond(request) {
    return runScript(request);
  },
};
