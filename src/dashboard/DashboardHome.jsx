import { useEffect, useMemo, useState } from "react";

import Header from "../cakra-ui/Header";
import WetonModal from "../cakra-ui/WetonModal";
import Ticker from "../cakra-ui/Ticker";
import Footer from "../cakra-ui/Footer";
import AppContent from "./AppContent";

import { useTodayContext } from "../core/TodayContext";
import { useLanguage } from "../core/LanguageContext";
import { getResultsByGroup } from "../core/resultRegistry.js";
import { adaptSun } from "../adapters/sun.adapter.js";

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function formatCountdown(target) {
  if (!target) return null;
  const delta = new Date(target).getTime() - Date.now();
  if (delta <= 0) return "Completed";
  const totalSeconds = Math.floor(delta / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days ? `${days}d ` : ""}${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function EclipseCountdown({ totalityAt }) {
  const [value, setValue] = useState(() => formatCountdown(totalityAt));
  useEffect(() => {
    if (!totalityAt) return undefined;
    const update = () => setValue(formatCountdown(totalityAt));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [totalityAt]);
  return <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{value || "No countdown available"}</p>;
}

export default function DashboardHome({ showFooter = true }) {
  const context = useTodayContext();
  const { language, setLanguage, t } = useLanguage();
  const apiData = context.apiData;
  const [wetonOpen, setWetonOpen] = useState(false);
  const [eclipseOpen, setEclipseOpen] = useState(false);

  const naturalResults = getResultsByGroup("natural", context);
  const calendarResults = getResultsByGroup("calendar", context);
  const sunResult = naturalResults.find((result) => result.id === "sun") || null;
  const moonResult = naturalResults.find((result) => result.id === "moon") || null;
  const selectedSun = useMemo(() => adaptSun({ ...context, sunTime: context.selectedTime, time: { ...context.time, instant: context.selectedDate } }), [context, context.selectedTime, context.selectedDate, sunResult]);
  const sunData = selectedSun?.data || selectedSun?.value || selectedSun || {};
  const sun = { ...sunData, sunrise: sunData.sunrise ?? null, sunset: sunData.sunset ?? null, dawn: sunData.dawn ?? null, noon: sunData.noon ?? null, dusk: sunData.dusk ?? null, golden_hour: sunData.golden_hour ?? null, altitude: sunData.altitude ?? null, selectedTime: sunData.selectedTime ?? context.selectedTime };
  const sunEvents = Array.isArray(selectedSun?.events) ? selectedSun.events : [];
  const schedule = sunEvents.map((event) => ({ time: event.time, title: event.title, cat: event.type, sub: event.sub || (event.type === "SOLAR" ? "Sun" : "Sky") }));
  const eclipseResult = naturalResults.find((result) => result.id === "eclipse") || null;
  const eclipseData = eclipseResult?.data || eclipseResult?.value || eclipseResult || {};
  const moonData = moonResult?.data || moonResult?.value || moonResult || {};
  const ticker = Array.isArray(apiData?.ticker)
    ? apiData.ticker.map((item) =>
        typeof item === "string" && item.toLowerCase().startsWith("moon ")
          ? `Moon ${moonData.phase ?? "—"} · ${moonData.illumination ?? "—"}%`
          : item
      )
    : [];

  const data = {
    ...context,
    ...(apiData || {}),
    location: apiData?.location ? { ...context.location, ...apiData.location, timezoneLabel: apiData.location.timezoneLabel || context.location?.timezoneLabel || null } : context.location,
    date_info: apiData?.date_info || { date_long: context.selectedDate ? new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: context.location?.timezone }).format(context.selectedDate) : null },
    natural: { ...(apiData?.natural || context.natural || {}), sun, moon: moonResult?.data || moonResult || null, eclipse: naturalResults.find((r) => r.id === "eclipse")?.data || naturalResults.find((r) => r.id === "eclipse") || null, sky: naturalResults.find((r) => r.id === "sky")?.data || naturalResults.find((r) => r.id === "sky") || null, earth: naturalResults.find((r) => r.id === "earth-space")?.data || naturalResults.find((r) => r.id === "earth-space") || null, tide: naturalResults.find((r) => r.id === "tide")?.data || naturalResults.find((r) => r.id === "tide") || null },
    schedule: apiData?.schedule || schedule,
    quick_jumps: apiData?.quick_jumps || { today: context.mode === "live" && context.selectedDate ? iso(context.selectedDate) : null, next_full_moon: moonResult?.nextFullMoon ?? null, next_eclipse: eclipseData.next ?? null },
    calendars: calendarResults.filter((result) => result.id !== "gregorian").map((result) => ({ ...result, name: result.name || result.title || result.id, headline: result.headline ?? result.primary ?? null, sub: result.sub ?? result.secondary ?? null, fields: Array.isArray(result.fields) ? result.fields : Array.isArray(result.details) ? result.details.map((field, index) => ({ k: field.k ?? field.label ?? `Field ${index + 1}`, v: field.v ?? field.value ?? null })) : [], future: Boolean(result.future) })),
    ticker,
  };

  const cakraLocations = (context.locations || []).map((item) => ({ ...item, name: item.name || item.city, region: item.region || item.province }));
  const eclipse = data.natural.eclipse || {};
  const eclipseEvent = eclipse.today || null;
  const totalityAt = eclipseEvent?.totality?.at || null;
  const isNight = Number.isFinite(Number(sun.altitude)) ? Number(sun.altitude) < 0 : false;

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-700 ${isNight ? "bg-[#0F172A] text-[#0F172A]" : "bg-[#F8FAFC] text-[#0F172A]"}`} data-cakra-mode={isNight ? "night" : "day"}>
      <div className="fixed right-4 top-3 z-50 flex w-[150px] items-center gap-1 rounded-md border border-[#E2E8F0] bg-white/95 p-1 shadow-sm backdrop-blur">
        <button type="button" onClick={() => setLanguage("id")} className={`flex-1 rounded px-2 py-1 text-center text-[10px] font-bold ${language === "id" ? "bg-[#0F172A] text-white" : "text-[#475569]"}`}>Indonesia</button>
        <button type="button" onClick={() => setLanguage("en")} className={`flex-1 rounded px-2 py-1 text-center text-[10px] font-bold ${language === "en" ? "bg-[#0F172A] text-white" : "text-[#475569]"}`}>English</button>
      </div>
      <Header data={data} locations={cakraLocations} city={context.selectedLocation?.id || ""} onCityChange={context.setLocationById} isToday={context.mode === "live"} />
      <main className="min-w-0 flex-1">
        <AppContent data={data} dateISO={iso(context.selectedDate)} onSelectDate={(value) => context.setSelectedDate(new Date(`${value}T12:00:00`))} time={context.selectedTime.slice(0, 5)} onTimeChange={context.setSelectedTime} onJumpToday={context.goLive} quickJumps={data.quick_jumps} onOpenWeton={() => setWetonOpen(true)} onOpenEclipse={() => setEclipseOpen(true)} />
      </main>
      <WetonModal open={wetonOpen} onOpenChange={setWetonOpen} data={data} />
      {eclipseOpen ? <div className="fixed inset-0 z-50" aria-label={t("Eclipse Detail")}><button type="button" aria-label={t("Close")} className="absolute inset-0 bg-black/20" onClick={() => setEclipseOpen(false)} /><aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-[#E2E8F0] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7C3AED]">{t("Eclipse Detail")}</p><h2 className="mt-2 text-xl font-semibold">{eclipseEvent?.name || t("No eclipse today")}</h2></div><button type="button" onClick={() => setEclipseOpen(false)} className="rounded-md border border-[#E2E8F0] px-3 py-1.5 text-sm text-[#475569]">{t("Close")}</button></div>{eclipseEvent ? <div className="mt-6 space-y-4 text-sm"><div className="rounded-lg border border-[#E2E8F0] p-4"><span className="text-[#64748B]">{t("Type")}</span><p className="mt-1 font-semibold">{eclipseEvent.type}</p></div><div className="rounded-lg border border-[#E2E8F0] p-4"><span className="text-[#64748B]">{t("Visibility region")}</span><p className="mt-1 font-semibold">{eclipseEvent.visibilityRegion || "—"}</p></div><div className="rounded-lg border border-[#E2E8F0] p-4"><span className="text-[#64748B]">{t("Selected location")}</span><p className="mt-1 font-semibold">{eclipseEvent.visibility?.Indonesia ? t("Visible from Indonesia") : t("Not visible from Indonesia")}</p></div><div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4"><span className="text-[#64748B]">{t("Countdown to totality")}</span>{totalityAt ? <EclipseCountdown totalityAt={totalityAt} /> : <p className="mt-1 font-mono text-lg font-semibold">{eclipseEvent.totality?.label || "—"}</p>}</div></div> : <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-[#475569]">{t("There is no eclipse event on the selected date.")}</div>}</aside></div> : null}
      <Ticker data={data} />
      {showFooter ? <Footer data={data} /> : null}
    </div>
  );
}
