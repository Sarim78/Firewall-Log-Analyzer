from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LogEntry(BaseModel):
    timestamp: datetime
    source_ip: str
    dest_port: int
    protocol: str
    action: str  # ALLOW or DENY


class GeoInfo(BaseModel):
    ip: str
    country: Optional[str] = None
    city: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None


class SummaryResponse(BaseModel):
    total_entries: int
    total_blocked: int
    top_ips: list[dict]
    top_ports: list[dict]