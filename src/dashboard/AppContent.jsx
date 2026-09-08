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
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <NaturalLayer data={data} loading={false} onOpenEclipse={onOpenEclipse} />
          <SunArc sun={data.natural.sun} time={time} loading={false} />
          <CalendarSystems data={data} loading={false} onOpenWeton={onOpenWeton} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-4">
          <MonthCalendar
            dateISO={dateISO}
            onSelect={onSelectDate}
            time={time}
            onTimeChange={onTimeChange}
            onJumpToday={onJumpToday}
            quickJumps={quickJumps}
          />
          <ScheduleTimeline data={data} loading={false} time={time} />
        </div>
      </div>
    </div>
  )
}
