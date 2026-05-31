export type TimeOfDay = "morning" | "afternoon" | "evening";

export type TravelStyle =
  | "adventure"
  | "cultural"
  | "relaxation"
  | "foodie"
  | "budget backpacker"
  | "luxury";

export type BudgetTier = "budget" | "mid-range" | "luxury";

export interface ActivitySlot {
  time_of_day: TimeOfDay;
  activity_name: string;
  description: string;
  style_fit: string;
}

export interface ItineraryDay {
  day_number: number;
  date_label: string;
  slots: ActivitySlot[];
}

export interface Itinerary {
  destination: string;
  duration_days: number;
  travel_style: string;
  budget_tier: string;
  days: ItineraryDay[];
  visa_note?: string | null;
  holiday_note?: string | null;
}

export type PartyType = "solo" | "couple" | "small_group" | "family_with_kids";

export interface TripInputs {
  destination?: string;
  duration: string;
  style?: TravelStyle | string;
  budget?: BudgetTier | string;
  nationality?: string;
  party_type?: PartyType;
  home_city?: string;
  explore_scope?: ("domestic" | "international")[];
  region_hint?: string;
}

export interface TweakRequest {
  current_itinerary: Itinerary;
  original_inputs: Record<string, string | undefined>;
  instruction: string;
}
