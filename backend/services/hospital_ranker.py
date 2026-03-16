"""
AYUSETU Hospital Ranker
Ranks hospitals by score. Attaches specialist availability and shift label.
"""

import math
from services.triage_engine import score_hospital, get_units, TRAUMA_CONFIG, is_specialist_available_now


def haversine_km(lat1, lon1, lat2, lon2) -> float:
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1))
         * math.cos(math.radians(lat2))
         * math.sin(dlon / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def estimate_travel_time(distance_km: float, speed_kmh: float = 40) -> int:
    return max(1, round((distance_km / speed_kmh) * 60))


def rank_hospitals(hospitals, severity: str, trauma_type: str,
                   amb_lat: float, amb_lng: float, top_n: int = 3):
    config        = TRAUMA_CONFIG.get(trauma_type, TRAUMA_CONFIG["Other"])
    specialist_key   = config["specialist_key"]
    specialist_label = config["specialist_label"]
    start_key        = config["specialist_start"]
    end_key          = config["specialist_end"]

    results = []
    for h in hospitals:
        if h.latitude and h.longitude:
            dist = haversine_km(amb_lat, amb_lng, h.latitude, h.longitude)
            h.distance_km     = round(dist, 1)
            h.travel_time_min = estimate_travel_time(dist)

        h.recommendation_score = score_hospital(h, severity, trauma_type)

        hospital_has  = getattr(h, specialist_key, False)
        available_now = hospital_has and is_specialist_available_now(h, start_key, end_key)

        h.required_specialist_available = available_now
        h.required_specialist_label     = specialist_label

        if hospital_has:
            s = getattr(h, start_key, 0)
            e = getattr(h, end_key, 0)
            if s == 0 and e == 24:
                h.specialist_shift = "Available 24/7"
            elif s == 0 and e == 0:
                h.specialist_shift = "Not available"
            else:
                h.specialist_shift = f"Shift: {s:02d}:00 – {e:02d}:00"
        else:
            h.specialist_shift = "Not available at this hospital"

        results.append(h)

    return sorted(results, key=lambda x: x.recommendation_score, reverse=True)[:top_n]


def rank_blood_banks(blood_banks, blood_group: str,
                     amb_lat: float, amb_lng: float):
    results = []
    for bb in blood_banks:
        if get_units(bb, blood_group) > 0:
            if bb.latitude and bb.longitude:
                dist = haversine_km(amb_lat, amb_lng, bb.latitude, bb.longitude)
                bb.distance_km = round(dist, 1)
            results.append(bb)
    return sorted(results, key=lambda x: x.distance_km)