# Darvis Maestro — Technical Specification

**Version:** 1.0
**Date:** 2026-02-22
**Author:** James 🎩 + Davi

---

## 1. Overview

Darvis Maestro is a web application for tracking AI-orchestrated work against business goals. It captures what you build, links it to why it matters, and generates impact narratives for performance reviews, client reports, and portfolio building.

### Design Philosophy
- **Capture, don't direct.** Maestro wraps around your existing workflow. You still plan and code in Claude Code / Codex. Maestro tracks what happened and why it mattered.
- **30-second rule.** Any interaction with Maestro should take <30 seconds. If it takes longer, the design is wrong.
- **Flexible proof.** Not everything has numbers. Qualitative outcomes (leadership recognition, team adoption, process change) are valid proof.
- **Agents report in.** AI coding agents can POST to Maestro's API via a skill file — no complex native integrations needed.

### What Maestro Is NOT
- ❌ A code editor or terminal
- ❌ A planning tool that replaces Claude Code
- ❌ A real-time metrics dashboard
- ❌ Another Jira
- ❌ A complex native app fighting OS APIs

### What Maestro IS
- ✅ A goal tracker that captures your AI work
- ✅ An impact narrative generator
- ✅ A performance portfolio builder
- ✅ A simple REST API that agents can report to

---

## 2. User Stories

### US-1: Quick Goal Creation (30 seconds)
**As** an orchestrator,
**I want** to create a goal in <30 seconds,
**so that** I can get back to actual work immediately.

**Flow:**
1. Open Maestro → click "+ Goal"
2. Type title: "Reduce frame drops for Troy"
3. Optional: one-line description, Jira link, tags
4. Done. Goal appears in "Planning" column.

### US-2: Agent Reports Work (zero friction for human)
**As** an orchestrator,
**I want** my AI agents to report their work to Maestro automatically,
**so that** I don't have to manually log what happened.

**Flow:**
1. Davi gives Claude Code the Maestro skill
2. Agent finishes a task
3. Agent POSTs to Maestro API: `{ goal: "troy-perf", summary: "Optimized BDC render pipeline", artifacts: ["PR #1801"], status: "done" }`
4. Maestro shows the update under the goal — Davi does nothing

### US-3: Manual Quick Update (15 seconds)
**As** an orchestrator,
**I want** to manually log work when agents don't report,
**so that** nothing falls through the cracks.

**Flow:**
1. Open goal → click "+ Update"
2. Type: "Built 7 funnel variations for AI Week"
3. Optional: paste PR link, add outcome tag
4. Done.

### US-4: Qualitative Impact (AI Week, DevEx)
**As** an orchestrator,
**I want** to prove impact for work that has no metrics,
**so that** leadership efforts and process improvements get credit.

**Flow:**
1. Open goal → Impact tab
2. Select outcome tags: ✅ Leadership recognition, ✅ Team adoption
3. Add context: "COO praised the approach at Village Leadership Sync"
4. Generate narrative → polished paragraph ready for performance review

### US-5: Quantitative Impact (Troy Performance)
**As** an orchestrator,
**I want** to show before/after metrics,
**so that** the business value is undeniable.

**Flow:**
1. Open goal → Impact tab
2. Add metric: "Frame drops/sec" → Before: 12.3 → After: 1.8
3. Add metric: "Page load time" → Before: 3.2s → After: 0.8s
4. Generate narrative → includes the numbers and calculates delta

### US-6: Performance Review (the payoff)
**As** an orchestrator,
**I want** to export 3 months of proven goals as a document,
**so that** my performance review writes itself.

**Flow:**
1. Portfolio tab → filter: last 3 months, Zebra
2. See 12 proven goals with narratives
3. Click "Export Markdown"
4. Paste into review doc. Done in 5 minutes.

### US-7: Client ROI Report (Deploy Kit)
**As** a consultant,
**I want** to show my client what their AI assistant delivered this month,
**so that** the monthly fee is justified.

**Flow:**
1. Filter portfolio by client + month
2. Generate narrative with client-friendly tone
3. Export PDF → send to Tio Junior

---

## 3. Data Model

