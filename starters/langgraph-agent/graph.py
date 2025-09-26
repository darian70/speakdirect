from typing import TypedDict
from pydantic import BaseModel, Field

# Replace with langgraph imports when running:
# from langgraph.graph import StateGraph, END
# from langchain_openai import ChatOpenAI

# Minimal typed state
class AgentState(TypedDict):
    input: str
    plan: str
    result: str

class SearchTool(BaseModel):
    query: str = Field(..., description="Query to search")

# Placeholder to show structure. Replace with actual LangGraph once installed.
def run_agent(input_text: str) -> str:
    # Step 1: plan
    plan = "Plan: answer the question, cite sources, ask follow-up if needed."
    # Step 2: call tools (stub)
    tool = SearchTool(query=input_text)
    # Step 3: synthesize answer
    result = f"{plan} | Answer for: {tool.query} (stub)."
    return result

if __name__ == "__main__":
    print(run_agent("What is LangGraph?"))
