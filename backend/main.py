from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import auth, hospitals, blood_banks, triage, upload
from routers.location import socket_app
import models
import bcrypt

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sanjeevani API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://sanjeevani-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(hospitals.router)
app.include_router(blood_banks.router)
app.include_router(triage.router)
app.include_router(upload.router)

app.mount("/", socket_app)


def hash(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def seed_database():
    db = SessionLocal()
    try:
        if db.query(models.User).count() == 0:
            db.add_all([
                models.User(email="admin@sanjeevani.com",      name="Admin",       role="admin",     password=hash("Admin@123"),  is_active=True),
                models.User(email="paramedic1@sanjeevani.com", name="Paramedic 1", role="ambulance", password=hash("Para1@123"),  is_active=True),
                models.User(email="paramedic2@sanjeevani.com", name="Paramedic 2", role="ambulance", password=hash("Para2@123"),  is_active=True),
            ])
            print("Users seeded")

        if db.query(models.Hospital).count() == 0:
            db.add_all([
                models.Hospital(name="Apollo Hospitals Jubilee Hills", address="Jubilee Hills, Hyderabad", latitude=17.4318, longitude=78.4071, beds_available=14, icu_available=True, emergency_status="Active", phone="+91-40-2360-7777", trauma_specialist=True, has_general_surgeon=True, general_surgeon_start=0, general_surgeon_end=24, has_cardiologist=True, cardiologist_start=8, cardiologist_end=22, has_neurosurgeon=True, neurosurgeon_start=9, neurosurgeon_end=21, has_gynaecologist=True, gynaecologist_start=8, gynaecologist_end=20, has_burn_specialist=False, burn_specialist_start=0, burn_specialist_end=0, has_orthopaedic_surgeon=True, orthopaedic_surgeon_start=9, orthopaedic_surgeon_end=21, has_toxicologist=True, toxicologist_start=10, toxicologist_end=18, has_cardiothoracic_surgeon=True, cardiothoracic_surgeon_start=8, cardiothoracic_surgeon_end=20),
                models.Hospital(name="KIMS Hospital Secunderabad", address="Minister Road, Secunderabad", latitude=17.4399, longitude=78.4983, beds_available=6, icu_available=True, emergency_status="Active", phone="+91-40-4488-5000", trauma_specialist=True, has_general_surgeon=True, general_surgeon_start=0, general_surgeon_end=24, has_cardiologist=True, cardiologist_start=7, cardiologist_end=23, has_neurosurgeon=True, neurosurgeon_start=8, neurosurgeon_end=20, has_gynaecologist=True, gynaecologist_start=9, gynaecologist_end=21, has_burn_specialist=False, burn_specialist_start=0, burn_specialist_end=0, has_orthopaedic_surgeon=True, orthopaedic_surgeon_start=8, orthopaedic_surgeon_end=20, has_toxicologist=False, toxicologist_start=0, toxicologist_end=0, has_cardiothoracic_surgeon=True, cardiothoracic_surgeon_start=9, cardiothoracic_surgeon_end=21),
                models.Hospital(name="Yashoda Hospital Somajiguda", address="Raj Bhavan Road, Somajiguda", latitude=17.4234, longitude=78.4567, beds_available=20, icu_available=True, emergency_status="Active", phone="+91-40-4567-4567", trauma_specialist=True, has_general_surgeon=True, general_surgeon_start=0, general_surgeon_end=24, has_cardiologist=False, cardiologist_start=0, cardiologist_end=0, has_neurosurgeon=True, neurosurgeon_start=9, neurosurgeon_end=17, has_gynaecologist=True, gynaecologist_start=0, gynaecologist_end=24, has_burn_specialist=True, burn_specialist_start=8, burn_specialist_end=20, has_orthopaedic_surgeon=False, orthopaedic_surgeon_start=0, orthopaedic_surgeon_end=0, has_toxicologist=False, toxicologist_start=0, toxicologist_end=0, has_cardiothoracic_surgeon=False, cardiothoracic_surgeon_start=0, cardiothoracic_surgeon_end=0),
                models.Hospital(name="Care Hospitals Banjara Hills", address="Road No. 1, Banjara Hills", latitude=17.4156, longitude=78.4483, beds_available=10, icu_available=True, emergency_status="Active", phone="+91-40-3041-5050", trauma_specialist=True, has_general_surgeon=True, general_surgeon_start=0, general_surgeon_end=24, has_cardiologist=True, cardiologist_start=8, cardiologist_end=22, has_neurosurgeon=False, neurosurgeon_start=0, neurosurgeon_end=0, has_gynaecologist=True, gynaecologist_start=7, gynaecologist_end=22, has_burn_specialist=False, burn_specialist_start=0, burn_specialist_end=0, has_orthopaedic_surgeon=True, orthopaedic_surgeon_start=9, orthopaedic_surgeon_end=21, has_toxicologist=True, toxicologist_start=9, toxicologist_end=17, has_cardiothoracic_surgeon=False, cardiothoracic_surgeon_start=0, cardiothoracic_surgeon_end=0),
                models.Hospital(name="Osmania General Hospital", address="Afzal Gunj, Hyderabad", latitude=17.3724, longitude=78.4737, beds_available=30, icu_available=True, emergency_status="Active", phone="+91-40-2453-9100", trauma_specialist=True, has_general_surgeon=True, general_surgeon_start=0, general_surgeon_end=24, has_cardiologist=True, cardiologist_start=8, cardiologist_end=20, has_neurosurgeon=True, neurosurgeon_start=0, neurosurgeon_end=24, has_gynaecologist=True, gynaecologist_start=0, gynaecologist_end=24, has_burn_specialist=True, burn_specialist_start=0, burn_specialist_end=24, has_orthopaedic_surgeon=True, orthopaedic_surgeon_start=0, orthopaedic_surgeon_end=24, has_toxicologist=True, toxicologist_start=8, toxicologist_end=20, has_cardiothoracic_surgeon=True, cardiothoracic_surgeon_start=9, cardiothoracic_surgeon_end=21),
            ])
            print("Hospitals seeded")

        if db.query(models.BloodBank).count() == 0:
            db.add_all([
                models.BloodBank(name="Red Cross Blood Bank",      address="Himayatnagar, Hyderabad", latitude=17.4062, longitude=78.4691, phone="+91-40-2322-1234", a_pos=8,  a_neg=2, b_pos=5, b_neg=0, ab_pos=3, ab_neg=1, o_pos=12, o_neg=4),
                models.BloodBank(name="Rotary Blood Bank",         address="Nampally, Hyderabad",     latitude=17.3850, longitude=78.4741, phone="+91-40-2461-5678", a_pos=6,  a_neg=0, b_pos=9, b_neg=3, ab_pos=0, ab_neg=2, o_pos=7,  o_neg=0),
                models.BloodBank(name="Osmania General Blood Bank",address="Afzal Gunj, Hyderabad",   latitude=17.3724, longitude=78.4737, phone="+91-40-2453-9101", a_pos=4,  a_neg=0, b_pos=3, b_neg=1, ab_pos=5, ab_neg=0, o_pos=15, o_neg=8),
                models.BloodBank(name="Lions Blood Bank",          address="King Koti, Hyderabad",    latitude=17.3950, longitude=78.4850, phone="+91-40-2475-1234", a_pos=10, a_neg=3, b_pos=7, b_neg=2, ab_pos=4, ab_neg=1, o_pos=9,  o_neg=5),
            ])
            print("Blood banks seeded")

        db.commit()
        print("Database ready")
    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
    finally:
        db.close()


seed_database()


@app.get("/health")
def health():
    return {"message": "Sanjeevani API running", "docs": "/docs"}
