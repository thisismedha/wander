# Trip Planner MVP — Definition Output
**Phase:** 2 — Definition  
**Status:** Complete  
**Date:** May 2026  
**Depends on:** discovery-mvp.md  

---

## 1. Epics

| Epic ID | Name | Description | Personas |
|---|---|---|---|
| EPIC-01 | Trip Input Collection | Capture all user context needed to generate a meaningful itinerary | James, Priya, Amara |
| EPIC-02 | Itinerary Generation | Produce a structured, personalised day-by-day trip plan via LLM | James, Priya, Amara |
| EPIC-03 | Explore Mode | Guide users who arrive without a destination to one via AI suggestions | Priya, Amara |
| EPIC-04 | Itinerary Tweaking | Allow users to refine, adjust, or regenerate parts of their plan via follow-up prompts | James, Priya |
| EPIC-05 | Export & Save | Let users take their itinerary out of the app | Priya, James |

---

## 2. User Stories

### EPIC-01 — Trip Input Collection

---

**Story ID:** TRIP-001  
**Title:** Core trip inputs  
**Priority:** Must  
**Effort:** M  

As **James** (Destination-Locked Weekend Tripper), I want to enter my destination, travel duration, travel style, and budget so that the app has enough context to generate a relevant, personalised itinerary.

**Acceptance Criteria:**
- [ ] Given I open the app, when the input form loads, then I see fields for: destination, travel duration (days or date range), travel style (selectable options), and budget tier (selectable options)
- [ ] Given I enter a destination and travel duration, when I submit the form, then the app accepts both "7 days" and "June 10–17" as valid duration inputs
- [ ] Given I submit with all Must Have fields filled, when the form validates, then the app proceeds to itinerary generation
- [ ] Given I submit with one or more Must Have fields empty, when the form validates, then I see a clear inline error indicating which fields are required
- [ ] Given I select a travel style, when the itinerary is generated, then the style is meaningfully reflected in the activity selection and pacing

**AI Concept Involved:** Prompt engineering — user inputs are translated into a structured system prompt that instructs the LLM how to behave.  
**Learning Note:** The input form isn't just UX — it's prompt construction. Each field maps directly to a constraint or instruction in the LLM prompt. Well-designed inputs = well-constrained outputs.

---

**Story ID:** TRIP-002  
**Title:** Optional destination (Explore Mode trigger)  
**Priority:** Should  
**Effort:** M  

As **Priya** (Busy Professional Planner), I want to leave the destination field blank so that the app enters Explore Mode and suggests destinations based on my other preferences.

**Acceptance Criteria:**
- [ ] Given the destination field is blank, when I submit the form, then the app enters Explore Mode (not an error state)
- [ ] Given I'm in Explore Mode, when the app responds, then I receive 3 destination suggestions with a brief rationale for each (why it suits my style, budget, and timing)
- [ ] Given I see destination suggestions, when I select one, then the app uses that destination to generate a full itinerary
- [ ] Given the destination field is filled, when I submit, then Explore Mode does not trigger

**AI Concept Involved:** Conditional prompt branching — two distinct prompt paths based on whether destination is provided.  
**Learning Note:** "If destination is empty → run Explore prompt. If destination is filled → run Itinerary prompt." This is prompt branching — a fundamental pattern in building multi-step AI flows.

🟦 **LinkedIn moment:** "The most interesting design decision in our trip planner was making one field optional on purpose. An empty destination doesn't mean incomplete input — it means 'I trust you to suggest something.' That single blank field required a completely different AI prompt path. This is called conditional prompt branching."

---

**Story ID:** TRIP-003  
**Title:** Nationality / visa awareness  
**Priority:** Should  
**Effort:** S  

As **Amara** (First-Time International Traveler), I want to optionally enter my passport nationality so that the app flags whether I may need a visa for my destination.

**Acceptance Criteria:**
- [ ] Given a nationality field is present in the form, when I enter my passport country, then the itinerary output includes a visa awareness note for the destination
- [ ] Given nationality is provided and a visa may be required, when the itinerary renders, then the note reads something like: "As a [nationality] passport holder, you may require a visa to enter [destination]. Please verify requirements at your country's official immigration portal before booking."
- [ ] Given nationality is not provided, when the itinerary renders, then no visa flag appears (no error, no blank section)
- [ ] Given the visa note appears, when rendered, then it is clearly marked as advisory only and does not claim to be legal or immigration advice

