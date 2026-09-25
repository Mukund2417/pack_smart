import pytest
import numpy as np
from backend.engine.map_engine import (
    michaelis_menten_rate,
    steady_state_o2,
    steady_state_co2,
    required_perforations,
    compute_map_recommendation
)

class TestMichaelisMenten:
    def test_zero_o2(self):
        """At 0% O2, rate should be 0."""
        assert michaelis_menten_rate(10.0, 1.0, 0.0) == 0.0
    
    def test_high_o2_approaches_vm(self):
        """At very high O2 (>>Km), rate approaches Vm."""
        result = michaelis_menten_rate(10.0, 1.0, 100.0)
        assert abs(result - 10.0) < 0.2  # Should be ~9.9
    
    def test_at_km_equals_half_vm(self):
        """At [O2] = Km, rate = Vm/2."""
        vm, km = 20.0, 3.0
        result = michaelis_menten_rate(vm, km, km)
        assert abs(result - vm/2) < 0.001
    
    def test_proportional_to_vm(self):
        """Doubling Vm should double the rate."""
        r1 = michaelis_menten_rate(10.0, 2.0, 5.0)
        r2 = michaelis_menten_rate(20.0, 2.0, 5.0)
        assert abs(r2 - 2*r1) < 0.001

class TestSteadyStateO2:
    def test_equilibrium_within_bounds(self):
        """Steady-state O2 should be between 0 and ambient (20.9%)."""
        eq_o2 = steady_state_o2(
            vm=10.0, km=2.0,
            package_area_m2=0.1,
            film_po2=5000.0,
            mass_kg=1.0
        )
        assert 0 <= eq_o2 <= 20.9
    
    def test_high_respiration_lowers_o2(self):
        """Higher respiration rate → lower equilibrium O2."""
        eq_low = steady_state_o2(vm=5.0, km=2.0, package_area_m2=0.1, film_po2=5000, mass_kg=1.0)
        eq_high = steady_state_o2(vm=30.0, km=2.0, package_area_m2=0.1, film_po2=5000, mass_kg=1.0)
        assert eq_high < eq_low
    
    def test_high_otr_raises_o2(self):
        """Higher film OTR → higher equilibrium O2 (more O2 gets in)."""
        eq_low_otr = steady_state_o2(vm=10.0, km=2.0, package_area_m2=0.1, film_po2=1000, mass_kg=1.0)
        eq_high_otr = steady_state_o2(vm=10.0, km=2.0, package_area_m2=0.1, film_po2=10000, mass_kg=1.0)
        assert eq_high_otr > eq_low_otr

class TestSteadyStateCO2:
    def test_basic_rq_1(self):
        """With RQ=1, CO2 produced equals O2 consumed."""
        eq_o2 = 5.0  # 20.9 - 5 = 15.9% O2 consumed
        co2 = steady_state_co2(eq_o2, rq=1.0)
        expected = 0.04 + 1.0 * (20.9 - 5.0)  # = 15.94
        assert abs(co2 - expected) < 0.01

class TestPerforations:
    def test_no_perforation_needed_for_high_otr(self):
        """Very high OTR film doesn't need perforations."""
        result = required_perforations(
            vm=10.0, km=2.0, mass_kg=1.0,
            target_o2_pct=5.0, film_base_otr=50000,
            package_area_m2=0.1
        )
        assert result['perforations_needed'] == 0
    
    def test_perforation_needed_for_low_otr(self):
        """Very low OTR film needs perforations for fresh produce."""
        result = required_perforations(
            vm=20.0, km=2.0, mass_kg=1.0,
            target_o2_pct=5.0, film_base_otr=50,
            package_area_m2=0.1
        )
        assert result['perforations_needed'] > 0
