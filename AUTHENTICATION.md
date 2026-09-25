# PackSmart: Authentication & Security Guide

This document details the authentication architecture, token lifecycle, password hashing, and user isolation guarantees.

---

## 1. Authentication Mechanisms

### A. Email & Password Authentication
- **Hashing**: Direct `bcrypt` algorithm (`bcrypt.hashpw` with unique random salt via `bcrypt.gensalt()`).
- **Input Truncation**: Passwords are automatically sliced to the standard 72-byte limit to prevent DoS attacks.
- **Salt & Key Stretching**: Utilizes 12 logarithmic rounds by default.
- **Legacy Migration Support**: Existing historical SHA-256 hashed accounts seamlessly authenticate and are ready for in-place re-hashing on password changes.

### B. Google OAuth 2.0 Identity Services
- **Client Protocol**: Standard Google Identity Services client-side credential flow.
- **Server Verification**:
  - Validates token signature with Google's public keys via `google.oauth2.id_token.verify_oauth2_token`.
  - Verifies token issuer (`accounts.google.com` or `https://accounts.google.com`).
  - Verifies audience matches `GOOGLE_CLIENT_ID` environment variable.
  - Automatically provisions user account if first-time sign-in.

---

## 2. JWT (JSON Web Token) Specification

- **Algorithm**: `HS256`
- **Secret Key**: Configurable via `JWT_SECRET_KEY` environment variable.
- **Token Expiry**: Configured to 24 hours (`ACCESS_TOKEN_EXPIRE_MINUTES = 1440`).
- **Token Payload**:
  ```json
  {
    "sub": "user_id_uuid",
    "email": "user@example.com",
    "role": "user | researcher | admin",
    "exp": 1774051200
  }
  ```

---

## 3. Strict User Isolation Protocol

User isolation is enforced at the database query layer across all analysis and history endpoints:

1. **Session Injection**:
   - `get_current_user(credentials, db)`: Mandatory dependency for protected routes (e.g. `/api/auth/me`). Rejects invalid, expired, or missing tokens with `401 Unauthorized`.
   - `get_current_user_optional(credentials, db)`: Optional dependency for public-facing generators (e.g. `/api/recommendation/generate`). Automatically extracts the authenticated user ID if logged in, but allows guests to run guest simulations without failure.

2. **Cross-Tenant Access Prevention**:
   - `GET /api/history`: When user is authenticated, the SQL query explicitly filters `Recommendation.user_id == current_user.user_id`. User A cannot view User B's historical records.
   - `GET /api/history/{rec_id}`: If the recommendation is assigned to a user and `rec.user_id != current_user.user_id`, the endpoint immediately terminates with `403 Forbidden`.
   - Unauthenticated sessions querying `/api/history` only see unassigned guest records, protecting all private accounts.

---

## 4. Role-Based Access Control (RBAC)

Supported roles:
- `user`: Standard agro-enterprise and food manufacturer.
- `researcher`: Food science research fellow.
- `admin`: System administrator with access to analytics and platform calibration.

Role enforcement helper:
```python
from backend.auth.rbac import require_role

@app.post("/api/admin/model/update")
def update_model(user = Depends(require_role("admin"))):
    ...
```
