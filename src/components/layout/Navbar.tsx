"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

/** Sections de la page sans lien dans le menu → lien à mettre en évidence. */
const SECTION_TO_NAV: Record<string, string> = {
  enjeux: "accueil",
  demo: "agent",
  martinique: "fonctionnalites",
  fonctionnement: "fonctionnalites",
};

export function Navbar({ variant = "overlay" }: { variant?: "overlay" | "solid" }) {
  const [scrolled, setScrolled] = useState(variant === "solid");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("accueil");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fond de la barre après quelques pixels de défilement.
  useEffect(() => {
    if (variant === "solid") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // Lien actif selon la section visible (les sections sans lien sont rattachées au lien le plus proche).
  useEffect(() => {
    if (variant === "solid") return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(SECTION_TO_NAV[entry.target.id] ?? entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [variant]);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Menu mobile : blocage du défilement, touche Échap, focus.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        variant === "solid"
          ? "border-b border-ivory/[0.08] bg-ink"
          : solid
            ? "border-b border-ivory/[0.08] bg-ink/80 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-champagne focus:px-4 focus:py-2 focus:text-ink"
      >
        Aller au contenu
      </a>

      <nav aria-label="Navigation principale" className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/#accueil" aria-label={`${siteConfig.name}, retour à l’accueil`} onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => {
            const isActive = variant === "overlay" && active === item.id;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-[14.5px] transition-colors duration-300",
                    isActive ? "text-ivory" : "text-ivory/65 hover:text-ivory",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-champagne transition-transform duration-500 ease-(--ease-soft)",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Link href="/#contact" className={buttonClasses("gold", "sm")}>
              Demander une démo
            </Link>
          </span>
          <span className="sm:hidden">
            <Link href="/#contact" className={buttonClasses("gold", "sm", "px-3.5")} onClick={() => setOpen(false)}>
              Démo
            </Link>
          </span>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ivory/15 text-ivory transition-colors hover:bg-ivory/10 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => (open ? close() : setOpen(true))}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-ivory/[0.08] bg-ink px-5 pb-10 pt-6 sm:px-8 lg:hidden"
      >
        <ul className="flex flex-col">
          {siteConfig.nav.map((item, i) => (
            <li key={item.id} className="animate-rise" style={{ animationDelay: `${i * 40}ms` }}>
              <Link
                href={item.href}
                onClick={() => close(false)}
                className="flex items-center justify-between border-b border-ivory/[0.08] py-4 font-display text-[1.75rem] text-ivory"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/#contact" onClick={() => close(false)} className={buttonClasses("gold", "md", "mt-8 w-full")}>
          Demander une démonstration
        </Link>
      </div>
    </header>
  );
}
