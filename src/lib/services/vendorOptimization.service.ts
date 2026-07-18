import { GROCERY_PRODUCTS, GROCERY_VENDORS } from '../mock-data/grocery';
import { GroceryProduct, GroceryVendor } from '../types/grocery-ecosystem';

export interface VendorOptimizationOption {
  type: 'fastest' | 'cheapest' | 'premium' | 'multi-vendor';
  totalPrice: number;
  etaMins: number;
  vendorsUsed: GroceryVendor[];
  matchedProducts: GroceryProduct[];
  missingItems: string[]; // Names of ingredients that couldn't be fulfilled
}

export interface SubstitutionSuggestion {
  originalIngredient: string;
  suggestedProduct: GroceryProduct;
  reason: string;
}

export const computeVendorOptimizations = async (
  ingredientNames: string[]
): Promise<VendorOptimizationOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock logic: simply generate the 4 options based on mock data
      const options: VendorOptimizationOption[] = [
        {
          type: 'fastest',
          totalPrice: 450,
          etaMins: 12,
          vendorsUsed: [GROCERY_VENDORS[0]], // e.g. Reliance Fresh
          matchedProducts: GROCERY_PRODUCTS.slice(0, ingredientNames.length),
          missingItems: []
        },
        {
          type: 'cheapest',
          totalPrice: 410,
          etaMins: 25,
          vendorsUsed: [GROCERY_VENDORS[1], GROCERY_VENDORS[2]], // Multiple vendors
          matchedProducts: GROCERY_PRODUCTS.slice(10, 10 + ingredientNames.length),
          missingItems: []
        },
        {
          type: 'premium',
          totalPrice: 580,
          etaMins: 35,
          vendorsUsed: [GROCERY_VENDORS[4]], // Organic Basket
          matchedProducts: GROCERY_PRODUCTS.slice(20, 20 + ingredientNames.length),
          missingItems: []
        },
        {
          type: 'multi-vendor',
          totalPrice: 430,
          etaMins: 30,
          vendorsUsed: [GROCERY_VENDORS[0], GROCERY_VENDORS[1], GROCERY_VENDORS[3]],
          matchedProducts: GROCERY_PRODUCTS.slice(30, 30 + ingredientNames.length),
          missingItems: []
        }
      ];
      resolve(options);
    }, 400);
  });
};

export const suggestSubstitutions = async (
  outOfStockIngredient: string
): Promise<SubstitutionSuggestion | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock substitution logic
      if (outOfStockIngredient.toLowerCase().includes('cream')) {
        resolve({
          originalIngredient: outOfStockIngredient,
          suggestedProduct: GROCERY_PRODUCTS[2], // Assuming this is milk or similar
          reason: 'Full Cream Milk is the closest replacement for this recipe.'
        });
      } else {
        // Generic fallback substitution
        resolve({
          originalIngredient: outOfStockIngredient,
          suggestedProduct: GROCERY_PRODUCTS[0],
          reason: 'This is the most popular alternative chosen by other chefs.'
        });
      }
    }, 200);
  });
};
