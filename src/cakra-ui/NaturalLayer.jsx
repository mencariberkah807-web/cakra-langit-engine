import { motion } from "framer-motion";
import { Sun, Moon, Eclipse, Sparkles, Globe, Waves, Leaf, Cloud, Magnet, Radiation, Wind, Mountain, Activity, Droplets, LockKeyhole } from "lucide-react";
import MoonPhaseCanvas from "./MoonPhaseCanvas";
import SunArc from "./SunArc";
import { useLanguage } from "../core/LanguageContext";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function buildCards(n, t) {
  return [
    { id: "sun", icon: Sun, label: "SUN", title: `${t("Sunrise")} ${n.sun.sunrise}`, sub: `${t("Sunset")} ${n.sun.sunset}`, accent: "#FBBF24" },
    { id: "moon", icon: Moon, label: "MOON", title: n.moon.phase, sub: `${t("Age")} ${n.moon.age} ${t("days")} · ${n.moon.illumination}%`, accent: "#A5B4FC" },
    { id: "eclipse", icon: Eclipse, label: "ECLIPSE", title: n.eclipse.today ? n.eclipse.today.type : t("No eclipse event"), sub: n.eclipse.today ? n.eclipse.today.visibilityRegion || t("Visibility data available") : t("No event today"), accent: "#C4B5FD" },
    { id: "sky", icon: Sparkles, label: "SKY", title: n.sky.context || n.sky.primary || "—", sub: `${n.sky.bortle || "—"} · ${n.sky.moonlight || "—"} ${t("moonlight")}`, accent: "#38BDF8" },
    { id: "earth", icon: Globe, label: "EARTH SPACE", title: `${t("Day")} ${n.earth.day_of_year ?? "—"}`, sub: `${n.earth.annual_pct ?? "—"}% ${t("of annual cycle")}`, accent: "#4ADE80" },
    { id: "tide", icon: Waves, label: "TIDE", title: n.tide.high?.[0] ? `HIGH ${n.tide.high[0].time.slice(11, 16)} · ${n.tide.high[0].height_m}m` : t("No high tide"), sub: n.tide.low?.[0] ? `LOW ${n.tide.low[0].time.slice(11, 16)} · ${n.tide.low[0].height_m}m` : `${t("No low tide")} · ${n.tide.region || "—"}`, accent: "#38BDF8" },
  ];
}

const futureEngines = [
  ["atmosphere", Cloud, "Atmosphere"],
  ["weather", Cloud, "Weather"],
  ["geomagnetic", Magnet, "Geomagnetic"],
  ["radiation", Radiation, "Radiation"],
  ["air-quality", Wind, "Air Quality"],
  ["volcanic", Mountain, "Volcanic"],
  ["seismic", Activity, "Seismic"],
  ["ocean", Droplets, "Ocean"],
];

