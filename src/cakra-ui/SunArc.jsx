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
const formatDegrees = (value) => (Number.isFinite(Number(value)) ? `${Number(value).toFixed(1)}°` : "—");

const CENTER = { x: 500, y: 330 };
const RADIUS = 215;

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
      data-testid="sun-arc-panel"
    >
      {loading || !sun ? (
        <div className="absolute inset-6 animate-pulse rounded-2xl border border-[#174A69] bg-[#071D31]/60" />
      ) : (
        <svg viewBox="0 0 1000 620" className="h-full w-full" data-testid="sun-moon-path-svg" role="img" aria-label="Polar Sun and Moon path">
          <defs>
            <radialGradient id="skyCore" cx="50%" cy="52%" r="52%">
              <stop offset="0%" stopColor="#123A59" stopOpacity="0.62" />
              <stop offset="55%" stopColor="#071E33" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#020A13" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sunStroke" x1="0" x2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="moonStroke" x1="0" x2="1">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
            <filter id="celestialGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="1000" height="620" fill="url(#skyCore)" />

          {[...Array(72)].map((_, index) => {
            const x = (index * 137) % 980 + 10;
            const y = (index * 71) % 285 + 18;
            const r = index % 7 === 0 ? 1.8 : index % 3 === 0 ? 1.2 : 0.65;
            return <circle key={`star-${index}`} cx={x} cy={y} r={r} fill="#DDF7FF" opacity={0.25 + (index % 5) * 0.1} />;
          })}

          <path d="M70 555 L930 555" stroke="#164A67" strokeWidth="1" opacity="0.65" />
          <path d="M95 575 L905 575" stroke="#0D3149" strokeWidth="1" opacity="0.55" />

          <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS + 3} fill="rgba(4,18,31,.3)" stroke="#6DD9FF" strokeWidth="2" opacity="0.88" />
          {[30, 60].map((altitude) => (
            <circle key={altitude} cx={CENTER.x} cy={CENTER.y} r={RADIUS * (1 - altitude / 90)} fill="none" stroke="#69BCE1" strokeWidth="1.2" strokeDasharray="5 8" opacity="0.55" />
          ))}
          <circle cx={CENTER.x} cy={CENTER.y} r="5" fill="#DDF7FF" />

          <line x1={CENTER.x} y1={CENTER.y - RADIUS} x2={CENTER.x} y2={CENTER.y + RADIUS} stroke="#5B9BB9" strokeWidth="1" opacity="0.55" />
          <line x1={CENTER.x - RADIUS} y1={CENTER.y} x2={CENTER.x + RADIUS} y2={CENTER.y} stroke="#5B9BB9" strokeWidth="1" opacity="0.55" />

          <text x="500" y="92" textAnchor="middle" fontSize="17" fontWeight="700" fill="#C9F7FF">N</text>
          <text x="500" y="575" textAnchor="middle" fontSize="17" fontWeight="700" fill="#C9F7FF">S</text>
          <text x="245" y="337" textAnchor="middle" fontSize="16" fontWeight="700" fill="#A7D4E6">W</text>
          <text x="755" y="337" textAnchor="middle" fontSize="16" fontWeight="700" fill="#A7D4E6">E</text>
          <text x="515" y="276" fontSize="13" fill="#77AFC8">30°</text>
          <text x="515" y="217" fontSize="13" fill="#77AFC8">60°</text>
          <text x="515" y="157" fontSize="13" fill="#77AFC8">90°</text>

          {sunPaths.map((d, index) => <path key={`sun-${index}`} d={d} fill="none" stroke="url(#sunStroke)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" filter="url(#celestialGlow)" />)}
          {moonPaths.map((d, index) => <path key={`moon-${index}`} d={d} fill="none" stroke="url(#moonStroke)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="9 8" opacity="0.86" />)}

          <motion.line animate={{ x1: activePosition.x, y1: activePosition.y, x2: CENTER.x, y2: CENTER.y }} transition={{ type: "spring", stiffness: 180, damping: 24 }} stroke={activeIsSun ? "#FBBF24" : "#C4B5FD"} strokeWidth="1.5" strokeDasharray="6 7" opacity="0.7" />
          <motion.circle data-testid={activeIsSun ? "sun-arc-marker" : "moon-path-marker"} animate={{ cx: activePosition.x, cy: activePosition.y }} transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }} r={activeIsSun ? 17 : 14} fill={activeIsSun ? "#FBBF24" : "#C4B5FD"} stroke="#FFFFFF" strokeWidth="2" filter="url(#celestialGlow)" />

          <g transform="translate(52 492)">
            <rect x="0" y="0" width="128" height="34" rx="17" fill="#071A2A" fillOpacity="0.9" stroke="#765E1C" />
            <circle cx="22" cy="17" r="7" fill="#FBBF24" />
            <text x="38" y="22" fontSize="13" fontWeight="700" fill="#F9D66D">SUN PATH</text>
            <rect x="138" y="0" width="136" height="34" rx="17" fill="#071A2A" fillOpacity="0.9" stroke="#355C82" />
            <circle cx="160" cy="17" r="7" fill="#A5B4FC" />
            <text x="176" y="22" fontSize="13" fontWeight="700" fill="#BBD8F5">MOON PATH</text>
          </g>

          <text x="500" y="518" textAnchor="middle" fontSize="14" fill="#8FC1D8">ALTITUDE RINGS  0° / 30° / 60° / 90°</text>




        </svg>
      )}
    </motion.div>
  );
}
