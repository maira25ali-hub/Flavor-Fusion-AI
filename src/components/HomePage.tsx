import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Bookmark, Flame, Clock, Users, ArrowRight, ShieldCheck, Heart, ChefHat, Utensils, CheckCircle2 } from 'lucide-react';
import { ActivePage, Recipe } from '../types';
import { CUISINES, SAMPLE_INSPIRATION_RECIPES } from '../data/constants';

interface HomePageProps {
  setActivePage: (page: ActivePage) => void;
  onSelectInspirationRecipe: (recipe: Recipe) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActivePage,
  onSelectInspirationRecipe,
}) => {
  const featuredRecipe = SAMPLE_INSPIRATION_RECIPES[0];

  return (
    <div className="space-y-20 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 rounded-3xl bg-gradient-to-b from-[#FFF8F2] via-[#F4EDE4] to-[#FFF8F2] dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-900 p-6 sm:p-12 border border-[#F1E6DA] dark:border-stone-800 shadow-sm">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8A3D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7CB342]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart AI Recipe Assistant</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C2C2C] dark:text-stone-100 leading-[1.15]">
              Turn Pantry Ingredients Into <span className="text-[#FF8A3D] italic font-normal">Gourmet Meals</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
              No more wondering what to cook. Simply list what’s in your kitchen, select your favorite cuisine & dietary needs, and let AI craft personalized chef recipes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage('generator')}
                id="hero-generate-recipe-btn"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white font-semibold text-base shadow-xl shadow-[#FF8A3D]/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate Recipe Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActivePage('saved')}
                id="hero-saved-recipes-btn"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-semibold text-base hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors shadow-sm"
              >
                <Bookmark className="w-5 h-5 text-[#FF8A3D]" />
                <span>Browse Saved Recipes</span>
              </button>
            </div>

            {/* Quick Benefits Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#F1E6DA] dark:border-stone-800">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#FF8A3D]">0%</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Food Wastage</p>
              </div>
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#FF8A3D]">8+</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Cuisines</p>
              </div>
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#FF8A3D]">Instant</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">AI Recipe Output</p>
              </div>
            </div>

          </div>

          {/* Right Image/Illustration Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF8A3D] to-[#7CB342] rounded-3xl blur-2xl opacity-20 transform rotate-3 scale-95" />
              
              <div className="relative rounded-3xl overflow-hidden border-4 border-white dark:border-stone-800 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Chef Kitchen Prep"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-[#FF8A3D] text-xs font-bold w-fit mb-2">
                    Chef Recommendation
                  </span>
                  <h3 className="font-serif text-xl font-bold">Smart Flavor Matching</h3>
                  <p className="text-xs text-stone-200 mt-1">
                    AI analyzes ingredient pairings to generate perfectly balanced spices and cooking times.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Today's Recipe Inspiration Card */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8A3D]">Daily Culinary Pick</span>
            <h2 className="font-serif text-3xl font-bold text-[#2C2C2C] dark:text-stone-100">
              Today's Featured AI Inspiration
            </h2>
          </div>
          <button
            onClick={() => setActivePage('generator')}
            className="text-sm font-semibold text-[#FF8A3D] hover:text-[#F97316] flex items-center gap-1 transition-colors"
          >
            <span>Create Your Custom Recipe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg hover:shadow-xl transition-all">
          <div className="md:col-span-5 rounded-2xl overflow-hidden h-64 shadow-md">
            <img
              src={featuredRecipe.imageUrl}
              alt={featuredRecipe.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                {featuredRecipe.cuisine}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                {featuredRecipe.difficulty}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 ml-auto">
                <Clock className="w-3.5 h-3.5 text-[#FF8A3D]" /> {featuredRecipe.totalTimeMinutes} Mins
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] dark:text-stone-100">
              {featuredRecipe.title}
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {featuredRecipe.description}
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-medium text-stone-700 dark:text-stone-300">
              {featuredRecipe.ingredients.slice(0, 5).map((ing, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  ✓ {ing}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => onSelectInspirationRecipe(featuredRecipe)}
                className="px-6 py-3 rounded-2xl bg-[#FF8A3D] hover:bg-[#F97316] text-white font-semibold text-sm shadow-md shadow-[#FF8A3D]/20 flex items-center gap-2 transition-all"
              >
                <span>View Full Recipe Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cuisines Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8A3D]">Global Flavors</span>
          <h2 className="font-serif text-3xl font-bold text-[#2C2C2C] dark:text-stone-100">
            Explore Cuisines Around The World
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Select a cuisine to pre-configure your AI generator for traditional spice profiles and cooking techniques.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CUISINES.map((cuisine) => (
            <motion.div
              key={cuisine.id}
              whileHover={{ y: -6 }}
              onClick={() => setActivePage('generator')}
              className="cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 shadow-md hover:shadow-xl transition-all group"
            >
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <img
                  src={cuisine.imageUrl}
                  alt={cuisine.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[#2C2C2C] text-[10px] font-bold shadow-sm">
                  {cuisine.badge}
                </span>
                <h3 className="absolute bottom-3 left-3 right-3 font-serif text-lg font-bold text-white">
                  {cuisine.name}
                </h3>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {cuisine.description}
                </p>
                <div className="text-[11px] font-medium text-[#FF8A3D] flex items-center justify-between pt-1">
                  <span>Generate {cuisine.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Features Highlights */}
      <section className="bg-gradient-to-br from-[#2C2C2C] to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8A3D]">Why Flavor Fusion AI</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Built For Smart Kitchens & Food Lovers
          </h2>
          <p className="text-sm text-stone-300">
            Advanced features designed to make cooking easy, fun, healthy, and waste-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D]/20 text-[#FF8A3D] flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold">1. Ingredient Preference Engine</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Prioritizes the exact ingredients you have at home. If missing essential pantry staples, it suggests a maximum of 3 items.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold">2. Precise Macro Nutrition</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Displays realistic calorie estimates, protein, carbohydrates, fats, fiber, and sugar metrics for every generated dish.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold">3. Save, PDF & TXT Downloads</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Export recipes to formatted PDF documents or text files for easy printing and offline kitchen access anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Healthy Eating Advice & CTA Banner */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden border border-[#F1E6DA] shadow-lg">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] dark:text-stone-100">
            Ready To Cook Your Next Meal?
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Enter what's in your fridge right now and receive a step-by-step master chef recipe in seconds.
          </p>
          
          <div className="pt-2">
            <button
              onClick={() => setActivePage('generator')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#FF8A3D] hover:bg-[#F97316] text-white font-semibold text-base shadow-xl shadow-[#FF8A3D]/25 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Recipe Generator</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
