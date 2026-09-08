import NaturalLayer from "../cakra-ui/NaturalLayer";
import SunArc from "../cakra-ui/SunArc";
import CalendarSystems from "../cakra-ui/CalendarSystems";
import MonthCalendar from "../cakra-ui/MonthCalendar";
import ScheduleTimeline from "../cakra-ui/ScheduleTimeline";

export default function AppContent({
  data,
  dateISO,
  onSelectDate,
  time,
  onTimeChange,
  onJumpToday,
  quickJumps,
  onOpenWeton,
  onOpenEclipse,
}) {
  return (
    <div className="min-h-[calc(100vh-88px)] w-full bg-[radial-gradient(circle_at_18%_8%,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(124,58,237,0.08),transparent_28%),#07111C] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <section className="flex min-w-0 flex-col gap-6 lg:col-span-8" aria-label="Almanac workspace">
          <div className="relative">
            <NaturalLayer data={data} loading={false} onOpenEclipse={onOpenEclipse} />
            <SunArc sun={data.natural.sun} moon={data.natural.moon} time={time} onTimeChange={onTimeChange} loading={false} embedded />
          </div>
          <CalendarSystems data={data} loading={false} onOpenWeton={onOpenWeton} />
        </section>

        <aside className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-6 lg:col-span-4 lg:self-start" aria-label="Almanac context">
          <MonthCalendar
            dateISO={dateISO}
            onSelect={onSelectDate}
            time={time}
            onTimeChange={onTimeChange}
            onJumpToday={onJumpToday}
            quickJumps={quickJumps}
          />
          <ScheduleTimeline data={data} loading={false} time={time} />
        </aside>
      </div>
    </div>
  )
}
