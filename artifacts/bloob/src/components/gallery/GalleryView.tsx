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
  // ── 15 Grok 3D Animation Videos ──
  {
    id: "vid-1",
    type: "video",
    title: "Bloob Cyberpunk City Neon Rush",
    category: "videos",
    src: "/gallery/videos/bloob-vid-1.mp4",
    description: "High-octane 3D CGI cinematic of Bloob navigating the neon-lit Base network skyline.",
    resolution: "1080p HD · 60fps",
    tags: ["Cinematic", "3D Animation", "Cyberpunk", "Base"],
  },
  {
    id: "vid-2",
    type: "video",
    title: "Bloob Base Friend — Warp Speed Hyperdrive",
    category: "videos",
    src: "/gallery/videos/bloob-vid-2.mp4",
    description: "The derpy blue friend bouncing through decentralized cyberspace at warp speed.",
    resolution: "1080p HD · 60fps",
    tags: ["High Energy", "Warp Speed", "3D CGI", "Bloob"],
  },
  {
    id: "vid-3",
    type: "video",
    title: "Bloob Infinite Rhythm & Vibe",
    category: "videos",
    src: "/gallery/videos/bloob-vid-3.mp4",
    description: "Cute & derpy Bloob dancing with infinite vibes and infectious energy on-chain.",
    resolution: "1080p HD · 60fps",
    tags: ["Vibes", "Groove", "Community", "Animation"],
  },
  {
    id: "vid-4",
    type: "video",
    title: "Bloob SMS Relay Network Protocol",
    category: "videos",
    src: "/gallery/videos/bloob-vid-4.mp4",
    description: "Visual depiction of the unstoppable hybrid network transferring crypto over SMS signals.",
    resolution: "1080p HD · 60fps",
    tags: ["Protocol", "Tech", "Hybrid", "Offline Crypto"],
  },
  {
    id: "vid-5",
    type: "video",
    title: "Bloob Holographic Data Sphere",
    category: "videos",
    src: "/gallery/videos/bloob-vid-5.mp4",
    description: "Bloob interacting with futuristic decentralized data clusters in real-time.",
    resolution: "1080p HD · 60fps",
    tags: ["Hologram", "3D", "Futuristic", "Web3"],
  },
  {
    id: "vid-6",
    type: "video",
    title: "Bloob Quantum Bounce Celebration",
    category: "videos",
    src: "/gallery/videos/bloob-vid-6.mp4",
    description: "Euphoric victory dance celebrating instant zero-fee offline block settlement.",
    resolution: "1080p HD · 60fps",
    tags: ["Celebration", "Dance", "Bloob", "Fun"],
  },
  {
    id: "vid-7",
    type: "video",
    title: "Bloob Supercharged Base Sprint",
    category: "videos",
    src: "/gallery/videos/bloob-vid-7.mp4",
    description: "High-speed sprint across the lightning-fast Layer 2 Base ecosystem rails.",
    resolution: "1080p HD · 60fps",
    tags: ["Speed", "Base L2", "Sprint", "High Energy"],
  },
  {
    id: "vid-8",
    type: "video",
    title: "Bloob Kinetic Power Stomp",
    category: "videos",
    src: "/gallery/videos/bloob-vid-8.mp4",
    description: "Pumping raw energy into decentralized community liquidity pools.",
    resolution: "1080p HD · 60fps",
    tags: ["Kinetic", "Power", "3D Motion", "Bloob"],
  },
  {
    id: "vid-9",
    type: "video",
    title: "Bloob Galactic Floating Orbit",
    category: "videos",
    src: "/gallery/videos/bloob-vid-9.mp4",
    description: "Zero-gravity orbital drift showcasing Bloob's smooth blue silicone surface in space.",
    resolution: "1080p HD · 60fps",
    tags: ["Space", "Zero Gravity", "Orbit", "Render"],
  },
  {
    id: "vid-10",
    type: "video",
    title: "Bloob Neon Cyber Tunnel Run",
    category: "videos",
    src: "/gallery/videos/bloob-vid-10.mp4",
    description: "Dashing through glowing fiber-optic conduits delivering peer-to-peer payload packets.",
    resolution: "1080p HD · 60fps",
    tags: ["Neon", "Tunnel", "P2P", "Cyber"],
  },
  {
    id: "vid-11",
    type: "video",
    title: "Bloob High-Frequency Trading Groove",
    category: "videos",
    src: "/gallery/videos/bloob-vid-11.mp4",
    description: "Synchronized cadence of automated smart order routing and instant fills.",
    resolution: "1080p HD · 60fps",
    tags: ["Trading", "Groove", "Finance", "Algo"],
  },
  {
    id: "vid-12",
    type: "video",
    title: "Bloob Unstoppable Momentum Loop",
    category: "videos",
    src: "/gallery/videos/bloob-vid-12.mp4",
    description: "Hypnotic continuous loop of Bloob's iconic stride powering the community forward.",
    resolution: "1080p HD · 60fps",
    tags: ["Loop", "Momentum", "Community", "Conviction"],
  },
  {
    id: "vid-13",
    type: "video",
    title: "Bloob Electric Blue Pulse",
    category: "videos",
    src: "/gallery/videos/bloob-vid-13.mp4",
    description: "Illuminating the digital dark with incandescent Base cobalt blue bioluminescence.",
    resolution: "1080p HD · 60fps",
    tags: ["Electric", "Pulse", "Base Blue", "Glow"],
  },
  {
    id: "vid-14",
    type: "video",
    title: "Bloob Cybernetic Friend Awakening",
    category: "videos",
    src: "/gallery/videos/bloob-vid-14.mp4",
    description: "The spark of decentralized artificial intelligence coming alive in the Bloob network.",
    resolution: "1080p HD · 60fps",
    tags: ["Awakening", "AI", "Friend", "3D CGI"],
  },
  {
    id: "vid-15",
    type: "video",
    title: "Bloob Dimensional Portal Jump",
    category: "videos",
    src: "/gallery/videos/bloob-vid-15.mp4",
    description: "Cross-chain teleporter bridging seamlessly between Solana, Base, BSC, and RWA stocks.",
    resolution: "1080p HD · 60fps",
    tags: ["Portal", "Cross-Chain", "Bridge", "Multi-Chain"],
  },

  // ── Authentic Bloob Photos, 3D Renders & Wallpapers ──
  {
    id: "img-offline-billboard",
    type: "photo",
    title: "Times Square — Send Crypto Offline",
    category: "3d",
    src: "/gallery/photos/bloob-send-offline.jpeg",
    description: "Bloob standing proud in Times Square holding a smartphone showing 0.25 ETH Sent Offline successfully. 'No Internet. No Problem.'",
    resolution: "Ultra HD · 4K",
    tags: ["Offline Crypto", "Times Square", "3D Character", "Billboard"],
  },
  {
    id: "img-sms-nokia",
    type: "photo",
    title: "Nokia 3310 SMS Relay Protocol",
    category: "memes",
    src: "/gallery/photos/bloob-sms-nokia.jpeg",
    description: "Bloob orchestrating an SMS crypto transfer on a classic Nokia phone: 'Simple. Secure. Offline. Send crypto. No internet. No problem.'",
    resolution: "Ultra HD · 4K",
    tags: ["Nokia", "SMS Transfer", "Meme", "Offline Freedom"],
  },
  {
    id: "img-coffee-hangout",
    type: "photo",
    title: "Good Coffee, Good People, No Internet",
    category: "wallpapers",
    src: "/gallery/photos/bloob-coffee-shop.jpeg",
    description: "Bloob squad chilling at the cozy local coffee shop under neon sign: 'Good Coffee. Good People. No Internet. No Problem.'",
    resolution: "Ultra HD · 4K",
    tags: ["Coffee Shop", "Cozy", "Vibes", "Wallpaper"],
  },
  {
    id: "img-crypto-trader",
    type: "photo",
    title: "Trading Desk — Focus, Plan, Trade, Freedom",
    category: "memes",
    src: "/gallery/photos/bloob-trader.jpeg",
    description: "Bloob analyzing real-time candlestick charts with trading notebook: Stay focused, manage risk, be patient, financial freedom.",
    resolution: "Ultra HD · 4K",
    tags: ["Trading Desk", "Candlestick", "Charts", "Discipline"],
  },
  {
    id: "img-offline-architect",
    type: "photo",
    title: "Offline Hub Prototype Blueprint",
    category: "3d",
    src: "/gallery/photos/bloob-offline-architect.jpeg",
    description: "Bloob engineering the future with holographic Offline Hub prototype, Bluetooth mesh diagrams, and encrypted local storage architecture.",
    resolution: "Ultra HD · 4K",
    tags: ["Architecture", "Prototype", "Hologram", "Engineering"],
  },
  {
    id: "img-morning-newspaper",
    type: "photo",
    title: "GM IRL — Simple Morning, Real Freedom",
    category: "wallpapers",
    src: "/gallery/photos/bloob-morning-newspaper.jpeg",
    description: "Cozy morning sunlight streaming in as Bloob enjoys warm coffee and reads the front page: 'GM, IRL — No Internet. No Rush. Just You.'",
    resolution: "Ultra HD · 4K",
    tags: ["GM", "Morning", "Coffee", "Wallpaper"],
  },
  {
    id: "img-beach-relax",
    type: "photo",
    title: "Beach Day — No WiFi No Problem Just Freedom",
    category: "wallpapers",
    src: "/gallery/photos/bloob-beach-freedom.jpeg",
    description: "Bloob relaxing in a beach lounger with a coconut and retro Nokia phone against a stunning golden hour tropical sunset.",
    resolution: "Ultra HD · 4K",
    tags: ["Beach", "Tropical", "Sunset", "Freedom"],
  },
  {
    id: "img-hydroponics",
    type: "photo",
    title: "Greenhouse — Focus, Plant, Grow, Freedom",
    category: "3d",
    src: "/gallery/photos/bloob-hydroponics.jpeg",
    description: "Bloob tending to fresh hydroponic greens in an automated greenhouse: 'Clean Food, Clean Future, Offline System, Online Impact.'",
    resolution: "Ultra HD · 4K",
    tags: ["Hydroponics", "Eco", "Sustainable", "3D Render"],
  },
  {
    id: "img-night-drive",
    type: "photo",
    title: "Midnight Drive — Simple, Secure, Offline",
    category: "wallpapers",
    src: "/gallery/photos/bloob-night-drive.jpeg",
    description: "Atmospheric rainy city drive at night with neon reflections on the windshield and Bloob behind the wheel keeping it simple.",
    resolution: "Ultra HD · 4K",
    tags: ["Night Drive", "Cyber City", "Cinematic", "Wallpaper"],
  },
  {
    id: "img-golf-champion",
    type: "photo",
    title: "Championship Swing — Focus, Plan, Succeed",
    category: "3d",
    src: "/gallery/photos/bloob-golf.jpeg",
    description: "Bloob dressed in classic golf visor and polo lining up a driver shot on the 18th hole overlooking a skyline lake.",
    resolution: "Ultra HD · 4K",
    tags: ["Golf", "Sports", "Focus", "3D Render"],
  },
  {
    id: "img-mcdonalds-feast",
    type: "photo",
    title: "The McDonald's Feast — Focus Fuel Freedom",
    category: "memes",
    src: "/gallery/photos/bloob-mcdonalds.jpeg",
    description: "The ultimate crypto community rite of passage: Bloob savoring a double cheeseburger meal at McDonald's.",
    resolution: "Ultra HD · 4K",
    tags: ["McDonalds", "Burger", "Meme", "Fuel"],
  },
  {
    id: "img-official-pfp",
    type: "photo",
    title: "Bloob Genesis Official Avatar",
    category: "memes",
    src: "/gallery/photos/bloob-official-avatar.png",
    description: "The iconic sticker avatar of Bloob with bold white silhouette border on electric Base Blue.",
    resolution: "Vector High-Res",
    tags: ["Avatar", "PFP", "Official", "Base Blue"],
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
                    preload="metadata"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onMouseEnter={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.play().catch(() => {});
                    }}
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
