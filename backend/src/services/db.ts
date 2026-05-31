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
  `);
  console.log('[db] PostgreSQL connected and schema ready');
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
