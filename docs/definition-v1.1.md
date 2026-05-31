# Roamio V1.1 — Definition Output
**Phase:** 2 — Definition
**Status:** Complete
**Date:** May 2026
**Depends on:** definition-v1.md (V1 stories TRIP-009 through TRIP-011)

---

## 1. Context

V1.1 is a UI restructure, not a feature addition. The backend does not change — all fields
introduced in V1 (`home_city`, `explore_scope`, `party_type`, `holiday_note` etc.) are already
in `TripInputs`. This release changes how and when users fill those fields.

**The problem with V1:** One form does two jobs. Destination is optional, which forces the user
to understand the "leave blank for Explore Mode" convention. The form has no hierarchy — mandatory
and optional fields look the same.

**The V1.1 fix:** Split intent at the home screen. Two explicit modes, each with its own form,
its own mandatory fields, and a clear optional section that encourages personalisation without
requiring it.

**Product vision:** Get the user to a good first result with the minimum possible friction.
Optional fields are always visible (not hidden) but clearly signposted as "adds personalisation."

---

## 2. Epics

| Epic ID | Name | Description | Stories |
|---|---|---|---|
| EPIC-08 | Mode-first UX | Replace single-form home with explicit Plan / Explore mode selector | TRIP-012, TRIP-013, TRIP-014 |

---

## 3. User Stories

---

### EPIC-08 — Mode-first UX

---

**Story ID:** TRIP-012
**Title:** Home screen mode selector
**Priority:** Must (V1.1)
**Effort:** S

As any user, I want to choose my intent (Plan or Explore) before seeing a form, so that
the questions I'm asked match what I'm actually trying to do.

**Acceptance Criteria:**

- [ ] Given I load the app, when the home screen renders, then I see two mode cards:
  "Plan a trip" and "Explore destinations" — each with a one-line description of what
  it does
- [ ] Given I click "Plan a trip", when the card is selected, then I am taken to the
  Plan form (TRIP-013)
- [ ] Given I click "Explore destinations", when the card is selected, then I am taken
  to the Explore form (TRIP-014)
- [ ] Given I am on either form, when I click a back affordance, then I return to the
  mode selector
- [ ] Given I complete a flow (itinerary generated), when I click "Start over", then I
  return to the mode selector — not to a pre-filled form

**Dependencies:** None — implement first.

---

**Story ID:** TRIP-013
**Title:** Plan form — mandatory + optional fields
**Priority:** Must (V1.1)
**Effort:** M

As Priya (Decided Traveller), I want a Plan form that only requires what it truly needs
to generate a useful itinerary, with optional fields clearly available if I want to
personalise further.

**Acceptance Criteria:**

**Mandatory fields**
- [ ] Given I am in Plan mode, when the form loads, then I see three mandatory fields:
  Home city, Destination, and Duration (days or date range) — each marked with a
  required indicator
- [ ] Given I submit without Home city, when validation runs, then I see an inline error
  on that field
- [ ] Given I submit without Destination, when validation runs, then I see an inline error
  on that field
- [ ] Given I submit without Duration, when validation runs, then I see an inline error
  (existing TRIP-011 validation rules apply)
- [ ] Given all three mandatory fields are filled, when I submit, then the itinerary
  generates successfully — no optional fields are required

**Optional fields**
- [ ] Given the form loads, when I look below the mandatory fields, then I see a clearly
  labelled optional section with copy: "Add more to personalise your itinerary"
- [ ] The optional section contains: Travel style, Who's travelling (party type), Budget
  tier, Passport nationality
- [ ] Each optional field is visually distinct from mandatory fields (no required indicator,
  subdued label weight or colour)
- [ ] Given I fill one or more optional fields and submit, when the itinerary generates,
  then the output reflects those fields (same LLM behaviour as V1)

**Preserved V1 behaviours**
- [ ] Home city filled + no nationality → visa advisory uses home city's country as proxy
  (TRIP-009 AC preserved)
- [ ] Home city + date range → holiday awareness note fires if holidays found (TRIP-009
  AC preserved)
- [ ] Party type defaults to "solo" if not selected (TRIP-010 AC preserved)
- [ ] Calendar ↔ days auto-calculation logic unchanged (TRIP-011 AC preserved)

