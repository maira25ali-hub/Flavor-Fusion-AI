import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Users, 
  Clock, 
  Gauge, 
  Flame, 
  Check, 
  AlertCircle, 
  Heart, 
  ChefHat, 
  Globe, 
  Target, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft,
  UtensilsCrossed,
  ShieldCheck,
  Sprout,
  Leaf,
  Dumbbell,
  Scale,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { 
  DifficultyLevel, 
  CookingTimeOption, 
  HealthGoalOption, 
  LanguageOption, 
  RecipeRequest, 
  ActivePage 
} from '../types';
import { IngredientInput } from './IngredientInput';
import { CUISINES, DIETARY_OPTIONS, HEALTH_GOALS, HELPFUL_TIPS } from '../data/constants';

interface RecipeGeneratorPageProps {
  recipeRequest: RecipeRequest;
  setRecipeRequest: React.Dispatch<React.SetStateAction<RecipeRequest>>;
  onGenerate: () => void;
  setActivePage: (page: ActivePage) => void;
  errorMsg: string | null;
}

export const RecipeGeneratorPage: React.FC<RecipeGeneratorPageProps> = ({
  recipeRequest,
  setRecipeRequest,
  onGenerate,
  setActivePage,
  errorMsg,
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Auto-rotate helpful tips every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % HELPFUL_TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const setIngredients = (updater: React.SetStateAction<string[]>) => {
    setRecipeRequest(prev => ({
      ...prev,
      ingredients: typeof updater === 'function' ? updater(prev.ingredients) : updater,
    }));
  };

  const toggleDiet = (dietId: string) => {
    setRecipeRequest(prev => {
      let updatedDiets = [...prev.dietaryPreference];

      if (updatedDiets.includes(dietId)) {
        updatedDiets = updatedDiets.filter(d => d !== dietId);
      } else {
        // Handle compatible options & prevent conflicting selections
        if (dietId === 'Vegan') {
          // Selecting Vegan auto-includes Vegetarian if not present, and removes non-vegan conflicts
          if (!updatedDiets.includes('Vegetarian')) {
            updatedDiets.push('Vegetarian');
          }
        }
        updatedDiets.push(dietId);
      }

      return {
        ...prev,
        dietaryPreference: Array.from(new Set(updatedDiets)),
      };
    });
  };

  const updateServingSize = (delta: number) => {
    setRecipeRequest(prev => {
      const next = Math.max(1, Math.min(10, prev.servingSize + delta));
      return { ...prev, servingSize: next };
    });
  };

  const getServingLabel = (size: number) => {
    if (size === 1) return '1 Person';
    if (size === 2) return '2 People';
    if (size === 3) return '3 People';
    if (size === 4) return '4 People';
    return `${size}+ People`;
  };

  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipeRequest.ingredients.length === 0) {
      return;
    }
    onGenerate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4 sm:px-6">
      
      {/* Step Indicator & Header Banner */}
      <div className="text-center space-y-4">
        
        {/* Step Progress Bar (Step 1 of 3) */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-xs">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF8A3D] animate-ping" />
          <span className="font-bold text-[#FF8A3D]">Step 1 of 3</span>
          <span className="text-stone-300 dark:text-stone-600">•</span>
          <span>Input Ingredients & Customize Preferences</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C2C2C] dark:text-stone-100 tracking-tight">
          Craft Your AI Recipe
        </h1>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
          List what's inside your fridge or pantry, set your dietary preferences, and let our culinary AI generate a tailored gourmet recipe.
        </p>

        {/* Language Architecture Selector (English / Urdu) */}
        <div className="pt-2 flex justify-center items-center gap-2">
          <Globe className="w-4 h-4 text-stone-400" />
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Recipe Language:</span>
          <div className="inline-flex rounded-xl bg-stone-100 dark:bg-stone-800 p-0.5 border border-stone-200 dark:border-stone-700">
            {(['English', 'Urdu'] as LanguageOption[]).map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setRecipeRequest(prev => ({ ...prev, language: lang }))}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  (recipeRequest.language || 'English') === lang
                    ? 'bg-[#FF8A3D] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Validation Error Banner */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3 shadow-xs"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* MAIN GENERATOR FORM CARD */}
      <div className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-lg space-y-10">
        
        {/* SECTION 1: INGREDIENT INPUT */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="w-9 h-9 rounded-2xl bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center font-serif font-bold text-lg shrink-0">
              1
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
                <span>Available Ingredients</span>
                <span className="text-xs font-sans font-normal text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">Required</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Type ingredients, press Enter, paste comma-separated values, or choose pantry staples.
              </p>
            </div>
          </div>

          <IngredientInput
            ingredients={recipeRequest.ingredients}
            setIngredients={setIngredients}
          />
        </section>

        {/* SECTION 2: CUISINE SELECTOR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center font-serif font-bold text-lg shrink-0">
                2
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100">
                  Select Cuisine Style
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Choose a flavor profile to guide spices and cooking techniques.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#FF8A3D] bg-[#FF8A3D]/10 px-3 py-1 rounded-full">
              {recipeRequest.cuisine} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 pt-1">
            {CUISINES.map((cuisine) => {
              const isSelected = recipeRequest.cuisine === cuisine.name;
              return (
                <motion.button
                  key={cuisine.id}
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRecipeRequest(prev => ({ ...prev, cuisine: cuisine.name }))}
                  className={`relative rounded-2xl p-3 text-left border transition-all cursor-pointer overflow-hidden group ${
                    isSelected
                      ? 'bg-[#FF8A3D]/10 border-[#FF8A3D] ring-2 ring-[#FF8A3D]/30 shadow-md'
                      : 'bg-stone-50/80 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-[#FF8A3D]/60'
                  }`}
                >
                  <div className="relative h-24 rounded-xl overflow-hidden mb-2.5">
                    <img
                      src={cuisine.imageUrl}
                      alt={cuisine.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 p-1 rounded-full bg-[#FF8A3D] text-white shadow-md">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2.5 right-2">
                      <span className="text-white font-serif font-bold text-sm block drop-shadow-sm">
                        {cuisine.name}
                      </span>
                      <span className="text-[10px] text-stone-200 block truncate opacity-90">
                        {cuisine.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 px-0.5 leading-snug">
                    {cuisine.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: DIETARY PREFERENCES & HEALTH SWITCH */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center font-serif font-bold text-lg shrink-0">
                3
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100">
                  Dietary Preferences
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Select applicable options (multi-select supported).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {DIETARY_OPTIONS.map((diet) => {
              const isSelected = recipeRequest.dietaryPreference.includes(diet.id);
              return (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => toggleDiet(diet.id)}
                  className={`px-3.5 py-3 rounded-2xl text-xs font-semibold border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF8A3D] text-white border-[#FF8A3D] shadow-md ring-2 ring-[#FF8A3D]/20'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#FF8A3D]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs">{diet.name}</span>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600" />
                    )}
                  </div>
                  <span className={`text-[10px] line-clamp-1 ${isSelected ? 'text-white/80' : 'text-stone-500 dark:text-stone-400'}`}>
                    {diet.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Healthy Option Toggle Switch */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Heart className="w-5 h-5 fill-amber-500/20" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Prioritize Low-Fat & Clean Preparation
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">
                  Instructs AI to substitute excessive butter/oils with grilling, baking, or air-frying.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRecipeRequest(prev => ({ ...prev, healthyOption: !prev.healthyOption }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                recipeRequest.healthyOption ? 'bg-[#FF8A3D]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  recipeRequest.healthyOption ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* SECTION 4: SERVING SIZE, DIFFICULTY, COOKING TIME & HEALTH GOAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="w-9 h-9 rounded-2xl bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center font-serif font-bold text-lg shrink-0">
              4
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100">
                Servings, Difficulty & Health Goals
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Tailor portion sizing, target time, and wellness objectives.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Serving Counter Component */}
            <div className="space-y-2 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#FF8A3D]" /> Serving Size
                </span>
                <span className="text-[11px] text-stone-500">Auto-scales ingredients</span>
              </label>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => updateServingSize(-1)}
                  disabled={recipeRequest.servingSize <= 1}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-40 text-stone-800 dark:text-stone-100 font-bold flex items-center justify-center shadow-xs transition-all cursor-pointer text-lg"
                >
                  -
                </button>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={recipeRequest.servingSize}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100"
                  >
                    {getServingLabel(recipeRequest.servingSize)}
                  </motion.span>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => updateServingSize(1)}
                  disabled={recipeRequest.servingSize >= 10}
                  className="w-10 h-10 rounded-xl bg-[#FF8A3D] text-white font-bold flex items-center justify-center shadow-xs hover:bg-[#F97316] disabled:opacity-40 transition-all cursor-pointer text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Difficulty Segmented Control */}
            <div className="space-y-2 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#FF8A3D]" /> Difficulty Level
              </label>

              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map(diff => {
                  const isSelected = recipeRequest.difficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setRecipeRequest(prev => ({ ...prev, difficulty: diff }))}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isSelected
                          ? diff === 'Easy'
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : diff === 'Medium'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-rose-500 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{diff}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cooking Time Selection */}
            <div className="space-y-2 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF8A3D]" /> Target Cooking Time
              </label>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  '15 Minutes',
                  '30 Minutes',
                  '45 Minutes',
                  '60 Minutes',
                  'No Preference'
                ].map(timeOpt => {
                  const isSelected = recipeRequest.cookingTimePreference === timeOpt;
                  return (
                    <button
                      key={timeOpt}
                      type="button"
                      onClick={() => setRecipeRequest(prev => ({ ...prev, cookingTimePreference: timeOpt as CookingTimeOption }))}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF8A3D] text-white border-[#FF8A3D] shadow-xs'
                          : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#FF8A3D]'
                      }`}
                    >
                      {timeOpt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Health Goal Optional Selection */}
            <div className="space-y-2 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#FF8A3D]" /> Health Goal (Optional)
              </label>

              <select
                value={recipeRequest.healthGoal || 'Balanced'}
                onChange={(e) => setRecipeRequest(prev => ({ ...prev, healthGoal: e.target.value as HealthGoalOption }))}
                className="w-full p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] cursor-pointer"
              >
                {HEALTH_GOALS.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>

          </div>
        </section>

        {/* SECTION 5: GENERATE RECIPE SUBMIT BUTTON */}
        <div className="pt-4 text-center border-t border-stone-100 dark:border-stone-800 space-y-3">
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateClick}
            disabled={recipeRequest.ingredients.length === 0}
            id="generate-recipe-submit-btn"
            className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-gradient-to-r from-[#FF8A3D] via-[#FF9F43] to-[#F97316] text-white font-bold text-lg shadow-xl shadow-[#FF8A3D]/25 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
          >
            <ChefHat className="w-6 h-6 animate-bounce" />
            <span>Generate AI Recipe</span>
            <Sparkles className="w-5 h-5 opacity-80" />
          </motion.button>

          {recipeRequest.ingredients.length === 0 && (
            <p className="text-xs text-rose-500 font-medium">
              ⚠️ Add at least one ingredient above to enable recipe generation.
            </p>
          )}

          <p className="text-xs text-stone-500 dark:text-stone-400">
            Powered by Gemini 3.6 Flash • Creates custom recipe in ~1.5s
          </p>
        </div>

      </div>

      {/* HELPFUL TIPS CAROUSEL / ROTATING CARDS SECTION */}
      <section className="bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-[#FF8A3D]/10 text-[#FF8A3D] shrink-0 hidden sm:flex">
          <Lightbulb className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A3D] flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 sm:hidden" />
              <span>Chef's Helpful Tip</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentTipIndex(prev => (prev === 0 ? HELPFUL_TIPS.length - 1 : prev - 1))}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                title="Previous tip"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-stone-400 font-mono">
                {currentTipIndex + 1}/{HELPFUL_TIPS.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentTipIndex(prev => (prev + 1) % HELPFUL_TIPS.length)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                title="Next tip"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentTipIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-stone-700 dark:text-stone-300 font-medium"
            >
              "{HELPFUL_TIPS[currentTipIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
};
