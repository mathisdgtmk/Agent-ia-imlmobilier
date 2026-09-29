import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import "./globals.css";

/* Polices auto-hébergées (aucun appel à Google Fonts : plus rapide et conforme RGPD). */
const instrument = localFont({
  src: [
    { path: "../fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const geist = localFont({
  src: "../fonts/geist-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-geist",
  display: "swap",
});

const title = "Agent IA immobilier en Martinique | Assistant intelligent pour agences";
const description =
  "Un agent IA configuré pour les agences immobilières de Martinique : réponses aux prospects à toute heure, qualification des demandes et prise de rendez-vous. Demandez une démonstration.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: `%s | ${siteConfig.name}` },
  description,
  applicationName: siteConfig.name,
  keywords: [
    "agent IA immobilier Martinique",
    "intelligence artificielle agence immobilière Martinique",
    "automatisation agence immobilière Martinique",
    "assistant virtuel immobilier Martinique",
    "chatbot immobilier Martinique",
    "IA agence immobilière Antilles",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  other: { "geo.region": "MQ", "geo.placename": "Martinique" },
};

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${instrument.variable} ${geist.variable}`}>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}[data-line]{transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
