from app.agent.graph import graph

result = graph.invoke({
    "education": "B.Tech",
    "skills": ["Python", "SQL"],
    "interests": ["Data Analysis"],
    "career_goal": "Data Scientist",
    "opportunity_type": "PRIVATE_JOB"
})

print("\n========== PROFILE ANALYSIS ==========")
print(result["profile_analysis"])

print("\n========== CAREER MATCH ==========")
print(result["career_match"])

print("\n========== PRIVATE JOB MATCHES ==========")
print(result["private_job_matches"])

print("\n========== SKILL GAPS ==========")
print(result["skill_gaps"])

print("\n========== ROADMAP ==========")
print(result["roadmap"])