export interface DestinationSuggestion {
  destination: string;
  rationale: string;
  best_time_to_visit?: string | null;
  trip_type?: "domestic" | "international" | null;
}

export interface ExploreSuggestions {
  suggestions: DestinationSuggestion[];
}
