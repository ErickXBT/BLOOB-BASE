import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import GalleryView from "@/components/gallery/GalleryView";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-8 pt-28 pb-16">
        <GalleryView />
      </main>
      <Footer />
    </div>
  );
}
