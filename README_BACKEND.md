# PackSmart Backend

Production-ready FastAPI backend for **PackSmart: AI-Based Intelligent Food Packaging Material Recommendation System for Food Commodities**.

---

## Key Features

1. **Integrated with Existing Frontend**:
   - Matches all endpoints and contracts expected by the React frontend (`frontend/src/api/client.js`).
   - Zero-fallback policy in production: no fake demo registries or synthetic accuracies.

2. **Food Knowledge Database & Priority Resolution**:
   - 22+ seeded commodities with moisture, respiration, water activity, and lipid profiles.
   - **Critical Value Priority Rule**: User input always takes precedence over database defaults (`USER_SUPPLIED` > `DATABASE` > `UNKNOWN`).

3. **Scientific Packaging Engines**:
   - **Requirement Engine**: Derives barrier metrics (OTR, WVTR, thickness) from food respiration and shelf life.
   - **TOPSIS Multi-Criteria Decision Making**: Ranks polymer structures based on barrier suitability, sealability, cost, and sustainability.
   - **Arrhenius Shelf-Life Simulation**: Temperature-dependent degradation curves ($Q_{10}$ kinetic decay).
   - **Equilibrium MAP Advisor**: Michaelis-Menten produce respiration equilibrium and laser micro-perforation calculations.
   - **LCA Sustainability Analyzer**: Carbon footprint ($kg\,\text{CO}_2\text{e}$) and circularity evaluation.

4. **Security & User Isolation**:
   - Direct `bcrypt` password hashing.
   - Server-side Google OAuth 2.0 token verification.
   - JWT session management (24-hour expiration).
   - Strict tenant isolation: User A cannot see or query User B's historical analyses.

5. **Live Admin Telemetry**:
   - Real database SQL aggregates (no fake numbers, no fake "96.4%" accuracy).

---

## Setup & Running

### 1. Requirements & Dependencies
Ensure Python 3.10+ is installed.
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp ../.env.example .env
```

Key configuration options:
- `DATABASE_URL`: PostgreSQL connection string (or defaults to `sqlite:///./packsmart.db`).
- `JWT_SECRET_KEY`: Random 256-bit cryptographic key.
- `GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID.
- `CORS_ORIGINS`: Permitted frontend origins.

### 3. Run Database Migrations
```bash
python -m backend.migrate_db
alembic stamp head
```

### 4. Start Backend Server
```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
Interactive API documentation will be accessible at `http://127.0.0.1:8000/docs`.

### 5. Run Automated Tests
```bash
python -m pytest -v
```
All 83 tests should pass.
