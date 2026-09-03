import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Share2,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

export interface GalleryItem {
  id: string;
  type: "video" | "photo";
  title: string;
  category: "videos" | "3d" | "memes" | "wallpapers";
  src: string;
  thumbnail?: string;
  description: string;
  resolution?: string;
  tags: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // ── 4 Videos ──
  {
    id: "vid-1",
    type: "video",
    title: "Bloob In The Cyberpunk City",
    category: "videos",
    src: "/bloob-video.mp4",
    description: "High-octane 3D cinematic of Bloob navigating the neon-lit Base network skyline.",
    resolution: "1080p HD · 60fps",
    tags: ["Cinematic", "3D Animation", "Cyberpunk", "Base"],
  },
  {
    id: "vid-2",
    type: "video",
    title: "Bloob Base Friend — Ultra High Energy",
    category: "videos",
    src: "/bloob-video2.mp4",
    description: "The derpy blue friend bouncing through decentralized cyberspace at warp speed.",
    resolution: "1080p HD · 60fps",
    tags: ["High Energy", "Dance", "3D CGI", "Bloob"],
  },
  {
    id: "vid-3",
    type: "video",
    title: "Bloob Groove & Vibe",
    category: "videos",
    src: "/bloob-video3.mp4",
    description: "Cute & derpy Bloob dancing with infinite vibes on-chain.",
    resolution: "1080p HD · 60fps",
    tags: ["Vibes", "Fun", "Community", "Animation"],
  },
  {
    id: "vid-4",
    type: "video",
    title: "Bloob SMS Relay Protocol Daemon",
    category: "videos",
    src: "/bloob-video4.mp4",
    description: "Visual depiction of the unstoppable hybrid network transferring crypto over SMS signals.",
    resolution: "1080p HD · 60fps",
    tags: ["Protocol", "Tech", "Hybrid", "Offline Crypto"],
  },

  // ── 16 Photos & Renders ──
  {
    id: "img-1",
    type: "photo",
    title: "Bloob Genesis Render",
    category: "3d",
    src: "/gallery/bloob-1.png",
    description: "The iconic derpy blue character looking forward into the Base future.",
    resolution: "4K UHD",
    tags: ["Genesis", "3D Character", "Blue", "Original"],
  },
  {
    id: "img-2",
    type: "photo",
    title: "Bloob Smiling Face",
    category: "memes",
    src: "/gallery/bloob-2.png",
    description: "Happy Bloob expression ready for the next bull run.",
    resolution: "2K QHD",
    tags: ["Meme", "Happy", "Sticker", "Community"],
  },
  {
    id: "img-3",
    type: "photo",
    title: "Bloob Curious Eyes",
    category: "3d",
    src: "/gallery/bloob-3.png",
    description: "Wide-eyed derpiness analyzing real-time on-chain transactions.",
    resolution: "2K QHD",
    tags: ["3D", "Expression", "Cute", "On-chain"],
  },
  {
    id: "img-4",
    type: "photo",
    title: "Bloob Neon Wallpaper",
    category: "wallpapers",
    src: "/gallery/bloob-4.png",
    description: "Minimalist dark aesthetic wallpaper tailored for OLED displays.",
    resolution: "4K Wallpaper",
    tags: ["OLED", "Minimal", "Wallpaper", "Dark Mode"],
  },
  {
    id: "img-5",
    type: "photo",
    title: "Bloob Surprised Derp",
    category: "memes",
    src: "/gallery/bloob-5.png",
    description: "When the portfolio jumps +420% in five minutes.",
    resolution: "High-Res",
    tags: ["Pump", "Meme", "Reaction", "Crypto"],
  },
  {
    id: "img-6",
    type: "photo",
    title: "Bloob Cybernetic Edition",
    category: "3d",
    src: "/gallery/bloob-6.png",
    description: "Futuristic digital rendering featuring holographic Base accents.",
    resolution: "3840x2160",
    tags: ["Sci-Fi", "Futuristic", "Render", "3D"],
  },
  {
    id: "img-7",
    type: "photo",
    title: "Bloob Diamond Hands",
    category: "memes",
    src: "/gallery/bloob-7.png",
    description: "Unshakable conviction throughout market volatility.",
    resolution: "High-Res",
    tags: ["HODL", "Diamond Hands", "Conviction"],
  },
  {
    id: "img-8",
    type: "photo",
    title: "Bloob Mobile Lockscreen",
    category: "wallpapers",
    src: "/gallery/bloob-8.png",
    description: "Vertical phone lockscreen art with electric cyan lighting.",
    resolution: "1080x1920",
    tags: ["Phone", "Lockscreen", "Cyan", "Mobile"],
  },
  {
    id: "img-9",
    type: "photo",
    title: "Bloob Cozy Afternoon",
    category: "3d",
    src: "/gallery/bloob-9.png",
    description: "Soft studio lighting highlighting Bloob's smooth blue silicone surface.",
    resolution: "2048x2048",
    tags: ["Studio", "Render", "Lighting", "Art"],
  },
  {
    id: "img-10",
    type: "photo",
    title: "Bloob Rocket Departure",
    category: "memes",
    src: "/gallery/bloob-10.png",
    description: "Ready for launch to the stratosphere with zero gravity.",
    resolution: "High-Res",
    tags: ["Moon", "Rocket", "Meme", "Base L2"],
  },
  {
    id: "img-11",
    type: "photo",
    title: "Bloob Abstract Geometric",
    category: "wallpapers",
    src: "/gallery/bloob-11.png",
    description: "Clean geometric composition with subtle Base blue gradient.",
    resolution: "4K Wallpaper",
    tags: ["Abstract", "Geometric", "Wallpaper"],
  },
  {
    id: "img-12",
    type: "photo",
    title: "Bloob Confused Look",
    category: "memes",
    src: "/gallery/bloob-12.png",
    description: "Classic reaction template for crypto community debates.",
    resolution: "High-Res",
    tags: ["Reaction", "Funny", "Meme", "Bloob"],
  },
  {
    id: "img-13",
    type: "photo",
    title: "Bloob Sunset Horizon",
    category: "wallpapers",
    src: "/gallery/bloob-13.png",
    description: "Warm horizon lighting casting long shadows across the digital landscape.",
    resolution: "4K Wallpaper",
    tags: ["Sunset", "Landscape", "Atmospheric"],
  },
  {
    id: "img-14",
    type: "photo",
    title: "Bloob Winking Face",
    category: "memes",
    src: "/gallery/bloob-14.png",
    description: "Winking knowing that SMS transactions settle even without Wi-Fi.",
    resolution: "High-Res",
    tags: ["Wink", "Offline", "SMS Relay", "Meme"],
  },
  {
    id: "img-15",
    type: "photo",
    title: "Bloob Studio Portrait",
    category: "3d",
    src: "/gallery/bloob-15.png",
    description: "Flawless studio key-light portrait of our beloved blue mascot.",
    resolution: "High-Res",
    tags: ["Portrait", "Render", "Official"],
  },
  {
    id: "img-16",
    type: "photo",
    title: "Bloob Midnight Cyber",
    category: "wallpapers",
    src: "/gallery/bloob-16.png",
    description: "Deep obsidian black with electric cobalt blue highlights.",
    resolution: "4K Wallpaper",
    tags: ["Obsidian", "Cobalt", "Wallpaper", "Dark"],
  },
];

