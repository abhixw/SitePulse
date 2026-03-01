from pydantic import BaseModel, field_validator
from typing import Optional


class AnalyzeRequest(BaseModel):
    url: str
    strategy: Optional[str] = "mobile"  # Can be "mobile", "desktop", or "both"

    @field_validator("url")
    @classmethod
    def validate_url(cls, value: str) -> str:
        # Remove leading and trailing whitespace
        value = value.strip()

        # Empty check
        if not value:
            raise ValueError("URL cannot be empty.")

        # Minimum length check
        if len(value) < 8:
            raise ValueError("URL is too short to be valid.")

        # Basic protocol validation
        if not value.startswith(("http://", "https://")):
            raise ValueError("URL must start with http:// or https://")

        return value