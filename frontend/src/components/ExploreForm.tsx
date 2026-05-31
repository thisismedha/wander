"use client";

import { useState } from "react";
import type { PartyType, TripInputs } from "@/types/itinerary";

const TRAVEL_STYLES = [
  "adventure",
  "cultural",
  "relaxation",
  "foodie",
  "budget backpacker",
  "luxury",
];

const BUDGET_TIERS = ["budget", "mid-range", "luxury"];

// TRIP-010: prompt enrichment — party type shapes accommodation and activity suitability
const PARTY_OPTIONS: { value: PartyType; label: string; description: string }[] = [
  { value: "solo",             label: "Solo",               description: "Just me" },
  { value: "couple",           label: "Couple",             description: "2 people" },
  { value: "small_group",      label: "Small group (3–6)",  description: "Friends or colleagues" },
  { value: "family_with_kids", label: "Family with kids",   description: "Adults + children" },
];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface Props {
  onSubmit: (inputs: TripInputs) => void;
  loading: boolean;
}

interface FormErrors {
  duration?: string;
  style?: string;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${MONTHS[s.getMonth()]} ${s.getDate()}–${e.getDate()} ${s.getFullYear()}`;
  }
  return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${MONTHS[e.getMonth()]} ${e.getDate()} ${e.getFullYear()}`;
}

