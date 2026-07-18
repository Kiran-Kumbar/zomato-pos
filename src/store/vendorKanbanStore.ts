import { create } from 'zustand';

interface VendorKanbanState {
  columns: any[];
  moveItem: (itemId: string, targetColumn: string) => void;
}

export const useVendorKanbanStore = create<VendorKanbanState>((set) => ({
  columns: [],
  moveItem: (itemId, targetColumn) => set((state) => ({ ...state }))
}));
