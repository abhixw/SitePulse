from typing import Dict, Any


def build_audit_report(url: str, strategy: str, audit_data: Dict[str, Any], image_analysis: Dict[str, Any], recommendations: Dict[str, Any]) -> Dict[str, Any]:
    metrics = audit_data.get("metrics", {})
    category_scores = metrics.get("category_scores", {})
    perf = category_scores.get("performance", 0)
    seo = category_scores.get("seo", 0)
    a11y = category_scores.get("accessibility", 0)
    pwa = category_scores.get("pwa", 0)

    # 1. Synthesize the dynamic executive summary
    # Calculate an overall health average
    avg_score = (perf + seo + a11y + pwa) / 4 if (perf + seo + a11y + pwa) > 0 else 0
    
    # Identify the weakest and strongest links
    scores_dict = {"Performance": perf, "SEO": seo, "Accessibility": a11y, "PWA Health": pwa}
    weakest_category = min(scores_dict, key=scores_dict.get)
    strongest_category = max(scores_dict, key=scores_dict.get)

    # Construct the dynamic sentence
    if avg_score >= 85:
        summary_base = f"The {strategy} version of {url} demonstrates excellent overall engineering."
    elif avg_score >= 50:
        summary_base = f"The {strategy} version of {url} shows moderate digital health, but requires structural optimization."
    else:
        summary_base = f"The {strategy} version of {url} is severely underperforming across critical web vitals."

    summary = f"{summary_base} While the site excels in {strongest_category} ({scores_dict[strongest_category]}), its primary bottleneck lies in {weakest_category} ({scores_dict[weakest_category]}), which should be addressed immediately."

    # Return structured dict aligning with the AuditReport Pydantic model
    return {
        "summary": summary,
        "metrics": metrics,
        "technical_findings": {
            "security_headers": audit_data.get("security_headers", {}),
            "image_issues": audit_data.get("image_issues", []),
            "render_blocking": audit_data.get("render_blocking", []),
            "unused_assets": audit_data.get("unused_assets", []),
            "third_party": audit_data.get("third_party", []),
            "heavy_resources": audit_data.get("heavy_resources", [])
        },
        "image_analysis": image_analysis,
        "recommendations": recommendations
    }
