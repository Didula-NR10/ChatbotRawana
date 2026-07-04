"""
Centralized application configuration.

All secrets and environment-specific values are loaded from environment
variables (via a local .env file in development). Nothing sensitive is
hard-coded, and the Gemini API key never leaves this process — the
frontend never sees it.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Gemini ---
    gemini_api_key: str
    gemini_model: str = "gemini-2.5-flash"

    # --- CORS ---
    # Comma-separated list of allowed origins, e.g.
    # "http://localhost:5173,https://mandhodhini.example.com"
    allowed_origins: str = "http://localhost:5173"

    # --- Rate limiting ---
    rate_limit: str = "15/minute"

    # --- App ---
    environment: str = "development"
    max_message_length: int = 600
    max_history_turns: int = 6  # how many prior turns the client may send for context

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()