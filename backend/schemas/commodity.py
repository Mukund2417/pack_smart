from pydantic import BaseModel, ConfigDict
from typing import Optional

class CommodityBase(BaseModel):
    name: str
    category: str
    initial_moisture_pct: float
    critical_moisture_pct: float
    water_activity_aw: float
    lipid_pct: float = 0.0
    oxidation_sensitivity: str = 'Low'
    light_sensitivity: bool = False
    respiration_class: str = 'None'
    vm_o2: float = 0.0
    km_o2: float = 0.0
    optimal_temp_min: float = 0.0
    optimal_temp_max: float = 25.0
    max_tolerable_o2_uptake: float = 0.0

class CommodityCreate(CommodityBase):
    pass

class CommodityUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    initial_moisture_pct: Optional[float] = None
    critical_moisture_pct: Optional[float] = None
    water_activity_aw: Optional[float] = None
    lipid_pct: Optional[float] = None
    oxidation_sensitivity: Optional[str] = None
    light_sensitivity: Optional[bool] = None
    respiration_class: Optional[str] = None
    vm_o2: Optional[float] = None
    km_o2: Optional[float] = None
    optimal_temp_min: Optional[float] = None
    optimal_temp_max: Optional[float] = None
    max_tolerable_o2_uptake: Optional[float] = None

class CommodityResponse(CommodityBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
