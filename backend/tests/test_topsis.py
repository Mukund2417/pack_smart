import pytest
import numpy as np
from backend.engine.topsis import (
    normalize_matrix,
    topsis_rank,
    filter_polymers_by_constraints,
    recommend_laminate
)

class TestNormalization:
    def test_unit_norm_columns(self):
        """After normalization, each column should have unit norm."""
        matrix = np.array([[3, 7], [4, 2], [5, 5]])
        normed = normalize_matrix(matrix.astype(float))
        for col in range(normed.shape[1]):
            col_norm = np.sqrt(np.sum(normed[:, col]**2))
            assert abs(col_norm - 1.0) < 0.001
    
    def test_preserves_ratios(self):
        """Normalization should preserve ratios within columns."""
        matrix = np.array([[2.0, 4.0], [4.0, 8.0]])
        normed = normalize_matrix(matrix)
        assert abs(normed[1, 0] / normed[0, 0] - 2.0) < 0.001

class TestTOPSIS:
    def test_dominant_alternative_wins(self):
        """Alternative that dominates all criteria should rank #1."""
        # 3 alternatives, 3 criteria (all benefit)
        matrix = np.array([
            [9, 9, 9],  # Best in everything
            [5, 5, 5],
            [1, 1, 1]   # Worst
        ], dtype=float)
        weights = np.array([0.4, 0.3, 0.3])
        benefit = [True, True, True]
        
        scores, rankings = topsis_rank(matrix, weights, benefit)
        assert rankings[0] == 1  # First alternative should be rank 1
        assert rankings[2] == 3  # Last should be rank 3
        assert scores[0] > scores[1] > scores[2]
    
    def test_cost_criterion_inverted(self):
        """For cost criteria (lower = better), cheapest should score highest."""
        matrix = np.array([
            [100],  # Most expensive
            [50],
            [10]    # Cheapest
        ], dtype=float)
        weights = np.array([1.0])
        benefit = [False]  # Cost criterion
        
        scores, rankings = topsis_rank(matrix, weights, benefit)
        assert rankings[2] == 1  # Cheapest should be rank 1
    
    def test_equal_alternatives(self):
        """Equal alternatives should have equal scores."""
        matrix = np.array([
            [5, 5, 5],
            [5, 5, 5]
        ], dtype=float)
        weights = np.array([0.4, 0.3, 0.3])
        benefit = [True, True, True]
        scores, _ = topsis_rank(matrix, weights, benefit)
        assert abs(scores[0] - scores[1]) < 0.001

class TestFilterConstraints:
    def test_light_sensitivity_filter(self):
        """Light-sensitive products should get opaque outer layer."""
        polymers = [
            {'name': 'Clear PET', 'optical_haze_pct': 5, 'fssai_certified': True, 'category_type': 'Substrate/Print Layer'},
            {'name': 'Met-PET', 'optical_haze_pct': 97, 'fssai_certified': True, 'category_type': 'Substrate/Print Layer'}
        ]
        filtered = filter_polymers_by_constraints(polymers, light_sensitive=True, layer_type='Substrate/Print Layer')
        assert len(filtered) == 1
        assert filtered[0]['name'] == 'Met-PET'
    
    def test_fssai_filter_for_sealant(self):
        """Sealant layers must be FSSAI certified."""
        polymers = [
            {'name': 'Non-certified', 'fssai_certified': False, 'category_type': 'Heat Sealant Layer', 'optical_haze_pct': 5},
            {'name': 'Certified', 'fssai_certified': True, 'category_type': 'Heat Sealant Layer', 'optical_haze_pct': 5}
        ]
        filtered = filter_polymers_by_constraints(polymers, requires_fssai=True, layer_type='Heat Sealant Layer')
        assert len(filtered) == 1
        assert filtered[0]['name'] == 'Certified'
