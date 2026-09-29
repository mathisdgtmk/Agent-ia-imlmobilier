import "server-only";

import { agentProfile } from "@/config/agent";
import { runScript } from "./scripted-provider";
import type { ChatMessage, ChatProvider, ChatRequest } from "./types";

/**
 * Connexion à une véritable API d'IA — exécutée exclusivement côté serveur.
 * La clé API est lue dans les variables d'environnement et n'est jamais
 * envoyée au navigateur.
 *
 * Variables (voir .env.example) :
 *   AI_PROVIDER = anthropic | openai   (openai = toute API compatible OpenAI)
 *   AI_API_KEY  = clé secrète
 *   AI_MODEL    = identifiant du modèle
 *   AI_BASE_URL = (facultatif) URL d'une API compatible
 */

type RemoteKind = "anthropic" | "openai";

const TIMEOUT_MS = 20_000;

async function callAnthropic(messages: ChatMessage[], model: string, key: string, baseUrl?: string) {
  const res = await fetch(`${baseUrl ?? "https://api.anthropic.com"}/v1/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: agentProfile.maxTokens,
      system: agentProfile.systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  return (data.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("\n")
    .trim();
}

async function callOpenAiCompatible(messages: ChatMessage[], model: string, key: string, baseUrl?: string) {
  const res = await fetch(`${baseUrl ?? "https://api.openai.com/v1"}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      max_tokens: agentProfile.maxTokens,
      messages: [{ role: "system", content: agentProfile.systemPrompt }, ...messages],
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`OpenAI-compatible API ${res.status}`);
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export function createRemoteProvider(): ChatProvider | null {
  const kind = process.env.AI_PROVIDER?.trim().toLowerCase() as RemoteKind | undefined;
  const key = process.env.AI_API_KEY?.trim();
  const model = process.env.AI_MODEL?.trim();
  const baseUrl = process.env.AI_BASE_URL?.trim().replace(/\/$/, "") || undefined;

  if (!kind || !key || !model || (kind !== "anthropic" && kind !== "openai")) return null;

  return {
    mode: "live",
    async respond(request: ChatRequest) {
      // Les API attendent un premier message « user » : on retire l'accueil éventuel.
      const history = request.messages.slice(-16);
      while (history.length && history[0]!.role !== "user") history.shift();

      const text =
        kind === "anthropic"
          ? await callAnthropic(history, model, key, baseUrl)
          : await callOpenAiCompatible(history, model, key, baseUrl);
      if (!text) throw new Error("Réponse vide de l'API d'IA");

      // La fiche prospect reste calculée localement pour l'affichage de la démo.
      const { state } = runScript(request);
      return { reply: text, suggestions: [], state, mode: "live" };
    },
  };
}
