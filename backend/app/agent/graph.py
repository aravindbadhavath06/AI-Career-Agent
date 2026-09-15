from langgraph.graph import StateGraph, START, END
from app.agent.state import AgentState
from app.gemini import ask_gemini


def analyze_profile(state: AgentState):
    prompt = f"""
Analyze this student's career profile.

Education: {state['education']}
Skills: {', '.join(state['skills'])}
Interests: {', '.join(state['interests'])}
Career Goal: {state['career_goal']}

Give a short analysis covering:
1. Current strengths
2. Career suitability
3. Important areas to improve
"""

    analysis = ask_gemini(prompt)

    return {"profile_analysis": analysis}


def career_matching(state: AgentState):
    prompt = f"""
Recommend the best career path for this student.

Education: {state['education']}
Skills: {', '.join(state['skills'])}
Interests: {', '.join(state['interests'])}
Career Goal: {state['career_goal']}

Profile Analysis:
{state['profile_analysis']}

Give:
1. Recommended career
2. Match score out of 100
3. Short reason for the recommendation
"""

    match = ask_gemini(prompt)

    return {"career_match": match}


def skill_gap_analysis(state: AgentState):
    prompt = f"""
Analyze the student's skill gaps for their recommended career.

Current Skills: {', '.join(state['skills'])}

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

    return {"skill_gaps": gaps}


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

    return {"roadmap": roadmap}


builder = StateGraph(AgentState)

builder.add_node("analyze_profile", analyze_profile)
builder.add_node("career_matching", career_matching)
builder.add_node("skill_gap_analysis", skill_gap_analysis)
builder.add_node("roadmap_generation", roadmap_generation)

builder.add_edge(START, "analyze_profile")
builder.add_edge("analyze_profile", "career_matching")
builder.add_edge("career_matching", "skill_gap_analysis")
builder.add_edge("skill_gap_analysis", "roadmap_generation")
builder.add_edge("roadmap_generation", END)

graph = builder.compile()