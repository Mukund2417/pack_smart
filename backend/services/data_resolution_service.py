from typing import Optional, Dict, Any
from backend.models import Commodity

def validate_user_override(prop_name: str, user_val: Any) -> bool:
    """Check if user value is provided, not None, not empty string, and valid."""
    if user_val is None:
        return False
    if isinstance(user_val, str) and user_val.strip() == "":
        return False
    return True

def resolve_food_property(
    user_val: Optional[Any],
    db_val: Optional[Any],
    unit: str,
    prop_name: str,
    source_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    CRITICAL VALUE PRIORITY RULE (Section 12 & 13):
    1. IF USER PROVIDED -> use USER VALUE (source: USER_SUPPLIED)
    2. ELSE IF VALID DATABASE/LITERATURE VALUE EXISTS -> use DATABASE/LITERATURE VALUE (source: DATABASE)
    3. ELSE -> UNKNOWN (value: null, source: UNKNOWN)
    
    Never overwrite user input with database or literature defaults.
    """
    if validate_user_override(prop_name, user_val):
        try:
            val = float(user_val) if isinstance(user_val, (int, float, str)) and str(user_val).replace('.', '', 1).isdigit() else user_val
            return {
                "value": val,
                "unit": unit,
                "source": "USER_SUPPLIED",
                "source_id": None
            }
        except (ValueError, TypeError):
            return {
                "value": user_val,
                "unit": unit,
                "source": "USER_SUPPLIED",
                "source_id": None
            }

    if db_val is not None and db_val != 0.0:
        return {
            "value": db_val,
            "unit": unit,
            "source": "DATABASE",
            "source_id": source_id or "packsmart-food-knowledgebase"
        }

    return {
        "value": None,
        "unit": unit,
        "source": "UNKNOWN",
        "source_id": None
    }

def get_database_fallback(commodity: Optional[Commodity], prop_name: str) -> Optional[Any]:
    if not commodity:
        return None
    return getattr(commodity, prop_name, None)

def resolve_food_profile(commodity: Optional[Commodity], user_inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Produce a complete RESOLVED FOOD PROFILE with traceable sources for every scientific parameter.
    """
    db_moisture = getattr(commodity, 'default_moisture_content', None) or getattr(commodity, 'initial_moisture_pct', None)
    db_fat = getattr(commodity, 'default_oil_fat_content', None) or getattr(commodity, 'lipid_pct', None)
    db_ph = getattr(commodity, 'default_ph', None)
    db_resp = getattr(commodity, 'default_respiration_rate', None)
    db_aw = getattr(commodity, 'water_activity_aw', None)
    db_crit_mc = getattr(commodity, 'critical_moisture_pct', None)

    # Convert frontend category string choices if given
    raw_moisture = user_inputs.get('moisture_content')
    if isinstance(raw_moisture, str):
        if raw_moisture.lower() == 'high': raw_moisture = 85.0
        elif raw_moisture.lower() == 'medium': raw_moisture = 50.0
        elif raw_moisture.lower() == 'low': raw_moisture = 15.0

    raw_fat = user_inputs.get('oil_fat_content')
    if isinstance(raw_fat, str):
        if raw_fat.lower() == 'high': raw_fat = 30.0
        elif raw_fat.lower() == 'low': raw_fat = 5.0

    raw_ph = user_inputs.get('ph_level')
    if isinstance(raw_ph, str):
        if raw_ph.lower() == 'acidic': raw_ph = 4.0
        elif raw_ph.lower() == 'neutral': raw_ph = 7.0

    raw_resp = user_inputs.get('respiration_rate')
    if isinstance(raw_resp, str):
        if raw_resp.lower() == 'high': raw_resp = 30.0
        elif raw_resp.lower() == 'low': raw_resp = 5.0

    profile = {
        "moisture_content": resolve_food_property(raw_moisture, db_moisture, "%", "moisture_content"),
        "oil_fat_content": resolve_food_property(raw_fat, db_fat, "%", "oil_fat_content"),
        "ph_level": resolve_food_property(raw_ph, db_ph, "pH", "ph_level"),
        "respiration_rate": resolve_food_property(raw_resp, db_resp, "mL CO2/kg·hr", "respiration_rate"),
        "water_activity": resolve_food_property(user_inputs.get('water_activity'), db_aw, "aw", "water_activity"),
        "critical_moisture": resolve_food_property(user_inputs.get('critical_moisture'), db_crit_mc, "%", "critical_moisture"),
        "storage_temperature": resolve_food_property(user_inputs.get('storage_temp'), 4.0 if user_inputs.get('storage_type') == 'chilled' else 22.0, "°C", "storage_temperature"),
        "relative_humidity": resolve_food_property(user_inputs.get('relative_humidity'), 85.0 if user_inputs.get('storage_type') == 'chilled' else 65.0, "%", "relative_humidity"),
        "storage_type": user_inputs.get('storage_type') or "ambient",
        "transport_conditions": user_inputs.get('transport_conditions') or "smooth",
        "desired_shelf_life": user_inputs.get('desired_shelf_life') or 14
    }

    return profile

def track_value_source(resolved_profile: Dict[str, Any]) -> Dict[str, str]:
    """Summary of provenance for all attributes."""
    return {
        prop: meta.get("source", "UNKNOWN")
        for prop, meta in resolved_profile.items()
        if isinstance(meta, dict) and "source" in meta
    }
