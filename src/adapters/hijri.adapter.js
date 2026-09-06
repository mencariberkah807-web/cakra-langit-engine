import { createCalendarResult } from './adapterContract.js'

export function adaptHijri(context) {
  const result = context.apiData?.calendars?.find(
    (calendar) => calendar.id === 'hijri'
  )

  if (!result) {
    return createCalendarResult({
      id: 'hijri',
      title: 'Hijri',
      primary: '',
      secondary: '',
      details: [],
      effectiveDate: null,
      boundary: 'NO_BOUNDARY',
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
