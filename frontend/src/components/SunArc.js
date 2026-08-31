import { motion } from "framer-motion";
import { Sun as SunIcon } from "lucide-react";

const toMin = (s) => {
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

export default function SunArc({ sun, time, loading }) {
  const rise = sun ? toMin(sun.sunrise) : 0;
  const setM = sun ? toMin(sun.sunset) : 1;
  const now = toMin(time || "12:00");
  const isDay = sun && now >= rise && now <= setM;
  const t = Math.min(1, Math.max(0, (now - rise) / (setM - rise || 1)));
  const pos = pt(t);
  const alt = Math.max(0, Math.round(Math.sin(t * Math.PI) * 100));
  const sunX = isDay ? pos.x : now < rise ? 40 : 560;
  const sunY = isDay ? pos.y : 152;

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
        <SunIcon className="h-4 w-4 text-[#F59E0B]" strokeWidth={1.8} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]">
          Sun Path
        </h2>
        <span className="ml-auto flex items-center gap-2">
          <span
            data-testid="sun-arc-altitude"
            className="rounded bg-[#F1F5F9] px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums text-[#475569]"
          >
            {sun ? (isDay ? `Altitude ~${alt}%` : "Di bawah horizon") : "—"}
          </span>
          <span className="rounded bg-[#0F172A] px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-white">
            {time}
          </span>
        </span>
      </div>

      {loading || !sun ? (
        <div className="h-[170px] animate-pulse rounded-lg bg-[#F8FAFC]" />
      ) : (
        <svg viewBox="0 0 600 170" className="w-full" data-testid="sun-arc-svg">
          <line x1="12" y1="130" x2="588" y2="130" stroke="#E2E8F0" strokeWidth="1.5" />
          <path
            d="M 40 130 Q 300 -70 560 130"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            opacity="0.55"
          />
          {ticks.map((tk) => (
            <g key={tk.label}>
              <line
                x1={tk.lx}
                y1="126"
                x2={tk.lx}
                y2="134"
                stroke={tk.small ? "#CBD5E1" : "#94A3B8"}
                strokeWidth="1.5"
              />
              <text
                x={tk.x}
                y="147"
                textAnchor={tk.anchor}
                fontSize={tk.small ? "8.5" : "9.5"}
                fontWeight={tk.small ? "500" : "700"}
                fill={tk.small ? "#94A3B8" : "#475569"}
                style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
              >
                {tk.label}
              </text>
              <text
                x={tk.x}
                y="159"
                textAnchor={tk.anchor}
                fontSize="9"
                fill="#94A3B8"
                fontFamily="JetBrains Mono, monospace"
              >
                {tk.time}
              </text>
            </g>
          ))}
          {isDay && (
            <line
              x1={sunX}
              y1={sunY}
              x2={sunX}
              y2="130"
              stroke="#F59E0B"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.4"
            />
          )}
          <motion.circle
            data-testid="sun-arc-marker"
            animate={{ cx: sunX, cy: sunY }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            r="10"
            fill={isDay ? "#F59E0B" : "#94A3B8"}
            opacity="0.22"
          />
          <motion.circle
            animate={{ cx: sunX, cy: sunY }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            r="5.5"
            fill={isDay ? "#F59E0B" : "#94A3B8"}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </motion.section>
  );
}
