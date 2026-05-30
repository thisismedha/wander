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
""".strip()


def build_user_prompt(
    destination: str | None,
    duration: str,
    style: str,
    budget: str,
    nationality: str | None,
) -> str:
    dest_str = destination if destination else "not specified — suggest a suitable destination"
    nat_str = f"Passport nationality: {nationality}" if nationality else "Nationality: not provided"
    return f"""
Destination: {dest_str}
Travel duration: {duration}
Travel style: {style}
Budget tier: {budget}
{nat_str}

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
