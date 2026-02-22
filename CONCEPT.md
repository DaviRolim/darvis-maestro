# Darvis Maestro 🎼

**Tagline:** Plan the work. Prove the work. The orchestrator's complete platform.

---

## What Is Maestro?

Darvis Maestro is the flagship Darvis app — a unified platform that combines **orchestration** (planning, dispatching, and directing AI agents) with **impact measurement** (tracking what was delivered and proving business value).

The conductor doesn't play instruments — they direct the orchestra and ensure the performance delivers.

## The Darvis Product Line

```
Flow (voice input) → Maestro (plan + dispatch + measure) → Sessions (real-time monitoring)
                         ↑ the flagship ↑
```

- **Darvis Flow** — Lightweight voice utility (input)
- **Darvis Sessions** — Lightweight menu bar utility (monitoring)
- **Darvis Maestro** — The full platform (plan → execute → prove)

---

## The Problem (Two Sides, One Gap)

### The Planning Gap
Orchestrators juggle multiple AI sessions manually — opening terminals, typing instructions, context-switching, trying to remember what each agent is doing. The gap between your brain (the plan) and the agents (the execution) is pure friction.

### The Proof Gap
Orchestrators spend $1K+/day on AI compute. But there's no tool that answers: "What did all that compute actually produce? How does it map to business goals? What's the before/after proof?"

**Maestro closes both gaps in one app.**

---

## Core Loop

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   1. DEFINE        2. PLAN         3. DISPATCH  │
│   Business Goal →  Break into  →   Assign to    │
│                    tasks           agents        │
│                                                 │
│   6. PROVE         5. MEASURE      4. MONITOR   │
│   AI narrative ←   Before/after ←  Track via    │
│   + portfolio      metrics         Sessions     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Features

### 🎯 Goal Definition
- Create business goals: "Reduce frame drops on US profile screens"
- Import from Jira tickets, OKRs, or freeform text
- AI-assisted goal decomposition: "Break this into actionable tasks"
- Priority and timeline estimation

### 📋 Task Planning
- Break goals into subtasks with dependency graphs
- "Task B needs output from Task A"
- AI-assisted decomposition: describe the goal, Maestro suggests tasks
- Estimated complexity per task (simple/medium/complex)

### 🚀 Agent Dispatch
- Launch Claude Code / Codex sessions with pre-written prompts
- Select model per task based on complexity:
  - Simple → Sonnet (cheap, fast)
  - Complex → Opus (expensive, thorough)
  - Codex default for straightforward coding
- Feed context: repo path, files, previous session output, Jira ticket, CLAUDE.md
- Set constraints: max token budget, timeout, auto-approve threshold

### 💰 Budget Control
- Set max spend per task, per goal, per day
- Running cost tracker across all active sessions
- Route automatically: simple tasks → cheap models, complex → expensive
- "You've spent $47 today across 8 sessions. Budget remaining: $53."
- Historical spend tracking per goal (ROI calculation)

### 🔄 Context Routing
- Pass output from one agent as input to the next
- Share context between parallel sessions
- Maintain a shared "project context" document per goal
- Chain tasks: "When auth module is done, start the API integration using its output"

### 📊 Artifact Tracking
- Auto-detect git commits from session working directories
- Link PRs/MRs to sessions and goals (GitHub API, GitLab API)
- Track: files changed, lines added/removed, tests added
- PR merge status, review time, CI results

### 📈 Metrics Integration
- **Phase 1:** Manual before/after input ("frame drops were 12/sec, now 2/sec")
- **Phase 2:** Pull from APIs:
  - **Eppo** (Zebra) — experiment results, A/B test metrics
  - **Prometheus/Grafana** (Nubank) — performance metrics, latency, error rates
  - **QuickSight** (Nubank) — business events, dashboards
  - **Datadog** — APM, logs, dashboards
  - **Custom webhooks** — any metric source
- Correlation engine: "These 3 PRs merged Feb 15-18. Frame drop metric changed from X to Y in same period. Confidence: high."

### 🤖 AI Impact Narrative
- Feed: goal + tasks + session timeline + artifacts + metrics to AI
- Generate impact story in natural language
- Example:
  ```
  "Optimized BDC rendering pipeline for Project Troy.
  Frame drops reduced from 12/sec to 2/sec on US profile screens.
  3 PRs merged (#1801, #1803, #1807), 847 lines changed.
  Work completed across 4 AI sessions over 2 days, $73 in compute.
  Estimated impact: smoother experience for 50K+ US beta users."
  ```
- Configurable tone: performance review, client report, standup update, Slack post

### 📁 Impact Portfolio
- Accumulates over time → searchable portfolio of delivered impact
- Filter by: project, goal, date range, team
- Export: PDF, Markdown, JSON
- Perfect for: performance reviews, promotion cases, client billing, AI ROI justification

