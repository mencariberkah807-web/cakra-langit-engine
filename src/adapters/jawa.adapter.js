import { createCalendarResult } from './adapterContract.js'

export function adaptJawaCalendar(context) {
  const result = context.apiData?.calendars?.find(
    (calendar) => calendar.id === 'jawa'
  )

  if (!result) {
    return createCalendarResult({
      id: 'jawa',
      title: 'Jawa',
      primary: '',
      secondary: '',
      details: [],
      detail: null,
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
    detail: result.detail || null,
    effectiveDate: result.effectiveDate,
    boundary: result.boundary,
    events: result.events || [],
    meta: result.meta || {},
  })
}
