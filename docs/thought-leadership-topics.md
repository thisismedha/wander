# Roamio — Thought Leadership & AI Literacy Topics
**For use in:** Claude Cowork (LinkedIn content pipeline)
**Last updated:** May 2026
**Source:** Built during Roamio V1 / V1.1 — all topics are grounded in shipped code, not theory.

---

## How to Use This Doc

Each topic below maps to something actually built in Roamio. Use it in Cowork to:
- Draft LinkedIn posts (one topic = one post)
- Build an AI literacy explainer series
- Write retrospective reflections after each Ship & Learn
- Develop a talk or workshop structure

Every topic has: **what it is**, **where it lives in the codebase**, and **the thought leadership angle** — the non-obvious insight worth sharing.

---

## Section 1 — AI / LLM Concepts

### 1.1 Structured Output
**What it is:** Forcing an LLM to return data in a guaranteed schema (Pydantic model) rather than free text. The model cannot hallucinate field names or return a paragraph when you need a JSON object.
**Where it lives:** `backend/services/llm.py` — `ChatVertexAI.with_structured_output()`. Models in `backend/models/itinerary.py` and `backend/models/explore.py`.
**The angle:** The LLM is not a chatbot here — it's a structured data generator. This is how AI goes from "interesting demo" to "production feature." Most people still think of LLMs as text generators. Structured output is the unlock that makes them backends.

---

### 1.2 Prompt Engineering
**What it is:** Writing system prompts and user prompts that reliably steer LLM behaviour — rules blocks, conditional instructions, explicit formatting requirements.
**Where it lives:** `backend/prompts/itinerary.py`, `backend/prompts/explore.py`.
**The angle:** Prompts are code. They have bugs, edge cases, and need versioning just like any other function. A prompt buried in a service function will rot. A prompt in its own file gets reviewed, iterated, and owned.

---

### 1.3 Conditional Prompt Branching
**What it is:** Taking different prompt paths depending on user input. The LLM receives different context and instructions based on what the user provided — same model, different behaviour.
**Where it lives:** Explore mode vs. Plan mode split; days-only path vs. exact-dates path; domestic/international scope instructions in `backend/prompts/explore.py`.
**The angle:** One model, many behaviours — controlled entirely by what you put in the prompt. This is the core leverage of LLMs. You don't need a different model for each use case — you need a different prompt.

---

### 1.4 Schema-Driven Conditional Output
**What it is:** Using `Optional` fields in the output schema so the LLM populates certain fields only when conditions are met — and leaves them null otherwise. The schema encodes product logic.
**Where it lives:**
- `best_time_to_visit` — populated on days-only path, null when exact dates given
- `trip_type` — populated only when both domestic + international requested
- `weather` on `ItineraryDay` — populated only when exact dates provided
- `visa_note`, `holiday_note` — populated only when relevant
**The angle:** In a traditional backend you'd write conditional logic to decide what to return. With structured LLM output, you encode that logic in the schema and the prompt. The model does the branching — your code just validates the result. Schema design is product design.

---

### 1.5 Multi-Turn Context (Conversational Memory)
**What it is:** Passing prior conversation history back to the LLM so it can refine previous outputs without starting from scratch. Statelessness is the default — memory is something you build.
**Where it lives:** The tweak/follow-up flow in `backend/routers/tweak.py` — full itinerary + user's refinement request sent as conversation history.
**The angle:** There is no magic memory in LLMs. "Memory" is just context you choose to re-inject. The sooner builders understand this, the sooner they stop waiting for the model to remember and start designing re-injection patterns intentionally.

---

### 1.6 Contextual Reasoning
**What it is:** Prompting the LLM to cross-reference multiple data points simultaneously — travel dates, destination climate, home country calendar — to produce a reasoned output without any external API.
**Where it lives:** Seasonal suitability rules in `backend/prompts/explore.py`. Dominican Republic in July flagged as hot/humid from LLM knowledge alone.
**The angle:** The LLM already knows things. Your job is to ask it the right question with the right context — not to feed it data it already has. Knowing when to use LLM knowledge vs. an external API is a skill most builders haven't developed yet.

---

### 1.7 Temperature as a Product Decision
**What it is:** `temperature=0` for deterministic outputs; higher values for creative variety. Not a global setting — a per-feature decision.
**Where it lives:** `backend/services/llm.py` — `itinerary_llm` at `temperature=0`, `explore_llm` at `temperature=1.0`.
**The angle:** Temperature is not a slider you set once. Consistency and creativity are in tension, and you choose which wins per use case. A trip plan should be reproducible. Destination suggestions should surprise you. Same model, two instances, two different jobs.

