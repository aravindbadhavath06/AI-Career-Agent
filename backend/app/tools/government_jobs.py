from urllib.parse import quote


def search_government_jobs(query: str, limit: int = 5):

    search_query = quote(query)

    return [
        {
            "title": f"{query} Government Jobs",
            "organization": "UPSC",
            "location": "India",
            "eligibility": "Check the official recruitment notification.",
            "description": (
                f"Search official UPSC recruitment opportunities "
                f"related to {query}."
            ),
            "url": (
                "https://www.upsc.gov.in/recruitment/"
                "recruitment-advertisement"
            )
        },
        {
            "title": f"{query} Government Jobs",
            "organization": "National Career Service (NCS)",
            "location": "India",
            "eligibility": "Check the official job notification.",
            "description": (
                f"Search government job opportunities related to "
                f"{query} on the National Career Service portal."
            ),
            "url": (
                "https://www.ncs.gov.in/"
            )
        }
    ][:limit]