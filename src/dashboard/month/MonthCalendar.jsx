import { useTodayContext } from "../../core/TodayContext";
import { formatClock } from "../../core/time";

const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function toDateInputValue(date) {
  const pad = (value) =>
    String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
  ].join("");
}

function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  const previousMonthDays =
    new Date(year, month, 0).getDate();

  const days = [];

  for (
    let index = firstDay - 1;
    index >= 0;
    index--
  ) {
    days.push({
      day: previousMonthDays - index,
      currentMonth: false,
    });
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    days.push({
      day,
      currentMonth: true,
    });
  }

  const remainingDays =
    42 - days.length;

  for (
    let day = 1;
    day <= remainingDays;
    day++
  ) {
    days.push({
      day,
      currentMonth: false,
    });
  }

  return days;
}

export default function MonthCalendar() {
  const {
    selectedDate,
    setSelectedDate,
    time,
    location,
    mode,
    goLive,
  } = useTodayContext();

  const year =
    selectedDate.getFullYear();

  const month =
    selectedDate.getMonth();

  const monthLabel =
    selectedDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  const days =
    getMonthDays(selectedDate);

  function shiftDay(amount) {
    const nextDate =
      new Date(selectedDate);

    nextDate.setDate(
      nextDate.getDate() + amount
    );

    setSelectedDate(nextDate);
  }

  function handleDateChange(event) {
    const value = event.target.value;

    if (!value) return;

    const [
      yearValue,
      monthValue,
      dayValue,
    ] = value.split("-").map(Number);

    const nextDate =
      new Date(selectedDate);

    nextDate.setFullYear(
      yearValue,
      monthValue - 1,
      dayValue
    );

    setSelectedDate(nextDate);
  }

  function handleDayClick(item) {
    if (!item.currentMonth) return;

    const nextDate =
      new Date(selectedDate);

    nextDate.setFullYear(
      year,
      month,
      item.day
    );

    setSelectedDate(nextDate);
  }

  return (
    <section className="month-calendar">
      <div className="month-calendar-heading">
        <div>
          <span className="eyebrow">
            MONTH CALENDAR
          </span>

          <h2>{monthLabel}</h2>
        </div>

        <div className="month-date-controls">
          <button
            type="button"
            className="month-nav-button"
            onClick={() => shiftDay(-1)}
            aria-label="Previous day"
          >
            ←
          </button>

          <input
            type="date"
            value={
              toDateInputValue(selectedDate)
            }
            onChange={handleDateChange}
          />

          <button
            type="button"
            className="month-nav-button"
            onClick={() => shiftDay(1)}
            aria-label="Next day"
          >
            →
          </button>

          <span className="month-time-label">
            TIME
          </span>

          <select
            className="month-time-select"
            value={formatClock(
              time.instant,
              "id-ID",
              location.timezone
            ).split(/[:.]/).slice(0, 2).join(":")}
            onChange={() => {}}
            aria-label="Selected time"
          >
            <option>
              {formatClock(
                time.instant,
                "id-ID",
                location.timezone
              ).split(/[:.]/).slice(0, 2).join(":")}
            </option>
          </select>

          <button
            type="button"
            className="month-live-button"
            onClick={goLive}
            aria-label="Return to current time"
            disabled={mode === "live"}
          >
            ↻
          </button>
        </div>
      </div>

      <div className="month-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>
            {day}
          </span>
        ))}
      </div>

      <div className="month-days">
        {days.map((item, index) => {
          const isSelected =
            item.currentMonth &&
            item.day ===
              selectedDate.getDate();

          return (
            <button
              key={`${item.day}-${index}`}
              type="button"
              className={[
                "month-day",
                !item.currentMonth &&
                  "month-day-muted",
                isSelected &&
                  "month-day-selected",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                handleDayClick(item)
              }
              disabled={
                !item.currentMonth
              }
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
