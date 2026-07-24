import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Sparkles, Trash2, Check, Search, CornerDownLeft, AlertCircle, Edit2, Utensils } from 'lucide-react';
import { POPULAR_INGREDIENTS } from '../data/constants';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  setIngredients,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // State for editing existing ingredient
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to normalize capitalization (e.g. "chicken breast" -> "Chicken Breast")
  const normalizeIngredientName = (name: string): string => {
    const cleaned = name.trim().replace(/\s+/g, ' ');
    if (!cleaned) return '';
    return cleaned
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Filter autocomplete suggestions based on user typing
  const filteredSuggestions = POPULAR_INGREDIENTS.filter(item =>
    item.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
    !ingredients.some(i => i.toLowerCase() === item.toLowerCase())
  );

  const addIngredientsFromString = (str: string) => {
    setValidationError(null);
    const rawInput = str.trim();

    if (!rawInput) {
      setValidationError('Please enter at least one ingredient.');
      return;
    }

    // Split by comma, semicolon, or newline
    const items = rawInput
      .split(/[,;\n]+/)
      .map(i => i.trim())
      .filter(i => i.length > 0);

    let addedCount = 0;
    let duplicateFound = false;
    let tooLongFound = false;

    setIngredients(prev => {
      const updated = [...prev];

      items.forEach(item => {
        if (item.length > 50) {
          tooLongFound = true;
          return;
        }

        const normalized = normalizeIngredientName(item);
        if (!normalized) return;

        // Duplicate check (case-insensitive)
        const isDuplicate = updated.some(
          existing => existing.toLowerCase() === normalized.toLowerCase()
        );

        if (isDuplicate) {
          duplicateFound = true;
        } else {
          updated.push(normalized);
          addedCount++;
        }
      });

      return updated;
    });

    if (tooLongFound) {
      setValidationError('Ingredient names cannot exceed 50 characters.');
    } else if (duplicateFound && addedCount === 0) {
      setValidationError('This ingredient is already in your list.');
    }

    setInputValue('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredientsFromString(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.includes(',') || pastedText.includes('\n') || pastedText.includes(';')) {
      e.preventDefault();
      addIngredientsFromString(pastedText);
    }
  };

  const removeIngredient = (indexToRemove: number) => {
    setIngredients(prev => prev.filter((_, idx) => idx !== indexToRemove));
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
    }
  };

  const startEditing = (index: number, name: string) => {
    setEditingIndex(index);
    setEditingValue(name);
  };

  const saveEditing = (index: number) => {
    const normalized = normalizeIngredientName(editingValue);
    if (!normalized) {
      removeIngredient(index);
      setEditingIndex(null);
      return;
    }

    if (normalized.length > 50) {
      setValidationError('Edited name exceeds 50 characters.');
      return;
    }

    // Check duplicate with other ingredients
    const isDuplicate = ingredients.some(
      (existing, idx) => idx !== index && existing.toLowerCase() === normalized.toLowerCase()
    );

    if (isDuplicate) {
      setValidationError(`"${normalized}" is already in your ingredients list.`);
      return;
    }

    setIngredients(prev => {
      const updated = [...prev];
      updated[index] = normalized;
      return updated;
    });
    setEditingIndex(null);
    setEditingValue('');
    setValidationError(null);
  };

  const clearAll = () => {
    setIngredients([]);
    setValidationError(null);
  };

  const togglePopularItem = (item: string) => {
    setValidationError(null);
    const normalized = normalizeIngredientName(item);
    if (ingredients.some(i => i.toLowerCase() === normalized.toLowerCase())) {
      setIngredients(prev => prev.filter(i => i.toLowerCase() !== normalized.toLowerCase()));
    } else {
      setIngredients(prev => [...prev, normalized]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Input Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-stone-400 pointer-events-none" />
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setValidationError(null);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type ingredient (e.g., Chicken, Potatoes, Garlic) & press Enter or paste comma-separated..."
            id="ingredient-text-input"
            className="w-full pl-12 pr-28 py-4 bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-2xl text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] focus:border-transparent shadow-sm transition-all"
          />

          <button
            type="button"
            onClick={() => addIngredientsFromString(inputValue)}
            disabled={!inputValue.trim()}
            id="add-ingredient-btn"
            className="absolute right-3 px-4 py-2 bg-[#FF8A3D] hover:bg-[#F97316] disabled:opacity-40 disabled:hover:bg-[#FF8A3D] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
            <CornerDownLeft className="w-3 h-3 opacity-70 hidden sm:inline" />
          </button>
        </div>

        {/* Validation Warning Popup/Banner */}
        {validationError && (
          <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-2.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Autocomplete Dropdown */}
        {showSuggestions && inputValue.trim().length > 0 && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-2 space-y-1">
            {filteredSuggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addIngredientsFromString(suggestion)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm text-stone-700 dark:text-stone-300 hover:bg-[#FF8A3D]/10 hover:text-[#FF8A3D] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>{suggestion}</span>
                <Plus className="w-4 h-4 text-stone-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Ingredients Chips Section */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <label className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <span>Your Ingredients</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#FF8A3D]/10 text-[#FF8A3D]">
              {ingredients.length}
            </span>
          </label>

          {ingredients.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-[#F1E6DA] dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/50">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No ingredients added yet. Type above, paste comma-separated list, or click quick-add staples below!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            <AnimatePresence>
              {ingredients.map((ing, idx) => {
                const isEditingThis = editingIndex === idx;

                if (isEditingThis) {
                  return (
                    <motion.div
                      key={`edit-${idx}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-[#FF8A3D] shadow-md"
                    >
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing(idx);
                          if (e.key === 'Escape') setEditingIndex(null);
                        }}
                        autoFocus
                        className="w-28 text-sm font-medium bg-transparent text-stone-900 dark:text-stone-100 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveEditing(idx)}
                        className="p-1 rounded-lg bg-[#FF8A3D] text-white hover:bg-[#F97316] transition-colors"
                        title="Save edit"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingIndex(null)}
                        className="p-1 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                }

                return (
                  <motion.span
                    key={ing + idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FF8A3D]/10 text-[#2C2C2C] dark:text-stone-200 border border-[#FF8A3D]/30 text-sm font-medium shadow-sm hover:border-[#FF8A3D] transition-all group"
                  >
                    <Utensils className="w-3.5 h-3.5 text-[#FF8A3D] shrink-0" />
                    <span>{ing}</span>
                    
                    <button
                      type="button"
                      onClick={() => startEditing(idx, ing)}
                      className="p-0.5 text-stone-400 hover:text-[#FF8A3D] rounded-full transition-colors opacity-70 group-hover:opacity-100"
                      title="Edit ingredient"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      className="p-0.5 text-stone-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-full transition-colors"
                      title="Remove ingredient"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Quick Add Popular Pantry Essentials */}
      <div className="space-y-2 pt-2 border-t border-[#F1E6DA] dark:border-stone-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick-Add Pantry Staples:
        </span>

        <div className="flex flex-wrap gap-1.5">
          {POPULAR_INGREDIENTS.map(item => {
            const isAdded = ingredients.some(i => i.toLowerCase() === item.toLowerCase());
            return (
              <button
                key={item}
                type="button"
                onClick={() => togglePopularItem(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-[#FF8A3D] text-white border-[#FF8A3D] shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#FF8A3D]'
                }`}
              >
                {isAdded ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" /> {item}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Plus className="w-3 h-3 text-stone-400" /> {item}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
