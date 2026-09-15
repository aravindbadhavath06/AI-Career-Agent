from langgraph.graph import StateGraph, START, END
from app.agent.state import AgentState


def analyze_profile(state: AgentState):
    return state


builder = StateGraph(AgentState)

builder.add_node("analyze_profile", analyze_profile)

builder.add_edge(START, "analyze_profile")
builder.add_edge("analyze_profile", END)

graph = builder.compile()