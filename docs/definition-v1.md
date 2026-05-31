# Roamio V1 — Definition Output
**Phase:** 2 — Definition
**Status:** Complete
**Date:** May 2026
**Depends on:** definition-mvp.md (MVP stories TRIP-001 through TRIP-008)

---

## 1. Epics

| Epic ID | Name | Description | Stories |
|---|---|---|---|
| EPIC-06 | Traveller Context | Enrich the input layer so the LLM has richer personal context to personalise the itinerary | TRIP-009, TRIP-010 |
| EPIC-07 | Date Intelligence | Replace free-text duration with a structured dual-field input that integrates with holiday awareness | TRIP-011 |

---

## 2. User Stories

---

### EPIC-06 — Traveller Context

---

**Story ID:** TRIP-009
**Title:** Home base + domestic/international filter
**Priority:** Must (V1)
**Effort:** M

As **Priya** (Busy Professional Planner), I want to enter my home city so that the app can suggest relevant destinations in Explore Mode, frame my itinerary with the right transport assumptions, flag public holidays during my travel window, and surface visa information using my home country.

**Design decisions (Phase 3 — locked):**
- Home base: city-level autocomplete field (plain text input acceptable in V1; full autocomplete is an enhancement)
- Domestic/international: **two checkboxes** (not a toggle) — only visible in Explore Mode when home base is filled
- On the known-destination path: domestic vs. international is **auto-derived** (same country as home base = domestic; different country = international) — no manual selection needed
- Form layout: single-column, consistent with existing form

**Acceptance Criteria:**

**Home base field (all paths)**
- [ ] Given I open the input form, when it loads, then I see a "Home base" city text field (autocomplete in V1 if feasible; plain text otherwise)
- [ ] Given home base is not entered, when the form submits, then no domestic/international filtering, no holiday note, and no home-country visa proxy — behaviour is identical to MVP

**Explore Mode path (destination blank + home base filled)**
- [ ] Given I leave destination blank and fill in home base, when the Explore Mode view loads, then I see two checkboxes: "Domestic" and "International" (both unchecked by default)
- [ ] Given I check "Domestic" only, when destination suggestions generate, then all 3 suggestions are within my home country
- [ ] Given I check "International" only, when destination suggestions generate, then all 3 suggestions are outside my home country
- [ ] Given I check both "Domestic" and "International," when destination suggestions generate, then the 3 suggestions include a mix of domestic and international destinations
- [ ] Given neither checkbox is checked, when destination suggestions generate, then suggestions default to international (same as MVP Explore Mode)
- [ ] Given home base is empty, when the form is in Explore Mode, then the domestic/international checkboxes are not shown

**Known-destination path (destination filled + home base filled)**
- [ ] Given destination and home base are both filled, when the itinerary generates, then the app auto-derives domestic/international: same country as home base = domestic framing; different country = international framing
- [ ] Given auto-derived domestic, when the itinerary generates, then the itinerary references surface travel options (train, drive, coach) rather than assuming flights
- [ ] Given auto-derived international, when the itinerary generates, then the itinerary assumes flight travel and frames the opening day around arrival logistics; budget tier note clarifies flights are not included
- [ ] Given home base is filled and no nationality was entered, when the itinerary generates, then the visa advisory (TRIP-003) uses the home city's country as a proxy nationality
- [ ] Given home base and travel dates are both provided (from TRIP-011, date range not days-only), when the itinerary generates, then a holiday awareness note appears if any public holidays fall within the travel window at origin or destination — listing holiday name, date, and whether origin/destination/both
- [ ] Given only a days count is entered (no calendar dates), then no holiday note is generated regardless of home base

**AI Concept Involved:** Contextual calendar reasoning — the LLM cross-references travel dates against its knowledge of public holidays at origin and destination. Domestic/international auto-derivation is a prompt branch that changes transport and budget framing based on computed input, not a manual user selection.

**Learning Note:** Home base turns a stateless prompt into a contextual one. On the Explore path it's a filter; on the known-destination path it's an inference engine — the app derives transport mode, visa context, and holiday relevance from a single field. This is how well-designed inputs compound: each field doesn't just add one thing, it unlocks reasoning across multiple dimensions.

**Dependencies:** TRIP-011 (date input redesign) — holiday awareness requires a date range, not a days count.

---

**Story ID:** TRIP-010
**Title:** Travel party type
**Priority:** Must (V1)
**Effort:** S

As **Priya** (Busy Professional Planner), I want to specify whether I'm travelling solo, as a couple, in a small group, or as a family so that the itinerary recommends appropriate accommodation, activities, and pacing for my group.

