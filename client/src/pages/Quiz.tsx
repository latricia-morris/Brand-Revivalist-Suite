import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions, ARCHETYPE_PRIORITY } from "@/lib/quiz-data";
import { Archetype } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";
import { BreakScreen } from "@/components/BreakScreen";
import { Share2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

type QuizStep = "question" | "break-intro" | "break-mid" | "gate" | "results";

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState<QuizStep>("break-intro");
  const [leadName, setLeadName] = useState("");

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  // Derive scores and answersLog from current answers array
  const { scores, answersLog } = useMemo(() => {
    const s: Record<Archetype, number> = {
      Ruler: 0, Hero: 0, Magician: 0, Outlaw: 0, Explorer: 0, Creator: 0,
      Lover: 0, Caregiver: 0, Everyman: 0, Jester: 0, Sage: 0, Innocent: 0
    };
    const log: Record<string, string> = {};

    answers.forEach((ansIdx, qIdx) => {
      const q = questions[qIdx];
      const a = q.answers[ansIdx];
      log[`Q${q.id}: ${q.text}`] = a.text;
      Object.entries(a.scores).forEach(([arch, score]) => {
        if (arch && score) s[arch as Archetype] += score;
      });
    });

    return { scores: s, answersLog: log };
  }, [answers]);

  const handleAnswer = (answerIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIdx;
    setAnswers(newAnswers);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex === 7 && currentQuestionIndex < 7) {
      setStep("break-mid");
      setCurrentQuestionIndex(nextIndex);
    } else if (nextIndex === 18) {
      setStep("gate");
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resultData = useMemo(() => {
    const sorted = Object.entries(scores).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return ARCHETYPE_PRIORITY.indexOf(a[0] as Archetype) - ARCHETYPE_PRIORITY.indexOf(b[0] as Archetype);
    });
    return {
      primary: sorted[0][0],
      primaryScore: sorted[0][1],
      secondary: sorted[1][0],
      secondaryScore: sorted[1][1],
    };
  }, [scores]);

  const handleShare = async () => {
    const text = `I'm a ${resultData.primary}! Know your brand archetype? Prove it. Take the quiz.`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: "Brand Archetype Quiz", text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      alert("Link copied to clipboard!");
    }
  };

  useEffect(() => {
    if (step === "results") {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        confetti({ particleCount: 50 * (timeLeft / duration), origin: { x: Math.random(), y: Math.random() - 0.2 } });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#f7f5f5] text-[#0f0f1a]">
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          {(step === "question" || step === "break-mid") && (
            <div className="w-full space-y-1 mb-2">
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "break-intro" && <BreakScreen key="intro" type="intro" onContinue={() => setStep("question")} />}
            {step === "break-mid" && <BreakScreen key="mid" type="mid" onContinue={() => setStep("question")} />}
            {step === "question" && (
              <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="glass-card rounded-[7px] p-6 shadow-sm border-t-2 border-t-[#660000]">
                  <p className="text-[#660000] font-bold text-[10px] uppercase tracking-widest mb-2">Question {currentQuestionIndex + 1} of 18</p>
                  <h2 className="text-xl md:text-2xl font-serif mb-6 leading-tight">{questions[currentQuestionIndex].text}</h2>
                  <div className="grid gap-2">
                    {questions[currentQuestionIndex].answers.map((answer, idx) => (
                      <button key={idx} onClick={() => handleAnswer(idx)} className={`w-full text-left px-4 py-3 rounded-[7px] border transition-all text-sm ${answers[currentQuestionIndex] === idx ? 'bg-[#660000] text-white border-[#660000]' : 'bg-white hover:bg-gray-50 border-gray-200'}`}>
                        {answer.text}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" size="sm" onClick={handleBack} disabled={currentQuestionIndex === 0} className="text-xs uppercase tracking-widest gap-1">
                    <ChevronLeft className="w-3 h-3" /> Back
                  </Button>
                  {answers[currentQuestionIndex] !== undefined && (
                    <Button variant="ghost" size="sm" onClick={() => handleAnswer(answers[currentQuestionIndex])} className="text-xs uppercase tracking-widest gap-1">
                      Next <ChevronRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
            {step === "gate" && (
              <LeadForm key="gate" archetypeData={{ primary: resultData.primary, primaryScore: resultData.primaryScore, secondary: resultData.secondary, secondaryScore: resultData.secondaryScore, answers: answersLog }} onSuccess={(data) => { setLeadName(data.firstName); setStep("results"); }} />
            )}
            {step === "results" && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                <div className="glass-card rounded-[7px] p-8 border-t-4 border-t-[#660000]">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{leadName}, your Brand Archetype is</p>
                  <h1 className="text-4xl md:text-5xl font-serif text-[#660000] mb-6">The {resultData.primary}</h1>
                  <div className="flex justify-center mb-8">
                    <div className="bg-[#660000]/5 px-4 py-1 rounded-full border border-[#660000]/10 text-xs font-bold text-[#660000] uppercase tracking-tighter">Primary Score: {resultData.primaryScore}</div>
                  </div>
                  <div className="border-t border-gray-100 my-6" />
                  <div className="mb-8">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Secondary Archetype</p>
                    <h4 className="text-2xl font-serif">The {resultData.secondary}</h4>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button onClick={handleShare} size="sm" className="w-full gap-2 text-xs">Share Results</Button>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="w-full gap-2 text-xs">Retake Quiz</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
