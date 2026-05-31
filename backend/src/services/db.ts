import { Pool } from 'pg';
import type { HistoryItem } from '../../../shared/types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id          SERIAL  PRIMARY KEY,
      telegram_id TEXT    NOT NULL,
      tool_id     TEXT    NOT NULL,
      input_summary TEXT,
      full_result TEXT    NOT NULL,
      tx_hash     TEXT    NOT NULL,
      paid_at     INTEGER NOT NULL,
      created_at  INTEGER DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_results_tx_hash  ON results(tx_hash);
    CREATE INDEX        IF NOT EXISTS idx_results_telegram ON results(telegram_id);

    CREATE TABLE IF NOT EXISTS reminders (
      id          SERIAL  PRIMARY KEY,
      telegram_id TEXT    NOT NULL,
      tool_id     TEXT    NOT NULL,
      tool_name   TEXT    NOT NULL,
      summary     TEXT    NOT NULL,
      remind_at   INTEGER NOT NULL,
      sent_at     INTEGER,
      attempts    INTEGER NOT NULL DEFAULT 0,
      created_at  INTEGER DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_reminders_pending
      ON reminders(remind_at) WHERE sent_at IS NULL;
    CREATE INDEX IF NOT EXISTS idx_reminders_telegram
      ON reminders(telegram_id);
  `);
  console.log('[db] PostgreSQL connected and schema ready');
}

// ─── Reminders ─────────────────────────────────────────────────────────────

export interface PendingReminder {
  id: number;
  telegram_id: string;
  tool_id: string;
  tool_name: string;
  summary: string;
  remind_at: number;
  attempts: number;
}

export async function insertReminder(params: {
  telegram_id: string;
  tool_id: string;
  tool_name: string;
  summary: string;
  remind_at: number;
}): Promise<number> {
  const { rows } = await pool.query<{ id: number }>(
    `INSERT INTO reminders (telegram_id, tool_id, tool_name, summary, remind_at)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [params.telegram_id, params.tool_id, params.tool_name, params.summary, params.remind_at],
  );
  return rows[0].id;
}

export async function countActiveRemindersForUser(telegramId: string): Promise<number> {
  const { rows } = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM reminders
     WHERE telegram_id = $1 AND sent_at IS NULL`,
    [telegramId],
  );
  return parseInt(rows[0].count, 10);
}

export async function getDuePendingReminders(limit = 50): Promise<PendingReminder[]> {
  const nowSec = Math.floor(Date.now() / 1000);
  const { rows } = await pool.query<PendingReminder>(
    `SELECT id, telegram_id, tool_id, tool_name, summary, remind_at, attempts
     FROM reminders
     WHERE sent_at IS NULL AND remind_at <= $1 AND attempts < 3
     ORDER BY remind_at ASC
     LIMIT $2`,
    [nowSec, limit],
  );
  return rows;
}

export async function markReminderSent(id: number): Promise<void> {
  const nowSec = Math.floor(Date.now() / 1000);
  await pool.query(`UPDATE reminders SET sent_at = $1 WHERE id = $2`, [nowSec, id]);
}

export async function incrementReminderAttempts(id: number): Promise<void> {
  await pool.query(`UPDATE reminders SET attempts = attempts + 1 WHERE id = $1`, [id]);
}

export async function insertResult(params: {
  telegram_id: string;
  tool_id: string;
  input_summary: string;
  full_result: string;
  tx_hash: string;
  paid_at: number;
}): Promise<void> {
  await pool.query(
    `INSERT INTO results (telegram_id, tool_id, input_summary, full_result, tx_hash, paid_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (tx_hash) DO NOTHING`,
    [params.telegram_id, params.tool_id, params.input_summary,
     params.full_result, params.tx_hash, params.paid_at],
  );
}

export async function getHistory(telegramId: string): Promise<HistoryItem[]> {
  const { rows } = await pool.query<HistoryItem>(
    `SELECT id, tool_id, input_summary, full_result, tx_hash, paid_at, created_at
     FROM results
     WHERE telegram_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [telegramId],
  );
  return rows;
}

export default pool;
