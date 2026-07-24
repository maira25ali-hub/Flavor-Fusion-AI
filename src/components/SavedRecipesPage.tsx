import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bookmark, Heart, Trash2, Download, Eye, Sparkles, 
  Clock, Flame, ArrowRight, X, FileText 
} from 'lucide-react';
import { Recipe, ActivePage } from '../types';
import { downloadRecipePdf, downloadRecipeTxt } from '../utils/exportRecipe';
import { ConfirmModal } from './ConfirmModal';

interface SavedRecipesPageProps {
  savedRecipes: Recipe[];
  onRemove: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  setActivePage: (page: ActivePage) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

export const SavedRecipesPage: React.FC<SavedRecipesPageProps> = ({
  savedRecipes,
  onRemove,
  onToggleFavorite,
  onSelectRecipe,
  setActivePage,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Extract distinct cuisines from saved recipes
  const distinctCuisines = ['All', ...Array.from(new Set(savedRecipes.map(r => r.cuisine)))];

  // Filter recipes
  const filteredRecipes = savedRecipes.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCuisine = selectedCuisineFilter === 'All' || r.cuisine === selectedCuisineFilter;
    const matchesFavorite = !onlyFavorites || r.isFavorite;

    return matchesSearch && matchesCuisine && matchesFavorite;
  });

  const confirmDelete = () => {
    if (deleteTargetId) {
      onRemove(deleteTargetId);
      showToast('Recipe Removed', 'Recipe deleted from saved items.', 'info');
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-[#F1E6DA] dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF8A3D]/10 text-[#FF8A3D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Recipe Collection ({savedRecipes.length})</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] dark:text-stone-100">
            Saved & Favorite Recipes
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved title or ingredient..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-2xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Cuisine Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {distinctCuisines.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisineFilter(cuisine)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
                selectedCuisineFilter === cuisine
                  ? 'bg-[#FF8A3D] text-white shadow-sm'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-[#FF8A3D]'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* Favorite Toggle Filter */}
        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition-all ${
            onlyFavorites
              ? 'bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>Only Favorites</span>
        </button>

      </div>

      {/* Saved Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[#F1E6DA] dark:border-stone-800 rounded-3xl bg-stone-50/50 dark:bg-stone-900/50 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 text-[#FF8A3D] flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          
          <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100">
            No Saved Recipes Found
          </h3>

          <p className="text-xs text-stone-500 dark:text-stone-400">
            {savedRecipes.length === 0
              ? 'You have not saved any recipes yet. Generate your first recipe now!'
              : 'No recipes matched your search or filters. Try clearing filters.'}
          </p>

          <button
            onClick={() => setActivePage('generator')}
            className="px-6 py-3 rounded-2xl bg-[#FF8A3D] hover:bg-[#F97316] text-white font-semibold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Recipe</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-stone-900 font-bold text-[11px] shadow-sm">
                      {recipe.cuisine}
                    </span>

                    <button
                      onClick={() => onToggleFavorite(recipe.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        recipe.isFavorite ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif text-lg font-bold line-clamp-1">
                      {recipe.title}
                    </h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF8A3D]" /> {recipe.totalTimeMinutes} Mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" /> {recipe.nutrition.calories} kcal
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 font-bold">
                      {recipe.difficulty}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => onSelectRecipe(recipe)}
                      className="flex-1 py-2.5 rounded-xl bg-[#FF8A3D]/10 hover:bg-[#FF8A3D] text-[#FF8A3D] hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Recipe</span>
                    </button>

                    <button
                      onClick={() => downloadRecipePdf(recipe)}
                      className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTargetId(recipe.id)}
                      className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Delete Saved Recipe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Saved Recipe"
        message="Are you sure you want to remove this recipe from your collection? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

    </div>
  );
};
