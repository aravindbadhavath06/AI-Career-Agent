import requests


def search_private_jobs(
    query: str,
    skills: list[str] = None,
    limit: int = 5
):
    url = "https://remotive.com/api/remote-jobs"

    params = {
        "search": query
    }

    headers = {
        "User-Agent": "Agent-Nexora/1.0"
    }

    try:
        response = requests.get(
            url,
            params=params,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()
        data = response.json()

        skills = skills or []
        skills_lower = [skill.lower() for skill in skills]

        query_words = query.lower().split()
        matches = []

        for job in data.get("jobs", []):

            title = job.get("title", "")
            title_lower = title.lower()

            # Check whether the job title is related to the career goal
            title_match = any(
                word in title_lower
                for word in query_words
                if len(word) > 2
            )

            # Skip clearly unrelated jobs
            if not title_match:
                continue

            text = (
                f"{title} "
                f"{job.get('description', '')}"
            ).lower()

            matching_skills = [
                skill
                for skill in skills
                if skill.lower() in text
            ]

            skill_score = round(
                len(matching_skills)
                / max(len(skills_lower), 1)
                * 100
            )

            matches.append({
                "id": job.get("id"),
                "title": title,
                "company": job.get("company_name"),
                "job_type": job.get("job_type"),
                "location": job.get(
                    "candidate_required_location"
                ),
                "salary": job.get("salary"),
                "matching_skills": matching_skills,
                "match_percentage": skill_score,
                "url": job.get("url"),
                "description": job.get("description")
            })

        matches.sort(
            key=lambda job: job["match_percentage"],
            reverse=True
        )

        return matches[:limit]

    except requests.RequestException as e:
        return {
            "error": str(e)
        }