# PackSmart: Testing & Verification Guide

This document details the test suites, verification procedures, and commands used to validate the integrated PackSmart application.

---

## 1. Automated Test Suites

The backend includes 83 automated unit and integration tests executed using `pytest`.

### Running All Backend Tests
```bash
cd backend
python -m pytest -v
```

### Running the 23-Point Master Acceptance Suite
```bash
cd backend
python -m pytest tests/test_integration_master.py -v
```

### Test Suite Directory Structure
- `tests/test_integration_master.py` (23 tests): Complete end-to-end acceptance test covering health, auth, user isolation, autocomplete, user value priority, database fallback, unknown handling, recommendation generation, materials database, shelf-life kinetics, MAP advisory, sustainability, QR traceability, live admin analytics, and ML unavailable state.
- `tests/test_auth.py` (4 tests): Signup, login, invalid credentials rejection, Google OAuth token verification path.
- `tests/test_recommendation.py` (4 tests): Boundary conditions, missing parameter fallbacks, input validation ranges.
- `tests/test_map_engine.py` (10 tests): Michaelis-Menten respiration kinetics, steady-state oxygen solver, micro-perforation calculations.
- `tests/test_new_modules.py` (8 tests): Packaging formats, preservatives guide, compliance checklist persistence, dynamic material associations.
- `tests/test_permeation.py` (17 tests): Target WVTR/OTR calculations, Arrhenius temperature shifts, laminate series resistance.
- `tests/test_shelf_life.py` & `test_shelflife.py` (10 tests): Day-by-day moisture and oxidation accumulation curves, cold-chain failure temperature spikes.
- `tests/test_topsis.py` (7 tests): Matrix normalization, cost criterion inversion, constraint filtering.

---

## 2. Frontend Build Verification

To verify that the existing React frontend compiles without errors:

```bash
cd frontend
npm install
npm run build
```

Expected output:
```
vite v5.4.21 building for production...
✓ 1855 modules transformed.
rendering chunks...
computing gzip size...
✓ built in ~5s
```

---

## 3. End-to-End User Verification Flow

1. **Commodity Autocomplete**:
   - Navigate to `/recommendation`.
   - Querying `"pot"` calls `GET /api/commodities/search?q=pot`.
   - Matching database items (`Crisp Potato Chips`, etc.) are returned with biological properties.

2. **Critical Value Priority**:
   - User inputs custom moisture content (`3.2%`).
   - Leave pH field blank.
   - Recommendation engine records moisture as `USER_SUPPLIED` (`3.2%`), while pH defaults to `DATABASE` value (`6.2`). Unknown parameters remain `UNKNOWN`.

3. **Recommendation & User Isolation**:
   - Log in with Account A (`user_a@test.com`).
   - Run recommendation.
   - Navigate to `/history`: analysis record is displayed.
   - Log in with Account B (`user_b@test.com`).
   - Navigate to `/history`: Account A's analyses are **not visible**. Direct API access to Account A's record ID returns `403 Forbidden`.

4. **Live Admin Analytics**:
   - Navigate to `/admin`.
   - Metrics display real database counts (no inflated or synthetic numbers).
