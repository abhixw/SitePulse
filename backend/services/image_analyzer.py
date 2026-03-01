from typing import Dict, Any, List


def analyze_images(audits: Dict[str, Any]) -> Dict[str, Any]:
    # Extract total image weight
    resource_items = audits.get("resource-summary", {}).get("details", {}).get("items", [])
    total_image_bytes = 0
    for item in resource_items:
        if item.get("resourceType") == "image":
            total_image_bytes = item.get("transferSize", 0)
            break
            
    total_image_weight = f"{round(total_image_bytes / (1024 * 1024), 2)} MB"
    
    number_of_large_images = 0
    number_of_non_webp_images = 0
    lazy_loading_missing = 0
    
    findings = []
    
    properly_size = audits.get("properly-size-images", {})
    if properly_size.get("score") is not None and properly_size.get("score") < 1.0:
        items = properly_size.get("details", {}).get("items", [])
        number_of_large_images = len(items)
        if number_of_large_images > 0:
            findings.append({
                "type": "sizing",
                "issue": f"{number_of_large_images} images are not properly sized.",
                "impact": "high" if number_of_large_images > 3 else "medium"
            })
            
    modern_formats = audits.get("modern-image-formats", {})
    if modern_formats.get("score") is not None and modern_formats.get("score") < 1.0:
        items = modern_formats.get("details", {}).get("items", [])
        number_of_non_webp_images = len(items)
        if number_of_non_webp_images > 0:
            findings.append({
                "type": "format",
                "issue": f"{number_of_non_webp_images} images are not in modern formats (like WebP or AVIF).",
                "impact": "high" if number_of_non_webp_images > 5 else "medium"
            })
            
    offscreen = audits.get("offscreen-images", {})
    if offscreen.get("score") is not None and offscreen.get("score") < 1.0:
        items = offscreen.get("details", {}).get("items", [])
        lazy_loading_missing = len(items)
        if lazy_loading_missing > 0:
            findings.append({
                "type": "lazy_loading",
                "issue": f"{lazy_loading_missing} offscreen images are missing lazy loading.",
                "impact": "medium"
            })
            
    return {
        "total_image_weight": total_image_weight,
        "number_of_large_images": number_of_large_images,
        "number_of_non_webp_images": number_of_non_webp_images,
        "lazy_loading_missing": lazy_loading_missing,
        "findings": findings
    }
