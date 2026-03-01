from typing import Dict, Any, List


def extract_core_web_vitals(audits: Dict[str, Any]) -> Dict[str, str]:
    return {
        "lcp": audits.get("largest-contentful-paint", {}).get("displayValue", "N/A"),
        "cls": audits.get("cumulative-layout-shift", {}).get("displayValue", "N/A"),
        "inp": audits.get("interaction-to-next-paint", {}).get("displayValue", "N/A"),
    }


def extract_opportunities(audits: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    # Returns render_blocking, unused_assets, image_issues
    render_blocking = []
    rb_audit = audits.get("render-blocking-resources", {})
    if rb_audit.get("score") is not None and rb_audit.get("score") < 1.0:
        for item in rb_audit.get("details", {}).get("items", []):
            render_blocking.append({
                "url": item.get("url", ""),
                "wasted_ms": item.get("wastedMs", 0)
            })
            
    unused_assets = []
    for key in ["unused-css-rules", "unused-javascript"]:
        audit = audits.get(key, {})
        if audit.get("score") is not None and audit.get("score") < 1.0:
            for item in audit.get("details", {}).get("items", []):
                unused_assets.append({
                    "url": item.get("url", ""),
                    "wasted_bytes": item.get("wastedBytes", 0)
                })
                
    image_issues = []
    for key in ["offscreen-images", "properly-size-images", "modern-image-formats"]:
        audit = audits.get(key, {})
        if audit.get("score") is not None and audit.get("score") < 1.0:
            image_issues.append({
                "type": key,
                "title": audit.get("title", ""),
                "wasted_bytes": audit.get("details", {}).get("overallSavingsBytes", 0)
            })

    return {
        "render_blocking": render_blocking,
        "unused_assets": unused_assets,
        "image_issues": image_issues
    }


def extract_diagnostics(audits: Dict[str, Any]) -> Dict[str, Any]:
    # total-byte-weight, main-thread-work-breakdown, dom-size, third-party-summary, network-requests
    third_party = []
    tp_audit = audits.get("third-party-summary", {})
    if tp_audit:
        for item in tp_audit.get("details", {}).get("items", []):
            third_party.append({
                "entity": item.get("entity", {}).get("text", "Unknown"),
                "blocking_time": item.get("blockingTime", 0),
                "transfer_size": item.get("transferSize", 0)
            })
            
    heavy_resources = []
    nr_audit = audits.get("network-requests", {})
    if nr_audit:
        # Sort by transferSize, keep > 500KB for instance
        items = nr_audit.get("details", {}).get("items", [])
        heavy_items = [i for i in items if i.get("transferSize", 0) > 500 * 1024]
        for item in heavy_items:
            heavy_resources.append({
                "url": item.get("url", ""),
                "transfer_size": item.get("transferSize", 0)
            })
            
    total_bytes = audits.get("total-byte-weight", {}).get("numericValue", 0)
    total_page_size = f"{round(total_bytes / (1024 * 1024), 2)} MB"
    
    number_of_requests = len(nr_audit.get("details", {}).get("items", [])) if nr_audit else 0

    ttfb_audit = audits.get("server-response-time", {})
    ttfb_ms = ttfb_audit.get("numericValue", 0) if ttfb_audit else 0

    return {
        "third_party": third_party,
        "heavy_resources": heavy_resources,
        "total_page_size": total_page_size,
        "number_of_requests": number_of_requests,
        "dom_size": audits.get("dom-size", {}).get("displayValue", ""),
        "dom_nodes_count": audits.get("dom-size", {}).get("numericValue", 0),
        "main_thread_work": audits.get("mainthread-work-breakdown", {}).get("displayValue", ""),
        "ttfb_ms": ttfb_ms
    }


def extract_security_headers(audits: Dict[str, Any]) -> Dict[str, bool]:
    headers_dict = {
        "strict-transport-security": False,
        "content-security-policy": False,
        "x-content-type-options": False,
        "x-frame-options": False
    }

    nr_audit = audits.get("network-requests", {})
    items = nr_audit.get("details", {}).get("items", [])
    
    # Find the main document natively via type
    main_doc = next((item for item in items if item.get("resourceType") == "Document"), None)
    if not main_doc and items:
        main_doc = items[0]
        
    if main_doc:
        response_headers = main_doc.get("responseHeaders", [])
        for header in response_headers:
            name = header.get("name", "").lower()
            if name in headers_dict:
                headers_dict[name] = True
                
    return {
        "strict_transport_security": headers_dict["strict-transport-security"],
        "content_security_policy": headers_dict["content-security-policy"],
        "x_content_type_options": headers_dict["x-content-type-options"],
        "x_frame_options": headers_dict["x-frame-options"]
    }


def parse_lighthouse_data(categories: Dict[str, Any], audits: Dict[str, Any]) -> Dict[str, Any]:
    core_vitals = extract_core_web_vitals(audits)
    opportunities = extract_opportunities(audits)
    diagnostics = extract_diagnostics(audits)
    security_headers = extract_security_headers(audits)

    category_scores = {
        "performance": int(categories.get("performance", {}).get("score", 0) * 100),
        "accessibility": int(categories.get("accessibility", {}).get("score", 0) * 100),
        "seo": int(categories.get("seo", {}).get("score", 0) * 100),
        "pwa": int(categories.get("pwa", {}).get("score", 0) * 100)
    }

    return {
        "metrics": {
            "category_scores": category_scores,
            "core_web_vitals": core_vitals,
            "total_page_size": diagnostics["total_page_size"],
            "number_of_requests": diagnostics["number_of_requests"],
            "dom_size": diagnostics["dom_size"],
            "dom_nodes_count": diagnostics["dom_nodes_count"],
            "main_thread_work": diagnostics["main_thread_work"],
            "ttfb_ms": diagnostics["ttfb_ms"]
        },
        "security_headers": security_headers,
        "image_issues": opportunities["image_issues"],
        "render_blocking": opportunities["render_blocking"],
        "unused_assets": opportunities["unused_assets"],
        "third_party": diagnostics["third_party"],
        "heavy_resources": diagnostics["heavy_resources"]
    }
