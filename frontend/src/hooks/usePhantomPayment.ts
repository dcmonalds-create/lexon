import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { usePhantomStore } from '../store/phantomStore';
import api from '../lib/api';

const LEXON_SOLANA_WALLET = import.meta.env.VITE_SOLANA_WALLET || '';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

// Helius free-tier is the reliable default; Railway VITE_SOLANA_RPC overrides it
// (VITE_ vars are baked at build time — this constant is the safe fallback)
const SOLANA_RPC_URL =
  import.meta.env.VITE_SOLANA_RPC ||
  'https://mainnet.helius-rpc.com/?api-key=4ff61bc5-0f95-4446-9bdd-837cdb56bae4';

async function getBlockhashWithRetry(connection: import('@solana/web3.js').Connection): Promise<string> {
  const MAX = 3;
  for (let attempt = 1; attempt <= MAX; attempt++) {
    try {
      const { blockhash } = await connection.getLatestBlockhash();
      return blockhash;
    } catch (err) {
      if (attempt === MAX) throw err;
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  throw new Error('Failed to fetch blockhash');
}

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

      if (!LEXON_SOLANA_WALLET) {
        throw new Error('Recipient wallet not configured. Contact support.');
      }

      const userPublicKey = new PublicKey(storedPublicKey);

      const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

      const mint = new PublicKey(USDC_MINT);
      const lexonWallet = new PublicKey(LEXON_SOLANA_WALLET);

      // Derive associated token accounts (local derivation — no RPC)
      const userUsdcAta = await getAssociatedTokenAddress(mint, userPublicKey);
      const lexonUsdcAta = await getAssociatedTokenAddress(mint, lexonWallet);

      const tx = new Transaction();

      // If the LexOn USDC token account doesn't exist yet, create it in the
      // same transaction so the transfer doesn't fail (user pays ~0.002 SOL rent)
      const {
        getAccount,
        createAssociatedTokenAccountInstruction,
        TokenAccountNotFoundError,
      } = await import('@solana/spl-token');

      try {
        await getAccount(connection, lexonUsdcAta);
      } catch (e) {
        if (e instanceof TokenAccountNotFoundError) {
          tx.add(
            createAssociatedTokenAccountInstruction(
              userPublicKey,   // payer
              lexonUsdcAta,    // ata to create
              lexonWallet,     // owner
              mint
            )
          );
        }
      }

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

      const blockhash = await getBlockhashWithRetry(connection);
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
      const msg: string = err?.message || '';
      const code: number = err?.code ?? 0;

      if (code === 4001 || msg.toLowerCase().includes('reject')) {
        setError('Payment cancelled.');
      } else if (msg.includes('Wallet not connected')) {
        setError('Please connect your Phantom wallet first.');
      } else if (msg.includes('insufficient') || msg.includes('0x1')) {
        setError('Insufficient USDC balance. You need at least 1 USDC + a small amount of SOL for network fees.');
      } else if (
        msg.includes('blockhash') ||
        msg.includes('403') ||
        msg.includes('Access forbidden') ||
        msg.includes('429') ||
        msg.includes('Too many')
      ) {
        // Public Solana RPC rate-limit — suggest retry
        setError('Solana network is busy. Please wait a few seconds and try again.');
      } else if (msg.includes('failed to send') || msg.includes('Transaction simulation')) {
        setError('Transaction failed on Solana. Make sure you have USDC and enough SOL for fees.');
      } else if (msg.includes('not configured')) {
        setError('Payment setup error. Please contact support.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        // Show the real error in the UI so it's easier to debug
        setError(`Payment failed: ${msg || 'unknown error'}. Please try again.`);
      }
      return null;
    } finally {
      setPaying(false);
    }
  };

  return { pay, paying, error };
}
