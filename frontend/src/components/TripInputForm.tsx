"use client";

import { useState } from "react";
import type { TripInputs } from "@/types/itinerary";

const TRAVEL_STYLES = [
  "adventure",
  "cultural",
  "relaxation",
  "foodie",
  "budget backpacker",
  "luxury",
];

const BUDGET_TIERS = ["budget", "mid-range", "luxury"];

interface Props {
  onSubmit: (inputs: TripInputs) => void;
  loading: boolean;
}

interface FormErrors {
  duration?: string;
  style?: string;
  budget?: string;
}

export default function TripInputForm({ onSubmit, loading }: Props) {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [nationality, setNationality] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!duration.trim()) e.duration = "Travel duration is required";
    if (!style) e.style = "Travel style is required";
    if (!budget) e.budget = "Budget tier is required";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({
      destination: destination.trim() || undefined,
      duration: duration.trim(),
      style,
      budget,
      nationality: nationality.trim() || undefined,
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Destination — optional */}
      <div>
        <label htmlFor="destination" className={labelClass}>
          Destination{" "}
          <span className="font-normal text-slate-400">(optional — leave blank for Explore Mode)</span>
        </label>
        <input
          id="destination"
          type="text"
          placeholder="e.g. Tokyo, Japan"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Duration — required */}
      <div>
        <label htmlFor="duration" className={labelClass}>
          Travel Duration <span className="text-red-500">*</span>
        </label>
        <input
          id="duration"
          type="text"
          placeholder='e.g. "7 days" or "June 10–17"'
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            if (errors.duration) setErrors((prev) => ({ ...prev, duration: undefined }));
          }}
          className={`${inputClass} ${errors.duration ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
        />
        {errors.duration && <p className={errorClass}>{errors.duration}</p>}
      </div>

      {/* Travel style — required */}
      <div>
        <label htmlFor="style" className={labelClass}>
          Travel Style <span className="text-red-500">*</span>
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => {
            setStyle(e.target.value);
            if (errors.style) setErrors((prev) => ({ ...prev, style: undefined }));
          }}
          className={`${inputClass} ${errors.style ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
        >
          <option value="">Select a style…</option>
          {TRAVEL_STYLES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        {errors.style && <p className={errorClass}>{errors.style}</p>}
      </div>

      {/* Budget tier — required */}
      <div>
        <label htmlFor="budget" className={labelClass}>
          Budget Tier <span className="text-red-500">*</span>
        </label>
        <select
          id="budget"
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            if (errors.budget) setErrors((prev) => ({ ...prev, budget: undefined }));
          }}
          className={`${inputClass} ${errors.budget ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
        >
          <option value="">Select a budget…</option>
          {BUDGET_TIERS.map((b) => (
            <option key={b} value={b}>
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </option>
          ))}
        </select>
        {errors.budget && <p className={errorClass}>{errors.budget}</p>}
      </div>

      {/* Nationality — optional */}
      <div>
        <label htmlFor="nationality" className={labelClass}>
          Passport Nationality{" "}
          <span className="font-normal text-slate-400">(optional — for visa advisory)</span>
        </label>
        <input
          id="nationality"
          type="text"
          placeholder="e.g. Australian"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Planning your trip…
          </span>
        ) : (
          "Plan My Trip"
        )}
      </button>
    </form>
  );
}
