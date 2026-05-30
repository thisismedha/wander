from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import generate, tweak

app = FastAPI(title="Wander — Trip Planner API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router)
app.include_router(tweak.router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
