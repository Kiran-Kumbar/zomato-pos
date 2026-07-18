import { GROCERY_PRODUCTS, GROCERY_CATEGORIES } from '../mock-data/grocery';
import { GroceryProduct, GroceryCategory } from '../types/grocery-ecosystem';

export const getAllProducts = async (): Promise<GroceryProduct[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(GROCERY_PRODUCTS);
    }, 100);
  });
};

export const getProductsByCategory = async (categoryId: string): Promise<GroceryProduct[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(GROCERY_PRODUCTS.filter(p => p.categoryId === categoryId));
    }, 100);
  });
};

export const getExpiringSoon = async (daysThreshold: number = 7): Promise<GroceryProduct[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
      
      const expiringProducts = GROCERY_PRODUCTS.filter(p => {
        if (!p.expiryDate) return false;
        const expiry = new Date(p.expiryDate);
        return expiry > now && expiry <= thresholdDate;
      });
      resolve(expiringProducts);
    }, 100);
  });
};

export const getAllCategories = async (): Promise<GroceryCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(GROCERY_CATEGORIES);
    }, 100);
  });
};
