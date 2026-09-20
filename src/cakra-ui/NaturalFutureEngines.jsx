import { useEffect, useState } from "react";
import {
  Activity,
  Cloud,
  Magnet,
  Mountain,
  Radiation,
  Wind,
  Gauge,
} from "lucide-react";

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

function EngineCard({ id, Icon, label, result, loading }) {
  const available = result?.available;

  return (
    <article
      className="rounded-xl border border-[#244765] bg-[#061827]/70 p-3 transition hover:border-[#356181]"
      data-testid={`future-natural-${id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Icon className="h-4 w-4 text-[#75A2BF]" strokeWidth={1.8} />
        <span
          className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide ${
            loading
              ? "bg-[#10283A] text-[#66839B]"
              : available
                ? "bg-cyan-400/10 text-cyan-300"
                : "bg-amber-400/10 text-amber-300"
          }`}
        >
          {loading ? "Loading" : available ? "Live" : "No data"}
        </span>
      </div>

      <p className="mt-2 text-[10px] font-semibold text-[#B8CDDC]">{label}</p>

      {loading ? (
        <div className="mt-2 h-8 animate-pulse rounded bg-[#0B2234]" />
      ) : (
        <>
          <p className="mt-1 truncate text-[11px] font-semibold text-[#E2F1FA]">
            {result?.primary || "No data"}
          </p>
          <p className="mt-1 truncate text-[9px] text-[#6F8EA4]">
            {result?.secondary || "Provider unavailable"}
          </p>
          <div className="mt-2 grid gap-1">
            {(result?.details || []).slice(0, 2).map((detail) => (
              <div key={detail.label} className="flex min-w-0 justify-between gap-2 text-[8px]">
                <span className="truncate text-[#4F7184]">{detail.label}</span>
                <span className="truncate text-right text-[#7895A8]">{String(detail.value ?? "—")}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}

export default function NaturalFutureEngines({ data, dateISO }) {
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

        const response = await fetch(
          `${API_BASE}/api/natural/future?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Future natural API returned ${response.status}`);
        }
        const payload = await response.json();
        if (!controller.signal.aborted) {
          setEngines(payload.engines || {});
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setEngines({});
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [locationId, city, dateISO]);

  return (
    <section
      className="relative z-10 mt-5 border-t border-[#164263] pt-4"
      data-testid="natural-future-engines"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#91B1C8]">
            Nature Layer · Future Engines
          </h3>
          <p className="mt-1 text-[9px] text-[#587993]">
            Extended natural environment data
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-wide text-cyan-400/70">
          <Gauge className="h-3.5 w-3.5" strokeWidth={1.8} />
          Open Data
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {futureEngines.map(([id, Icon, label]) => (
          <EngineCard
            key={id}
            id={id}
            Icon={Icon}
            label={label}
            result={engines[id]}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}