**AI Concept Involved:** Structured data lookup + disclaimer logic — the LLM uses its knowledge of visa regimes to generate a cautious advisory, not a definitive ruling.  
**Learning Note:** This is an example of using an LLM for "soft" data retrieval — asking it what it knows about visa requirements — combined with a hard constraint in the prompt: "always disclaim, never advise definitively."

---

### EPIC-02 — Itinerary Generation

---

**Story ID:** TRIP-004  
**Title:** Day-by-day itinerary output  
**Priority:** Must  
**Effort:** L  

As **James**, I want to receive a structured day-by-day itinerary so that I have a concrete, actionable plan for every day of my trip.

**Acceptance Criteria:**
- [ ] Given I submit valid trip inputs, when the LLM responds, then the output is a day-by-day itinerary covering every day of the requested duration
- [ ] Given the itinerary renders, when I read it, then each day includes: a day label (e.g. "Day 1"), at least 3 time slots (morning / afternoon / evening), and at least one activity per slot
- [ ] Given each activity, when it renders, then it shows: activity name, a brief description (1–3 sentences), timing slot, and a short note on why it suits the chosen travel style
- [ ] Given the travel style is "adventure," when the itinerary generates, then adventure-relevant activities (hiking, water sports, etc.) dominate over cultural/relaxation ones
- [ ] Given the budget tier is "budget," when the itinerary generates, then recommendations avoid luxury hotels and fine dining in favour of hostels, street food, and free attractions
- [ ] Given the itinerary is generated, when it renders in the UI, then it is clearly structured and scannable (not a wall of prose)

**AI Concept Involved:** Structured output — the LLM is instructed to return data in a specific, consistent schema (JSON) rather than freeform text.  
**Learning Note:** The frontend needs to render itinerary data predictably — Day 1, Day 2, each with morning/afternoon/evening slots. To get this reliably from an LLM, you define a JSON schema in the prompt and tell the model to return exactly that. This is structured output, and it's one of the most important patterns in production AI apps.

🟦 **LinkedIn moment:** "The difference between a demo and a product is structure. Anyone can ask an AI to 'plan a trip.' Making that output consistent, parseable, and correct every time — that's the engineering problem. It's called structured output, and it's one of the most important concepts in applied AI."

---

**Story ID:** TRIP-005  
**Title:** Seasonal / timing advisory  
**Priority:** Could  
**Effort:** S  

As **Priya**, I want to know whether my travel dates are good timing for my destination so that I can adjust my plans if I'm travelling in peak crowds or bad weather.

**Acceptance Criteria:**
- [ ] Given travel dates are provided (not just duration), when the itinerary generates, then a brief timing note appears indicating whether dates fall in peak, shoulder, or off-season for that destination
- [ ] Given only a duration (not fixed dates) is provided, when the itinerary generates, then no timing note appears
- [ ] Given the timing note appears, when it renders, then it is clearly marked as general guidance, not a guarantee of weather or crowd conditions

**AI Concept Involved:** Contextual reasoning — the LLM cross-references travel dates against its knowledge of destination-specific seasonality.

---

### EPIC-03 — Explore Mode

---

**Story ID:** TRIP-006  
**Title:** Destination suggestions in Explore Mode  
**Priority:** Should  
**Effort:** M  

As **Priya**, I want to receive 3 destination suggestions when I haven't chosen where to go so that I can pick a direction without starting a research rabbit hole.

**Acceptance Criteria:**
- [ ] Given Explore Mode triggers (destination left blank), when the LLM responds, then exactly 3 destination suggestions are returned
- [ ] Given each suggestion, when it renders, then it includes: destination name, a 2–3 sentence rationale explaining why it fits the user's style, budget, and timing
- [ ] Given I select a suggestion, when the selection is made, then the app proceeds directly to itinerary generation for that destination (no second form required)
- [ ] Given no suggestion fits, when I want a different option, then I can request 3 new suggestions without re-entering all inputs

---

### EPIC-04 — Itinerary Tweaking

---

**Story ID:** TRIP-007  
**Title:** Follow-up prompt to adjust the itinerary  
**Priority:** Must  
**Effort:** M  

As **James**, I want to send a follow-up message to swap activities, adjust pacing, or regenerate a specific day so that I can personalise the itinerary without starting from scratch.

