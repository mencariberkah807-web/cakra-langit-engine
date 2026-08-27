import { createCalendarResult } from './adapterContract.js'
import {
  getEarthSpaceData,
} from '../engines/natural/earth/earthEngine.js'

export function adaptEarthSpace(context) {
  const result = getEarthSpaceData(context)

  return createCalendarResult({
    id: 'earth-space',

    title: 'Earth Space',

    primary: `Day ${result.dayOfYear}`,

    secondary:
      `${result.progress}% of annual cycle`,

    details: result.details,

    effectiveDate: result.effectiveDate,

    boundary: result.boundary,

    events: [],

    meta: result.meta,
  })
}
