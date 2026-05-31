from pydantic import BaseModel, Field
from typing import List, Literal, Optional


class DestinationSuggestion(BaseModel):
    destination: str = Field(..., description="City and country, e.g. 'Lisbon, Portugal'")
    rationale: str = Field(
        ...,
        description="2-3 sentences explaining why this destination suits the traveller's style, budget, and timing",
    )
    # AI concept (TRIP-016): schema-driven conditional output — populated only on days-only path;
    # null when exact dates given (seasonal info already in rationale)
    best_time_to_visit: Optional[str] = Field(
        None,
        description=(
            "Concise best-time note, e.g. 'Best: April–October. Avoid July–August if you dislike crowds.' "
            "Populate only when no real travel dates are provided (days-only). "
            "Set to null when exact dates are given."
        ),
    )
    # AI concept (TRIP-017): trip_type labels each suggestion when both domestic and international
    # are requested, enabling the frontend to group results into two headed sections
    trip_type: Optional[Literal["domestic", "international"]] = Field(
        None,
        description=(
            "Set to 'domestic' or 'international' only when the user requested both scopes. "
            "Leave null when scope is not split (single scope or no filter)."
        ),
    )


class ExploreSuggestions(BaseModel):
    suggestions: List[DestinationSuggestion] = Field(
        ..., description="4–6 destination suggestions (exactly 6 when both domestic and international requested: 3 of each)"
    )
