import { create } from 'zustand';

interface BudgetState {
  spentThisMonth: number;
  monthlyLimit: number;
  setSpentThisMonth: (amount: number) => void;
  setMonthlyLimit: (amount: number) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  spentThisMonth: 14500, // Mock initial state
  monthlyLimit: 20000,   // Mock initial limit
  setSpentThisMonth: (amount) => set({ spentThisMonth: amount }),
  setMonthlyLimit: (amount) => set({ monthlyLimit: amount })
}));
