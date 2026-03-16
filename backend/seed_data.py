"""
AYUSETU Seed Data
Real and semi-real hospitals in Hyderabad with specialist shift timings.
Run this once after starting the backend to populate the database.
Specialist availability is checked against current time before scoring.
"""

from database import SessionLocal, engine, Base
import models
from datetime import datetime

Base.metadata.create_all(bind=engine)


HOSPITALS = [
    {
        "name": "Apollo Hospitals Jubilee Hills",
        "address": "Plot No. 251, Rd No. 78, Film Nagar, Jubilee Hills, Hyderabad",
        "latitude": 17.4318,
        "longitude": 78.4071,
        "beds_available": 14,
        "icu_available": True,
        "emergency_status": "Active",
        "phone": "+91-40-2360-7777",
        "trauma_specialist": True,
        "has_general_surgeon": True,
        "general_surgeon_start": 0,
        "general_surgeon_end": 24,
        "has_cardiologist": True,
        "cardiologist_start": 8,
        "cardiologist_end": 22,
        "has_neurosurgeon": True,
        "neurosurgeon_start": 9,
        "neurosurgeon_end": 21,
        "has_gynaecologist": True,
        "gynaecologist_start": 8,
        "gynaecologist_end": 20,
        "has_burn_specialist": False,
        "burn_specialist_start": 0,
        "burn_specialist_end": 0,
        "has_orthopaedic_surgeon": True,
        "orthopaedic_surgeon_start": 9,
        "orthopaedic_surgeon_end": 21,
        "has_toxicologist": True,
        "toxicologist_start": 10,
        "toxicologist_end": 18,
        "has_cardiothoracic_surgeon": True,
        "cardiothoracic_surgeon_start": 8,
        "cardiothoracic_surgeon_end": 20,
    },
    {
        "name": "KIMS Hospital Secunderabad",
        "address": "1-8-31/1, Minister Road, Secunderabad, Hyderabad",
        "latitude": 17.4399,
        "longitude": 78.4983,
        "beds_available": 6,
        "icu_available": True,
        "emergency_status": "Active",
        "phone": "+91-40-4488-5000",
        "trauma_specialist": True,
        "has_general_surgeon": True,
        "general_surgeon_start": 0,
        "general_surgeon_end": 24,
        "has_cardiologist": True,
        "cardiologist_start": 7,
        "cardiologist_end": 23,
        "has_neurosurgeon": True,
        "neurosurgeon_start": 8,
        "neurosurgeon_end": 20,
        "has_gynaecologist": True,
        "gynaecologist_start": 9,
        "gynaecologist_end": 21,
        "has_burn_specialist": False,
        "burn_specialist_start": 0,
        "burn_specialist_end": 0,
        "has_orthopaedic_surgeon": True,
        "orthopaedic_surgeon_start": 8,
        "orthopaedic_surgeon_end": 20,
        "has_toxicologist": False,
        "toxicologist_start": 0,
        "toxicologist_end": 0,
        "has_cardiothoracic_surgeon": True,
        "cardiothoracic_surgeon_start": 9,
        "cardiothoracic_surgeon_end": 21,
    },
    {
        "name": "Yashoda Hospital Somajiguda",
        "address": "Raj Bhavan Road, Somajiguda, Hyderabad",
        "latitude": 17.4234,
        "longitude": 78.4567,
        "beds_available": 20,
        "icu_available": True,
        "emergency_status": "Active",
        "phone": "+91-40-4567-4567",
        "trauma_specialist": True,
        "has_general_surgeon": True,
        "general_surgeon_start": 0,
        "general_surgeon_end": 24,
        "has_cardiologist": False,
        "cardiologist_start": 0,
        "cardiologist_end": 0,
        "has_neurosurgeon": True,
        "neurosurgeon_start": 9,
        "neurosurgeon_end": 17,
        "has_gynaecologist": True,
        "gynaecologist_start": 0,
        "gynaecologist_end": 24,
        "has_burn_specialist": True,
        "burn_specialist_start": 8,
        "burn_specialist_end": 20,
        "has_orthopaedic_surgeon": False,
        "orthopaedic_surgeon_start": 0,
        "orthopaedic_surgeon_end": 0,
        "has_toxicologist": False,
        "toxicologist_start": 0,
        "toxicologist_end": 0,
        "has_cardiothoracic_surgeon": False,
        "cardiothoracic_surgeon_start": 0,
        "cardiothoracic_surgeon_end": 0,
    },
    {
        "name": "Care Hospitals Banjara Hills",
        "address": "Road No. 1, Banjara Hills, Hyderabad",
        "latitude": 17.4156,
        "longitude": 78.4483,
        "beds_available": 10,
        "icu_available": True,
        "emergency_status": "Active",
        "phone": "+91-40-3041-5050",
        "trauma_specialist": True,
        "has_general_surgeon": True,
        "general_surgeon_start": 0,
        "general_surgeon_end": 24,
        "has_cardiologist": True,
        "cardiologist_start": 8,
        "cardiologist_end": 22,
        "has_neurosurgeon": False,
        "neurosurgeon_start": 0,
        "neurosurgeon_end": 0,
        "has_gynaecologist": True,
        "gynaecologist_start": 7,
        "gynaecologist_end": 22,
        "has_burn_specialist": False,
        "burn_specialist_start": 0,
        "burn_specialist_end": 0,
        "has_orthopaedic_surgeon": True,
        "orthopaedic_surgeon_start": 9,
        "orthopaedic_surgeon_end": 21,
        "has_toxicologist": True,
        "toxicologist_start": 9,
        "toxicologist_end": 17,
        "has_cardiothoracic_surgeon": False,
        "cardiothoracic_surgeon_start": 0,
        "cardiothoracic_surgeon_end": 0,
    },
    {
        "name": "Osmania General Hospital",
        "address": "Afzal Gunj, Hyderabad",
        "latitude": 17.3724,
        "longitude": 78.4737,
        "beds_available": 30,
        "icu_available": True,
        "emergency_status": "Active",
        "phone": "+91-40-2453-9100",
        "trauma_specialist": True,
        "has_general_surgeon": True,
        "general_surgeon_start": 0,
        "general_surgeon_end": 24,
        "has_cardiologist": True,
        "cardiologist_start": 8,
        "cardiologist_end": 20,
        "has_neurosurgeon": True,
        "neurosurgeon_start": 0,
        "neurosurgeon_end": 24,
        "has_gynaecologist": True,
        "gynaecologist_start": 0,
        "gynaecologist_end": 24,
        "has_burn_specialist": True,
        "burn_specialist_start": 0,
        "burn_specialist_end": 24,
        "has_orthopaedic_surgeon": True,
        "orthopaedic_surgeon_start": 0,
        "orthopaedic_surgeon_end": 24,
        "has_toxicologist": True,
        "toxicologist_start": 8,
        "toxicologist_end": 20,
        "has_cardiothoracic_surgeon": True,
        "cardiothoracic_surgeon_start": 9,
        "cardiothoracic_surgeon_end": 21,
    },
]

