# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the **OpenClaw Workspace** - a personal AI assistant workspace containing multiple sub-projects and skills. It serves as the "home" environment for Claude Code instances with agent identity management, memory persistence, and specialized tools.

## Key Files to Read First

On every session start, read these files (in this order):

1. `SOUL.md` - AI personality and core values
2. `USER.md` - User profile (may be empty template)
3. `AGENTS.md` - Agent behavior guidelines and workspace conventions
4. `memory/YYYY-MM-DD.md` - Today's memory file for recent context
5. `HEARTBEAT.md` - Periodic task checklist

Only read `MEMORY.md` in main sessions (direct chats with the user), not in shared contexts.

## Project Structure

```
/Users/xxw_zht/work/code/openclaw-workspace/
├── AGENTS.md              # Agent behavior guidelines
├── SOUL.md               # AI personality/core values
├── USER.md               # User profile
├── HEARTBEAT.md          # Periodic task checklist
├── MEMORY.md             # Long-term memory (main sessions only)
├── memory/               # Daily memory logs
│   ├── YYYY-MM-DD.md
│   └── heartbeat-state.json
├── kids-habit-app/       # WeChat Mini Program (儿童习惯养成)
├── stock-market-pro/     # Python stock analysis toolkit
└── skills/
    ├── searxng/          # Privacy-focused web search
    └── frontend-slides-cn/  # Chinese HTML presentation generator
```

## Skills

Skills are self-contained tools with their own documentation in `SKILL.md` files.

### SearXNG Search (`skills/searxng/`)

Privacy-focused web search using a local SearXNG instance.

**Usage:**
```bash
# Requires SEARXNG_URL environment variable
uv run skills/searxng/scripts/searxng.py search "query"
uv run skills/searxng/scripts/searxng.py search "query" --category images -n 20
```

**Categories:** general, images, videos, news, map, music, files, it, science

### Stock Market Pro (`stock-market-pro/`)

Yahoo Finance powered stock analysis with charts and indicators.

**Usage:**
```bash
# Price quote
uv run --script stock-market-pro/scripts/yf.py price TSLA

# Pro chart with indicators
uv run --script stock-market-pro/scripts/yf.py pro AAPL 6mo --rsi --macd --bb

# Full report
uv run --script stock-market-pro/scripts/yf.py report NVDA 6mo
```

**Indicators:** --rsi, --macd, --bb (Bollinger Bands), --vwap, --atr

### Frontend Slides CN (`skills/frontend-slides-cn/`)

Chinese-optimized HTML presentation generator with PDF export.

**Features:**
- Zero-dependency HTML slides with animations
- PDF export via browser print
- Data visualization (bar/pie/line charts)
- Chinese font optimization (Noto Sans SC)

## Kids Habit App (`kids-habit-app/`)

WeChat Mini Program (微信小程序) for children's habit tracking with gamification.

**Tech Stack:**
- WeChat native development (WXML + WXSS + JavaScript)
- WeChat Cloud Development (云开发) for backend
- Cloud functions in `cloud/login/`

**Development:**
- Use WeChat Developer Tools (微信开发者工具)
- No npm build process (native WeChat development)
- Deploy cloud functions via WeChat IDE

**Database Collections:**
- `users` - User data
- `tasks` - Task data
- `rewards` - Reward data
- `exchanges` - Exchange records
- `achievements` - Achievement badges

## Common Commands

### Python Scripts (using `uv`)

All Python scripts use `uv` for dependency management with inline PEP 723 declarations:

```bash
# Run a script with auto-installed dependencies
uv run --script scripts/yf.py price TSLA

# SearXNG search
uv run skills/searxng/scripts/searxng.py search "query"
```

### PDF Generation

```bash
# Convert HTML to PDF using Puppeteer
node generate-pdf.js
```

Note: The generate-pdf.js script is hardcoded to process `openclaw-intro.html`.

### Weibo Hot Topics

```bash
# Fetch Weibo hot topics
python3 get_weibo_hot.py
python3 latest_hot.py
```

## Memory System

The workspace uses a two-tier memory system:

1. **Daily Notes:** `memory/YYYY-MM-DD.md` - Raw logs of daily activities
2. **Long-term Memory:** `MEMORY.md` - Curated important information

**Heartbeat State:** `memory/heartbeat-state.json` tracks last check times for periodic tasks (weibo, weather, email, calendar).

## Agent Conventions

From `AGENTS.md`:

- Write significant events to memory files - "mental notes" don't survive restarts
- Use `trash` instead of `rm` for recoverable deletion
- Ask before sending emails, tweets, or any external communications
- In group chats: respond when directly mentioned or when adding genuine value; use reactions (👍, ❤️) for simple acknowledgments
- During heartbeats: check email, calendar, weather; update MEMORY.md periodically with distilled learnings from daily notes

## Heartbeat Tasks

When receiving a heartbeat poll, check `HEARTBEAT.md` for the current checklist. Typical tasks include:

- Weibo hot topics (every 2 hours)
- Email check
- Calendar event reminders (upcoming <2h)
- Weather updates

Track checks in `memory/heartbeat-state.json` to avoid redundant checks.

## Git Workflow

- Main branch: `main`
- Claude Code has permissions for git checkout, push, and GitHub CLI operations
- No pre-commit hooks or CI/CD detected

## Important Notes

- **No test framework** - This is a personal workspace without automated tests
- **No linting/formatting config** - Code style is manually maintained
- **Chinese language focus** - Many projects are Chinese-language focused (微博热搜, 儿童习惯小程序, 中文演示文稿)
- **Security:** Private data stays private; don't exfiltrate user data
