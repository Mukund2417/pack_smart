from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Dict
import csv
import io

from backend.database import get_db
from backend.models.user import User, QueryLog
from backend.models.commodity import Commodity
from backend.models.polymer import Polymer
from backend.auth.rbac import require_role
from backend.config import settings

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("ADMIN"))
):
    logs = db.query(QueryLog).order_by(QueryLog.id.desc()).limit(100).all()
    results = []
    for log in logs:
        user = db.query(User).filter(User.id == log.user_id).first()
        results.append({
            "id": log.id,
            "user_id": log.user_id,
            "username": user.username if user else "Unknown",
            "commodity_id": log.commodity_id,
            "recommended_laminate": log.recommended_laminate,
            "simulated_shelf_life_days": log.simulated_shelf_life_days,
            "timestamp": str(log.timestamp) if log.timestamp else None
        })
    return results


@router.put("/weights")
def update_weights(
    weights: Dict[str, float],
    current_user=Depends(require_role("ADMIN"))
):
    mapping = {
        "w_barrier": "TOPSIS_W_BARRIER",
        "w_cost": "TOPSIS_W_COST",
        "w_carbon": "TOPSIS_W_CARBON",
        "w_mechanical": "TOPSIS_W_MECHANICAL",
        "w_seal": "TOPSIS_W_SEAL",
    }
    for key, attr in mapping.items():
        if key in weights:
            setattr(settings, attr, weights[key])

    return {
        "message": "TOPSIS weights updated successfully",
        "new_weights": {
            "w_barrier": settings.TOPSIS_W_BARRIER,
            "w_cost": settings.TOPSIS_W_COST,
            "w_carbon": settings.TOPSIS_W_CARBON,
            "w_mechanical": settings.TOPSIS_W_MECHANICAL,
            "w_seal": settings.TOPSIS_W_SEAL,
        }
    }


@router.get("/export/csv")
def export_csv(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("ADMIN"))
):
    commodities = db.query(Commodity).all()
    polymers = db.query(Polymer).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Commodities section
    writer.writerow(["=== COMMODITIES ==="])
    writer.writerow([
        "ID", "Name", "Category", "Initial Moisture %", "Critical Moisture %",
        "Water Activity", "Lipid %", "Oxidation Sensitivity", "Light Sensitive",
        "Respiration Class", "Vm_O2", "Km_O2", "Temp Min", "Temp Max", "Max O2 Uptake"
    ])
    for c in commodities:
        writer.writerow([
            c.id, c.name, c.category, c.initial_moisture_pct, c.critical_moisture_pct,
            c.water_activity_aw, c.lipid_pct, c.oxidation_sensitivity, c.light_sensitivity,
            c.respiration_class, c.vm_o2, c.km_o2, c.optimal_temp_min, c.optimal_temp_max,
            c.max_tolerable_o2_uptake
        ])

    writer.writerow([])

    # Polymers section
    writer.writerow(["=== POLYMERS ==="])
    writer.writerow([
        "ID", "Name", "Category", "Thickness (μm)", "WVTR", "OTR",
        "CO2 Perm", "Puncture (N)", "Seal Temp (°C)", "Haze %",
        "Cost (INR/kg)", "CO2 Footprint", "Recyclability", "FSSAI"
    ])
    for p in polymers:
        writer.writerow([
            p.id, p.name, p.category_type, p.nominal_thickness_um,
            p.baseline_wvtr, p.baseline_otr, p.co2_permeability,
            p.puncture_resistance_N, p.seal_initiation_temp_C, p.optical_haze_pct,
            p.cost_per_kg_inr, p.carbon_footprint_kgCO2, p.recyclability_class,
            p.fssai_certified
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=packaging_data_export.csv"}
    )
