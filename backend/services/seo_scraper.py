import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any

async def analyze_seo_tags(url: str) -> Dict[str, Any]:
    """
    Downloads raw HTML and parses the exact <meta> and OpenGraph tags
    to determine exactly how the URL will look when shared on Social Media.
    """
    seo_data = {
        "title": None,
        "description": None,
        "robots": None,
        "canonical": None,
        "open_graph": {
            "title": None,
            "description": None,
            "image": None,
            "url": None
        },
        "twitter_card": {
            "card": None,
            "site": None,
            "image": None
        },
        "headings": {
            "h1_count": 0,
            "h2_count": 0
        },
        "has_schema_markup": False
    }

    try:
        timeout = httpx.Timeout(10.0)
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
            response = await client.get(url)
            html_content = response.text

        soup = BeautifulSoup(html_content, "html.parser")

        # 1. Base SEO
        title_tag = soup.find("title")
        if title_tag:
            seo_data["title"] = title_tag.string

        meta_desc = soup.find("meta", attrs={"name": "description"})
        if meta_desc:
            seo_data["description"] = meta_desc.get("content")

        meta_robots = soup.find("meta", attrs={"name": "robots"})
        if meta_robots:
            seo_data["robots"] = meta_robots.get("content")

        canonical = soup.find("link", attrs={"rel": "canonical"})
        if canonical:
            seo_data["canonical"] = canonical.get("href")

        # 2. OpenGraph
        og_title = soup.find("meta", property="og:title")
        if og_title: seo_data["open_graph"]["title"] = og_title.get("content")
        
        og_desc = soup.find("meta", property="og:description")
        if og_desc: seo_data["open_graph"]["description"] = og_desc.get("content")
        
        og_image = soup.find("meta", property="og:image")
        if og_image: seo_data["open_graph"]["image"] = og_image.get("content")
        
        og_url = soup.find("meta", property="og:url")
        if og_url: seo_data["open_graph"]["url"] = og_url.get("content")

        # 3. Twitter Cards
        tc_card = soup.find("meta", attrs={"name": "twitter:card"})
        if tc_card: seo_data["twitter_card"]["card"] = tc_card.get("content")
        
        tc_site = soup.find("meta", attrs={"name": "twitter:site"})
        if tc_site: seo_data["twitter_card"]["site"] = tc_site.get("content")

        tc_image = soup.find("meta", attrs={"name": "twitter:image"})
        if tc_image: seo_data["twitter_card"]["image"] = tc_image.get("content")

        # 4. Heading Geography
        seo_data["headings"]["h1_count"] = len(soup.find_all("h1"))
        seo_data["headings"]["h2_count"] = len(soup.find_all("h2"))

        # 5. Schema.org (JSON-LD)
        scripts = soup.find_all("script", type="application/ld+json")
        if scripts and len(scripts) > 0:
            seo_data["has_schema_markup"] = True

    except Exception as e:
        print(f"SEO Scraper Error on {url}: {e}")

    return seo_data
