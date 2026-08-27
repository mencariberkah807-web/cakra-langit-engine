import { createCalendarResult } from './adapterContract.js'
import {
  getSkyData,
} from '../engines/natural/sky/skyEngine.js'

export function adaptSky(context) {
  const result = getSkyData(context)

  return createCalendarResult({
    id: 'sky',

    title: 'Sky',

    primary: result.skyState,

    secondary: 'Observation context',

    details: result.details,

    effectiveDate: result.effectiveDate,

    boundary: result.boundary,

    events: [],

    meta: result.meta,
  })
}
