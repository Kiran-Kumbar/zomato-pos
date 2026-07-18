import { create } from 'zustand';
import { MenuItem } from '@/lib/types/menuItem';
import { calculateItemTotal } from '@/lib/utils/pricing';

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  variantId?: string;
  addonIds?: string[];
  totalPrice: number;
}

interface CartState {
  restaurantId: string | null;
  items: CartItem[];
  itemCount: number;
  cartTotal: number;
  appliedCoupon: string | null;
  discountAmount: number;
  isEcoDelivery: boolean;

  addItem: (item: MenuItem, quantity: number, variantId?: string, addonIds?: string[]) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  setCoupon: (code: string | null, discountAmount: number) => void;
  setEcoDelivery: (isEco: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  items: [],
  itemCount: 0,
  cartTotal: 0,
  appliedCoupon: null,
  discountAmount: 0,
  isEcoDelivery: false,

  addItem: (item, quantity, variantId, addonIds = []) => {
    const state = get();
    // If adding from a different restaurant, clear cart
    let currentItems = state.restaurantId === item.restaurantId ? [...state.items] : [];
    
    const existingIndex = currentItems.findIndex(i => 
      i.menuItem.id === item.id && 
      i.variantId === variantId && 
      JSON.stringify(i.addonIds?.sort()) === JSON.stringify(addonIds.sort())
    );

    const priceToAdd = calculateItemTotal(item, quantity, variantId, addonIds);

    if (existingIndex >= 0) {
      currentItems[existingIndex].quantity += quantity;
      currentItems[existingIndex].totalPrice += priceToAdd;
    } else {
      currentItems.push({
        cartItemId: Math.random().toString(36).substring(7),
        menuItem: item,
        quantity,
        variantId,
        addonIds,
        totalPrice: priceToAdd
      });
    }

    const itemCount = currentItems.reduce((acc, i) => acc + i.quantity, 0);
    const cartTotal = currentItems.reduce((acc, i) => acc + i.totalPrice, 0);

    set({ items: currentItems, restaurantId: item.restaurantId, itemCount, cartTotal });
  },

  updateQuantity: (cartItemId, delta) => {
    const state = get();
    let currentItems = [...state.items];
    const index = currentItems.findIndex(i => i.cartItemId === cartItemId);
    if (index === -1) return;

    const unitPrice = currentItems[index].totalPrice / currentItems[index].quantity;
    currentItems[index].quantity += delta;
    currentItems[index].totalPrice = currentItems[index].quantity * unitPrice;

    if (currentItems[index].quantity <= 0) {
      currentItems.splice(index, 1);
    }

    const itemCount = currentItems.reduce((acc, i) => acc + i.quantity, 0);
    const cartTotal = currentItems.reduce((acc, i) => acc + i.totalPrice, 0);
    
    if (currentItems.length === 0) {
      set({ items: [], restaurantId: null, itemCount: 0, cartTotal: 0, appliedCoupon: null, discountAmount: 0 });
    } else {
      set({ items: currentItems, itemCount, cartTotal });
    }
  },

  setCoupon: (code, discountAmount) => set({ appliedCoupon: code, discountAmount }),
  setEcoDelivery: (isEco) => set({ isEcoDelivery: isEco }),

  clearCart: () => set({ items: [], restaurantId: null, itemCount: 0, cartTotal: 0, appliedCoupon: null, discountAmount: 0, isEcoDelivery: false })
}));
