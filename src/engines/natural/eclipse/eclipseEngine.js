const ECLIPSE_EVENTS = [
  {
    id: '2026-08-28-partial-lunar',
    type: 'LUNAR',
    name: 'Partial Lunar Eclipse',
    date: '2026-08-28',
    visibility: {
      Indonesia: false,
    },
    meta: {
      regression: true,
      baseline: '2026-08-27-28',
    },
  },
]

function toDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export function getEclipseEvents(context) {
  const date = context.time.instant
  const dateKey = toDateKey(date)

  return ECLIPSE_EVENTS.filter((event) => {
    return event.date === dateKey
  })
}

export function getEclipseCalendar(context) {
  const events = getEclipseEvents(context)

  return {
    events,
    hasEvent: events.length > 0,
    effectiveDate: context.time.instant,
    boundary: 'MIDNIGHT',
  }
}
