from pydantic import BaseModel, ConfigDict
from typing import Optional

class PolymerBase(BaseModel):
    name: str
    category_type: str
    nominal_thickness_um: float = 25.0
    baseline_wvtr: float
    baseline_otr: float
    co2_permeability: float = 0.0
    activation_energy_wvtr: float = 40.0
    activation_energy_otr: float = 35.0
    puncture_resistance_N: float = 5.0
    seal_initiation_temp_C: float = 120.0
    optical_haze_pct: float = 5.0
    cost_per_kg_inr: float = 200.0
    carbon_footprint_kgCO2: float = 3.0
    recyclability_class: str = 'C'
    fssai_certified: bool = True

class PolymerCreate(PolymerBase):
    pass

class PolymerUpdate(BaseModel):
    name: Optional[str] = None
    category_type: Optional[str] = None
    nominal_thickness_um: Optional[float] = None
    baseline_wvtr: Optional[float] = None
    baseline_otr: Optional[float] = None
    co2_permeability: Optional[float] = None
    activation_energy_wvtr: Optional[float] = None
    activation_energy_otr: Optional[float] = None
    puncture_resistance_N: Optional[float] = None
    seal_initiation_temp_C: Optional[float] = None
    optical_haze_pct: Optional[float] = None
    cost_per_kg_inr: Optional[float] = None
    carbon_footprint_kgCO2: Optional[float] = None
    recyclability_class: Optional[str] = None
    fssai_certified: Optional[bool] = None

class PolymerResponse(PolymerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
