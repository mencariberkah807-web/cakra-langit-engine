function degToRad(value) {
  return (value * Math.PI) / 180
}

function radToDeg(value) {
  return (value * 180) / Math.PI
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360
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
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
  }
}

function getDayOfYear(year, month, day) {
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000)
}

function localDateToInstant(year, month, day, minutes, timezone) {
  const rough = new Date(Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60))
  const offset = getTimezoneOffsetHours(rough, timezone)
  return new Date(rough.getTime() - offset * 3600000)
}

function calculateSolarTime({ year, month, day, latitude, longitude, timezoneOffset, zenith, sunrise }) {
  const dayOfYear = getDayOfYear(year, month, day)
  const longitudeHour = longitude / 15
  const approximateTime = dayOfYear + ((sunrise ? 6 : 18) - longitudeHour) / 24
  const meanAnomaly = (0.9856 * approximateTime) - 3.289
  let trueLongitude = meanAnomaly + (1.916 * Math.sin(degToRad(meanAnomaly))) + (0.020 * Math.sin(degToRad(2 * meanAnomaly))) + 282.634
  trueLongitude = normalizeDegrees(trueLongitude)
  let rightAscension = normalizeDegrees(radToDeg(Math.atan(0.91764 * Math.tan(degToRad(trueLongitude)))))
  rightAscension += Math.floor(trueLongitude / 90) * 90 - Math.floor(rightAscension / 90) * 90
  rightAscension /= 15
  const sinDeclination = 0.39782 * Math.sin(degToRad(trueLongitude))
  const cosDeclination = Math.cos(Math.asin(sinDeclination))
  const cosHourAngle = (Math.cos(degToRad(zenith)) - sinDeclination * Math.sin(degToRad(latitude))) /
    (cosDeclination * Math.cos(degToRad(latitude)))
  if (cosHourAngle > 1 || cosHourAngle < -1) return null
  let hourAngle = sunrise ? 360 - radToDeg(Math.acos(cosHourAngle)) : radToDeg(Math.acos(cosHourAngle))
  hourAngle /= 15
  const localMeanTime = hourAngle + rightAscension - (0.06571 * approximateTime) - 6.622
  let utcTime = ((localMeanTime - longitudeHour) % 24 + 24) % 24
  let localTime = (utcTime + timezoneOffset) % 24
  const hour = Math.floor(localTime)
  const minute = Math.round((localTime - hour) * 60)
  return { hour: minute >= 60 ? (hour + 1) % 24 : hour, minute: minute >= 60 ? 0 : minute }
}

function calculateSolarPosition({ year, month, day, hour, minute, latitude, longitude, timezoneOffset }) {
  const dayOfYear = getDayOfYear(year, month, day)
  const localMinutes = hour * 60 + minute
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (localMinutes / 60 - 12) / 24)
  const equationOfTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma))
  const declination = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma) - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma)
  const trueSolarMinutes = localMinutes + equationOfTime + (4 * longitude) - (60 * timezoneOffset)
  const hourAngle = (trueSolarMinutes / 4) - 180
  const latitudeRad = degToRad(latitude)
  const declinationDeg = radToDeg(declination)
  const cosZenith = Math.sin(latitudeRad) * Math.sin(declination) + Math.cos(latitudeRad) * Math.cos(declination) * Math.cos(degToRad(hourAngle))
  const altitude = 90 - radToDeg(Math.acos(Math.min(1, Math.max(-1, cosZenith))))
  const azimuth = normalizeDegrees(radToDeg(Math.atan2(Math.sin(degToRad(hourAngle)), Math.cos(degToRad(hourAngle)) * Math.sin(latitudeRad) - Math.tan(declination) * Math.cos(latitudeRad))) + 180)
  return { altitude: Number(altitude.toFixed(2)), azimuth: Number(azimuth.toFixed(2)) }
}

