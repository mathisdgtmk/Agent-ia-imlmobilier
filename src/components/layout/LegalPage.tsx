import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Section";

/** Mise en page des pages légales : texte clair, lisible, sur fond ivoire. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <Navbar variant="solid" />
      <main id="contenu" className="bg-ivory pb-24 pt-36 text-ink sm:pt-44">
        <Container className="max-w-[820px]">
          <h1 className="font-display text-[2.6rem] leading-[1.05] tracking-[-0.015em] sm:text-6xl">{title}</h1>
          <p className="mt-4 text-sm text-stone">Dernière mise à jour : {updated}</p>
          <p className="mt-8 rounded-xl border border-champagne-deep/25 bg-paper px-5 py-4 text-[14.5px] leading-relaxed text-stone">
            Modèle à compléter : les informations entre crochets doivent être renseignées, et le texte validé avant la
            mise en ligne du site.
          </p>
          <div className="mt-12 space-y-10 text-[16px] leading-[1.75] text-ink/85 [&_a]:text-champagne-deep [&_a]:underline [&_a]:underline-offset-4 [&_h2]:font-display [&_h2]:text-[1.9rem] [&_h2]:leading-tight [&_h2]:text-ink [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
