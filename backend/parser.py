import re
from datetime import datetime
from models import LogEntry

IPTABLES_PATTERN = re.compile(
    r"(?P<timestamp>\w{3}\s+\d+\s+\d{2}:\d{2}:\d{2}).*?"
    r"SRC=(?P<src_ip>[\d.]+).*?"
    r"DPT=(?P<dpt>\d+).*?"
    r"PROTO=(?P<proto>\w+)"
)


def parse_iptables_line(line: str, year: int = None) -> LogEntry | None:
    match = IPTABLES_PATTERN.search(line)
    if not match:
        return None

    year = year or datetime.now().year
    ts_str = f"{match.group('timestamp')} {year}"
    try:
        timestamp = datetime.strptime(ts_str, "%b %d %H:%M:%S %Y")
    except ValueError:
        return None

    action = "DENY" if "DROP" in line or "REJECT" in line else "ALLOW"

    return LogEntry(
        timestamp=timestamp,
        source_ip=match.group("src_ip"),
        dest_port=int(match.group("dpt")),
        protocol=match.group("proto"),
        action=action,
    )


def parse_log_file(path: str, log_format: str = "iptables") -> list[LogEntry]:
    entries = []
    parser_fn = {
        "iptables": parse_iptables_line,
    }.get(log_format)

    if not parser_fn:
        raise ValueError(f"Unsupported log format: {log_format}")

    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            entry = parser_fn(line)
            if entry:
                entries.append(entry)

    return entries