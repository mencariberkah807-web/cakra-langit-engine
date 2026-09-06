import { createCalendarResult } from './adapterContract.js'

export function adaptKalacakraCalendar(context) {
  const result = context.apiData?.calendars?.find(
    (calendar) => calendar.id === 'kalacakra'
  )

  if (!result) {
    return createCalendarResult({
      id: 'kalacakra',
      title: 'Kalacakra',
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
