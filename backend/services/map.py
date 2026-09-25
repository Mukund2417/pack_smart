import math
from typing import Dict, Any, Optional
from ..schemas import MapAdvisorInput

# ─────────────────────────────────────────────────────────────────────────────
# Known Michaelis-Menten kinetic parameters for common commodity groups.
# Source: Fonseca et al. (2002), Saltveit (2004), industry packaging engineering.
# Vm: max respiration rate (mg O2 / kg·hr), Km: Michaelis constant (% O2)
# ─────────────────────────────────────────────────────────────────────────────
RESPIRATION_KINETICS: Dict[str, Dict] = {
    "berry":      {"vm": 45.0, "km": 2.0, "rq": 1.2, "target_o2": (3, 8),  "target_co2": (10, 20)},
    "strawberry": {"vm": 45.0, "km": 2.0, "rq": 1.2, "target_o2": (3, 8),  "target_co2": (10, 20)},
    "mushroom":   {"vm": 60.0, "km": 1.8, "rq": 1.1, "target_o2": (3, 8),  "target_co2": (10, 20)},
    "spinach":    {"vm": 55.0, "km": 1.5, "rq": 1.0, "target_o2": (2, 5),  "target_co2": (5, 15)},
    "broccoli":   {"vm": 50.0, "km": 1.8, "rq": 1.0, "target_o2": (2, 5),  "target_co2": (5, 15)},
    "leafy":      {"vm": 48.0, "km": 1.5, "rq": 1.0, "target_o2": (2, 5),  "target_co2": (5, 15)},
    "greens":     {"vm": 48.0, "km": 1.5, "rq": 1.0, "target_o2": (2, 5),  "target_co2": (5, 15)},
    "apple":      {"vm": 8.0,  "km": 3.0, "rq": 1.0, "target_o2": (1, 3),  "target_co2": (1, 5)},
    "pear":       {"vm": 8.0,  "km": 3.0, "rq": 1.0, "target_o2": (1, 3),  "target_co2": (1, 5)},
    "mango":      {"vm": 35.0, "km": 2.5, "rq": 1.0, "target_o2": (3, 8),  "target_co2": (5, 10)},
    "banana":     {"vm": 40.0, "km": 2.8, "rq": 1.0, "target_o2": (3, 8),  "target_co2": (5, 10)},
    "tomato":     {"vm": 18.0, "km": 2.2, "rq": 1.0, "target_o2": (2, 5),  "target_co2": (2, 8)},
    "meat":       {"vm": 0.0,  "km": 0.0, "rq": 0.0, "target_o2": (70, 80), "target_co2": (20, 30)},
    "beef":       {"vm": 0.0,  "km": 0.0, "rq": 0.0, "target_o2": (70, 80), "target_co2": (20, 30)},
    "poultry":    {"vm": 0.0,  "km": 0.0, "rq": 0.0, "target_o2": (0, 0.5), "target_co2": (20, 30)},
    "snack":      {"vm": 0.0,  "km": 0.0, "rq": 0.0, "target_o2": (0, 0.5), "target_co2": (0, 0)},
    "chip":       {"vm": 0.0,  "km": 0.0, "rq": 0.0, "target_o2": (0, 0.5), "target_co2": (0, 0)},
    "nut":        {"vm": 0.0,  "km": 0.0, "rq": 0.0, "target_o2": (0, 0.5), "target_co2": (0, 0)},
}

_DEFAULT_KINETICS = {"vm": 25.0, "km": 2.0, "rq": 1.0, "target_o2": (3, 8), "target_co2": (5, 12)}


def _lookup_kinetics(comm_lower: str) -> Dict:
    for key, params in RESPIRATION_KINETICS.items():
        if key in comm_lower:
            return params
    return _DEFAULT_KINETICS


def _michaelis_menten(vm: float, km: float, o2_pct: float) -> float:
    """Michaelis-Menten respiration rate in mg O2/kg·hr."""
    if o2_pct <= 0:
        return 0.0
    return (vm * o2_pct) / (km + o2_pct)


