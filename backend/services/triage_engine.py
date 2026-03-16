"""
AYUSETU Triage Engine v2
Severity classification + time-aware specialist scoring.
Specialists are only counted as available if current time falls within their shift.
"""

from datetime import datetime

TRAUMA_CONFIG = {
    "Cardiac Emergency": {
        "specialist_key":   "has_cardiologist",
        "specialist_start": "cardiologist_start",
        "specialist_end":   "cardiologist_end",
        "specialist_label": "Cardiologist",
        "severity_score":   3,
        "needs_blood":      True,
    },
    "Head Injury": {
        "specialist_key":   "has_neurosurgeon",
        "specialist_start": "neurosurgeon_start",
        "specialist_end":   "neurosurgeon_end",
        "specialist_label": "Neurosurgeon",
        "severity_score":   2,
        "needs_blood":      False,
    },
    "Heavy Bleeding": {
        "specialist_key":   "has_general_surgeon",
        "specialist_start": "general_surgeon_start",
        "specialist_end":   "general_surgeon_end",
        "specialist_label": "General Surgeon",
        "severity_score":   3,
        "needs_blood":      True,
    },
    "Maternal Emergency": {
        "specialist_key":   "has_gynaecologist",
        "specialist_start": "gynaecologist_start",
        "specialist_end":   "gynaecologist_end",
        "specialist_label": "Gynaecologist",
        "severity_score":   3,
        "needs_blood":      True,
    },
    "Burn Injury": {
        "specialist_key":   "has_burn_specialist",
        "specialist_start": "burn_specialist_start",
        "specialist_end":   "burn_specialist_end",
        "specialist_label": "Burn Specialist",
        "severity_score":   2,
        "needs_blood":      False,
    },
    "Spinal Injury": {
        "specialist_key":   "has_neurosurgeon",
        "specialist_start": "neurosurgeon_start",
        "specialist_end":   "neurosurgeon_end",
        "specialist_label": "Neurosurgeon",
        "severity_score":   3,
        "needs_blood":      False,
    },
    "Chest Trauma": {
        "specialist_key":   "has_cardiothoracic_surgeon",
        "specialist_start": "cardiothoracic_surgeon_start",
        "specialist_end":   "cardiothoracic_surgeon_end",
        "specialist_label": "Cardiothoracic Surgeon",
        "severity_score":   3,
        "needs_blood":      True,
    },
    "Fracture": {
        "specialist_key":   "has_orthopaedic_surgeon",
        "specialist_start": "orthopaedic_surgeon_start",
        "specialist_end":   "orthopaedic_surgeon_end",
        "specialist_label": "Orthopaedic Surgeon",
        "severity_score":   1,
        "needs_blood":      False,
    },
    "Poisoning": {
        "specialist_key":   "has_toxicologist",
        "specialist_start": "toxicologist_start",
        "specialist_end":   "toxicologist_end",
        "specialist_label": "Toxicologist",
        "severity_score":   2,
        "needs_blood":      False,
    },
    "Other": {
        "specialist_key":   "has_general_surgeon",
        "specialist_start": "general_surgeon_start",
        "specialist_end":   "general_surgeon_end",
        "specialist_label": "General Surgeon",
        "severity_score":   1,
        "needs_blood":      False,
    },
}

BLOOD_GROUP_MAP = {
    "A+": "a_pos", "A-": "a_neg",
    "B+": "b_pos", "B-": "b_neg",
    "AB+": "ab_pos", "AB-": "ab_neg",
    "O+": "o_pos", "O-": "o_neg",
}


def is_specialist_available_now(hospital, start_key: str, end_key: str) -> bool:
    start = getattr(hospital, start_key, 0)
    end   = getattr(hospital, end_key, 0)
    if start == 0 and end == 0:
        return False
    if start == 0 and end == 24:
        return True
    current_hour = datetime.now().hour
    if start < end:
        return start <= current_hour < end
    else:
        return current_hour >= start or current_hour < end


def get_required_specialist(trauma_type: str) -> dict:
    return TRAUMA_CONFIG.get(trauma_type, TRAUMA_CONFIG["Other"])


def classify_severity(heart_rate, systolic, spo2, consciousness, trauma_type):
    score   = 0
    reasons = []

    if spo2 < 85:
        score += 4; reasons.append(f"Critically low SpO2 ({spo2}%)")
    elif spo2 < 90:
        score += 3; reasons.append(f"Dangerously low SpO2 ({spo2}%)")
    elif spo2 < 95:
        score += 1; reasons.append(f"Below-normal SpO2 ({spo2}%)")

    if heart_rate > 150 or heart_rate < 40:
        score += 3; reasons.append(f"Extreme heart rate ({heart_rate} bpm)")
    elif heart_rate > 120 or heart_rate < 50:
        score += 2; reasons.append(f"Abnormal heart rate ({heart_rate} bpm)")
    elif heart_rate > 100:
        score += 1; reasons.append(f"Elevated heart rate ({heart_rate} bpm)")

    if systolic < 80:
        score += 4; reasons.append(f"Severely low BP ({systolic} mmHg)")
    elif systolic < 90:
        score += 3; reasons.append(f"Critically low BP ({systolic} mmHg)")
    elif systolic < 110:
        score += 1; reasons.append(f"Low BP ({systolic} mmHg)")

    consciousness_map = {"Unresponsive": 4, "Responds to Pain": 2, "Confused": 1, "Alert": 0}
    c = consciousness_map.get(consciousness, 0)
    if c > 0:
        score += c; reasons.append(f"Consciousness: {consciousness}")

    config = TRAUMA_CONFIG.get(trauma_type, TRAUMA_CONFIG["Other"])
    t = config["severity_score"]
    if t > 0:
        score += t
        reasons.append(f"Trauma: {trauma_type} — requires {config['specialist_label']}")

    if score >= 7:   severity = "Critical"
    elif score >= 3: severity = "Moderate"
    else:            severity = "Stable"

    return severity, score, reasons


def score_hospital(hospital, severity: str, trauma_type: str) -> int:
    score = 0
    m = 1.5 if severity == "Critical" else 1.2 if severity == "Moderate" else 1.0

    if hospital.icu_available:
        score += 30 if severity == "Critical" else 15
    elif severity == "Critical":
        score -= 20

    config    = TRAUMA_CONFIG.get(trauma_type, TRAUMA_CONFIG["Other"])
    has_key   = config["specialist_key"]
    start_key = config["specialist_start"]
    end_key   = config["specialist_end"]

    hospital_has  = getattr(hospital, has_key, False)
    available_now = hospital_has and is_specialist_available_now(hospital, start_key, end_key)

    if available_now:
        score += int(35 * m)
    elif hospital_has:
        score += int(10 * m)
    elif severity == "Critical":
        score -= 25

    if hospital.trauma_specialist:
        score += int(10 * m)

    score += min(hospital.beds_available, 20)
    penalty = 2.5 if severity == "Critical" else 1.5
    score -= hospital.travel_time_min * penalty
    if hospital.emergency_status == "Active":
        score += 10

    return round(score)


def requires_blood(trauma_type: str, severity: str) -> bool:
    config = TRAUMA_CONFIG.get(trauma_type, TRAUMA_CONFIG["Other"])
    return config["needs_blood"] or severity == "Critical"


def get_units(blood_bank, blood_group: str) -> int:
    field = BLOOD_GROUP_MAP.get(blood_group, "")
    return getattr(blood_bank, field, 0)