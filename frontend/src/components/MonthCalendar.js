import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
  "Agustus", "September", "Oktober", "November", "Desember",
];
const WD = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function MonthCalendar({ dateISO, onSelect, time, onTimeChange, onJumpToday }) {
  const sel = new Date(`${dateISO}T00:00:00`);
  const [view, setView] = useState({ y: sel.getFullYear(), m: sel.getMonth() });
  const todayISO = iso(new Date());

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDay = first.getDay();
    const dim = new Date(view.y, view.m + 1, 0).getDate();
    const prevDim = new Date(view.y, view.m, 0).getDate();
    const out = [];
    for (let i = startDay - 1; i >= 0; i--)
      out.push({ day: prevDim - i, current: false, key: `p${i}` });
    for (let d = 1; d <= dim; d++) out.push({ day: d, current: true, key: `c${d}` });
    let n = 1;
    while (out.length % 7 !== 0) out.push({ day: n++, current: false, key: `n${n}` });
    return out;
  }, [view]);

  const shift = (dir) =>
    setView((v) => {
      const d = new Date(v.y, v.m + dir, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const pick = (day) => {
    const d = new Date(view.y, view.m, day);
    onSelect(iso(d));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      data-testid="month-calendar-panel"
    >
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-[#475569]" strokeWidth={1.8} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]">
          Month Calendar
        </h2>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          data-testid="month-nav-prev-btn"
          onClick={() => shift(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] transition-colors duration-150 hover:bg-[#F1F5F9]"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex h-9 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#E2E8F0] px-2 font-mono text-xs font-medium tabular-nums">
          {String(sel.getDate()).padStart(2, "0")} / {String(sel.getMonth() + 1).padStart(2, "0")} / {sel.getFullYear()}
          <CalendarDays className="h-3.5 w-3.5 text-[#94A3B8]" />
        </div>
        <button
          data-testid="month-nav-next-btn"
          onClick={() => shift(1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] transition-colors duration-150 hover:bg-[#F1F5F9]"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="ml-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]">
          Time
        </span>
        <input
          data-testid="time-scrubber-input"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-2.5 font-mono text-[13px] font-medium tabular-nums outline-none transition-shadow focus:ring-2 focus:ring-[#2563EB]"
        />
        <button
          data-testid="jump-today-btn"
          onClick={onJumpToday}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] transition-colors duration-150 hover:bg-[#F1F5F9]"
          aria-label="Jump to today"
        >
          <RotateCcw className="h-4 w-4 text-[#475569]" />
        </button>
      </div>

      <h3 className="mb-3 font-display text-lg font-bold tracking-[-0.01em]">
        {MONTHS_ID[view.m]} {view.y}
      </h3>

      <div className="grid grid-cols-7 gap-1" data-testid="month-calendar-grid">
        {WD.map((w) => (
          <div
            key={w}
            className="pb-2 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#475569]"
          >
            {w}
          </div>
        ))}
        {cells.map((c) => {
          const cellISO = c.current ? iso(new Date(view.y, view.m, c.day)) : null;
          const selected = c.current && cellISO === dateISO;
          const isToday = c.current && cellISO === todayISO;
          return (
            <button
              key={c.key}
              data-testid={c.current ? `calendar-day-${c.day}` : undefined}
              disabled={!c.current}
              onClick={() => pick(c.day)}
              className={`flex h-9 items-center justify-center rounded-md text-[13px] tabular-nums transition-colors duration-150 ${
                selected
                  ? "bg-[#0F172A] font-semibold text-white"
                  : c.current
                    ? `hover:bg-[#F1F5F9] ${isToday ? "font-semibold ring-1 ring-inset ring-[#0F172A]" : ""}`
                    : "cursor-default text-[#CBD5E1]"
              }`}
            >
              {c.day}
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
