import { NextResponse } from "next/server";
import { getChatProvider } from "@/lib/ai";
import { chatRequestSchema, type ChatResponse } from "@/lib/ai/types";
import { rateLimit } from "@/lib/rate-limit";
import { isSameOrigin, readJson } from "@/lib/security";
import { getClientIp } from "@/lib/utils";

/**
 * POST /api/chat — démonstration interactive.
 * Le navigateur n'envoie que la conversation ; le choix du fournisseur
 * (scénario ou API d'IA) et les éventuelles clés restent côté serveur.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origine non autorisée." }, { status: 403 });
  }

  const limit = rateLimit(`chat:${getClientIp(request.headers)}`, 40, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await readJson(request, 24_000);
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Message invalide ou trop long." }, { status: 400 });
  }

  const { primary, fallback } = getChatProvider();
  let result: ChatResponse;
  try {
    result = await primary.respond(parsed.data);
  } catch (error) {
    console.error("[api/chat] Fournisseur principal indisponible :", (error as Error).message);
    result = await fallback.respond(parsed.data);
  }

  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
