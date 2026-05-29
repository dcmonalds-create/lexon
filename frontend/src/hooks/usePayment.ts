import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { unlock } from '../lib/api';
import { useUserStore } from '../store/userStore';
import { TON_AMOUNT, encodeComment } from '../lib/tonUtils';

const LEXON_WALLET = import.meta.env.VITE_LEXON_WALLET_ADDRESS || '';

export function usePayment() {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tonConnectUI] = useTonConnectUI();
  const telegramId = useUserStore((s) => s.telegramId);

  const pay = async (sessionToken: string): Promise<string | null> => {
    setPaying(true);
    setError(null);

    try {
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: LEXON_WALLET,
            amount: TON_AMOUNT,
            payload: encodeComment(sessionToken),
          },
        ],
      });

      const txHash = result.boc;

      const unlockRes = await unlock({
        sessionToken,
        txHash,
        telegramId,
      });

      return unlockRes.full;
    } catch (err: any) {
      if (err?.message?.includes('User rejected')) {
        setError('Payment cancelled.');
      } else {
        setError(err.response?.data?.error || 'Payment failed. Please try again.');
      }
      return null;
    } finally {
      setPaying(false);
    }
  };

  return { pay, paying, error };
}
