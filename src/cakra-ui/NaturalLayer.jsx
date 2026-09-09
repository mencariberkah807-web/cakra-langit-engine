import { motion } from "framer-motion";
import {
  Activity,
  Cloud,
  Droplets,
  Eclipse,
  Globe,
  Leaf,
  LockKeyhole,
  Magnet,
  Moon,
  Mountain,
  Radiation,
  Sparkles,
  Sun,
  Waves,
  Wind,
} from "lucide-react";
import MoonPhaseCanvas from "./MoonPhaseCanvas";
import SunArc from "./SunArc";
import { useLanguage } from "../core/LanguageContext";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function buildCards(n, t) {
  return [
    { id: "sun", icon: Sun, label: "SUN", title: `${t("Sunrise")} ${n.sun.sunrise}`, sub: `${t("Sunset")} ${n.sun.sunset}`, accent: "#FBBF24" },
    { id: "moon", icon: Moon, label: "MOON", title: n.moon.phase, sub: `${t("Age")} ${n.moon.age} ${t("days")} · ${n.moon.illumination}%`, accent: "#93C5FD" },
    { id: "eclipse", icon: Eclipse, label: "ECLIPSE", title: n.eclipse.today ? n.eclipse.today.type : t("No eclipse event"), sub: n.eclipse.today ? n.eclipse.today.visibilityRegion || t("Visibility data available") : t("No event today"), accent: "#C4B5FD" },
    { id: "sky", icon: Sparkles, label: "SKY", title: n.sky.context || n.sky.primary || "—", sub: `${n.sky.bortle || "—"} · ${n.sky.moonlight || "—"} ${t("moonlight")}`, accent: "#38BDF8" },
    { id: "earth", icon: Globe, label: "EARTH SPACE", title: `${t("Day")} ${n.earth.day_of_year ?? "—"}`, sub: `${n.earth.annual_pct ?? "—"}% ${t("of annual cycle")}`, accent: "#4ADE80" },
    { id: "tide", icon: Waves, label: "TIDE", title: n.tide.high?.[0] ? `HIGH ${n.tide.high[0].time.slice(11, 16)} · ${n.tide.high[0].height_m}m` : t("No high tide"), sub: n.tide.low?.[0] ? `LOW ${n.tide.low[0].time.slice(11, 16)} · ${n.tide.low[0].height_m}m` : `${t("No low tide")} · ${n.tide.region || "—"}`, accent: "#38BDF8" },
  ];
}

const futureEngines = [
  ["atmosphere", Cloud, "Atmosphere"],
  ["weather", Cloud, "Weather"],
  ["geomagnetic", Magnet, "Geomagnetic"],
  ["radiation", Radiation, "Radiation"],
  ["air-quality", Wind, "Air Quality"],
  ["volcanic", Mountain, "Volcanic"],
  ["seismic", Activity, "Seismic"],
  ["ocean", Droplets, "Ocean"],
];

const formatTime = (value) => (value ? String(value).slice(0, 5) : "—");
const formatDegrees = (value) => (Number.isFinite(Number(value)) ? `${Number(value).toFixed(1)}°` : "—");

