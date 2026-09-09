import NaturalLayer from "../cakra-ui/NaturalLayer";
import SunArc from "../cakra-ui/SunArc";
import CalendarSystems from "../cakra-ui/CalendarSystems";
import MonthCalendar from "../cakra-ui/MonthCalendar";
import ScheduleTimeline from "../cakra-ui/ScheduleTimeline";

function findCalendar(data, matcher) {
  return (data?.calendars || []).find((item) => matcher(String(item?.name || ""), String(item?.id || ""))) || null;
}

function calendarValue(calendar, keys = []) {
  if (!calendar) return "—";
  for (const key of keys) {
    const direct = calendar?.[key];
    if (direct !== undefined && direct !== null && direct !== "") return String(direct);
    const field = Array.isArray(calendar.fields)
      ? calendar.fields.find((item) => String(item?.k || "").toLowerCase() === key.toLowerCase())
      : null;
    if (field?.v !== undefined && field?.v !== null && field?.v !== "") return String(field.v);
  }
  return String(calendar.headline || calendar.primary || "—");
}

function calendarSnapshot(calendar, fallbackLabel, fallbackSub = "—") {
  return {
    label: calendar?.name || fallbackLabel,
    value: calendar?.headline || calendar?.primary || "—",
    sub: calendar?.sub || calendar?.secondary || fallbackSub,
  };
}

function TodaySummary({ data }) {
  const cakaSunda = findCalendar(data, (name, id) => /saka|caka|sunda/.test(`${name} ${id}`.toLowerCase()));
  const kalacakra = findCalendar(data, (name, id) => /kalacakra/.test(`${name} ${id}`.toLowerCase()));
  const jawa = findCalendar(data, (name, id) => /jawa/.test(`${name} ${id}`.toLowerCase()));
  const bali = findCalendar(data, (name, id) => /bali|palelintangan|pawukon/.test(`${name} ${id}`.toLowerCase()));
  const chineseLunar = findCalendar(data, (name, id) => /chinese|lunar/.test(`${name} ${id}`.toLowerCase()));
  const dateLabel = data?.date_info?.date_long || "—";

  const calendarItems = [
    calendarSnapshot(jawa, "Jawa"),
    calendarSnapshot(cakaSunda, "Saka Sunda"),
    calendarSnapshot(bali, "Bali"),
    calendarSnapshot(kalacakra, "Kalacakra"),
    calendarSnapshot(chineseLunar, "Chinese Lunar"),
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#123A5A] bg-[linear-gradient(135deg,#071A2C,#0A2038)] px-5 py-4 shadow-[0_16px_40px_rgba(2,12,27,0.28)]" aria-label="Today summary">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
        <div className="flex min-w-0 items-center gap-3 border-b border-[#1B4565] pb-4 xl:w-[180px] xl:shrink-0 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0EA5E9]/40 bg-[#0EA5E9]/10 text-[#38BDF8]">◉</div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#38BDF8]">Today</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{dateLabel}</p>
          </div>
        </div>

        <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 xl:grid-cols-5">
          {calendarItems.map((item, index) => (
            <div key={item.label} className={`${index < calendarItems.length - 1 ? "xl:border-r xl:border-[#1B4565] xl:pr-4" : ""} min-w-0`}>
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#6F8CA6]">{item.label}</p>
              <p className="mt-1 truncate text-sm font-semibold leading-tight text-[#F3F8FC]">{item.value}</p>
              <p className="mt-0.5 truncate text-[11px] uppercase tracking-wide text-[#7894AF]">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AppContent({
  data,
  dateISO,
  onSelectDate,
  time,
  onTimeChange,
  onJumpToday,
  quickJumps,
  onOpenEclipse,
}) {
  return (
    <div className="min-h-[calc(100vh-88px)] w-full bg-[radial-gradient(circle_at_18%_8%,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(124,58,237,0.08),transparent_28%),#07111C] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
        <section className="flex min-w-0 flex-col gap-6 xl:col-span-8" aria-label="Almanac workspace">
          <TodaySummary data={data} />
          <div className="relative">
            <NaturalLayer data={data} loading={false} onOpenEclipse={onOpenEclipse} />
            <SunArc sun={data.natural.sun} moon={data.natural.moon} time={time} onTimeChange={onTimeChange} loading={false} embedded />
          </div>
          <CalendarSystems data={data} loading={false} />
        </section>

        <aside className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-6 xl:col-span-4 xl:self-start" aria-label="Almanac context">
          <MonthCalendar dateISO={dateISO} onSelect={onSelectDate} time={time} onTimeChange={onTimeChange} onJumpToday={onJumpToday} quickJumps={quickJumps} />
          <ScheduleTimeline data={data} loading={false} time={time} />
        </aside>
      </div>
    </div>
  )
}
