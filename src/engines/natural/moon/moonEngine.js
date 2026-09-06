const SYNODIC_MONTH = 29.53058867
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0)

function normalizeAge(days) {
  const value = days % SYNODIC_MONTH
  return value < 0 ? value + SYNODIC_MONTH : value
}

function getNextFullMoon(date) {
  const daysSinceReference =
    (date.getTime() - REFERENCE_NEW_MOON) / 86400000

  const currentAge = normalizeAge(daysSinceReference)
  const fullMoonAge = SYNODIC_MONTH / 2

  let daysUntil = fullMoonAge - currentAge

  if (daysUntil <= 0) {
    daysUntil += SYNODIC_MONTH
  }

  const next = new Date(
    date.getTime() + daysUntil * 86400000
  )

  return next.toISOString().slice(0, 10)
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

export function getMoonData(context) {
  const date = context.time.instant

  const daysSinceReference =
    (date.getTime() - REFERENCE_NEW_MOON) / 86400000

  const age = normalizeAge(daysSinceReference)
  const phase = getPhase(age)
  const nextFullMoon = getNextFullMoon(date)

  const illumination =
    (1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2 * 100

  return {
    phase,
    age: Number(age.toFixed(2)),
    illumination: Math.round(illumination),
    nextFullMoon,
    effectiveDate: date,
    boundary: 'MIDNIGHT',

    details: [
      {
        label: 'Moon Age',
        value: `${age.toFixed(1)} days`,
      },
      {
        label: 'Illumination',
        value: `${Math.round(illumination)}%`,
      },
    ],

    meta: {
      engine: 'Moon',
      phase: 'FOUNDATION',
      calculation: 'SYNODIC_CYCLE',
    },
  }
}
