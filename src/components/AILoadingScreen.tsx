import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChefHat, Sparkles, Flame, CookingPot } from 'lucide-react';
import { AI_LOADING_MESSAGES, CHEF_TIPS } from '../data/constants';

export const AILoadingScreen: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % AI_LOADING_MESSAGES.length);
    }, 2200);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CHEF_TIPS.length);
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? 92 : prev + Math.floor(Math.random() * 8) + 4));
    }, 600);

    return () => {
      clearInterval(msgInterval);
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 text-center">
      
      {/* Animated Cooking Visual */}
      <div className="relative mb-8">
        
        {/* Steam Keyframe Animations */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
          <span className="w-2.5 h-6 bg-stone-300/60 dark:bg-stone-500/60 rounded-full blur-xs animate-steam" style={{ animationDelay: '0s' }} />
          <span className="w-2.5 h-8 bg-stone-300/60 dark:bg-stone-500/60 rounded-full blur-xs animate-steam" style={{ animationDelay: '0.6s' }} />
          <span className="w-2.5 h-6 bg-stone-300/60 dark:bg-stone-500/60 rounded-full blur-xs animate-steam" style={{ animationDelay: '1.2s' }} />
        </div>

        {/* Simmering Pot Container */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-[#FF8A3D] via-[#FF9F43] to-[#F97316] p-0.5 shadow-2xl shadow-[#FF8A3D]/30 flex items-center justify-center"
        >
          <div className="w-full h-full bg-[#FFF8F2] dark:bg-stone-900 rounded-[22px] flex items-center justify-center relative">
            <CookingPot className="w-14 h-14 text-[#FF8A3D]" />
            <ChefHat className="w-6 h-6 absolute top-2 right-2 text-amber-500 opacity-80" />
          </div>
        </motion.div>

        {/* Flames at the bottom */}
        <div className="flex items-center justify-center gap-1.5 -mt-3">
          <Flame className="w-6 h-6 text-orange-500 animate-bounce" style={{ animationDelay: '0s' }} />
          <Flame className="w-7 h-7 text-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <Flame className="w-6 h-6 text-red-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* AI Loading Title */}
      <div className="max-w-md w-full space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/20 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Flavor Fusion AI Working</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] dark:text-stone-100">
          Crafting Your Personalized Recipe...
        </h2>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF8A3D] to-[#FF9F43] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
            {progress}% Completed
          </p>
        </div>

        {/* Rotating Dynamic Message */}
        <div className="h-10 flex items-center justify-center">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm font-semibold text-[#FF8A3D] dark:text-amber-400"
          >
            {AI_LOADING_MESSAGES[msgIndex]}
          </motion.p>
        </div>

        {/* Rotating Chef Pro Tip Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700 text-left shadow-sm">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium"
          >
            {CHEF_TIPS[tipIndex]}
          </motion.p>
        </div>

      </div>

    </div>
  );
};
