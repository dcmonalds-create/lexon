import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const MEMO_PROGRAM = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

// Helius free-tier is the reliable default — same as the frontend
const RPC_URL =
  process.env.SOLANA_RPC_URL ||
  'https://mainnet.helius-rpc.com/?api-key=4ff61bc5-0f95-4446-9bdd-837cdb56bae4';

const POLL_INTERVAL_MS = 2_000;  // 2 s between attempts
const MAX_ATTEMPTS     = 12;     // up to 24 s total wait

/**
 * Poll until the transaction is confirmed and indexed (or timeout).
 * getParsedTransaction returns null if the tx isn't indexed yet — we
 * retry rather than failing immediately.
 */
async function waitForParsedTransaction(
  connection: Connection,
  signature: string
): Promise<import('@solana/web3.js').ParsedTransactionWithMeta | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });

    if (tx !== null) return tx;                          // found — stop polling
    if (attempt < MAX_ATTEMPTS) {
      console.log(`[solanaVerify] tx not indexed yet — attempt ${attempt}/${MAX_ATTEMPTS}`);
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
  }
  return null; // timed out
}

/**
 * Verify a Solana USDC payment.
 *
 * Checks:
 *  1. Transaction exists (polls up to 24 s) and has no error
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
    console.error('[solanaVerify] LEXON_SOLANA_WALLET env var not set');
    return false;
  }

  const connection = new Connection(RPC_URL, 'confirmed');

  try {
    // Wait until the transaction is confirmed and indexed
    const tx = await waitForParsedTransaction(connection, txSignature);

    if (!tx) {
      console.error('[solanaVerify] Transaction not found after max wait:', txSignature);
      return false;
    }

    if (tx.meta?.err) {
      console.error('[solanaVerify] Transaction has error:', tx.meta.err);
      return false;
    }

    // 1. Recency check (30-minute window)
    const now = Math.floor(Date.now() / 1000);
    if (tx.blockTime && now - tx.blockTime > 1800) {
      console.error('[solanaVerify] Transaction too old:', tx.blockTime);
      return false;
    }

    // 2. Memo must match session token exactly
    const instructions = tx.transaction.message.instructions as any[];
    const memoIx = instructions.find(
      (ix) => ix.programId?.toString() === MEMO_PROGRAM
    );

    if (!memoIx) {
      console.error('[solanaVerify] No Memo instruction found');
      return false;
    }

    // getParsedTransaction returns parsed: string for Memo instructions
    if (memoIx.parsed !== expectedSessionToken) {
      console.error(
        '[solanaVerify] Memo mismatch. Expected:',
        expectedSessionToken,
        'Got:',
        memoIx.parsed
      );
      return false;
    }

    // 3. Lexon's USDC ATA must have received ≥ 1 USDC
    const lexonPk    = new PublicKey(lexonWallet);
    const mintPk     = new PublicKey(USDC_MINT);
    const lexonAta   = await getAssociatedTokenAddress(mintPk, lexonPk);
    const lexonAtaStr = lexonAta.toString();

    const preBalances  = tx.meta?.preTokenBalances  ?? [];
    const postBalances = tx.meta?.postTokenBalances ?? [];
    const accountKeys  = tx.transaction.message.accountKeys as any[];

    for (const post of postBalances) {
      if (post.mint !== USDC_MINT) continue;

      const acctKey = accountKeys[post.accountIndex]?.pubkey?.toString();
      if (acctKey !== lexonAtaStr) continue;

      const pre      = preBalances.find((p) => p.accountIndex === post.accountIndex);
      const preAmt   = BigInt(pre?.uiTokenAmount?.amount ?? '0');
      const postAmt  = BigInt(post.uiTokenAmount?.amount ?? '0');
      const received = postAmt - preAmt;

      console.log(`[solanaVerify] LexOn ATA received ${received} micro-USDC`);

      if (received >= 1_000_000n) return true;
    }

    console.error('[solanaVerify] LexOn ATA did not receive ≥ 1 USDC');
    return false;
  } catch (err) {
    console.error('[solanaVerify] Verification error:', err);
    return false;
  }
}
