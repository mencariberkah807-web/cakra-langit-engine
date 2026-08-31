import { motion } from "framer-motion";
import { Sun, Moon, Eclipse, Sparkles, Globe, Waves, Leaf } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function buildCards(n) {
  return [
    {
      id: "sun", icon: Sun, label: "SUN",
      title: `Sunrise ${n.sun.sunrise}`, sub: `Sunset ${n.sun.sunset}`,
      accent: "#F59E0B", bg: "#FEF3C7",
    },
    {
      id: "moon", icon: Moon, label: "MOON",
      title: n.moon.phase, sub: `Age ${n.moon.age} days · ${n.moon.illumination}%`,
      accent: "#2563EB", bg: "#DBEAFE",
    },
    {
      id: "eclipse", icon: Eclipse, label: "ECLIPSE",
      title: n.eclipse.today ? n.eclipse.today.type : "No eclipse event",
      sub: n.eclipse.today ? n.eclipse.today.visibility : "No event today",
      accent: "#7C3AED", bg: "#EDE9FE",
    },
    {
      id: "sky", icon: Sparkles, label: "SKY",
      title: n.sky.context, sub: `${n.sky.bortle} · ${n.sky.moonlight} moonlight`,
      accent: "#0284C7", bg: "#E0F2FE",
    },
    {
      id: "earth", icon: Globe, label: "EARTH SPACE",
      title: `Day ${n.earth.day_of_year}`, sub: `${n.earth.annual_pct}% of annual cycle`,
      accent: "#16A34A", bg: "#DCFCE7",
    },
    {
      id: "tide", icon: Waves, label: "TIDE",
      title: "Tide data requires", sub: `local model · ${n.tide.region}`,
      accent: "#64748B", bg: "#F1F5F9",
    },
  ];
}

export default function NaturalLayer({ data, loading }) {
  const cards = data ? buildCards(data.natural) : [];

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      data-testid="natural-layer-section"
    >
      <div className="mb-4 flex items-center gap-2">
        <Leaf className="h-4 w-4 text-[#16A34A]" strokeWidth={1.8} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]">
          Natural Layer
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-6">
        {loading || !data
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[104px] animate-pulse rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
              />
            ))
          : cards.map((c) => (
              <motion.div
                key={c.id}
                variants={item}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                data-testid={`natural-card-${c.id}`}
                className="group rounded-lg border border-[#E2E8F0] bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center gap-1.5">
                  <c.icon className="h-3.5 w-3.5" style={{ color: c.accent }} strokeWidth={2} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#475569]">
                    {c.label}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-tight">{c.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-[#475569]">{c.sub}</p>
                <div
                  className="mt-3 h-0.5 w-6 rounded-full transition-[width] duration-300 group-hover:w-10"
                  style={{ backgroundColor: c.accent }}
                />
              </motion.div>
            ))}
      </div>
    </motion.section>
  );
}