---

### 1.8 The Exclusion List Pattern
**What it is:** Injecting a list of already-seen outputs into the prompt to prevent repetition on refresh. No vector store, no embeddings — just a list in the prompt.
**Where it lives:** `handleExploreRefresh` in `frontend/src/app/page.tsx` → `excluded_destinations` in `backend/prompts/explore.py`.
**The angle:** Before reaching for RAG or a vector database, ask whether the problem can be solved with a list. For small, session-scoped memory, it usually can. Complexity is a cost — pay it only when the simple thing stops working.

---

### 1.9 LLM Knowledge as a Data Source
**What it is:** Using the LLM's trained knowledge of historical climate patterns instead of a live weather API — framed honestly as "typical for this time of year."
**Where it lives:** TRIP-015 — `WeatherEstimate` in `backend/models/itinerary.py`, weather rules in `backend/prompts/itinerary.py`.
**The angle:** You don't need a weather API to show weather — you need the right question and the right framing. No forecast API covers dates months ahead. LLM climate knowledge is sufficient for planning intent and requires zero external dependency. Knowing when *not* to call an API is architecture.

---

## Section 2 — SDLC & Product Topics

### 2.1 Dual-Purpose Project Design
**What it is:** Building Roamio as a working product *and* a learning vehicle with a content pipeline attached. Every feature has a LinkedIn moment baked into the definition doc before a line of code is written.
**The angle:** The best portfolio projects aren't side projects — they're systems. You designed the SDLC to produce three outputs simultaneously: working software, AI literacy, and thought leadership content. Most builders optimise for one. You optimised for all three.

---

### 2.2 Phase Gates in Solo Development
**What it is:** Discovery → Definition → Design → Build → Ship & Learn — enforced on a solo project, not a team.
**The angle:** Most solo builders collapse all phases into "I had an idea, I shipped it." Phase gates exist to prevent you from solving the wrong problem with elegant code. The discipline of *not* writing code during Definition is harder than writing the code.

---

### 2.3 Briefs Before Build
**What it is:** Every story has acceptance criteria written before implementation. `docs/definition-v1.1.md` is a full product definition document — stories, ACs, AI concepts, design decisions — for a solo project.
**The angle:** Acceptance criteria are not bureaucracy. They are the only way to know when you're done. "Done" without criteria is just "I got bored." This applies whether you're a team of one or a team of fifty.

---

### 2.4 The Dev Log as Engineering Memory
**What it is:** `docs/dev-log.md` — append-only, newest-first, read at the start of every session. Covers what was completed, what's in progress, blockers, and next session focus.
**The angle:** Git history tells you *what* changed. A dev log tells you *why* you made the call you made at 11pm on a Tuesday. Future-you is not the same person as past-you. Write it down. This is especially critical when your "team" is you plus an AI assistant across multiple sessions.

---

### 2.5 MoSCoW Prioritisation in Practice
**What it is:** Every story tagged Must / Should / Could. Used to promote, defer, and cut scope without renegotiating the whole roadmap.
**The angle:** Prioritisation frameworks only work if you use them to say no. The real skill isn't ranking features — it's defending the ranking when everything feels urgent and you're building alone.

---

### 2.6 Backlog as a Pressure Valve
**What it is:** Every new idea — dining suggestions, bucket list, multi-location itineraries — captured immediately in `docs/product-roadmap.md` and parked. None entered the sprint in progress.
**The angle:** A healthy backlog is not a to-do list. It's a place where good ideas go to wait their turn without derailing what's in flight. The discipline of *not* building something is a product skill that most engineers never develop.

---

## Section 3 — Tech Stack Topics

### 3.1 FastAPI for AI Backends
**What it is:** Async Python, Pydantic-native, minimal boilerplate. Every endpoint is thin — input validation in, structured LLM response out.
**The angle:** FastAPI + Pydantic is the natural stack for LLM backends because the same Pydantic models that validate your API inputs drive your structured LLM outputs. One schema, two jobs. The stack isn't incidental — it's load-bearing.

---

### 3.2 Next.js App Router + Tailwind
**What it is:** Server components, client components, no class components. Tailwind for all styling — no CSS files, no style props.
**The angle:** The constraint of Tailwind-only forces design decisions into classnames, which makes UI state readable in the JSX. Loading state, error state, disabled state — all visible in the same line of markup. Constraints produce clarity.

