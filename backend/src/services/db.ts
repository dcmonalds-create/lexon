import Database from 'better-sqlite3';
import path from 'path';

// In compiled output __dirname = dist/backend/src/services/
// data/ is at backend/data/
const DB_PATH = path.join(__dirname, '../../../../data/lexon.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT NOT NULL,
    tool_id TEXT NOT NULL,
    input_summary TEXT,
    full_result TEXT NOT NULL,
    tx_hash TEXT NOT NULL,
    paid_at INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s','now'))
  );

  CREATE INDEX IF NOT EXISTS idx_results_telegram ON results(telegram_id);
`);

export const insertResult = db.prepare(`
  INSERT INTO results (telegram_id, tool_id, input_summary, full_result, tx_hash, paid_at)
  VALUES (@telegram_id, @tool_id, @input_summary, @full_result, @tx_hash, @paid_at)
`);

export const getHistory = db.prepare(`
  SELECT id, tool_id, input_summary, full_result, tx_hash, paid_at, created_at
  FROM results
  WHERE telegram_id = ?
  ORDER BY created_at DESC
  LIMIT 50
`);

export default db;
