import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const MEMO_PROGRAM = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

/**
 * Verify a Solana USDC payment.
 *
 * Checks:
 *  1. Transaction exists and has no error
 *  2. Block time is within 30 minutes
 *  3. A Memo instruction contains the expected session token
 *  4. Lexon's USDC ATA received ≥ 1 USDC (1_000_000 micro-USDC)
 */
export async function verifySolanaUsdcPayment(
  txSignature: string,
  expectedSessionToken: string
): Promise<boolean> {
  const lexonWallet = process.env.LEXON_SOLANA_WALLET;
  if (!lexonWallet) {
    console.error('LEXON_SOLANA_WALLET env var not set');
    return false;
  }

  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  const connection = new Connection(rpcUrl, 'confirmed');

  try {
    const tx = await connection.getParsedTransaction(txSignature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });

    if (!tx || tx.meta?.err) return false;

    // 1. Recency check (30-minute window)
    const now = Math.floor(Date.now() / 1000);
    if (tx.blockTime && now - tx.blockTime > 1800) return false;

    // 2. Memo must match session token exactly
    const instructions = tx.transaction.message.instructions as any[];
    const memoOk = instructions.some((ix) => {
      return (
        ix.programId?.toString() === MEMO_PROGRAM &&
        ix.parsed === expectedSessionToken
      );
    });
    if (!memoOk) return false;

    // 3. Lexon's USDC ATA must have received ≥ 1 USDC
    const lexonPk = new PublicKey(lexonWallet);
    const mintPk = new PublicKey(USDC_MINT);
    const lexonUsdcAta = await getAssociatedTokenAddress(mintPk, lexonPk);
    const lexonAtaStr = lexonUsdcAta.toString();

    const preBalances = tx.meta?.preTokenBalances ?? [];
    const postBalances = tx.meta?.postTokenBalances ?? [];
    const accountKeys = tx.transaction.message.accountKeys as any[];

    for (const post of postBalances) {
      if (post.mint !== USDC_MINT) continue;

      const acctKey = accountKeys[post.accountIndex]?.pubkey?.toString();
      if (acctKey !== lexonAtaStr) continue;

      const pre = preBalances.find((p) => p.accountIndex === post.accountIndex);
      const preAmt = BigInt(pre?.uiTokenAmount?.amount ?? '0');
      const postAmt = BigInt(post.uiTokenAmount?.amount ?? '0');
      const received = postAmt - preAmt;

      if (received >= 1_000_000n) return true;
    }

    return false;
  } catch (err) {
    console.error('Solana payment verification error:', err);
    return false;
  }
}
