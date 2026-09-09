import { motion } from "framer-motion";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const CENTER = { x: 500, y: 300 };
const RADIUS = 205;

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
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
      className={embedded ? "pointer-events-none absolute inset-0 z-10" : "overflow-hidden rounded-2xl border border-[#163452] bg-[#061522] p-5"}
      data-testid="sun-arc-panel"
    >
      {loading || !sun ? (
        <div className={embedded ? "h-full w-full animate-pulse" : "h-[520px] animate-pulse rounded-xl bg-[#0B2239]/60"} />
      ) : (
        <svg
          viewBox="0 0 1000 600"
          className={embedded ? "h-full w-full" : "h-[600px] w-full"}
          preserveAspectRatio="xMidYMid meet"
          data-testid="sun-moon-path-svg"
          role="img"
          aria-label="Polar Sun and Moon path"
        >
          <defs>
            <filter id="celestialGlowLarge" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="celestialSoftGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <circle cx={CENTER.x} cy={CENTER.y} r="290" fill="none" stroke="#31566E" strokeWidth="1" opacity="0.35" />
          <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS} fill="rgba(5,25,42,.42)" stroke="#74D8E8" strokeWidth="2" opacity="0.92" />
          {[30, 60].map((altitude) => (
            <circle key={altitude} cx={CENTER.x} cy={CENTER.y} r={RADIUS * (1 - altitude / 90)} fill="none" stroke="#42758D" strokeWidth="1.2" strokeDasharray="4 7" opacity="0.72" />
          ))}
          <circle cx={CENTER.x} cy={CENTER.y} r="5" fill="#E4F8FF" />
          <circle cx={CENTER.x} cy={CENTER.y} r="18" fill="none" stroke="#67E8F9" strokeWidth="1" opacity="0.45" />

          <line x1={CENTER.x} y1={CENTER.y - RADIUS} x2={CENTER.x} y2={CENTER.y + RADIUS} stroke="#5A879B" strokeWidth="1" opacity="0.55" />
          <line x1={CENTER.x - RADIUS} y1={CENTER.y} x2={CENTER.x + RADIUS} y2={CENTER.y} stroke="#5A879B" strokeWidth="1" opacity="0.55" />

          <text x="500" y="55" textAnchor="middle" fontSize="16" fontWeight="700" fill="#D4F7FF">N</text>
          <text x="500" y="565" textAnchor="middle" fontSize="16" fontWeight="700" fill="#D4F7FF">S</text>
          <text x="245" y="307" textAnchor="middle" fontSize="16" fontWeight="700" fill="#D4F7FF">W</text>
          <text x="755" y="307" textAnchor="middle" fontSize="16" fontWeight="700" fill="#D4F7FF">E</text>

          <text x="512" y="238" fontSize="13" fill="#86AFC0">30°</text>
          <text x="512" y="170" fontSize="13" fill="#86AFC0">60°</text>
          <text x="512" y="100" fontSize="13" fill="#86AFC0">90°</text>

          <path d={`M ${CENTER.x - 290} ${CENTER.y} A 290 290 0 0 1 ${CENTER.x + 290} ${CENTER.y}`} fill="none" stroke="#6EAFC5" strokeWidth="1" opacity="0.35" />
          <path d={`M ${CENTER.x - 290} ${CENTER.y} A 290 290 0 0 0 ${CENTER.x + 290} ${CENTER.y}`} fill="none" stroke="#6EAFC5" strokeWidth="1" opacity="0.2" />

          {sunPaths.map((d, index) => (
            <path key={`sun-${index}`} d={d} fill="none" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.92" filter="url(#celestialSoftGlow)" />
          ))}
          {sunPaths.map((d, index) => (
            <path key={`sun-core-${index}`} d={d} fill="none" stroke="#FFD45A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.98" />
          ))}
          {moonPaths.map((d, index) => (
            <path key={`moon-${index}`} d={d} fill="none" stroke="#B9D9F7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="9 10" opacity="0.72" />
          ))}

          <motion.line
            animate={{ x1: activePosition.x, y1: activePosition.y, x2: CENTER.x, y2: CENTER.y }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            stroke={activeIsSun ? "#FBBF24" : "#D8E8F7"}
            strokeWidth="2"
            strokeDasharray="8 9"
            opacity="0.76"
          />
          <motion.circle
            data-testid={activeIsSun ? "sun-arc-marker" : "moon-path-marker"}
            animate={{ cx: activePosition.x, cy: activePosition.y }}
            transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }}
            r={activeIsSun ? 18 : 15}
            fill={activeIsSun ? "#FBBF24" : "#D9E9F8"}
            stroke="#FFFFFF"
            strokeWidth="2"
            filter="url(#celestialGlowLarge)"
          />

          <g transform="translate(44 525)">
            <circle cx="0" cy="0" r="6" fill="#FBBF24" />
            <text x="15" y="5" fontSize="13" fill="#C1D5E0">SUN PATH</text>
            <circle cx="120" cy="0" r="6" fill="#B9D9F7" />
            <text x="135" y="5" fontSize="13" fill="#C1D5E0">MOON PATH</text>
            <text x="315" y="5" fontSize="13" fill="#7E9AA9">ALTITUDE RINGS · 0° / 30° / 60° / 90°</text>
          </g>

          <text x="500" y="578" textAnchor="middle" fontSize="13" fill="#A8C2D0" fontFamily="JetBrains Mono, monospace">
            {time || "—"} · {activeIsSun ? "SUN" : "MOON"} LIVE POSITION
          </text>
        </svg>
      )}
    </motion.section>
  );
}
