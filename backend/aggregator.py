from collections import Counter
from models import LogEntry


def get_top_ips(entries: list[LogEntry], limit: int = 10) -> list[dict]:
    counts = Counter(e.source_ip for e in entries if e.action == "DENY")
    return [{"ip": ip, "count": count} for ip, count in counts.most_common(limit)]


def get_top_ports(entries: list[LogEntry], limit: int = 10) -> list[dict]:
    counts = Counter(e.dest_port for e in entries if e.action == "DENY")
    return [{"port": port, "count": count} for port, count in counts.most_common(limit)]


def get_summary_stats(entries: list[LogEntry]) -> dict:
    total_blocked = sum(1 for e in entries if e.action == "DENY")
    return {
        "total_entries": len(entries),
        "total_blocked": total_blocked,
        "top_ips": get_top_ips(entries),
        "top_ports": get_top_ports(entries),
    }