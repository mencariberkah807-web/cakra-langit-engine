import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Mountain, Search } from "lucide-react";
import { getIndonesiaProvinces, searchLocations } from "../services/locationService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function LiveClock({ tz }) {
  const [now, setNow] = useState("--:--:--");

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);

  return <>{now}</>;
}

const labelCls =
  "text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]";

function formatLocation(location) {
  if (!location) return "Select location";

  return [
    location.city,
    location.province,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function Header({
  data,
  locations,
  city,
  onCityChange,
  isToday,
}) {
  const loc = data?.location;

  const [locationOpen, setLocationOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [provinceQuery, setProvinceQuery] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    if (!locationOpen || provinces.length > 0) return;

    let cancelled = false;

    getIndonesiaProvinces()
      .then((nextProvinces) => {
        if (cancelled) return;
        setProvinces(nextProvinces);
      })
      .catch(() => {
        if (cancelled) return;
        setProvinces([]);
      });

    return () => {
      cancelled = true;
    };
  }, [locationOpen, provinces.length]);

  useEffect(() => {
    const normalizedCity = cityQuery.trim();
    const normalizedProvince = provinceQuery.trim();

    if (!normalizedCity) {
      setResults([]);
      setSearching(false);
      setSearchError(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(() => {
      setSearching(true);
      setSearchError(false);

      searchLocations(normalizedCity, normalizedProvince, 20)
        .then((nextResults) => {
          if (cancelled) return;
          setResults(nextResults);
        })
        .catch(() => {
          if (cancelled) return;
          setResults([]);
          setSearchError(true);
        })
        .finally(() => {
          if (cancelled) return;
          setSearching(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [cityQuery, provinceQuery]);

  function handleOpenLocation() {
    setCityQuery("");
    setProvinceQuery("");
    setProvinceOpen(false);
    setResults([]);
    setSearchError(false);
    setLocationOpen(true);
  }

  function handleSelectProvince(province) {
    setProvinceQuery(province.city);
    setProvinceOpen(false);
  }

  function handleSelectLocation(location) {
    onCityChange(location.id);
    setLocationOpen(false);
    setCityQuery("");
    setProvinceQuery("");
    setProvinceOpen(false);
    setResults([]);
  }


  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-12 gap-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div
            data-testid="brand-logo"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC]"
          >
            <Mountain
              className="h-6 w-6 text-[#0F172A]"
              strokeWidth={1.5}
            />
          </div>

          <div>
            <p className={labelCls}>Personal Almanac</p>

            <div className="mt-0.5 flex items-center gap-2.5">
              <span className="block overflow-hidden">
                <motion.span
                  data-testid="page-title"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1,
                  }}
                  className="block font-display text-[28px] font-bold leading-8 tracking-[-0.02em]"
                >
                  Explore
                </motion.span>
              </span>

              <span
                data-testid="mode-badge"
                className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#475569]"
              >
                {isToday ? "Live" : "Past"}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#475569]">
              <span
                className="flex items-center gap-1.5"
                data-testid="header-date-line"
              >
                <CalendarDays
                  className="h-3.5 w-3.5"
                  strokeWidth={1.8}
                />
                {data?.date_info ? data.date_info.date_long : "—"}
              </span>

              <span
                className="flex items-center gap-1.5"
                data-testid="header-location-line"
              >
                <MapPin
                  className="h-3.5 w-3.5"
                  strokeWidth={1.8}
                />
                {loc
                  ? formatLocation({
                      city: loc.name,
                      province: loc.region,
                      country: loc.country,
                    })
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-x-12 gap-y-4">
          <div>
            <p className={labelCls}>Selected Time</p>

            <div className="mt-0.5 flex items-center gap-2">
              <span
                data-testid="live-time-badge"
                className="font-mono text-[28px] font-semibold leading-8 tracking-[-0.02em] tabular-nums"
              >
                <LiveClock tz={loc?.tz || "Asia/Jakarta"} />
              </span>

              <span className="rounded-md bg-[#0F172A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                {loc?.tz_label || "WIB"}
              </span>
            </div>

            <p className="mt-1 text-xs text-[#475569]">
              {loc ? `${loc.tz} (${loc.utc})` : "—"}
            </p>
          </div>

          <div className="w-[300px]">
            <p className={labelCls}>Location</p>

            <button
              type="button"
              data-testid="location-field"
              onClick={handleOpenLocation}
              className="mt-1 flex h-10 w-full items-center justify-between rounded-md border border-[#E2E8F0] bg-white px-3 text-left text-sm font-medium shadow-sm transition-colors hover:border-[#CBD5E1] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
            >
              <span className="truncate">
                {loc
                  ? formatLocation({
                      city: loc.name,
                      province: loc.region,
                      country: loc.country,
                    })
                  : "Select location"}
              </span>

              <MapPin
                className="ml-2 h-4 w-4 shrink-0 text-[#64748B]"
                strokeWidth={1.8}
              />
            </button>

            <p className="mt-1 text-xs text-[#475569]">
              {loc?.tz || "—"}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={locationOpen} onOpenChange={setLocationOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Change Location</DialogTitle>
            <DialogDescription>
              Select a city and province in Indonesia.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <label
                htmlFor="location-city-input"
                className="mb-1.5 block text-xs font-semibold text-[#475569]"
              >
                City
              </label>

              <Search className="absolute left-3 top-[2.35rem] h-4 w-4 -translate-y-1/2 text-[#64748B]" />

              <input
                autoFocus
                id="location-city-input"
                value={cityQuery}
                onChange={(event) => setCityQuery(event.target.value)}
                placeholder="Bandung"
                className="h-11 w-full rounded-md border border-[#E2E8F0] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                data-testid="location-city-input"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="location-province-input"
                className="mb-1.5 block text-xs font-semibold text-[#475569]"
              >
                Province
              </label>

              <input
                id="location-province-input"
                value={provinceQuery}
                onFocus={() => setProvinceOpen(true)}
                onChange={(event) => {
                  setProvinceQuery(event.target.value);
                  setProvinceOpen(true);
                }}
                placeholder="Jawa Barat"
                className="h-11 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                data-testid="location-province-input"
              />

              {provinceOpen && provinces.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-md border border-[#E2E8F0] bg-white py-1 shadow-lg">
                  {provinces
                    .filter((province) =>
                      province.city
                        .toLowerCase()
                        .includes(provinceQuery.trim().toLowerCase())
                    )
                    .map((province) => (
                      <button
                        key={province.id}
                        type="button"
                        onClick={() => handleSelectProvince(province)}
                        className="w-full px-3 py-2 text-left text-sm text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                      >
                        {province.city}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto rounded-md border border-[#E2E8F0]">
            {!cityQuery.trim() && (
              <div className="px-4 py-8 text-center text-sm text-[#64748B]">
                Type a city name to search locations.
              </div>
            )}

            {cityQuery.trim() && searching && (
              <div className="px-4 py-8 text-center text-sm text-[#64748B]">
                Searching locations...
              </div>
            )}

            {cityQuery.trim() && !searching && searchError && (
              <div className="px-4 py-8 text-center text-sm text-[#64748B]">
                Unable to search locations.
              </div>
            )}

            {cityQuery.trim() &&
              !searching &&
              !searchError &&
              results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-[#64748B]">
                  No locations found.
                </div>
              )}

            {!searching &&
              !searchError &&
              results.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleSelectLocation(location)}
                  className="flex w-full items-start gap-3 border-b border-[#F1F5F9] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#F8FAFC]"
                  data-testid={`location-result-${location.id}`}
                >
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]"
                    strokeWidth={1.8}
                  />

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#0F172A]">
                      {location.city}
                    </span>

                    <span className="mt-0.5 block truncate text-xs text-[#64748B]">
                      {[location.province, location.country]
                        .filter(Boolean)
                        .join(" — ")}
                    </span>

                    <span className="mt-0.5 block text-[11px] text-[#94A3B8]">
                      {location.timezone}
                    </span>
                  </span>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
