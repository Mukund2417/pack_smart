def test_recommendation_happy_path(client):
    payload = {
        "commodity_name": "Fresh Apples",
        "moisture_content": 85.0,
        "oil_fat_content": 0.5,
        "ph_level": 3.8,
        "respiration_rate": 8.5,
        "desired_shelf_life": 14,
        "storage_type": "chilled",
        "storage_temp": 4.0,
        "relative_humidity": 85.0,
        "transport_conditions": "smooth"
    }
    response = client.post("/api/recommendation/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "primary_material" in data
    assert "recommendation_id" in data
    assert len(data["ranked_materials"]) > 0
    assert "confidence_score" in data["ranked_materials"][0]

def test_recommendation_missing_optional_params(client):
    # Test graceful fallback
    payload = {
        "commodity_name": "Fresh Apples"
    }
    response = client.post("/api/recommendation/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "primary_material" in data

def test_recommendation_out_of_range_inputs(client):
    payload = {
        "commodity_name": "Fresh Apples",
        "ph_level": 15.0 # Invalid pH (>14)
    }
    response = client.post("/api/recommendation/generate", json=payload)
    assert response.status_code == 422 # Unprocessable Entity
    
    payload = {
        "commodity_name": "Fresh Apples",
        "moisture_content": -5.0 # Invalid (<0)
    }
    response = client.post("/api/recommendation/generate", json=payload)
    assert response.status_code == 422
    
def test_recommendation_boundary_values(client):
    payload = {
        "commodity_name": "Tomato",
        "ph_level": 14.0,
        "moisture_content": 0.0,
        "respiration_rate": 0.0
    }
    response = client.post("/api/recommendation/generate", json=payload)
    assert response.status_code == 200
