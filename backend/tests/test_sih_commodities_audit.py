import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_sih_commodities_and_properties():
    # 1. Test Autocomplete for "tom", "rice", "pot"
    res_tom = client.get("/api/commodities/search?q=tom")
    assert res_tom.status_code == 200
    assert any("tomato" in c["name"].lower() for c in res_tom.json())

    res_rice = client.get("/api/commodities/search?q=rice")
    assert res_rice.status_code == 200
    assert any("rice" in c["name"].lower() for c in res_rice.json())

    res_pot = client.get("/api/commodities/search?q=pot")
    assert res_pot.status_code == 200
    assert any("potato" in c["name"].lower() for c in res_pot.json())

    # 2. Test Recommendation for Crisp Potato Chips (High lipid snack -> High barrier + N2 MAP)
    res_chips = client.post("/api/recommendation/generate", json={
        "commodity_name": "Crisp Potato Chips",
        "moisture_content": 2.0,
        "oil_fat_content": 35.0,
        "desired_shelf_life": 180,
        "storage_type": "ambient"
    })
    assert res_chips.status_code == 200
    data_chips = res_chips.json()
    assert "laminate" in data_chips["primary_material"].lower() or "bopp" in data_chips["primary_material"].lower() or "metallized" in data_chips["primary_material"].lower()
    assert "<" in data_chips["target_otr"] # Strict oxygen barrier required for lipid oxidation
    assert "<" in data_chips["target_wvtr"] # Strict moisture barrier
    assert "99.5% N" in data_chips["map_required"] or "nitrogen" in data_chips["map_required"].lower()

    # 3. Test Recommendation for Vine Tomatoes (Respiring fresh produce -> Breathable/MAP)
    res_tomato = client.post("/api/recommendation/generate", json={
        "commodity_name": "Vine Tomatoes",
        "respiration_rate": 18.0,
        "desired_shelf_life": 14,
        "storage_type": "chilled",
        "storage_temp": 12.0
    })
    assert res_tomato.status_code == 200
    data_tomato = res_tomato.json()
    assert data_tomato["map_advisory"] is not None
    assert data_tomato["map_advisory"]["target_o2_percent"] > 0
    assert "breathable" in data_tomato["primary_material"].lower() or "micro-perforated" in data_tomato["primary_material"].lower() or "bopp" in data_tomato["primary_material"].lower()
    assert float(data_tomato["target_otr"].split("-")[0].replace(",", "").strip()) >= 5000 # High OTR required for fresh respiration

    # 4. Test Recommendation for Basmati Rice (Raw dry good -> Moisture barrier + Insect/puncturing strength)
    res_rice_rec = client.post("/api/recommendation/generate", json={
        "commodity_name": "Basmati Rice (Raw)",
        "moisture_content": 12.0,
        "desired_shelf_life": 365,
        "storage_type": "ambient",
        "transport_conditions": "rough"
    })
    assert res_rice_rec.status_code == 200
    data_rice = res_rice_rec.json()
    # Rough transport must add thickness / reinforcement
    assert int(data_rice["thickness"].split("-")[1].strip()) >= 70
    assert len(data_rice["ranked_materials"]) > 0

    # 5. Verify that Potato Chips, Tomatoes, and Rice get COMPLETELY DIFFERENT material recommendations and barrier specs
    assert data_chips["primary_material"] != data_tomato["primary_material"]
    assert data_chips["target_otr"] != data_tomato["target_otr"]
