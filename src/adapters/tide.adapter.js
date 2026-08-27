import { createCalendarResult } from './adapterContract.js'
import {
  getTideData,
} from '../engines/natural/tide/tideEngine.js'

export function adaptTide(context) {
  const result = getTideData(context)

  return createCalendarResult({
    id: 'tide',

    title: 'Tide',

    primary: result.status,

    secondary: result.locationName,

    details: result.details,

    effectiveDate: result.effectiveDate,

    boundary: result.boundary,

    events: [],

    meta: result.meta,
  })
}
