import pytest
import numpy as np
from backend.engine.shelf_life import simulate_shelf_life

class TestShelfLifeSimulation:
    def test_moisture_increases_monotonically(self):
        """Moisture should only increase over time (no drying)."""
        result = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=20.0, simulation_days=60,
            storage_temp_c=25.0, storage_rh_pct=65.0
        )
        moisture = result['moisture_curve_pct']
        for i in range(1, len(moisture)):
            assert moisture[i] >= moisture[i-1]
    
    def test_oxidation_increases_monotonically(self):
        """Peroxide value should only increase."""
        result = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=20.0, simulation_days=60
        )
        pv = result['oxidation_curve_pv']
        for i in range(1, len(pv)):
            assert pv[i] >= pv[i-1]
    
    def test_initial_values(self):
        """Day 0 should match initial conditions."""
        result = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=20.0, simulation_days=30
        )
        assert result['moisture_curve_pct'][0] == 5.0
        assert result['oxidation_curve_pv'][0] == 0.0
    
    def test_cold_chain_failure_causes_spike(self):
        """Cold chain failure should cause higher degradation."""
        normal = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=20.0, simulation_days=30,
            storage_temp_c=5.0, storage_rh_pct=65.0,
            cold_chain_failure=False
        )
        failure = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=20.0, simulation_days=30,
            storage_temp_c=5.0, storage_rh_pct=65.0,
            cold_chain_failure=True,
            failure_temp_c=40.0,
            failure_duration_hours=8.0,
            failure_day=15
        )
        # After the failure day, moisture and PV should be higher
        assert failure['moisture_curve_pct'][20] > normal['moisture_curve_pct'][20]
    
    def test_higher_temp_faster_degradation(self):
        """Storage at 35°C should degrade faster than 5°C."""
        cold = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=20.0, simulation_days=60,
            storage_temp_c=5.0
        )
        hot = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=20.0, simulation_days=60,
            storage_temp_c=35.0
        )
        # Hot storage should have higher moisture at day 60
        assert hot['moisture_curve_pct'][-1] > cold['moisture_curve_pct'][-1]
    
    def test_zero_lipid_no_oxidation(self):
        """With 0% lipid, PV should remain 0."""
        result = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=0.0, simulation_days=30
        )
        assert all(pv == 0.0 for pv in result['oxidation_curve_pv'])
    
    def test_shelf_life_limit_detected(self):
        """Should detect when moisture exceeds critical level."""
        result = simulate_shelf_life(
            laminate_wvtr=50.0,  # Very permeable
            laminate_otr=500.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=0.1,  # Small mass
            initial_moisture_pct=5.0, critical_moisture_pct=8.0,  # Small margin
            lipid_pct=10.0, simulation_days=90,
            storage_temp_c=35.0, storage_rh_pct=85.0
        )
        assert result['shelf_life_limit_day'] is not None
        assert result['shelf_life_limit_day'] < 90
    
    def test_output_arrays_length(self):
        """Output arrays should have simulation_days + 1 entries."""
        days = 45
        result = simulate_shelf_life(
            laminate_wvtr=5.0, laminate_otr=50.0,
            activation_energy_wvtr_kj=40.0, activation_energy_otr_kj=35.0,
            package_area_m2=0.1, mass_kg=1.0,
            initial_moisture_pct=5.0, critical_moisture_pct=12.0,
            lipid_pct=20.0, simulation_days=days
        )
        assert len(result['days']) == days + 1
        assert len(result['moisture_curve_pct']) == days + 1
        assert len(result['oxidation_curve_pv']) == days + 1
