# CLAUDE.md — Trip Planner (Roamio) Persistent Context

> This file is read automatically by Claude Code at the start of every session.
> Do not delete or rename it. Keep it updated as the project evolves.

---

## Project Overview

**Name:** Roamio (working title)
**What it is:** An AI-powered trip planner that takes a user's context (destination, duration, style, budget) and returns a structured, personalised day-by-day itinerary. Users can refine via follow-up prompts.
**Status:** MVP complete. Now iterating through V1.
**Dual purpose:** Learning vehicle for AI/engineering concepts + content pipeline for LinkedIn.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Backend | Python FastAPI |
| LLM | Google Vertex AI — Gemini 2.5 Flash |
| LLM Framework | LangChain (`langchain_google_vertexai`) |
| Structured Output | LangChain `.with_structured_output()` + Pydantic |
| Auth | GCP service account JSON (`GOOGLE_APPLICATION_CREDENTIALS`) |
| Frontend deployment | Vercel |
| Backend deployment | Google Cloud Run |
| Version control | GitHub |

---

## Repo Structure

```
trip-planner/
├── CLAUDE.md                     # ← you are here (read at every session start)
├── docs/
│   ├── dev-log.md                # Daily session log — read this before every session
│   ├── discovery-mvp.md          # Phase 1 output — personas, assumptions, problem statement
│   ├── definition-mvp.md         # Phase 2 output — epics, stories, ACs, Sprint briefs
│   └── decisions/                # One file per significant architectural decision
├── backend/
│   ├── main.py
│   ├── routers/
│   ├── services/llm.py
│   ├── prompts/itinerary.py
│   ├── models/itinerary.py
│   └── requirements.txt
├── frontend/
│   ├── src/app/
│   ├── src/components/
│   └── src/types/
└── .gitignore                    # service-account.json, .env, __pycache__, .DS_Store
```

---

## SDLC Rules — Follow These Every Session

These are non-negotiable. Do not skip phases or blend them.

### 1. Never write code without a brief
Every piece of new functionality must have a Claude Code session brief before implementation begins. Briefs live in `docs/definition-*.md`. If no brief exists for the work being requested, say so and ask for one before proceeding.

### 2. Respect phase gates
- **Discovery** → understand the problem. Do not spec features.
- **Definition** → write stories and acceptance criteria. Do not design solutions.
- **Design** → decide architecture. Do not write production code.
- **Build** → execute the brief. Do not re-litigate decisions made in earlier phases.
- **Ship & Learn** → reflect and feed back. Do not start new features mid-retrospective.

If asked to do work that belongs to a later phase, flag it: *"This looks like [phase] work — we're currently in [phase]. Should we proceed or stay in scope?"*

### 3. Read the dev log before every session
File: `docs/dev-log.md`
Read the most recent entry before writing a single line of code. This is your memory across sessions. If the log is missing or empty, tell the user before proceeding.

### 4. Update the dev log at the end of every session
Before closing, append a new entry to `docs/dev-log.md` covering:
- Date
- What was completed
- What is in progress (with file paths and exact state)
- Blockers or open questions
- Suggested next session focus

### 5. One concern per session
Don't mix feature work, bug fixes, and refactoring in the same session unless explicitly asked. Name what you're doing at the start: *"This session: [scope]. Out of scope: [what we're not touching]."*

### 6. Acceptance criteria are the definition of done
Every story has ACs in `docs/definition-mvp.md`. A story is not done until all its ACs pass. If an AC is ambiguous, flag it before implementing.

### 7. Flag AI concepts
Whenever a feature involves an AI/ML concept (structured output, RAG, embeddings, function calling, agents, etc.), name it explicitly in a comment and in the dev log. This project is a learning vehicle — concepts must be visible, not hidden in implementation.

---

## Security Rules

- `service-account.json` must never be committed. Verify `.gitignore` before every push.
- API keys and credentials live in `.env` files only — never hardcoded.
- Run `git status` before every commit and check for credential files.

---

## Coding Conventions

- Python: follow the patterns in `backend/services/llm.py` — Pydantic models, async/await, LangChain chains
- TypeScript: functional components, no class components, Tailwind for all styling
- No inline styles in the frontend
- All new backend endpoints: add to a router file, register in `main.py`
- All new Pydantic models: add to `backend/models/`
- Keep prompts in `backend/prompts/` — not embedded in service or router files

---

## Current Release

**Release:** V1 — see `docs/definition-v1.md` once created
**MVP status:** Complete
**Active sprint:** Check `docs/dev-log.md` for current sprint and story ID

---

## Key Contacts / Context

- **PM and product decisions:** handled in Claude Cowork (separate tool)
- **Briefs and specs:** written in Cowork, saved to `docs/`, executed here in Claude Code
- **LinkedIn posts and retrospectives:** drafted in Cowork after each Ship & Learn phase

---

*Last updated: May 2026 | Keep this file current — it is the single source of truth for every new session.*
