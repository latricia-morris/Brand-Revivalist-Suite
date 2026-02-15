import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#f7f5f5] text-[#0f0f1a]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-[#660000]/5 border border-[#660000]/10 text-[10px] font-bold tracking-[0.2em] text-[#660000] uppercase mb-6">
          Brand Strategy Tool
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#0f0f1a] mb-6 leading-tight">
          Let's Reveal Your <br />
          <span className="text-[#660000]">Brand Persona</span>
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 font-light leading-relaxed">
          Every great brand has a soul. Uncover the core identity that drives your business, connects with your audience, and sets you apart.
        </p>

        <Link href="/quiz">
          <Button 
            size="lg" 
            className="text-sm px-10 py-6 rounded-[7px] font-bold uppercase tracking-widest shadow-lg shadow-[#660000]/10 hover:shadow-[#660000]/20 transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            Start Assessment
            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-muted-foreground/30 text-[10px] uppercase tracking-[0.3em] font-bold"
      >
        The Brand Revivalist
      </motion.div>
    </div>
  );
}