**Acceptance Criteria:**

- [ ] Given I open the input form, when it loads, then I see a "Who's travelling?" selector with four options: Solo / Couple / Small group (3–6) / Family with kids
- [ ] Given "Solo" is selected, when the itinerary generates, then accommodation reflects solo-friendly options (hostels, single rooms, guesthouses) and activities include solo-appropriate suggestions
- [ ] Given "Couple" is selected, when the itinerary generates, then accommodation and activities reflect a two-person romantic or partner framing where appropriate to the travel style
- [ ] Given "Small group" is selected, when the itinerary generates, then accommodation mentions group-friendly options (shared apartments, multi-room bookings) and activities favour group experiences
- [ ] Given "Family with kids" is selected, when the itinerary generates, then activities are family-friendly (no extreme sports as defaults, include child-appropriate options) and accommodation mentions family rooms or connecting rooms
- [ ] Given any party type, when the budget tier is "budget," then the itinerary reflects per-person budget constraints (not total group cost)
- [ ] Given any party type, when the itinerary generates, then the party type is visibly reflected in the output — not just implicit
- [ ] Given the field is not filled, when the form submits, then "Solo" is used as the default (no error)

**AI Concept Involved:** Prompt enrichment — party type becomes a new constraint in the system prompt, shaping activity suitability, accommodation type, and pacing tone. Budget remains per-person; party size informs the *type* of spend, not the *level*.

**Learning Note:** "Solo" and "Family with kids" are not just demographic labels — they're activity filters, accommodation classifiers, and tone modifiers all at once. One field in the form maps to multiple simultaneous constraints in the prompt. This is how well-designed input forms produce better-personalised AI output.

---

### EPIC-07 — Date Intelligence

---

**Story ID:** TRIP-011
**Title:** Dual-field date input (calendar + days)
**Priority:** Must (V1)
**Effort:** M

As **James**, I want to enter my travel dates either as a calendar date range or as a number of days so that the itinerary can use real dates when I know them, or work with a duration when I don't.

**Acceptance Criteria:**

- [ ] Given I open the input form, when it loads, then the duration field is replaced by two distinct inputs: a date range calendar picker (start date + end date) and a numerical days field
- [ ] Given I pick a start and end date in the calendar picker, when both dates are selected, then the days field auto-populates with the calculated duration (read-only) — e.g. June 10–17 → "7"
- [ ] Given the days field is auto-populated from the calendar, when I try to edit the days field directly, then it is read-only (I must clear the calendar to edit days manually)
- [ ] Given I type a number into the days field directly, when I do so, then the calendar fields remain empty and editable (days-only mode)
- [ ] Given only a number of days is entered (no dates), when the itinerary generates, then the itinerary uses "Day 1", "Day 2" etc. as labels (not calendar dates)
- [ ] Given a date range is entered, when the itinerary generates, then the itinerary uses real date labels (e.g. "Tuesday, June 10")
- [ ] Given the days field is empty and no dates are selected, when I submit the form, then I see an inline validation error indicating that duration is required
- [ ] Given only a start date is entered without an end date, when I submit, then I see an inline validation error asking me to complete the date range
- [ ] Given home base and travel dates are both provided (from TRIP-009), when the form submits, then the holiday awareness logic in TRIP-009 can activate

**AI Concept Involved:** Input schema design — the dual-field structure produces two distinct prompt paths: date-labelled itineraries (when dates are known) vs. day-numbered itineraries (when only duration is known). Real dates also unlock the calendar reasoning in TRIP-009.

**Learning Note:** Structured input design directly shapes LLM output quality. A date range doesn't just change the day labels — it unlocks a whole class of contextual reasoning (seasonality, holidays, day-of-week patterns) that a bare duration count cannot. Every field you add to the form is a new reasoning dimension you hand to the model.

---

## 3. Backlog (V2+)

| ID | Feature | Target | Notes |
|---|---|---|---|
| F4 | Insurance recommendations | V2 | LLM-generated advisory based on trip profile (destination, duration, party type). Regulatory disclaimer required — same pattern as visa advisory. Flag as advisory only; never recommend specific products. |
| F5 | SIM card / data plan recommendations | V2/V3 | Tips panel: LLM suggests connectivity options for destination country. No core path dependency. Low regulatory risk. |
| TRIP-005 | Seasonal / timing advisory | V2 | Reverted from MVP due to LLM bleed into style_fit fields. Revisit with post-processing filter on structured output, or as a standalone advisory field separate from activity schema. |

---

