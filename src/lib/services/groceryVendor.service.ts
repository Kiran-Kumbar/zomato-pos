import { GROCERY_VENDORS } from '../mock-data/grocery';
import { GroceryVendor } from '../types/grocery-ecosystem';

export const getAllVendors = async (): Promise<GroceryVendor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(GROCERY_VENDORS);
    }, 100);
  });
};

export const getVendorById = async (id: string): Promise<GroceryVendor | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(GROCERY_VENDORS.find(v => v.id === id));
    }, 100);
  });
};

export const getVendorsByFreshness = async (): Promise<GroceryVendor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...GROCERY_VENDORS].sort((a, b) => b.freshnessScore - a.freshnessScore));
    }, 100);
  });
};
