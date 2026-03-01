import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any, List
import re

async def analyze_tech_stack(url: str) -> Dict[str, List[str]]:
    """
    Intelligently scans HTML headers, meta tags, and script tags to detect
    underlying frameworks, servers, and technologies.
    """
    detected_tech = {
        "frameworks": set(),
        "servers": set(),
        "analytics": set(),
        "cms": set(),
        "cdns": set(),
    }

    try:
        timeout = httpx.Timeout(10.0)
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
            response = await client.get(url)
            html_content = response.text
            headers = response.headers

        # 1. Inspect HTTP Headers
        server_header = headers.get("server", "").lower()
        if "nginx" in server_header: detected_tech["servers"].add("Nginx")
        if "apache" in server_header: detected_tech["servers"].add("Apache")
        if "cloudflare" in server_header: detected_tech["cdns"].add("Cloudflare")
        if "express" in server_header: detected_tech["servers"].add("Express")
        
        x_powered_by = headers.get("x-powered-by", "").lower()
        if "express" in x_powered_by: detected_tech["frameworks"].add("Express")
        if "next" in x_powered_by: detected_tech["frameworks"].add("Next.js")
        if "php" in x_powered_by: detected_tech["frameworks"].add("PHP")

        # 2. Parse HTML using BeautifulSoup
        soup = BeautifulSoup(html_content, "html.parser")

        # Meta Generator tags
        generator_tag = soup.find("meta", attrs={"name": "generator"})
        if generator_tag:
            gen_content = generator_tag.get("content", "").lower()
            if "wordpress" in gen_content: detected_tech["cms"].add("WordPress")
            if "shopify" in gen_content: detected_tech["cms"].add("Shopify")
            if "webflow" in gen_content: detected_tech["cms"].add("Webflow")
            if "gatsby" in gen_content: detected_tech["frameworks"].add("Gatsby")

        # 3. Detect Script tags and DOM features
        scripts = soup.find_all("script")
        script_srcs = [s.get("src", "").lower() for s in scripts if s.get("src")]

        for src in script_srcs:
            if "react" in src or "react-dom" in src: detected_tech["frameworks"].add("React")
            if "vue" in src: detected_tech["frameworks"].add("Vue")
            if "angular" in src: detected_tech["frameworks"].add("Angular")
            if "google-analytics" in src or "googletagmanager" in src: detected_tech["analytics"].add("Google Analytics")
            if "hotjar" in src: detected_tech["analytics"].add("Hotjar")

        # ID based detection
        if soup.find(id="__next"): detected_tech["frameworks"].add("Next.js")
        if soup.find(id="___gatsby"): detected_tech["frameworks"].add("Gatsby")
        if soup.find(id="app") and not "Next.js" in detected_tech["frameworks"]: 
            detected_tech["frameworks"].add("Vue (Probable)")

        # Convert sets to sorted lists for JSON serialization
        return {k: sorted(list(v)) for k, v in detected_tech.items()}

    except Exception as e:
        print(f"Tech Profiler Error on {url}: {e}")
        return {k: [] for k in detected_tech.keys()}