export default function NaturalLayer({ data, loading, onOpenEclipse }) {
  const { t } = useLanguage();
  const cards = data ? buildCards(data.natural, t) : [];
  const sun = data?.natural?.sun || {};
  const moon = data?.natural?.moon || {};
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
  const location = data?.location || {};
  const activeTime = data?.selectedTime || data?.time?.local || "—";

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-[24px] border border-[#164263] bg-[radial-gradient(circle_at_24%_12%,rgba(245,158,11,0.08),transparent_28%),radial-gradient(circle_at_78%_10%,rgba(56,189,248,0.11),transparent_30%),linear-gradient(155deg,#03111F_0%,#061A2B_48%,#020912_100%)] p-4 shadow-[0_28px_90px_rgba(1,9,20,0.52)] sm:p-5 lg:p-6"
      data-testid="natural-layer-section"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(56,189,248,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.045)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#FBBF24]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-[#38BDF8]/7 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-4 border-b border-[#164263] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-[#67E8F9]" strokeWidth={1.8} />
            <h2 className="text-xl font-semibold tracking-tight text-[#CFFAFE] sm:text-2xl">Sky Overview</h2>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#5F9BC0] sm:text-[11px]">Real-time solar &amp; lunar observation</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-xl border border-[#1D5274] bg-[#061B2D]/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9DD9F3] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#4ADE80] shadow-[0_0_10px_rgba(74,222,128,.7)]" />
            Live
          </span>
          <div className="text-right">
            <p className="font-mono text-sm font-semibold tabular-nums text-[#D9F7FF]">{activeTime}</p>
            <p className="text-[9px] uppercase tracking-[0.1em] text-[#547C98]">{location.timezoneLabel || "Local time"}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_250px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[#1C5274]/80 bg-[radial-gradient(circle_at_50%_42%,rgba(56,189,248,0.12),transparent_25%),radial-gradient(circle_at_50%_70%,rgba(124,58,237,0.09),transparent_35%),linear-gradient(180deg,rgba(2,17,31,.35),rgba(1,9,17,.84))]" aria-label="Celestial sky workspace">
          <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(113,140,168,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(113,140,168,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute left-4 top-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#5C819C]">Cakra Langit Sky Workspace</div>
          <div className="absolute right-4 top-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5C819C]">Live observation</div>
          {loading || !data ? (
            <div className="absolute inset-6 animate-pulse rounded-xl border border-[#1C5274] bg-[#08243A]/50" />
          ) : (
            <SunArc sun={sun} moon={moon} time={activeTime} loading={false} embedded />
          )}
        </div>

        <div className="grid content-start gap-3">
          <motion.div variants={item} className="rounded-2xl border border-[#2B5D7E] bg-[#061A2C]/82 p-4 shadow-[0_12px_40px_rgba(0,0,0,.22)] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-[#BFDBFE]" strokeWidth={1.8} />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A7C9DE]">Moon live position</span>
            </div>
            <p className="mt-3 font-mono text-lg font-semibold tabular-nums text-white">{activeTime}</p>
            <p className="mt-1 text-[10px] text-[#7296B0]">Az {formatDegrees(moon.azimuth)} · Alt {formatDegrees(moon.altitude)}</p>
            <div className="mt-3 h-px bg-[#1B405D]" />
            <div className="mt-3 flex items-center gap-3">
              <MoonPhaseCanvas phase={moon.phase} illumination={moon.illumination} />
              <div>
                <p className="text-xs font-semibold text-[#E8F5FF]">{moon.phase || "—"}</p>
                <p className="mt-1 text-[10px] text-[#7296B0]">{moon.illumination ?? "—"}% illumination</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="rounded-2xl border border-[#5B4A21] bg-[#17150D]/72 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-[#FBBF24]" strokeWidth={1.8} />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#F8D66D]">Sun live position</span>
            </div>
            <p className="mt-3 font-mono text-lg font-semibold tabular-nums text-white">{activeTime}</p>
            <p className="mt-1 text-[10px] text-[#B69B50]">Az {formatDegrees(sun.azimuth)} · Alt {formatDegrees(sun.altitude)}</p>
          </motion.div>

          <motion.div variants={item} className="rounded-2xl border border-[#244866] bg-[#061727]/72 p-4 backdrop-blur-md">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#668AA4]">Location</p>
            <p className="mt-2 text-sm font-semibold text-[#DDF4FF]">{location.name || location.city || "—"}</p>
            <p className="mt-1 text-[10px] text-[#668AA4]">{location.region || location.country || "Selected observation location"}</p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-2xl border border-[#8B6A22] bg-[linear-gradient(135deg,rgba(251,191,36,.13),rgba(9,22,32,.88)_55%)] p-4">
          <div className="flex items-center gap-2 border-b border-[#5D4A22] pb-3">
            <Sun className="h-5 w-5 text-[#FBBF24]" strokeWidth={1.8} />
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#F8D66D]">Solar Events</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {sunEvents.map(([label, value]) => (
              <div key={label} className="border-r border-[#3A3523] pr-2 last:border-r-0">
                <p className="text-[9px] font-medium text-[#A89155]">{label}</p>
                <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#EDF9FF]">{formatTime(value)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-[#3C6F99] bg-[linear-gradient(135deg,rgba(96,165,250,.12),rgba(7,22,36,.9)_55%)] p-4">
          <div className="flex items-center gap-2 border-b border-[#244968] pb-3">
            <Moon className="h-5 w-5 text-[#93C5FD]" strokeWidth={1.8} />
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#B8D8F7]">Lunar Events</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {moonEvents.length ? moonEvents.map(([label, value]) => (
              <div key={label} className="border-r border-[#243E55] pr-2 last:border-r-0">
                <p className="text-[9px] font-medium text-[#7296B0]">{label}</p>
                <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#EDF9FF]">{formatTime(value)}</p>
              </div>
            )) : (
              <div className="col-span-full flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-medium text-[#7296B0]">PHASE</p>
                  <p className="mt-1 text-sm font-semibold text-[#EDF9FF]">{moon.phase || "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-medium text-[#7296B0]">ILLUMINATION</p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#EDF9FF]">{moon.illumination ?? "—"}%</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => {
          const Icon = c.icon;
          const isEclipse = c.id === "eclipse";
          return (
            <motion.div key={c.id} variants={item}>
              {isEclipse ? (
                <button type="button" onClick={onOpenEclipse} className="group w-full rounded-xl border border-[#234965] bg-[#061827]/72 p-3 text-left backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-[#4A789D] hover:bg-[#092138]" data-testid="natural-card-eclipse">
                  <Icon className="h-4 w-4" style={{ color: c.accent }} strokeWidth={1.8} />
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#87A8C0]">{c.label}</p>
                  <p className="mt-1 truncate text-xs font-semibold text-white">{c.title}</p>
                </button>
              ) : (
                <div className="group rounded-xl border border-[#234965] bg-[#061827]/72 p-3 backdrop-blur-md" data-testid={`natural-card-${c.id}`}>
                  <Icon className="h-4 w-4" style={{ color: c.accent }} strokeWidth={1.8} />
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#87A8C0]">{c.label}</p>
                  <p className="mt-1 truncate text-xs font-semibold text-white">{c.title}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 mt-5 border-t border-[#164263] pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#91B1C8]">Nature Layer · Future Engines</h3>
            <p className="mt-1 text-[9px] text-[#587993]">Extended natural environment data</p>
          </div>
          <LockKeyhole className="h-3.5 w-3.5 text-[#5B7890]" strokeWidth={1.8} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {futureEngines.map(([id, Icon, label]) => (
            <div key={id} className="rounded-xl border border-dashed border-[#244765] bg-[#061827]/52 p-3 opacity-85" data-testid={`future-natural-${id}`}>
              <Icon className="h-4 w-4 text-[#66839B]" strokeWidth={1.8} />
              <p className="mt-2 text-[10px] font-semibold text-[#9AB3C6]">{label}</p>
              <p className="mt-1 text-[9px] uppercase tracking-wide text-[#55728A]">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
