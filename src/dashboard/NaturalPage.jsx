import { useEffect, useState } from "react";
import { MapPin, CalendarDays, Clock3, Waves, Sun, Moon, CloudSun, Orbit, Eye, Search } from "lucide-react";
import { useTodayContext } from "../core/TodayContext";
import NaturalLayer from "../cakra-ui/NaturalLayer";
import NaturalFutureEngines from "../cakra-ui/NaturalFutureEngines";
import { getIndonesiaProvinces, searchLocations } from "../services/locationService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function isoLocal(date, timezone) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone || "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDate(date, timezone) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: timezone || "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}


function LocationPicker({ context, location }) {
  const [open, setOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [provinceQuery, setProvinceQuery] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    if (!open || provinces.length) return undefined;
    let cancelled = false;
    getIndonesiaProvinces()
      .then((items) => { if (!cancelled) setProvinces(items); })
      .catch(() => { if (!cancelled) setProvinces([]); });
    return () => { cancelled = true; };
  }, [open, provinces.length]);

  useEffect(() => {
    const city = cityQuery.trim();
    const province = provinceQuery.trim();
    if (!city) {
      setResults([]);
      setSearching(false);
      setSearchError(false);
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      setSearching(true);
      setSearchError(false);
      searchLocations(city, province, 20)
        .then((items) => { if (!cancelled) setResults(items); })
        .catch(() => { if (!cancelled) { setResults([]); setSearchError(true); } })
        .finally(() => { if (!cancelled) setSearching(false); });
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [cityQuery, provinceQuery]);

  function openPicker() {
    setCityQuery("");
    setProvinceQuery("");
    setProvinceOpen(false);
    setResults([]);
    setSearchError(false);
    setOpen(true);
  }

  async function selectLocation(nextLocation) {
    try {
      await context.setLocationById(nextLocation);
      setOpen(false);
      setCityQuery("");
      setProvinceQuery("");
      setProvinceOpen(false);
      setResults([]);
    } catch {
      setSearchError(true);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        className="flex min-w-[190px] items-center gap-2 rounded-xl border border-[#24506A] bg-[#0A1B29] px-3 py-2.5 text-left transition hover:border-cyan-300/30 hover:bg-[#0D2434] focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
        data-testid="natural-location-field"
      >
        <MapPin className="h-4 w-4 shrink-0 text-[#22D3EE]" strokeWidth={1.8} />
        <span className="min-w-0">
          <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8EA4]">Location</span>
          <span className="mt-0.5 block truncate text-xs font-semibold text-[#D8EAF3]">{location?.city || location?.name || "Select location"}</span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-xl border-white/[0.10] bg-[#0B1825] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Change Location</DialogTitle>
            <DialogDescription className="text-[#8FA4B8]">Select a city and province in Indonesia.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <label htmlFor="natural-location-city" className="mb-1.5 block text-xs font-semibold text-[#AFC0CF]">City</label>
              <Search className="absolute left-3 top-[2.35rem] h-4 w-4 -translate-y-1/2 text-[#71869A]" />
              <input
                autoFocus
                id="natural-location-city"
                value={cityQuery}
                onChange={(event) => setCityQuery(event.target.value)}
                placeholder="Bandung"
                className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] pl-10 pr-3 text-sm text-white placeholder:text-[#536A7D] outline-none focus:border-[#22D3EE]/40 focus:ring-2 focus:ring-[#22D3EE]/10"
                data-testid="natural-location-city-input"
              />
            </div>

            <div className="relative">
              <label htmlFor="natural-location-province" className="mb-1.5 block text-xs font-semibold text-[#AFC0CF]">Province</label>
              <input
                id="natural-location-province"
                value={provinceQuery}
                onFocus={() => setProvinceOpen(true)}
                onChange={(event) => { setProvinceQuery(event.target.value); setProvinceOpen(true); }}
                placeholder="Jawa Barat"
                className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white placeholder:text-[#536A7D] outline-none focus:border-[#22D3EE]/40 focus:ring-2 focus:ring-[#22D3EE]/10"
                data-testid="natural-location-province-input"
              />
              {provinceOpen && provinces.length > 0 ? (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-white/[0.10] bg-[#0B1825] py-1 shadow-2xl">
                  {provinces
                    .filter((province) => province.city.toLowerCase().includes(provinceQuery.trim().toLowerCase()))
                    .map((province) => (
                      <button key={province.id} type="button" onClick={() => { setProvinceQuery(province.city); setProvinceOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-[#D8E3EC] hover:bg-white/[0.06]">
                        {province.city}
                      </button>
                    ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto rounded-xl border border-white/[0.10]">
            {!cityQuery.trim() ? (
              <div className="px-4 py-8 text-center text-sm text-[#71869A]">Type a city name to search locations.</div>
            ) : searching ? (
              <div className="px-4 py-8 text-center text-sm text-[#71869A]">Searching...</div>
            ) : searchError ? (
              <div className="px-4 py-8 text-center text-sm text-[#71869A]">Unable to search locations.</div>
            ) : results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#71869A]">No locations found.</div>
            ) : (
              results.map((item) => (
                <button key={item.id} type="button" onClick={() => selectLocation(item)} className="flex w-full items-start gap-3 border-b border-white/[0.06] px-4 py-3 text-left last:border-b-0 hover:bg-white/[0.05]" data-testid={`natural-location-result-${item.id}`}>
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" strokeWidth={1.8} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#D8E3EC]">{item.city}</span>
                    <span className="mt-0.5 block truncate text-xs text-[#8FA4B8]">{[item.province, item.country].filter(Boolean).join(" — ")}</span>
                    <span className="mt-0.5 block text-[11px] text-[#536A7D]">{item.timezone}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailCard({ icon: Icon, title, primary, secondary, rows = [], tone = "blue" }) {
  return (
    <article className={`rounded-[18px] border p-5 shadow-[0_12px_38px_rgba(0,0,0,.18)] ${tone === "gold" ? "border-[#80641E] bg-[linear-gradient(145deg,rgba(82,61,15,.24),rgba(8,24,39,.96))]" : tone === "green" ? "border-[#27685E] bg-[linear-gradient(145deg,rgba(10,72,64,.22),rgba(8,24,39,.96))]" : tone === "violet" ? "border-[#554B86] bg-[linear-gradient(145deg,rgba(63,50,112,.22),rgba(8,24,39,.96))]" : "border-[#275775] bg-[linear-gradient(145deg,rgba(10,48,69,.28),rgba(8,24,39,.96))]"}`}>
      <div className="flex items-center gap-2 border-b border-[#24465C] pb-3">
        <Icon className={`h-5 w-5 ${tone === "gold" ? "text-[#F4C84A]" : tone === "green" ? "text-[#4FD1B5]" : tone === "violet" ? "text-[#B8A8FF]" : "text-[#58C7E8]"}`} strokeWidth={1.8} />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#B8D5E5]">{title}</h3>
      </div>
      <p className="mt-4 text-xl font-semibold leading-tight text-[#F0FAFF]">{primary || "—"}</p>
      {secondary ? <p className="mt-1.5 text-xs text-[#7FA1B8]">{secondary}</p> : null}
      {rows.length ? (
        <div className="mt-4 grid gap-2.5 border-t border-[#24465C] pt-4">
          {rows.map(([label, value]) => (
            <div key={label} className="flex min-w-0 justify-between gap-4 text-[11px]">
              <span className="text-[#66899E]">{label}</span>
              <span className="text-right font-mono font-medium text-[#B4CEDB]">{String(value ?? "—")}</span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function NaturalPage() {
  const context = useTodayContext();
  const data = context.apiData || {};
  const natural = data.natural || {};
  const location = data.location || context.location || {};
  const timezone = location.timezone || context.location?.timezone || "Asia/Jakarta";
  const date = context.selectedDate || new Date();
  const dateISO = isoLocal(date, timezone);
  const sun = natural.sun || {};
  const moon = natural.moon || {};
  const sky = natural.sky || {};
  const earth = natural.earth || {};
  const eclipse = natural.eclipse || {};
  const tide = natural.tide || {};
  const ocean = tide.ocean || {};
  const schedule = Array.isArray(data.schedule) ? data.schedule : [];

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#07111C] text-white">
      <section className="border-b border-[#18364A] bg-[radial-gradient(circle_at_15%_0%,rgba(14,165,233,.10),transparent_34%),#081521] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#527D95]">Cakra Langit · Natural Layer</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#DDF5FF] sm:text-3xl">Natural Environment</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#7191A5]">
                Satu halaman observasi lengkap untuk posisi matahari, bulan, langit, Earth Space, gerhana, pasang-surut,
                kondisi laut, dan data lingkungan terbuka.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[9px] sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl border border-[#1B3A50] bg-[#0A1B29] px-3 py-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#78A9C4]" />
                <LocationPicker context={context} location={location} />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#1B3A50] bg-[#0A1B29] px-3 py-2.5">
                <CalendarDays className="h-3.5 w-3.5 text-[#78A9C4]" />
                <span className="text-[#9AB3C3]">{formatDate(date, timezone)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <NaturalLayer data={data} loading={!context.apiData} expanded />

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#62A5C7]">Natural data</p>
                <h2 className="mt-1 text-xl font-semibold text-[#E4F7FF]">Complete observation details</h2>
              </div>
              <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#66899E] sm:flex">
                <Clock3 className="h-3.5 w-3.5" />
                {timezone}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <DetailCard tone="gold" icon={Sun} title="Sun" primary={sun.status || (String(sun.altitude ?? "—") + "° altitude")} secondary={"Azimuth " + (sun.azimuth ?? "—") + "°"} rows={[["Dawn", sun.dawn], ["Sunrise", sun.sunrise], ["Noon", sun.noon], ["Sunset", sun.sunset], ["Dusk", sun.dusk], ["Golden hour", sun.golden_hour]]} />
              <DetailCard tone="blue" icon={Moon} title="Moon" primary={moon.phase} secondary={(moon.illumination ?? "—") + "% illumination"} rows={[["Age", moon.age], ["Azimuth", moon.azimuth], ["Altitude", moon.altitude], ["Moonrise", moon.rise], ["Moonset", moon.set], ["Next full moon", moon.next_full_moon]]} />
              <DetailCard tone="blue" icon={CloudSun} title="Sky" primary={sky.context} secondary={sky.bortle} rows={Object.entries(sky).filter(([key]) => !["context", "bortle", "primary", "secondary", "title"].includes(key)).slice(0, 6)} />
              <DetailCard tone="green" icon={Orbit} title="Earth Space" primary={earth.primary || earth.context || "Natural context"} secondary={earth.secondary} rows={Object.entries(earth).filter(([key]) => !["primary", "secondary", "title"].includes(key)).slice(0, 6)} />
              <DetailCard tone="blue" icon={Waves} title="Tide · Ocean" primary={tide.available === false ? "Tide model unavailable" : tide.status || tide.location || "—"} secondary={tide.reason || (ocean.available === false ? "No marine data" : ocean.secondary)} rows={[["High tide", Array.isArray(tide.high) && tide.high.length ? tide.high.join(", ") : "—"], ["Low tide", Array.isArray(tide.low) && tide.low.length ? tide.low.join(", ") : "—"], ["Marine", ocean.available === false ? "No marine data" : ocean.primary], ["Marine source", ocean.source]]} />
              <DetailCard tone="violet" icon={Eye} title="Eclipse" primary={eclipse.today?.name || "No eclipse today"} secondary={eclipse.today?.type || eclipse.next?.name || "No active eclipse event"} rows={[["Visibility", eclipse.today?.visibilityRegion], ["Next", eclipse.next?.date || eclipse.next?.name]]} />
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#527D95]">Natural timeline</p>
              <h2 className="mt-1 text-lg font-semibold text-[#D8F3FF]">Events for the selected date</h2>
            </div>
            <div className="rounded-[18px] border border-[#213D52] bg-[#081827]/90 p-4">
              {schedule.length ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {schedule.map((event, index) => (
                    <div key={(event.time || "event") + "-" + index} className="flex items-start gap-3 rounded-xl border border-[#18364A] bg-[#0A1B29] px-3 py-3">
                      <span className="font-mono text-[10px] font-semibold text-[#8FB7CC]">{event.time || "—"}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-[#D8EDF7]">{event.title || "Event"}</p>
                        <p className="mt-1 text-[8px] uppercase tracking-[0.1em] text-[#527D95]">{event.sub || event.cat || "Natural"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-[#587993]">No natural events available for this date.</p>}
            </div>
          </section>

          <NaturalFutureEngines data={data} dateISO={dateISO} expanded />
        </div>
      </section>
    </main>
  );
}
