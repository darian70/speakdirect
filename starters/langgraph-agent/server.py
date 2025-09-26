from fastapi import FastAPI
from pydantic import BaseModel
from graph import run_agent
from observability import init_observability

app = FastAPI(title="LangGraph Agent")
init_observability("langgraph-agent", fastapi_app=app)

class Query(BaseModel):
    input: str

@app.post("/run")
def run(q: Query):
    return {"result": run_agent(q.input)}
