from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserSignup(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    email: EmailStr
    password: str
    role: Optional[str] = "user" # guest, user, researcher, admin
    organization_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    name: str
    email: str
    role: str
    organization_name: Optional[str] = None
    created_at: datetime

# --- Commodity Schemas ---
class CommodityBase(BaseModel):
    name: str
    category: str
    default_moisture_content: float
    default_oil_fat_content: float
    default_ph: float
    default_respiration_rate: Optional[float] = None
    product_form: Optional[str] = "solid"

class CommodityCreate(CommodityBase):
    pass

class CommodityResponse(CommodityBase):
    model_config = ConfigDict(from_attributes=True)

    commodity_id: str
    is_custom: bool
    created_at: datetime

# --- Packaging Material Schemas ---
class MaterialBase(BaseModel):
    name: str
    material_type: str
    otr_range: str
    wvtr_range: str
    thickness_range_microns: str
    mechanical_strength_index: float
    sealability_rating: str
    gas_permeability_notes: Optional[str] = None
    map_compatible: bool = True
    cost_index: float = 5.0
    cost_estimate_local: Optional[float] = None
    supplier_channel_note: Optional[str] = None
    confidence_level: float = 0.90
    source_reference: Optional[str] = None
    is_recyclable: bool = True
    is_biodegradable: bool = False

class MaterialCreate(MaterialBase):
    sustainability_score: Optional[float] = 50.0
    carbon_footprint_index: Optional[float] = 2.5
    recyclability_notes: Optional[str] = None

class MaterialResponse(MaterialBase):
    model_config = ConfigDict(from_attributes=True)

    material_id: str
    sustainability_score: Optional[float] = None
    carbon_footprint_index: Optional[float] = None
    recyclability_notes: Optional[str] = None
    commonly_used_for: Optional[List[str]] = []

# --- Recommendation Schemas ---
class RecommendationInput(BaseModel):
    commodity_id: Optional[str] = None
    commodity_name: Optional[str] = "freshProduce"
    moisture_content: Optional[float] = Field(None, ge=0.0, le=100.0, description="Moisture content percentage (0-100)")
    oil_fat_content: Optional[float] = Field(None, ge=0.0, le=100.0, description="Oil/fat content percentage (0-100)")
    ph_level: Optional[float] = Field(None, ge=0.0, le=14.0, description="pH level (0-14)")
    respiration_rate: Optional[float] = Field(None, ge=0.0, description="Respiration rate in mL CO2/kg/hr")
    desired_shelf_life: Optional[int] = Field(14, ge=1, description="Desired shelf life in days")
    storage_type: Optional[str] = "chilled"
    storage_temp: Optional[float] = Field(4.0, ge=-50.0, le=100.0, description="Storage temperature in Celsius")
    relative_humidity: Optional[float] = Field(85.0, ge=0.0, le=100.0, description="Relative humidity percentage (0-100)")
    transport_conditions: Optional[str] = "smooth"
    demo_mode: Optional[bool] = False
    demo_commodity: Optional[str] = None
    priority: Optional[str] = "balanced"  # balanced, longer_shelf_life, lower_cost, sustainability

class RankedMaterial(BaseModel):
    material_id: str
    name: str
    material_type: str
    rank: int
    confidence_score: float
    recommended_thickness: str
    recommended_otr: str
    recommended_wvtr: str
    sealability: str
    map_required: str
    eco_alternative: str
    explanation: str
    source_reference: Optional[str] = None
    cost_index: float
    cost_estimate_local: Optional[float] = None
    supplier_channel_note: Optional[str] = None
    sustainability_score: float
    baseline_otr: Optional[float] = None
    baseline_wvtr: Optional[float] = None
    otr_range: Optional[str] = None
    wvtr_range: Optional[str] = None
    mechanical_strength_index: Optional[float] = None
    puncture_resistance_N: Optional[float] = None
    carbon_footprint_kgCO2: Optional[float] = None
    cost_per_kg_inr: Optional[float] = None

class RecommendationResponse(BaseModel):
    recommendation_id: str
    commodity: str
    primary_material: str
    target_otr: str
    target_wvtr: str
    thickness: str
    sealability: str
    map_required: str
    eco_alternative: str
    shelf_life_days: float
    ranked_materials: List[RankedMaterial]
    map_advisory: Optional[Dict[str, Any]] = None
    recommended_format: Optional[str] = None
    format_id: Optional[str] = None
    short_shelf_life_note: Optional[str] = None
    demo_scenario_comparison: Optional[str] = None
    explanation_text: Optional[str] = None
    is_demo: Optional[bool] = False
    resolved_food_profile: Optional[Dict[str, Any]] = None
    created_at: datetime
    structure_layers: Optional[List[Dict[str, Any]]] = None
    comparison_candidates: Optional[List[Dict[str, Any]]] = None
    dossier_id: Optional[str] = None
    priority: Optional[str] = "balanced"
    reasons: Optional[List[str]] = None
    strength_spec: Optional[str] = None
    map_spec: Optional[str] = None
    alternatives: Optional[Dict[str, Any]] = None
    ml_surrogate_prediction: Optional[Dict[str, Any]] = None

# --- Shelf Life Schemas ---
class ShelfLifePredictInput(BaseModel):
    commodity_type: str
    material_type: str
    storage_temp: float
    relative_humidity: float
    initial_moisture: Optional[float] = 60.0
    packaging_barrier_grade: Optional[str] = "standard"

class ShelfLifeResponse(BaseModel):
    commodity: str
    material: str
    predicted_shelf_life_days: float
    decay_rate_per_day: float
    q10_factor: float
    sensitivity_curve: List[Dict[str, Any]]
    recommendation_note: str

# --- MAP Schemas ---
class MapAdvisorInput(BaseModel):
    commodity_name: str
    weight_grams: float = 500.0
    packaging_volume_ml: float = 1200.0
    respiration_rate_ml_co2_kg_hr: Optional[float] = 25.0
    storage_temp_c: float = 4.0

class MapAdvisorResponse(BaseModel):
    commodity: str
    target_o2_percent: float
    target_co2_percent: float
    target_n2_percent: float
    micro_perforation_density: str
    gas_flush_volume_liters: float
    condensation_risk: str
    advisory_notes: str

# --- Sustainability Schemas ---
class SustainabilityInput(BaseModel):
    material_id: Optional[str] = None
    material_name: Optional[str] = "LDPE"
    production_volume_units: int = 10000
    pack_weight_grams: float = 15.0

class SustainabilityResponse(BaseModel):
    material_name: str
    sustainability_score: float
    carbon_footprint_total_kg_co2: float
    carbon_per_unit_g_co2: float
    recyclability_rating: str
    biodegradability: bool
    cost_estimate_usd: float
    cost_per_unit_usd: float
    eco_recommendation: str

# --- QR & Traceability Schemas ---
class QrGenerateInput(BaseModel):
    recommendation_id: Optional[str] = None
    batch_label: str = "BATCH-2026-X1"
    commodity: str = "Organic Apples"
    packaging_material: str = "Breathable Polypropylene (PP)"
    pack_date: Optional[str] = None
    expiry_date: Optional[str] = None

class QrResponse(BaseModel):
    qr_id: str
    qr_code_svg: str
    qr_data_url: str
    batch_label: str
    tracking_url: str

class ScanLogCreate(BaseModel):
    scanned_location: str
    scanned_by: Optional[str] = "Inspector"

class ScanLogResponse(BaseModel):
    log_id: int
    qr_id: str
    scanned_at: datetime
    scanned_location: Optional[str]
    scanned_by: Optional[str]

# --- Admin Schemas ---
class AdminAnalyticsResponse(BaseModel):
    total_recommendations: int
    total_commodities: int
    total_materials: int
    total_users: int
    popular_commodities: List[Dict[str, Any]]
    popular_materials: List[Dict[str, Any]]
    model_status: Dict[str, Any]

# --- Feedback Schemas ---
class FeedbackCreate(BaseModel):
    recommendation_id: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    comments: Optional[str] = None

class FeedbackResponse(BaseModel):
    status: str
    message: str
    feedback_id: Optional[int] = None

# --- System Status Schemas ---
class SystemStatusResponse(BaseModel):
    status: str
    database: str
    ml_model_status: str
    dataset_records: Dict[str, int]
    timestamp: datetime
    ml_engine: Optional[str] = None
    ml_accuracy: Optional[str] = None

# --- Packaging Format, Preservative, Checklist Schemas ---
class PackagingFormatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    format_id: str
    name: str
    diagram_svg: Optional[str] = None
    typical_use_cases: List[str]
    pros: str
    cons: str
    related_material_ids: Optional[List[str]] = []
    created_at: Optional[datetime] = None

class PreservativeCategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    common_examples: List[str]
    typical_food_use_cases: List[str]
    natural_vs_synthetic: str
    regulatory_disclaimer: str
    official_source_link: str
    created_at: Optional[datetime] = None

class ChecklistItem(BaseModel):
    item_id: str
    item_title: str
    description: str
    official_reference_link: str
    is_mandatory: bool
    stage: Optional[str] = "Pre-Launch"

class ComplianceChecklistResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    jurisdiction: str
    product_category: str
    checklist_items: List[Dict[str, Any]]
    created_at: Optional[datetime] = None

class UserProgressUpdate(BaseModel):
    jurisdiction: str = "India — FSSAI"
    completed_item_ids: List[str]

class UserProgressResponse(BaseModel):
    jurisdiction: str
    completed_item_ids: List[str]
    total_items: int
    mandatory_total: int
    mandatory_completed: int
    progress_percentage: float
    mandatory_progress_percentage: float
    updated_at: Optional[datetime] = None
