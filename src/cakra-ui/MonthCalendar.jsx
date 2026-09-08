import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, RotateCcw, Moon, Eclipse } from "lucide-react";

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
  "Agustus", "September", "Oktober", "November", "Desember",
];
const WD = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fmtShort = (isoStr) => {
  if (!isoStr) return "—";
  const d = new Date(`${isoStr}T00:00:00`);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};

export default function MonthCalendar({ dateISO, onSelect, time, onTimeChange, onJumpToday, quickJumps }) {
  const sel = new Date(`${dateISO}T00:00:00`);
  const [view, setView] = useState({ y: sel.getFullYear(), m: sel.getMonth() });
  const todayISO = iso(new Date());

  useEffect(() => {
    const d = new Date(`${dateISO}T00:00:00`);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  }, [dateISO]);

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

  const controlClass =
    "border-[#1B4568] bg-[#0A2139] text-[#DCEBFA] hover:border-[#2C78A8] hover:bg-[#0D2945]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="rounded-2xl border border-[#163A5C] bg-[#06172B] p-5 shadow-[0_16px_40px_rgba(2,12,27,0.16)]"
      data-testid="month-calendar-panel"
    >
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-[#8ED8FF]" strokeWidth={1.8} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#C7D9EA]">
          Month Calendar
        </h2>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          data-testid="month-nav-prev-btn"
          onClick={() => shift(-1)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${controlClass}`}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className={`flex h-9 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-2 font-mono text-xs font-medium tabular-nums ${controlClass}`}>
          {String(sel.getDate()).padStart(2, "0")} / {String(sel.getMonth() + 1).padStart(2, "0")} / {sel.getFullYear()}
          <CalendarDays className="h-3.5 w-3.5 text-[#6F8CA6]" />
        </div>
        <button
          data-testid="month-nav-next-btn"
          onClick={() => shift(1)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${controlClass}`}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="ml-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7894AF]">
          Time
        </span>
        <input
          data-testid="time-scrubber-input"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className={`h-9 rounded-lg border px-2.5 font-mono text-[13px] font-medium tabular-nums outline-none transition-shadow focus:ring-2 focus:ring-[#36C8FF] ${controlClass}`}
        />
        <button
          data-testid="jump-today-btn"
          onClick={onJumpToday}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${controlClass}`}
          aria-label="Jump to today"
        >
          <RotateCcw className="h-4 w-4 text-[#8ED8FF]" />
        </button>
      </div>

      {quickJumps && (
        <div className="mb-5 grid grid-cols-3 gap-2" data-testid="quick-jumps-row">
          <button
            data-testid="quick-jump-today"
            onClick={onJumpToday}
            className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-colors duration-150 ${controlClass}`}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#F3F8FC]">
              <RotateCcw className="h-3 w-3 text-[#8ED8FF]" />
              Today
            </span>
            <span className="font-mono text-[10px] tabular-nums text-[#718BA2]">Live</span>
          </button>
          <button
            data-testid="quick-jump-full-moon"
            onClick={() => quickJumps.next_full_moon && onSelect(quickJumps.next_full_moon)}
            className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-colors duration-150 ${controlClass}`}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#F3F8FC]">
              <Moon className="h-3 w-3 text-[#8ED8FF]" />
              Full Moon
            </span>
            <span className="font-mono text-[10px] tabular-nums text-[#718BA2]">
              {fmtShort(quickJumps.next_full_moon)}
            </span>
          </button>
          <button
            data-testid="quick-jump-eclipse"
            disabled={!quickJumps.next_eclipse}
            onClick={() => quickJumps.next_eclipse && onSelect(quickJumps.next_eclipse.date)}
            className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${controlClass}`}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#F3F8FC]">
              <Eclipse className="h-3 w-3 text-[#B78CFF]" />
              Eclipse
            </span>
            <span className="font-mono text-[10px] tabular-nums text-[#718BA2]">
              {quickJumps.next_eclipse ? fmtShort(quickJumps.next_eclipse.date) : "—"}
            </span>
          </button>
        </div>
      )}

      <h3 className="mb-3 font-display text-lg font-bold tracking-[-0.01em] text-[#F3F8FC]">
        {MONTHS_ID[view.m]} {view.y}
      </h3>

      <div className="grid grid-cols-7 gap-1" data-testid="month-calendar-grid">
        {WD.map((w) => (
          <div
            key={w}
            className="pb-2 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#7894AF]"
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
                  ? "bg-[#18BDF5] font-semibold text-[#031321] shadow-[0_0_18px_rgba(24,189,245,0.24)]"
                  : c.current
                    ? `text-[#DCEBFA] hover:bg-[#0D2945] ${isToday ? "font-semibold ring-1 ring-inset ring-[#36C8FF]" : ""}`
                    : "cursor-default text-[#29435B]"
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
