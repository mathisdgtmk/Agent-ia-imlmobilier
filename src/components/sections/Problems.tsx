import { problems } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";

export function Problems() {
  return (
    <section id="enjeux" aria-labelledby="enjeux-title" className="bg-ivory py-24 text-ink sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-32">
              <SectionHeading id="enjeux-title" title={problems.title} tone="light" />
              <p className="mt-6 max-w-sm text-[1.0625rem] leading-relaxed text-stone">
                Six situations que vivent chaque semaine les équipes des agences immobilières.
              </p>
            </Reveal>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {problems.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 2) * 90}>
                <article className="group h-full rounded-2xl border border-ink/[0.08] bg-paper p-6 transition-[transform,box-shadow,border-color] duration-500 ease-(--ease-soft) hover:-translate-y-1 hover:border-champagne-deep/30 hover:shadow-[0_24px_48px_-28px_rgb(60_45_20/0.35)] sm:p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne-deep/25 text-champagne-deep transition-colors duration-500 group-hover:bg-champagne-deep group-hover:text-paper">
                    <item.icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-[1.125rem] font-medium leading-snug tracking-[-0.01em] text-ink">
                    {item.title}
                  </h3>
                  {item.text ? <p className="mt-2.5 text-[15px] leading-relaxed text-stone">{item.text}</p> : null}
                </article>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="mt-20 border-t border-ink/10 pt-12 sm:mt-24">
          <p className="max-w-4xl font-display text-[2rem] leading-[1.12] tracking-[-0.01em] text-ink sm:text-[2.75rem]">
            {problems.closing}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
