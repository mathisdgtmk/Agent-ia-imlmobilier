import "server-only";

import { createRemoteProvider } from "./remote-provider";
import { scriptedProvider } from "./scripted-provider";
import type { ChatProvider } from "./types";

/**
 * Sélection du fournisseur de réponses.
 * Par défaut : scénario de démonstration prédéfini.
 * Si AI_PROVIDER / AI_API_KEY / AI_MODEL sont définis : API d'IA réelle,
 * avec repli automatique sur le scénario en cas d'erreur.
 */
export function getChatProvider(): { primary: ChatProvider; fallback: ChatProvider } {
  return { primary: createRemoteProvider() ?? scriptedProvider, fallback: scriptedProvider };
}

export type { ChatProvider } from "./types";
