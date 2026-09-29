import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8", className)}>{children}</div>;
}

type SectionHeadingProps = {
  title: string;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  id?: string;
  as?: "h2" | "h3";
};

/** Titre de section : grande capitale serif, texte d'introduction facultatif. */
export function SectionHeading({
  title,
  intro,
  tone = "dark",
  align = "left",
  className,
  id,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <Tag
        id={id}
        className={cn(
          "font-display text-[2.35rem] leading-[1.04] tracking-[-0.015em] sm:text-5xl lg:text-[3.6rem]",
          tone === "dark" ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {intro ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-[1.0625rem] leading-relaxed",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-mist" : "text-stone",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
