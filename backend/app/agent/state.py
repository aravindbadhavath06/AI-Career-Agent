from typing import TypedDict


class AgentState(TypedDict):
    education: str
    skills: list[str]
    interests: list[str]
    career_goal: str