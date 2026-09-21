import { useEffect, useMemo, useState } from "react";

import Header from "../cakra-ui/Header";
import Ticker from "../cakra-ui/Ticker";
import Footer from "../cakra-ui/Footer";
import AppContent from "./AppContent";

import { useTodayContext } from "../core/TodayContext";
import { useLanguage } from "../core/LanguageContext";
import { buildDashboardData } from "./dashboardData.js";

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

export default function DashboardHome({ showFooter = true, user }) {
  const context = useTodayContext();
  const { language, t } = useLanguage();
  const apiData = context.apiData;
  const [eclipseOpen, setEclipseOpen] = useState(false);

  const data = buildDashboardData(context, language);

  const cakraLocations = (context.locations || []).map((item) => ({ ...item, name: item.name || item.city, region: item.region || item.province }));
  const eclipse = data.natural.eclipse || {};
  const eclipseEvent = eclipse.today || null;
  const totalityAt = eclipseEvent?.totality?.at || null;
  const isNight = Number.isFinite(Number(sun.altitude)) ? Number(sun.altitude) < 0 : false;

  return (
    <div className="min-h-screen bg-[#07111C] font-sans antialiased text-white transition-colors duration-700" data-cakra-mode={isNight ? "night" : "day"}>
      <Header data={data} locations={cakraLocations} city={context.selectedLocation?.id || ""} onCityChange={context.setLocationById} isToday={context.mode === "live"} user={user} />
      <main className="min-w-0 flex-1">
        <AppContent data={data} dateISO={iso(context.selectedDate)} onSelectDate={(value) => context.setSelectedDate(new Date(`${value}T12:00:00`))} time={context.selectedTime.slice(0, 5)} onTimeChange={context.setSelectedTime} onJumpToday={context.goLive} quickJumps={data.quick_jumps} onOpenEclipse={() => setEclipseOpen(true)} />
      </main>
      {eclipseOpen ? <div className="fixed inset-0 z-50" aria-label={t("Eclipse Detail")}><button type="button" aria-label={t("Close")} className="absolute inset-0 bg-black/20" onClick={() => setEclipseOpen(false)} /><aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-[#E2E8F0] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7C3AED]">{t("Eclipse Detail")}</p><h2 className="mt-2 text-xl font-semibold">{eclipseEvent?.name || t("No eclipse today")}</h2></div><button type="button" onClick={() => setEclipseOpen(false)} className="rounded-md border border-[#E2E8F0] px-3 py-1.5 text-sm text-[#475569]">{t("Close")}</button></div>{eclipseEvent ? <div className="mt-6 space-y-4 text-sm"><div className="rounded-lg border border-[#E2E8F0] p-4"><span className="text-[#64748B]">{t("Type")}</span><p className="mt-1 font-semibold">{eclipseEvent.type}</p></div><div className="rounded-lg border border-[#E2E8F0] p-4"><span className="text-[#64748B]">{t("Visibility region")}</span><p className="mt-1 font-semibold">{eclipseEvent.visibilityRegion || "—"}</p></div><div className="rounded-lg border border-[#E2E8F0] p-4"><span className="text-[#64748B]">{t("Selected location")}</span><p className="mt-1 font-semibold">{eclipseEvent.visibility?.Indonesia ? t("Visible from Indonesia") : t("Not visible from Indonesia")}</p></div><div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4"><span className="text-[#64748B]">{t("Countdown to totality")}</span>{totalityAt ? <EclipseCountdown totalityAt={totalityAt} /> : <p className="mt-1 font-mono text-lg font-semibold">{eclipseEvent.totality?.label || "—"}</p>}</div></div> : <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-[#475569]">{t("There is no eclipse event on the selected date.")}</div>}</aside></div> : null}
      <Ticker data={data} />
      {showFooter ? <Footer data={data} /> : null}
    </div>
  );
}
