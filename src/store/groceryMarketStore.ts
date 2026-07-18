import { create } from 'zustand';

interface MarketState {
  searchQuery: string;
  selectedCategory: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
}

export const useGroceryMarketStore = create<MarketState>((set) => ({
  searchQuery: '',
  selectedCategory: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId })
}));
