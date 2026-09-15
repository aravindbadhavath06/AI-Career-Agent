from app.agent.graph import graph


result = graph.invoke({
    "education": "B.Tech",
    "skills": ["Python", "SQL"],
    "interests": ["Data Analysis"],
    "career_goal": "Data Scientist"
})

print(result)