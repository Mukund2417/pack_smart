import numpy as np
from scipy.optimize import fsolve
from typing import Dict, Optional, Tuple

def michaelis_menten_rate(vm: float, km: float, o2_conc_pct: float) -> float:
    """Calculate respiration rate using Michaelis-Menten kinetics.
    R = Vm * [O2] / (Km + [O2])
    vm: max respiration rate (mg O2/kg·hr)
    km: Michaelis constant (% O2)
    o2_conc_pct: O2 concentration (%)
    Returns: respiration rate (mg O2/kg·hr)
    """
    if o2_conc_pct < 0:
        o2_conc_pct = 0.0
    return (vm * o2_conc_pct) / (km + o2_conc_pct)

def steady_state_o2(
    vm: float, km: float,
    package_area_m2: float,
    film_po2: float,  # cc O2/m²·day·atm
    mass_kg: float,
    ambient_o2_pct: float = 20.9
) -> float:
    """Solve for steady-state O2 concentration inside MAP.
    At steady state: Film O2 transmission = Respiration O2 consumption
    P_O2 * A * (O2_ambient - O2_pkg) / 100 = R(O2_pkg) * M * 24 / (32*1000) * 22414/32
    
    Simplified: balance film transmission against produce consumption.
    Returns equilibrium O2 % inside package.
    """
    # Convert respiration from mg O2/kg·hr to cc O2/kg·day
    # 1 mol O2 = 32g = 22414 cc at STP
    # mg O2/kg·hr * 24 hr/day * (22.414 cc/mmol) / (32 mg/mmol) = cc O2/kg·day
    conversion_factor = 24.0 * 22.414 / 32.0  # ~16.81 cc/mg
    
    def equations(o2_pkg):
        o2_pkg = max(o2_pkg[0], 0.001)  # prevent negative
        # Respiration rate in cc O2/kg/day
        resp_rate = michaelis_menten_rate(vm, km, o2_pkg) * conversion_factor
        # Total respiration for the mass
        total_resp = resp_rate * mass_kg  # cc O2/day
        # Film transmission: P * A * delta_partial_pressure
        # OTR is at 1 atm O2 differential; actual delta = (ambient - pkg)/100
        film_transmission = film_po2 * package_area_m2 * (ambient_o2_pct - o2_pkg) / 100.0
        return [film_transmission - total_resp]
    
    initial_guess = [10.0]  # Start at 10% O2
    solution = fsolve(equations, initial_guess, full_output=False)
    return max(min(float(solution[0]), ambient_o2_pct), 0.0)

def steady_state_co2(
    o2_consumed_pct: float,
    rq: float = 1.0,  # Respiratory quotient
    ambient_co2_pct: float = 0.04
) -> float:
    """Estimate steady-state CO2 based on O2 consumed.
    CO2_produced ≈ RQ * (ambient_O2 - pkg_O2)
    """
    o2_consumed = 20.9 - o2_consumed_pct
    co2_produced = rq * o2_consumed
    return ambient_co2_pct + co2_produced

def required_perforations(
    vm: float, km: float,
    mass_kg: float,
    target_o2_pct: float,
    film_base_otr: float,
    package_area_m2: float,
    hole_diameter_um: float = 100.0,
    ambient_o2_pct: float = 20.9
) -> Dict:
    """Calculate number of laser micro-perforations needed.
    
    Each perforation of diameter d adds OTR contribution:
    OTR_hole = D_O2_air * pi * (d/2)^2 / (L_film * 1e-6)
    D_O2_air ≈ 0.21 cm²/s = 1.814e4 cc·cm/(m²·day·atm) approx
    
    Returns dict with perforation specs.
    """
    conversion_factor = 24.0 * 22.414 / 32.0
    
    # Required respiration rate at target O2
    resp_at_target = michaelis_menten_rate(vm, km, target_o2_pct) * conversion_factor
    total_resp = resp_at_target * mass_kg  # cc O2/day
    
    # Required total OTR from film
    delta_o2_fraction = (ambient_o2_pct - target_o2_pct) / 100.0
    if delta_o2_fraction <= 0:
        return {'perforations_needed': 0, 'total_otr_required': 0, 'message': 'No MAP needed'}
    
    required_total_otr = total_resp / (package_area_m2 * delta_o2_fraction)
    
    # Additional OTR needed beyond base film
    additional_otr = max(0, required_total_otr - film_base_otr)
    
    if additional_otr <= 0:
        return {
            'perforations_needed': 0,
            'total_otr_required': round(required_total_otr, 2),
            'base_film_otr': round(film_base_otr, 2),
            'message': 'Base film OTR is sufficient, no perforations needed'
        }
    
    # OTR per micro-perforation (simplified model)
    # Using Fick's law through a cylindrical hole
    d_cm = hole_diameter_um * 1e-4  # um to cm
    hole_area_cm2 = np.pi * (d_cm/2)**2
    # Effective diffusion through hole ≈ 3.0 cc/(day·hole) for 100um hole
    # This is a simplified industrial approximation
    D_o2_air = 0.21  # cm²/s diffusion coefficient of O2 in air
    # Convert to cc/day per hole: D * area / thickness * seconds_per_day * pressure
    film_thickness_cm = 0.0025  # ~25um typical
    otr_per_hole = D_o2_air * hole_area_cm2 / film_thickness_cm * 86400.0  # cc/day/hole
    
    n_holes = int(np.ceil(additional_otr * package_area_m2 / otr_per_hole))
    holes_per_m2 = n_holes / package_area_m2 if package_area_m2 > 0 else 0
    
    return {
        'perforations_needed': n_holes,
        'holes_per_m2': round(holes_per_m2, 1),
        'hole_diameter_um': hole_diameter_um,
        'total_otr_required': round(required_total_otr, 2),
        'base_film_otr': round(film_base_otr, 2),
        'additional_otr_needed': round(additional_otr, 2),
        'otr_per_hole': round(otr_per_hole, 4),
        'message': f'{n_holes} perforations of {hole_diameter_um}μm diameter recommended'
    }

def compute_map_recommendation(
    vm: float, km: float,
    mass_kg: float,
    package_area_m2: float,
    film_otr: float,
    film_co2_perm: float,
    target_o2_range: Tuple[float, float] = (3.0, 8.0),
    target_co2_range: Tuple[float, float] = (2.0, 10.0)
) -> Dict:
    """Full MAP recommendation combining equilibrium analysis and perforations."""
    eq_o2 = steady_state_o2(vm, km, package_area_m2, film_otr, mass_kg)
    eq_co2 = steady_state_co2(eq_o2)
    
    target_o2 = (target_o2_range[0] + target_o2_range[1]) / 2
    
    perf_info = required_perforations(
        vm, km, mass_kg, target_o2,
        film_otr, package_area_m2
    )
    
    # Check if equilibrium is within acceptable range
    o2_ok = target_o2_range[0] <= eq_o2 <= target_o2_range[1]
    co2_ok = target_co2_range[0] <= eq_co2 <= target_co2_range[1]
    
    return {
        'equilibrium_o2_pct': round(eq_o2, 2),
        'equilibrium_co2_pct': round(eq_co2, 2),
        'o2_in_range': o2_ok,
        'co2_in_range': co2_ok,
        'target_o2_range': list(target_o2_range),
        'target_co2_range': list(target_co2_range),
        'perforation_recommendation': perf_info,
        'atmosphere_status': 'Optimal' if (o2_ok and co2_ok) else 'Adjustment needed'
    }
