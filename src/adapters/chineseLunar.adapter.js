import { createCalendarResult } from './adapterContract.js'

export function adaptChineseLunar(context) {
  const result = context.apiData?.calendars?.find(
    (calendar) => calendar.id === 'chinese-lunar'
  )

  if (!result) {
    return createCalendarResult({
      id: 'chinese-lunar',
      title: 'Chinese Lunar',
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
