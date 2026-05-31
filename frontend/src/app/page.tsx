"use client";

import { useState } from "react";
import type { ExploreSuggestions } from "@/types/explore";
import type { Itinerary, TripInputs } from "@/types/itinerary";
import ExploreView from "@/components/ExploreView";
import ExportButtons from "@/components/ExportButtons";
import ItineraryView from "@/components/ItineraryView";
import ExploreForm from "@/components/ExploreForm";
import PlanForm from "@/components/PlanForm";
import TweakInput from "@/components/TweakInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type AppState = "mode-select" | "plan" | "explore-form" | "explore-results" | "itinerary";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("mode-select");
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
      setAppState("explore-results");
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
      callExplore(inputs);
    } else {
      callGenerate(inputs);
    }
  }

  function handleExploreFormSubmit(inputs: TripInputs) {
    setOriginalInputs(inputs);
    callExplore(inputs);
  }

  function handleExploreSelect(destination: string) {
    if (!originalInputs) return;
    const inputs = { ...originalInputs, destination };
    callGenerate(inputs);
  }

  function handleExploreRefresh() {
    if (!originalInputs) return;
    const excluded = exploreSuggestions?.suggestions.map((s) => s.destination) ?? [];
    callExplore({ ...originalInputs, excluded_destinations: excluded });
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
    setAppState("mode-select");
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
          {appState !== "mode-select" && (
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

        {/* Mode selector — home screen */}
        {appState === "mode-select" && (
          <ModeSelector
            onSelectPlan={() => setAppState("plan")}
            onSelectExplore={() => setAppState("explore-form")}
          />
        )}

        {/* Plan form */}
        {appState === "plan" && (
          <div className="mx-auto max-w-lg">
            <button
              onClick={() => setAppState("mode-select")}
              className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
            >
              <span>←</span> Back
            </button>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900">Plan your trip</h1>
              <p className="mt-2 text-slate-500">
                Tell us where you&apos;re going and we&apos;ll build your itinerary.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <PlanForm onSubmit={handleFormSubmit} loading={isLoading} />
            </div>
            {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
          </div>
        )}

        {/* Explore form — placeholder until TRIP-014 */}
        {appState === "explore-form" && (
          <div className="mx-auto max-w-lg">
            <button
              onClick={() => setAppState("mode-select")}
              className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
            >
              <span>←</span> Back
            </button>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900">Explore destinations</h1>
              <p className="mt-2 text-slate-500">
                Tell us what kind of trip you&apos;re after and we&apos;ll suggest the perfect places.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <ExploreForm onSubmit={handleExploreFormSubmit} loading={isLoading} />
            </div>
            {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
          </div>
        )}

        {/* Explore results */}
        {appState === "explore-results" && exploreSuggestions && originalInputs && (
          <div className="mx-auto max-w-lg">
            <ExploreView
              suggestions={exploreSuggestions.suggestions}
              originalInputs={originalInputs}
              onSelect={handleExploreSelect}
              onRefresh={handleExploreRefresh}
              refreshing={exploring}
              generating={generating}
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

function ModeSelector({
  onSelectPlan,
  onSelectExplore,
}: {
  onSelectPlan: () => void;
  onSelectExplore: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Where to next?</h1>
        <p className="mt-2 text-slate-500">Choose how you&apos;d like to start planning.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Plan card */}
        <button
          onClick={onSelectPlan}
          className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl group-hover:bg-indigo-100">
            🗺️
          </div>
          <h2 className="text-base font-semibold text-slate-900">Plan a trip</h2>
          <p className="mt-1 text-sm text-slate-500">
            I know where I&apos;m going — build me a day-by-day itinerary.
          </p>
        </button>

        {/* Explore card */}
        <button
          onClick={onSelectExplore}
          className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl group-hover:bg-indigo-100">
            🧭
          </div>
          <h2 className="text-base font-semibold text-slate-900">Explore destinations</h2>
          <p className="mt-1 text-sm text-slate-500">
            Help me decide where to go — suggest somewhere that fits my style.
          </p>
        </button>
      </div>
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