function calcDays(start: string, end: string): number {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ExploreForm({ onSubmit, loading }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [daysInput, setDaysInput] = useState("");
  const [style, setStyle] = useState("");
  const [regionHint, setRegionHint] = useState("");
  const [partyType, setPartyType] = useState<PartyType>("solo");
  const [budget, setBudget] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [nationality, setNationality] = useState("");
  const [exploreScope, setExploreScope] = useState<("domestic" | "international")[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  // AI concept (TRIP-011): input schema design — date range unlocks calendar reasoning;
  // days-only produces a duration-only prompt path
  const calendarActive = !!(startDate || endDate);
  const calendarComplete = !!(startDate && endDate && endDate >= startDate);
  const computedDays = calendarComplete ? calcDays(startDate, endDate) : null;

  function toggleScope(value: "domestic" | "international") {
    setExploreScope((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  function clearDurationError() {
    if (errors.duration) setErrors((prev) => ({ ...prev, duration: undefined }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (startDate && !endDate) {
      e.duration = "Please select an end date";
    } else if (!calendarComplete && !daysInput.trim()) {
      e.duration = "Please enter travel dates or a number of days";
    } else if (!calendarComplete && daysInput && parseInt(daysInput) < 1) {
      e.duration = "Number of days must be at least 1";
    }
    if (!style) e.style = "Please select a travel theme";
    return e;
  }

  function buildDurationString(): string {
    if (calendarComplete) return formatDateRange(startDate, endDate);
    return `${parseInt(daysInput)} days`;
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
      duration: buildDurationString(),
      style,
      budget: budget || undefined,
      nationality: nationality.trim() || undefined,
      party_type: partyType,
      home_city: homeCity.trim() || undefined,
      explore_scope: exploreScope.length > 0 ? exploreScope : undefined,
      region_hint: regionHint.trim() || undefined,
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const mandatoryLabelClass = "mb-1 block text-sm font-medium text-slate-700";
  const optionalLabelClass = "mb-1 block text-sm font-medium text-slate-500";
  const errorClass = "mt-1 text-xs text-red-600";
  const errorBorder = "border-red-400 focus:border-red-400 focus:ring-red-400";
  const disabledClass = "bg-slate-100 cursor-not-allowed text-slate-400";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* ── Mandatory fields ─────────────────────────────── */}

      {/* Duration — mandatory
          AI concept (TRIP-011): date range unlocks holiday awareness (TRIP-009);
          days-only keeps the prompt path duration-only */}
      <div>
        <label className={mandatoryLabelClass}>
          How long? <span className="text-red-500">*</span>
        </label>
        <p className="mb-2 text-xs text-slate-400">
          Pick a date range <span className="text-slate-300">|</span> or enter a number of days
        </p>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="startDate" className="mb-1 block text-xs text-slate-500">Start date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              disabled={!!daysInput}
              onChange={(e) => { setStartDate(e.target.value); clearDurationError(); }}
              className={`${inputClass} ${errors.duration && calendarActive ? errorBorder : ""} ${daysInput ? disabledClass : ""}`}
            />
          </div>
          <span className="mb-2.5 text-slate-300">→</span>
          <div className="flex-1">
            <label htmlFor="endDate" className="mb-1 block text-xs text-slate-500">End date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              min={startDate || undefined}
              disabled={!!daysInput}
              onChange={(e) => { setEndDate(e.target.value); clearDurationError(); }}
              className={`${inputClass} ${errors.duration && calendarActive ? errorBorder : ""} ${daysInput ? disabledClass : ""}`}
            />
          </div>
        </div>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-36">
            <label htmlFor="days" className="mb-1 block text-xs text-slate-500">Number of days</label>
            <input
              id="days"
              type="number"
              min={1}
              placeholder="e.g. 7"
              value={calendarComplete ? String(computedDays) : daysInput}
              readOnly={calendarComplete}
              disabled={calendarActive && !calendarComplete}
              onChange={(e) => { if (!calendarActive) { setDaysInput(e.target.value); clearDurationError(); } }}
              className={`${inputClass} ${errors.duration && !calendarActive ? errorBorder : ""} ${calendarComplete ? disabledClass : ""} ${calendarActive && !calendarComplete ? disabledClass : ""}`}
            />
          </div>
          {calendarComplete && (
            <p className="mt-4 text-xs text-slate-400">Auto-calculated from dates</p>
          )}
        </div>

        {errors.duration && <p className={errorClass}>{errors.duration}</p>}
      </div>

      {/* Travel theme — mandatory */}
      <div>
        <label htmlFor="style" className={mandatoryLabelClass}>
          Travel theme <span className="text-red-500">*</span>
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => {
            setStyle(e.target.value);
            if (errors.style) setErrors((prev) => ({ ...prev, style: undefined }));
          }}
          className={`${inputClass} ${errors.style ? errorBorder : ""}`}
        >
          <option value="">Select a theme…</option>
          {TRAVEL_STYLES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        {errors.style && <p className={errorClass}>{errors.style}</p>}
      </div>

      {/* Home city — optional; appears right after Travel theme as it unlocks scope filtering
          AI concept (TRIP-009): conditional prompt branching — scope changes the LLM's destination pool */}
      <div>
        <label htmlFor="homeCity" className={optionalLabelClass}>
          Home city
          <span className="ml-1 font-normal text-slate-400 text-xs">— filters domestic / international</span>
        </label>
        <input
          id="homeCity"
          type="text"
          placeholder="e.g. London, UK"
          value={homeCity}
          onChange={(e) => {
            const val = e.target.value;
            setHomeCity(val);
            // Auto-check both scopes when home city is first filled; clear when emptied
            if (val.trim() && exploreScope.length === 0) {
              setExploreScope(["domestic", "international"]);
            } else if (!val.trim()) {
              setExploreScope([]);
            }
          }}
          className={inputClass}
        />
      </div>

      {/* Domestic / international filter — only shown when home city is filled */}
      {homeCity.trim() && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
            Trip type
          </p>
          <div className="flex gap-4">
            {(["domestic", "international"] as const).map((scope) => (
              <label key={scope} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={exploreScope.includes(scope)}
                  onChange={() => toggleScope(scope)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="capitalize">{scope}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Nationality — only shown when international scope is selected */}
      {exploreScope.includes("international") && (
        <div>
          <label htmlFor="nationality" className={optionalLabelClass}>
            Passport Nationality
            <span className="ml-1 font-normal text-slate-400 text-xs">— for visa advisory</span>
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
      )}

      {/* ── Optional fields ───────────────────────────────── */}

      <div className="flex items-center gap-3 pt-1">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Add more to personalise your suggestions
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* Region hint — optional; AI concept (TRIP-014): narrows LLM geographic search space */}
      <div>
        <label htmlFor="regionHint" className={optionalLabelClass}>
          Region or vibe
          <span className="ml-1 font-normal text-slate-400 text-xs">— e.g. Southeast Asia, somewhere warm</span>
        </label>
        <input
          id="regionHint"
          type="text"
          placeholder="e.g. Southeast Asia, somewhere warm, coastal"
          value={regionHint}
          onChange={(e) => setRegionHint(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Who's travelling — optional, defaults to solo */}
      <div>
        <label className={optionalLabelClass}>Who&apos;s travelling?</label>
        <div className="grid grid-cols-2 gap-2">
          {PARTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPartyType(opt.value)}
              className={`flex flex-col rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                partyType === opt.value
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              <span className="text-xs text-slate-400">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Budget tier — optional */}
      <div>
        <label htmlFor="budget" className={optionalLabelClass}>Budget Tier</label>
        <select
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a budget…</option>
          {BUDGET_TIERS.map((b) => (
            <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
          ))}
        </select>
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
            Finding destinations…
          </span>
        ) : (
          "Find My Destinations"
        )}
      </button>
    </form>
  );
}
