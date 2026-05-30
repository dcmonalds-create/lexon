import { randomUUID } from 'crypto';

interface PendingResult {
  telegramId: string;
  toolId: string;
  inputSummary: string;
  teaser: string;
  full: string;
  createdAt: number;
}

const pendingResults = new Map<string, PendingResult>();

const SESSION_TTL_MS = 30 * 60 * 1000;

// ─── In-progress guard (prevents double-spend via concurrent unlock calls) ─
const inProgressSessions = new Set<string>();

/** Mark session as being processed. Returns false if already claimed. */
export function claimSession(sessionToken: string): boolean {
  if (inProgressSessions.has(sessionToken)) return false;
  inProgressSessions.add(sessionToken);
  return true;
}

/** Release the in-progress lock (call in a finally block). */
export function releaseSession(sessionToken: string): void {
  inProgressSessions.delete(sessionToken);
}

export function createSession(
  telegramId: string,
  toolId: string,
  inputSummary: string,
  teaser: string,
  full: string
): string {
  const sessionToken = randomUUID();
  pendingResults.set(sessionToken, {
    telegramId,
    toolId,
    inputSummary,
    teaser,
    full,
    createdAt: Date.now(),
  });
  return sessionToken;
}

export function getPendingResult(sessionToken: string): PendingResult | null {
  const result = pendingResults.get(sessionToken);
  if (!result) return null;
  if (Date.now() - result.createdAt > SESSION_TTL_MS) {
    pendingResults.delete(sessionToken);
    return null;
  }
  return result;
}

export function removePendingResult(sessionToken: string): void {
  pendingResults.delete(sessionToken);
}

export async function verifyTonPayment(
  txHash: string,
  expectedSessionToken: string,
  walletAddress: string
): Promise<boolean> {
  const apiKey = process.env.TONCENTER_API_KEY;
  const baseUrl = 'https://toncenter.com/api/v2';

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const res = await fetch(
      `${baseUrl}/getTransactions?address=${walletAddress}&limit=50&archival=true`,
      { headers }
    );

    if (!res.ok) {
      console.error('TON Center API error:', res.status);
      return false;
    }

    const data = (await res.json()) as { result?: any[] };
    const transactions = data.result || [];

    for (const tx of transactions) {
      const inMsg = tx.in_msg;
      if (!inMsg) continue;

      const amount = parseInt(inMsg.value || '0', 10);
      if (amount < 1_000_000_000) continue;

      const txTime = tx.utime || 0;
      const now = Math.floor(Date.now() / 1000);
      // Extended window: 30 minutes to handle slow blockchain / API lag
      if (now - txTime > 1800) continue;

      const comment = inMsg.message || '';

      // Strategy 1: TON Center decoded the cell text for us — direct match
      if (comment === expectedSessionToken) return true;

      // Strategy 2: TON Center returned raw base64 cell content — decode and
      // strip the 4-byte text-comment op-code (0x00000000) if present
      try {
        const raw = Buffer.from(comment, 'base64');
        const text =
          raw.length > 4 && raw.readUInt32BE(0) === 0
            ? raw.slice(4).toString('utf8')   // strip op-code prefix
            : raw.toString('utf8');
        if (text === expectedSessionToken) return true;
      } catch {}
    }

    return false;
  } catch (err) {
    console.error('Payment verification error:', err);
    return false;
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [token, result] of pendingResults) {
    if (now - result.createdAt > SESSION_TTL_MS) {
      pendingResults.delete(token);
    }
  }
}, 5 * 60 * 1000);