**Acceptance Criteria:**
- [ ] Given the itinerary is displayed, when I type a follow-up message (e.g. "Replace Day 2 afternoon with something more low-key"), then the app sends that instruction to the LLM with the original itinerary as context
- [ ] Given the follow-up is processed, when the LLM responds, then only the requested portion is updated — the rest of the itinerary remains unchanged unless I asked for a full regeneration
- [ ] Given the follow-up response, when it renders, then it replaces the updated section in the displayed itinerary (not appended as a separate block)
- [ ] Given I want to start over, when I type "regenerate" or equivalent, then a fresh itinerary is generated from the original inputs
- [ ] Given the session context, when I send any follow-up, then the LLM has access to the original inputs (style, budget, destination, duration) and the current itinerary

**AI Concept Involved:** Conversational context / multi-turn prompting — the LLM needs the prior itinerary and original inputs in context to make coherent adjustments.  
**Learning Note:** A follow-up prompt isn't a standalone request — it's turn 2 of a conversation. To make adjustments that don't break the rest of the plan, the LLM needs to "see" the full itinerary it's modifying. This is multi-turn context management, and getting it right is non-trivial.

🟦 **LinkedIn moment:** "The hardest part of building a conversational AI feature isn't the AI — it's deciding what context to keep, what to discard, and how to pass it cleanly to the model. 'Swap Day 2 afternoon' is a 5-word request that requires a 2,000-token context window to execute correctly."

---

### EPIC-05 — Export & Save

---

**Story ID:** TRIP-008  
**Title:** Export itinerary  
**Priority:** Should  
**Effort:** S  

As **Priya**, I want to copy my itinerary to clipboard or download it as a PDF so that I can reference it offline, paste it into my notes app, or share it with a travel companion.

**Acceptance Criteria:**
- [ ] Given the itinerary is displayed, when I click "Copy to clipboard," then the full itinerary text is copied in a clean, readable format (not raw JSON)
- [ ] Given the itinerary is displayed, when I click "Download as PDF," then a formatted PDF is generated and downloaded with: trip title, all days and activities, and the app name/branding
- [ ] Given the PDF downloads, when I open it, then it is readable on both desktop and mobile without truncation or formatting errors

---

## 3. Definition of Done — MVP

The MVP is done when **all of the following are true**:

### Functional completeness
- [ ] All **Must Have** user stories pass their acceptance criteria (TRIP-001, TRIP-004, TRIP-007)
- [ ] The core happy path works end-to-end: input form → itinerary generation → tweaking
- [ ] The app handles both "7 days" and "June 10–17" input formats correctly

### Output quality
- [ ] 10+ itinerary outputs manually reviewed across varied destinations, styles, and budgets
- [ ] No hallucinated specific business names appear in outputs (guardrail baked into system prompt)
- [ ] Itinerary structure is consistent across all test runs (structured output schema holds)
- [ ] Follow-up prompts correctly modify only the requested section without breaking the rest

### UI & UX
- [ ] App renders correctly on desktop (mobile is a V1 concern)
- [ ] All error states are handled: empty required fields, API failure, timeout
- [ ] Itinerary is scannable and structured (not a wall of prose)

### Technical
- [ ] App deploys successfully to a public URL (Vercel or equivalent)
- [ ] API key is not exposed in the client
- [ ] Basic rate-limiting or abuse prevention in place (even if just a loading state that prevents double-submit)
- [ ] Code is pushed to GitHub with a clear README

### Out of scope for DoD (V1 concerns)
- Auth / accounts
- Mobile responsiveness
- Real-time pricing or booking links
- Performance benchmarking
- Analytics / telemetry

---

## 4. Claude Code Session Brief — Sprint 1: Core Happy Path

