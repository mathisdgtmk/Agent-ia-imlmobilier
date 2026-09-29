import { Check } from "lucide-react";
import { audiences } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { imageFallback } from "@/components/ui/image-fallback";
import { cn } from "@/lib/utils";

export function Audiences() {
  return (
    <section id="agences" aria-labelledby="agences-title" className="bg-ivory py-24 text-ink sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading id="agences-title" title={audiences.title} intro={audiences.intro} tone="light" />
        </Reveal>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/[0.08] bg-paper transition-[transform,box-shadow] duration-500 ease-(--ease-soft) hover:-translate-y-1 hover:shadow-[0_28px_56px_-32px_rgb(60_45_20/0.4)]">
                <div className={cn("relative aspect-[4/3] overflow-hidden", imageFallback)}>
                  <SmartImage
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.6s] ease-(--ease-soft) group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[1.55rem] leading-[1.12] tracking-[-0.01em] text-ink">{item.title}</h3>
                  <p className="mb-6 mt-3 text-[15px] leading-relaxed text-stone">{item.text}</p>
                  <ul className="mt-auto space-y-2 border-t border-ink/[0.08] pt-5">
                    {item.examples.map((example) => (
                      <li key={example} className="flex gap-2.5 text-[14px] leading-snug text-ink/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-champagne-deep" aria-hidden="true" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
