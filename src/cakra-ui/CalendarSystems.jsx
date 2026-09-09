import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const CALENDAR_ORDER = [
  "jawa",
  "saka-sunda",
  "bali",
  "kalacakra",
  "chinese-lunar",
  "hijri",
];

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
  const orderedCalendars = CALENDAR_ORDER
    .map((id) => calendars.find((cal) => cal.id === id))
    .filter(Boolean);
  const [expandedId, setExpandedId] = useState(null);

  const toggleCalendar = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const expandedCalendar = orderedCalendars.find((cal) => cal.id === expandedId) || null;

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
          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#C7D9EA]">Calendar Systems</h2>
          <p className="mt-1 text-xs text-[#7894AF]">Today calculation snapshot</p>
        </div>
      </div>

      {!data ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-[#163A5C] bg-[#0A2139]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
            {orderedCalendars.map((cal) => {
              const expanded = expandedId === cal.id;
              return (
                <motion.button
                  key={cal.id}
                  type="button"
                  variants={item}
                  whileHover={{ y: -2 }}
                  onClick={() => toggleCalendar(cal.id)}
                  aria-expanded={expanded}
                  data-testid={`calendar-snapshot-${cal.id}`}
                  className={`min-w-0 rounded-xl border p-3 text-left transition-[border-color,background,box-shadow,transform] duration-200 focus:outline-none focus:ring-2 focus:ring-[#36C8FF] ${expanded ? "border-[#2C78A8] bg-[#0B2742] shadow-[0_10px_24px_rgba(0,20,45,0.2)]" : "border-[#1B4568] bg-gradient-to-b from-[#0B2742] to-[#071D32] hover:border-[#2C78A8]"}`}
                >
                  <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#6F8CA6]">{cal.title || cal.name}</p>
                  <p className="mt-1 truncate text-sm font-semibold leading-tight text-[#F3F8FC]">{cal.primary || cal.headline || "—"}</p>
                  <p className="mt-0.5 truncate text-[11px] uppercase tracking-wide text-[#7894AF]">{cal.secondary || cal.sub || "—"}</p>
                </motion.button>
              );
            })}
          </div>

          {expandedCalendar && (
            <motion.div
              key={expandedCalendar.id}
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              className="mt-4 rounded-xl border border-[#1B4568] bg-gradient-to-b from-[#0B2742] to-[#071D32] p-4"
              data-testid={`calendar-detail-${expandedCalendar.id}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6F8CA6]">{expandedCalendar.title || expandedCalendar.name}</p>
                  <p className="mt-1 text-base font-semibold leading-tight text-[#DCEBFA]">{expandedCalendar.primary || expandedCalendar.headline}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[#7894AF]">{expandedCalendar.secondary || expandedCalendar.sub}</p>
                </div>
                {CALENDAR_ROUTES[expandedCalendar.id] && (
                  <a
                    href={CALENDAR_ROUTES[expandedCalendar.id]}
                    className="shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[#55CCFF]"
                  >
                    {CALENDAR_LABELS[expandedCalendar.id]}
                  </a>
                )}
              </div>
              <div className="mt-4 grid gap-x-6 gap-y-2 border-t border-[#163A5C] pt-4 sm:grid-cols-2 lg:grid-cols-3">
                {(expandedCalendar.details || expandedCalendar.fields || []).map((field) => (
                  <div key={field.label || field.k} className="flex items-baseline justify-between gap-3 text-[11px]">
                    <span className="text-[#7894AF]">{field.label || field.k}</span>
                    <span className="text-right font-medium text-[#DCEBFA]">{field.value || field.v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.section>
  );
}