### 🔗 Darvis Suite Integration
- **Sessions:** Real-time monitoring of dispatched agents (reads Sessions data)
- **Flow:** Voice-dispatch ("start a session on the auth module, use Claude Code")
- **Sessions auto-tag:** When you dispatch from Maestro, sessions are automatically linked to the goal

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Darvis Maestro                           │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    UI Layer                          │ │
│  │  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐  │ │
│  │  │ Goals    │ │ Dispatch │ │ Impact │ │Portfolio│  │ │
│  │  │ Board    │ │ Center   │ │ View   │ │ Export  │  │ │
│  │  └──────────┘ └──────────┘ └────────┘ └─────────┘  │ │
│  └────────────────────┬────────────────────────────────┘ │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────────┐ │
│  │              MaestroStore                            │ │
│  │  goals, tasks, sessions, artifacts, metrics          │ │
│  │  SQLite local database                               │ │
│  └────────────────────┬────────────────────────────────┘ │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────────┐ │
│  │            Integration Layer                         │ │
│  │  ┌───────┐ ┌───────┐ ┌────────┐ ┌───────────────┐  │ │
│  │  │  Git  │ │Metrics│ │Sessions│ │ Agent Dispatch│  │ │
│  │  │GitHub │ │ APIs  │ │(Darvis)│ │ (Terminal)    │  │ │
│  │  │GitLab │ │       │ │        │ │               │  │ │
│  │  └───────┘ └───────┘ └────────┘ └───────────────┘  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │          AI Engine (Anthropic / OpenAI)              │ │
│  │  • Task decomposition                               │ │
│  │  • Metric correlation analysis                      │ │
│  │  • Impact narrative generation                      │ │
│  │  • Goal suggestion from Jira                        │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Tech Stack Decision

### Option A: Swift + SwiftUI (macOS native)
- Consistent with Sessions
- Fast, lightweight, native feel
- Harder to do complex data visualization
- macOS only

### Option B: Web app (SvelteKit)
- Consistent with James Land
- Rich data viz (charts, graphs, timelines)
- Accessible from any device via Tailscale
- More integrations easier (REST APIs)
- Cross-platform by default

### Option C: Tauri v2 (Rust + Web)
- Consistent with Darvis Flow
- Desktop app feel with web flexibility
- Cross-platform (Mac + Windows)
- Best of both worlds

**Recommendation:** Option B (SvelteKit) or Option C (Tauri). Maestro needs rich UI for goal boards, timelines, charts, and portfolio views. Menu bar app (SwiftUI) is too constrained. Web gives the most flexibility for data visualization and integrations. Tauri if we want desktop-app distribution.

---

## Phased Approach

### Phase 1: Goals + Artifacts (MVP)
- Goal board (kanban-style: planning → in-progress → measuring → proven)
- Manual task creation under goals
- Git integration: auto-link commits/PRs to goals
- Manual before/after metrics input
- AI narrative generation
- Export to Markdown

### Phase 2: Dispatch + Sessions
- Agent dispatch from Maestro (launch Claude Code/Codex with context)
- Auto-link dispatched sessions to goals
- Darvis Sessions data integration
- Budget tracking per goal

### Phase 3: Metrics + Intelligence
- Metrics API integrations (Eppo, Grafana, Datadog)
- AI-powered metric correlation ("confidence: high/medium/low")
- AI task decomposition from goal description
- Jira import for goals

### Phase 4: Portfolio + Team
- Portfolio view with timeline
- PDF export with branded templates
- Team features (multiple people's sessions)
- Historical trends and insights

---

## Metrics Integration Deep Dive

### Zebra (Eppo)
- REST API for experiment results
- Pull: experiment name, variant metrics, statistical significance
- Correlation: Link experiment to PR that implemented the feature flag

### Nubank (Prometheus/Grafana)
- Grafana HTTP API for querying dashboards and panels
- Prometheus PromQL for direct metric queries
- Pull: time-series data with before/after windows around PR merge date

### Nubank (QuickSight)
- AWS QuickSight embedding API
- Alternative: Export CSV, import into Maestro

### Generic Metric Source Config
```json
{
  "name": "Frame Drop Rate",
  "type": "prometheus",
  "query": "rate(frame_drops_total[5m])",
  "endpoint": "https://grafana.internal/api/ds/query",
  "beforeWindow": "7d",
  "afterWindow": "7d"
}
```

---

## Target Audiences

1. **AI Orchestrators (Davi)** — Plan work, dispatch agents, prove impact
2. **Engineering Managers** — Justify AI spend to leadership with data
3. **Consultants/Freelancers** — Show clients ROI with generated reports
4. **Deploy Kit clients** — Prove AI assistant value ("Alfred saved 15h this month")

---

## Design Principles (Friction-Aware)

1. **Goal creation: <30 seconds.** Title + optional one-liner. That's it.
2. **Agent reporting: zero human friction.** Agents POST to API via skill file.
3. **Metrics: optional and flexible.** Quantitative OR qualitative. Neither required.
4. **Narrative: one-click generate.** AI writes from whatever data exists.
5. **No codebase access needed.** Reads git metadata via GitHub/GitLab APIs only.
6. **No model subscription dependency.** Sonnet API for narratives. Pennies per use.
7. **Capture, don't direct.** Wraps around existing workflow, doesn't replace it.

## Integration Strategy: Skills Over Native

Instead of complex native app integrations (file watchers, JSONL parsers, Accessibility APIs), Maestro uses a **skill-based approach**:

- A `SKILL.md` file teaches AI agents how to report work to Maestro's REST API
- Agents POST summaries, artifacts, and outcomes after completing tasks
- Works with ANY agent tool (Claude Code, Codex, OpenClaw, etc.)
- Simple HTTP — no complex native integrations needed

## Stack Decision

**SvelteKit** (web app) — same stack as James Land:
- Rich UI for kanban boards, charts, data viz
- Server routes for agent API
- Accessible via Tailscale from any device
- Svelte 5 runes + Tailwind CSS 4 + Bun
- Port 3336

## Open Questions

- Should Darvis Sessions be absorbed into Maestro?
- Should goals support sub-goals / hierarchy?
- Daily view for standup prep?
- Team features for multiple users?

---

## Name Origin

**Maestro** (noun): A distinguished conductor or director of music. From Italian, meaning "master."

The maestro doesn't play instruments — they direct the orchestra, ensure every section delivers, and the audience experiences the full impact of the performance.

---

*Built with 🎩 by Darvis*
