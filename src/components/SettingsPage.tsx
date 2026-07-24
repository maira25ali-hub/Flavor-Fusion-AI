import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, Sun, Moon, Monitor, Globe, CookingPot, 
  Scale, Bell, Database, ShieldCheck, Info, Sparkles, Mic, QrCode, 
  Calendar, ShoppingBag, Cloud, Users, Camera, Languages, Trash2, 
  RotateCcw, ChevronRight, Check, AlertTriangle, Heart, Bookmark, 
  FileText, CheckCircle2, Lock, BookOpen, Cpu, X, Flame, ShieldAlert,
  Utensils
} from 'lucide-react';
import { UserSettings, LanguageOption, DifficultyLevel, CookingTimeOption, HealthGoalOption } from '../types';
import { CUISINES, DIETARY_OPTIONS, HEALTH_GOALS } from '../data/constants';
import { calculateStorageUsage } from '../utils/storage';
import { ConfirmModal } from './ConfirmModal';

interface SettingsPageProps {
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onClearAllSaved: () => void;
  onClearFavorites: () => void;
  onClearRecentSearches: () => void;
  onResetSettings: () => void;
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userSettings,
  setUserSettings,
  onClearAllSaved,
  onClearFavorites,
  onClearRecentSearches,
  onResetSettings,
  showToast,
}) => {
  // Modal states
  const [confirmClearRecipesOpen, setConfirmClearRecipesOpen] = useState(false);
  const [confirmClearFavoritesOpen, setConfirmClearFavoritesOpen] = useState(false);
  const [confirmClearSearchesOpen, setConfirmClearSearchesOpen] = useState(false);
  const [confirmResetSettingsOpen, setConfirmResetSettingsOpen] = useState(false);

  // Legal modal state
  const [openLegalDoc, setOpenLegalDoc] = useState<'privacy' | 'terms' | 'licenses' | 'ai_disclaimer' | 'food_safety' | null>(null);

  // Storage usage recalculation state
  const [storageStats, setStorageStats] = useState(calculateStorageUsage());

  useEffect(() => {
    setStorageStats(calculateStorageUsage());
  }, [userSettings]);

  // Update Settings Helper
  const updateSettings = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setUserSettings(prev => ({ ...prev, [key]: value }));
    showToast('Preferences Saved', 'Your configuration was updated.', 'success');
  };

  // Toggle Notification Helper
  const toggleNotification = (notifKey: keyof UserSettings['notifications']) => {
    setUserSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notifKey]: !prev.notifications[notifKey],
      }
    }));
    showToast('Notification Setting Updated', 'Changes persisted to preferences.', 'info');
  };

  // Toggle Default Dietary Preference Helper
  const toggleDefaultDietary = (dietName: string) => {
    const current = userSettings.defaultDietary || [];
    const updated = current.includes(dietName)
      ? current.filter(d => d !== dietName)
      : [...current, dietName];
    
    updateSettings('defaultDietary', updated);
  };

  // Confirmation Action Handlers
  const handleConfirmClearRecipes = () => {
    onClearAllSaved();
    setConfirmClearRecipesOpen(false);
    setStorageStats(calculateStorageUsage());
    showToast('Recipes Cleared', 'All saved recipe bookmarks have been deleted.', 'info');
  };

  const handleConfirmClearFavorites = () => {
    onClearFavorites();
    setConfirmClearFavoritesOpen(false);
    showToast('Favorites Cleared', 'Favorite flags removed from recipes.', 'info');
  };

  const handleConfirmClearSearches = () => {
    onClearRecentSearches();
    setConfirmClearSearchesOpen(false);
    setStorageStats(calculateStorageUsage());
    showToast('Searches Cleared', 'Recent ingredient search history cleared.', 'info');
  };

  const handleConfirmResetSettings = () => {
    onResetSettings();
    setConfirmResetSettingsOpen(false);
    showToast('Settings Reset', 'Restored default application preferences.', 'success');
  };

  // Storage Percentage Calculation (5MB typical quota limit)
  const quotaBytes = 5 * 1024 * 1024;
  const storagePercent = Math.min(100, Math.max(1, (storageStats.bytes / quotaBytes) * 100)).toFixed(1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8 pb-20 px-2 sm:px-4"
    >
      
      {/* 1. PAGE HEADER */}
      <div className="pb-4 border-b border-[#F1E6DA] dark:border-stone-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF8A3D]/10 text-[#FF8A3D] text-xs font-semibold uppercase tracking-wider mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Application Settings</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] dark:text-stone-100">
          Settings & Personalization
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Customize theme, language, dietary defaults, notification preferences, and local storage.
        </p>
      </div>

      {/* 2. APPEARANCE SECTION */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
            <Sun className="w-5 h-5 text-[#FF8A3D]" />
            <span>Appearance & Visual Theme</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Select interface theme preference. Applied instantly and retained across sessions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Light Theme */}
          <button
            type="button"
            onClick={() => updateSettings('theme', 'light')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
              userSettings.theme === 'light'
                ? 'bg-[#FF8A3D]/10 border-[#FF8A3D] ring-2 ring-[#FF8A3D]/20 font-bold text-[#2C2C2C] dark:text-stone-100'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                <Sun className="w-5 h-5" />
              </div>
              {userSettings.theme === 'light' && <CheckCircle2 className="w-5 h-5 text-[#FF8A3D]" />}
            </div>
            <div>
              <span className="block text-sm font-bold">Light Theme</span>
              <span className="text-[11px] font-normal text-stone-500">Warm Luxury Ivory Canvas</span>
            </div>
          </button>

          {/* Dark Theme */}
          <button
            type="button"
            onClick={() => updateSettings('theme', 'dark')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
              userSettings.theme === 'dark'
                ? 'bg-[#FF8A3D]/10 border-[#FF8A3D] ring-2 ring-[#FF8A3D]/20 font-bold text-[#2C2C2C] dark:text-stone-100'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-indigo-900/60 text-indigo-300">
                <Moon className="w-5 h-5" />
              </div>
              {userSettings.theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-[#FF8A3D]" />}
            </div>
            <div>
              <span className="block text-sm font-bold">Dark Theme</span>
              <span className="text-[11px] font-normal text-stone-500">Evening Warm Charcoal Kitchen</span>
            </div>
          </button>

          {/* System Theme */}
          <button
            type="button"
            onClick={() => updateSettings('theme', 'system')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
              userSettings.theme === 'system'
                ? 'bg-[#FF8A3D]/10 border-[#FF8A3D] ring-2 ring-[#FF8A3D]/20 font-bold text-[#2C2C2C] dark:text-stone-100'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200">
                <Monitor className="w-5 h-5" />
              </div>
              {userSettings.theme === 'system' && <CheckCircle2 className="w-5 h-5 text-[#FF8A3D]" />}
            </div>
            <div>
              <span className="block text-sm font-bold">System Theme</span>
              <span className="text-[11px] font-normal text-stone-500">Sync with Device Appearance</span>
            </div>
          </button>

        </div>
      </section>

      {/* 3. LANGUAGE SECTION */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#FF8A3D]" />
            <span>Language & Localization</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Select output language for AI recipe instruction generation.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <button
            type="button"
            onClick={() => updateSettings('language', 'English')}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              userSettings.language === 'English'
                ? 'bg-[#FF8A3D]/10 border-[#FF8A3D] font-bold text-[#FF8A3D]'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <div>
                <span className="block text-sm font-bold">English</span>
                <span className="text-xs text-stone-400 font-normal">Default Global Language</span>
              </div>
            </div>
            {userSettings.language === 'English' && <CheckCircle2 className="w-5 h-5 text-[#FF8A3D]" />}
          </button>

          <button
            type="button"
            onClick={() => updateSettings('language', 'Urdu')}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              userSettings.language === 'Urdu'
                ? 'bg-[#FF8A3D]/10 border-[#FF8A3D] font-bold text-[#FF8A3D]'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇵🇰</span>
              <div>
                <span className="block text-sm font-bold">Urdu (اردو)</span>
                <span className="text-xs text-stone-400 font-normal">Full Urdu Culinary Script</span>
              </div>
            </div>
            {userSettings.language === 'Urdu' && <CheckCircle2 className="w-5 h-5 text-[#FF8A3D]" />}
          </button>

        </div>
      </section>

      {/* 4. DEFAULT COOKING PREFERENCES */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
            <CookingPot className="w-5 h-5 text-[#FF8A3D]" />
            <span>Default Culinary Preferences</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">These prefill settings automatically configure your AI Recipe Generator every time you open it.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Default Cuisine */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block uppercase tracking-wider">
              Default Cuisine Preset
            </label>
            <select
              value={userSettings.defaultCuisine}
              onChange={(e) => updateSettings('defaultCuisine', e.target.value)}
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
            >
              <option value="Pakistani">Pakistani (Traditional Karahis & Biryanis)</option>
              <option value="Indian">Indian (Curries & Tikka)</option>
              <option value="Italian">Italian (Pastas & Risotto)</option>
              <option value="Chinese">Chinese (Wok Stir-fries)</option>
              <option value="American">American (BBQ & Gourmet)</option>
              <option value="Mexican">Mexican (Tacos & Burritos)</option>
              <option value="Desserts">Desserts & Bakery</option>
              <option value="Any">Any / Fusion</option>
            </select>
          </div>

          {/* Default Serving Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block uppercase tracking-wider">
              Default Serving Size
            </label>
            <select
              value={userSettings.defaultServingSize}
              onChange={(e) => updateSettings('defaultServingSize', Number(e.target.value))}
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Portion (Solo)' : 'Portions (Family)'}</option>
              ))}
            </select>
          </div>

          {/* Default Cooking Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block uppercase tracking-wider">
              Default Cooking Time
            </label>
            <select
              value={userSettings.defaultCookingTimePreference}
              onChange={(e) => updateSettings('defaultCookingTimePreference', e.target.value as CookingTimeOption)}
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
            >
              <option value="Quick (<20 mins)">Quick (&lt;20 mins)</option>
              <option value="30 Minutes">30 Minutes</option>
              <option value="45 Minutes">45 Minutes</option>
              <option value="60 Minutes">60 Minutes</option>
              <option value="Relaxed (40+ mins)">Relaxed (40+ mins)</option>
              <option value="Any">Any Duration</option>
            </select>
          </div>

          {/* Default Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block uppercase tracking-wider">
              Default Skill Level
            </label>
            <select
              value={userSettings.defaultDifficulty}
              onChange={(e) => updateSettings('defaultDifficulty', e.target.value as DifficultyLevel)}
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
            >
              <option value="Easy">Easy (Beginner Friendly)</option>
              <option value="Medium">Medium (Intermediate Cook)</option>
              <option value="Hard">Hard (Executive Chef Masterclass)</option>
              <option value="Any">Any Difficulty</option>
            </select>
          </div>

          {/* Default Health Goal */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block uppercase tracking-wider">
              Default Health & Dietary Goal
            </label>
            <select
              value={userSettings.defaultHealthGoal}
              onChange={(e) => updateSettings('defaultHealthGoal', e.target.value as HealthGoalOption)}
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
            >
              {HEALTH_GOALS.map(goal => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Default Dietary Restrictions Multiselect */}
        <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block uppercase tracking-wider">
            Default Dietary Restrictions
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map(diet => {
              const isSelected = (userSettings.defaultDietary || []).includes(diet.name);
              return (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => toggleDefaultDietary(diet.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  {isSelected && '✓ '}{diet.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. MEASUREMENT UNITS */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#FF8A3D]" />
            <span>Measurement Units</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Choose metric or imperial units for recipe quantities and temperatures.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <button
            type="button"
            onClick={() => updateSettings('measurementUnit', 'metric')}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              userSettings.measurementUnit === 'metric'
                ? 'bg-[#FF8A3D]/10 border-[#FF8A3D] font-bold text-[#FF8A3D]'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div>
              <span className="block text-sm font-bold">Metric System</span>
              <span className="text-xs text-stone-400 font-normal">Grams (g), Milliliters (ml), Celsius (°C)</span>
            </div>
            {userSettings.measurementUnit === 'metric' && <CheckCircle2 className="w-5 h-5 text-[#FF8A3D]" />}
          </button>

          <button
            type="button"
            onClick={() => updateSettings('measurementUnit', 'imperial')}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              userSettings.measurementUnit === 'imperial'
                ? 'bg-[#FF8A3D]/10 border-[#FF8A3D] font-bold text-[#FF8A3D]'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div>
              <span className="block text-sm font-bold">Imperial System</span>
              <span className="text-xs text-stone-400 font-normal">Ounces (oz), Cups, Fahrenheit (°F)</span>
            </div>
            {userSettings.measurementUnit === 'imperial' && <CheckCircle2 className="w-5 h-5 text-[#FF8A3D]" />}
          </button>

        </div>
      </section>

      {/* 6. NOTIFICATION PREFERENCES */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF8A3D]" />
            <span>Notification & Inspiration Preferences</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Configure preferred alert categories for upcoming push updates.</p>
        </div>

        <div className="space-y-3">
          
          {/* Recipe Reminders */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700">
            <div>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">Meal Timer & Cooking Reminders</span>
              <p className="text-xs text-stone-500">Alerts when dish preparation steps reach key milestones</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification('recipeReminders')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                userSettings.notifications.recipeReminders ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                userSettings.notifications.recipeReminders ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Cooking Tips */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700">
            <div>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">Pro Executive Chef Tips</span>
              <p className="text-xs text-stone-500">Daily culinary secrets and knife skill advice</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification('cookingTips')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                userSettings.notifications.cookingTips ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                userSettings.notifications.cookingTips ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Weekly Inspiration */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700">
            <div>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">Weekly Fusion Inspiration</span>
              <p className="text-xs text-stone-500">Hand-curated trending recipes every weekend</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification('weeklyInspiration')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                userSettings.notifications.weeklyInspiration ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                userSettings.notifications.weeklyInspiration ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Seasonal Recipes */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700">
            <div>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">Seasonal Produce & Holiday Specials</span>
              <p className="text-xs text-stone-500">Alerts when peak seasonal ingredients arrive</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification('seasonalRecipes')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                userSettings.notifications.seasonalRecipes ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                userSettings.notifications.seasonalRecipes ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

        </div>
      </section>

      {/* 7. STORAGE MANAGEMENT */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Database className="w-5 h-5" />
            <span>Storage & Local Data Management</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Manage cached data stored locally in your browser sandbox.</p>
        </div>

        {/* Usage Meter */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
            <span>Browser LocalStorage Used</span>
            <span className="text-[#FF8A3D]">{storageStats.formatted} (~{storagePercent}% Quota)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF8A3D] to-orange-600 rounded-full" 
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <button
            type="button"
            onClick={() => setConfirmClearRecipesOpen(true)}
            className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-left flex items-center justify-between hover:bg-rose-100/70 transition-colors"
          >
            <div>
              <span className="block text-xs font-bold text-rose-900 dark:text-rose-200">Clear Saved Recipes</span>
              <span className="text-[11px] text-rose-700/80 dark:text-rose-400">Removes all recipe bookmarks</span>
            </div>
            <Trash2 className="w-4 h-4 text-rose-600" />
          </button>

          <button
            type="button"
            onClick={() => setConfirmClearFavoritesOpen(true)}
            className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-left flex items-center justify-between hover:bg-rose-100/70 transition-colors"
          >
            <div>
              <span className="block text-xs font-bold text-rose-900 dark:text-rose-200">Clear Favorites Only</span>
              <span className="text-[11px] text-rose-700/80 dark:text-rose-400">Unmarks favorite recipe flags</span>
            </div>
            <Heart className="w-4 h-4 text-rose-600" />
          </button>

          <button
            type="button"
            onClick={() => setConfirmClearSearchesOpen(true)}
            className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-left flex items-center justify-between hover:bg-rose-100/70 transition-colors"
          >
            <div>
              <span className="block text-xs font-bold text-rose-900 dark:text-rose-200">Clear Recent Searches</span>
              <span className="text-[11px] text-rose-700/80 dark:text-rose-400">Purges ingredient search history</span>
            </div>
            <RotateCcw className="w-4 h-4 text-rose-600" />
          </button>

          <button
            type="button"
            onClick={() => setConfirmResetSettingsOpen(true)}
            className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-left flex items-center justify-between hover:bg-stone-200 dark:hover:bg-stone-750 transition-colors"
          >
            <div>
              <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">Reset All Settings</span>
              <span className="text-[11px] text-stone-500">Restores defaults</span>
            </div>
            <RotateCcw className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          </button>

        </div>
      </section>

      {/* 8. PRIVACY & LEGAL DISCLAIMERS */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Privacy & Legal Terms</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Read terms of service, privacy protections, open-source licenses, and safety disclaimers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <button
            type="button"
            onClick={() => setOpenLegalDoc('privacy')}
            className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-left hover:border-[#FF8A3D] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            type="button"
            onClick={() => setOpenLegalDoc('terms')}
            className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-left hover:border-[#FF8A3D] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">Terms of Service</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            type="button"
            onClick={() => setOpenLegalDoc('licenses')}
            className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-left hover:border-[#FF8A3D] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">Open Source Licenses</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            type="button"
            onClick={() => setOpenLegalDoc('ai_disclaimer')}
            className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-left hover:border-[#FF8A3D] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">AI Disclaimer</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            type="button"
            onClick={() => setOpenLegalDoc('food_safety')}
            className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-left hover:border-[#FF8A3D] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">Food Safety Advisory</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

        </div>
      </section>

      {/* 9. INNOVATION ROADMAP */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 text-white space-y-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Innovation Roadmap & Future Expansion</span>
        </div>

        <div>
          <h3 className="font-serif text-2xl font-bold">Planned Features & Cloud Modules</h3>
          <p className="text-xs text-stone-400 mt-1">Upcoming feature releases planned for upcoming versions of Flavor Fusion AI.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <Mic className="w-5 h-5 text-[#FF8A3D]" />
            <h4 className="text-xs font-bold text-stone-200">Hands-free Voice Assistant</h4>
            <p className="text-[11px] text-stone-400">Speak your ingredients and listen to step-by-step guidance.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-stone-200">Pantry Barcode Scanner</h4>
            <p className="text-[11px] text-stone-400">Scan grocery package barcodes directly into kitchen inventory.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h4 className="text-xs font-bold text-stone-200">7-Day Meal Planner</h4>
            <p className="text-[11px] text-stone-400">Automate weekly dinner schedules and meal prep timelines.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <h4 className="text-xs font-bold text-stone-200">Smart Grocery List</h4>
            <p className="text-[11px] text-stone-400">Auto-consolidate missing ingredients into ordered shopping checklists.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <Cloud className="w-5 h-5 text-indigo-400" />
            <h4 className="text-xs font-bold text-stone-200">Cloud Sync & Accounts</h4>
            <p className="text-[11px] text-stone-400">Sync saved recipe collections across mobile and desktop devices.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <Users className="w-5 h-5 text-rose-400" />
            <h4 className="text-xs font-bold text-stone-200">Recipe Sharing Community</h4>
            <p className="text-[11px] text-stone-400">Publish custom fusion creations and rate community recipes.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <Camera className="w-5 h-5 text-purple-400" />
            <h4 className="text-xs font-bold text-stone-200">AI Fridge Visual Analyzer</h4>
            <p className="text-[11px] text-stone-400">Snap a photo of your open refrigerator to identify ingredients.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h4 className="text-xs font-bold text-stone-200">AI Photorealistic Dish Renderer</h4>
            <p className="text-[11px] text-stone-400">Generate high-definition imagery for newly created recipes.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1">
            <Languages className="w-5 h-5 text-cyan-400" />
            <h4 className="text-xs font-bold text-stone-200">Global Multi-Language Support</h4>
            <p className="text-[11px] text-stone-400">Spanish, French, Arabic, Chinese, and German translations.</p>
          </div>

        </div>
      </section>

      {/* 10. ABOUT APPLICATION CARD */}
      <section className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2C2C] dark:text-stone-100">
                Flavor Fusion AI
              </h3>
              <p className="text-xs text-stone-500">Version 2.5.0 • Production Build</p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#FF8A3D] font-bold text-xs border border-amber-200 dark:border-amber-800">
            Powered by Gemini 3.6 Flash
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            <strong>Flavor Fusion AI</strong> is an intelligent culinary companion that transforms your available home pantry ingredients into gourmet, custom recipes. Designed with executive chef principles, it eliminates food waste and crafts balanced meals tailored to your precise dietary preferences.
          </p>
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200 text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-[#FF8A3D]" />
              <span>Technology Stack & Architecture</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Built using React 18, Vite, TypeScript, Tailwind CSS, Motion animations, Express.js server middleware, and Google GenAI SDK with Gemini 3.6 Flash.
            </p>
          </div>
          <p className="text-xs text-stone-400">
            Developed by Google AI Studio Build Agent • All rights reserved.
          </p>
        </div>
      </section>

      {/* CONFIRMATION MODALS */}
      <ConfirmModal
        isOpen={confirmClearRecipesOpen}
        title="Clear All Saved Recipes?"
        message="This action will permanently delete all your saved recipe bookmarks from browser storage. Are you sure?"
        confirmLabel="Delete Saved Recipes"
        variant="danger"
        onConfirm={handleConfirmClearRecipes}
        onCancel={() => setConfirmClearRecipesOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmClearFavoritesOpen}
        title="Clear Favorite Flags?"
        message="This will unmark all favorite flags from your saved recipes. Recipes will remain saved."
        confirmLabel="Clear Favorites"
        variant="warning"
        onConfirm={handleConfirmClearFavorites}
        onCancel={() => setConfirmClearFavoritesOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmClearSearchesOpen}
        title="Clear Recent Ingredient History?"
        message="This will clear your recent ingredient search input history."
        confirmLabel="Clear Search History"
        variant="warning"
        onConfirm={handleConfirmClearSearches}
        onCancel={() => setConfirmClearSearchesOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmResetSettingsOpen}
        title="Reset All Preferences?"
        message="This will restore all default preferences for theme, language, cuisine, and dietary defaults. Saved recipes will not be deleted."
        confirmLabel="Reset Defaults"
        variant="warning"
        onConfirm={handleConfirmResetSettings}
        onCancel={() => setConfirmResetSettingsOpen(false)}
      />

      {/* LEGAL DOCUMENT MODAL */}
      <AnimatePresence>
        {openLegalDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-[#F1E6DA] dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <h3 className="font-serif text-xl font-bold text-[#2C2C2C] dark:text-stone-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#FF8A3D]" />
                  <span>
                    {openLegalDoc === 'privacy' && 'Privacy Policy'}
                    {openLegalDoc === 'terms' && 'Terms of Service'}
                    {openLegalDoc === 'licenses' && 'Open Source Software Licenses'}
                    {openLegalDoc === 'ai_disclaimer' && 'AI Generation Disclaimer'}
                    {openLegalDoc === 'food_safety' && 'Food Safety & Allergen Advisory'}
                  </span>
                </h3>
                <button
                  onClick={() => setOpenLegalDoc(null)}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {openLegalDoc === 'privacy' && (
                  <>
                    <p><strong>Flavor Fusion AI</strong> prioritizes user privacy. All recipe requests, ingredient selections, and preferences are processed strictly client-side or through encrypted server proxy endpoints.</p>
                    <p>No personal identifying information or credit card data is logged or sold to third parties. Local preferences are stored securely in your browser's local sandbox environment.</p>
                  </>
                )}

                {openLegalDoc === 'terms' && (
                  <>
                    <p>By using Flavor Fusion AI, you agree to generate culinary recipes for personal, non-commercial use. AI-generated culinary outputs are provided "as-is" for inspiration.</p>
                    <p>Users are responsible for verifying ingredient suitability, freshness, and personal dietary restrictions before preparation.</p>
                  </>
                )}

                {openLegalDoc === 'licenses' && (
                  <>
                    <p>This software uses high-quality open-source components under the MIT license:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>React & React DOM (MIT)</li>
                      <li>Tailwind CSS (MIT)</li>
                      <li>Lucide React Icons (ISC)</li>
                      <li>Framer Motion / Motion (MIT)</li>
                      <li>Google GenAI TypeScript SDK (Apache 2.0)</li>
                    </ul>
                  </>
                )}

                {openLegalDoc === 'ai_disclaimer' && (
                  <>
                    <p>Recipes generated by Flavor Fusion AI are synthesized dynamically using Gemini 3.6 Flash. While prompts are engineered for culinary accuracy, AI outputs should be checked with common sense regarding cooking times, liquid ratios, and spice levels.</p>
                  </>
                )}

                {openLegalDoc === 'food_safety' && (
                  <>
                    <p><strong>Food Safety Instructions:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ensure meats are cooked to safe minimum internal temperatures (Poultry: 165°F / 74°C, Ground Meats: 160°F / 71°C).</li>
                      <li>Always verify allergen labels on packaged ingredients before cooking for individuals with severe allergies.</li>
                      <li>Store perishable items below 40°F (4°C).</li>
                    </ul>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-right">
                <button
                  onClick={() => setOpenLegalDoc(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#FF8A3D] hover:bg-[#F97316] text-white text-xs font-bold"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
