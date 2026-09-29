import { NextResponse } from "next/server";
import { deliverContact } from "@/lib/contact/deliver";
import { contactRequestSchema, type ContactField, type ContactResponse } from "@/lib/contact/schema";
import { rateLimit } from "@/lib/rate-limit";
import { isSameOrigin, readJson } from "@/lib/security";
import { getClientIp } from "@/lib/utils";

/** Délai minimal entre l'affichage du formulaire et l'envoi (anti-robots). */
const MIN_FILL_TIME_MS = 3_000;

const json = (body: ContactResponse, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** POST /api/contact — demande de démonstration. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ status: "error", message: "Origine non autorisée." }, 403);
  }

  const limit = rateLimit(`contact:${getClientIp(request.headers)}`, 5, 60 * 60_000);
  if (!limit.ok) {
    return json({ status: "rate_limited", retryAfterSeconds: limit.retryAfterSeconds }, 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  let body: unknown;
  try {
    body = await readJson(request, 16_000);
  } catch {
    return json({ status: "error", message: "Requête invalide." }, 400);
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField | undefined;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return json({ status: "invalid", errors }, 422);
  }

  const { website, elapsedMs, ...data } = parsed.data;

  // Robots : champ piège rempli ou envoi quasi instantané. On répond comme
  // si tout allait bien, sans rien transmettre, pour ne pas les renseigner.
  if (website || elapsedMs < MIN_FILL_TIME_MS) {
    return json({ status: "sent" });
  }

  try {
    const mode = await deliverContact(data);
    return json(mode === "demo" ? { status: "demo" } : { status: "sent" });
  } catch (error) {
    console.error("[api/contact] Échec de l’envoi :", (error as Error).message);
    return json(
      {
        status: "error",
        message: "Votre demande n’a pas pu être transmise. Réessayez dans un instant ou écrivez-nous directement.",
      },
      502,
    );
  }
}
