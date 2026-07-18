import { create } from 'zustand';
import { GroceryProduct } from '@/lib/types/grocery-ecosystem';

export interface CartItem {
  cartItemId: string;
  product: GroceryProduct;
  quantity: number;
  addedBy?: string;
  paymentStatus?: 'pending' | 'paid';
}

interface GroceryCartState {
  cartItems: CartItem[];
  addToCart: (product: GroceryProduct, addedBy?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  getItemQuantity: (productId: string) => number;
  markPaid: (cartItemId: string) => void;
}

export const useGroceryCartStore = create<GroceryCartState>((set, get) => ({
  cartItems: [],
  addToCart: (product, addedBy) => set((state) => {
    const existing = state.cartItems.find(item => item.product.id === product.id && item.addedBy === addedBy);
    if (existing) {
      return {
        cartItems: state.cartItems.map(item => 
          (item.product.id === product.id && item.addedBy === addedBy) ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return {
      cartItems: [...state.cartItems, { cartItemId: Math.random().toString(), product, quantity: 1, addedBy, paymentStatus: 'pending' }]
    };
  }),
  markPaid: (cartItemId) => set((state) => ({
    cartItems: state.cartItems.map(item => 
      item.cartItemId === cartItemId ? { ...item, paymentStatus: 'paid' } : item
    )
  })),
  removeFromCart: (productId) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.product.id !== productId)
  })),
  updateQuantity: (productId, delta) => set((state) => {
    return {
      cartItems: state.cartItems.map(item => {
        if (item.product.id === productId) {
          const newQ = item.quantity + delta;
          return { ...item, quantity: newQ };
        }
        return item;
      }).filter(item => item.quantity > 0)
    };
  }),
  getItemQuantity: (productId) => {
    const item = get().cartItems.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }
}));
