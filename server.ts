import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize GoogleGenAI SDK with server-side GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!apiKey && apiKey !== 'MY_GEMINI_API_KEY',
      timestamp: new Date().toISOString(),
    });
  });

  // Recipe Generation API Endpoint
  app.post('/api/generate-recipe', async (req, res) => {
    try {
      const {
        ingredients,
        cuisine,
        dietaryPreference,
        servingSize,
        difficulty,
        cookingTimePreference,
        healthyOption,
        healthGoal,
        language,
        systemInstruction: clientSystemInstruction,
        userPrompt: clientUserPrompt,
      } = req.body;

      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Please provide at least one ingredient.' });
      }

      const userIngredientsList = ingredients.join(', ');
      const selectedDiet = Array.isArray(dietaryPreference) && dietaryPreference.length > 0
        ? dietaryPreference.join(', ')
        : 'None specified';

      const systemInstruction = clientSystemInstruction || 'You are an elite culinary master, nutritionist, and food safety specialist for Flavor Fusion AI. Respond strictly in valid JSON matching the requested schema.';

      const prompt = clientUserPrompt || `
You are a World-Class Master Chef, Culinary Nutritionist, and Expert AI Recipe Assistant for "Flavor Fusion AI".
Create a realistic, delicious, safe, and beginner-friendly recipe based on the following constraints:

- USER INGREDIENTS AT HOME: ${userIngredientsList}
- DESIRED CUISINE: ${cuisine || 'Any/Fusion'}
- DIETARY PREFERENCES/RESTRICTIONS: ${selectedDiet}
- SERVING SIZE: ${servingSize || 2} ${servingSize === 1 ? 'Person' : 'People'}
- DIFFICULTY LEVEL: ${difficulty || 'Easy'}
- COOKING TIME PREFERENCE: ${cookingTimePreference || 'Any'}
- HEALTHY OPTION FOCUS: ${healthyOption ? 'Yes, maximize nutrient balance and health benefits' : 'Balanced'}
- HEALTH GOAL: ${healthGoal || 'Balanced'}
- LANGUAGE: ${language || 'English'}

STRICT RULES:
1. Primary emphasis: Use the provided user ingredients whenever possible.
2. MISSING INGREDIENTS RULE: If additional essential pantry items (like milk, butter, oil, seasonings, cheese) are needed to make a complete, delicious dish, suggest AT MOST 3 additional missing ingredients. Include a warm, encouraging message explaining how simple it is to complete the dish.
3. INSTRUCTION RULES: Provide step-by-step beginner-friendly cooking instructions. Each step must have a step number, estimated duration in minutes, clear action, and an optional chef pro-tip.
4. NUTRITION METRICS: Provide realistic nutrition estimates for 1 serving (Calories as a number, protein, carbs, fat, fiber, sugar as strings with units e.g., "32g").
5. HEALTHIER ALTERNATIVES: Suggest 1-2 healthier ingredient swaps or light preparation variations.
6. DIETARY COMPATIBILITY: Ensure the recipe strictly respects the user's selected dietary preferences (${selectedDiet}) and contains no conflicting ingredients.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Creative and appetizing recipe title' },
              description: { type: Type.STRING, description: 'Short 2-sentence enticing overview of the recipe' },
              cuisine: { type: Type.STRING, description: 'The cuisine classification of the dish' },
              difficulty: { type: Type.STRING, description: 'Easy, Medium, or Hard' },
              servingSize: { type: Type.INTEGER, description: 'Number of servings' },
              prepTimeMinutes: { type: Type.INTEGER, description: 'Preparation time in minutes' },
              cookTimeMinutes: { type: Type.INTEGER, description: 'Cooking time in minutes' },
              totalTimeMinutes: { type: Type.INTEGER, description: 'Total time in minutes' },
              ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Full list of required ingredients with quantities and measurements'
              },
              missingIngredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Maximum 3 additional common household ingredients needed'
              },
              missingIngredientsMessage: {
                type: Type.STRING,
                description: 'Encouraging message e.g. "You only need milk and butter to complete this recipe!"'
              },
              nutrition: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.INTEGER, description: 'Total calories per serving' },
                  protein: { type: Type.STRING, description: 'e.g., "28g"' },
                  carbohydrates: { type: Type.STRING, description: 'e.g., "45g"' },
                  fat: { type: Type.STRING, description: 'e.g., "14g"' },
                  fiber: { type: Type.STRING, description: 'e.g., "6g"' },
                  sugar: { type: Type.STRING, description: 'e.g., "4g"' }
                },
                required: ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar']
              },
              instructions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    instruction: { type: Type.STRING },
                    estimatedMinutes: { type: Type.INTEGER },
                    tip: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'instruction']
                }
              },
              cookingTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 Pro tips from the chef for perfect execution'
              },
              healthierAlternatives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '1-2 Healthy substitutions or lighter tweaks'
              },
              dietaryTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Applicable badges e.g. ["High Protein", "Gluten-Free"]'
              },
              warnings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Any food safety warnings or allergen notes'
              }
            },
            required: [
              'title',
              'description',
              'cuisine',
              'difficulty',
              'servingSize',
              'prepTimeMinutes',
              'cookTimeMinutes',
              'totalTimeMinutes',
              'ingredients',
              'missingIngredients',
              'nutrition',
              'instructions',
              'cookingTips',
              'healthierAlternatives',
              'dietaryTags'
            ]
          }
        }
      });

      const responseText = response.text || '';
      const recipeData = JSON.parse(responseText);

      // Attach generated metadata ID and timestamp
      const recipeWithMetadata = {
        ...recipeData,
        id: 'recipe_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: new Date().toISOString(),
        isFavorite: false,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(recipeData.title || 'delicious_food')}/800/600`
      };

      return res.json(recipeWithMetadata);
    } catch (err: any) {
      console.error('Error generating recipe with Gemini:', err);
      return res.status(500).json({
        error: err.message || 'Failed to generate recipe. Please try again.',
        details: err.toString()
      });
    }
  });

  // Serve Vite in dev mode, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Flavor Fusion AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
