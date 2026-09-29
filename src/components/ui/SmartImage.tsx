"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image optimisée qui s'efface proprement si le fichier ne peut pas être
 * chargé : le fond dégradé du conteneur prend alors le relais.
 */
export function SmartImage({ className, onLoad, ...props }: ImageProps) {
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");

  if (state === "failed") return null;

  return (
    <Image
      {...props}
      alt={props.alt}
      className={cn(
        "transition-opacity duration-700 ease-(--ease-soft)",
        state === "loaded" ? "opacity-100" : "opacity-0",
        className,
      )}
      onLoad={(event) => {
        setState("loaded");
        onLoad?.(event);
      }}
      onError={() => setState("failed")}
    />
  );
}
