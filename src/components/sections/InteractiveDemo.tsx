"use client";

import { ArrowUp, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { DEFAULT_SUGGESTIONS, WELCOME_MESSAGE } from "@/lib/ai/demo-copy";
import { initialDemoState, type ChatMessage, type ChatResponse, type DemoState, type LeadKey } from "@/lib/ai/types";
import { ChatBubble, SimulationBadge, TypingIndicator, AgentAvatar } from "@/components/chat/ChatParts";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const LEAD_LABELS: { key: LeadKey; label: string }[] = [
  { key: "projet", label: "Projet" },
  { key: "secteur", label: "Secteur" },
  { key: "bien", label: "Type de bien" },
  { key: "budget", label: "Budget" },
  { key: "echeance", label: "Échéance" },
  { key: "suite", label: "Suite donnée" },
];

const MAX_LENGTH = 500;
const MAX_TURNS = 14;

type Entry = { role: "user" | "assistant" | "notice"; content: string };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function InteractiveDemo({ liveMode }: { liveMode: boolean }) {
  const [entries, setEntries] = useState<Entry[]>([{ role: "assistant", content: WELCOME_MESSAGE }]);
  const [state, setState] = useState<DemoState>(initialDemoState);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [fresh, setFresh] = useState<LeadKey[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userTurns = entries.filter((e) => e.role === "user").length;
  const limitReached = userTurns >= MAX_TURNS;

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [entries, pending]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_LENGTH);
    if (!content || pending || limitReached) return;

    const next: Entry[] = [...entries, { role: "user", content }];
    setEntries(next);
    setInput("");
    setSuggestions([]);
    setPending(true);

    const messages: ChatMessage[] = next
      .filter((e): e is Entry & { role: "user" | "assistant" } => e.role !== "notice")
      .map((e) => ({ role: e.role, content: e.content }))
      .slice(-20);

    const startedAt = performance.now();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages, state }),
      });
      const data = (await res.json().catch(() => null)) as (ChatResponse & { error?: string }) | null;
      if (!res.ok || !data || typeof data.reply !== "string") {
        throw new Error(data?.error ?? "La démonstration est momentanément indisponible. Réessayez dans un instant.");
      }

      // Délai de « saisie » proportionnel à la longueur de la réponse.
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = reduce ? 0 : Math.min(500 + data.reply.length * 9, 1600);
      const elapsed = performance.now() - startedAt;
      if (elapsed < target) await wait(target - elapsed);

      const changed = LEAD_LABELS.map((f) => f.key).filter((k) => data.state.lead[k] !== state.lead[k]);
      setFresh(changed);
      setState(data.state);
      setEntries((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setSuggestions(data.suggestions ?? []);
    } catch (error) {
      setEntries((prev) => [...prev, { role: "notice", content: (error as Error).message }]);
      setSuggestions(DEFAULT_SUGGESTIONS);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  function reset() {
    setEntries([{ role: "assistant", content: WELCOME_MESSAGE }]);
    setState(initialDemoState);
    setSuggestions(DEFAULT_SUGGESTIONS);
    setFresh([]);
    setInput("");
    inputRef.current?.focus();
  }

  const filled = LEAD_LABELS.filter((f) => state.lead[f.key]).length;

  return (
    <section id="demo" aria-labelledby="demo-title" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-champagne/[0.06] blur-[120px]"
      />
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="demo-title"
            title="Essayez l’agent en situation."
            className="lg:col-span-7"
          />
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-mist lg:col-span-5 lg:justify-self-end">
            {liveMode
              ? "Posez une question ou choisissez une suggestion. Cet assistant de démonstration est relié à un modèle d’IA, avec des consignes limitées à la démonstration."
              : "Posez une question ou choisissez une suggestion. Les réponses proviennent d’un scénario de démonstration prédéfini : aucun agent n’est relié à une agence réelle."}
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <div className="glass overflow-hidden rounded-[28px] shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9)]">
            {/* Barre d'outil */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory/[0.08] bg-ink-2/70 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <AgentAvatar className="h-9 w-9" />
                <div>
                  <p className="text-[14.5px] font-medium text-ivory">Assistant de l’agence de démonstration</p>
                  <p className="text-[12.5px] text-mist">
                    {liveMode ? "Mode connecté, consignes de démonstration" : "Scénario prédéfini"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SimulationBadge>{liveMode ? "Démonstration connectée" : "Démonstration"}</SimulationBadge>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] text-ivory/75 transition-colors hover:bg-ivory/10 hover:text-ivory"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Recommencer
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px]">
              {/* Conversation */}
              <div className="flex min-w-0 flex-col bg-ink-2/40">
                <div
                  ref={logRef}
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions"
                  aria-label="Conversation avec l’assistant de démonstration"
                  className="thin-scroll h-[440px] space-y-3.5 overflow-y-auto px-4 py-6 sm:h-[480px] sm:px-6"
                >
                  {entries.map((entry, i) =>
                    entry.role === "notice" ? (
                      <p
                        key={i}
                        role="alert"
                        className="mx-auto max-w-md rounded-xl border border-champagne/30 bg-champagne/10 px-4 py-2.5 text-center text-[13px] text-champagne-light"
                      >
                        {entry.content}
                      </p>
                    ) : (
                      <ChatBubble key={i} from={entry.role === "user" ? "client" : "agent"}>
                        {entry.content}
                      </ChatBubble>
                    ),
                  )}
                  {pending ? <TypingIndicator /> : null}
                </div>

                <div className="border-t border-ivory/[0.08] px-4 pb-4 pt-3 sm:px-6 sm:pb-5">
                  {suggestions.length && !pending && !limitReached ? (
                    <div className="mb-3 flex gap-2 overflow-x-auto pb-1 thin-scroll" aria-label="Suggestions de réponses">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => void send(s)}
                          className="shrink-0 rounded-full border border-ivory/15 bg-ivory/[0.03] px-3.5 py-2 text-[13px] text-ivory/85 transition-[background-color,border-color,color] duration-300 hover:border-champagne/60 hover:bg-champagne/10 hover:text-ivory"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {limitReached ? (
                    <p className="rounded-xl bg-ivory/[0.05] px-4 py-3 text-[13.5px] text-mist">
                      Fin de la démonstration. Recommencez, ou demandez une démonstration personnalisée pour votre
                      agence.
                    </p>
                  ) : (
                    <form onSubmit={onSubmit} className="flex items-center gap-2">
                      <label htmlFor="demo-input" className="visually-hidden">
                        Votre message
                      </label>
                      <input
                        ref={inputRef}
                        id="demo-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        maxLength={MAX_LENGTH}
                        autoComplete="off"
                        placeholder="Écrivez votre message…"
                        className="h-12 min-w-0 flex-1 rounded-xl border border-ivory/12 bg-ink/70 px-4 text-[15px] text-ivory placeholder:text-ivory/35 transition-colors focus:border-champagne/70 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={pending || !input.trim()}
                        aria-label="Envoyer le message"
                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-champagne text-ink transition-[background-color,opacity] hover:bg-champagne-light disabled:opacity-40"
                      >
                        <ArrowUp className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </form>
                  )}
                  <p className="mt-3 text-[12px] text-mist">
                    Démonstration publique : n’indiquez aucune donnée personnelle.
                  </p>
                </div>
              </div>

              {/* Fiche générée */}
              <aside
                aria-label="Fiche prospect générée par l’assistant"
                className="border-t border-ivory/[0.08] bg-ink-2/70 px-5 py-6 sm:px-6 lg:border-l lg:border-t-0"
              >
                <p className="text-[14px] font-medium text-ivory">Ce que votre équipe reçoit</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-mist">
                  La fiche se complète au fil de l’échange.
                </p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-ivory/10">
                  <div
                    className="h-full rounded-full bg-champagne transition-[width] duration-700 ease-(--ease-soft)"
                    style={{ width: `${(filled / LEAD_LABELS.length) * 100}%` }}
                  />
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-1">
                  {LEAD_LABELS.map((field) => {
                    const value = state.lead[field.key];
                    return (
                      <div key={field.key} className="rounded-xl border border-ivory/[0.06] bg-ink/40 px-3.5 py-3">
                        <dt className="text-[11.5px] text-mist">{field.label}</dt>
                        <dd
                          className={cn(
                            "mt-1 text-[13.5px] leading-snug transition-colors duration-700",
                            value ? (fresh.includes(field.key) ? "text-champagne-light" : "text-ivory") : "text-ivory/25",
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
        </Reveal>
      </Container>
    </section>
  );
}
