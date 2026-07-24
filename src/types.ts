/**
 * Flavor Fusion AI - Types & Interfaces
 */

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Any';

export type CookingTimeOption = 
  | '15 Minutes'
  | '30 Minutes'
  | '45 Minutes'
  | '60 Minutes'
  | 'No Preference'
  | 'Quick (<20 mins)'
  | 'Medium (20-40 mins)'
  | 'Relaxed (40+ mins)'
  | 'Any';

export type HealthGoalOption = 
  | 'Balanced'
  | 'Weight Loss'
  | 'High Protein'
  | 'Muscle Gain'
  | 'Low Sugar'
  | 'Heart Healthy'
  | 'Family Friendly'
  | 'None';

export type LanguageOption = 'English' | 'Urdu';

export type AICommunicationState = 
  | 'idle'
  | 'preparing'
  | 'sending'
  | 'waiting'
  | 'receiving'
  | 'parsing'
  | 'validating'
  | 'completed'
  | 'error'
  | 'cancelled';

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbohydrates: string;
  fat: string;
  fiber: string;
  sugar: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  estimatedMinutes?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servingSize: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  ingredients: string[];
  missingIngredients: string[];
  missingIngredientsMessage?: string;
  nutrition: NutritionInfo;
  instructions: RecipeStep[];
  cookingTips: string[];
  healthierAlternatives: string[];
  dietaryTags: string[];
  warnings?: string[];
  recipeSummary?: string;
  imageUrl?: string;
  createdAt: string;
  isFavorite?: boolean;
  lastOpened?: string;
  downloadCount?: number;
}

export interface RecipeRequest {
  ingredients: string[];
  cuisine: string;
  dietaryPreference: string[];
  servingSize: number;
  difficulty: DifficultyLevel;
  cookingTimePreference: CookingTimeOption;
  healthyOption: boolean;
  healthGoal?: HealthGoalOption;
  language?: LanguageOption;
}

export interface NotificationSettings {
  recipeReminders: boolean;
  cookingTips: boolean;
  weeklyInspiration: boolean;
  seasonalRecipes: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: LanguageOption;
  measurementUnit: 'metric' | 'imperial';
  defaultCuisine: string;
  defaultDietary: string[];
  defaultServingSize: number;
  defaultCookingTimePreference: CookingTimeOption;
  defaultDifficulty: DifficultyLevel;
  defaultHealthGoal: HealthGoalOption;
  notifications: NotificationSettings;
}

export interface CuisineOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge: string;
  popularDishes: string[];
  bgGradient: string;
  imageUrl: string;
}

export interface DietOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeColor: string;
}

export type ActivePage = 
  | 'home' 
  | 'generator' 
  | 'result' 
  | 'saved' 
  | 'settings' 
  | 'splash';
