import { create } from 'zustand';

interface AIKitchenChatState {
  messages: any[];
  addMessage: (message: any) => void;
  clearMessages: () => void;
}

export const useAIKitchenChatStore = create<AIKitchenChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] })
}));
