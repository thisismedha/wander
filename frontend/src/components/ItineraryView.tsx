import type { Itinerary } from "@/types/itinerary";
import DayCard from "./DayCard";

interface Props {
  itinerary: Itinerary;
}

export default function ItineraryView({ itinerary }: Props) {
  return (
    <div className="space-y-6">
      {/* Trip summary header */}
      <div className="rounded-2xl bg-indigo-600 px-6 py-5 text-white shadow">
        <h2 className="text-2xl font-bold">{itinerary.destination}</h2>
        <p className="mt-1 text-indigo-200">
          {itinerary.duration_days} day{itinerary.duration_days !== 1 ? "s" : ""} &middot;{" "}
          <span className="capitalize">{itinerary.travel_style}</span> &middot;{" "}
          <span className="capitalize">{itinerary.budget_tier}</span>
        </p>
      </div>

      {/* Visa note */}
      {itinerary.visa_note && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <span className="mr-1 font-semibold">Visa advisory:</span>
          {itinerary.visa_note}
        </div>
      )}

      {/* Day cards */}
      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <DayCard key={day.day_number} day={day} />
        ))}
      </div>
    </div>
  );
}
