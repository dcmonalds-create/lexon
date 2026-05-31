import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// DATA_DIR env var → Railway persistent Volume mount (e.g. /data)
// Fallback to the repo-relative path for local development
const dataDir = process.env.DATA_DIR || path.join(__dirname, '../../../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const DB_PATH = path.join(dataDir, 'lexon.db');
console.log(`[db] SQLite path: ${DB_PATH}`);

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

// Add UNIQUE index on tx_hash — guards against duplicate inserts from race conditions.
// Wrapped in try/catch so it doesn't crash if (unlikely) duplicate data already exists.
try {
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_results_tx_hash ON results(tx_hash);`);
} catch (err) {
  console.warn('Could not create unique index on tx_hash (duplicate data may exist):', err);
}

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
