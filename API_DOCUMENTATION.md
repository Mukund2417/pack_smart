# PackSmart: API Documentation

Complete reference for all RESTful API endpoints exposed by the PackSmart FastAPI backend.

- **Base URL (Local)**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

---

## 1. System & Health

### `GET /api/health`
Checks API readiness and live database connectivity.
- **Response `200 OK`**:
  ```json
  {
    "status": "healthy",
    "api": "online",
    "database": "healthy",
    "timestamp": "2026-09-20T00:00:00Z"
  }
  ```

### `GET /api/system/status`
Audit endpoint reporting database record counts and honest ML model status.
- **Response `200 OK`**:
  ```json
  {
    "status": "online",
    "database": "connected",
    "ml_model_status": "UNAVAILABLE",
    "dataset_records": {
      "commodities": 22,
      "packaging_materials": 9,
      "recommendations": 14,
      "users": 5
    },
    "timestamp": "2026-09-20T00:00:00Z"
  }
  ```

---

## 2. Authentication

### `POST /api/auth/signup`
Registers a new user account. Passwords hashed using bcrypt.
- **Request Body**:
  ```json
  {
    "name": "Arun Kumar",
    "email": "arun@agrifresh.in",
    "password": "SecurePassword123!",
    "role": "user",
    "organization_name": "AgriFresh Enterprises"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "user_id": "c76f8274-...",
      "name": "Arun Kumar",
      "email": "arun@agrifresh.in",
      "role": "user",
      "organization": "AgriFresh Enterprises"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates existing user with email and password.
- **Request Body**:
  ```json
  {
    "email": "arun@agrifresh.in",
    "password": "SecurePassword123!"
  }
  ```

### `POST /api/auth/google`
Authenticates via Google Identity Services ID token. Verified server-side.
- **Request Body**:
  ```json
  {
    "token": "<google_id_token>"
  }
  ```

### `GET /api/auth/me`
Returns currently authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "user_id": "c76f8274-...",
    "name": "Arun Kumar",
    "email": "arun@agrifresh.in",
    "role": "user",
    "organization_name": "AgriFresh Enterprises",
    "created_at": "2026-09-20T00:00:00Z"
  }
  ```

### `POST /api/auth/logout`
Terminates session on client side and acknowledges token invalidation.

---

## 3. Commodities & Autocomplete

### `GET /api/commodities/search?q={query}`
Case-insensitive prefix, substring, and regional alias search.
- **Query Parameter**: `q` (e.g. `pot`, `hapus`, `tomato`)
- **Response `200 OK`**: List of matching `CommodityResponse` objects.

### `GET /api/commodities`
Lists all commodities in the food knowledge database.

### `GET /api/commodities/{commodity_id}`
Returns details for a single commodity by UUID.

---

## 4. Packaging Materials

### `GET /api/materials`
Lists all packaging materials with barrier metrics and LCA sustainability scores.

### `GET /api/materials/filter?category={category}&map_compatible={bool}&recyclable={bool}`
Filters materials by polymer type, MAP suitability, or circularity.

### `GET /api/materials/{material_id}`
Returns granular physical metrics for a single packaging material.

---

## 5. Recommendation Engine

### `POST /api/recommendation/generate`
Executes data resolution, scientific requirement calculations, and candidate material ranking.
- **Headers**: `Authorization: Bearer <token>` (optional, associates analysis with user account)
- **Request Body**:
  ```json
  {
    "commodity_name": "Alphonso Mango",
    "storage_type": "chilled",
    "storage_temp": 12.0,
    "relative_humidity": 85.0,
    "desired_shelf_life": 14,
    "moisture_content": 83.0,
    "oil_fat_content": 0.4,
    "ph_level": 4.5,
    "respiration_rate": 35.0,
    "transport_conditions": "smooth"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "recommendation_id": "9b1deb4d-...",
    "commodity": "Alphonso Mango",
    "primary_material": "Micro-Perforated BOPP / LDPE",
    "target_otr": "10,000 - 15,000",
    "target_wvtr": "15 - 20",
    "thickness": "20 - 45",
    "sealability": "High (Hermetic Heat Seal)",
    "map_required": "Recommended: 3-5% O₂, 5-8% CO₂, Bal N₂",
    "eco_alternative": "PLA Micro-Perforated Bio-Film",
    "shelf_life_days": 14.0,
    "ranked_materials": [
      {
        "material_id": "m1",
        "name": "Micro-Perforated BOPP Film",
        "rank": 1,
        "confidence_score": 0.95,
        "recommended_thickness": "20 - 45",
        "recommended_otr": "10,000 - 15,000",
        "recommended_wvtr": "15 - 20",
        "sealability": "High (Hermetic Heat Seal)",
        "sustainability_score": 72.0,
        "cost_index": 4.2,
        "explanation": "Evaluated for Alphonso Mango with target OTR barrier..."
      }
    ],
    "map_advisory": {
      "o2_percent": 4.0,
      "co2_percent": 6.0,
      "n2_percent": 90.0,
      "micro_perforations": "85 holes/m²"
    },
    "recommended_format": "Micro-Perforated Produce Bag / Clamshell",
    "format_id": "micro-perf-bag",
    "is_demo": false
  }
  ```

---

## 6. History & Reports

### `GET /api/history`
Returns recommendation history. **Strict user isolation enforced**: authenticated users receive only their own records; unauthenticated sessions do not leak user records.
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameter**: `limit` (default: 20)

### `GET /api/history/{rec_id}`
Returns a single past recommendation. Returns `403 Forbidden` if another user attempts unauthorized access.

### `GET /api/reports/export/{rec_id}`
Generates dossier export metadata in PDF, CSV, and JSON formats.

---

## 7. Shelf-Life, MAP & Sustainability Calculators

### `POST /api/shelf-life/predict`
Executes Arrhenius quality kinetic decay modeling.
- **Request Body**:
  ```json
  {
    "commodity_type": "Fresh Strawberries",
    "material_type": "Micro-Perforated BOPP",
    "storage_temp": 4.0,
    "relative_humidity": 85.0
  }
  ```

### `POST /api/map/advise`
Computes Equilibrium Modified Atmosphere Packaging gas flush volumes and laser pore density.

### `POST /api/sustainability/analyze`
Evaluates cradle-to-gate carbon footprint (kg CO2e) and circularity index.

### `POST /api/qr/generate`
Generates traceable SVG QR codes mapped to batch records.

---

## 8. Admin & Feedback

### `GET /api/admin/analytics`
Returns live metrics calculated directly from database SQL aggregations (`COUNT`, `GROUP BY`).

### `POST /api/feedback`
Records user satisfaction rating (1-5) and technical feedback.
