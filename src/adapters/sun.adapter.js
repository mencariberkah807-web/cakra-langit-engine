import { createCalendarResult } from './adapterContract.js'
import { getSunData } from '../engines/natural/sun/sunEngine.js'

export function adaptSun(context) {
  const result = getSunData(context)

  const events = []

  if (result.sunrise) {
    events.push({
      id: 'sunrise',
      title: 'Sunrise',
      time: result.sunrise,
      type: 'SOLAR',
    })
  }

  if (result.sunset) {
    events.push({
      id: 'sunset',
      title: 'Sunset',
      time: result.sunset,
      type: 'SOLAR',
    })
  }

  return createCalendarResult({
    id: 'sun',

    title: 'Sun',

    primary:
      result.meta.available
        ? `Sunrise ${result.sunrise}`
        : 'Location required',

    secondary:
      result.meta.available
        ? `Sunset ${result.sunset}`
        : 'Coordinates unavailable',

    details: [
      {
        label: 'Sunrise',
        value: result.sunrise ?? 'Unavailable',
      },
      {
        label: 'Sunset',
        value: result.sunset ?? 'Unavailable',
      },
      {
        label: 'Boundary',
        value: result.boundary,
      },
    ],

    effectiveDate: result.effectiveDate,

    boundary: result.boundary,

    events,

    meta: result.meta,
  })
}
