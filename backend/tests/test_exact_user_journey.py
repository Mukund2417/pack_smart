import pytest
from fastapi.testclient import TestClient
from backend.main import app

import uuid

client = TestClient(app)

def test_exact_end_to_end_user_journey():
    uid = uuid.uuid4().hex[:8]
    email_a = f"alice_{uid}@packsmart.org"
    email_b = f"bob_{uid}@packsmart.org"

    # 1. Signup User A
    signup_res_a = client.post("/api/auth/signup", json={
        "name": "Alice Packaging Chemist",
        "email": email_a,
        "password": "SecurePassword123!",
        "role": "researcher",
        "organization_name": "AgroTech Labs"
    })
    assert signup_res_a.status_code == 200, signup_res_a.text
    token_a = signup_res_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Search Autocomplete for "pot" -> network request to GET /api/commodities/search?q=pot
    search_res = client.get("/api/commodities/search?q=pot")
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert len(search_data) > 0
    # Must find Potato Chips
    potato_chips = next((item for item in search_data if "potato" in item["name"].lower()), None)
    assert potato_chips is not None
    chips_id = potato_chips["commodity_id"]
    chips_db_oil = potato_chips["default_oil_fat_content"]
    assert chips_db_oil is not None

    # 3. Post Recommendation with Critical Value Priority Rule:
    # User supplies moisture = 3.2 (override)
    # User leaves oil_fat blank (None) -> should fallback to DB
    rec_payload = {
        "commodity_id": chips_id,
        "commodity_name": potato_chips["name"],
        "moisture_content": 3.2,
        "oil_fat_content": None,
        "desired_shelf_life": 180,
        "storage_type": "ambient"
    }
    rec_res = client.post("/api/recommendation/generate", json=rec_payload, headers=headers_a)
    assert rec_res.status_code == 200, rec_res.text
    rec_data = rec_res.json()
    assert "recommendation_id" in rec_data
    assert rec_data["is_demo"] is False
    assert len(rec_data["ranked_materials"]) > 0

    # Verify Critical Value Priority in resolved food profile
    resolved_profile = rec_data.get("resolved_food_profile")
    assert resolved_profile is not None
    assert resolved_profile["moisture_content"]["value"] == 3.2
    assert resolved_profile["moisture_content"]["source"] == "USER_SUPPLIED"
    assert resolved_profile["oil_fat_content"]["value"] == chips_db_oil
    assert resolved_profile["oil_fat_content"]["source"] == "DATABASE"

    # 4. User A fetches History -> record is present
    history_res_a = client.get("/api/history", headers=headers_a)
    assert history_res_a.status_code == 200
    hist_items_a = history_res_a.json()
    assert any(h["recommendation_id"] == rec_data["recommendation_id"] for h in hist_items_a)

    # 5. User Isolation Check: Signup User B and fetch history -> must NOT see User A's recommendation
    signup_res_b = client.post("/api/auth/signup", json={
        "name": "Bob Farmer",
        "email": email_b,
        "password": "SecurePassword456!",
        "role": "user"
    })
    assert signup_res_b.status_code == 200
    token_b = signup_res_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    history_res_b = client.get("/api/history", headers=headers_b)
    assert history_res_b.status_code == 200
    hist_items_b = history_res_b.json()
    assert not any(h["recommendation_id"] == rec_data["recommendation_id"] for h in hist_items_b)

    # 6. Logout and verify
    logout_res = client.post("/api/auth/logout", headers=headers_a)
    assert logout_res.status_code == 200
