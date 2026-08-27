import { useTodayContext } from '../../core/TodayContext'
import { INDONESIAN_LOCATIONS } from '../../core/location'
import { formatClock, formatGregorian } from '../../core/time'

function toDateTimeLocalValue(date) {
  const pad = (value) => String(value).padStart(2, '0')

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('')
}

export default function TodayHeader() {
  const {
    time,
    location,
    selectedDate,
    mode,
    setSelectedDate,
    setLocationByCity,
    goLive,
  } = useTodayContext()

  function shiftDay(amount) {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(nextDate.getDate() + amount)

    setSelectedDate(nextDate)
  }

  function handleDateChange(event) {
    const value = event.target.value

    if (!value) return

    setSelectedDate(new Date(value))
  }

  function handleLocationChange(event) {
    setLocationByCity(event.target.value)
  }

  return (
    <header className="today-header">
      <div className="header-primary">
        <span className="eyebrow">PERSONAL ALMANAC</span>

        <div className="title-row">
          <h1>{mode === 'live' ? 'Today' : 'Explore'}</h1>

          <span className={`mode-badge mode-${mode}`}>
            {mode.toUpperCase()}
          </span>
        </div>

        <p>{formatGregorian(time.instant, 'id-ID', location.timezone)}</p>

        <div className="date-navigator">
          <button
            type="button"
            className="nav-button"
            onClick={() => shiftDay(-1)}
            aria-label="Previous day"
          >
            ←
          </button>

          <input
            type="datetime-local"
            value={toDateTimeLocalValue(selectedDate)}
            onChange={handleDateChange}
          />

          <button
            type="button"
            className="nav-button"
            onClick={() => shiftDay(1)}
            aria-label="Next day"
          >
            →
          </button>

          {mode !== 'live' && (
            <button
              type="button"
              className="live-button"
              onClick={goLive}
            >
              LIVE NOW
            </button>
          )}
        </div>
      </div>

      <div className="context-grid">
        <div className="context-card">
          <span className="context-label">
            {mode === 'live' ? 'LOCAL TIME' : 'SELECTED TIME'}
          </span>

          <strong>{formatClock(time.instant, 'id-ID', location.timezone)}</strong>
          <small>{location.timezoneLabel}</small>
        </div>

        <div className="context-card">
          <span className="context-label">LOCATION</span>

          <select
            className="location-select"
            value={location.city}
            onChange={handleLocationChange}
          >
            {INDONESIAN_LOCATIONS.map((item) => (
              <option key={item.city} value={item.city}>
                {item.city}
              </option>
            ))}
          </select>

          <small>
            {location.province}, {location.country}
          </small>
        </div>
      </div>
    </header>
  )
}
