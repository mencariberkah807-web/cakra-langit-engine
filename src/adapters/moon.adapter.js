import { createCalendarResult } from './adapterContract.js'
import {
  getMoonData,
} from '../engines/natural/moon/moonEngine.js'

export function adaptMoon(context) {
  const result = getMoonData(context)

  return {
    ...createCalendarResult({
    id: 'moon',
    title: 'Moon',

    primary: result.phase,

    secondary: `Age ${result.age} days`,

    details: result.details,

    effectiveDate: result.effectiveDate,

    boundary: result.boundary,

    events: [],

    meta: result.meta,
    }),
    phase: result.phase ?? null,
    age: result.age ?? null,
    illumination: result.illumination ?? null,
  }
}
