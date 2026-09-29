import { twMerge } from "tailwind-merge";

/** Concatène des classes Tailwind ; en cas de conflit, la dernière l'emporte. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return twMerge(classes.filter(Boolean).join(" "));
}

/** Normalise un texte pour les comparaisons : minuscules, sans accents ni ponctuation. */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[’'`´-]/g, " ")
    .replace(/[^a-z0-9€\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Échappe le HTML (utilisé pour les e-mails générés côté serveur). */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Récupère l'adresse IP du client derrière un proxy (Vercel, Netlify, Nginx…). */
export function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "anonymous";
}
