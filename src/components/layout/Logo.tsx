import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** Monogramme : une ligne de toit et un point, la présence de l'assistant. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-8 w-8", className)} fill="none">
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M8 17.5 16 10l8 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="21" r="2.1" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={tone === "light" ? "text-champagne" : "text-champagne-deep"} />
      <span
        className={cn(
          "whitespace-nowrap font-display text-[1.35rem] leading-none tracking-[-0.01em]",
          tone === "light" ? "text-ivory" : "text-ink",
        )}
      >
        {siteConfig.name}
      </span>
    </span>
  );
}
