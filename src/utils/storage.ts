import { Recipe, UserSettings } from '../types';
import { SAMPLE_INSPIRATION_RECIPES, DEFAULT_USER_SETTINGS } from '../data/constants';

const SAVED_RECIPES_KEY = 'flavor_fusion_saved_recipes';
const USER_SETTINGS_KEY = 'flavor_fusion_user_settings';
const RECENT_SEARCHES_KEY = 'flavor_fusion_recent_searches';

export function getSavedRecipes(): Recipe[] {
  try {
    const data = localStorage.getItem(SAVED_RECIPES_KEY);
    if (!data) {
      // Seed with sample inspiration recipes for a great initial experience
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(SAMPLE_INSPIRATION_RECIPES));
      return SAMPLE_INSPIRATION_RECIPES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load saved recipes from localStorage:', err);
    return SAMPLE_INSPIRATION_RECIPES;
  }
}

export function saveRecipeToStorage(recipe: Recipe): Recipe[] {
  try {
    const existing = getSavedRecipes();
    // Prevent duplicates by ID or title
    const filtered = existing.filter(r => r.id !== recipe.id && r.title.toLowerCase() !== recipe.title.toLowerCase());
    const updated = [{ ...recipe, lastOpened: new Date().toISOString() }, ...filtered];
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save recipe to localStorage:', err);
    return [];
  }
}

export function removeRecipeFromStorage(id: string): Recipe[] {
  try {
    const existing = getSavedRecipes();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to remove recipe from localStorage:', err);
    return [];
  }
}

export function toggleFavoriteInStorage(id: string): Recipe[] {
  try {
    const existing = getSavedRecipes();
    const updated = existing.map(r => {
      if (r.id === id) {
        return { ...r, isFavorite: !r.isFavorite };
      }
      return r;
    });
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to toggle favorite in localStorage:', err);
    return [];
  }
}

export function getUserSettings(): UserSettings {
  try {
    const data = localStorage.getItem(USER_SETTINGS_KEY);
    if (!data) return DEFAULT_USER_SETTINGS;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_USER_SETTINGS,
      ...parsed,
      notifications: {
        ...DEFAULT_USER_SETTINGS.notifications,
        ...(parsed.notifications || {}),
      },
    };
  } catch (err) {
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save user settings:', err);
  }
}

// Aliases for convenience
export const getSavedRecipesFromStorage = getSavedRecipes;
export const saveRecipesToStorage = (recipes: Recipe[]) => {
  try {
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(recipes));
  } catch (err) {
    console.error('Failed to save recipes array:', err);
  }
};
export const getUserSettingsFromStorage = getUserSettings;
export const saveUserSettingsToStorage = saveUserSettings;

export function getRecentSearches(): string[] {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(search: string): void {
  try {
    if (!search.trim()) return;
    const existing = getRecentSearches().filter(s => s.toLowerCase() !== search.toLowerCase());
    const updated = [search.trim(), ...existing].slice(0, 8);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update recent searches:', err);
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (err) {
    console.error('Failed to clear recent searches:', err);
  }
}

export function calculateStorageUsage(): { bytes: number; formatted: string } {
  try {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        totalBytes += (key.length + val.length) * 2; // UTF-16 approximate
      }
    }
    const kb = (totalBytes / 1024).toFixed(1);
    return { bytes: totalBytes, formatted: `${kb} KB` };
  } catch {
    return { bytes: 0, formatted: '0 KB' };
  }
}

