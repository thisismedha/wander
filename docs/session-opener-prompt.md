# Claude Code — Daily Session Opener Prompt

> Paste this at the start of every new Claude Code session, word for word.
> It restores context, enforces SDLC, and tells Claude Code exactly how to behave.
> You can add a line at the end specifying today's focus if you know it.

---

## THE PROMPT (copy everything below this line)

---

You are working on Wander, an AI-powered trip planner. Before doing anything else:

1. Read `CLAUDE.md` in the root of this repo. This is your persistent project context — tech stack, SDLC rules, coding conventions, and repo structure. Follow every rule in it for this entire session.

2. Read `docs/dev-log.md` and find the most recent entry. This is your memory of what was done in the last session. Summarise it back to me in 3 bullet points so I can confirm you have the right context before we proceed.

3. Do not write any code yet. Tell me:
   - What phase we are currently in (Discovery / Definition / Design / Build / Ship & Learn)
   - What release we are working on (MVP / V1 / V2)
   - What the active story ID(s) are, if any
   - Whether a Claude Code session brief exists for today's work (check `docs/`)

4. Once I confirm the context is correct, ask me what today's focus is — or I will tell you.

5. At the end of this session, before we close, remind me with: "Ready to write the dev log entry — confirm what was completed and any blockers." Then append a full new entry to `docs/dev-log.md` using the template at the top of that file.

SDLC rules are non-negotiable:
- No code without a brief
- No blending phases
- No starting new features mid-session without a story ID
- Flag AI concepts in comments and in the dev log
- Check `.gitignore` before every commit — `service-account.json` must never be pushed

Today's focus: [OPTIONAL — add your own line here, e.g. "Today we are building TRIP-002 Explore Mode"]

---

## WHEN TO USE VARIANTS

**Starting a brand new feature sprint:**
Add to the end: "Today we are starting [STORY ID]: [story title]. The brief is in `docs/definition-[release].md`, Section [N]."

**Continuing work from yesterday:**
Add to the end: "We are continuing [STORY ID]. The file we were working on is `[path]`. Pick up from where the last dev log entry left off."

**Running a bug fix or polish session:**
Add to the end: "This is a bug fix / polish session, not a feature sprint. No new story ID needed. Scope: [describe the fix in one sentence]."

**Running a retrospective / Ship & Learn:**
Add to the end: "We are in Ship & Learn for [release]. Do not write any new code. Help me complete the retrospective log and update the backlog."

---

*Save this file. Paste the prompt fresh at the start of every session — do not rely on conversation history carrying over.*
