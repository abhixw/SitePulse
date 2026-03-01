from fastapi import APIRouter, HTTPException, Request
from core.rate_limiter import is_rate_limited
from models.request_models import AnalyzeRequest
from models.response_models import AnalyzeResponse
from services.pagespeed_service import analyze_website
from utils.validators import validate_url
from core.cache import get_cached_result, set_cached_result
import httpx


from services.audit_engine import run_audit_engine
import asyncio

router = APIRouter()


@router.post("/audit", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest, fast_req: Request):
    try:
        # Rate Limiting via IP
        client_ip = fast_req.client.host if fast_req.client else "unknown"
        if is_rate_limited(client_ip):
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
            
        # 1️⃣ Security validation
        validated_url = validate_url(request.url)

        # 2️⃣ Check cache first using the unified structure
        cached_entry = get_cached_result(validated_url, request.strategy)
        if cached_entry:
            return cached_entry["result"]

        # 3️⃣ Call service layer based on strategy
        result = {"url": validated_url}
        
        async def fetch_and_audit(strategy: str):
            raw_data = await analyze_website(validated_url, strategy=strategy)
            return await run_audit_engine(validated_url, strategy, raw_data["categories"], raw_data["audits"])

        if request.strategy == "both":
            mobile_result, desktop_result = await asyncio.gather(
                fetch_and_audit("mobile"),
                fetch_and_audit("desktop")
            )
            result["mobile"] = mobile_result
            result["desktop"] = desktop_result
        elif request.strategy == "mobile":
            result["mobile"] = await fetch_and_audit("mobile")
        elif request.strategy == "desktop":
            result["desktop"] = await fetch_and_audit("desktop")
        else:
            raise ValueError("Invalid strategy provided. Use 'mobile', 'desktop', or 'both'.")

        # 4️⃣ Store result in cache wrapper (url, strategy, result)
        set_cached_result(validated_url, request.strategy, result)

        return result

    except HTTPException:
        # Re-raise FastAPI HTTPExceptions directly
        raise

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="PageSpeed API request timed out."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )