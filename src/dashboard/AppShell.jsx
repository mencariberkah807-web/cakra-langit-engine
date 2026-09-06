import { useState } from "react";

import Header from "../cakra-ui/Header";
import NaturalLayer from "../cakra-ui/NaturalLayer";
import SunArc from "../cakra-ui/SunArc";
import CalendarSystems from "../cakra-ui/CalendarSystems";
import MonthCalendar from "../cakra-ui/MonthCalendar";
import ScheduleTimeline from "../cakra-ui/ScheduleTimeline";
import WetonModal from "../cakra-ui/WetonModal";
import Ticker from "../cakra-ui/Ticker";
import Footer from "../cakra-ui/Footer";
import { primaryNav, personalNav } from "../cakra-ui/GlobalShell";

import { useTodayContext } from "../core/TodayContext";
import { getResultsByGroup } from "../core/resultRegistry.js";

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function AuthenticatedSidebar({ user, onLogout }) {
  const currentPath = window.location.pathname;
  const displayName = user?.display_name || user?.email?.split("@")[0] || "Pengguna";
  const initials = displayName.slice(0, 2).toUpperCase();

  const renderItem = ([Icon, label, href]) => {
    const active = href === "/dashboard"
      ? currentPath === href
      : currentPath === href || currentPath.startsWith(`${href}/`);

    return (
      <a
        key={label}
        href={href}
        className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
          active
            ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
            : "text-[#475569] hover:bg-[#F8FAFC]"
        }`}
      >
        <Icon size={16} strokeWidth={1.7} className={active ? "text-[#2563EB]" : "text-[#64748B]"} />
        <span>{label}</span>
      </a>
    );
  };

  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">
      <div className="px-4 py-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">Akun Saya</div>
        <div className="mt-2 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-[10px] font-bold text-white">{initials}</div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-[#0F172A]">{displayName}</div>
            <div className="truncate text-[10px] text-[#64748B]">Personal Almanac</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4">
        {primaryNav.map(renderItem)}
        <div className="my-4 border-t border-[#E2E8F0]" />
        {personalNav.map(renderItem)}
      </nav>

      <div className="border-t border-[#E2E8F0] px-4 py-3">
        <button
          type="button"
          onClick={onLogout}
          className="w-full text-left text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}

export default function AppShell({ authenticatedUser = null, onLogout = null, showFooter = true }) {
  const context = useTodayContext();
  const apiData = context.apiData;
  const [time, setTime] = useState("12:00");
  const [wetonOpen, setWetonOpen] = useState(false);

  const naturalResults = getResultsByGroup("natural", context);
  const calendarResults = getResultsByGroup("calendar", context);

  const sunResult = naturalResults.find((result) => result.id === "sun") || null;
  const sunData = sunResult?.data || sunResult?.value || sunResult || {};
  const sun = {
    ...sunData,
    sunrise: sunData.sunrise ?? null,
    sunset: sunData.sunset ?? null,
    dawn: sunData.dawn ?? null,
    noon: sunData.noon ?? null,
    dusk: sunData.dusk ?? null,
    golden_hour: sunData.golden_hour ?? null,
  };

  const sunEvents = Array.isArray(sunResult?.events) ? sunResult.events : [];
  const schedule = sunEvents.map((event) => ({
    time: event.time,
    title: event.title,
    cat: event.type,
    sub: event.sub || (event.type === "SOLAR" ? "Sun" : "Sky"),
  }));

  const eclipseResult = naturalResults.find((result) => result.id === "eclipse") || null;
  const eclipseData = eclipseResult?.data || eclipseResult?.value || eclipseResult || {};

  const data = {
    ...context,
    ...(apiData || {}),
    location: apiData?.location
      ? {
          ...context.location,
          ...apiData.location,
          timezoneLabel: apiData.location.timezoneLabel || context.location?.timezoneLabel || null,
        }
      : context.location,
    date_info: apiData?.date_info || {
      date_long: context.selectedDate
        ? new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: context.location?.timezone,
          }).format(context.selectedDate)
        : null,
    },
    natural: apiData?.natural || context.natural || {
      sun,
      moon: naturalResults.find((r) => r.id === "moon")?.data || naturalResults.find((r) => r.id === "moon") || null,
      eclipse: naturalResults.find((r) => r.id === "eclipse")?.data || naturalResults.find((r) => r.id === "eclipse") || null,
      sky: naturalResults.find((r) => r.id === "sky")?.data || naturalResults.find((r) => r.id === "sky") || null,
      earth: naturalResults.find((r) => r.id === "earth-space")?.data || naturalResults.find((r) => r.id === "earth-space") || null,
      tide: naturalResults.find((r) => r.id === "tide")?.data || naturalResults.find((r) => r.id === "tide") || null,
    },
    schedule: apiData?.schedule || schedule,
    quick_jumps: apiData?.quick_jumps || {
      today: context.mode === "live" && context.selectedDate ? iso(context.selectedDate) : null,
      next_full_moon: naturalResults.find((result) => result.id === "moon")?.nextFullMoon ?? null,
      next_eclipse: eclipseData.next ?? null,
    },
    calendars: calendarResults
      .filter((result) => result.id !== "gregorian")
      .map((result) => ({
        ...result,
        name: result.name || result.title || result.id,
        headline: result.headline ?? result.primary ?? null,
        sub: result.sub ?? result.secondary ?? null,
        fields: Array.isArray(result.fields)
          ? result.fields
          : Array.isArray(result.details)
            ? result.details.map((field, index) => ({
                k: field.k ?? field.label ?? `Field ${index + 1}`,
                v: field.v ?? field.value ?? null,
              }))
            : [],
        future: Boolean(result.future),
      })),
  };

  const cakraLocations = (context.locations || []).map((item) => ({
    ...item,
    name: item.name || item.city,
    region: item.region || item.province,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      <Header
        data={data}
        locations={cakraLocations}
        city={context.selectedLocation?.id || ""}
        onCityChange={context.setLocationById}
        isToday={context.mode === "live"}
      />

      <div className="flex items-start">
        {authenticatedUser ? <AuthenticatedSidebar user={authenticatedUser} onLogout={onLogout} /> : null}

        <main className="min-w-0 flex-1">
          <div className={authenticatedUser ? "w-full px-4 py-6 sm:px-6 lg:px-8" : "mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8"}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <NaturalLayer data={data} loading={false} />
                <SunArc sun={data.natural.sun} time={time} loading={false} />
                <CalendarSystems data={data} loading={false} onOpenWeton={() => setWetonOpen(true)} />
              </div>

              <div className="flex flex-col gap-6 lg:col-span-4">
                <MonthCalendar
                  dateISO={iso(context.selectedDate)}
                  onSelect={(value) => context.setSelectedDate(new Date(`${value}T12:00:00`))}
                  time={time}
                  onTimeChange={setTime}
                  onJumpToday={context.goLive}
                  quickJumps={data.quick_jumps}
                />
                <ScheduleTimeline data={data} loading={false} time={time} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <WetonModal open={wetonOpen} onOpenChange={setWetonOpen} data={data} />
      <Ticker data={data} />
      {showFooter ? <Footer data={data} /> : null}
    </div>
  );
}
