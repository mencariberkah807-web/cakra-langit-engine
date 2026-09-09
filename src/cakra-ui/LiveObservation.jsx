import { motion } from "framer-motion";
import { Eclipse, Moon, Sun } from "lucide-react";
import MoonPhaseCanvas from "./MoonPhaseCanvas";

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const formatDegrees = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(1)}°` : "—";
};

export default function LiveObservation({ data, onOpenEclipse }) {
  const sun = data?.natural?.sun || {};
  const moon = data?.natural?.moon || {};
  const eclipse = data?.natural?.eclipse || {};
  const eclipseToday = eclipse?.today || null;

  return (
    <div className="grid content-start gap-3">
      <motion.div variants={item} className="rounded-[18px] border border-[#315C7A] bg-[#061A2C]/90 p-4 shadow-[0_12px_38px_rgba(0,0,0,.2)]">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-[#BFDBFE]" strokeWidth={1.8} />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A7C9DE]">Moon live position</span>
        </div>
        <p className="mt-2 text-[10px] text-[#7296B0]">Az {formatDegrees(moon.azimuth)} · Alt {formatDegrees(moon.altitude)}</p>
        <div className="mt-3 flex items-center gap-3 border-t border-[#1B405D] pt-3">
          <MoonPhaseCanvas phase={moon.phase} illumination={moon.illumination} />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#E8F5FF]">{moon.phase || "—"}</p>
            <p className="mt-1 text-[10px] text-[#7296B0]">{moon.illumination ?? "—"}% illumination</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="rounded-[18px] border border-[#66521F] bg-[#17150D]/90 p-4">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-[#FBBF24]" strokeWidth={1.8} />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#F8D66D]">Sun live position</span>
        </div>
        <p className="mt-2 text-[10px] text-[#B69B50]">Az {formatDegrees(sun.azimuth)} · Alt {formatDegrees(sun.altitude)}</p>
      </motion.div>

      {eclipseToday && onOpenEclipse ? (
        <button type="button" onClick={onOpenEclipse} className="flex items-center justify-center gap-2 rounded-[14px] border border-[#4E4774] bg-[#0A1020]/80 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#C4B5FD] transition hover:border-[#8176B7]">
          <Eclipse className="h-3.5 w-3.5" strokeWidth={1.8} />
          Eclipse detail
        </button>
      ) : null}
    </div>
  );
}
