import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BreakScreenProps {
  type: "intro" | "mid" | "final";
  onContinue: () => void;
}

const CONTENT = {
  intro: {
    title: "Now, we're getting somewhere...",
    gif: "https://media.tenor.com/w1vZgY_aVp4AAAAC/the-office-michael-scott.gif",
    button: "Let's Go"
  },
  mid: {
    title: "Homestretch!",
    gif: "https://media.tenor.com/C2_dF6F3A6MAAAAC/almost-there-almost.gif",
    button: "Finish Strong"
  },
  final: {
    title: "Mission Accomplished...",
    gif: "https://media.tenor.com/2K1lW_q6gYsAAAAC/mission-accomplished.gif",
    button: "See Results"
  }
};

export function BreakScreen({ type, onContinue }: BreakScreenProps) {
  const content = CONTENT[type];
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-[#f7f5f5] mb-8">
        {content.title}
      </h2>
      
      <div className="w-full max-w-md rounded-[7px] overflow-hidden shadow-2xl border border-white/10 mb-8 transform hover:scale-[1.02] transition-transform duration-500">
        <img 
          src={content.gif} 
          alt={content.title}
          className="w-full h-auto object-cover"
        />
      </div>

      <Button 
        onClick={onContinue}
        size="lg"
        className="animate-bounce"
      >
        {content.button}
      </Button>
    </motion.div>
  );
}