def _equilibrium_o2(vm: float, km: float, mass_kg: float, package_area_m2: float,
                    film_otr_cc_m2_day: float, ambient_o2: float = 20.9) -> float:
    """
    Iteratively solve for steady-state O2 inside MAP package.
    Balance: Film transmission = Respiration consumption.
    Returns equilibrium O2 % inside the package.
    """
    # conversion: mg O2/kg·hr → cc O2/kg·day
    mg_to_cc = (1.0 / 32.0) * 22414.0 / 1000.0 * 24.0  # ≈ 16.81

    o2 = 10.0  # initial guess
    for _ in range(200):
        resp_rate_cc = _michaelis_menten(vm, km, o2) * mg_to_cc  # cc/kg·day
        total_resp = resp_rate_cc * mass_kg  # cc/day
        film_inflow = film_otr_cc_m2_day * package_area_m2 * (ambient_o2 - o2) / 100.0
        delta = film_inflow - total_resp
        o2 = max(0.01, min(ambient_o2, o2 + delta * 0.05))
        if abs(delta) < 0.01:
            break
    return round(o2, 2)


def _compute_perforation_density(vm: float, km: float, mass_kg: float,
                                 target_o2: float, film_otr: float,
                                 area_m2: float, hole_um: float = 80.0) -> Dict:
    """
    Calculate micro-perforation density to achieve target O2.
    Returns holes/m² and a human-readable description.
    """
    mg_to_cc = (1.0 / 32.0) * 22414.0 / 1000.0 * 24.0
    resp_at_target = _michaelis_menten(vm, km, target_o2) * mg_to_cc * mass_kg
    delta_frac = max((20.9 - target_o2) / 100.0, 0.001)
    required_otr = resp_at_target / (area_m2 * delta_frac)
    additional_otr = max(0.0, required_otr - film_otr)

    if additional_otr <= 0:
        return {"holes_per_m2": 0, "description": "None — base film OTR sufficient",
                "hole_diameter_um": 0}

    # Simplified Fickian diffusion per hole (100 µm ≈ 3.0 cc/day/hole at 25 µm film)
    d_cm = hole_um * 1e-4
    hole_area_cm2 = math.pi * (d_cm / 2) ** 2
    D_o2 = 0.21  # cm²/s
    film_thick_cm = 0.0025  # 25 µm
    otr_per_hole = D_o2 * hole_area_cm2 / film_thick_cm * 86400.0
    n_holes = math.ceil(additional_otr * area_m2 / max(otr_per_hole, 1e-9))
    holes_per_m2 = round(n_holes / area_m2, 1)
    return {
        "holes_per_m2": holes_per_m2,
        "description": f"{int(holes_per_m2)} holes/m² ({int(hole_um)}μm laser micro-vents)",
        "hole_diameter_um": hole_um
    }


