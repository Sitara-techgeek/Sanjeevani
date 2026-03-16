from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from auth import require_admin
import ollama
import json

router = APIRouter(prefix="/upload", tags=["upload"])

async def read_text(file: UploadFile) -> str:
    content = await file.read()
    try:
        return content.decode("utf-8")
    except Exception:
        return content.decode("latin-1")

def parse_with_ollama(text: str, data_type: str) -> list:
    if data_type == "hospital":
        prompt = """Extract hospital data from the text below. Return ONLY a valid JSON array, no other text.
Each object must have exactly these keys:
name, address, latitude, longitude, beds_available, icu_available, emergency_status, phone,
trauma_specialist, has_general_surgeon, general_surgeon_start, general_surgeon_end,
has_cardiologist, cardiologist_start, cardiologist_end,
has_neurosurgeon, neurosurgeon_start, neurosurgeon_end,
has_gynaecologist, gynaecologist_start, gynaecologist_end,
has_burn_specialist, burn_specialist_start, burn_specialist_end,
has_orthopaedic_surgeon, orthopaedic_surgeon_start, orthopaedic_surgeon_end,
has_toxicologist, toxicologist_start, toxicologist_end,
has_cardiothoracic_surgeon, cardiothoracic_surgeon_start, cardiothoracic_surgeon_end.
For shift times use 24hr integers e.g. 8am=8, 10pm=22, 24hours means start=0 end=24, not available means start=0 end=0.
Boolean fields use true or false.
Text:\n""" + text[:3000]
    else:
        prompt = """Extract blood bank data from the text below. Return ONLY a valid JSON array, no other text.
Each object must have exactly these keys:
name, address, latitude, longitude, phone,
a_pos, a_neg, b_pos, b_neg, ab_pos, ab_neg, o_pos, o_neg.
All blood unit fields are integers. Unknown quantities = 0.
Text:\n""" + text[:3000]

    print(f"Sending to Ollama... data_type={data_type}")
    
    response = ollama.chat(
        model="mistral",
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response["message"]["content"].strip()
    print(f"Ollama raw response: {raw[:200]}")

    if raw.startswith("```"):
        lines = raw.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw = "\n".join(lines).strip()

    start = raw.find("[")
    end   = raw.rfind("]") + 1
    if start == -1 or end == 0:
        raise ValueError(f"No JSON array found in response: {raw[:200]}")

    return json.loads(raw[start:end])


@router.post("/hospitals")
async def upload_hospitals(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    text = await read_text(file)
    print(f"Received hospital file: {len(text)} chars")

    try:
        records = parse_with_ollama(text, "hospital")
        print(f"Parsed {len(records)} hospitals")
    except Exception as e:
        print(f"Parse error: {e}")
        raise HTTPException(status_code=400, detail=f"AI parsing failed: {str(e)}")

    added = 0
    for r in records:
        try:
            h = models.Hospital(
                name=r.get("name", "Unknown"),
                address=r.get("address"),
                latitude=r.get("latitude"),
                longitude=r.get("longitude"),
                beds_available=int(r.get("beds_available", 0)),
                icu_available=bool(r.get("icu_available", False)),
                emergency_status=r.get("emergency_status", "Active"),
                phone=r.get("phone"),
                trauma_specialist=bool(r.get("trauma_specialist", False)),
                has_general_surgeon=bool(r.get("has_general_surgeon", False)),
                general_surgeon_start=int(r.get("general_surgeon_start", 0)),
                general_surgeon_end=int(r.get("general_surgeon_end", 0)),
                has_cardiologist=bool(r.get("has_cardiologist", False)),
                cardiologist_start=int(r.get("cardiologist_start", 0)),
                cardiologist_end=int(r.get("cardiologist_end", 0)),
                has_neurosurgeon=bool(r.get("has_neurosurgeon", False)),
                neurosurgeon_start=int(r.get("neurosurgeon_start", 0)),
                neurosurgeon_end=int(r.get("neurosurgeon_end", 0)),
                has_gynaecologist=bool(r.get("has_gynaecologist", False)),
                gynaecologist_start=int(r.get("gynaecologist_start", 0)),
                gynaecologist_end=int(r.get("gynaecologist_end", 0)),
                has_burn_specialist=bool(r.get("has_burn_specialist", False)),
                burn_specialist_start=int(r.get("burn_specialist_start", 0)),
                burn_specialist_end=int(r.get("burn_specialist_end", 0)),
                has_orthopaedic_surgeon=bool(r.get("has_orthopaedic_surgeon", False)),
                orthopaedic_surgeon_start=int(r.get("orthopaedic_surgeon_start", 0)),
                orthopaedic_surgeon_end=int(r.get("orthopaedic_surgeon_end", 0)),
                has_toxicologist=bool(r.get("has_toxicologist", False)),
                toxicologist_start=int(r.get("toxicologist_start", 0)),
                toxicologist_end=int(r.get("toxicologist_end", 0)),
                has_cardiothoracic_surgeon=bool(r.get("has_cardiothoracic_surgeon", False)),
                cardiothoracic_surgeon_start=int(r.get("cardiothoracic_surgeon_start", 0)),
                cardiothoracic_surgeon_end=int(r.get("cardiothoracic_surgeon_end", 0)),
                updated_by=current_user.id
            )
            db.add(h)
            added += 1
        except Exception as e:
            print(f"Skipping record due to error: {e}")
            continue

    db.commit()
    return {"message": f"{added} hospital(s) added successfully", "count": added}


@router.post("/blood-banks")
async def upload_blood_banks(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    text = await read_text(file)
    print(f"Received blood bank file: {len(text)} chars")

    try:
        records = parse_with_ollama(text, "blood_bank")
        print(f"Parsed {len(records)} blood banks")
    except Exception as e:
        print(f"Parse error: {e}")
        raise HTTPException(status_code=400, detail=f"AI parsing failed: {str(e)}")

    added = 0
    for r in records:
        try:
            bb = models.BloodBank(
                name=r.get("name", "Unknown"),
                address=r.get("address"),
                latitude=r.get("latitude"),
                longitude=r.get("longitude"),
                phone=r.get("phone"),
                a_pos=int(r.get("a_pos", 0)),
                a_neg=int(r.get("a_neg", 0)),
                b_pos=int(r.get("b_pos", 0)),
                b_neg=int(r.get("b_neg", 0)),
                ab_pos=int(r.get("ab_pos", 0)),
                ab_neg=int(r.get("ab_neg", 0)),
                o_pos=int(r.get("o_pos", 0)),
                o_neg=int(r.get("o_neg", 0)),
                updated_by=current_user.id
            )
            db.add(bb)
            added += 1
        except Exception as e:
            print(f"Skipping record due to error: {e}")
            continue

    db.commit()
    return {"message": f"{added} blood bank(s) added successfully", "count": added}
