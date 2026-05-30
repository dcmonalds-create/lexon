import { useState } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { unlock } from '../lib/api';
import { useUserStore } from '../store/userStore';
import { JETTON_GAS_AMOUNT, getJettonWalletAddress, buildJettonTransferPayload } from '../lib/tonUtils';

const LEXON_WALLET = import.meta.env.VITE_LEXON_WALLET_ADDRESS || '';

export function usePayment() {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const telegramId = useUserStore((s) => s.telegramId);

  const pay = async (sessionToken: string): Promise<string | null> => {
    setPaying(true);
    setError(null);

    try {
      // 1. Resolve user's USDT Jetton wallet address
      if (!userAddress) throw new Error('Wallet not connected.');
      const jettonWallet = await getJettonWalletAddress(userAddress);

      // 2. Build Jetton transfer body with session token embedded as comment
      const payload = await buildJettonTransferPayload(LEXON_WALLET, sessionToken);

      // 3. Send to user's Jetton wallet (it internally forwards to Lexon's Jetton wallet)
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: jettonWallet,
            amount: JETTON_GAS_AMOUNT, // TON gas covering Jetton transfer + notification
            payload,
          },
        ],
      });

      // 4. Pass BOC to backend — backend correlates via session token comment
      const unlockRes = await unlock({
        sessionToken,
        txHash: result.boc,
        telegramId,
      });

      return unlockRes.full;
    } catch (err: any) {
      if (err?.message?.includes('User rejected') || err?.message?.includes('Reject')) {
        setError('Payment cancelled.');
      } else if (err?.message?.includes('No USDT') || err?.message?.includes('USDT')) {
        setError(err.message);
      } else {
        setError(err.response?.data?.error || err.message || 'Payment failed. Please try again.');
      }
      return null;
    } finally {
      setPaying(false);
    }
  };

  return { pay, paying, error };
}
