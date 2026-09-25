from typing import Dict, Any
from ..schemas import SustainabilityInput

MATERIAL_EMISSION_FACTORS = {
    "ldpe": {"co2_per_kg": 2.1, "score": 60, "cost_per_kg": 1.6, "recyclable": True, "bio": False},
    "hdpe": {"co2_per_kg": 1.9, "score": 68, "cost_per_kg": 1.7, "recyclable": True, "bio": False},
    "pet": {"co2_per_kg": 2.8, "score": 75, "cost_per_kg": 2.1, "recyclable": True, "bio": False},
    "bopp": {"co2_per_kg": 2.3, "score": 58, "cost_per_kg": 1.9, "recyclable": True, "bio": False},
    "pla": {"co2_per_kg": 0.8, "score": 92, "cost_per_kg": 3.4, "recyclable": False, "bio": True},
    "evoh": {"co2_per_kg": 3.6, "score": 45, "cost_per_kg": 4.8, "recyclable": False, "bio": False},
    "aluminum": {"co2_per_kg": 8.5, "score": 35, "cost_per_kg": 5.2, "recyclable": True, "bio": False},
    "paper": {"co2_per_kg": 1.1, "score": 88, "cost_per_kg": 1.4, "recyclable": True, "bio": True},
}

def analyze_sustainability_cost(payload: SustainabilityInput) -> Dict[str, Any]:
    mat_key = "ldpe"
    name_lower = payload.material_name.lower()
    for k in MATERIAL_EMISSION_FACTORS.keys():
        if k in name_lower:
            mat_key = k
            break

    profile = MATERIAL_EMISSION_FACTORS[mat_key]
    
    # Weight calculations
    weight_kg_per_unit = payload.pack_weight_grams / 1000.0
    total_material_kg = weight_kg_per_unit * payload.production_volume_units
    
    total_co2_kg = round(total_material_kg * profile["co2_per_kg"], 2)
    co2_per_unit_g = round(weight_kg_per_unit * profile["co2_per_kg"] * 1000.0, 2)

    total_cost = round(total_material_kg * profile["cost_per_kg"] * 1.35, 2) # including processing margin
    cost_per_unit = round(total_cost / max(1, payload.production_volume_units), 4)

    recyclability = "Fully Mechanically Recyclable (Class A)" if profile["recyclable"] else "Specialized Industrial Composting or Energy Recovery"

    eco_rec = (
        f"Switching from conventional foil to {payload.material_name} provides a {profile['score']}/100 "
        f"Life Cycle Assessment (LCA) score. Estimated carbon footprint is {co2_per_unit_g}g CO₂e per pouch."
    )

    return {
        "material_name": payload.material_name,
        "sustainability_score": float(profile["score"]),
        "carbon_footprint_total_kg_co2": total_co2_kg,
        "carbon_per_unit_g_co2": co2_per_unit_g,
        "recyclability_rating": recyclability,
        "biodegradability": profile["bio"],
        "cost_estimate_usd": total_cost,
        "cost_per_unit_usd": cost_per_unit,
        "eco_recommendation": eco_rec
    }
