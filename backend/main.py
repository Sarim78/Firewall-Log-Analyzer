from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import SummaryResponse
import parser
import aggregator
import geolocate
import config

app = FastAPI(title="Firewall Log Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_entries_cache = []


def load_entries():
    global _entries_cache
    _entries_cache = parser.parse_log_file(config.LOG_PATH, config.LOG_FORMAT)
    return _entries_cache


load_entries()


@app.get("/api/summary", response_model=SummaryResponse)
def summary():
    stats = aggregator.get_summary_stats(_entries_cache)
    return stats


@app.get("/api/top-ips")
def top_ips(limit: int = 10):
    return aggregator.get_top_ips(_entries_cache, limit)


@app.get("/api/top-ports")
def top_ports(limit: int = 10):
    return aggregator.get_top_ports(_entries_cache, limit)


@app.get("/api/geo")
def geo():
    ips = [e.source_ip for e in _entries_cache if e.action == "DENY"]
    geo_data = geolocate.geolocate_ips(ips)
    return [info.model_dump() for info in geo_data.values()]


@app.post("/api/refresh")
def refresh():
    if not _entries_cache and not config.LOG_PATH:
        raise HTTPException(status_code=400, detail="No log path configured")
    load_entries()
    return {"status": "refreshed", "total_entries": len(_entries_cache)}