export default function GalleryView() {
  const [selectedTab, setSelectedTab] = useState<"all" | "videos" | "3d" | "memes" | "wallpapers">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter items
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (selectedTab === "all") return true;
    return item.category === selectedTab;
  });

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handleCopyLink = (src: string) => {
    const fullUrl = `${window.location.origin}${src}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 text-white">
      {/* ── Gallery Hero ── */}
      <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Bloob Media Vault
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              Official CGI Videos & 4K Stills
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Bloob Community Gallery
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Explore high-energy 3D animation videos, cinematic character renders, memes, and 4K wallpapers. 
            Free to download, remix, and share across Web3 and social platforms.
          </p>
        </div>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "all", label: "🌟 All Media", count: GALLERY_ITEMS.length },
          { id: "videos", label: "🎬 3D Videos", count: GALLERY_ITEMS.filter((i) => i.type === "video").length },
          { id: "3d", label: "🎨 3D CGI Renders", count: GALLERY_ITEMS.filter((i) => i.category === "3d").length },
          { id: "memes", label: "🚀 Meme Collection", count: GALLERY_ITEMS.filter((i) => i.category === "memes").length },
          { id: "wallpapers", label: "📱 HD Wallpapers", count: GALLERY_ITEMS.filter((i) => i.category === "wallpapers").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedTab(tab.id as any);
              setLightboxIndex(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedTab === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/30 ring-1 ring-white/20"
                : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-70 font-mono">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* ── Media Masonry / Responsive Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.03, 0.3) }}
            className="group relative bg-[#12121a] border border-white/8 hover:border-primary/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-all flex flex-col cursor-pointer"
            onClick={() => setLightboxIndex(idx)}
          >
            {/* Media Container */}
            <div className="relative aspect-video sm:aspect-square bg-black/50 overflow-hidden flex items-center justify-center">
              {item.type === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.pause();
                      v.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur border border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-white">
                    <VideoIcon className="w-3 h-3 text-primary" />
                    <span>MP4 Video</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur border border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-white">
                    <ImageIcon className="w-3 h-3 text-blue-400" />
                    <span>{item.resolution || "Photo"}</span>
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>

            {/* Content Bottom Bar */}
            <div className="p-3.5 flex flex-col justify-between flex-1 bg-[#12121a]">
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/6 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1 overflow-hidden truncate">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-primary font-bold">
                  {item.type === "video" ? "Watch ▶" : "View ↗"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Modal Header */}
            <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-white font-bold">
                  {lightboxIndex! + 1} / {filteredItems.length}
                </span>
                <div>
                  <h3 className="font-black text-base text-white">{activeLightboxItem.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {activeLightboxItem.resolution}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(activeLightboxItem.src)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Copy link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
                <a
                  href={activeLightboxItem.src}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="Download media"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Middle Main Preview */}
            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white hover:scale-110 transition-all shadow-2xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {activeLightboxItem.type === "video" ? (
                <video
                  src={activeLightboxItem.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl border border-white/10"
                />
              ) : (
                <img
                  src={activeLightboxItem.src}
                  alt={activeLightboxItem.title}
                  className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              )}

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white hover:scale-110 transition-all shadow-2xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption & Tags */}
            <div
              className="z-10 max-w-2xl mx-auto text-center space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs sm:text-sm text-muted-foreground">
                {activeLightboxItem.description}
              </p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {activeLightboxItem.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
