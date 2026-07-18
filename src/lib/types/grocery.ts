export type GroceryCategory = 
  | 'Vegetables' | 'Fruits' | 'Dairy' | 'Bakery' 
  | 'Snacks' | 'Frozen Food' | 'Beverages' 
  | 'Household' | 'Cleaning' | 'Personal Care' 
  | 'Baby Care' | 'Pet Care';

export interface GroceryVendor {
  id: string;
  name: string;
  rating: number;
  distance: string;
  estimatedTime: string;
  bannerImage: string;
  isPremium?: boolean;
}

export interface GroceryProduct {
  id: string;
  vendorId: string;
  name: string;
  category: GroceryCategory;
  price: number;
  originalPrice?: number;
  weight: string;
  image: string;
  inStock: boolean;
  description?: string;
}

export interface SmartPantryItem {
  id: string;
  name: string;
  isChecked: boolean;
}
