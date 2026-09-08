const ECLIPSE_EVENTS = [
  {
    id: '2026-02-17-annular-solar',
    type: 'SOLAR',
    name: 'Annular Solar Eclipse',
    date: '2026-02-17',
    visibility: { Indonesia: false },
    visibilityRegion: 'Southern Argentina & Chile, southern Africa, Antarctica',
    totality: null,
  },
  {
    id: '2026-03-03-total-lunar',
    type: 'LUNAR',
    name: 'Total Lunar Eclipse',
    date: '2026-03-03',
    visibility: { Indonesia: true },
    visibilityRegion: 'Eastern Asia, Australia, Pacific, Americas',
    totality: {
      at: '2026-03-03T11:04:26Z',
      label: 'Totality begins (UTC)',
    },
  },
  {
    id: '2026-08-12-total-solar',
    type: 'SOLAR',
    name: 'Total Solar Eclipse',
    date: '2026-08-12',
    visibility: { Indonesia: false },
    visibilityRegion: 'Total: Arctic, Greenland, Iceland, Spain; partial: northern North America, Europe, western Africa',
    totality: {
      at: null,
      label: 'Location-dependent totality',
    },
    meta: {
      greatestEclipseAt: '2026-08-12T17:45:53.8Z',
    },
  },
  {
    id: '2026-08-28-partial-lunar',
    type: 'LUNAR',
    name: 'Partial Lunar Eclipse',
    date: '2026-08-28',
    visibility: { Indonesia: false },
    visibilityRegion: 'Eastern Pacific, Americas, Europe, Africa',
    totality: null,
    meta: {
      regression: true,
      baseline: '2026-08-27-28',
    },
  },
]

function toDateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

function parseDateKey(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getEclipseEvents(context) {
  const date = context.time.instant
  const dateKey = toDateKey(date)
  return ECLIPSE_EVENTS.filter((event) => event.date === dateKey)
}

export function getEclipseCalendar(context) {
  const date = context.time.instant
  const dateKey = toDateKey(date)
  const today = ECLIPSE_EVENTS.find((event) => event.date === dateKey) || null
  const next = ECLIPSE_EVENTS
    .filter((event) => parseDateKey(event.date) > date)
    .sort((a, b) => parseDateKey(a.date) - parseDateKey(b.date))[0] || null
  const events = getEclipseEvents(context)

  return {
    events,
    hasEvent: events.length > 0,
    today,
    next,
    effectiveDate: date,
    boundary: 'MIDNIGHT',
    meta: {
      engine: 'Eclipse',
      phase: 'FOUNDATION',
      calculation: 'EVENT_SCHEDULE',
      source: 'NASA eclipse catalog metadata',
    },
  }
}
