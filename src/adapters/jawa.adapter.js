import { createCalendarResult } from './adapterContract.js'
import { getJawaCalendar } from '../engines/calendar/jawa/jawaEngine.js'

export function adaptJawaCalendar(context) {
  const result = getJawaCalendar(context)

  return createCalendarResult({
    id: 'jawa',

    title: 'Jawa',

    primary: `${result.day} ${result.monthName} ${result.year}`,

    secondary: result.weton,

    details: [
      {
        label: 'Weton',
        value: result.weton,
      },
      {
        label: 'Wuku',
        value: result.wuku,
      },
      {
        label: 'Tahun',
        value: result.yearName,
      },
      {
        label: 'Kurup',
        value: result.kurup,
      },
      {
        label: 'Windu',
        value: result.windu,
      },
      {
        label: 'Lambang',
        value: result.lambang,
      },
    ],

    effectiveDate: result.effectiveDate,

    boundary: result.boundary,

    meta: {
      ...result.meta,

      calendarYear: result.year,
      calendarMonth: result.month,
      calendarDay: result.day,

      monthName: result.monthName,
      weton: result.weton,
      wuku: result.wuku,
      yearName: result.yearName,
      kurup: result.kurup,
      windu: result.windu,
      lambang: result.lambang,
    },
  })
}
