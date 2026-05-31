import { Router, Request, Response } from 'express';
import { getPendingResult, removePendingResult, verifyTonPayment, claimSession, releaseSession } from '../services/payment';
import { insertResult } from '../services/db';
import { UnlockRequest, UnlockResponse } from '../../../shared/types';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { sessionToken, txHash, telegramId } = req.body as UnlockRequest;

  if (!sessionToken || !txHash || !telegramId) {
    res.status(400).json({ error: 'Missing required fields: sessionToken, txHash, telegramId' });
    return;
  }

  const pending = getPendingResult(sessionToken);
  if (!pending) {
    res.status(404).json({ error: 'Session expired or not found. Please re-analyze.' });
    return;
  }

  if (pending.telegramId !== telegramId) {
    res.status(403).json({ error: 'Unauthorized.' });
    return;
  }

  // ── Atomic claim: prevent two concurrent requests from both unlocking ─────
  if (!claimSession(sessionToken)) {
    res.status(409).json({ error: 'Payment already being processed. Please wait.' });
    return;
  }

  const walletAddress = process.env.LEXON_WALLET_ADDRESS;
  if (!walletAddress) {
    releaseSession(sessionToken);
    res.status(500).json({ error: 'Payment wallet not configured.' });
    return;
  }

  try {
    const isValid = await verifyTonPayment(txHash, sessionToken, walletAddress);
    if (!isValid) {
      res.status(402).json({ error: 'Payment not verified. Please wait a moment and try again.' });
      return;
    }

    await insertResult({
      telegram_id: telegramId,
      tool_id: pending.toolId,
      input_summary: pending.inputSummary,
      full_result: pending.full,
      tx_hash: txHash,
      paid_at: Math.floor(Date.now() / 1000),
    });

    removePendingResult(sessionToken);

    const response: UnlockResponse = { full: pending.full };
    res.json(response);
  } catch (err) {
    console.error('Unlock error:', err);
    res.status(500).json({ error: 'Failed to save result.' });
  } finally {
    releaseSession(sessionToken); // always release the lock
  }
});

export default router;
