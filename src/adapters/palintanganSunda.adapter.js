import { createStrategyResult } from './adapterContract.js'

export function adaptPalintanganSunda(context) {
  const result = context.apiData?.palintangan || null

  if (!result) {
    return createStrategyResult({
      id: 'palintangan-sunda',
      title: 'Palintangan Sunda',
      primary: '',
      secondary: '',
      details: [],
      detail: null,
      effectiveDate: null,
      boundary: 'ENGINE_SPECIFIC',
      events: [],
      meta: {
        status: 'UNAVAILABLE',
      },
    })
  }

  return createStrategyResult({
    id: 'palintangan-sunda',
    title: 'Palintangan Sunda',
    primary: result.calendar_context
      ? `${result.calendar_context.hari} ${result.calendar_context.pasaran}`
      : '',
    secondary: result.watek_patokan?.watek || '',
    details: [
      {
        label: 'Naktu Wedal',
        value: result.naktu?.wedal ?? '',
      },
      {
        label: 'Watek Patokan',
        value: result.watek_patokan?.watek || '',
      },
      {
        label: 'Status Hari',
        value: result.navigation?.status_hari || '',
      },
    ],
    detail: result,
    effectiveDate: result.date || null,
    boundary: 'ENGINE_SPECIFIC',
    events: [],
    meta: {
      source: result.source || {},
      status: 'SOURCE_COMPILED',
    },
  })
}
