import pytest
import numpy as np
from backend.engine.permeation import (
    calculate_target_wvtr,
    calculate_target_otr,
    arrhenius_shift,
    laminate_series_resistance,
    package_surface_area,
    estimate_shelf_life_days
)

class TestTargetWVTR:
    def test_basic_calculation(self):
        """1 kg food, 2% moisture allowance, 0.1 m² area, 30 day shelf life.
        WVTR = (1000 * 0.02) / (0.1 * 30) = 6.667 g/m²/day"""
        result = calculate_target_wvtr(1.0, 2.0, 0.1, 30)
        assert abs(result - 6.667) < 0.01
    
    def test_larger_mass(self):
        """5 kg, 3% delta, 0.2 m², 60 days → (5000*0.03)/(0.2*60) = 12.5"""
        result = calculate_target_wvtr(5.0, 3.0, 0.2, 60)
        assert abs(result - 12.5) < 0.01
    
    def test_zero_area_raises(self):
        with pytest.raises(ValueError):
            calculate_target_wvtr(1.0, 2.0, 0.0, 30)
    
    def test_zero_shelf_life_raises(self):
        with pytest.raises(ValueError):
            calculate_target_wvtr(1.0, 2.0, 0.1, 0)

class TestTargetOTR:
    def test_basic_calculation(self):
        """2 kg, 100 cc/kg allowance, 0.15 m², 45 days → (2*100)/(0.15*45) = 29.63"""
        result = calculate_target_otr(2.0, 100, 0.15, 45)
        assert abs(result - 29.63) < 0.01
    
    def test_small_area(self):
        result = calculate_target_otr(0.5, 50, 0.05, 30)
        expected = (0.5 * 50) / (0.05 * 30)  # = 16.667
        assert abs(result - expected) < 0.01

class TestArrheniusShift:
    def test_higher_temp_increases_wvtr(self):
        """WVTR increases at higher temperature."""
        baseline = 10.0  # g/m²/day at 38°C
        Ep = 40.0  # kJ/mol typical for moisture
        T_ref = 311.15  # 38°C
        T_high = 323.15  # 50°C
        result = arrhenius_shift(baseline, Ep, T_ref, T_high)
        assert result > baseline  # Higher temp → higher permeability
    
    def test_lower_temp_decreases_wvtr(self):
        baseline = 10.0
        Ep = 40.0
        T_ref = 311.15  # 38°C
        T_low = 278.15  # 5°C
        result = arrhenius_shift(baseline, Ep, T_ref, T_low)
        assert result < baseline  # Lower temp → lower permeability
    
    def test_same_temp_returns_baseline(self):
        baseline = 10.0
        result = arrhenius_shift(baseline, 40.0, 311.15, 311.15)
        assert abs(result - baseline) < 0.001
    
    def test_known_shift_value(self):
        """Verify Arrhenius shift with hand-calculated value.
        P(T) = P0 * exp(-Ep/R * (1/T - 1/T0))
        P0 = 10, Ep = 40000 J/mol, R = 8.314
        T0 = 311.15 K, T = 298.15 K (25°C)
        exponent = -(40000/8.314) * (1/298.15 - 1/311.15)
        = -4812.8 * (0.003354 - 0.003214)
        = -4812.8 * 0.000140 = -0.6738
        P = 10 * exp(-0.6738) = 10 * 0.5099 = 5.099
        """
        result = arrhenius_shift(10.0, 40.0, 311.15, 298.15)
        assert abs(result - 5.099) < 0.1

class TestLaminateSeriesResistance:
    def test_single_layer(self):
        """Single 25um layer should return its own permeability."""
        layers = [{'wvtr': 10.0, 'otr': 100.0, 'thickness_um': 25.0}]
        wvtr, otr = laminate_series_resistance(layers)
        assert abs(wvtr - 10.0) < 0.01
        assert abs(otr - 100.0) < 0.01
    
    def test_two_equal_layers(self):
        """Two identical 25um layers → half the permeability."""
        layers = [
            {'wvtr': 10.0, 'otr': 100.0, 'thickness_um': 25.0},
            {'wvtr': 10.0, 'otr': 100.0, 'thickness_um': 25.0}
        ]
        wvtr, otr = laminate_series_resistance(layers)
        assert abs(wvtr - 5.0) < 0.01
        assert abs(otr - 50.0) < 0.01
    
    def test_barrier_dominates(self):
        """High barrier layer should dominate the laminate."""
        layers = [
            {'wvtr': 100.0, 'otr': 5000.0, 'thickness_um': 12.0},  # PET
            {'wvtr': 0.1, 'otr': 0.05, 'thickness_um': 15.0},  # EVOH
            {'wvtr': 15.0, 'otr': 7000.0, 'thickness_um': 40.0}  # LLDPE
        ]
        wvtr, otr = laminate_series_resistance(layers)
        # Laminate should be close to the EVOH barrier value (adjusted for thickness)
        assert wvtr < 1.0  # Much lower than any single permeable layer
        assert otr < 1.0
    
    def test_aluminum_foil_perfect_barrier(self):
        """Al foil (0 permeability) should make laminate near-zero."""
        layers = [
            {'wvtr': 100.0, 'otr': 5000.0, 'thickness_um': 12.0},
            {'wvtr': 0.0, 'otr': 0.0, 'thickness_um': 7.0},  # Al foil
            {'wvtr': 15.0, 'otr': 7000.0, 'thickness_um': 40.0}
        ]
        wvtr, otr = laminate_series_resistance(layers)
        assert wvtr < 0.001
        assert otr < 0.001

class TestPackageSurfaceArea:
    def test_cube(self):
        """10x10x10 cm cube → 6*100 cm² = 600 cm² = 0.06 m²"""
        result = package_surface_area(10, 10, 10)
        assert abs(result - 0.06) < 0.001
    
    def test_flat_pouch(self):
        """30x20x2 cm → 2*(600+60+40) = 1400 cm² = 0.14 m²"""
        result = package_surface_area(30, 20, 2)
        assert abs(result - 0.14) < 0.001

class TestEstimateShelfLife:
    def test_moisture_limited(self):
        """Should calculate shelf life based on moisture absorption."""
        result = estimate_shelf_life_days(
            laminate_wvtr=5.0,
            laminate_otr=50.0,
            area_m2=0.1,
            mass_kg=1.0,
            delta_moisture_pct=3.0,
            delta_o2_cc_per_kg=500
        )
        # Moisture SL = (1000*0.03)/(5*0.1) = 60 days
        # O2 SL = (1*500)/(50*0.1) = 100 days
        # Min = 60
        assert abs(result - 60.0) < 0.1