def calculate_map_advisory(payload: MapAdvisorInput) -> Dict[str, Any]:
    """
    MAP Advisory Engine — primary path uses Michaelis-Menten kinetics.
    Falls back to category-based guidance when kinetics unavailable (non-respiring products).
    """
    comm = payload.commodity_name.lower()
    mass_kg = (payload.weight_grams or 500.0) / 1000.0
    vol_ml = payload.packaging_volume_ml or 1200.0
    resp_override = payload.respiration_rate_ml_co2_kg_hr  # may be None
    temp_c = payload.storage_temp_c or 4.0

    kinetics = _lookup_kinetics(comm)
    vm = kinetics["vm"]
    km = kinetics["km"]
    rq = kinetics["rq"]
    target_o2_range = kinetics["target_o2"]
    target_co2_range = kinetics["target_co2"]

    # Override Vm with user-supplied respiration rate if provided
    if resp_override is not None and resp_override > 0 and vm > 0:
        # Scale Vm proportionally from the user's respiration measurement at ambient O2
        scaling = resp_override / max(_michaelis_menten(vm, km, 20.9), 0.01)
        vm = vm * scaling

    # ── Non-respiring products (meat, snacks, dry goods) ──────────────────────
    if vm == 0 or ("meat" in comm or "beef" in comm or "poultry" in comm):
        if "meat" in comm or "beef" in comm:
            target_o2 = 75.0
            target_co2 = 25.0
            target_n2 = 0.0
            perf_desc = "None (Impermeable gas-barrier laminate)"
            notes = ("High-O₂ MAP (75% O₂ / 25% CO₂): O₂ maintains oxymyoglobin (cherry-red colour). "
                     "CO₂ suppresses aerobic psychrotrophic bacteria (Pseudomonas spp.). "
                     "Source: Gill & Newton (1978), J. Food Sci.")
        elif "poultry" in comm:
            target_o2 = 0.2
            target_co2 = 30.0
            target_n2 = 69.8
            perf_desc = "None (Hermetic barrier film)"
            notes = ("Low-O₂ MAP for poultry: 30% CO₂ suppresses Campylobacter and Salmonella. "
                     "Source: Mead (2004), Packaging Technology & Science.")
        else:  # snacks, nuts, dry goods
            target_o2 = 0.2
            target_co2 = 0.0
            target_n2 = 99.8
            perf_desc = "None (Hermetic barrier film)"
            notes = ("Nitrogen flush purges residual O₂ below 0.5% to prevent lipid auto-oxidation. "
                     "Source: Robertson (2013), Food Packaging Principles & Practice.")
        condensation_risk = "Low"
    else:
        # ── Respiring fresh produce ─────────────────────────────────────────
        # Estimate package area from volume (approximate sphere → surface)
        package_area_m2 = max(0.02, (vol_ml / 1000.0) ** (2.0 / 3.0) * 4.84)

        # Temperature correction (Q10 ≈ 2.5 for respiration)
        q10_resp = 2.5
        vm_at_temp = vm * (q10_resp ** ((temp_c - 20.0) / 10.0))

        # Estimate equilibrium O2 for a standard BOPP-like film (OTR ≈ 12000 cc/m²/day)
        baseline_film_otr = 12000.0
        eq_o2 = _equilibrium_o2(vm_at_temp, km, mass_kg, package_area_m2, baseline_film_otr)

        # Choose target O2 (midpoint of physiological optimum)
        target_o2 = (target_o2_range[0] + target_o2_range[1]) / 2.0
        target_co2 = min(rq * (20.9 - target_o2) + 0.04, target_co2_range[1])
        target_n2 = max(0.0, round(100.0 - target_o2 - target_co2, 1))

        # Compute required perforations
        perf_info = _compute_perforation_density(
            vm_at_temp, km, mass_kg, target_o2,
            film_otr=baseline_film_otr, area_m2=package_area_m2
        )
        perf_desc = perf_info["description"]

        condensation_risk = "High" if (temp_c > 10 or any(w in comm for w in ["leafy", "spinach", "greens"])) else "Moderate"

        notes = (
            f"Equilibrium MAP for {payload.commodity_name}: computed steady-state O₂ at "
            f"{eq_o2}% using Michaelis-Menten kinetics (Vm={round(vm_at_temp, 1)} mg O₂/kg·hr at {temp_c}°C). "
            f"Target atmosphere {target_o2}% O₂ / {round(target_co2, 1)}% CO₂ balances "
            "respiration with film permeability to suppress senescence and microbial growth. "
            "Source: Fonseca et al. (2002), J. Food Eng.; Saltveit (2004), Handbook of Plant Science."
        )

    gas_flush_liters = round((vol_ml * 2.2) / 1000.0, 3)

    return {
        "commodity": payload.commodity_name,
        "target_o2_percent": round(target_o2, 2),
        "target_co2_percent": round(target_co2, 2),
        "target_n2_percent": round(target_n2, 2),
        "micro_perforation_density": perf_desc,
        "gas_flush_volume_liters": gas_flush_liters,
        "condensation_risk": condensation_risk,
        "advisory_notes": notes
    }
