import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { questions, ARCHETYPE_PRIORITY } from "@/lib/quiz-data";
import { Archetype } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";
import { BreakScreen } from "@/components/BreakScreen";
import { Share2, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

type QuizStep = "question" | "break-intro" | "break-mid" | "gate" | "results";

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<Archetype, number>>({
    Ruler: 0, Hero: 0, Magician: 0, Outlaw: 0, Explorer: 0, Creator: 0,
    Lover: 0, Caregiver: 0, Everyman: 0, Jester: 0, Sage: 0, Innocent: 0
  });
  const [answersLog, setAnswersLog] = useState<Record<string, string>>({});
  const [step, setStep] = useState<QuizStep>("break-intro");
  const [leadName, setLeadName] = useState("");

  // Calculate Progress
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  // Handle Answer Click
  const handleAnswer = (answerIdx: number) => {
    const question = questions[currentQuestionIndex];
    const answer = question.answers[answerIdx];

    // Log text answer for GHL
    setAnswersLog(prev => ({
      ...prev,
      [`Q${question.id}: ${question.text}`]: answer.text
    }));

    // Update Scores
    setScores(prev => {
      const newScores = { ...prev };
      Object.entries(answer.scores).forEach(([archetype, score]) => {
        if (archetype && score) {
          newScores[archetype as Archetype] += score;
        }
      });
      return newScores;
    });

    // Determine Next Step
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex === 7) {
      setStep("break-mid");
      setCurrentQuestionIndex(nextIndex);
    } else if (nextIndex === 18) { // End of questions
      setStep("gate");
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  // Determine Results
  const resultData = useMemo(() => {
    const sortedArchetypes = Object.entries(scores)
      .sort((a, b) => {
        // Sort by score descending
        if (b[1] !== a[1]) return b[1] - a[1];
        // Tie-breaker by priority
        return ARCHETYPE_PRIORITY.indexOf(a[0] as Archetype) - ARCHETYPE_PRIORITY.indexOf(b[0] as Archetype);
      });

    return {
      primary: sortedArchetypes[0][0],
      primaryScore: sortedArchetypes[0][1],
      secondary: sortedArchetypes[1][0],
      secondaryScore: sortedArchetypes[1][1],
    };
  }, [scores]);

  // Handle Share
  const handleShare = async () => {
    const text = `I'm a ${resultData.primary}! Know your brand archetype? Prove it. Take the quiz.`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Brand Archetype Quiz", text, url });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      alert("Link copied to clipboard!");
    }
  };

  // Confetti on Results
  useEffect(() => {
    if (step === "results") {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Render Component based on Step
  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Progress Bar (Visible only during questions) */}
      {(step === "question" || step === "break-mid") && (
        <div className="w-full max-w-xl mb-8 space-y-2">
          <div className="flex justify-between text-xs text-[#f7f5f5]/60 font-medium tracking-widest uppercase">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "break-intro" && (
          <BreakScreen 
            key="intro" 
            type="intro" 
            onContinue={() => setStep("question")} 
          />
        )}

        {step === "break-mid" && (
          <BreakScreen 
            key="mid" 
            type="mid" 
            onContinue={() => setStep("question")} 
          />
        )}

        {step === "question" && (
          <motion.div
            key={`q-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl"
          >
            <div className="glass-card rounded-[7px] p-6 md:p-10">
              <span className="text-[#660000] font-bold tracking-widest text-sm uppercase mb-4 block">
                Question {questions[currentQuestionIndex].id} of {questions.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#f7f5f5] mb-8 leading-tight">
                {questions[currentQuestionIndex].text}
              </h2>
              
              <div className="grid gap-4">
                {questions[currentQuestionIndex].answers.map((answer, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="group relative w-full text-left p-4 rounded-[7px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#660000]/50 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full border border-white/30 mr-4 flex items-center justify-center group-hover:border-[#660000] group-hover:bg-[#660000]/20 transition-colors">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#660000] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[#f7f5f5] text-lg font-light">
                        {answer.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "gate" && (
          <LeadForm 
            key="gate"
            archetypeData={{
              primary: resultData.primary,
              primaryScore: resultData.primaryScore,
              secondary: resultData.secondary,
              secondaryScore: resultData.secondaryScore,
              answers: answersLog
            }}
            onSuccess={(data) => {
              setLeadName(data.firstName);
              setStep("results");
            }} 
          />
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl text-center"
          >
            <div className="glass-card rounded-[7px] p-8 md:p-12 border-t-4 border-t-[#660000]">
              <h2 className="text-xl text-[#f7f5f5]/60 mb-2 uppercase tracking-widest">
                {leadName}, your Brand Archetype is
              </h2>
              <h1 className="text-5xl md:text-7xl font-serif text-[#f7f5f5] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                The {resultData.primary}
              </h1>
              
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="bg-white/5 rounded-full px-6 py-2 border border-white/10">
                  <span className="text-sm text-[#f7f5f5]/60 uppercase mr-2">Primary Score</span>
                  <span className="text-xl font-bold text-[#660000]">{resultData.primaryScore}</span>
                </div>
              </div>

              <div className="border-t border-white/10 my-8 w-full" />

              <div className="mb-8">
                <h3 className="text-lg text-[#f7f5f5]/60 mb-1 uppercase tracking-widest">
                  Secondary Archetype
                </h3>
                <h4 className="text-3xl font-serif text-[#f7f5f5]">
                  The {resultData.secondary}
                </h4>
                <p className="text-sm text-[#f7f5f5]/40 mt-1">Score: {resultData.secondaryScore}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  onClick={handleShare}
                  size="lg"
                  className="w-full gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Your Results
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 border-white/20 text-[#f7f5f5] hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake Quiz
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
