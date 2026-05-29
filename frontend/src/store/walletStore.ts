import { create } from 'zustand';

interface WalletState {
  connected: boolean;
  address: string;
  setWallet: (connected: boolean, address: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  connected: false,
  address: '',
  setWallet: (connected, address) => set({ connected, address }),
  disconnect: () => set({ connected: false, address: '' }),
}));
