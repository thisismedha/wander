export interface DestinationSuggestion {
  destination: string;
  rationale: string;
}

export interface ExploreSuggestions {
  suggestions: DestinationSuggestion[];
}
