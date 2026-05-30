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

/**
 * Verify a USDT Jetton payment via TONApi events.
 *
 * Flow: user → their Jetton wallet → Lexon's Jetton wallet → transfer_notification to Lexon's wallet.
 * TONApi decodes this into a JettonTransfer action with `comment` = the session token we embedded.
 *
 * @param expectedSessionToken  UUID session token embedded as Jetton forward comment
 */
export async function verifyTonPayment(
  _txHash: string,             // BOC from TonConnect — kept for DB storage; not used for verification
  expectedSessionToken: string,
  walletAddress: string
): Promise<boolean> {
  const apiKey = process.env.TONAPI_KEY;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  try {
    // Fetch the last 50 account events (JettonTransfer events appear here)
    const res = await fetch(
      `https://tonapi.io/v2/accounts/${encodeURIComponent(walletAddress)}/events?limit=50&subject_only=true`,
      { headers }
    );

    if (!res.ok) {
      console.error('TONApi events error:', res.status, await res.text());
      return false;
    }

    const data = await res.json() as { events?: any[] };
    const events = data.events || [];
    const now = Math.floor(Date.now() / 1000);

    for (const event of events) {
      // Skip events older than 30 minutes
      if (now - (event.timestamp ?? 0) > 1800) continue;

      for (const action of event.actions ?? []) {
        if (action.type !== 'JettonTransfer' || action.status !== 'ok') continue;

        const jt = action.JettonTransfer;
        if (!jt) continue;

        // Amount must be >= 1 USDT (1_000_000 with 6 decimals)
        const amount = BigInt(jt.amount ?? '0');
        if (amount < 1_000_000n) continue;

        // Comment must match session token exactly
        if (jt.comment === expectedSessionToken) return true;
      }
    }

    return false;
  } catch (err) {
    console.error('USDT payment verification error:', err);
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
