import { createCalendarResult } from './adapterContract.js'
import { getSunData } from '../engines/natural/sun/sunEngine.js'

export function adaptSun(context) {
  const result = getSunData(context)

  const events = [
    result.dawn ? { id: 'dawn', title: 'Fajar — Dawn Window', time: result.dawn, type: 'SKY', sub: 'Sky' } : null,
    result.sunrise ? { id: 'sunrise', title: 'Sunrise — Surya Terbit', time: result.sunrise, type: 'SOLAR', sub: 'Sun' } : null,
    result.noon ? { id: 'noon', title: 'Solar Noon — Kulminasi', time: result.noon, type: 'SOLAR', sub: 'Sun' } : null,
    result.golden_hour ? { id: 'golden-hour', title: 'Golden Hour', time: result.golden_hour, type: 'SOLAR', sub: 'Sun' } : null,
    result.sunset ? { id: 'sunset', title: 'Sunset — Surya Surup', time: result.sunset, type: 'SOLAR', sub: 'Sun' } : null,
    result.dusk ? { id: 'dusk', title: 'Dusk — Stargazing Window', time: result.dusk, type: 'SKY', sub: 'Night sky' } : null,
  ].filter(Boolean)

  return {
    ...createCalendarResult({
      id: 'sun', title: 'Sun',
      primary: result.meta.available ? `Sunrise ${result.sunrise}` : 'Location required',
      secondary: result.meta.available ? `Sunset ${result.sunset}` : 'Coordinates unavailable',
      details: [
        { label: 'Sunrise', value: result.sunrise ?? null },
        { label: 'Sunset', value: result.sunset ?? null },
        { label: 'Boundary', value: result.boundary },
        { label: 'Selected altitude', value: result.altitude == null ? null : `${result.altitude}°` },
        { label: 'Selected azimuth', value: result.azimuth == null ? null : `${result.azimuth}°` },
      ],
      effectiveDate: result.effectiveDate, boundary: result.boundary, events, meta: result.meta,
    }),
    sunrise: result.sunrise ?? null, sunset: result.sunset ?? null, dawn: result.dawn ?? null,
    noon: result.noon ?? null, dusk: result.dusk ?? null, golden_hour: result.golden_hour ?? null,
    altitude: result.altitude ?? null, azimuth: result.azimuth ?? null, path: result.path ?? [],
    selectedTime: result.selectedTime ?? null,
  }
}
