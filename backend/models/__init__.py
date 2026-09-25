from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from backend.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(100), nullable=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    password_hash = Column(String(255), nullable=True)
    auth_provider = Column(String(50), default="email") # email, google, otp
    role = Column(String(50), default="user") # guest, user, researcher, admin
    organization_name = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    recommendations = relationship("Recommendation", back_populates="user")
    reports = relationship("Report", back_populates="user")

    # Compatibility properties for legacy models
    @property
    def id(self):
        return self.user_id

    @property
    def hashed_password(self):
        return self.password_hash


class Commodity(Base):
    __tablename__ = "commodities"

    commodity_id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), index=True, nullable=False)
    category = Column(String(100), nullable=False) # fresh produce, dairy, bakery, meat & seafood, dry goods, beverages, ready-to-eat
    default_moisture_content = Column(Float, nullable=False, default=50.0)
    initial_moisture_pct = Column(Float, nullable=False, default=50.0)
    critical_moisture_pct = Column(Float, nullable=False, default=15.0)
    default_oil_fat_content = Column(Float, nullable=False, default=5.0)
    lipid_pct = Column(Float, default=5.0)
    default_ph = Column(Float, nullable=False, default=6.0)
    water_activity_aw = Column(Float, nullable=False, default=0.7)
    default_respiration_rate = Column(Float, nullable=True) # mL CO2/kg/hr
    respiration_class = Column(String(30), default="None")
    vm_o2 = Column(Float, default=0.0)
    km_o2 = Column(Float, default=0.0)
    optimal_temp_min = Column(Float, default=0.0)
    optimal_temp_max = Column(Float, default=25.0)
    max_tolerable_o2_uptake = Column(Float, default=0.0)
    oxidation_sensitivity = Column(String(20), default="Low")
    light_sensitivity = Column(Boolean, default=False)
    product_form = Column(String(50), default="solid") # solid, liquid, powder, semi-solid
    is_custom = Column(Boolean, default=False)
    created_by = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    recommendations = relationship("Recommendation", back_populates="commodity")
    aliases = relationship("CommodityAlias", back_populates="commodity", cascade="all, delete-orphan")
    research_sources = relationship("ResearchSource", back_populates="commodity")

    @property
    def id(self):
        return self.commodity_id


class CommodityAlias(Base):
    __tablename__ = "commodity_aliases"

    id = Column(Integer, primary_key=True, autoincrement=True)
    commodity_id = Column(String(36), ForeignKey("commodities.commodity_id"), nullable=False, index=True)
    alias_name = Column(String(100), nullable=False, index=True)
    locale = Column(String(10), default="en")

    commodity = relationship("Commodity", back_populates="aliases")


class PackagingMaterial(Base):
    __tablename__ = "packaging_materials"

    material_id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), index=True, nullable=False)
    material_type = Column(String(50), nullable=False) # plastic, laminate, biodegradable, foil, breathable film
    category_type = Column(String(50), default="Monolayer") # Monolayer, Substrate/Print Layer, Barrier Core Layer, Heat Sealant Layer
    nominal_thickness_um = Column(Float, default=25.0)
    baseline_wvtr = Column(Float, default=10.0)
    baseline_otr = Column(Float, default=100.0)
    co2_permeability = Column(Float, default=0.0)
    activation_energy_wvtr = Column(Float, default=40.0)
    activation_energy_otr = Column(Float, default=35.0)
    puncture_resistance_N = Column(Float, default=5.0)
    seal_initiation_temp_C = Column(Float, default=120.0)
    optical_haze_pct = Column(Float, default=5.0)
    cost_per_kg_inr = Column(Float, default=200.0)
    carbon_footprint_kgCO2 = Column(Float, default=3.0)
    recyclability_class = Column(String(5), default="C")
    fssai_certified = Column(Boolean, default=True)

    otr_range = Column(String(100), nullable=False) # cc/m²/day
    wvtr_range = Column(String(100), nullable=False) # g/m²/day
    thickness_range_microns = Column(String(100), nullable=False)
    mechanical_strength_index = Column(Float, default=7.0) # 1-10
    sealability_rating = Column(String(20), default="high") # low, medium, high
    gas_permeability_notes = Column(Text, nullable=True)
    map_compatible = Column(Boolean, default=True)
    cost_index = Column(Float, default=5.0) # relative scale 1-10
    cost_estimate_local = Column(Float, nullable=True) # local currency cost estimate
    supplier_channel_note = Column(Text, nullable=True)
    confidence_level = Column(Float, default=0.90) # 0.0 to 1.0
    source_reference = Column(Text, nullable=True)
    is_recyclable = Column(Boolean, default=True)
    is_biodegradable = Column(Boolean, default=False)
    created_at = Column(DateTime, default=get_utc_now)

    sustainability_data = relationship("MaterialSustainabilityData", back_populates="material", uselist=False)
    recommendation_links = relationship("RecommendationMaterial", back_populates="material")
    research_sources = relationship("ResearchSource", back_populates="material")

    @property
    def id(self):
        return self.material_id


