from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./packaging.db"
    SECRET_KEY: str = "food-packaging-engine-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    TOPSIS_W_BARRIER: float = 0.35
    TOPSIS_W_COST: float = 0.25
    TOPSIS_W_CARBON: float = 0.20
    TOPSIS_W_MECHANICAL: float = 0.10
    TOPSIS_W_SEAL: float = 0.10
    GOOGLE_CLIENT_ID: str = "2688221719-mdj9u8jjijq58j43eltml41q3f6q9jjn.apps.googleusercontent.com"
    model_config = SettingsConfigDict(
        env_file=[
            os.path.join(os.path.dirname(__file__), ".env"),
            os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
            ".env"
        ],
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