function formatTime(value) {
  if (!value) return null
  return [String(value.hour).padStart(2, '0'), String(value.minute).padStart(2, '0')].join(':')
}

function calculateSolarNoon({ longitude, timezoneOffset }) {
  let localTime = 12 - (longitude / 15) + timezoneOffset
  localTime = ((localTime % 24) + 24) % 24
  const hour = Math.floor(localTime)
  const minute = Math.round((localTime - hour) * 60)
  return { hour: minute >= 60 ? (hour + 1) % 24 : hour, minute: minute >= 60 ? 0 : minute }
}

function calculateGoldenHour({ year, month, day, latitude, longitude, timezoneOffset }) {
  return calculateSolarTime({ year, month, day, latitude, longitude, timezoneOffset, zenith: 4, sunrise: false })
}

function formatLocalTime(date, timezone) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

function buildSunPath({ year, month, day, latitude, longitude, timezone }) {
  const points = []
  for (let minutes = 0; minutes <= 1440; minutes += 10) {
    const instant = localDateToInstant(year, month, day, minutes, timezone)
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(instant)
    const hour = Number(parts.find((part) => part.type === 'hour')?.value)
    const minute = Number(parts.find((part) => part.type === 'minute')?.value)
    const position = calculateSolarPosition({ year, month, day, hour, minute, latitude, longitude, timezoneOffset: getTimezoneOffsetHours(instant, timezone) })
    points.push({ time: formatLocalTime(instant, timezone), altitude: position.altitude, azimuth: position.azimuth, visible: position.altitude >= 0 })
  }
  return points
}

export function getSunData(context) {
  const { time, location, sunTime = '12:00' } = context
  const { latitude, longitude, timezone = 'Asia/Jakarta' } = location || {}

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return {
      sunrise: null, sunset: null, dawn: null, noon: null, golden_hour: null, dusk: null,
      altitude: null, azimuth: null, path: [], selectedTime: sunTime, effectiveDate: time?.instant ?? null,
      boundary: 'LOCATION_DEPENDENT', meta: { available: false, reason: 'LOCATION_COORDINATES_REQUIRED' },
    }
  }

  const { year, month, day } = getLocalDateParts(time.instant, timezone)
  const timezoneOffset = getTimezoneOffsetHours(time.instant, timezone)
  const sunrise = calculateSolarTime({ year, month, day, latitude, longitude, timezoneOffset, zenith: 90.833, sunrise: true })
  const sunset = calculateSolarTime({ year, month, day, latitude, longitude, timezoneOffset, zenith: 90.833, sunrise: false })
  const dawn = calculateSolarTime({ year, month, day, latitude, longitude, timezoneOffset, zenith: 96, sunrise: true })
  const dusk = calculateSolarTime({ year, month, day, latitude, longitude, timezoneOffset, zenith: 96, sunrise: false })
  const goldenHour = calculateGoldenHour({ year, month, day, latitude, longitude, timezoneOffset })
  const noon = calculateSolarNoon({ longitude, timezoneOffset })
  const [selectedHour, selectedMinute] = String(sunTime).split(':').map(Number)
  const position = calculateSolarPosition({
    year, month, day, hour: Number.isFinite(selectedHour) ? selectedHour : 12,
    minute: Number.isFinite(selectedMinute) ? selectedMinute : 0, latitude, longitude, timezoneOffset,
  })
  const path = buildSunPath({ year, month, day, latitude, longitude, timezone })

  return {
    sunrise: formatTime(sunrise), sunset: formatTime(sunset), dawn: formatTime(dawn), noon: formatTime(noon),
    golden_hour: formatTime(goldenHour), dusk: formatTime(dusk), altitude: position.altitude, azimuth: position.azimuth,
    path, selectedTime: sunTime, effectiveDate: time.instant, boundary: 'LOCATION_DEPENDENT',
    meta: { available: true, source: 'V1 solar engine harmonized to Cakra contract', calculation: 'SOLAR_POSITION' },
  }
}
