import time
import requests
from models import GeoInfo
import config

_cache: dict[str, tuple[GeoInfo, float]] = {}


def get_geo_info(ip: str) -> GeoInfo:
    now = time.time()

    if ip in _cache:
        cached_info, cached_at = _cache[ip]
        if now - cached_at < config.GEO_CACHE_TTL:
            return cached_info

    try:
        response = requests.get(config.GEO_API_URL.format(ip=ip), timeout=5)
        data = response.json()
        if data.get("status") == "success":
            info = GeoInfo(
                ip=ip,
                country=data.get("country"),
                city=data.get("city"),
                lat=data.get("lat"),
                lon=data.get("lon"),
            )
        else:
            info = GeoInfo(ip=ip)
    except requests.RequestException:
        info = GeoInfo(ip=ip)

    _cache[ip] = (info, now)
    return info


def geolocate_ips(ips: list[str]) -> dict[str, GeoInfo]:
    return {ip: get_geo_info(ip) for ip in set(ips)}