# CLAUDE.md — Darvis Maestro

## What To Build
SvelteKit web app for tracking AI work against business goals. Port 3336.

## Stack
- SvelteKit + Svelte 5 runes + Tailwind CSS 4 + Bun
- SQLite via better-sqlite3
- Anthropic API for narrative generation (later)

## Setup Commands
```bash
bun create svelte@latest . --template skeleton --types typescript
bun add better-sqlite3 uuid
bun add -d @types/better-sqlite3
# Configure vite.config.ts to use port 3336
# Configure tailwind
```

## Database Schema (SQLite)
File: `~/.darvis-maestro/maestro.db`

```sql
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
  goal_id TEXT NOT NULL REFERENCES goals(id),
  source TEXT NOT NULL DEFAULT 'manual',
  agent_name TEXT,
  summary TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS artifacts (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL REFERENCES goals(id),
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
  goal_id TEXT NOT NULL REFERENCES goals(id),
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
```

## API Routes
```
GET    /api/goals              → list goals (query: ?status=&tags=)
POST   /api/goals              → create goal {title, description?, tags?, jira_url?}
GET    /api/goals/[id]         → goal + updates + artifacts + metrics
PATCH  /api/goals/[id]         → update goal fields
DELETE /api/goals/[id]         → delete goal

POST   /api/goals/[id]/updates    → {summary, details?, source?, agent_name?}
POST   /api/goals/[id]/artifacts  → {type, url?, title, metadata?}
POST   /api/goals/[id]/metrics    → {name, before_val, after_val, unit?}
PATCH  /api/goals/[id]/outcomes   → {outcome_tags, outcome_notes}

POST   /api/report             → agent report endpoint
       {goalId?, goalTitle?, summary, artifacts?[], agentName?}
       Fuzzy-matches goalTitle to existing goals
```

## Pages
1. `/` — Goals Board: Kanban with 4 columns (planning, executing, measuring, proven). Drag-and-drop cards between columns. Each card shows title, tags, update count. "+ New Goal" button opens modal.
2. `/goals/[id]` — Goal Detail: 3 tabs (Updates, Artifacts, Impact). Back button to board.
3. `/portfolio` — Portfolio: List of proven goals with narratives. Filter by date/tags. Export markdown.

## Dark Neon Theme (Darvis Brand)
```css
--bg: #0D0D0F;
--card-bg: #1A1A1F;
--card-border: #2E2E38;
--header-bg: #121217;
--neon-purple: #AD4DFF;
--neon-magenta: #ED45AD;
--neon-cyan: #4DD9F2;
--status-green: #4DD973;
--status-amber: #F2BF33;
--status-gray: #80808C;
--text-primary: #EBEBF2;
--text-secondary: #8C8C9E;
--text-muted: #616173;
```

Apply dark background everywhere. Purple accents for interactive elements. Cards with subtle borders and hover glow effects. Monospace for timestamps/paths.

## File Structure
```
src/
  routes/
    +page.svelte              # Goals board (kanban)
    +layout.svelte            # App shell, nav, theme
    goals/[id]/+page.svelte   # Goal detail
    portfolio/+page.svelte    # Portfolio view
    api/goals/+server.ts
    api/goals/[id]/+server.ts
    api/goals/[id]/updates/+server.ts
    api/goals/[id]/artifacts/+server.ts
    api/goals/[id]/metrics/+server.ts
    api/goals/[id]/outcomes/+server.ts
    api/report/+server.ts
    api/portfolio/+server.ts
  lib/
    db.ts                     # SQLite init + helpers
    theme.ts                  # Theme constants
  app.css                     # Global dark theme styles
```

## Important
- All IDs use crypto.randomUUID()
- Tags stored as JSON arrays in SQLite TEXT columns
- Parse with JSON.parse() when reading, JSON.stringify() when writing
- Dates as ISO strings
- Status enum: 'planning' | 'executing' | 'measuring' | 'proven' | 'archived'
