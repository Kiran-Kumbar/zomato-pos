import { create } from 'zustand';
import { GroceryProduct } from '@/lib/types/grocery-ecosystem';

export interface IngredientSelection {
  ingredientName: string;
  selectedProduct: GroceryProduct;
  quantity: number;
}

interface IngredientState {
  selections: Record<string, IngredientSelection>;
  setSelection: (ingredientName: string, product: GroceryProduct, quantity: number) => void;
  updateQuantity: (ingredientName: string, delta: number) => void;
  removeSelection: (ingredientName: string) => void;
  clearSelections: () => void;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  selections: {},
  setSelection: (ingredientName, product, quantity) => set((state) => ({
    selections: {
      ...state.selections,
      [ingredientName]: { ingredientName, selectedProduct: product, quantity }
    }
  })),
  updateQuantity: (ingredientName, delta) => set((state) => {
    const existing = state.selections[ingredientName];
    if (!existing) return state;
    
    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      const newSelections = { ...state.selections };
      delete newSelections[ingredientName];
      return { selections: newSelections };
    }
    
    return {
      selections: {
        ...state.selections,
        [ingredientName]: { ...existing, quantity: newQty }
      }
    };
  }),
  removeSelection: (ingredientName) => set((state) => {
    const newSelections = { ...state.selections };
    delete newSelections[ingredientName];
    return { selections: newSelections };
  }),
  clearSelections: () => set({ selections: {} })
}));
