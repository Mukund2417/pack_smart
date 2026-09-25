# PackSmart Frontend-Backend Integration Map

This document details the exact end-to-end integration map connecting each frontend user interface action to its corresponding API client method, backend route, service module, database entity, and returning response.

---

## 🗺 End-to-End Integration Flow

| Frontend UI Page / Component | API Client Method (`src/api/client.js`) | HTTP Method & Route | FastAPI Endpoint / Controller | Service Module / Engine | Database / Model | Response Entity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `UserAccount.jsx` | `login()`, `signup()`, `googleLogin()` | `POST /api/auth/login`<br>`POST /api/auth/signup`<br>`POST /api/auth/google` | `backend/main.py:login()` | `backend/services/auth.py` | `models.User` | JWT Bearer Token + User Profile |
| `UserAccount.jsx` / Header | `getMe()` | `GET /api/auth/me` | `backend/main.py:get_me()` | `backend/services/auth.py` | `models.User` | Current User Profile Details |
| `GetRecommendation.jsx` (Search) | `searchCommodities(query)` | `GET /api/commodities/search?q=` | `backend/main.py:search_commodities()` | Case-insensitive & Alias search | `models.Commodity`, `models.CommodityAlias` | Matched Commodity Profiles |
| `GetRecommendation.jsx` (Details) | `getCommodity(id)` | `GET /api/commodities/{id}` | `backend/main.py:get_commodity()` | Data Resolution Service | `models.Commodity` | Complete Food Biochemical Properties |
| `GetRecommendation.jsx` | `generateRecommendation(payload)` | `POST /api/recommendation/generate` | `backend/main.py:generate_recommendation()` | `backend/services/recommendation.py` | `models.PackagingMaterial`, `models.Recommendation` | Ranked Packaging Candidates + Specifications |
| `ReportsHistory.jsx` | `getHistory(limit)` | `GET /api/history` | `backend/main.py:get_recommendation_history()` | History Service (User-Isolated) | `models.Recommendation`, `models.User` | User Analysis History List |
| `ShelfLifePredictor.jsx` | `predictShelfLife(payload)` | `POST /api/shelf-life/predict` | `backend/main.py:predict_shelf_life()` | `backend/services/shelflife.py` | Kinetic Arrhenius Model | Estimated Days + Decay Breakdown |
| `MapAdvisor.jsx` | `adviseMap(payload)` | `POST /api/map/advise` | `backend/main.py:get_map_advisory()` | `backend/services/map.py` | Michaelis-Menten Kinetics | Target Gas % + Laser Microperforations |
| `SustainabilityAnalyzer.jsx` | `analyzeSustainability(payload)` | `POST /api/sustainability/analyze` | `backend/main.py:analyze_sustainability()` | `backend/services/sustainability.py` | `models.MaterialSustainabilityData` | CO₂ Footprint & Recyclability Rating |
| `QrTraceability.jsx` | `generateQr(payload)`<br>`recordQrScan()`, `getQrScanLogs()` | `POST /api/qr/generate`<br>`GET /api/qr/{id}/scan-log` | `backend/main.py:generate_qr()` | `backend/services/qr.py` | `models.QrCode`, `models.TraceabilityLog` | Real SVG QR Code + Verification Audit Trail |
| `AdminPanel.jsx` | `getAnalytics()`, `updateModel()` | `GET /api/admin/analytics`<br>`POST /api/admin/model/update` | `backend/main.py:get_analytics()` | Live Database Aggregator | SQL COUNT / GROUP BY Aggregates | System Live Analytics & Status |
| `LaunchChecklist.jsx` | `getComplianceChecklist()` | `GET /api/compliance-checklist` | `backend/main.py:get_compliance_checklist()` | Compliance Engine | `models.ComplianceChecklist` | FSSAI Regulatory Checklist Items |
| `KnowledgeBase.jsx` | `getPreservatives()` | `GET /api/preservatives` | `backend/main.py:get_preservatives()` | Knowledge Service | `models.PreservativeCategory` | Preservatives & Additives Guide |
| `MaterialDatabase.jsx` | `getMaterials(filters)` | `GET /api/materials` | `backend/main.py:get_materials()` | Materials Service | `models.PackagingMaterial` | Full Polymer & Laminate Catalog |
