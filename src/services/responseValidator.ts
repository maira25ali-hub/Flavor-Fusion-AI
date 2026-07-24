export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates the raw JSON response received from AI against recipe quality rules.
 */
export function validateRecipeData(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Response is empty or not a valid JSON object.'] };
  }

  // Title / Recipe Name
  const title = data.title || data.recipeName;
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Recipe title is missing or too short.');
  }

  // Description
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 5) {
    errors.push('Recipe description is missing.');
  }

  // Cuisine
  if (!data.cuisine || typeof data.cuisine !== 'string') {
    errors.push('Cuisine classification is missing.');
  }

  // Difficulty
  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  if (!data.difficulty || !validDifficulties.includes(data.difficulty)) {
    // We can auto-correct if it's slightly off, but flag if totally invalid
    if (typeof data.difficulty !== 'string') {
      errors.push('Difficulty level is missing or invalid.');
    }
  }

  // Serving Size
  const servings = data.servingSize || data.servings;
  if (typeof servings !== 'number' || servings <= 0) {
    errors.push('Serving size must be a positive integer.');
  }

  // Timings
  const prepTime = data.prepTimeMinutes ?? data.prepTime;
  const cookTime = data.cookTimeMinutes ?? data.cookTime;
  const totalTime = data.totalTimeMinutes ?? data.totalTime;

  if (typeof prepTime !== 'number' || prepTime < 0) {
    errors.push('Preparation time must be a non-negative number.');
  }
  if (typeof cookTime !== 'number' || cookTime < 0) {
    errors.push('Cooking time must be a non-negative number.');
  }

  // Ingredients List
  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
    errors.push('Ingredients list is missing or empty.');
  } else {
    // Check duplicate ingredients
    const lowerIngredients = data.ingredients.map((i: any) => String(i).toLowerCase().trim());
    const uniqueIngredients = new Set(lowerIngredients);
    if (uniqueIngredients.size < lowerIngredients.length * 0.7) {
      errors.push('Ingredients contain excessive duplicate entries.');
    }
  }

  // Instructions Steps
  if (!Array.isArray(data.instructions) || data.instructions.length === 0) {
    errors.push('Cooking instructions are missing or empty.');
  } else {
    data.instructions.forEach((step: any, idx: number) => {
      if (!step || typeof step !== 'object') {
        errors.push(`Instruction step ${idx + 1} is invalid.`);
      } else {
        const text = step.instruction || step.text || step.action;
        if (!text || typeof text !== 'string' || text.trim().length < 3) {
          errors.push(`Instruction step ${idx + 1} is missing actionable text.`);
        }
      }
    });
  }

  // Nutrition Info
  if (!data.nutrition || typeof data.nutrition !== 'object') {
    errors.push('Nutritional information object is missing.');
  } else {
    const calories = Number(data.nutrition.calories);
    if (isNaN(calories) || calories < 0) {
      errors.push('Calories must be a non-negative number.');
    }
    if (!data.nutrition.protein || typeof data.nutrition.protein !== 'string') {
      errors.push('Protein estimate is missing.');
    }
    if (!data.nutrition.carbohydrates && !data.nutrition.carbs) {
      errors.push('Carbohydrates estimate is missing.');
    }
    if (!data.nutrition.fat || typeof data.nutrition.fat !== 'string') {
      errors.push('Fat estimate is missing.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
