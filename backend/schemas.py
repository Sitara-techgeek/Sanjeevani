"""
AYUSETU Pydantic Schemas
HospitalBase includes specialist shift timing fields (start/end hours in 24hr format).
"""

from pydantic import BaseModel
from typing import Optional, List


class UserCreate(BaseModel):
    email: str
    name: str
    role: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str


class HospitalBase(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    beds_available: int = 0
    icu_available: bool = False
    emergency_status: str = "Active"
    phone: Optional[str] = None

    trauma_specialist: bool = False

    has_general_surgeon: bool = False
    general_surgeon_start: int = 0
    general_surgeon_end: int = 0

    has_cardiologist: bool = False
    cardiologist_start: int = 0
    cardiologist_end: int = 0

    has_neurosurgeon: bool = False
    neurosurgeon_start: int = 0
    neurosurgeon_end: int = 0

    has_gynaecologist: bool = False
    gynaecologist_start: int = 0
    gynaecologist_end: int = 0

    has_burn_specialist: bool = False
    burn_specialist_start: int = 0
    burn_specialist_end: int = 0

    has_orthopaedic_surgeon: bool = False
    orthopaedic_surgeon_start: int = 0
    orthopaedic_surgeon_end: int = 0

    has_toxicologist: bool = False
    toxicologist_start: int = 0
    toxicologist_end: int = 0

    has_cardiothoracic_surgeon: bool = False
    cardiothoracic_surgeon_start: int = 0
    cardiothoracic_surgeon_end: int = 0


class HospitalCreate(HospitalBase):
    pass


class HospitalOut(HospitalBase):
    id: int
    distance_km: float = 0.0
    travel_time_min: int = 0
    recommendation_score: Optional[int] = None
    required_specialist_available: Optional[bool] = None
    required_specialist_label: Optional[str] = None
    specialist_shift: Optional[str] = None

    class Config:
        from_attributes = True


class BloodBankBase(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    a_pos: int = 0
    a_neg: int = 0
    b_pos: int = 0
    b_neg: int = 0
    ab_pos: int = 0
    ab_neg: int = 0
    o_pos: int = 0
    o_neg: int = 0


class BloodBankOut(BloodBankBase):
    id: int
    distance_km: float = 0.0

    class Config:
        from_attributes = True


class TriageRequest(BaseModel):
    heart_rate: int
    blood_pressure: str
    spo2: int
    trauma_type: str
    consciousness: str
    blood_group: str
    latitude: float
    longitude: float


class TriageResponse(BaseModel):
    severity: str
    score: int
    reasons: List[str]
    required_specialist: str
    recommended_hospitals: List[HospitalOut]
    compatible_blood_banks: List[BloodBankOut]
    requires_blood: bool


class LocationUpdate(BaseModel):
    latitude: float
    longitude: float