**Dependencies:** TRIP-012 must be in place first.

---

**Story ID:** TRIP-014
**Title:** Explore form — mandatory + optional fields
**Priority:** Must (V1.1)
**Effort:** M

As James (Undecided Traveller), I want an Explore form that asks only what it needs to
suggest relevant destinations, with optional fields available to narrow the results if
I have a preference.

**Acceptance Criteria:**

**Mandatory fields**
- [ ] Given I am in Explore mode, when the form loads, then I see two mandatory fields:
  Duration (days or date range) and Travel style / theme — each marked with a required
  indicator
- [ ] Given I submit without Duration, when validation runs, then I see an inline error
- [ ] Given I submit without Travel style, when validation runs, then I see an inline error
- [ ] Given both mandatory fields are filled, when I submit, then 3 destination suggestions
  generate successfully — no optional fields are required

**Optional fields**
- [ ] Given the form loads, when I look below the mandatory fields, then I see a clearly
  labelled optional section with copy: "Add more to personalise your suggestions"
- [ ] The optional section contains: Region hint (free text, e.g. "Southeast Asia"),
  Who's travelling (party type), Budget tier, Home city, Passport nationality
- [ ] Given I fill Region hint, when suggestions generate, then all 3 suggestions are
  geographically consistent with that region
- [ ] Given I fill Home city, when the ExploreView loads, then domestic/international
  checkboxes appear (TRIP-009 AC preserved)
- [ ] Given I fill optional fields (budget, party type, home city), when I select a
  destination and the itinerary generates, then those inputs are carried forward into
  the itinerary generation call

**Transition to itinerary**
- [ ] Given I select a destination from suggestions, when the itinerary generates, then
  I land directly on the itinerary view — no pause screen or form recap

**Dependencies:** TRIP-012 and TRIP-013 must be in place first.

---

## 4. Definition of Done — V1.1

V1.1 is done when **all of the following are true:**

### Functional completeness
- [ ] TRIP-012, TRIP-013, TRIP-014 all pass their ACs
- [ ] Plan form generates an itinerary with mandatory fields only
- [ ] Explore form generates destination suggestions with mandatory fields only
- [ ] All V1 behaviours preserved: holiday note, domestic/international filter, visa proxy,
  party type, calendar/days toggle
- [ ] "Start over" returns to mode selector, not to a form

### UX
- [ ] Optional fields visible on both forms without requiring expansion
- [ ] Personalisation copy present on both forms
- [ ] Back affordance present on both forms → returns to mode selector
- [ ] No regression on itinerary rendering, export, or tweak

### Technical
- [ ] No backend changes required
- [ ] `TripInputForm.tsx` refactored into `PlanForm.tsx`
- [ ] New `ExploreForm.tsx` component created
- [ ] `page.tsx` app state extended to cover: `mode-select | plan | explore-form | explore-results | itinerary`

### Out of scope for V1.1
- Side panel for editing inputs after Explore destination selected → V2 backlog
- Mobile responsiveness
- Deployment

---

## 5. Backlog additions (V2)

| ID | Feature | Notes |
|---|---|---|
| F6 | Explore → Plan side panel | After picking a destination from Explore, a side panel lets the user review/edit inputs before generating. Logged from V1.1 Discovery. |

---

## 6. Claude Code Session Briefs

---

### Brief A — TRIP-012: Home screen mode selector

