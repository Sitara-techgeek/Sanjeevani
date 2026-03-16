from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import require_ambulance
from services.triage_engine import classify_severity, requires_blood, get_required_specialist
from services.hospital_ranker import rank_hospitals, rank_blood_banks
from datetime import datetime

router = APIRouter(prefix="/triage", tags=["triage"])


@router.post("", response_model=schemas.TriageResponse)
def run_triage(
    req: schemas.TriageRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_ambulance),
):
    systolic = int(req.blood_pressure.split("/")[0])

    severity, score, reasons = classify_severity(
        req.heart_rate, systolic, req.spo2,
        req.consciousness, req.trauma_type,
    )

    specialist_config = get_required_specialist(req.trauma_type)
    required_specialist = specialist_config["specialist_label"]

    hospitals   = db.query(models.Hospital).all()
    blood_banks = db.query(models.BloodBank).all()
    need_blood  = requires_blood(req.trauma_type, severity)

    top_hospitals = rank_hospitals(
        hospitals, severity, req.trauma_type,
        req.latitude, req.longitude,
    )
    comp_banks = (
        rank_blood_banks(blood_banks, req.blood_group, req.latitude, req.longitude)
        if need_blood else []
    )

    # Persist log
    log = models.TriageLog(
        user_id=current_user.id,
        heart_rate=req.heart_rate,
        blood_pressure=req.blood_pressure,
        spo2=req.spo2,
        trauma_type=req.trauma_type,
        consciousness=req.consciousness,
        blood_group=req.blood_group,
        severity=severity,
        required_specialist=required_specialist,
        recommended_hospital_id=top_hospitals[0].id if top_hospitals else None,
        location_lat=req.latitude,
        location_lng=req.longitude,
        created_at=datetime.utcnow(),
    )
    db.add(log)
    db.commit()

    # Build response
    hosp_out = []
    for h in top_hospitals:
        d = {c.name: getattr(h, c.name) for c in h.__table__.columns}
        d["recommendation_score"]          = h.recommendation_score
        d["required_specialist_available"] = h.required_specialist_available
        d["required_specialist_label"]     = h.required_specialist_label
        hosp_out.append(schemas.HospitalOut.model_validate(d))

    bb_out = [
        schemas.BloodBankOut.model_validate(
            {c.name: getattr(b, c.name) for c in b.__table__.columns}
        )
        for b in comp_banks
    ]

    return schemas.TriageResponse(
        severity=severity,
        score=score,
        reasons=reasons,
        required_specialist=required_specialist,
        recommended_hospitals=hosp_out,
        compatible_blood_banks=bb_out,
        requires_blood=need_blood,
    )