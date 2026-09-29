import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${siteConfig.name}.`,
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  const { legal, contact } = siteConfig;
  return (
    <LegalPage title="Mentions légales" updated={legal.lastUpdated}>
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site {siteConfig.name} est édité par {legal.publisherName}, {legal.publisherStatus}, immatriculé sous le
          numéro SIRET {legal.siret}, dont le siège est situé {legal.publisherAddress}.
        </p>
        <ul>
          <li>Adresse e-mail : {contact.email}</li>
          <li>Téléphone : {contact.phone}</li>
          <li>Directeur de la publication : {legal.publicationDirector}</li>
        </ul>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par {legal.host.name}, {legal.host.address}, {legal.host.website}.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, éléments graphiques, logos et le code du site sont la propriété de l’éditeur, sauf mention
          contraire. Toute reproduction sans autorisation préalable est interdite.
        </p>
        <p>
          Les photographies proviennent de la banque d’images Unsplash et sont utilisées conformément à la licence
          Unsplash, ou appartiennent à l’éditeur. [Mettre à jour si vous utilisez vos propres photos.]
        </p>
      </section>

      <section>
        <h2>Démonstration de l’agent IA</h2>
        <p>
          Les conversations présentées sur le site sont des simulations. Elles n’engagent aucune agence
          immobilière et ne portent sur aucun bien réel.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Le traitement des informations transmises via le formulaire de contact est décrit dans la{" "}
          <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
