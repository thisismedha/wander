"use client";

import { useState } from "react";
import type { ExploreSuggestions } from "@/types/explore";
import type { Itinerary, TripInputs } from "@/types/itinerary";
import ExploreView from "@/components/ExploreView";
import ExportButtons from "@/components/ExportButtons";
import ItineraryView from "@/components/ItineraryView";
import TripInputForm from "@/components/TripInputForm";
import TweakInput from "@/components/TweakInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type AppState = "form" | "exploring" | "itinerary";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("form");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [exploreSuggestions, setExploreSuggestions] = useState<ExploreSuggestions | null>(null);
  const [originalInputs, setOriginalInputs] = useState<TripInputs | null>(null);
  const [generating, setGenerating] = useState(false);
  const [exploring, setExploring] = useState(false);
  const [tweaking, setTweaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function callExplore(inputs: TripInputs) {
    setExploring(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/explore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? `Server error ${res.status}`);
      }
      const data: ExploreSuggestions = await res.json();
      setExploreSuggestions(data);
      setAppState("exploring");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setExploring(false);
    }
  }

  async function callGenerate(inputs: TripInputs) {
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
      setAppState("itinerary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function handleFormSubmit(inputs: TripInputs) {
    setOriginalInputs(inputs);
    if (!inputs.destination) {
      // Blank destination → Explore Mode
      callExplore(inputs);
    } else {
      callGenerate(inputs);
    }
  }

  function handleExploreSelect(destination: string) {
    if (!originalInputs) return;
    const inputs = { ...originalInputs, destination };
    callGenerate(inputs);
  }

  function handleExploreRefresh() {
    if (!originalInputs) return;
    callExplore(originalInputs);
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
    setAppState("form");
    setItinerary(null);
    setExploreSuggestions(null);
    setOriginalInputs(null);
    setError(null);
  }

  const isLoading = generating || exploring;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <span className="text-xl font-bold text-indigo-600">Wander</span>
            <span className="ml-2 text-sm text-slate-400">AI Trip Planner</span>
          </div>
          {appState !== "form" && (
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
        {/* Form view */}
        {appState === "form" && (
          <div className="mx-auto max-w-lg">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900">Plan your next trip</h1>
              <p className="mt-2 text-slate-500">
                Tell us where you want to go — or leave the destination blank and we'll suggest
                somewhere perfect for you.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <TripInputForm onSubmit={handleFormSubmit} loading={isLoading} />
            </div>
            {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
          </div>
        )}

        {/* Explore mode view */}
        {appState === "exploring" && exploreSuggestions && originalInputs && (
          <div className="mx-auto max-w-lg">
            <ExploreView
              suggestions={exploreSuggestions.suggestions}
              originalInputs={originalInputs}
              onSelect={handleExploreSelect}
              onRefresh={handleExploreRefresh}
              refreshing={exploring}
            />
            {generating && (
              <div className="mt-6 text-center text-sm text-slate-500">
                Building your itinerary…
              </div>
            )}
            {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
          </div>
        )}

        {/* Itinerary view */}
        {appState === "itinerary" && itinerary && (
          <div className="space-y-6">
            <ItineraryView itinerary={itinerary} />
            <ExportButtons itinerary={itinerary} />
            {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
            <TweakInput onSubmit={handleTweak} loading={tweaking} />
          </div>
        )}
      </main>
    </div>
  );
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
      <p className="text-sm text-red-700">{message}</p>
      <button
        onClick={onDismiss}
        className="mt-2 text-xs font-medium text-red-600 underline hover:text-red-800"
      >
        Dismiss
      </button>
    </div>
  );
}
