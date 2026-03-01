from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class CoreWebVitals(BaseModel):
    lcp: str
    cls: str
    inp: str


class CategoryScores(BaseModel):
    performance: int
    accessibility: int
    seo: int
    pwa: int


class Metrics(BaseModel):
    category_scores: CategoryScores
    core_web_vitals: CoreWebVitals
    total_page_size: str
    number_of_requests: int
    dom_size: str
    dom_nodes_count: int
    main_thread_work: str
    ttfb_ms: int


# --- Technical Findings Models ---

class SecurityHeaders(BaseModel):
    strict_transport_security: bool
    content_security_policy: bool
    x_content_type_options: bool
    x_frame_options: bool

class ImageIssueFinding(BaseModel):
    type: str
    title: str
    wasted_bytes: int


class RenderBlockingResource(BaseModel):
    url: str
    wasted_ms: int


class UnusedAsset(BaseModel):
    url: str
    wasted_bytes: int


class ThirdPartyScript(BaseModel):
    entity: str
    blocking_time: int
    transfer_size: int


class HeavyResource(BaseModel):
    url: str
    transfer_size: int


class TechnicalAuditReport(BaseModel):
    security_headers: SecurityHeaders
    image_issues: List[ImageIssueFinding]
    render_blocking: List[RenderBlockingResource]
    unused_assets: List[UnusedAsset]
    third_party: List[ThirdPartyScript]
    heavy_resources: List[HeavyResource]


# --- Image Analysis specific ---

class ImageFinding(BaseModel):
    type: str  # format, compression, sizing, lazy_loading
    issue: str
    impact: str  # high, medium, low


class ImageAnalysisResult(BaseModel):
    total_image_weight: str
    number_of_large_images: int
    number_of_non_webp_images: int
    lazy_loading_missing: int
    findings: List[ImageFinding]


# --- Unified Report Models ---

class RecommendationCategories(BaseModel):
    critical: List[str]
    high: List[str]
    medium: List[str]
    low: List[str]


class AuditReport(BaseModel):
    summary: str
    metrics: Metrics
    technical_findings: TechnicalAuditReport
    image_analysis: ImageAnalysisResult
    recommendations: RecommendationCategories
    tech_stack: Optional[Dict[str, Any]] = None
    network_profile: Optional[Dict[str, Any]] = None
    seo_analysis: Optional[Dict[str, Any]] = None


class AnalyzeResponse(BaseModel):
    url: str
    mobile: Optional[AuditReport] = None
    desktop: Optional[AuditReport] = None