```
## Claude Code Session Brief — Core Happy Path (Sprint 1)

### Context
We are in Phase 4 — Build, Sprint 1 of the Trip Planner MVP.
Discovery and Definition are complete (see discovery-mvp.md and definition-mvp.md).
This sprint delivers the end-to-end core happy path: user fills in trip details →
receives a structured day-by-day itinerary → can send a follow-up to adjust it.

No auth, no accounts, no database. Stateless, single-session app.

The LLM layer uses Google Vertex AI (Gemini 2.5 Flash) via LangChain, authenticated 
via a GCP service account JSON file. The app is split into a Python FastAPI backend 
(handles all LLM calls) and a Next.js frontend (UI only).

### Objective
Build a working web app that:
1. Presents an input form for trip details (Next.js frontend)
2. Sends those inputs to the FastAPI backend, which constructs and dispatches a prompt
3. Receives a structured Pydantic-validated itinerary response from Gemini 2.5 Flash
4. Renders the itinerary in a clean, scannable UI
5. Accepts a follow-up prompt to modify the itinerary, passing full context to the backend

### Acceptance Criteria
- [ ] Input form captures: destination (optional), travel duration (days OR date range),
      travel style (dropdown: adventure / cultural / relaxation / foodie / budget backpacker / luxury),
      budget tier (dropdown: budget / mid-range / luxury)
- [ ] Submitting the form calls POST /generate on the FastAPI backend
- [ ] The backend calls Vertex AI (Gemini 2.5 Flash) using LangChain with structured output
- [ ] The response is a validated Pydantic object matching the itinerary schema below
- [ ] The itinerary renders in the UI as a day-by-day view with morning/afternoon/evening slots
- [ ] A follow-up input field is visible after the itinerary renders
- [ ] Submitting a follow-up calls POST /tweak, passing original inputs + full current itinerary + instruction
- [ ] The response updates the itinerary in place in the UI
- [ ] Empty required fields show inline validation errors (destination is optional;
      duration, style, budget are required)
- [ ] API errors and timeouts show a user-friendly error state with a retry option

### Tech Stack
- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Python FastAPI
- **LLM:** Google Vertex AI — Gemini 2.5 Flash via `langchain_google_vertexai.ChatVertexAI`
- **Structured output:** LangChain `.with_structured_output()` with Pydantic models
- **Auth:** GCP service account JSON file (`GOOGLE_APPLICATION_CREDENTIALS` env var)
- **Frontend deployment:** Vercel (`NEXT_PUBLIC_API_URL` points to backend)
- **Backend deployment:** Google Cloud Run (natural fit for Vertex AI auth)

### Credentials & Environment Variables

Backend `.env`:
```
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
GCP_PROJECT_ID=your-project-id
GCP_LOCATION=us-central1
```

Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000   # replace with Cloud Run URL in production
```

**Important:** `service-account.json` must be added to `.gitignore` immediately.
Never commit GCP credentials to source control.

### Itinerary Pydantic Schema (backend/models/itinerary.py)
Use LangChain's `.with_structured_output()` — pass this Pydantic model to enforce 
the schema at the LangChain layer, not via raw prompt instructions:

```python
from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class ActivitySlot(BaseModel):
    time_of_day: Literal["morning", "afternoon", "evening"]
    activity_name: str
    description: str = Field(..., description="1-3 sentence description of the activity")
    style_fit: str = Field(..., description="One sentence: why this suits the travel style")

class ItineraryDay(BaseModel):
    day_number: int
    date_label: str = Field(..., description="e.g. 'Day 1' or 'Monday, June 10'")
    slots: List[ActivitySlot]

class Itinerary(BaseModel):
    destination: str
    duration_days: int
    travel_style: str
    budget_tier: str
    days: List[ItineraryDay]
    visa_note: Optional[str] = Field(
        None,
        description="Advisory visa note if nationality provided, else null"
    )
```

### LLM Service Setup (backend/services/llm.py)
Mirror the pattern from the existing codebase:

```python
from typing import Optional
import os
import vertexai
from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from google.oauth2 import service_account
from dotenv import load_dotenv
from backend.models.itinerary import Itinerary

load_dotenv()

_credentials = service_account.Credentials.from_service_account_file(
    os.getenv("GOOGLE_APPLICATION_CREDENTIALS"),
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)
vertexai.init(
    project=os.getenv("GCP_PROJECT_ID"),
    location=os.getenv("GCP_LOCATION", "us-central1"),
    credentials=_credentials,
)

class ItineraryService:
    def __init__(self, model: str = "gemini-2.5-flash"):
        llm = ChatVertexAI(
            model_name=model,
            temperature=0,
            project=os.getenv("GCP_PROJECT_ID"),
            location=os.getenv("GCP_LOCATION", "us-central1"),
            credentials=_credentials,
        )
        self.structured_llm = llm.with_structured_output(Itinerary)

    async def generate(self, destination: Optional[str], duration: str,
                       style: str, budget: str, nationality: Optional[str]) -> Itinerary:
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", build_user_prompt(destination, duration, style, budget, nationality))
        ])
        chain = prompt | self.structured_llm
        return await chain.ainvoke({})

    async def tweak(self, current_itinerary: Itinerary,
                    original_inputs: dict, instruction: str) -> Itinerary:
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", build_tweak_prompt(current_itinerary, original_inputs, instruction))
        ])
        chain = prompt | self.structured_llm
        return await chain.ainvoke({})
```

