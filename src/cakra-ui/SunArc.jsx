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

export default function SunArc({ sun, moon, time, loading }) {
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
      className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      data-testid="sun-arc-panel"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {isDay ? <SunIcon className="h-4 w-4 text-[#F59E0B]" strokeWidth={1.8} /> : <MoonIcon className="h-4 w-4 text-[#64748B]" strokeWidth={1.8} />}
        <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]">{isDay ? "Sun Path" : "Moon Path"}</h2>
        <span className="ml-auto flex items-center gap-2">
          <span data-testid="sun-arc-altitude" className="rounded bg-[#F1F5F9] px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums text-[#475569]">
            {sun ? (isDay ? altitudeLabel : `Below horizon · ${altitudeLabel}`) : "—"}
          </span>
          <span className="rounded bg-[#0F172A] px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-white">{time}</span>
        </span>
      </div>

      {loading || !sun ? (
        <div className="h-[190px] animate-pulse rounded-lg bg-[#F8FAFC]" />
      ) : (
        <svg viewBox="0 0 600 190" className="w-full" data-testid={isDay ? "sun-path-svg" : "moon-path-svg"}>
          <line x1="12" y1="130" x2="588" y2="130" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M 40 130 Q 300 -70 560 130" fill="none" stroke={isDay ? "#F59E0B" : "#94A3B8"} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55" />

          {isDay ? sunTicks.map((tk) => (
            <g key={tk.label}>
              <line x1={tk.x} y1="126" x2={tk.x} y2="134" stroke="#94A3B8" strokeWidth="1.5" />
              <text x={tk.x} y="151" textAnchor={tk.anchor} fontSize="9.5" fontWeight="700" fill="#475569" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{tk.label}</text>
              <text x={tk.x} y="164" textAnchor={tk.anchor} fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono, monospace">{tk.time}</text>
            </g>
          )) : moonTicks.slice(0, 4).map((tk, index) => (
            <g key={`${tk.time}-${index}`}>
              <line x1={tk.x} y1="126" x2={tk.x} y2="134" stroke="#CBD5E1" strokeWidth="1.5" />
              <text x={tk.x} y="151" textAnchor={tk.anchor} fontSize="8.5" fontWeight="600" fill="#64748B">{formatTime(index * 360)}</text>
            </g>
          ))}

          {isDay ? (
            <>
              <motion.line animate={{ x1: pos.x, x2: pos.x }} transition={{ type: "spring", stiffness: 240, damping: 24 }} y1={pos.y} y2="130" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
              <motion.circle data-testid="sun-arc-marker" animate={{ cx: pos.x, cy: pos.y }} transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.55 }} r="12" fill="#F59E0B" opacity="0.22" />
              <motion.circle animate={{ cx: pos.x, cy: pos.y }} transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.55 }} r="6" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
            </>
          ) : (
            <>
              <motion.line animate={{ x1: moonPos.x, x2: moonPos.x }} transition={{ type: "spring", stiffness: 180, damping: 24 }} y1={moonPos.y} y2="130" stroke="#64748B" strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />
              <motion.circle data-testid="moon-path-marker" animate={{ cx: moonPos.x, cy: moonPos.y }} transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }} r="12" fill="#64748B" opacity="0.18" />
              <motion.circle animate={{ cx: moonPos.x, cy: moonPos.y }} transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.55 }} r="6" fill="#64748B" stroke="#FFFFFF" strokeWidth="1.5" />
            </>
          )}

          <text x="300" y="184" textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono, monospace">
            {isDay ? "Daily solar path" : `${moon?.phase || "Moon"} · ${moon?.illumination ?? "—"}% illumination`}
          </text>
        </svg>
      )}
    </motion.section>
  );
}
