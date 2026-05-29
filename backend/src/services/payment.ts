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
      `${baseUrl}/getTransactions?address=${walletAddress}&limit=20&archival=true`,
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
      if (now - txTime > 600) continue;

      const comment = inMsg.message || '';
      if (comment === expectedSessionToken) {
        return true;
      }

      try {
        const decoded = atob(comment);
        if (decoded === expectedSessionToken) {
          return true;
        }
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
