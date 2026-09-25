import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_dossier_verify_endpoint():
    # 1. Generate a recommendation to have an actual record
    payload = {
        "commodity_name": "Crisp Potato Chips",
        "desired_shelf_life": 90,
        "storage_type": "ambient"
    }
    rec_res = client.post("/api/recommendation/generate", json=payload)
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    rec_id = rec_data["recommendation_id"]
    dossier_id = rec_data.get("dossier_id") or f"DOS-REC-{rec_id[:8].upper()}"
    
    # Check structure_layers and comparison_candidates exist in recommendation response
    assert "structure_layers" in rec_data
    assert len(rec_data["structure_layers"]) > 0
    assert "comparison_candidates" in rec_data
    assert len(rec_data["comparison_candidates"]) >= 2

    # 2. Verify via full recommendation_id
    verify_res1 = client.get(f"/api/dossier/{rec_id}/verify")
    assert verify_res1.status_code == 200
    vdata1 = verify_res1.json()
    assert vdata1["status"] == "VERIFIED_AUTHENTIC"
    assert vdata1["commodity_name"] == "Crisp Potato Chips"
    assert "cryptographic_hash" in vdata1
    assert "SHA256-" in vdata1["cryptographic_hash"]

    # 3. Verify via DOS-REC prefix
    verify_res2 = client.get(f"/api/dossier/{dossier_id}/verify")
    assert verify_res2.status_code == 200
    vdata2 = verify_res2.json()
    assert vdata2["status"] == "VERIFIED_AUTHENTIC"
    assert vdata2["dossier_id"] == dossier_id

    # 4. Verify nonexistent dossier gives 404
    bad_res = client.get("/api/dossier/DOS-NONEXISTENT/verify")
    assert bad_res.status_code == 404
