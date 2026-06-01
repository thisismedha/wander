from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import explore, generate, tweak

app = FastAPI(title="Wander — Trip Planner API", version="0.1.0")

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    # Vercel production + preview URLs added after first deploy
    "https://wander-rouge-chi.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(explore.router)
app.include_router(generate.router)
app.include_router(tweak.router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
