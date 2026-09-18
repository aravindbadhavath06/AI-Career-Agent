from langgraph.graph import StateGraph, START, END
from app.agent.state import AgentState
from app.gemini import ask_gemini
from app.tools.job_search import search_private_jobs
from app.tools.government_jobs import search_government_jobs
from app.tools.internship_search import search_internships


def analyze_profile(state: AgentState):
    prompt = f"""
Analyze this student's career profile.

Education: {state['education']}
Skills: {', '.join(state['skills'])}
Interests: {', '.join(state['interests'])}
Career Goal: {state['career_goal']}
Opportunity Type: {state['opportunity_type']}

Give a short analysis covering:
1. Current strengths
2. Career suitability
3. Important areas to improve
"""

    analysis = ask_gemini(prompt)

    return {
        "profile_analysis": analysis
    }


def career_matching(state: AgentState):
    prompt = f"""
Recommend the best career path for this student.

Education: {state['education']}
Skills: {', '.join(state['skills'])}
Interests: {', '.join(state['interests'])}
Career Goal: {state['career_goal']}
Opportunity Type: {state['opportunity_type']}

Profile Analysis:
{state['profile_analysis']}

Give:
1. Recommended career
2. Match score out of 100
3. Short reason for the recommendation
"""

    match = ask_gemini(prompt)

    return {
        "career_match": match
    }


def private_job_matching(state: AgentState):

    jobs = search_private_jobs(
        state["career_goal"],
        state["skills"],
        5
    )

    matches = []

    for job in jobs:

        if "error" in job:
            continue

        matches.append({
            "job_title": job.get("title"),
            "company": job.get("company"),
            "job_type": job.get("job_type"),
            "location": job.get("location"),
            "salary": job.get("salary"),
            "matching_skills": job.get("matching_skills", []),
            "match_percentage": job.get(
                "match_percentage", 0
            ),
            "url": job.get("url")
        })

    matches.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    return {
        "private_job_matches": str(matches)
    }


def opportunity_matching(state: AgentState):

    if state["opportunity_type"] == "PRIVATE_JOB":

        return private_job_matching(state)

    if state["opportunity_type"] == "GOVERNMENT_JOB":

        jobs = search_government_jobs(
            state["career_goal"],
            5
        )

        return {
            "government_job_matches": str(jobs)
        }

    if state["opportunity_type"] == "INTERNSHIP":

        internships = search_internships(
            state["career_goal"],
            5
        )

        return {
            "internship_matches": str(internships)
        }

    return {
        "private_job_matches": "",
        "government_job_matches": "",
        "internship_matches": ""
    }


def skill_gap_analysis(state: AgentState):

    prompt = f"""
Analyze the student's skill gaps for their recommended career.

Current Skills:
{', '.join(state['skills'])}

Recommended Career:
{state['career_match']}

Identify:

1. Missing technical skills
2. Missing tools or technologies
3. Important knowledge areas
4. What the student should learn first

Keep the answer practical and concise.
"""

    gaps = ask_gemini(prompt)

    return {
        "skill_gaps": gaps
    }


def roadmap_generation(state: AgentState):

    prompt = f"""
Create a practical learning roadmap for this student.

Career Goal:
{state['career_goal']}

Current Skills:
{', '.join(state['skills'])}

Skill Gap Analysis:
{state['skill_gaps']}

Create a roadmap in 4 stages:

1. Foundation
2. Core Skills
3. Projects
4. Job Preparation

For each stage, give the important topics and practical tasks.

Keep it concise and actionable.
"""

    roadmap = ask_gemini(prompt)

    return {
        "roadmap": roadmap
    }


# Create LangGraph
builder = StateGraph(AgentState)


# Add nodes
builder.add_node("analyze_profile", analyze_profile)
builder.add_node("career_matching", career_matching)
builder.add_node("opportunity_matching", opportunity_matching)
builder.add_node("skill_gap_analysis", skill_gap_analysis)
builder.add_node("roadmap_generation", roadmap_generation)


# Define flow
builder.add_edge(
    START,
    "analyze_profile"
)

builder.add_edge(
    "analyze_profile",
    "career_matching"
)

builder.add_edge(
    "career_matching",
    "opportunity_matching"
)

builder.add_edge(
    "opportunity_matching",
    "skill_gap_analysis"
)

builder.add_edge(
    "skill_gap_analysis",
    "roadmap_generation"
)

builder.add_edge(
    "roadmap_generation",
    END
)


# Compile graph
graph = builder.compile()