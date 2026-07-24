import { CuisineOption, DietOption, Recipe, RecipeRequest, UserSettings } from '../types';

export const DEFAULT_RECIPE_REQUEST: RecipeRequest = {
  ingredients: ['Chicken', 'Garlic', 'Tomatoes'],
  cuisine: 'Pakistani',
  dietaryPreference: [],
  servingSize: 2,
  difficulty: 'Easy',
  cookingTimePreference: '30 Minutes',
  healthyOption: false,
  healthGoal: 'Balanced',
  language: 'English',
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'light',
  language: 'English',
  measurementUnit: 'metric',
  defaultCuisine: 'Pakistani',
  defaultDietary: [],
  defaultServingSize: 2,
  defaultCookingTimePreference: '30 Minutes',
  defaultDifficulty: 'Easy',
  defaultHealthGoal: 'Balanced',
  notifications: {
    recipeReminders: true,
    cookingTips: true,
    weeklyInspiration: true,
    seasonalRecipes: false,
  },
};

export const POPULAR_INGREDIENTS = [
  'Chicken', 'Potatoes', 'Tomatoes', 'Cheese', 'Butter',
  'Garlic', 'Onions', 'Eggs', 'Rice', 'Olive Oil',
  'Milk', 'Spinach', 'Mushrooms', 'Bell Peppers', 'Pasta',
  'Yogurt', 'Paneer', 'Ginger', 'Chili Flakes', 'Lemon'
];

export const CUISINES: CuisineOption[] = [
  {
    id: 'Pakistani',
    name: 'Pakistani',
    description: 'Rich, aromatic curries, biryanis, and flame-grilled karahis.',
    icon: 'Flame',
    badge: 'Aromatic & Spiced',
    popularDishes: ['Chicken Karahi', 'Biryani', 'Daal Fry'],
    bgGradient: 'from-amber-500/20 to-orange-600/20',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Indian',
    name: 'Indian',
    description: 'Vibrant spices, savory dahls, creamy tikka masala, and flatbreads.',
    icon: 'CookingPot',
    badge: 'Rich Spices',
    popularDishes: ['Butter Chicken', 'Paneer Butter Masala', 'Chana Masala'],
    bgGradient: 'from-orange-500/20 to-red-600/20',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Italian',
    name: 'Italian',
    description: 'Fresh basil, extra virgin olive oil, handmade pasta, and risotto.',
    icon: 'Pizza',
    badge: 'Classic European',
    popularDishes: ['Pasta Arrabbiata', 'Margherita Pizza', 'Risotto'],
    bgGradient: 'from-emerald-500/20 to-teal-600/20',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Chinese',
    name: 'Chinese',
    description: 'Wok-tossed stir-fries, savory soy-garlic sauces, and dim sum.',
    icon: 'Utensils',
    badge: 'Wok Mastered',
    popularDishes: ['Kung Pao Chicken', 'Egg Fried Rice', 'Chow Mein'],
    bgGradient: 'from-red-500/20 to-rose-600/20',
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'American',
    name: 'American',
    description: 'Hearty burgers, crisp salads, barbecue glazes, and mac & cheese.',
    icon: 'Beef',
    badge: 'Comfort Food',
    popularDishes: ['Gourmet Burger', 'BBQ Chicken Wings', 'Mac & Cheese'],
    bgGradient: 'from-blue-500/20 to-indigo-600/20',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Mexican',
    name: 'Mexican',
    description: 'Zesty limes, fresh cilantro, smoky chilies, tacos, and quesadillas.',
    icon: 'Sun',
    badge: 'Zesty & Bold',
    popularDishes: ['Cheesy Quesadilla', 'Chicken Tacos', 'Guacamole bowl'],
    bgGradient: 'from-yellow-500/20 to-amber-600/20',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Desserts',
    name: 'Desserts',
    description: 'Indulgent sweet treats, mug cakes, puddings, and crumbles.',
    icon: 'Cake',
    badge: 'Sweet Endings',
    popularDishes: ['Molten Lava Cake', 'Banana Pancakes', 'Fruit Crumble'],
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Fast Food',
    name: 'Fast Food',
    description: 'Quick bites, loaded fries, crispy tenders, and wraps.',
    icon: 'Zap',
    badge: 'Quick & Craveable',
    popularDishes: ['Crispy Chicken Wrap', 'Loaded Garlic Fries', 'Sliders'],
    bgGradient: 'from-orange-400/20 to-yellow-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Healthy Meals',
    name: 'Healthy Meals',
    description: 'Nutrient-rich bowls, grilled lean proteins, and vibrant steamed veggies.',
    icon: 'Heart',
    badge: 'Nutrient Dense',
    popularDishes: ['Quinoa Salad Bowl', 'Grilled Salmon', 'Steamed Veggie Bowl'],
    bgGradient: 'from-teal-500/20 to-emerald-600/20',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  }
];

