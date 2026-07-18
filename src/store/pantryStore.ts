import { create } from 'zustand';
import { PantryItem } from '@/lib/types/grocery-ecosystem';
import { DEFAULT_PANTRY } from '@/lib/mock-data/grocery';

// Add isChecked to PantryItem dynamically or use a Set for checked items
interface PantryState {
  items: PantryItem[];
  checkedItemIds: Set<string>;
  toggleItem: (id: string) => void;
  hasItemByName: (name: string) => boolean;
}

export const usePantryStore = create<PantryState>((set, get) => ({
  items: DEFAULT_PANTRY,
  checkedItemIds: new Set(DEFAULT_PANTRY.map(i => i.id)), // initially all checked
  toggleItem: (id) => set((state) => {
    const newSet = new Set(state.checkedItemIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    return { checkedItemIds: newSet };
  }),
  hasItemByName: (name) => {
    const item = get().items.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!item) return false;
    return get().checkedItemIds.has(item.id);
  }
}));
