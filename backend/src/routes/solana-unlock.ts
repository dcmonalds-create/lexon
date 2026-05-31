import { Router, Request, Response } from 'express';
import { getPendingResult, removePendingResult, claimSession, releaseSession } from '../services/payment';
import { insertResult } from '../services/db';
import { verifySolanaUsdcPayment } from '../services/solanaVerify';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { sessionToken, txSignature, userId } = req.body as {
    sessionToken?: string;
    txSignature?: string;
    userId?: string;
  };

  if (!sessionToken || !txSignature || !userId) {
    res.status(400).json({ error: 'Missing required fields: sessionToken, txSignature, userId' });
    return;
  }

  const pending = getPendingResult(sessionToken);
  if (!pending) {
    res.status(404).json({ error: 'Session expired or not found. Please re-analyze.' });
    return;
  }

  // Atomic claim — prevent double-unlock from concurrent requests
  if (!claimSession(sessionToken)) {
    res.status(409).json({ error: 'Payment already being processed. Please wait.' });
    return;
  }

  try {
    const { ok, reason } = await verifySolanaUsdcPayment(txSignature, sessionToken);
    if (!ok) {
      console.error('[solana-unlock] verification failed:', reason);
      res.status(402).json({ error: `Payment verification failed: ${reason}` });
      return;
    }

    await insertResult({
      telegram_id: userId,
      tool_id: pending.toolId,
      input_summary: pending.inputSummary,
      full_result: pending.full,
      tx_hash: txSignature,
      paid_at: Math.floor(Date.now() / 1000),
    });

    removePendingResult(sessionToken);

    res.json({ full: pending.full });
  } catch (err) {
    console.error('Solana unlock error:', err);
    res.status(500).json({ error: 'Failed to process unlock.' });
  } finally {
    releaseSession(sessionToken);
  }
});

export default router;
