import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-[0.2em] text-[#f7f5f5] uppercase mb-6">
          Brand Strategy Tool
        </span>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#f7f5f5] mb-6 leading-[0.9]">
          Discover Your <br />
          <span className="text-[#660000]">Brand Archetype</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#f7f5f5]/70 max-w-xl mx-auto mb-10 font-light leading-relaxed">
          Every great brand has a soul. Uncover the core identity that drives your business, connects with your audience, and sets you apart.
        </p>

        <Link href="/quiz">
          <Button 
            size="lg" 
            className="text-lg px-12 py-8 rounded-[7px] shadow-2xl shadow-[#660000]/20 hover:shadow-[#660000]/40 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            Start Assessment
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-[#f7f5f5]/20 text-xs uppercase tracking-widest"
      >
        The Brand Revivalist
      </motion.div>
    </div>
  );
}
