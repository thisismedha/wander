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
        description="Advisory visa note if nationality provided, else null",
    )
    # TRIP-009: contextual calendar reasoning — LLM cross-references dates against holiday knowledge
    holiday_note: Optional[str] = Field(
        None,
        description=(
            "Lists public holidays at origin or destination during travel window. "
            "Null if home_city not provided, dates are days-only, or no holidays found."
        ),
    )


class TripInputs(BaseModel):
    destination: Optional[str] = None
    duration: str
    style: Optional[str] = None
    budget: Optional[str] = None
    nationality: Optional[str] = None
    # TRIP-010: prompt enrichment — party type shapes accommodation and activity suitability
    party_type: Literal["solo", "couple", "small_group", "family_with_kids"] = "solo"
    # TRIP-009: home_city enables domestic/international framing, holiday awareness, visa proxy
    home_city: Optional[str] = None
    # TRIP-009: explore_scope filters destination suggestions; None defaults to international (MVP behaviour)
    explore_scope: Optional[List[Literal["domestic", "international"]]] = None
    # TRIP-014: free-text region hint scopes destination suggestions geographically
    region_hint: Optional[str] = None


class TweakRequest(BaseModel):
    current_itinerary: Itinerary
    original_inputs: dict
    instruction: str
