import { motion } from "framer-motion";
import { Eclipse, Moon, Sun } from "lucide-react";
import SunArc from "./SunArc";
import { useLanguage } from "../core/LanguageContext";

const formatTime = (value, withSeconds = false) => {
  if (!value) return "—";
  const text = String(value);
  return withSeconds ? text.slice(0, 8) : text.slice(0, 5);
};

const formatCoordinate = (value, positive, negative) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return `${Math.abs(number).toFixed(4)}° ${number >= 0 ? positive : negative}`;
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function NaturalLayer({ data, loading, onOpenEclipse }) {
  const { t } = useLanguage();
  const sun = data?.natural?.sun || {};
  const moon = data?.natural?.moon || {};
  const eclipse = data?.natural?.eclipse || {};
  const eclipseToday = eclipse?.today || null;
  const location = data?.location || {};
  const activeTime = data?.selectedTime || data?.time?.local || "—";
  const dateLabel = data?.date_info?.date_long || data?.date_info?.date || "—";
  const city = location.name || location.city || "—";
  const region = location.region || location.province || location.country || "";
  const timezoneLabel = location.timezoneLabel || "Local time";
  const timezone = location.timezone || "";

  const sunEvents = [
    ["FAJAR", sun.dawn],
    ["TERBIT", sun.sunrise],
    ["KULMINASI", sun.noon],
    ["SURUP", sun.sunset],
    ["SENJA", sun.dusk],
  ].filter(([, value]) => value);

  const moonEvents = [
    ["MOONRISE", moon.rise],
    ["TRANSIT", moon.transit],
    ["MOONSET", moon.set],
  ].filter(([, value]) => value);

  return (
    <motion.section
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-[28px] border border-[#164C69] bg-[#020B14] shadow-[0_28px_90px_rgba(1,9,20,0.55)]"
      data-testid="natural-layer-section"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(14,165,233,0.09),transparent_28%),radial-gradient(circle_at_78%_10%,rgba(59,130,246,0.09),transparent_32%),linear-gradient(180deg,#061523_0%,#020A12_72%,#020811_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(89,142,171,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(89,142,171,0.055)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10 px-5 pt-5 sm:px-7 sm:pt-6 lg:px-9 lg:pt-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-[0.08em] text-[#9FEFFF] drop-shadow-[0_0_16px_rgba(103,232,249,0.3)] sm:text-2xl lg:text-[27px]">
              Cakra Langit Sky Workspace
            </h2>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#4D809D] sm:text-[10px]">
              {dateLabel}
            </p>
          </div>
          <div className="flex items-center gap-2 text-right">
            {eclipseToday && onOpenEclipse ? (
              <button
                type="button"
                onClick={onOpenEclipse}
                className="hidden items-center gap-1.5 rounded-full border border-[#4E4774] bg-[#0A1020]/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#C4B5FD] transition hover:border-[#8176B7] sm:inline-flex"
                data-testid="natural-card-eclipse"
              >
                <Eclipse className="h-3.5 w-3.5" strokeWidth={1.8} />
                Eclipse
              </button>
            ) : null}
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7AB2CC]">
              <span className="h-2 w-2 rounded-full bg-[#67E8A5] shadow-[0_0_12px_rgba(103,232,165,.75)]" />
              Live observation
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-3 mt-4 overflow-hidden rounded-[22px] border border-[#174D6A] bg-[#020A12] sm:mx-5 lg:mx-7" aria-label="Celestial sky workspace">
        <div className="absolute inset-x-0 top-0 z-20 flex justify-between px-4 pt-3 text-[8px] font-bold uppercase tracking-[0.18em] text-[#416D86] sm:px-6 sm:text-[9px]">
          <span>Polar sky / true azimuth &amp; altitude</span>
          <span>{timezoneLabel}{timezone ? ` · ${timezone}` : ""}</span>
        </div>
        {loading || !data ? (
          <div className="h-[520px] animate-pulse bg-[#061A2A]/60 sm:h-[600px] lg:h-[650px]" />
        ) : (
          <div className="relative h-[520px] sm:h-[600px] lg:h-[650px]">
            <SunArc sun={sun} moon={moon} time={activeTime} loading={false} embedded />
          </div>
        )}
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-3 px-3 pb-3 pt-3 sm:px-5 sm:pb-5 lg:grid-cols-2 lg:px-7 lg:pb-7">
        <motion.div variants={item} className="rounded-[20px] border border-[#80641E] bg-[linear-gradient(135deg,rgba(251,191,36,0.13),rgba(6,17,27,0.94)_62%)] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2 border-b border-[#4B3B1C] pb-3">
            <Sun className="h-5 w-5 text-[#FBBF24]" strokeWidth={1.8} />
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#F8D66D]">Solar Events</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-5 sm:gap-x-3">
            {sunEvents.map(([label, value]) => (
              <div key={label}>
                <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#A78D4D]">{label}</p>
                <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#EFF8FF] sm:text-lg">{formatTime(value)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-[20px] border border-[#5579A4] bg-[linear-gradient(135deg,rgba(96,165,250,0.13),rgba(6,18,30,0.94)_62%)] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2 border-b border-[#29425E] pb-3">
            <Moon className="h-5 w-5 text-[#BFD7FF]" strokeWidth={1.8} />
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#BFD7FF]">Lunar Events</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3">
            {moonEvents.length ? moonEvents.map(([label, value]) => (
              <div key={label}>
                <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#7895B3]">{label}</p>
                <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#EFF8FF] sm:text-lg">{formatTime(value)}</p>
              </div>
            )) : (
              <div className="col-span-full flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-[#7895B3]">PHASE</p>
                  <p className="mt-1 text-sm font-semibold text-[#EFF8FF]">{moon.phase || "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-[#7895B3]">ILLUMINATION</p>
                  <p className="mt-1 font-mono text-base font-semibold text-[#EFF8FF]">{moon.illumination ?? "—"}%</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-3 mb-3 flex flex-col gap-3 rounded-[18px] border border-[#17415B] bg-[#061521]/85 px-4 py-3 sm:mx-5 sm:flex-row sm:items-center sm:justify-between lg:mx-7 lg:mb-7 lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2C6787] bg-[#092337] text-[#8EDCFA]">⌖</div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#D9F4FF]">{city}{region && region !== city ? `, ${region}` : ""}</p>
            <p className="mt-0.5 truncate text-[9px] text-[#5F8CA5]">
              {formatCoordinate(location.latitude, "N", "S")} · {formatCoordinate(location.longitude, "E", "W")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:text-right">
          <div>
            <p className="font-mono text-sm font-semibold tabular-nums text-[#EDF9FF]">{formatTime(activeTime, true)}</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[#5F8CA5]">{timezoneLabel}{timezone ? ` / ${timezone}` : ""}</p>
          </div>
          <div className="hidden h-7 w-px bg-[#19435C] sm:block" />
          <div className="hidden text-[9px] uppercase tracking-[0.12em] text-[#4D7891] sm:block">Sky Workspace</div>
        </div>
      </div>
    </motion.section>
  );
}
