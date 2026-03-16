from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import require_admin, get_current_user
from typing import List

router = APIRouter(prefix="/hospitals", tags=["hospitals"])


@router.get("", response_model=List[schemas.HospitalOut])
def get_hospitals(
    db: Session = Depends(get_db),
    _=Depends(get_current_user)
):
    """
    Returns all hospitals from the database.
    Accessible by both admin and ambulance users.
    """
    return db.query(models.Hospital).all()


@router.post("", response_model=schemas.HospitalOut)
def add_hospital(
    data: schemas.HospitalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    """
    Adds a new hospital record.
    Admin only.
    """
    h = models.Hospital(**data.model_dump(), updated_by=current_user.id)
    db.add(h)
    db.commit()
    db.refresh(h)
    return h


@router.put("/{hospital_id}", response_model=schemas.HospitalOut)
def update_hospital(
    hospital_id: int,
    data: schemas.HospitalCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin)
):
    """
    Updates an existing hospital record by ID.
    Admin only.
    """
    h = db.query(models.Hospital).filter(models.Hospital.id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    for key, value in data.model_dump().items():
        setattr(h, key, value)
    db.commit()
    db.refresh(h)
    return h


@router.delete("/{hospital_id}")
def delete_hospital(
    hospital_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin)
):
    """
    Deletes a hospital record by ID.
    Admin only.
    """
    h = db.query(models.Hospital).filter(models.Hospital.id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    db.delete(h)
    db.commit()
    return {"message": "Hospital deleted successfully"}