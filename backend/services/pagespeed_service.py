import httpx
from typing import Dict, Any
from app.config import settings


PAGESPEED_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"


async def analyze_website(url: str, strategy: str = "mobile") -> Dict[str, Any]:
    params = {
        "url": url,
        "strategy": strategy,
        "category": ["performance", "accessibility", "seo", "pwa"]
    }
    
    if settings.GOOGLE_API_KEY:
        api_key = settings.GOOGLE_API_KEY.strip('"').strip("'")
        params["key"] = api_key

    timeout = httpx.Timeout(60.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(PAGESPEED_API_URL, params=params)

    # Handle specific API errors gracefully
    if response.status_code == 429:
        raise Exception(
            "Google PageSpeed API Rate Limit Exceeded (429). Please wait a minute or use a different API Key."
        )
    elif response.status_code != 200:
        raise Exception(
            f"PageSpeed API error: {response.status_code} - Failed to process URL."
        )

    data = response.json()

    lighthouse = data.get("lighthouseResult", {})
    audits = lighthouse.get("audits", {})
    categories = lighthouse.get("categories", {})

    # Extract performance score (0–100)
    performance_score = int(
        categories.get("performance", {}).get("score", 0) * 100
    )

    # We now strictly return the raw audits and categories
    # The actual compression/abstraction logic is pushed left to the Orchestrator (audit_engine)
    return {
        "performance_score": performance_score,
        "audits": audits,
        "categories": categories
    }