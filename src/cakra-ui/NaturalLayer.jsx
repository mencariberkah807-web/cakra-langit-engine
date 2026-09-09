import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import SunArc from "./SunArc";
import LiveObservation from "./LiveObservation";

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const formatTime = (value, seconds = false) => {
  if (!value) return "—";
  const text = String(value);
  return seconds ? text.slice(0, 8) : text.slice(0, 5);
};

export default function NaturalLayer({ data, loading, onOpenEclipse }) {
  const sun = data?.natural?.sun || {};
  const moon = data?.natural?.moon || {};
  const activeTime = data?.selectedTime || data?.time?.local || "—";
  const dateLabel = data?.date_info?.date_long || data?.date_info?.date || "—";

  const sunEvents = [
    ["FAJAR", sun.dawn],
    ["TERBIT", sun.sunrise],
    ["KULMINASI", sun.noon],
    ["SURUP", sun.sunset],
    ["SENJA", sun.dusk],
  ].filter(([, value]) => value);

  const moonEvents = [
    ["TRANSIT", moon.transit],
    ["MOONSET", moon.set],
  ].filter(([, value]) => value);

  return (
    <motion.section
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-[24px] border border-[#164C69] bg-[#020B14] shadow-[0_28px_90px_rgba(1,9,20,0.55)]"
      data-testid="natural-layer-section"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_10%,rgba(14,165,233,0.09),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(59,130,246,0.08),transparent_30%),linear-gradient(180deg,#061523_0%,#020A12_70%,#020811_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(89,142,171,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(89,142,171,0.055)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10 flex items-center justify-between gap-4 border-b border-[#173B55] px-5 py-5 sm:px-7 lg:px-8">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-[0.08em] text-[#9FEFFF] sm:text-xl lg:text-[22px]">
            Cakra Langit Sky Workspace
          </h2>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#4D809D]">{dateLabel}</p>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7AB2CC] sm:text-[10px]">
          <span className="h-2 w-2 rounded-full bg-[#67E8A5] shadow-[0_0_12px_rgba(103,232,165,.75)]" />
          Live observation
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-3 p-3 sm:p-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.72fr)] lg:p-6">
        <motion.div variants={item} className="relative min-h-[430px] overflow-hidden rounded-[20px] border border-[#1B4E6A] bg-[radial-gradient(circle_at_50%_42%,rgba(56,189,248,0.1),transparent_27%),radial-gradient(circle_at_50%_72%,rgba(124,58,237,0.08),transparent_34%),linear-gradient(180deg,#061625_0%,#03101D_62%,#020A13_100%)]" aria-label="Celestial sky workspace">
          <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(126,154,174,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(126,154,174,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.16em] text-[#527D95] sm:inset-x-5 sm:text-[9px]">
            <span>Cakra Langit Sky Workspace</span>
            <span>Live observation</span>
          </div>
          <div className="relative h-[430px] sm:h-[500px] lg:h-[530px]">
            {loading || !data ? (
              <div className="absolute inset-5 animate-pulse rounded-xl border border-[#1C4966] bg-[#082238]/50" />
            ) : (
              <SunArc sun={sun} moon={moon} time={activeTime} loading={false} embedded />
            )}
          </div>
        </motion.div>

        <LiveObservation data={data} onOpenEclipse={onOpenEclipse} />
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-3 px-3 pb-5 sm:px-5 lg:grid-cols-2 lg:px-6 lg:pb-6">
        <motion.div variants={item} className="rounded-[18px] border border-[#80641E] bg-[linear-gradient(135deg,rgba(251,191,36,0.13),rgba(6,17,27,0.94)_62%)] p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-[#4B3B1C] pb-3">
            <Sun className="h-5 w-5 text-[#FBBF24]" strokeWidth={1.8} />
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#F8D66D]">Solar Events</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {sunEvents.map(([label, value]) => (
              <div key={label} className="sm:border-r sm:border-[#3A3523] sm:pr-2 last:border-r-0">
                <p className="text-[9px] font-medium text-[#A89155]">{label}</p>
                <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#EDF9FF] sm:text-lg">{formatTime(value)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-[18px] border border-[#5579A4] bg-[linear-gradient(135deg,rgba(96,165,250,0.13),rgba(7,18,29,0.94)_62%)] p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-[#29425E] pb-3">
            <Moon className="h-5 w-5 text-[#BFD7FF]" strokeWidth={1.8} />
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#BFD7FF]">Lunar Events</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {moonEvents.length ? moonEvents.map(([label, value]) => (
              <div key={label}>
                <p className="text-[9px] font-medium text-[#7895B3]">{label}</p>
                <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#EDF9FF]">{formatTime(value)}</p>
              </div>
            )) : (
              <div className="col-span-full flex items-center justify-between gap-4">
                <div><p className="text-[9px] text-[#7895B3]">PHASE</p><p className="mt-1 text-sm font-semibold text-[#EDF9FF]">{moon.phase || "—"}</p></div>
                <div><p className="text-[9px] text-[#7895B3]">ILLUMINATION</p><p className="mt-1 font-mono text-base font-semibold text-[#EDF9FF]">{moon.illumination ?? "—"}%</p></div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
