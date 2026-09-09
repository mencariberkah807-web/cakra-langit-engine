import { motion } from "framer-motion";
import { Moon as MoonIcon, Sun as SunIcon } from "lucide-react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const toMin = (value) => {
  if (!value) return null;
  const [hour, minute] = String(value).split(":").map(Number);
  return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : null;
};
const formatTime = (value) => {
  const minutes = toMin(value);
  return minutes == null ? "—" : `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
};

const CENTER = { x: 300, y: 180 };
const RADIUS = 112;

function projectPoint(point) {
  const altitude = clamp(Number(point?.altitude) || 0, 0, 90);
  const azimuth = Number(point?.azimuth) || 0;
  const radius = RADIUS * (1 - altitude / 90);
  const angle = (azimuth * Math.PI) / 180;
  return {
    x: CENTER.x + radius * Math.sin(angle),
    y: CENTER.y - radius * Math.cos(angle),
  };
}

function buildPath(points = []) {
  const segments = [];
  let current = [];
  points.forEach((point) => {
    if (point?.visible && Number.isFinite(Number(point.altitude)) && Number.isFinite(Number(point.azimuth))) {
      current.push(projectPoint(point));
    } else if (current.length > 1) {
      segments.push(current);
      current = [];
    } else {
      current = [];
    }
  });
  if (current.length > 1) segments.push(current);
  return segments.map((segment) => segment.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" "));
}

function markerPosition(body) {
  if (!body || !Number.isFinite(Number(body.altitude)) || !Number.isFinite(Number(body.azimuth))) return CENTER;
  return projectPoint(body);
}

export default function SunArc({ sun, moon, time, loading, embedded = false }) {
  const sunAltitude = Number.isFinite(Number(sun?.altitude)) ? Number(sun.altitude) : null;
  const moonAltitude = Number.isFinite(Number(moon?.altitude)) ? Number(moon.altitude) : null;
  const sunVisible = sunAltitude != null && sunAltitude >= 0;
  const moonVisible = moonAltitude != null && moonAltitude >= 0;
  const activeBody = sunVisible ? sun : moonVisible ? moon : sunAltitude != null ? sun : moon;
  const activeIsSun = activeBody === sun;
  const activePosition = markerPosition(activeBody);
  const sunPaths = buildPath(sun?.path);
  const moonPaths = buildPath(moon?.path);

  const sunEvents = [
    ["FAJAR", sun?.dawn], ["TERBIT", sun?.sunrise], ["KULMINASI", sun?.noon],
    ["GOLDEN", sun?.golden_hour], ["SURUP", sun?.sunset], ["SENJA", sun?.dusk],
  ].filter(([, value]) => value);
  const moonEvents = [
    ["MOONRISE", moon?.rise], ["TRANSIT", moon?.transit], ["MOONSET", moon?.set],
  ].filter(([, value]) => value);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={embedded
        ? "pointer-events-none absolute inset-x-3 bottom-0 z-10"
        : "overflow-hidden rounded-2xl border border-[#163452] bg-[radial-gradient(circle_at_50%_12%,rgba(245,158,11,0.13),transparent_28%),radial-gradient(circle_at_15%_85%,rgba(14,165,233,0.12),transparent_34%),#061522] p-5 shadow-[0_18px_50px_rgba(2,12,27,0.28)]"}
      data-testid="sun-arc-panel"
    >
      {!embedded && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {activeIsSun ? <SunIcon className="h-4 w-4 text-[#FBBF24]" strokeWidth={1.8} /> : <MoonIcon className="h-4 w-4 text-[#CBD5E1]" strokeWidth={1.8} />}
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-white">Sun & Moon Path</h2>
            <p className="text-[10px] text-[#718CA8]">Polar sky diagram · true azimuth / altitude</p>
          </div>
          <span className="ml-auto rounded-full border border-[#24496B] bg-[#0B2239]/80 px-2.5 py-1 font-mono text-[10px] text-[#9FB5CB]">
            {activeBody ? `${Number(activeBody.altitude).toFixed(1)}° alt · ${Number(activeBody.azimuth).toFixed(1)}° az` : "—"}
          </span>
        </div>
      )}

      {loading || !sun ? (
        <div className={embedded ? "h-[360px]" : "h-[420px] animate-pulse rounded-xl border border-[#173957] bg-[#0B2239]/60"} />
      ) : (
        <div className={embedded ? "bg-transparent" : "rounded-xl border border-[#173957] bg-[radial-gradient(circle_at_50%_48%,rgba(245,158,11,0.08),transparent_22%),linear-gradient(180deg,rgba(9,31,52,0.72),rgba(4,18,31,0.92))] px-2 py-3"}>
          <svg viewBox="0 0 600 360" className="h-[360px] w-full" data-testid="sun-moon-path-svg" role="img" aria-label="Polar Sun and Moon path">
            <defs>
              <filter id="celestialGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS} fill="rgba(8,27,45,.38)" stroke="#416681" strokeWidth="1.5" />
            {[30, 60].map((altitude) => (
              <circle key={altitude} cx={CENTER.x} cy={CENTER.y} r={RADIUS * (1 - altitude / 90)} fill="none" stroke="#315A7E" strokeWidth="1" strokeDasharray="3 5" opacity="0.75" />
            ))}
            <circle cx={CENTER.x} cy={CENTER.y} r="3" fill="#DDEBFA" />

            <line x1={CENTER.x} y1={CENTER.y - RADIUS} x2={CENTER.x} y2={CENTER.y + RADIUS} stroke="#315A7E" strokeWidth="1" opacity="0.55" />
            <line x1={CENTER.x - RADIUS} y1={CENTER.y} x2={CENTER.x + RADIUS} y2={CENTER.y} stroke="#315A7E" strokeWidth="1" opacity="0.55" />

            <text x="300" y="55" textAnchor="middle" fontSize="10" fontWeight="700" fill="#B7CBE0">N</text>
            <text x="300" y="309" textAnchor="middle" fontSize="10" fontWeight="700" fill="#B7CBE0">S</text>
            <text x="180" y="184" textAnchor="middle" fontSize="10" fontWeight="700" fill="#B7CBE0">W</text>
            <text x="420" y="184" textAnchor="middle" fontSize="10" fontWeight="700" fill="#B7CBE0">E</text>
            <text x="307" y="142" fontSize="8" fill="#6F8CA6">30°</text>
            <text x="307" y="105" fontSize="8" fill="#6F8CA6">60°</text>
            <text x="307" y="68" fontSize="8" fill="#6F8CA6">90°</text>

            {sunPaths.map((d, index) => <path key={`sun-${index}`} d={d} fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.86" />)}
            {moonPaths.map((d, index) => <path key={`moon-${index}`} d={d} fill="none" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5" opacity="0.8" />)}

            <motion.line animate={{ x1: activePosition.x, y1: activePosition.y, x2: CENTER.x, y2: CENTER.y }} transition={{ type: "spring", stiffness: 180, damping: 24 }} stroke={activeIsSun ? "#FBBF24" : "#CBD5E1"} strokeWidth="1" strokeDasharray="4 5" opacity="0.7" />
            <motion.circle data-testid={activeIsSun ? "sun-arc-marker" : "moon-path-marker"} animate={{ cx: activePosition.x, cy: activePosition.y }} transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }} r={activeIsSun ? 11 : 9} fill={activeIsSun ? "#FBBF24" : "#CBD5E1"} stroke="#FFFFFF" strokeWidth="1.5" filter="url(#celestialGlow)" />

            <g transform="translate(34 312)">
              <circle cx="0" cy="0" r="4" fill="#FBBF24" /><text x="10" y="3" fontSize="9" fill="#AFC4D8">SUN PATH</text>
              <circle cx="76" cy="0" r="4" fill="#A5B4FC" /><text x="86" y="3" fontSize="9" fill="#AFC4D8">MOON PATH</text>
              <text x="196" y="3" fontSize="9" fill="#718CA8">ALTITUDE RINGS · 0° / 30° / 60° / 90°</text>
            </g>

            <text x="300" y="345" textAnchor="middle" fontSize="9" fill="#718CA8" fontFamily="JetBrains Mono, monospace">{time || "—"} · {activeIsSun ? "SUN" : "MOON"} LIVE POSITION</text>
          </svg>

          <div className="mt-1 grid grid-cols-2 gap-2 border-t border-[#173957] pt-2">
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#FBBF24]"><SunIcon className="h-3 w-3" /> Solar Events</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-[#9DB6D0]">{sunEvents.map(([label, value]) => <span key={label}>{label} <b className="font-mono text-[#D8E5F1]">{formatTime(value)}</b></span>)}</div>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#A5B4FC]"><MoonIcon className="h-3 w-3" /> Lunar Events</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-[#9DB6D0]">{moonEvents.map(([label, value]) => <span key={label}>{label} <b className="font-mono text-[#D8E5F1]">{formatTime(value)}</b></span>)}</div>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
