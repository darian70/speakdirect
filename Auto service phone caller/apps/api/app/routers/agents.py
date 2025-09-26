from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db import get_db
from app import models
from app.services.auth import get_current_user
from app.services.tenant import ensure_membership, require_role, get_active_shop_id
from app.services.limits import require_agent_quota

router = APIRouter()


class AgentCreate(BaseModel):
    shop_id: int
    name: str
    type: str | None = "phone"
    voice_id: str | None = None
    prompt: str | None = None
    language: str | None = None
    recording_policy: str | None = None
    quiet_hours_start: str | None = None
    quiet_hours_end: str | None = None
    phone_number_id: int | None = None


class AgentUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    voice_id: str | None = None
    prompt: str | None = None
    language: str | None = None
    recording_policy: str | None = None
    quiet_hours_start: str | None = None
    quiet_hours_end: str | None = None
    phone_number_id: int | None = None
    status: str | None = None


class AgentOut(BaseModel):
    id: int
    shop_id: int
    name: str
    type: str
    voice_id: str | None
    prompt: str | None
    language: str | None
    recording_policy: str | None
    quiet_hours_start: str | None
    quiet_hours_end: str | None
    phone_number_id: int | None
    status: str

    class Config:
        from_attributes = True


@router.get("/", response_model=list[AgentOut])
def list_agents(request: Request, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    shop_id = get_active_shop_id(request, user, db)
    ensure_membership(user, shop_id, db)
    rows = db.query(models.Agent).filter(models.Agent.shop_id == shop_id).order_by(models.Agent.created_at.desc()).all()
    return [AgentOut.model_validate(r) for r in rows]


@router.post("/", response_model=AgentOut)
def create_agent(payload: AgentCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, payload.shop_id, db)
    require_role(user, payload.shop_id, db, {"owner", "admin", "manager"})
    # Enforce plan quota for agent count
    require_agent_quota(db, payload.shop_id)

    agent = models.Agent(
        shop_id=payload.shop_id,
        name=payload.name,
        type=payload.type or "phone",
        voice_id=payload.voice_id,
        prompt=payload.prompt,
        language=payload.language,
        recording_policy=payload.recording_policy,
        quiet_hours_start=payload.quiet_hours_start,
        quiet_hours_end=payload.quiet_hours_end,
        phone_number_id=payload.phone_number_id,
        status="active",
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return AgentOut.model_validate(agent)


@router.patch("/{agent_id}", response_model=AgentOut)
def update_agent(agent_id: int, payload: AgentUpdate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    agent = db.get(models.Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    ensure_membership(user, agent.shop_id, db)
    require_role(user, agent.shop_id, db, {"owner", "admin", "manager"})

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(agent, field, value)
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return AgentOut.model_validate(agent)
