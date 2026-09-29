import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Section";
import { Logo } from "./Logo";

export function Footer() {
  const { contact } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ivory/[0.08] bg-ink text-ivory">
      <Container className="grid gap-12 py-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-mist">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Pied de page" className="md:col-span-3">
          <h2 className="text-sm font-medium text-ivory">Navigation</h2>
          <ul className="mt-4 space-y-2.5">
            {siteConfig.nav.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="text-[15px] text-mist transition-colors hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="text-sm font-medium text-ivory">Coordonnées</h2>
          <ul className="mt-4 space-y-3 text-[15px] text-mist">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
              {contact.isConfigured ? (
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-ivory">
                  {contact.email}
                </a>
              ) : (
                <span>{contact.email}</span>
              )}
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
              {contact.isConfigured ? (
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-ivory">
                  {contact.phone}
                </a>
              ) : (
                <span>{contact.phone}</span>
              )}
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
              <span>{contact.address}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-ivory/[0.08]">
        <Container className="flex flex-col gap-4 py-6 text-[13.5px] text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/mentions-legales" className="transition-colors hover:text-ivory">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/politique-de-confidentialite" className="transition-colors hover:text-ivory">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
