import numpy as np
from typing import Dict, List, Optional, Tuple
from backend.engine.permeation import arrhenius_shift, WVTR_STD_TEMP_K, OTR_STD_TEMP_K

def simulate_shelf_life(
    laminate_wvtr: float,
    laminate_otr: float,
    activation_energy_wvtr_kj: float,
    activation_energy_otr_kj: float,
    package_area_m2: float,
    mass_kg: float,
    initial_moisture_pct: float,
    critical_moisture_pct: float,
    lipid_pct: float,
    simulation_days: int = 90,
    storage_temp_c: float = 25.0,
    storage_rh_pct: float = 65.0,
    cold_chain_failure: bool = False,
    failure_temp_c: float = 40.0,
    failure_duration_hours: float = 8.0,
    failure_day: int = 15
) -> Dict:
    """Day-by-day shelf life simulation.
    
    Simulates:
    1. Moisture uptake: based on WVTR through packaging film
    2. Lipid oxidation: Peroxide Value (PV) accumulation via oxygen permeation
    3. Optional cold-chain failure: temperature spike causing accelerated degradation
    
    Returns time-series data for charting.
    """
    mass_g = mass_kg * 1000.0
    
    # Initialize arrays
    days = list(range(simulation_days + 1))
    moisture_curve = np.zeros(simulation_days + 1)
    oxidation_curve = np.zeros(simulation_days + 1)  # Peroxide Value (meq/kg)
    
    moisture_curve[0] = initial_moisture_pct
    oxidation_curve[0] = 0.0  # Initial PV
    
    # RH driving force factor (normalized to test conditions at 90% RH)
    rh_factor = storage_rh_pct / 90.0
    
    shelf_life_day = None
    
    for day in range(1, simulation_days + 1):
        # Determine effective temperature for this day
        if cold_chain_failure and day == failure_day:
            # During failure: weighted average of normal and failure temps
            hours_normal = 24.0 - failure_duration_hours
            t_eff_c = (hours_normal * storage_temp_c + failure_duration_hours * failure_temp_c) / 24.0
        else:
            t_eff_c = storage_temp_c
        
        t_eff_k = t_eff_c + 273.15
        
        # Arrhenius-corrected permeabilities
        effective_wvtr = arrhenius_shift(
            laminate_wvtr, activation_energy_wvtr_kj,
            WVTR_STD_TEMP_K, t_eff_k
        )
        effective_otr = arrhenius_shift(
            laminate_otr, activation_energy_otr_kj,
            OTR_STD_TEMP_K, t_eff_k
        )
        
        # --- Moisture uptake ---
        # Daily moisture gain (g) = WVTR * Area * RH_factor
        daily_moisture_gain_g = effective_wvtr * package_area_m2 * rh_factor
        # Convert to percentage gain
        moisture_gain_pct = (daily_moisture_gain_g / mass_g) * 100.0
        moisture_curve[day] = moisture_curve[day-1] + moisture_gain_pct
        
        # --- Lipid oxidation (PV accumulation) ---
        if lipid_pct > 0:
            # Daily O2 ingress (cc) = OTR * Area
            daily_o2_cc = effective_otr * package_area_m2
            # PV increase proportional to O2 ingress and lipid content
            # Empirical: ~0.5 meq PV per cc O2 per kg fat at 25°C
            oxidation_rate_factor = 0.5 * (lipid_pct / 100.0)
            # Temperature acceleration factor (Q10 ≈ 2 for lipid oxidation)
            q10_factor = 2.0 ** ((t_eff_c - 25.0) / 10.0)
            daily_pv_increase = (daily_o2_cc / mass_kg) * oxidation_rate_factor * q10_factor
            oxidation_curve[day] = oxidation_curve[day-1] + daily_pv_increase
        else:
            oxidation_curve[day] = oxidation_curve[day-1]
        
        # Check shelf life limits
        if shelf_life_day is None:
            moisture_exceeded = moisture_curve[day] >= critical_moisture_pct
            # PV limit: 10 meq/kg for most foods, 5 for sensitive oils
            pv_limit = 5.0 if lipid_pct > 30 else 10.0
            oxidation_exceeded = oxidation_curve[day] >= pv_limit if lipid_pct > 0 else False
            if moisture_exceeded or oxidation_exceeded:
                shelf_life_day = day
    
    return {
        'days': days,
        'moisture_curve_pct': [round(float(x), 4) for x in moisture_curve],
        'oxidation_curve_pv': [round(float(x), 4) for x in oxidation_curve],
        'ambient_label': f'{storage_temp_c}°C / {storage_rh_pct}% RH',
        'temp_c': storage_temp_c,
        'rh_pct': storage_rh_pct,
        'shelf_life_limit_day': shelf_life_day,
        'cold_chain_failure_applied': cold_chain_failure
    }
