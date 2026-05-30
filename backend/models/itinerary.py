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


class TripInputs(BaseModel):
    destination: Optional[str] = None
    duration: str
    style: str
    budget: str
    nationality: Optional[str] = None


class TweakRequest(BaseModel):
    current_itinerary: Itinerary
    original_inputs: dict
    instruction: str
