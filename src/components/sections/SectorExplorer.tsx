"use client";

import { Info, MapPin } from "lucide-react";
import { useId, useState } from "react";
import { siteConfig } from "@/config/site";
import { martinique } from "@/content/home";
import { withPreposition } from "@/lib/ai/sector-utils";
import { cn } from "@/lib/utils";

/** Choix d'une commune : aperçu de ce que l'agent peut préciser une fois configuré. */
export function SectorExplorer() {
  const sectors = siteConfig.featuredSectors;
  const [selected, setSelected] = useState<string>(sectors[1] ?? sectors[0]!);
  const panelId = useId();

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h3 className="font-display text-[1.65rem] leading-tight text-ivory">{martinique.sectorsLabel}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{martinique.sectorsHint}</p>

      <div role="group" aria-label="Communes" className="mt-6 flex flex-wrap gap-2">
        {sectors.map((sector) => {
          const isSelected = sector === selected;
          return (
            <button
              key={sector}
              type="button"
              aria-pressed={isSelected}
              aria-controls={panelId}
              onClick={() => setSelected(sector)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] transition-[background-color,border-color,color] duration-300",
                isSelected
                  ? "border-champagne bg-champagne text-ink"
                  : "border-ivory/15 text-ivory/80 hover:border-champagne/60 hover:text-ivory",
              )}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {sector}
            </button>
          );
        })}
      </div>

      <div id={panelId} aria-live="polite" className="mt-6 rounded-2xl border border-ivory/[0.08] bg-ink/60 p-5">
        <p className="text-[13px] text-mist">
          Exemple : pour une demande {withPreposition(selected)}, l’agent peut préciser
        </p>
        <ul key={selected} className="mt-3 space-y-2.5">
          {martinique.sectorExample.map((line, i) => (
            <li
              key={line}
              className="flex gap-3 text-[14.5px] leading-relaxed text-ivory/90 animate-rise"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-champagne" />
              {line.replace("{sector}", withPreposition(selected))}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 flex gap-2.5 text-[13px] leading-relaxed text-mist">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
        {martinique.disclaimer}
      </p>
    </div>
  );
}
