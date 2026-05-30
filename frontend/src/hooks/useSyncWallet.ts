import { useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useWalletStore } from '../store/walletStore';

/**
 * Keeps the Zustand walletStore in sync with the TonConnect UI state.
 * Mount once at the app root. Profile.tsx reads from walletStore.
 */
export function useSyncWallet() {
  const address = useTonAddress(); // returns '' when not connected
  const setWallet = useWalletStore((s) => s.setWallet);

  useEffect(() => {
    setWallet(!!address, address || '');
  }, [address, setWallet]);
}
