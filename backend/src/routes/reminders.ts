import { Router, Request, Response } from 'express';
import { insertReminder, countActiveRemindersForUser } from '../services/db';

const router = Router();

const ALLOWED_DAYS = [1, 3, 7, 14, 30] as const;
type AllowedDays = (typeof ALLOWED_DAYS)[number];

const MAX_ACTIVE_PER_USER = 10;
const MAX_SUMMARY_LEN = 500;

interface CreateReminderBody {
  telegramId?: string;
  toolId?: string;
  toolName?: string;
  summary?: string;
  days?: number;
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { telegramId, toolId, toolName, summary, days } = req.body as CreateReminderBody;

  if (!telegramId || !toolId || !toolName || !summary || days === undefined) {
    res.status(400).json({ error: 'Missing required fields: telegramId, toolId, toolName, summary, days' });
    return;
  }

  if (!ALLOWED_DAYS.includes(days as AllowedDays)) {
    res.status(400).json({ error: `days must be one of ${ALLOWED_DAYS.join(', ')}` });
    return;
  }

  // Reminders only work for actual Telegram chat IDs (numeric).
  if (!/^-?\d+$/.test(telegramId)) {
    res.status(400).json({ error: 'Reminders are only available inside Telegram. Open LexOn in the Telegram Mini App to use this feature.' });
    return;
  }

  try {
    const active = await countActiveRemindersForUser(telegramId);
    if (active >= MAX_ACTIVE_PER_USER) {
      res.status(429).json({ error: `Limit reached: ${MAX_ACTIVE_PER_USER} active reminders per user.` });
      return;
    }

    const remindAt = Math.floor(Date.now() / 1000) + days * 86_400;
    const trimmedSummary = summary.slice(0, MAX_SUMMARY_LEN);

    const id = await insertReminder({
      telegram_id: telegramId,
      tool_id: toolId,
      tool_name: toolName,
      summary: trimmedSummary,
      remind_at: remindAt,
    });

    res.json({ id, remindAt });
  } catch (err) {
    console.error('Reminder create error:', err);
    res.status(500).json({ error: 'Failed to create reminder. Please try again.' });
  }
});

export default router;
