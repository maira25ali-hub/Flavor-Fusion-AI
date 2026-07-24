import React, { useState, useEffect } from 'react';
import { ActivePage, RecipeRequest, Recipe, UserSettings } from './types';
import { DEFAULT_RECIPE_REQUEST, DEFAULT_USER_SETTINGS, SAMPLE_INSPIRATION_RECIPES } from './data/constants';
import { 
  getSavedRecipesFromStorage, 
  saveRecipesToStorage, 
  getUserSettingsFromStorage, 
  saveUserSettingsToStorage 
} from './utils/storage';

import { aiService } from './services/aiService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { ToastContainer, ToastMessage } from './components/Toast';

import { HomePage } from './components/HomePage';
import { RecipeGeneratorPage } from './components/RecipeGeneratorPage';
import { AILoadingScreen } from './components/AILoadingScreen';
import { RecipeResultPage } from './components/RecipeResultPage';
import { SavedRecipesPage } from './components/SavedRecipesPage';
import { SettingsPage } from './components/SettingsPage';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [recipeRequest, setRecipeRequest] = useState<RecipeRequest>(DEFAULT_RECIPE_REQUEST);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load stored recipes and settings on mount
  useEffect(() => {
    const loadedSaved = getSavedRecipesFromStorage();
    setSavedRecipes(loadedSaved);

    const loadedSettings = getUserSettingsFromStorage();
    setUserSettings(loadedSettings);
  }, []);

  // Sync theme with document class and persist settings
  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (userSettings.theme === 'dark') {
        isDark = true;
      } else if (userSettings.theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    saveUserSettingsToStorage(userSettings);

    if (userSettings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [userSettings]);

  // Keep recipeRequest prefilled with default user settings
  useEffect(() => {
    setRecipeRequest(prev => ({
      ...prev,
      cuisine: userSettings.defaultCuisine || prev.cuisine,
      servingSize: userSettings.defaultServingSize || prev.servingSize,
      dietaryPreference: userSettings.defaultDietary.length > 0 ? userSettings.defaultDietary : prev.dietaryPreference,
      difficulty: userSettings.defaultDifficulty || prev.difficulty,
      cookingTimePreference: userSettings.defaultCookingTimePreference || prev.cookingTimePreference,
      healthGoal: userSettings.defaultHealthGoal || prev.healthGoal,
      language: userSettings.language || prev.language,
    }));
  }, [userSettings]);

  // Toast Notification helper
  const showToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Recipe Saving Logic
  const handleSaveRecipe = (recipeToSave: Recipe) => {
    setSavedRecipes(prev => {
      const exists = prev.some(r => r.id === recipeToSave.id);
      let updated: Recipe[];
      if (exists) {
        updated = prev.map(r => r.id === recipeToSave.id ? recipeToSave : r);
      } else {
        updated = [recipeToSave, ...prev];
      }
      saveRecipesToStorage(updated);
      return updated;
    });
  };

  const handleRemoveSavedRecipe = (id: string) => {
    setSavedRecipes(prev => {
      const updated = prev.filter(r => r.id !== id);
      saveRecipesToStorage(updated);
      return updated;
    });
  };

  const handleToggleFavorite = (id: string) => {
    if (currentRecipe && currentRecipe.id === id) {
      setCurrentRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }

    setSavedRecipes(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r);
      saveRecipesToStorage(updated);
      return updated;
    });
  };

  const handleClearAllSaved = () => {
    setSavedRecipes([]);
    saveRecipesToStorage([]);
  };

  const handleClearFavorites = () => {
    setSavedRecipes(prev => {
      const updated = prev.map(r => ({ ...r, isFavorite: false }));
      saveRecipesToStorage(updated);
      return updated;
    });
  };

  const handleClearRecentSearches = () => {
    localStorage.removeItem('flavor_fusion_recent_searches');
  };

  const handleResetSettings = () => {
    setUserSettings(DEFAULT_USER_SETTINGS);
    saveUserSettingsToStorage(DEFAULT_USER_SETTINGS);
  };

  // AI Recipe Generation Handler
  const handleGenerateRecipe = async () => {
    if (recipeRequest.ingredients.length === 0) {
      const msg = 'Please add at least 1 ingredient (e.g. Chicken, Rice, Tomatoes) before generating.';
      setErrorMsg(msg);
      showToast('Missing Ingredients', msg, 'error');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const recipeData = await aiService.generateRecipe(recipeRequest, {
        onStateChange: (state, msg) => {
          if (state === 'error' && msg) {
            setErrorMsg(msg);
          }
        },
      });

      setCurrentRecipe(recipeData);
      setIsGenerating(false);
      setActivePage('result');
      showToast('Recipe Generated!', `Created "${recipeData.title}" using Gemini AI.`, 'success');

    } catch (err: any) {
      console.error('Error generating recipe:', err);
      setIsGenerating(false);
      const msg = err.message || 'Error connecting to AI service. Please try again.';
      setErrorMsg(msg);
      showToast('Generation Error', msg, 'error');
    }
  };

  // If splash screen is active, show splash overlay
  if (showSplash) {
    return (
      <SplashScreen
        onStart={() => {
          setShowSplash(false);
          setActivePage('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F2] dark:bg-stone-950 text-[#2C2C2C] dark:text-stone-100 transition-colors">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Header */}
      <Header
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedRecipes.length}
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Loading State Overlay */}
        {isGenerating ? (
          <AILoadingScreen />
        ) : (
          <>
            {activePage === 'home' && (
              <HomePage
                setActivePage={setActivePage}
                onSelectInspirationRecipe={(recipe) => {
                  setCurrentRecipe(recipe);
                  setActivePage('result');
                }}
              />
            )}

            {activePage === 'generator' && (
              <RecipeGeneratorPage
                recipeRequest={recipeRequest}
                setRecipeRequest={setRecipeRequest}
                onGenerate={handleGenerateRecipe}
                setActivePage={setActivePage}
                errorMsg={errorMsg}
              />
            )}

            {activePage === 'result' && currentRecipe && (
              <RecipeResultPage
                recipe={currentRecipe}
                onSave={handleSaveRecipe}
                onToggleFavorite={handleToggleFavorite}
                isSaved={savedRecipes.some(r => r.id === currentRecipe.id)}
                setActivePage={setActivePage}
                showToast={showToast}
              />
            )}

            {activePage === 'saved' && (
              <SavedRecipesPage
                savedRecipes={savedRecipes}
                onRemove={handleRemoveSavedRecipe}
                onToggleFavorite={handleToggleFavorite}
                onSelectRecipe={(recipe) => {
                  setCurrentRecipe(recipe);
                  setActivePage('result');
                }}
                setActivePage={setActivePage}
                showToast={showToast}
              />
            )}

            {activePage === 'settings' && (
              <SettingsPage
                userSettings={userSettings}
                setUserSettings={setUserSettings}
                onClearAllSaved={handleClearAllSaved}
                onClearFavorites={handleClearFavorites}
                onClearRecentSearches={handleClearRecentSearches}
                onResetSettings={handleResetSettings}
                showToast={showToast}
              />
            )}
          </>
        )}

      </main>

      {/* Main Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}

export default App;
