/**
 * Limiteur de débit en mémoire (fenêtre glissante).
 *
 * Suffisant pour un site vitrine sur une seule instance. Sur un hébergement
 * serverless (Vercel…), chaque instance a sa propre mémoire : pour une
 * protection stricte, remplacez ce module par un stockage partagé
 * (ex. Upstash Redis / Vercel KV) en gardant la même signature.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Nettoyage périodique pour éviter que la Map ne grossisse indéfiniment.
  if (now - lastSweep > 60_000) {
    for (const [k, bucket] of buckets) {
      if (bucket.hits.every((t) => now - t > windowMs)) buckets.delete(k);
    }
    lastSweep = now;
  }

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0]!;
    buckets.set(key, bucket);
    return { ok: false, retryAfterSeconds: Math.ceil((windowMs - (now - oldest)) / 1000) };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}
