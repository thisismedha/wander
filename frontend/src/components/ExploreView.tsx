"use client";

import type { DestinationSuggestion } from "@/types/explore";
import type { TripInputs } from "@/types/itinerary";

interface Props {
  suggestions: DestinationSuggestion[];
  originalInputs: TripInputs;
  onSelect: (destination: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

function SuggestionCard({ s, onSelect }: { s: DestinationSuggestion; onSelect: (d: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{s.destination}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.rationale}</p>
          {s.best_time_to_visit && s.best_time_to_visit !== "null" && (
            <p className="mt-2 text-xs text-slate-500">
              🗓 <span className="font-medium">Best time:</span> {s.best_time_to_visit}
            </p>
          )}
        </div>
        <button
          onClick={() => onSelect(s.destination)}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Plan this trip
        </button>
      </div>
    </div>
  );
}

export default function ExploreView({
  suggestions,
  originalInputs,
  onSelect,
  onRefresh,
  refreshing,
}: Props) {
  const isSplit = suggestions.some((s) => s.trip_type != null);
  const domestic = isSplit ? suggestions.filter((s) => s.trip_type === "domestic") : [];
  const international = isSplit ? suggestions.filter((s) => s.trip_type === "international") : [];
  const count = suggestions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Where should you go?</h2>
        <p className="mt-1 text-slate-500">
          Based on your{" "}
          <span className="font-medium capitalize">{originalInputs.style ?? "your"}</span> style — here are{" "}
          {count} idea{count !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Suggestion cards — grouped when domestic/international split, flat otherwise */}
      {isSplit ? (
        <div className="space-y-6">
          {domestic.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Domestic</h3>
              {domestic.map((s, idx) => <SuggestionCard key={idx} s={s} onSelect={onSelect} />)}
            </div>
          )}
          {international.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">International</h3>
              {international.map((s, idx) => <SuggestionCard key={idx} s={s} onSelect={onSelect} />)}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s, idx) => <SuggestionCard key={idx} s={s} onSelect={onSelect} />)}
        </div>
      )}

      {/* Refresh */}
      <div className="text-center">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
        >
          {refreshing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Finding more destinations…
            </span>
          ) : (
            "Try different destinations"
          )}
        </button>
      </div>
    </div>
  );
}
