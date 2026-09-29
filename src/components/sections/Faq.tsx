"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { faq } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/** Évite les coupures de ligne disgracieuses dans « peut-il », « remplace-t-il »… */
function keepHyphenatedWords(text: string) {
  return text.split(/(\S*-\S*)/g).map((part, i) =>
    part.includes("-") ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-ink/[0.06] bg-paper py-24 text-ink sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="faq-title" title={faq.title} tone="light" />
            <p className="mt-6 max-w-sm text-[1.0625rem] leading-relaxed text-stone">
              Une autre question ? Posez-la lors de la démonstration, nous y répondrons pour votre agence.
            </p>
            <Link
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 border-b border-champagne-deep/50 pb-0.5 text-[15px] font-medium text-champagne-deep transition-colors hover:border-champagne-deep"
            >
              Demander une démonstration
            </Link>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8">
          <ul className="border-t border-ink/10">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              const buttonId = `${baseId}-q${i}`;
              const panelId = `${baseId}-a${i}`;
              return (
                <li key={item.q} className="border-b border-ink/10">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-[1.0625rem] font-medium leading-snug text-ink transition-colors [text-wrap:pretty] group-hover:text-champagne-deep sm:text-[1.15rem]">
                        {keepHyphenatedWords(item.q)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-(--ease-soft)",
                          isOpen
                            ? "rotate-45 border-ink bg-ink text-paper"
                            : "border-ink/15 text-ink group-hover:border-champagne-deep/50",
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-(--ease-soft)",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                    inert={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-7 pr-12 text-[15.5px] leading-relaxed text-stone">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
