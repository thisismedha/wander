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

---

## 9. TRIP-015 — Daily weather estimates on itinerary day headers

**Story ID:** TRIP-015
**Title:** Daily weather estimates
**Priority:** Should (V1.1 polish)
**Effort:** M
**Added:** May 2026

---

### Problem

When a user provides exact travel dates, the itinerary day headers show the correct weekday and date (e.g. "Wednesday, July 1") but nothing about expected conditions. A traveller planning a July trip to Lisbon has no idea from the itinerary whether to pack sunscreen or a rain jacket. Weather context — even approximate — meaningfully improves the planning value of the output.

### Solution

Use the LLM's historical climate knowledge to generate a per-day weather estimate for each `ItineraryDay`. The LLM knows typical weather patterns by destination, month, and season. When exact dates are provided, it populates a `weather` field on each day with a high/low temperature pair, a short condition description, and a weather icon (emoji). When only a number of days is provided (no real dates), the field is null — no weather is shown.

**AI concept:** Schema-driven conditional output — `weather` is `Optional` on `ItineraryDay`. The system prompt instructs the LLM to populate it only when real dates are present. The Pydantic schema enforces the structure; the LLM fills the values from climate knowledge.

The UI labels the estimate clearly as "typical for this time of year" so the user understands it is not a live forecast.

---

### Scope

**In scope:**
- High and low temperature (°C) per day
- One-line weather condition description (e.g. "Warm and sunny", "Hot with afternoon thunderstorms", "Mild with coastal breeze")
- Weather icon (emoji: ☀️ ⛅ 🌧️ ⛈️ 🌫️ ❄️ 🌬️)
- Displayed on the right side of the day header in `DayCard.tsx`
- Only shown when exact dates were provided (weather is null for days-only trips)
- A small "typical" label beneath the temperature so the user knows it is a climate average

**Out of scope:**
- Real-time weather API integration (V2 backlog)
- UV index, rain percentage, humidity
- Unit toggle (°C only for V1.1; Fahrenheit option to V2 backlog)

---

### Acceptance Criteria

**When exact dates are provided (date range path):**
- [ ] Given the user submitted a date range (e.g. July 1–5 2026), when the itinerary renders, then every day header shows a weather estimate on the right: `{icon} {high}°/{low}° · {description}`
- [ ] Given a day header with weather, when I read it, then I can see: one emoji icon, a high temperature in °C, a low temperature in °C, and a one-line condition description
- [ ] Given the weather estimate is displayed, when I look beneath the temperature, then I see a label: "typical for this time of year"
- [ ] Given the LLM returns a `weather` object, when I inspect it, then `high_c` > `low_c` and both are plausible for the destination and month (not obviously wrong, e.g. not 50°C for London)

**When only a number of days is provided (days-only path):**
- [ ] Given the user submitted "7 days" (no dates), when the itinerary renders, then no weather estimate appears on any day header

**Structure:**
- [ ] `weather` is `null` on each `ItineraryDay` when days-only path is used
- [ ] `WeatherEstimate` Pydantic model has: `high_c: int`, `low_c: int`, `description: str`, `icon: str`
- [ ] Frontend `ItineraryDay` TypeScript type is updated to include `weather?: WeatherEstimate | null`

---

### Design decisions

| Decision | Rationale | Alternatives considered |
|---|---|---|
| LLM-estimated, not live API | Forecasts don't exist for dates months away; LLM climate knowledge is honest and sufficient for planning intent | Real API (only 16-day window), Open-Meteo historical (extra backend complexity) |
| °C only | Destination-first product; most non-US destinations use Celsius | Dual display (adds UI complexity for V1.1) |
| Emoji icon from LLM | Simple, no icon library dependency, LLM can match icon to condition reliably | SVG icon set mapped from condition string |
| "Typical for this time of year" label | Honest UX — sets correct expectation that this is a climate average | No label (risks user treating it as a forecast) |
| Optional on schema | If the LLM fails to populate or dates are days-only, UI silently hides it — no error state needed | Separate weather endpoint |

---

### Claude Code Session Brief — TRIP-015

