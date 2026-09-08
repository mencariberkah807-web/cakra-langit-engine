import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Mountain, Search } from "lucide-react";
import { getIndonesiaProvinces, searchLocations } from "../services/locationService";
import { useLanguage } from "../core/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function LiveClock({ tz, onHourChange }) {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const date = new Date();
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(date);
      const hour = Number(parts.find((part) => part.type === "hour")?.value);
      if (Number.isFinite(hour)) onHourChange?.(hour);
      setNow(new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(date));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz, onHourChange]);
  return <>{now}</>;
}

const labelCls = "text-[10px] font-bold uppercase tracking-[0.14em] text-[#71869A]";
function formatLocation(location) {
  if (!location) return "Select location";
  return [location.city, location.province, location.country].filter(Boolean).join(", ");
}
function getGreetingKey(hour) {
  if (hour >= 5 && hour < 11) return "Good Morning";
  if (hour >= 11 && hour < 15) return "Good Afternoon";
  if (hour >= 15 && hour < 19) return "Good Evening";
  return "Good Night";
}

export default function Header({ data, locations, city, onCityChange, isToday, user }) {
  const loc = data?.location;
  const { language, setLanguage, t } = useLanguage();
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
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
    getIndonesiaProvinces().then((nextProvinces) => { if (!cancelled) setProvinces(nextProvinces); }).catch(() => { if (!cancelled) setProvinces([]); });
    return () => { cancelled = true; };
  }, [locationOpen, provinces.length]);

  useEffect(() => {
    const normalizedCity = cityQuery.trim();
    const normalizedProvince = provinceQuery.trim();
    if (!normalizedCity) { setResults([]); setSearching(false); setSearchError(false); return; }
    let cancelled = false;
    const timer = setTimeout(() => {
      setSearching(true); setSearchError(false);
      searchLocations(normalizedCity, normalizedProvince, 20).then((nextResults) => { if (!cancelled) setResults(nextResults); }).catch(() => { if (!cancelled) { setResults([]); setSearchError(true); } }).finally(() => { if (!cancelled) setSearching(false); });
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [cityQuery, provinceQuery]);

  function handleOpenLocation() { setCityQuery(""); setProvinceQuery(""); setProvinceOpen(false); setResults([]); setSearchError(false); setLocationOpen(true); }
  function handleSelectProvince(province) { setProvinceQuery(province.city); setProvinceOpen(false); }
  function handleSelectLocation(location) { onCityChange(location.id); setLocationOpen(false); setCityQuery(""); setProvinceQuery(""); setProvinceOpen(false); setResults([]); }

  const displayName = user?.display_name || user?.displayName || user?.name || user?.email?.split("@")[0] || "there";
  const greetingKey = getGreetingKey(currentHour);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#07111C]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-10 gap-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div data-testid="brand-logo" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#0D2535] shadow-[0_0_24px_rgba(34,211,238,0.08)]"><Mountain className="h-5 w-5 text-[#22D3EE]" strokeWidth={1.5} /></div>
          <div className="min-w-0">
            <p className={labelCls}>{t("Personal Almanac")}</p>
            <div className="mt-0.5 overflow-hidden">
              <motion.div data-testid="page-title" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} className="font-display text-[25px] font-bold leading-8 tracking-[-0.02em] text-white">
                {t(greetingKey)}, {displayName}
              </motion.div>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8FA4B8]">
              <span className="flex items-center gap-1.5" data-testid="header-date-line"><CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />{data?.date_info ? data.date_info.date_long : "—"}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-8 gap-y-4">
          <div className="min-w-[170px]"><p className={labelCls}>{t("Selected Time")}</p><div className="mt-0.5 flex items-center gap-2"><span data-testid="live-time-badge" className="font-mono text-[26px] font-semibold leading-8 tracking-[-0.02em] tabular-nums text-white"><LiveClock tz={loc?.tz || "Asia/Jakarta"} onHourChange={setCurrentHour} /></span><span className="rounded-md border border-cyan-300/15 bg-[#0D2535] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#22D3EE]">{loc?.tz_label || "WIB"}</span></div><p className="mt-1 text-xs text-[#71869A]">{loc ? `${loc.tz} (${loc.utc})` : "—"}</p></div>
          <div className="w-[280px]"><p className={labelCls}>{t("Location")}</p><button type="button" data-testid="location-field" onClick={handleOpenLocation} className="mt-1 flex h-10 w-full items-center justify-between rounded-xl border border-white/[0.09] bg-white/[0.04] px-3 text-left text-sm font-medium text-[#D8E3EC] transition-colors hover:border-cyan-300/20 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/30"><span className="truncate">{loc ? formatLocation({ city: loc.name, province: loc.region, country: loc.country }) : t("Select location")}</span><MapPin className="ml-2 h-4 w-4 shrink-0 text-[#71869A]" strokeWidth={1.8} /></button></div>
          <div className="flex h-10 shrink-0 items-center rounded-xl border border-white/[0.09] bg-white/[0.04] p-1" aria-label="Language"><button type="button" onClick={() => setLanguage("id")} className={`h-8 min-w-[68px] rounded-lg px-3 text-center text-[10px] font-bold transition-colors ${language === "id" ? "bg-[#12324A] text-[#22D3EE]" : "text-[#71869A] hover:bg-white/[0.05] hover:text-white"}`}>Indonesia</button><button type="button" onClick={() => setLanguage("en")} className={`h-8 min-w-[68px] rounded-lg px-3 text-center text-[10px] font-bold transition-colors ${language === "en" ? "bg-[#12324A] text-[#22D3EE]" : "text-[#71869A] hover:bg-white/[0.05] hover:text-white"}`}>English</button></div>
        </div>
      </div>
      <Dialog open={locationOpen} onOpenChange={setLocationOpen}><DialogContent className="max-w-xl border-white/[0.10] bg-[#0B1825] text-white"><DialogHeader><DialogTitle className="text-white">{t("Change Location")}</DialogTitle><DialogDescription className="text-[#8FA4B8]">{t("Select a city and province in Indonesia.")}</DialogDescription></DialogHeader><div className="grid gap-3 sm:grid-cols-2"><div className="relative"><label htmlFor="location-city-input" className="mb-1.5 block text-xs font-semibold text-[#AFC0CF]">{t("City")}</label><Search className="absolute left-3 top-[2.35rem] h-4 w-4 -translate-y-1/2 text-[#71869A]" /><input autoFocus id="location-city-input" value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Bandung" className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] pl-10 pr-3 text-sm text-white placeholder:text-[#536A7D] outline-none transition focus:border-[#22D3EE]/40 focus:ring-2 focus:ring-[#22D3EE]/10" data-testid="location-city-input" /></div><div className="relative"><label htmlFor="location-province-input" className="mb-1.5 block text-xs font-semibold text-[#AFC0CF]">{t("Province")}</label><input id="location-province-input" value={provinceQuery} onFocus={() => setProvinceOpen(true)} onChange={(event) => { setProvinceQuery(event.target.value); setProvinceOpen(true); }} placeholder="Jawa Barat" className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white placeholder:text-[#536A7D] outline-none transition focus:border-[#22D3EE]/40 focus:ring-2 focus:ring-[#22D3EE]/10" data-testid="location-province-input" />{provinceOpen && provinces.length > 0 && <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-white/[0.10] bg-[#0B1825] py-1 shadow-2xl">{provinces.filter((province) => province.city.toLowerCase().includes(provinceQuery.trim().toLowerCase())).map((province) => <button key={province.id} type="button" onClick={() => handleSelectProvince(province)} className="w-full px-3 py-2 text-left text-sm text-[#D8E3EC] transition-colors hover:bg-white/[0.06]">{province.city}</button>)}</div>}</div></div><div className="max-h-[420px] overflow-y-auto rounded-xl border border-white/[0.10]">{!cityQuery.trim() && <div className="px-4 py-8 text-center text-sm text-[#71869A]">{t("Type a city name to search locations.")}</div>}{cityQuery.trim() && searching && <div className="px-4 py-8 text-center text-sm text-[#71869A]">{t("Searching")}</div>}{cityQuery.trim() && !searching && searchError && <div className="px-4 py-8 text-center text-sm text-[#71869A]">{t("Unable to search locations.")}</div>}{cityQuery.trim() && !searching && !searchError && results.length === 0 && <div className="px-4 py-8 text-center text-sm text-[#71869A]">{t("No locations found.")}</div>}{!searching && !searchError && results.map((location) => <button key={location.id} type="button" onClick={() => handleSelectLocation(location)} className="flex w-full items-start gap-3 border-b border-white/[0.06] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.05]" data-testid={`location-result-${location.id}`}><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#71869A]" strokeWidth={1.8} /><span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#D8E3EC]">{location.city}</span><span className="mt-0.5 block truncate text-xs text-[#8FA4B8]">{[location.province, location.country].filter(Boolean).join(" — ")}</span><span className="mt-0.5 block text-[11px] text-[#536A7D]">{location.timezone}</span></span></button>)}</div></DialogContent></Dialog>
    </header>
  );
}
