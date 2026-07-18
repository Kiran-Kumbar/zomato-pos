export interface GroceryVendor {
  id: string;
  name: string;
  freshnessScore: number;
  rating: number;
  distanceKm: number;
  etaMins: number;
  bannerUrl: string;
  categories: string[];
}

export interface GroceryCategory {
  id: string;
  name: string;
  imageUrl: string;
}

export interface GroceryProduct {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  brand: string;
  price: number;
  weight: string;
  imageUrl: string;
  expiryDate?: string;
}

export interface AIRecipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  imageUrl?: string;
  ingredients: {
    name: string;
    quantity: string;
    productIdMapping?: string[]; // IDs of products that match this ingredient
  }[];
  instructions: string[];
}

export interface RecipeKit {
  id: string;
  name: string;
  occasion: string;
  productIds: string[];
  totalPrice: number;
  discountPercentage: number;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  lastRestocked: string;
}
