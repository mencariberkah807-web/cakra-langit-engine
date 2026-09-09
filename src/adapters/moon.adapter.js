import { createCalendarResult } from './adapterContract.js'
import { getMoonData } from '../engines/natural/moon/moonEngine.js'

export function adaptMoon(context) {
  const result = getMoonData(context)
  const events = [
    result.rise ? { id: 'moonrise', title: 'Moonrise', time: result.rise, type: 'LUNAR', sub: 'Moon' } : null,
    result.transit ? { id: 'moon-transit', title: 'Moon Transit — Kulminasi', time: result.transit, type: 'LUNAR', sub: 'Moon' } : null,
    result.set ? { id: 'moonset', title: 'Moonset', time: result.set, type: 'LUNAR', sub: 'Moon' } : null,
  ].filter(Boolean)

  return {
    ...createCalendarResult({
      id: 'moon', title: 'Moon', primary: result.phase, secondary: `Age ${result.age} days`,
      details: result.details, effectiveDate: result.effectiveDate, boundary: result.boundary,
      events, meta: result.meta,
    }),
    phase: result.phase ?? null, age: result.age ?? null, illumination: result.illumination ?? null,
    altitude: result.altitude ?? null, azimuth: result.azimuth ?? null, distance: result.distance ?? null,
    rise: result.rise ?? null, transit: result.transit ?? null, set: result.set ?? null, path: result.path ?? [],
  }
}
