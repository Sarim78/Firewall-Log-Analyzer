interface TopPort {
  port: number;
  count: number;
}

export default function TopPortsChart({ data }: { data: TopPort[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-neutral-900 rounded-lg p-4">
      <h2 className="text-lg font-medium mb-3">Most targeted ports</h2>
      <div className="space-y-2">
        {data.map((row) => (
          <div key={row.port} className="flex items-center gap-2">
            <span className="w-16 text-sm font-mono text-neutral-400">{row.port}</span>
            <div className="flex-1 bg-neutral-800 rounded h-4 overflow-hidden">
              <div
                className="bg-red-500 h-4"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
            <span className="w-8 text-sm text-right">{row.count}</span>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-neutral-500 text-sm">No port data yet</p>
        )}
      </div>
    </div>
  );
}