"use client";

import { Check, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { leadFields, showcase, type LeadField } from "@/content/showcase";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ChatBubble, SimulationBadge, TypingIndicator, AgentAvatar } from "@/components/chat/ChatParts";
import { cn } from "@/lib/utils";

type Lead = Partial<Record<LeadField, string>>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function AgentShowcase() {
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [lead, setLead] = useState<Lead>({});
  const [done, setDone] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<LeadField[]>([]);
  const started = useRef(false);
  const runId = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const play = useCallback(async () => {
    const id = ++runId.current;
    setCount(0);
    setLead({});
    setDone(false);
    setTyping(false);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const messages = showcase.messages;

    if (reduce) {
      setCount(messages.length);
      setLead(Object.assign({}, ...messages.map((m) => m.lead ?? {})));
      setDone(true);
      return;
    }

    await wait(500);
    for (let i = 0; i < messages.length; i++) {
      if (runId.current !== id) return;
      const message = messages[i]!;
      if (message.from === "agent") {
        setTyping(true);
        await wait(900 + Math.min(message.text.length * 12, 1100));
        if (runId.current !== id) return;
        setTyping(false);
      } else {
        await wait(1100);
        if (runId.current !== id) return;
      }
      setCount(i + 1);
      if (message.lead) {
        const keys = Object.keys(message.lead) as LeadField[];
        setLead((prev) => ({ ...prev, ...message.lead }));
        setLastUpdated(keys);
      }
      await wait(350);
    }
    if (runId.current === id) setDone(true);
  }, []);

  // Démarre la simulation quand la section devient visible.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !started.current) {
          started.current = true;
          void play();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    const runs = runId;
    return () => {
      observer.disconnect();
      runs.current++; // interrompt une simulation en cours
    };
  }, [play]);

  // Défilement interne de la conversation (sans faire défiler la page).
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [count, typing]);

  const visible = showcase.messages.slice(0, count);
  const filled = leadFields.filter((f) => lead[f.key]).length;

  return (
    <section id="agent" aria-labelledby="agent-title" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-champagne/[0.07] blur-[120px]"
      />
      <Container className="grid items-center gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading id="agent-title" title={showcase.title} intro={showcase.intro} />
          <ul className="mt-9 space-y-4">
            {showcase.points.map((point) => (
              <li key={point} className="flex gap-3.5 text-[15.5px] leading-relaxed text-ivory/85">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <ButtonLink href="#contact" variant="gold" className="mt-10">
            {showcase.cta}
          </ButtonLink>
        </Reveal>

        <div ref={sectionRef} className="relative lg:col-span-7">
          <Reveal>
            <div className="glass relative rounded-[28px] p-2 shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9)]">
              <div className="rounded-[22px] border border-ivory/[0.06] bg-ink-2/80">
                {/* En-tête de la fenêtre de discussion */}
                <div className="flex items-center justify-between gap-3 border-b border-ivory/[0.08] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <AgentAvatar className="h-9 w-9" />
                    <div>
                      <p className="text-[14.5px] font-medium text-ivory">Assistant immobilier</p>
                      <p className="text-[12.5px] text-mist">Conversation fictive</p>
                    </div>
                  </div>
                  <SimulationBadge />
                </div>

                <div className="grid md:grid-cols-[1fr_230px]">
                  <div
                    ref={logRef}
                    role="log"
                    aria-live="off"
                    aria-label="Simulation de conversation entre un prospect et l’assistant"
                    className="thin-scroll h-[420px] space-y-3.5 overflow-y-auto px-4 py-5 sm:px-5"
                  >
                    {visible.map((m, i) => (
                      <div key={i}>
                        <ChatBubble from={m.from}>{m.text}</ChatBubble>
                        {m.slots ? (
                          <div className="mt-3 flex flex-wrap gap-2 pl-[42px]" aria-label="Créneaux proposés">
                            {m.slots.map((slot) => {
                              const chosen = count > i + 1 && slot.startsWith("Mercredi");
                              return (
                                <span
                                  key={slot}
                                  className={cn(
                                    "animate-rise rounded-full border px-3 py-1.5 text-[12.5px] transition-colors duration-500",
                                    chosen
                                      ? "border-champagne bg-champagne/15 text-champagne-light"
                                      : "border-ivory/15 text-ivory/70",
                                  )}
                                >
                                  {slot}
                                </span>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    ))}
                    {typing ? <TypingIndicator /> : null}
                  </div>

                  {/* Fiche prospect générée */}
                  <aside
                    aria-label="Fiche prospect générée pendant la conversation"
                    className="border-t border-ivory/[0.08] px-5 py-5 md:border-l md:border-t-0"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium text-ivory">Fiche prospect</p>
                      <p className="text-[12px] tabular-nums text-mist">
                        {filled}/{leadFields.length}
                      </p>
                    </div>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-ivory/10">
                      <div
                        className="h-full rounded-full bg-champagne transition-[width] duration-700 ease-(--ease-soft)"
                        style={{ width: `${(filled / leadFields.length) * 100}%` }}
                      />
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-1">
                      {leadFields.map((field) => {
                        const value = lead[field.key];
                        return (
                          <div key={field.key}>
                            <dt className="text-[11.5px] text-mist">{field.label}</dt>
                            <dd
                              className={cn(
                                "mt-0.5 text-[13.5px] transition-colors duration-700",
                                value
                                  ? lastUpdated.includes(field.key)
                                    ? "text-champagne-light"
                                    : "text-ivory"
                                  : "text-ivory/25",
                              )}
                            >
                              {value ?? "En attente"}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </aside>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-5 flex items-center justify-between gap-4 px-1 text-[13px] text-mist">
            <p>Simulation : aucune agence ni aucun prospect réels.</p>
            <button
              type="button"
              onClick={() => void play()}
              disabled={!done}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-ivory/80 transition-colors hover:text-ivory disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Rejouer
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
