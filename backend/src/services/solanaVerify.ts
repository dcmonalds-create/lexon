import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const USDC_MINT    = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const MEMO_PROGRAM = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const MEMO_PROGRAM_V1 = 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo';

const RPC_URL =
  process.env.SOLANA_RPC_URL ||
  'https://mainnet.helius-rpc.com/?api-key=4ff61bc5-0f95-4446-9bdd-837cdb56bae4';

const POLL_INTERVAL_MS = 2_000;
const MAX_ATTEMPTS     = 12;   // 24 s total

/**
 * Extract the memo string from an instruction, handling both:
 *  - ParsedInstruction:          { parsed: "text" }
 *  - PartiallyDecodedInstruction:{ data: "base58string" }
 */
function extractMemoText(ix: any): string | null {
  // Solana RPC can return Memo as a parsed string directly
  if (typeof ix.parsed === 'string') return ix.parsed;

  // Fallback: raw base-58 encoded instruction data
  if (typeof ix.data === 'string') {
    try {
      // base58 → Buffer → utf-8
      const bs58 = require('bs58') as typeof import('bs58');
      const bytes = bs58.default
        ? bs58.default.decode(ix.data)
        : (bs58 as any).decode(ix.data);
      return Buffer.from(bytes).toString('utf8');
    } catch {
      return null;
    }
  }
  return null;
}

async function waitForParsedTransaction(
  connection: Connection,
  signature: string
): Promise<import('@solana/web3.js').ParsedTransactionWithMeta | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });
    if (tx !== null) return tx;
    console.log(`[solanaVerify] tx not indexed yet — attempt ${attempt}/${MAX_ATTEMPTS}`);
    if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  return null;
}

/** Returns { ok, reason } so the route can surface the exact failure. */
export async function verifySolanaUsdcPayment(
  txSignature: string,
  expectedSessionToken: string
): Promise<{ ok: boolean; reason: string }> {
  const lexonWallet = process.env.LEXON_SOLANA_WALLET;
  if (!lexonWallet) {
    console.error('[solanaVerify] LEXON_SOLANA_WALLET env var not set');
    return { ok: false, reason: 'Recipient wallet not configured on server.' };
  }

  const connection = new Connection(RPC_URL, 'confirmed');

  try {
    const tx = await waitForParsedTransaction(connection, txSignature);

    if (!tx) {
      return { ok: false, reason: 'Transaction not found after 24 s. Please try again.' };
    }

    if (tx.meta?.err) {
      console.error('[solanaVerify] Transaction has on-chain error:', tx.meta.err);
      return { ok: false, reason: 'Transaction failed on-chain.' };
    }

    // 1. Recency check (30 min)
    const now = Math.floor(Date.now() / 1000);
    if (tx.blockTime && now - tx.blockTime > 1800) {
      return { ok: false, reason: 'Transaction is too old (> 30 minutes).' };
    }

    // 2. Memo check — handle both Memo v1 and v2, both parsed and raw formats
    const instructions = tx.transaction.message.instructions as any[];
    const memoIx = instructions.find(
      (ix) =>
        ix.programId?.toString() === MEMO_PROGRAM ||
        ix.programId?.toString() === MEMO_PROGRAM_V1
    );

    if (!memoIx) {
      console.error('[solanaVerify] No Memo instruction found in tx');
      return { ok: false, reason: 'Memo instruction missing from transaction.' };
    }

    const memoText = extractMemoText(memoIx);
    console.log('[solanaVerify] memo found:', JSON.stringify(memoText));
    console.log('[solanaVerify] expected  :', JSON.stringify(expectedSessionToken));

    if (memoText !== expectedSessionToken) {
      return { ok: false, reason: `Session token mismatch. Got: ${memoText}` };
    }

    // 3. Balance check — Lexon USDC ATA must have received ≥ 1 USDC
    const lexonPk     = new PublicKey(lexonWallet);
    const mintPk      = new PublicKey(USDC_MINT);
    const lexonAta    = await getAssociatedTokenAddress(mintPk, lexonPk);
    const lexonAtaStr = lexonAta.toString();

    console.log('[solanaVerify] LEXON_SOLANA_WALLET =', lexonWallet);
    console.log('[solanaVerify] expected ATA        =', lexonAtaStr);

    const preBalances  = tx.meta?.preTokenBalances  ?? [];
    const postBalances = tx.meta?.postTokenBalances ?? [];
    const accountKeys  = tx.transaction.message.accountKeys as any[];

    // Collect all USDC accounts that received funds in this tx
    const usdcCredits: string[] = [];
    for (const post of postBalances) {
      if (post.mint !== USDC_MINT) continue;
      const acctKey = accountKeys[post.accountIndex]?.pubkey?.toString();
      const pre     = preBalances.find((p) => p.accountIndex === post.accountIndex);
      const preAmt  = BigInt(pre?.uiTokenAmount?.amount ?? '0');
      const postAmt = BigInt(post.uiTokenAmount?.amount ?? '0');
      const received = postAmt - preAmt;

      console.log(`[solanaVerify] USDC credit → ${acctKey}: +${received} micro-USDC`);

      if (received > 0n) usdcCredits.push(acctKey ?? 'unknown');

      if (acctKey === lexonAtaStr && received >= 1_000_000n) {
        console.log('[solanaVerify] ✅ Payment verified');
        return { ok: true, reason: 'ok' };
      }
    }

    const actualRecipients = usdcCredits.join(', ') || 'none';
    console.error('[solanaVerify] ATA mismatch — expected:', lexonAtaStr, '| got:', actualRecipients);
    return {
      ok: false,
      reason:
        `Wallet mismatch — USDC went to: ${actualRecipients.slice(0, 20)}… ` +
        `but server expected ATA of: ${lexonWallet.slice(0, 8)}…${lexonWallet.slice(-6)}. ` +
        `Fix LEXON_SOLANA_WALLET in Railway to match VITE_SOLANA_WALLET.`,
    };
  } catch (err) {
    console.error('[solanaVerify] Unexpected error:', err);
    return { ok: false, reason: 'Verification error. Please try again.' };
  }
}
