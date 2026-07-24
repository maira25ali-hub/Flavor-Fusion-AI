import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Bookmark, Heart, Copy, Download, Sparkles, ArrowLeft, Clock, Users, 
  Flame, CheckCircle2, AlertCircle, Lightbulb, Share2, FileText, Check,
  Printer, ChevronDown, ChevronUp, Utensils, PieChart, ShieldAlert,
  Scale, Apple, RefreshCw, Info, ThumbsUp
} from 'lucide-react';
import { Recipe, ActivePage } from '../types';
import { downloadRecipePdf, downloadRecipeTxt, copyRecipeToClipboard } from '../utils/exportRecipe';

interface RecipeResultPageProps {
  recipe?: Recipe | null;
  onSave: (recipe: Recipe) => void;
  onToggleFavorite: (id: string) => void;
  isSaved: boolean;
  setActivePage: (page: ActivePage) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  onRetry?: () => void;
}

export const RecipeResultPage: React.FC<RecipeResultPageProps> = ({
  recipe,
  onSave,
  onToggleFavorite,
  isSaved,
  setActivePage,
  showToast,
  onRetry,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [preparedIngredients, setPreparedIngredients] = useState<string[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<number[]>(
    recipe?.instructions?.map(s => s.stepNumber) || []
  );
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // 1. EMPTY STATE HANDLER
  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 shadow-xl space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-[#FF8A3D]">
          <Utensils className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] dark:text-stone-100">
            No Recipe Selected Yet
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            Please select ingredients in our Smart AI Recipe Generator to craft a personalized culinary masterpiece.
          </p>
        </div>
        <button
          onClick={() => setActivePage('generator')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF8A3D] hover:bg-[#F97316] text-white font-bold text-sm shadow-lg shadow-[#FF8A3D]/25 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open AI Recipe Generator</span>
        </button>
      </div>
    );
  }

  // 2. ERROR STATE HANDLER (If recipe structure is corrupted)
  if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 sm:p-12 text-center rounded-3xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 shadow-xl space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 dark:text-rose-100">
            Recipe Formatting Error
          </h2>
          <p className="text-sm text-rose-800/80 dark:text-rose-300/80 max-w-md mx-auto">
            The generated recipe structure could not be parsed correctly. Please try generating again.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Generation</span>
            </button>
          )}
          <button
            onClick={() => setActivePage('generator')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-bold text-xs hover:bg-stone-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Generator</span>
          </button>
        </div>
      </div>
    );
  }

  // Step Completion Toggles
  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepNum) ? prev.filter(s => s !== stepNum) : [...prev, stepNum]
    );
  };

  const toggleStepExpand = (stepNum: number) => {
    setExpandedSteps(prev =>
      prev.includes(stepNum) ? prev.filter(s => s !== stepNum) : [...prev, stepNum]
    );
  };

  // Ingredient Prepared Checkbox Toggle
  const toggleIngredientPrepared = (ing: string) => {
    setPreparedIngredients(prev =>
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  // Save Handler with Confetti
  const handleSave = () => {
    onSave(recipe);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 }
      });
    } catch {
      // Graceful fallback
    }
    showToast('Recipe Saved!', 'Added to your saved recipes list.', 'success');
  };

  // Copy Handler
  const handleCopy = async () => {
    const success = await copyRecipeToClipboard(recipe);
    if (success) {
      setCopied(true);
      showToast('Copied to Clipboard!', 'Full formatted recipe ready to paste.', 'success');
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast('Failed to copy', 'Please try manually selecting the text.', 'error');
    }
  };

  // Downloads
  const handleDownloadPdf = () => {
    try {
      downloadRecipePdf(recipe);
      showToast('PDF Exported!', `${recipe.title}.pdf is ready in downloads.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('PDF Export Error', 'Falling back to TXT download.', 'error');
    }
  };

  const handleDownloadTxt = () => {
    downloadRecipeTxt(recipe);
    showToast('TXT Downloaded!', `${recipe.title}.txt saved.`, 'success');
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Share Handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this AI-generated ${recipe.title} recipe on Flavor Fusion AI!`,
          url: window.location.href,
        });
        showToast('Shared successfully!', undefined, 'success');
        return;
      } catch (err) {
        // User cancelled or share failed
      }
    }
    
    // Fallback share link copy
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      showToast('Recipe Link Copied!', 'Shareable link copied to clipboard.', 'success');
      setTimeout(() => setShared(false), 2500);
    } catch {
      showToast('Share Link Failed', 'Could not copy link.', 'error');
    }
  };

  // Parse numeric values for daily % indicators
  const parseNum = (strVal: string | number): number => {
    if (typeof strVal === 'number') return strVal;
    const match = String(strVal).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const caloriesVal = recipe.nutrition.calories || 0;
  const proteinVal = parseNum(recipe.nutrition.protein);
  const carbsVal = parseNum(recipe.nutrition.carbohydrates);
  const fatVal = parseNum(recipe.nutrition.fat);
  const fiberVal = parseNum(recipe.nutrition.fiber);
  const sugarVal = parseNum(recipe.nutrition.sugar);

  // Daily Value Benchmarks
  const proteinDV = Math.min(100, Math.round((proteinVal / 50) * 100));
  const carbsDV = Math.min(100, Math.round((carbsVal / 275) * 100));
  const fatDV = Math.min(100, Math.round((fatVal / 78) * 100));
  const fiberDV = Math.min(100, Math.round((fiberVal / 28) * 100));
  const caloriesDV = Math.min(100, Math.round((caloriesVal / 2000) * 100));

  const statsList = [
    { label: 'Prep Time', value: `${recipe.prepTimeMinutes} Mins`, icon: Clock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Cook Time', value: `${recipe.cookTimeMinutes} Mins`, icon: Utensils, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' },
    { label: 'Total Time', value: `${recipe.totalTimeMinutes} Mins`, icon: Clock, color: 'text-[#FF8A3D] bg-orange-100/60 dark:bg-orange-900/40' },
    { label: 'Calories', value: `${recipe.nutrition.calories} kcal`, icon: Flame, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
    { label: 'Protein', value: recipe.nutrition.protein, icon: Scale, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Carbs', value: recipe.nutrition.carbohydrates, icon: PieChart, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Fat', value: recipe.nutrition.fat, icon: Apple, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
    { label: 'Servings', value: `${recipe.servingSize} Portions`, icon: Users, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-10 pb-20 px-2 sm:px-4"
    >
      
      {/* Top Action & Navigation Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setActivePage('generator')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Generator</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(recipe.id)}
            className={`p-2.5 rounded-2xl border transition-all ${
              recipe.isFavorite
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800'
                : 'bg-white dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleSave}
            id="result-save-recipe-btn"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold shadow-sm transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-[#FF8A3D] hover:bg-[#F97316] text-white shadow-[#FF8A3D]/20'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSaved ? 'Saved in Collection' : 'Save Recipe'}</span>
          </button>
        </div>
      </div>

      {/* 1. RECIPE HERO WITH GLASSMORPHISM */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 shadow-xl">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={recipe.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 font-bold text-xs shadow-md backdrop-blur-md">
              {recipe.cuisine} Cuisine
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FF8A3D] text-white font-bold text-xs shadow-md">
              {recipe.difficulty}
            </span>
            {recipe.dietaryTags && recipe.dietaryTags.map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-emerald-600/90 text-white font-bold text-xs shadow-md backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight drop-shadow-sm">
              {recipe.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-200 max-w-2xl leading-relaxed">
              {recipe.description}
            </p>
          </div>
        </div>

        {/* Quick Hero Banner Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-100 dark:divide-stone-800 border-t border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850 p-4 text-center">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Prep Time</span>
            <p className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100">{recipe.prepTimeMinutes} Mins</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Cook Time</span>
            <p className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100">{recipe.cookTimeMinutes} Mins</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Time</span>
            <p className="font-serif text-lg font-bold text-[#FF8A3D]">{recipe.totalTimeMinutes} Mins</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Serving Size</span>
            <p className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100">{recipe.servingSize} Servings</p>
          </div>
        </div>
      </div>

      {/* 2. RECIPE OVERVIEW */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200/70 dark:border-stone-800 space-y-3">
        <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
          <Info className="w-5 h-5 text-[#FF8A3D]" />
          <span>Recipe Overview</span>
        </h3>
        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          {recipe.recipeSummary || recipe.description} This custom culinary blueprint was designed specifically to match your available home ingredients, embracing traditional <strong className="text-[#2C2C2C] dark:text-stone-100">{recipe.cuisine}</strong> cooking methods while adhering to your <strong className="text-[#2C2C2C] dark:text-stone-100">{recipe.dietaryTags?.join(', ') || 'dietary'}</strong> preferences.
        </p>
      </div>

      {/* 3. RECIPE STATISTICS */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100">
          Recipe Key Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statsList.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 shadow-sm space-y-2"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">{stat.label}</span>
                  <p className="font-serif text-lg font-bold text-[#2C2C2C] dark:text-stone-100 mt-0.5">{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. INGREDIENTS & 5. MISSING INGREDIENTS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Ingredients Column */}
        <div className="md:col-span-7 bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Pantry Ingredients ({recipe.ingredients.length})</span>
            </h3>
            <span className="text-xs text-stone-400">Click to mark prepared</span>
          </div>

          <div className="max-h-96 overflow-y-auto pr-1 space-y-2.5">
            {recipe.ingredients.map((ing, idx) => {
              const isPrepared = preparedIngredients.includes(ing);
              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredientPrepared(ing)}
                  className={`cursor-pointer flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isPrepared
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 opacity-80'
                      : 'bg-stone-50 dark:bg-stone-800/50 border-stone-100 dark:border-stone-800 hover:border-[#FF8A3D]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      isPrepared
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700'
                    }`}>
                      {isPrepared && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-sm font-medium ${isPrepared ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-800 dark:text-stone-200'}`}>
                      {ing}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing Ingredients Box */}
        <div className="md:col-span-5 space-y-6">
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 ? (
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-amber-950 dark:text-amber-200">
                    Suggested Pantry Items
                  </h4>
                  <span className="text-xs text-amber-800/80 dark:text-amber-300/80">Maximum 3 missing items</span>
                </div>
              </div>

              <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
                {recipe.missingIngredientsMessage || 'Add these items to unlock full original flavor depth:'}
              </p>

              <div className="space-y-2 pt-1">
                {recipe.missingIngredients.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-200/60 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span>+ {item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 shadow-sm space-y-3">
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                <ThumbsUp className="w-6 h-6 shrink-0" />
                <h4 className="font-serif font-bold text-base">Perfect Ingredient Match!</h4>
              </div>
              <p className="text-xs text-emerald-900/90 dark:text-emerald-300/90 leading-relaxed">
                You already have everything you need in your kitchen to cook this complete dish. No additional grocery trip required!
              </p>
            </div>
          )}

          {/* Warnings Card if any exist */}
          {recipe.warnings && recipe.warnings.length > 0 && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-3">
              <h4 className="font-serif font-bold text-base text-rose-950 dark:text-rose-200 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" /> Important Cooking Alerts
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-900/90 dark:text-rose-300/90">
                {recipe.warnings.map((warn, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

      {/* 6. NUTRITION DASHBOARD */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#FF8A3D]" />
              <span>Nutrition Dashboard</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Estimated nutritional values per portion based on 2,000 kcal daily diet</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold">
            {caloriesDV}% Daily Caloric Need
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Protein Bar */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">Protein</span>
              <span className="font-extrabold text-emerald-600">{recipe.nutrition.protein} ({proteinDV}% DV)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${proteinDV}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Carbohydrates Bar */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">Carbohydrates</span>
              <span className="font-extrabold text-blue-600">{recipe.nutrition.carbohydrates} ({carbsDV}% DV)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${carbsDV}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Fat Bar */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">Fat</span>
              <span className="font-extrabold text-purple-600">{recipe.nutrition.fat} ({fatDV}% DV)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fatDV}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>
          </div>

          {/* Fiber Bar */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">Dietary Fiber</span>
              <span className="font-extrabold text-amber-600">{recipe.nutrition.fiber} ({fiberDV}% DV)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fiberDV}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          {/* Sugar Metric */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">Natural Sugar</span>
              <span className="font-extrabold text-rose-500">{recipe.nutrition.sugar}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <div className="h-full bg-rose-400 rounded-full w-1/4" />
            </div>
          </div>

          {/* Calories Display */}
          <div className="p-4 rounded-2xl bg-[#FF8A3D]/10 border border-[#FF8A3D]/20 space-y-1 flex flex-col justify-center text-center">
            <span className="text-[11px] font-bold text-[#FF8A3D] uppercase tracking-wider">Calories Per Serving</span>
            <p className="font-serif text-2xl font-black text-[#2C2C2C] dark:text-stone-100">{recipe.nutrition.calories} kcal</p>
          </div>

        </div>
      </section>

      {/* 7. COOKING INSTRUCTIONS TIMELINE */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2C2C2C] dark:text-stone-100">
              Cooking Steps Timeline
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Click step card to expand tips or toggle completion status</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {completedSteps.length} / {recipe.instructions.length} Steps Done
          </span>
        </div>

        <div className="relative space-y-4 pl-2 sm:pl-4 border-l-2 border-stone-200 dark:border-stone-800 ml-3 sm:ml-4">
          {recipe.instructions.map((step) => {
            const isCompleted = completedSteps.includes(step.stepNumber);
            const isExpanded = expandedSteps.includes(step.stepNumber);

            return (
              <div key={step.stepNumber} className="relative pl-6 sm:pl-8">
                {/* Timeline Circle Marker */}
                <button
                  onClick={() => toggleStepCompleted(step.stepNumber)}
                  className={`absolute -left-[17px] top-4 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                      : 'bg-white dark:bg-stone-900 border-[#FF8A3D] text-[#FF8A3D]'
                  }`}
                  title="Toggle Step Completion"
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.stepNumber}
                </button>

                {/* Step Card */}
                <div 
                  className={`p-5 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 opacity-80'
                      : 'bg-stone-50/80 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-[#FF8A3D]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-600' : 'text-[#FF8A3D]'}`}>
                          Step {step.stepNumber}
                        </span>
                        {step.estimatedMinutes && (
                          <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" /> ~{step.estimatedMinutes} Mins
                          </span>
                        )}
                      </div>

                      <p className={`text-sm sm:text-base leading-relaxed pt-1 ${isCompleted ? 'line-through text-stone-500' : 'text-stone-800 dark:text-stone-200'}`}>
                        {step.instruction}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStepCompleted(step.stepNumber)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        {isCompleted ? 'Done' : 'Mark Done'}
                      </button>

                      {step.tip && (
                        <button
                          onClick={() => toggleStepExpand(step.stepNumber)}
                          className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition-colors"
                          title="Toggle Chef Pro-Tip"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Chef Pro Tip */}
                  <AnimatePresence>
                    {isExpanded && step.tip && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/60"
                      >
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 font-medium">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                          <span><strong>Chef Pro-Tip:</strong> {step.tip}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 8. HEALTHY ALTERNATIVES & 9. COOKING TIPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipe.cookingTips && recipe.cookingTips.length > 0 && (
          <div className="p-6 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 space-y-3">
            <h4 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Executive Chef Tips
            </h4>
            <ul className="space-y-2 text-xs text-amber-900/90 dark:text-amber-300/90">
              {recipe.cookingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.healthierAlternatives && recipe.healthierAlternatives.length > 0 && (
          <div className="p-6 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 space-y-3">
            <h4 className="font-serif font-bold text-lg text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" /> Healthier Ingredient Swaps
            </h4>
            <ul className="space-y-2 text-xs text-emerald-900/90 dark:text-emerald-300/90">
              {recipe.healthierAlternatives.map((alt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 11. ACTION BUTTONS & EXPORT BAR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-serif font-bold text-lg text-[#2C2C2C] dark:text-stone-100">
            Export & Share Recipe
          </h4>
          <p className="text-xs text-stone-500">
            Download formatted documents, print cards, or copy recipe text.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
          >
            <Copy className="w-4 h-4 text-[#FF8A3D]" />
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            id="result-download-pdf-btn"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FF8A3D] hover:bg-[#F97316] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF Export</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>TXT Download</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <span>Print</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
          >
            <Share2 className="w-4 h-4 text-blue-500" />
            <span>{shared ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 12. GENERATE ANOTHER RECIPE */}
      <div className="text-center pt-6 space-y-3">
        <button
          onClick={() => setActivePage('generator')}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white font-bold text-sm shadow-xl shadow-[#FF8A3D]/25 hover:scale-[1.02] transition-all inline-flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate Another Recipe</span>
        </button>
        <p className="text-xs text-stone-400">Your preferences and ingredient selections are saved for quick access.</p>
      </div>

    </motion.div>
  );
};
