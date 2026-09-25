import numpy as np
from typing import Tuple, List, Dict

# Gas constant
R = 8.314  # J/(mol·K)

# Standard test conditions
WVTR_STD_TEMP_K = 311.15   # 38°C
WVTR_STD_RH = 90.0
OTR_STD_TEMP_K = 296.15    # 23°C

def calculate_target_wvtr(
    mass_kg: float,
    delta_moisture_pct: float,
    area_m2: float,
    shelf_life_days: float
) -> float:
    """Calculate required WVTR for package.
    WVTR_target = (M * delta_MC) / (A * t)
    Where M in grams, delta_MC as fraction.
    Returns g/m²·day
    """
    mass_g = mass_kg * 1000.0
    delta_mc_fraction = delta_moisture_pct / 100.0
    if area_m2 <= 0 or shelf_life_days <= 0:
        raise ValueError("Area and shelf life must be positive")
    return (mass_g * delta_mc_fraction) / (area_m2 * shelf_life_days)

def calculate_target_otr(
    mass_kg: float,
    delta_o2_cc_per_kg: float,
    area_m2: float,
    shelf_life_days: float
) -> float:
    """Calculate required OTR for package.
    OTR_target = (M * delta_O2) / (A * t)
    Returns cc/m²·day
    """
    if area_m2 <= 0 or shelf_life_days <= 0:
        raise ValueError("Area and shelf life must be positive")
    return (mass_kg * delta_o2_cc_per_kg) / (area_m2 * shelf_life_days)

def arrhenius_shift(
    baseline_perm: float,
    activation_energy_kj_mol: float,
    t_ref_k: float,
    t_actual_k: float
) -> float:
    """Arrhenius temperature correction for permeability.
    P(T) = P0 * exp(-Ep/R * (1/T - 1/T0))
    activation_energy in kJ/mol (converted to J/mol internally)
    """
    Ep_j = activation_energy_kj_mol * 1000.0  # kJ to J
    exponent = -(Ep_j / R) * (1.0/t_actual_k - 1.0/t_ref_k)
    return baseline_perm * np.exp(exponent)

def laminate_series_resistance(
    layers: List[Dict]
) -> Tuple[float, float]:
    """Calculate aggregate WVTR and OTR for multi-layer laminate.
    Uses resistance-in-series model:
    1/P_laminate = sum(Li/Lref / Pi)
    
    Each layer dict has: 
        wvtr, otr, thickness_um
    Reference thickness Lref = 25 um
    Returns (aggregate_wvtr, aggregate_otr)
    """
    L_ref = 25.0  # reference thickness in microns
    
    wvtr_resistance = 0.0
    otr_resistance = 0.0
    
    for layer in layers:
        thickness = layer['thickness_um']
        wvtr = layer['wvtr']
        otr = layer['otr']
        
        thickness_ratio = thickness / L_ref
        
        if wvtr > 0:
            wvtr_resistance += thickness_ratio / wvtr
        else:
            # Effectively impermeable layer (e.g., Al foil)
            wvtr_resistance += 1e6
        
        if otr > 0:
            otr_resistance += thickness_ratio / otr
        else:
            otr_resistance += 1e6
    
    agg_wvtr = 1.0 / wvtr_resistance if wvtr_resistance > 0 else 0.0
    agg_otr = 1.0 / otr_resistance if otr_resistance > 0 else 0.0
    
    return (agg_wvtr, agg_otr)

def package_surface_area(
    length_cm: float, width_cm: float, height_cm: float
) -> float:
    """Calculate total surface area of rectangular package in m²."""
    area_cm2 = 2 * (length_cm * width_cm + length_cm * height_cm + width_cm * height_cm)
    return area_cm2 / 10000.0  # cm² to m²

def estimate_shelf_life_days(
    laminate_wvtr: float,
    laminate_otr: float,
    area_m2: float,
    mass_kg: float,
    delta_moisture_pct: float,
    delta_o2_cc_per_kg: float,
    storage_temp_c: float = 25.0
) -> float:
    """Estimate shelf life in days based on moisture and oxygen limits.
    Returns the minimum of moisture-limited and oxygen-limited shelf life.
    """
    mass_g = mass_kg * 1000.0
    delta_mc_fraction = delta_moisture_pct / 100.0
    
    # Moisture-limited shelf life
    if laminate_wvtr > 0 and delta_moisture_pct > 0:
        sl_moisture = (mass_g * delta_mc_fraction) / (laminate_wvtr * area_m2)
    else:
        sl_moisture = float('inf')
    
    # Oxygen-limited shelf life
    if laminate_otr > 0 and delta_o2_cc_per_kg > 0:
        sl_oxygen = (mass_kg * delta_o2_cc_per_kg) / (laminate_otr * area_m2)
    else:
        sl_oxygen = float('inf')
    
    return min(sl_moisture, sl_oxygen)
