from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MembershipOut(BaseModel):
    shop_id: int
    role: str

    class Config:
        from_attributes = True


# Lightweight models for technician dashboard
class CustomerLiteOut(BaseModel):
    id: int
    name: str
    phone: str


class JobSummaryOut(BaseModel):
    id: int
    status: str
    created_at: datetime
    customer: CustomerLiteOut


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: str
    shop_id: int

    class Config:
        from_attributes = True


class SignupIn(BaseModel):
    email: str
    password: str
    name: str
    shop_name: str


class LoginIn(BaseModel):
    email: str
    password: str


class AuthOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
    default_shop_id: Optional[int] = None


class JobCreate(BaseModel):
    shop_id: int
    customer_id: int
    vehicle_id: Optional[int] = None
    status: Optional[str] = "open"


class JobOut(BaseModel):
    id: int
    shop_id: int
    customer_id: int
    vehicle_id: Optional[int]
    assigned_user_id: Optional[int]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class JobUpdateCreate(BaseModel):
    status: Optional[str] = None
    summary: Optional[str] = None
    cost: Optional[float] = None
    needs_approval: bool = False
    notes: Optional[str] = None


class JobUpdateOut(BaseModel):
    id: int
    job_id: int
    status: Optional[str]
    summary: Optional[str]
    cost: Optional[float]
    needs_approval: bool
    approved: Optional[bool]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class CallOut(BaseModel):
    id: int
    shop_id: int
    job_id: Optional[int]
    job_update_id: Optional[int]
    customer_id: int
    appointment_id: Optional[int]
    call_type: str
    to_number: str
    from_number: str
    twilio_sid: Optional[str]
    status: str
    outcome: Optional[str]
    approval_result: Optional[str]
    recording_url: Optional[str]
    tts_path: Optional[str]
    created_at: datetime
    started_at: Optional[datetime]
    ended_at: Optional[datetime]

    class Config:
        from_attributes = True


class AppointmentCreate(BaseModel):
    shop_id: int
    customer_id: int
    starts_at: datetime
    ends_at: Optional[datetime] = None
    status: Optional[str] = "scheduled"
    location: Optional[str] = None
    notes: Optional[str] = None
    calendar_provider: Optional[str] = None
    calendar_event_id: Optional[str] = None


class AppointmentOut(BaseModel):
    id: int
    shop_id: int
    customer_id: int
    starts_at: datetime
    ends_at: Optional[datetime]
    status: str
    location: Optional[str]
    notes: Optional[str]
    calendar_provider: Optional[str]
    calendar_event_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
