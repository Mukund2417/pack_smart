"""
Test configuration and fixtures for PackSmart backend tests.
Uses an in-memory SQLite database to fully isolate tests from production data.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch
from sqlalchemy.pool import StaticPool

from backend.database import Base, get_db

TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_test_db():
    """Seed in-memory test database using canonical seed_database logic."""
    from backend.seed import seed_database
    with patch("backend.seed.SessionLocal", TestSessionLocal), \
         patch("backend.seed.engine", test_engine), \
         patch("backend.migrate_db.engine", test_engine):
        seed_database()

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Create ALL tables in the in-memory test engine and seed them."""
    import backend.models  # noqa: F401
    Base.metadata.create_all(bind=test_engine)
    seed_test_db()
    yield
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="function")
def client(setup_test_database):
    """FastAPI TestClient with DB dependency overridden to use in-memory test DB."""
    from backend.main import app

    app.dependency_overrides[get_db] = override_get_db

    with patch("backend.main.seed_database", return_value=None), \
         patch("backend.main.engine", test_engine), \
         patch("backend.database.engine", test_engine):
        with TestClient(app) as c:
            yield c

    app.dependency_overrides.clear()
