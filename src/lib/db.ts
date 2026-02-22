import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const dataDir = join(homedir(), '.darvis-maestro');
mkdirSync(dataDir, { recursive: true });

const dbPath = join(dataDir, 'maestro.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning',
    tags TEXT DEFAULT '[]',
    jira_url TEXT,
    outcome_tags TEXT DEFAULT '[]',
    outcome_notes TEXT DEFAULT '',
    narrative TEXT,
    narrative_tone TEXT DEFAULT 'review',
    total_spend REAL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS updates (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    source TEXT NOT NULL DEFAULT 'manual',
    agent_name TEXT,
    summary TEXT NOT NULL,
    details TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS artifacts (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    url TEXT,
    title TEXT NOT NULL,
    files_changed INTEGER,
    lines_added INTEGER,
    lines_removed INTEGER,
    merged_at TEXT,
    ci_status TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    before_val REAL NOT NULL,
    after_val REAL NOT NULL,
    unit TEXT,
    source TEXT DEFAULT 'manual',
    measured_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_updates_goal ON updates(goal_id);
  CREATE INDEX IF NOT EXISTS idx_artifacts_goal ON artifacts(goal_id);
  CREATE INDEX IF NOT EXISTS idx_metrics_goal ON metrics(goal_id);
  CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
`);

export default db;
