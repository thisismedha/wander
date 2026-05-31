# Roamio — Product Roadmap
**Status:** Live document — update after every Ship & Learn  
**Last updated:** May 2026  
**Horizon:** MVP (complete) → V1 → V2 → V3  

---

## Product Vision

**Roamio exists so that every type of traveller can go from trip idea to trip ready — without the planning burnout.**

For the Type A planner who wants every detail locked in, Roamio is the command centre that builds the full picture fast. For the Type B traveller who just wants to be told what to do, Roamio is the checklist that thinks for them. For everyone in between, it's the one place where scattered research, logistics, collaboration, and decisions collapse into a single, actionable plan.

---

## Personas (from Discovery)

| Persona | Type | Core need |
|---|---|---|
| **Priya** — Busy Professional, London | Type A | Synthesise research fast; no destination needed, full plan output |
| **James** — Weekend Tripper, Berlin | Leans Type B | Knows where he's going; wants a ready-made plan instantly |
| **Amara** — First-Time International, Lagos | Type B | Guided, reassuring, checklist-driven; visa/logistics awareness critical |

---

## Release Themes

| Release | Theme | One-line definition |
|---|---|---|
| **MVP** ✅ | *"Idea to itinerary in minutes"* | Prove the core loop: input context → get a personalised day-by-day plan → tweak it |
| **V1** | *"Smarter and ready to go"* | Make the itinerary more intelligent and turn it into something you can actually act on |
| **V2** | *"Your complete trip file"* | Everything you need to book, pack, and prepare — in one place |
| **V3** | *"Travel together"* | Group planning, collaboration, shared logistics, and trip memory |

---

## MVP — Complete ✅

**Theme:** Idea to itinerary in minutes

### What shipped
- Core input form: destination (optional), duration, travel style, budget
- Day-by-day itinerary via Gemini 2.5 Flash (structured output)
- Follow-up tweaking (multi-turn context)
- FastAPI backend + Next.js frontend

### Deferred to V1
- Explore Mode (destination suggestions when field left blank)
- Visa awareness flag
- Seasonal / timing advisory
- Export to PDF / clipboard

---

## V1 — Smarter and Ready to Go

**Theme:** Make the itinerary more intelligent and turn it into something you can actually act on.

**V1 is done when:** A user can arrive without a destination, get smart suggestions, see when to go, get a visa heads-up, pack from a generated list, and add the trip to their calendar — all before leaving the app.

### Epics

---

#### EPIC-V1-01: Explore Mode
*When you don't know where to go, Roamio figures it out.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-002 | As Priya, I want to leave destination blank so Roamio suggests 3 destinations with rationale | Must |
| TRIP-V1-01 | As Priya, I want to filter destination suggestions by region, flight duration, and climate | Should |

**AI concept:** Conditional prompt branching — two prompt paths depending on whether destination is provided.

---

#### EPIC-V1-02: Smart Timing
*Know when to go — and when not to.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V1-02 | As James, I want to see whether my travel dates are peak / shoulder / off-season for my destination | Must |
| TRIP-V1-03 | As Priya, I want Roamio to detect long weekends and public holidays in my home country so I can maximise annual leave | Must |
| TRIP-V1-04 | As Priya, I want to see the best and worst months to visit a destination before committing to dates | Should |

**AI concept:** Contextual reasoning — LLM cross-references travel dates, destination, and home country against seasonal and calendar knowledge.  
🟦 **LinkedIn moment:** "I built a feature that tells you when *not* to go somewhere. It required the AI to reason across three separate data points at once — your dates, the destination's season, and your home country's public holiday calendar. This is called contextual reasoning."

---

#### EPIC-V1-03: Visa & Entry Awareness
*Know what you need before you book.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-003 | As Amara, I want a visa advisory note based on my passport nationality | Must |
| TRIP-V1-05 | As Amara, I want to know if I need travel insurance for my destination | Could |

---

#### EPIC-V1-04: Packing List
*Pack smart — based on your actual itinerary.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V1-06 | As James, I want a generated packing list based on my itinerary, travel style, duration, and destination climate | Must |
| TRIP-V1-07 | As Amara, I want the packing list to include destination-specific items (SIM card advice, local cash / currency notes, adapter type) | Should |

**AI concept:** Itinerary-aware generation — the packing list prompt receives the full itinerary as context, not just the trip inputs.

---

