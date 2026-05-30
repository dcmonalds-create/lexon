import { create } from 'zustand';

interface PhantomState {
  connected: boolean;
  publicKey: string;
  setConnected: (connected: boolean, publicKey: string) => void;
}

export const usePhantomStore = create<PhantomState>((set) => ({
  connected: false,
  publicKey: '',
  setConnected: (connected, publicKey) => set({ connected, publicKey }),
}));
