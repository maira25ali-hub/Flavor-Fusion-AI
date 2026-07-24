import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Sparkles, ArrowRight, Utensils, Flame } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#FFF8F2] via-[#F4EDE4] to-[#FFF8F2] dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 p-6 overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF8A3D]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7CB342]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-xl w-full text-center space-y-8 relative z-10"
      >
        {/* Animated Chef Hat Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#FF8A3D] via-[#FF9F43] to-[#F97316] p-0.5 shadow-2xl shadow-[#FF8A3D]/30 flex items-center justify-center relative"
        >
          <div className="w-full h-full bg-[#FFF8F2] dark:bg-stone-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
            <ChefHat className="w-12 h-12 sm:w-14 sm:h-14 text-[#FF8A3D]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
              className="absolute inset-0 border-2 border-dashed border-[#FF8A3D]/30 rounded-[22px]"
            />
          </div>
          <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-amber-500 animate-bounce" />
          <Flame className="w-5 h-5 absolute -bottom-1 -left-1 text-orange-500" />
        </motion.div>

        {/* Title & Tagline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Smart Kitchen</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C2C2C] dark:text-stone-100 leading-tight">
            Flavor Fusion <span className="text-[#FF8A3D]">AI</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-sans max-w-md mx-auto leading-relaxed">
            Turn your fridge ingredients into culinary masterpieces in seconds. No waste, zero guesswork.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-medium pt-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-800/80 shadow-sm border border-stone-200/60 dark:border-stone-700/60">
            <Utensils className="w-3.5 h-3.5 text-[#FF8A3D]" /> Smart Matching
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-800/80 shadow-sm border border-stone-200/60 dark:border-stone-700/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant Recipes
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-800/80 shadow-sm border border-stone-200/60 dark:border-stone-700/60">
            <Flame className="w-3.5 h-3.5 text-emerald-500" /> Macro Nutrition
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={onStart}
            id="splash-get-started-btn"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF8A3D] via-[#FF9F43] to-[#F97316] text-white font-semibold text-lg shadow-xl shadow-[#FF8A3D]/30 hover:shadow-2xl hover:shadow-[#FF8A3D]/40 hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
