import { images } from "@/config/images";
import { hero } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { Parallax } from "@/components/ui/Parallax";
import { SmartImage } from "@/components/ui/SmartImage";
import { imageFallback } from "@/components/ui/image-fallback";
import { Container } from "@/components/ui/Section";
import { ChatBubble, SimulationBadge } from "@/components/chat/ChatParts";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="accueil"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink pb-16 pt-32 sm:pb-20 lg:items-center lg:pb-24"
    >
      {/* Photo de fond avec léger effet de profondeur */}
      <div className={cn("absolute inset-0 -z-20", imageFallback)} aria-hidden="true">
        <Parallax speed={0.28} className="absolute inset-0 -top-[6%] h-[112%]">
          <div className="absolute inset-0 animate-slow-zoom">
            <SmartImage
              src={images.hero.src}
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </Parallax>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(7_7_7/0.92)_0%,rgb(7_7_7/0.72)_38%,rgb(7_7_7/0.2)_75%,rgb(7_7_7/0.35)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/70 to-transparent" />

      <Container className="grid items-end gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h1
            id="hero-title"
            className="max-w-[17ch] font-display text-[2.7rem] leading-[1.02] tracking-[-0.02em] text-ivory sm:text-6xl lg:text-[4.6rem] xl:text-[5.1rem]"
          >
            {hero.title}
          </h1>
          <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ivory/80 sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.primaryCta.href} variant="gold">
              {hero.primaryCta.label}
            </ButtonLink>
          </div>

          <p className="mt-8 flex items-center gap-3 text-sm text-ivory/60">
            <span aria-hidden="true" className="h-px w-8 bg-champagne/70" />
            {hero.note}
          </p>
        </div>

        {/* Aperçu : une demande reçue en soirée */}
        <div className="hidden lg:col-span-5 lg:block">
          <Parallax speed={-0.06}>
            <figure className="glass ml-auto max-w-[400px] rounded-3xl p-5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
              <figcaption className="flex items-center justify-between border-b border-ivory/[0.08] pb-4">
                <div>
                  <p className="text-sm font-medium text-ivory">Assistant de l’agence</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-mist">
                    <span className="h-1.5 w-1.5 rounded-full bg-champagne" aria-hidden="true" />
                    Répond aussi en soirée
                  </p>
                </div>
                <SimulationBadge>Exemple</SimulationBadge>
              </figcaption>
              <div className="space-y-3 pt-4">
                <p className="text-center text-[11.5px] text-mist">Aujourd’hui, 22 h 47</p>
                <ChatBubble from="client" animate={false}>
                  Bonsoir, je cherche un appartement T3 à Schœlcher pour une location à l’année.
                </ChatBubble>
                <ChatBubble from="agent" animate={false}>
                  Bonsoir et bienvenue ! Je note votre recherche. À partir de quand souhaitez-vous emménager ?
                </ChatBubble>
              </div>
            </figure>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
