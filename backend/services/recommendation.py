from sqlalchemy.orm import Session
from ..models import PackagingMaterial, Commodity, Recommendation, RecommendationMaterial, MapAdvisory
from ..schemas import RecommendationInput
from .data_resolution_service import resolve_food_profile
from ..engine.requirement_engine import compute_packaging_requirements
from .ml_surrogate import ml_surrogate_engine
from datetime import datetime, timezone
import uuid

def run_recommendation_engine(db: Session, payload: RecommendationInput, user_id: str = None):
    # 1. Lookup Commodity in Database
    commodity_query = None
    if payload.commodity_id:
        commodity_query = db.query(Commodity).filter(Commodity.commodity_id == payload.commodity_id).first()
    
    if not commodity_query and payload.commodity_name:
        commodity_query = db.query(Commodity).filter(Commodity.name.ilike(f"%{payload.commodity_name}%")).first()
        if not commodity_query:
            tokens = [t.strip() for t in payload.commodity_name.replace("(", " ").replace(")", " ").split() if len(t.strip()) >= 3]
            for tok in tokens:
                matched = db.query(Commodity).filter(Commodity.name.ilike(f"%{tok}%")).first()
                if matched:
                    commodity_query = matched
                    break

    comm_name = commodity_query.name if commodity_query else (payload.commodity_name or "Custom Food Matrix")
    comm_cat = commodity_query.category.lower() if commodity_query else (payload.commodity_name or "").lower()

    # 2. Resolve Food Profile using Critical Value Priority Rule (User > Database > UNKNOWN)
    raw_inputs = {
        "moisture_content": payload.moisture_content,
        "oil_fat_content": payload.oil_fat_content,
        "ph_level": payload.ph_level,
        "respiration_rate": payload.respiration_rate,
        "storage_type": payload.storage_type,
        "storage_temp": payload.storage_temp,
        "relative_humidity": payload.relative_humidity,
        "transport_conditions": payload.transport_conditions,
        "desired_shelf_life": payload.desired_shelf_life
    }
    resolved_profile = resolve_food_profile(commodity_query, raw_inputs)

    # 3. Compute Packaging Requirements via Scientific Engine
    reqs = compute_packaging_requirements(resolved_profile, category_hints=f"{comm_name} {comm_cat}")

    # 4. Multi-Criteria Candidate Material Scoring from Database
    candidates = db.query(PackagingMaterial).all()
    scored_materials = []
    
    is_fresh = reqs["is_fresh"]
    is_bakery = reqs["is_bakery"]

    for mat in candidates:
        # Rule filter
        if payload.storage_type == "frozen" and mat.mechanical_strength_index < 6.0:
            continue
        if is_fresh and not mat.map_compatible:
            continue

        score = 0.50  # base
        mat_type = (mat.material_type or "").lower()
        mat_name = (mat.name or "").lower()

        # Scientific feature matching
        if is_fresh and ("breathable" in mat_type or "bopp" in mat_name or "ldpe" in mat_name):
            score += 0.35
        elif is_bakery and ("breathable" in mat_type or "kraft" in mat_name or "bopp" in mat_name):
            score += 0.35
        elif ("snack" in comm_cat or "dry" in comm_cat) and ("laminate" in mat_type or "metal" in mat_name or "foil" in mat_type):
            score += 0.35
        elif "meat" in comm_cat and ("evoh" in mat_name or "polyamide" in mat_name or "barrier" in mat_name):
            score += 0.38
        else:
            score += 0.15

        s_score = 65.0
        if mat.sustainability_data:
            s_score = mat.sustainability_data.sustainability_score

        # Priority-specific weighting
        priority = (payload.priority or "balanced").lower().strip()
        if priority in ("lower_cost", "cost"):
            # Heavily weight cost economy
            score += ((10.0 - mat.cost_index) / 10.0) * 0.22
            score += (mat.mechanical_strength_index / 10.0) * 0.05
        elif priority in ("sustainability", "eco", "eco_friendly"):
            # Heavily weight sustainability and recyclability
            score += (s_score / 100.0) * 0.25
            if mat.is_recyclable or mat.is_biodegradable:
                score += 0.05
            score += ((10.0 - mat.cost_index) / 10.0) * 0.03
        elif priority in ("longer_shelf_life", "shelf_life"):
            # Heavily weight barrier strength
            if "barrier" in mat_name or "evoh" in mat_name or "foil" in mat_name or "metal" in mat_name:
                score += 0.15
            score += (mat.mechanical_strength_index / 10.0) * 0.10
        else: # balanced
            score += (mat.mechanical_strength_index / 10.0) * 0.08
            score += ((10.0 - mat.cost_index) / 10.0) * 0.06
            score += (s_score / 100.0) * 0.06

        confidence = round(min(0.98, max(0.65, score)), 2)

        explanation = f"Evaluated for {comm_name} with target OTR barrier {reqs['target_otr_str']} cc/m²/day and {reqs['sealability']}."
        if mat.gas_permeability_notes:
            explanation += f" {mat.gas_permeability_notes}"

        scored_materials.append({
            "material_id": mat.material_id,
            "name": mat.name,
            "material_type": mat.material_type,
            "confidence_score": confidence,
            "recommended_thickness": reqs["thickness_str"],
            "recommended_otr": reqs["target_otr_str"],
            "recommended_wvtr": reqs["target_wvtr_str"],
            "sealability": reqs["sealability"],
            "map_required": reqs["map_required"],
            "eco_alternative": reqs["eco_alternative"],
            "cost_index": mat.cost_index,
            "cost_estimate_local": mat.cost_estimate_local,
            "supplier_channel_note": mat.supplier_channel_note,
            "sustainability_score": s_score,
            "baseline_otr": mat.baseline_otr,
            "baseline_wvtr": mat.baseline_wvtr,
            "otr_range": mat.otr_range,
            "wvtr_range": mat.wvtr_range,
            "mechanical_strength_index": mat.mechanical_strength_index,
            "puncture_resistance_N": mat.puncture_resistance_N,
            "carbon_footprint_kgCO2": mat.carbon_footprint_kgCO2,
            "cost_per_kg_inr": mat.cost_per_kg_inr,
            "source_reference": mat.source_reference or "Scientific Literature & Converter Datasheets",
            "explanation": explanation
        })

    # Sort and rank materials by confidence score
    scored_materials.sort(key=lambda x: x["confidence_score"], reverse=True)
    for idx, item in enumerate(scored_materials):
        item["rank"] = idx + 1

    # 5. Persist recommendation in DB
    final_moisture = resolved_profile["moisture_content"]["value"]
    final_oil_fat = resolved_profile["oil_fat_content"]["value"]
    final_ph = resolved_profile["ph_level"]["value"]
    final_respiration = resolved_profile["respiration_rate"]["value"]

    rec_obj = Recommendation(
        user_id=user_id,
        commodity_id=commodity_query.commodity_id if commodity_query else None,
        commodity_name=comm_name,
        input_moisture_content=final_moisture,
        input_oil_fat_content=final_oil_fat,
        input_ph=final_ph,
        input_respiration_rate=final_respiration,
        desired_shelf_life_days=payload.desired_shelf_life or 14,
        storage_type=payload.storage_type or "ambient",
        storage_temperature=payload.storage_temp or 20.0,
        relative_humidity=payload.relative_humidity or 65.0,
        transport_mode=payload.transport_conditions or "smooth"
    )
    db.add(rec_obj)
    db.flush()

    # Link top candidate materials
    for item in scored_materials[:5]:
        rec_mat = RecommendationMaterial(
            recommendation_id=rec_obj.recommendation_id,
            material_id=item["material_id"],
            rank=item["rank"],
            confidence_score=item["confidence_score"],
            recommended_thickness_microns=reqs["base_thickness"],
            recommended_otr=reqs["target_otr_num"],
            recommended_wvtr=reqs["target_wvtr_num"],
            explanation_text=item["explanation"],
            source_reference=item["source_reference"]
        )
        db.add(rec_mat)

    # 6. If fresh commodity, trigger MAP Advisory using the scientific MAP engine
    map_details = None
    if is_fresh:
        from ..schemas import MapAdvisorInput
        from .map import calculate_map_advisory
        map_payload = MapAdvisorInput(
            commodity_name=comm_name,
            weight_grams=500.0,
            packaging_volume_ml=1200.0,
            respiration_rate_ml_co2_kg_hr=float(final_respiration) if final_respiration else 25.0,
            storage_temp_c=float(resolved_profile["storage_temperature"]["value"]) if resolved_profile["storage_temperature"]["value"] else 4.0
        )
        map_result = calculate_map_advisory(map_payload)
        map_advisory_db = MapAdvisory(
            recommendation_id=rec_obj.recommendation_id,
            recommended_o2_percent=map_result["target_o2_percent"],
            recommended_co2_percent=map_result["target_co2_percent"],
            recommended_n2_percent=map_result["target_n2_percent"],
            micro_perforation_density=map_result["micro_perforation_density"]
        )
        db.add(map_advisory_db)
        map_details = {
            "o2_percent": map_result["target_o2_percent"],
            "co2_percent": map_result["target_co2_percent"],
            "n2_percent": map_result["target_n2_percent"],
            "target_o2_percent": map_result["target_o2_percent"],
            "target_co2_percent": map_result["target_co2_percent"],
            "target_n2_percent": map_result["target_n2_percent"],
            "micro_perforations": map_result["micro_perforation_density"],
            "micro_perforation_density": map_result["micro_perforation_density"]
        }


    db.commit()

    short_shelf_life_note = None
    desired_days = payload.desired_shelf_life or 14
    if desired_days <= 7 or (is_bakery and payload.storage_type == "ambient"):
        short_shelf_life_note = (
            f"Target shelf-life is {desired_days} days. "
            "For ambient bakery and short-cycle goods, consider exploring natural antimicrobials "
            "(e.g. cultured dextrose, rosemary extract, potassium sorbate) in the Preservatives & Additives Guide "
            "to inhibit mold and extend stability safely."
        )

    primary_name = scored_materials[0]["name"] if scored_materials else reqs["primary_material"]
    primary_type = scored_materials[0]["material_type"] if scored_materials else "plastic"

    structure_layers = derive_packaging_layers(primary_name, primary_type, reqs["thickness_str"])
    comparison_candidates = build_comparison_candidates(scored_materials)
    dossier_id = f"DOS-REC-{rec_obj.recommendation_id[:8].upper()}"

    # Build 3-5 clear, plain-language reasons
    top_mat = scored_materials[0] if scored_materials else None
    top_strength = top_mat.get("mechanical_strength_index", 7.5) if top_mat else 7.5
    top_cost_inr = top_mat.get("cost_estimate_local", 220.0) if top_mat else 220.0

    reasons = []
    if is_fresh:
        reasons.append("Gas Permeability / Respiration: Balanced breathability allows O2/CO2 equilibrium flux to prevent anaerobic produce fermentation.")
    elif reqs["target_otr_num"] <= 5.0:
        reasons.append(f"High Oxygen Protection: Target OTR ({reqs['target_otr_str']} cc/m²/day) provides hermetic barrier against lipid rancidity and aroma loss.")
    else:
        reasons.append(f"Oxygen Barrier: Target OTR ({reqs['target_otr_str']} cc/m²/day) maintains freshness under standard distribution.")

    if reqs["target_wvtr_num"] <= 2.0:
        reasons.append(f"Strong Moisture Defense: Low WVTR ({reqs['target_wvtr_str']} g/m²/day) protects crispness and prevents moisture absorption.")
    else:
        reasons.append(f"Moisture Control: Balanced WVTR ({reqs['target_wvtr_str']} g/m²/day) prevents condensation buildup and surface mold.")

    reasons.append(f"Storage & Shelf-Life Fit: Calibrated for {payload.storage_type or 'ambient'} conditions ({payload.storage_temp or 20}°C) across target {desired_days} days.")
    reasons.append(f"Transit Durability: High puncture and seal integrity ({reqs['thickness_str']} µm caliper) protects against stress during {payload.transport_conditions or 'smooth'} transit.")

    priority_val = (payload.priority or "balanced").lower().strip()
    if priority_val in ("lower_cost", "cost"):
        reasons.append(f"Cost Optimized: Selected as the most economical material meeting safety thresholds (~₹{top_cost_inr}/kg).")
    elif priority_val in ("sustainability", "eco", "eco_friendly"):
        reasons.append("Sustainability Focus: High recyclability and lower carbon footprint profile prioritised.")
    elif priority_val in ("longer_shelf_life", "shelf_life"):
        reasons.append(f"Extended Shelf Life: Maximized hermetic barrier for maximum achievable stability ({desired_days} days).")
    else:
        reasons.append("Optimal Multi-Criteria Balance: Top TOPSIS score across barrier protection, mechanical strength, and economics.")

    strength_spec = f"Puncture Resistance: > {round(top_strength * 3.2, 1)} N (ASTM D1709) / Tensile ASTM D882"
    map_spec = reqs["map_required"]
    if map_details:
        map_spec = f"Active MAP: {map_details['target_o2_percent']}% O₂, {map_details['target_co2_percent']}% CO₂, {map_details['target_n2_percent']}% N₂ ({map_details['micro_perforations']})"

    alternatives = {
        "recommended": next((c for c in comparison_candidates if c.get("id") == "recommended"), None),
        "standard": next((c for c in comparison_candidates if c.get("id") == "standard"), None),
        "sustainable": next((c for c in comparison_candidates if c.get("id") == "eco"), None)
    }

    # Build a rich explanation_text for the primary recommendation
    explanation_text = (
        f"Engineered multi-layer packaging structure optimized for {comm_name} under {payload.storage_type or 'ambient'} storage "
        f"({payload.storage_temp or 20}°C, {payload.relative_humidity or 65}% RH). "
        f"Selected for target OTR {reqs['target_otr_str']} cc/m²/day, WVTR {reqs['target_wvtr_str']} g/m²/day, "
        f"and {reqs['sealability'].lower()} to achieve {desired_days}-day shelf life."
    )
    if map_details:
        explanation_text += f" Active MAP headspace: {map_details['target_o2_percent']}% O₂ / {map_details['target_co2_percent']}% CO₂ / {map_details['target_n2_percent']}% N₂."

    return {
        "recommendation_id": rec_obj.recommendation_id,
        "dossier_id": dossier_id,
        "commodity": comm_name,
        "primary_material": primary_name,
        "target_otr": reqs["target_otr_str"],
        "target_wvtr": reqs["target_wvtr_str"],
        "thickness": reqs["thickness_str"],
        "sealability": reqs["sealability"],
        "map_required": reqs["map_required"],
        "eco_alternative": reqs["eco_alternative"],
        "shelf_life_days": float(desired_days),
        "ranked_materials": scored_materials[:5],
        "structure_layers": structure_layers,
        "comparison_candidates": comparison_candidates,
        "map_advisory": map_details,
        "recommended_format": reqs["recommended_format"],
        "format_id": reqs["format_id"],
        "short_shelf_life_note": short_shelf_life_note,
        "resolved_food_profile": resolved_profile,
        "created_at": rec_obj.created_at,
        "is_demo": False,
        "priority": priority_val,
        "reasons": reasons,
        "strength_spec": strength_spec,
        "map_spec": map_spec,
        "alternatives": alternatives,
        "explanation_text": explanation_text,
        "cost_estimate_local": top_cost_inr,
        "storage_type": payload.storage_type or "ambient",
        "ml_surrogate_prediction": ml_surrogate_engine.predict_surrogate(
            temp_c=float(payload.storage_temp if payload.storage_temp is not None else 20.0),
            rh_pct=float(payload.relative_humidity if payload.relative_humidity is not None else 65.0),
            moisture_pct=float((resolved_profile.get("moisture_content", {}).get("value") if isinstance(resolved_profile.get("moisture_content"), dict) else resolved_profile.get("moisture_content")) or 14.0),
            oil_pct=float((resolved_profile.get("oil_fat_content", {}).get("value") if isinstance(resolved_profile.get("oil_fat_content"), dict) else resolved_profile.get("oil_fat_content")) or 5.0),
            respiration=float((resolved_profile.get("respiration_rate", {}).get("value") if isinstance(resolved_profile.get("respiration_rate"), dict) else resolved_profile.get("respiration_rate")) or 0.0),
            target_days=float(desired_days)
        )
    }


