import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BreakScreenProps {
  type: "intro" | "mid" | "final";
  onContinue: () => void;
}

const CONTENT = {
  intro: {
    title: "Ready to find your Brand Archetype?",
    subtitle: "Now, we're getting somewhere...",
    gif: "https://media.tenor.com/w1vZgY_aVp4AAAAC/the-office-michael-scott.gif",
    button: "Let's Go"
  },
  mid: {
    title: "You're doing great!",
    subtitle: "Homestretch! You're almost there.",
    gif: "https://media.tenor.com/C2_dF6F3A6MAAAAC/almost-there-almost.gif",
    button: "Continue"
  },
  final: {
    title: "Mission Accomplished...",
    subtitle: "Time to see the results.",
    gif: "https://media.tenor.com/2K1lW_q6gYsAAAAC/mission-accomplished.gif",
    button: "See Results"
  }
};

export function BreakScreen({ type, onContinue }: BreakScreenProps) {
  const content = CONTENT[type];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-serif text-[#0f0f1a]">{content.title}</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">{content.subtitle}</p>
      </div>
      
      <div className="w-full rounded-[7px] overflow-hidden shadow-sm border border-gray-100 max-h-56">
        <img 
          src={content.gif} 
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>

      <Button 
        onClick={onContinue}
        size="lg"
        className="w-full font-bold uppercase tracking-widest h-11"
      >
        {content.button}
      </Button>
    </motion.div>
  );
}
