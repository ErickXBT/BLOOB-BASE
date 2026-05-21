import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import HybridArchitecture from "@/components/sections/HybridArchitecture";
import Features from "@/components/sections/Features";
import AiAssistant from "@/components/sections/AiAssistant";
import Merchant from "@/components/sections/Merchant";
import HowItWorks from "@/components/sections/HowItWorks";
import Roadmap from "@/components/sections/Roadmap";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col relative w-full overflow-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <HybridArchitecture />
        <Features />
        <AiAssistant />
        <Merchant />
        <HowItWorks />
        <Roadmap />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}