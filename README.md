# Wander — AI Trip Planner

A stateless web app that generates personalised day-by-day itineraries using Google Vertex AI (Gemini 2.5 Flash) via LangChain.

## Architecture

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Python FastAPI |
| LLM | Gemini 2.5 Flash via `langchain-google-vertexai` |
| Structured output | LangChain `.with_structured_output(Pydantic)` |
| Auth | GCP service account JSON |

## Local development

### Prerequisites

- Python 3.11+
- Node.js 18+
- A GCP project with Vertex AI enabled
- A GCP service account JSON file with the `Vertex AI User` role

### Backend

```bash
# From project root
cp backend/.env.example backend/.env
# Edit backend/.env with your GCP project details
# Place your service-account.json in the project root

pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:3000
```

The frontend calls the backend at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).

## Environment variables

### Backend (`backend/.env`)

```
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
GCP_PROJECT_ID=your-project-id
GCP_LOCATION=us-central1
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/generate` | Generate an itinerary from trip inputs |
| POST | `/tweak` | Modify the current itinerary with a follow-up instruction |
| GET | `/health` | Health check |

## Security

- `service-account.json` is in `.gitignore` — never commit GCP credentials
- All LLM calls happen server-side in the FastAPI backend; no credentials are exposed to the browser

## Deployment

- **Backend:** Google Cloud Run (uses the same service account for Vertex AI auth)
- **Frontend:** Vercel — set `NEXT_PUBLIC_API_URL` to your Cloud Run service URL
