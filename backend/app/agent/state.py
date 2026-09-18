from typing import TypedDict


class AgentState(TypedDict):

    education: str
    skills: list[str]
    interests: list[str]
    career_goal: str
    opportunity_type: str

    profile_analysis: str
    career_match: str

    private_job_matches: str
    government_job_matches: str
    internship_matches: str

    skill_gaps: str
    roadmap: str