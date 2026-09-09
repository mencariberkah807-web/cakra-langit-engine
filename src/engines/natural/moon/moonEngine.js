const SYNODIC_MONTH = 29.53058867
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0)

const degToRad = (value) => (value * Math.PI) / 180
const radToDeg = (value) => (value * 180) / Math.PI
const normalizeDegrees = (value) => ((value % 360) + 360) % 360

function normalizeAge(days) {
  const value = days % SYNODIC_MONTH
  return value < 0 ? value + SYNODIC_MONTH : value
}

function getNextFullMoon(date) {
  const daysSinceReference = (date.getTime() - REFERENCE_NEW_MOON) / 86400000
  const currentAge = normalizeAge(daysSinceReference)
  const fullMoonAge = SYNODIC_MONTH / 2
  let daysUntil = fullMoonAge - currentAge
  if (daysUntil <= 0) daysUntil += SYNODIC_MONTH
  return new Date(date.getTime() + daysUntil * 86400000).toISOString().slice(0, 10)
}

function getPhase(age) {
  if (age < 1.84566 || age >= 27.68493) return 'New Moon'
  if (age < 5.53699) return 'Waxing Crescent'
  if (age < 9.22831) return 'First Quarter'
  if (age < 12.91963) return 'Waxing Gibbous'
  if (age < 16.61096) return 'Full Moon'
  if (age < 20.30228) return 'Waning Gibbous'
  if (age < 23.99361) return 'Last Quarter'
  return 'Waning Crescent'
}

function getTimezoneOffsetHours(date, timezone) {
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'shortOffset', hour: '2-digit' })
  const value = formatter.formatToParts(date).find((part) => part.type === 'timeZoneName')?.value
  if (!value || value === 'GMT') return 0
  const match = value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
  if (!match) return 0
  return (match[1] === '+' ? 1 : -1) * (Number(match[2]) + Number(match[3] ?? 0) / 60)
}

function getLocalDateParts(date, timezone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
  }
}

function localDateToInstant(year, month, day, minutes, timezone) {
  const rough = new Date(Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60))
  const offset = getTimezoneOffsetHours(rough, timezone)
  return new Date(rough.getTime() - offset * 3600000)
}

function solveKepler(meanAnomaly, eccentricity) {
  let eccentricAnomaly = meanAnomaly
  for (let i = 0; i < 8; i += 1) {
    eccentricAnomaly -= (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentricAnomaly))
  }
  return eccentricAnomaly
}

function moonEcliptic(date) {
  const days = date.getTime() / 86400000 - 2451543.5
  const N = degToRad(normalizeDegrees(125.1228 - 0.0529538083 * days))
  const i = degToRad(5.1454)
  const w = degToRad(normalizeDegrees(318.0634 + 0.1643573223 * days))
  const a = 60.2666
  const e = 0.0549
  const M = degToRad(normalizeDegrees(115.3654 + 13.0649929509 * days))
  const E = solveKepler(M, e)
  const xv = a * (Math.cos(E) - e)
  const yv = a * (Math.sqrt(1 - e * e) * Math.sin(E))
  const v = Math.atan2(yv, xv)
  const r = Math.sqrt(xv * xv + yv * yv)

  let xh = r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(i))
  let yh = r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(i))
  let zh = r * Math.sin(v + w) * Math.sin(i)

  const Ms = degToRad(normalizeDegrees(356.0470 + 0.9856002585 * days))
  const ws = degToRad(normalizeDegrees(282.9404 + 4.70935e-5 * days))
  const Ls = normalizeDegrees(radToDeg(Ms + ws))
  const Mm = normalizeDegrees(radToDeg(M))
  const Lm = normalizeDegrees(radToDeg(N + w + M))
  const D = normalizeDegrees(Lm - Ls)
  const F = normalizeDegrees(Lm - radToDeg(N))

  const lon = normalizeDegrees(radToDeg(Math.atan2(yh, xh))
    - 1.274 * Math.sin(degToRad(Mm - 2 * D))
    + 0.658 * Math.sin(degToRad(2 * D))
    - 0.186 * Math.sin(Ms)
    - 0.059 * Math.sin(degToRad(2 * Mm - 2 * D))
    - 0.057 * Math.sin(degToRad(Mm - 2 * D + Ms))
    + 0.053 * Math.sin(degToRad(Mm + 2 * D))
    + 0.046 * Math.sin(degToRad(2 * D - Ms))
    + 0.041 * Math.sin(degToRad(Mm - Ms))
    - 0.035 * Math.sin(degToRad(D))
    - 0.031 * Math.sin(degToRad(Mm + Ms))
    - 0.015 * Math.sin(degToRad(2 * F - 2 * D))
    + 0.011 * Math.sin(degToRad(Mm - 4 * D)))

  const lat = radToDeg(Math.atan2(zh, Math.sqrt(xh * xh + yh * yh)))
    - 0.173 * Math.sin(degToRad(F - 2 * D))
    - 0.055 * Math.sin(degToRad(Mm - F - 2 * D))
    - 0.046 * Math.sin(degToRad(Mm + F - 2 * D))
    + 0.033 * Math.sin(degToRad(F + 2 * D))
    + 0.017 * Math.sin(degToRad(2 * Mm + F))

  const lonRad = degToRad(lon)
  const latRad = degToRad(lat)
  xh = r * Math.cos(latRad) * Math.cos(lonRad)
  yh = r * Math.cos(latRad) * Math.sin(lonRad)
  zh = r * Math.sin(latRad)
  return { xh, yh, zh, distance: r }
}

