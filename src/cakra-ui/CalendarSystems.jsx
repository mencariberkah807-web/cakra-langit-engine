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
  "kalacakra",
  "bali",
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
      className="rounded-[20px] border border-[#173B5D] bg-[linear-gradient(145deg,#06182B_0%,#071D32_55%,#061525_100%)] p-5 shadow-[0_20px_55px_rgba(2,12,27,0.22)]"
      data-testid="calendar-systems-section"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1F5277] bg-[#0A2742]">
            <CalendarDays className="h-4 w-4 text-[#55CCFF]" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#D6E7F5]">Calendar Systems</h2>
            <p className="mt-1 text-xs text-[#7894AF]">Today calculation snapshot</p>
          </div>
        </div>
        <span className="hidden text-[9px] font-semibold uppercase tracking-[0.12em] text-[#587690] sm:block">Signature collection</span>
      </div>

      {!data ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[92px] animate-pulse rounded-xl border border-[#163A5C] bg-[#0A2139]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
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
                  className={`group min-w-0 rounded-xl border p-3 text-left transition-[border-color,background,box-shadow,transform] duration-200 focus:outline-none focus:ring-2 focus:ring-[#36C8FF] ${expanded ? "border-[#2C78A8] bg-[#0B2B48] shadow-[0_12px_28px_rgba(0,20,45,0.28)]" : "border-[#1B4568] bg-[#0A2239]/90 hover:border-[#2C78A8] hover:bg-[#0B2742]"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[9px] font-bold uppercase tracking-[0.1em] text-[#6F8CA6]">{cal.title || cal.name}</p>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${expanded ? "bg-[#55CCFF]" : "bg-[#315A7E] group-hover:bg-[#55CCFF]"}`} />
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold leading-tight text-[#F3F8FC]">{cal.primary || cal.headline || "—"}</p>
                  <p className="mt-1 truncate text-[10px] uppercase tracking-wide text-[#7894AF]">{cal.secondary || cal.sub || "—"}</p>
                </motion.button>
              );
            })}
          </div>

          {expandedCalendar && (
            <motion.div
              key={expandedCalendar.id}
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              className="mt-4 rounded-xl border border-[#1B4568] bg-[#081F35] p-4 shadow-[0_14px_32px_rgba(0,15,35,0.2)]"
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
                    className="shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[#55CCFF] hover:text-[#8EDFFF]"
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