## 4. Definition of Done — V1

V1 is done when **all of the following are true**:

### Functional completeness
- [ ] TRIP-009, TRIP-010, TRIP-011 all pass their acceptance criteria
- [ ] Core happy path still works end-to-end after V1 changes (no regression on MVP stories)
- [ ] Home base field correctly gates the domestic/international toggle
- [ ] Holiday awareness note appears correctly when dates + home base are both provided
- [ ] Party type visibly influences itinerary activity and accommodation language
- [ ] Calendar picker auto-calculates days; days field works independently when calendar is empty

### Output quality
- [ ] 5+ itinerary outputs reviewed per party type (Solo, Couple, Small group, Family with kids)
- [ ] Holiday flag tested against at least 3 known public holidays (UK, US, one destination-side)
- [ ] Domestic vs. international transport framing verified across 3+ destination pairs
- [ ] No regression: MVP outputs (no home base, solo default) unchanged in quality

### Technical
- [ ] All new fields added to `TripInputs` Pydantic model (`backend/models/itinerary.py`)
- [ ] System prompt updated to consume new fields (home base, toggle, party type, date labels)
- [ ] Frontend form updated with new fields; validation rules applied
- [ ] No new backend endpoints required — all new fields pass through existing `POST /generate`

### Out of scope for V1 DoD
- Deployment (MVP open item — resolve separately)
- Mobile responsiveness
- F4, F5, TRIP-005

---

## 5. Claude Code Session Briefs

---

### Brief A — TRIP-011: Date Input Redesign

```
## Claude Code Session Brief — TRIP-011: Dual-field Date Input

### Context
We are in Phase 4 — Build, V1. Discovery and Definition are complete (docs/definition-v1.md).
This brief covers TRIP-011 only. Do not touch TRIP-009 or TRIP-010 in this session.

The MVP duration field is a single free-text input in TripInputForm.tsx.
We are replacing it with two coordinated fields:
  - A date range calendar picker (start + end date)
  - A numerical days field (integer only, positive)

### Objective
Replace the free-text duration field with the dual-field input described above.
No backend changes are needed — the backend already handles both "7 days" (duration string)
and "June 10–17" (date range string) via build_user_prompt(). We are only changing
the frontend and how we construct the duration string before sending it.

### Behaviour spec
1. Calendar picker: user selects start date + end date.
   - On both dates selected: days field auto-populates as (end - start) in days, read-only.
   - Clearing either calendar date resets the days field to editable.
2. Days field: user types a positive integer.
   - Only active when calendar is empty.
   - Read-only when calendar dates are set.
3. Form submission:
   - If calendar range is set → pass "June 10–17" format to the API (or equivalent date range string)
   - If only days entered → pass "7 days" format (as MVP does today)
   - If neither → inline validation error: "Please enter travel dates or a number of days"
   - If only start date (no end) → inline validation error: "Please select an end date"

### Files to change
- frontend/src/components/TripInputForm.tsx — replace duration input, add validation
- frontend/src/app/page.tsx — update how duration value is read and passed to /generate

### Do not change
- backend/ (no changes needed)
- Any other frontend components
- The TripInputs type in frontend/src/types/itinerary.ts only if the duration field
  type needs adjusting — check first

### AI Concept
Input schema design — dual-field structure produces two distinct prompt paths:
date-labelled itineraries vs. day-numbered itineraries.
Flag this in a comment in TripInputForm.tsx and in the dev log.

### Definition of Done for this session
- [ ] Free-text duration field replaced by calendar picker + numerical days field
- [ ] Calendar → days auto-calculation works (read-only days when calendar is set)
- [ ] Days field works independently when calendar is empty
- [ ] Validation errors appear for: both empty, only start date
- [ ] Form still submits correctly to POST /generate with correct duration string
- [ ] No regression on other form fields or itinerary rendering
```

---

### Brief B — TRIP-010: Travel Party Type

