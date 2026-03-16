from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import require_admin, get_current_user
from typing import List

router = APIRouter(prefix="/blood-banks", tags=["blood-banks"])

@router.get("", response_model=List[schemas.BloodBankOut])
def get_blood_banks(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(models.BloodBank).all()

@router.post("", response_model=schemas.BloodBankOut)
def add_blood_bank(data: schemas.BloodBankBase, db: Session = Depends(get_db),
                   current_user: models.User = Depends(require_admin)):
    bb = models.BloodBank(**data.model_dump(), updated_by=current_user.id)
    db.add(bb); db.commit(); db.refresh(bb)
    return bb

@router.delete("/{bb_id}")
def delete_blood_bank(bb_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    bb = db.query(models.BloodBank).filter(models.BloodBank.id == bb_id).first()
    if not bb: raise HTTPException(404, "Not found")
    db.delete(bb); db.commit()
    return {"message": "Deleted"}