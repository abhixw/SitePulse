import socket
import ssl
import dns.resolver
import whois
from typing import Dict, Any
from urllib.parse import urlparse
from datetime import datetime

def analyze_network(url: str) -> Dict[str, Any]:
    """
    Bypasses lighthouse to execute direct socket connections interrogating
    the literal server infrastructure for tight SSL and DNS bindings.
    """
    domain = urlparse(url).netloc or url
    
    # Strip port if present
    if ":" in domain:
        domain = domain.split(":")[0]

    network_data = {
        "ssl": {
            "valid": False,
            "issuer": "Unknown",
            "days_until_expiry": 0,
            "protocol": "Unknown"
        },
        "dns": {
            "a_records": [],
            "mx_records": [],
            "txt_records": []
        },
        "whois": {
            "registrar": "Unknown",
            "creation_date": None
        }
    }

    # 1. SSL/TLS Certificate Extraction
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                network_data["ssl"]["valid"] = True
                network_data["ssl"]["protocol"] = ssock.version()
                
                # Extract Issuer Organization
                issuer = dict(x[0] for x in cert.get('issuer', []))
                network_data["ssl"]["issuer"] = issuer.get('organizationName', 'Unknown')
                
                # Calculate Expiry
                expiry_date = datetime.strptime(cert['notAfter'], "%b %d %H:%M:%S %Y %Z")
                days_left = (expiry_date - datetime.utcnow()).days
                network_data["ssl"]["days_until_expiry"] = max(0, days_left)
    except Exception as e:
        print(f"SSL extraction failed for {domain}: {e}")

    # 2. DNS Routing Interrogation
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = 3
        resolver.lifetime = 3

        # A Records (IPs)
        try:
            answers = resolver.resolve(domain, 'A')
            network_data["dns"]["a_records"] = [rdata.to_text() for rdata in answers]
        except: pass

        # MX Records (Mail)
        try:
            answers = resolver.resolve(domain, 'MX')
            network_data["dns"]["mx_records"] = [rdata.exchange.to_text() for rdata in answers]
        except: pass
        
        # TXT Records (SPF/Verification)
        try:
            answers = resolver.resolve(domain, 'TXT')
            network_data["dns"]["txt_records"] = [rdata.to_text().strip('"') for rdata in answers]
        except: pass
    except Exception as e:
        print(f"DNS extraction failed for {domain}: {e}")

    # 3. WHOIS Data
    try:
        w = whois.whois(domain)
        network_data["whois"]["registrar"] = w.registrar if isinstance(w.registrar, str) else "Unknown"
        
        # Whois dates can be lists or datetimes
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
            
        if isinstance(creation, datetime):
            network_data["whois"]["creation_date"] = creation.strftime("%Y-%m-%d")
            
    except Exception as e:
        print(f"WHOIS extraction failed for {domain}: {e}")

    return network_data