---

### 3.3 LangChain as an Abstraction Layer
**What it is:** `langchain_google_vertexai` wraps the Vertex AI SDK. `.with_structured_output()` is the one method that makes the structured output pattern work cleanly.
**The angle:** LangChain gets criticised for over-abstraction. But for a solo builder, the right abstraction is the one that lets you focus on product decisions instead of API wrangling. Know what you're trading and trade it intentionally.

---

### 3.4 Gemini 2.5 Flash — Model Selection
**What it is:** Model choice driven by cost-to-capability ratio, structured output support, and GCP ecosystem fit — not by benchmark leaderboard position.
**The angle:** Model selection is not just a benchmark question — it's a cost, latency, and integration question. Matching the model to the job means understanding your workload, not chasing the highest score on a leaderboard.

---

### 3.5 Vercel + Cloud Run Deployment Split
**What it is:** Frontend on Vercel (zero-config Next.js), backend on Cloud Run (containerised FastAPI, scales to zero).
**The angle:** The right deployment target for each layer, not one platform for everything. Vercel is optimised for Next.js; Cloud Run is optimised for containerised workloads. Matching the tool to the job is architecture. "Just put it all on one platform" is convenience, not a decision.

---

## Section 4 — Design & Architecture Topics

### 4.1 Stateless Backend by Design
**What it is:** No database, no session store. Every request carries its full context. The itinerary lives in the frontend until the user navigates away.
**The angle:** Statelessness is a feature, not a limitation. It means zero infrastructure overhead, instant scale-to-zero, and no data to lose. The right time to add persistence is when a user story actually requires it — not before. Most backends are stateful by default, not by necessity.

---

### 4.2 Prompts as a First-Class Architectural Layer
**What it is:** `backend/prompts/` is its own directory, separate from routers and services. Prompts are not strings embedded in business logic — they are a distinct layer with their own files, their own versioning, and their own review process.
**The angle:** Where you put your prompts signals how seriously you take them. A prompt buried in a service function will rot. A prompt in its own module gets treated like code — because it is code.

---

### 4.3 Optional Schema Fields as Feature Logic
**What it is:** `Optional` fields in Pydantic models encode feature conditions — what gets returned and when. The schema is not just a data contract; it's a product decision made explicit.
**The angle:** In a traditional backend, conditional responses are handled in service logic. With structured LLM output, you push that logic into the schema and prompt. The result is that product decisions are readable in the type definitions, not buried in if-statements.

---

### 4.4 Frontend State Machine
**What it is:** `appState` in `page.tsx` with explicit named states: `mode-select → plan | explore-form → explore-results → itinerary`. Each state renders exactly one view.
**The angle:** React apps without explicit state machines accumulate boolean spaghetti. `isLoading && !isError && hasData` is a state machine in denial. Name your states. The cost of naming is zero. The cost of not naming compounds with every new feature.

---

### 4.5 Two LLM Instances, One Service
**What it is:** `itinerary_llm` and `explore_llm` — same model class, different instances, different temperature, different output schemas. Configured per job, not globally.
**The angle:** Don't configure your LLM for the average use case. Configure it per call type. Determinism and creativity are not global settings — they're decisions you make per feature.

---

### 4.6 The Mode Split Architecture
**What it is:** Plan Mode and Explore Mode are separate forms, separate prompt paths, separate result views — not one form with an optional field.
**The angle:** "Destination optional" was a hidden mode split disguised as a blank field. Making the split explicit in the UI clarified the product, simplified the code, and made the AI behaviour easier to reason about. Naming the thing is the first design decision.

---

## Coming Up (Future LinkedIn Content from Roadmap)

| Topic | When | AI Concept |
|---|---|---|
| Function calling / Tool use | V2 — flights, hotels, activity APIs | LLM decides when to call an external API |
| RAG (Retrieval-Augmented Generation) | V3 — trip memory, personalisation | Past trips as embeddings, retrieved at prompt time |
| Multi-user context | V3 — group trips | LLM reasoning across multiple people's preferences |
| Agents | V2/V3 | LLM orchestrating multi-step actions autonomously |

---

*Feed this doc into Claude Cowork to draft posts, explainers, or a talk structure.*
*Update after each Ship & Learn with new topics as they ship.*
*Owned in Cowork. Source of truth lives here in the repo.*
