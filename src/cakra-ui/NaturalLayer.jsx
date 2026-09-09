import { motion } from "framer-motion";
import { Moon, Sun, Leaf } from "lucide-react";
import SunArc from "./SunArc";
import { useLanguage } from "../core/LanguageContext";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const formatTime = (value) => (value ? String(value).slice(0, 5) : "—");

export default function NaturalLayer({ data, loading }) {
  const { t } = useLanguage();
  const sun = data?.natural?.sun || {};
  const moon = data?.natural?.moon || {};

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

  const activeTime = data?.selectedTime || data?.time?.local || "—";

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-[22px] border border-[#193C58] bg-[#020B15] p-4 shadow-[0_24px_80px_rgba(0,8,20,0.48)] sm:p-5 lg:p-6"
      data-testid="natural-layer-section"
    >
      <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(69,125,157,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(69,125,157,0.045)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="pointer-events-none absolute -left-28 top-36 h-96 w-96 rounded-full bg-[#FBBF24]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-[#60A5FA]/[0.08] blur-3xl" />

      <div className="relative z-10 flex items-start justify-between gap-4 border-b border-[#17364F] pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-[#67E8F9]" strokeWidth={1.7} />
            <h2 className="text-xl font-semibold tracking-tight text-[#D8FAFF] sm:text-2xl">Cakra Langit Sky Workspace</h2>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#5487A5]">{t("Real-time solar & lunar observation")}</p>
        </div>
        <div className="pt-1 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-[#71B9D7] sm:text-xs">Live observation</div>
      </div>

      <motion.div variants={item} className="relative z-10 mt-4 overflow-hidden rounded-[18px] border border-[#315A72]/80 bg-[radial-gradient(circle_at_50%_42%,rgba(56,189,248,0.08),transparent_27%),linear-gradient(180deg,#061625 0%,#03101D 62%,#020A13 100%)]">
        <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(126,154,174,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(126,154,174,0.11)_1px,transparent_1px)] [background-size:50px_50px]" />
        <div className="absolute inset-x-6 top-5 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.14em] text-[#64869D] sm:inset-x-8 sm:text-[10px]">
          <span>Cakra Langit Sky Workspace</span>
          <span>Live observation</span>
        </div>
        <div className="relative min-h-[520px] sm:min-h-[590px] lg:min-h-[640px]">
          {loading || !data ? (
            <div className="absolute inset-6 animate-pulse rounded-2xl border border-[#1C4966] bg-[#082238]/50" />
          ) : (
            <SunArc sun={sun} moon={moon} time={activeTime} loading={false} embedded />
          )}
        </div>
      </motion.div>

      <div className="relative z-10 mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-[18px] border border-[#A77A20] bg-[linear-gradient(135deg,rgba(251,191,36,0.13),rgba(8,18,28,0.96)_58%)] p-4 shadow-[0_0_24px_rgba(251,191,36,0.06)] sm:p-5">
          <div className="flex items-center gap-2 border-b border-[#5C4920] pb-3">
            <Sun className="h-5 w-5 text-[#FBBF24]" strokeWidth={1.8} />
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#F6D46A] sm:text-base">Solar Events</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-4 sm:grid-cols-5 sm:gap-y-0">
            {sunEvents.map(([label, value]) => (
              <div key={label} className="border-[#3C3521] sm:border-r sm:px-3 first:pl-0 last:border-r-0 last:pr-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-[#A99455]">{label}</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#E9F5FA]">{formatTime(value)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-[18px] border border-[#8AA8C4] bg-[linear-gradient(135deg,rgba(148,163,184,0.13),rgba(7,18,29,0.96)_58%)] p-4 shadow-[0_0_24px_rgba(148,163,184,0.06)] sm:p-5">
          <div className="flex items-center gap-2 border-b border-[#435A70] pb-3">
            <Moon className="h-5 w-5 text-[#D7E7F7]" strokeWidth={1.8} />
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#C8DDF2] sm:text-base">Lunar Events</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-4 sm:grid-cols-2 sm:gap-y-0">
            {moonEvents.map(([label, value]) => (
              <div key={label} className="border-[#3A4A5A] sm:border-r sm:px-4 first:pl-0 last:border-r-0 last:pr-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-[#829CB5]">{label}</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#E9F5FA]">{formatTime(value)}</p>
              </div>
            ))}
            {!moonEvents.length && <div className="col-span-full text-sm text-[#829CB5]">{t("No lunar events available")}</div>}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
