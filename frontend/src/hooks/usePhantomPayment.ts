import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { usePhantomStore } from '../store/phantomStore';
import api from '../lib/api';

const LEXON_SOLANA_WALLET = import.meta.env.VITE_SOLANA_WALLET || '';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

export function usePhantomPayment() {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useUserStore((s) => s.telegramId);
  const storedPublicKey = usePhantomStore((s) => s.publicKey);

  const pay = async (sessionToken: string): Promise<string | null> => {
    setPaying(true);
    setError(null);

    try {
      // Dynamic imports — Solana libs only load when actually needed
      const { Connection, PublicKey, Transaction, TransactionInstruction } =
        await import('@solana/web3.js');
      const { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } =
        await import('@solana/spl-token');

      const phantom = (window as any).phantom?.solana;
      if (!phantom?.isPhantom) {
        throw new Error('Phantom wallet not found. Please install Phantom.');
      }

      // Use the already-connected public key from the store — no popup needed
      if (!storedPublicKey) throw new Error('Wallet not connected.');
      const userPublicKey = new PublicKey(storedPublicKey);

      const connection = new Connection(
        import.meta.env.VITE_SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
        'confirmed'
      );

      const mint = new PublicKey(USDC_MINT);
      const lexonWallet = new PublicKey(LEXON_SOLANA_WALLET);

      // Derive associated token accounts
      const userUsdcAta = await getAssociatedTokenAddress(mint, userPublicKey);
      const lexonUsdcAta = await getAssociatedTokenAddress(mint, lexonWallet);

      const tx = new Transaction();

      // Transfer exactly 1 USDC (6 decimal places)
      tx.add(
        createTransferInstruction(
          userUsdcAta,
          lexonUsdcAta,
          userPublicKey,
          1_000_000,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Embed session token as Memo so the backend can correlate the payment
      tx.add(
        new TransactionInstruction({
          keys: [],
          programId: new PublicKey(MEMO_PROGRAM_ID),
          data: Buffer.from(sessionToken, 'utf8'),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = userPublicKey;

      // Phantom signs and broadcasts — shows a clean confirmation popup
      const { signature } = await phantom.signAndSendTransaction(tx);

      // Backend verifies on-chain, then returns the full unlocked result
      const res = await api.post<{ full: string }>('/solana-unlock', {
        sessionToken,
        txSignature: signature,
        userId,
      });

      return res.data.full;
    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.toLowerCase().includes('reject')) {
        setError('Payment cancelled.');
      } else if (err?.message?.includes('Wallet not connected')) {
        setError('Please connect your Phantom wallet first.');
      } else if (err?.message?.includes('insufficient') || err?.message?.includes('0x1')) {
        setError('Insufficient USDC balance. You need at least 1 USDC + a small amount of SOL for fees.');
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
