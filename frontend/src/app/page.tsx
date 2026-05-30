"use client";

import { useState } from "react";
import type { Itinerary, TripInputs } from "@/types/itinerary";
import TripInputForm from "@/components/TripInputForm";
import ItineraryView from "@/components/ItineraryView";
import TweakInput from "@/components/TweakInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [originalInputs, setOriginalInputs] = useState<TripInputs | null>(null);
  const [generating, setGenerating] = useState(false);
  const [tweaking, setTweaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(inputs: TripInputs) {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? `Server error ${res.status}`);
      }
      const data: Itinerary = await res.json();
      setItinerary(data);
      setOriginalInputs(inputs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleTweak(instruction: string) {
    if (!itinerary || !originalInputs) return;
    setTweaking(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/tweak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_itinerary: itinerary,
          original_inputs: originalInputs,
          instruction,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? `Server error ${res.status}`);
      }
      const data: Itinerary = await res.json();
      setItinerary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setTweaking(false);
    }
  }

  function handleReset() {
    setItinerary(null);
    setOriginalInputs(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <span className="text-xl font-bold text-indigo-600">Wander</span>
            <span className="ml-2 text-sm text-slate-400">AI Trip Planner</span>
          </div>
          {itinerary && (
            <button
              onClick={handleReset}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
            >
              Start over
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {!itinerary ? (
          /* Input form view */
          <div className="mx-auto max-w-lg">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900">Plan your next trip</h1>
              <p className="mt-2 text-slate-500">
                Tell us where you want to go (or let us suggest somewhere) and we'll build a personalised
                day-by-day itinerary.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <TripInputForm onSubmit={handleGenerate} loading={generating} />
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs font-medium text-red-600 underline hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Itinerary view */
          <div className="space-y-6">
            <ItineraryView itinerary={itinerary} />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs font-medium text-red-600 underline hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}

            <TweakInput onSubmit={handleTweak} loading={tweaking} />
          </div>
        )}
      </main>
    </div>
  );
}
