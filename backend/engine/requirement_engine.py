from typing import Dict, Any

def compute_packaging_requirements(resolved_profile: Dict[str, Any], category_hints: str = "") -> Dict[str, Any]:
    """
    SCIENTIFIC REQUIREMENT ENGINE (Section 16):
    Derives rigorous barrier, seal, and structural requirements from resolved food properties.
    """
    moisture = resolved_profile.get("moisture_content", {}).get("value")
    fat = resolved_profile.get("oil_fat_content", {}).get("value")
    ph = resolved_profile.get("ph_level", {}).get("value")
    respiration = resolved_profile.get("respiration_rate", {}).get("value")
    storage_type = resolved_profile.get("storage_type", "ambient")
    transport = resolved_profile.get("transport_conditions", "smooth")
    desired_shelf_life = resolved_profile.get("desired_shelf_life", 14)

    # Defaults if completely unknown
    if moisture is None: moisture = 50.0
    if fat is None: fat = 5.0
    if ph is None: ph = 6.0
    if respiration is None: respiration = 0.0

    cat = category_hints.lower()
    is_bakery = "bakery" in cat or "bread" in cat
    is_fresh = "fresh" in cat or "produce" in cat or "fruit" in cat or "veg" in cat or (respiration and respiration > 10.0)
    is_snack = "snack" in cat or "chip" in cat or (fat and fat > 20.0 and moisture and moisture < 10.0)
    is_dry = "dry" in cat or "grain" in cat or "powder" in cat or (moisture and moisture < 15.0)
    is_meat = "meat" in cat or "poultry" in cat or "seafood" in cat or "fish" in cat
    is_pickle = "pickle" in cat or (ph and ph < 4.2 and fat and fat > 15.0)

    # 1. Target OTR and WVTR determination
    if is_bakery:
        # High moisture bread will mold rapidly in impermeable plastic
        target_otr_num = 8000.0
        target_wvtr_num = 20.0
        target_otr_str = "6,000 - 10,000"
        target_wvtr_str = "15 - 25"
        base_thickness = 35.0
        sealability = "Breathable Pouch / Heat Seal with Micro-Vents"
        map_required = "Recommended: Micro-perforated breathable pouch for crusty bread, or 70% CO₂ / 30% N₂ in barrier pouches with oxygen absorber for sandwich bread"
        eco_alt = "Unbleached Micro-Perforated Kraft Paper with Clear PLA Window"
        primary_material = "Micro-Perforated BOPP / Breathable Kraft Film"
        rec_format = "Micro-Perforated Produce & Bakery Bag"
        rec_format_id = "micro-perf-bag"
    elif is_fresh:
        # Fresh produce needs gas transmission to prevent anaerobic fermentation
        target_otr_num = 12000.0
        target_wvtr_num = 18.0
        target_otr_str = "10,000 - 15,000"
        target_wvtr_str = "15 - 20"
        base_thickness = 30.0
        sealability = "High (Hermetic Heat Seal)"
        map_required = "Recommended: 3-5% O₂, 5-8% CO₂, Bal N₂ to prevent browning and slow senescence"
        eco_alt = "PLA Micro-Perforated Bio-Film (EN 13432 Certified Compostable)"
        primary_material = "Micro-Perforated Biaxially-Oriented Polypropylene (BOPP / LDPE)"
        rec_format = "Micro-Perforated Produce Bag / Clamshell"
        rec_format_id = "micro-perf-bag"
    elif is_snack:
        # High fat snack foods require near-zero O2 to avoid lipid oxidation
        target_otr_num = 1.0
        target_wvtr_num = 0.5
        target_otr_str = "< 1.0"
        target_wvtr_str = "< 0.8"
        base_thickness = 70.0
        sealability = "High (Gas-Tight Barrier Fin Seal)"
        map_required = "Mandatory: 99.5% N₂ flush to protect crispness and curb rancidity"
        eco_alt = "Alu-free High-Barrier Cellulose Film"
        primary_material = "BOPP / Metallized Cast Polypropylene (BOPP/M-CPP)"
        rec_format = "Flow Wrap / Pillow Pouch"
        rec_format_id = "flow-wrap"
    elif is_pickle:
        target_otr_num = 0.5
        target_wvtr_num = 0.5
        target_otr_str = "< 0.5"
        target_wvtr_str = "< 0.5"
        base_thickness = 110.0
        sealability = "Corrosion-Resistant Heat Seal"
        map_required = "Not Required"
        eco_alt = "Glass Jar with Tinplate Lug Cap"
        primary_material = "PET / Alu-Foil / CPP Laminate"
        rec_format = "Stand-up Pouch (Doypack)"
        rec_format_id = "stand-up-pouch"
    elif is_meat:
        target_otr_num = 2.0
        target_wvtr_num = 2.0
        target_otr_str = "< 3.0"
        target_wvtr_str = "< 3.0"
        base_thickness = 85.0
        sealability = "Critical (Vacuum & Cryovac Hermetic Seal)"
        map_required = "Mandatory: High O₂ MAP (70-80% O₂ / 20-30% CO₂) to sustain red myoglobin color"
        eco_alt = "Bio-based Polyamide Co-extruded Multilayer"
        primary_material = "Co-extruded EVOH / Polyamide / Polyethylene (PA/EVOH/PE)"
        rec_format = "Vacuum Pack / Skin Pack"
        rec_format_id = "vacuum-pack"
    elif is_dry:
        target_otr_num = 5.0
        target_wvtr_num = 1.0
        target_otr_str = "< 10"
        target_wvtr_str = "< 1.5"
        base_thickness = 60.0
        sealability = "Medium (Acoustic or Ultrasonic Seal)"
        map_required = "Optional: Nitrogen flushing recommended to prevent lipid oxidation"
        eco_alt = "Water-barrier Coated Kraft Paper Laminate"
        primary_material = "Metallized Polyester / Linear Low-Density Polyethylene (MET-PET / LLDPE)"
        rec_format = "Stand-up Pouch (Doypack)"
        rec_format_id = "stand-up-pouch"
    else: # Dairy / default
        target_otr_num = 2.0
        target_wvtr_num = 2.0
        target_otr_str = "< 2.0"
        target_wvtr_str = "< 2.0"
        base_thickness = 70.0
        sealability = "High (Peelable Hermetic Seal)"
        map_required = "Recommended: 30% CO₂ / 70% N₂ for mold prevention"
        eco_alt = "Recyclable Monomaterial PP High-Barrier Pouch"
        primary_material = "PVDC-coated PET / LLDPE Co-polymer"
        rec_format = "Tray + Lidding Film"
        rec_format_id = "tray-lidding"

    # Environmental / handling adjustments
    thickness_str = f"{int(base_thickness - 10)} - {int(base_thickness + 15)}"
    if storage_type == "frozen":
        base_thickness += 20.0
        thickness_str = f"{int(base_thickness - 10)} - {int(base_thickness + 15)}"
        primary_material += " [Cold-Fracture Resistant Modifiers]"
    if transport == "rough":
        base_thickness += 15.0
        sealability += " with Reinforced Gusset Corners"

    return {
        "target_otr_num": target_otr_num,
        "target_wvtr_num": target_wvtr_num,
        "target_otr_str": target_otr_str,
        "target_wvtr_str": target_wvtr_str,
        "base_thickness": base_thickness,
        "thickness_str": thickness_str,
        "sealability": sealability,
        "map_required": map_required,
        "eco_alternative": eco_alt,
        "primary_material": primary_material,
        "recommended_format": rec_format,
        "format_id": rec_format_id,
        "is_fresh": is_fresh,
        "is_bakery": is_bakery
    }
