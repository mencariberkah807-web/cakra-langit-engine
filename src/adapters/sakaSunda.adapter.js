import { createCalendarResult } from './adapterContract.js'
import {
  getSakaSundaCalendar,
} from '../engines/calendar/saka-sunda/sakaSundaEngine.js'

export function adaptSakaSunda(context) {
  const result = getSakaSundaCalendar(context)

  return createCalendarResult({
    id: 'saka-sunda',
    title: 'Saka Sunda',

    primary:
      `${result.day} ${result.monthName} ${result.year}`,

    secondary: result.yearType,

    details: [
      {
        label: 'Year Type',
        value: result.yearType,
      },
      {
        label: 'Boundary',
        value: 'MIDNIGHT',
      },
    ],

    effectiveDate: result.effectiveDate,

    boundary: result.boundary,

    events: [],

    meta: {
      year: result.year,
      month: result.month,
      day: result.day,
      monthName: result.monthName,
      yearType: result.yearType,
    },
  })
}
