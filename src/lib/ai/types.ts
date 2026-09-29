import { z } from "zod";

/**
 * Contrat commun à tous les « fournisseurs » de l'agent de démonstration.
 * Le navigateur n'appelle jamais une API d'IA directement : il appelle
 * /api/chat, qui choisit le fournisseur côté serveur (voir ./index.ts).
 */

export const LEAD_KEYS = ["projet", "secteur", "bien", "budget", "echeance", "suite"] as const;
export type LeadKey = (typeof LEAD_KEYS)[number];
export type Lead = Partial<Record<LeadKey, string>>;

export const FLOWS = ["achat", "location", "proprietaire", "visite"] as const;
export type FlowId = (typeof FLOWS)[number];

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(600),
});

const stateSchema = z.object({
  flow: z.enum(FLOWS).nullable(),
  /** Information attendue à la prochaine réponse du visiteur. */
  awaiting: z.string().max(40).nullable(),
  lead: z.partialRecord(z.enum(LEAD_KEYS), z.string().max(120)),
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
  state: stateSchema.optional(),
});

export type ChatMessage = z.infer<typeof messageSchema>;
export type DemoState = z.infer<typeof stateSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export type ChatMode = "scripted" | "live";

export type ChatResponse = {
  reply: string;
  /** Réponses rapides proposées au visiteur. */
  suggestions: string[];
  state: DemoState;
  mode: ChatMode;
};

export interface ChatProvider {
  readonly mode: ChatMode;
  respond(request: ChatRequest): Promise<ChatResponse>;
}

export const initialDemoState: DemoState = { flow: null, awaiting: null, lead: {} };
