from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Optional, Union
import os
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Lucid"
    API_V1_STR: str = "/api/v1"
    
    # Database (PostgreSQL on Supabase/Neon/DigitalOcean, with SQLite async fallback)
    DATABASE_URL: str = "sqlite+aiosqlite:///./lucid.db"
    
    # Security & JWT
    SECRET_KEY: str = "lucid-dev-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # External APIs (free sources)
    FRED_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    NEWS_API_KEY: Optional[str] = None
    ALPACA_API_KEY: Optional[str] = None
    ALPACA_SECRET_KEY: Optional[str] = None
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "*"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("[") and v_str.endswith("]"):
                try:
                    parsed = json.loads(v_str)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed]
                except Exception:
                    pass
            return [i.strip() for i in v_str.split(",") if i.strip()]
        elif isinstance(v, list):
            return [str(i).strip() for i in v]
        return ["*"]
    
    # Data Storage Paths
    MODELS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml_artifacts")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
