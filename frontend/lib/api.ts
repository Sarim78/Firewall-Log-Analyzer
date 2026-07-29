const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface SummaryResponse {
  total_entries: number;
  total_blocked: number;
  top_ips: { ip: string; count: number }[];
  top_ports: { port: number; count: number }[];
}

export interface GeoInfo {
  ip: string;
  country: string | null;
  city: string | null;
  lat: number | null;
  lon: number | null;
}

export async function getSummary(): Promise<SummaryResponse> {
  const res = await fetch(`${API_BASE}/api/summary`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function getGeoData(): Promise<GeoInfo[]> {
  const res = await fetch(`${API_BASE}/api/geo`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch geo data");
  return res.json();
}

export async function refreshLogs(): Promise<{ status: string; total_entries: number }> {
  const res = await fetch(`${API_BASE}/api/refresh`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to refresh logs");
  return res.json();
}