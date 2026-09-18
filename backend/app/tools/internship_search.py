from urllib.parse import quote


def search_internships(query: str, skills: list[str] = None, limit: int = 5):

    skills = skills or []

    search_url = (
        "https://internship.aicte-india.org/internships?q="
        + quote(query)
    )

    matching_skills = skills

    return [
        {
            "title": f"{query} Internships",
            "company": "AICTE National Internship Portal",
            "location": "India",
            "matching_skills": matching_skills,
            "match_percentage": 100 if matching_skills else 0,
            "description": (
                f"Search AICTE-verified internships related to {query}."
            ),
            "url": search_url
        }
    ][:limit]