```
## Claude Code Session Brief — TRIP-010: Travel Party Type

### Context
We are in Phase 4 — Build, V1. This brief covers TRIP-010 only.
Build TRIP-011 first — this brief assumes the date input redesign is already in place.

### Objective
Add a "Who's travelling?" selector to the input form and pass the party type
to the LLM as a new prompt constraint.

### What to build

**Backend**
1. backend/models/itinerary.py — add `party_type` field to TripInputs:
   Literal["solo", "couple", "small_group", "family_with_kids"], default "solo"
2. backend/prompts/itinerary.py — update build_user_prompt() to include party_type.
   Add prompt instructions to SYSTEM_PROMPT covering:
   - solo: solo-friendly accommodation, independent activity pacing
   - couple: two-person framing, romantic/partner tone where appropriate to style
   - small_group: group accommodation, shared-experience activities
   - family_with_kids: family-friendly activities, no extreme sports as defaults,
     family rooms / connecting rooms in accommodation references

**Frontend**
3. frontend/src/types/itinerary.ts — add partyType field to TripInputs type
4. frontend/src/components/TripInputForm.tsx — add selector with 4 options:
   "Solo" / "Couple" / "Small group (3–6)" / "Family with kids"
   Default: Solo (no validation error if not changed)
5. frontend/src/app/page.tsx — pass partyType in the /generate request body

### Do not change
- Itinerary output schema (Itinerary, ItineraryDay, ActivitySlot models)
- /tweak endpoint or tweak prompt (party type is already in original_inputs context)
- explore.py, explore router, ExploreView

### AI Concept
Prompt enrichment — party type is a new constraint dimension passed to the LLM
alongside style and budget. Budget remains per-person; party type shapes accommodation
type and activity suitability, not spend level.
Flag in a comment in backend/prompts/itinerary.py and in the dev log.

### Definition of Done for this session
- [ ] "Who's travelling?" selector present in form with 4 options
- [ ] Defaults to "Solo" if not changed (no error)
- [ ] party_type passed to POST /generate and received by backend
- [ ] System prompt updated; party type visibly affects accommodation and activity language
- [ ] 4 quick test runs (one per party type) confirm visible prompt influence
- [ ] No regression on core happy path
```

---

### Brief C — TRIP-009: Home Base + Domestic/International Filter

```
## Claude Code Session Brief — TRIP-009: Home Base + Domestic/International Filter

### Context
We are in Phase 4 — Build, V1. This brief covers TRIP-009 only.
Build TRIP-011 and TRIP-010 first — this brief assumes both are already in place.

Key design decisions (locked in Phase 3):
- Domestic/international checkboxes appear ONLY in Explore Mode (destination blank).
  On the known-destination path, domestic vs. international is AUTO-DERIVED by comparing
  home city country to destination country — no manual selection.
- Home base field: city-level text input. Implement autocomplete if feasible; plain text
  is acceptable for V1.
- Form layout: single-column, consistent with existing form.

### What to build

**Backend**
1. backend/models/itinerary.py — add to TripInputs:
   - home_city: Optional[str] = None
   - explore_scope: Optional[List[Literal["domestic", "international"]]] = None
     (used only on the Explore path; None means default international)

2. backend/models/itinerary.py — add to Itinerary output model:
   - holiday_note: Optional[str] = None
     Description: "Lists public holidays at origin or destination during travel window.
     Null if home_city not provided, or dates are days-only, or no holidays found."

3. backend/prompts/itinerary.py — update build_user_prompt() and SYSTEM_PROMPT:

   Known-destination path (home_city provided, destination known):
   - Derive trip_scope in the service layer: if destination country == home country →
     "domestic" else "international" (simple string comparison or LLM-assisted inference)
   - If domestic: mention surface travel options (train, drive, coach); note budget
     excludes flights
   - If international: assume flight travel; frame Day 1 around arrival; note budget
     excludes flights
   - If home_city provided but nationality not provided: use home city's country as
     proxy nationality for visa advisory
   - If home_city + date range provided (not days-only): instruct LLM to check for
     public holidays at origin country AND destination country within travel window.
     Set holiday_note with holiday names, dates, origin/destination/both label.
     If no holidays found: null.

4. backend/prompts/explore.py — update build_explore_prompt():
   - If explore_scope includes "domestic" only: suggest destinations within home country
   - If explore_scope includes "international" only: suggest destinations outside home country
   - If explore_scope includes both: suggest a mix (at least 1 domestic, at least 1 international)
   - If explore_scope is None or empty: default to international (MVP behaviour)

5. backend/models/explore.py — no schema changes needed; filtering is prompt-side only

**Frontend**
6. frontend/src/components/TripInputForm.tsx:
   - Add "Home base" city text input (autocomplete if feasible; plain text fallback)
   - Do NOT add any toggle or checkboxes here — scope filter is in ExploreView

7. frontend/src/components/ExploreView.tsx:
   - When home_city is filled (passed as prop): show two checkboxes at the top of the
     Explore view: "Domestic" and "International"
   - When home_city is empty: checkboxes not shown (MVP behaviour)
   - On checkbox change: re-call POST /explore with updated explore_scope

8. frontend/src/components/ItineraryView.tsx:
   - Render holiday_note as an info panel (teal/blue, distinct from amber visa_note)
     if present

9. frontend/src/types/itinerary.ts — add home_city and explore_scope to TripInputs type

10. frontend/src/app/page.tsx — pass home_city in all API calls (/explore, /generate, /tweak)

### Do not change
- Party type or date input logic (already in TRIP-010, TRIP-011)
- /tweak endpoint schema (home_city flows through original_inputs context automatically)

### AI Concept
Contextual calendar reasoning — LLM cross-references dates against public holiday
knowledge at origin and destination. Domestic/international auto-derivation is a
computed prompt branch, not a manual user input.
Explore scope filtering is conditional prompt branching extended to destination suggestion.
Flag both in comments in backend/prompts/ files and in the dev log.

### Edge cases to handle
- Home base filled, days-only mode (no calendar dates): no holiday_note; transport
  framing still applies on known-destination path
- Home base filled, date range provided, no holidays found: holiday_note = null, no panel
- Both checkboxes checked in Explore Mode: mix of domestic and international suggestions

### Definition of Done for this session
- [ ] Home base field present in TripInputForm
- [ ] Domestic/international checkboxes appear in ExploreView only when home_city filled
- [ ] Explore scope filtering works: domestic-only, international-only, both, neither
- [ ] Known-destination path: transport framing auto-derived from home city vs. destination
- [ ] Budget note (flights not included) appears in international itineraries
- [ ] Holiday note renders when home base + date range provided and holidays exist
- [ ] Holiday note null when: home base absent, days-only mode, or no holidays found
- [ ] No nationality + home base → visa advisory uses home country proxy
- [ ] No regression on TRIP-010, TRIP-011, or core MVP happy path
```

