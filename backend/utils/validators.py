from urllib.parse import urlparse
import ipaddress


def validate_url(url: str) -> str:
    # Strip whitespace
    url = url.strip()

    # Empty check
    if not url:
        raise ValueError("URL cannot be empty.")

    # Protocol check
    if not url.startswith(("http://", "https://")):
        raise ValueError("URL must start with http:// or https://")

    # Parse URL
    parsed = urlparse(url)

    if not parsed.netloc:
        raise ValueError("Invalid URL format.")

    hostname = parsed.hostname

    # Block localhost
    if hostname in ("localhost", "127.0.0.1"):
        raise ValueError("Localhost URLs are not allowed.")

    # Block private IP ranges
    try:
        ip = ipaddress.ip_address(hostname)
    except ValueError:
        # Not an IP address → normal domain
        ip = None

    if ip and ip.is_private:
        raise ValueError("Private IP addresses are not allowed.")

    return url