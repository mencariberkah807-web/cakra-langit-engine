const DAY_MS = 24 * 60 * 60 * 1000

function getDayOfYear(date) {
  const year = date.getFullYear()

  const start = new Date(year, 0, 1)
  const current = new Date(
    year,
    date.getMonth(),
    date.getDate()
  )

  return Math.floor(
    (current.getTime() - start.getTime()) / DAY_MS
  ) + 1
}

function getYearLength(year) {
  return (
    new Date(year, 1, 29).getMonth() === 1
      ? 366
      : 365
  )
}

export function getEarthSpaceData(context) {
  const date = context.time.instant

  const dayOfYear = getDayOfYear(date)
  const yearLength = getYearLength(date.getFullYear())

  const progress = Number(
    ((dayOfYear / yearLength) * 100).toFixed(2)
  )

  return {
    dayOfYear,
    yearLength,
    progress,
    day_of_year: dayOfYear,
    annual_pct: progress,

    effectiveDate: date,

    boundary: 'MIDNIGHT',

    details: [
      {
        label: 'Day of Year',
        value: `${dayOfYear} / ${yearLength}`,
      },
      {
        label: 'Annual Progress',
        value: `${progress}%`,
      },
    ],

    meta: {
      engine: 'Earth Space',
      phase: 'FOUNDATION',
      calculation: 'ANNUAL_CYCLE',
    },
  }
}