export default function NaturalLayer({ data, loading, onOpenEclipse }) {
  const { t } = useLanguage();
  const cards = data ? buildCards(data.natural, t) : [];

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-2xl border border-[#173B60] bg-[radial-gradient(circle_at_38%_36%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_74%_18%,rgba(124,58,237,0.2),transparent_30%),linear-gradient(160deg,#061525_0%,#071D34_48%,#020A14_100%)] p-5 shadow-[0_24px_70px_rgba(2,12,27,0.4)]"
      data-testid="natural-layer-section"
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[8%] top-[18%] h-1 w-1 rounded-full bg-white shadow-[90px_35px_0_0_rgba(255,255,255,.55),170px_-20px_0_0_rgba(255,255,255,.35),280px_50px_0_0_rgba(255,255,255,.45),390px_5px_0_0_rgba(255,255,255,.3),510px_65px_0_0_rgba(255,255,255,.4)]" />
        <div className="absolute bottom-0 left-0 h-[42%] w-[72%] bg-[linear-gradient(145deg,transparent_20%,rgba(4,17,30,.9)_21%,rgba(7,28,47,.96)_58%,rgba(2,10,18,1)_59%)] [clip-path:polygon(0_55%,15%_32%,25%_46%,38%_16%,51%_42%,64%_24%,77%_48%,88%_28%,100%_54%,100%_100%,0_100%)]" />
        <div className="absolute bottom-0 left-0 h-[25%] w-full bg-[linear-gradient(180deg,transparent,rgba(1,7,13,.94))]" />
      </div>

      <div className="relative z-20 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-[#38BDF8]" strokeWidth={1.8} />
            <h2 className="text-sm font-semibold tracking-tight text-white">Sky Overview</h2>
          </div>
          <p className="mt-1 text-[11px] text-[#9DB6D0]">Real-time celestial position for your observation</p>
        </div>
        <span className="rounded-full border border-[#315A7E] bg-[#071A2E]/75 px-3 py-1 text-[10px] font-medium text-[#B7CBE0] backdrop-blur-sm">
          Natural Layer
        </span>
      </div>

      <div className="relative z-20 mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="relative min-h-[300px] overflow-hidden rounded-xl border border-[#315A7E]/70 bg-[radial-gradient(circle_at_50%_34%,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_50%_58%,rgba(124,58,237,0.11),transparent_34%),linear-gradient(180deg,rgba(3,17,31,.18),rgba(3,12,23,.62))]" aria-label="Celestial sky workspace">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-[12%] top-[26%] h-1 w-1 rounded-full bg-white shadow-[120px_42px_0_0_rgba(255,255,255,.5),250px_-18px_0_0_rgba(255,255,255,.35),390px_70px_0_0_rgba(255,255,255,.4)]" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#315A7E]/35 shadow-[0_0_90px_rgba(56,189,248,0.08)]" />
          <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#315A7E]/30" />
          <div className="absolute inset-x-6 bottom-10 border-t border-[#6A87A0]/30" />
          <div className="absolute left-6 top-5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#718CA8]">Cakra Langit Sky Workspace</div>
          <div className="absolute right-6 top-5 text-right text-[9px] uppercase tracking-[0.12em] text-[#607B94]">Live observation</div>
          <SunArc sun={data?.natural?.sun} moon={data?.natural?.moon} time={data?.selectedTime || data?.time?.local || "12:00:00"} loading={loading || !data} embedded />
        </div>
        <div className="grid content-start gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          {loading || !data ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[82px] animate-pulse rounded-xl border border-[#234663] bg-[#0A2238]/70" />) : cards.slice(0, 4).map((c) => {
            const isMoon = c.id === "moon";
            const isEclipse = c.id === "eclipse";
            const cardClass = "group rounded-xl border border-[#315A7E]/75 bg-[#071A2E]/78 p-3 text-left backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-[#4A789D] hover:bg-[#0A2540] hover:shadow-[0_10px_28px_rgba(0,0,0,.22)]";
            const content = <><div className="flex items-center gap-1.5"><c.icon className="h-3.5 w-3.5" style={{ color: c.accent }} strokeWidth={2} /><span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#B7CBE0]">{c.label}</span></div><p className="mt-2 text-xs font-semibold leading-tight text-white">{c.title}</p><p className="mt-1 text-[10px] leading-snug text-[#91A9C0]">{c.sub}</p>{isMoon ? <MoonPhaseCanvas phase={data.natural.moon.phase} illumination={data.natural.moon.illumination} /> : null}<div className="mt-2 h-0.5 w-5 rounded-full transition-all duration-300 group-hover:w-8" style={{ backgroundColor: c.accent }} /></>;
            return <motion.div key={c.id} variants={item}>{isEclipse ? <button type="button" onClick={onOpenEclipse} className={`${cardClass} w-full cursor-pointer`} data-testid="natural-card-eclipse">{content}</button> : <div className={cardClass} data-testid={`natural-card-${c.id}`}>{content}</div>}</motion.div>;
          })}
        </div>
      </div>

      <div className="relative z-20 mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {cards.slice(4).map((c) => {
          const cardClass = "group flex min-h-[82px] items-center gap-3 rounded-xl border border-[#315A7E]/75 bg-[#071A2E]/78 p-3 text-left backdrop-blur-md";
          return <div key={c.id} className={cardClass} data-testid={`natural-card-${c.id}`}><c.icon className="h-4 w-4 shrink-0" style={{ color: c.accent }} strokeWidth={2} /><div className="min-w-0"><span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#B7CBE0]">{c.label}</span><p className="mt-1 truncate text-xs font-semibold text-white">{c.title}</p><p className="mt-0.5 truncate text-[10px] text-[#91A9C0]">{c.sub}</p></div><span className="ml-auto h-0.5 w-5 shrink-0 rounded-full" style={{ backgroundColor: c.accent }} /></div>;
        })}
      </div>

      <div className="relative z-20 mt-4 border-t border-[#173B60] pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#C7D9EA]">Nature Layer · Future Engines</h3>
            <p className="mt-1 text-[10px] text-[#718CA8]">Extended natural environment data</p>
          </div>
          <LockKeyhole className="h-3.5 w-3.5 text-[#6F8CA6]" strokeWidth={1.8} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {futureEngines.map(([id, Icon, label]) => (
            <div key={id} className="rounded-xl border border-dashed border-[#244765] bg-[#071A2E]/60 p-3 opacity-90" data-testid={`future-natural-${id}`}>
              <Icon className="h-4 w-4 text-[#6F8CA6]" strokeWidth={1.8} />
              <p className="mt-2 text-[10px] font-semibold text-[#B7CBE0]">{label}</p>
              <p className="mt-1 text-[9px] uppercase tracking-wide text-[#607B94]">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
