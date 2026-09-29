"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Délai en millisecondes, pour décaler l'apparition d'éléments voisins. */
  delay?: number;
  id?: string;
};

/**
 * Fait apparaître son contenu en douceur lorsqu'il entre dans l'écran.
 * Sans JavaScript ou avec « réduire les animations », le contenu est visible immédiatement.
 */
export function Reveal({ children, as: Tag = "div", className, delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn("reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
