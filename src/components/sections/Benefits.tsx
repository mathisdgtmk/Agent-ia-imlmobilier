import { benefits } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";

export function Benefits() {
  return (
    <section id="fonctionnalites" aria-labelledby="fonctionnalites-title" className="bg-ivory py-24 text-ink sm:py-32">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="fonctionnalites-title" title={benefits.title} tone="light" className="lg:col-span-7" />
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-stone lg:col-span-5 lg:justify-self-end">
            {benefits.intro}
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-ink/[0.08] bg-ink/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {benefits.items.map((item, i) => (
            <li key={item.title} className="bg-paper">
              <Reveal delay={(i % 3) * 80} className="h-full">
                <article className="group relative h-full p-8 transition-colors duration-500 hover:bg-white sm:p-9">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-champagne transition-transform duration-700 ease-(--ease-soft) group-hover:scale-x-100"
                  />
                  <item.icon className="h-7 w-7 text-champagne-deep" strokeWidth={1.4} aria-hidden="true" />
                  <h3 className="mt-8 font-display text-[1.75rem] leading-tight tracking-[-0.01em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