class MaterialSustainabilityData(Base):
    __tablename__ = "material_sustainability_data"

    id = Column(Integer, primary_key=True, autoincrement=True)
    material_id = Column(String(36), ForeignKey("packaging_materials.material_id"), unique=True)
    sustainability_score = Column(Float, default=50.0) # 0-100
    carbon_footprint_index = Column(Float, default=2.5) # kg CO2e / kg
    recyclability_notes = Column(Text, nullable=True)

    material = relationship("PackagingMaterial", back_populates="sustainability_data")


class ResearchSource(Base):
    __tablename__ = "research_sources"

    source_id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    authors = Column(String(255), nullable=True)
    year = Column(Integer, nullable=True)
    doi = Column(String(100), nullable=True)
    url = Column(String(255), nullable=True)
    source_type = Column(String(50), default="journal") # journal, standard, book, database
    property_measured = Column(String(100), nullable=True) # OTR, WVTR, Respiration, Aw
    material_id = Column(String(36), ForeignKey("packaging_materials.material_id"), nullable=True)
    commodity_id = Column(String(36), ForeignKey("commodities.commodity_id"), nullable=True)
    test_conditions = Column(String(150), nullable=True) # 23°C, 0% RH, ASTM D3985
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    material = relationship("PackagingMaterial", back_populates="research_sources")
    commodity = relationship("Commodity", back_populates="research_sources")


class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True, index=True)
    commodity_id = Column(String(36), ForeignKey("commodities.commodity_id"), nullable=True)
    commodity_name = Column(String(100), nullable=True)
    input_moisture_content = Column(Float, nullable=True)
    input_oil_fat_content = Column(Float, nullable=True)
    input_ph = Column(Float, nullable=True)
    input_respiration_rate = Column(Float, nullable=True)
    desired_shelf_life_days = Column(Integer, default=14)
    storage_type = Column(String(50), default="ambient") # ambient, chilled, frozen
    storage_temperature = Column(Float, default=20.0)
    relative_humidity = Column(Float, default=65.0)
    transport_mode = Column(String(100), default="road")
    transport_duration_hours = Column(Float, default=24.0)
    created_at = Column(DateTime, default=get_utc_now, index=True)

    user = relationship("User", back_populates="recommendations")
    commodity = relationship("Commodity", back_populates="recommendations")
    ranked_materials = relationship("RecommendationMaterial", back_populates="recommendation", cascade="all, delete-orphan")
    shelf_life = relationship("ShelfLifePrediction", back_populates="recommendation", uselist=False, cascade="all, delete-orphan")
    map_advisory = relationship("MapAdvisory", back_populates="recommendation", uselist=False, cascade="all, delete-orphan")
    qr_codes = relationship("QrCode", back_populates="recommendation", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="recommendation", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="recommendation", cascade="all, delete-orphan")


class RecommendationMaterial(Base):
    __tablename__ = "recommendation_materials"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recommendation_id = Column(String(36), ForeignKey("recommendations.recommendation_id"), nullable=False)
    material_id = Column(String(36), ForeignKey("packaging_materials.material_id"), nullable=False)
    rank = Column(Integer, nullable=False, default=1)
    confidence_score = Column(Float, default=0.90) # 0-1
    recommended_thickness_microns = Column(Float, default=50.0)
    recommended_otr = Column(Float, default=50.0)
    recommended_wvtr = Column(Float, default=5.0)
    explanation_text = Column(Text, nullable=True)
    source_reference = Column(Text, nullable=True)

    recommendation = relationship("Recommendation", back_populates="ranked_materials")
    material = relationship("PackagingMaterial", back_populates="recommendation_links")


