# Firewall Log Analyzer

A lightweight security dashboard that parses firewall logs and surfaces the data that actually matters: who's hitting your network, what ports they're probing, and where they're coming from.

## What it does

This tool reads raw firewall logs (Windows Defender Firewall, iptables/ufw, or pfSense), extracts key fields from each entry, enriches them with geolocation data, and rolls everything up into a dashboard showing:

- Top blocked IP addresses
- Most frequently targeted ports
- Geographic origin of incoming traffic
- Basic traffic trends over time

## Tech stack

**Backend:** Python, FastAPI
**Frontend:** Next.js, Tailwind CSS
**Geolocation:** ip-api.com (or MaxMind GeoLite2 for offline use)

## Project structure

```
firewall-log-analyzer/
├── backend/
│   ├── main.py              # FastAPI app entry point, routes
│   ├── parser.py            # reads raw log files, extracts fields
│   ├── geolocate.py         # IP to location lookup logic
│   ├── aggregator.py        # counts top IPs, top ports, builds summary stats
│   ├── models.py            # pydantic models for log entries and summaries
│   ├── logs/
│   │   └── sample.log       # raw firewall log file(s)
│   ├── requirements.txt
│   └── config.py            # paths, API keys, log format settings
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # main dashboard page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── TopIPsTable.tsx
│   │   ├── TopPortsChart.tsx
│   │   └── GeoMap.tsx
│   ├── lib/
│   │   └── api.ts           # calls to the FastAPI backend
│   ├── package.json
│   └── tailwind.config.ts
│
└── README.md
```

## Getting started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A firewall log source (Windows Firewall logging enabled, iptables/ufw syslog output, or a pfSense log export)

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Drop your log file(s) into `backend/logs/`, then update `config.py` with the log path and format if it differs from the default.

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:3000`, and it expects the API running at `http://localhost:8000` by default (configurable in `lib/api.ts`).

## Configuration

Log format and geolocation settings live in `backend/config.py`:

| Setting | Description | Default |
|---|---|---|
| `LOG_PATH` | Path to the log file(s) to parse | `./logs/sample.log` |
| `LOG_FORMAT` | Which parser to use: `windows`, `iptables`, or `pfsense` | `iptables` |
| `GEO_PROVIDER` | `ip-api` (online) or `geolite2` (offline database) | `ip-api` |
| `GEO_CACHE_TTL` | How long to cache IP lookups, in seconds | `86400` |

## How it works

1. **Parsing** — `parser.py` reads each log line and extracts timestamp, source IP, destination port, protocol, and action (allow/deny).
2. **Geolocation** — `geolocate.py` looks up each unique source IP and caches the result to avoid re-querying on every run.
3. **Aggregation** — `aggregator.py` counts occurrences and produces the summary stats the dashboard consumes.
4. **Serving** — `main.py` exposes parsed and aggregated data through a handful of REST endpoints.
5. **Display** — the Next.js frontend fetches from those endpoints and renders tables, charts, and a geo map.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/summary` | Overall stats: total blocked, top IPs, top ports |
| `GET` | `/api/top-ips` | Ranked list of most frequent source IPs |
| `GET` | `/api/top-ports` | Ranked list of most targeted ports |
| `GET` | `/api/geo` | Geolocated entries for map rendering |
| `POST` | `/api/refresh` | Re-parses the log file and refreshes cached data |

## Notes

This project is built for personal network monitoring and learning purposes. Geolocation accuracy depends on the provider used and isn't precise enough for anything beyond general awareness of traffic origin.

## License

MIT
