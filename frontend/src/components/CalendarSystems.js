import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function CalendarSystems({ data, loading }) {
  const calendars = data?.calendars || [];

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      data-testid="calendar-systems-section"
    >
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-[#475569]" strokeWidth={1.8} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]">
          Calendar Systems
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3.5 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {loading || !data
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] animate-pulse rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
              />
            ))
          : calendars.map((cal) => (
              <motion.div
                key={cal.id}
                variants={item}
                whileHover={cal.future ? {} : { y: -3, transition: { duration: 0.2 } }}
                data-testid={`calendar-card-${cal.id}`}
                className={`rounded-lg border p-4 ${
                  cal.future
                    ? "border-dashed border-[#E2E8F0] bg-[#F8FAFC]"
                    : "border-[#E2E8F0] bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
                  Calendar
                </p>
                <p className="mt-1 text-sm font-semibold">{cal.name}</p>
                {cal.future ? (
                  <p className="mt-3 text-[11px] font-medium text-[#94A3B8]">
                    Future engine
                  </p>
                ) : (
                  <>
                    <p className="mt-3 text-[13px] font-semibold leading-tight">
                      {cal.headline}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[#475569]">
                      {cal.sub}
                    </p>
                    <div className="mt-3 space-y-1.5 border-t border-[#F1F5F9] pt-3">
                      {cal.fields.map((f) => (
                        <div
                          key={f.k}
                          className="flex items-baseline justify-between gap-2 text-[11px]"
                        >
                          <span className="text-[#94A3B8]">{f.k}</span>
                          <span className="text-right font-medium text-[#0F172A]">
                            {f.v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
      </div>
    </motion.section>
  );
}
