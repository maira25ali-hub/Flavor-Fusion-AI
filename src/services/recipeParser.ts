import { Recipe, RecipeRequest, RecipeStep } from '../types';

/**
 * Image library per cuisine for attractive recipe presentation
 */
const CUISINE_IMAGES: Record<string, string[]> = {
  Pakistani: [
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
  ],
  Indian: [
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  ],
  Italian: [
    'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  ],
  Chinese: [
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
  ],
  American: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
  ],
  Mexican: [
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
  ],
  Desserts: [
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  ],
  'Fast Food': [
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80',
  ],
  'Healthy Meals': [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  ]
};

function getRandomCuisineImage(cuisine: string, title: string): string {
  const images = CUISINE_IMAGES[cuisine] || CUISINE_IMAGES['Healthy Meals'];
  const index = Math.abs(title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % images.length;
  return images[index];
}

/**
 * Normalizes raw JSON response into a pristine, fully validated Recipe object.
 */
export function parseAndNormalizeRecipe(data: any, request: RecipeRequest): Recipe {
  const title = (data.title || data.recipeName || 'Gourmet Chef Special').trim();
  const description = (data.description || 'A delicious and customized dish tailored to your ingredients and preferences.').trim();
  const cuisine = data.cuisine || request.cuisine || 'Fusion';

  const validDiff = ['Easy', 'Medium', 'Hard'].includes(data.difficulty) ? data.difficulty : request.difficulty || 'Easy';
  const servingSize = Number(data.servingSize || data.servings) || request.servingSize || 2;

  const prepTimeMinutes = Math.max(5, Number(data.prepTimeMinutes ?? data.prepTime) || 15);
  const cookTimeMinutes = Math.max(10, Number(data.cookTimeMinutes ?? data.cookTime) || 20);
  const totalTimeMinutes = Number(data.totalTimeMinutes ?? data.totalTime) || (prepTimeMinutes + cookTimeMinutes);

  // Clean & deduplicate ingredients
  const rawIngredients: string[] = Array.isArray(data.ingredients) ? data.ingredients : request.ingredients;
  const ingredients = Array.from(new Set(rawIngredients.map(i => String(i).trim()))).filter(Boolean);

  const missingIngredients: string[] = Array.isArray(data.missingIngredients)
    ? data.missingIngredients.map(i => String(i).trim()).filter(Boolean).slice(0, 3)
    : [];

  const missingIngredientsMessage = data.missingIngredientsMessage || data.recipeSummary ||
    (missingIngredients.length > 0
      ? `You just need ${missingIngredients.join(' and ')} to finish this meal!`
      : 'You have all necessary ingredients at home!');

  // Instructions step normalization
  const rawSteps = Array.isArray(data.instructions) ? data.instructions : [];
  const instructions: RecipeStep[] = rawSteps.map((step: any, idx: number) => ({
    stepNumber: Number(step.stepNumber) || (idx + 1),
    instruction: String(step.instruction || step.text || step.action || `Step ${idx + 1}`).trim(),
    estimatedMinutes: Number(step.estimatedMinutes) || Math.ceil(cookTimeMinutes / Math.max(1, rawSteps.length)),
    tip: step.tip ? String(step.tip).trim() : undefined,
  }));

  // Nutrition normalization
  const rawNutrition = data.nutrition || {};
  const nutrition = {
    calories: Math.max(100, Number(rawNutrition.calories) || 450),
    protein: String(rawNutrition.protein || '24g'),
    carbohydrates: String(rawNutrition.carbohydrates || rawNutrition.carbs || '40g'),
    fat: String(rawNutrition.fat || '15g'),
    fiber: String(rawNutrition.fiber || '5g'),
    sugar: String(rawNutrition.sugar || '4g'),
  };

  const cookingTips = Array.isArray(data.cookingTips)
    ? data.cookingTips.map(t => String(t).trim()).filter(Boolean)
    : ['Preheat your cooking pan before adding oil for maximum non-stick performance.', 'Adjust seasonings near the end of cooking.'];

  const healthierAlternatives = Array.isArray(data.healthierAlternatives)
    ? data.healthierAlternatives.map(h => String(h).trim()).filter(Boolean)
    : ['Use olive oil spray instead of butter for a lighter calorie profile.'];

  const dietaryTags = Array.isArray(data.dietaryTags)
    ? data.dietaryTags.map(d => String(d).trim()).filter(Boolean)
    : (request.dietaryPreference || []);

  const warnings = Array.isArray(data.warnings)
    ? data.warnings.map(w => String(w).trim()).filter(Boolean)
    : [];

  const recipeSummary = data.recipeSummary || description;

  const imageUrl = data.imageUrl || getRandomCuisineImage(cuisine, title);

  return {
    id: data.id || `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    description,
    cuisine,
    difficulty: validDiff as 'Easy' | 'Medium' | 'Hard',
    servingSize,
    prepTimeMinutes,
    cookTimeMinutes,
    totalTimeMinutes,
    ingredients,
    missingIngredients,
    missingIngredientsMessage,
    nutrition,
    instructions,
    cookingTips,
    healthierAlternatives,
    dietaryTags,
    warnings,
    recipeSummary,
    imageUrl,
    createdAt: data.createdAt || new Date().toISOString(),
    isFavorite: Boolean(data.isFavorite),
    lastOpened: new Date().toISOString(),
    downloadCount: Number(data.downloadCount) || 0,
  };
}

/**
 * Generates a high-quality, practical fallback recipe if AI services are unavailable or timing out.
 */
export function generateFallbackRecipe(request: RecipeRequest, errorMessage?: string): Recipe {
  const ingList = request.ingredients.length > 0 ? request.ingredients : ['Chicken', 'Garlic', 'Olive Oil', 'Rice'];
  const mainIng = ingList[0] || 'Vegetable';
  const secondIng = ingList[1] || 'Herb';
  const cuisine = request.cuisine || 'Pakistani';

  const title = `Gourmet ${cuisine} ${mainIng} & ${secondIng} Fusion`;
  const description = `A flavorful and aromatic ${cuisine.toLowerCase()} inspired dish combining ${ingList.join(', ')} prepared with balanced seasonings.`;

  const isUrdu = request.language === 'Urdu';

  const steps: RecipeStep[] = isUrdu
    ? [
        { stepNumber: 1, instruction: `تمام ترکیبات (${ingList.join(', ')}) کو صاف اور باریک کاٹ لیں اور برتن کو درمیانی انچ پر گرم کریں۔`, estimatedMinutes: 5, tip: 'تازو اجزاء ذائقہ دوبالا کرتے ہیں۔' },
        { stepNumber: 2, instruction: `${mainIng} اور مصالحہ جات کو پین میں ڈال کر 8-10 منٹ تک سنہری ہونے تک بھونیں۔`, estimatedMinutes: 10, tip: 'کم انچ پر مسلسل چمچ چلائیں۔' },
        { stepNumber: 3, instruction: `باقی اجزاء شامل کریں اور 5 منٹ تک ڈھانپ کر ہلکی انچ پر پکائیں۔`, estimatedMinutes: 5, tip: 'گرم گرم پیش کریں۔' },
      ]
    : [
        { stepNumber: 1, instruction: `Prepare and clean your main ingredients (${ingList.join(', ')}). Slice into even bite-sized pieces.`, estimatedMinutes: 5, tip: 'Uniform cuts ensure even cooking time across all ingredients.' },
        { stepNumber: 2, instruction: `Heat a non-stick skillet or pan over medium heat with a light splash of oil. Add ${mainIng} and sauté until fragrant and lightly caramelized.`, estimatedMinutes: 8, tip: 'Do not overcrowd the pan to retain intense searing flavor.' },
        { stepNumber: 3, instruction: `Incorporate the remaining ingredients (${ingList.slice(1).join(', ')}) along with basic salt and pepper to taste. Cover and simmer gently.`, estimatedMinutes: 7, tip: 'Simmering allows flavors to meld together perfectly.' },
        { stepNumber: 4, instruction: `Garnish with fresh herbs, adjust salt to preference, and serve hot for ${request.servingSize} ${request.servingSize === 1 ? 'person' : 'people'}.`, estimatedMinutes: 2, tip: 'Serve immediately with fresh warm bread or rice.' },
      ];

  return {
    id: `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    description,
    cuisine,
    difficulty: request.difficulty === 'Any' ? 'Easy' : request.difficulty,
    servingSize: request.servingSize,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    ingredients: ingList,
    missingIngredients: ['Salt & Black Pepper', 'Cooking Oil'],
    missingIngredientsMessage: 'You only need standard kitchen oil and salt to complete this recipe!',
    nutrition: {
      calories: 420 * request.servingSize,
      protein: '26g',
      carbohydrates: '38g',
      fat: '14g',
      fiber: '4g',
      sugar: '3g',
    },
    instructions: steps,
    cookingTips: [
      'Preheat your skillet before adding ingredients to seal in natural juices.',
      'Taste test near the end of cooking before adding extra salt.',
    ],
    healthierAlternatives: [
      'Use extra virgin olive oil or air-fry for a lower calorie profile.',
    ],
    dietaryTags: request.dietaryPreference || ['Healthy'],
    warnings: errorMessage ? [`Note: Generated using culinary offline backup engine (${errorMessage})`] : [],
    recipeSummary: description,
    imageUrl: getRandomCuisineImage(cuisine, title),
    createdAt: new Date().toISOString(),
    isFavorite: false,
    lastOpened: new Date().toISOString(),
    downloadCount: 0,
  };
}