```
## Claude Code Session Brief — TRIP-012: Home Screen Mode Selector

### Context
We are in Phase 4 — Build, V1.1. This brief covers TRIP-012 only.
Discovery and Definition are complete (docs/definition-v1.1.md).

The current app loads directly into a single form (TripInputForm). We are replacing
the home screen with a mode selector: two cards — "Plan a trip" and "Explore destinations."
Each card routes to a dedicated form (built in TRIP-013 and TRIP-014).

### What to build

1. frontend/src/app/page.tsx — extend AppState:
   type AppState = "mode-select" | "plan" | "explore-form" | "explore-results" | "itinerary"
   - Initial state: "mode-select"
   - "Plan a trip" card → sets state to "plan"
   - "Explore destinations" card → sets state to "explore-form"
   - Back affordance on plan/explore-form → returns to "mode-select"
   - "Start over" from itinerary → returns to "mode-select"
   - "explore-results" and "itinerary" states: keep existing logic

2. New inline component or file ModeSelector — two cards side by side (or stacked on
   narrow viewports):
   - "Plan a trip" — "I know where I'm going"
   - "Explore destinations" — "Help me decide where to go"
   - Consistent visual style with rest of app (indigo accents, rounded cards, Tailwind)

3. Header "Start over" button — already exists; ensure it returns to "mode-select" not
   to a pre-filled form (update handleReset).

### Do not change
- TripInputForm.tsx — that is TRIP-013 scope
- ExploreView.tsx — unchanged
- Any backend files
- Existing callExplore / callGenerate / handleTweak logic

### Definition of Done for this session
- [ ] Home screen shows two mode cards on first load
- [ ] Each card routes to the correct form state
- [ ] Back affordance present on plan and explore-form states
- [ ] "Start over" returns to mode-select
- [ ] No regression on existing explore-results and itinerary states
```

---

### Brief B — TRIP-013: Plan Form

```
## Claude Code Session Brief — TRIP-013: Plan Form

### Context
We are in Phase 4 — Build, V1.1. Build TRIP-012 first.
This brief covers TRIP-013 only.

The current TripInputForm has destination as optional and home city as optional.
In Plan mode, home city and destination are now mandatory. Travel style, party type,
budget, and nationality become optional (always visible, not hidden).

### What to build

1. Rename frontend/src/components/TripInputForm.tsx → PlanForm.tsx
   Update the import in page.tsx accordingly.

2. PlanForm.tsx — change validation logic:
   Mandatory fields (show inline error if missing on submit):
   - Home city (currently optional — make mandatory)
   - Destination (currently optional — make mandatory)
   - Duration — days or date range (validation logic unchanged from TRIP-011)

   Optional fields (always visible, no validation error if empty):
   - Travel style (currently mandatory — make optional; no default needed)
   - Party type (keep default "solo"; no error if unchanged)
   - Budget tier (currently mandatory — make optional)
   - Passport nationality (already optional — unchanged)

3. Add optional section label between mandatory and optional fields:
   - A visual divider and label: "Add more to personalise your itinerary"
   - Optional fields sit below this divider
   - Optional fields: no red asterisk; label weight/colour visually lighter than mandatory

4. Update onSubmit payload — style and budget are now Optional[str] on the backend
   (they already are in TripInputs). Pass undefined if not selected.
   Check backend/prompts/itinerary.py build_user_prompt() handles None style and budget
   gracefully (add fallback strings if needed: "not specified").

5. page.tsx — render PlanForm when appState === "plan"

### Do not change
- All TRIP-009, TRIP-010, TRIP-011 logic inside the form (date calc, party selector,
  home city field) — carry it forward unchanged
- Backend files
- ExploreView, ItineraryView, DayCard, TweakInput, ExportButtons

### Edge case
- If style or budget are undefined when sent to the backend, build_user_prompt() must
  not crash. Add: style = style or "not specified" and budget = budget or "not specified"
  in the Python prompt builder if they are not already guarded.

### Definition of Done for this session
- [ ] PlanForm renders in plan state
- [ ] Home city and destination are mandatory (inline errors on submit if empty)
- [ ] Duration validation unchanged from TRIP-011
- [ ] Travel style and budget are optional (no error if empty)
- [ ] Optional section label and divider present
- [ ] Form submits with mandatory fields only and generates a valid itinerary
- [ ] All V1 optional field behaviours preserved when fields are filled
```

---

### Brief C — TRIP-014: Explore Form

