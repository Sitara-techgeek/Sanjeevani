from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"
    id         = Column(Integer, primary_key=True, index=True)
    email      = Column(String, unique=True, index=True, nullable=False)
    name       = Column(String, nullable=False)
    role       = Column(String, nullable=False)
    password   = Column(String, nullable=False)
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Hospital(Base):
    __tablename__ = "hospitals"
    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String, nullable=False)
    address          = Column(String)
    latitude         = Column(Float)
    longitude        = Column(Float)
    distance_km      = Column(Float, default=0.0)
    travel_time_min  = Column(Integer, default=0)
    beds_available   = Column(Integer, default=0)
    icu_available    = Column(Boolean, default=False)
    emergency_status = Column(String, default="Active")
    phone            = Column(String)
    trauma_specialist            = Column(Boolean, default=False)
    has_general_surgeon          = Column(Boolean, default=False)
    general_surgeon_start        = Column(Integer, default=0)
    general_surgeon_end          = Column(Integer, default=0)
    has_cardiologist             = Column(Boolean, default=False)
    cardiologist_start           = Column(Integer, default=0)
    cardiologist_end             = Column(Integer, default=0)
    has_neurosurgeon             = Column(Boolean, default=False)
    neurosurgeon_start           = Column(Integer, default=0)
    neurosurgeon_end             = Column(Integer, default=0)
    has_gynaecologist            = Column(Boolean, default=False)
    gynaecologist_start          = Column(Integer, default=0)
    gynaecologist_end            = Column(Integer, default=0)
    has_burn_specialist          = Column(Boolean, default=False)
    burn_specialist_start        = Column(Integer, default=0)
    burn_specialist_end          = Column(Integer, default=0)
    has_orthopaedic_surgeon      = Column(Boolean, default=False)
    orthopaedic_surgeon_start    = Column(Integer, default=0)
    orthopaedic_surgeon_end      = Column(Integer, default=0)
    has_toxicologist             = Column(Boolean, default=False)
    toxicologist_start           = Column(Integer, default=0)
    toxicologist_end             = Column(Integer, default=0)
    has_cardiothoracic_surgeon   = Column(Boolean, default=False)
    cardiothoracic_surgeon_start = Column(Integer, default=0)
    cardiothoracic_surgeon_end   = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)


class BloodBank(Base):
    __tablename__ = "blood_banks"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, nullable=False)
    address     = Column(String)
    latitude    = Column(Float)
    longitude   = Column(Float)
    distance_km = Column(Float, default=0.0)
    phone       = Column(String)
    a_pos  = Column(Integer, default=0)
    a_neg  = Column(Integer, default=0)
    b_pos  = Column(Integer, default=0)
    b_neg  = Column(Integer, default=0)
    ab_pos = Column(Integer, default=0)
    ab_neg = Column(Integer, default=0)
    o_pos  = Column(Integer, default=0)
    o_neg  = Column(Integer, default=0)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)


class TriageLog(Base):
    __tablename__ = "triage_logs"
    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id"))
    heart_rate     = Column(Integer)
    blood_pressure = Column(String)
    spo2           = Column(Integer)
    trauma_type    = Column(String)
    consciousness  = Column(String)
    blood_group    = Column(String)
    severity       = Column(String)
    required_specialist     = Column(String)
    recommended_hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=True)
    location_lat   = Column(Float)
    location_lng   = Column(Float)
    created_at     = Column(DateTime, default=datetime.utcnow)


class AmbulanceLocation(Base):
    __tablename__ = "ambulance_locations"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"))
    latitude   = Column(Float)
    longitude  = Column(Float)
    updated_at = Column(DateTime, default=datetime.utcnow)