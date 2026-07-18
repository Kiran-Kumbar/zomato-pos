import { create } from 'zustand';
import { GroceryProduct, SmartPantryItem } from '@/lib/types/grocery';

export interface GroceryCartItem {
  cartItemId: string;
  product: GroceryProduct;
  quantity: number;
  totalPrice: number;
}

interface GroceryState {
  cartItems: GroceryCartItem[];
  cartTotal: number;
  pantryItems: SmartPantryItem[];
  
  // Cart Actions
  addToCart: (product: GroceryProduct, quantity: number) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Pantry Actions
  togglePantryItem: (id: string) => void;
  setPantryItems: (items: SmartPantryItem[]) => void;
}

export const useGroceryStore = create<GroceryState>((set, get) => ({
  cartItems: [],
  cartTotal: 0,
  pantryItems: [],

  addToCart: (product, quantity) => {
    set((state) => {
      const existing = state.cartItems.findIndex(i => i.product.id === product.id);
      let newItems = [...state.cartItems];
      
      if (existing >= 0) {
        newItems[existing].quantity += quantity;
        newItems[existing].totalPrice = newItems[existing].quantity * product.price;
      } else {
        newItems.push({
          cartItemId: `gci_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          product,
          quantity,
          totalPrice: quantity * product.price
        });
      }

      return {
        cartItems: newItems,
        cartTotal: newItems.reduce((acc, i) => acc + i.totalPrice, 0)
      };
    });
  },

  updateQuantity: (cartItemId, delta) => {
    set((state) => {
      let newItems = [...state.cartItems];
      const index = newItems.findIndex(i => i.cartItemId === cartItemId);
      if (index === -1) return state;

      newItems[index].quantity += delta;
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].product.price;

      if (newItems[index].quantity <= 0) {
        newItems.splice(index, 1);
      }

      return {
        cartItems: newItems,
        cartTotal: newItems.reduce((acc, i) => acc + i.totalPrice, 0)
      };
    });
  },

  removeFromCart: (cartItemId) => {
    set((state) => {
      const newItems = state.cartItems.filter(i => i.cartItemId !== cartItemId);
      return {
        cartItems: newItems,
        cartTotal: newItems.reduce((acc, i) => acc + i.totalPrice, 0)
      };
    });
  },

  clearCart: () => set({ cartItems: [], cartTotal: 0 }),

  togglePantryItem: (id) => {
    set((state) => ({
      pantryItems: state.pantryItems.map(item => 
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    }));
  },

  setPantryItems: (items) => set({ pantryItems: items })
}));