```
## Claude Code Session Brief — TRIP-014: Explore Form

### Context
We are in Phase 4 — Build, V1.1. Build TRIP-012 and TRIP-013 first.
This brief covers TRIP-014 only.

Currently the Explore path is triggered by leaving destination blank in TripInputForm.
We are replacing this with a dedicated ExploreForm component with its own field set
and validation rules.

### What to build

1. New file: frontend/src/components/ExploreForm.tsx

   Mandatory fields:
   - Duration — days or date range (same dual-field component logic as PlanForm)
   - Travel style / theme (select dropdown, same options as PlanForm; required)

   Optional fields (always visible below a divider "Add more to personalise your suggestions"):
   - Region hint: free text input, placeholder "e.g. Southeast Asia, somewhere warm"
   - Who's travelling: party type selector (same 2×2 grid as PlanForm)
   - Budget tier: select dropdown (same options)
   - Home city: text input (same as PlanForm; enables domestic/international filter)
   - Passport nationality: text input

   Validation:
   - Duration missing → inline error (same rules as PlanForm)
   - Travel style missing → inline error: "Please select a travel theme"
   - All optional fields: no error if empty

2. frontend/src/types/itinerary.ts — add region_hint?: string to TripInputs

3. backend/models/itinerary.py — add region_hint: Optional[str] = None to TripInputs

4. backend/prompts/explore.py — update build_explore_prompt() to accept region_hint:
   If provided, add to prompt: "Region preference: {region_hint} — prioritise destinations
   in or near this region."

5. backend/services/llm.py — thread region_hint through explore()

6. backend/routers/explore.py — pass region_hint to service

7. page.tsx:
   - Render ExploreForm when appState === "explore-form"
   - On ExploreForm submit: call callExplore(inputs), transition to "explore-results"
   - Carry all ExploreForm inputs (party_type, budget, home_city, nationality) forward
     when the user selects a destination and callGenerate() fires

### Do not change
- ExploreView.tsx (suggestion cards + domestic/international checkboxes) — unchanged
- PlanForm.tsx, ItineraryView, DayCard, TweakInput, ExportButtons
- /generate, /tweak endpoints

### Definition of Done for this session
- [ ] ExploreForm renders in explore-form state
- [ ] Duration and travel style are mandatory (inline errors if missing)
- [ ] All optional fields visible below divider with personalisation copy
- [ ] Region hint passed to /explore and scopes suggestions when provided
- [ ] Home city filled → domestic/international checkboxes appear in ExploreView
  (TRIP-009 behaviour preserved)
- [ ] Selecting a destination carries all inputs into /generate call
- [ ] Form submits with mandatory fields only and returns 3 valid suggestions
- [ ] No regression on Plan mode or itinerary flow
```

---

## 7. AI Concepts Log — V1.1 additions

| Concept | Plain English | Where It Appears |
|---|---|---|
| **Conditional prompt branching** | Region hint added to explore prompt changes the geographic pool the LLM draws from | TRIP-014: region_hint in build_explore_prompt() |
| **Progressive input design** | Mandatory fields produce a valid output; optional fields shift the output distribution toward the user's preferences without being required | TRIP-013, TRIP-014: optional field architecture |

---

## 8. Decision Log — V1.1

| Decision | Rationale | Alternatives Considered | Date |
|---|---|---|---|
| Mode selector as home screen | Makes user intent explicit before form renders; removes "leave blank" convention | Single form with mode toggle | May 2026 |
| Plan mandatory: home city, destination, duration | Minimum to produce a geographically grounded itinerary | Destination + duration only (drops home city) | May 2026 |
| Explore mandatory: duration + travel style | Duration anchors logistics; style is the strongest signal for destination quality | Duration only | May 2026 |
| Optional fields always visible (Option A) | Form not long enough to warrant hiding; visible fields get filled more often | Progressive disclosure expander | May 2026 |
| Explore → itinerary: straight through | Lowest friction; side panel deferred to V2 | Pause screen to review inputs | May 2026 |
| Budget optional in both modes | LLM produces useful output without it; "not specified" fallback in prompt | Budget mandatory in Plan | May 2026 |
| Region hint: free text | Flexible; handles "Southeast Asia", "somewhere warm", "near the ocean" | Dropdown of preset regions | May 2026 |

---

*Phase 2 — Definition: Complete*
*Phase 3 — Design: Complete (all UI/UX decisions locked in Decision Log above; no new components require design review)*
*Next phase: Build (follow Brief A → B → C in order)*
*Last updated: May 2026*