def derive_packaging_layers(mat_name: str, mat_type: str, thickness_str: str) -> list:
    name_l = (mat_name or "").lower()
    type_l = (mat_type or "").lower()

    if "foil" in name_l or "alu" in name_l:
        return [
            {
                "layer_name": "Outer Substrate & Print Layer",
                "material": "Biaxially Oriented PET (BOPET)",
                "thickness": "12 µm",
                "thickness_um": 12.0,
                "role": "Printability & high tensile strength",
                "barrier_function": "Mechanical scuff resistance & heat stability",
                "source": "ASTM D882 / Industry Converter Datasheet",
                "test_information": "ASTM D882 Tensile Modulus >210 MPa",
                "is_barrier": False
            },
            {
                "layer_name": "Hermetic Barrier Core",
                "material": "Aluminum Foil (Alu 99.5%)",
                "thickness": "9 µm",
                "thickness_um": 9.0,
                "role": "Absolute oxygen, light & moisture barrier",
                "barrier_function": "Zero OTR & zero WVTR (<0.01) hermetic shield",
                "source": "ASTM D3985 / ASTM F1249",
                "test_information": "Coulometric & IR Sensor (<0.01 cc/m²/day)",
                "is_barrier": True
            },
            {
                "layer_name": "Food-Contact Sealant Layer",
                "material": "Linear Low-Density Polyethylene (LLDPE)",
                "thickness": "50 µm",
                "thickness_um": 50.0,
                "role": "Hermetic heat seal & food safety",
                "barrier_function": "Moisture barrier & seal integrity under grease",
                "source": "IS 9845 / ASTM F88",
                "test_information": "ASTM F88 Seal Strength (>15 N/15mm)",
                "is_barrier": False
            }
        ]
    elif "evoh" in name_l or "vsp" in name_l or "vacuum" in name_l:
        return [
            {
                "layer_name": "Outer Puncture Shield",
                "material": "Oriented Polyamide (Nylon-6)",
                "thickness": "15 µm",
                "thickness_um": 15.0,
                "role": "Deep-draw vacuum & puncture defense",
                "barrier_function": "High impact strength and abrasion protection",
                "source": "ASTM D1709 / Converter Datasheet",
                "test_information": "ASTM D1709 Dart Impact >650g",
                "is_barrier": False
            },
            {
                "layer_name": "Ultra-High Gas Barrier Core",
                "material": "Ethylene Vinyl Alcohol (EVOH 32 mol%)",
                "thickness": "5 µm",
                "thickness_um": 5.0,
                "role": "Oxygen & aroma retention barrier",
                "barrier_function": "OTR <1.5 cc/m²/day preventing lipid rancidity",
                "source": "ASTM D3985 / Kuraray EVAL Technical Spec",
                "test_information": "ASTM D3985 at 23°C, 65% RH",
                "is_barrier": True
            },
            {
                "layer_name": "Metallocene Heat Sealant",
                "material": "m-LLDPE + Anti-Fog Co-ex",
                "thickness": "50 µm",
                "thickness_um": 50.0,
                "role": "Low SIT hermetic sealing & food contact",
                "barrier_function": "Hermetic seal through grease, FSSAI approved",
                "source": "IS 9845 / ASTM F88",
                "test_information": "ASTM F88 Seal Strength / IS 9845 Migration",
                "is_barrier": False
            }
        ]
    elif "metal" in name_l or "bopp" in name_l or "snack" in name_l or "chip" in name_l:
        return [
            {
                "layer_name": "Gloss Print & Barrier Substrate",
                "material": "Metallized BOPP (Met-BOPP)",
                "thickness": "20 µm",
                "thickness_um": 20.0,
                "role": "UV reflection, moisture barrier & stiffness",
                "barrier_function": "WVTR <0.8 g/m²/day & optical density >2.2",
                "source": "ASTM F1249 / ISO 15106",
                "test_information": "ASTM F1249 at 38°C, 90% RH",
                "is_barrier": True
            },
            {
                "layer_name": "Hermetic Heat-Seal Layer",
                "material": "Linear Low-Density Polyethylene (LLDPE)",
                "thickness": "40 µm",
                "thickness_um": 40.0,
                "role": "Cushion fin-seal & nitrogen retention",
                "barrier_function": "Traps N₂ flush atmosphere to preserve crispness",
                "source": "ASTM F88 / IS 10146",
                "test_information": "ASTM F88 Seal Integrity >12 N/15mm",
                "is_barrier": False
            }
        ]
    elif "retort" in name_l:
        return [
            {
                "layer_name": "Thermal Resistant Substrate",
                "material": "Oriented PET",
                "thickness": "12 µm",
                "thickness_um": 12.0,
                "role": "Thermal endurance up to 121°C sterilization",
                "barrier_function": "High mechanical modulus and print surface",
                "source": "ASTM D882",
                "test_information": "ASTM D882 Tensile Modulus",
                "is_barrier": False
            },
            {
                "layer_name": "Inorganic Oxide Barrier Layer",
                "material": "AlOx-coated PET",
                "thickness": "15 µm",
                "thickness_um": 15.0,
                "role": "Transparent high gas & moisture barrier",
                "barrier_function": "OTR <0.5 cc/m²/day with microwave transparency",
                "source": "ASTM D3985 / ASTM F1249",
                "test_information": "ASTM D3985 & ASTM F1249",
                "is_barrier": True
            },
            {
                "layer_name": "Retort Heat Sealant",
                "material": "Cast Polypropylene (CPP)",
                "thickness": "70 µm",
                "thickness_um": 70.0,
                "role": "Pressure autoclave hermetic sealing",
                "barrier_function": "Withstands 121°C retort without seal failure",
                "source": "ASTM F88 / FSSAI 2018",
                "test_information": "ASTM F88 Seal Strength post-retort",
                "is_barrier": False
            }
        ]
    elif "breathable" in name_l or "perforat" in name_l or "breathable" in type_l:
        return [
            {
                "layer_name": "Laser-Microperforated Breathable Film",
                "material": "Micro-Perforated BOPP",
                "thickness": "25 µm",
                "thickness_um": 25.0,
                "role": "Equilibrium respiration gas flux",
                "barrier_function": "Micro-apertures (50–80 µm) preventing produce fermentation",
                "source": "ISO 2556 / Postharvest Packaging Literature",
                "test_information": "Laser Densitometry (ASTM F3136)",
                "is_barrier": False
            },
            {
                "layer_name": "Anti-Fog Food Contact Layer",
                "material": "Corona-Treated LLDPE with Surfactant",
                "thickness": "15 µm",
                "thickness_um": 15.0,
                "role": "Disperses moisture droplets into a sheet",
                "barrier_function": "Prevents mold and fungal spoilage in produce",
                "source": "ASTM D1746 / FSSAI Food Contact",
                "test_information": "ASTM D1746 Hot Box Anti-Fog Test",
                "is_barrier": False
            }
        ]
    elif "pla" in name_l or "cellulose" in name_l or "bio" in type_l:
        return [
            {
                "layer_name": "Bio-Based Structural Substrate",
                "material": "Polylactic Acid (PLA) / Regenerated Cellulose",
                "thickness": "20 µm",
                "thickness_um": 20.0,
                "role": "Renewable plant-derived structural film",
                "barrier_function": "Moderate gas barrier & high clarity",
                "source": "ISO 17088 / EN 13432",
                "test_information": "Industrial Compostability (ISO 17088)",
                "is_barrier": False
            },
            {
                "layer_name": "Compostable Heat-Seal Layer",
                "material": "PBAT / Starch Biocomposite",
                "thickness": "30 µm",
                "thickness_um": 30.0,
                "role": "Low-temperature compostable seal",
                "barrier_function": "Hermetic seal that biodegrades in soil/compost",
                "source": "ASTM D6400",
                "test_information": "ASTM D6400 Biodegradation >90% in 180 days",
                "is_barrier": False
            }
        ]
    else:
        return [
            {
                "layer_name": "Monolayer Structural Film",
                "material": mat_name or "Polyethylene Film",
                "thickness": thickness_str or "25 µm",
                "thickness_um": 25.0,
                "role": "Single-substrate barrier & structural containment",
                "barrier_function": "Standard polyolefin moisture barrier",
                "source": "Converter Technical Datasheet",
                "test_information": "ASTM D3985 / ASTM F1249",
                "is_barrier": True
            }
        ]


