import math
from typing import Dict, Any, List
from ..schemas import ShelfLifePredictInput

def calculate_shelf_life(payload: ShelfLifePredictInput) -> Dict[str, Any]:
    # Baseline shelf life at 4°C chilled conditions
    base_shelf_life_map = {
        "apples": 90,
        "tomatoes": 21,
        "strawberries": 10,
        "leafy greens": 12,
        "fresh produce": 14,
        "potato chips": 180,
        "dry goods": 365,
        "fresh meat": 7,
        "dairy cheese": 45,
        "milk": 14,
        "bakery": 8
    }

    key = payload.commodity_type.lower()
    base_days = 14
    for k, v in base_shelf_life_map.items():
        if k in key:
            base_days = v
            break

    # Temperature kinetic acceleration (Q10 factor typically 2.0 to 2.5 for food spoilage)
    q10 = 2.2
    ref_temp = 4.0 # °C reference
    temp_diff = payload.storage_temp - ref_temp
    temp_acceleration = math.pow(q10, temp_diff / 10.0)

    # Relative humidity penalty if exceeding optimum
    rh_factor = 1.0
    if payload.relative_humidity > 85:
        rh_factor += (payload.relative_humidity - 85) * 0.015
    elif payload.relative_humidity < 60:
        rh_factor += (60 - payload.relative_humidity) * 0.01

    # Barrier improvement multiplier
    barrier_multiplier = 1.0
    mat_lower = payload.material_type.lower()
    if "evoh" in mat_lower or "aluminum" in mat_lower or "metal" in mat_lower or payload.packaging_barrier_grade == "ultra-high":
        barrier_multiplier = 1.6
    elif "bopp" in mat_lower or "pet" in mat_lower or payload.packaging_barrier_grade == "high-barrier":
        barrier_multiplier = 1.3
    elif "ldpe" in mat_lower or "paper" in mat_lower:
        barrier_multiplier = 1.0

    # Final predicted shelf life in days
    predicted_days = max(1.0, round((base_days * barrier_multiplier) / (temp_acceleration * rh_factor), 1))
    decay_rate = round(1.0 / predicted_days, 4)

    # Generate temperature & humidity sensitivity curve
    temp_range = [0, 4, 10, 15, 20, 25, 30]
    sensitivity_curve = []
    for t in temp_range:
        t_acc = math.pow(q10, (t - ref_temp) / 10.0)
        est_days = max(1.0, round((base_days * barrier_multiplier) / (t_acc * rh_factor), 1))
        sensitivity_curve.append({
            "temperature_c": t,
            "shelf_life_days": est_days,
            "quality_loss_rate": round(1.0 / est_days, 3)
        })

    note = f"At {payload.storage_temp}°C and {payload.relative_humidity}% RH, estimated shelf life is {predicted_days} days. Keeping storage under 4°C can extend shelf life up to {sensitivity_curve[0]['shelf_life_days']} days."

    return {
        "commodity": payload.commodity_type,
        "material": payload.material_type,
        "predicted_shelf_life_days": predicted_days,
        "decay_rate_per_day": decay_rate,
        "q10_factor": q10,
        "sensitivity_curve": sensitivity_curve,
        "recommendation_note": note
    }