BLOOD_BANKS = [
    {
        "name": "Red Cross Blood Bank",
        "address": "Himayatnagar, Hyderabad",
        "latitude": 17.4062,
        "longitude": 78.4691,
        "phone": "+91-40-2322-1234",
        "a_pos": 8, "a_neg": 2,
        "b_pos": 5, "b_neg": 0,
        "ab_pos": 3, "ab_neg": 1,
        "o_pos": 12, "o_neg": 4,
    },
    {
        "name": "Rotary Blood Bank",
        "address": "Nampally, Hyderabad",
        "latitude": 17.3850,
        "longitude": 78.4741,
        "phone": "+91-40-2461-5678",
        "a_pos": 6, "a_neg": 0,
        "b_pos": 9, "b_neg": 3,
        "ab_pos": 0, "ab_neg": 2,
        "o_pos": 7, "o_neg": 0,
    },
    {
        "name": "Osmania General Blood Bank",
        "address": "Afzal Gunj, Hyderabad",
        "latitude": 17.3724,
        "longitude": 78.4737,
        "phone": "+91-40-2453-9101",
        "a_pos": 4, "a_neg": 0,
        "b_pos": 3, "b_neg": 1,
        "ab_pos": 5, "ab_neg": 0,
        "o_pos": 15, "o_neg": 8,
    },
    {
        "name": "Lions Blood Bank",
        "address": "King Koti, Hyderabad",
        "latitude": 17.3950,
        "longitude": 78.4850,
        "phone": "+91-40-2475-1234",
        "a_pos": 10, "a_neg": 3,
        "b_pos": 7, "b_neg": 2,
        "ab_pos": 4, "ab_neg": 1,
        "o_pos": 9, "o_neg": 5,
    },
]


def seed():
    db = SessionLocal()
    try:
        if db.query(models.Hospital).count() == 0:
            for h in HOSPITALS:
                db.add(models.Hospital(**h))
            print(f"Seeded {len(HOSPITALS)} hospitals")
        else:
            print("Hospitals already exist — skipping")

        if db.query(models.BloodBank).count() == 0:
            for bb in BLOOD_BANKS:
                db.add(models.BloodBank(**bb))
            print(f"Seeded {len(BLOOD_BANKS)} blood banks")
        else:
            print("Blood banks already exist — skipping")

        db.commit()
        print("Seed complete")
    except Exception as e:
        db.rollback()
        print(f"Seed failed: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
