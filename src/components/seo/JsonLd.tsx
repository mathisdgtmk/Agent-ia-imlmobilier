import { siteConfig } from "@/config/site";
import { faq } from "@/content/home";

/** Données structurées (schema.org) : organisation, service et FAQ. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organisation`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.tagline,
        areaServed: { "@type": "AdministrativeArea", name: "Martinique" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#site`,
        url: siteConfig.url,
        name: siteConfig.name,
        inLanguage: "fr-FR",
        publisher: { "@id": `${siteConfig.url}/#organisation` },
      },
      {
        "@type": "Service",
        name: "Agent IA pour agences immobilières",
        serviceType: "Assistant conversationnel d’intelligence artificielle pour agences immobilières",
        provider: { "@id": `${siteConfig.url}/#organisation` },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Martinique" },
          ...siteConfig.featuredSectors.map((name) => ({ "@type": "City", name })),
        ],
        audience: { "@type": "BusinessAudience", audienceType: "Agences immobilières" },
        description:
          "Configuration d’un agent IA qui répond aux prospects, qualifie les demandes et facilite la prise de rendez-vous pour les agences immobilières de Martinique.",
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Contenu statique issu de la configuration : aucune donnée saisie par un visiteur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
