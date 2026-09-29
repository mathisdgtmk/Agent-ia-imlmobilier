import { images } from "@/config/images";
import { martinique } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { imageFallback } from "@/components/ui/image-fallback";
import { cn } from "@/lib/utils";
import { SectorExplorer } from "./SectorExplorer";

/** Mosaïque : une grande photo et quatre plus petites sur ordinateur. */
const tiles = [
  "col-span-2 h-64 sm:h-80 lg:col-span-6 lg:row-span-2 lg:h-auto",
  "h-40 sm:h-56 lg:col-span-3 lg:h-auto",
  "h-40 sm:h-56 lg:col-span-3 lg:h-auto",
  "h-40 sm:h-56 lg:col-span-3 lg:h-auto",
  "h-40 sm:h-56 lg:col-span-3 lg:h-auto",
];

export function Martinique() {
  return (
    <section id="martinique" aria-labelledby="martinique-title" className="relative bg-ink py-24 sm:py-32">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <SectionHeading id="martinique-title" title={martinique.title} className="lg:col-span-7" />
          <div className="space-y-5 text-[1.0625rem] leading-relaxed text-mist lg:col-span-5 lg:pt-3">
            {martinique.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container className="mt-14 sm:mt-16">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:h-[600px] lg:grid-cols-12 lg:grid-rows-2">
          {images.martinique.map((image, i) => (
            <Reveal
              key={image.src}
              delay={i * 70}
              className={cn("group relative overflow-hidden rounded-2xl", imageFallback, tiles[i])}
            >
              <SmartImage
                src={image.src}
                alt={image.alt}
                fill
                sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="object-cover transition-transform duration-[1.6s] ease-(--ease-soft) group-hover:scale-[1.04]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-5">
          <p className="font-display text-[1.9rem] leading-[1.15] text-ivory sm:text-[2.2rem]">
            Résidents, investisseurs, familles qui s’installent : chaque profil attend une réponse juste, dans
            votre secteur.
          </p>
        </Reveal>
        <Reveal className="lg:col-span-7" delay={80}>
          <SectorExplorer />
        </Reveal>
      </Container>
    </section>
  );
}
