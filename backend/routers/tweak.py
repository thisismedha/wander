from fastapi import APIRouter, HTTPException

from backend.models.itinerary import Itinerary, TweakRequest
from backend.services.llm import ItineraryService

router = APIRouter()
_service = ItineraryService()


@router.post("/tweak", response_model=Itinerary)
async def tweak_itinerary(request: TweakRequest) -> Itinerary:
    try:
        return await _service.tweak(
            current_itinerary=request.current_itinerary,
            original_inputs=request.original_inputs,
            instruction=request.instruction,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
