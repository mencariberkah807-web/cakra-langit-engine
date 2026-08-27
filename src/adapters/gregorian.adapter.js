import { createCalendarResult } from './adapterContract.js'
import { getGregorianCalendar } from '../engines/calendar/gregorian/gregorianEngine.js'
import { formatGregorian } from '../core/time.js'

export function adaptGregorian(context) {
  const result = getGregorianCalendar(context)
  const { location } = context

  return createCalendarResult({
    id: 'gregorian',
    title: 'Gregorian',

    primary: formatGregorian(
      result.date,
      'id-ID',
      location.timezone
    ),

    secondary: location.timezoneLabel,

    details: [
      {
        label: 'Timezone',
        value: location.timezone,
      },
    ],

    effectiveDate: result.date,
    boundary: 'MIDNIGHT',

    events: [],
    meta: {
      timestamp: result.timestamp,
      timezone: location.timezone,
    },
  })
}
