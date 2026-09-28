import { useEffect, useState } from "react";
import { Activity, Cloud, Magnet, Mountain, Radiation, Wind, Gauge } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const futureEngines = [
  ["atmosphere", Cloud, "Atmosphere"],
  ["weather", Cloud, "Weather"],
  ["geomagnetic", Magnet, "Geomagnetic"],
  ["radiation", Radiation, "Radiation"],
  ["air-quality", Wind, "Air Quality"],
  ["volcanic", Mountain, "Volcanic"],
  ["seismic", Activity, "Seismic"],
];

function EngineCard({ id, Icon, label, result, loading, expanded }) {
  const available = result?.available;
  return (
    <article
      className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-[#4C86A8] ${available ? "border-[#24536D] bg-[linear-gradient(145deg,rgba(8,49,69,.78),rgba(5,22,35,.96))]" : "border-[#5C4A24] bg-[linear-gradient(145deg,rgba(64,47,17,.28),rgba(5,22,35,.96))]"}`}
      data-testid={`future-natural-${id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Icon className={`h-5 w-5 ${available ? "text-[#58C7E8]" : "text-[#E4B95C]"}`} strokeWidth={1.8} />
        <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${loading ? "bg-[#10283A] text-[#7896AA]" : available ? "bg-cyan-400/10 text-cyan-300" : "bg-amber-400/10 text-amber-300"}`}>
          {loading ? "Loading" : available ? "Live" : "No data"}
        </span>
      </div>

      <p className="mt-3 text-xs font-bold text-[#C8DFEB]">{label}</p>

      {loading ? (
        <div className="mt-3 h-10 animate-pulse rounded bg-[#0B2234]" />
      ) : (
        <>
          <p className="mt-1.5 truncate text-sm font-semibold text-[#F0FAFF]">{result?.primary || "No data"}</p>
          <p className="mt-1.5 min-h-[1.25rem] text-[11px] leading-4 text-[#7898AD]">{result?.secondary || "Provider unavailable"}</p>
          <div className="mt-3 grid gap-1.5">
            {(result?.details || []).slice(0, 2).map((detail) => (
              <div key={detail.label} className="flex min-w-0 justify-between gap-2 text-[10px]">
                <span className="truncate text-[#52748A]">{detail.label}</span>
                <span className="truncate text-right text-[#8AA9BA]">{String(detail.value ?? "—")}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}

export default function NaturalFutureEngines({ data, dateISO, expanded = false }) {
  const [engines, setEngines] = useState({});
  const [loading, setLoading] = useState(false);
  const location = data?.location || {};
  const locationId = location.id;
  const city = location.city || location.name || "Bandung";

  useEffect(() => {
    if (!locationId && !city) {
      setEngines({});
      return undefined;
    }
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (locationId) params.set("location_id", locationId);
        else params.set("city", city);
        if (dateISO) params.set("date_value", dateISO);
        const response = await fetch(`${API_BASE}/api/natural/future?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Future natural API returned ${response.status}`);
        const payload = await response.json();
        if (!controller.signal.aborted) setEngines(payload.engines || {});
      } catch (error) {
        if (error.name !== "AbortError") setEngines({});
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [locationId, city, dateISO]);

  return (
    <section className="relative z-10 mt-7 border-t border-[#164263] pt-6" data-testid="natural-future-engines">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#A9C9DA]">Nature Layer</h3>
          <p className="mt-1.5 text-sm text-[#66869B]">Extended natural environment data</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-cyan-400/80">
          <Gauge className="h-4 w-4" strokeWidth={1.8} />
          Open Data
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {futureEngines.map(([id, Icon, label]) => (
          <EngineCard key={id} id={id} Icon={Icon} label={label} result={engines[id]} loading={loading} expanded={expanded} />
        ))}
      </div>
    </section>
  );
}
