import { create } from 'zustand';
import type { HistoryItem } from '../types';

interface HistoryState {
  items: HistoryItem[];
  loading: boolean;
  setItems: (items: HistoryItem[]) => void;
  addItem: (item: HistoryItem) => void;
  setLoading: (loading: boolean) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  items: [],
  loading: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  setLoading: (loading) => set({ loading }),
}));
