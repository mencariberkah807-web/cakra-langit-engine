const SYNODIC_MONTH = 29.530588853
const MOON_REFERENCE = new Date(Date.UTC(2000, 0, 6))

function getMoonIllumination(date) {
  const day = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  )

  const daysSinceReference =
    (day.getTime() - MOON_REFERENCE.getTime()) / 86400000

  const age =
    ((daysSinceReference - 0.28) % SYNODIC_MONTH + SYNODIC_MONTH) %
    SYNODIC_MONTH

  return Math.round(
    ((1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2) * 100
  )
}

export function getSkyData(context) {
  const date = context.time.instant
  const hour = date.getHours()

  let skyState = 'Daytime'

  if (hour < 5 || hour >= 18) {
    skyState = 'Night Sky'
  } else if (hour < 6) {
    skyState = 'Civil Twilight'
  } else if (hour >= 17) {
    skyState = 'Evening Twilight'
  }

  const illumination = getMoonIllumination(date)
  const bortle = 'Bortle 5'
  const moonlight = illumination >= 60 ? 'High' : 'Low'

  return {
    skyState,
    observationTime: date,
    effectiveDate: date,
    boundary: 'MIDNIGHT',
    details: [
      {
        label: 'Sky State',
        value: skyState,
      },
      {
        label: 'Observation',
        value: 'Context time',
      },
      {
        label: 'Bortle',
        value: bortle,
      },
      {
        label: 'Moonlight',
        value: moonlight,
      },
    ],
    context: skyState,
    bortle,
    moonlight,
    meta: {
      engine: 'Sky',
      phase: 'FOUNDATION',
      calculation: 'TIME_CONTEXT',
      moonIllumination: illumination,
    },
  }
}
