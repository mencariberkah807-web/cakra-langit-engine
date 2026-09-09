import { motion } from "framer-motion";
import { Moon as MoonIcon, Sun as SunIcon } from "lucide-react";

const toMin = (s) => {
  if (!s) return null;
  const [h, m] = s.split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};

const formatTime = (minutes) => minutes == null ? "—" : `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const pathPoint = (t) => {
  const x = 50 + clamp01(t) * 500;
  const y = 150 - Math.sin(Math.PI * clamp01(t)) * 120;
  return { x, y };
};

export default function SunArc({ sun, moon, time, loading, embedded = false }) {
  const now = toMin(time || "12:00");
  const sunrise = toMin(sun?.sunrise);
  const sunset = toMin(sun?.sunset);
  const dawn = toMin(sun?.dawn);
  const noon = toMin(sun?.noon);
  const dusk = toMin(sun?.dusk);
  const altitude = Number.isFinite(Number(sun?.altitude)) ? Number(sun.altitude) : null;
  const isDay = Boolean(sun && altitude != null && altitude >= 0 && sunrise != null && sunset != null && now >= sunrise && now <= sunset);
  const solarT = sunrise != null && sunset != null ? clamp01((now - sunrise) / (sunset - sunrise || 1)) : 0;
  const moonT = now == null ? 0 : now / 1440;
  const sunPos = pathPoint(solarT);
  const moonPos = pathPoint(moonT);
  const altitudeLabel = altitude == null ? "—" : `Altitude ${altitude.toFixed(1)}°`;

  const dawnX = dawn != null && dawn <= (dusk ?? 1440) ? 50 + clamp01((dawn - (dawn ?? 0)) / ((dusk ?? 1440) - (dawn ?? 0) || 1)) * 500 : 50;
  const eventRangeStart = dawn ?? sunrise ?? 0;
  const eventRangeEnd = dusk ?? sunset ?? 1440;
  const eventX = (value) => 50 + clamp01((value - eventRangeStart) / (eventRangeEnd - eventRangeStart || 1)) * 500;
  const sunTicks = sun ? [
    { x: eventX(dawn), label: "FAJAR", time: dawn },
    { x: eventX(sunrise), label: "TERBIT", time: sunrise },
    { x: eventX(noon), label: "KULMINASI", time: noon },
    { x: eventX(sunset), label: "SURUP", time: sunset },
    { x: eventX(dusk), label: "SENJA", time: dusk },
  ].filter((item) => item.time != null) : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={embedded
        ? "pointer-events-none absolute inset-x-3 bottom-1 z-10"
        : "overflow-hidden rounded-2xl border border-[#163452] bg-[radial-gradient(circle_at_50%_12%,rgba(245,158,11,0.13),transparent_28%),radial-gradient(circle_at_15%_85%,rgba(14,165,233,0.12),transparent_34%),#061522] p-5 shadow-[0_18px_50px_rgba(2,12,27,0.28)]"}
      data-testid="sun-arc-panel"
    >
      {!embedded && <div className="mb-4 flex flex-wrap items-center gap-2">
        {isDay ? <SunIcon className="h-4 w-4 text-[#FBBF24]" strokeWidth={1.8} /> : <MoonIcon className="h-4 w-4 text-[#A5B4C5]" strokeWidth={1.8} />}
        <div><h2 className="text-sm font-semibold tracking-tight text-white">{isDay ? "Sun Path" : "Moon Path"}</h2><p className="text-[10px] text-[#718CA8]">Daily celestial position</p></div>
        <span className="ml-auto flex items-center gap-2"><span data-testid="sun-arc-altitude" className="rounded-full border border-[#24496B] bg-[#0B2239]/80 px-2.5 py-1 font-mono text-[10px] font-medium tabular-nums text-[#9FB5CB]">{sun ? (isDay ? altitudeLabel : `Below horizon · ${altitudeLabel}`) : "—"}</span><span className="rounded-full border border-[#24496B] bg-[#0B2239]/80 px-2.5 py-1 font-mono text-[10px] font-semibold tabular-nums text-white">{time}</span></span>
      </div>}

      {loading || !sun ? (
        <div className={embedded ? "h-[250px]" : "h-[220px] animate-pulse rounded-xl border border-[#173957] bg-[#0B2239]/60"} />
      ) : (
        <div className={embedded ? "bg-transparent" : "rounded-xl border border-[#173957] bg-[radial-gradient(circle_at_50%_48%,rgba(245,158,11,0.08),transparent_22%),linear-gradient(180deg,rgba(9,31,52,0.72),rgba(4,18,31,0.92))] px-2 py-4"}>
          <svg viewBox="0 0 600 240" className="h-[250px] w-full" data-testid={isDay ? "sun-path-svg" : "moon-path-svg"}>
            <defs><filter id="sunGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            <line x1="30" y1="150" x2="570" y2="150" stroke="#5D7D98" strokeWidth="1.5" opacity="0.75" />
            <path d="M 50 150 Q 300 30 550 150" fill="none" stroke={isDay ? "#FDBA74" : "#94A3B8"} strokeWidth="2" strokeDasharray="6 7" opacity="0.9" />
            {isDay ? sunTicks.map((tk) => <g key={`${tk.label}-${tk.time}`}><line x1={tk.x} y1="145" x2={tk.x} y2="155" stroke="#A9C0D5" strokeWidth="1.5" /><text x={tk.x} y="177" textAnchor="middle" fontSize="10" fontWeight="700" fill="#E2ECF5" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{tk.label}</text><text x={tk.x} y="193" textAnchor="middle" fontSize="10" fill="#9DB6D0" fontFamily="JetBrains Mono, monospace">{formatTime(tk.time)}</text></g>) : [0, 360, 720, 1080].map((minutes) => <g key={minutes}><line x1={pathPoint(minutes / 1440).x} y1="145" x2={pathPoint(minutes / 1440).x} y2="155" stroke="#6F8BA5" strokeWidth="1.5" /><text x={pathPoint(minutes / 1440).x} y="178" textAnchor="middle" fontSize="10" fontWeight="600" fill="#9FB5CB">{formatTime(minutes)}</text></g>)}
            {isDay ? <><motion.line animate={{ x1: sunPos.x, x2: sunPos.x }} transition={{ type: "spring", stiffness: 240, damping: 24 }} y1={sunPos.y} y2="150" stroke="#FBBF24" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.7" /><motion.circle data-testid="sun-arc-marker" animate={{ cx: sunPos.x, cy: sunPos.y }} transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.55 }} r="24" fill="#FBBF24" opacity="0.16" /><motion.circle animate={{ cx: sunPos.x, cy: sunPos.y }} transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.55 }} r="10" fill="#FBBF24" stroke="#FFF7D6" strokeWidth="1.8" filter="url(#sunGlow)" /></> : <><motion.line animate={{ x1: moonPos.x, x2: moonPos.x }} transition={{ type: "spring", stiffness: 180, damping: 24 }} y1={moonPos.y} y2="150" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 4" opacity="0.55" /><motion.circle data-testid="moon-path-marker" animate={{ cx: moonPos.x, cy: moonPos.y }} transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }} r="18" fill="#94A3B8" opacity="0.12" /><motion.circle animate={{ cx: moonPos.x, cy: moonPos.y }} transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }} r="8" fill="#CBD5E1" stroke="#F8FAFC" strokeWidth="1.5" /></>}
            <text x="300" y="225" textAnchor="middle" fontSize="10" fill="#9DB6D0" fontFamily="JetBrains Mono, monospace">{isDay ? "Daily solar path · live position" : `${moon?.phase || "Moon"} · ${moon?.illumination ?? "—"}% illumination`}</text>
          </svg>
        </div>
      )}
    </motion.section>
  );
}
