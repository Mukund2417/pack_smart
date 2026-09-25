import pytest

def test_get_packaging_formats(client):
    response = client.get("/api/packaging-formats")
    assert response.status_code == 200
    formats = response.json()
    assert len(formats) >= 8
    
    format_ids = [f["format_id"] for f in formats]
    assert "stand-up-pouch" in format_ids
    assert "retort-pouch" in format_ids
    assert "flow-wrap" in format_ids
    assert "tray-lidding" in format_ids
    assert "vacuum-pack" in format_ids
    assert "blister-pack" in format_ids
    assert "sachet-stick" in format_ids
    assert "micro-perf-bag" in format_ids

    # Validate structure and SVG diagram
    doypack = next(f for f in formats if f["format_id"] == "stand-up-pouch")
    assert doypack["name"] == "Stand-up Pouch (Doypack)"
    assert "<svg" in doypack["diagram_svg"]
    assert "HERMETIC HEAT SEAL" in doypack["diagram_svg"]
    assert len(doypack["typical_use_cases"]) > 0
    assert len(doypack["pros"]) > 0
    assert len(doypack["cons"]) > 0

def test_get_packaging_format_single(client):
    response = client.get("/api/packaging-formats/retort-pouch")
    assert response.status_code == 200
    data = response.json()
    assert data["format_id"] == "retort-pouch"
    assert "121°C RETORT" in data["diagram_svg"]

    # Nonexistent format
    bad_resp = client.get("/api/packaging-formats/nonexistent-format-xyz")
    assert bad_resp.status_code == 404

def test_get_preservatives(client):
    response = client.get("/api/preservatives")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 5

    names = [c["category"] for c in categories]
    assert any("Antimicrobial" in n for n in names)
    assert any("Antioxidant" in n for n in names)
    assert any("Acidity" in n for n in names)

    # Validate disclaimer and live authoritative links
    for cat in categories:
        assert len(cat["regulatory_disclaimer"]) > 20
        assert cat["official_source_link"].startswith("http")

def test_compliance_checklist_query(client):
    response = client.get("/api/compliance-checklist?jurisdiction=India")
    assert response.status_code == 200
    checklists = response.json()
    assert len(checklists) >= 1

    general_list = checklists[0]
    assert "India" in general_list["jurisdiction"]
    items = general_list["checklist_items"]
    assert len(items) >= 5

    # Check mandatory vs recommended items
    mandatory_items = [i for i in items if i.get("is_mandatory") is True]
    recommended_items = [i for i in items if i.get("is_mandatory") is False]
    assert len(mandatory_items) > 0
    assert len(recommended_items) > 0

    # Verify official reference links on items
    fssai_logo_item = next((i for i in items if "14-Digit" in i["item_title"] or "Logo" in i["item_title"]), None)
    assert fssai_logo_item is not None
    assert fssai_logo_item["is_mandatory"] is True
    assert "fssai.gov.in" in fssai_logo_item["official_reference_link"]

def test_compliance_checklist_progress_calculation(client):
    # Retrieve checklist items to grab real IDs
    res = client.get("/api/compliance-checklist?jurisdiction=India")
    items = res.json()[0]["checklist_items"]
    mandatory_ids = [i["item_id"] for i in items if i.get("is_mandatory")]
    
    # Check progress with partial completion
    completed_sample = mandatory_ids[:2]
    payload = {
        "jurisdiction": "India — FSSAI",
        "completed_item_ids": completed_sample
    }
    progress_res = client.post("/api/compliance-checklist/progress", json=payload)
    assert progress_res.status_code == 200
    data = progress_res.json()
    
    assert data["total_items"] >= len(items)
    assert data["mandatory_total"] >= len(mandatory_ids)
    assert data["mandatory_completed"] == 2
    assert 0.0 < data["progress_percentage"] <= 100.0
    assert 0.0 < data["mandatory_progress_percentage"] <= 100.0

def test_compliance_checklist_server_side_persistence(client):
    # Test server-side saving for logged-in user
    user_id = "test-user-launch-123"
    payload = {
        "jurisdiction": "India — FSSAI",
        "completed_item_ids": ["fssai-lic-1", "fssai-lbl-1"]
    }
    
    # Save progress with user_id
    save_res = client.post(f"/api/compliance-checklist/progress?user_id={user_id}", json=payload)
    assert save_res.status_code == 200
    assert save_res.json()["completed_item_ids"] == ["fssai-lic-1", "fssai-lbl-1"]

    # Fetch progress back for same user
    fetch_res = client.get(f"/api/compliance-checklist/progress?user_id={user_id}&jurisdiction=India — FSSAI")
    assert fetch_res.status_code == 200
    fetched_data = fetch_res.json()
    assert fetched_data["completed_item_ids"] == ["fssai-lic-1", "fssai-lbl-1"]
    assert fetched_data["mandatory_completed"] >= 2
    assert fetched_data["updated_at"] is not None

def test_materials_dynamic_commonly_used_for(client):
    response = client.get("/api/materials")
    assert response.status_code == 200
    materials = response.json()
    assert len(materials) > 0
    
    for mat in materials:
        assert "commonly_used_for" in mat
        assert isinstance(mat["commonly_used_for"], list)
        assert len(mat["commonly_used_for"]) > 0

    # Single material detail
    mat_id = materials[0]["material_id"]
    detail_res = client.get(f"/api/materials/{mat_id}")
    assert detail_res.status_code == 200
    assert len(detail_res.json()["commonly_used_for"]) > 0

def test_recommendation_bakery_use_case(client):
    # Sourdough bread with 35% moisture in ambient storage
    payload = {
        "commodity_name": "Sourdough Bread",
        "moisture_content": 35.0,
        "oil_fat_content": 3.0,
        "ph_level": 5.4,
        "desired_shelf_life": 5,
        "storage_type": "ambient",
        "storage_temp": 22.0
    }
    response = client.post("/api/recommendation/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Should recommend breathable / micro-perforated format to prevent mold
    assert "recommended_format" in data
    assert data["format_id"] == "micro-perf-bag"
    assert "short_shelf_life_note" in data
    assert data["short_shelf_life_note"] is not None
    assert "Preservatives" in data["short_shelf_life_note"]
