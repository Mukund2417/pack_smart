from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import bcrypt
import hashlib
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "packsmart-deep-learning-secret-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

LEGACY_SALT = "packsmart_salt_food_barrier_"

def hash_password(password: str) -> str:
    """Hash password using direct bcrypt (max 72 bytes)."""
    pwd_bytes = password.encode('utf-8')[:72]
    return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against direct bcrypt or legacy SHA-256 fallback."""
    if not hashed_password:
        return False
    pwd_bytes = plain_password.encode('utf-8')[:72]
    if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$") or hashed_password.startswith("$2y$"):
        try:
            return bcrypt.checkpw(pwd_bytes, hashed_password.encode('utf-8'))
        except Exception:
            return False
    # Legacy SHA-256 fallback verification for older seeded data
    legacy_hash = hashlib.sha256((LEGACY_SALT + plain_password).encode('utf-8')).hexdigest()
    return legacy_hash == hashed_password

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
