import { create } from 'zustand';

interface HouseholdCartState {
  members: string[];
  sharedCartItems: any[];
  addSharedItem: (item: any) => void;
}

export const useHouseholdCartStore = create<HouseholdCartState>((set) => ({
  members: [],
  sharedCartItems: [],
  addSharedItem: (item) => set((state) => ({ sharedCartItems: [...state.sharedCartItems, item] }))
}));