---

## 6. AI Concepts Log — V1 additions

| Concept | Plain English | Where It Appears |
|---|---|---|
| **Prompt enrichment** | Adding new constraint dimensions to the system prompt via new input fields | TRIP-010: party type shapes accommodation and activity suitability |
| **Conditional prompt branching** | Different prompt logic fires based on a field value | TRIP-009: domestic vs. international changes transport + budget framing |
| **Contextual calendar reasoning** | LLM cross-references dates against its knowledge of holidays at origin and destination | TRIP-009: holiday awareness note |
| **Input schema design** | How structured vs. free-form inputs shape downstream LLM reasoning | TRIP-011: date range unlocks calendar reasoning; days-only limits it |

---

## 7. Decision Log — V1

| Decision | Rationale | Alternatives Considered | Date |
|---|---|---|---|
| Home base as city-level (not country) | City enables drive-vs-fly logic and regional holidays; country loses this nuance | Country-level only | May 2026 |
| Domestic/international as checkboxes (not toggle) | Allows "both" selection for mixed destination suggestions in Explore Mode | Mutually exclusive toggle | May 2026 |
| Domestic/international checkboxes in Explore Mode only | On known-destination path, scope is auto-derived from home city vs. destination country — no manual input needed | Toggle on main form for all paths | May 2026 |
| Known-destination path: auto-derive domestic/international | Reduces user input; home city + destination provides enough signal to infer scope | Manual toggle on all paths | May 2026 |
| Budget tier stays per-person regardless of party size | Simpler mental model for users; party type shapes type of spend, not level | Total group budget | May 2026 |
| Family: general flag only (no age ranges) in V1 | Form complexity vs. marginal LLM personalisation gain doesn't justify it in V1 | Age bracket selector (toddler/school/teen) | May 2026 |
| Calendar → days auto-calculates (read-only) | Prevents conflicting inputs; cleaner UX than two independent fields | Independent fields, user fills either | May 2026 |
| Days-only mode: no date suggestion | Keeps F3 scope clean; holiday suggestions via LLM without real dates would be speculative | Suggest optimal start date based on holidays | May 2026 |
| Form layout: single-column (V1) | Consistent with existing form; revisit for V2 when field count warrants multi-column | Multi-column layout | May 2026 |
| Build order: TRIP-011 → TRIP-010 → TRIP-009 | TRIP-011 unblocks date-aware features; TRIP-009 depends on both date and party context being in place | Build in story ID order | May 2026 |
| F4 / F5 deferred to V2+ | Core input enrichment is higher value per effort; F4 has regulatory considerations | Include in V1 | May 2026 |

---

*Phase 2 — Definition: Complete*
*Phase 3 — Design: Complete (all decisions logged in Decision Log above)*
*Next phase: Build (follow Brief A → B → C in order)*
*Last updated: May 2026*
