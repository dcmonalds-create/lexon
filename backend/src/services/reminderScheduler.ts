import {
  getDuePendingReminders,
  markReminderSent,
  incrementReminderAttempts,
  PendingReminder,
} from './db';
import { sendTelegramMessage } from './telegram';

const POLL_INTERVAL_MS = 60_000; // 1 minute
const BOT_URL = process.env.TELEGRAM_BOT_URL || 'https://t.me/LexOnBot';

function formatReminderText(r: PendingReminder): string {
  const safe = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!));
  return [
    `⏰ <b>LexOn reminder</b>`,
    ``,
    `Your <b>${safe(r.tool_name)}</b> case has a deadline approaching.`,
    ``,
    safe(r.summary),
    ``,
    `Open LexOn to review your full analysis and take action: ${BOT_URL}`,
  ].join('\n');
}

async function processOneReminder(r: PendingReminder): Promise<void> {
  const text = formatReminderText(r);
  const result = await sendTelegramMessage(r.telegram_id, text);

  if (result.ok || result.permanentFailure) {
    // Sent successfully OR chat_id is unreachable — either way, stop trying.
    await markReminderSent(r.id);
    if (!result.ok) {
      console.warn(`[reminders] dropped reminder #${r.id} for ${r.telegram_id}: ${result.error}`);
    }
    return;
  }

  // Transient failure — bump attempts counter; will retry on next poll.
  await incrementReminderAttempts(r.id);
  console.warn(`[reminders] transient failure on reminder #${r.id} (attempt ${r.attempts + 1}/3): ${result.error}`);
}

async function tick(): Promise<void> {
  try {
    const due = await getDuePendingReminders(50);
    if (due.length === 0) return;
    console.log(`[reminders] processing ${due.length} due reminder(s)`);
    for (const r of due) {
      await processOneReminder(r);
    }
  } catch (err) {
    console.error('[reminders] scheduler tick failed:', err);
  }
}

let started = false;

export function startReminderScheduler(): void {
  if (started) return;
  started = true;
  console.log(`[reminders] scheduler started (polling every ${POLL_INTERVAL_MS / 1000}s)`);
  // Fire one tick at startup, then on interval.
  void tick();
  setInterval(() => void tick(), POLL_INTERVAL_MS);
}
