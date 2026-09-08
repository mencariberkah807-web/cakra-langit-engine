import { motion } from "framer-motion";
import { Sun, Moon, Eclipse, Sparkles, Globe, Waves, Leaf } from "lucide-react";
import MoonPhaseCanvas from "./MoonPhaseCanvas";
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
    { id: "sun", icon: Sun, label: "SUN", title: `${t("Sunrise")} ${n.sun.sunrise}`, sub: `${t("Sunset")} ${n.sun.sunset}`, accent: "#F59E0B", bg: "#FEF3C7" },
    { id: "moon", icon: Moon, label: "MOON", title: n.moon.phase, sub: `${t("Age")} ${n.moon.age} ${t("days")} · ${n.moon.illumination}%`, accent: "#60A5FA", bg: "#DBEAFE" },
    { id: "eclipse", icon: Eclipse, label: "ECLIPSE", title: n.eclipse.today ? n.eclipse.today.type : t("No eclipse event"), sub: n.eclipse.today ? n.eclipse.today.visibilityRegion || t("Visibility data available") : t("No event today"), accent: "#A78BFA", bg: "#EDE9FE" },
    { id: "sky", icon: Sparkles, label: "SKY", title: n.sky.context || n.sky.primary || "—", sub: `${n.sky.bortle || "—"} · ${n.sky.moonlight || "—"} ${t("moonlight")}`, accent: "#38BDF8", bg: "#E0F2FE" },
    { id: "earth", icon: Globe, label: "EARTH SPACE", title: `${t("Day")} ${n.earth.day_of_year ?? "—"}`, sub: `${n.earth.annual_pct ?? "—"}% ${t("of annual cycle")}`, accent: "#4ADE80", bg: "#DCFCE7" },
    { id: "tide", icon: Waves, label: "TIDE", title: n.tide.high?.[0] ? `HIGH ${n.tide.high[0].time.slice(11, 16)} · ${n.tide.high[0].height_m}m` : t("No high tide"), sub: n.tide.low?.[0] ? `LOW ${n.tide.low[0].time.slice(11, 16)} · ${n.tide.low[0].height_m}m` : `${t("No low tide")} · ${n.tide.region || "—"}`, accent: "#38BDF8", bg: "#E0F2FE" },
  ];
}

export default function NaturalLayer({ data, loading, onOpenEclipse }) {
  const { t } = useLanguage();
  const cards = data ? buildCards(data.natural, t) : [];

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="overflow-hidden rounded-2xl border border-[#163452] bg-[radial-gradient(circle_at_50%_18%,rgba(14,165,233,0.16),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(124,58,237,0.12),transparent_34%),#071827] p-5 shadow-[0_18px_50px_rgba(2,12,27,0.28)]"
      data-testid="natural-layer-section"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-[#38BDF8]" strokeWidth={1.8} />
            <h2 className="text-sm font-semibold tracking-tight text-white">Sky Overview</h2>
          </div>
          <p className="mt-1 text-[11px] text-[#8EA7C2]">Real-time celestial context for your observation</p>
        </div>
        <span className="hidden rounded-full border border-[#24496B] bg-[#0B2239]/80 px-3 py-1 text-[10px] font-medium text-[#8EA7C2] sm:inline-flex">
          Natural Layer
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        {loading || !data ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[118px] animate-pulse rounded-xl border border-[#173957] bg-[#0B2239]/70" />) : cards.map((c) => {
          const isMoon = c.id === "moon";
          const isEclipse = c.id === "eclipse";
          const cardClass = "group rounded-xl border border-[#24496B] bg-[#0B2239]/72 p-3.5 text-left backdrop-blur-sm transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#3A6D96] hover:bg-[#102C46] hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)]";
          const content = <><div className="flex items-center gap-1.5"><c.icon className="h-3.5 w-3.5" style={{ color: c.accent }} strokeWidth={2} /><span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A9BED3]">{c.label}</span></div><p className="mt-3 text-sm font-semibold leading-tight text-white">{c.title}</p><p className="mt-1 text-[11px] leading-snug text-[#8EA7C2]">{c.sub}</p>{isMoon ? <MoonPhaseCanvas phase={data.natural.moon.phase} illumination={data.natural.moon.illumination} /> : null}<div className="mt-3 h-0.5 w-6 rounded-full transition-[width] duration-300 group-hover:w-10" style={{ backgroundColor: c.accent }} /></>;
          return <motion.div key={c.id} variants={item}>{isEclipse ? <button type="button" onClick={onOpenEclipse} className={`${cardClass} w-full cursor-pointer`} data-testid="natural-card-eclipse">{content}</button> : <div className={cardClass} data-testid={`natural-card-${c.id}`}>{content}</div>}</motion.div>;
        })}
      </div>
    </motion.section>
  );
}