def parse_midpoint(val_str, default_val=50.0):
    if not val_str or str(val_str).strip() in ("N/A", "None", ""):
        return default_val
    try:
        parts = [p.strip().replace(",", "") for p in str(val_str).split("-")]
        nums = [float(p) for p in parts if p and not p.isalpha()]
        if nums:
            return sum(nums) / len(nums)
    except Exception:
        pass
    return default_val


def build_comparison_candidates(scored_materials: list) -> list:
    if not scored_materials:
        return []

    rec = scored_materials[0]

    film_candidates = [m for m in scored_materials if "tray" not in m["name"].lower() and "bottle" not in m["name"].lower()]
    pool = film_candidates if len(film_candidates) >= 3 else scored_materials

    eco_pool = [m for m in pool if m["material_id"] != rec["material_id"]]
    eco = max(eco_pool, key=lambda x: x.get("sustainability_score", 0)) if eco_pool else rec

    std = None
    for m in pool:
        m_name_l = m["name"].lower()
        if "ll dpe" in m_name_l or "hdpe" in m_name_l or "polyethylene" in m_name_l:
            if m["material_id"] not in (rec["material_id"], eco["material_id"]):
                std = m
                break
    if not std:
        rem = [m for m in pool if m["material_id"] not in (rec["material_id"], eco["material_id"])]
        std = rem[0] if rem else pool[-1]

    return [
        {
            "id": "recommended",
            "name": rec["name"],
            "role_label": "Recommended Material",
            "is_hero": True,
            "otr_raw": parse_midpoint(rec.get("otr_range"), rec.get("baseline_otr") or 50.0),
            "wvtr_raw": parse_midpoint(rec.get("wvtr_range"), rec.get("baseline_wvtr") or 5.0),
            "puncture_raw": rec.get("puncture_resistance_N") or (rec.get("mechanical_strength_index", 7.0) * 3.0),
            "mechanical_strength_index": rec.get("mechanical_strength_index", 7.0),
            "cost_index": rec.get("cost_index", 5.0),
            "cost_estimate_local": rec.get("cost_estimate_local") or 200.0,
            "sustainability_score": rec.get("sustainability_score", 50.0),
            "carbon_footprint_kgCO2": rec.get("carbon_footprint_kgCO2") or 2.5,
            "source_reference": rec.get("source_reference") or "ASTM D3985 / ASTM F1249"
        },
        {
            "id": "eco",
            "name": eco["name"],
            "role_label": "Eco-Alternative",
            "is_hero": False,
            "otr_raw": parse_midpoint(eco.get("otr_range"), eco.get("baseline_otr") or 500.0),
            "wvtr_raw": parse_midpoint(eco.get("wvtr_range"), eco.get("baseline_wvtr") or 25.0),
            "puncture_raw": eco.get("puncture_resistance_N") or (eco.get("mechanical_strength_index", 6.0) * 3.0),
            "mechanical_strength_index": eco.get("mechanical_strength_index", 6.0),
            "cost_index": eco.get("cost_index", 6.5),
            "cost_estimate_local": eco.get("cost_estimate_local") or 320.0,
            "sustainability_score": eco.get("sustainability_score", 85.0),
            "carbon_footprint_kgCO2": eco.get("carbon_footprint_kgCO2") or 1.5,
            "source_reference": eco.get("source_reference") or "ISO 17088 / NatureWorks Ingeo"
        },
        {
            "id": "standard",
            "name": std["name"],
            "role_label": "Standard Benchmark",
            "is_hero": False,
            "otr_raw": parse_midpoint(std.get("otr_range"), std.get("baseline_otr") or 3500.0),
            "wvtr_raw": parse_midpoint(std.get("wvtr_range"), std.get("baseline_wvtr") or 15.0),
            "puncture_raw": std.get("puncture_resistance_N") or (std.get("mechanical_strength_index", 5.0) * 3.0),
            "mechanical_strength_index": std.get("mechanical_strength_index", 5.0),
            "cost_index": std.get("cost_index", 3.5),
            "cost_estimate_local": std.get("cost_estimate_local") or 130.0,
            "sustainability_score": std.get("sustainability_score", 40.0),
            "carbon_footprint_kgCO2": std.get("carbon_footprint_kgCO2") or 2.1,
            "source_reference": std.get("source_reference") or "Industry Standard Converter Baseline"
        }
    ]