```
## Claude Code Session Brief — TRIP-015: Daily Weather Estimates

### Context
We are in Phase 4 — Build, V1.1. TRIP-012, TRIP-013, TRIP-014 are complete.
This brief covers TRIP-015 only. Discovery and Definition are in docs/definition-v1.1.md, Section 9.

The feature: when exact travel dates are provided, every day in the itinerary shows a
weather estimate (high/low °C, emoji icon, condition description) on the right side of the
day header. Days-only trips show no weather. The estimate is LLM-generated from historical
climate knowledge, labelled "typical for this time of year."

### What to build

**1. backend/models/itinerary.py**
Add a new Pydantic model:

  class WeatherEstimate(BaseModel):
      high_c: int = Field(..., description="Typical daytime high in °C for this destination and date")
      low_c: int = Field(..., description="Typical overnight low in °C for this destination and date")
      description: str = Field(..., description="One-line condition, e.g. 'Warm and sunny' or 'Hot with afternoon thunderstorms'")
      icon: str = Field(..., description="Single weather emoji: ☀️ ⛅ 🌤️ 🌧️ ⛈️ 🌩️ 🌫️ ❄️ 🌬️ — choose the one that best matches the condition")

Add to ItineraryDay:
  weather: Optional[WeatherEstimate] = Field(
      None,
      description=(
          "Climate estimate for this day. Populate only when real travel dates are provided "
          "(not days-only). Use historical averages for the destination and month. "
          "Set to null if no real dates were given."
      ),
  )

**2. backend/prompts/itinerary.py — SYSTEM_PROMPT**
Add to the rules section (after the holiday awareness block):

  Weather estimates (when real travel dates are provided):
  - For each day, populate the weather field with a climate estimate based on your knowledge
    of typical conditions for the destination, month, and season.
  - high_c: typical daytime high in °C. low_c: typical overnight low in °C.
  - description: one concise phrase, e.g. "Warm and sunny", "Hot and humid with afternoon showers".
  - icon: a single emoji that best represents the day's conditions.
  - If travel dates are days-only (no real calendar dates), set weather to null on every day.

**3. frontend/src/types/itinerary.ts**
Add:

  export interface WeatherEstimate {
    high_c: number;
    low_c: number;
    description: string;
    icon: string;
  }

Update ItineraryDay:
  weather?: WeatherEstimate | null;

**4. frontend/src/components/DayCard.tsx**
Update the day header row to show weather on the right side when day.weather is present:

  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* existing day number badge and date label */}
    </div>
    {day.weather && (
      <div className="text-right">
        <div className="text-sm font-medium text-slate-700">
          {day.weather.icon} {day.weather.high_c}° / {day.weather.low_c}°
        </div>
        <div className="text-xs text-slate-400">typical for this time of year</div>
      </div>
    )}
  </div>

### Do not change
- ExploreForm, PlanForm, ExploreView, ItineraryView, TweakInput, ExportButtons
- /explore, /tweak endpoints
- Any other backend model fields

### AI concept to log
"Schema-driven conditional LLM output (TRIP-015): WeatherEstimate is Optional on ItineraryDay.
The system prompt instructs the LLM to populate it only when real dates are present.
The Pydantic schema enforces the structure; the LLM fills values from historical climate knowledge
(backend/models/itinerary.py, backend/prompts/itinerary.py)."

### Definition of Done for this session
- [ ] WeatherEstimate model added to backend/models/itinerary.py
- [ ] weather field added to ItineraryDay (Optional, null when days-only)
- [ ] SYSTEM_PROMPT updated with weather estimate rules
- [ ] WeatherEstimate TypeScript type added to frontend/src/types/itinerary.ts
- [ ] ItineraryDay type updated with weather field
- [ ] DayCard.tsx renders weather on day header right side when present
- [ ] "typical for this time of year" label beneath temperature
- [ ] Weather hidden (not rendered) when day.weather is null or undefined
- [ ] Date-range trip: all day headers show weather
- [ ] Days-only trip: no weather shown on any day header
- [ ] No regression on existing itinerary, tweak, or explore flows
```

---

## 10. AI Concepts Log — additions from TRIP-015

| Concept | Plain English | Where It Appears |
|---|---|---|
| **Schema-driven conditional output** | `WeatherEstimate` is `Optional` on `ItineraryDay` — the LLM populates it only when real dates are present, and leaves it null otherwise. The Pydantic schema enforces the shape; the system prompt rule enforces the condition. | TRIP-015: `backend/models/itinerary.py`, `backend/prompts/itinerary.py` |

---

## 11. Decision Log — additions from TRIP-015

