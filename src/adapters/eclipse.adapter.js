import { createCalendarResult } from './adapterContract.js'
import { getEclipseCalendar } from '../engines/natural/eclipse/eclipseEngine.js'

export function adaptEclipse(context) {
  const result = getEclipseCalendar(context)

  if (!result.hasEvent) {
    return createCalendarResult({
      id: 'eclipse',
      title: 'Eclipse',
      primary: 'No eclipse event',
      secondary: 'No event today',
      details: [
        { label: 'Boundary', value: result.boundary },
      ],
      effectiveDate: result.effectiveDate,
      boundary: result.boundary,
      events: [],
      meta: { hasEvent: false },
      today: result.today ?? null,
      next: result.next ?? null,
    })
  }

  const event = result.events[0]
  const country = context.location?.country ?? 'Indonesia'
  const visible = event.visibility?.[country] ?? null

  return createCalendarResult({
    id: 'eclipse',
    title: 'Eclipse',
    primary: event.name,
    secondary:
      visible === false
        ? `Not visible from ${country}`
        : visible === true
          ? `Visible from ${country}`
          : 'Visibility unknown',
    details: [
      { label: 'Type', value: event.type },
      { label: 'Visibility', value: visible === false ? 'Not visible' : visible === true ? 'Visible' : 'Unknown' },
      { label: 'Region', value: event.visibilityRegion ?? 'Unavailable' },
      { label: 'Totality', value: event.totality?.label ?? 'Not applicable' },
      { label: 'Boundary', value: result.boundary },
    ],
    effectiveDate: result.effectiveDate,
    boundary: result.boundary,
    events: result.events,
    meta: {
      hasEvent: true,
      eventId: event.id,
      type: event.type,
      regression: Boolean(event.meta?.regression),
    },
    today: result.today ?? event,
    next: result.next ?? null,
  })
}
