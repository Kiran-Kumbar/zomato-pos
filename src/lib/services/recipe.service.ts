import { AI_RECIPES } from '../mock-data/grocery';
import { AIRecipe } from '../types/grocery-ecosystem';

export const generateRecipeFromPrompt = async (prompt: string): Promise<AIRecipe> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock AI parsing logic: pick a recipe based on simple keywords or fallback to a random one
      const lowerPrompt = prompt.toLowerCase();
      let matchedRecipe = AI_RECIPES.find(r => lowerPrompt.includes(r.name.toLowerCase()));
      
      if (!matchedRecipe) {
        // Fallback to random recipe to simulate AI generative behavior
        matchedRecipe = AI_RECIPES[Math.floor(Math.random() * AI_RECIPES.length)];
      }
      
      resolve(matchedRecipe);
    }, 600); // Simulated 600ms "AI thinking" delay
  });
};

export const getAllRecipes = async (): Promise<AIRecipe[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(AI_RECIPES);
    }, 100);
  });
};
