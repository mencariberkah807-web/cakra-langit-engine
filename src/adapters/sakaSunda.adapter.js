import { createCalendarResult } from './adapterContract.js'

export function adaptSakaSunda(context) {
  const result = context.apiData?.calendars?.find(
    (calendar) => calendar.id === 'saka-sunda'
  )

  if (!result) {
    return createCalendarResult({
      id: 'saka-sunda',
      title: 'Saka Sunda',
      primary: '',
      secondary: '',
      details: [],
      effectiveDate: null,
      boundary: 'ENGINE_SPECIFIC',
      events: [],
      meta: {},
    })
  }

  return createCalendarResult({
    id: result.id,
    title: result.name,
    primary: result.headline,
    secondary: result.sub,
    details: (result.fields || []).map((field) => ({
      label: field.k,
      value: field.v,
    })),
    effectiveDate: result.effectiveDate,
    boundary: result.boundary,
    events: result.events || [],
    meta: result.meta || {},
  })
}
