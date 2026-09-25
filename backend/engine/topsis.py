import numpy as np
from typing import List, Dict, Tuple, Optional

def normalize_matrix(matrix: np.ndarray) -> np.ndarray:
    """Vector normalization for TOPSIS.
    r_ij = x_ij / sqrt(sum(x_ij^2))
    """
    norms = np.sqrt(np.sum(matrix**2, axis=0))
    # Avoid division by zero
    norms[norms == 0] = 1.0
    return matrix / norms

def topsis_rank(
    decision_matrix: np.ndarray,
    weights: np.ndarray,
    benefit_criteria: List[bool]
) -> Tuple[np.ndarray, np.ndarray]:
    """Full TOPSIS algorithm.
    
    Args:
        decision_matrix: m alternatives x n criteria
        weights: n weights summing to 1
        benefit_criteria: True if higher is better, False if lower is better
    
    Returns:
        (closeness_coefficients, rankings)
    """
    # Step 1: Normalize
    norm_matrix = normalize_matrix(decision_matrix)
    
    # Step 2: Weighted normalized matrix
    weighted = norm_matrix * weights
    
    # Step 3: Ideal and anti-ideal solutions
    ideal = np.zeros(weighted.shape[1])
    anti_ideal = np.zeros(weighted.shape[1])
    
    for j in range(weighted.shape[1]):
        if benefit_criteria[j]:
            ideal[j] = np.max(weighted[:, j])
            anti_ideal[j] = np.min(weighted[:, j])
        else:
            ideal[j] = np.min(weighted[:, j])
            anti_ideal[j] = np.max(weighted[:, j])
    
    # Step 4: Separation measures
    d_plus = np.sqrt(np.sum((weighted - ideal)**2, axis=1))
    d_minus = np.sqrt(np.sum((weighted - anti_ideal)**2, axis=1))
    
    # Step 5: Relative closeness
    closeness = d_minus / (d_plus + d_minus + 1e-10)
    
    # Rankings (1 = best)
    rankings = closeness.argsort()[::-1].argsort() + 1
    
    return closeness, rankings

def filter_polymers_by_constraints(
    polymers: List[Dict],
    light_sensitive: bool = False,
    requires_fssai: bool = True,
    layer_type: Optional[str] = None
) -> List[Dict]:
    """Pre-filter polymers based on hard constraints."""
    filtered = []
    for p in polymers:
        # FSSAI filter for sealant layers
        if requires_fssai and layer_type == 'Heat Sealant Layer' and not p.get('fssai_certified', False):
            continue
        # Light sensitivity filter for outer layer
        if light_sensitive and layer_type == 'Substrate/Print Layer':
            if p.get('optical_haze_pct', 0) < 85:
                continue  # Needs opaque/metallized
        # Layer type filter
        if layer_type and p.get('category_type') != layer_type:
            # Allow monolayer polymers in any position
            if p.get('category_type') != 'Monolayer':
                continue
        filtered.append(p)
    return filtered

def build_decision_matrix(
    polymers: List[Dict],
    target_wvtr: float,
    target_otr: float
) -> Tuple[np.ndarray, List[str]]:
    """Build TOPSIS decision matrix from polymer list.
    
    Criteria (5):
    1. Barrier Fitness: How well the polymer meets target WVTR+OTR (benefit - higher = film is tighter than target)
    2. Cost Efficiency: cost_per_kg_inr (cost - lower is better)
    3. Carbon Footprint: carbon_footprint_kgCO2 (cost - lower is better)
    4. Mechanical Strength: puncture_resistance_N (benefit)
    5. Seal Integrity: inverse of seal_initiation_temp (benefit - lower temp = easier seal = higher score)
    """
    n = len(polymers)
    matrix = np.zeros((n, 5))
    names = []
    
    for i, p in enumerate(polymers):
        names.append(p['name'])
        
        # Barrier fitness: ratio of target to actual (higher = film exceeds requirement)
        wvtr_fitness = target_wvtr / max(p['baseline_wvtr'], 0.001)
        otr_fitness = target_otr / max(p['baseline_otr'], 0.001)
        matrix[i, 0] = (wvtr_fitness + otr_fitness) / 2.0
        
        # Cost (to be minimized)
        matrix[i, 1] = p.get('cost_per_kg_inr', 200)
        
        # Carbon footprint (to be minimized)
        matrix[i, 2] = p.get('carbon_footprint_kgCO2', 3.0)
        
        # Mechanical strength (to be maximized)
        matrix[i, 3] = p.get('puncture_resistance_N', 5.0)
        
        # Seal integrity: 1/seal_temp (higher = better sealability)
        seal_temp = p.get('seal_initiation_temp_C', 120)
        matrix[i, 4] = 1.0 / max(seal_temp, 1.0) * 1000  # Scale for numerical stability
    
    return matrix, names

