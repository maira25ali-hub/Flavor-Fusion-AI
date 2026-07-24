import { Recipe, RecipeRequest } from '../types';

interface CacheEntry {
  recipe: Recipe;
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL
const memoryCache = new Map<string, CacheEntry>();

/**
 * Creates a deterministic string key for caching identical recipe requests.
 */
export function getCacheKey(request: RecipeRequest): string {
  const sortedIngredients = [...(request.ingredients || [])]
    .map(i => i.trim().toLowerCase())
    .sort()
    .join('|');

  const sortedDiets = [...(request.dietaryPreference || [])]
    .map(d => d.trim().toLowerCase())
    .sort()
    .join('|');

  return [
    sortedIngredients,
    (request.cuisine || 'Pakistani').toLowerCase(),
    sortedDiets,
    request.servingSize || 2,
    request.difficulty || 'Easy',
    request.cookingTimePreference || '30 Minutes',
    request.healthyOption ? '1' : '0',
    (request.healthGoal || 'Balanced').toLowerCase(),
    (request.language || 'English').toLowerCase(),
  ].join('::');
}

/**
 * Retrieves a cached recipe if it exists and has not expired.
 */
export function getCachedRecipe(request: RecipeRequest): Recipe | null {
  const key = getCacheKey(request);
  const entry = memoryCache.get(key);

  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    memoryCache.delete(key);
    return null;
  }

  // Return fresh copy with updated id & createdAt timestamp
  return {
    ...entry.recipe,
    id: `cached_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Stores a generated recipe in the in-memory cache.
 */
export function setCachedRecipe(request: RecipeRequest, recipe: Recipe): void {
  const key = getCacheKey(request);
  memoryCache.set(key, {
    recipe,
    timestamp: Date.now(),
  });
}

/**
 * Clears the entire in-memory AI recipe cache.
 */
export function clearAICache(): void {
  memoryCache.clear();
}
