import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité et traitement des données personnelles du site ${siteConfig.name}.`,
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function PolitiqueConfidentialite() {
  const { legal } = siteConfig;
  return (
    <LegalPage title="Politique de confidentialité" updated={legal.lastUpdated}>
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          Les données personnelles collectées sur ce site sont traitées par {legal.dataController}. Pour toute
          question, écrivez à {legal.dpoEmail}.
        </p>
      </section>

      <section>
        <h2>Données collectées</h2>
        <p>Lorsque vous remplissez le formulaire de demande de démonstration, nous recueillons :</p>
        <ul>
          <li>vos nom et prénom, le nom de votre agence et votre adresse e-mail professionnelle ;</li>
          <li>votre ville ou secteur d’activité et votre message ;</li>
          <li>si vous les indiquez, votre numéro de téléphone et le nombre de collaborateurs de votre agence.</li>
        </ul>
        <p>
          La démonstration interactive ne nécessite aucune donnée personnelle. Les messages que vous y saisissez
          servent uniquement à générer la réponse affichée et ne sont pas conservés par le site. [Si vous connectez
          une API d’IA externe, précisez ici le prestataire et ses conditions de traitement.]
        </p>
      </section>

      <section>
        <h2>Finalité et base légale</h2>
        <p>
          Ces informations servent exclusivement à répondre à votre demande et à organiser une démonstration. Le
          traitement repose sur votre consentement, recueilli au moyen de la case à cocher du formulaire, et sur les
          mesures précontractuelles prises à votre demande.
        </p>
      </section>

      <section>
        <h2>Destinataires</h2>
        <p>
          Les données sont destinées à l’éditeur du site. Elles peuvent transiter par des prestataires techniques
          (hébergement, envoi d’e-mails) agissant pour son compte : [liste des prestataires, ex. hébergeur,
          service d’envoi d’e-mails]. Elles ne sont ni vendues ni cédées.
        </p>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>Les demandes de contact sont conservées {legal.retention}.</p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Conformément au Règlement général sur la protection des données (RGPD) et à la loi « Informatique et
          Libertés », vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et
          d’opposition, ainsi que du droit de retirer votre consentement à tout moment. Pour les exercer, écrivez à{" "}
          {legal.dpoEmail}.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL (
          <a href="https://www.cnil.fr" rel="noopener noreferrer" target="_blank">
            www.cnil.fr
          </a>
          ).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Ce site n’utilise pas de cookies de mesure d’audience ni de publicité. [Mettre à jour si vous
          ajoutez un outil d’analyse, et prévoir alors un bandeau de consentement.]
        </p>
      </section>
    </LegalPage>
  );
}
