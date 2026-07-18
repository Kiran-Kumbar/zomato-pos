"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Play, Pause, ChevronRight, ChevronLeft, Mic, MicOff, CheckCircle2, Timer, ChefHat } from 'lucide-react';
import { AI_RECIPES } from '@/lib/mock-data/grocery';
import { AIRecipe } from '@/lib/types/grocery-ecosystem';

export default function CookingModePage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<AIRecipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    // In real app, fetch by ID. Here we find by name or just use the first.
    const decodedId = decodeURIComponent(params.recipeId as string);
    const found = AI_RECIPES.find(r => r.name === decodedId) || AI_RECIPES[0];
    setRecipe(found);
  }, [params.recipeId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!recipe) return null;

  const steps = recipe.instructions;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
      // Reset timer if next step implies a time (mock logic: if text contains "minutes")
      const nextText = steps[currentStep + 1].toLowerCase();
      const match = nextText.match(/(\d+)\s*min/);
      if (match) {
        setTimerSeconds(parseInt(match[1]) * 60);
        setIsTimerRunning(false);
      } else {
        setTimerSeconds(0);
      }
    } else {
      // Completed
      router.push('/grocery');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-6">
        <button onClick={() => router.back()} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-lg opacity-80">{recipe.name}</h2>
          <div className="text-sm text-gray-400 font-medium">Step {currentStep + 1} of {steps.length}</div>
        </div>
        <button 
          onClick={() => setIsVoiceActive(!isVoiceActive)} 
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVoiceActive ? 'bg-[#FF5A36] text-white shadow-lg shadow-purple-500/50' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {isVoiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 opacity-50" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-900">
        <motion.div 
          className="h-full bg-gradient-to-r bg-[#FF5A36]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-3xl flex flex-col items-center text-center gap-10"
          >
            {/* Step Image Placeholder */}
            <div className="w-full h-64 md:h-80 bg-gray-900 rounded-[2.5rem] overflow-hidden relative border border-gray-800 shadow-2xl">
              <img 
                src={`https://loremflickr.com/800/600/cooking,food?lock=${currentStep}`} 
                alt="Cooking Step"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-purple-400" />
                  <span className="font-bold tracking-widest uppercase text-sm">Action Required</span>
                </div>
              </div>
            </div>

            {/* Instruction Text */}
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              {steps[currentStep]}
            </h1>

            {/* Smart Timer (shows if step has time) */}
            {timerSeconds > 0 && (
              <div className="flex items-center gap-6 bg-gray-900/80 backdrop-blur-md px-8 py-6 rounded-3xl border border-gray-800">
                <Timer className={`w-10 h-10 ${isTimerRunning ? 'text-orange-500 animate-pulse' : 'text-gray-500'}`} />
                <div className="text-5xl font-mono font-black tracking-widest text-white">
                  {formatTime(timerSeconds)}
                </div>
                <button 
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isTimerRunning ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30' : 'bg-white text-black hover:bg-gray-200'}`}
                >
                  {isTimerRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black to-transparent flex justify-center pb-10">
        <div className="w-full max-w-3xl flex items-center justify-between gap-4">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-8 py-5 rounded-full font-bold text-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-30 transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          <button 
            onClick={handleNext}
            className="flex-1 py-5 rounded-full font-black text-lg bg-[#FF5A36] hover:bg-[#E23744] transition-colors shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <><CheckCircle2 className="w-6 h-6" /> Finish Cooking</>
            ) : (
              <>Next Step <ChevronRight className="w-6 h-6" /></>
            )}
          </button>
        </div>
      </div>
      
    </div>
  );
}
