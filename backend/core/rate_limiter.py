import time
from typing import Dict, List

# Store IP -> list of request timestamps
_request_log: Dict[str, List[float]] = {}

# Config
MAX_REQUESTS = 5
WINDOW_SECONDS = 60


def is_rate_limited(ip: str) -> bool:
    now = time.time()

    if ip not in _request_log:
        _request_log[ip] = []

    # Remove old timestamps outside window
    _request_log[ip] = [
        timestamp for timestamp in _request_log[ip]
        if now - timestamp < WINDOW_SECONDS
    ]

    if len(_request_log[ip]) >= MAX_REQUESTS:
        return True

    # Record this request
    _request_log[ip].append(now)

    return False