export function getTideData(context) {
  const date = context.time.instant
  const location = context.location || {}

  const locationName =
    location.city ||
    location.name ||
    'Location not configured'

  return {
    status: 'Tide data requires local model',

    locationName,

    effectiveDate: date,

    boundary: 'LOCATION_DEPENDENT',

    details: [
      {
        label: 'Location',
        value: locationName,
      },
      {
        label: 'Status',
        value: 'Local tide model not configured',
      },
    ],

    meta: {
      engine: 'Tide',
      phase: 'FOUNDATION',
      calculation: 'LOCATION_DEPENDENT',
      configured: false,
    },
  }
}
