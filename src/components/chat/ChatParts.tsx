import type { ReactNode } from "react";
import { LogoMark } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

export function AgentAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-ink-3 to-ink text-champagne ring-1 ring-champagne/30",
        className,
      )}
    >
      <LogoMark className="h-5 w-5 [&>rect]:hidden" />
    </span>
  );
}

type BubbleProps = {
  from: "client" | "agent";
  children: ReactNode;
  animate?: boolean;
};

export function ChatBubble({ from, children, animate = true }: BubbleProps) {
  const isAgent = from === "agent";
  return (
    <div className={cn("flex items-end gap-2.5", isAgent ? "justify-start" : "justify-end", animate && "animate-rise")}>
      {isAgent ? <AgentAvatar /> : null}
      <div
        className={cn(
          "max-w-[82%] whitespace-pre-line px-4 py-3 text-[14.5px] leading-relaxed",
          isAgent
            ? "rounded-2xl rounded-bl-md border border-ivory/[0.08] bg-ivory/[0.06] text-ivory"
            : "rounded-2xl rounded-br-md bg-champagne text-ink",
        )}
      >
        <span className="visually-hidden">{isAgent ? "Assistant : " : "Prospect : "}</span>
        {children}
      </div>
    </div>
  );
}

export function TypingIndicator({ label = "L’assistant écrit" }: { label?: string }) {
  return (
    <div className="flex items-end gap-2.5 animate-rise" role="status">
      <AgentAvatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-ivory/[0.08] bg-ivory/[0.06] px-4 py-3.5">
        <span className="visually-hidden">{label}…</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-champagne animate-typing"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SimulationBadge({ children = "Simulation" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/35 bg-champagne/10 px-2.5 py-1 text-[12px] font-medium text-champagne-light">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-champagne" />
      {children}
    </span>
  );
}
