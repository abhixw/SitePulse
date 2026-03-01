import asyncio
from services.lighthouse_parser import parse_lighthouse_data
from services.image_analyzer import analyze_images
from services.recommendation_engine import generate_rule_based_recommendations
from services.report_builder import build_audit_report
from services.tech_profiler import analyze_tech_stack
from services.network_profiler import analyze_network
from services.seo_scraper import analyze_seo_tags
from typing import Dict, Any

async def run_audit_engine(url: str, strategy: str, categories: Dict[str, Any], audits: Dict[str, Any]) -> Dict[str, Any]:
    """
    The Orchestrator Engine for Phase 8 integrations.
    Sends raw Google insight structs across deep functional analysis domains and compiles Final Model.
    """
    # Run CPU bound parsing sequentially
    normalized_audit_data = parse_lighthouse_data(categories, audits)
    image_analysis = analyze_images(audits)
    recommendations = generate_rule_based_recommendations(normalized_audit_data)
    
    # Run network-bound deep profilers concurrently
    tech_stack, network_profile, seo_data = await asyncio.gather(
        analyze_tech_stack(url),
        analyze_network_async_wrapper(url),
        analyze_seo_tags(url)
    )
    
    report = build_audit_report(url, strategy, normalized_audit_data, image_analysis, recommendations)
    report["tech_stack"] = tech_stack
    report["network_profile"] = network_profile
    report["seo_analysis"] = seo_data
    return report

async def analyze_network_async_wrapper(url: str) -> Dict[str, Any]:
    # Network analysis uses socket blocking code, wrapping it to not block event loop entirely
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, analyze_network, url)