#### EPIC-V1-05: Calendar Sync
*Your itinerary, where you already live.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V1-08 | As Priya, I want to add my trip itinerary to Google Calendar or Apple Calendar with one click | Must |
| TRIP-V1-09 | As Priya, I want each day's activities to appear as individual calendar events with descriptions | Should |

---

#### EPIC-V1-06: Export & Save
*Take your plan out of the app.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-008 | As Priya, I want to copy my itinerary to clipboard or download as PDF | Must |
| TRIP-V1-10 | As James, I want to download my itinerary as a Google Maps route I can use offline | Could |

---

## V2 — Your Complete Trip File

**Theme:** Everything you need to book, pack, and prepare — in one place.

**V2 is done when:** A user can go from itinerary to fully booked trip without leaving Roamio — flights, stays, transport, and activities all surfaced in one place. The trip file is complete: weather, insurance, granular day plans, checklists.

### Epics

---

#### EPIC-V2-01: Flights, Stays & Transport Integration
*Book it all without switching tabs.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V2-01 | As James, I want to see flight options for my trip dates directly in Roamio (via integration e.g. Skyscanner / Amadeus API) | Must |
| TRIP-V2-02 | As Priya, I want accommodation suggestions (via Booking.com / Hotels.com API) filtered to my budget tier | Must |
| TRIP-V2-03 | As James, I want car rental options surfaced for destinations where driving makes sense | Should |
| TRIP-V2-04 | As Priya, I want activity and experience tickets surfaced for activities in my itinerary (e.g. Viator / GetYourGuide) | Should |

**AI concept:** Tool use / function calling — the LLM calls external APIs as tools to retrieve live pricing and availability.  
🟦 **LinkedIn moment:** "V2 is where the app stops being a content generator and starts being an agent. Function calling lets the AI decide when to call a flight search API, when to pull hotel prices, and how to weave the results back into a coherent plan."

---

#### EPIC-V2-01b: Inline Booking Checklist
*Know what to book — and track it, right in the itinerary.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V2-11 | As Priya, I want each activity in my itinerary to show whether it needs advance booking or a reservation, so I know what to action before I go | Must |
| TRIP-V2-12 | As Priya, I want a checkbox next to each activity that requires booking so I can tick it off as I action it | Should |
| TRIP-V2-13 | As James, I want to see a summary count of how many bookings are done vs. outstanding across my whole itinerary | Could |

**Implementation notes:**
- LLM flags `booking_required: bool` and `booking_note: str | null` on each `ActivitySlot` (e.g. "Book dinner reservation at least 48hrs in advance", "Pre-purchase museum tickets to skip queues")
- Checkbox state is client-side only (no persistence in V2; localStorage or account persistence in V3)
- AI concept: schema-driven advisory — the LLM uses its knowledge of destination norms and activity type to judge whether advance booking is typically needed

🟦 **LinkedIn moment:** "The itinerary now tells you not just *what* to do, but *what to book*. The LLM flags advance booking requirements based on its knowledge of each activity type and destination — another example of turning unstructured knowledge into a structured, actionable output."

---

#### EPIC-V2-02: Granular Day Planning
*From high-level to minute-by-minute.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V2-05 | As Priya, I want to drill into any activity and get a granular plan: exact address, transport from previous location, time to leave, duration | Must |
| TRIP-V2-06 | As James, I want walking / transport directions between activities embedded in the itinerary | Should |

---

#### EPIC-V2-03: Weather Intelligence
*Don't get caught out.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V2-07 | As James, I want weather forecasts for my travel dates shown alongside the itinerary | Must |
| TRIP-V2-08 | As James, I want weather-aware activity suggestions (e.g. indoor alternatives flagged if rain likely) | Could |

---

#### EPIC-V2-04: Trip Checklist
*The Type B experience.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V2-09 | As Amara, I want a master pre-trip checklist: visa, insurance, flights, accommodation, currency, SIM, vaccinations, travel adapter | Must |
| TRIP-V2-10 | As Amara, I want to tick items off the checklist and see my trip readiness as a progress score | Should |

---

## V3 — Travel Together

**Theme:** Group planning, shared logistics, collaboration, and trip memory.

**V3 is done when:** A group of travellers can plan a trip together in Roamio — one person starts the itinerary, others join, activities get assigned, costs get split, and the whole trip gets remembered in a gallery.

### Epics

---

#### EPIC-V3-01: Group Trips & Collaboration
*Plan with your people.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V3-01 | As Priya, I want to create a trip group and invite others via link | Must |
| TRIP-V3-02 | As Priya, I want group members to suggest activities and vote on the itinerary | Must |
| TRIP-V3-03 | As James, I want to assign specific activities to specific group members | Should |
| TRIP-V3-04 | As Priya, I want to see all group members' availability overlaid on the trip dates | Could |

**AI concept:** Multi-user context — the LLM needs to reason across multiple people's preferences simultaneously.

---

#### EPIC-V3-02: Expense Splitting
*No awkward conversations about money.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V3-05 | As James, I want to log shared trip expenses and split them across group members | Must |
| TRIP-V3-06 | As James, I want a summary of who owes what at the end of the trip | Must |

---

#### EPIC-V3-03: Alerts & Notifications
*Stay ahead of the trip.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V3-07 | As Priya, I want price drop alerts for flights and hotels I've saved | Must |
| TRIP-V3-08 | As Amara, I want reminders as my trip approaches (visa application deadline, check-in opens, travel insurance reminder) | Must |
| TRIP-V3-09 | As James, I want weather alerts if conditions change significantly in the days before travel | Should |

---

#### EPIC-V3-04: Trip Gallery & Memory
*Remember every trip.*

| Story ID | Story | Priority |
|---|---|---|
| TRIP-V3-10 | As Priya, I want to upload photos to a trip gallery organised by day and activity | Should |
| TRIP-V3-11 | As Priya, I want past trips stored so Roamio can personalise future suggestions based on where I've been | Could |

**AI concept:** RAG (Retrieval-Augmented Generation) — past trip data stored as embeddings, retrieved at prompt time to personalise new itineraries.  
🟦 **LinkedIn moment:** "V3 is where Roamio stops being stateless. It starts to remember you. This is RAG — the AI retrieves your past trips as context before generating your next one. Same destination, different experience, because it knows you've already done the tourist trail."

---

## Backlog (Unassigned Ideas)

Ideas captured but not yet assigned to a release. Review at each backlog refinement.

| Idea | Notes |
|---|---|
| SIM card recommendations by destination | Could fold into V1 packing list (TRIP-V1-07) |
| Insurance comparison / recommendations | V1 or V2 depending on API availability |
| Offline Google Maps download for itinerary route | V1 Could or V2 |
| Trip readiness score / progress tracker | V2 (tied to checklist epic) |
| AI that learns your travel style over time | V3+ (needs user accounts first — V2 concern) |
| Inline booking checklist per activity | Assigned to V2 EPIC-V2-01b (TRIP-V2-11/12/13). LLM flags booking_required + booking_note on each ActivitySlot; checkbox state client-side; summary count optional. |
| Multi-location itinerary (trip clubbing) | V2+. User can combine multiple destinations into one itinerary (e.g. Tokyo + Kyoto + Osaka). Requires itinerary stitching logic, inter-city transport days, and per-city day allocation. Potentially a new "multi-city" mode on the Plan form. |

---

## What's Locked vs. Flexible

| Layer | Locked? | Changes when? |
|---|---|---|
| Product Vision | Yes — rarely changes | Only if the target user or core problem fundamentally shifts |
| Release Themes | Semi-locked | Revisit at Ship & Learn; can evolve based on user feedback |
| Epics | Flexible | Reprioritised at each backlog refinement |
| Stories | Very flexible | Added, rewritten, cut every sprint |
| Sprint scope | Locked once started | Never mid-sprint; adjust in next sprint planning |

---

## New Idea Protocol

When a new feature idea comes up:

1. **Capture it immediately** — add to the Backlog table above with a one-line note
2. **Don't touch the current sprint** — new ideas never enter a sprint in progress
3. **Evaluate at next refinement** — does it fit an existing epic? Does it warrant a new one? Which release?
4. **MoSCoW it** — Must / Should / Could / Won't relative to the release it's assigned to
5. **Write a story** — only then does it become buildable work

---

## AI Literacy Arc

| Release | Concept | Where |
|---|---|---|
| MVP ✅ | Structured output, Prompt engineering, Multi-turn context | Itinerary generation, tweaking |
| V1 | Conditional prompt branching, Contextual reasoning, Itinerary-aware generation | Explore Mode, smart timing, packing list |
| V2 | Function calling / Tool use | Flight, hotel, activity integrations |
| V3 | RAG, Multi-user context, Embeddings | Trip memory, group preferences |

---

*This is a living document. Update the release status, backlog, and themes after every Ship & Learn session.*  
*Owned in Claude Cowork. Briefs executed in Claude Code.*  
*Last updated: May 2026*
