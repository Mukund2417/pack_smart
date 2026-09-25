def test_shelflife_prediction(client):
    payload = {
        "commodity_type": "Fresh Produce",
        "material_type": "Micro-Perforated BOPP Film",
        "storage_temp": 4.0,
        "relative_humidity": 85.0,
        "initial_moisture": 85.0,
        "packaging_barrier_grade": "high"
    }
    response = client.post("/api/shelf-life/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_shelf_life_days" in data
    assert data["predicted_shelf_life_days"] > 0
    assert "sensitivity_curve" in data
    assert len(data["sensitivity_curve"]) > 0

def test_shelflife_high_temp_decay(client):
    # Test that higher temperatures result in shorter shelf life
    payload_cold = {
        "commodity_type": "Fresh Produce",
        "material_type": "Micro-Perforated BOPP Film",
        "storage_temp": 4.0,
        "relative_humidity": 85.0
    }
    payload_hot = {
        "commodity_type": "Fresh Produce",
        "material_type": "Micro-Perforated BOPP Film",
        "storage_temp": 30.0,
        "relative_humidity": 85.0
    }
    res_cold = client.post("/api/shelf-life/predict", json=payload_cold)
    res_hot = client.post("/api/shelf-life/predict", json=payload_hot)
    
    days_cold = res_cold.json()["predicted_shelf_life_days"]
    days_hot = res_hot.json()["predicted_shelf_life_days"]
    
    assert days_cold > days_hot # Shelf life must be shorter at higher temperatures
