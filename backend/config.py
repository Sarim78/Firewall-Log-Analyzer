import os

LOG_PATH = os.getenv("LOG_PATH", "./logs/sample.log")
LOG_FORMAT = os.getenv("LOG_FORMAT", "iptables")  # options: iptables, windows, pfsense
GEO_PROVIDER = os.getenv("GEO_PROVIDER", "ip-api")
GEO_CACHE_TTL = int(os.getenv("GEO_CACHE_TTL", 86400))
GEO_API_URL = "http://ip-api.com/json/{ip}"