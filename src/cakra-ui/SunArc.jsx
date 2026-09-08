import { motion } from "framer-motion";
import { Moon as MoonIcon, Sun as SunIcon } from "lucide-react";

const toMin = (s) => {
  if (!s) return 0;
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

const P0 = { x: 40, y: 130 };
const P1 = { x: 300, y: -70 };
const P2 = { x: 560, y: 130 };
const pt = (t) => ({
  x: (1 - t) * (1 - t) * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x,
  y: (1 - t) * (1 - t) * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y,
});

const formatTime = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export default function SunArc({ sun, moon, time, loading, embedded = false }) {
  const now = toMin(time || "12:00");
  const rise = sun ? toMin(sun.sunrise) : 0;
  const setM = sun ? toMin(sun.sunset) : 1;
  const altitude = Number.isFinite(Number(sun?.altitude)) ? Number(sun.altitude) : null;
  const isDay = Boolean(sun && altitude != null && altitude >= 0 && now >= rise && now <= setM);
  const dayT = Math.min(1, Math.max(0, (now - rise) / (setM - rise || 1)));
  const moonT = now / 1440;
  const pos = pt(dayT);
  const moonPos = pt(moonT);
  const altitudeLabel = altitude == null ? "—" : `Altitude ${altitude.toFixed(1)}°`;

  const sunTicks = sun
    ? [
        { x: 40, anchor: "start", label: "Terbit", time: sun.sunrise },
        { x: 300, anchor: "middle", label: "Kulminasi", time: sun.noon },
        { x: 560, anchor: "end", label: "Surup", time: sun.sunset },
      ]
    : [];
  const moonTicks = [0, 360, 720, 1080, 1440].map((minutes, index, values) => ({
    x: pt(minutes / 1440).x,
    anchor: index === 0 ? "start" : index === values.length - 1 ? "end" : "middle",
    label: index === 0 ? "Tengah malam" : index === values.length - 1 ? "Tengah malam" : "",
    time: formatTime(minutes === 1440 ? 0 : minutes),
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={embedded
        ? "pointer-events-none absolute inset-x-5 bottom-12 z-10 lg:right-[220px] lg:bottom-8"
        : "overflow-hidden rounded-2xl border border-[#163452] bg-[radial-gradient(circle_at_50%_12%,rgba(245,158,11,0.13),transparent_28%),radial-gradient(circle_at_15%_85%,rgba(14,165,233,0.12),transparent_34%),#061522] p-5 shadow-[0_18px_50px_rgba(2,12,27,0.28)]"}
      data-testid="sun-arc-panel"
    >
      {!embedded && <div className="mb-4 flex flex-wrap items-center gap-2">
        {isDay ? <SunIcon className="h-4 w-4 text-[#FBBF24]" strokeWidth={1.8} /> : <MoonIcon className="h-4 w-4 text-[#A5B4FC]" strokeWidth={1.8} />}
        <div><h2 className="text-sm font-semibold tracking-tight text-white">{isDay ? "Sun Path" : "Moon Path"}</h2><p className="text-[10px] text-[#718CA8]">Daily celestial position</p></div>
        <span className="ml-auto flex items-center gap-2"><span data-testid="sun-arc-altitude" className="rounded-full border border-[#24496B] bg-[#0B2239]/80 px-2.5 py-1 font-mono text-[10px] font-medium tabular-nums text-[#9FB5CB]">{sun ? (isDay ? altitudeLabel : `Below horizon · ${altitudeLabel}`) : "—"}</span><span className="rounded-full border border-[#24496B] bg-[#0B2239]/80 px-2.5 py-1 font-mono text-[10px] font-semibold tabular-nums text-white">{time}</span></span>
      </div>}

      {loading || !sun ? (
        <div className={embedded ? "h-[190px]" : "h-[220px] animate-pulse rounded-xl border border-[#173957] bg-[#0B2239]/60"} />
      ) : (
        <div className={embedded ? "bg-transparent" : "rounded-xl border border-[#173957] bg-[radial-gradient(circle_at_50%_48%,rgba(245,158,11,0.08),transparent_22%),linear-gradient(180deg,rgba(9,31,52,0.72),rgba(4,18,31,0.92))] px-2 py-4"}>
          <svg viewBox="0 0 600 210" className="w-full" data-testid={isDay ? "sun-path-svg" : "moon-path-svg"}>
            <defs><filter id="sunGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            <line x1="12" y1="145" x2="588" y2="145" stroke="#5D7D98" strokeWidth="1.5" opacity="0.75" />
            <path d="M 40 145 Q 300 -55 560 145" fill="none" stroke={isDay ? "#FDBA74" : "#94A3B8"} strokeWidth="1.5" strokeDasharray="5 6" opacity="0.85" />
            {isDay ? sunTicks.map((tk) => <g key={tk.label}><line x1={tk.x} y1="141" x2={tk.x} y2="149" stroke="#A9C0D5" strokeWidth="1.5" /><text x={tk.x} y="167" textAnchor={tk.anchor} fontSize="9.5" fontWeight="700" fill="#E2ECF5" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{tk.label}</text><text x={tk.x} y="181" textAnchor={tk.anchor} fontSize="9" fill="#9DB6D0" fontFamily="JetBrains Mono, monospace">{tk.time}</text></g>) : moonTicks.slice(0, 4).map((tk, index) => <g key={`${tk.time}-${index}`}><line x1={tk.x} y1="141" x2={tk.x} y2="149" stroke="#6F8BA5" strokeWidth="1.5" /><text x={tk.x} y="167" textAnchor={tk.anchor} fontSize="8.5" fontWeight="600" fill="#9FB5CB">{formatTime(index * 360)}</text></g>)}
            {isDay ? <><motion.line animate={{ x1: pos.x, x2: pos.x }} transition={{ type: "spring", stiffness: 240, damping: 24 }} y1={pos.y} y2="145" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2 3" opacity="0.65" /><motion.circle data-testid="sun-arc-marker" animate={{ cx: pos.x, cy: pos.y }} transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.55 }} r="20" fill="#FBBF24" opacity="0.16" /><motion.circle animate={{ cx: pos.x, cy: pos.y }} transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.55 }} r="8" fill="#FBBF24" stroke="#FFF7D6" strokeWidth="1.5" filter="url(#sunGlow)" /></> : <><motion.line animate={{ x1: moonPos.x, x2: moonPos.x }} transition={{ type: "spring", stiffness: 180, damping: 24 }} y1={moonPos.y} y2="145" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 3" opacity="0.55" /><motion.circle data-testid="moon-path-marker" animate={{ cx: moonPos.x, cy: moonPos.y }} transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }} r="15" fill="#94A3B8" opacity="0.12" /><motion.circle animate={{ cx: moonPos.x, cy: moonPos.y }} transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }} r="7" fill="#CBD5E1" stroke="#F8FAFC" strokeWidth="1.5" /></>}
            <text x="300" y="201" textAnchor="middle" fontSize="9" fill="#9DB6D0" fontFamily="JetBrains Mono, monospace">{isDay ? "Daily solar path" : `${moon?.phase || "Moon"} · ${moon?.illumination ?? "—"}% illumination`}</text>
          </svg>
        </div>
      )}
    </motion.section>
  );
}