### System Prompt (backend/prompts/itinerary.py)

```python
SYSTEM_PROMPT = """
You are a world-class travel planner. Generate day-by-day itineraries that are
practical, well-paced, and genuinely personalised to the traveller's style and budget.

Rules:
- Do not invent specific restaurant or hotel names unless they are well-known landmarks.
  Prefer describing the type of place (e.g. "a rooftop bar in the Marais district").
- Tailor activity selection and pacing precisely to the travel style.
- Tailor accommodation type, dining, and activities to the budget tier.
- If travel dates are provided (not just a number of days), use them as day labels.
- If nationality is provided, include a brief visa advisory. Always disclaim:
  advisory only — verify with official immigration sources before booking.
- If nationality is not provided, set visa_note to null.
"""

def build_user_prompt(destination, duration, style, budget, nationality):
    dest_str = destination if destination else "not specified — suggest a suitable destination"
    nat_str = f"Passport nationality: {nationality}" if nationality else "Nationality: not provided"
    return f"""
Destination: {dest_str}
Travel duration: {duration}
Travel style: {style}
Budget tier: {budget}
{nat_str}

Generate the itinerary.
"""

def build_tweak_prompt(current_itinerary, original_inputs, instruction):
    return f"""
Original trip inputs: {original_inputs}

Current itinerary:
{current_itinerary.model_dump_json(indent=2)}

The traveller wants to make the following change:
"{instruction}"

Return an updated itinerary applying only the requested change.
Keep all other days and activities exactly as they are.
"""
```

### FastAPI Routes (backend/main.py + routers/)

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import generate, tweak

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(generate.router)
app.include_router(tweak.router)

# backend/routers/generate.py
# POST /generate  — accepts TripInputs, returns Itinerary JSON

# backend/routers/tweak.py  
# POST /tweak  — accepts TweakRequest (currentItinerary + originalInputs + instruction),
#                returns updated Itinerary JSON
```

### AI Concept Being Implemented
**Structured output** — using LangChain's `.with_structured_output(Pydantic model)` to
enforce a strict response schema at the framework layer, not via prompt instructions alone.
This is more reliable than asking the model to "return JSON" in the prompt.

**Learning Note:** There are two ways to get structured output from an LLM:
(1) Ask nicely in the prompt ("return JSON matching this schema") — fragile.
(2) Use a framework like LangChain to bind a Pydantic schema to the model call — reliable.
We're doing (2). The model's output is automatically validated and parsed into a typed
Python object. If the model returns malformed output, LangChain raises an error immediately.

🟦 **LinkedIn moment:** "I started this project planning to use Claude. I switched to
Gemini via Vertex AI. Know what changed? One import. The system prompt stayed identical.
The Pydantic schema stayed identical. The LangChain chain stayed identical. This is what
LLM provider agnosticism looks like in practice — and it's one of the best arguments for
building on a framework layer rather than calling model APIs directly."

**Multi-turn context management** — the full current itinerary + original inputs are
passed back to the model on every follow-up, giving it the context to make targeted edits.

### Files to Create
```
trip-planner/
├── README.md
├── service-account.json          # GCP credentials (GITIGNORED — never commit)
├── .gitignore                    # Must include: service-account.json, .env, __pycache__
│
├── backend/                      # Python FastAPI
│   ├── main.py                   # FastAPI app, CORS, router registration
│   ├── routers/
│   │   ├── generate.py           # POST /generate
│   │   └── tweak.py              # POST /tweak
│   ├── services/
│   │   └── llm.py                # Vertex AI + LangChain setup (ItineraryService)
│   ├── prompts/
│   │   └── itinerary.py          # SYSTEM_PROMPT, build_user_prompt, build_tweak_prompt
│   ├── models/
│   │   └── itinerary.py          # Pydantic models: ActivitySlot, ItineraryDay, Itinerary
│   ├── requirements.txt          # fastapi, uvicorn, langchain-google-vertexai,
│   │                             # google-cloud-aiplatform, pydantic, python-dotenv
│   └── .env                      # GOOGLE_APPLICATION_CREDENTIALS, GCP_PROJECT_ID, GCP_LOCATION
│
├── frontend/                     # Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Main UI: input form + itinerary view
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── TripInputForm.tsx  # Input form component
│   │   │   ├── ItineraryView.tsx  # Renders structured itinerary
│   │   │   ├── DayCard.tsx        # Single day card
│   │   │   └── TweakInput.tsx     # Follow-up prompt input
│   │   └── types/
│   │       └── itinerary.ts       # TypeScript types mirroring the Pydantic schema
│   ├── package.json
│   └── .env.local                 # NEXT_PUBLIC_API_URL=http://localhost:8000
│
└── .github/
    └── workflows/                 # CI placeholder (empty for now)
