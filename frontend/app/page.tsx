"use client";

import { useEffect, useState } from "react";
import { getSummary, getGeoData, refreshLogs, SummaryResponse, GeoInfo } from "@/lib/api";
import TopIPsTable from "@/components/TopIPsTable";
import TopPortsChart from "@/components/TopPortsChart";
import GeoMap from "@/components/GeoMap";

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [geoData, setGeoData] = useState<GeoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, geo] = await Promise.all([getSummary(), getGeoData()]);
      setSummary(summaryData);
      setGeoData(geo);
    } catch (err) {
      setError("Could not reach the backend. Make sure the API is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRefresh() {
    await refreshLogs();
    loadData();
  }

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;
  if (!summary) return null;

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Firewall Log Analyzer</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition"
        >
          Refresh logs
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Total entries</p>
          <p className="text-3xl font-bold">{summary.total_entries}</p>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Total blocked</p>
          <p className="text-3xl font-bold text-red-400">{summary.total_blocked}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <TopIPsTable data={summary.top_ips} />
        <TopPortsChart data={summary.top_ports} />
      </div>

      <GeoMap data={geoData} />
    </main>
  );
}