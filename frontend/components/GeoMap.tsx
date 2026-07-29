import { GeoInfo } from "@/lib/api";

export default function GeoMap({ data }: { data: GeoInfo[] }) {
  const located = data.filter((d) => d.lat !== null && d.lon !== null);

  return (
    <div className="bg-neutral-900 rounded-lg p-4">
      <h2 className="text-lg font-medium mb-3">Traffic origin</h2>
      {located.length === 0 ? (
        <p className="text-neutral-500 text-sm">No geolocation data yet</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {located.map((info) => (
            <li key={info.ip} className="bg-neutral-800 rounded px-3 py-2">
              <span className="font-mono">{info.ip}</span>
              <span className="text-neutral-400">, {info.city}, {info.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}