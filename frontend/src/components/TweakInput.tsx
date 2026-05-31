"use client";

import { useState } from "react";

interface Props {
  onSubmit: (instruction: string) => void;
  loading: boolean;
}

export default function TweakInput({ onSubmit, loading }: Props) {
  const [instruction, setInstruction] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!instruction.trim()) {
      setError("Please describe what you'd like to change.");
      return;
    }
    setError("");
    onSubmit(instruction.trim());
    setInstruction("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">Adjust your itinerary</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            rows={3}
            placeholder='e.g. "Replace Day 2 afternoon with something more low-key" or "Swap all evening activities for foodie experiences"'
            value={instruction}
            onChange={(e) => {
              setInstruction(e.target.value);
              if (error) setError("");
            }}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Updating…
            </span>
          ) : (
            "Update Itinerary"
          )}
        </button>
      </form>
    </div>
  );
}
