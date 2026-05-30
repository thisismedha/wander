from typing import Optional

EXPLORE_SYSTEM_PROMPT = """
You are a world-class travel advisor. When a traveller hasn't decided where to go,
suggest destinations that genuinely fit their travel style, budget, and timing.

Rules:
- Return exactly 3 distinct destination suggestions.
- Each rationale must be specific to the traveller's stated preferences — do not use generic descriptions.
- Vary the suggestions: different regions, vibes, or experiences.
- Keep each rationale to 2-3 sentences.
""".strip()


def build_explore_prompt(
    duration: str,
    style: str,
    budget: str,
    nationality: Optional[str],
) -> str:
    nat_str = f"Passport nationality: {nationality}" if nationality else "Nationality: not provided"
    return f"""
The traveller hasn't chosen a destination. Suggest 3 destinations that suit their preferences.

Travel duration: {duration}
Travel style: {style}
Budget tier: {budget}
{nat_str}

Return exactly 3 destination suggestions with rationale for each.
""".strip()
