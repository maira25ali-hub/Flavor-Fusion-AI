import { Recipe, RecipeRequest, AICommunicationState } from '../types';
import { buildStructuredPrompt, sanitizeRequest } from './promptBuilder';
import { validateRecipeData } from './responseValidator';
import { parseAndNormalizeRecipe, generateFallbackRecipe } from './recipeParser';
import { getCachedRecipe, setCachedRecipe } from './aiCacheService';

export interface AIServiceCallbacks {
  onStateChange?: (state: AICommunicationState, statusMessage?: string) => void;
  onProgressMessage?: (msg: string) => void;
}

class AIService {
  private activeController: AbortController | null = null;
  private currentState: AICommunicationState = 'idle';

  public getCurrentState(): AICommunicationState {
    return this.currentState;
  }

  /**
   * Cancel any ongoing recipe generation request.
   */
  public cancelCurrentGeneration(): void {
    if (this.activeController) {
      this.activeController.abort();
      this.activeController = null;
    }
    this.currentState = 'cancelled';
  }

  /**
   * Main entry point to generate an AI recipe with full pipeline, validation, caching, and retry mechanism.
   */
  public async generateRecipe(
    rawRequest: RecipeRequest,
    callbacks?: AIServiceCallbacks
  ): Promise<Recipe> {
    // 1. Cancel existing request if running
    if (this.activeController) {
      this.cancelCurrentGeneration();
    }

    const updateState = (state: AICommunicationState, msg?: string) => {
      this.currentState = state;
      callbacks?.onStateChange?.(state, msg);
      if (msg) callbacks?.onProgressMessage?.(msg);
    };

    // 2. Preparing state & sanitize input
    updateState('preparing', 'Sanitizing input and building chef prompt...');
    const request = sanitizeRequest(rawRequest);

    if (request.ingredients.length === 0) {
      updateState('error', 'Please enter at least one ingredient.');
      throw new Error('Please enter at least one ingredient.');
    }

    // 3. Check Cache
    const cachedRecipe = getCachedRecipe(request);
    if (cachedRecipe) {
      updateState('parsing', 'Found instant recipe in culinary cache...');
      await new Promise(res => setTimeout(res, 300)); // slight pleasant transition
      updateState('completed', 'Recipe loaded from cache!');
      return cachedRecipe;
    }

    // 4. Setup Abort Controller
    this.activeController = new AbortController();
    const signal = this.activeController.signal;

    // 5. Build prompt
    const { systemInstruction, userPrompt } = buildStructuredPrompt(request);

    // 6. Retry Loop (Max 3 attempts)
    const MAX_RETRIES = 3;
    let lastErrorMsg = '';

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (signal.aborted) {
        updateState('cancelled', 'Request was cancelled by user.');
        throw new Error('Generation cancelled by user.');
      }

      try {
        updateState('sending', attempt > 1 ? `Retrying request (Attempt ${attempt}/${MAX_RETRIES})...` : 'Connecting to AI Culinary Engine...');

        // 30 Second timeout per attempt
        const timeoutId = setTimeout(() => {
          if (this.activeController) {
            this.activeController.abort();
          }
        }, 30000);

        updateState('waiting', 'Consulting AI Master Chef & Nutritionist...');

        const response = await fetch('/api/generate-recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients: request.ingredients,
            cuisine: request.cuisine,
            dietaryPreference: request.dietaryPreference,
            servingSize: request.servingSize,
            difficulty: request.difficulty,
            cookingTimePreference: request.cookingTimePreference,
            healthyOption: request.healthyOption,
            healthGoal: request.healthGoal,
            language: request.language,
            systemInstruction,
            userPrompt,
          }),
          signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned status ${response.status}`);
        }

        updateState('receiving', 'Receiving raw recipe payload...');
        const rawJson = await response.json();

        updateState('parsing', 'Parsing recipe structure and nutrition metrics...');
        
        updateState('validating', 'Verifying dietary safety and step clarity...');
        const validation = validateRecipeData(rawJson);

        if (!validation.isValid) {
          lastErrorMsg = `Validation failed: ${validation.errors.join('; ')}`;
          console.warn(`[AIService] Attempt ${attempt} validation failed:`, validation.errors);
          if (attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, 1000)); // wait before retrying
            continue;
          } else {
            throw new Error(lastErrorMsg);
          }
        }

        // Parse and normalize into Recipe
        const finalRecipe = parseAndNormalizeRecipe(rawJson, request);

        // Store in cache
        setCachedRecipe(request, finalRecipe);

        updateState('completed', 'Recipe generated successfully!');
        this.activeController = null;
        return finalRecipe;

      } catch (err: any) {
        if (err.name === 'AbortError' || signal.aborted) {
          updateState('cancelled', 'Generation cancelled.');
          throw new Error('Generation cancelled.');
        }

        lastErrorMsg = err.message || 'Network or service error.';
        console.error(`[AIService] Attempt ${attempt} error:`, err);

        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 800));
        }
      }
    }

    // 7. If all retries fail, generate high quality fallback recipe gracefully
    console.warn('[AIService] All retries exhausted. Using culinary fallback engine:', lastErrorMsg);
    updateState('completed', 'Recipe constructed via backup culinary engine.');
    
    const fallbackRecipe = generateFallbackRecipe(request, lastErrorMsg);
    this.activeController = null;
    return fallbackRecipe;
  }
}

export const aiService = new AIService();
