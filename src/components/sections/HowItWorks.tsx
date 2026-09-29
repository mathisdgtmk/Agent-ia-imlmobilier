import { steps } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";

export function HowItWorks() {
  return (
    <section id="fonctionnement" aria-labelledby="fonctionnement-title" className="bg-ivory py-24 text-ink sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="fonctionnement-title"
            title={steps.title}
            intro="De la configuration au suivi des demandes, votre équipe reste au centre du dispositif."
            tone="light"
          />
        </Reveal>

        <Reveal className="group relative mt-16 sm:mt-20">
          {/* Ligne reliant les étapes : horizontale sur ordinateur, verticale sur mobile */}
          <div aria-hidden="true" className="absolute left-[27px] top-2 bottom-2 w-px bg-ink/10 lg:left-0 lg:right-0 lg:top-[27px] lg:bottom-auto lg:h-px lg:w-auto" />
          <div
            aria-hidden="true"
            data-line
            className="absolute left-[27px] top-2 bottom-2 w-px origin-top scale-y-0 bg-champagne-deep transition-transform delay-300 duration-[1.6s] ease-(--ease-soft) group-[.is-visible]:scale-y-100 lg:left-0 lg:right-0 lg:top-[27px] lg:bottom-auto lg:h-px lg:w-auto lg:origin-left lg:scale-x-0 lg:scale-y-100 lg:group-[.is-visible]:scale-x-100"
          />

          <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-10">
            {steps.items.map((step, i) => (
              <li key={step.title} className="relative flex gap-6 lg:block">
                <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-champagne-deep/40 bg-ivory font-display text-[1.4rem] text-champagne-deep">
                  <span className="visually-hidden">Étape </span>
                  {i + 1}
                </span>
                <div className="lg:mt-8 lg:pr-6">
                  <step.icon className="hidden h-6 w-6 text-champagne-deep lg:block" strokeWidth={1.4} aria-hidden="true" />
                  <h3 className="font-display text-[1.75rem] leading-tight tracking-[-0.01em] text-ink lg:mt-5">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-[15.5px] leading-relaxed text-stone">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