function horizontalPosition(date, latitude, longitude) {
  const ecliptic = moonEcliptic(date)
  const jd = date.getTime() / 86400000 + 2440587.5
  const d = jd - 2451545.0
  const obliquity = degToRad(23.4393 - 3.563e-7 * d)
  const x = ecliptic.xh
  const y = ecliptic.yh * Math.cos(obliquity) - ecliptic.zh * Math.sin(obliquity)
  const z = ecliptic.yh * Math.sin(obliquity) + ecliptic.zh * Math.cos(obliquity)
  const rightAscension = Math.atan2(y, x)
  const declination = Math.atan2(z, Math.sqrt(x * x + y * y))
  const sidereal = degToRad(normalizeDegrees(280.46061837 + 360.98564736629 * d + longitude))
  const hourAngle = sidereal - rightAscension
  const latitudeRad = degToRad(latitude)
  const sinAltitude = Math.sin(latitudeRad) * Math.sin(declination) +
    Math.cos(latitudeRad) * Math.cos(declination) * Math.cos(hourAngle)
  let altitude = radToDeg(Math.asin(Math.min(1, Math.max(-1, sinAltitude))))
  const azimuth = normalizeDegrees(radToDeg(Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(latitudeRad) - Math.tan(declination) * Math.cos(latitudeRad),
  )) + 180)

  if (altitude > -1 && altitude < 90) {
    altitude += 1.02 / (60 * Math.tan(degToRad(altitude + 10.3 / (altitude + 5.11))))
  }

  return {
    altitude: Number(altitude.toFixed(2)),
    azimuth: Number(azimuth.toFixed(2)),
    distance: Number((ecliptic.distance * 6378.14).toFixed(0)),
  }
}

function formatLocalTime(date, timezone) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

function buildMoonPath({ year, month, day, latitude, longitude, timezone }) {
  const points = []
  let previous = null
  let rise = null
  let set = null
  let transit = null
  let highest = -Infinity

  for (let minutes = 0; minutes <= 1440; minutes += 10) {
    const instant = localDateToInstant(year, month, day, minutes, timezone)
    const position = horizontalPosition(instant, latitude, longitude)
    const point = { time: formatLocalTime(instant, timezone), altitude: position.altitude, azimuth: position.azimuth, visible: position.altitude >= 0 }
    points.push(point)
    if (position.altitude > highest) {
      highest = position.altitude
      transit = point.time
    }
    if (previous && previous.altitude < 0 && position.altitude >= 0 && !rise) rise = point.time
    if (previous && previous.altitude >= 0 && position.altitude < 0 && !set) set = point.time
    previous = position
  }

  return { points, rise, set, transit }
}

export function getMoonData(context) {
  const date = context.time.instant
  const { latitude, longitude, timezone = 'Asia/Jakarta' } = context.location || {}
  const daysSinceReference = (date.getTime() - REFERENCE_NEW_MOON) / 86400000
  const age = normalizeAge(daysSinceReference)
  const phase = getPhase(age)
  const illumination = (1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2 * 100

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return {
      phase, age: Number(age.toFixed(2)), illumination: Math.round(illumination), nextFullMoon: getNextFullMoon(date),
      altitude: null, azimuth: null, distance: null, rise: null, transit: null, set: null, path: [],
      effectiveDate: date, boundary: 'LOCATION_DEPENDENT', details: [],
      meta: { engine: 'Moon', phase: 'FOUNDATION', calculation: 'LUNAR_HORIZONTAL_POSITION', available: false },
    }
  }

  const current = horizontalPosition(date, latitude, longitude)
  const { year, month, day } = getLocalDateParts(date, timezone)
  const path = buildMoonPath({ year, month, day, latitude, longitude, timezone })

  return {
    phase, age: Number(age.toFixed(2)), illumination: Math.round(illumination), nextFullMoon: getNextFullMoon(date),
    altitude: current.altitude, azimuth: current.azimuth, distance: current.distance,
    rise: path.rise, transit: path.transit, set: path.set, path: path.points,
    effectiveDate: date, boundary: 'LOCATION_DEPENDENT',
    details: [
      { label: 'Moon Age', value: `${age.toFixed(1)} days` },
      { label: 'Illumination', value: `${Math.round(illumination)}%` },
      { label: 'Rise', value: path.rise ?? '—' },
      { label: 'Set', value: path.set ?? '—' },
    ],
    meta: { engine: 'Moon', phase: 'FOUNDATION', calculation: 'LUNAR_HORIZONTAL_POSITION', available: true },
  }
}
