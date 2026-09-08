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

export default function SunArc({ sun, moon, time, onTimeChange, loading }) {
  const rise = sun ? toMin(sun.sunrise) : 0;
  const setM = sun ? toMin(sun.sunset) : 1;
  const now = toMin(time || "12:00");
  const isDay = Boolean(sun && sun.altitude != null && sun.altitude >= 0 && now >= rise && now <= setM);
  const dayT = Math.min(1, Math.max(0, (now - rise) / (setM - rise || 1)));
  const nightT = now < rise ? now / Math.max(rise, 1) : (now - setM) / Math.max(1440 - setM, 1);
  const pos = pt(dayT);
  const nightPos = pt(Math.min(1, Math.max(0, nightT)));
  const altitude = Number.isFinite(Number(sun?.altitude)) ? Number(sun.altitude) : null;
  const altitudeLabel = altitude == null ? "—" : `Altitude ${altitude.toFixed(1)}°`;
  const sunX = isDay ? pos.x : 560;
  const sunY = isDay ? pos.y : 152;
  const moonX = nightPos.x;
  const moonY = Math.max(18, nightPos.y - 4);
  const activeTime = Math.min(1439, Math.max(0, now));

  const ticks = sun
    ? [
        { lx: 24, x: 38, anchor: "end", label: "Fajar", time: sun.dawn, small: true },
        { lx: 40, x: 46, anchor: "start", label: "Terbit", time: sun.sunrise },
        { lx: 300, x: 300, anchor: "middle", label: "Kulminasi", time: sun.noon },
        { lx: 560, x: 552, anchor: "end", label: "Surup", time: sun.sunset },
        { lx: 576, x: 594, anchor: "end", label: "Senja", time: sun.dusk, small: true },
      ]
    : [];

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
        <div className="h-[170px] animate-pulse rounded-lg bg-[#F8FAFC]" />
      ) : (
        <>
          <svg viewBox="0 0 600 170" className="w-full" data-testid="sun-arc-svg">
            <line x1="12" y1="130" x2="588" y2="130" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 40 130 Q 300 -70 560 130" fill="none" stroke={isDay ? "#F59E0B" : "#94A3B8"} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55" />
            {ticks.map((tk) => (
              <g key={tk.label}>
                <line x1={tk.lx} y1="126" x2={tk.lx} y2="134" stroke={tk.small ? "#CBD5E1" : "#94A3B8"} strokeWidth="1.5" />
                <text x={tk.x} y="147" textAnchor={tk.anchor} fontSize={tk.small ? "8.5" : "9.5"} fontWeight={tk.small ? "500" : "700"} fill={tk.small ? "#94A3B8" : "#475569"} style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{tk.label}</text>
                <text x={tk.x} y="159" textAnchor={tk.anchor} fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono, monospace">{tk.time}</text>
              </g>
            ))}
            {isDay ? (
              <>
                <motion.line animate={{ x1: sunX, x2: sunX }} transition={{ type: "spring", stiffness: 240, damping: 24 }} y1={sunY} y2="130" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
                <motion.circle data-testid="sun-arc-marker" animate={{ cx: sunX, cy: sunY }} transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.55 }} r="10" fill="#F59E0B" opacity="0.22" />
                <motion.circle animate={{ cx: sunX, cy: sunY }} transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.55 }} r="5.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
              </>
            ) : (
              <motion.g animate={{ x: moonX - 300, y: moonY - 80 }} transition={{ type: "spring", stiffness: 180, damping: 24 }}>
                <circle cx="300" cy="80" r="10" fill="#64748B" opacity="0.18" />
                <circle cx="300" cy="80" r="5.5" fill="#64748B" stroke="#FFFFFF" strokeWidth="1.5" />
              </motion.g>
            )}
          </svg>
          <div className="mt-2 flex items-center gap-3">
            <input
              aria-label="Selected time"
              type="range"
              min="0"
              max="1439"
              value={activeTime}
              onChange={(event) => {
                const value = Number(event.target.value);
                const hours = String(Math.floor(value / 60)).padStart(2, "0");
                const minutes = String(value % 60).padStart(2, "0");
                onTimeChange?.(`${hours}:${minutes}`);
              }}
              className="min-w-0 flex-1"
            />
            <span className="w-12 text-right font-mono text-[10px] text-[#64748B]">{moon?.phase || ""}</span>
          </div>
        </>
      )}
    </motion.section>
  );
}