### Goal
```typescript
interface Goal {
  id: string                    // uuid
  title: string                 // "Reduce frame drops for Troy"
  description?: string          // one-liner
  status: 'planning' | 'executing' | 'measuring' | 'proven' | 'archived'
  tags: string[]                // ["zebra", "troy", "performance"]
  jiraUrl?: string              // link to ticket
  createdAt: string             // ISO timestamp
  updatedAt: string
  
  // Impact data
  metrics: Metric[]             // quantitative before/after
  outcomes: OutcomeTag[]        // qualitative tags
  outcomeNotes: string          // freeform context
  narrative?: string            // AI-generated impact story
  narrativeTone?: 'review' | 'client' | 'standup' | 'slack'
  
  // Tracking
  updates: Update[]             // work log entries
  artifacts: Artifact[]         // PRs, commits, links
  totalSpend?: number           // estimated AI compute cost
}
```

### Update (work log entry)
```typescript
interface Update {
  id: string
  goalId: string
  source: 'manual' | 'agent'   // who created it
  agentName?: string            // "claude-code", "codex", "james"
  summary: string               // "Optimized BDC render pipeline"
  details?: string              // longer description
  timestamp: string
}
```

### Artifact (linked evidence)
```typescript
interface Artifact {
  id: string
  goalId: string
  type: 'pr' | 'commit' | 'link' | 'file'
  url?: string                  // GitHub/GitLab PR URL
  title: string                 // "PR #1801: Optimize render pipeline"
  metadata?: {
    filesChanged?: number
    linesAdded?: number
    linesRemoved?: number
    mergedAt?: string
    ciStatus?: 'pass' | 'fail' | 'pending'
  }
}
```

### Metric (before/after)
```typescript
interface Metric {
  id: string
  name: string                  // "Frame drops/sec"
  before: number
  after: number
  unit?: string                 // "per second", "ms", "%"
  source?: string               // "manual", "grafana", "eppo"
  measuredAt?: string
}
```

### OutcomeTag (qualitative)
```typescript
type OutcomeTag = 
  | 'leadership_recognition'
  | 'team_adoption'
  | 'process_change'
  | 'reputation_boost'
  | 'cost_savings'
  | 'time_savings'
  | 'client_satisfaction'
  | 'revenue_generated'
  | 'risk_reduced'
  | 'knowledge_shared'
  | 'custom'
```

---

## 4. Architecture

```
┌─────────────────────────────────────────────────┐
│             Browser (SvelteKit)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │Goal Board│ │Goal Detail│ │ Portfolio/Export ││
│  │(kanban)  │ │(tabs)     │ │                  ││
│  └──────────┘ └──────────┘ └──────────────────┘│
└──────────────────┬──────────────────────────────┘
                   │ HTTP
┌──────────────────▼──────────────────────────────┐
│           SvelteKit Server                       │
│  ┌──────────────────────────────────────┐       │
│  │         API Routes                    │       │
│  │  /api/goals      (CRUD)              │       │
│  │  /api/goals/[id] (detail + updates)  │       │
│  │  /api/report     (agent reports in)   │       │
│  │  /api/narrative  (AI generation)      │       │
│  │  /api/portfolio  (export)             │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ SQLite   │ │ GitHub / │ │  AI Engine       ││
│  │ (local)  │ │ GitLab   │ │  (Anthropic API) ││
│  │          │ │ APIs     │ │  Sonnet for cost ││
│  └──────────┘ └──────────┘ └──────────────────┘│
└─────────────────────────────────────────────────┘
```

### Why SvelteKit
- Same stack as James Land (shared knowledge, patterns)
- Server routes for API (agents POST here)
- Rich UI for kanban boards, charts, animations
- Accessible via Tailscale from any device
- Svelte 5 runes + Tailwind CSS 4 + Bun

### Storage: SQLite (via better-sqlite3)
- Single file database, zero config
- Fast enough for personal use (thousands of goals)
- Easy to backup (one file)
- Path: `~/.darvis-maestro/maestro.db`

### AI Engine
- Anthropic API (Sonnet 4.6 — cheap, good enough for narratives)
- One call per narrative generation (~$0.01)
- Prompt: goal + updates + artifacts + metrics + outcomes → structured narrative
- Configurable tone: performance review, client report, standup, Slack

---

## 5. API Design

### Goals CRUD
```
GET    /api/goals                    → list all goals (with filters)
POST   /api/goals                    → create goal
GET    /api/goals/[id]               → get goal with updates + artifacts
PATCH  /api/goals/[id]               → update goal (status, description, etc.)
DELETE /api/goals/[id]               → archive goal
```

