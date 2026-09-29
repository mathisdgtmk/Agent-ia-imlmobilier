import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <>
      <Navbar variant="solid" />
      <main id="contenu" className="flex min-h-[70vh] items-center bg-ink pb-20 pt-36">
        <Container>
          <p className="text-sm text-champagne">Erreur 404</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[1.05] text-ivory sm:text-6xl">
            Cette page n’existe pas ou a été déplacée.
          </h1>
          <ButtonLink href="/" variant="gold" className="mt-10">
            Revenir à l’accueil
          </ButtonLink>
        </Container>
      </main>
      <Footer />
    </>
  );
}
