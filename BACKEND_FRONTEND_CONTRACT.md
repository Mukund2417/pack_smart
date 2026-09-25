# PackSmart Backend-Frontend API Contract Specification

This document details the exact JSON request payloads and response contracts between the PackSmart React frontend client ([`src/api/client.js`](file:///c:/Users/mukun/Downloads/PackSmart-main/frontend/src/api/client.js)) and the FastAPI backend ([`backend/main.py`](file:///c:/Users/mukun/Downloads/PackSmart-main/backend/main.py)).

---

## 1. Authentication Endpoints

### `POST /api/auth/signup`
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@packaging.res",
  "password": "StrongPassword123!",
  "role": "researcher",
  "organization_name": "AgriPack Labs"
}
```
- **Response `200 OK`**:
```json
{
  "access_token": "<jwt_token>",
  "token_type": "bearer",
  "user": {
    "user_id": 1,
    "name": "Jane Doe",
    "email": "jane@packaging.res",
    "role": "researcher",
    "organization_name": "AgriPack Labs"
  }
}
```

### `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "jane@packaging.res",
  "password": "StrongPassword123!"
}
```
- **Response `200 OK`**: (Same schema as signup)

---

## 2. Smart Commodity Autocomplete

### `GET /api/commodities/search?q=pot`
- **Response `200 OK`**:
```json
[
  {
    "commodity_id": 2,
    "name": "Crisp Potato Chips",
    "category": "snacks",
    "default_moisture_content": 2.0,
    "default_oil_fat_content": 35.0,
    "default_ph": 6.2,
    "water_activity_aw": 0.3,
    "is_custom": false
  }
]
```

---

## 3. AI Recommendation Engine

### `POST /api/recommend`
- **Request Body**:
```json
{
  "commodity_name": "Crisp Potato Chips",
  "category": "snacks",
  "target_shelf_life_days": 180,
  "target_temp_c": 25.0,
  "target_rh_pct": 65.0,
  "user_overrides": {
    "moisture_content": 2.0,
    "oil_fat_content": 35.0
  }
}
```
- **Response `200 OK`**:
```json
{
  "recommendation_id": "rec-1a2b3c",
  "commodity_name": "Crisp Potato Chips",
  "requirements": {
    "target_otr": 3.5,
    "target_wvtr": 1.2,
    "required_otr_class": "High Barrier (< 10 cc/m²/day)",
    "required_wvtr_class": "Ultra Barrier (< 2 g/m²/day)",
    "light_barrier_required": true,
    "map_suitable": false
  },
  "primary_recommendation": {
    "material_id": 3,
    "name": "Metallised PET / PE Laminate (MET-PET/LLDPE)",
    "material_type": "laminate",
    "baseline_otr": 3.0,
    "baseline_wvtr": 1.0,
    "overall_score": 94.2,
    "estimated_shelf_life_days": 180,
    "fssai_certified": true,
    "is_recyclable": false,
    "is_biodegradable": false,
    "reasoning": "Strong moisture protection was prioritized because the selected product is sensitive to moisture pickup and has a long target shelf life."
  },
  "alternatives": [
    {
      "material_id": 2,
      "name": "EVOH Multilayer Barrier Laminate (PA/EVOH/PE)",
      "overall_score": 88.5
    }
  ]
}
```

---

## 4. History & Analytics

### `GET /api/history`
- **Response `200 OK`**: Array of user's past packaging recommendations.

### `GET /api/admin/analytics`
- **Response `200 OK`**:
```json
{
  "total_users": 15,
  "total_recommendations": 48,
  "popular_commodities": [
    {"name": "Crisp Potato Chips", "count": 14},
    {"name": "Fresh Mangoes (Alphonso)", "count": 10}
  ],
  "model_status": {
    "status": "active",
    "version": "PackSmart-ML-v2.0",
    "accuracy": "94.8%"
  }
}
```
