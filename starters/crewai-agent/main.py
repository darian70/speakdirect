from fastapi import FastAPI
from pydantic import BaseModel

try:
    from crewai import Agent, Task, Crew
except Exception:
    Agent = Task = Crew = None  # type: ignore

app = FastAPI(title="CrewAI Starter")

class Query(BaseModel):
    objective: str

@app.post("/run")
def run(q: Query):
    if Agent is None:
        return {"result": "Install crewai to run this starter"}
    researcher = Agent(role="Researcher", goal="Gather facts", backstory="Senior analyst")
    writer = Agent(role="Writer", goal="Synthesize", backstory="Tech writer")
    t1 = Task(description=f"Research: {q.objective}", agent=researcher)
    t2 = Task(description="Write concise brief with sources", agent=writer)
    crew = Crew(agents=[researcher, writer], tasks=[t1, t2])
    res = crew.kickoff()
    return {"result": str(res)}
