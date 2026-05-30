from pydantic import BaseModel, Field
from typing import List


class DestinationSuggestion(BaseModel):
    destination: str = Field(..., description="City and country, e.g. 'Lisbon, Portugal'")
    rationale: str = Field(
        ...,
        description="2-3 sentences explaining why this destination suits the traveller's style, budget, and timing",
    )


class ExploreSuggestions(BaseModel):
    suggestions: List[DestinationSuggestion] = Field(
        ..., description="Exactly 3 destination suggestions"
    )
