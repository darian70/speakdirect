from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Boolean, Numeric

from app.db import Base


class Shop(Base):
    __tablename__ = "shops"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    plan: Mapped[str] = mapped_column(String(50), default="basic_answer")  # basic_answer, assistant_calendar, assistant_outbound, service_shop
    record_calls: Mapped[bool] = mapped_column(Boolean, default=True)
    default_timezone: Mapped[Optional[str]] = mapped_column(String(64), default="America/Los_Angeles")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    users: Mapped[list["User"]] = relationship("User", back_populates="shop")
    customers: Mapped[list["Customer"]] = relationship("Customer", back_populates="shop")
    jobs: Mapped[list["Job"]] = relationship("Job", back_populates="shop")
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="shop")
    phone_numbers: Mapped[list["PhoneNumber"]] = relationship("PhoneNumber", back_populates="shop")
    agents: Mapped[list["Agent"]] = relationship("Agent", back_populates="shop")
    memberships: Mapped[list["Membership"]] = relationship("Membership", back_populates="shop")


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(50), default="tech")
    password_hash: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    shop: Mapped[Shop] = relationship("Shop", back_populates="users")
    memberships: Mapped[list["Membership"]] = relationship("Membership", back_populates="user")


class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(32), index=True)
    preferred_language: Mapped[Optional[str]] = mapped_column(String(8), default="en")
    timezone: Mapped[Optional[str]] = mapped_column(String(64), default=None)
    call_window_start: Mapped[Optional[str]] = mapped_column(String(5), default=None)  # HH:MM
    call_window_end: Mapped[Optional[str]] = mapped_column(String(5), default=None)  # HH:MM
    recording_consent: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    shop: Mapped[Shop] = relationship("Shop", back_populates="customers")
    vehicles: Mapped[list["Vehicle"]] = relationship("Vehicle", back_populates="customer")


class Vehicle(Base):
    __tablename__ = "vehicles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    year: Mapped[Optional[int]] = mapped_column(Integer)
    make: Mapped[Optional[str]] = mapped_column(String(50))
    model: Mapped[Optional[str]] = mapped_column(String(50))
    vin: Mapped[Optional[str]] = mapped_column(String(64), index=True)

    customer: Mapped[Customer] = relationship("Customer", back_populates="vehicles")
    jobs: Mapped[list["Job"]] = relationship("Job", back_populates="vehicle")


class Job(Base):
    __tablename__ = "jobs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"))
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    vehicle_id: Mapped[Optional[int]] = mapped_column(ForeignKey("vehicles.id"))
    assigned_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    shop: Mapped[Shop] = relationship("Shop", back_populates="jobs")
    customer: Mapped[Customer] = relationship("Customer")
    vehicle: Mapped[Optional[Vehicle]] = relationship("Vehicle", back_populates="jobs")
    assigned_to: Mapped[Optional["User"]] = relationship("User")
    updates: Mapped[list["JobUpdate"]] = relationship("JobUpdate", back_populates="job")


class JobUpdate(Base):
    __tablename__ = "job_updates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.id"))
    status: Mapped[Optional[str]] = mapped_column(String(50))
    summary: Mapped[Optional[str]] = mapped_column(Text)
    cost: Mapped[Optional[float]] = mapped_column(Numeric(10, 2))
    needs_approval: Mapped[bool] = mapped_column(Boolean, default=False)
    approved: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    job: Mapped[Job] = relationship("Job", back_populates="updates")
    calls: Mapped[list["Call"]] = relationship("Call", back_populates="job_update")


class Appointment(Base):
    __tablename__ = "appointments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"))
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    starts_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(32), default="scheduled")  # scheduled, confirmed, canceled, completed
    location: Mapped[Optional[str]] = mapped_column(String(255))
    notes: Mapped[Optional[str]] = mapped_column(Text)
    calendar_provider: Mapped[Optional[str]] = mapped_column(String(32))  # google, outlook
    calendar_event_id: Mapped[Optional[str]] = mapped_column(String(128))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    shop: Mapped[Shop] = relationship("Shop", back_populates="appointments")
    customer: Mapped[Customer] = relationship("Customer")


class Call(Base):
    __tablename__ = "calls"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"))
    job_id: Mapped[Optional[int]] = mapped_column(ForeignKey("jobs.id"), nullable=True)
    job_update_id: Mapped[Optional[int]] = mapped_column(ForeignKey("job_updates.id"), nullable=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    appointment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("appointments.id"), nullable=True)
    call_type: Mapped[str] = mapped_column(String(32), default="job_update")  # job_update, appt_reminder, inbound
    to_number: Mapped[str] = mapped_column(String(32))
    from_number: Mapped[str] = mapped_column(String(32))
    twilio_sid: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    status: Mapped[str] = mapped_column(String(32), default="queued")
    outcome: Mapped[Optional[str]] = mapped_column(String(64))
    approval_result: Mapped[Optional[str]] = mapped_column(String(16))  # approved/declined/none
    recording_url: Mapped[Optional[str]] = mapped_column(Text)
    tts_path: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    job_update: Mapped[JobUpdate] = relationship("JobUpdate", back_populates="calls")
    appointment: Mapped[Optional[Appointment]] = relationship("Appointment")


class CallTranscript(Base):
    __tablename__ = "call_transcripts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    call_id: Mapped[int] = mapped_column(ForeignKey("calls.id"))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class IntegrationCredential(Base):
    __tablename__ = "integration_credentials"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"))
    provider: Mapped[str] = mapped_column(String(32))  # 'google'
    token_json: Mapped[str] = mapped_column(Text)  # serialized token dict
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Membership(Base):
    __tablename__ = "memberships"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"))
    role: Mapped[str] = mapped_column(String(50), default="viewer")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="memberships")
    shop: Mapped["Shop"] = relationship("Shop", back_populates="memberships")


class PhoneNumber(Base):
    __tablename__ = "phone_numbers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"))
    provider: Mapped[str] = mapped_column(String(32), default="twilio")
    number: Mapped[str] = mapped_column(String(32), index=True)  # unique in migration
    friendly_name: Mapped[Optional[str]] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(16), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    shop: Mapped[Shop] = relationship("Shop", back_populates="phone_numbers")
    agents: Mapped[list["Agent"]] = relationship("Agent", back_populates="phone_number")


class Agent(Base):
    __tablename__ = "agents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"))
    name: Mapped[str] = mapped_column(String(200))
    type: Mapped[str] = mapped_column(String(32), default="phone")  # phone, web, ...
    voice_id: Mapped[Optional[str]] = mapped_column(String(64))
    prompt: Mapped[Optional[str]] = mapped_column(Text)
    language: Mapped[Optional[str]] = mapped_column(String(16))
    recording_policy: Mapped[Optional[str]] = mapped_column(String(16))  # inherit/shop/always/never
    quiet_hours_start: Mapped[Optional[str]] = mapped_column(String(5))
    quiet_hours_end: Mapped[Optional[str]] = mapped_column(String(5))
    phone_number_id: Mapped[Optional[int]] = mapped_column(ForeignKey("phone_numbers.id"))
    status: Mapped[str] = mapped_column(String(16), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    shop: Mapped[Shop] = relationship("Shop", back_populates="agents")
    phone_number: Mapped[Optional[PhoneNumber]] = relationship("PhoneNumber", back_populates="agents")
