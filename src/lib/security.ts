/**
 * Vérifie qu'une requête API provient bien du site lui-même
 * (protection basique contre l'utilisation de l'API depuis un autre domaine).
 */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Requêtes sans Origin (ex. outils serveur) : laissées au limiteur de débit.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Lit un corps JSON en refusant les requêtes trop volumineuses. */
export async function readJson(request: Request, maxBytes: number): Promise<unknown> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > maxBytes) throw new Error("payload_too_large");
  const text = await request.text();
  if (text.length > maxBytes) throw new Error("payload_too_large");
  return JSON.parse(text);
}
