import { motion } from "framer-motion";
import { Eclipse, Moon, Sun, Waves } from "lucide-react";
import MoonPhaseCanvas from "./MoonPhaseCanvas";

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const formatDegrees = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(1)}°` : "—";
};

function ContextCard({ label, result, accent, expanded }) {
  return (
    <motion.article variants={item} className={`rounded-[18px] border p-4 shadow-[0_12px_38px_rgba(0,0,0,.2)] ${accent}`}>
      <p className={expanded ? "text-[11px] font-bold uppercase tracking-[0.14em] text-[#88AFC6]" : "text-[9px] font-bold uppercase tracking-[0.14em] text-[#7895A8]"}>
        {label}
      </p>
      <p className={expanded ? "mt-2 text-base font-semibold text-[#F0FAFF]" : "mt-2 text-sm font-semibold text-[#E8F5FF]"}>
        {result?.primary || result?.context || result?.skyState || result?.title || "—"}
      </p>
      {(result?.secondary || result?.bortle || result?.annual_pct != null || result?.progress != null) ? (
        <p className={expanded ? "mt-1 text-xs text-[#7FA1B8]" : "mt-1 text-[10px] text-[#6F8EA4]"}>
          {result.secondary || (result?.bortle ? `Bortle ${result.bortle}` : result?.annual_pct != null ? `${result.annual_pct}% of annual cycle` : `${result.progress}% of annual cycle`)}
        </p>
      ) : null}
    </motion.article>
  );
}

export default function LiveObservation({ data, onOpenEclipse, expanded = false }) {
  const sun = data?.natural?.sun || {};
  const moon = data?.natural?.moon || {};
  const sky = data?.natural?.sky || {};
  const earth = data?.natural?.earth || {};
  const tide = data?.natural?.tide || {};
  const eclipse = data?.natural?.eclipse || {};
  const eclipseToday = eclipse?.today || null;

  const labelClass = expanded ? "text-[11px] font-bold uppercase tracking-[0.12em]" : "text-[10px] font-bold uppercase tracking-[0.12em]";
  const valueClass = expanded ? "mt-2 text-base font-semibold" : "mt-2 text-sm font-semibold";

  return (
    <div className="grid content-start gap-3">
      <motion.div variants={item} className="rounded-[18px] border border-[#66521F] bg-[linear-gradient(135deg,rgba(245,158,11,.16),rgba(23,21,13,.94))] p-4 shadow-[0_12px_38px_rgba(0,0,0,.2)]">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-[#FBBF24]" strokeWidth={1.8} />
          <span className={`${labelClass} text-[#F8D66D]`}>Sun live position</span>
        </div>
        <p className={`${expanded ? "mt-3 text-sm" : "mt-2 text-[10px]"} text-[#C5A95B]`}>
          Az {formatDegrees(sun.azimuth)} · Alt {formatDegrees(sun.altitude)}
        </p>
      </motion.div>

      <motion.div variants={item} className="rounded-[18px] border border-[#315C7A] bg-[linear-gradient(135deg,rgba(37,99,235,.14),rgba(6,26,44,.94))] p-4 shadow-[0_12px_38px_rgba(0,0,0,.2)]">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-[#BFDBFE]" strokeWidth={1.8} />
          <span className={`${labelClass} text-[#B5D8EC]`}>Moon live position</span>
        </div>
        <p className={`${expanded ? "mt-3 text-sm" : "mt-2 text-[10px]"} text-[#83A8C2]`}>
          Az {formatDegrees(moon.azimuth)} · Alt {formatDegrees(moon.altitude)}
        </p>
        <div className="mt-3 flex items-center gap-3 border-t border-[#1B405D] pt-3">
          <MoonPhaseCanvas phase={moon.phase} illumination={moon.illumination} />
          <div className="min-w-0">
            <p className={expanded ? "text-sm font-semibold text-[#F0FAFF]" : "text-xs font-semibold text-[#E8F5FF]"}>{moon.phase || "—"}</p>
            <p className={expanded ? "mt-1 text-xs text-[#83A8C2]" : "mt-1 text-[10px] text-[#7296B0]"}>{moon.illumination ?? "—"}% illumination</p>
          </div>
        </div>
      </motion.div>

      <ContextCard label="Sky" result={sky} expanded={expanded} accent="border-[#315C7A] bg-[linear-gradient(135deg,rgba(14,165,233,.11),rgba(6,26,44,.94))]" />
      <ContextCard label="Earth Space" result={earth} expanded={expanded} accent="border-[#315C5A] bg-[linear-gradient(135deg,rgba(16,185,129,.11),rgba(6,28,26,.94))]" />

      {eclipseToday && onOpenEclipse ? (
        <button type="button" onClick={onOpenEclipse} className="flex items-center justify-center gap-2 rounded-[14px] border border-[#4E4774] bg-[#0A1020]/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#C4B5FD] transition hover:border-[#8176B7]">
          <Eclipse className="h-4 w-4" strokeWidth={1.8} />
          Eclipse detail
        </button>
      ) : null}

      <motion.article variants={item} className="rounded-[18px] border border-[#4E5564] bg-[linear-gradient(135deg,rgba(56,189,248,.08),rgba(10,20,32,.94))] p-4 shadow-[0_12px_38px_rgba(0,0,0,.2)]">
        <div className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-[#8FB7CC]" strokeWidth={1.8} />
          <span className={`${labelClass} text-[#B7D0DE]`}>Tide · Ocean</span>
        </div>
        <p className={`${valueClass} text-[#F0FAFF]`}>
          {tide?.available === false ? "Tide model unavailable" : tide?.status || tide?.location || "—"}
        </p>
        {tide?.reason ? <p className={expanded ? "mt-1 text-xs text-[#7898AD]" : "mt-1 text-[10px] text-[#6F8EA4]"}>{tide.reason}</p> : null}
        {tide?.ocean ? (
          <div className="mt-3 border-t border-[#263746] pt-3">
            <p className={expanded ? "text-[10px] font-bold uppercase tracking-[0.12em] text-[#7698AE]" : "text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8EA4]"}>Marine observation</p>
            <p className={expanded ? "mt-1 text-sm font-semibold text-[#F0FAFF]" : "mt-1 text-xs font-semibold text-[#E8F5FF]"}>{tide.ocean.available === false ? "No marine data" : tide.ocean.primary || "—"}</p>
            <p className={expanded ? "mt-1 text-xs text-[#7898AD]" : "mt-1 text-[10px] text-[#6F8EA4]"}>{tide.ocean.secondary || "Open-Meteo Marine API"}</p>
            <div className="mt-2 grid gap-1.5">
              {(tide.ocean.details || []).slice(0, 2).map((detail) => (
                <div key={detail.label} className={expanded ? "flex min-w-0 justify-between gap-2 text-[10px]" : "flex min-w-0 justify-between gap-2 text-[8px]"}>
                  <span className="truncate text-[#52748A]">{detail.label}</span>
                  <span className="truncate text-right text-[#88A5B6]">{String(detail.value ?? "—")}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </motion.article>
    </div>
  );
}
