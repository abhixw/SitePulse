from typing import Dict, Any, List


def generate_rule_based_recommendations(normalized_data: Dict[str, Any]) -> Dict[str, List[str]]:
    critical = []
    high = []
    medium = []
    low = []
    
    metrics = normalized_data.get("metrics", {})
    vitals = metrics.get("core_web_vitals", {})
    
    # LCP Rule
    lcp_str = vitals.get("lcp", "")
    try:
        lcp_val = float(lcp_str.replace("s", "").replace("\xa0", "").strip())
        if lcp_val > 2.5:
            high.append("Optimize hero image or critical resources to improve LCP.")
        if lcp_val > 4.0:
            critical.append("Severe LCP issue: Preload critical assets and reduce server render time.")
    except ValueError:
        pass
        
    # Page size Rule
    page_size_str = metrics.get("total_page_size", "0 MB")
    try:
        page_size_val = float(page_size_str.replace("MB", "").strip())
        if page_size_val > 2.0:
            high.append("Enable Brotli/Gzip compression and use a CDN (Page size > 2MB).")
        if page_size_val > 5.0:
            critical.append("Extremely heavy page layout > 5MB. Aggressively defer offscreen resources and compress media.")
    except ValueError:
        pass
        
    # Unused CSS/JS Rule
    unused_assets = normalized_data.get("unused_assets", [])
    unused_css_bytes = sum(a.get("wasted_bytes", 0) for a in unused_assets if "css" in a.get("url", "").lower())
    if unused_css_bytes > 50 * 1024:  # > 50kb wasted
        medium.append(f"Remove unused CSS using tools like PurgeCSS. Wasted bytes: {round(unused_css_bytes/1024)} KB.")
        
    unused_js_bytes = sum(a.get("wasted_bytes", 0) for a in unused_assets if "js" in a.get("url", "").lower())
    if unused_js_bytes > 100 * 1024:
        high.append("Code-split Javascript bundles and remove unused JS to decrease Main-Thread blocking.")
        
    # Render blocking Rule
    render_blocking = normalized_data.get("render_blocking", [])
    if len(render_blocking) > 0:
        if len(render_blocking) > 3:
            high.append(f"Defer or async non-critical CSS/JS ({len(render_blocking)} resources) to unblock page rendering.")
        else:
            medium.append("Eliminate render-blocking resources by inline-ing critical assets.")
            
    # Third party scripts Rule
    third_party = normalized_data.get("third_party", [])
    if len(third_party) > 5:
        medium.append("Delay or lazy-load heavy third-party scripts (e.g. tracking, ads) to avoid main thread contention.")
        
    # Image rules fallback
    image_issues = normalized_data.get("image_issues", [])
    has_format_issue = any(i.get("type") == "modern-image-formats" for i in image_issues)
    if has_format_issue:
        low.append("Convert legacy images to next-gen formats like WebP or AVIF.")
        
    # TTFB Rule
    ttfb = normalized_data.get("metrics", {}).get("ttfb_ms", 0)
    if ttfb > 600:
        high.append(f"Optimize backend response or enable CDN. Server response time is {round(ttfb)}ms (TTFB > 600ms).")
        
    # DOM Size Rule
    dom_nodes = normalized_data.get("metrics", {}).get("dom_nodes_count", 0)
    if dom_nodes > 1500:
        medium.append(f"Reduce DOM complexity. Found {dom_nodes} nodes, which slows down CSS styling and layout calculation.")
        
    # Security Headers Rule
    security_headers = normalized_data.get("security_headers", {})
    if security_headers:
        if not security_headers.get("strict_transport_security"):
            high.append("Missing Strict-Transport-Security (HSTS) header. Connections may be vulnerable to downgrade attacks.")
        if not security_headers.get("content_security_policy"):
            medium.append("Missing Content-Security-Policy (CSP) header. Susceptible to XSS attacks.")
        if not security_headers.get("x_content_type_options"):
            low.append("Missing X-Content-Type-Options header. Browsers may MIME-sniff the response.")
        if not security_headers.get("x_frame_options"):
            low.append("Missing X-Frame-Options header. Page might be vulnerable to Clickjacking.")
            
    # Category Scores Rules
    category_scores = normalized_data.get("metrics", {}).get("category_scores", {})
    if category_scores:
        if category_scores.get("accessibility", 100) < 90:
            medium.append(f"Accessibility score is {category_scores.get('accessibility')}. Improve ARIA labels and color contrast.")
        if category_scores.get("seo", 100) < 90:
            medium.append(f"SEO score is {category_scores.get('seo')}. Check meta tags and indexability.")
        if category_scores.get("pwa", 100) < 50:
            low.append(f"PWA score is low ({category_scores.get('pwa')}). Consider adding a Service Worker and manifest.")

    return {
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low
    }