### Updates (work log)
```
POST   /api/goals/[id]/updates       → add update (manual or agent)
```

### Artifacts
```
POST   /api/goals/[id]/artifacts     → link artifact (PR, commit, link)
```

### Metrics & Outcomes
```
POST   /api/goals/[id]/metrics       → add before/after metric
PATCH  /api/goals/[id]/outcomes      → set outcome tags + notes
```

### Agent Report Endpoint (the skill uses this)
```
POST   /api/report
Body: {
  goalId?: string,              // if known
  goalTitle?: string,           // for fuzzy matching if goalId unknown
  summary: string,              // what was done
  artifacts?: [{type, url, title}],
  agentName?: string            // "claude-code", "codex"
}
Response: { ok: true, goalId: string, updateId: string }
```

### Narrative Generation
```
POST   /api/goals/[id]/narrative
Body: { tone: 'review' | 'client' | 'standup' | 'slack' }
Response: { narrative: string }
```

### Portfolio Export
```
GET    /api/portfolio?from=2026-01-01&to=2026-03-31&tags=zebra
Response: { goals: Goal[], markdown: string }
```

---

## 6. UI Design

### Color Palette (Darvis Brand)
```
Background:       #0D0D0F (near black)
Card background:  #1A1A1F
Card border:      #2E2E38
Header:           #121217
Neon purple:      #AD4DFF (primary accent)
Neon magenta:     #ED45AD (secondary accent)
Neon cyan:        #4DD9F2 (tertiary)
Status green:     #4DD973
Status amber:     #F2BF33
Status gray:      #80808C
Text primary:     #EBEBF2
Text secondary:   #8C8C9E
Text muted:       #616173
```

### Page: Goals Board (home)
```
┌─────────────────────────────────────────────────────────┐
│  🎼 Darvis Maestro              [+ New Goal]        ⚙  │
├─────────────────────────────────────────────────────────┤
│  [Search goals...]           [Filter: All ▾]  [Tags ▾] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PLANNING        EXECUTING       MEASURING      PROVEN  │
│  ─────────       ─────────       ─────────      ─────── │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────┐│
│  │ FUN-620 │    │ Troy    │    │ FUN-614 │    │ AI   ││
│  │ Reset   │    │ BDC perf│    │ Exp fix │    │ Week ││
│  │ user    │    │         │    │         │    │      ││
│  │         │    │ 3 update│    │ 1 metric│    │ ✅ 3 ││
│  │ zebra   │    │ $47     │    │ awaiting│    │ tags ││
│  └─────────┘    └─────────┘    └─────────┘    └──────┘│
│                                                         │
│  Drag cards between columns to update status            │
└─────────────────────────────────────────────────────────┘
```

Cards show: title, tag chips, update count, spend (if tracked), outcome tag count.
Drag-and-drop between columns.

