import uuid

def test_signup_login_flow(client):
    test_email = f"farmer_{uuid.uuid4().hex[:8]}@test.com"
    # Test Signup
    signup_payload = {
        "name": "Test Farmer",
        "email": test_email,
        "password": "securepassword",
        "role": "user",
        "organization_name": "Test Farm"
    }
    signup_res = client.post("/api/auth/signup", json=signup_payload)
    assert signup_res.status_code == 200
    assert "access_token" in signup_res.json()

    # Test Login
    login_payload = {
        "email": test_email,
        "password": "securepassword"
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

def test_login_invalid_credentials(client):
    login_payload = {
        "email": "wrong@test.com",
        "password": "securepassword"
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 401

def test_signup_existing_email(client):
    # Ensure existing seeded admin fails to signup again
    signup_payload = {
        "name": "Hacker",
        "email": "admin@packsmart.io",
        "password": "securepassword",
    }
    signup_res = client.post("/api/auth/signup", json=signup_payload)
    assert signup_res.status_code == 400

def test_google_auth_invalid_token(client):
    payload = {
        "token": "invalid_fake_token"
    }
    res = client.post("/api/auth/google", json=payload)
    assert res.status_code == 400
