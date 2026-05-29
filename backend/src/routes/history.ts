import { Router, Request, Response } from 'express';
import { getHistory } from '../services/db';
import { HistoryItem } from '../../../shared/types';

const router = Router();

router.get('/:telegramId', (req: Request, res: Response): void => {
  const { telegramId } = req.params;

  if (!telegramId) {
    res.status(400).json({ error: 'Missing telegramId' });
    return;
  }

  try {
    const results = getHistory.all(telegramId) as HistoryItem[];
    res.json({ results });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

export default router;