### Page: Goal Detail
```
┌─────────────────────────────────────────────────────────┐
│  ← Goals    🎯 Project Troy: BDC Performance            │
│  "Reduce frame drops to <3/sec on US screens"           │
│  Tags: [troy] [zebra] [performance]    Status: EXECUTING│
├─────────────────────────────────────────────────────────┤
│  [Updates]  [Artifacts]  [Impact]                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  UPDATES tab (default):                                 │
│                                                         │
│  [+ Add Update]                                         │
│                                                         │
│  ┌─ 10:32 · claude-code ──────────────────────────────┐│
│  │ Optimized BDC render pipeline. Reduced unnecessary  ││
│  │ re-renders in profile card component.               ││
│  └────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─ 09:15 · manual ──────────────────────────────────┐ │
│  │ Diagnosed baseline: 12.3 frame drops/sec on US     │ │
│  │ profile screens using Flutter DevTools.             │ │
│  └────────────────────────────────────────────────────┘│
│                                                         │
│  ARTIFACTS tab:                                         │
│  [+ Link PR/Commit]                                     │
│  • PR #1801 — Optimize render pipeline (merged ✅)      │
│  • PR #1803 — Cache profile images (in review 🟡)       │
│                                                         │
│  IMPACT tab:                                            │
│  ┌────────────────────────────────────────────────────┐│
│  │ 📊 Metrics           [+ Add Metric]                ││
│  │ Frame drops/sec    12.3 → 1.8    Δ -85%  🟢       ││
│  │ Page load (ms)     3200 → 800    Δ -75%  🟢       ││
│  ├────────────────────────────────────────────────────┤│
│  │ 🏷️ Outcomes                                        ││
│  │ [✅ Time savings] [✅ Reputation boost] [+ Add]     ││
│  │ Notes: "Zagui highlighted this in team retro"      ││
│  ├────────────────────────────────────────────────────┤│
│  │ 📝 Narrative        [Generate ✨] [Tone: Review ▾] ││
│  │ "Optimized BDC rendering pipeline for Project      ││
│  │  Troy. Frame drops reduced from 12.3/sec to        ││
│  │  1.8/sec (-85%) on US profile screens..."          ││
│  │                                                    ││
│  │ [Copy] [Export PDF]                                ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Page: Portfolio
```
┌─────────────────────────────────────────────────────────┐
│  📁 Portfolio                                           │
│  [Date range ▾]  [Tags ▾]  [Export All ▾]              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Feb 2026 ──────────────────────────────────            │
│                                                         │
│  🎯 AI Week Design Exploration              PROVEN      │
│     zebra · qualitative                                 │
│     "Led AI-assisted design exploration..."             │
│     ✅ Leadership recognition · ✅ Team adoption         │
│                                                         │
│  🎯 FUN-614 Experiment Fix                  PROVEN      │
│     zebra · 1 PR merged                                 │
│     "Fixed critical A/B test configuration..."          │
│                                                         │
│  🎯 Project Troy: BDC Performance           MEASURING   │
│     nubank · 2 PRs · Δ -85% frame drops                │
│     "Optimized BDC rendering pipeline..."               │
│                                                         │
│  ──────────────────────────────────────────────         │
│  Summary: 12 goals · 8 proven · $340 compute            │
│  [Export Markdown]  [Export PDF]                         │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Agent Skill Integration

Instead of complex native integrations, agents report to Maestro via a skill file.

### Skill File: `skills/darvis-maestro/SKILL.md`

Agents read this skill to know:
- Maestro's API endpoint (localhost:3336)
- How to report completed work
- How to link artifacts
- When to report (after completing a task, after merging a PR)
- JSON format for the report endpoint

### How It Works
1. Davi includes `darvis-maestro` skill in Claude Code / Codex session
2. Agent reads SKILL.md, learns the API
3. Agent completes work
4. Agent POSTs summary to `/api/report`
5. Maestro receives, matches to goal (by ID or fuzzy title match), creates update
6. Davi sees it in the web UI — zero manual effort

### Example Agent Report
```bash
curl -X POST http://localhost:3336/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "goalTitle": "Troy BDC Performance",
    "summary": "Optimized render pipeline, reduced re-renders in profile card",
    "artifacts": [
      {"type": "pr", "url": "https://github.com/nubank/app/pull/1801", "title": "Optimize render pipeline"}
    ],
    "agentName": "claude-code"
  }'
```

---

## 8. Narrative Generation

### Prompt Template
```
You are generating an impact narrative for a performance review / client report / standup update.

Goal: {goal.title}
Description: {goal.description}
Status: {goal.status}

Work Log:
{updates.map(u => `- [${u.timestamp}] ${u.summary}`).join('\n')}

Artifacts:
{artifacts.map(a => `- ${a.title} (${a.url})`).join('\n')}

Metrics:
{metrics.map(m => `- ${m.name}: ${m.before} → ${m.after} (${delta}%)`).join('\n')}

Qualitative Outcomes:
{outcomes.join(', ')}
{outcomeNotes}

Generate a concise, professional impact narrative (3-5 sentences).
Tone: {tone}
Include specific numbers where available.
For qualitative work, emphasize the organizational impact.
```

### Model: Sonnet 4.6 via Anthropic API
- Cost: ~$0.01 per narrative
- Fast enough for real-time generation

---

## 9. Tech Stack

| Component | Choice | Reason |
|-----------|--------|--------|
| Framework | SvelteKit + Svelte 5 runes | Same as James Land, proven |
| Styling | Tailwind CSS 4 | Consistent with Darvis brand |
| Runtime | Bun | Fast, used in James Land |
| Database | better-sqlite3 | Zero config, single file, fast |
| AI | Anthropic API (Sonnet 4.6) | Cheap narratives |
| Git APIs | GitHub REST + GitLab REST | PR/commit metadata |
| Port | 3336 | Available, after James Land (3333) and Deploy Kit (3334) |
| Data dir | ~/.darvis-maestro/ | Config + SQLite DB |

