import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";

const CAT_COLORS = { SOLAR: "#F59E0B", SKY: "#7C3AED" };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, x: 14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function ScheduleTimeline({ data, loading, time }) {
  const events = data?.schedule || [];
  const nextIdx = events.findIndex((e) => e.time >= time);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      data-testid="schedule-timeline-container"
    >
      <div className="mb-1 flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-[#475569]" strokeWidth={1.8} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]">
          My Schedule
        </h2>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold tracking-[-0.01em]">Timeline</h3>
        <span
          data-testid="schedule-count-badge"
          className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-semibold text-[#475569]"
        >
          {events.length} events
        </span>
      </div>

      {loading || !data ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-[#F8FAFC]" />
          ))}
        </div>
      ) : (
        <motion.ol variants={container} initial="hidden" animate="show" className="relative">
          <div className="absolute bottom-3 left-[66px] top-3 w-px bg-[#E2E8F0]" />
          {events.map((e, i) => {
            const color = CAT_COLORS[e.cat] || "#64748B";
            const isNext = i === nextIdx;
            return (
              <motion.li
                key={`${e.time}-${e.title}`}
                variants={item}
                data-testid="schedule-item-row"
                className={`relative flex items-start gap-4 rounded-lg px-1 py-3 transition-colors duration-150 ${
                  isNext ? "bg-[#F8FAFC]" : "hover:bg-[#F8FAFC]"
                }`}
              >
                <span className="w-10 shrink-0 pt-0.5 text-right font-mono text-[13px] font-medium tabular-nums text-[#0F172A]">
                  {e.time}
                </span>
                <span
                  className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 bg-white"
                  style={{ borderColor: color }}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold leading-tight">{e.title}</p>
                    <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#475569]">
                      {e.cat}
                    </span>
                    {isNext && (
                      <span
                        data-testid="schedule-next-chip"
                        className="rounded bg-[#0F172A] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white"
                      >
                        Up next
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#475569]">{e.sub}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      )}
    </motion.section>
  );
}
