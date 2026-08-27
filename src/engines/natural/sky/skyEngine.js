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
    ],

    meta: {
      engine: 'Sky',
      phase: 'FOUNDATION',
      calculation: 'TIME_CONTEXT',
    },
  }
}
