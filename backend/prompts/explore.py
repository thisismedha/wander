from typing import List, Optional

EXPLORE_SYSTEM_PROMPT = """
You are a world-class travel advisor. When a traveller hasn't decided where to go,
suggest destinations that genuinely fit their travel style, budget, and timing.

Rules:
- Return exactly 3 distinct destination suggestions.
- Each rationale must be specific to the traveller's stated preferences — do not use generic descriptions.
- Vary the suggestions: different regions, vibes, or experiences.
- Keep each rationale to 2-3 sentences.
- If a domestic/international scope filter is specified, strictly honour it.
""".strip()


def build_explore_prompt(
    duration: str,
    style: Optional[str],
    budget: Optional[str],
    nationality: Optional[str],
    home_city: Optional[str] = None,
    explore_scope: Optional[List[str]] = None,
    region_hint: Optional[str] = None,
) -> str:
    nat_str = f"Passport nationality: {nationality}" if nationality else "Nationality: not provided"
    home_str = f"\nHome city: {home_city}" if home_city else ""

    # AI concept (TRIP-014): region hint narrows the LLM's geographic search space without
    # being prescriptive — "Southeast Asia" or "somewhere warm" both work as soft constraints
    region_str = f"\nRegion preference: {region_hint} — prioritise destinations in or near this region." if region_hint else ""

    # AI concept (TRIP-009): conditional prompt branching — explore_scope changes which destination
    # pool the LLM draws from; None defaults to international (MVP behaviour preserved)
    scope_instruction = ""
    if home_city and explore_scope:
        only_domestic = explore_scope == ["domestic"]
        only_international = explore_scope == ["international"]
        both = "domestic" in explore_scope and "international" in explore_scope

        if only_domestic:
            scope_instruction = (
                f"\nIMPORTANT: Suggest only destinations WITHIN {home_city}'s country (domestic trips only)."
            )
        elif only_international:
            scope_instruction = (
                f"\nIMPORTANT: Suggest only destinations OUTSIDE {home_city}'s country (international trips only)."
            )
        elif both:
            scope_instruction = (
                f"\nInclude a mix: at least 1 destination within {home_city}'s country (domestic) "
                f"and at least 1 destination outside {home_city}'s country (international)."
            )

    style_str = f"Travel style: {style}" if style else "Travel style: not specified"
    budget_str = f"Budget tier: {budget}" if budget else "Budget tier: not specified"

    return f"""
The traveller hasn't chosen a destination. Suggest 3 destinations that suit their preferences.

Travel duration: {duration}
{style_str}
{budget_str}
{nat_str}{home_str}{region_str}{scope_instruction}

Return exactly 3 destination suggestions with rationale for each.
""".strip()
