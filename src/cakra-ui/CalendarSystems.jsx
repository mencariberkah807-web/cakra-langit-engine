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

const CALENDAR_ROUTES = {
  bali: "/dashboard/palelintangan",
  jawa: "/dashboard/weton",
  "chinese-lunar": "/dashboard/bazi",
  "saka-sunda": "/dashboard/paririmbon",
};

const CALENDAR_LABELS = {
  bali: "Palelintangan →",
  jawa: "Weton →",
  "chinese-lunar": "BaZi →",
  "saka-sunda": "Paririmbon →",
};

export default function CalendarSystems({ data }) {
  const calendars = data?.calendars || [];

  const openCalendar = (id) => {
    const href = CALENDAR_ROUTES[id];
    if (href) window.location.href = href;
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-2xl border border-[#163A5C] bg-[#06172B] p-5 shadow-[0_16px_40px_rgba(2,12,27,0.16)]"
      data-testid="calendar-systems-section"
    >
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-[#8ED8FF]" strokeWidth={1.8} />
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#C7D9EA]">
            Calendar Systems
          </h2>
          <p className="mt-1 text-xs text-[#7894AF]">Today calculation snapshot</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[480px]:grid-cols-2 md:grid-cols-3">
        {!data
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-[220px] animate-pulse rounded-xl border border-[#163A5C] bg-[#0A2139]" />
            ))
          : calendars.map((cal) => {
              const href = CALENDAR_ROUTES[cal.id];
              const clickable = !cal.future && Boolean(href);

              return (
                <motion.div
                  key={cal.id}
                  variants={item}
                  whileHover={clickable ? { y: -3, transition: { duration: 0.2 } } : {}}
                  onClick={clickable ? () => openCalendar(cal.id) : undefined}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onKeyDown={clickable ? (e) => (e.key === "Enter" || e.key === " ") && openCalendar(cal.id) : undefined}
                  data-testid={`calendar-card-${cal.id}`}
                  className={`rounded-xl border p-4 transition-[border-color,background,box-shadow,transform] duration-200 ${cal.future ? "border-dashed border-[#244765] bg-[#081D32]" : "border-[#1B4568] bg-gradient-to-b from-[#0B2742] to-[#071D32] hover:border-[#2C78A8] hover:shadow-[0_10px_24px_rgba(0,20,45,0.24)]"} ${clickable ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#36C8FF] focus:ring-offset-2 focus:ring-offset-[#06172B]" : ""}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6F8CA6]">Calendar</p>
                  <p className="mt-1 text-sm font-semibold text-[#F3F8FC]">{cal.name}</p>
                  {cal.future ? (
                    <p className="mt-3 text-[11px] font-medium text-[#718BA2]">Future engine</p>
                  ) : (
                    <>
                      <p className="mt-3 text-[13px] font-semibold leading-tight text-[#DCEBFA]">{cal.headline}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[#7894AF]">{cal.sub}</p>
                      <div className="mt-3 space-y-1.5 border-t border-[#163A5C] pt-3">
                        {(cal.fields || []).map((f) => (
                          <div key={f.k} className="flex items-baseline justify-between gap-2 text-[11px]">
                            <span className="text-[#7894AF]">{f.k}</span>
                            <span className="text-right font-medium text-[#DCEBFA]">{f.v}</span>
                          </div>
                        ))}
                      </div>
                      {clickable && <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#55CCFF]">{CALENDAR_LABELS[cal.id]}</p>}
                    </>
                  )}
                </motion.div>
              );
            })}
      </div>
    </motion.section>
  );
}