| Decision | Rationale | Alternatives Considered | Date |
|---|---|---|---|
| LLM-estimated weather, not real API | No forecast API covers dates months ahead; LLM climate knowledge is sufficient for planning intent and requires zero external dependency | Open-Meteo historical averages (extra backend complexity), real forecast API (16-day limit only) | May 2026 |
| °C only for V1.1 | Destination-first product; °F toggle deferred to avoid UI complexity | Dual °C / °F display | May 2026 |
| Emoji icon output from LLM | No icon library dependency; LLM matches emoji to condition reliably in structured output | SVG icon set mapped from a condition enum | May 2026 |
| "Typical for this time of year" sub-label | Sets correct user expectation — this is a climate average, not a live forecast | No label (risks being mistaken for a real forecast) | May 2026 |

---

*Phase 2 — Definition: Complete (updated with TRIP-015, TRIP-016, TRIP-017)*
*Phase 3 — Design: Complete*
*Build order: TRIP-012 → TRIP-013 → TRIP-014 → TRIP-015 → TRIP-016 → TRIP-017*
*Last updated: May 2026*

---

## 12. TRIP-016 — Best Time to Visit on Days-Only Explore Path

**Story:** As Priya, when I enter a number of days (not real dates) in Explore Mode, I want each destination suggestion to show when the best time to visit is, so I can plan when to go.

**Acceptance Criteria:**
- AC1: When the user enters a duration in days (not calendar dates), each suggestion card displays a "Best time" note below the rationale.
- AC2: The note is concise — e.g. "Best: April–October. Avoid July–August if you dislike crowds."
- AC3: When exact dates are provided, `best_time_to_visit` is null and no "Best time" label is shown.
- AC4: The UI guards against the LLM returning the string `"null"` — the label only renders when the value is a non-empty, non-`"null"` string.
- AC5: The note is visually de-emphasised (smaller text, muted colour) relative to the rationale.

**AI concept (TRIP-016):** Schema-driven conditional output — the LLM populates `best_time_to_visit` only on the days-only path. When real dates are given, seasonal context goes into the rationale instead.

**Design decisions:**
- Label: 🗓 **Best time:** followed by the LLM string
- Rendered as `text-xs text-slate-500` below the rationale
- Field is `Optional[str]` on both backend Pydantic model and frontend TypeScript interface

---

## 13. TRIP-017 — 4–6 Suggestions; Domestic + International Split

**Story:** As Priya, I want 4–6 destination suggestions in Explore Mode, and when I select both domestic and international, I want exactly 3 of each shown in separate sections.

**Acceptance Criteria:**
- AC1: Explore Mode returns 4–6 suggestions when a single scope (domestic only, international only, or no filter) is selected.
- AC2: When both domestic and international are checked, exactly 6 suggestions are returned — 3 domestic and 3 international.
- AC3: When both scopes are selected, the UI renders two labelled sections: "DOMESTIC" and "INTERNATIONAL".
- AC4: When a single scope is selected, suggestions render as a flat list (no section headers).
- AC5: Each suggestion in a split result carries a `trip_type` field (`"domestic"` or `"international"`); `trip_type` is null for non-split results.
- AC6: The "Try different destinations" refresh respects the split — exclusion list prevents repeating any prior suggestion regardless of type.

**AI concept (TRIP-017):** Schema-driven conditional output — `trip_type` label is populated only when both scopes are requested, enabling the frontend to group results without heuristics.

**Design decisions:**
- Section headers: `text-xs font-semibold uppercase tracking-wide text-slate-400`
- Backend enforces count via system prompt rule; Pydantic model validates `Literal["domestic", "international"] | None`
- Frontend detects split mode via `suggestions.some((s) => s.trip_type != null)`

---

## 14. Decision Log — additions from TRIP-016 and TRIP-017

| Decision | Rationale | Alternatives Considered | Date |
|---|---|---|---|
| `best_time_to_visit` null when exact dates given | Seasonal info goes into rationale on the dates path — avoid double-rendering | Always populate best_time (redundant with rationale) | May 2026 |
| `trip_type` field on suggestion, not inferred by frontend | Frontend can't reliably infer domestic vs. international without home city context | Frontend string-match against home country name | May 2026 |
| Exactly 6 (3+3) when both scopes checked | Clean symmetric layout; prevents uneven grouping (e.g. 4 domestic, 1 international) | Variable count per group (messier UI) | May 2026 |
