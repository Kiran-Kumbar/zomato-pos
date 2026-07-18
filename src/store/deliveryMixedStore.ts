import { create } from 'zustand';

interface DeliveryMixedState {
  activeMixedOrder: any | null;
  setActiveMixedOrder: (order: any) => void;
}

export const useDeliveryMixedStore = create<DeliveryMixedState>((set) => ({
  activeMixedOrder: null,
  setActiveMixedOrder: (order) => set({ activeMixedOrder: order })
}));
