import { Router, Request, Response } from 'express';
import { getHistory } from '../services/db';

const router = Router();

router.get('/:telegramId', async (req: Request, res: Response): Promise<void> => {
  const telegramId = req.params.telegramId as string;

  if (!telegramId) {
    res.status(400).json({ error: 'Missing telegramId' });
    return;
  }

  try {
    const results = await getHistory(telegramId);
    res.json({ results });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

export default router;