```

### Local Development
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev   # runs on localhost:3000, calls localhost:8000
```

### Definition of Done for This Sprint
- [ ] Input form renders and validates correctly
- [ ] Submitting the form calls POST /generate and returns a real itinerary from Gemini
- [ ] Itinerary renders as structured day cards (not raw JSON)
- [ ] Follow-up input appears after itinerary renders
- [ ] POST /tweak modifies the itinerary in place
- [ ] service-account.json is gitignored and never committed
- [ ] Backend runs locally with `uvicorn main:app --reload`
- [ ] Frontend runs locally with `npm run dev`
- [ ] Code pushed to GitHub (with .gitignore verified before first push)
```

---

## 5. Sprint 2 Preview (not yet scoped — for Definition Phase review)

Sprint 2 will pick up the **Should Have** stories once Sprint 1 ships:

- TRIP-002: Explore Mode (conditional prompt branching)
- TRIP-003: Nationality / visa flag
- TRIP-008: Export to PDF / clipboard

Sprint 2 will also introduce the first new AI concept: **conditional prompt branching** — routing to different prompt paths based on user input.

---

## 6. Decision Log Updates

| Decision | Rationale | Alternatives Considered | Date |
|---|---|---|---|
| LLM: Vertex AI (Gemini 2.5 Flash) via LangChain | Existing GCP credentials + service account in place; LangChain abstracts provider so swap to another model later is trivial | Anthropic Claude API directly; OpenAI API | May 2026 |
| Architecture: Python FastAPI backend + Next.js frontend | LangChain + Pydantic are Python-native; cleaner to keep LLM logic in Python than force it through Next.js Route Handlers | Next.js Route Handlers calling Vertex AI (no Python SDK for Node); single Python app with Jinja2 templates | May 2026 |
| Structured output via LangChain `.with_structured_output()` | Framework-level schema enforcement is more reliable than asking the model to "return JSON" in the prompt | Raw JSON instruction in system prompt (fragile); manual parsing with try/except | May 2026 |
| Backend deployment: Cloud Run | Natural auth fit — Cloud Run can use the same service account; no credential management complexity | Railway (no native GCP auth); Fly.io (same concern) | May 2026 |
| Frontend deployment: Vercel | Fast, zero-config Next.js deployment; `NEXT_PUBLIC_API_URL` env var points to Cloud Run backend | Cloud Run for both (more complex); single monolith (loses separation of concerns) | May 2026 |
| Sprint 1 scope = core happy path only | De-risks the build by proving the core loop works before adding Explore Mode complexity | Build everything in one sprint (scope risk) | May 2026 |

---

## 7. AI Concepts Log (updated)

| Concept | Plain English | Where It Appears |
|---|---|---|
| **Structured output** | Instructing the LLM to return data in a specific JSON schema | TRIP-004: itinerary generation — schema enforced via system prompt |
| **Prompt engineering** | Writing precise instructions to an LLM that reliably produce the desired output | All stories — every input maps to a prompt constraint |
| **Conditional prompt branching** | Different prompt logic fires based on user input (destination given vs. blank) | TRIP-002: Explore Mode — two distinct prompt paths |
| **Multi-turn context management** | Passing prior conversation history + current state back to the LLM on follow-up | TRIP-007: itinerary tweaking — original inputs + itinerary in context |
| **Contextual reasoning** | LLM cross-referencing multiple pieces of context to produce smarter output | TRIP-003: visa flag; TRIP-005: seasonal advisory |

---

*Phase 2 — Definition: Complete*  
*Next phase: Design (system architecture, data model, UX flows)*  
*Sprint 1 brief: ready to hand to Claude Code*  
*Last updated: May 2026*
