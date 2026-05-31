import type { ItineraryDay, TimeOfDay } from "@/types/itinerary";

const SLOT_STYLES: Record<TimeOfDay, { label: string; bg: string; text: string }> = {
  morning: { label: "Morning", bg: "bg-amber-50", text: "text-amber-700" },
  afternoon: { label: "Afternoon", bg: "bg-sky-50", text: "text-sky-700" },
  evening: { label: "Evening", bg: "bg-violet-50", text: "text-violet-700" },
};

const SLOT_ORDER: TimeOfDay[] = ["morning", "afternoon", "evening"];

interface Props {
  day: ItineraryDay;
}

export default function DayCard({ day }: Props) {
  const sortedSlots = [...day.slots].sort(
    (a, b) => SLOT_ORDER.indexOf(a.time_of_day) - SLOT_ORDER.indexOf(b.time_of_day)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Day header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {day.day_number}
          </span>
          <h3 className="text-base font-semibold text-slate-900">{day.date_label}</h3>
        </div>
        {day.weather && (
          <div className="text-right">
            <div className="text-sm font-medium text-slate-700">
              {day.weather.icon} {day.weather.high_c}° / {day.weather.low_c}° · {day.weather.description}
            </div>
            <div className="text-xs text-slate-400">typical for this time of year</div>
          </div>
        )}
      </div>

      {/* Slots */}
      <div className="divide-y divide-slate-100">
        {sortedSlots.map((slot, idx) => {
          const style = SLOT_STYLES[slot.time_of_day] ?? SLOT_STYLES.morning;
          return (
            <div key={idx} className="px-5 py-4">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
                >
                  {style.label}
                </span>
                <span className="text-sm font-semibold text-slate-800">{slot.activity_name}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{slot.description}</p>
              <p className="mt-1 text-xs italic text-slate-400">{slot.style_fit}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
