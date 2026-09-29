import "server-only";

import { siteConfig } from "@/config/site";
import { escapeHtml } from "@/lib/utils";
import type { ContactInput } from "./schema";

/**
 * Envoi des demandes de démonstration — côté serveur uniquement.
 *
 * Ordre de priorité :
 *   1. E-mail via Resend      → RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL)
 *   2. Webhook (Make, Zapier, n8n, CRM…) → CONTACT_WEBHOOK_URL
 *   3. Aucun des deux         → mode démonstration : rien n'est envoyé,
 *                               et le visiteur en est clairement informé.
 */

export type DeliveryMode = "email" | "webhook" | "demo";

export function getDeliveryMode(): DeliveryMode {
  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) return "email";
  if (process.env.CONTACT_WEBHOOK_URL) return "webhook";
  return "demo";
}

const LABELS: Record<keyof ContactInput, string> = {
  name: "Nom et prénom",
  agency: "Agence",
  email: "E-mail",
  phone: "Téléphone",
  city: "Ville / secteur",
  teamSize: "Collaborateurs",
  message: "Message",
  consent: "Consentement RGPD",
};

function rows(data: ContactInput) {
  return (Object.keys(LABELS) as Array<keyof ContactInput>).map((key) => {
    const raw = data[key];
    const value = typeof raw === "boolean" ? (raw ? "Oui" : "Non") : raw || "—";
    return [LABELS[key], String(value)] as const;
  });
}

async function sendEmail(data: ContactInput) {
  const from = process.env.CONTACT_FROM_EMAIL || "Agent IA Immobilier <onboarding@resend.dev>";
  const html = `
    <h2 style="font-family:Georgia,serif">Nouvelle demande de démonstration</h2>
    <table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows(data)
        .map(
          ([label, value]) =>
            `<tr><td style="color:#6b6b6b;vertical-align:top">${escapeHtml(label)}</td><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>`;
  const text = rows(data)
    .map(([label, value]) => `${label} : ${value}`)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: process.env.CONTACT_TO_EMAIL!.split(",").map((s) => s.trim()),
      reply_to: data.email,
      subject: `Demande de démo — ${data.agency} (${data.city})`,
      html,
      text,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}

async function sendWebhook(data: ContactInput) {
  const res = await fetch(process.env.CONTACT_WEBHOOK_URL!, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: siteConfig.name,
      submittedAt: new Date().toISOString(),
      ...data,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
}

export async function deliverContact(data: ContactInput): Promise<DeliveryMode> {
  const mode = getDeliveryMode();
  if (mode === "email") await sendEmail(data);
  else if (mode === "webhook") await sendWebhook(data);
  return mode;
}
