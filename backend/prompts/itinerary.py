from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend.models.itinerary import Itinerary

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

Party type rules (budget is always per person):
- solo: recommend solo-friendly accommodation (hostels, guesthouses, single rooms);
  include independent activities suited to solo travellers; use "you" not "you and your group".
- couple: frame accommodation and activities for two people; apply a romantic or
  partner tone where it suits the travel style (e.g. not forced on adventure trips).
- small_group: recommend group-friendly accommodation (shared apartments, multi-room
  options); favour group experiences and shared meals; use "your group".
- family_with_kids: choose family-friendly activities only — no extreme sports as
  defaults; include child-appropriate options; recommend family rooms or connecting
  rooms; note any age restrictions on activities.

Home base rules (when home_city is provided):
- Compare the destination country to the home city's country:
  - Domestic (same country): recommend surface travel options (train, drive, coach);
    do not assume flights; note that the budget does not include flights.
  - International (different country): assume flight travel; frame Day 1 around arrival
    logistics (e.g. airport transfer, check-in, light exploration); note that the
    budget does not include international flights.
- If home_city is provided but nationality is not, use the home city's country as the
  proxy nationality for the visa advisory.

Holiday awareness (when home_city and real travel dates — not days-only — are provided):
- Cross-reference the travel dates against your knowledge of public holidays for both
  the origin country (home city's country) and the destination country.
- If any public holidays fall within the travel window, populate holiday_note with each
  holiday's name, date, and whether it falls at the origin, destination, or both.
  Example: "New Year's Day — 1 Jan (destination); Anzac Day — 25 Apr (origin)"
- Integrate holiday days into the itinerary naturally (e.g. note closures, festive
  atmosphere, or special events) but keep the holiday_note as a concise summary.
- If no public holidays are found within the travel window, set holiday_note to null.
- If travel dates are days-only (no real calendar dates), set holiday_note to null.
""".strip()


def build_user_prompt(
    destination: str | None,
    duration: str,
    style: str | None,
    budget: str | None,
    nationality: str | None,
    party_type: str = "solo",
    home_city: str | None = None,
) -> str:
    dest_str = destination if destination else "not specified — suggest a suitable destination"
    nat_str = f"Passport nationality: {nationality}" if nationality else "Nationality: not provided"
    # Optional fields fall back to "not specified" — LLM applies reasonable defaults
    style = style or "not specified"
    budget = budget or "not specified"

    home_str = f"\nHome city: {home_city}" if home_city else ""

    # AI concept (TRIP-009): contextual calendar reasoning — holiday awareness only fires when
    # real dates are provided (not days-only), so the LLM has a concrete window to check against
    has_real_dates = home_city and "days" not in duration.lower()
    holiday_cue = (
        "\n(Real travel dates provided — apply holiday awareness rules from the system prompt.)"
        if has_real_dates
        else ""
    )

    return f"""
Destination: {dest_str}
Travel duration: {duration}
Travel style: {style}
Budget tier: {budget} (per person)
{nat_str}
Travelling as: {party_type.replace("_", " ")}{home_str}{holiday_cue}

Generate the itinerary.
""".strip()


def build_tweak_prompt(
    current_itinerary: "Itinerary",
    original_inputs: dict,
    instruction: str,
) -> str:
    return f"""
Original trip inputs: {original_inputs}

Current itinerary:
{current_itinerary.model_dump_json(indent=2)}

The traveller wants to make the following change:
"{instruction}"

Return an updated itinerary applying only the requested change.
Keep all other days and activities exactly as they are.
""".strip()
