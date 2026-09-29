import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/* Image de partage (Facebook, LinkedIn, WhatsApp…) générée au build. */

export const alt = `${siteConfig.name} : l’intelligence artificielle au service des agences immobilières en Martinique`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const serif = await readFile(join(process.cwd(), "src/fonts/instrument-serif-latin-400-normal.woff"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(120% 120% at 85% 0%, #2a2419 0%, #0d0c0a 45%, #070707 100%)",
          color: "#f3efe7",
          fontFamily: "Instrument Serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
            <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" stroke="#cfb27c" strokeOpacity="0.4" strokeWidth="1.5" />
            <path d="M8 17.5 16 10l8 7.5" stroke="#cfb27c" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="21" r="2.1" fill="#cfb27c" />
          </svg>
          <div style={{ fontSize: 38 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.04, letterSpacing: -1.5, maxWidth: 960 }}>
            L’intelligence artificielle au service de votre agence immobilière en Martinique.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 36 }}>
            <div style={{ width: 56, height: 2, background: "#cfb27c" }} />
            <div style={{ fontSize: 30, color: "#cfb27c" }}>Réponses à toute heure, qualification, rendez-vous</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Instrument Serif", data: serif, style: "normal", weight: 400 }],
    },
  );
}
