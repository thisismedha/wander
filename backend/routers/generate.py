from fastapi import APIRouter, HTTPException

from backend.models.itinerary import Itinerary, TripInputs
from backend.services.llm import ItineraryService

router = APIRouter()
_service = ItineraryService()


@router.post("/generate", response_model=Itinerary)
async def generate_itinerary(inputs: TripInputs) -> Itinerary:
    try:
        return await _service.generate(
            destination=inputs.destination,
            duration=inputs.duration,
            style=inputs.style,
            budget=inputs.budget,
            nationality=inputs.nationality,
            party_type=inputs.party_type,
            home_city=inputs.home_city,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