def recommend_laminate(
    polymers_list: List[Dict],
    target_wvtr: float,
    target_otr: float,
    light_sensitive: bool = False,
    weights: Optional[np.ndarray] = None
) -> Dict:
    """Full TOPSIS-based 3-layer laminate recommendation.
    
    Selects best polymer for each layer:
    - Outer (Substrate/Print)
    - Barrier Core
    - Sealant (Heat Sealant)
    
    Returns recommendation dict with layer specs, scores, and costs.
    """
    if weights is None:
        weights = np.array([0.35, 0.25, 0.20, 0.10, 0.10])
    
    benefit_criteria = [True, False, False, True, True]
    
    layers_config = [
        ('Substrate/Print Layer', 'Outer / Print Layer'),
        ('Barrier Core Layer', 'Core / Barrier Layer'),
        ('Heat Sealant Layer', 'Sealant / Contact Layer')
    ]
    
    selected_layers = []
    total_cost = 0.0
    total_carbon = 0.0
    best_overall_score = 0.0
    
    for layer_type, layer_name in layers_config:
        candidates = filter_polymers_by_constraints(
            polymers_list,
            light_sensitive=light_sensitive,
            requires_fssai=(layer_type == 'Heat Sealant Layer'),
            layer_type=layer_type
        )
        
        if not candidates:
            # Fallback: use any available polymer
            candidates = polymers_list[:5] if polymers_list else []
        
        if not candidates:
            continue
            
        matrix, names = build_decision_matrix(candidates, target_wvtr, target_otr)
        
        if matrix.shape[0] == 1:
            # Only one candidate, use it
            best_idx = 0
            best_score = 1.0
        else:
            scores, rankings = topsis_rank(matrix, weights, benefit_criteria)
            best_idx = np.argmax(scores)
            best_score = float(scores[best_idx])
        
        best_polymer = candidates[best_idx]
        
        layer_spec = {
            'layer_name': layer_name,
            'polymer_name': best_polymer['name'],
            'polymer_id': best_polymer['id'],
            'thickness_um': best_polymer.get('nominal_thickness_um', 25),
            'function': layer_name,
            'topsis_score': round(best_score, 4),
            'wvtr': best_polymer['baseline_wvtr'],
            'otr': best_polymer['baseline_otr'],
            'cost_per_kg': best_polymer.get('cost_per_kg_inr', 200),
            'carbon_footprint': best_polymer.get('carbon_footprint_kgCO2', 3.0)
        }
        
        selected_layers.append(layer_spec)
        # Estimate cost per m² (approximate: density ~1 g/cm³, thickness in um)
        thickness_m = best_polymer.get('nominal_thickness_um', 25) * 1e-6
        density_kg_m3 = 950  # approximate polyolefin density
        mass_per_m2 = thickness_m * density_kg_m3  # kg/m²
        cost_per_m2 = mass_per_m2 * best_polymer.get('cost_per_kg_inr', 200)
        total_cost += cost_per_m2
        total_carbon += mass_per_m2 * best_polymer.get('carbon_footprint_kgCO2', 3.0)
        best_overall_score += best_score
    
    avg_score = best_overall_score / max(len(selected_layers), 1)
    
    return {
        'layers': selected_layers,
        'total_cost_per_m2_inr': round(total_cost, 4),
        'total_carbon_per_m2': round(total_carbon, 6),
        'overall_topsis_score': round(avg_score, 4)
    }
