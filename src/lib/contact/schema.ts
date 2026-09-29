import { z } from "zod";

/** Options du champ « Nombre de collaborateurs ». */
export const TEAM_SIZES = ["1 à 3", "4 à 10", "11 à 25", "Plus de 25"] as const;

/**
 * Schéma partagé entre le navigateur (validation instantanée)
 * et le serveur (validation de sécurité, toujours appliquée).
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom et prénom.")
    .max(100, "100 caractères maximum."),
  agency: z
    .string()
    .trim()
    .min(2, "Indiquez le nom de votre agence.")
    .max(120, "120 caractères maximum."),
  email: z.string().trim().max(160, "160 caractères maximum.").pipe(z.email("Saisissez une adresse e-mail valide, par exemple nom@agence.fr.")),
  phone: z
    .string()
    .trim()
    .max(25)
    .refine((v) => v === "" || /^\+?[\d\s.()-]{8,20}$/.test(v), "Saisissez un numéro valide, par exemple 0696 12 34 56."),
  city: z
    .string()
    .trim()
    .min(2, "Indiquez votre ville ou votre secteur d’activité.")
    .max(120, "120 caractères maximum."),
  teamSize: z.union([z.enum(TEAM_SIZES), z.literal("")]),
  message: z
    .string()
    .trim()
    .min(10, "Décrivez votre besoin en quelques mots (10 caractères minimum).")
    .max(2000, "2 000 caractères maximum."),
  consent: z.literal(true, "Cochez cette case pour que nous puissions traiter votre demande."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Champs anti-spam envoyés avec le formulaire (jamais affichés). */
export const antiSpamSchema = z.object({
  /** Champ piège invisible : doit rester vide. */
  website: z.string().max(200).optional().default(""),
  /** Temps passé sur le formulaire avant l'envoi, mesuré dans le navigateur (ms). */
  elapsedMs: z.number().nonnegative().max(86_400_000 * 7),
});

export const contactRequestSchema = contactSchema.extend(antiSpamSchema.shape);

export type ContactResponse =
  | { status: "sent" }
  | { status: "demo" }
  | { status: "invalid"; errors: Partial<Record<ContactField, string>> }
  | { status: "rate_limited"; retryAfterSeconds: number }
  | { status: "error"; message: string };
