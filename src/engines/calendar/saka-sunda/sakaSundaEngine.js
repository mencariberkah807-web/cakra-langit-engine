const MONTHS = [
  { name: 'Kasa', days: 30 },
  { name: 'Karo', days: 31 },
  { name: 'Katiga', days: 30 },
  { name: 'Kapat', days: 31 },
  { name: 'Kalima', days: 30 },
  { name: 'Kanem', days: 31 },
  { name: 'Kapitu', days: 30 },
  { name: 'Kawalu', days: 31 },
  { name: 'Kasanga', days: 30 },
  { name: 'Kadasa', days: 31 },
  { name: 'Hapitlemah', days: 30 },
  { name: 'Hapitkayu', days: 30 },
]

export const SAKA_SUNDA_ANCHOR = {
  year: 1934,
  month: 0,
  day: 1,
  gregorian: new Date(Date.UTC(2011, 11, 22)),
}

const DAY_MS = 24 * 60 * 60 * 1000

export function isWuntuYear(year) {
  if (year % 128 === 0) return false
  return year % 4 === 0
}

export function getYearType(year) {
  return isWuntuYear(year) ? 'WUNTU' : 'WASTU'
}

export function getYearLength(year) {
  return isWuntuYear(year) ? 366 : 365
}

export function getMonthLength(year, monthIndex) {
  if (monthIndex === 11) {
    return isWuntuYear(year) ? 31 : 30
  }

  return MONTHS[monthIndex].days
}

function getDayStartUTC(date) {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )
}

function getDayOffset(date) {
  return Math.round(
    (
      getDayStartUTC(date)
      - SAKA_SUNDA_ANCHOR.gregorian.getTime()
    ) / DAY_MS
  )
}

function getMonthAndDay(year, dayOfYear) {
  let remaining = dayOfYear

  for (let month = 0; month < MONTHS.length; month += 1) {
    const monthLength = getMonthLength(year, month)

    if (remaining < monthLength) {
      return {
        month,
        day: remaining + 1,
      }
    }

    remaining -= monthLength
  }

  throw new Error(
    `Invalid Saka Sunda day-of-year: ${dayOfYear}`
  )
}

function moveForward(offset) {
  let year = SAKA_SUNDA_ANCHOR.year
  let remaining = offset

  while (remaining >= getYearLength(year)) {
    remaining -= getYearLength(year)
    year += 1
  }

  const { month, day } = getMonthAndDay(year, remaining)

  return {
    year,
    month,
    day,
  }
}

function moveBackward(offset) {
  let year = SAKA_SUNDA_ANCHOR.year - 1
  let remaining = Math.abs(offset) - 1

  while (remaining >= getYearLength(year)) {
    remaining -= getYearLength(year)
    year -= 1
  }

  const dayOfYear =
    getYearLength(year) - 1 - remaining

  const { month, day } = getMonthAndDay(year, dayOfYear)

  return {
    year,
    month,
    day,
  }
}

export function getSakaSundaCalendar(context) {
  const offset = getDayOffset(context.time.instant)

  const result =
    offset >= 0
      ? moveForward(offset)
      : moveBackward(offset)

  return {
    ...result,
    monthName: MONTHS[result.month].name,
    yearType: getYearType(result.year),
    effectiveDate: context.time.instant,
    boundary: 'MIDNIGHT',
  }
}
