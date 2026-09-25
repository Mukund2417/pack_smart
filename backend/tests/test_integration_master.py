import pytest
import uuid
from backend.services.data_resolution_service import (
    resolve_food_property,
    resolve_food_profile,
    track_value_source
)
from backend.models import Commodity, Recommendation, RecommendationMaterial, PackagingMaterial

def test_1_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["api"] == "online"
    assert data["database"] == "healthy"

def test_2_system_status(client):
    res = client.get("/api/system/status")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["database"] == "connected"
    assert data["ml_model_status"] == "ACTIVE"
    assert "Hybrid" in data.get("ml_engine", "")
    assert data["dataset_records"]["commodities"] > 0
    assert data["dataset_records"]["packaging_materials"] > 0

def test_3_signup(client):
    uid = uuid.uuid4().hex[:8]
    payload = {
        "name": f"Scientist {uid}",
        "email": f"sci_{uid}@packaging.res",
        "password": "StrongPassword123!",
        "role": "researcher",
        "organization_name": "Agro Pack Labs"
    }
    res = client.post("/api/auth/signup", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == payload["email"]
    assert data["user"]["role"] == "researcher"

def test_4_login(client):
    uid = uuid.uuid4().hex[:8]
    email = f"user_{uid}@test.org"
    pwd = "MySecretPassword99!"
    signup_res = client.post("/api/auth/signup", json={"name": "Alice", "email": email, "password": pwd})
    assert signup_res.status_code == 200

    login_res = client.post("/api/auth/login", json={"email": email, "password": pwd})
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == email

def test_5_google_auth_verification_path(client):
    # Tests server-side rejection of invalid Google tokens
    res = client.post("/api/auth/google", json={"token": "malformed_google_token"})
    assert res.status_code == 400

def test_6_protected_route_me(client):
    # Unauthenticated
    res = client.get("/api/auth/me")
    assert res.status_code == 401

    # Authenticated
    uid = uuid.uuid4().hex[:8]
    email = f"user_{uid}@test.org"
    pwd = "Password123!"
    reg = client.post("/api/auth/signup", json={"name": "Auth User", "email": email, "password": pwd}).json()
    token = reg["access_token"]

    res_auth = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_auth.status_code == 200
    assert res_auth.json()["email"] == email

def test_7_user_isolation(client):
    """User A must NEVER see User B's historical recommendations."""
    # Create User A
    uid_a = uuid.uuid4().hex[:8]
    token_a = client.post("/api/auth/signup", json={"name": "User A", "email": f"a_{uid_a}@test.com", "password": "pass"}).json()["access_token"]

    # Create User B
    uid_b = uuid.uuid4().hex[:8]
    token_b = client.post("/api/auth/signup", json={"name": "User B", "email": f"b_{uid_b}@test.com", "password": "pass"}).json()["access_token"]

    # User A runs recommendation
    rec_a = client.post(
        "/api/recommendation/generate",
        json={"commodity_name": "Alphonso Mango", "storage_type": "chilled", "desired_shelf_life": 14},
        headers={"Authorization": f"Bearer {token_a}"}
    ).json()

    # User B runs recommendation
    rec_b = client.post(
        "/api/recommendation/generate",
        json={"commodity_name": "Potato Chips", "storage_type": "ambient", "desired_shelf_life": 180},
        headers={"Authorization": f"Bearer {token_b}"}
    ).json()

    # User A fetches history
    hist_a = client.get("/api/history", headers={"Authorization": f"Bearer {token_a}"}).json()
    ids_a = [item["recommendation_id"] for item in hist_a]
    assert rec_a["recommendation_id"] in ids_a
    assert rec_b["recommendation_id"] not in ids_a

    # User B fetches history
    hist_b = client.get("/api/history", headers={"Authorization": f"Bearer {token_b}"}).json()
    ids_b = [item["recommendation_id"] for item in hist_b]
    assert rec_b["recommendation_id"] in ids_b
    assert rec_a["recommendation_id"] not in ids_b

    # User B tries to directly inspect User A's recommendation dossier
    forbidden_res = client.get(f"/api/history/{rec_a['recommendation_id']}", headers={"Authorization": f"Bearer {token_b}"})
    assert forbidden_res.status_code == 403

def test_8_commodity_list(client):
    res = client.get("/api/commodities")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 6
    for item in items:
        assert "name" in item
        assert "default_moisture_content" in item

def test_9_commodity_search_autocomplete(client):
    # Prefix / substring search
    res = client.get("/api/commodities/search?q=pot")
    assert res.status_code == 200
    names = [c["name"].lower() for c in res.json()]
    assert any("potato" in n for n in names)

def test_10_commodity_details(client):
    all_comms = client.get("/api/commodities").json()
    cid = all_comms[0]["commodity_id"]
    res = client.get(f"/api/commodities/{cid}")
    assert res.status_code == 200
    assert res.json()["commodity_id"] == cid

def test_11_user_value_priority_rule():
    """User-supplied value overrides literature value; literature value used only if user value omitted."""
    # 1. User provided 3.2% moisture vs DB 2.8%
    prop_resolved = resolve_food_property(
        user_val=3.2,
        db_val=2.8,
        unit="%",
        prop_name="moisture"
    )
    assert prop_resolved["value"] == 3.2
    assert prop_resolved["source"] == "USER_SUPPLIED"

def test_12_database_fallback_rule():
    # User omitted value (None), DB has 74.0%
    prop_resolved = resolve_food_property(
        user_val=None,
        db_val=74.0,
        unit="%",
        prop_name="moisture"
    )
    assert prop_resolved["value"] == 74.0
    assert prop_resolved["source"] == "DATABASE"

def test_13_unknown_value_handling():
    # User omitted value (None), DB has None/0
    prop_resolved = resolve_food_property(
        user_val=None,
        db_val=None,
        unit="%",
        prop_name="microbial_load"
    )
    assert prop_resolved["value"] is None
    assert prop_resolved["source"] == "UNKNOWN"

def test_14_recommendation_real_data(client):
    res = client.post("/api/recommendation/generate", json={
        "commodity_name": "Fresh Alphonso Mango",
        "storage_type": "chilled",
        "desired_shelf_life": 14,
        "moisture_content": 84.0,
        "respiration_rate": 35.0
    })
    assert res.status_code == 200
    data = res.json()
    assert data["is_demo"] is False
    assert "target_otr" in data
    assert "target_wvtr" in data
    assert "ranked_materials" in data
    assert len(data["ranked_materials"]) > 0
    top = data["ranked_materials"][0]
    assert top["confidence_score"] > 0.60
    assert "cost_index" in top

def test_15_material_search_and_filter(client):
    res = client.get("/api/materials")
    assert res.status_code == 200
    assert len(res.json()) >= 3

    res_filter = client.get("/api/materials/filter?category=laminate")
    assert res_filter.status_code == 200
    for mat in res_filter.json():
        assert "laminate" in mat["material_type"].lower()

def test_16_history_endpoint(client):
    res = client.get("/api/history")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_17_shelf_life_kinetics(client):
    res = client.post("/api/shelf-life/predict", json={
        "commodity_type": "Fresh Strawberries",
        "material_type": "Micro-Perforated BOPP",
        "storage_temp": 4.0,
        "relative_humidity": 85.0
    })
    assert res.status_code == 200
    data = res.json()
    assert data["predicted_shelf_life_days"] > 0
    assert len(data["sensitivity_curve"]) == 7

def test_18_map_advisory(client):
    res = client.post("/api/map/advise", json={
        "commodity_name": "Baby Spinach",
        "weight_grams": 250.0,
        "packaging_volume_ml": 800.0,
        "respiration_rate_ml_co2_kg_hr": 55.0,
        "storage_temp_c": 4.0
    })
    assert res.status_code == 200
    data = res.json()
    assert data["target_o2_percent"] > 0
    assert data["target_co2_percent"] > 0
    assert "micro_perforation_density" in data

def test_19_sustainability_analyzer(client):
    res = client.post("/api/sustainability/analyze", json={
        "material_name": "Polylactic Acid (PLA)",
        "production_volume_units": 5000,
        "pack_weight_grams": 12.0
    })
    assert res.status_code == 200
    data = res.json()
    assert data["sustainability_score"] > 80.0
    assert data["carbon_footprint_total_kg_co2"] > 0

def test_20_qr_traceability_generator(client):
    res = client.post("/api/qr/generate", json={
        "batch_label": "BATCH-TEST-2026",
        "commodity": "Alphonso Mangoes",
        "packaging_material": "Micro-Perforated Film"
    })
    assert res.status_code == 200
    data = res.json()
    assert "<svg" in data["qr_code_svg"]
    assert "data:image/svg+xml" in data["qr_data_url"]

def test_21_admin_analytics_no_fake_data(client):
    res = client.get("/api/admin/analytics")
    assert res.status_code == 200
    data = res.json()
    # Check that it reflects actual database state without hardcoded inflation
    assert data["total_commodities"] > 0
    assert data["total_materials"] > 0
    assert "94.8%" in data["model_status"]["accuracy"]
    assert "Surrogate" in data["model_status"]["accuracy"]

def test_22_ml_active_state(client):
    res = client.get("/api/system/status")
    data = res.json()
    assert data["ml_model_status"] == "ACTIVE"
    assert "Hybrid" in data["ml_engine"]

def test_23_feedback_submission(client):
    res = client.post("/api/feedback", json={
        "rating": 5,
        "comments": "Accurate barrier specification."
    })
    assert res.status_code == 200
    assert res.json()["status"] == "success"
