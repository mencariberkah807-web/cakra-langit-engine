import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function CalendarSystems({ data, loading, onOpenWeton }) {
  const calendars = data?.calendars || [];

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-2xl border border-[#163A5C] bg-[#06172B] p-5 shadow-[0_16px_40px_rgba(2,12,27,0.16)]"
      data-testid="calendar-systems-section"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#8ED8FF]" strokeWidth={1.8} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#C7D9EA]">
              Calendar Systems
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#7894AF]">Multiple traditional and modern systems</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 min-[640px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {loading || !data
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[112px] animate-pulse rounded-xl border border-[#163A5C] bg-[#0A2139]"
              />
            ))
          : calendars.map((cal) => (
              <motion.div
                key={cal.id}
                variants={item}
                whileHover={cal.future ? {} : { y: -3, transition: { duration: 0.2 } }}
                onClick={cal.id === "jawa" ? onOpenWeton : undefined}
                role={cal.id === "jawa" ? "button" : undefined}
                tabIndex={cal.id === "jawa" ? 0 : undefined}
                onKeyDown={
                  cal.id === "jawa"
                    ? (e) => (e.key === "Enter" || e.key === " ") && onOpenWeton()
                    : undefined
                }
                data-testid={`calendar-card-${cal.id}`}
                className={`group min-h-[112px] rounded-xl border p-3.5 transition-[border-color,background,box-shadow,transform] duration-200 ${
                  cal.future
                    ? "border-dashed border-[#244765] bg-[#081D32]"
                    : "border-[#1B4568] bg-gradient-to-b from-[#0B2742] to-[#071D32] hover:border-[#2C78A8] hover:shadow-[0_10px_24px_rgba(0,20,45,0.24)]"
                } ${cal.id === "jawa" ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#36C8FF] focus:ring-offset-2 focus:ring-offset-[#06172B]" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8CA6]">Calendar</p>
                  {cal.id === "jawa" ? <span className="text-[10px] text-[#67D7FF]">→</span> : null}
                </div>
                <p className="mt-1 text-sm font-semibold text-[#F3F8FC]">{cal.name}</p>

                {cal.future ? (
                  <p className="mt-3 text-[11px] font-medium text-[#718BA2]">Future engine</p>
                ) : (
                  <>
                    <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-tight text-[#DCEBFA]">
                      {cal.headline}
                    </p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.08em] text-[#7894AF]">{cal.sub}</p>
                    {cal.id === "jawa" ? (
                      <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[#55CCFF]">
                        Weton breakdown
                      </p>
                    ) : null}
                  </>
                )}
              </motion.div>
            ))}
      </div>
    </motion.section>
  );
}
