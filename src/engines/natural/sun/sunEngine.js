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
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
    hour: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const value = parts.find(
    (part) => part.type === 'timeZoneName'
  )?.value

  if (!value || value === 'GMT') {
    return 0
  }

  const match = value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)

  if (!match) {
    return 0
  }

  const sign = match[1] === '+' ? 1 : -1
  const hours = Number(match[2])
  const minutes = Number(match[3] ?? 0)

  return sign * (hours + minutes / 60)
}

function getLocalDateParts(date, timezone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
  }
}

function getDayOfYear(year, month, day) {
  return Math.floor(
    (
      Date.UTC(year, month - 1, day) -
      Date.UTC(year, 0, 0)
    ) / 86400000
  )
}

function calculateSolarTime({
  year,
  month,
  day,
  latitude,
  longitude,
  timezoneOffset,
  zenith,
  sunrise,
}) {
  const dayOfYear = getDayOfYear(year, month, day)
  const longitudeHour = longitude / 15

  const approximateTime =
    dayOfYear +
    ((sunrise ? 6 : 18) - longitudeHour) / 24

  const meanAnomaly =
    (0.9856 * approximateTime) - 3.289

  let trueLongitude =
    meanAnomaly +
    (1.916 * Math.sin(degToRad(meanAnomaly))) +
    (0.020 * Math.sin(degToRad(2 * meanAnomaly))) +
    282.634

  trueLongitude = normalizeDegrees(trueLongitude)

  let rightAscension =
    radToDeg(
      Math.atan(
        0.91764 * Math.tan(degToRad(trueLongitude))
      )
    )

  rightAscension = normalizeDegrees(rightAscension)

  const longitudeQuadrant =
    Math.floor(trueLongitude / 90) * 90

  const rightAscensionQuadrant =
    Math.floor(rightAscension / 90) * 90

  rightAscension +=
    longitudeQuadrant -
    rightAscensionQuadrant

  rightAscension /= 15

  const sinDeclination =
    0.39782 *
    Math.sin(degToRad(trueLongitude))

  const cosDeclination =
    Math.cos(
      Math.asin(sinDeclination)
    )

  const cosHourAngle =
    (
      Math.cos(degToRad(zenith)) -
      (
        sinDeclination *
        Math.sin(degToRad(latitude))
      )
    ) /
    (
      cosDeclination *
      Math.cos(degToRad(latitude))
    )

  if (cosHourAngle > 1 || cosHourAngle < -1) {
    return null
  }

  let hourAngle = sunrise
    ? 360 - radToDeg(Math.acos(cosHourAngle))
    : radToDeg(Math.acos(cosHourAngle))

  hourAngle /= 15

  const localMeanTime =
    hourAngle +
    rightAscension -
    (0.06571 * approximateTime) -
    6.622

  let utcTime =
    localMeanTime -
    longitudeHour

  utcTime =
    ((utcTime % 24) + 24) % 24

  let localTime =
    utcTime +
    timezoneOffset

  localTime =
    ((localTime % 24) + 24) % 24

  const hour = Math.floor(localTime)

  const minute = Math.round(
    (localTime - hour) * 60
  )

  return {
    hour: minute >= 60
      ? (hour + 1) % 24
      : hour,
    minute: minute >= 60
      ? 0
      : minute,
  }
}

function formatTime(value) {
  if (!value) {
    return null
  }

  return [
    String(value.hour).padStart(2, '0'),
    String(value.minute).padStart(2, '0'),
  ].join(':')
}

function calculateSolarNoon({
  longitude,
  timezoneOffset,
}) {
  let localTime =
    12 -
    (longitude / 15) +
    timezoneOffset

  localTime =
    ((localTime % 24) + 24) % 24

  const hour = Math.floor(localTime)
  const minute = Math.round((localTime - hour) * 60)

  return {
    hour: minute >= 60
      ? (hour + 1) % 24
      : hour,
    minute: minute >= 60
      ? 0
      : minute,
  }
}

function calculateGoldenHour({
  year,
  month,
  day,
  latitude,
  longitude,
  timezoneOffset,
}) {
  return calculateSolarTime({
    year,
    month,
    day,
    latitude,
    longitude,
    timezoneOffset,
    zenith: 4,
    sunrise: false,
  })
}

export function getSunData(context) {
  const { time, location } = context

  const {
    latitude,
    longitude,
    timezone = 'Asia/Jakarta',
  } = location || {}

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return {
      sunrise: null,
      sunset: null,
      dawn: null,
      noon: null,
      golden_hour: null,
      dusk: null,
      effectiveDate: time?.instant ?? null,
      boundary: 'LOCATION_DEPENDENT',
      meta: {
        available: false,
        reason: 'LOCATION_COORDINATES_REQUIRED',
      },
    }
  }

  const {
    year,
    month,
    day,
  } = getLocalDateParts(
    time.instant,
    timezone
  )

  const timezoneOffset =
    getTimezoneOffsetHours(
      time.instant,
      timezone
    )

  const sunrise = calculateSolarTime({
    year,
    month,
    day,
    latitude,
    longitude,
    timezoneOffset,
    zenith: 90.833,
    sunrise: true,
  })

  const sunset = calculateSolarTime({
    year,
    month,
    day,
    latitude,
    longitude,
    timezoneOffset,
    zenith: 90.833,
    sunrise: false,
  })

  const dawn = calculateSolarTime({
    year,
    month,
    day,
    latitude,
    longitude,
    timezoneOffset,
    zenith: 96,
    sunrise: true,
  })

  const dusk = calculateSolarTime({
    year,
    month,
    day,
    latitude,
    longitude,
    timezoneOffset,
    zenith: 96,
    sunrise: false,
  })

  const goldenHour = calculateGoldenHour({
    year,
    month,
    day,
    latitude,
    longitude,
    timezoneOffset,
  })

  const noon = calculateSolarNoon({
    longitude,
    timezoneOffset,
  })

  return {
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
    dawn: formatTime(dawn),
    noon: formatTime(noon),
    golden_hour: formatTime(goldenHour),
    dusk: formatTime(dusk),
    effectiveDate: time.instant,
    boundary: 'LOCATION_DEPENDENT',
    meta: {
      available: true,
      source: 'V1 solar engine harmonized to Cakra contract',
    },
  }
}
