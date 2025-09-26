from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Lead(BaseModel):
    name: str
    email: str
    company: str | None = None
    topic: str | None = None

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/leads")
def leads(lead: Lead):
    return {"ok": True, "lead": lead.model_dump()}
