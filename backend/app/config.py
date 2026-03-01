import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()


class Settings:
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")

    # Optional future configs
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", 3600))
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", 5))
    RATE_LIMIT_WINDOW: int = int(os.getenv("RATE_LIMIT_WINDOW", 60))


settings = Settings()