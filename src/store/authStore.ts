import { create } from 'zustand';

export type UserRole = 'customer' | 'restaurant' | 'delivery' | 'admin' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  phone: string | null;
  login: (phone: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  phone: null,
  login: (phone, role) => set({ isAuthenticated: true, phone, role }),
  logout: () => set({ isAuthenticated: false, role: null, phone: null }),
}));
