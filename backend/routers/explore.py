from fastapi import APIRouter, HTTPException

from backend.models.explore import ExploreSuggestions
from backend.models.itinerary import TripInputs
from backend.services.llm import ItineraryService

router = APIRouter()
_service = ItineraryService()


@router.post("/explore", response_model=ExploreSuggestions)
async def explore_destinations(inputs: TripInputs) -> ExploreSuggestions:
    try:
        return await _service.explore(
            duration=inputs.duration,
            style=inputs.style,
            budget=inputs.budget,
            nationality=inputs.nationality,
            home_city=inputs.home_city,
            explore_scope=inputs.explore_scope,
            region_hint=inputs.region_hint,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
