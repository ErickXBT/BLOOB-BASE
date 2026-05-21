import { motion } from "framer-motion";
import { Link } from "wouter";
import bloobLogo from "@assets/bloob_logo.png";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl transition-all"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img src={bloobLogo} alt="BLOOB Logo" className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-bold text-xl tracking-tight">BLOOB</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <Link href="/roadmap" className="hover:text-white transition-colors">Roadmap</Link>
          <Link href="/network" className="hover:text-white transition-colors">Network</Link>
          <Link href="/sms-wallet" className="hover:text-white transition-colors">SMS Wallet</Link>
        </nav>

        <div className="flex items-center gap-6">
          <a href="#docs" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Docs
          </a>
          <Button className="bg-primary text-white hover:bg-primary/90 font-semibold rounded-full px-6">
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}