---

## 10. File Structure

```
darvis-maestro/
├── src/
│   ├── routes/
│   │   ├── +page.svelte                 # Goals board (kanban)
│   │   ├── +layout.svelte               # App shell, nav, theme
│   │   ├── goals/
│   │   │   └── [id]/
│   │   │       └── +page.svelte         # Goal detail (tabs)
│   │   ├── portfolio/
│   │   │   └── +page.svelte             # Portfolio view + export
│   │   └── api/
│   │       ├── goals/
│   │       │   ├── +server.ts           # GET list, POST create
│   │       │   └── [id]/
│   │       │       ├── +server.ts       # GET, PATCH, DELETE
│   │       │       ├── updates/+server.ts
│   │       │       ├── artifacts/+server.ts
│   │       │       ├── metrics/+server.ts
│   │       │       ├── outcomes/+server.ts
│   │       │       └── narrative/+server.ts
│   │       ├── report/+server.ts        # Agent report endpoint
│   │       └── portfolio/+server.ts     # Export endpoint
│   ├── lib/
│   │   ├── db.ts                        # SQLite setup + queries
│   │   ├── schema.ts                    # DB schema + migrations
│   │   ├── narrative.ts                 # AI narrative generation
│   │   ├── github.ts                    # GitHub API client
│   │   ├── gitlab.ts                    # GitLab API client
│   │   └── theme.ts                     # Darvis theme constants
│   └── app.css                          # Global styles
├── skills/
│   └── darvis-maestro/
│       └── SKILL.md                     # Agent integration skill
├── static/
│   └── images/
├── package.json
├── svelte.config.js
├── tailwind.config.ts
├── vite.config.ts
├── CLAUDE.md
└── README.md
```

---

## 11. Phased Build Plan

### Phase 1: Core (MVP) — ~2 days
- SQLite schema + db.ts
- Goals CRUD API
- Goals board (kanban with drag-and-drop)
- Goal detail page (updates tab)
- Manual update creation
- Darvis neon theme
- Basic skill file

### Phase 2: Impact — ~1 day
- Metrics (before/after input)
- Outcome tags
- AI narrative generation
- Impact tab in goal detail

### Phase 3: Integration — ~1 day
- Agent report API endpoint
- Full skill file with examples
- GitHub/GitLab artifact linking (fetch PR metadata)
- Artifact tab in goal detail

### Phase 4: Portfolio — ~1 day
- Portfolio page with timeline view
- Filters (date range, tags)
- Markdown export
- PDF export (optional)

### Phase 5: Polish — ~1 day
- Animations and transitions
- Mobile responsive (Tailscale access)
- Search and filtering on goals board
- LaunchAgent for auto-start

---

## 12. Database Schema

```sql
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  tags TEXT DEFAULT '[]',           -- JSON array
  jira_url TEXT,
  outcome_tags TEXT DEFAULT '[]',   -- JSON array
  outcome_notes TEXT DEFAULT '',
  narrative TEXT,
  narrative_tone TEXT DEFAULT 'review',
  total_spend REAL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE updates (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL REFERENCES goals(id),
  source TEXT NOT NULL DEFAULT 'manual',
  agent_name TEXT,
  summary TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE artifacts (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL REFERENCES goals(id),
  type TEXT NOT NULL,               -- 'pr', 'commit', 'link', 'file'
  url TEXT,
  title TEXT NOT NULL,
  files_changed INTEGER,
  lines_added INTEGER,
  lines_removed INTEGER,
  merged_at TEXT,
  ci_status TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE metrics (
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

CREATE INDEX idx_updates_goal ON updates(goal_id);
CREATE INDEX idx_artifacts_goal ON artifacts(goal_id);
CREATE INDEX idx_metrics_goal ON metrics(goal_id);
CREATE INDEX idx_goals_status ON goals(status);
```

---

## 13. Open Questions

- Should Darvis Sessions be absorbed into Maestro (web-based session list) or stay separate?
- Should goals support sub-goals / hierarchy?
- Should there be a "daily view" that shows all updates across goals for standup prep?
- Team features later — multiple users reporting to same Maestro instance?

---

*Built with 🎩 by Darvis*