export const DIETARY_OPTIONS: DietOption[] = [
  { id: 'Vegetarian', name: 'Vegetarian', description: 'No meat or poultry', icon: 'Leaf', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'Vegan', name: 'Vegan', description: '100% plant-based (no dairy/eggs)', icon: 'Sprout', badgeColor: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'High Protein', name: 'High Protein', description: 'Maximized lean protein ratio', icon: 'Dumbbell', badgeColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'Low Carb', name: 'Low Carb', description: 'Reduced carbohydrates', icon: 'Scale', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'Keto', name: 'Keto', description: 'Ultra low carb & high healthy fats', icon: 'Zap', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'Gluten-Free', name: 'Gluten-Free', description: 'Free from wheat & gluten', icon: 'CheckCircle2', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'Healthy', name: 'Healthy', description: 'Clean macros & wholesome ingredients', icon: 'Heart', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'Halal', name: 'Halal', description: '100% Halal certified ingredients', icon: 'ShieldCheck', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
];

export const HEALTH_GOALS = [
  'Balanced',
  'Weight Loss',
  'High Protein',
  'Muscle Gain',
  'Low Sugar',
  'Heart Healthy',
  'Family Friendly'
];

export const HELPFUL_TIPS = [
  'Use fresh ingredients for better flavor and richer aromatic notes.',
  'You can paste multiple ingredients separated by commas directly into the search bar.',
  'Select a cuisine for more accurate and authentic flavor profile matching.',
  'Adjust serving size to scale ingredient quantities for meal prep or family dining.',
  'Specify dietary preferences to automatically filter out allergens and restricted items.'
];

export const SAMPLE_INSPIRATION_RECIPES: Recipe[] = [
  {
    id: 'insp-1',
    title: 'Aromatic Creamy Butter Garlic Chicken',
    description: 'Tender chicken bites infused with browned butter, golden garlic, fresh oregano, and a touch of cream.',
    cuisine: 'Pakistani',
    difficulty: 'Easy',
    servingSize: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    ingredients: ['Chicken', 'Butter', 'Garlic', 'Heavy Cream', 'Black Pepper', 'Olive Oil'],
    missingIngredients: ['Heavy Cream', 'Black Pepper'],
    missingIngredientsMessage: 'You only need heavy cream and black pepper to complete this gourmet meal!',
    nutrition: {
      calories: 480,
      protein: '38g',
      carbohydrates: '6g',
      fat: '34g',
      fiber: '1g',
      sugar: '2g'
    },
    instructions: [
      { stepNumber: 1, instruction: 'Dice chicken breast into 1-inch uniform cubes and season with salt and pepper.', estimatedMinutes: 5, tip: 'Keep cubes uniform for even searing.' },
      { stepNumber: 2, instruction: 'Melt half the butter with olive oil in a skillet over medium-high heat. Sear chicken until golden brown.', estimatedMinutes: 8, tip: 'Avoid overcrowding the pan to get a deep golden sear.' },
      { stepNumber: 3, instruction: 'Add minced garlic and remaining butter, stirring until fragrant for 1 minute.', estimatedMinutes: 2 },
      { stepNumber: 4, instruction: 'Pour in heavy cream, simmer gently until sauce thickens and coats the back of a spoon.', estimatedMinutes: 5, tip: 'Garnish with freshly chopped parsley or cilantro before serving.' }
    ],
    cookingTips: [
      'Sear chicken at high heat to lock in natural juices before adding liquid.',
      'Squeeze fresh lemon juice at the end to cut through the richness of butter.'
    ],
    healthierAlternatives: [
      'Replace heavy cream with Greek yogurt mixed with 1 tsp olive oil for higher protein and lower fat.'
    ],
    dietaryTags: ['High Protein', 'Low Carb', 'Healthy Option'],
    createdAt: new Date().toISOString(),
    isFavorite: true,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'insp-2',
    title: 'Zesty Tuscan Tomato & Cheese Penne',
    description: 'Vibrant vine-ripened tomatoes simmered with garlic, fragrant basil, and melted mozzarella over al dente pasta.',
    cuisine: 'Italian',
    difficulty: 'Easy',
    servingSize: 3,
    prepTimeMinutes: 8,
    cookTimeMinutes: 15,
    totalTimeMinutes: 23,
    ingredients: ['Pasta', 'Tomatoes', 'Cheese', 'Garlic', 'Olive Oil', 'Basil'],
    missingIngredients: ['Basil'],
    missingIngredientsMessage: 'Add fresh basil for an authentic Italian herbal aroma!',
    nutrition: {
      calories: 390,
      protein: '16g',
      carbohydrates: '58g',
      fat: '12g',
      fiber: '4g',
      sugar: '5g'
    },
    instructions: [
      { stepNumber: 1, instruction: 'Boil penne pasta in well-salted water until al dente (about 9 minutes). Reserve 1/2 cup pasta water.', estimatedMinutes: 9 },
      { stepNumber: 2, instruction: 'Sauté minced garlic and crushed tomatoes in olive oil until soft and glossy.', estimatedMinutes: 6 },
      { stepNumber: 3, instruction: 'Toss cooked pasta with tomato sauce, pouring in reserved pasta water to emulsify.', estimatedMinutes: 3 },
      { stepNumber: 4, instruction: 'Fold in shredded mozzarella cheese and top with fresh basil until melted and stringy.', estimatedMinutes: 5 }
    ],
    cookingTips: [
      'Always reserve pasta cooking water—the starch creates a silky sauce texture.',
      'Grate your mozzarella cheese fresh for maximum meltability.'
    ],
    healthierAlternatives: [
      'Use chickpea or whole wheat penne pasta to boost dietary fiber and protein.'
    ],
    dietaryTags: ['Vegetarian', 'Healthy Option'],
    createdAt: new Date().toISOString(),
    isFavorite: false,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281288?auto=format&fit=crop&w=800&q=80'
  }
];

export const AI_LOADING_MESSAGES = [
  'Inspecting your ingredient inventory...',
  'Pairing flavor profiles with selected cuisine...',
  'Balancing spices and culinary proportions...',
  'Calculating precise nutritional metrics...',
  'Formatting beginner-friendly step-by-step instructions...',
  'Finalizing your chef-curated recipe card...'
];

export const CHEF_TIPS = [
  '💡 Always preheat your pan before adding oil to prevent food from sticking.',
  '💡 Salt pasta water until it tastes like seawater for flavorful noodles from inside out.',
  '💡 Let cooked meats rest for 5 minutes before slicing to retain maximum juiciness.',
  '💡 Squeeze fresh citrus right before serving to brighten up heavy or rich dishes.',
  '💡 Bloom dry spices in warm oil for 30 seconds to unleash their hidden aromatic oils.'
];
