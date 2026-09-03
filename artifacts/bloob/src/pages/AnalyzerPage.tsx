import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import TokenAnalyzerView from "@/components/analyzer/TokenAnalyzerView";

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-8 pt-28 pb-16">
        <TokenAnalyzerView />
      </main>
      <Footer />
    </div>
  );
}
