import time
from typing import Any, Dict, Optional


# In-memory cache store
_cache: Dict[str, Dict[str, Any]] = {}

# Cache expiration time (in seconds)
CACHE_TTL = 60 * 60  # 1 hour


def get_cached_result(url: str, strategy: str) -> Optional[Dict[str, Any]]:
    cache_key = f"{url}_{strategy}"
    entry = _cache.get(cache_key)

    if not entry:
        return None

    # Check expiration
    if time.time() - entry["timestamp"] > CACHE_TTL:
        # Expired → remove it
        del _cache[cache_key]
        return None

    return entry


def set_cached_result(url: str, strategy: str, result: Dict[str, Any]) -> None:
    cache_key = f"{url}_{strategy}"
    _cache[cache_key] = {
        "result": result,
        "strategy": strategy,
        "timestamp": time.time(),
    }