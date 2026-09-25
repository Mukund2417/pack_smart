from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class RecommendRequest(BaseModel):
    commodity_id: int
    storage_temp_c: float = 25.0
    storage_rh_pct: float = 65.0
    package_length_cm: float
    package_width_cm: float
    package_height_cm: float = 5.0
    net_weight_kg: float
    target_shelf_life_days: int
    custom_moisture_pct: Optional[float] = None
    custom_lipid_pct: Optional[float] = None

class QuickRecommendRequest(BaseModel):
    commodity_id: int
    transit_days: int = 7
    region: str = 'Tropical'

class ShelfLifeRequest(BaseModel):
    commodity_id: int
    polymer_id: int
    package_area_m2: float
    net_weight_kg: float
    storage_temp_c: float = 25.0
    storage_rh_pct: float = 65.0
    simulation_days: int = 90
    cold_chain_failure: bool = False
    failure_temp_c: Optional[float] = 40.0
    failure_duration_hours: Optional[float] = 8.0
    failure_day: Optional[int] = 15

class LayerSpec(BaseModel):
    layer_name: str
    polymer_name: str
    polymer_id: int
    thickness_um: float
    function: str

class RegulatoryCompliance(BaseModel):
    standard: str
    overall_migration_limit_status: str
    heavy_metals_pass: bool
    direct_contact_layer: str

class RecommendResponse(BaseModel):
    commodity_name: str
    laminate_layers: List[LayerSpec]
    total_wvtr: float
    total_otr: float
    target_wvtr: float
    target_otr: float
    estimated_shelf_life_days: float
    topsis_score: float
    cost_per_m2_inr: float
    carbon_footprint_per_m2: float
    map_recommendation: Optional[Dict[str, Any]] = None
    regulatory_compliance: RegulatoryCompliance

class ShelfLifeResponse(BaseModel):
    days: List[int]
    moisture_curve_pct: List[float]
    oxidation_curve_pv: List[float]
    ambient_label: str
    temp_c: float
    rh_pct: float
    shelf_life_limit_day: Optional[int] = None
    cold_chain_failure_applied: bool = False
