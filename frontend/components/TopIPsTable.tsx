interface TopIP {
  ip: string;
  count: number;
}

export default function TopIPsTable({ data }: { data: TopIP[] }) {
  return (
    <div className="bg-neutral-900 rounded-lg p-4">
      <h2 className="text-lg font-medium mb-3">Top blocked IPs</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-neutral-400 text-left border-b border-neutral-800">
            <th className="pb-2">IP address</th>
            <th className="pb-2 text-right">Attempts</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.ip} className="border-b border-neutral-800/50">
              <td className="py-2 font-mono">{row.ip}</td>
              <td className="py-2 text-right">{row.count}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={2} className="py-4 text-center text-neutral-500">
                No blocked IPs yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}