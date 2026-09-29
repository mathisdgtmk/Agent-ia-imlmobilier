import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { AgentShowcase } from "@/components/sections/AgentShowcase";
import { Benefits } from "@/components/sections/Benefits";
import { Martinique } from "@/components/sections/Martinique";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { InteractiveDemo } from "@/components/sections/InteractiveDemo";
import { Audiences } from "@/components/sections/Audiences";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { createRemoteProvider } from "@/lib/ai/remote-provider";
import { getDeliveryMode } from "@/lib/contact/deliver";

export default function HomePage() {
  // Lu côté serveur uniquement : aucune clé n'est transmise au navigateur.
  const liveMode = createRemoteProvider() !== null;
  const deliveryConfigured = getDeliveryMode() !== "demo";

  return (
    <>
      <JsonLd />
      <Navbar />
      <main id="contenu">
        <Hero />
        <Problems />
        <AgentShowcase />
        <Benefits />
        <Martinique />
        <HowItWorks />
        <InteractiveDemo liveMode={liveMode} />
        <Audiences />
        <Faq />
        <Contact deliveryConfigured={deliveryConfigured} />
      </main>
      <Footer />
    </>
  );
}