class ShelfLifePrediction(Base):
    __tablename__ = "shelf_life_predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recommendation_id = Column(String(36), ForeignKey("recommendations.recommendation_id"), nullable=True)
    predicted_shelf_life_days = Column(Float, nullable=False)
    sensitivity_data_json = Column(JSON, nullable=True)

    recommendation = relationship("Recommendation", back_populates="shelf_life")


class MapAdvisory(Base):
    __tablename__ = "map_advisories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recommendation_id = Column(String(36), ForeignKey("recommendations.recommendation_id"), nullable=True)
    recommended_o2_percent = Column(Float, default=3.0)
    recommended_co2_percent = Column(Float, default=5.0)
    recommended_n2_percent = Column(Float, default=92.0)
    micro_perforation_density = Column(String(100), default="80 holes/m² (50μm diameter)")

    recommendation = relationship("Recommendation", back_populates="map_advisory")


class QrCode(Base):
    __tablename__ = "qr_codes"

    qr_id = Column(String(36), primary_key=True, default=generate_uuid)
    recommendation_id = Column(String(36), ForeignKey("recommendations.recommendation_id"), nullable=True)
    qr_image_url = Column(Text, nullable=False)
    batch_label = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    recommendation = relationship("Recommendation", back_populates="qr_codes")
    logs = relationship("TraceabilityLog", back_populates="qr_code", cascade="all, delete-orphan")


class TraceabilityLog(Base):
    __tablename__ = "traceability_logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    qr_id = Column(String(36), ForeignKey("qr_codes.qr_id"), nullable=False)
    scanned_at = Column(DateTime, default=get_utc_now)
    scanned_location = Column(String(150), nullable=True)
    scanned_by = Column(String(100), nullable=True)

    qr_code = relationship("QrCode", back_populates="logs")


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(String(36), primary_key=True, default=generate_uuid)
    recommendation_id = Column(String(36), ForeignKey("recommendations.recommendation_id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    file_url = Column(String(255), nullable=True)
    generated_at = Column(DateTime, default=get_utc_now)

    recommendation = relationship("Recommendation", back_populates="reports")
    user = relationship("User", back_populates="reports")


class Feedback(Base):
    __tablename__ = "feedback"

    feedback_id = Column(Integer, primary_key=True, autoincrement=True)
    recommendation_id = Column(String(36), ForeignKey("recommendations.recommendation_id"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    rating = Column(Integer, nullable=False) # 1-5
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    recommendation = relationship("Recommendation", back_populates="feedback")


class PackagingFormat(Base):
    __tablename__ = "packaging_formats"

    format_id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    diagram_svg = Column(Text, nullable=True)
    typical_use_cases = Column(JSON, nullable=False)
    pros = Column(Text, nullable=False)
    cons = Column(Text, nullable=False)
    related_material_ids = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)


class PreservativeCategory(Base):
    __tablename__ = "preservative_categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category = Column(String(100), nullable=False)
    common_examples = Column(JSON, nullable=False)
    typical_food_use_cases = Column(JSON, nullable=False)
    natural_vs_synthetic = Column(String(50), nullable=False)
    regulatory_disclaimer = Column(Text, nullable=False)
    official_source_link = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=get_utc_now)


class ComplianceChecklist(Base):
    __tablename__ = "compliance_checklist"

    id = Column(Integer, primary_key=True, autoincrement=True)
    jurisdiction = Column(String(100), nullable=False, default="India — FSSAI")
    product_category = Column(String(100), nullable=False, default="General Packaged Food")
    checklist_items = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)


class UserChecklistProgress(Base):
    __tablename__ = "user_checklist_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    jurisdiction = Column(String(100), nullable=False, default="India — FSSAI")
    completed_item_ids = Column(JSON, default=list)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    user = relationship("User")


class MLModelRegistry(Base):
    __tablename__ = "ml_model_registry"

    model_id = Column(String(36), primary_key=True, default=generate_uuid)
    model_name = Column(String(100), nullable=False)
    version = Column(String(50), nullable=False)
    status = Column(String(50), default="UNAVAILABLE") # ACTIVE, UNAVAILABLE, CALIBRATING
    accuracy_metric = Column(String(50), nullable=True)
    training_timestamp = Column(DateTime, nullable=True)
    description = Column(Text, nullable=True)
