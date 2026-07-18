import { create } from 'zustand';
import { AIRecipe } from '@/lib/types/grocery-ecosystem';

interface RecipeState {
  currentRecipe: AIRecipe | null;
  setCurrentRecipe: (recipe: AIRecipe | null) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  currentRecipe: null,
  setCurrentRecipe: (recipe) => set({ currentRecipe: recipe })
}));
